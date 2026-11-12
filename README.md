# Semeion

Libro digitale interattivo di medicina: ogni doppia pagina tratta una sola idea,
con il testo a sinistra e un modello anatomico 3D "in piedi" sulla pagina a destra.
Testo, pulsanti e quiz sono geometria nella scena (niente DOM sovrapposto), così
il libro si può portare in VR.

31 capitoli di neuroanatomia, ricavati dagli appunti, in sette parti: midollo e nervi
spinali, vie e tronco encefalico, encefalo, nervi cranici, organi di senso, sistema
vegetativo, vasi e scheletro. L'elenco, con il modello e le doppie pagine di ciascuno, è in
`docs/PIANO.md`.

I modelli usano mesh anatomiche reali (BodyParts3D e Z-Anatomy); ciò che le due fonti non
contengono (nuclei, fasci, alcuni nervi e gangli) è ricostruito a mano dentro l'anatomia
reale. In testa a ogni file in `src/models/` c'è l'elenco di ciò che è reale, di ciò che è
ricostruito e delle fonti lette.

## Sviluppo

```bash
npm install
npm run dev
```

`npm run build` produce il sito statico in `dist/`. Ogni push su `master` lo
pubblica su GitHub Pages (`.github/workflows/deploy.yml`).

## Struttura

- `src/chapters/` — un file per capitolo: testi, termini collegati, quiz e comportamento di ogni doppia pagina.
- `src/models/` — un modello 3D per capitolo (`src/brain.js` è l'encefalo condiviso da tre capitoli).
- `meshes/` — manifesti delle mesh reali; `tools/mesh.mjs` ne ricava i file in `public/meshes/`.
- `src/model.js` — modello anatomico generico: parti con un nome da mostrare, accendere, spegnere, dilatare; vie orientate.
- `src/spread.js`, `src/modes.js`, `src/ui.js` — doppia pagina, comportamenti della pagina destra, testo e pulsanti come geometria.
- `src/book.js`, `src/main.js` — il libro, lo sfoglio, la scena, la navigazione.
- `docs/AUTHORING.md` — come aggiungere un capitolo; `tools/shot.mjs` — screenshot di verifica.

## Crediti

- Mesh anatomiche: **BodyParts3D**, © The Database Center for Life Science, licenza
  [CC Attribution 4.0 International](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html).
  I file in `public/meshes/` sono derivati da BodyParts3D 4.0 con `tools/mesh.mjs`
  (cambio di terna, suddivisione in parti, quantizzazione).
- Dove indicato da `"source": "zanatomy"` nel manifesto, le mesh derivano da
  **Z-Anatomy**, the libre 3D atlas of anatomy, licenza
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), a sua volta derivato da
  BodyParts3D; quei file `public/meshes/*.glb` sono distribuiti con la stessa licenza.
- Font: Noto Serif (SIL Open Font License).
