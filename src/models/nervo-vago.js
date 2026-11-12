// Modello del nervo vago (X), dal bulbo allo stomaco.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/nervo-vago.glb, manifesto
// in meshes/nervo-vago.json):
//   - nervo vago dei due lati, dal bulbo a metà collo (quota 1479 mm), diviso per
//     posizione (`split`) in: fibre intrabulbari e radicole (vxRoot), tronco
//     verso il foro giugulare (vxCist), ganglio superiore (gJug) e inferiore
//     (gNod), che nell'oggetto Z-Anatomy sono due rigonfiamenti del tubo, tratto
//     sotto la base cranica (vxSub), tratto cervicale alto (unito a quello
//     ricostruito in vagCervR/L), ramo che dal tronco va al costrittore medio
//     della faringe (vxPhar: Z-Anatomy non gli dà un nome; è identificato come
//     ramo faringeo per origine e termine, vedi fonti);
//   - nervi glossofaringeo, ipoglosso e accessorio di destra;
//   - nucleo ambiguo, nucleo posteriore (motore dorsale) del vago, nucleo del
//     tratto solitario, nuclei dell'accessorio e dell'ipoglosso; l'oggetto
//     «Sensory root of trigeminal nerve», di cui si usa la parte bulbare come
//     nucleo della radice discendente del trigemino;
//   - bulbo, ponte, base cranica, colonna cervicale e toracica;
//   - osso ioide, cartilagini tiroidea, cricoidea, aritenoidi, epiglottide,
//     muscoli cricotiroideo e intrinseci della laringe, costrittori medio e
//     inferiore della faringe, tiroide, trachea, bronchi principali, esofago;
//   - arco aortico, aorta ascendente e toracica, tronco brachiocefalico,
//     succlavie, carotidi comuni e interne, giugulari interne, cuore, polmoni,
//     diaframma, stomaco.
// I tubi dei nervi di Z-Anatomy hanno raggio 0,2-0,5 mm: qui sono ingrossati
// lungo le normali (`inflate`) fino a un calibro verosimile (tronco del vago
// circa 4 mm di diametro: valore stimato, non letto in una fonte).
//
// PERCHÉ IL VAGO È REALE SOLO FINO A METÀ COLLO. Sotto la quota 1479 l'oggetto
// Z-Anatomy è simmetrico e schematico: a sinistra corre dentro il lume della
// carotide comune e dell'arco aortico, a destra passa dietro la succlavia,
// attraversa il bronco principale e poi l'aorta discendente; i due nervi
// laringei ricorrenti mancano. Quei tratti sono scartati (le regole di `split`
// non li assegnano ad alcuna parte) e ricostruiti.
//
// RICOSTRUITI A MANO sulle mesh reali, in mm nella terna Z-Anatomy (le distanze
// dagli assi di vasi, trachea, bronchi ed esofago reali sono state controllate
// numericamente perché i tubi non li attraversino):
//   - vago cervicale basso e toracico dei due lati. Destro: dietro e medialmente
//     alla carotide comune, davanti alla succlavia, lungo il fianco destro della
//     trachea, dietro il bronco principale destro, poi sulla faccia posteriore
//     dell'esofago. Sinistro: dietro la carotide comune, tra carotide comune e
//     succlavia, sul fianco sinistro dell'arco aortico, dietro il bronco
//     principale sinistro (tra bronco e aorta discendente), poi sulla faccia
//     anteriore dell'esofago (rapporti verificati sulle fonti, coordinate stimate);
//   - nervi laringei ricorrenti: il destro nasce davanti alla succlavia, le gira
//     sotto e dietro; il sinistro nasce sul fianco dell'arco, gli passa sotto e
//     risale medialmente; entrambi salgono nell'angolo tra trachea ed esofago
//     reali, dietro i lobi della tiroide, ed entrano nella laringe dietro
//     l'articolazione crico-tiroidea (decorso verificato, coordinate stimate);
//   - nervo laringeo superiore con ramo interno (verso la membrana tiro-ioidea)
//     ed esterno (al muscolo cricotiroideo reale), ansa di Galeno (stimati);
//   - ramo auricolare e ramo meningeo dal ganglio superiore (solo origine e
//     direzione: stimati);
//   - rami bronchiali (plesso polmonare), plesso esofageo anteriore e
//     posteriore, tronchi vagali anteriore e posteriore, disegnati sulla
//     superficie dell'esofago reale (asse e sezione misurati sulla mesh); rami
//     gastrici anteriori e posteriori, appoggiati sulla superficie dello stomaco
//     reale (campionata sui vertici): numero e disposizione dei rami sono schematici;
//   - rami cardiaci e parte profonda del plesso cardiaco (davanti alla
//     biforcazione della trachea, dietro l'arco: posizione verificata; numero e
//     decorso dei rami schematici);
//   - anello rosso nel punto di lesione.
//
// FONTI LETTE:
//   - «Vagus nerve», https://en.wikipedia.org/wiki/Vagus_nerve
//     (uscita dal bulbo tra oliva e peduncolo cerebellare inferiore, foro
//     giugulare, guaina carotidea tra carotide e giugulare interna; il destro
//     davanti alla succlavia, dietro la vena cava superiore e dietro il bronco
//     destro, tronco vagale posteriore; il sinistro tra carotide comune e
//     succlavia, sull'arco aortico, tronco vagale anteriore; nuclei)
//   - «Recurrent laryngeal nerve», https://en.wikipedia.org/wiki/Recurrent_laryngeal_nerve
//     (ansa sotto la succlavia destra e sotto l'arco aortico al legamento
//     arterioso, solco tra trachea ed esofago, rapporto con la tiroide, ingresso
//     dietro l'articolazione crico-tiroidea, muscoli innervati, effetti della lesione)
//   - «Superior laryngeal nerve», https://en.wikipedia.org/wiki/Superior_laryngeal_nerve
//     (origine dal ganglio inferiore, decorso profondo alla carotide interna,
//     ramo interno attraverso la membrana tiro-ioidea, ramo esterno al cricotiroideo)
//   - «Pharyngeal branch of vagus nerve», https://en.wikipedia.org/wiki/Pharyngeal_branch_of_vagus_nerve
//     (origine dalla parte alta del ganglio inferiore, arrivo al margine
//     superiore del costrittore medio)
//   - «Inferior ganglion of vagus nerve», https://en.wikipedia.org/wiki/Inferior_ganglion_of_vagus_nerve
//     (subito sotto il foro giugulare, allungato, più grande del superiore)
//   - «Nucleus ambiguus», https://en.wikipedia.org/wiki/Nucleus_ambiguus
//   - «Dorsal nucleus of vagus nerve», https://en.wikipedia.org/wiki/Dorsal_nucleus_of_vagus_nerve
//   - «Esophageal plexus», https://en.wikipedia.org/wiki/Esophageal_plexus
//     (il vago sinistro diventa tronco anteriore, il destro posteriore)
//   - «Cardiac plexus», https://en.wikipedia.org/wiki/Cardiac_plexus
//     (parte profonda davanti alla biforcazione tracheale e dietro l'arco aortico)
//   - «Pulmonary plexus», https://en.wikipedia.org/wiki/Pulmonary_plexus
//     (la parte posteriore, dietro la radice del polmone, è la principale)
//   - «The Vagus Nerve (CN X)», https://teachmeanatomy.info/head/cranial-nerves/vagus-nerve-cn-x/
//     (il destro davanti alla succlavia, il sinistro tra carotide comune e succlavia)
// Non lette (accesso rifiutato o non tentato): StatPearls/NCBI, Radiopaedia, Gray.
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

