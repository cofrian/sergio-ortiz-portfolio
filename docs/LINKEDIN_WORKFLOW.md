# LinkedIn workflow

The portfolio never scrapes LinkedIn. It supports two reviewed routes for bringing public posts into the site.

## 1. Official automatic sync

The daily `Sync LinkedIn posts` workflow calls LinkedIn's Posts API and opens a pull request when it finds new authored public posts. It stores the complete public commentary for RAG plus a bounded excerpt for the visual card. It never publishes generated copy directly.

Required GitHub `production` environment secrets:

- `LINKEDIN_ACCESS_TOKEN`
- `LINKEDIN_PERSON_URN`, formatted as `urn:li:person:...`

Optional environment variable:

- `LINKEDIN_API_VERSION`, currently defaulting to `202606`

The access token must include LinkedIn's `r_member_social` permission. LinkedIn currently treats this as a restricted permission, so a normal self-service application may not be approved. When either secret is missing, the workflow exits safely and changes nothing.

Official references:

- [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api)
- [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)

## 2. Curated fallback

Open the `Add LinkedIn post` issue form and paste the public URL, title, full public post text, short excerpt, publication date, category and an approved image URL. The action validates these fields and creates a pull request.

No scraping occurs. Before merge, verify the excerpt, image rights and whether it should be featured. Merging re-triggers the RAG workflow when configured.

This fallback remains available even if LinkedIn does not grant read access to the official API.

LinkedIn profile fields are not scraped. The assistant combines the reviewed local profile, verified milestones and public GitHub profile README. Additional employment records should be added only from the verified CV or an approved structured profile source.
