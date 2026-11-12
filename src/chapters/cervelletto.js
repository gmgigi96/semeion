// Capitolo "Cervelletto". Testi dagli appunti di neuroanatomia (Cervelletto).
import { selector } from '../modes.js';
import { Cervelletto } from '../models/cervelletto.js';

// Lobuli reali (Z-Anatomy), raggruppati in lobi e in porzioni funzionali.
const ANT_VERMIS = ['central', 'culmen'];
const ANT_HEMI = ['wing', 'quadAnt'];
const MID_VERMIS = ['declive', 'folium', 'tuber']; // parte centrale del verme
const POST_HEMI = ['quadPost', 'semiSup', 'semiInf', 'gracile', 'biventer', 'tonsil'];
const FN = ['nodulus', 'flocculus', 'floccPed'];
const ANT = ['lingula', ...ANT_VERMIS, ...ANT_HEMI];
const POST = [...MID_VERMIS, 'pyramis', 'uvula', ...POST_HEMI];
const VERMIS = ['lingula', ...ANT_VERMIS, ...MID_VERMIS, 'pyramis', 'uvula', 'nodulus'];
const CORTEX = [...ANT, ...POST, ...FN];
const VEST = [...FN, 'uvula', 'lingula'];
const SPINO = [...ANT_VERMIS, ...ANT_HEMI, 'pyramis'];
const PONTO = [...MID_VERMIS, ...POST_HEMI];

const STEM = ['midbrain', 'pons', 'medulla'];
const PEDUNCLES = ['scp', 'mcp', 'icp'];
const NUCLEI = ['fastigial', 'interposed', 'dentate'];
const BASE = [...CORTEX, ...STEM, ...PEDUNCLES];
const of = (ids, look) => Object.fromEntries(ids.map((id) => [id, look]));
// corteccia in trasparenza, per vedere nuclei profondi e peduncoli
const GLASS = of(CORTEX, { opacity: 0.1, litOpacity: 0.22 });
const CLEAR_STEM = of(STEM, { opacity: 0.3 });

// Come `selector`, ma quando l'opzione scelta accende una delle parti `probes`
// (strutture profonde) il resto della corteccia diventa trasparente.
const deep = (cfg, probes) => async (ctx) => {
  const handler = await selector(cfg)(ctx);
  const enter = handler.enter;
  handler.enter = () => {
    enter();
    const look = ctx.model.lookFn;
    ctx.model.lookFn = (part) => {
      const l = look(part);
      if (!l.dim || !CORTEX.includes(part.id)) return l;
      return probes.some((id) => look(ctx.model.parts.get(id)).glow) ? { ...l, opacity: 0.1 } : l;
    };
  };
  return handler;
};

// Quinta doppia pagina: il cervelletto si rimpicciolisce sopra il blocco di corteccia.
const LAYERS = ['layerMol', 'layerPurk', 'layerGran', 'layerWhite'];
const MICRO = [...LAYERS, 'purk', 'granule', 'parallel', 'mossyEnd', 'golgi', 'climbEnd', 'basket', 'stellate', 'microNuc', 'sample'];
const block = (cfg) => async (ctx) => {
  const handler = await selector(cfg)(ctx);
  const enter = handler.enter;
  handler.enter = () => {
    enter();
    ctx.model.setLayout(1);
  };
  return handler;
};

