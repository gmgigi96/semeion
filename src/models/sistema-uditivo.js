// Sistema uditivo: la chiocciola destra reale con le scale ricostruite al suo
// interno, due sezioni ingrandite (un giro del canale cocleare, l'organo del
// Corti) e la via acustica centrale dentro tronco, talamo e lobi temporali reali.
// Le coordinate sono quelle di Z-Anatomy portate nella terna dei modelli da
// tools/mesh.mjs (meshes/sistema-uditivo.json: origine [0, 8, 1575] mm, 1 mm =
// 0,01 unità). I punti ricostruiti a mano sono scritti in millimetri della
// sorgente e convertiti con P(destra, dietro, alto).
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0): «Cochlea» destra e sinistra,
// «Vestibule.r» (vestibolo e canali semicircolari, di contesto), «Stapes.r»,
// «Cochlear nerve» dei due lati, «Vestibulocochlear nerve (VIII)» dei due lati
// (tagliato dove entra nel tronco, a 12,8 mm dalla linea mediana), bulbo (tagliato a quota 1561), ponte,
// mesencefalo, collicoli superiori e inferiori, corpi genicolati mediali, talamo,
// nucleo lenticolare, giri temporali trasversi (di Heschl), giro temporale
// superiore con il piano temporale, resto degli emisferi come involucro.
//
// MISURATO SULLE MESH (script Python sui vertici degli OBJ, test di appartenenza
// a raggi): asse della chiocciola e linea d'asse del giro basale (le stesse di
// src/models/orecchio-interno.js); la mesh della chiocciola è un tubo vero solo
// nel giro basale, sopra è una cupola piena di raggio 1,9-1,0 mm spostata di
// circa 1 mm rispetto all'asse del giro basale: la linea d'asse dei giri medio
// e apicale è stata tracciata dentro la cupola (50 punti su 975°, cioè 2,7 giri;
// 49 su 50 dentro la mesh, il primo è nel vestibolo). Ingresso del nervo VIII
// nel tronco (13 mm a destra, 14,6 dietro, quota 1578); pavimento del quarto
// ventricolo e recesso laterale; collicolo inferiore, corpo genicolato mediale
// e giro di Heschl (estremo mediale a 36-40 mm dalla linea mediana, quota
// 1630-1640). Tutti i nuclei e i fasci ricostruiti sono stati controllati con
// il test di appartenenza a ponte, bulbo, mesencefalo.
// Da sapere sulla sorgente: i nuclei cocleari di Z-Anatomy («Anterior/Posterior
// cochlear nucleus») sono sferette di 2 mm; quello «anteriore» sta nel tegmento
// ventrale, a 7 mm dalla linea mediana, dove nel vero c'è il complesso olivare
// superiore: non sono usati. Del «posteriore» è tenuta solo la posizione.
//
// RICOSTRUITO A MANO dentro le mesh reali:
//  - nella chiocciola: scala vestibolare e scala timpanica (due tubi sovrapposti
//    lungo la linea d'asse, la vestibolare dal lato dell'apice), dotto cocleare
//    (sul lato esterno, diviso in giro basale, intermedio e apicale), elicotrema,
//    modiolo, ganglio spirale nel canale di Rosenthal, finestra rotonda;
//  - nel tronco: nuclei cocleari ventrale e dorsale, complesso olivare
//    superiore, nucleo del corpo trapezoide, corpo trapezoide, strie acustiche
//    dorsali, lemnisco laterale con i suoi nuclei, braccio del collicolo
//    inferiore, radiazione acustica;
//  - due sezioni schematiche ingrandite: un giro del canale cocleare e l'organo
//    del Corti.
//  - tonotopia (setTone): perle rosse lungo il dotto cocleare che si gonfiano e
//    vibrano attorno al punto di massima risonanza. È un indicatore, non una
//    struttura: posizione lineare lungo il dotto (giro basale toni alti, apice
//    bassi, come gli appunti e la voce "Cochlea"), ampiezza e larghezza del picco
//    STIMATE e solo didattiche.
//
// FONTI LETTE (voci di Wikipedia in inglese, lette via API; le anatomiche derivano
// in parte dal Gray 1918 di pubblico dominio), https://en.wikipedia.org/wiki/… :
//  - "Cochlea": 2,75 giri attorno al modiolo, canale lungo circa 30 mm; scala
//    vestibolare alla finestra ovale con la platina della staffa, scala timpanica
//    alla finestra rotonda; elicotrema all'apice; membrana basilare più rigida
//    alla base (toni alti) che all'apice (toni bassi). VERIFICATO.
//  - "Cochlear duct", "Basilar membrane", "Organ of Corti", "Tectorial membrane",
//    "Stria vascularis", "Hair cell", "Spiral ganglion", "Modiolus (cochlea)":
//    rapporti tra membrana di Reissner, lembo, membrana tectoria, membrana
//    basilare, stria vascolare e legamento spirale; una fila di capellute interne
//    e tre di esterne; ganglio spirale nel modiolo; membrana basilare larga
//    0,08-0,16 mm alla base e 0,42-0,65 mm all'apice (gli appunti: 100 e 400-500
//    micron); la tectoria agisce sulle capellute interne per accoppiamento
//    fluido, sulle esterne per contatto diretto. VERIFICATO (rapporti; nessuna
//    misura usata per le proporzioni degli schemi).
//  - "Cochlear nucleus": sul lato dorso-laterale del tronco alla giunzione
//    bulbo-pontina; il ventrale ventro-laterale al peduncolo cerebellare
//    inferiore, alla radice del nervo; il dorsale (tubercolo acustico) si incurva
//    sopra il ventrale e attorno al peduncolo. VERIFICATO.
//  - "Trapezoid body": fibre trasversali nel tegmento pontino ventrale caudale,
//    subito dorsali ai nuclei pontini e ventrali ai lemnischi mediali. VERIFICATO.
//  - "Superior olivary complex": nel ponte (nell'uomo dal bulbo rostrale a metà
//    ponte), per lo più dorsale al corpo trapezoide; nucleo mediale del corpo
//    trapezoide mediale; origine del fascio olivo-cocleare. VERIFICATO.
//  - "Lateral lemniscus": dal complesso olivare superiore al collicolo inferiore,
//    con i nuclei ventrale, intermedio e dorsale intercalati (qui due). VERIFICATO.
//  - "Inferior colliculus", "Medial geniculate nucleus", "Acoustic radiation"
//    (dal genicolato mediale ai giri di Heschl attraverso il segmento
//    sottolenticolare della capsula interna), "Transverse temporal gyrus" (aree
//    41 e 42, decorso medio-laterale), "Olivocochlear system", "Auditory system".
// STIMATO, senza una misura nelle fonti lette: coordinate, forma e calibro di
// tutti i nuclei e fasci ricostruiti (posti secondo i rapporti descritti sopra
// e i reperi delle mesh; i nuclei sono un poco ingranditi per essere leggibili);
// calibro delle scale e del dotto, posizione della finestra rotonda, estensione
// del ganglio spirale (qui i primi due giri); decorso preciso delle strie
// dorsali sotto il pavimento del quarto ventricolo; le frecce delle vie uniscono
// origine e bersaglio lungo i fasci ricostruiti. Le due sezioni ingrandite sono
// schemi: poche cellule (tre per fila), proporzioni indicative, movimenti delle
// capellute esterne esagerati.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.01;
const O = [0, 8, 1575];
// punto in mm: a destra della linea mediana, verso dietro, quota
const P = (r, b, u) => V(r * S, (u - O[2]) * S, -(b - O[1]) * S);
const mm = (v) => (Array.isArray(v) ? v.map((x) => x * S) : v * S);
const flip = (p) => V(-p.x, p.y, p.z);

