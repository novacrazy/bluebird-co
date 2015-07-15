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
| very short arrays (2 elements) | co                        | 56,615.51  | 11%  |
|                                | co with bluebird promises | 308,617.23 | 61%  |
|                                | bluebird-co               | 504,797.70 | 100% |
| short arrays (10 elements)     | co                        | 20,965.70  | 6%   |
|                                | co with bluebird promises | 235,839.29 | 64%  |
|                                | bluebird-co               | 370,453.45 | 100% |
| long arrays (2000 elements)    | co                        | 97.27      | 2%   |
|                                | co with bluebird promises | 4,062.06   | 70%  |
|                                | bluebird-co               | 5,775.32   | 100% |
| huge arrays (10000 elements)   | co                        | 9.84       | 1%   |
|                                | co with bluebird promises | 810.03     | 70%  |
|                                | bluebird-co               | 1,158.01   | 100% |

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
| very small objects (2 keys) | co                        | 44,173.26  | 20%  |
|                             | co with bluebird promises | 142,329.98 | 64%  |
|                             | bluebird-co               | 222,107.17 | 100% |
| small objects (10 keys)     | co                        | 16,695.45  | 16%  |
|                             | co with bluebird promises | 60,087.91  | 59%  |
|                             | bluebird-co               | 102,039.40 | 100% |
| large objects (2000 keys)   | co                        | 83.20      | 5%   |
|                             | co with bluebird promises | 777.18     | 48%  |
|                             | bluebird-co               | 1,606.68   | 100% |
| huge objects (10000 keys)   | co                        | 9.12       | 3%   |
|                             | co with bluebird promises | 143.99     | 46%  |
|                             | bluebird-co               | 315.81     | 100% |

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
| simple generators (10 iterations)               | co                        | 81,198.79  | 46%  |
|                                                 | co with bluebird promises | 138,836.68 | 79%  |
|                                                 | bluebird-co               | 176,434.47 | 100% |
| long-running generators (1000 iterations)       | co                        | 2,608.47   | 93%  |
|                                                 | co with bluebird promises | 2,722.01   | 97%  |
|                                                 | bluebird-co               | 2,805.09   | 100% |
| very long-running generators (10000 iterations) | co                        | 269.48     | 95%  |
|                                                 | co with bluebird promises | 275.47     | 97%  |
|                                                 | bluebird-co               | 283.32     | 100% |
| complex generators (150 iterations)             | co                        | 11.20      | 2%   |
|                                                 | co with bluebird promises | 379.30     | 52%  |
|                                                 | bluebird-co               | 732.85     | 100% |

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
| simple thunks (1 argument)                           | co                        | 243,004.57 | 48%  |
|                                                      | co with bluebird promises | 384,655.99 | 75%  |
|                                                      | bluebird-co               | 509,505.78 | 100% |
| simple thunks (3 arguments)                          | co                        | 157,549.33 | 39%  |
|                                                      | co with bluebird promises | 221,342.49 | 54%  |
|                                                      | bluebird-co               | 409,007.03 | 100% |
| thunks with many arguments (30 arguments)            | co                        | 86,335.78  | 23%  |
|                                                      | co with bluebird promises | 104,157.38 | 28%  |
|                                                      | bluebird-co               | 371,497.15 | 100% |
| thunks with stupidly many arguments (3000 arguments) | co                        | 1,785.45   | 6%   |
|                                                      | co with bluebird promises | 1,795.98   | 6%   |
|                                                      | bluebird-co               | 28,598.92  | 100% |

### Error handling

Note: This one is here for full disclosure that bluebird-co is indeed slower when it comes to error handling. This is partly because errors have to go through the `Bluebird.coroutine` circuitry instead of being passed/thrown directly back like co does. However, unless you plan on throwing fifty thousand errors per second, it shouldn't ever be an issue.

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
| top level error handling                    | co                        | 130,687.94 | 100% |
|                                             | co with bluebird promises | 118,835.75 | 91%  |
|                                             | bluebird-co               | 90,906.81  | 70%  |
| nested error handling                       | co                        | 40,006.95  | 73%  |
|                                             | co with bluebird promises | 45,711.56  | 83%  |
|                                             | bluebird-co               | 54,995.72  | 100% |
| deep error handling (after 2000 iterations) | co                        | 923.73     | 89%  |
|                                             | co with bluebird promises | 997.34     | 96%  |
|                                             | bluebird-co               | 1,034.89   | 100% |
