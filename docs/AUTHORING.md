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
- **Primi piani**: usare lo zoom del motore (vedi «Primi piani» più sotto). I capitoli
  scritti prima hanno un proprio `focus()`/`setFocus()` nel modello: non imitarli.

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
- Quiz: 4 opzioni, una corretta, `explain` di una frase. Con `why` si spiega anche perché
  ciascuna opzione sbagliata non va (una frase breve, `null` per quella giusta): compare a
  chi la sceglie, al posto del generico «riprova».
- **Previsione** (`predict: true`): la domanda chiede che cosa succederà, prima di
  guardarlo. Chi legge sceglie (una spunta, che può cambiare), il modello avvia l'opzione
  `reveal` del comportamento della pagina destra, poi un'aletta «Perché?» si solleva e
  scopre l'esito, il `why` della scelta e `explain`; la risposta giusta diventa verde.
  Va bene per lesioni, riflessi, vie da seguire: domande con un esito che il modello
  mostra. L'aletta occupa spazio: tenere il testo sotto le 90 parole, la domanda corta
  e i `why` di una riga. Se la pagina non basta, la console lo segnala con
  `[pagina] <capitolo>/<n>: la domanda esce dal fondo`.
- **Indica sul modello** (`point: ['idParte', …]`, senza `options`): la risposta è una
  struttura da toccare sul modello. Ogni tocco sbagliato dice che cosa si è indicato (il
  nome della parte) e, se c'è, `why[idParte]`; dopo tre tentativi la risposta si accende.
  Il clic arriva anche al comportamento della pagina destra, quindi un `pick` mostra
  l'informazione della parte toccata. Le parti indicate devono essere solide (non `ghost`),
  visibili nella pagina e abbastanza grandi da colpire: niente solchi o fili sottili.
- **Etichette da trascinare** (`tags: [{ label, ids }]`, senza `options`): cartellini da
  portare sulle strutture del modello. Al posto giusto il cartellino prende la spunta e un
  cordino rosso lo lega al punto in cui è stato lasciato; altrove la pagina dice che cosa
  c'è lì e di quale cartellino è il posto. 3-5 etichette, strutture grandi e ben separate.
  `explain` compare quando sono tutte a posto.

