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

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var yieldHandlers = [];

function isThenable( obj ) {
    return obj !== void 0 && obj !== null && (obj instanceof _bluebird2.default || typeof obj.then === 'function');
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

function isNativeObject( obj ) {
    if( !obj.constructor ) {
        return true;
    } else if( 'Object' === obj.constructor.name || 'Object' === obj.constructor.displayName ) {
        return true;
    } else {
        var p = obj.constructor.prototype;

        return p && !!(!p.constructor || 'Object' === p.constructor.name);
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
    var results = new obj.constructor();
    var keys = Object.keys( obj );
    var promises = new Array( keys.length );
    var current = 0;

    var toPromiseThis = toPromise.bind( this );

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

        var promise = toPromiseThis( obj[key] );

        if( isThenable( promise ) ) {
            results[key] = void 0;

            promises[current++] = promise.then( function( res ) {
                return results[key] = res;
            } );
        } else {
            results[key] = obj[key];
        }
    };

    for( var _iterator = keys, _isArray = Array.isArray( _iterator ), _i = 0, _iterator = _isArray ? _iterator :
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
    var _this = this;

    return new _bluebird2.default( function( resolve, reject ) {
        var toPromiseThis = toPromise.bind( _this );

        var next = function next( ret ) {
            if( ret.done ) {
                return resolve( ret.value );
            } else {
                try {
                    var value = toPromiseThis( ret.value, true );

                    if( isThenable( value ) ) {
                        return value.then( onFulfilled ).catch( onRejected );
                    } else {
                        var err = new TypeError( 'You may only yield a function, promise, generator, array, or object, but the following object was passed: "'
                                                 + ret.value + '"' );

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
    } );
}

function toPromise( value, strict ) {
    var _this2 = this;

    if( isThenable( value ) ) {
        return value;
    } else if( Array.isArray( value ) ) {
        var _ret2 = (function() {
            var toPromiseThis = toPromise.bind( _this2 );

            return {
                v: _bluebird2.default.all( value.map( function( val ) {
                    return toPromiseThis( val );
                } ) )
            };
        })();

        if( typeof _ret2 === 'object' ) {
            return _ret2.v;
        }
    } else if( typeof value === 'object' && value !== null ) {
        if( isGenerator( value ) ) {
            return resolveGenerator.call( this, value );
        } else if( isNativeObject( value ) ) {
            return objectToPromise.call( this, value );
        } else {
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
    } else if( yieldHandlers.length > 0 ) {
        for( var _iterator3 = yieldHandlers, _isArray3 = Array.isArray( _iterator3 ), _i3 = 0, _iterator3 = _isArray3 ?
                                                                                                            _iterator3 :
                                                                                                            _iterator3[Symbol.iterator](); ; ) {
            var _ref3;

            if( _isArray3 ) {
                if( _i3 >= _iterator3.length ) {
                    break;
                }
                _ref3 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if( _i3.done ) {
                    break;
                }
                _ref3 = _i3.value;
            }

            var handler = _ref3;

            var res = handler.call( this, value );

            if( isThenable( res ) ) {
                return res;
            }
        }
    }

    if( strict ) {
        throw new YieldException( 'You may only yield a function, promise, generator, array, or object, but the following object was passed: "'
                                  + value + '"' );
    } else {
        return _bluebird2.default.resolve( value );
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
    isPromise:           isPromise,
    isGenerator:         isGenerator,
    isGeneratorFunction: isGeneratorFunction
};
