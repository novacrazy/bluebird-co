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

function objectToPromise( obj ) {
    let keys = Object.keys( obj );
    let length = keys.length | 0;

    let result = new obj.constructor();
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

                if( value && typeof value.then === 'function' ) {
                    value.then( onFulfilled, onRejected );

                    return null;

                } else {
                    value = toPromise.call( this, value );

                    if( value && typeof value.then === 'function' ) {
                        value.then( onFulfilled, onRejected );

                        return null;

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

function thunkToPromiseDefer( value ) {
    /*
     * NOTE: I know this is technically deprecated, but it's just so much faster than using the constructor and another
     * closure. Plus it goes around a lot of Bluebird's internals without losing much functionality.
     *
     * Since all errors are taken care of, I'd say it's safe enough.
     * */

    let p = Promise.defer();

    try {
        value.call( this, function( err ) {
            if( err ) {
                p.reject( err );

            } else {
                p.resolve( processThunkArgs( arguments ) );
            }
        } );

    } catch( err ) {
        p.reject( err );
    }

    return p.promise;
}

function thunkToPromiseConstructor( value ) {
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

//Just in case it's fully removed in the future, keep the old version that uses the constructor around.
const thunkToPromise = typeof Promise.defer === 'function' ? thunkToPromiseDefer : thunkToPromiseConstructor;

function isReadableStream( stream ) {
    return stream.readable
           || typeof stream.read === 'function'
           || typeof stream._read === 'function'
           || typeof stream.pipe === 'function'
           || typeof stream._transform === 'function';
}

function isWritableStream( stream ) {
    return stream.writable
           || typeof stream.write === 'function'
           || typeof stream._write === 'function';
}

function streamToPromise( stream, readable, writable ) {
    let {encoding, objectMode} = stream;

    if( readable ) {
        let parts = [];

        //special behavior for Node streams.
        encoding = encoding || (stream._readableState && stream._readableState.encoding);

        return new Promise( ( resolve, reject ) => {
            function onData( data ) {
                if( objectMode || (typeof data !== 'string' && (hasBuffer && !Buffer.isBuffer( data ))) ) {
                    objectMode = true;

                    data = toPromise.call( this, data );
                }

                parts.push( data );
            }

            function onEnd( err ) {
                cleanup();

                if( err ) {
                    reject( err );

                } else {
                    Promise.all( parts ).then( results => {
                        if( hasBuffer && !objectMode ) {
                            let length = results.length | 0;

                            if( typeof encoding === 'string' ) {
                                while( --length >= 0 ) {
                                    let result = results[length];

                                    if( Buffer.isBuffer( result ) ) {
                                        results[length] = result.toString( encoding );
                                    }
                                }

                                resolve( results.join( '' ) );

                            } else {
                                while( --length >= 0 ) {
                                    let result = results[length];

                                    if( !Buffer.isBuffer( result ) ) {
                                        results[length] = new Buffer( result );
                                    }
                                }

                                resolve( Buffer.concat( results ) );
                            }

                        } else if( objectMode ) {
                            resolve( results );

                        } else {
                            resolve( results.join( '' ) );
                        }
                    } );
                }
            }

            function onClose() {
                cleanup();
                resolve( void 0 );
            }

            function cleanup() {
                stream.removeListener( 'data', onData );
                stream.removeListener( 'end', onEnd );
                stream.removeListener( 'error', onEnd );
                stream.removeListener( 'close', onClose );
            }

            stream.addListener( 'data', onData );
            stream.addListener( 'end', onEnd );
            stream.addListener( 'error', onEnd );
            stream.addListener( 'close', onClose );
        } );

    } else {
        return new Promise( ( resolve, reject ) => {
            function onFinish( ...args ) {
                cleanup();
                resolve( ...args );
            }

            function onError( err ) {
                cleanup();
                reject( err );
            }

            function cleanup() {
                stream.removeListener( 'finish', onFinish );
                stream.removeListener( 'error', onError );
            }

            stream.addListener( 'finish', onFinish );
            stream.addListener( 'error', onError );
        } );
    }
}

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
            if( typeof value.addListener === 'function' && typeof value.removeListener === 'function' ) {
                let readable = isReadableStream( value );
                let writable = isWritableStream( value );

                if( readable || writable ) {
                    return streamToPromise.call( this, value, readable, writable );
                }
            }

            if( Object === value.constructor ) {
                return objectToPromise.call( this, value );
            }
        }

    } else if( typeof value === 'function' ) {
        if( isGeneratorFunction( value ) ) {
            return Promise.coroutine( value ).call( this );

        } else {
            return thunkToPromise.call( this, value );
        }
    }

    for( let i = 0, length = yieldHandlers.length | 0; i < length; ++i ) {
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

export function coroutine( fn ) {
    return Promise.coroutine( fn );
}

export default {
    addYieldHandler,
    isThenable,
    isPromise,
    isGenerator,
    isGeneratorFunction,
    toPromise,
    coroutine
};
