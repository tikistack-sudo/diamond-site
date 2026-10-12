# RUNBOOK — Launch diamondroyaltycleaningco.com with booking capture + email

> **⚠️ ARCHITECTURE PIVOT (Oct 11, 2026):** Milestone 1 was delivered by the owner as a
> **Cloudflare Worker** (`diamond-site`, static assets), not a Cloudflare Pages project —
> this account has no Pages projects, and Workers custom domains intercept the whole
> hostname. The plan therefore pivoted: the booking API lives in the same Worker
> (`worker.js`, module imports for the assets), deployed via REST/wrangler with D1 +
> Resend bindings. `functions/` (Pages Function variant) was removed as superseded.
> Details: `DECISIONS.md` #16–17. The pages below that say "Pages" describe the original
> plan; the executed state is recorded in the milestone status boxes and in `STATE.md`.

Owner-facing runbook. Every step is either:

- **[OWNER]** — a human/dashboard step (logins, DNS, secrets, pushes). **Cannot** be
  delegated to an AI model, and
- **[CHEAP TASK T1–T7]** — a bounded, local-reversible repository task with a ready-made
  copy/paste prompt for a very cheap/free model. Run them **in order, one at a time**, each
  in a fresh session. After each one, run its **COMPLETION PROOF** before starting the next.

Repo ground truth (verified): branch `main` == `origin/main` @ `b893349`, working tree
clean. `index.html` is a single minified line; the form is a local-only "draft builder"
(`CSP form-action 'none'` blocks all submissions). No backend exists yet.

---

## 0. Target architecture & costs ($0 on free tiers)

```
Browser (index.html)
   └─ POST /api/booking (JSON)            — Cloudflare Pages Function  (functions/api/booking.js)
        ├─ INSERT into D1 database `bookings` (SQLite)          — request stored
        ├─ Resend API → email to CEO: "New booking request …"   — full details
        └─ Resend API → email to customer: "request forwarded, being reviewed"
```

| Piece | Service | Free tier |
|---|---|---|
| Site + API | Cloudflare Pages + Pages Functions (git-connected to this repo) | 100k Function requests/day |
| Database | Cloudflare D1 `bookings` | 100k row writes/day |
| Email | Resend (domain-verified) | 100 emails/day, 3,000/month |
| Domain/DNS/SSL | Cloudflare zone (already attached) | included |

The CEO receives an email the moment a booking is filed; the CEO calls/follows up to
confirm details and price. The customer is told the request was forwarded and is being
reviewed. No admin screen at launch.

## 0.1 Deliberate spec changes (VETO BEFORE RUNNING T3/T5)

The current form was a draft builder; going live requires these behavior changes:

1. **`email` becomes required** and a **`phone` field is added (required)** — today both
   are optional, so the CEO would have no way to follow up. (Phone added because the CEO
   follows up by call.)
2. **`name` becomes required** (used in the customer email greeting).
3. A hidden **honeypot field** (`company_website`) is added — spam submissions are silently
   dropped.
4. The **Copy/Download draft feature is removed** (obsolete once the form actually sends);
   the `#result` block becomes the on-page success receipt.
5. `CSP` changes from `form-action 'none'` to `form-action 'self'; connect-src 'self'`
   (T4). Without this the browser blocks the submission.
6. All "draft / not sent / preview" copy is rewritten (T5) per `LAUNCH-CHECKLIST.md`.

If any of these are wrong, say so **before** running T3/T5; the prompts will be adjusted.

---

## MILESTONE 1 — [OWNER] Site live on the real domain (do this first)

> **✅ COMPLETE — human verified (Oct 9, 2026).** Agent cross-check via curl:
> `https://diamondroyaltycleaningco.com/` → HTTP 200, valid TLS (`ssl_verify_result=0`),
> site HTML served (committed version, CSP `form-action 'none'` still present — expected
> until T4). Owner completes steps 3–4 below for the `www.` variant if not done yet.

Goal: https://diamondroyaltycleaningco.com serves today's homepage. Bookings come second.

1. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → GitHub →
   authorize and pick the `diamond-site` repo (owner account `tikistack-sudo`).
2. Project settings: **Framework preset: None · Build command: (empty) · Build output
   directory: `/` · Production branch: `main`** → Save and Deploy.
   The site deploys to `diamond-site.pages.dev` (any temporary name is fine).
3. In the Pages project → **Custom domains → Set up a custom domain** →
   `diamondroyaltycleaningco.com` → activate. Cloudflare auto-creates the apex CNAME
   (with flattening) and issues SSL. Repeat to also serve `www.diamondroyaltycleaningco.com`.
4. Verify in a private browser window: both `https://diamondroyaltycleaningco.com` and the
   `www.` variant render the homepage with artwork (no mixed-content or cert warnings).
5. Leave the old GitHub Pages URL (`tikistack-sudo.github.io/diamond-site/`) alone for now —
   it is a free staging copy; optionally disable after Milestone 5.

✅ **Milestone 1 done when:** the custom domain serves the homepage over HTTPS.

> The form is still the offline draft builder at this point — it sends nothing. That is
> expected and safe.

---

## MILESTONE 2 — [CHEAP TASKS T1–T7] Build the booking pipeline locally

