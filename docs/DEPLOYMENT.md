# Deployment

1. Create a Supabase project and apply `supabase/migrations/202607160001_initial.sql`.
2. Create a strong independent `RATE_LIMIT_HMAC_SECRET`, `CRON_SECRET`, `ADMIN_SECRET` and webhook secret.
3. Add server secrets to Vercel Production only; use separate values or omit external integrations in Preview.
4. Configure NVIDIA NIM with `NVIDIA_API_KEY`, the compatible base URL and a currently available model ID.
5. Configure Resend and a verified sender before enabling contact in production.
6. Add matching secrets to protected GitHub Environments for RAG indexing.
7. Import the GitHub repository into Vercel, use `main` for Production, leave the framework preset as Next.js and deploy.
8. Verify `/en`, `/es`, headers, `/api/chat`, the unavailable states and `/admin/status` before promoting.

No secret belongs in `NEXT_PUBLIC_*`, build logs, source code or repository variables. Preview and production credentials must be separate.
