// Modello della base cranica vista dall'alto, a calotta rimossa.
//
// MESH REALI (BodyParts3D, public/meshes/base-cranica.glb, vedi meshes/base-cranica.json):
// frontale, etmoide (con crista galli), sfenoide (diviso in piccole ali, corpo, grandi
// ali, parte sfenoidale del clivo), temporali (faccia antero-laterale e squama / faccia
// postero-mediale), occipitale (parte basilare / resto), parietali; tronco encefalico,
// ipofisi, nervi ottici e chiasma, arterie oftalmiche, carotidi interne, arterie
// vertebrali e basilare, rami del nervo oculomotore nell'orbita, nervo trocleare, nervo
// oftalmico con frontale, lacrimale e nasociliare, nervi etmoidali.
// La volta è tagliata nel manifesto (`split`) lungo un piano inclinato, più basso
// dietro; qui il bordo viene portato sul piano e chiuso con una superficie di sezione.
//
// RICOSTRUITO A MANO nella stessa terna (coordinate BodyParts3D in millimetri, convertite
// da `mm`), agganciato alle aperture e ai rilievi delle ossa reali, individuati con
// sezioni e raggi sulle mesh (forame ovale, forame lacero, forame magno, foro giugulare,
// meato acustico interno, canale ottico esistono come aperture o fossette nelle mesh;
// forame rotondo, forame spinoso, fessura orbitaria superiore, canale dell'ipoglosso,
// iati petrosi, fori etmoidali, canale condilare e forame mastoideo non sono risolti
// dalle mesh e sono posti secondo i rapporti anatomici):
// - anelli che segnano i fori, con una presa invisibile un po' più larga (vedi `#holes`);
//   filuzzi olfattivi; vena emissaria del foro cieco;
// - tronco del nervo oculomotore, nervo abducente, radice e ganglio del trigemino,
//   nervi mascellare e mandibolare, nervi grande e piccolo petroso;
// - arteria meningea media; nervi faciale, vestibolo-cocleare, glossofaringeo, vago,
//   accessorio, ipoglosso;
// - seni trasverso, sigmoideo, petroso superiore e inferiore, bulbo della giugulare.
//
// FONTI consultate per posizioni, calibri e rapporti delle parti ricostruite:
// - Bhattarai R et al., Morphometric analysis of foramen ovale, foramen spinosum, and
//   foramen rotundum of human skull using computed tomography scan, Ann Med Surg 2023
//   (dimensioni dei tre fori) — https://europepmc.org/article/PMC/PMC10205317
// - Liu J et al., Simultaneous endoscopic endonasal decompression of the optic canal,
//   superior orbital fissure, and proper orbital apex, Front Surg 2022 (canale ottico
//   supero-mediale alla fessura, separato dal pilastro ottico; forame rotondo sotto la
//   fessura) — https://europepmc.org/article/PMC/PMC8814317
// - Bach M et al., Morphometric analysis of the abducens nerve in the petroclival region,
//   Front Surg 2025 (decorso dell'abducente: solco bulbo-pontino, clivo, canale di
//   Dorello sotto il legamento petro-sfenoidale, seno cavernoso)
//   — https://europepmc.org/article/PMC/PMC12058666
// - Constanzo F et al., Microsurgical anatomy of the jugular foramen, Front Surg 2020
//   (pars nervosa antero-mediale e pars vascularis postero-laterale; IX, X, XI mediali
//   al bulbo; il seno petroso inferiore sbocca nel foro; tubercolo giugulare tra foro
//   giugulare e canale dell'ipoglosso) — https://europepmc.org/article/PMC/PMC7243180
// - Bayat P et al., Morphometric analysis of hypoglossal canal of the occipital bone,
//   J Craniovertebr Junction Spine 2015 (canale diretto in avanti e di lato, circa 45°
//   sul piano sagittale) — https://europepmc.org/article/PMC/PMC4530509
// - Thintharua P, Chentanez V, Morphological analysis and morphometry of the occipital
//   condyle and its relationship to the foramen magnum, jugular foramen, and hypoglossal
//   canal, Anat Cell Biol 2023 — https://europepmc.org/article/PMC/PMC9989787
// - Gözen ED et al., Computerized tomography morphometric assessment of the internal
//   acoustic meatus, J Clin Med 2026 (poro di circa 8 mm, canale di circa 11 mm)
//   — https://europepmc.org/article/PMC/PMC12897888
// Il decorso del seno trasverso segue il margine aderente del tentorio di BodyParts3D
// ("Tentorium cerebelli"), proiettato sulla parete ossea.
//
// Coordinate del modello: x laterale, y craniale, z anteriore.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, both } from '../geo.js';