> **✅ COMPLETE — executed + validated Oct 9, 2026.** All seven tasks done in order, each
> with its validation suite passing. Notes/deviations:
> - **T1 executed here too** (prerequisite of T2; `schema.sql` did not exist yet).
> - **T2 syntax check:** `node --check` assumes CommonJS for `.js`, so the ESM check ran
>   on a `.mjs` copy (`node --check` → pass). The shipped file remains
>   `functions/api/booking.js`, as Cloudflare Pages requires.
> - **T3:** all 8 edit anchors matched exactly once; inline JS extracted and
>   `node --check` → pass; brace delta 0 before/after; in-browser check: submit button
>   re-enabled ("Send My Request"), name/email/phone `required=true`, honeypot
>   `display:none`, console clean; form section screenshot-verified. The §8
>   draft-sharing hint was removed with the `#result` block (it described the draft
>   feature) — consistent with T5's scope.
> - **T6 scope extension (flagged):** two MORE dev-only preview pages were found at the
>   root beyond the three scoped files — `diamond-royalty-functional-preview.html` and
>   `diamond-royalty-functional-preview-embedded-review.html`. Same artifact class
>   (stale draft-builder previews that would deploy publicly), so both were `git mv`'d
>   to `archive/` with the same reversible treatment. `ls *.html` → only `index.html`.
> - **T7:** README rewritten (56 B → 1,605 B).
> - Backups: `/tmp/opencode/index.pre-t3.html`, `index.pre-t4.html`, `index.pre-t5.html`,
>   `README.pre-t7.md`.
>
> ⚠️ **Found during domain check:** `https://www.diamondroyaltycleaningco.com/` returns
> **HTTP 522** (unreachable origin). The apex works (HTTP 200). The `www` DNS record
> needs fixing — see Milestone 3.5 below.

These tasks only create/modify local files. Nothing is deployed until Milestone 4.

---

### T1 — Create the D1 schema file

TASK CLASSIFICATION: local-reversible

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
Create one new file, `schema.sql`, in the repository root. It contains the SQL schema for
a Cloudflare D1 table named `bookings` that stores website booking requests.

## ALLOWED SCOPE
Create exactly one file: `schema.sql`. No other file may be created or modified.

## REQUIRED EVIDENCE
The repository root currently has no `schema.sql` and no `functions/` directory. The
booking form fields (verified in `index.html`) are: name, email, zip, service, bedrooms,
bathrooms, frequency, date, notes, ack.

## STEPS
1. Run `git status --short` and confirm the working tree is clean.
2. Run `ls schema.sql` and confirm the file does not exist (if it exists, STOP).
3. Create `schema.sql` with EXACTLY this content:

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  zip TEXT NOT NULL,
  service TEXT NOT NULL,
  bedrooms TEXT NOT NULL,
  bathrooms TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'One time',
  preferred_date TEXT,
  notes TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

4. Stop.

## STOP CONDITIONS
Stop without writing if `schema.sql` already exists, if the working tree is not clean,
or if anything in the repo contradicts the REQUIRED EVIDENCE.

## VALIDATION
Run exactly:
- `git status --short`  → must show only `?? schema.sql`
- `cat schema.sql`      → must match the content above, including the two CREATE INDEX lines

## REQUIRED REPORT
Report in this format:
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include the exact output of `git status --short` and state that no other files changed.

## HARD PROHIBITIONS
Do not stage, commit, push, merge, delete, rename, move, create files other than
`schema.sql`, alter .gitignore, install packages, start services, change configuration,
change permissions, use credentials, reveal secrets, or take remote actions.
```

COMPLETION PROOF: `git status --short` shows only `?? schema.sql`; `cat schema.sql`
matches the block above exactly (two CREATE INDEX statements present).

ESCALATE IF: `schema.sql` already exists; working tree not clean; any other file appears
modified.

---

### T2 — Create the booking API function

TASK CLASSIFICATION: local-reversible

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
Create one new file, `functions/api/booking.js` (create the `functions/api/` directories).
It is a Cloudflare Pages Function that receives a JSON booking submission and returns a
JSON response. It must compile-clean JavaScript with no external imports and no research.

## ALLOWED SCOPE
Create exactly one file: `functions/api/booking.js`. No other file may be created or
modified.

## REQUIRED EVIDENCE
- `schema.sql` exists at the repo root (created by a prior task) defining the `bookings`
  table with columns: id, created_at, name, email, phone, zip, service, bedrooms,
  bathrooms, frequency, preferred_date, notes, user_agent, status.
- Runtime contract (facts you must take as given, do NOT research):
  - The file must export `async function onRequestPost({ request, env })`.
  - D1 binding is `env.DB`; `env.DB.prepare(sql).bind(...args).run()` returns an object
    with `meta.last_row_id`.
  - Secrets/vars: `env.RESEND_API_KEY`, `env.BOOKING_NOTIFY_EMAIL` (CEO email address).
  - Resend send API: `POST https://api.resend.com/emails` with headers
    `Authorization: Bearer <RESEND_API_KEY>` and `Content-Type: application/json`, body
    `{"from":"...","to":["..."],"subject":"...","text":"..."}`. HTTP 200 = sent.
  - `env` may be missing bindings during preview — guard for that (return 500 JSON).

