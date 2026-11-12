// Modello anatomico del plesso brachiale sinistro (veduta anteriore), costruito
// in modo procedurale a partire da un grafo: radici -> tronchi primari ->
// rami di divisione -> tronchi secondari -> nervi. Ogni segmento sa quali
// radici gli portano fibre: da qui derivano percorsi, ritroso e lesioni.
//
// Coordinate del modello: x laterale, y craniale, z anteriore.
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { FONT } from './ui.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export const LEVELS = ['C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2'];
export const ROOTS = ['C5', 'C6', 'C7', 'C8', 'T1'];
export const ROOT_COLORS = {
  C5: 0xe4572e,
  C6: 0x2aa56b,
  C7: 0x2f86de,
  C8: 0x9b5de5,
  T1: 0xe8478f,
};
export const NERVE = 0xdcb13a;
export const DIM = 0xa39c88;
export const DEAD = 0x403c38;
export const LIT = 0xffd24d;

const SPINE_X = -0.4;
const foramenY = (lvl) => 0.8375 - 0.075 * lvl; // indice in LEVELS
const vertebraY = (i) => 0.875 - 0.075 * i; // C3..T3

// Nodi del grafo
const U0 = V(-0.17, 0.66, 0.02), U1 = V(-0.02, 0.585, 0.03);
const M0 = V(-0.16, 0.575, 0.02), M1 = V(-0.01, 0.528, 0.03);
const L0 = V(-0.17, 0.478, 0.02), L1 = V(-0.02, 0.47, 0.03);
const LC0 = V(0.14, 0.505, 0.05), LC1 = V(0.3, 0.435, 0.05);
const PC0 = V(0.15, 0.455, -0.035), PC1 = V(0.3, 0.39, -0.035);
const MC0 = V(0.14, 0.4, 0.04), MC1 = V(0.3, 0.345, 0.04);
const MED0 = V(0.41, 0.33, 0.07);
const ROOT_END = [U0, U0, M0, L0, L0];

function rootPoints(i, shift) {
  const y0 = foramenY(i + 1 + shift);
  return [V(-0.345, y0, 0), V(-0.27, y0 - 0.012, 0.01), ROOT_END[i]];
}
// Punto di una radice da cui si stacca un ramuscolo collaterale.
function rootTap(i, shift) {
  return new THREE.CatmullRomCurve3(rootPoints(i, shift)).getPoint(0.42);
}

