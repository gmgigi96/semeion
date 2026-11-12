// Capitolo "Plesso sacrale e pudendo". Testi dagli appunti di neuroanatomia
// (5. Plesso sacrale e pudendo).
import { selector } from '../modes.js';
import { PlessoSacrale } from '../models/plesso-sacrale.js';

const SPINE = ['l4', 'l5', 'discs', 'sacrum'];
const PELVIS = [...SPINE, 'hip', 'hipAnt'];
const TRUNK = ['L4', 'L5', 'lst'];
const SACRAL = [...TRUNK, 'S1', 'S2', 'S3', 'plexus'];
const PUD_ROOTS = ['S2p', 'S3p', 'S4'];
const SCIATIC = ['sciGlut', 'sciThigh'];
const BELOW = ['gluInf', 'nQF', 'nOI', 'pfcn', 'sciGlut', 'pud'];
const PUD = ['pud', 'pudRect', 'pudPerin', 'pudDors'];
const TAGS = { tagL4: 'L4', tagL5: 'L5', tagS1: 'S1', tagS2: 'S2', tagS3: 'S3', tagS4: 'S4' };
const FIB_TERR = ['fibSup', 'fibDeep', 'extensors', 'peronei'];
const LEG = ['tibPop', 'tibial', 'plantar', 'fibCom', 'fibSup', 'fibDeep', 'sural'];

// Primo piano: all'ingresso nella pagina il modello viene centrato sul punto
// `at` (mm Z-Anatomy), ingrandito e inclinato (vedi `focus` nel modello).
const closeUp = (at, scale, height, lean, mode) => async (ctx) => {
  const api = await mode(ctx);
  return { ...api, enter() { api.enter(); ctx.model.focus(at, scale, height, lean); } };
};

