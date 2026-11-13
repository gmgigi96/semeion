// Modello di un nervo spinale tipo: l'ottavo nervo toracico (T8) di destra, dal
// midollo al foro intervertebrale tra T8 e T9, con i suoi rami.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/nervi-spinali.glb, manifesto
// in meshes/nervi-spinali.json):
//   - vertebre T8 e T9, disco T8-T9, ottava e nona costa di destra (tagliate a
//     72 mm dalla linea mediana);
//   - midollo spinale tra le quote 1247 e 1281 mm dell'atlante: sostanza bianca,
//     corno anteriore, corno posteriore, sostanza intermedia laterale, nucleo
//     intermedio-laterale; dura madre con i manicotti che accompagnano le radici;
//   - radice posteriore di T8 («Posterior root of spinal nerve»), dei due lati;
//   - ganglio spinale di T8, dei due lati;
//   - nervo spinale e ramo anteriore: è l'oggetto «Intercostal nerves», che in
//     Z-Anatomy parte dal centro del ganglio; i primi 9 mm sono qui il «nervo
//     spinale», il resto il ramo anteriore (ottavo nervo intercostale);
//   - tronco del simpatico e suoi gangli;
//   - i due tubi che Z-Anatomy raccoglie in «Sympathetic nerves» a questo
//     livello, senza distinguerli: uno breve va dal ganglio del simpatico al
//     polo laterale del ganglio spinale (qui: ramo comunicante GRIGIO, il più
//     prossimale), l'altro raggiunge il nervo 9 mm più lateralmente (qui: ramo
//     comunicante BIANCO, il più distale) e prosegue all'indietro, lateralmente
//     alle faccette articolari, fino ai muscoli trasverso-spinali (qui: tronco
//     del RAMO POSTERIORE). L'attribuzione dei nomi è una mia interpretazione
//     del decorso; che il bianco lasci il nervo più lontano dal foro è verificato;
//   - muscoli multifido, rotatori e semispinale del torace; lunghissimo e
//     ileocostale del torace (tra le quote 1226 e 1281, in trasparenza).
//   Tagli: le vertebre intere coprirebbero i nervi (il ritaglio del motore toglie
//   solo ciò che esce dalla pagina). Perciò il midollo è un tratto isolato, tagliato
//   di netto (la faccia superiore è il contorno reale delle mesh a quella quota:
//   sostanza bianca, corna, sostanza intermedia), e le ossa compaiono come
//   blocchi ritagliati dalle mesh reali: `BLOCK` attorno al foro intervertebrale
//   destro (T8, T9 e disco), `AXIAL` per la sola T9 vista dall'alto. Le facce di
//   taglio sono piane (i vertici esterni sono portati sul piano), quindi non
//   mostrano la vera sezione dell'osso. Le vertebre intere restano nel file di
//   mesh come sorgente dei blocchi e non sono mostrate.
//   Controlli fatti sulle mesh: il ganglio a quota 1260 sta nel foro delimitato
//   in alto dal peduncolo di T8, in basso da quello di T9, in avanti dal corpo
//   di T8 e dal disco, indietro dai processi articolari: è il nervo T8. È il
//   livello toracico in cui Z-Anatomy ha sia il ramo breve sia quello lungo.
//   I nervi di Z-Anatomy sono tubi di 0,3-0,5 mm di raggio: qui sono ingrossati
//   lungo le normali (`INFLATE`); il decorso è quello reale, il calibro no.
//   Anche i gangli (spinale 5,6 x 3,5 x 4 mm, del simpatico una sfera di 0,9 mm)
//   sono ingrossati, e quello del simpatico è allungato in verticale.
//   Nell'atlante le radici sono brevi e quasi orizzontali: l'obliquità delle
//   radici toraciche e lo scarto tra neuromero e vertebra non sono rappresentati.
//
// RICOSTRUITO A MANO nella stessa terna (punti in millimetri Z-Anatomy):
//   - radice anteriore: l'oggetto «Anterior root of spinal nerve» di Z-Anatomy
//     nasce dentro la sostanza grigia ed esce dal fianco del midollo, e finisce
//     nel centro del ganglio: non è usato. Qui la radice emerge dal solco
//     laterale anteriore, passa sotto e davanti al ganglio e raggiunge il nervo
//     subito lateralmente a esso;
//   - radicole anteriori e posteriori (Z-Anatomy ha una sola radice per lato);
//   - solchi laterali anteriore e posteriore, come linee sulla superficie reale;
//   - ramo meningeo ricorrente;
//   - rami mediale e laterale del ramo posteriore, e il breve raccordo tra il
//     nervo e il tubo reale del ramo posteriore;
//   - segnaposto dei corpi neuronali, anello che indica il foro intervertebrale,
//     percorsi delle fibre (seguono l'asse dei tubi reali).
//
// Fonti lette (voci di Wikipedia in inglese, testo sorgente):
//   - «Dorsal root ganglion», https://en.wikipedia.org/wiki/Dorsal_root_ganglion
//     (VERIFICATO: neuroni pseudounipolari; il ganglio sta nel foro
//     intervertebrale; le due radici si uniscono subito lateralmente a esso)
//   - «Intervertebral foramen», https://en.wikipedia.org/wiki/Intervertebral_foramen
//     (VERIFICATO: tra i peduncoli di due vertebre; nel tratto toracico limitato
//     in avanti dal corpo e dal disco; contiene radici, ganglio, nervo meningeo
//     ricorrente; la dura si prolunga nel foro con il nervo)
//   - «Anterolateral sulcus of spinal cord»,
//     https://en.wikipedia.org/wiki/Anterolateral_sulcus_of_spinal_cord
//     (VERIFICATO: è il punto in cui le fibre anteriori lasciano il midollo)
//   - «Meningeal branches of spinal nerve»,
//     https://en.wikipedia.org/wiki/Meningeal_branches_of_spinal_nerve
//     (VERIFICATO: nasce dal nervo presso l'origine dei due rami, rientra nel
//     foro; legamenti e periostio del canale, anello fibroso)
//   - «Ramus communicans», https://en.wikipedia.org/wiki/Ramus_communicans
//     (VERIFICATO: il ramo bianco lascia il nervo più lontano dal foro
//     intervertebrale rispetto al grigio)
//   - «White ramus communicans», https://en.wikipedia.org/wiki/White_ramus_communicans
//     e «Gray ramus communicans», https://en.wikipedia.org/wiki/Gray_ramus_communicans
//     (VERIFICATO: fibre pregangliari dalla colonna intermedio-laterale al
//     ganglio paravertebrale; postgangliari dal ganglio al nervo misto)
//   - «Thoracic ganglia», https://en.wikipedia.org/wiki/Thoracic_ganglia
//     (VERIFICATO: i gangli toracici hanno rami comunicanti bianchi e grigi)
//   - «Dorsal ramus of spinal nerve», https://en.wikipedia.org/wiki/Dorsal_ramus_of_spinal_nerve
//     (VERIFICATO: si porta indietro e si divide in ramo mediale e laterale; il
//     mediale per i muscoli trasverso-spinali e le faccette, il laterale per
//     lunghissimo e ileocostale)
//   - «Intercostal nerves», https://en.wikipedia.org/wiki/Intercostal_nerves
//     (VERIFICATO: sono i rami anteriori dei nervi toracici da T1 a T11)
// STIMATO, senza una fonte letta: numero e inserzione delle radicole (sei per
// radice), posizione esatta dei solchi (dall'emergenza della radice posteriore
// reale e dalla testa del corno anteriore reale), decorso del ramo meningeo
// dentro il foro e nel canale, punto di divisione e decorso dei rami mediale e
// laterale del ramo posteriore, posizione dei corpi neuronali dentro corna e
// gangli, tutti i calibri.
// (La voce «Rootlet» di Wikipedia non esiste più; NCBI e Radiopaedia non sono
// state consultate.)
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale,
// z anteriore; 1 mm = 0,0068 unità. L'asse di rotazione passa per il foro
// intervertebrale destro.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.0068;
const O = [-18, 63, 1192];
// Da millimetri Z-Anatomy (x verso sinistra, y verso dietro, z verso l'alto).
const mm = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const tube = (pts, r, opts) =>
  taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, seg: 28, ...opts });
