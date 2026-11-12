// Capitolo "Nervo vago". Testi dagli appunti di neuroanatomia (Nervo vago).
import { selector } from '../modes.js';
import { NervoVago } from '../models/nervo-vago.js';

const STEM = ['medulla', 'pons'];
const HEAD = ['vxRoot', 'vxCist', 'gJug', 'gNod', 'vxSub'];
const CERV = ['vagCervR', 'vagCervL'];
const THOR = ['vagThorR', 'vagThorL'];
const REC_R = ['recRLoop', 'recRUp'];
const REC_L = ['recLLoop', 'recLUp'];
const SLN = ['slnR', 'slnL', 'slnIntR', 'slnIntL', 'slnExtR', 'slnExtL'];
const GALEN = ['galenR', 'galenL'];
const PULM = ['plexPulmR', 'plexPulmL'];
const PLEX = ['plexEsoPost', 'plexEsoAnt'];
const TRUNKS = ['truncPost', 'truncAnt'];
const GASTRIC = ['gastAnt', 'gastPost'];
const CARTILAGE = ['hyoid', 'thyroidCart', 'cricoid', 'epiglottis', 'arytenoid'];
const INTRINSIC = ['intrinsicR', 'intrinsicL'];
const TRACHEA = ['tracheaC', 'tracheaT'];
const BRONCHI = ['bronchiTop', 'bronchiLow'];
const ESO = ['esoC', 'esoM', 'esoLow'];
const AORTA = ['arch', 'aortaAscTop', 'aortaAscLow', 'aortaDescTop', 'aortaDescLow', 'brachioceph'];
const CAROTID = ['ccaR', 'ccaL', 'icaR', 'icaL'];
const JUGULAR = ['jugLowR', 'jugHighR', 'jugLowL', 'jugHighL'];
const SUBCLAVIAN = ['subclavianR', 'subclavianL'];
const LUNGS = ['lungR', 'lungL'];
const YELLOW = 0xe6bd2e;

// Primo piano: all'ingresso nella pagina il modello viene ingrandito attorno a un punto (mm Z-Anatomy).
const closeUp = (center, scale, height, mode) => async (ctx) => {
  const api = await mode(ctx);
  return { ...api, enter() { api.enter(); ctx.model.focus(center, scale, height); } };
};