const ALL = ROOTS;
// kind: root | trunk | div | cord | nerve.  depth: distanza dalle radici.
const DEFS = [
  ...ROOTS.map((r, i) => ({
    id: r, kind: 'root', name: `radice ${r}`, r: 0.0145, roots: [r], parents: [], depth: 0,
    curves: (s) => [rootPoints(i, s)],
  })),
  { id: 'U', kind: 'trunk', name: 'tronco primario superiore', r: 0.02, roots: ['C5', 'C6'], parents: ['C5', 'C6'], depth: 1,
    curves: () => [[U0, V(-0.09, 0.625, 0.026), U1]] },
  { id: 'M', kind: 'trunk', name: 'tronco primario medio', r: 0.017, roots: ['C7'], parents: ['C7'], depth: 1,
    curves: () => [[M0, V(-0.085, 0.552, 0.026), M1]] },
  { id: 'L', kind: 'trunk', name: 'tronco primario inferiore', r: 0.02, roots: ['C8', 'T1'], parents: ['C8', 'T1'], depth: 1,
    curves: () => [[L0, V(-0.09, 0.47, 0.026), L1]] },

  { id: 'Ua', kind: 'div', name: 'ramo anteriore del tronco superiore', r: 0.013, roots: ['C5', 'C6'], parents: ['U'], depth: 2,
    curves: () => [[U1, V(0.06, 0.555, 0.055), LC0]] },
  { id: 'Ma', kind: 'div', name: 'ramo anteriore del tronco medio', r: 0.012, roots: ['C7'], parents: ['M'], depth: 2,
    curves: () => [[M1, V(0.06, 0.522, 0.055), LC0]] },
  { id: 'La', kind: 'div', name: 'ramo anteriore del tronco inferiore', r: 0.013, roots: ['C8', 'T1'], parents: ['L'], depth: 2,
    curves: () => [[L1, V(0.06, 0.436, 0.052), MC0]] },
  { id: 'Up', kind: 'div', name: 'ramo posteriore del tronco superiore', r: 0.012, roots: ['C5', 'C6'], parents: ['U'], depth: 2,
    curves: () => [[U1, V(0.05, 0.545, -0.012), PC0]] },
  { id: 'Mp', kind: 'div', name: 'ramo posteriore del tronco medio', r: 0.011, roots: ['C7'], parents: ['M'], depth: 2,
    curves: () => [[M1, V(0.06, 0.5, -0.018), PC0]] },
  { id: 'Lp', kind: 'div', name: 'ramo posteriore del tronco inferiore', r: 0.011, roots: ['C8', 'T1'], parents: ['L'], depth: 2,
    curves: () => [[L1, V(0.06, 0.462, -0.022), PC0]] },

  { id: 'LC', kind: 'cord', name: 'tronco secondario laterale', r: 0.018, roots: ['C5', 'C6', 'C7'], parents: ['Ua', 'Ma'], depth: 3,
    curves: () => [[LC0, V(0.22, 0.472, 0.05), LC1]] },
  { id: 'PC', kind: 'cord', name: 'tronco secondario posteriore', r: 0.019, roots: ALL, parents: ['Up', 'Mp', 'Lp'], depth: 3,
    curves: () => [[PC0, V(0.23, 0.425, -0.035), PC1]] },
  { id: 'MC', kind: 'cord', name: 'tronco secondario mediale', r: 0.017, roots: ['C8', 'T1'], parents: ['La'], depth: 3,
    curves: () => [[MC0, V(0.22, 0.373, 0.04), MC1]] },

  { id: 'MCN', kind: 'nerve', name: 'nervo muscolocutaneo', short: 'n. muscolocutaneo', r: 0.012, roots: ['C5', 'C6', 'C7'], parents: ['LC'], depth: 4,
    curves: () => [[LC1, V(0.4, 0.42, 0.06), V(0.54, 0.37, 0.065), V(0.66, 0.28, 0.06)]] },
  { id: 'MedL', kind: 'nerve', name: 'radice laterale del nervo mediano', r: 0.012, roots: ['C5', 'C6', 'C7'], parents: ['LC'], depth: 4,
    curves: () => [[LC1, V(0.35, 0.385, 0.066), MED0]] },
  { id: 'MedM', kind: 'nerve', name: 'radice mediale del nervo mediano', r: 0.012, roots: ['C8', 'T1'], parents: ['MC'], depth: 4,
    curves: () => [[MC1, V(0.36, 0.33, 0.062), MED0]] },
  { id: 'MED', kind: 'nerve', name: 'nervo mediano', short: 'n. mediano', r: 0.015, roots: ALL, parents: ['MedL', 'MedM'], depth: 5,
    curves: () => [[MED0, V(0.5, 0.25, 0.07), V(0.6, 0.13, 0.07), V(0.67, 0.03, 0.07)]] },
  { id: 'ULN', kind: 'nerve', name: 'nervo ulnare', short: 'n. ulnare', r: 0.013, roots: ['C8', 'T1'], parents: ['MC'], depth: 4,
    curves: () => [[MC1, V(0.4, 0.28, 0.035), V(0.49, 0.16, 0.03), V(0.54, 0.02, 0.02)]] },
  { id: 'AX', kind: 'nerve', name: 'nervo ascellare', short: 'n. ascellare', r: 0.012, roots: ['C5', 'C6'], parents: ['PC'], depth: 4,
    curves: () => [[PC1, V(0.36, 0.385, -0.06), V(0.43, 0.41, -0.1), V(0.5, 0.455, -0.11)]] },
  { id: 'RAD', kind: 'nerve', name: 'nervo radiale', short: 'n. radiale', r: 0.016, roots: ALL, parents: ['PC'], depth: 4,
    curves: () => [[PC1, V(0.4, 0.32, -0.05), V(0.5, 0.2, -0.07), V(0.59, 0.07, -0.09)]] },

  { id: 'SS', kind: 'nerve', name: 'nervo soprascapolare', r: 0.009, roots: ['C5', 'C6'], parents: ['U'], depth: 2,
    curves: () => [[V(-0.09, 0.625, 0.026), V(0.0, 0.665, -0.02), V(0.12, 0.685, -0.08), V(0.25, 0.665, -0.13)]] },
  { id: 'LT', kind: 'nerve', name: 'nervo toracico lungo', r: 0.008, roots: ['C5', 'C6', 'C7'], parents: ['C5', 'C6', 'C7'], depth: 1,
    curves: (s) => {
      const j = V(-0.225, 0.575, -0.04);
      return [
        [rootTap(1, s), V(-0.24, 0.63, -0.03), j, V(-0.19, 0.4, -0.065), V(-0.15, 0.2, -0.05)],
        [rootTap(0, s), V(-0.245, 0.68, -0.03), j],
        [rootTap(2, s), V(-0.24, 0.585, -0.025), j],
      ];
    } },
];

