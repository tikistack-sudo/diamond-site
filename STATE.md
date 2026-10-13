# STATE — diamond-site

## Milestone
**LAUNCH + WHITE THEME COMPLETE (Oct 12, 2026) — production verified.** The Worker
`diamond-site` serves the white-theme homepage with the new "AIRBNB RESIDENTIAL AND
COMMERCIAL CLEANING" artwork (`c1-airbnb-q82.webp`, 171,804 B, 1080×1350) at both apex
and www. Booking pipeline unchanged and re-verified after deploy (405/400 guards).
Superseded artwork sources and review artifacts archived. Remaining: owner push + token
revocation, one mobile eyeball pass, ongoing business confirmations.

> **NEW — Milestone 6 (booking reply routing) APPROVED Oct 13, 2026, NOT EXECUTED.**
> Full step-by-step task set is in `RUNBOOK.md` → *MILESTONE 6* (R1–R6); rationale and
> reversals in `DECISIONS.md` #20. Budget **$0**. Starting next session.

## Milestone 6 — reply routing (APPROVED, not executed)

- Problem (verified live Oct 13): notification sent from `bookings@…` with **no `Reply-To`**
  (`worker.js:23–37`) ⇒ `Reply` addresses `bookings@…`, which has **no inbox** (Email
  Routing: one rule `services@…` → Worker `empty-wind-b8e3`; catch-all disabled). The
  requester's address exists only as body text.
- Fix, in order: **R1** `reply_to` + escaped HTML `mailto:` part with threaded `Re:`
  subject (repo edit, `worker.js` only) → **R2** deploy + live `Reply-To:` proof → **R3**
  Email Routing rule `bookings@…` → `diamondroyaltyny@gmail.com` (**already verified**
  destination, Oct 9) → **R4** Gmail *Send mail as* `bookings@…` via Resend SMTP
  (owner-only) → **R5** deliverability proof (inbox not spam; `dkim=pass d=…`) → **R6**
  docs/handoff.
- Verified at approval time: Resend send API accepts `reply_to`; Resend SMTP =
  `smtp.resend.com`, user `resend`, key = API key, 587/TLS; Email Routing `status: ready`
  (MX `route*.mx.cloudflare.net`); DMARC `p=quarantine adkim=r aspf=r` (DKIM alignment is
  the path — "Send through Gmail" is forbidden).
- Do not start R1 against a dirty `worker.js`; R2's deploy needs the Cloudflare token
  (owner's own `wrangler login` is the fallback).

## Repo / deploy (current)
- Local `main`: `cc5c4df` (handoff) → + this apply/archive/docs commit. `origin/main`
  still at `b893349` (owner pushes).
- Root is now minimal: `index.html` (white theme, artwork `c1-airbnb-q82.webp`), 
  `worker.js` (imports index.html + Apple Pay SVG + new webp), `wrangler.jsonc`,
  `schema.sql`, docs. `webp-candidates/` holds only the shipped artwork.
- Deploy: `npx wrangler deploy` (needs owner auth) or agent REST deploy with a fresh
  token. Custom domains persist across deploys.

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
7. **Next session: execute `RUNBOOK.md` MILESTONE 6 (R1–R6)** — reply routing fix, $0.
   Owner-gated: R2 deploy authorization, R3 (agent API, reversible), R4 Gmail alias.
