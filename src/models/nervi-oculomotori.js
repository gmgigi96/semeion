// Modello dei nervi oculomotore (III), trocleare (IV) e abducente (VI).
//
// MESH REALI (BodyParts3D, public/meshes/nervi-oculomotori.glb, vedi
// meshes/nervi-oculomotori.json): mesencefalo con i peduncoli, ponte, parte alta
// del bulbo, collicoli, acquedotto di Silvio; sfenoide e ossa dell'orbita;
// arterie basilare, cerebrale posteriore, cerebellare superiore e carotide
// interna; sclera, cornea, iride, nervo ottico; i sei muscoli estrinseci,
// l'elevatore della palpebra, la troclea e l'anello tendineo comune (di Zinn);
// rami superiore e inferiore dell'oculomotore, ganglio ciliare, nervi ciliari
// brevi; nervo trocleare dal seno cavernoso all'obliquo superiore.
//
// RICOSTRUITO A MANO nella stessa terna, agganciato alle mesh reali:
// - nuclei (oculomotore, Edinger-Westphal, trocleare, abducente) e fibre
//   radicolari dentro il tronco;
// - tronco dell'oculomotore dalla fossetta interpeduncolare al punto in cui
//   comincia la mesh reale del ramo inferiore (che contiene il tratto comune);
// - tratto cisternale del trocleare, dall'emergenza dorsale sotto il collicolo
//   inferiore, attorno al mesencefalo, fino alla mesh reale. (La mesh reale di
//   BodyParts3D prosegue all'indietro ma finisce dentro la mesh del ponte:
//   quel tratto è stato scartato e ridisegnato sulla superficie del tronco.);
// - nervo abducente per intero, dal solco bulbo-pontino al retto laterale;
// - seno cavernoso (involucro), pupilla e repere delle ore 12 sul bulbo.
//
// FONTI usate per posizione, decorso e rapporti delle parti ricostruite:
// - H. Gray, Anatomy of the Human Body, 20ª ed. (1918), "The Oculomotor Nerve",
//   "The Trochlear Nerve", "The Abducent Nerve" e fig. 786 (sezione del seno
//   cavernoso): nucleo del III nel pavimento dell'acquedotto, emergenza dal
//   solco oculomotore tra a. cerebellare superiore e cerebrale posteriore;
//   nella parete laterale del seno, dall'alto in basso, III, IV, V1, con il VI
//   lateralmente alla carotide interna; il IV incrocia il III; nucleo del VI
//   sotto il collicolo faciale, fibre in basso e in avanti nel ponte, ingresso
//   nel retto laterale dalla faccia oculare.
//   https://www.hithera.com/grays-anatomy/neurology-sense-organs/index-8/index-8-2/oculomotor_nerve/
//   https://www.hithera.com/index-8/index-8-2/trochlear_nerve/
//   https://www.hithera.com/?p=2242
// - StatPearls (NCBI Bookshelf): "Neuroanatomy, Cranial Nerve 3 (Oculomotor)"
//   https://www.ncbi.nlm.nih.gov/books/NBK537126/ e voce sui muscoli estrinseci
//   https://www.ncbi.nlm.nih.gov/books/NBK565850/ (innervazione e azioni dei muscoli).
// - Yousry I. et al., "Trochlear nerve: MR anatomy", Radiology 2002
//   https://pubs.rsna.org/doi/full/10.1148/radiol.2231010612 ; Joo W., Rhoton
//   A.L., "Microsurgical anatomy of the trochlear nerve", Clin Anat 2015
//   (doi:10.1002/ca.22602): nucleo all'altezza del collicolo inferiore,
//   decussazione nel velo midollare superiore, emergenza sotto il collicolo
//   inferiore, decorso attorno al mesencefalo a contatto con l'a. cerebellare superiore.
// - EyeWiki (American Academy of Ophthalmology), "Acquired Oculomotor Nerve
//   Palsy" https://eyewiki.org/Acquired_Oculomotor_Nerve_Palsy e "Cranial Nerve
//   4 Palsy" https://eyewiki.org/Cranial_Nerve_4_Palsy : posizione dell'occhio
//   nelle paralisi (pagina 5 del capitolo).
//
// Coordinate del modello: x laterale, y craniale, z anteriore.
// NOTA SUI LATI: tools/mesh.mjs porta le mesh in una terna (destra, alto,
// avanti) che è sinistrorsa, quindi sullo schermo il corpo appare specchiato:
// la mesh "Right ..." di BodyParts3D finisce a x > 0 e, guardando il modello
// da davanti, sta alla destra di chi guarda, dove in un paziente vero c'è il
// lato sinistro. Qui la lateralità conta (decussazione del IV, paralisi di un
// lato), perciò in questo modello il lato DESTRO è x < 0 (mesh "Left ..."
// specchiata) e il SINISTRO è x > 0: così da davanti l'occhio destro sta a
// sinistra di chi guarda, come in un paziente. I punti delle parti ricostruite sono scritti in millimetri nella
// terna di BodyParts3D (distanza dal piano mediano, y, z) e convertiti da `mm`.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0075; // unità per mm (come in meshes/nervi-oculomotori.json)
const mm = ([l, y, z]) => new THREE.Vector3(l * S, (z - 1470) * S, -(y + 114) * S);
const tube = (pts, r, opts) => taperTube(pts.map(mm), Array.isArray(r) ? r.map((v) => v * S) : r * S, opts);
// ellissoide: centro in mm, semiassi in mm (laterale, verticale, antero-posteriore)
const blob = (c, r, rot) => {
  const g = ellipsoid([0, 0, 0], [r[0] * S, r[1] * S, r[2] * S], rot);
  const p = mm(c);
  g.translate(p.x, p.y, p.z);
  return g;
};

