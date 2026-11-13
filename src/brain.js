// Modello dell'encefalo. Le strutture sono mesh anatomiche reali di
// BodyParts3D (public/meshes/brain.glb, vedi meshes/brain.json): corteccia,
// tronco e cervelletto fanno da involucro trasparente; ventricoli, nuclei della
// base e sistema limbico sono a colori. Ciò che BodyParts3D non contiene
// (nucleo subtalamico, sostanza nera, accumbens, area tegmentale ventrale,
// nuclei anteriori del talamo, fascio mammillotalamico, istmo, uncus, seno
// sagittale, granulazioni, forami del quarto ventricolo) è aggiunto come forma
// schematica nella stessa terna di riferimento, così come le vie.
//
// Coordinate del modello: x laterale (destra +), y craniale, z anteriore.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { AnatomyModel } from './model.js';
import { V, taperTube, ellipsoid, both, arc } from './geo.js';

const P = (list) => list.map((p) => V(...p));
const tube = (pts, r, opts) => taperTube(P(pts), r, opts);

// Catena di sferette: granulazioni aracnoidee.
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

const CSF = 0x3f9ec4, PASSAGE = 0x2c7fa6, CAUD = 0x3c8d6e, WHITE = 0xf1ead8, GYRUS = 0xd98c8c;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  hemi: ['emisferi cerebrali', 0xe7c9b9, { ghost: true, opacity: 0.1 }],
  stem: ['tronco encefalico', 0xe3cdb6, { ghost: true, opacity: 0.12 }],
  cerebellum: ['cervelletto', 0xdcb9a6, { ghost: true, opacity: 0.1 }],
  lvFront: ['corno frontale del ventricolo laterale', CSF],
  lvBody: ['cella media del ventricolo laterale', CSF],
  lvTrig: ['trigono collaterale', CSF],
  lvTemp: ['corno temporale del ventricolo laterale', CSF],
  lvOcc: ['corno occipitale del ventricolo laterale', CSF],
  monro: ['forame interventricolare di Monro', PASSAGE],
  v3: ['terzo ventricolo', CSF],
  aqueduct: ['acquedotto di Silvio', PASSAGE],
  v4: ['quarto ventricolo', CSF],
  canal: ["canale centrale dell'ependima", PASSAGE],
  plexus: ['plessi corioidei', 0xc23b3b],
  caudHead: ['testa del nucleo caudato', CAUD],
  caudBody: ['corpo del nucleo caudato', CAUD],
  caudTail: ['coda del nucleo caudato', CAUD],
  putamen: ['putamen', 0xd97b2b],
  gpe: ['globo pallido esterno', 0xe3c14a],
  gpi: ['globo pallido interno', 0xb58a2c],
  thalamus: ['talamo', 0xc9a27a],
  amygdala: ['amigdala', 0xc9485b],
  capsule: ['capsula interna', WHITE],
  cortex: ['giro precentrale (corteccia motoria)', GYRUS],
  callosum: ['corpo calloso', WHITE],
  cingulate: ['giro del cingolo', GYRUS],
  parahippocampal: ['circonvoluzione paraippocampale', GYRUS],
  entorhinal: ['corteccia entorinale', 0xe0a070],
  hippocampus: ['ippocampo', 0xb86a3c],
  crus: ['fimbria e gambe del fornice', WHITE],
  fxBody: ['corpo del fornice', WHITE],
  fxCol: ['colonne del fornice', 0xe6dcc0],
  commissure: ['commessura anteriore', 0xd8cfb8],
  mammillary: ['corpi mammillari', 0xd9c06a],
  hypothalamus: ['ipotalamo', 0x5aa7a0],
  stria: ['stria terminale', 0xe7a0aa],
  septal: ['setto pellucido e area settale', 0x9bc46a],
};

