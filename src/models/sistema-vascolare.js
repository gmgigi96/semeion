// Modello della vascolarizzazione dell'encefalo.
//
// MESH REALI (BodyParts3D 4.0, public/meshes/sistema-vascolare.glb, manifesto in
// meshes/sistema-vascolare.json): carotidi interne, arterie oftalmiche, corioidee
// anteriori, comunicanti, cerebrali anteriori, medie e posteriori con i rami
// corticali e perforanti, vertebrali, spinali anteriori, basilare con i rami
// pontini, PICA, AICA, SCA; giri corticali, tronco encefalico, cervelletto,
// capsula interna, putamen, tentorio del cervelletto.
//   - L'AICA esiste in BodyParts3D solo a sinistra, il tentorio solo a destra:
//     l'altro lato è la copia speculare della mesh reale.
//   - I tre territori corticali (terrACA, terrMCA, terrPCA) sono i giri reali,
//     divisi con regole di posizione (vedi `split` nel manifesto) secondo le
//     mappe dei territori: cerebrale anteriore = faccia mediale di frontale e
//     parietale più una striscia di circa 2 cm oltre il margine superiore;
//     posteriore = lobo occipitale, faccia inferiore del temporale, istmo;
//     media = il resto della faccia laterale e l'insula. I confini sono
//     un'approssimazione didattica: nella realtà variano da persona a persona.
//
// RICOSTRUITI A MANO: seni della dura madre e vene profonde, che BodyParts3D
// non contiene. Sono tubi posati su punti di repere misurati sulle mesh reali
// (coordinate BodyParts3D in mm, convertite da `mm`):
//   - seno sagittale superiore e seno occipitale: profilo interno, sul piano
//     mediano, di osso frontale, parietali e occipitale (dal forame cieco alla
//     protuberanza occipitale interna);
//   - seno retto: linea mediana del tentorio reale (attacco della falce);
//     seni trasversi e petrosi superiori: margine aderente del tentorio reale
//     (squama dell'occipitale, poi cresta della rocca);
//   - seno sigmoideo e bulbo della giugulare: dal margine laterale del tentorio
//     al foro giugulare, individuato sulle mesh di temporale e occipitale subito
//     dietro e di lato all'ingresso della carotide reale nel canale carotico;
//   - seno cavernoso (circa 1 x 2 cm): attorno al tratto intracavernoso della
//     carotide reale, dalla fessura orbitaria superiore all'apice della rocca;
//   - seno sagittale inferiore, vena di Galeno, vene cerebrali interne e basali:
//     attorno allo splenio del corpo calloso, al talamo e al peduncolo
//     cerebrale reali.
// Fonti lette per decorso, forma e rapporti (solo voci di Wikipedia: Gray,
// StatPearls e Radiopaedia non erano raggiungibili; i calibri dei seni sono
// valori plausibili, non misure tratte da una fonte):
//   - «Superior sagittal sinus», https://en.wikipedia.org/wiki/Superior_sagittal_sinus
//     (sezione triangolare, calibro crescente dall'avanti all'indietro, dal forame cieco al confluente)
//   - «Dural venous sinuses», https://en.wikipedia.org/wiki/Dural_venous_sinuses
//     (schema dei collegamenti: chi drena in chi)
//   - «Cavernous sinus», https://en.wikipedia.org/wiki/Cavernous_sinus
//     (circa 1 x 2 cm; dalla fessura orbitaria superiore all'apice della rocca; contiene il sifone carotideo)
//   - «Great cerebral vein», https://en.wikipedia.org/wiki/Great_cerebral_vein
//     (lunghezza media circa 1 cm; sbocco nel seno retto)
// Territori corticali: da verificare. Riferimenti non letti direttamente, noti
// solo dal riassunto di una ricerca: Radiopaedia, «Cerebral vascular territories»
// (https://radiopaedia.org/articles/1085); Kim et al., JAMA Neurol 2019
// (https://pmc.ncbi.nlm.nih.gov/articles/PMC6439879).
//
// Coordinate del modello: x laterale (destra +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror, both } from '../geo.js';

// Da millimetri BodyParts3D (lato destro: `x` = distanza dal piano mediano,
// `y` verso dietro, `z` verso l'alto) alle coordinate del modello; stessa
// terna del manifesto: origine (0, -80, 1437), 0.0041 unità per mm.
const S = 0.0041;
const mm = (x, y, z) => V(x * S, (z - 1437) * S, -(y + 80) * S);
const tube = (pts, r, opts) => taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, opts);
const ball = ([x, y, z], [rx, ry, rz]) => {
  const c = mm(x, y, z);
  return ellipsoid([c.x, c.y, c.z], [rx * S, rz * S, ry * S]);
};

