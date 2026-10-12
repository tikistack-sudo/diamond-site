# STATE — diamond-site

## Milestone
**LAUNCH ESSENTIALLY COMPLETE (Oct 11 2026).** The site is live at
https://diamondroyaltycleaningco.com AND www (HTTP 200; the old 522 is fixed). The
booking form posts to the same origin: the `diamond-site` **Worker** validates, stores
each request in D1 `bookings`, and emails both CEO addresses (tyrikn2@gmail.com,
diamondroyaltyny@gmail.com) plus a customer "received/under review" email — via Resend.
Verified live by the agent: POST → 201 + D1 row #1; invalid ZIP → 400. Remaining:
owner inbox check of the two test emails (or a fresh test after Resend verification
completes), owner commit + push (agent push denied by policy), and revoking the
temporary Cloudflare API token used for setup.

## Architecture (PIVOTED — see DECISIONS #16–17)
- NOT Cloudflare Pages (this account has none). The site is the `diamond-site`
  **Worker**: static assets imported as modules + same-origin `/api/booking` handler.
- `worker.js` = site + API in one module Worker (validate → D1 insert → 2 Resend
  emails; honeypot drop; 400/413/500 guards; 405 non-POST; 404 fallback; cache headers).
- `wrangler.jsonc` reproduces the deployment (`npx wrangler deploy`); RESEND_API_KEY is
  a Worker secret, set via API and documented as `npx wrangler secret put RESEND_API_KEY`.
- D1 `bookings` d84a3ce1-3055-4a96-8638-0e485fade614, schema from `schema.sql`
  (verified: table + 2 indexes). Existing `rocca-waitlist` DB untouched.
- Resend: domain `diamondroyaltycleaningco.com` added (id c5c407f6-…), 4 DNS records
  created in the zone (DKIM resend._domainkey; MX+SPF on send; CNAME rsend — DNS-only).
  Coexists with Cloudflare Email Routing (receiving) — no record conflicts.
- Custom domains on the Worker: apex (pre-existing) + www (attached by agent;
  broken CNAME deleted, rollback noted in DECISIONS #17).
- `functions/` (Pages Function variant) deleted BEFORE any commit — superseded.

## Verification evidence (agent, Oct 11)
- Live markers: `id="phone"` 1, `Send My Request` 1, `Request Received` 1,
  `connect-src 'self'` 1, `Draft — Not Sent` 0; webp/svg 200 correct types; unknown
  path 404; GET /api/booking 405.
- POST valid → HTTP 201; D1 rows #1 and #3 stored (status "new"). Invalid zip → 400.
- **Resend domain verified** (all 4 records). Booking #3 → `owner_emailed: true` (both
  CEO addresses). Direct probe to a real address → 200 + email id. `example.com` test
  address → 422 (reserved domain; expected — real customer addresses are unaffected).
- www → HTTP 200 after Workers-domain attach.

## Repo / deploy
- Deploy path now: REST `PUT workers/scripts/diamond-site` (done) or
  `npx wrangler deploy` from repo root. Custom domains persist across deploys.
- Repo: `main` == `origin/main` @ `b893349` + local working tree with the launch changes
  (index.html, worker.js, wrangler.jsonc, schema.sql, RUNBOOK/STATE/TASKS/README/
  DECISIONS, 4 archive moves, `__view-compare.html` deleted). **Owner must commit + push**
  so the repo matches production.
- Old GitHub Pages copy (tikistack-sudo.github.io/diamond-site/) is stale + harmless;
  disable at leisure.
- The pre-launch "preview-only" copy is gone (LAUNCH-CHECKLIST §1–6, §9 done; §7 scope
  hint left pending owner confirmation).

## Open items
1. **Owner: `git push origin main`** — launch commits `63c7075` + `91fff40` are local
   only; `origin/main` still `b893349`.
2. **Owner: revoke the Cloudflare API token** used for setup (My Profile → API Tokens)
   and delete `/tmp/opencode/creds.env` (still present at handoff time).
3. **Owner confirmed the pipeline works** ("everything works great", Oct 11) — covers
   site, bookings, and CEO emails. Optional cleanup: test rows (rows #1/#3,
   `email='jane.tester@example.com'`), stale GitHub Pages copy.
4. One human pass on the LIVE site: mobile (~390px) visual alignment of the new form +
   Request Received receipt; then watch the first real booking end-to-end.
5. LAUNCH-CHECKLIST §7 scope hint + footer nav label "Request Builder" — owner confirm.
6. Future hardening: rate limiting/Turnstile, prune webp-candidates to the shipped file,
   remove `crimson-bar-1917`/`empty-wind-b8e3` leftover Worker scripts (owner choice).
