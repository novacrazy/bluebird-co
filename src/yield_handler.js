/**
 * Created by Aaron on 7/3/2015.
 */

import Promise from 'bluebird';

let yieldHandlers = [];

export function isThenable( obj ) {
    return obj !== void 0 && obj !== null && (obj instanceof Promise || typeof obj.then === 'function');
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

class YieldException extends TypeError {
}

function objectToPromise( obj ) {
    let results = new obj.constructor();
    let keys = Object.keys( obj );
    let promises = new Array( keys.length );
    let current = 0;

    let toPromiseThis = toPromise.bind( this );

    for( let key of keys ) {
        let promise = toPromiseThis( obj[key] );

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

        //Just in case
        if( typeof gen === 'function' ) {
            gen = gen();
        }

        if( !gen || !isGenerator( gen ) ) {
            return Promise.resolve( gen );

        } else {
            let toPromiseThis = toPromise.bind( this );

            let next = ret => {
                if( ret.done ) {
                    return resolve( ret.value );

                } else {
                    try {
                        let value = toPromiseThis( ret.value, true );

                        if( isThenable( value ) ) {
                            return value.then( onFulfilled ).catch( onRejected );

                        } else {
                            let err = new TypeError( `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${ret.value}"` );

                            return onRejected( err );
                        }

                    } catch( err ) {
                        return onRejected( err );
                    }
                }
            };

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
        }
    } );
}

function toPromise( value, strict ) {
    if( isThenable( value ) ) {
        return value;

    } else if( Array.isArray( value ) ) {
        let toPromiseThis = toPromise.bind( this );

        return Promise.all( value.map( val => toPromiseThis( val ) ) );

    } else if( typeof value === 'object' && value !== null ) {
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

    if( strict ) {
        throw new YieldException( `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${value}"` );

    } else {
        return Promise.resolve( value );
    }
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
            return toPromise.call( this, value, true );

        } catch( err ) {
            if( err instanceof YieldException ) {
                return void 0;

            } else {
                return Promise.reject( err );
            }
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
