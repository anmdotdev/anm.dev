# AI-Powered Development: Learnings & Workflow

A synthesis of learnings from 3 months of intensive AI-assisted software development, producing work that would have taken years to build manually across a 10+ year career.

---

## 1. The Voice-First Paradigm

### Dictation Over Typing

- Switched from typing prompts to dictating them using voice-to-text software (e.g., Wispr Flow).
- **Not** interactive voice mode — it's one-directional dictation into the prompt field.
- Initially was very pro-typing and skeptical of voice as an interface.

### Why It Works

- **Eliminates cognitive overhead**: No need to structure thoughts while typing. Just talk naturally.
- **Removes the typing bottleneck**: Talking is inherently less work than typing, enabling much longer, richer prompts.
- **Prompts become essays**: Typical prompts are 4-5 paragraphs long — describing context, pointing to files, explaining intent.
- **LLMs handle the structuring**: Raw, unstructured thoughts get synthesized by the model into actionable steps. The AI is good at figuring out what you mean, so you don't need to be precise.
- **Natural conversation style**: It's like talking to a very smart colleague who understands everything from the general sense of what you're saying.

---

## 2. The Feedback Loop: Completing the Circuit

### Core Insight

The #1 reason people get bad results from AI is an incomplete feedback loop. When the agent can't see, test, or validate its own output, it works blind.

### How to Complete the Loop

1. **Give it browser access**: Use Playwright MCP and Chrome DevTools MCP together to let the agent interact with the running application.
2. **Let it debug like a human**: Allow it to add console logs, check the console, inspect the DOM — exactly how a human developer would debug.
3. **Scenario-based testing**: Define explicit scenarios (e.g., "user can create a post, edit a post, delete a post, like a post") and ask the agent to test each one through the browser.
4. **Self-correction cycle**: Ask it to find bugs, fix them, re-test, and report back. The agent should iterate until all scenarios pass.

### The Analogy

A human developer's first instinct when debugging is to add console logs and check the browser. Give the AI the same tools and it'll debug the same way — effectively.

---

## 3. Prompting Principles That Deliver Results

### The Conversation Approach

Treat the LLM like a colleague, not a code generator. The interaction should feel like a working session, not a one-shot request.

### Key Phrases and Techniques

- **"Be thorough."** — Prevents lazy/shortcut solutions.
- **"Be critical."** — Makes it self-review and catch its own issues.
- **"Feel free to ask me clarifying questions."** — Opens a dialogue rather than forcing a guess.
- **"Go look at [specific area] and describe what you understand."** — Validates comprehension before making changes.
- **"Describe to me what the feature currently looks like."** — Ensures shared understanding of the current state.

### The Two-Phase Pattern

1. **Phase 1 — Understanding**: Ask the agent to explore, read, and explain back what it understands. Do NOT ask it to make changes yet.
2. **Phase 2 — Execution**: Only once you're confident it understands correctly, ask it to implement changes.

### Scenario-Driven Development

For any feature, define an explicit list of scenarios:

```
The features here are:
- You should be able to create a post
- You should be able to edit a post
- You should be able to comment on a post
- You should be able to delete a post
- You should be able to like a post
```

Then ask the agent to:
1. Generate all possible scenarios from your description.
2. Walk through the entire code chain for each scenario (dry run).
3. Fix any bugs found during the dry run.
4. Report its assessment of how each scenario works.

### Dry Runs Before Browser Testing

Ask the agent to mentally trace through the code for each scenario before actually running it. This catches logical errors early.

---

## 4. Pseudo-Code and Interface-First Design

### The Technique

Before asking the AI to build something complex, write a short Markdown document with:

- The exact API interface / script interface
- Pseudo-code (not actual code) of the intended behavior
- Directory structure
- Function signatures and their responsibilities
- Patterns for how the new system should work

### Why It Works

- **AI excels at pattern matching**: Give it a pattern and it will fill in the implementation perfectly.
- **Narrow focus = better output**: A well-defined interface constrains the solution space, leading to more accurate results.
- **Your vision, their execution**: You define the architecture, the AI implements it faithfully.

---

## 5. The "Let It Cook" Philosophy

### Stop Micromanaging Code

