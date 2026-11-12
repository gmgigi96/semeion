// Modello del sistema nervoso vegetativo: dal mesencefalo al coccige.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/sistema-nervoso-vegetativo.glb,
// manifesto in meshes/sistema-nervoso-vegetativo.json):
//   - mesencefalo, ponte, bulbo; nucleo accessorio dell'oculomotore (Edinger-Westphal),
//     nuclei salivatori superiore e inferiore, nucleo ambiguo, nucleo posteriore
//     (motore dorsale) del vago;
//   - midollo spinale (sostanza bianca), corno anteriore, colonna intermedio-laterale:
//     l'oggetto Z-Anatomy «Intermediolateral nucleus» corre lungo tutto il midollo;
//     qui se ne tiene solo il tratto C8-L2 (quote 1455-1072 mm, scelte sulle radici
//     reali: vedi sotto); radici anteriori e posteriori, gangli spinali, primo
//     tratto dei nervi intercostali;
//   - colonna vertebrale da C1 al coccige, estremità posteriore delle coste
//     (testa e collo), ossa dell'anca, base del cranio con orbita e mandibola;
//   - bulbo oculare (sclera, iride), ghiandole lacrimale, parotide,
//     sottomandibolare e sottolinguale di destra;
//   - nervo oculomotore, nervo ottico, glossofaringeo (fino a sotto la base
//     cranica), tratto extracranico della corda del timpano e nervo linguale di
//     destra; nervo vago dei due lati fino a metà collo;
//   - aorta (arco, toracica, addominale), tronco celiaco, origine della
//     mesenterica superiore, mesenterica inferiore, arterie renali, iliache,
//     carotidi, succlavie; cuore, polmoni, trachea e bronchi principali, esofago,
//     stomaco, reni, surreni, vescica, sigma-retto.
// I tubi dei nervi reali (raggio 0,2-0,5 mm) sono ingrossati lungo le normali.
//
// LIVELLI. Gli oggetti «Anterior/Posterior root of spinal nerve» e «Spinal
// ganglion» hanno 21 radici per lato: confrontate con i fori intervertebrali
// dello scheletro reale sono C2-C8, T1-T12, L1, L2 (la prima esce tra atlante ed
// epistrofeo, l'ultima tra L2 e L3). Su queste sono fissati i limiti C8-L2 della
// colonna intermedio-laterale e l'origine dei rami comunicanti. Nel midollo di
// Z-Anatomy ogni segmento sta all'altezza della propria vertebra e il cono
// termina tra L2 e L3: i segmenti sacrali sono quindi collocati nell'ultimo
// tratto del cono (stimato).
//
// PERCHÉ LA CATENA DEL SIMPATICO È RICOSTRUITA. Gli oggetti «Sympathetic trunk»
// e «Ganglia of sympathetic trunk» di Z-Anatomy vanno solo da C3 a T12, nel
// collo corrono a 5 mm dalla linea mediana davanti ai corpi vertebrali, nel
// torace attraversano le teste delle coste, e i gangli sono sferette di 2 mm.
// Non sono usati.
//
// RICOSTRUITI A MANO sulle mesh reali, in mm nella terna Z-Anatomy (le distanze
// da vertebre, coste, vasi e visceri reali sono state controllate numericamente):
//   - catena limitante dei due lati, dalla base cranica al coccige: ganglio
//     cervicale superiore (fuso, 28 mm, davanti a C2-C3 e dietro la carotide
//     interna reale), medio (davanti a C6), stellato (davanti al collo della prima
//     costa reale), gangli toracici T2-T12 sulla faccia anteriore della testa
//     della costa corrispondente, quattro gangli lombari sul fianco antero-laterale
//     dei corpi vertebrali, quattro sacrali sulla faccia anteriore del sacro
//     medialmente ai fori, ganglio impari davanti al coccige (rapporti
//     verificati sulle fonti; coordinate ricavate dalle mesh ossee); ansa
//     succlavia attorno alla succlavia destra reale (solo a destra);
//   - rami comunicanti bianchi e grigi da T1 a L2, tra il nervo spinale reale
//     subito fuori dal foro e il ganglio: il bianco più laterale (più lontano dal
//     foro), il grigio più mediale (disposizione verificata; i rami grigi degli
//     altri livelli non sono disegnati);
//   - nervi splancnici grande (radici dai gangli T5-T9, come nelle fonti lette;
//     gli appunti dicono T5-T10), piccolo (T10-T11), minimo (T12) e lombari
//     (L1-L2), lungo i fianchi dei corpi vertebrali reali (decorso verificato,
//     coordinate stimate; il diaframma non è nel modello);
//   - gangli prevertebrali attorno all'aorta reale: celiaci (semilunari, ai lati
//     del tronco celiaco reale), mesenterico superiore (all'origine dell'arteria
//     reale), aortico-renali (sopra l'origine delle arterie renali reali),
//     mesenterico inferiore (all'origine dell'arteria reale); raggi del plesso
//     celiaco (schematici); plesso intermesenterico sui fianchi dell'aorta,
//     plesso ipogastrico superiore davanti alla biforcazione aortica, a L5 e al
//     promontorio, tra le iliache comuni reali; nervi ipogastrici, mediali alle
//     iliache interne reali; plesso ipogastrico inferiore (pelvico) come lamina
//     sagittale a lato del retto e dietro la vescica reali; nervi splancnici
//     pelvici da S2-S4 (posizione verificata, forma e coordinate stimate);
//   - parasimpatico cranico di destra: radice breve, ganglio ciliare (laterale
//     al nervo ottico reale, nel terzo posteriore dell'orbita) e nervi ciliari
//     brevi fino alla sclera reale; nucleo lacrimatorio (sopra il salivatorio
//     superiore reale), nervo intermedio, ganglio genicolato, nervo grande
//     petroso e nervo vidiano, ganglio sfeno-palatino, ramo per la ghiandola
//     lacrimale; tratto intrapetroso della corda del timpano, ganglio
//     sottomandibolare appeso al nervo linguale reale; nervo timpanico e
//     piccolo petroso, ganglio otico, fibre per la parotide. Le coordinate di
//     ganglio genicolato, sfeno-palatino, sottomandibolare e otico, del nervo
//     intermedio, del grande petroso e della corda sono quelle già usate nei
//     modelli «nervo-faciale» e «nervo-trigemino» di questo libro (stessa terna);
//   - plesso pericarotideo interno: un cordone dal ganglio cervicale superiore
//     lungo la carotide interna reale fino al ganglio ciliare (schematico);
//   - nervo vago sotto metà collo, plessi polmonari, tronchi vagali e rami
//     gastrici: coordinate del modello «nervo-vago» di questo libro; ramo celiaco
//     dal tronco posteriore al ganglio celiaco destro (stimato);
//   - nervi cardiaci del simpatico (solo a destra) e rami polmonari dai gangli
//     T3-T4 (solo a destra), plesso cardiaco (schematici);
//   - neuroni parasimpatici sacrali nel cono midollare (stimati).
//
// FONTI LETTE (Wikipedia in inglese, testo degli articoli via API):
//   - «Sympathetic trunk», https://en.wikipedia.org/wiki/Sympathetic_trunk
//     (dalla base cranica al coccige, lateralmente ai corpi vertebrali; nel collo
//     dietro la guaina carotidea; plesso sulla carotide interna; ganglio impari)
//   - «Superior cervical ganglion», https://en.wikipedia.org/wiki/Superior_cervical_ganglion
//     (fuso di circa 3 cm davanti a C2-C3, dietro la guaina carotidea, davanti al lungo della testa)
//   - «Middle cervical ganglion», https://en.wikipedia.org/wiki/Middle_cervical_ganglion (livello di C6)
//   - «Stellate ganglion», https://en.wikipedia.org/wiki/Stellate_ganglion
//     (davanti al processo trasverso di C7 e al collo della prima costa; 10-12 x 8-20 mm)
//   - «Subclavian loop», https://en.wikipedia.org/wiki/Subclavian_loop
//   - «Thoracic ganglia», «Lumbar ganglia», «Sacral ganglia», «Ganglion impar»
//     (https://en.wikipedia.org/wiki/Thoracic_ganglia, …/Lumbar_ganglia, …/Sacral_ganglia, …/Ganglion_impar:
//     quattro gangli lombari, quattro o cinque sacrali mediali ai fori sacrali anteriori)
//   - «Ramus communicans», «White ramus communicans»
//     (https://en.wikipedia.org/wiki/Ramus_communicans, …/White_ramus_communicans:
//     bianchi solo T1-L2, il bianco più lontano dal foro intervertebrale)
//   - «Lateral grey column», https://en.wikipedia.org/wiki/Lateral_grey_column
//   - «Thoracic splanchnic nerves», «Lumbar splanchnic nerves», «Aorticorenal ganglion»
//     (https://en.wikipedia.org/wiki/Thoracic_splanchnic_nerves, …/Lumbar_splanchnic_nerves, …/Aorticorenal_ganglion:
//     grande T5-T9 al celiaco, piccolo T10-T11, minimo T12, lombari al mesenterico inferiore)
//   - «Celiac ganglia», «Superior mesenteric ganglion», «Inferior mesenteric ganglion», «Prevertebral ganglia»
//     (https://en.wikipedia.org/wiki/Celiac_ganglia, …/Superior_mesenteric_ganglion, …/Inferior_mesenteric_ganglion, …/Prevertebral_ganglia)
//   - «Superior hypogastric plexus», «Inferior hypogastric plexus», «Pelvic splanchnic nerves»
//     (https://en.wikipedia.org/wiki/Superior_hypogastric_plexus, …/Inferior_hypogastric_plexus, …/Pelvic_splanchnic_nerves)
//   - «Ciliary ganglion», «Pterygopalatine ganglion», «Otic ganglion», «Submandibular ganglion», «Lesser petrosal nerve»
//     (https://en.wikipedia.org/wiki/Ciliary_ganglion, …/Pterygopalatine_ganglion, …/Otic_ganglion, …/Submandibular_ganglion, …/Lesser_petrosal_nerve)
// Non lette: StatPearls/NCBI, Radiopaedia, Gray, TeachMeAnatomy, Kenhub. Calibri di
// nervi e gangli (tranne cervicale superiore e stellato) e tutte le coordinate
// delle parti ricostruite sono stime.
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

