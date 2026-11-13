// Modello del midollo spinale: il midollo intero nella colonna vertebrale, le meningi e
// una sezione ingrandita del midollo cervicale.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/midollo-spinale.glb, vedi
// meshes/midollo-spinale.json): sostanza bianca del midollo (divisa per quota in tratto
// C1-C4, rigonfiamento cervicale, tratto toracico, rigonfiamento lombo-sacrale e cono),
// corni anteriore e posteriore, canale centrale e colonne di dodici fasci (solo sopra il
// taglio, quota 1486 mm dell'atlante, tra le radici C4 e C5); radici anteriori e
// posteriori e gangli spinali; guaine durali delle radici (la parte laterale di «Spinal
// dura»); «Cauda equina»; legamento longitudinale posteriore e legamenti gialli (C1-C4);
// bulbo, osso occipitale, tutte le vertebre con i dischi, sacro e coccige.
// Il file si rigenera con: node tools/mesh.mjs meshes/midollo-spinale.json
//
// LIMITI DELL'ATLANTE, misurati sulle mesh:
//  - il midollo finisce a 1055 mm, cioè al margine inferiore di L2 (gli appunti: metà
//    superiore di L2); i rigonfiamenti sono appena accennati (14,7 mm contro 12,2-13,4);
//    quello lombare cade dove deve (T9-T12), quello cervicale è un allargamento
//    progressivo verso l'alto. Qui i tratti sono delimitati così: cervicale = attacco
//    delle radici reali C5-T1; lombo-sacrale = tratto più largo della mesh.
//  - le radici sono 21 paia (C1-L1), tutte orizzontali; la «Cauda equina» è fatta di due
//    soli cordoni paramediani con brevi monconi laterali ai fori L2-S3;
//  - «Spinal dura» aderisce al midollo (0,3 mm) e finisce con lui: non è un sacco durale.
//    Se ne usano solo le guaine attorno alle radici.
//
// RICOSTRUITO A MANO nella stessa terna (quote e posizioni in millimetri dell'atlante):
//  - sacco durale: tubo attorno all'asse reale del canale centrale e, sotto il cono, dei
//    cordoni della cauda; dal forame magno a S2 (VERIFICATO: Wikipedia, "Thecal sac" —
//    https://en.wikipedia.org/wiki/Thecal_sac). Calibro STIMATO: 17-18 x 12-13 mm, quanto
//    basta a contenere midollo e radici dell'atlante.
//  - cisterna midollare (lombare): dal cono a S2, contiene filum e cauda (VERIFICATO:
//    Wikipedia, "Subarachnoid cisterns", voce Lumbar cistern —
//    https://en.wikipedia.org/wiki/Subarachnoid_cisterns).
//  - filum terminale: dall'apice del cono lungo l'asse dei cordoni reali della cauda; parte
//    interna fino a S2, poi legamento coccigeo rivestito di dura fino al dorso del primo
//    segmento coccigeo (VERIFICATO: Wikipedia, "Filum terminale" —
//    https://en.wikipedia.org/wiki/Filum_terminale). Calibro STIMATO.
//  - legamenti denticolati: nastro laterale della pia, tra radici anteriori e posteriori,
//    con un dente triangolare fissato alla dura tra una radice e la successiva; il primo
//    sotto il forame magno (VERIFICATO: Wikipedia, "Denticulate ligaments" —
//    https://en.wikipedia.org/wiki/Denticulate_ligaments). Modellati solo per C1-C4, con i
//    denti a metà tra le radici reali.
//  - radici T9-S3: le radici reali T9-L1 (orizzontali) sono state tolte e rifatte oblique,
//    fino ai gangli reali; le radici L2-S3 scendono dal rigonfiamento lombo-sacrale e dal
//    cono ai monconi reali della «Cauda equina». Che i segmenti lombari e sacrali stiano
//    tra T9 e L2 e che la cauda sia fatta dalle radici L2-Co è VERIFICATO (Wikipedia,
//    "Spinal cord" — https://en.wikipedia.org/wiki/Spinal_cord ; "Cauda equina" —
//    https://en.wikipedia.org/wiki/Cauda_equina ; "Conus medullaris" —
//    https://en.wikipedia.org/wiki/Conus_medullaris). La quota di origine di ogni radice
//    (un segmento ogni 11,5 mm da 1222 mm in giù) e il decorso dentro il sacco sono STIMATI.
//  - sezione ingrandita (5,5x) ai piedi del tratto C1-C4: il contorno della sostanza
//    bianca, i corni e le aree dei fasci sono le SEZIONI VERE delle mesh dell'atlante alla
//    quota 1485 mm (13,7 x 9,6 mm), non disegni. Aggiunti a mano: zona intermedia e
//    commessura grigia (l'atlante ha solo i due corni, staccati), commessure bianche,
//    limiti dei cordoni, solchi, anelli delle meningi.
//  - lamine di Rexed: suddivisione del grigio dell'atlante. Ordine e sede (I-VI nel corno
//    posteriore dall'apice alla base, VII zona intermedia, VIII e IX nel corno anteriore,
//    X attorno al canale) VERIFICATI: Wikipedia, "Rexed laminae" —
//    https://en.wikipedia.org/wiki/Rexed_laminae ; "Grey column" —
//    https://en.wikipedia.org/wiki/Grey_column . Spessori e confini STIMATI.
//  (NCBI Bookshelf e Radiopaedia non sono leggibili in automatico; di TeachMeAnatomy si è
//  letto solo l'indice: nessuna delle tre è stata usata.)
//
// Coordinate: x laterale (destra +), y craniale, z anteriore; 1 mm = 0,00105 unità.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.00105; // unità per millimetro (come nel manifesto delle mesh)
const OB = 40, OU = 800; // origine del manifesto: mm verso dietro, mm verso l'alto
// Punto in millimetri dell'atlante: a destra della linea mediana, verso dietro, quota.
const Q = (r, b, u) => V(r * S, (u - OU) * S, -(b - OB) * S);
const Y = (u) => (u - OU) * S;

