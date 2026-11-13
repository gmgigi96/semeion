// Modello dei riflessi spinali: colonna lombare, midollo, bacino e cosce fino sotto il
// ginocchio, con il riflesso patellare (quadricipite, nervo femorale, L2-L4), i muscoli
// posteriori della coscia come antagonisti e una sezione ingrandita del midollo lombare
// su cui sono posati i neuroni del circuito.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/riflessi.glb, manifesto in
// meshes/riflessi.json): vertebre T11-L5 con i dischi (tagliate alla quota della sezione),
// sacro e coccige, ossa dell'anca, femori, rotule, tibie e fibule (tagliate sotto la
// tuberosità tibiale); sostanza bianca del midollo sotto il taglio (rigonfiamento lombare e
// cono); retto femorale destro, diviso per quota in ventre, tendine del quadricipite (il
// tratto che arriva alla rotula e la riveste) e legamento rotuleo (il tratto tra rotula e
// tuberosità tibiale: in Z-Anatomy fa parte della mesh del retto femorale); vasti; bicipite
// femorale, semitendinoso e semimembranoso; gli stessi muscoli a sinistra; nervo femorale
// dalla fossa iliaca in giù; nervo ischiatico con tibiale e peroneo comune.
//   - I nervi di Z-Anatomy sono tubi di 0,5-1 mm: qui sono ingrossati lungo le normali.
//   - Il nervo femorale di Z-Anatomy non ha rami muscolari e finisce a metà coscia.
//   - Le radici dell'atlante finiscono a L1 e sono orizzontali; il nervo femorale nasce un
//     livello troppo in alto (vedi src/models/plesso-lombare.js): il tratto sopra la fossa
//     iliaca è stato tagliato e rifatto.
//
// SEZIONE INGRANDITA (14x, sopra il taglio a quota 1170 mm): contorno della sostanza
// bianca, corno anteriore, corno posteriore e aree dei fasci cortico-spinale laterale,
// vestibolo-spinale laterale e reticolo-spinale mediale sono le SEZIONI VERE delle mesh di
// Z-Anatomy alla quota 1150 mm (14,4 x 10,6 mm), non disegni. Limite dell'atlante: i corni
// lombari sono piccoli come quelli cervicali (2,5 x 2 mm), mentre nel vero il rigonfiamento
// lombare ha corni anteriori molto più ampi. Aggiunti a mano: zona intermedia (lamina VII)
// e commessura grigia (lamina X), canale, monconi delle radici e ganglio.
//
// RICOSTRUITO A MANO nella stessa terna (punti in millimetri dell'atlante):
//  - radici anteriori e posteriori L2-L4 e radici L5-S2: dal midollo (un segmento ogni
//    11,5 mm, come in src/models/midollo-spinale.js: quote STIMATE) lungo il canale fino
//    ai fori intervertebrali misurati sullo scheletro dell'atlante e ai monconi reali del
//    nervo ischiatico. Decorso nel canale STIMATO.
//  - gangli spinali L2-L4 nel foro intervertebrale (VERIFICATO: Wikipedia, "Dorsal root
//    ganglion" — https://en.wikipedia.org/wiki/Dorsal_root_ganglion). Dimensioni STIMATE.
//  - rami anteriori L2-L4, radici del nervo femorale e suo tratto tra psoas e iliaco: stessi
//    punti di src/models/plesso-lombare.js. Origine da L2-L4 VERIFICATA (Wikipedia, "Femoral
//    nerve" — https://en.wikipedia.org/wiki/Femoral_nerve).
//  - ramo muscolare del femorale per il retto femorale: la fonte dice solo che la divisione
//    posteriore, che nasce circa 4 cm sotto il legamento inguinale, innerva retto femorale
//    e vasti (stessa voce); decorso fino al ventre STIMATO.
//  - ramo dell'ischiatico per il capo lungo del bicipite femorale: che i muscoli posteriori
//    della coscia dipendano dalla parte tibiale dell'ischiatico è VERIFICATO (Wikipedia,
//    "Hamstring" — https://en.wikipedia.org/wiki/Hamstring ; "Sciatic nerve", radici L4-S3 —
//    https://en.wikipedia.org/wiki/Sciatic_nerve); punto di origine e decorso STIMATI.
//  - fuso neuromuscolare nel ventre del retto femorale, parallelo alle fibre extrafusali:
//    capsula, 2 fibre a sacco e 4 a catena di nuclei, terminazione anulospirale Ia attorno
//    alla zona centrale di tutte le fibre, terminazioni II accanto alla zona centrale delle
//    fibre a catena, placche gamma ai poli. VERIFICATO: Wikipedia, "Muscle spindle" —
//    https://en.wikipedia.org/wiki/Muscle_spindle ; "Gamma motor neuron" —
//    https://en.wikipedia.org/wiki/Gamma_motor_neuron ; Neuroscience Online (UTHealth),
//    sez. 3 cap. 1 — https://nba.uth.tmc.edu/neuroscience/m/s3/chapter01.html (6-8 fibre:
//    1 sacco dinamico, 1 statico, circa 5 a catena). Le fonti lette non danno misure: il
//    fuso è lungo qui 64 mm, cioè MOLTO INGRANDITO per essere visibile (STIMATO).
//  - organo tendineo del Golgi alla giunzione tra ventre e tendine, in serie: capsula con
//    fasci di collagene intrecciati, fibra Ib che si ramifica tra i fasci, fibre muscolari
//    attaccate a un capo. VERIFICATO: Wikipedia, "Golgi tendon organ" (capsula di circa
//    1 mm x 0,1 mm, 10-20 fibre muscolari) — https://en.wikipedia.org/wiki/Golgi_tendon_organ .
//    Qui è lungo 26 mm: ingrandito circa 26 volte.
//  - neuroni sulla sezione (corpi ingranditi) e loro connessioni:
//    motoneuroni alfa e gamma nella lamina IX del corno anteriore, flessori dorsali agli
//    estensori (VERIFICATO: Wikipedia, "Alpha motor neuron" —
//    https://en.wikipedia.org/wiki/Alpha_motor_neuron ; Neuroscience Online, sez. 3 cap. 2 —
//    https://nba.uth.tmc.edu/neuroscience/m/s3/chapter02.html);
//    arco monosinaptico Ia › motoneurone alfa, interneurone inibitorio Ia per l'antagonista,
//    interneurone inibitorio Ib per lo stesso muscolo, cellula di Renshaw eccitata dal
//    collaterale dell'assone motorio, riflesso flessorio polisinaptico e ramo crociato per
//    gli estensori controlaterali (VERIFICATO: Neuroscience Online, sez. 3 cap. 2;
//    Wikipedia, "Patellar reflex" — https://en.wikipedia.org/wiki/Patellar_reflex ;
//    "Reciprocal inhibition" — https://en.wikipedia.org/wiki/Reciprocal_inhibition ;
//    "Renshaw cell" — https://en.wikipedia.org/wiki/Renshaw_cell ; "Withdrawal reflex" —
//    https://en.wikipedia.org/wiki/Withdrawal_reflex ; "Crossed extensor reflex" —
//    https://en.wikipedia.org/wiki/Crossed_extensor_reflex).
//    STIMATO: la posizione esatta di interneuroni Ia e Ib e della cellula di Renshaw nel
//    grigio (le fonti lette non danno la lamina; qui stanno dove li mettono gli appunti:
//    Renshaw nella lamina VII accanto ai motoneuroni, partition cells nella lamina X, CPG
//    tra VII e VIII) e il decorso delle fibre dentro la sezione.
//    SEMPLIFICAZIONE: tutti i neuroni stanno su un'unica sezione; nel vero i motoneuroni
//    dei muscoli posteriori della coscia stanno più in basso (L5-S2) di quelli del
//    quadricipite (L2-L4). Partition cells e CPG vengono dai soli appunti (non verificati).
//  - martelletto: oggetto di scena, da trascinare sul legamento rotuleo (setHammer).
//  - estensione della gamba nel riflesso: tibia e legamento rotuleo ruotano attorno a un
//    asse trasversale del ginocchio posto a stima (KNEE); ampiezza esagerata a vista.
//
// Coordinate: x laterale (destra +), y craniale, z anteriore; 1 mm = 0,0009 unità.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0009; // unità per millimetro (come nel manifesto)
const OB = 20, OU = 330; // origine del manifesto: mm verso dietro, quota
// Punto in millimetri dell'atlante: a destra della linea mediana, verso dietro, quota.
const Q = (r, b, u) => V(r * S, (u - OU) * S, -(b - OB) * S);
const Y = (u) => (u - OU) * S;
const tube = (pts, r, opts) => taperTube(pts.map((p) => Q(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, ...opts });
const blob = (p, r, det = 12) => ellipsoid(Q(...p).toArray(), r.map((v) => v * S), null, det);
const off = (pts, dr, db = 0) => pts.map(([r, b, u]) => [r + dr, b + db, u]);
const left = (pts) => pts.map(([r, b, u]) => [-r, b, u]);

const lerpTable = (table) => (u) => {
  if (u <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++)
    if (u <= table[i][0]) {
      const [u0, v0] = table[i - 1], [u1, v1] = table[i];
      return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0);
    }
  return table.at(-1)[1];
};
// Asse reale del canale vertebrale (canale centrale e, sotto il cono, cordoni della cauda)
// e semilarghezza reale del midollo: [quota, mm].
const axis = lerpTable([
  [915, 77.6], [930, 67.3], [945, 55.4], [960, 45.1], [975, 35.7], [990, 29.1], [1005, 25.7], [1020, 24.1], [1035, 23.2], [1050, 23.6],
  [1065, 24.3], [1080, 25.7], [1095, 27.9], [1110, 31], [1125, 34.9], [1140, 40.5], [1155, 46.1], [1170, 50.7], [1185, 55.1],
]);
const halfWidth = lerpTable([[1055, 0.2], [1065, 0.83], [1080, 2.24], [1100, 4.32], [1120, 6.21], [1140, 6.88], [1160, 7.34], [1240, 7.34]]);
const CUT = 1170;

