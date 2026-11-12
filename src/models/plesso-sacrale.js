// Modello del plesso sacrale e del plesso pudendo: emibacino e arto inferiore
// destri, dalle vertebre L4-L5 al piede.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/plesso-sacrale.glb, manifesto
// in meshes/plesso-sacrale.json): vertebre L4 e L5 con i dischi, sacro e coccige,
// osso dell'anca, femore, rotula, tibia, fibula, ossa del piede; legamenti
// sacro-spinoso e sacro-tuberoso; muscoli piriforme, otturatore interno, gemelli,
// quadrato del femore, grande, medio e piccolo gluteo, tensore della fascia lata,
// ischio-coccigeo, elevatore dell'ano (ileo-coccigeo e pubo-coccigeo), sfintere
// esterno dell'ano, muscoli posteriori della coscia, grande adduttore, tricipite
// della sura, estensori e peronieri della gamba; arteria pudenda interna.
//
// NERVI: DECORSO REALE, CALIBRO RICOSTRUITO. In Z-Anatomy i nervi sono curve
// trasformate in tubi di 0,5-1 mm di raggio (solo l'ischiatico arriva a 6 mm):
// alla scala del libro sarebbero fili invisibili. Di ogni nervo ho quindi
// estratto l'asse del tubo (media degli anelli di 12 vertici, semplificata a
// 0,5 mm: tabella AX, in millimetri nella terna di Z-Anatomy) e ci ho ricostruito
// sopra un tubo di calibro verosimile. Assi presi da Z-Anatomy: radici L4-S4
// («Cauda equina», tratto fuori dai forami), tronco lombo-sacrale e nervo
// ischiatico («Sciatic nerve», «Nerve to quadratus femoris muscle» per la quota
// di L4), tibiale, plantari, peroniero comune, superficiale e profondo, cutanei
// dorsali del piede, surale con i suoi due rami d'origine, gluteo superiore,
// nervo del piriforme, nervo del quadrato del femore, cutaneo posteriore della
// coscia (in Z-Anatomy finisce a metà coscia), radici S2, S3 e S4 del pudendo e
// il suo tratto terminale lungo il ramo ischio-pubico.
// I calibri sono STIMATI (nessuna misura letta in una fonte): ischiatico largo
// circa 14 mm e schiacciato in senso antero-posteriore (gli appunti dicono
// 2-2,5 cm), radici 5-7 mm, rami collaterali 2-4 mm.
//
// RICOSTRUITI A MANO dentro l'anatomia reale (punti in mm, verificati misurando
// le distanze dalle mesh reali):
//   - quota di S3 per il plesso sacrale: dal terzo forame sacrale anteriore
//     all'apice del plesso, sulla faccia anteriore del piriforme reale (STIMATO);
//   - nervo gluteo inferiore: esce sotto il piriforme, medialmente all'ischiatico,
//     piega indietro e si divide in rami ascendenti e discendenti sulla faccia
//     profonda del grande gluteo reale (decorso VERIFICATO sulla fonte 3, punti stimati);
//   - nervo dell'otturatore interno: sotto il piriforme, attorno alla base della
//     spina ischiatica reale, lateralmente all'arteria pudenda interna reale, poi
//     nel piccolo forame ischiatico fino alla faccia pelvica dell'otturatore
//     interno reale (VERIFICATO sulla fonte 4);
//   - nervo pudendo dal punto di unione delle radici in giù: la curva di
//     Z-Anatomy scende 15-20 mm medialmente all'otturatore interno senza girare
//     attorno alla spina ischiatica; l'ho rifatta passando dietro la parte
//     laterale del legamento sacro-spinoso reale, nel piccolo forame ischiatico e
//     lungo l'arteria pudenda interna reale, a 1-3 mm dalla faccia mediale
//     dell'otturatore interno reale (decorso VERIFICATO sulle fonti 1, 2 e 5; che
//     il nervo stia medialmente all'arteria è dedotto dalla fonte 4);
//   - canale di Alcock: guaina trasparente attorno a nervo e arteria sulla faccia
//     mediale dell'otturatore interno (posizione VERIFICATA sulla fonte 2,
//     lunghezza e altezza sopra la tuberosità STIMATE);
//   - nervo emorroidale inferiore (nasce nel canale: fonte 1) fino allo sfintere
//     esterno dell'ano reale, e nervo perineale: decorso STIMATO.
// Fonti effettivamente lette (Gray 1918 su bartleby, theodora e wikisource non
// era raggiungibile):
//   1. «Pudendal nerve», https://en.wikipedia.org/wiki/Pudendal_nerve
//      (radici S2-S4; si forma appena sopra il legamento sacro-spinoso; esce tra
//      piriforme e ischio-coccigeo; incrocia la parte laterale del legamento
//      sacro-spinoso; rientra dal piccolo forame ischiatico; nel canale dà per
//      primo il nervo rettale inferiore, poi il perineale e il dorsale del pene o del clitoride)
//   2. «Pudendal canal», https://en.wikipedia.org/wiki/Pudendal_canal
//      (fascia dell'otturatore interno, parete laterale della fossa ischio-anale; contenuto)
//   3. «Inferior gluteal nerve», https://en.wikipedia.org/wiki/Inferior_gluteal_nerve
//      (sotto il piriforme, medialmente all'ischiatico; al margine inferiore del
//      piriforme piega indietro e si divide in rami ascendenti e discendenti)
//   4. «Nerve to obturator internus», https://en.wikipedia.org/wiki/Nerve_to_obturator_internus
//      (attorno alla base della spina ischiatica, lateralmente ad arteria pudenda
//      interna e nervo pudendo; rientra dal piccolo forame ischiatico)
//   5. «Internal pudendal artery», https://en.wikipedia.org/wiki/Internal_pudendal_artery
//   6. «Sacral plexus», https://en.wikipedia.org/wiki/Sacral_plexus
//      (davanti al piriforme; i nervi convergono in una banda appiattita verso la
//      parte inferiore del grande forame ischiatico)
//   7. «Lumbosacral trunk», https://en.wikipedia.org/wiki/Lumbosacral_trunk
//   8. «Sciatic nerve», https://en.wikipedia.org/wiki/Sciatic_nerve
//      (dietro il grande adduttore, davanti al capo lungo del bicipite; divisione al poplite)
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

