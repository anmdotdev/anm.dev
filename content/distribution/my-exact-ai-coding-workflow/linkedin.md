I've been using coding agents in production for the last six months.

This is the exact workflow I trust when I want AI output to be predictable enough that I can move fast without pretending first drafts are perfect.

Pick a bounded task.
I break broad requests into a small, reviewable unit so the prompt, scenarios, and diff stay clear.

Dump context fast.
I front-load all the relevant details, constraints, edge cases, and likely files instead of keeping that context in my head.

Ask for understanding before changes.
I want the model to inspect the current system and explain it back before it writes a single line of code.

Write a thin spec if needed.
For tasks with moving parts, I define the scope, constraints, and expected behavior in a short structured note.

Define scenarios explicitly.
I treat the scenarios as the real contract so both implementation and review have a concrete target.

Let it implement.
Once the context and structure are solid, I step back and let the model produce a coherent first pass.

Dry-run the scenarios.
I ask it to walk through each scenario step by step in the code to catch rollback gaps, stale state, and broken branches early.

Run checks and runtime validation.
That means linting, types, tests, browser interaction, and console inspection so the workflow becomes convergence, not just generation.

Review the diff like a PR.
I review the output the same way I would review a teammate's change for scope drift, edge cases, and architectural weirdness.

Use a second model when it matters.
For higher-risk work, a second model is a useful extra filter because it often catches different issues.

Merge, then reset context.
Once the task is done, I merge it and start fresh because long-running sessions drift and accumulate noise.

Takeaway: AI becomes reliable when you stop treating it like a generator and start treating it like a participant in a full engineering loop.

Full post: https://anm.dev/blog/my-exact-ai-coding-workflow