// stessa terna di meshes/base-cranica.json
const S = 0.004;
const ORIGIN = [0, -80, 1450];
const mm = ([x, y, z]) => V(-(x - ORIGIN[0]) * S, (z - ORIGIN[2]) * S, -(y - ORIGIN[1]) * S);
const dir = ([x, y, z]) => V(-x, z, -y).normalize();
// piano di taglio della volta (come in `split`)
const cutY = (z) => 0.4205 + 0.174 * z;

// tubo lungo punti in millimetri, raggio in millimetri
const tube = (pts, r, opts) => taperTube(pts.map(mm), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, ...opts });
// anello attorno a un foro: centro, asse del foro, raggio (mm)
function ring(c, axis, r, t = 0.7) {
  const g = new THREE.TorusGeometry(r * S, t * S, 10, 36);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), dir(axis)));
  const p = mm(c);
  g.translate(p.x, p.y, p.z);
  return g;
}
// anello che segue un contorno chiuso
function loop(pts, t = 0.7) {
  const curve = new THREE.CatmullRomCurve3(pts.map(mm), true, 'centripetal');
  return new THREE.TubeGeometry(curve, 96, t * S, 8, true);
}
const pair = (...geos) => geos.flatMap((g) => both(g));

const BONE = 0xe9dfc8, NERVE = 0xe2b93b, ARTERY = 0xc23b3b, VEIN = 0x3b6fc4, MARK = 0x15806a;

const REAL = {
  frontal: ['osso frontale', BONE],
  ethmoid: ["lamina cribrosa dell'etmoide", BONE],
  cristaGalli: ['crista galli', 0xd9c9a3],
  sphLesser: ['piccola ala dello sfenoide', BONE],
  sphBody: ['corpo dello sfenoide (sella turcica)', BONE],
  sphGreater: ['grande ala dello sfenoide', BONE],
  clivusSph: ['clivo (parte sfenoidale)', BONE],
  tempMid: ['osso temporale: squama e faccia antero-laterale della piramide', BONE],
  tempPost: ['osso temporale: faccia postero-mediale della piramide', BONE],
  occBasilar: ["clivo (parte basilare dell'occipitale)", BONE],
  occipital: ['osso occipitale', BONE],
  parietal: ['osso parietale', BONE],
  stem: ['tronco encefalico (mesencefalo e ponte)', 0xd8b9a0, { ghost: true, opacity: 0.22 }],
  medulla: ['midollo allungato', 0xdcc0a2],
  pituitary: ['ipofisi', 0xc9728a],
  optic: ['nervo ottico (II) e chiasma', NERVE],
  ophthalmicA: ['arteria oftalmica', ARTERY],
  ica: ['arteria carotide interna', ARTERY],
  vertebral: ['arterie vertebrali e basilare', ARTERY],
  cn3: ['nervo oculomotore (III): rami superiore e inferiore', 0xd9892b],
  cn4: ['nervo trocleare (IV)', 0x8a5fc2],
  v1: ['nervo oftalmico (V1)', NERVE],
  frontalN: ['nervo frontale', NERVE],
  lacrimalN: ['nervo lacrimale', NERVE],
  nasociliaryN: ['nervo nasociliare', NERVE],
  ethmoidalN: ['nervi etmoidali anteriore e posteriore', NERVE],
};