// ---- Nervi ricostruiti (mm: destra, dietro, quota) ----
const SEG = { L2: 1164.5, L3: 1153, L4: 1141.5, L5: 1130, S1: 1118.5, S2: 1107 };
const FORAMEN = { L2: [14, 24, 1068], L3: [17, 19, 1035], L4: [18, 19, 990] };
// k = +1 radice posteriore, -1 anteriore
function rootPath(level, k) {
  const u0 = SEG[level], [fr, fb, fu] = FORAMEN[level];
  const pts = [[halfWidth(u0) - 0.4, axis(u0) + k * 2.4, u0]];
  for (let u = u0 - 10; u > fu + 14; u -= 14) pts.push([Math.min(8.5, Math.max(halfWidth(u), 1) + 1.2), axis(u) + k * 1.3, u]);
  pts.push([fr - 6, fb + (k > 0 ? 3 : 0.5), fu + 7], [fr, fb + (k > 0 ? 1.5 : -1), fu]);
  return pts;
}
function sacralPath(level, uEnd, tail) {
  const u0 = SEG[level];
  const pts = [[halfWidth(u0) - 0.4, axis(u0), u0]];
  for (let u = u0 - 10; u > uEnd; u -= 14) pts.push([Math.min(7, Math.max(halfWidth(u), 1) + 0.8), axis(u), u]);
  return [...pts, ...tail];
}
const SACRAL = {
  L5: sacralPath('L5', 990, [[10, 27, 978], [16, 25, 969], [24, 28, 971], [29.5, 31, 974]]),
  S1: sacralPath('S1', 955, [[11, 47, 943], [20.4, 38.4, 932]]),
  S2: sacralPath('S2', 935, [[9, 64, 928], [16.2, 60.4, 922.3]]),
};
const RAMI = {
  L2: [[14, 24, 1068], [24, 23.5, 1068.5], [31, 23.3, 1070], [38, 23, 1072], [44, 21.5, 1067], [48, 19.5, 1058]],
  L3: [[17, 19, 1035], [28, 19, 1031.5], [37, 18, 1028], [46, 17.5, 1022]],
  L4: [[18, 19, 990], [26, 19, 990], [34, 18, 988], [42, 16, 985]],
};
const FEM_ROOTS = {
  L2: [[48, 19.5, 1058], [56, 18, 1040], [61, 13, 1015], [64.5, 7, 992], [66, 2, 972]],
  L3: [[46, 17.5, 1022], [54, 15, 1010], [60, 10, 996], [64, 5.5, 983], [66, 2, 972]],
  L4: [[42, 16, 985], [52, 11, 979], [60, 6, 975], [66, 2, 972]],
};
const FEM_PELVIC = [[66, 2, 972], [69.5, -3.5, 961], [73, -10, 948], [76, -16, 939], [78, -19, 934]];
// asse del nervo femorale reale, dalla fossa iliaca al punto in cui parte il ramo ricostruito
const FEM_REAL = [[78, -19, 934], [72.6, -25.7, 916], [66.7, -34.4, 890], [63.6, -40, 869.5], [61.5, -42.5, 839]];
const NERVE_IN = [108, -46, 726]; // ingresso del ramo nel ventre del retto femorale
const RF_BRANCH = [[61.5, -42.5, 839], [70, -44, 815], [85, -44.5, 785], [99, -45, 752], NERVE_IN];
// asse reale dell'ischiatico (tronco da S1 in giù) e del tibiale, dal basso verso l'alto
const TIBIAL_UP = [[90.5, 57.5, 348], [88.3, 60.3, 396.6], [84.8, 63.4, 421.6], [81.3, 64.6, 445.8], [80.9, 59.5, 471.4], [84, 48, 493.7], [81, 41.3, 520.5], [76.8, 39, 540],
  [77.2, 36.4, 573.5], [75.7, 36.7, 600.7], [73.7, 38.5, 625], [72, 40.6, 649.3], [70.9, 43, 677.5], [70.4, 45.5, 703.2], [69.6, 48.3, 726], [68.2, 52.2, 752], [66.5, 57.1, 776]];
