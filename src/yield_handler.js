/**
 * Created by Aaron on 7/3/2015.
 */

import Promise from 'bluebird';

let yieldHandlers = [];

export function isThenable( obj ) {
    return obj && typeof obj.then === 'function';
}

export let isPromise = isThenable;

export function isGenerator( obj ) {
    return 'function' === typeof obj.next && 'function' === typeof obj.throw;
}

export function isGeneratorFunction( obj ) {
    if( !obj.constructor ) {
        return false;

    } else if( 'GeneratorFunction' === obj.constructor.name ||
               'GeneratorFunction' === obj.constructor.displayName ) {
        return true;

    } else {
        return isGenerator( obj.constructor.prototype );
    }
}

function isNativeObject( obj ) {
    if( !obj.constructor ) {
        return true;

    } else if( 'Object' === obj.constructor.name ||
               'Object' === obj.constructor.displayName ) {
        return true;

    } else {
        let p = obj.constructor.prototype;

        return p && !!(!p.constructor || 'Object' === p.constructor.name);
    }
}

function objectToPromise( obj ) {
    let results = new obj.constructor();
    let keys = Object.keys( obj );
    let promises = new Array( keys.length );
    let current = 0;

    for( let key of keys ) {
        let promise = toPromise.call( this, obj[key] );

        if( isThenable( promise ) ) {
            results[key] = void 0;

            promises[current++] = promise.then( res => results[key] = res );

        } else {
            results[key] = obj[key];
        }
    }

    return Promise.all( promises ).return( results );
}

function resolveGenerator( gen ) {
    return new Promise( ( resolve, reject ) => {
        function next( ret ) {
            if( ret.done ) {
                return resolve( ret.value );

            } else {
                let value = toPromise.call( this, ret.value );

                if( isThenable( value ) ) {
                    return value.then( onFulfilled, onRejected );

                } else {
                    return onRejected( new TypeError( `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${ret.value}"` ) );
                }
            }
        }

        function onFulfilled( res ) {
            try {
                next( gen.next( res ) );

            } catch( e ) {
                return reject( e );
            }
        }

        function onRejected( err ) {
            try {
                next( gen.throw( err ) );

            } catch( e ) {
                return reject( e );
            }
        }

        onFulfilled();
    } );
}

function toPromise( value ) {
    if( isThenable( value ) ) {
        return value;

    } else if( Array.isArray( value ) ) {
        return Promise.all( value.map( toPromise, this ) );

    } else if( value && typeof value === 'object' ) {
        if( isGenerator( value ) ) {
            return resolveGenerator.call( this, value );

        } else if( isNativeObject( value ) ) {
            return objectToPromise.call( this, value );

        } else {
            for( let handler of yieldHandlers ) {
                let res = handler.call( this, value );

                if( isThenable( res ) ) {
                    return res;
                }
            }
        }

    } else if( typeof value === 'function' ) {
        if( isGeneratorFunction( value ) ) {
            return Promise.coroutine( value ).call( this );

        } else {
            //Thunks
            return new Promise( ( resolve, reject ) => {
                try {
                    value.call( this, ( err, ...res ) => {
                        if( err ) {
                            reject( err );

                        } else if( res.length > 1 ) {
                            resolve( res );

                        } else {
                            resolve( res[0] );
                        }
                    } );

                } catch( err ) {
                    reject( err );
                }
            } );
        }

    } else if( yieldHandlers.length > 0 ) {
        for( let handler of yieldHandlers ) {
            let res = handler.call( this, value );

            if( isThenable( res ) ) {
                return res;
            }
        }
    }

    return value;
}

export function addYieldHandler( handler ) {
    if( typeof handler !== 'function' ) {
        throw new TypeError( 'yield handler is not a function' );

    } else {
        yieldHandlers.push( handler );
    }
}

let addedYieldHandler = false;

if( !addedYieldHandler ) {
    Promise.coroutine.addYieldHandler( function( value ) {
        try {
            let res = toPromise.call( this, value );

            if( !isThenable( res ) ) {
                throw new TypeError( `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${value}"` );
            }

            return res;

        } catch( err ) {
            return Promise.reject( err );
        }
    } );

    addedYieldHandler = true;
}

export default {
    addYieldHandler,
    isThenable,
    isPromise,
    isGenerator,
    isGeneratorFunction
};