const ball = (p, r) => {
  const c = mm(...p);
  return ellipsoid([c.x, c.y, c.z], [r * S, r * S, r * S], null, 14);
};

// Asse del midollo reale: [quota, mm verso dietro del centro]. Semiassi 7,2 x 5,05 mm.
const AXIS = [[1222, 63.8], [1234, 65.75], [1246, 67.55], [1258, 69.3], [1264, 70.05], [1270, 70.75], [1276, 71.3], [1282, 71.75], [1288, 72.05]];
function axisY(z) {
  if (z <= AXIS[0][0]) return AXIS[0][1];
  for (let i = 1; i < AXIS.length; i++)
    if (z <= AXIS[i][0]) {
      const [z0, y0] = AXIS[i - 1], [z1, y1] = AXIS[i];
      return y0 + ((y1 - y0) * (z - z0)) / (z1 - z0);
    }
  return AXIS.at(-1)[1];
}
// Punto del midollo: quota, mm a destra dell'asse, mm dietro l'asse. s = -1: lato sinistro.
const cord = (z, right, back, s = 1) => [-s * right, axisY(z) + back, z];
const side = (p, s) => [s * p[0], p[1], p[2]];

const CUT = [1247, 1281]; // quote a cui è tagliato il tratto di midollo
// Blocco di colonna dei primi piani (mm Z-Anatomy): dalla linea paramediana
// sinistra al processo trasverso destro, dalla metà dei corpi ai processi spinosi.
const BLOCK = { x: [-34, 9], y: [50, 90], z: [1243, 1278] };
// Veduta dall'alto dell'ultima pagina: la sola T9, dal piano dei suoi processi trasversi in su.
const AXIAL = { x: [-40, 13], y: [36, 101], z: [1226, 1281] };
const WALL = { x: [-72, 40], y: [0, 200], z: AXIAL.z }; // coste, muscoli e ramo anteriore: fin dove arrivano
export const FLOOR = { cord: CUT[0], block: BLOCK.z[0], axial: AXIAL.z[0] };
// Un punto dato in millimetri Z-Anatomy, per i primi piani del capitolo (`focus.at`).
export const atMm = (x, y, z) => mm(x, y, z).toArray();

