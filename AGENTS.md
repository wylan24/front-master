## Agent Coding Guidelines

### Core Principle

Simplicity and readability come before cleverness and brevity.

When there's a tradeoff between a short, clever solution and a longer, obvious one, choose the longer, obvious one. Code is read far more often than it's written, and it's read by people (and agents) who don't have the full context you have right now. Optimize for the reader who is tired, in a hurry, or new to this codebase.

Length is not a cost worth avoiding. Complexity is.

### What "simple" means here

- Explicit over implicit. Spell things out rather than relying on clever language features, hidden defaults, or "magic" behavior.
- Linear over clever. Prefer a few extra straightforward lines over a dense one-liner that requires re-reading to parse.
- Named over inline. Extract a well-named variable or function instead of nesting logic inline, even if it's only used once.
- Boring over novel. Use the most common, idiomatic pattern for the language/framework, not the most elegant or unusual one.
- Flat over nested. Prefer early returns and guard clauses over deep nesting of conditionals.
- Direct over abstracted. Don't introduce an abstraction (interface, base class, plugin system, config layer) until there are at least two or three concrete cases that actually need it. A duplicated 5-line block is cheaper to maintain than a premature abstraction.

### Explicit anti-goals

Do not optimize for any of the following unless the task specifically asks for it:

- Fewest lines of code
- Fewest variables
- Cleverest use of language features (e.g. deeply chained functional pipelines, dense ternaries, bit tricks, metaprogramming)
- Maximum reuse / DRY-ing out code that isn't actually duplicated in meaning, only in shape
- "Impressive" one-liners
- Micro-optimizations that don't matter for the actual scale of the problem

If you find yourself writing something and thinking "this is elegant but I'd need a comment to explain it," that's a signal to rewrite it more plainly instead of adding the comment.

### Practical rules

- Prefer several small, clearly-named functions over one dense function, but don't go overboard splitting things so much that the reader has to jump around to follow a single piece of logic. Each function should do one understandable thing.
- Name things for what they mean, not what they are. `activeUsers` over `list2`, `remainingRetries` over `n`.
- Write out control flow. Avoid collapsing multi-step logic into chained ternaries, nested comprehensions, or clever short-circuit tricks. A `for` loop with a clear body beats a dense one-liner comprehension doing filter+map+reduce at once.
- Avoid unnecessary abstraction layers. No factories, wrappers, or generic utilities "for future flexibility" unless that flexibility is needed now.
- Comments explain "why," not "what." If code needs a comment to explain what it does, simplify the code first; add a comment for why a non-obvious decision was made.
- Consistent formatting over compact formatting. Use the project's formatter/linter defaults. Don't manually compress code to save vertical space.
- Error handling should be visible, not swallowed or hidden behind generic try/catch-everything blocks. Handle the specific error, or let it propagate clearly.
- It's fine to repeat yourself a little if the alternative is a shared abstraction that's harder to follow than the duplication itself.

### Example

Avoid (compact but harder to parse):

```js
const res = items.filter(i => i.active && i.qty > 0).map(i => ({...i, total: i.qty * i.price})).reduce((a, i) => a + i.total, 0);
```

Prefer (longer, but reads top-to-bottom):

```js
function calculateActiveInventoryValue(items) {
  let totalValue = 0;

  for (const item of items) {
    const isActiveWithStock = item.active && item.qty > 0;
    if (!isActiveWithStock) continue;

    const itemValue = item.qty * item.price;
    totalValue += itemValue;
  }

  return totalValue;
}
```

The second version is longer, but a new reader can follow it without mentally unwinding a chain of higher-order functions.

When in doubt, choose the version a beginner on the team could understand without help.

##  Skill Routing Table

Below is a Skill Table listing the skills available to you gloablly, along with a description of each skill.


| Task | Required skill(s) | Use it for |
|---|---|---|
| Any frontend design or user-facing UI change | `frontend-design` | Build focused, production-quality , design-system adherence, responsive behavior, and complete loading, error, and empty states. |
| New screen or major visual redesign | `frontend-design`, `shadcn`, `vercel-react-best-practices` | Establish a product-specific visual direction, implement responsive semantic styling, compose shadcn primitives, and keep React rendering efficient. |
| Add, replace, or debug a UI component | `shadcn`, `vercel-composition-patterns`, `vercel-react-best-practices` | Inspect/search the registry, read current component docs, compose existing primitives, design a reusable API, and avoid unnecessary re-renders. |
| Refactor component APIs or shared state composition | `vercel-composition-patterns`, `vercel-react-best-practices` | Prefer explicit variants and composition over boolean-prop growth; place state at the appropriate shared boundary. |
| React performance or bundle review | `vercel-react-best-practices` | Check waterfalls, bundle imports, derived state, effects, memoization, long-list rendering, and browser storage access. |
| Characterize a workflow or add browser/visual tests | `playwright-cli` | Start from a seed test, inspect the live UI, record user-level scenarios, and verify role, table, grid, responsive, visual-parity, and end-to-end behavior. |

# Agent Delegation

## Create Additional Agents Only When
- The task is large and can be split into independent workstreams.
- Multiple documents, subsystems, or domains can be analyzed separately.
- Independent review, validation, or fact-checking is required.

## Do Not Create Additional Agents For
- Simple questions or explanations.
- Small refactors or single-file changes.
- Routine debugging.
- Straightforward research, planning, or content generation.
- Any task one agent can reasonably complete in a single pass.

## Limits
- Maximum 3 agents per request.
- Do not create agents preemptively.
- No recursive delegation. Agents must not create sub-agents.

## Requirements for Multi-Agent Work
Before creating agents:
1. Define each agent's responsibility.
2. Assign clear, non-overlapping ownership.
3. Ensure parallel work provides a real benefit.

Avoid multiple agents modifying the same files. Shared ownership is acceptable only for review, validation, or verification tasks where no concurrent edits are performed.


## Decision Rule
If a competent single agent can complete the task efficiently, use one agent.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
