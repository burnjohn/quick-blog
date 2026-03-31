# Backend Testing Skill

## Motivation

The original skill had good foundations — Supertest-first philosophy, in-memory MongoDB, auth testing patterns — but it encouraged **too many shallow tests per endpoint** ("3-5 tests per controller action") without clear guidance on which scenarios actually matter. Each protected endpoint would get 5+ near-identical auth tests, validation was tested field-by-field, and there was no concept of test tiers or workflow-level testing.

The rewrite shifts toward **fewer, higher-confidence tests** organized around real API behavior:

- **Scenario matrices** tell you exactly which 2-4 tests to write for each endpoint type
- **Workflow tests** catch integration bugs across the full CRUD lifecycle in a single test
- **Test tiers** (Fast/Core/Extended) organize tests by speed for efficient CI
- **Auth testing is deduplicated** — edge cases tested once per middleware, not per endpoint

### Key changes from the original

| Before | After |
|--------|-------|
| "3-5 tests per controller action" | **2-4 tests per endpoint** (full request lifecycles) |
| No scenario matrix | **Scenario matrix by endpoint type** (GET list, GET detail, POST, PUT, DELETE, Auth) |
| Auth edge cases tested on every endpoint | **Auth middleware tested once**, just 401 per protected endpoint |
| No test tiers | **Fast / Core / Extended** tiers with CI speed targets |
| No workflow tests | **Full CRUD lifecycle test** (create → read → update → delete) |
| Fragments in examples file | **Complete spec template** with setup, helpers, and all test patterns |
| Security tests mixed in | **Security tests in Extended tier** (nightly/scheduled) |

## Sources

These sources informed the rewrite:

### Core philosophy

- [Write tests. Not too many. Mostly integration. — Kent C. Dodds](https://kentcdodds.com/blog/write-tests) — The Testing Trophy model applies to backend too: Supertest integration tests give the best ROI.
- [Write fewer, longer tests — Kent C. Dodds](https://kentcdodds.com/blog/write-fewer-longer-tests) — Combine related assertions into lifecycle tests instead of splitting into many tiny `it()` blocks.

### Node.js / Express testing

- [Node.js Testing Best Practices — goldbergyoni (April 2025)](https://github.com/goldbergyoni/nodejs-testing-best-practices) — Comprehensive best practices including test structure by route, test portfolio/CI lanes, database isolation, and flaky test diagnosis.
- [Integration Testing: Testing Full API Workflows in Express — Lead With Skills (Dec 2025)](https://www.leadwithskills.com/blogs/integration-testing-express-api) — Essential integration test scenarios: happy path workflows, error state propagation, auth chains, cross-user access, transaction rollbacks.
- [A Simple Guide to HTTP-Level Tests with Vitest, MongoDB and Supertest — Medium](https://medium.com/@burzhuas/a-simple-guide-to-setting-up-http-level-tests-with-vitest-mongodb-and-supertest-1c5c90d22321) — Vitest + Supertest + mongodb-memory-server setup patterns.
- [Node.js Guide to Integration Tests — Toptal (Jul 2025)](https://www.toptal.com/nodejs/nodejs-guide-integration-tests) — Why integration tests catch bugs that unit tests miss, mocking strategy at boundaries.

### API test strategy

- [REST API Test Strategy: What Exactly Should You Test? — Roy Mor](https://medium.com/@roy.mor/rest-api-test-strategy-what-exactly-should-you-test-21c2f1cc3ed5) — Test strategy as a matrix: functional correctness, validation, auth, error handling, response shape.
- [REST API Testing Best Practices 2025 — JSONToTable](https://jsontotable.org/blog/web-api-testing/rest-api-testing-best-practices) — HTTP contract verification, status codes, headers, response bodies matching documentation.
- [How to Test Your Express API with SuperTest — Abdurrahman Fadhil](https://rahmanfadhil.com/test-express-with-supertest/) — Practical Supertest patterns, separating app from server.

### Test organization

- [Unit Test & Integration Test in Express.js — Biteship](https://medium.com/@biteship/unit-test-integration-test-in-express-js-194b93391f79) — When to unit test vs integration test, mandatory field validation patterns.
- [Testing Node.js APIs: Jest, Supertest, and Best Practices — DEV](https://dev.to/addwebsolutionpvtltd/testing-nodejs-apis-jest-supertest-and-best-practices-3ddp) — Database isolation, test independence, mocking external services.
- [Unit and Integration Testing for Node.js Apps — LogRocket](https://blog.logrocket.com/unit-and-integration-testing-for-node-js-apps/) — If you must pick one, pick integration tests.

### Tooling

- [Vitest documentation](https://vitest.dev/) — Test runner.
- [Supertest — npm](https://www.npmjs.com/package/supertest) — HTTP testing against Express app instances.
- [mongodb-memory-server — npm](https://www.npmjs.com/package/mongodb-memory-server) — In-memory MongoDB for isolated, fast tests.