// Reperi (mm Z-Anatomy, lato destro: x negativo).
const SULCUS_P = [3.9, 4.2]; // solco laterale posteriore: a destra e dietro l'asse
const SULCUS_A = [3.7, -4.3]; // solco laterale anteriore
const GANGLION = [-12.9, 68.5, 1260.3];
const SGANG = [-17.9, 60.8, 1262.9];
const P_JOIN = [-7.2, 71.9, 1263.0]; // dove le radicole posteriori raggiungono la radice reale
const A_JOIN = [-7.8, 66.9, 1262.6]; // dove le radicole anteriori si riuniscono
const A_ROOT = [A_JOIN, [-10.5, 67.2, 1259.8], [-13, 67.4, 1257.6], [-15.8, 68.0, 1258.2], [-18.2, 68.6, 1260.2]];
const ROOTLETS_P = [1262, 1265, 1271, 1274, 1277]; // quote d'impianto (la radice reale nasce a 1268)
const ROOTLETS_A = [1262, 1265, 1268, 1271, 1274, 1277];
// Asse dei tubi reali (centri delle sezioni di Z-Anatomy).
const NERVE_AX = [GANGLION, [-16.5, 68.55, 1260.4], [-19.4, 68.6, 1260.5], [-22.3, 69.1, 1261.2]];
const ANT_AX = [[-26, 69.9, 1262.2], [-30.3, 70.8, 1263.2], [-32.6, 71.7, 1263.3]]; // fino al taglio del primo piano
const ROOT_P_AX = [[-10.5, 69.3, 1261.1], [-8.5, 70.7, 1262.1], [-6.8, 72.2, 1263.3], [-5.4, 73.5, 1264.8], [-4.2, 74.1, 1266.4], [-3.6, 74.1, 1267.3]];
const WHITE_AX = [[-22.2, 68.3, 1258.7], [-22.1, 67.2, 1259.4], [-21.4, 65.6, 1260.3], [-20.4, 64.1, 1261.1], [-19.1, 62.5, 1262.0], SGANG];
const GREY_AX = [SGANG, [-17.7, 62.6, 1262.1], [-17.0, 65.0, 1260.4], [-15.8, 67.0, 1259.2], [-14.5, 67.9, 1259.2], [-13.8, 68.3, 1259.6]];
const POST_AT = [-18.6, 80.0, 1253.2]; // punto del ramo posteriore reale da cui parte il ramo laterale
const POST_END = [-18.6, 88.7, 1252.2]; // estremità del tubo reale