const BONE = 0xe9dfc8, WHITE = 0xf1e8d6, STEM = 0xe3cdb6, NERVE = 0xd9a02a;
const PERI_V = 0x7fa8e0, PERI_T = 0x9a86d8, ENDO = 0x2fb4c8;

// Linea d'asse del canale cocleare destro: [x, y, z della sorgente (mm), raggio
// del canale (mm), angolo percorso (gradi)]. Giro basale misurato, poi tracciato
// dentro la cupola della mesh.
const LINE = [[-41.37,2.80,1578.77,1.00,0],[-40.76,1.68,1577.90,1.00,20],[-40.03,0.65,1577.42,1.00,39],[-39.34,-0.24,1577.22,1.00,59],[-38.72,-1.09,1577.28,1.00,78],[-38.23,-1.91,1577.56,1.00,98],[-37.80,-2.65,1578.14,1.00,118],[-37.51,-3.28,1578.96,1.00,137],[-37.35,-3.57,1580.02,1.00,157],[-37.41,-3.47,1581.16,1.00,177],[-37.63,-2.94,1582.16,1.00,196],[-38.02,-2.16,1582.77,1.00,216],[-38.63,-1.33,1582.91,1.00,235],[-39.25,-0.73,1582.59,1.00,255],[-39.74,-0.14,1582.16,0.95,275],[-40.22,0.03,1581.74,0.84,295],[-40.58,-0.17,1581.24,0.70,315],[-40.79,-0.55,1580.81,0.57,335],[-40.84,-0.85,1580.42,0.50,355],[-40.77,-1.03,1579.99,0.50,375],[-40.65,-1.31,1579.65,0.49,395],[-40.49,-1.68,1579.44,0.48,415],[-40.31,-2.09,1579.38,0.48,435],[-40.14,-2.48,1579.47,0.47,455],[-40.01,-2.82,1579.70,0.47,475],[-39.94,-3.08,1580.03,0.46,495],[-39.93,-3.21,1580.43,0.46,515],[-39.99,-3.23,1580.83,0.45,535],[-40.12,-3.12,1581.20,0.45,555],[-40.30,-2.92,1581.48,0.44,575],[-40.52,-2.65,1581.65,0.43,595],[-40.74,-2.35,1581.70,0.43,615],[-40.96,-2.06,1581.61,0.42,635],[-41.14,-1.82,1581.41,0.42,655],[-41.28,-1.65,1581.13,0.41,675],[-41.36,-1.58,1580.80,0.41,695],[-41.38,-1.62,1580.46,0.40,715],[-41.33,-1.75,1580.16,0.40,735],[-41.23,-1.96,1579.94,0.39,755],[-41.11,-2.21,1579.81,0.39,775],[-40.99,-2.48,1579.79,0.38,795],[-40.88,-2.73,1579.87,0.38,815],[-40.80,-2.93,1580.03,0.37,835],[-40.76,-3.07,1580.25,0.36,855],[-40.76,-3.14,1580.49,0.36,875],[-40.81,-3.13,1580.72,0.35,895],[-40.89,-3.05,1580.92,0.35,915],[-40.99,-2.93,1581.06,0.34,935],[-41.11,-2.78,1581.13,0.34,955],[-41.23,-2.62,1581.13,0.33,975]];
// giro del dotto cocleare che contiene il punto u della linea d'asse (0 inizio del
// giro basale, 1 apice): gli stessi confini (punti 18 e 36) delle parti ductBase/Mid/Apex
export const ductTurnAt = (u) => {
  const i = u * (LINE.length - 1);
  return i < 18 ? 'ductBase' : i < 36 ? 'ductMid' : 'ductApex';
};
// asse della chiocciola (verso l'apice), centro del giro basale e della cupola
const AX = V(0.869, -0.035, 0.493).normalize();
const MOD = P(39.68, -0.94, 1579.85);
const DOME = P(39.36, -1.56, 1580.68);
const COCHLEA = P(39.9, -1.2, 1580.2);

