# GitHub synchronization

The workflow runs on the 1st and 16th of each month (and manually), reads public repositories for `cofrian`, validates metadata and optional `portfolio.json`, prepares safe covers, runs validation/tests and opens a pull request.

Two independent outputs are generated:

- The visual portfolio follows the `portfolio*` topic rules and editorial overrides.
- The chatbot knowledge corpus includes public, non-empty, non-archived project repositories that have at least one GitHub topic. Repositories without topics, the profile repository and the portfolio application itself are not treated as projects.

The public README is sanitized, credential-like strings and instruction-like content are removed, and its length is bounded before it enters `src/content/generated-github-rag.json`. The `cofrian` profile README is stored separately as profile evidence.

Priority is `portfolio.json`, manual override, structured README, GitHub metadata, then a minimal record. Missing editorial fields produce `needsEditorialReview`; they are not invented.

Before strict topic mode, only the reviewed bootstrap repositories can enter. Run locally with:

```bash
$env:DRY_RUN="true"
npm run sync:github
```

After the topics task is complete, set the repository variable `STRICT_TOPIC_MODE=true`.
