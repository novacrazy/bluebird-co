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

| Description                                          | Library                   | Op/s       | %    |
|------------------------------------------------------|---------------------------|-----------:|-----:|
| very short arrays (2 elements)                       | co                        | 58,512.13  | 12%  |
|                                                      | co with bluebird promises | 307,400.39 | 64%  |
|                                                      | bluebird-co               | 477,988.78 | 100% |
| short arrays (10 elements)                           | co                        | 21,489.69  | 6%   |
|                                                      | co with bluebird promises | 227,077.08 | 66%  |
|                                                      | bluebird-co               | 344,727.34 | 100% |
| long arrays (2000 elements)                          | co                        | 99.36      | 2%   |
|                                                      | co with bluebird promises | 4,067.86   | 74%  |
|                                                      | bluebird-co               | 5,485.33   | 100% |
| huge arrays (10000 elements)                         | co                        | 10.12      | 1%   |
|                                                      | co with bluebird promises | 821.16     | 76%  |
|                                                      | bluebird-co               | 1,085.52   | 100% |

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

| Description                                          | Library                   | Op/s       | %    |
|------------------------------------------------------|---------------------------|-----------:|-----:|
| very small objects (2 keys)                          | co                        | 45,015.79  | 22%  |
|                                                      | co with bluebird promises | 143,935.23 | 69%  |
|                                                      | bluebird-co               | 207,940.48 | 100% |
| small objects (10 keys)                              | co                        | 16,569.27  | 18%  |
|                                                      | co with bluebird promises | 63,226.58  | 67%  |
|                                                      | bluebird-co               | 94,660.83  | 100% |
| large objects (2000 keys)                            | co                        | 84.29      | 5%   |
|                                                      | co with bluebird promises | 782.12     | 49%  |
|                                                      | bluebird-co               | 1,592.88   | 100% |
| huge objects (10000 keys)                            | co                        | 9.28       | 3%   |
|                                                      | co with bluebird promises | 144.85     | 46%  |
|                                                      | bluebird-co               | 311.59     | 100% |

### Generators

Example:
```javascript
function* test(limit){
    let i = 0;

    while(i++ < limit) {
        yield i;
    }
}

async function() {
    await test(100);
}
```

| Description                                          | Library                   | Op/s       | %    |
|------------------------------------------------------|---------------------------|-----------:|-----:|
| simple generators (10 iterations)                    | co                        | 81,917.15  | 46%  |
|                                                      | co with bluebird promises | 142,707.64 | 80%  |
|                                                      | bluebird-co               | 177,853.99 | 100% |
| long-running generators (1000 iterations)            | co                        | 2,710.78   | 93%  |
|                                                      | co with bluebird promises | 2,825.03   | 97%  |
|                                                      | bluebird-co               | 2,907.93   | 100% |
| very long-running generators (10000 iterations)      | co                        | 279.09     | 94%  |
|                                                      | co with bluebird promises | 288.06     | 97%  |
|                                                      | bluebird-co               | 296.18     | 100% |
| complex generators (150 iterations)                  | co                        | 11.70      | 2%   |
|                                                      | co with bluebird promises | 532.28     | 82%  |
|                                                      | bluebird-co               | 652.49     | 100% |

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
| simple thunks (1 argument)                           | co                        | 233,020.90 | 47%  |
|                                                      | co with bluebird promises | 392,572.06 | 80%  |
|                                                      | bluebird-co               | 490,666.79 | 100% |
| thunks with many arguments (30 arguments)            | co                        | 86,731.39  | 24%  |
|                                                      | co with bluebird promises | 103,814.55 | 29%  |
|                                                      | bluebird-co               | 363,314.72 | 100% |
| thunks with stupidly many arguments (3000 arguments) | co                        | 1,803.40   | 7%   |
|                                                      | co with bluebird promises | 1,811.71   | 7%   |
|                                                      | bluebird-co               | 25,981.76  | 100% |

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

        yield i;
    }
}
```

| Description                                          | Library                   | Op/s       | %    |
|------------------------------------------------------|---------------------------|-----------:|-----:|
| top level error handling                             | co                        | 128,262.67 | 100% |
|                                                      | co with bluebird promises | 115,214.34 | 90%  |
|                                                      | bluebird-co               | 88,293.65  | 69%  |
| nested error handling                                | co                        | 40,320.75  | 73%  |
|                                                      | co with bluebird promises | 44,260.58  | 80%  |
|                                                      | bluebird-co               | 55,010.17  | 100% |
| deep error handling (after 2000 iterations)          | co                        | 933.79     | 87%  |
|                                                      | co with bluebird promises | 1,032.73   | 96%  |
|                                                      | bluebird-co               | 1,075.22   | 100% |










