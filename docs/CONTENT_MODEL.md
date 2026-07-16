# Content model

`ProjectRecord` is the curated public source. It has complete `en` and `es` fields, a visual strategy, categories, public links, source references and metrics. Every `ProjectMetric.evidenceRef` must resolve to one `SourceReference.id`.

Generated repository records live separately in `src/content/generated-projects.json` and require editorial review before becoming curated records. Browser-facing components receive only public DTO fields; raw database rows and embeddings are never serialized.

LinkedIn entries are manually supplied metadata. No profile or post scraping is performed.
