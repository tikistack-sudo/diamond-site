# LAUNCH-CHECKLIST — text to remove / replace before launch

Produced by scanning the live homepage (`index.html`; shared content in
`diamond-royalty-contact-payment-prototype.html`). Every item below is deliberate
placeholder / "preview-only" copy. **Remove or rewrite each one when the business
launches** — and if a real submission endpoint is connected, see the infrastructure note
at the end. Search the HTML for the exact quoted strings.

> Note: as of the current working tree the prototype/embedded-review pages still show the
> top mobile nav ("Services / Our Approach / Build a Quote Request") that was removed from
> `index.html`; the text strings in this checklist are otherwise shared.

## 1. Builder disclosure — `#draft-note` (`.note`, above the form)
- Current: "Local request builder only: this form does not send anything or book an
  appointment. Prepare your request, then copy or download it. A verified business
  contact or secure submission endpoint still needs to be connected."
- Action: **remove** once a real endpoint exists; replace with accurate submission copy.

## 2. No-JS notice — `<noscript><p class="note" id="no-js-note">`
- Current: "Request preparation requires JavaScript. Without it this preview cannot
  prepare a request, and nothing can be submitted from this preview."
- Action: rewrite/remove at launch (it says "preview").

## 3. Footer identity line
- Current: "Diamond Royalty Cleaning Company · Design and functionality preview"
- Action: remove the "· Design and functionality preview" suffix.

## 4. Acknowledgement checkbox label
- Current: "I understand this prepares a local draft only. Nothing is sent, and no price
  or appointment is confirmed."
- Action: rewrite at launch.

## 5. Draft result heading + generated title
- `<h3>Your Request Draft — Not Sent</h3>`
- JS string: "DIAMOND ROYALTY CLEANING REQUEST — DRAFT / NOT SENT"
- Action: drop "Not Sent" / "DRAFT / NOT SENT" once sending is live.

## 6. Status messages (`#status`, set in JS)
- "Draft prepared locally. Nothing was sent."
- "Draft copied. Nothing was sent."
- "Draft download initiated. Nothing was sent."
- "Details changed. Prepare a new draft before copying or downloading."
- "Clipboard permission unavailable. Draft selected: copy manually or use Download Request."
- "Entered details cleared from this page. Previously copied or downloaded drafts are unchanged."
- Action: revise wording at launch.

## 7. Scope hint (`.hint` near the services)
- Current: "Service descriptions are draft scope examples for business approval.
  Availability, coverage, scope, extras, and pricing must be confirmed by the business."
- Action: **remove** once the business confirms scope/pricing.

## 8. Draft-sharing hint (`.hint`)
- Current: "Copied or downloaded drafts can contain your personal information. Share them
  only with the verified business contact."
- Action: revise at launch.

## 9. FAQ answers (the `<details>` section "A Few Details, Clarified.")
- "No. This version prepares a draft request only. The business must confirm scope,
  pricing, availability, and appointment details."
- "This page has no submission endpoint, analytics, or application storage. Its scripts do
  not transmit or persist form data. Your browser may independently offer autofill or
  restore form values. Copying or downloading creates a draft under your control."
- "Include non-sensitive preferences in your draft. Product availability, surface
  suitability, and extra tasks must be agreed with the business."
- Action: rewrite at launch to match the final submission behavior.

## 10. `README.md`
- Current content is just `# diamond-site` / "Diamond Royalty Cleaning Company Website"
  (56 B). Replace with a real readme (or remove) at launch.

## Non-text cleanup before launch
- **`__view-compare.html`** — temporary mobile/desktop side-by-side review helper. It is
  currently tracked (committed in `6029dc5`) but is not a site page. Remove it
  (`git rm __view-compare.html`).

## Infrastructure to revisit when submitting for real
- meta CSP is currently `form-action 'none'` — this **blocks all submissions**. Replace
  with a policy that permits only the intended endpoint, and re-test.
- Keep "no analytics / no application storage / no tracking" unless explicitly approved.

## Owner confirmations still open
- **Consultation phone:** (917) 270-3611 was supplied as the Zelle recipient; its use as
  the consultation line is **provisional** until confirmed.
- **Payment acceptance facts:** checks, cash, Cash App `$HMHR25`, Zelle, Apple Pay.
- **Cash App:** the page uses the owner-supplied ref verbatim (colored icon,
  `alt="Cash App Pay"`, hotlinked to Afterpay's CDN). Confirm whether the Cash App Pay
  merchant product applies before keeping that branding; consider localizing the asset.
- **Zelle:** plain-text "Zelle®" only (no logo). Zelle attribution/disclaimer requirements
  are unresolved and must be reviewed before publication.

## Payment asset provenance
- **Apple Pay:** `Apple_Pay_Mark_RGB_041619.svg`, supplied by the owner (Apple Pay
  marketing resources), used unaltered with clear space. Acceptance mark only — must not
  imply an on-site Apple Pay checkout.
- **Cash App:** `https://static.afterpaycdn.com/en-US/integration/logo/icon/color.svg`
  (owner-supplied ref) — hotlinked, not stored locally.
- **Zelle:** plain text, no logo (no permission supplied).
- **Checks and cash:** plain text.