const SCIATIC_UP = [[66.5, 57.1, 776], [63.5, 62, 802.3], [58.9, 65.1, 827.9], [53.9, 64.3, 853.4], [52.7, 53.2, 877.9], [48.7, 30.8, 901.6], [40, 31.3, 912.6], [24.6, 35.9, 928.7], [20.4, 38.4, 932]];
const HAM_END = [91, 47, 655];
const HAM_BRANCH = [[66.5, 57.1, 776], [72, 54, 742], [82, 50, 700], HAM_END];

// ---- Fuso neuromuscolare (ingrandito) nel ventre del retto femorale ----
const FU = { r: 115, b: -46, u: 690 };
const fu = (dr, db, du) => [FU.r + dr, FU.b + db, FU.u + du];
const BAGS = [[-1.3, 0.7], [1.3, 0.7]];
const CHAINS = [[-1.7, -1.1], [-0.6, -1.7], [0.6, -1.7], [1.7, -1.1]];
const helix = ([dr, db], R, u0, u1, turns) =>
  Array.from({ length: turns * 14 + 1 }, (_, i) => {
    const t = i / (turns * 14), a = t * turns * 2 * Math.PI;
    return fu(dr + R * Math.cos(a), db + R * Math.sin(a), u0 + (u1 - u0) * t);
  });
// ---- Organo tendineo del Golgi (ingrandito) alla giunzione tra ventre e tendine ----
const GT = { c: [93, -24.5, 512], d: [0.062, -0.257, 0.964] }; // centro e direzione delle fibre (verso il ventre)
const perp1 = [1, 0, -0.064], perp2 = [0, 0.966, 0.257];
const gt = (a, p, q = 0) => [0, 1, 2].map((i) => GT.c[i] + GT.d[i] * a + perp1[i] * p + perp2[i] * q);

// ---- Sezione ingrandita: 1 mm = K unità; dx a destra, dz in avanti rispetto al canale ----
const K = S * 14;
const PLATE = { top: Y(CUT) + 0.04, h: 0.004, z: -(axis(CUT) - OB) * S };
const LEAN = 0.5; // inclinata come un leggio verso chi guarda da davanti
const lean = (g) => g.translate(0, -PLATE.top, -PLATE.z).rotateX(LEAN).translate(0, PLATE.top, PLATE.z);
// punto sulla sezione, `up` unità sopra la superficie
const P = (dx, dz, up = 0) => {
  const y = up, z = dz * K;
  return V(dx * K, PLATE.top + y * Math.cos(LEAN) - z * Math.sin(LEAN), PLATE.z + y * Math.sin(LEAN) + z * Math.cos(LEAN));
};
const flip = (poly) => poly.map(([x, z]) => [-x, z]).reverse();
function slab(poly, up = 0, h = PLATE.h + up) {
  const shape = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x * K, -z * K)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  g.translate(0, PLATE.top + up - h, PLATE.z);
  return lean(g);
}
const sheet = (poly, up) => slab(poly, up, 0.0006);
const two = (poly, up, f = sheet) => [f(poly, up), f(flip(poly), up)];
const UP = { grey: 0.0005, zone: 0.0008, tract: 0.0005, soma: 0.0009, fibre: 0.0034 };

// Sezioni vere delle mesh di Z-Anatomy alla quota 1150 mm (metà destra, mm dal canale).
const WHITE_R = [[0, 4.59], [0.42, 4.84], [0.88, 4.99], [1.33, 4.97], [1.78, 4.88], [2.24, 4.81], [2.71, 4.7], [3.17, 4.53], [3.66, 4.36], [4.09, 4.09], [4.51, 3.78], [4.89, 3.42], [5.33, 3.08], [5.73, 2.67], [6.19, 2.25], [6.52, 1.75], [6.86, 1.21], [7.04, 0.62], [7.2, 0], [7.21, -0.63], [7.11, -1.25], [6.94, -1.86], [6.59, -2.4], [6.08, -2.83], [5.8, -3.35], [5.38, -3.77], [4.92, -4.13], [4.48, -4.48], [3.97, -4.73], [3.52, -5.03], [2.99, -5.19], [2.47, -5.3], [1.97, -5.42], [1.49, -5.56], [0.99, -5.63], [0.46, -5.31], [0, -5.32]];
const WHITE = [...WHITE_R, ...WHITE_R.slice(1, -1).reverse().map(([x, z]) => [-x, z])];
const ANT_HORN = [[1.48, 0.78], [1.74, 1.09], [1.94, 1.48], [2.12, 1.84], [2.3, 2.08], [2.53, 2.2], [2.75, 2.26], [3, 2.25], [3.27, 2.22], [3.45, 2.09], [3.59, 1.98], [3.74, 1.65], [3.79, 1.24], [3.83, 0.8], [3.91, 0.36], [4, 0.17]];
const ANT_BASE = [[3.41, 0.18], [2.84, 0.24], [2.3, 0.37], [1.81, 0.57]];
const POST_HORN = [[3.91, -0.78], [3.84, -0.93], [3.79, -1.23], [3.79, -1.52], [3.84, -1.8], [3.91, -2.08], [4.03, -2.49], [4.12, -2.89], [4.16, -3.23], [4.08, -3.5], [3.99, -3.6], [3.87, -3.62], [3.65, -3.45], [3.5, -3.13], [3.25, -2.71], [3.05, -2.32], [2.85, -1.94], [2.56, -1.54], [2.33, -1.25], [2.11, -1.01], [1.86, -0.8], [1.66, -0.68]];
const GREY_R = [[0, 0.45], [1, 0.52], ...ANT_HORN, [3.98, -0.3], ...POST_HORN, [1, -0.5], [0, -0.45]];
const GREY = [...GREY_R, ...GREY_R.slice(1, -1).reverse().map(([x, z]) => [-x, z])];
const LAM7 = [[1.3, 0.62], [1.48, 0.78], ...ANT_BASE.slice().reverse(), [4, 0.17], [3.98, -0.3], [3.91, -0.78], [2.68, -0.73], [1.66, -0.68], [1.3, -0.52]];
const LAM10 = [[-1.3, 0.56], [0, 0.45], [1.3, 0.56], [1.3, -0.52], [0, -0.45], [-1.3, -0.52]];
const TRACTS = {
  cst: [[6.13, -1.59], [6.16, -1.4], [6.12, -1.2], [6.01, -1.07], [5.86, -0.96], [5.66, -0.95], [5.46, -1], [5.02, -1.21], [4.61, -1.49], [4.44, -1.66], [4.31, -1.84], [4.25, -2.05], [4.27, -2.28], [4.39, -2.58], [4.57, -2.82], [4.83, -2.94], [5.17, -2.86], [5.6, -2.52], [5.94, -2.07]],
  vest: [[2.22, 3.65], [1.8, 3.76], [1.48, 3.76], [1.42, 3.56], [1.68, 3.4], [2.09, 3.27], [2.48, 3.15], [2.89, 3.02], [3.2, 3.01], [3.26, 3.2], [3.01, 3.38], [2.62, 3.52]],
  retSpin: [[2.43, 3.67], [2.87, 3.5], [3.16, 3.4], [3.41, 3.44], [3.44, 3.62], [3.32, 3.78], [2.93, 4], [2.54, 4.12], [1.95, 4.25], [1.67, 4.22], [1.58, 4.04], [1.64, 3.88], [1.94, 3.76]],
};
const ROOT_POST_P = [[4.45, -4.5], [6, -5.5], [7.8, -5.2], [9.2, -3.6]];
const ROOT_ANT_P = [[3.3, 4.45], [5.3, 5.1], [7.8, 3.9], [9.2, 1.2]];

