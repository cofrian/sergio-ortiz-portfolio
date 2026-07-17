# RAG security

Allowed sources are topic-curated public GitHub projects, their sanitized public READMEs, verified portfolio case studies, the public GitHub profile README, verified profile/milestone content, approved notes and the full text of reviewed public LinkedIn posts. Private repositories, repositories without topics, issues, contact messages, environment files, logs, dependencies and build artifacts are excluded.

Document embeddings are generated outside the web request with the Transformers.js-compatible `Xenova/multilingual-e5-small` ONNX model and stored in a server-only Supabase index. The public site never receives embeddings, a Supabase browser key or direct database access.

The request pipeline validates the real streamed byte count and origin, applies atomic rate limiting, classifies scope/injection in English and Spanish, retrieves verified content, optionally calls NVIDIA NIM at low temperature, rejects output resembling prompts or credentials and returns public citations. Retrieved documents are serialized as untrusted JSON evidence and are never executed as instructions.

Runtime retrieval first uses the server-only bounded lexical search RPC. Until that migration exists, it can rank a bounded set of approved chunks on the Next.js server; if Supabase is unavailable it falls back to the versioned, sanitized topic corpus. None of these paths sends chunks, database credentials or provider credentials to the browser. Stored E5 vectors remain available for a future same-model semantic query path; embeddings from a different model must never be mixed.

No provider key, system instruction, raw corpus, embedding, SQL error or provider response is returned to the browser. The client receives only the final bounded answer and up to six public source cards. Without generation, a deterministic source response remains available when rate limiting and public content are available.