export class BaseCranica extends AnatomyModel {
  constructor() {
    super({ tilt: 0.45 }); // inclinato verso chi legge: si guarda dentro la base
    this.addStand({ radius: 0.2, z: 0.03, rod: [0, 0.02, 0.21, 0.05] });
    this.tilt.position.z = -0.13; // il cranio sta un po' indietro, lontano dai pulsanti
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('base-cranica.glb', REAL);
    this.#cutVault({
      frontal: ['sectionF', 'osso frontale (sezione)'],
      parietal: ['sectionP', 'osso parietale (sezione)'],
      occipital: ['sectionO', 'osso occipitale (sezione)'],
    });
    this.#anterior();
    this.#middle();
    this.#posterior();
    this.#holes();
  }

  // Gli anelli dei fori sono sottili: ogni foro riceve una presa invisibile (una sfera, un
  // disco per il forame magno) che appartiene alla sua parte, così un cartellino lasciato
  // sul foro (domanda `tags`) o un tocco (domanda `point`) lo prendono anche al tocco.
  // Centri e raggi in mm: quelli degli anelli più un margine, con il centro spostato
  // un poco fuori dall'osso, verso chi guarda, dove il foro si apre.
  #holes() {
    const HOLES = {
      fSof: [[25, -121.5, 1533.5], 6], fRotundum: [[22.3, -113.2, 1516.3], 3.3], fOvale: [[24.4, -102.3, 1509.6], 3.6],
      fSpinosum: [[31, -96.2, 1507.4], 3.4], fLacerum: [[13.2, -96.3, 1511.6], 4.6], fHiatus: [[36.6, -83.1, 1518], 3.6],
      fJugular: [[31, -73.5, 1500.5], 5.5], fIam: [[24.3, -77.9, 1511.2], 4.6], fHypoglossal: [[8.8, -74.5, 1491.5], 3.4],
      fCondylar: [[25, -62.5, 1493.6], 3], fMastoid: [[56.8, -46, 1512], 3], fOptic: [[10.4, -117.2, 1531], 4.4],
    };
    const mat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: this.clipPlanes });
    const grip = (id, geos) => {
      const part = this.parts.get(id);
      for (const g of geos) {
        g.computeBoundingBox();
        const c = g.boundingBox.getCenter(new THREE.Vector3());
        g.translate(-c.x, -c.y, -c.z);
        const m = new THREE.Mesh(g, mat);
        m.position.copy(c);
        m.userData.size = g.boundingBox.getSize(new THREE.Vector3());
        m.userData.ui = part.meshes[0].userData.ui;
        m.visible = false;
        this.inner.add(m);
        part.meshes.push(m);
      }
    };
    for (const [id, [c, r]] of Object.entries(HOLES)) {
      const p = mm(c);
      grip(id, both(new THREE.SphereGeometry(r * S, 16, 12).translate(p.x, p.y, p.z)));
    }
    const pm = mm([-0.6, -59, 1485]);
    grip('fMagnum', [new THREE.CylinderGeometry(17 * S, 17 * S, 1.5 * S, 32).translate(pm.x, pm.y, pm.z)]);
  }

  // Porta sul piano di taglio il bordo frastagliato della volta e chiude la
  // sezione con un anello tra tavolato interno ed esterno.
  #cutVault(ids) {
    const N = 90;
    const at = (list, i) => list[(i + N) % N];
    for (const [id, [section, name]] of Object.entries(ids)) {
      const rin = new Array(N).fill(Infinity), rout = new Array(N).fill(0);
      for (const m of this.parts.get(id).meshes) {
        const g = m.geometry, pos = g.attributes.position, idx = g.index.array, o = m.position;
        // i vertici del bordo libero sono quelli lasciati scoperti dal taglio
        const count = new Map();
        const key = (a, b) => (a < b ? a * 1e6 + b : b * 1e6 + a);
        for (let t = 0; t < idx.length; t += 3)
          for (let k = 0; k < 3; k++) {
            const e = key(idx[t + k], idx[t + ((k + 1) % 3)]);
            count.set(e, (count.get(e) ?? 0) + 1);
          }
        const edge = new Set();
        for (const [e, n] of count)
          if (n === 1) {
            edge.add(Math.floor(e / 1e6));
            edge.add(e % 1e6);
          }
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i) + o.x, y = pos.getY(i) + o.y, z = pos.getZ(i) + o.z, c = cutY(z);
          if (y > c || (edge.has(i) && y > c - 0.04)) {
            pos.setY(i, c - o.y);
            const r = Math.hypot(x, z);
            const b = Math.floor(((Math.atan2(z, x) + Math.PI) / (2 * Math.PI)) * N) % N;
            rin[b] = Math.min(rin[b], r);
            rout[b] = Math.max(rout[b], r);
          }
        }
        pos.needsUpdate = true;
        g.computeVertexNormals();
      }
      // ogni settore si allarga ai vicini (così i due tavolati sono sempre
      // rappresentati), poi il profilo viene lisciato con una mediana mobile
      const has = rin.map((r) => Number.isFinite(r));
      const wide = (list, pick) => list.map((_, i) => pick(...[-1, 0, 1].filter((d) => at(has, i + d)).map((d) => at(list, i + d))));
      const median = (list) => list.map((_, i) => {
        const w = [-2, -1, 0, 1, 2].filter((d) => at(has, i + d)).map((d) => at(list, i + d)).sort((p, q) => p - q);
        return w[Math.floor(w.length / 2)];
      });
      const inner = median(wide(rin, Math.min)).map((r) => r + 0.002);
      const outer = median(wide(rout, Math.max)).map((r, i) => Math.min(Math.max(r - 0.002, inner[i] + 0.012), inner[i] + 0.05));
      const pos = [], index = [];
      // raggio sul confine tra il settore i-1 e il settore i
      const border = (list, i) => (at(has, i - 1) && at(has, i) ? (at(list, i - 1) + at(list, i)) / 2 : at(has, i) ? at(list, i) : at(list, i - 1));
      const edgeAt = (i) => {
        const a = (i / N) * 2 * Math.PI - Math.PI;
        for (const r of [border(inner, i), border(outer, i)]) {
          const x = r * Math.cos(a), z = r * Math.sin(a);
          pos.push(x, cutY(z) - 0.0012, z);
        }
      };
      for (let i = 0; i < N; i++) {
        if (!has[i]) continue;
        const p = pos.length / 3;
        edgeAt(i);
        edgeAt(i + 1);
        index.push(p, p + 1, p + 2, p + 2, p + 1, p + 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(index);
      g.computeVertexNormals();
      this.addPart(section, name, 0xd8c7a6, [g], { double: true });
    }
  }

  #anterior() {
    // foro cieco, davanti alla crista galli, con la vena emissaria
    this.addPart('fCaecum', 'foro cieco', MARK, [ring([-0.6, -170.6, 1533.6], [0, 0.2, 1], 1.9)]);
    this.addPart('emissary', 'vena emissaria del seno sagittale superiore', VEIN, [
      tube([[-0.6, -169.6, 1541], [-0.6, -170.4, 1535], [-0.6, -171.2, 1529]], 0.8),
    ]);
    // filuzzi olfattivi attraverso la lamina cribrosa
    const fila = [];
    for (let y = -158; y <= -138; y += 4) fila.push(tube([[3.1, y, 1528.5], [3.1, y + 0.3, 1517.5]], 0.55, { seg: 6 }));
    this.addPart('olfactory', 'filuzzi del nervo olfattivo (I)', NERVE, pair(mergeGeometries(fila)));
    // fori etmoidali, sulla parete laterale della doccia olfattiva
    this.addPart('fEthmoid', 'forami etmoidali anteriore e posteriore', MARK,
      pair(ring([4.4, -155, 1529.5], [1, 0, 0.3], 1.3, 0.45), ring([4.4, -141, 1527.5], [1, 0, 0.3], 1.3, 0.45)));
    // canale ottico: l'asse è quello del nervo ottico reale
    this.addPart('fOptic', 'canale ottico', MARK, pair(ring([10.4, -117.2, 1531], [7.9, -8, -5], 3.3)));
    // margine posteriore della piccola ala (confine tra fossa anteriore e media)
    this.addPart('sphRidge', 'margine posteriore della piccola ala', 0x9a4f2c, pair(tube([
      [13, -107.5, 1533], [18, -112, 1534.5], [24, -117, 1536.3], [30, -121, 1539.3], [36, -123, 1542.5],
      [42, -124.5, 1545.8], [48, -124, 1548], [53, -125.5, 1554],
    ], 0.9)));
  }

  #middle() {
    // fessura orbitaria superiore: tra piccola e grande ala, attorno ai nervi reali
    this.addPart('fSof', 'fessura orbitaria superiore', MARK, pair(loop([
      [14.5, -116, 1525], [17.5, -117.5, 1523.3], [23, -120, 1524.5], [30, -123, 1529.5], [35, -125, 1534.5],
      [31, -123.8, 1535.2], [23, -120.8, 1531.6], [16.5, -117.5, 1531.2],
    ])));
    // III: dalla fossa interpeduncolare alla parete laterale del seno cavernoso
    this.addPart('cn3t', 'nervo oculomotore (III)', 0xd9892b, pair(tube([
      [3.5, -94.5, 1531.5], [8, -98.5, 1532.5], [13, -104, 1531.5], [16, -110, 1530.6], [16.6, -115, 1529.6], [16.2, -119.5, 1527.8],
    ], 1.15)));
    // VI: solco bulbo-pontino, clivo, canale di Dorello, seno cavernoso
    this.addPart('cn6', 'nervo abducente (VI)', 0x4a9bd1, pair(tube([
      [4, -87.2, 1504.5], [5, -89.6, 1510.6], [7, -93, 1518.3], [10.2, -96.6, 1522.3], [14.8, -103, 1523.6],
      [17, -110, 1524.4], [17.2, -118.5, 1525.4],
    ], 0.8)));
    // V: radice dal ponte e ganglio semilunare sull'apice della piramide
    const gp = mm([20.5, -94.6, 1518.2]);
    const ganglion = ellipsoid([gp.x, gp.y, gp.z], [7.2 * S, 2.6 * S, 4.2 * S], [0, -0.54, 0]);
    this.addPart('v5', 'nervo trigemino: radice e ganglio semilunare', 0xcfa53a, [
      ...pair(tube([[16, -85.5, 1517], [17.8, -89, 1517.8], [19.5, -92.5, 1518.2]], [2.2, 2.6, 3], { caps: false })),
      ...both(ganglion),
    ]);
    this.addPart('v2', 'nervo mascellare (V2)', NERVE, pair(tube([
      [21.5, -98, 1518], [21.6, -104, 1517.4], [22, -110, 1517.4], [22.4, -114, 1515.3], [23, -117.5, 1511.5],
    ], 1.5)));
    this.addPart('v3', 'nervo mandibolare (V3)', NERVE, pair(tube([
      [23.5, -96.5, 1517], [24.2, -100.5, 1512.5], [24.6, -102, 1506], [25.6, -102.8, 1497], [26.5, -103.2, 1490],
    ], [2, 2, 1.7, 1.7])));
    this.addPart('fRotundum', 'forame rotondo', MARK, pair(ring([22.3, -113.2, 1516.3], [0, -1, -0.7], 2.3)));
    this.addPart('fOvale', 'forame ovale', MARK, pair(loop([
      [24.3, -105.3, 1511], [27, -103.8, 1508.4], [27.6, -101, 1506.6], [25, -99, 1507.4], [21.6, -100.2, 1510.4], [21.4, -103.4, 1512.6],
    ])));
    // forame spinoso e arteria meningea media con i due rami
    this.addPart('fSpinosum', 'forame spinoso', MARK, pair(ring([31, -96.2, 1507.4], [0, 0, 1], 1.8, 0.5)));
    this.addPart('mma', 'arteria meningea media', ARTERY, pair(
      tube([[31, -96, 1494], [31, -96, 1502], [31, -96.5, 1508.2], [35, -99, 1506.9], [42, -103, 1512.1], [49, -106, 1516.5]], 0.9),
      tube([[49, -106, 1516.5], [51.1, -104.9, 1520.9], [53.8, -107.4, 1527.9], [54.8, -110, 1534.9], [55.3, -112.6, 1541.9], [55.3, -115, 1548.9]], 0.75),
      tube([[49, -106, 1516.5], [55.6, -93.4, 1520.9], [60.2, -88.2, 1526.9], [63.9, -82.4, 1532.9], [67.2, -75.9, 1538.9], [67.7, -71, 1544.9]], 0.75)
    ));
    this.addPart('fLacerum', 'forame lacero', MARK, pair(ring([13.2, -96.3, 1511.6], [-0.2, 0, 1], 3.3)));
    // iato del canale faciale e orifizio accessorio, con i nervi petrosi
    this.addPart('fHiatus', 'iato del canale faciale e orifizio accessorio', MARK,
      pair(ring([34.6, -81.6, 1518.4], [-0.6, 0.6, 0.6], 1.3, 0.45), ring([38.6, -84.6, 1517.6], [-0.6, 0.6, 0.6], 1.2, 0.45)));
    this.addPart('gpn', 'nervo grande petroso superficiale', 0xb7d04a, pair(tube([
      [34, -82, 1518.5], [29, -86.5, 1515.5], [24, -91, 1514.2], [19, -94.5, 1510.6], [15.5, -96, 1506],
    ], 0.6)));
    this.addPart('lpn', 'nervo piccolo petroso superficiale', 0x86b84a, pair(tube([
      [38, -85, 1517.5], [34, -89, 1513.4], [31, -93, 1510], [29, -97, 1508.3], [27.6, -100.2, 1507.4],
    ], 0.5)));
  }

  #posterior() {
    // forame magno: contorno ricavato dalla mesh dell'occipitale
    this.addPart('fMagnum', 'grande forame occipitale', MARK, [loop([
      [-0.6, -39.4, 1483.6], [6, -42.1, 1483.6], [10.7, -46.5, 1482.8], [13.7, -51.6, 1483.6], [15.6, -57.1, 1484.6],
      [16.8, -63.1, 1484.8], [14.7, -68.8, 1482], [10.5, -73.2, 1485.8], [5.5, -76.6, 1488.6], [-0.6, -78.2, 1490.5],
      [-6.7, -76.6, 1488.6], [-11.7, -73.2, 1485.8], [-16, -68.8, 1482], [-18.2, -63.2, 1484.8], [-16.9, -57.1, 1485.6],
      [-15.1, -51.5, 1484.6], [-12, -46.4, 1482.8], [-7.2, -42.1, 1483.6],
    ], 0.7)]);
    // radice spinale dell'accessorio: sale nel forame magno e raggiunge il foro giugulare
    this.addPart('cn11', 'nervo accessorio (XI)', 0xa66bbf, pair(tube([
      [8.8, -58, 1474], [9.6, -61, 1484], [12.4, -66, 1492.5], [19, -70.4, 1498], [25.5, -73, 1497.4], [29.4, -74.6, 1493.2], [30, -76, 1485],
    ], 0.75)));
    this.addPart('cn9', 'nervo glossofaringeo (IX)', 0xe07a3c, pair(tube([
      [11.6, -74.2, 1499.2], [18, -75.6, 1502], [24, -76.4, 1500.6], [27.6, -76.6, 1496], [28.4, -77.2, 1487],
    ], 0.8)));
    this.addPart('cn10', 'nervo vago (X)', 0xd4a017, pair(tube([
      [11.6, -72, 1495.6], [18.5, -73, 1500], [24.6, -74.4, 1499.2], [28.6, -75.4, 1494.6], [29.2, -76.6, 1486],
    ], 1.1)));
    this.addPart('fJugular', 'foro giugulare', MARK, pair(loop([
      [25.6, -78, 1498.4], [29, -78.6, 1496.4], [33.6, -77.6, 1494], [36.4, -74.4, 1493], [34.8, -71.4, 1493.4], [30.4, -71.6, 1494.6], [26.6, -74, 1497],
    ])));
    // XII: dal solco preolivare al canale, diretto in avanti e di lato
    this.addPart('fHypoglossal', "canale dell'ipoglosso", MARK, pair(ring([10.6, -73.6, 1490.6], [-1, -0.5, 0.25], 2.1)));
    this.addPart('cn12', 'nervo ipoglosso (XII)', 0x4aa36b, pair(tube([
      [6.2, -76.4, 1489.4], [8.6, -74.4, 1490.2], [11, -73.6, 1490.6], [15, -76.6, 1491], [19.5, -80, 1491.4],
    ], 1)));
    // meato acustico interno con VII (antero-superiore) e VIII
    this.addPart('fIam', 'meato acustico interno', MARK, pair(ring([26.2, -79.4, 1510.6], [-0.75, 0.6, 0.15], 3.3)));
    this.addPart('cn7', 'nervo faciale (VII)', 0xe0589a, pair(tube([
      [13.6, -76.2, 1505], [20, -78.4, 1509], [26.2, -80.4, 1511.8], [31, -82.4, 1512.8],
    ], 0.8)));
    this.addPart('cn8', 'nervo vestibolo-cocleare (VIII)', 0x35a7b5, pair(tube([
      [14, -73.6, 1503.6], [20, -76.4, 1507.4], [26.4, -79.2, 1510], [31, -81.2, 1511.2],
    ], 1.25)));
    // seni venosi della dura: decorrono nei rispettivi solchi
    const trans = [[0, -5.3, 1513], [6.9, -0.7, 1513.8], [14.5, 0, 1514.6], [22.4, -1.2, 1515.3], [28.3, -6.3, 1516.1],
      [33.7, -11.7, 1516.9], [39.4, -17.3, 1517.7], [46.6, -23, 1518.4], [51.7, -30.9, 1519.2], [57.6, -39.4, 1520]];
    this.addPart('transverse', 'seno trasverso', VEIN, pair(tube(trans, 2.6, { caps: false })));
    this.addPart('sigmoid', 'seno sigmoideo', 0x2f5fb0, pair(tube([
      [57.6, -39.4, 1520], [55.8, -50, 1514], [53.2, -56.7, 1507.4], [49.3, -62.7, 1500.3], [43.6, -68.4, 1494.6], [37.5, -72, 1492.6],
    ], 2.6, { caps: false })));
    this.addPart('jugBulb', 'bulbo della vena giugulare', 0x274f96, pair(tube([
      [37.5, -72, 1492.6], [33.6, -74.4, 1491], [32.6, -76, 1486], [32.4, -77, 1479],
    ], [2.6, 3.4, 3.2, 2.8])));
    this.addPart('sps', 'seno petroso superiore', 0x5f8fd6, pair(tube([
      [17, -88, 1513.6], [22, -85, 1516.6], [30, -80, 1519.8], [40, -74, 1523.3], [50, -68, 1524.9], [56, -57, 1524.6], [57.2, -42, 1521],
    ], 1.1)));
    this.addPart('ips', 'seno petroso inferiore', 0x5f8fd6, pair(tube([
      [11, -91, 1512.8], [13.5, -86, 1507.6], [18, -81, 1509.2], [23, -78.4, 1506], [27, -77.4, 1499], [30.5, -76, 1492.5],
    ], 1.1)));
    // canale condilare e forame mastoideo (vene emissarie)
    this.addPart('fCondylar', 'canale condilare', MARK, pair(ring([25, -62.5, 1493.6], [0, 0, 1], 1.6, 0.5)));
    this.addPart('fMastoid', 'forame mastoideo', MARK, pair(ring([56.8, -46, 1512], [-1, 0.2, 0.3], 1.6, 0.5)));
  }
}
