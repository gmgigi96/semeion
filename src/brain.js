// Modello dell'encefalo "in resina trasparente": emisferi, tronco e cervelletto
// sono un involucro di contesto; all'interno, a colori, le strutture profonde
// (ventricoli, nuclei della base, sistema limbico). Ogni capitolo mostra solo
// le parti che gli servono.
//
// Coordinate del modello: x laterale (destra +), y craniale, z anteriore.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { AnatomyModel } from './model.js';
import { V, taperTube, ellipsoid, mirror, both, arc } from './geo.js';

const P = (list) => list.map((p) => V(...p));
const tube = (pts, r, opts) => taperTube(P(pts), r, opts);

// Catena di sferette: plessi corioidei, granulazioni.
function beads(pts, n, r, jitter = 0.004) {
  const curve = new THREE.CatmullRomCurve3(P(pts));
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 2;
  const list = [];
  for (let i = 0; i < n; i++) {
    const p = curve.getPointAt(i / Math.max(1, n - 1));
    const g = new THREE.SphereGeometry(r * (0.8 + 0.4 * Math.abs(rnd())), 10, 8);
    g.translate(p.x + rnd() * jitter, p.y + rnd() * jitter, p.z + rnd() * jitter);
    list.push(g);
  }
  return mergeGeometries(list);
}

function hemisphere() {
  const g = new THREE.SphereGeometry(1, 56, 40);
  g.scale(0.3, 0.275, 0.405);
  g.translate(0.165, 0.44, -0.01);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    // faccia mediale piatta lungo la scissura interemisferica, base appiattita
    if (p.getX(i) < 0.01) p.setX(i, 0.01);
    if (p.getY(i) < 0.24) p.setY(i, 0.24 + (p.getY(i) - 0.24) * 0.35);
  }
  g.computeVertexNormals();
  return g;
}

export class Brain extends AnatomyModel {
  constructor() {
    super({ tilt: -0.6 });
    this.inner.position.set(0, 0, 0.02);
    this.#stand();
    this.#shell();
    this.#ventricles();
    this.#basalGanglia();
    this.#limbic();
    this.#pathways();
  }

