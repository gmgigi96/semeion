// Modello del cervelletto con tronco encefalico, peduncoli, nuclei profondi e vie.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0, derivato da BodyParts3D; file
// public/meshes/cervelletto.glb, manifesto meshes/cervelletto.json):
// - verme, un oggetto per lobulo: lingula, lobulo centrale, culmen, declive,
//   folium, tuber, piramide, uvula, nodulo;
// - emisferi, un oggetto per lobulo e per lato: ala del lobulo centrale, lobulo
//   quadrangolare anteriore e posteriore, semilunare superiore e inferiore,
//   gracile, biventre, tonsilla, flocculo e peduncolo del flocculo;
// - peduncolo cerebellare superiore (dal corpo midollare al mesencefalo);
// - mesencefalo (con base del peduncolo e collicoli), ponte, bulbo (tagliato
//   in basso), oliva bulbare, nucleo rosso, talamo, quarto ventricolo.
// I lobi e le porzioni funzionali sono gruppi di questi lobuli: le fessure
// (primaria, postero-laterale) e le docce paravermiane sono i confini reali fra
// le mesh. Da sapere sulla sorgente: i lobuli sono corpi pieni e lisci, senza
// lamelle; fra loro resta al centro un vuoto, che è lo spazio del corpo
// midollare: i nuclei profondi sono ricostruiti lì dentro. «Vestibular nuclei»
// di Z-Anatomy è mal posto (ponte medio-alto) e non è usato. Il ponte di
// Z-Anatomy comprende lateralmente l'attacco del peduncolo medio.
//
// RICOSTRUITO A MANO nella terna delle mesh reali (punti in mm della sorgente,
// convertiti da `mm`):
// - fessura primaria: cordone posato sul confine reale fra le mesh del lobo
//   anteriore (culmen, quadrangolare anteriore) e del posteriore (declive,
//   quadrangolare posteriore), cercato con raggi verticali sulle mesh;
// - corpo midollare (involucro), peduncoli cerebellari medio e inferiore;
// - nuclei profondi: fastigio, interposito (emboliforme e globoso), dentato;
// - nuclei vestibolari (stesse coordinate del capitolo sulle vie
//   vestibolo-cocleari), nuclei basilari del ponte, centro reticolare bulbare
//   (stesse coordinate del capitolo sulla formazione reticolare),
//   nucleo ventrale laterale dentro il talamo reale;
// - tutte le vie (frecce) e, nella quinta doppia pagina, il blocco di lamella
//   con i tre strati della corteccia e il suo circuito (schema istologico
//   ingrandito, non in scala con il resto).
// TESSITURA: le lamelle sono disegnate sui lobuli reali da una tessitura
// procedurale (vedi `#folia`), trasversali e concentriche attorno all'asse che
// passa per l'ilo; passo e decorso sono indicativi, la geometria non cambia.
// Controlli fatti sulle mesh (test di appartenenza a raggi): i nuclei profondi
// e i tratti intracerebellari dei peduncoli stanno nel vuoto centrale, fuori
// dai lobuli (interposito per intero; fastigio e dentato per oltre il 90% dei
// punti campione, il resto sfiora culmen, quadrangolare posteriore e biventre); nuclei basilari e vestibolari dentro ponte e bulbo; il nucleo
// ventrale laterale dentro il talamo. Reperi misurati: apice del tetto del IV
// ventricolo (fastigium) a y 34, z 1589 sulla linea mediana; nodulo subito
// sotto (z 1574-1586); estremo prossimale del peduncolo superiore reale a
// 13,6 mm dalla linea mediana, y 39, z 1584 (lì è posto l'ilo del dentato).
//
// FONTI effettivamente lette (Kenhub: le pagine provate, «cerebellar-nuclei» e
// «the-cerebellum», hanno risposto 404; NCBI e Radiopaedia non consultati):
// - Wikipedia (en), https://en.wikipedia.org/wiki/… : «Deep cerebellar
//   nuclei», «Dentate nucleus», «Fastigial nucleus», «Emboliform nucleus»,
//   «Globose nucleus», «Anatomy of the cerebellum», «Cerebellum», «Cerebellar
//   peduncles», «Superior cerebellar peduncle», «Middle cerebellar peduncle»,
//   «Inferior cerebellar peduncle», «Pontine nuclei», «Inferior olivary nucleus».
// - Neuroscience Online (UTHealth Houston), «Cerebellum»
//   https://nba.uth.tmc.edu/neuroscience/m/s3/chapter05.html
// - Europe PMC, PMC4429588: Tellmann et al., Cytoarchitectonic mapping of the
//   human brain cerebellar nuclei in stereotaxic space, Front Neuroanat 2015.
// VERIFICATO su queste fonti:
// - nuclei nella sostanza bianca profonda, da laterale a mediale dentato,
//   emboliforme, globoso, fastigio; dentato a nastro pieghettato con l'ilo
//   mediale; emboliforme a cuneo, subito mediale al dentato, a coprirne in parte
//   l'ilo; globoso fra emboliforme e fastigio; fastigio accanto alla linea
//   mediana, sopra il tetto del IV ventricolo, all'estremo anteriore del verme
//   superiore;
// - volumi (Tellmann 2015, post mortem, per lato): dentato 395 mm³,
//   emboliforme 50, globoso 9,5, fastigio 45. Qui emboliforme, globoso e
//   fastigio sono ellissoidi di quel volume; il dentato è un sacco pieghettato
//   il cui ingombro (16 x 12 x 6,2 mm) è più grande del volume della lamina;
// - peduncoli: il medio è il più grosso, fatto di fibre ponto-cerebellari
//   crociate nel ponte; l'inferiore nasce dalla parte postero-laterale del
//   bulbo alto, accanto alla parte inferiore del IV ventricolo; i superiori
//   delimitano in alto e di lato il IV ventricolo e si incrociano all'altezza
//   dei collicoli inferiori;
// - proiezioni: fastigio ai nuclei vestibolari e alla formazione reticolare
//   (corpo iuxtarestiforme); interposito al nucleo rosso controlaterale e
//   dentato al talamo ventrale laterale controlaterale, con il peduncolo
//   superiore; fibre rampicanti dall'oliva inferiore, crociate, con il
//   peduncolo inferiore; fibre muscoidi dai nuclei basilari, sparsi in tutta la
//   base del ponte, crociate, con il peduncolo medio;
// - corteccia: tre strati (granuli, Purkinje su una sola fila, molecolare);
//   albero dendritico delle Purkinje appiattito in un piano perpendicolare
//   alle lamelle, attraversato ad angolo retto dalle fibre parallele; assone
//   del granulo diviso a T; rosetta della fibra muscoide al centro del
//   glomerulo, con i dendriti ad artiglio dei granuli e i terminali della
//   cellula di Golgi; cellule stellate e a canestro nello strato molecolare.
// STIMATO (nessuna misura nelle fonti lette): coordinate, orientamento e
// semiassi di tutti i nuclei (posti in base ai rapporti descritti sopra e ai
// reperi delle mesh); forma del corpo midollare; calibro e decorso dei
// peduncoli medio e inferiore dentro il cervelletto; posizione del nucleo
// ventrale laterale nel talamo; decorso di tutte le vie, che sono frecce fra
// origine e bersaglio (la via nucleo-olivare è disegnata nel peduncolo
// superiore, crociata, e poi in discesa nella calotta: decorso non verificato
// sulle fonti lette); proporzioni del blocco di corteccia.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0075; // unità per mm (come nel manifesto)
const O = [0, 35, 1545]; // origine del manifesto, in mm
// punto in mm: [distanza dal piano mediano verso DESTRA, y (indietro), z (alto)]
const mm = ([r, b, h]) => new THREE.Vector3(r * S, (h - O[2]) * S, -(b - O[1]) * S);
const scaled = (r) => (Array.isArray(r) ? r.map((v) => v * S) : r * S);
const tube = (pts, r, opts) => taperTube(pts.map(mm), scaled(r), { radial: 14, ...opts });
// ellissoide: semiassi in mm (laterale, antero-posteriore, verticale)
const blob = (c, [ra, rb, rh], rot = null, detail = 22) => {
  const g = ellipsoid([0, 0, 0], [ra * S, rh * S, rb * S], rot, detail);
  const p = mm(c);
  return g.translate(p.x, p.y, p.z);
};
const flip = (pts) => pts.map(([r, b, h]) => [-r, b, h]);
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const ANT_V = [0xa9573c, 0xb5613f, 0xc06c47], ANT_H = [0xd08a62, 0xd9966c];
const STEM = 0xe0cdb0, WHITE = 0xf3ecdb;
const REAL = {
  lingula: ['lingula', ANT_V[0]],
  central: ['lobulo centrale (verme)', ANT_V[1]],
  culmen: ['culmen (verme)', ANT_V[2]],
  wing: ['ala del lobulo centrale', ANT_H[0]],
  quadAnt: ['lobulo quadrangolare anteriore', ANT_H[1]],
  declive: ['declive (verme)', 0xb9953f],
  folium: ['folium (verme)', 0xc4a04a],
  tuber: ['tuber (verme)', 0xb48d3c],
  pyramis: ['piramide del verme', 0xa9813a],
  uvula: ['uvula', 0xb78b52],
  quadPost: ['lobulo quadrangolare posteriore (semplice)', 0xe6cd92],
  semiSup: ['lobulo semilunare superiore', 0xecd6a4],
  semiInf: ['lobulo semilunare inferiore', 0xe2c588],
  gracile: ['lobulo gracile', 0xe9cf9a],
  biventer: ['lobulo biventre', 0xdcbb7c],
  tonsil: ['tonsilla cerebellare', 0xd3ae6c],
  nodulus: ['nodulo', 0x6f9a3e],
  flocculus: ['flocculo', 0x86b04e],
  floccPed: ['peduncolo del flocculo', 0x9cc066],
  scp: ['peduncolo cerebellare superiore', 0xf7f3e6],
  midbrain: ['mesencefalo', 0xd6c1a2],
  pons: ['ponte', STEM],
  medulla: ['bulbo', 0xdac6a8],
  olive: ['complesso olivare inferiore (oliva bulbare)', 0x8e5bb5],
  red: ['nucleo rosso', 0xc23b3b],
  thalamus: ['talamo', 0xd8c3ae, { opacity: 0.45 }],
  v4: ['quarto ventricolo', 0x6aa9d8, { ghost: true, opacity: 0.5 }],
};

