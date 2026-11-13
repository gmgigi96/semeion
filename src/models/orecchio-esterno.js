// Orecchio esterno destro: padiglione auricolare, meato acustico esterno,
// membrana del timpano, con i nervi, i vasi e i muscoli del padiglione.
// Le coordinate sono quelle di Z-Anatomy portate nella terna dei modelli da
// tools/mesh.mjs (vedi meshes/orecchio-esterno.json): ogni punto ricostruito a
// mano è scritto in millimetri della sorgente (x verso sinistra, y verso
// dietro, z verso l'alto) e convertito con P().
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0, lato destro):
//  - PADIGLIONE. In Z-Anatomy non è un oggetto solo ma una ventina di frammenti
//    di superficie a pochi vertici (Helix, Antihelix, Crura of antihelix,
//    Scapha, Triangular fossa, Concha of auricle, Cymba conchae, Cavity of
//    concha, Tragus, Antitragus, Intertragic incisure, Anterior notch of
//    auricle, Lobule of auricle, Auricular tubercle, Apex of auricle e, sulla
//    faccia mediale, Eminentia conchae, Eminentia scaphae, Eminentia fossae
//    triangularis, Fossa antihelica, Posterior auricular groove). Messi insieme
//    combaciano lungo i bordi e formano UNA superficie chiusa (1074 vertici
//    dopo la saldatura; restano aperti solo l'attacco anteriore alla testa e
//    pochi spigoli): è un padiglione vero, a maglia grossolana, alto 56 mm e
//    largo 27 mm. Qui i frammenti restano parti distinte (un rilievo ciascuna)
//    e le normali sono ricalcolate attraverso i bordi (`#smooth`), così la
//    superficie appare continua. La forma non è stata ritoccata.
//  - cute attorno al padiglione («regions»: auricolare, temporale, mastoidea,
//    parotideo-masseterina, sternocleidomastoidea): caricata ma mai mostrata
//    (la «regione auricolare» avvolge l'elice come un collare), serve solo a
//    posare sotto di essa nervi e muscoli ricostruiti;
//  - osso temporale (il meato acustico esterno osseo vi è scavato davvero: da
//    x = -53 mm verso l'interno è un anello chiuso di circa 6 x 10 mm, più
//    lateralmente una doccia con tetto e parete posteriore), ramo e condilo
//    della mandibola;
//  - membrana del timpano (divisa qui in pars flaccida e quattro quadranti) e
//    martello (manico; testa e collo);
//  - arteria temporale superficiale (tronco e ramo frontale), arteria carotide
//    esterna, nervo auricolotemporale (nella sorgente l'oggetto si chiama, per
//    errore, "Meningeal branch of maxillary nerve"), nervo faciale dal tratto
//    mastoideo ai rami nella parotide, muscolo sternocleidomastoideo, parotide.
//    I due nervi sono ingrossati lungo le normali (`#inflate`).
//
// NON USATI, benché presenti: il ramo dell'oggetto "Superficial temporal
// artery" che dal tronco va all'indietro (attraversa la conca e il meato
// cartilagineo: non può essere l'arteria auricolare posteriore) e la vena
// auricolare posteriore, usata solo come guida per il decorso dell'arteria.
//
// LIMITI DELLE MESH REALI, da sapere:
//  - la conca è una superficie chiusa: il poro acustico esterno non è aperto.
//    Qui è segnato da un disco scuro sul fondo del cavo della conca;
//  - dal fondo della conca al centro della membrana ci sono 19 mm in linea
//    d'aria: il meato ricostruito è lungo circa 21 mm, non i 25 mm dei testi;
//  - il manico del martello di Z-Anatomy scende in avanti (l'ombelico è 2 mm
//    davanti al processo laterale), mentre nei testi scende all'indietro; la
//    membrana guarda in fuori e in basso di circa 30 gradi e quasi per nulla
//    in avanti. Membrana e martello sono lasciati come sono: i quadranti sono
//    tracciati sul manico reale;
//  - il processo laterale del martello è a 1 mm dal margine superiore: la pars
//    flaccida risulta una striscia alta poco più di 1 mm.
//
// RICOSTRUITO A MANO dentro l'anatomia reale:
//  - meato acustico esterno: condotto a sezione ovale dal fondo del cavo della
//    conca reale alla membrana reale, tagliato obliquo sul piano della
//    membrana. La parte ossea segue il canale scavato nel temporale reale; la
//    parte cartilaginea descrive la prima curva della S (in basso e in avanti,
//    poi in alto e indietro). Istmo al confine tra le due, come negli appunti.
//    Stirando il padiglione in alto e indietro il tratto cartilagineo si
//    allinea a quello osseo;
//  - sulla membrana reale: ombelico, orletto anulare, pliche
//    timpano-malleolari, triangolo luminoso, linee dei quadranti (tutti
//    proiettati sulla superficie laterale della mesh);
//  - nervo grande auricolare (sullo sternocleidomastoideo reale, sotto la cute
//    reale, fino a lobulo, parotide e regione mastoidea), ramo auricolare del
//    vago (dal canale del faciale reale alla parete posteriore del meato e
//    alla conca), nervo auricolare posteriore (dal faciale reale, all'uscita
//    dal foro stilomastoideo), arteria auricolare posteriore (dalla carotide
//    esterna reale al solco tra padiglione e mastoide), muscoli auricolari
//    anteriore, superiore e posteriore (lamine sotto la cute reale).
//
// FONTI LETTE (voci di Wikipedia in inglese, lette tramite l'API; quelle su
// orecchio e nervi derivano in parte da Gray, Anatomy of the Human Body, 20ª ed.):
//  - Ear canal, https://en.wikipedia.org/wiki/Ear_canal
//    VERIFICATO: 25 mm di lunghezza e 7 mm di diametro; terzo laterale
//    cartilagineo e due terzi mediali ossei; forma sigmoide, sezione ovale;
//    ghiandole ceruminose nella parte cartilaginea.
//  - Eardrum, https://en.wikipedia.org/wiki/Eardrum
//    VERIFICATO: membrana obliqua, a cono, con la concavità laterale e
//    l'ombelico all'estremità del manico; pars flaccida sopra il processo
//    laterale del martello, tra le pliche malleolari; anello fibrocartilagineo
//    alla periferia della pars tensa; cono di luce dall'ombelico alla periferia
//    nel quadrante antero-inferiore («ore 5»); innervazione della faccia
//    esterna (auricolotemporale, ramo auricolare del vago, faciale, forse IX).
//  - Auricle (anatomy), https://en.wikipedia.org/wiki/Auricle_(anatomy)
//    VERIFICATO: nomi e rapporti dei rilievi; trago, radice dell'elice ed elice
//    dal primo arco (trigemino), antelice, antitrago e lobulo dal secondo
//    (plesso cervicale, in piccola parte faciale).
//  - Outer ear, https://en.wikipedia.org/wiki/Outer_ear
//    VERIFICATO: i tre muscoli estrinseci (il superiore è il più grande) e la
//    loro azione; muscoli intrinseci.
//  - Great auricular nerve, https://en.wikipedia.org/wiki/Great_auricular_nerve
//    VERIFICATO: C2-C3; sale quasi verticale sullo sternocleidomastoideo verso
//    la parotide, dove si divide in ramo anteriore (cute sulla parotide) e
//    posteriore (cute sulla mastoide, faccia posteriore del padiglione tranne
//    la parte alta, lobulo, parte bassa della conca).
//  - Auriculotemporal nerve, https://en.wikipedia.org/wiki/Auriculotemporal_nerve
//    VERIFICATO: gira dietro il collo della mandibola, dà rami anteriori al
//    padiglione e sale sopra la radice del processo zigomatico con i vasi
//    temporali superficiali (è il decorso dell'oggetto reale usato).
//  - Auricular branch of vagus nerve, https://en.wikipedia.org/wiki/Auricular_branch_of_vagus_nerve
//    VERIFICATO: attraversa il temporale, incrocia il canale del faciale circa
//    4 mm sopra il foro stilomastoideo, esce dalla fessura timpano-mastoidea e
//    va alla cute della faccia posteriore del padiglione e della parte
//    posteriore del meato.
//  - Posterior auricular artery, https://en.wikipedia.org/wiki/Posterior_auricular_artery
//    VERIFICATO: nasce dalla faccia posteriore della carotide esterna, sale
//    sotto la parotide e poi nel solco tra cartilagine del padiglione e mastoide.
//  - Posterior auricular nerve, https://en.wikipedia.org/wiki/Posterior_auricular_nerve
//    VERIFICATO: primo ramo extracranico del faciale, sale davanti alla mastoide,
//    tra questa e il meato, fino al muscolo auricolare posteriore.
// Non lette (l'API ha rifiutato le richieste successive): le voci sui singoli
// muscoli auricolari e sull'arteria temporale superficiale. TeachMeAnatomy,
// Kenhub ed Europe PMC non sono stati consultati.
//
// STIMATO, senza una fonte letta: i punti della linea d'asse del meato e i suoi
// calibri (vincolati dal canale osseo reale e dal fondo della conca reale);
// l'ampiezza dello spostamento del padiglione stirato (circa 7 mm);
// origini e inserzioni dei tre muscoli auricolari (a memoria da Gray:
// l'anteriore dalla fascia temporale alla spina dell'elice, il superiore
// dall'aponeurosi epicranica alla parte alta della faccia mediale, il
// posteriore dalla mastoide all'eminenza della conca); il decorso esatto e i
// calibri di nervi e arteria ricostruiti; gli estremi delle pliche
// timpano-malleolari sul margine della membrana; la direzione e l'ampiezza del
// triangolo luminoso; la sporgenza della membrana nell'otite, che è esagerata.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid } from '../geo.js';

