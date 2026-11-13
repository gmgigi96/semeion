// Capitolo "Vascolarizzazione dell'encefalo". Testi dagli appunti di
// neuroanatomia (Sistema vascolare).
import { selector } from '../modes.js';
import { SistemaVascolare } from '../models/sistema-vascolare.js';

const ICA = ['icaCerv', 'icaPetr', 'icaCav', 'icaCer'];
const ANT = [...ICA, 'ophthalmic', 'achor', 'pcom', 'aca', 'acom', 'acaB', 'mca', 'striate', 'mcaB'];
const POST = ['va', 'asa', 'basilar', 'pica', 'aica', 'sca', 'pcaP1', 'pca', 'pcaB', 'pcaDeep'];
const STEM = ['midbrain', 'pons', 'medulla', 'cerebellum'];
const SHELL = ['hemi', ...STEM];
const WILLIS = ['acom', 'aca', 'icaCer', 'pcom', 'pcaP1'];
const TERR = ['terrACA', 'terrMCA', 'terrPCA'];
const T_ACA = ['aca', 'acaB'];
const T_MCA = ['mca', 'mcaB'];
const T_PCA = ['pcaP1', 'pca', 'pcaB'];
const VAULT = ['sss', 'ssi', 'straight', 'conf', 'trans', 'sig'];
const SKULL_BASE = ['occ', 'cav', 'intercav', 'spet', 'ipet', 'sphenopar'];
const DEEP = ['icv', 'basal', 'galen'];
const SINUSES = [...VAULT, ...SKULL_BASE, 'ijv'];

