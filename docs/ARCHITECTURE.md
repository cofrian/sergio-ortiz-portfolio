# Architecture

Next.js Server Components render all content-first pages. Client JavaScript is limited to navigation sheet, filters, forms, Ask and the dynamically loaded Cytoscape graph. The browser calls same-origin API routes; those server routes are the only layer allowed to reach private providers.

Public content is versioned in Git. Supabase is not a manual CMS: it stores RAG documents/chunks, synchronization records, atomic rate limits and optional private contact records. GitHub Actions performs expensive or privileged work such as metadata sync, screenshots and E5 embeddings.

Failure modes are explicit: missing CV/photo/posts show placeholders, missing NVIDIA falls back to source search, and missing Supabase rate limiting closes sensitive production endpoints.
