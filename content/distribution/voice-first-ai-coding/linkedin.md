I thought voice dictation for coding was a gimmick.

I like keyboards. I type quickly. I have spent an unreasonable amount of time caring about key travel, editor shortcuts, and whether a tool feels "fast." Talking to my computer felt like the opposite of that. It felt vague, clumsy, and slightly embarrassing.

Then AI coding showed me something I had missed:

I did not have a typing problem. I had a **context budget** problem.

Every time I typed a prompt, I unconsciously optimized for brevity. I would leave things out. I would skip the file path. I would avoid explaining the tradeoff. I would trust the model to infer the edge case. Not because I wanted to be vague, but because typing five paragraphs of precise context feels expensive.

Voice changed that immediately.

Voice-first prompting works because it makes thoroughness cheap.

That is the whole idea.

This is not really a story about speaking instead of typing. It is a story about removing the friction between what you know and what the model needs to know.

Typing Makes You Compress Too Aggressively

Most bad AI prompts are not bad because the person using the model is unclear in their own head. They are bad because the person compresses the request too hard on the way out.

You think:

- where the relevant code already lives
- what pattern the new code should follow
- what edge case is probably going to break
- what you definitely do not want the model to change
- what "done" should mean for this task

Then you type:

> Add a dark mode toggle to the header

That is not a thinking failure. It is a transmission failure.

If you gave that same task to a developer that just joined your team today, you would not stop there. You would say:

> The header is in `src/components/Header.tsx`. Put the toggle on the right, next to the avatar. Use the existing `useTheme` hook and persist the preference. Match the current button styles. Respect the CSS variables we already use in `globals.css`. Also make sure it works on mobile and do not change the existing nav layout.

That second version is not "better prompt engineering." It is just fuller context.

The reason people fail to provide that level of context consistently is simple: typing it every single time is annoying.

Voice fixes that by making it cheap to say the extra sentence. And then the extra sentence after that. And then the one where you remember the fragile part of the codebase that the model really should not touch.

That is the real win.

That is why I think voice-first prompting matters, and you should give it a go.

Not because speaking is faster.
Because it removes friction between what you know and what the model needs to know.

Typing trained a lot of us to be terse.
AI rewards being clear.

Full post: https://anm.dev/blog/voice-first-ai-coding
