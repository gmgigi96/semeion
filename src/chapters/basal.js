// Capitolo "Nuclei della base". Testi dagli appunti di neuroanatomia (Nuclei della base).
import { selector } from '../modes.js';
import { Brain } from '../brain.js';

const CAUDATE = ['caudHead', 'caudBody', 'caudTail'];
const STRIATUM = [...CAUDATE, 'putamen'];
const NUCLEI = [...STRIATUM, 'gpe', 'gpi', 'stn', 'snc', 'snr'];
const BASE = ['hemi', 'stem', ...NUCLEI, 'thalamus'];
const OUT = ['gpi', 'snr'];
// Per i circuiti: veduta frontale ingrandita, con il putamen a rappresentare lo striato.
const CIRCUIT = ['hemi', 'stem', 'putamen', 'gpe', 'gpi', 'stn', 'snc', 'snr', 'thalamus', 'cortex'];
const FRONTAL = { yaw: 0.3, zoom: 1.3 };

const spreads = [
  {
    title: 'Nuclei alla base degli emisferi',
    body:
      "Il {nucleo caudato|caud}, a forma di C, ha una testa davanti al talamo, un corpo che gli decorre sopra e una coda che termina nel lobo temporale presso l'{amigdala|amy}. Lateralmente si trova il {putamen|put}: insieme formano il {neostriato|neo}. Medialmente al putamen sta il globo pallido, o paleostriato, diviso in {esterno|gpe} e {interno|gpi}. La definizione anatomo-funzionale aggiunge due nuclei della zona di passaggio tra mesencefalo e diencefalo: il {nucleo subtalamico|stn} e la {sostanza nera|sn}.",
    terms: { caud: CAUDATE, amy: ['amygdala'], put: ['putamen'], neo: STRIATUM, gpe: ['gpe'], gpi: ['gpi'], stn: ['stn'], sn: ['snc', 'snr'] },
    quiz: {
      question: 'Quali nuclei formano il neostriato?',
      options: ['Nucleo caudato e putamen', 'Putamen e globo pallido', 'Globo pallido interno ed esterno', 'Nucleo caudato e amigdala'],
      correct: 0,
      explain: 'Il globo pallido è il paleostriato, l’amigdala l’archistriato.',
    },
    caption: 'I nuclei della base dei due lati, con il talamo come riferimento.',
    instruction: 'SCEGLI UN GRUPPO · TRASCINA IL MODELLO PER RUOTARLO',
    mode: selector({
      base: [...BASE, 'amygdala'],
      options: [
        { label: 'Neostriato', lit: STRIATUM, info: 'Nucleo caudato e putamen, uniti dai ponti caudato-putaminali: origine telencefalica.' },
        { label: 'Paleostriato', lit: ['gpe', 'gpi'], info: 'Globo pallido esterno e interno, separati dalla lamina midollare mediale.' },
        { label: 'Subtalamo e mesencefalo', lit: ['stn', 'snc', 'snr'], info: 'Nucleo subtalamico di Luys e sostanza nera (pars compatta e reticolata).' },
      ],
    }),
  },
  {
    title: 'Canali in parallelo',
    body:
      "I nuclei della base lavorano in circuiti paralleli che partono dalla corteccia e vi ritornano passando per il talamo. Il canale motorio entra nel {putamen|put}; l'oculomotorio nel {corpo del caudato|body}; il prefrontale nella {testa del caudato|head}; il limbico nel {nucleus accumbens|acc}. I primi tre escono dal {globo pallido interno|gpi} o dalla {pars reticolata|snr} della sostanza nera e raggiungono il {talamo|thal}, che riproietta alla corteccia. Solo una parte dell'attività riguarda il movimento: il resto regola sguardo, cognizione e gratificazione.",
    terms: { put: ['putamen'], body: ['caudBody'], head: ['caudHead'], acc: ['accumbens'], gpi: ['gpi'], snr: ['snr'], thal: ['thalamus'] },
    quiz: {
      question: 'In quale nucleo entra il canale motorio?',
      options: ['Testa del nucleo caudato', 'Putamen', 'Nucleus accumbens', 'Globo pallido esterno'],
      correct: 1,
      explain: 'Attraverso la via cortico-putaminale, dalle aree 4, 3-1-2 e 6.',
    },
    caption: 'Ogni canale ha una porta di ingresso diversa nello striato.',
    instruction: 'SCEGLI UN CANALE E SEGUI INGRESSO, USCITA E TALAMO',
    mode: selector({
      base: [...BASE, 'accumbens'],
      pick: { putamen: 0, caudBody: 1, caudHead: 2, accumbens: 3 },
      options: [
        { label: 'Motorio', lit: ['putamen', ...OUT, 'thalamus'], info: 'Aree 4, 3-1-2 e 6 › putamen › GPi e pars reticolata › talamo (VA, VL) › aree 4 e 6.' },
        { label: 'Oculomotorio', lit: ['caudBody', ...OUT, 'thalamus'], info: 'Cortecce parietale posteriore e prefrontale › corpo del caudato › GPi e pars reticolata › talamo (VA, MD) › campi oculari frontali.' },
        { label: 'Prefrontale', lit: ['caudHead', ...OUT, 'thalamus'], info: 'Cortecce parietale posteriore e prefrontale › testa del caudato › GPi e pars reticolata › talamo (VA, MD) › corteccia prefrontale.' },
        { label: 'Limbico', lit: ['accumbens', 'thalamus'], info: 'Allocortecce limbiche › accumbens e tubercolo olfattivo › sostanza innominata › talamo (MD) › corteccia orbitofrontale e giro del cingolo.' },
      ],
    }),
  },
  {
    title: 'Via diretta, indiretta, iperdiretta',
    body:
      "L'impulso della corteccia entra nel neostriato e si divide. Nella {via diretta|direct}, lo striato inibisce {globo pallido interno|gpi} e {pars reticolata|snr}: il {talamo|thal}, liberato dal loro freno, attiva la corteccia e il movimento è facilitato. Nella {via indiretta|indirect}, lo striato inibisce il {globo pallido esterno|gpe}; viene meno il suo controllo su GPi e pars reticolata, che frenano di più il talamo. Nella {via iperdiretta|hyper}, la corteccia eccita direttamente il {nucleo subtalamico|stn}, che attiva GPi e pars reticolata. Le vie lavorano sempre insieme: conta quale prevale.",
    terms: {
      direct: ['putamen', ...OUT, 'thalamus'], indirect: ['putamen', 'gpe', ...OUT, 'thalamus'], hyper: ['cortex', 'stn', ...OUT, 'thalamus'],
      gpi: ['gpi'], snr: ['snr'], thal: ['thalamus'], gpe: ['gpe'], stn: ['stn'],
    },
    quiz: {
      question: "Qual è l'effetto netto della via diretta sul talamo?",
      options: ['Lo inibisce: il movimento è frenato', 'Lo libera dal freno: il movimento è facilitato', 'Nessuno: agisce solo sul tronco', 'Lo eccita attraverso il nucleo subtalamico'],
      correct: 1,
      explain: 'Inibire un inibitore (GPi e pars reticolata) equivale a disinibire.',
    },
    caption: 'Veduta frontale. Verde: via eccitatoria; rosso: inibitoria. I coni indicano attività aumentata o ridotta.',
    instruction: 'SCEGLI UNA VIA E SEGUI I PASSAGGI UNO A UNO',
    view: FRONTAL,
    mode: selector({
      base: CIRCUIT,
      options: [
        {
          label: 'Diretta', stepTime: 1.6,
          steps: [
            { ids: ['cortex', 'putamen'], links: ['ctx-str'], activity: { putamen: 1 }, text: 'La corteccia eccita lo striato (striosomi)' },
            { ids: OUT, links: ['str-gpi'], activity: { gpi: -1, snr: -1 }, text: 'Lo striato inibisce GPi e pars reticolata' },
            { ids: ['thalamus'], links: ['gpi-thal'], activity: { thalamus: 1 }, text: 'Il talamo perde il freno e si attiva' },
            { ids: ['cortex'], links: ['thal-ctx'], activity: { cortex: 1 }, text: 'Il talamo eccita la corteccia: movimento facilitato' },
          ],
        },
        {
          label: 'Indiretta', stepTime: 1.6,
          steps: [
            { ids: ['cortex', 'putamen'], links: ['ctx-str'], activity: { putamen: 1 }, text: 'La corteccia eccita lo striato (matrice)' },
            { ids: ['gpe'], links: ['str-gpe'], activity: { gpe: -1 }, text: 'Lo striato inibisce il globo pallido esterno' },
            { ids: [...OUT, 'stn'], links: ['gpe-gpi', 'gpe-stn', 'stn-gpi'], activity: { gpi: 1, snr: 1, stn: 1 }, text: 'Senza il freno del GPe, GPi e pars reticolata si attivano' },
            { ids: ['thalamus'], links: ['gpi-thal'], activity: { thalamus: -1 }, text: 'Il talamo è frenato di più: movimento inibito' },
          ],
        },
        {
          label: 'Iperdiretta', stepTime: 1.6,
          steps: [
            { ids: ['cortex', 'stn'], links: ['ctx-stn'], activity: { stn: 1 }, text: 'La corteccia eccita direttamente il nucleo subtalamico' },
            { ids: OUT, links: ['stn-gpi'], activity: { gpi: 1, snr: 1 }, text: 'Il nucleo subtalamico eccita GPi e pars reticolata' },
            { ids: ['thalamus'], links: ['gpi-thal'], activity: { thalamus: -1 }, text: 'Il talamo viene inibito' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Quando un nucleo si ammala',
    body:
      "Il 95% delle sindromi extrapiramidali ha sede nei nuclei della base. Nella malattia di Parkinson muoiono i neuroni dopaminergici della {pars compatta|snc} della sostanza nera: si perde la via nigro-striatale, le vie indiretta e iperdiretta diventano iperattive e il {nucleo subtalamico|stn} spinge {GPi e pars reticolata|out} a frenare troppo. Ne derivano rigidità, bradicinesia e acinesia. Nella malattia di Huntington degenerano invece i neuroni dello {striato|neo}, con ipotonia e movimenti coreici involontari.",
    terms: { snc: ['snc'], stn: ['stn'], out: OUT, neo: STRIATUM },
    quiz: {
      question: 'Quale struttura degenera nella malattia di Parkinson?',
      options: ['Il nucleo subtalamico', 'La pars compatta della sostanza nera', 'Il globo pallido esterno', 'Il putamen'],
      correct: 1,
      explain: 'Sono i suoi neuroni dopaminergici a dare origine alla via nigro-striatale.',
    },
    caption: 'Il nucleo colpito si spegne; i coni mostrano come cambia l’attività degli altri.',
    instruction: 'SCEGLI UNA MALATTIA (O CLICCA IL NUCLEO COLPITO)',
    view: FRONTAL,
    mode: selector({
      base: CIRCUIT,
      pick: { snc: 0, putamen: 1, caudHead: 1, caudBody: 1, caudTail: 1 },
      idle: 'Nessuna lesione: le vie diretta, indiretta e iperdiretta sono in equilibrio.',
      options: [
        {
          label: 'Parkinson', dead: ['snc'], links: ['ctx-stn', 'stn-gpi', 'gpi-thal'],
          activity: { stn: 1, gpi: 1, snr: 1, thalamus: -1 },
          info: 'Muore la pars compatta: nucleo subtalamico, GPi e pars reticolata iperattivi, talamo frenato. Ipertonia (rigidità), bradicinesia, acinesia.',
        },
        {
          label: 'Huntington', dead: STRIATUM, show: CAUDATE, links: ['gpe-gpi', 'gpi-thal'],
          activity: { gpe: 1, gpi: -1, snr: -1, thalamus: 1 },
          info: 'Degenerano i neuroni dello striato: il talamo perde il freno. Ipotonia e movimenti coreici involontari.',
        },
      ],
    }),
  },
];

export default {
  id: 'nuclei-della-base',
  title: 'Nuclei della base',
  blurb: 'Striato, pallido, subtalamo e sostanza nera: i circuiti che regolano il movimento.',
  part: 'Encefalo',
  order: 32,
  model: 'brain',
  createModel: () => new Brain(),
  zoom: 1.1,
  yaw: -0.55,
  spreads,
};
