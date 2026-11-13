// Modello del plesso brachiale destro: colonna da C3 a T3, prime due coste,
// manubrio, clavicola, scapola, omero fino a metà braccio, scaleni, succlavio,
// piccolo pettorale, arteria succlavia-ascellare-brachiale e plesso dalle
// radici ai nervi terminali.
//
// Il plesso è un grafo di segmenti (radici › tronchi primari › rami di
// divisione › tronchi secondari › nervi): ogni segmento è una parte distinta e
// sa quali radici gli portano fibre. Da qui derivano le fibre di una radice,
// il percorso a ritroso di un nervo e l'effetto di un taglio in un punto.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/plesso-brachiale.glb,
// manifesto in meshes/plesso-brachiale.json): vertebre C3-T3 e dischi, prima e
// seconda costa con le cartilagini, manubrio, clavicola, scapola, omero,
// scaleni anteriore, medio e posteriore, succlavio, piccolo pettorale, arterie
// succlavia, ascellare e brachiale; del plesso: le cinque radici C5-T1
// («Roots of brachial plexus», divise con `split`), i tre tronchi primari,
// cinque rami di divisione su sei, il tronco secondario posteriore, il tronco
// secondario mediale (tratto iniziale dell'oggetto «Ulnar nerve»), i nervi
// radiale, mediano (dal terzo superiore del braccio in giù), muscolocutaneo
// (dal punto in cui lascia il coracobrachiale in giù), ascellare (dal margine
// inferiore del sottoscapolare al collo chirurgico, con i rami muscolari),
// soprascapolare e toracico lungo.
//   - I livelli delle radici sono stati controllati sui fori intervertebrali
//     dello scheletro dello stesso atlante: C5 esce tra C4 e C5, C6 tra C5 e
//     C6, C7 tra C6 e C7, C8 tra C7 e T1, T1 tra T1 e T2. Sono giusti.
//   - I nervi di Z-Anatomy sono tubi di 0,5-1,5 mm di raggio: qui sono
//     ingrossati lungo le normali (`INFLATE`) fino a 1,1-2,5 mm. Il decorso è
//     quello reale, il calibro è una scelta di rappresentazione.
//   - Tutto ciò che scende sotto metà braccio è tagliato su un piano.
//   - Il piccolo pettorale è tagliato poco sotto la metà (le digitazioni costali
//     coprirebbero i pulsanti della pagina). Il ramo di C4 per C5 che Z-Anatomy
//     include tra le radici («c4com» nel file di mesh) non è usato.
//   - Le regole di `split` del manifesto sono piani scritti in millimetri
//     Z-Anatomy e tradotti nelle coordinate del modello.
//
// RICOSTRUITO A MANO, perché in Z-Anatomy manca o è collegato in modo errato
// (punti in millimetri nella terna di Z-Anatomy, agganciati alle estremità dei
// segmenti reali):
//   - ramo posteriore del tronco inferiore: l'oggetto di Z-Anatomy con questo
//     nome finisce nel punto d'origine del tronco secondario laterale; qui va
//     dal tronco inferiore al tronco secondario posteriore;
//   - tronco secondario laterale: non esiste come oggetto; va dalla confluenza
//     reale dei rami anteriori dei tronchi superiore e medio lungo il lato
//     laterale dell'arteria ascellare reale;
//   - radici laterale e mediale del mediano e primo tratto del nervo: in
//     Z-Anatomy il mediano nasce dal tronco secondario posteriore; qui le due
//     radici si uniscono davanti all'arteria ascellare e il nervo raggiunge il
//     tratto reale nel braccio;
//   - primo tratto del muscolocutaneo (dal tronco laterale al tratto reale, che
//     in Z-Anatomy comincia a metà braccio accanto al mediano);
//   - primo tratto dell'ascellare (in Z-Anatomy nasce dal punto d'origine del
//     tronco laterale; qui dal tronco posteriore);
//   - nervo ulnare nel braccio: in Z-Anatomy coincide per lungo tratto con il
//     mediano, lateralmente all'arteria brachiale; qui scende medialmente
//     all'arteria reale;
//   - radici delle varianti prefissata (C4, C6 e C7 spostate di un tronco) e
//     postfissata (C7, C8, T2): partono dai fori intervertebrali reali e
//     raggiungono l'origine reale del tronco di cui prendono il posto; le
//     altre radici delle varianti sono quelle reali.
//
// Fonti lette (tutte voci di Wikipedia in inglese, lette tramite l'API):
//   - «Brachial plexus», https://en.wikipedia.org/wiki/Brachial_plexus
//     (VERIFICATO: radici C5-T1, tronchi superiore C5-C6, medio C7, inferiore
//     C8-T1; sei divisioni; varianti prefissata e postfissata con C4 o T2;
//     toracico lungo da C5, C6, C7)
//   - «Lateral cord», https://en.wikipedia.org/wiki/Lateral_cord
//     (VERIFICATO: divisioni anteriori dei tronchi superiore e medio; laterale
//     all'arteria ascellare; muscolocutaneo e radice laterale del mediano)
//   - «Medial cord», https://en.wikipedia.org/wiki/Medial_cord
//     (VERIFICATO: divisione anteriore del tronco inferiore; mediale
//     all'arteria; ulnare e radice mediale del mediano)
//   - «Posterior cord», https://en.wikipedia.org/wiki/Posterior_cord
//     (VERIFICATO: riceve da tutte le radici)
//   - «Axillary artery», https://en.wikipedia.org/wiki/Axillary_artery
//     (VERIFICATO: i tronchi secondari prendono nome dalla posizione rispetto
//     alla seconda porzione dell'arteria, dietro il piccolo pettorale)
//   - «Median nerve», https://en.wikipedia.org/wiki/Median_nerve
//     (VERIFICATO: dalle due radici; nel braccio dapprima laterale all'arteria
//     brachiale)
//   - «Musculocutaneous nerve», https://en.wikipedia.org/wiki/Musculocutaneous_nerve
//     (VERIFICATO: dal tronco laterale, laterale alla terza porzione
//     dell'arteria ascellare, perfora il coracobrachiale)
//   - «Axillary nerve», https://en.wikipedia.org/wiki/Axillary_nerve
//     (VERIFICATO: dal tronco posteriore, dietro l'arteria ascellare, poi
//     attorno al collo dell'omero nello spazio quadrangolare)
//   - «Ulnar nerve», https://en.wikipedia.org/wiki/Ulnar_nerve
//     (VERIFICATO: dal tronco mediale, scende medialmente all'arteria brachiale)
// STIMATO, non tratto da una fonte: le distanze di pochi millimetri tra i
// cordoni ricostruiti e l'arteria, il punto esatto della forca del mediano e
// quello in cui il muscolocutaneo lascia il tronco laterale, il decorso delle
// radici nelle due varianti (in particolare quello di T2, che non è stato
// modellato sul collo della seconda costa), i calibri, la posizione dei due
// indicatori degli spazi di compressione.
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