// Fessura primaria: confine reale fra lobo anteriore e posteriore sulla faccia
// superiore, lato destro, dalla linea mediana al margine anteriore (mm).
const PRIMARY = [
  [0, 48.3, 1605.6], [2, 48, 1606.3], [4, 46.75, 1605.7], [6, 44.25, 1603.3], [8, 42.75, 1602.4], [10, 40.75, 1600.7],
  [12, 38.5, 1599.3], [14, 36, 1598.4], [16, 33.25, 1597.5], [18, 30.75, 1596.6], [20, 28.5, 1596], [22, 26.75, 1596.2],
  [24, 24.75, 1595.8], [26, 22.75, 1595.1], [28, 20.25, 1593.8], [29.4, 18.4, 1592.4],
];

// Decorso del peduncolo cerebellare superiore reale (asse della mesh, lato
// destro), dall'ilo del dentato al mesencefalo: le vie efferenti lo seguono.
const SCP_AXIS = [[11.3, 36.8, 1585.1], [7.2, 31.5, 1587.6], [6.6, 26.5, 1589.9], [6.3, 21, 1592.5], [6, 16.6, 1597], [5, 11.5, 1601.3]];
const DECUSS = [0, 7, 1604.6]; // incrocio dei peduncoli superiori, a livello dei collicoli inferiori
const PURKINJE = [30, 52, 1588.5]; // un punto della corteccia dell'emisfero destro (lobulo semilunare superiore)

