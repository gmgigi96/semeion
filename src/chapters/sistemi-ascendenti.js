// Capitolo "Sistemi ascendenti". Testi dagli appunti di neuroanatomia (Sistemi ascendenti).
import { selector } from '../modes.js';
import { AscendingSystems } from '../models/sistemi-ascendenti.js';

const LOW = ['cerebellum', 'vertebrae'];
const SHELL = ['hemi', ...LOW];
const STEM = ['midbrain', 'peduncle', 'pons', 'medulla', 'cord'];
const SECTION = ['section', 'grey'];
const HORNS = ['postHorn', 'antHorn'];
const ROOT = ['ganglionR', 'rootR'];
const DC = ['gracileR', 'gracileL', 'cuneateR', 'cuneateL'];
const LM = ['lmC', 'lmG'];
const LAMINAE = ['waldeyer', 'gelatinosa', 'proprius'];
const ALS = ['sttLatL', 'sttAntL'];
const LOOKS = { postcentral: { litOpacity: 1 }, thalamus: { litOpacity: 0.5 } };
// Primi piani: il punto `at` scende fino alla base e ciò che supera la pagina viene tagliato.
// Tutto il modello, con la faccia inferiore della sezione ingrandita (y = 0.066) sulla base.
const whole = (scale) => ({ at: [0, 0.066, 0], scale, height: 0.035 });
// Solo il tronco encefalico, dal bulbo in su.
const stem = (scale) => ({ at: [0, 0.363, 0.03], scale, height: 0.034 });

