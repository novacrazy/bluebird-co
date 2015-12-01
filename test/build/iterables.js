'use strict';

var _set = require( 'babel-runtime/core-js/set' );

var _set2 = _interopRequireDefault( _set );

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {default: obj};
}

describe( 'yielding iterables', function() {
    it( 'should work', function() {
        var test1 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var a = yield new _set2.default( [
                    _bluebird2.default.resolve( 1 ), 2, [_bluebird2.default.resolve( 3 ), 4], 5
                ] ).values();

                _assert2.default.deepEqual( a, [1, 2, [3, 4], 5] );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        })();

        return test1();
    } );
} );
/**
 * Created by Aaron on 7/17/2015.
 */
