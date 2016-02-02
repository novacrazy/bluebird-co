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

describe( 'yield <invalid>', function() {
    it( 'should throw an error', function() {
        var test1 = function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                try {
                    yield null;
                    throw new Error( 'lol' );
                } catch( err ) {
                    (0, _assert2.default)( err instanceof TypeError );
                    (0, _assert2.default)( err.message.indexOf( 'yield' ) !== -1 );
                }
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        }();

        return test1();
    } );
} );
/**
 * Created by Aaron on 7/9/2015.
 */
