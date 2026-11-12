// Modello dei sistemi discendenti: dalla corteccia motoria al midollo cervicale.
//
// MESH REALI (BodyParts3D, public/meshes/sistemi-discendenti.glb, vedi
// meshes/sistemi-discendenti.json): giri precentrale e postcentrale, parte
// posteriore dei giri frontali superiore e medio (area 6, ritagliata per
// posizione: confine approssimato), resto degli emisferi, capsula interna
// (divisa per posizione in braccio anteriore, ginocchio, braccio posteriore),
// talamo, caudato, nucleo lenticolare, mesencefalo, peduncoli cerebrali, ponte,
// bulbo, collicoli, cervelletto, osso occipitale, vertebre C1-C4.
//
// RICOSTRUITO A MANO nella stessa terna (BodyParts3D non li contiene):
//  - midollo spinale cervicale: prosecuzione del bulbo lungo l'asse del canale
//    vertebrale misurato sulle vertebre reali; diametri 13,3 x 7,4 mm a C5 da
//    Frostell et al., "A Review of the Segmental Diameter of the Healthy Human
//    Spinal Cord", Front Neurol 2016 — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5179522/
//  - sezione ingrandita (5,5x) di midollo cervicale ai piedi del modello, con la
//    posizione dei fasci nei cordoni: Gray's Anatomy 20ª ed. (1918), "The medulla
//    spinalis", pp. 759-761 e fig. 672 (cortico-spinale laterale: area ovale
//    davanti alla colonna posteriore; cortico-spinale anteriore: presso la fessura
//    mediana; vestibolo-spinale: margine del cordone anteriore; tetto-spinale:
//    dal collicolo superiore opposto) —
//    https://francoispapin.github.io/NPEi.lab/images/BrainHistory/Gray_1918/0pdf/263.pdf
//  - piramidi bulbari, decussazione e decorso del fascio cortico-spinale (corona
//    radiata, braccio posteriore della capsula, piede del peduncolo, ponte
//    basilare, piramide, 75/10/15%): appunti; StatPearls, "Upper Motor Neuron
//    Lesion" — https://www.ncbi.nlm.nih.gov/books/NBK537305/
//  - nucleo rosso e fascio rubro-spinale (tegmento rostrale mediale, decussazione
//    tegmentale ventrale), fascio tetto-spinale (decussazione tegmentale dorsale),
//    reticolo-spinale pontino (cordone anteriore ipsilaterale) e bulbare (cordone
//    laterale), vestibolo-spinali (laterale dal nucleo di Deiters, ipsilaterale;
//    mediale dal nucleo vestibolare mediale, nel fascicolo longitudinale mediale):
//    StatPearls, "Neuroanatomy, Extrapyramidal System" — https://www.statpearls.com/point-of-care/21494 ;
//    StatPearls sul nucleo rosso — https://www.statpearls.com/point-of-care/874 ; sul fascio
//    tetto-spinale — https://www.ncbi.nlm.nih.gov/books/NBK549916 ; Radiopaedia, "Vestibular
//    nuclei" — https://radiopaedia.org/articles/vestibular-nuclei
//  (le pagine NCBI/StatPearls sono state consultate attraverso i riassunti dei motori di
//  ricerca: l'accesso automatico diretto è bloccato; dimensioni dei nuclei da verificare).
//  I nuclei sono ellissoidi di dimensioni indicative posti rispetto a reperi
//  reali del modello (acquedotto, pavimento del quarto ventricolo, collicoli,
//  superficie anteriore di ponte e bulbo); il "nucleo f" degli appunti è
//  collocato in modo indicativo nella parte caudale del complesso vestibolare.
//
// Le vie sono disegnate per l'emisfero DESTRO (x > 0): ciò che incrocia scende a sinistra.
// Coordinate: x laterale (destra +), y craniale, z anteriore; 1 mm = 0,0028 unità.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.0028; // unità per millimetro (come nel manifesto delle mesh)
const X0 = 0.002; // piano mediano delle mesh
const R = (x, y, z) => V(X0 + x, y, z);
const tube = (pts, r, opts) => taperTube(pts, r, { seg: 64, radial: 8, ...opts });
const ball = (p, r, rot) => ellipsoid([p.x, p.y, p.z], r, rot);

