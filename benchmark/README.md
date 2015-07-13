Benchmarks
==========

I thought it could be useful to some people to compare the performance of bluebird-co versus tj/co for some common tasks.

Pull requests for new benchmarks are always welcome.

## Results

Tested with io.js 2.3.0 on Windows 8, Intel i5-4690K at 3.9GHz with 32GB of memory.

### Arrays

Example:
```javascript
async function() {
    let res = await [asyncFunc1(), asyncFunc2(), somePromise, 42];
}
```

| Description                    | Library                   | Op/s       | %    |
|--------------------------------|---------------------------|-----------:|-----:|
| very short arrays (2 elements) | co                        | 60,110.84  | 12%  |
|                                | co with bluebird promises | 325,417.66 | 63%  |
|                                | bluebird-co               | 513,701.81 | 100% |
| short arrays (10 elements)     | co                        | 21,557.60  | 6%   |
|                                | co with bluebird promises | 242,083.21 | 65%  |
|                                | bluebird-co               | 371,892.44 | 100% |
| long arrays (2000 elements)    | co                        | 98.95      | 2%   |
|                                | co with bluebird promises | 4,010.31   | 70%  |
|                                | bluebird-co               | 5,755.19   | 100% |
| huge arrays (10000 elements)   | co                        | 10.00      | 1%   |
|                                | co with bluebird promises | 811.64     | 70%  |
|                                | bluebird-co               | 1,156.42   | 100% |

### Objects

Example:
```javascript
async function() {
    let res = await {
        a: asyncFunc1(),
        b: asyncFunc2(),
        c: somePromise,
        d: 42
    };
}
```

| Description                 | Library                   | Op/s       | %    |
|-----------------------------|---------------------------|-----------:|-----:|
| very small objects (2 keys) | co                        | 44,629.48  | 21%  |
|                             | co with bluebird promises | 147,870.53 | 69%  |
|                             | bluebird-co               | 214,317.21 | 100% |
| small objects (10 keys)     | co                        | 16,706.10  | 16%  |
|                             | co with bluebird promises | 64,139.37  | 63%  |
|                             | bluebird-co               | 101,359.61 | 100% |
| large objects (2000 keys)   | co                        | 83.88      | 5%   |
|                             | co with bluebird promises | 780.17     | 49%  |
|                             | bluebird-co               | 1,599.70   | 100% |
| huge objects (10000 keys)   | co                        | 9.22       | 3%   |
|                             | co with bluebird promises | 144.56     | 46%  |
|                             | bluebird-co               | 315.27     | 100% |

### Generators

Example:
```javascript
function* test(iterations){
    let i = 0;

    while(i++ < iterations) {
        yield Promise.resolve(i);
    }
}

async function() {
    await test(100);
}

//what even is this
function* complex_generator( iterations ) {
    let test3 = new Array( iterations );

    for( let i = 0; i < iterations; i++ ) {
        test3[i] = Promise.resolve( i );
    }

    for( let i = 0; i < iterations; i++ ) {
        yield [yield Promise.resolve( i ), {
            test:  yield Promise.resolve( i ),
            test2: Promise.resolve( i + 1 ),
            test3: test3
        }];
    }
}
```

| Description                                     | Library                   | Op/s       | %    |
|-------------------------------------------------|---------------------------|-----------:|-----:|
| simple generators (10 iterations)               | co                        | 81,600.06  | 45%  |
|                                                 | co with bluebird promises | 140,149.23 | 78%  |
|                                                 | bluebird-co               | 179,727.26 | 100% |
| long-running generators (1000 iterations)       | co                        | 2,613.44   | 93%  |
|                                                 | co with bluebird promises | 2,703.39   | 97%  |
|                                                 | bluebird-co               | 2,800.95   | 100% |
| very long-running generators (10000 iterations) | co                        | 270.64     | 95%  |
|                                                 | co with bluebird promises | 274.40     | 96%  |
|                                                 | bluebird-co               | 285.90     | 100% |
| complex generators (150 iterations)             | co                        | 11.49      | 2%   |
|                                                 | co with bluebird promises | 378.77     | 53%  |
|                                                 | bluebird-co               | 717.48     | 100% |

### Thunks

Example:
```javascript
function get(value) {
    return function(done) {
        done(null, value); //single argument
    }
}

async function() {
    let value = await get(10);

    console.log(value); //10
}
```

| Description                                          | Library                   | Op/s       | %    |
|------------------------------------------------------|---------------------------|-----------:|-----:|
| simple thunks (1 argument)                           | co                        | 240,025.50 | 47%  |
|                                                      | co with bluebird promises | 389,963.06 | 76%  |
|                                                      | bluebird-co               | 510,063.03 | 100% |
| thunks with many arguments (30 arguments)            | co                        | 86,804.70  | 23%  |
|                                                      | co with bluebird promises | 105,550.79 | 28%  |
|                                                      | bluebird-co               | 373,308.52 | 100% |
| thunks with stupidly many arguments (3000 arguments) | co                        | 1,796.47   | 6%   |
|                                                      | co with bluebird promises | 1,786.19   | 6%   |
|                                                      | bluebird-co               | 29,045.38  | 100% |

### Error handling

Example:
```javascript
//Top level error
async function() {
    await undefined;
}

//nested error
async function() {
    await function*() {
        yield undefined;
    }
}

//deep error
async function() {
    let i = 0;

    await function*() {
        if(i++ > 2000) throw new Error();

        yield Promise.resolve(i);
    }
}
```

| Description                                 | Library                   | Op/s       | %    |
|---------------------------------------------|---------------------------|-----------:|-----:|
| top level error handling                    | co                        | 130,922.16 | 100% |
|                                             | co with bluebird promises | 117,860.14 | 90%  |
|                                             | bluebird-co               | 93,634.82  | 72%  |
| nested error handling                       | co                        | 44,817.42  | 90%  |
|                                             | co with bluebird promises | 49,990.83  | 100% |
|                                             | bluebird-co               | 49,227.76  | 98%  |
| deep error handling (after 2000 iterations) | co                        | 1,190.83   | 87%  |
|                                             | co with bluebird promises | 1,318.86   | 96%  |
|                                             | bluebird-co               | 1,375.38   | 100% |










