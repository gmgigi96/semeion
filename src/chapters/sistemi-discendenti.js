// Capitolo "Sistemi discendenti". Testi dagli appunti di neuroanatomia (Sistemi discendenti).
import { selector } from '../modes.js';
import { DescendingSystems } from '../models/sistemi-discendenti.js';

const SHELL = ['hemi', 'hemiF', 'cerebellum', 'occipital', 'vertebrae'];
// Dalla capsula in giù, senza emisferi: il modello si può ingrandire.
const LOW = ['cerebellum', 'occipital', 'vertebrae'];
// Primo piano dalla sezione ingrandita in su: la faccia inferiore della sezione
// (y = 0.178) resta appoggiata sulla base; ciò che supera la pagina viene tagliato.
const close = (scale) => ({ yaw: 0.25, focus: { at: [0, 0.178, 0], scale, height: 0.05 } });
const STEM = ['midbrain', 'peduncle', 'pons', 'medulla', 'cord'];
const SECTION = ['section', 'grey', 'motoLat', 'motoMed'];
const AREAS = ['precentral', 'area6', 'postcentral'];
const CAPSULE = ['capAnt', 'capGenu', 'capPost'];
const CST_LINKS = ['cst2', 'cst3', 'cst4']; // dalla capsula alla piramide
const FLM = ['flm', 'vsm', 'tetto', 'inter'];
const GROUP_B = ['csl', 'rubro', 'retL'];
const GROUP_A = ['csa', 'retM', 'vestL', ...FLM];
const NUCLEI = ['rosso', 'frPonte', 'frBulbo', 'vestLat', 'vestMed', 'rimlf', 'collSup'];
const SOLID = {
  ...Object.fromEntries(AREAS.map((id) => [id, { litOpacity: 1 }])),
  // i nuclei che delimitano la capsula restano trasparenti, per non coprirla
  ...Object.fromEntries(['thalamus', 'caudate', 'lenticular'].map((id) => [id, { opacity: 0.4 }])),
};

