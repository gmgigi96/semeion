// Modello dei sistemi ascendenti: dal ganglio spinale C8 alla corteccia sensitiva.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/sistemi-ascendenti.glb, vedi
// meshes/sistemi-ascendenti.json): midollo spinale da C1 a T1 (sostanza bianca,
// corni posteriore e anteriore) con le colonne dei fascicoli gracile e cuneato,
// dei fasci spino-cerebellari posteriore e anteriore e dei fasci spino-talamici
// laterale e anteriore (divise per posizione in metà destra e sinistra); gangli
// spinali e radici posteriori; vertebre C1-C7; bulbo, oliva, ponte, mesencefalo,
// piede del peduncolo, collicoli, peduncolo cerebellare superiore, cervelletto;
// talamo, putamen e globo pallido; giri postcentrale e precentrale; resto degli
// emisferi. Il midollo è tagliato sotto il ganglio C8 (quota 1441 mm dell'atlante).
// Il file si rigenera con: node tools/mesh.mjs meshes/sistemi-ascendenti.json $SOURCES/zanatomy
//
// RICOSTRUITO A MANO nella stessa terna (Z-Anatomy non li contiene). Le posizioni
// sono in millimetri dell'atlante e sono state scelte misurando le mesh reali
// (superficie dorsale e ventrale di bulbo, ponte e mesencefalo, pavimento del quarto
// ventricolo, acquedotto, contorno di talamo, putamen e pallido, giro postcentrale,
// asse del canale centrale). Calibro e forma dei nuclei sono INDICATIVI.
//  - nuclei gracile e cuneato (bulbo chiuso, il gracile mediale al cuneato), fibre
//    arciformi interne e decussazione sensitiva (rostrale alla decussazione motoria):
//    Wikipedia, "Dorsal column nuclei" — https://en.wikipedia.org/wiki/Dorsal_column_nuclei ;
//    "Sensory decussation" — https://en.wikipedia.org/wiki/Sensory_decussation
//  - lemnisco mediale: nel bulbo fibre dell'arto inferiore ventrali e dell'arto
//    superiore dorsali, rotazione di 90° nel ponte, termine nel VPL, fibre
//    talamo-corticali nel braccio posteriore della capsula interna, somatotopia del
//    giro postcentrale (arto inferiore mediale): Wikipedia, "Dorsal column–medial
//    lemniscus pathway" — https://en.wikipedia.org/wiki/Dorsal_column%E2%80%93medial_lemniscus_pathway ;
//    "Medial lemniscus" — https://en.wikipedia.org/wiki/Medial_lemniscus ; Neuroscience
//    Online (UTHealth Houston), "Somatosensory Pathways" (VPL: core cutaneo e shell
//    propriocettivo) — https://nba.uth.tmc.edu/neuroscience/m/s2/chapter04.html
//    Posizione nel mesencefalo (laterale, dorsale alla sostanza nera): appunti; stimata.
//  - sistema antero-laterale: incrocio nella commessura bianca anteriore entro 1-2
//    segmenti, angolo antero-laterale del midollo, VPL, componenti spino-reticolare e
//    spino-tettale: Wikipedia, "Spinothalamic tract" — https://en.wikipedia.org/wiki/Spinothalamic_tract
//    Decorso nel tronco (laterale, dorsolaterale all'oliva, poi laterale al lemnisco
//    mediale), nuclei talamici a proiezione diffusa, grigio periacqueduttale,
//    formazione reticolare: STIMATI sui reperi reali, senza fonte letta.
//  - fasci spino-cerebellari: colonna di Clarke (parte mediale della base del corno
//    posteriore, da C8 in giù) — https://en.wikipedia.org/wiki/Posterior_thoracic_nucleus ;
//    dorsale ipsilaterale nel peduncolo cerebellare inferiore, ventrale crociato due
//    volte attraverso il peduncolo cerebellare superiore, rostrale ipsilaterale:
//    Wikipedia, "Spinocerebellar tracts" — https://en.wikipedia.org/wiki/Spinocerebellar_tracts ;
//    nucleo cuneato accessorio (subito laterale al cuneato) e fibre cuneo-cerebellari
//    nel corpo restiforme — https://en.wikipedia.org/wiki/Accessory_cuneate_nucleus
//    Il peduncolo cerebellare inferiore è un tubo di forma STIMATA.
//  - nucleo Z, nuclei cervicali laterale e centrale (C1-C3), fascio spino-cervicale,
//    fascio post-sinaptico: posizione dagli appunti, senza altra fonte letta.
//  - sezione ingrandita (4,4x) di midollo cervicale ai piedi del modello: contorno con le
//    misure del midollo reale di Z-Anatomy; posizione dei fasci come nelle colonne reali
//    dell'atlante e, per ciò che l'atlante non ha, come descritta negli appunti.
//  (NCBI Bookshelf, Radiopaedia e le copie in rete del Gray 1918 hanno rifiutato
//  l'accesso automatico: non sono state lette.)
//
// Lo stimolo entra da DESTRA (x > 0): ciò che incrocia sale a sinistra.
// Coordinate: x laterale (destra +), y craniale, z anteriore; 1 mm = 0,003 unità.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.003; // unità per millimetro (come nel manifesto delle mesh)
const OB = 37, OU = 1415; // origine del manifesto: mm verso dietro, mm verso l'alto
// Punto in millimetri dell'atlante: a destra della linea mediana, verso dietro, quota.
const Q = (r, b, u) => V(r * S, (u - OU) * S, -(b - OB) * S);
const Y = (u) => (u - OU) * S;
const tube = (pts, r, opts) => taperTube(pts, r, { seg: 64, radial: 8, ...opts });
// Ellissoide: centro e semiassi in mm (laterale, antero-posteriore, verticale).
const blob = (r, b, u, [rx, rb, ru]) => {
  const c = Q(r, b, u);
  return ellipsoid([c.x, c.y, c.z], [rx * S, ru * S, rb * S]);
};
const pair = (r, b, u, radii) => [blob(r, b, u, radii), blob(-r, b, u, radii)];

