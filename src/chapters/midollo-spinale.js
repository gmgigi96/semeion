// Capitolo "Midollo spinale". Testi dagli appunti di neuroanatomia (Midollo spinale).
import { selector } from '../modes.js';
import { SpinalCord, FOCUS } from '../models/midollo-spinale.js';

const BONES = ['occipital', 'vAtlas', 'vAxis', 'vCerv', 'vThorUp', 'vThorLow', 'vL1', 'vL2', 'vLumb', 'sacrum', 'coccyx'];
const CORD = ['cordTop', 'cervEnl', 'cordThor', 'lumbEnl', 'conus'];
const ROOTS_TOP = ['postRootTop', 'antRootTop', 'ganglionTop'];
const ROOTS_CERV = ['postRootCerv', 'antRootCerv', 'ganglionCerv'];
const ROOTS = [...ROOTS_TOP, ...ROOTS_CERV, 'postRoot', 'antRoot', 'ganglion', 'postRootLow', 'antRootLow', 'ganglionLow'];
const CAUDA = ['cauda', 'caudaRoots'];
const LOW_BONES = ['vL1', 'vL2', 'vLumb', 'sacrum', 'coccyx'];
const PLATE_ROOTS = ['rootPostP', 'rootAntP', 'ganglionP'];
const SEGMENT = ['cordTop', 'antHorn', 'postHorn', 'canal', ...ROOTS_TOP, ...PLATE_ROOTS];
const LAMINAE = ['lam1', 'lam2', 'lam3', 'lam4', 'lam5', 'lam6', 'lam7', 'lam8', 'lam9', 'lam10'];
const UP_TRACTS = ['gracile', 'cuneate', 'sctPost', 'sctAnt', 'sttLat', 'sttAnt', 'lissauer'];
const DOWN_TRACTS = ['cstLat', 'cstAnt', 'rubro', 'vestLat', 'retMed'];
const SULCI = ['fma', 'sla', 'slp', 'sip', 'smp'];
const RINGS = ['pia', 'liquor', 'arachnoid', 'duraRing', 'epidural'];
const GLASS = { cordTop: { opacity: 0.22 } };

