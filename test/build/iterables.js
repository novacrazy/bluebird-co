/**
 * Created by Aaron on 7/17/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _Set = require( 'babel-runtime/core-js/set' ).default;

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

describe( 'yielding iterables', function() {
    it( 'should work', function() {
        var test1 = _bluebird.coroutine( function* () {
            var a = yield new _Set( [_bluebird2.default.resolve( 1 ), 2, [_bluebird2.default.resolve( 3 ), 4],
                                     5] ).values();

            _assert2.default.deepEqual( a, [1, 2, [3, 4], 5] );
        } );

        return test1();
    } );
} );