// Asse del canale centrale del midollo reale: [quota, mm verso dietro].
const CANAL = [[1436, 38.6], [1440, 37.07], [1455, 31.39], [1470, 25.24], [1485, 22.52], [1500, 21.96], [1515, 23.18], [1530, 27.8], [1545, 28.05]];
function canal(u) {
  if (u <= CANAL[0][0]) return CANAL[0][1];
  for (let i = 1; i < CANAL.length; i++)
    if (u <= CANAL[i][0]) {
      const [u0, b0] = CANAL[i - 1], [u1, b1] = CANAL[i];
      return b0 + ((b1 - b0) * (u - u0)) / (u1 - u0);
    }
  return CANAL.at(-1)[1];
}
// Punto del midollo: quota, mm a destra del canale, mm dietro il canale.
const cord = (u, dr, db) => Q(dr, canal(u) + db, u);
// Salita in un cordone a posizione costante nella sezione.
const climb = (dr, db, u0, u1) => {
  const n = Math.max(2, Math.round(Math.abs(u1 - u0) / 11));
  return Array.from({ length: n + 1 }, (_, i) => cord(u0 + ((u1 - u0) * i) / n, dr, db));
};
// Posizione nella sezione (mm a destra, mm dietro il canale) delle colonne reali.
const AT = { gracile: [1.15, 3.2], cuneate: [2.6, 2.9], sctPost: [5.95, 2.25], sctAnt: [6.15, -1.45], stt: [4.9, -1.9], horn: [3.2, 2.2] };
const CUT = 1441, TOP = 1545; // estremi del midollo nel modello

// Sezione ingrandita ai piedi del modello: 1 mm = K unità; dz positivo = in avanti.
const K = S * 4.4;
const PLATE = { y: 0.075, z: Q(0, canal(CUT), CUT).z, h: 0.009 };
const plate = (dx, dz, up = 0) => V(dx * K, PLATE.y + up, PLATE.z + dz * K);
const patch = (dx, dz, rx, rz, rot = 0) => {
  const g = new THREE.SphereGeometry(1, 24, 12);
  g.scale(rx * K, 0.003, rz * K);
  g.rotateY(rot);
  const c = plate(dx, dz, 0.0015);
  g.translate(c.x, c.y, c.z);
  return g;
};
function slab(points, h, top) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => V(x * K, -z * K, 0)), true, 'centripetal');
  const shape = new THREE.Shape(curve.getPoints(160).map((p) => new THREE.Vector2(p.x, p.y)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 4 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, top - h, PLATE.z);
  return g;
}
// Contorno del midollo cervicale reale: 14,2 x 9,8 mm.
const A = 7.1, B = 4.9;
function whiteOutline() {
  const pts = [];
  for (let i = 0; i < 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const x = A * Math.cos(t);
    let z = B * Math.sin(t);
    if (z > 0 && Math.abs(x) < 0.55) z -= 3.3 * (1 - Math.abs(x) / 0.55); // fessura mediana anteriore
    if (z < 0 && Math.abs(x) < 0.3) z += 0.6; // solco mediano posteriore
    pts.push([x, z]);
  }
  return pts;
}
const HALF_GREY = [[0, 0.6], [1.0, 0.9], [1.4, 2.1], [2.6, 2.9], [3.9, 2.5], [4.3, 1.2], [3.7, 0], [2.7, -0.6], [2.6, -1.9], [3.5, -3.7], [3.4, -4.2], [2.7, -4.1], [1.7, -2.6], [1.0, -1.1], [0, -0.7]];
const GREY = [...HALF_GREY, ...HALF_GREY.slice(1, -1).reverse().map(([x, z]) => [-x, z])];

