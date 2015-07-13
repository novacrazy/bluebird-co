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

function get( val, err, error ) {
    return function( done ) {
        if( error ) {
            throw error;
        }
        setTimeout( function() {
            done( err, val );
        }, 10 );
    };
}

describe( 'simple coroutines', function() {
    describe( 'with no yields', function() {
        it( 'should work', function() {
            var test1 = _bluebird.coroutine( function* () {
            } );

            return test1();
        } );
    } );

    describe( 'with one yield', function() {
        it( 'should work', function() {
            var test2 = _bluebird.coroutine( function* () {
                var a = yield get( 1 );
                _assert2.default.strictEqual( 1, a );
            } );

            return test2();
        } );
    } );

    describe( 'with several yields', function() {
        it( 'should work', function() {
            var test3 = _bluebird.coroutine( function* () {
                var a = yield get( 1 );
                var b = yield get( 2 );
                var c = yield get( 3 );

                _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );
            } );

            return test3();
        } );
    } );

    describe( 'with many arguments', function() {
        it( 'should return an array', function() {
            function exec( cmd ) {
                return function( done ) {
                    done( null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );
                };
            }

            var test4 = _bluebird.coroutine( function* () {
                var out = yield exec( 'something' );
                _assert2.default.deepEqual( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], out );
            } );

            return test4();
        } );
    } );

    describe( 'when the function throws', function() {
        it( 'should be caught', function() {
            var test5 = _bluebird.coroutine( function* () {
                try {
                    var a = yield get( 1, null, new Error( 'boom' ) );
                } catch( err ) {
                    _assert2.default.strictEqual( 'boom', err.message );
                }
            } );

            return test5();
        } );
    } );

    describe( 'when an error is passed then thrown', function() {
        it( 'should only catch the first error only', function() {
            var test6 = _bluebird.coroutine( function* () {
                return yield function( done ) {
                    done( new Error( 'first' ) );

                    throw new Error( 'second' );
                };
            } );

            return test6().then( function() {
                throw new Error( 'wtf' );
            }, function( err ) {
                _assert2.default.strictEqual( 'first', err.message );
            } );
        } );
    } );

    describe( 'when an error is passed', function() {
        it( 'should throw and resume', function() {
            var test7 = _bluebird.coroutine( function* () {
                var error = undefined;

                try {
                    yield get( 1, new Error( 'boom' ) );
                } catch( err ) {
                    error = err;
                }

                _assert2.default.strictEqual( 'boom', error.message );
                var ret = yield get( 1 );
                _assert2.default.strictEqual( 1, ret );
            } );

            return test7();
        } );
    } );

    describe( 'with nested coroutines', function() {
        it( 'should work', function() {
            var hit = [];

            var test8 = _bluebird.coroutine( function* () {
                var a = yield get( 1 );
                var b = yield get( 2 );
                var c = yield get( 3 );
                hit.push( 'one' );

                _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );

                yield _bluebird.coroutine( function* () {
                    hit.push( 'two' );
                    var a = yield get( 1 );
                    var b = yield get( 2 );
                    var c = yield get( 3 );

                    _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );

                    yield _bluebird.coroutine( function* () {
                        hit.push( 'three' );

                        var a = yield get( 1 );
                        var b = yield get( 2 );
                        var c = yield get( 3 );

                        _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );
                    } )();
                } )();

                yield _bluebird.coroutine( function* () {
                    hit.push( 'four' );
                    var a = yield get( 1 );
                    var b = yield get( 2 );
                    var c = yield get( 3 );

                    _assert2.default.deepEqual( [1, 2, 3], [a, b, c] );
                } )();

                _assert2.default.deepEqual( ['one', 'two', 'three', 'four'], hit );
            } );

            return test8();
        } );
    } );

    describe( 'return values', function() {
        describe( 'with a callback', function() {
            it( 'should be passed', function() {
                var test9 = _bluebird.coroutine( function* () {
                    return [yield get( 1 ), yield get( 2 ), yield get( 3 )];
                } );

                return test9().then( function( res ) {
                    _assert2.default.deepEqual( [1, 2, 3], res );
                } );
            } );
        } );

        describe( 'when nested', function() {
            it( 'should return the value', function() {
                var test10 = _bluebird.coroutine( function* () {
                    var other = yield _bluebird.coroutine( function* () {
                        return [yield get( 4 ), yield get( 5 ), yield get( 6 )];
                    } )();

                    return [yield get( 1 ), yield get( 2 ), yield get( 3 )].concat( other );
                } );

                return test10().then( function( res ) {
                    _assert2.default.deepEqual( [1, 2, 3, 4, 5, 6], res );
                } );
            } );
        } );
    } );

    describe( 'when yielding neither a function nor a promise', function() {
        it( 'should throw', function() {
            var test11 = _bluebird.coroutine( function* () {
                var errors = [];

                try {
                    var a = yield 'something';
                } catch( err ) {
                    errors.push( err.message );
                }

                try {
                    var a = yield 'something';
                } catch( err ) {
                    errors.push( err.message );
                }

                _assert2.default.strictEqual( 2, errors.length );
                var msg = 'yield';
                (0, _assert2.default)( ~errors[0].indexOf( 'yield' ) );
                (0, _assert2.default)( ~errors[1].indexOf( 'yield' ) );
            } );

            return test11();
        } );
    } );

    describe( 'with errors', function() {
        it( 'should throw', function() {
            var test12 = _bluebird.coroutine( function* () {
                var errors = [];

                try {
                    var a = yield get( 1, new Error( 'foo' ) );
                } catch( err ) {
                    errors.push( err.message );
                }

                try {
                    var a = yield get( 1, new Error( 'bar' ) );
                } catch( err ) {
                    errors.push( err.message );
                }

                _assert2.default.deepEqual( ['foo', 'bar'], errors );
            } );

            return test12();
        } );

        it( 'should catch errors on .send()', function() {
            var test13 = _bluebird.coroutine( function* () {
                var errors = [];
                try {
                    var a = yield get( 1, null, new Error( 'foo' ) );
                } catch( err ) {
                    errors.push( err.message );
                }

                try {
                    var a = yield get( 1, null, new Error( 'bar' ) );
                } catch( err ) {
                    errors.push( err.message );
                }

                _assert2.default.deepEqual( ['foo', 'bar'], errors );
            } );

            return test13();
        } );

        it( 'should pass future errors to the callback', function() {
            var test14 = _bluebird.coroutine( function* () {
                yield get( 1 );
                yield get( 2, null, new Error( 'fail' ) );
                (0, _assert2.default)( false );
                yield get( 3 );
            } );

            return test14().catch( function( err ) {
                _assert2.default.strictEqual( 'fail', err.message );
            } );
        } );

        it( 'should pass immediate errors to the callback', function() {
            var test15 = _bluebird.coroutine( function* () {
                yield get( 1 );
                yield get( 2, new Error( 'fail' ) );
                (0, _assert2.default)( false );
                yield get( 3 );
            } );

            return test15().catch( function( err ) {
                _assert2.default.strictEqual( 'fail', err.message );
            } );
        } );

        it( 'should catch errors on the first invocation', function() {
            var test16 = _bluebird.coroutine( function* () {
                throw new Error( 'fail' );
            } );

            return test16().catch( function( err ) {
                _assert2.default.strictEqual( 'fail', err.message );
            } );
        } );
    } );
} );