const GLU = 0x1f9d57, CLIMB = 0xe07b00, GABA = 0xd43d3d;
// Vie: nuclei e corteccia del lato DESTRO; oliva, nuclei basilari, nucleo rosso
// e talamo del lato SINISTRO (le connessioni sono crociate).
const LINKS = {
  'fast-vest': [[[3.6, 38.2, 1588.8], [7.6, 33.4, 1585.4], [10.6, 27.5, 1582.4], [9.6, 22.6, 1580.3], [8.8, 20.4, 1579.9]], { color: GLU, r: 0.0034 }],
  'fast-ret': [[[3.4, 38, 1588.4], [8.4, 32.6, 1584.6], [10.9, 26.4, 1581.6], [8, 19, 1578.6], [4.6, 13.6, 1577.8], [2.8, 10.8, 1577.6]], { color: GLU, r: 0.0034 }],
  'inter-red': [[[9.5, 40, 1584.8], ...SCP_AXIS, DECUSS, [-3.4, 2.8, 1607.8], [-4.8, 0.6, 1609.4]], { color: GLU, r: 0.0036 }],
  'dent-thal': [[[15, 39.6, 1583.6], ...SCP_AXIS.map(([r, b, h]) => [r + 0.6, b, h - 0.5]), [0, 7.4, 1604], [-5.6, 4.2, 1609], [-8.6, 3.6, 1615], [-11.6, 3.4, 1620], [-13.2, 3.4, 1623]], { color: GLU, r: 0.0036 }],
  mossy: [[[-6, 2, 1588], [0, 1.2, 1588], [8, 3, 1588.4], [15.5, 12, 1588.5], [19, 22, 1586.6], [20.4, 31, 1584.6], [24.5, 38.5, 1586.4], [28, 46, 1588], PURKINJE], { color: GLU }],
  climb: [[[-8, 15.7, 1570], [-3, 16.6, 1570.6], [3, 18, 1571.2], [8, 21.5, 1572.6], [10.8, 22.3, 1575.5], [12.5, 24, 1579.5], [14, 29, 1581.4], [16.6, 35, 1580.6], [24.5, 40.5, 1579.6], [28.6, 47, 1584], PURKINJE], { color: CLIMB }],
  'climb-nuc': [[[15.8, 33.4, 1580.9], [16.6, 36.4, 1581.6], [17, 38.6, 1582.2]], { color: CLIMB, r: 0.003 }],
  purkinje: [[[29.6, 51.4, 1588], [27, 47.5, 1585.6], [23.6, 44.6, 1583.6]], { color: GABA, inhibit: true }],
  'nuc-olive': [[[14.6, 39.2, 1584.2], ...SCP_AXIS.map(([r, b, h]) => [r - 0.6, b, h + 0.5]), [0, 6.6, 1605.2], [-3.8, 8, 1600.5], [-4.6, 9.2, 1592], [-5.2, 11.2, 1583], [-6.6, 13.8, 1576.5], [-7.8, 15.2, 1573]], { color: GABA, inhibit: true, r: 0.0036 }],
};