const N3 = 0xe0a020, N4 = 0x2f9a57, N6 = 0x2f6fd0, PARA = 0x8e5bb5;
const MUSCLE = 0xb5524a, BONE = 0xe9dfc8, STEM = 0xe3cdb6, ARTERY = 0xc23b3b;

const SIDES = { R: 'di destra', L: 'di sinistra' };
const sided = (id, name, color, opts) => Object.fromEntries(
  Object.entries(SIDES).map(([s, lato]) => [id + s, [`${name} ${lato}`, color, opts]])
);

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.55 }],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.55 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.55 }],
  scoll: ['collicoli superiori', 0xd3a98a],
  icoll: ['collicoli inferiori', 0xc48f6e],
  aqueduct: ['acquedotto di Silvio', 0x3f9ec4],
  sphenoid: ['osso sfenoide (fessura orbitaria superiore)', BONE, { ghost: true, opacity: 0.22 }],
  orbit: ["ossa dell'orbita", BONE, { ghost: true, opacity: 0.1 }],
  basilar: ['arteria basilare', ARTERY],
  pca: ['arteria cerebrale posteriore', ARTERY],
  sca: ['arteria cerebellare superiore', 0xd9695f],
  ica: ['arteria carotide interna', ARTERY],
  ...sided('sclera', 'bulbo oculare', 0xf3efe6),
  ...sided('cornea', 'cornea', 0xcfe6f2, { opacity: 0.35 }),
  ...sided('iris', 'iride', 0x4f7896),
  ...sided('optic', 'nervo ottico', 0xe9dcae),
  ...sided('rs', 'muscolo retto superiore', MUSCLE),
  ...sided('ri', 'muscolo retto inferiore', MUSCLE),
  ...sided('rm', 'muscolo retto mediale', MUSCLE),
  ...sided('rl', 'muscolo retto laterale', MUSCLE),
  ...sided('os', 'muscolo obliquo superiore', 0xc9705f),
  ...sided('oi', 'muscolo obliquo inferiore', 0xc9705f),
  ...sided('lev', 'muscolo elevatore della palpebra superiore', 0xd99a86),
  ...sided('trochlea', "troclea dell'obliquo superiore", 0x9fc7d6),
  ...sided('zinn', 'anello tendineo dello Zinn', 0xf1ead8),
  ...sided('n3sup', "ramo superiore dell'oculomotore", N3),
  ...sided('n3inf', "ramo inferiore dell'oculomotore", N3),
  ...sided('n4', 'nervo trocleare (IV)', N4),
  ...sided('cg', 'ganglio ciliare', PARA),
  ...sided('scn', 'nervi ciliari brevi', PARA),
};

