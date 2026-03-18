## Post 1

Code is no longer written primarily where humans read it line by line. It is increasingly written as the executable output of a clearer layer above it: intent.

I used to think maintainability lived mostly inside the code.

Good variable names. Clean abstractions. Small functions. Predictable file structure.

That instinct is still correct.
It is just no longer sufficient.

---

## Post 2

Working with AI coding agents has changed how I think about what code is *for*.

The next thing reading your code may not be a human teammate.
It may be an agent.

And agents are good at different things than humans are.

---

## Post 3

An agent can read a hundred files faster than I can read five.

It can follow types, trace call sites, and identify repeated patterns almost instantly.

What trips it up is usually not complexity.
It is ambiguity.

---

## Post 4

If the real rule lives in Slack, in somebody's head, or in unwritten team lore, the model has to guess.

And guessing is where expensive mistakes come from.

The issue is often not code readability.

It is that the code is not the full source of truth for intent.

---

## Post 5

So the bottleneck is shifting.

Less: typing the implementation
More: specifying the behavior clearly

What should happen.
What must never happen.
Which edge cases matter.
How success is verified.

---

## Post 6

That is why I think docs and tests matter even more in AI-native workflows.

Docs explain what should happen.
Tests prove whether it actually does.

Together, they act like the contract above the code.

---

## Post 7

Readable code still matters.
Architecture still matters.

But maintainability increasingly starts earlier:
in how explicitly you define intent.

I wrote the full essay here:
https://anm.dev/blog/code-is-no-longer-written-for-humans