// Da millimetri Z-Anatomy (x verso sinistra, y verso dietro, z verso l'alto)
// alle coordinate del modello; stessa terna del manifesto.
const S = 0.00072;
const mm = (x, y, z) => V(-(x + 60) * S, (z + 40) * S, -(y - 20) * S);

// Assi dei nervi estratti dalle mesh Z-Anatomy (mm).
const AX = {
  rL4: [[-6.4,25,1016.9], [-13.2,26.7,1012], [-19.8,26.9,1008.6]],
  l4lumb: [[-19.8,26.9,1008.6], [-28.8,25,1005.8], [-46,18.2,1003.2]],
  lst4: [[-19.8,26.9,1008.6], [-22.2,24.6,1004], [-27.7,18.5,995.3], [-30.7,16.6,988.4], [-32.6,16.9,981.7], [-33.8,17.7,973.5], [-34.2,19.1,944]],
  rL5: [[-5.9,30.1,989.1], [-14.6,33.6,982.6], [-18.3,34.4,980.5], [-25,34,978.3], [-29.7,32.5,977.9]],
  lst5: [[-29.8,32.6,977.9], [-29.9,28.4,968.3], [-30.7,26.3,963.1], [-34.8,21.4,951.7], [-38,18.9,942]],
  lst: [[-38,18.9,942], [-41.5,17.1,929.4], [-43.9,18.2,920.3], [-46.1,22,911.1], [-48.2,29.1,902]],
  plexus: [[-48.2,29.1,902], [-50,35.1,895.8], [-52.5,45.7,887.6], [-53.2,53.6,878.6]],
  sciGlut: [[-53.2,53.6,878.6], [-52.6,58.9,871.4], [-52.4,61.9,865.3], [-53.2,64.7,855.7], [-54.6,66,847], [-57.3,66,834.9], [-62,63.3,813.8], [-64.4,61.2,796.9],
    [-66.1,58.3,781]],
  sciThigh: [[-66.1,58.3,781], [-68.4,51.7,749.2], [-70,47.3,718], [-71.6,41.3,657.6], [-75,37.2,609.8], [-76.8,36.2,585], [-77.2,36.5,562.5], [-76.8,37,555.6],
    [-76.5,39.8,540.1]],
  rS1a: [[-19.7,55.3,943.6], [-20.8,55,943.4], [-21.6,52.9,942.3], [-19.8,42,935.6], [-20.7,38.4,932.5]],
  rS1: [[-20.7,38.4,932.5], [-28.2,33.6,925.3], [-33.9,31.8,919.8], [-42.1,30.9,911.2], [-48.7,30.6,900.3]],
  rS2: [[-16.6,60.7,922.5], [-26.4,55,916.2], [-33,53,910.9], [-40.7,53.2,903.5], [-45.7,52.9,897.5], [-53,48.7,884.4]],
  s2pud: [[-11.7,69.4,929.5], [-14.1,69.4,927.8], [-16.5,68.7,924.7], [-19,66.6,918.3], [-21,65.9,912.1], [-22.8,65.8,903.1], [-24.7,67.2,879]],
  s3pud: [[-11.9,79.7,907.9], [-14.7,78.4,905.1], [-18.7,73.8,897.1], [-21.5,71.5,890], [-23.6,68.1,882.9], [-24.7,67.2,879]],
  s4pud: [[-13.4,81.6,890.2], [-14.6,81.2,888.7], [-15.5,79.9,887.3], [-18.9,72.1,883], [-24.7,67.2,879]],
  pudZA: [[-24.7,67.2,879], [-27.7,69.1,871.7], [-28.5,69.7,864.5], [-28,68.9,857.3], [-27.5,66.1,848.8], [-26.8,62.1,840.8], [-25.9,58,835.4], [-24.5,51.8,829.4],
    [-22.5,44.3,823.6], [-21.1,39.2,820.7], [-18.9,30.9,817.5], [-16.8,21.2,815.2], [-15.3,12.5,814.2], [-14.3,4.7,814.7], [-12.8,-6,816.6], [-9.1,-22.8,820.7]],
  sgRoot: [[-29.9,32.9,923.6], [-39.3,24.7,935.6]],
  sgSup: [[-30.3,27,964.9], [-36.4,24.6,954.8], [-37.6,22.9,945.9], [-39,24.5,936.3], [-45.8,26.7,920], [-48.5,27.5,916.7], [-52,28.9,914.4], [-62.3,34.6,912.2],
    [-65.7,37,912.5], [-69.2,38.7,914.4], [-72.7,39.7,917.2], [-75.8,40,921.3], [-78.4,39.2,928.1], [-82.2,35.6,940.5], [-85.7,33.2,946.8], [-92.2,27.5,956.4]],
  sgInf: [[-54.2,29.9,913.8], [-65.9,34.5,907.6], [-71,36.2,905.8], [-78.5,38.4,905.1], [-85.8,40.1,906.5], [-95.2,40.7,910.4], [-103.5,39.3,915], [-111.5,36.1,921.9],
    [-117.4,31.7,930.6]],
  npS1: [[-20.7,38.4,932.5], [-23.8,38.8,928.5], [-33.4,45.9,912.9], [-36.7,46.8,907.9], [-40,46.2,903], [-44.4,44.4,898.4], [-48.5,42.9,896.1], [-56.1,41.7,893.1],
    [-68.7,41.1,889.3]],
  npS2: [[-16.6,60.7,922.5], [-36.7,46.8,907.9]],
  nqf: [[-51.1,37.7,908.7], [-55.1,40.6,899.2], [-59.8,42.3,889.1], [-63.2,42.4,883], [-70.9,41.3,866.7], [-73.6,40,860], [-76.1,37.1,851.3], [-76.9,34.3,845.7],
    [-76.6,30.6,841.6]],
  nqfArt: [[-76.6,30.6,841.6], [-75.1,25.2,837.7], [-72.5,18.3,835.3], [-70.9,13.8,835], [-68,5.2,836.8]],
  nqfEnd: [[-76.6,30.6,841.6], [-78.8,29.1,835.9], [-81.5,28.5,828.6], [-89.3,30.2,812.5]],
  pfcn: [[-42.9,41.6,892.9], [-44,49.3,887.1], [-44.8,57.6,879.5], [-45.3,67.1,868.5], [-47.1,73.6,856.9], [-48.8,77.6,848], [-50.7,80.7,839.4], [-53.5,84.3,826],
    [-58.2,89.9,792.9], [-61.6,93.8,750.4], [-65.5,95.2,711.9], [-72.3,94.7,651]],
  tibial: [[-76.5,39.8,540.1], [-77.7,40.7,531.9], [-82.9,41.6,514.2], [-84.5,43.5,504.3], [-84.3,48,492.7], [-81.5,57.3,476.9], [-80.5,60.5,470], [-80.3,62.8,461.9],
    [-81.2,64.9,445.6], [-83.2,64.5,431.2], [-88.7,59.9,393.2], [-94.4,51.1,350.4], [-95.3,49,337.8], [-95.4,47.6,323.6], [-94.5,47.2,308.4], [-92.7,47.6,294.8],
    [-85.6,51.3,255.9], [-83.7,52.5,240.7], [-82.2,54,219.4], [-80.9,56.8,181.9], [-77.2,58.3,146.4], [-74.4,58.4,129.8], [-70.1,58.5,112.6], [-66.9,58.8,103.5],
    [-60.2,59.6,91.2], [-58.1,59.4,84.9], [-56.9,58.5,70.6], [-57.4,57.4,64.2], [-57.9,54.9,57.8]],
  fibCom: [[-76.5,39.8,540.1], [-79.1,43.6,527], [-86.3,51.8,504.9], [-88.8,53.4,499.5], [-91.9,54.3,494], [-93.8,55.3,487.3], [-95.1,57.2,476], [-96.8,60.7,447.3],
    [-98.3,61.1,434.1], [-102.8,60.2,418], [-108.9,57.7,404], [-114.6,54,394.2], [-120.9,49.7,389], [-122.7,46.5,385.3]],
  fibSup: [[-122.7,46.5,385.3], [-116.5,42.1,363.7], [-114.4,40.2,352.3], [-113.6,39.5,343.8], [-115.5,41.2,276.5], [-115.2,41.4,259.2], [-111.6,42.7,210], [-107.9,42,174.5],
    [-103.8,42.4,135.2], [-103.6,39.9,119.1], [-105.5,31.7,94.9]],
  fibDeep: [[-122.7,46.5,385.3], [-121.2,43.4,381.2], [-117.9,41.1,377.6], [-115.5,39.7,373.7], [-110.9,38.7,364.2], [-104.9,35,351.9], [-103.1,33.1,344.2], [-102.5,31.8,337.8],
    [-102.3,29.6,322], [-101.7,28.9,302.5], [-100.7,29.4,277.3], [-96.5,30.8,233.2], [-94.8,30.1,206.2], [-94,27.9,171.7], [-95.9,26.9,137.6], [-93.9,25.1,120.3],
    [-88.2,21.1,100], [-86.3,18.1,87.5], [-85.1,15.8,82.1], [-83.1,13.4,79], [-74.8,5.1,76.3], [-71,0.1,72.6], [-69.4,-4.8,69.8], [-69.4,-10.3,67.7],
    [-73.5,-34.9,59.2], [-74.6,-42,54.9], [-76.6,-56.1,43.9]],
  suralMed: [[-76.5,39.8,540.1], [-71.2,75.5,452.2], [-70.6,83.2,431.6], [-70.8,90.5,410.2]],
  suralCom: [[-113.8,54.6,395.3], [-110.9,61.3,390.1], [-107.6,65.1,385.1], [-100.8,68.5,375.6], [-95.7,69.2,367], [-91.9,72.8,362.1], [-87.8,79.6,358], [-78.5,101.3,351.9]],
  sural: [[-70.8,90.5,410.2], [-72.8,96,390.4], [-77.4,100.3,362.7], [-79.2,102.1,339.3], [-79.2,102,320.9], [-77.7,99.8,286.6], [-75.3,95.2,253.1], [-75.1,91.2,233.7],
    [-76.2,82.6,199.8], [-76.9,79.2,180.3], [-77.1,78.3,165.7], [-77.2,78.7,144.3], [-78.3,78.1,130.5], [-82.6,74.9,106.7], [-87.1,72.2,90.5], [-92.1,67.7,75],
    [-97.5,60,58.4], [-100,54.3,49.8], [-102.4,47.3,43.4], [-104.8,40.5,39.3], [-107.9,31.5,36.1], [-115.2,10,33], [-123.2,-13.9,28.5]],
  sural2: [[-123.2,-13.9,28.5], [-128.6,-29,24.6], [-135.2,-42.5,22.2], [-138.2,-50.4,20.6], [-144.3,-79.2,13.5]],
  plantLat: [[-57.9,54.9,57.8], [-60.1,50.2,49.8], [-63.7,43.6,40.6], [-66.8,37.8,34.2], [-69.4,33.1,30.6], [-73.4,25.6,27.2], [-77.4,18.8,25.6], [-83.5,10.5,24.3],
    [-95.4,-3.3,22.5]],
  plantMed: [[-57.9,54.9,57.8], [-59.1,49.5,53.9], [-62.3,36.1,48.2], [-65.1,23.6,43.8], [-67.9,10.5,40.9], [-68.7,-1.5,37.6], [-67.3,-24.1,30.5]],
  plantMed2: [[-68.4,6.8,40], [-74.1,-13.3,30.5], [-76.6,-24.5,26.2]],
  dcMed: [[-105.5,31.7,94.9], [-99.2,16.8,81.4], [-95.6,8.3,75.8], [-79.4,-29.8,62.1]],
  dcMed2: [[-79.4,-29.8,62.1], [-73.8,-45.9,50.6], [-68.6,-64.9,37.9], [-61.6,-80.2,27.3]],
  dcInt: [[-105.5,31.7,94.9], [-104.7,22.5,68.3], [-105.6,17,55.9], [-106.7,13.7,51.4], [-108.6,7.1,47.2], [-112.8,-7.4,40.8], [-121.1,-40.5,29.5]],
};

