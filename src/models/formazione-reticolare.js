// Modello della formazione reticolare.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0, derivato da BodyParts3D; file
// public/meshes/formazione-reticolare.glb, manifesto meshes/formazione-reticolare.json):
// - tronco encefalico: mesencefalo (tegmento e tetto), base del peduncolo
//   cerebrale, ponte, bulbo; collicoli superiori e inferiori; peduncoli
//   cerebellari superiori; quarto ventricolo e acquedotto; nucleo rosso;
// - midollo cervicale (sostanza bianca), corna anteriori e posteriori e
//   «Spinal reticular process» (il processo reticolare alla base del corno
//   posteriore), tagliati poco sotto C2;
// - talamo, ipotalamo, corpo amigdaloideo, caudato e putamen, cervelletto
//   (lobuli e verme), giri della corteccia cerebrale (solo come involucro).
// Da sapere sulla sorgente: i nuclei dei nervi cranici di Z-Anatomy sono
// schematici e non sono usati; la sostanza nera non esiste come mesh; il nucleo
// rosso è molto ventrale e lascia poco spazio alla parte mediale della sostanza
// nera, che qui comincia quindi lateralmente al nucleo rosso.
//
// RICOSTRUITO A MANO dentro le mesh reali (punti in millimetri della sorgente,
// convertiti da `mm`): tutti i nuclei della formazione reticolare (rafe, colonna
// mediale, colonna laterale con banda interna ed esterna, gruppi dopaminergici
// del mesencefalo, stazioni pre-cerebellari), i nuclei talamici aspecifici, le
// vie ascendenti e discendenti, il piano di sezione della decerebrazione.
// Ogni nucleo è stato controllato con un test di appartenenza: i punti
// campione stanno dentro le mesh di bulbo, ponte, mesencefalo (o midollo, o
// talamo) e fuori da quarto ventricolo, acquedotto e base del peduncolo.
// Reperi misurati sulle mesh: pavimento del quarto ventricolo sulla linea
// mediana (y = 21 mm a z 1572, 18 a 1582, 15 a 1592, 14 a 1600), acquedotto
// (y 14-12 tra z 1605 e 1613), obex (z 1568 circa), giunzione bulbo-pontina
// (z 1576), giunzione ponto-mesencefalica (z 1601).
//
// FONTI effettivamente lette (NCBI/StatPearls e Radiopaedia non sono leggibili
// in automatico; TeachMeAnatomy non ha una pagina a quell'indirizzo):
// - Kenhub, "Reticular formation"
//   https://www.kenhub.com/en/library/anatomy/reticular-formation
//   VERIFICATO: tre gruppi (laterale, mediale, mediano) speculari nelle due
//   metà; rafe sulla linea mediana dal collicolo superiore ai due terzi
//   superiori del bulbo, nell'ordine dorsale, centrale superiore, pontino,
//   magno, scuro e pallido; gruppo mediale dal mesencefalo (profondo ai
//   collicoli) al bulbo, con giganto-cellulare dorsale all'oliva, ventro-laterale
//   al nucleo dell'ipoglosso; pars alpha laterale al rafe magno; cuneiforme e
//   sub-cuneiforme profondi alla lamina quadrigemina, il secondo ventrale al
//   primo; gruppo laterale dal collicolo inferiore al midollo; area
//   parvicellulare mediale al nucleo spinale del trigemino; nuclei parabrachiali
//   accanto al peduncolo cerebellare superiore; gruppi A1, A5, C1 nell'area
//   ventro-laterale superficiale.
// - Wikipedia (en), https://en.wikipedia.org/wiki/… : "Reticular formation"
//   (tre colonne; fascio reticolo-spinale mediale pontino ed eccitatorio,
//   laterale bulbare e inibitorio, dal giganto-cellulare), "Raphe nuclei",
//   "Median raphe nucleus" (dal polo inferiore del rafe dorsale fino circa alla
//   decussazione dei peduncoli cerebellari superiori), "Nucleus raphe magnus"
//   (subito rostrale al rafe scuro), "Locus coeruleus" (ponte rostrale, parte
//   laterale del pavimento del IV ventricolo), "Pedunculopontine nucleus" (sotto
//   il nucleo rosso, caudale alla sostanza nera, accanto al peduncolo
//   cerebellare superiore), "Laterodorsal tegmental nucleus" (tra tegmento
//   pontino e mesencefalico), "Gigantocellular reticular nucleus" (ponte caudale
//   e bulbo rostrale), "Parvocellular reticular nucleus" (dorso-laterale al
//   reticolare pontino caudale), "Reticulotegmental nucleus" (subito dorsale ai
//   nuclei pontini), "Ventral tegmental area" (vicino alla linea mediana, con
//   nucleo rosso e sostanza nera laterali), "Substantia nigra" (dorsale al piede
//   del peduncolo), "Dopaminergic cell groups" (A8 dorso-laterale alla sostanza
//   nera, a livello del nucleo rosso e più caudalmente), "Parabrachial nuclei"
//   (ponte dorso-laterale, attorno al peduncolo cerebellare superiore), "Area
//   postrema" (coppia di rilievi al limite infero-posteriore del IV ventricolo,
//   subito prima dell'obex, accanto al trigono del vago), "Pontine micturition
//   center" (ponte rostrale), "Lateral reticular nucleus", "Paramedian reticular
//   nucleus", "Dorsal tegmental nucleus" (presso la linea mediana).
// - Europe PMC, PMC10203805 (Hum Brain Mapp 2023, segmentazione del locus
//   coeruleus): lunghezza 12-17 mm, diametro circa 1,5 mm, al margine
//   antero-laterale del IV ventricolo, dal collicolo inferiore in giù. Qui: 15,8 mm.
// - Europe PMC, PMC10203800 (Hum Brain Mapp 2023, nucleo peduncolo-pontino):
//   alla giunzione ponto-mesencefalica, 4,5-8,5 mm dalla linea mediana, esteso
//   in senso caudale per 5-10 mm fino al livello del locus coeruleus, mediale al
//   lemnisco mediale e laterale alla decussazione dei peduncoli superiori.
// STIMATO (nessuna misura nelle fonti lette): coordinate, calibro e limiti
// rostro-caudali di tutti gli altri nuclei, posti in base ai rapporti descritti
// sopra e ai reperi delle mesh; profondità dei nuclei del rafe rispetto al
// pavimento; forma a lamina delle due parti della sostanza nera; posizione dei
// nuclei talamici aspecifici dentro il talamo; decorso di tutte le vie (sono
// frecce che uniscono origine e bersaglio, non fasci misurati); livello del
// taglio della decerebrazione (mesencefalo: negli appunti non è indicato).
// DOVE APPUNTI E FONTI DIVERGONO il testo segue gli appunti, la geometria le
// fonti: gli appunti pongono il peduncolo-pontino «medialmente» al locus
// coeruleus (qui è ventro-laterale e più rostrale) e il sub-cuneiforme
// «caudalmente e medialmente» al cuneiforme (qui ventrale, appena caudale e
// mediale); chiamano A8 «rubro-rubrale» (retro-rubrale) e numerano B7 il nucleo
// tegmentale dorsale.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0038; // unità per mm (come nel manifesto)
const O = [0, 10, 1500]; // origine del manifesto, in mm
// punto in mm: [distanza dal piano mediano verso DESTRA, y (indietro), z (alto)]
const mm = ([l, y, z]) => new THREE.Vector3(l * S, (z - O[2]) * S, -(y - O[1]) * S);
const scaled = (r) => (Array.isArray(r) ? r.map((v) => v * S) : r * S);