## STEPS
1. Run `git status --short` and confirm the only untracked file is `schema.sql`.
2. Confirm `functions/api/booking.js` does not exist.
3. Create `functions/api/booking.js` implementing ALL of the following, and nothing more:
   - Constants: `FROM = "Diamond Royalty Cleaning <bookings@diamondroyaltycleaningco.com>"`.
   - Helper `json(data, status)` returning a `Response` with header
     `Content-Type: application/json; charset=utf-8`.
   - Helper `field(v, max)`: return trimmed string capped at `max` chars, `''` if not a
     string.
   - Helper `sendEmail(env, to, subject, text)`: returns `false` if `to` is falsy;
     otherwise POST to the Resend endpoint above and return `res.ok`; let network
     exceptions propagate to the caller's try/catch.
   - `onRequestPost`:
     - If `!env.DB` or `!env.RESEND_API_KEY` → 500 `{"error":"Booking service is not configured."}`.
     - If header `content-length` is present and > 10000 → 413 `{"error":"Request too large."}`.
     - Parse JSON body; on parse failure → 400 `{"error":"Invalid request body."}`.
     - If `body.company_website` is a non-empty string (honeypot) → return 201
       `{"ok":true}` WITHOUT storing or emailing (silent spam drop).
     - Validate: `body.ack === true` else 400 "Acknowledgement is required.";
       trimmed fields: `name` (≤100, required), `email` (≤254, must match
       /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/), `phone` (≤20, required),
       `zip` (must be exactly 5 digits), `service` (required), `bedrooms` (required),
       `bathrooms` (required), `frequency` (default "One time"), `date` (optional, if
       present must be >= today in UTC, mapped to column `preferred_date`),
       `notes` (≤2000, nullable). Each failure → 400 with a short human error message.
     - INSERT into D1 (columns name,email,phone,zip,service,bedrooms,bathrooms,frequency,
       preferred_date,notes,user_agent; `user_agent` from the `User-Agent` request header,
       `''` fallback). Get `id` from `row.meta.last_row_id`.
     - Build `lines` recap: Name / Email / Phone / ZIP / Service / Bedrooms / Bathrooms /
       Frequency / Preferred date (or "Flexible / not specified") / Notes (or "None provided").
     - Owner email: to `env.BOOKING_NOTIFY_EMAIL`, subject
       `"New booking request — " + service + " — ZIP " + zip`, body = `#id`, blank line,
       the recap lines, then a line asking to call or reply to confirm details and pricing.
     - Customer email: to the submitter's email, subject
       `"We received your cleaning request — Diamond Royalty Cleaning"`, body: greeting by
       name, thank them, state the request has been forwarded to the team and is being
       reviewed, that the team will contact them to confirm details and pricing, that no
       appointment is confirmed yet, sign-off "Diamond Royalty Cleaning Company, (917) 270-3611".
     - Send BOTH emails, each in its own try/catch, tracking `ownerEmailed` /
       `customerEmailed` booleans (a failure of one must not prevent the other, and never
       fails the request).
     - Return 201 `{"ok":true,"id":id,"summary":<recap lines joined with \n>,
       "owner_emailed":ownerEmailed,"customer_emailed":customerEmailed}`.
   - Also export `async function onRequestGet()` returning 405 JSON
     `{"error":"Method not allowed."}` (same helper).
4. Run `node --check functions/api/booking.js` — must print nothing (no syntax errors).
5. Stop.

## STOP CONDITIONS
Stop without writing if `schema.sql` is missing, if the file already exists, if you need
to touch any other file, or if anything would require installing packages or network calls.

## VALIDATION
Run exactly:
- `node --check functions/api/booking.js` → exit 0, no output
- `git status --short` → shows `?? schema.sql` and `?? functions/` only
- `grep -c "onRequestPost" functions/api/booking.js` → at least 1
- `grep -c "api.resend.com" functions/api/booking.js` → exactly 1

## REQUIRED REPORT
Report in this format:
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include the exact outputs of all four VALIDATION commands and state that no other files
changed.

## HARD PROHIBITIONS
Do not stage, commit, push, merge, delete, rename, move, create files other than
`functions/api/booking.js`, alter .gitignore, install packages, start services, change
configuration, change permissions, use credentials, reveal secrets, or take remote
actions. Never print or invent an API key.
```

COMPLETION PROOF: `node --check` passes; `git status --short` shows only `schema.sql` and
`functions/`; the file contains `onRequestPost`, one `api.resend.com`, D1 insert, both
emails, honeypot drop, and the 400/413/500 guards.

ESCALATE IF: `schema.sql` missing; any existing file would need edits; `node --check`
reports an error after two attempts.

---

### T3 — Rewire the form to actually submit

TASK CLASSIFICATION: local-reversible

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
In `index.html` (one minified single-line file): add a required `phone` field, make
`name` and `email` required, add a hidden honeypot, replace the Copy/Download draft
buttons and `#result` block with a success receipt, and replace the ENTIRE existing
`<script>…</script>` block (exactly one exists, length ~3,087 chars) with the provided
implementation. Behavior change: submitting now POSTs JSON to `/api/booking`.

## ALLOWED SCOPE
Edit exactly one file: `index.html`. Nothing else.

