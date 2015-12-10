/**
 * Created by Aaron on 7/3/2015.
 */

import Promise from 'bluebird';

export function isThenable( obj ) {
    return obj && typeof obj.then === 'function';
}

export let isPromise = isThenable;

let hasBuffer = typeof Buffer === 'function';

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

function objectToPromise( obj, constructor ) {
    let keys = Object.keys( obj );
    let length = keys.length | 0;

    let result = new constructor();
    let values = new Array( length );

    let i = -1;

    while( ++i < length ) {
        let key = keys[i];

        result[key] = void 0;

        values[i] = toPromise.call( this, obj[key] );
    }

    return Promise.all( values ).then( res => {
        let i = res.length | 0;

        while( --i >= 0 ) {
            result[keys[i]] = res[i];
        }

        return result;
    } );
}

function resolveGenerator( gen ) {
    return new Promise( ( resolve, reject ) => {
        function next( ret ) {
            if( ret.done ) {
                resolve( ret.value );

            } else {
                let value = ret.value;

                if( isThenable( value ) ) {
                    value.then( onFulfilled, onRejected );

                    return null;

                } else {
                    value = toPromise.call( this, value );

                    if( isThenable( value ) ) {
                        value.then( onFulfilled, onRejected );

                        return null;

                    } else {
                        onRejected(
                            new TypeError( `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${ret.value}"` ) );
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

            return null;
        }

        function onRejected( err ) {
            try {
                next( gen.throw( err ) );

            } catch( e ) {
                reject( e );
            }

            return null;
        }

        onFulfilled();
    } );
}

function arrayFromIterable( iter ) {
    let results = [];
    let ret = iter.next();

    while( !ret.done ) {
        results.push( ret.value );

        ret = iter.next();
    }

    return results;
}

let arrayFrom = typeof Array.from === 'function' ? Array.from : arrayFromIterable;

function arrayToPromise( value ) {
    let length = value.length | 0;

    let results = new Array( length );

    while( --length >= 0 ) {
        results[length] = toPromise.call( this, value[length] );
    }

    return Promise.all( results );
}

//This is separated out so it can be optimized independently to the calling function.
function processThunkArgs( args ) {
    let length = args.length | 0;

    if( length >= 3 ) {
        let res = new Array( --length );

        for( let i = 0; i < length; ) {
            res[i] = args[++i]; //It's a good thing this isn't undefined behavior in JavaScript
        }

        return res;
    }

    return args[1];
}

function thunkToPromise( value ) {
    return new Promise( ( resolve, reject ) => {
        try {
            value.call( this, function( err ) {
                if( err ) {
                    reject( err );

                } else {
                    resolve( processThunkArgs( arguments ) );
                }
            } );

        } catch( err ) {
            reject( err );
        }
    } )
}

toPromise.yieldHandlers = [];

export function toPromise( value ) {
    if( typeof value === 'object' && !!value ) {
        if( typeof value.then === 'function' ) {
            return value;

        } else if( Array.isArray( value ) ) {
            return arrayToPromise.call( this, value );

        } else if( 'function' === typeof value.next ) {
            if( 'function' === typeof value.throw ) {
                return resolveGenerator.call( this, value );

            } else {
                return arrayToPromise.call( this, arrayFrom( value ) );
            }

        } else {
            /*
             * If there is no constructor, default to Object, because no constructor means it was
             * created in weird circumstances.
             * */

            const {constructor = Object} = value;

            /*
             * This is really annoying, as there is no possible way to determine whether `value` is an instance of
             * an Object, or is a class that extends Object, given Babel 6. It seems possible in Babel 5.
             * I'm not sure if this was an intentional change, but for the sake of forward compatibility, this will
             * consider anything that also inherits from Object as an object.
             * */

            if( constructor === Object || Object.isPrototypeOf( constructor ) ) {
                return objectToPromise.call( this, value, constructor );
            }
        }

    } else if( typeof value === 'function' ) {
        if( isGeneratorFunction( value ) ) {
            return Promise.coroutine( value ).call( this );

        } else {
            return thunkToPromise.call( this, value );
        }
    }

    /*
     * Custom yield handlers allow bluebird-co to be extended similarly to bluebird yield handlers, but have the
     * added benefit of working with all the other bluebird-co yield handlers automatically.
     * */
    for( let handler of toPromise.yieldHandlers ) {
        let res = handler.call( this, value );

        if( isThenable( res ) ) {
            return res;
        }
    }

    return value;
}

export function addYieldHandler( handler ) {
    if( typeof handler !== 'function' ) {
        throw new TypeError( 'yield handler is not a function' );

    } else {
        toPromise.yieldHandlers.push( handler );
    }
}

export function coroutine( fn ) {
    return Promise.coroutine( fn );
}

export const wrap = coroutine;

export default {
    addYieldHandler,
    isThenable,
    isPromise,
    isGenerator,
    isGeneratorFunction,
    toPromise,
    coroutine,
    wrap
};
