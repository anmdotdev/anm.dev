After a lot of trial and error, this is the AI coding workflow I trust most:

1. Pick a bounded task.
2. Dump context fast.
3. Ask for understanding before changes.
4. Write a thin spec if needed.
5. Define scenarios explicitly.
6. Let it implement.
7. Dry-run the scenarios.
8. Run checks and runtime validation.
9. Review the diff like a PR.
10. Use a second model when it matters.
11. Merge, then reset context.

What matters is not that every task needs every step with equal intensity.

What matters is that each step removes a different failure mode.

Bad task definition poisons the whole chain.
Weak context invites guessing.
Missing scenarios make review fuzzy.
No feedback loop leaves the model blind.

By the time implementation starts, most of the important thinking should already be done.

That is why I do not think the main leverage is "AI writes code fast."

The bigger leverage is that a stable workflow makes direction, iteration, validation, and review much faster.

Full post: https://anm.dev/blog/my-exact-ai-coding-workflow
