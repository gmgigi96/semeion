# Semeion

Libro digitale interattivo di medicina: ogni doppia pagina tratta una sola idea,
con il testo a sinistra e un modello anatomico 3D "in piedi" sulla pagina a destra.
Testo, pulsanti e quiz sono geometria nella scena (niente DOM sovrapposto), così
il libro si può portare in VR.

Capitoli (neuroanatomia), ricavati dagli appunti:

1. **Plesso brachiale** — origine, tronchi, rapporti, rami terminali, lesioni.
2. **Ventricoli cerebrali** — le quattro cavità, il ventricolo laterale, il viaggio del liquor, l'idrocefalo.
3. **Nuclei della base** — i nuclei, i canali, vie diretta/indiretta/iperdiretta, Parkinson e Huntington.
4. **Sistema limbico** — lobo limbico, ippocampo e fornice, circuito di Papez, amigdala e via mesolimbica.

## Sviluppo

```bash
npm install
npm run dev
```

`npm run build` produce il sito statico in `dist/`. Ogni push su `master` lo
pubblica su GitHub Pages (`.github/workflows/deploy.yml`).

## Struttura

- `src/chapters/` — un file per capitolo: testi, termini collegati, quiz e comportamento di ogni doppia pagina.
- `src/spread.js` — costruisce una doppia pagina (e l'indice) a partire dalla sua descrizione.
- `src/modes.js` — comportamenti riutilizzabili della pagina destra (scelta di un'opzione, sequenze a passi).
- `src/model.js` — modello anatomico generico: parti con un nome da mostrare, accendere, spegnere, dilatare; vie orientate.
- `src/brain.js` — encefalo trasparente con ventricoli, nuclei della base e sistema limbico (usa `src/geo.js`).
- `src/plexus.js` — plesso brachiale: un grafo radici → tronchi → divisioni → corde → nervi.
- `src/ui.js` — testo, termini evidenziati, pulsanti e quiz come geometria di pagina.
- `src/book.js` — il libro, le pagine, lo sfoglio.
- `src/main.js` — scena, camera, puntatore, navigazione tra capitoli.

Per aggiungere un capitolo: un nuovo file in `src/chapters/` registrato in `index.js`;
se serve un modello nuovo, le sue parti si aggiungono a `brain.js` o a una nuova
classe che estende `AnatomyModel`.

Font: Noto Serif (SIL Open Font License).
