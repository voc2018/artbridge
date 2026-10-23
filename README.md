# ArtBridge by Voice of Piece

**Live site:** https://artbridge.voiceofpiece.org
**Owner:** Voice of Piece (an initiative of Voice of Calling NPO)
**Last updated:** 2026-10-23

ArtBridge connects artists in Tanzania with artists in Los Angeles and elsewhere, so they can find each other and make new work together. It grew out of the real collaboration *One Line, Two Worlds* between Ezekiel Charles Loishooki (Arusha) and Grace Lee (Los Angeles).

This README is the handover document. If you are joining the next cohort, read it from top to bottom before changing anything.

---

## 1. Current status at a glance

| Area | Status |
|---|---|
| Website (pages, 3 languages) | Live on Cloudflare (`artbridge` folder of the `voiceofpiece` Worker) |
| Artist registration | **One form only: `#apply`** (see section 3) |
| Matching | Works, but runs on **22 sample profiles** in `data/sample-artists.csv` |
| Tanzanian artists' matching answers | **Demo examples**, not the artists' own answers yet |
| Saving applications | **Not connected to a database yet.** On the live site, answers stay in the applicant's own browser |
| Studio (projects, notes, agreement) | Prototype. Saved only in the user's browser |
| Database | **Designed, not created yet.** Schema is in `db/` (see section 6) |

ArtBridge is a research prototype. Do not describe it as a finished marketplace or as an automated decision system.

---

## 2. Site map

The site is a single page (`index.html`). Each "page" is a `<section>` shown by its `#hash`.

| Address | What it is |
|---|---|
| `#home` | The bridge: philosophy, how it works, the 17 Tanzanian artist cards |
| `#discover` | Find your people: artist cards with connection index (matching) |
| `#studio` | My studio: projects, notes & translations, my data (export / import) |
| `#apply` | **The artist application form** (the only registration form) |
| `#about` | Our story: why and who built ArtBridge |
| `#meeting` | The first meeting: the Grace × Ezekiel case study |
| `#research` | Research: how matching works and why |
| `/legacy/index.html` | **Not part of ArtBridge.** The original Voice of Piece artist application. Leave it alone. No ArtBridge page links to it |
| `/artbridge-signature-demo.html` | Standalone demo of the signing and agreement-lock flow |

---

## 3. Rule: one artist registration form

**Every artist joins ArtBridge through `#apply`. Do not add another sign-up form, pop-up, or Google Form.**

Links that open `#apply` today (keep them pointing there):

| Where | Button text | File |
|---|---|---|
| Header | Join the bridge ↗ | `index.html` |
| Home hero | I'm an artist — join the bridge ↗ | `index.html` |
| Closing section, meeting page | Create your artist profile ↗ | `index.html` (2 places) |
| Our story page (team section) | Join the bridge ↗ | `index.html` |
| Discover page | + Add my profile | `index.html` |
| Home artist row, last card | "+" your name card | `home.js` |
| Footer | Join the bridge ↗ / Artist application | `index.html` |

Change log 2026-10-23:
- "+ Add my profile" used to open a small profile pop-up inside the Studio. It now opens `#apply`, and the pop-up code (`profileForm`, `submitProfile`) was removed from `script.js`.
- The footer link "Original artist application ↗" (to `/legacy/`) was removed from ArtBridge.

To check that nothing else points elsewhere, search the code for `#apply`, `#application`, `legacy`, and `docs.google.com`.

---

## 4. File guide

### 4.1 JavaScript loaded by `index.html` (in this order)

