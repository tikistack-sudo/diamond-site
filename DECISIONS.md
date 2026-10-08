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
