/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';
import {readFile} from 'fs';

import BluebirdCo from '../../';

let readFileAsync = Promise.promisify( readFile );

describe( 'Promise.coroutine(* -> yield [])', function() {
    it( 'should aggregate several thunks', function() {
        let test1 = async function() {
            let a = readFileAsync( 'index.js', 'utf8' );
            let b = readFileAsync( 'LICENSE', 'utf8' );
            let c = readFileAsync( 'package.json', 'utf8' );

            let res = await [a, b, c];
            assert.strictEqual( 3, res.length );
            assert( ~res[0].indexOf( 'exports' ) );
            assert( ~res[1].indexOf( 'MIT' ) );
            assert( ~res[2].indexOf( 'devDependencies' ) );
        };

        return test1();
    } );

    it( 'should noop with no args', function() {
        let test2 = async function() {
            let res = await [];
            assert.strictEqual( 0, res.length );
        };

        return test2();
    } );

    it( 'should support an array of generators', function() {
        let test3 = async function() {
            let val = await [function*() {
                return 1;
            }()];
            assert.deepEqual( val, [1] )
        };

        return test3();
    } );
} );