// Tratti ricostruiti a mano (mm): vedi il commento in testa.
const RE = {
  s3: [[-11.9, 79.7, 907.9], [-17, 75, 904], [-26, 67, 898], [-37, 60, 892], [-46, 55, 887], [-52.5, 51, 882]],
  gluInf: [[-46, 46, 890], [-41, 54, 884], [-39, 62, 877], [-41, 70, 871], [-47, 77, 867], [-55, 81, 866]],
  gluInfUp: [[-55, 81, 866], [-63, 83, 876], [-72, 82, 890]],
  gluInfDown: [[-55, 81, 866], [-60, 83, 852], [-66, 82, 836]],
  nOI: [[-48, 41, 893], [-45.5, 50, 885], [-44.5, 55, 876], [-44.5, 57, 867], [-46, 58, 858], [-49, 57, 850], [-51, 53, 844]],
  pud: [[-24.7, 67.2, 879], [-30, 66, 875.5], [-36, 62.5, 871], [-39.5, 59.5, 865], [-41, 58, 857], [-42, 57, 849], [-42.5, 55.5, 841],
    [-42, 53, 834], [-40.5, 49.5, 828], [-38, 44.5, 822.5], [-35.5, 39, 818]],
  alcock: [[-42, 57.5, 852], [-42.5, 56, 842], [-42.5, 53.5, 834], [-41, 50, 828], [-38.5, 45, 822.5], [-36, 40, 818.5]],
  rect: [[-41.5, 57.5, 853], [-36, 59, 845], [-27, 59, 833], [-18, 58, 823], [-11, 57, 816]],
  perin: [[-37, 42, 820.5], [-31, 35, 811], [-23, 27, 804], [-14, 18, 800], [-8, 9, 799]],
  dors: [[-35.5, 39, 818], [-30, 32, 816], [-23, 26.5, 815.5]],
};

