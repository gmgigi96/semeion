// Modello dell'encefalo per il capitolo "Encefalo: anatomia macroscopica".
//
// MESH REALI (BodyParts3D 4.0, © DBCLS, CC BY 4.0; public/meshes/macroscopica.glb,
// manifesto meshes/macroscopica.json): tutti i giri dell'emisfero sinistro, uno
// per parte (frontali superiore, medio e inferiore, precentrale, orbitari,
// postcentrale, lobulo parietale superiore, sovramarginale, angolare, temporali
// superiore, medio e inferiore, fusiforme, lobo occipitale, insula, cingolo,
// paraippocampale), la sostanza bianca dell'emisfero sinistro, l'emisfero destro
// in un solo pezzo, corpo calloso, setto pellucido, fornice, talamo, ipotalamo
// (con tuber cinereum e corpi mammillari), chiasma e tratto ottico, epifisi,
// ipofisi, mesencefalo (con peduncoli e collicoli), ponte, bulbo e cervelletto.
//
// LAVORAZIONI SULLE MESH REALI
// - Tronco, cervelletto, ipotalamo e chiasma sono già divisi in due metà in
//   BodyParts3D: la metà destra è una parte a sé (…R), così togliendola insieme
//   all'emisfero destro resta la sezione sagittale mediana.
// - Corpo calloso e setto pellucido sono tagliati qui sul piano mediano e la
//   superficie di taglio è chiusa con il profilo reale della sezione.
// - Suddivisioni per posizione dentro una mesh reale (regole in `split` del
//   manifesto): lobulo paracentrale (faccia mediale dei giri pre- e postcentrale),
//   precuneo (faccia mediale del lobulo parietale superiore), cuneo e giro
//   linguale (faccia mediale del lobo occipitale, sopra e sotto il solco
//   calcarino), circonvoluzioni breve e lunga dell'insula (davanti e dietro il
//   solco centrale dell'insula). Il confine fra le due circonvoluzioni
//   dell'insula è una retta approssimata, dal limen verso l'alto e l'indietro.
//
// RICOSTRUITO A MANO: i solchi primari, che in BodyParts3D non sono oggetti ma
// lo spazio fra due giri. Ogni solco è un cordone posato sulla superficie reale
// (la quota di ogni punto è cercata sulle mesh):
// - solco centrale (di Rolando), solco laterale (di Silvio), solco del cingolo
//   con il solco marginale e solco parieto-occipitale seguono il confine reale
//   fra le mesh dei giri che li delimitano (precentrale/postcentrale; temporale
//   superiore/giri frontale inferiore, pre- e postcentrale, sovramarginale;
//   cingolo/frontale superiore, lobulo paracentrale/precuneo; lobo
//   occipitale/lobulo parietale superiore), ricavato proiettando raggi
//   paralleli sulle mesh e cercando dove cambia il giro colpito;
// - solco calcarino: il lobo occipitale di BodyParts3D è un pezzo unico. Il
//   decorso segue il lieve avvallamento presente sulla faccia mediale della mesh
//   e, dove manca, le fonti: nasce poco sotto lo splenio del corpo calloso,
//   riceve ad angolo acuto il solco parieto-occipitale (delimitando il cuneo,
//   con il giro linguale al di sotto) e raggiunge il polo occipitale.
//
// FONTI per decorso e rapporti dei solchi
// - H. Gray, Anatomy of the Human Body, 20ª ed. (1918), p. 820 e figg. 726-727,
//   testo di pubblico dominio riportato in:
//   https://en.wikipedia.org/wiki/Parieto-occipital_sulcus
//   https://en.wikipedia.org/wiki/Calcarine_sulcus
// - Rehman A, Al Khalili Y. Neuroanatomy, Occipital Lobe. StatPearls, NCBI
//   Bookshelf NBK544320: https://www.ncbi.nlm.nih.gov/books/NBK544320/
// - IMAIOS e-Anatomy, voci «Cuneus» e «Parietooccipital sulcus»:
//   https://www.imaios.com/en/e-anatomy/anatomical-structures/cuneus-116932236
// - Ribas GC. The cerebral sulci and gyri. Neurosurg Focus 2010;28(2):E2,
//   doi:10.3171/2009.11.FOCUS09245 (solco centrale dell'insula, opercoli).
//
// Coordinate del modello: x laterale (destra +, quindi l'emisfero sinistro è a
// x < 0), y craniale, z anteriore. 1 mm = 0.0045 unità.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { AnatomyModel } from '../model.js';
import { V, taperTube } from '../geo.js';

