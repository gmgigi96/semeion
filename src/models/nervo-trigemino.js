// Modello del nervo trigemino (V).
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0, derivato da BodyParts3D; file
// public/meshes/nervo-trigemino.glb, manifesto meshes/nervo-trigemino.json):
// - tronco encefalico (mesencefalo, ponte, bulbo), parte alta del midollo, talamo;
// - sfenoide, mandibola, ossa della faccia e della base (frontale, mascellari,
//   zigomatici, temporali, nasali), denti, bulbi oculari, lingua, ghiandola lacrimale;
// - lato destro: nervo oftalmico (nella sorgente è il solo nervo frontale con i
//   rami sopraorbitario e sopratrocleare), nervo mascellare fino ai rami terminali
//   dell'infraorbitario, tronco del mandibolare e i suoi due tronchi, nervi buccale,
//   linguale, alveolare inferiore (con i rami dentali), miloioideo, mentale;
//   nervo auricolo-temporale (nella sorgente l'oggetto si chiama, per errore,
//   "Meningeal branch of maxillary nerve": il decorso dietro il collo della
//   mandibola e davanti al padiglione è quello dell'auricolo-temporale);
// - muscoli di destra: temporale, massetere, pterigoidei mediale e laterale,
//   miloioideo, ventre anteriore del digastrico;
// - cute della metà sinistra del volto ("regions" di Z-Anatomy: frontale,
//   orbitaria, nasale, infraorbitaria, zigomatica, buccale, orale, mentale,
//   parotideo-masseterina, temporale, auricolare), suddivisa qui nei tre territori.
// I nervi di Z-Anatomy sono curve convertite in tubi di 0,3 mm di raggio: qui
// sono ingrossati lungo le normali (vedi `inflate`), il decorso non è toccato.
//
// DUE CORREZIONI ALLA SORGENTE, da sapere:
// - in Z-Anatomy il tronco encefalico tocca il clivo e la curva della radice del
//   trigemino corre DENTRO la mesh del ponte fino al cavo di Meckel. Qui encefalo
//   e midollo sono arretrati rigidamente di 4 mm (compare la cisterna prepontina)
//   e la radice è ridisegnata a mano sulla superficie del ponte (la curva della
//   sorgente è scartata, tranne il tratto che continua nel nervo mandibolare);
// - i "nuclei" del trigemino di Z-Anatomy (una fila di sferette paramediane e un
//   nucleo motore laterale a quello sensitivo) sono schematici e mal collocati:
//   non sono usati.
//
// RICOSTRUITO A MANO nella terna delle mesh reali (punti in millimetri della
// sorgente, convertiti da `mm`; per le strutture dell'encefalo da `cns`, che
// aggiunge l'arretramento):
// - nuclei: motore (masticatorio), principale (pontino), mesencefalico, nucleo
//   del tratto spinale diviso in pars oralis, interpolaris e caudalis; nucleo VPM;
// - fibre radicolari nel ponte, radice sensitiva e radice motoria, ganglio
//   semilunare (di Gasser), anelli che segnano fessura orbitaria superiore,
//   foro rotondo e foro ovale (posti dove le curve reali attraversano lo sfenoide);
// - rami che la sorgente non ha: nervi lacrimale e naso-ciliare, nervo zigomatico
//   con i due rami, nervi alveolari superiori, ganglio sfeno-palatino e nervi
//   palatini, ganglio otico, nervi masseterino, temporali profondi e pterigoidei;
// - confini dei tre territori cutanei sulla cute reale.
//
// FONTI effettivamente lette (le pagine di NCBI/StatPearls e la copia di Gray su
// theodora.com hanno rifiutato l'accesso automatico e non sono state usate):
// - H. Gray, Anatomy of the Human Body, 20ª ed. (1918), "The Trigeminal Nerve"
//   https://www.hithera.com/grays-anatomy/neurology-sense-organs/index-8/index-8-2/trigeminal_nerve/
//   VERIFICATO: le due radici emergono dal lato del ponte vicino al margine
//   superiore, la motoria davanti e medialmente alla sensitiva; ganglio a
//   semiluna con la convessità in avanti, nel cavo di Meckel presso l'apice
//   della rocca; la radice motoria passa sotto il ganglio ed esce dal foro ovale;
//   decorso dell'auricolo-temporale (dietro il collo della mandibola, poi in alto
//   tra padiglione e condilo, sopra l'arcata zigomatica); cute dei tre territori
//   (V1: palpebre, fronte, naso, cuoio capelluto; V2: lato del naso, palpebra
//   inferiore, guancia sullo zigomo, labbro superiore; V3: regione temporale,
//   padiglione, parte bassa del volto, mento e labbro inferiore).
// - Wikipedia (en), "Trigeminal nerve", "Trigeminal ganglion", "Trigeminal nerve
//   nuclei", "Spinal trigeminal nucleus", "Mesencephalic nucleus of trigeminal
//   nerve", "Trigeminal motor nucleus" (https://en.wikipedia.org/wiki/…)
//   VERIFICATO: nucleo motore nel ponte superiore, sotto la parte laterale del
//   pavimento del IV ventricolo, mediale al nucleo principale; nucleo
//   mesencefalico laterale all'acquedotto, nel grigio periacqueduttale, dal ponte
//   rostrale al mesencefalo; nucleo spinale dal ponte a C2, con pars oralis fino
//   al livello del nucleo dell'ipoglosso, interpolaris fino all'obex, caudalis
//   dall'obex in giù; l'angolo della mandibola non è del trigemino (C2-C3); il
//   naso è di V1 tranne le ali.
// - Kenhub, "Trigeminal nerve (CN V)" https://www.kenhub.com/en/library/anatomy/the-trigeminal-nerve
//   VERIFICATO: nucleo mesencefalico dal livello del nucleo principale al
//   tegmento rostrale del mesencefalo; nucleo spinale fino a C2-C3; V1 fino al
//   vertice e al dorso del naso; fasci trigemino-talamici e VPM.
// STIMATO (nessuna misura nelle fonti lette): coordinate e dimensioni dei nuclei
// (poste rispetto a pavimento del IV ventricolo, acquedotto, obex e corno
// posteriore delle mesh reali, e controllate con un test di appartenenza alle
// mesh di ponte, bulbo, mesencefalo e talamo); larghezza del ganglio (circa
// 9 mm: le tre branche della sorgente partono quasi dallo stesso punto); decorso
// dei rami ricostruiti (a partire dalle descrizioni degli appunti e di Gray);
// linee di confine dei territori cutanei.
//
// Coordinate del modello: x verso la destra del paziente, y in alto, z in
// avanti. Il motore ribalta il modello a schermo: nessuna compensazione qui.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { taperTube, ellipsoid, mirror } from '../geo.js';

