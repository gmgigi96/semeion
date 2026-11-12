// Modello dell'ipotalamo: primo piano della metà destra, con la faccia mediale
// (ventricolare) in vista, sopra l'ipofisi.
//
// MESH REALI (BodyParts3D 4.0, CC BY 4.0; file public/meshes/ipotalamo.glb,
// manifesto meshes/ipotalamo.json, scala 0,026 unità per mm):
// - ipotalamo («Hypothalamus»), tuber cinereum, corpo mammillare, lamina
//   terminale: di ciascuno la metà destra, che nella sorgente è una mesh chiusa;
// - metà destra del chiasma ottico con l'inizio del tratto ottico, commessura
//   anteriore (tagliata sul piano mediano e a 7,5 mm di lato);
// - colonna del fornice destro, tratto terminale della stria terminale destra;
// - terzo ventricolo (parte anteriore-inferiore), talamo destro (parte
//   anteriore-inferiore), ipofisi con il peduncolo, tagliata sul piano mediano.
// I tagli sono fatti nel modello (`slice`): dividono i triangoli lungo il piano
// e chiudono la sezione, senza spostare alcun vertice della mesh.
// Da sapere sulla sorgente: l'ipofisi è una mesh sola; qui è divisa a mano in
// peduncolo (la parte più alta e stretta), neuroipofisi (calotta posteriore)
// e adenoipofisi (il resto, circa l'80% secondo la fonte letta): il confine tra
// i lobi è STIMATO. La metà «Hypothalamus» ha un volume di 828 mm³, circa il
// doppio dei 415 mm³ per lato dell'atlante citato sotto (comprende il volume
// del chiasma e metà del ventricolo). La colonna del fornice reale corre a soli
// 2-3,5 mm dal piano mediano: lo spazio tra parete del ventricolo e fornice è
// meno di 1 mm, per cui i nuclei mediali stanno sotto, davanti e dietro la
// colonna più che medialmente a essa.
//
// RICOSTRUITO A MANO dentro le mesh reali (punti in millimetri della sorgente,
// convertiti da `mm`): i tredici nuclei, l'eminenza mediana, il fascio
// mammillotalamico, tutte le vie. Ogni nucleo è stato controllato con un test
// di appartenenza: i punti campione stanno per il 93-100% dentro la mesh
// dell'ipotalamo e fuori da terzo ventricolo, chiasma, tratto ottico, colonna
// del fornice (dorsomediale: 5% di sovrapposizione) e corpo mammillare.
// Reperi misurati sulle mesh (y = antero-posteriore, più negativo = più avanti;
// z = altezza): lamina terminale da (y -109,6; z 1539,5) a (-102,3; 1551,4);
// chiasma y -110…-100, z 1536-1544; recesso infundibolare fino a (-101; 1538);
// corpo mammillare y -96…-92, z 1538-1543, fino a 4 mm dal piano mediano;
// larghezza massima dell'ipotalamo 7,6 mm a z 1542-1546; colonna del fornice
// da (-101; 1556) a (-94; 1540); la stria terminale reale finisce a
// (3,3 mm; -105,2; 1544,6), cioè proprio nella regione preottica.
//
// FONTI effettivamente lette (NCBI/StatPearls e Radiopaedia non sono leggibili
// in automatico):
// - Kenhub, "Hypothalamus", https://www.kenhub.com/en/library/anatomy/hypothalamus
//   VERIFICATO: limiti (lamina terminale davanti, tegmento del mesencefalo
//   dietro, solco ipotalamico sopra, chiasma - tuber cinereum - corpi mammillari
//   sotto, terzo ventricolo medialmente); zona periventricolare come striscia
//   sottile contro il ventricolo; regioni preottica (medio-preottico),
//   sopraottica (sopraottico, paraventricolare, soprachiasmatico, anteriore,
//   quest'ultimo subito dietro l'area preottica), tuberale (ventromediale,
//   dorsomediale, arcuato), mammillare (nuclei mammillari, tubero-mammillare,
//   posteriore); zona laterale con preottico laterale e area ipotalamica
//   laterale percorsa dal fascio mediale del telencefalo; fornice
//   postcommessurale al nucleo mammillare mediale; stria terminale da amigdala
//   ad area preottica mediale e nucleo anteriore; fascio mammillotalamico al
//   nucleo anteriore del talamo; assoni di sopraottico e paraventricolare alla
//   neuroipofisi, di arcuato e periventricolare al sistema portale.
// - Neuroscience Online (UTHealth Houston), sez. 4 cap. 1, "Hypothalamus:
//   structural organization", https://nba.uth.tmc.edu/neuroscience/m/s4/chapter01.html
//   VERIFICATO: tre colonne longitudinali; zona laterale «delimitata dal
//   fornice» e percorsa dal fascio mediale del telencefalo; arcuato nel
//   pavimento della regione tuberale; sopraottico subito sopra il chiasma, esteso
//   alla zona laterale; eminenza mediana che dal tuber cinereum si assottiglia
//   nel peduncolo; fornice, stria terminale e fascio mediale bidirezionali.
// - Wikipedia (en), https://en.wikipedia.org/wiki/… : "Hypothalamus" (tabella
//   dei nuclei per regione e zona), "Suprachiasmatic nucleus" (subito dorsale
//   al chiasma, ai lati del terzo ventricolo), "Supraoptic nucleus" (alla base
//   dell'encefalo, accanto al chiasma), "Paraventricular nucleus of
//   hypothalamus" (addossato al terzo ventricolo; magnocellulari alla
//   neuroipofisi, parvicellulari all'eminenza mediana), "Arcuate nucleus"
//   (ipotalamo medio-basale, accanto a terzo ventricolo ed eminenza mediana),
//   "Tuberomammillary nucleus" (terzo posteriore, nel tuber cinereum), "Median
//   eminence" (rilievo del tuber cinereum, dietro e sopra il peduncolo; da qui
//   nascono i vasi portali), "Mammillothalamic tract", "Fornix (neuroanatomy)"
//   (colonne dietro la commessura anteriore, nella parete laterale del terzo
//   ventricolo fino ai corpi mammillari), "Pituitary gland" (nella fossa
//   ipofisaria dello sfenoide; pars distalis circa 80% della ghiandola).
// - Europe PMC, PMC7492465 (Neudorfer et al., "A high-resolution in vivo
//   magnetic resonance imaging atlas of the human hypothalamic region", Sci Data
//   2020): volumi medi dei nuclei (somma dei due lati, mm³): laterale 172,
//   paraventricolare 40, ventromediale 32, area anteriore 31, arcuato 27,
//   posteriore 26, tubero-mammillare 25, periventricolare 20, sopraottico 16,
//   dorsomediale 12, preottico mediale 9, soprachiasmatico 5. Usati per le
//   proporzioni relative: i nuclei qui hanno volumi per lato di 2-20 mm³ (il
//   laterale circa 50), dello stesso ordine ma non uguali.
// STIMATO (nessuna misura nelle fonti lette): coordinate, forma e orientamento
// di ogni nucleo, posti secondo regione, zona e rapporti descritti sopra e i
// reperi delle mesh; il nucleo periventricolare come lamina verticale tra
// regione sopraottica e tuberale (negli appunti riveste tutta la parete); la
// posizione del dorsomediale, dorsale al ventromediale ma dietro e sopra la
// colonna del fornice; il decorso del fascio mammillotalamico tra corpo
// mammillare e talamo; il decorso di tutte le vie (frecce che uniscono origine
// e bersaglio, non fasci misurati); il fascio mediale del telencefalo, reso
// con due frecce di verso opposto lungo la zona laterale.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { AnatomyModel } from '../model.js';
import { taperTube, ellipsoid } from '../geo.js';

