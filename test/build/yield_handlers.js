'use strict';

var _bluebird = require( 'bluebird' );

var _bluebird2 = _interopRequireDefault( _bluebird );

var _possibleConstructorReturn2 = require( 'babel-runtime/helpers/possibleConstructorReturn' );

var _possibleConstructorReturn3 = _interopRequireDefault( _possibleConstructorReturn2 );

var _inherits2 = require( 'babel-runtime/helpers/inherits' );

var _inherits3 = _interopRequireDefault( _inherits2 );

var _classCallCheck2 = require( 'babel-runtime/helpers/classCallCheck' );

var _classCallCheck3 = _interopRequireDefault( _classCallCheck2 );

var _assert = require( 'assert' );

var _assert2 = _interopRequireDefault( _assert );

var _ = require( '../../' );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {default: obj};
}

_.coroutine.addYieldHandler( function( value ) {
    if( value === 13 ) {
        return _bluebird2.default.resolve( 10 );
    }
} );
/**
 * Created by Aaron on 7/10/2015.
 */

var MyModel = (function() {
    function MyModel( value ) {
        (0, _classCallCheck3.default)( this, MyModel );

        this._value = value;
    }

    MyModel.prototype.fetch = function fetch() {
        return _bluebird2.default.resolve( this._value + ' result' );
    };

    return MyModel;
})();

var MyOtherModel = function MyOtherModel() {
    (0, _classCallCheck3.default)( this, MyOtherModel );
};

var MyObjectModel = (function( _Object ) {
    (0, _inherits3.default)( MyObjectModel, _Object );

    function MyObjectModel( value ) {
        (0, _classCallCheck3.default)( this, MyObjectModel );

        var _this = (0, _possibleConstructorReturn3.default)( this, _Object.call( this ) );

        _this.value = _bluebird2.default.resolve( value );
        return _this;
    }

    return MyObjectModel;
})( Object );

_.coroutine.addYieldHandler( function( value ) {
    if( value instanceof MyModel ) {
        return value.fetch();
    }
} );

describe( 'yield with custom handler', function() {
    it( 'should provide a consistent interface for adding yield handlers', function() {
        _assert2.default.strictEqual( _.coroutine.addYieldHandler, _.addYieldHandler );
    } );

    it( 'should work with simple yields', function() {
        var test1 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var res = yield 13;

                _assert2.default.strictEqual( res, 10 );
            } );
            return function test1() {
                return ref.apply( this, arguments );
            };
        })();

        return test1();
    } );

    it( 'should work with nested yields', function() {
        var test2 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var res = yield {
                    k: 13,
                    v: [13, 13]
                };

                _assert2.default.deepEqual( res, {k: 10, v: [10, 10]} );
            } );
            return function test2() {
                return ref.apply( this, arguments );
            };
        })();

        return test2();
    } );

    it( 'should work with nested yields of class instances', function() {
        var test3 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var data = yield {
                    model1: new MyModel( 'something' ),
                    model2: [new MyModel( 1 ), new MyModel( 2 )]
                };

                _assert2.default.deepEqual( data, {
                    model1: 'something result',
                    model2: ['1 result', '2 result']
                } );
            } );
            return function test3() {
                return ref.apply( this, arguments );
            };
        })();

        return test3();
    } );

    it( 'should throw with yields of unknown types', function() {
        var test4 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                try {
                    var a = yield new MyOtherModel();

                    throw new Error( 'lol' );
                } catch( err ) {
                    (0, _assert2.default)( err instanceof TypeError );
                    (0, _assert2.default)( err.message.indexOf( 'yield' ) !== -1 );
                }
            } );
            return function test4() {
                return ref.apply( this, arguments );
            };
        })();

        return test4();
    } );

    it( 'should silently ignore nested yields of unknown types', function() {
        var test5 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                var a = yield {
                    model1: new MyOtherModel()
                };

                _assert2.default.deepEqual( a, {
                    model1: {}
                } );

                (0, _assert2.default)( a.model1 instanceof MyOtherModel );
            } );
            return function test5() {
                return ref.apply( this, arguments );
            };
        })();

        return test5();
    } );

    it( 'should consider classes that inherit from Object as objects', function() {
        var test6 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                try {
                    var a = yield new MyObjectModel( 5 );

                    _assert2.default.strictEqual( a.value, 5 );
                } catch( err ) {
                    (0, _assert2.default)( false );
                }
            } );
            return function test6() {
                return ref.apply( this, arguments );
            };
        })();
    } );
} );
