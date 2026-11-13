// Orecchio interno destro: labirinto osseo reale in trasparenza con il labirinto
// membranoso ricostruito al suo interno; accanto, due ingrandimenti (un tratto di
// macula otolitica, due cellule capellute); infine la base cranica con i due
// labirinti, per l'accoppiamento dei canali. Le coordinate sono quelle di
// Z-Anatomy portate nella terna dei modelli da tools/mesh.mjs (vedi
// meshes/orecchio-interno.json): ogni punto ricostruito a mano è scritto in
// millimetri della sorgente (x sinistra, y dietro, z alto) e convertito con P().
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0): «Vestibule.r» (diviso in vestibolo e tre
// canali semicircolari: le regole di split seguono la linea d'asse di ogni
// canale, estratta dalla mesh), «Cochlea.r», «Stapes.r», «Cochlear nerve»,
// «Vestibular nerve.r» (dei due nervi solo il tratto vicino al labirinto),
// «Temporal bone» destro e sinistro, «Occipital bone», «Sphenoid bone» (delle
// ossa solo la parte attorno alle rocche petrose).
//
// MISURATO SULLE MESH: linee d'asse, centri, raggi e piani dei tre canali
// (laterale: raggio 2,6 mm, inclinato di 28° sull'orizzontale con l'estremo
// anteriore in alto; anteriore 3,6 mm; posteriore 3,5 mm; angoli reciproci
// 80-92°), ampolle ossee (i tratti dilatati: antero-laterale per laterale e
// anteriore, inferiore per il posteriore), crus commune, asse e giro basale
// della chiocciola, cresta della rocca petrosa (circa 50° sul piano sagittale).
//
// ORIENTAMENTO: in Z-Anatomy il labirinto è ruotato di circa 36° rispetto alla
// descrizione classica (la chiocciola sta davanti al vestibolo invece che
// antero-medialmente, il canale anteriore è quasi frontale). Nelle pagine
// sull'orecchio destro la mesh è lasciata com'è. Solo nella veduta della base
// cranica le copie dei due labirinti sono ruotate (matrice RK: la rotazione
// rigida che porta al meglio i tre piani misurati su anteriore e posteriore
// verticali a 45° e laterale a 30°; residui 11-19°) e ingrandite 2,5 volte
// attorno al centro del vestibolo e sollevate di 30 mm sopra le rocche, perché
// i piani si possano confrontare senza che l'osso le copra.
//
// RICOSTRUITO A MANO dentro il labirinto osseo reale:
//  - Dotti semicircolari con le ampolle membranose e le creste, lungo la linea
//    d'asse dei canali reali; crus commune membranoso.
//  - Utricolo (oblungo, nella parte alta e posteriore del vestibolo, riceve i
//    cinque sbocchi dei dotti) con la macula orizzontale sul pavimento; sacculo
//    (globoso, in basso e in avanti verso la parete mediale, lontano dalla
//    platina della staffa reale) con la macula verticale.
//  - Dotto utricolo-sacculare, dotto e sacco endolinfatico (dal vestibolo
//    all'indietro, medialmente al canale posteriore reale), dotto reuniens,
//    dotto cocleare (lungo il giro basale misurato, poi a spirale fino all'apice).
//  - Ingrandimenti schematici: macula (epitelio, cellule capellute, membrana
//    otolitica, otoconi, striola) e cellule capellute di tipo 1 e 2 (stereociglia
//    a scala, chinociglio, tip links, piastra cuticolare, corpo sinaptico,
//    calice e bottone afferenti, terminazioni efferenti, cellule di sostegno).
//
// FONTI LETTE (voci di Wikipedia in inglese, in parte derivate dal testo di
// pubblico dominio di Gray, Anatomy of the Human Body, 20ª ed., 1918):
//  - Utricle (ear), https://en.wikipedia.org/wiki/Utricle_(ear)
//    (oblungo, parte alta e posteriore del vestibolo; macula 2 x 3 mm orizzontale
//    sul pavimento; cinque orifizi dei dotti; dotto utricolo-sacculare)
//  - Saccule, https://en.wikipedia.org/wiki/Saccule  e  Macula of saccule,
//    https://en.wikipedia.org/wiki/Macula_of_saccule
//    (globoso, nel recesso sferico presso l'inizio della scala vestibolare; macula
//    quasi verticale, 2 x 3 mm; dotto endolinfatico dalla parete posteriore; dotto
//    reuniens dalla parte bassa; striola; otoconi sulla membrana otolitica)
//  - Vestibule of the ear, https://en.wikipedia.org/wiki/Vestibule_of_the_ear
//    (5 x 5 x 3 mm; finestra ovale nella parete laterale; recesso sferico in avanti
//    sulla parete mediale, ellittico sul tetto; acquedotto nella parte posteriore
//    della parete mediale; cinque orifizi dei canali all'indietro)
//  - Semicircular canals, https://en.wikipedia.org/wiki/Semicircular_canals
//    (ampolla larga più del doppio del dotto; estremi ampollari; crus commune;
//    laterale a 30° sull'orizzontale; acquedotto subito mediale al posteriore)
//  - Membranous labyrinth, https://en.wikipedia.org/wiki/Membranous_labyrinth
//    e Bony labyrinth, https://en.wikipedia.org/wiki/Bony_labyrinth (perilinfa tra i due)
//  - Crista ampullaris, https://en.wikipedia.org/wiki/Crista_ampullaris
//  - Endolymphatic duct, https://en.wikipedia.org/wiki/Endolymphatic_duct
//  - Ductus reuniens, https://en.wikipedia.org/wiki/Ductus_reuniens
//  - Cochlear duct, https://en.wikipedia.org/wiki/Cochlear_duct
//  - Tip link, https://en.wikipedia.org/wiki/Tip_link
//  - Vestibular system, https://en.wikipedia.org/wiki/Vestibular_system
//    (canali verticali a circa 45° tra piano frontale e sagittale; coppie quasi parallele)
//  - Petrous part of the temporal bone,
//    https://en.wikipedia.org/wiki/Petrous_part_of_the_temporal_bone
//
// TESTA CHE GIRA (pagina «Canali accoppiati», setTurn): cupola nell'ampolla dei due canali
// laterali ingranditi ed endolinfa in gocce lungo il canale, RICOSTRUITE e molto
// ingrandite; la cupola si piega nel verso in cui l'endolinfa scorre rispetto al canale.
// Il verso (verso l'ampolla o no) è calcolato dalla geometria dei canali reali e torna con
// l'esempio degli appunti (testa verso destra: laterale destro stimolato, sinistro inibito).
//
// STIMATO, senza una fonte letta: calibro dei dotti (qui metà del canale, per
// renderli visibili: nel vero sono più sottili) e loro posizione verso la parete
// esterna del canale; forma e dimensioni esatte di utricolo, sacculo e sacco
// endolinfatico; decorso dei giri medio e apicale del dotto cocleare (la mesh
// non li distingue); proporzioni dei due ingrandimenti, che sono schemi: poche
// cellule e poche stereociglia invece di 4000 e 70-80; movimenti esagerati.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.036;
const O = [-39.5, 4.6, 1573];
const P = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const D = (x, y, z) => V(-x, z, -y).normalize();
const mm = (list) => list.map((r) => r * S);
const XMID = O[0] * S; // piano sagittale mediano nelle coordinate del modello

const BONE = 0xe9dfc8;
const NERVE = 0xe8c22a;
const C_LAT = 0x2f9e5b, C_ANT = 0xd4496f, C_POST = 0xe0902e;

// Linee d'asse dei canali ossei (mm), misurate sulla mesh «Vestibule.r».
const LAT = [[-38.85, 7.55, 1581.29], [-39.04, 8.21, 1581.38], [-39.3, 8.67, 1581.45], [-39.6, 9.16, 1581.55], [-39.84, 9.52, 1581.58], [-40.11, 9.85, 1581.62], [-40.77, 10.35, 1581.67], [-41.54, 10.78, 1581.79], [-41.98, 10.62, 1581.98], [-42.74, 10.37, 1582.34], [-43.4, 9.93, 1582.72], [-43.9, 9.36, 1583.12], [-44.14, 8.68, 1583.52], [-43.78, 8.0, 1583.79], [-43.85, 7.55, 1583.91], [-43.38, 6.86, 1583.96], [-43.04, 6.62, 1583.95]];
const ANT = [[-41.71, 5.35, 1585.85], [-41.91, 5.65, 1586.52], [-41.95, 5.96, 1587.22], [-41.73, 6.24, 1587.86], [-41.35, 6.51, 1588.44], [-40.83, 6.8, 1588.94], [-40.18, 7.11, 1589.31], [-39.44, 7.4, 1589.52], [-38.66, 7.64, 1589.57], [-37.88, 7.8, 1589.42], [-37.15, 7.86, 1589.08], [-36.51, 7.88, 1588.58], [-36.0, 7.86, 1587.94], [-35.61, 7.84, 1587.23], [-35.35, 7.83, 1586.48], [-35.23, 7.8, 1585.79], [-35.25, 7.8, 1585.09], [-35.48, 7.81, 1584.4], [-35.84, 7.89, 1583.76]];
const POST = [[-36.11, 9.17, 1583.05], [-36.03, 9.94, 1583.13], [-36.18, 10.69, 1583.12], [-36.34, 11.25, 1583.07], [-36.72, 11.98, 1582.9], [-37.18, 12.62, 1582.58], [-37.72, 13.09, 1582.1], [-37.92, 13.18, 1581.7], [-38.54, 13.43, 1581.19], [-39.06, 13.45, 1580.52], [-39.52, 13.25, 1579.84], [-39.88, 12.84, 1579.2], [-40.08, 12.26, 1578.64], [-40.08, 11.51, 1578.22], [-40.08, 11.12, 1578.05], [-39.97, 10.29, 1577.87], [-39.79, 9.45, 1577.84], [-39.57, 8.6, 1577.89], [-39.27, 7.73, 1578.04], [-39.04, 7.2, 1578.34], [-38.84, 6.41, 1578.82]];
// centro (mm), normale del piano e raggio (mm) dei tre canali
export const CANALS = {
  lat: { c: [-41.54, 8.23, 1582.59], n: [0.379, 0.28, 0.882], r: 2.63, line: LAT },
  ant: { c: [-38.69, 6.87, 1585.96], n: [-0.306, 0.939, -0.155], r: 3.61, line: ANT },
  post: { c: [-38.1, 9.96, 1580.47], n: [-0.785, -0.197, 0.588], r: 3.49, line: POST },
};
// Chiocciola: centro, asse (verso l'apice) e due assi trasversali; linea d'asse
// del giro basale misurata sulla mesh.
const COCH = { c: [-39.59, -1.12, 1580.12], ax: [-0.869, -0.493, -0.035], e1: [-0.423, 0.778, -0.464], e2: [0.256, -0.389, -0.885] };
const BASAL = [[-41.37, 2.8, 1578.77], [-40.76, 1.68, 1577.9], [-40.03, 0.65, 1577.42], [-39.34, -0.24, 1577.22], [-38.72, -1.09, 1577.28], [-38.23, -1.91, 1577.56], [-37.8, -2.65, 1578.14], [-37.51, -3.28, 1578.96], [-37.35, -3.57, 1580.02], [-37.41, -3.47, 1581.16], [-37.63, -2.94, 1582.16], [-38.02, -2.16, 1582.77], [-38.63, -1.33, 1582.91], [-39.25, -0.73, 1582.59]];
const VEST = [-40.1, 5.4, 1581.8]; // centro del vestibolo
// Rotazione (in mm della sorgente) che riporta il labirinto all'orientamento classico.
const RK = [[0.8191, -0.509, -0.2645], [0.4559, 0.8575, -0.2384], [0.3482, 0.0746, 0.9344]];
const ENLARGE = 2.5;
const LIFT = 30; // mm: i labirinti ingranditi stanno sollevati sopra le rocche

// Pose del modello. `at` (mm) va nel punto `to` della pagina, ingrandito `k`;
// `rot` = [inclinazione verso chi legge, rotazione attorno alla verticale].
// Restano del modello perché `inner` oscilla con il labirinto (vedi update) e
// perché `macula` mette il labirinto rimpicciolito in un angolo, accanto allo
// schema ingrandito: il primo piano del motore inquadra un solo punto al centro.
const LAB_YAW = -1.05;
export const FOCUS = {
  lab: { at: [-39.5, 4.6, 1582.6], to: [0, 0.31, 0], k: 0.9, rot: [0, LAB_YAW], rod: 0.16 },
  macula: { at: [-39.5, 5, 1582.6], to: [0.27, 0.49, 0], k: 0.44, rot: [0, LAB_YAW], rod: 0.1 },
  cell: { at: [-39.5, 5, 1582.6], to: [0, 0.4, 0], k: 0.3, rot: [0, LAB_YAW], rod: 0.2 },
};
// Base cranica dall'alto: veduta del motore (vedi AnatomyModel.zoomTo, qui con
// scala < 1) sopra la posa `lab`, con il ritaglio al volume della pagina. Il
// modello è inclinato verso chi legge con `tilt`; la pagina annulla la rotazione
// della posa con view.yaw = SKULL_YAW. Poiché la posa è ruotata, `at` è dato
// nelle coordinate ruotate; il suo scarto dal centro della base cranica porta
// quest'ultima dietro l'asse della base, dove l'inclinazione la riporta sopra
// la pagina. SKULL_FIT rimpicciolisce il tutto attorno a quel centro, perché i
// due labirinti stiano dentro la pagina.
const SKULL_FIT = 0.85;
export const SKULL_YAW = -LAB_YAW;

export const SKULL_VIEW = {
  at: P(0, 6, 1590).applyAxisAngle(V(0, 1, 0), LAB_YAW).add(V(-1.194 / SKULL_FIT, 0, 0.685 / SKULL_FIT)).toArray(),
  scale: (0.2 / FOCUS.lab.k) * SKULL_FIT,
  height: 0.2,
  tilt: 0.55,
};

const REST = { organ: 0, shift: 0, bend: 0, lin: 0, turn: 0 };
// testa che gira (vedi setTurn): attorno alla verticale che passa per il centro della base
// cranica, al più di HEAD_TURN radianti per lato
const HEAD_PIVOT = P(0, 6, 1590);
const HEAD_TURN = 0.55;

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

// cilindro da a a b
function stick(a, b, r, radial = 8) {
  const d = b.clone().sub(a);
  const g = new THREE.CylinderGeometry(r, r, d.length(), radial);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize()));
  const m = a.clone().lerp(b, 0.5);
  g.translate(m.x, m.y, m.z);
  return g;
}