const ICA = 0xb5302e, ACA = 0x2f9a63, MCA = 0xe0662f, PCA = 0x8e5bb5, VB = 0xa83a6e, COMM = 0xdb9a12;
const SINUS = 0x3557b7, DEEP = 0x4a8fd6, BASE = 0x2a7f9e;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  icaCerv: ['carotide interna, tratto cervicale', ICA],
  icaPetr: ['carotide interna, tratto intrapetroso', 0xc9483f],
  icaCav: ['carotide interna, tratto intracavernoso e sifone', 0xd96a52],
  icaCer: ['carotide interna, tratto cerebrale', ICA],
  ophthalmic: ['arteria oftalmica', 0xe08a8a],
  achor: ['arteria corioidea anteriore', 0xd98c5a],
  pcom: ['arteria comunicante posteriore', COMM],
  acom: ['arteria comunicante anteriore', COMM],
  aca: ['arteria cerebrale anteriore', ACA],
  acaB: ['rami della cerebrale anteriore (calloso-marginale, pericallosa)', 0x3fb277],
  mca: ['arteria cerebrale media (silviana)', MCA],
  striate: ['arterie lenticolo-striate', 0xf0a03c],
  mcaB: ['rami corticali della cerebrale media', 0xea7d4a],
  va: ['arteria vertebrale', VB],
  asa: ['arteria spinale anteriore', 0xc86a94],
  basilar: ['tronco basilare e arterie pontine', VB],
  pica: ['arteria cerebellare posteriore inferiore (PICA)', 0x3f9e96],
  aica: ['arteria cerebellare anteriore inferiore (AICA)', 0xd9b23c],
  sca: ['arteria cerebellare superiore (SCA)', 0xd9628f],
  pcaP1: ['arteria cerebrale posteriore, tratto precomunicante', PCA],
  pca: ['arteria cerebrale posteriore', PCA],
  pcaB: ['rami corticali della cerebrale posteriore (temporali, parieto-occipitale, calcarina)', 0xa377cc],
  pcaDeep: ['rami perforanti e corioidei della cerebrale posteriore', 0xb894d6],
  terrACA: ['territorio della cerebrale anteriore', 0x9ed3b3],
  terrMCA: ['territorio della cerebrale media', 0xf2b693],
  terrPCA: ['territorio della cerebrale posteriore', 0xc6ace3],
  midbrain: ['mesencefalo', 0xe3cdb6, { ghost: true, opacity: 0.14 }],
  pons: ['ponte', 0xe3cdb6, { ghost: true, opacity: 0.14 }],
  medulla: ['bulbo', 0xe3cdb6, { ghost: true, opacity: 0.16 }],
  cerebellum: ['cervelletto', 0xdcb9a6, { ghost: true, opacity: 0.1 }],
  capsule: ['capsula interna', 0xf1ead8],
  putamen: ['putamen', 0xd9a05a],
  tentorium: ['tentorio del cervelletto', 0xcfd6e6, { ghost: true, opacity: 0.2 }],
};