## REQUIRED EVIDENCE
- The form is `<form id="request-form" aria-describedby="draft-note">` with fields
  name, email, zip, service, bedrooms, bathrooms, frequency, date, notes, ack
  (`name`/`email` are currently optional; zip/service/bedrooms/bathrooms/ack required).
- Elements `#result` (hidden div with `<h3>Your Request Draft — Not Sent</h3>`,
  `<pre id="summary">`, buttons `#copy` and `#download`), `#status`, `#clear` exist.
- Exactly one `<script>` block ends with:
  `form.querySelector('button[type="submit"]').disabled=false;</script>`.
- The form's `.actions` div contains the submit button (type="submit", disabled) and
  `#clear` (type="button").

## STEPS
1. `git status --short` → working tree must be clean (only prior tasks' untracked files
   `schema.sql` and `functions/` allowed).
2. Back up: `cp index.html /tmp/opencode/index.pre-t3.html`.
3. In the `<form>`:
   a. Change the name label/input: label text `Name (optional)` → `Name`; add `required`
      to the name input.
   b. Change the email label/input: `Reply email (optional)` → `Reply email`; add
      `required` to the email input.
   c. Add a new grid cell directly AFTER the email cell (note: the pattern uses NO
      backslashes — plain character class):
      `<div><label for="phone">Phone</label><input id="phone" name="phone" type="tel"
      autocomplete="tel" maxlength="20" pattern="[0-9+() .-]{7,20}" required
      aria-describedby="phone-hint"><div class="hint" id="phone-hint">The team will call
      or text to confirm details.</div></div>`
   d. Add the honeypot immediately before the closing `</form>`:
      `<div style="display:none" aria-hidden="true"><label for="company_website">Leave
      empty</label><input id="company_website" name="company_website" type="text"
      tabindex="-1" autocomplete="off"></div>`
4. Replace the `#result` block (the hidden `.result` div containing the h3, `#summary`
   pre, and the `#copy`/`#download` buttons) with:
   `<div class="result" id="result" hidden><h3>Request Received</h3><pre
   id="summary"></pre><p class="hint">A confirmation email is on its way. Our team will
   contact you to confirm details and pricing. No appointment is confirmed yet.</p></div>`
5. Change the submit button text `Prepare My Request` → `Send My Request`.
6. Replace the ENTIRE `<script>…</script>` block with EXACTLY:

<script>const form=document.getElementById('request-form'),date=document.getElementById('date'),result=document.getElementById('result'),summary=document.getElementById('summary'),status=document.getElementById('status'),submitBtn=form.querySelector('button[type="submit"]');const today=new Date();const localToday=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');date.min=localToday;document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('service').value=button.dataset.service;document.getElementById('quote').scrollIntoView();document.getElementById('service').focus({preventScroll:true});}));date.addEventListener('input',()=>date.setCustomValidity(''));form.addEventListener('submit',async event=>{event.preventDefault();date.setCustomValidity(date.value&&date.value<localToday?'Please choose today or a future date.':'');if(!form.reportValidity())return;submitBtn.disabled=true;status.textContent='Sending your request…';try{const payload=Object.fromEntries(new FormData(form).entries());payload.ack=form.querySelector('#ack').checked;const res=await fetch('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await res.json().catch(()=>({}));if(res.status===201){form.reset();date.min=localToday;summary.textContent=data.summary||'';result.hidden=false;status.textContent='Request received. A confirmation email is on its way — our team will contact you to confirm details and pricing.';result.scrollIntoView({block:'nearest'});}else{status.textContent=(data&&data.error)?'Request not sent: '+data.error:'Request not sent. Please try again, or call (917) 270-3611.';}}catch{status.textContent='Request not sent. Check your connection and try again, or call (917) 270-3611.';}finally{submitBtn.disabled=false;}});document.getElementById('clear').addEventListener('click',()=>{if(!confirm('Clear all entered details?'))return;form.reset();date.setCustomValidity('');summary.textContent='';result.hidden=true;status.textContent='Entered details cleared.';});form.querySelector('button[type="submit"]').disabled=false;</script>

7. Sanity-check the edits with grep (see VALIDATION).
8. Stop.

## STOP CONDITIONS
Stop without editing if the working tree is not clean, if `#copy`/`#download`/`#result`
cannot all be located, if there is more than one `<script>` block, or if any change would
need to touch a file other than `index.html`.

## VALIDATION
Run exactly:
- `git diff --check` → no output
- `grep -c 'id="phone"' index.html` → 1
- `grep -c 'company_website' index.html` → 3 (label `for` + input `id` + input `name`)
- `grep -c 'api/booking' index.html` → 1
- `grep -c 'Draft — Not Sent' index.html` → 0
- `grep -c 'getElementById(.copy.)' index.html` → 0
- `python3 -c "import re;h=open('index.html').read();print(len(re.findall(r'<script',h)))"` → 1
- `node --check` cannot check inline JS; instead verify balance:
  `python3 -c "h=open('index.html').read();print(h.count('{')-h.count('}'))"` → 0 or
  document the page-level delta if nonzero before AND after (compare with the backup
  `/tmp/opencode/index.pre-t3.html` — the delta must be unchanged from the backup).
- `diff <(python3 -c "print(open('/tmp/opencode/index.pre-t3.html').read().count('<script'))") <(python3 -c "print(open('index.html').read().count('<script'))")` → identical counts

