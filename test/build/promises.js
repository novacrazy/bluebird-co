/**
 * Created by Aaron on 7/9/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

function getPromise( val, err ) {
    return new _bluebird2.default( function( resolve, reject ) {
        if( err ) {
            reject( err );
        } else {
            resolve( val );
        }
    } );
}

describe( 'yield <promise>', function() {
    describe( 'with one promise yield', function() {
        it( 'should work', function() {
            var test1 = _bluebird.coroutine( function* () {
                var a = yield getPromise( 1 );

                _assert2.default.strictEqual( 1, a );
            } );

            return test1();
        } );
    } );

    describe( 'with several promise yields', function() {
        it( 'should work', function() {
            var test2 = _bluebird.coroutine( function* () {
                var a = yield getPromise( 1 );
                var b = yield getPromise( 2 );
                var c = yield getPromise( 3 );

                _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );
            } );

            return test2();
        } );
    } );

    describe( 'when a promise is rejected', function() {
        it( 'should throw and resume', function() {
            var test3 = _bluebird.coroutine( function* () {
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

            return test3();
        } );
    } );

    describe( 'when yielding a non-standard promise-like', function() {
        it( 'should return a real Promise', function() {
            var test4 = _bluebird.coroutine( function* () {
                return yield {
                    then: function then() {
                    }
                };
            } );

            (0, _assert2.default)( test4() instanceof _bluebird2.default );
        } );
    } );
} );