// Pose del modello: il punto `at` va nel punto `to` della pagina, ingrandito
// `k`; `rot` = [inclinazione verso chi legge, rotazione attorno alla
// verticale]; `up`: porta l'asse della chiocciola in verticale (apice in alto).
// `to` è dentro il ribaltamento del motore: x positivo = sinistra di chi guarda.
// Restano del modello perché il primo piano del motore non ruota il modello
// attorno a un asse qualsiasi (`cochlea`) e inquadra un solo punto al centro
// della pagina (`section` e `corti` mettono la chiocciola in un angolo, accanto
// allo schema ingrandito). `head` è il modello intero.
export const FOCUS = {
  cochlea: { at: COCHLEA, to: [0, 0.36, 0], k: 6.2, rot: [0.05, 0.5], up: true, rod: 0.12 },
  section: { at: COCHLEA, to: [0.4, 0.6, 0], k: 1.6, rot: [0.05, 0.5], up: true, rod: 0.03 },
  corti: { at: COCHLEA, to: [0.36, 0.62, 0], k: 1.7, rot: [0.05, 0.5], up: true, rod: 0.03 },
  head: { at: P(0, 14, 1618), to: [0, 0.34, 0], k: 0.44, rot: [0, 0], rod: 0.06 },
};
// Primo piano del motore sul tronco encefalico, a partire dalla posa `head`
// (vedi AnatomyModel.zoomTo).
export const STEM_VIEW = { at: P(0, 10, 1603).toArray(), scale: 1.3, height: 0.27 };

function merge(geos) {
  const pos = [];
  const idx = [];
  for (const g of geos) {
    const base = pos.length / 3;
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) pos.push(p.getX(i), p.getY(i), p.getZ(i));
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i));
    else for (let i = 0; i < p.count; i++) idx.push(base + i);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setIndex(idx);
  out.computeVertexNormals();
  return out;
}

function stick(a, b, r, radial = 8) {
  const d = b.clone().sub(a);
  const g = new THREE.CylinderGeometry(r, r, d.length(), radial);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize()));
  const m = a.clone().lerp(b, 0.5);
  g.translate(m.x, m.y, m.z);
  return g;
}

// prisma: poligono nel piano xy estruso tra z0 e z1; `holes`: altri poligoni
function prism(poly, z0, z1, holes = []) {
  const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: z1 - z0, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, z0);
  return g;
}

function lathe(profile, x, y, z = 0) {
  const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), 20);
  g.translate(x, y, z);
  g.computeVertexNormals();
  return g;
}

const ball = (x, y, z, r) => ellipsoid([x, y, z], [r, r, r], null, 10);

// raggi campionati lungo la lunghezza d'arco di una spezzata
function radiiAlong(pts, rs, n = 48) {
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const out = [];
  let j = 1;
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * len.at(-1);
    while (j < pts.length - 1 && len[j] < s) j++;
    const t = (s - len[j - 1]) / Math.max(1e-9, len[j] - len[j - 1]);
    out.push(rs[j - 1] + (rs[j] - rs[j - 1]) * t);
  }
  return out;
}

const REST = { ohc: 0, osc: 0 };