// Da millimetri Z-Anatomy (x verso sinistra, y verso dietro, z verso l'alto)
// alle coordinate del modello; stessa terna del manifesto.
const S = 0.0027;
const O = [-100, 25, 1230];
const mm = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const tube = (pts, r, opts) =>
  taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, seg: 28, ...opts });
const ball = (p, r) => {
  const c = mm(...p);
  return ellipsoid([c.x, c.y, c.z], [r * S, r * S, r * S], null, 14);
};
// Dove si appoggiano le etichette (mm): presso il foro per le radici, lungo il
// braccio a quote sfalsate per i nervi.
const LABEL_AT = {
  C5: [-20, 14, 1487], C6: [-21, 16, 1470], C7: [-19, 22, 1456], C8: [-19, 28, 1446.5], T1: [-19, 34, 1434],
  pC4: [-20, 11, 1500], pC6: [-21, 16, 1470], pC7: [-19, 22, 1456], qC7: [-19, 22, 1456], qC8: [-19, 28, 1446.5], qT2: [-19, 40, 1417],
  AX: [-196, 23, 1366], MED: [-171.5, 11, 1318], ULN: [-156, 26, 1293], MCN: [-199, 16.5, 1265], RAD: [-160, 32, 1338],
};
const FLOOR = 0.027; // piano di taglio a metà braccio, sul piano della base

export const ROOTS = ['C5', 'C6', 'C7', 'C8', 'T1'];
export const LEVEL_COLORS = {
  C4: 0xb8862b, C5: 0xe4572e, C6: 0x2aa56b, C7: 0x2f86de, C8: 0x9b5de5, T1: 0xe8478f, T2: 0x1f9aa8,
};
export const NERVE = 0xdcb13a;
export const DIM = 0xa39c88;
export const DEAD = 0x403c38;
export const LIT = 0xffd24d;
export const TERMINALS = ['MCN', 'MED', 'ULN', 'RAD', 'AX'];

