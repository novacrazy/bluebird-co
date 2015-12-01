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

_2.default.addYieldHandler( function( value ) {
    if( value === 13 ) {
        return _bluebird2.default.resolve( 10 );
    }
} );
/**
 * Created by Aaron on 7/10/2015.
 */

class MyModel {
    constructor( value ) {
        this._value = value;
    }

    fetch() {
        return _bluebird2.default.resolve( this._value + ' result' );
    }
}

class MyOtherModel extends Object {
}

_2.default.addYieldHandler( function( value ) {
    if( value instanceof MyModel ) {
        return value.fetch();
    }
} );

describe( 'yield with custom handler', function() {
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

    it( 'should throw with yields of unknown types, even if they inherit from Object', function() {
        var test4 = (function() {
            var ref = (0, _bluebird.coroutine)( function* () {
                try {
                    var a = yield new MyOtherModel();

                    throw new Error( 'lol' );
                } catch( err ) {
                    (0, _assert2.default)( err instanceof TypeError );
                    (0, _assert2.default)( ~err.message.indexOf( 'yield' ) );
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
} );
