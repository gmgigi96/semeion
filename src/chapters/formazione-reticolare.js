// Capitolo "Formazione reticolare". Testi ricavati dagli appunti di
// neuroanatomia (Formazione reticolare). Non sono negli appunti: il livello del
// taglio nella decerebrazione (pagina 4: qui attraverso il mesencefalo) e il
// decorso disegnato delle vie, che uniscono origine e bersaglio; vedi le fonti
// in testa a src/models/formazione-reticolare.js.
import { selector } from '../modes.js';
import { ReticularModel } from '../models/formazione-reticolare.js';

const STEM = ['midbrain', 'pons', 'medulla', 'cord', 'v4', 'aqueduct'];
const RAPHE_C = ['rPal', 'rObs', 'rMag']; // gruppo caudale
const RAPHE_R = ['rPon', 'rCen', 'rTeg', 'rDor']; // gruppo rostrale
const RAPHE = [...RAPHE_C, ...RAPHE_R];
const MEDIAL = ['gigBulb', 'magoun', 'gigPont', 'pprf', 'cun', 'subcun'];
const INNER = ['a2', 'postrema', 'lc', 'ppn', 'ldt']; // banda interna, dorsale
const OUTER = ['a1', 'a5', 'a7', 'barr']; // banda esterna, ventrale
const DOPA = ['a8', 'snc', 'snr', 'vta']; // porzione mesencefalica
const LATERAL = ['parv', 'parabr', ...INNER, ...OUTER, ...DOPA];
const PRECB = ['lrn', 'pmrn', 'rtn'];
const NET = [...RAPHE, ...MEDIAL, ...LATERAL];
const both = (...ids) => ids.flatMap((id) => [id, `${id}L`]);

// Porta sopra la base la regione di cui parla la pagina (vedi setFocus nel modello).
const focused = (center, scale, height, mode) => async (ctx) => {
  const api = await mode(ctx);
  return { ...api, enter() { api.enter(); ctx.model.setFocus(center, scale, height); } };
};
const BRAINSTEM = [0, 0.297, -0.02];
const UPPER = ['midbrain', 'pons', 'medulla', 'v4', 'aqueduct']; // senza il midollo, che nei primi piani uscirebbe dalla base