- Give a detailed 4-5 paragraph prompt, then walk away.
- Come back 20-30 minutes later and review.
- Use git diffs to see exactly what changed.
- Ask questions like you would on a PR from a colleague:
  - "Have we taken care of this edge case?"
  - "Does this affect this other area?"
  - "How do we make sure it works in this setting?"

### Trust the Process

Just like you wouldn't micromanage a human colleague's code, don't micromanage the AI. Review the output, ask questions, steer — but don't hover.

---

## 6. Code Is No Longer Written for Humans

### The Paradigm Shift

- Code was always a way for humans to interact with machines.
- We wrote code to be readable by other humans — verbose, styled, opinionated.
- Everyone had their own coding style and conventions.
- We're moving toward an era where humans won't often directly read or maintain the code being written.

### The New Model

- Define scenarios and ensure they always work.
- Generate comprehensive tests.
- Make it extremely difficult to break the application.
- The LLM maintains and evolves the code — humans steer the direction.
- The focus shifts from "readable code" to "correct behavior."

---

## 7. Prompts as Declarative Code

### The Analogy

- **React vs. DOM API**: React is declarative (declare what should happen), the DOM API is imperative (specify how to do it step by step).
- **Prompts vs. Code**: Prompts are the new declarative layer. You declare what is supposed to happen, the LLM figures out the imperative implementation.
- Code becomes the imperative layer that the AI writes — the "how."
- Prompts and AI instructions become the declarative layer that humans write — the "what."

---

## 8. Parallel Agent Workflows

### The Multi-Session Approach

- Clone the repository into 3 separate directories (e.g., code-1, code-2, code-3).
- Run a separate Claude Code (or Codex) session in each.
- Work on 3 different tasks simultaneously.
- While Agent 1 is working, give a prompt to Agent 2. When Agent 1 comes back with questions, switch to it while Agent 3 works.
- **Three agents** is the sweet spot for staying productive without context-switching overhead.

### Cross-Model Review

- Use Codex to review Claude's work, and vice versa.
- Frame it as: "Claude wrote this code. Review it critically and point out any bugs."
- The reviewing model tends to be thorough and competitive, finding real issues.
- Feed the review back to the original model: "Codex found these issues in your code."
- The original model will address the feedback earnestly.
- Run this loop until issues converge to zero.

---

## 9. Essential Codebase Hygiene for AI-Assisted Development

### Non-Negotiable Setup

- **Linting** (e.g., Biome): Catches style and correctness issues automatically.
- **Type checking** (TypeScript): Gives the AI and you confidence in correctness.
- **Tests**: The safety net that lets you move fast.
- **Git**: Always use version control. Diffs are your review tool.

### Why This Matters for AI

These tools complete the feedback loop. The AI can run the linter, check types, run tests — and self-correct based on the results. Without them, you're relying on the AI to be perfect on the first try (it won't be).

---

## 10. What I Built With This Workflow

### Concrete Examples

1. **GitHub Actions — Bundle Size Analyzer**: A custom GitHub Action that compares bundle size between the main branch and a PR, leaves a formatted comment on the PR, and adds status checks. Would have taken days of learning the GitHub Actions API manually. Done in a single one-hour session with a coding agent.

2. **Sync Engine Framework** (private/unreleased): A local-first, real-time sync framework using IndexedDB as the syncable browser database, with server sync. All mutations are optimistic, making the UI feel instant. Represents the kind of complex systems-level work now achievable with AI assistance.

3. **Document Editor**: A Notion-like document editor — one of the hardest frontend challenges.

4. **2D Interactive Canvas**: A Figma/Miro-like canvas with interactive nodes — another notoriously complex frontend problem.

### The Common Thread

These are problems that would have taken weeks to months to solve manually. With the AI workflow described above, they were accomplished in days to weeks.

---

## 11. Honest Assessment: When AI Falls Short

- AI still produces garbage sometimes — this hasn't gone away.
- Single-shot features are a myth. You will always need to steer, iterate, and correct.
- Think of the AI as an intern with all the knowledge in the world but no context about your specific project. It needs hand-holding, guidance, and direction.
- The key is not to expect perfection but to build a system (feedback loops, testing, review) that catches and corrects mistakes efficiently.
- The hand-holding pays off — once you give it the right context, it "blooms" and delivers exactly what you want.
