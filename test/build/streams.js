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
 * Created by Aaron on 8/4/2015.
 */

describe( 'yielding streams', function() {
    it( 'should handle file readable file streams', function() {
        var test1 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var res = yield (0, _fs.createReadStream)( 'index.js' );

                (0, _assert2.default)( Buffer.isBuffer( res ) );
                (0, _assert2.default)( ~res.toString( 'utf-8' ).indexOf( 'exports' ) );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        })();

        return test1();
    } );

    it( 'should handle file readable file streams with encoding', function() {
        var test2 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var res = yield (0, _fs.createReadStream)( 'index.js', {
                    encoding: 'utf-8'
                } );

                _assert2.default.strictEqual( typeof res, 'string' );
                (0, _assert2.default)( ~res.indexOf( 'exports' ) );
            } );
            return function test2() {
                return ref.apply( this, arguments );
            };
        })();

        return test2();
    } );
} );
