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

function sleep( ms ) {
    return function( done ) {
        setTimeout( done, ms );
    };
}
/**
 * Created by Aaron on 7/9/2015.
 */

function* work() {
    yield sleep( 50 );

    return 'yay';
}

describe( 'Coroutines yielding generators', function() {
    describe( 'with a generator function', function() {
        it( 'should iterate through generators', function() {
            var test1 = (function() {
                var ref = (0, _bluebird.coroutine)( function* () {
                    var a = yield work;
                    var b = yield work;
                    var c = yield work;

                    _assert2.default.strictEqual( 'yay', a );
                    _assert2.default.strictEqual( 'yay', b );
                    _assert2.default.strictEqual( 'yay', c );

                    var res = yield [work, work, work];
                    _assert2.default.deepEqual( ['yay', 'yay', 'yay'], res );
                } );
                return function test1() {
                    return ref.apply( this, arguments );
                };
            })();

            return test1();
        } );

        it( 'should catch errors', function() {
            var test2 = (function() {
                var ref = (0, _bluebird.coroutine)( function* () {
                    return yield function* () {
                        throw new Error( 'boom' );
                    };
                } );
                return function test2() {
                    return ref.apply( this, arguments );
                };
            })();

            return test2().then( function() {
                throw new Error( 'wtf' );
            }, function( err ) {
                (0, _assert2.default)( err );
                (0, _assert2.default)( err.message == 'boom' );
            } );
        } );
    } );
} );