// Asse del canale vertebrale (y, z), misurato a metà di ogni vertebra reale.
const AXIS = [[0.062, -0.031], [0.1, -0.021], [0.14, -0.016], [0.18, -0.017], [0.22, -0.026], [0.255, -0.031], [0.3, -0.037], [0.362, -0.046]];
function axisZ(y) {
  if (y <= AXIS[0][0]) return AXIS[0][1];
  for (let i = 1; i < AXIS.length; i++)
    if (y <= AXIS[i][0]) {
      const [y0, z0] = AXIS[i - 1], [y1, z1] = AXIS[i];
      return z0 + ((z1 - z0) * (y - y0)) / (y1 - y0);
    }
  return AXIS.at(-1)[1];
}
// Punto del midollo: quota y, scostamento in mm dal centro (dx a destra, dz in avanti).
const cord = (y, dx, dz) => V(X0 + dx * S, y, axisZ(y) + dz * S);
const CORD_END = 0.191;
// Discesa in un cordone, da y0 a y1, a posizione costante nella sezione.
const descend = (dx, dz, y0, y1) => {
  const n = Math.max(2, Math.round((y0 - y1) / 0.035));
  return Array.from({ length: n + 1 }, (_, i) => cord(y0 + ((y1 - y0) * i) / n, dx, dz));
};

// Sezione ingrandita ai piedi del modello: 1 mm = K unità.
const K = S * 5.5;
const PLATE = { y: 0.19, z: -0.027, h: 0.012 };
// Il modello finisce a C4: lo ingrandisco e lo abbasso fino alla base.
const ZOOM = 1.25, LIFT = 0.05 - ZOOM * (PLATE.y - PLATE.h);
const plate = (dx, dz, up = 0) => V(X0 + dx * K, PLATE.y + up, PLATE.z + dz * K);
const patch = (dx, dz, rx, rz) => ball(plate(dx, dz, 0.0015), [rx * K, 0.0032, rz * K]);

// Contorno chiuso (mm, x a destra, z in avanti) estruso in una lastra orizzontale.
function slab(points, h, top) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => V(x * K, -z * K, 0)), true, 'centripetal');
  const shape = new THREE.Shape(curve.getPoints(160).map((p) => new THREE.Vector2(p.x, p.y)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 4 });
  g.rotateX(-Math.PI / 2);
  g.translate(X0, top - h, PLATE.z);
  return g;
}
function whiteOutline() {
  const a = 6.65, b = 3.7, pts = [];
  for (let i = 0; i < 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const x = a * Math.cos(t);
    let z = b * Math.sin(t);
    if (z > 0 && Math.abs(x) < 0.55) z -= 2.7 * (1 - Math.abs(x) / 0.55); // fessura mediana anteriore
    if (z < 0 && Math.abs(x) < 0.3) z += 0.5; // solco mediano posteriore
    pts.push([x, z]);
  }
  return pts;
}
// Sostanza grigia a livello del rigonfiamento cervicale (metà destra, poi specchiata).
const HALF_GREY = [[0, 0.5], [1.0, 0.75], [1.3, 1.7], [2.5, 2.25], [3.7, 1.9], [4.1, 0.9], [3.5, -0.1], [2.5, -0.5], [2.5, -1.5], [3.3, -2.9], [3.25, -3.3], [2.6, -3.2], [1.6, -2.0], [1.0, -0.9], [0, -0.6]];
const GREY = [...HALF_GREY, ...HALF_GREY.slice(1, -1).reverse().map(([x, z]) => [-x, z])];

const IVORY = 0xf1ead8, GYRUS = 0xd98c8c, STEM = 0xe6cdb0, BONE = 0xe9dfc8;
const C = {
  cst: 0xc9485b, csl: 0xd4374a, csu: 0xe58a2e, csa: 0xb5458f, cnu: 0xe0769a,
  rubro: 0xb5301f, retL: 0x2f8f6b, retM: 0x1f7a8c, vestL: 0x2f6fe0, vsm: 0x5aa0e6, tetto: 0x8e5bb5, inter: 0xd9a82e,
};

