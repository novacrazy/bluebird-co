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

function objectToPromise( obj ) {
    var _this = this;

    var keys = Object.keys( obj );
    var length = keys.length;

    var results = new obj.constructor();
    var promises = new Array( length );

    var i = -1;

    var _loop = function() {
        var key = keys[i];

        var value = obj[key];

        var promise = toPromise.call( _this, value );

        if( isThenable( promise ) ) {
            results[key] = void 0;

            promises[i] = promise.then( function( res ) {
                return results[key] = res;
            } );
        } else {
            results[key] = value;
        }
    };

    while( ++i < length ) {
        _loop();
    }

    return _bluebird2.default.all( promises ).return( results );
}

function resolveGenerator( gen ) {
    return new _bluebird2.default( function( resolve, reject ) {
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

    return _bluebird2.default.all( results );
}

function toPromise( value ) {
    var _this2 = this;

    if( isThenable( value ) ) {
        return value;
    } else if( Array.isArray( value ) ) {
        return arrayToPromise.call( this, value );
    } else if( !!value && typeof value === 'object' ) {
        if( isGenerator( value ) ) {
            return resolveGenerator.call( this, value );
        } else if( Object === value.constructor || !value.constructor ) {
            return objectToPromise.call( this, value );
        } else {
            var i = -1;
            var _length = yieldHandlers.length;

            while( ++i < _length ) {
                var handler = yieldHandlers[i];

                var res = handler.call( this, value );

                if( isThenable( res ) ) {
                    return res;
                }
            }
        }
    } else if( typeof value === 'function' ) {
        if( isGeneratorFunction( value ) ) {
            return _bluebird2.default.coroutine( value ).call( this );
        } else {
            //Thunks
            return new _bluebird2.default( function( resolve, reject ) {
                try {
                    value.call( _this2, function( err ) {
                        for( var _len = arguments.length, res = Array( _len > 1 ? _len - 1 : 0 ), _key = 1; _key < _len;
                             _key++ ) {
                            res[_key - 1] = arguments[_key];
                        }

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
    } else {
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

    return value;
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
    _bluebird2.default.coroutine.addYieldHandler( toPromise );

    addedYieldHandler = true;
}

exports.default = {
    addYieldHandler:     addYieldHandler,
    isThenable:          isThenable,
    isPromise:           isPromise,
    isGenerator:         isGenerator,
    isGeneratorFunction: isGeneratorFunction
};