const lerpTable = (table) => (u) => {
  if (u <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++)
    if (u <= table[i][0]) {
      const [u0, v0] = table[i - 1], [u1, v1] = table[i];
      return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0);
    }
  return table.at(-1)[1];
};
// Asse reale: canale centrale del midollo e, sotto il cono, cordoni della «Cauda equina»
// [quota, mm verso dietro].
const axis = lerpTable([
  [856, 87], [870, 86.1], [885, 85], [900, 82.4], [915, 77.6], [930, 67.3], [945, 55.4], [960, 45.1], [975, 35.7], [990, 29.1],
  [1005, 25.7], [1020, 24.1], [1035, 23.2], [1050, 23.6], [1065, 24.3], [1080, 25.7], [1095, 27.9], [1110, 31], [1125, 34.9],
  [1140, 40.5], [1155, 46.1], [1170, 50.7], [1185, 55.1], [1200, 58.8], [1215, 62.1], [1230, 64.7], [1245, 67], [1260, 69.1],
  [1275, 70.8], [1290, 71.8], [1305, 72.2], [1320, 71.8], [1335, 70.7], [1350, 69.2], [1365, 66.8], [1380, 62.2], [1395, 56],
  [1410, 49.9], [1425, 44], [1440, 37.1], [1455, 30.4], [1470, 25.4], [1485, 22.6], [1500, 22], [1515, 23.4], [1530, 27.6], [1545, 28.3], [1560, 27.5],
]);
// Semilarghezza reale del midollo [quota, mm].
const halfWidth = lerpTable([
  [1055, 0.2], [1065, 0.83], [1080, 2.24], [1100, 4.32], [1120, 6.21], [1140, 6.88], [1160, 7.34], [1240, 7.34], [1280, 6.87],
  [1360, 6.72], [1400, 6.27], [1440, 6.11], [1460, 6.39], [1480, 6.76], [1500, 7.11], [1540, 7.36],
]);
const CUT = 1486, TIP = 1055, SAC_END = 920; // taglio per la sezione, apice del cono, fondo del sacco durale (S2)
const SAC = { x: 9, flat: 0.72 }; // semilarghezza del sacco durale e rapporto antero-posteriore (stimati)

// Tubo lungo l'asse del canale tra due quote; `radius(u)` in mm.
function axial(u0, u1, radius, { step = 12, dr = 0, db = 0, ...opts } = {}) {
  const n = Math.max(2, Math.round(Math.abs(u1 - u0) / step));
  const us = Array.from({ length: n + 1 }, (_, i) => u0 + ((u1 - u0) * i) / n);
  return taperTube(us.map((u) => Q(dr, axis(u) + db, u)), us.map((u) => radius(u) * S), { seg: n * 3, radial: 20, caps: false, ...opts });
}

