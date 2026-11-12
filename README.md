# Semeion

Libro digitale interattivo di medicina: ogni doppia pagina tratta una sola idea,
con il testo a sinistra e un modello anatomico 3D "in piedi" sulla pagina a destra.
Testo, pulsanti e quiz sono geometria nella scena (niente DOM sovrapposto), così
il libro si può portare in VR.

Primo capitolo: **plesso brachiale** in cinque doppie pagine (origine, tronchi,
rapporti, rami terminali, lesioni).

## Sviluppo

```bash
npm install
npm run dev
```

`npm run build` produce il sito statico in `dist/`. Ogni push su `master` lo
pubblica su GitHub Pages (`.github/workflows/deploy.yml`).

## Struttura

- `src/plexus.js` — modello procedurale del plesso: un grafo radici → tronchi →
  divisioni → corde → nervi, in cui ogni segmento sa quali radici gli portano fibre.
- `src/chapter.js` — testi, termini collegati, quiz e comportamento di ogni doppia pagina.
- `src/ui.js` — testo, termini evidenziati, pulsanti e quiz come geometria di pagina.
- `src/book.js` — il libro, le pagine, lo sfoglio.
- `src/main.js` — scena, camera, puntatore.

Font: Noto Serif (SIL Open Font License).
