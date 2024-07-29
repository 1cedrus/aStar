# aStar
Applying A* (A-star) to solve n-puzzle problems.

![Demo](https://github.com/1cedrus/aStar/blob/main/assets/demo.gif)

### About 

In this project, I implemented 5 heuristics that will be shown in the table below.
| Heuristic    | Is it acceptable? |
| -------- | ------- |
| Misplaced - Hamming Distance  | Yes    |
| Manhattan Distance | Yes     |
| Inversion Distance | Yes     |
| Walking Distance    | Yes    |
| Manhattan & Linear Conflict    | ?    |

### Tests Results

I skip `Misplaced - Hamming Distance` because it is slow and memory using costly so will be impossible to solve 4x4 problems.


Case 1: `4,7,5,6,0,2,14,13,3,1,9,10,15,11,12,8`

| Heuristic    | Time | Inspected Node |
| -------- | ------- | ------- |
| Manhattan Distance | 3837.400ms | 407869 |
| Inversion Distance | 2044.200ms  | 146103 | 
| Walking Distance | 633.300ms | 25146 |
| Manhattan & Linear Conflict | 3534.900ms | 363407 |

Case 2: `0,1,6,3,10,2,12,11,15,8,5,13,14,9,4,7`

| Heuristic    | Time | Inspected Node |
| -------- | ------- | ------- |
| Manhattan Distance | 5862.300ms | 599164 |
| Inversion Distance | 2024.400ms  | 176212 | 
| Walking Distance | 4814.500ms | 303073 |
| Manhattan & Linear Conflict | 3582.200mss | 375410 |

Case 3: `7,4,8,11,1,10,14,2,12,0,6,13,3,9,5,15`

| Heuristic    | Time | Inspected Node |
| -------- | ------- | ------- |
| Manhattan Distance | 14084.500ms | 1363631 |
| Inversion Distance | 4431.100ms  | 293209 | 
| Walking Distance | 798.600ms | 32479 |
| Manhattan & Linear Conflict | 16381.400ms | 1516052 |

Case 4: `8,1,14,15,2,0,3,12,4,6,13,11,5,9,10,7`

| Heuristic    | Time | Inspected Node |
| -------- | ------- | ------- |
| Manhattan Distance | 619.300ms | 71490 |
| Inversion Distance | 1145.500ms  | 84162 | 
| Walking Distance | 2874.900ms | 118111 |
| Manhattan & Linear Conflict | 380.900ms | 41089 |

Case 5: `13,11,2,6,3,4,12,8,7,1,0,5,15,14,9,10`

| Heuristic    | Time | Inspected Node |
| -------- | ------- | ------- |
| Manhattan Distance | 6271.700ms | 762875 |
| Inversion Distance | 3143.600ms  | 241940 | 
| Walking Distance | 10012.800ms | 558320 |
| Manhattan & Linear Conflict | 5419.800ms | 595122 |

### Conclusion

- If you notice, `Manhattan Distance` and `Inversion Distance` differ in their focus:
  - `Manhattan Distance` only cares about the correct position of tiles and the fastest way to move them to their correct positions, ignoring the empty box.
  - `Inversion Distance`, on the other hand, focuses on how many times the empty box needs to move left-right or up-down to reduce the inversion count to 0 (the goal state has an inversion count of 0), without considering the correct spot for each tile.

So, which one is faster depends on the specific problem.

- `Walking Distance` is the mix between `Manhattan Distance` and `Inversion Distance`. Make it have a better performance.
- `Manhattan & Linear Conflict` is the mix between `Manhattan` and `Linear Conflict`.

### References
- [Manhattan - Inversion - Walking Distance](https://michael.kim/blog/puzzle)
- [Linear Conflict](https://cse.sc.edu/~mgv/csce580sp15/gradPres/HanssonMayerYung1992.pdf)
- [My Report (Vietnamese)](https://github.com/1cedrus/aStar/blob/main/assets/report.pdf)
