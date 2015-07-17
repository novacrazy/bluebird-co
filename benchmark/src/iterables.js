/**
 * Created by Aaron on 7/17/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';

function makeSet( length ) {
    let res = new Array( length );
    let i = -1;

    while( ++i < length ) {
        res[i] = i;
    }

    return new Set( res );
}

suite( 'very short iterables (Set of 2 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let bluebird_version = async function() {
        return await makeSet( 2 ).values();
    };

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'short iterables (Set of 10 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let bluebird_version = async function() {
        return await makeSet( 10 ).values();
    };

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'long iterables (Set of 2000 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let bluebird_version = async function() {
        return await makeSet( 2000 ).values();
    };

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'huge iterables (Set of 10000 elements)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let bluebird_version = async function() {
        return await makeSet( 10000 ).values();
    };

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
