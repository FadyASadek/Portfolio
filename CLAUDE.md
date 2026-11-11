# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Fady Ashraf (`https://github.com/FadyASadek/Portfolio`). Static, dependency-free front-end: the home page `index.html`, the case-study page `project.html`, `style.css`, `script.js`, `project.js`, `projects-data.js`, plus `image/` and `assets/Fady_Ashraf_CV.pdf`.

## Commands

There is no build step, package manager, linter, or test suite. Open `index.html` directly in a browser, or serve the folder (`python -m http.server`) if a file:// origin causes trouble. Deployment is a push to `origin/main`.

External dependencies load from CDNs at runtime only: Font Awesome 6.4.0 and the Outfit font from Google Fonts.

## Architecture

**Project data lives in two places and must be kept in sync.** `projects-data.js` defines a global `projectsData` object keyed by project id (`sales_system`, `icpc_natu`, …). It is a classic script, not JSON, because `fetch()` fails on a `file://` origin. Each entry feeds the full-page case study:

| Field | Shape | Rendered as |
| :--- | :--- | :--- |
| `title`, `tagline` | string | hero heading and subtitle |
| `role`, `date` | string, optional — omit the key when unknown | hero metadata pills |
| `img` | path under `image/` | cover, the first and largest showcase image |
| `gallery` | path array, `[]` when none | further showcase images |
| `live`, `code` | URL or `"#"` | hero action buttons |
| `overview`, `problem` | string | Overview & Problem cards |
| `architecture`, `features` | string array | bullet lists |
| `challenges` | `{ title, detail }` array | Engineering Challenges list |
| `stackByCategory` | `{ "<Layer>": string[] }` | grouped chip blocks, in key order; layers are `Backend`, `Frontend`, `Database`, `DevOps / Infra`, `Integrations`, `Testing` |

The card grid in `index.html` (`#projects-grid.bento-grid`) repeats a short title, short blurb, thumbnail, and a trimmed tech list for the same project. Each card is an `<a href="project.html?id=<id>">`. Adding or renaming a project means editing both files. A card id with no matching `projectsData` key opens the case page's "Project not found" state.

`project.js` renders the case study into the fixed skeleton in `project.html` using `textContent` only — never put markup in the data. It hides any section or card whose field is empty, so a short array is better than padding. The lookup uses `Object.hasOwn`, so prototype keys never resolve as ids.

The card thumbnail and the case-study `img` are independent fields — they are not always the same file (e.g. `icpc_natu` shows one screenshot on the card and `image/s8.png` as its cover). That is intentional, not a bug to "fix".

`project.js` treats `"#"` and `""` in `live`/`code` as "no link" and hides the corresponding button, so use `"#"` rather than omitting the key for projects without a public URL or repo.

**`script.js` is a set of small independent blocks**, loaded by both pages. Each is guarded by an existence check on its element, so a block whose markup is absent on one page does nothing:

- Projects preview: when `#projects-grid` has more than `PROJECTS_PREVIEW_COUNT` (6) cards, the rest get `.is-collapsed` and `#projects-toggle` ("View All Projects (N)" / "Show Less") is un-hidden. Card order in `index.html` is recency order — the first six are the ones shown.
- Hamburger menu toggling `.active` on `.nav-links` and `.toggle` on `.hamburger`, auto-closing on nav link click.
- An `IntersectionObserver` that adds `.visible` to every `.scroll-reveal` element at a 0.1 threshold. Any new section needs the `scroll-reveal` class to fade in; `delay-1` / `delay-2` stagger siblings via `transition-delay`.

  The project-card stagger restarts every six cards, because cards 7+ only reveal after the grid is expanded. Card position P (1-based) gets `delay-((P - 1) mod 6)` — no class for 0. That runs no class, `delay-1` … `delay-5`, then no class again. `style.css` defines `.delay-1`–`.delay-5` (`N × 0.1s`), and a class with no rule silently reveals on the same tick as the first card. Inserting a card shifts every later card's position, so renumber the ones after it.

  `project.js` runs before `script.js` on `project.html`. It has to: the observer collects `.scroll-reveal` elements once at load, so anything rendered after that would never reveal.
- Theme toggle writing `data-theme` on `<html>` and persisting to `localStorage` under `theme`.

**Theming is entirely CSS custom properties.** `:root` in `style.css` defines the dark palette and `[data-theme="light"]` overrides it; `index.html` ships with `data-theme="dark"` on `<html>`. New colors should come from the existing tokens (`--bg-color`, `--text-main`, `--text-muted`, `--primary`, `--secondary`, `--accent`, `--glass-bg`, `--glass-border`, `--nav-bg`, `--blob-opacity`) rather than literals, or light mode will break. The sun/moon icons are swapped by `[data-theme]` rules near the end of the stylesheet.

