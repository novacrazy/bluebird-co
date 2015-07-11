/**
 * Created by Aaron on 7/11/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap} from 'co';

function get( val ) {
    return function( done ) {
        done( null, val );
    }
}

suite( 'simple thunks (1 argument)', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    let co_version = wrap( function*() {
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

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );

suite( 'thunks with many arguments (30 arguments)', function() {
    set( 'delay', 0 );
    set( 'iterations', 500 );

    let co_version = wrap( function*() {
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

    bench( 'bluebird-co', function( next ) {
        bluebird_version().then( next, console.error );
    } );
} );
