// Modello del controllo vegetativo: dai centri del tronco encefalico alla
// vescica e al cuore, in proporzioni reali (un solo corpo, dal vertice al
// perineo; i primi piani sono quelli del motore, `zoomTo`).
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0, derivato da BodyParts3D; file
// public/meshes/controllo-vegetativo.glb, manifesto meshes/controllo-vegetativo.json):
// - encefalo: giri della corteccia (involucro), da cui sono separati la parte
//   mediale e anteriore del giro frontale superiore (`mpfc`, usata come
//   corteccia prefrontale mediale) e i giri precentrale e paracentrale
//   (`area4`); ipotalamo, corpo amigdaloideo; mesencefalo, ponte, bulbo, quarto
//   ventricolo, acquedotto;
// - midollo spinale intero (sostanza bianca), diviso per quota in cinque
//   tratti; corna anteriori e posteriori del tratto lombare e del cono;
//   «Intermediolateral nucleus», di cui si usano tre tratti: C8-T5 (`imlHeart`),
//   T12-L2 (`imlLumb`) e, come nucleo parasimpatico sacrale, S2-S4 (`spn`:
//   l'oggetto Z-Anatomy corre lungo tutto il midollo nella posizione della
//   colonna laterale); cauda equina;
// - colonna vertebrale, sacro e coccige, ossa dell'anca (involucro);
// - vescica, uretra (fino al bulbo), prostata, nervi pudendi;
// - cuore (ventricoli, atrio sinistro, tronco polmonare), atrio destro, vene
//   cave superiore e inferiore (tratto toracico), aorta ascendente e arco,
//   tronco brachiocefalico e carotide comune destra, carotidi interna ed
//   esterna destre, polmoni, trachea;
// - nervo vago destro fino a metà collo (sotto la quota 1479 mm l'oggetto è
//   schematico, vedi src/models/nervo-vago.js), nervo glossofaringeo destro,
//   tronco del simpatico destro, vestibolo dell'orecchio interno destro.
// I tubi dei nervi e della colonna intermedio-laterale di Z-Anatomy hanno
// raggio 0,2-0,5 mm: sono ingrossati lungo le normali (`INFLATE`).
// Livelli del midollo: in Z-Anatomy le radici escono orizzontali, alla quota
// della vertebra omonima; i neuromeri sono stati quindi collocati rispetto alle
// vertebre reali e non alle radici: T12-L2 dietro T10-T11 (quota 1188-1238),
// S2-S4 dietro L1 (quota 1098-1128), C8-T5 tra C7 e T4 (quota 1378-1454). STIMATO.
//
// RICOSTRUITO A MANO dentro le mesh reali (punti in millimetri della sorgente,
// convertiti da `mm`). I nuclei del tronco sono stati controllati con un test
// di appartenenza: centro e quattro punti a distanza di un raggio stanno dentro
// bulbo, ponte o mesencefalo e fuori dal quarto ventricolo. Profilo del bulbo
// misurato sulla mesh (y ventrale-dorsale): 22-33 mm a quota 1545, 11-30 a
// 1564, 5-26 a 1572; obex a quota 1568 circa, giunzione bulbo-pontina a 1576.
// I nuclei dei nervi cranici di Z-Anatomy sono schematici e non sono usati.
//
// FONTI effettivamente lette (NCBI/StatPearls e Radiopaedia non sono leggibili
// in automatico):
// - Wikipedia (en), https://en.wikipedia.org/wiki/… :
//   "Pre-Bötzinger complex" (regione ventro-laterale del bulbo, parte del gruppo
//   respiratorio ventrale, limite caudale poco sotto l'obex);
//   "Bötzinger complex" (bulbo rostrale ventro-laterale, subito caudale al
//   nucleo del faciale e ventrale alla parte compatta del nucleo ambiguo);
//   "Respiratory center" (gruppo dorsale nel nucleo del tratto solitario, lungo
//   quasi tutto il bulbo dorsale; gruppo ventrale circa 5 mm davanti e di lato
//   al dorsale); "Parabrachial nuclei" (ponte dorso-laterale attorno al
//   peduncolo cerebellare superiore; Kölliker-Fuse sul margine ventro-laterale);
//   "Solitary nucleus" (neuroni cardio-respiratori nella parte caudale);
//   "Nucleus ambiguus" (profondo nella reticolare, dorsale all'oliva, parte
//   laterale del bulbo rostrale); "Dorsal nucleus of vagus nerve" (sotto il
//   pavimento del quarto ventricolo); "Rostral ventrolateral medulla";
//   "Periaqueductal gray" (attorno all'acquedotto); "Pontine micturition center"
//   (ponte rostrale; eccita i parasimpatici sacrali, inibisce Onuf tramite
//   interneuroni); "Onuf's nucleus" (parte ventrale del corno anteriore,
//   soprattutto S2, lungo 4-6 mm); "Intermediolateral nucleus" (lamina VII,
//   T1-L3); "Carotid sinus" (dilatazione alla base della carotide interna, subito
//   sopra la biforcazione); "Carotid body" (faccia posteriore della
//   biforcazione); "Inferior hypogastric plexus" (tra fori sacrali anteriori e
//   faccia posteriore della vescica, di lato al retto); "Pelvic splanchnic
//   nerves" (da S2-S4 al plesso ipogastrico inferiore); "Superior hypogastric
//   plexus" (davanti alla biforcazione aortica; riceve gli splancnici lombari);
//   "Hypogastric nerve"; "Internal urethral sphincter" (alla giunzione tra
//   uretra e vescica).
// - Europe PMC, PMID 18031468 (Lavezzi e Matturri 2008, riassunto): nell'uomo il
//   pre-Bötzinger sta in un'area ristretta del bulbo ventro-laterale a livello
//   dell'obex, ventrale al nucleo ambiguo semicompatto. PMID 21115469
//   (Schwarzacher et al. 2011, riassunto): conferma la sede ventro-laterale.
// - Per locus coeruleus, nucleo di Barrington, parabrachiale e A5 si riusano le
//   coordinate di src/models/formazione-reticolare.js (fonti elencate là).
// VERIFICATO sulle fonti: i rapporti reciproci dei nuclei (ordine rostro-caudale
// parafaciale, Bötzinger, pre-Bötzinger, rVRG, cVRG; pre-Bötzinger all'obex e
// ventrale all'ambiguo; solitario e motore dorsale sotto il pavimento; PAG
// attorno all'acquedotto), la sede di seno e glomo carotideo, il decorso dei
// nervi splancnici pelvici e ipogastrici, la sede dei plessi.
// STIMATO (nessuna misura nelle fonti lette): coordinate, calibro e limiti di
// tutti i nuclei; la distinzione core/shell del nucleo di Barrington (qui PSC
// ventro-laterale al PMC); il nucleo vestibolare laterale; forma e sede dei
// gangli (ipogastrico inferiore, vescicali, mesenterico inferiore), degli
// sfinteri uretrali (anelli attorno all'uretra reale: interno al collo
// vescicale, esterno sotto l'apice della prostata), del nodo seno-atriale, dei
// corpi cavali (anello sulla cava inferiore reale, sopra il diaframma), dei
// recettori aortici; il vago destro sotto metà collo e i suoi rami cardiaci
// (coordinate di src/models/nervo-vago.js), i nervi cardiaci del simpatico, il
// nervo di Hering; tutte le vie (frecce che uniscono origine e bersaglio lungo
// un decorso plausibile, non fasci misurati); il livello della lesione midollare.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.00085; // unità per mm (come nel manifesto)
const O = [0, 10, 795]; // origine del manifesto, in mm
// punto in mm: [distanza dal piano mediano verso DESTRA, y (indietro), z (alto)]
export const mm = ([l, y, z]) => new THREE.Vector3(l * S, (z - O[2]) * S, -(y - O[1]) * S);
const scaled = (r) => (Array.isArray(r) ? r.map((v) => v * S) : r * S);

