# House rule: async/await over .then()

This codebase uses `async`/`await` everywhere. Flag any NEW code in the diff
that chains `.then()`, `.catch()`, or `.finally()` on a promise.

Do NOT flag:
- `.catch()` used as a deliberate fire-and-forget suppressor on a best-effort
  side effect (e.g. `void write().catch(() => undefined)`),
- existing lines the diff merely moves or reindents.