const S = 0.0038; // unità per mm (come nel manifesto)
const O = [0, -40, 1488]; // origine del manifesto, in mm
const BACK = 4; // arretramento dell'encefalo, in mm
// punto in mm: [distanza dal piano mediano verso DESTRA, y (indietro), z (alto)]
const mm = ([l, y, z]) => new THREE.Vector3(l * S, (z - O[2]) * S, -(y - O[1]) * S);
const cns = ([l, y, z]) => mm([l, y + BACK, z]);
const scaled = (r) => (Array.isArray(r) ? r.map((v) => v * S) : r * S);
const tube = (pts, r, opts) => taperTube(pts.map(mm), scaled(r), opts);
const ctube = (pts, r, opts) => taperTube(pts.map(cns), scaled(r), opts);
const blobAt = (p, r, rot) => {
  const g = ellipsoid([0, 0, 0], [r[0] * S, r[1] * S, r[2] * S], rot);
  g.translate(p.x, p.y, p.z);
  return g;
};
// ellissoide: semiassi in mm (laterale, verticale, antero-posteriore)
const blob = (c, r, rot) => blobAt(mm(c), r, rot);
const cblob = (c, r, rot) => blobAt(cns(c), r, rot);
// anello attorno a un nervo: centro e direzione in mm, raggio e spessore in mm
const ring = (c, dir, R, r, squash = 1) => {
  const g = new THREE.TorusGeometry(R * S, r * S, 10, 32);
  g.scale(1, squash, 1);
  const d = new THREE.Vector3(dir[0], dir[2], -dir[1]).normalize();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d));
  const p = mm(c);
  g.translate(p.x, p.y, p.z);
  return g;
};