const spreads = [
  {
    title: 'Due circoli arteriosi',
    body:
      "L'encefalo riceve sangue da due circoli arteriosi. Il circolo anteriore nasce dall'{arteria carotide interna|ica}: sale nel collo con il {tratto cervicale|cerv}, percorre il canale carotico della rocca ({tratto intrapetroso|petr}), attraversa il seno cavernoso e piega nel {sifone carotideo|cav}, poi perfora la dura madre ({tratto cerebrale|cer}). Il circolo posteriore nasce dall'{arteria vertebrale|va}, ramo della succlavia: sale nel canale trasversario da C6 a C2, entra dal grande forame occipitale e al solco bulbo-pontino si unisce alla controlaterale nel {tronco basilare|bas}, che decorre sulla faccia ventrale del ponte.",
    terms: { ica: ICA, cerv: ['icaCerv'], petr: ['icaPetr'], cav: ['icaCav'], cer: ['icaCer'], va: ['va'], bas: ['basilar'] },
    quiz: {
      question: 'Dove le due arterie vertebrali si uniscono nel tronco basilare?',
      options: ['Al grande forame occipitale', 'Al solco bulbo-pontino', 'Al solco ponto-mesencefalico', 'Nel seno cavernoso'],
      correct: 1,
      explain: 'Al solco ponto-mesencefalico il basilare termina, dividendosi nelle due cerebrali posteriori.',
    },
    caption: 'Arterie reali (mesh BodyParts3D) dentro un encefalo trasparente.',
    instruction: 'ISOLA UN CIRCOLO O UN VASO · TRASCINA IL MODELLO PER RUOTARLO',
    mode: selector({
      base: [...SHELL, ...ANT, ...POST],
      options: [
        { label: 'Circolo anteriore', lit: ANT, info: 'Sistema della carotide interna. Rami terminali: oftalmica, comunicante posteriore, corioidea anteriore, cerebrale anteriore e cerebrale media.' },
        { label: 'Circolo posteriore', lit: POST, info: 'Sistema vertebro-basilare: vertebrali, tronco basilare, arterie cerebellari e cerebrali posteriori.' },
        { label: 'Carotide interna', lit: ICA, info: 'Tratti cervicale, intrapetroso, intracavernoso con il sifone carotideo, cerebrale.' },
        { label: 'Vertebrale', lit: ['va', 'asa'], info: 'Nel cranio decorre sulla superficie ventro-laterale del bulbo; dà le arterie spinali e la PICA.' },
        { label: 'Basilare', lit: ['basilar'], info: 'Dal solco bulbo-pontino al solco ponto-mesencefalico: rami pontini, arteria labirintica, AICA e SCA.' },
        { label: 'Cerebellari', lit: ['pica', 'aica', 'sca'], info: 'PICA dalla vertebrale (lobo posteriore), AICA dal basilare (ilo, peduncoli, nuclei), SCA dal basilare (lobo anteriore).' },
      ],
    }),
  },
  {
    title: 'Il poligono di Willis',
    body:
      "Il {poligono di Willis|willis} è un circolo arterioso alla base dell'encefalo, nello spazio subaracnoideo, che connette il circolo anteriore con il circolo posteriore. È grossomodo un eptagono: il lato anteriore è la {comunicante anteriore|acom}, i due antero-laterali sono le {arterie cerebrali anteriori|aca}, i due laterali le {comunicanti posteriori|pcom}, i due posteriori le {arterie cerebrali posteriori|pca}. Solo il 30-40% delle persone lo possiede in questa forma: la variabilità è estrema. Nell'uomo, a differenza di altre specie, l'occlusione di entrambe le carotidi non viene compensata ed è incompatibile con la vita.",
    terms: { willis: WILLIS, acom: ['acom'], aca: ['aca'], pcom: ['pcom'], pca: ['pcaP1'] },
    quiz: {
      question: 'Quali arterie formano i due lati laterali del poligono?',
      options: ['Le cerebrali medie', 'Le comunicanti posteriori', 'Le cerebrali anteriori', 'Le corioidee anteriori'],
      correct: 1,
      explain: 'Le comunicanti posteriori uniscono la carotide interna alla cerebrale posteriore di ciascun lato.',
    },
    caption: "Il poligono visto dall'alto e da davanti, senza gli emisferi: carotidi in rosso, basilare in porpora.",
    instruction: 'SCEGLI UN LATO DEL POLIGONO (ANCHE CLICCANDO UN VASO)',
    // primo piano sul poligono, con il modello quasi verticale (lo si guarda dall'alto)
    view: { yaw: -0.3, focus: { at: [0, 0.4, 0.1], scale: 1.8, height: 0.3, tilt: 0.05 } },
    mode: selector({
      base: ['midbrain', 'pons', 'icaCav', 'icaCer', 'mca', 'aca', 'acom', 'pcom', 'pcaP1', 'pca', 'basilar', 'sca'],
      pick: { acom: 1, aca: 2, pcom: 3, pcaP1: 4 },
      initial: 0,
      options: [
        { label: 'Poligono', lit: WILLIS, info: 'Sette lati attorno al chiasma ottico e al peduncolo ipofisario: mette in comunicazione carotidi e basilare.' },
        { label: 'Comunicante anteriore', lit: ['acom'], info: 'Lato anteriore, impari: unisce le due cerebrali anteriori quando si fanno paramediane.' },
        { label: 'Cerebrali anteriori', lit: ['aca'], info: 'Lati antero-laterali: dalla carotide interna in avanti e medialmente, sopra il nervo ottico.' },
        { label: 'Comunicanti posteriori', lit: ['pcom'], info: 'Lati laterali: vasi molto piccoli, dalla carotide interna alla cerebrale posteriore.' },
        { label: 'Cerebrali posteriori', lit: ['pcaP1'], info: 'Lati posteriori: rami terminali del tronco basilare, al solco ponto-mesencefalico.' },
      ],
    }),
  },
  {
    title: 'Tre arterie, tre territori',
    body:
      "L'{arteria cerebrale anteriore|aca} passa sopra il nervo ottico, entra nella fessura interemisferica e con le arterie calloso-marginale e pericallosa irrora la {superficie mediale|tACA} dei lobi frontale e parietale e il corpo calloso, oltrepassando il vertice per 2-3 cm sulla faccia laterale. L'{arteria cerebrale media|mca}, o silviana, diretta continuazione della carotide interna, decorre nella scissura laterale e distribuisce i rami corticali alla {faccia laterale|tMCA} e all'insula. L'{arteria cerebrale posteriore|pca} contorna il peduncolo cerebrale e raggiunge la {faccia inferiore del lobo temporale e la faccia mediale dell'occipitale|tPCA}, dove termina come arteria calcarina.",
    terms: { aca: T_ACA, tACA: ['terrACA'], mca: T_MCA, tMCA: ['terrMCA'], pca: T_PCA, tPCA: ['terrPCA'] },
    quiz: {
      question: 'Quale arteria termina come arteria calcarina, per le aree visive?',
      options: ['La cerebrale anteriore', 'La cerebrale media', 'La cerebrale posteriore', 'La corioidea anteriore'],
      correct: 2,
      explain: "L'arteria calcarina decorre nella scissura omonima e irrora le aree visive primaria e secondaria.",
    },
    caption: 'I giri reali colorati secondo il territorio; i confini variano da persona a persona.',
    instruction: "SCEGLI UN'ARTERIA (O CLICCA UN TERRITORIO) E RUOTA IL MODELLO",
    mode: selector({
      base: [...TERR, ...STEM, ...T_ACA, ...T_MCA, ...T_PCA, 'acom', 'icaCer', 'icaCav', 'basilar'],
      pick: { terrACA: 0, terrMCA: 1, terrPCA: 2, aca: 0, acaB: 0, mca: 1, mcaB: 1, pca: 2, pcaB: 2 },
      idle: 'Verde: cerebrale anteriore. Arancio: cerebrale media. Viola: cerebrale posteriore.',
      options: [
        { label: 'Cerebrale anteriore', lit: [...T_ACA, 'terrACA'], info: 'Faccia mediale di frontale e parietale, corpo calloso fino allo splenio, area motoria supplementare; 2-3 cm oltre il vertice.' },
        { label: 'Cerebrale media', lit: [...T_MCA, 'terrMCA'], info: 'Faccia laterale: corteccia prefrontale, aree 4 e 6, area 3-1-2, corteccia parietale associativa, lobo temporale, insula.' },
        { label: 'Cerebrale posteriore', lit: [...T_PCA, 'terrPCA'], info: 'Faccia inferiore del temporale, faccia mediale dell’occipitale: con la calcarina, aree visive primaria e secondaria.' },
      ],
    }),
  },
  {
    title: "Se un'arteria si chiude",
    body:
      "Ogni arteria irrora un territorio proprio: se si chiude, quel territorio resta senza sangue. Dalla {cerebrale media|mca}, prima della scissura di Silvio, nascono le {arterie lenticolo-striate|striate}, rami perforanti per la {capsula interna|capsule}, il {putamen|putamen} e il nucleo caudato: tra le laterali c'è l'arteria dell'emorragia cerebrale di Charcot, sottile e fragile. Nel tronco encefalico l'occlusione della {PICA|pica} causa la sindrome bulbare laterale di Wallenberg, una sindrome alterna: disturbi della deglutizione e disartria, perdita controlaterale della sensibilità dolorifica, sindrome di Horner, atassia omolaterale.",
    terms: { mca: ['mca'], striate: ['striate'], capsule: ['capsule'], putamen: ['putamen'], pica: ['pica'] },
    quiz: {
      question: "L'occlusione della PICA provoca…",
      options: ['la sindrome bulbare mediale di Dejerine', 'la sindrome bulbare laterale di Wallenberg', 'la perdita delle aree visive', "un'emorragia della capsula interna"],
      correct: 1,
      explain: 'La sindrome di Dejerine dipende invece da un’arteria paramediana bulbare.',
    },
    caption: "Il vaso chiuso e il suo territorio si scuriscono; il resto dell'encefalo resta irrorato.",
    instruction: "SCEGLI L'ARTERIA DA CHIUDERE E GUARDA CHE COSA RESTA SENZA SANGUE",
    mode: selector({
      base: [...TERR, ...STEM, ...T_ACA, ...T_MCA, ...T_PCA, 'acom', 'icaCer', 'icaCav', 'basilar', 'va', 'pica', 'striate', 'capsule', 'putamen'],
      looks: Object.fromEntries(TERR.map((id) => [id, { opacity: 0.3 }])),
      pick: { terrACA: 0, terrMCA: 1, terrPCA: 3, striate: 2, capsule: 2, putamen: 2, pica: 4 },
      idle: 'Nessuna occlusione. I territori sono in trasparenza per mostrare capsula interna e putamen.',
      options: [
        { label: 'Cerebrale anteriore', dead: [...T_ACA, 'terrACA'], info: 'Senza sangue: faccia mediale di frontale e parietale, area motoria supplementare, aree 23 e 24, corpo calloso.' },
        { label: 'Cerebrale media', dead: [...T_MCA, 'striate', 'terrMCA', 'capsule', 'putamen'], info: 'Senza sangue: faccia laterale (aree 4 e 6, area 3-1-2, insula) e, in profondità, capsula interna e putamen.' },
        { label: 'Lenticolo-striate', dead: ['striate', 'capsule', 'putamen'], info: "Rami perforanti della cerebrale media: capsula interna, putamen, nucleo caudato. Qui si rompe l'arteria di Charcot." },
        { label: 'Cerebrale posteriore', dead: [...T_PCA, 'terrPCA'], info: 'Senza sangue: faccia inferiore del temporale e faccia mediale dell’occipitale, con le aree visive.' },
        { label: 'PICA', dead: ['pica', 'medulla'], info: 'Sindrome di Wallenberg: è colpita la parte laterale del bulbo (nucleo ambiguo, fascio spino-talamico, fascio ipotalamo-spinale).' },
      ],
    }),
  },
  {
    title: 'I seni della dura madre',
    body:
      "I {seni della dura madre|all} sono canali scavati negli sdoppiamenti della dura, privi di tonaca media e di valvole, che raccolgono le vene cerebrali. Il {seno sagittale superiore|sss} percorre il margine aderente della grande falce fino al {confluente dei seni|conf}; il {seno sagittale inferiore|ssi}, nel margine libero, confluisce con la {grande vena di Galeno|galen} nel {seno retto|straight}. Dal confluente i {seni trasversi|trans} proseguono nei {seni sigmoidei|sig}, che al foro lacero posteriore si continuano nella {vena giugulare interna|ijv}. Alla base il {seno cavernoso|cav}, ai lati della sella turcica, drena nei {seni petrosi superiore e inferiore|petr}.",
    terms: {
      all: SINUSES, sss: ['sss'], conf: ['conf'], ssi: ['ssi'], galen: ['galen'], straight: ['straight'],
      trans: ['trans'], sig: ['sig'], ijv: ['ijv'], cav: ['cav'], petr: ['spet', 'ipet'],
    },
    quiz: {
      question: 'Quali vasi confluiscono nel seno retto?',
      options: ['I due seni trasversi', 'Il seno sagittale inferiore e la grande vena di Galeno', 'I seni petrosi superiore e inferiore', 'Il seno sagittale superiore e il seno occipitale'],
      correct: 1,
      explain: 'Il seno retto decorre poi nell’attacco della falce al tentorio, fino al confluente dei seni.',
    },
    caption: 'Seni e vene profonde ricostruiti sul cranio, sul tentorio e sulle carotidi reali.',
    instruction: 'SEGUI IL SANGUE VENOSO FINO ALLA GIUGULARE, O ISOLA UN GRUPPO DI SENI',
    view: { yaw: -2.2 },
    mode: selector({
      base: [...SHELL, 'tentorium', ...SINUSES, ...DEEP, 'icaCav', 'icaPetr', 'icaCer'],
      looks: { cav: { opacity: 0.6 } },
      idle: 'Blu: seni della volta. Verde-azzurro: seni della base. Celeste: vene profonde.',
      options: [
        {
          label: 'Dalla volta', stepTime: 1.6,
          steps: [
            { ids: ['sss'], text: 'Seno sagittale superiore, nel margine aderente della falce' },
            { ids: ['conf'], text: 'Confluente dei seni, alla protuberanza occipitale interna' },
            { ids: ['trans'], text: 'Seni trasversi, nel margine aderente del tentorio' },
            { ids: ['sig'], text: 'Seni sigmoidei, nel solco sigmoideo' },
            { ids: ['ijv'], text: 'Bulbo della giugulare e vena giugulare interna' },
          ],
        },
        {
          label: 'Dal profondo', stepTime: 1.6,
          steps: [
            { ids: ['icv', 'basal'], text: 'Vene cerebrali interne e vene basali di Rosenthal' },
            { ids: ['galen', 'ssi'], text: 'Grande vena di Galeno e seno sagittale inferiore' },
            { ids: ['straight'], text: 'Seno retto, tra falce e tentorio' },
            { ids: ['conf'], text: 'Confluente dei seni' },
            { ids: ['trans', 'sig', 'ijv'], text: 'Trasverso, sigmoideo, giugulare interna' },
          ],
        },
        { label: 'Seni della volta', lit: [...VAULT, 'sphenopar'], info: 'Sagittali superiore e inferiore, retto, trasversi, sigmoidei; lo sfenoparietale è insieme della volta e della base.' },
        { label: 'Seni della base', lit: SKULL_BASE, info: 'Occipitale, cavernosi, intercavernosi, petrosi superiore e inferiore, sfenoparietale.' },
        { label: 'Seno cavernoso', lit: ['cav', 'intercav', 'spet', 'ipet', 'sphenopar', 'icaCav'], info: 'Contiene la carotide interna. Il petroso superiore termina nel sigmoideo, l’inferiore nella giugulare interna.' },
      ],
    }),
  },
];

export default {
  id: 'sistema-vascolare',
  title: "Vascolarizzazione dell'encefalo",
  blurb: 'Carotidi e vertebrali, poligono di Willis, territori arteriosi e seni venosi.',
  part: 'Vasi e scheletro',
  order: 70,
  model: 'sistema-vascolare',
  createModel: () => new SistemaVascolare(),
  zoom: 1,
  yaw: -0.85,
  spreads,
};
