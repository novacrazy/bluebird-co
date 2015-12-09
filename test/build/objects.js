'use strict';

var _keys = require( 'babel-runtime/core-js/object/keys' );

var _keys2 = _interopRequireDefault( _keys );

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var _classCallCheck2 = require( 'babel-runtime/helpers/classCallCheck' );

var _classCallCheck3 = _interopRequireDefault( _classCallCheck2 );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _fs = require( 'fs' );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Created by Aaron on 7/9/2015.
 */

var readFileAsync = _bluebird2.default.promisify( _fs.readFile );

var Pet = (function() {
    function Pet( name ) {
        (0, _classCallCheck3.default)( this, Pet );

        this.name = name;
    }

    Pet.prototype.something = function something() {
    };

    return Pet;
})();

describe( 'Coroutines yielding objects', function() {
    it( 'should aggregate several thunks', function() {
        var test1 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var a = readFileAsync( 'index.js', 'utf8' );
                var b = readFileAsync( 'LICENSE', 'utf8' );
                var c = readFileAsync( 'package.json', 'utf8' );

                var res = yield {
                    a: a,
                    b: b,
                    c: c
                };

                _assert2.default.strictEqual( 3, (0, _keys2.default)( res ).length );
                (0, _assert2.default)( res.a.indexOf( 'exports' ) !== -1 );
                (0, _assert2.default)( res.b.indexOf( 'MIT' ) !== -1 );
                (0, _assert2.default)( res.c.indexOf( 'devDependencies' ) !== -1 );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        })();

        return test1();
    } );

    it( 'should noop with no args', function() {
        var test2 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var res = yield {};
                _assert2.default.strictEqual( 0, (0, _keys2.default)( res ).length );
            } );
            return function test2() {
                return ref.apply( this, arguments );
            };
        })();

        return test2();
    } );

    it( 'should ignore non-thunkable properties', function() {
        var test3 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
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
                (0, _assert2.default)( res.address.indexOf( 'exports' ) !== -1 );
            } );
            return function test3() {
                return ref.apply( this, arguments );
            };
        })();

        return test3();
    } );

    it( 'should preserve key order', function() {
        function timedThunk( time ) {
            return function( cb ) {
                setTimeout( cb, time );
            };
        }

        var test4 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var before = {
                    sun:  timedThunk( 30 ),
                    rain: timedThunk( 20 ),
                    moon: timedThunk( 10 )
                };

                var after = yield before;

                var orderBefore = (0, _keys2.default)( before ).join( ',' );
                var orderAfter = (0, _keys2.default)( after ).join( ',' );
                _assert2.default.equal( orderBefore, orderAfter );
            } );
            return function test4() {
                return ref.apply( this, arguments );
            };
        })();

        return test4();
    } );
} );
