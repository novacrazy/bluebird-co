/**
 * Created by Aaron on 7/9/2015.
 */


import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';

function sleep( ms ) {
    return function( done ) {
        setTimeout( done, ms );
    };
}

function *work() {
    yield sleep( 50 );

    return 'yay';
}

describe( 'Coroutines yielding generators', function() {
    describe( 'with a generator function', function() {
        it( 'should iterate through generators', function() {
            let test1 = async function() {
                let a = await work;
                let b = await work;
                let c = await work;

                assert.strictEqual( 'yay', a );
                assert.strictEqual( 'yay', b );
                assert.strictEqual( 'yay', c );

                let res = await [work, work, work];
                assert.deepEqual( ['yay', 'yay', 'yay'], res );
            };

            return test1();
        } );

        it( 'should catch errors', function() {
            let test2 = async function() {
                return await function *() {
                    throw new Error( 'boom' );
                };
            };

            return test2().then( function() {
                throw new Error( 'wtf' )

            }, function( err ) {
                assert( err );
                assert( err.message == 'boom' );
            } );
        } );
    } );
} );