// Lobuli della corteccia: ricevono la tessitura a lamelle.
const CORTEX = [
  'lingula', 'central', 'culmen', 'wing', 'quadAnt', 'declive', 'folium', 'tuber', 'pyramis', 'uvula',
  'quadPost', 'semiSup', 'semiInf', 'gracile', 'biventer', 'tonsil', 'nodulus', 'flocculus',
];
// Asse trasversale attorno a cui si dispongono le lamelle (passa per l'ilo).
const FOLIA_AXIS = [0, 36, 1586];


// --- Blocco di corteccia (quinta doppia pagina): schema ingrandito, in unità
// del modello. L'asse lungo della lamella è x; la sezione trasversale è y-z;
// la superficie della corteccia è in alto. Le pareti colorate (dietro e a un
// capo) segnano i tre strati; le cellule stanno nel volume davanti.
const BLK = { x0: -0.16, x1: 0.24, z0: -0.11, z1: 0.11 };
const LY = { floor: 0.07, gran: 0.12, purk: 0.24, mol: 0.27, top: 0.46 }; // quote dei limiti fra gli strati
const MINI = { scale: 0.34, pos: [0.03, 0.47, -0.1] }; // il cervelletto intero, rimpicciolito e girato, sopra il blocco
// cellule di Purkinje: [x lungo la lamella, z del soma]
const PURK = [[-0.06, 0.045], [0.06, -0.045], [0.18, 0.045]];
// granuli da cui nascono le fibre parallele: [x, y, z del granulo, quota della fibra]
const PARALLEL = [[0, 0.175, -0.02, 0.36], [0.12, 0.15, 0.05, 0.315], [-0.1, 0.2, 0.03, 0.41], [0.2, 0.19, -0.07, 0.39]];
const ROSETTE = [-0.03, 0.15, -0.03];
const MICRO_LINKS = {
  'k-mossy': [[[-0.4, 0.094, -0.035], [-0.2, 0.094, -0.035], [-0.07, 0.096, -0.035], [-0.04, 0.12, -0.032], [-0.031, 0.141, -0.03]], { color: GLU, r: 0.0038 }],
  'k-gran': [[[0, 0.182, -0.02], [0, 0.3, -0.02], [0.004, 0.354, -0.02], [0.03, 0.36, -0.02], [0.225, 0.36, -0.02]], { color: GLU, r: 0.0036 }],
  'k-par': [[[-0.004, 0.36, -0.02], [-0.07, 0.36, -0.02], [-0.146, 0.36, -0.02]], { color: GLU, r: 0.0036 }],
  'k-purk': [[[0.06, 0.238, -0.045], [0.06, 0.17, -0.041], [0.06, 0.108, -0.045], [0.03, 0.094, -0.045], [-0.22, 0.094, -0.027], [-0.272, 0.099, -0.012]], { color: GABA, inhibit: true, r: 0.0038 }],
  'k-golgi': [[[0.03, 0.2, 0.024], [0, 0.172, 0], [-0.019, 0.158, -0.021]], { color: GABA, inhibit: true, r: 0.003 }],
  'k-basket': [[[0.06, 0.293, 0.046], [0.06, 0.287, 0], [0.06, 0.281, -0.03]], { color: GABA, inhibit: true, r: 0.003 }],
  'k-stellate': [[[0.18, 0.412, -0.043], [0.18, 0.405, -0.01], [0.18, 0.393, 0.014]], { color: GABA, inhibit: true, r: 0.003 }],
  'k-climb': [[[-0.4, 0.084, 0.045], [-0.2, 0.084, 0.045], [-0.085, 0.086, 0.045], [-0.067, 0.11, 0.045], [-0.067, 0.2, 0.049], [-0.067, 0.3, 0.045], [-0.067, 0.365, 0.045]], { color: CLIMB, r: 0.0038 }],
  'k-climb-nuc': [[[-0.37, 0.084, 0.045], [-0.34, 0.09, 0.032], [-0.322, 0.096, 0.02]], { color: CLIMB, r: 0.003 }],
};

// Punti a cui si agganciano le etichette: i nuclei profondi (scostati fra loro)
// e gli strati della corteccia (sulla parete di fondo, a metà di ogni fascia).
const ANCHOR = {
  fastigial: mm([0, 40, 1592.5]), interposed: mm([-9.4, 41.6, 1588]), dentate: mm([23, 43, 1586.5]),
  layerMol: V(0.04, 0.37, BLK.z0), layerPurk: V(0.04, 0.243, BLK.z0), layerGran: V(0.04, 0.16, BLK.z0),
};

const P = (list) => list.map((p) => V(...p));
const wire = (pts, r, opts) => taperTube(P(pts), r, { seg: 16, radial: 6, ...opts });
const ball = (c, r) => ellipsoid(c, Array.isArray(r) ? r : [r, r, r], null, 12);
// più geometrie in una sola (una cellula = un pezzo)
const merge = (geos) => mergeGeometries(geos.map((g) => (g.deleteAttribute('uv'), g)));
const box = (x0, x1, y0, y1, z0, z1) => new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);

