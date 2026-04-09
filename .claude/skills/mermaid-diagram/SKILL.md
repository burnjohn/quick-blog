---
name: mermaid-diagram
description: "Create Mermaid diagrams in markdown. Use when the user wants to visualize workflows, architectures, API flows, data models, state machines, or system designs. Covers flowcharts, sequence diagrams, class diagrams, ER diagrams, state diagrams, and more."
---

# Mermaid Diagram Creator

Generate Mermaid diagrams embedded in markdown that **communicate clearly** — showing relationships, flows, and structure that words alone can't express.

See `examples.md` for ready-to-use templates for each diagram type. See `references.md` for official docs and tools.

---

## Core Philosophy

- **Diagrams should clarify, not decorate** — every element must serve a purpose
- **Text-first** — Mermaid is text-based, version-controllable, and diff-friendly
- **Right diagram for the job** — pick the type that matches the concept (see Decision Guide)
- **Validate before sharing** — test in [Mermaid Live Editor](https://mermaid.live/) or render locally with `mmdc`

---

## Diagram Type Decision Guide

| You want to show... | Use | Mermaid keyword |
|---------------------|-----|-----------------|
| Steps, decisions, branches | **Flowchart** | `flowchart TD` |
| API calls between services over time | **Sequence Diagram** | `sequenceDiagram` |
| Object relationships, inheritance | **Class Diagram** | `classDiagram` |
| Database tables and relationships | **ER Diagram** | `erDiagram` |
| Transitions between states | **State Diagram** | `stateDiagram-v2` |
| Project timeline, task dependencies | **Gantt Chart** | `gantt` |
| Proportions, distribution | **Pie Chart** | `pie` |
| Hierarchical idea breakdown | **Mindmap** | `mindmap` |
| Git branching strategy | **Git Graph** | `gitGraph` |
| User experience steps | **User Journey** | `journey` |
| Chronological events | **Timeline** | `timeline` |

---

## Flowcharts

The most common diagram type. Use for workflows, decision trees, and process flows.

### Direction

| Code | Direction |
|------|-----------|
| `TD` / `TB` | Top → Down |
| `LR` | Left → Right |
| `BT` | Bottom → Top |
| `RL` | Right → Left |

### Node Shapes

| Syntax | Shape | Use for |
|--------|-------|---------|
| `[text]` | Rectangle | Process, action |
| `(text)` | Rounded | Start/end |
| `{text}` | Diamond | Decision |
| `((text))` | Circle | Event, trigger |
| `[(text)]` | Cylinder | Database, storage |
| `[[text]]` | Subroutine | External process |

### Arrow Types

| Syntax | Style |
|--------|-------|
| `-->` | Solid arrow |
| `-.->` | Dashed arrow |
| `==>` | Bold arrow |
| `--text-->` | Arrow with label |
| `~~~` | Invisible link (layout) |

### Subgraphs

Group related nodes into labeled containers:

```
subgraph Title
  direction LR
  A --> B
end
```

---

## Sequence Diagrams

Use for API flows, service interactions, and request/response patterns. Ideal for documenting Express routes, middleware chains, and client-server communication.

### Syntax

| Element | Syntax |
|---------|--------|
| Solid arrow (request) | `->>` |
| Dashed arrow (response) | `-->>` |
| Solid line (sync) | `->` |
| Dashed line (async) | `-->` |
| Cross (destroy) | `-x` |
| Note | `Note right of A: text` |
| Activation | `activate A` / `deactivate A` |
| Alt/else | `alt condition` / `else` / `end` |
| Loop | `loop label` / `end` |
| Opt (optional) | `opt condition` / `end` |

---

## Class Diagrams

Use for data models, Mongoose schemas, and object relationships.

### Relationships

| Syntax | Meaning |
|--------|---------|
| `<\|--` | Inheritance |
| `*--` | Composition (strong ownership) |
| `o--` | Aggregation (weak ownership) |
| `-->` | Association |
| `<\|..` | Interface implementation |
| `..>` | Dependency |

### Class Definition

```
class ClassName {
  +String publicField
  -Number privateField
  #Date protectedField
  +methodName() ReturnType
  -privateMethod() void
}
```

---

## ER Diagrams

Use for MongoDB schema relationships, database design.

### Relationship Syntax

| Syntax | Meaning |
|--------|---------|
| `\|\|--\|\|` | One-to-one |
| `\|\|--o{` | One-to-many |
| `}o--o{` | Many-to-many |
| `\|\|--o\|` | One-to-zero-or-one |

### Entity Definition

```
ENTITY {
  string fieldName PK "Primary Key"
  string otherField FK "Foreign Key"
  number numericField
  date dateField
}
```

---

## State Diagrams

Use for component lifecycle, auth flows, or any finite state machine.

### Syntax

| Element | Syntax |
|---------|--------|
| Start | `[*] --> State1` |
| End | `State1 --> [*]` |
| Transition | `State1 --> State2 : event` |
| Composite state | `state StateName { ... }` |
| Fork/Join | `state fork_state <<fork>>` |
| Choice | `state choice_state <<choice>>` |
| Note | `note right of State : text` |

---

## Gantt Charts

Use for project planning, sprint timelines, implementation plans.

### Syntax

```
gantt
  dateFormat YYYY-MM-DD
  title Project Timeline
  section Phase 1
    Task A :a1, 2024-01-01, 5d
    Task B :after a1, 3d
  section Phase 2
    Task C :2024-01-10, 7d
```

**Duration formats**: `1d` (days), `1w` (weeks), `1h` (hours)
**Dependencies**: `after taskId` for sequential tasks

---

## Styling and Theming

### Inline Styles

```
style nodeId fill:#f9f,stroke:#333,stroke-width:2px
classDef className fill:#bbf,stroke:#333
class nodeId className
```

### Theme Configuration

```
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#ff6b6b'}}}%%
```

**Available themes**: `default`, `dark`, `forest`, `neutral`, `base` (customizable)

---

## Best Practices

### Do

- **Pick the right direction** — LR for timelines/flows, TD for hierarchies/decisions
- **Label edges** — unlabeled arrows force the reader to guess the relationship
- **Use subgraphs** — group related nodes to reduce visual complexity
- **Keep nodes concise** — short labels, no paragraphs in boxes
- **Use consistent naming** — camelCase for IDs, readable text for labels
- **Validate syntax** — test in [Mermaid Live Editor](https://mermaid.live/) before committing
- **Wrap in markdown** — use triple-backtick `mermaid` code blocks

### Don't

- **Don't exceed ~20 nodes** per diagram — split into multiple diagrams instead
- **Don't use flowcharts for everything** — sequence diagrams are better for API flows
- **Don't mix directions** — stick to one direction per flowchart (LR or TD)
- **Don't hardcode colors** unless necessary — let the theme handle consistency
- **Don't use invisible links** (`~~~`) as a first resort — fix the layout with direction/grouping first

---

## Rendering

### In Markdown

GitHub, GitLab, Notion, and most markdown renderers support mermaid blocks natively:

````
```mermaid
flowchart LR
  A --> B
```
````

### CLI Rendering

If `mmdc` (Mermaid CLI) is available:

```bash
# PNG output
mmdc -i diagram.md -o diagram.png

# SVG output
mmdc -i diagram.md -o diagram.svg -t dark

# With custom width
mmdc -i diagram.md -o diagram.png -w 1200
```

### Validation

Before sharing any diagram:
1. Check syntax in [Mermaid Live Editor](https://mermaid.live/)
2. Verify all arrows connect to valid node IDs
3. Ensure labels are readable at the rendered size
4. Test with the intended theme (light/dark)
