/**
 * Created by Aaron on 8/4/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';
import {createReadStream} from 'fs';

import BluebirdCo from '../../';

describe( 'yielding streams', function() {
    it( 'should handle file readable file streams', function() {
        let test1 = async function() {
            let res = await createReadStream( 'index.js' );

            assert( Buffer.isBuffer( res ) );
            assert( ~res.toString( 'utf-8' ).indexOf( 'exports' ) );
        };

        return test1();
    } );

    it( 'should handle file readable file streams with encoding', function() {
        let test2 = async function() {
            let res = await createReadStream( 'index.js', {
                encoding: 'utf-8'
            } );

            assert.strictEqual( typeof res, 'string' );
            assert( ~res.indexOf( 'exports' ) );
        };

        return test2();
    } );
} );