const S = 0.011;
const O = [-70, 3, 1548];
// millimetri della sorgente (x sinistra, y dietro, z alto) -> coordinate del modello
const P = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const D = (x, y, z) => V(-x, z, -y).normalize();
const mm = (list) => list.map((r) => r * S);

const BONE = 0xe9dfc8;

export const AURICLE = [
  'helix', 'tubercle', 'antihelix', 'scapha', 'fossa', 'concha', 'tragus', 'antitragus', 'incisure', 'notch', 'lobule', 'medial', 'sulcus',
];
export const TEMPORAL = ['temporal', 'temporalFar', 'temporalMeatus'];
export const DRUM = ['tmFlac', 'tmAS', 'tmPS', 'tmPI', 'tmAI'];

// Il modello intero è il padiglione: `HOME` (mm) sta sopra il centro della base,
// alla quota HOME_Y, con il modello ingrandito HOME_K (spostamento fisso di `inner`).
const HOME = [-72, 6, 1579];
const HOME_Y = 0.37;
const HOME_K = 0.98;
// Primi piani del motore (vedi AnatomyModel.zoomTo) e, con scala < 1, la veduta
// larga della regione. Nel primo piano della membrana il modello è reclinato
// finché la faccia laterale guarda chi legge (con view.yaw = -1.81); il punto
// inquadrato sta 4 mm dietro la membrana, così il suo margine inferiore non
// finisce sotto la pagina.
const at = (x, y, z) => P(x, y, z).toArray();
export const FOCUS = {
  canal: { at: at(-59, 4, 1576.5), scale: 2.24, height: 0.39 },
  drum: { at: at(-44.3, 4.25, 1579.9), scale: 5.2, height: 0.345, tilt: -1.31 },
  region: { at: at(-62, 3, 1579), scale: 0.6, height: 0.31, stand: false },
};