const STEM = 0xe3cdb6, CSF = 0x6aa9d8;
const REAL = {
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.5 }],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.5 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.5 }],
  cord: ['midollo spinale cervicale', STEM, { ghost: true, opacity: 0.55 }],
  peduncle: ['base del peduncolo cerebrale', STEM, { ghost: true, opacity: 0.35 }],
  collSup: ['collicoli superiori', 0xd8c3ae, { ghost: true, opacity: 0.4 }],
  collInf: ['collicoli inferiori', 0xd8c3ae, { ghost: true, opacity: 0.4 }],
  scp: ['peduncoli cerebellari superiori', 0xf1e8d6, { ghost: true, opacity: 0.3 }],
  v4: ['quarto ventricolo', CSF, { ghost: true, opacity: 0.55 }],
  aqueduct: ['acquedotto mesencefalico', CSF, { ghost: true, opacity: 0.8 }],
  red: ['nucleo rosso', 0xd9796a],
  antHorn: ['corna anteriori del midollo (motoneuroni)', 0xb5524a],
  postHorn: ['corna posteriori del midollo', 0x6f8fc9],
  cordRet: ['nucleo reticolare del midollo spinale', 0xe0808c],
  thalamus: ['talamo', 0xd8c3ae, { ghost: true, opacity: 0.5 }],
  hypothalamus: ['ipotalamo', 0xd9b26a],
  amygdala: ['amigdala', 0xc98a70],
  striatum: ['nuclei della base (caudato e putamen)', 0xb9a0c8, { opacity: 0.85 }],
  cerebellum: ['cervelletto', 0xe6d2c4, { ghost: true, opacity: 0.16 }],
  cortex: ['corteccia cerebrale', 0xe6c9b0, { ghost: true, opacity: 0.14 }],
};

