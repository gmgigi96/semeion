// Capitolo "Cervelletto". Testi dagli appunti di neuroanatomia (Cervelletto).
import { selector } from '../modes.js';
import { Cerebellum } from '../cerebellum.js';

const ANT = ['antVermis', 'antHemi'];
const POST = ['postVermis', 'pyramis', 'uvula', 'postHemi'];
const FN = ['nodulus', 'flocculus'];
const CORTEX = ['lingula', ...ANT, ...POST, ...FN, 'medullary'];
const STEM = ['midbrain', 'pons', 'medulla'];
const PEDUNCLES = ['scp', 'mcp', 'icp'];
const NUCLEI = ['fastigial', 'interposed', 'dentate'];
const BASE = [...CORTEX, ...STEM, ...PEDUNCLES];
// corteccia in trasparenza, per vedere nuclei profondi e tronco
const GLASS = Object.fromEntries(CORTEX.map((id) => [id, { opacity: 0.16, litOpacity: 0.5 }]));

const spreads = [
  {
    title: 'Verme, emisferi e tre peduncoli',
    body:
      "Il cervelletto occupa la fossa cranica posteriore, dietro il tronco encefalico e sotto il tentorio. Il corpus cerebelli è formato dal {verme|vermis}, mediano, e dai due {emisferi|hemi}; la fessura primaria separa il {lobo anteriore|ant} dal {lobo posteriore|post}. In basso e in avanti il {lobo flocculo-nodulare|fn} riunisce nodulo e flocculi. Dall'ilo nascono tre paia di peduncoli: il {superiore|scp} sale al mesencefalo, il {medio|mcp} raggiunge il ponte, l'{inferiore|icp} scende al bulbo.",
    terms: {
      vermis: ['lingula', 'antVermis', 'postVermis', 'pyramis', 'uvula', 'nodulus'], hemi: ['antHemi', 'postHemi'],
      ant: ANT, post: POST, fn: FN, scp: ['scp'], mcp: ['mcp'], icp: ['icp'],
    },
    quiz: {
      question: 'Quale peduncolo collega il cervelletto al ponte?',
      options: ['Il superiore', 'Il medio', "L'inferiore", 'Nessuno: passa dal mesencefalo'],
      correct: 1,
      explain: 'Il superiore sale al mesencefalo, l’inferiore scende al bulbo.',
    },
    caption: 'Cervelletto e tronco encefalico visti da dietro e di lato.',
    instruction: 'SCEGLI UN LOBO O I PEDUNCOLI · TRASCINA PER RUOTARE',
    mode: selector({
      base: BASE,
      options: [
        { label: 'Lobo anteriore', lit: ['lingula', ...ANT], info: 'Davanti alla fessura primaria, sul terzo anteriore della faccia superiore.' },
        { label: 'Lobo posteriore', lit: POST, info: 'Dietro la fessura primaria: continua sulla faccia inferiore fino alla fessura postero-laterale.' },
        { label: 'Flocculo-nodulare', lit: FN, info: 'Nodulo sulla linea mediana, flocculi ai lati: la parte più antica (archicerebello).' },
        { label: 'Peduncoli', lit: PEDUNCLES, info: 'Superiore al mesencefalo, medio al ponte, inferiore (corpo restiforme) al bulbo.' },
      ],
    }),
  },
  {
    title: 'Tre cervelletti in uno',
    body:
      "Dal punto di vista funzionale si distinguono tre cervelletti. Il {vestibolo-cerebello|vest}, con lobo flocculo-nodulare, uvula e lingula, controlla equilibrio e movimenti oculari attraverso i {nuclei vestibolari|vn}. Lo {spino-cerebello|spino}, con verme ed emisfero del lobo anteriore e la piramide, confronta il movimento in corso con le afferenze propriocettive e lo corregge. Il {ponto-cerebello|ponto}, con la parte centrale del verme e gli emisferi del lobo posteriore, connesso ai {nuclei basilari del ponte|pn}, pianifica le sequenze del movimento. Il controllo sulla muscolatura è omolaterale.",
    terms: {
      vest: [...FN, 'uvula', 'lingula'], vn: ['vestibular'], spino: [...ANT, 'pyramis'],
      ponto: ['postVermis', 'postHemi'], pn: ['pontine'],
    },
    quiz: {
      question: 'Quale porzione è indispensabile per pianificare il movimento (motor planning)?',
      options: ['Il vestibolo-cerebello', 'Lo spino-cerebello', 'Il ponto-cerebello', 'Il lobo flocculo-nodulare'],
      correct: 2,
      explain: 'Ha anche funzioni cognitive: le sue lesioni rallentano ragionamento e attenzione.',
    },
    caption: 'La stessa corteccia, divisa secondo ciò che fa.',
    instruction: 'SCEGLI UNA PORZIONE FUNZIONALE',
    mode: selector({
      base: BASE,
      options: [
        { label: 'Vestibolo-cerebello', lit: [...FN, 'uvula', 'lingula'], show: ['vestibular'], info: 'Equilibrio e oculomozione: riceve dai canali semicircolari e controlla il nucleo vestibolare superiore.' },
        { label: 'Spino-cerebello', lit: [...ANT, 'pyramis'], info: 'Tono, postura e correzione del movimento in corso. Verme: sistemi mediali; emisfero: sistemi laterali.' },
        { label: 'Ponto-cerebello', lit: ['postVermis', 'postHemi'], show: ['pontine'], info: 'Pianifica il movimento in sequenza e partecipa a ragionamento, attenzione e memoria esecutiva.' },
      ],
    }),
  },
  {
    title: 'I nuclei profondi, porte di uscita',
    body:
      "Nel corpo midollare stanno i nuclei profondi, attraverso cui la corteccia cerebellare raggiunge il resto del sistema nervoso. Il {nucleo del fastigio|fast}, controllato dal verme del lobo anteriore, proietta ai {nuclei vestibolari|vn} e alla formazione reticolare: sistemi mediali. Il {nucleo interposito|inter}, controllato dall'emisfero del lobo anteriore, raggiunge il {nucleo rosso|red} controlaterale: sistemi laterali. Il {nucleo dentato|dent}, il più laterale, connesso al ponto-cerebello, proietta al {talamo|thal} e da lì alla corteccia premotoria e associativa, passando dal {peduncolo superiore|scp}.",
    terms: {
      fast: ['fastigial'], vn: ['vestibular'], inter: ['interposed'], red: ['red'],
      dent: ['dentate'], thal: ['thalamus'], scp: ['scp'],
    },
    quiz: {
      question: 'Quale nucleo profondo è connesso al ponto-cerebello?',
      options: ['Il nucleo del fastigio', 'Il nucleo interposito', 'Il nucleo dentato', 'Il nucleo rosso'],
      correct: 2,
      explain: "È detto anche oliva cerebellare, per la somiglianza con l'oliva bulbare.",
    },
    caption: 'Corteccia in trasparenza: in senso medio-laterale fastigio, interposito, dentato.',
    instruction: 'SCEGLI UN NUCLEO: CHI LO CONTROLLA E DOVE PROIETTA',
    mode: selector({
      base: [...BASE, ...NUCLEI, 'vestibular', 'red', 'thalamus'],
      looks: GLASS,
      pick: { fastigial: 0, interposed: 1, dentate: 2 },
      options: [
        { label: 'Fastigio', lit: ['antVermis', 'fastigial', 'vestibular'], links: ['fast-vest'], info: 'Verme del lobo anteriore › fastigio › nuclei vestibolari e formazione reticolare: muscolatura assiale, postura.' },
        { label: 'Interposito', lit: ['antHemi', 'interposed', 'red', 'scp'], links: ['inter-red'], info: 'Emisfero del lobo anteriore › interposito › nucleo rosso controlaterale: parte distale degli arti.' },
        { label: 'Dentato', lit: ['postHemi', 'dentate', 'thalamus', 'scp'], links: ['dent-thal'], info: 'Ponto-cerebello › dentato › talamo ventrale laterale › corteccia premotoria e associativa.' },
      ],
    }),
  },
  {
    title: 'Muscoidi e rampicanti: il ritmo del modulo',
    body:
      "Al cervelletto arrivano due tipi di fibre. Le {fibre muscoidi|mossy}, per esempio dai nuclei basilari del ponte attraverso il {peduncolo medio|mcp}, eccitano i granuli e, con le fibre parallele, moltissime cellule di Purkinje. Le {fibre rampicanti|climb} nascono dal {complesso olivare inferiore|olive}, si incrociano ed entrano dal {peduncolo inferiore|icp}: eccitano direttamente il {nucleo profondo|nuc} e poche cellule di Purkinje. Le Purkinje inibiscono il nucleo, e il nucleo spegne l'oliva. Nasce così un ciclo di 4-7 impulsi al secondo; se si rompe compare l'adiadococinesia.",
    terms: { mossy: ['pontine', 'mcp'], mcp: ['mcp'], climb: ['olive', 'icp'], olive: ['olive'], icp: ['icp'], nuc: ['dentate'] },
    quiz: {
      question: 'Da dove originano le fibre rampicanti?',
      options: ['Dai nuclei basilari del ponte', 'Dal complesso olivare inferiore', 'Dal nucleo rosso', 'Dai nuclei vestibolari'],
      correct: 1,
      explain: 'Raggiungono il cervelletto opposto attraverso il peduncolo cerebellare inferiore.',
    },
    caption: 'Verde: fibra muscoide. Arancio: fibra rampicante. Rosso: inibizione.',
    instruction: 'SCEGLI UNA FIBRA E SEGUI IL CIRCUITO PASSO A PASSO',
    mode: selector({
      base: [...BASE, 'dentate', 'pontine', 'olive'],
      looks: GLASS,
      options: [
        {
          label: 'Fibra muscoide', stepTime: 1.6,
          steps: [
            { ids: ['pontine'], text: 'Nuclei basilari del ponte (lato opposto)' },
            { ids: ['mcp'], links: ['mossy'], text: 'Peduncolo cerebellare medio' },
            { ids: ['postHemi'], text: 'Granuli, fibre parallele, cellule di Purkinje: spike semplice' },
            { ids: ['dentate'], links: ['purkinje'], activity: { dentate: -1 }, text: 'Le cellule di Purkinje inibiscono il nucleo profondo' },
          ],
        },
        {
          label: 'Fibra rampicante', stepTime: 1.6,
          steps: [
            { ids: ['olive'], text: 'Complesso olivare inferiore (lato opposto)' },
            { ids: ['icp'], links: ['climb'], text: 'Incrocio e peduncolo cerebellare inferiore' },
            { ids: ['dentate', 'postHemi'], links: ['climb-nuc'], activity: { dentate: 1 }, text: 'Eccita il nucleo profondo e le Purkinje: spike complesso' },
            { ids: ['dentate'], links: ['purkinje'], activity: { dentate: -1 }, text: 'Le Purkinje inibiscono il nucleo profondo' },
            { ids: ['olive'], links: ['nuc-olive'], activity: { olive: -1 }, text: "La via nucleo-olivare spegne l'oliva: il ciclo ricomincia" },
          ],
        },
      ],
    }),
  },
];

export default {
  id: 'cervelletto',
  title: 'Cervelletto',
  blurb: 'Lobi e peduncoli, i tre cervelletti funzionali, nuclei profondi, fibre muscoidi e rampicanti.',
  part: 'Encefalo',
  order: 34,
  model: 'cerebellum',
  createModel: () => new Cerebellum(),
  yaw: 2.45,
  spreads,
};