// Neuroni sulla sezione: id -> [nome, colore, dx, dz, raggio in mm]
const RED = 0xc9485b;
const NEURONS = {
  mnExt: ['motoneurone alfa del quadricipite (estensore)', RED, 3.2, 1.85, 0.28],
  mnNear: ['motoneurone alfa vicino', 0xd98a94, 2.5, 1.9, 0.24],
  mnFlex: ['motoneurone alfa dei flessori (antagonista)', 0x9c2f45, 3.5, 0.75, 0.28],
  mnGamma: ['motoneurone gamma', 0xe58a2e, 2.6, 1.15, 0.18],
  renshaw: ['cellula di Renshaw', 0x7a4fd0, 1.95, 0.9, 0.22],
  inIa: ['interneurone inibitorio Ia', 0x2f6fe0, 2.7, -0.2, 0.22],
  inIb: ['interneurone inibitorio Ib', 0x2a9d9d, 3.32, -1.02, 0.22],
  inEx: ['interneuroni eccitatori del riflesso flessorio', 0x4a9d4f, 3.55, -2.25, 0.22],
  inInh: ['interneurone inibitorio (lato offeso)', 0x44546a, 3.48, -0.32, 0.2],
  partition: ['partition cell (colinergica)', 0xe8b21e, 0.72, 0, 0.24],
  mnExtL: ['motoneurone alfa degli estensori (lato opposto)', RED, -3.2, 1.85, 0.28],
  mnFlexL: ['motoneurone alfa dei flessori (lato opposto)', 0x9c2f45, -3.5, 0.75, 0.28],
  inInhL: ['interneurone inibitorio (lato opposto)', 0x44546a, -3.48, -0.32, 0.2],
};
const CPG = [[1.72, 0.32], [2.18, 0.06], [1.78, -0.26]];

const GREEN = 0x1f9d57, INH = 0xd43d3d, AFF = 0x2f6fe0, PAIN = 0x7a4fd0, DESC = 0xe58a2e;
// Fibre dentro la sezione: id -> [punti (dx, dz), colore, inibitoria]
const MN_OUT = [[3.3, 2.12], [3.3, 2.8], [3.3, 3.6], [3.3, 4.45], [5.3, 5.1], [7.6, 4]];
const CENTRAL = {
  cIa: [[[7.8, -5.2], [6, -5.5], [4.3, -4.5], [3.2, -3.5], [2.55, -2], [2.45, -0.6], [2.8, 0.9], [3.02, 1.6]], AFF],
  cIaColl: [[[2.62, -2.2], [2.95, -1.3], [2.8, -0.46]], AFF],
  cIaFlex: [[[2.84, -0.04], [3.08, 0.22], [3.34, 0.53]], INH, true],
  cMnOut: [MN_OUT, GREEN],
  cFlexOut: [[[3.7, 0.94], [3.98, 1.7], [3.85, 3], [3.6, 4.3], [5.4, 4.8], [7.5, 3.7]], GREEN],
  cGammaOut: [[[2.6, 1.36], [2.75, 2.5], [2.95, 3.5], [3.1, 4.5], [5.2, 5.4], [7.6, 4.3]], DESC],
  cIb: [[[7.8, -4.9], [6, -5.2], [4.5, -4.3], [3.75, -3.2], [3.5, -2], [3.36, -1.3]], 0x2a9d9d],
  cIbMn: [[[3.2, -0.8], [3.05, -0.2], [3.08, 0.7], [3.16, 1.53]], INH, true],
  cCstAlpha: [[[5, -1.9], [4.4, -0.7], [3.85, 0.9], [3.46, 1.7]], DESC],
  cCstGamma: [[[4.9, -2], [4, -1], [3.1, 0.3], [2.74, 0.97]], DESC],
  cMnRen: [[[3.25, 2.5], [2.5, 2.45], [1.95, 1.85], [1.93, 1.18]], GREEN],
  cRenMn: [[[2.14, 1.04], [2.55, 1.42], [2.93, 1.72]], INH, true],
  cRenNear: [[[2, 1.14], [2.14, 1.5], [2.32, 1.73]], INH, true],
  cRetRen: [[[2.5, 3.8], [2.15, 2.8], [1.8, 1.8], [1.88, 1.16]], DESC],
  cPain: [[[7.8, -5.2], [6, -5.5], [4.4, -4.45], [3.95, -3.4], [3.68, -2.54]], PAIN],
  cExFlex: [[[3.7, -2.05], [3.82, -1.2], [3.8, -0.1], [3.6, 0.47]], GREEN],
  cExInh: [[[3.45, -2], [3.38, -1.3], [3.44, -0.58]], GREEN],
  cInhExt: [[[3.36, -0.12], [3.2, 0.5], [3.2, 1.1], [3.22, 1.55]], INH, true],
  cExPart: [[[3.34, -2.2], [2.6, -1.5], [1.6, -0.55], [0.98, -0.13]], GREEN],
  cPartExtL: [[[0.55, 0.16], [-0.5, 0.4], [-1.9, 1.05], [-2.93, 1.72]], GREEN],
  cPartInhL: [[[0.48, -0.1], [-0.6, -0.3], [-2.2, -0.42], [-3.25, -0.34]], GREEN],
  cInhFlexL: [[[-3.52, -0.1], [-3.56, 0.2], [-3.52, 0.47]], INH, true],
  cExtLOut: [MN_OUT.map(([x, z]) => [-x, z]), GREEN],
  cCpgPart: [[[1.56, 0.26], [1.2, 0.15], [0.98, 0.08]], GREEN],
  cPartCpgL: [[[0.48, 0.05], [-0.6, 0.2], [-1.5, 0.3]], GREEN],
};

