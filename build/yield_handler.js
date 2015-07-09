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
exports.default = addYieldHandler;

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {'default': obj};
}

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

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

function objectToPromise( obj ) {
    var results = new obj.constructor();
    var promises = [];

    for( var _iterator = Object.keys( obj ), _isArray = Array.isArray( _iterator ), _i = 0, _iterator = _isArray ?
                                                                                                        _iterator :
                                                                                                        _iterator[Symbol.iterator](); ; ) {
        var _ref;

        if( _isArray ) {
            if( _i >= _iterator.length ) {
                break;
            }
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if( _i.done ) {
                break;
            }
            _ref = _i.value;
        }

        var key = _ref;

        var promise = toPromise.call( this, obj[key] );

        if( promise && isThenable( promise ) ) {
            defer( promise, key );
        } else {
            results[key] = obj[key];
        }
    }

    return _bluebird2.default.all( promises ).then( function() {
        return results;
    } );

    function defer( promise, key ) {
        // predefine the key in the result
        results[key] = void 0;

        promises.push( promise.then( function( res ) {
            return results[key] = res;
        } ) );
    }
}

function resolveGenerator( gen ) {
    var _this = this;

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
                        var value = toPromise.call( _this, ret.value );

                        if( isThenable( value ) ) {
                            return value.then( onFulfilled ).catch( onRejected );
                        } else {
                            return onRejected( new TypeError( 'You may only yield a function, promise, generator, array, or object, '
                                                              + 'but the following object was passed: "'
                                                              + String( ret.value ) + '"' ) );
                        }
                    }
                };

                onFulfilled();
            })();
        }
    } );
}

function toPromise( value ) {
    var _this2 = this;

    if( isThenable( value ) ) {
        return value;
    } else if( Array.isArray( value ) ) {
        return _bluebird2.default.all( value.map( toPromise, this ) );
    } else if( typeof value === 'object' ) {
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
                    value.call( _this2, function( err, res ) {
                        if( err ) {
                            reject( err );
                        } else {
                            resolve( res );
                        }
                    } );
                } catch( err ) {
                    reject( err );
                }
            } );
        }
    } else {
        return _bluebird2.default.resolve( value );
    }
}

var addedYieldHandler = false;

function addYieldHandler() {
    if( !addedYieldHandler ) {
        _bluebird2.default.coroutine.addYieldHandler( function( value ) {
            try {
                return toPromise.call( this, value );
            } catch( err ) {
                return _bluebird2.default.reject( err );
            }
        } );

        addedYieldHandler = true;
    }
}
