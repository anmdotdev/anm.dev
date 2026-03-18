# Distribution Drafts

Each blog post gets its own directory:

- `email.mdx`: newsletter content with frontmatter for `subject`, `preview`, and `summary`
- `linkedin.md`: the LinkedIn draft as plain Markdown
- `twitter.md`: the Twitter/X thread draft as plain Markdown

Example:

```text
content/distribution/<slug>/
  email.mdx
  linkedin.md
  twitter.md
```

The newsletter pipeline reads `email.mdx` directly. LinkedIn and Twitter drafts are stored here for manual posting.
