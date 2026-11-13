// Modello del plesso lombare destro: colonna da T12 a L5, sacro, bacino,
// femore, muscoli della parete posteriore dell'addome e nervi fino a metà coscia.
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/plesso-lombare.glb,
// manifesto in meshes/plesso-lombare.json): vertebre T12-L5, dischi, sacro e
// coccige, ossa dell'anca, femore, dodicesima costa, grande psoas, iliaco,
// quadrato dei lombi, legamento inguinale, membrana otturatoria, quadricipite,
// sartorio, pettineo, adduttori e gracile, arteria e vena iliaca esterna e
// femorale; nervi ileoipogastrico, ileoinguinale, genitofemorale con i rami
// genitale e femorale, cutaneo laterale della coscia (dal legamento inguinale
// in giù), femorale (dalla fossa iliaca in giù) con safeno e rami cutanei
// anteriori, otturatorio (dallo stretto superiore in giù) con i rami anteriore
// e posteriore, tronco lombosacrale (tratto iniziale del nervo ischiatico).
//   - In Z-Anatomy i nervi sono curve convertite in tubi di 0,5-1 mm di raggio,
//     tutti uguali: qui vengono ingrossati lungo le normali (`inflate`) fino a
//     un calibro leggibile e proporzionato (femorale > otturatorio > collaterali).
//     Il decorso è quello reale, il calibro è una scelta di rappresentazione.
//   - Tutto ciò che scende sotto metà coscia è tagliato su un piano (`clampFloor`).
//
// RICOSTRUITO A MANO: la parte prossimale del plesso, dentro lo psoas. In
// Z-Anatomy le radici ci sono ma con livelli sbagliati rispetto allo scheletro
// dello stesso atlante: il nervo femorale e l'otturatorio nascono dai fori
// L1-L2, L2-L3 e L3-L4 (cioè da L1, L2, L3) e dal foro L4-L5 non esce nulla;
// ileoipogastrico e ileoinguinale nascono dal foro T12-L1; il cutaneo laterale
// della coscia scavalca la cresta iliaca molto in avanti. Perciò questi tratti
// sono stati tagliati (vedi `split` nel manifesto) e rifatti:
//   - rami anteriori di L1-L4 e di L5, dai fori intervertebrali reali (misurati
//     sulle vertebre di Z-Anatomy; per T12, L1, L2, L3 coincidono con i punti
//     di uscita delle curve di Z-Anatomy);
//   - contributo del sottocostale a L1, tre anse anastomotiche, ramo di L4 per
//     il tronco lombosacrale;
//   - radici superiore, media e inferiore del femorale e dell'otturatorio (le
//     radici da L2 e L3 ricalcano in parte le curve di Z-Anatomy; quelle da L4
//     sono nuove), tratto del femorale nel solco tra psoas e iliaco;
//   - tratto del cutaneo laterale della coscia dal margine laterale dello psoas
//     alla spina iliaca anterosuperiore, appoggiato alla superficie reale del
//     muscolo iliaco.
// Lo schema delle anastomosi (chi dà che cosa) è quello degli appunti del
// corso. Fonti lette per origine, punto di emergenza dallo psoas e decorso
// (solo voci di Wikipedia: Gray 1918 su bartleby.com e theodora.com ha
// risposto 403):
//   - «Lumbar plexus», https://en.wikipedia.org/wiki/Lumbar_plexus
//     (plesso laterale ai fori intervertebrali, dentro lo psoas; ileoipogastrico
//     e ileoinguinale dal margine laterale e sul quadrato dei lombi;
//     genitofemorale dalla faccia anteriore; cutaneo laterale dal margine
//     laterale; otturatorio dal lato mediale; femorale nel solco psoas-iliaco)
//   - «Femoral nerve», https://en.wikipedia.org/wiki/Femoral_nerve
//     (divisioni dorsali di L2-L4; sotto il legamento inguinale, lateralmente
//     all'arteria femorale)
//   - «Obturator nerve», https://en.wikipedia.org/wiki/Obturator_nerve
//     (divisioni ventrali di L2-L4; emerge dal margine mediale dello psoas
//     presso lo stretto superiore; parete laterale della pelvi; canale otturatorio)
//   - «Lateral cutaneous nerve of thigh», https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_thigh
//     (margine laterale dello psoas, attraversa obliquamente l'iliaco verso la
//     spina iliaca anterosuperiore, passa sotto o attraverso il legamento inguinale)
//   - «Genitofemoral nerve», https://en.wikipedia.org/wiki/Genitofemoral_nerve
//     (si forma dentro lo psoas e ne perfora la faccia anteriore)
// STIMATO, non tratto da una fonte: la posizione esatta di anse e radici dentro
// lo psoas (distanze di pochi millimetri tra un cordone e l'altro, scelte per
// tenerli distinti), il punto in cui il cutaneo laterale lascia lo psoas, i
// calibri dei nervi.
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube } from '../geo.js';