// ---- Sezione ingrandita: 1 mm = K unità; dx a destra, dz in avanti rispetto al canale ----
const K = S * 5.5;
const PLATE = { top: Y(CUT) - 0.006, h: 0.0028, z: -(22.56 - OB) * S };
const UP = { pia: -0.0002, liquor: -0.0005, arachnoid: -0.0007, dura: -0.0009, epidural: -0.0012, fun: 0.0003, grey: 0.0004, tract: 0.0006, lamina: 0.0008, mark: 0.001 };
// La piastra è inclinata come un leggio verso chi guarda da dietro (le pagine la mostrano così).
const LEAN = -0.45;
const lean = (g) => g.translate(0, -PLATE.top, -PLATE.z).rotateX(LEAN).translate(0, PLATE.top, PLATE.z);
const flip = (poly) => poly.map(([x, z]) => [-x, z]).reverse();
// Prisma con la base data (poligono in mm) e la faccia superiore a `up` sopra la piastra.
function slab(poly, up = 0, h = PLATE.h + up) {
  const shape = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x * K, -z * K)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  g.translate(0, PLATE.top + up - h, PLATE.z);
  return lean(g);
}
const sheet = (poly, up) => slab(poly, up, 0.0005);
const oval = (a, b, cz = -0.25, n = 72) => Array.from({ length: n }, (_, i) => [a * Math.cos((i / n) * 2 * Math.PI), cz + b * Math.sin((i / n) * 2 * Math.PI)]);
const onPlate = (dx, dz, up = 0) => V(dx * K, PLATE.top + up, PLATE.z + dz * K);
// Taglia un poligono con un semipiano: restano i punti in cui keep(x, z) >= 0.
function clip(poly, keep) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const fa = keep(...a), fb = keep(...b);
    if (fa >= 0) out.push(a);
    if (fa >= 0 !== fb >= 0) {
      const t = fa / (fa - fb);
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return out;
}
const cut = (poly, ...tests) => tests.reduce(clip, poly);

