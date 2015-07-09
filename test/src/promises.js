/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';

function getPromise( val, err ) {
    return new Promise( function( resolve, reject ) {
        if( err ) {
            reject( err );
        } else {
            resolve( val );
        }
    } );
}

describe( 'yield <promise>', function() {
    describe( 'with one promise yield', function() {
        it( 'should work', function() {
            let test1 = async function() {
                let a = await getPromise( 1 );

                assert.strictEqual( 1, a );
            };

            return test1();
        } );
    } );

    describe( 'with several promise yields', function() {
        it( 'should work', function() {
            let test2 = async function() {
                let a = await getPromise( 1 );
                let b = await getPromise( 2 );
                let c = await getPromise( 3 );

                assert.deepEqual( [1, 2, 3], [a, b, c] );
            };

            return test2();
        } );
    } );

    describe( 'when a promise is rejected', function() {
        it( 'should throw and resume', function() {
            let test3 = async function() {
                let error;

                try {
                    await getPromise( 1, new Error( 'boom' ) );

                } catch( err ) {
                    error = err;
                }

                assert( 'boom' == error.message );

                let ret = await getPromise( 1 );

                assert.strictEqual( 1, ret );
            };

            return test3();
        } );
    } );

    describe( 'when yielding a non-standard promise-like', function() {
        it( 'should return a real Promise', function() {
            let test4 = async function() {
                return await {
                    then: function() {
                    }
                };
            };

            assert( test4() instanceof Promise );
        } );
    } );
} );
