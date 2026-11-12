// Modello del nervo glossofaringeo (IX).
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/nervo-glossofaringeo.glb,
// manifesto in meshes/nervo-glossofaringeo.json):
//   - nervo glossofaringeo destro, diviso per posizione (`split`) in: fibre
//     radicolari dentro il bulbo, che nella sorgente raggiungono i singoli nuclei
//     (ixBulb), tratto cisternale dal solco retro-olivare al foro giugulare
//     (ixCist), tratto nel foro giugulare e subito sotto, tra carotide interna e
//     vena giugulare (ixFor). Sotto z = 1556 mm il tubo della sorgente è SCARTATO:
//     scende dietro e lateralmente ai due vasi insieme all'accessorio fino alla
//     base del collo, poi piega in avanti all'altezza dell'osso ioide e finisce
//     sotto la radice della lingua; non passa davanti alla carotide interna né
//     sullo stilofaringeo (vedi «ricostruiti a mano»);
//   - nucleo ambiguo, nucleo del tratto solitario (la parte rostrale è separata
//     come nucleo gustativo), nucleo salivatorio inferiore: ellissoidi schematici
//     della sorgente. Posizione controllata sulle sezioni del bulbo reale:
//     solitario 1-3 mm dal piano mediano e circa 2 mm sotto il pavimento del IV
//     ventricolo; ambiguo ventrale al solitario, nella formazione reticolare, ma a
//     soli 3-4,5 mm dal piano mediano (più mediale dell'atteso); salivatorio
//     inferiore subito sotto il salivatorio superiore, alla giunzione bulbo-pontina;
//   - bulbo, ponte, mesencefalo; ossa del cranio, rocca del temporale destro
//     (ritagliata dal temporale), osso ioide;
//   - carotide comune, carotide interna (il tratto iniziale dilatato, sotto
//     z = 1509 mm, è separato come seno carotideo), carotide esterna; vena
//     giugulare interna solo sopra z = 1543 mm (più in basso la mesh della
//     sorgente incrocia la carotide e le passa medialmente: tratto scartato);
//   - muscolo stilofaringeo, costrittori della faringe, rinofaringe, lingua
//     (divisa in terzo posteriore e due terzi anteriori), tonsille palatine,
//     epiglottide, parotide;
//   - nervo auricolo-temporale (nella sorgente l'oggetto si chiama, per errore,
//     «Meningeal branch of maxillary nerve»), tronco posteriore del mandibolare;
//   - chiocciola, martello, incudine, staffa, membrana del timpano; nervo faciale
//     nel canale e moncone del grande petroso (come nel capitolo del faciale).
// I nervi della sorgente sono tubi di 0,2-0,4 mm di raggio: sono ingrossati lungo
// le normali (`#inflate`), il decorso non è toccato.
// NON USATI, pur presenti: nervo vago e accessorio (nella sorgente il vago sta
// davanti e medialmente al glossofaringeo dal bulbo al foro giugulare, al
// contrario di quanto descritto: mostrarli darebbe un rapporto sbagliato); tuba
// uditiva (la sua estremità laterale cade medialmente alla chiocciola).
//
// RICOSTRUITI A MANO, in mm nella terna Z-Anatomy:
//   - ganglio superiore e ganglio inferiore, sul nervo reale nel foro giugulare;
//   - nucleo del tratto spinale del trigemino (stesse coordinate del capitolo
//     del trigemino, senza l'arretramento dell'encefalo usato là);
//   - tronco extracranico da z = 1556 mm: tra carotide interna e giugulare,
//     davanti e lateralmente alla carotide interna, al margine posteriore dello
//     stilofaringeo reale, poi in avanti sulla sua faccia laterale fino alla
//     radice della lingua reale, con concavità in alto; ramo per lo
//     stilofaringeo, rami faringei, ramo tonsillare, rami linguali;
//   - nervo del seno carotideo (di Hering): davanti alla carotide interna reale
//     fino al seno; glomo carotideo alla biforcazione;
//   - nervo timpanico: dal ganglio inferiore, tra canale carotico e fossa
//     giugulare, al promontorio (faccia laterale del giro basale della chiocciola
//     reale); plesso timpanico (rametti per finestra ovale e rotonda) e ramo tubarico;
//   - nervo piccolo petroso: dal plesso in alto e in avanti, lateralmente al
//     ganglio genicolato e al moncone reale del grande petroso, sul pavimento
//     della fossa cranica media, poi tra foro ovale e foro spinoso (posti dove il
//     mandibolare reale e l'arteria meningea media reale attraversano lo sfenoide)
//     fino al ganglio otico, medialmente al nervo mandibolare reale;
//   - anello che segna la parte nervosa del foro giugulare;
//   - frecce: fibre postgangliari dal ganglio otico alla parotide lungo
//     l'auricolo-temporale reale.
//
// FONTI LETTE (voci di Wikipedia in inglese, in parte tratte da Gray 1918, e una
// pagina didattica):
//   - «Glossopharyngeal nerve», https://en.wikipedia.org/wiki/Glossopharyngeal_nerve
//     VERIFICATO: emergenza tra oliva e peduncolo cerebellare inferiore; nel foro
//     giugulare passa tra giugulare interna e carotide interna; scende davanti
//     alla carotide interna, sotto il processo stiloideo, fino al margine
//     posteriore dello stilofaringeo; piega in avanti ad arco sullo stilofaringeo
//     e sul costrittore medio, passa sotto l'ioglosso, si distribuisce a tonsilla
//     palatina e base della lingua; nucleo ambiguo, salivatorio inferiore,
//     solitario e spinale del trigemino per le rispettive componenti.
//   - «Jugular foramen», https://en.wikipedia.org/wiki/Jugular_foramen
//     VERIFICATO: parte nervosa antero-mediale con il IX, parte vascolare
//     postero-laterale con X, XI e bulbo della giugulare.
//   - «Superior ganglion of glossopharyngeal nerve», «Inferior ganglion of
//     glossopharyngeal nerve» (https://en.wikipedia.org/wiki/…)
//     VERIFICATO: entrambi nel foro giugulare, l'inferiore più grande e più in
//     basso; il timpanico si stacca all'altezza del ganglio inferiore.
//   - «Tympanic nerve», «Tympanic plexus», «Promontory of tympanic cavity»
//     VERIFICATO: canalicolo timpanico nella cresta tra canale carotico e foro
//     giugulare; plesso sul promontorio, formato dal giro basale della
//     chiocciola; finestra ovale sopra e dietro, rotonda sotto e dietro.
//   - «Lesser petrosal nerve», «Otic ganglion»
//     VERIFICATO: dal plesso in avanti, iato proprio sulla faccia anteriore della
//     rocca, solco parallelo e antero-laterale a quello del grande petroso, verso
//     il foro ovale, uscita dal canalicolo innominato; ganglio otico (2-3 mm)
//     subito sotto il foro ovale, sulla faccia mediale del mandibolare, con
//     l'arteria meningea media dietro; fibre postgangliari con l'auricolo-temporale.
//   - «Carotid sinus nerve», https://en.wikipedia.org/wiki/Carotid_sinus_nerve
//     VERIFICATO: scende davanti alla carotide interna fino all'angolo della biforcazione.
//   - «Nucleus ambiguus», «Salivatory nuclei», «Solitary nucleus», «Stylopharyngeus muscle»
//     VERIFICATO: ambiguo dorsale all'oliva inferiore, nella parte laterale del
//     bulbo rostrale; salivatorio inferiore subito caudale al superiore; parte
//     rostrale del solitario gustativa; stilofaringeo dal lato mediale della base
//     del processo stiloideo, tra costrittore superiore e medio.
//   - «The Glossopharyngeal Nerve (CN IX)», https://teachmeanatomy.info/head/cranial-nerves/glossopharyngeal-nerve/
//     VERIFICATO: solco retro-olivare; rami per lo stilofaringeo e nervo del seno
//     carotideo all'altezza del muscolo; ingresso in faringe tra costrittore
//     superiore e medio; rami terminali linguale, tonsillare, faringeo.
// STIMATO (nessuna misura nelle fonti lette): tutte le coordinate e i calibri
// delle parti ricostruite, posti rispetto alle mesh reali; dimensioni dei gangli
// del IX e del glomo; il disegno del plesso timpanico. Nella terna della
// sorgente il foro ovale sta dietro la linea del grande petroso, quindi il
// piccolo petroso disegnato passa davanti alla punta del moncone reale del
// grande petroso invece di restargli parallelo fino in fondo.
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror } from '../geo.js';

