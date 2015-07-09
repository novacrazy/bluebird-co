/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';

describe( 'yield <invalid>', function() {
    it( 'should throw an error', function() {
        let test1 = async function() {
            try {
                await null;
                throw new Error( 'lol' );

            } catch( err ) {
                assert( err instanceof TypeError );
                assert( ~err.message.indexOf( 'yield' ) );
            }
        };

        return test1();
    } );
} );