export const C = {
  v1: 0xe0a020, v2: 0x2f9a57, v3: 0x2f6fd0, motor: 0xd43d3d,
  root: 0xe6d49a, ganglion: 0xd9a441,
};
const BONE = 0xe9dfc8, STEM = 0xe3cdb6, MUSCLE = 0xb5524a, PARA = 0x8e5bb5;

const REAL = {
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.5 }],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.5 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.5 }],
  cord: ['midollo spinale cervicale', STEM, { ghost: true, opacity: 0.5 }],
  thalamus: ['talamo', 0xd8c3ae, { ghost: true, opacity: 0.45 }],
  sphenoid: ['osso sfenoide', BONE, { ghost: true, opacity: 0.3 }],
  mandible: ['mandibola', BONE, { ghost: true, opacity: 0.36 }],
  skull: ['ossa del cranio e della faccia', BONE, { ghost: true, opacity: 0.26 }],
  teeth: ['denti', 0xf6f1e4],
  eyes: ['bulbi oculari', 0xf3efe6],
  iris: ['iride', 0x4f7896],
  cornea: ['cornea', 0xcfe6f2, { opacity: 0.35 }],
  tongue: ['lingua', 0xd98a86],
  lacrimal: ['ghiandola lacrimale', 0xd9a0a8],
  v3trunk: ['nervo mandibolare (III branca)', C.v3],
  v1: ['nervo oftalmico (I branca) e nervo frontale', C.v1],
  v2: ['nervo mascellare (II branca) e nervo infraorbitario', C.v2],
  v3ant: ['tronco antero-laterale del mandibolare', 0x4f8be0],
  v3post: ['tronco postero-mediale del mandibolare', 0x2456a8],
  atn: ['nervo auricolo-temporale', 0x5aa0e8],
  buccal: ['nervo buccale', 0x4f8be0],
  lingual: ['nervo linguale', 0x7d6fd6],
  ian: ['nervo alveolare inferiore', 0x2f6fd0],
  mylon: ['nervo miloioideo', C.motor],
  mental: ['nervo mentale', 0x6fb0f0],
  temporalis: ['muscolo temporale', MUSCLE],
  masseter: ['muscolo massetere', 0xc0604f],
  ptmed: ['muscolo pterigoideo interno (mediale)', 0xa8483f],
  ptlat: ['muscolo pterigoideo laterale', 0xcf7a66],
  mylohyoid: ['muscolo miloioideo', 0xc98a70],
  digastric: ['ventre anteriore del muscolo digastrico', 0xb9705c],
  face: ['cute del volto', 0xe6c9b0],
};

// quanto ingrossare i tubi dei nervi reali (unità del modello)
const INFLATE = {
  v1: 0.0024, v2: 0.0024, v3trunk: 0.003, v3ant: 0.0022, v3post: 0.0024, atn: 0.0019,
  buccal: 0.0019, lingual: 0.0021, ian: 0.002, mylon: 0.0015, mental: 0.0015,
};

// Territorio cutaneo di un punto della cute (mm: distanza dal piano mediano,
// a = quanto è anteriore, z = quota). Linee di confine stimate: vedi in testa.
function territory(ax, a, z) {
  // limite posteriore e inferiore del trigemino: vertice, davanti al padiglione,
  // poi in avanti lungo la mandibola risparmiando l'angolo (plesso cervicale)
  const limit = z > 1610 ? 5 - (z - 1610) * 0.25 : z > 1560 ? 3 : 10 + (1560 - z) * 0.77;
  if (a < limit || z < 1494) return 'rest';
  // V1: sopra la rima palpebrale, poi in alto e indietro verso il vertice; dorso e punta del naso
  const v1line = a >= 60 ? 1590 : 1590 + (60 - a) * 1.6;
  if (z > v1line) return 'v1';
  if (ax < 7 && a > 85 && z > 1553) return 'v1';
  // V3: sotto la rima orale, poi in alto e indietro fino alla tempia
  const v3line = a >= 88 ? 1531 : a >= 60 ? 1531 + (88 - a) * 1.6 : 1575.8 + (60 - a) * 2.3;
  if (z < v3line) return 'v3';
  return 'v2';
}

