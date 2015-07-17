/**
 * Created by Aaron on 7/17/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _Set = require( 'babel-runtime/core-js/set' ).default;

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

function makeSet( length ) {
    var res = new Array( length );
    var i = -1;

    while( ++i < length ) {
        res[i] = i;
    }

    return new _Set( res );
}

suite( 'very short iterables (Set of 2 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeSet( 2 ).values();
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'short iterables (Set of 10 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeSet( 10 ).values();
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'long iterables (Set of 2000 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeSet( 2000 ).values();
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'huge iterables (Set of 10000 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeSet( 10000 ).values();
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
