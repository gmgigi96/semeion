// Capitolo "Nervo glossofaringeo". Testi dagli appunti di neuroanatomia (Nervo glossofaringeo).
import { selector } from '../modes.js';
import { NervoGlossofaringeo } from '../models/nervo-glossofaringeo.js';

const TRUNK = ['ixCist', 'ixFor', 'ixNeck'];
const NERVE = ['ixBulb', ...TRUNK];
const STEM = ['pons', 'medulla', 'midbrain'];
const SKULL = ['skullR', 'skullL', 'petrous'];
const NUCLEI = ['nucAmb', 'nucSal', 'nucSol', 'nucGust', 'nucSpV'];
const GANGLIA = ['gSup', 'gInf'];
const VESSELS = ['cca', 'sinus', 'ica', 'eca'];
const PHARYNX = ['constrSup', 'constrLow'];
const TONGUE = ['tongueAnt', 'tonguePost'];
const BRANCHES = ['nHering', 'rStylo', 'rFar', 'rTons', 'rLing'];
const PAROTID_WAY = ['nTymp', 'plesso', 'lpn', 'otic'];
const EAR = ['cochlea', 'ossicles', 'tympanic'];
// faringe e lingua in trasparenza: lasciano vedere i rami che vi arrivano
const SOFT = {
  constrSup: { opacity: 0.45, litOpacity: 0.85 }, constrLow: { opacity: 0.3 }, nasopharynx: { opacity: 0.5, litOpacity: 0.9 },
  tongueAnt: { opacity: 0.45 }, tonguePost: { opacity: 0.6, litOpacity: 0.85 },
  parotid: { opacity: 0.55, litOpacity: 0.8 }, parotidLow: { opacity: 0.55, litOpacity: 0.8 },
};

// Primo piano: all'ingresso nella pagina il modello viene ingrandito attorno a un punto (mm Z-Anatomy).
const closeUp = (center, scale, height, mode) => async (ctx) => {
  const api = await mode(ctx);
  return { ...api, enter() { api.enter(); ctx.model.focus(center, scale, height); } };
};

