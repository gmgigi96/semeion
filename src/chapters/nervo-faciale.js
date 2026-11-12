// Capitolo "Nervo faciale". Testi dagli appunti di neuroanatomia (Nervo faciale).
import { selector } from '../modes.js';
import { NervoFaciale } from '../models/nervo-faciale.js';

const CANAL = ['fnMeat', 'fnLab', 'fnTymp', 'fnMast'];
const NERVE = ['fnPons', 'fnCist', ...CANAL, 'fnTrunk', 'tempFac', 'cervFac'];
const STEM = ['pons', 'medulla', 'medullaLow', 'midbrain'];
const SKULL = ['skullR', 'skullL'];
const FACE_R = ['mUpR', 'mLowR'];
const FACE = [...FACE_R, 'mUpL', 'mLowL'];
const NUCLEI = ['nucMotUp', 'nucMotLow', 'nucLac', 'nucSal', 'nucSol'];
const SALIVARY = ['submandibular', 'sublingual'];
const TONGUE = ['tongueAnt', 'tonguePost'];
const EXTRA = ['nAur', 'nDig', 'nStyl'];
const YELLOW = 0xe6bd2e;
// fuori dalla pagina del canale il nervo ha un solo colore
const PLAIN = Object.fromEntries(NERVE.map((id) => [id, { color: YELLOW }]));

// Primo piano: all'ingresso nella pagina il modello viene ingrandito attorno a un punto (mm Z-Anatomy).
const closeUp = (center, scale, height, mode) => async (ctx) => {
  const api = await mode(ctx);
  return { ...api, enter() { api.enter(); ctx.model.focus(center, scale, height); } };
};

// lesioni: ciò che sta a valle del punto interrotto
const D_FACE = ['fnTrunk', 'tempFac', 'cervFac', ...FACE_R, 'digastric', 'stylohyoid', ...EXTRA];
const D_CHORDA = ['chorda', 'smg', 'tongueAnt', ...SALIVARY];
const D_STAP = ['nStap', 'stapedius'];
const D_PETR = ['geniculate', 'petroso', 'ppg', 'lacrimal'];