const FRONTAL = [0x4f7fc9, 0x7aa8e2, 0x3f66ad, 0x27498f, 0xa3c6ef];
const PARIETAL = [0xdf9a2e, 0xf2cf62, 0xe8b548, 0xcf7f25];
const TEMPORAL = [0x57a868, 0x8cc98d, 0x3d8a55, 0x74b59c];
const WHITE = 0xf1ead8;
const SULCUS = 0x2a2520;
const MIDBRAIN = 0xa98467, PONS = 0xd2ae78, MEDULLA = 0xead7ad, CEREBELLUM = 0xdcb9a6;

const REAL = {
  sfg: ['giro frontale superiore', FRONTAL[0]],
  mfg: ['giro frontale medio', FRONTAL[1]],
  ifg: ['giro frontale inferiore', FRONTAL[2]],
  precentral: ['giro precentrale', FRONTAL[3]],
  orbital: ['circonvoluzioni orbitarie', FRONTAL[4]],
  postcentral: ['giro postcentrale', PARIETAL[0]],
  spl: ['lobulo parietale superiore', PARIETAL[1]],
  supramarginal: ['giro sovramarginale', PARIETAL[2]],
  angular: ['giro angolare', PARIETAL[3]],
  stg: ['circonvoluzione temporale superiore', TEMPORAL[0]],
  mtg: ['circonvoluzione temporale media', TEMPORAL[1]],
  itg: ['circonvoluzione temporale inferiore', TEMPORAL[2]],
  fusiform: ['giro occipito-temporale (fusiforme)', TEMPORAL[3]],
  occipital: ['lobo occipitale', 0xc9485b],
  cuneus: ['cuneo', 0xe07a8e],
  lingual: ['giro linguale', 0xa23350],
  paracentral: ['lobulo paracentrale', 0x6c5fc0],
  precuneus: ['precuneo (lobulo quadrilatero)', 0xf5dd8a],
  insulaS: ["circonvoluzione breve dell'insula", 0xa06cc8],
  insulaL: ["circonvoluzione lunga dell'insula", 0x70439c],
  cingulate: ['circonvoluzione del cingolo', 0xe8a3ae],
  parahippocampal: ['circonvoluzione paraippocampale', 0xcf7c8a],
  white: ['sostanza bianca (centro semiovale)', WHITE],
  hemiR: ['emisfero cerebrale destro', 0xe7c9b9],
  callosum: ['corpo calloso', WHITE],
  septum: ['setto pellucido', 0xb9cf98],
  fornix: ['fornice', 0xe3d6b0],
  thalamus: ['talamo', 0xc9a27a],
  hypothalamus: ['ipotalamo', 0x5aa7a0],
  chiasm: ['chiasma e tratto ottico', 0xe6d48a],
  pineal: ['epifisi', 0x8a5a3c],
  pituitary: ['ipofisi', 0xd9a0a0],
  midbrain: ['mesencefalo', MIDBRAIN],
  midbrainR: ['mesencefalo', MIDBRAIN],
  pons: ['ponte', PONS],
  ponsR: ['ponte', PONS],
  medulla: ['bulbo (midollo allungato)', MEDULLA],
  medullaR: ['bulbo (midollo allungato)', MEDULLA],
  cerebellum: ['cervelletto', CEREBELLUM],
  cerebellumR: ['cervelletto', CEREBELLUM],
};