// Nuclei ricostruiti. `pts`/`r`: tubo lungo l'asse del nucleo (raggi in mm,
// `flatx` schiaccia la sezione in senso trasversale); `c`/`r`: ellissoide con
// semiassi [laterale, verticale, antero-posteriore], `dir` orienta il primo
// semiasse nel piano orizzontale ([verso destra, verso dietro]). `mid`: nucleo
// impari sulla linea mediana; gli altri sono pari.
const NUCLEI = {
  // colonna mediana: nuclei del rafe
  rPal: { name: 'nucleo del rafe pallido (B1)', color: 0xf2dc96, mid: true, shapes: [{ pts: [[0, 20.2, 1557], [0, 14.8, 1563], [0, 9.8, 1569.5]], r: 1.3, flatx: 0.45 }] },
  rObs: { name: 'nucleo del rafe scuro (B2)', color: 0xa07c22, mid: true, shapes: [{ pts: [[0, 21.4, 1562], [0, 19.3, 1567], [0, 16.6, 1572.5], [0, 15.6, 1575.3]], r: 1.4, flatx: 0.45 }] },
  rMag: { name: 'nucleo del rafe magno (B3)', color: 0xe8a81c, mid: true, shapes: [{ pts: [[0, 11.3, 1576], [0, 9.6, 1581], [0, 8, 1586.6]], r: 1.7, flatx: 0.45 }] },
  rPon: { name: 'nucleo del rafe pontino (B5)', color: 0xeccb62, mid: true, shapes: [{ pts: [[0, 8.6, 1587.6], [0, 8.4, 1590], [0, 8.2, 1592.4]], r: 1.3, flatx: 0.45 }] },
  rCen: { name: 'nucleo centrale superiore (B6)', color: 0xd9952e, mid: true, shapes: [{ pts: [[0, 8, 1593.4], [0, 7.6, 1597], [0, 7.2, 1600.6]], r: 1.7, flatx: 0.45 }] },
  rTeg: { name: 'nucleo tegmentale dorsale (B7)', color: 0xcfae6a, shapes: [{ c: [1.3, 12.4, 1598.6], r: [0.8, 1.4, 0.8] }] },
  rDor: { name: 'nucleo dorsale del rafe (B8-B9)', color: 0xf2c300, mid: true, shapes: [{ pts: [[0, 11.9, 1601.4], [0, 11.5, 1605], [0, 10.6, 1609], [0, 9.6, 1612.6]], r: 1.6, flatx: 0.7 }] },
  // colonna mediale (magnocellulare); il giganto-cellulare bulbare si assottiglia
  // in basso fino al processo reticolare del midollo (mesh reale `cordRet`)
  gigBulb: { name: 'nucleo giganto-cellulare bulbare', color: 0xc9485b, shapes: [{ pts: [[4.2, 28.6, 1542], [3.7, 27, 1547], [3.2, 24.3, 1553.5], [3.1, 21.6, 1560.5], [3.2, 19.3, 1567], [3.3, 16, 1572], [3.3, 14.8, 1575.4]], r: [0.7, 0.9, 1.3, 1.8, 1.9, 1.9, 1.8] }] },
  magoun: { name: 'pars alpha del giganto-cellulare (centro inibitore di Magoun)', color: 0x8e2f3f, shapes: [{ c: [2.4, 9.9, 1577.6], r: [1.5, 3, 1.2] }] },
  gigPont: { name: 'nucleo giganto-cellulare pontino', color: 0xdb6a3c, shapes: [{ pts: [[3.2, 13.8, 1578.2], [3.2, 12.4, 1583], [3.1, 10.9, 1587.6]], r: 2.0 }] },
  pprf: { name: 'formazione reticolare pontina paramediana (PPRF)', color: 0xe59a4a, shapes: [{ pts: [[3.1, 10.2, 1589.4], [3.1, 9.6, 1594], [3.1, 9.1, 1598.2]], r: 2.0 }] },
  cun: { name: 'nucleo cuneiforme', color: 0xb5524a, shapes: [{ c: [6.6, 10.6, 1606.2], r: [1.6, 3, 1.5] }] },
  subcun: { name: 'nucleo sub-cuneiforme', color: 0x9c4a6a, shapes: [{ c: [5.4, 8.2, 1603.2], r: [1.3, 2, 1.2] }] },
  // colonna laterale: area parvicellulare, banda interna (dorsale), banda esterna (ventrale)
  parv: { name: 'area reticolare parvicellulare', color: 0x1f9d9d, shapes: [{ pts: [[5.3, 25.5, 1559], [6.8, 23.5, 1566], [8, 21.8, 1572], [8.3, 20, 1577], [8.5, 19, 1581]], r: [1.3, 1.5, 1.5, 1.4, 1.2] }] },
  a2: { name: 'centro A2/C2 (ala cinerea)', color: 0x57b377, shapes: [{ c: [2.7, 21.5, 1572.6], r: [0.9, 2.4, 0.8] }] },
  postrema: { name: 'area postrema', color: 0xd94f8a, shapes: [{ c: [2.6, 25, 1570], r: [0.8, 1.3, 1.0] }] },
  lc: { name: 'locus coeruleus (A6)', color: 0x2f6fd0, shapes: [{ pts: [[5.6, 19.2, 1586.4], [4.6, 17, 1591], [3.7, 15.1, 1596], [3.1, 13.6, 1600.4]], r: [0.9, 1.1, 1.1, 0.9] }] },
  barr: { name: 'nucleo di Barrington', color: 0x8a9a3a, shapes: [{ c: [2.3, 14.9, 1594], r: [0.7, 1.3, 0.7] }] },
  ppn: { name: 'nucleo peduncolo-pontino (Ch5)', color: 0x7a4fd0, shapes: [{ pts: [[6.8, 5.5, 1604.4], [6.6, 7.3, 1601], [6.1, 9.3, 1597.2], [5.7, 10.8, 1594.4]], r: [1.2, 1.4, 1.3, 1.0] }] },
  ldt: { name: 'area tegmentale laterale dorsale (Ch6)', color: 0xb08ae8, shapes: [{ c: [2.9, 11.6, 1602.4], r: [0.9, 2.2, 0.9] }] },
  parabr: { name: 'nucleo parabrachiale', color: 0xd98a86, shapes: [{ pts: [[9.8, 19.5, 1591], [8.8, 16.5, 1595.5], [7.8, 13.4, 1599.6]], r: 1.0 }] },
  a7: { name: 'nucleo del lemnisco laterale (A7)', color: 0x2f9a57, shapes: [{ c: [10.8, 10.6, 1597], r: [1, 1.6, 1] }] },
  a5: { name: 'nucleo paragiganto-cellulare (A5)', color: 0x3fae6b, shapes: [{ c: [7.2, 9.6, 1582.6], r: [1, 2.2, 1] }] },
  a1: { name: 'A1/C1 (rostral ventrolateral medulla)', color: 0x7fcb98, shapes: [{ pts: [[8.6, 19.8, 1568], [9.1, 18.7, 1572], [9.3, 17.3, 1576]], r: 1.0 }] },
  // porzione mesencefalica: gruppi dopaminergici
  a8: { name: 'A8 (nucleo retro-rubrale)', color: 0xc070a0, shapes: [{ c: [9, 5.6, 1603], r: [1.5, 1.6, 1.5] }] },
  snc: { name: 'sostanza nera, pars compacta (A9)', color: 0x54463c, shapes: [{ c: [9, 2.9, 1609], r: [3.3, 5.2, 0.8], dir: [0.57, 0.82] }] },
  snr: { name: 'sostanza nera, pars reticulata', color: 0x9a7b5a, shapes: [{ c: [9.5, 0.9, 1609], r: [3.6, 5.4, 0.8], dir: [0.57, 0.82] }] },
  vta: { name: 'area ventro-tegmentale (A10)', color: 0xb0407a, shapes: [{ c: [1.5, -1, 1605.6], r: [1.0, 2.6, 1.3] }] },
  // stazioni pre-cerebellari
  lrn: { name: 'nucleo reticolare laterale', color: 0xa58a6a, shapes: [{ c: [6.2, 20.2, 1562], r: [1, 2.2, 1] }] },
  pmrn: { name: 'nucleo paramediano', color: 0xb89a70, shapes: [{ c: [1.6, 18.9, 1570.6], r: [0.7, 2, 0.7] }] },
  rtn: { name: 'nucleo della calotta pontina', color: 0x8f7658, shapes: [{ c: [2.4, 6.1, 1590.6], r: [1.8, 2.5, 1.0] }] },
  // talamo
  intralam: { name: 'nuclei talamici aspecifici (intralaminari)', color: 0x6a8fd8, shapes: [{ c: [8, 8, 1626], r: [1.3, 5, 6.5] }] },
};