// Da millimetri Z-Anatomy (`a` = verso destra, `b` verso dietro, `h` verso
// l'alto) alle coordinate del modello; stessa terna del manifesto.
const S = 0.0015, OZ = 1095;
const mm = (a, b, h) => V(a * S, (h - OZ) * S, -b * S);
const tube = (pts, r, opts) =>
  taperTube(pts.map((p) => (p.isVector3 ? p : mm(...p))), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, seg: Math.max(16, pts.length * 7), ...opts });
const ball = ([a, b, h], [ra, rb, rh]) => {
  const c = mm(a, b, h);
  return ellipsoid([c.x, c.y, c.z], [ra * S, rh * S, rb * S], null, 16);
};
const ring = (p, n, r) => {
  const g = new THREE.TorusGeometry(r * S, r * S * 0.3, 10, 28);
  const d = V(n[0], n[2], -n[1]).normalize();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d));
  const c = mm(...p);
  return g.translate(c.x, c.y, c.z);
};
const flip = (pts) => pts.map(([a, b, h]) => [-a, b, h]);

const NERVE = 0xe6bd2e, BONE = 0xe9dfc8, STEM = 0xe3cdb6, ARTERY = 0xc9485b, VEIN = 0x4a6fb5, CART = 0xcfdfe2;
const MUSCLE = 0xb85a50, GANGLION = 0xe0662f, REC_R = 0xe07b39, REC_L = 0x8e5bb5, SLN = 0x2f9a63, CUT = 0xd42a2a, GREY = 0x9a958c;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  vxRoot: ['fibre intrabulbari e radicole del vago', NERVE],
  vxCist: ['tronco del vago verso il foro giugulare', NERVE],
  gJug: ['ganglio superiore o giugulare', GANGLION],
  gNod: ['ganglio inferiore o nodoso', 0x7a4fd0],
  vxSub: ['vago sotto la base cranica', NERVE],
  vxCervR: ['vago cervicale', NERVE],
  vxCervL: ['vago cervicale', NERVE],
  vxPhar: ['rami faringei', 0xd9902b],
  ix: ['nervo glossofaringeo (IX)', 0x5fa8a0],
  xii: ['nervo ipoglosso (XII)', 0xd77fb0],
  xi: ['nervo accessorio (XI)', 0x6f9fd9],
  nucAmb: ['nucleo ambiguo', 0xc9485b],
  nucDors: ['nucleo motore dorsale del vago', 0x2f6fe0],
  nucSol: ['nucleo del tratto solitario', 0x2f9a63],
  nucSpV: ['nucleo e tratto della radice discendente del trigemino', 0xe0862f],
  nucXI: ["nucleo dell'accessorio", GREY],
  nucXII: ["nucleo dell'ipoglosso", GREY],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.3 }],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.22 }],
  skullBase: ['base cranica', BONE, { ghost: true, opacity: 0.1 }],
  spineC: ['colonna cervicale', BONE, { ghost: true, opacity: 0.1 }],
  spineT: ['colonna toracica', BONE, { ghost: true, opacity: 0.1 }],
  hyoid: ['osso ioide', BONE],
  thyroidCart: ['cartilagine tiroidea', CART],
  cricoid: ['cartilagine cricoidea', 0xb9cfd4],
  epiglottis: ['epiglottide', 0xd9c98a],
  arytenoid: ['cartilagini aritenoidi', 0xa9c4ca],
  cricothyroid: ['muscolo crico-tiroideo', 0x3f9a6a],
  intrinsicR: ['muscoli intrinseci della laringe, lato destro', MUSCLE],
  intrinsicL: ['muscoli intrinseci della laringe, lato sinistro', MUSCLE],
  constrictor: ['muscoli costrittori medio e inferiore della faringe', 0xc98f7d],
  thyroid: ['tiroide', 0x9a4f5a],
  tracheaC: ['trachea', CART],
  tracheaT: ['trachea', CART],
  bronchiTop: ['bronchi principali', 0xb9cfd4],
  bronchiLow: ['bronchi principali', 0xb9cfd4],
  esoC: ['esofago', 0xd99a86],
  esoM: ['esofago', 0xd99a86],
  esoLow: ['esofago', 0xd99a86],
  stomach: ['stomaco', 0xe3b3a0, { double: true }],
  diaphragm: ['diaframma', 0xb5766a, { ghost: true, opacity: 0.09 }],
  arch: ['arco aortico', ARTERY],
  aortaAscTop: ['aorta ascendente', ARTERY],
  aortaAscLow: ['aorta ascendente', ARTERY],
  aortaDescTop: ['aorta toracica', ARTERY],
  aortaDescLow: ['aorta toracica', ARTERY],
  brachioceph: ['tronco brachiocefalico', ARTERY],
  subclavianR: ['arteria succlavia destra', 0xe05a4a],
  subclavianL: ['arteria succlavia sinistra', 0xd9655a],
  ccaR: ['arteria carotide comune destra', ARTERY],
  ccaL: ['arteria carotide comune sinistra', ARTERY],
  icaR: ['arteria carotide interna destra', ARTERY],
  icaL: ['arteria carotide interna sinistra', ARTERY],
  jugLowR: ['vena giugulare interna destra', VEIN],
  jugHighR: ['vena giugulare interna destra', VEIN],
  jugLowL: ['vena giugulare interna sinistra', VEIN],
  jugHighL: ['vena giugulare interna sinistra', VEIN],
  heart: ['cuore', 0xb5474a, { ghost: true, opacity: 0.3 }],
  lungR: ['polmone destro', 0xd9a3a8, { ghost: true, opacity: 0.07 }],
  lungL: ['polmone sinistro', 0xd9a3a8, { ghost: true, opacity: 0.07 }],
};