const BONE = 0xe9dfc8, MUSCLE = 0xbf6253, HAM = 0x9c5a78, NERVE = 0xe8b21e, SENS = 0x4f86c6, MOT = 0xc9485b, GANGLION = 0xd9a82e, IVORY = 0xf1ead8;
const REAL = {
  spine: ['vertebre T11-L5', BONE, { ghost: true, opacity: 0.4 }],
  sacrum: ['sacro e coccige', BONE, { ghost: true, opacity: 0.35 }],
  hipR: ["osso dell'anca destro", BONE, { ghost: true, opacity: 0.3 }],
  hipL: ["osso dell'anca sinistro", BONE, { ghost: true, opacity: 0.3 }],
  femurR: ['femore', BONE], femurL: ['femore sinistro', BONE],
  patellaR: ['rotula', 0xf3ead2], patellaL: ['rotula sinistra', 0xf3ead2],
  tibiaR: ['tibia e fibula', BONE], tibiaL: ['tibia e fibula di sinistra', BONE],
  cord: ['midollo spinale: rigonfiamento lombare e cono', IVORY],
  rectus: ['muscolo retto femorale (quadricipite)', MUSCLE],
  quadTendon: ['tendine del quadricipite', 0xf4f1e6],
  patLig: ['legamento rotuleo', 0xdfe6ee],
  vasti: ['muscoli vasti (quadricipite)', 0xc67464],
  hams: ['muscoli posteriori della coscia (flessori della gamba)', HAM],
  quadL: ['quadricipite femorale sinistro', MUSCLE],
  hamsL: ['muscoli posteriori della coscia di sinistra', HAM],
  femoral: ['nervo femorale', NERVE], femoralL: ['nervo femorale sinistro', NERVE],
  sciatic: ['nervo ischiatico', 0xd9c06a], sciaticL: ['nervo ischiatico sinistro', 0xd9c06a],
};

const PLATE_IDS = new Set();
// Primi piani (vedi AnatomyModel.zoomTo): punto del modello che va sopra il centro della
// base, ingrandimento e quota. Nei primi piani la base non serve. `plateOnly`: la piastra
// sta sospesa sopra il bacino, e il resto del corpo le resterebbe attorno: viene nascosto.
const at = (r, b, u) => Q(r, b, u).toArray();
export const FOCUS = {
  plate: { at: [0, PLATE.top, PLATE.z], scale: 3.8, height: 0.24, stand: false, plateOnly: true },
  spindle: { at: at(FU.r, FU.b, FU.u), scale: 8.5, height: 0.3, stand: false },
  gto: { at: at(...GT.c), scale: 10, height: 0.22, stand: false },
  thigh: { at: at(70, 0, 330), scale: 1.5, height: 0, stand: false },
  knee: { at: at(83, -10, 425), scale: 2.4, height: 0.1, stand: false },
};

// Martelletto da trascinare (vedi setHammer): a riposo sta davanti al ginocchio,
// spostato di HAMMER_HOME rispetto al colpo; colpisce quando la testa arriva a
// HIT dal legamento rotuleo (o quando lo si lascia sopra il legamento). Il colpo che
// non va a segno lo dice la pagina, nominando la parte sotto il puntatore.
const HAMMER_HOME = V(0.004, 0.03, 0.06);
const HIT = 0.012;
// Estensione della gamba nel riflesso: rotazione di tibia e legamento rotuleo attorno
// all'asse trasversale del ginocchio (punto STIMATO tra condili e piatto tibiale).
const KNEE = Q(95, 12, 428);
const KICK = { angle: -0.55, time: 1.2 };

