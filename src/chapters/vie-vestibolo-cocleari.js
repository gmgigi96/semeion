// Capitolo "Vie vestibolo-cocleari". Testi dagli appunti di neuroanatomia
// (Vie vestibolo-cocleari): nervo VIII, nuclei, via cocleare, potenziali evocati.
import { selector } from '../modes.js';
import { VieVestiboloCocleari, at } from '../models/vie-vestibolo-cocleari.js';

const CANALS = ['canalSup', 'canalLat', 'canalPost'];
const LAB = ['vestibule', ...CANALS];
const CN = ['cnTrunk', 'cnEnd'];
const VTR = ['vnTrunk', 'vnStem'];
const VN = [...VTR, 'vnHilum', 'nAmp', 'vnUtr', 'vnSac', 'nPost'];
const PM = ['ponsR', 'ponsL', 'medR', 'medL']; // ponte basso e bulbo alto, dove stanno i nuclei
const STEM = [...PM, 'ponsUp', 'midbrain'];
const VNUC = ['vnSup', 'vnLat', 'vnMed', 'vnInf'];
const CNUC = ['dcn', 'vcn'];
const INTER = ['ntb', 'son', 'nll'];
const HEAR = [...STEM, 'viiiCist', ...CN, 'cochlea', 'corti', 'rootCoch', ...CNUC, ...INTER, 'll', 'ic', 'mgb',
  'thalamus', 'heschl', 'stg'];

// Primi piani del motore: centro in mm Z-Anatomy (destra positiva, indietro, alto),
// ingrandimento, quota a cui il centro viene portato.
const frame = (c, scale, height, more) => ({ at: at(c), scale, height, ...more });
const ANGLE = frame([24, 7, 1580], 4, 0.26);
const EAR = frame([37.4, 5.2, 1581.8], 8, 0.29, { stand: false });
const NUCLEI = frame([0, 17, 1578], 3.9, 0.38);
const CORD = frame([0, 21, 1562], 1.9, 0.33);
const CEREB = frame([0, 28, 1579], 2.1, 0.3);
const OCULO = frame([0, 14, 1590], 3.2, 0.34);
const CORTEX = frame([0, 12, 1598], 2.2, 0.36);
const WIDE = frame([0, 10, 1600], 1.5, 0.29);
const STEMVIEW = frame([0, 14, 1593], 3.2, 0.33);
const PERIPH = frame([22, 9, 1581], 2.5, 0.28);
const CNVIEW = frame([9, 16, 1582], 3.2, 0.3);

const UP = ['cnIn', 'striaD', 'striaV', 'striaVi']; // vie fino ai nuclei interposti