// Da millimetri Z-Anatomy (x verso sinistra, y verso dietro, z verso l'alto)
// alle coordinate del modello; stessa terna del manifesto.
const S = 0.00155;
const O = [-20, 10, 650];
const mm = (x, y, z) => V(-(x - O[0]) * S, (z - O[2]) * S, -(y - O[1]) * S);
const tube = (pts, r, opts) =>
  taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, ...opts });
const FLOOR = 0.026; // piano di taglio a metà coscia, sul piano della base

const BONE = 0xe9dfc8, MUSCLE = 0xb9584c;
const RAMUS = 0xfff06a, ANSA = 0x2f6fe0;
const IH = 0x8e5bb5, II = 0xd9628f, GF = 0x2a9d9d, LFCN = 0xe0662f, FEM = 0xe8b21e, OBT = 0x2f9a63;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  vT12: ['vertebra T12', BONE],
  vL1: ['vertebra L1', BONE],
  vL2: ['vertebra L2', BONE],
  vL3: ['vertebra L3', BONE],
  vL4: ['vertebra L4', BONE],
  vL5: ['vertebra L5', BONE],
  discs: ['dischi intervertebrali', 0xbfd0d6],
  sacrum: ['sacro e coccige', BONE],
  hip: ["osso dell'anca", BONE],
  hipL: ["osso dell'anca sinistro", BONE, { ghost: true, opacity: 0.16 }],
  femur: ['femore', BONE],
  rib12: ['dodicesima costa', BONE],
  psoas: ['muscolo grande psoas', MUSCLE],
  iliacus: ['muscolo iliaco', 0xc67464],
  ql: ['muscolo quadrato dei lombi', 0xa5564b],
  inguinal: ['legamento inguinale', 0xf4f1e6],
  obtMembrane: ['membrana otturatoria e canale otturatorio', 0xbcc9de, { double: true }],
  quadriceps: ['muscolo quadricipite femorale', 0xbf6253],
  sartorius: ['muscolo sartorio', 0xd08a6c],
  pectineus: ['muscolo pettineo', 0xb36f5f],
  adductors: ['muscoli adduttori e gracile', 0xa85a66],
  artery: ['arteria iliaca esterna e arteria femorale', 0xc23b33],
  vein: ['vena iliaca esterna e vena femorale', 0x4466c9],
  ih: ['nervo ileoipogastrico', IH],
  ii: ['nervo ileoinguinale', II],
  gf: ['nervo genitofemorale', GF],
  gfGenital: ['ramo genitale del genitofemorale', 0x3fb8b0],
  gfFemoral: ['ramo femorale del genitofemorale', 0x1f7f86],
  lfcn: ['nervo cutaneo laterale della coscia (femorocutaneo)', LFCN],
  femoral: ['nervo femorale', FEM],
  saphenous: ['nervo safeno', 0xf0cf5a],
  femCut: ['rami cutanei anteriori del femorale', 0xd9a03c],
  obturator: ['nervo otturatorio', OBT],
  obtAnt: ["ramo anteriore dell'otturatorio", 0x53b784],
  obtPost: ["ramo posteriore dell'otturatorio", 0x1f7a4c],
  lst: ['tronco lombosacrale', 0x8f8474],
};

// Raggio aggiunto ai tubi di Z-Anatomy, in mm.
const INFLATE = {
  ih: 0.9, ii: 0.9, gf: 0.9, gfGenital: 0.7, gfFemoral: 0.7, lfcn: 1.0,
  femoral: 2.3, saphenous: 1.1, femCut: 0.8, obturator: 1.5, obtAnt: 1.0, obtPost: 1.0, lst: 1.6,
};

export class PlessoLombare extends AnatomyModel {
  constructor() {
    super({ tilt: -0.6 });
    this.addStand({ radius: 0.2, z: 0, rod: [-0.03, 0.02, 0.3, -0.118] });
    this.ready = this.#build();
  }

  async #build() {
    await this.loadMeshes('plesso-lombare.glb', REAL);
    for (const [id, d] of Object.entries(INFLATE)) this.#inflate(id, d * S);
    for (const part of this.parts.values()) this.#clampFloor(part);
    // copie trasparenti dei muscoli che contengono o coprono il plesso
    this.#ghostOf('psoas', 'psoasG', 0.5);
    this.#ghostOf('iliacus', 'iliacusG', 0.35);
    this.#plexus();
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

  // Taglio netto a metà coscia: i vertici sotto il piano vengono portati sul piano.
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

