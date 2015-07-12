Benchmarks
==========

I thought it could be useful to some people to compare the performance of bluebird-co versus tj/co for some common tasks.

Pull requests for new benchmarks are always welcome.

## Preface

As this is effectively a port of tj/co, the performance is about the same when using the same promises, except in situations where I have manually optimized things.

However, it should be kept in mind that bluebird-co is also extensible, and of course works with bluebird.

## Results

Tested with io.js 2.3.0 on Windows 8, Intel i5-4690K at 3.9GHz with 32GB of memory.

| Description                                        | Library                   | Milliseconds | Runs   | Op/s      | %    |
|----------------------------------------------------|---------------------------|-------------:|-------:|----------:|------|
| very short arrays (2 elements)                     | co                        | 682          | 40129  | 58800.23  | 12%  |
|                                                    | co with bluebird promises | 614          | 193935 | 315835.81 | 64%  |
|                                                    | bluebird-co               | 650          | 322729 | 496432.90 | 100% |
| short arrays (10 elements)                         | co                        | 969          | 20860  | 21526.26  | 6%   |
|                                                    | co with bluebird promises | 805          | 208808 | 259293.70 | 71%  |
|                                                    | bluebird-co               | 636          | 230782 | 362769.25 | 100% |
| long arrays (2000 elements)                        | co                        | 1017         | 100    | 98.34     | 2%   |
|                                                    | co with bluebird promises | 906          | 4796   | 5296.13   | 100% |
|                                                    | bluebird-co               | 931          | 4889   | 5251.49   | 99%  |
| very small objects (2 keys)                        | co                        | 749          | 33828  | 45184.40  | 24%  |
|                                                    | co with bluebird promises | 620          | 90990  | 146769.29 | 78%  |
|                                                    | bluebird-co               | 605          | 113964 | 188361.45 | 100% |
| small objects (10 keys)                            | co                        | 885          | 14866  | 16798.34  | 23%  |
|                                                    | co with bluebird promises | 773          | 48334  | 62556.69  | 84%  |
|                                                    | bluebird-co               | 734          | 54416  | 74129.14  | 100% |
| large objects (2000 keys)                          | co                        | 1182         | 100    | 84.61     | 11%  |
|                                                    | co with bluebird promises | 627          | 493    | 785.71    | 100% |
|                                                    | bluebird-co               | 624          | 486    | 779.25    | 99%  |
| simple generators (10 iterations)                  | co                        | 735          | 61605  | 83852.56  | 48%  |
|                                                    | co with bluebird promises | 721          | 102236 | 141764.26 | 80%  |
|                                                    | bluebird-co               | 645          | 113624 | 176115.17 | 100% |
| long-running generators (1000 iterations)          | co                        | 514          | 1372   | 2668.78   | 97%  |
|                                                    | co with bluebird promises | 525          | 1446   | 2754.67   | 100% |
|                                                    | bluebird-co               | 522          | 1422   | 2724.45   | 99%  |
| complex generators (150 iterations * three layers) | co                        | 17149        | 200    | 11.66     | 2%   |
|                                                    | co with bluebird promises | 869          | 467    | 537.38    | 100% |
|                                                    | bluebird-co               | 866          | 465    | 536.74    | 100% |
| simple thunks (1 argument)                         | co                        | 760          | 187069 | 246297.68 | 48%  |
|                                                    | co with bluebird promises | 679          | 252647 | 372220.06 | 73%  |
|                                                    | bluebird-co               | 618          | 316738 | 512259.63 | 100% |
| thunks with many arguments (30 arguments)          | co                        | 962          | 85488  | 88908.29  | 23%  |
|                                                    | co with bluebird promises | 898          | 93302  | 103901.67 | 27%  |
|                                                    | bluebird-co               | 693          | 267119 | 385198.91 | 100% |
| top level error handling                           | co                        | 747          | 100358 | 134280.76 | 100% |
|                                                    | co with bluebird promises | 835          | 97813  | 117137.04 | 87%  |
|                                                    | bluebird-co               | 756          | 68953  | 91205.77  | 68%  |
| nested error handling                              | co                        | 533          | 23311  | 43745.51  | 65%  |
|                                                    | co with bluebird promises | 878          | 37714  | 42931.07  | 64%  |
|                                                    | bluebird-co               | 815          | 54587  | 66979.25  | 100% |







