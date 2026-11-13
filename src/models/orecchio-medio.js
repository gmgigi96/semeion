// Orecchio medio destro: cassa del timpano con la catena degli ossicini e i suoi
// due muscoli, tuba uditiva con le lamine cartilaginee e i tre muscoli che la
// aprono. Le coordinate sono quelle di Z-Anatomy portate nella terna dei
// modelli da tools/mesh.mjs (vedi meshes/orecchio-medio.json): ogni punto
// ricostruito a mano è scritto in millimetri della sorgente e convertito con P().
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0, lato destro): martello (diviso in testa e
// manico), incudine (corpo con processo breve, processo lungo), staffa, membrana
// del timpano, coclea, vestibolo con i canali semicircolari, nervo faciale nel
// tratto intratemporale (la mesh comprende la corda del timpano), osso
// temporale, sfenoide, rinofaringe, palato molle.
//
// NON USATE, benché presenti: "Auditory tube" (un cono schematico orizzontale
// che finisce 15 mm medialmente alla cassa, dentro l'osso, e che prolungato
// attraverserebbe la coclea) e "Chorda tympani" (non raggiunge la cassa).
//
// RICOSTRUITO A MANO dentro l'anatomia reale:
//  - Tuba uditiva: dall'apertura nella parete anteriore della cassa (davanti al
//    promontorio, che è il giro basale della coclea reale) al margine posteriore
//    della lamina mediale del processo pterigoideo reale, sotto la grande ala
//    reale. Lunghezza 38 mm, parte ossea 13 mm e cartilaginea 25 mm, istmo al
//    confine, lume più largo all'ostio faringeo; cartilagine a uncino con lamina
//    mediale estesa e lamina laterale breve.
//  - Tensore del velo palatino (dalla lamina laterale e dalla base cranica
//    all'uncino pterigoideo reale, attorno al quale piega verso il palato),
//    elevatore del velo palatino (dalla faccia inferiore della rocca, sotto il
//    pavimento della tuba, al palato molle reale), salpingofaringeo.
//  - Tensore del timpano (sopra la parte ossea della tuba, piega sul processo
//    cocleariforme e raggiunge la parte alta del manico del martello reale),
//    stapedio con l'eminenza piramidale (davanti al tratto mastoideo del faciale
//    reale, tendine al collo della staffa reale).
//  - Finestra ovale (cornice attorno alla platina della staffa reale: 3,4 x 2 mm)
//    e finestra rotonda (sotto e dietro la ovale, sull'inizio del giro basale
//    della coclea reale).
//
// FONTI LETTE (voci di Wikipedia in inglese, in gran parte derivate dal testo
// di pubblico dominio di Gray, Anatomy of the Human Body, 20ª ed., 1918):
//  - Eustachian tube, https://en.wikipedia.org/wiki/Eustachian_tube
//    (35 mm; parte ossea 12 mm, cartilaginea 24 mm; istmo; cartilagine a uncino;
//    solco che finisce a metà della lamina pterigoidea mediale)
//  - Tensor veli palatini muscle, https://en.wikipedia.org/wiki/Tensor_veli_palatini_muscle
//    (fossa scafoidea, spina dello sfenoide, parete della tuba; tendine attorno all'uncino)
//  - Levator veli palatini, https://en.wikipedia.org/wiki/Levator_veli_palatini
//    (faccia inferiore della rocca e cartilagine della tuba; terzo medio del palato molle)
//  - Tensor tympani muscle, https://en.wikipedia.org/wiki/Tensor_tympani_muscle
//    (canale sopra la parte ossea della tuba; piega sul processo cocleariforme; manico del martello)
//  - Stapedius muscle, https://en.wikipedia.org/wiki/Stapedius_muscle
//    (apice dell'eminenza piramidale; collo della staffa)
//  - Tympanic cavity, https://en.wikipedia.org/wiki/Tympanic_cavity
//    (orifizi del semicanale del tensore e della tuba nella parete anteriore)
//  - Round window, https://en.wikipedia.org/wiki/Round_window
//    (sotto e un poco dietro la finestra ovale, separata dal promontorio)
//  - Middle ear, https://en.wikipedia.org/wiki/Middle_ear
//    (leva del martello 1,3; tendine del tensore alla parte alta e mediale del manico)
// Non raggiungibili in automatico: Gray su Wikisource (404) e Bartleby (403),
// StatPearls/NCBI (controllo del browser).
//
// STIMATO, senza una fonte letta: l'asse di rotazione di martello e incudine
// (dal processo breve dell'incudine al collo del martello: su queste mesh dà un
// rapporto tra i bracci di 1,15), la posizione esatta del processo cocleariforme
// e dell'eminenza piramidale, i calibri dei muscoli, l'inclinazione della tuba
// (qui circa 20° sull'orizzontale, vincolata dalle ossa reali). I movimenti di
// ossicini e membrana sono esagerati di proposito, per essere visibili.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.014;
const O = [-24.5, -13, 1539];
// millimetri della sorgente (x sinistra, y dietro, z alto) -> coordinate del modello
const P = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const D = (x, y, z) => V(-x, z, -y).normalize();
const mm = (list) => list.map((r) => r * S);

const BONE = 0xe9dfc8;

// Il modello intero: `HOME` (mm) sta sopra il centro della base, alla quota
// HOME_Y, con il modello ingrandito HOME_K (spostamento fisso di `inner`).
const HOME = [-28, -11, 1565];
const HOME_Y = 0.3;
const HOME_K = 1.01;
// Primi piani del motore (vedi AnatomyModel.zoomTo): la tuba, la cassa del timpano.
// `wide` non ingrandisce: serve a ritagliare al volume della pagina ciò che del
// modello intero ne uscirebbe (rinofaringe, palato, labirinto).
const at = (x, y, z) => P(x, y, z).toArray();
export const FOCUS = {
  wide: { at: at(...HOME), scale: 1, height: 0.27 },
  tube: { at: at(-31, -9, 1574), scale: 1.3, height: 0.3 },
  ear: { at: at(-44.5, 3.5, 1580), scale: 2.2, height: 0.3 },
  // membrana e martello da vicino, per vederli spinti dalla pressione
  drum: { at: at(-46.5, 4.5, 1579.5), scale: 2.9, height: 0.32, stand: false },
};

// Superficie ottenuta trascinando un profilo chiuso lungo una curva. `profile(u)`
// restituisce i punti [a, b] della sezione: a verso il lato postero-mediale della
// tuba (prodotto tra tangente e verticale), b verso l'alto.
function sweep(pts, profile, seg = 44) {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const up = V(0, 1, 0);
  const pos = [];
  const idx = [];
  let n = 0;
  const ends = [];
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const side = new THREE.Vector3().crossVectors(t, up).normalize();
    const top = new THREE.Vector3().crossVectors(side, t).normalize();
    const ring = profile(u);
    n = ring.length;
    const c = V(0, 0, 0);
    for (const [a, b] of ring) {
      const q = p.clone().addScaledVector(side, a * S).addScaledVector(top, b * S);
      pos.push(q.x, q.y, q.z);
      c.add(q);
    }
    if (i === 0 || i === seg) ends.push(c.multiplyScalar(1 / n));
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < n; j++) {
      const a = i * n + j, b = i * n + ((j + 1) % n);
      idx.push(a, a + n, b, b, a + n, b + n);
    }
  // chiusure alle estremità
  ends.forEach((c, e) => {
    const ci = pos.length / 3;
    pos.push(c.x, c.y, c.z);
    const base = e ? seg * n : 0;
    for (let j = 0; j < n; j++) idx.push(ci, base + j, base + ((j + 1) % n));
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.userData.curve = curve;
  return g;
}

// Anello ellittico (semiassi ra, rb in mm lungo le direzioni a, b) attorno a c.
function ring(c, a, b, ra, rb, thick) {
  const g = new THREE.TorusGeometry(1, thick / Math.max(ra, rb), 10, 40);
  const n = new THREE.Vector3().crossVectors(a, b).normalize();
  const m = new THREE.Matrix4().makeBasis(a.clone().multiplyScalar(ra * S), b.clone().multiplyScalar(rb * S), n.multiplyScalar(Math.max(ra, rb) * S));
  g.applyMatrix4(m);
  g.translate(c.x, c.y, c.z);
  return g;
}

// ---- tuba uditiva (mm): dalla cassa all'ostio faringeo
const TUBE_BONE = [[-45.3, -3.2, 1580.8], [-41.5, -5.6, 1579.6], [-37, -7.6, 1578], [-33.5, -8.8, 1576.6]];
const TUBE_CART = [[-33.5, -8.8, 1576.6], [-27, -11.5, 1573.2], [-20.5, -16, 1571], [-13.8, -22, 1568.5]];
const lerp = (a, b, u) => a + (b - a) * u;
const H = (u) => lerp(0.95, 3.3, u * u * (3 - 2 * u)); // semialtezza del lume (mm)
const TH = (u) => lerp(0.55, 1.25, u); // spessore della cartilagine
const W0 = 0.32; // semilarghezza del lume chiuso
const GAP = 0.22;

function lumenProfile(open) {
  return (u) => {
    const h = H(u);
    // la parete mediale è fissa; quella laterale (membranosa) si allontana
    const wide = open * lerp(0.35, 2.3, u);
    const out = [];
    for (let j = 0; j < 14; j++) {
      const a = (j / 14) * Math.PI * 2;
      const c = Math.cos(a);
      out.push([c > 0 ? c * W0 : c * (W0 + wide), Math.sin(a) * h - (c < 0 ? wide * 0.25 * (1 - Math.abs(Math.sin(a))) : 0)]);
    }
    return out;
  };
}
const medialLamina = (u) => {
  const h = H(u), t = TH(u), w = W0 + GAP;
  return [[w + t, -0.9 * h], [w + t, h * 0.7 + t * 0.5], [w * 0.6 + t * 0.5, h + GAP + t], [0, h + GAP + t * 1.05], [0, h + GAP], [w, h * 0.72], [w, -0.9 * h]];
};
const lateralLamina = (u) => {
  const h = H(u), t = TH(u) * 0.85, w = W0 + GAP;
  return [[0, h + GAP + t * 1.05], [-(w * 0.6 + t * 0.5), h + GAP + t], [-(w + t), h * 0.75], [-(w + t * 0.8), h * 0.2], [-w, h * 0.2], [-w, h * 0.72], [0, h + GAP]];
};

export class MiddleEarModel extends AnatomyModel {
  constructor() {
    super({ tilt: -0.45 });
    // spostamento fisso: il modello intero sopra il centro della base
    this.inner.scale.setScalar(HOME_K);
    this.inner.position.copy(P(...HOME)).multiplyScalar(-HOME_K).add(V(0, HOME_Y, 0));
    // niente asta: tutte le pagine usano un primo piano del motore, che la nasconde
    this.addStand({ radius: 0.25, z: 0 });
    this.ear = { sound: 0, tt: 0, st: 0, press: 0, open: 0 };
    this.earTarget = { ...this.ear };
    this.clock = 0;
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('orecchio-medio.glb', {
      malleusHead: ['martello: testa e collo', 0xf0e6cc],
      manubrium: ['manico del martello', 0xf0e6cc],
      incusBody: ["corpo dell'incudine", 0xdcc48a],
      incusLong: ["processo lungo dell'incudine", 0xdcc48a],
      stapes: ['staffa', 0xc79a4e],
      tm: ['membrana del timpano', 0xdba6a0, { double: true, opacity: 0.88 }],
      cochlea: ['coclea (il giro basale forma il promontorio)', 0x6f9fd8],
      vestibule: ['vestibolo e canali semicircolari', 0x8f86cf],
      facial: ['nervo faciale (VII) con la corda del timpano', 0xe8c22a],
      temporal: ['osso temporale', BONE, { ghost: true, opacity: 0.14 }],
      sphenoid: ['osso sfenoide', 0xd8cfae, { ghost: true, opacity: 0.2 }],
      nasopharynx: ['rinofaringe', 0xe6a7b4, { ghost: true, opacity: 0.22 }],
      palate: ['palato molle', 0xd9788a, { ghost: true, opacity: 0.4 }],
    });
    this.#tube();
    this.#tubeMuscles();
    this.#windows();
    this.#earMuscles();
    this.#rig();
    this.#waves();
  }

  #tube() {
    const bone = TUBE_BONE.map((p) => P(...p));
    const cart = TUBE_CART.map((p) => P(...p));
    this.addPart('tubeBone', 'tuba uditiva: parte ossea', 0xe3c9a0, [taperTube(bone, mm([1.7, 1.45, 1.15, 0.85]), { caps: false })], { double: true });
    const closed = sweep(cart, lumenProfile(0));
    const open = sweep(cart, lumenProfile(1));
    const lumen = this.addPart('lumen', 'tuba uditiva: lume della parte cartilaginea', 0xe58f9f, [closed], { double: true });
    const c = lumen.center;
    const a = closed.attributes.position.array.slice();
    const b = open.attributes.position.array.slice();
    for (let i = 0; i < b.length; i += 3) {
      b[i] -= c.x;
      b[i + 1] -= c.y;
      b[i + 2] -= c.z;
    }
    this.lumen = { geo: closed, a, b, t: -1 };
    this.addPart('lamMed', 'cartilagine della tuba: lamina mediale', 0x8fc4d9, [sweep(cart, medialLamina)], { double: true });
    this.addPart('lamLat', 'cartilagine della tuba: lamina laterale', 0x3f8fb5, [sweep(cart, lateralLamina)], { double: true });

    const frame = (curvePts, u) => {
      const curve = new THREE.CatmullRomCurve3(curvePts, false, 'centripetal');
      const t = curve.getTangentAt(u);
      const side = new THREE.Vector3().crossVectors(t, V(0, 1, 0)).normalize();
      return { p: curve.getPointAt(u), side, top: new THREE.Vector3().crossVectors(side, t).normalize() };
    };
    const i = frame(cart, 0);
    this.addPart('isthmus', 'istmo della tuba', 0xd0672f, [ring(i.p, i.side, i.top, 1.25, 1.45, 0.42)]);
    const o = frame(cart, 1);
    this.addPart('ostium', 'ostio faringeo della tuba', 0xb8405f, [ring(o.p, o.side, o.top, 2.3, 4.4, 0.6)]);
  }

  #tubeMuscles() {
    const path = (pts) => pts.map((p) => P(...p));
    this.addPart('tvp', 'muscolo tensore del velo palatino', 0xb8443e, [
      taperTube(
        path([[-24.5, -14.8, 1572.3], [-21.5, -19.5, 1567], [-18.5, -24.5, 1560.5], [-16.4, -28.6, 1553.6], [-15.7, -30.5, 1550.3], [-13.2, -31.4, 1549.6], [-8.5, -31.3, 1551.3]]),
        mm([4.4, 4.2, 3.2, 1.5, 0.6, 0.6, 1.3]),
        { flat: { z: 0.32 }, seg: 60 }
      ),
    ]);
    this.addPart('lvp', 'muscolo elevatore del velo palatino', 0xd9705c, [
      taperTube(
        path([[-30, -6.5, 1573.3], [-25, -10, 1570.2], [-19, -15.8, 1566.3], [-13, -22, 1561.8], [-7, -27, 1556.5], [-2, -30.5, 1554.6]]),
        mm([0.9, 1.5, 1.7, 1.7, 1.9, 2.4]),
        { seg: 50 }
      ),
    ]);
    this.addPart('sp', 'muscolo salpingofaringeo', 0xe39a55, [
      taperTube(path([[-12.9, -21.6, 1564.8], [-12.3, -20, 1559.5], [-12.6, -18, 1552.5], [-13, -16.5, 1546.5]]), mm([0.5, 0.85, 0.85, 0.5])),
    ]);
  }

  #windows() {
    // platina della staffa reale: centro, asse lungo (antero-posteriore), asse breve
    const c = P(-41.65, 4.14, 1581.42);
    this.addPart('oval', 'finestra ovale (del vestibolo)', 0x2fa37a, [ring(c, D(0.27, 0.96, 0.03), D(-0.35, 0.07, 0.93), 1.85, 1.15, 0.22)]);
    const r = ellipsoid([0, 0, 0], mm([0.95, 0.95, 0.22]), null, 20);
    const n = D(-0.62, 0.6, -0.5);
    r.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n));
    const rc = P(-42.6, 4.55, 1578.45);
    r.translate(rc.x, rc.y, rc.z);
    this.addPart('round', 'finestra rotonda (della coclea)', 0x2fb4c8, [r]);
  }

  #earMuscles() {
    const path = (pts) => pts.map((p) => P(...p));
    this.addPart('tt', 'muscolo tensore del timpano e suo tendine', 0xc0483c, [
      taperTube(
        path([[-28, -12, 1577.2], [-33.5, -10.3, 1579], [-38.5, -8, 1581], [-42, -4.8, 1582.4], [-43.3, -1.3, 1582.7], [-43.1, 1.6, 1582.4], [-45.5, 3, 1582], [-47.85, 4.2, 1581.7]]),
        mm([0.5, 0.95, 1.1, 1.1, 0.95, 0.6, 0.22, 0.22]),
        { seg: 80 }
      ),
    ]);
    this.addPart('cochleariform', 'processo cocleariforme (troclea del tensore)', BONE, [
      taperTube(path([[-41.9, 1.3, 1582.9], [-42.6, 2.1, 1582.6], [-43.2, 2.3, 1582.1], [-43.6, 1.7, 1581.8]]), mm([0.5, 0.42, 0.36, 0.3]), { seg: 16 }),
    ]);
    this.addPart('stapedius', 'muscolo stapedio e suo tendine', 0xa8325a, [
      taperTube(
        path([[-45.5, 10.3, 1574], [-45.1, 9.8, 1576.8], [-44.6, 8.8, 1579.2], [-44.35, 7.5, 1580.3], [-44.15, 5.75, 1580.3]]),
        mm([0.35, 0.6, 0.62, 0.32, 0.13, 0.13]),
        { seg: 40 }
      ),
    ]);
    this.addPart('pyramid', 'eminenza piramidale', BONE, [
      taperTube(path([[-45.45, 10.2, 1574.6], [-45.05, 9.7, 1577], [-44.6, 8.8, 1579.3], [-44.38, 7.75, 1580.2]]), mm([1.15, 1.15, 0.95, 0.34]), { caps: false, seg: 24 }),
    ], { double: true, opacity: 0.5 });
  }

  // Ciò che serve a muovere la catena: martello e incudine ruotano insieme
  // attorno a un asse antero-posteriore, la staffa affonda nella finestra ovale.
  #rig() {
    const A1 = P(-47.7, 9.65, 1582.7); // punta del processo breve dell'incudine
    const A2 = P(-48.6, 3.0, 1582.6); // collo del martello, verso il processo anteriore
    const axis = A2.clone().sub(A1).normalize();
    const umbo = P(-46.62, 2.69, 1578.33);
    const lenticular = P(-45.3, 5.4, 1579.8);
    const tmIn = D(0.87, 0.06, 0.49); // normale della membrana, verso la cassa
    const stIn = D(0.89, -0.28, 0.36); // asse della staffa, verso il vestibolo
    const moved = (p, a) => p.clone().sub(A1).applyAxisAngle(axis, a).add(A1).sub(p);
    const e = 1e-3;
    const sign = moved(umbo, e).dot(tmIn) > 0 ? 1 : -1;
    const bones = ['malleusHead', 'manubrium', 'incusBody', 'incusLong'].map((id) => {
      const mesh = this.parts.get(id).meshes[0];
      return { mesh, rest: mesh.position.clone() };
    });
    const stapes = this.parts.get('stapes').meshes[0];
    // lo stapedio fa ruotare la staffa attorno al margine posteriore della platina
    const pivot = P(-41.65 + 0.27 * 1.5, 4.14 + 0.96 * 1.5, 1581.42 + 0.03 * 1.5);
    const front = P(-41.65 - 0.27 * 1.5, 4.14 - 0.96 * 1.5, 1581.42 - 0.03 * 1.5);
    const tiltAxis = D(-0.35, 0.07, 0.93);
    const tiltSign = front.clone().sub(pivot).applyAxisAngle(tiltAxis, e).add(pivot).sub(front).dot(stIn) < 0 ? 1 : -1;

    const tm = this.parts.get('tm').meshes[0];
    const base = tm.geometry.attributes.position.array.slice();
    const w = new Float32Array(base.length / 3);
    const c = P(-47.81, 4.01, 1577.88).sub(tm.position);
    const a0 = D(-0.22, 0.94, 0.26), a1 = D(-0.45, -0.34, 0.83);
    const v = new THREE.Vector3();
    for (let i = 0; i < w.length; i++) {
      v.fromArray(base, i * 3).sub(c);
      const rho2 = (v.dot(a0) / (5.9 * S)) ** 2 + (v.dot(a1) / (5.0 * S)) ** 2;
      w[i] = Math.max(0, 1 - rho2);
    }
    this.rigData = {
      A1, axis, sign, bones, stapes, stapesRest: stapes.position.clone(), pivot, tiltAxis, tiltSign, stIn, tmIn,
      umboGain: moved(umbo, e * sign).dot(tmIn) / e,
      stapesGain: moved(lenticular, e * sign).dot(stIn) / e,
      tm: { geo: tm.geometry, base, w, last: 1 },
    };
  }

  // Onde sonore davanti alla membrana, nel meato acustico esterno.
  #waves() {
    const out = D(-0.87, -0.06, -0.49);
    const c = P(-47.81, 4.01, 1577.88);
    this.waves = [0, 1, 2].map((i) => {
      const m = new THREE.Mesh(
        ring(V(0, 0, 0), D(-0.22, 0.94, 0.26), D(-0.45, -0.34, 0.83), 3.4, 3.0, 0.16),
        new THREE.MeshBasicMaterial({ color: 0x2f6fe0, transparent: true, opacity: 0, depthWrite: false })
      );
      m.material.clippingPlanes = this.clipPlanes;
      m.visible = false;
      this.inner.add(m);
      return { m, phase: i / 3 };
    });
    this.waveAxis = { c, out };
  }

  // sound: ampiezza della vibrazione (0 silenzio, 1 suono intenso); tt, st:
  // contrazione di tensore del timpano e stapedio (0-1); press: +1 pressione
  // esterna maggiore, -1 minore; open: apertura della tuba (0-1).
  setEar(state = {}) {
    Object.assign(this.earTarget, { sound: 0, tt: 0, st: 0, press: 0, open: 0 }, state);
  }

  reset() {
    super.reset();
    this.setEar();
  }

  #pose() {
    const r = this.rigData;
    if (!r) return;
    const s = this.ear;
    const wave = Math.sin(this.clock * Math.PI * 2 * 1.6);
    const swing = 0.085 * s.sound * (1 - 0.6 * s.tt) * wave;
    // la pressione sposta catena e membrana molto più che nel vero, per vederle
    const still = 0.13 * s.tt + 0.34 * s.press;
    const q = new THREE.Quaternion().setFromAxisAngle(r.axis, (swing + still) * r.sign);
    for (const b of r.bones) {
      b.mesh.position.copy(b.rest).sub(r.A1).applyQuaternion(q).add(r.A1);
      b.mesh.quaternion.copy(q);
    }
    // staffa: segue il processo lenticolare; lo stapedio ne smorza l'oscillazione
    const push = r.stapesGain * (still + swing * (1 - 0.65 * s.st));
    const qs = new THREE.Quaternion().setFromAxisAngle(r.tiltAxis, 0.2 * s.st * r.tiltSign);
    r.stapes.position.copy(r.stapesRest).sub(r.pivot).applyQuaternion(qs).add(r.pivot).addScaledVector(r.stIn, push);
    r.stapes.quaternion.copy(qs);
    // membrana: il bordo resta fermo, l'ombelico segue il manico
    const d = r.umboGain * (swing + still);
    if (Math.abs(d - r.tm.last) > 1e-6) {
      r.tm.last = d;
      const pos = r.tm.geo.attributes.position;
      for (let i = 0; i < r.tm.w.length; i++) {
        const k = r.tm.w[i] * d;
        pos.array[i * 3] = r.tm.base[i * 3] + r.tmIn.x * k;
        pos.array[i * 3 + 1] = r.tm.base[i * 3 + 1] + r.tmIn.y * k;
        pos.array[i * 3 + 2] = r.tm.base[i * 3 + 2] + r.tmIn.z * k;
      }
      pos.needsUpdate = true;
      r.tm.geo.computeVertexNormals();
    }
    // lume della tuba
    const l = this.lumen;
    if (Math.abs(s.open - l.t) > 1e-4) {
      l.t = s.open;
      const pos = l.geo.attributes.position;
      for (let i = 0; i < l.a.length; i++) pos.array[i] = l.a[i] + (l.b[i] - l.a[i]) * s.open;
      pos.needsUpdate = true;
      l.geo.computeVertexNormals();
    }
    // onde sonore: corrono verso la membrana
    const on = this.visible.has('tm') ? Math.min(1, s.sound * 1.4) : 0;
    for (const wv of this.waves) {
      const f = (wv.phase + this.clock * 0.55) % 1;
      wv.m.visible = on > 0.02;
      wv.m.position.copy(this.waveAxis.c).addScaledVector(this.waveAxis.out, (1.2 + (1 - f) * 5.2) * S);
      wv.m.scale.setScalar(0.75 + 0.35 * (1 - f));
      wv.m.material.opacity = on * Math.sin(f * Math.PI) * (0.35 + 0.55 * s.sound);
    }
  }

  update(dt, camera, realDt = dt) {
    const step = Math.min(realDt, 0.5);
    const k = 1 - Math.exp(-step * 5);
    this.clock += step;
    for (const key of Object.keys(this.ear)) {
      this.ear[key] += (this.earTarget[key] - this.ear[key]) * k;
      if (Math.abs(this.earTarget[key] - this.ear[key]) < 1e-4) this.ear[key] = this.earTarget[key];
    }
    this.#pose();
    super.update(dt, camera, realDt);
  }
}