export class TrigeminalModel extends AnatomyModel {
  constructor() {
    super({ tilt: -0.45 });
    this.addStand({ radius: 0.21, z: 0, rod: [0, 0.015, 0.055, 0.125] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('nervo-trigemino.glb', REAL);
    // encefalo e midollo arretrati di 4 mm (vedi in testa)
    for (const id of ['midbrain', 'pons', 'medulla', 'cord', 'thalamus']) {
      const part = this.parts.get(id);
      for (const m of part.meshes) m.position.z -= BACK * S;
      part.center.z -= BACK * S;
    }
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d);
    this.#skin();
    this.#nuclei();
    this.#rootAndGanglion();
    this.#branches();
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

  // Divide la cute reale (metà sinistra del volto) nei tre territori: i
  // triangoli sono suddivisi, così i confini non seguono la maglia grossolana.
  #skin() {
    const src = this.parts.get('face');
    const out = { v1: [[], []], v2: [[], []], v3: [[], []], rest: [[], []] };
    const mid = (a, b) => a.clone().add(b).multiplyScalar(0.5);
    const emit = (p, n, level) => {
      if (level > 0) {
        const m = [mid(p[0], p[1]), mid(p[1], p[2]), mid(p[2], p[0])];
        const k = [mid(n[0], n[1]).normalize(), mid(n[1], n[2]).normalize(), mid(n[2], n[0]).normalize()];
        emit([p[0], m[0], m[2]], [n[0], k[0], k[2]], level - 1);
        emit([m[0], p[1], m[1]], [k[0], n[1], k[1]], level - 1);
        emit([m[2], m[1], p[2]], [k[2], k[1], n[2]], level - 1);
        emit([m[0], m[1], m[2]], [k[0], k[1], k[2]], level - 1);
        return;
      }
      const c = p[0].clone().add(p[1]).add(p[2]).divideScalar(3);
      const [pos, nor] = out[territory(Math.abs(c.x) / S, c.z / S - O[1], c.y / S + O[2])];
      for (let i = 0; i < 3; i++) pos.push(p[i].x, p[i].y, p[i].z), nor.push(n[i].x, n[i].y, n[i].z);
    };
    for (const m of src.meshes) {
      const g = m.geometry;
      const P = g.attributes.position, N = g.attributes.normal, I = g.index;
      const v = (i) => new THREE.Vector3().fromBufferAttribute(P, i).add(m.position);
      const n = (i) => new THREE.Vector3().fromBufferAttribute(N, i);
      for (let t = 0; t < I.count; t += 3) {
        const ids = [I.getX(t), I.getX(t + 1), I.getX(t + 2)];
        emit(ids.map(v), ids.map(n), 3);
      }
      this.inner.remove(m);
    }
    this.parts.delete('face');
    const geo = ([pos, nor]) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      return g;
    };
    const opts = { double: true, roughness: 0.7 };
    this.addPart('skin1', 'cute del territorio oftalmico (V1)', 0xf0c463, [geo(out.v1)], opts);
    this.addPart('skin2', 'cute del territorio mascellare (V2)', 0x7fcb98, [geo(out.v2)], opts);
    this.addPart('skin3', 'cute del territorio mandibolare (V3)', 0x86aeea, [geo(out.v3)], opts);
    this.addPart('skinRest', 'cute non innervata dal trigemino', 0xe6cdb8, [geo(out.rest)], opts);
  }

