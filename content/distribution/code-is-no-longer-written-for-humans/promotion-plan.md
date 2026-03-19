# Promotion Plan: Code Is No Longer Written for Humans

This document is the execution plan for promoting:

- Post title: `Code Is No Longer Written for Humans`
- Canonical URL: `https://anm.dev/blog/code-is-no-longer-written-for-humans`
- Publish date: `2026-03-18`

Use this file as the single source of truth for promotion steps, posting copy, and setup.

## Goal

Get this post in front of the right developer audience without turning distribution into spam.

Primary goals:

- get the post indexed quickly
- reach developers who care about AI coding workflows and software architecture
- drive high-quality discussion
- grow newsletter subscribers and repeat readers for the series

## Current Status

Already prepared in this directory:

- [email.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/distribution/code-is-no-longer-written-for-humans/email.mdx)
- [linkedin.md](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/distribution/code-is-no-longer-written-for-humans/linkedin.md)
- [twitter.md](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/distribution/code-is-no-longer-written-for-humans/twitter.md)

Already posted manually:

- LinkedIn
- Twitter / X

Do not repost the same LinkedIn and X drafts again. Use the follow-up posts in this plan instead.

## Recommended Order

Core distribution order for this post:

1. Send the newsletter.
2. Submit the article in Google Search Console and request indexing.
3. Submit or verify the sitemap in Google Search Console.
4. Submit the original post to Hacker News.
5. Cross-post to DEV with the canonical URL pointing to `anm.dev`.
6. Cross-post to Hashnode with the original URL pointing to `anm.dev`.
7. Share in relevant private communities where self-promotion is normal and you already participate.
8. Publish one LinkedIn follow-up and one X follow-up later in the week.

Optional:

- set up IndexNow for Bing and other participating search engines
- submit to Lobsters only if you already have meaningful participation there

## Execution Timeline

If you are starting on `2026-03-19`, use this schedule:

### Day 1: 2026-03-19

1. Send the newsletter.
2. Request indexing in Google Search Console.
3. Submit `https://anm.dev/sitemap.xml` in Search Console if not already submitted.
4. Post to Hacker News.
5. Stay available for at least 60-90 minutes to reply to comments.

### Day 2: 2026-03-20

1. Cross-post to DEV.

### Day 4: 2026-03-22

1. Cross-post to Hashnode.

### Day 6: 2026-03-24

1. Publish the LinkedIn follow-up post.

### Day 7: 2026-03-25

1. Publish the X follow-up thread.

### Days 7-10: 2026-03-25 to 2026-03-28

1. Share in 3-5 relevant private communities you already belong to.
2. Reply to comments on every platform.
3. Note which framing triggered the most discussion.

If you are reading this after `2026-03-19`, do the next unfinished item in the list rather than trying to preserve the original dates exactly.

## Fast Checklist

- [ ] Newsletter sent
- [ ] Google Search Console ownership verified
- [ ] URL inspection completed
- [ ] Request indexing clicked for the canonical post URL
- [ ] Sitemap submitted or verified
- [ ] Hacker News post submitted
- [ ] DEV canonical cross-post published
- [ ] Hashnode canonical cross-post published
- [ ] LinkedIn follow-up published
- [ ] X follow-up thread published
- [ ] Shared in relevant private communities
- [ ] Replied to comments

## Platform Priority

Highest priority for this post:

1. Newsletter
2. Google Search Console
3. Hacker News
4. DEV
5. Hashnode

Good if relevant:

- private engineering Slack groups
- private Discord communities for developers
- founder or builder communities if the topic fits

Only if already active there:

- Lobsters

Low-value or risky for this post:

- random subreddits
- generic promotion groups
- broad communities where link drops are treated as spam

## Exact Posting Content

## Newsletter

Use the draft in [email.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/distribution/code-is-no-longer-written-for-humans/email.mdx).

Exact send version:

### Subject

```text
I used to think maintainability lived mostly inside the code
```

### Preview

```text
That instinct is still correct. It is just no longer sufficient once AI agents become real collaborators.
```

### Body

```text
I used to think maintainability lived mostly inside the code.

Good variable names. Clean abstractions. Small functions. Predictable file structure. A tasteful amount of comments. The goal was obvious: make sure the next developer could open the file, understand it quickly, and change it without breaking everything.

That instinct is still correct. It is just no longer sufficient.

Over the last few months, I have spent a lot of time building software with AI coding agents. Not as autocomplete. Not as a novelty. As actual collaborators that read the codebase, propose changes, write implementation, run checks, and iterate. And that experience has changed how I think about what code is for.

Here is the shift I keep coming back to:

Code is no longer written primarily for humans to read line by line. It is increasingly written as the executable output of a clearer layer above it: intent.

Readable code still matters. Architecture still matters. But the center of gravity has moved.

The biggest AI failures I see usually do not come from the model being unable to read the code. They come from missing intent. A model can trace files and follow types faster than I can. But if the real rule is buried in Slack, trapped in somebody's head, or never written down at all, the model has to guess.

And guessing is where expensive mistakes come from.

That is why I think the leverage is moving upward:

- specs that define behavior clearly
- documentation that captures why a decision exists
- tests that act like product contracts
- constraints and scenarios that leave less room for improvisation

In an AI-heavy workflow, docs explain what should happen and tests prove whether it actually does. That pair is a much stronger maintenance layer than style preferences alone.

This essay is my attempt to make that argument carefully:

https://anm.dev/blog/code-is-no-longer-written-for-humans
```

