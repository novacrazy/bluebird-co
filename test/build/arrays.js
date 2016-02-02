'use strict';

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _fs = require( 'fs' );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Created by Aaron on 7/9/2015.
 */

var readFileAsync = _bluebird2.default.promisify( _fs.readFile );

describe( 'Promise.coroutine(* -> yield [])', function() {
    it( 'should aggregate several thunks', function() {
        var test1 = function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var a = readFileAsync( 'index.js', 'utf8' );
                var b = readFileAsync( 'LICENSE', 'utf8' );
                var c = readFileAsync( 'package.json', 'utf8' );

                var res = yield [a, b, c];
                _assert2.default.strictEqual( 3, res.length );
                (0, _assert2.default)( res[0].indexOf( 'exports' ) !== -1 );
                (0, _assert2.default)( res[1].indexOf( 'MIT' ) !== -1 );
                (0, _assert2.default)( res[2].indexOf( 'devDependencies' ) !== -1 );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        }();

        return test1();
    } );

    it( 'should noop with no args', function() {
        var test2 = function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var res = yield [];
                _assert2.default.strictEqual( 0, res.length );
            } );
            return function test2() {
                return ref.apply( this, arguments );
            };
        }();

        return test2();
    } );

    it( 'should support an array of generators', function() {
        var test3 = function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var val = yield [
                    function* () {
                        return 1;
                    }()
                ];
                _assert2.default.deepEqual( val, [1] );
            } );
            return function test3() {
                return ref.apply( this, arguments );
            };
        }();

        return test3();
    } );
} );
