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

function _classCallCheck( instance, Constructor ) {
    if( !(instance instanceof Constructor) ) {
        throw new TypeError( 'Cannot call a class as a function' );
    }
}

function _inherits( subClass, superClass ) {
    if( typeof superClass !== 'function' && superClass !== null ) {
        throw new TypeError( 'Super expression must either be null or a function, not ' + typeof superClass );
    }
    subClass.prototype = Object.create( superClass && superClass.prototype, {
        constructor: {
            value:        subClass,
            enumerable:   false,
            writable:     true,
            configurable: true
        }
    } );
    if( superClass ) {
        subClass.__proto__ = superClass;
    }
}

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var yieldHandlers = [];

function isThenable( obj ) {
    return obj !== void 0 && obj !== null && (obj instanceof _bluebird2.default || typeof obj.then === 'function');
}

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

var YieldException = (function( _TypeError ) {
    function YieldException() {
        _classCallCheck( this, YieldException );

        _TypeError.apply( this, arguments );
    }

    _inherits( YieldException, _TypeError );

    return YieldException;
})( TypeError );

function objectToPromise( obj ) {
    var _this = this;

    var results = new obj.constructor();
    var promises = [];

    var _loop = function() {
        if( _isArray ) {
            if( _i >= _iterator.length ) {
                return 'break';
            }
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if( _i.done ) {
                return 'break';
            }
            _ref = _i.value;
        }

        var key = _ref;

        var promise = toPromise.call( _this, obj[key] );

        if( promise && isThenable( promise ) ) {
            results[key] = void 0;

            promises.push( promise.then( function( res ) {
                results[key] = res;
            } ) );
        } else {
            results[key] = obj[key];
        }
    };

    for( var _iterator = Object.keys( obj ), _isArray = Array.isArray( _iterator ), _i = 0, _iterator = _isArray ?
                                                                                                        _iterator :
                                                                                                        _iterator[Symbol.iterator](); ; ) {
        var _ref;

        var _ret = _loop();

        if( _ret === 'break' ) {
            break;
        }
    }

    return _bluebird2.default.all( promises ).return( results );
}

function resolveGenerator( gen ) {
    var _this2 = this;

    return new _bluebird2.default( function( resolve, reject ) {

        //Just in case
        if( typeof gen === 'function' ) {
            gen = gen();
        }

        if( !gen || !isGenerator( gen ) ) {
            return _bluebird2.default.resolve( gen );
        } else {
            (function() {
                var onFulfilled = function onFulfilled( res ) {
                    try {
                        next( gen.next( res ) );
                    } catch( e ) {
                        return reject( e );
                    }
                };

                var onRejected = function onRejected( err ) {
                    try {
                        next( gen.throw( err ) );
                    } catch( e ) {
                        return reject( e );
                    }
                };

                var next = function next( ret ) {
                    if( ret.done ) {
                        return resolve( ret.value );
                    } else {
                        var value = toPromise.call( _this2, ret.value, true );

                        if( isThenable( value ) ) {
                            return value.then( onFulfilled ).catch( onRejected );
                        } else {
                            var err = new TypeError( 'You may only yield a function, promise, generator, array, or object, but the following object was passed: "'
                                                     + ret.value + '"' );

                            return onRejected( err );
                        }
                    }
                };

                onFulfilled();
            })();
        }
    } );
}

function toPromise( value, strict ) {
    var _this3 = this;

    if( isThenable( value ) ) {
        return value;
    } else if( Array.isArray( value ) ) {
        return _bluebird2.default.all( value.map( function( val ) {
            return toPromise.call( _this3, val );
        } ) );
    } else if( typeof value === 'object' && value !== null ) {
        if( isGenerator( value ) ) {
            return resolveGenerator.call( this, value );
        } else {
            return objectToPromise.call( this, value );
        }
    } else if( typeof value === 'function' ) {
        if( isGeneratorFunction( value ) ) {
            return _bluebird2.default.coroutine( value )();
        } else {
            //Thunks
            return new _bluebird2.default( function( resolve, reject ) {
                try {
                    value.call( _this3, function( err ) {
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
    } else if( yieldHandlers.length > 0 ) {
        for( var _iterator2 = yieldHandlers, _isArray2 = Array.isArray( _iterator2 ), _i2 = 0, _iterator2 = _isArray2 ?
                                                                                                            _iterator2 :
                                                                                                            _iterator2[Symbol.iterator](); ; ) {
            var _ref2;

            if( _isArray2 ) {
                if( _i2 >= _iterator2.length ) {
                    break;
                }
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if( _i2.done ) {
                    break;
                }
                _ref2 = _i2.value;
            }

            var handler = _ref2;

            var res = handler.call( this, value );

            if( isThenable( res ) ) {
                return res;
            }
        }
    } else if( strict ) {
        throw new YieldException( 'You may only yield a function, promise, generator, array, or object, but the following object was passed: "'
                                  + value + '"' );
    } else {
        return _bluebird2.default.resolve( value );
    }
}

function addYieldHandler( handler ) {
    _assert2.default.strictEqual( typeof handler, 'function', 'handler must be a function' );

    yieldHandlers.push( handler );
}

var addedYieldHandler = false;

if( !addedYieldHandler ) {
    _bluebird2.default.coroutine.addYieldHandler( function( value ) {
        try {
            return toPromise.call( this, value, true );
        } catch( err ) {
            if( err instanceof YieldException ) {
                return void 0;
            } else {
                return _bluebird2.default.reject( err );
            }
        }
    } );

    addedYieldHandler = true;
}

exports.default = {
    addYieldHandler:     addYieldHandler,
    isThenable:          isThenable,
    isPromise:           isThenable,
    isGenerator:         isGenerator,
    isGeneratorFunction: isGeneratorFunction
};
