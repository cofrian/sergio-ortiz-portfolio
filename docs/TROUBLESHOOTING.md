# Troubleshooting

- Build works but Ask returns unavailable: configure Supabase/rate-limit secrets in production. NVIDIA is optional.
- Ask returns sources without generated prose: NVIDIA is absent, timed out or outside its free allowance; this is expected fallback behavior.
- Contact returns 503: add both Resend and destination email configuration.
- A repository does not appear: check topics, archived/empty/fork status and run the sync with `DRY_RUN=true`.
- A cover is deterministic: the demo host was missing, failed DNS/HTTPS validation or was not allowlisted.
- Admin status returns 404: `ADMIN_SECRET` is intentionally absent.
- Supabase was paused: resume it; public content remains available while private integrations fail closed.
