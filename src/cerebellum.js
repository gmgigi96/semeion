// Modello del cervelletto con tronco encefalico, peduncoli e nuclei profondi.
// La corteccia è divisa in regioni (lobi e porzioni funzionali) che si
// possono rendere trasparenti per mostrare ciò che sta dentro.
//
// Coordinate del modello: x laterale, y craniale, z anteriore (verso il tronco).
import * as THREE from 'three';
import { AnatomyModel } from './model.js';
import { V, taperTube, ellipsoid, both } from './geo.js';

const P = (list) => list.map((p) => V(...p));
const tube = (pts, r, opts) => taperTube(P(pts), r, opts);
const C = [0, 0.36, -0.08]; // centro del cervelletto
const W = 0.3, RY = 0.185, RZ = 0.2;
const DEG = Math.PI / 180;

// Porzione della superficie cerebellare. `a` è l'angolo lungo il verme
// (0° = sommità, 90° = polo posteriore, 180° = faccia inferiore),
// `s` la posizione medio-laterale (0 = linea mediana, 1 = margine laterale).
function patch(a0, a1, s0, s1, { folia = true, shrink = 1 } = {}) {
  const na = Math.max(6, Math.round((a1 - a0) * 1.1));
  const ns = Math.max(4, Math.round(Math.abs(s1 - s0) * 34));
  const pos = [];
  const idx = [];
  for (let i = 0; i <= na; i++) {
    const a = (a0 + ((a1 - a0) * i) / na) * DEG;
    for (let j = 0; j <= ns; j++) {
      const s = s0 + ((s1 - s0) * j) / ns;
      const f = Math.sqrt(Math.max(0.01, 1 - s * s * 0.985));
      let k = shrink;
      if (folia) k *= 1 + 0.014 * Math.sin(a * 44); // lamelle trasversali
      k *= 1 - 0.04 * Math.exp(-(((Math.abs(s) - 0.2) / 0.045) ** 2)); // docce paravermiane
      pos.push(C[0] + s * W, C[1] + f * RY * Math.cos(a) * k, C[2] - f * RZ * Math.sin(a) * k);
    }
  }
  const w = ns + 1;
  for (let i = 0; i < na; i++)
    for (let j = 0; j < ns; j++) {
      const p = i * w + j, q = p + w;
      idx.push(p, q, p + 1, q, q + 1, p + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
const sides = (a0, a1, s0, s1, o) => [patch(a0, a1, s0, s1, o), patch(a0, a1, -s1, -s0, o)];
const VERMIS = 0.2;

export class Cerebellum extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: 0.06, rod: [0, 0.02, 0.1, 0.1] });
    this.#cortex();
    this.#stem();
    this.#nuclei();
    this.#pathways();
  }

  #cortex() {
    const o = { double: true };
    this.addPart('lingula', 'lingula', 0x9bb86a, [patch(-52, -38, -VERMIS, VERMIS)], o);
    this.addPart('antVermis', 'verme del lobo anteriore', 0xb9744f, [patch(-38, 18, -VERMIS, VERMIS)], o);
    this.addPart('antHemi', 'emisfero del lobo anteriore', 0xcf9068, sides(-52, 18, VERMIS, 1), o);
    this.addPart('postVermis', 'verme del lobo posteriore', 0xc7a184, [patch(18, 150, -VERMIS, VERMIS)], o);
    this.addPart('pyramis', 'piramide del verme', 0xb9744f, [patch(150, 180, -VERMIS, VERMIS)], o);
    this.addPart('uvula', 'uvula', 0x9bb86a, [patch(180, 212, -VERMIS, VERMIS)], o);
    this.addPart('postHemi', 'emisfero del lobo posteriore', 0xdcb89e, sides(18, 250, VERMIS, 1), o);
    this.addPart('nodulus', 'nodulo', 0x7fa348, [patch(212, 250, -VERMIS, VERMIS)], o);
    this.addPart('flocculus', 'flocculo', 0x7fa348, both(ellipsoid([0.17, 0.255, 0.085], [0.06, 0.03, 0.036], [0, 0.3, 0.2])));
    this.addPart('medullary', 'corpo midollare (ilo del cervelletto)', 0xf1ead8, [patch(250, 308, -1, 1, { folia: false, shrink: 0.82 })], o);
  }

  #stem() {
    const STEM = 0xe6d5bd;
    const o = { opacity: 0.55 };
    this.addPart('midbrain', 'mesencefalo', STEM, [tube([[0, 0.7, 0.05], [0, 0.63, 0.085], [0, 0.55, 0.115]], [0.058, 0.06, 0.062], { radial: 22 })], o);
    this.addPart('pons', 'ponte', 0xe9d2b4, [ellipsoid([0, 0.44, 0.15], [0.105, 0.095, 0.09])], o);
    this.addPart('medulla', 'bulbo', STEM, [tube([[0, 0.36, 0.135], [0, 0.26, 0.125], [0, 0.16, 0.112], [0, 0.07, 0.1]], [0.06, 0.055, 0.042, 0.034], { radial: 22 })], o);

    const WHITE = 0xf4eedd;
    this.addPart('scp', 'peduncolo cerebellare superiore', WHITE,
      both(tube([[0.07, 0.385, 0.01], [0.055, 0.48, 0.045], [0.032, 0.575, 0.075]], [0.022, 0.018, 0.016])));
    this.addPart('mcp', 'peduncolo cerebellare medio', 0xeadfc6,
      both(tube([[0.085, 0.44, 0.15], [0.135, 0.42, 0.09], [0.145, 0.385, 0.01]], [0.034, 0.036, 0.04])));
    this.addPart('icp', 'peduncolo cerebellare inferiore', WHITE,
      both(tube([[0.045, 0.25, 0.09], [0.07, 0.31, 0.06], [0.09, 0.355, 0.005]], [0.016, 0.019, 0.022])));
  }

  #nuclei() {
    this.addPart('fastigial', 'nucleo del fastigio', 0x3f7fc4, both(ellipsoid([0.03, 0.375, -0.03], [0.022, 0.018, 0.022])));
    this.addPart('interposed', 'nucleo interposito', 0x2fa58a, both(ellipsoid([0.075, 0.372, -0.04], [0.02, 0.018, 0.03])));
    // nucleo dentato: una lamina pieghettata, come l'oliva bulbare
    const dentate = ellipsoid([0, 0, 0], [0.048, 0.03, 0.046], null, 40);
    const p = dentate.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = 1 + 0.09 * Math.sin(Math.atan2(p.getZ(i), p.getX(i)) * 9) * Math.cos(p.getY(i) * 40);
      p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k);
    }
    dentate.translate(0.14, 0.368, -0.05);
    dentate.computeVertexNormals();
    this.addPart('dentate', 'nucleo dentato', 0xd9a21b, both(dentate));

    this.addPart('red', 'nucleo rosso', 0xc23b3b, both(ellipsoid([0.024, 0.625, 0.085], [0.017, 0.017, 0.017])));
    this.addPart('pontine', 'nuclei basilari del ponte', 0xd97b2b, both(ellipsoid([0.042, 0.44, 0.2], [0.036, 0.045, 0.022])));
    this.addPart('olive', 'complesso olivare inferiore', 0x8e5bb5, both(ellipsoid([0.032, 0.265, 0.16], [0.017, 0.036, 0.017])));
    this.addPart('vestibular', 'nuclei vestibolari', 0x4aa3c7, both(ellipsoid([0.05, 0.355, 0.085], [0.016, 0.03, 0.016])));
    this.addPart('thalamus', 'talamo (nucleo ventrale laterale)', 0xc9a27a, [ellipsoid([-0.06, 0.8, 0.03], [0.045, 0.035, 0.06])]);
  }

  // Verde: eccitatoria; arancio: fibra rampicante; rosso: inibitoria.
  #pathways() {
    const GLU = 0x1f9d57, CLIMB = 0xe07b00, GABA = 0xd43d3d;
    this.addLink('fast-vest', P([[0.03, 0.372, -0.02], [0.05, 0.35, 0.03], [0.05, 0.352, 0.075]]), { color: GLU });
    this.addLink('inter-red', P([[0.075, 0.375, -0.03], [0.055, 0.48, 0.05], [0.0, 0.57, 0.085], [-0.022, 0.615, 0.085]]), { color: GLU });
    this.addLink('dent-thal', P([[0.13, 0.375, -0.04], [0.06, 0.48, 0.05], [0.0, 0.58, 0.085], [-0.045, 0.7, 0.06], [-0.058, 0.77, 0.035]]), { color: GLU });
    this.addLink('mossy', P([[-0.04, 0.44, 0.2], [0.07, 0.45, 0.2], [0.14, 0.42, 0.09], [0.17, 0.42, -0.03], [0.19, 0.5, -0.1]]), { color: GLU });
    this.addLink('climb', P([[-0.03, 0.265, 0.16], [0.035, 0.27, 0.12], [0.075, 0.315, 0.05], [0.115, 0.4, -0.02], [0.15, 0.49, -0.1]]), { color: CLIMB });
    this.addLink('climb-nuc', P([[0.1, 0.36, 0.0], [0.115, 0.365, -0.02], [0.13, 0.368, -0.04]]), { color: CLIMB });
    this.addLink('purkinje', P([[0.2, 0.49, -0.11], [0.185, 0.42, -0.085], [0.16, 0.38, -0.06]]), { color: GABA, inhibit: true });
    this.addLink('nuc-olive', P([[0.125, 0.355, -0.035], [0.08, 0.32, 0.04], [0.01, 0.285, 0.12], [-0.022, 0.27, 0.15]]), { color: GABA, inhibit: true });
  }
}