const spreads = [
  {
    title: 'Un nervo, due componenti',
    body:
      "Il {nervo vestibolo-cocleare|viii} (VIII) è un nervo sensitivo costituito da due componenti. La {componente cocleare|coch}, più anteriore, origina dal {ganglio spirale del Corti|corti}, nel canale di Rosenthal del modiolo della {chiocciola|cochlea}. La {componente vestibolare|vest} origina dal {ganglio vestibolare dello Scarpa|scarpa}, nel fondo del meato acustico interno, dove si unisce alla cocleare. Sulla componente cocleare, che si dispone a doccia, si appoggia il {nervo faciale|vii}. Il nervo decorre poi nell'angolo ponto-cerebellare, delimitato dal {flocculo|flocculus}, dal {ponte|pons} e dalla {piramide del temporale|petrous}; l'origine apparente è nella fossetta retrolivare, a livello del solco bulbo-pontino.",
    terms: {
      viii: ['viiiCist', ...CN, ...VTR], coch: CN, corti: ['corti'], cochlea: ['cochlea'], vest: [...VTR, 'vnHilum'],
      scarpa: ['scarpa'], vii: ['fn'], flocculus: ['flocculus'], pons: ['ponsR'], petrous: ['petrous'],
    },
    quiz: {
      question: 'Dove si trova il ganglio vestibolare dello Scarpa?',
      options: ['Nel modiolo della chiocciola', 'Nel fondo del meato acustico interno', "Nell'angolo ponto-cerebellare", 'Nel bulbo rostrale'],
      correct: 1,
      explain: 'Nel modiolo, nel canale di Rosenthal, si trova invece il ganglio spirale del Corti.',
    },
    caption: 'Lato destro: nervo, chiocciola, vestibolo, ponte, flocculo e rocca sono mesh reali (Z-Anatomy); i due gangli sono ricostruiti.',
    instruction: 'SCEGLI UNA COMPONENTE · TRASCINA IL MODELLO PER RUOTARLO',
    view: { yaw: 0.35, focus: ANGLE },
    mode: selector({
      base: ['ponsR', 'medR', 'petrous', 'flocculus', 'viiiCist', ...CN, ...VN, 'fn', 'cochlea', ...LAB, 'scarpa', 'corti'],
      looks: { cochlea: { opacity: 0.5 }, petrous: { opacity: 0.12 } },
      pick: { cnTrunk: 0, cnEnd: 0, cochlea: 0, corti: 0, vnTrunk: 1, vnStem: 1, scarpa: 1, vestibule: 1, canalSup: 1, canalLat: 1, canalPost: 1, fn: 2, viiiCist: 3, flocculus: 3 },
      idle: 'Verde-azzurro: componente cocleare. Arancio: componente vestibolare. Giallo: il nervo riunito, fino al solco bulbo-pontino.',
      options: [
        { label: 'Componente cocleare', lit: [...CN, 'corti', 'cochlea'], labels: { corti: 'ganglio del Corti' }, info: 'Dal ganglio spirale del Corti, nel modiolo, i rami centrali emergono sull’area cocleare del meato acustico interno.' },
        { label: 'Componente vestibolare', lit: [...VN, 'scarpa', ...LAB], labels: { scarpa: 'ganglio dello Scarpa' }, info: 'Dal ganglio dello Scarpa, nel fondo del meato acustico interno; si unisce poi alla componente cocleare.' },
        { label: 'Nervo faciale', lit: ['fn', ...CN], info: 'Il faciale si appoggia sopra la componente cocleare, disposta a doccia.' },
        { label: 'Angolo ponto-cerebellare', lit: ['viiiCist', 'flocculus', 'ponsR', 'petrous'], labels: { flocculus: 'flocculo', viiiCist: 'VIII' }, info: 'Dietro il lobulo flocculo-nodulare, medialmente la superficie laterale del ponte, davanti la piramide del temporale.' },
      ],
    }),
  },
  {
    title: 'Il ganglio dello Scarpa',
    body:
      "I prolungamenti periferici del {ganglio dello Scarpa|scarpa} si distribuiscono in due rami; talvolta si trovano anche due gangli. La {divisione superiore|sup} attraversa i forellini dell'area vestibolare superiore e contiene il {nervo ampollare|amp}, per la cresta ampollare dei canali semicircolari {superiore|csup} e {laterale|clat}, e il {nervo dell'utricolo|utr}. La {divisione inferiore|inf} attraversa l'area vestibolare inferiore e contiene il {nervo sacculare|sac} e il {nervo del canale semicircolare posteriore|post}, che a volte esce dal forame singolare del Morgagni. Le due divisioni si fondono nel ganglio, da cui origina la {componente vestibolare|vest}.",
    terms: {
      scarpa: ['scarpa'], sup: ['nAmp', 'vnUtr'], amp: ['nAmp'], csup: ['canalSup'], clat: ['canalLat'], utr: ['vnUtr'], inf: ['vnSac', 'nPost'],
      sac: ['vnSac'], post: ['nPost', 'canalPost'], vest: ['vnStem'],
    },
    quiz: {
      question: 'Quale nervo esce a volte dal forame singolare del Morgagni?',
      options: ["Il nervo dell'utricolo", 'Il nervo sacculare', 'Il nervo del canale semicircolare posteriore', 'Il nervo ampollare del canale laterale'],
      correct: 2,
      explain: 'Appartiene alla divisione inferiore, insieme al nervo sacculare.',
    },
    caption: 'Labirinto destro ingrandito. Vestibolo, canali e rami del nervo sono mesh reali; ganglio e nervo del canale posteriore sono ricostruiti.',
    instruction: 'SCEGLI UNA DIVISIONE E SEGUI I RAMI FINO AL LABIRINTO',
    view: { yaw: 0.6, focus: EAR },
    mode: selector({
      base: ['cochlea', ...LAB, 'scarpa', 'vnStem', 'vnHilum', 'nAmp', 'vnUtr', 'vnSac', 'nPost', 'cnEnd'],
      looks: { cochlea: { opacity: 0.25 }, vestibule: { opacity: 0.7 } },
      pick: { nAmp: 0, vnUtr: 0, canalSup: 0, canalLat: 0, vnSac: 1, nPost: 1, canalPost: 1, scarpa: 2, vnStem: 2, vnHilum: 2, cnEnd: 2 },
      idle: 'Rosso: nervo ampollare. Giallo-arancio: nervo dell’utricolo. Viola: nervo sacculare e nervo del canale posteriore.',
      options: [
        { label: 'Divisione superiore', lit: ['nAmp', 'vnUtr', 'canalSup', 'canalLat'], labels: { canalSup: 'canale superiore', canalLat: 'canale laterale' }, info: 'Nervo ampollare per le creste dei canali superiore e laterale, e nervo dell’utricolo.' },
        { label: 'Divisione inferiore', lit: ['vnSac', 'nPost', 'canalPost'], labels: { canalPost: 'canale posteriore' }, info: 'Nervo sacculare e nervo del canale semicircolare posteriore (forame singolare del Morgagni).' },
        { label: 'Ganglio e nervo', lit: ['scarpa', 'vnHilum', 'vnStem', 'cnEnd'], labels: { scarpa: 'ganglio dello Scarpa' }, info: 'Le due divisioni si fondono nel ganglio; la componente vestibolare si unisce alla cocleare nel meato acustico interno.' },
      ],
    }),
  },
  {
    title: 'I nuclei e le proiezioni vestibolari',
    body:
      "La componente cocleare raggiunge il ponte caudale, dove si trovano i due nuclei cocleari, {dorsale|dcn} e {ventrale|vcn}, a livello del tubercolo acustico, sporgenza determinata dal nucleo cocleare dorsale. La componente vestibolare raggiunge nel bulbo rostrale i nuclei vestibolari {inferiore|inf}, {mediale|med} e {laterale|lat}, localizzati a livello dell'ala bianca esterna, e il nucleo vestibolare {superiore|sup}, unico a sede bulbo-pontina. I nuclei vestibolari proiettano al {midollo spinale|cord}, al {cervelletto|cereb}, ai {nuclei oculomotori|oculo} e alla corteccia cerebrale, attraverso il lemnisco mediale (aree 3, 1, 2, area 6 e area 43).",
    terms: {
      dcn: ['dcn'], vcn: ['vcn'], inf: ['vnInf'], med: ['vnMed'], lat: ['vnLat'], sup: ['vnSup'], cord: ['vst'], cereb: ['flocculus', 'flocculusL', 'nodule'],
      oculo: ['nucVI', 'nucIV', 'nucIII'],
    },
    quiz: {
      question: 'Quale nucleo vestibolare è l’unico a sede bulbo-pontina?',
      options: ['Il nucleo inferiore', 'Il nucleo mediale', 'Il nucleo laterale', 'Il nucleo superiore'],
      correct: 3,
      explain: 'Gli altri tre si trovano nel bulbo rostrale, a livello dell’ala bianca esterna.',
    },
    caption: 'Tronco encefalico visto da dietro, in trasparenza. I nuclei sono ricostruiti sotto il pavimento del IV ventricolo della mesh reale.',
    instruction: 'SCEGLI I NUCLEI O UNA PROIEZIONE: L’INQUADRATURA SI SPOSTA SUL BERSAGLIO',
    view: { yaw: 2.75, focus: NUCLEI },
    mode: selector({
      base: [...PM, 'viiiCist', 'rootVest', 'rootCoch', ...VNUC, ...CNUC],
      looks: { cerebellum: { opacity: 0.08 }, nodule: { opacity: 0.8 } },
      pick: { dcn: 0, vcn: 0, vnSup: 1, vnLat: 1, vnMed: 1, vnInf: 1 },
      idle: 'Azzurro e blu: nuclei cocleari, laterali. Rosso, arancio, giallo e viola: i quattro nuclei vestibolari.',
      options: [
        { label: 'Nuclei cocleari', lit: [...CNUC, 'rootCoch', 'viiiCist'], labels: { dcn: 'dorsale', vcn: 'ventrale' }, info: 'Nel ponte caudale: il nucleo dorsale determina il tubercolo acustico.' },
        { label: 'Nuclei vestibolari', lit: [...VNUC, 'rootVest', 'viiiCist'], labels: { vnSup: 'superiore', vnLat: 'laterale', vnMed: 'mediale', vnInf: 'inferiore' }, info: 'Inferiore, mediale e laterale nel bulbo rostrale; il superiore è l’unico a sede bulbo-pontina.' },
        { label: 'Al midollo', focus: CORD, lit: ['vnLat', 'vst'], show: ['cord', 'medullaLow'], links: ['vsp'], info: 'I nuclei vestibolari proiettano al midollo spinale.' },
        { label: 'Al cervelletto', focus: CEREB, lit: ['rootVest', 'vnInf', 'vnMed', 'vnLat', 'flocculus', 'nodule'], show: ['cerebellum', 'flocculusL'], links: ['vcbPrim', 'vcbNod', 'vcbFloc'], labels: { flocculus: 'flocculo', nodule: 'nodulo' }, info: 'Afferenze primarie (blu, direttamente dal nervo), secondarie (verde, dai nuclei) e terziarie.' },
        { label: 'Ai nuclei oculomotori', focus: OCULO, lit: [...VNUC, 'flm', 'nucVI', 'nucIV', 'nucIII'], show: ['midbrain', 'ponsUp'], links: ['mlfVI', 'mlfIV', 'mlfIII', 'mlfX'], labels: { nucIII: 'III', nucIV: 'IV', nucVI: 'VI' }, info: 'Proiezioni ai nuclei oculomotori (III, IV e VI), paramediane sotto il pavimento del IV ventricolo.' },
        { label: 'Alla corteccia', focus: CORTEX, lit: ['vnSup', 'vnLat', 'thalamus'], show: ['midbrain', 'ponsUp'], links: ['vThal'], info: 'Attraverso il lemnisco mediale: aree 3, 1, 2, area 6 e area 43.' },
      ],
    }),
  },
  {
    title: 'La via cocleare',
    body:
      "La via cocleare si genera nel {ganglio del Corti|corti}; gli stimoli uditivi sono trasmessi alla corteccia in maniera bilaterale. Dal {nucleo cocleare dorsale|dcn} originano le strie acustiche dorsali, che si incrociano interamente e ascendono come {lemnisco laterale|ll} fino al {collicolo inferiore|ic}; attraverso il braccio quadrigeminale inferiore passano al {corpo genicolato mediale|mgb} e arrivano alla {corteccia uditiva primaria|a1}. Dal {nucleo cocleare ventrale|vcn} originano le strie acustiche ventrali, in parte crociate e in parte ipsilaterali, che stazionano nel {nucleo del corpo trapezoide|ntb}, nel {nucleo olivare superiore|son} e nel {nucleo del lemnisco laterale|nll}.",
    terms: {
      corti: ['corti'], dcn: ['dcn'], ll: ['ll'], ic: ['ic'], mgb: ['mgb'], a1: ['heschl'], vcn: ['vcn'], ntb: ['ntb'], son: ['son'], nll: ['nll'],
    },
    quiz: {
      question: 'Quali fibre si incrociano interamente?',
      options: ['Le strie acustiche ventrali', 'Le strie acustiche dorsali', 'Le fibre del nervo cocleare', 'Le fibre del braccio quadrigeminale inferiore'],
      correct: 1,
      explain: 'Le strie ventrali si incrociano solo in parte: il resto prosegue ipsilateralmente.',
    },
    caption: 'Dall’orecchio destro alla corteccia dei due lati. Collicoli, genicolati e giri di Heschl sono mesh reali; nuclei e fasci del ponte sono ricostruiti.',
    instruction: 'SEGUI UNA STRIA PASSO PER PASSO, OPPURE IL FASCIO EFFERENTE',
    view: { yaw: 0.3, focus: WIDE },
    mode: selector({
      base: [...HEAR, ...VTR],
      looks: { thalamus: { opacity: 0.3 }, cochlea: { opacity: 0.6 } },
      idle: 'Le stazioni della via cocleare, dalla chiocciola destra ai giri di Heschl dei due lati.',
      options: [
        {
          label: 'Stria dorsale', stepTime: 2.4, focus: STEMVIEW,
          steps: [
            { ids: ['corti', ...CN], links: ['cnIn'], focus: PERIPH, text: 'Ganglio del Corti e nervo cocleare' },
            { ids: ['dcn', 'rootCoch'], focus: PERIPH, text: 'Nucleo cocleare dorsale, più evoluto e meno frammentato' },
            { ids: [], links: ['striaD'], text: 'Strie acustiche dorsali: si incrociano interamente' },
            { ids: ['ll'], links: ['llL'], text: 'Ascendono come lemnisco laterale' },
            { ids: ['ic'], text: 'Collicolo inferiore' },
            { ids: ['mgb'], links: ['bicL'], text: 'Braccio quadrigeminale inferiore › corpo genicolato mediale' },
            { ids: ['heschl'], links: ['radL'], focus: WIDE, text: 'Braccio sottolenticolare della capsula interna › corteccia uditiva primaria' },
          ],
        },
        {
          label: 'Stria ventrale', stepTime: 2.4, focus: STEMVIEW,
          steps: [
            { ids: ['corti', ...CN], links: ['cnIn'], focus: PERIPH, text: 'Ganglio del Corti e nervo cocleare' },
            { ids: ['vcn', 'rootCoch'], focus: PERIPH, text: 'Nucleo cocleare ventrale, più arcaico e frammentato' },
            { ids: ['ntb'], links: ['striaV', 'striaVi'], text: 'Strie acustiche ventrali, crociate e ipsilaterali: nucleo del corpo trapezoide' },
            { ids: ['son'], text: 'Nucleo olivare superiore, più rostrale' },
            { ids: ['nll', 'll'], links: ['llL', 'llR'], text: 'Ancora più rostrale il nucleo del lemnisco laterale' },
            { ids: ['ic', 'mgb', 'heschl'], links: ['bicL', 'bicR', 'radL', 'radR'], focus: WIDE, text: 'Collicolo inferiore, genicolato mediale e corteccia: dei due lati' },
          ],
        },
        { label: 'Fascio di Rasmussen', focus: PERIPH, lit: ['son', ...VTR, 'cnEnd', 'cochlea', 'corti'], links: ['rasm'], labels: { son: 'olivare superiore' }, info: 'Fascio olivo-cocleare, efferente: decorre nella componente vestibolare e con l’anastomosi di Oort raggiunge la cocleare.' },
      ],
    }),
  },
  {
    title: "Dove si interrompe l'impulso?",
    body:
      "Per capire in quale punto si interrompe la trasmissione dell'impulso uditivo si effettuano i potenziali evocati uditivi. Se il blocco è alla {coclea|cochlea} o al {nervo cocleare|coch}, sono alterate le onde I o II. Se la lesione interessa i {nuclei cocleari|cn} ventrale e dorsale, è alterata l'onda III; se interessa i {nuclei interposti|inter} (olivare superiore, del corpo trapezoide, del lemnisco laterale) o il {collicolo inferiore|ic}, le onde IV e V. Se il blocco è al {corpo genicolato mediale|mgb}, è alterata l'onda VI; se la lesione interessa la {corteccia uditiva primaria|a1}, l'onda VII.",
    terms: { cochlea: ['cochlea'], coch: CN, cn: CNUC, inter: INTER, ic: ['ic'], mgb: ['mgb'], a1: ['heschl'] },
    quiz: {
      question: "Nei potenziali evocati uditivi è alterata l'onda III. Dove si interrompe l'impulso?",
      options: ['Nel nervo cocleare', 'Nei nuclei cocleari', 'Nel collicolo inferiore', 'Nel corpo genicolato mediale'],
      correct: 1,
      explain: 'Le onde I e II indicano la coclea o il nervo, le onde IV e V i nuclei interposti o il collicolo inferiore.',
    },
    caption: 'Anello rosso: punto del blocco. Le frecce mostrano fin dove arriva l’impulso; la stazione interessata si scurisce.',
    instruction: 'SCEGLI UN’ONDA ALTERATA E TROVA IL PUNTO DEL BLOCCO',
    view: { yaw: 0.3, focus: WIDE },
    mode: selector({
      base: HEAR,
      looks: { thalamus: { opacity: 0.3 } },
      pick: { cochlea: 0, cnTrunk: 0, cnEnd: 0, dcn: 1, vcn: 1, ntb: 2, son: 2, nll: 2, ic: 2, mgb: 3, heschl: 4 },
      idle: 'Nessun blocco: l’impulso sale dalla chiocciola alla corteccia uditiva primaria.',
      options: [
        { label: 'Onde I-II', focus: PERIPH, show: ['cut1'], dead: CN, labels: { cut1: 'onde I o II' }, info: 'Blocco della trasmissione dello stimolo alla coclea o al nervo cocleare.' },
        { label: 'Onda III', focus: CNVIEW, show: ['cut3'], dead: CNUC, links: ['cnIn'], labels: { cut3: 'onda III' }, info: 'La lesione interessa i nuclei cocleari ventrale e dorsale.' },
        { label: 'Onde IV-V', focus: STEMVIEW, show: ['cut45'], dead: [...INTER, 'ic'], links: UP, labels: { cut45: 'onde IV e V' }, info: 'Nuclei interposti (olivare superiore, del corpo trapezoide, del lemnisco laterale) o collicolo inferiore.' },
        { label: 'Onda VI', show: ['cut6'], dead: ['mgb'], links: [...UP, 'llL', 'llR'], labels: { cut6: 'onda VI' }, info: 'Blocco della trasmissione dello stimolo al corpo genicolato mediale.' },
        { label: 'Onda VII', show: ['cut7'], dead: ['heschl'], links: [...UP, 'llL', 'llR', 'bicL', 'bicR'], labels: { cut7: 'onda VII' }, info: 'La lesione interessa la corteccia uditiva primaria (giro di Heschl, aree 41 e 42).' },
      ],
    }),
  },
];

export default {
  id: 'vie-vestibolo-cocleari',
  title: 'Vie vestibolo-cocleari',
  blurb: 'Nervo VIII, gangli dello Scarpa e del Corti, nuclei vestibolari e cocleari, via cocleare.',
  part: 'Organi di senso',
  order: 54,
  model: 'vie-vestibolo-cocleari',
  createModel: () => new VieVestiboloCocleari(),
  zoom: 1,
  yaw: 0.35,
  spreads,
};