// Da millimetri Z-Anatomy (`a` verso destra, `b` verso dietro, `h` verso l'alto)
// alle coordinate del modello; stessa terna del manifesto.
const S = 0.00092, OY = 20, OZ = 795;
const mm = (a, b, h) => V(a * S, (h - OZ) * S, -(b - OY) * S);
const tube = (pts, r, opts) =>
  taperTube(pts.map((p) => (p.isVector3 ? p : mm(...p))), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 8, seg: Math.max(12, pts.length * 6), ...opts });
const ball = ([a, b, h], [ra, rb, rh]) => {
  const c = mm(a, b, h);
  return ellipsoid([c.x, c.y, c.z], [ra * S, rh * S, rb * S], null, 14);
};
const flip = (pts) => pts.map(([a, b, h]) => [-a, b, h]);

const BONE = 0xe9dfc8, STEM = 0xe3cdb6, ARTERY = 0xc9485b, GLAND = 0xd9a56a;
const SYM = 0xe07b39, SYM_G = 0xc7402a, PRE_G = 0x8e2f3c, WHITE = 0xf2d34a, GREY = 0x8d8a94, SPL = 0xd99a2b;
const PARA = 0x2f6fe0, PARA_G = 0x1f3f9a, PARA_POST = 0x5fb0ea, VAGUS = 0x3f8fd6;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.26 }],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.22 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.26 }],
  nucEW: ['nucleo accessorio di Edinger e Westphal', 0x2f6fe0],
  nucSalSup: ['nucleo salivatorio superiore', 0x2f9a8a],
  nucSalInf: ['nucleo salivatorio inferiore', 0x7a4fd0],
  nucAmb: ['nucleo ambiguo', 0x3f8fd6],
  nucDors: ['nucleo dorsale motore del vago', 0x1f55b5],
  cord: ['midollo spinale', 0xf1e8d2, { ghost: true, opacity: 0.3 }],
  hornAnt: ['corno anteriore', 0xb9a79a],
  iml: ['colonna intermedio-laterale (C8-L2)', 0xd43d3d],
  rootAnt: ['radici ventrali', 0xe6c84a],
  rootPost: ['radici dorsali', 0xc9b98a],
  drg: ['gangli spinali', 0xb89a5a],
  icn: ['nervi spinali (intercostali)', 0xcbb489],
  spineC: ['colonna cervicale', BONE],
  spineT: ['colonna toracica', BONE],
  spineL: ['colonna lombare', BONE],
  sacrum: ['sacro e coccige', BONE],
  ribs: ['coste (testa e collo)', 0xe2d6bb],
  hip: ["ossa dell'anca", BONE, { ghost: true, opacity: 0.1 }],
  skull: ['cranio', BONE, { ghost: true, opacity: 0.09 }],
  sclera: ['bulbo oculare', 0xf1ece2],
  iris: ['iride', 0x5a7fa8],
  lacrimal: ['ghiandola lacrimale', 0x7fbfe0],
  parotid: ['ghiandola parotide', GLAND],
  submandibular: ['ghiandola sottomandibolare', GLAND],
  sublingual: ['ghiandola sottolinguale', 0xe0b47a],
  nIII: ['nervo oculomotore (III)', PARA],
  optic: ['nervo ottico', 0xd9d2b8],
  nIX: ['nervo glossofaringeo (IX)', 0x7a4fd0],
  lingual: ['nervo linguale', 0xcdb86a],
  aortaArch: ['arco aortico', ARTERY],
  aortaThor: ['aorta toracica', ARTERY],
  aortaAbd: ['aorta addominale', ARTERY],
  celiacTrunk: ['tronco celiaco', 0xd9655a],
  sma: ['arteria mesenterica superiore', 0xd9655a],
  ima: ['arteria mesenterica inferiore', 0xd9655a],
  renalA: ['arterie renali', 0xd9655a],
  iliac: ['arterie iliache', ARTERY],
  carotid: ['arterie carotidi', ARTERY],
  subclavian: ['arterie succlavie', 0xd9655a],
  heart: ['cuore', 0xb5474a],
  lungs: ['polmoni', 0xd9a3a8, { ghost: true, opacity: 0.08 }],
  trachea: ['trachea e bronchi principali', 0xcfdfe2],
  oesophagus: ['esofago', 0xd99a86],
  stomach: ['stomaco', 0xe3b3a0, { double: true }],
  kidney: ['reni', 0x9a5a4a],
  adrenal: ['surreni', 0xe0b040],
  bladder: ['vescica', 0xd9c27a],
  rectum: ['colon pelvico e retto', 0xc98f7d],
  vagHiR: ['nervo vago destro', VAGUS],
  vagHiL: ['nervo vago sinistro', VAGUS],
  chorda: ['corda del timpano', 0x2f9a8a],
};

