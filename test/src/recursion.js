/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';
import {readFile} from 'fs';

import BluebirdCo from '../../';

let readFileAsync = Promise.promisify( readFile );

describe( 'yield handler recursion', function() {
    it( 'should aggregate arrays within arrays', function() {
        let test1 = async function() {
            let a = readFileAsync( 'index.js', 'utf8' );
            let b = readFileAsync( 'LICENSE', 'utf8' );
            let c = readFileAsync( 'package.json', 'utf8' );

            let res = await [a, [b, c]];

            assert.equal( 2, res.length );
            assert( res[0].indexOf( 'exports' ) !== -1 );
            assert.equal( 2, res[1].length );
            assert( res[1][0].indexOf( 'MIT' ) !== -1 );
            assert( res[1][1].indexOf( 'devDependencies' ) !== -1 );
        };

        return test1();
    } );

    it( 'should aggregate objects within objects', function() {
        let test2 = async function() {
            let a = readFileAsync( 'index.js', 'utf8' );
            let b = readFileAsync( 'LICENSE', 'utf8' );
            let c = readFileAsync( 'package.json', 'utf8' );

            let res = await {
                0: a,
                1: {
                    0: b,
                    1: c
                }
            };

            assert( res[0].indexOf( 'exports' ) !== -1 );
            assert( res[1][0].indexOf( 'MIT' ) !== -1 );
            assert( res[1][1].indexOf( 'devDependencies' ) !== -1 );
        };

        return test2();
    } );
} );