const S = 0.026; // unità per mm (come nel manifesto)
const O = [-0.65, -101, 1520.5]; // origine del manifesto, in mm (x = piano mediano)
// punto in mm: [distanza dal piano mediano verso DESTRA, y (indietro), z (alto)]
const mm = ([l, y, z]) => new THREE.Vector3(l * S, (z - O[2]) * S, -(y - O[1]) * S);
const scaled = (r) => (Array.isArray(r) ? r.map((v) => v * S) : r * S);

const WHITE = 0xf1ead8, TISSUE = 0xd9b99a;
const REAL = {
  hyp: ['ipotalamo (metà destra)', TISSUE, { ghost: true, opacity: 0.55 }],
  tuber: ['tuber cinereum', 0xc9a27a, { ghost: true, opacity: 0.5 }],
  v3: ['terzo ventricolo', 0x4f9fd0, { ghost: true, opacity: 0.55 }],
  thalamus: ['talamo', 0xc9a27a, { ghost: true, opacity: 0.4 }],
  mammillary: ['corpo mammillare', 0xd9c06a],
  lamina: ['lamina terminale', 0xd9d2bf, { opacity: 0.6 }],
  chiasm: ['chiasma ottico', WHITE],
  stria: ['stria terminale', 0xe7a0aa],
  // mesh da tagliare nel modello (vedi #cuts): non compaiono così come sono
  tractRaw: ['', WHITE],
  commissureRaw: ['', WHITE],
  fornixRaw: ['', WHITE],
  pit: ['', WHITE],
};

