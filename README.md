# ArtBridge — Voice of Piece

Artist-led LA × Tanzania collaboration workspace. Buildless HTML/CSS/JavaScript; optional Python local CSV server, no database or Python packages required.

## Start the complete local workspace

```sh
python server.py
```

Open **http://127.0.0.1:8787**. On Windows, `py server.py` may be needed. The server binds only to loopback and is a **single-user workspace**, without accounts or shared multi-user authorization. A project draft does not send an invitation or record another person's acceptance.

- Real project story and existing photographs: Grace Lee × Ezekiel Charles Loishooki, *One Line, Two Worlds*.
- Full English / Korean / Kiswahili interface.
- Explainable, reciprocal preference matching; all example profiles are explicitly fictional.
- Artist profiles, shortlists, project briefs, stages, notes, translation review.
- Collaboration-document drafts in three languages; text download and print-to-PDF through the browser.
- Local CSV persistence, CSV export/import, browser draft recovery.
- Original nine-section artist application preserved at `legacy/index.html`.

## Automatic translation

Set **OPENAI_API_KEY** in the server process environment, then start the server. Optional **ARTBRIDGE_TRANSLATION_MODEL** defaults to `gpt-4.1-mini`. Do not put keys in JavaScript, CSV, Git, or a public hosting directory. The server uses the OpenAI Responses API with structured outputs and `store: false`.

The UI reports whether translation is connected. The author explicitly allows sending the text to the translation service when saving. Artist notes, profile descriptions, and project prose/terms can then be translated automatically. Names and numerical terms are preserved. Machine translations are marked for review, not approved automatically. The service configuration and end-to-end provider call require an actual key; no live provider request was made during this implementation.

Without a key, save still works: the original is saved, all three language columns exist, and untranslated versions remain **pending**, never fake translations. Add/edit translations in **My studio → Notes & translations**, or **My data** for profiles; project translation review is available from an open project. Editing the original invalidates unchanged older translations. A provider failure retains the original and marks the record pending. Translation copies may need human review, particularly for permissions and contractual language.

## Data layout and backups

- `data/sample-artists.csv`: public fictional sample profiles, never real preference claims.
- `runtime-data/records.csv`: private runtime data, automatically created and excluded from Git.
- `ARTBRIDGE_DATA_DIR`: optional directory override, useful for backups/testing.
- CSV columns: `id, kind, source_language, en, ko, sw, translation_status, updated_at, payload_json`.
- Metadata lives in `payload_json` so records have stable IDs and can migrate to database tables later. Project language columns contain a JSON object with `brief`, `deliverables`, `credit`, and `rights`.
- Export downloads all user-created profiles, notes and projects in one CSV. Import validates the entire batch, adds new IDs, and preserves existing IDs. Shortlists and unsaved form drafts are browser-local and are not part of record CSV export.
- Browser CSV export protects spreadsheet formula-leading cells with an apostrophe; reimport reverses this encoding, including original leading apostrophes. Runtime CSV is an application data file; use the UI export for opening in spreadsheet software.
- The CSV writer uses a process lock, temporary file, flush/fsync, and atomic replacement. Run one server process per data directory.

## Cloudflare / static preview

The root HTML and assets can be hosted statically, including on Cloudflare Pages. Without the Python server, the UI clearly reports **This browser only** and saves records to localStorage with manual CSV export/import. Browser storage is not a shared CSV filesystem, and clearing it removes unexported records. Automatic translation is unavailable in static-only mode.

**Cloudflare Pages does not run `server.py`.** For shared production storage/translation later, implement authenticated server endpoints (for example Workers plus a database/object store) matching `/api/status`, `/api/records`, `/api/import`. Do not upload `runtime-data/`, `.env`, `.git`, tests, or server-side credentials as public assets. No production Cloudflare deployment is included in this change.

## Matching research and limits

See [docs/MATCHING-RESEARCH.md](docs/MATCHING-RESEARCH.md). The index is an explainable prototype, not a success probability or artistic-quality rating. No claim of a universally best method is made. Weights need artist pilot validation. Availability is a date window, not a confirmed cross-time-zone meeting slot.

The case-study images include concept/contract material, not proof of signatures or final completion. New generated documents are proposed discussion drafts. Terms, credit, permitted uses and revenue shares require both artists' explicit review. The app does not sign on behalf of anyone.

## Checks

```sh
node --check script.js
node --test tests/*.cjs
python -m unittest discover -s tests -p 'test_*.py' -v
python tests/check_static.py
```

Browser visual/interaction QA must still be performed before a production release; no supported browser-control capability was available in this build environment. Desktop/mobile styles, reduced-motion behavior, dialog semantics, focus outlines, labels and language attributes are included but have not been visually verified in a real browser.

## Deploy this version to Cloudflare Pages

Connect the GitHub repository `voc2018/artbridge` to a Cloudflare Pages project:

- Production branch: `main`
- Framework preset: None
- Root directory: repository root (leave blank)
- Build command: `python3 tools/build_static.py`
- Build output directory: `dist`
- No API keys or environment variables are needed for this static deployment.

The build copies only public site files into `dist/`; Python source, tests, Git metadata, environment files, and private runtime data are excluded. The deployed site uses browser-local storage, CSV export/import, and manual translation review. It does not provide shared accounts, server CSV persistence, or automatic translation. Never put an API key in this static site.

For manual deployment, build locally and upload the contents of `dist/` through Cloudflare Pages Direct Upload. For an existing Git-connected Pages project, update its build command and output directory to the values above, then deploy the latest `main` commit.
