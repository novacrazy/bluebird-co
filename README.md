bluebird-co
=============

A set of yield handlers for Bluebird coroutines.

## Description
This is a port of [tj/co](https://github.com/tj/co) generator coroutines to [bluebird](https://github.com/petkaantonov/bluebird) using [Bluebird.addYieldHandler](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutineaddyieldhandlerfunction-handler---void) to add in a yield handler that can transform all the types of yieldable values tj/co can into normal promises to resolve.

Combined with [Babel's `bluebirdCoroutines`](http://babeljs.io/docs/advanced/transformers/other/bluebird-coroutines/) transformer, you can write easy and compresensive `async/await` functions.

## Usage
`require('bluebird-co')` and done.

## Example coroutine
```javascript
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var myAsyncFunction = Promise.coroutine(function*(){
    var results = yield [Promise.delay( 10 ).return( 42 ),
                         readFileAsync( 'index.js', 'utf-8' ),
                         [1, Promise.resolve( 12 )]];
    
    console.log(results); //[42, "somefile contents", [1, 12]]
});

myAsyncFunction().then(...);
```

## ES7 version
```javascript
import Promise from 'bluebird';
import {readFile} from 'fs';

let readFileAsync = Promise.promisify(readFile);

async function myAsyncFunction() {
    let results = await [Promise.delay( 10 ).return( 42 ),
                         readFileAsync( 'index.js', 'utf-8' ),
                         [1, Promise.resolve( 12 )]];
                         
    console.log(results); //[42, "somefile contents", [1, 12]]
}

myAsyncFunction().then(...);
```

##### For more examples, see the [tj/co README](https://github.com/tj/co/blob/master/Readme.md#examples) and the [Bluebird Coroutines API](https://github.com/petkaantonov/bluebird/blob/master/API.md#generators).

## License

The MIT License (MIT)

Copyright (c) 2015 Aaron Trent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
