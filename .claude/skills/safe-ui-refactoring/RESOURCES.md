# Resources — Safe UI Refactoring Skill

All sources used in creating the `safe-ui-refactoring` skill, organized by category.

---

## Martin Fowler — Foundational Theory + Frontend

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 1 | Modularizing React Applications with Established UI Patterns | https://martinfowler.com/articles/modularizing-react-apps.html | Treat React as the view layer; separate domain logic from presentation using Presentation-Domain-Data layering |
| 2 | Refactoring Module Dependencies | https://martinfowler.com/articles/refactoring-dependencies.html | How to split programs with layering and manage module dependencies (Service Locator, DI) — JS + Java examples |
| 3 | Refactoring (main site) | https://martinfowler.com/refactoring/ | Continuous, small, behavior-preserving transformations as part of daily work |
| 4 | Catalog of Refactorings | https://martinfowler.com/refactoring/catalog/ | Comprehensive catalog of named refactoring techniques |
| 5 | Rewriting Strangler Fig (2024) | https://martinfowler.com/articles/2024-strangler-fig-rewrite.html | Incrementally replace legacy systems without big-bang rewrites |
| 6 | Branch By Abstraction | https://martinfowler.com/bliki/BranchByAbstraction.html | Large-scale changes on mainline without long-lived branches — introduce abstraction, swap implementations |
| 7 | Micro Frontends | https://martinfowler.com/articles/micro-frontends.html | Breaking monolithic frontends into independently deployable pieces |
| 8 | Front-end tagged articles (all) | https://martinfowler.com/tags/front-end.html | Full index of Fowler's frontend writing |

---

## React-Specific Refactoring Guides

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 9 | Complete Guide to Refactoring React | https://shinagawa-web.com/en/blogs/frontend-code-refactoring | Modularization, render optimization, design patterns, naming conventions, SRP |
| 10 | 7 Refactoring Techniques: 877 Lines → 150 Lines | https://zenn.dev/yudai_uk/articles/react-admin-refactoring-practical-guide?locale=en | Practical walkthrough of extracting hooks, splitting components, memoization |
| 11 | Refactoring Components with Custom Hooks (CodeScene) | https://codescene.com/engineering-blog/refactoring-components-in-react-with-custom-hooks | Extract Hook as a refactoring technique — when hooks beat component splitting |
| 12 | From Legacy to Modern: Refactoring Large React Codebases | https://www.flexhire.com/blog/miguel-o-46/from-legacy-to-modern-my-strategy-for-refactoring-large-react-codebases | Step-by-step strategy for modernizing legacy React apps |
| 13 | From Legacy to Leading: Modernizing Old React Codebases | https://medium.com/codex/from-legacy-to-leading-modernizing-your-old-react-codebase-5bcc86bf808a | TypeScript adoption as foundation, incremental migration approach |

---

## Code Smells & Anti-Patterns

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 14 | 6 Common React Anti-Patterns | https://itnext.io/6-common-react-anti-patterns-that-are-hurting-your-code-quality-904b9c32e933 | Component inheritance, prop spreading, and their fixes |
| 15 | React Code Smells: 5 Tiny Patterns That Blow Up Later | https://forem.com/obceylan/react-code-smells-5-tiny-patterns-that-blow-up-your-app-later-18d6 | Inline functions, magic strings, overused global state |
| 16 | 7 Code Smells in React Components | https://dev.to/awnton/7-code-smells-in-react-components-5f66 | Too many props, copying props into state, excessive useState, large useEffect |
| 17 | React Anti-Patterns (Tyler Wray) | https://tylerwray.me/blog/react-anti-patterns/ | Inheritance vs composition, prop spreading pitfalls |

---

## Architecture & Scaling Patterns

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 18 | 10 Layering Rules for React Apps That Scale | https://medium.com/@sparknp1/10-layering-rules-for-react-apps-that-scale-a9fb788235a9 | Feature-first structure, dependency control, import rules |
| 19 | Structuring a Large Scale React App | https://medium.com/@mitchclay0/structuring-a-large-scale-react-app-2f68c6ba9f9d | CODEOWNERS, ownership boundaries, folder organization |
| 20 | Best Practices for Managing Large React Codebases | https://medium.com/@amrpratapsingh02/best-practices-for-managing-large-react-codebases-d8fe9b9cb6a3 | TypeScript, modularization, organized hooks/utils directories |
| 21 | Advanced Component Composition in React | https://mediusware.com/blog/advanced-component-composition-in-react-patterns-a | Compound components, render props, HOCs, slot-based composition |
| 22 | Master React Component Composition Patterns | https://www.codefixeshub.com/react/advanced-patterns-for-react-component-composition- | Headless components, state reducers, controlled/uncontrolled interfaces |

---

