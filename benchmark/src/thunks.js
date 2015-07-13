/**
 * Created by Aaron on 7/11/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap as coWrapBluebird} from '../co'
import {wrap} from 'co';

function get( val ) {
    return function( done ) {
        done( null, val );
    }
}

let args = new Array( 3000 );

let i = 0;

while( ++i < 3000 ) {
    args[i] = i;
}

args[0] = null;

suite( 'simple thunks (1 argument)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield function( done ) {
            done( null, 10 );
        };
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield function( done ) {
            done( null, 10 );
        };
    } );

    let bluebird_version = async function() {
        return await function( done ) {
            done( null, 10 );
        };
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

suite( 'thunks with many arguments (30 arguments)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield function( done ) {
            done( null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );
        };
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield function( done ) {
            done( null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );
        };
    } );

    let bluebird_version = async function() {
        return await function( done ) {
            done( null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );
        };
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

suite( 'thunks with stupidly many arguments (3000 arguments)', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield function( done ) {
            done.apply( null, args );
        };
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield function( done ) {
            done.apply( null, args );
        };
    } );

    let bluebird_version = async function() {
        return await function( done ) {
            done.apply( null, args );
        };
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
