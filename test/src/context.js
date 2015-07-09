/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';

let ctx = {
    some: 'thing'
};

describe( 'Promise.coroutine(...).call(this)', function() {
    it( 'should pass the context', function() {
        let test1 = async function() {
            assert.strictEqual( ctx, this );
        };

        return test1.call( ctx );
    } );
} );
