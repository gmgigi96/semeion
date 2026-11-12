# Come aggiungere un capitolo

Un capitolo è fatto di **due soli file nuovi**: nessun file esistente va modificato.

- `src/chapters/<id>.js` — testi, termini, quiz e comportamento di ogni doppia pagina.
  Entra nel libro da solo (la cartella è letta con `import.meta.glob`).
- `src/models/<id>.js` — il modello 3D del capitolo, una classe che estende `AnatomyModel`.

Esempi completi da leggere prima di cominciare: `src/chapters/cerebellum.js` con
`src/cerebellum.js` (modello dedicato, corteccia in trasparenza, vie a passi) e
`src/chapters/ventricles.js` con `src/brain.js`.

## La doppia pagina

Ogni doppia pagina tratta **una sola idea**.

- **Sinistra**: titolo, 60-100 parole, alcuni termini evidenziati, una domanda a risposta multipla.
- **Destra**: il modello in piedi sulla pagina, una fila di pulsanti, una didascalia, un'istruzione di una riga.
- **Collegamento**: passando su un termine si accende la struttura nel modello, e viceversa.

Un capitolo ha di norma **4 doppie pagine** (da 3 a 5), che vanno dal "che cos'è e dov'è"
a un'interazione che fa ragionare (una via da seguire, una lesione, un blocco).

### Regole per i testi

- In italiano, **ricavati dagli appunti** del capitolo (`medicina/Neuroanatomia/*.docx`):
  stessi termini, stessi numeri. Non aggiungere nozioni che negli appunti non ci sono;
  se un'interazione ne richiede una (per esempio l'effetto di una lesione), segnalarlo
  nel resoconto finale.
- 60-100 parole per pagina: è un libro da esplorare, non un riassunto degli appunti.
- Non usare frecce o simboli fuori dal latino esteso (`→ ↑ ▲`): il font non li ha.
  Per le sequenze usare `›`.
- Quiz: 4 opzioni, una corretta, `explain` di una frase.

## Il file del capitolo

```js
import { selector } from '../modes.js';
import { MioModello } from '../models/mio-capitolo.js';

const spreads = [
  {
    title: 'Titolo della doppia pagina',
    // {testo visibile|chiave}: la chiave rimanda a `terms`
    body: "Il {nervo frenico|phrenic} nasce da {C3, C4 e C5|roots} …",
    terms: { phrenic: ['phrenic'], roots: ['c3', 'c4', 'c5'] }, // chiave -> id di parti del modello
    quiz: { question: '…?', options: ['…', '…', '…', '…'], correct: 1, explain: '…' },
    caption: 'Didascalia della figura.',
    instruction: 'ISTRUZIONE DI UNA RIGA, IN MAIUSCOLO',
    view: { yaw: 0.3, zoom: 1.15 },      // facoltativo: vista propria di questa pagina
    mode: selector({ … }),                // comportamento della pagina destra
  },
];

export default {
  id: 'mio-capitolo',                    // anche nell'indirizzo: #mio-capitolo/2
  title: 'Titolo nel libro',
  blurb: 'Una riga per l’indice.',
  part: 'Nervi cranici',                 // una delle PARTS in src/chapters/index.js
  order: 41,                             // posizione nel libro (vedi docs/PIANO.md)
  model: 'mio-capitolo',                 // chiave del modello (capitoli con la stessa chiave lo condividono)
  createModel: () => new MioModello(),
  yaw: -0.9,                             // rotazione iniziale del modello (radianti)
  spreads,
};
```

### `selector`: il comportamento standard

`selector({ base, options, looks, pick, initial, idle })` crea una fila di pulsanti;
sceglierne uno accende parti, vie e indicatori.

- `base`: id delle parti visibili nella pagina (le altre sono nascoste; una parte nominata
  da un termine compare comunque al passaggio).
- `looks`: aspetto di base, per esempio `{ cortex: { opacity: 0.16, litOpacity: 0.5 } }`
  per mettere in trasparenza ciò che copre.
- `idle`: commento mostrato quando nessuna opzione è scelta.
- `pick`: `{ idParte: indiceOpzione }` per scegliere cliccando il modello.
- `initial`: indice dell'opzione attiva all'ingresso.
- `options`: ciascuna con `label` e uno dei due stili.
  - **Statico**: `lit` (parti accese, le altre si attenuano), `show` (parti in più da mostrare),
    `links` (vie visibili), `info` (commento), `activity` (`{ id: +1 | -1 }`, cono su o giù),
    `dead` (parti spente, per le lesioni), `scale` (`{ id: 1.3 }`, dilatazione),
    `labels` (`{ id: 'testo' }`, etichette sul modello).
  - **A passi**: `steps: [{ ids, links, activity, text }]` e `stepTime` in secondi; i passi
    si accendono uno dopo l'altro e il commento mostra `k/n · text`.

