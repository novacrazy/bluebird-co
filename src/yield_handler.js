/**
 * Created by Aaron on 7/3/2015.
 */

import Bluebird from 'bluebird';

let Promise = Bluebird;

let yieldHandlers = [];

export function isThenable( obj ) {
    return obj && typeof obj.then === 'function';
}

export let isPromise = isThenable;

export function isGenerator( obj ) {
    return 'function' === typeof obj.next && 'function' === typeof obj.throw;
}

export function isGeneratorFunction( obj ) {
    let constructor = obj.constructor;

    if( !constructor ) {
        return false;

    } else if( 'GeneratorFunction' === constructor.name ||
               'GeneratorFunction' === constructor.displayName ) {
        return true;

    } else {
        let prototype = constructor.prototype;

        return 'function' === typeof prototype.next &&
               'function' === typeof prototype.throw;
    }
}

/*
 * This is a deviation from tj/co because bluebird supports more.
 *
 * Basically, bluebird's Promise.all can take an array of BOTH values and promises, so I said screw the closure that
 * required binding local variables every iteration of this loop, and went with a pure array approach.
 *
 * */
function objectToPromise( obj ) {
    let keys = Object.keys( obj );
    let length = keys.length;

    let results = new obj.constructor();
    let promises = new Array( length );

    let i = -1;

    while( ++i < length ) {
        let key = keys[i];

        results[key] = void 0;

        promises[i] = toPromise.call( this, obj[key] );
    }

    return Promise.all( promises ).then( res => {
        let i = -1;

        while( ++i < length ) {
            results[keys[i]] = res[i];
        }

        return results;
    } );
}

function resolveGenerator( gen ) {
    return new Promise( ( resolve, reject ) => {
        function next( ret ) {
            if( ret.done ) {
                resolve( ret.value );

            } else {
                let value = ret.value;

                if( value && typeof value.then === 'function' ) {
                    value.then( onFulfilled, onRejected );

                } else {
                    value = toPromise.call( this, value );

                    if( value && typeof value.then === 'function' ) {
                        value.then( onFulfilled, onRejected );

                    } else {
                        onRejected( new TypeError( `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${ret.value}"` ) );
                    }
                }
            }
        }

        function onFulfilled( res ) {
            try {
                next( gen.next( res ) );

            } catch( e ) {
                reject( e );
            }
        }

        function onRejected( err ) {
            try {
                next( gen.throw( err ) );

            } catch( e ) {
                reject( e );
            }
        }

        onFulfilled();
    } );
}

function arrayToPromise( value ) {
    let length = value.length;

    let results = new Array( length );
    let i = -1;

    while( ++i < length ) {
        results[i] = toPromise.call( this, value[i] );
    }

    return Promise.all( results );
}

function thunkToPromise( value ) {
    return new Promise( ( resolve, reject ) => {
        try {
            value.call( this, function( err ) {
                if( err ) {
                    reject( err );

                } else if( arguments.length > 2 ) {
                    let length = arguments.length - 1;
                    let res = new Array( length );
                    let i = -1;

                    while( ++i < length ) {
                        res[i] = arguments[i + 1];
                    }

                    resolve( res );

                } else {
                    resolve( arguments[1] );
                }
            } );

        } catch( err ) {
            reject( err );
        }
    } );
}

function toPromise( value ) {
    if( typeof value === 'function' ) {
        if( isGeneratorFunction( value ) ) {
            return Promise.coroutine( value ).call( this );

        } else {
            return thunkToPromise.call( this, value );
        }

    } else if( value && typeof value === 'object' ) {
        if( typeof value.then === 'function' ) {
            return value;

        } else if( Array.isArray( value ) ) {
            return arrayToPromise.call( this, value );

        } else if( 'function' === typeof value.next && 'function' === typeof value.throw ) {
            return resolveGenerator.call( this, value );

        } else if( Object === value.constructor ) {
            return objectToPromise.call( this, value );
        }
    }

    let i = -1;
    let length = yieldHandlers.length;

    while( ++i < length ) {
        let res = yieldHandlers[i].call( this, value );

        if( res && typeof res.then === 'function' ) {
            return res;
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
    Promise.coroutine.addYieldHandler( toPromise );

    addedYieldHandler = true;
}

export default {
    addYieldHandler,
    isThenable,
    isPromise,
    isGenerator,
    isGeneratorFunction
};
