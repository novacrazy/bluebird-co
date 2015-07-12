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
    if( !obj.constructor ) {
        return false;
    } else if( 'GeneratorFunction' === obj.constructor.name || 'GeneratorFunction' === obj.constructor.displayName ) {
        return true;
    } else {
        return isGenerator( obj.constructor.prototype );
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
    var length = keys.length;

    var results = new obj.constructor();
    var promises = new Array( length );

    var i = -1;

    while( ++i < length ) {
        var key = keys[i];

        results[key] = void 0;

        promises[i] = toPromise.call( this, obj[key] );
    }

    return Promise.all( promises ).then( function( res ) {
        var i = -1;

        while( ++i < length ) {
            results[keys[i]] = res[i];
        }

        return results;
    } );
}

function resolveGenerator( gen ) {
    return new Promise( function( resolve, reject ) {
        function next( ret ) {
            if( ret.done ) {
                return resolve( ret.value );
            } else {
                var value = toPromise.call( this, ret.value );

                if( isThenable( value ) ) {
                    return value.then( onFulfilled, onRejected );
                } else {
                    return onRejected( new TypeError( 'You may only yield a function, promise, generator, array, or object, but the following object was passed: "'
                                                      + ret.value + '"' ) );
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

function arrayToPromise( value ) {
    var length = value.length;

    var results = new Array( length );
    var i = -1;

    while( ++i < length ) {
        results[i] = toPromise.call( this, value[i] );
    }

    return Promise.all( results );
}

function thunkToPromise( value ) {
    var _this = this;

    return new Promise( function( resolve, reject ) {
        try {
            value.call( _this, function( err ) {
                if( err ) {
                    reject( err );
                } else if( arguments.length > 2 ) {
                    var _length = arguments.length - 1;
                    var res = new Array( _length );
                    var i = -1;

                    while( ++i < _length ) {
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
    switch( typeof value ) {
        case 'function':
        {
            if( isGeneratorFunction( value ) ) {
                return Promise.coroutine( value ).call( this );
            } else {
                return thunkToPromise.call( this, value );
            }
        }
        case 'object':
        {
            if( isThenable( value ) ) {
                return value;
            } else if( !value ) {
                return value;
            } else if( Array.isArray( value ) ) {
                return arrayToPromise.call( this, value );
            } else if( isGenerator( value ) ) {
                return resolveGenerator.call( this, value );
            } else if( Object === value.constructor ) {
                return objectToPromise.call( this, value );
            }
        }
        default:
        {
            var i = -1;
            var _length2 = yieldHandlers.length;

            while( ++i < _length2 ) {
                var handler = yieldHandlers[i];

                var res = handler.call( this, value );

                if( isThenable( res ) ) {
                    return res;
                }
            }
        }
        case 'undefined':
        {
            return value;
        }
    }
}

function addYieldHandler( handler ) {
    if( typeof handler !== 'function' ) {
        throw new TypeError( 'yield handler is not a function' );
    } else {
        yieldHandlers.push( handler );
    }
}

var addedYieldHandler = false;

if( !addedYieldHandler ) {
    Promise.coroutine.addYieldHandler( toPromise );

    addedYieldHandler = true;
}

exports.default = {
    addYieldHandler:     addYieldHandler,
    isThenable:          isThenable,
    isPromise:           isPromise,
    isGenerator:         isGenerator,
    isGeneratorFunction: isGeneratorFunction
};
