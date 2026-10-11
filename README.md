# diamond-site

Production site for **Diamond Royalty Cleaning Company** — live at
[diamondroyaltycleaningco.com](https://diamondroyaltycleaningco.com) (and
[www](https://www.diamondroyaltycleaningco.com)), served by the Cloudflare Worker
`diamond-site` (static assets + booking API in one script).

## Stack

- Static single-file site: `index.html` (no framework, no build step)
- Cloudflare Worker `diamond-site` (`worker.js`): serves the site AND the booking API
  (`POST /api/booking`) from the same origin
- Cloudflare D1 database: `bookings` (see `schema.sql`)
- [Resend](https://resend.com) for transactional email (domain-verified)
- Deploy: `npx wrangler deploy` (config in `wrangler.jsonc`) — the live Worker was also
  deployable via the Cloudflare dashboard

## Booking flow

The "Build a Quote Request" form POSTs JSON to `/api/booking` (same origin). The Worker
validates the submission, stores it in the D1 `bookings` table, and sends two emails via
Resend:

1. **Owner/CEO** (`BOOKING_NOTIFY_EMAIL`, comma-separated list): "New booking request —
   \<service\> — ZIP \<zip\>" with all fields, so the team can call and confirm details
   and pricing.
2. **Customer**: confirmation that the request was forwarded and is being reviewed (no
   appointment is confirmed until the team follows up).

A hidden honeypot field silently drops the most basic spam bots.

## Configuration

Bindings on the `diamond-site` Worker (also declared in `wrangler.jsonc`):

| Binding | Type | Purpose |
|---|---|---|
| `DB` | D1 | the `bookings` database |
| `RESEND_API_KEY` | secret | Resend API key (`npx wrangler secret put RESEND_API_KEY`) |
| `BOOKING_NOTIFY_EMAIL` | text var | CEO notification recipients (comma-separated) |

Email is sent from `bookings@diamondroyaltycleaningco.com` — works because the domain is
verified in Resend (DKIM `resend._domainkey`, SPF/MX on `send`, tracking CNAME `rsend`).
Incoming mail uses Cloudflare Email Routing — unrelated to sending, no record conflicts.

## Local preview

```sh
python3 -m http.server 8765
```

Serves the static page only; `/api/booking` requires the deployed Worker.