The `glass` class (backdrop blur over `--glass-bg`/`--glass-border`) is the shared surface treatment for the navbar, cards, case-study panels, and the "View All" button. Decorative `.blob` elements sit in `.background-blobs` at the top of `<body>` on both pages.

Visibility on the case page and for the toggle is driven by the HTML `hidden` attribute. `style.css` forces `[hidden]` to `display: none !important` inside `.case-study`, on `.lightbox` and on `.btn-view-all`. Without it, those elements' own `display` rules would override `hidden`.

Some behavior is inline in the HTML rather than in `script.js` — the resume download button rewrites its own label via an `onclick` attribute.

Section ids (`about`, `experience`, `projects`, `skills`, `volunteering`, `education`, `contact`) are the anchor targets for the nav. `project.html` carries its own copy of the navbar, with every link prefixed `index.html#`. Renaming a section breaks the link on both pages, and a navbar change must be made in both files.

Image filenames include spaces and Arabic characters (e.g. `image/قصر السلام.png`) and are referenced verbatim — preserve them exactly when touching paths.

## Project Ingestion Workflow

Triggered when the user supplies a local directory path or a GitHub link for a project to add to the portfolio.

**`agy` executes all three stages.** Claude Code does not clone, does not run the target project, does not capture assets, and does not hand-edit `script.js` or `index.html` as part of this pipeline. Its role is exactly three things:

| Claude Code does | Claude Code does not |
| :--- | :--- |
| Write the brief and dispatch `agy` | Perform the work itself when a dispatch fails or stalls |
| Monitor the run (exit status, wall-clock, timeouts, rate limits) | Silently patch up a partial `agy` result |
| Validate the schema, run the §4 guards, review the diff per §5 | Skip a guard because `agy` reported success |

When a stage fails, re-dispatch with a corrected brief. Do not absorb the work — that is the same rule §3 applies to tests, and it applies here for the same reason: a pipeline Claude Code quietly finishes by hand stops being a measurable pipeline.

All three stages run `--model gemini-3.8-flash-high` with the §2b mandatory flags. Stages are sequential; each stage's output is validated before the next is dispatched.

**Precondition — trust.** Stage 2 executes the target project's own build and run commands under `--dangerously-skip-permissions`. Only ingest repositories the user owns or otherwise trusts. For an unfamiliar third-party link, confirm with the user before dispatching.

**Workspace rule.** The target project and this portfolio are two different trees. Never clone a target into `D:\Projects\Portfolio`; `agy` clones to a scratch directory. `--add-dir` is repeatable, so a stage that must see both trees passes it twice.

### Stage 1 — Inspection & extraction

```
agy --dangerously-skip-permissions \
    --add-dir "<ABSOLUTE_TARGET_PROJECT_ROOT>" \
    --model gemini-3.8-flash-high \
    --output-format json \
    --json-schema "<SCHEMA JSON, inline>" \
    --print "<BRIEF>"
```

`--json-schema` takes the schema text itself, not a file path — pass `"$(tr -d '\n' < schema.json)"`. Keep backslashes out of the schema (write `[.]`, not `\\.`, in patterns): on Windows the escape is lost in argv and agy rejects the schema as invalid JSON before starting.

`agy` analyzes the codebase and returns everything a case study and its card need: the `projectsData` fields (see Architecture above), the card's short title, blurb and 2–3 chips, and an `evidence` list citing the file behind each non-trivial claim. Leave `role` and `date` to the owner — the code can't establish them.

`agy` has **no `--read-only` flag** — verified against `agy help`, not assumed. A dispatch pointed at the target repo can therefore write to it, so the brief must state explicitly that no file in the target is to be created, modified, or deleted; Stage 1 is an inspection pass only.

Constrain the output with `--json-schema` rather than parsing prose — the portfolio schema is fixed and machine-checkable:

| Field | Rule |
| :--- | :--- |
| `id` | snake_case key, unique within `projectsData` |
| `title`, `tagline` | full title; one sentence |
| `cardTitle`, `cardBlurb`, `cardTech` | home-page card only: 2–4 words, one short sentence, 2–3 chips |
| `overview`, `problem` | paragraph; 1–2 sentences |
| `architecture`, `features` | string arrays; short is correct for small projects |
| `challenges` | `{ title, detail }` array |
| `stackByCategory` | only the six layer keys, only non-empty layers |
| `live` / `code` | URL, or `"#"` when absent — never omit the key |
| `evidence` | `{ claim, file }` per non-trivial claim; review aid, not stored |

Every claim must be provable in code or project manifests. A README or design document alone is not evidence — those often describe intent the code never implemented.

**Claude Code validates** the returned JSON against this table before Stage 2 is dispatched. Reject and re-dispatch on: a duplicate `id`, an invented or unreachable URL, a stack item the repo does not actually use, or a claim whose `evidence` file does not back it. Invented links are the most common failure — resolve each one rather than trusting the extraction. A repo that is private on GitHub gets `code: "#"`.

