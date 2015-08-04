/**
 * Created by Aaron on 7/10/2015.
 */

'use strict';

var _createClass = require( 'babel-runtime/helpers/create-class' ).default;

var _classCallCheck = require( 'babel-runtime/helpers/class-call-check' ).default;

var _get = require( 'babel-runtime/helpers/get' ).default;

var _inherits = require( 'babel-runtime/helpers/inherits' ).default;

var _bluebird = require( 'bluebird' );

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

_2.default.addYieldHandler( function( value ) {
    if( value === 13 ) {
        return _bluebird2.default.resolve( 10 );
    }
} );

var MyModel = (function() {
    function MyModel( value ) {
        _classCallCheck( this, MyModel );

        this._value = value;
    }

    _createClass( MyModel, [
        {
            key:   'fetch',
            value: function fetch() {
                return _bluebird2.default.resolve( this._value + ' result' );
            }
        }
    ] );

    return MyModel;
})();

var MyOtherModel = (function( _Object ) {
    _inherits( MyOtherModel, _Object );

    function MyOtherModel() {
        _classCallCheck( this, MyOtherModel );

        _get( Object.getPrototypeOf( MyOtherModel.prototype ), 'constructor', this ).apply( this, arguments );
    }

    return MyOtherModel;
})( Object );

_2.default.addYieldHandler( function( value ) {
    if( value instanceof MyModel ) {
        return value.fetch();
    }
} );

describe( 'yield with custom handler', function() {
    it( 'should work with simple yields', function() {
        var test1 = _bluebird.coroutine( function* () {
            var res = yield 13;

            _assert2.default.strictEqual( res, 10 );
        } );

        return test1();
    } );

    it( 'should work with nested yields', function() {
        var test2 = _bluebird.coroutine( function* () {
            var res = yield {
                k: 13,
                v: [13, 13]
            };

            _assert2.default.deepEqual( res, {k: 10, v: [10, 10]} );
        } );

        return test2();
    } );

    it( 'should work with nested yields of class instances', function() {
        var test3 = _bluebird.coroutine( function* () {
            var data = yield {
                model1: new MyModel( 'something' ),
                model2: [new MyModel( 1 ), new MyModel( 2 )]
            };

            _assert2.default.deepEqual( data, {
                model1: 'something result',
                model2: ['1 result', '2 result']
            } );
        } );

        return test3();
    } );

    it( 'should throw with yields of unknown types, even if they inherit from Object', function() {
        var test4 = _bluebird.coroutine( function* () {
            try {
                var a = yield new MyOtherModel();

                throw new Error( 'lol' );
            } catch( err ) {
                (0, _assert2.default)( err instanceof TypeError );
                (0, _assert2.default)( ~err.message.indexOf( 'yield' ) );
            }
        } );

        return test4();
    } );

    it( 'should silently ignore nested yields of unknown types', function() {
        var test5 = _bluebird.coroutine( function* () {
            var a = yield {
                model1: new MyOtherModel()
            };

            _assert2.default.deepEqual( a, {
                model1: {}
            } );

            (0, _assert2.default)( a.model1 instanceof MyOtherModel );
        } );

        return test5();
    } );
} );
