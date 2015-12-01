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

describe( 'yield handler recursion', function() {
    it( 'should aggregate arrays within arrays', function() {
        var test1 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var a = readFileAsync( 'index.js', 'utf8' );
                var b = readFileAsync( 'LICENSE', 'utf8' );
                var c = readFileAsync( 'package.json', 'utf8' );

                var res = yield [a, [b, c]];

                _assert2.default.equal( 2, res.length );
                (0, _assert2.default)( ~res[0].indexOf( 'exports' ) );
                _assert2.default.equal( 2, res[1].length );
                (0, _assert2.default)( ~res[1][0].indexOf( 'MIT' ) );
                (0, _assert2.default)( ~res[1][1].indexOf( 'devDependencies' ) );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        })();

        return test1();
    } );

    it( 'should aggregate objects within objects', function() {
        var test2 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var a = readFileAsync( 'index.js', 'utf8' );
                var b = readFileAsync( 'LICENSE', 'utf8' );
                var c = readFileAsync( 'package.json', 'utf8' );

                var res = yield {
                    0: a,
                    1: {
                        0: b,
                        1: c
                    }
                };

                (0, _assert2.default)( ~res[0].indexOf( 'exports' ) );
                (0, _assert2.default)( ~res[1][0].indexOf( 'MIT' ) );
                (0, _assert2.default)( ~res[1][1].indexOf( 'devDependencies' ) );
            } );
            return function test2() {
                return ref.apply( this, arguments );
            };
        })();

        return test2();
    } );
} );