const spreads = [
  {
    title: 'Una rete al centro del tronco encefalico',
    body:
      "La formazione reticolare è la componente filogeneticamente più antica dei sistemi ascendenti e discendenti: un insieme di {nuclei connessi a rete|net} che attraversa tutto il {tronco encefalico|stem}, al centro del tegmento, e continua nei primi neuromeri cervicali come {nucleo reticolare del midollo spinale|cordRet} (lamine 5 e 8). Moruzzi e Magoun videro che, stimolata ad alta frequenza, de-sincronizza il tracciato della {corteccia cerebrale|cortex}, come nel passaggio dal sonno alla veglia vigile: la chiamarono sistema reticolare attivante ascendente. Oggi sappiamo che comprende anche neuroni diretti a {talamo|thal}, {ipotalamo|hyp} e {midollo spinale|cord}, e che regola minzione, pressione e respirazione.",
    terms: {
      net: NET, stem: ['midbrain', 'pons', 'medulla'], cordRet: ['cordRet'], cortex: ['cortex'],
      thal: ['thalamus', 'intralam'], hyp: ['hypothalamus'], cord: ['cord'],
    },
    quiz: {
      question: 'Che cosa osservarono Moruzzi e Magoun stimolando ad alta frequenza la formazione reticolare?',
      options: [
        'Un tracciato lento e sincrono, come nel sonno',
        'La de-sincronizzazione del tracciato corticale',
        'La scomparsa del tono muscolare',
        "L'arresto del respiro",
      ],
      correct: 1,
      explain: 'Il tracciato, lento e sincrono nel sonno e nella veglia rilassata, si de-sincronizza come nella veglia vigile.',
    },
    caption: 'Encefalo e midollo cervicale reali (Z-Anatomy) in trasparenza; i nuclei della rete sono ricostruiti.',
    instruction: 'SCEGLI DOVE GUARDARE, POI STIMOLA LA RETE',
    view: { yaw: -1.0, zoom: 0.95 },
    mode: selector({
      base: [...STEM, 'cortex', 'thalamus', 'hypothalamus', 'cordRet', ...NET],
      idle: 'Al centro del tronco, sotto la corteccia: una rete di nuclei dal mesencefalo al midollo.',
      options: [
        {
          label: "Dov'è", lit: [...NET, 'cordRet'],
          labels: { rDor: 'mesencefalo', pprf: 'ponte', gigBulb: 'bulbo', cordRet: 'midollo cervicale' },
          info: 'Occupa il tegmento di mesencefalo, ponte e bulbo; in basso continua nel midollo cervicale.',
        },
        {
          label: 'Stimola la rete',
          stepTime: 2.6,
          steps: [
            { ids: ['gigBulb', 'gigPont', 'pprf', 'cun', 'subcun'], links: both('srt', 'retUp'), text: 'Gli stimoli raccolti dalla rete salgono lungo il tronco' },
            { ids: ['intralam'], links: both('retThal'), text: 'Stazione nei nuclei talamici aspecifici' },
            { ids: ['intralam'], links: both('tcF', 'tcC', 'tcP'), text: 'Corteccia: il tracciato si de-sincronizza, veglia vigile' },
          ],
        },
        {
          label: 'Oltre il talamo',
          lit: ['parabr', 'amygdala', 'hypothalamus', 'ppn', 'striatum', 'rDor', 'rCen'],
          links: ['spb', 'pbAmy', 'pbHyp', 'ppnStr', ...both('rapheUp')],
          info: 'Arancio: dal nucleo parabrachiale ad amigdala e ipotalamo. Viola: fibre colinergiche ai nuclei della base. Giallo: rafe.',
        },
        {
          label: 'Verso il midollo',
          lit: ['gigPont', 'magoun', 'rMag', 'antHorn', 'postHorn', 'cordRet'],
          links: ['rsPont', 'rsBulb', 'rsBulbX', ...both('rapheSp')],
          info: 'Fasci reticolo-spinali pontino e bulbare e via rafe-spinale: postura, movimento e dolore.',
        },
      ],
    }),
  },
  {
    title: 'Tre colonne di nuclei',
    body:
      "Per dimensioni si distinguono neuroni magnocellulari, nei due terzi mediali del tronco, e parvicellulari, nel terzo laterale: una distinzione possibile solo in {ponte|pons} e {bulbo|medulla}. Topograficamente le colonne verticali sono tre. La {colonna mediana|raphe} corrisponde ai nuclei del rafe. La {colonna mediale|medial} comprende il {giganto-cellulare bulbare|gigBulb}, nel ponte il {giganto-cellulare pontino|gigPont} e la {PPRF|pprf}, alla giunzione ponto-mesencefalica i nuclei {cuneiforme|cun} e {sub-cuneiforme|subcun}. La {colonna laterale|lateral}, disomogenea, ha l'{area parvicellulare|parv}, una banda interna più dorsale e una esterna più ventrale. Nella rete sono accolte anche tre {stazioni pre-cerebellari|precb}.",
    terms: {
      pons: ['pons'], medulla: ['medulla'], raphe: RAPHE, medial: MEDIAL, gigBulb: ['gigBulb'], gigPont: ['gigPont'],
      pprf: ['pprf'], cun: ['cun'], subcun: ['subcun'], lateral: LATERAL, parv: ['parv'], precb: PRECB,
    },
    quiz: {
      question: 'In quale tratto del tronco si distinguono neuroni magnocellulari e parvicellulari?',
      options: ['Solo nel mesencefalo', 'In tutto il tronco encefalico', 'Solo in ponte e bulbo', 'Solo nel bulbo'],
      correct: 2,
      explain: 'Nel mesencefalo la distinzione tra regione tegmentale mediale e laterale non è possibile.',
    },
    caption: 'Tronco encefalico reale in trasparenza, da dietro e da destra; in azzurro quarto ventricolo e acquedotto.',
    instruction: 'SCEGLI UNA COLONNA',
    view: { yaw: -2.65, zoom: 1.12 },
    mode: focused(BRAINSTEM, 2.05, 0.33, selector({
      base: [...UPPER, 'collSup', 'collInf', ...NET],
      idle: 'Dalla linea mediana verso il lato: rafe (giallo), colonna mediale (rosso), colonna laterale.',
      pick: Object.fromEntries([...RAPHE.map((id) => [id, 0]), ...MEDIAL.map((id) => [id, 1]), ...LATERAL.map((id) => [id, 2]), ...PRECB.map((id) => [id, 3])]),
      options: [
        {
          label: 'Mediana', lit: RAPHE,
          labels: { rObs: 'gruppo caudale', rDor: 'gruppo rostrale' },
          info: 'Nuclei del rafe, sulla linea mediana: un gruppo caudale in bulbo e ponte, uno rostrale in ponte e mesencefalo.',
        },
        {
          label: 'Mediale', lit: MEDIAL,
          labels: { gigBulb: 'giganto-cellulare bulbare', gigPont: 'giganto-cellulare pontino', pprf: 'PPRF', cun: 'cuneiforme' },
          info: 'Neuroni magnocellulari, glutammato e GABA; in basso continua nel nucleo reticolare del midollo.',
        },
        {
          label: 'Laterale', lit: LATERAL, show: ['red'],
          labels: { parv: 'area parvicellulare', lc: 'banda interna', a5: 'banda esterna', snc: 'porzione mesencefalica' },
          info: 'Area parvicellulare, banda interna dorsale (fino al locus coeruleus), banda esterna ventrale, nuclei del mesencefalo.',
        },
        {
          label: 'Pre-cerebellari', lit: PRECB, show: ['cerebellum', 'scp'], links: ['lrnCb', 'pmCb', 'rtnCb'],
          labels: { lrn: 'reticolare laterale', pmrn: 'paramediano', rtn: 'calotta pontina' },
          info: 'Nucleo paramediano, nucleo della calotta pontina e nucleo reticolare laterale proiettano al cervelletto.',
        },
      ],
    })),
  },
  {
    title: 'Nuclei e neurotrasmettitori',
    body:
      "Dahlström e Fuxe osservarono che le monoammine, fissate in formaldeide, emettono fluorescenza: gialla la serotonina, verde adrenalina e noradrenalina. Di qui i nuclei B serotoninergici, A noradrenergici e C adrenergici. I {nuclei del rafe|raphe} hanno un {gruppo caudale|rc}, che proietta a midollo e tronco, e un {gruppo rostrale|rr}, diretto a diencefalo e telencefalo. Il {locus coeruleus|lc}, o A6, azzurro per i granuli di melanina, è inibito nel sonno REM e si attiva nello stress. Accanto sta il {nucleo peduncolo-pontino|ppn}, colinergico. Nel tegmento mesencefalico tre nuclei dopaminergici: {A8|a8}, {sostanza nera|sn} e {area ventro-tegmentale|vta}.",
    terms: {
      raphe: RAPHE, rc: RAPHE_C, rr: RAPHE_R, lc: ['lc'], ppn: ['ppn'], a8: ['a8'], sn: ['snc', 'snr'], vta: ['vta'],
    },
    quiz: {
      question: 'Quale di questi nuclei è noradrenergico?',
      options: ['Il nucleo del rafe magno', 'Il locus coeruleus', 'Il nucleo peduncolo-pontino', "L'area ventro-tegmentale"],
      correct: 1,
      explain: 'È il nucleo A6; il rafe è serotoninergico, il peduncolo-pontino colinergico, la ventro-tegmentale dopaminergica.',
    },
    caption: 'I nuclei ricostruiti nel tronco reale; le sigle sono quelle della classificazione di Dahlström e Fuxe.',
    instruction: 'SCEGLI UN NEUROTRASMETTITORE',
    view: { yaw: -2.25, zoom: 1.12 },
    mode: focused(BRAINSTEM, 2.05, 0.33, selector({
      base: [...UPPER, 'collSup', 'collInf', 'red', ...RAPHE, ...INNER, ...OUTER, ...DOPA],
      idle: 'Giallo: serotonina. Verde e azzurro: noradrenalina. Viola: acetilcolina. Scuro e magenta: dopamina.',
      pick: {
        ...Object.fromEntries(RAPHE.map((id) => [id, 0])), lc: 1, a1: 1, a2: 1, a5: 1, a7: 1, ppn: 2, ldt: 2,
        a8: 3, snc: 3, snr: 3, vta: 3, postrema: 3,
      },
      options: [
        {
          label: 'Serotonina', lit: RAPHE,
          labels: { rPal: 'B1', rObs: 'B2', rMag: 'B3', rPon: 'B5', rCen: 'B6', rTeg: 'B7', rDor: 'B8-B9' },
          info: 'Gruppo caudale (B1-B3): dolore e funzioni vegetative. Gruppo rostrale (B5-B9): sonno-veglia, cognizione, emozioni.',
        },
        {
          label: 'Noradrenalina', lit: ['lc', 'a1', 'a2', 'a5', 'a7'],
          labels: { lc: 'A6', a1: 'A1/C1', a2: 'A2/C2', a5: 'A5', a7: 'A7' },
          info: 'Banda interna: A2/C2 e locus coeruleus (A6). Banda esterna: A1/C1, A5 e A7. I nuclei C sono adrenergici.',
        },
        {
          label: 'Acetilcolina', lit: ['ppn', 'ldt'], labels: { ppn: 'Ch5', ldt: 'Ch6' },
          info: "Peduncolo-pontino (Ch5) e area tegmentale laterale dorsale (Ch6); dove si sovrappongono, l'area X di Sakai.",
        },
        {
          label: 'Dopamina', lit: [...DOPA, 'postrema'], show: ['peduncle'],
          labels: { a8: 'A8', snc: 'A9', vta: 'A10', postrema: 'area postrema' },
          info: "A8, sostanza nera (A9) e area ventro-tegmentale (A10), del rinforzo positivo; dopaminergica anche l'area postrema.",
        },
        {
          label: 'Sonno REM', lit: ['ppn', 'lc'], links: ['ppnLc', 'lcPpn'], activity: { ppn: 1, lc: -1 },
          labels: { ppn: 'REM-on', lc: 'REM-off' },
          info: 'I neuroni REM-on del peduncolo-pontino, tramite interneuroni inibitori, spengono i REM-off del locus coeruleus.',
        },
      ],
    })),
  },
  {
    title: 'Movimento e tono: le vie reticolo-spinali',
    body:
      "Due vie discendenti controllano il movimento. La {via reticolo-spinale pontina|rsp}, di fibre non crociate, fa parte dei sistemi discendenti mediali ed eccita i motoneuroni degli arti. La {via reticolo-spinale bulbare|rsb}, di fibre crociate e non crociate, fa parte dei sistemi laterali e inibisce i motoneuroni assiali: origina dalla pars alpha del giganto-cellulare, il {centro inibitore di Magoun|magoun}. Lo eccitano il {nucleo peduncolo-pontino|ppn}, inibito a sua volta dalla {pars reticulata della sostanza nera|snr}, e i collaterali della via cortico-reticolo-spinale. Se questa è lesa, come nella decerebrazione, cade il tono inibitorio sui {motoneuroni|moto} alfa e gamma: ipertono.",
    terms: {
      rsp: ['gigPont'], rsb: ['magoun'], magoun: ['magoun'], ppn: ['ppn'], snr: ['snr'], moto: ['antHorn'],
    },
    quiz: {
      question: 'Che effetto ha la via reticolo-spinale bulbare?',
      options: [
        'Eccita i motoneuroni degli arti',
        'Inibisce i motoneuroni assiali',
        'Eccita il centro inibitore di Magoun',
        'Inibisce il nucleo peduncolo-pontino',
      ],
      correct: 1,
      explain: 'Origina dal centro inibitore di Magoun; la via pontina, non crociata, è invece eccitatoria.',
    },
    caption: 'Tronco e midollo cervicale reali, dal davanti e da destra; in rosso scuro le corna anteriori del midollo.',
    instruction: 'SEGUI UNA VIA, POI PROVA LA LESIONE',
    view: { yaw: 0.55, zoom: 1.15 },
    mode: focused([0, 0.25, -0.03], 1.55, 0.37, selector({
      base: [...STEM, 'antHorn', 'postHorn', 'gigBulb', 'magoun', 'gigPont', 'pprf', 'rMag', 'ppn', 'lc', 'snr', 'snc'],
      idle: 'Verde: eccitazione. Rosso: inibizione. Le frecce uniscono origine e bersaglio.',
      pick: { gigPont: 0, magoun: 1, ppn: 2, snr: 2, rMag: 3 },
      options: [
        {
          label: 'Via pontina', lit: ['gigPont', 'pprf', 'antHorn'], links: ['rsPont'], activity: { antHorn: 1 },
          info: 'Fibre non crociate, nei sistemi discendenti mediali: eccitano i motoneuroni degli arti.',
        },
        {
          label: 'Via bulbare', lit: ['magoun', 'antHorn'], links: ['rsBulb', 'rsBulbX'], activity: { antHorn: -1 },
          info: 'Dal centro inibitore di Magoun, fibre crociate e non crociate: inibiscono i motoneuroni assiali.',
        },
        {
          label: 'Chi regola Magoun', lit: ['magoun', 'ppn', 'snr', 'lc'], show: ['peduncle'],
          links: ['corRet', 'ppnMag', 'snrPpn', 'ppnLc', 'lcPpn'], activity: { magoun: 1 },
          info: 'Verde: collaterali cortico-reticolo-spinali. Viola: peduncolo-pontino, frenato da pars reticulata e locus coeruleus.',
        },
        {
          label: 'Rafe-spinale', lit: ['rMag', 'postHorn'], links: both('rapheSp'),
          info: 'Dal nucleo del rafe magno al midollo: controllo della sensibilità dolorifica.',
        },
        {
          label: 'Decerebrazione', lit: ['cut', 'antHorn', 'gigPont'], show: ['cut'], dead: ['magoun'], links: ['rsPont'],
          activity: { magoun: -1, antHorn: 1 },
          info: 'Magoun perde la sua eccitazione: cade il tono inibitorio e i motoneuroni gamma sostengono gli alfa. Ipertono.',
        },
      ],
    })),
  },
];

export default {
  id: 'formazione-reticolare',
  title: 'Formazione reticolare',
  blurb: 'La rete di nuclei del tronco encefalico: tre colonne, i loro neurotrasmettitori, veglia e tono muscolare.',
  part: 'Vie e tronco encefalico',
  order: 22,
  model: 'formazione-reticolare',
  createModel: () => new ReticularModel(),
  yaw: -1.0,
  spreads,
};