// Di quanti mm ingrossare i tubi dei nervi reali (raggio di partenza 0,2-0,5 mm).
const INFLATE = { vxRoot: 0.25, vxCist: 1.3, gJug: 1.2, gNod: 2.2, vxSub: 1.5, vxCervR: 1.5, vxCervL: 1.5, vxPhar: 0.6, nucSpV: 0.4, ix: 0.7, xii: 0.7, xi: 0.7 };

// Asse dell'esofago reale (misurato sulla mesh a fette di 15 mm): quota -> [a, b].
const ESO = [[1472, 0, -2.7], [1457, -0.5, -0.2], [1442, -0.9, 3.6], [1427, -1, 6.9], [1412, -0.8, 11.3], [1397, -0.6, 15.7], [1382, -0.6, 19.2],
  [1367, -0.7, 23.2], [1352, -0.8, 26.6], [1337, -1, 28.8], [1322, -1.3, 29], [1307, -1.6, 27.3], [1292, -1.6, 24.5], [1277, -1.4, 20],
  [1262, -1.3, 14.8], [1247, -0.8, 8.6], [1232, -0.8, 2], [1217, -3.9, -5.4], [1202, -8.3, -11.8]];
// Punto sulla superficie dell'esofago alla quota h: deg 0 = destra, 90 = dietro,
// 180 = sinistra, 270 = davanti; `d` mm fuori dalla parete (semiassi 9 e 5,8 mm).
const eso = (h, deg, d = 0.6) => {
  let i = ESO.findIndex((r) => r[0] <= h);
  if (i < 0) i = ESO.length - 1;
  i = Math.max(1, i);
  const [h0, a0, b0] = ESO[i - 1], [h1, a1, b1] = ESO[i];
  const t = Math.min(1, Math.max(0, (h0 - h) / (h0 - h1)));
  const t0 = (deg * Math.PI) / 180;
  return [a0 + (a1 - a0) * t + (9 + d) * Math.cos(t0), b0 + (b1 - b0) * t + (5.8 + d) * Math.sin(t0), h];
};