// Tubo lungo un asse in mm, con le estremità chiuse da una sferetta (così i
// tratti consecutivi si raccordano senza fessure).
function nerve(pts, r, { flat = null, seg = 0 } = {}) {
  const radii = (Array.isArray(r) ? r : [r, r]).map((v) => v * S);
  const p = pts.map((q) => mm(...q));
  const g = [taperTube(p, radii, { caps: false, flat, radial: 12, seg: seg || Math.max(16, pts.length * 6) })];
  for (const [q, rad] of [[p[0], radii[0]], [p.at(-1), radii.at(-1)]]) {
    g.push(ellipsoid([q.x, q.y, q.z], [rad * (flat?.x ?? 1), rad * (flat?.y ?? 1), rad * (flat?.z ?? 1)], null, 10));
  }
  return g;
}

const BONE = 0xe9dfc8, LIG = 0xc9d3e0, MUSCLE = 0xb5564a;
const SCIATIC = 0xe8c23a;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  l4: ['vertebra L4', BONE],
  l5: ['vertebra L5', BONE],
  discs: ['dischi intervertebrali L4-L5 e L5-S1', 0xbfd0d8],
  sacrum: ['osso sacro e coccige', BONE],
  hip: ["osso dell'anca", 0xe4d8be],
  hipAnt: ["osso dell'anca: pube e parte anteriore di ileo e acetabolo", 0xe4d8be],
  femur: ['femore, estremità prossimale', BONE],
  femurShaft: ['femore, diafisi', BONE],
  femurDist: ['femore, terzo distale', BONE],
  patella: ['rotula', BONE],
  tibia: ['tibia', BONE],
  fibula: ['fibula', 0xe4d8be],
  foot: ['ossa del piede', BONE],
  ssl: ['legamento sacro-spinoso', LIG],
  stl: ['legamento sacro-tuberoso', 0xaebccc],
  piriformis: ['muscolo piriforme', 0xc9485b],
  obtInt: ['muscolo otturatore interno', 0xb86a4c],
  gemelli: ['muscoli gemelli superiore e inferiore', 0xc98a6a],
  quadFem: ['muscolo quadrato del femore', 0xa9523f],
  gluMax: ['muscolo grande gluteo', MUSCLE, { ghost: true, opacity: 0.16 }],
  gluMed: ['muscolo medio gluteo', 0xc4705c],
  gluMin: ['muscolo piccolo gluteo', 0xa85a4a],
  tfl: ['muscolo tensore della fascia lata', 0xd08a6e],
  coccygeus: ['muscolo ischio-coccigeo', 0xc98a6a],
  levator: ["muscolo elevatore dell'ano", 0xd29a84],
  sphincter: ["sfintere esterno dell'ano", 0x9c4a3c],
  pudArt: ['arteria pudenda interna', 0xb5302e],
  hamstrings: ['bicipite femorale, semitendinoso e semimembranoso', 0xb5564a],
  addMag: ['muscolo grande adduttore', 0xc98a6a],
  calf: ['tricipite della sura (gemelli e soleo)', 0xb5564a],
  extensors: ['tibiale anteriore ed estensori lunghi delle dita e dell’alluce', 0xc4705c],
  peronei: ['muscoli peronieri lungo e breve', 0xd08a6e],
};