- **Taglia e prevedi** (`cut: { board }`, senza `options`, con il comportamento `cutter` nella
  pagina destra): chi legge taglia la via toccandola **in un punto qualsiasi** del suo decorso,
  poi **dichiara con un gesto** il deficit che prevede, poi tocca «Confronta». Solo allora il
  modello mostra l'esito vero (vie spente, parti scure, etichette) e la tavola segna che cosa
  coincide (spunta verde), che cosa mancava (cerchio blu) e che cosa era di troppo (croce rossa),
  ripetuto in parole sotto «Confronta». Un nuovo taglio ricomincia da capo; «Ricuci la via»
  toglie il taglio. La domanda è risolta con una previsione esatta o dopo tre confronti.
  Le tavole (`board`):
  - `'campo'`: i due dischi del campo visivo, come lo vede il paziente; si toccano i quadranti
    persi (vedi `src/chapters/sistema-visivo.js`, pagina 4);
  - `'corpo'`: una sagoma vista di fronte per ogni tipo di perdita, `kinds: [{ key, label, color }]`;
    si colora la metà destra o sinistra (vedi `src/chapters/sistemi-ascendenti.js`, pagina 5);
  - `'modello'`: si toccano sul modello le parti che si prevedono colpite; qui resta l'elenco
    (vedi `src/chapters/sistema-vascolare.js`, pagina 4, e `plesso-brachiale.js`, pagina 5).

  Facoltativi: `hint` (l'invito prima del taglio), `done` («Taglio», «Chiusa»), `again`,
  `legend` (tavola `'modello'`). La tavola occupa più di una previsione con l'aletta: tenere il
  testo sotto le 90 parole e il titolo su una riga, e guardare la console. La riga di stato
  («Chiusa: …») e l'elenco della tavola `'modello'` («Segnati: …») vanno a capo secondo il
  testo: ciò che sta sotto si sposta da sé (due righe sono sempre riservate).

- **Domanda già risolta.** Tornando su una pagina la cui domanda è risolta (nelle scoperte, vedi
  sotto), la domanda si apre risolta: la risposta giusta in verde, l'aletta sollevata con la
  previsione di allora (e il modello che la mostra), la struttura indicata, i cartellini al loro
  posto con il cordino, il taglio rifatto e confrontato con la previsione di allora. In alto a
  destra compare «rifai», scritto a mano: riporta la domanda da capo e rimette a posto il modello
  (la spunta nel riepilogo resta). Non serve nulla nel capitolo: `onSolved(esito)` di `quiz`
  salva ciò che basta per ridisegnarla.

### Il riepilogo «Da scoprire»

Il motore aggiunge in fondo a ogni capitolo una doppia pagina di riepilogo, senza modello,
all'indirizzo `#<id>/<n+1>` (con `n` doppie pagine: gli indirizzi delle pagine non cambiano).
Non si scrive nulla a mano: è costruita da `buildSummary` in `src/spread.js` con ciò che il
capitolo ha già.

- **Sinistra**: una voce per doppia pagina, con il titolo e la domanda. La casella prende la
  spunta rossa quando la domanda è risolta: risposta giusta, previsione verificata sotto
  l'aletta, struttura indicata (anche dopo i tre tentativi), tutte le etichette al loro posto,
  previsione di un taglio esatta (o tre confronti).
- **Destra**: per ogni figura i comandi della pagina del modello (pulsanti e corde), quelli
  provati in rosso e sottolineati a penna, con il conto «2 di 5». I comandi di una pagina si
  conoscono dopo averla aperta almeno una volta.
- Ogni voce si tocca per tornare a quella pagina. Nell'indice, accanto a ogni capitolo
  cominciato, c'è «2/5» (domande risolte) in rosso, o la spunta a capitolo finito; toccarlo
  apre il riepilogo.
- Lo stato sta in `localStorage` (`semeion:scoperte`), con ogni accesso in try/catch: senza
  storage il libro ricorda le scoperte solo finché la pagina resta aperta. Per ogni pagina:
  `q` (risolta), `a` (l'esito con cui è stata risolta), `all` (i comandi), `seen` (quelli provati).
- **Azzerare**: nell'indice, sotto il conto delle domande, «Azzera l'avanzamento di tutto il
  libro»; nel riepilogo di un capitolo, sotto il conto, «Azzera questo capitolo». Il primo
  tocco chiede conferma («Tocca di nuovo…: non si torna indietro»), il secondo, entro cinque
  secondi, cancella domande risolte e comandi provati e ridisegna la pagina (`ctx.refresh()`).
  L'elenco dei comandi di ogni pagina resta.

Nei comportamenti della pagina destra non serve nulla di speciale: `chipsInto` e `cordInto`
annotano da sé i loro comandi e ogni volta che chi legge li usa; `selector` conta anche le
opzioni scelte toccando il modello (`pick`) e quella avviata da una previsione. Un pulsante che
rimette solo a posto (per esempio «Ricuci il plesso») si esclude con `explore: false` nella sua
descrizione. Un comportamento su misura che sceglie un'opzione toccando il modello (il suo
`model.onClick`, un `pick` proprio) o con la `choose(i)` di una previsione la conta con
`picked(controls, etichetta)` di `src/modes.js`, con l'etichetta del pulsante corrispondente
(vedi `gazeSelector` in `nervi-oculomotori.js`, `earMode` in `orecchio-medio.js`). Per una
scoperta che non passa da un pulsante o da una corda si usa `explore(controls)`:
`offer('etichetta')` mentre costruisce i controlli (la mette nell'elenco), `found('etichetta')`
quando chi legge la scopre.

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
    // oppure una previsione, verificata dall'opzione 2 della pagina destra:
    // quiz: { predict: true, question: '…?', options: […], correct: 1, why: ['…', null, '…', '…'], explain: '…', reveal: 2 },
    // oppure da indicare sul modello: quiz: { question: 'Indica …', point: ['idParte'], why: { altraParte: '…' }, explain: '…' },
    // oppure etichette da trascinare: quiz: { question: 'Porta …', tags: [{ label: 'elice', ids: ['helix'] }, …], explain: '…' },
    // oppure taglia e prevedi, con mode: cutter({ … }): quiz: { question: 'Taglia la via …', cut: { board: 'campo' }, explain: '…' },
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
- `cord`: una corda da tirare sotto i pulsanti, per una quantità continua (vedi sotto).
- `act(model)`, in un'opzione o in un passo: un gesto del modello quando l'opzione è scelta
  o il passo comincia (in `src/chapters/riflessi.js`, pagina 2: il colpo del martelletto
  e l'estensione della gamba).
- Oltre a `choose(i)`, `selector` ritorna `say(testo)`, che scrive nella riga di commento:
  serve a un comportamento che lo avvolge (vedi `strikeMode` in `riflessi.js`).

### Corde e cursori: comandi continui

Quando la pagina parla di una quantità che cresce o cala (una pressione, una forza, l'altezza
di un suono), al posto di due o tre pulsanti «poco / tanto» si può dare a chi legge una
**corda**: una corda rossa tesa tra due pioli, con un manico chiaro a forma d'osso da
afferrare e far scorrere; toccando la corda in un punto il manico salta lì. Il modello
risponde a ogni movimento. È geometria della pagina come i pulsanti, quindi funziona con
il mouse, al tocco e in VR; trascinarla non fa ruotare il modello.

```js
mode: selector({
  base: […], options: […],
  cord: {
    label: 'CONTRAZIONE DEL QUADRICIPITE',   // titoletto in maiuscoletto rosso
    ends: ['riposo', 'massima'],             // le due estremità, accanto ai pioli
    min: 0, max: 1, value: 0,                // intervallo e valore iniziale (rest: riposo, predefinito value)
    spring: true,                            // lasciata, torna da sola a riposo
    marks: [{ at: 0.82, label: 'soglia' }],  // tacche facoltative
    format: (v) => '…',                      // lettura accanto al titoletto, facoltativa
    react(v, prima) {                        // valore -> opzione statica, come quelle di `options`
      if (v < 0.82) return { lit: ['rectus'], activity: { rectus: 1 }, info: '…' };
      return { release: true, focus: FOCUS.plate, links: ['cIb', 'cIbMn'], info: '…' };
    },
  },
}),
```

- `react` riceve il valore e il risultato precedente (`prima`, per ricordare uno stato, per
  esempio un riflesso già scattato) e ritorna un'opzione statica (`lit`, `show`, `links`,
  `info`, `activity`, `dead`, `scale`, `labels`, `focus`) che prende il posto di quella
  scelta: i pulsanti si spengono. Il modello cambia solo quando cambia il risultato.
  `release: true` strappa la corda di mano e la riporta a riposo (un muscolo che cede).
- In `selector` scegliere un pulsante (anche con la `choose(i)` di una previsione) riporta la corda a riposo.
- Esempi: `src/chapters/riflessi.js` (organo del Golgi, corda a molla con soglia),
  `src/chapters/orecchio-medio.js` (pressione da -1 a 1 nel comportamento su misura
  `earMode`), `src/chapters/sistema-uditivo.js` (altezza del suono e punto di massima
  risonanza, con `setTone` nel modello).
- Nei comportamenti su misura: `cordInto(controls, y, spec, onChange)` di `src/modes.js`
  mette la corda a quota `y` e ritorna `{ height, value, held, set(v), release(), update() }`;
  `update()` va chiamata a ogni fotogramma dalla `update` del comportamento, `set(v)` muove
  il manico da codice senza chiamare `onChange`. La corda vera e propria è `cord()` in `src/ui.js`.
- Spazio: la corda è alta circa 0,1 pagine. Con la corda tenere i pulsanti su una riga e
  il commento sotto le due righe, altrimenti tocca la didascalia.

### «Taglia qui»: `cutter`

Il comportamento della pagina destra per le lesioni da ragionare, insieme alla domanda `cut`
(vedi sopra). Il taglio è un punto qualsiasi della via: conta il punto più vicino al raggio
del puntatore (entro `tolerance`, unità del modello), anche se davanti c'è altro; dove due vie
si incrociano a schermo vince quella davanti. L'esito resta nascosto fino al confronto; senza
la domanda `cut` si vede subito.

```js
mode: cutter({
  base: […], looks: {…}, idle: 'Nessun taglio: …',
  paths: ['fRT', 'fRN', …],              // vie (addLink) da tagliare lungo il decorso
  // oppure parts: ['mca', 'pica'],      // parti da tagliare (il loro vertice più vicino al raggio)
  tolerance: 0.012,                      // distanza massima tra raggio e via
  radius: 0.011,                         // raggio della lesione: le vie che vi passano si interrompono
  // lesion: (punto, vie) => Set,        // al posto di `radius` (es. emisezione del midollo)
  outcome: (taglio, model) => ({         // taglio: { point, path | part, hits }
    label: 'tratto ottico destro',       // dove, nella frase «Taglio: …»
    site: 'Tratto ottico',               // la scoperta (una di `sites`)
    truth: ['R:L:S', …],                 // le chiavi del deficit vero, quelle della tavola
    dead: […], links: […], labels: {…},  // facoltativi: ciò che il modello mostra nel confronto
    info: 'Emianopsia omonima sinistra…',
    ring: { at, normal, r },             // facoltativo: dove disegnare l'anello del taglio
  }),                                    // oppure null / { reason: '…' } se lì non si taglia
  sites: ['Nervo ottico', 'Chiasma', …], // il riepilogo le elenca; si spuntano al confronto
  marks: [['capsule', 'putamen'], […]],  // tavola 'modello': parti da toccare, a gruppi di precedenza
  onReveal: (model, esito) => …,         // facoltativo, per esempio model.setFields(esito.truth)
  reset: 'Ricuci la via', miss: 'Qui non passa la via…',
}),
```

- Le chiavi di `truth` sono quelle della tavola: `'occhio:metà:quadrante'` per `'campo'`,
  `'lato:tipo'` (lato del paziente) per `'corpo'`, id di parti per `'modello'`.
- Mentre si segna sulla tavola `'modello'`, i tocchi sul modello segnano e non tagliano:
  per tagliare altrove si ricuce. Il primo gruppo di `marks` che il raggio attraversa vince:
  mettere prima le parti profonde (capsula, putamen), poi gli involucri.
- Anche un tocco che non prende nessuna parte arriva al modello (`model.onMiss(raggio)`): la via
  può passare dentro un involucro trasparente.
- Il segno del taglio è `model.markCut(punto, normale, raggio)`, che `reset()` toglie;
  `model.nearestPart(punto, ids)` dice in quale parte cade un punto.
- Un comportamento su misura può usare la stessa domanda: riceve `quiz` fra gli argomenti,
  chiama `quiz.cut({ label, truth, at })` (o `quiz.cut(null)`), legge `quiz.state` (`'idle'`,
  `'mark'`, `'shown'`) e `quiz.marks`, chiama `quiz.toggle(id)` per la tavola `'modello'`, e
  ritorna `reveal()`, che la domanda chiama al confronto (vedi `lesionMode` in
  `src/chapters/plesso-brachiale.js`).
- Per rifare il taglio alla prossima visita (domanda già risolta): `at` è un oggetto da salvare
  in JSON che descrive il taglio, e il comportamento ritorna anche `replay(at)`, che lo rifà e
  ritorna `true` (o `false` se non è più valido; allora la domanda ridisegna solo la tavola).
  `cutter` lo fa da sé (`at` = punto, normale, via o parte); `lesionMode` salva `{ id, t }`.

### Primi piani

Il motore ingrandisce il modello attorno a un suo punto e lo porta sopra il centro della
base; ciò che esce dal volume sopra la pagina destra (sotto la pagina, oltre la piega e i
bordi, sopra i pulsanti, e ciò che a schermo supererebbe il bordo alto del libro) viene tagliato.

- Per tutta la pagina: `view: { focus: { at: 'idParte', scale: 2 } }`.
- Per un'opzione o per un passo di `selector`: `focus: { at: [x, y, z], scale: 3 }`
  (`focus: null` torna all'insieme anche se la pagina ha un primo piano).
- `at` è l'id di una parte (il suo centro) o un punto nelle coordinate del modello;
  `height` sposta la quota a cui il punto viene portato (predefinita 0.36); `clip: false`
  toglie il ritaglio; `tilt` cambia l'inclinazione del modello per quella vista (radianti);
  `stand: false` nasconde la base di legno (l'asta sparisce sempre nei primi piani).
- La rotazione resta quella della pagina (`view.yaw`).
- Materiali creati fuori da `addPart`/`addLink` non sono ritagliati: assegnare loro
  `material.clippingPlanes = this.clipPlanes` (un `material.clone()` copia i piani per
  valore: va riassegnato).
- Il ritaglio in alto dipende dall'inclinazione del modello: dopo aver scelto `scale` e
  `height` verificare con uno scatto che la struttura di cui si parla non sia amputata.
- Da codice: `model.zoomTo({ at, scale })`, `model.zoomTo(null)`.

Massimo 7 pulsanti (due righe) e commenti di una o due righe: lo spazio sotto il modello è poco.

### Comportamenti su misura

Se `selector` non basta, `mode` può essere una funzione propria:

```js
async function mioModo({ model, controls, def, quiz }) {
  // costruire i controlli con chipsInto / infoText di src/modes.js
  return {
    enter() { /* stato iniziale: model.show([...]), model.lookFn = (part) => ({ … }) */ },
    update() { /* a ogni fotogramma, facoltativo */ },
    onHoverSet(ids) { /* facoltativo: parti indicate dal testo */ },
    choose(i) { /* facoltativo: attiva l'opzione i; serve al `reveal` di una previsione */ },
  };
}
```

Per una quantità continua usare `cordInto` (vedi «Corde e cursori»).

### Oggetti da trascinare sul modello

Un oggetto del modello (una mesh in `this.inner`) si fa trascinare dandogli
`userData.ui = { id, tip, cursor: 'grab', grab: { start(raggio), move(raggio), end(sotto) } }`:
`src/main.js` lo afferra al posto di ruotare il modello e gli passa il raggio del puntatore
(nel mondo: portarlo nel modello con l'inversa di `this.inner.matrixWorld` e intersecarlo con
un piano); `end(sotto)` riceve una funzione che dice che cosa c'è sotto il puntatore (nascondere
prima l'oggetto stesso). Funziona con il mouse e al tocco; rotazione e clic restano quelli di sempre.
Per prenderlo bene anche con un dito, la presa può essere una mesh invisibile più grande
(`MeshBasicMaterial({ colorWrite: false, depthWrite: false })`), nascosta (`visible = false`)
nelle pagine che non la usano e in `reset()`. Esempi:
- la mosca di `src/models/nervi-oculomotori.js` (`#fly`, `onFly`, `gazeAt`): gli occhi la
  seguono, il comportamento `gazeSelector` del capitolo accende i muscoli che lavorano;
- il martelletto di `src/models/riflessi.js` (`setHammer({ onStrike, onMiss })`): al contatto con
  il legamento rotuleo il riflesso parte, lasciato altrove la pagina dice che cosa si è colpito.
- i cavi del plesso brachiale (`setCables({ from, to, drop })` in `src/models/plesso-brachiale.js`,
  pagina «Tronchi primari e secondari»): si afferra una parte `from` (la presa è un tubo invisibile
  attorno al suo asse) e si tende un cavo rosso che si aggancia alla parte `to` più vicina al raggio;
  `drop(da, a)` dice se il collegamento è giusto, altrimenti il cavo torna indietro. Il capitolo
  ne fa un rompicapo a tappe (`fibresMode`) che a plesso completo fa correre gli impulsi delle fibre.

Il trascinamento che fa ruotare il modello può anche diventare un gesto della pagina: il modello
legge `this.yaw` nella propria `update`, ne prende la variazione e lo rimette alla vista della
pagina. Così in `src/models/orecchio-interno.js` (`setTurn`, pagina «Canali accoppiati») trascinare
gira la testa attorno alla propria verticale e la velocità di rotazione muove endolinfa e cupole.

Un tocco su una parte arriva a `model.onClick(id, hit)` con `hit.point` (nel mondo) e `hit.face`:
`src/chapters/nervo-trigemino.js`, pagina 4, lo usa per piantare uno spillo nel punto toccato
(`model.pin`) e chiedere di quale branca è.

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
- **Etichette** (`setLabels`, `labels` delle opzioni): se a schermo due etichette si
  coprirebbero, la più alta sale sopra l'altra e una linea di richiamo sottile la lega alla sua
  parte (`#unstackLabels` in `src/model.js`). Non serve sfalsarle a mano.
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