// ---- membrana del timpano reale: centro, normale (verso la cassa) e assi nel
// suo piano, dall'analisi della mesh; u verso dietro, v verso l'alto, in mm
const TM_C = P(-47.811, 4.012, 1577.879);
const TM_N = D(0.8673, 0.0622, 0.4938);
const TM_UP = D(-0.4925, -0.0353, 0.8696);
const TM_POST = D(-0.0716, 0.9974, 0);
const UMBO = [-1.25, -0.2]; // estremità del manico reale
const LAT = [0.7, 3.3]; // processo laterale del martello reale
const HANDLE = [0.4382, 0.8989]; // direzione del manico, dall'ombelico in su
const ACROSS = [0.8989, -0.4382]; // perpendicolare, verso dietro
const RIM_ANT = (130 * Math.PI) / 180; // estremi della pars flaccida sul margine
const RIM_POST = (39.4 * Math.PI) / 180;

// ---- meato acustico esterno (mm): dal poro alla membrana
const CANAL = [
  [-66.4, 4.0, 1575.0], // poro, sul fondo del cavo della conca reale
  [-63.2, 1.6, 1573.6], // prima curva: in basso e in avanti
  [-59.8, 5.4, 1577.8], // confine tra cartilagine e osso (istmo)
  [-56.5, 6.0, 1578.4],
  [-52.0, 4.4, 1577.5],
  [-47.8, 3.6, 1577.0], // centro della membrana reale
  [-44.5, 3.2, 1576.6], // oltre la membrana: serve solo al taglio obliquo
];
// padiglione stirato in alto e indietro: il tratto cartilagineo prolunga l'asse osseo
const PULL = [0.2, 4.0, 4.6];
const CANAL_PULLED = [[-66.2, 8.0, 1579.6], [-63.0, 6.8, 1578.8], ...CANAL.slice(2)];
// semiassi del lume (mm): [verticale, antero-posteriore] lungo il condotto
const CART_R = [[4.3, 3.3], [3.9, 3.0], [3.1, 2.4]];
const BONE_R = [[3.1, 2.4], [3.9, 2.9], [4.4, 3.3], [4.8, 4.3], [4.8, 4.5]];