export class Riflessi extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.17, z: 0 });
    this.hammer = { off: HAMMER_HOME.clone(), held: false, swing: -1, handlers: null };
    this.kickAt = -Infinity;
    this.ready = this.#build();
  }

  // Nel primo piano sulla sezione restano visibili solo le parti della piastra.
  zoomTo(focus) {
    super.zoomTo(focus);
    if (focus?.plateOnly) this.show([...this.visible].filter((id) => PLATE_IDS.has(id)));
  }

  async #build() {
    await this.loadMeshes('riflessi.glb', REAL);
    for (const [id, d] of Object.entries({ femoral: 1.7, femoralL: 1.7, sciatic: 1.9, sciaticL: 1.9 })) this.#inflate(id, d * S);
    for (const id of ['tibiaR', 'tibiaL', 'sciatic', 'sciaticL']) this.#clampFloor(id, 0.012);
    this.#nerves();
    this.#spindle();
    this.#tendonOrgan();
    this.#hammer();
    const before = new Set(this.parts.keys());
    this.#section();
    for (const id of this.parts.keys()) if (!before.has(id)) PLATE_IDS.add(id);
    this.#pathways();
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

  // Taglio netto sotto il ginocchio: i vertici sotto il piano vengono portati sul piano.
  #clampFloor(id, floor) {
    for (const m of this.parts.get(id).meshes) {
      const p = m.geometry.attributes.position;
      const y0 = floor - m.position.y;
      for (let i = 0; i < p.count; i++) if (p.getY(i) < y0) p.setY(i, y0);
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }

  #nerves() {
    const L = ['L2', 'L3', 'L4'];
    const post = L.map((l) => tube(rootPath(l, 1), 0.9, { seg: 44, radial: 8 }));
    const ant = L.map((l) => tube(rootPath(l, -1), 0.9, { seg: 44, radial: 8 }));
    const gang = L.map((l) => blob([FORAMEN[l][0] - 3, FORAMEN[l][1] + 2.2, FORAMEN[l][2] + 3], [4.2, 2.6, 2.8], 14));
    const sac = Object.values(SACRAL).map((p) => tube(p, 1.1, { seg: 50, radial: 8 }));
    const plexus = [
      ...L.map((l) => tube(RAMI[l], 1.9)),
      ...L.map((l) => tube(FEM_ROOTS[l], 1.8, { caps: false })),
      tube(FEM_PELVIC, [2.4, 2.6], { caps: false }),
    ];
    const rf = [tube(RF_BRANCH, [1.9, 1.3], { seg: 40 })];
    const hb = [tube(HAM_BRANCH, [1.7, 1.2], { seg: 30 })];
    this.addPart('rootPost', 'radici posteriori L2-L4 (decorso ricostruito)', SENS, post);
    this.addPart('rootAnt', 'radici anteriori L2-L4 (decorso ricostruito)', MOT, ant);
    this.addPart('ganglion', 'gangli spinali L2-L4', GANGLION, gang);
    this.addPart('plexus', 'rami anteriori L2-L4 e radici del nervo femorale (ricostruiti)', NERVE, plexus);
    this.addPart('rfBranch', 'ramo muscolare del nervo femorale per il retto femorale (ricostruito)', NERVE, rf);
    this.addPart('rootSac', "radici L5-S2 per il nervo ischiatico (decorso ricostruito)", 0xd9c06a, sac);
    this.addPart('hamBranch', "ramo dell'ischiatico per il bicipite femorale (ricostruito)", 0xd9c06a, hb);
    // lato sinistro: copia speculare
    this.addPart('rootsL', 'radici e gangli L2-S2 di sinistra (ricostruiti)', 0xb9ad98, [...post, ...ant, ...gang, ...sac].map((g) => mirror(g)));
    this.addPart('plexusL', 'rami L2-L4 e nervo femorale di sinistra (ricostruiti)', NERVE, [...plexus, ...rf].map((g) => mirror(g)));
    this.addPart('hamBranchL', "ramo dell'ischiatico sinistro per il bicipite femorale (ricostruito)", 0xd9c06a, hb.map((g) => mirror(g)));
  }

  #spindle() {
    const fibre = ([dr, db], len, r) => tube([-len / 2, -len / 6, 0, len / 6, len / 2].map((du) => fu(dr, db, du)), r, { seg: 40, radial: 10 });
    this.addPart('extrafusal', 'fibre muscolari extrafusali', 0xb9584c,
      [[-9, 2], [-7.5, -6], [8, -5.5], [9.5, 3], [0.5, 8.5]].map((o) => fibre(o, 104, 1.5)));
    this.addPart('fusCapsule', 'capsula connettivale del fuso', 0xf2e2b0,
      [tube([-27, -14, 0, 14, 27].map((du) => fu(0, -0.3, du)), [1.2, 3.4, 4.6, 3.4, 1.2], { seg: 40, radial: 20 })], { opacity: 0.2 });
    this.addPart('bagFibers', 'fibre intrafusali a sacco di nuclei (dinamiche)', 0xe0907a,
      BAGS.map((o) => fibre(o, 64, [0.55, 0.6, 1.05, 0.6, 0.55])), { opacity: 0.62 });
    this.addPart('chainFibers', 'fibre intrafusali a catena di nuclei (statiche)', 0xeab79a,
      CHAINS.map((o) => fibre(o, 44, 0.36)), { opacity: 0.62 });
    this.addPart('bagNuclei', 'nuclei raggruppati (sacco)', 0x3b2a6b,
      BAGS.flatMap(([dr, db]) => [[0, 0, -1.5], [0.3, 0.2, -0.5], [-0.3, -0.2, 0.3], [0.2, -0.3, 1.1], [-0.1, 0.3, 1.9], [0.3, 0, 0.4], [-0.3, 0.1, -1]].map(([a, b, c]) => blob(fu(dr + a, db + b, c), [0.36, 0.36, 0.42], 8))));
    this.addPart('chainNuclei', 'nuclei in singola fila (catena)', 0x3b2a6b,
      CHAINS.flatMap(([dr, db]) => [-2.4, -1.2, 0, 1.2, 2.4].map((du) => blob(fu(dr, db, du), [0.22, 0.22, 0.4], 8))));
    const stemIa = [fu(-2.8, 0.6, 0), fu(-6.5, 0.5, 4), fu(-8, 0, 16), fu(-8, 0, 28), NERVE_IN];
    this.addPart('endIa', 'fibra Ia: terminazione anulospirale', AFF, [
      ...BAGS.map((o) => tube(helix(o, 1.38, -3.4, 3.4, 5), 0.24, { seg: 150, radial: 6 })),
      ...CHAINS.map((o) => tube(helix(o, 0.62, -2.6, 2.6, 4), 0.16, { seg: 120, radial: 6 })),
      tube(stemIa, 0.55, { seg: 30 }),
      tube([fu(-2.8, 0.6, 0), fu(-2.6, -1.6, 0.4), fu(-1.2, -2.6, 0.6), fu(1.4, -2.6, 0.4), fu(2.6, -1.4, 0)], 0.3, { seg: 20, radial: 6 }),
    ]);
    const spray = [-1, 1].flatMap((sgn) => CHAINS.flatMap(([dr, db]) =>
      [5.2, 6.6, 8].map((du, i) => blob(fu(dr + (i - 1) * 0.25, db - 0.5, sgn * du), [0.5, 0.42, 0.6], 8))));
    const stemII = (sgn) => tube([fu(-1.9, -1.9, sgn * 6.6), fu(0, -2.9, sgn * 6.8), fu(1.9, -1.9, sgn * 6.6)], 0.26, { seg: 16, radial: 6 });
    this.addPart('endII', 'fibre II: terminazioni a fiorame', 0x1f9d8f, [
      ...spray, stemII(1), stemII(-1),
      tube([fu(0, -2.9, -6.8), fu(0, -5.4, -3), fu(0, -6, 8), fu(-3, -5, 24), NERVE_IN], 0.45, { seg: 30 }),
      tube([fu(0, -2.9, 6.8), fu(0, -5, 8.5), fu(0, -6, 11)], 0.3, { seg: 12, radial: 6 }),
    ]);
    const plates = [-1, 1].flatMap((sgn) => [
      ...BAGS.map(([dr, db]) => blob(fu(dr, db + 0.75, sgn * 22), [0.75, 0.5, 1.5], 10)),
      ...CHAINS.map(([dr, db]) => blob(fu(dr, db - 0.5, sgn * 16), [0.5, 0.4, 1.1], 10)),
    ]);
    const stemG = (sgn) => tube([fu(0, 1.6, sgn * 22), fu(0, 5.2, sgn * 20), fu(-2, 6.5, sgn * 22 + 10), ...(sgn > 0 ? [NERVE_IN] : [fu(-5, 7, 0), fu(-6, 6, 26), NERVE_IN])], 0.4, { seg: 30 });
    const twig = (sgn) => tube([fu(-1.7, -1.6, sgn * 16), fu(0, -3.4, sgn * 17), fu(1.7, -1.6, sgn * 16)], 0.22, { seg: 14, radial: 6 });
    const join = (sgn) => tube([fu(0, -3.4, sgn * 17), fu(3.8, -2, sgn * 19), fu(3, 3, sgn * 20.5), fu(0, 5.2, sgn * 20)], 0.26, { seg: 20, radial: 6 });
    this.addPart('endGamma', 'fibre motorie gamma: placche ai poli', DESC, [...plates, stemG(1), stemG(-1), twig(1), twig(-1), join(1), join(-1)]);
    this.addPart('endAlpha', 'fibra motoria alfa: placche sulle fibre extrafusali', RED, [
      ...[[-9, 2], [-7.5, -6], [0.5, 8.5]].map(([dr, db]) => blob(fu(dr + 0.6, db, 20), [1.3, 1.3, 2.2], 10)),
      tube([fu(-8.4, 2, 20), fu(-9, -2, 27), NERVE_IN], 0.5, { seg: 16 }),
      tube([fu(-6.9, -6, 20), fu(-8, -3.5, 26), fu(-9, -2, 27)], 0.4, { seg: 12 }),
      tube([fu(1.1, 8.5, 20), fu(-3, 7, 30), NERVE_IN], 0.4, { seg: 16 }),
    ]);
  }

  #tendonOrgan() {
    this.addPart('gtoCapsule', "capsula dell'organo tendineo del Golgi", 0xf2e2b0,
      [tube([-13, -7, 0, 7, 13].map((a) => gt(a, 0)), [0.9, 2.6, 3.3, 2.6, 0.9], { seg: 30, radial: 18 })], { opacity: 0.22 });
    const strand = (i) => tube(Array.from({ length: 9 }, (_, j) => {
      const a = -20 + j * 4.2, ph = i * 1.26 + j * 0.9, w = 1.5 * Math.sin((Math.PI * j) / 8);
      return gt(a, (i - 2) * 0.45 + w * Math.cos(ph), w * Math.sin(ph));
    }), 0.42, { seg: 40, radial: 7 });
    this.addPart('gtoCollagen', 'fasci di collagene del tendine', 0xf4f1e6, [0, 1, 2, 3, 4].map(strand));
    this.addPart('gtoMuscle', "fibre muscolari in serie con l'organo tendineo", 0xb9584c,
      [0, 1, 2, 3, 4].map((i) => tube([gt(13.5, (i - 2) * 0.5, 0), gt(20, (i - 2) * 1.6, Math.abs(i - 2) * 0.5 - 0.5), gt(40, (i - 2) * 2.3, Math.abs(i - 2) * 0.6 - 0.6)], [0.5, 1, 1], { seg: 16 })));
    const IB_IN = gt(1, -3.6, -1.5);
    this.addPart('endIb', 'fibra Ib: terminazioni tra i fasci di collagene', 0x2a9d9d, [
      tube([IB_IN, gt(0, -1.2, -0.4), gt(-1, 0.6, 0.2)], 0.36, { seg: 12 }),
      ...[[-7, -0.8, 0.5], [-4, 1.1, -0.6], [3, 1.2, 0.5], [6.5, -0.6, -0.5], [0, -1.2, 0.9]].flatMap(([a, p, q]) => [
        tube([gt(-1, 0.6, 0.2), gt(a * 0.5, p * 0.8, q * 0.8), gt(a, p, q)], 0.2, { seg: 10, radial: 6 }),
        blob(gt(a, p, q), [0.55, 0.55, 0.85], 8),
      ]),
      tube(IB_PATH.slice(0, 3), 0.5, { seg: 20 }),
    ]);
  }

  #hammer() {
    const part = this.addPart('hammer', 'martelletto', 0xc0563a, [
      blob([83, -21, 404], [7, 13, 9], 16),
      tube([[83, -27, 404], [88, -70, 440], [95, -128, 492]], 1.9, { seg: 12 }),
    ]);
    const h = this.hammer;
    h.homes = part.meshes.map((m) => m.position.clone());
    h.strike = part.meshes[0].position.clone(); // la testa, nel punto del colpo
    // presa invisibile, più grande del martelletto: si afferra bene anche al tocco
    const grip = new THREE.Group();
    const ghost = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), ghost);
    head.position.copy(h.strike);
    const a = Q(83, -27, 404), b = Q(95, -128, 492);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, a.distanceTo(b), 8), ghost);
    handle.position.copy(a).lerp(b, 0.5);
    handle.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
    grip.add(head, handle);
    grip.visible = false;
    this.inner.add(grip);
    h.grip = grip;
    const plane = new THREE.Plane();
    const offset = new THREE.Vector3();
    const local = (ray) => {
      this.inner.updateWorldMatrix(true, false);
      return ray.clone().applyMatrix4(this.inner.matrixWorld.clone().invert());
    };
    const headAt = () => h.strike.clone().add(h.off);
    const ui = {
      id: 'hammer', tip: 'martelletto: portalo sul legamento rotuleo', cursor: 'grab',
      grab: {
        // il martelletto si porta nel piano frontale che passa davanti al legamento
        // (se chi guarda lo vede di taglio, in un piano rivolto a chi guarda)
        start: (ray) => {
          const r = local(ray);
          const lig = this.parts.get('patLig').center.clone();
          lig.z += 0.006;
          const front = V(0, 0, 1);
          plane.setFromNormalAndCoplanarPoint(Math.abs(front.dot(r.direction)) > 0.25 ? front : r.direction.clone().negate(), lig);
          const p = r.intersectPlane(plane, new THREE.Vector3());
          if (!p) return;
          offset.copy(headAt()).sub(p);
          offset.addScaledVector(plane.normal, -offset.dot(plane.normal));
          h.held = true;
          h.swing = -1;
        },
        move: (ray) => {
          if (!h.held) return;
          const p = local(ray).intersectPlane(plane, new THREE.Vector3());
          if (!p) return;
          h.off.copy(p.add(offset).sub(h.strike));
          // la testa tocca il legamento rotuleo: il colpo è dato
          if (this.nearestPart(headAt(), ['patLig']).d < HIT) strike();
        },
        // lasciato: conta ciò che sta sotto il puntatore (la presa, invisibile, si toglie)
        end: (pickUnder) => {
          if (!h.held) return;
          h.held = false;
          grip.visible = false;
          const id = pickUnder?.()?.ui?.id;
          grip.visible = true;
          if (id === 'patLig') return strike();
          h.handlers?.onMiss?.(id && id !== 'hammer' ? id : null);
        },
      },
    };
    const strike = () => {
      h.held = false;
      this.swingHammer();
      h.handlers?.onStrike?.();
    };
    for (const m of grip.children) m.userData.ui = ui;
  }

  // Martelletto da trascinare: onStrike() quando colpisce il legamento rotuleo,
  // onMiss(idParte | null) quando lo si lascia altrove (la parte sotto il puntatore, se c'è).
  // setHammer(null) lo rimette com'era: un oggetto di scena da toccare.
  setHammer(handlers) {
    this.hammer.handlers = handlers;
    this.hammer.held = false;
  }

  // il colpo: la testa va sul legamento e torna a riposo
  swingHammer() {
    this.hammer.swing = 0;
    this.hammer.from = this.hammer.off.clone();
  }

  // la gamba si estende sulla coscia, e torna
  kickLeg() {
    this.kickAt = this.time;
  }

  reset() {
    super.reset();
    this.setHammer(null);
    this.hammer.swing = -1;
    this.kickAt = -Infinity;
  }

  update(dt, camera, realDt = dt) {
    const h = this.hammer;
    const part = this.parts.get('hammer');
    if (part) {
      // il colpo: in 0,12 s sul legamento, poi indietro
      if (h.swing >= 0) {
        h.swing += realDt;
        const t = h.swing;
        if (t < 0.12) h.off.copy(h.from).lerp(V(0, 0, 0), t / 0.12);
        else if (t < 0.3) h.off.set(0, 0, 0);
        else h.off.lerp(HAMMER_HOME, 1 - Math.exp(-realDt * 5));
        if (t > 2.5) h.swing = -1;
      } else if (!h.held) h.off.lerp(HAMMER_HOME, 1 - Math.exp(-Math.min(realDt, 0.5) * 6));
      part.meshes.forEach((m, i) => m.position.copy(h.homes[i]).add(h.off));
      h.grip.position.copy(h.off);
      h.grip.visible = !!h.handlers && part.shown > 0.5;
      // la gamba: un calcio breve, avanti e indietro
      const k = (this.time - this.kickAt) / KICK.time;
      const angle = k >= 0 && k < 1 ? KICK.angle * Math.sin(Math.PI * k) ** 2 : 0;
      const q = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), angle);
      for (const id of ['tibiaR', 'patLig']) {
        const p = this.parts.get(id);
        p.homes ??= p.meshes.map((m) => m.position.clone());
        p.meshes.forEach((m, i) => {
          m.position.copy(p.homes[i]).sub(KNEE).applyQuaternion(q).add(KNEE);
          m.quaternion.copy(q);
        });
      }
    }
    super.update(dt, camera, realDt);
  }

  #section() {
    this.addPart('section', 'sostanza bianca (sezione lombare ingrandita)', 0xfaf5e6, [slab(WHITE, 0)]);
    this.addPart('grey', 'sostanza grigia', 0xa9968a, [slab(GREY, UP.grey)]);
    this.addPart('antHorn', 'corno anteriore (lamina IX: motoneuroni)', 0xc4a094, two([...ANT_HORN, ...ANT_BASE], UP.zone));
    this.addPart('postHorn', 'corno posteriore', 0x8f7468, two(POST_HORN, UP.zone));
    this.addPart('lam7', 'lamina VII (zona intermedia)', 0x7fb3a0, two(LAM7, UP.zone));
    this.addPart('lam10', "lamina X, attorno al canale centrale dell'ependima", 0x6f8fd0, [sheet(LAM10, UP.zone + 0.0002)]);
    const disc = new THREE.CylinderGeometry(0.3 * K, 0.3 * K, 0.0008, 20);
    disc.translate(0, PLATE.top + UP.zone + 0.0005, PLATE.z);
    this.addPart('canal', "canale centrale dell'ependima", 0x2b3f73, [lean(disc)]);
    this.addPart('cst', 'fascio cortico-spinale laterale', 0xe58a2e, two(TRACTS.cst, UP.tract));
    this.addPart('vest', 'fascio vestibolo-spinale laterale', 0xd9a82e, two(TRACTS.vest, UP.tract));
    this.addPart('retSpin', 'fascio reticolo-spinale', 0xb5651d, two(TRACTS.retSpin, UP.tract + 0.0002));

    const root = (pts) => [1, -1].map((s) => taperTube(pts.map(([dx, dz]) => P(s * dx, dz, -0.001)), 0.36 * K, { seg: 30, radial: 10 }));
    this.addPart('rootPostP', 'radice posteriore', SENS, root(ROOT_POST_P));
    this.addPart('rootAntP', 'radice anteriore', MOT, root(ROOT_ANT_P));
    this.addPart('ganglionP', 'ganglio spinale', GANGLION, [1, -1].map((s) => {
      const g = ellipsoid([0, 0, 0], [1.05 * K, 0.7 * K, 0.7 * K], [0, s * -0.2, 0], 16);
      const c = P(s * 7.3, -5.4, -0.001);
      return g.translate(c.x, c.y, c.z);
    }));

    const soma = (dx, dz, r) => {
      const c = P(dx, dz, UP.soma + r * K * 0.55);
      return ellipsoid([c.x, c.y, c.z], [r * K, r * K * 0.8, r * K], null, 14);
    };
    for (const [id, [name, color, dx, dz, r]] of Object.entries(NEURONS)) this.addPart(id, name, color, [soma(dx, dz, r)]);
    this.addPart('cpg', 'CPG: catena di interneuroni eccitatori e inibitori', 0xd9628f, [...CPG, ...CPG.map(([x, z]) => [-x, z])].map(([x, z]) => soma(x, z, 0.13)));

    // linee di richiamo dal taglio del midollo reale alla sezione ingrandita
    const hw = halfWidth(CUT);
    this.addPart('guide', 'la sezione ingrandisce 14 volte il midollo tagliato qui sotto', 0x8a8478,
      [1, -1].map((s) => taperTube([Q(s * hw, axis(CUT), CUT - 1), P(s * 7.2, -0.3, -PLATE.h)], 0.0006, { seg: 4, radial: 6 })), { opacity: 0.6 });
  }

  #pathways() {
    for (const [id, [pts, color, inhibit = false]] of Object.entries(CENTRAL))
      this.addLink(id, pts.map(([dx, dz]) => P(dx, dz, UP.fibre)), { color, inhibit, r: 0.00075 });
    const ring = (side, tag) => CPG.forEach(([x, z], i) => {
      const [x1, z1] = CPG[(i + 1) % 3];
      const a = P(side * (x + (x1 - x) * 0.28), z + (z1 - z) * 0.28, UP.fibre), b = P(side * (x + (x1 - x) * 0.72), z + (z1 - z) * 0.72, UP.fibre);
      this.addLink(`cpg${i}${tag}`, [a, a.clone().lerp(b, 0.5), b], { color: i === 2 ? INH : GREEN, inhibit: i === 2, r: 0.00045 });
    });
    ring(1, '');
    ring(-1, 'L');

    const link = (id, pts, color, opts = {}) => this.addLink(id, pts.map((p) => Q(...p)), { color, r: 0.0021, ...opts });
    const rev = (a) => a.slice().reverse();
    // afferenza: fuso › ramo muscolare › nervo femorale › radici del femorale › L4 › ganglio › radice posteriore
    const A = 2.6; // scarto laterale tra fibre afferenti ed efferenti nello stesso nervo (mm)
    link('aff1', off([fu(-8, 0, 16), fu(-8, 0, 28), ...rev(RF_BRANCH), ...rev(FEM_REAL).slice(1)], A), AFF);
    link('aff2', off([...rev(FEM_PELVIC), ...rev(FEM_ROOTS.L4).slice(1), ...rev(RAMI.L4).slice(1)], A * 0.6, 2), AFF);
    link('aff3', off(rev(rootPath('L4', 1)), 0.5, 1.5), AFF);
    link('ib1', off([...IB_PATH, ...rev(RF_BRANCH).slice(2), ...rev(FEM_REAL).slice(1)], A, 2.5), 0x2a9d9d);
    // efferenza: radice anteriore › L4 › nervo femorale › ramo muscolare › fibre extrafusali
    link('eff1', off(rootPath('L4', -1), 0.5, -1.5), GREEN);
    link('eff2', off([...RAMI.L4, ...FEM_ROOTS.L4.slice(1), ...FEM_PELVIC.slice(1)], -A * 0.6, -2), GREEN);
    link('eff3', off([...FEM_REAL, ...RF_BRANCH.slice(1), fu(-11, -2, 27)], -A), GREEN);
    link('gammaEnd', [[101, -40, 752], [110, -39, 728], fu(-1, 6, 30), fu(0, 5.4, 21)], DESC, { r: 0.0012 });
    // antagonista: S1 › nervo ischiatico › ramo per il bicipite femorale
    link('flex1', off(SACRAL.S1, 0.5, -1.5), GREEN);
    link('flex2', off([...rev(SCIATIC_UP).slice(1), ...HAM_BRANCH.slice(1)], -A), GREEN);
    // dolore: dal piede lungo tibiale e ischiatico fino a S1
    link('pain1', off(TIBIAL_UP, A), PAIN);
    link('pain2', off(SCIATIC_UP.slice(0, -1), A), PAIN);
    link('pain3', off(rev(SACRAL.S1), 0.5, 1.5), PAIN);
    // lato opposto: quadricipite sinistro
    link('extL1', left(off(rootPath('L4', -1), 0.5, -1.5)), GREEN);
    link('extL2', left(off([...RAMI.L4, ...FEM_ROOTS.L4.slice(1), ...FEM_PELVIC.slice(1)], -A * 0.6, -2)), GREEN);
    link('extL3', left(off([...FEM_REAL, ...RF_BRANCH.slice(1), fu(-11, -2, 27)], -A)), GREEN);
  }
}

// fibra Ib: dall'organo tendineo su per il ventre fino al ramo muscolare
const IB_PATH = [gt(1, -3.6, -1.5), gt(8, -6, -3), [97, -40, 565], [103, -45, 625], [102, -45.5, 700], RF_BRANCH[3]];