// Di quanti mm ingrossare le mesh reali più sottili.
const INFLATE = { nIII: 0.5, nIX: 0.5, chorda: 0.35, lingual: 0.4, vagHiR: 1.1, vagHiL: 1.1, rootAnt: 0.3, rootPost: 0.3, icn: 0.45, iml: 0.3,
  nucEW: 0.3, nucSalSup: 0.35, nucSalInf: 0.35, nucAmb: 0.3, nucDors: 0.3 };

// Gangli della catena di destra (centri, mm) e asse del tronco: ricavati dalle
// mesh di coste e vertebre (vedi intestazione).
const G = { SCG: [29, 5.5, 1516], MCG: [20, 1, 1463], ST: [23, 16, 1438], T2: [20.7, 24.6, 1420.2], T3: [20.9, 33.8, 1403], T4: [19.8, 37.4, 1378.8], T5: [19.6, 49.1, 1354.3],
  T6: [20.1, 51.2, 1329.9], T7: [20.9, 56, 1302.3], T8: [21.2, 54.2, 1274.9], T9: [22.2, 44.9, 1246.4], T10: [22.9, 38.9, 1216.7], T11: [24.3, 34.4, 1179.2], T12: [23.6, 21.7, 1140.9],
  L1: [20.7, -4.3, 1118], L2: [19.5, -9.4, 1085], L3: [18.8, -11.3, 1048], L4: [19, -10.1, 1012], S1: [13, 25.3, 934], S2: [12, 46.9, 922], S3: [10, 62.8, 912], S4: [8, 68.3, 899], IMP: [0, 72.2, 864] };
const TRUNK = {
  C: [[27.5, 3, 1545], [28.5, 4.5, 1532], G.SCG, [27, 5, 1498], [23, 3, 1480], G.MCG, [20.5, 5, 1452], G.ST],
  T: [G.ST, G.T2, G.T3, G.T4, G.T5, G.T6, G.T7, G.T8, G.T9, G.T10, G.T11, G.T12],
  L: [G.T12, [24, 12, 1132], G.L1, G.L2, G.L3, G.L4, [20, -8, 990], [19, -3, 968], [16, 4.1, 950], G.S1],
  S: [G.S1, G.S2, G.S3, G.S4, [5, 73.8, 888], [2.5, 74.1, 876], G.IMP],
};
// Rami comunicanti di destra: livello -> [bianco, grigio], dal nervo spinale al ganglio.
const RAMI = { T1: [[[21.2, 33.2, 1433], [22.7, 29.1, 1432.9], [24.2, 24.9, 1432.7], [24.2, 20.7, 1434.1], [24.2, 16.5, 1435.5]], [[18.7, 33.2, 1434.5], [19.6, 29.1, 1436.5], [20.5, 25, 1438.5], [21.5, 20.9, 1439], [22.4, 16.8, 1439.5]]],
  T2: [[[21, 42.3, 1415.7], [22, 38, 1415.5], [23, 33.7, 1415.2], [22.4, 29.4, 1416.5], [21.9, 25.1, 1417.7]], [[18.5, 42.3, 1417.2], [18.9, 38, 1419.1], [21.3, 33.2, 1421], [19.7, 29.6, 1421.3], [20.1, 25.4, 1421.7]]],
  T3: [[[20.9, 52.6, 1395.9], [22, 48, 1396.3], [23, 43.4, 1396.7], [22.6, 38.9, 1398.6], [22.1, 34.3, 1400.5]], [[18.4, 52.6, 1397.4], [18.9, 48.1, 1399.9], [20.4, 43.3, 1402.4], [21.2, 37.7, 1403.5], [20.3, 34.6, 1404.5]]],
  T4: [[[19.6, 61.1, 1373], [20.7, 55.3, 1373.1], [21.8, 49.5, 1373.2], [21.4, 43.7, 1374.7], [21, 37.9, 1376.3]], [[17.1, 61.1, 1374.5], [17.6, 55.4, 1376.7], [18.1, 49.7, 1378.9], [18.7, 43.9, 1379.6], [19.2, 38.2, 1380.3]]],
  T5: [[[21.5, 66.7, 1346.7], [22.1, 62.5, 1347.2], [22.7, 58.2, 1347.7], [21.7, 53.9, 1349.8], [20.8, 49.6, 1351.8]], [[19, 66.7, 1348.2], [19, 62.5, 1350.8], [20, 58, 1353.5], [20.4, 52.7, 1354.6], [19, 49.9, 1355.8]]],
  T6: [[[21.4, 70.3, 1320.4], [22.1, 65.7, 1321.4], [22.8, 61, 1322.4], [22.1, 56.4, 1324.9], [21.3, 51.7, 1327.4]], [[18.9, 70.3, 1321.9], [19, 65.8, 1325.1], [19.7, 61, 1328.2], [19.3, 56.6, 1329.8], [19.5, 52, 1331.4]]],
  T7: [[[21, 71.2, 1289.2], [22, 67.5, 1291.1], [23.1, 63.8, 1293], [22.6, 60.2, 1296.4], [22.1, 56.5, 1299.8]], [[18.5, 71.2, 1290.7], [19, 67.6, 1294.8], [19.4, 64, 1298.8], [21.6, 58.6, 1301.3], [20.3, 56.8, 1303.8]]],
  T8: [[[20.2, 67.1, 1258.9], [21.5, 64, 1261.5], [22.8, 60.9, 1264.1], [22.6, 57.8, 1268.3], [22.4, 54.7, 1272.4]], [[17.7, 67.1, 1260.4], [18.4, 64.1, 1265.1], [19.1, 61.1, 1269.9], [19.9, 58, 1273.1], [20.6, 55, 1276.4]]],
  T9: [[[19.6, 62.3, 1230.3], [21.3, 58, 1232.9], [23, 53.8, 1235.6], [23.2, 49.6, 1239.7], [23.4, 45.4, 1243.9]], [[17.1, 62.3, 1231.8], [18.3, 58.1, 1236.5], [19.4, 54, 1241.3], [22.6, 47.7, 1244.6], [21.6, 45.7, 1247.9]]],
  T10: [[[22.5, 56.9, 1198.7], [23.6, 52.5, 1201.8], [24.8, 48.1, 1205], [24.4, 43.8, 1209.6], [24.1, 39.4, 1214.2]], [[20, 56.9, 1200.2], [20.6, 52.6, 1205.5], [21.1, 48.3, 1210.7], [23.8, 41.9, 1214.5], [22.3, 39.7, 1218.2]]],
  T11: [[[20.1, 48.6, 1168.2], [22.2, 45.2, 1169.6], [24.3, 41.7, 1171], [24.9, 38.3, 1173.8], [25.5, 34.9, 1176.7]], [[17.6, 48.6, 1169.7], [19.1, 45.2, 1173.2], [22.6, 41.3, 1176.7], [23.2, 37.5, 1178.7], [23.7, 35.2, 1180.7]]],
  T12: [[[21.4, 36.7, 1131.7], [23, 33.1, 1132.6], [24.6, 29.5, 1133.5], [24.7, 25.8, 1136], [24.8, 22.2, 1138.4]], [[18.9, 36.7, 1133.2], [19.9, 33.2, 1136.2], [20.9, 29.6, 1139.3], [24.4, 23.6, 1140.8], [23, 22.5, 1142.4]]],
  L1: [[[18.8, 26.7, 1099], [20.8, 18.9, 1102.3], [21.8, 11.4, 1105.7], [21.9, 3.8, 1110.6], [21.9, -3.8, 1115.5]], [[16.3, 26.7, 1100.5], [17.2, 19.1, 1106], [18.2, 11.6, 1111.5], [19.1, 4, 1115.5], [20.1, -3.5, 1119.5]]],
  L2: [[[21.5, 23, 1067.6], [22.1, 15, 1070.6], [22.6, 7, 1073.6], [21.7, -0.9, 1078], [20.7, -8.9, 1082.5]], [[19, 23, 1069.1], [19, 15.1, 1074.2], [19, 7.2, 1079.3], [18.9, -0.7, 1082.9], [18.9, -8.6, 1086.5]]] };