export class NervoVago extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: 0, rod: [0, 0.02, 0.06, -0.085] });
    this.rod = this.inner.children.at(-1);
    this.ready = this.#build();
  }

  // Primo piano: il punto `c` (mm) va sull'asse di rotazione, all'altezza `h`,
  // e il modello è ingrandito di `k`. `reset` lo riporta a posto.
  focus(c, k, h = 0.4) {
    const p = mm(...c).multiplyScalar(k);
    this.inner.scale.setScalar(k);
    this.inner.position.set(-p.x, h - p.y, -p.z);
    this.rod.visible = false;
  }

  reset() {
    super.reset();
    this.inner.position.set(0, 0, 0);
    this.inner.scale.setScalar(1);
    this.rod.visible = true;
  }

  async #build() {
    await this.loadMeshes('nervo-vago.glb', REAL);
    // i nervi reali sono tubi sottilissimi: li ingrosso lungo le normali
    for (const [id, d] of Object.entries(INFLATE))
      for (const m of this.parts.get(id).meshes) {
        const pos = m.geometry.attributes.position, ix = m.geometry.index.array;
        // gli oggetti del lato sinistro hanno le facce rivolte all'interno
        // (volume con segno negativo): le rigiro prima di ingrossare
        let vol = 0;
        const a = V(0, 0, 0), b = V(0, 0, 0), c = V(0, 0, 0);
        for (let t = 0; t < ix.length; t += 3)
          vol += a.fromBufferAttribute(pos, ix[t]).dot(b.fromBufferAttribute(pos, ix[t + 1]).cross(c.fromBufferAttribute(pos, ix[t + 2])));
        if (vol < 0) {
          for (let t = 0; t < ix.length; t += 3) [ix[t + 1], ix[t + 2]] = [ix[t + 2], ix[t + 1]];
          m.geometry.index.needsUpdate = true;
          m.geometry.computeVertexNormals();
        }
        const nor = m.geometry.attributes.normal;
        for (let i = 0; i < pos.count; i++) pos.setXYZ(i, pos.getX(i) + nor.getX(i) * d * S, pos.getY(i) + nor.getY(i) * d * S, pos.getZ(i) + nor.getZ(i) * d * S);
        pos.needsUpdate = true;
      }
    const geo = (id) => this.parts.get(id).meshes.map((m) => m.geometry.clone().translate(m.position.x, m.position.y, m.position.z));

    // --- vago cervicale: tratto reale (fino a quota 1479) + tratto ricostruito ---
    const neckR = [[23.8, -1.6, 1487], [23.6, -1.9, 1481], [22.6, -0.8, 1474], [21.2, 0.3, 1467], [19, -0.8, 1458], [18, -3, 1449],
      [18.8, -5, 1440], [21.3, -8.2, 1430], [22, -11, 1420], [21.9, -11.5, 1415.5]];
    this.addPart('vagCervR', 'nervo vago destro, tratto cervicale', NERVE, [...geo('vxCervR'), tube(neckR, 2, { caps: false })]);
    const neckL = [[-23.8, -1.6, 1487], [-23.6, -1.9, 1481], [-24.5, 4.8, 1473], [-27, 5, 1466], [-26, 3.5, 1458], [-23.5, 2.5, 1450],
      [-22.8, 1.5, 1440], [-22.5, 1, 1430], [-21.5, 0.5, 1420], [-20, 0.3, 1410], [-19.7, 0.4, 1404]];
    this.addPart('vagCervL', 'nervo vago sinistro, tratto cervicale', NERVE, [...geo('vxCervL'), tube(neckL, 2, { caps: false })]);

    // --- vago toracico fino alla radice del polmone ---------------------------
    const thorR = [[22, -11, 1419], [21.8, -11.5, 1413], [19.5, -8.5, 1404], [15.5, -2.5, 1395], [13.8, 3.5, 1385], [14.8, 10, 1375],
      [15.5, 16.5, 1366.5], [14.5, 23.5, 1358], [11.5, 27.2, 1349.5], [8, 31.5, 1341], eso(1336, 62, 1)];
    this.addPart('vagThorR', 'nervo vago destro, tratto toracico', NERVE, [tube(thorR, 2, { caps: false })]);
    const thorL = [[-20, 0.3, 1408], [-19.6, 0.5, 1402], [-23.2, 0, 1398], [-28.6, -0.6, 1395.3], [-33, 1, 1387.3], [-33.3, 3.5, 1379],
      [-31.8, 5, 1373], [-30, 9, 1366], [-28.5, 15, 1358], [-26, 21.5, 1349.5], [-23.5, 26.2, 1341], [-18, 25.5, 1335], eso(1330, 212, 1)];
    this.addPart('vagThorL', 'nervo vago sinistro, tratto toracico', NERVE, [tube(thorL, 2, { caps: false })]);

    // --- nervi laringei ricorrenti ---------------------------------------------
    // tratto comune ai due lati: nell'angolo tra trachea ed esofago, fino alla laringe
    const groove = (s) => [[10.3 * s, 1.8, 1432], [10.3 * s, -0.4, 1444], [10.5 * s, -2.2, 1456], [11.3 * s, -1.8, 1462], [10.8 * s, -2.6, 1468], [9.5 * s, -3.5, 1473]];
    this.addPart('recRLoop', 'nervo laringeo ricorrente destro: ansa sotto la succlavia', REC_R, [
      tube([[21.9, -11.6, 1416], [21.8, -11, 1413.5], [21, -8.5, 1410.3], [19.5, -4.5, 1409.6], [17, -1, 1412.5], [14, 1.5, 1418], [11.5, 3.3, 1424]], 1.2, { caps: false }),
    ]);
    this.addPart('recRUp', 'nervo laringeo ricorrente destro', REC_R, [tube([[14, 1.5, 1418], [11.5, 3.3, 1424], ...groove(1)], 1.2)]);
    this.addPart('recLLoop', "nervo laringeo ricorrente sinistro: ansa sotto l'arco aortico", REC_L, [
      tube([[-32.8, 4.2, 1376], [-31.5, 5.2, 1372.5], [-29, 6.5, 1368.5], [-24, 8, 1366.5], [-18, 9.5, 1366.5], [-12.5, 12, 1368.5], [-9, 15, 1372.5], [-8.6, 15.2, 1381]], 1.2, { caps: false }),
    ]);
    this.addPart('recLUp', 'nervo laringeo ricorrente sinistro', REC_L, [
      tube([[-9, 15, 1372.5], [-8.6, 15.2, 1381], [-9.3, 13.3, 1390], [-10.2, 10.9, 1396], [-10.2, 8, 1408], [-10.2, 4.7, 1420], ...groove(-1)], 1.2),
    ]);

    // --- nervo laringeo superiore -----------------------------------------------
    const slTrunk = [[25.3, 0.4, 1548], [24, -1.5, 1541], [22.5, -4, 1532], [21, -7.5, 1522], [20, -10.5, 1513], [19.6, -12, 1507]];
    const slInt = [[20, -10.5, 1513], [19.6, -12, 1507], [18.8, -13.5, 1500], [16.5, -15, 1496], [12.5, -16.5, 1492.5], [9.5, -17, 1491]];
    const slExt = [[20, -10.5, 1513], [20.4, -10.5, 1506], [21.6, -9, 1497], [21.8, -8.5, 1488], [20.6, -9.5, 1480], [18, -11.5, 1473], [14.5, -13.5, 1468], [12.5, -14.5, 1466.5]];
    const galen = [[9.5, -17, 1491], [10.5, -13, 1487], [11.3, -8, 1482.5], [11, -4.5, 1477.5], [9.5, -3.5, 1473]];
    for (const [s, k] of [[1, 'R'], [-1, 'L']]) {
      const f = s > 0 ? (x) => x : flip;
      const side = s > 0 ? 'destro' : 'sinistro';
      this.addPart(`sln${k}`, `nervo laringeo superiore ${side}`, SLN, [tube(f(slTrunk), 1.1, { caps: false })]);
      this.addPart(`slnInt${k}`, `ramo interno del nervo laringeo superiore ${side}`, 0x58c08a, [tube(f(slInt), [0.9, 0.7])]);
      this.addPart(`slnExt${k}`, `ramo esterno del nervo laringeo superiore ${side}`, 0x1f7a4c, [tube(f(slExt), [0.9, 0.7])]);
      this.addPart(`galen${k}`, `ansa anastomotica di Galeno ${side === 'destro' ? 'destra' : 'sinistra'}`, 0xb9b28f, [tube(f(galen), 0.5)]);
    }

    // --- rami della base cranica (dal ganglio superiore) --------------------------
    const aur = [[27.2, 8.6, 1567], [31, 9.5, 1568.5], [36, 9.5, 1571.5], [41, 8, 1574.5], [45.5, 6.5, 1576.5]];
    const men = [[26.6, 9.6, 1568.5], [26, 13.5, 1571], [24, 19, 1572], [21, 25, 1570.5], [18, 31, 1567.5]];
    this.addPart('auricular', 'ramo auricolare', 0xe8843a, [tube(aur, 0.6), tube(flip(aur), 0.6)]);
    this.addPart('meningeal', 'ramo meningeo', 0xd9655a, [tube(men, 0.6), tube(flip(men), 0.6)]);

    // --- radice del polmone: rami bronchiali ---------------------------------------
    const twigs = (from, ends, r) => ends.map((e) => tube([from, [(from[0] + e[0]) / 2, (from[1] + e[1]) / 2 + 1.5, (from[2] + e[2]) / 2 + 1], e], [r, r * 0.6]));
    this.addPart('plexPulmR', 'plesso polmonare destro (rami bronchiali)', 0xf0d264, [
      ...twigs([14.5, 23.5, 1358], [[24, 25.5, 1349], [30, 25, 1340]], 0.9), ...twigs([11.5, 27.2, 1349.5], [[22, 28.5, 1338], [18, 29, 1331]], 0.9),
    ]);
    this.addPart('plexPulmL', 'plesso polmonare sinistro (rami bronchiali)', 0xf0d264, [
      ...twigs([-26, 21.5, 1349.5], [[-35, 26, 1338.5], [-42, 27.5, 1330]], 0.9), ...twigs([-23.5, 26.2, 1341], [[-31, 28.5, 1329], [-37, 29.5, 1322]], 0.9),
    ]);

    // --- plesso esofageo e tronchi vagali (sulla superficie dell'esofago reale) ----
    const strand = (list, r = 0.9) => tube(list.map(([h, deg]) => eso(h, deg)), r, { caps: false });
    this.addPart('plexEsoPost', 'plesso esofageo posteriore (dal vago destro)', 0xf0b23c, [
      strand([[1336, 62], [1322, 80], [1307, 95], [1292, 85], [1277, 92], [1262, 90]], 1.2),
      strand([[1336, 62], [1324, 35], [1310, 20], [1296, 38], [1281, 60], [1262, 90]]),
      strand([[1322, 80], [1312, 125], [1298, 150], [1284, 128], [1272, 105], [1262, 90]]),
      strand([[1307, 95], [1300, 60], [1296, 38]], 0.7),
    ]);
    this.addPart('plexEsoAnt', 'plesso esofageo anteriore (dal vago sinistro)', 0xd98f2b, [
      strand([[1330, 212], [1312, 250], [1294, 272], [1278, 265], [1262, 270]], 1.2),
      strand([[1330, 212], [1314, 190], [1298, 205], [1284, 235], [1272, 255], [1262, 270]]),
      strand([[1312, 250], [1300, 300], [1288, 325], [1276, 300], [1262, 270]]),
      strand([[1294, 272], [1290, 300], [1288, 325]], 0.7),
    ]);
    this.addPart('truncPost', 'tronco vagale posteriore', 0xf0b23c, [strand([[1262, 90], [1247, 90], [1232, 92], [1217, 95], [1205, 100]], 1.7)]);
    this.addPart('truncAnt', 'tronco vagale anteriore', 0xd98f2b, [strand([[1262, 270], [1247, 270], [1232, 270], [1217, 268], [1205, 265]], 1.7)]);

    // --- rami gastrici, appoggiati sulla superficie dello stomaco reale -------------
    const st = this.parts.get('stomach').meshes[0];
    const sp = st.geometry.attributes.position;
    // punto della parete anteriore (front) o posteriore dello stomaco sopra (a, h)
    const onStomach = (a, h, front) => {
      const x = a * S - st.position.x, y = (h - OZ) * S - st.position.y;
      let best = null;
      for (let R = 6 * S; best == null && R < 40 * S; R *= 1.6)
        for (let i = 0; i < sp.count; i++) {
          const dx = sp.getX(i) - x, dy = sp.getY(i) - y;
          if (dx * dx + dy * dy > R * R) continue;
          const z = sp.getZ(i);
          if (best == null || (front ? z > best : z < best)) best = z;
        }
      return V(a * S, (h - OZ) * S, (best ?? 0) + st.position.z + (front ? 0.4 : -0.4) * S);
    };
    const gastric = (front, start, lines) => lines.map((l) => tube([mm(...start), ...l.map(([a, h]) => onStomach(a, h, front))].slice(l.skip ? 1 : 0), [1.1, 0.5], { seg: 40 }));
    const noStart = (l) => Object.assign(l, { skip: true });
    this.addPart('gastAnt', 'plesso gastrico anteriore', 0xd98f2b, gastric(true, eso(1205, 265), [
      [[-12, 1196], [-15, 1186], [-21, 1175], [-24, 1163], [-20, 1152], [-8, 1145], [6, 1141]],
      noStart([[-12, 1196], [-26, 1200], [-42, 1206], [-56, 1208]]),
      noStart([[-15, 1186], [-30, 1184], [-46, 1179], [-60, 1172]]),
      noStart([[-21, 1175], [-36, 1168], [-50, 1158], [-60, 1146]]),
      noStart([[-24, 1163], [-34, 1150], [-40, 1136]]),
    ]));
    this.addPart('gastPost', 'plesso gastrico posteriore', 0xf0b23c, gastric(false, eso(1205, 100), [
      [[-14, 1197], [-26, 1190], [-42, 1182], [-60, 1174], [-78, 1166], [-90, 1156]],
      noStart([[-14, 1197], [-28, 1204], [-46, 1210], [-62, 1210]]),
      noStart([[-26, 1190], [-32, 1176], [-36, 1162], [-36, 1148]]),
      noStart([[-42, 1182], [-52, 1168], [-58, 1152], [-60, 1138]]),
      noStart([[-60, 1174], [-72, 1158], [-78, 1142]]),
    ]));

    // --- rami cardiaci (schematici) e plesso cardiaco -------------------------------
    this.addPart('cardiac', 'rami cardiaci del vago', 0xf08a8a, [
      tube([[15.5, -2.5, 1395], [12.8, -6, 1386], [7, -4.6, 1378], [1, -2.5, 1372.5], [-1.5, -0.8, 1370.5]], 0.8),
      tube([[-18, 9.5, 1366.5], [-12, 5.5, 1366], [-6, 1.5, 1368], [-2.5, -0.5, 1370]], 0.8),
    ]);
    this.addPart('cardPlex', 'plesso cardiaco', 0xe05a6a, [ball([-2, -0.6, 1370], [3.2, 2.2, 2.4])]);
    this.addLink('toHeart', [[-2, -3, 1368], [4, -18, 1352], [14, -30, 1335], [20, -36, 1318]].map((p) => mm(...p)), { color: 0x2f6fe0, r: 0.6 * S });

    // --- punti di lesione -------------------------------------------------------------
    this.addPart('cutRecR', 'lesione del ricorrente destro dietro la tiroide', CUT, [ring([11.2, -1.9, 1461], [0.1, 0.05, 1], 3.4)]);
  }
}
