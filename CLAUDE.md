# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Semeion is an interactive 3D neuroanatomy book (Vite + three.js + troika-three-text, no framework). Each spread has text on the left page and an anatomical model standing on the right page. Text, buttons and quizzes are geometry inside the WebGL scene, not DOM overlays, so the book can be taken into VR. Everything in the project is in Italian: docs, code comments, book text and commit messages.

**Read `docs/AUTHORING.md` before touching a chapter or model.** It is the detailed spec for the spread layout, text rules, the `selector` API, close-ups (`focus`), model coordinates, mesh manifests and verification. `docs/PIANO.md` lists the chapters with their `order`, `id` and source notes.

## Commands

```bash
npm install
npm run dev                      # vite; .claude/launch.json uses port 5183
npm run build                    # static site in dist/; pushing to master deploys to GitHub Pages
export SOURCES=/home/gianmaria/Documents/Personal/meds/sources
node tools/mesh.mjs meshes/<id>.json     # writes public/meshes/<id>.glb and <id>.json
node tools/shot.mjs "http://localhost:<port>/#<id>/<spread>" /tmp/out.png [click:"Label"] [wait:ms] [hover:partId] [eval:"js"] [size:WxH]
```

There are no tests and no linter. The check is to build and take screenshots. The built-in browser pane has no WebGL, so use `tools/shot.mjs` (headless Chrome with swiftshader, about 15 s per shot, set `CHROME` to override the binary) and look at the image. Stop any dev server you started.

## Architecture

- **Chapters are self-registering.** `src/chapters/index.js` loads every `src/chapters/*.js` with `import.meta.glob` and sorts them by `order`, grouped by `part` (one of `PARTS`). Adding a chapter only takes new files: `src/chapters/<id>.js`, `src/models/<id>.js` and `meshes/<id>.json`. No existing file should need changes.
- **`src/main.js`** owns the renderer, camera framings (closed book, reading, close-up "lean"), input/picking, hover tooltips and navigation. It flattens all chapters into one `PAGES` list (TOC first). The URL hash is `#<chapterId>/<spreadNumber>`. Models are built lazily on first use and cached by `chapter.model ?? chapter.id`, so chapters with the same `model` key share one instance (`src/brain.js` is shared by three chapters). It waits for `model.ready` before showing a page. `window.__book` exposes the scene and camera for `shot.mjs`.
- **`src/book.js`** is the physical book: pages, cover, page turning and the ribbon bookmark. **`src/spread.js`** builds a spread (left text and quiz, right controls) and the TOC. **`src/ui.js`** has text, rich text with `{visible|termKey}` links, chips and the quiz, all as troika/three geometry. **`src/bar.js`** is the command bar. **`src/textures.js`** draws procedural canvas textures.
- **`src/modes.js`** handles right-page behaviour. `selector({...})` is the standard one. A custom mode is an async function returning `{ enter, update?, onHoverSet? }`.
- **`src/model.js` `AnatomyModel`** is the base class for every model. It provides named parts (`addPart`, `loadMeshes` from `public/meshes/*.glb`), oriented pathways with pulses (`addLink`), show/lit/dead/scale/activity/labels, close-ups (`zoomTo`) with clipping planes that cut away whatever leaves the right-page volume, and a screen mirror (`this.mirror`) so the patient's right appears on the viewer's left. Don't compensate for the mirror by hand. Put custom labels on `this.overlay`. Hand-made geometry helpers live in `src/geo.js`.
- **Term linking**: each key in a spread's `terms` maps to part ids, and hovering either the text or the model highlights the other. Every part id a term names must exist in the model.

## Mesh pipeline and realism

- Real meshes come from `../sources/bodyparts3d` (CC BY 4.0) or `../sources/zanatomy` (CC BY-SA 4.0, which adds nerves, plexuses, spinal cord and ear). Each source has an `index.tsv` you can grep. A model uses **one** source (`"source"` in the manifest), because the two use different coordinate frames.
- `tools/mesh.mjs` converts source mm coordinates (x left, y back, z up) into model coordinates (x right, y up, z forward) using `frame.origin`/`frame.scale`, applies `split` rules and `simplify`, and quantizes the result. Each chapter's `.glb` must stay **under 3 MB**.
- Anything neither source has (nuclei, tracts, some ganglia) is modelled by hand inside the real anatomy, anchored to real landmarks. Each `src/models/*.js` starts with a header comment listing what is real, what is reconstructed and the sources used. Keep that header up to date.
- Book text comes from the notes in `../medicina/Neuroanatomia/*.docx`. Don't add facts that aren't in the notes. Avoid arrows and symbols outside extended Latin (the font lacks them); use `›` for sequences.

## Notes

- Older chapters use their own `focus()`/`setFocus()` for close-ups. Don't copy them: use the engine's `view.focus` / option `focus` / `zoomTo` instead.
- `docs/AUTHORING.md` cites examples that no longer exist under those names (`src/chapters/cerebellum.js`, `src/cerebellum.js`, `src/chapters/brachial.js`). The current files are `cervelletto.js` and `plesso-brachiale.js` in `src/chapters/` and `src/models/`.
- Work often runs in parallel git worktrees under `.claude/worktrees/`, which are gitignored. In a worktree, symlink `node_modules` from the main checkout and give vite its own port. Other people work in this checkout too, so stage only your own files (no `git add -A`).
