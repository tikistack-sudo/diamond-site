# Handoff — latest

## Milestone
**LAUNCH + WHITE THEME live in production (Oct 12, 2026).** Booking pipeline unchanged:
form → `/api/booking` → D1 `bookings` → 2 Resend emails (CEO notification to both
addresses + customer confirmation).

**NEW — Milestone 6 "booking reply routing" APPROVED Oct 13, 2026, NOT EXECUTED.**
`RUNBOOK.md` → *MILESTONE 6* (tasks R1–R6) is ready to run next session. Budget **$0**.
Rationale/reversals: `DECISIONS.md` #20; state summary: `STATE.md`.

## Verified facts (agent, Oct 13, 2026 — before execution)
- The CEO notification is sent from `bookings@diamondroyaltycleaningco.com` with **no
  `Reply-To`** (`worker.js:23–37` → `{from,to,subject,text}` only). `Reply` therefore
  addresses `bookings@…`.
- Zone `diamondroyaltycleaningco.com` Email Routing: `status: ready`; MX →
  `route{1,2,3}.mx.cloudflare.net`; SPF `include:_spf.mx.cloudflare.net`; DKIM
  `cf2024-1._domainkey`; DMARC `p=quarantine adkim=r aspf=r`.
- Email Routing rules: **one enabled** — `to services@…` → Worker `empty-wind-b8e3`;
  catch-all (`all → drop`) **disabled** ⇒ **`bookings@…` has no inbox; replies to it reach
  nobody.**
- Email Routing destination `diamondroyaltyny@gmail.com` is **already verified** (Oct 9) —
  R3 needs no new verification step.
- Live Worker `diamond-site` bindings intact: `BOOKING_NOTIFY_EMAIL`
  (`tyrikn2@gmail.com,diamondroyaltyny@gmail.com`), `DB` (`d84a3ce1-…`), `RESEND_API_KEY`
  (secret). `wrangler.jsonc` reproduces the deploy from the repo root.
- Vendor-confirmed: Resend send API accepts `reply_to` (string) and `html`; Resend SMTP =
  `smtp.resend.com`, username `resend`, password = API key, ports 585/587/2465/2587/465.
- Usage: 5 booking rows (3 test, 2 real) ⇒ 10 emails sent — ~0.33% of the Resend free
  3,000/month (100/day) allowance.

## Blockers / limits
- Agent `git push` is denied by environment policy — **the owner pushes**.
- Agent cannot read a mailbox: R2 step 5 (`Show original` → `Reply-To:`) and all of R4/R5
  need the owner at the business Gmail. The agent can still deploy, call the Cloudflare
  API, POST a test booking, and read D1.
- Deploy path if wrangler is unavailable to the agent: owner's own `wrangler login` or the
  dashboard — do not hand-build a REST multipart deploy (see DECISIONS #16 gotcha).
- Resend rejects reserved domains (`example.com`, 422) — test with real addresses only.
- "Send through Gmail" (Gmail *Send mail as* without SMTP) is **forbidden** here: unsigned
  for the domain ⇒ fails DMARC `p=quarantine`.

## Next actions (1–3)
1. Run `RUNBOOK.md` MILESTONE 6 in order: **R1** (`worker.js`: `reply_to` + HTML `mailto:`)
   → **R2** (deploy + live `Reply-To:` proof).
2. **R3** (agent: Email Routing rule `bookings@…` → business Gmail) then **R4** (owner:
   Gmail *Send mail as* via Resend SMTP) → **R5** (deliverability proof).
3. **R6** docs closeout; owner commits + pushes.

## Files touched (this closeout)
- `RUNBOOK.md` — new *MILESTONE 6 — Reply routing* (R1–R6) + header label note.
- `DECISIONS.md` — #20 (approved plan, context/choice/reversal).
- `STATE.md`, `TASKS.md` — Milestone 6 recorded as approved/open.
- No site files touched; `worker.js` unchanged (R1 not executed).

## Approval pending
- Owner: commit + push this docs/runbook closeout.
- Owner: authorization for the R2 deploy and the R4 Gmail alias setup (next session).
- Still open from launch: token revocation for `~/.config/opencode/*.env`, test-row
  cleanup, mobile eyeball pass, LAUNCH-CHECKLIST §7 wording, footer nav label.