**Client work.** For freelance or client repos, the brief forbids opening SQL dumps, backups, `.env`/`config.php`-style credential files, uploads and PDFs, and forbids quoting personal data. Where the work was security remediation on a live system (e.g. Clickit), describe fix *categories* only — no endpoint paths, parameter names, or reproduction steps.

### Stage 2 — Run, capture & visual asset generation

Dispatched with **both** trees in the workspace, because `agy` runs the project in one and writes assets into the other:

```
agy --dangerously-skip-permissions \
    --add-dir "<ABSOLUTE_TARGET_PROJECT_ROOT>" \
    --add-dir "D:\Projects\Portfolio" \
    --model gemini-3.8-flash-high \
    --print-timeout 20m \
    --print "<BRIEF>"
```

`--print-timeout` defaults to 5m, which a restore-plus-build-plus-boot cycle will routinely exceed. Raise it for this stage or the dispatch dies mid-build and reports a timeout that looks like a model failure.

`agy` starts the project by whatever its type requires (`dotnet run`, `npm start`, `docker compose up`, a static server), waits for the port to answer, drives a browser to capture the real UI, then shuts the project down.

**Verified capture path on this machine** — Chrome is installed and headless capture works with no npm install:

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" \
  --headless --disable-gpu --screenshot="<abs out.png>" \
  --window-size=1440,900 "<url>"
```

Available toolchain, confirmed present: Node 24 / npx 11 (so `npx playwright` is an option when multi-step interaction or an authenticated view is needed), .NET 10, Chrome. Prefer the headless-Chrome one-liner for simple page captures — no install, no network fetch.

For a headless service or an API with no UI, `agy` generates a high-fidelity SVG or mockup cover instead of a screenshot. Client projects always get a generated cover and are never run (decided 2026-10-06): a local copy usually only has production dumps to boot against, and real customer data must not reach a public screenshot.

`agy` writes the assets straight into `image/` using a clean, ASCII, space-free convention — `<id>-cover.png`, `<id>-01.png`. Do not reproduce the repo's existing space-and-Arabic filenames for anything new; those stay only because they are already referenced.

**Claude Code validates** that the files landed in `image/`, are non-trivial in size, and actually render — a 0-byte or all-white PNG means the capture fired before the page painted, and the stage gets re-dispatched with an explicit wait.

### Stage 3 — Portfolio code injection

Dispatched inside the portfolio workspace only. Both files change together, because project data is two-source (see Architecture above):

- `projects-data.js` — new `projectsData` entry under the validated `id`, carrying every case-study field from the Architecture table. Set `img` to the Stage 2 cover and `gallery` to the remaining Stage 2 images. Add `role`/`date` only when the owner has supplied them.
- `index.html` — matching card `<a class="bento-item glass scroll-reveal [delay-N]" href="project.html?id=<id>">`. It holds `cardTitle`, `cardBlurb`, the cover thumbnail, `cardTech`, and the overlay label "View Case Study". New projects go first (recency order), so the newest land in the six-card preview.

The card's class list must be `bento-item glass scroll-reveal` — all three. `bento-item` carries the grid and card styling, `glass` the surface treatment, `scroll-reveal` the fade-in; omitting any one ships a visibly broken card. After inserting, renumber the `delay-N` classes of every card per the six-card cycle above. `style.css` should not need edits — the case-study page is data-driven. All colors come from the existing custom properties; a literal hex breaks light mode.

The brief must forbid touching `project.html`, `project.js`, `script.js`, any existing card's content, the stylesheet, or unrelated sections.

**Then, before anything is presented:**

1. `$clean-code-guard` on the diff (§4).
2. Claude Code reads the changed lines directly (§5) — the two sources agree on the `id`, image paths resolve, `"#"` sentinels are used for missing links, no existing card or style was altered as a side effect.
3. Render check in both themes — confirm the new card shows in the preview (or behind "View All"), reveals on scroll, and that `project.html?id=<id>` renders every section with no empty panels. This is review, not execution, and is the one place Claude Code drives a browser in this pipeline.

### Ledger handling

All three stages pin `gemini-3.8-flash-high` by workflow rather than choosing it by §2c alternation. Log each dispatch in `~/.claude/flash-benchmark.md` with mode `pinned` and **do not count them toward the §8 lock criteria** — a pinned model is not a sample from the alternation, and counting it would bias the ui lane the same way an escalated task would.

### Test coverage — exempt

This repo is exempt from the global §3 test mandate (decided 2026-10-06). It is a dependency-free static site with no runner or `package.json`, and adding one only to cover `project.js` rendering and the preview toggle is not worth the tooling. Ingestions ship with no test dispatch; the Stage 3 guard pass and the two-theme render check are the verification.
