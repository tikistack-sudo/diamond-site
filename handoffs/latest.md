# Handoff — latest

## Milestone
**LAUNCH COMPLETE (Oct 11, 2026) — owner confirmed "everything works great."**
diamondroyaltycleaningco.com + www are live on the Cloudflare Worker `diamond-site`
(static site + same-origin booking API). Booking form → validated → stored in D1
`bookings` → Resend emails: CEO notification to BOTH addresses + customer
"forwarded / under review" confirmation. Resend domain fully verified (DKIM, SPF×2,
tracking CNAME). All launch copy in place; dev-only pages archived.

## Verified facts (agent + owner, Oct 11)
- Live: apex + www → HTTP 200 (www 522 fixed by attaching it as a Workers custom
  domain; the broken CNAME was deleted — rollback in DECISIONS #17).
- Live markers: phone field present, "Send My Request", "Request Received" receipt,
  CSP `form-action 'self'; connect-src 'self'`, zero "draft / not sent" strings.
- POST `/api/booking` → 201 + D1 row; invalid ZIP → 400; GET → 405; unknown path → 404;
  assets 200 with correct types (webp 182,900 B, SVG 6,352 B).
- D1 `bookings` (`d84a3ce1-3055-4a96-8638-0e485fade614`): table + 2 indexes verified;
  test rows #1 and #3 stored (status "new").
- Resend: domain verified; booking #3 → `owner_emailed: true` (both CEO addresses);
  direct probe to a real address → 200 + email id. `example.com` → 422 (reserved
  domain — expected, not a bug; test with real addresses only).
- Bindings on the Worker: `DB` (d1), `RESEND_API_KEY` (secret),
  `BOOKING_NOTIFY_EMAIL` = both CEO addresses, comma-separated (DECISIONS #18).
- Repo: working tree clean; local `main` = `91fff40` → `63c7075` → `b893349`;
  **`origin/main` still `b893349`** — launch commits are unpushed.
- Deployment: REST `PUT workers/scripts/diamond-site` (used for this launch) or
  `npx wrangler deploy` from repo root (`wrangler.jsonc`). `functions/` (Pages
  Function variant) removed as superseded — this account has no Pages projects.

## Blockers / limits
- Agent `git push` is denied by environment policy — the owner pushes.
- Resend rejects reserved domains (`example.com`) with 422 — customer-email tests must
  use real addresses.
- LAUNCH-CHECKLIST §7 scope hint + footer nav label "Request Builder" still encode
  unconfirmed business claims — owner must confirm or rewrite.
- Setup credentials: the temporary Cloudflare API token must be revoked by the owner;
  `/tmp/opencode/creds.env` still exists (verified at handoff time) and should be
  deleted. No secrets are stored in the repo.

## Next actions (1–3)
1. Owner: `git push origin main` (publishes launch commits `63c7075` + `91fff40`).
2. Owner: revoke the Cloudflare API token + delete `/tmp/opencode/creds.env`; optionally
   delete test rows (`email='jane.tester@example.com'`) and disable the stale GitHub
   Pages copy.
3. One human pass on the live site (mobile ~390px: new form + Request Received receipt),
   then watch the first real booking end-to-end.

## Files touched (this closeout)
- `TASKS.md` (stale OPENs closed with proof; new OPENs split by owner)
- `DECISIONS.md` (#18 dual CEO recipients; #16–17 pivot + www fix already present)
- `handoffs/latest.md` (this file)
- No site files touched in this closeout.

## Approval pending
- Owner push of `63c7075` + `91fff40`.
- Owner revocation of the setup token + deletion of `/tmp/opencode/creds.env`.
- Owner confirmations: §7 scope hint, "Request Builder" nav label, payment/Zelle facts
  (unaffected by launch).
