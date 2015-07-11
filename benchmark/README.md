Benchmarks
==========

I thought it could be useful to some people to compare the performance of bluebird-co versus tj/co for some common tasks.

Pull requests for new benchmarks are always welcome.

##Results

Tested with io.js 2.3.0 on Windows 8, Intel i5-4690K at 3.9GHz with 32GB of memory.

| Description                                        | Library     | Milliseconds | Iterations | op/s       |
|----------------------------------------------------|-------------|-------------:|-----------:|-----------:|
| very short arrays (2 elements)                     | co          | 669.7        | 35,894     | 53,595.19  |
|                                                    | bluebird-co | 648.9        | 109,088    | 168,119.04 |
| short arrays (10 elements)                         | co          | 940.1        | 19,152     | 20,371.31  |
|                                                    | bluebird-co | 816.3        | 98,754     | 120,975.36 |
| long arrays (2000 elements)                        | co          | 1,036.6      | 100        | 96.47      |
|                                                    | bluebird-co | 534.9        | 954        | 1,783.55   |
| small object (10 keys)                             | co          | 845.6        | 13,603     | 16,085.97  |
|                                                    | bluebird-co | 703.6        | 40,586     | 57,687.12  |
| large objects (2000 keys)                          | co          | 1,218.6      | 100        | 82.06      |
|                                                    | bluebird-co | 659.6        | 390        | 591.29     |
| simple generators (10 iterations)                  | co          | 746.6        | 59,949     | 80,299.57  |
|                                                    | bluebird-co | 651.3        | 68,594     | 105,311.19 |
| long-running generators (1000 iterations)          | co          | 523.0        | 1,397      | 2,671.11   |
|                                                    | bluebird-co | 557.2        | 872        | 1,565.03   |
| complex generators (150 iterations * three layers) | co          | 17,558.7     | 200        | 11.39      |
|                                                    | bluebird-co | 1,426.1      | 200        | 140.24     |
| simple thunks (1 argument)                         | co          | 766.8        | 167,255    | 218,125.44 |
|                                                    | bluebird-co | 635.4        | 325,905    | 512,899.37 |
| thunks with many arguments (30 arguments)          | co          | 973.1        | 82,966     | 85,259.73  |
|                                                    | bluebird-co | 718.1        | 271,882    | 378,607.30 |
| top level error handling                           | co          | 762.2        | 98,326     | 129,000.48 |
|                                                    | bluebird-co | 782.1        | 45,677     | 58,399.94  |
| nested error handling                              | co          | 611.3        | 23,280     | 38,082.91  |
|                                                    | bluebird-co | 611.0        | 38,541     | 63,080.83  |


