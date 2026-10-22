# ArtBridge

**ArtBridge** is a Voice of Piece project exploring how artists separated by geography, language, and creative networks can discover one another and build meaningful collaborations.

The project grew from a real collaboration between **Ezekiel Charles Loishooki in Tanzania** and **Grace Lee in Los Angeles**. Their collaboration, *One Line, Two Worlds*, raised a larger question: if two artists who might never otherwise meet can create something new together, how can we make more of those meetings possible while protecting both artists' voices, names, and choices?

ArtBridge is a prototype of that structure.

## What ArtBridge does

ArtBridge is designed around the artist-to-artist relationship rather than around ranking artwork or automating creativity. The current prototype includes:

- artist discovery and profile experiences
- reciprocal artist-matching logic
- English, Korean, and Kiswahili interface content
- cross-cultural collaboration workflows
- project and Studio flow prototypes
- artist application flows
- collaboration agreement and signature-flow experiments
- research documentation explaining the matching approach
- the *One Line, Two Worlds* case study

The matching prototype is intended to help identify potentially meaningful connections. It does **not** rank artistic quality or predict whether a collaboration will succeed.

## Core matching idea

Before a pair is scored, the current research prototype checks basic eligibility conditions such as:

1. both artists have agreed to participate in recommendations;
2. each artist is within a region the other is interested in connecting with;
3. the profile contains the information needed for matching, including technique, subject, and activity preferences; and
4. the artists share at least one desired collaboration activity.

Pairs that pass those conditions can then be compared using reciprocal preference signals. The goal is explainable matching: the system should be able to show **why** two artists were suggested to one another.

See [`docs/MATCHING-RESEARCH.md`](docs/MATCHING-RESEARCH.md) for the current research notes and methodology.

## Repository structure

```text
artbridge/
├── index.html                  # Main ArtBridge site / application shell
├── script.js                   # Main client-side behavior
├── home.js                     # Home and story content
├── i18n.js                     # English / Korean / Kiswahili copy
├── matching.js                 # Artist matching logic
├── application-schema.js       # Artist application schema and validation
├── apply.js                    # Application workflow
├── studio-flow.js              # Studio/project workflow prototype
├── translation.js              # Translation utilities
├── artworks.js                 # Artwork web component
├── paint.js                    # UI/visual behavior
├── styles.css                  # Main styles
├── theme.css                   # ArtBridge design system/theme
├── mondrian.css                # Additional layout styling
├── server.js                   # Optional zero-dependency local Node server
├── artbridge-signature-demo.html
│                               # Signature + agreement lock demo
├── assets/                     # Images, logo, favicon, local font asset
├── data/
│   └── sample-artists.csv      # Sample artist data used for research/prototyping
├── docs/
│   ├── MATCHING-RESEARCH.md
│   ├── ArtBridge_Artist_Research_30.html
│   └── the-question-essay.txt
└── legacy/                     # Earlier prototype retained for reference
```

## Run locally

### Option 1 — simple static preview

Because the main site is client-side HTML, CSS, and JavaScript, you can open it with a local static server such as VS Code Live Server.

1. Clone or download this repository.
2. Open the repository folder in VS Code.
3. Open `index.html` with Live Server.

### Option 2 — included Node server

The repository also includes a small local server with no external runtime dependencies.

```bash
npm start
```

or:

```bash
node server.js
```

Then open:

```text
http://127.0.0.1:8080/
```

The local server can accept artist application test submissions and append them to:

```text
data/la-applications.csv
```

That file is intentionally ignored by Git and should remain private.

## Data and privacy

This repository contains **sample/prototype data only**. Do not commit private artist applications, contact information, credentials, API keys, or other sensitive data.

The included `.gitignore` excludes the local application CSV and common environment/secret files.

For a production deployment, artist applications should be connected to an authenticated backend or managed database with appropriate access controls instead of relying on the local CSV prototype.

## Languages

The current interface supports:

- English
- Korean (한국어)
- Kiswahili

ArtBridge treats multilingual access as part of the collaboration experience rather than as a separate add-on. Some research and archival documents may still exist only in their original language.

## Research and design principles

ArtBridge is being developed around several principles:

- **artist agency first** — artists decide whether and how they participate;
- **reciprocal matching** — compatibility should consider what both artists want, not only one side;
- **explainability** — recommendations should be understandable rather than opaque;
- **creative difference is valuable** — the goal is not to find identical artists;
- **technology should enable creation, not replace the artist**;
- **collaboration needs protection** — names, permissions, agreements, and shared expectations matter as much as discovery.

## Current status

ArtBridge is an active research and development prototype. Interfaces, matching criteria, data models, translation behavior, and collaboration-document workflows are still being tested and refined.

It should not yet be treated as a finished production marketplace or as an automated decision system.

## Origin: *One Line, Two Worlds*

ArtBridge grew out of the collaboration between **Grace Lee** and **Ezekiel Charles Loishooki**. Their work demonstrated that technology can do more than display existing artwork: it can help create the conditions in which artists who would otherwise never meet can produce something that did not exist before their meeting.

That possibility is the central idea behind ArtBridge.

## Organization

ArtBridge is a project of **Voice of Piece**, an initiative of **Voice of Calling NPO**.

**Voice of Piece**  
Connecting artists across distance through technology, collaboration, and shared creation.