  // una parte con i due lati: `geo` è disegnata a destra (x > 0)
  #pair(id, name, color, geos, opts) {
    const all = geos.flatMap((g) => [g, mirror(g)]); // prima di addPart, che ricentra
    // prima tutti i pezzi di destra: `center` della parte è il primo
    this.addPart(id, name, color, [...all.filter((_, i) => i % 2 === 0), ...all.filter((_, i) => i % 2 === 1)], opts);
  }

  #nuclei() {
    // motore (masticatorio): ponte superiore, sotto la parte laterale del pavimento
    // del IV ventricolo, mediale al nucleo principale
    this.#pair('nucMot', 'nucleo motore (masticatorio) del trigemino', C.motor, [cblob([7.2, 11.8, 1592], [1.3, 2.4, 1.4])]);
    // principale (pontino): laterale al motore, alla stessa altezza
    this.#pair('nucPr', 'nucleo principale (pontino) del trigemino', 0x1f9d9d, [cblob([9.9, 12.9, 1591.6], [1.5, 3.2, 1.9])]);
    // mesencefalico: colonna sottile dal nucleo principale al mesencefalo, al margine
    // laterale del grigio attorno all'acquedotto
    this.#pair('nucMes', 'nucleo mesencefalico del trigemino', PARA, [
      ctube([[8.6, 13.4, 1594.6], [6.6, 13.8, 1597], [5.2, 13.9, 1600], [4.7, 13.4, 1604.5], [4.6, 12.6, 1609], [4.5, 11.6, 1613]], [0.75, 0.6, 0.55]),
    ]);
    // nucleo del tratto spinale: dal nucleo principale ai primi neuromeri cervicali,
    // dorsolaterale nel bulbo, in continuità con il corno posteriore
    this.#pair('spOr', 'nucleo spinale del trigemino, pars oralis', 0xe07a3a, [
      ctube([[9.8, 13.6, 1588.6], [9.9, 15.2, 1584], [10.0, 16.6, 1579], [10.0, 18.6, 1575.5], [9.6, 19.2, 1572.7]], 1.25),
    ]);
    this.#pair('spInt', 'nucleo spinale del trigemino, pars interpolaris', 0xd9b23a, [
      ctube([[9.6, 19.3, 1572.3], [9.0, 21, 1569.5], [8.2, 22.6, 1566.7]], 1.3),
    ]);
    this.#pair('spCau', 'nucleo spinale del trigemino, pars caudalis', 0xa8623c, [
      ctube([[8.2, 22.7, 1566.3], [6.6, 25.5, 1560], [5.8, 27.6, 1552], [5.0, 29.6, 1545], [4.0, 30.4, 1539], [3.7, 29.0, 1530],
        [3.7, 26.6, 1520], [3.6, 25.2, 1510]], [1.3, 1.2, 1.0, 0.85, 0.7], { seg: 60 }),
    ]);
    // nucleo ventrale posteromediale del talamo (posizione stimata nella mesh reale)
    this.#pair('vpm', 'nucleo ventrale posteromediale (VPM) del talamo', 0x6a8fd8, [cblob([13, 12, 1620.5], [3, 2.3, 3.4])]);

    // fibre radicolari nel ponte, lato destro
    this.addPart('fSens', 'fibre della radice sensitiva nel ponte', C.root, [
      ctube([[18.6, 6.5, 1597.5], [15, 9.5, 1595.5], [12.2, 11.8, 1593.4], [10.4, 12.7, 1592.2]], [0.9, 0.7], { caps: false }),
    ]);
    this.addPart('fMot', 'fibre della radice motoria nel ponte', C.motor, [
      ctube([[7.6, 11.5, 1592.6], [11, 9.6, 1595.5], [15, 6.6, 1598.2], [17.7, 4.4, 1599.4]], 0.5, { caps: false }),
    ]);

    // vie centrali (dal lato destro)
    const G = 0x1f9d57;
    // fascio trigemino-talamico ventrale (lemnisco trigeminale): crociato, al VPM
    this.addLink('ttv', [[9.9, 12.9, 1592], [4, 9.5, 1594], [-3, 8.5, 1597.5], [-7.5, 7.5, 1604], [-10, 8.5, 1612], [-12.5, 11.5, 1619]].map(cns), { color: G });
    this.addLink('tts', [[6.6, 25.5, 1560], [2, 21.5, 1562], [-3.5, 16.5, 1568], [-5.5, 11.5, 1579], [-5.2, 9, 1590], [-6.6, 7.8, 1600]].map(cns), { color: G });
    // fascio trigemino-talamico dorsale: fibre ipsilaterali
    this.addLink('ttd', [[9.9, 13.4, 1593.5], [8, 13, 1600], [7.8, 11.8, 1608], [8.6, 11, 1615], [7, 9, 1624]].map(cns), { color: 0x2f6fe0 });
    // dal nucleo mesencefalico al nucleo masticatorio
    this.addLink('mesMot', [[6.3, 13.6, 1597.6], [6.4, 12.8, 1595.6], [7.0, 12.2, 1593.8]].map(cns), { color: G, r: 0.0022 });
  }

  #rootAndGanglion() {
    // radice sensitiva: dalla faccia laterale del ponte, vicino al margine superiore,
    // in avanti e medialmente fino al cavo di Meckel
    this.addPart('vroot', 'radice sensitiva del trigemino', C.root, [
      tube([[18.7, 10.3, 1597.5], [18.3, 7, 1598.2], [16.7, 3, 1598.9], [14.5, 0, 1599.4], [12.6, -2.2, 1599.5], [12.0, -4.2, 1598.9]],
        [1.5, 1.6, 1.7, 2.1], { seg: 40 }),
    ]);
    // radice motoria: davanti e medialmente alla sensitiva, passa sotto il ganglio
    // senza interrompersi e raggiunge il nervo mandibolare al foro ovale
    this.addPart('motor', 'radice motoria del trigemino', C.motor, [
      tube([[17.8, 8.3, 1599.3], [17.0, 5, 1600.1], [15.2, 1.4, 1600.6], [13.0, -1.4, 1599.6], [12.0, -4.4, 1596.2], [13.6, -7.4, 1592.6],
        [16.9, -11.2, 1587.5], [20.2, -12.6, 1582.8], [21.6, -13.3, 1580.6]], 0.6, { seg: 60 }),
    ]);
    // ganglio semilunare: semiluna con la convessità in avanti e in basso, da cui
    // partono (da mediale a laterale) le tre branche; dietro, il plesso triangolare
    this.addPart('gasser', 'ganglio semilunare del Gasser', C.ganglion, [
      tube([[8.4, -5.6, 1600.9], [9.4, -7.8, 1599.6], [11.2, -9.4, 1597.5], [13.3, -9.7, 1595.4], [15.3, -8.4, 1594.1], [16.8, -6.2, 1593.6]],
        [1.1, 2.1, 2.5, 2.5, 2.1, 1.1], { seg: 40, radial: 18 }),
      tube([[12.3, -2.6, 1599.4], [12.3, -5.2, 1598.2], [12.3, -7.8, 1596.9]], [1.9, 2.5, 2.1], { radial: 18 }),
    ]);
    // i tre orifizi dello sfenoide, dove le curve reali attraversano l'osso
    const HOLE = 0x5b4a36;
    this.addPart('sof', 'fessura orbitaria superiore', HOLE, [ring([20.4, -32, 1600.6], [1.3, -3.2, 1.2], 2.6, 0.5, 1.7)]);
    this.addPart('frot', 'foro rotondo', HOLE, [ring([17.4, -23, 1590.4], [0, -1, 0], 2.5, 0.5)]);
    this.addPart('foval', 'foro ovale', HOLE, [ring([21.9, -13.7, 1582], [1, -0.5, -2.8], 3.3, 0.55, 0.8)]);
  }

  #branches() {
    // --- oftalmico: i rami che la sorgente non ha --------------------------------
    // lacrimale: il più laterale, sopra il retto laterale fino alla ghiandola lacrimale
    this.addPart('lacn', 'nervo lacrimale', 0xf0c040, [
      tube([[18.3, -26.5, 1598.6], [21, -33, 1601.2], [25.3, -41, 1603.5], [31, -47, 1605.5], [37, -54, 1606.5], [42, -61, 1605.8]], [0.7, 0.55], { seg: 40 }),
    ]);
    // naso-ciliare: il più mediale, incrocia il nervo ottico, corre lungo la parete
    // mediale e finisce come infratrocleare; stacca l'etmoidale anteriore
    this.addPart('nasocil', 'nervo naso-ciliare', 0xc98510, [
      tube([[18.2, -26.6, 1598.2], [20, -33, 1600.2], [18, -38, 1600.6], [15.5, -43, 1600], [13.2, -50, 1598.5], [12.7, -60, 1597],
        [12.9, -70, 1595], [14.6, -77.5, 1593]], [0.75, 0.6, 0.5], { seg: 50 }),
      tube([[12.7, -59, 1597.1], [10.5, -61, 1598.6], [7.5, -62.5, 1600.3], [4.5, -65, 1601.2]], 0.45),
    ]);

    // --- mascellare ---------------------------------------------------------------
    // ganglio sfeno-palatino, sotto il nervo nella fossa pterigo-palatina, e nervi palatini
    this.addPart('ppg', 'ganglio sfeno-palatino (di Meckel)', PARA, [blob([16.6, -35.2, 1586.2], [1.7, 1.5, 1.9])]);
    this.addPart('palat', 'nervi palatini', 0x57b377, [
      tube([[16.5, -35.5, 1585], [16.5, -37, 1577], [16.2, -39, 1565], [15.8, -41, 1554], [15.2, -43.5, 1547.6], [12.5, -54, 1546.8]], [0.6, 0.6, 0.45], { seg: 40 }),
    ]);
    // zigomatico: dalla fessura orbitaria inferiore alla parete laterale dell'orbita,
    // poi nell'osso zigomatico con i rami zigomatico-faciale e zigomatico-temporale
    this.addPart('zyg', 'nervo zigomatico', 0x62c48a, [
      tube([[16.4, -33.8, 1589.6], [21, -39, 1586.4], [29, -45.5, 1585], [36, -51.5, 1585.4], [42.5, -56, 1586]], 0.6, { seg: 40 }),
      tube([[42, -55.5, 1586], [46.5, -57.5, 1583], [50, -59.5, 1579.5], [53.8, -61.2, 1576]], [0.5, 0.4]),
      tube([[42, -55.5, 1586], [45.5, -54, 1591.5], [49.5, -51, 1598], [52, -48.5, 1606]], [0.5, 0.4]),
    ]);
    // alveolari superiori: posteriori dalla fossa pterigo-palatina, anteriori dal canale infraorbitario
    this.addPart('alvsup', 'nervi alveolari superiori (plesso dentale superiore)', 0x3fae6b, [
      tube([[17.6, -37, 1586], [21.5, -41.5, 1576], [24.5, -46, 1566], [25.5, -50, 1558.5]], [0.6, 0.45]),
      tube([[29.4, -55, 1573.2], [27, -64, 1565.5], [21.5, -73, 1559.5], [14.5, -79.5, 1556.5], [6, -84, 1555.5]], [0.55, 0.4], { seg: 40 }),
      tube([[25.5, -50, 1558.5], [26.5, -58, 1557.5], [24, -66, 1558.5], [21.5, -73, 1559.5]], 0.4),
    ]);

    // --- mandibolare --------------------------------------------------------------
    this.addPart('otic', 'ganglio otico', PARA, [blob([20.9, -14.6, 1575.6], [1.3, 1.7, 1.5])]);
    // dal tronco antero-laterale: masseterino (attraverso l'incisura della mandibola),
    // temporali profondi (sotto il muscolo temporale), pterigoideo laterale
    this.addPart('massn', 'nervo masseterino', C.motor, [
      tube([[27, -19, 1571.5], [35.5, -21, 1570.8], [43, -22.5, 1568.2], [48.5, -24.5, 1561], [50.5, -27.5, 1551]], [0.6, 0.5], { seg: 40 }),
    ]);
    this.addPart('tempn', 'nervi temporali profondi', C.motor, [
      tube([[26.8, -18.8, 1572.2], [32, -24, 1578.5], [38.5, -28, 1586.5], [43.5, -30, 1597], [50, -30.5, 1609]], [0.6, 0.45], { seg: 40 }),
      tube([[32, -24, 1578.5], [38, -21, 1584], [45.5, -17, 1593], [54, -13, 1604]], [0.5, 0.4], { seg: 40 }),
    ]);
    this.addPart('ptn', 'nervi pterigoidei', C.motor, [
      tube([[28, -20, 1570], [32, -22, 1568.8], [35.5, -23.5, 1567.6]], 0.5),
      tube([[22.6, -15, 1576], [22.2, -17.5, 1570], [23, -20.5, 1563.5]], 0.5),
    ]);
  }
}