export class PlessoSacrale extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.135, z: 0.03 });
    this.ready = this.#build();
  }

  // Primo piano di una regione: il punto `at` (mm Z-Anatomy) va sopra il centro
  // della base, all'altezza `height`; il modello è ingrandito di `scale` e
  // inclinato di `lean` attorno all'asse trasversale. `reset` lo riporta a posto.
  focus(at, scale, height = 0.4, lean = 0) {
    const p = mm(...at).multiplyScalar(scale).applyEuler(new THREE.Euler(lean, 0, 0));
    this.inner.scale.setScalar(scale);
    this.inner.rotation.x = lean;
    this.inner.position.set(-p.x, height - p.y, -p.z);
  }

  reset() {
    super.reset();
    this.inner.position.set(0, 0, 0);
    this.inner.scale.setScalar(1);
    this.inner.rotation.x = 0;
  }

  async #build() {
    await this.loadMeshes('plesso-sacrale.glb', REAL);
    this.#roots();
    this.#collaterals();
    this.#sciatic();
    this.#pudendal();
  }

  // Radici, tronco lombo-sacrale e apice del plesso.
  #roots() {
    const add = (id, name, color, geos) => this.addPart(id, name, color, geos);
    add('L4', 'ramo anteriore di L4: quota per il tronco lombo-sacrale', 0xe07b39,
      [...nerve(AX.rL4, 2.7), ...nerve(AX.lst4, [2.3, 2.2])]);
    add('L4lumb', 'ramo anteriore di L4: quota per il plesso lombare', 0xf0b48a, nerve(AX.l4lumb, [2.7, 2.3]));
    add('L5', 'ramo anteriore di L5', 0xd99a1c, [...nerve(AX.rL5, 3.1), ...nerve(AX.lst5, [3.1, 3.3])]);
    add('lst', 'tronco lombo-sacrale', 0xe6b830, nerve(AX.lst, [3.8, 4.3], { flat: { z: 0.8 } }));
    add('S1', 'ramo anteriore di S1', 0x4fa35f, [...nerve(AX.rS1a.slice(-3), 3.2), ...nerve(AX.rS1, [3.2, 3.5])]);
    add('S2', 'ramo anteriore di S2: quota per il plesso sacrale', 0x3a86c8, nerve([[-11.7, 69.4, 929.5], ...AX.rS2], [2.6, 2.9]));
    add('S2p', 'ramo anteriore di S2: fibre per il plesso pudendo', 0x7fb4e0, nerve(AX.s2pud, 1.7));
    add('S3', 'ramo anteriore di S3: quota per il plesso sacrale', 0x8e5bb5, nerve(RE.s3, [2.3, 2.4]));
    add('S3p', 'ramo anteriore di S3: quota per il plesso pudendo', 0xb894d6, nerve(AX.s3pud, 1.9));
    add('S4', 'ramo anteriore di S4', 0xa5673f, nerve(AX.s4pud, 1.6));
    add('plexus', 'apice del plesso sacrale', 0xe8c23a, nerve(AX.plexus, [4.6, 6, 7], { flat: { z: 0.6 } }));
    // ancore per le etichette delle radici: davanti ai corpi vertebrali e al sacro, all'altezza dei forami
    for (const [id, p] of Object.entries({
      L4: [-4, -26, 987], L5: [-4, -22, 960], S1: [0, -8, 920], S2: [2, 22, 902], S3: [2, 42, 882], S4: [2, 52, 865],
    })) {
      const c = mm(...p);
      this.addPart(`tag${id}`, id, 0xffffff, [ellipsoid([c.x, c.y, c.z], [0.0004, 0.0004, 0.0004], null, 6)]);
    }
  }

  // Rami collaterali per il cingolo pelvico e cutaneo posteriore della coscia.
  #collaterals() {
    this.addPart('gluSup', 'nervo gluteo superiore', 0x2f6fe0,
      [...nerve(AX.sgSup, [2, 1.8, 1.5, 1.3]), ...nerve(AX.sgRoot, 1.5), ...nerve(AX.sgInf, [1.5, 1.2])]);
    this.addPart('gluInf', 'nervo gluteo inferiore', 0x16a394,
      [...nerve(RE.gluInf, 1.8), ...nerve(RE.gluInfUp, [1.4, 1.1]), ...nerve(RE.gluInfDown, [1.4, 1.1])]);
    const k = AX.pfcn.findIndex((p) => p[2] < 800);
    this.addPart('pfcn', 'nervo cutaneo posteriore della coscia', 0xb07cd8, nerve(AX.pfcn.slice(0, k + 1), [2, 1.7]));
    this.addPart('pfcnThigh', 'nervo cutaneo posteriore della coscia, tratto femorale', 0xb07cd8, nerve(AX.pfcn.slice(k), [1.7, 1.3]));
    this.addPart('nPir', 'nervo del muscolo piriforme', 0x8a9a3c, [...nerve(AX.npS1, 1.1), ...nerve(AX.npS2, 1.1)]);
    this.addPart('nQF', 'nervo del muscolo quadrato del femore', 0xe58a4e, [...nerve(AX.nqf, 1.3), ...nerve(AX.nqfEnd, 1.2)]);
    this.addPart('nOI', "nervo del muscolo otturatore interno", 0x3fa6c4, nerve(RE.nOI, 1.3));
  }

  // Nervo ischiatico e rami terminali.
  #sciatic() {
    const flat = { z: 0.45 };
    this.addPart('sciGlut', 'nervo ischiatico, tratto gluteo', SCIATIC, nerve(AX.sciGlut, 7, { flat }));
    this.addPart('sciThigh', 'nervo ischiatico, tratto femorale', SCIATIC, nerve(AX.sciThigh, [7, 6.5, 6, 5.5], { flat, seg: 60 }));
    const k = AX.tibial.findIndex((p) => p[2] < 400);
    this.addPart('tibPop', 'nervo tibiale, tratto popliteo', 0xe0662f, nerve(AX.tibial.slice(0, k + 1), [4.4, 4]));
    this.addPart('tibial', 'nervo tibiale', 0xe0662f, nerve(AX.tibial.slice(k), [4, 3.4, 3, 2.6], { seg: 90 }));
    this.addPart('plantar', 'nervi plantari mediale e laterale', 0xd9628f,
      [...nerve(AX.plantMed, [1.9, 1.5]), ...nerve(AX.plantMed2, 1.3), ...nerve(AX.plantLat, [1.9, 1.5])]);
    this.addPart('fibCom', 'nervo peroniero comune', 0x2f9a63, nerve(AX.fibCom, [3.4, 2.8], { seg: 60 }));
    this.addPart('fibSup', 'nervo peroniero superficiale e nervi cutanei dorsali del piede', 0x86c440,
      [...nerve(AX.fibSup, [2.1, 1.7], { seg: 60 }), ...nerve(AX.dcMed, 1.3), ...nerve(AX.dcMed2, 1.1), ...nerve(AX.dcInt, [1.3, 1.1])]);
    this.addPart('fibDeep', 'nervo peroniero profondo', 0x147a6a, nerve(AX.fibDeep, [2.1, 1.5], { seg: 100 }));
    this.addPart('sural', 'nervo surale con i suoi due rami di origine', 0x8e5bb5,
      [...nerve(AX.sural, [1.7, 1.5], { seg: 90 }), ...nerve(AX.suralMed, 1.5), ...nerve(AX.suralCom, 1.4), ...nerve(AX.sural2, 1.2)]);
  }

  // Plesso pudendo, nervo pudendo e canale di Alcock.
  #pudendal() {
    const PUD = 0xd2477a;
    this.addPart('pud', 'nervo pudendo', PUD, nerve(RE.pud, [2.4, 2.2], { seg: 70 }));
    this.addPart('pudRect', 'nervo emorroidale (rettale) inferiore', 0xe58fb0, nerve(RE.rect, [1.4, 1.1]));
    this.addPart('pudPerin', 'nervo perineale', 0xa83a8e, nerve(RE.perin, [1.6, 1.2]));
    const k = AX.pudZA.findIndex((p) => p[1] < 22);
    this.addPart('pudDors', 'nervo dorsale del pene o del clitoride', 0xf07aa0, nerve([...RE.dors, ...AX.pudZA.slice(k)], [1.7, 1.3], { seg: 50 }));
    const sleeve = taperTube(RE.alcock.map((p) => mm(...p)), 5.4 * S, { seg: 40, radial: 16, flat: { x: 0.8 } });
    this.addPart('alcock', 'canale di Alcock (sdoppiamento della fascia otturatoria)', 0x3f6fe0, [sleeve], { opacity: 0.5 });
  }
}