## Safe Migration & Incremental Strategies

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 23 | Feature Flags for Safe Refactoring | https://techdebt.guru/playbooks/feature-flags/ | Refactoring flags, gradual rollout (1%→100%), zero-risk rollback, flag types |
| 24 | Evolving React Apps Safely with Feature Toggles + Branch by Abstraction | https://itnext.io/evolving-your-react-app-safely-with-feature-toggles-and-branch-by-abstraction-bb7b97290bc9 | Combining feature toggles with branch-by-abstraction for React |
| 25 | How to Break Up a Large Code Refactor | https://viktorstanchev.com/posts/how-to-break-up-a-large-code-refactor/ | One thing at a time, stack changes (max 3-4), proof of concept first |
| 26 | UI Strangler Fig Playbook: 500k Lines of Monolith | https://replay.build/blog/ui-strangler-fig-playbook-a-practical-path-to-replacing-500k-lines-of-monolith-logic | Visual auditing, bridge construction, incremental frontend replacement |
| 27 | How to Migrate React UIs Without Breaking Everything | https://hashbyt.com/blog/migrate-react-uis | Page-by-page vs component-by-component migration, observability during migration |
| 28 | Incremental Adoption — React (official) | https://react.dev/learn/react-compiler/incremental-adoption | Runtime gating, opt-in compilation, directory-based adoption |
| 29 | Branch by Abstraction Pattern (OneUptime, 2026) | https://oneuptime.com/blog/post/2026-01-30-branch-by-abstraction-pattern/view | Step-by-step implementation of branch-by-abstraction |

---

## Technical Debt Prioritization

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 30 | Technical Debt in React: Prioritizing with CodeScene | https://codescene.com/engineering-blog/codescene-prioritize-technical-debt-in-react/ | Behavioral code analysis, hotspot detection, churn + complexity metrics |
| 31 | Managing Technical Debt in 2026 | https://zeonedge.com/en/blog/managing-technical-debt-2026-strategies-paydown-engineering | Sprint allocation (20%), data-driven prioritization, velocity tracking |
| 32 | Technical Debt Management for Frontend Teams | https://blog.hemense.net/posts/2025-24-05-the-power-of-technical-debt-management-strategies-for-frontend-teams/the-power-of-technical-debt-management-strategies-for-frontend-teams/ | Embedding debt reduction into delivery cadence |

---

## Automated Refactoring (Codemods)

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 33 | React Codemod (official jscodeshift transforms) | https://toolstac.com/tool/react-codemod/overview | Automated transforms for React version migrations and API modernization |
| 34 | jscodeshift (npm) | https://www.npmjs.com/package/jscodeshift | Core AST-to-AST transform toolkit — 6.2M weekly downloads |

---

## Testing for Refactoring Confidence

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 35 | Testing Implementation Details (Kent C. Dodds) | https://kentcdodds.com/blog/testing-implementation-details | Tests that verify behavior (not implementation) survive refactoring |
| 36 | Write Fewer, Longer Tests (Kent C. Dodds) | https://kentcdodds.com/blog/write-fewer-longer-tests | Longer integration tests provide more real-world confidence |
| 37 | Confident React — Testing Trophy (Kent C. Dodds) | https://slides.com/kentcdodds/confident-react | Integration-heavy testing strategy for maximum refactoring confidence |
| 38 | Visual Regression Testing for React in 2026 | https://bug0.com/knowledge-base/visual-regression-testing-react-angular | Storybook + Chromatic, Playwright VRT, pixel-level comparison |

---

## Design-Focused (Visual Refactoring)

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 39 | Refactoring UI (book — Adam Wathan & Steve Schoger) | https://refactoringui.com/ | Actionable design tactics for developers: spacing, color, typography, hierarchy |

---

## General React Best Practices (supplementary)

| # | Title | URL | Key takeaway |
|---|-------|-----|--------------|
| 40 | React Best Practices: Building Apps That Don't Fall Apart (Medium, 2026) | https://yakhil25.medium.com/react-best-practices-building-apps-that-dont-fall-apart-b973ab2f2d73 | Folder structure, code splitting, lazy loading |
| 41 | Building Reusable React Components in 2026 (Medium) | https://medium.com/@romko.kozak/building-reusable-react-components-in-2026-a461d30f8ce4 | SOLID in React, component documentation, styling strategies |
| 42 | Clean React + TypeScript Code (Clean Code Guy) | https://cleancodeguy.com/blog/clean-code-principles | DRY, YAGNI, naming conventions for React + TS |
| 43 | Refactoring Strategies (Developer Toolkit / Cursor) | https://developertoolkit.ai/en/cursor-ide/productivity-patterns/refactoring-strategies/ | Git checkpoints, one structural change at a time, test after each step |
| 44 | Redux to Context API Migration Guide (Auth0) | https://auth0.com/blog/redux-to-context-practical-migration-guide | Incremental state management migration with test coverage |