// Giri su cui si posano i solchi.
const CORTEX = [
  'sfg', 'mfg', 'ifg', 'precentral', 'postcentral', 'spl', 'supramarginal', 'angular', 'stg', 'mtg',
  'occipital', 'cuneus', 'lingual', 'paracentral', 'precuneus', 'cingulate',
];

// Punto della superficie a cui si aggancia l'etichetta di ogni giro.
const ANCHOR = {
  sfg: [-0.1, 0.765, 0.14],
  mfg: [-0.2, 0.69, 0.22],
  ifg: [-0.27, 0.55, 0.17],
  precentral: [-0.27, 0.56, 0.05],
  postcentral: [-0.21, 0.71, -0.09],
  spl: [-0.12, 0.69, -0.28],
  supramarginal: [-0.3, 0.6, -0.11],
  angular: [-0.28, 0.5, -0.27],
  stg: [-0.3, 0.47, 0.03],
  mtg: [-0.31, 0.4, -0.06],
  itg: [-0.26, 0.31, -0.02],
  central: [-0.2, 0.72, -0.1],
  lateral: [-0.29, 0.53, 0.1],
};

// Taglia una geometria con il piano x = x0 tenendo la parte x <= x0 e
// restituisce [pareti, superficie di taglio]. La superficie di taglio è il
// profilo reale della sezione, triangolato.
function cutSagittal(geo, x0) {
  const src = geo.attributes.position;
  const index = geo.index.array;
  const out = [];
  const segs = [];
  const P = (i) => new THREE.Vector3().fromBufferAttribute(src, i);
  const cross = (a, b) => a.clone().lerp(b, (x0 - a.x) / (b.x - a.x)).setX(x0);
  for (let t = 0; t < index.length; t += 3) {
    const tri = [P(index[t]), P(index[t + 1]), P(index[t + 2])];
    const poly = [];
    const cut = [];
    for (let k = 0; k < 3; k++) {
      const a = tri[k], b = tri[(k + 1) % 3];
      const ina = a.x <= x0, inb = b.x <= x0;
      if (ina) poly.push(a);
      if (ina !== inb) {
        const c = cross(a, b);
        poly.push(c);
        cut.push(c);
      }
    }
    for (let k = 1; k + 1 < poly.length; k++) out.push(poly[0], poly[k], poly[k + 1]);
    if (cut.length === 2) segs.push(cut);
  }
  const walls = mergeVertices(new THREE.BufferGeometry().setFromPoints(out), 1e-5);
  walls.computeVertexNormals();

  // concatena i segmenti di taglio in anelli chiusi
  const key = (p) => `${Math.round(p.y * 2e4)},${Math.round(p.z * 2e4)}`;
  const next = new Map();
  for (const [a, b] of segs) {
    const ka = key(a), kb = key(b);
    if (ka === kb) continue;
    (next.get(ka) ?? next.set(ka, []).get(ka)).push({ k: kb, p: b });
    (next.get(kb) ?? next.set(kb, []).get(kb)).push({ k: ka, p: a });
  }
  const used = new Set();
  const capPts = [];
  for (const start of next.keys()) {
    if (used.has(start)) continue;
    const loop = [];
    let cur = start;
    while (cur && !used.has(cur)) {
      used.add(cur);
      const step = next.get(cur).find((n) => !used.has(n.k)) ?? null;
      if (step) loop.push(new THREE.Vector2(step.p.z, step.p.y));
      cur = step?.k;
    }
    if (loop.length < 3) continue;
    for (const f of THREE.ShapeUtils.triangulateShape(loop, []))
      for (const i of f) capPts.push(new THREE.Vector3(x0, loop[i].y, loop[i].x));
  }
  const cap = new THREE.BufferGeometry().setFromPoints(capPts);
  cap.computeVertexNormals();
  return [walls, cap];
}

