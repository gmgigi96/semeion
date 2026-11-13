// Modello delle vie vestibolo-cocleari (nervo VIII, nuclei e vie centrali).
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/vie-vestibolo-cocleari.glb,
// manifesto in meshes/vie-vestibolo-cocleari.json), tutte del lato destro salvo
// dove indicato:
//   - nervo vestibolo-cocleare nell'angolo ponto-cerebellare (viiiCist: il tratto
//     che Z-Anatomy disegna dentro il tronco è scartato), nervo cocleare (cnTrunk
//     e, vicino alla chiocciola, cnEnd),
//     nervo vestibolare diviso per posizione (`split`) in tronco (vnTrunk, vnStem), punto di
//     confluenza (vnHilum) e i tre rami che la sorgente disegna verso il labirinto:
//     alto (vnAmp), medio (vnUtr), basso (vnSac);
//   - nervo faciale nel tratto cisternale e meatale (fn);
//   - chiocciola; «Vestibule» di Z-Anatomy diviso in vestibolo (con la crus
//     commune) e nei tre canali semicircolari superiore, laterale e posteriore;
//   - rocca del temporale destro (ritagliata dal temporale);
//   - ponte e bulbo (divisi in metà destra e sinistra e in una parte lontana dai
//     nuclei, per i primi piani), mesencefalo, sostanza bianca del midollo
//     cervicale alto; cervelletto (lobuli degli emisferi e del verme), flocculi,
//     nodulo;
//   - nuclei dell'abducente, del trocleare e dell'oculomotore (ellissoidi
//     schematici di Z-Anatomy, lasciati dove sono: l'oculomotore e il trocleare
//     risultano circa 4 mm ventrali all'acquedotto);
//   - collicoli inferiori (l'oggetto comprende il braccio), corpi genicolati
//     mediali, talami, giri temporali trasversi (di Heschl) e il tratto vicino
//     della parte laterale dei giri temporali superiori, dei due lati;
//   - fascio vestibolo-spinale laterale nel midollo (tubo schematico di
//     Z-Anatomy nel cordone anteriore, ingrossato).
// I nervi sono ingrossati lungo le normali (`inflate`): il decorso non cambia.
//
// SCARTATI perché mal posti nella sorgente (controllati sulla geometria):
//   - «Vestibular nuclei»: un solo corpo a 2-9 mm dal piano mediano tra z 1584 e
//     1597, cioè nel ponte medio-alto e lontano dal recesso laterale;
//   - «Anterior cochlear nucleus» (98 vertici, 7 mm dal piano mediano, in pieno
//     tegmento) e «Posterior cochlear nucleus» (3 mm dentro la superficie laterale);
//   - «Medial vestibulospinal tract» (al centro del midollo).
//
// RICOSTRUITO A MANO nella terna delle mesh reali (punti in mm Z-Anatomy):
//   - ganglio vestibolare dello Scarpa: rigonfiamento sul nervo vestibolare
//     reale, subito prima della divisione in rami, nel fondo del meato;
//   - ganglio spirale del Corti: elica attorno all'asse della chiocciola reale
//     (asse ricavato dalla mesh: direzione di minima varianza, apice
//     antero-laterale);
//   - nervo ampollare posteriore (dal ganglio all'estremo inferiore del canale
//     posteriore reale, dove sta l'ampolla) e prolungamento dei rami alti fino
//     alle ampolle dei canali superiore e laterale (che nella mesh sono
//     affiancate, antero-laterali, come nel vero);
//   - radici vestibolare e cocleare dentro il tronco;
//   - nuclei vestibolari superiore, laterale, mediale, inferiore e nuclei
//     cocleari dorsale e ventrale, dei due lati;
//   - nucleo olivare superiore, nucleo del corpo trapezoide, nucleo del lemnisco
//     laterale, lemnisco laterale, fascicolo longitudinale mediale, dei due lati;
//   - vie disegnate come frecce: fasci vestibolo-spinale, vestibolo-cerebellari,
//     fibre nel fascicolo longitudinale mediale, via vestibolo-talamica, strie
//     acustiche dorsale e ventrale, braccio del collicolo inferiore, radiazione
//     acustica, fascio olivo-cocleare;
//   - anelli rossi dei punti di blocco (pagina dei potenziali evocati).
//
// FONTI effettivamente lette (NCBI/StatPearls non consultati; le pagine Kenhub
// provate hanno risposto 404):
//   - Wikipedia (en), https://en.wikipedia.org/wiki/… : «Vestibular nuclei»,
//     «Lateral vestibular nucleus», «Medial vestibular nucleus», «Superior
//     vestibular nucleus», «Vestibular nerve», «Vestibular ganglion», «Spiral
//     ganglion», «Cochlear nucleus», «Dorsal cochlear nucleus», «Ventral cochlear
//     nucleus», «Vestibulocochlear nerve», «Internal auditory meatus»,
//     «Vestibulospinal tract», «Medial longitudinal fasciculus», «Superior
//     olivary complex», «Trapezoid body», «Lateral lemniscus», «Olivocochlear system».
//   - Neuroscience Online (UTHealth Houston), «Vestibular System: Pathways and
//     Reflexes» https://nba.uth.tmc.edu/neuroscience/m/s2/chapter10.html e
//     «Auditory System: Pathways and Reflexes» …/s2/chapter13.html
//   - TeachMeAnatomy, «The Vestibulocochlear Nerve (CN VIII)»
//     https://teachmeanatomy.info/head/cranial-nerves/vestibulocochlear/
// VERIFICATO su queste fonti (rapporti, non misure):
//   - il nervo emerge alla giunzione bulbo-pontina nell'angolo ponto-cerebellare;
//     ganglio dello Scarpa nel meato acustico interno, dove confluiscono le
//     divisioni superiore (utricolo, ampolle superiore e laterale) e inferiore
//     (sacculo), più il ramo per l'ampolla posteriore dal forame singolare;
//     nel fondo: faciale antero-superiore, cocleare antero-inferiore,
//     vestibolari posteriori; ganglio spirale nel modiolo;
//   - quattro nuclei vestibolari sotto la parte laterale del pavimento del IV
//     ventricolo, tra bulbo e ponte; le fibre vestibolari entrano medialmente
//     alle cocleari e passano tra peduncolo cerebellare inferiore e tratto
//     spinale del trigemino; nucleo laterale dalla giunzione bulbo-pontina al
//     livello del nucleo dell'abducente, più lontano dal pavimento; mediale
//     dall'estremo rostrale dell'oliva al ponte caudale; superiore dorso-laterale;
//   - nuclei cocleari sulla faccia dorso-laterale del tronco alla giunzione
//     bulbo-pontina: ventrale ventro-laterale al peduncolo cerebellare inferiore,
//     alla radice del nervo; dorsale (tubercolo acustico) avvolto sul peduncolo;
//   - fascio vestibolo-spinale laterale ipsilaterale dal nucleo laterale; fibre
//     vestibolari nel fascicolo longitudinale mediale per i nuclei VI, IV e III,
//     dello stesso lato e crociate; fibre al cervelletto con il peduncolo inferiore;
//   - corpo trapezoide (stria ventrale) nel tegmento pontino, con il complesso
//     olivare superiore dorsale ad esso; stria dorsale al lemnisco laterale
//     controlaterale; lemnisco laterale dal complesso olivare al collicolo
//     inferiore, con i suoi nuclei; fascio olivo-cocleare dal complesso olivare
//     alla chiocciola con il nervo vestibolare e l'anastomosi vestibolo-cocleare.
// STIMATO (nessuna misura nelle fonti lette): coordinate, forma e dimensioni di
// tutti i nuclei e dei fasci ricostruiti. I nuclei sono posti rispetto alle
// mesh reali: pavimento del IV ventricolo e recesso laterale (sezioni della
// mesh del ventricolo), superficie laterale del tronco dove entra il nervo
// reale, nucleo dell'abducente; i punti sono stati controllati con un test di
// appartenenza alle mesh di ponte, bulbo e mesencefalo. Stimati anche il
// decorso delle frecce e l'attribuzione dei tre rami del nervo vestibolare di
// Z-Anatomy (alto: ampollari; medio: utricolare; basso: sacculare), fatta in
// base alla quota a cui raggiungono il vestibolo.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0048; // unità per mm (come nel manifesto)
const O = [0, 15, 1492]; // origine del manifesto, in mm
// punto in mm: [distanza dal piano mediano verso DESTRA, y (indietro), z (alto)]
const mm = ([a, b, h]) => new THREE.Vector3(a * S, (h - O[2]) * S, -(b - O[1]) * S);
// lo stesso punto come `at` di un primo piano del motore (vedi AnatomyModel.zoomTo)
export const at = (c) => mm(c).toArray();
const scaled = (r) => (Array.isArray(r) ? r.map((v) => v * S) : r * S);
const tube = (pts, r, opts) => taperTube(pts.map(mm), scaled(r), { radial: 12, ...opts });
// ellissoide: semiassi in mm (laterale, antero-posteriore, verticale)
const blob = (c, [ra, rb, rh], rot = null) => {
  const g = ellipsoid([0, 0, 0], [ra * S, rh * S, rb * S], rot, 20);
  const p = mm(c);
  return g.translate(p.x, p.y, p.z);
};
// anello attorno a una struttura: centro e normale in mm, raggio in mm
const ring = (c, n, R) => {
  const g = new THREE.TorusGeometry(R * S, R * S * 0.2, 10, 32);
  const d = new THREE.Vector3(n[0], n[2], -n[1]).normalize();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d));
  const p = mm(c);
  return g.translate(p.x, p.y, p.z);
};
const flip = (pts) => pts.map(([a, b, h]) => [-a, b, h]);

