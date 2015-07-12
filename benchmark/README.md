Benchmarks
==========

I thought it could be useful to some people to compare the performance of bluebird-co versus tj/co for some common tasks.

Pull requests for new benchmarks are always welcome.

## Preface

As this is effectively a port of tj/co, the performance is about the same when using the same promises, except in situations where I have manually optimized things.

However, it should be kept in mind that bluebird-co is also extensible, and of course works with bluebird.

## Results

Tested with io.js 2.3.0 on Windows 8, Intel i5-4690K at 3.9GHz with 32GB of memory.

| Description                               | Library                   | Milliseconds | Runs    | Op/s       | %    |
|-------------------------------------------|---------------------------|-------------:|--------:|-----------:|-----:|
| very short arrays (2 elements)            | co                        | 682          | 40,129  | 58,800.23  | 12%  |
|                                           | co with bluebird promises | 614          | 193,935 | 315,835.81 | 64%  |
|                                           | bluebird-co               | 650          | 322,729 | 496,432.90 | 100% |
| short arrays (10 elements)                | co                        | 969          | 20,860  | 21,526.26  | 6%   |
|                                           | co with bluebird promises | 805          | 208,808 | 259,293.70 | 71%  |
|                                           | bluebird-co               | 636          | 230,782 | 362,769.25 | 100% |
| long arrays (2000 elements)               | co                        | 1,017        | 100     | 98.34      | 2%   |
|                                           | co with bluebird promises | 906          | 4,796   | 5,296.13   | 100% |
|                                           | bluebird-co               | 931          | 4,889   | 5,251.49   | 99%  |
| very small objects (2 keys)               | co                        | 749          | 33,828  | 45,184.40  | 24%  |
|                                           | co with bluebird promises | 620          | 90,990  | 146,769.29 | 78%  |
|                                           | bluebird-co               | 605          | 113,964 | 188,361.45 | 100% |
| small objects (10 keys)                   | co                        | 885          | 14,866  | 16,798.34  | 23%  |
|                                           | co with bluebird promises | 773          | 48,334  | 62,556.69  | 84%  |
|                                           | bluebird-co               | 734          | 54,416  | 74,129.14  | 100% |
| large objects (2000 keys)                 | co                        | 1,182        | 100     | 84.61      | 11%  |
|                                           | co with bluebird promises | 627          | 493     | 785.71     | 100% |
|                                           | bluebird-co               | 624          | 486     | 779.25     | 99%  |
| simple generators (10 iterations)         | co                        | 735          | 61,605  | 83,852.56  | 48%  |
|                                           | co with bluebird promises | 721          | 102,236 | 141,764.26 | 80%  |
|                                           | bluebird-co               | 645          | 113,624 | 176,115.17 | 100% |
| long-running generators (1000 iterations) | co                        | 514          | 1,372   | 2,668.78   | 97%  |
|                                           | co with bluebird promises | 525          | 1,446   | 2,754.67   | 100% |
|                                           | bluebird-co               | 522          | 1,422   | 2,724.45   | 99%  |
| complex generators                        | co                        | 17,149       | 200     | 11.66      | 2%   |
|                                           | co with bluebird promises | 869          | 467     | 537.38     | 100% |
|                                           | bluebird-co               | 866          | 465     | 536.74     | 100% |
| simple thunks (1 argument)                | co                        | 760          | 187,069 | 246,297.68 | 48%  |
|                                           | co with bluebird promises | 679          | 252,647 | 372,220.06 | 73%  |
|                                           | bluebird-co               | 618          | 316,738 | 512,259.63 | 100% |
| thunks with many arguments (30 arguments) | co                        | 962          | 85,488  | 88,908.29  | 23%  |
|                                           | co with bluebird promises | 898          | 93,302  | 103,901.67 | 27%  |
|                                           | bluebird-co               | 693          | 267,119 | 385,198.91 | 100% |
| top level error handling                  | co                        | 747          | 100,358 | 134,280.76 | 100% |
|                                           | co with bluebird promises | 835          | 97,813  | 117,137.04 | 87%  |
|                                           | bluebird-co               | 756          | 68,953  | 91,205.77  | 68%  |
| nested error handling                     | co                        | 533          | 23,311  | 43,745.51  | 65%  |
|                                           | co with bluebird promises | 878          | 37,714  | 42,931.07  | 64%  |
|                                           | bluebird-co               | 815          | 54,587  | 66,979.25  | 100% |








