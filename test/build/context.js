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

var ctx = {
    some: 'thing'
};
/**
 * Created by Aaron on 7/9/2015.
 */

describe( 'Promise.coroutine(...).call(this)', function() {
    it( 'should pass the context', function() {
        var test1 = function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                _assert2.default.strictEqual( ctx, this );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        }();

        return test1.call( ctx );
    } );
} );