| File | What it does | Edit it when you want to… |
|---|---|---|
| `i18n.js` | Dictionary of every interface text in **English, Korean, Kiswahili** (`window.ArtBridgeI18n`). English is the default language | change or add any button, title, or message |
| `artworks.js` | `<artbridge-artwork>` component. Shows the three case-study images (`grace-original`, `ezekiel-original`, `collaboration-final`) exactly as supplied, with no cropping or filters | change how those three works load |
| `matching.js` | **The matching calculator** (`window.ArtBridgeMatching`). Compares two profiles and returns a 0–100 connection index plus the reasons | change matching rules or weights (also update `docs/MATCHING-RESEARCH.md`) |
| `application-schema.js` | **The list of application questions and rules**: option lists, column order (`COLUMNS`), required fields, validation, CSV writer. Shared by the browser form and `server.js` | add, remove, or rename an application question |
| `apply.js` | **The `#apply` form screen**: draws the questions in 3 languages, saves a draft while typing, validates, submits | change the form layout or where submissions are sent |
| `home.js` | Home page copy, the **17 Tanzanian artist cards** (`ARTISTS` list, each linking to `<slug>.voiceofpiece.org`), and the "Our story" page | add a Tanzanian artist card or change home content |
| `translation.js` | Connects to the free **MyMemory** translation API (no key). Splits text under 500 bytes per request | change the translation provider |
| `script.js` | **The main app**: navigation and routing, language switch, Discover (cards, filters, shortlist, "match as" selector, profile view), Studio (projects, notes, translations, document preview), export / import of workspace CSV, artwork files | almost anything else |

### 4.2 JavaScript in the folder but NOT loaded by any page

| File | What it was meant to do | Decision needed |
|---|---|---|
| `paint.js` | Home-page effect: paint drips down while scrolling (Tanzanian earth colours from the left, LA blues from the right) | Turn on (add `<script src="paint.js">`) or delete |
| `studio-flow.js` | Project stage steps (Planning → Creating → In review → Completed) and the signing flow (discuss terms → both sign → original locked → amendment) | **Important feature.** Confirm with the previous team whether it was turned off on purpose before turning it on |

### 4.3 Other files

| Path | What it is |
|---|---|
| `index.html` | The whole site structure (all sections) |
| `styles.css`, `theme.css` | Styles. Both are loaded |
| `mondrian.css` | Extra layout styles. **Not loaded** by any page |
| `server.js` | Small Node server for **local testing only** (`node server.js`). Saves `#apply` submissions to `data/la-applications.csv`. It does **not** run on Cloudflare |
| `package.json` | Only defines `npm start` → `node server.js` |
| `data/sample-artists.csv` | The 22 profiles used by matching: 5 fictional LA artists + 17 Voice of Piece artists with **demo** answers. Loaded by `script.js` |
| `data/.gitignore` | Keeps `la-applications.csv` (personal data) out of git |
| `db/schema.sql` | **Database design** for Cloudflare D1 (section 6) |
| `db/seed.sql` | Starter data: matching vocabulary + the 22 sample profiles |
| `docs/MATCHING-RESEARCH.md` | Why matching works the way it does, papers reviewed, what is not claimed |
| `docs/ArtBridge_Artist_Research_30.html` | Public-web research on 30 CCA member artists (why ArtBridge might be needed) |
| `docs/the-question-essay.txt` | Essay behind "What would you like to make with an artist on the other side of the world?" |
| `artbridge-signature-demo.html` | Standalone signing / agreement-lock demo |
| `assets/` | Images, logo, favicon, font. `assets/a` is an empty 1-byte file and can be deleted |
| `legacy/` | Original Voice of Piece application (`index.html`, `script.js`, `styles.css`). Belongs to Voice of Piece, not ArtBridge |

---

## 5. Where data lives today (before the database)

| Data | Stored in | Key / file |
|---|---|---|
| `#apply` submissions, live site | **Applicant's own browser only** | localStorage `artbridge.applications.v1` |
| `#apply` submissions, local test | CSV on the computer running `server.js` | `data/la-applications.csv` |
| `#apply` unfinished draft | Browser | localStorage `artbridge.draft.apply-form` |
| Studio projects and notes | Browser | localStorage `artbridge.workspace.v1` |
| Studio artwork files | Browser | IndexedDB `artbridge.artwork.files.v1` |
| Shortlist, "match as", language | Browser | localStorage `artbridge.shortlist`, `artbridge.matchAs`, `artbridge.language` |
| Sample profiles for matching | Static file | `data/sample-artists.csv` |

**Problem this causes:** on the live site, Voice of Piece cannot see anyone's application. This is the main reason to build the database.

`server.js` endpoints (local only):

| Method | Path | Does |
|---|---|---|
| GET | `/api/applications/status` | Says whether the CSV server is running and how many rows exist |
| POST | `/api/applications` | Validates with `application-schema.js` and appends one row |
| GET | `/api/applications.csv` | Downloads the CSV |