// Asse del midollo reale (centro della sostanza bianca): quota -> y, in mm.
const CORD = [[1060, 24.1], [1075, 25.1], [1090, 27.2], [1105, 30.8], [1120, 34.4], [1135, 39.1], [1150, 44.1], [1165, 48.7], [1180, 54], [1195, 57.9],
  [1210, 61.9], [1225, 64.6], [1240, 66.9], [1255, 69.1], [1270, 70.9], [1285, 72], [1300, 72.5], [1315, 72.2], [1330, 71.2], [1345, 69.8], [1360, 67.6],
  [1375, 64], [1390, 58.9], [1405, 52.1], [1420, 46.3], [1435, 39.2], [1450, 33.5], [1465, 27.8], [1480, 23.9], [1495, 22.2], [1510, 22.9], [1525, 26.3], [1540, 28.6]];
const cordY = (z) => {
  const k = CORD.findIndex((r) => r[0] >= z);
  const i = Math.max(1, k < 0 ? CORD.length - 1 : k);
  const [z0, y0] = CORD[i - 1], [z1, y1] = CORD[i];
  return y0 + ((y1 - y0) * Math.min(1, Math.max(0, (z - z0) / (z1 - z0))));
};
// punti lungo il midollo, a `l` mm dalla linea mediana e `dy` mm dietro l'asse
const along = (l, dy, zs) => zs.map((z) => [l, cordY(z) + dy, z]);