// Nuclei ricostruiti (metà destra). `pts`/`r`: tubo lungo l'asse del nucleo
// (raggi in mm, `flat` schiaccia o allarga la sezione lungo gli assi del
// modello); `c`/`r`: ellissoide con semiassi [laterale, verticale,
// antero-posteriore].
const NUCLEI = {
  // regione preottica
  preopticM: { name: 'nucleo preottico mediale', color: 0xe0a23c, shapes: [{ pts: [[1.7, -106.6, 1543.3], [1.7, -105.9, 1545.4], [1.7, -105.2, 1547.6]], r: 0.85 }] },
  preopticL: { name: 'nucleo preottico laterale (con l’area preottica laterale ventrale)', color: 0xb9762a, shapes: [{ c: [4.2, -105.5, 1544.8], r: [1.1, 1.7, 1.0] }] },
  // regione sopraottica
  suprachiasmatic: { name: 'nucleo soprachiasmatico', color: 0xf2d13c, shapes: [{ c: [1.4, -104.3, 1544.4], r: [0.7, 0.75, 1.0] }] },
  supraoptic: { name: 'nucleo sopraottico', color: 0x3f8fd4, shapes: [{ c: [4.7, -102.9, 1544.8], r: [1.3, 0.8, 1.7] }] },
  paraventricular: { name: 'nucleo paraventricolare', color: 0x2f5fa8, shapes: [{ c: [1.6, -103.1, 1549.0], r: [0.8, 1.8, 1.5] }] },
  anterior: { name: 'nucleo ipotalamico anteriore', color: 0xd9652b, shapes: [{ c: [2.7, -103.0, 1545.9], r: [1.2, 1.3, 1.5] }] },
  // zona periventricolare
  periventricular: { name: 'nucleo periventricolare', color: 0x7fb7c9, shapes: [{ c: [1.05, -100.7, 1545.6], r: [0.3, 2.2, 0.9] }] },
  // regione tuberale
  arcuate: { name: 'nucleo arcuato', color: 0xc0568a, shapes: [{ pts: [[1.5, -101.8, 1538.3], [1.5, -100.5, 1538.9], [1.5, -99.2, 1539.6]], r: 0.75 }] },
  dorsomedial: { name: 'nucleo dorsomediale', color: 0x8fc46a, shapes: [{ c: [2.5, -97.2, 1547.0], r: [0.9, 0.9, 1.3] }] },
  ventromedial: { name: 'nucleo ventromediale', color: 0x2f8a4f, shapes: [{ c: [2.9, -98.6, 1541.6], r: [1.5, 1.5, 1.7] }] },
  // regione mammillare
  posterior: { name: 'nucleo ipotalamico posteriore', color: 0x8e5bb5, shapes: [{ c: [1.8, -94.5, 1545.1], r: [0.95, 1.3, 1.3] }] },
  tuberomammillary: { name: 'nucleo tubero-mammillare', color: 0xc79ae0, shapes: [{ c: [4.7, -96.8, 1542.5], r: [1.0, 0.9, 1.5] }] },
  // zona laterale
  lateral: { name: 'nucleo ipotalamico laterale', color: 0xc9485b, shapes: [{ pts: [[5.6, -103.0, 1547.3], [5.9, -100.5, 1545.9], [5.8, -97.8, 1545.1], [5.0, -95.6, 1544.6]], r: [0.9, 1.1, 1.1, 0.9], flat: { y: 1.4 } }] },
  // sulla linea mediana, dietro e sopra il peduncolo
  eminence: { name: 'eminenza mediana', color: 0xa8324a, shapes: [{ c: [0, -101.7, 1537.0], r: [1.3, 0.6, 1.2] }] },
  // dal corpo mammillare al nucleo anteriore del talamo
  mtt: { name: 'fascio mammillotalamico', color: WHITE, shapes: [{ pts: [[2.7, -93.5, 1543.3], [3.6, -93.1, 1546.5], [4.2, -92.6, 1550], [4.6, -92.0, 1553], [4.9, -91.3, 1556]], r: 0.55 }] },
};