export class Macroscopica extends AnatomyModel {
  constructor() {
    super({ tilt: -0.6 });
    this.addStand({ radius: 0.2, z: -0.06, rod: [0, 0.02, 0.06, -0.1] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('macroscopica.glb', REAL);
    this.#section('callosum');
    this.#section('septum');
    this.#sulci();
  }

  // Sezione sagittale mediana di una parte impari.
  #section(id) {
    const part = this.parts.get(id);
    const mesh = part.meshes[0];
    const [walls, cap] = cutSagittal(mesh.geometry, 0.003 - mesh.position.x);
    mesh.geometry = walls;
    // la faccia di taglio si vede da entrambi i lati e segue il materiale della parte
    const mat = part.mat.clone();
    mat.side = THREE.DoubleSide;
    const face = new THREE.Mesh(cap, mat);
    face.onBeforeRender = () => {
      mat.color.copy(part.mat.color);
      mat.emissive.copy(part.mat.emissive);
      mat.emissiveIntensity = part.mat.emissiveIntensity;
      mat.opacity = part.mat.opacity;
      mat.depthWrite = part.mat.depthWrite;
    };
    face.position.copy(mesh.position);
    face.userData = { size: mesh.userData.size, ui: mesh.userData.ui };
    face.castShadow = true;
    face.visible = false;
    this.inner.add(face);
    part.meshes.push(face);
  }

  // Le etichette dei giri stanno sulla faccia laterale, non sopra l'ingombro.
  setLabels(map) {
    super.setLabels(map);
    for (const [id, t] of this.labels) if (ANCHOR[id]) t.userData.anchor.set(...ANCHOR[id]);
  }

  // Triangoli dei giri, nelle coordinate del modello.
  #triangles() {
    const tris = [];
    for (const id of CORTEX)
      for (const m of this.parts.get(id).meshes) {
        const p = m.geometry.attributes.position, ix = m.geometry.index.array, o = m.position;
        for (let t = 0; t < ix.length; t += 3) {
          const tri = [];
          for (let k = 0; k < 3; k++) tri.push(p.getX(ix[t + k]) + o.x, p.getY(ix[t + k]) + o.y, p.getZ(ix[t + k]) + o.z);
          tris.push(tri);
        }
      }
    return tris;
  }

