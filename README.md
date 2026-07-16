# Sergio Ortiz — living portfolio

A bilingual, evidence-backed portfolio built with Next.js 16. It presents selected data and AI systems, synchronizes approved public GitHub repositories through reviewed pull requests, supports curated LinkedIn notes, and includes restricted portfolio search.

## Product

- English at `/en` and Spanish at `/es`; no automatic locale guessing.
- Home, Work, Project Detail, Research, Experience, About, Notes, Contact, Ask and Connections.
- Ivory editorial design with project-specific visuals and accessible mobile alternatives.
- Every displayed project metric points to a public source reference.
- Real CV, portrait, public email and LinkedIn posts remain disabled until supplied.

## Local development

```bash
npm install
npm run dev
```

The public pages and local project search work without external credentials. Copy `.env.example` to `.env.local` only when enabling integrations. Never commit it.

```bash
npm run validate:content
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run security:check
```

## Architecture

```text
Browser
  └─ Next.js on Vercel
       ├─ versioned public content
       ├─ Supabase service-only RAG and rate limits
       ├─ NVIDIA NIM through a server adapter
       ├─ Resend through /api/contact
       └─ GitHub Actions for sync, covers and embeddings
```

GitHub-generated content never goes directly to production. The sync workflow opens a pull request with `needsEditorialReview` where required.

## Add a project

1. Add `portfolio` to the public repository.
2. Add `portfolio-featured`, `portfolio-research` or `portfolio-experiment` when applicable.
3. Optionally add a validated `portfolio.json`.
4. Run `DRY_RUN=true npm run sync:github`.
5. Review the generated pull request and cover.

`portfolio-hidden` always wins. Forks need an explicit future override. Until Sergio completes the repository topics, the verified bootstrap list remains active. See [docs/ADDING_PROJECTS.md](docs/ADDING_PROJECTS.md).

## Integrations

- Supabase: apply `supabase/migrations`, set server secrets, then run `npm run ingest:rag`.
- NVIDIA NIM: set `NVIDIA_API_KEY`, `LLM_BASE_URL` and `LLM_MODEL`. Without it, Ask returns verified search results and citations.
- LinkedIn: create an issue using “Add LinkedIn post”; the workflow creates a PR without scraping.
- Contact: set `RESEND_API_KEY` and `CONTACT_EMAIL`.
- CV: add `public/cv/Sergio_Ortiz_EN.pdf` and `public/cv/Sergio_Ortiz_ES.pdf`, then update the profile config.
- Portrait: replace the monogram placeholder with an approved local asset.

Detailed setup is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), [docs/GITHUB_SYNC.md](docs/GITHUB_SYNC.md), [docs/RAG_SECURITY.md](docs/RAG_SECURITY.md) and [docs/LINKEDIN_WORKFLOW.md](docs/LINKEDIN_WORKFLOW.md).

## Deployment

The intended production target is Vercel Hobby linked to `cofrian/sergio-ortiz-portfolio`, with preview deployments for pull requests and production from `main`. External services are initialized lazily so builds remain valid without their secrets.

## Security

Private providers are called only from server routes. Service-role credentials, LLM keys, mail keys, webhook secrets and prompts are never serialized to client components. RLS denies anonymous access to internal tables, sensitive endpoints fail closed in production when atomic rate limiting is unavailable, and CI scans source and bundles for secret patterns. See [SECURITY.md](SECURITY.md).
