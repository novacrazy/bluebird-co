/**
 * Created by Aaron on 7/10/2015.
 */


import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';

let enabled = true;

BluebirdCo.addYieldHandler( function( value ) {
    if( value === 13 && enabled ) {
        return Promise.resolve( 10 );
    }
} );

describe( 'yield null with custom handler', function() {
    it( 'should work', function() {
        let test1 = async function() {
            let res = await 13;

            assert.strictEqual( res, 10 );

            enabled = false;
        };

        return test1();
    } );
} );