const BLUE = 0x2f6fe0, GREEN = 0x1f9d57, RED = 0xd43d3d, PORTAL = 0xc23b3b;
// Vie: [id, punti in mm, opzioni]. Uniscono origine e bersaglio lungo un
// decorso plausibile: non sono fasci misurati.
const LINKS = [
  // neurosecrezione
  ['pvn-neuro', [[1.6, -102.2, 1547.6], [1.7, -101.2, 1544.2], [1.2, -101.5, 1540.2], [0.5, -102.5, 1536.6], [0.3, -103.2, 1533], [0.3, -103, 1530.2], [0.2, -102.6, 1528]], { color: BLUE }],
  ['son-neuro', [[4.4, -102.2, 1544.4], [3.4, -100.4, 1541.6], [1.9, -101.2, 1538.7], [0.8, -102.6, 1536.3], [0.7, -103.3, 1533], [0.7, -103, 1530], [0.8, -102.3, 1527.4]], { color: BLUE }],
  ['arc-em', [[1.5, -100.4, 1538.6], [1.1, -101.0, 1537.9], [0.6, -101.5, 1537.4]], { color: BLUE, r: 0.003 }],
  ['pev-em', [[1.05, -100.8, 1543.2], [1.0, -100.9, 1540.4], [0.5, -101.5, 1537.9]], { color: BLUE, r: 0.003 }],
  ['portal', [[0, -102.6, 1536.4], [0, -104.6, 1534.2], [0, -105.6, 1531.6], [0, -106.6, 1528.6]], { color: PORTAL }],
  // orologio e sonno
  ['retina-scn', [[5.2, -110.6, 1538.6], [2.6, -108.2, 1540.6], [1.5, -105.6, 1543.2], [1.4, -104.6, 1544]], { color: GREEN }],
  ['scn-pvn', [[1.5, -104.2, 1545.3], [2.0, -104.0, 1546.3], [1.7, -103.5, 1547.3]], { color: GREEN, r: 0.003 }],
  ['vlpo-tmn', [[4.6, -104.6, 1543.6], [6.9, -101.2, 1542.4], [5.7, -98.3, 1542.6]], { color: RED, inhibit: true, r: 0.0035 }],
  ['vlpo-orx', [[4.8, -104.8, 1546.2], [7.0, -102.6, 1548.6], [6.7, -99.2, 1547.2]], { color: RED, inhibit: true, r: 0.0035 }],
  ['orx-lc', [[5.0, -95.2, 1544.2], [4.4, -92.6, 1542.4], [3.4, -90.2, 1539.6]], { color: GREEN, r: 0.0035 }],
  // connessioni
  ['fx-mb', [[1.0, -101.3, 1556.4], [1.5, -101.0, 1552], [1.6, -100.0, 1548], [1.5, -99, 1546], [1.3, -97.7, 1544.2], [1.4, -96.2, 1542.6], [1.8, -95.2, 1541.7]], { color: GREEN, r: 0.0035 }],
  ['st-in', [[4.6, -100.9, 1550.6], [4.3, -102.0, 1547.4], [3.3, -103.6, 1546.0], [2.4, -105.2, 1545.6]], { color: GREEN, r: 0.0035 }],
  ['mtt-up', [[1.9, -93.4, 1543.8], [2.8, -93.0, 1546.8], [3.4, -92.5, 1550.2], [3.8, -91.9, 1553], [4.1, -91.2, 1556]], { color: GREEN, r: 0.0035 }],
  ['mfb-up', [[5.0, -92.8, 1546.6], [6.0, -97.4, 1547.5], [6.2, -100.8, 1548.3], [5.9, -104.4, 1549.9], [5.4, -108.2, 1551.6]], { color: GREEN, r: 0.0035 }],
  ['mfb-down', [[5.3, -107.6, 1546.6], [5.8, -104.2, 1544.4], [6.1, -100.6, 1543.2], [5.9, -97.2, 1542.6], [4.9, -92.6, 1541.8]], { color: GREEN, r: 0.0035 }],
];

