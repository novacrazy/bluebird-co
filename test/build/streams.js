/**
 * Created by Aaron on 8/4/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _fs = require( 'fs' );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

describe( 'yielding streams', function() {
    it( 'should handle file readable file streams', function() {
        var test1 = _bluebird.coroutine( function* () {
            var res = yield (0, _fs.createReadStream)( 'index.js' );

            (0, _assert2.default)( Buffer.isBuffer( res ) );
            (0, _assert2.default)( ~res.toString( 'utf-8' ).indexOf( 'exports' ) );
        } );

        return test1();
    } );

    it( 'should handle file readable file streams with encoding', function() {
        var test2 = _bluebird.coroutine( function* () {
            var res = yield (0, _fs.createReadStream)( 'index.js', {
                encoding: 'utf-8'
            } );

            _assert2.default.strictEqual( typeof res, 'string' );
            (0, _assert2.default)( ~res.indexOf( 'exports' ) );
        } );

        return test2();
    } );
} );
