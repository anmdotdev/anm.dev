I used to think maintainability lived mostly inside the code.

Good variable names. Clean abstractions. Small functions. Predictable file structure. A tasteful amount of comments. The goal was obvious: make sure the next developer could open the file, understand it quickly, and change it without breaking everything.

That instinct is still correct. It is just no longer sufficient.

Over the last few months, I have spent a lot of time building software with AI coding agents. Not as autocomplete. Not as a novelty. As actual collaborators.

And that has changed how I think about what code is *for*.

The biggest failures I see usually do not come from the model being unable to read the code.

They come from missing intent.

The real rule lives in Slack.
The edge case only exists in someone's head.
The constraint was obvious to the team, so nobody wrote it down.
The product decision never made it into the code, the docs, or the tests.

An agent can read a hundred files faster than I can read five. It can trace types, follow call sites, and detect patterns quickly.

But if the source of truth for behavior is mostly unwritten, the model has to guess.

And guessing is where expensive mistakes come from.

That is the shift I care about:

the bottleneck is moving from typing code to specifying behavior.

The maintainability layer now starts earlier:

- what the feature should do
- what must never happen
- which constraints matter
- which scenarios have to pass
- how success is verified

Readable code still matters.
Architecture still matters.

But increasingly, code is the compiled artifact of intent.

Docs explain what should happen.
Tests prove whether it actually does.

That is the full argument in my first essay of a new series:

https://anm.dev/blog/code-is-no-longer-written-for-humans
