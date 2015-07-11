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

function get( val ) {
    return function( done ) {
        done( null, val );
    };
}

suite( 'simple thunks (1 argument)', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    var co_version = (0, _co.wrap)( function* () {
        return yield function( done ) {
            done( null, 10 );
        };
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield function( done ) {
            done( null, 10 );
        };
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'thunks with many arguments (30 arguments)', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    var co_version = (0, _co.wrap)( function* () {
        return yield function( done ) {
            done( null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );
        };
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield function( done ) {
            done( null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );
        };
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );