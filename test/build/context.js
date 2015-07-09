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

var ctx = {
    some: 'thing'
};

describe( 'Promise.coroutine(...).call(this)', function() {
    it( 'should pass the context', function() {
        var test1 = _bluebird.coroutine( function* () {
            _assert2.default.strictEqual( ctx, this );
        } );

        return test1.call( ctx );
    } );
} );