const STEM = 0xe3cdb6, CSF = 0x6aa9d8, BONE = 0xe9dfc8, NERVE = 0xe6bd2e, ARTERY = 0xc9485b, VEIN = 0x4a6fb5;
const REAL = {
  cortex: ['corteccia cerebrale', 0xe6c9b0, { ghost: true, opacity: 0.3 }],
  mpfc: ['corteccia prefrontale mediale', 0xd98a5a],
  area4: ['area motoria primaria (area 4)', 0xb5524a],
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.5 }],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.5 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.5 }],
  v4: ['quarto ventricolo', CSF, { ghost: true, opacity: 0.5 }],
  aqueduct: ['acquedotto mesencefalico', CSF, { ghost: true, opacity: 0.8 }],
  hypothalamus: ['ipotalamo', 0xd9b26a],
  amygdala: ['amigdala', 0xc98a70],
  cordTop: ['midollo spinale cervicale', STEM, { ghost: true, opacity: 0.6 }],
  cordMid: ['midollo spinale toracico', STEM, { ghost: true, opacity: 0.6 }],
  cordLumb: ['midollo spinale: rigonfiamento lombare', STEM, { ghost: true, opacity: 0.55 }],
  cordConus: ['midollo spinale: tratto sacrale', STEM, { ghost: true, opacity: 0.55 }],
  cordTip: ['cono midollare', STEM, { ghost: true, opacity: 0.55 }],
  antLumb: ['corna anteriori (tratto lombare)', 0xcfa39a, { opacity: 0.85 }],
  postLumb: ['corna posteriori (tratto lombare)', 0x9fb3d6, { opacity: 0.85 }],
  antConus: ['corna anteriori (tratto sacrale)', 0xcfa39a, { opacity: 0.85 }],
  postConus: ['corna posteriori (tratto sacrale)', 0x9fb3d6, { opacity: 0.85 }],
  imlHeart: ['colonna intermedio-laterale da C8 a T5', 0x2f9a57],
  imlLumb: ['colonna intermedio-laterale, tratto lombare', 0x2f9a57],
  spn: ['neuroni parasimpatici pregangliari sacrali (S2-S4)', 0x2f6fe0],
  cauda: ['cauda equina', 0xf1e8d6, { opacity: 0.9 }],
  spineTop: ['colonna vertebrale', BONE, { ghost: true, opacity: 0.3 }],
  spineLow: ['colonna vertebrale', BONE, { ghost: true, opacity: 0.3 }],
  sacrum: ['sacro e coccige', BONE, { ghost: true, opacity: 0.35 }],
  hips: ["ossa dell'anca", BONE, { ghost: true, opacity: 0.3 }],
  bladder: ['vescica: muscolo detrusore', 0xe0b55a, { opacity: 0.92 }],
  urethra: ['uretra', 0xd9c98a],
  prostate: ['prostata', 0xc9a08a, { ghost: true, opacity: 0.4 }],
  pudendal: ['nervo pudendo', NERVE],
  heart: ['cuore', 0xb5474a, { opacity: 0.95 }],
  atriumR: ['atrio destro', 0x9a5a78, { opacity: 0.95 }],
  svc: ['vena cava superiore', VEIN],
  ivc: ['vena cava inferiore', VEIN],
  aorta: ['aorta ascendente e arco aortico', ARTERY],
  cca: ['tronco brachiocefalico e carotide comune destra', ARTERY],
  ica: ['arteria carotide interna', ARTERY],
  eca: ['arteria carotide esterna', 0xd9655a],
  lungs: ['polmoni', 0xd9a3a8, { ghost: true, opacity: 0.22 }],
  trachea: ['trachea', 0xcfdfe2, { ghost: true, opacity: 0.3 }],
  vagR: ['nervo vago', NERVE],
  ix: ['nervo glossofaringeo', 0x5fa8a0],
  sympTop: ['tronco del simpatico', 0x2f9a57],
  sympLow: ['tronco del simpatico', 0x2f9a57],
  vestibule: ["vestibolo dell'orecchio interno (macula del sacculo)", 0x8e5bb5],
};
// Di quanti mm ingrossare i tubi reali di nervi e colonne.
const INFLATE = { vagR: 1.3, ix: 0.9, sympTop: 0.9, sympLow: 0.9, pudendal: 0.9, imlHeart: 0.5, imlLumb: 0.45, spn: 0.4 };

