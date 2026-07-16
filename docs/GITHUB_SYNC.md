# GitHub synchronization

The six-hour workflow reads public repositories for `cofrian`, filters by portfolio topics, validates metadata and optional `portfolio.json`, prepares safe covers, runs validation/tests and opens a pull request.

Priority is `portfolio.json`, manual override, structured README, GitHub metadata, then a minimal record. Missing editorial fields produce `needsEditorialReview`; they are not invented.

Before strict topic mode, only the reviewed bootstrap repositories can enter. Run locally with:

```bash
$env:DRY_RUN="true"
npm run sync:github
```

After the topics task is complete, set the repository variable `STRICT_TOPIC_MODE=true`.
