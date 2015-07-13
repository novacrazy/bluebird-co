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
| very short arrays (2 elements) | co                        | 57,305.65  | 12%  |
|                                | co with bluebird promises | 311,176.74 | 63%  |
|                                | bluebird-co               | 497,635.52 | 100% |
| short arrays (10 elements)     | co                        | 20,824.18  | 6%   |
|                                | co with bluebird promises | 237,646.62 | 65%  |
|                                | bluebird-co               | 365,844.90 | 100% |
| long arrays (2000 elements)    | co                        | 96.04      | 2%   |
|                                | co with bluebird promises | 4,094.03   | 71%  |
|                                | bluebird-co               | 5,792.39   | 100% |
| huge arrays (10000 elements)   | co                        | 9.94       | 1%   |
|                                | co with bluebird promises | 820.75     | 71%  |
|                                | bluebird-co               | 1,148.75   | 100% |

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
| very small objects (2 keys) | co                        | 43,982.40  | 21%  |
|                             | co with bluebird promises | 140,558.21 | 68%  |
|                             | bluebird-co               | 206,197.07 | 100% |
| small objects (10 keys)     | co                        | 16,223.12  | 17%  |
|                             | co with bluebird promises | 62,647.70  | 66%  |
|                             | bluebird-co               | 94,682.32  | 100% |
| large objects (2000 keys)   | co                        | 83.04      | 5%   |
|                             | co with bluebird promises | 784.88     | 48%  |
|                             | bluebird-co               | 1,625.86   | 100% |
| huge objects (10000 keys)   | co                        | 9.14       | 3%   |
|                             | co with bluebird promises | 144.60     | 45%  |
|                             | bluebird-co               | 321.15     | 100% |

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
| simple generators (10 iterations)               | co                        | 80,816.38  | 45%  |
|                                                 | co with bluebird promises | 142,524.14 | 79%  |
|                                                 | bluebird-co               | 180,181.87 | 100% |
| long-running generators (1000 iterations)       | co                        | 2,636.11   | 93%  |
|                                                 | co with bluebird promises | 2,706.92   | 96%  |
|                                                 | bluebird-co               | 2,830.89   | 100% |
| very long-running generators (10000 iterations) | co                        | 270.76     | 95%  |
|                                                 | co with bluebird promises | 276.19     | 96%  |
|                                                 | bluebird-co               | 286.41     | 100% |
| complex generators (150 iterations)             | co                        | 11.35      | 2%   |
|                                                 | co with bluebird promises | 529.17     | 72%  |
|                                                 | bluebird-co               | 734.13     | 100% |

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
| simple thunks (1 argument)                           | co                        | 230,426.60 | 46%  |
|                                                      | co with bluebird promises | 389,197.62 | 77%  |
|                                                      | bluebird-co               | 502,426.38 | 100% |
| thunks with many arguments (30 arguments)            | co                        | 87,340.43  | 24%  |
|                                                      | co with bluebird promises | 106,455.19 | 29%  |
|                                                      | bluebird-co               | 368,914.99 | 100% |
| thunks with stupidly many arguments (3000 arguments) | co                        | 1,800.63   | 7%   |
|                                                      | co with bluebird promises | 1,818.82   | 7%   |
|                                                      | bluebird-co               | 25,995.29  | 100% |

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
| top level error handling                    | co                        | 128,375.56 | 100% |
|                                             | co with bluebird promises | 120,872.01 | 94%  |
|                                             | bluebird-co               | 90,423.01  | 70%  |
| nested error handling                       | co                        | 43,040.19  | 76%  |
|                                             | co with bluebird promises | 48,011.09  | 85%  |
|                                             | bluebird-co               | 56,419.27  | 100% |
| deep error handling (after 2000 iterations) | co                        | 1,031.75   | 97%  |
|                                             | co with bluebird promises | 1,038.97   | 98%  |
|                                             | bluebird-co               | 1,061.86   | 100% |