// Nuclei e strutture ricostruiti. `pts`/`r`: tubo lungo l'asse (raggi in mm);
// `c`/`r`: ellissoide con semiassi [laterale, verticale, antero-posteriore];
// `ring`: anello orizzontale [centro, raggio, spessore]. `mid`: impari, sulla
// linea mediana; `right`: solo a destra; gli altri sono pari.
const HAND = {
  // --- bulbo: complesso vagale dorsale
  nts: { name: 'nucleo del tratto solitario', color: 0x2f9a63, shapes: [{ pts: [[2.4, 27, 1556], [3, 25.4, 1562], [4, 24.2, 1567], [5.2, 23.4, 1571], [6.3, 21.6, 1575]], r: 0.9 }] },
  dmv: { name: 'nucleo motore dorsale del vago', color: 0x2f6fe0, shapes: [{ pts: [[1.2, 26.2, 1558], [1.4, 24.4, 1563], [1.9, 23.2, 1568], [2.8, 22.6, 1572], [3.4, 20.8, 1575]], r: 0.7 }] },
  a2: { name: 'centro A2/C2 (ala cinerea): gruppo respiratorio dorsale', color: 0x57c7d4, shapes: [{ c: [3.3, 25.6, 1569.3], r: [0.9, 2, 0.8] }] },
  // --- bulbo ventro-laterale
  amb: { name: 'nucleo ambiguo', color: 0xc9485b, shapes: [{ pts: [[5.2, 26, 1550], [5.6, 23.8, 1557], [6.2, 20.5, 1563], [6.6, 17.6, 1568], [6.8, 15.8, 1572], [7, 14.6, 1575.5]], r: 0.6 }] },
  a1: { name: 'centro A1/C1 (bulbo ventro-laterale)', color: 0x3fae6b, shapes: [{ pts: [[8.3, 20.4, 1564.2], [9.3, 17.8, 1567], [9.9, 15.6, 1571], [10, 14.4, 1574]], r: 0.8 }] },
  cvrg: { name: 'gruppo respiratorio ventrale, porzione caudale (cVRG)', color: 0x7a4fd0, shapes: [{ pts: [[5.9, 25.2, 1548], [6.4, 23.4, 1554], [7, 21.4, 1559.5]], r: 0.9 }] },
  rvrg: { name: 'gruppo respiratorio ventrale, porzione rostrale (rVRG)', color: 0xe07b39, shapes: [{ pts: [[7.3, 20.2, 1561.5], [7.7, 18.2, 1565.5]], r: 0.9 }] },
  prebot: { name: 'complesso del pre-Bötzinger', color: 0xf2c300, shapes: [{ c: [8, 16, 1568.4], r: [1, 1.3, 1] }] },
  bot: { name: 'nucleo di Bötzinger', color: 0xd94f8a, shapes: [{ c: [8.2, 14, 1572.8], r: [1, 1.8, 1] }] },
  pfrg: { name: 'complesso parafaciale retrotrapezoidale', color: 0xa58a6a, shapes: [{ c: [6.6, 10.6, 1578.4], r: [1.3, 1.2, 0.9] }] },
  lvn: { name: 'nucleo vestibolare laterale', color: 0x8e5bb5, shapes: [{ c: [8.2, 20.2, 1580], r: [1.4, 1.6, 1.2] }] },
  // --- ponte
  a5: { name: 'nucleo A5 (paragiganto-cellulare)', color: 0x4a8fb5, shapes: [{ c: [7.4, 9.6, 1584], r: [1, 1.8, 1] }] },
  pbm: { name: 'nucleo parabrachiale mediale', color: 0x5aa0c8, shapes: [{ c: [6.4, 17, 1595.6], r: [1, 1.6, 1] }] },
  kf: { name: 'nucleo di Kölliker-Fuse', color: 0x2f6fd0, shapes: [{ c: [8.6, 15.4, 1593.2], r: [1, 1.5, 1] }] },
  lc: { name: 'locus coeruleus', color: 0x3a56b0, shapes: [{ pts: [[5.6, 19.2, 1586.4], [4.6, 17, 1591], [3.7, 15.1, 1596], [3.1, 13.6, 1600.4]], r: [0.9, 1.1, 1.1, 0.9] }] },
  pmc: { name: 'centro pontino della minzione (PMC), core del nucleo di Barrington', color: 0xe0a02a, shapes: [{ c: [2.3, 14.9, 1594], r: [0.7, 1.3, 0.7] }] },
  psc: { name: 'centro pontino della continenza (PSC), shell del nucleo di Barrington', color: 0xd43d3d, shapes: [{ c: [3.7, 13.4, 1593.2], r: [0.8, 1.3, 0.8] }] },
  // --- mesencefalo
  pag: { name: 'grigio periacqueduttale (PAG)', color: 0x9a8fc8, mid: true, opacity: 0.8, shapes: [{ pts: [[0, 14.4, 1603.6], [0, 13.5, 1608], [0, 12.8, 1612], [0, 12.2, 1615.4]], r: 3 }] },
  // --- midollo sacrale
  onuf: { name: 'nucleo di Onuf (S2-S4)', color: 0xc9485b, shapes: [{ pts: [[2, 27.6, 1100], [2.5, 29.4, 1110], [2.9, 31.6, 1120], [3.1, 33.6, 1128]], r: 0.5 }] },
  // --- pelvi
  sphInt: { name: 'muscolo sfintere uretrale interno', color: 0x2f9a57, mid: true, shapes: [{ ring: [[0, 16.2, 830.4], 4.2, 1.7] }] },
  sphExt: { name: 'muscolo sfintere uretrale esterno', color: 0xb5524a, mid: true, shapes: [{ ring: [[0, 13.6, 810.6], 3.6, 1.9] }] },
  ihg: { name: 'ganglio ipogastrico inferiore', color: 0x1f7a45, shapes: [{ c: [25.5, 44.5, 867], r: [2.2, 5.5, 4.5] }] },
  vesG: { name: 'gangli del plesso vescicale', color: 0x2f6fe0, shapes: [{ c: [24.5, 31, 843], r: [1.8, 1.8, 1.8] }, { c: [21, 37, 849], r: [1.5, 1.5, 1.5] }, { c: [28, 23, 847], r: [1.5, 1.5, 1.5] }] },
  img: { name: 'ganglio mesenterico inferiore', color: 0x1f7a45, mid: true, shapes: [{ c: [-6, -42, 1058], r: [3.2, 3.2, 2.4] }] },
  pelvicN: { name: 'nervi splancnici pelvici (parasimpatico sacrale)', color: 0x5f8fe0, shapes: [{ pts: [[4, 48, 955], [10, 62, 935], [18, 66, 915], [22, 60, 900], [25, 47, 872], [24.5, 33, 845]], r: 0.9 }] },
  lumbSpl: { name: 'nervi splancnici lombari', color: 0x57b377, shapes: [{ pts: [[21, 38, 1136], [20, 24, 1112], [20, 10, 1086], [10, -22, 1068], [-3, -38, 1058]], r: 0.9 }] },
  hypoUp: { name: 'plesso ipogastrico superiore', color: 0x57b377, mid: true, shapes: [{ pts: [[-3, -38, 1056], [-1, -24, 1010], [0, -8, 972]], r: 1.1 }] },
  hypoN: { name: 'nervo ipogastrico', color: 0x57b377, shapes: [{ pts: [[0.5, -8, 972], [9, 1, 952], [19, 20, 922], [24, 38, 892], [25.5, 45, 872]], r: 0.9 }] },
  // --- collo e torace
  sinus: { name: 'seno carotideo (barocettori)', color: 0xf08a3c, right: true, opacity: 0.9, shapes: [{ c: [32.3, 0, 1494.5], r: [5, 5.4, 4.9] }] },
  glomus: { name: 'glomo carotideo (chemocettori)', color: 0x7a4fd0, right: true, shapes: [{ c: [31.4, 5.6, 1487.4], r: [1.9, 2.3, 1.7] }] },
  hering: { name: 'nervo di Hering (ramo del glossofaringeo)', color: 0x5fa8a0, right: true, shapes: [{ pts: [[31.8, 4.6, 1489.5], [33, 4.8, 1498], [34.6, 5, 1508], [35, 4.2, 1520]], r: 0.8 }] },
  aoBody: { name: "seno e glomo aortici (nervo di Cyon del vago)", color: 0xf08a3c, right: true, shapes: [{ c: [-15, -1, 1395], r: [5, 3, 6] }] },
  vagLow: { name: 'nervo vago destro (tratto ricostruito)', color: NERVE, right: true, shapes: [
    { pts: [[23.8, -1.6, 1487], [23.6, -1.9, 1481], [22.6, -0.8, 1474], [21.2, 0.3, 1467], [19, -0.8, 1458], [18, -3, 1449], [18.8, -5, 1440], [21.3, -8.2, 1430], [22, -11, 1420], [21.8, -11.5, 1413], [19.5, -8.5, 1404], [15.5, -2.5, 1395]], r: 1.6 },
  ] },
  vagCard: { name: 'rami cardiaci del vago', color: NERVE, right: true, shapes: [{ pts: [[15.5, -2.5, 1395], [12.8, -6, 1386], [7, -4.6, 1378], [1, -2.5, 1372.5], [-1.5, -0.8, 1370.5]], r: 1 }] },
  cardN: { name: 'nervi cardiaci del simpatico', color: 0x57b377, right: true, shapes: [
    { pts: [[13, 30, 1402], [11, 16, 1392], [5, 4, 1380], [-1, 0, 1371.5]], r: 1 },
    { pts: [[11, 18, 1426], [10, 8, 1408], [5, 2, 1388], [-0.5, -0.5, 1372.5]], r: 0.8 },
  ] },
  san: { name: 'nodo seno-atriale', color: 0xf2c300, right: true, shapes: [{ c: [26.5, -20, 1339], r: [3, 4.5, 3] }] },
  cavali: { name: 'corpi cavali (barocettori atriali)', color: 0xf08a3c, right: true, shapes: [{ ring: [[13.5, -13.5, 1244], 12.5, 2.2] }] },
};

