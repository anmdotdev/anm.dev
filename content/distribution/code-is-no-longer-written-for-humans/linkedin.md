I keep seeing the same mistake in AI coding conversations:

people talk as if better code generation means code quality matters less.

I think the real shift is different.

Readable code still matters.
Architecture still matters.
Maintainability still matters.

But the primary source of truth is moving upward.

When AI agents become real collaborators, the biggest failures usually do not come from "the model cannot read the code."

They come from missing intent:

- rules that only live in someone's head
- constraints that were never written down
- edge cases that were "obvious" but undocumented
- product decisions buried in Slack history

That changes what I optimize for.

The question used to be:
"Will another engineer understand this file?"

Now it is increasingly:
"Is the behavior explicit enough that a machine can implement it, verify it, and safely change it later?"

That is why I think specs, scenarios, docs, and tests matter more than ever in AI-native workflows.

Code is still important.
It is just no longer the first place maintainability begins.

Full post: https://anm.dev/blog/code-is-no-longer-written-for-humans