// Le tre conformazioni: per ogni posto (radice 1…5 del plesso) la parte che lo
// occupa e il livello da cui esce.
export const VARIANTS = {
  pre: [['pC4', 'C4'], ['C5', 'C5'], ['pC6', 'C6'], ['pC7', 'C7'], ['C8', 'C8']],
  classic: [['C5', 'C5'], ['C6', 'C6'], ['C7', 'C7'], ['C8', 'C8'], ['T1', 'T1']],
  post: [['C6', 'C6'], ['qC7', 'C7'], ['qC8', 'C8'], ['T1', 'T1'], ['qT2', 'T2']],
};

const BONE = 0xe9dfc8, MUSCLE = 0xb9584c;

// Punti di repere del plesso reale (mm Z-Anatomy).
const J_U = [-54, 13, 1453], J_M = [-52, 26, 1442], J_L = [-55, 13, 1436]; // origine dei tronchi primari
const T_U = [-88, 27, 1418], T_M = [-84, 23, 1419], T_L = [-83, 16, 1417]; // dove i tronchi si dividono
const A = [-110.5, 14, 1399], P = [-101, 26, 1399], Q = [-101, 10, 1399]; // origine dei tronchi secondari
const E = [-122, 26, 1379]; // fine del tronco posteriore
const LCE = [-131, 7.5, 1381]; // fine del tronco laterale
const MCE = [-126, 6.5, 1372]; // fine del tronco mediale
const F = [-145, 5, 1361]; // forca del mediano

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  vC3: ['vertebra C3', BONE], vC4: ['vertebra C4', BONE], vC5: ['vertebra C5', BONE], vC6: ['vertebra C6', BONE],
  vC7: ['vertebra C7', BONE], vT1: ['vertebra T1', BONE], vT2: ['vertebra T2', BONE], vT3: ['vertebra T3', BONE],
  discs: ['dischi intervertebrali', 0xbfd0d6],
  rib1: ['prima costa', 0xe3d6b8],
  rib2: ['seconda costa', BONE],
  manubrium: ['manubrio dello sterno', BONE],
  clavicle: ['clavicola', 0xefe4c9],
  scapula: ['scapola', BONE],
  humerus: ['omero', BONE],
  scalA: ['muscolo scaleno anteriore', MUSCLE],
  scalM: ['muscoli scaleni medio e posteriore', 0xa5564b],
  subclavius: ['muscolo succlavio', 0xc67464],
  pecMinor: ['muscolo piccolo pettorale', 0xc0604f],
  artery: ['arteria succlavia, ascellare e brachiale', 0xc2222b],
  C5: ['radice C5', NERVE], C6: ['radice C6', NERVE], C7: ['radice C7', NERVE], C8: ['radice C8', NERVE], T1: ['radice T1', NERVE],
  U: ['tronco primario superiore', NERVE],
  M: ['tronco primario medio', NERVE],
  L: ['tronco primario inferiore', NERVE],
  Ua: ['ramo anteriore del tronco superiore', NERVE],
  Ma: ['ramo anteriore del tronco medio', NERVE],
  La: ['ramo anteriore del tronco inferiore', NERVE],
  Up: ['ramo posteriore del tronco superiore', NERVE],
  Mp: ['ramo posteriore del tronco medio', NERVE],
  PC: ['tronco secondario posteriore', NERVE],
  MC: ['tronco secondario mediale', NERVE],
  MED: ['nervo mediano', NERVE],
  RAD: ['nervo radiale', NERVE],
  AX: ['nervo ascellare', NERVE],
  MCN: ['nervo muscolocutaneo', NERVE],
  SS: ['nervo soprascapolare', NERVE],
  LT: ['nervo toracico lungo', NERVE],
};

// Raggio aggiunto ai tubi di Z-Anatomy, in mm.
const INFLATE = {
  C5: 1.4, C6: 1.4, C7: 1.4, C8: 1.4, T1: 1.4, U: 1.0, M: 1.0, L: 1.0,
  Ua: 0.6, Ma: 0.6, Up: 0.6, La: 0.1, Mp: 0.1, PC: 1.3, MC: 1.2,
  MED: 1.2, RAD: 1.2, AX: 0.8, MCN: 0.8, SS: 0.6, LT: 0.6,
};

