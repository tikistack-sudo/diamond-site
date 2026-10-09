# DECISIONS

1. **WebP default = `c1-original-q85.webp`**
   Context: 2.3 MB source must ship as WebP; 9 candidates measured (bytes, PSNR,
   halo/overshoot, banding); no model vision available for subjective pass.
   Choice: c1-original-q85 (218,700 B, 38.39 dB, 0‰ measurable halos) as default;
   c1-q90 premium / c1-q80 lean alternatives; c3-2× upscaled family explicitly must
   not ship; sizes are measured, not targeted.
   Reversal: change one `src` path (and optionally quality suffix).

2. **Fix pre-existing `.join('\n')` SyntaxError as an enabling change**
   Context: literal newline inside the only script block killed all page JS;
   verification list required working flows; scope was otherwise image-only.
   Choice: user-approved one-line fix, documented as an enabling edit.
   Reversion: revert that hunk (pre-edit backup: `/tmp/opencode/diamond-royalty-functional-preview.orig.html`,
   pre-harden backup: `/tmp/opencode/dp.pre-harden.html`).

3. **Hardening: meta CSP `form-action 'none'` + disabled-until-init + `<noscript>`**
   Context: local-only builder must fail safely with JS broken/absent; no prior CSP.
   Choice: one minimal meta policy (not a second/header CSP), button `disabled` in
   HTML flipped only after handlers register, notice above the form using existing
   `.note` styling. Probe evidence: meta `form-action` is enforced (blocked submits
   logged, URL clean); disabled button stops Enter before it attempts.
   Reversion: remove the 4 recorded hunks per file.

4. **Archive layout (this closeout)**
   Context: only the two intended pages should render from the repo root; the
   external preview's WebP must stay at `webp-candidates/c1-original-q85.webp`.
   Choice: root keeps the two preview HTMLs + README + that single WebP; everything
   else moved to `archive/` — `file.html` + its image (still resolves), the three
   `generated-image*.png` sources, and `archive/webp-gallery/` (gallery + 66 crops +
   all 9 candidates, with the required WebP copied in so the gallery still works).
   Reversion: `mv` back; no file contents modified.

5. **No `.gitignore`** — declined by user earlier in session; not revisited.
   Reversal: create it if untracked noise becomes a problem.

6. **Nothing committed / no deploy / no backend** — approval boundary held across
   all tasks; site files remain untracked by design pending user decision.
   STATUS UPDATE: superseded — the owner later committed and pushed the site
   (see 11).

7. **Owner-supplied files take precedence over the task prompt**
   Context: owner uploaded `Apple_Pay_Mark_RGB_041619.svg`,
   `Method-Recommendedtreatment.csv`, and `cash-app-ref.txt`, stating the uploads are
   superior to the second prompt.
   Choice: use the supplied official Apple Pay mark locally (supersedes the prompt's
   "download it" step); treat the CSV as the controlling recommendation (Apple official
   mark; no "Cash App Pay" branding without product confirmation; Zelle® plain text).
   Reversal: swap assets/copy.

8. **Cash App mark = the ref supplied in `cash-app-ref.txt`, used verbatim**
   Context: the ref file was updated three times (colored icon → mono-white lockup →
   colored icon). Maintaining a local copy fought the owner's intent.
   Choice (final): `<img alt="Cash App Pay"
   src="https://static.afterpaycdn.com/en-US/integration/logo/icon/color.svg" height="24">`,
   hotlinked to Afterpay's CDN. This contradicts the CSV's "no Cash App Pay branding"
   caution and the earlier no-hotlink rule; accepted per the owner's explicit instruction.
   Reversal: localize the asset and/or change `alt` to "Cash App".

9. **Contact + payment integrated into `index.html`**
   Context: the owner asked to integrate the prototype changes into the homepage.
   Choice: made `index.html` byte-identical to
   `diamond-royalty-contact-payment-prototype.html`; old homepage backed up at
   `/tmp/opencode/index.pre-integrate.html`; round-trip proven (only the 3 additions differ).
   Reversal: restore the backup / revert the commit.

10. **Artwork = WebP converted from the owner-supplied JPG (no upscaling)**
    Context: the owner supplied `c1-original-q85.jpg` (1080×1350) and asked to use a
    WebP made from it.
    Choice: convert at q85 → `webp-candidates/c1-original-q85.webp`, 1080×1350,
    182,900 B; replaced the earlier upscaled 1122×1402 (218,700 B); `width`/`height`
    updated where relevant (index, prototype, embedded review). The older preview files
    were left untouched (they share the asset path, so they render the new image).
    Reversal: restore `/tmp/opencode/c1-original-q85.old.webp`.

11. **Deploy = local server + owner-driven push**
    Context: the owner asked to deploy; agent `git push` is denied by environment policy.
    Choice: serve locally (`127.0.0.1:8765`); the owner committed and pushed
    (`4435b2f` → `63e3d95` → `cee140f`). No agent commit/push.
    Reversal: n/a.

12. **Launch-time text cataloged, not removed yet**
    Context: the page intentionally still carries placeholder / "preview-only" copy.
    Choice: keep it for review and catalog every string to remove/replace in
    `LAUNCH-CHECKLIST.md`; removal happens at launch (and if a real endpoint is added,
    the CSP `form-action 'none'` must be revisited).
    Reversal: n/a.

13. **Desktop contact line enlarged to 20px (mobile unchanged)**
    Context: owner reported the "Call for a consultation" line looked small on full
    desktop view, then asked for one more step up, desktop-only, nothing else changed.
    Choice: `@media(min-width:721px){.contact-strip{font-size:20px;padding:13px 15px}}`;
    mobile stays `font-size:14px;padding:10px 12px`. Applied to `index.html`, the prototype
    and the embedded review; committed `6ef896d` (`index.html` only) and pushed in `6029dc5`.
    Reversal: change/remove that single media rule.

14. **Top mobile nav removed from the homepage (reverses "preserve mobile nav")**
    Context: owner asked to remove the header "Services / Our Approach / Build a Quote
    Request" that sits above the contact line on `index.html`. This overrides the earlier
    instruction to preserve the mobile nav.
    Choice: deleted `<nav class="mobile-nav" aria-label="Navigation">…</nav>` and its dead
    CSS (base `.mobile-nav{display:none}` + the ≤720px `.mobile-nav{display:flex…}` /
    `.mobile-nav a{…}` rules). The contact strip is now the first content after the skip
    link. Applied to `index.html` only; the prototype and embedded review still contain it.
    Reversal: restore the element + CSS from git history (`6029dc5`).
    Note: this removes the only on-page mobile section nav — mobile users reach sections by
    scrolling or the skip link.

15. **`__view-compare.html` (review helper) ended up tracked**
    Context: a temporary side-by-side mobile/desktop review page was created during the
    visual pass; the owner's closeout commit `6029dc5` included it.
    Choice: leave it for now (works as a local preview helper) but flag it for removal
    before launch — it is not part of the intended site.
    Reversal: `git rm __view-compare.html`.