const BONE = 0xe9dfc8, NERVE = 0xe6bd2e, SENS = 0x2f6fe0, MOT = 0xd43d3d, PRE = 0x1f9d57, POST = 0x7a4fd0;
export const FIBRE = { sens: SENS, mot: MOT, pre: PRE, post: POST };

const REAL = {
  vT8: ['vertebra T8', BONE],
  vT9: ['vertebra T9', 0xe3d6b8],
  disc: ['disco intervertebrale T8-T9', 0xbfd0d6],
  rib8: ['ottava costa', BONE, { opacity: 0.4 }],
  rib9: ['nona costa', BONE],
  cord: ['midollo spinale (sostanza bianca)', 0xf3ecda],
  antHorn: ['corno anteriore', 0xc98a7c],
  postHorn: ['corno posteriore', 0x8fa3c9],
  greyMid: ['sostanza grigia intermedia', 0xa8978c],
  iml: ['motoneuroni viscerali (lamina 7, nucleo intermedio-laterale)', PRE],
  dura: ['dura madre', 0x9fb7c9, { ghost: true, opacity: 0.3 }],
  rootP: ['radice posteriore', 0x4f8ad9],
  rootPL: ['radice posteriore di sinistra', 0x9db4d4],
  ganglion: ['ganglio spinale', 0xd9922e],
  ganglionL: ['ganglio spinale di sinistra', 0xd4b98a],
  nerve: ['nervo spinale T8', NERVE],
  nerveL: ['nervo spinale T8 di sinistra', 0xdccf9a],
  anterior: ['ramo anteriore (ottavo nervo intercostale)', 0xdcb13a],
  anteriorD: ['ramo anteriore (ottavo nervo intercostale)', 0xdcb13a],
  trunk: ['catena del simpatico (tronco paravertebrale)', 0x3f9d8a],
  sgangCtx: ['gangli della catena paravertebrale', 0x3f9d8a],
  sgang: ['ganglio della catena paravertebrale', 0x2f8f6b],
  white: ['ramo comunicante bianco', 0xfaf6ea],
  grey: ['ramo comunicante grigio', 0x8b8b8b],
  posterior: ['ramo posteriore', 0xc98a2e],
  transv: ['muscoli trasverso-spinali (multifido, rotatori, semispinale)', 0xb9584c, { ghost: true, opacity: 0.16 }],
  erector: ['muscoli lunghissimo e ileocostale', 0xa5564b, { ghost: true, opacity: 0.16 }],
};

// Raggio aggiunto ai tubi e ai gangli di Z-Anatomy, in mm.
const INFLATE = {
  rootP: 0.5, rootPL: 0.5, ganglion: 0.5, ganglionL: 0.5, nerve: 0.9, nerveL: 0.8, anterior: 0.9, anteriorD: 0.9,
  posterior: 0.55, white: 0.35, grey: 0.35, trunk: 0.6, sgangCtx: 0.9, sgang: 1.3,
};

