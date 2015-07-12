/**
 * Created by Aaron on 7/11/2015.
 */

'use strict';

var _bluebird = require( 'bluebird' );

var _interopRequireDefault = require( 'babel-runtime/helpers/interop-require-default' ).default;

var _bluebird2 = _interopRequireDefault( _bluebird );

var _ = require( '../../' );

var _2 = _interopRequireDefault( _ );

var _co = require( '../co' );

var _co2 = require( 'co' );

function* gen() {
    yield null;
}

suite( 'top level error handling', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    var co_version = (0, _co2.wrap)( function* () {
        try {
            return yield null;
        } catch( err ) {
        }
    } );

    var cob_version = (0, _co.wrap)( function* () {
        try {
            return yield null;
        } catch( err ) {
        }
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        try {
            return yield null;
        } catch( err ) {
        }
    } );

    bench( 'co', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'co with bluebird promises', function( next ) {
        cob_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'nested error handling', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    var co_version = (0, _co2.wrap)( function* () {
        try {
            return yield gen();
        } catch( err ) {
        }
    } );

    var cob_version = (0, _co.wrap)( function* () {
        try {
            return yield gen();
        } catch( err ) {
        }
    } );

    var bluebird_version = _bluebird.coroutine( function* () {
        try {
            return yield gen();
        } catch( err ) {
        }
    } );

    bench( 'co', function( next ) {
        co_version().then( next, console.error );
    } );

    bench( 'co with bluebird promises', function( next ) {
        cob_version().then( next, console.error );
    } );

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
