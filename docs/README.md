# QuickBlog documentation

Start with [architecture.md](architecture.md), then the docs for the package you are
working in and the spec for the feature you are touching. Rules for maintaining docs:
[AGENTS.md](AGENTS.md).

## Map

| Area | Entry point | Contents |
|------|-------------|----------|
| Overview | [architecture.md](architecture.md) | Components, request pipeline, auth model, external services |
| Setup | [getting-started.md](getting-started.md) | First run, env variables, database commands, troubleshooting |
| Specs | [../specs/README.md](../specs/README.md) | EARS acceptance criteria for every feature, cross-cutting known gaps |
| UI | [../client/docs/README.md](../client/docs/README.md) | Design system, motion, components, pages, data layer, testing |
| Backend | [../server/docs/README.md](../server/docs/README.md) | API reference, data model, auth & security, uploads, seeding, testing |
| Agent rules | [../AGENTS.md](../AGENTS.md), [../client/AGENTS.md](../client/AGENTS.md), [../server/AGENTS.md](../server/AGENTS.md), [../specs/AGENTS.md](../specs/AGENTS.md) | Conventions for AI coding agents |

## In this folder

| Path | What |
|------|------|
| [demos/](demos/) | Workshop walkthroughs: [blog creation](demos/blog-creation.md), [comments feature](demos/comments-feature.md), [debugging](demos/debugging.md) |
| [flows/](flows/) | [Post creation flow](flows/post-creation-flow.md) (end to end) and [backend pipeline](flows/post-creation-backend.md) |
| [design/](design/) | [Image prompts](design/image-prompts.md) for the seed post covers (Gemini) |
| [images/](images/) | Screenshots used by the READMEs |