## Hacker News

### Exact submission

Title:

```text
Code Is No Longer Written for Humans
```

URL:

```text
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

### Important notes

- submit it as a link post, not a text post
- do not rewrite the title to sound more sensational
- do not add "Show HN"
- do not add a canned first comment unless there is a strong reason
- stay around and reply if people ask good-faith questions

### Commenting guidance

Good reply style:

- answer objections directly
- keep replies technical and concrete
- acknowledge tradeoffs
- avoid defensive author-mode replies

Bad reply style:

- arguing with every criticism
- repeatedly restating the article thesis without addressing the actual comment
- dropping the link again in replies

## DEV

### Exact metadata

Title:

```text
Code Is No Longer Written for Humans
```

Tags:

```text
ai, programming, productivity, webdev
```

Canonical URL:

```text
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

### Exact top note

```md
Originally published on my site: https://anm.dev/blog/code-is-no-longer-written-for-humans

Republishing here for DEV readers. The canonical version is the original post above.
```

### Exact article body

Use the exact article body from:

- [content/blog/code-is-no-longer-written-for-humans.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/blog/code-is-no-longer-written-for-humans.mdx)

Do not rewrite the article for DEV. Keep it identical so the canonical source remains clean and the idea lands consistently.

## Hashnode

### Exact metadata

Title:

```text
Code Is No Longer Written for Humans
```

Subtitle:

```text
Maintainability still matters, but AI is shifting the real source of truth upward: from code to intent, specs, docs, scenarios, and tests.
```

Original URL:

```text
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

Tags:

```text
AI, Software Engineering, Developer Tools, Architecture
```

### Exact top note

```md
Originally published at https://anm.dev/blog/code-is-no-longer-written-for-humans

Republishing here for Hashnode readers. The original URL is set on this post.
```

### Exact article body

Use the exact article body from:

- [content/blog/code-is-no-longer-written-for-humans.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/blog/code-is-no-longer-written-for-humans.mdx)

## Private Communities

Use this in private Slack or Discord communities where:

- you already participate
- technical discussion is normal
- sharing relevant articles is accepted

### Exact message

```text
Sharing because a few people here are working with AI coding tools in real production workflows.

My argument is that maintainability is shifting upward. Readable code still matters, but the bigger failure mode with AI is missing intent: specs, scenarios, docs, and tests that never got written down.

Curious where people here agree or disagree:
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

### Community rules

- only post where the topic is actually relevant
- prefer communities where you already have some trust
- do not spray the same message across public channels that do not know you
- only post once per community

## LinkedIn Follow-Up

Use this instead of reposting the original LinkedIn draft.

Recommended date:

- `2026-03-24`

### Exact post

```text
A lot of AI coding failures are not model failures.

They are intent failures.

The model can read files.
It can follow call sites.
It can trace types.

What it cannot do is recover rules that only exist in Slack, tribal memory, or unwritten assumptions.

That is why I think maintainability is moving upward:

- specs
- scenarios
- docs
- tests

Readable code still matters.

But increasingly, code is the compiled artifact of intent.

I wrote the full argument here:
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

## X Follow-Up Thread

Use this instead of reposting the original thread.

Recommended date:

- `2026-03-25`

### Post 1

```text
A lot of AI coding failures are not model failures.

They are intent failures.

https://anm.dev/blog/code-is-no-longer-written-for-humans
```

### Post 2

```text
The model can read code.
It can trace types.
It can follow call sites.

What it cannot recover reliably is unwritten intent.
```

### Post 3

```text
If the real rule lives in Slack, in someone's head, or in "everybody knows this," the model has to guess.

And guessing is where expensive mistakes come from.
```

### Post 4

```text
That is why I think maintainability is moving upward:

- specs
- scenarios
- docs
- tests

Not away from code.
Above code.
```

### Post 5

```text
Readable code still matters.