const spreads = [
  {
    title: 'Tre neuroni per il tatto fine',
    body:
      "La {via dei cordoni posteriori|dc} trasporta la sensibilità epicritica: tattile discriminativa e propriocettiva. Il neurone di primo ordine è la cellula pseudounipolare a T del {ganglio spinale|ggl}: il suo ramo centrale entra nel cordone posteriore e sale senza incrociare. Il {fascicolo gracile|grac} raccoglie arti inferiori e metà inferiore del tronco; da T6 gli si associa il {fascicolo cuneato|cun}, per arti superiori, metà superiore del tronco e regione cervicale. Terminano nel bulbo caudale, nel {nucleo gracile|ng} di Goll e nel {nucleo cuneato|nc} di Burdach. Il terzo neurone è nel {VPL|vpl} del talamo, che proietta all'{area 3, 1, 2|s1}.",
    terms: {
      dc: DC, ggl: ['ganglionR', 'ganglionL'], grac: ['gracileR', 'gracileL'], cun: ['cuneateR', 'cuneateL'],
      ng: ['nGracile'], nc: ['nCuneate'], vpl: ['vpl'], s1: ['postcentral'],
    },
    quiz: {
      question: 'A quale livello al fascicolo gracile si associa il fascicolo cuneato?',
      options: ['C1', 'T6', 'L2', 'S1'],
      correct: 1,
      explain: 'Più in basso la via è formata dal solo fascicolo gracile.',
    },
    caption: 'Anatomia reale in trasparenza, vista da dietro; lo stimolo entra dal ganglio C8 di destra.',
    instruction: 'SEGUI LA VIA DAL GANGLIO ALLA CORTECCIA · TRASCINA PER RUOTARE',
    view: { yaw: 2.5 },
    mode: selector({
      base: [...SHELL, ...STEM, ...SECTION, ...HORNS, ...ROOT, ...DC, 'postcentral', 'thalamus', 'vpl', 'nGracile', 'nCuneate', 'afferent', 'dcC', 'dcG'],
      looks: LOOKS,
      pick: { gracileR: 0, gracileL: 0, nGracile: 0, cuneateR: 1, cuneateL: 1, nCuneate: 1 },
      idle: 'Cordone posteriore: fascicolo gracile (blu) presso la linea mediana, cuneato (verde) più laterale.',
      options: [
        {
          label: 'Gracile', lit: ['gracileR', 'gracileL', 'nGracile', 'dcG'], links: ['dcG'],
          info: 'Arti inferiori e metà inferiore del tronco: sale presso la linea mediana fino al nucleo gracile.',
        },
        {
          label: 'Cuneato', lit: ['cuneateR', 'cuneateL', 'nCuneate', 'dcC', 'afferent', ...ROOT], links: ['dc1', 'dcC', 'p-dc'],
          info: 'Arti superiori, metà superiore del tronco e regione cervicale: fino al nucleo cuneato.',
        },
        {
          label: 'Segui la via', stepTime: 1.8,
          steps: [
            { ids: ['ganglionR', 'afferent'], links: ['dc1'], text: 'Primo neurone: cellula a T del ganglio spinale' },
            { ids: ['cuneateR', 'dcC'], links: ['dcC', 'p-dc'], text: 'Cordone posteriore: il ramo ascendente sale dallo stesso lato' },
            { ids: ['nCuneate'], text: 'Bulbo caudale: nucleo cuneato' },
            { ids: ['arcuate'], links: ['arcC'], text: 'Fibre arciformi interne: incrocio sulla linea mediana' },
            { ids: ['lmC'], links: ['lmC'], text: 'Lemnisco mediale, nel lato opposto del tronco' },
            { ids: ['vpl'], text: 'Talamo: nucleo VPL, neurone di terzo ordine' },
            { ids: ['radiation', 'postcentral'], links: ['tcC'], text: 'Capsula interna e area sensitiva primaria 3, 1, 2' },
          ],
        },
        {
          label: 'Nuclei del bulbo', lit: ['nGracile', 'nCuneate', 'nCuneAcc', 'nucleoZ', 'olive'],
          info: 'Dorsal column nuclei: un ramo va al complesso olivare inferiore (fibre rampicanti), uno forma le fibre arciformi interne.',
        },
        {
          label: 'Post-sinaptico', lit: ['psdc'],
          info: 'Il 30% del cordone posteriore: meccanocettori di visceri e rachide lombare, lungo il contorno e tra gracile e cuneato.',
        },
      ],
    }),
  },
  {
    title: 'Il lemnisco mediale',
    body:
      "Gli assoni dei nuclei gracile e cuneato si portano ventralmente e incrociano sulla linea mediana: sono le {fibre arciformi interne|arc}, che piegano a 90° verso l'alto e formano il {lemnisco mediale|lm}. Nel {bulbo|bulbo} è verticale e paramediano: ventrali le {fibre dal nucleo gracile|lmG}, dorsali quelle {dal cuneato|lmC}. Nel {ponte|pons} si dispone orizzontalmente, tra piede e callotta: mediali i messaggi rostrali, laterali i caudali. Nel {mesencefalo|mid} sale lateralmente e si unisce ai lemnischi spinale e trigeminale nel trigono dei lemnischi. Termina nel {VPL|vpl}, che attraverso il {braccio posteriore della capsula interna|cap} proietta all'{area 3, 1, 2|s1} e all'area 43.",
    terms: {
      arc: ['arcuate'], lm: LM, lmG: ['lmG', 'nGracile'], lmC: ['lmC', 'nCuneate'], bulbo: ['medulla'], pons: ['pons'],
      mid: ['midbrain'], vpl: ['vpl'], cap: ['capPost'], s1: ['postcentral'],
    },
    quiz: {
      question: 'Come sono disposte le fibre del lemnisco mediale nel suo tratto bulbare?',
      options: [
        'Ventrali quelle dal nucleo gracile, dorsali quelle dal cuneato',
        'Mediali quelle dal nucleo gracile, laterali quelle dal cuneato',
        'Dorsali quelle dal nucleo gracile, ventrali quelle dal cuneato',
        'Senza alcun ordine',
      ],
      correct: 0,
      explain: 'Nel ponte il lemnisco diventa orizzontale: mediali i messaggi rostrali, laterali i caudali.',
    },
    caption: 'I due contingenti del lemnisco, dal nucleo gracile (blu) e dal cuneato (verde), salgono a sinistra.',
    instruction: 'SCEGLI UN LIVELLO E GUARDA COME RUOTA IL LEMNISCO',
    view: { yaw: -0.6, focus: stem(1.75) },
    mode: selector({
      base: ['cerebellum', 'midbrain', 'peduncle', 'pons', 'medulla', 'olive', 'thalamus', 'lenticular', 'vpl', 'capPost', 'nGracile', 'nCuneate', 'arcuate', ...LM, 'radiation'],
      looks: LOOKS,
      pick: { arcuate: 0, nGracile: 0, nCuneate: 0, medulla: 1, pons: 2, midbrain: 3, vpl: 4, capPost: 4, postcentral: 4 },
      idle: 'Dai nuclei del bulbo, a destra, al talamo e alla corteccia di sinistra.',
      options: [
        {
          label: 'Decussazione', lit: ['nGracile', 'nCuneate', 'arcuate'], links: ['arcC', 'arcG'],
          info: "Le fibre arciformi interne incrociano nel bulbo, poi piegano a 90° verso l'alto.",
        },
        {
          label: 'Bulbo', lit: [...LM, 'medulla'], links: LM,
          info: 'Verticale e paramediano: ventrali le fibre dal nucleo gracile, dorsali quelle dal cuneato.',
        },
        {
          label: 'Ponte', lit: [...LM, 'pons'], links: LM,
          info: 'Orizzontale, tra piede e callotta: mediali i messaggi rostrali (cuneato), laterali i caudali (gracile).',
        },
        {
          label: 'Mesencefalo', lit: [...LM, 'midbrain'], links: LM,
          info: 'Sale lateralmente e con i lemnischi spinale e trigeminale forma il trigono dei lemnischi.',
        },
        {
          label: 'VPL e corteccia', lit: ['vpl', 'capPost', 'radiation', 'postcentral'], show: ['hemi'], links: ['tcC', 'tcG'],
          focus: stem(1.3), // fino al giro postcentrale
          info: 'Nel VPL il core (esterocettivo) proietta alle aree 3b e 1, lo shell (propriocettivo) a 3a e 2.',
        },
      ],
    }),
  },
  {
    title: 'Il sistema antero-laterale',
    body:
      "Il {sistema antero-laterale|als}, detto anche fascio spino-talamico o lemnisco spinale, trasporta sensibilità termica, dolorifica e tattile grossolana. Origina nel {corno posteriore|ph}: per il 50% dalle {cellule giganti di Waldeyer|wal} della lamina I, poi da {sostanza gelatinosa|gel}, {nucleo proprio|prop} e lamine profonde. Gli assoni passano davanti alla commessura grigia, nella {commessura bianca anteriore|cba}, e salgono nei cordoni anteriore e laterale. Il {tratto neo-spino-talamico|neo} raggiunge il {VPL|vpl}; il {tratto paleo-spino-talamico|paleo}, molto collateralizzato, si ferma nella {formazione reticolare|fr} e nei {nuclei talamici a proiezione diffusa|diff}. Il {fascio spino-tettale|tet} termina nel {collicolo superiore|cs}.",
    terms: {
      als: ALS, ph: ['postHorn'], wal: ['waldeyer'], gel: ['gelatinosa'], prop: ['proprius'], cba: ['cba'], neo: ['neo'], vpl: ['vpl'],
      paleo: ['paleo'], fr: ['reticular'], diff: ['diffuse'], tet: ['spinotect', 'spinotectP'], cs: ['collSup'],
    },
    quiz: {
      question: 'Dove incrociano le fibre del sistema antero-laterale?',
      options: ['Nelle fibre arciformi interne', 'Nella commessura bianca anteriore', 'Nel trigono dei lemnischi', 'Nel braccio posteriore della capsula interna'],
      correct: 1,
      explain: 'Passano davanti alla commessura grigia e salgono nei cordoni anteriore e laterale.',
    },
    caption: 'Sulla sezione ingrandita: lamine di origine, incrocio e posizione del sistema nel lato opposto.',
    instruction: 'SCEGLI UN TRATTO E SEGUILO FINO ALLA SUA TERMINAZIONE',
    view: { yaw: -0.45, focus: whole(1.2) },
    mode: selector({
      base: [...LOW, ...STEM, ...SECTION, ...ROOT, 'postHorn', ...ALS, ...LAMINAE, 'lissauer', 'cba', 'thalamus', 'vpl', 'diffuse', 'reticular', 'pag', 'collSup', 'collInf', 'alsIn', 'neo', 'paleo', 'spinotect', 'spinotectP'],
      looks: LOOKS,
      pick: { neo: 1, vpl: 1, paleo: 2, reticular: 2, diffuse: 2, pag: 2, spinotect: 3, spinotectP: 3, collSup: 3, cba: 0, postHorn: 0 },
      idle: 'Lo stimolo entra da destra: dopo la sinapsi nel corno posteriore, la via sale a sinistra.',
      options: [
        {
          label: 'Origine e incrocio', lit: [...ROOT, 'alsIn', 'postHorn', ...LAMINAE, 'cba', ...ALS], links: ['al1', 'al2', 'p-horn', 'p-cross'],
          info: 'Sinapsi nel corno posteriore; gli assoni incrociano nella commessura bianca anteriore e salgono nel lato opposto.',
        },
        {
          label: 'Neo-spino-talamico', lit: ['neo', 'vpl', 'sttLatL'], links: ['al1', 'al2', 'neoCord', 'neoStem'],
          info: 'Fibre nuove, soprattutto dalle lamine III, IV e V: tatto grossolano e dolore puntiforme, fino al VPL.',
        },
        {
          label: 'Paleo-spino-talamico', lit: ['paleo', 'reticular', 'diffuse', 'pag', 'sttAntL'], links: ['al1', 'al2', 'paleoCord', 'paleoStem', 'paleo-fr1', 'paleo-fr2', 'paleo-pag'],
          info: 'Fibre arcaiche, dalle lamine I, II, VI, VII e VIII: collaterali alla formazione reticolare, poi nuclei a proiezione diffusa.',
        },
        {
          label: 'Spino-tettale', lit: ['spinotect', 'spinotectP', 'collSup'], links: ['tectCord', 'tectStem'],
          info: 'Parte profonda dei cordoni anteriore e laterale, fino al collicolo superiore: riflesso di orientamento.',
        },
        {
          label: 'Spino-cervicale', lit: ['spinocerv', 'nCervLat', 'postHorn'], show: ['lmC'], links: ['al1', 'spinocerv', 'cerv-lm', 'lmC'],
          info: 'Estremo posteriore del cordone laterale, fino al nucleo cervicale laterale (C1-C3), che proietta al VPL con il lemnisco mediale.',
        },
      ],
    }),
  },
  {
    title: 'I fasci spino-cerebellari',
    body:
      "I fasci spino-cerebellari portano informazioni dal midollo al {cervelletto|cer}. Il {fascio spino-cerebellare dorsale|sctD} nasce dal {nucleo dorsale di Clarke|clarke} (C8/T1-L2) e sale ipsilateralmente lungo il perimetro del cordone laterale: attivato da fibre Ia e Ib, trasporta la propriocezione discriminativa dell'arto inferiore. Il {fascio ventrale|sctV} origina dalle {spinal border cells|border}, incrocia nel midollo e incrocia di nuovo verso il cervelletto: fibre II, propriocezione grossolana. Per l'arto superiore i corrispondenti sono il {fascio cuneo-cerebellare|cc}, che collateralizza nel {nucleo cuneato accessorio|nca}, e il {fascio spino-cerebellare rostrale|rost}. Il fascio cervicale nasce dal {nucleo cervicale centrale|ncc} (C1-C3).",
    terms: {
      cer: ['cerebellum'], sctD: ['sctD', 'sctPostR'], clarke: ['clarke'], sctV: ['sctV', 'sctAntL'], border: ['border'],
      cc: ['cuneoc'], nca: ['nCuneAcc'], rost: ['rostral'], ncc: ['nCervCentr'],
    },
    quiz: {
      question: 'Quale fascio spino-cerebellare partecipa a un meccanismo a feed-forward?',
      options: ['Il ventrale', 'Il dorsale', 'Il rostrale', 'Nessuno dei tre'],
      correct: 1,
      explain: 'I neuroni di Clarke sono raggiunti dalla via cortico-spinale e anticipano il movimento.',
    },
    caption: 'Vista da dietro e da destra. Solo il fascio ventrale sale nel lato opposto e incrocia due volte.',
    instruction: 'SCEGLI UN FASCIO E SEGUILO FINO AL CERVELLETTO',
    view: { yaw: 2.35, focus: whole(1.25) },
    mode: selector({
      base: [...LOW, ...STEM, ...SECTION, ...HORNS, ...ROOT, 'scp', 'icp', 'sctPostR', 'sctAntL', 'clarke', 'border', 'nCuneAcc', 'nCervCentr', 'nucleoZ', 'sctD', 'sctV', 'cuneoc', 'rostral'],
      pick: { sctD: 0, sctPostR: 0, clarke: 0, sctV: 1, sctAntL: 1, border: 1, cuneoc: 2, nCuneAcc: 2, rostral: 3, nCervCentr: 4 },
      idle: 'Dal midollo al cervelletto, senza passare per il talamo.',
      options: [
        {
          label: 'Dorsale', lit: ['clarke', 'sctD', 'sctPostR', 'icp', 'nucleoZ'], links: ['p-clarke', 'sctD1', 'sctD2', 'sctD-z'],
          info: 'Da Clarke, ipsilaterale, con un collaterale per il nucleo Z. Clarke riceve la via cortico-spinale: feed-forward.',
        },
        {
          label: 'Ventrale', lit: ['border', 'sctV', 'sctAntL', 'scp'], links: ['p-border', 'sctV1', 'sctV2'],
          info: 'Dalle spinal border cells, crociato due volte. Polisinaptico e più lento: corregge il movimento, a feed-back.',
        },
        {
          label: 'Cuneo-cerebellare', lit: [...ROOT, 'cuneoc', 'nCuneAcc', 'icp'], show: ['cuneateR'], links: ['dc1', 'cc1', 'cc2'],
          info: "Dalle cellule dei gangli spinali, nel fascicolo cuneato: propriocezione discriminativa dell'arto superiore.",
        },
        {
          label: 'Rostrale', lit: ['rostral', 'border', 'icp'], links: ['rost1', 'rost2'],
          info: 'Dalle spinal border cells, davanti al fascio dorsale: propriocezione grossolana di arto superiore, tronco superiore e collo.',
        },
        {
          label: 'Cervicale', lit: ['nCervCentr'],
          info: 'Dal nucleo cervicale centrale, profondamente al fascio dorsale; collateralizza nel nucleo f: propriocezione della regione nucale.',
        },
      ],
    }),
  },
  {
    title: 'Lesione: che cosa si perde, e da che lato',
    body:
      "Le due grandi vie della sensibilità incrociano a livelli diversi. La {via dei cordoni posteriori|touch} sale nel midollo dallo stesso lato da cui entra e incrocia solo nel bulbo, con le {fibre arciformi interne|arc}. Il {sistema antero-laterale|pain} incrocia invece subito, nella {commessura bianca anteriore|cba}, e sale nel cordone del lato opposto. Dal bulbo in su le due vie decorrono dallo stesso lato, ma separate: il {lemnisco mediale|lm} presso la linea mediana, il lemnisco spinale più lateralmente. Si riuniscono nel {VPL|vpl}, prima di raggiungere la {corteccia sensitiva primaria|s1}.",
    terms: {
      touch: ['touchR', 'touchL'], pain: ['painR', 'painL'], arc: ['arcuate'], cba: ['cba'], lm: LM, vpl: ['vpl'], s1: ['postcentral'],
    },
    quiz: {
      predict: true,
      question: 'Emisezione destra del midollo: dove si perde il dolore?',
      options: ['A destra', 'A sinistra', 'Da entrambi i lati', 'Da nessun lato'],
      correct: 1,
      why: [
        'A destra si perde il tatto fine, che sale dallo stesso lato da cui entra.',
        null,
        'Ogni via si perde da un lato solo: tatto fine a destra, dolore a sinistra.',
        'Il cordone destro porta il dolore di sinistra.',
      ],
      explain: 'Le fibre del dolore di sinistra incrociano subito nella commessura bianca anteriore e salgono nel cordone di destra.',
      reveal: 1,
    },
    caption: 'Blu: tatto fine e propriocezione. Rosso: dolore e temperatura. La via interrotta si scurisce.',
    instruction: 'SCEGLI DOVE CADE LA LESIONE',
    view: { yaw: -0.3 },
    mode: selector({
      base: [...SHELL, ...STEM, 'postHorn', 'postcentral', 'thalamus', 'vpl', ...ROOT, 'ganglionL', 'rootL', 'bodyR', 'bodyL', 'touchR', 'touchL', 'painR', 'painL'],
      looks: LOOKS,
      initial: 0,
      idle: 'Quattro vie: tatto fine e dolore, dal lato destro e dal lato sinistro del corpo.',
      options: [
        {
          label: 'Vie integre', links: ['touchR', 'touchL', 'painR', 'painL'],
          labels: { bodyR: 'lato destro', bodyL: 'lato sinistro' },
          info: 'Il tatto fine incrocia nel bulbo, il dolore già nel midollo: ogni emisfero riceve dal lato opposto del corpo.',
        },
        {
          label: 'Emisezione destra', show: ['lesCord'], dead: ['touchR', 'painL'], links: ['touchL', 'painR', 'touchR-cord', 'painL-cord'],
          labels: { bodyR: 'tatto fine perso', bodyL: 'dolore perso' },
          info: 'Sotto la lesione: a destra manca il tatto fine, che non ha ancora incrociato; a sinistra dolore e temperatura.',
        },
        {
          label: 'Lemnisco mediale', show: ['lesPons'], dead: ['touchR'], links: ['touchL', 'painR', 'painL', 'touchR-pons'],
          labels: { bodyR: 'tatto fine perso' },
          info: 'Lesione a sinistra nel ponte: tatto fine perso a destra; il lemnisco spinale, più laterale, è risparmiato.',
        },
        {
          label: 'VPL sinistro', show: ['lesThal'], dead: ['touchR', 'painR'], links: ['touchL', 'painL', 'touchR-thal', 'painR-thal'],
          labels: { bodyR: 'tatto e dolore persi' },
          info: 'Nel talamo le due vie sono riunite: si perde tutta la sensibilità somatica del lato destro.',
        },
      ],
    }),
  },
];

export default {
  id: 'sistemi-ascendenti',
  title: 'Sistemi ascendenti',
  blurb: 'Dal ganglio spinale alla corteccia e al cervelletto: cordoni posteriori, sistema antero-laterale, fasci spino-cerebellari.',
  part: 'Vie e tronco encefalico',
  order: 20,
  model: 'sistemi-ascendenti',
  createModel: () => new AscendingSystems(),
  yaw: 0,
  spreads,
};