const spreads = [
  {
    title: 'Forma e limiti',
    body:
      "Il midollo spinale è una struttura cilindrica contenuta in una parte del canale vertebrale, di cui segue le flessioni. Al {forame magno|fm} si continua con il {midollo allungato|bulbo}: il limite craniale è il punto di mezzo tra l'emergenza del {primo nervo spinale|c1} e quella del nervo ipoglosso. Ha due rigonfiamenti, dovuti all'aumento di sostanza grigia: {cervicale|cerv}, da C5 a T1, e {lombo-sacrale|lumb}. Alla metà superiore della {seconda vertebra lombare|l2} si fa conico: è il {cono terminale|conus}, dal cui apice parte il {filum terminale|filum}. Le radici che restano al di sotto formano la {cauda equina|cauda}.",
    terms: {
      fm: ['occipital', 'vAtlas'], bulbo: ['medulla'], c1: ROOTS_TOP, cerv: ['cervEnl'], lumb: ['lumbEnl'], l2: ['vL2'], conus: ['conus'],
      filum: ['filum', 'coccLig'], cauda: CAUDA,
    },
    quiz: {
      question: 'Perché il midollo spinale è più corto della colonna vertebrale?',
      options: [
        'Perché il filum terminale lo trattiene in alto',
        "Per l'ascensione midollare: durante lo sviluppo smette di accrescersi verso il basso rispetto alla colonna",
        'Perché la cauda equina ne sostituisce la parte sacrale',
        'Perché i rigonfiamenti lo accorciano',
      ],
      correct: 1,
      explain: "L'ascensione midollare si conclude in genere dopo il primo anno di vita.",
    },
    caption: 'Midollo, radici e scheletro reali (Z-Anatomy), visti da dietro. Ogni pulsante porta in primo piano un tratto.',
    instruction: 'SCEGLI UN TRATTO DEL MIDOLLO · TRASCINA PER RUOTARE',
    view: { yaw: 2.55 },
    mode: selector({
      base: [...BONES, 'medulla', ...CORD, ...ROOTS, 'filum', 'coccLig', ...CAUDA],
      pick: { medulla: 0, cordTop: 0, cervEnl: 1, lumbEnl: 2, conus: 3, filum: 4, coccLig: 4, cauda: 5, caudaRoots: 5 },
      idle: 'Dal forame magno a L2: il midollo occupa solo una parte del canale vertebrale.',
      options: [
        {
          label: 'Limite craniale', focus: FOCUS.top, lit: ['medulla', 'cordTop', 'vAtlas', 'occipital', ...ROOTS_TOP],
          info: "Al forame magno il midollo si continua con il midollo allungato; in chirurgia il repere è l'articolazione atlanto-occipitale.",
        },
        {
          label: 'Rig. cervicale', focus: FOCUS.cerv, lit: ['cervEnl', ...ROOTS_CERV],
          info: "Da C5 a T1: qui nasce la rete di nervi del plesso brachiale, per l'arto superiore.",
        },
        {
          label: 'Rig. lombo-sacrale', focus: FOCUS.lumbar, lit: ['lumbEnl', 'postRootLow', 'antRootLow', 'caudaRoots'],
          info: "Porzione lombo-sacrale: qui nascono i plessi lombare e sacrale, per l'arto inferiore.",
        },
        {
          label: 'Cono', focus: FOCUS.conus, lit: ['conus', 'vL2'],
          info: 'A livello di L2 il midollo da cilindrico si fa conico: è il cono terminale.',
        },
        {
          label: 'Filum', focus: FOCUS.filum, lit: ['filum', 'coccLig'],
          info: "Restringimento filiforme che parte dall'apice del cono, dato da atrofia midollare.",
        },
        {
          label: 'Cauda equina', focus: FOCUS.cauda, lit: CAUDA,
          info: 'Radici sensitive e motorie che scendono verticali e si esauriscono man mano che trovano il proprio forame intervertebrale.',
        },
      ],
    }),
  },
  {
    title: 'Le meningi e i mezzi di fissità',
    body:
      "Tre meningi avvolgono il midollo. La {dura madre|dura}, la più spessa, è separata dal periostio del canale vertebrale dallo {spazio peridurale|epi}, occupato da plessi vascolari e tessuto adiposo. L'{aracnoide|arac} aderisce alla dura e manda trabecole verso la {pia madre|pia}, attraverso lo {spazio subaracnoideo|liq} pieno di liquor. La pia aderisce al midollo e ai suoi lati si ispessisce nei {legamenti denticolati|dent}. Sotto il cono, dura e aracnoide restano attaccate alla colonna: si forma la {cisterna midollare|cist}, sede delle punture, che termina a S2. Da lì il {legamento coccigeo|cocc} raggiunge il coccige.",
    terms: {
      dura: ['duraTop', 'duraRing', 'sleevesTop'], epi: ['epidural', 'pllTop', 'flavaTop'], arac: ['arachnoid'], pia: ['pia'], liq: ['liquor'],
      dent: ['denticulateTop'], cist: ['cistern', 'duraLow'], cocc: ['coccLig'],
    },
    quiz: {
      question: 'Dove termina la cisterna midollare?',
      options: ['Alla metà superiore di L2', 'A livello della seconda vertebra sacrale', 'Al forame magno', 'Sulla faccia dorsale del coccige'],
      correct: 1,
      explain: 'A S2 dura e aracnoide avvolgono il filum e si fondono alla pia: nasce il legamento coccigeo.',
    },
    caption: 'In basso la sezione ingrandita con le meningi; sopra, il tratto reale C1-C4 nel sacco durale.',
    instruction: 'SCEGLI UNA MENINGE, POI SCENDI ALLA CISTERNA',
    view: { yaw: 2.75, focus: FOCUS.meninges },
    mode: selector({
      base: ['section', 'grey', ...RINGS, 'cordTop', ...ROOTS_TOP, ...PLATE_ROOTS, 'sleevesTop', 'duraTop', 'denticulateTop', 'pllTop', 'flavaTop'],
      pick: { duraRing: 0, sleevesTop: 0, epidural: 1, pllTop: 1, flavaTop: 1, arachnoid: 2, liquor: 2, pia: 3, denticulateTop: 3, filum: 4, coccLig: 5 },
      idle: "Dall'esterno: spazio peridurale, dura madre, aracnoide, spazio subaracnoideo, pia madre.",
      options: [
        {
          label: 'Dura madre', lit: ['duraRing', 'duraTop', 'sleevesTop'],
          info: 'Pachimeninge: forma il sacco durale e accompagna le radici fino al forame intervertebrale, dove le meningi lasciano il posto al perinevrio.',
        },
        {
          label: 'Spazio peridurale', lit: ['epidural', 'pllTop', 'flavaTop'],
          info: 'Tra periostio e dura: grasso e plessi vascolari. Davanti il legamento longitudinale posteriore, dietro i legamenti gialli.',
        },
        {
          label: 'Aracnoide', lit: ['arachnoid', 'liquor'],
          info: 'Aderisce alla dura e rende virtuale lo spazio subdurale; le sue trabecole attraversano lo spazio subaracnoideo, pieno di liquor.',
        },
        {
          label: 'Pia e denticolati', lit: ['pia', 'denticulateTop'],
          info: 'La pia aderisce al midollo; i legamenti denticolati attraversano lo spazio subaracnoideo e si fissano alla dura in una serie di arcate.',
        },
        {
          label: 'Cisterna', focus: FOCUS.cistern, show: [...LOW_BONES, 'conus', 'duraLow', 'filum', 'coccLig', ...CAUDA], lit: ['cistern', 'duraLow'],
          info: 'Sotto il cono dura e aracnoide restano attaccate alla colonna: un grande spazio pieno di liquor, attorno a filum e cauda, fino a S2.',
        },
        {
          label: 'Leg. coccigeo', focus: FOCUS.filum, show: [...LOW_BONES, 'conus', 'duraLow', 'filum', 'cistern'], lit: ['coccLig', 'coccyx', 'filum'],
          info: 'Da S2 il filum è avvolto anche da dura e aracnoide: il legamento coccigeo aderisce alla faccia dorsale del coccige.',
        },
      ],
    }),
  },
  {
    title: 'La sostanza grigia: corna e lamine',
    body:
      "La sostanza grigia, centrale e a forma di farfalla, ha per ogni metà un {corno anteriore|ant}, motorio, tozzo e largo, e un {corno posteriore|post}, sensitivo, stretto e lungo; le due metà sono unite dalla commessura grigia, attorno al {canale centrale|canal}. Rexed la scompone in lamine. La {lamina I|l1} è l'apice del corno posteriore; {II e III dorsale|gel} formano la sostanza gelatinosa di Rolando; {III ventrale, IV e V dorsale|prop} il nucleo proprio; {V ventrale e VI|base} la base. {VII e VIII|inter} contengono interneuroni e nucleo di Clarke; la {IX|l9} i motoneuroni; la {X|l10}, impari, contorna il canale.",
    terms: {
      ant: ['antHorn'], post: ['postHorn'], canal: ['canal'], l1: ['lam1'], gel: ['lam2', 'lam3'], prop: ['lam3', 'lam4', 'lam5'], base: ['lam5', 'lam6'],
      inter: ['lam7', 'lam8'], l9: ['lam9'], l10: ['lam10'],
    },
    quiz: {
      question: 'Quale lamina di Rexed contiene i motoneuroni α e γ?',
      options: ['La lamina I', 'La lamina II', 'La lamina VII', 'La lamina IX'],
      correct: 3,
      explain: 'È nella testa del corno ventrale: gli assoni dei motoneuroni formano la radice anteriore.',
    },
    caption: 'Sezione C4-C5 vista da dietro: il contorno del grigio è quello delle mesh reali, le lamine sono ricostruite.',
    instruction: 'SCEGLI UNA LAMINA SULLA SEZIONE',
    view: { yaw: 2.9, focus: FOCUS.grey },
    mode: selector({
      base: ['section', 'grey', ...LAMINAE, ...SEGMENT],
      looks: GLASS,
      pick: { lam1: 0, lam2: 1, lam3: 1, lam4: 2, lam5: 3, lam6: 3, lam7: 4, lam8: 4, lam9: 5, lam10: 6 },
      idle: 'Corno posteriore: lamine I-VI. Zona intermedia e corno anteriore: VII-IX. Attorno al canale: X.',
      options: [
        {
          label: 'I', lit: ['lam1', 'postHorn'],
          info: "Zona marginale, all'apice del corno dorsale: cellule giganti di Waldeyer, da cui nasce circa il 50% del sistema antero-laterale.",
        },
        {
          label: 'II-III', lit: ['lam2', 'lam3'],
          info: 'Sostanza gelatinosa di Rolando: interneuroni che inibiscono i neuroni proiettivi dolorifici rilasciando endorfina.',
        },
        {
          label: 'III-V', lit: ['lam3', 'lam4', 'lam5'],
          info: 'Lamine III ventrale, IV e V dorsale: nucleo proprio del corno dorsale.',
        },
        {
          label: 'V-VI', lit: ['lam5', 'lam6'],
          info: 'Base del corno dorsale: nuclei reticolare spinale e basale laterale.',
        },
        {
          label: 'VII-VIII', lit: ['lam7', 'lam8'],
          info: 'Interneuroni Ia e Ib, cellule di Renshaw, nucleo dorsale di Clarke (T1-L2) e colonna intermedio-laterale, che forma il corno laterale.',
        },
        {
          label: 'IX', lit: ['lam9', 'antHorn', 'antRootTop', 'rootAntP'],
          info: 'Testa del corno ventrale: motoneuroni α e γ. I nuclei mediali innervano la muscolatura assiale, i laterali la parte distale degli arti.',
        },
        {
          label: 'X', lit: ['lam10', 'canal'],
          info: "Impari: commessura grigia e sostanza gelatinosa centrale, attorno al canale centrale dell'ependima.",
        },
      ],
    }),
  },
  {
    title: 'La sostanza bianca: solchi e cordoni',
    body:
      "La sostanza bianca forma il contorno del midollo. Solchi e fessure la dividono in cordoni: il {cordone anteriore|fa} sta tra la {fessura mediana anteriore|fma} e il {solco laterale anteriore|sla}, da cui emergono le radicole della {radice anteriore|ra}; il {cordone laterale|fl} tra i due solchi laterali; il {cordone posteriore|fp} tra il {solco laterale posteriore|slp} e il {solco mediano posteriore|smp}. Il {solco intermedio posteriore|sip} separa il {fascicolo gracile|grac}, mediale, dal {fascicolo cuneato|cun}, che si aggiunge a partire da T6. Nei cordoni salgono i fasci sensitivi e scendono i fasci motori.",
    terms: {
      fa: ['funAnt'], fma: ['fma'], sla: ['sla'], ra: ['antRootTop', 'rootAntP'], fl: ['funLat'], fp: ['funPost'], slp: ['slp'], smp: ['smp'], sip: ['sip'],
      grac: ['gracile'], cun: ['cuneate'],
    },
    quiz: {
      question: 'Tra quali solchi è compreso il cordone laterale?',
      options: [
        'Tra la fessura mediana anteriore e il solco laterale anteriore',
        'Tra il solco laterale anteriore e il solco laterale posteriore',
        'Tra il solco laterale posteriore e il solco mediano posteriore',
        'Tra il solco intermedio posteriore e il solco mediano posteriore',
      ],
      correct: 1,
      explain: 'Dal solco laterale anteriore emergono le radicole anteriori, a quello posteriore giungono le posteriori.',
    },
    caption: 'Le aree colorate sono le sezioni vere delle colonne dei fasci di Z-Anatomy, che salgono nel tratto C1-C4.',
    instruction: 'SCEGLI UN CORDONE O UN GRUPPO DI FASCI',
    view: { yaw: 2.9, focus: FOCUS.white },
    mode: selector({
      base: ['section', 'grey', ...SULCI, ...SEGMENT],
      looks: GLASS,
      pick: { funAnt: 1, funLat: 2, funPost: 3, gracile: 3, cuneate: 3, cba: 6, cbp: 6 },
      idle: 'Le perle segnano i solchi; il grigio al centro, la sostanza bianca tutto attorno.',
      options: [
        {
          label: 'Solchi', stepTime: 2.6,
          steps: [
            { ids: ['fma'], text: "Fessura mediana anteriore: vi decorrono l'arteria e il plesso venoso spinale anteriore" },
            { ids: ['sla', 'antRootTop', 'rootAntP'], text: 'Solco laterale anteriore: emergono le radicole della radice anteriore' },
            { ids: ['slp', 'postRootTop', 'rootPostP'], text: 'Solco laterale posteriore: giungono le radicole della radice posteriore' },
            { ids: ['sip'], text: 'Solco intermedio posteriore: tra fascicolo gracile e fascicolo cuneato' },
            { ids: ['smp'], text: 'Solco mediano posteriore: appena accennato, continua idealmente la fessura anteriore' },
          ],
        },
        {
          label: 'Cord. anteriore', show: ['funAnt'], lit: ['funAnt', 'fma', 'sla'],
          info: 'Tra la fessura mediana anteriore e il solco laterale anteriore.',
        },
        {
          label: 'Cord. laterale', show: ['funLat'], lit: ['funLat', 'sla', 'slp'],
          info: 'Tra il solco laterale anteriore e il solco laterale posteriore.',
        },
        {
          label: 'Cord. posteriore', show: ['funPost', 'gracile', 'cuneate'], lit: ['funPost', 'gracile', 'cuneate', 'slp', 'sip', 'smp'],
          info: 'Fascicolo gracile presso la linea mediana; da T6 gli si accolla, lateralmente, il fascicolo cuneato.',
        },
        {
          label: 'Fasci ascendenti', show: UP_TRACTS, lit: UP_TRACTS,
          info: "Fasci di assoni che salgono dal midollo all'encefalo: sono i fasci sensitivi. Passa sulle aree per leggerne il nome.",
        },
        {
          label: 'Fasci discendenti', show: DOWN_TRACTS, lit: DOWN_TRACTS,
          info: "Fasci di assoni che scendono dall'encefalo al midollo: sono i fasci motori. Passa sulle aree per leggerne il nome.",
        },
        {
          label: 'Commessure', show: ['cba', 'cbp', 'lam10'], lit: ['cba', 'cbp'],
          info: 'La commessura bianca anteriore separa la commessura grigia dal fondo della fessura anteriore; la posteriore, poco evidente, dal solco mediano posteriore.',
        },
      ],
    }),
  },
];

export default {
  id: 'midollo-spinale',
  title: 'Midollo spinale',
  blurb: 'Forma e limiti, meningi, sostanza grigia con le lamine di Rexed, cordoni e fasci della sostanza bianca.',
  part: 'Midollo e nervi spinali',
  order: 10,
  model: 'midollo-spinale',
  createModel: () => new SpinalCord(),
  yaw: 2.55,
  spreads,
};
