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

function makeArray( length ) {
    var res = [];

    for( var i = 0; i < length; i++ ) {
        res.push( _bluebird2.default.resolve( i ) );
    }

    return res;
}

suite( 'very short arrays (2 elements)', function() {
    set( 'delay', 0 );
    set( 'iterations', 1000 );

    var co_version = (0, _co.wrap)( function* () {
        return yield makeArray( 2 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeArray( 2 );
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'short arrays (10 elements)', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    var co_version = (0, _co.wrap)( function* () {
        return yield makeArray( 10 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeArray( 10 );
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'long arrays (2000 elements)', function() {
    set( 'delay', 0 );

    var co_version = (0, _co.wrap)( function* () {
        return yield makeArray( 2000 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeArray( 2000 );
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