// Sezioni vere delle mesh di Z-Anatomy alla quota 1485 mm (metà destra, in mm dal canale).
const WHITE_LEFT = [[-0.06, 0.8], [-0.08, 2.85], [-0.11, 3.71], [-0.17, 4.01], [-0.61, 4.4], [-1.15, 4.51], [-1.74, 4.45], [-2.37, 4.29], [-3.02, 4.11], [-3.58, 3.89], [-4.06, 3.6], [-4.53, 3.21], [-4.93, 2.85], [-5.25, 2.55], [-5.98, 1.82], [-6.54, 1.04], [-6.83, 0.11], [-6.84, -0.64], [-6.7, -1.29], [-6.25, -2.09], [-5.6, -2.83], [-4.69, -3.7], [-4.29, -4.01], [-3.75, -4.28], [-3.16, -4.51], [-2.59, -4.67], [-2.14, -4.72], [-1.73, -4.94], [-0.98, -5.07], [-0.29, -4.8], [0, -4.52]];
const WHITE = [...WHITE_LEFT, ...WHITE_LEFT.slice(0, -1).reverse().map(([x, z]) => [-x, z])];
const TRACT_LOOPS = {
  gracile: [[1.52, -2.89], [1.39, -2.45], [1.16, -1.8], [0.96, -1.32], [0.78, -0.87], [0.62, -0.5], [0.34, -0.5], [0.05, -0.5], [0.05, -3.87], [0.05, -4.48], [0.29, -4.72], [0.55, -4.87], [0.91, -4.97], [1.29, -4.97], [1.66, -4.88], [1.97, -4.68], [1.9, -4.19], [1.82, -3.92], [1.69, -3.45]],
  cuneate: [[3.48, -4.02], [3.31, -3.64], [3.16, -3.31], [2.97, -2.87], [2.83, -2.6], [2.65, -2.27], [2.41, -1.87], [2.1, -1.47], [1.87, -1.19], [1.65, -0.96], [1.41, -0.77], [1.09, -0.6], [0.77, -0.55], [0.8, -0.83], [0.95, -1.22], [1.16, -1.71], [1.4, -2.37], [1.55, -2.87], [1.69, -3.36], [1.84, -3.86], [1.93, -4.17], [2.01, -4.45], [2.21, -4.7], [2.7, -4.62], [2.98, -4.53], [3.29, -4.43], [3.55, -4.32]],
  cstLat: [[5.82, -1.45], [5.81, -1.11], [5.58, -0.89], [5.2, -0.9], [4.8, -1.08], [4.41, -1.33], [4.1, -1.66], [4.05, -2.05], [4.15, -2.31], [4.33, -2.56], [4.85, -2.6], [5.26, -2.32], [5.6, -1.92]],
  cstAnt: [[0.24, 3.81], [0.2, 3.35], [0.2, 2.85], [0.2, 2.09], [0.2, 1.48], [0.24, 1.04], [0.47, 1.2], [0.51, 2.07], [0.51, 2.69], [0.5, 3.35]],
  sctPost: [[5.08, -2.58], [4.82, -2.8], [4.6, -3.03], [4.43, -3.25], [4.35, -3.52], [4.64, -3.67], [4.88, -3.44], [5.15, -3.18], [5.42, -2.93], [5.67, -2.69], [5.91, -2.44], [6.12, -2.18], [6.32, -1.92], [6.48, -1.64], [6.62, -1.35], [6.72, -1.03], [6.79, -0.69], [6.61, -0.46], [6.36, -0.77], [6.12, -1.36], [5.91, -1.71], [5.64, -2.05], [5.35, -2.34]],
  sctAnt: [[4.46, 2.91], [4.81, 2.35], [5.04, 2.14], [5.26, 1.93], [5.48, 1.72], [5.68, 1.51], [5.88, 1.29], [6.05, 1.06], [6.2, 0.82], [6.32, 0.56], [6.41, 0.29], [6.47, -0.01], [6.51, -0.31], [6.82, -0.34], [6.81, 0.01], [6.75, 0.36], [6.66, 0.68], [6.53, 0.98], [6.37, 1.26], [6.18, 1.52], [5.97, 1.78], [5.74, 2.03], [5.49, 2.27], [5.22, 2.52], [4.95, 2.78]],
  sttLat: [[4.72, 2.33], [4.44, 2.5], [4.13, 2.62], [3.77, 2.63], [3.92, 2.29], [4.16, 2.11], [4.39, 1.91], [4.6, 1.58], [4.74, 1.23], [4.95, 0.97], [5.36, 0.92], [5.65, 1.16], [5.52, 1.52], [5.14, 1.96]],
  sttAnt: [[1.7, 4.21], [1.95, 3.96], [2.24, 3.87], [2.53, 3.79], [2.82, 3.7], [3.11, 3.61], [3.42, 3.63], [3.21, 3.94], [2.92, 4.03], [2.62, 4.1], [2.34, 4.2], [2.05, 4.28]],
  rubro: [[4.93, -0.31], [4.79, 0.11], [4.93, 0.54], [5.38, 0.67], [5.66, 0.65], [5.96, 0.39], [5.96, -0.12], [5.67, -0.39], [5.39, -0.43]],
  lissauer: [[4.18, -4.03], [4.48, -3.83], [4.34, -3.57], [4.17, -3.32], [3.76, -3.43], [3.28, -3.39], [3.47, -3.8], [3.63, -4.16]],
  vestLat: [[2.12, 3.33], [1.72, 3.44], [1.41, 3.43], [1.6, 3.11], [2, 2.99], [2.37, 2.88], [2.76, 2.76], [3.06, 2.75], [2.88, 3.09], [2.5, 3.22]],
  retMed: [[2.32, 3.35], [2.63, 3.24], [2.94, 3.12], [3.26, 3.14], [3.06, 3.55], [2.8, 3.66], [2.52, 3.74], [2.22, 3.81], [1.86, 3.89], [1.54, 3.81], [1.76, 3.45], [2.04, 3.41]],
};
// Metà destra della sostanza grigia: i due corni sono le sezioni vere, la zona intermedia
// e la commessura (tra i due) sono aggiunte a mano.
const ANT_HORN = [[1.42, 0.71], [1.67, 1], [1.86, 1.36], [2.02, 1.68], [2.2, 1.9], [2.42, 2.01], [2.86, 2.05], [3.13, 2.02], [3.42, 1.8], [3.56, 1.5], [3.61, 1.13], [3.65, 0.71], [3.8, 0.15]];
const POST_HORN = [[3.71, -0.72], [3.64, -0.87], [3.6, -1.14], [3.6, -1.4], [3.64, -1.66], [3.71, -1.93], [3.82, -2.3], [3.91, -2.66], [3.94, -2.92], [3.86, -3.17], [3.76, -3.26], [3.63, -3.26], [3.43, -3.09], [3.28, -2.79], [3.06, -2.41], [2.87, -2.07], [2.67, -1.72], [2.41, -1.38], [2.19, -1.12], [1.98, -0.91], [1.57, -0.62]];
const GREY_RIGHT = [[0, 0.45], [1, 0.5], ...ANT_HORN, [3.85, -0.3], ...POST_HORN, [1, -0.48], [0, -0.42]];
const GREY = [...GREY_RIGHT, ...GREY_RIGHT.slice(1, -1).reverse().map(([x, z]) => [-x, z])];
// Lamine: fette del poligono grigio. t = distanza lungo l'asse del corno posteriore, dalla base all'apice.
const hornT = (x, z) => (x - 2.65) * 0.4 + (z + 0.65) * -0.917;
const band = (t0, t1) => cut(GREY_RIGHT, (x, z) => -0.6 - z, (x) => x - 1.45, (x, z) => hornT(x, z) - t0, (x, z) => t1 - hornT(x, z));
const LAMINAE = {
  lam1: band(2.45, 9), lam2: band(1.95, 2.45), lam3: band(1.55, 1.95), lam4: band(1.05, 1.55), lam5: band(0.5, 1.05), lam6: band(-9, 0.5),
  lam7: cut(GREY_RIGHT, (x, z) => z + 0.6, (x) => x - 1.45, (x, z) => 0.9 - z),
  lam8: cut(GREY_RIGHT, (x, z) => z - 0.9, (x) => 2.55 - x),
  lam9: cut(GREY_RIGHT, (x, z) => z - 0.9, (x) => x - 2.55),
};
const LAMINA_X = cut(GREY, (x) => 1.45 - x, (x) => x + 1.45);
// Cordoni della metà destra: tra i solchi del contorno reale e il margine del grigio.
const FUNICULI = {
  funPost: [[0.05, -0.42], [1, -0.48], [1.57, -0.62], [1.98, -0.91], [2.41, -1.38], [2.87, -2.07], [3.28, -2.79], [3.43, -3.09], [3.63, -3.26], [4.29, -4.01], [3.75, -4.28], [3.16, -4.51], [2.59, -4.67], [2.14, -4.72], [1.73, -4.94], [0.98, -5.07], [0.29, -4.8], [0.05, -4.52]],
  funLat: [[4.29, -4.01], [4.69, -3.7], [5.6, -2.83], [6.25, -2.09], [6.7, -1.29], [6.84, -0.64], [6.83, 0.11], [6.54, 1.04], [5.98, 1.82], [5.25, 2.55], [4.93, 2.85], [4.53, 3.21], [4.06, 3.6], [3.58, 3.89], [3.02, 4.11], [2.95, 2.07], [3.13, 2.02], [3.42, 1.8], [3.56, 1.5], [3.61, 1.13], [3.65, 0.71], [3.8, 0.15], [3.85, -0.3], [3.71, -0.72], [3.6, -1.14], [3.64, -1.66], [3.82, -2.3], [3.94, -2.92], [3.86, -3.17], [3.76, -3.26]],
  funAnt: [[3.02, 4.11], [2.37, 4.29], [1.74, 4.45], [1.15, 4.51], [0.61, 4.4], [0.17, 4.01], [0.11, 3.71], [0.08, 2.85], [0.06, 0.8], [1.2, 0.85], [1.42, 0.71], [1.67, 1], [1.86, 1.36], [2.02, 1.68], [2.2, 1.9], [2.42, 2.01], [2.95, 2.07]],
};

