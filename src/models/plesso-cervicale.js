// Modello del plesso cervicale destro: testa, collo e torace fino al diaframma,
// con il nervo frenico seguito fino alla cupola diaframmatica.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/plesso-cervicale.glb,
// manifesto in meshes/plesso-cervicale.json): cranio e mandibola, vertebre
// C1-C7 e T1-T9 con i dischi, osso ioide, laringe e trachea, clavicola, coste
// 1-7 con le cartilagini, sterno; muscoli sternocleidomastoideo, scaleni,
// elevatore della scapola, trapezio (parte superiore), platisma, sternoioideo,
// omoioideo, sternotiroideo, tiroioideo, genioioideo, diaframma (diviso in due
// metà sul piano mediano); carotide comune e interna, vene giugulari interna
// ed esterna, arteria e vena succlavia, vena brachiocefalica destra e cava
// superiore, atrio destro, resto del cuore con aorta e tronco polmonare, cava
// inferiore; parotide, padiglione auricolare (in frammenti); nervi ipoglosso,
// vago (tratto cervicale), accessorio, gangli spinali cervicali, radici del
// plesso brachiale. Di queste ultime fa parte, in Z-Anatomy, anche il RAMO
// ANTERIORE DI C4 con il suo ramo per C5: è l'unico tratto reale del plesso
// cervicale (parte `r4`).
//   - I nervi reali sono tubi di 0,4-0,7 mm di raggio: qui vengono ingrossati
//     lungo le normali (`inflate`); il decorso è quello reale, il calibro è una
//     scelta di rappresentazione.
//   - Livelli controllati sullo scheletro dello stesso atlante: i gangli
//     spinali stanno a z 1530 (C2, tra arco dell'atlante e lamina dell'epistrofeo),
//     1518 (C3, foro C2-C3), 1504 (C4, foro C3-C4), 1490 (C5, foro C4-C5) e le
//     radici del plesso brachiale partono dai gangli giusti: qui, a differenza
//     del plesso lombare, non c'era nulla da correggere.
//
// RICOSTRUITO A MANO: tutto il plesso cervicale tranne C4. In Z-Anatomy il
// plesso cervicale e il nervo frenico non esistono (c'è solo un'etichetta
// «Cervical plexus.j» senza geometria). Sono stati rifatti dentro l'anatomia reale:
//   - rami anteriori di C1 (sopra l'arco posteriore dell'atlante, attorno alla
//     massa laterale), C2 (dal ganglio reale, tra atlante ed epistrofeo) e C3
//     (dal ganglio reale, dal foro C2-C3);
//   - le tre anse (superiore C1-C2, media C2-C3, inferiore C3-C4), davanti ai
//     processi trasversi, tra scaleno anteriore e scaleno medio/elevatore;
//   - rami cutanei: piccolo occipitale, grande auricolare, trasverso del collo,
//     tronco sopraclavicolare con i rami mediale, intermedio e laterale. I
//     tratti a contatto con lo sternocleidomastoideo, la parotide e il cranio
//     sono stati appoggiati alla superficie delle mesh reali (punto più vicino
//     della superficie più 1,3-2,2 mm), con uno script; il «punto nervoso» è il
//     punto del margine posteriore reale dello sternocleidomastoideo al livello
//     dell'osso ioide e del disco C3-C4;
//   - fibre di C1 per il nervo ipoglosso, radice superiore (dall'ipoglosso
//     reale, sulla faccia anteriore della carotide reale) e radice inferiore (da
//     C2 e C3, sul lato laterale della giugulare interna reale) dell'ansa
//     cervicale, ansa e rami per i muscoli sottoioidei reali, rami tiroioideo e
//     genioioideo, rami anastomotici per il nervo accessorio reale;
//   - nervo frenico: radici da C3, C4 (dal ramo reale) e C5 (dalla radice reale
//     del plesso brachiale), tratto sulla faccia anteriore dello scaleno anteriore
//     reale da laterale a mediale, passaggio tra arteria succlavia (dietro) e vena
//     succlavia (davanti), poi lungo la parete laterale di vena brachiocefalica,
//     cava superiore e atrio destro reali fino al diaframma accanto all'orifizio
//     della cava inferiore; rami sulla cupola (quota presa dalla mesh) e ramo pericardico;
//   - ganglio cervicale superiore (un fuso davanti al lungo della testa: in
//     Z-Anatomy il tronco del simpatico è troppo mediale e i gangli sono puntini).
// Fonti lette (nessun'altra):
//   - «Cervical plexus», https://en.wikipedia.org/wiki/Cervical_plexus
//     (rami anteriori C1-C4; profondo allo sternocleidomastoideo e alla giugulare
//     interna, davanti a scaleno medio ed elevatore della scapola; rami cutanei
//     dal punto nervoso a metà del margine posteriore; livelli: piccolo
//     occipitale C2, grande auricolare e trasverso C2-C3, sopraclavicolari C3-C4;
//     fibre di C1 con l'ipoglosso per tiroioideo e genioioideo)
//   - «The Cervical Plexus», https://teachmeanatomy.info/neck/nerves/cervical-plexus/
//     (stessi livelli; rami muscolari profondi e diretti in avanti e medialmente,
//     rami cutanei diretti indietro; punto nervoso)
//   - «Ansa cervicalis», https://en.wikipedia.org/wiki/Ansa_cervicalis
//     (radice superiore: fibre di C1 che lasciano l'ipoglosso nel triangolo
//     carotideo e scendono davanti a carotide interna e comune, ramo per il ventre
//     superiore dell'omoioideo; radice inferiore da C2-C3, gira attorno al lato
//     laterale della giugulare interna; ansa sulla guaina carotidea; rami per
//     sternoioideo, sternotiroideo, ventre inferiore dell'omoioideo)
//   - «Lesser occipital nerve», https://en.wikipedia.org/wiki/Lesser_occipital_nerve
//     (gira attorno all'accessorio, risale lungo il margine posteriore dello
//     sternocleidomastoideo, prosegue sul cuoio capelluto dietro il padiglione;
//     rami auricolare, mastoideo, occipitale)
//   - «Great auricular nerve», https://en.wikipedia.org/wiki/Great_auricular_nerve
//     (gira attorno al margine posteriore, sale quasi verticale sul muscolo
//     accanto alla giugulare esterna fino alla parotide; rami anteriore e posteriore)
//   - «Transverse cervical nerve», https://en.wikipedia.org/wiki/Transverse_cervical_nerve
//     (gira a metà del margine posteriore, passa in avanti sotto la giugulare
//     esterna, rami ascendente e discendente sotto il platisma)
//   - «Supraclavicular nerves», https://en.wikipedia.org/wiki/Supraclavicular_nerves
//     (dal margine posteriore con gli altri rami cutanei; mediali sopra capo
//     clavicolare e giugulare esterna, intermedi sopra la clavicola, laterali
//     su trapezio e acromion)
//   - «Nerve point of neck», https://en.wikipedia.org/wiki/Nerve_point_of_neck
//     (punto sul margine posteriore dello sternocleidomastoideo; l'accessorio
//     emerge circa 1 cm più in alto)
//   - «Phrenic nerve», https://en.wikipedia.org/wiki/Phrenic_nerve e
//     «The Phrenic Nerve», https://teachmeanatomy.info/neck/nerves/phrenic/
//     (C3-C5, soprattutto C4; nasce al margine laterale dello scaleno anteriore e
//     ne scende obliquo la faccia anteriore; dietro la vena succlavia e davanti
//     all'arteria; a destra lungo il pericardio dell'atrio destro, attraverso
//     l'orifizio della vena cava a T8)
// VERIFICATO sulle fonti: livelli di origine, rapporti con sternocleidomastoideo,
// scaleni, giugulari, carotide, succlavie, atrio destro, ordine dei rami.
// STIMATO, non tratto da una fonte: la posizione millimetrica di rami e anse
// davanti ai processi trasversi, il decorso di C1 attorno alla massa laterale
// (in Z-Anatomy manca il ganglio di C1), l'altezza esatta del punto nervoso
// (qui al livello di ioide e disco C3-C4, come negli appunti; le fonti dicono
// «a metà» o «tra terzo superiore e medio» del margine), i punti in cui le radici
// dell'ansa e i suoi rami si staccano, i tratti sottocutanei terminali dei rami
// cutanei (in Z-Anatomy non c'è la cute), i rami del frenico sul diaframma,
// forma e posizione del ganglio cervicale superiore, tutti i calibri.
// In Z-Anatomy il nervo accessorio scende profondo, nel piano del plesso, e non
// attraverso lo sternocleidomastoideo: i rami ricostruiti gli girano attorno.
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

