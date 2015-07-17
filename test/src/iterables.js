/**
 * Created by Aaron on 7/17/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';

describe( 'yielding iterables', function() {
    it( 'should work', function() {
        let test1 = async function() {
            let a = await new Set( [Promise.resolve( 1 ), 2, [Promise.resolve( 3 ), 4], 5] ).values();

            assert.deepEqual( a, [1, 2, [3, 4], 5] );
        };

        return test1();
    } );
} );