`script.js` also calls `/api/status`, `/api/records`, and `/api/import` for a "server mode" Studio, but **`server.js` does not implement them**, so the Studio always uses the browser.

---

## 6. Database (planned)

### 6.1 Decision

- ArtBridge gets **its own Cloudflare D1 database: `artbridge-db`**.
- It is **separate from `voice-of-piece-db`** (the Voice of Piece artist and artwork DB: 17 artists, 126 artworks, photos in R2 bucket `vop-artworks`).
- ArtBridge never copies Voice of Piece data. It links to it:
  - a Voice of Piece artist → `artists.vop_slug` (for example `ezekiel` → `ezekiel.voiceofpiece.org`)
  - a Voice of Piece artwork used in a collaboration → `project_works.vop_artwork_id`
- LA artists do **not** get a website, so ArtBridge only stores what matching, the artist card, contact, and the agreement need.

### 6.2 Tables (`db/schema.sql`)

| Group | Table | Holds |
|---|---|---|
| Vocabulary | `tag_options` | The fixed answer choices (skills, themes, formats, regions) with labels in en/ko/sw. Same list for Tanzania and LA |
| Artists | `artists` | Public profile, region, card image, consent, status, and which kind of artist: `vop` / `applicant` / `fictional` |
| | `artist_private` | Email, contact, age group, guardian consent. **Kept separate so public pages never read it** |
| | `artist_tags` | Matching answers, one row per choice (`skill`, `seeking`, `theme`, `format`, `partner_region`) |
| Text | `texts` | Every free text in en/ko/sw, with its state: `source`, `machine`, `reviewed`, `pending` |
| Applications | `applications` | Each `#apply` submission exactly as sent (JSON), plus review status |
| Matching | `match_suggestions` | Computed pairs: score, both directions, reasons, algorithm version |
| | `shortlists` | One artist's private bookmarks (sends nothing to the other artist) |
| | `interests` | Each artist's own yes / no to the other. **Mutual = both said yes** |
| Collaboration | `projects` | The pair, stage, formats, transformation boundary, revenue share, VOP fee % |
| | `project_works` | Source and finished works (VOP artwork id or R2 file) |
| | `agreements` | Each version of the agreement; locked versions are never edited |
| | `agreement_signatures` | Who signed which version, with the content hash they signed |
| | `notes`, `project_events` | Studio notes and the full history of a project |

Views: `v_matchable_artists` (who may appear in suggestions right now) and `v_mutual_interest` (pairs where both said yes).

Important columns:
- `artists.answers_source`: `artist` = the artist's own answers, `demo` = placeholder answers for the Congressional App Challenge demo. All 17 Voice of Piece artists are `demo` until they answer themselves.
- `artist_private` blocks a minor without guardian consent (CHECK constraint).
- `projects.vop_fee_pct`: Voice of Piece's fee is not decided yet; leave it empty until it is.

### 6.3 How data will flow

```
#apply form ──POST──▶ Worker /api/applications ──▶ applications (raw JSON, status "new")
                                                        │  Voice of Piece reviews and approves
                                                        ▼
                                          artists + artist_private + artist_tags + texts
                                                        │
                                   matching.js (same code, run in the Worker or browser)
                                                        ▼
                         match_suggestions ─▶ shortlists / interests ─▶ projects ─▶ agreements
```

### 6.4 Steps to build it

1. In the Cloudflare dashboard, create D1 database `artbridge-db`.
2. Run `db/schema.sql`, then `db/seed.sql`, in the D1 console (or `wrangler d1 execute artbridge-db --file=db/schema.sql`).
3. Bind `artbridge-db` to the `voiceofpiece` Worker and add routes that replace `server.js`:
   - `POST /api/applications` (save a submission)
   - `GET /api/artists` (public card data from `v_matchable_artists` only, never `artist_private`)
   - an admin-only route to review and approve applications
4. In `apply.js`, keep `fetch('api/applications')` but point it at the Worker. Remove the "save in this browser" fallback for the live site.
5. In `script.js`, load profiles from `GET /api/artists` instead of `data/sample-artists.csv`.
6. Upload the applicant's card image to R2 and store its key in `artists.image_url`.
7. Collect the Tanzanian artists' real matching answers and switch their `answers_source` to `artist`.