export class SistemaVascolare extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: -0.03, rod: [0, 0.02, 0.125, -0.05] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('sistema-vascolare.glb', REAL);
    this.#mirrorPart('aica');
    this.#mirrorPart('tentorium');
    // involucro trasparente degli emisferi: gli stessi giri dei territori
    const shell = ['terrACA', 'terrMCA', 'terrPCA'].flatMap((id) =>
      this.parts.get(id).meshes.map((m) => m.geometry.clone().translate(m.position.x, m.position.y, m.position.z))
    );
    this.addPart('hemi', 'emisferi cerebrali', 0xe7c9b9, shell, { ghost: true, opacity: 0.085 });
    this.#veins();
  }

  // Lato mancante di una mesh reale presente da un solo lato.
  #mirrorPart(id) {
    const part = this.parts.get(id);
    for (const m of [...part.meshes]) {
      const c = new THREE.Mesh(mirror(m.geometry), part.mat);
      c.position.set(-m.position.x, m.position.y, m.position.z);
      c.userData = { ...m.userData };
      c.castShadow = m.castShadow;
      c.renderOrder = m.renderOrder;
      c.visible = false;
      this.inner.add(c);
      part.meshes.push(c);
    }
  }

  // Seni della dura madre e vene profonde (ricostruiti: vedi fonti in testa).
  #veins() {
    // profilo interno della volta sul piano mediano [y, z] in mm, dal forame
    // cieco alla protuberanza occipitale interna; il seno sta 3,5 mm all'interno
    const vault = [
      [-161, 1541], [-165, 1553], [-168.5, 1569], [-163, 1586], [-157, 1598.5], [-146, 1609.5], [-131.5, 1618.5],
      [-117.5, 1623.5], [-101, 1628], [-80.5, 1630.5], [-57, 1630.5], [-41.5, 1626.5], [-18, 1611.5], [-6, 1599],
      [3.5, 1585.5], [7.5, 1571], [10.5, 1553.5], [10, 1538], [4, 1523], [-4, 1514],
    ];
    const inward = ([y, z], d) => {
      const k = d / Math.hypot(y + 80, z - 1545);
      return [0, y - (y + 80) * k, z - (z - 1545) * k];
    };
    this.addPart('sss', 'seno sagittale superiore', SINUS,
      [tube(vault.map((p) => inward(p, 3.5)), [1.4, 2.2, 3, 3.6, 4.2, 4.4], { seg: 90, flat: { x: 1.25 } })]);
    this.addPart('conf', 'confluente dei seni (torculare di Erofilo)', 0x24408f, [ball([0, -10, 1511.5], [5.5, 4.5, 5])]);
    this.addPart('ssi', 'seno sagittale inferiore', 0x5b7fd9,
      [tube([[0, -118, 1589], [0, -95, 1592], [0, -70, 1589], [0, -52, 1580], [0, -41, 1567], [0, -37.5, 1552], [0, -40, 1541.5]], [1, 1.4], { seg: 50 })]);
    this.addPart('straight', 'seno retto', SINUS,
      [tube([[0, -40, 1541], [0, -36, 1538], [0, -30, 1533], [0, -23, 1527], [0, -15, 1519], [0, -10.5, 1513]], [2, 2.6], { caps: false })]);
    this.addPart('galen', 'grande vena cerebrale di Galeno', DEEP,
      [tube([[0, -51, 1541.5], [0, -46, 1540.5], [0, -40, 1541]], 2.1, { caps: false })]);
    this.addPart('icv', 'vene cerebrali interne', 0x6aa6e0,
      both(tube([[2, -98, 1554], [2.5, -82, 1560.5], [2.5, -68, 1557], [2, -59, 1549], [1, -54, 1543.5], [0.5, -51, 1541.5]], [0.8, 1.2], { seg: 40 })));
    this.addPart('basal', 'vene basali di Rosenthal', 0x6aa6e0,
      both(tube([[14, -108, 1536.5], [21, -98, 1534], [23.5, -86, 1535], [18, -72, 1539], [9, -60, 1541], [1.5, -52, 1541.5]], [0.8, 1.2], { seg: 40 })));
    this.addPart('trans', 'seno trasverso', SINUS,
      both(tube([[2, -9.5, 1511], [15, -8.5, 1512], [28, -10.5, 1514.5], [39, -16, 1517.5], [50, -25.5, 1519], [58.5, -37.5, 1519.5], [58, -51, 1520]], 3.7, { seg: 50, caps: false })));
    this.addPart('sig', 'seno sigmoideo', 0x4466c9,
      both(tube([[58, -51, 1520], [55, -58, 1510.5], [48.5, -63.5, 1501.5], [41.5, -70.5, 1494.5], [35, -79, 1490.5], [30.5, -84.5, 1491]], 3.7, { seg: 50, caps: false })));
    this.addPart('ijv', 'bulbo della giugulare e vena giugulare interna', 0x24408f,
      both(ball([30, -86, 1489.5], [5.2, 5.2, 5.5])).concat(
        both(tube([[30, -86.5, 1488], [33, -90.5, 1477], [37, -95.5, 1462], [40, -99, 1446], [41, -100, 1440]], 4.2, { caps: false }))));
    this.addPart('occ', 'seno occipitale', BASE,
      [tube([[0, -11, 1509.5], [0, -17.5, 1502], [0, -27, 1493.5], [0, -38, 1489]], [1.5, 1.1])]);
    this.addPart('cav', 'seno cavernoso', BASE, both(ball([13.5, -104, 1518.5], [5.2, 11, 6.5])));
    this.addPart('intercav', 'seni intercavernosi anteriore e posteriore', 0x4fa3bf,
      [tube([[-9.5, -111, 1521], [0, -112, 1520.5], [9.5, -111, 1521]], 1.2, { caps: false }),
       tube([[-9.5, -98, 1520], [0, -97, 1519.5], [9.5, -98, 1520]], 1.2, { caps: false })]);
    this.addPart('spet', 'seno petroso superiore', 0x4fa3bf,
      both(tube([[14, -94, 1515], [20, -89, 1514], [37, -74, 1518.5], [49, -65.5, 1520], [57, -53.5, 1520]], 1.4, { caps: false })));
    this.addPart('ipet', 'seno petroso inferiore', 0x6fc0d6,
      both(tube([[12.5, -93.5, 1512], [17, -90, 1504.5], [23, -87, 1497], [28.5, -85.5, 1491.5]], 1.7, { caps: false })));
    this.addPart('sphenopar', 'seno sfenoparietale di Breschet', 0x4fa3bf,
      both(tube([[56, -119, 1559], [46, -120.5, 1545], [31, -117.5, 1534], [18, -113.5, 1524]], [1, 1.4])));
  }
}
