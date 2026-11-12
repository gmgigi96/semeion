// Modello del nervo faciale (VII).
//
// MESH REALI (Z-Anatomy, CC BY-SA 4.0; public/meshes/nervo-faciale.glb, manifesto
// in meshes/nervo-faciale.json):
//   - nervo faciale destro, oggetto unico Z-Anatomy fatto di 12 tubi, diviso per
//     posizione (`split`) in: fibre intrapontine con il ginocchio interno attorno
//     al nucleo dell'abducente (fnPons), tratto cisternale (fnCist), meatale
//     (fnMeat), labirintico (fnLab), timpanico (fnTymp), mastoideo (fnMast),
//     tronco extracranico (fnTrunk), rami superiori (tempFac) e inferiori
//     (cervFac), moncone del grande petroso (gspn, 10 mm), tratto della corda del
//     timpano nella cassa (chordaTy); nervo faciale sinistro intero (fnLeft);
//   - corda del timpano dalla base cranica al nervo linguale, nervo linguale,
//     nervo mascellare, nervi vestibolo-cocleare, vestibolare e cocleare;
//   - nucleo motore del faciale (diviso in metà dorsale e ventrale), nucleo
//     salivatorio superiore, nucleo del tratto solitario, nucleo dell'abducente;
//   - ponte, bulbo, mesencefalo; ossa del cranio; rocca del temporale destro
//     (ritagliata dal temporale); chiocciola, vestibolo con i canali
//     semicircolari, martello, incudine, staffa, membrana del timpano;
//   - muscoli mimici dei due lati, occipitale, ventre posteriore del digastrico,
//     stiloioideo; ghiandole lacrimale, parotide, sottomandibolare, sottolinguale; lingua.
// I confini tra i tratti del canale sono posti sulla mesh: uscita dal ponte dove
// il tubo attraversa la superficie del ponte reale (16 mm dal piano mediano),
// poro acustico dove il nervo entra nel temporale reale (27 mm), primo ginocchio
// e secondo ginocchio dove il tubo piega. Lunghezze che ne risultano sulla mesh:
// meatale 10 mm, labirintico 5-6 mm, timpanico 11 mm, mastoideo 17 mm (non
// confrontate con misure di letteratura: nessuna fonte letta le riportava).
// La divisione tra rami superiori e inferiori segue i tubi di Z-Anatomy, che non
// distingue le due branche: è un'approssimazione.
//
// RICOSTRUITI A MANO (Z-Anatomy non li contiene), in mm nella terna Z-Anatomy:
//   - ganglio genicolato: ellissoide sul primo ginocchio del nervo reale;
//   - nervo intermedio: tubo sottile accanto al faciale reale, tra questo e
//     l'VIII reale, dal ponte al ganglio genicolato (posizione stimata);
//   - nucleo lacrimatorio: ellissoide subito sopra il salivatorio superiore reale
//     (per la fonte letta è una parte di quel nucleo: posizione stimata);
//   - prosecuzione del grande petroso: dal moncone reale, sulla faccia anteriore
//     della rocca, sotto il ganglio trigeminale fino al foro lacero (individuato
//     sul gomito della carotide interna reale), poi nel canale pterigoideo fino
//     al ganglio sfeno-palatino, posto sotto il nervo mascellare reale nella
//     fossa pterigo-palatina (decorso verificato, coordinate stimate);
//   - ponte tra i due tratti reali della corda del timpano (dal collo del
//     martello alla fessura petro-timpanica: stimato; il primo tratto
//     dell'oggetto Z-Anatomy, che partiva medialmente alla chiocciola, è scartato);
//   - muscolo stapedio (dall'eminenza piramidale, davanti al tratto mastoideo,
//     al collo della staffa reale) e nervo stapedio. Lunghezza disegnata circa
//     6 mm con il tendine: la fonte letta dice «poco più di 1 mm», valore non
//     compatibile con la distanza tra canale del faciale e staffa nella mesh;
//   - ganglio sottomandibolare: appeso al nervo linguale reale sopra la ghiandola;
//   - rami extrapetrosi: nervo auricolare posteriore (davanti al mastoide, poi
//     lungo la linea nucale fino al muscolo occipitale reale), rami per il
//     digastrico e per lo stiloioideo reali (origine verificata, decorso stimato);
//   - vie disegnate come frecce: fibre cortico-nucleari nel ponte (schema:
//     bilaterali alla parte dorsale del nucleo motore, crociate alla ventrale),
//     fibre postgangliari per ghiandola lacrimale, sottomandibolare, sottolinguale.
//
// FONTI LETTE (tutte voci di Wikipedia o pagine didattiche; StatPearls/NCBI e
// Radiopaedia hanno rifiutato l'accesso):
//   - «Facial nerve», https://en.wikipedia.org/wiki/Facial_nerve
//     (sei segmenti, rami intrapetrosi ed extracranici, paralisi centrale e periferica)
//   - «Facial canal», https://en.wikipedia.org/wiki/Facial_canal
//     (circa 3 cm; labirintico sopra la chiocciola, timpanico sopra la finestra
//     ovale e sotto il canale semicircolare laterale, mastoideo verticale;
//     corda e nervo stapedio lasciano il tratto discendente)
//   - «Facial motor nucleus», https://en.wikipedia.org/wiki/Facial_motor_nucleus
//     (tegmento pontino caudale ventro-laterale; ansa attorno al nucleo
//     dell'abducente; parte dorsale per il viso superiore con afferenze
//     bilaterali, parte ventrale con afferenze controlaterali)
//   - «Superior salivatory nucleus», https://en.wikipedia.org/wiki/Superior_salivatory_nucleus
//   - «Greater petrosal nerve», https://en.wikipedia.org/wiki/Greater_petrosal_nerve
//   - «Pterygopalatine ganglion», https://en.wikipedia.org/wiki/Pterygopalatine_ganglion
//   - «Chorda tympani», https://en.wikipedia.org/wiki/Chorda_tympani
//   - «Submandibular ganglion», https://en.wikipedia.org/wiki/Submandibular_ganglion
//   - «Stapedius muscle», https://en.wikipedia.org/wiki/Stapedius_muscle
//   - «Posterior auricular nerve», https://en.wikipedia.org/wiki/Posterior_auricular_nerve
//   - «The Facial Nerve (CN VII)», https://teachmeanatomy.info/head/cranial-nerves/facial-nerve/
//     (ordine dei rami nel canale; lesioni prossimali e distali al foro stilo-mastoideo)
//
// Coordinate del modello: x laterale (destra del paziente +), y craniale, z anteriore.
import * as THREE from 'three';
import { AnatomyModel } from '../model.js';
import { V, taperTube, ellipsoid, mirror } from '../geo.js';