  #sulci() {
    const tris = this.#triangles();
    // Primo punto della superficie incontrato da un raggio parallelo a un asse:
    // 'lat' da sinistra (x minimo, dato [z, y]), 'med' dal piano mediano
    // (x massimo, dato [z, y]), 'top' dall'alto (y massimo, dato [x, z]).
    const AX = { lat: [2, 1, 0, -1], med: [2, 1, 0, 1], top: [0, 2, 1, 1] };
    const hit = (dir, a, b) => {
      const [ia, ib, ic, sign] = AX[dir];
      let best = null;
      for (const t of tris) {
        const a0 = t[ia], b0 = t[ib], a1 = t[3 + ia], b1 = t[3 + ib], a2 = t[6 + ia], b2 = t[6 + ib];
        if ((a < a0 && a < a1 && a < a2) || (a > a0 && a > a1 && a > a2) || (b < b0 && b < b1 && b < b2) || (b > b0 && b > b1 && b > b2)) continue;
        const d = (a1 - a0) * (b2 - b0) - (a2 - a0) * (b1 - b0);
        if (Math.abs(d) < 1e-12) continue;
        const u = ((a - a0) * (b2 - b0) - (a2 - a0) * (b - b0)) / d;
        const v = ((a1 - a0) * (b - b0) - (a - a0) * (b1 - b0)) / d;
        if (u < 0 || v < 0 || u + v > 1) continue;
        const c = t[ic] + u * (t[3 + ic] - t[ic]) + v * (t[6 + ic] - t[ic]);
        if (best == null || (c - best) * sign > 0) best = c;
      }
      return best;
    };
    // Posa una linea sulla superficie: la ricampiona, cerca per ogni punto la
    // cresta dei giri vicini (il solco in sé è una fessura) e la liscia.
    const drape = (dir, pts, n = 22) => {
      const [ia, ib, ic, sign] = AX[dir];
      const curve = new THREE.CatmullRomCurve3(pts.map(([a, b]) => V(a, b, 0)), false, 'centripetal');
      const out = [];
      let last = 0;
      for (let i = 0; i <= n; i++) {
        const p = curve.getPointAt(i / n);
        let c = null;
        for (const [da, db] of [[0, 0], [0.01, 0], [-0.01, 0], [0, 0.01], [0, -0.01], [0.007, 0.007], [-0.007, -0.007], [0.007, -0.007], [-0.007, 0.007]]) {
          const h = hit(dir, p.x + da, p.y + db);
          if (h != null && (c == null || (h - c) * sign > 0)) c = h;
        }
        c = last = c ?? last;
        const q = [0, 0, 0];
        q[ia] = p.x; q[ib] = p.y; q[ic] = c;
        out.push(q);
      }
      for (let pass = 0; pass < 2; pass++)
        for (let i = 1; i < out.length - 1; i++) out[i][ic] = (out[i - 1][ic] + 2 * out[i][ic] + out[i + 1][ic]) / 4;
      // il cordone sporge di poco dalla superficie, per restare visibile
      for (const q of out) q[ic] += sign * 0.004;
      return out.map((q) => V(...q));
    };
    const add = (id, name, pts, r = 0.0055) => {
      const part = this.addPart(id, name, SULCUS, [taperTube(pts, r, { seg: 70, radial: 10 })], { roughness: 0.7 });
      // il cordone vince sul rilievo dei giri che lo sfiorano
      Object.assign(part.mat, { polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -600 });
    };

    add('central', 'solco centrale (scissura di Rolando)', [
      ...drape('lat', [[0.034, 0.528], [0.03, 0.563], [0.015, 0.6], [-0.018, 0.634], [-0.052, 0.668], [-0.085, 0.695], [-0.112, 0.706]], 16),
      ...drape('top', [[-0.11, -0.142], [-0.06, -0.15], [-0.018, -0.152]], 6),
      ...drape('med', [[-0.152, 0.735], [-0.15, 0.7]], 3),
    ]);
    add('lateral', 'solco laterale (scissura di Silvio)',
      drape('lat', [[0.19, 0.432], [0.16, 0.456], [0.13, 0.476], [0.09, 0.488], [0.03, 0.497], [-0.04, 0.5], [-0.1, 0.505], [-0.135, 0.52]]));
    add('parietoOcc', 'solco parieto-occipitale', [
      ...drape('lat', [[-0.365, 0.467], [-0.377, 0.478]], 3),
      V(-0.03, 0.5, -0.374),
      ...drape('med', [[-0.368, 0.512], [-0.33, 0.497], [-0.29, 0.48], [-0.25, 0.465], [-0.222, 0.452]], 12),
    ]);
    add('calcarine', 'solco calcarino',
      drape('med', [[-0.2, 0.44], [-0.222, 0.44], [-0.26, 0.418], [-0.316, 0.4], [-0.35, 0.372], [-0.385, 0.346], [-0.398, 0.34]], 18));
    add('cingulateS', 'solco del cingolo e solco marginale',
      drape('med', [
        [0.262, 0.44], [0.274, 0.5], [0.248, 0.56], [0.2, 0.6], [0.13, 0.618], [0.05, 0.623], [-0.03, 0.619], [-0.1, 0.612],
        [-0.16, 0.6], [-0.186, 0.615], [-0.196, 0.655], [-0.21, 0.715],
      ], 40));
  }
}
