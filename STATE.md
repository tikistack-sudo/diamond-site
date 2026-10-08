# STATE — diamond-site

## Milestone
WebP swap and request-builder hardening are complete and accepted for local/client
review. Leftover dev artifacts are archived so only the two intended pages render
from the repo root. No deploy, no commits.

## Verified facts (proof: diffs + test matrix in DECISIONS.md / handoffs/latest.md)
- External preview: `diamond-royalty-functional-preview.html` (16,807 B); required
  dependency `webp-candidates/c1-original-q85.webp` (WebP/RGB, 1122×1402, 218,700 B).
- Client review copy: `diamond-royalty-functional-preview-embedded-review.html`
  (308,394 B, WebP inlined; zero external dependencies).
- Hardening in both files: early-head CSP `form-action 'none'` (no prior CSP existed;
  meta delivery confirmed enforced by probe), submit button `disabled` in HTML and
  enabled only after all JS handlers register, readable `<noscript>` notice.
- Pre-existing `.join('\n')` literal-newline SyntaxError fixed as an approved
  enabling change (all page JS was dead before it).
- Test matrix PASS: normal JS flow (draft by button and Enter key, copy fallback,
  download, service preselection, clear), no-JS proxy, forced init failure — in both
  failure cases no form values entered the URL and no form-data request left the
  page; control probes prove the native path exists and meta `form-action` blocks it.
- `generated-image.png` untouched (source preserved); no HTML/design/hotspot/copy
  changes beyond the recorded hunks.
- Requests are not sent and appointments are not booked — page states this and CSP
  blocks native submission.

## Repo
- Branch `main`, single commit `4ba9af4` (README only). All site files untracked;
  nothing committed; no `.gitignore` (declined earlier by user).
- No local server running.
