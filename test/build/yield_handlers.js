/**
 * Created by Aaron on 7/10/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

var enabled = true;

_2.default.addYieldHandler( function( value ) {
    if( value === 13 && enabled ) {
        return _bluebird2.default.resolve( 10 );
    }
} );

describe( 'yield null with custom handler', function() {
    it( 'should work', function() {
        var test1 = _bluebird.coroutine( function* () {
            var res = yield 13;

            _assert2.default.strictEqual( res, 10 );

            enabled = false;
        } );

        return test1();
    } );
} );