export class AuditoryModel extends AnatomyModel {
  constructor() {
    super({ tilt: -0.45 });
    this.addStand({ radius: 0.22, z: 0 });
    // l'asta non segue l'ingrandimento: sta fuori da `inner`
    this.rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 1, 12),
      new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 })
    );
    this.rod.castShadow = true;
    this.mirror.add(this.rod);
    this.standRod = this.rod; // il motore la nasconde nei primi piani
    // le sezioni ingrandite stanno fuori dall'inquadratura e dal ribaltamento:
    // x verso la destra di chi guarda, y in alto, z verso chi guarda
    this.side = new THREE.Group();
    this.side.scale.x = -1;
    this.mirror.add(this.side);
    this.secGroup = new THREE.Group();
    this.secGroup.position.set(0.07, 0.27, 0);
    this.secGroup.scale.setScalar(0.88);
    this.cortiGroup = new THREE.Group();
    this.cortiGroup.position.set(0.025, 0.16, 0);
    this.cortiGroup.scale.setScalar(0.9);
    // le sezioni sono reclinate all'indietro, perché chi legge le guarda dall'alto
    this.cortiGroup.rotation.x = -0.5;
    this.secGroup.rotation.x = -0.25;
    this.side.add(this.secGroup, this.cortiGroup);
    this.sideIds = new Set();
    this.rig = [];
    this.focusName = 'cochlea';
    this.focusNow = { pos: V(0, 0, 0), k: 1, q: new THREE.Quaternion(), rod: 0.1 };
    this.focusTarget = { at: V(0, 0, 0), to: V(0, 0, 0), k: 1, q: new THREE.Quaternion(), rod: 0.1 };
    this.state = { ...REST };
    this.stateTarget = { ...REST };
    this.clock = 0;
    this.ready = this.#build();
  }

  async #build() {
    const ghost = (opacity) => ({ ghost: true, opacity });
    await this.loadMeshes('sistema-uditivo.glb', {
      cochleaR: ['chiocciola destra (labirinto osseo)', BONE],
      cochleaL: ['chiocciola sinistra', BONE],
      labyrinth: ['vestibolo', BONE, ghost(0.3)],
      stapes: ['staffa, nella finestra ovale', 0xc79a4e],
      nerveR: ['nervo cocleare destro', NERVE],
      nerveTip: ['nervo cocleare, all\'uscita dal modiolo', NERVE],
      nerveL: ['nervo cocleare sinistro', NERVE],
      viiiR: ['nervo vestibolo-cocleare (VIII) destro', NERVE],
      viiiL: ['nervo vestibolo-cocleare (VIII) sinistro', NERVE],
      medulla: ['bulbo', STEM, ghost(0.5)],
      pons: ['ponte', STEM, ghost(0.5)],
      midbrain: ['mesencefalo', STEM, ghost(0.5)],
      collSup: ['collicoli superiori', 0xd8c3ae, ghost(0.4)],
      icR: ['collicolo inferiore destro', 0xc9485b],
      icL: ['collicolo inferiore sinistro', 0xc9485b],
      mgbR: ['corpo genicolato mediale destro', 0xd97b2b],
      mgbL: ['corpo genicolato mediale sinistro', 0xd97b2b],
      thalamus: ['talamo', 0xd9c7b0, ghost(0.4)],
      lentiform: ['nucleo lenticolare', 0xc9b79c, ghost(0.3)],
      heschlR: ['giri temporali trasversi di Heschl destri (aree 41 e 42)', 0xd4374a],
      heschlL: ['giri temporali trasversi di Heschl sinistri (aree 41 e 42)', 0xd4374a],
      stgR: ['giro temporale superiore destro (area 22)', 0xe7b9a5, { opacity: 0.4 }],
      stgL: ['giro temporale superiore sinistro (area 22)', 0xe7b9a5, { opacity: 0.4 }],
      hemi: ['emisferi cerebrali', 0xe7c9b9, ghost(0.1)],
    });
    this.#cochlea();
    this.#pathway();
    this.#section();
    this.#corti();
    this.setFocus('cochlea', true);
  }

  // ---- dentro la chiocciola reale: scale, dotto, modiolo, ganglio spirale
  #cochlea() {
    const c = LINE.map(([x, y, z]) => P(-x, y, z));
    const r = LINE.map((l) => l[3] * S);
    const phi = LINE.map((l) => l[4]);
    const rad = c.map((p, i) => {
      const u = phi[i] <= 255 ? 0 : phi[i] >= 360 ? 1 : (phi[i] - 255) / 105;
      const d = p.clone().sub(MOD.clone().lerp(DOME, u));
      return d.addScaledVector(AX, -d.dot(AX)).normalize();
    });
    const shifted = (i0, i1, up, out) => {
      const pts = [];
      for (let i = i0; i <= i1; i++) pts.push(c[i].clone().addScaledVector(AX, up * r[i]).addScaledVector(rad[i], out * r[i]));
      return pts;
    };
    const tubeOf = (pts, i0, k, seg = 200) => taperTube(pts, radiiAlong(pts, r.slice(i0, i0 + pts.length).map((v) => v * k)), { seg, radial: 12 });
    const n = c.length - 1;
    const sv = shifted(0, n, 0.5, -0.12);
    const st = shifted(1, n, -0.5, -0.12);
    this.addPart('scalaV', 'scala vestibolare (perilinfa)', PERI_V, [tubeOf(sv, 0, 0.47, 260)]);
    this.addPart('scalaT', 'scala timpanica (perilinfa)', PERI_T, [tubeOf(st, 1, 0.47, 260)]);
    // dotto cocleare, sul lato esterno, diviso nei tre giri
    const turns = [['ductBase', 'dotto cocleare: giro basale', 0x2fb4c8, 0, 18], ['ductMid', 'dotto cocleare: giro intermedio', 0x3fbf8a, 18, 36], ['ductApex', 'dotto cocleare: giro apicale (tre quarti di giro)', 0xa9c93f, 36, n]];
    for (const [id, name, color, i0, i1] of turns) {
      const pts = shifted(i0, i1, 0, 0.66);
      this.addPart(id, name, color, [tubeOf(pts, i0, 0.3, 110)]);
    }
    // tonotopia: perle lungo il dotto che si gonfiano e vibrano attorno al punto di
    // massima risonanza (vedi setTone); u va da 0 (inizio del giro basale) a 1 (apice)
    const curve = new THREE.CatmullRomCurve3(shifted(0, n, 0, 0.66));
    const mat = new THREE.MeshStandardMaterial({ color: 0xd43d3d, emissive: 0xd43d3d, emissiveIntensity: 0.45, roughness: 0.4 });
    mat.clippingPlanes = this.clipPlanes;
    const bead = new THREE.SphereGeometry(1, 14, 10);
    this.tone = { u: null, at: 0, on: 0, beads: [] };
    for (let i = 0; i < 120; i++) {
      const u = i / 119;
      const m = new THREE.Mesh(bead, mat);
      m.visible = false;
      this.inner.add(m);
      this.tone.beads.push({ m, u, p: curve.getPoint(u), r: r[Math.round(u * n)] * 0.3 });
    }
    // elicotrema: le due scale si continuano l'una nell'altra all'apice
    const tan = c[n].clone().sub(c[n - 1]).normalize();
    const loop = [sv[n], c[n].clone().addScaledVector(tan, r[n] * 0.75).addScaledVector(rad[n], -0.12 * r[n]), st[n - 1]];
    this.addPart('helico', 'elicotrema', 0xe07a1f, [taperTube(loop, r[n] * 0.5, { seg: 24, radial: 12 })]);
    // modiolo
    const ax = (o, h) => o.clone().addScaledVector(AX, h * S);
    this.addPart('modiolus', 'modiolo', 0xcdb98c, [
      taperTube([ax(MOD, -1.75), ax(MOD, -0.5), ax(DOME, 0.75), ax(DOME, 1.65), ax(DOME, 2.2)], mm([1.7, 1.9, 0.72, 0.36, 0.1]), { seg: 40, radial: 20 }),
    ]);
    // ganglio spirale, sul margine interno del canale (primi due giri)
    const gang = [];
    for (let i = 1; i <= 36; i++) gang.push(c[i].clone().addScaledVector(rad[i], -(r[i] + 0.2 * S)));
    this.addPart('ganglion', 'ganglio spirale del Corti (canale di Rosenthal)', 0xe8c22a, [taperTube(gang, mm(0.2), { seg: 200, radial: 8 })]);
    // finestra rotonda: all'inizio della scala timpanica
    const t0 = st[0].clone().sub(st[1]).normalize();
    const rw = ellipsoid([0, 0, 0], mm([0.55, 0.55, 0.13]), null, 16);
    rw.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), t0));
    const rwc = st[0].clone().addScaledVector(t0, 0.25 * S);
    rw.translate(rwc.x, rwc.y, rwc.z);
    this.addPart('roundWindow', 'finestra rotonda (membrana secondaria del timpano)', 0xd4496f, [rw]);

    // l'onda pressoria: staffa › scala vestibolare › elicotrema › scala timpanica › finestra rotonda
    const R = 0.0009;
    const thin = (pts, step) => pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
    this.addLink('w-stapes', [P(43.6, 4.4, 1580.8), P(42.3, 4.8, 1580.9), P(41.3, 5.1, 1580.9)], { color: 0xc77a1f, r: R });
    this.addLink('w-vest', [P(41.2, 5.1, 1580.9), P(41.1, 4.1, 1580.0), sv[0], sv[1]], { color: 0x2f6fe0, r: R });
    this.addLink('w-sv', thin(sv.slice(1), 2), { color: 0x2f6fe0, r: R });
    this.addLink('w-helico', loop, { color: 0xe07a1f, r: R });
    this.addLink('w-st', thin([...st].reverse(), 2), { color: 0x7a4fd0, r: R });
    this.addLink('w-rw', [st[0], rwc, rwc.clone().addScaledVector(t0, 1.1 * S)], { color: 0xd4496f, r: R });
  }

  // ---- via acustica centrale
  #pathway() {
    const blob = (r, b, u, [rx, rb, ru]) => {
      const c = P(r, b, u);
      return ellipsoid([c.x, c.y, c.z], [rx * S, ru * S, rb * S], null, 20);
    };
    const two = (id, name, color, geo, opts) => {
      const left = mirror(geo); // prima di addPart, che ricentra la geometria
      this.addPart(`${id}R`, `${name} destro`, color, [geo], opts);
      this.addPart(`${id}L`, `${name} sinistro`, color, [left], opts);
    };
    const twoF = (id, name, color, geo, opts) => {
      const left = mirror(geo);
      this.addPart(`${id}R`, `${name} destra`, color, [geo], opts);
      this.addPart(`${id}L`, `${name} sinistra`, color, [left], opts);
    };
    const path = (list) => list.map((p) => P(...p));

    two('vcn', 'nucleo cocleare ventrale', 0x2f9e5b, blob(12, 13.4, 1578.8, [1.5, 1.9, 2.7]));
    two('dcn', 'nucleo cocleare dorsale (tubercolo acustico)', 0x2f6fe0, blob(10.3, 16.9, 1576.8, [2.3, 1.0, 1.7]));
    two('soc', 'nucleo olivare superiore', 0xd4496f, blob(6.5, 11.6, 1582, [1.6, 1.3, 2.7]));
    two('ntb', 'nucleo del corpo trapezoide', 0xe0902e, blob(3.1, 10.4, 1581.5, [1.1, 0.9, 1.5]));
    // corpo trapezoide: strie acustiche ventrali, attraverso la linea mediana
    const TB = [[11.4, 12.7, 1579.2], [9, 11.5, 1580], [5, 10.2, 1581], [0, 9.8, 1581.5]];
    const tb = [...path(TB), ...path(TB).reverse().slice(1).map(flip)];
    this.addPart('trapezoid', 'corpo trapezoide (strie acustiche ventrali)', WHITE, [taperTube(tb, mm(1.0), { seg: 60, radial: 10, flat: { z: 0.55 } })]);
    // strie acustiche dorsali: dal nucleo dorsale, sotto il pavimento del quarto
    // ventricolo, al lemnisco laterale del lato opposto
    const DAS = [[9.4, 16.6, 1577.2], [7, 16.9, 1578.3], [4, 16.6, 1579.6], [0, 15.9, 1581], [-3.5, 15, 1582.3], [-6.5, 13.6, 1583.8], [-8.4, 12.2, 1585.8]];
    twoF('stria', 'stria acustica dorsale', WHITE, taperTube(path(DAS), mm(0.5), { seg: 60, radial: 8 }));
    const LL = [[7.5, 11.4, 1584.2], [9.3, 11.6, 1587], [10.5, 12, 1590], [11.5, 13.2, 1595], [10.8, 14.1, 1600], [9.7, 15.1, 1604], [8.5, 15.8, 1606.5]];
    two('ll', 'lemnisco laterale', WHITE, taperTube(path(LL), mm(0.95), { seg: 60, radial: 10 }));
    two('nll', 'nuclei del lemnisco laterale', 0x8e5bb5, merge([blob(10.5, 12, 1590.3, [1.35, 1.35, 1.9]), blob(11.4, 13.3, 1596, [1.35, 1.35, 1.8])]));
    const BIC = [[10.5, 15.5, 1609.3], [12.3, 15, 1610.8], [13.6, 14.3, 1611.8], [14.6, 13.4, 1612.6]];
    two('bic', 'braccio del collicolo inferiore', WHITE, taperTube(path(BIC), mm(0.95), { seg: 24, radial: 10 }));
    const RAD = [[15.5, 12.8, 1613.5], [21, 12, 1615], [28, 13, 1619], [34, 15.5, 1625.5], [39, 17, 1631], [44, 14, 1632.5]];
    twoF('rad', 'radiazione acustica (braccio sottolenticolare della capsula interna)', WHITE, taperTube(path(RAD), mm([0.9, 1.0, 1.2, 1.5, 1.9, 2.1]), { seg: 60, radial: 10, flat: { x: 0.7 } }));

    // vie: lo stimolo entra dalla chiocciola DESTRA
    const R = 0.007;
    const GREEN = 0x1f9d57;
    const link = (id, list, color = GREEN) => this.addLink(id, list, { color, r: R });
    const NV = [[38.5, 0, 1580], [34, 1.3, 1580.3], [27, 1.4, 1580.3], [22, 4, 1581.3], [20, 8.5, 1581.2], [18, 13.2, 1579.3], [14.5, 14.5, 1578.1], [12.3, 13.6, 1578.6]];
    link('p-nerve', path(NV));
    link('p-dcn', path([[12, 13.8, 1578.3], [11.4, 15.6, 1577.3], [10.5, 16.8, 1576.9]]));
    link('p-stria', path(DAS));
    link('p-tb-x', [...path(TB), ...path([[-3.1, 10.4, 1581.5], [-6.3, 11.4, 1582]])]);
    link('p-tb-i', path([[11.4, 12.7, 1579.2], [9, 11.7, 1580.3], [6.8, 11.5, 1581.6]]));
    const up = path([[6.6, 11.6, 1583], ...LL]);
    link('p-ll-R', up);
    link('p-ll-L', up.map(flip));
    link('p-bic-R', path(BIC));
    link('p-bic-L', path(BIC).map(flip));
    const rad = path([...RAD, [49, 9.5, 1631]]);
    link('p-rad-R', rad);
    link('p-rad-L', rad.map(flip));
    // fascio olivo-cocleare di Rasmussen: dal nucleo olivare superiore alla chiocciola
    link('p-ocb', path([[6.8, 11.9, 1581.4], [10, 13.6, 1579.2], ...[...NV].reverse().slice(1).map(([r, b, u]) => [r, b + 0.9, u + 0.9])]), 0x7a4fd0);
  }

  // parti delle sezioni ingrandite: stanno in `side`
  #sidePart(group, id, name, color, geos, opts) {
    const part = this.addPart(id, name, color, geos, opts);
    for (const m of part.meshes) group.add(m);
    this.sideIds.add(id);
    return part;
  }

  // ---- sezione di un giro del canale cocleare (modiolo a sinistra, apice in alto)
  #section() {
    const g = this.secGroup;
    const add = (id, name, color, geos, opts) => this.#sidePart(g, id, name, color, geos, opts);
    const E = (deg) => [0.03 + 0.235 * Math.cos((deg * Math.PI) / 180), 0.01 + 0.225 * Math.sin((deg * Math.PI) / 180)];
    const arc = (a, b, n = 24) => Array.from({ length: n + 1 }, (_, i) => E(a + ((b - a) * i) / n));
    const Z0 = -0.05, Z1 = 0.03;
    add('secBone', 'osso della chiocciola', BONE, [prism([[-0.4, -0.26], [0.31, -0.26], [0.31, 0.275], [-0.4, 0.275]], Z0, Z1, [arc(360, 0, 60)])]);
    add('secSV', 'scala vestibolare (perilinfa)', PERI_V, [prism([...arc(52, 176), [-0.17, 0.03], [-0.16, 0.04], [-0.125, 0.055], [0.181, 0.147]], Z0, Z0 + 0.03)]);
    add('secST', 'scala timpanica (perilinfa)', PERI_T, [prism([...arc(190, 320), [0.185, -0.11], [0.214, -0.04], [-0.03, -0.022], [-0.2, -0.035]], Z0, Z0 + 0.03)]);
    add('secDuct', 'dotto cocleare (endolinfa)', ENDO, [prism([[-0.125, 0.055], [0.181, 0.147], [0.208, 0.06], [0.213, -0.02], [-0.03, -0.006], [-0.045, 0.02], [-0.07, 0.03], [-0.06, 0.045], [-0.1, 0.055]], Z0, Z0 + 0.03)]);
    add('secLamina', 'lamina spirale ossea', 0xd9cba6, [prism([[-0.205, 0.026], [-0.03, 0.004], [-0.03, -0.022], [-0.203, -0.03]], Z0, Z1)]);
    add('secLig', 'legamento spirale', 0xc9a37a, [prism([...arc(52, -40), [0.185, -0.11], [0.214, -0.035], [0.213, 0.06], [0.181, 0.147]], Z0, Z1)]);
    add('secStria', 'stria vascolare', 0xc8324a, [prism([[0.176, 0.147], [0.203, 0.06], [0.207, -0.012], [0.222, -0.012], [0.22, 0.065], [0.193, 0.152]], Z0, Z1 + 0.008)]);
    add('secLimbus', 'lembo spirale', 0xe2a36a, [prism([[-0.17, 0.022], [-0.06, 0.008], [-0.045, 0.02], [-0.07, 0.03], [-0.06, 0.045], [-0.1, 0.057], [-0.16, 0.042]], Z0, Z1)]);
    add('secReissner', 'membrana vestibolare di Reissner', 0x7a4fd0, [prism([[-0.128, 0.052], [0.181, 0.143], [0.183, 0.151], [-0.13, 0.06]], Z0, Z1)]);
    add('secBM', 'membrana basilare', 0x8a5a2b, [prism([[-0.03, -0.006], [0.214, -0.022], [0.214, -0.036], [-0.03, -0.02]], Z0, Z1)]);
    add('secTect', 'membrana tectoria', 0x4fc3d9, [prism([[-0.095, 0.052], [-0.06, 0.04], [0.09, 0.026], [0.098, 0.038], [0.0, 0.054], [-0.07, 0.061]], Z0, Z1)], { opacity: 0.85 });
    add('secCorti', 'organo del Corti', 0xe2a94e, [prism([[-0.012, -0.007], [0.0, 0.012], [0.03, 0.022], [0.08, 0.02], [0.115, 0.008], [0.125, -0.016]], Z0, Z1)]);
    add('secGanglion', 'ganglio spirale del Corti (canale di Rosenthal)', 0xe8c22a, [ellipsoid([-0.3, 0.0, 0.0], [0.045, 0.06, 0.04], null, 18)]);
    add('secFibers', 'fibre del nervo cocleare', NERVE, [
      taperTube([V(-0.27, 0.0, 0.036), V(-0.15, -0.004, 0.038), V(-0.04, -0.008, 0.038), V(0.03, 0.004, 0.036)], 0.006, { seg: 20, radial: 8 }),
      taperTube([V(-0.3, -0.05, 0.03), V(-0.33, -0.16, 0.036), V(-0.37, -0.285, 0.036)], [0.012, 0.014, 0.016], { seg: 20, radial: 8 }),
    ]);
  }

  // ---- organo del Corti (modiolo a sinistra, scala vestibolare in alto)
  #corti() {
    const g = this.cortiGroup;
    const add = (id, name, color, geos, opts) => this.#sidePart(g, id, name, color, geos, opts);
    const rig = (part, kind) => part.meshes.forEach((mesh) => this.rig.push({ mesh, kind, rest: mesh.position.clone(), half: mesh.userData.size.y / 2 }));
    const ROWS = [-0.05, 0, 0.05];
    const OX = [0.08, 0.14, 0.2];
    const Z0 = -0.08, Z1 = 0.08, TOP = 0.165;
    rig(add('cBM', 'membrana basilare, con le corde acustiche', 0x8a5a2b, [prism([[-0.2, -0.022], [0.45, -0.022], [0.45, 0], [-0.2, 0]], Z0, Z1)]), 'low');
    add('cLamina', 'lamina spirale ossea', 0xd9cba6, [prism([[-0.46, -0.07], [-0.2, -0.035], [-0.2, 0], [-0.46, 0]], Z0, Z1)]);
    add('cLimbus', 'lembo spirale', 0xe2a36a, [prism([[-0.46, 0], [-0.3, 0], [-0.265, 0.05], [-0.3, 0.1], [-0.27, 0.165], [-0.33, 0.215], [-0.46, 0.215]], Z0, Z1)]);
    add('cTect', 'membrana tectoria', 0x4fc3d9, [
      prism([[-0.46, 0.215], [-0.33, 0.215], [-0.27, 0.19], [-0.17, 0.205], [-0.1, 0.203], [0.0, 0.196], [0.22, 0.19], [0.255, 0.205], [0.21, 0.24], [0.0, 0.258], [-0.3, 0.262], [-0.46, 0.25]], Z0, Z1),
    ], { opacity: 0.6 });
    add('cStripe', 'stria di Hensen', 0x1f8fa8, [prism([[-0.165, 0.206], [-0.15, 0.188], [-0.135, 0.186], [-0.12, 0.205]], Z0, Z1)]);
    add('cRetic', 'membrana reticolare', 0x5b4a8a, [prism([[-0.19, TOP], [0.245, TOP], [0.245, TOP + 0.007], [-0.19, TOP + 0.007]], Z0, Z1)]);
    add('cSupport', 'cellule di sostegno interne', 0xe9b9a4, [prism([[-0.3, 0], [-0.1, 0], [-0.108, 0.07], [-0.185, 0.075], [-0.19, 0.16], [-0.215, 0.16], [-0.265, 0.05]], Z0, Z1)], { opacity: 0.55 });
    // cellule capellute interne: a fiasca, una fila
    const flask = [[0, 0], [0.02, 0.004], [0.031, 0.03], [0.028, 0.055], [0.016, 0.074], [0.014, 0.088], [0.018, 0.095], [0, 0.095]];
    add('cIHC', 'cellule capellute interne (a fiasca, una fila)', 0xd4374a, ROWS.map((z) => lathe(flask, -0.15, TOP - 0.095, z)));
    add('cIHCcilia', 'stereociglia delle capellute interne (non toccano la membrana tectoria)', 0xf0e2b8, ROWS.map((z) => merge([-0.008, 0, 0.008].map((dx, k) => stick(V(-0.15 + dx, TOP, z), V(-0.15 + dx, TOP + 0.017 + k * 0.004, z), 0.003, 6)))));
    // pilastri e galleria del Corti
    const pillars = [];
    for (const z of ROWS) {
      pillars.push(taperTube([V(-0.09, 0, z), V(-0.07, 0.08, z), V(-0.035, 0.158, z)], [0.017, 0.009, 0.014], { seg: 16, radial: 10, caps: false }));
      pillars.push(taperTube([V(0.06, 0, z), V(0.04, 0.08, z), V(-0.005, 0.158, z)], [0.017, 0.009, 0.014], { seg: 16, radial: 10, caps: false }));
      pillars.push(new THREE.BoxGeometry(0.075, 0.014, 0.036).translate(-0.02, 0.165, z));
    }
    add('cPillars', 'pilastri del Corti, interni ed esterni', 0xb7791f, [merge(pillars)]);
    const CORTI = 0x7fb8e6;
    add('cTunnel', 'galleria del Corti (cortilinfa)', CORTI, [prism([[-0.07, 0.004], [0.04, 0.004], [-0.018, 0.15]], Z0 + 0.01, Z1 - 0.01)], { opacity: 0.5 });
    add('cNuel', 'spazi di Nuel (cortilinfa)', CORTI, [0.11, 0.17].map((x) => prism([[x - 0.011, 0.082], [x + 0.011, 0.082], [x + 0.011, 0.16], [x - 0.011, 0.16]], Z0 + 0.01, Z1 - 0.01)), { opacity: 0.5 });
    // cellule capellute esterne: a bastoncello, tre file; si accorciano e si allungano
    const ohc = [], cilia = [], deiters = [], phal = [];
    const cup = [[0, 0], [0.024, 0], [0.026, 0.05], [0.021, 0.074], [0.012, 0.068], [0, 0.066]];
    for (const x of OX)
      for (const z of ROWS) {
        ohc.push(new THREE.CylinderGeometry(0.017, 0.017, 0.092, 16).translate(x, TOP - 0.046, z));
        cilia.push(merge([-0.009, 0, 0.009].map((dx, k) => stick(V(x + dx, TOP + 0.007, z), V(x + dx, TOP + 0.022 + k * 0.006, z), 0.003, 6))));
        deiters.push(lathe(cup, x, 0, z));
        phal.push(stick(V(x + 0.03, 0.05, z), V(x + 0.03, TOP, z), 0.0045, 6));
      }
    rig(add('cOHC', 'cellule capellute esterne (a bastoncello, più file)', 0x2f9e5b, ohc), 'ohc');
    add('cOHCcilia', 'stereociglia delle capellute esterne, accolte nella membrana tectoria', 0xf0e2b8, cilia);
    rig(add('cDeiters', 'cellule di Deiters', 0xe58a2e, deiters), 'low');
    rig(add('cPhal', 'falangi delle cellule di Deiters', 0xe58a2e, phal), 'ohc');
    rig(add('cHensen', 'cellule di Hensen', 0x8e5bb5, [prism([[0.235, 0], [0.315, 0], [0.305, 0.115], [0.262, 0.165], [0.235, 0.165]], Z0, Z1)]), 'low');
    rig(add('cClaudius', 'cellule di Claudius', 0xb9a1cf, [prism([[0.315, 0], [0.45, 0], [0.45, 0.045], [0.315, 0.062]], Z0, Z1)]), 'low');
    // fibre: davanti alla sezione
    const ZF = 0.092;
    const t = (pts, r) => taperTube(pts, r, { seg: 20, radial: 8 });
    add('cAff', 'fibre afferenti (neuroni del ganglio del Corti)', NERVE, [merge([
      t([V(-0.46, -0.02, ZF), V(-0.3, -0.012, ZF), V(-0.21, 0.02, ZF), V(-0.165, 0.064, 0.08)], 0.01),
      t([V(-0.21, 0.02, ZF), V(-0.08, 0.012, ZF), V(0.05, 0.022, ZF), V(0.084, 0.07, 0.082)], 0.0045),
      t([V(0.05, 0.022, ZF), V(0.12, 0.032, ZF), V(0.146, 0.07, 0.082)], 0.0045),
      t([V(0.12, 0.032, ZF), V(0.18, 0.036, ZF), V(0.206, 0.07, 0.082)], 0.0045),
    ])]);
    add('cEff', 'fibre efferenti (fascio di Rasmussen)', 0x7a4fd0, [merge([
      t([V(-0.46, -0.05, ZF), V(-0.3, -0.04, ZF), V(-0.23, -0.004, ZF), V(-0.19, 0.04, 0.088)], 0.006),
      ball(-0.188, 0.043, 0.088, 0.011),
      t([V(-0.23, -0.004, ZF), V(-0.1, 0.05, ZF), V(0.0, 0.066, ZF), V(0.068, 0.088, 0.082)], 0.005),
      ball(0.07, 0.09, 0.082, 0.01),
    ])]);
    this.addLink('c-fire', [V(-0.165, 0.064, 0.09), V(-0.21, 0.02, 0.1), V(-0.3, -0.012, 0.1), V(-0.44, -0.02, 0.1)], { r: 0.005 });
    this.addLink('c-eff', [V(-0.44, -0.05, 0.1), V(-0.3, -0.04, 0.1), V(-0.23, -0.004, 0.1), V(-0.1, 0.05, 0.1), V(0.0, 0.066, 0.1), V(0.06, 0.086, 0.09)], { color: 0x7a4fd0, r: 0.004 });
    for (const id of ['c-fire', 'c-eff']) g.add(this.links.get(id).group);
  }

  // name: una delle inquadrature di FOCUS
  setFocus(name, now = false) {
    const f = FOCUS[name];
    this.focusName = name;
    const t = this.focusTarget;
    t.k = f.k;
    t.rod = f.rod;
    t.at.copy(f.at);
    t.to.set(...f.to);
    t.q.setFromEuler(new THREE.Euler(f.rot[0], f.rot[1], 0, 'XYZ'));
    if (f.up) t.q.multiply(new THREE.Quaternion().setFromUnitVectors(AX, V(0, 1, 0)));
    this.secGroup.visible = name === 'section';
    this.cortiGroup.visible = name === 'corti';
    if (now) {
      this.focusNow.q.copy(t.q);
      this.focusNow.k = t.k;
      this.focusNow.rod = t.rod;
      this.focusNow.pos.copy(t.at).applyQuaternion(t.q).multiplyScalar(-t.k).add(t.to);
    }
  }

  // ohc: lunghezza delle capellute esterne, -1 allungate (iperpolarizzate),
  // +1 accorciate (depolarizzate), 'osc' oscillano
  setScene(scene = {}) {
    const osc = scene.ohc === 'osc';
    Object.assign(this.stateTarget, { ohc: osc ? 0 : scene.ohc ?? 0, osc: osc ? 1 : 0 });
  }

  // Punto della membrana basilare che risuona di più: u da 0 (giro basale, toni alti)
  // a 1 (apice, toni bassi); null lo spegne.
  setTone(u) {
    this.tone.u = u;
  }

  reset() {
    super.reset();
    this.setTone(null);
    this.setScene();
    this.setFocus('cochlea');
  }

  update(dt, camera, realDt = dt) {
    const step = Math.min(realDt, 0.5);
    const k = 1 - Math.exp(-step * 5);
    this.clock += step;
    for (const key of Object.keys(this.state)) this.state[key] += (this.stateTarget[key] - this.state[key]) * k;
    const f = this.focusNow, t = this.focusTarget;
    f.q.slerp(t.q, k);
    f.k += (t.k - f.k) * k;
    f.rod += (t.rod - f.rod) * k;
    f.pos.lerp(t.at.clone().applyQuaternion(t.q).multiplyScalar(-t.k).add(t.to), k);
    this.inner.quaternion.copy(f.q);
    this.inner.position.copy(f.pos);
    this.inner.scale.setScalar(f.k);
    this.rod.scale.y = Math.max(0.01, f.rod - 0.02);
    this.rod.position.set(0, 0.02 + (f.rod - 0.02) / 2, 0);
    super.update(dt, camera, realDt);
    // capellute esterne: l'estremo apicale resta fermo nella membrana reticolare,
    // la base (con cellule di Deiters e membrana basilare) sale o scende
    const v = this.state.ohc + this.state.osc * Math.sin(this.clock * Math.PI * 2 * 0.55);
    const dy = 0.016 * v;
    for (const r of this.rig) {
      if (r.kind === 'low') r.mesh.position.y = r.rest.y + dy;
      else {
        const s = 1 - dy / (2 * r.half);
        r.mesh.scale.y = s;
        r.mesh.position.y = r.rest.y + r.half * (1 - s);
      }
    }
    // tonotopia: il picco si gonfia attorno al punto scelto e vibra lungo l'asse
    const tn = this.tone;
    tn.on += ((tn.u == null ? 0 : 1) - tn.on) * k;
    if (tn.u != null) tn.at = tn.on < 0.05 ? tn.u : tn.at + (tn.u - tn.at) * Math.min(1, k * 2);
    const duct = this.visible.has('ductMid');
    for (const b of tn.beads) {
      const g = Math.exp(-(((b.u - tn.at) / 0.022) ** 2)) * tn.on;
      b.m.visible = duct && g > 0.04;
      if (!b.m.visible) continue;
      b.m.scale.setScalar(b.r * (0.9 + 1.1 * g));
      b.m.position.copy(b.p).addScaledVector(AX, b.r * 1.3 * g * Math.sin(this.clock * Math.PI * 2 * 2.2));
    }
    // le etichette delle parti delle sezioni seguono `side`, non `inner`
    this.side.updateWorldMatrix(true, true);
    for (const [id, label] of this.labels) {
      if (!label.visible) continue;
      for (const mat of [].concat(label.material)) if (mat.depthTest) mat.depthTest = false;
      if (!this.sideIds.has(id)) continue;
      const part = this.parts.get(id);
      const m = part.meshes[0];
      label.position.copy(m.position);
      label.position.y += (label.userData.lift ??= Math.max(0.012, m.userData.size.y / 2 + 0.008));
      label.position.applyMatrix4(m.parent.matrixWorld);
      this.overlay.worldToLocal(label.position);
    }
  }
}