// Decorsi ricostruiti: nome -> [punti in mm, raggio in mm].
const PATHS = /*PATHS*/{
 "ansa": [[[20.3, 0.5, 1461], [25.5, 1, 1446], [29.5, -4.5, 1428], [31, -4.8, 1419], [31, -1, 1412], [30, 5, 1413.5], [27, 11, 1424], [23.6, 15, 1434]], 0.7],
 "grMain": [[[19.6, 49.1, 1354.3], [16.5, 44.5, 1342], [14.5, 41.5, 1328], [14.5, 40.8, 1312], [16, 39, 1296], [16, 36, 1278], [16, 32, 1262], [17.5, 28.3, 1245], [18, 25, 1230], [17.5, 21.8, 1214], [18, 17, 1198], [18, 12.5, 1182], [18.5, 7, 1166], [18, 2, 1152], [15.5, -8, 1146], [13.5, -16, 1143.5], [13, -20, 1142]], 1.1],
 "gr6": [[[20.1, 51.2, 1329.9], [17.5, 46, 1318], [15, 41.5, 1306], [16, 39, 1296]], 0.7],
 "gr7": [[[20.9, 56, 1302.3], [18.5, 48, 1290], [16.2, 39, 1280], [16, 34, 1270]], 0.7],
 "gr8": [[[21.2, 54.2, 1274.9], [19.5, 45, 1262], [17.8, 33, 1250], [17.8, 26.5, 1237]], 0.7],
 "gr9": [[[22.2, 44.9, 1246.4], [20.5, 36, 1236], [18.5, 27, 1226], [17.6, 22.5, 1217]], 0.7],
 "leMain": [[[22.9, 38.9, 1216.7], [21.8, 30, 1204], [21, 22, 1190], [21.5, 15, 1170], [21.5, 8, 1155], [19, -2, 1142], [13, -13, 1133], [6, -24, 1130], [-1, -29.5, 1131.3]], 0.9],
 "le11": [[[24.3, 34.4, 1179.2], [23, 25, 1173], [21.6, 14, 1167]], 0.7],
 "least": [[[23.6, 21.7, 1140.9], [23.5, 10, 1134], [19.5, -4, 1129], [12.5, -13, 1127], [7.5, -18, 1126]], 0.7],
 "lumb1": [[[20.7, -4.3, 1118], [18, -14, 1100], [11, -27, 1080], [4, -36.5, 1066], [-5.5, -40.3, 1059]], 0.8],
 "lumb2": [[[19.5, -9.4, 1085], [14.5, -22, 1076], [7, -33, 1069]], 0.7],
 "grMainL": [[[-19.6, 49.1, 1354.3], [-16.5, 44.5, 1342], [-15, 41.5, 1328], [-16, 41, 1312], [-19, 40.5, 1296], [-20.5, 38, 1278], [-21, 34, 1262], [-21.5, 30, 1245], [-21.5, 26.5, 1230], [-21, 22.5, 1214], [-20.5, 17, 1198], [-20, 12.5, 1182], [-20, 7, 1166], [-21, 2, 1152], [-25, -8, 1146], [-28.5, -15, 1143.5], [-30, -19, 1142]], 1.1],
 "gr6L": [[[-20.1, 51.2, 1329.9], [-18.5, 46.5, 1318], [-18, 42.5, 1306], [-19, 40.5, 1296]], 0.7],
 "gr7L": [[[-20.9, 56, 1302.3], [-20.5, 48, 1290], [-20.5, 41, 1280], [-20.8, 36, 1270]], 0.7],
 "gr8L": [[[-21.2, 54.2, 1274.9], [-21.5, 45, 1262], [-21.6, 35, 1250], [-21.5, 28, 1237]], 0.7],
 "gr9L": [[[-22.2, 44.9, 1246.4], [-22, 36, 1236], [-21.5, 28, 1226], [-21, 23, 1217]], 0.7],
 "leMainL": [[[-22.9, 38.9, 1216.7], [-23.5, 30, 1204], [-23.5, 22, 1190], [-23.5, 15, 1170], [-23.5, 8, 1155], [-24, -4, 1142], [-21.5, -16, 1134], [-16.5, -26, 1131.5], [-11, -30, 1131.3]], 0.9],
 "le11L": [[[-24.3, 34.4, 1179.2], [-24, 25, 1173], [-23.5, 14, 1167]], 0.7],
 "leastL": [[[-23.6, 21.7, 1140.9], [-24.5, 10, 1134], [-25.5, -4, 1129], [-24, -13, 1127], [-22.5, -17.5, 1126.3]], 0.7],
 "lumb1L": [[[-20.7, -4.3, 1118], [-21.5, -14, 1100], [-20.5, -27, 1080], [-15, -37, 1066], [-10.5, -40.3, 1059]], 0.8],
 "lumb2L": [[[-19.5, -9.4, 1085], [-20.5, -22, 1076], [-18, -33, 1069]], 0.7],
 "celR": [[[13.5, -20, 1142.5], [11.5, -21.5, 1137.5], [7.5, -22.3, 1135.5], [4, -22.3, 1138], [3, -21.8, 1142.5]], 3.2],
 "celL": [[[-30.5, -19, 1142.5], [-28.5, -20.5, 1137.5], [-25, -21.5, 1135.5], [-21.5, -22, 1138], [-20.5, -22, 1142.5]], 3.2],
 "celBridge": [[[3.5, -22.5, 1137.5], [-3, -28.5, 1134.3], [-9, -29.8, 1133.8], [-16, -27.5, 1134.5], [-21.5, -22.5, 1137.5]], 0.9],
 "solar1": [[[7, -23, 1136], [5, -27, 1143], [1, -31, 1150]], 0.6],
 "solar2": [[[8, -23, 1135], [10, -28, 1130], [12, -33, 1124]], 0.6],
 "solar3": [[[11, -22.5, 1137], [16, -26, 1136], [21, -28, 1134]], 0.6],
 "solar4": [[[-25, -22.5, 1136], [-21, -28, 1143], [-17, -32, 1151]], 0.6],
 "solar5": [[[-26, -22.5, 1135], [-29, -28, 1130], [-32, -33, 1124]], 0.6],
 "solar6": [[[-28.5, -21.5, 1137], [-33, -25, 1137], [-38, -27, 1139]], 0.6],
 "interm1": [[[-10.5, -31.5, 1129], [-14, -29.5, 1112], [-14.3, -33.5, 1092], [-13.2, -36.5, 1074], [-10, -40.3, 1060.5]], 0.8],
 "interm2": [[[-2, -31, 1129], [2, -28, 1112], [2, -32.5, 1092], [0.5, -36.5, 1074], [-5.5, -40.3, 1060.5]], 0.8],
 "hypoSup1": [[[-9.5, -41.5, 1055], [-8.5, -43.5, 1040], [-7.5, -43.5, 1026], [-5.5, -41, 1014], [-4.2, -34, 1004], [-3.2, -24.5, 994], [-2.6, -18, 982], [-1.8, -15, 970], [-0.8, -11.5, 960]], 1.4],
 "hypoSup2": [[[-6, -41.5, 1055], [-4.5, -43.5, 1040], [-3.5, -43.5, 1026], [-2, -41.3, 1014], [-1.5, -34.3, 1004], [-0.5, -24.5, 994], [0.2, -18, 982], [0.6, -15, 970], [0.8, -11.5, 960]], 1.4],
 "nHypoR": [[[0.8, -11.5, 960], [5, -5.5, 952], [11, 2.5, 943], [17, 15, 929], [23, 29, 909], [27, 41, 889], [29.3, 47.5, 874]], 1.3],
 "nHypoL": [[[-0.8, -11.5, 960], [-5, -5.5, 952], [-11, 2.5, 943], [-18, 15, 929], [-26, 29, 909], [-31, 41, 889], [-32, 47.5, 874]], 1.3],
 "pelv2": [[[21, 43, 921], [27.5, 45, 900], [29, 48.5, 878], [29.5, 49.5, 870]], 0.8],
 "pelv3": [[[19, 63, 910], [27, 57.5, 893], [29, 53.5, 876], [29.5, 52, 869]], 0.8],
 "pelv4": [[[17, 70, 899], [23, 63.5, 884], [28, 57, 871], [29.5, 55, 866]], 0.8],
 "pelvVes": [[[29.5, 44, 862], [27.5, 31, 857], [23, 20, 853]], 0.7],
 "pelvRet": [[[29.5, 55, 859], [25, 57, 850], [19, 56, 842]], 0.7],
 "carot": [[[28.5, 4.5, 1532], [28.8, 2.8, 1543], [27.8, 1.5, 1552], [26.3, 2.6, 1560], [25, 3.8, 1567], [21.5, -2.5, 1577.2], [17.5, -14, 1581.5], [15.6, -21.5, 1588.5], [15.6, -25.8, 1596], [14, -25.5, 1603.2], [15.2, -31, 1602.3], [18.8, -37, 1601.3], [23.3, -41, 1598.5], [26.4, -43.2, 1596.2]], 0.55],
 "radBreve": [[[25.2, -44.2, 1588.5], [26.3, -44.2, 1591.5], [27, -44.1, 1594.2]], 0.45],
 "cil1": [[[27.6, -45.3, 1595.3], [31, -48.5, 1595.5], [34, -51.6, 1593.5]], 0.3],
 "cil2": [[[27.4, -45.4, 1595.3], [27, -48.5, 1595.3], [27.5, -51.5, 1594]], 0.3],
 "cil3": [[[27.6, -45.3, 1594.6], [31, -48.5, 1591], [33.5, -51.6, 1588]], 0.3],
 "cil4": [[[27.3, -45.3, 1594.6], [26.5, -48.5, 1591], [27.5, -51.6, 1588]], 0.3],
 "intermedio": [[[7, 12.3, 1578.6], [10.5, 13.6, 1577.8], [14.5, 13.2, 1577.6], [17.3, 11.6, 1578.2], [18.9, 8.2, 1579.8], [20.3, 6.3, 1581.6], [24.7, 3.7, 1581.8], [30.6, 2.5, 1580.9], [35.6, 2.1, 1581.8], [40, 0.7, 1583.3], [42.4, -0.5, 1584.6]], 0.5],
 "petroso": [[[42.4, -1.5, 1585], [40.8, -11.7, 1585.2], [36, -14, 1585], [28, -16.5, 1585.5], [21, -19, 1585], [17, -21, 1583.5], [15.5, -24, 1580.5], [15.5, -29, 1578.3], [17.2, -34.5, 1577.4], [19, -38, 1577.2]], 0.5],
 "postLacr": [[[20.5, -41, 1578.5], [27, -45, 1579], [36, -49, 1583], [43, -54, 1590], [46, -59, 1598], [45, -62, 1602]], 0.35],
 "corda": [[[42.9, -0.9, 1585], [45.5, 3.5, 1583.5], [46.2, 8.5, 1580.5], [45.8, 11.5, 1575.5], [46.6, 10.5, 1573.5], [48, 6, 1578], [48, 2.5, 1582], [47.5, 0.4, 1581.6], [44.6, -1.5, 1579], [40, -2.2, 1576.2], [35.8, -1.7, 1574.3], [33.5, -1.5, 1573.4], [31.6, -2.2, 1572.3]], 0.5],
 "postSm": [[[21, -35, 1517.5], [23, -38, 1515.5], [23.5, -41, 1514.5]], 0.35],
 "postSl": [[[19, -36, 1518], [16, -42, 1516.5], [14.5, -50, 1515.5], [13.5, -55, 1514.5]], 0.35],
 "timpanico": [[[33.5, 9.5, 1562], [36, 8.5, 1568], [40, 6.5, 1574], [43, 4.5, 1578.5], [43.8, 1, 1582.5], [44, -5, 1585], [41.5, -14.5, 1585.6], [34, -18.5, 1585], [27.5, -18.5, 1583], [23.5, -16.5, 1579.5], [21.3, -14.9, 1576.5]], 0.5],
 "postParot": [[[21.5, -14, 1575], [27, -9, 1573.5], [34, -5, 1571], [41, -5.5, 1568], [46, -10, 1563], [50, -15, 1557]], 0.35],
 "vagCel": [[[-9.5, -5.5, 1205], [-1, -12, 1185], [3, -17, 1165], [4.5, -20.5, 1148], [3.5, -21.5, 1143.5]], 0.9],
 "symCard1": [[[20, 1, 1462], [18.5, 4, 1440], [18, 6, 1418], [16.5, 2, 1400], [13.5, -5, 1387], [7.5, -5.5, 1379], [1, -3.2, 1373], [-1.5, -1.2, 1371]], 0.7],
 "symCard2": [[[23, 15, 1436], [20.5, 10.5, 1421], [17.8, 4.5, 1405], [16, 0, 1396]], 0.7],
 "symPulm1": [[[20.9, 33.8, 1403], [18.5, 29.5, 1382], [15.8, 25.5, 1364], [15, 24.5, 1359]], 0.7],
 "symPulm2": [[[19.8, 37.4, 1378.8], [17.8, 31, 1368], [15.6, 26, 1361]], 0.7]
}/*END*/;
const path = (...names) => names.map((n) => tube(PATHS[n][0], PATHS[n][1]));