export class Brain extends AnatomyModel {
  constructor() {
    super({ tilt: -0.6 });
    this.addStand({ radius: 0.2, z: -0.06, rod: [0, 0.02, 0.06, -0.1] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('brain.glb', REAL);
    this.#schematic();
    this.#pathways();
  }

  // Strutture assenti in BodyParts3D, disegnate nella stessa terna.
  #schematic() {
    // liquor fuori dai ventricoli
    const hemi = this.parts.get('hemi');
    const shell = hemi.meshes.map((m) => {
      const g = m.geometry.clone();
      g.scale(1.03, 1.03, 1.03);
      g.translate(m.position.x * 1.03, m.position.y * 1.03 - 0.012, m.position.z * 1.03);
      return g;
    });
    this.addPart('sas', 'spazio subaracnoideo', 0x6fd0e8, shell, { ghost: true, opacity: 0.09 });
    this.addPart('sinus', 'seno sagittale superiore', 0x3557b7,
      [tube([[0.003, 0.6, 0.395], [0.003, 0.765, 0.22], [0.003, 0.795, -0.03], [0.003, 0.73, -0.29], [0.003, 0.56, -0.41]], 0.013, { seg: 50 })]);
    this.addPart('granulations', 'granulazioni aracnoidee', 0xf3ede0,
      both(beads([[0.022, 0.755, 0.2], [0.022, 0.783, -0.03], [0.022, 0.725, -0.27]], 9, 0.009, 0.003)));
    this.addPart('luschka', 'forami di Luschka (recessi laterali)', PASSAGE,
      both(tube([[0.05, 0.245, -0.06], [0.07, 0.24, -0.055], [0.088, 0.238, -0.045]], [0.011, 0.009, 0.007])));
    this.addPart('magendie', 'forame di Magendie', PASSAGE,
      [tube([[0.003, 0.175, -0.105], [0.003, 0.158, -0.122], [0.003, 0.145, -0.14]], [0.011, 0.009, 0.007])]);

    // subtalamo e mesencefalo
    this.addPart('stn', 'nucleo subtalamico di Luys', 0x8e5bb5, both(ellipsoid([0.052, 0.386, 0.03], [0.022, 0.009, 0.019], [0, 0, 0.35])));
    this.addPart('snc', 'sostanza nera, pars compatta', 0x2f2823, both(ellipsoid([0.042, 0.362, 0.022], [0.03, 0.007, 0.026], [0.35, 0, 0.3])));
    this.addPart('snr', 'sostanza nera, pars reticolata', 0x8b3a3a, both(ellipsoid([0.046, 0.35, 0.034], [0.03, 0.007, 0.026], [0.35, 0, 0.3])));
    this.addPart('vta', 'area tegmentale ventrale', 0x6a4fb0, both(ellipsoid([0.013, 0.352, 0.03], [0.011, 0.012, 0.015])));
    this.addPart('accumbens', 'nucleus accumbens', 0xe08aa0, both(ellipsoid([0.07, 0.405, 0.16], [0.022, 0.018, 0.024])));

    // sistema limbico
    this.addPart('anterior', 'nuclei anteriori del talamo', 0xa8794f, both(ellipsoid([0.03, 0.478, 0.062], [0.017, 0.013, 0.02])));
    this.addPart('mtt', 'fascio mammillotalamico', WHITE,
      both(tube([[0.016, 0.386, 0.062], [0.022, 0.43, 0.06], [0.03, 0.47, 0.062]], 0.005, { caps: false })));
    this.addPart('isthmus', 'istmo', 0xc77d7d,
      both(tube([[0.03, 0.455, -0.21], [0.06, 0.41, -0.185], [0.095, 0.375, -0.125]], 0.02, { flat: { x: 0.6 } })));
    this.addPart('uncus', 'uncus', 0xc77d7d, both(ellipsoid([0.078, 0.335, 0.085], [0.02, 0.018, 0.022])));
  }

  // Connessioni dell'emisfero destro. Verde: eccitatoria (glutammato);
  // rosso: inibitoria (GABA); viola: dopaminergica.
  #pathways() {
    const GLU = 0x1f9d57, GABA = 0xd43d3d, DA = 0x7a4fd0;
    const c = (id) => this.parts.get(id).center.clone();
    const put = c('putamen'), gpe = c('gpe'), gpi = c('gpi'), thal = c('thalamus'), stn = c('stn'), snc = c('snc');
    const ctx = V(0.15, 0.71, -0.02); // sul giro precentrale destro
    this.addLink('ctx-str', [ctx.clone(), V(0.17, 0.6, 0.05), put.clone().add(V(0, 0.05, 0))], { color: GLU });
    this.addLink('str-gpi', arc(put.clone().add(V(0, -0.04, 0.03)), gpi.clone().add(V(0, -0.025, 0.02)), [0, -0.05, 0.07]), { color: GABA, inhibit: true });
    this.addLink('str-gpe', arc(put.clone().add(V(0, 0.03, 0.05)), gpe.clone().add(V(0, 0.03, 0.04)), [0, 0.035, 0.06]), { color: GABA, inhibit: true });
    this.addLink('gpe-gpi', arc(gpe.clone().add(V(0, 0.035, 0.02)), gpi.clone().add(V(0, 0.03, 0.02)), [0, 0.05, 0.05]), { color: GABA, inhibit: true });
    this.addLink('gpe-stn', arc(gpe.clone().add(V(0, -0.035, 0)), stn.clone().add(V(0.012, 0.004, 0.01)), [0.01, -0.035, 0.07]), { color: GABA, inhibit: true });
    this.addLink('stn-gpi', arc(stn.clone().add(V(0.015, 0.006, 0)), gpi.clone().add(V(0, -0.03, 0)), [0, 0.0, 0.09]), { color: GLU });
    this.addLink('gpi-thal', arc(gpi.clone().add(V(-0.012, 0.02, -0.02)), thal.clone().add(V(0.02, 0.03, 0.03)), [0, 0.06, 0.03]), { color: GABA, inhibit: true });
    this.addLink('thal-ctx', [thal.clone().add(V(0, 0.045, -0.02)), V(0.08, 0.6, -0.04), V(0.12, 0.715, -0.04)], { color: GLU });
    this.addLink('ctx-stn', [V(0.11, 0.725, 0.0), V(0.03, 0.6, 0.1), V(0.03, 0.44, 0.1), stn.clone().add(V(-0.005, 0.008, 0.012))], { color: GLU });
    this.addLink('snc-str', arc(snc, put.clone().add(V(0, -0.05, -0.03)), [0.02, -0.06, 0.02]), { color: DA });
    // via nigro-subtalamica, inibitoria (appunti dei nuclei della base): persa nel Parkinson
    this.addLink('snc-stn', arc(snc.clone().add(V(0.004, 0.004, 0.006)), stn.clone().add(V(0.002, -0.006, 0.006)), [0, 0.012, 0.03]), { color: DA, inhibit: true });
    // via mesolimbica
    const vta = c('vta'), acc = c('accumbens'), amy = c('amygdala');
    this.addLink('vta-acc', [vta.clone(), V(0.035, 0.365, 0.1), acc.clone().add(V(-0.005, -0.012, -0.01))], { color: DA });
    this.addLink('vta-septal', [vta.clone(), V(0.006, 0.39, 0.12), V(0.008, 0.45, 0.13)], { color: DA });
    this.addLink('vta-amy', [vta.clone(), V(0.06, 0.34, 0.05), amy.clone().add(V(-0.012, -0.008, -0.01))], { color: DA });
  }
}