// Il grafo. kind: root | trunk | div | cord | nerve; depth: distanza dalle
// radici; from: estremità prossimale (mm), da cui si misura la distanza lungo
// il segmento per il taglio.
const ALL = ROOTS;
const SEGS = [
  { id: 'C5', kind: 'root', roots: ['C5'], parents: [], depth: 0, from: [-13, 16, 1490] },
  { id: 'C6', kind: 'root', roots: ['C6'], parents: [], depth: 0, from: [-17, 17, 1473] },
  { id: 'C7', kind: 'root', roots: ['C7'], parents: [], depth: 0, from: [-15, 23, 1458] },
  { id: 'C8', kind: 'root', roots: ['C8'], parents: [], depth: 0, from: [-14, 29, 1448] },
  { id: 'T1', kind: 'root', roots: ['T1'], parents: [], depth: 0, from: [-14, 35, 1435] },
  { id: 'U', kind: 'trunk', roots: ['C5', 'C6'], parents: ['C5', 'C6'], depth: 1, from: J_U },
  { id: 'M', kind: 'trunk', roots: ['C7'], parents: ['C7'], depth: 1, from: J_M },
  { id: 'L', kind: 'trunk', roots: ['C8', 'T1'], parents: ['C8', 'T1'], depth: 1, from: J_L },
  { id: 'Ua', kind: 'div', roots: ['C5', 'C6'], parents: ['U'], depth: 2, from: T_U },
  { id: 'Ma', kind: 'div', roots: ['C7'], parents: ['M'], depth: 2, from: T_M },
  { id: 'La', kind: 'div', roots: ['C8', 'T1'], parents: ['L'], depth: 2, from: T_L },
  { id: 'Up', kind: 'div', roots: ['C5', 'C6'], parents: ['U'], depth: 2, from: T_U },
  { id: 'Mp', kind: 'div', roots: ['C7'], parents: ['M'], depth: 2, from: T_M },
  { id: 'Lp', kind: 'div', roots: ['C8', 'T1'], parents: ['L'], depth: 2, from: T_L },
  { id: 'LC', kind: 'cord', roots: ['C5', 'C6', 'C7'], parents: ['Ua', 'Ma'], depth: 3, from: A },
  { id: 'PC', kind: 'cord', roots: ALL, parents: ['Up', 'Mp', 'Lp'], depth: 3, from: P },
  { id: 'MC', kind: 'cord', roots: ['C8', 'T1'], parents: ['La'], depth: 3, from: Q },
  { id: 'MCN', kind: 'nerve', short: 'n. muscolocutaneo', roots: ['C5', 'C6', 'C7'], parents: ['LC'], depth: 4, from: LCE },
  { id: 'MedL', kind: 'nerve', roots: ['C5', 'C6', 'C7'], parents: ['LC'], depth: 4, from: LCE },
  { id: 'MedM', kind: 'nerve', roots: ['C8', 'T1'], parents: ['MC'], depth: 4, from: MCE },
  { id: 'MED', kind: 'nerve', short: 'n. mediano', roots: ALL, parents: ['MedL', 'MedM'], depth: 5, from: F },
  { id: 'ULN', kind: 'nerve', short: 'n. ulnare', roots: ['C8', 'T1'], parents: ['MC'], depth: 4, from: MCE },
  { id: 'AX', kind: 'nerve', short: 'n. ascellare', roots: ['C5', 'C6'], parents: ['PC'], depth: 4, from: E },
  { id: 'RAD', kind: 'nerve', short: 'n. radiale', roots: ALL, parents: ['PC'], depth: 4, from: E },
  { id: 'SS', kind: 'nerve', short: 'n. soprascapolare', roots: ['C5', 'C6'], parents: ['U'], depth: 2, from: J_U },
  { id: 'LT', kind: 'nerve', short: 'n. toracico lungo', roots: ['C5', 'C6', 'C7'], parents: ['C5', 'C6', 'C7'], depth: 1, from: [-27, 12, 1482] },
];

export class PlessoBrachiale extends AnatomyModel {
  constructor() {
    super({ tilt: -0.35 });
    this.addStand({ radius: 0.33, z: 0, rod: [-0.27, 0.02, 0.41, -0.02] });
    this.flat.children[0].scale.z = 0.17;
    this.segs = new Map();
    this.cut = null; // { id, t }
    this.ready = this.#build();
  }