// Da millimetri Z-Anatomy (lato destro: `a` = distanza dal piano mediano, `b`
// verso dietro, `h` verso l'alto) alle coordinate del modello; stessa terna del
// manifesto: origine (0, 0, 1470), 0.0034 unità per mm.
const S = 0.0034;
const H0 = 1470;
const mm = (a, b, h) => V(a * S, (h - H0) * S, -b * S);
const tube = (pts, r, opts) => taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, ...opts });
const ball = ([a, b, h], [ra, rb, rh]) => {
  const c = mm(a, b, h);
  return ellipsoid([c.x, c.y, c.z], [ra * S, rh * S, rb * S], null, 16);
};
const ring = (p, n, r) => {
  const g = new THREE.TorusGeometry(r * S, r * S * 0.16, 10, 32);
  const d = V(n[0], n[2], -n[1]).normalize();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d));
  const c = mm(...p);
  return g.translate(c.x, c.y, c.z);
};

const NERVE = 0xe6bd2e, BONE = 0xe9dfc8, STEM = 0xe3cdb6, MUSCLE = 0xb85a50, GLAND = 0xd9a05a;
const PARA = 0x2f6fe0, TASTE = 0x2f9a63, GANGLION = 0xe0662f, MOTOR = 0xc9485b, SOMA = 0x8e5bb5, VISC = 0x1f9d9d;
const ARTERY = 0xc8423c, VEIN = 0x4a6fb5;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  ixBulb: ['fibre radicolari del glossofaringeo nel bulbo', 0xcf9a1e],
  ixCist: ['nervo glossofaringeo, dal bulbo al foro giugulare', NERVE],
  ixFor: ['nervo glossofaringeo nel foro giugulare', NERVE],
  nucAmb: ['nucleo ambiguo', MOTOR],
  nucSal: ['nucleo salivatorio inferiore', PARA],
  nucSol: ['nucleo del tratto solitario', VISC],
  nucGust: ['nucleo gustativo (porzione rostrale del nucleo del tratto solitario)', TASTE],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.16 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.16 }],
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.16 }],
  skullR: ['cranio, metà destra', BONE, { ghost: true, opacity: 0.1 }],
  skullL: ['cranio, metà sinistra', BONE, { ghost: true, opacity: 0.1 }],
  petrous: ["rocca petrosa dell'osso temporale", BONE, { ghost: true, opacity: 0.2 }],
  hyoid: ['osso ioide', BONE],
  cca: ['arteria carotide comune', ARTERY],
  sinus: ['seno carotideo', 0xe8706a],
  ica: ['arteria carotide interna', ARTERY],
  icaTop: ['arteria carotide interna nel canale carotico', ARTERY],
  eca: ['arteria carotide esterna', 0xa8483f],
  ijv: ['vena giugulare interna (bulbo e tratto superiore)', VEIN],
  stylo: ['muscolo stilofaringeo', MUSCLE],
  constrSup: ['muscolo costrittore superiore della faringe', 0xc9837a],
  constrLow: ['muscoli costrittori medio e inferiore della faringe', 0xd4a59c],
  nasopharynx: ['rinofaringe', 0xe2a9a0],
  tongueAnt: ['due terzi anteriori della lingua', 0xd9b4ae],
  tonguePost: ['terzo posteriore della lingua', 0xd9727a],
  tonsil: ['tonsilla palatina', 0xc98fb5],
  epiglottis: ['epiglottide', 0xe6d9a8],
  parotid: ['ghiandola parotide', GLAND],
  parotidLow: ['ghiandola parotide', GLAND],
  atn: ['nervo auricolo-temporale (V3)', 0xb9b28f],
  v3: ['nervo mandibolare (V3)', 0xb9b28f],
  cochlea: ['chiocciola (il giro basale forma il promontorio)', 0x6fb7c9],
  ossicles: ['martello, incudine e staffa', 0xf1ead8],
  tympanic: ['membrana del timpano', 0xe8c9a8, { double: true, opacity: 0.8 }],
  vii: ['nervo faciale nel canale di Falloppio', 0xa9a394],
  gspn: ['nervo grande petroso superficiale', 0x7d8fb0],
};
// ingrossamento dei tubi reali, in mm
const INFLATE = { ixBulb: 0.15, ixCist: 0.55, ixFor: 0.55, atn: 0.3, v3: 0.5, gspn: 0.25 };

