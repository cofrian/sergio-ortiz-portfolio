# Deployment

1. Create a Supabase project and apply every file in `supabase/migrations` in timestamp order.
2. Create a strong independent `RATE_LIMIT_HMAC_SECRET`, `CRON_SECRET`, `ADMIN_SECRET` and webhook secret.
3. Add server secrets to Vercel Production only; use separate values or omit external integrations in Preview. The web app needs only `SUPABASE_URL` and `SUPABASE_SECRET_KEY`, never PostgreSQL connection strings, database passwords, JWT secrets, anonymous keys or browser-prefixed Supabase variables.
4. Configure NVIDIA NIM with `NVIDIA_API_KEY`, the compatible base URL and a currently available model ID.
5. Configure Resend and the private `CONTACT_EMAIL` recipient before enabling contact in production. During initial testing, `onboarding@resend.dev` can send only to the email associated with the Resend account; use a verified domain before sending to a different recipient.
6. Add matching secrets to protected GitHub Environments for RAG indexing.
7. Import the GitHub repository into Vercel, use `main` for Production, leave the framework preset as Next.js and deploy.
8. Verify `/en`, `/es`, headers, `/api/chat`, the unavailable states and `/admin/status` before promoting.

No secret belongs in `NEXT_PUBLIC_*`, build logs, source code or repository variables. Preview and production credentials must be separate. `SUPABASE_SERVICE_ROLE_KEY` remains a temporary code-level fallback for older installations, but new deployments must use `SUPABASE_SECRET_KEY` and should remove the legacy key.
