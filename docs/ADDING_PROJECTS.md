# Adding projects

Use `portfolio` to include a repository. Add `portfolio-featured`, `portfolio-research` or `portfolio-experiment` for classification. `portfolio-hidden` excludes it regardless of other topics.

Forks remain excluded even when they have `portfolio`. Approve an intentional fork by adding `"allowFork": true` for that repository in `src/content/manual-project-overrides.json`; `portfolio-hidden` still takes precedence.

An optional `portfolio.json` can supply title, subtitle, role, year, categories, metrics with evidence references, demo/cover strategy and `approvedForRag`. README and JSON are hostile input: do not include secrets, raw customer data or private URLs.

The sync opens a PR. Review every generated fact, both languages, image rights, live-demo target, RAG approval and metric evidence before merging.