const IVORY = 0xf1ead8, STEM = 0xe6cdb0, BONE = 0xe9dfc8;
const C = {
  als: 0xd98a94, gracile: 0x2f6fe0, cuneate: 0x1f9d8f, arc: 0x6a5acd, neo: 0xd4374a, paleo: 0xe58a2e, tect: 0x8e5bb5, cerv: 0xb5458f,
  sctD: 0x2f8f6b, sctV: 0xc9485b, cc: 0x1f7a8c, rost: 0xd9a82e, vpl: 0xd97b2b, tc: 0x3a78c2, touch: 0x2f6fe0, pain: 0xd4374a,
};

const tract = (name, color) => [name, color, { opacity: 0.55 }];
const REAL = {
  hemi: ['emisferi cerebrali', 0xe7c9b9, { ghost: true, opacity: 0.1 }],
  postcentral: ['giro postcentrale (area 3, 1, 2)', 0x7fa8c9, { opacity: 0.6 }],
  precentral: ['giro precentrale (area 4)', 0xd98c8c, { opacity: 0.45 }],
  thalamus: ['talamo', 0xc9a27a, { opacity: 0.38 }],
  lenticular: ['nucleo lenticolare', 0xb9a58a, { opacity: 0.4 }],
  midbrain: ['mesencefalo', STEM, { opacity: 0.26 }],
  peduncle: ['piede del peduncolo cerebrale', 0xeadfc6, { opacity: 0.26 }],
  pons: ['ponte', STEM, { opacity: 0.26 }],
  medulla: ['bulbo', STEM, { opacity: 0.26 }],
  olive: ['oliva (complesso olivare inferiore)', 0xc7b06a, { opacity: 0.6 }],
  collSup: ['collicolo superiore', C.tect, { opacity: 0.75 }],
  collInf: ['collicolo inferiore', 0xcdb9d6, { opacity: 0.6 }],
  scp: ['peduncolo cerebellare superiore', 0xe2cf9a, { opacity: 0.5 }],
  cerebellum: ['cervelletto', 0xdcb9a6, { ghost: true, opacity: 0.1 }],
  cord: ['midollo spinale', IVORY, { ghost: true, opacity: 0.3 }],
  postHorn: ['corno posteriore', 0x9a7d70, { opacity: 0.6 }],
  antHorn: ['corno anteriore', 0xb09a8e, { opacity: 0.45 }],
  gracileR: tract('fascicolo gracile', C.gracile), gracileL: tract('fascicolo gracile sinistro', C.gracile),
  cuneateR: tract('fascicolo cuneato', C.cuneate), cuneateL: tract('fascicolo cuneato sinistro', C.cuneate),
  sctPostR: tract('fascio spino-cerebellare dorsale', C.sctD), sctPostL: tract('fascio spino-cerebellare dorsale sinistro', C.sctD),
  sctAntR: tract('fascio spino-cerebellare ventrale destro', C.sctV), sctAntL: tract('fascio spino-cerebellare ventrale', C.sctV),
  sttLatR: tract('sistema antero-laterale destro (cordone laterale)', C.als), sttLatL: tract('sistema antero-laterale (cordone laterale)', C.als),
  sttAntR: tract('sistema antero-laterale destro (cordone anteriore)', C.als), sttAntL: tract('sistema antero-laterale (cordone anteriore)', C.als),
  ganglionR: ['gangli spinali (neuroni di primo ordine)', 0xd9a82e],
  ganglionL: ['gangli spinali di sinistra', 0xd9a82e],
  rootR: ['radici posteriori', 0xe8d9a8], rootL: ['radici posteriori di sinistra', 0xe8d9a8],
  vertebrae: ['vertebre cervicali C1-C7', BONE, { ghost: true, opacity: 0.12 }],
};

// Unisce tratti consecutivi in un solo percorso, senza punti doppi.
const join = (...segs) => segs.flat().filter((p, i, a) => i === 0 || p.distanceTo(a[i - 1]) > 1e-5);
const below = (pts, u) => pts.filter((p) => p.y < Y(u));

