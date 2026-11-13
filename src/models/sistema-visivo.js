// Modello del sistema visivo: dalla retina alla corteccia calcarina, più l'arco
// del riflesso pupillare.
//
// MESH REALI (BodyParts3D, public/meshes/sistema-visivo.glb, vedi
// meshes/sistema-visivo.json): sclera, cornea, cristallino, iride, retina
// (divisa in quadranti nasali/temporali, superiori/inferiori), nervi ottici,
// chiasma, tratti ottici, corpi genicolati laterali, collicoli superiori,
// talamo, tronco (mesencefalo, peduncoli, ponte), ventricoli laterali, nucleo
// lenticolare (putamen e globo pallido), lobi occipitali, giri degli emisferi,
// ramo inferiore dell'oculomotore, ganglio ciliare, nervi ciliari brevi.
//
// RICOSTRUITO A MANO nella stessa terna, agganciato alle mesh reali:
// - Radiazione ottica (lamina continua dal corpo genicolato laterale alla
//   corteccia calcarina, in tre fasce: superiore o dorsale, intermedia, inferiore
//   con l'ansa di Meyer). Decorso: l'ansa di Meyer va in avanti e lateralmente
//   sopra il tetto del corno temporale reale, arriva all'altezza del suo apice
//   (24 mm dal polo temporale della mesh), piega indietro lungo la metà superiore
//   della parete laterale del corno, poi nello strato sagittale lateralmente a
//   trigono e corno occipitale, fino al labbro inferiore della calcarina; il
//   fascio superiore sale dietro il nucleo lenticolare (retrolenticolare) e
//   copre la parete laterale del trigono fino al labbro superiore.
//   Fonti:
//   · Rodrigues EM et al., "Anatomy of the optic radiations from the white
//     matter fiber dissection perspective", Surg Neurol Int 2022;13:309
//     https://pmc.ncbi.nlm.nih.gov/articles/PMC9345124/
//     (tre fasci; tetto e metà superiore della parete laterale del corno
//     temporale; margine anteriore a circa 25 mm, 22-30, dal polo temporale e
//     circa 2 mm davanti all'apice del corno; parete laterale del trigono).
//   · Yang JYM et al., "Optic radiation tractography in pediatric brain surgery
//     applications", Front Neurosci 2019;13:1254
//     https://pmc.ncbi.nlm.nih.gov/articles/PMC6879599/
//     (polo temporale-ansa di Meyer 29,4 ± 3,5 mm; dissezioni 27 mm, 15-37;
//     apice del corno-ansa sul piano sagittale circa 0-3 mm; fascio posteriore
//     alla calcarina superiore, anteriore alla calcarina inferiore, intermedio
//     al polo occipitale).
// - Corteccia calcarina (area 17): due lamine, labbro superiore (cuneo) e
//   inferiore (giro linguale), applicate sulla faccia mediale del lobo
//   occipitale reale e ripiegate nella profondità del solco calcarino, la cui
//   posizione è letta sulla mesh (da 1545 mm di quota in avanti a 1538 mm al
//   polo; profondità circa 11 mm); al polo girano sulla faccia posteriore.
//   · StatPearls, "Neuroanatomy, Visual Pathway" (vedi sotto): terminazione
//     della radiazione su cuneo e giro linguale, ai due lati della calcarina.
// - Fibre retino-genicolate (vie animate dentro nervi, chiasma e tratti reali):
//   le nasali incrociano nel chiasma, le temporali no; il decorso segue l'asse
//   delle mesh reali.
//   · StatPearls, "Neuroanatomy, Visual Pathway", NCBI Bookshelf NBK553189
//     https://www.ncbi.nlm.nih.gov/books/NBK553189/
// - Area pretettale (nucleo olivare pretettale), nucleo di Edinger-Westphal,
//   tronco del nervo oculomotore (dalla fossa interpeduncolare al ramo inferiore
//   reale) e le vie del riflesso fotico: fibre nasali al pretetto opposto,
//   temporali a quello dello stesso lato, proiezione pretettale bilaterale ai
//   nuclei di Edinger-Westphal (la quota crociata è disegnata nella commessura
//   posteriore), ganglio ciliare, nervi ciliari brevi.
//   · StatPearls, "Neuroanatomy, Pupillary Light Reflexes and Pathway"
//     https://www.statpearls.com/articlelibrary/viewarticle/890/
//   Le posizioni dei due nuclei, che BodyParts3D non contiene, sono stimate
//   rispetto alle mesh reali di collicolo superiore, acquedotto e mesencefalo.
// - Macula, anelli che indicano i punti di lesione e i due dischi del campo
//   visivo (schema, non anatomia).
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale,
// z anteriore. Le misure a mano sono date in millimetri nella terna di
// BodyParts3D (distanza dal piano mediano, y verso dietro, z verso l'alto).
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { AnatomyModel } from '../model.js';
import { FONT, FONT_SCALE } from '../ui.js';
import { V, taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0045; // unità per millimetro (come meshes/sistema-visivo.json)
const MID = 0.00295; // piano mediano delle mesh
const mm = (ax, y, z) => V(ax * S, (z - 1480) * S, -(y + 78) * S); // lato destro
const path = (list) => list.map((p) => mm(...p));
const flip = (pts) => pts.map((p) => V(2 * MID - p.x, p.y, p.z)); // lato sinistro
const mir = (g) => mirror(g).translate(2 * MID, 0, 0);

// colori: arancio = ciò che vede il campo visivo sinistro (va all'emisfero
// destro); blu = campo visivo destro (emisfero sinistro)
export const FIELD_L = 0xe0782a;
export const FIELD_R = 0x2f7fd0;
const WHITE = 0xf1ead8, NERVE = 0xe6c36a;
const TRACT_COL = 0xd8b76a; // sostanza bianca della via ottica: paglierino, per staccare dalla carta
const SUP = 0x3f9a68, INF = 0xc9485b;

const REAL = {
  hemi: ['emisferi cerebrali', 0xe7c9b9, { ghost: true, opacity: 0.07 }],
  occipital: ['lobo occipitale', 0xd9a48f, { ghost: true, opacity: 0.2 }],
  stem: ['tronco encefalico', 0xe3cdb6, { ghost: true, opacity: 0.14 }],
  thalamus: ['talamo', 0xc9a27a, { ghost: true, opacity: 0.2 }],
  lvRest: ['ventricolo laterale', 0x3f9ec4, { ghost: true, opacity: 0.16 }],
  lvTemp: ['corno temporale del ventricolo laterale', 0x3f9ec4, { ghost: true, opacity: 0.22 }],
  lentiform: ['nucleo lenticolare', 0xd97b2b, { ghost: true, opacity: 0.2 }],
  scleraR: ['sclera', 0xf3efe6, { ghost: true, opacity: 0.2 }],
  scleraL: ['sclera', 0xf3efe6, { ghost: true, opacity: 0.2 }],
  corneaR: ['cornea', 0x9fc7dd, { ghost: true, opacity: 0.3 }],
  corneaL: ['cornea', 0x9fc7dd, { ghost: true, opacity: 0.3 }],
  lens: ['cristallino', 0xcfe3ee],
  iris: ['iride (muscolo sfintere della pupilla)', 0x6b4a2f],
  retRTS: ['emiretina temporale destra, quadrante superiore', FIELD_L],
  retRTI: ['emiretina temporale destra, quadrante inferiore', 0xc4621c],
  retRNS: ['emiretina nasale destra, quadrante superiore', FIELD_R],
  retRNI: ['emiretina nasale destra, quadrante inferiore', 0x2466ad],
  retLNS: ['emiretina nasale sinistra, quadrante superiore', FIELD_L],
  retLNI: ['emiretina nasale sinistra, quadrante inferiore', 0xc4621c],
  retLTS: ['emiretina temporale sinistra, quadrante superiore', FIELD_R],
  retLTI: ['emiretina temporale sinistra, quadrante inferiore', 0x2466ad],
  opticNerveR: ['nervo ottico destro', TRACT_COL],
  opticNerveL: ['nervo ottico sinistro', TRACT_COL],
  chiasm: ['chiasma ottico', 0xcfa650],
  tractR: ['tratto ottico destro', TRACT_COL],
  tractL: ['tratto ottico sinistro', TRACT_COL],
  lgbR: ['corpo genicolato laterale destro', 0x8e5bb5],
  lgbL: ['corpo genicolato laterale sinistro', 0x8e5bb5],
  colliculus: ['collicolo superiore', 0x5aa7a0],
  cn3inf: ['nervo oculomotore, ramo inferiore', NERVE],
  ciliaryGanglion: ['ganglio ciliare', 0xd9632b],
  shortCiliary: ['nervi ciliari brevi', NERVE],
};

// --- radiazione ottica: tre linee guida (lato destro, mm) -------------------
// inferiore: ansa di Meyer, sopra il tetto e lungo la parete laterale del corno temporale
const MEYER = [
  [21, -76, 1540.5], [25, -88, 1540.5], [29, -98, 1540], [33, -103.5, 1539], [37.5, -99, 1539.5],
  [40.5, -88, 1540.5], [41.5, -76, 1541.5], [41, -64, 1543], [38.5, -52, 1544], [33.5, -40, 1543.5],
  [27.5, -28, 1541.5], [22, -16, 1538.5], [14, -8, 1536.5], [7, -6, 1535.5],
];
// intermedia: attraversa il tetto del corno temporale, fino al polo occipitale
const CENTRAL = [
  [21.5, -75, 1541], [27, -80, 1541.5], [34, -82, 1542.5], [40, -76, 1544.5], [41.5, -66, 1547],
  [39.5, -54, 1550], [35, -42, 1550.5], [28.5, -30, 1548.5], [21.5, -18, 1545.5], [14.5, -7, 1542.5], [9, 0, 1540.5],
];
// superiore: diretta, retrolenticolare, sulla parete laterale del trigono
const DORSAL = [
  [21, -74, 1542], [25, -70, 1546], [30.5, -65, 1551], [36.5, -58, 1555], [37.5, -48, 1557],
  [33.5, -38, 1556], [27, -27, 1554], [20, -17, 1549.5], [13, -10, 1547.5], [7, -8, 1546],
];

// Superficie che passa per le tre linee: u lungo il decorso, v = 0, 1, 2 sulle linee.
function sheetFn(lines) {
  const cs = lines.map((l) => new THREE.CatmullRomCurve3(path(l), false, 'centripetal'));
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  return (u, v, out) => {
    const t = Math.min(1, Math.max(0, u));
    cs[0].getPointAt(t, a);
    cs[1].getPointAt(t, b);
    cs[2].getPointAt(t, c);
    return out.set(0, 0, 0)
      .addScaledVector(a, ((v - 1) * (v - 2)) / 2)
      .addScaledVector(b, -v * (v - 2))
      .addScaledVector(c, (v * (v - 1)) / 2);
  };
}

// Lamina di spessore 2t tra v0 e v1 della superficie.
function slab(fn, v0, v1, { nu = 56, nv = 6, t = 0.0035 } = {}) {
  const pos = [];
  const p = new THREE.Vector3(), q = new THREE.Vector3(), du = new THREE.Vector3(), dv = new THREE.Vector3(), n = new THREE.Vector3();
  const e = 0.004;
  const grid = [];
  for (let i = 0; i <= nu; i++)
    for (let j = 0; j <= nv; j++) {
      const u = i / nu, v = v0 + ((v1 - v0) * j) / nv;
      fn(u, v, p);
      du.copy(fn(u + e, v, q)).sub(fn(u - e, v, n));
      dv.copy(fn(u, v + e, q)).sub(fn(u, v - e, n));
      n.crossVectors(du, dv).normalize();
      grid.push([p.clone(), n.clone()]);
    }
  for (const sgn of [1, -1]) for (const [g, m] of grid) pos.push(g.x + m.x * t * sgn, g.y + m.y * t * sgn, g.z + m.z * t * sgn);
  const w = nv + 1, M = grid.length;
  const idx = [];
  const quad = (a, b, c, d) => idx.push(a, b, c, b, d, c);
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const a = i * w + j, b = a + w, c = a + 1, d = b + 1;
      quad(a, b, c, d);
      quad(M + a, M + c, M + b, M + d);
    }
  for (let i = 0; i < nu; i++) {
    const a = i * w, b = a + w;
    quad(a, M + a, b, M + b);
    quad(a + nv, b + nv, M + a + nv, M + b + nv);
  }
  for (let j = 0; j < nv; j++) {
    quad(j, j + 1, M + j, M + j + 1);
    const a = nu * w + j;
    quad(a, M + a, a + 1, M + a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Anello attorno a un punto della via, perpendicolare alla direzione data.
function ring(center, dir, R, tube = 0.0038) {
  const g = new THREE.TorusGeometry(R, tube, 10, 40);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), dir.clone().normalize()));
  g.translate(center.x, center.y, center.z);
  return g;
}