const REAL = {
  hemi: ['emisferi cerebrali', 0xe7c9b9, { ghost: true, opacity: 0.1 }],
  hemiF: ['lobo frontale', 0xe7c9b9, { ghost: true, opacity: 0.1 }],
  precentral: ['giro precentrale (area 4, motoria primaria)', GYRUS, { opacity: 0.55 }],
  area6: ['area 6 (premotoria e motoria supplementare)', 0xe0a070, { opacity: 0.55 }],
  postcentral: ['giro postcentrale (aree 3, 1, 2)', 0x7fa8c9, { opacity: 0.55 }],
  capAnt: ['capsula interna, braccio anteriore', 0xf6f0de],
  capGenu: ['capsula interna, ginocchio', 0xe2cf9a],
  capPost: ['capsula interna, braccio posteriore', IVORY, { opacity: 0.6 }],
  thalamus: ['talamo', 0xc9a27a],
  caudate: ['nucleo caudato', 0x3c8d6e],
  lenticular: ['nucleo lenticolare', 0xd97b2b],
  midbrain: ['mesencefalo (tegmento e tetto)', STEM, { opacity: 0.28 }],
  peduncle: ['piede del peduncolo cerebrale', 0xeadfc6, { opacity: 0.32 }],
  pons: ['ponte', STEM, { opacity: 0.28 }],
  medulla: ['bulbo', STEM, { opacity: 0.28 }],
  collSup: ['collicolo superiore', C.tetto],
  collInf: ['collicolo inferiore', 0xcdb9d6],
  cerebellum: ['cervelletto', 0xdcb9a6, { ghost: true, opacity: 0.08 }],
  occipital: ['osso occipitale', BONE, { ghost: true, opacity: 0.07 }],
  vertebrae: ['vertebre cervicali C1-C4', BONE, { ghost: true, opacity: 0.13 }],
};