const spreads = [
  {
    title: 'Un nervo misto, cinque componenti',
    body:
      "Il {nervo glossofaringeo|ix} (IX) è un nervo misto, con cinque tipi di fibre. Le fibre motorie branchiali sono per la muscolatura striata del terzo arco: il muscolo {stilofaringeo|stylo} e i fasci più interni del {costrittore superiore della faringe|constr}. Le fibre parasimpatiche provengono dal {nucleo salivatorio inferiore|sal}. Le fibre sensitive somatiche fanno capo al {ganglio giugulare|gsup}; le fibre sensitive viscerali e le viscerali speciali gustative fanno capo al {ganglio petroso|ginf}.",
    terms: { ix: TRUNK, stylo: ['stylo'], constr: ['constrSup'], sal: ['nucSal'], gsup: ['gSup'], ginf: ['gInf'] },
    quiz: {
      question: 'A quale ganglio fanno capo le fibre gustative del glossofaringeo?',
      options: ['Al ganglio giugulare (superiore)', 'Al ganglio petroso (inferiore)', 'Al ganglio otico', 'Al ganglio genicolato'],
      correct: 1,
      explain: 'Al ganglio petroso fanno capo sia le fibre sensitive viscerali sia quelle gustative; al giugulare le somatiche.',
    },
    caption: 'Lato destro: nervo, vasi, muscoli, lingua e parotide sono mesh reali (Z-Anatomy); il tratto nel collo è ricostruito.',
    instruction: 'SCEGLI UNA COMPONENTE · TRASCINA IL MODELLO PER RUOTARLO',
    mode: closeUp([14, -8, 1550], 1.5, 0.36, selector({
      base: [...SKULL, ...STEM, ...NERVE, ...GANGLIA, ...NUCLEI, ...VESSELS, 'ijv', 'stylo', ...PHARYNX, ...TONGUE, 'tonsil', 'parotid', 'parotidLow', 'hyoid',
        ...BRANCHES, ...PAROTID_WAY, 'atn', 'tympanic'],
      looks: SOFT,
      idle: 'Giallo: il nervo glossofaringeo di destra, dal bulbo alla radice della lingua.',
      options: [
        { label: 'Motoria branchiale', lit: ['nucAmb', ...NERVE, 'rStylo', 'stylo', 'constrSup'], info: 'Muscolatura striata del terzo arco branchiale: stilofaringeo e fasci più interni del costrittore superiore della faringe.' },
        { label: 'Parasimpatica', lit: ['nucSal', 'ixBulb', 'ixCist', 'ixFor', ...PAROTID_WAY, 'atn', 'parotid', 'parotidLow'], links: ['postgang'], info: 'Dal nucleo salivatorio inferiore: nervo timpanico, piccolo petroso, ganglio otico, parotide.' },
        { label: 'Sensitiva somatica', lit: ['gSup', 'ixCist', 'ixBulb', 'nucSpV', 'tympanic'], info: 'Ganglio giugulare (superiore): meato acustico esterno, parte del padiglione, superficie esterna della membrana del timpano.' },
        { label: 'Sensitiva viscerale', lit: ['gInf', 'ixFor', 'ixCist', 'ixBulb', 'ixNeck', 'nucSol', 'nHering', 'sinus', 'glomo', 'rFar', 'nasopharynx', 'rTons', 'tonsil', 'nTymp'], info: 'Ganglio petroso (inferiore): istmo delle fauci, rinofaringe, cassa del timpano e tuba, glomo e seno carotideo.' },
        { label: 'Gustativa', lit: ['gInf', ...NERVE, 'nucGust', 'rLing', 'tonguePost'], info: 'Ganglio petroso: calici gustativi delle papille vallate e foliate e delle vallecule glosso-epiglottiche.' },
      ],
    })),
  },
  {
    title: 'I nuclei nel bulbo',
    body:
      "I nuclei principali sono quattro. Il {nucleo ambiguo|amb}, condiviso con il vago, è il nucleo della componente motoria branchiale. Il {nucleo salivatorio inferiore|sal} è il nucleo parasimpatico per la parotide e le ghiandole geniene e labiali superiori, con effetto vasodilatatore ed eccito-secretorio. Al {nucleo del tratto solitario|sol} giunge la sensibilità viscerale di istmo delle fauci, rinofaringe, cassa del timpano e tuba uditiva, del glomo e del seno carotideo; nella sua porzione rostrale, il {nucleo gustativo|gust}, giunge il gusto. Il {nucleo della radice discendente del trigemino|spv} riceve la sensibilità somatica di meato acustico esterno, padiglione e membrana del timpano.",
    terms: { amb: ['nucAmb'], sal: ['nucSal'], sol: ['nucSol', 'nucGust'], gust: ['nucGust'], spv: ['nucSpV'] },
    quiz: {
      question: 'Quale nucleo, condiviso con il vago, dà la componente motoria branchiale del glossofaringeo?',
      options: ['Il nucleo salivatorio inferiore', 'Il nucleo del tratto solitario', 'Il nucleo ambiguo', 'Il nucleo della radice discendente del trigemino'],
      correct: 2,
      explain: 'Dal nucleo ambiguo nascono le fibre per lo stilofaringeo e i fasci interni del costrittore superiore.',
    },
    caption: 'Bulbo e ponte in trasparenza, ingranditi. Nuclei e fibre radicolari sono quelli, schematici, di Z-Anatomy.',
    instruction: 'SCEGLI UN NUCLEO (ANCHE CLICCANDOLO) E RUOTA IL TRONCO ENCEFALICO',
    view: { yaw: 0.45 },
    mode: closeUp([0, 18, 1570], 4.8, 0.42, selector({
      base: ['pons', 'medulla', ...NUCLEI, 'ixBulb', 'ixCist'],
      pick: { nucAmb: 0, nucSal: 1, nucSol: 2, nucGust: 3, nucSpV: 4 },
      idle: 'Le fibre radicolari (ocra) lasciano il bulbo dal solco dei nervi misti, dietro l’oliva.',
      options: [
        { label: 'Ambiguo', lit: ['nucAmb', 'ixBulb'], info: 'Motore branchiale, condiviso con il vago: stilofaringeo e fasci interni del costrittore superiore della faringe.' },
        { label: 'Salivatorio inferiore', lit: ['nucSal', 'ixBulb'], info: 'Parasimpatico: parotide, ghiandole geniene e labiali superiori; anche ghiandole della cassa del timpano e della tuba.' },
        { label: 'Tratto solitario', lit: ['nucSol', 'nucGust', 'ixBulb'], info: 'Sensibilità viscerale comune; sensibilità chemocettiva del glomo e barocettiva del seno carotideo. Ganglio: petroso.' },
        { label: 'Gustativo', lit: ['nucGust', 'ixBulb'], info: 'Porzione rostrale del nucleo del tratto solitario: sensibilità viscerale speciale gustativa, dal ganglio petroso.' },
        { label: 'Radice discendente del V', lit: ['nucSpV', 'ixBulb'], info: 'Condiviso con il trigemino: sensibilità somatica dell’orecchio esterno. Ganglio: superiore o giugulare.' },
      ],
    })),
  },
  {
    title: 'Dal bulbo al collo',
    body:
      "Il nervo emerge con 3-4 radicole lungo il solco dei nervi misti del {bulbo|medulla} e si porta lateralmente verso il {foro lacero posteriore|forame}: ne attraversa la parte antero-mediale, davanti a vago e accessorio. Appena uscito raggiunge i suoi due gangli sensitivi: il {ganglio superiore|gsup} o giugulare, somatico, davanti al bulbo della giugulare, e il {ganglio inferiore|ginf} o petroso, viscerale. Nella regione retrostiloidea passa tra la {vena giugulare interna|ijv}, laterale, e l'{arteria carotide interna|ica}, mediale. Procede poi in avanti e medialmente e, seguendo il muscolo stilo-glosso, raggiunge la radice della {lingua|tongue}, dove forma una concavità rivolta in alto.",
    terms: { medulla: ['medulla'], forame: ['forame'], gsup: ['gSup'], ginf: ['gInf'], ijv: ['ijv'], ica: ['ica'], tongue: ['tonguePost'] },
    quiz: {
      question: 'Nella regione retrostiloidea, tra quali strutture passa il glossofaringeo?',
      options: ['Tra carotide interna e carotide esterna', 'Tra vena giugulare interna, laterale, e carotide interna, mediale', 'Dietro la vena giugulare interna', 'Tra parotide e mandibola'],
      correct: 1,
      explain: 'Solo più in basso, nell’angolo tra i due vasi, si aggiunge il vago a formare il fascio vascolo-nervoso del collo.',
    },
    caption: 'Dal bulbo al foro giugulare il nervo è la mesh reale; da sotto i gangli alla lingua è ricostruito sui vasi e sullo stilofaringeo reali.',
    instruction: 'SEGUI IL DECORSO O ISOLA UN TRATTO (ANCHE CLICCANDOLO)',
    view: { yaw: -1.6 },
    mode: closeUp([22, -6, 1540], 2.7, 0.42, selector({
      base: ['petrous', 'medulla', 'pons', ...NERVE, ...GANGLIA, 'forame', 'ica', 'sinus', 'cca', 'eca', 'ijv', 'stylo', ...PHARYNX, ...TONGUE, 'hyoid', 'nHering', 'nTymp'],
      looks: { ...SOFT, eca: { opacity: 0.3 }, ijv: { opacity: 0.55, litOpacity: 0.6 } },
      pick: { ixCist: 1, forame: 1, gSup: 1, gInf: 1, ixFor: 2, ijv: 2, ica: 2, ixNeck: 3, stylo: 3, tonguePost: 3 },
      idle: 'Arancio e viola: i due gangli. Blu: giugulare interna. Rosso: carotidi. Bruno: muscolo stilofaringeo.',
      options: [
        {
          label: 'Decorso', stepTime: 2,
          steps: [
            { ids: ['ixBulb', 'ixCist', 'medulla'], text: 'Solco dei nervi misti del bulbo, poi lateralmente' },
            { ids: ['forame', 'ixFor'], text: 'Foro lacero posteriore, parte antero-mediale (nervosa)' },
            { ids: ['gSup', 'gInf', 'nTymp'], text: 'Gangli superiore e inferiore; si stacca il nervo timpanico' },
            { ids: ['ijv', 'ica'], text: 'Regione retrostiloidea: tra giugulare interna e carotide interna' },
            { ids: ['nHering'], text: 'Tra i due vasi nasce il nervo di Hering' },
            { ids: ['ixNeck', 'stylo'], text: 'In avanti e medialmente, verso la parete della faringe' },
            { ids: ['tonguePost'], text: 'Radice della lingua: concavità rivolta in alto' },
          ],
        },
        { label: 'Foro giugulare', lit: ['ixCist', 'ixFor', 'forame', 'gSup', 'gInf', 'ijv'], info: 'Parte antero-mediale del foro. Ganglio superiore (viola) davanti al bulbo della giugulare; ganglio inferiore (arancio) alla rocca petrosa.' },
        { label: 'Tra i due vasi', lit: ['ixFor', 'ixNeck', 'ijv', 'ica', 'nHering'], info: 'Vena giugulare interna lateralmente, carotide interna medialmente; più in basso si aggiunge il vago (non mostrato).' },
        { label: 'Verso la lingua', lit: ['ixNeck', 'stylo', 'tonguePost'], info: 'Raggiunge la radice della lingua con una concavità rivolta superiormente.' },
      ],
    })),
  },
  {
    title: 'La via della parotide',
    body:
      "Il primo ramo collaterale è il {nervo timpanico|ntymp}: attraversa il canalicolo timpanico, penetra nella cassa del timpano e si sfiocca sul promontorio, sulla parete mediale, nel {plesso timpanico|plesso}. Dalla porzione superiore del plesso origina il {nervo piccolo petroso superficiale|lpn}, che perfora il tegmen tympani, decorre nella {rocca petrosa|petrous} parallelo al {nervo grande petroso|gspn}, si porta in fossa cranica media e ne esce dal canalicolo innominato, tra foro spinoso e foro ovale. Nel {ganglio otico|otic} contrae sinapsi; le fibre postgangliari si uniscono al {nervo auricolo-temporale|atn} e raggiungono la {parotide|parotid}, di cui eccitano la secrezione.",
    terms: { ntymp: ['nTymp'], plesso: ['plesso'], lpn: ['lpn'], petrous: ['petrous'], gspn: ['gspn'], otic: ['otic'], atn: ['atn'], parotid: ['parotid'] },
    quiz: {
      question: 'Dove contraggono sinapsi le fibre parasimpatiche dirette alla parotide?',
      options: ['Nel ganglio petroso', 'Nel plesso timpanico', 'Nel ganglio otico', 'Nel ganglio giugulare'],
      correct: 2,
      explain: 'Dal ganglio otico le fibre postgangliari seguono il nervo auricolo-temporale fino alla loggia parotidea.',
    },
    caption: 'Rocca destra ingrandita. Chiocciola, ossicini, timpano, faciale, mandibolare e parotide reali; la via parasimpatica è ricostruita.',
    instruction: 'SEGUI LA VIA O SCEGLI UNA TAPPA (ANCHE CLICCANDOLA)',
    view: { yaw: -0.75 },
    mode: closeUp([38, -5, 1571], 4, 0.42, selector({
      base: ['petrous', 'ixCist', 'ixFor', 'ixNeck', ...GANGLIA, ...PAROTID_WAY, 'rTub', ...EAR, 'vii', 'gspn', 'v3', 'atn', 'parotid'],
      looks: { parotid: { opacity: 0.6, litOpacity: 0.9 } },
      pick: { nTymp: 1, plesso: 1, rTub: 1, cochlea: 1, lpn: 2, gspn: 2, otic: 3, atn: 3, parotid: 3 },
      idle: 'Azzurro: nervo timpanico e plesso. Blu: piccolo petroso e ganglio otico. Grigio: faciale con il grande petroso.',
      options: [
        {
          label: 'Segui la via', stepTime: 2,
          steps: [
            { ids: ['ixFor', 'gInf'], text: 'Fibre pregangliari dal nucleo salivatorio inferiore, nel tronco del IX' },
            { ids: ['nTymp'], text: 'Nervo timpanico: canalicolo timpanico, con l’arteria timpanica inferiore' },
            { ids: ['plesso', 'cochlea'], text: 'Plesso timpanico sul promontorio, parete mediale della cassa' },
            { ids: ['lpn', 'gspn'], text: 'Piccolo petroso: tegmen tympani, rocca, fossa cranica media' },
            { ids: ['otic', 'v3'], text: 'Canalicolo innominato, poi sinapsi nel ganglio otico' },
            { ids: ['atn'], links: ['postgang'], text: 'Fibre postgangliari con il nervo auricolo-temporale' },
            { ids: ['parotid'], links: ['postgang'], text: 'Parotide: secrezione di saliva e vasodilatazione' },
          ],
        },
        { label: 'Plesso timpanico', lit: ['nTymp', 'plesso', 'rTub', 'cochlea', 'ossicles', 'tympanic'], info: 'Innerva il promontorio; dà rami tubarici e rami per la finestra ovale e la finestra rotonda.' },
        { label: 'Piccolo petroso', lit: ['lpn', 'gspn', 'vii'], info: 'Decorre parallelo al nervo grande petroso superficiale (del faciale), con cui scambia anastomosi.' },
        { label: 'Ganglio otico', lit: ['otic', 'v3', 'atn', 'parotid'], links: ['postgang'], info: 'In fossa infratemporale. Le fibre postgangliari raggiungono la loggia parotidea con il nervo auricolo-temporale.' },
      ],
    })),
  },
  {
    title: 'Seno carotideo, faringe, lingua',
    body:
      "Tra i due vasi il nervo emette il {nervo di Hering|hering}, che discende lungo la carotide interna fino alla biforcazione, dove raggiunge il {glomo|glomo} e il {seno carotideo|sinus}. I {rami faringei|rfar} innervano la mucosa della {rinofaringe|naso}; i rami muscolari sono per lo {stilofaringeo|stylo}. Alla radice della lingua il nervo termina nei {nervi linguali|rling}, che innervano la radice della {lingua|tongue} e i calici gustativi delle papille foliate e vallate, e inviano un {ramo tonsillare|rtons} per la {tonsilla palatina|tonsil}. Il glossofaringeo è il nervo dell'anello linfatico del Waldeyer e il nervo principale del gusto.",
    terms: {
      hering: ['nHering'], glomo: ['glomo'], sinus: ['sinus'], rfar: ['rFar'], naso: ['nasopharynx'], stylo: ['stylo', 'rStylo'],
      rling: ['rLing'], tongue: ['tonguePost'], rtons: ['rTons'], tonsil: ['tonsil'],
    },
    quiz: {
      question: 'Nel gag reflex (riflesso di espulsione), quale nervo forma la branca afferente?',
      options: ['Il nervo vago', 'Il nervo glossofaringeo', 'Il nervo ipoglosso', 'Il nervo faciale'],
      correct: 1,
      explain: 'La branca efferente è del vago, che contrae la muscolatura striata di faringe e laringe.',
    },
    caption: 'Carotidi, stilofaringeo, costrittori, lingua e tonsilla reali; i rami del nervo sono ricostruiti su queste strutture.',
    instruction: 'SCEGLI UN RAMO (ANCHE CLICCANDOLO) E RUOTA IL MODELLO',
    view: { yaw: -0.5 },
    mode: closeUp([18, -24, 1525], 2.4, 0.36, selector({
      base: ['ixFor', 'ixNeck', 'gInf', ...VESSELS, 'glomo', 'stylo', ...PHARYNX, 'nasopharynx', ...TONGUE, 'tonsil', 'epiglottis', 'hyoid', ...BRANCHES],
      looks: SOFT,
      pick: { nHering: 0, sinus: 0, glomo: 0, rFar: 1, nasopharynx: 1, rStylo: 2, stylo: 2, rTons: 3, tonsil: 3, rLing: 4, tonguePost: 4 },
      idle: 'Dal tronco (giallo): nervo di Hering, rami faringei, ramo per lo stilofaringeo, ramo tonsillare, rami linguali.',
      options: [
        { label: 'Nervo di Hering', lit: ['nHering', 'sinus', 'glomo', 'ica'], info: 'Sensibilità chemocettiva del glomo e del seno carotideo, barocettiva del seno: giunge al nucleo del tratto solitario.' },
        { label: 'Rami faringei', lit: ['rFar', 'nasopharynx', 'constrSup'], info: 'Sensibilità viscerale della mucosa della rinofaringe; si anastomizzano con i rami tubarici del nervo timpanico.' },
        { label: 'Rami muscolari', lit: ['rStylo', 'stylo', 'constrSup'], info: 'Muscolo stilofaringeo e fasci interni del costrittore superiore della faringe.' },
        { label: 'Ramo tonsillare', lit: ['rTons', 'tonsil'], info: 'Dai nervi linguali, prima del solco terminale: raggiunge l’istmo delle fauci e la tonsilla palatina.' },
        { label: 'Nervi linguali', lit: ['rLing', 'tonguePost', 'epiglottis'], info: 'Radice della lingua e tonsilla linguale; papille vallate e foliate, calici delle vallecule glosso-epiglottiche.' },
        { label: 'Gag reflex', lit: ['rFar', 'rLing', 'rTons', 'ixNeck', 'tonguePost', 'constrSup', 'constrLow'], info: 'Afferenza: glossofaringeo (stimolo sul dorso della lingua o in gola). Efferenza: vago, che contrae faringe e laringe.' },
      ],
    })),
  },
];

export default {
  id: 'nervo-glossofaringeo',
  title: 'Nervo glossofaringeo',
  blurb: 'Nuclei, foro giugulare, via della parotide, seno carotideo, faringe e lingua: il IX nervo cranico.',
  part: 'Nervi cranici',
  order: 43,
  model: 'nervo-glossofaringeo',
  createModel: () => new NervoGlossofaringeo(),
  zoom: 1,
  yaw: -0.8,
  spreads,
};
