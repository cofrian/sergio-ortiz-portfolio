# RAG security

Allowed sources are curated projects, approved public READMEs/portfolio files, verified profile content, approved notes and curated LinkedIn metadata. Private repositories, issues, messages, environment files, logs, dependencies and build artifacts are excluded.

Document embeddings are generated outside the web request with the Transformers.js-compatible `Xenova/multilingual-e5-small` ONNX model and stored in a server-only Supabase index. The public site never receives embeddings, a Supabase browser key or direct database access.

The request pipeline validates the real streamed byte count and origin, applies atomic rate limiting, classifies scope/injection, retrieves verified content, optionally calls NVIDIA NIM at low temperature, rejects output resembling prompts or credentials and returns public citations. Retrieved documents are data and are never executed as instructions.

No provider key, system instruction, raw chunk, embedding, SQL error or provider response is returned to the browser. Without generation, the deterministic search response remains available when rate limiting and public content are available.