// Da millimetri Z-Anatomy (x verso sinistra, y verso dietro, z verso l'alto)
// alle coordinate del modello; stessa terna del manifesto.
const S = 0.00148;
const O = [-15, 0, 1167];
const mm = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const tube = (pts, r, opts) =>
  taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, seg: pts.length * 3, caps: false, ...opts });
const FLOOR = 0.026; // piano di taglio sotto la cupola del diaframma

// Linee d'asse dei nervi ricostruiti, in mm Z-Anatomy.
const P = {
  r1: [[-15.0,33.0,1546.5],[-17.3,31.8,1548.2],[-19.7,30.7,1549.8],[-21.9,29.2,1551.3],[-24.0,27.0,1552.5],[-26.0,24.5,1553.4],[-27.9,21.9,1554.1],[-29.2,19.0,1554.4],[-30.3,16.0,1554.5],[-31.2,13.1,1554.2],[-31.7,10.5,1553.3],[-31.8,8.0,1552.2],[-31.9,5.9,1550.7],[-31.7,4.5,1548.7],[-31.3,3.5,1546.3],[-31.0,2.5,1544.0]],
  r2: [[-12.5,30.0,1530.5],[-15.8,29.5,1531.0],[-19.1,28.8,1531.4],[-22.5,27.8,1531.8],[-25.4,26.3,1531.8],[-27.2,24.3,1531.5],[-28.3,22.2,1531.0],[-29.2,20.0,1530.4],[-29.7,17.7,1529.5],[-29.8,15.3,1528.5],[-29.9,13.0,1527.4],[-29.7,10.8,1526.0],[-29.3,8.7,1524.5],[-29.0,6.5,1523.0]],
  r3: [[-14.0,18.0,1518.0],[-16.5,16.2,1517.0],[-19.0,14.5,1515.9],[-21.5,12.8,1514.8],[-23.8,11.2,1513.6],[-25.8,9.9,1512.5],[-27.7,8.8,1511.4],[-30.0,7.5,1510.0]],
  a1: [[-31.0,2.5,1544.0],[-32.5,2.5,1541.0],[-33.6,2.7,1538.1],[-34.1,3.1,1535.3],[-34.2,3.5,1532.7],[-33.8,4.1,1530.1],[-32.5,4.8,1527.7],[-30.8,5.7,1525.3],[-29.0,6.5,1523.0]],
  a2: [[-29.0,6.5,1523.0],[-31.1,6.0,1521.2],[-32.8,5.7,1519.2],[-33.5,5.8,1516.5],[-33.1,6.1,1513.8],[-31.8,6.8,1511.8],[-30.0,7.5,1510.0]],
  a3: [[-30.0,7.5,1510.0],[-32.0,6.9,1508.0],[-33.5,6.4,1505.7],[-34.1,6.2,1502.8],[-33.8,6.2,1499.7],[-32.4,6.5,1497.2],[-30.5,7.0,1494.8]],
  c1xii: [[-32.0,4.5,1550.3],[-31.5,1.8,1551.7],[-30.6,-0.8,1552.8],[-29.1,-3.0,1553.8],[-27.2,-5.0,1554.5]],
  lo: [[-32.4,5.8,1519.7],[-35.2,9.1,1519.6],[-37.5,11.8,1519.8],[-39.7,14.1,1520.2],[-42.3,16.7,1521.0],[-45.2,19.2,1522.1],[-46.8,20.9,1524.9],[-48.4,22.4,1527.7],[-49.9,23.6,1530.6],[-51.1,25.0,1534.1],[-52.2,26.8,1537.7],[-53.1,28.6,1541.0],[-53.9,30.4,1544.4],[-54.8,32.2,1547.9],[-55.7,34.0,1551.4],[-56.4,36.3,1555.2],[-56.5,38.8,1558.1],[-56.3,41.2,1561.1],[-56.4,43.5,1565.0],[-55.9,46.1,1567.7],[-55.9,48.3,1570.7]],
  lo2: [[-55.9,48.3,1570.7],[-57.9,49.5,1573.5],[-60.0,50.6,1576.3],[-61.3,51.3,1579.3],[-61.3,51.1,1582.6],[-61.9,51.3,1586.0],[-62.4,51.5,1588.7],[-64.2,51.8,1593.5]],
  loMast: [[-64.2,51.8,1593.5],[-65.8,49.2,1595.7],[-67.4,46.6,1597.8],[-69.0,44.0,1600.0],[-69.9,40.7,1602.0],[-70.8,37.4,1603.9],[-71.7,34.1,1605.9],[-72.5,30.9,1607.1],[-73.2,27.2,1608.4],[-73.3,23.9,1609.8]],
  loOcc: [[-64.2,51.8,1593.5],[-63.8,55.2,1596.3],[-63.3,58.6,1599.2],[-62.7,61.9,1602.1],[-61.8,64.7,1603.9],[-60.9,67.6,1605.8],[-59.8,70.7,1607.5],[-57.9,73.8,1609.5],[-51.1,72.6,1612.5],[-49.0,75.0,1614.1],[-46.9,77.6,1616.1],[-47.2,81.1,1616.5]],
  loOcc2: [[-64.2,51.8,1593.5],[-62.8,55.2,1592.3],[-60.8,58.2,1591.5],[-57.7,60.6,1591.2],[-55.2,64.3,1589.8],[-52.8,67.5,1588.4],[-49.9,70.3,1587.4],[-47.7,72.6,1587.0],[-45.0,74.9,1586.7],[-42.3,77.1,1586.3],[-39.6,79.4,1586.0]],
  ga: [[-33.5,5.8,1516.7],[-34.5,9.0,1515.3],[-36.1,11.7,1512.7],[-38.2,13.5,1509.8],[-40.4,14.0,1507.4],[-42.3,12.7,1505.7],[-44.2,10.7,1504.4],[-46.8,8.6,1506.8],[-48.3,7.7,1511.0],[-49.9,6.9,1515.3],[-50.8,6.5,1519.3],[-51.6,6.5,1523.2],[-52.2,6.4,1527.2],[-53.0,6.3,1531.0],[-53.5,6.4,1534.6],[-54.1,6.8,1538.1],[-54.2,7.0,1542.6],[-54.4,7.7,1547.4]],
  gaAnt: [[-54.4,7.7,1547.4],[-55.6,4.1,1549.3],[-55.8,-0.7,1552.1],[-53.9,-8.2,1557.1],[-55.8,-9.2,1558.1],[-57.4,-11.0,1559.1],[-58.9,-15.4,1559.6],[-60.2,-17.9,1560.6],[-61.5,-21.9,1560.8],[-63.2,-24.4,1562.1]],
  gaPost: [[-54.4,7.7,1547.4],[-56.3,9.1,1550.6],[-58.1,10.6,1553.8],[-59.8,12.0,1557.0],[-61.0,13.3,1560.0],[-62.0,14.7,1563.0],[-63.0,15.8,1566.1],[-64.0,16.3,1569.3],[-65.0,16.7,1572.7],[-66.0,17.0,1576.0]],
  tc: [[-32.8,6.3,1513.3],[-34.3,9.5,1511.3],[-36.4,12.3,1508.5],[-38.7,13.9,1506.0],[-40.8,14.0,1504.3],[-42.4,12.4,1503.1],[-43.8,9.6,1502.2],[-45.4,6.3,1499.9],[-46.4,2.5,1499.6],[-46.7,-1.0,1499.0],[-46.8,-4.6,1498.4],[-46.2,-7.6,1497.6],[-45.3,-12.2,1497.5],[-43.7,-16.0,1497.3],[-40.1,-20.1,1497.8],[-36.2,-22.0,1497.2],[-31.5,-22.6,1496.5]],
  tcUp: [[-31.5,-22.6,1496.5],[-29.8,-26.3,1499.2],[-28.2,-29.6,1502.0],[-27.0,-32.0,1504.7],[-26.0,-34.0,1507.3],[-25.0,-35.9,1510.1],[-24.0,-37.7,1513.0],[-23.0,-39.3,1516.0],[-22.0,-41.0,1519.0]],
  tcDown: [[-31.5,-22.6,1496.5],[-29.2,-26.3,1494.2],[-27.3,-29.4,1491.7],[-25.8,-31.3,1488.7],[-24.7,-32.7,1485.3],[-23.5,-33.8,1481.9],[-22.3,-34.7,1478.3],[-21.2,-35.3,1474.7],[-20.0,-36.0,1471.0]],
  sc: [[-34.1,6.2,1502.6],[-35.5,8.7,1502.1],[-38.4,12.0,1500.5],[-41.6,13.0,1499.5],[-43.7,9.7,1499.9],[-45.2,10.0,1494.9],[-46.4,10.0,1490.4],[-47.3,9.7,1486.7],[-48.2,9.3,1483.3],[-49.0,9.0,1480.0],[-49.7,8.7,1476.7],[-50.3,8.3,1473.3],[-51.0,8.0,1470.0]],
  scMed: [[-51.0,8.0,1470.0],[-51.0,5.3,1466.3],[-51.0,2.7,1462.7],[-51.0,-0.0,1459.2],[-51.0,-2.8,1456.0],[-51.0,-5.5,1453.0],[-51.0,-8.2,1450.0],[-51.0,-11.0,1447.1],[-51.0,-13.6,1444.4],[-51.0,-16.2,1441.8],[-51.0,-18.8,1439.2],[-50.6,-21.4,1436.5],[-49.4,-23.8,1433.4],[-50.1,-26.3,1431.0],[-50.3,-28.9,1428.5],[-49.8,-31.1,1425.5],[-49.2,-33.2,1422.5],[-48.8,-35.4,1419.6],[-47.7,-37.2,1418.0],[-46.5,-38.9,1416.3],[-45.1,-42.7,1413.7],[-43.5,-46.0,1410.6],[-41.8,-48.1,1407.9],[-39.8,-50.0,1405.0],[-37.5,-52.0,1402.0],[-35.2,-54.0,1399.0],[-33.1,-55.8,1395.9],[-31.0,-57.3,1392.7],[-29.0,-58.7,1389.3],[-27.0,-60.0,1386.0]],
  scInt: [[-51.0,8.0,1470.0],[-52.7,6.3,1466.3],[-54.3,4.7,1462.7],[-56.1,3.0,1459.1],[-58.0,1.2,1455.8],[-60.0,-0.5,1452.5],[-62.0,-2.2,1449.2],[-64.0,-4.0,1446.1],[-65.8,-5.8,1443.2],[-67.6,-7.6,1440.4],[-69.4,-9.4,1437.6],[-71.2,-11.2,1434.8],[-73.0,-13.1,1432.0],[-75.0,-15.2,1429.0],[-77.0,-17.5,1426.0],[-79.0,-19.8,1423.0],[-80.9,-22.1,1420.0],[-82.5,-24.5,1417.0],[-84.0,-27.0,1414.0],[-85.5,-29.5,1411.0],[-86.8,-31.9,1408.0],[-87.8,-34.0,1405.0],[-88.5,-36.0,1402.0],[-89.2,-38.0,1399.0],[-90.0,-40.0,1396.0]],
  scLat: [[-51.0,8.0,1470.0],[-53.3,9.0,1467.0],[-55.7,10.0,1464.0],[-58.2,11.0,1461.1],[-61.0,12.0,1458.2],[-64.0,13.0,1455.5],[-67.0,14.0,1452.8],[-70.0,15.0,1450.2],[-73.2,16.0,1448.2],[-76.4,17.0,1446.4],[-79.6,18.0,1444.6],[-82.8,19.0,1442.8],[-86.1,20.1,1441.2],[-89.6,21.4,1439.8],[-93.2,22.8,1438.6],[-96.8,24.2,1437.4],[-100.4,25.6,1436.2],[-104.0,26.9,1435.1],[-106.5,28.3,1431.0],[-106.9,29.9,1421.2],[-112.3,31.7,1426.9],[-113.0,35.6,1421.9],[-119.7,36.0,1426.4],[-122.2,41.9,1422.2],[-129.0,37.5,1427.0],[-134.0,36.8,1428.0],[-137.8,38.1,1427.0],[-141.2,39.7,1425.9],[-144.5,41.5,1424.7],[-147.6,43.2,1422.7],[-150.0,44.0,1419.0]],
  supRoot: [[-27.0,-12.0,1540.0],[-28.5,-10.5,1535.5],[-29.9,-9.1,1531.2],[-31.2,-7.8,1527.3],[-32.3,-6.6,1523.7],[-33.5,-5.2,1520.0],[-33.6,-5.0,1516.3],[-33.6,-4.9,1512.5],[-33.6,-4.8,1508.8],[-33.6,-4.8,1505.0],[-33.1,-4.8,1501.2],[-32.6,-4.8,1497.5],[-32.1,-5.0,1493.7],[-31.6,-5.2,1489.9],[-31.2,-2.2,1485.9],[-30.3,-2.5,1481.4],[-29.3,-3.3,1477.0],[-28.3,-4.3,1472.9],[-27.3,-5.4,1468.9],[-26.2,-6.5,1464.9],[-25.2,-7.7,1461.0],[-23.8,-8.9,1457.1]],
  infRoot: [[-30.4,6.2,1521.8],[-31.8,4.9,1518.8],[-33.2,3.8,1515.9],[-34.7,3.0,1512.7],[-36.8,2.0,1508.7],[-37.4,-2.3,1504.0],[-35.7,-4.1,1500.0],[-33.8,-5.6,1496.2],[-33.6,-6.2,1492.9],[-33.2,-7.0,1489.6],[-32.8,-8.0,1486.2],[-32.5,-8.8,1482.7],[-32.5,-9.7,1479.3],[-32.6,-10.5,1475.9],[-33.2,-12.1,1471.3],[-34.1,-13.6,1466.8],[-34.7,-15.5,1463.4],[-35.1,-17.1,1459.8]],
  infRoot3: [[-30.0,7.5,1510.0],[-32.5,5.5,1508.5],[-34.4,3.4,1507.0],[-35.2,1.1,1505.3],[-35.5,-1.2,1503.6]],
  ansa: [[-23.8,-8.9,1457.1],[-23.3,-9.3,1455.5],[-22.9,-9.8,1453.8],[-22.4,-10.3,1452.2],[-21.9,-10.7,1450.6],[-22.2,-10.8,1449.5],[-23.3,-10.6,1449.3],[-31.4,-22.9,1451.3],[-33.1,-21.8,1453.1],[-34.4,-20.4,1454.9],[-25.5,-8.0,1456.8],[-35.1,-17.1,1459.8]],
  nOmoSup: [[-33.1,-4.8,1501.2],[-31.7,-7.0,1498.2],[-30.3,-9.3,1495.1],[-28.8,-11.5,1492.1],[-27.4,-13.8,1489.0],[-25.7,-16.3,1486.2],[-23.2,-19.2,1483.8],[-20.5,-22.5,1481.5]],
  nSternohyoid: [[-22.9,-9.8,1453.8],[-22.6,-13.0,1450.5],[-22.3,-16.3,1447.3],[-22.1,-18.9,1444.0],[-22.2,-20.3,1440.7],[-22.3,-21.2,1437.3],[-22.5,-22.0,1434.0]],
  nSternothyroid: [[-23.3,-9.3,1455.5],[-23.0,-11.2,1451.7],[-22.8,-13.1,1447.8],[-22.5,-14.6,1444.0],[-22.1,-15.4,1440.2],[-21.8,-15.8,1436.5],[-21.4,-16.1,1432.8],[-21.0,-16.5,1429.0]],
  nOmoInf: [[-34.4,-20.4,1454.9],[-36.1,-18.3,1452.4],[-37.8,-16.1,1450.0],[-39.5,-14.0,1447.6],[-41.2,-12.0,1445.3],[-42.8,-10.0,1443.2],[-44.5,-8.0,1441.0]],
  nThyro: [[-23.0,-23.0,1528.0],[-23.5,-22.0,1524.3],[-24.0,-21.0,1520.7],[-24.4,-20.0,1517.0],[-24.5,-19.0,1513.3],[-24.5,-18.0,1509.7],[-24.3,-17.1,1506.1],[-23.7,-16.5,1502.7],[-22.8,-16.0,1499.3],[-21.9,-15.6,1496.1],[-20.9,-15.2,1493.0],[-19.8,-15.0,1490.0]],
  nGenio: [[-17.0,-41.0,1517.5],[-14.8,-42.5,1515.8],[-11.9,-44.1,1513.7],[-8.0,-46.0,1511.0]],
  xiC2: [[-31.4,6.0,1520.9],[-33.3,5.8,1521.7],[-35.1,5.9,1522.3],[-36.6,6.8,1522.4]],
  xiC3: [[-33.6,6.4,1505.2],[-35.1,9.9,1503.6],[-36.2,13.5,1502.2],[-36.9,17.2,1501.2],[-37.2,21.0,1500.4],[-37.1,24.8,1499.8],[-37.0,28.5,1499.3]],
  phC3: [[-30.0,7.5,1510.0],[-30.9,6.9,1507.7],[-31.7,6.2,1505.3],[-32.3,5.6,1502.8],[-32.4,5.1,1500.0],[-32.2,4.6,1497.0],[-31.9,4.0,1494.0],[-31.5,3.5,1491.0]],
  phC4: [[-31.0,7.0,1494.2],[-31.4,5.2,1492.6],[-31.5,3.5,1491.0]],
  phNeck: [[-31.5,3.5,1491.0],[-30.9,1.9,1486.4],[-29.9,0.8,1481.4],[-30.5,-0.7,1478.5],[-30.8,-2.1,1475.4],[-31.0,-3.0,1472.0],[-31.8,-3.5,1468.7],[-32.4,-3.9,1465.3],[-33.5,-4.6,1462.0],[-34.1,-5.4,1458.7],[-33.9,-6.3,1454.9],[-34.7,-7.4,1451.9],[-35.2,-7.9,1448.7],[-35.9,-8.1,1445.3],[-36.4,-8.3,1442.1],[-37.2,-8.5,1438.8],[-38.2,-8.5,1435.6],[-39.2,-8.5,1432.6],[-40.6,-8.1,1429.0],[-41.8,-7.4,1425.2]],
  phC5: [[-31.0,12.0,1479.4],[-33.1,9.4,1477.6],[-34.9,6.7,1475.7],[-36.2,3.8,1473.7],[-36.7,1.0,1471.3],[-36.5,-1.4,1468.7],[-35.6,-4.0,1465.8],[-33.5,-4.6,1462.0]],
  phPoint: [[-41.8,-7.4,1425.2],[-40.7,-7.3,1422.5],[-39.6,-7.1,1419.7],[-38.5,-7.2,1417.0],[-37.3,-7.5,1414.3],[-36.2,-8.0,1411.7],[-35.0,-8.8,1409.0],[-33.8,-10.0,1406.3],[-32.7,-11.5,1403.7],[-31.5,-13.0,1401.0]],
  phThorax: [[-31.5,-13.0,1401.0],[-31.0,-15.0,1397.3],[-30.1,-17.0,1393.7],[-28.4,-19.0,1390.3],[-27.5,-20.5,1385.2],[-26.6,-22.0,1380.2],[-26.5,-20.6,1374.8],[-27.1,-19.1,1369.9],[-27.7,-18.1,1364.9],[-28.3,-17.2,1359.8],[-29.0,-16.6,1354.9],[-29.7,-16.0,1349.9],[-30.4,-15.7,1344.9],[-32.0,-15.5,1340.1],[-32.9,-15.8,1335.0],[-33.6,-16.1,1329.9],[-34.4,-14.6,1324.8],[-35.4,-13.0,1319.7],[-36.7,-11.7,1314.8],[-37.6,-10.5,1309.9],[-38.2,-10.0,1304.9],[-38.7,-9.5,1299.9],[-38.8,-10.0,1295.0],[-38.6,-10.5,1290.0],[-38.3,-11.7,1285.0],[-37.8,-13.0,1280.1],[-37.3,-14.3,1276.0],[-36.4,-15.5,1272.0],[-35.4,-16.5,1268.4],[-34.3,-17.6,1264.8],[-31,-19,1259.5]],
  phDiaAnt: [[-31,-19,1259.5],[-32,-30,1261.0],[-34,-42,1261.6],[-37,-55,1261.2],[-40,-68,1259.4],[-42,-80,1256.1]],
  phDiaLat: [[-31,-19,1259.5],[-40,-20,1261.8],[-52,-20,1263.2],[-65,-18,1263.7],[-78,-15,1263.2],[-92,-12,1260.6]],
  phDiaPost: [[-31,-19,1259.5],[-36,-8,1259.3],[-42,4,1259.1],[-48,16,1259.0],[-53,28,1254.4],[-56,40,1245.8]],
  phPeric: [[-38.8,-10.0,1295.0],[-38.0,-12.7,1297.8],[-37.2,-15.3,1300.7],[-36.4,-18.0,1303.5],[-35.6,-20.7,1306.3],[-34.9,-23.4,1309.2],[-34.2,-26.1,1312.1],[-33.8,-29.3,1310.3],[-33.6,-32.4,1308.5],[-28.4,-34.6,1305.6],[-28.1,-37.8,1303.8],[-27.3,-40.9,1302.0],[-26.1,-44.0,1300.0],[-24.6,-47.1,1298.0],[-22.9,-49.9,1296.0]],
};
const NP = [-43.9, 9.8, 1502.1]; // punto nervoso: margine posteriore reale dello sternocleidomastoideo

