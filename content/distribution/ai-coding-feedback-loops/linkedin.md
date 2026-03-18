I think a lot of people are blaming the wrong thing when AI code looks bad.

The common complaint is:
"it wrote something plausible, but it did not actually work."

That complaint is real.

But most of the time the failure is not "the model is dumb."

It is that the model is coding blind.

If an agent cannot:

- run the app
- inspect the browser
- see console output
- trace network requests
- dry-run scenarios
- use tests, types, and linting

then it is missing the same self-correction loop a human developer would rely on.

At that point, it is not really debugging.
It is guessing.

That is why I think the right mental model is not "generate code."

It is "direct an implementation loop":

1. define behavior
2. let the model implement
3. let it inspect what happened
4. let it correct
5. review the result

Once you complete that loop, the quality jump is dramatic.

Bad AI output is very often just blind output.

Full post: https://anm.dev/blog/ai-coding-feedback-loops