export class NerviSpinali extends AnatomyModel {
  constructor() {
    super({ tilt: -0.3 });
    const body = mm(0, 42, 1219);
    this.addStand({ radius: 0.27, z: 0, rod: [body.x, 0.02, body.y, body.z] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('nervi-spinali.glb', REAL);
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d * S);
    for (const m of this.parts.get('sgang').meshes) m.geometry.scale(1.1, 1.7, 1.1);
    // il tratto di midollo: taglio netto alle due quote, con la sezione disegnata in alto
    for (const id of ['cord', 'antHorn', 'postHorn', 'greyMid', 'iml', 'dura']) this.#clampY(id, mm(0, 0, CUT[0]).y, mm(0, 0, CUT[1]).y);
    this.#clampY('trunk', mm(0, 0, BLOCK.z[0]).y, mm(0, 0, BLOCK.z[1]).y);
    for (const id of ['rib8', 'rib9', 'transv', 'erector', 'anteriorD']) this.#clampBox(id, WALL);
    // giunzioni piane tra i tre tratti in cui è diviso il tubo reale del nervo
    this.#clampBox('nerve', { ...WALL, x: [-22.5, 0] });
    this.#clampBox('anterior', { ...WALL, x: [-32.6, -22.5] });
    this.#clampBox('anteriorD', { ...WALL, x: [WALL.x[0], -32.6] });
    this.#cap('rib8', { axis: 'x', at: mm(WALL.x[0], 0, 0).x });
    this.#cap('cord');
    this.#cap('greyMid', { lift: 0.0005 });
    this.#cap('antHorn', { lift: 0.001, halves: true });
    this.#cap('postHorn', { lift: 0.001, halves: true });
    this.#cap('iml', { lift: 0.0015, halves: true });
    // blocco di colonna attorno al foro intervertebrale destro, per i primi piani
    this.#block('vT8', 'bT8', 'vertebra T8', BONE, BLOCK);
    this.#block('vT8', 'gT8', 'vertebra T8', BONE, BLOCK, { ghost: true, opacity: 0.3 });
    this.#block('vT9', 'bT9', 'vertebra T9', 0xe3d6b8, BLOCK);
    this.#block('disc', 'bDisc', 'disco intervertebrale T8-T9', 0xbfd0d6, BLOCK);
    this.#block('vT9', 'cT9', 'vertebra T9', 0xe3d6b8, AXIAL);
    this.#block('disc', 'cDisc', 'disco intervertebrale T8-T9', 0xbfd0d6, AXIAL);
    // estremità arrotondate dei tubi tagliati
    this.#addTo('anterior', ball(ANT_AX.at(-1), 1.35));
    this.#addTo('nerveL', ball([21.5, 69.0, 1261.1], 1.25));
    this.#roots();
    this.#branches();
    this.#markers();
    this.#fibres();
    // le etichette dei tratti lunghi stanno presso il nervo, non al centro dell'ingombro
    for (const [id, p] of Object.entries({
      anterior: [-33, 72, 1265], posterior: [-18, 82, 1254.5], trunk: [-18, 61, 1275], cord: [0, 70, 1281],
      rootA: [-9, 66.5, 1262], rootP: [-6, 73, 1266.5], sulcusP: [-4.4, 74.6, 1282], sulcusA: [-4.2, 65.4, 1267],
    })) {
      const part = this.parts.get(id);
      part.center.copy(mm(...p));
      part.top = part.center.y;
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

  // Taglio netto: i vertici oltre le due quote vengono portati sul piano.
  #clampY(id, y0, y1) {
    for (const m of this.parts.get(id).meshes) {
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) p.setY(i, Math.min(y1, Math.max(y0, p.getY(i) + m.position.y)) - m.position.y);
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }

  // Taglio netto di una parte chiusa lungo le facce di un parallelepipedo (mm).
  #clampBox(id, box) {
    const a = mm(box.x[0], box.y[0], box.z[0]), b = mm(box.x[1], box.y[1], box.z[1]);
    const lo = a.clone().min(b), hi = a.clone().max(b);
    const v = new THREE.Vector3();
    for (const m of this.parts.get(id).meshes) {
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).add(m.position).clamp(lo, hi).sub(m.position);
        p.setXYZ(i, v.x, v.y, v.z);
      }
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }

