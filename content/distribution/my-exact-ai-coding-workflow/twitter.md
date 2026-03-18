## Post 1

After a lot of experimentation, I have a baseline AI coding workflow I actually trust.

---

## Post 2

The short version:

scope tightly
dump context
make the model understand first
write a thin spec
define scenarios
implement
dry-run
run checks + runtime feedback
review
merge
reset

---

## Post 3

Each step removes a different failure mode.

Bad scoping poisons the task.
Weak context causes guessing.
Missing scenarios weaken review.
No feedback loop leaves the model blind.

---

## Post 4

The main shift is this:

AI gets reliable when you stop treating it like a generator and start treating it like part of a full engineering loop.

I wrote the complete workflow here:
https://anm.dev/blog/my-exact-ai-coding-workflow