const GREEN = 0x1f9d57, RED = 0xd43d3d, BLUE = 0x2f6fe0, AMBER = 0xd98a1a;
// Vie: [id, raggio in mm, punti in mm (lato destro), opzioni]. Il raggio dipende
// dall'ingrandimento a cui la via è mostrata (tronco 9x, corpo intero 1x).
const T = 0.32, C = 0.36, H = 0.8, N = 0.6, P = 1, R = 1.5, L = 1.9, W = 3.2;
const LINKS = [
  // --- respiro (tronco)
  ['pfPre', T, [[7.4, 10.6, 1577.6], [10.2, 12.8, 1573.4], [9.3, 15.3, 1569.5]], { color: GREEN }],
  ['preRvrg', T, [[9, 16.2, 1568.2], [10, 18.2, 1566.4], [8.7, 19.4, 1564.4]], { color: GREEN }],
  ['preCvrg', T, [[7.6, 17.1, 1568], [6.9, 21.8, 1565], [6.7, 22.8, 1560.4]], { color: RED, inhibit: true }],
  ['prePn', T, [[8.3, 16.8, 1569.6], [9.6, 17.6, 1577], [9.6, 18.4, 1586], [7.5, 17.4, 1594]], { color: GREEN }],
  ['preBot', T, [[8.9, 15.4, 1568.9], [9.5, 14.4, 1570.3], [9.1, 13.9, 1571.4]], { color: GREEN }],
  ['botRvrg', T, [[9.2, 14.2, 1572], [10.6, 17, 1568], [8.7, 19.6, 1564.6]], { color: RED, inhibit: true }],
  ['botCvrg', T, [[9.2, 14.4, 1572], [10.3, 18.5, 1566], [8.6, 22, 1561], [7.6, 22.4, 1559]], { color: GREEN }],
  ['ntsBot', T, [[5.6, 22.6, 1571.2], [7.4, 19, 1572.4], [8.1, 16, 1572.8]], { color: GREEN }],
  ['botPre', T, [[9.1, 13.6, 1571.6], [9.7, 14.6, 1570.2], [9, 15.4, 1569.2]], { color: RED, inhibit: true }],
  ['a2Pre', T, [[4, 25, 1569.2], [6.4, 21, 1569], [7.6, 17.3, 1568.6]], { color: GREEN }],
  ['a2Rvrg', T, [[3.9, 25, 1568.4], [5.4, 23, 1566], [6.8, 20.6, 1564.4]], { color: GREEN }],
  // --- pressione (tronco)
  ['ixNts', T, [[14, 19, 1570], [9, 20.6, 1570.8], [6.1, 22.9, 1571]], { color: AMBER }],
  ['ntsA2', T, [[5, 24.6, 1570.8], [4.7, 26.6, 1570.5], [3.9, 26.5, 1569.8]], { color: AMBER }],
  ['a2Amb', T, [[3.6, 24.6, 1569], [5, 20.5, 1569.6], [6.3, 17.4, 1570]], { color: GREEN }],
  ['a2A1i', T, [[4.2, 25.2, 1568.6], [8.2, 22.5, 1567], [9.6, 18.4, 1567.8]], { color: RED, inhibit: true }],
  ['a2A1e', T, [[4.2, 25.2, 1568.6], [8.2, 22.5, 1567], [9.6, 18.6, 1567.8]], { color: GREEN }],
  ['lvnA1', T, [[8.7, 19.3, 1579], [9.9, 17, 1576.8], [10.1, 15.3, 1575]], { color: GREEN }],
  // --- pressione (testa, 6x)
  ['vestLvn', 0.5, [[36, 8, 1582], [24, 9, 1580.5], [14, 13.5, 1580], [9.8, 19, 1580]], { color: AMBER }],
  ['hypA1', 0.5, [[3.6, -10, 1611], [4.6, -2, 1605], [6.4, 6, 1595], [8.4, 11.5, 1584], [9.8, 14, 1575.4]], { color: GREEN }],
  ['amyA1', 0.5, [[22.5, -9, 1608], [15, -2, 1602], [11.5, 6, 1592], [10.8, 12.4, 1581], [10.4, 14.4, 1575.6]], { color: GREEN }],
  // --- minzione (tronco)
  ['ascLC', T, [[5, 21, 1552], [6, 16.5, 1566], [6.6, 17.5, 1580], [5.7, 18.8, 1585.6]], { color: AMBER }],
  ['pagPmc', T, [[2.7, 14, 1604.2], [2.5, 13.6, 1600], [2.3, 14.5, 1595.8]], { color: GREEN }],
  ['pscPmc', T, [[3.9, 12.3, 1593.6], [3, 12.1, 1594.6], [2.4, 13.5, 1594.5]], { color: RED, inhibit: true }],
  ['affPag', T, [[5, 21, 1552], [5.4, 14, 1572], [4.6, 11, 1590], [3.3, 12.6, 1602.4]], { color: AMBER }],
  ['pmcDown', T, [[2.3, 14.2, 1592.6], [2.6, 13, 1582], [3.6, 16, 1568], [4.6, 23, 1552], [4.6, 27, 1543]], { color: GREEN }],
  // --- minzione (encefalo)
  ['lcPfc', H, [[3.4, 13, 1601], [4.5, 0, 1612], [5.5, -20, 1622], [6, -40, 1638], [5.6, -52, 1655]], { color: AMBER }],
  ['pfcM1', H, [[5.6, -48, 1668], [8, -25, 1676], [8, 0, 1681], [6.6, 18, 1685]], { color: GREEN }],
  ['m1Pag', H, [[7, 20, 1682], [12, 14, 1660], [11, 8, 1636], [6.4, 10, 1621], [3.4, 12.6, 1613]], { color: GREEN }],
  // --- minzione (corpo intero)
  ['ascW', W, along(2, 1, [1110, 1180, 1260, 1340, 1410, 1470, 1520, 1548]), { color: AMBER }],
  ['rsW', W, along(2, 0, [1548, 1520, 1470, 1410, 1340, 1260, 1180, 1118]), { color: GREEN }],
  // --- minzione (cono)
  ['rsSpn', C, [[4.7, 43.5, 1142], [4.4, 38, 1133], [3.7, 34.2, 1124]], { color: GREEN }],
  ['rsOnuf', C, [[1.6, 40.6, 1142], [1.8, 35.4, 1133.5], [2.6, 33.2, 1129.6]], { color: RED, inhibit: true }],
  // --- minzione (pelvi)
  ['aff', P, [[24, 31, 848], [25.5, 46, 870], [22, 60, 900], [17, 66, 916], [9, 61, 937], [4, 48, 956]], { color: AMBER }],
  ['pelvicSpl', P, [[3, 31, 985], [4.5, 48, 956], [10, 62, 936], [18, 66.6, 915], [22.4, 60, 899], [25.6, 47, 871], [25, 34, 847]], { color: BLUE }],
  ['postPara', P, [[26, 30, 846], [30.5, 18, 856], [34, 2, 862]], { color: GREEN }],
  ['paraSph', P, [[22, 30, 840.5], [14, 24.5, 834.5], [6, 17.6, 831.4]], { color: RED, inhibit: true }],
  ['preHypo', P, [[2, -8, 985], [9.4, 0.4, 953], [19.6, 20, 923], [24.8, 38, 893], [26, 45.4, 874]], { color: GREEN }],
  ['postSphInt', P, [[24, 42, 861], [18, 30, 842], [10, 21.5, 834], [5.6, 17.4, 831.2]], { color: GREEN }],
  ['postDet', P, [[26.5, 41, 863], [30, 28, 858], [34.5, 11, 862]], { color: RED, inhibit: true }],
  ['pudDown', P, [[13, 71, 928], [21, 73, 900], [27.6, 69, 872], [27.4, 60, 839], [23, 44, 823], [16.4, 21, 813.6]], { color: GREEN }],
  ['pudSph', P, [[15, 13.4, 812.6], [9.5, 13.8, 811.4], [5, 13.7, 810.8]], { color: GREEN }],
  // --- minzione (metà inferiore del tronco, 1,7x)
  ['preLumb', L, [[4.1, 61.4, 1212], [3, 52, 1178], [3, 39.6, 1136], [6, 31, 1110], [14, 27, 1099], [21, 12, 1087], [11, -22, 1070], [-2, -40, 1060]], { color: GREEN }],
  ['hypoLow', L, [[-2, -40, 1054], [0, -24, 1010], [0, -8, 972], [9.4, 1, 951], [19.6, 20, 922], [25, 38, 892], [26, 45, 874]], { color: GREEN }],
  // --- cuore e riflessi (collo e torace, 2x)
  ['a1Iml', R, [[9.4, 17, 1568], [6, 24, 1552], ...along(4.6, 0, [1540, 1510, 1490, 1466, 1450, 1432])], { color: GREEN }],
  ['vsp', R, [[8.2, 20, 1579], [5.6, 22, 1560], ...along(3.8, -1, [1540, 1505, 1470, 1446])], { color: GREEN }],
  ['sympHeart', R, [[3.6, 46.3, 1420], [9, 38, 1411], [13.4, 29, 1401], [10, 14, 1391], [3, 3, 1378], [-1, -2, 1368], [11, -14, 1354], [23, -19, 1343]], { color: GREEN }],
  ['vagHeart', R, [[8, 17, 1573], [24, 10, 1567], [26.4, -1, 1540], [26, -2, 1500], [20.6, -1, 1458], [23.4, -10.5, 1421], [16.5, -3, 1394], [7, -5.6, 1378], [12, -14, 1356], [24, -19, 1343.4]], { color: BLUE }],
  ['hbAff', R, [[52, 12, 1326], [27, 20, 1352], [16, 10, 1376], [16.6, -3, 1396], [23.4, -10.5, 1421], [20.6, -1, 1458], [26, -2, 1500], [26.4, -1, 1540], [24, 10, 1567], [9, 17.4, 1573]], { color: AMBER }],
  // --- cuore (4,5x)
  ['sympSan', H, [[12, 26, 1400], [9, 10, 1389], [1, 0.6, 1374], [9, -12, 1357], [23, -18.6, 1343]], { color: GREEN }],
  ['sympVent', H, [[1, 0.6, 1374], [-8, -22, 1356], [-22, -46, 1326], [-30, -58, 1298]], { color: GREEN }],
  ['vagSan', H, [[16.5, -3, 1396], [11, -6.4, 1384], [3, -4.4, 1375], [12, -13, 1357], [24, -19, 1343.4]], { color: BLUE, inhibit: true }],
  // --- collo (5x)
  ['heringUp', N, [[32.6, 3.6, 1492], [34.6, 6, 1508], [36, 5, 1520], [35, 4.5, 1535], [34, 7, 1552], [26, 14, 1565], [11, 19.4, 1570.6]], { color: AMBER }],
];