function arrow(a, b, r) {
  const d = b.clone().sub(a);
  const len = d.length();
  const dir = d.normalize();
  const neck = a.clone().addScaledVector(dir, len - r * 6);
  const head = new THREE.ConeGeometry(r * 2.8, r * 6, 14);
  head.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir));
  const hc = neck.clone().addScaledVector(dir, r * 3);
  head.translate(hc.x, hc.y, hc.z);
  return merge([stick(a, neck, r), head]);
}

function disc(c, n, r) {
  const g = new THREE.CircleGeometry(r, 56);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n));
  g.translate(c.x, c.y, c.z);
  return g;
}

function lathe(profile, x, y) {
  const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), 28);
  g.translate(x, y, 0);
  g.computeVertexNormals();
  return g;
}

// copia speculare rispetto al piano sagittale mediano della testa
function mirrorHead(g) {
  const m = g.clone();
  m.scale(-1, 1, 1);
  m.translate(2 * XMID, 0, 0);
  const i = m.index.array;
  for (let k = 0; k < i.length; k += 3) [i[k + 1], i[k + 2]] = [i[k + 2], i[k + 1]];
  m.index.needsUpdate = true;
  m.computeVertexNormals();
  return m;
}

// generatore deterministico, per otoconi e vescicole
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export class InnerEarModel extends AnatomyModel {
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
    this.standRod = this.rod; // il motore la nasconde nelle sue vedute
    // gli ingrandimenti stanno accanto al modello, fuori dall'inquadratura e dal
    // ribaltamento: x verso la destra di chi guarda, y in alto, z verso chi guarda
    this.side = new THREE.Group();
    this.side.scale.x = -1;
    this.mirror.add(this.side);
    // le cellule capellute, più alte della pagina, sono rimpicciolite in blocco
    this.cellGroup = new THREE.Group();
    this.cellGroup.scale.setScalar(0.84);
    this.cellGroup.position.y = -0.025;
    this.side.add(this.cellGroup);
    this.maculaGroup = new THREE.Group();
    this.maculaGroup.scale.setScalar(1.12);
    this.maculaGroup.position.y = -0.012;
    this.side.add(this.maculaGroup);
    this.sideIds = new Set();
    this.focusNow = { pos: V(0, 0, 0), k: 1, q: new THREE.Quaternion(), rod: 0.2 };
    this.focusTarget = { at: V(0, 0, 0), to: V(0, 0, 0), k: 1, q: new THREE.Quaternion(), rod: 0.2 };
    this.state = { ...REST };
    this.stateTarget = { ...REST };
    this.motion = { dir: V(0, 0, 1), axis: V(0, 1, 0), pivot: V(0, 0, 0) };
    this.clock = 0;
    this.rig = [];
    this.setTurn(false);
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('orecchio-interno.glb', {
      vestibule: ['vestibolo (labirinto osseo)', BONE],
      canalLat: ['canale semicircolare laterale (orizzontale)', BONE],
      canalAnt: ['canale semicircolare anteriore (superiore)', BONE],
      canalPost: ['canale semicircolare posteriore', BONE],
      cochlea: ['coclea (labirinto osseo)', BONE],
      stapes: ['staffa, nella finestra ovale', 0xc79a4e],
      cochlearNerve: ['nervo cocleare', 0xd9a02a],
      vestibularNerve: ['nervo vestibolare', NERVE],
      temporalR: ['osso temporale destro (rocca petrosa)', BONE],
      temporalL: ['osso temporale sinistro (rocca petrosa)', BONE],
      occipital: ['osso occipitale', 0xdfd3b6],
      sphenoid: ['osso sfenoide', 0xd8cfae],
    });
    this.#ducts();
    this.#sacs();
    this.#cochlearDuct();
    this.#planes();
    this.#skull();
    this.#maculaBlock();
    this.#hairCells();
    this.setFocus('lab', true);
  }

  // ---- labirinto membranoso: dotti semicircolari, ampolle, creste
  #ducts() {
    const out = (canal, off) => {
      const c = V(...canal.c), n = V(...canal.n).normalize();
      return canal.line.map((p) => {
        const v = V(...p);
        const d = v.clone().sub(c);
        d.addScaledVector(n, -d.dot(n)).normalize();
        return v.addScaledVector(d, off);
      });
    };
    const path = (pts) => pts.map((p) => P(p.x, p.y, p.z));
    // raggio lungo il dotto: sottile, con l'ampolla attorno a `at` (0-1)
    const radii = (at, n = 30) =>
      mm(Array.from({ length: n }, (_, i) => 0.27 + 0.4 * Math.exp(-(((i / (n - 1) - at) / 0.055) ** 2))));

    const lat = [...out(CANALS.lat, 0.16).filter((_, i) => i % 2 === 0), V(-42.5, 6.1, 1584.1)];
    this.addPart('ductLat', 'dotto semicircolare laterale, con la sua ampolla', C_LAT, [taperTube(path(lat), radii(0.93), { seg: 90 })]);
    const ant = [V(-41.9, 5.5, 1585.0), ...out(CANALS.ant, 0.16).filter((_, i) => i % 2 === 0)];
    this.addPart('ductAnt', 'dotto semicircolare anteriore, con la sua ampolla', C_ANT, [taperTube(path(ant), radii(0.075), { seg: 90 })]);
    const post = [V(-35.95, 8.35, 1583.5), ...out(CANALS.post, 0.16).filter((_, i) => i % 2 === 0), V(-38.43, 6.01, 1579.46), V(-38.4, 6.3, 1580.2)];
    this.addPart('ductPost', 'dotto semicircolare posteriore, con la sua ampolla', C_POST, [taperTube(path(post), radii(0.925), { seg: 100 })]);
    this.addPart('crus', 'crus commune (dotti anteriore e posteriore)', 0x8f9fc4, [
      taperTube(path([V(-35.8, 7.95, 1584.0), V(-36.3, 7.6, 1583.1), V(-37.2, 7.1, 1582.3), V(-38.2, 6.9, 1581.8)]), mm([0.3, 0.33, 0.36, 0.4])),
    ]);
    // creste ampollari: un rilievo trasversale in ogni ampolla
    const crest = (p, axis) => {
      const g = ellipsoid([0, 0, 0], mm([0.72, 0.72, 0.2]), null, 18);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), D(...axis)));
      const c = P(...p);
      g.translate(c.x, c.y, c.z);
      return g;
    };
    this.addPart('cristae', 'creste ampollari', 0xb8402f, [
      crest([-43.3, 6.82, 1583.97], [0.75, 0.6, 0.05]),
      crest([-41.85, 5.52, 1586.2], [-0.2, 0.35, 0.9]),
      crest([-38.95, 6.75, 1578.6], [0.3, -0.75, 0.55]),
    ]);
    this.ampullae = { lat: P(-43.3, 6.82, 1583.97), ant: P(-41.85, 5.52, 1586.2), post: P(-38.95, 6.75, 1578.6) };
  }

  // ---- utricolo, sacculo, macule, dotti di collegamento
  #sacs() {
    const path = (pts) => pts.map((p) => P(...p));
    this.addPart('utricle', 'utricolo', 0x4a90d9, [
      taperTube(path([[-42.25, 5.7, 1584.4], [-41.3, 5.9, 1583.6], [-40.1, 6.3, 1582.5], [-38.9, 6.8, 1581.4], [-38.5, 6.7, 1580.6]]), mm([0.95, 1.25, 1.1, 0.95, 0.7]), { seg: 48, radial: 20 }),
    ], { opacity: 0.72 });
    const sc = [-38.35, 3.7, 1580.3];
    this.addPart('saccule', 'sacculo', 0x8a63d2, [ellipsoid(P(...sc).toArray(), mm([1.0, 1.35, 1.15]))], { opacity: 0.72 });
    // macula dell'utricolo: orizzontale, sul pavimento della parte anteriore
    const mu = ellipsoid([0, 0, 0], mm([0.95, 0.13, 1.3]), null, 20);
    mu.rotateY(-0.3);
    const muc = P(-41.25, 5.85, 1582.62);
    mu.translate(muc.x, muc.y, muc.z);
    this.addPart('macUt', "macula dell'utricolo (orizzontale)", 0xe2572f, [mu]);
    // macula del sacculo: verticale, sulla parete rivolta verso il meato acustico interno
    const n = D(0.82, -0.57, 0);
    const ms = ellipsoid([0, 0, 0], mm([0.85, 1.25, 0.13]), null, 20);
    ms.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n));
    const msc = P(sc[0] + 0.82 * 0.95, sc[1] - 0.57 * 0.95, sc[2]);
    ms.translate(msc.x, msc.y, msc.z);
    this.addPart('macSac', 'macula del sacculo (verticale)', 0xe2572f, [ms]);
    this.addPart('endoDuct', 'dotto utricolo-sacculare e dotto endolinfatico', 0x5d7fd6, [
      taperTube(path([[-39.9, 5.7, 1582.0], [-38.95, 4.95, 1581.25], [-38.45, 4.6, 1580.85]]), mm([0.22, 0.2, 0.22]), { seg: 16 }),
      taperTube(path([[-38.95, 4.95, 1581.25], [-37.5, 6.0, 1581.35], [-35.9, 7.6, 1581.2], [-34.8, 9.6, 1580.6], [-34.3, 11.4, 1579.5]]), mm([0.2, 0.19, 0.18, 0.18, 0.22]), { seg: 40 }),
    ]);
    const sac = ellipsoid([0, 0, 0], mm([0.45, 1.9, 1.35]), null, 20);
    sac.rotateX(0.55);
    const sp = P(-34.25, 12.9, 1578.2);
    sac.translate(sp.x, sp.y, sp.z);
    this.addPart('endoSac', 'sacco endolinfatico', 0x5d7fd6, [sac]);
    this.addPart('reuniens', 'dotto reuniens', 0x3aa6c4, [
      taperTube(path([[-38.5, 3.55, 1579.2], [-39.5, 3.25, 1578.75], [-40.6, 3.0, 1578.7], [-41.2, 2.85, 1578.75]]), mm([0.17, 0.15, 0.15, 0.17]), { seg: 20 }),
    ]);
  }

  // ---- dotto cocleare: giro basale misurato, poi spirale fino all'apice
  #cochlearDuct() {
    const c = V(...COCH.c), ax = V(...COCH.ax), e1 = V(...COCH.e1), e2 = V(...COCH.e2);
    const mod = c.clone().addScaledVector(e1, 0.3).addScaledVector(e2, -0.15); // asse del modiolo
    const pts = BASAL.map((p) => {
      const v = V(...p);
      const d = v.clone().sub(mod);
      d.addScaledVector(ax, -d.dot(ax)).normalize();
      return v.addScaledVector(d, 0.42);
    });
    const t0 = 260, t1 = 916;
    for (let t = t0; t <= t1; t += 24) {
      const u = (t - t0) / (t1 - t0);
      const a = (t * Math.PI) / 180;
      const rho = 2.55 + (0.75 - 2.55) * u, h = -0.45 + (1.95 + 0.45) * u ** 0.85;
      pts.push(mod.clone().addScaledVector(e1, rho * Math.cos(a)).addScaledVector(e2, rho * Math.sin(a)).addScaledVector(ax, h));
    }
    this.addPart('cochlearDuct', 'dotto cocleare (scala media)', 0x2fb4c8, [
      taperTube(pts.map((p) => P(p.x, p.y, p.z)), mm([0.42, 0.42, 0.4, 0.36, 0.32, 0.28, 0.24, 0.2]), { seg: 220, radial: 10 }),
    ]);
  }

  // ---- piani dei canali e frecce delle accelerazioni (orecchio destro)
  #planes() {
    const names = { lat: ['planeLat', 'piano del canale laterale', C_LAT], ant: ['planeAnt', 'piano del canale anteriore', C_ANT], post: ['planePost', 'piano del canale posteriore', C_POST] };
    for (const [key, canal] of Object.entries(CANALS)) {
      const [id, name, color] = names[key];
      const c = P(...canal.c), n = D(...canal.n);
      this.addPart(id, name, color, [disc(c, n, (canal.r + 1.1) * S)], { double: true, opacity: 0.3 });
      // freccia curva nel piano del canale
      const a = new THREE.Vector3().crossVectors(n, V(0.3, 1, 0.2)).normalize();
      const b = new THREE.Vector3().crossVectors(n, a);
      const R = (canal.r + 1.75) * S;
      const arc = [];
      for (let i = 0; i <= 18; i++) {
        const t = (i / 18) * Math.PI * 1.55;
        arc.push(c.clone().addScaledVector(a, R * Math.cos(t)).addScaledVector(b, R * Math.sin(t)));
      }
      this.addLink(`rot-${key}`, arc, { color, r: 0.005 });
    }
    this.addLink('acc-h', [P(-46.6, 11.5, 1583), P(-46.6, 6, 1583), P(-46.6, 0.5, 1583)], { color: 0x4a90d9, r: 0.006 });
    this.addLink('acc-v', [P(-46.6, 2.5, 1585.5), P(-46.6, 2.5, 1581), P(-46.6, 2.5, 1576.5)], { color: 0x8a63d2, r: 0.006 });
  }

  // ---- base cranica: i due labirinti riorientati e ingranditi, con i piani dei canali
  #skull() {
    // rotazione RK nella terna del modello: T·R·Tt con T = (x,y,z) -> (-x, z, -y)
    const T = new THREE.Matrix4().set(-1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
    const R = new THREE.Matrix4().set(...RK[0], 0, ...RK[1], 0, ...RK[2], 0, 0, 0, 0, 1);
    const M = T.clone().multiply(R).multiply(T.clone().transpose());
    const pivot = P(...VEST);
    const up = V(0, LIFT * S, 0);
    const move = (v) => v.sub(pivot).applyMatrix4(M).multiplyScalar(ENLARGE).add(pivot).add(up);
    const copy = (id) => {
      const mesh = this.parts.get(id).meshes[0];
      const g = mesh.geometry.clone();
      const pos = g.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        move(v.fromBufferAttribute(pos, i).add(mesh.position));
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return g;
    };
    const C_RALP = 0xe0902e, C_LARP = 0x3f7fe0;
    const defs = [
      ['Body', 'vestibule', 'vestibolo', BONE, BONE],
      ['Coch', 'cochlea', 'coclea', 0xd9cfb6, 0xd9cfb6],
      ['Lat', 'canalLat', 'canale semicircolare laterale', C_LAT, C_LAT],
      ['Ant', 'canalAnt', 'canale semicircolare anteriore', C_RALP, C_LARP],
      ['Post', 'canalPost', 'canale semicircolare posteriore', C_LARP, C_RALP],
    ];
    for (const [suffix, src, name, colR, colL] of defs) {
      // la copia speculare va fatta prima di addPart, che ricentra la geometria
      const g = copy(src), gl = mirrorHead(g);
      this.addPart(`r${suffix}`, `${name} destro`, colR, [g]);
      this.addPart(`l${suffix}`, `${name} sinistro`, colL, [gl]);
    }
    const planes = { lat: ['Lat', C_LAT, C_LAT], ant: ['Ant', C_RALP, C_LARP], post: ['Post', C_LARP, C_RALP] };
    for (const [key, canal] of Object.entries(CANALS)) {
      const [suffix, colR, colL] = planes[key];
      const c = move(P(...canal.c));
      const n = D(...canal.n).applyMatrix4(M).normalize();
      const g = disc(c, n, (canal.r + 2.6) * ENLARGE * S), gl = mirrorHead(g);
      this.addPart(`rPlane${suffix}`, `piano del canale ${key === 'lat' ? 'laterale' : key === 'ant' ? 'anteriore' : 'posteriore'} destro`, colR, [g], { double: true, opacity: 0.5 });
      this.addPart(`lPlane${suffix}`, `piano del canale ${key === 'lat' ? 'laterale' : key === 'ant' ? 'anteriore' : 'posteriore'} sinistro`, colL, [gl], { double: true, opacity: 0.5 });
    }
    // cresta della rocca petrosa (misurata sul temporale reale) e linea mediana
    const ridge = taperTube([P(-50, 20.2, 1600), P(-30, 6.3, 1597), P(-10, -7.6, 1593)], 1.1 * S, { seg: 12 });
    const ridgeL = mirrorHead(ridge);
    this.addPart('axisR', 'asse della rocca petrosa destra', 0xb3371f, [ridge]);
    this.addPart('axisL', 'asse della rocca petrosa sinistra', 0xb3371f, [ridgeL]);
    this.addPart('midline', 'linea antero-posteriore', 0x3a3632, [taperTube([P(0, -30, 1600), P(0, 8, 1600), P(0, 44, 1600)], 0.9 * S, { seg: 8 })]);
    this.#lateralFlow(move);
  }

  // ---- canali laterali delle due copie: cupola nell'ampolla ed endolinfa che scorre
  // (vedi setTurn). `move` porta un punto del labirinto destro nella copia ingrandita.
  #lateralFlow(move) {
    const flip = (v) => V(2 * XMID - v.x, v.y, v.z);
    const R = 2.1 * ENLARGE * S; // raggio della cupola, ESAGERATO per vederla
    this.flow = {};
    for (const side of ['R', 'L']) {
      const at = (v) => (side === 'R' ? v : flip(v));
      // linea d'asse del canale osseo: comincia dal crus, finisce nell'ampolla (antero-laterale)
      const line = CANALS.lat.line.map((p) => at(move(P(...p))));
      const c = at(move(P(...CANALS.lat.c)));
      const amp = at(move(this.ampullae.lat.clone()));
      // normale orientata con il verso della linea: una rotazione positiva attorno a `n`
      // porta un punto del canale verso l'ampolla
      const n = V(0, 0, 0);
      for (let i = 0; i < line.length - 1; i++) n.add(line[i].clone().sub(c).cross(line[i + 1].clone().sub(line[i])));
      n.normalize();
      const t = line.at(-1).clone().sub(line.at(-3)).normalize(); // verso l'ampolla, lungo il dotto
      const u = c.clone().sub(amp);
      u.addScaledVector(t, -u.dot(t)).normalize(); // di traverso, dalla cresta verso il centro del canale
      // cupola: lamina gelatinosa di traverso nell'ampolla, la base sulla cresta
      const cup = ellipsoid([0, 0, 0], [R, R, R * 0.24], null, 20);
      cup.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), t));
      cup.translate(amp.x, amp.y, amp.z);
      const lato = side === 'R' ? 'destro' : 'sinistro';
      const cupPart = this.addPart(`cup${side}`, `cupola della cresta ampollare, canale laterale ${lato}`, 0xf0e2b0, [cup], { opacity: 0.92 });
      const mesh = cupPart.meshes[0];
      const rest = mesh.geometry.attributes.position.array.slice();
      // endolinfa: gocce lungo il canale (si muovono in `update`)
      const lengths = [0];
      for (let i = 1; i < line.length; i++) lengths.push(lengths[i - 1] + line[i].distanceTo(line[i - 1]));
      const drops = Array.from({ length: 9 }, () => new THREE.SphereGeometry(0.42 * ENLARGE * S, 10, 8));
      const endo = this.addPart(`endo${side}`, `endolinfa nel canale laterale ${lato}`, 0x2fb4c8, drops);
      this.flow[side] = { line, lengths, n, t, u, R, mesh, rest, drops: endo.meshes, phase: 0, bend: 0, excite: 0 };
    }
  }

  // Testa che gira: con `on` il trascinamento di sempre non fa ruotare il modello attorno
  // all'asta (la base cranica, che sta dietro l'asse, uscirebbe dalla pagina) ma gira la
  // testa attorno alla propria verticale, fino a HEAD_TURN per lato. L'endolinfa dei
  // canali laterali resta indietro per inerzia: scorre nel canale in senso opposto e
  // piega la cupola. `turnState` = { w, R, L }: velocità angolare della testa (rad/s, +
  // verso destra) e, per lato, l'effetto sui recettori (+ stimolati, - inibiti, da -1 a 1).
  setTurn(on) {
    this.turning = on;
    this.turnBase = null;
    this.headAngle = 0;
    this.headLast = 0;
    this.turnW = 0;
    this.turnState = { w: 0, R: 0, L: 0 };
  }

  #turn(dt) {
    if (!this.flow) return;
    const st = this.turnState ?? { w: 0, R: 0, L: 0 };
    if (this.turning) {
      // la rotazione chiesta dal trascinamento passa alla testa. La base è la vista della
      // pagina (main.js la pone prima di enter, che chiama setTurn); un salto enorme si
      // prende per una nuova vista. Il modello è ribaltato a schermo (mirror): nelle sue
      // coordinate la rotazione ha il segno opposto a `yaw`
      const d = this.turnBase == null ? Infinity : this.yaw - this.turnBase;
      if (Math.abs(d) < 1.5) this.headAngle = THREE.MathUtils.clamp(this.headAngle - d, -HEAD_TURN, HEAD_TURN);
      else this.turnBase = this.yaw;
      this.yaw = this.turnBase;
    }
    // + = il naso va verso la destra del paziente
    const raw = dt > 0 ? (this.headAngle - this.headLast) / dt : 0;
    this.headLast = this.headAngle;
    this.turnW = (this.turnW ?? 0) + (raw - (this.turnW ?? 0)) * (1 - Math.exp(-dt * 10));
    const w = Math.abs(this.turnW) < 1e-3 ? 0 : this.turnW;
    st.w = w;
    for (const [side, f] of Object.entries(this.flow)) {
      // velocità angolare dell'endolinfa rispetto al canale, attorno alla sua normale:
      // resta indietro, quindi -ω·n (+ = verso l'ampolla, cioè utriculipeta)
      const rel = -w * f.n.y;
      f.excite = THREE.MathUtils.clamp(rel / 2.2, -1, 1);
      st[side] = f.excite; // canale orizzontale: utriculipeta stimola, utriculifuga inibisce
      f.bend += (f.excite - f.bend) * (1 - Math.exp(-dt * 8));
      // cupola: si piega lungo il dotto, la base ferma sulla cresta
      const pos = f.mesh.geometry.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromArray(f.rest, i * 3);
        const h = (v.dot(f.u) / f.R + 1) / 2;
        v.addScaledVector(f.t, f.bend * 0.9 * f.R * h * h);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      f.mesh.geometry.computeVertexNormals();
      // gocce: avanzano lungo il canale e ricominciano dall'altro capo
      const L = f.lengths.at(-1);
      f.phase = (((f.phase + rel * dt * 0.35) % 1) + 1) % 1;
      f.drops.forEach((m, k) => {
        const s = ((f.phase + k / f.drops.length) % 1) * L;
        let i = 1;
        while (i < f.lengths.length - 1 && f.lengths[i] < s) i++;
        const a = (s - f.lengths[i - 1]) / (f.lengths[i] - f.lengths[i - 1] || 1);
        m.position.copy(f.line[i - 1]).lerp(f.line[i], a);
      });
    }
    this.turnState = st;
  }

  // parti degli ingrandimenti: stanno in `side`
  #sidePart(id, name, color, geos, opts, group = this.side) {
    const part = this.addPart(id, name, color, geos, opts);
    for (const m of part.meshes) group.add(m);
    this.sideIds.add(id);
    return part;
  }

  // ---- ingrandimento di un tratto di macula
  #maculaBlock() {
    const W = 0.46, DZ = 0.16;
    const pivot = V(0, 0.19, 0);
    const add = (part, kind, extra = {}) => part.meshes.forEach((mesh, i) => this.rig.push({ set: 'macula', mesh, rest: mesh.position.clone(), kind, pivot, ...(typeof extra === 'function' ? extra(i) : extra) }));
    const box = (w, h, d, y, x = 0) => new THREE.BoxGeometry(w, h, d).translate(x, y, 0);

    add(this.#sidePart('epi', 'epitelio sensoriale: cellule di sostegno', 0xe9b9a4, [box(W, 0.07, DZ, 0.135)], { opacity: 0.5 }, this.maculaGroup), 'still');
    const cols = 8, rows = [-0.04, 0.04];
    const cellsA = [], cellsB = [], bundles = [], kinos = [], bases = [];
    for (let i = 0; i < cols; i++)
      for (const z of rows) {
        const x = -0.2 + (i * 0.4) / (cols - 1);
        (i < cols / 2 ? cellsA : cellsB).push(ellipsoid([x, 0.139, z], [0.017, 0.029, 0.017], null, 14));
        const y0 = 0.17;
        bundles.push(merge([-0.009, 0, 0.009].map((dx, k) => stick(V(x + dx, y0, z), V(x + dx, y0 + 0.022 + k * 0.01, z), 0.0032, 6))));
        kinos.push(stick(V(x + 0.018, y0, z), V(x + 0.018, y0 + 0.053, z), 0.0036, 6));
        bases.push({ base: V(x, y0, z), flip: i < cols / 2 ? 0 : 1 });
      }
    add(this.#sidePart('cellsA', 'cellule capellute da un lato della striola', 0xd99a3a, cellsA, {}, this.maculaGroup), 'still');
    add(this.#sidePart('cellsB', "cellule capellute dall'altro lato della striola", 0xd99a3a, cellsB, {}, this.maculaGroup), 'still');
    add(this.#sidePart('bundles', 'stereociglia', 0xf0e2b8, bundles, {}, this.maculaGroup), 'bundle', (i) => bases[i]);
    add(this.#sidePart('kinoM', 'chinocigli', 0x8f3fb0, kinos, {}, this.maculaGroup), 'bundle', (i) => bases[i]);
    add(this.#sidePart('striola', 'striola', 0xa3262a, [box(0.012, 0.006, DZ + 0.004, 0.172)], {}, this.maculaGroup), 'still');
    add(this.#sidePart('gel', 'membrana otolitica', 0x9fd6e0, [box(W, 0.05, DZ, 0.215)], { opacity: 0.42 }, this.maculaGroup), 'gel');
    const rand = rng(7);
    const crystals = [];
    for (let i = 0; i < 150; i++) {
      const g = new THREE.OctahedronGeometry(0.0085 + rand() * 0.004);
      g.scale(1, 1.5, 1);
      g.rotateZ(rand() * 3).rotateX(rand() * 3);
      g.translate((rand() - 0.5) * (W - 0.02), 0.247 + rand() * 0.014, (rand() - 0.5) * (DZ - 0.02));
      crystals.push(g);
    }
    add(this.#sidePart('oto', 'otoconi: cristalli di carbonato di calcio', 0xf6f2e4, [merge(crystals)], {}, this.maculaGroup), 'gel');
    const y = 0.305;
    add(this.#sidePart('polIn', 'polarizzazione striolipeta: verso la striola', 0x8f3fb0, [
      merge([arrow(V(-0.2, y, 0), V(-0.035, y, 0), 0.006), arrow(V(0.2, y, 0), V(0.035, y, 0), 0.006)]),
    ], {}, this.maculaGroup), 'still');
    add(this.#sidePart('polOut', 'polarizzazione striolifuga: lontano dalla striola', 0x8f3fb0, [
      merge([arrow(V(-0.035, y, 0), V(-0.2, y, 0), 0.006), arrow(V(0.035, y, 0), V(0.2, y, 0), 0.006)]),
    ], {}, this.maculaGroup), 'still');
  }

  // ---- ingrandimento di due cellule capellute: tipo 1 a sinistra, tipo 2 a destra
  #hairCells() {
    const Y0 = 0.2, H = 0.3, YT = Y0 + H;
    const X1 = -0.19, X2 = 0.19;
    const flask = [[0, 0], [0.045, 0.008], [0.075, 0.05], [0.082, 0.1], [0.07, 0.155], [0.047, 0.2], [0.038, 0.24], [0.043, 0.275], [0.05, 0.296], [0, 0.3]];
    const column = [[0, 0], [0.04, 0.006], [0.055, 0.03], [0.058, 0.1], [0.058, 0.26], [0.053, 0.293], [0, 0.3]];
    this.#sidePart('cell1', 'cellula capelluta di tipo 1 (a fiasca)', 0xe2a94e, [lathe(flask, X1, Y0)], { opacity: 0.78 }, this.cellGroup);
    this.#sidePart('cell2', 'cellula capelluta di tipo 2 (cilindrica)', 0xdcb86a, [lathe(column, X2, Y0)], { opacity: 0.78 }, this.cellGroup);
    this.#sidePart('plate', 'piastra cuticolare', 0x8a6a3a, [X1, X2].map((x) => new THREE.CylinderGeometry(0.047, 0.047, 0.012, 24).translate(x, YT + 0.004, 0)), {}, this.cellGroup);

    const rods = [], rodRig = [], kino = [], kinoRig = [], tips = [], tipRig = [], ions = [];
    const yb = YT + 0.01;
    for (const x0 of [X1, X2]) {
      for (let k = 0; k < 5; k++)
        for (const dz of [-0.017, 0, 0.017]) {
          const x = x0 + (k - 2.5) * 0.0145, h = 0.055 + k * 0.023;
          rods.push(stick(V(x, yb, dz), V(x, yb + h, dz), 0.0056, 8));
          rodRig.push({ base: V(x, yb, dz) });
          if (k < 4) {
            tips.push(stick(V(x, yb + h - 0.002, dz), V(x + 0.0145, yb + h + 0.014, dz), 0.0017, 5));
            tipRig.push({ base: V(x, yb, dz) });
            if (dz === 0 || k % 2 === 0) ions.push(ellipsoid([x + 0.004, yb + h + 0.012, dz + 0.008], [0.0062, 0.0062, 0.0062], null, 8));
          }
        }
      const xk = x0 + 2.5 * 0.0145;
      kino.push(stick(V(xk, yb, 0), V(xk, yb + 0.19, 0), 0.0075, 8));
      kinoRig.push({ base: V(xk, yb, 0) });
      // ioni che scendono nel citosol
      for (const [dx, dy] of [[-0.01, -0.03], [0.012, -0.06], [-0.004, -0.1], [0.008, -0.14]]) ions.push(ellipsoid([x0 + dx, YT + dy, 0.03], [0.0062, 0.0062, 0.0062], null, 8));
    }
    const rig = (part, list) => part.meshes.forEach((mesh, i) => this.rig.push({ set: 'cell', mesh, rest: mesh.position.clone(), kind: 'cilium', base: list[i].base }));
    rig(this.#sidePart('stereo', 'stereociglia, disposte a scala', 0xf0e2b8, rods, {}, this.cellGroup), rodRig);
    rig(this.#sidePart('kino', 'chinociglio', 0x8f3fb0, kino, {}, this.cellGroup), kinoRig);
    rig(this.#sidePart('tips', 'tip links', 0x2a2520, tips, {}, this.cellGroup), tipRig);
    this.#sidePart('kIons', 'ioni potassio che entrano', 0x2f6fe0, [merge(ions)], {}, this.cellGroup);

    const ca = [], rib = [], glu = [];
    const rand = rng(11);
    for (const [x0, r] of [[X1, 0.07], [X2, 0.054]]) {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        ca.push(ellipsoid([x0 + Math.cos(a) * r, Y0 + 0.045, Math.sin(a) * r], [0.0085, 0.0085, 0.0085], null, 8));
      }
      rib.push(ellipsoid([x0, Y0 + 0.04, 0.012], [0.012, 0.02, 0.012], null, 12));
      for (let i = 0; i < 12; i++) {
        const a = rand() * 6.28, b = (rand() - 0.5) * 2.4;
        rib.push(ellipsoid([x0 + Math.cos(a) * Math.cos(b) * 0.021, Y0 + 0.04 + Math.sin(b) * 0.027, 0.012 + Math.sin(a) * Math.cos(b) * 0.021], [0.0055, 0.0055, 0.0055], null, 6));
      }
      for (let i = 0; i < 7; i++) glu.push(ellipsoid([x0 + (rand() - 0.5) * 0.05, Y0 - 0.006 - rand() * 0.006, (rand() - 0.5) * 0.05], [0.005, 0.005, 0.005], null, 6));
    }
    this.#sidePart('caCh', 'canali voltaggio-dipendenti per il calcio', 0xe07a1f, [merge(ca)], {}, this.cellGroup);
    this.#sidePart('ribbon', 'corpo sinaptico, con le sue vescicole', 0x4a3a30, [merge(rib)], {}, this.cellGroup);
    this.#sidePart('glu', 'glutammato', 0x1f9d57, [merge(glu)], {}, this.cellGroup);

    const calyx = [[0.014, -0.02], [0.056, -0.011], [0.089, 0.048], [0.096, 0.1], [0.084, 0.158], [0.06, 0.205]];
    this.#sidePart('aff1', 'fibra afferente a calice (ganglio dello Scarpa)', NERVE, [
      lathe(calyx, X1, Y0),
      taperTube([V(X1, Y0 - 0.018, 0), V(X1 - 0.006, 0.13, 0), V(X1 - 0.03, 0.085, 0), V(X1 - 0.05, 0.045, 0)], [0.015, 0.014, 0.013, 0.013], { seg: 20 }),
    ], { double: true, opacity: 0.62 }, this.cellGroup);
    this.#sidePart('aff2', 'fibra afferente con contatto a bottone (ganglio dello Scarpa)', NERVE, [
      ellipsoid([X2 - 0.018, Y0 - 0.004, 0], [0.022, 0.012, 0.022], null, 14),
      taperTube([V(X2 - 0.018, Y0 - 0.008, 0), V(X2 - 0.022, 0.14, 0), V(X2 - 0.04, 0.09, 0), V(X2 - 0.055, 0.045, 0)], [0.009, 0.009, 0.01, 0.011], { seg: 20 }),
    ], {}, this.cellGroup);
    this.#sidePart('eff1', 'fibra efferente: sinapsi asso-assonica', 0x7a4fd0, [
      ellipsoid([X1 + 0.012, 0.122, 0.012], [0.015, 0.013, 0.015], null, 12),
      taperTube([V(X1 + 0.016, 0.118, 0.012), V(X1 + 0.04, 0.09, 0.012), V(X1 + 0.055, 0.045, 0.012)], 0.0075, { seg: 14 }),
    ], {}, this.cellGroup);
    this.#sidePart('eff2', 'fibra efferente: sinapsi asso-somatica', 0x7a4fd0, [
      ellipsoid([X2 + 0.058, Y0 + 0.03, 0.01], [0.014, 0.017, 0.014], null, 12),
      taperTube([V(X2 + 0.064, Y0 + 0.02, 0.01), V(X2 + 0.072, 0.13, 0.01), V(X2 + 0.068, 0.045, 0.01)], 0.0075, { seg: 14 }),
    ], {}, this.cellGroup);
    const pillar = [[0, 0], [0.05, 0.004], [0.06, 0.03], [0.045, 0.12], [0.05, 0.25], [0.06, 0.3], [0.056, 0.31], [0, 0.312]];
    this.#sidePart('support', 'cellule di sostegno', 0xe9b9a4, [lathe(pillar, 0, Y0), lathe(pillar, -0.38, Y0), lathe(pillar, 0.38, Y0)], { opacity: 0.38 }, this.cellGroup);

    this.addLink('fire1', [V(X1, Y0 - 0.02, 0.03), V(X1 - 0.008, 0.13, 0.03), V(X1 - 0.032, 0.085, 0.03), V(X1 - 0.052, 0.05, 0.03)], { r: 0.005 });
    this.addLink('fire2', [V(X2 - 0.018, Y0 - 0.012, 0.025), V(X2 - 0.024, 0.14, 0.025), V(X2 - 0.042, 0.09, 0.025), V(X2 - 0.056, 0.05, 0.025)], { r: 0.005 });
    for (const id of ['fire1', 'fire2']) this.cellGroup.add(this.links.get(id).group);
  }

  // name: una delle inquadrature di FOCUS
  setFocus(name, now = false) {
    const f = FOCUS[name];
    const t = this.focusTarget;
    t.k = f.k;
    t.rod = f.rod;
    t.at.copy(P(...f.at));
    t.to.set(...f.to);
    t.q.setFromEuler(new THREE.Euler(f.rot[0], f.rot[1], 0, 'XYZ'));
    if (now) {
      this.focusNow.q.copy(t.q);
      this.focusNow.k = t.k;
      this.focusNow.rod = t.rod;
      this.focusNow.pos.copy(t.at).applyQuaternion(t.q).multiplyScalar(-t.k).add(t.to);
    }
  }

  // organ: 0 macula dell'utricolo (orizzontale), 1 del sacculo (verticale);
  // shift: spostamento della membrana otolitica (-1…1); bend: piegatura delle
  // stereociglia verso il chinociglio (+1) o in senso opposto (-1);
  // lin: 'h' | 'v' oscillazione lineare; turn: 'lat' | 'ant' | 'post' oscillazione
  // angolare nel piano di quel canale.
  setScene(scene = {}) {
    const s = { organ: 0, shift: 0, bend: 0, lin: null, turn: null, ...scene };
    Object.assign(this.stateTarget, { organ: s.organ, shift: s.shift, bend: s.bend, lin: s.lin ? 1 : 0, turn: s.turn ? 1 : 0 });
    if (s.lin) this.motion.dir.copy(s.lin === 'h' ? D(0, -1, 0) : D(0, 0, 1));
    if (s.turn) {
      const c = CANALS[s.turn];
      this.motion.axis.copy(D(...c.n));
      this.motion.pivot.copy(P(...c.c));
    }
  }

  reset() {
    super.reset();
    this.setScene();
    this.setFocus('lab');
    this.setTurn(false);
  }

  #pose() {
    const s = this.state;
    // macula: l'utricolo è orizzontale, il sacculo verticale
    const qOrg = new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), (s.organ * Math.PI) / 2);
    const lift = V(0, 0.06 * s.organ, 0);
    this.maculaGroup.scale.setScalar(1.12 - 0.2 * s.organ);
    const slide = V(0.034 * s.shift, 0, 0);
    const q = new THREE.Quaternion(), qf = new THREE.Quaternion(), p = new THREE.Vector3();
    const zAxis = V(0, 0, 1), yAxis = V(0, 1, 0);
    for (const r of this.rig) {
      if (r.set === 'macula') {
        p.copy(r.rest);
        q.identity();
        if (r.kind === 'gel') p.add(slide);
        else if (r.kind === 'bundle') {
          // chinociglio verso la striola nell'utricolo, in direzione opposta nel sacculo
          qf.setFromAxisAngle(yAxis, Math.PI * (r.flip + s.organ));
          q.setFromAxisAngle(zAxis, -0.62 * s.shift).multiply(qf);
          p.sub(r.base).applyQuaternion(q).add(r.base);
        }
        r.mesh.position.copy(p.sub(r.pivot).applyQuaternion(qOrg).add(r.pivot).add(lift));
        r.mesh.quaternion.copy(qOrg).multiply(q);
      } else {
        q.setFromAxisAngle(zAxis, -0.3 * s.bend);
        r.mesh.position.copy(p.copy(r.rest).sub(r.base).applyQuaternion(q).add(r.base));
        r.mesh.quaternion.copy(q);
      }
    }
  }

  update(dt, camera, realDt = dt) {
    const step = Math.min(realDt, 0.5);
    const k = 1 - Math.exp(-step * 5);
    this.clock += step;
    for (const key of Object.keys(this.state)) {
      this.state[key] += (this.stateTarget[key] - this.state[key]) * k;
      if (Math.abs(this.stateTarget[key] - this.state[key]) < 1e-4) this.state[key] = this.stateTarget[key];
    }
    const f = this.focusNow, t = this.focusTarget;
    f.q.slerp(t.q, k);
    f.k += (t.k - f.k) * k;
    f.rod += (t.rod - f.rod) * k;
    f.pos.lerp(t.at.clone().applyQuaternion(t.q).multiplyScalar(-t.k).add(t.to), k);
    // oscillazione del labirinto: lineare o attorno all'asse di un canale; prima ancora
    // la testa che gira attorno alla propria verticale (vedi setTurn)
    this.#turn(step);
    const wave = Math.sin(this.clock * Math.PI * 2 * 0.55);
    const qm = new THREE.Quaternion().setFromAxisAngle(this.motion.axis, 0.2 * this.state.turn * wave);
    const qh = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), this.headAngle ?? 0);
    const pm = this.motion.pivot;
    const local = HEAD_PIVOT.clone().sub(HEAD_PIVOT.clone().applyQuaternion(qh)).sub(pm).applyQuaternion(qm).add(pm);
    local.addScaledVector(this.motion.dir, 0.045 * this.state.lin * wave);
    this.inner.quaternion.copy(f.q).multiply(qm).multiply(qh);
    this.inner.position.copy(local.applyQuaternion(f.q).multiplyScalar(f.k).add(f.pos));
    this.inner.scale.setScalar(f.k);
    this.rod.scale.y = Math.max(0.01, f.rod - 0.02);
    this.rod.position.set(0, 0.02 + (f.rod - 0.02) / 2, 0);
    this.#pose();
    super.update(dt, camera, realDt);
    // le etichette delle parti degli ingrandimenti seguono `side`, non `inner`
    this.side.updateWorldMatrix(true, true);
    for (const [id, label] of this.labels) {
      if (!label.visible) continue;
      // le etichette restano davanti alle parti (troika può rigenerare il materiale)
      for (const mat of [].concat(label.material)) if (mat.depthTest) mat.depthTest = false;
      if (!this.sideIds.has(id)) continue;
      const part = this.parts.get(id);
      const m = part.meshes[0];
      label.position.copy(m.position);
      label.position.y += (label.userData.lift ??= Math.max(0.02, part.top - part.center.y + 0.012));
      label.position.applyMatrix4(m.parent.matrixWorld);
      this.overlay.worldToLocal(label.position);
      label.userData.lead.visible = false; // qui la posizione è propria: niente linea di richiamo
    }
  }
}