// Da millimetri Z-Anatomy (lato destro: `a` = distanza dal piano mediano, `b`
// verso dietro, `h` verso l'alto) alle coordinate del modello; stessa terna del
// manifesto: origine (0, 0, 1485), 0.0034 unità per mm.
const S = 0.0034;
const mm = (a, b, h) => V(a * S, (h - 1485) * S, -b * S);
const tube = (pts, r, opts) => taperTube(pts.map((p) => mm(...p)), Array.isArray(r) ? r.map((v) => v * S) : r * S, { radial: 10, ...opts });
const ball = ([a, b, h], [ra, rb, rh]) => {
  const c = mm(a, b, h);
  return ellipsoid([c.x, c.y, c.z], [ra * S, rh * S, rb * S], null, 16);
};
const disc = (p, n, r) => {
  const g = new THREE.TorusGeometry(r * S, r * S * 0.32, 10, 28);
  const d = V(n[0], n[2], -n[1]).normalize();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d));
  const c = mm(...p);
  return g.translate(c.x, c.y, c.z);
};

const NERVE = 0xe6bd2e, BONE = 0xe9dfc8, STEM = 0xe3cdb6, MUSCLE = 0xb85a50, GLAND = 0xd9a05a;
const PARA = 0x2f6fe0, TASTE = 0x2f9a63, GANGLION = 0xe0662f, CUT = 0xd42a2a;

