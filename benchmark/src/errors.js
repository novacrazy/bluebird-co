/**
 * Created by Aaron on 7/11/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap as coWrapBluebird} from '../co'
import {wrap} from 'co';

function* gen() {
    yield null;
}

function* e() {
    let i = 0;

    while( ++i ) {
        if( i > 2000 ) {
            throw new Error();

        } else {
            yield Promise.resolve( i );
        }
    }
}

suite( 'top level error handling', function() {
    let co_version = wrap( function*() {
        try {
            return yield null;

        } catch( err ) {

        }
    } );

    let cob_version = coWrapBluebird( function*() {
        try {
            return yield null;

        } catch( err ) {

        }
    } );

    let bluebird_version = async function() {
        try {
            return await null;

        } catch( err ) {

        }
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

suite( 'nested error handling', function() {
    let co_version = wrap( function*() {
        try {
            return yield gen();

        } catch( err ) {

        }
    } );

    let cob_version = coWrapBluebird( function*() {
        try {
            return yield gen();

        } catch( err ) {

        }
    } );

    let bluebird_version = async function() {
        try {
            return await gen();

        } catch( err ) {

        }
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

suite( 'deep error handling (after 2000 iterations)', function() {
    let co_version = wrap( function*() {
        try {
            return yield e();

        } catch( err ) {

        }
    } );

    let cob_version = coWrapBluebird( function*() {
        try {
            return yield e();

        } catch( err ) {

        }
    } );

    let bluebird_version = async function() {
        try {
            return await e();

        } catch( err ) {

        }
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