// Parti che ruotano rigidamente col bulbo e parti che si deformano con lui
// (muscoli e nervo ottico: l'inserzione segue il bulbo, l'origine resta ferma).
const RIGID = ['sclera', 'cornea', 'iris', 'pupil', 'mark'];
const SOFT = ['rs', 'ri', 'rm', 'rl', 'os', 'oi', 'optic'];
const RAD = Math.PI / 180;
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export class OculomotorModel extends AnatomyModel {
  #eyes = {};

  constructor() {
    super({ tilt: -0.5 });
    // Questo modello ha già i lati scambiati a mano (vedi nota in testa): il
    // ribaltamento del motore lo riporterebbe speculare, quindi qui è spento.
    this.mirror.scale.x = 1;
    this.addStand({ radius: 0.15, z: 0, rod: [0, 0.02, 0.3, -0.03] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('nervi-oculomotori.glb', REAL);
    this.#reconstructed();
    for (const side of ['R', 'L']) this.#rig(side);
  }

  // una parte per lato: `geo` è disegnata a x > 0, cioè sul lato SINISTRO (vedi nota sui lati)
  #pair(id, name, color, geo, opts) {
    const other = mirror(geo); // prima di addPart, che ricentra la geometria
    this.addPart(`${id}L`, `${name} ${SIDES.L}`, color, [geo], opts);
    this.addPart(`${id}R`, `${name} ${SIDES.R}`, color, [other], opts);
  }

  #reconstructed() {
    const tilt = [0.38, 0, 0]; // i nuclei seguono l'inclinazione dell'acquedotto

    // --- nuclei -----------------------------------------------------------
    // III: colonna paramediana ventrale all'acquedotto, all'altezza del collicolo superiore
    this.#pair('nuc3', "nucleo motore somatico dell'oculomotore", 0xc98510, blob([1.6, -79.8, 1539.5], [1.3, 3.8, 1.5], tilt));
    // Edinger-Westphal: dorsale e rostrale al nucleo somatico
    this.#pair('ew', 'nucleo di Edinger-Westphal', PARA, blob([0.85, -79.3, 1543.2], [0.7, 1.9, 0.75], tilt));
    // IV: all'altezza del collicolo inferiore, in coda al nucleo del III
    this.#pair('nuc4', 'nucleo del nervo trocleare', 0x1f7a42, blob([1.6, -77.6, 1532.6], [1.05, 1.3, 1.05]));
    // VI: ponte inferiore, sotto il pavimento del quarto ventricolo (collicolo del faciale)
    this.#pair('nuc6', 'nucleo del nervo abducente', 0x2456a8, blob([2.6, -73.7, 1509], [1.4, 1.7, 1.3]));

    // --- oculomotore ------------------------------------------------------
    // fibre radicolari: dal nucleo in avanti, attraverso il tegmento, fino al solco oculomotore
    this.#pair('f3', "fibre radicolari dell'oculomotore", N3,
      tube([[1.9, -81.2, 1539.5], [3.6, -86, 1537], [3.9, -90.5, 1534], [2.9, -93.6, 1531.6]], 0.65, { caps: false }));
    // tronco: tra a. cerebrale posteriore (sopra) e cerebellare superiore (sotto), poi
    // parete laterale del seno cavernoso in alto, lateralmente al sifone carotideo
    this.#pair('n3', 'nervo oculomotore (III)', N3,
      tube([[2.9, -93.4, 1531.6], [4.4, -97.3, 1530.4], [7.8, -101, 1529.9], [11.8, -104, 1530.3], [15.6, -107, 1531],
        [17.3, -110, 1531.2], [17.2, -112.8, 1531], [15.8, -115, 1530.5], [14.85, -116.6, 1529.7]], 1.05, { seg: 60 }));

    // --- trocleare --------------------------------------------------------
    // fibre di un nervo: nascono dal nucleo del lato OPPOSTO, girano attorno al grigio
    // periacqueduttale e incrociano nel velo midollare superiore
    this.#pair('f4', 'fibre crociate del nervo trocleare', N4,
      tube([[-1.6, -77.2, 1532.4], [-2.7, -74.5, 1531], [-2.2, -71, 1529.6], [0, -68.6, 1528.6], [1.8, -67.2, 1528.1], [2.9, -66.3, 1527.9]], 0.42, { caps: false }));
    // tratto cisternale: dal dorso, sotto il collicolo inferiore, attorno al mesencefalo
    this.#pair('n4c', 'nervo trocleare (IV), tratto attorno al mesencefalo', N4,
      tube([[2.9, -66.2, 1527.9], [6, -68.3, 1527.9], [9.8, -72.2, 1527.9], [14.9, -75.5, 1527.8], [18.6, -80, 1527.6],
        [19.5, -85, 1527.2], [18.9, -89.5, 1526.7], [17.4, -93, 1526.3], [16.1, -96.5, 1526], [15.6, -100.2, 1525.8]], 0.5, { seg: 70 }));

    // --- abducente --------------------------------------------------------
    this.#pair('f6', "fibre radicolari dell'abducente", N6,
      tube([[2.6, -74.6, 1508.6], [3.2, -79, 1506.3], [4.2, -84, 1503.8], [4.6, -86.9, 1502.6]], 0.55, { caps: false }));
    // dal solco bulbo-pontino in alto e in avanti, poi nel seno cavernoso lateralmente
    // alla carotide (sotto IV e V1), anello dello Zinn, faccia oculare del retto laterale
    this.#pair('n6', 'nervo abducente (VI)', N6,
      tube([[4.6, -86.8, 1502.6], [7, -90.8, 1505.2], [10.6, -93.6, 1509.5], [12.6, -94.4, 1513.5], [14.6, -94.6, 1516.6],
        [17, -96.8, 1519.2], [17.7, -101, 1520.8], [17.8, -108, 1521.8], [18, -114, 1524.5], [18.3, -119, 1527.2], [19, -121.5, 1527.4]], 0.75, { seg: 70 }));
    this.#pair('n6o', "nervo abducente (VI) nell'orbita", N6,
      tube([[18.1, -117.5, 1526.5], [18.3, -119, 1527.2], [20.3, -124.5, 1527.3], [24, -129.5, 1526.5], [28.2, -134, 1525.8], [30.2, -136, 1525.6]],
        [0.75, 0.75, 0.55], { seg: 40 }));

    // --- contesto ---------------------------------------------------------
    this.#pair('cav', 'seno cavernoso', 0x3557b7, blob([14.5, -106.5, 1524.5], [5.6, 7.2, 10.5]), { ghost: true, opacity: 0.2 });

    // pupilla e repere delle ore 12 (per vedere la torsione) sul bulbo
    const iris = this.parts.get('irisL');
    const eye = this.parts.get('scleraL');
    const R = eye.meshes[0].userData.size.x / 2;
    this.#pair('pupil', 'pupilla', 0x141414,
      ellipsoid([iris.center.x, iris.center.y, iris.center.z + iris.meshes[0].userData.size.z / 2 - 0.001], [0.016, 0.016, 0.0035]));
    this.#pair('mark', 'repere delle ore 12 sul bulbo', 0x9c3d1f,
      ellipsoid([eye.center.x, eye.center.y + R * 0.66, eye.center.z + R * 0.74], [0.007, 0.006, 0.006]));
  }

  // Prepara la rotazione di un occhio: centro del bulbo, parti rigide, pesi dei vertici.
  #rig(side) {
    const sclera = this.parts.get(`sclera${side}`);
    const C = sclera.center.clone();
    const R = sclera.meshes[0].userData.size.x / 2;
    const meshes = (ids) => ids.flatMap((id) => this.parts.get(id + side).meshes);
    const rigid = meshes(RIGID).map((m) => ({ m, home: m.position.clone() }));
    const soft = meshes(SOFT).map((m) => {
      const attr = m.geometry.attributes.position;
      const rest = attr.array.slice();
      const off = m.position.clone().sub(C); // vertice rispetto al centro del bulbo
      const w = new Float32Array(attr.count);
      for (let i = 0; i < attr.count; i++) {
        const d = Math.hypot(rest[i * 3] + off.x, rest[i * 3 + 1] + off.y, rest[i * 3 + 2] + off.z);
        w[i] = 1 - smooth(R * 1.1, R * 1.75, d);
      }
      return { m, attr, rest, off, w };
    });
    this.#eyes[side] = { C, rigid, soft, cur: new THREE.Vector3(), target: new THREE.Vector3(), applied: new THREE.Vector3() };
  }

  // Posizione dell'occhio in gradi: abduzione (+) / adduzione (-), elevazione (+) /
  // abbassamento (-), intorsione (+) / estorsione (-).
  setGaze(side, { abd = 0, elev = 0, intor = 0 } = {}) {
    const eye = this.#eyes[side];
    if (!eye) return;
    const s = side === 'R' ? -1 : 1; // l'occhio destro sta a x < 0
    eye.target.set(-elev * RAD, s * abd * RAD, s * intor * RAD);
  }

  reset() {
    super.reset();
    this.setGaze('R');
    this.setGaze('L');
  }

  #apply(eye) {
    const angle = eye.cur.length();
    const axis = angle > 1e-6 ? eye.cur.clone().divideScalar(angle) : new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    for (const { m, home } of eye.rigid) {
      m.position.copy(home).sub(eye.C).applyQuaternion(q).add(eye.C);
      m.quaternion.copy(q);
    }
    const v = new THREE.Vector3();
    const qw = new THREE.Quaternion();
    for (const { m, attr, rest, off, w } of eye.soft) {
      const out = attr.array;
      for (let i = 0; i < w.length; i++) {
        const k = i * 3;
        if (w[i] <= 0) {
          out[k] = rest[k]; out[k + 1] = rest[k + 1]; out[k + 2] = rest[k + 2];
          continue;
        }
        v.set(rest[k] + off.x, rest[k + 1] + off.y, rest[k + 2] + off.z).applyQuaternion(qw.setFromAxisAngle(axis, angle * w[i]));
        out[k] = v.x - off.x; out[k + 1] = v.y - off.y; out[k + 2] = v.z - off.z;
      }
      attr.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
    eye.applied.copy(eye.cur);
  }

  update(dt, camera, realDt = dt) {
    const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 6);
    for (const eye of Object.values(this.#eyes)) {
      eye.cur.lerp(eye.target, k);
      if (eye.cur.distanceTo(eye.target) < 1e-4) eye.cur.copy(eye.target);
      if (eye.cur.distanceTo(eye.applied) > 1e-5) this.#apply(eye);
    }
    super.update(dt, camera, realDt);
  }
}