// Parti reali: id -> [nome, colore, opzioni]
const REAL = {
  fnPons: ['fibre intrapontine del faciale e ginocchio interno', 0xcf9a1e],
  fnCist: ["nervo faciale nell'angolo ponto-cerebellare", NERVE],
  fnMeat: ['nervo faciale nel meato acustico interno', 0xf0d264],
  fnLab: ['tratto labirintico', 0xe07b39],
  fnTymp: ['tratto timpanico', 0xc9485b],
  fnMast: ['tratto mastoideo', 0x8e5bb5],
  fnTrunk: ['tronco extracranico del nervo faciale', NERVE],
  tempFac: ['branca superiore (temporo-faciale)', 0xe9c84a],
  cervFac: ['branca inferiore (cervico-faciale)', 0xd9a02b],
  fnLeft: ['nervo faciale sinistro', NERVE],
  gspn: ['nervo grande petroso superficiale', PARA],
  chordaTy: ['corda del timpano', TASTE],
  chordaLow: ['corda del timpano', TASTE],
  lingual: ['nervo linguale (V3)', 0xb9b28f],
  maxillary: ['nervo mascellare (V2)', 0xb9b28f],
  viii: ['nervo vestibolo-cocleare (VIII)', 0x9fb0c8],
  nucMotUp: ['nucleo motore del faciale, porzione superiore', 0xc9485b],
  nucMotLow: ['nucleo motore del faciale, porzione inferiore', 0xe0862f],
  nucSal: ['nucleo salivatorio superiore', PARA],
  nucSol: ['nucleo del tratto solitario', TASTE],
  nucVI: ["nucleo dell'abducente", 0x9a958c],
  pons: ['ponte', STEM, { ghost: true, opacity: 0.16 }],
  medulla: ['bulbo', STEM, { ghost: true, opacity: 0.16 }],
  medullaLow: ['bulbo', STEM, { ghost: true, opacity: 0.16 }],
  midbrain: ['mesencefalo', STEM, { ghost: true, opacity: 0.16 }],
  skullR: ['cranio, metà destra', BONE, { ghost: true, opacity: 0.1 }],
  skullL: ['cranio, metà sinistra', BONE, { ghost: true, opacity: 0.1 }],
  petrous: ["rocca petrosa dell'osso temporale", BONE, { ghost: true, opacity: 0.2 }],
  cochlea: ['chiocciola', 0x6fb7c9],
  labyrinth: ['vestibolo e canali semicircolari', 0x8fa8d9],
  ossicles: ['martello e incudine', 0xf1ead8],
  stapes: ['staffa', 0xf1ead8],
  tympanic: ['membrana del timpano', 0xe8c9a8, { double: true, opacity: 0.8 }],
  mUpR: ['muscoli mimici superiori di destra (frontale, orbicolare dell’occhio, corrugatore)', MUSCLE],
  mUpL: ['muscoli mimici superiori di sinistra', MUSCLE],
  mLowR: ['muscoli mimici inferiori di destra (buccinatore, risorio, orbicolare delle labbra)', 0xc9705f],
  mLowL: ['muscoli mimici inferiori di sinistra', 0xc9705f],
  occipitalis: ['muscolo occipitale', MUSCLE],
  digastric: ['ventre posteriore del muscolo digastrico', 0xa8483f],
  stylohyoid: ['muscolo stiloioideo', 0xc27a5a],
  lacrimal: ['ghiandola lacrimale', 0x6fb1e0],
  parotid: ['parotide (attraversata, non innervata)', GLAND, { ghost: true, opacity: 0.22 }],
  submandibular: ['ghiandola sottomandibolare', GLAND],
  sublingual: ['ghiandola sottolinguale', 0xe8bd7a],
  tongueAnt: ['due terzi anteriori della lingua', 0xd98c8c],
  tonguePost: ['terzo posteriore della lingua', 0xc9a9a4],
};