const spreads = [
  {
    title: 'Un nervo misto, tre componenti',
    body:
      "Il {nervo faciale|vii} (VII) è un nervo misto, con tre componenti principali. La componente motoria innerva la {muscolatura mimica del volto|mimici}, il {muscolo stapedio|stapedius} e il {ventre posteriore del muscolo digastrico|digastric}. La componente sensitivo-sensoriale è trasportata dalla {corda del timpano|chorda}, che veicola le fibre gustative per i {due terzi anteriori della lingua|tongue}. La componente autonomica è trasportata dal {nervo intermedio di Wrisberg|intermedio}, che veicola le fibre dirette alle {ghiandole lacrimali|lacrimal} e {salivari|salivary}.",
    terms: {
      vii: [...NERVE, 'fnLeft'], mimici: FACE, stapedius: ['stapedius'], digastric: ['digastric'], chorda: ['chorda'],
      tongue: ['tongueAnt'], intermedio: ['intermedio'], lacrimal: ['lacrimal'], salivary: SALIVARY,
    },
    quiz: {
      question: 'Quale struttura trasporta la componente autonomica del nervo faciale?',
      options: ['La branca temporo-faciale', 'Il nervo intermedio di Wrisberg', 'Il nervo stapedio', 'Il nervo per il digastrico'],
      correct: 1,
      explain: "Il nervo intermedio veicola le fibre dirette alle ghiandole lacrimali e salivari.",
    },
    caption: 'Nervo faciale, muscoli mimici, ghiandole e lingua reali (mesh Z-Anatomy) in un cranio trasparente.',
    instruction: 'SCEGLI UNA COMPONENTE · TRASCINA IL MODELLO PER RUOTARLO',
    mode: selector({
      base: [...SKULL, ...STEM, ...NERVE, 'fnLeft', ...FACE, 'digastric', 'lacrimal', ...SALIVARY, ...TONGUE, 'chorda', 'lingual', 'petroso', 'ppg', 'smg', 'geniculate'],
      // muscoli in trasparenza: lasciano vedere nervo, ghiandole e lingua
      looks: { ...PLAIN, ...Object.fromEntries(FACE.map((id) => [id, { opacity: 0.4, litOpacity: 1 }])) },
      idle: 'Giallo: il nervo faciale dei due lati, dal ponte ai muscoli mimici.',
      options: [
        { label: 'Motoria', lit: [...NERVE, 'fnLeft', ...FACE, 'digastric', 'stapedius'], info: 'Muscolatura mimica del volto, muscolo stapedio e ventre posteriore del muscolo digastrico.' },
        { label: 'Gustativa', lit: ['chorda', 'tongueAnt'], info: 'La corda del timpano veicola le fibre gustative dei due terzi anteriori della lingua, che raggiunge con il nervo linguale.' },
        { label: 'Autonomica', lit: ['intermedio', 'petroso', 'ppg', 'lacrimal', 'chorda', 'smg', ...SALIVARY], links: ['lacrime', 'salivaSm', 'salivaSl'], info: 'Dal nervo intermedio: fibre per la ghiandola lacrimale (grande petroso) e per le ghiandole salivari (corda del timpano).' },
      ],
    }),
  },
  {
    title: 'I nuclei del faciale',
    body:
      "Il {nucleo motore del faciale|mot} è diviso in due porzioni. La {superiore|up} controlla la parte superiore del viso (muscoli frontale, orbicolare dell'occhio e corrugatore del sopracciglio) e riceve fibre piramidali sia omolaterali che controlaterali; l'{inferiore|low} controlla la parte inferiore (buccinatore, risorio, orbicolare delle labbra) e riceve solo fibre controlaterali. Il {nucleo lacrimatorio|lac} ha il proprio ganglio nel ganglio sfeno-palatino, il {nucleo salivatorio superiore|sal} nel ganglio sottomandibolare. Il {nucleo del tratto solitario|sol} è il nucleo sensitivo.",
    terms: { mot: ['nucMotUp', 'nucMotLow'], up: ['nucMotUp'], low: ['nucMotLow'], lac: ['nucLac'], sal: ['nucSal'], sol: ['nucSol'] },
    quiz: {
      question: 'Quale porzione del nucleo motore riceve solo fibre piramidali controlaterali?',
      options: ['La porzione superiore', 'La porzione inferiore', 'Entrambe', 'Nessuna delle due'],
      correct: 1,
      explain: 'La porzione superiore riceve invece fibre piramidali omolaterali e controlaterali.',
    },
    caption: 'Ponte e bulbo in trasparenza, ingranditi: i nuclei sono piccoli quanto nella realtà.',
    instruction: 'SCEGLI UN NUCLEO (ANCHE CLICCANDOLO) E RUOTA IL TRONCO ENCEFALICO',
    view: { yaw: 0.5 },
    mode: closeUp([0, 12, 1580], 6.5, 0.4, selector({
      base: ['pons', 'medulla', ...NUCLEI, 'nucVI', 'fnPons', 'fnCist', 'radiceInt'],
      looks: PLAIN,
      pick: { nucMotUp: 0, nucMotLow: 1, nucLac: 2, nucSal: 3, nucSol: 4 },
      idle: 'Nel tegmento del ponte: le fibre motorie girano attorno al nucleo dell’abducente (grigio) prima di uscire.',
      options: [
        { label: 'Motore superiore', lit: ['nucMotUp'], links: ['cbRupR', 'cbRupL', 'cbLupL', 'cbLupR'], info: 'Frontale, orbicolare dell’occhio, corrugatore del sopracciglio. Fibre piramidali omolaterali e controlaterali.' },
        { label: 'Motore inferiore', lit: ['nucMotLow'], links: ['cbRlowL', 'cbLlowR'], info: 'Buccinatore, risorio, orbicolare delle labbra. Solo fibre piramidali controlaterali.' },
        { label: 'Lacrimatorio', lit: ['nucLac', 'radiceInt'], info: 'Nucleo lacrimatorio dello Yagita, parasimpatico: ganglio sfeno-palatino, poi ghiandole lacrimale, nasali e palatine.' },
        { label: 'Salivatorio superiore', lit: ['nucSal', 'radiceInt'], info: 'Parasimpatico: ganglio sottomandibolare, poi ghiandole sottomandibolare, sottolinguale e salivari minori della lingua.' },
        { label: 'Tratto solitario', lit: ['nucSol', 'radiceInt'], links: ['gustoIn'], info: 'Nucleo sensitivo: padiglione auricolare, meato acustico esterno e membrana del timpano.' },
      ],
    })),
  },
  {
    title: 'Nel canale di Falloppio',
    body:
      "Il nervo emerge tra bulbo e ponte con due radici, il {faciale propriamente detto|cist} e il {nervo intermedio|intermedio}, e attraversa l'angolo ponto-cerebellare insieme al {nervo vestibolo-cocleare|viii}. Entra poi nel canale del faciale, scavato nella {rocca petrosa|petrous}. Il {tratto labirintico|lab} decorre tra {chiocciola|cochlea} e {vestibolo|labyrinth}, perpendicolare alla rocca, fino al ginocchio dove si trova il {ganglio genicolato|geniculate}. Il {tratto timpanico|tymp} si porta indietro e lateralmente, sopra la cassa del timpano. Dopo un secondo ginocchio il {tratto mastoideo|mast} scende fino al foro stilo-mastoideo.",
    terms: {
      cist: ['fnCist'], intermedio: ['intermedio'], viii: ['viii'], petrous: ['petrous'], lab: ['fnLab'], cochlea: ['cochlea'],
      labyrinth: ['labyrinth'], geniculate: ['geniculate'], tymp: ['fnTymp'], mast: ['fnMast'],
    },
    quiz: {
      question: 'Dove si trova il ganglio genicolato?',
      options: ["Nell'angolo ponto-cerebellare", 'Al ginocchio tra tratto labirintico e tratto timpanico', 'Al ginocchio esterno, tra tratto timpanico e mastoideo', 'Al foro stilo-mastoideo'],
      correct: 1,
      explain: 'È il ganglio sensitivo del faciale: da questo punto nasce il nervo grande petroso superficiale.',
    },
    caption: 'La rocca destra ingrandita: nervo, orecchio interno e ossicini sono mesh reali nei loro rapporti.',
    instruction: 'SEGUI IL DECORSO O ISOLA UN TRATTO (ANCHE CLICCANDOLO)',
    view: { yaw: 0.9 },
    mode: closeUp([33, 3, 1573], 5.2, 0.3, selector({
      base: ['petrous', 'fnPons', 'fnCist', ...CANAL, 'fnTrunk', 'intermedio', 'geniculate', 'viii', 'cochlea', 'labyrinth', 'ossicles', 'stapes', 'tympanic', 'gspn', 'chorda', 'stapedius', 'nStap'],
      looks: { fnPons: { color: YELLOW }, fnTrunk: { color: YELLOW } },
      pick: { fnCist: 1, fnMeat: 1, intermedio: 1, viii: 1, fnLab: 2, geniculate: 2, fnTymp: 3, fnMast: 4 },
      idle: 'Arancio: tratto labirintico. Rosso: timpanico. Viola: mastoideo. Il canale è lungo circa 3 cm.',
      options: [
        {
          label: 'Decorso', stepTime: 1.9,
          steps: [
            { ids: ['fnCist', 'intermedio', 'viii'], text: 'Angolo ponto-cerebellare: due radici e pacchetto acustico-faciale' },
            { ids: ['fnMeat'], text: 'Meato acustico interno: nell’area faciale si apre il canale' },
            { ids: ['fnLab', 'cochlea', 'labyrinth'], text: 'Tratto labirintico, tra chiocciola e vestibolo' },
            { ids: ['geniculate', 'gspn'], text: 'Ginocchio a 90° e ganglio genicolato: nasce il grande petroso' },
            { ids: ['fnTymp'], text: 'Tratto timpanico, sopra la cassa del timpano' },
            { ids: ['fnMast', 'chorda', 'nStap'], text: 'Ginocchio esterno e tratto mastoideo: corda del timpano e nervo stapedio' },
            { ids: ['fnTrunk'], text: 'Foro stilo-mastoideo: il nervo lascia il cranio' },
          ],
        },
        { label: 'Angolo ponto-cerebellare', lit: ['fnCist', 'fnMeat', 'intermedio', 'viii'], info: 'Faciale propriamente detto (motorio) e nervo intermedio, con il vestibolo-cocleare e l’arteria uditiva interna.' },
        { label: 'Labirintico', lit: ['fnLab', 'geniculate', 'cochlea', 'labyrinth', 'gspn'], info: 'Tra chiocciola (davanti) e vestibolo (dietro), perpendicolare alla rocca; al ginocchio il ganglio genicolato.' },
        { label: 'Timpanico', lit: ['fnTymp', 'ossicles', 'stapes'], info: 'Dal ganglio genicolato indietro e lateralmente, parallelo alla rocca, sopra la cassa del timpano.' },
        { label: 'Mastoideo', lit: ['fnMast', 'chorda', 'nStap', 'stapedius'], info: 'Dal ginocchio esterno in basso, lungo la parete posteriore della cassa, fino al foro stilo-mastoideo.' },
      ],
    })),
  },
  {
    title: 'I rami collaterali',
    body:
      "I rami intrapetrosi sono tre. Il {nervo grande petroso superficiale|petroso}, che nasce al ganglio genicolato, è destinato alla {ghiandola lacrimale|lacrimal}. Dal tratto mastoideo nascono il {nervo stapedio|nstap}, per il {muscolo stapedio|stapedius}, e la {corda del timpano|chorda}, che innerva i due terzi anteriori della {lingua|tongue} e porta fibre parasimpatiche alle ghiandole {sottomandibolare|subm} e {sottolinguale|subl}. I rami extrapetrosi nascono fuori dal cranio, prima della loggia parotidea: {nervo per il digastrico|ndig}, {nervo per lo stiloioideo|nstyl} e {nervo auricolare posteriore|naur}.",
    terms: {
      petroso: ['petroso'], lacrimal: ['lacrimal'], nstap: ['nStap'], stapedius: ['stapedius'], chorda: ['chorda'], tongue: ['tongueAnt'],
      subm: ['submandibular'], subl: ['sublingual'], ndig: ['nDig', 'digastric'], nstyl: ['nStyl', 'stylohyoid'], naur: ['nAur'],
    },
    quiz: {
      question: 'Quale di questi rami nasce fuori dalla rocca petrosa?',
      options: ['Il nervo grande petroso superficiale', 'Il nervo stapedio', 'La corda del timpano', 'Il nervo auricolare posteriore'],
      correct: 3,
      explain: 'È un ramo extrapetroso, come i nervi per il digastrico e per lo stiloioideo.',
    },
    caption: 'Metà destra del cranio. Blu: fibre parasimpatiche. Verde: corda del timpano. Arancio: rami extrapetrosi.',
    instruction: 'SCEGLI UN RAMO E SEGUILO FINO AL SUO BERSAGLIO',
    view: { yaw: -2.0 },
    mode: closeUp([30, -25, 1556], 1.7, 0.3, selector({
      base: ['skullR', ...NERVE.slice(1), 'geniculate', 'petroso', 'ppg', 'lacrimal', 'ossicles', 'stapes', 'stapedius', 'nStap', 'chorda', 'lingual', 'smg',
        ...SALIVARY, ...TONGUE, 'digastric', 'stylohyoid', ...EXTRA],
      looks: { ...PLAIN, skullR: { opacity: 0.07 } },
      pick: { petroso: 0, ppg: 0, lacrimal: 0, stapedius: 1, nStap: 1, chorda: 2, tongueAnt: 2, submandibular: 2, sublingual: 2, nAur: 3, nDig: 3, nStyl: 3 },
      idle: 'Tre rami dentro la rocca, tre appena fuori dal foro stilo-mastoideo.',
      options: [
        { label: 'Grande petroso', lit: ['geniculate', 'petroso', 'ppg', 'lacrimal'], show: ['maxillary'], links: ['lacrime'], info: 'Dal ganglio genicolato al ganglio sfeno-palatino; da qui le fibre raggiungono la ghiandola lacrimale.' },
        { label: 'Nervo stapedio', lit: ['nStap', 'stapedius', 'stapes'], labels: { stapes: 'staffa e muscolo stapedio' }, info: 'Nasce dal tratto mastoideo e raggiunge il muscolo stapedio, che si inserisce sulla staffa.' },
        { label: 'Corda del timpano', lit: ['chorda', 'lingual', 'tongueAnt', 'smg', ...SALIVARY], links: ['salivaSm', 'salivaSl'], info: 'Dal tratto mastoideo attraversa la cassa del timpano: gusto dei 2/3 anteriori della lingua, secrezione di sottomandibolare e sottolinguale.' },
        { label: 'Rami extrapetrosi', lit: [...EXTRA, 'digastric', 'stylohyoid', 'occipitalis'], info: 'Ventre posteriore del digastrico, muscolo stiloioideo, muscoli intrinseci ed estrinseci del padiglione auricolare.' },
      ],
    })),
  },
  {
    title: 'Dove si è interrotto?',
    body:
      "Uscito dal foro stilo-mastoideo, il {tronco|trunk} perfora la loggia parotidea ed entra nella {parotide|parotid}, dove si divide nella {branca temporo-faciale|temp} e nella {branca cervico-faciale|cerv}, per i muscoli mimici. Una lesione spegne ciò che sta a valle: più è prossimale, più funzioni coinvolge. Poiché la porzione superiore del nucleo motore riceve fibre piramidali dei due lati, una lesione sopra il nucleo risparmia i {muscoli della fronte e dell'occhio|up}; una lesione del nervo paralizza {metà del viso|half}. Interrompi il nervo e osserva che cosa si spegne.",
    terms: { trunk: ['fnTrunk'], parotid: ['parotid'], temp: ['tempFac'], cerv: ['cervFac'], up: ['mUpR', 'mUpL'], half: FACE_R },
    quiz: {
      question: 'Un paziente non muove la metà inferiore sinistra del viso, ma corruga la fronte dai due lati. Dove è la lesione?',
      options: ['Nel nervo faciale sinistro', 'Sopra il nucleo, nelle fibre piramidali di destra', 'Al foro stilo-mastoideo destro', 'Nella corda del timpano sinistra'],
      correct: 1,
      explain: 'La porzione inferiore del nucleo riceve solo fibre controlaterali; la superiore anche omolaterali.',
    },
    caption: 'Anello rosso: punto della lesione. Le strutture a valle si scuriscono.',
    instruction: 'SCEGLI IL PUNTO DELLA LESIONE, DALLA CORTECCIA AL FORO STILO-MASTOIDEO',
    view: { yaw: -0.25 },
    mode: selector({
      base: [...SKULL, ...STEM, ...NERVE, 'fnLeft', ...FACE, 'digastric', 'stylohyoid', 'parotid', 'lacrimal', ...SALIVARY, ...TONGUE, 'chorda', 'lingual',
        'petroso', 'ppg', 'smg', 'geniculate', 'stapedius', 'nStap', ...EXTRA],
      looks: PLAIN,
      pick: { cutCortex: 0, fnCist: 1, fnMeat: 1, fnLab: 1, cutMeat: 1, fnTymp: 2, cutTymp: 2, fnMast: 3, cutMast: 3, fnTrunk: 4, cutForamen: 4 },
      idle: 'Nessuna lesione: il nervo conduce in tutti i suoi rami.',
      options: [
        { label: 'Sopra il nucleo', show: ['cutCortex'], dead: ['mLowL'], info: 'Fibre piramidali di destra: si paralizza solo la metà inferiore sinistra del viso; fronte e occhio sono risparmiati.' },
        { label: 'Meato acustico', show: ['cutMeat'], dead: ['fnLab', 'fnTymp', 'fnMast', ...D_PETR, ...D_STAP, ...D_CHORDA, ...D_FACE], info: 'Si perde tutto a destra: lacrimazione, muscolo stapedio, gusto e salivazione, muscoli mimici.' },
        { label: 'Tratto timpanico', show: ['cutTymp'], dead: ['fnMast', ...D_STAP, ...D_CHORDA, ...D_FACE], info: 'Sotto il ganglio genicolato: la lacrimazione è conservata; si perdono stapedio, gusto, salivazione e mimica.' },
        { label: 'Tratto mastoideo', show: ['cutMast'], dead: [...D_CHORDA, ...D_FACE], info: 'Sotto il nervo stapedio: si perdono gusto dei 2/3 anteriori, salivazione e mimica di destra.' },
        { label: 'Foro stilo-mastoideo', show: ['cutForamen'], dead: D_FACE, info: 'Solo deficit motorio: tutta la metà destra del viso, fronte compresa, con digastrico e stiloioideo.' },
      ],
    }),
  },
];

export default {
  id: 'nervo-faciale',
  title: 'Nervo faciale',
  blurb: 'Nuclei, canale di Falloppio, rami collaterali e lesioni del VII nervo cranico.',
  part: 'Nervi cranici',
  order: 42,
  model: 'nervo-faciale',
  createModel: () => new NervoFaciale(),
  zoom: 1,
  yaw: -0.6,
  spreads,
};
