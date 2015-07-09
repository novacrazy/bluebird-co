/**
 * Created by Aaron on 7/9/2015.
 */

'use strict';

var _createClass = require( 'babel-runtime/helpers/create-class' ).default;

var _classCallCheck = require( 'babel-runtime/helpers/class-call-check' ).default;

var _bluebird = require( 'bluebird' );

var _Object$keys = require( 'babel-runtime/core-js/object/keys' ).default;

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _fs = require( 'fs' );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

var readFileAsync = _bluebird2.default.promisify( _fs.readFile );

var Pet = (function() {
    function Pet( name ) {
        _classCallCheck( this, Pet );

        this.name = name;
    }

    _createClass( Pet, [{
        key:   'something',
        value: function something() {
        }
    }] );

    return Pet;
})();

describe( 'Coroutines yielding objects', function() {
    it( 'should aggregate several thunks', function() {
        var test1 = _bluebird.coroutine( function* () {
            var a = readFileAsync( 'index.js', 'utf8' );
            var b = readFileAsync( 'LICENSE', 'utf8' );
            var c = readFileAsync( 'package.json', 'utf8' );

            var res = yield {
                a: a,
                b: b,
                c: c
            };

            _assert2.default.strictEqual( 3, _Object$keys( res ).length );
            (0, _assert2.default)( ~res.a.indexOf( 'exports' ) );
            (0, _assert2.default)( ~res.b.indexOf( 'MIT' ) );
            (0, _assert2.default)( ~res.c.indexOf( 'devDependencies' ) );
        } );

        return test1();
    } );

    it( 'should noop with no args', function() {
        var test2 = _bluebird.coroutine( function* () {
            var res = yield {};
            _assert2.default.strictEqual( 0, _Object$keys( res ).length );
        } );

        return test2();
    } );

    it( 'should ignore non-thunkable properties', function() {
        var test3 = _bluebird.coroutine( function* () {
            var foo = {
                name:      {first: 'tobi'},
                age:       2,
                address:   readFileAsync( 'index.js', 'utf8' ),
                tobi:      new Pet( 'tobi' ),
                falsey:    false,
                nully:     null,
                undefiney: void 0
            };

            var res = yield foo;

            _assert2.default.equal( 'tobi', res.name.first );
            _assert2.default.equal( 2, res.age );
            _assert2.default.equal( 'tobi', res.tobi.name );
            _assert2.default.equal( false, foo.falsey );
            _assert2.default.equal( null, foo.nully );
            _assert2.default.equal( void 0, foo.undefiney );
            (0, _assert2.default)( ~res.address.indexOf( 'exports' ) );
        } );

        return test3();
    } );

    it( 'should preserve key order', function() {
        function timedThunk( time ) {
            return function( cb ) {
                setTimeout( cb, time );
            };
        }

        var test4 = _bluebird.coroutine( function* () {
            var before = {
                sun:  timedThunk( 30 ),
                rain: timedThunk( 20 ),
                moon: timedThunk( 10 )
            };

            var after = yield before;

            var orderBefore = _Object$keys( before ).join( ',' );
            var orderAfter = _Object$keys( after ).join( ',' );
            _assert2.default.equal( orderBefore, orderAfter );
        } );

        return test4();
    } );
} );