// Condotto a sezione ovale lungo il tratto [u0, u1] di una curva. `radii`:
// coppie [verticale, orizzontale] distribuite uniformemente; `clip` taglia il
// condotto su un piano { c, n, off } spostando i vertici lungo l'asse.
function duct(curve, u0, u1, radii, { seg = 28, n = 24, clip = null } = {}) {
  const up = V(0, 1, 0);
  const pos = [];
  const idx = [];
  for (let i = 0; i <= seg; i++) {
    const f = i / seg;
    const u = u0 + (u1 - u0) * f;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const side = new THREE.Vector3().crossVectors(t, up).normalize();
    const top = new THREE.Vector3().crossVectors(side, t).normalize();
    const g = f * (radii.length - 1);
    const k = Math.min(Math.floor(g), radii.length - 2);
    const s = g - k;
    const rv = (radii[k][0] * (1 - s) + radii[k + 1][0] * s) * S;
    const rh = (radii[k][1] * (1 - s) + radii[k + 1][1] * s) * S;
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2;
      const q = p.clone().addScaledVector(top, Math.sin(a) * rv).addScaledVector(side, Math.cos(a) * rh);
      if (clip) {
        const d = q.clone().sub(clip.c).dot(clip.n) + clip.off;
        if (d > 0) q.addScaledVector(t, -d / t.dot(clip.n));
      }
      pos.push(q.x, q.y, q.z);
    }
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < n; j++) {
      const a = i * n + j, b = i * n + ((j + 1) % n);
      idx.push(a, a + n, b, b, a + n, b + n);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Anello ellittico (semiassi ra, rb in mm lungo le direzioni a, b) attorno a c.
function ring(c, a, b, ra, rb, thick) {
  const g = new THREE.TorusGeometry(1, thick / Math.max(ra, rb), 10, 40);
  const n = new THREE.Vector3().crossVectors(a, b).normalize();
  g.applyMatrix4(new THREE.Matrix4().makeBasis(a.clone().multiplyScalar(ra * S), b.clone().multiplyScalar(rb * S), n.multiplyScalar(Math.max(ra, rb) * S)));
  g.translate(c.x, c.y, c.z);
  return g;
}

// Lamina a griglia: `rows` è una lista di file di punti, tutte della stessa lunghezza.
function sheet(rows) {
  const n = rows[0].length;
  const pos = [];
  const idx = [];
  for (const row of rows) for (const p of row) pos.push(p.x, p.y, p.z);
  for (let i = 0; i + 1 < rows.length; i++)
    for (let j = 0; j + 1 < n; j++) {
      const a = i * n + j, b = a + n;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export class OuterEarModel extends AnatomyModel {
  constructor() {
    super({ tilt: -0.45 });
    // spostamento fisso: il padiglione sopra il centro della base
    this.inner.scale.setScalar(HOME_K);
    this.inner.position.copy(P(...HOME)).multiplyScalar(-HOME_K).add(V(0, HOME_Y, 0));
    // l'asta è data nelle coordinate di `inner`: dalla base fin sotto il padiglione
    const foot = (y) => (y - this.inner.position.y) / HOME_K;
    this.addStand({ radius: 0.25, z: 0, rod: [-this.inner.position.x / HOME_K, foot(0.02), foot(0.085), -this.inner.position.z / HOME_K] });
    this.state = { pull: 0, bulge: 0 };
    this.stateTarget = { ...this.state };
    this.ready = this.#build();
  }

  async #build() {
    const skinOf = (c) => [c, { double: true, roughness: 0.6 }];
    await this.loadMeshes('orecchio-esterno.glb', {
      helix: ['elice', ...skinOf(0xecb9a2)],
      tubercle: ['tubercolo auricolare (di Darwin)', ...skinOf(0xc8674a)],
      antihelix: ['antelice, con le due radici', ...skinOf(0xd98b6e)],
      scapha: ["scafa (solco dell'elice)", ...skinOf(0xb96f5a)],
      fossa: ['fossa triangolare', ...skinOf(0xb5705c)],
      concha: ['conca: cimba e cavo', ...skinOf(0xa86052)],
      tragus: ['trago', ...skinOf(0xe2a183)],
      antitragus: ['antitrago', ...skinOf(0xd58f72)],
      incisure: ['incisura intertragica', ...skinOf(0xbd7a66)],
      notch: ["incisura anteriore e radice dell'elice", ...skinOf(0xcf8d74)],
      lobule: ['lobulo', ...skinOf(0xf2c6b3)],
      medial: ['superficie mediale del padiglione', ...skinOf(0xdba58d)],
      sulcus: ['solco cefalo-auricolare', ...skinOf(0xc98a72)],
      // la cute non è mai mostrata (la «regione auricolare» avvolge l'elice come un
      // collare): serve a posare sotto di essa nervi e muscoli ricostruiti
      skin: ['cute della regione auricolare', 0xdcc3b3, { double: true }],
      skinFar: ['cute', 0xdcc3b3, { double: true }],
      temporal: ['osso temporale', BONE, { ghost: true, opacity: 0.16 }],
      temporalFar: ['osso temporale', BONE, { ghost: true, opacity: 0.16 }],
      temporalMeatus: ['osso temporale attorno al meato', BONE, { ghost: true, opacity: 0.2 }],
      mandible: ['mandibola: ramo e condilo', BONE, { ghost: true, opacity: 0.16 }],
      tmFlac: ['pars flaccida (membrana di Shrapnell)', 0xd98a8a, { double: true }],
      tmAS: ['quadrante antero-superiore', 0xdcb0a6, { double: true }],
      tmPS: ['quadrante postero-superiore', 0xd3a79f, { double: true }],
      tmPI: ['quadrante postero-inferiore', 0xdcb0a6, { double: true }],
      tmAI: ['quadrante antero-inferiore', 0xd3a79f, { double: true }],
      manubrium: ['manico del martello', 0xf0e6cc],
      malleusHead: ['martello: testa e collo', 0xf0e6cc],
      sta: ['arteria temporale superficiale', 0xcf3b32],
      eca: ['arteria carotide esterna', 0xa62a26],
      atn: ['nervo auricolotemporale (V3)', 0xe8862a],
      facial: ['nervo faciale (VII)', 0x8d5fd3],
      scm: ['muscolo sternocleidomastoideo', 0xb8756a, { opacity: 0.55 }],
      parotid: ['ghiandola parotide', 0xe0b98a, { ghost: true, opacity: 0.2 }],
    });
    this.#smooth(AURICLE);
    this.#smooth(DRUM);
    this.#inflate('atn', 0.45 * S);
    this.#inflate('facial', 0.35 * S);
    this.#meatus();
    this.#drum();
    this.#nervesAndVessels();
    this.moved = [...AURICLE, 'porus'].flatMap((id) => this.parts.get(id).meshes.map((mesh) => ({ mesh, rest: mesh.position.clone(), w: 1 })));
    this.moved.push(...this.parts.get('cerumen').meshes.map((mesh, i) => ({ mesh, rest: mesh.position.clone(), w: 1, d: this.cerumenShift[i] })));
  }

  // Normali comuni ai vertici coincidenti di più parti: i frammenti del
  // padiglione (e i quadranti della membrana) appaiono come una superficie sola.
  #smooth(ids, tol = 0.06 * S) {
    const items = [];
    const cells = new Map();
    const a = V(0, 0, 0), b = V(0, 0, 0), c = V(0, 0, 0);
    for (const id of ids)
      for (const mesh of this.parts.get(id).meshes) {
        const pos = mesh.geometry.attributes.position;
        const acc = new Float32Array(pos.count * 3);
        const index = mesh.geometry.index.array;
        for (let t = 0; t < index.length; t += 3) {
          a.fromBufferAttribute(pos, index[t]);
          b.fromBufferAttribute(pos, index[t + 1]).sub(a);
          c.fromBufferAttribute(pos, index[t + 2]).sub(a);
          b.cross(c); // lunghezza = doppio dell'area: pesa i triangoli grandi
          for (let k = 0; k < 3; k++) {
            acc[index[t + k] * 3] += b.x;
            acc[index[t + k] * 3 + 1] += b.y;
            acc[index[t + k] * 3 + 2] += b.z;
          }
        }
        for (let i = 0; i < pos.count; i++) {
          const p = a.fromBufferAttribute(pos, i).add(mesh.position).clone();
          const item = { mesh, i, p, n: V(acc[i * 3], acc[i * 3 + 1], acc[i * 3 + 2]), root: null };
          item.root = item;
          items.push(item);
          const key = [Math.floor(p.x / tol), Math.floor(p.y / tol), Math.floor(p.z / tol)];
          const find = (it) => {
            while (it.root !== it) it = it.root = it.root.root;
            return it;
          };
          for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++)
              for (let dz = -1; dz <= 1; dz++)
                for (const other of cells.get(`${key[0] + dx},${key[1] + dy},${key[2] + dz}`) ?? [])
                  if (other.p.distanceToSquared(p) < tol * tol) find(other).root = find(item);
          const name = key.join(',');
          (cells.get(name) ?? cells.set(name, []).get(name)).push(item);
        }
      }
    const find = (it) => {
      while (it.root !== it) it = it.root = it.root.root;
      return it;
    };
    const sum = new Map();
    for (const it of items) {
      const r = find(it);
      (sum.get(r) ?? sum.set(r, V(0, 0, 0)).get(r)).add(it.n);
    }
    for (const it of items) {
      const n = a.copy(sum.get(find(it))).normalize();
      it.mesh.geometry.attributes.normal.setXYZ(it.i, n.x, n.y, n.z);
      it.mesh.geometry.attributes.normal.needsUpdate = true;
    }
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

  // triangoli di alcune parti, nelle coordinate del modello
  #triangles(ids) {
    const out = [];
    for (const id of ids)
      for (const mesh of this.parts.get(id).meshes) {
        const pos = mesh.geometry.attributes.position;
        const index = mesh.geometry.index.array;
        for (let t = 0; t < index.length; t += 3)
          out.push([0, 1, 2].map((k) => new THREE.Vector3().fromBufferAttribute(pos, index[t + k]).add(mesh.position)));
      }
    return out;
  }

  // primo punto in cui il raggio (origine o, direzione d) incontra i triangoli
  #hit(tris, o, d) {
    const ray = new THREE.Ray(o, d);
    const p = new THREE.Vector3();
    let best = null, bestT = Infinity;
    for (const [a, b, c] of tris) {
      if (!ray.intersectTriangle(a, b, c, false, p)) continue;
      const t = p.distanceTo(o);
      if (t < bestT) {
        bestT = t;
        best = p.clone();
      }
    }
    return best;
  }

  #meatus() {
    const curveOf = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => P(...p)), false, 'centripetal');
    // parametro del punto della curva più vicino a un punto dato
    const paramOf = (curve, p) => {
      let best = 0, d = Infinity;
      for (let i = 0; i <= 400; i++) {
        const e = curve.getPointAt(i / 400).distanceToSquared(p);
        if (e < d) {
          d = e;
          best = i / 400;
        }
      }
      return best;
    };
    const rest = curveOf(CANAL);
    const pulled = curveOf(CANAL_PULLED);
    const joint = P(...CANAL[2]);
    const uJ = paramOf(rest, joint);
    const cartA = duct(rest, 0, uJ, CART_R);
    const cartB = duct(pulled, 0, paramOf(pulled, joint), CART_R);
    const cart = this.addPart('meatusCart', 'meato acustico esterno: parte fibrocartilaginea', 0x86bdd6, [cartA], { double: true });
    const a = cartA.attributes.position.array.slice();
    const b = cartB.attributes.position.array.slice();
    for (let i = 0; i < b.length; i += 3) {
      b[i] -= cart.center.x;
      b[i + 1] -= cart.center.y;
      b[i + 2] -= cart.center.z;
    }
    this.cart = { geo: cartA, a, b, t: -1 };
    this.addPart('meatusBone', 'meato acustico esterno: parte ossea (osso timpanico)', 0xe6d3a8, [
      duct(rest, uJ, 1, BONE_R, { seg: 40, clip: { c: TM_C, n: TM_N, off: 0.25 * S } }),
    ], { double: true });
    const t = rest.getTangentAt(uJ);
    const side = new THREE.Vector3().crossVectors(t, V(0, 1, 0)).normalize();
    const top = new THREE.Vector3().crossVectors(side, t).normalize();
    this.addPart('isthmus', 'istmo del meato', 0xd0672f, [ring(joint, side, top, 2.75, 3.45, 0.42)]);
    // poro acustico esterno: disco scuro appena sopra il fondo chiuso della conca reale
    const porus = ellipsoid([0, 0, 0], mm([0.3, 3.9, 3.0]), null, 20);
    const pc = P(-66.0, 4.0, 1575.0);
    porus.translate(pc.x, pc.y, pc.z);
    this.addPart('porus', 'poro acustico esterno', 0x3b2620, [porus]);
    // cerume sulla parete inferiore del tratto cartilagineo
    const uP = paramOf(pulled, joint);
    this.cerumenShift = [];
    const blob = (u, r) => {
      const p = rest.getPointAt(u * uJ);
      this.cerumenShift.push(pulled.getPointAt(u * uP).sub(p)); // segue la parete quando il padiglione è stirato
      return ellipsoid([p.x, p.y - (3.1 - u) * S, p.z], mm([r * 1.5, r * 0.6, r]), null, 12);
    };
    this.addPart('cerumen', 'cerume (ghiandole ceruminose e sebacee della cute)', 0xd99a1e, [blob(0.3, 1.0), blob(0.55, 1.2), blob(0.82, 0.9)]);
  }

  // Punto della faccia laterale della membrana reale di coordinate (u, v) mm nel
  // suo piano, sollevato di `off` mm verso il meato; null fuori dalla membrana.
  #onDrum(u, v, off = 0.12) {
    const o = TM_C.clone().addScaledVector(TM_POST, u * S).addScaledVector(TM_UP, v * S).addScaledVector(TM_N, -3 * S);
    return this.#hit(this.drumTris, o, TM_N)?.addScaledVector(TM_N, -off * S) ?? null;
  }

  #drum() {
    this.drumTris = this.#triangles(DRUM);
    const on = (u, v, off) => this.#onDrum(u, v, off);
    // margine della membrana nella direzione `a` (dal centro)
    const rim = (a, inset = 0.25) => {
      let r = 3;
      while (r < 7 && on(Math.cos(a) * (r + 0.05), Math.sin(a) * (r + 0.05))) r += 0.05;
      return [Math.cos(a) * (r - inset), Math.sin(a) * (r - inset)];
    };
    const line = (a, b, n, off) => {
      const out = [];
      for (let i = 0; i <= n; i++) {
        const p = on(a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n, off);
        if (p) out.push(p);
      }
      return out;
    };
    const u = on(...UMBO, 0.2);
    this.addPart('umbo', 'ombelico della membrana', 0xb5483a, [ellipsoid([u.x, u.y, u.z], mm([0.3, 0.3, 0.3]), null, 16)]);

    // orletto anulare: lungo il margine della pars tensa, aperto in alto
    const ann = [];
    for (let a = RIM_ANT; a <= RIM_POST + Math.PI * 2 + 1e-6; a += (RIM_POST + Math.PI * 2 - RIM_ANT) / 48) ann.push(on(...rim(a), 0.15));
    this.addPart('annulus', 'orletto anulare (di Gerlach)', 0xf4ead6, [taperTube(ann.filter(Boolean), 0.24 * S, { seg: 120, radial: 8 })]);

    this.addPart('folds', 'pliche timpano-malleolari anteriore e posteriore', 0xb86a7c, [
      taperTube(line(LAT, rim(RIM_ANT), 6, 0.2), 0.2 * S, { seg: 20, radial: 8 }),
      taperTube(line(LAT, rim(RIM_POST), 6, 0.2), 0.2 * S, { seg: 20, radial: 8 }),
    ]);

    // triangolo luminoso: dall'ombelico alla periferia, nel quadrante antero-inferiore
    const dir = Math.atan2(-0.69, -0.72);
    const rows = [];
    for (let i = 0; i <= 8; i++) {
      const r = 0.55 + (2.9 * i) / 8;
      const row = [];
      for (let j = -3; j <= 3; j++) {
        const a = dir + (j / 3) * 0.3;
        row.push(on(UMBO[0] + Math.cos(a) * r, UMBO[1] + Math.sin(a) * r, 0.1) ?? rows.at(-1)?.[j + 3] ?? u);
      }
      rows.push(row);
    }
    this.addPart('cone', 'triangolo luminoso', 0xfff4bf, [sheet(rows)], { double: true, roughness: 0.15 });

    // linee dei quadranti: lungo il manico reale e perpendicolare, per l'ombelico
    const reach = (d, sign) => {
      let r = 0.5;
      while (r < 8 && on(UMBO[0] + d[0] * sign * (r + 0.1), UMBO[1] + d[1] * sign * (r + 0.1))) r += 0.1;
      return [UMBO[0] + d[0] * sign * (r - 0.3), UMBO[1] + d[1] * sign * (r - 0.3)];
    };
    this.addPart('cross', 'linee dei quadranti', 0x4a3a34, [
      taperTube(line(reach(HANDLE, -1), reach(HANDLE, 1), 14, 0.16), 0.07 * S, { seg: 40, radial: 6 }),
      taperTube(line(reach(ACROSS, -1), reach(ACROSS, 1), 14, 0.16), 0.07 * S, { seg: 40, radial: 6 }),
    ]);

    // per l'otite: la membrana sporge verso il meato, il margine resta fermo
    const p = new THREE.Vector3();
    this.drumMorph = DRUM.flatMap((id) => this.parts.get(id).meshes).map((mesh) => {
      const pos = mesh.geometry.attributes.position;
      const base = pos.array.slice();
      const w = new Float32Array(pos.count);
      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(pos, i).add(mesh.position).sub(TM_C);
        w[i] = Math.max(0, 1 - (p.dot(TM_POST) / (5.3 * S)) ** 2 - (p.dot(TM_UP) / (4.9 * S)) ** 2);
      }
      return { geo: mesh.geometry, base, w };
    });
    this.drumBulge = 0;
  }

  #nervesAndVessels() {
    const skin = this.#triangles(['skin', 'skinFar']);
    const lateral = V(-1, 0, 0); // dal lato verso la linea mediana
    // punto `depth` mm sotto la cute reale, alle coordinate (y, z) in mm
    const sk = (y, z, depth, fallback) => {
      const o = P(-130, y, z);
      const h = this.#hit(skin, o, lateral);
      return h ? h.addScaledVector(lateral, depth * S) : P(fallback, y, z);
    };
    const path = (pts) => pts.map((p) => (p.length === 4 ? sk(...p) : P(...p)));
    const tube = (pts, radii, opt) => taperTube(path(pts), mm(radii), { seg: 48, radial: 10, ...opt });

    // nervo grande auricolare: sullo sternocleidomastoideo, verso lobulo e parotide
    const fork = [4, 1546.5, 1.5, -58.5];
    this.addPart('gan', 'nervo grande auricolare (C2-C3)', 0xe6c229, [
      tube([[11.5, 1524, 1.5, -55], [9, 1532, 1.5, -56], [6.5, 1540, 1.5, -57], fork], [0.95, 0.95, 0.9, 0.8]),
      tube([fork, [-3, 1550.5, 1.5, -59], [-10, 1555, 1.5, -60], [-16, 1560, 1.5, -62]], [0.75, 0.65, 0.55, 0.35]),
      tube([fork, [9, 1552, 1.5, -60], [14, 1560, 1.5, -62.5], [17.5, 1569, 1.5, -64], [20, 1579, 1.5, -67]], [0.75, 0.65, 0.6, 0.5, 0.35]),
      tube([fork, [-61.5, 3.5, 1551], [-65.5, 2.5, 1556.5]], [0.7, 0.55, 0.35]),
    ]);

    // ramo auricolare del vago: dal canale del faciale reale, per la fessura
    // timpano-mastoidea, alla parete posteriore del meato e alla conca
    this.addPart('arnold', 'ramo auricolare del nervo vago', 0x2fa37a, [
      tube([[-46.5, 10.8, 1567], [-51, 10.8, 1570.2], [-56, 10.4, 1572.6], [-61, 9.6, 1574.2], [-65.6, 8.4, 1575.6]], [0.55, 0.6, 0.6, 0.55, 0.4]),
      tube([[-56, 10.4, 1572.6], [-58.5, 8.6, 1575.5], [-61, 7.6, 1577]], [0.45, 0.4, 0.3]),
    ]);

    // nervo auricolare posteriore: primo ramo extracranico del faciale reale
    this.addPart('pan', 'nervo auricolare posteriore (ramo del faciale)', 0x8d5fd3, [
      tube([[-49.6, 8, 1560.3], [-54, 12, 1563], [-58.5, 16, 1567.5], [-62, 19.5, 1573], [-64.5, 23, 1579.5], [-66.3, 26.5, 1584.5]], [0.75, 0.7, 0.65, 0.6, 0.55, 0.4]),
    ]);

    // arteria auricolare posteriore: dalla carotide esterna reale al solco tra
    // padiglione e mastoide (accanto alla vena reale, non mostrata)
    this.addPart('paa', 'arteria auricolare posteriore', 0xe0554a, [
      tube(
        [[-41.5, -0.8, 1548], [-46, 3, 1553], [-51.5, 6.5, 1558.6], [-56, 10, 1563.6], [-60, 13.2, 1568.5], [-63, 16.3, 1573], [-65.5, 19.6, 1578.5], [-67.6, 22, 1584.5], [-70, 23.2, 1592], [-72, 23.8, 1600]],
        [1.15, 1.1, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.4],
        { seg: 80 }
      ),
      tube([[-65.5, 19.6, 1578.5], [-69, 18.8, 1580.5], [-72, 17.2, 1582]], [0.6, 0.5, 0.35]),
    ]);

    // muscoli auricolari: lamine sottocutanee dalla testa al padiglione
    const fan = (top, bottom, depth, fallback, n = 7, rows = 6) => {
      const out = [];
      for (let i = 0; i <= rows; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
          const f = j / (n - 1), g = i / rows;
          const a = [top[0][0] + (top[1][0] - top[0][0]) * f, top[0][1] + (top[1][1] - top[0][1]) * f];
          const b = [bottom[0][0] + (bottom[1][0] - bottom[0][0]) * f, bottom[0][1] + (bottom[1][1] - bottom[0][1]) * f];
          row.push(sk(a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g, depth, fallback));
        }
        out.push(row);
      }
      return sheet(out);
    };
    const MUSCLE = 0xa8473f;
    this.addPart('aurSup', 'muscolo auricolare superiore', MUSCLE, [fan([[-4, 1625], [14, 1624]], [[1.5, 1606.5], [9.5, 1606.5]], 1.2, -77)], { double: true });
    this.addPart('aurAnt', 'muscolo auricolare anteriore', 0xb9584a, [fan([[-25, 1607], [-24, 1597]], [[-8.5, 1597], [-8, 1592.5]], 1.2, -72, 5)], { double: true });
    this.addPart('aurPost', 'muscolo auricolare posteriore', 0x96403a, [fan([[36, 1590.5], [35, 1584]], [[23.5, 1588], [23, 1584]], 1.2, -70, 5)], { double: true });
  }

  // pull: padiglione stirato in alto e indietro (0-1); bulge: membrana sporgente (0-1)
  setState(state = {}) {
    Object.assign(this.stateTarget, { pull: 0, bulge: 0 }, state);
  }

  reset() {
    super.reset();
    this.setState();
  }

  #pose() {
    if (!this.moved) return;
    const s = this.state;
    const d = D(...PULL).multiplyScalar(Math.hypot(...PULL) * S * s.pull);
    for (const m of this.moved) m.mesh.position.copy(m.rest).addScaledVector(m.d ?? d, m.d ? s.pull : m.w);
    const c = this.cart;
    if (Math.abs(s.pull - c.t) > 1e-4) {
      c.t = s.pull;
      const pos = c.geo.attributes.position;
      for (let i = 0; i < c.a.length; i++) pos.array[i] = c.a[i] + (c.b[i] - c.a[i]) * s.pull;
      pos.needsUpdate = true;
      c.geo.computeVertexNormals();
    }
    if (Math.abs(s.bulge - this.drumBulge) > 1e-4) {
      this.drumBulge = s.bulge;
      const k = -1.7 * S * s.bulge;
      for (const m of this.drumMorph) {
        const pos = m.geo.attributes.position;
        for (let i = 0; i < m.w.length; i++) {
          pos.array[i * 3] = m.base[i * 3] + TM_N.x * k * m.w[i];
          pos.array[i * 3 + 1] = m.base[i * 3 + 1] + TM_N.y * k * m.w[i];
          pos.array[i * 3 + 2] = m.base[i * 3 + 2] + TM_N.z * k * m.w[i];
        }
        pos.needsUpdate = true;
      }
      this.#smooth(DRUM);
    }
  }

  update(dt, camera, realDt = dt) {
    const step = Math.min(realDt, 0.5);
    const k = 1 - Math.exp(-step * 5);
    for (const key of Object.keys(this.state)) {
      this.state[key] += (this.stateTarget[key] - this.state[key]) * k;
      if (Math.abs(this.stateTarget[key] - this.state[key]) < 1e-3) this.state[key] = this.stateTarget[key];
    }
    this.#pose();
    super.update(dt, camera, realDt);
  }
}
