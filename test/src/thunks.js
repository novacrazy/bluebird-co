/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';

import BluebirdCo from '../../';


function get( val, err, error ) {
    return function( done ) {
        if( error ) {
            throw error;
        }
        setTimeout( function() {
            done( err, val );
        }, 10 );
    }
}

describe( 'simple coroutines', function() {
    describe( 'with no yields', function() {
        it( 'should work', function() {
            let test1 = async function() {

            };

            return test1();
        } );
    } );

    describe( 'with one yield', function() {
        it( 'should work', function() {
            let test2 = async function() {
                let a = await get( 1 );
                assert.strictEqual( 1, a );
            };

            return test2();
        } );
    } );

    describe( 'with several yields', function() {
        it( 'should work', function() {
            let test3 = async function() {
                let a = await get( 1 );
                let b = await get( 2 );
                let c = await get( 3 );

                assert.deepEqual( [1, 2, 3], [a, b, c] );
            };

            return test3();
        } );
    } );

    describe( 'with many arguments', function() {
        it( 'should return an array', function() {
            function exec( cmd ) {
                return function( done ) {
                    done( null, 'stdout', 'stderr' );
                }
            }

            let test4 = async function() {
                var out = await exec( 'something' );
                assert.deepEqual( ['stdout', 'stderr'], out );
            };


            return test4();
        } );
    } );

    describe( 'when the function throws', function() {
        it( 'should be caught', function() {
            let test5 = async function() {
                try {
                    let a = await get( 1, null, new Error( 'boom' ) );

                } catch( err ) {
                    assert.strictEqual( 'boom', err.message );
                }
            };

            return test5();
        } );
    } );

    describe( 'when an error is passed then thrown', function() {
        it( 'should only catch the first error only', function() {
            let test6 = async function() {
                return await function( done ) {
                    done( new Error( 'first' ) );

                    throw new Error( 'second' );
                }
            };

            return test6().then( function() {
                throw new Error( 'wtf' );

            }, function( err ) {
                assert.strictEqual( 'first', err.message );
            } );
        } );
    } );

    describe( 'when an error is passed', function() {
        it( 'should throw and resume', function() {
            let test7 = async function() {
                let error;

                try {
                    await get( 1, new Error( 'boom' ) );

                } catch( err ) {
                    error = err;
                }

                assert.strictEqual( 'boom', error.message );
                var ret = await get( 1 );
                assert.strictEqual( 1, ret );
            };

            return test7();
        } );
    } );

    describe( 'with nested coroutines', function() {
        it( 'should work', function() {
            var hit = [];

            let test8 = async function() {
                let a = await get( 1 );
                let b = await get( 2 );
                let c = await get( 3 );
                hit.push( 'one' );

                assert.deepEqual( [1, 2, 3], [a, b, c] );

                await (async function() {
                    hit.push( 'two' );
                    let a = await get( 1 );
                    let b = await get( 2 );
                    let c = await get( 3 );

                    assert.deepEqual( [1, 2, 3], [a, b, c] );

                    await (async function() {
                        hit.push( 'three' );

                        let a = await get( 1 );
                        let b = await get( 2 );
                        let c = await get( 3 );

                        assert.deepEqual( [1, 2, 3], [a, b, c] )
                    })();

                })();

                await (async function() {
                    hit.push( 'four' );
                    let a = await get( 1 );
                    let b = await get( 2 );
                    let c = await get( 3 );

                    assert.deepEqual( [1, 2, 3], [a, b, c] )
                })();

                assert.deepEqual( ['one', 'two', 'three', 'four'], hit );
            };

            return test8();
        } );
    } );

    describe( 'return values', function() {
        describe( 'with a callback', function() {
            it( 'should be passed', function() {
                let test9 = async function() {
                    return [
                        await get( 1 ),
                        await get( 2 ),
                        await get( 3 )
                    ];
                };

                return test9().then( function( res ) {
                    assert.deepEqual( [1, 2, 3], res );
                } );
            } );
        } );

        describe( 'when nested', function() {
            it( 'should return the value', function() {
                let test10 = async function() {
                    var other = await (async function() {
                        return [
                            await get( 4 ),
                            await get( 5 ),
                            await get( 6 )
                        ];
                    })();

                    return [
                        await get( 1 ),
                        await get( 2 ),
                        await get( 3 )
                    ].concat( other );
                };

                return test10().then( function( res ) {
                    assert.deepEqual( [1, 2, 3, 4, 5, 6], res );
                } );
            } );
        } );
    } );

    describe( 'when yielding neither a function nor a promise', function() {
        it( 'should throw', function() {
            let test11 = async function() {
                var errors = [];

                try {
                    let a = await 'something';

                } catch( err ) {
                    errors.push( err.message );
                }

                try {
                    let a = await 'something';

                } catch( err ) {
                    errors.push( err.message );
                }

                assert.strictEqual( 2, errors.length );
                var msg = 'yield';
                assert( ~errors[0].indexOf( msg ) );
                assert( ~errors[1].indexOf( msg ) );
            };

            return test11();
        } );
    } );

    describe( 'with errors', function() {
        it( 'should throw', function() {
            let test12 = async function() {
                var errors = [];

                try {
                    let a = await get( 1, new Error( 'foo' ) );

                } catch( err ) {
                    errors.push( err.message );
                }

                try {
                    let a = await get( 1, new Error( 'bar' ) );

                } catch( err ) {
                    errors.push( err.message );
                }

                assert.deepEqual( ['foo', 'bar'], errors );
            };

            return test12();
        } );

        it( 'should catch errors on .send()', function() {
            let test13 = async function() {
                var errors = [];
                try {
                    let a = await get( 1, null, new Error( 'foo' ) );

                } catch( err ) {
                    errors.push( err.message );
                }

                try {
                    let a = await get( 1, null, new Error( 'bar' ) );

                } catch( err ) {
                    errors.push( err.message );
                }

                assert.deepEqual( ['foo', 'bar'], errors );
            };

            return test13();
        } );

        it( 'should pass future errors to the callback', function() {
            let test14 = async function() {
                await get( 1 );
                await get( 2, null, new Error( 'fail' ) );
                assert( false );
                await get( 3 );
            };

            return test14().catch( function( err ) {
                assert.strictEqual( 'fail', err.message );
            } );
        } );

        it( 'should pass immediate errors to the callback', function() {
            let test15 = async function() {
                await get( 1 );
                await get( 2, new Error( 'fail' ) );
                assert( false );
                await get( 3 );
            };

            return test15().catch( function( err ) {
                assert.strictEqual( 'fail', err.message );
            } );
        } );

        it( 'should catch errors on the first invocation', function() {
            let test16 = async function() {
                throw new Error( 'fail' );
            };

            return test16().catch( function( err ) {
                assert.strictEqual( 'fail', err.message );
            } );
        } );
    } );
} );