const spreads = [
  {
    title: 'Il nervo pneumo-gastrico',
    body:
      "Il {nervo vago|vago} (X) è il nervo encefalico di maggiori dimensioni e lunghezza, e contiene la maggior parte della componente parasimpatica dell'organismo. È detto anche pneumo-gastrico perché si sfiocca a livello {polmonare|lung} e {gastrico|stomach}. Emerge con 7-8 {radicole|root} dal solco dei nervi misti del {bulbo|medulla}, caudalmente al glossofaringeo; le radicole convergono in un tronco che lascia il cranio attraverso il foro lacero posteriore. Il decorso, molto lungo, si estende per le regioni {cervicale|cerv}, {toracica|thor} e {addominale|abd}.",
    terms: {
      vago: [...HEAD, ...CERV, ...THOR, ...PLEX, ...TRUNKS], lung: [...LUNGS, ...PULM], stomach: ['stomach', ...GASTRIC], root: ['vxRoot'], medulla: ['medulla'],
      cerv: [...CERV, 'vxSub'], thor: [...THOR, ...PULM, ...PLEX], abd: [...TRUNKS, ...GASTRIC],
    },
    quiz: {
      question: 'Da dove emerge il nervo vago?',
      options: ['Dal solco bulbo-pontino', 'Dal solco dei nervi misti del bulbo, caudalmente al glossofaringeo', 'Dal solco preolivare', "Dall'angolo ponto-cerebellare"],
      correct: 1,
      explain: 'Emerge con 7-8 radicole, che convergono in un tronco diretto al foro lacero posteriore.',
    },
    caption: 'Dal bulbo allo stomaco: visceri, vasi e ossa sono mesh reali (Z-Anatomy); il vago è reale fino a metà collo, poi ricostruito su di essi.',
    instruction: 'SCEGLI UN TRATTO · TRASCINA IL MODELLO PER RUOTARLO',
    view: { yaw: -0.45, zoom: 1.15 },
    mode: selector({
      base: ['skullBase', 'spineC', 'spineT', ...STEM, ...HEAD, ...CERV, ...THOR, ...REC_R, ...REC_L, 'slnR', 'slnL', 'slnExtR', 'slnExtL', 'slnIntR', 'slnIntL', ...PULM, ...PLEX, ...TRUNKS, ...GASTRIC,
        ...CARTILAGE, 'thyroid', ...TRACHEA, ...BRONCHI, ...ESO, ...AORTA, ...CAROTID, ...JUGULAR, ...SUBCLAVIAN, 'heart', ...LUNGS, 'diaphragm', 'stomach'],
      looks: { thyroid: { opacity: 0.6 } },
      pick: { vagCervR: 0, vagCervL: 0, vagThorR: 1, vagThorL: 1, stomach: 2, gastAnt: 2, gastPost: 2 },
      idle: 'Giallo: il vago dei due lati. Arancio e viola: i nervi laringei ricorrenti destro e sinistro.',
      options: [
        { label: 'Cervicale', lit: [...HEAD, ...CERV, ...CAROTID, ...JUGULAR], info: 'Decorso verticale nel fascio vascolo-nervoso del collo, tra vena giugulare interna e arteria carotide.' },
        { label: 'Toracico', lit: [...THOR, ...REC_R, ...REC_L, ...PULM, ...PLEX, ...TRUNKS], info: 'La simmetria si perde: i due vaghi emettono i ricorrenti, passano dietro i bronchi e si sfioccano sull’esofago.' },
        { label: 'Addominale', lit: [...TRUNKS, ...GASTRIC, 'stomach'], info: 'Superato lo iato esofageo del diaframma, i due tronchi vagali si sfioccano sulle pareti dello stomaco.' },
      ],
    }),
  },
  {
    title: 'Nuclei e gangli',
    body:
      "I nuclei propri del vago sono tre. Il {nucleo ambiguo|amb} è motore viscerale per la componente parasimpatica toracica e dà la componente motoria branchiale; sta nella stessa colonna del {nucleo dell'accessorio|xi}. Il {nucleo motore dorsale del vago|dors} è motore viscerale per la componente parasimpatica addominale. Il {nucleo del tratto solitario|sol}, sensitivo viscerale, ha come ganglio di riferimento il {ganglio inferiore o nodoso|nod}. A questi va aggiunto il {nucleo della radice discendente del trigemino|spv}, sensitivo somatico, che ha come ganglio di riferimento il {ganglio superiore o giugulare|jug}.",
    terms: { amb: ['nucAmb'], xi: ['nucXI'], dors: ['nucDors'], sol: ['nucSol'], nod: ['gNod'], spv: ['nucSpV'], jug: ['gJug'] },
    quiz: {
      question: 'Quale nucleo fornisce la componente parasimpatica addominale del vago?',
      options: ['Il nucleo ambiguo', 'Il nucleo motore dorsale del vago', 'Il nucleo del tratto solitario', 'Il nucleo della radice discendente del trigemino'],
      correct: 1,
      explain: 'La componente parasimpatica toracica fa capo invece al nucleo ambiguo.',
    },
    caption: 'Bulbo e ponte in trasparenza, ingranditi: nuclei, radicole e gangli sono mesh reali.',
    instruction: 'SCEGLI UN NUCLEO (ANCHE CLICCANDOLO) E RUOTA IL TRONCO ENCEFALICO',
    view: { yaw: 0.6 },
    mode: closeUp([0, 14, 1566], 8.5, 0.4, selector({
      base: [...STEM, 'nucAmb', 'nucDors', 'nucSol', 'nucSpV', 'nucXI', 'nucXII', ...HEAD, 'auricular', 'meningeal'],
      pick: { nucAmb: 0, nucDors: 1, nucSol: 2, nucSpV: 3, gJug: 4, gNod: 4 },
      idle: 'Rosso: ambiguo. Blu: motore dorsale. Verde: tratto solitario. Arancio: radice discendente del trigemino.',
      options: [
        { label: 'Ambiguo', lit: ['nucAmb', 'nucXI', 'vxRoot'], info: 'Parasimpatico toracico e muscoli del IV arco branchiale. Prosegue nel tronco encefalico la lamina VII del midollo spinale.' },
        { label: 'Motore dorsale', lit: ['nucDors', 'vxRoot'], info: 'Parasimpatico addominale. Con il nucleo del tratto solitario sta nell’ala cinerea e forma il trigono vagale.' },
        { label: 'Tratto solitario', lit: ['nucSol', 'gNod', 'vxRoot'], info: 'Porzione rostrale: gusto di epiglottide e orofaringe. Caudale: sensibilità viscerale comune, per i riflessi cardiocircolatori, digerenti e respiratori.' },
        { label: 'Radice discendente del V', lit: ['nucSpV', 'gJug', 'auricular', 'meningeal'], info: 'Sensibilità somatica: meningi della fossa cranica posteriore (ramo meningeo), padiglione, meato acustico esterno e timpano (ramo auricolare).' },
        { label: 'Gangli', lit: ['gJug', 'gNod'], info: 'Arancio: ganglio superiore o giugulare, sensitivo somatico, nella fossa giugulare. Viola: ganglio inferiore o nodoso, sensitivo viscerale, più oblungo.' },
      ],
    })),
  },
  {
    title: 'Nel collo: il fascio vascolo-nervoso',
    body:
      "Sotto la base cranica il {vago|vago} scende verticale nella regione retrostiloidea, nell'angolo diedro tra {vena giugulare interna|jug} e {arteria carotide|car}: è il fascio vascolo-nervoso del collo. Il {glossofaringeo|ix}, dapprima in alto, in avanti e medialmente, si pone poi dietro al vago; l'{ipoglosso|xii} gli gira intorno a spira per raggiungere la lingua; l'{accessorio|xi} esce postero-lateralmente e se ne distacca. A livello del ganglio nodoso nasce il {nervo laringeo superiore|sln}: il {ramo esterno|ext} innerva il {muscolo crico-tiroideo|ct}, il {ramo interno|int}, sensitivo, la mucosa sopraglottica della laringe.",
    terms: {
      vago: ['vxSub', 'gNod', 'vagCervR'], jug: ['jugLowR', 'jugHighR'], car: ['ccaR', 'icaR'], ix: ['ix'], xii: ['xii'], xi: ['xi'],
      sln: ['slnR'], ext: ['slnExtR'], ct: ['cricothyroid'], int: ['slnIntR'],
    },
    quiz: {
      question: 'Quale muscolo della laringe è innervato dal ramo esterno del nervo laringeo superiore?',
      options: ['Il crico-aritenoideo posteriore', 'Il crico-tiroideo', 'Il tiro-aritenoideo', "L'aritenoideo trasverso"],
      correct: 1,
      explain: 'Tutti gli altri muscoli intrinseci della laringe dipendono dal nervo laringeo inferiore o ricorrente.',
    },
    caption: 'Il collo ingrandito, visto da destra. Vasi, laringe e nervi IX, XI e XII sono mesh reali; il laringeo superiore è ricostruito.',
    instruction: 'SCEGLI UN RAPPORTO O UN RAMO DEL VAGO CERVICALE',
    view: { yaw: -1.0 },
    mode: closeUp([8, -6, 1498], 3.3, 0.42, selector({
      base: ['skullBase', 'spineC', ...STEM, ...HEAD, ...CERV, 'vxPhar', 'ix', 'xii', 'xi', ...SLN, ...GALEN, ...CARTILAGE, 'cricothyroid', 'thyroid', 'tracheaC', 'esoC', 'constrictor',
        ...CAROTID, ...JUGULAR],
      looks: { thyroid: { opacity: 0.45, litOpacity: 0.8 }, constrictor: { opacity: 0.55, litOpacity: 1 }, skullBase: { opacity: 0.07 } },
      pick: { ix: 1, xii: 2, xi: 3, slnR: 4, slnIntR: 4, slnExtR: 4, cricothyroid: 4, vxPhar: 5 },
      idle: 'Giallo: vago. Verde acqua: glossofaringeo. Rosa: ipoglosso. Azzurro: accessorio. Verde: laringeo superiore.',
      options: [
        { label: 'Fascio vascolo-nervoso', lit: ['vxSub', 'gNod', ...CERV, ...CAROTID, ...JUGULAR], info: 'Vena giugulare interna, arteria carotide e, nell’angolo diedro tra le due, il nervo vago: attraversano la loggia carotidea.' },
        { label: 'Glossofaringeo', lit: ['ix', 'vxSub', 'gNod'], info: 'Dapprima in alto, in avanti e medialmente al vago; attraversata la forcella carotico-giugulare gli si pone posteriormente.' },
        { label: 'Ipoglosso', lit: ['xii', 'vxSub', 'gNod'], info: 'Esce dal canale dell’ipoglosso, dietro e medialmente al vago, poi gli gira intorno a spira per raggiungere la radice della lingua.' },
        { label: 'Accessorio', lit: ['xi', 'vxSub', 'gNod'], info: 'Esce dal foro lacero posteriore postero-lateralmente al vago; il ramo esterno va a sternocleidomastoideo e trapezio, l’interno si unisce al vago.' },
        { label: 'Laringeo superiore', lit: [...SLN, 'cricothyroid', 'gNod', ...GALEN], info: 'All’altezza del grande corno dell’osso ioide si divide: ramo esterno al crico-tiroideo, ramo interno sensitivo. In grigio: ansa di Galeno.' },
        { label: 'Rami faringei', lit: ['vxPhar', 'constrictor', 'gNod'], info: 'Innervazione motoria della faringe, dei muscoli dell’ugola e dell’elevatore del velo palatino; sensitiva di oro- e laringo-faringe.' },
      ],
    })),
  },
  {
    title: 'I due ricorrenti, asimmetrici',
    body:
      "In cavità toracica la simmetria tra i due vaghi si perde. Il vago di destra emette il {nervo laringeo ricorrente|recr} alla base del collo: il nervo abbraccia ad ansa l'{arteria succlavia|subr} e risale. Il vago di sinistra lo emette più in basso, a livello dell'{arco aortico|arch}, che il {ricorrente sinistro|recl} circonda ad ansa. Entrambi salgono nell'angolo diedro tra {esofago|eso} e {trachea|trachea}, in intimo rapporto con la {tiroide|thyroid}, e innervano tutti i {muscoli intrinseci della laringe|intr} escluso il {crico-tiroideo|ct}. Per questo possono essere lesi negli interventi sulla tiroide, con raucedine.",
    terms: {
      recr: REC_R, subr: ['subclavianR'], arch: ['arch'], recl: REC_L, eso: ['esoC', 'esoM'], trachea: TRACHEA, thyroid: ['thyroid'], intr: INTRINSIC, ct: ['cricothyroid'],
    },
    quiz: {
      question: 'Attorno a quale struttura gira il nervo laringeo ricorrente sinistro?',
      options: ["L'arteria succlavia sinistra", "L'arco aortico", 'Il tronco brachiocefalico', 'Il bronco principale sinistro'],
      correct: 1,
      explain: "Il destro gira invece attorno all'arteria succlavia destra, alla base del collo.",
    },
    caption: 'Base del collo e mediastino superiore, ingranditi. Vasi, trachea, esofago e laringe reali; nervi ricostruiti su di essi.',
    instruction: 'SEGUI UN RICORRENTE, POI RUOTA IL MODELLO PER VEDERE LE DUE ANSE',
    view: { yaw: 0.25 },
    mode: closeUp([-2, 2, 1420], 3.3, 0.42, selector({
      base: [...TRACHEA, 'bronchiTop', 'esoC', 'esoM', 'arch', 'aortaAscTop', 'aortaDescTop', 'brachioceph', ...SUBCLAVIAN, 'ccaR', 'ccaL', ...CARTILAGE, 'cricothyroid', ...INTRINSIC, 'thyroid',
        ...CERV, ...THOR, ...REC_R, ...REC_L],
      looks: { thyroid: { opacity: 0.4, litOpacity: 0.75 }, thyroidCart: { opacity: 0.45 }, cricoid: { opacity: 0.6 } },
      pick: { recRLoop: 0, recRUp: 0, subclavianR: 0, recLLoop: 1, recLUp: 1, arch: 1, intrinsicR: 2, intrinsicL: 2, cricothyroid: 2, thyroid: 3 },
      idle: 'Arancio: ricorrente destro, sotto la succlavia. Viola: ricorrente sinistro, sotto l’arco aortico.',
      options: [
        {
          label: 'Ricorrente destro', stepTime: 2.2,
          steps: [
            { ids: ['vagCervR', 'vagThorR', 'subclavianR'], text: 'Alla base del collo il vago destro incrocia l’arteria succlavia' },
            { ids: ['recRLoop', 'subclavianR'], text: 'Qui nasce il ricorrente, che abbraccia ad ansa la succlavia' },
            { ids: ['recRUp', 'tracheaC', 'esoC'], text: 'Risale nell’angolo diedro tra esofago e trachea' },
            { ids: ['recRUp', 'thyroid'], text: 'Passa in intimo rapporto con il lobo laterale della tiroide' },
            { ids: ['recRUp', 'intrinsicR'], text: 'Penetra nella laringe e si divide in un ramo anteriore e uno posteriore' },
          ],
        },
        {
          label: 'Ricorrente sinistro', stepTime: 2.2,
          steps: [
            { ids: ['vagCervL', 'vagThorL', 'arch'], text: 'Il vago sinistro entra nel torace e raggiunge l’arco aortico' },
            { ids: ['recLLoop', 'arch'], text: 'A livello dell’arco nasce il ricorrente, che lo circonda ad ansa' },
            { ids: ['recLUp', ...TRACHEA, 'esoC', 'esoM'], text: 'Risale tra esofago e trachea: maggior rapporto con la trachea, che tende a portarsi a sinistra' },
            { ids: ['recLUp', 'thyroid'], text: 'Anch’esso passa dietro la tiroide' },
            { ids: ['recLUp', 'intrinsicL'], text: 'Raggiunge la laringe dopo un decorso più lungo del destro' },
          ],
        },
        { label: 'Muscoli della laringe', lit: ['recRUp', 'recLUp', ...INTRINSIC], info: 'Il ricorrente innerva tutti i muscoli intrinseci della laringe e la mucosa sottoglottica; solo il crico-tiroideo (verde) è del laringeo superiore.' },
        { label: 'Lesione alla tiroide', show: ['cutRecR'], lit: ['cutRecR', ...REC_R, 'thyroid', 'cricothyroid'], dead: ['intrinsicR'], info: 'Ricorrente destro interrotto dietro la tiroide: i muscoli intrinseci di quel lato si spengono (raucedine); il crico-tiroideo è risparmiato.' },
      ],
    })),
  },
  {
    title: 'Torace e addome',
    body:
      "Nel torace i due vaghi si portano medialmente e, a livello della biforcazione tracheale, passano dietro il {bronco principale|bronchi} corrispondente, dove si sfioccano nel {plesso polmonare|pulm}. Scendendo sull'{esofago|eso} formano il plesso esofageo, {posteriore|post} e {anteriore|ant}; nel quinto inferiore dell'esofago ciascun plesso si raccoglie in un unico nervo, il {tronco vagale posteriore|tp} e il {tronco vagale anteriore|ta}. Superato lo iato esofageo del {diaframma|diaphragm}, i tronchi si sfioccano di nuovo sulle pareti dello {stomaco|stomach}, formando i plessi gastrici {anteriore|ga} e {posteriore|gp}.",
    terms: {
      bronchi: BRONCHI, pulm: PULM, eso: ['esoM', 'esoLow'], post: ['plexEsoPost'], ant: ['plexEsoAnt'], tp: ['truncPost'], ta: ['truncAnt'],
      diaphragm: ['diaphragm'], stomach: ['stomach'], ga: ['gastAnt'], gp: ['gastPost'],
    },
    quiz: {
      question: 'Dove si concentra soprattutto il plesso gastrico anteriore?',
      options: ['Sulla grande curvatura dello stomaco', 'Sulla piccola curvatura dello stomaco', 'Sul fondo dello stomaco', 'Sul piloro'],
      correct: 1,
      explain: 'Il tronco vagale posteriore si sfiocca invece sulla parete posteriore, soprattutto verso la grande curvatura.',
    },
    caption: 'Mediastino e stomaco. Giallo chiaro: vago destro e ciò che ne deriva; ocra: vago sinistro. Cuore, polmoni e diaframma in trasparenza.',
    instruction: 'SEGUI UN VAGO FINO ALLO STOMACO, POI GUARDA IL MODELLO DA DIETRO',
    view: { yaw: -0.5 },
    mode: closeUp([-10, -5, 1252], 1.75, 0.4, selector({
      base: ['tracheaT', ...BRONCHI, 'esoM', 'esoLow', 'arch', 'aortaAscTop', 'aortaAscLow', 'aortaDescTop', 'aortaDescLow', 'heart', ...LUNGS, 'diaphragm', 'stomach', 'spineT',
        ...THOR, 'recLLoop', 'recRLoop', ...PULM, ...PLEX, ...TRUNKS, ...GASTRIC, 'cardiac', 'cardPlex'],
      looks: {
        vagThorR: { color: 0xf0b23c }, vagThorL: { color: 0xd98f2b }, recRLoop: { color: YELLOW }, recLLoop: { color: YELLOW },
        aortaAscTop: { opacity: 0.35 }, aortaAscLow: { opacity: 0.35 }, arch: { opacity: 0.6 },
      },
      pick: { plexPulmR: 2, plexPulmL: 2, cardiac: 3, cardPlex: 3, stomach: 4, gastAnt: 4, gastPost: 4 },
      idle: 'Il vago destro diventa posteriore, il sinistro anteriore.',
      options: [
        {
          label: 'Vago destro', stepTime: 2.2,
          steps: [
            { ids: ['vagThorR', 'tracheaT'], text: 'Scende lungo la trachea portandosi medialmente' },
            { ids: ['vagThorR', 'plexPulmR', ...BRONCHI], text: 'Dietro il bronco principale destro si sfiocca nel plesso polmonare' },
            { ids: ['plexEsoPost', 'esoLow'], text: 'Sull’esofago forma il plesso esofageo posteriore' },
            { ids: ['truncPost', 'esoLow'], text: 'Nel quinto inferiore dell’esofago: tronco vagale posteriore' },
            { ids: ['gastPost', 'stomach'], text: 'Oltre lo iato esofageo: plesso gastrico posteriore' },
          ],
        },
        {
          label: 'Vago sinistro', stepTime: 2.2,
          steps: [
            { ids: ['vagThorL', 'arch'], text: 'Scende sul fianco dell’arco aortico, dove emette il ricorrente' },
            { ids: ['vagThorL', 'plexPulmL', ...BRONCHI], text: 'Dietro il bronco principale sinistro si sfiocca nel plesso polmonare' },
            { ids: ['plexEsoAnt', 'esoLow'], text: 'Sull’esofago forma il plesso esofageo anteriore' },
            { ids: ['truncAnt', 'esoLow'], text: 'Nel quinto inferiore dell’esofago: tronco vagale anteriore' },
            { ids: ['gastAnt', 'stomach'], text: 'Oltre lo iato esofageo: plesso gastrico anteriore' },
          ],
        },
        { label: 'Rami bronchiali', lit: [...PULM, ...BRONCHI, ...THOR], info: 'Nell’albero bronchiale il parasimpatico vagale dà broncocostrizione, vasodilatazione e ipersecrezione ghiandolare: il calibro del bronchiolo si riduce.' },
        { label: 'Cuore', lit: ['cardiac', 'cardPlex', 'heart'], links: ['toHeart'], info: 'Nervi cardiaci superiore, medio e inferiore: la componente parasimpatica toracica fa capo al nucleo ambiguo.' },
        { label: 'Stomaco', lit: [...TRUNKS, ...GASTRIC, 'stomach'], info: 'Tronco anteriore: parete anteriore, soprattutto piccola curvatura. Tronco posteriore: parete posteriore, soprattutto grande curvatura.' },
      ],
    })),
  },
];

export default {
  id: 'nervo-vago',
  title: 'Nervo vago',
  blurb: 'Nuclei, decorso dal bulbo allo stomaco e i due nervi laringei ricorrenti.',
  part: 'Nervi cranici',
  order: 44,
  model: 'nervo-vago',
  createModel: () => new NervoVago(),
  zoom: 1,
  yaw: -0.45,
  spreads,
};
