/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';
import {readFile} from 'fs';

import BluebirdCo from '../../';

let readFileAsync = Promise.promisify( readFile );

class Pet {
    constructor( name ) {
        this.name = name;
    }

    something() {

    }
}

describe( 'Coroutines yielding objects', function() {
    it( 'should aggregate several thunks', function() {
        let test1 = async function() {
            let a = readFileAsync( 'index.js', 'utf8' );
            let b = readFileAsync( 'LICENSE', 'utf8' );
            let c = readFileAsync( 'package.json', 'utf8' );

            let res = await {
                a: a,
                b: b,
                c: c
            };

            assert.strictEqual( 3, Object.keys( res ).length );
            assert( res.a.indexOf( 'exports' ) !== -1 );
            assert( res.b.indexOf( 'MIT' ) !== -1 );
            assert( res.c.indexOf( 'devDependencies' ) !== -1 );
        };

        return test1();
    } );

    it( 'should noop with no args', function() {
        let test2 = async function() {
            let res = await {};
            assert.strictEqual( 0, Object.keys( res ).length );
        };

        return test2();
    } );

    it( 'should ignore non-thunkable properties', function() {
        let test3 = async function() {
            let foo = {
                name:      {first: 'tobi'},
                age:       2,
                address:   readFileAsync( 'index.js', 'utf8' ),
                tobi:      new Pet( 'tobi' ),
                falsey:    false,
                nully:     null,
                undefiney: undefined
            };

            let res = await foo;

            assert.equal( 'tobi', res.name.first );
            assert.equal( 2, res.age );
            assert.equal( 'tobi', res.tobi.name );
            assert.equal( false, foo.falsey );
            assert.equal( null, foo.nully );
            assert.equal( undefined, foo.undefiney );
            assert( res.address.indexOf( 'exports' ) !== -1 );
        };

        return test3();
    } );

    it( 'should preserve key order', function() {
        function timedThunk( time ) {
            return function( cb ) {
                setTimeout( cb, time );
            }
        }

        let test4 = async function() {
            var before = {
                sun:  timedThunk( 30 ),
                rain: timedThunk( 20 ),
                moon: timedThunk( 10 )
            };

            var after = await before;

            var orderBefore = Object.keys( before ).join( ',' );
            var orderAfter = Object.keys( after ).join( ',' );
            assert.equal( orderBefore, orderAfter );
        };

        return test4();
    } );
} );
