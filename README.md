bluebird-co
=============
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![MIT License][license-image]][npm-url]
[![Build Status][build-image]][build-link]

A set of yield handlers for Bluebird coroutines.

## Description
This is a reimplementation of [tj/co](https://github.com/tj/co) generator coroutines using [bluebird](https://github.com/petkaantonov/bluebird) and [Bluebird.addYieldHandler](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutineaddyieldhandlerfunction-handler---void) to add in a yield handler that can transform all the types of yieldable values tj/co can and more into normal promises to resolve.

Combined with [Babel's `bluebirdCoroutines`](http://babeljs.io/docs/advanced/transformers/other/bluebird-coroutines/) transformer, you can write easy and comprehensive `async/await` functions.

## Performance
Given Bluebird's fame for high performance promises, it should come as no surprise that bluebird-co can achieve up to a couple orders of magnitude better performance on some particular tasks than tj/co, with most coroutines being about two to eight times faster with bluebird-co.

[See here for detailed benchmarks](https://github.com/novacrazy/bluebird-co/tree/master/benchmark)

## Usage
`require('bluebird-co')` and done.

or

```javascript
var Promise = require('bluebird');
var BluebirdCo = require('bluebird-co/manual');

Promise.coroutine.addYieldHandler(BluebirdCo.toPromise);
```

##### Usage in detail (to ensure everything works)

`bluebird-co` works by requiring `bluebird` and calling `Bluebird.coroutine.addYieldHandler` to add the appropriate functionality. 

However, to ensure everything works you will need to install `bluebird` before any other module, so it exists in your `node_modules` folder. Then when you install any other module, including `bluebird-co`, they will require the already installed copy of `bluebird` instead of installing another, independent copy in their own `node_modules` folder.

Likewise, if you intend to override `co.wrap`, you will have to install `co` before any module that relies on `co`, that way `koa` and the like will use it instead of installing their own copy.

Your package.json should look something like this:
```json
{
    "...": "...",
    "dependencies": {
        "bluebird":     "^2.9.33",
        "co":           "^4.5.4",
        "bluebird-co":  "^1.0.2"
    },
    "...": "..."
}
```

before installing any other module that relies on those.

#####**NOTE**: Before you delete your package.json out of frustration
You can achieve the desired state of your `node_modules` by simply installing `bluebird`, `co` optionally, then `bluebird-co`, saving them to your `package.json`, then deleting your `node_modules` folder. Then run `npm install`, and it'll install your dependencies without duplicates.

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

## Yieldable types

* Promises
* Arrays
* Objects
* Generators and GeneratorFunctions
* Iterables (like `new Set([1, 2, 3]).values()`)
* Streams (like `fs.createReadStream('index.js')`)
* Functions (as Thunks)
* Custom data types via `BluebirdCo.addYieldHandler`
* Any combination or nesting of the above.

## Overriding `co.wrap`
In my own experience, mixing bluebird coroutines and co/co.wrap can result in less than savory stack traces and other things. Here is a simple way to override almost all common usages of the co library.

```javascript
var Promise = require('bluebird');
var co = require('co');

co.wrap = function(fn) {
    return Promise.coroutine(fn);
}
```

I've been using this method with Koa and a few other libraries for a while now and it seems to work. However, if a library invokes `co` directly, it will fail to replace that. 

## Extra API

#####`BluebirdCo.toPromise(value : any)` -> `Promise | any`
This is the actual yield handler that is used to convert all the supported types into promises which can be resolved by Bluebird's coroutine system. You give it an array, object, thunk, generator or whatever that contains promises and it will try to convert it to a promise that will resolve to be a fully resolved structure.

If you pass in `undefined`, `null`, an instance of a class that doesn't have a yield handler, or an object created with `Object.create(null)`, it will fail and return that value unchanged. Normally this would trigger an error in `Bluebird.coroutine` that can be caught, but `toPromise` by itself will let it silently pass through.

If you require bluebird-co as `require('bluebird-co/manual')`, you can add `toPromise` to your instance of Bluebird or even something else by yourself like this:

```javascript
var Promise = require('bluebird');
var BluebirdCo = require('bluebird-co/manual');

Promise.coroutine.addYieldHandler(BluebirdCo.toPromise);
```

#####`BluebirdCo.addYieldHandler(handler : Function)`
Although this library comes with enough handlers for most occasions, you might need more specific handling of some types that the library cannot handle by default. `BluebirdCo.addYieldHandler` works basically the same as the normal `Bluebird.addYieldHandler` function but interoperates fully with the rest of BluebirdCo's handlers. 

Example:
```javascript
import Promise from 'bluebird';
import BluebirdCo from 'bluebird-co'; //Automatically adds most yield handlers

class MyModel {
    async function fetch() {
        //some async work...
    }
}

BluebirdCo.addYieldHandler(value => {
    if(value instanceof MyModel) {
        return value.fetch();
    }
});

async function getData() {
    let data = await {
        model1: new MyModel('something'),
        model2: [new MyModel(1), new MyModel(2)]
    };
    
    console.log(data); //{model1: 'something result', model2: ['result 1', 'result 2']}
}

getData().then(...);
```

you get the idea.

The normal behavior when yielding unknown values is either to throw an error if it's on the top level (the object in the above example), or to silently ignore it and return it unchanged if it was within an array or object, etc. 

Adding a custom yield handler would allow you to define new behavior for handling unknown types, like automatically fetching data from models in the above example.

-----
#####`BluebirdCo.isThenable(value : any)` -> `boolean`
Alias: `isPromise`

Return true if the value has a `.then` function or is an instance of `Promise`

-----
#####`BluebirdCo.isGenerator(value : any)` -> `boolean`

Returns true if the value is an instance of a generator.

-----
#####`BluebirdCo.isGeneratorFunction(value : any)` -> `boolean`

Returns true if the value is a generator function that when called will create a new generator instance.

-----
## Changelog
#####1.3.1 - 1.3.2
* Significantly improve performance of iterables.

#####1.3.0
* Basic support for Iterables

#####1.2.0
* Allow manual addition of the yield handler via requiring `bluebird-co/manual`
* Exposed `toPromise` function in extra API

#####1.1.2 - 1.1.12
* Optimizations and bugfixes

#####1.1.1
* Don't export `isNativeObject`, because it isn't generic enough to use in most places, only internally under the right circumstances.

#####1.1.0
* Differentiate between native objects and class instances. Fixes `addYieldHandler` functionality when used with class instances, but does not accept class instances as objects when there is not a handler for them.

#####1.0.0 - 1.0.5
* Initial releases, documentation and bugfixes.

-----
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

[npm-image]: https://img.shields.io/npm/v/bluebird-co.svg?style=flat
[npm-url]: https://npmjs.org/package/bluebird-co
[downloads-image]: https://img.shields.io/npm/dm/bluebird-co.svg?style=flat
[build-image]: https://travis-ci.org/novacrazy/bluebird-co.svg?branch=master
[build-link]: https://travis-ci.org/novacrazy/bluebird-co
[license-image]: https://img.shields.io/npm/l/bluebird-co.svg?style=flat
