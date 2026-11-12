# Come aggiungere un capitolo

Un capitolo è fatto **solo di file nuovi**: nessun file esistente va modificato.

- `src/chapters/<id>.js` — testi, termini, quiz e comportamento di ogni doppia pagina.
  Entra nel libro da solo (la cartella è letta con `import.meta.glob`).
- `src/models/<id>.js` — il modello 3D del capitolo, una classe che estende `AnatomyModel`.
- `meshes/<id>.json` — il manifesto delle mesh anatomiche reali usate dal modello;
  `tools/mesh.mjs` ne ricava `public/meshes/<id>.glb` e `public/meshes/<id>.json`.

Esempi completi da leggere prima di cominciare: `src/chapters/ventricles.js` con
`src/brain.js` e `meshes/brain.json` (mesh reali, parti schematiche aggiunte, vie) e
`src/chapters/cerebellum.js` con `src/cerebellum.js` (corteccia in trasparenza, vie a passi).

## Realismo: prima le mesh reali, poi la letteratura

I modelli devono essere **anatomicamente realistici**, non schemi.

1. **Ogni struttura che esiste come mesh reale si prende da lì.** Ci sono due fonti,
   ciascuna con il proprio elenco `index.tsv` (nome, file, vertici, ingombro in mm):
   - `$SOURCES/bodyparts3d` — **BodyParts3D 4.0** (CC BY 4.0): encefalo e strutture
     profonde, giri corticali, tronco, cervelletto, ossa, muscoli, arterie e vene, occhio
     con muscoli e nervi dell'orbita. Niente midollo, nervi periferici, orecchio.
   - `$SOURCES/zanatomy` — **Z-Anatomy** (CC BY-SA 4.0, derivato da BodyParts3D e
     completato): in più nervi cranici e periferici, plessi, midollo spinale, orecchio
     (ossicini, coclea, membrana timpanica), seni venosi, e ancora ossa, muscoli, vasi,
     encefalo. I nomi finiscono in `.l` / `.r` per i due lati; l'ultima colonna
     dell'indice elenca le collezioni a cui l'oggetto appartiene (utile per cercare
     "tutto ciò che è innervato dal nervo mediano"). Ignorare gli oggetti con pochi vertici.

   Le due fonti hanno **terne diverse** e non si sovrappongono: un modello usa una sola
   fonte (`"source"` nel manifesto). Per i capitoli su nervi, plessi, midollo e orecchio
   usare Z-Anatomy per tutto, ossa e muscoli compresi. Cercare sempre con `grep -i`
   prima di disegnare qualcosa a mano.
2. **Ciò che manca in entrambe** (nuclei del tronco, fasci, lamine, singoli nuclei
   ipotalamici) si modella a mano **dentro l'anatomia reale**: stessa terna di
   riferimento, agganciato a punti di repere veri (un forame del cranio, un solco, il
   centro di un nucleo reale), con forma, calibro, decorso e rapporti
   **verificati su fonti autorevoli**.
3. **Fonti**: cercare in rete atlanti e articoli ad accesso aperto (per esempio Gray's
   Anatomy 20ª ed. di pubblico dominio, StatPearls/NCBI Bookshelf, articoli di anatomia su
   PMC, Radiopaedia, atlanti stereotassici) e usarli per misure, posizioni e rapporti.
   Le figure si usano come **riferimento**, non si copiano: il modello è una ricostruzione
   propria. Annotare nel file del modello, in un commento in testa, le fonti usate per
   ogni struttura modellata a mano (titolo e indirizzo).
4. Nel resoconto finale dire chiaramente **quali parti sono mesh reali e quali
   ricostruite a mano**, e con quale fonte.

### Note pratiche su Z-Anatomy (dai primi capitoli)