// --- fibre retino-genicolate (lato destro, mm) --------------------------------
const DISC = [29.3, -142.3, 1519.8];
const NERVE_T = [[27.9, -138, 1521.8], [24.6, -132, 1523.6], [19.7, -126, 1526], [14.3, -120, 1529.2], [9.9, -114, 1533.6], [6.7, -108, 1537.6]];
const NERVE_N = [[26.8, -138, 1521.8], [23.3, -132, 1523.6], [18.2, -126, 1526], [12.6, -120, 1529.2], [8, -114, 1533.6], [4.6, -108.5, 1537.6]];
const TRACT = [[12, -100.5, 1540.8], [18, -96, 1541], [22, -90, 1540.7], [23.4, -84, 1540.1]];
const LGB = [21, -77, 1540];
const EYE = V(0.1371, 0.1713, 0.329); // centro del bulbo destro
const RET_T = V(EYE.x + 0.0375, EYE.y, EYE.z - 0.0315);
const RET_N = V(EYE.x - 0.0375, EYE.y, EYE.z - 0.0315);

const DARK = new THREE.Color(0x2a2520);

export class VisualSystem extends AnatomyModel {
  constructor() {
    // la via ottica giace su un piano quasi orizzontale: poco reclinato, si guarda dall'alto
    super({ tilt: -0.2 });
    this.inner.position.set(0, 0.07, -0.05);
    this.addStand({ radius: 0.2, z: -0.07, rod: [MID, -0.05, 0.105, 0.01] });
    this.blind = new Set();
    this.spare = false;
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('sistema-visivo.glb', REAL);
    this.#radiation();
    this.#reflexParts();
    this.#cuts();
    this.#pathways();
    this.#fields();
  }