// ---- Percorsi (in mm dell'atlante). s = +1: lo stimolo entra da destra. ----
// Dalla periferia al midollo attraverso il ganglio e la radice posteriore di C8.
const entry = (s) => [Q(s * 38, 25.6, 1443.6), Q(s * 30, 26, 1444), Q(s * 21, 27.5, 1446.5), Q(s * 14.5, 28.5, 1448.5), Q(s * 8, 31, 1452), Q(s * 3.5, canal(1455) + 4.1, 1455)];
const body = (s) => Q(s * 40, 25.5, 1443.5);
// Fascicoli del cordone posteriore fino ai nuclei del bulbo.
const cuneateUp = (s) => [...climb(s * AT.cuneate[0], AT.cuneate[1], 1461, TOP), Q(s * 3.4, 30.2, 1552), Q(s * 4.2, 29.4, 1559)];
const gracileUp = (s) => [...climb(s * AT.gracile[0], AT.gracile[1], CUT + 1, TOP), Q(s * 1.3, 31.1, 1551), Q(s * 1.4, 31, 1555)];
// Fibre arciformi interne: ventralmente attorno al grigio centrale, poi oltre la linea mediana.
const arcC = (s) => [Q(s * 4.2, 29.4, 1561), Q(s * 4.7, 26, 1562), Q(s * 3.3, 22.3, 1563), Q(s * 0.9, 19.6, 1564.5), Q(-s * 1.3, 17.6, 1566)];
const arcG = (s) => [Q(s * 1.4, 31, 1556), Q(s * 3.0, 27.6, 1558), Q(s * 2.9, 22.5, 1560), Q(s * 0.9, 17.4, 1562.5), Q(-s * 1.3, 14.6, 1565)];
// Lemnisco mediale (dal lato opposto allo stimolo): due contingenti che ruotano di 90° nel ponte.
const lmC = (s) => [Q(-s * 1.3, 17.6, 1566), Q(-s * 1.3, 15.5, 1571), Q(-s * 1.4, 14, 1576), Q(-s * 1.8, 11.5, 1580), Q(-s * 2.5, 9.2, 1585), Q(-s * 3, 7.6, 1590), Q(-s * 4, 6.6, 1596), Q(-s * 8.5, 5.2, 1603), Q(-s * 10, 6, 1608), Q(-s * 11.5, 8, 1613), Q(-s * 15.5, 12, 1621.5)];
const lmG = (s) => [Q(-s * 1.3, 14.6, 1565), Q(-s * 1.3, 11.5, 1570), Q(-s * 1.4, 9.6, 1575), Q(-s * 2.6, 9.4, 1580), Q(-s * 5, 8.6, 1585), Q(-s * 6.5, 7.6, 1590), Q(-s * 8, 6.8, 1596), Q(-s * 10.4, 5.2, 1603), Q(-s * 11.8, 6.8, 1608), Q(-s * 13.2, 9, 1613), Q(-s * 18, 13.5, 1622.5)];
// Fibre talamo-corticali: braccio posteriore della capsula, corona radiata, giro postcentrale.
const tcC = (s, d = 0) => [Q(-s * 15.5, 12 + d, 1621.5), Q(-s * 22, 10 + d, 1628), Q(-s * 26, 10 + d, 1636), Q(-s * 34, 16 + d, 1655), Q(-s * 46, 25 + d, 1674)];
const tcG = (s) => [Q(-s * 18, 13.5, 1622.5), Q(-s * 23.5, 11, 1629), Q(-s * 26.5, 12, 1638), Q(-s * 26, 22, 1662), Q(-s * 18, 35, 1692)];
// Sistema antero-laterale: sinapsi nel corno posteriore, incrocio, salita nel cordone opposto.
const toHorn = (s) => [Q(s * 3.5, canal(1455) + 4.1, 1455), cord(1457, s * 3.4, 3.3), cord(1459, s * AT.horn[0], AT.horn[1])];
const cross = (s) => [cord(1459, s * 3.0, 1.6), cord(1463, s * 1.9, -0.2), cord(1467, s * 0.7, -1.3), cord(1471, -s * 1.6, -1.6), cord(1477, -s * 3.7, -1.9), cord(1484, -s * AT.stt[0], AT.stt[1])];
const alsCord = (s) => climb(-s * AT.stt[0], AT.stt[1], 1484, TOP);
const alsStem = (s, m = 0) => [cord(TOP, -s * AT.stt[0], AT.stt[1]), Q(-s * (6.5 - m), 25, 1553), Q(-s * (8.3 - m), 23.5, 1560), Q(-s * (9.6 - m), 22, 1566), Q(-s * (10.8 - m), 21, 1572), Q(-s * (12 - m), 17, 1580), Q(-s * (13 - m), 13, 1588), Q(-s * (13.5 - m), 10.5, 1596), Q(-s * (13.2 - m), 8.6, 1603)];
const neoTop = (s) => [Q(-s * 13.2, 8.6, 1603), Q(-s * 13.5, 9.6, 1608), Q(-s * 14.3, 11, 1613), Q(-s * 17.5, 15.5, 1621)];
const paleoTop = (s) => [Q(-s * 11.7, 8.6, 1603), Q(-s * 11.8, 9.8, 1609), Q(-s * 10.5, 9.6, 1615), Q(-s * 8, 8.6, 1621), Q(-s * 6.3, 8, 1626)];
const tectal = (s) => [Q(-s * 13.2, 11.5, 1598), Q(-s * 12.8, 13.5, 1604), Q(-s * 10.5, 15.5, 1609), Q(-s * 7, 16.6, 1612)];