const spreads = [
  {
    title: 'Dalla corteccia alle piramidi',
    body:
      "Tutti i fasci discendenti originano dalla corteccia motoria: il 30% delle fibre nasce dall'{area 4|a4}, il 30% dall'{area 6|a6}, il 40% dalle {aree 3, 1, 2|a312}. Le fibre della {via piramidale|cst} convergono a ventaglio nel centro semiovale e raggiungono la {capsula interna|caps}, che separa il talamo dai nuclei della base. Scendono poi nei 3/5 intermedi del {piede del peduncolo cerebrale|ped}, si sfrangiano in fascicoli nel {ponte|pons} e si ricompattano ventralmente nel bulbo, formando la {piramide bulbare|pyr}.",
    terms: { a4: ['precentral'], a6: ['area6'], a312: ['postcentral'], cst: ['cst', 'corona'], caps: CAPSULE, ped: ['peduncle'], pons: ['pons'], pyr: ['pyramid'] },
    quiz: {
      question: 'In quale parte del piede del peduncolo cerebrale decorre la via piramidale?',
      options: ['Nel quinto mediale', 'Nei 3/5 intermedi', 'Nel quinto laterale', 'Nel tegmento'],
      correct: 1,
      explain: 'Il piede del peduncolo ha una somatotopia medio-laterale.',
    },
    caption: 'Anatomia reale in trasparenza; la via è disegnata per il solo emisfero destro.',
    instruction: 'SEGUI LA VIA DALLA CORTECCIA AL BULBO · TRASCINA PER RUOTARE',
    mode: selector({
      base: [...SHELL, ...STEM, ...AREAS, 'capPost', 'corona', 'cst', 'pyramid', ...SECTION],
      looks: SOLID,
      idle: 'Il fascio cortico-spinale destro, dal giro precentrale alla piramide bulbare.',
      options: [
        {
          label: 'Aree di origine', lit: AREAS,
          labels: { precentral: 'area 4 · 30%', area6: 'area 6 · 30%', postcentral: 'aree 3, 1, 2 · 40%' },
          info: "L'area 4 è l'unica a contenere, nel quinto strato, le cellule giganto-piramidali di Betz.",
        },
        {
          label: 'Segui la via', stepTime: 1.7,
          steps: [
            { ids: ['precentral'], text: 'Corteccia motoria: le fibre partono a ventaglio' },
            { ids: ['corona'], links: ['cst1'], text: 'Centro semiovale: gli assoni si compattano' },
            { ids: ['capPost'], links: ['cst2'], text: 'Capsula interna, tra talamo e nucleo lenticolare' },
            { ids: ['peduncle'], links: ['cst3'], text: 'Piede del peduncolo cerebrale, 3/5 intermedi' },
            { ids: ['pons'], text: 'Ponte: il fascio si sfrangia tra i nuclei basilari' },
            { ids: ['pyramid'], links: ['cst4'], text: 'Bulbo: le fibre si ricompattano nella piramide' },
          ],
        },
        {
          label: 'Capsula interna', lit: [...CAPSULE, 'thalamus', 'caudate', 'lenticular'],
          info: 'Braccio anteriore tra testa del caudato e lenticolare; ginocchio; braccio posteriore tra talamo e lenticolare.',
        },
        {
          label: 'Cortico-nucleare', lit: ['cnu', 'precentral'], links: ['cnu'],
          info: 'Il fascio cortico-nucleare si ferma nel tronco: raggiunge i motoneuroni dei nervi encefalici.',
        },
      ],
    }),
  },
  {
    title: 'Sotto le piramidi: tre fasci',
    body:
      "Al di sotto delle {piramidi bulbari|pyr} la via cortico-spinale si divide in tre fasci. Il 75% delle fibre incrocia nella {decussazione piramidale|dec} e forma il {fascio cortico-spinale laterale|csl}, ad alta unità motoria, che scende nel cordone laterale del lato opposto. Il {10%|csu} non decussa, ma decorre comunque nel cordone laterale, dallo stesso lato. Il restante 15% forma il {fascio cortico-spinale mediale|csa}: scende ipsilateralmente nel cordone anteriore e, alla terminazione, si divide in due rami per i due lati, destinati alla muscolatura assiale.",
    terms: { pyr: ['pyramid'], dec: ['decussation'], csl: ['csl'], csu: ['csu'], csa: ['csa'] },
    quiz: {
      question: 'Quale quota delle fibre cortico-spinali forma il fascio mediale, nel cordone anteriore?',
      options: ['Il 75%', 'Il 10%', 'Il 15%', 'Il 40%'],
      correct: 2,
      explain: 'Non incrocia nella decussazione e si biforca solo alla terminazione.',
    },
    caption: 'Ai piedi del modello, una sezione di midollo cervicale ingrandita mostra dove scende ogni fascio.',
    instruction: 'SCEGLI UN CONTINGENTE E GUARDA DA CHE LATO SCENDE',
    view: close(1.3), // dalla sezione al ponte
    mode: selector({
      base: [...LOW, ...STEM, 'capPost', 'cst', 'pyramid', 'decussation', 'csl', 'csu', 'csa', ...SECTION],
      pick: { csl: 0, csu: 1, csa: 2 },
      idle: 'Dalla piramide destra partono tre contingenti: uno incrocia, due restano dallo stesso lato.',
      options: [
        { label: '75% crociato', lit: ['csl', 'decussation', 'motoLat'], links: ['cst4', 'csl', 'csl-moto'], info: 'Fascio cortico-spinale laterale: incrocia e scende nel cordone laterale opposto, verso la lamina IX laterale.' },
        { label: '10% diretto', lit: ['csu', 'motoLat'], links: ['cst4', 'csu', 'csu-moto'], info: 'Fibre grossolane, a più bassa unità motoria: non decussano ma scendono nel cordone laterale dello stesso lato.' },
        { label: '15% mediale', lit: ['csa', 'motoMed'], links: ['cst4', 'csa', 'csa-motoR', 'csa-motoL'], info: 'Fascio cortico-spinale mediale: cordone anteriore ipsilaterale, poi due rami per i motoneuroni mediali dei due lati.' },
      ],
    }),
  },
  {
    title: 'Sistemi laterali e sistemi mediali',
    body:
      "Kuypers distingue i fasci motori in base al cordone in cui decorrono. I {sistemi laterali|B}, nel cordone laterale, sono molto frazionanti e controllano i {motoneuroni della lamina IX laterale|motoLat}: cortico-spinale laterale, {rubro-spinale|rubro}, che nasce dal {nucleo rosso|rosso} e incrocia subito, e {reticolo-spinale laterale|retL}, dal bulbo. I {sistemi anteromediali|A}, nel cordone anteriore, sono poco frazionanti e agiscono sui {motoneuroni mediali|motoMed}: {reticolo-spinale mediale|retM}, dal ponte, {vestibolo-spinale laterale|vestL}, responsabile del tono antigravitario, e {fascicolo longitudinale mediale|flm}.",
    terms: {
      B: GROUP_B, A: GROUP_A, motoLat: ['motoLat'], motoMed: ['motoMed'], rubro: ['rubro'], rosso: ['rosso'],
      retL: ['retL', 'frBulbo'], retM: ['retM', 'frPonte'], vestL: ['vestL', 'vestLat'], flm: FLM,
    },
    quiz: {
      question: 'In quale cordone decorrono i sistemi del gruppo A, poco frazionanti?',
      options: ['Nel cordone posteriore', 'Nel cordone laterale', 'Nel cordone anteriore', 'Nella sostanza grigia'],
      correct: 2,
      explain: 'Controllano i neuroni a bassa unità motoria della lamina IX mediale.',
    },
    caption: 'I nuclei del tronco sono ricostruiti dentro il tronco reale; ogni fascio parte dal lato destro.',
    instruction: 'SCEGLI UN GRUPPO O UN FASCIO E SEGUILO FINO AL SUO CORDONE',
    view: close(1.2), // dalla sezione al nucleo rosso
    mode: selector({
      base: [...LOW, ...STEM, ...NUCLEI, ...GROUP_B, ...GROUP_A, ...SECTION],
      pick: { rubro: 2, rosso: 2, retL: 3, retM: 3, frPonte: 3, frBulbo: 3, vestL: 4, vestLat: 4, flm: 5, vsm: 5, tetto: 5, inter: 5 },
      idle: 'Sulla sezione ingrandita: i sistemi laterali nel cordone laterale, i mediali nel cordone anteriore.',
      options: [
        { label: 'Laterali (B)', lit: [...GROUP_B, 'rosso', 'frBulbo', 'motoLat'], links: ['csl-moto', 'rubro-moto', 'retL-moto'], info: 'Cordone laterale, molto frazionanti: neuroni ad alta unità motoria della lamina IX laterale.' },
        { label: 'Mediali (A)', lit: [...GROUP_A, 'frPonte', 'vestLat', 'vestMed', 'motoMed'], links: ['retM-moto', 'vestL-moto', 'csa-motoR'], info: 'Cordone anteriore, poco frazionanti: neuroni a bassa unità motoria della lamina IX mediale o intermedia.' },
        { label: 'Rubro-spinale', lit: ['rubro', 'rosso'], links: ['rubro'], info: "Dal nucleo rosso, incrocia subito (decussazione di Forel) e scende davanti al cortico-spinale laterale: nell'adulto non oltrepassa C1." },
        { label: 'Reticolo-spinali', lit: ['retL', 'retM', 'frPonte', 'frBulbo'], links: ['retL', 'retM'], info: 'Laterale, dal bulbo: muscolatura distale degli arti. Mediale, dal ponte: tronco e parte prossimale degli arti.' },
        { label: 'Vestibolo-spinale', lit: ['vestL', 'vestLat', 'motoMed'], links: ['vestL', 'vestL-moto'], info: 'Dal nucleo vestibolare laterale, ipsilaterale nel cordone anteriore per tutto il midollo: tono antigravitario.' },
        { label: 'FLM', lit: [...FLM, 'vestMed', 'collSup', 'rimlf'], links: ['vsm', 'tetto', 'inter'], info: 'Vestibolo-spinale mediale (fino a C4-C5), tetto-spinale e interstizio-spinale: occhi, testa e tronco superiore.' },
      ],
    }),
  },
  {
    title: 'Lesione: paresi e spasticità',
    body:
      "Una lesione della via piramidale non dà solo debolezza. Normalmente la via cortico-spinale invia collaterali al {nucleo f|f}, che inibisce il {nucleo vestibolare laterale|vl}: se la lesione toglie questo freno, il {fascio vestibolo-spinale laterale|vestL} diventa iperattivo e il tono muscolare antigravitario aumenta. È la spasticità, che all'esame neurologico si osserva con il fenomeno del coltello a serramanico. Una lesione monolaterale del {fascio cortico-spinale mediale|csa} dà invece soltanto una paresi, perché questo fascio garantisce un'innervazione bilaterale.",
    terms: { f: ['nucleoF'], vl: ['vestLat'], vestL: ['vestL'], csa: ['csa', 'csaL'] },
    quiz: {
      question: 'Da che cosa dipende la spasticità dopo una lesione della via piramidale?',
      options: ['Dalla perdita dei motoneuroni', "Dall'iperattività del fascio vestibolo-spinale laterale", 'Da una lesione del cervelletto', "Dall'atrofia del fascio rubro-spinale"],
      correct: 1,
      explain: 'Viene meno il freno che il nucleo f esercita sul nucleo vestibolare laterale.',
    },
    caption: 'Il tratto leso si scurisce. Verde: eccitazione; rosso: inibizione; il cono indica attività aumentata.',
    instruction: 'SCEGLI DOVE CADE LA LESIONE',
    view: close(1.3),
    mode: selector({
      base: [...LOW, ...STEM, 'capPost', 'cst', 'pyramid', 'decussation', 'csl', 'csu', 'csa', 'vestL', 'vestLat', 'nucleoF', ...SECTION],
      pick: { capPost: 0, cst: 0, csl: 1, csa: 2 },
      idle: 'Nessuna lesione: la via cortico-spinale, attraverso il nucleo f, frena il nucleo vestibolare laterale.',
      initial: null,
      options: [
        {
          label: 'Capsula interna', dead: ['capPost', 'cst', 'csl', 'csu', 'csa'], links: ['vestL', 'vestL-moto'], activity: { vestLat: 1 },
          focus: close(1).focus, // la capsula sta in alto: senza ingrandimento entra nella pagina
          info: 'Sopra la decussazione: deficit nel lato opposto del corpo. Senza freno, il vestibolo-spinale laterale è iperattivo: spasticità.',
        },
        {
          label: 'Cordone laterale', dead: ['csl'], links: [...CST_LINKS, 'cst-f', 'f-vest'],
          info: 'Sotto la decussazione le fibre hanno già incrociato: il deficit è dallo stesso lato della lesione.',
        },
        {
          label: 'Fascio mediale', dead: ['csa'], show: ['csaL'], links: [...CST_LINKS, 'cst-f', 'f-vest', 'csaL-motoL', 'csaL-motoR'],
          info: "Solo paresi: i motoneuroni mediali ricevono ancora i due rami del fascio dell'altro emisfero.",
        },
      ],
    }),
  },
];

export default {
  id: 'sistemi-discendenti',
  title: 'Sistemi discendenti',
  blurb: 'Dalla corteccia motoria al midollo: via piramidale, decussazione e fasci del tronco.',
  part: 'Vie e tronco encefalico',
  order: 21,
  model: 'sistemi-discendenti',
  createModel: () => new DescendingSystems(),
  yaw: 0,
  spreads,
};
