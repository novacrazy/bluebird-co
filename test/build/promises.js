'use strict';

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {default: obj};
}

function getPromise( val, err ) {
    return new _bluebird2.default( function( resolve, reject ) {
        if( err ) {
            reject( err );
        } else {
            resolve( val );
        }
    } );
}
/**
 * Created by Aaron on 7/9/2015.
 */

describe( 'yield <promise>', function() {
    describe( 'with one promise yield', function() {
        it( 'should work', function() {
            var test1 = (function() {
                var ref = (0, _bluebird.coroutine)( function* () {
                    var a = yield getPromise( 1 );

                    _assert2.default.strictEqual( 1, a );
                } );
                return function test1() {
                    return ref.apply( this, arguments );
                };
            })();

            return test1();
        } );
    } );

    describe( 'with several promise yields', function() {
        it( 'should work', function() {
            var test2 = (function() {
                var ref = (0, _bluebird.coroutine)( function* () {
                    var a = yield getPromise( 1 );
                    var b = yield getPromise( 2 );
                    var c = yield getPromise( 3 );

                    _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );
                } );
                return function test2() {
                    return ref.apply( this, arguments );
                };
            })();

            return test2();
        } );
    } );

    describe( 'when a promise is rejected', function() {
        it( 'should throw and resume', function() {
            var test3 = (function() {
                var ref = (0, _bluebird.coroutine)( function* () {
                    var error = undefined;

                    try {
                        yield getPromise( 1, new Error( 'boom' ) );
                    } catch( err ) {
                        error = err;
                    }

                    (0, _assert2.default)( 'boom' == error.message );

                    var ret = yield getPromise( 1 );

                    _assert2.default.strictEqual( 1, ret );
                } );
                return function test3() {
                    return ref.apply( this, arguments );
                };
            })();

            return test3();
        } );
    } );

    describe( 'when yielding a non-standard promise-like', function() {
        it( 'should return a real Promise', function() {
            var test4 = (function() {
                var ref = (0, _bluebird.coroutine)( function* () {
                    return yield {
                        then: function then() {
                        }
                    };
                } );
                return function test4() {
                    return ref.apply( this, arguments );
                };
            })();

            (0, _assert2.default)( test4() instanceof _bluebird2.default );
        } );
    } );
} );