const BONE = 0xe9dfc8, MUSCLE = 0xb9584c;
const RAMUS = 0xfff06a, ANSA = 0x2f6fe0;
const LO = 0x8e5bb5, GA = 0xd9628f, TC = 0x2a9d9d, SC = 0xe0662f, AC = 0x2f9a63, PH = 0xe8b21e;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  skull: ['cranio', BONE],
  mandible: ['mandibola', BONE],
  atlas: ['atlante (C1)', BONE],
  axis: ['epistrofeo (C2)', BONE],
  vC3: ['vertebra C3', BONE],
  vC4: ['vertebra C4', BONE],
  vC5: ['vertebra C5', BONE],
  vC6: ['vertebra C6', BONE],
  vC7: ['vertebra C7', BONE],
  discs: ['dischi intervertebrali', 0xbfd0d6],
  thoracic: ['vertebre toraciche', BONE],
  hyoid: ['osso ioide', 0xf1e2b8],
  larynx: ['laringe e trachea', 0xc9d6dc],
  clavicle: ['clavicola', BONE],
  rib1: ['prima costa', BONE],
  ribs: ['coste', BONE, { ghost: true, opacity: 0.2 }],
  sternum: ['sterno', BONE],
  scm: ['muscolo sternocleidomastoideo', MUSCLE],
  scalA: ['muscolo scaleno anteriore', 0xc67464],
  scalM: ['muscoli scaleno medio e posteriore', 0xa5564b],
  levator: ['muscolo elevatore della scapola', 0x9c5a52],
  trapezius: ['muscolo trapezio', 0xb36f5f],
  platysma: ['muscolo platisma', 0xd9a08f, { ghost: true, opacity: 0.22 }],
  sternohyoid: ['muscolo sternoioideo', 0xcf7a66],
  omohyoid: ['muscolo omoioideo', 0xbf6253],
  sternothyroid: ['muscolo sternotiroideo', 0xa85a66],
  thyrohyoid: ['muscolo tiroioideo', 0xd08a6c],
  geniohyoid: ['muscolo genioioideo', 0xc98a52],
  diaR: ['emidiaframma destro', 0xc46a5c, { double: true }],
  diaL: ['emidiaframma sinistro', 0xc98f84, { double: true }],
  carotid: ['arteria carotide comune e interna', 0xc23b33],
  ijv: ['vena giugulare interna', 0x4466c9],
  ejv: ['vena giugulare esterna', 0x6f8fdc],
  subA: ['arteria succlavia', 0xc23b33],
  subV: ['vena succlavia', 0x4466c9],
  svc: ['vena brachiocefalica destra e vena cava superiore', 0x4466c9],
  atrium: ['atrio destro', 0x9a5a78],
  heart: ['cuore e grossi vasi', 0xb8706a],
  ivc: ['vena cava inferiore', 0x4466c9],
  parotid: ['ghiandola parotide', 0xe6c9a0],
  auricle: ['padiglione auricolare', 0xe8c4ae, { double: true }],
  hypoglossal: ['nervo ipoglosso (XII)', 0xb9ad98],
  accessory: ['nervo accessorio (XI)', 0x9aa3bd],
  vagus: ['nervo vago (X)', 0xcfc48a],
  brachial: ['radici del plesso brachiale (C5-T1), con il ramo che ricevono da C4', 0xb9ad98],
  r4: ['ramo anteriore di C4', RAMUS],
  ganglia: ['gangli spinali cervicali', 0xf3e9b5],
};