- **Terna**: `.r` finisce a x > 0 senza interventi. La testa sta a z 1496-1707 mm
  (esempio: origine `[0, 0, 1485]`, scala 0.0034 per l'intera testa).
- **I nervi sono tubi** (sezione a 36 vertici, raggio 0,4-1,7 mm), spesso più tubi
  scollegati in un solo oggetto. Prima di scrivere le regole di `split` conviene estrarre
  componenti connesse e linea d'asse; le regole vanno limitate in tutte e tre le
  coordinate, altrimenti catturano rami lontani.
- **Ci sono**: nuclei dei nervi cranici nel tronco (circa 386 vertici l'uno), ossicini,
  chiocciola, «Vestibule» con i canali semicircolari, ghiandole, muscoli mimici.
- **Mancano**: gangli (genicolato, sfeno-palatino, sottomandibolare, trigeminale), muscoli
  dell'orecchio medio, nervo intermedio, plesso cervicale e nervo frenico. Il padiglione è in
  una ventina di frammenti che però combaciano (vedi `src/models/orecchio-esterno.js`); la
  cute esiste come «… region».
- **Reperi utili**: la carotide interna reale per canale carotico e foro lacero.
- **Peso**: ossa e muscoli sono leggeri; un cranio intero con una sessantina di oggetti
  sta sotto 2 MB con `simplify` 0.5.
- **Controllare sempre i livelli delle radici** contro i fori intervertebrali dello
  scheletro: nel plesso lombare di Z-Anatomy femorale e otturatorio nascono un livello
  troppo in alto. I tratti sbagliati si tagliano con `split` e si ricostruiscono.
- **Calibro dei nervi**: i tubi hanno 0,5-1 mm di raggio, invisibili a scala del tronco;
  si possono ingrossare lungo le normali nel modello (vedi `src/models/plesso-lombare.js`),
  conservando il decorso reale.
- Esistono varianti `.ol`/`.or`/`.el`/`.er` (origini e inserzioni dei muscoli): non sono
  `.l`/`.r`. Non esiste un «nervo sottocostale».
- **Primi piani**: finché il motore non offre uno zoom centrato su un punto, si può
  spostare e scalare `this.inner` con un metodo del modello (vedi `focus()` in
  `src/models/nervo-faciale.js`), ripristinando tutto in `reset()`.

### Dal manifesto al file di mesh

```bash
export SOURCES=/home/gianmaria/Documents/Personal/meds/sources
grep -i "sphenoid" $SOURCES/bodyparts3d/index.tsv | cut -f1,2,3
grep -i "median nerve" $SOURCES/zanatomy/index.tsv | cut -f1,3,4
node tools/mesh.mjs meshes/<id>.json          # scrive public/meshes/<id>.glb e .json
```

`meshes/<id>.json` (vedi `meshes/brain.json` e i commenti in testa a `tools/mesh.mjs`):

- `source`: `"bodyparts3d"` (predefinito) o `"zanatomy"`.
- `frame`: `{ "origin": [x, y, z] in mm, "scale": unità per mm }`. Le sorgenti hanno x verso
  sinistra, y verso dietro, z verso l'alto (testa attorno a z = 1450-1650); il risultato ha
  x destra, y alto, z avanti. Scegliere origine e scala in modo che il modello stia in
  circa x ±0.45, y 0.05…0.8, z ±0.4.
- `parts`: `{ idParte: ["English name", …] }` con i nomi di `index.tsv`.
- `split`: divide una mesh in più parti secondo la posizione dei triangoli
  (es. testa, corpo e coda del caudato).
- `simplify`: frazione di triangoli da tenere. Il `.glb` di un capitolo deve restare
  **sotto 3 MB**: semplificare o rinunciare a ciò che è solo contorno.

`public/meshes/<id>.json` riporta centro e ingombro di ogni parte nelle coordinate del
modello: serve per posizionare le parti ricostruite a mano e le vie.

Nel modello:

```js
constructor() {
  super({ tilt: -0.5 });
  this.addStand({ radius: 0.2, z: 0, rod: [0, 0.02, 0.1, 0] });
  this.ready = this.#build();           // il libro aspetta `ready` prima di mostrare la pagina
}
async #build() {
  await this.loadMeshes('<id>.glb', {
    sphenoid: ['osso sfenoide', 0xe9dfc8],
    skull: ['cranio', 0xe9dfc8, { ghost: true, opacity: 0.12 }],
  });
  // poi le parti ricostruite a mano e le vie, usando this.parts.get(id).center
}
```

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

- **Lati**: il motore ribalta il modello a schermo (`this.mirror`), così visto di fronte la
  destra del paziente sta a sinistra di chi guarda, come nel vero: **non compensare a mano**.
  Etichette e scritte proprie vanno aggiunte a `this.overlay` (fuori dal ribaltamento), non a
  `this.inner`, altrimenti escono speculari. Una copia speculare di una geometria va creata
  prima di `addPart`, che la ricentra.
- **Angoli di vista**: con il modello ribaltato `main.js` cambia segno a `yaw`; le viste
  laterali vanno trovate per tentativi con uno scatto.
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
export SOURCES=/home/gianmaria/Documents/Personal/meds/sources
npx vite --port <PORTA> --strictPort &                                          # una porta propria
node tools/shot.mjs "http://localhost:<PORTA>/#<id>/1" /tmp/<id>-1.png
node tools/shot.mjs "http://localhost:<PORTA>/#<id>/3" /tmp/<id>-3.png click:"Etichetta del pulsante" wait:6000
npx vite build --outDir /tmp/<id>-dist                                          # deve riuscire
```

Guardare ogni immagine: il testo non deve uscire dalla pagina né sovrapporsi ai pulsanti in
fondo, il modello deve essere leggibile e stare sulla pagina destra, i pulsanti devono fare
ciò che dicono. Con modelli pesanti o macchina carica mettere `wait:12000` prima dei `click:`. Lo scatto richiede circa 15 secondi: fare pochi scatti mirati (una per
pagina, più le interazioni principali). Alla fine fermare il server avviato.