// Taglia una geometria lungo la superficie f(p) = 0 dividendo i triangoli che
// la attraversano: restituisce [parte con f < 0, parte con f >= 0].
function clip(geo, f) {
  const pos = geo.attributes.position;
  const idx = geo.index.array;
  const out = [[], []];
  const P = (i) => new THREE.Vector3().fromBufferAttribute(pos, i);
  const tri = (side, a, b, c) => out[side].push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let t = 0; t < idx.length; t += 3) {
    const v = [P(idx[t]), P(idx[t + 1]), P(idx[t + 2])];
    const d = v.map(f);
    const s = d.map((x) => (x >= 0 ? 1 : 0));
    const n = s[0] + s[1] + s[2];
    if (n === 0 || n === 3) {
      tri(n ? 1 : 0, ...v);
      continue;
    }
    // il vertice solo da una parte: i (gli altri due, j e k, stanno dall'altra)
    const i = s.findIndex((x) => x === (n === 1 ? 1 : 0));
    const j = (i + 1) % 3, k = (i + 2) % 3;
    const cut = (a, b) => v[a].clone().lerp(v[b], d[a] / (d[a] - d[b]));
    const ij = cut(i, j), ik = cut(i, k);
    tri(s[i], v[i], ij, ik);
    tri(1 - s[i], ij, v[j], v[k]);
    tri(1 - s[i], ij, v[k], ik);
  }
  return out.map((list) => {
    let g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(list, 3));
    g = mergeVertices(g, 1e-5);
    g.computeVertexNormals();
    return g;
  });
}

// Tiene la parte di `geo` dove f(p) < 0 e chiude la sezione. `f` deve essere
// un piano di normale `n`: il contorno del taglio viene triangolato nel piano.
function slice(geo, f, n) {
  const g = clip(geo, f)[0];
  const src = g.attributes.position;
  const idx = [...g.index.array];
  const P = (i) => new THREE.Vector3().fromBufferAttribute(src, i);
  const on = (i) => Math.abs(f(P(i))) < 1e-4;
  // lati che appartengono a un solo triangolo e stanno sul piano
  const seen = new Map();
  for (let t = 0; t < idx.length; t += 3)
    for (let e = 0; e < 3; e++) {
      const a = idx[t + e], b = idx[t + ((e + 1) % 3)];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      seen.set(key, seen.has(key) ? null : [a, b]);
    }
  const next = new Map();
  for (const e of seen.values()) if (e && on(e[0]) && on(e[1])) next.set(e[0], e[1]);
  const u = new THREE.Vector3(n.y, n.z, n.x).cross(n).normalize();
  const v = n.clone().cross(u);
  const pos = [...src.array];
  while (next.size) {
    const start = next.keys().next().value;
    const loop = [];
    for (let i = start; next.has(i); ) {
      loop.push(i);
      const j = next.get(i);
      next.delete(i);
      i = j;
    }
    if (loop.length < 3) continue;
    const pts = loop.map((i) => P(i));
    const base = pos.length / 3;
    for (const p of pts) pos.push(p.x, p.y, p.z); // vertici propri: lo spigolo resta netto
    for (const t of THREE.ShapeUtils.triangulateShape(pts.map((p) => new THREE.Vector2(p.dot(u), p.dot(v))), []))
      idx.push(base + t[0], base + t[1], base + t[2]);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setIndex(idx);
  out.computeVertexNormals();
  return out;
}
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);