  // Faccia di taglio di un tubo: il contorno reale sul piano del taglio (il
  // punto più esterno in ogni direzione), chiuso a ventaglio. `axis`: 'y' per
  // la faccia superiore, 'x' per quella laterale; `at`: coordinata del piano;
  // `halves`: un contorno per lato (corna, nuclei pari).
  #cap(id, { axis = 'y', at = mm(0, 0, CUT[1]).y, lift = 0, halves = false } = {}) {
    const part = this.parts.get(id);
    const mid = mm(0, 0, 0).x;
    const [u, w] = axis === 'y' ? ['x', 'z'] : ['z', 'y'];
    const groups = halves ? [[], []] : [[]];
    const v = new THREE.Vector3();
    for (const m of part.meshes) {
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).add(m.position);
        if (Math.abs(v[axis] - at) > 1e-5) continue;
        groups[halves && v.x < mid ? 1 : 0].push([v[u], v[w]]);
      }
    }
    for (const pts of groups) {
      if (pts.length < 3) continue;
      const cu = pts.reduce((a, q) => a + q[0], 0) / pts.length, cw = pts.reduce((a, q) => a + q[1], 0) / pts.length;
      const N = 40;
      const far = new Array(N).fill(null);
      for (const [a, b] of pts) {
        const k = Math.floor(((Math.atan2(b - cw, a - cu) + Math.PI) / (2 * Math.PI)) * N) % N;
        const d = Math.hypot(a - cu, b - cw);
        if (!far[k] || d > far[k][2]) far[k] = [a, b, d];
      }
      const ring = far.filter(Boolean);
      const pos = [];
      const put = (a, b) => {
        v[axis] = at + lift;
        v[u] = a;
        v[w] = b;
        pos.push(v.x, v.y, v.z);
      };
      put(cu, cw);
      for (const [a, b] of ring) put(a, b);
      // (u, w, asse) è una terna sinistrorsa: per una normale uscente lungo +asse si gira da w verso u
      const idx = [];
      for (let i = 0; i < ring.length; i++) idx.push(0, 1 + ((i + 1) % ring.length), 1 + i);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      this.#addTo(id, g);
    }
  }

  // Copia di una parte ossea ritagliata in un parallelepipedo (mm): i vertici
  // esterni vengono portati sulle facce, che risultano piane e chiuse.
  #block(src, id, name, color, box, opts = { double: true }) {
    const a = mm(box.x[0], box.y[0], box.z[0]), b = mm(box.x[1], box.y[1], box.z[1]);
    const lo = a.clone().min(b), hi = a.clone().max(b);
    const geos = this.parts.get(src).meshes.map((m) => {
      const g = m.geometry.clone().translate(m.position.x, m.position.y, m.position.z);
      const p = g.attributes.position, n = g.attributes.normal;
      const v = new THREE.Vector3(), c = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        c.copy(v).clamp(lo, hi);
        if (c.equals(v)) continue;
        // la normale dei vertici spostati è quella della faccia su cui finiscono
        const d = v.sub(c);
        const ax = Math.abs(d.x) > Math.abs(d.y) ? (Math.abs(d.x) > Math.abs(d.z) ? 'x' : 'z') : Math.abs(d.y) > Math.abs(d.z) ? 'y' : 'z';
        n.setXYZ(i, ax === 'x' ? Math.sign(d.x) : 0, ax === 'y' ? Math.sign(d.y) : 0, ax === 'z' ? Math.sign(d.z) : 0);
        p.setXYZ(i, c.x, c.y, c.z);
      }
      // ciò che è finito sul piano d'appoggio non serve: il blocco poggia sulla pagina
      const ix = g.index.array, keep = [];
      const down = (i) => p.getY(i) - lo.y < 1e-6;
      for (let t = 0; t < ix.length; t += 3) if (down(ix[t]) + down(ix[t + 1]) + down(ix[t + 2]) < 2) keep.push(ix[t], ix[t + 1], ix[t + 2]);
      g.setIndex(keep);
      return g;
    });
    this.addPart(id, name, color, geos, opts);
  }

  // Aggiunge geometrie a una parte esistente (stesso materiale, stesso nome).
  #addTo(id, ...geos) {
    const part = this.parts.get(id);
    for (const geo of geos) {
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
  }

  // Radicole, radice anteriore e solchi (vedi commento in testa).
  #roots() {
    // una radicola: dal solco, con una lieve curva, al punto di riunione
    const rootlet = (z, [right, back], join, s) => {
      const a = cord(z, right, back, s);
      const b = side(join, s);
      const mid = [a[0] + (b[0] - a[0]) * 0.55, a[1] + (b[1] - a[1]) * 0.45, a[2] + (b[2] - a[2]) * 0.3];
      return tube([a, mid, b], [0.2, 0.32, 0.36], { seg: 14, radial: 6 });
    };
    const radP = (s) => ROOTLETS_P.map((z) => rootlet(z, SULCUS_P, P_JOIN, s));
    const radA = (s) => ROOTLETS_A.map((z) => rootlet(z, SULCUS_A, A_JOIN, s));
    const rootA = (s) => tube(A_ROOT.map((p) => side(p, s)), [0.75, 0.9, 0.95, 0.95], { seg: 24 });
    this.addPart('radP', 'radicole posteriori', 0x7fb0ee, radP(1));
    this.addPart('radA', 'radicole anteriori', 0xee8f86, radA(1));
    this.addPart('rootA', 'radice anteriore', 0xd9544c, [rootA(1)]);
    this.addPart('rootAL', 'radice anteriore di sinistra', 0xd9aaa6, [rootA(-1), ...radA(-1)]);
    this.#addTo('rootPL', ...radP(-1));

    const line = ([right, back], s) => {
      const pts = [];
      for (let z = CUT[0] + 0.5; z <= CUT[1]; z += 5.4) pts.push(cord(z, right, back, s));
      return tube(pts, 0.28, { seg: 30, radial: 6 });
    };
    this.addPart('sulcusP', 'solco laterale posteriore', SENS, [line(SULCUS_P, 1), line(SULCUS_P, -1)]);
    this.addPart('sulcusA', 'solco laterale anteriore', MOT, [line(SULCUS_A, 1), line(SULCUS_A, -1)]);
  }

  // Ramo meningeo e rami del ramo posteriore.
  #branches() {
    // dal nervo, subito fuori dal foro, di nuovo dentro il canale davanti al ganglio
    const stem = [[-19.6, 68.0, 1261.3], [-17.6, 67.0, 1262.8], [-14.2, 66.7, 1263.3], [-11, 66.0, 1263.0], [-9.2, 64.9, 1262.4]];
    this.addPart('meningeal', 'ramo meningeo ricorrente', 0x9b5de5, [
      tube(stem, 0.42, { seg: 24, radial: 8 }),
      tube([stem.at(-1), [-8.6, 64.2, 1264.6], [-8.0, 64.1, 1267.5]], [0.36, 0.22], { seg: 12, radial: 6 }),
      tube([stem.at(-1), [-8.6, 63.8, 1260.2], [-8.2, 63.3, 1257.2]], [0.36, 0.22], { seg: 12, radial: 6 }),
      tube([stem.at(-1), [-8.4, 65.6, 1262.0], [-7.8, 66.6, 1261.2]], [0.36, 0.22], { seg: 12, radial: 6 }),
    ]);

    // raccordo tra il nervo e il tubo reale del ramo posteriore
    this.#addTo('posterior', tube([[-22.1, 69.3, 1261.0], [-22.4, 69.2, 1259.6], [-22.2, 69.0, 1258.3]], 0.9, { seg: 10, caps: false }));
    this.addPart('postMed', 'ramo mediale del ramo posteriore', 0xc98a2e, [
      tube([POST_END, [-16.5, 90.6, 1250.6], [-12.5, 92.6, 1248], [-8.5, 94, 1245.8], [-6, 95, 1244]], [0.85, 0.7, 0.45], { seg: 24 }),
      tube([[-14.5, 91.7, 1249.3], [-13.5, 94.5, 1247], [-12, 97.5, 1243.5]], [0.5, 0.3], { seg: 12, radial: 6 }),
    ]);
    this.addPart('postLat', 'ramo laterale del ramo posteriore', 0xc98a2e, [
      tube([POST_AT, [-21.5, 83.6, 1251.6], [-29, 88.6, 1248.4], [-39, 92.8, 1245], [-51, 96, 1241.2], [-60, 97.6, 1238]], [0.85, 0.8, 0.6, 0.4], { seg: 32 }),
      tube([[-39, 92.8, 1245], [-42, 97, 1242.5], [-44.5, 101.5, 1239]], [0.5, 0.3], { seg: 12, radial: 6 }),
    ]);
  }

  #markers() {
    // foro intervertebrale: un anello nel piano sagittale, attorno al ganglio
    const ring = new THREE.TorusGeometry(1, 0.085, 10, 48);
    ring.scale(4.9 * S, 5.4 * S, 4.9 * S);
    ring.rotateY(Math.PI / 2);
    const c = mm(-14.6, 70.0, 1259.4);
    ring.translate(c.x, c.y, c.z);
    this.addPart('foramen', 'foro intervertebrale (tra T8 e T9)', 0x19c2d6, [ring]);

    // corpi neuronali
    this.addPart('somaS', 'neuroni pseudounipolari a T', SENS, [ball(GANGLION, 1.15)]);
    this.addPart('somaM', 'motoneuroni somatici alfa e gamma (lamina 9)', MOT, [ball(cord(1266.5, 2.9, -1.9), 0.75)]);
    this.addPart('somaG', 'neuroni postgangliari', POST, [ball(SGANG, 1.2)]);
    for (const id of ['somaS', 'somaM', 'somaG']) {
      const part = this.parts.get(id);
      part.mat.depthTest = false;
      for (const m of part.meshes) m.renderOrder = 18;
    }
  }

  // Percorsi delle fibre lungo l'asse dei tubi reali.
  #fibres() {
    const path = (pts, dy = 0, dz = 0) => pts.map(([x, y, z]) => mm(x, y + dy, z + dz));
    const rev = (a) => [...a].reverse();
    const r = 0.0026;
    // sensitiva: ramo periferico (verso il ganglio) e ramo centrale (verso il corno posteriore)
    this.addLink('fSensP', path([...rev(ANT_AX), ...rev(NERVE_AX)], 0.5), { color: SENS, r });
    this.addLink('fSensC', path([GANGLION, ...ROOT_P_AX, cord(1267.8, 3.0, 2.6), cord(1268.2, 2.9, 1.7)]), { color: SENS, r });
    // motoria somatica: dalla testa del corno anteriore al muscolo
    const out = [cord(1265.6, 3.4, -3.4), cord(1264.6, 3.7, -4.3), ...A_ROOT];
    this.addLink('fMot', path([cord(1266.5, 2.9, -1.9), ...out, ...NERVE_AX.slice(2), ...ANT_AX], -0.45), { color: MOT, r });
    // viscerale pregangliare: lamina 7 › radice anteriore › ramo comunicante bianco › ganglio
    // (nei rami comunicanti la fibra corre accanto al tubo, per restare visibile)
    const beside = (pts, dx, dz) => pts.map(([x, y, z], i) => (i === pts.length - 1 ? [x, y, z] : [x + dx, y, z + dz]));
    this.addLink('fPre', path([cord(1266.2, 4.0, 0.1), cord(1266, 3.9, -2.2), ...out, [-20.5, 68.7, 1260.2], ...beside(WHITE_AX, -1.1, 0.2)], 0, -0.35), { color: PRE, r });
    // postgangliare: ganglio › ramo comunicante grigio › nervo › periferia
    this.addLink('fPost', path([SGANG, ...beside([...GREY_AX.slice(1), [-16.5, 68.55, 1260.4]], 0.2, 1.1), ...NERVE_AX.slice(2), ...ANT_AX], 0, 0.45), { color: POST, r });
  }
}