## REQUIRED REPORT
Report in this format:
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include exact outputs of every VALIDATION command and the byte sizes
`wc -c index.html /tmp/opencode/index.pre-t3.html`.

## HARD PROHIBITIONS
Do not stage, commit, push, merge, delete, rename, move, create files, alter .gitignore,
install packages, start services, change configuration, change permissions, use
credentials, reveal secrets, or take remote actions. Do not touch the CSP meta tag
(that is a separate task), the FAQ section, the footer, `#draft-note`, or any other
copy — only the items listed in STEPS.
```

COMPLETION PROOF: all VALIDATION greps match; phone/honeypot present; script block
replaced exactly once; `Draft — Not Sent` and copy/download handlers gone; brace delta
unchanged vs backup.

ESCALATE IF: any grep count is off after two attempts; `#result` block cannot be located;
more than one script block exists.

---

### T4 — Update the CSP to allow the same-origin submission

TASK CLASSIFICATION: local-reversible

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
In `index.html`, change exactly one string: the meta Content-Security-Policy at the very
start of the file, from `content="form-action 'none'"` to
`content="form-action 'self'; connect-src 'self'"`. This is the enabling change that
allows the form's fetch to `/api/booking` (same origin) while still blocking cross-origin
submissions.

## ALLOWED SCOPE
Edit exactly one file: `index.html`. One attribute value. Nothing else.

## REQUIRED EVIDENCE
`index.html` begins: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta
http-equiv="Content-Security-Policy" content="form-action 'none'">`. A prior task added a
fetch POST to the same origin `/api/booking`, which `connect-src 'self'` permits.

## STEPS
1. `git status --short` → working tree must contain only the earlier tasks' changes.
2. Back up: `cp index.html /tmp/opencode/index.pre-t4.html`.
3. Replace the exact string `content="form-action 'none'"` with
   `content="form-action 'self'; connect-src 'self'"` (one occurrence).
4. Stop.

## STOP CONDITIONS
Stop without editing if the string is not found exactly once, or if more than this one
attribute would need to change.

## VALIDATION
Run exactly:
- `grep -c 'form-action .none.' index.html` → 0
- `grep -c 'form-action .self.; connect-src .self.' index.html` → 1
- `git diff --check` → no output
- `git diff --stat` → `index.html` with 1 insertion / 1 deletion (combined with earlier
  task diffs; verify this hunk is the only CSP line)

## REQUIRED REPORT
Report in this format:
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include exact outputs of the VALIDATION commands and the exact new CSP meta tag line.

## HARD PROHIBITIONS
Do not stage, commit, push, merge, delete, rename, move, create files, alter .gitignore,
install packages, start services, change configuration, change permissions, use
credentials, reveal secrets, or take remote actions. Do not modify any other part of the
file.
```

COMPLETION PROOF: grep counts as specified; the only CSP change is the one meta tag.

ESCALATE IF: the old CSP string is not found exactly once.

---

### T5 — Rewrite the launch copy (submission-related strings only)

TASK CLASSIFICATION: local-reversible

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
In `index.html`, replace the listed "preview-only" placeholder strings with the provided
launch copy, exactly as given. These are the submission-flow items from
LAUNCH-CHECKLIST.md items 1, 2, 3, 4, and 7's related hint, plus FAQ item 9.

## ALLOWED SCOPE
Edit exactly one file: `index.html`. Only the strings listed below. Nothing else.

## REQUIRED EVIDENCE
Current verified strings in `index.html` (LAUNCH-CHECKLIST.md §1, §2, §3, §4, §9):
1. `#draft-note` note text: "Local request builder only: this form does not send anything
   or book an appointment. Prepare your request, then copy or download it. A verified
   business contact or secure submission endpoint still needs to be connected."
2. `<noscript>` note: "Request preparation requires JavaScript. Without it this preview
   cannot prepare a request, and nothing can be submitted from this preview."
3. Footer line: "Diamond Royalty Cleaning Company · Design and functionality preview"
4. Ack checkbox label: "I understand this prepares a local draft only. Nothing is sent,
   and no price or appointment is confirmed."
5. FAQ answers (three strings inside the details section, see LAUNCH-CHECKLIST §9).
A prior task already rewired the script and `#result` heading — do NOT touch those.

## STEPS
1. `git status --short` → confirm state; back up: `cp index.html /tmp/opencode/index.pre-t5.html`.
2. Make EXACTLY these replacements:
   - Replace the `#draft-note` text with:
     "Submit this form and your request goes straight to our team. We review every request
     and contact you to confirm details, coverage, and pricing before anything is booked."
   - Replace the `<noscript>` note text with:
     "This form needs JavaScript to submit. With JavaScript disabled nothing can be
     submitted here — please call (917) 270-3611 instead."
   - Replace the footer line with: "Diamond Royalty Cleaning Company"
     (delete the " · Design and functionality preview" suffix only).
   - Replace the ack label with:
     "I understand this sends my request to Diamond Royalty Cleaning for review. No price
     or appointment is confirmed until the team contacts me."
   - Replace the three FAQ answers with:
     a) "Yes. Submitting the form sends your request to the Diamond Royalty Cleaning team
        by email. The team then confirms scope, pricing, availability, and appointment
        details with you directly."
     b) "Your request is sent to the company's booking inbox and stored so the team can
        review and follow up. No payment is taken on this page and no appointment is
        booked until the team confirms with you."
     c) "Include non-sensitive preferences in your request. Product availability, surface
        suitability, and extra tasks are agreed with the team during follow-up."