export class Cervelletto extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: -0.02 });
    const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 });
    // due aste: una regge il modello intero, l'altra il blocco di corteccia
    this.rods = [[0.068, 0.07], [0, LY.floor]].map(([z, top]) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, top - 0.02, 12), steel);
      m.position.set(0, (top + 0.02) / 2, z);
      m.castShadow = true;
      this.inner.add(m);
      return m;
    });
    this.layout = 0; // 0: modello intero; 1: cervelletto rimpicciolito sopra il blocco di corteccia
    this.layoutNow = 0;
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('cervelletto.glb', REAL);
    for (const id of CORTEX) this.#folia(id);
    this.#fissure();
    this.#white();
    this.#nuclei();
    for (const [id, [pts, opts]] of Object.entries(LINKS)) this.addLink(id, pts.map(mm), opts);
    // bersagli crociati: etichette e indicatori sul lato sinistro
    for (const id of ['olive', 'red']) this.#anchorLeft(id);
    // tutto ciò che è stato creato fin qui è il modello "macroscopico": sta in
    // un gruppo a sé, che la quinta doppia pagina rimpicciolisce
    this.macro = new THREE.Group();
    for (const o of [...this.inner.children]) if (!this.rods.includes(o)) this.macro.add(o);
    this.inner.add(this.macro);
    this.#cortexBlock();
  }

  #pair(id, name, color, geos, opts) {
    return this.addPart(id, name, color, [...geos, ...geos.map((g) => mirror(g))], opts);
  }

  #anchorLeft(id) {
    const part = this.parts.get(id);
    const m = part.meshes.reduce((a, b) => (b.position.x < a.position.x ? b : a));
    part.center = m.position.clone();
    part.top = m.position.y + m.userData.size.y / 2;
  }

  // Lamelle: i lobuli di Z-Anatomy sono lisci. Una tessitura procedurale (solchi
  // scuri e rilievo delle normali) disegna lamelle trasversali, concentriche
  // attorno all'asse che passa per l'ilo. Non cambia la geometria reale.
  #folia(id) {
    const part = this.parts.get(id);
    const c = part.meshes[0].position;
    const axis = mm(FOLIA_AXIS);
    part.mat.onBeforeCompile = (shader) => {
      shader.uniforms.uFolia = { value: new THREE.Vector2(axis.y - c.y, axis.z - c.z) };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vFolia;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFolia = position;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vFolia;\nuniform vec2 uFolia;')
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          float foliaP = atan(vFolia.z - uFolia.y, vFolia.y - uFolia.x) * 44.0;
          float foliaK = 1.0 - smoothstep(1.3, 3.0, fwidth(foliaP)); // sfuma dove le lamelle sono più fitte dei pixel
          float foliaH = sin(foliaP);
          diffuseColor.rgb *= 1.0 - 0.24 * foliaK * (1.0 - smoothstep(-1.0, -0.3, foliaH));`
        )
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
          {
            vec3 fdx = dFdx(-vViewPosition), fdy = dFdy(-vViewPosition);
            vec3 r1 = cross(fdy, normal), r2 = cross(normal, fdx);
            float det = dot(fdx, r1);
            vec3 grad = sign(det) * (dFdx(foliaH) * r1 + dFdy(foliaH) * r2);
            normal = normalize(abs(det) * normal - 0.0008 * foliaK * grad);
          }`
        );
    };
  }

  #fissure() {
    const lifted = PRIMARY.map(([r, b, h]) => [r, b, h + 0.5]);
    const part = this.#pair('primary', 'fessura primaria', 0x2a2520, [tube(lifted, 0.6, { seg: 60, radial: 10 })], { roughness: 0.7 });
    Object.assign(part.mat, { polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -400 });
  }

  #white() {
    // corpo midollare: lamina a doppia ala nel vuoto fra i lobuli, più sottile
    // e più alta sulla linea mediana (sopra il nodulo, dietro il fastigium)
    const g = new THREE.SphereGeometry(1, 56, 28);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const X = p.getX(i) * 27;
      const w = 1 - Math.exp(-((X / 9) ** 2));
      const v = mm([X, 41 - 2 * w - p.getZ(i) * (7 + 5.5 * w), 1588.3 - 4.8 * w + p.getY(i) * (2.4 + 2.4 * w)]);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    this.addPart('medullary', 'corpo midollare', WHITE, [g], { ghost: true, opacity: 0.55 });

    // peduncolo medio: dal margine laterale del ponte reale al corpo midollare,
    // lateralmente agli altri due
    this.#pair('mcp', 'peduncolo cerebellare medio', 0xf0deb4, [
      tube([[15.5, 13, 1588.5], [18.5, 20, 1587], [19.2, 26, 1585.5], [19.6, 32, 1583.6], [20, 37, 1582.6]], [4.6, 5, 4.6, 4, 3.2], { flat: { x: 0.7 }, radial: 18 }),
    ]);
    // peduncolo inferiore (corpo restiforme): dalla faccia postero-laterale del
    // bulbo, accanto al IV ventricolo, al corpo midollare, sotto il superiore
    this.#pair('icp', 'peduncolo cerebellare inferiore (corpo restiforme)', 0xe6edf0, [
      tube([[8, 24.5, 1563], [9.3, 23.5, 1569], [10.8, 22.3, 1575], [12.5, 24, 1579.5], [14, 29, 1581.5], [15, 34.5, 1581.5]], [1.6, 2.1, 2.3, 2.4, 2.4, 2.2]),
    ]);
  }

  #nuclei() {
    // --- nuclei profondi, in senso medio-laterale
    this.#pair('fastigial', 'nucleo del fastigio (del tetto)', 0x3f7fc4, [blob([3.6, 40, 1588.9], [1.9, 3, 1.9])]);
    this.#pair('interposed', 'nucleo interposito (emboliforme e globoso)', 0x2fa58a, [
      blob([9.4, 41.6, 1584.3], [1.5, 3.6, 2.2], [0, -0.3, 0]), // emboliforme, a cuneo sull'ilo del dentato
      blob([6.3, 41, 1586.6], [1, 1.75, 1.3]), // globoso
    ]);
    this.#pair('dentate', 'nucleo dentato (oliva cerebellare)', 0xd9a21b, [this.#dentate()]);

    // --- bersagli e sorgenti nel tronco e nel talamo
    // nuclei vestibolari: sotto la parte laterale del pavimento del IV ventricolo
    this.#pair('vestibular', 'nuclei vestibolari', 0x4aa3c7, [
      blob([7.6, 20.4, 1584.3], [1.4, 1.4, 2.2]), // superiore
      blob([8.7, 19.3, 1579.7], [1.5, 1.5, 1.9]), // laterale
      tube([[3.6, 24.6, 1570.5], [4.6, 22.9, 1574], [4.9, 20.9, 1577], [4.7, 20, 1580], [4.3, 18.8, 1582.3]], [1, 1.4, 1.5, 1.3, 0.9]), // mediale
      tube([[7.4, 24.6, 1569], [8, 23.6, 1572], [8.4, 22.2, 1575], [8.3, 20.9, 1577.3]], [0.9, 1.2, 1.3, 1.1]), // inferiore
    ]);
    this.#pair('reticular', 'formazione reticolare (centro inibitore di Magoun)', 0x8e2f3f, [blob([2.4, 9.9, 1577.6], [1.5, 1.2, 3])]);
    // nuclei basilari del ponte: isole di sostanza grigia sparse nella base del
    // ponte (prima il lato sinistro: è quello da cui parte la fibra muscoide)
    const islands = [
      [[4, -2, 1590], 2.2], [[8, 0, 1585], 2], [[10, 3, 1594], 2.1], [[5, 4, 1582], 1.8], [[12, 5, 1588], 2],
      [[3, 2, 1597], 1.7], [[7, -4, 1592], 1.8], [[14, 2, 1590], 1.7], [[6, 6, 1590], 2], [[6, 2, 1588], 2.3],
    ].map(([c, r]) => blob(c, [r * 1.25, r * 0.8, r], null, 14));
    this.addPart('pontine', 'nuclei basilari del ponte', 0xd97b2b, [...islands.map((g) => mirror(g)), ...islands]);
    // nucleo ventrale laterale, nella parte laterale e anteriore del talamo reale
    const vl = blob([14, 2.5, 1624], [2.8, 4.5, 2.5]);
    this.addPart('vl', 'nucleo ventrale laterale del talamo', 0xc9744a, [mirror(vl), vl]);
  }

  // Nucleo dentato: sacco a parete pieghettata, aperto verso l'ilo (mediale e
  // anteriore), da cui esce il peduncolo cerebellare superiore.
  #dentate() {
    const g = new THREE.SphereGeometry(1, 56, 36);
    const p = g.attributes.position;
    const hil = new THREE.Vector3(-0.7, 0.1, 0.7).normalize();
    const e1 = new THREE.Vector3(0, 1, 0).cross(hil).normalize();
    const e2 = hil.clone().cross(e1);
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const c = v.dot(hil);
      const lon = Math.atan2(v.dot(e2), v.dot(e1));
      let k = 1 + 0.085 * Math.sin(lon * 12) * Math.sqrt(Math.max(0, 1 - c * c)) + 0.035 * Math.sin(lon * 5 + c * 9);
      k *= 1 - 0.6 * smooth(0.35, 0.97, c);
      p.setXYZ(i, v.x * k, v.y * k, v.z * k);
    }
    g.scale(6 * S, 3.1 * S, 8 * S);
    g.rotateY(-0.35);
    const c = mm([17.5, 41.5, 1581.9]);
    g.translate(c.x, c.y, c.z);
    g.computeVertexNormals();
    return g;
  }

  // Blocco di corteccia con i tre strati e il circuito.
  #cortexBlock() {
    const T = 0.008; // spessore delle pareti
    const wall = (y0, y1) => [box(BLK.x0, BLK.x1, y0, y1, BLK.z0 - T, BLK.z0), box(BLK.x1, BLK.x1 + T, y0, y1, BLK.z0 - T, BLK.z1)];
    this.addPart('layerMol', 'strato molecolare', 0xf2dccb, wall(LY.mol, LY.top));
    this.addPart('layerPurk', 'strato delle cellule di Purkinje', 0xdc9aa8, wall(LY.purk, LY.mol));
    this.addPart('layerGran', 'strato dei granuli', 0xb9a8da, wall(LY.gran, LY.purk));
    this.addPart('layerWhite', 'sostanza bianca (asse della lamella)', WHITE, [...wall(LY.floor, LY.gran), box(BLK.x0, BLK.x1, LY.floor - T, LY.floor, BLK.z0, BLK.z1)]);

    // --- cellule di Purkinje: soma a fiasco, albero dendritico in un solo piano
    // (y-z, perpendicolare all'asse della lamella), assone verso il nucleo
    const trees = PURK.map(([x, z0]) => {
      const geos = [], segs = [];
      const grow = (p, ang, len, r, depth) => {
        const q = V(x, Math.min(LY.top - 0.012, p.y + Math.cos(ang) * len), p.z + Math.sin(ang) * len);
        geos.push(taperTube([p, p.clone().lerp(q, 0.5), q], [r, r * 0.72], { seg: 4, radial: 6, caps: false }));
        segs.push({ p, q, depth });
        if (depth > 0) for (const d of [-1, 1]) grow(q, ang * 0.6 + d * (0.42 + 0.05 * depth), len * 0.8, r * 0.72, depth - 1);
      };
      grow(V(x, LY.purk + 0.03, z0), 0, 0.04, 0.0062, 4);
      return { geos, segs };
    });
    this.addPart('purk', 'cellula di Purkinje', 0xb5305e, PURK.map(([x, z0], i) =>
      merge([
        ball([x, LY.purk + 0.016, z0], [0.013, 0.019, 0.013]),
        ...trees[i].geos,
        wire([[x, LY.purk, z0], [x, 0.17, z0 + 0.004], [x, 0.108, z0], [x - 0.03, 0.094, z0], [-0.22, 0.094, z0 * 0.6], [-0.285, 0.1, z0 * 0.25]], 0.003, { seg: 40 }),
      ])
    )); // la prima è quella su cui si arrampica la fibra rampicante

    // --- granuli e fibre parallele
    const grains = [];
    for (let i = 0; i < 20; i++)
      grains.push(ball([BLK.x0 + 0.03 + ((i * 0.618) % 1) * 0.35, LY.gran + 0.014 + ((i * 0.732) % 1) * 0.09, -0.09 + ((i * 0.414) % 1) * 0.18], 0.0072));
    for (const [x, y, z] of PARALLEL) grains.push(ball([x, y, z], 0.0085));
    // dendriti ad artiglio del granulo sul glomerulo
    for (const d of [-0.006, 0.006]) grains.push(wire([[0, 0.172, -0.02], [-0.014, 0.166 + d, -0.024], [ROSETTE[0] + 0.008, ROSETTE[1] + d, ROSETTE[2]]], 0.0016, { seg: 8 }));
    this.addPart('granule', 'granuli', 0x5d4fa8, [merge(grains)]);
    this.addPart('parallel', 'fibre parallele (assoni dei granuli, divisi a T)', 0x3d9a62, [
      merge(PARALLEL.flatMap(([x, y, z, top]) => [
        wire([[x, y, z], [x, (y + top) / 2, z], [x, top, z]], 0.0024, { seg: 10 }),
        wire([[BLK.x0 + 0.012, top, z], [x, top, z], [BLK.x1 - 0.012, top, z]], 0.0024, { seg: 20 }),
      ])),
    ]);

    // --- fibra muscoide: dalla sostanza bianca alla rosetta del glomerulo
    this.addPart('mossyEnd', 'fibra muscoide (rosetta nel glomerulo)', 0x8fbf3f, [
      merge([
        wire(MICRO_LINKS['k-mossy'][0], 0.0034, { seg: 40 }),
        ball(ROSETTE, 0.0115),
        ...[[0.009, 0.004, 0.004], [-0.007, 0.006, -0.005], [0, -0.008, 0.006], [-0.003, 0.004, 0.009]].map(([a, b, c]) => ball([ROSETTE[0] + a, ROSETTE[1] + b, ROSETTE[2] + c], 0.006)),
      ]),
    ]);
    // --- cellula di Golgi: soma nello strato dei granuli, dendriti fino allo
    // strato molecolare, assone nel glomerulo
    this.addPart('golgi', 'cellula di Golgi', 0x2f6fe0, [
      merge([
        ball([0.035, 0.212, 0.03], 0.015),
        wire([[0.035, 0.222, 0.03], [0.026, 0.28, 0.042], [0.018, 0.335, 0.052]], [0.0034, 0.0018]),
        wire([[0.038, 0.222, 0.028], [0.05, 0.29, 0.01], [0.056, 0.35, 0.002]], [0.0034, 0.0018]),
        wire([[0.04, 0.218, 0.034], [0.07, 0.27, 0.06], [0.085, 0.31, 0.075]], [0.003, 0.0016]),
        wire([[0.03, 0.202, 0.024], [0, 0.172, 0], [-0.02, 0.157, -0.022]], 0.0024),
      ]),
    ]);
    // --- fibra rampicante: sale e si avvolge sull'albero dendritico di una Purkinje
    const dx = -0.007;
    this.addPart('climbEnd', 'fibra rampicante', CLIMB, [
      merge([
        wire([[-0.4, 0.084, 0.045], [-0.2, 0.084, 0.045], [-0.085, 0.086, 0.045], [PURK[0][0] + dx, 0.11, 0.045], [PURK[0][0] + dx, 0.2, 0.049], [PURK[0][0] + dx, LY.purk + 0.03, PURK[0][1]]], 0.0032, { seg: 50 }),
        ...trees[0].segs.filter((s) => s.depth >= 2).map((s) => taperTube([s.p.clone().setX(s.p.x + dx), s.q.clone().setX(s.q.x + dx)], 0.0028, { seg: 3, radial: 6 })),
        wire([[-0.37, 0.084, 0.045], [-0.34, 0.09, 0.032], [-0.318, 0.097, 0.018]], 0.0026, { seg: 8 }),
      ]),
    ]);
    // --- cellula a canestro: nel terzo profondo dello strato molecolare, assone
    // perpendicolare alla lamella che avvolge il soma di una Purkinje
    const [bx, bz] = PURK[1];
    const loops = [];
    for (let i = 0; i <= 28; i++) {
      const a = (i / 28) * Math.PI * 4.5;
      loops.push([bx + Math.sin(a) * 0.0165, LY.purk + 0.036 - (i / 28) * 0.036, bz + 0.016 * Math.cos(a)]);
    }
    this.addPart('basket', 'cellula a canestro', 0x8a5a3c, [
      merge([
        ball([bx, 0.3, 0.055], 0.011),
        wire([[bx, 0.308, 0.055], [bx, 0.34, 0.07], [bx, 0.37, 0.078]], [0.003, 0.0016]),
        wire([[bx, 0.308, 0.052], [bx, 0.345, 0.04], [bx, 0.385, 0.036]], [0.003, 0.0016]),
        wire([[bx, 0.294, 0.047], [bx, 0.287, 0], [bx, 0.282, bz + 0.03], loops[0]], 0.0024),
        wire(loops, 0.0022, { seg: 60 }),
      ]),
    ]);
    // --- cellula stellata: nei due terzi superficiali, assone sui dendriti
    const [sx] = PURK[2];
    this.addPart('stellate', 'cellula stellata', 0x2aa0ad, [
      merge([
        ball([sx, 0.415, -0.05], 0.0085),
        ...[[0, 0.02, -0.014], [0, -0.02, -0.016], [0, 0.022, 0.012], [0, -0.004, -0.026]].map(([a, b, c]) => wire([[sx, 0.415, -0.05], [sx + a / 2, 0.415 + b / 2, -0.05 + c / 2], [sx + a, 0.415 + b, -0.05 + c]], [0.0026, 0.0014], { seg: 6 })),
        wire([[sx, 0.412, -0.044], [sx, 0.405, -0.01], [sx, 0.392, 0.018]], 0.0022),
      ]),
    ]);
    this.addPart('microNuc', 'nucleo cerebellare profondo', 0xd9a21b, [ball([-0.315, 0.1, 0], [0.042, 0.036, 0.05])]);

    // --- da dove viene il blocco: un punto della corteccia del cervelletto
    // rimpicciolito, unito al blocco da due fili
    const at = mm([30, 52, 1596.4]).multiplyScalar(MINI.scale);
    at.set(-at.x, at.y, -at.z).add(V(...MINI.pos)); // il modello rimpicciolito è girato di mezzo giro
    const ring = new THREE.TorusGeometry(0.012, 0.0025, 8, 28).rotateX(Math.PI / 2).translate(at.x, at.y, at.z);
    this.addPart('sample', 'una lamella, ingrandita', 0x2a2520, [
      ring,
      taperTube([at.clone().add(V(-0.012, 0, 0)), V(BLK.x0, LY.top, BLK.z0)], 0.0013, { seg: 2, radial: 5, caps: false }),
      taperTube([at.clone().add(V(0.012, 0, 0)), V(BLK.x1, LY.top, BLK.z0)], 0.0013, { seg: 2, radial: 5, caps: false }),
    ]);

    for (const [id, [pts, opts]] of Object.entries(MICRO_LINKS)) this.addLink(id, P(pts), opts);
  }

  setLayout(n) {
    this.layout = n;
  }

  // Etichette agganciate ai punti di ANCHOR invece che sopra l'ingombro della parte.
  setLabels(map) {
    super.setLabels(map);
    for (const [id, t] of this.labels) if (ANCHOR[id]) t.userData.anchor.copy(ANCHOR[id]);
  }

  reset() {
    super.reset();
    this.layout = 0;
  }

  update(dt, camera, realDt = dt) {
    if (this.macro) {
      const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 6);
      const t = (this.layoutNow += (this.layout - this.layoutNow) * k);
      this.macro.scale.setScalar(1 + (MINI.scale - 1) * t);
      this.macro.position.set(MINI.pos[0] * t, MINI.pos[1] * t, MINI.pos[2] * t);
      this.macro.rotation.y = Math.PI * t;
      this.rods[0].visible = this.layout === 0;
      this.rods[1].visible = this.layout === 1;
    }
    super.update(dt, camera, realDt);
  }
}