Massimo 7 pulsanti (due righe) e commenti di una o due righe: lo spazio sotto il modello è poco.

### Comportamenti su misura

Se `selector` non basta, `mode` può essere una funzione propria:

```js
async function mioModo({ model, controls, def }) {
  // costruire i controlli con chipsInto / infoText di src/modes.js
  return {
    enter() { /* stato iniziale: model.show([...]), model.lookFn = (part) => ({ … }) */ },
    update() { /* a ogni fotogramma, facoltativo */ },
    onHoverSet(ids) { /* facoltativo: parti indicate dal testo */ },
  };
}
```

`src/chapters/brachial.js` contiene esempi (taglio in un punto, percorso a ritroso).

## Il modello

```js
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror, both, arc } from '../geo.js';

export class MioModello extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });                                   // reclinato verso chi legge
    this.addStand({ radius: 0.2, z: 0, rod: [0, 0.02, 0.2, 0] }); // base e asta [x, y0, y1, z]
    this.addPart('id', 'nome mostrato al passaggio', 0xc9485b, [geometria, …], opzioni);
    this.addLink('a-b', [V(…), V(…), V(…)], { color: 0x1f9d57, inhibit: false });
  }
}
```

- **Coordinate**: x laterale (destra del paziente +), y verso l'alto, z anteriore. Unità libere,
  ma il modello deve stare in circa **x ±0.45, y 0…0.8, z ±0.35**, appoggiato sulla base a y = 0.
- **`addPart(id, nome, colore, geometrie, opzioni)`**: una parte ha un nome e una o più
  geometrie (di solito i due lati, con `both(g)`). Opzioni: `ghost: true` per un involucro
  trasparente di contesto che non intercetta il puntatore; `opacity`; `double: true` per
  superfici aperte.
- **`addLink(id, punti, { color, inhibit })`**: una via orientata con un impulso che la percorre;
  finisce a freccia, o a barra se `inhibit`. Colori usati finora: verde `0x1f9d57` eccitatoria,
  rosso `0xd43d3d` inibitoria, viola `0x7a4fd0` dopaminergica, blu `0x2f6fe0` neurosecrezione.
- **Geometria** (`src/geo.js`):
  - `taperTube(punti, raggi, { flat, caps, seg, radial })`: tubo lungo una curva, a raggio
    variabile; adatto a nervi, fasci, vasi, giri, corni.
  - `ellipsoid(centro, raggi, rotazione)`: nuclei e masse.
  - `both(g)`: la geometria e la sua copia speculare; `mirror(g)`: solo la copia.
  - Per superfici particolari si può costruire una `BufferGeometry` propria
    (vedi `patch` in `src/cerebellum.js`) o deformare i vertici di una sfera.
- **Stile**: modello didattico in resina. Colori pieni e distinguibili, un colore per
  struttura; bianco avorio per sostanza bianca e ossa; trasparenza solo per il contesto.
  Meglio poche parti ben riconoscibili che molte ammassate: se due strutture si coprono,
  allontanarle o ingrandire il modello piuttosto che rimpicciolire.
- Ogni struttura nominata in un termine del testo deve esistere come parte, con lo stesso id.

## Verifica

Il browser integrato non ha WebGL: si verifica con Chrome headless.

```bash
ln -s /home/gianmaria/Documents/Personal/meds/libro/node_modules node_modules   # in un worktree
npx vite --port <PORTA> --strictPort &                                          # una porta propria
node tools/shot.mjs "http://localhost:<PORTA>/#<id>/1" /tmp/<id>-1.png
node tools/shot.mjs "http://localhost:<PORTA>/#<id>/3" /tmp/<id>-3.png click:"Etichetta del pulsante" wait:6000
npx vite build --outDir /tmp/<id>-dist                                          # deve riuscire
```

Guardare ogni immagine: il testo non deve uscire dalla pagina né sovrapporsi ai pulsanti in
fondo, il modello deve essere leggibile e stare sulla pagina destra, i pulsanti devono fare
ciò che dicono. Lo scatto richiede circa 15 secondi: fare pochi scatti mirati (una per
pagina, più le interazioni principali). Alla fine fermare il server avviato.