3. Do NOT change: the scope hint near services (LAUNCH-CHECKLIST §7 — pending owner
   confirmation), the draft-sharing hint §8 (also pending), the ZIP hint "Coverage is not
   yet verified", the notes hint, the `#result` block, the `<script>` block, the CSP tag.
4. Stop.

## STOP CONDITIONS
Stop without editing if any target string is not found, or if a replacement would touch
anything outside the listed strings.

## VALIDATION
Run exactly:
- `grep -c 'Local request builder only' index.html` → 0
- `grep -c 'Design and functionality preview' index.html` → 0
- `grep -c 'prepares a local draft only' index.html` → 0
- `grep -c 'goes straight to our team' index.html` → 1
- `grep -c 'JavaScript disabled nothing can be submitted' index.html` → 1
- `grep -c 'This version prepares a draft request only' index.html` → 0
- `git diff --check` → no output

## REQUIRED REPORT
Report in this format:
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include exact outputs of the VALIDATION commands and state explicitly that §7/§8 hints
were left untouched.

## HARD PROHIBITIONS
Do not stage, commit, push, merge, delete, rename, move, create files, alter .gitignore,
install packages, start services, change configuration, change permissions, use
credentials, reveal secrets, or take remote actions.
```

COMPLETION PROOF: all greps as specified; §7/§8 hints untouched.

ESCALATE IF: any old string is absent (may mean a prior task already changed it) — report
and stop rather than guessing.

---

### T6 — Archive the dev-only pages from the repo root

TASK CLASSIFICATION: local-reversible (explicitly authorized `git mv` + one `git rm`)

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
Move three dev-only HTML files out of the repository root so they stop deploying with the
site: `diamond-royalty-contact-payment-prototype.html` and
`diamond-royalty-contact-payment-embedded-review.html` are moved into the existing
`archive/` directory with `git mv`; the tracked helper `__view-compare.html` is deleted
with `git rm` (removal explicitly authorized — it is a review helper per
LAUNCH-CHECKLIST.md).

## ALLOWED SCOPE
Exactly three paths: the two prototype/review HTML files (move to `archive/`) and
`__view-compare.html` (delete). No other path.

## REQUIRED EVIDENCE
All three files exist in the repo root; `archive/` exists and is tracked;
LAUNCH-CHECKLIST.md §"Non-text cleanup before launch" names `__view-compare.html` for
`git rm`.

## STEPS
1. `git status --short` → confirm expected state.
2. `git mv diamond-royalty-contact-payment-prototype.html archive/`
3. `git mv diamond-royalty-contact-payment-embedded-review.html archive/`
4. `git rm __view-compare.html`
5. Confirm the root no longer lists these files: `ls *.html` → only `index.html` remains.
6. Stop. Do NOT stage anything beyond what `git mv`/`git rm` staged automatically, and do
   NOT commit.

## STOP CONDITIONS
Stop if any file is missing, if `archive/` does not exist, or if git reports conflicts.

## VALIDATION
Run exactly:
- `ls *.html` → only `index.html`
- `ls archive/ | grep prototype` → shows the moved prototype file
- `git status --short` → shows the two renames (R) and the deletion (D) of
  `__view-compare.html`; no other changes

## REQUIRED REPORT
Report in this format:
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include exact outputs of the VALIDATION commands. State that nothing was committed.

## HARD PROHIBITIONS
Do not commit, push, merge, create files, alter .gitignore, install packages, start
services, change configuration, change permissions, use credentials, reveal secrets, or
take remote actions. The two `git mv` moves and the single `git rm` of
`__view-compare.html` are the ONLY staging-adjacent actions allowed, as authorized here.
```

COMPLETION PROOF: `ls *.html` shows only `index.html`; git status shows the two renames
and one deletion, uncommitted.

ESCALATE IF: any file is missing or `archive/` absent.

---

### T7 — Write a real README

TASK CLASSIFICATION: local-reversible

COPY/PASTE PROMPT:

```md
## ROLE
You are a careful repository maintenance agent.

## TASK
Replace the placeholder `README.md` (currently just two lines: "# diamond-site" and
"Diamond Royalty Cleaning Company Website") with a short real readme.

## ALLOWED SCOPE
Edit exactly one file: `README.md`.

## REQUIRED EVIDENCE
README.md is 56 bytes with the two lines above (LAUNCH-CHECKLIST.md §10). RUNBOOK.md,
schema.sql, and functions/api/booking.js exist in the repo (created by prior tasks).

## STEPS
1. `git status --short`; back up: `cp README.md /tmp/opencode/README.pre-t7.md`.
2. Rewrite README.md with exactly these sections (concise, no fluff):
   - `# diamond-site` — one sentence: production site for Diamond Royalty Cleaning
     Company (diamondroyaltycleaningco.com), deployed via Cloudflare Pages from `main`.
   - `## Stack` — static single-file site (`index.html`) + one Cloudflare Pages Function
     (`functions/api/booking.js`) + Cloudflare D1 (`bookings` table, see `schema.sql`) +
     Resend for email.
   - `## Booking flow` — form POSTs JSON to `/api/booking`; the function stores the
     booking in D1 and emails the CEO (BOOKING_NOTIFY_EMAIL) and the customer via Resend.
   - `## Config` — required Pages bindings: D1 binding `DB`, secret `RESEND_API_KEY`,
     var `BOOKING_NOTIFY_EMAIL`. See `RUNBOOK.md` for the full launch runbook.
   - `## Local preview` — `python3 -m http.server 8765` (static only; /api/booking
     requires the Pages deployment).
