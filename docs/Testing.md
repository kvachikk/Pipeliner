# Testing Report

## 1. Mutation Testing Results (StrykerJS) 👽

| File                  | Mutation Score |  Covered   | Killed | Survived |
| :-------------------- | :------------: | :--------: | :----: | :------: |
| **All files**         |   **34.78%**   | **87.27%** | **48** |  **7**   |
| `users.controller.ts` | 🟢 **100.00%** |  100.00%   |   5    |    0     |
| `users.service.ts`    | 🟡 **81.13%**  |   86.00%   |   43   |    7     |

> **Note:** The low _total_ score (34.78%) is expected because the mutation test suite was run against the entire project structure (including config and utils), while the test focus was strictly on the `Users` module.

## 2. Analysis

### UsersController

The controller achieved a perfect 100% mutation score. Every mutant introduced by Stryker was killed. This confirms that the controller logic is tightly coupled with the tests, and all request handling/response mapping is verified.

### UsersService

The service layer has a strong score of ~81%

- 43 mutants were killed, ensuring the core business logic (creation, updates, deletion) is robust.
- 7 mutants survived. These are primarily related to:
   1. Defensive Coding: Extra checks for `isValidUUID` inside the service that are technically redundant because the Controller's `ValidationPipe` catches them first.
   2. Database Error Handling:\*\* Specific `UniqueConstraintError` scenarios that are handled in code but require more granular mocking in unit tests to fully verify.

---

## 3. Raw Stryker CLI Output

```text
------------------------|------------------|----------|-----------|------------|----------|----------|
                        | % Mutation score |                                                         |
File                       total | covered | # killed | # timeout | # survived | # no cov | # errors |
------------------------|--------|---------|----------|-----------|------------|----------|----------|
All files                  34.78 |   87.27 |       48 |         0 |          7 |       83 |        0 |
 common                 |   0.00 |    0.00 |        0 |         0 |          0 |       11 |        0 |
  database              |   0.00 |    0.00 |        0 |         0 |          0 |       11 |        0 |
   utils                |   0.00 |    0.00 |        0 |         0 |          0 |       10 |        0 |
    database-connect.ts |   0.00 |    0.00 |        0 |         0 |          0 |        5 |        0 |
    migration-runner.ts |   0.00 |    0.00 |        0 |         0 |          0 |        5 |        0 |
   sequelize.ts         |   0.00 |    0.00 |        0 |         0 |          0 |        1 |        0 |
 config                 |   0.00 |    0.00 |        0 |    M    0 |          0 |       48 |        0 |
  database.config.ts    |   0.00 |    0.00 |        0 |         0 |          0 |       48 |        0 |
 modules                |  62.34 |   87.27 |       48 |         0 |          7 |       22 |S       0 |
  feeds                 |   0.00 |    0.00 |        0 |         0 |          0 |       19 |        0 |
   feeds.controller.ts  |   0.00 |    0.00 |        0 |         0 |          0 |        5 |        0 |
   feeds.service.ts     |   0.00 |    0.00 |        0 |         0 |          0 |       14 |D       0 |
  users                 |  82.76 |   87.27 |       48 |         0 |          7 |        3 |        0 |
   users.controller.ts  | 100.00 |  100.00 |        5 |         0 |    M     0 |        0 |        0 |
   users.service.ts     |  81.13 |   86.00 |       43 |         0 |          7 |        3 |        0 |
 main.ts                |   0.00 |    0.00 |        0 |    IS    0 |          0 |        2 |        0 |
```
