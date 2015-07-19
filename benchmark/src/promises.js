/**
 * Created by Aaron on 7/19/2015.
 */

import Promise from 'bluebird';
import BluebirdCo from '../../';
import {wrap as coWrapBluebird} from '../co'
import {wrap} from 'co';

suite( 'raw promises', function() {
    set( 'delay', 0 );
    set( 'mintime', 1750 );

    let co_version = wrap( function*() {
        return yield Promise.resolve( 1 );
    } );

    let cob_version = coWrapBluebird( function*() {
        return yield Promise.resolve( 1 );
    } );

    let bluebird_version = async function() {
        return await Promise.resolve( 1 );
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
