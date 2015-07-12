/**
 * Created by Aaron on 7/11/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap as coWrapBluebird} from '../co'
import {wrap} from 'co';

function makeObject( size ) {
    let result = {};

    for( let i = 0; i < size; i++ ) {
        result[i] = Promise.resolve( i );
    }

    return result;
}

suite( 'small object (10 keys)', function() {
    set( 'delay', 0 );

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
    set( 'delay', 0 );

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