3. Stop.

## STOP CONDITIONS
Stop if README.md does not match the REQUIRED EVIDENCE description.

## VALIDATION
Run exactly:
- `wc -c README.md` → clearly larger than 56 bytes
- `grep -c 'RUNBOOK.md' README.md` → 1
- `git diff --check` → no output

## REQUIRED REPORT
## STATUS
## EVIDENCE
## RESULT
## FILES CHANGED
## VALIDATION
## HANDOFF
Include exact VALIDATION outputs.

## HARD PROHIBITIONS
Do not stage, commit, push, merge, delete, rename, move, create files, alter .gitignore,
install packages, start services, change configuration, change permissions, use
credentials, reveal secrets, or take remote actions.
```

COMPLETION PROOF: README contains Stack / Booking flow / Config / Local preview sections
and references RUNBOOK.md.

ESCALATE IF: README.md does not match the expected placeholder content.

---

## MILESTONE 3 — [OWNER] Cloudflare dashboard: Resend, D1, bindings

> **✅ COMPLETE — executed by agent via REST APIs (Oct 11, 2026), human creds used under
> the source-only contract.** Everything below was done by the agent; see
> `DECISIONS.md` #16–17 and the "Architecture pivot" note at the top of this file.
> **The owner should still revoke the Cloudflare API token now that Milestone 3 is done.**

Do these after Milestone 2 (the local files must exist first).

### Option: agent-driven Milestone 3 (no dashboard clicking)

The agent can execute this entire milestone (plus the `www` 522 fix) through the
Cloudflare and Resend REST APIs directly. Two credentials are required, handed over
OUTSIDE the repo (env vars when launching OpenCode, or `/tmp/opencode/creds.env` —
never committed, never pasted into tracked files):

1. **Cloudflare API token** — custom, minimum scope, single-zone:
   `Account → D1 → Edit` · `Account → Cloudflare Pages → Edit` ·
   `Zone → DNS → Edit` (diamondroyaltycleaningco.com zone only).
2. **Resend API key** — the same key that will be stored as the `RESEND_API_KEY`
   Pages secret.

Credential file format — the owner creates it in their OWN terminal so the values
never pass through a session:

```sh
install -m 600 /dev/null /tmp/opencode/creds.env
nano /tmp/opencode/creds.env   # two lines:
# export CLOUDFLARE_API_TOKEN='<token>'
# export RESEND_API_KEY='<key>'
```

Handling contract for the agent: source it only in commands that make API calls
(`set -a; source /tmp/opencode/creds.env; set +a;` per invocation); never print,
`cat`, `echo`, or `env|grep` the values; never write them into any repo file; redact
`Authorization` headers if an API error output is shown; after Milestone 3 the owner
revokes the Cloudflare token and the agent deletes the file.

Sequence the agent will run: create D1 `bookings` → apply `schema.sql` → add Resend
domain → fetch its DNS records → create them in the Cloudflare zone → poll Resend
until verified → set Pages bindings (`DB` + `BOOKING_NOTIFY_EMAIL` + `RESEND_API_KEY`
env vars) → repair the `www` record → report each step's API response.

Then **revoke the Cloudflare token** (minimum-privilege hygiene) and continue with
Milestones 4–5 as written. Bindings take effect on the next deployment (Milestone 4).

**O2 — Resend account + domain verification (required before ANY customer email works):**
1. resend.com → sign up → **Domains → Add Domain** → `diamondroyaltycleaningco.com`.
2. Resend displays DNS records (SPF TXT, DKIM TXT, and a tracking CNAME; add the DMARC
   record too if offered). Copy each record **exactly as displayed** into Cloudflare →
   **DNS → Records** (the zone is already here) → back in Resend, click **Verify**.
   Do not guess values — Resend generates unique DKIM keys.
3. **API Keys → Create API Key** → name `diamond-site-pages`, permission sending access →
   copy the key (shown once) into a password manager.
   Note: until the domain is verified, Resend only delivers to your own account email —
   so this step MUST precede testing.

**O3 — D1 database:**
1. dash.cloudflare.com → **Storage & Databases → D1 SQL Database → Create** → name
   `bookings` → Create.
2. Open the database → **Console** → paste the entire contents of the repo's
   `schema.sql` → Run.
3. Verify in Console: `SELECT name FROM sqlite_master WHERE type='table';` → shows
   `bookings`.

**O4 — Wire bindings into the Pages project:**
1. Pages project (from Milestone 1) → **Settings → Bindings** (older UI: Functions → D1):
   add **D1** binding, variable name `DB`, database `bookings` — for **Production AND
   Preview**.
2. **Settings → Variables and Secrets** → add for Production AND Preview:
   - `RESEND_API_KEY` → type **Secret** → value from O2.
   - `BOOKING_NOTIFY_EMAIL` → type **Text** → the CEO's email address.
3. Bindings only apply on the next deployment — trigger one (Milestone 4 does it anyway).

## MILESTONE 4 — [OWNER] Deploy

> **Status: CHANGED by the pivot.** The booking API + new site content were deployed to
> the `diamond-site` Worker by the agent via REST (see Milestone 3 box). What remains for
> the owner here is only the **git commit + push** so the repo matches production, plus
> (optionally, going forward) `npx wrangler deploy` for future releases. Agent push is
> denied by environment policy.

1. Review the local diff: `git status --short`, `git diff --stat`
   (expect: `index.html`, `README.md`, `schema.sql`, `functions/api/booking.js`, renamed
   archive files, deleted `__view-compare.html`).
2. Commit (suggested message: "wire booking form to /api/booking + D1 + Resend; launch
   copy") and `git push origin main` — **the owner pushes** (agent push is denied by
   environment policy).
3. Pages auto-builds. Check the deployment log is green and the **Functions** tab lists
   `/api/booking`.

## MILESTONE 5 — [OWNER] End-to-end verification

> **Status: ✅ COMPLETE (agent-verified, Oct 11 2026).** Full proof chain:
> - Live site serves the new form (phone field, "Send My Request", new copy); assets 200
>   with correct types; `GET /api/booking` → 405; unknown path → 404.
> - Valid POST → **201 + D1 row** (rows 1 and 3 in `bookings`); invalid ZIP → **400**.
> - **CEO notification PROVEN:** after Resend domain verification completed (all 4
>   records verified), booking #3 returned `owner_emailed: true` — accepted by Resend
>   for BOTH tyrikn2@gmail.com and diamondroyaltyny@gmail.com.
> - **Customer confirmation PROVEN with one caveat:** direct probe to a real address
>   (diamondroyaltyny@gmail.com) → 200 with email id. The test address
>   `jane.tester@example.com` returned 422 because `example.com` is a reserved domain
>   that Resend rejects outright — real customer addresses (gmail.com etc.) are fine.
> - `www` → HTTP 200 (522 fixed).
> Human-only remainder: check the CEO inboxes visually, then clean test rows.

Run in this exact order; do not skip the D1 check:

1. Private window → https://diamondroyaltycleaningco.com → artwork + sections render, no
   cert warnings.
2. Form checks: phone field present and required; name/email required; submit button
   enabled after page load (JS init intact).
3. Submit a test booking: Name `Jane Tester`, email `jane.tester@example.com`, phone
   `212-555-0100`, ZIP `10001`, Deep cleaning, 2 bed / 1 bath, One time, tomorrow's date,
   notes `TEST — ignore`.
4. Expected on-page: "Request received…" status + "Request Received" receipt with the
   recap.
5. Cloudflare → D1 → `bookings` → Console:
   `SELECT id, created_at, name, email, phone, zip, service FROM bookings ORDER BY id DESC LIMIT 10;`
   → the test row exists.
6. CEO inbox: "New booking request — Deep cleaning — ZIP 10001" with all fields.
7. Test inbox (and spam folder): "We received your cleaning request…".
8. Mobile check (~390px): form usable, success receipt readable, no horizontal overflow.
9. Negative checks: submit with an invalid ZIP → inline refusal, no network row; curl the
   API directly:
   `curl -i -X POST https://diamondroyaltycleaningco.com/api/booking -H 'Content-Type: application/json' -d '{"ack":false}'`
   → HTTP 400.