export class DescendingSystems extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.inner.scale.setScalar(ZOOM);
    this.inner.position.y = LIFT;
    this.addStand({ radius: 0.125, z: PLATE.z * ZOOM, rod: [X0, PLATE.y - PLATE.h - 0.03, PLATE.y - PLATE.h, PLATE.z] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('sistemi-discendenti.glb', REAL);
    this.#cordAndSection();
    this.#nuclei();
    this.#pyramidal();
    this.#brainstemTracts();
    this.#synapses();
  }

  // Una via: tubo sottile (parte nominabile), eventuale macchia sulla sezione
  // ingrandita e una connessione animata lungo lo stesso percorso.
  #tract(id, name, color, pts, patches = [], extra = []) {
    this.addPart(id, name, color, [tube(pts, 0.0027), ...extra, ...patches]);
    this.addLink(id, pts, { color, r: 0.004 });
  }

  #cordAndSection() {
    const line = [0.362, 0.33, 0.3, 0.255, 0.22, CORD_END].map((y) => cord(y, 0, 0));
    this.addPart('cord', 'midollo spinale cervicale', IVORY,
      [taperTube(line, [0.0205, 0.0185, 0.0172, 0.0176, 0.0186], { seg: 70, radial: 20, flat: { z: 0.56 }, caps: false })],
      { opacity: 0.3 });
    this.addPart('section', 'sezione di midollo cervicale (ingrandita): sostanza bianca', 0xfaf5e6, [slab(whiteOutline(), PLATE.h, PLATE.y)]);
    this.addPart('grey', 'sostanza grigia', 0x8f7468, [slab(GREY, PLATE.h, PLATE.y + 0.0015)]);
    const dot = (dx, dz) => ball(plate(dx, dz, 0.003), [0.5 * K, 0.0032, 0.5 * K]);
    this.addPart('motoLat', 'motoneuroni della lamina IX laterale', 0x5b2a86, [dot(3.25, 1.2), dot(-3.25, 1.2)]);
    this.addPart('motoMed', 'motoneuroni della lamina IX mediale', 0x1f4e79, [dot(1.9, 1.45), dot(-1.9, 1.45)]);
  }

  #nuclei() {
    const pair = (c, r, rot) => [ball(R(c[0], c[1], c[2]), r, rot), ball(R(-c[0], c[1], c[2]), r, rot)];
    this.addPart('rosso', 'nucleo rosso', C.rubro, pair([0.014, 0.562, 0.022], [0.009, 0.011, 0.009]));
    this.addPart('rimlf', 'nucleo interstiziale rostrale del fascicolo longitudinale mediale', C.inter, pair([0.007, 0.575, 0.016], [0.0045, 0.0045, 0.005]));
    this.addPart('vestLat', 'nucleo vestibolare laterale', C.vestL, pair([0.024, 0.464, -0.01], [0.006, 0.007, 0.005]));
    this.addPart('vestMed', 'nucleo vestibolare mediale', C.vsm, pair([0.012, 0.447, -0.014], [0.005, 0.014, 0.0045]));
    this.addPart('nucleoF', 'nucleo f', 0x8a8f3c, pair([0.021, 0.44, -0.019], [0.004, 0.005, 0.004]));
    this.addPart('frPonte', 'formazione reticolare del ponte', C.retM, pair([0.011, 0.497, 0.007], [0.007, 0.021, 0.006]));
    this.addPart('frBulbo', 'formazione reticolare del bulbo', C.retL, pair([0.011, 0.425, -0.02], [0.007, 0.017, 0.006]));
  }

  #pyramidal() {
    const pyr = (s) => taperTube(
      [R(s * 0.011, 0.456, 0.02), R(s * 0.01, 0.4375, 0.015), R(s * 0.009, 0.4125, -0.003), R(s * 0.008, 0.3875, -0.021), R(s * 0.007, 0.376, -0.0255)],
      [0.0065, 0.0075, 0.007, 0.006, 0.005], { seg: 40, radial: 14, flat: { z: 0.75 } });
    this.addPart('pyramid', 'piramide bulbare', 0xe2cf9a, [pyr(1), pyr(-1)], { opacity: 0.55 });
    const cross = (s) => tube([R(s * 0.007, 0.378, -0.0255), R(0, 0.362, -0.034), cord(0.345, -s * 3.6, -0.9), cord(0.325, -s * 4.5, -1.5)], [0.0048, 0.0045, 0.0042, 0.0036]);
    this.addPart('decussation', 'decussazione delle piramidi', 0xd9b56a, [cross(1), cross(-1)], { opacity: 0.6 });

    // Dalla corteccia alla piramide: ventaglio (arto inferiore, arto superiore, mano),
    // tronco nella capsula e nel peduncolo, fascicoli sfrangiati nel ponte.
    const cap = R(0.068, 0.61, 0), ped = R(0.033, 0.535, 0.047), pyrTop = R(0.012, 0.455, 0.02);
    const arm = [R(0.125, 0.765, -0.012), R(0.095, 0.7, -0.005), R(0.075, 0.645, 0), cap];
    const trunk = [cap, R(0.052, 0.58, 0.032), R(0.04, 0.556, 0.05), ped];
    const pons = [ped, R(0.024, 0.51, 0.04), R(0.018, 0.485, 0.032), pyrTop];
    const inPyr = [pyrTop, R(0.01, 0.4375, 0.015), R(0.009, 0.4125, -0.003), R(0.008, 0.3875, -0.021)];
    const fan = [
      [R(0.03, 0.795, -0.06), R(0.05, 0.72, -0.03), R(0.066, 0.65, -0.004), cap],
      [R(0.168, 0.7, 0.03), R(0.12, 0.67, 0.015), R(0.08, 0.64, 0.004), cap],
    ];
    const frayed = [-0.008, 0.007].map((dx) => tube([ped, R(0.024 + dx, 0.51, 0.04 - Math.abs(dx)), R(0.018 + dx, 0.485, 0.03), pyrTop], 0.0018, { seg: 30 }));
    this.addPart('cst', 'fascio cortico-spinale (via piramidale)', C.cst, [tube(trunk, 0.0042), tube(pons, 0.0024), ...frayed, tube(inPyr, 0.0036)]);
    this.addPart('corona', 'fibre cortico-spinali nel centro semiovale', C.cst, [tube(arm, [0.0026, 0.0036]), ...fan.map((f) => tube(f, [0.0024, 0.0034]))]);
    [arm, trunk, pons, inPyr].forEach((p, i) => this.addLink(`cst${i + 1}`, p, { color: C.cst, r: 0.0048 }));

    // Fascio cortico-nucleare: dall'area del volto, per il ginocchio, ai nuclei motori del tronco.
    this.#tract('cnu', 'fascio cortico-nucleare', C.cnu, [
      R(0.172, 0.675, 0.04), R(0.1, 0.65, 0.058), R(0.037, 0.61, 0.068), R(0.03, 0.583, 0.058), R(0.027, 0.555, 0.052),
      R(0.021, 0.53, 0.044), R(0.014, 0.505, 0.03), R(0.012, 0.478, 0.008),
    ]);

    // Sotto le piramidi: tre contingenti.
    const low = R(0.008, 0.3875, -0.021);
    this.#tract('csl', 'fascio cortico-spinale laterale (75%, crociato)', C.csl,
      [low, R(0.006, 0.376, -0.026), R(-0.001, 0.362, -0.034), cord(0.345, -3.6, -0.9), cord(0.32, -4.5, -1.5), ...descend(-4.5, -1.5, 0.28, CORD_END)],
      [patch(-4.5, -1.5, 1.3, 1.0)]);
    this.#tract('csu', 'fibre cortico-spinali laterali dirette (10%)', C.csu,
      [low, R(0.0085, 0.372, -0.028), cord(0.35, 3.4, -0.6), cord(0.325, 4.4, -1.3), ...descend(4.4, -1.3, 0.28, CORD_END)],
      [patch(4.5, -1.5, 0.65, 0.55)]);
    this.#tract('csa', 'fascio cortico-spinale mediale (15%, diretto)', C.csa,
      [low, R(0.006, 0.37, -0.027), cord(0.345, 1.2, 2.5), ...descend(1.0, 2.5, 0.31, CORD_END)],
      [patch(1.05, 2.75, 0.45, 0.6)]);
    // Il fascio mediale del lato opposto: serve a mostrare l'innervazione bilaterale.
    this.addPart('csaL', "fascio cortico-spinale mediale dell'altro emisfero", 0xd9a3c6,
      [tube(descend(-1.0, 2.5, 0.345, CORD_END), 0.0027), patch(-1.05, 2.75, 0.45, 0.6)]);
  }

  #brainstemTracts() {
    this.#tract('rubro', 'fascio rubro-spinale', C.rubro, [
      R(0.014, 0.562, 0.022), R(0.008, 0.553, 0.028), R(-0.003, 0.547, 0.029), R(-0.012, 0.535, 0.022), R(-0.02, 0.5, 0.005),
      R(-0.023, 0.465, -0.007), R(-0.021, 0.43, -0.017), R(-0.016, 0.39, -0.034), cord(0.345, -5.0, 0.3), ...descend(-5.2, 0.3, 0.31, 0.268),
    ], [patch(-5.25, 0.3, 0.75, 0.6)]);
    this.#tract('retL', 'fascio reticolo-spinale laterale', C.retL,
      [R(0.011, 0.425, -0.02), R(0.012, 0.408, -0.022), R(0.014, 0.385, -0.031), cord(0.35, 4.6, 1.4), ...descend(4.9, 1.5, 0.32, CORD_END)],
      [patch(4.95, 1.65, 0.7, 0.55)]);
    this.#tract('retM', 'fascio reticolo-spinale mediale', C.retM,
      [R(0.011, 0.497, 0.007), R(0.009, 0.47, -0.001), R(0.007, 0.45, -0.007), R(0.006, 0.42, -0.014), R(0.006, 0.39, -0.027), cord(0.35, 2.2, 2.3), ...descend(2.3, 2.4, 0.32, CORD_END)],
      [patch(2.3, 2.95, 0.6, 0.42)]);
    this.#tract('vestL', 'fascio vestibolo-spinale laterale', C.vestL,
      [R(0.024, 0.464, -0.01), R(0.022, 0.44, -0.012), R(0.017, 0.41, -0.016), R(0.013, 0.38, -0.029), cord(0.35, 3.6, 2.0), ...descend(3.7, 2.1, 0.32, CORD_END)],
      [patch(3.75, 2.7, 0.6, 0.4)]);
    // Fascicolo longitudinale mediale: tre contingenti presso la linea mediana.
    this.#tract('vsm', 'fascio vestibolo-spinale mediale', C.vsm,
      [R(0.012, 0.447, -0.014), R(0.007, 0.43, -0.02), R(0.0055, 0.405, -0.026), R(0.0045, 0.38, -0.034), cord(0.35, 1.2, 1.3), ...descend(1.2, 1.3, 0.32, CORD_END)]);
    this.#tract('tetto', 'fascio tetto-spinale', C.tetto, [
      R(0.013, 0.557, -0.008), R(0.015, 0.552, 0.004), R(0.008, 0.546, 0.014), R(-0.002, 0.54, 0.017), R(-0.005, 0.52, 0.009),
      R(-0.005, 0.49, 0.001), R(-0.005, 0.455, -0.009), R(-0.005, 0.42, -0.019), R(-0.004, 0.385, -0.031), cord(0.35, -1.0, 1.5), ...descend(-0.95, 1.4, 0.32, 0.215),
    ]);
    this.#tract('inter', 'fascio interstizio-spinale', C.inter, [
      R(0.007, 0.575, 0.016), R(0.004, 0.55, 0.012), R(0.0035, 0.525, 0.006), R(0.0035, 0.505, 0.003), R(0.0035, 0.47, -0.008),
      R(0.0035, 0.45, -0.013), R(0.0035, 0.42, -0.022), R(0.003, 0.385, -0.033), cord(0.35, 0.5, 1.5), ...descend(0.5, 1.5, 0.32, 0.24),
    ]);
    this.addPart('flm', 'fascicolo longitudinale mediale (nel cordone anteriore)', 0x9a86c8, [patch(0.95, 1.35, 0.42, 0.5), patch(-0.95, 1.35, 0.42, 0.5)]);
  }

  // Terminazioni sui motoneuroni (sulla sezione ingrandita) e controllo del nucleo vestibolare.
  #synapses() {
    const up = 0.007;
    const syn = (id, color, pts) => this.addLink(id, pts.map(([x, z]) => plate(x, z, up)), { color, r: 0.0022 });
    syn('csl-moto', C.csl, [[-4.3, -1.0], [-4.0, 0.2], [-3.4, 0.95]]);
    syn('csu-moto', C.csu, [[4.3, -1.2], [4.0, 0.2], [3.4, 0.95]]);
    syn('rubro-moto', C.rubro, [[-5.0, 0.4], [-4.3, 0.9], [-3.6, 1.15]]);
    syn('retL-moto', C.retL, [[4.8, 1.7], [4.2, 1.5], [3.6, 1.3]]);
    syn('retM-moto', C.retM, [[2.3, 2.8], [2.15, 2.2], [2.0, 1.75]]);
    syn('vestL-moto', C.vestL, [[3.6, 2.6], [2.8, 2.1], [2.2, 1.6]]);
    syn('csa-motoR', C.csa, [[1.05, 2.5], [1.3, 2.0], [1.7, 1.7]]);
    syn('csa-motoL', C.csa, [[0.9, 2.3], [0.2, 0.75], [-0.9, 1.0], [-1.6, 1.4]]);
    syn('csaL-motoL', 0xd9a3c6, [[-1.05, 2.5], [-1.3, 2.0], [-1.7, 1.7]]);
    syn('csaL-motoR', 0xd9a3c6, [[-0.9, 2.3], [-0.2, 0.75], [0.9, 1.0], [1.6, 1.4]]);
    // collaterale cortico-spinale al nucleo f (verde), che frena il nucleo vestibolare laterale (rosso)
    const f = this.parts.get('nucleoF').center, vl = this.parts.get('vestLat').center;
    this.addLink('cst-f', [R(0.012, 0.455, 0.02), R(0.018, 0.448, 0.002), f.clone().add(V(-0.002, 0.003, 0.004))], { color: 0x1f9d57, r: 0.003 });
    this.addLink('f-vest', [f.clone().add(V(0.003, 0.004, 0)), V(f.x + 0.008, 0.452, f.z + 0.004), vl.clone().add(V(0.004, -0.007, 0))], { color: 0xd43d3d, inhibit: true, r: 0.003 });
  }
}
