# Security audit — 2026-07-17

## Scope

Repository history and current tree, dependencies, GitHub settings and workflows, Vercel production configuration, public browser assets, security headers, API routes, contact and RAG flows, screenshot SSRF controls, Supabase grants/RLS/functions and public network behavior.

## Outcome

No exposed API key, provider credential, database password, private key or privileged Supabase JWT was found in the repository, Git history, public HTML, browser JavaScript, RSC payloads or inspected production traffic. GitHub secret scanning and CodeQL had no open alerts, and the dependency audit reported no known vulnerabilities.

The audit did identify several defense-in-depth gaps. They were remediated before release:

| Area | Finding | Resolution |
|---|---|---|
| Vercel | The Supabase integration had provisioned database passwords, PostgreSQL URLs, an internal JWT secret and browser keys in all environments although the app did not need them. | Reconnected only to Production and retained only `SUPABASE_URL` plus the current server secret. |
| API bodies | Payload limits trusted the optional `Content-Length` header. | Added streamed byte counting with hard limits for chat, contact and GitHub webhooks. |
| API caching | Some refusal and error responses inherited a revalidation cache policy. | All API JSON responses now use `no-store`, `no-cache` and an expired timestamp. |
| Email | User-controlled names could contain line breaks before entering the subject. | Added single-line control-character normalization and length limits. |
| RAG | Generated text had no final secret-shaped output gate. | Added a final output validator for prompt/configuration wording, provider-key formats and private-key material. |
| Supabase | Legacy defaults and the server role had privileges broader than the application needed. | Revoked public schema access, denied future application-owned objects by default and reduced the server role to explicit row-level operations and two RPCs. |
| GitHub Actions | Actions used mutable major-version tags and repository policy allowed arbitrary actions. | Pinned every Action to a full commit SHA, enabled mandatory SHA pinning and allowlisted only GitHub-owned plus the two required third-party Actions. |
| GitHub permissions | Workflows could approve pull requests. | Disabled workflow PR approval; default token access remains read-only and write jobs declare permissions explicitly. |
| Abuse controls | Only application-level limits protected public APIs. | Published a Vercel firewall rule limiting `/api/` traffic to 60 requests per minute per IP, in addition to tighter fail-closed application limits. |
| Admin login | The optional diagnostics login had no attempt limit. | Added the same atomic, HMAC-anonymized limiter; the route remains a 404 when no admin secret is configured. |

## Verification evidence

- Sensitive path probes such as `/.env`, `/.git/config` and configuration-file guesses returned 404.
- `/admin/status` returned 404 because production has no admin secret.
- Browser assets contained no NVIDIA, GitHub, Resend, Supabase privileged-key, PostgreSQL credential or private-key pattern.
- Production sent CSP, HSTS, frame blocking, MIME blocking and restrictive referrer/permissions policies.
- Same-origin validation rejected foreign origins and unsupported content types.
- Unsigned webhook and revalidation requests were rejected; GitHub webhook signatures use HMAC-SHA256 with timing-safe comparison.
- Supabase security advisors returned no findings after migration.
- Anonymous access probes to every application table were denied, and private RPCs were unavailable anonymously.
- Current public-schema tables grant no privileges to `anon` or `authenticated`; server grants exclude `TRUNCATE`, `REFERENCES` and `TRIGGER`.
- Local lint, type checking, unit tests, production build, secret/bundle scan and dependency audit completed successfully.

## Intentional public information

Project repositories, verified project evidence, LinkedIn URLs and the portfolio contact address are public by product design. They are not credentials. Contact delivery credentials and the private recipient configuration remain server-only.

## Residual risk

- Public services cannot be made immune to all denial-of-service or provider outages. Application features fail closed when the atomic limiter or private provider is unavailable.
- The provider-owned `supabase_admin` role retains platform-managed default grants that the project migration role cannot change. No current application object is owned by that role or anonymously exposed; project migrations use the hardened `postgres` owner. Supabase has announced platform-level grant hardening for existing projects in 2026.
- NVIDIA, Vercel, Resend and Supabase free-tier behavior can change. The RAG flow falls back to verified search sources when generation is unavailable.
- Secrets must still be rotated immediately if a provider reports exposure, even when repository scans are clean.

## Ongoing controls

Weekly CodeQL, Gitleaks, bundle inspection and dependency audit; Dependabot vulnerability alerts and security updates; reviewed synchronization pull requests; twice-monthly portfolio sync; production-only secrets; and periodic verification of Vercel firewall events, Supabase advisors and GitHub security alerts.
