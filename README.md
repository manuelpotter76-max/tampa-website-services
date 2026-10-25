# Tampa Website Services

Next.js 15 (App Router, plain JS) site for tampawebsiteservices.com. Hosted on Vercel, leads stored in Supabase.

## Run locally
```
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

## Environment variables (set in Vercel)
| Name | Needed | What it does |
|---|---|---|
| NEXT_PUBLIC_SITE_URL | yes | Canonical URL for SEO and sitemap |
| SUPABASE_URL | yes | https://upiviyzekrvwkwsdrunj.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | yes | Server-only. Never expose to the browser |
| ANTHROPIC_API_KEY | for chat | AI concierge. Without it the chat gives a canned reply with the booking link |
| ANTHROPIC_MODEL | no | Defaults to claude-haiku-5-5 |
| PAGESPEED_API_KEY | recommended | Google PageSpeed quota for the audit |
| RESEND_API_KEY, LEAD_NOTIFY_EMAIL, LEAD_FROM_EMAIL | optional | Email Manny on each new lead |
| NEXT_PUBLIC_CONTACT_EMAIL | optional | Overrides hello@tampawebsiteservices.com |

## Where things live
- `lib/site.js` business info, nav, prices
- `lib/industries.js` all 9 industry pages (rendered by `app/[industry]/page.js`)
- `lib/work.js` portfolio and quotes
- `app/api/*` lead, audit and chat endpoints
- `supabase/migrations` database schema (tables: leads, audits, chats; RLS on, server-only writes)

## Before launch
- Legal pages are drafts. Fill in the [bracketed] items and have a lawyer review.
- Replace the "Why I do this" copy on the About page.
- Keep old blog post URLs: add redirects in `next.config.mjs` if any move.