const spreads = [
  {
    title: 'Un triangolo davanti al sacro',
    body:
      "Il plesso sacrale si forma dal {tronco lombo-sacrale|lst}, nato dall'anastomosi di parte del ramo anteriore di {L4|l4} con il ramo anteriore di {L5|l5}, unito ai rami anteriori di {S1|s1}, {S2|s2} e gran parte di {S3|s3}. Non ci sono vere anse, ma confluenze ad angolo acuto davanti alla faccia pelvica del {sacro|sacrum}: ne risulta una massa di fibre triangolare, a base mediale e apice infero-laterale, che ha come riferimento il {muscolo piriforme|pir}. Seguendo il piriforme il plesso raggiunge il grande forame ischiatico e, prima di attraversarlo, si risolve nei suoi rami: il terminale è il {nervo ischiatico|sci}.",
    terms: {
      lst: ['lst'], l4: ['L4', 'L4lumb'], l5: ['L5'], s1: ['S1'], s2: ['S2', 'S2p'], s3: ['S3', 'S3p'],
      sacrum: ['sacrum'], pir: ['piriformis'], sci: ['plexus', 'sciGlut'],
    },
    quiz: {
      question: 'Da che cosa nasce il tronco lombo-sacrale?',
      options: [
        'Dai rami anteriori di L3 e L4',
        'Da parte del ramo anteriore di L4 e dal ramo anteriore di L5',
        'Dai rami anteriori di L5 e S1',
        'Dai rami posteriori di L4 e L5',
      ],
      correct: 1,
      explain: 'Il resto del ramo anteriore di L4 va al plesso lombare; al tronco si uniscono poi S1, S2 e gran parte di S3.',
    },
    caption: 'Emibacino destro visto da davanti: ossa e piriforme reali (Z-Anatomy), nervi sul loro decorso reale.',
    instruction: 'SCEGLI UNA RADICE E SEGUI DOVE VANNO LE SUE FIBRE',
    view: { yaw: 0.8, zoom: 1.1 },
    mode: closeUp([-40, 40, 925], 4, 0.44, -0.45, selector({
      base: [...PELVIS, 'piriformis', ...SACRAL, 'L4lumb', ...PUD_ROOTS, 'sciGlut'],
      labels: TAGS,
      looks: { hip: { opacity: 0.3 }, hipAnt: { opacity: 0.12 } },
      pick: { L4: 0, L4lumb: 0, L5: 0, lst: 0, S1: 1, S2: 2, S2p: 2, S3: 3, S3p: 3, plexus: 4, sciGlut: 4 },
      idle: 'Ogni radice ha un colore. Le radici confluiscono ad angolo acuto verso il margine inferiore del piriforme.',
      options: [
        { label: 'Tronco lombo-sacrale', lit: [...TRUNK, 'L4lumb'], labels: TAGS, info: 'Parte del ramo anteriore di L4 (il resto va al plesso lombare) si anastomizza con il ramo anteriore di L5.' },
        { label: 'S1', lit: ['S1', 'plexus'], labels: TAGS, info: 'Il ramo anteriore di S1 si unisce al tronco lombo-sacrale.' },
        { label: 'S2 · bigemino', lit: ['S2', 'S2p'], labels: TAGS, info: 'S2 si unisce in parte a S1 e in parte a S3, ma conserva fibre per il plesso pudendo: nervo bigemino di Jehring.' },
        { label: 'S3', lit: ['S3', 'S3p'], labels: TAGS, info: 'Gran parte di S3 va al plesso sacrale; il resto si anastomizza con S4 nel plesso pudendo.' },
        { label: 'Triangolo', lit: [...SACRAL, 'sciGlut'], labels: TAGS, info: 'Base mediale ai forami sacrali, apice infero-laterale al grande forame ischiatico: da lì continua il nervo ischiatico.' },
      ],
    })),
  },
  {
    title: 'Sopra e sotto il piriforme',
    body:
      "I rami collaterali innervano il cingolo pelvico. Il {nervo gluteo superiore|sup} è l'unico a uscire dalla porzione soprapiriforme del grande forame ischiatico: va ai muscoli {medio|med} e {piccolo gluteo|min} e al {tensore della fascia lata|tfl}. Dalla porzione sottopiriforme escono il {nervo gluteo inferiore|inf} per il {grande gluteo|max}, il nervo del {quadrato del femore|nqf}, il nervo dell'{otturatore interno|noi}, che rientra nella pelvi dal piccolo forame ischiatico, il {nervo cutaneo posteriore della coscia|pfcn}, sensitivo, e lateralmente a questo il {nervo ischiatico|sci}. Il nervo del {piriforme|npir} è l'unico che non esce dalla pelvi.",
    terms: {
      sup: ['gluSup'], med: ['gluMed'], min: ['gluMin'], tfl: ['tfl'], inf: ['gluInf'], max: ['gluMax'],
      nqf: ['nQF', 'quadFem'], noi: ['nOI', 'obtInt'], pfcn: ['pfcn', 'pfcnThigh'], sci: ['sciGlut'], npir: ['nPir', 'piriformis'],
    },
    quiz: {
      question: 'Quale nervo esce dalla porzione soprapiriforme del grande forame ischiatico?',
      options: ['Il nervo gluteo inferiore', 'Il nervo ischiatico', 'Il nervo gluteo superiore', 'Il nervo pudendo'],
      correct: 2,
      explain: 'È l’unico: tutti gli altri rami che lasciano la pelvi passano sotto il piriforme.',
    },
    caption: 'Regione glutea destra vista da dietro; il grande gluteo è in trasparenza.',
    instruction: 'SCEGLI UNA PORZIONE DEL FORAME O UN NERVO · RUOTA IL MODELLO',
    view: { yaw: 3.45, zoom: 1.1 },
    mode: closeUp([-82, 45, 880], 3.7, 0.41, 0.5, selector({
      base: ['sacrum', 'hip', 'hipAnt', 'femur', 'ssl', 'stl', 'piriformis', 'obtInt', 'gemelli', 'quadFem', 'gluMin',
        'gluSup', 'gluInf', 'nQF', 'nOI', 'pfcn', 'sciGlut', 'pud', 'nPir'],
      pick: { gluSup: 2, gluMin: 2, gluInf: 3, nOI: 4, nQF: 4, obtInt: 4, quadFem: 4, pfcn: 5 },
      idle: 'Il piriforme (rosso) divide il grande forame ischiatico in due porzioni.',
      options: [
        { label: 'Sopra il piriforme', lit: ['gluSup', 'piriformis'], info: 'Dalla porzione soprapiriforme passa un solo nervo: il gluteo superiore.' },
        { label: 'Sotto il piriforme', lit: [...BELOW, 'piriformis'], info: 'Gluteo inferiore, nervi del quadrato del femore e dell’otturatore interno, cutaneo posteriore della coscia, ischiatico; più medialmente il pudendo.' },
        { label: 'Gluteo superiore', lit: ['gluSup', 'gluMed', 'gluMin', 'tfl'], show: ['gluMed', 'tfl'], info: 'Diretto ai muscoli piccolo e medio gluteo e al tensore della fascia lata.' },
        { label: 'Gluteo inferiore', lit: ['gluInf', 'gluMax'], show: ['gluMax'], info: 'Innerva il muscolo grande gluteo, che ricopre anche l’ischiatico e il cutaneo posteriore della coscia.' },
        { label: 'Otturatore e quadrato', lit: ['nOI', 'obtInt', 'nQF', 'quadFem', 'gemelli'], info: 'Il nervo dell’otturatore interno rientra dal piccolo forame ischiatico; spesso dà anche il nervo del gemello inferiore.' },
        { label: 'Cutaneo posteriore', lit: ['pfcn'], show: ['gluMax'], info: 'Sensitivo. Scende sotto il grande gluteo, medialmente all’ischiatico, poi si fa superficiale: cute posteriore della coscia fino al poplite.' },
      ],
    })),
  },
  {
    title: 'Il nervo ischiatico',
    body:
      "Il {nervo ischiatico|sci} è il più grande nervo del corpo: ha un calibro di circa 2-2,5 cm ed è lievemente schiacciato in senso antero-posteriore. Esce dalla porzione sottopiriforme del grande forame ischiatico, coperto dal {grande gluteo|max}; superato il suo margine inferiore scende nella loggia posteriore della coscia, tra {bicipite femorale, semitendinoso e semimembranoso|ham} e i fasci profondi del {grande adduttore|add}, ai quali dà rami muscolari. Raggiunto il poplite si fa superficiale e si divide: medialmente il {nervo tibiale|tib}, sua diretta prosecuzione, lateralmente il {nervo peroniero comune|fib}.",
    terms: { sci: SCIATIC, max: ['gluMax'], ham: ['hamstrings'], add: ['addMag'], tib: ['tibPop'], fib: ['fibCom'] },
    quiz: {
      question: 'Dove il nervo ischiatico si divide nei suoi due rami terminali?',
      options: ['Nel grande forame ischiatico', 'Sotto il margine inferiore del grande gluteo', 'Nel poplite', 'Dietro il malleolo mediale'],
      correct: 2,
      explain: 'Nel poplite si fa superficiale e dà il nervo tibiale, medialmente, e il peroniero comune, lateralmente.',
    },
    caption: 'Coscia destra vista da dietro: i muscoli reali sono in trasparenza attorno al nervo.',
    instruction: 'SEGUI IL NERVO DALLA PELVI AL POPLITE, POI PROVA A INTERROMPERLO',
    view: { yaw: 2.9, zoom: 1.1 },
    mode: closeUp([-72, 40, 700], 1.85, 0.43, 0.45, selector({
      base: ['sacrum', 'hip', 'hipAnt', 'femur', 'femurShaft', 'femurDist', 'patella', 'piriformis', 'plexus', ...SCIATIC, 'tibPop', 'fibCom', 'pfcn', 'pfcnThigh', 'hamstrings', 'addMag', 'gluMax'],
      looks: { hamstrings: { opacity: 0.3, litOpacity: 0.75 }, addMag: { opacity: 0.3, litOpacity: 0.75 } },
      idle: 'Giallo: nervo ischiatico. Arancio: nervo tibiale. Verde: peroniero comune. Lilla: cutaneo posteriore della coscia.',
      options: [
        {
          label: 'Segui il nervo', stepTime: 1.8,
          steps: [
            { ids: ['plexus', 'piriformis'], text: 'Esce dalla porzione sottopiriforme del grande forame ischiatico' },
            { ids: ['sciGlut', 'gluMax'], text: 'Scende coperto dal grande gluteo' },
            { ids: ['sciThigh', 'hamstrings', 'addMag'], text: 'Loggia posteriore: tra i muscoli posteriori e il grande adduttore' },
            { ids: ['tibPop', 'fibCom'], text: 'Poplite: nervo tibiale medialmente, peroniero comune lateralmente' },
          ],
        },
        { label: 'Rami muscolari', lit: ['sciThigh', 'hamstrings', 'addMag'], info: 'Semimembranoso, semitendinoso, bicipite femorale e porzione ischio-condilare del grande adduttore.' },
        { label: 'Divisione', lit: ['tibPop', 'fibCom'], info: 'Nel poplite, con i vasi poplitei: il tibiale continua la direzione dell’ischiatico, il peroniero comune segue il bicipite.' },
        {
          label: 'Lesione alla natica', dead: [...SCIATIC, 'tibPop', 'fibCom', 'hamstrings'],
          info: 'Si spegne tutto il territorio: loggia posteriore della coscia, muscoli della gamba e del piede, cute di gamba e piede tranne il margine mediale (nervo safeno).',
        },
      ],
    })),
  },
  {
    title: 'Tibiale e peroniero comune',
    body:
      "Il {nervo peroniero comune|fib} segue il margine del bicipite, gira attorno alla testa della {fibula|fibula} e si divide: il {peroniero superficiale|sup} innerva i {muscoli peronieri|per} lungo e breve e la cute dorsale del piede, il {peroniero profondo|deep} i {muscoli estensori|ext} della gamba e i dorsali del piede. La sua compressione causa la sindrome del piede cadente. Il {nervo tibiale|tib}, destinato alla {loggia posteriore|calf} e alla pianta, si impegna sotto l'arcata del soleo, passa dietro il malleolo mediale e termina nei {nervi plantari|plant} mediale e laterale. Dal suo ramo cutaneo mediale del polpaccio nasce il {nervo surale|sural}.",
    terms: {
      fib: ['fibCom'], fibula: ['fibula'], sup: ['fibSup'], per: ['peronei'], deep: ['fibDeep'], ext: ['extensors'],
      tib: ['tibPop', 'tibial'], calf: ['calf'], plant: ['plantar'], sural: ['sural'],
    },
    quiz: {
      question: 'Una compressione del nervo peroniero comune alla testa della fibula provoca…',
      options: ['la sindrome del canale di Alcock', 'la sindrome del piede cadente', 'la paralisi del tricipite della sura', 'la perdita della sensibilità plantare'],
      correct: 1,
      explain: 'Restano senza innervazione gli estensori della gamba e i peronieri: il piede non si solleva più.',
    },
    caption: 'Gamba e piede destri: il peroniero comune gira attorno alla testa della fibula, il tibiale scende dietro la tibia.',
    instruction: 'SCEGLI UN NERVO · POI COMPRIMI IL PERONIERO COMUNE ALLA FIBULA',
    view: { yaw: 3.75, zoom: 1.1 },
    mode: closeUp([-88, 25, 290], 1.85, 0.44, 0.45, selector({
      base: ['femurDist', 'patella', 'tibia', 'fibula', 'foot', ...LEG, 'calf', 'extensors', 'peronei'],
      looks: { calf: { opacity: 0.22, litOpacity: 0.6 }, extensors: { opacity: 0.45, litOpacity: 0.85 }, peronei: { opacity: 0.45, litOpacity: 0.85 } },
      pick: { fibCom: 0, fibSup: 1, fibDeep: 2, tibial: 3, tibPop: 3, calf: 3, plantar: 4, sural: 5, peronei: 1, extensors: 2 },
      idle: 'Arancio: tibiale. Verde: peroniero comune con i rami superficiale (chiaro) e profondo (scuro). Viola: surale.',
      options: [
        { label: 'Peroniero comune', lit: ['fibCom', 'fibSup', 'fibDeep'], info: 'Gira attorno alla testa della fibula e termina nei rami superficiale e profondo; dà anche il cutaneo laterale del polpaccio.' },
        { label: 'Superficiale', lit: ['fibSup', 'peronei'], info: 'Muscoli peronieri lungo e breve; al terzo inferiore della gamba diventa cutaneo: nervi cutanei dorsali mediale e intermedio.' },
        { label: 'Profondo', lit: ['fibDeep', 'extensors'], info: 'Muscoli estensori della gamba e dorsali del piede; cute tra primo e secondo dito.' },
        { label: 'Tibiale', lit: ['tibPop', 'tibial', 'calf', 'plantar'], info: 'Sotto l’arcata tendinea del soleo, poi dietro il malleolo mediale, nel retinacolo dei flessori con i vasi tibiali posteriori.' },
        { label: 'Plantari', lit: ['plantar'], info: 'Rami terminali del tibiale: il mediale per le prime tre dita e mezzo, il laterale completa muscoli e cute della pianta.' },
        { label: 'Surale', lit: ['sural'], info: 'Cutaneo mediale del polpaccio (dal tibiale) più un ramo dal cutaneo laterale: gira attorno al malleolo laterale fino al margine laterale del piede.' },
        { label: 'Compressione', dead: FIB_TERR, info: 'Sindrome del piede cadente: si spengono estensori e peronieri e la cute del dorso del piede; il tibiale resta integro.' },
      ],
    })),
  },
  {
    title: 'Plesso pudendo e canale di Alcock',
    body:
      "Il plesso pudendo nasce dall'anastomosi di parte del ramo anteriore di {S3|s3} con quello di {S4|s4}, con fibre da {S2|s2}; il suo ramo terminale è il {nervo pudendo|pud}. Emerge dalla porzione sottopiriforme del grande forame ischiatico e rientra nella pelvi aggirando il {legamento sacro-spinoso|ssl} e la spina ischiatica: raggiunge così la fossa ischio-rettale, tra {elevatore dell'ano|lev} e {otturatore interno|oi}. Qui decorre con i {vasi pudendi interni|art} in uno sdoppiamento della fascia dell'otturatore interno, il {canale di Alcock|alcock}. Termina con il {nervo perineale|perin} e il {nervo dorsale del pene o del clitoride|dors}.",
    terms: {
      s3: ['S3p'], s4: ['S4'], s2: ['S2p'], pud: ['pud'], ssl: ['ssl'], lev: ['levator'], oi: ['obtInt'],
      art: ['pudArt'], alcock: ['alcock'], perin: ['pudPerin'], dors: ['pudDors'],
    },
    quiz: {
      question: 'Che cos’è il canale di Alcock?',
      options: [
        'Il piccolo forame ischiatico',
        'Uno sdoppiamento della fascia del muscolo otturatore interno',
        'Lo spazio tra piriforme e legamento sacro-spinoso',
        'Un canale osseo del ramo ischio-pubico',
      ],
      correct: 1,
      explain: 'Accoglie il nervo pudendo e i vasi pudendi interni sulla parete laterale della fossa ischio-rettale.',
    },
    caption: 'Emibacino destro visto da dietro, con il sacro in trasparenza: il pudendo gira attorno al legamento sacro-spinoso.',
    instruction: 'SEGUI IL NERVO PUDENDO DALLE RADICI AI RAMI TERMINALI',
    view: { yaw: 3.35, zoom: 1.1 },
    mode: closeUp([-38, 48, 860], 4.8, 0.42, 0.7, selector({
      base: ['sacrum', 'hip', 'hipAnt', 'ssl', 'stl', 'piriformis', 'obtInt', 'levator', 'sphincter', 'pudArt', ...PUD_ROOTS, ...PUD, 'alcock'],
      looks: { sacrum: { opacity: 0.22 }, stl: { opacity: 0.3, litOpacity: 0.8 }, levator: { opacity: 0.5, litOpacity: 0.9 } },
      labels: { tagS2: 'S2', tagS3: 'S3', tagS4: 'S4' },
      idle: 'Magenta: nervo pudendo. Rosso: arteria pudenda interna (mesh reale). Azzurro: canale di Alcock.',
      options: [
        {
          label: 'Segui il nervo', stepTime: 1.9,
          steps: [
            { ids: PUD_ROOTS, text: 'Radici: parte di S3 e S4, con fibre da S2' },
            { ids: ['pud', 'piriformis'], text: 'Emerge dalla porzione sottopiriforme del grande forame ischiatico' },
            { ids: ['ssl'], text: 'Aggira il legamento sacro-spinoso e la spina ischiatica' },
            { ids: ['alcock', 'pudArt', 'obtInt'], text: 'Canale di Alcock, con i vasi pudendi interni' },
            { ids: ['pudRect', 'pudPerin', 'pudDors'], text: 'Rami: emorroidale inferiore, perineale, dorsale del pene o del clitoride' },
          ],
        },
        { label: 'Radici', lit: PUD_ROOTS, info: 'Dal plesso nascono anche rami per l’ischio-coccigeo e l’elevatore dell’ano, il perforante cutaneo e i rami viscerali.' },
        { label: 'Fossa ischio-rettale', lit: ['levator', 'obtInt', 'stl'], info: 'Piramide di tessuto adiposo: medialmente l’elevatore dell’ano, lateralmente l’otturatore interno, dietro il legamento sacro-tuberoso e il grande gluteo.' },
        { label: 'Canale di Alcock', lit: ['alcock', 'pud', 'pudArt'], info: 'Lesioni dei rami del pudendo nel canale (infezioni, interventi chirurgici) causano la sindrome di Alcock: dolore pelvico cronico incoercibile.' },
        { label: 'Rami terminali', lit: ['pudRect', 'pudPerin', 'pudDors'], info: 'Perineale: cute dei genitali esterni, muscoli del trigono urogenitale. Dorsale del pene o del clitoride. Emorroidale inferiore: sfintere dell’ano.' },
      ],
    })),
  },
];

export default {
  id: 'plesso-sacrale',
  title: 'Plesso sacrale e pudendo',
  blurb: 'Tronco lombo-sacrale, grande forame ischiatico, nervo ischiatico, pudendo e canale di Alcock.',
  part: 'Midollo e nervi spinali',
  order: 15,
  model: 'plesso-sacrale',
  createModel: () => new PlessoSacrale(),
  zoom: 1,
  yaw: 0.8,
  spreads,
};