  // Le etichette del motore hanno un contorno, quindi due materiali: qui si
  // toglie a entrambi la prova di profondità, così restano davanti al modello.
  setLabels(map) {
    super.setLabels(map);
    for (const t of this.labels.values()) for (const m of [t.material].flat()) m.depthTest = false;
  }

  reset() {
    super.reset();
    this.setCut(null);
  }

  async #build() {
    await this.loadMeshes('plesso-brachiale.glb', REAL);
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d * S);
    for (const id of ['humerus', 'artery', 'MED', 'RAD', 'MCN', 'LT']) this.#clampFloor(this.parts.get(id));
    this.#reconstruct();
    this.#variants();
    this.#ghostOf('clavicle', 'clavicleG', 0.55);
    this.#ghostOf('rib1', 'rib1G', 0.5);
    this.#markers();
    for (const def of SEGS) this.#segment(def);
    for (const [id, p] of Object.entries(LABEL_AT)) {
      const part = this.parts.get(id);
      part.center.copy(mm(...p));
      part.top = part.center.y - 0.006;
    }
  }

  // Ingrossa un tubo spostando ogni vertice lungo la sua normale.
  #inflate(id, d) {
    for (const m of this.parts.get(id).meshes) {
      const p = m.geometry.attributes.position, n = m.geometry.attributes.normal;
      for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * d, p.getY(i) + n.getY(i) * d, p.getZ(i) + n.getZ(i) * d);
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }

  // Taglio netto a metà braccio: i vertici sotto il piano vengono portati sul piano.
  #clampFloor(part) {
    for (const m of part.meshes) {
      const p = m.geometry.attributes.position;
      const y0 = FLOOR - m.position.y;
      let touched = false;
      for (let i = 0; i < p.count; i++)
        if (p.getY(i) < y0) {
          p.setY(i, y0);
          touched = true;
        }
      if (touched) {
        p.needsUpdate = true;
        m.geometry.computeVertexNormals();
      }
    }
  }

  #ghostOf(id, ghostId, opacity) {
    const part = this.parts.get(id);
    const geos = part.meshes.map((m) => m.geometry.clone().translate(m.position.x, m.position.y, m.position.z));
    this.addPart(ghostId, part.name, part.base.getHex(), geos, { ghost: true, opacity });
  }

  // Aggiunge una geometria a una parte esistente (stesso materiale, stesso nome).
  #addTo(id, geo) {
    const part = this.parts.get(id);
    geo.computeBoundingBox();
    const c = geo.boundingBox.getCenter(new THREE.Vector3());
    const size = geo.boundingBox.getSize(new THREE.Vector3());
    geo.translate(-c.x, -c.y, -c.z);
    const m = new THREE.Mesh(geo, part.mat);
    m.position.copy(c);
    m.userData.size = size;
    m.userData.ui = part.meshes[0].userData.ui;
    m.castShadow = true;
    m.visible = false;
    this.inner.add(m);
    part.meshes.push(m);
  }

  // Tratti del plesso ricostruiti (vedi commento in testa). Punti in mm Z-Anatomy.
  #reconstruct() {
    // giunzioni: una sfera chiude le estremità aperte dei tubi reali
    for (const [id, p, r] of [
      ['U', J_U, 2.5], ['U', T_U, 2.5], ['M', J_M, 2.5], ['M', T_M, 2.5], ['L', J_L, 2.5], ['L', T_L, 2.5],
      ['PC', P, 2.3], ['PC', E, 2.3], ['MC', Q, 2.2], ['MC', MCE, 2.2],
    ]) this.#addTo(id, ball(p, r));

    this.addPart('Lp', 'ramo posteriore del tronco inferiore', NERVE,
      [tube([T_L, [-88, 18, 1410], [-94, 21.5, 1403.5], P], 1.6, { caps: false })]);
    this.addPart('LC', 'tronco secondario laterale', NERVE,
      [tube([A, [-116, 12, 1395], [-123, 10, 1389], LCE], 2.3, { caps: false }), ball(A, 2.3), ball(LCE, 2.3)]);
    this.addPart('MedL', 'radice laterale del nervo mediano', NERVE,
      [tube([LCE, [-136, 4.5, 1373.5], [-140.5, 3.5, 1367.5], F], 1.7, { caps: false })]);
    this.addPart('MedM', 'radice mediale del nervo mediano', NERVE,
      [tube([MCE, [-131, 3, 1368.5], [-138, 2, 1364.5], F], 1.7, { caps: false })]);
    this.#addTo('MED', tube([F, [-152, 6.5, 1352], [-160.5, 8, 1341.5], [-168, 9, 1331], [-169.6, 9.9, 1325.5]], 2.2, { caps: false }));
    this.#addTo('MED', ball(F, 2.2));
    this.#addTo('MCN', tube([LCE, [-143, 6, 1371], [-157, 2, 1356], [-170, 1, 1338], [-180, 4, 1317], [-186, 9, 1300], [-188.5, 12.3, 1288]], 1.8, { caps: false, seg: 44 }));
    this.#addTo('AX', tube([E, [-129, 28, 1376], [-137, 25.5, 1369], [-143.5, 24.6, 1363], [-147.5, 26.3, 1357.5]], 1.8, { caps: false }));
    this.addPart('ULN', 'nervo ulnare', NERVE,
      [tube([MCE, [-131, 9, 1362], [-137, 14, 1347], [-143, 18, 1332], [-147, 21.5, 1317], [-153, 24.5, 1300],
        [-160, 27, 1284], [-166, 29.5, 1262], [-171, 31.5, 1243], [-173, 32.5, 1236]], 2.0, { caps: false, seg: 60 })]);
    this.#clampFloor(this.parts.get('ULN'));
  }

  // Radici delle varianti prefissata (p…) e postfissata (q…).
  #variants() {
    const R = 1.9;
    const root = (id, name, level, pts) => this.addPart(id, name, LEVEL_COLORS[level], [tube(pts, R, { seg: 36 })]);
    root('pC4', 'radice C4 (plesso prefissato)', 'C4',
      [[-13, 16, 1504], [-17, 13, 1502], [-21, 11, 1500], [-28, 8, 1496], [-35, 8, 1488], [-42, 10, 1477], [-49, 12, 1465], J_U]);
    root('pC6', 'radice C6 (plesso prefissato)', 'C6',
      [[-17, 17, 1473], [-21, 17, 1470], [-26, 18, 1466], [-33, 20, 1459], [-41, 23, 1451], [-47, 25, 1446], J_M]);
    root('pC7', 'radice C7 (plesso prefissato)', 'C7',
      [[-15, 23, 1458], [-19, 22, 1456], [-25, 20, 1453], [-32, 17, 1448], [-40, 14, 1443], [-48, 13, 1439], J_L]);
    root('qC7', 'radice C7 (plesso postfissato)', 'C7',
      [[-15, 23, 1458], [-19, 22, 1456], [-25, 20, 1454], [-32, 18, 1452], [-40, 16, 1451], [-47, 14, 1451.5], J_U]);
    root('qC8', 'radice C8 (plesso postfissato)', 'C8',
      [[-14, 29, 1448], [-18, 28, 1447], [-24, 27, 1445], [-31, 26, 1443.5], [-39, 26, 1442.5], [-46, 26, 1442], J_M]);
    root('qT2', 'radice T2 (plesso postfissato)', 'T2',
      [[-14, 40.5, 1417], [-19, 40, 1417], [-25, 38, 1419], [-32, 34, 1423], [-39, 29, 1427.5], [-46, 22, 1431.5], [-51, 17, 1434], J_L]);
  }

  // I due spazi in cui il plesso può essere compresso: sfere traslucide.
  #markers() {
    for (const [id, name, p] of [
      ['costoclav', 'spazio costo-clavicolare', [-76, 14, 1422]],
      ['subcorac', 'spazio subcoracoideo', [-121, 11, 1387]],
    ]) {
      const part = this.addPart(id, name, 0x19c2d6, [ball(p, 13)], { opacity: 0.42 });
      part.mat.depthTest = false;
      part.marker = true;
      for (const m of part.meshes) {
        m.renderOrder = 20;
        m.castShadow = false;
      }
    }
  }

  // Prepara un segmento: misura per ogni triangolo la distanza dall'estremità
  // prossimale lungo la superficie, ordina i triangoli e crea il doppio (tail)
  // che disegna la parte a valle di un taglio con un materiale proprio.
  #segment(def) {
    const part = this.parts.get(def.id);
    const seg = { ...def, name: part.name, part, pieces: [], tailMat: part.mat.clone() };
    seg.tailMat.clippingPlanes = this.clipPlanes; // clone() li copierebbe per valore
    const offs = [];
    let n = 0;
    for (const m of part.meshes) {
      offs.push(n);
      n += m.geometry.attributes.position.count;
    }
    const P = new Float32Array(n * 3);
    const adj = Array.from({ length: n }, () => []);
    part.meshes.forEach((m, k) => {
      const p = m.geometry.attributes.position, o = offs[k];
      for (let i = 0; i < p.count; i++) {
        P[(o + i) * 3] = p.getX(i) + m.position.x;
        P[(o + i) * 3 + 1] = p.getY(i) + m.position.y;
        P[(o + i) * 3 + 2] = p.getZ(i) + m.position.z;
      }
      const ix = m.geometry.index.array;
      for (let t = 0; t < ix.length; t += 3)
        for (const [a, b] of [[ix[t], ix[t + 1]], [ix[t + 1], ix[t + 2]], [ix[t + 2], ix[t]]]) {
          adj[o + a].push(o + b);
          adj[o + b].push(o + a);
        }
    });
    const d2 = (a, b) => (P[a * 3] - P[b * 3]) ** 2 + (P[a * 3 + 1] - P[b * 3 + 1]) ** 2 + (P[a * 3 + 2] - P[b * 3 + 2]) ** 2;
    const dist = new Float32Array(n).fill(Infinity);
    // semi: i vertici più vicini all'estremità prossimale
    const f = mm(...def.from);
    const df = new Float32Array(n);
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      df[i] = Math.hypot(P[i * 3] - f.x, P[i * 3 + 1] - f.y, P[i * 3 + 2] - f.z);
      best = Math.min(best, df[i]);
    }
    let queue = [];
    for (let i = 0; i < n; i++)
      if (df[i] < best + 1.5 * S) {
        dist[i] = 0;
        queue.push(i);
      }
    const relax = () => {
      // i tubi hanno poche centinaia di vertici: basta una coda riordinata a ogni giro
      while (queue.length) {
        queue.sort((a, b) => dist[b] - dist[a]);
        const u = queue.pop();
        for (const v of adj[u]) {
          const nd = dist[u] + Math.sqrt(d2(u, v));
          if (nd < dist[v] - 1e-9) {
            dist[v] = nd;
            if (!queue.includes(v)) queue.push(v);
          }
        }
      }
    };
    relax();
    // componenti non raggiunte (rami, sfere di giunzione, tratti ricostruiti):
    // si agganciano al vertice già raggiunto più vicino
    for (;;) {
      let bu = -1, bv = -1, bd = Infinity;
      for (let u = 0; u < n; u++) {
        if (dist[u] !== Infinity) continue;
        for (let v = 0; v < n; v++) {
          if (dist[v] === Infinity) continue;
          const d = d2(u, v);
          if (d < bd) [bu, bv, bd] = [u, v, d];
        }
      }
      if (bu < 0) break;
      dist[bu] = dist[bv] + Math.sqrt(bd);
      queue = [bu];
      relax();
    }
    seg.len = dist.reduce((a, b) => Math.max(a, b), 0);
    seg.P = P;
    seg.dist = dist;

    part.meshes.forEach((m, k) => {
      const o = offs[k];
      const ix = m.geometry.index.array;
      const tris = [];
      for (let t = 0; t < ix.length; t += 3) tris.push([(dist[o + ix[t]] + dist[o + ix[t + 1]] + dist[o + ix[t + 2]]) / 3, ix[t], ix[t + 1], ix[t + 2]]);
      tris.sort((a, b) => a[0] - b[0]);
      const sorted = new Uint32Array(ix.length);
      const t = new Float32Array(tris.length);
      tris.forEach((tr, i) => {
        t[i] = tr[0];
        sorted.set(tr.slice(1), i * 3);
      });
      m.geometry.setIndex(new THREE.BufferAttribute(sorted, 1));
      // stessa geometria (attributi condivisi), intervallo di disegno distinto
      const tailGeo = new THREE.BufferGeometry();
      tailGeo.setIndex(m.geometry.index);
      Object.assign(tailGeo.attributes, m.geometry.attributes);
      tailGeo.setDrawRange(0, 0);
      const tail = new THREE.Mesh(tailGeo, seg.tailMat);
      tail.position.copy(m.position);
      tail.castShadow = true;
      tail.visible = false;
      tail.userData.ui = m.userData.ui;
      this.inner.add(tail);
      seg.pieces.push({ main: m, tail, t });
    });
    this.segs.set(def.id, seg);

    if (!this.cutMark) {
      this.cutMark = new THREE.Mesh(
        new THREE.SphereGeometry(1, 18, 12),
        new THREE.MeshStandardMaterial({ color: 0xb3261e, emissive: 0xb3261e, emissiveIntensity: 0.6, clippingPlanes: this.clipPlanes })
      );
      this.cutMark.visible = false;
      this.inner.add(this.cutMark);
    }
  }

  // --- stato ----------------------------------------------------------------
  // Taglia il segmento `id` alla distanza `t` dalla sua estremità prossimale.
  setCut(id, t) {
    if (this.cut) {
      for (const e of this.segs.get(this.cut.id).pieces) {
        e.main.geometry.setDrawRange(0, Infinity);
        e.tail.geometry.setDrawRange(0, 0);
      }
    }
    this.cut = id ? { id, t } : null;
    if (this.cutMark) this.cutMark.visible = !!id;
    if (!id) return;
    const seg = this.segs.get(id);
    for (const e of seg.pieces) {
      let k = 0;
      while (k < e.t.length && e.t[k] < t) k++;
      e.main.geometry.setDrawRange(0, k * 3);
      e.tail.geometry.setDrawRange(k * 3, Infinity);
    }
    // il segno del taglio sta al centro della sezione
    const near = [...seg.dist.keys()].sort((a, b) => Math.abs(seg.dist[a] - t) - Math.abs(seg.dist[b] - t)).slice(0, 10);
    const c = new THREE.Vector3();
    for (const i of near) c.add(new THREE.Vector3(seg.P[i * 3], seg.P[i * 3 + 1], seg.P[i * 3 + 2]));
    c.multiplyScalar(1 / near.length);
    let r = 0;
    for (const i of near) r += Math.hypot(seg.P[i * 3] - c.x, seg.P[i * 3 + 1] - c.y, seg.P[i * 3 + 2] - c.z);
    this.cutMark.position.copy(c);
    this.cutMark.scale.setScalar(Math.max(1.6 * S, (r / near.length) * 1.25));
  }

  // Distanza lungo il segmento del punto colpito dal puntatore.
  cutFromHit(id, hit) {
    const seg = this.segs.get(id);
    const e = seg.pieces.find((p) => p.main === hit?.object || p.tail === hit?.object);
    const t = e && hit.faceIndex != null ? e.t[Math.min(e.t.length - 1, hit.faceIndex)] : seg.len / 2;
    return Math.min(seg.len * 0.88, Math.max(seg.len * 0.12, t));
  }

  // Radici le cui fibre arrivano ancora, intatte, a ciascun segmento.
  aliveFibres() {
    const memo = new Map();
    const get = (id, whole) => {
      // whole=false: fibre che superano l'intero segmento (taglio compreso)
      const key = id + (whole ? '+' : '');
      if (memo.has(key)) return memo.get(key);
      const seg = this.segs.get(id);
      let set;
      if (!whole && this.cut?.id === id) set = new Set();
      else if (seg.kind === 'root') set = new Set(seg.roots);
      else {
        set = new Set();
        for (const p of seg.parents) for (const r of get(p, false)) if (seg.roots.includes(r)) set.add(r);
      }
      memo.set(key, set);
      return set;
    };
    const out = new Map();
    for (const id of this.segs.keys()) out.set(id, { before: get(id, true), after: get(id, false) });
    return out;
  }

  ancestors(id, acc = new Set()) {
    acc.add(id);
    for (const p of this.segs.get(id).parents) this.ancestors(p, acc);
    return acc;
  }

  update(dt, camera, realDt = dt) {
    super.update(dt, camera, realDt);
    const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 9);
    const col = new THREE.Color();
    for (const seg of this.segs.values()) {
      const mat = seg.part.mat, tm = seg.tailMat;
      const cutHere = this.cut?.id === seg.id;
      const tail = cutHere ? this.lookFn?.(seg.part)?.tail : null;
      if (tail) tm.color.lerp(col.set(tail.color), k);
      else tm.color.copy(mat.color);
      tm.emissive.copy(tm.color);
      tm.emissiveIntensity = mat.emissiveIntensity;
      tm.opacity = mat.opacity;
      tm.depthWrite = mat.depthWrite;
      for (const e of seg.pieces) e.tail.visible = cutHere && e.main.visible;
    }
    // gli indicatori degli spazi di compressione pulsano
    const pulse = 1 + 0.07 * Math.sin(this.time * 4);
    for (const id of ['costoclav', 'subcorac']) for (const m of this.parts.get(id)?.meshes ?? []) m.scale.setScalar(pulse);
  }
}