const STEM = 0xe3cdb6, BONE = 0xe9dfc8;
const COCH = 0x1f9d9d, VEST = 0xe07b39, GREEN = 0x1f9d57, BLUE = 0x2f6fe0, CUT = 0xd42a2a;

const REAL = {
  viiiCist: ['nervo vestibolo-cocleare (VIII) nell’angolo ponto-cerebellare', 0xd9c56a],
  cnTrunk: ['componente cocleare (nervo cocleare)', COCH],
  cnEnd: ['componente cocleare (nervo cocleare)', COCH],
  vnTrunk: ['componente vestibolare (nervo vestibolare)', VEST],
  vnStem: ['componente vestibolare (nervo vestibolare)', VEST],
  vnHilum: ['nervo vestibolare, confluenza delle due divisioni', VEST],
  vnAmp: ['nervo ampollare', 0xd9485b],
  vnUtr: ['nervo dell’utricolo', 0xf0a03c],
  vnSac: ['nervo sacculare', 0x8e5bb5],
  fn: ['nervo faciale (VII)', 0xb9b28f],
  cochlea: ['chiocciola', 0x6fb7c9],
  vestibule: ['vestibolo (utricolo e sacculo)', 0x9fb0c8],
  canalSup: ['canale semicircolare superiore', 0xe0707e],
  canalLat: ['canale semicircolare laterale', 0xe8a25a],
  canalPost: ['canale semicircolare posteriore', 0xa77fd0],
  petrous: ['piramide (rocca) del temporale', BONE, { ghost: true, opacity: 0.2 }],
  // ponte e bulbo sono divisi in metà destra e sinistra e in una parte lontana
  // dai nuclei (ponte alto, bulbo basso), per i primi piani
  ponsR: ['ponte', STEM, { ghost: true, opacity: 0.3 }],
  ponsL: ['ponte', STEM, { ghost: true, opacity: 0.3 }],
  ponsUp: ['ponte', STEM, { ghost: true, opacity: 0.3 }],
  medR: ['bulbo', STEM, { ghost: true, opacity: 0.3 }],
  medL: ['bulbo', STEM, { ghost: true, opacity: 0.3 }],
  medullaLow: ['bulbo', STEM, { ghost: true, opacity: 0.3 }],
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.3 }],
  cord: ['midollo spinale cervicale', STEM, { ghost: true, opacity: 0.3 }],
  vst: ['fascio vestibolo-spinale', 0xe0862f],
  cerebellum: ['cervelletto', 0xd8bfa6, { ghost: true, opacity: 0.16 }],
  flocculus: ['flocculo', 0xc98a70],
  flocculusL: ['flocculo sinistro', 0xc98a70],
  nodule: ['nodulo del verme', 0xb9705c],
  nucVI: ['nucleo dell’abducente (VI)', 0x6a8fd8],
  nucIV: ['nucleo del trocleare (IV)', 0x4f8be0],
  nucIII: ['nucleo dell’oculomotore (III)', 0x2456a8],
  ic: ['collicolo inferiore', 0x4f8be0],
  mgb: ['corpo genicolato mediale', 0x7d6fd6],
  thalamus: ['talamo', 0xd8c3ae, { opacity: 0.55 }],
  heschl: ['corteccia uditiva primaria (giro di Heschl, aree 41 e 42)', 0xd9566a],
  stg: ['circonvoluzione temporale superiore', 0xe6c9b0, { opacity: 0.5 }],
};