// Asse dell'esofago reale e punti sulla sua superficie (dal modello «nervo-vago»).
const ESO = [[1472, 0, -2.7], [1457, -0.5, -0.2], [1442, -0.9, 3.6], [1427, -1, 6.9], [1412, -0.8, 11.3], [1397, -0.6, 15.7], [1382, -0.6, 19.2],
  [1367, -0.7, 23.2], [1352, -0.8, 26.6], [1337, -1, 28.8], [1322, -1.3, 29], [1307, -1.6, 27.3], [1292, -1.6, 24.5], [1277, -1.4, 20],
  [1262, -1.3, 14.8], [1247, -0.8, 8.6], [1232, -0.8, 2], [1217, -3.9, -5.4], [1202, -8.3, -11.8]];
const eso = (h, deg, d = 0.6) => {
  let i = ESO.findIndex((r) => r[0] <= h);
  if (i < 0) i = ESO.length - 1;
  i = Math.max(1, i);
  const [h0, a0, b0] = ESO[i - 1], [h1, a1, b1] = ESO[i];
  const t = Math.min(1, Math.max(0, (h0 - h) / (h0 - h1)));
  const t0 = (deg * Math.PI) / 180;
  return [a0 + (a1 - a0) * t + (9 + d) * Math.cos(t0), b0 + (b1 - b0) * t + (5.8 + d) * Math.sin(t0), h];
};