// Radici rifatte: [nome, quota di origine sul midollo, uscita reale (mm a destra, mm dietro, quota)].
// T9-L1 arrivano ai gangli reali, L2-S3 ai monconi reali della «Cauda equina».
const LOW_ROOTS = [
  ['T9', 1222, [12.4, 58.4, 1200]], ['T10', 1210.5, [10.1, 49.9, 1169]], ['T11', 1199, [11.4, 38.4, 1132]], ['T12', 1187.5, [9, 28.9, 1100.5]], ['L1', 1176, [11.6, 24.4, 1068]],
  ['L2', 1164.5, [4, 21.9, 1046.2]], ['L3', 1153, [4, 24.5, 1018.5]], ['L4', 1141.5, [4, 29.7, 989.8]], ['L5', 1130, [4, 48.9, 953]],
  ['S1', 1118.5, [4, 63, 935.1]], ['S2', 1107, [4, 77.7, 915.5]], ['S3', 1095.5, [4, 82.8, 896.7]],
];
// side = +1 destra; k = +1 radice posteriore, -1 anteriore.
function lowRoot(j, side, k) {
  const [, u0, [r1, b1, u1]] = LOW_ROOTS[j];
  const rank = LOW_ROOTS.length - 1 - j; // le radici più alte stanno all'esterno
  const pts = [Q(side * (halfWidth(u0) - 0.2), axis(u0) + k * 2.2, u0)];
  for (let u = u0 - 8; u > u1 + 12; u -= 14) {
    const lane = Math.min(8, Math.max(halfWidth(u), 0.9) + 0.5 + 0.3 * rank);
    pts.push(Q(side * lane, axis(u) + k * (1 + 0.3 * rank), u));
  }
  pts.push(Q(side * r1, b1, u1));
  return taperTube(pts, 0.6 * S, { seg: Math.max(24, pts.length * 5), radial: 7 });
}

