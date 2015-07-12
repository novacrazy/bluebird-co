Benchmarks
==========

I thought it could be useful to some people to compare the performance of bluebird-co versus tj/co for some common tasks.

Pull requests for new benchmarks are always welcome.

## Preface

As this is effectively a port of tj/co, the performance is about the same when using the same promises, except in situations where I have manually optimized things.

However, it should be kept in mind that bluebird-co is also extensible, and of course works with bluebird.

## Results

Tested with io.js 2.3.0 on Windows 8, Intel i5-4690K at 3.9GHz with 32GB of memory.

| Description                                        | Library                   | Milliseconds | Iterations | Op/s       |
|----------------------------------------------------|---------------------------|-------------:|-----------:|-----------:|
| very short arrays (2 elements)                     | co                        | 694          | 37,438     | 53,919.81  |
|                                                    | co with bluebird promises | 624          | 174,839    | 280,098.63 |
|                                                    | bluebird-co               | 655          | 271,854    | 414,738.61 |
| short arrays (10 elements)                         | co                        | 841          | 17,287     | 20,555.11  |
|                                                    | co with bluebird promises | 661          | 157,153    | 237,591.88 |
|                                                    | bluebird-co               | 654          | 203,780    | 311,564.43 |
| long arrays (2000 elements)                        | co                        | 997          | 100        | 100.30     |
|                                                    | co with bluebird promises | 959          | 5,023      | 5,236.07   |
|                                                    | bluebird-co               | 968          | 4,724      | 4,882.31   |
| small object (10 keys)                             | co                        | 858          | 13,743     | 16,012.54  |
|                                                    | co with bluebird promises | 680          | 40,399     | 59,391.60  |
|                                                    | bluebird-co               | 718          | 48,287     | 67,287.30  |
| large objects (2000 keys)                          | co                        | 1,188        | 100        | 84.16      |
|                                                    | co with bluebird promises | 625          | 493        | 789.37     |
|                                                    | bluebird-co               | 611          | 478        | 782.56     |
| simple generators (10 iterations)                  | co                        | 754          | 58,250     | 77,247.69  |
|                                                    | co with bluebird promises | 663          | 89,644     | 135,150.30 |
|                                                    | bluebird-co               | 611          | 104,772    | 171,541.35 |
| long-running generators (1000 iterations)          | co                        | 514          | 1,405      | 2,733.27   |
|                                                    | co with bluebird promises | 504          | 1,427      | 2,829.08   |
|                                                    | bluebird-co               | 937          | 2,631      | 2,807.86   |
| complex generators (150 iterations * three layers) | co                        | 16,998       | 200        | 11.77      |
|                                                    | co with bluebird promises | 865          | 461        | 532.94     |
|                                                    | bluebird-co               | 913          | 440        | 481.75     |
| simple thunks (1 argument)                         | co                        | 739          | 168,264    | 227,790.55 |
|                                                    | co with bluebird promises | 670          | 252,895    | 377,736.72 |
|                                                    | bluebird-co               | 615          | 305,615    | 496,898.60 |
| thunks with many arguments (30 arguments)          | co                        | 932          | 81,043     | 86,950.36  |
|                                                    | co with bluebird promises | 877          | 92,006     | 104,959.59 |
|                                                    | bluebird-co               | 718          | 263,072    | 366,319.74 |
| top level error handling                           | co                        | 746          | 92,099     | 123,539.49 |
|                                                    | co with bluebird promises | 849          | 97,833     | 115,177.43 |
|                                                    | bluebird-co               | 738          | 65,805     | 89,154.46  |
| nested error handling                              | co                        | 575          | 22,310     | 38,787.30  |
|                                                    | co with bluebird promises | 705          | 34,523     | 48,975.25  |
|                                                    | bluebird-co               | 992          | 51,336     | 51,738.62  |