export class NervoGlossofaringeo extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: -0.02, rod: [0, 0.02, 0.24, -0.075] });
    this.rod = this.inner.children.at(-1);
    this.ready = this.#build();
  }

  // Primo piano: il punto `c` (mm) va sull'asse di rotazione, all'altezza `h`,
  // e il modello è ingrandito di `k`. `reset` lo riporta a posto.
  focus(c, k, h = 0.36) {
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

  async #build() {
    await this.loadMeshes('nervo-glossofaringeo.glb', REAL);
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d * S);
    const part = (id, name, color, geos, opts) => this.addPart(id, name, color, geos, opts);

    // --- nel tronco encefalico ---------------------------------------------
    const spV = tube([[10, 15.6, 1581.5], [10, 16.6, 1579], [10, 18.6, 1575.5], [9.6, 19.3, 1572.3], [9, 21, 1569.5],
      [8.2, 22.6, 1566.7], [7.2, 24.4, 1562.5], [6.6, 25.5, 1560]], [1.2, 1.3, 1.25, 1.1], { seg: 50 });
    part('nucSpV', 'nucleo della radice discendente (tratto spinale) del trigemino', SOMA, [spV, mirror(spV)]);

    // --- foro giugulare e gangli ---------------------------------------------
    part('forame', 'foro giugulare (foro lacero posteriore), parte nervosa', 0x6b6257, [ring([30.6, 11.8, 1566.9], [0.55, -0.6, -0.6], 3.4)]);
    part('gSup', 'ganglio superiore (giugulare)', SOMA, [ball([30, 12.5, 1567.6], [1.15, 1.15, 1.25])]);
    part('gInf', 'ganglio inferiore (petroso)', GANGLION, [ball([32.3, 8.9, 1562.6], [1.6, 1.7, 2.3])]);

    // --- tronco extracranico e rami --------------------------------------------
    part('ixNeck', 'nervo glossofaringeo nel collo', NERVE, [
      tube([[32.35, 7.6, 1559], [32.3, 6.75, 1556], [31.3, 3.4, 1551.5], [30.1, 0.2, 1547], [32.3, -2.6, 1542], [32.7, -6, 1537.5],
        [30.6, -10.5, 1533.5], [27.2, -15.5, 1530], [23, -20.5, 1527], [19, -24.5, 1525], [16, -27.5, 1524.5], [14, -29.5, 1525.5]],
        [0.78, 0.78, 0.72, 0.62], { seg: 90 }),
    ]);
    part('nHering', 'nervo del seno carotideo (di Hering)', VISC, [
      tube([[30.2, 0.1, 1546.6], [28.7, -4.6, 1540], [30.3, -5.2, 1530], [31.2, -4.7, 1522], [30.3, -3.8, 1512], [29, -2.6, 1502], [28.4, -1.7, 1494.5]],
        [0.5, 0.42], { seg: 60 }),
    ]);
    part('glomo', 'glomo carotideo', 0x7a2f8a, [ball([28.5, -2, 1491], [1.2, 1.2, 1.9])]);
    part('rStylo', 'ramo per il muscolo stilofaringeo', MOTOR, [
      tube([[30.5, -10.6, 1533.6], [28.4, -11.4, 1535.6], [26, -12.4, 1535.6]], 0.42, { seg: 12 }),
    ]);
    part('rFar', 'rami faringei', 0xe8843a, [
      tube([[32.4, -3.4, 1541], [28.6, -5.6, 1545.5], [22.5, -7, 1551.5], [16.5, -8, 1558]], [0.45, 0.35], { seg: 30 }),
      tube([[28.6, -5.6, 1545.5], [23.5, -7.6, 1544], [18.5, -9.5, 1543.5]], [0.4, 0.32], { seg: 20 }),
    ]);
    part('rTons', 'ramo tonsillare', 0xb86fb0, [
      tube([[19, -24.5, 1525], [22, -26.6, 1533], [25.4, -28.6, 1542], [27.3, -29.5, 1550.5]], [0.48, 0.38], { seg: 30 }),
    ]);
    part('rLing', 'rami linguali', TASTE, [
      tube([[14.4, -29.2, 1525.2], [12, -31.2, 1528.6], [9.2, -33.6, 1532.2]], [0.5, 0.36], { seg: 16 }),
      tube([[14.4, -29.2, 1525.2], [10.5, -28.6, 1527.4], [6.2, -27.2, 1528.6]], [0.5, 0.36], { seg: 16 }),
      tube([[14.4, -29.2, 1525.2], [10.5, -27.4, 1521.5], [6, -25.6, 1516.5], [4.2, -25.6, 1511.5]], [0.5, 0.34], { seg: 20 }),
    ]);

    // --- nervo timpanico, plesso, piccolo petroso, ganglio otico -----------------
    part('nTymp', 'nervo timpanico (di Jacobson)', 0x4a8fd6, [
      tube([[32.3, 8.7, 1563.2], [33.6, 6.6, 1565.5], [36.2, 4.6, 1568.8], [39.5, 3.4, 1572], [42.2, 2.9, 1575], [43.4, 2.5, 1578]], 0.45, { seg: 50 }),
    ]);
    const twig = (pts) => tube([[43.4, 2.5, 1578], ...pts], [0.38, 0.26], { seg: 12 });
    part('plesso', 'plesso timpanico, sul promontorio', 0x55c2e8, [
      twig([[43.5, 1.8, 1579.6], [43.5, 1.2, 1581]]),
      twig([[43.5, 3.2, 1579.2], [43.3, 3.8, 1580.2]]),
      twig([[43.4, 3.6, 1577.4], [43.2, 4.7, 1576.5]]),
      twig([[43.5, 1.4, 1577.6], [43.3, 0.2, 1577]]),
    ]);
    part('rTub', 'ramo tubarico', 0x55c2e8, [
      tube([[43.5, 1.6, 1578.6], [43.3, -1.4, 1578.8], [42.2, -4.6, 1578.9], [39.6, -7.6, 1579]], [0.38, 0.28], { seg: 20 }),
    ]);
    part('lpn', 'nervo piccolo petroso superficiale', PARA, [
      tube([[43.5, 1.2, 1581], [44.2, -1.5, 1583.6], [44.6, -5, 1585.7], [43.9, -9, 1585.3], [41.8, -12.7, 1584.4], [37, -14.4, 1582.4],
        [32, -14.3, 1582.2], [27.5, -12.8, 1583], [24.2, -11.4, 1581.6], [22.6, -12.5, 1578.6], [21.3, -14.1, 1576.6]], 0.45, { seg: 80 }),
    ]);
    part('otic', 'ganglio otico', 0x1f55b5, [ball([20.9, -14.6, 1575.6], [1.3, 1.7, 1.5])]);
    this.addLink('postgang', [[21.3, -15.2, 1574.6], [24.4, -15.6, 1573.4], [28, -15, 1569], [35.2, -9.6, 1560.2], [43.6, -4.6, 1556.6],
      [46.5, -8.5, 1555.5], [48.5, -14, 1553.5]].map((p) => mm(...p)), { color: PARA, r: 0.26 * S });
  }
}