export class SistemaNervosoVegetativo extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.17, z: 0, rod: [0, 0.02, 0.045, -0.055] });
    this.rod = this.inner.children.at(-1);
    this.focusList = null;
    this.ready = this.#build();
  }

  // Primi piani. `list`: [{ when: [idParte…], c: [a, b, h] in mm, k, h }]; vale
  // la prima voce che ha una delle parti `when` visibile (l'ultima, senza
  // `when`, è la vista di base). Il punto `c` va sull'asse di rotazione,
  // all'altezza `h`, e il modello è ingrandito di `k`.
  setFocus(list) {
    this.focusList = list;
    this.focusNow = null;
  }

  reset() {
    super.reset();
    this.focusList = null;
    this.inner.position.set(0, 0, 0);
    this.inner.scale.setScalar(1);
    this.rod.visible = true;
  }

  update(dt, camera, realDt = dt) {
    if (this.focusList) {
      const f = this.focusList.find((t) => !t.when || t.when.some((id) => this.visible.has(id)));
      if (f) {
        const k = f.k ?? 1;
        const p = mm(...f.c).multiplyScalar(k);
        const target = V(-p.x, (f.h ?? 0.4) - p.y, -p.z);
        const e = this.focusNow ? 1 - Math.exp(-Math.min(realDt, 0.5) * 6) : 1;
        this.inner.position.lerp(target, e);
        this.inner.scale.setScalar(this.inner.scale.x + (k - this.inner.scale.x) * e);
        this.focusNow = f;
        this.rod.visible = false;
      }
    }
    super.update(dt, camera, realDt);
  }

  async #build() {
    await this.loadMeshes('sistema-nervoso-vegetativo.glb', REAL);
    // le mesh sottili sono ingrossate lungo le normali
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
    const sides = (f) => [f((p) => p), f(flip)];

    // --- catena limitante --------------------------------------------------------
    for (const [k, name] of [['C', 'cervicale'], ['T', 'toracico'], ['L', 'lombare'], ['S', 'pelvico']])
      this.addPart(`trunk${k}`, `tronco del simpatico, tratto ${name}`, SYM, sides((f) => tube(f(TRUNK[k]), 1.1, { caps: false, seg: TRUNK[k].length * 10 })));
    this.addPart('gSCG', 'ganglio cervicale superiore', SYM_G, sides((f) => tube(f([[28.3, 5.2, 1502], [29, 5.6, 1511], [29, 5.4, 1521], [28.5, 4.6, 1530]]), [1.2, 3, 3, 1.2])));
    this.addPart('gMCG', 'ganglio cervicale medio', SYM_G, sides((f) => ball(f([G.MCG])[0], [1.9, 1.7, 3.2])));
    this.addPart('gStell', 'ganglio stellato (cervicale inferiore e primo toracico)', SYM_G, sides((f) => tube(f([[21.6, 12.5, 1446], [22.8, 15, 1441], [23.2, 17, 1435], [22.4, 20.5, 1429]]), [1.4, 3.2, 3.3, 1.6])));
    const balls = (keys, r) => sides((f) => keys.map((k) => ball(f([G[k]])[0], r))).flat();
    this.addPart('gThor', 'gangli toracici', SYM_G, balls(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'], [2, 1.8, 3.4]));
    this.addPart('gLumb', 'gangli lombari', SYM_G, balls(['L1', 'L2', 'L3', 'L4'], [2.1, 1.9, 4.2]));
    this.addPart('gSacr', 'gangli sacrali', SYM_G, balls(['S1', 'S2', 'S3', 'S4'], [1.8, 1.6, 3]));
    this.addPart('gImpar', 'ganglio coccigeo (impari)', SYM_G, [ball(G.IMP, [2.4, 1.7, 2.4])]);
    this.addPart('ansa', 'ansa succlavia (del Vieussens)', 0xf0a05a, path('ansa'));

    // --- rami comunicanti --------------------------------------------------------
    const rami = (i) => sides((f) => Object.values(RAMI).map((r) => tube(f(r[i]), 0.6, { seg: 14, radial: 6 }))).flat();
    this.addPart('ramiWhite', 'rami comunicanti bianchi (T1-L2)', WHITE, rami(0));
    this.addPart('ramiGrey', 'rami comunicanti grigi', GREY, rami(1));

    // --- nervi splancnici ----------------------------------------------------------
    this.addPart('splGreat', 'nervo grande splancnico', SPL, path('grMain', 'gr6', 'gr7', 'gr8', 'gr9', 'grMainL', 'gr6L', 'gr7L', 'gr8L', 'gr9L'));
    this.addPart('splLesser', 'nervo piccolo splancnico', 0xc77a2a, path('leMain', 'le11', 'leMainL', 'le11L'));
    this.addPart('splLeast', 'nervo splancnico minimo', 0xa8641f, path('least', 'leastL'));
    this.addPart('splLumb', 'nervi splancnici lombari', 0xb8862a, path('lumb1', 'lumb2', 'lumb1L', 'lumb2L'));

    // --- gangli e plessi prevertebrali ----------------------------------------------
    this.addPart('gCeliac', 'gangli celiaci', PRE_G, path('celR', 'celL'));
    this.addPart('plexCeliac', 'plesso celiaco (solare)', 0xe0603a, path('celBridge', 'solar1', 'solar2', 'solar3', 'solar4', 'solar5', 'solar6'));
    this.addPart('gSMG', 'ganglio mesenterico superiore', PRE_G, [ball([-6, -30.2, 1131.3], [5.5, 2.3, 2.4])]);
    this.addPart('gAortRen', 'gangli aortico-renali', 0x7a2f4a, [ball([6.3, -18.8, 1125.8], [2.7, 2.2, 2.6]), ball([-21.6, -18.2, 1126.3], [2.7, 2.2, 2.6])]);
    this.addPart('gIMG', 'ganglio mesenterico inferiore', PRE_G, [ball([-8, -40.3, 1058.5], [4.6, 2, 2.6])]);
    this.addPart('plexInterm', 'plesso intermesenterico', 0xf08a3c, path('interm1', 'interm2'));
    this.addPart('plexHypoSup', 'plesso ipogastrico superiore', 0xf08a3c, path('hypoSup1', 'hypoSup2'));
    this.addPart('nHypo', 'nervi ipogastrici', 0xf0a05a, path('nHypoR', 'nHypoL'));
    this.addPart('plexHypoInf', 'plesso ipogastrico inferiore (pelvico)', 0x7d5aa8, [ball([29.5, 50, 864], [1.6, 10, 9]), ball([-32, 50, 864], [1.6, 10, 9])]);
    const leftPelv = (n) => tube(PATHS[n][0].map(([a, b, h]) => [-a - 2.5, b, h]), PATHS[n][1]);
    this.addPart('pelvSpl', 'nervi splancnici pelvici (S2-S4)', PARA, [...path('pelv2', 'pelv3', 'pelv4'), ...['pelv2', 'pelv3', 'pelv4'].map(leftPelv)]);
    this.addPart('plexPelvRami', 'plessi vescicale ed emorroidale medio', 0x9a7fc0, [...path('pelvVes', 'pelvRet'), leftPelv('pelvVes'), leftPelv('pelvRet')]);
    this.addPart('nucSacral', 'neuroni parasimpatici sacrali (S2-S4)', PARA, [ball([0.9, 24.5, 1061], [0.7, 0.7, 3.2]), ball([-0.9, 24.5, 1061], [0.7, 0.7, 3.2])]);

    // --- parasimpatico cranico (destra) ------------------------------------------------
    this.addPart('radBreve', 'radice breve (parasimpatica) del ganglio ciliare', PARA, path('radBreve'));
    this.addPart('gCiliare', 'ganglio ciliare', PARA_G, [ball([27.2, -44.2, 1595], [1.2, 1.6, 1.1])]);
    this.addPart('ciliariBrevi', 'nervi ciliari brevi', PARA_POST, path('cil1', 'cil2', 'cil3', 'cil4'));
    this.addPart('nucLac', 'nucleo lacrimatorio di Yagita', 0x55c2e8, [ball([6.6, 11.9, 1580.9], [0.9, 0.9, 1.1]), ball([-6.6, 11.9, 1580.9], [0.9, 0.9, 1.1])]);
    this.addPart('intermedio', 'nervo intermedio di Wrisberg', 0x2f9a8a, path('intermedio'));
    this.addPart('gGenic', 'ganglio genicolato (sensitivo)', 0xb89a5a, [ball([42.9, -0.9, 1585], [1.7, 1.6, 1.4])]);
    this.addPart('petroso', 'nervo grande petroso superficiale e nervo vidiano', 0x55c2e8, path('petroso'));
    this.addPart('gSfenopal', 'ganglio sfeno-palatino', PARA_G, [ball([19.5, -39.5, 1577], [1.8, 2.4, 1.8])]);
    this.addPart('postLacr', 'fibre postgangliari per la ghiandola lacrimale', PARA_POST, path('postLacr'));
    this.addPart('corda', 'corda del timpano', 0x2f9a8a, [...path('corda'), ...geo('chorda')]);
    this.addPart('gSottomand', 'ganglio sottomandibolare', PARA_G, [ball([20.3, -34.2, 1518.6], [1.5, 2.2, 1.4])]);
    this.addPart('postSaliv', 'fibre postgangliari per sottomandibolare e sottolinguale', PARA_POST, path('postSm', 'postSl'));
    this.addPart('timpanico', 'nervo timpanico e nervo piccolo petroso superficiale', 0x7a4fd0, path('timpanico'));
    this.addPart('gOtico', 'ganglio otico', PARA_G, [ball([20.9, -14.6, 1575.6], [1.3, 1.7, 1.5])]);
    this.addPart('postParot', 'fibre postgangliari per la parotide (nervo auricolo-temporale)', PARA_POST, path('postParot'));
    this.addPart('plexCarot', 'plesso pericarotideo interno', SYM, path('carot'));

    // --- nervo vago: tratto reale fino a metà collo, poi ricostruito ---------------------
    const strand = (list, r) => tube(list.map(([h, deg]) => eso(h, deg)), r, { caps: false });
    const neckR = [[23.8, -1.6, 1487], [23.6, -1.9, 1481], [22.6, -0.8, 1474], [21.2, 0.3, 1467], [19, -0.8, 1458], [18, -3, 1449], [18.8, -5, 1440], [21.3, -8.2, 1430], [22, -11, 1420],
      [21.8, -11.5, 1413], [19.5, -8.5, 1404], [15.5, -2.5, 1395], [13.8, 3.5, 1385], [14.8, 10, 1375], [15.5, 16.5, 1366.5], [14.5, 23.5, 1358], [11.5, 27.2, 1349.5], [8, 31.5, 1341], eso(1336, 62, 1)];
    const neckL = [[-23.8, -1.6, 1487], [-23.6, -1.9, 1481], [-24.5, 4.8, 1473], [-27, 5, 1466], [-26, 3.5, 1458], [-23.5, 2.5, 1450], [-22.8, 1.5, 1440], [-22.5, 1, 1430], [-21.5, 0.5, 1420], [-20, 0.3, 1408],
      [-19.6, 0.5, 1402], [-23.2, 0, 1398], [-28.6, -0.6, 1395.3], [-33, 1, 1387.3], [-33.3, 3.5, 1379], [-31.8, 5, 1373], [-30, 9, 1366], [-28.5, 15, 1358], [-26, 21.5, 1349.5], [-23.5, 26.2, 1341], [-18, 25.5, 1335], eso(1330, 212, 1)];
    this.addPart('vagR', 'nervo vago destro e tronco vagale posteriore', VAGUS, [...geo('vagHiR'), tube(neckR, 1.7, { caps: false, seg: 120 }),
      strand([[1336, 62], [1322, 80], [1307, 95], [1292, 85], [1277, 92], [1262, 90], [1247, 90], [1232, 92], [1217, 95], [1205, 100]], 1.5)]);
    this.addPart('vagL', 'nervo vago sinistro e tronco vagale anteriore', 0x6aa8e0, [...geo('vagHiL'), tube(neckL, 1.7, { caps: false, seg: 130 }),
      strand([[1330, 212], [1312, 250], [1294, 272], [1278, 265], [1262, 270], [1247, 270], [1232, 270], [1217, 268], [1205, 265]], 1.5)]);
    const twigs = (from, ends, r) => ends.map((e) => tube([from, [(from[0] + e[0]) / 2, (from[1] + e[1]) / 2 + 1.5, (from[2] + e[2]) / 2 + 1], e], [r, r * 0.6]));
    this.addPart('plexPulm', 'plesso polmonare (rami del vago)', PARA_POST, [
      ...twigs([14.5, 23.5, 1358], [[24, 25.5, 1349], [30, 25, 1340]], 0.9), ...twigs([11.5, 27.2, 1349.5], [[22, 28.5, 1338], [18, 29, 1331]], 0.9),
      ...twigs([-26, 21.5, 1349.5], [[-35, 26, 1338.5], [-42, 27.5, 1330]], 0.9), ...twigs([-23.5, 26.2, 1341], [[-31, 28.5, 1329], [-37, 29.5, 1322]], 0.9),
    ]);
    this.addPart('symPulm', 'rami polmonari del simpatico', SYM, path('symPulm1', 'symPulm2'));
    this.addPart('vagCard', 'nervi cardiaci del vago', PARA_POST, [
      tube([[15.5, -2.5, 1395], [12.8, -6, 1386], [7, -4.6, 1378], [1, -2.5, 1372.5], [-1.5, -0.8, 1370.5]], 0.8),
      tube([[-18, 9.5, 1366.5], [-12, 5.5, 1366], [-6, 1.5, 1368], [-2.5, -0.5, 1370]], 0.8),
    ]);
    this.addPart('symCard', 'nervi cardiaci del simpatico', SYM, path('symCard1', 'symCard2'));
    this.addPart('cardPlex', 'plesso cardiaco', 0x9a5fb5, [ball([-2, -0.6, 1370], [3.4, 2.4, 2.6])]);
    this.addPart('vagCeliac', 'ramo celiaco del vago', VAGUS, path('vagCel'));

    // rami gastrici, appoggiati sulla superficie dello stomaco reale
    const st = this.parts.get('stomach').meshes[0];
    const sp = st.geometry.attributes.position;
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
      return V(a * S, (h - OZ) * S, (best ?? 0) + st.position.z + (front ? 0.5 : -0.5) * S);
    };
    const gastric = (front, start, lines) => lines.map((l) => tube([...(l.skip ? [] : [mm(...start)]), ...l.map(([a, h]) => onStomach(a, h, front))], [1.2, 0.6], { seg: 40 }));
    const noStart = (l) => Object.assign(l, { skip: true });
    this.addPart('vagGastric', 'plessi gastrici anteriore e posteriore', PARA_POST, [
      ...gastric(true, eso(1205, 265), [[[-12, 1196], [-15, 1186], [-21, 1175], [-24, 1163], [-20, 1152], [-8, 1145], [6, 1141]],
        noStart([[-12, 1196], [-26, 1200], [-42, 1206], [-56, 1208]]), noStart([[-15, 1186], [-30, 1184], [-46, 1179], [-60, 1172]]), noStart([[-21, 1175], [-36, 1168], [-50, 1158], [-60, 1146]])]),
      ...gastric(false, eso(1205, 100), [[[-14, 1197], [-26, 1190], [-42, 1182], [-60, 1174], [-78, 1166], [-90, 1156]],
        noStart([[-26, 1190], [-32, 1176], [-36, 1162], [-36, 1148]]), noStart([[-42, 1182], [-52, 1168], [-58, 1152], [-60, 1138]])]),
    ]);
    this.addPart('symGastric', 'fibre postgangliari dal ganglio celiaco allo stomaco', 0xa3282b, [
      tube([[-21.5, -23, 1139], [-22, -30, 1150], [-26, -38, 1160], [-32, -44, 1166]], [0.9, 0.6]),
      tube([[3.5, -23, 1139], [-2, -31, 1148], [-10, -40, 1154], [-18, -47, 1157]], [0.9, 0.6]),
    ]);

    // --- vie: un impulso percorre la fibra ------------------------------------------------
    const PRE = 0xe8552b, POST = 0xa3282b, PPRE = 0x2f6fe0;
    const link = (id, pts, color, r = 0.9) => this.addLink(id, pts.map((p) => mm(...p)), { color, r: r * S });
    // segmento T6 di destra
    link('fPre', [[3.8, 71.6, 1327], [3.2, 70.2, 1327.6], [8, 69.9, 1324.9], [14, 71.7, 1321.6], [18.5, 71.6, 1320.8], ...RAMI.T6[0], G.T6], PRE);
    link('fPost', [G.T6, ...[...RAMI.T6[1]].reverse(), [22, 70.8, 1316.8], [28, 69.1, 1314.5], [38, 66.9, 1311.4], [48, 72.9, 1311.4], [58, 82.9, 1312.6]], POST);
    link('fUp', [[21.3, 51.7, 1327.4], [20.6, 50.6, 1340], G.T5, G.T4, [20.6, 34.5, 1396]], PRE, 1.5);
    link('fDown', [[21.3, 51.7, 1327.4], [20.9, 54.5, 1316], G.T7, G.T8, [21.9, 48, 1254]], PRE, 1.5);
    link('fSpl', [[21.3, 51.7, 1327.4], ...PATHS.gr6[0].slice(1), ...PATHS.grMain[0].slice(5, 9)], PRE, 1.2);
    // surrene: fibre pregangliari dirette alla midollare
    link('toAdrenal', [[7.5, -18.5, 1127], [16, -14, 1133], [26, -7, 1138], [33, 0, 1141]], PRE, 0.8);
    // parasimpatico sacrale: dal cono midollare, nella cauda equina, al foro S3
    link('sacralPre', [[0.9, 24.5, 1058], [1.7, 23, 1045], [1.7, 23.6, 1025], [1.7, 26.5, 1002], [1.7, 34, 978], [1.7, 48, 955], [2.5, 62, 938], [8, 71, 925], [13.5, 70, 915], [19, 63, 910]], PPRE, 0.8);
  }
}