// quanto ingrossare i tubi dei nervi reali (mm)
const INFLATE = { viiiCist: 0.5, vnTrunk: 0.25, vnStem: 0.25, vnAmp: 0.14, vnUtr: 0.14, vnSac: 0.1, vst: 0.35 };

export class VieVestiboloCocleari extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: 0, rod: [0, 0.015, 0.105, -0.055] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('vie-vestibolo-cocleari.glb', REAL);
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d * S);
    this.#ear();
    this.#nuclei();
    this.#tracts();
    this.#blocks();
  }

  // ingrossa un tubo spostando i vertici lungo le normali
  #inflate(id, d) {
    for (const m of this.parts.get(id).meshes) {
      const pos = m.geometry.attributes.position;
      const nor = m.geometry.attributes.normal;
      for (let i = 0; i < pos.count; i++)
        pos.setXYZ(i, pos.getX(i) + nor.getX(i) * d, pos.getY(i) + nor.getY(i) * d, pos.getZ(i) + nor.getZ(i) * d);
      pos.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }

  // geometrie di una parte reale, riportate nelle coordinate del modello
  #geo(id) {
    return this.parts.get(id).meshes.map((m) => m.geometry.clone().translate(m.position.x, m.position.y, m.position.z));
  }

  // una parte con i due lati: le geometrie sono disegnate a destra (x > 0)
  #pair(id, name, color, geos, opts) {
    this.addPart(id, name, color, [...geos, ...geos.map((g) => mirror(g))], opts);
  }

  #ear() {
    // ganglio dello Scarpa: sul nervo vestibolare reale, nel fondo del meato
    this.addPart('scarpa', 'ganglio vestibolare dello Scarpa', 0xc9541e, [
      tube([[31.5, 2.9, 1580.4], [32.8, 3.0, 1580.35], [34.2, 3.3, 1580.4], [35.7, 3.5, 1580.6]], [0.8, 1.5, 1.6, 1.0], { radial: 18 }),
    ]);
    // ganglio spirale del Corti: elica attorno all'asse (modiolo) della chiocciola reale
    const base = new THREE.Vector3(37.9, -1.0, 1580.6), apex = new THREE.Vector3(41.0, -2.8, 1580.5);
    const u = new THREE.Vector3(0.42, 0.78, -0.46), v = new THREE.Vector3(0.26, 0.39, 0.89);
    const helix = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, a = t * Math.PI * 2 * 2.25, r = 1.9 - 1.3 * t;
      const p = base.clone().lerp(apex, 0.12 + 0.7 * t).addScaledVector(u, Math.cos(a) * r).addScaledVector(v, Math.sin(a) * r);
      helix.push([p.x, p.y, p.z]);
    }
    this.addPart('corti', 'ganglio spirale del Corti', 0x0f6f7a, [tube(helix, [0.42, 0.3], { seg: 120, radial: 8 })]);
    // rami alti prolungati fino alle ampolle dei canali superiore e laterale
    this.addPart('nAmp', 'nervo ampollare (canali superiore e laterale)', 0xd9485b, [
      ...this.#geo('vnAmp'),
      tube([[39.9, 3.9, 1583.4], [41.0, 4.5, 1584.3], [41.7, 5.1, 1585.0]], 0.34, { seg: 12 }),
      tube([[40.1, 5.5, 1583.4], [40.9, 5.5, 1583.5], [41.5, 5.4, 1583.6]], 0.3, { seg: 8 }),
    ]);
    // nervo ampollare posteriore: dal ganglio, dietro e sotto il vestibolo,
    // all'estremo inferiore del canale posteriore (forame singolare)
    this.addPart('nPost', 'nervo del canale semicircolare posteriore', 0x6f4fb5, [
      tube([[35.0, 3.5, 1579.8], [34.5, 5.4, 1578.5], [35.3, 7.6, 1577.4], [37.3, 9.1, 1577.0], [39.2, 9.2, 1577.6]], 0.36, { seg: 30 }),
    ]);
    // radici dentro il tronco: la vestibolare entra medialmente (e più in alto)
    // della cocleare e raggiunge il nucleo laterale; la cocleare si biforca
    this.addPart('rootVest', 'radice vestibolare nel tronco', VEST, [
      tube([[15.6, 13.5, 1579.4], [12.6, 15, 1580.6], [10.4, 17.4, 1580.4], [8.9, 18.9, 1580]], 0.6, { seg: 24, caps: false }),
    ]);
    this.addPart('rootCoch', 'radice cocleare nel tronco', COCH, [
      tube([[15.6, 14.2, 1578.4], [14.4, 15.2, 1578.5], [13.4, 16.2, 1578.6]], 0.6, { seg: 10, caps: false }),
      tube([[13.6, 17.4, 1578.4], [13.9, 19.2, 1578.2], [13.7, 20.8, 1577.9], [13.0, 22.0, 1577.7]], 0.42, { seg: 16, caps: false }),
    ]);
  }

  #nuclei() {
    // --- nuclei vestibolari: sotto la parte laterale del pavimento del IV ventricolo
    this.#pair('vnSup', 'nucleo vestibolare superiore', 0xd9485b, [blob([7.6, 20.4, 1584.3], [1.4, 1.4, 2.2])]);
    this.#pair('vnLat', 'nucleo vestibolare laterale', 0xe0862f, [blob([8.7, 19.3, 1579.7], [1.5, 1.5, 1.9])]);
    this.#pair('vnMed', 'nucleo vestibolare mediale', 0xd9b23a, [
      tube([[3.6, 24.6, 1570.5], [4.6, 22.9, 1574], [4.9, 20.9, 1577], [4.7, 20.0, 1580], [4.3, 18.8, 1582.3]], [1.0, 1.4, 1.5, 1.3, 0.9], { radial: 16 }),
    ]);
    this.#pair('vnInf', 'nucleo vestibolare inferiore', 0x8e5bb5, [
      tube([[7.4, 24.6, 1569], [8.0, 23.6, 1572], [8.4, 22.2, 1575], [8.3, 20.9, 1577.3]], [0.9, 1.2, 1.3, 1.1], { radial: 16 }),
    ]);
    // --- nuclei cocleari: sulla faccia dorso-laterale, alla giunzione bulbo-pontina
    this.#pair('dcn', 'nucleo cocleare dorsale (tubercolo acustico)', 0x12b3a8, [blob([12.6, 22.3, 1577.7], [2.1, 0.9, 1.6], [0, 0.35, 0])]);
    this.#pair('vcn', 'nucleo cocleare ventrale', 0x2f6fd0, [blob([13.3, 16.5, 1578.7], [1.3, 1.9, 1.5])]);
    // --- stazioni interposte della via cocleare, nel tegmento del ponte
    this.#pair('ntb', 'nucleo del corpo trapezoide', 0x9ccc65, [blob([3.4, 11.8, 1580.8], [0.9, 0.8, 1.1])]);
    this.#pair('son', 'nucleo olivare superiore', 0x3fae6b, [blob([6.6, 12.6, 1582.8], [1.2, 1.2, 2.0])]);
    this.#pair('nll', 'nucleo del lemnisco laterale', 0x57b377, [blob([10.9, 13.9, 1594.5], [0.9, 0.9, 1.8])]);
    this.#pair('ll', 'lemnisco laterale', 0xb9d98a, [
      tube([[7.2, 12.6, 1584.6], [9.6, 12.8, 1588.5], [11, 13.6, 1593], [10.9, 14.6, 1597.5], [9.0, 15.2, 1601.5], [7.4, 15.6, 1604.6]], 0.65, { seg: 50 }),
    ]);
    // fascicolo longitudinale mediale: paramediano, subito sotto il pavimento
    this.#pair('flm', 'fascicolo longitudinale mediale', 0xb9c4e8, [
      tube([[1.3, 19.4, 1574], [1.3, 18.0, 1580], [1.3, 16.6, 1584], [1.3, 14.8, 1589], [1.3, 13.6, 1594], [1.4, 12.6, 1598], [1.6, 11.6, 1601.5], [1.9, 10.6, 1606]],
        0.5, { seg: 50 }),
    ]);
  }

  #tracts() {
    const link = (id, pts, color = GREEN, r = 0.38) => this.addLink(id, pts.map(mm), { color, r: r * S });
    // --- proiezioni dei nuclei vestibolari (lato destro)
    // al midollo: dal nucleo laterale, omolaterale, fino al fascio reale nel cordone anteriore
    link('vsp', [[8.5, 19.2, 1578], [9.5, 19.5, 1571], [7.5, 20.5, 1563], [5, 21.5, 1555], [3.2, 23.5, 1548], [2.5, 24.8, 1541]]);
    // al cervelletto: fibre primarie dalla radice, secondarie dai nuclei (peduncolo inferiore)
    link('vcbPrim', [[12.5, 15.3, 1580.8], [12.3, 19, 1582.2], [10.5, 24.5, 1583.2], [6.5, 29.5, 1583.6], [3, 32, 1583.4]], BLUE);
    link('vcbNod', [[8.4, 22.6, 1575.6], [8.8, 25.6, 1577.6], [6.5, 29.6, 1579.6], [3, 32.4, 1580]]);
    link('vcbFloc', [[9.6, 20.2, 1579.4], [13, 22.2, 1580.2], [17, 21.2, 1581], [20.4, 18.8, 1581.2]]);
    // ai nuclei oculomotori, nel fascicolo longitudinale mediale
    link('mlfVI', [[4.3, 19.2, 1581.4], [3.0, 17.6, 1582.2], [1.9, 16.4, 1582.3]], GREEN, 0.3);
    const up = [[1.4, 15.4, 1588], [1.3, 13.8, 1594], [1.4, 12.7, 1598]];
    link('mlfIV', [[7.0, 19.8, 1585], [3.6, 17.2, 1586.4], ...up, [1.5, 11.2, 1599.6]], GREEN, 0.3);
    link('mlfIII', [[8.0, 18.4, 1580.6], [4.4, 16.8, 1584], ...up.map(([a, b, h]) => [a - 0.5, b + 0.5, h]), [1.2, 11.6, 1601.5], [1.8, 10.2, 1604.6]], GREEN, 0.3);
    link('mlfX', [[4.2, 18.6, 1582.6], [1.5, 17.2, 1584.5], [-1.3, 16.2, 1586], ...flip(up), [-1.6, 11.6, 1601.5], [-1.9, 10.2, 1605.4]], GREEN, 0.3);
    // alla corteccia: fibre crociate che salgono con il lemnisco mediale al talamo
    link('vThal', [[7, 19, 1582.4], [2, 14.5, 1585], [-3.5, 10, 1590], [-6.5, 7.5, 1598], [-8.5, 7.5, 1606], [-11, 9.5, 1613], [-13, 11, 1620]]);

    // --- via cocleare (dall'orecchio destro)
    link('cnIn', [[37.6, 0.2, 1580.0], [30, 1.3, 1580.3], [23, 2.6, 1580.9], [19.8, 7.6, 1581.6], [17.6, 13.4, 1579.4], [14.2, 15.6, 1578.7]], COCH);
    // stria acustica dorsale: sotto il pavimento del IV ventricolo, tutta crociata
    link('striaD', [[12.0, 21.8, 1578], [8, 21, 1579.6], [3, 19.8, 1580.8], [-2.5, 17.4, 1582], [-6, 14.5, 1583.6], [-7.3, 12.9, 1585]]);
    // stria acustica ventrale (corpo trapezoide): crociata e omolaterale
    link('striaV', [[12.6, 15.9, 1579.2], [9, 13.2, 1580.4], [4.5, 12, 1580.8], [0, 11.6, 1581], [-3.4, 11.8, 1581], [-6.2, 12.4, 1582.4]]);
    link('striaVi', [[12.6, 15.7, 1579.8], [9.8, 13.8, 1581.6], [7.4, 12.9, 1582.5]]);
    const lemn = [[7.2, 12.6, 1584.6], [9.6, 12.8, 1588.5], [11, 13.6, 1593], [10.9, 14.6, 1597.5], [9.0, 15.2, 1601.5], [7.0, 15.7, 1606.5]];
    const brach = [[8.5, 15, 1609], [11.5, 13.8, 1611.5], [14, 13.3, 1612.5]];
    const rad = [[15.5, 13, 1613.5], [24, 11, 1619], [35, 10.5, 1626], [44, 12, 1631]];
    link('llL', flip(lemn));
    link('llR', lemn);
    link('bicL', flip(brach), GREEN, 0.3);
    link('bicR', brach, GREEN, 0.3);
    link('radL', flip(rad));
    link('radR', rad);
    // fascio olivo-cocleare (di Rasmussen): efferente, con la componente vestibolare,
    // poi alla chiocciola con l'anastomosi di Oort
    link('rasm', [[6.8, 13, 1582.4], [10, 16.2, 1581.2], [13.5, 14.6, 1580.6], [16.4, 13.6, 1580.2], [19.6, 11.4, 1581.6], [21.4, 5.6, 1582.6],
      [27, 3.4, 1581.8], [32.6, 3.5, 1582.2], [35.4, 2.4, 1581.4], [37.4, 0.6, 1580.8]], BLUE, 0.3);
  }

  // anelli rossi nei punti in cui può interrompersi l'impulso uditivo
  #blocks() {
    this.addPart('cut1', 'blocco alla coclea o al nervo cocleare', CUT, [ring([30, 1.3, 1580.3], [1, 0, 0], 3)]);
    this.addPart('cut3', 'lesione dei nuclei cocleari', CUT, [ring([13.2, 19.4, 1578.2], [1, 0.25, 0], 4.6)]);
    this.addPart('cut45', 'lesione dei nuclei interposti o del collicolo inferiore', CUT, [ring([-9.4, 13.4, 1595], [0.2, 0.25, 1], 5.5)]);
    this.addPart('cut6', 'blocco al corpo genicolato mediale', CUT, [ring([-14.2, 13.4, 1612], [0, 0.3, 1], 5)]);
    this.addPart('cut7', 'lesione della corteccia uditiva primaria', CUT, [ring([-46, 12, 1632.5], [0.25, 0, 1], 15)]);
  }
}