  // Parte prossimale del plesso (ricostruita: vedi commento in testa). Punti in mm Z-Anatomy.
  #plexus() {
    const R = 2.1;
    this.addPart('sub', 'contributo del nervo sottocostale (T12)', 0xd6c9a0,
      [tube([[-14, 38, 1132], [-24, 37, 1126], [-34, 35.5, 1117], [-43, 34, 1108], [-48, 33.5, 1102.5]], 1.3)]);
    this.addPart('r1', 'ramo anteriore di L1', RAMUS,
      [tube([[-13, 29, 1101], [-21, 27.5, 1098.5], [-31, 29, 1099.5], [-42, 31.5, 1101], [-51, 33.5, 1101.5]], R)]);
    this.addPart('r2', 'ramo anteriore di L2', RAMUS,
      [tube([[-14, 24, 1068], [-24, 23.5, 1068.5], [-31, 23.3, 1070], [-38, 23, 1072], [-44, 21.5, 1067], [-48, 19.5, 1058]], R)]);
    this.addPart('r3', 'ramo anteriore di L3', RAMUS,
      [tube([[-17, 19, 1035], [-28, 19, 1031.5], [-37, 18, 1028], [-46, 17.5, 1022]], R)]);
    this.addPart('r4', 'ramo anteriore di L4', RAMUS,
      [tube([[-18, 19, 990], [-26, 19, 990], [-34, 18, 988], [-42, 16, 985]], R)]);
    this.addPart('r5', 'ramo anteriore di L5', 0xb9ad98,
      [tube([[-16, 25, 968.5], [-22, 26.5, 967.5], [-28, 28, 967]], 2.2)]);
    this.addPart('a1', 'prima ansa anastomotica (L1-L2)', ANSA,
      [tube([[-25, 28, 1099], [-29, 26, 1091], [-31, 24.5, 1081], [-31, 23.5, 1071]], 2.1, { caps: false })]);
    this.addPart('a2', 'seconda ansa anastomotica (L2-L3)', ANSA,
      [tube([[-27, 23.4, 1069], [-29, 21.5, 1058], [-29.5, 20, 1044], [-29, 19, 1032]], 2.1, { caps: false })]);
    this.addPart('a3', 'terza ansa anastomotica (L3-L4)', ANSA,
      [tube([[-27, 19, 1031], [-28.5, 19.5, 1018], [-28, 19.5, 1003], [-26, 19, 991]], 2.1, { caps: false })]);
    this.addPart('lstL4', 'ramo di L4 per il tronco lombosacrale', 0xa89c86,
      [tube([[-23, 19, 990], [-25.5, 21, 981], [-28, 25, 973], [-30, 28.5, 968]], 1.8, { caps: false })]);

    const FR = 0xeeb430;
    this.addPart('fr2', 'radice superiore del nervo femorale (L2)', FR,
      [tube([[-48, 19.5, 1058], [-56, 18, 1040], [-61, 13, 1015], [-64.5, 7, 992], [-66, 2, 972]], 1.9, { caps: false })]);
    this.addPart('fr3', 'radice media del nervo femorale (L3)', FR,
      [tube([[-46, 17.5, 1022], [-54, 15, 1010], [-60, 10, 996], [-64, 5.5, 983], [-66, 2, 972]], 1.9, { caps: false })]);
    this.addPart('fr4', 'radice inferiore del nervo femorale (L4)', FR,
      [tube([[-42, 16, 985], [-52, 11, 979], [-60, 6, 975], [-66, 2, 972]], 1.9, { caps: false })]);
    this.addPart('femPelvic', 'nervo femorale, tra psoas e iliaco', FEM,
      [tube([[-66, 2, 972], [-69.5, -3.5, 961], [-73, -10, 948], [-76, -16, 939], [-78, -19, 934]], [2.9, 3.1], { caps: false })]);

    const OR = 0x58b889;
    this.addPart('or2', 'radice superiore del nervo otturatorio (L2)', OR,
      [tube([[-41, 22.3, 1069.5], [-44, 17, 1050], [-47, 13.5, 1024], [-49, 13, 998], [-49.5, 16, 972], [-48, 22, 949]], 1.4, { caps: false })]);
    this.addPart('or3', 'radice media del nervo otturatorio (L3)', OR,
      [tube([[-37, 18, 1028], [-41, 14, 1012], [-44.5, 12.5, 993], [-47, 15, 973], [-48, 22, 949]], 1.4, { caps: false })]);
    this.addPart('or4', 'radice inferiore del nervo otturatorio (L4)', OR,
      [tube([[-34, 18, 988], [-39, 16, 977], [-44, 17, 964], [-47, 20, 955], [-48, 22, 949]], 1.4, { caps: false })]);

    this.addPart('lfcnProx', 'nervo cutaneo laterale della coscia, nella fossa iliaca', LFCN,
      [tube([[-48, 19.5, 1058], [-56, 24, 1050], [-62, 31, 1038], [-66, 34, 1024], [-74, 24, 1004], [-80, 13, 995],
        [-86, -1, 985], [-92, -15.5, 975], [-99, -29.5, 965], [-105, -42, 957], [-108, -54.3, 953]], 1.5, { seg: 70, caps: false })]);
  }
}
