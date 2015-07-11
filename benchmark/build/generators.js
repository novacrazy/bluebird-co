/**
 * Created by Aaron on 7/11/2015.
 */

/**
 * Created by Aaron on 7/11/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

var _co = require( 'co' );

function* gen( iterations ) {
    for( var i = 0; i < iterations; i++ ) {
        yield _bluebird2.default.resolve( i );
    }
}

//what even is this
function* gen_complex( iterations ) {
    var test3 = [];

    for( var i = 0; i < iterations; i++ ) {
        test3.push( _bluebird2.default.resolve( i ) );
    }

    for( var i = 0; i < iterations; i++ ) {
        yield [yield _bluebird2.default.resolve( i ), {
            test:  yield _bluebird2.default.resolve( i ),
            test2: _bluebird2.default.resolve( i + 1 ),
            test3: test3
        }];
    }
}

suite( 'simple generators (10 iterations)', function() {
    set( 'delay', 0 );
    set( 'iterations', 200 );

    var co_version = (0, _co.wrap)( function* () {
        return yield gen( 10 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield gen( 10 );
    } );

    bench( 'co', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'long-running generators (1000 iterations)', function() {
    set( 'delay', 0 );

    var co_version = (0, _co.wrap)( function* () {
        return yield gen( 1000 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield gen( 1000 );
    } );

    bench( 'co', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'complex generators (150 iterations * three layers)', function() {
    set( 'delay', 0 );
    set( 'iterations', 200 );

    var co_version = (0, _co.wrap)( function* () {
        return yield gen_complex( 150 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield gen_complex( 150 );
    } );

    bench( 'co', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