export const TERMINALS = ['MCN', 'MED', 'ULN', 'RAD', 'AX'];

const RADIAL = 10;

function nerveMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: NERVE, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.3,
    emissive: NERVE, emissiveIntensity: 0,
  });
}

function tubeMesh(points, r, mat, tubular) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const n = tubular ?? Math.max(10, Math.ceil(curve.getLength() / 0.01));
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, n, r, RADIAL, false), mat);
  m.castShadow = true;
  m.userData.tubular = n;
  return m;
}

function ball(p, r, mat) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat);
  m.position.copy(p);
  m.castShadow = true;
  return m;
}

function billboard(str, opts = {}) {
  const t = new Text();
  Object.assign(t, {
    text: str, font: FONT.semi, fontSize: 0.03, color: 0x2a2520,
    anchorX: 'center', anchorY: 'middle',
    outlineWidth: '9%', outlineColor: 0xfbf6ea, outlineOpacity: 0.95,
    ...opts,
  });
  t.frustumCulled = false;
  t.sync();
  return t;
}

export class Plexus {
  constructor() {
    this.group = new THREE.Group(); // ruota su se stesso sulla pagina
    this.inner = new THREE.Group();
    this.inner.position.x = -0.1;
    // la base resta piatta sulla pagina; il modello è reclinato verso chi legge
    this.tilt = new THREE.Group();
    this.tilt.rotation.x = -0.3;
    this.tilt.add(this.inner);
    this.group.add(this.tilt);

    this.segs = new Map();
    this.structs = new Map();
    this.labels = new Map();
    this.endLabels = new Map();
    this.markers = [];
    this.shift = 0;
    this.shiftTarget = 0;
    this.cut = null; // { id, k }
    this.hover = new Set();
    this.lookFn = () => ({ color: NERVE, glow: 0 });
    this.labelFn = () => 0.35;
    this.onHover = null; // (id | null)
    this.onClick = null; // (id, hit)
    this.time = 0;

    this.#buildStand();
    this.#buildSpine();
    this.#buildNerves();
    this.#buildRelations();
    this.#buildLabels();
  }