export class NervoFaciale extends AnatomyModel {
  constructor() {
    super({ tilt: -0.5 });
    this.addStand({ radius: 0.2, z: -0.02, rod: [0, 0.02, 0.19, -0.075] });
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

  async #build() {
    await this.loadMeshes('nervo-faciale.glb', REAL);
    const geo = (id) => this.parts.get(id).meshes.map((m) => m.geometry.clone().translate(m.position.x, m.position.y, m.position.z));

    // --- nel tronco encefalico ---------------------------------------------
    const lac = ball([6.6, 11.9, 1580.7], [0.55, 0.55, 0.75]);
    this.addPart('nucLac', 'nucleo lacrimatorio', 0x55c2e8, [lac, mirror(lac)]);
    this.addPart('intermedio', 'nervo intermedio di Wrisberg', 0x4a8fd6, [
      tube([[16.2, 12.4, 1577.9], [17.3, 11.6, 1578.2], [18.9, 8.2, 1579.8], [20.3, 6.3, 1581.6],
        [24.7, 3.7, 1581.8], [30.6, 2.5, 1580.9], [35.6, 2.1, 1581.8], [40, 0.7, 1583.3], [42.4, -0.5, 1584.6]], 0.45, { seg: 60 }),
    ]);
    this.addPart('radiceInt', 'radice del nervo intermedio', 0x4a8fd6, [
      tube([[7, 12.3, 1578.6], [10.5, 13.6, 1577.8], [14.5, 13.2, 1577.6], [17.3, 11.6, 1578.2], [18.9, 8.2, 1579.8], [20.3, 6.3, 1581.6], [24.7, 3.7, 1581.8]], 0.45, { seg: 40 }),
    ]);
    // fibre cortico-nucleari (schema): dal piede del peduncolo ai nuclei motori
    const cb = (side, to, low) => {
      const b = low ? 10.1 : 11.1;
      const pts = [[9 * side, -3, 1597], [7.5 * side, -2.5, 1592], [6 * side, 0, 1587.5], [5.5 * side, 4, 1584.5]];
      if (to !== side) pts.push([0, 7.5, 1583]);
      pts.push([4.9 * to, b, 1581 + (low ? -0.4 : 0.4)]);
      return pts.map((p) => mm(...p));
    };
    const link = (id, pts, color) => this.addLink(id, pts, { color, r: 0.2 * S });
    link('cbRupR', cb(1, 1, false), 0x1f9d57);
    link('cbRupL', cb(1, -1, false), 0x1f9d57);
    link('cbLupL', cb(-1, -1, false), 0x1f9d57);
    link('cbLupR', cb(-1, 1, false), 0x1f9d57);
    link('cbRlowL', cb(1, -1, true), 0x1f9d57);
    link('cbLlowR', cb(-1, 1, true), 0x1f9d57);
    // fibre gustative: dal nervo intermedio al nucleo del tratto solitario
    link('gustoIn', [[15, 13, 1577.6], [9, 15.5, 1576.5], [4.5, 17.5, 1574.5], [2.6, 18.6, 1572.5]].map((p) => mm(...p)), TASTE);

    // --- nell'osso temporale -------------------------------------------------
    this.addPart('geniculate', 'ganglio genicolato', GANGLION, [ball([42.9, -0.9, 1585], [1.7, 1.6, 1.4])]);
    this.addPart('stapedius', 'muscolo stapedio', 0xb5302e, [
      tube([[45.4, 9, 1575.2], [45.2, 8.6, 1577.2], [44.9, 7.8, 1579.6], [44.6, 6.6, 1580.7], [44.4, 5.5, 1581]], [0.55, 0.75, 0.6, 0.25, 0.16], { seg: 24 }),
    ]);
    this.addPart('nStap', 'nervo stapedio', 0xf08a3c, [tube([[44.7, 11, 1575.9], [45, 10.2, 1575.6], [45.3, 9.3, 1576]], 0.3, { seg: 10 })]);
    const bridge = tube([[48.3, 2.5, 1582.8], [47.5, 0.4, 1581.6], [44.6, -1.5, 1579], [40, -2.2, 1576.2], [35.8, -1.7, 1574.3], [33.5, -1.5, 1573.4]], 0.7, { seg: 30, caps: false });
    this.addPart('chorda', 'corda del timpano', TASTE, [...geo('chordaTy'), bridge, ...geo('chordaLow')]);

    // --- grande petroso e ganglio sfeno-palatino ----------------------------
    const vidian = tube([[40.8, -11.7, 1585.2], [36, -14, 1585], [28, -16.5, 1585.5], [21, -19, 1585], [17, -21, 1583.5], [15.5, -24, 1580.5],
      [15.5, -29, 1578.3], [17.2, -34.5, 1577.4], [19, -38, 1577.2]], 0.45, { seg: 50, caps: false });
    this.addPart('petroso', 'nervo grande petroso superficiale', PARA, [...geo('gspn'), vidian]);
    this.addPart('ppg', 'ganglio sfeno-palatino', 0x1f55b5, [ball([19.5, -39.5, 1577], [1.8, 2.4, 1.8])]);
    link('lacrime', [[20.5, -41, 1578.5], [25, -47, 1584], [33, -54, 1590], [41, -58.5, 1596.5], [45.5, -60.5, 1600]].map((p) => mm(...p)), PARA);

    // --- ganglio sottomandibolare e ghiandole salivari ------------------------
    this.addPart('smg', 'ganglio sottomandibolare', 0x1f55b5, [ball([20.3, -34.2, 1518.6], [1.5, 2.2, 1.4])]);
    link('salivaSm', [[21, -35, 1517.5], [23, -38, 1515.5], [23.5, -41, 1514.5]].map((p) => mm(...p)), PARA);
    link('salivaSl', [[19, -36, 1518], [16, -42, 1516.5], [14.5, -50, 1515.5], [13.5, -55, 1514.5]].map((p) => mm(...p)), PARA);

    // --- rami extrapetrosi ----------------------------------------------------
    this.addPart('nAur', 'nervo auricolare posteriore', 0xe8843a, [
      tube([[49, 8.5, 1560.6], [52.5, 9.8, 1561.6], [57.5, 12.5, 1565.5], [62.5, 16.5, 1572], [64.5, 22, 1578], [66.5, 30, 1584],
        [66, 40, 1588], [63.5, 50, 1592], [60, 59, 1594.5]], [0.7, 0.55], { seg: 50 }),
    ]);
    this.addPart('nDig', 'nervo per il muscolo digastrico', 0xe8843a, [
      tube([[49.4, 8.1, 1560.1], [50.6, 9.6, 1558.9], [51.2, 11.5, 1558.4], [51.3, 13.6, 1558.2]], 0.5, { seg: 16 }),
    ]);
    this.addPart('nStyl', 'nervo per il muscolo stiloioideo', 0xe8843a, [
      tube([[49.8, 7.5, 1559.4], [47.5, 6.6, 1556.6], [44, 5.6, 1554.8], [40.8, 4.4, 1554.2]], 0.5, { seg: 16 }),
    ]);

    // --- punti di lesione (anelli rossi attorno al nervo reale) ----------------
    this.addPart('cutCortex', 'lesione delle fibre cortico-nucleari di destra', CUT, [disc([10.5, -2, 1611], [-0.2, 0, 1], 5.5)]);
    this.addPart('cutMeat', 'lesione nel meato acustico interno', CUT, [disc([32, 1.4, 1582.1], [1, 0, 0], 3.2)]);
    this.addPart('cutTymp', 'lesione nel tratto timpanico', CUT, [disc([43.5, 5, 1583], [0, 1, -0.45], 3.2)]);
    this.addPart('cutMast', 'lesione nel tratto mastoideo, sotto il nervo stapedio', CUT, [disc([46.3, 11.1, 1570.6], [-0.3, 0, -1], 3.2)]);
    this.addPart('cutForamen', 'lesione al foro stilo-mastoideo', CUT, [disc([50.5, 3.6, 1556.6], [0, -1, -0.55], 3.2)]);
  }
}