const GREEN = 0x1f9d57, RED = 0xd43d3d, BLUE = 0x2f6fe0, VIOLET = 0x7a4fd0, AMBER = 0xd98a1a;
// Vie: [id, punti in mm (lato destro), opzioni, anche a sinistra?]. Uniscono
// origine e bersaglio lungo un decorso plausibile: non sono fasci misurati.
const LINKS = [
  // ascendenti
  ['srt', [[5.6, 22.6, 1512], [6, 27.6, 1532], [6.4, 24.5, 1552], [4.8, 20, 1565], [3.6, 16.6, 1571]], { color: GREEN }, true],
  ['retUp', [[3.3, 15, 1575], [3.4, 12.4, 1584], [3.2, 9.8, 1592], [3.4, 8.6, 1598]], { color: GREEN }, true],
  ['retThal', [[3.4, 8.6, 1599], [4.2, 7, 1606], [5.6, 6.2, 1613], [7, 7, 1620], [8, 8, 1625]], { color: GREEN }, true],
  ['tcF', [[8, 5, 1630], [12, -12, 1646], [17, -34, 1664], [20, -50, 1672]], { color: GREEN }, true],
  ['tcC', [[8.4, 8, 1632], [13, 8, 1650], [20, 8, 1672], [25, 8, 1688]], { color: GREEN }, true],
  ['tcP', [[8, 11, 1630], [12, 28, 1646], [18, 48, 1664], [22, 62, 1674]], { color: GREEN }, true],
  ['spb', [[6.4, 23, 1512], [6.8, 28, 1534], [8.4, 23.5, 1560], [9.8, 21, 1580], [9.8, 19.8, 1590]], { color: AMBER }, false],
  ['pbAmy', [[8, 14, 1599], [10.5, 8, 1605], [16, -1, 1609], [24, -9, 1610.4]], { color: AMBER }, false],
  ['pbHyp', [[7.6, 13.4, 1600], [6.5, 6, 1607], [4.6, -3, 1612.5], [3.6, -10.5, 1614]], { color: AMBER }, false],
  ['rapheUp', [[0.8, 10, 1611], [2.6, 2, 1614], [4.6, -10, 1616], [6, -26, 1622], [8, -46, 1632], [10, -64, 1642]], { color: 0xb08a00 }, true],
  ['ppnStr', [[7, 5.4, 1605], [10.5, 2.5, 1612], [16, -2, 1621], [23, -8, 1629]], { color: VIOLET }, false],
  // discendenti
  ['corRet', [[14.5, -4.5, 1617], [11.5, -5.5, 1609], [6.5, -2.5, 1596], [4.6, 2, 1586], [2.9, 7.6, 1580]], { color: GREEN }, false],
  ['rsPont', [[3, 12.4, 1582], [1.7, 13.6, 1572], [1.5, 18, 1560], [1.5, 22.6, 1548], [1.5, 24.9, 1536], [1.5, 22.4, 1522], [1.6, 20.2, 1514], [2.9, 21.6, 1510]], { color: GREEN }, false],
  ['rsBulb', [[2.6, 10.4, 1575.4], [5.2, 15.4, 1567], [6.2, 21, 1556], [6.2, 26.6, 1540], [6.2, 24.6, 1526], [6.1, 22.6, 1517], [3.6, 22.3, 1513]], { color: RED, inhibit: true }, false],
  ['rsBulbX', [[2.2, 10.2, 1575], [-1.5, 13, 1570], [-5, 17.5, 1563], [-6.2, 22.5, 1553], [-6.2, 26.6, 1540], [-6.2, 24.6, 1526], [-6.1, 22.6, 1517], [-3.6, 22.3, 1513]], { color: RED, inhibit: true }, false],
  ['rapheSp', [[0.3, 10, 1579], [2.6, 16, 1568], [4.6, 24, 1555], [5.2, 30, 1540], [5.2, 28.6, 1526], [5, 26.6, 1517], [2.9, 25.6, 1513]], { color: 0xb08a00 }, true],
  ['ppnMag', [[5.8, 10.6, 1594.6], [4.8, 10.8, 1588], [3.4, 10.4, 1581.6]], { color: VIOLET }, false],
  ['snrPpn', [[9.4, 0.8, 1606], [8.6, 3, 1605.4], [7.4, 4.9, 1604.8]], { color: RED, inhibit: true, r: 0.003 }, false],
  ['ppnLc', [[5.4, 10.6, 1596.4], [4.4, 12.6, 1597.4], [4, 14.2, 1596.6]], { color: RED, inhibit: true, r: 0.0026 }, false],
  ['lcPpn', [[4.4, 16.4, 1592.4], [5.6, 14, 1592.6], [5.9, 11.6, 1593.6]], { color: RED, inhibit: true, r: 0.0026 }, false],
  // dalle stazioni pre-cerebellari al cervelletto
  ['lrnCb', [[6.6, 20.6, 1563], [11, 26, 1570], [17, 35, 1575], [22, 46, 1577]], { color: BLUE }, false],
  ['pmCb', [[1.7, 19.4, 1571.6], [3.5, 26, 1576], [2, 36, 1580], [0.5, 46, 1582]], { color: BLUE }, false],
  // la calotta pontina proietta al cervelletto con fibre crociate (Wikipedia, "Reticulotegmental nucleus")
  ['rtnCb', [[1.6, 6, 1590.6], [-8, 6, 1591], [-17, 14, 1591], [-21, 28, 1592], [-20, 42, 1593]], { color: BLUE }, false],
];