But increasingly, code is the compiled artifact of intent.
```

## Step-by-Step Setup Instructions

## 1. Send the Newsletter

1. Open your newsletter publishing flow for the site.
2. Use the copy from [email.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/distribution/code-is-no-longer-written-for-humans/email.mdx).
3. Confirm the subject and preview text match this document.
4. Send the email.
5. After sending, verify the article link opens the canonical post URL.

## 2. Set Up Google Search Console

Do this once if you have never connected `anm.dev` before.

1. Open `https://search.google.com/search-console/about`.
2. Add `anm.dev` as a property.
3. Verify ownership using your preferred method.
4. Once verified, open the property dashboard.

## 3. Request Indexing for the Post

1. In Google Search Console, open `URL Inspection`.
2. Paste this exact URL:

```text
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

3. Wait for the inspection result.
4. Click `Request indexing`.
5. If Google reports issues, note them and resolve them before moving on.

## 4. Submit the Sitemap

1. In Google Search Console, open `Sitemaps`.
2. Submit this URL if it has not already been submitted:

```text
https://anm.dev/sitemap.xml
```

3. If it is already present and healthy, mark this step complete.

## 5. Post to Hacker News

1. Open `https://news.ycombinator.com/submit`.
2. Select a link submission.
3. Paste the exact title from this document.
4. Paste the exact canonical URL from this document.
5. Submit.
6. Do not edit the title to chase clicks.
7. Stay available to reply for at least 60-90 minutes after submission.

## 6. Cross-Post to DEV

1. Open `https://dev.to/new`.
2. Add the exact title from this document.
3. Add the tags from this document.
4. Set the canonical URL to:

```text
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

5. Add the exact top note from this document.
6. Paste the exact article body from [content/blog/code-is-no-longer-written-for-humans.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/blog/code-is-no-longer-written-for-humans.mdx).
7. Preview the post.
8. Publish.

## 7. Cross-Post to Hashnode

1. Open your Hashnode editor.
2. Add the exact title from this document.
3. Add the exact subtitle from this document.
4. Open the article settings.
5. In the republishing or original URL field, add:

```text
https://anm.dev/blog/code-is-no-longer-written-for-humans
```

6. Add the tags from this document.
7. Add the exact top note from this document.
8. Paste the exact article body from [content/blog/code-is-no-longer-written-for-humans.mdx](/Users/anmolmahatpurkar/Projects/Anmdotdev/anm.dev/content/blog/code-is-no-longer-written-for-humans.mdx).
9. Confirm the original URL is set correctly before publishing.
10. Publish.

## 8. Share in Private Communities

1. Pick 3-5 communities where:
   - AI coding workflows are discussed
   - developer tooling discussion is normal
   - link sharing is acceptable
2. Use the exact private-community message from this document.
3. Post once.
4. Reply to follow-up comments.

## 9. Publish the LinkedIn Follow-Up

1. Open LinkedIn on `2026-03-24` or the next convenient day.
2. Use the exact LinkedIn follow-up copy from this document.
3. Publish.
4. Reply to comments.

## 10. Publish the X Follow-Up Thread

1. Open X on `2026-03-25` or the next convenient day.
2. Start a new thread.
3. Use the 5 posts in the exact order shown in this document.
4. Publish.
5. Reply to meaningful comments.

## Optional: Set Up IndexNow

This is optional. Do it after the core steps above.

1. Open `https://www.bing.com/indexnow/IndexNowView/IndexNowGetStartedView`.
2. Generate an IndexNow key.
3. Host the key file on the root domain.
4. Submit the canonical article URL.
5. Confirm the submission succeeded.

This is useful for Bing and participating search engines, but not necessary before newsletter, Search Console, Hacker News, DEV, and Hashnode.

## Metrics To Watch

Do not judge success only by pageviews.

Track:

- newsletter signups
- Hacker News comments and upvotes
- replies from relevant engineers
- bookmarks or saves on social platforms
- referral traffic from DEV and Hashnode
- whether later posts in the series get easier to launch

## What Not To Do

- do not repost the same link repeatedly with the same framing
- do not rewrite the title to be more clickbait-y
- do not mass-post to irrelevant communities
- do not turn every reply into a link drop
- do not optimize only for vanity traffic spikes

## Sources

- Google Search Console and indexing:
  - `https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl`
  - `https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap`
  - `https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls`
- Structured data:
  - `https://developers.google.com/search/docs/appearance/structured-data/article`
- Hacker News:
  - `https://news.ycombinator.com/newsguidelines.html`
- Lobsters:
  - `https://lobste.rs/about`
- DEV:
  - `https://dev.to/p/editor_guide/`
- Hashnode:
  - `https://docs.hashnode.com/help-center/hashnode-editor/how-to-set-a-canonical-link`
  - `https://docs.hashnode.com/help-center/hashnode-editor/how-to-control-who-sees-your-article`
  - `https://docs.hashnode.com/blogs/editor/writing-a-blog-post`
- IndexNow:
  - `https://www.bing.com/indexnow/IndexNowView/IndexNowGetStartedView`