// Legamento denticolato (C1-C4): nastro sul fianco del midollo con denti fino alla dura.
const TEETH = [1541.5, 1526.5, 1514.5, 1500.5];
function denticulate(side) {
  const pos = [], idx = [];
  const us = [];
  for (let u = 1548; u >= CUT; u -= 1) us.push(u);
  us.forEach((u, i) => {
    const hw = halfWidth(u);
    const near = Math.min(...TEETH.map((t) => Math.abs(t - u)));
    const reach = hw + 0.9 + (SAC.x - 0.4 - hw - 0.9) * Math.max(0, 1 - near / 4.5);
    pos.push(...Q(side * (hw - 0.3), axis(u), u).toArray(), ...Q(side * reach, axis(u), u).toArray());
    if (i) idx.push(2 * i - 2, 2 * i - 1, 2 * i, 2 * i - 1, 2 * i + 1, 2 * i);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const IVORY = 0xf1ead8, BONE = 0xe9dfc8, GREYC = 0x9a8478, NERVE = 0xe3c770, SENS = 0x4f86c6, MOT = 0xc9485b, GANGLION = 0xd9a82e;
const bone = (name) => [name, BONE, { ghost: true, opacity: 0.4 }];
const tract = (name, color) => [name, color];
const REAL = {
  occipital: bone('osso occipitale (forame magno)'),
  vAtlas: bone('atlante (C1)'),
  vAxis: bone('epistrofeo (C2)'),
  vCerv: bone('vertebre cervicali C3-C7'),
  vThorUp: bone('vertebre toraciche T1-T8'),
  vThorLow: bone('vertebre toraciche T9-T12'),
  vL1: bone('prima vertebra lombare (L1)'),
  vL2: bone('seconda vertebra lombare (L2)'),
  vLumb: bone('vertebre lombari L3-L5'),
  sacrum: bone('sacro'),
  coccyx: bone('coccige'),
  medulla: ['midollo allungato', 0xe6cdb0],
  cordTop: ['midollo spinale: segmenti C1-C4', IVORY],
  cervEnl: ['rigonfiamento cervicale (C5-T1)', 0xf2c46b],
  cordThor: ['midollo spinale: tratto toracico', IVORY],
  lumbEnl: ['rigonfiamento lombo-sacrale', 0xf2c46b],
  conus: ['cono terminale', 0xe39a7c],
  antHorn: ['corno anteriore', 0xb5857a],
  postHorn: ['corno posteriore', 0x8f7468],
  canal: ["canale centrale dell'ependima", 0x2f6fe0],
  postRootTop: ['radici posteriori C1-C4', SENS], postRootCerv: ['radici posteriori C5-T1', SENS], postRoot: ['radici posteriori T2-T8', SENS],
  antRootTop: ['radici anteriori C1-C4', MOT], antRootCerv: ['radici anteriori C5-T1', MOT], antRoot: ['radici anteriori T2-T8', MOT],
  ganglionTop: ['gangli spinali C1-C4', GANGLION], ganglionCerv: ['gangli spinali C5-T1', GANGLION], ganglion: ['gangli spinali T2-T8', GANGLION],
  ganglionLow: ['gangli spinali T9-L1', GANGLION],
  sleevesTop: ['guaine durali delle radici', 0x8fa3b8, { opacity: 0.5 }], sleevesCerv: ['guaine durali delle radici', 0x8fa3b8, { opacity: 0.5 }],
  sleeves: ['guaine durali delle radici', 0x8fa3b8, { opacity: 0.5 }],
  cauda: ['cauda equina: ultime radici sacrali e coccigee', NERVE],
  pllTop: ['legamento longitudinale posteriore', 0xd8b98a, { opacity: 0.5 }],
  flavaTop: ['legamenti gialli', 0xe6cf5a, { opacity: 0.4 }],
  gracile: tract('fascicolo gracile', 0x2f6fe0), cuneate: tract('fascicolo cuneato', 0x1f9d8f),
  sctPost: tract('fascio spino-cerebellare posteriore', 0x2f8f6b), sctAnt: tract('fascio spino-cerebellare anteriore', 0x74b84a),
  sttLat: tract('fascio spino-talamico laterale', 0x7a4fd0), sttAnt: tract('fascio spino-talamico anteriore', 0xa98be0),
  lissauer: tract('tratto dorsolaterale di Lissauer', 0x4aa3c8),
  cstLat: tract('fascio cortico-spinale laterale', 0xd43d3d), cstAnt: tract('fascio cortico-spinale anteriore', 0xe07070),
  rubro: tract('fascio rubro-spinale', 0xe58a2e), vestLat: tract('fascio vestibolo-spinale laterale', 0xd9a82e), retMed: tract('fascio reticolo-spinale mediale', 0xb5651d),
};

// Primi piani (vedi AnatomyModel.zoomTo). Lungo il midollo: un punto dell'asse (quota in
// mm e z del modello) ingrandito al centro della pagina; ciò che resta fuori lo taglia il motore.
const along = (u, scale, z = 0, height) => ({ at: [0, Y(u), z], scale, height });
// Sulla sezione: `drop` è quanto scende il bordo vicino della piastra inclinata, che resta appena sopra la base.
const onSection = (scale, drop) => ({ at: [0, PLATE.top - drop, PLATE.z], scale, height: 0.04 });
export const FOCUS = {
  top: along(1488, 5.2, 0.014, 0.07),
  cerv: along(1402, 3.6, 0.004, 0.07),
  lumbar: along(1181, 2.8, -0.012),
  conus: along(1095, 3.2, 0.004),
  cauda: along(1010, 2, -0.004),
  cistern: along(990, 2.4, -0.004),
  filum: along(952, 2.4, -0.02),
  meninges: onSection(4.8, 0.03),
  white: onSection(7, 0.018),
  grey: onSection(7.6, 0.018),
};

export class SpinalCord extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.13, z: 0, rod: [0, 0.02, 0.1, -0.03] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('midollo-spinale.glb', REAL);
    // i nervi dell'atlante sono tubi di 0,5 mm di raggio: ingrossati per essere leggibili
    for (const id of ['postRootTop', 'postRootCerv', 'postRoot', 'antRootTop', 'antRootCerv', 'antRoot']) this.#inflate(id, 0.3 * S);
    this.#inflate('cauda', 0.45 * S);
    this.#meninges();
    this.#lowRoots();
    this.#section();
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

  // Aggiunge geometrie a una parte esistente (le aree dei fasci reali sulla sezione).
  #attach(id, ...geos) {
    const part = this.parts.get(id);
    for (const g of geos) {
      g.computeBoundingBox();
      const c = g.boundingBox.getCenter(new THREE.Vector3());
      const size = g.boundingBox.getSize(new THREE.Vector3());
      g.translate(-c.x, -c.y, -c.z);
      const m = new THREE.Mesh(g, part.mat);
      m.position.copy(c);
      m.userData.size = size;
      m.userData.ui = this.ui(id, part.name);
      m.castShadow = true;
      m.visible = false;
      this.inner.add(m);
      part.meshes.push(m);
    }
  }

  #meninges() {
    const DURA = 0x8fa3b8;
    const sac = (u) => (u > 1500 ? SAC.x + ((u - 1500) / 56) * 1.5 : u > 1000 ? (u > CUT ? SAC.x : 8.5) : u > 960 ? 7 + ((u - 960) / 40) * 1.5 : u > 935 ? 3 + ((u - 935) / 25) * 4 : 1 + ((u - SAC_END) / 15) * 2);
    const skin = { flat: { z: SAC.flat } };
    const soft = { ghost: true, opacity: 0.4 };
    this.addPart('duraTop', 'dura madre (sacco durale)', DURA, [axial(1556, CUT, sac, skin)], soft);
    this.addPart('duraMid', 'dura madre (sacco durale)', DURA, [axial(CUT, 1150, sac, skin)], soft);
    this.addPart('duraLow', 'dura madre: fondo del sacco durale (S2)', DURA, [axial(1150, SAC_END, sac, { ...skin, step: 8 })], { ghost: true, opacity: 0.8 });
    this.addPart('cistern', 'cisterna midollare (liquor)', 0x4f9fe0, [axial(TIP, SAC_END + 3, (u) => sac(u) - 0.9, { ...skin, step: 8, caps: true })], { opacity: 0.55 });
    this.addPart('filum', 'filum terminale', 0xb9c7dc, [axial(TIP + 2, SAC_END, () => 0.75, { step: 8, radial: 10 })]);
    this.addPart('coccLig', 'legamento coccigeo', 0x5f7896, [axial(SAC_END + 2, 856, () => 1.05, { step: 8, radial: 10, caps: true })]);
    this.addPart('denticulateTop', 'legamenti denticolati', 0xd4567c, [denticulate(1), denticulate(-1)], { double: true });
  }

  #lowRoots() {
    const tubes = (from, to, k) => [1, -1].flatMap((side) => Array.from({ length: to - from }, (_, i) => lowRoot(from + i, side, k)));
    this.addPart('postRootLow', 'radici posteriori T9-L1 (decorso ricostruito)', SENS, tubes(0, 5, 1));
    this.addPart('antRootLow', 'radici anteriori T9-L1 (decorso ricostruito)', MOT, tubes(0, 5, -1));
    this.addPart('caudaRoots', 'cauda equina: radici L2-S3 (decorso ricostruito)', NERVE, [...tubes(5, LOW_ROOTS.length, 1), ...tubes(5, LOW_ROOTS.length, -1)]);
  }

  #section() {
    const two = (poly, up) => [slab(poly, up), slab(flip(poly), up)];
    this.addPart('section', 'sostanza bianca (sezione C4-C5 ingrandita)', 0xfaf5e6, [slab(WHITE, 0)]);
    this.addPart('grey', 'sostanza grigia', GREYC, [slab(GREY, UP.grey)]);
    // aree vere dei fasci, una per lato, aggiunte alle colonne reali
    for (const [id, loop] of Object.entries(TRACT_LOOPS)) this.#attach(id, sheet(loop, UP.tract), sheet(flip(loop), UP.tract));
    const disc = new THREE.CylinderGeometry(0.3 * K, 0.3 * K, 0.0006, 20);
    disc.translate(0, PLATE.top + UP.lamina + 0.0003, PLATE.z);
    this.#attach('canal', lean(disc));
    this.#attach('antHorn', ...two([...ANT_HORN, [3.72, 0.32], [2.9, 0.18], [2.2, 0.33], [1.6, 0.57]], UP.grey + 0.0001));
    this.#attach('postHorn', ...two(POST_HORN, UP.grey + 0.0001));

    const L = {
      lam1: ['lamina I (zona marginale)', 0x5b2a86], lam2: ['lamina II', 0xc86fa8], lam3: ['lamina III', 0xe7a3c4], lam4: ['lamina IV', 0xe0a050],
      lam5: ['lamina V', 0xc9813a], lam6: ['lamina VI', 0x9c6b3c], lam7: ['lamina VII', 0x5fa38a], lam8: ['lamina VIII', 0x3f8f9c], lam9: ['lamina IX (motoneuroni)', 0xc9485b],
    };
    for (const [id, [name, color]] of Object.entries(L)) this.addPart(id, name, color, two(LAMINAE[id], UP.lamina));
    this.addPart('lam10', 'lamina X (commessura grigia)', 0x4b6cb7, [slab(LAMINA_X, UP.lamina)]);

    this.addPart('funAnt', 'cordone anteriore', 0xf0c987, two(FUNICULI.funAnt, UP.fun));
    this.addPart('funLat', 'cordone laterale', 0xa8d0a0, two(FUNICULI.funLat, UP.fun));
    this.addPart('funPost', 'cordone posteriore', 0x9fc0e8, two(FUNICULI.funPost, UP.fun));
    this.addPart('cba', 'commessura bianca anteriore', 0xf6d27a, [sheet([[-1.3, 0.56], [-1, 0.5], [0, 0.45], [1, 0.5], [1.3, 0.56], [1.2, 0.86], [0.1, 0.8], [-0.1, 0.8], [-1.2, 0.86]], UP.mark)]);
    this.addPart('cbp', 'commessura bianca posteriore', 0xd9c06a, [sheet([[-1.2, -0.52], [0, -0.42], [1.2, -0.52], [1.1, -0.78], [0, -0.66], [-1.1, -0.78]], UP.mark)]);

    // solchi: una perla sul contorno, nel punto vero del solco
    const bead = (dx, dz) => lean(ellipsoid(onPlate(dx, dz, UP.mark).toArray(), [0.33 * K, 0.33 * K, 0.33 * K], null, 16));
    const pair = (dx, dz) => [bead(dx, dz), bead(-dx, dz)];
    this.addPart('fma', 'fessura mediana anteriore', 0x8a2f2f, [bead(0, 4.2)]);
    this.addPart('sla', 'solco laterale anteriore', 0xb5651d, pair(3.02, 4.15));
    this.addPart('slp', 'solco laterale posteriore', 0x2f6f4f, pair(4.33, -4.05));
    this.addPart('sip', 'solco intermedio posteriore', 0x3a5a8c, pair(2.05, -4.8));
    this.addPart('smp', 'solco mediano posteriore', 0x5b2a86, [bead(0, -4.75)]);

    // radici sulla sezione: dal solco verso il foro intervertebrale
    const root = (pts) => [1, -1].map((s) => lean(taperTube(pts.map(([dx, dz]) => onPlate(s * dx, dz, -0.0002)), 0.3 * K, { seg: 30, radial: 10 })));
    this.addPart('rootPostP', 'radice posteriore', SENS, root([[4.33, -4.05], [6.3, -4.7], [8.6, -3.7], [10.8, -1.7]]));
    this.addPart('rootAntP', 'radice anteriore', MOT, root([[3.02, 4.15], [5.3, 4.7], [8.2, 3.3], [10.8, -0.5]]));
    this.addPart('ganglionP', 'ganglio spinale', GANGLION, [1, -1].map((s) => lean(ellipsoid(onPlate(s * 9.7, -2.75, -0.0002).toArray(), [0.6 * K, 0.6 * K, 1 * K], null, 16))));

    // meningi attorno alla sezione: gradini che scendono verso l'esterno
    this.addPart('pia', 'pia madre', 0xe58f86, [slab(WHITE.map(([x, z]) => [x * 1.04, -0.3 + (z + 0.3) * 1.045]), UP.pia)]);
    this.addPart('liquor', 'spazio subaracnoideo (liquor)', 0x8cc4ee, [slab(oval(SAC.x - 0.65, SAC.x * SAC.flat - 0.65), UP.liquor)], { opacity: 0.75 });
    this.addPart('arachnoid', 'aracnoide', 0xb06fb0, [slab(oval(SAC.x - 0.4, SAC.x * SAC.flat - 0.4), UP.arachnoid)]);
    this.addPart('duraRing', 'dura madre', 0x6f86a0, [slab(oval(SAC.x, SAC.x * SAC.flat), UP.dura)]);
    this.addPart('epidural', 'spazio peridurale (tessuto adiposo e plessi vascolari)', 0xedd27c, [slab(oval(SAC.x + 2.2, SAC.x * SAC.flat + 2.2), UP.epidural)]);
    const tooth = (s) => sheet([[s * 6.9, 0.25], [s * (SAC.x - 0.4), -0.25], [s * 6.9, -0.75]], UP.liquor + 0.0003);
    this.#attach('denticulateTop', tooth(1), tooth(-1));
  }
}
