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

function thunkToPromise( value ) {
    return new Promise( ( resolve, reject ) => {
        try {
            value.call( this, function( err, res ) {
                if( err ) {
                    reject( err );

                } else {
                    let length = arguments.length | 0;

                    if( length > 2 ) {
                        res = new Array( --length );

                        for( let i = 0; i < length; ) {
                            res[i] = arguments[++i]; //It's a good thing this isn't undefined behavior in JavaScript
                        }
                    }

                    resolve( res );
                }
            } );

        } catch( err ) {
            reject( err );
        }
    } );
}

function streamToPromise( stream ) {
    let {readable, writable, encoding} = stream;

    if( readable && !writable ) {
        let parts = [];

        //special behavior for Node streams.
        encoding = encoding || (stream._readableState && stream._readableState.encoding);

        return new Promise( ( resolve, reject ) => {
            function onData( data ) {
                if( typeof Buffer === 'function' ) {
                    data = Buffer.isBuffer( data ) ? data : new Buffer( data );

                } else if( typeof data !== 'string' ) {
                    return reject( new TypeError( `Non-string type read from stream: ${data}` ) );
                }

                parts.push( data );
            }

            function onEnd( err ) {
                cleanup();

                if( err ) {
                    reject( err );

                } else if( typeof Buffer === 'function' ) {
                    if( typeof encoding === 'string' ) {
                        resolve( Buffer.concat( parts ).toString( encoding ) );

                    } else {
                        resolve( Buffer.concat( parts ) );
                    }

                } else {
                    resolve( parts.join( '' ) );
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
                resolve( ...args );
            }

            function onError( err ) {
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

        } else if( (value.readable || value.writable)
                   && typeof value.addListener === 'function'
                   && typeof value.removeListener === 'function' ) {
            return streamToPromise.call( this, value );

        } else if( Object === value.constructor ) {
            return objectToPromise.call( this, value );
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

export default {
    addYieldHandler,
    isThenable,
    isPromise,
    isGenerator,
    isGeneratorFunction,
    toPromise
};