// Raggio aggiunto ai tubi di Z-Anatomy, in mm.
const INFLATE = { hypoglossal: 0.8, accessory: 0.7, vagus: 0.9, brachial: 0.9, r4: 1.4, ganglia: 1.0 };

export class PlessoCervicale extends AnatomyModel {
  constructor() {
    super({ tilt: -0.6 });
    this.addStand({ radius: 0.2, z: 0, rod: [-0.022, 0.02, 0.07, -0.05] });
    this.rod = this.inner.children.at(-1);
    this.ready = this.#build();
  }

  // Primo piano: il modello si ingrandisce, scende sotto la pagina e si
  // inclina verso chi legge. `reset` lo riporta a posto.
  focus(drop, back, lean, scale, side = 0) {
    this.inner.position.set(-side, -drop, -back);
    this.inner.scale.setScalar(scale);
    this.inner.rotation.x = lean;
    this.rod.visible = false;
    this.flat.visible = false;
  }

  reset() {
    super.reset();
    this.inner.position.set(0, 0, 0);
    this.inner.scale.setScalar(1);
    this.inner.rotation.x = 0;
    this.rod.visible = true;
    this.flat.visible = true;
  }

  async #build() {
    await this.loadMeshes('plesso-cervicale.glb', REAL);
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d * S);
    for (const part of this.parts.values()) this.#clampFloor(part);
    // copie trasparenti dei muscoli che coprono il plesso
    this.#ghostOf('scm', 'scmG', 0.42);
    this.#ghostOf('scalA', 'scalAG', 0.4);
    this.#ghostOf('skull', 'skullG', 0.16);
    this.#ghostOf('mandible', 'mandibleG', 0.16);
    this.#plexus();
    this.#cutaneous();
    this.#ansa();
    this.#phrenic();
  }

  // Ingrossa un tubo spostando ogni vertice lungo la sua normale.
  #inflate(id, d) {
    for (const m of this.parts.get(id).meshes) {
      const p = m.geometry.attributes.position, n = m.geometry.attributes.normal;
      for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * d, p.getY(i) + n.getY(i) * d, p.getZ(i) + n.getZ(i) * d);
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }

  // Taglio netto in basso: i vertici sotto il piano vengono portati sul piano.
  #clampFloor(part) {
    for (const m of part.meshes) {
      const p = m.geometry.attributes.position;
      const y0 = FLOOR - m.position.y;
      let touched = false;
      for (let i = 0; i < p.count; i++)
        if (p.getY(i) < y0) {
          p.setY(i, y0);
          touched = true;
        }
      if (touched) {
        p.needsUpdate = true;
        m.geometry.computeVertexNormals();
      }
    }
  }

  #ghostOf(id, ghostId, opacity) {
    const part = this.parts.get(id);
    const geos = part.meshes.map((m) => m.geometry.clone().translate(m.position.x, m.position.y, m.position.z));
    this.addPart(ghostId, part.name, part.base.getHex(), geos, { ghost: true, opacity });
  }

  // Rami anteriori di C1-C3 e anse (ricostruiti; C4 è reale).
  #plexus() {
    const R = 1.9;
    this.addPart('r1', 'ramo anteriore di C1', RAMUS, [tube(P.r1, R, { caps: true })]);
    this.addPart('r2', 'ramo anteriore di C2', RAMUS, [tube(P.r2, R, { caps: true })]);
    this.addPart('r3', 'ramo anteriore di C3', RAMUS, [tube(P.r3, R, { caps: true })]);
    this.addPart('a1', 'ansa superiore (C1-C2)', ANSA, [tube(P.a1, 1.5)]);
    this.addPart('a2', 'ansa media (C2-C3)', ANSA, [tube(P.a2, 1.5)]);
    this.addPart('a3', 'ansa inferiore (C3-C4)', ANSA, [tube(P.a3, 1.5)]);
    this.addPart('scg', 'ganglio cervicale superiore del simpatico', 0x9b7fc4,
      [ellipsoid(mm(-20.5, -7.5, 1519).toArray(), [2.6 * S, 12 * S, 2.1 * S])]);
  }

  #cutaneous() {
    this.addPart('np', 'punto nervoso del collo', 0xffffff, [ellipsoid(mm(...NP).toArray(), [2.6 * S, 2.6 * S, 2.6 * S])]);
    this.addPart('lo', 'nervo piccolo occipitale', LO,
      [tube([...P.lo, ...P.lo2.slice(1)], 1.3), tube(P.loMast, [1.1, 0.7], { caps: true }), tube(P.loOcc, [1.1, 0.7], { caps: true }), tube(P.loOcc2, [1.1, 0.7], { caps: true })]);
    this.addPart('ga', 'nervo grande auricolare', GA,
      [tube(P.ga, 1.5), tube(P.gaAnt, [1.2, 0.8], { caps: true }), tube(P.gaPost, [1.2, 0.8], { caps: true })]);
    this.addPart('tc', 'nervo trasverso del collo', TC,
      [tube(P.tc, 1.3), tube(P.tcUp, [1.1, 0.7], { caps: true }), tube(P.tcDown, [1.1, 0.7], { caps: true })]);
    this.addPart('sc', 'tronco sopraclavicolare', SC, [tube(P.sc, 1.5)]);
    this.addPart('scMed', 'nervo sopraclavicolare mediale', 0xea8a4a, [tube(P.scMed, [1.2, 0.8], { caps: true })]);
    this.addPart('scInt', 'nervo sopraclavicolare intermedio', 0xd9772f, [tube(P.scInt, [1.2, 0.8], { caps: true })]);
    this.addPart('scLat', 'nervo sopraclavicolare laterale', 0xc65a1e, [tube(P.scLat, [1.2, 0.8], { caps: true })]);
  }

  #ansa() {
    this.addPart('c1xii', "fibre di C1 che si uniscono all'ipoglosso", 0x9fd28a, [tube(P.c1xii, 1.2)]);
    this.addPart('supRoot', "radice superiore dell'ansa cervicale", 0x58b889, [tube(P.supRoot, 1.3)]);
    this.addPart('infRoot', "radice inferiore dell'ansa cervicale (C2-C3)", 0x1f7a4c, [tube(P.infRoot, 1.3), tube(P.infRoot3, 1.1)]);
    this.addPart('ansa', "ansa cervicale (ansa dell'ipoglosso)", AC, [tube(P.ansa, 1.3)]);
    this.addPart('ansaRami', "rami dell'ansa per i muscoli sottoioidei", 0x7bcf9c,
      [P.nOmoSup, P.nSternohyoid, P.nSternothyroid, P.nOmoInf].map((p) => tube(p, [1.0, 0.7], { caps: true })));
    this.addPart('nThyro', 'ramo per il muscolo tiroioideo', 0x9fd28a, [tube(P.nThyro, [1.0, 0.7], { caps: true })]);
    this.addPart('nGenio', 'ramo per il muscolo genioioideo', 0x9fd28a, [tube(P.nGenio, [1.0, 0.7], { caps: true })]);
    this.addPart('xiRami', 'rami anastomotici per il nervo accessorio', 0x6f7fd0, [tube(P.xiC2, 1.0), tube(P.xiC3, 1.0)]);
  }

  #phrenic() {
    const R = 1.8;
    this.addPart('phC3', 'radice del nervo frenico da C3', 0xf0cf5a, [tube(P.phC3, 1.2)]);
    this.addPart('phC4', 'radice del nervo frenico da C4', 0xf0cf5a, [tube(P.phC4, 1.6)]);
    this.addPart('phC5', 'radice del nervo frenico da C5', 0xf0cf5a, [tube(P.phC5, 1.2)]);
    this.addPart('phNeck', 'nervo frenico, sullo scaleno anteriore', PH, [tube(P.phNeck, R)]);
    this.addPart('phPoint', 'nervo frenico, tra arteria e vena succlavia (punto frenico)', PH, [tube(P.phPoint, R)]);
    this.addPart('phThorax', 'nervo frenico, nel mediastino', PH, [tube(P.phThorax, R)]);
    this.addPart('phDia', 'rami del nervo frenico per il diaframma', 0xd9a03c,
      [P.phDiaAnt, P.phDiaLat, P.phDiaPost].map((p) => tube(p, [1.4, 0.8], { caps: true })));
    this.addPart('phPeric', 'ramo pericardico del nervo frenico', 0xd9a03c, [tube(P.phPeric, [1.1, 0.7], { caps: true })]);
  }
}
