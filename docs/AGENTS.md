# AGENTS.md — docs/

Cross-cutting documentation that belongs to neither `client/` nor `server/` alone.
Package-level docs live in `client/docs/` and `server/docs/`; feature behavior lives in
`specs/`. Do not duplicate content across these — link instead.

## Layout

| Path | Contents | Edit policy |
|------|----------|-------------|
| `README.md` | Documentation map for the whole repo | Update when any doc is added, moved or removed |
| `architecture.md` | System overview: components, request flow, auth model, deployment | Update on structural changes |
| `getting-started.md` | Local setup, env, database, troubleshooting | Keep in sync with `.env.example` and `package.json` scripts |
| `design/` | Image-generation prompts for seed covers | References only; the binding rules are in `client/docs/design-system.md` |
| `demos/` | Workshop walkthroughs (Claude Code workflows) | Keep prompts and paths working against the current code |
| `flows/` | End-to-end sequence diagrams (Mermaid / Excalidraw) | Update when the flow changes |

## Rules

- English, plain technical prose, no emojis in docs.
- Cite code paths (`server/src/...`) instead of paraphrasing large code blocks.
- Use relative links; check them after moving files.
- Diagrams: Mermaid in Markdown for anything that should diff well; Excalidraw source
  (`.excalidraw`) next to its exported `.png`.