---

## 7. How matching works (`matching.js`)

Both sides answer the **same** questions with the **same** option lists.

**A pair is skipped when:**
1. either artist has not consented, or it is the same artist;
2. either artist is outside the other's wanted partner region;
3. either profile is missing skills, seeking, themes, or formats;
4. they share **no** collaboration format.

**Score:** for each direction A→B
- 35% theme overlap (Jaccard)
- 40% how many of the skills A is looking for B has (coverage)
- 25% format overlap (Jaccard)

The two directions are combined with a **harmonic mean** (a weak side pulls the result down), then scaled to 0–100. The weights are design choices, not values taken from the research papers.

**Transformation** (`side-by-side` < `combined` < `redraw`, i.e. how far a partner may change the work) is **never scored**. The pair inherits the more protective of the two answers, and it carries into the agreement.

Not used for matching: available dates (removed; schedules are agreed after matching), hours per week, and writing language (used for translation only; never lowers a match).

The score is a preference-based index. It is **not** a probability that a collaboration will succeed, and it never ranks artistic quality.

---

## 8. Known issues (fix these first)

| # | Issue | Where |
|---|---|---|
| 1 | Applications on the live site are saved only in the applicant's browser | `apply.js` (needs the database) |
| 2 | An applicant who chooses region "Somewhere else" (`OTHER`) gets **0 matches**, because Tanzanian profiles only accept `LA` as a partner region | `apply.js` sets `partner_regions: 'TZ'`; `data/sample-artists.csv` has `partner_regions: LA` |
| 3 | `transformation` is empty for all 22 sample profiles, so the agreed boundary always shows as unknown | `data/sample-artists.csv` |
| 4 | Field names differ: the application uses `consent_listing: yes/no`, matching expects `consent: true/false`. Nothing converts an application into a matching profile yet | `application-schema.js`, `matching.js` (the DB uses `consent_listing` 0/1) |
| 5 | Matching does not check guardian consent for under-18 applicants | `matching.js` (the DB view `v_matchable_artists` does) |
| 6 | `docs/MATCHING-RESEARCH.md` still says date windows are required; dates were removed | docs |
| 7 | `paint.js`, `studio-flow.js`, `mondrian.css` exist but are not loaded | `index.html` |
| 8 | `script.js` expects `/api/status`, `/api/records`, `/api/import`, which no server provides | `script.js`, `server.js` |
| 9 | The application asks many optional questions inherited from the Voice of Piece form (inspiration, process, exhibitions, awards, …) that ArtBridge does not use. Consider trimming to what matching, the card, contact, and safety need, and asking for one card image upload instead | `application-schema.js`, `apply.js` |

---

## 9. Principles (do not break these)

- **Artist agency first.** Artists decide whether and how they take part. A score is never treated as consent. Shortlisting or drafting a project sends no invitation.
- **Reciprocal and explainable.** Always show *why* two artists were suggested.
- **Real vs demo must be visible.** Never present demo answers or fictional profiles as a real artist's own words.
- **Protect originals.** Each artist keeps ownership of their work. A signed agreement is never edited; changes need a new amendment.
- **Personal data stays private.** Do not commit applications, emails, or `.env` files. Public pages never read `artist_private`.
- **Three languages everywhere.** English (default), Korean, Kiswahili. Keep the original text; mark machine translations until a person reviews them.

---

## 10. Run locally

```bash
node server.js          # or: npm start
```

Open http://localhost:8080/ (application form: http://localhost:8080/#apply). Needs Node.js; no packages to install.

Opening `index.html` with VS Code Live Server also works, but then submissions stay in the browser.

To try the database locally:

```bash
sqlite3 artbridge.db < db/schema.sql
sqlite3 artbridge.db < db/seed.sql
```

---

## 11. Deploying

The site is served from the `artbridge` folder of the Cloudflare Worker `voiceofpiece`, on the subdomain `artbridge.voiceofpiece.org` (the same way artist sites use `<artist>.voiceofpiece.org`). Upload changed files into that folder. Do not upload `data/la-applications.csv` or any file with personal data.
