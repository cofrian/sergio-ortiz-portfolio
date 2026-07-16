# Adding projects

Use `portfolio` to include a repository. Add `portfolio-featured`, `portfolio-research` or `portfolio-experiment` for classification. `portfolio-hidden` excludes it regardless of other topics.

An optional `portfolio.json` can supply title, subtitle, role, year, categories, metrics with evidence references, demo/cover strategy and `approvedForRag`. README and JSON are hostile input: do not include secrets, raw customer data or private URLs.

The sync opens a PR. Review every generated fact, both languages, image rights, live-demo target, RAG approval and metric evidence before merging.
