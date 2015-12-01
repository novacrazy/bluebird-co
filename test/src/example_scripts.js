/**
 * Created by Aaron on 7/9/2015.
 */

import Promise from 'bluebird';
import assert from 'assert';
import {readFile} from 'fs';

let readFileAsync = Promise.promisify( readFile );

async function myAsyncFunction() {
    let results = await [
        Promise.delay( 10 ).return( 42 ),
        readFileAsync( 'index.js', 'utf-8' ),
        [1, Promise.resolve( 12 )]
    ];


    assert.strictEqual( results[0], 42 );
    assert( results[1].indexOf( 'exports' ) !== -1 );
    assert.strictEqual( results[2][0], 1 );
    assert.strictEqual( results[2][1], 12 );
}

describe( 'Example function from README', function() {
    it( 'should work normally', function() {
        return myAsyncFunction();
    } )
} );