export class ControlloVegetativo extends AnatomyModel {
  constructor() {
    super({ tilt: -0.42 });
    this.addStand({ radius: 0.17, z: 0 });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('controllo-vegetativo.glb', REAL);
    this.#inflate();
    for (const [id, n] of Object.entries(HAND)) {
      const geos = n.shapes.map((s) => this.#shape(s));
      // prima il lato destro: è quello a cui si agganciano etichette e indicatori
      this.addPart(id, n.name, n.color, n.mid || n.right ? geos : [...geos, ...geos.map((g) => mirror(g))], n.opacity ? { opacity: n.opacity } : {});
    }
    // piano della lesione midollare, attraverso il midollo toracico
    const cut = new THREE.CylinderGeometry(15 * S, 15 * S, 1.2 * S, 40);
    const c = mm([0, cordY(1300), 1300]);
    cut.translate(c.x, c.y, c.z);
    this.addPart('cut', 'lesione del midollo spinale', 0x3a3632, [cut], { opacity: 0.75, double: true });
    for (const [id, r, pts, opts] of LINKS) this.addLink(id, pts.map(mm), { ...opts, r: r * S });
  }

  // I tubi reali sono sottilissimi: li ingrosso lungo le normali, conservando il
  // decorso (gli oggetti con le facce rivolte all'interno vanno prima rigirati).
  #inflate() {
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (const [id, d] of Object.entries(INFLATE))
      for (const m of this.parts.get(id).meshes) {
        const pos = m.geometry.attributes.position, ix = m.geometry.index.array;
        let vol = 0;
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
        m.geometry.computeVertexNormals();
      }
  }

  #shape(s) {
    if (s.pts) return taperTube(s.pts.map(mm), scaled(s.r), { radial: 14, seg: Math.max(24, s.pts.length * 8) });
    if (s.ring) {
      const [p, r, w] = s.ring;
      const g = new THREE.TorusGeometry(r * S, w * S, 12, 32);
      g.rotateX(Math.PI / 2);
      g.scale(1, 1.5, 1); // manicotto più alto che spesso
      const q = mm(p);
      return g.translate(q.x, q.y, q.z);
    }
    const g = ellipsoid([0, 0, 0], scaled([s.r[0], s.r[1], s.r[2]]), null, 20);
    const p = mm(s.c);
    return g.translate(p.x, p.y, p.z);
  }

  update(dt, camera, realDt = dt) {
    super.update(dt, camera, realDt);
    // gli indicatori di attività stanno dentro il modello ingrandito: restano
    // della stessa misura a schermo qualunque sia il primo piano
    const s = this.lens.scale.x;
    for (const part of this.parts.values())
      if (part.cone) {
        part.cone.scale.setScalar(1 / s);
        part.cone.position.y = part.top + 0.026 / s;
      }
  }
}