export class IpotalamoModel extends AnatomyModel {
  constructor() {
    super({ tilt: -0.75 });
    this.addStand({ radius: 0.2, z: 0.05 });
    // l'asta sta nel gruppo che ruota, non in quello che scorre (vedi setFocus)
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.05, 12),
      new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 })
    );
    rod.position.set(-0.05, 0.04, 0.125); // sotto la metà destra dell'ipofisi (x è ribaltata)
    rod.castShadow = true;
    this.spin.add(rod);
    this.rod = rod;
    this.focusScale = 1;
    this.focus = new THREE.Vector3();
    this.focusTarget = new THREE.Vector3();
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('ipotalamo.glb', REAL);
    this.#cuts();
    for (const [id, n] of Object.entries(NUCLEI))
      this.addPart(id, n.name, n.color, n.shapes.map((s) => this.#shape(s)));
    for (const [id, pts, opts] of LINKS) this.addLink(id, pts.map(mm), opts);
  }

  // Toglie dal modello una mesh caricata e ne restituisce le geometrie, nelle
  // coordinate del modello.
  #take(id) {
    const part = this.parts.get(id);
    this.parts.delete(id);
    return part.meshes.map((m) => {
      m.removeFromParent();
      return m.geometry.translate(m.position.x, m.position.y, m.position.z);
    });
  }

  // Tagli netti delle mesh reali: tutto ciò che attraversa il piano mediano è
  // sezionato lì, così la faccia mediale resta in vista.
  #cuts() {
    const cut = { double: true }; // le sezioni non hanno un verso sicuro
    const [ac] = this.#take('commissureRaw');
    this.addPart('commissure', 'commessura anteriore', 0xe6dcc0, [slice(slice(ac, (p) => -p.x, X), (p) => p.x - 7.5 * S, X)], cut);
    const [tract] = this.#take('tractRaw');
    this.addPart('tract', 'tratto ottico', WHITE, [slice(tract, (p) => p.x - 12.5 * S, X)], cut);
    const [fornix] = this.#take('fornixRaw');
    this.addPart('fornix', 'colonna del fornice (fornice postcommessurale)', 0xe9e0c4, [slice(fornix, (p) => p.y - (1555 - O[2]) * S, Y)], cut);
    // L'ipofisi reale è una mesh sola: metà destra, divisa in peduncolo,
    // neuroipofisi (parte posteriore) e adenoipofisi. Il confine tra i lobi è stimato.
    const [pit] = this.#take('pit');
    const half = slice(pit, (p) => -p.x, X);
    const [gland, stalk] = clip(half, (p) => p.y - (1531.7 - O[2]) * S);
    const back = mm([0, -88, 1527]); // centro della sfera che ritaglia il lobo posteriore
    const [neuro, adeno] = clip(gland, (p) => p.distanceTo(back) - 16.1 * S);
    this.addPart('stalk', 'peduncolo ipofisario', 0xe7c9b9, [stalk], cut);
    this.addPart('adeno', 'adenoipofisi', 0xd9765f, [adeno], cut);
    this.addPart('neuro', 'neuroipofisi', 0xe9c9a0, [neuro], cut);
  }

  #shape(s) {
    if (s.pts) return taperTube(s.pts.map(mm), scaled(s.r), { flat: s.flat ?? null, radial: 18 });
    const g = ellipsoid([0, 0, 0], scaled(s.r));
    const p = mm(s.c);
    g.translate(p.x, p.y, p.z);
    return g;
  }

  // Primo piano: `center` (coordinate del modello) finisce sull'asse della base
  // all'altezza `height`, ingrandito di `scale`. Senza argomenti: modello intero.
  setFocus(center = null, scale = 1, height = 0.3) {
    this.focusScale = scale;
    if (center) this.focusTarget.set(-center[0] * scale, height - center[1] * scale, 0.05 - center[2] * scale);
    else this.focusTarget.set(0, 0, 0);
  }

  reset() {
    super.reset();
    this.setFocus();
  }

  update(dt, camera, realDt = dt) {
    const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 6);
    this.focus.lerp(this.focusTarget, k);
    this.inner.position.copy(this.focus);
    this.inner.scale.setScalar(this.inner.scale.x + (this.focusScale - this.inner.scale.x) * k);
    this.rod.visible = this.focusScale === 1; // l'asta regge solo il modello intero
    super.update(dt, camera, realDt);
  }
}
