/**
 * Created by Aaron on 7/11/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap as coWrapBluebird} from '../co'
import {wrap} from 'co';

function makeObject( size ) {
    let result = {};

    let i = -1;

    while( ++i < size ) {
        result[i] = Promise.resolve( i );
    }

    return result;
}

suite( 'very small objects (2 keys)', function() {
    let co_version = wrap( function*() {
        return yield makeObject( 2 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeObject( 2 );
    } );

    let bluebird_version = async function() {
        return await makeObject( 2 );
    };

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

suite( 'small objects (10 keys)', function() {
    let co_version = wrap( function*() {
        return yield makeObject( 10 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeObject( 10 );
    } );

    let bluebird_version = async function() {
        return await makeObject( 10 );
    };

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

suite( 'large objects (2000 keys)', function() {
    let co_version = wrap( function*() {
        return yield makeObject( 2000 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeObject( 2000 );
    } );

    let bluebird_version = async function() {
        return await makeObject( 2000 );
    };

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

suite( 'huge objects (10000 keys)', function() {
    let co_version = wrap( function*() {
        return yield makeObject( 10000 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeObject( 10000 );
    } );

    let bluebird_version = async function() {
        return await makeObject( 10000 );
    };

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
