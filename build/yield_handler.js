/****
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Aaron Trent
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 ****/
/**
 * Created by Aaron on 7/3/2015.
 */

'use strict';

exports.__esModule = true;
exports.isThenable = isThenable;
exports.isGenerator = isGenerator;
exports.isGeneratorFunction = isGeneratorFunction;
exports.toPromise = toPromise;
exports.addYieldHandler = addYieldHandler;

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {'default': obj};
}

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var Promise = _bluebird2.default;

var yieldHandlers = [];

function isThenable( obj ) {
    return obj && typeof obj.then === 'function';
}

var isPromise = isThenable;

exports.isPromise = isPromise;

function isGenerator( obj ) {
    return 'function' === typeof obj.next && 'function' === typeof obj.throw;
}

function isGeneratorFunction( obj ) {
    var constructor = obj.constructor;

    if( !constructor ) {
        return false;
    } else if( 'GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName ) {
        return true;
    } else {
        var prototype = constructor.prototype;

        return 'function' === typeof prototype.next && 'function' === typeof prototype.throw;
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
    var keys = Object.keys( obj );
    var length = keys.length | 0;

    var results = new obj.constructor();
    var promises = new Array( length );

    var i = -1;

    while( ++i < length ) {
        var key = keys[i];

        results[key] = void 0;

        promises[i] = toPromise.call( this, obj[key] );
    }

    return Promise.all( promises ).then( function( res ) {
        var i = res.length | 0;

        while( --i >= 0 ) {
            results[keys[i]] = res[i];
        }

        return results;
    } );
}

function resolveGenerator( gen ) {
    return new Promise( function( resolve, reject ) {
        function next( ret ) {
            if( ret.done ) {
                resolve( ret.value );
            } else {
                var value = ret.value;

                if( value && typeof value.then === 'function' ) {
                    value.then( onFulfilled, onRejected );
                } else {
                    value = toPromise.call( this, value );

                    if( value && typeof value.then === 'function' ) {
                        value.then( onFulfilled, onRejected );
                    } else {
                        onRejected( new TypeError( 'You may only yield a function, promise, generator, array, or object, but the following object was passed: "'
                                                   + ret.value + '"' ) );
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

var arrayFrom = typeof Array.from === 'function' ? Array.from : function( iter ) {
    var results = [];
    var ret = iter.next();

    while( !ret.done ) {
        results.push( ret.value );

        ret = iter.next();
    }

    return results;
};

function resolveIterable( iter ) {
    var _this = this;

    return new Promise( function( resolve, reject ) {
        var results = arrayFrom( iter );

        arrayToPromise.call( _this, results ).then( resolve, reject );
    } );
}

function arrayToPromise( value ) {
    var length = value.length | 0;

    var results = new Array( length );

    while( --length >= 0 ) {
        results[length] = toPromise.call( this, value[length] );
    }

    return Promise.all( results );
}

function thunkToPromise( value ) {
    var _this2 = this;

    return new Promise( function( resolve, reject ) {
        try {
            value.call( _this2, function( err, res ) {
                if( err ) {
                    reject( err );
                } else {
                    var _length = arguments.length | 0;

                    if( _length > 2 ) {
                        res = new Array( --_length );

                        for( var i = 0; i < _length; ) {
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

function toPromise( value ) {
    if( typeof value === 'object' && !!value ) {
        if( typeof value.then === 'function' ) {
            return value;
        } else if( Array.isArray( value ) ) {
            return arrayToPromise.call( this, value );
        } else if( 'function' === typeof value.next ) {
            if( 'function' === typeof value.throw ) {
                return resolveGenerator.call( this, value );
            } else {
                return resolveIterable.call( this, value );
            }
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

    for( var i = 0, _length2 = yieldHandlers.length | 0; i < _length2; ++i ) {
        var res = yieldHandlers[i].call( this, value );

        if( res && typeof res.then === 'function' ) {
            return res;
        }
    }

    return value;
}

function addYieldHandler( handler ) {
    if( typeof handler !== 'function' ) {
        throw new TypeError( 'yield handler is not a function' );
    } else {
        yieldHandlers.push( handler );
    }
}

exports.default = {
    addYieldHandler:     addYieldHandler,
    isThenable:          isThenable,
    isPromise:           isPromise,
    isGenerator:         isGenerator,
    isGeneratorFunction: isGeneratorFunction,
    toPromise:           toPromise
};