10. Optional cleanup of the test row:
    `DELETE FROM bookings WHERE email='jane.tester@example.com';`

✅ **Launch complete when:** steps 1–9 all pass.

---

## Rollback & notes

- **Code:** `git revert` the launch commit → push → Pages redeploys the prior site.
- **API/email only:** remove the `RESEND_API_KEY`/`BOOKING_NOTIFY_EMAIL` vars and the `DB`
  binding, redeploy → the function returns 500 JSON but the static site still renders.
- **Domain:** remove the custom domain in Pages → traffic stops there; GitHub Pages URL
  still serves the last pushed commit.
- The old GitHub Pages copy keeps serving until you disable it — disable it after
  Milestone 5 to avoid a stale duplicate.

## Open owner confirmations (unchanged, from LAUNCH-CHECKLIST.md)

- Consultation phone (917) 270-3611 as Zelle recipient — provisional.
- Payment acceptance facts; Cash App Pay product; Zelle attribution requirements.
- Scope hint (§7) and draft-sharing hint (§8) were deliberately NOT rewritten by T5
  because they encode unconfirmed business claims — confirm, then patch copy.

## Future hardening (out of scope for launch)

- Rate limiting / Cloudflare Turnstile on `/api/booking` (honeypot is the only spam
  defense today).
- If the CEO email bounces, bookings still land in D1 — make checking the D1 console part
  of the daily routine until email deliverability is trusted.
- Prune public root artifacts (`webp-candidates/`, `Method-Recommendedtreatment.csv`,
  `cash-app-ref.txt`) from the deployed site.
- Admin/approval workflow and payment collection — deliberately deferred (CEO decision).