const spreads = [
  {
    title: 'Verme, emisferi e tre peduncoli',
    body:
      "Il cervelletto occupa la fossa cranica posteriore, dietro il tronco encefalico e sotto il tentorio. Il corpus cerebelli è formato dal {verme|vermis}, mediano, e dai due {emisferi|hemi}; la {fessura primaria|primary} separa il {lobo anteriore|ant} dal {lobo posteriore|post}. In basso e in avanti il {lobo flocculo-nodulare|fn} riunisce nodulo e flocculi. Dall'ilo nascono tre paia di peduncoli: il {superiore|scp} sale al mesencefalo, il {medio|mcp} raggiunge il ponte, l'{inferiore|icp} scende al bulbo.",
    terms: {
      vermis: VERMIS, hemi: [...ANT_HEMI, ...POST_HEMI], primary: ['primary'],
      ant: ANT, post: POST, fn: FN, scp: ['scp'], mcp: ['mcp'], icp: ['icp'],
    },
    quiz: {
      question: 'Quale peduncolo collega il cervelletto al ponte?',
      options: ['Il superiore', 'Il medio', "L'inferiore", 'Nessuno: passa dal mesencefalo'],
      correct: 1,
      explain: 'Il superiore sale al mesencefalo, l’inferiore scende al bulbo.',
    },
    caption: 'Cervelletto e tronco encefalico reali, visti da dietro e di lato: ogni lobulo è un pezzo.',
    instruction: 'SCEGLI UN LOBO O I PEDUNCOLI · TRASCINA PER RUOTARE',
    mode: deep({
      base: [...BASE, 'primary'],
      options: [
        { label: 'Lobo anteriore', lit: [...ANT, 'primary'], info: 'Davanti alla fessura primaria, sul terzo anteriore della faccia superiore.' },
        { label: 'Lobo posteriore', lit: [...POST, 'primary'], info: 'Dietro la fessura primaria: continua sulla faccia inferiore fino alla fessura postero-laterale.' },
        { label: 'Flocculo-nodulare', lit: FN, info: 'Nodulo sulla linea mediana, flocculi ai lati: la parte più antica (archicerebello).' },
        { label: 'Verme', lit: VERMIS, info: 'Rilievo mediano, separato dagli emisferi dalle docce paravermiane.' },
        {
          label: 'Peduncoli', lit: PEDUNCLES, labels: { scp: 'superiore', mcp: 'medio', icp: 'inferiore' },
          info: 'Superiore al mesencefalo, medio al ponte, inferiore (corpo restiforme) al bulbo.',
        },
      ],
    }, ['mcp', 'flocculus']),
  },
  {
    title: 'Tre cervelletti in uno',
    body:
      "Dal punto di vista funzionale si distinguono tre cervelletti. Il {vestibolo-cerebello|vest}, con lobo flocculo-nodulare, uvula e lingula, controlla equilibrio e movimenti oculari attraverso i {nuclei vestibolari|vn}. Lo {spino-cerebello|spino}, con verme ed emisfero del lobo anteriore e la piramide, confronta il movimento in corso con le afferenze propriocettive e lo corregge. Il {ponto-cerebello|ponto}, con la parte centrale del verme e gli emisferi del lobo posteriore, connesso ai {nuclei basilari del ponte|pn}, pianifica le sequenze del movimento. Il controllo sulla muscolatura è omolaterale.",
    terms: { vest: VEST, vn: ['vestibular'], spino: SPINO, ponto: PONTO, pn: ['pontine'] },
    quiz: {
      question: 'Quale porzione è indispensabile per pianificare il movimento (motor planning)?',
      options: ['Il vestibolo-cerebello', 'Lo spino-cerebello', 'Il ponto-cerebello', 'Il lobo flocculo-nodulare'],
      correct: 2,
      explain: 'Ha anche funzioni cognitive: le sue lesioni rallentano ragionamento e attenzione.',
    },
    caption: 'Gli stessi lobuli, colorati secondo ciò che fanno: verde, rosso, azzurro.',
    instruction: 'SCEGLI UNA PORZIONE FUNZIONALE',
    view: { yaw: 2.2 },
    mode: deep({
      base: BASE,
      looks: {
        ...of(VEST, { color: 0x6fa84a }), ...of(SPINO, { color: 0xc9603f }), ...of(PONTO, { color: 0x6f9bd6 }),
        ...of(STEM, { opacity: 0.45 }),
      },
      options: [
        { label: 'Vestibolo-cerebello', lit: VEST, show: ['vestibular'], info: 'Equilibrio e oculomozione: riceve dai canali semicircolari e controlla il nucleo vestibolare superiore.' },
        { label: 'Spino-cerebello', lit: SPINO, info: 'Tono, postura e correzione del movimento in corso. Verme: sistemi mediali; emisfero: sistemi laterali.' },
        { label: 'Ponto-cerebello', lit: PONTO, show: ['pontine'], info: 'Pianifica il movimento in sequenza e partecipa a ragionamento, attenzione e memoria esecutiva.' },
      ],
    }, ['nodulus']),
  },
  {
    title: 'I nuclei profondi, porte di uscita',
    body:
      "Nel {corpo midollare|med} stanno i nuclei profondi, attraverso cui la corteccia cerebellare raggiunge il resto del sistema nervoso. Il {nucleo del fastigio|fast}, controllato dal verme del lobo anteriore, proietta ai {nuclei vestibolari|vn} e alla {formazione reticolare|ret}: sistemi mediali. Il {nucleo interposito|inter}, controllato dall'emisfero del lobo anteriore, raggiunge il {nucleo rosso|red} controlaterale: sistemi laterali. Il {nucleo dentato|dent}, il più laterale, connesso al ponto-cerebello, proietta al {talamo|thal} e da lì alla corteccia premotoria e associativa, passando dal {peduncolo superiore|scp}.",
    terms: {
      med: ['medullary'], fast: ['fastigial'], vn: ['vestibular'], ret: ['reticular'], inter: ['interposed'], red: ['red'],
      dent: ['dentate'], thal: ['vl'], scp: ['scp'],
    },
    quiz: {
      question: 'Quale nucleo profondo è connesso al ponto-cerebello?',
      options: ['Il nucleo del fastigio', 'Il nucleo interposito', 'Il nucleo dentato', 'Il nucleo rosso'],
      correct: 2,
      explain: "È detto anche oliva cerebellare, per la somiglianza con l'oliva bulbare.",
    },
    caption: 'Corteccia in trasparenza: in senso medio-laterale fastigio, interposito, dentato.',
    instruction: 'SCEGLI UN NUCLEO: CHI LO CONTROLLA E DOVE PROIETTA',
    view: { yaw: 2.75, zoom: 1.08 },
    mode: selector({
      base: [...BASE, ...NUCLEI, 'medullary', 'vestibular', 'reticular', 'red', 'thalamus', 'vl'],
      looks: { ...GLASS, ...CLEAR_STEM, thalamus: { opacity: 0.3 } },
      labels: { fastigial: 'fastigio', interposed: 'interposito', dentate: 'dentato' },
      pick: { fastigial: 0, interposed: 1, dentate: 2 },
      options: [
        {
          label: 'Fastigio', lit: [...ANT_VERMIS, 'fastigial', 'vestibular', 'reticular'], links: ['fast-vest', 'fast-ret'],
          focus: { at: 'fastigial', scale: 2.2 },
          info: 'Verme del lobo anteriore › fastigio › nuclei vestibolari e formazione reticolare: muscolatura assiale, postura.',
        },
        {
          label: 'Interposito', lit: [...ANT_HEMI, 'interposed', 'red', 'scp'], links: ['inter-red'],
          info: 'Emisfero del lobo anteriore › interposito › nucleo rosso controlaterale: parte distale degli arti.',
        },
        {
          label: 'Dentato', lit: [...PONTO, 'dentate', 'vl', 'scp'], links: ['dent-thal'],
          info: 'Ponto-cerebello › dentato › talamo ventrale laterale controlaterale › corteccia premotoria e associativa.',
        },
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
    view: { yaw: 2.75, zoom: 1.2 },
    mode: selector({
      base: [...BASE, 'dentate', 'medullary', 'pontine', 'olive'],
      looks: { ...GLASS, ...CLEAR_STEM },
      options: [
        {
          label: 'Fibra muscoide', stepTime: 1.6,
          steps: [
            { ids: ['pontine'], text: 'Nuclei basilari del ponte (lato opposto)' },
            { ids: ['mcp'], links: ['mossy'], text: 'Incrocio nel ponte e peduncolo cerebellare medio' },
            { ids: ['semiSup'], text: 'Granuli, fibre parallele, cellule di Purkinje: spike semplice' },
            { ids: ['dentate'], links: ['purkinje'], activity: { dentate: -1 }, text: 'Le cellule di Purkinje inibiscono il nucleo profondo' },
          ],
        },
        {
          label: 'Fibra rampicante', stepTime: 1.6,
          steps: [
            { ids: ['olive'], text: 'Complesso olivare inferiore (lato opposto)' },
            { ids: ['icp'], links: ['climb'], text: 'Incrocio e peduncolo cerebellare inferiore' },
            { ids: ['dentate', 'semiSup'], links: ['climb-nuc'], activity: { dentate: 1 }, text: 'Eccita il nucleo profondo e le Purkinje: spike complesso' },
            { ids: ['dentate'], links: ['purkinje'], activity: { dentate: -1 }, text: 'Le Purkinje inibiscono il nucleo profondo' },
            { ids: ['olive'], links: ['nuc-olive'], activity: { olive: -1 }, text: "La via nucleo-olivare spegne l'oliva: il ciclo ricomincia" },
          ],
        },
      ],
    }),
  },
  {
    title: 'La corteccia: tre strati e un circuito',
    body:
      "La corteccia cerebellare ha tre strati. In profondità lo {strato dei granuli|gran}: qui la {fibra muscoide|mossy} si espande a rosetta nel glomerulo, dove agisce anche la {cellula di Golgi|golgi}. Al centro il monostrato delle {cellule di Purkinje|purk}, con l'albero dendritico disposto in un solo piano, perpendicolare all'asse della lamella. In superficie lo {strato molecolare|mol}: l'assone del granulo vi si divide a T nelle {fibre parallele|par}, che corrono lungo la lamella, fra {cellule stellate|stel} e {a canestro|bask}. La {fibra rampicante|climb} sale invece sui dendriti di poche Purkinje.",
    terms: {
      gran: ['layerGran', 'granule'], mossy: ['mossyEnd'], golgi: ['golgi'], purk: ['layerPurk', 'purk'], mol: ['layerMol'],
      par: ['parallel'], stel: ['stellate'], bask: ['basket'], climb: ['climbEnd'],
    },
    quiz: {
      question: 'In quale strato decorrono le fibre parallele?',
      options: ['Nello strato dei granuli', 'Nello strato delle cellule di Purkinje', 'Nello strato molecolare', 'Nel corpo midollare'],
      correct: 2,
      explain: "Nascono dalla divisione a T dell'assone dei granuli e corrono lungo l'asse maggiore della lamella.",
    },
    caption: 'Una lamella ingrandita (schema): gli strati sulle pareti, le cellule nel volume.',
    instruction: 'SCEGLI GLI STRATI O UNA FIBRA · TRASCINA PER RUOTARE',
    view: { yaw: 0.55 },
    mode: block({
      base: [...MICRO, ...CORTEX, ...STEM],
      options: [
        {
          label: 'Tre strati', lit: LAYERS, labels: { layerMol: 'molecolare', layerPurk: 'Purkinje', layerGran: 'granuli' },
          info: 'Dalla profondità alla superficie: granuli, cellule di Purkinje, strato molecolare.',
        },
        {
          label: 'Fibra muscoide', stepTime: 1.8,
          steps: [
            { ids: ['mossyEnd'], links: ['k-mossy'], text: 'La fibra muscoide si espande a rosetta nel glomerulo ed eccita i granuli' },
            { ids: ['granule', 'parallel'], links: ['k-gran', 'k-par'], text: "L'assone del granulo sale e si divide a T: fibre parallele" },
            { ids: ['purk'], text: 'Le fibre parallele eccitano moltissime Purkinje: spike semplice' },
            { ids: ['microNuc'], links: ['k-purk'], activity: { microNuc: -1 }, text: 'La cellula di Purkinje inibisce il nucleo profondo' },
          ],
        },
        {
          label: 'Inibizioni', stepTime: 2,
          steps: [
            { ids: ['golgi'], links: ['k-golgi'], text: 'Inibizione profonda: la cellula di Golgi frena il glomerulo' },
            { ids: ['basket'], links: ['k-basket'], text: 'Inibizione laterale: la cellula a canestro avvolge il soma della Purkinje' },
            { ids: ['stellate'], links: ['k-stellate'], text: 'La cellula stellata inibisce i dendriti della Purkinje' },
          ],
        },
        {
          label: 'Fibra rampicante', stepTime: 1.8,
          steps: [
            { ids: ['climbEnd'], links: ['k-climb'], text: 'La fibra rampicante sale sui dendriti: circa 300 sinapsi, 6-7 Purkinje' },
            { ids: ['microNuc'], links: ['k-climb-nuc'], activity: { microNuc: 1 }, text: 'Eccita direttamente anche il nucleo profondo' },
            { ids: ['purk'], text: 'Spike complesso della cellula di Purkinje' },
            { ids: ['microNuc'], links: ['k-purk'], activity: { microNuc: -1 }, text: 'La Purkinje inibisce il nucleo profondo' },
          ],
        },
      ],
    }),
  },
];

export default {
  id: 'cervelletto',
  title: 'Cervelletto',
  blurb: 'Lobi e peduncoli, i tre cervelletti funzionali, nuclei profondi, fibre muscoidi e rampicanti, corteccia.',
  part: 'Encefalo',
  order: 34,
  model: 'cervelletto',
  createModel: () => new Cervelletto(),
  yaw: 2.45,
  spreads,
};
