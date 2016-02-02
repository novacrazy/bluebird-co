'use strict';

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _fs = require( 'fs' );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {default: obj};
}

var readFileAsync = _bluebird2.default.promisify( _fs.readFile );
/**
 * Created by Aaron on 7/9/2015.
 */

var myAsyncFunction = function() {
    var ref = (0, _bluebird.coroutine)( function* () {
        var results = yield [
            _bluebird2.default.delay( 10 ).return( 42 ), readFileAsync( 'index.js', 'utf-8' ),
            [1, _bluebird2.default.resolve( 12 )]
        ];

        _assert2.default.strictEqual( results[0], 42 );
        (0, _assert2.default)( results[1].indexOf( 'exports' ) !== -1 );
        _assert2.default.strictEqual( results[2][0], 1 );
        _assert2.default.strictEqual( results[2][1], 12 );
    } );
    return function myAsyncFunction() {
        return ref.apply( this, arguments );
    };
}();

describe( 'Example function from README', function() {
    it( 'should work normally', function() {
        return myAsyncFunction();
    } );
} );