  // --- costruzione ----------------------------------------------------------
  #ui(id, name) {
    return {
      tip: name,
      drag: true,
      hover: (on) => this.onHover?.(on ? id : null),
      click: (hit) => this.onClick?.(id, hit),
    };
  }

  #buildStand() {
    const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x4a3122, roughness: 0.45, clearcoat: 0.6 });
    const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.03, 0.026, 64), lacquer);
    base.scale.set(0.3, 1, 0.14);
    base.position.set(-0.13, 0.013, -0.01);
    base.castShadow = base.receiveShadow = true;
    const rodH = vertebraY(7) - 0.03;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, rodH, 12), steel);
    rod.position.set(SPINE_X, rodH / 2 + 0.02, -0.02);
    rod.castShadow = true;
    base.position.x -= 0.1;
    this.group.add(base);
    this.inner.add(rod);
  }

  #buildSpine() {
    const bone = new THREE.MeshPhysicalMaterial({
      color: 0xe9dfc8, roughness: 0.62, clearcoat: 0.15, emissive: 0xfff0c0, emissiveIntensity: 0,
    });
    const disc = new THREE.MeshPhysicalMaterial({ color: 0xb9c7c9, roughness: 0.5, clearcoat: 0.3 });
    const g = new THREE.Group();
    const names = ['C3', 'C4', 'C5', 'C6', 'C7', 'T1', 'T2', 'T3'];
    names.forEach((n, i) => {
      const y = vertebraY(i);
      const wide = 1 + i * 0.035; // le vertebre crescono in senso caudale
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.047 * wide, 0.049 * wide, 0.052, 24), bone);
      body.scale.z = 0.78;
      body.position.set(SPINE_X, y, -0.02);
      g.add(body);
      for (const side of [-1, 1]) {
        const tp = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.04, 4, 10), bone);
        tp.rotation.z = Math.PI / 2 + side * 0.25;
        tp.position.set(SPINE_X + side * 0.062 * wide, y - 0.004, -0.035);
        g.add(tp);
      }
      const sp = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.05, 4, 10), bone);
      sp.rotation.x = Math.PI / 2 - 0.45;
      sp.position.set(SPINE_X, y - 0.016, -0.085);
      g.add(sp);
      if (i < names.length - 1) {
        const d = new THREE.Mesh(new THREE.CylinderGeometry(0.044 * wide, 0.044 * wide, 0.023, 24), disc);
        d.scale.z = 0.78;
        d.position.set(SPINE_X, y - 0.0375, -0.02);
        g.add(d);
      }
    });
    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.userData.ui = this.#ui('spine', 'colonna vertebrale (C3-T3)');
      }
    });
    this.inner.add(g);
    this.structs.set('spine', { group: g, mats: [bone], shown: 1, target: 1, always: true });
  }

  #buildNerves() {
    for (const d of DEFS) {
      const seg = {
        ...d,
        matA: nerveMaterial(), // a monte di un eventuale taglio
        matB: nerveMaterial(), // a valle
        group: new THREE.Group(),
      };
      this.segs.set(d.id, seg);
      this.inner.add(seg.group);
      this.#rebuild(seg);
    }
    // disco che segna il punto di taglio
    this.cutMark = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 0.006, 20),
      new THREE.MeshStandardMaterial({ color: 0xb3261e, emissive: 0xb3261e, emissiveIntensity: 0.6 })
    );
    this.cutMark.visible = false;
    this.inner.add(this.cutMark);
  }

  #rebuild(seg) {
    for (const c of [...seg.group.children]) {
      c.geometry.dispose();
      seg.group.remove(c);
    }
    const curves = seg.curves(this.shift);
    seg.main = tubeMesh(curves[0], seg.r, seg.matA);
    // stessa geometria (attributi condivisi), intervallo di disegno distinto
    const tailGeo = new THREE.BufferGeometry();
    tailGeo.setIndex(seg.main.geometry.index);
    Object.assign(tailGeo.attributes, seg.main.geometry.attributes);
    seg.tail = new THREE.Mesh(tailGeo, seg.matB);
    seg.tail.castShadow = true;
    const first = curves[0][0];
    const last = curves[0].at(-1);
    seg.group.add(seg.main, seg.tail, ball(first, seg.r, seg.matA), ball(last, seg.r, seg.matB));
    for (const pts of curves.slice(1)) seg.group.add(tubeMesh(pts, seg.r * 0.8, seg.matA));
    for (const m of seg.group.children) m.userData.ui = this.#ui(seg.id, seg.name);
    seg.main.userData.cuttable = true;
    seg.tail.userData.cuttable = true;
    this.#applyCut(seg);
  }

  #applyCut(seg) {
    const n = seg.main.userData.tubular;
    const k = this.cut?.id === seg.id ? this.cut.k : n;
    const per = RADIAL * 6;
    seg.main.geometry.setDrawRange(0, k * per);
    seg.tail.geometry.setDrawRange(k * per, (n - k) * per);
    seg.tail.visible = k < n;
  }

  #buildRelations() {
    const bone = () => new THREE.MeshPhysicalMaterial({ color: 0xe9dfc8, roughness: 0.6, clearcoat: 0.15, emissive: 0xfff0c0, emissiveIntensity: 0, transparent: true });
    const muscle = () => new THREE.MeshPhysicalMaterial({ color: 0xa8433a, roughness: 0.55, clearcoat: 0.25, emissive: 0xff8a70, emissiveIntensity: 0, transparent: true });
    const artery = () => new THREE.MeshPhysicalMaterial({ color: 0xc2222b, roughness: 0.3, clearcoat: 0.7, emissive: 0xff5050, emissiveIntensity: 0, transparent: true });

    const add = (id, name, build) => {
      const g = new THREE.Group();
      const mats = build(g);
      g.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.userData.ui = this.#ui(id, name);
        }
      });
      g.visible = false;
      this.inner.add(g);
      this.structs.set(id, { group: g, mats, shown: 0, target: 0 });
    };

    add('clavicle', 'clavicola', (g) => {
      const m = bone();
      const t = tubeMesh([V(-0.27, 0.455, 0.13), V(-0.12, 0.475, 0.15), V(0.03, 0.515, 0.125), V(0.2, 0.555, 0.07), V(0.36, 0.578, 0.04), V(0.45, 0.572, 0.04)], 0.021, m, 60);
      g.add(t, ball(V(-0.27, 0.455, 0.13), 0.027, m), ball(V(0.45, 0.572, 0.04), 0.024, m));
      return [m];
    });
    add('rib1', 'prima costa', (g) => {
      const m = bone();
      const t = tubeMesh([V(-0.345, 0.44, -0.045), V(-0.2, 0.44, -0.04), V(-0.06, 0.415, 0.02), V(-0.05, 0.385, 0.09), V(-0.14, 0.365, 0.135), V(-0.27, 0.355, 0.15)], 0.015, m, 60);
      t.scale.y = 0.7;
      t.position.y = 0.123;
      g.add(t);
      return [m];
    });
    add('scalenes', 'muscoli scaleni', (g) => {
      const m = muscle();
      const ant = tubeMesh([V(-0.345, 0.79, 0.035), V(-0.3, 0.63, 0.065), V(-0.2, 0.47, 0.09), V(-0.13, 0.4, 0.09)], 0.025, m, 40);
      const mid = tubeMesh([V(-0.36, 0.85, -0.055), V(-0.315, 0.67, -0.05), V(-0.23, 0.51, -0.05), V(-0.16, 0.445, -0.045)], 0.03, m, 40);
      ant.userData.name = 'muscolo scaleno anteriore';
      mid.userData.name = 'muscolo scaleno medio';
      g.add(ant, mid);
      return [m];
    });
    add('artery', 'arteria succlavia / ascellare', (g) => {
      const m = artery();
      g.add(tubeMesh([V(-0.31, 0.32, 0.07), V(-0.21, 0.405, 0.05), V(-0.08, 0.425, 0.035), V(0.06, 0.428, 0.012), V(0.16, 0.438, 0.004), V(0.3, 0.39, 0.006), V(0.48, 0.27, 0.02), V(0.6, 0.15, 0.02)], 0.019, m, 90));
      return [m];
    });
    add('pecMinor', 'muscolo piccolo pettorale e processo coracoideo', (g) => {
      const m = muscle();
      const b = bone();
      const cor = V(0.335, 0.522, 0.09);
      for (const end of [V(0.08, 0.2, 0.15), V(0.15, 0.15, 0.15), V(0.23, 0.11, 0.14)]) {
        const mid = cor.clone().lerp(end, 0.5).add(V(0.012, 0, 0.022));
        const t = tubeMesh([cor, mid, end], 0.023, m, 30);
        g.add(t);
      }
      const c = tubeMesh([V(0.42, 0.565, 0.02), V(0.375, 0.555, 0.06), cor], 0.016, b, 16);
      g.add(c, ball(cor, 0.018, b));
      return [m, b];
    });

    // punti di compressione
    const mk = (id, name, p, needs) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0x19c2d6, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), mat);
      s.position.copy(p);
      s.renderOrder = 20;
      s.visible = false;
      const label = billboard(name, { fontSize: 0.03, color: 0x0b6e7a });
      label.position.copy(p).add(V(0.02, 0.105, 0.06));
      label.material.depthTest = false;
      label.renderOrder = 21;
      label.visible = false;
      this.inner.add(s, label);
      this.markers.push({ id, mesh: s, label, mat, needs, level: 0 });
    };
    mk('costoclav', 'spazio costo-clavicolare', V(0.03, 0.47, 0.07), ['clavicle']);
    mk('subcorac', 'spazio subcoracoideo', V(0.29, 0.415, 0.06), ['pecMinor']);
  }

  #buildLabels() {
    LEVELS.forEach((name, i) => {
      const t = billboard(name, { fontSize: 0.034, font: FONT.bold });
      t.position.set(SPINE_X - 0.135, foramenY(i), 0);
      this.inner.add(t);
      this.labels.set(name, t);
    });
    for (const id of TERMINALS) {
      const seg = this.segs.get(id);
      const end = seg.curves(0)[0].at(-1);
      const below = id === 'ULN';
      const t = billboard(seg.short, { fontSize: 0.028, font: FONT.italic, anchorX: below ? 'right' : 'left' });
      t.position.copy(end).add(below ? V(-0.03, 0.005, 0.02) : V(0.03, 0, 0));
      t.material.depthTest = false;
      t.renderOrder = 30;
      t.visible = false;
      this.inner.add(t);
      this.endLabels.set(id, t);
    }
  }

  // --- stato ----------------------------------------------------------------
  // Nome della radice i-esima nella conformazione corrente.
  rootLevel(i) {
    return LEVELS[i + 1 + Math.round(this.shiftTarget)];
  }

  setVariant(shift) {
    this.shiftTarget = shift;
    ROOTS.forEach((r, i) => {
      const seg = this.segs.get(r);
      for (const m of seg.group.children) m.userData.ui.tip = `radice ${this.rootLevel(i)}`;
    });
  }

  setStructure(id, on) {
    this.structs.get(id).target = on ? 1 : 0;
  }

  showEndLabels(on) {
    for (const t of this.endLabels.values()) t.visible = on;
  }

  setCut(id, k) {
    const prev = this.cut && this.segs.get(this.cut.id);
    this.cut = id ? { id, k } : null;
    if (prev) this.#applyCut(prev);
    this.cutMark.visible = !!id;
    if (!id) return;
    const seg = this.segs.get(id);
    this.#applyCut(seg);
    const curve = new THREE.CatmullRomCurve3(seg.curves(this.shift)[0], false, 'centripetal');
    const u = k / seg.main.userData.tubular;
    this.cutMark.position.copy(curve.getPoint(u));
    this.cutMark.quaternion.setFromUnitVectors(V(0, 1, 0), curve.getTangent(u));
    this.cutMark.scale.set(seg.r * 1.7, 1, seg.r * 1.7);
  }

  // Punto di taglio (indice lungo il tubo) a partire da un'intersezione.
  cutIndexFromHit(id, hit) {
    const seg = this.segs.get(id);
    const n = seg.main.userData.tubular;
    if (!hit.object.userData.cuttable) return 1;
    const k = Math.floor(hit.faceIndex / (RADIAL * 2));
    return Math.min(n - 1, Math.max(1, k));
  }

  // Radici le cui fibre arrivano ancora, intatte, a ciascun segmento.
  aliveFibres() {
    const memo = new Map();
    const get = (id, whole) => {
      // whole=false: fibre che superano l'intero segmento (taglio compreso)
      const key = id + (whole ? '+' : '');
      if (memo.has(key)) return memo.get(key);
      const seg = this.segs.get(id);
      let set;
      if (!whole && this.cut?.id === id) set = new Set();
      else if (seg.kind === 'root') set = new Set(seg.roots);
      else {
        set = new Set();
        for (const p of seg.parents) for (const r of get(p, false)) if (seg.roots.includes(r)) set.add(r);
      }
      memo.set(key, set);
      return set;
    };
    const out = new Map();
    for (const id of this.segs.keys()) out.set(id, { before: get(id, true), after: get(id, false) });
    return out;
  }

  ancestors(id, acc = new Set()) {
    acc.add(id);
    for (const p of this.segs.get(id).parents) this.ancestors(p, acc);
    return acc;
  }

  // --- aggiornamento per fotogramma -----------------------------------------
  update(dt, camera, realDt = dt) {
    this.time += realDt; // le accensioni progressive seguono il tempo reale
    const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 10);

    // variante anatomica: le radici scorrono lungo la colonna
    if (Math.abs(this.shiftTarget - this.shift) > 1e-3) {
      this.shift += (this.shiftTarget - this.shift) * (1 - Math.exp(-dt * 7));
      if (Math.abs(this.shiftTarget - this.shift) < 4e-3) this.shift = this.shiftTarget;
      for (const id of [...ROOTS, 'LT']) this.#rebuild(this.segs.get(id));
    }

    const hovering = this.hover.size > 0;
    const tmp = new THREE.Color();
    for (const seg of this.segs.values()) {
      const look = this.lookFn(seg);
      const hot = this.hover.has(seg.id);
      for (const [mat, l] of [[seg.matA, look], [seg.matB, look.tail ?? look]]) {
        tmp.set(l.color);
        let glow = l.glow ?? 0;
        if (hot) {
          tmp.lerp(new THREE.Color(LIT), 0.55);
          glow = Math.max(glow, 0.55);
        } else if (hovering) tmp.lerp(new THREE.Color(DIM), 0.45);
        mat.color.lerp(tmp, k);
        mat.emissive.copy(mat.color);
        mat.emissiveIntensity += (glow - mat.emissiveIntensity) * k;
      }
    }

    for (const [id, s] of this.structs) {
      s.shown += (s.target - s.shown) * k;
      const vis = s.shown > 0.02;
      s.group.visible = vis;
      const glow = this.hover.has(id) ? 0.5 : 0;
      for (const m of s.mats) {
        if (!s.always) m.opacity = s.shown;
        m.emissiveIntensity += (glow - m.emissiveIntensity) * k;
      }
    }

    for (const mk of this.markers) {
      const on = mk.needs.every((n) => this.structs.get(n).target === 1) ? 1 : 0;
      mk.level += (on - mk.level) * k;
      mk.mesh.visible = mk.label.visible = mk.level > 0.03;
      const hot = this.hover.has(mk.id) ? 0.25 : 0;
      mk.mat.opacity = mk.level * (0.3 + hot + 0.14 * Math.sin(this.time * 4));
      mk.mesh.scale.setScalar(1 + 0.08 * Math.sin(this.time * 4));
      mk.label.fillOpacity = mk.label.outlineOpacity = mk.level;
    }

    // etichette sempre rivolte alla camera
    const inv = new THREE.Quaternion();
    this.inner.getWorldQuaternion(inv).invert();
    const q = inv.multiply(camera.quaternion);
    for (const [name, t] of this.labels) {
      t.quaternion.copy(q);
      const look = this.labelFn(name);
      const o = typeof look === 'number' ? look : look.opacity;
      t.fillOpacity += (o - t.fillOpacity) * k;
      t.outlineOpacity = t.fillOpacity;
      t.color = typeof look === 'number' ? 0x2a2520 : look.color;
    }
    for (const t of this.endLabels.values()) t.quaternion.copy(q);
    for (const mk of this.markers) mk.label.quaternion.copy(q);
  }
}
