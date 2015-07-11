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

function makeObject( size ) {
    var result = {};

    for( var i = 0; i < size; i++ ) {
        result[i] = _bluebird2.default.resolve( i );
    }

    return result;
}

suite( 'small object (10 keys)', function() {
    set( 'delay', 0 );

    var co_version = (0, _co.wrap)( function* () {
        return yield makeObject( 10 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeObject( 10 );
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'large objects (2000 keys)', function() {
    set( 'delay', 0 );

    var co_version = (0, _co.wrap)( function* () {
        return yield makeObject( 2000 );
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        return yield makeObject( 2000 );
    } );

    bench( 'co.wrap', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
