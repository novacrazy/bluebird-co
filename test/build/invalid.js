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

describe( 'yield <invalid>', function() {
    it( 'should throw an error', function() {
        var test1 = _bluebird.coroutine( function* () {
            try {
                yield null;
                throw new Error( 'lol' );
            } catch( err ) {
                (0, _assert2.default)( err instanceof TypeError );
                (0, _assert2.default)( ~err.message.indexOf( 'yield' ) );
            }
        } );

        return test1();
    } );
} );
