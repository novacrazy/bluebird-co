/**
 * Created by Aaron on 7/11/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap as coWrapBluebird} from '../co'
import {wrap} from 'co';

function makeArray( length ) {
    let res = new Array( length );
    let i = -1;

    while( ++i < length ) {
        res[i] = Promise.resolve( i );
    }

    return res;
}

suite( 'very short arrays (2 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield makeArray( 2 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeArray( 2 );
    } );

    let bluebird_version = async function() {
        return await makeArray( 2 );
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

suite( 'short arrays (10 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield makeArray( 10 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeArray( 10 );
    } );

    let bluebird_version = async function() {
        return await makeArray( 10 );
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

suite( 'long arrays (2000 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield makeArray( 2000 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeArray( 2000 );
    } );

    let bluebird_version = async function() {
        return await makeArray( 2000 );
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

suite( 'huge arrays (10000 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield makeArray( 10000 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield makeArray( 10000 );
    } );

    let bluebird_version = async function() {
        return await makeArray( 10000 );
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