export class ReticularModel extends AnatomyModel {
  constructor() {
    super({ tilt: -0.42 });
    this.addStand({ radius: 0.2, z: -0.03, rod: [0, 0.018, 0.048, -0.061] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('formazione-reticolare.glb', REAL);
    for (const [id, n] of Object.entries(NUCLEI)) {
      const geos = n.shapes.map((s) => this.#shape(s));
      // prima il lato destro: è quello a cui si agganciano etichette e indicatori
      this.addPart(id, n.name, n.color, n.mid ? geos : [...geos, ...geos.map((g) => mirror(g))]);
    }
    // piano di sezione della decerebrazione, attraverso il mesencefalo
    const cut = new THREE.CylinderGeometry(24 * S, 24 * S, 0.5 * S, 48);
    const c = mm([0, 4.5, 1607.5]);
    cut.rotateX(0.24); // perpendicolare all'asse del tronco, inclinato in avanti
    cut.translate(c.x, c.y, c.z);
    this.addPart('cut', 'sezione del tronco encefalico (decerebrazione)', 0x3a3632, [cut], { opacity: 0.6, double: true });
    for (const [id, pts, opts, bilateral] of LINKS) {
      const o = { r: 0.0034, ...opts }; // più sottili del normale: il tronco è piccolo
      this.addLink(id, pts.map(mm), o);
      if (bilateral) this.addLink(`${id}L`, pts.map(([l, y, z]) => mm([-l, y, z])), o);
    }
  }

  #shape(s) {
    if (s.pts) return taperTube(s.pts.map(mm), scaled(s.r), { flat: s.flatx ? { x: s.flatx } : null, radial: 16 });
    // rotazione attorno alla verticale: porta il primo semiasse lungo `dir`
    const rot = s.dir ? [0, Math.atan2(s.dir[1], s.dir[0]), 0] : null;
    const g = ellipsoid([0, 0, 0], scaled(s.r), rot);
    const p = mm(s.c);
    g.translate(p.x, p.y, p.z);
    return g;
  }
}