  #stand() {
    const wood = new THREE.MeshPhysicalMaterial({ color: 0x4a3122, roughness: 0.45, clearcoat: 0.6 });
    const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.03, 0.026, 64), wood);
    base.scale.set(0.2, 1, 0.2);
    base.position.set(0, 0.013, -0.08);
    base.castShadow = base.receiveShadow = true;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.16, 12), steel);
    rod.position.set(0, 0.09, -0.15);
    rod.castShadow = true;
    this.flat.add(base);
    this.inner.add(rod);
  }

  #shell() {
    const lobe = ellipsoid([0.2, 0.255, 0.05], [0.1, 0.085, 0.2], null, 36);
    this.addPart('hemi', 'emisferi cerebrali', 0xe7c9b9, [...both(hemisphere()), ...both(lobe)], { ghost: true, opacity: 0.11 });
    this.addPart('stem', 'tronco encefalico', 0xe3cdb6, [
      tube([[0, 0.365, -0.045], [0, 0.3, -0.075], [0, 0.235, -0.095], [0, 0.14, -0.125], [0, 0.03, -0.15]], [0.07, 0.062, 0.075, 0.045, 0.03], { radial: 24 }),
    ], { ghost: true, opacity: 0.13 });
    this.addPart('cerebellum', 'cervelletto', 0xdcb9a6, [ellipsoid([0, 0.2, -0.275], [0.25, 0.115, 0.14], null, 36)], { ghost: true, opacity: 0.12 });
  }

  #ventricles() {
    const CSF = 0x3f9ec4;
    this.addPart('lvFront', 'corno frontale del ventricolo laterale', CSF,
      both(tube([[0.06, 0.455, 0.21], [0.05, 0.485, 0.15], [0.042, 0.5, 0.07]], [0.02, 0.034, 0.028])));
    this.addPart('lvBody', 'cella media del ventricolo laterale', CSF,
      both(tube([[0.042, 0.5, 0.075], [0.043, 0.512, -0.02], [0.062, 0.498, -0.105]], [0.028, 0.022, 0.027], { flat: { y: 0.72 } })));
    this.addPart('lvTrig', 'trigono collaterale', CSF, both(ellipsoid([0.085, 0.47, -0.145], [0.036, 0.04, 0.042])));
    this.addPart('lvTemp', 'corno temporale del ventricolo laterale', CSF,
      both(tube([[0.1, 0.44, -0.15], [0.14, 0.36, -0.14], [0.168, 0.3, -0.05], [0.172, 0.27, 0.07]], [0.03, 0.024, 0.02, 0.016])));
    this.addPart('lvOcc', 'corno occipitale del ventricolo laterale', CSF,
      both(tube([[0.09, 0.46, -0.17], [0.09, 0.45, -0.25], [0.075, 0.44, -0.32]], [0.026, 0.016, 0.008])));
    this.addPart('monro', 'forame interventricolare di Monro', 0x2c7fa6,
      both(tube([[0.04, 0.475, 0.065], [0.02, 0.447, 0.06], [0.004, 0.425, 0.055]], 0.009, { caps: false })));
    this.addPart('v3', 'terzo ventricolo', CSF, [ellipsoid([0, 0.385, 0], [0.012, 0.06, 0.09])]);
    this.addPart('aqueduct', 'acquedotto di Silvio', 0x2c7fa6,
      [tube([[0, 0.365, -0.08], [0, 0.31, -0.115], [0, 0.262, -0.135]], 0.007, { caps: false })]);
    this.addPart('v4', 'quarto ventricolo', CSF, [ellipsoid([0, 0.215, -0.15], [0.05, 0.055, 0.028], [0.25, 0, 0])]);
    this.addPart('luschka', 'forami di Luschka (recessi laterali)', 0x2c7fa6,
      both(tube([[0.03, 0.21, -0.15], [0.065, 0.202, -0.145], [0.09, 0.2, -0.135]], [0.012, 0.009, 0.007])));
    this.addPart('magendie', 'forame di Magendie', 0x2c7fa6,
      [tube([[0, 0.185, -0.165], [0, 0.165, -0.185], [0, 0.15, -0.205]], [0.011, 0.009, 0.007])]);
    this.addPart('canal', "canale centrale dell'ependima", 0x2c7fa6,
      [tube([[0, 0.17, -0.15], [0, 0.1, -0.142], [0, 0.03, -0.15]], 0.004, { caps: false })]);

    const lateral = beads([[0.03, 0.452, 0.06], [0.05, 0.494, -0.02], [0.078, 0.47, -0.13], [0.13, 0.352, -0.135], [0.162, 0.286, -0.03]], 22, 0.0075);
    const third = beads([[0, 0.44, 0.04], [0, 0.446, -0.05]], 6, 0.006, 0.003);
    const fourth = beads([[0.04, 0.2, -0.165], [0, 0.192, -0.172], [-0.04, 0.2, -0.165]], 7, 0.006, 0.003);
    this.addPart('plexus', 'plessi corioidei', 0xc23b3b, [...both(lateral), third, fourth]);

    const sas = hemisphere();
    sas.scale(1.035, 1.035, 1.035);
    sas.translate(0, -0.012, 0);
    this.addPart('sas', 'spazio subaracnoideo', 0x6fd0e8, both(sas), { ghost: true, opacity: 0.2 });
    this.addPart('sinus', 'seno sagittale superiore', 0x3557b7,
      [tube([[0, 0.56, 0.36], [0, 0.705, 0.14], [0, 0.73, -0.08], [0, 0.65, -0.31], [0, 0.5, -0.41]], 0.013, { seg: 50 })]);
    this.addPart('granulations', 'granulazioni aracnoidee', 0xf3ede0,
      both(beads([[0.02, 0.69, 0.16], [0.02, 0.718, -0.04], [0.02, 0.67, -0.26]], 9, 0.009, 0.003)));
  }

  #basalGanglia() {
    const CAUD = 0x3c8d6e;
    this.addPart('caudHead', 'testa del nucleo caudato', CAUD,
      both(tube([[0.09, 0.42, 0.19], [0.097, 0.455, 0.15], [0.104, 0.485, 0.08]], [0.03, 0.042, 0.026])));
    this.addPart('caudBody', 'corpo del nucleo caudato', CAUD,
      both(tube([[0.104, 0.485, 0.085], [0.112, 0.5, -0.02], [0.125, 0.485, -0.11]], [0.026, 0.018, 0.014])));
    this.addPart('caudTail', 'coda del nucleo caudato', CAUD,
      both(tube([[0.125, 0.485, -0.105], [0.15, 0.43, -0.165], [0.175, 0.36, -0.14], [0.186, 0.33, -0.04], [0.176, 0.31, 0.07]], [0.014, 0.011, 0.009, 0.008, 0.007], { seg: 60 })));
    this.addPart('putamen', 'putamen', 0xd97b2b, both(ellipsoid([0.165, 0.375, 0.03], [0.032, 0.05, 0.105], [0, 0.12, 0])));
    this.addPart('gpe', 'globo pallido esterno', 0xe3c14a, both(ellipsoid([0.128, 0.375, 0.02], [0.02, 0.04, 0.07], [0, 0.12, 0])));
    this.addPart('gpi', 'globo pallido interno', 0xb58a2c, both(ellipsoid([0.103, 0.37, 0.01], [0.015, 0.03, 0.045], [0, 0.12, 0])));
    this.addPart('thalamus', 'talamo', 0xc9a27a, both(ellipsoid([0.055, 0.4, -0.02], [0.042, 0.045, 0.085])));
    this.addPart('stn', 'nucleo subtalamico di Luys', 0x8e5bb5, both(ellipsoid([0.06, 0.335, -0.03], [0.024, 0.011, 0.02], [0, 0, 0.35])));
    this.addPart('snc', 'sostanza nera, pars compatta', 0x2f2823, both(ellipsoid([0.045, 0.31, -0.06], [0.032, 0.008, 0.03], [0, 0, 0.3])));
    this.addPart('snr', 'sostanza nera, pars reticolata', 0x8b3a3a, both(ellipsoid([0.05, 0.294, -0.055], [0.032, 0.008, 0.03], [0, 0, 0.3])));
    this.addPart('accumbens', 'nucleus accumbens', 0xe08aa0, both(ellipsoid([0.11, 0.37, 0.14], [0.025, 0.022, 0.03])));
    this.addPart('amygdala', 'amigdala', 0xc9485b, both(ellipsoid([0.16, 0.285, 0.105], [0.026, 0.024, 0.028])));
    this.addPart('cortex', 'corteccia cerebrale (aree motorie)', 0xd98c8c, [ellipsoid([0.13, 0.69, 0.03], [0.075, 0.012, 0.065], [0, 0, -0.42])]);
  }

  #limbic() {
    const GYRUS = 0xd98c8c;
    const WHITE = 0xf1ead8;
    this.addPart('callosum', 'corpo calloso', WHITE,
      [tube([[0, 0.44, 0.19], [0, 0.5, 0.2], [0, 0.55, 0.1], [0, 0.56, -0.03], [0, 0.535, -0.15], [0, 0.48, -0.185]], [0.012, 0.02, 0.016, 0.014, 0.016, 0.024], { flat: { x: 3.4 }, seg: 60 })]);
    this.addPart('cingulate', 'giro del cingolo', GYRUS,
      both(tube([[0.022, 0.43, 0.25], [0.022, 0.55, 0.235], [0.022, 0.61, 0.1], [0.022, 0.615, -0.05], [0.022, 0.575, -0.19], [0.026, 0.5, -0.235]], 0.03, { flat: { x: 0.45 }, seg: 70 })));
    this.addPart('isthmus', 'istmo', 0xc77d7d,
      both(tube([[0.026, 0.5, -0.235], [0.06, 0.42, -0.25], [0.105, 0.33, -0.215]], 0.024, { flat: { x: 0.6 } })));
    this.addPart('parahippocampal', 'circonvoluzione paraippocampale', GYRUS,
      both(tube([[0.105, 0.33, -0.215], [0.13, 0.255, -0.12], [0.135, 0.225, -0.03]], 0.026)));
    this.addPart('entorhinal', 'corteccia entorinale', 0xe0a070,
      both(tube([[0.135, 0.225, -0.035], [0.135, 0.22, 0.03], [0.13, 0.225, 0.075]], 0.027)));
    this.addPart('uncus', 'uncus', 0xc77d7d, both(ellipsoid([0.118, 0.25, 0.1], [0.026, 0.024, 0.028])));
    this.addPart('hippocampus', 'ippocampo', 0xb86a3c,
      both(tube([[0.15, 0.255, 0.06], [0.152, 0.272, -0.04], [0.125, 0.335, -0.13], [0.105, 0.385, -0.155]], [0.024, 0.02, 0.014, 0.008])));
    this.addPart('fimbria', 'fimbria', WHITE,
      both(tube([[0.135, 0.283, 0.03], [0.135, 0.298, -0.05], [0.112, 0.355, -0.135], [0.095, 0.4, -0.16]], 0.006, { caps: false })));
    this.addPart('crus', 'gambe del fornice', WHITE,
      both(tube([[0.095, 0.4, -0.16], [0.06, 0.455, -0.155], [0.022, 0.488, -0.1]], 0.008, { caps: false })));
    this.addPart('fxBody', 'corpo del fornice', WHITE,
      both(tube([[0.022, 0.488, -0.1], [0.012, 0.5, -0.02], [0.012, 0.485, 0.05]], 0.009, { caps: false })));
    this.addPart('fxCol', 'colonne del fornice', WHITE,
      both(tube([[0.012, 0.485, 0.05], [0.012, 0.455, 0.078], [0.012, 0.41, 0.078]], 0.008, { caps: false })));
    this.addPart('fxPost', 'fornice postcommessurale', WHITE,
      both(tube([[0.012, 0.41, 0.078], [0.014, 0.37, 0.06], [0.015, 0.337, 0.026]], 0.007, { caps: false })));
    this.addPart('fxPre', 'fornice precommessurale', WHITE,
      both(tube([[0.012, 0.452, 0.08], [0.012, 0.432, 0.105], [0.012, 0.405, 0.125]], 0.006, { caps: false })));
    this.addPart('commissure', 'commessura anteriore', 0xd8cfb8,
      [tube([[-0.1, 0.38, 0.065], [-0.04, 0.4, 0.088], [0, 0.405, 0.092], [0.04, 0.4, 0.088], [0.1, 0.38, 0.065]], 0.008)]);
    this.addPart('mammillary', 'corpi mammillari', 0xd9c06a, both(ellipsoid([0.015, 0.325, 0.02], [0.014, 0.014, 0.014])));
    this.addPart('mtt', 'fascio mammillotalamico', WHITE,
      both(tube([[0.015, 0.335, 0.02], [0.022, 0.38, 0.036], [0.03, 0.43, 0.042]], 0.006, { caps: false })));
    this.addPart('anterior', 'nuclei anteriori del talamo', 0xa8794f, both(ellipsoid([0.034, 0.445, 0.045], [0.02, 0.016, 0.022])));
    this.addPart('septal', 'area settale', 0x9bc46a, both(ellipsoid([0.012, 0.395, 0.135], [0.011, 0.028, 0.02])));
    this.addPart('hypothalamus', 'ipotalamo', 0x5aa7a0, both(ellipsoid([0.02, 0.352, 0.055], [0.018, 0.028, 0.036])));
    this.addPart('stria', 'stria terminale', 0xe7a0aa,
      both(tube([[0.16, 0.3, 0.09], [0.172, 0.325, -0.04], [0.16, 0.365, -0.13], [0.13, 0.44, -0.15], [0.105, 0.47, -0.1], [0.092, 0.478, -0.02], [0.075, 0.455, 0.06], [0.03, 0.37, 0.07]], 0.005, { seg: 80, caps: false })));
    this.addPart('vta', 'area tegmentale ventrale', 0x6a4fb0, both(ellipsoid([0.015, 0.3, -0.045], [0.014, 0.014, 0.018])));
  }

  // Connessioni dell'emisfero destro. Verde: eccitatoria (glutammato);
  // rosso: inibitoria (GABA); viola: dopaminergica.
  #pathways() {
    const GLU = 0x1f9d57, GABA = 0xd43d3d, DA = 0x7a4fd0;
    const c = (id) => this.parts.get(id).center.clone();
    const front = [0, 0.03, 0.11];
    this.addLink('ctx-str', P([[0.13, 0.675, 0.03], [0.165, 0.56, 0.06], [0.168, 0.428, 0.045]]), { color: GLU });
    this.addLink('str-gpi', arc(c('putamen').add(V(0, -0.03, 0.05)), c('gpi').add(V(0, -0.02, 0.03)), [0, -0.05, 0.09]), { color: GABA, inhibit: true });
    this.addLink('str-gpe', arc(c('putamen').add(V(0, 0.02, 0.06)), c('gpe').add(V(0, 0.02, 0.05)), [0, 0.03, 0.07]), { color: GABA, inhibit: true });
    this.addLink('gpe-gpi', arc(c('gpe').add(V(0, 0.03, 0.03)), c('gpi').add(V(0, 0.025, 0.02)), [0, 0.05, 0.05]), { color: GABA, inhibit: true });
    this.addLink('gpe-stn', arc(c('gpe').add(V(0, -0.03, 0)), c('stn').add(V(0.01, 0.005, 0.01)), [0.01, -0.04, 0.07]), { color: GABA, inhibit: true });
    this.addLink('stn-gpi', arc(c('stn').add(V(0.015, 0.008, 0)), c('gpi').add(V(0, -0.028, 0)), front), { color: GLU });
    this.addLink('gpi-thal', arc(c('gpi').add(V(-0.01, 0.02, 0)), c('thalamus').add(V(0.02, 0.02, 0.05)), [0, 0.06, 0.06]), { color: GABA, inhibit: true });
    this.addLink('thal-ctx', P([[0.06, 0.445, -0.02], [0.07, 0.56, -0.02], [0.1, 0.672, 0.01]]), { color: GLU });
    this.addLink('ctx-stn', P([[0.105, 0.68, 0.05], [0.04, 0.55, 0.12], [0.035, 0.4, 0.09], [0.055, 0.345, -0.015]]), { color: GLU });
    this.addLink('snc-str', arc(c('snc'), c('putamen').add(V(0, -0.045, -0.03)), [0.02, -0.06, 0.02]), { color: DA });
    // via mesolimbica
    const vta = c('vta');
    this.addLink('vta-acc', P([vta.toArray(), [0.04, 0.325, 0.05], [0.1, 0.36, 0.125]]), { color: DA });
    this.addLink('vta-septal', P([vta.toArray(), [0.008, 0.33, 0.07], [0.012, 0.385, 0.128]]), { color: DA });
    this.addLink('vta-amy', P([vta.toArray(), [0.08, 0.27, 0.03], [0.15, 0.28, 0.095]]), { color: DA });
  }
}