export class AscendingSystems extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.13, z: 0, rod: [0, 0.02, PLATE.y - PLATE.h, PLATE.z] });
    this.ready = this.#build();
  }

  // Ingrandisce il modello attorno a una quota: ciò che sta a `floor` (coordinata y)
  // scende fino alla base. Serve alle pagine che guardano solo il tronco encefalico.
  focus(scale = 1, floor = 0, z = 0) {
    this.inner.scale.setScalar(scale);
    this.inner.position.set(0, scale === 1 ? 0 : 0.034 - scale * floor, -scale * z);
  }

  async #build() {
    await this.loadMeshes('sistemi-ascendenti.glb', REAL);
    this.#section();
    this.#nuclei();
    this.#dorsalColumns();
    this.#anterolateral();
    this.#spinocerebellar();
    this.#lesions();
  }

  // Aggiunge una geometria a una parte esistente (per esempio la macchia di un
  // fascio reale sulla sezione ingrandita).
  #attach(id, ...geos) {
    const part = this.parts.get(id);
    for (const g of geos) {
      g.computeBoundingBox();
      const c = g.boundingBox.getCenter(new THREE.Vector3());
      const size = g.boundingBox.getSize(new THREE.Vector3());
      g.translate(-c.x, -c.y, -c.z);
      const m = new THREE.Mesh(g, part.mat);
      m.position.copy(c);
      m.userData.size = size;
      m.userData.ui = this.ui(id, part.name);
      m.castShadow = true;
      m.visible = false;
      this.inner.add(m);
      part.meshes.push(m);
    }
  }

  // Una via: tubo sottile (parte nominabile) e connessioni animate lungo gli stessi percorsi.
  #tract(id, name, color, paths, extra = [], r = 0.0021) {
    this.addPart(id, name, color, [...Object.values(paths).map((p) => tube(p, r)), ...extra]);
    for (const [key, pts] of Object.entries(paths)) this.addLink(key, pts, { color, r: r + 0.0009 });
  }

  #section() {
    this.addPart('section', 'sezione di midollo cervicale (ingrandita): sostanza bianca', 0xfaf5e6, [slab(whiteOutline(), PLATE.h, PLATE.y)]);
    this.addPart('grey', 'sostanza grigia', 0x8f7468, [slab(GREY, PLATE.h, PLATE.y + 0.0015)]);
    const two = (dx, dz, rx, rz, rot = 0) => [patch(dx, dz, rx, rz, rot), patch(-dx, dz, rx, rz, -rot)];
    // macchie dei fasci reali, una per lato
    const real = { gracile: [0.85, -3.35, 0.62, 1.3], cuneate: [2.05, -3.6, 0.55, 1.0], sctPost: [6.05, -1.9, 0.45, 1.2, -0.3], sctAnt: [6.4, 0.85, 0.45, 1.15, 0.2], sttLat: [5.0, 2.0, 0.85, 0.75], sttAnt: [3.0, 3.6, 1.1, 0.45, 0.35] };
    for (const [id, [dx, dz, rx, rz, rot = 0]] of Object.entries(real)) {
      this.#attach(`${id}R`, patch(dx, dz, rx, rz, rot));
      this.#attach(`${id}L`, patch(-dx, dz, rx, rz, -rot));
    }
    this.addPart('psdc', 'fascio post-sinaptico del cordone posteriore', 0x8a8f3c, [...two(1.47, -3.5, 0.13, 1.15), ...two(1.3, -4.62, 1.25, 0.14, 0.1)]);
    this.addPart('lissauer', 'tratto di Lissauer', 0xcbb9d8, two(3.6, -4.4, 0.42, 0.22, 0.3));
    this.addPart('waldeyer', 'lamina I (cellule giganti di Waldeyer)', 0x5b2a86, two(3.1, -3.85, 0.5, 0.2).map((g) => g.translate(0, 0.002, 0)));
    this.addPart('gelatinosa', 'sostanza gelatinosa di Rolando', 0xd9a3c6, two(3.0, -3.3, 0.5, 0.3).map((g) => g.translate(0, 0.002, 0)));
    this.addPart('proprius', 'nucleo proprio del corno posteriore', 0xe0a070, two(2.75, -2.3, 0.5, 0.55).map((g) => g.translate(0, 0.002, 0)));
    this.addPart('cba', 'commessura bianca anteriore', 0xf6d27a, [patch(0, 1.15, 1.25, 0.28).translate(0, 0.002, 0), tube(cross(1), 0.0026)]);
    this.addPart('border', 'spinal border cells', 0xb5301f, two(4.25, 1.5, 0.24, 0.75).map((g) => g.translate(0, 0.002, 0)));
    this.addPart('spinotectP', 'fascio spino-tettale (parte profonda dei cordoni)', C.tect, [patch(-4.0, 2.75, 0.5, 0.38)]);

    // sulla sezione: ingresso della radice, sinapsi e incroci
    const up = 0.0075;
    const syn = (id, color, pts) => this.addLink(id, pts.map(([x, z]) => plate(x, z, up)), { color, r: 0.0022 });
    syn('p-dc', C.cuneate, [[6.4, -6.6], [4.2, -5.3], [2.9, -4.5], [2.1, -3.7]]);
    syn('p-horn', C.neo, [[6.4, -6.6], [4.6, -5.3], [3.7, -4.5], [3.1, -3.7]]);
    syn('p-cross', C.neo, [[3.0, -3.2], [2.2, -1.2], [1.1, 0.6], [0, 1.15], [-2.4, 1.6], [-4.8, 2.0]]);
    syn('p-clarke', C.sctD, [[1.5, -0.9], [3.2, -1.5], [4.8, -1.9], [5.9, -1.9]]);
    syn('p-border', C.sctV, [[4.2, 1.5], [2.4, 1.2], [0, 1.15], [-3.4, 1.0], [-6.2, 0.85]]);
  }

  #nuclei() {
    this.addPart('nGracile', 'nucleo gracile (di Goll)', C.gracile, pair(1.4, 31, 1556, [1.25, 1.25, 5.5]));
    this.addPart('nCuneate', 'nucleo cuneato (di Burdach)', C.cuneate, pair(4.2, 29.4, 1561, [1.5, 1.3, 6]));
    this.addPart('nCuneAcc', 'nucleo cuneato accessorio', C.cc, pair(7.4, 26.5, 1568, [1.3, 1.2, 3.2]));
    this.addPart('nucleoZ', 'nucleo Z', 0x8a8f3c, pair(2.7, 28.2, 1567, [1.0, 1.0, 1.7]));
    this.addPart('vpl', 'nucleo ventrale posteriore laterale (VPL)', C.vpl, pair(16.8, 13.2, 1622, [3.4, 4.4, 3.2]));
    this.addPart('diffuse', 'nuclei talamici a proiezione diffusa', 0xe0c040, pair(6, 8, 1627, [1.6, 6, 2.6]));
    const col = (s) => tube([Q(s * 4.5, 18, 1564), Q(s * 4.5, 15, 1574), Q(s * 4.5, 12.5, 1584), Q(s * 4.5, 10.5, 1594)], 0.0072, { radial: 12 });
    this.addPart('reticular', 'formazione reticolare del tronco encefalico', 0x9bb86a, [col(1), col(-1)], { opacity: 0.6 });
    this.addPart('pag', 'grigio periacqueduttale (PAG)', 0x9a86c8, [tube([Q(0, 10.5, 1602), Q(0, 12, 1609), Q(0, 14, 1616)], 0.0085, { radial: 12 })], { opacity: 0.6 });
    const limb = (s) => taperTube([Q(s * 22.5, 9, 1618), Q(s * 24.5, 9.5, 1626), Q(s * 26, 10, 1634), Q(s * 27.5, 11, 1642)], 0.013, { seg: 30, radial: 16, flat: { x: 0.32 } });
    this.addPart('capPost', 'braccio posteriore della capsula interna', IVORY, [limb(1), limb(-1)], { opacity: 0.5 });
    const icp = (s) => taperTube([Q(s * 10.5, 25.3, 1566), Q(s * 12.3, 24.3, 1572), Q(s * 15.3, 23.5, 1579), Q(s * 17.5, 26, 1585), Q(s * 17, 30, 1590), Q(s * 13.5, 34.5, 1595)], [0.0062, 0.0075, 0.0075, 0.007], { seg: 40, radial: 12 });
    this.addPart('icp', 'peduncolo cerebellare inferiore', 0xe2cf9a, [icp(1), icp(-1)], { opacity: 0.5 });
    this.addPart('clarke', 'nucleo dorsale di Clarke (C8/T1-L2)', 0x1f6b4e, [
      tube(climb(1.3, 0.9, CUT + 0.5, 1454), 0.0024), tube(climb(-1.3, 0.9, CUT + 0.5, 1454), 0.0024),
      patch(1.35, -0.95, 0.42, 0.42).translate(0, 0.002, 0), patch(-1.35, -0.95, 0.42, 0.42).translate(0, 0.002, 0),
    ]);
    const column = (dr, db) => (s) => tube(climb(s * dr, db, 1508, 1541), 0.0026);
    this.addPart('nCervLat', 'nucleo cervicale laterale (C1-C3)', C.cerv, [column(4.9, 2.6)(1), column(4.9, 2.6)(-1)]);
    this.addPart('nCervCentr', 'nucleo cervicale centrale (C1-C3)', C.rost, [column(1.5, -0.2)(1), column(1.5, -0.2)(-1), patch(5.2, -1.5, 0.42, 0.5)]);
    this.addPart('bodyR', 'recettori periferici del lato destro', 0x6b5a4a, [ellipsoid(body(1).toArray(), [0.008, 0.008, 0.008])]);
    this.addPart('bodyL', 'recettori periferici del lato sinistro', 0x6b5a4a, [ellipsoid(body(-1).toArray(), [0.008, 0.008, 0.008])]);
  }

  #dorsalColumns() {
    this.#tract('afferent', 'fibra afferente primaria (ramo centrale del neurone a T)', 0xd9a82e, { dc1: entry(1) });
    this.#tract('dcC', 'fibre del fascicolo cuneato', C.cuneate, { dcC: [entry(1).at(-1), ...cuneateUp(1)] });
    this.#tract('dcG', 'fibre del fascicolo gracile', C.gracile, { dcG: gracileUp(1) });
    this.#tract('arcuate', 'fibre arciformi interne (decussazione sensitiva)', C.arc, { arcC: arcC(1), arcG: arcG(1) });
    this.#tract('lmC', 'lemnisco mediale: fibre dal nucleo cuneato', C.cuneate, { lmC: lmC(1) }, [], 0.003);
    this.#tract('lmG', 'lemnisco mediale: fibre dal nucleo gracile', C.gracile, { lmG: lmG(1) }, [], 0.003);
    this.#tract('radiation', 'fibre talamo-corticali', C.tc, { tcC: tcC(1), tcG: tcG(1) });
  }

  #anterolateral() {
    this.#tract('alsIn', 'fibra afferente e sinapsi nel corno posteriore', 0xd9a82e, { al1: toHorn(1) });
    this.addLink('al2', cross(1), { color: C.neo, r: 0.003 });
    this.#tract('neo', 'tratto neo-spino-talamico', C.neo, { neoCord: alsCord(1), neoStem: join(alsStem(1), neoTop(1)) });
    const stem = join(alsStem(1, 1.5), paleoTop(1));
    this.#tract('paleo', 'tratto paleo-spino-talamico', C.paleo, {
      paleoCord: climb(-4.2, -2.9, 1486, TOP), paleoStem: [cord(TOP, -4.2, -2.9), ...stem.slice(1)],
    });
    // collaterali del tratto paleo per la formazione reticolare e il grigio periacqueduttale
    this.addLink('paleo-fr1', [Q(-8.6, 21.5, 1568), Q(-6.8, 19, 1570), Q(-5.2, 16.5, 1571)], { color: C.paleo, r: 0.0024 });
    this.addLink('paleo-fr2', [Q(-11.5, 13, 1588), Q(-8.5, 12.3, 1589), Q(-6, 11.8, 1589)], { color: C.paleo, r: 0.0024 });
    this.addLink('paleo-pag', [Q(-11.8, 9.8, 1609), Q(-7.5, 11.5, 1610.5), Q(-3.6, 12.2, 1611)], { color: C.paleo, r: 0.0024 });
    this.#tract('spinotect', 'fascio spino-tettale', C.tect, { tectCord: climb(-4.0, -2.75, 1486, TOP), tectStem: join(alsStem(1, 0.8).slice(0, -1), tectal(1)) });
    // fascio spino-cervicale: estremo posteriore del cordone laterale, stesso lato
    this.#tract('spinocerv', 'fascio spino-cervicale', C.cerv, {
      spinocerv: [cord(1459, AT.horn[0], AT.horn[1]), cord(1466, 4.5, 3.1), ...climb(4.6, 3.1, 1476, 1512), cord(1522, 4.9, 2.7)],
    }, [patch(4.35, -3.45, 0.5, 0.42)]);
    this.addLink('cerv-lm', [cord(1540, 4.9, 2.6), Q(4.6, 27, 1549), Q(2.6, 22, 1556), Q(0.4, 18.6, 1562), Q(-1.3, 16.2, 1567)], { color: C.cerv, r: 0.0026 });
  }

  #spinocerebellar() {
    // dal peduncolo cerebellare inferiore al lobo anteriore del cervelletto
    const viaIcp = (s) => [Q(s * 12.3, 24.3, 1572), Q(s * 15.3, 23.5, 1579), Q(s * 17.5, 26, 1585), Q(s * 17, 30, 1590), Q(s * 13.5, 34.5, 1595), Q(s * 8, 37.5, 1599.5)];
    this.#tract('sctD', 'fibre del fascio spino-cerebellare dorsale', C.sctD, {
      sctD1: [cord(1447, 1.3, 0.9), cord(1452, 3.4, 1.5), cord(1458, AT.sctPost[0], AT.sctPost[1]), ...climb(AT.sctPost[0], AT.sctPost[1], 1468, TOP)],
      sctD2: [cord(TOP, AT.sctPost[0], AT.sctPost[1]), Q(6.9, 28.6, 1554), Q(8.6, 27, 1561), Q(10.6, 25.3, 1567), ...viaIcp(1)],
    });
    this.addLink('sctD-z', [Q(8.6, 27, 1561), Q(5.5, 28, 1564.5), Q(3.6, 28.3, 1566.5)], { color: C.sctD, r: 0.0022 });
    // ventrale: sale a sinistra (ha già incrociato), scavalca il peduncolo cerebellare superiore e incrocia di nuovo
    this.#tract('sctV', 'fibre del fascio spino-cerebellare ventrale', C.sctV, {
      sctV1: climb(-AT.sctAnt[0], AT.sctAnt[1], CUT + 1, TOP),
      sctV2: [cord(TOP, -AT.sctAnt[0], AT.sctAnt[1]), Q(-7.6, 25, 1553), Q(-10, 23.5, 1561), Q(-12, 21.5, 1569), Q(-13.6, 19, 1577), Q(-15, 16, 1585), Q(-15, 13.5, 1592), Q(-12.5, 11.2, 1598), Q(-10, 12.5, 1602.5), Q(-8.5, 17, 1604), Q(-7.5, 23, 1601.5), Q(-5, 30, 1600), Q(0, 34, 1601), Q(5, 37, 1602)],
    });
    this.#tract('cuneoc', 'fascio cuneo-cerebellare', C.cc, {
      cc1: [entry(1).at(-1), ...climb(3.1, 2.7, 1461, TOP), Q(5, 29.4, 1556), Q(7, 27.4, 1563), Q(7.4, 26.6, 1567)],
      cc2: [Q(7.6, 26.4, 1569), Q(10.2, 25.2, 1570.5), ...viaIcp(1).map((p) => p.clone().add(V(0, 0, 0.004)))],
    });
    this.#tract('rostral', 'fascio spino-cerebellare rostrale', C.rost, {
      rost1: [cord(1468, 4.2, -1.5), cord(1474, 5.6, -0.8), ...climb(6.4, -0.3, 1482, TOP)],
      rost2: [cord(TOP, 6.4, -0.3), Q(7.6, 26.6, 1554), Q(9.6, 25, 1562), Q(11.3, 23.6, 1568), ...viaIcp(1).map((p) => p.clone().add(V(0, 0, -0.004)))],
    }, [patch(6.65, -0.45, 0.33, 0.42)]);
  }

  // Quattro vie intere (tatto fine e dolore, dai due lati) e tre sedi di lesione.
  #lesions() {
    const touch = (s) => join(entry(s), cuneateUp(s), arcC(s), lmC(s), tcC(s));
    const pain = (s) => join(entry(s), toHorn(s), cross(s), alsCord(s), alsStem(s), neoTop(s), tcC(s, 3).slice(1));
    const whole = (id, name, color, pts) => {
      this.addPart(id, name, color, [tube(pts, 0.0021, { seg: 240 })]);
      this.addLink(id, pts, { color, r: 0.003 });
    };
    whole('touchR', 'tatto fine e propriocezione del lato destro', C.touch, touch(1));
    whole('touchL', 'tatto fine e propriocezione del lato sinistro', 0x7fb0f0, touch(-1));
    whole('painR', 'dolore e temperatura del lato destro', C.pain, pain(1));
    whole('painL', 'dolore e temperatura del lato sinistro', 0xf09aa0, pain(-1));
    // le stesse vie fino alla sede della lesione
    this.addLink('touchR-cord', below(touch(1), 1492), { color: C.touch, r: 0.003 });
    this.addLink('painL-cord', below(pain(-1), 1492), { color: C.pain, r: 0.003 });
    this.addLink('touchR-pons', below(touch(1), 1584), { color: C.touch, r: 0.003 });
    this.addLink('touchR-thal', below(touch(1), 1616), { color: C.touch, r: 0.003 });
    this.addLink('painR-thal', below(pain(1), 1616), { color: C.pain, r: 0.003 });
    const DARK = 0x2b2420;
    this.addPart('lesCord', 'lesione: emisezione destra del midollo', DARK, [blob(3.7, canal(1497) + 0.3, 1497, [3.9, 5.3, 1.1])]);
    this.addPart('lesPons', 'lesione del lemnisco mediale sinistro nel ponte', DARK, [blob(-4.6, 7.8, 1588.5, [3.6, 1.9, 2.2])]);
    this.addPart('lesThal', 'lesione del VPL sinistro', DARK, [blob(-17.5, 13, 1622.5, [4.6, 5.4, 4.2])]);
  }
}
