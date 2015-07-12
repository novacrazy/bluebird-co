Benchmarks
==========

I thought it could be useful to some people to compare the performance of bluebird-co versus tj/co for some common tasks.

Pull requests for new benchmarks are always welcome.

## Results

Tested with io.js 2.3.0 on Windows 8, Intel i5-4690K at 3.9GHz with 32GB of memory.

| Description                               | Library                   | Op/s       | %    |
|-------------------------------------------|---------------------------|-----------:|-----:|
| very short arrays (2 elements)            | co                        | 54,608.98  | 11%  |
|                                           | co with bluebird promises | 310,328.62 | 63%  |
|                                           | bluebird-co               | 496,303.05 | 100% |
| short arrays (10 elements)                | co                        | 20,965.12  | 6%   |
|                                           | co with bluebird promises | 255,768.82 | 72%  |
|                                           | bluebird-co               | 356,478.18 | 100% |
| long arrays (2000 elements)               | co                        | 99.57      | 2%   |
|                                           | co with bluebird promises | 5,200.05   | 99%  |
|                                           | bluebird-co               | 5,248.66   | 100% |
| very small objects (2 keys)               | co                        | 42,952.21  | 20%  |
|                                           | co with bluebird promises | 144,525.55 | 68%  |
|                                           | bluebird-co               | 211,063.92 | 100% |
| small objects (10 keys)                   | co                        | 16,380.37  | 17%  |
|                                           | co with bluebird promises | 62,683.17  | 66%  |
|                                           | bluebird-co               | 95,337.66  | 100% |
| large objects (2000 keys)                 | co                        | 84.38      | 5%   |
|                                           | co with bluebird promises | 782.68     | 50%  |
|                                           | bluebird-co               | 1,560.15   | 100% |
| simple generators (10 iterations)         | co                        | 80,715.60  | 46%  |
|                                           | co with bluebird promises | 139,689.68 | 79%  |
|                                           | bluebird-co               | 177,090.84 | 100% |
| long-running generators (1000 iterations) | co                        | 2,723.11   | 98%  |
|                                           | co with bluebird promises | 2,753.66   | 99%  |
|                                           | bluebird-co               | 2,786.04   | 100% |
| complex generators (150 iterations)       | co                        | 11.62      | 2%   |
|                                           | co with bluebird promises | 546.21     | 80%  |
|                                           | bluebird-co               | 679.72     | 100% |
| simple thunks (1 argument)                | co                        | 241,067.73 | 43%  |
|                                           | co with bluebird promises | 383,628.23 | 68%  |
|                                           | bluebird-co               | 563,258.64 | 100% |
| thunks with many arguments (30 arguments) | co                        | 87,489.95  | 22%  |
|                                           | co with bluebird promises | 105,161.41 | 27%  |
|                                           | bluebird-co               | 395,099.99 | 100% |
| top level error handling                  | co                        | 128,097.48 | 100% |
|                                           | co with bluebird promises | 119,443.08 | 93%  |
|                                           | bluebird-co               | 92,890.22  | 73%  |
| nested error handling                     | co                        | 44,814.83  | 68%  |
|                                           | co with bluebird promises | 40,598.88  | 62%  |
|                                           | bluebird-co               | 65,793.94  | 100% |