  #radiation() {
    const fn = sheetFn([MEYER, CENTRAL, DORSAL]);
    const add = (id, name, color, v0, v1) => {
      const g = slab(fn, v0, v1);
      const left = mir(g); // prima di addPart, che ricentra la geometria
      this.addPart(`${id}R`, `${name}, destra`, color, [g], { double: true });
      this.addPart(`${id}L`, `${name}, sinistra`, color, [left], { double: true });
    };
    add('radInf', 'radiazione ottica, fibre inferiori (ansa di Meyer)', INF, -0.35, 0.5);
    add('radCen', 'radiazione ottica, fibre intermedie', 0xe6d7a8, 0.5, 1.5);
    add('radSup', 'radiazione ottica, fibre superiori (retrolenticolari)', SUP, 1.5, 2.35);
    // area 17: labbri della scissura calcarina, dalla profondità del solco alla faccia mediale
    const bank = (sign) => (u, v, out) => {
      const y = -46 + 54 * Math.min(1, Math.max(0, u));
      const k = Math.max(0, (y + 4) / 12); // verso il polo la faccia mediale gira all'esterno
      const xs = 2.6 + 9 * k * k;
      const depth = 11 * (1 - 0.6 * k);
      const w = Math.min(1, Math.max(0, v));
      // profilo: fondo del solco › labbro › faccia mediale
      const ax = w < 0.5 ? xs + depth * (1 - w / 0.5) ** 1.3 : xs;
      const dz = w < 0.5 ? 0.8 + 1.2 * (w / 0.5) ** 2 : 2 + 6.5 * ((w - 0.5) / 0.5);
      return out.copy(mm(ax, y, 1545 - ((y + 45) * 7) / 50 + sign * dz));
    };
    for (const [id, sign, name, color] of [
      ['v1sup', 1, 'area 17, labbro superiore della scissura calcarina', 0x2f7d4f],
      ['v1inf', -1, 'area 17, labbro inferiore della scissura calcarina', 0xa8324a],
    ]) {
      const g = slab(bank(sign), 0, 1, { nu: 30, nv: 12, t: 0.003 });
      const left = mir(g);
      this.addPart(`${id}R`, `${name}, destra`, color, [g], { double: true });
      this.addPart(`${id}L`, `${name}, sinistra`, color, [left], { double: true });
    }
    // macula lutea: 1 mm lateralmente al polo posteriore
    const mac = ellipsoid([EYE.x + 0.0045, EYE.y, 0.2835], [0.011, 0.011, 0.003]);
    this.addPart('macula', 'macula lutea', 0xe9c84a, [mac, mir(mac)]);
  }

  #reflexParts() {
    const pair = (g) => [g, mir(g)];
    const c = (p) => mm(...p).toArray();
    // nucleo olivare pretettale: davanti e sopra il collicolo superiore, a lato della commessura posteriore
    this.addPart('pretectal', 'area pretettale (nucleo olivare pretettale)', 0xe3b23c, pair(ellipsoid(c([4.6, -75, 1545.4]), [0.009, 0.009, 0.009])));
    // nucleo di Edinger-Westphal: paramediano, ventrale all'acquedotto, a livello del collicolo superiore
    this.addPart('ew', 'nucleo di Edinger-Westphal', 0xc9485b, pair(ellipsoid(c([1.9, -79.6, 1541]), [0.0055, 0.011, 0.0065])));
    // tronco dell'oculomotore: fossa interpeduncolare › parete del seno cavernoso › fessura orbitaria superiore
    this.addPart('cn3', 'nervo oculomotore', NERVE,
      pair(taperTube(path([[3.6, -91.5, 1532], [7, -100, 1531], [11, -108, 1531], [14.6, -114.4, 1530.5]]), 0.005, { seg: 24, radial: 10 })));
  }

  // Punti di lesione, tutti sul lato destro.
  #cuts() {
    const RED = 0xd43d3d;
    const at = (p) => mm(...p);
    const dir = (a, b) => mm(...b).sub(mm(...a));
    this.addPart('cutNerve', 'lesione del nervo ottico destro', RED, [ring(at([19, -126, 1526]), dir([24.6, -132, 1523.6], [14.3, -120, 1529.2]), 0.02)]);
    this.addPart('cutChiasm', 'lesione mediana del chiasma', RED, [ring(V(MID, 0.27, 0.122), V(1, 0, 0), 0.03)]);
    this.addPart('cutTract', 'lesione del tratto ottico destro', RED, [ring(at([22, -90, 1540.7]), dir([18, -96, 1541], [23.4, -84, 1540.1]), 0.019)]);
    this.addPart('cutMeyer', "lesione dell'ansa di Meyer destra", RED, [ring(at([41, -86, 1540]), V(0, 0, 1), 0.024)]);
    this.addPart('cutSup', 'lesione delle fibre superiori della radiazione destra', RED, [ring(at([37.5, -48, 1557.5]), dir([36.5, -58, 1555], [33.5, -38, 1556]), 0.024)]);
    this.addPart('cutCortex', 'lesione della corteccia calcarina destra', RED, [ring(V(0.05, 0.272, -0.3), V(0, 0, 1), 0.058)]);
  }

  #pathways() {
    const link = (id, pts, color, r = 0.0032) => this.addLink(id, pts, { color, r });
    const lgbL = flip([mm(...LGB)])[0];
    // temporali: non crociate. nasali: crociate nel chiasma.
    const tmp = [RET_T, mm(...DISC), ...path(NERVE_T), mm(6.6, -104, 1540)];
    const nas = [RET_N, mm(...DISC), ...path(NERVE_N), V(MID, 0.272, 0.124)];
    const tract = path(TRACT);
    const cross = [V(MID - 0.02, 0.2715, 0.113), ...flip(tract)];
    link('fRT', [...tmp, ...tract, mm(...LGB)], FIELD_L);
    link('fRN', [...nas, ...cross, lgbL], FIELD_R);
    link('fLT', flip([...tmp, ...tract, mm(...LGB)]), FIELD_R);
    link('fLN', flip([...nas, ...cross, lgbL]), FIELD_L);

    // radiazione ottica
    const offset = (l, dy) => path(l).map((p) => p.add(V(0, dy, 0)));
    link('gInfR', offset(MEYER, 0.002), 0x8f1f38, 0.0036);
    link('gSupR', offset(DORSAL, 0.002), 0x1f6b43, 0.0036);
    link('gInfL', flip(offset(MEYER, 0.002)), 0x8f1f38, 0.0036);
    link('gSupL', flip(offset(DORSAL, 0.002)), 0x1f6b43, 0.0036);

    // vie extragenicolate: lasciano il tratto prima del corpo genicolato (braccio del collicolo superiore)
    const GREEN = 0x1f9d57;
    const toPt = path([[23.4, -84, 1540.1], [19, -79, 1541.2], [12, -75.5, 1543.2], [7.5, -75, 1545], [5, -75, 1545.4]]);
    const toSc = path([[23.4, -84, 1540.1], [18.5, -78.5, 1541], [11.5, -74, 1541.8], [6, -71.5, 1541.6]]);
    link('tPtR', toPt, GREEN);
    link('tPtL', flip(toPt), GREEN);
    link('tScR', toSc, 0x2a8f88);
    link('tScL', flip(toSc), 0x2a8f88);

    // riflesso fotico con luce nell'occhio destro
    link('pNerveT', tmp, GREEN);
    link('pNerveN', nas, GREEN);
    link('pTractR', [mm(6.6, -104, 1540), ...tract, ...toPt.slice(1)], GREEN);
    link('pTractL', [V(MID, 0.272, 0.124), ...cross, ...flip(toPt.slice(1))], GREEN);
    const same = path([[4.4, -75.6, 1545], [3.4, -78, 1543.6], [2.1, -79.4, 1542.2]]);
    const other = [mm(4.2, -74.6, 1545.8), V(MID, (1546.8 - 1480) * S, -(-74.3 + 78) * S), ...flip(path([[2.8, -76.6, 1545], [2.1, -79.2, 1542.6]]))];
    link('ptEwRR', same, GREEN, 0.0026);
    link('ptEwRL', other, GREEN, 0.0026);
    link('ptEwLL', flip(same), GREEN, 0.0026);
    link('ptEwLR', flip(other), GREEN, 0.0026);
    const efferent = path([[1.9, -80.2, 1540.4], [2.7, -86, 1536], [3.6, -91.5, 1532], [7, -100, 1531], [11, -108, 1531], [14.6, -114.4, 1530.5], [17, -120, 1527], [19.5, -126, 1524], [25.2, -132.3, 1525.2]]);
    const BLUE = 0x2f6fe0;
    link('ewCgR', efferent, BLUE);
    link('ewCgL', flip(efferent), BLUE);
    const ciliary = path([[25.4, -132.5, 1525.2], [28, -139, 1525], [30.5, -146, 1530.4], [30.5, -154, 1530.6], [30.5, -160.6, 1523]]);
    link('cgIrisR', ciliary, BLUE);
    link('cgIrisL', flip(ciliary), BLUE);

    // accomodazione: dalle aree corticali al collicolo superiore, poi a Edinger-Westphal
    const ctxSc = path([[16, -24, 1556], [15, -44, 1557], [9, -61, 1550], [5.5, -69.5, 1543.2]]);
    const scEw = path([[4.6, -72.5, 1541.4], [3.8, -76.4, 1540.4], [2.1, -79.4, 1540.8]]);
    link('ctxScR', ctxSc, 0x7a4fd0);
    link('ctxScL', flip(ctxSc), 0x7a4fd0);
    link('scEwR', scEw, 0x7a4fd0, 0.0026);
    link('scEwL', flip(scEw), 0x7a4fd0, 0.0026);
  }

  // Due dischi rivolti a chi guarda: il campo visivo di ciascun occhio, in
  // quadranti, come lo vede il paziente (campo destro a destra, occhio destro
  // a destra); la parte cieca è scura. Stanno in `overlay`, fuori dal
  // ribaltamento del modello, così scritte e lati restano dritti.
  #fields() {
    const R = 0.062;
    const group = (this.fieldGroup = new THREE.Group());
    group.visible = false;
    group.position.copy(this.inner.position);
    this.overlay.add(group);
    this.fieldDiscs = [];
    const basic = (color, order) => {
      const m = new THREE.MeshBasicMaterial({ color, depthTest: false, depthWrite: false, transparent: true, side: THREE.DoubleSide });
      m.userData.order = order;
      return m;
    };
    const mesh = (geo, mat) => {
      const m = new THREE.Mesh(geo, mat);
      m.renderOrder = mat.userData.order;
      return m;
    };
    for (const eye of ['R', 'L']) {
      const disc = new THREE.Group();
      disc.position.set(eye === 'R' ? 0.262 : 2 * MID - 0.262, 0.2, 0.37);
      const quads = [];
      const macula = [];
      for (const sx of [1, -1])
        for (const sy of [1, -1]) {
          const start = sx > 0 ? (sy > 0 ? 0 : -Math.PI / 2) : sy > 0 ? Math.PI / 2 : Math.PI;
          const q = mesh(new THREE.CircleGeometry(R, 20, start, Math.PI / 2), basic(0xffffff, 40));
          quads.push({ m: q, sx, sy });
          disc.add(q);
        }
      for (const sx of [1, -1]) {
        const h = mesh(new THREE.CircleGeometry(R * 0.26, 20, sx > 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI), basic(0xffffff, 41));
        macula.push({ m: h, sx });
        disc.add(h);
      }
      const ink = basic(0x2a2520, 42);
      disc.add(mesh(new THREE.RingGeometry(R, R * 1.07, 48), ink));
      disc.add(mesh(new THREE.PlaneGeometry(R * 2, R * 0.035), ink), mesh(new THREE.PlaneGeometry(R * 0.035, R * 2), ink));
      const label = new Text();
      Object.assign(label, {
        text: eye === 'R' ? 'occhio destro' : 'occhio sinistro',
        font: FONT.italic, fontSize: 0.024 * FONT_SCALE, color: 0x2a2520, anchorX: 'center', anchorY: 'bottom',
        outlineWidth: '9%', outlineColor: 0xfbf6ea,
      });
      label.position.set(0, R * 1.14, 0);
      label.frustumCulled = false;
      label.material.depthTest = false;
      label.renderOrder = 43;
      disc.add(label);
      group.add(disc);
      this.fieldDiscs.push({ eye, disc, quads, macula });
    }
  }

  // blind: chiavi "occhio:emicampo:metà", es. "R:L:S" = occhio destro, campo
  // sinistro, quadrante superiore. spare: risparmio della visione maculare.
  setFields(blind, { spare = false } = {}) {
    this.fieldGroup.visible = blind != null;
    this.blind = new Set(blind ?? []);
    this.spare = spare;
  }

  reset() {
    super.reset();
    if (this.fieldGroup) this.setFields(null);
  }

  update(dt, camera, realDt = dt) {
    super.update(dt, camera, realDt);
    if (!this.fieldGroup?.visible) return;
    const q = new THREE.Quaternion();
    this.overlay.getWorldQuaternion(q).invert().multiply(camera.quaternion);
    const side = 1;
    const col = new THREE.Color();
    const seen = (half) => col.set(half === 'L' ? FIELD_L : FIELD_R).lerp(new THREE.Color(0xffffff), 0.35);
    for (const { eye, disc, quads, macula } of this.fieldDiscs) {
      disc.quaternion.copy(q);
      let any = false;
      for (const { m, sx, sy } of quads) {
        const half = sx * side > 0 ? 'R' : 'L';
        const dark = this.blind.has(`${eye}:${half}:${sy > 0 ? 'S' : 'I'}`);
        any ||= dark;
        m.material.color.copy(dark ? DARK : seen(half));
      }
      for (const { m, sx } of macula) {
        m.visible = this.spare && any;
        m.material.color.copy(seen(sx * side > 0 ? 'R' : 'L'));
      }
    }
  }
}
