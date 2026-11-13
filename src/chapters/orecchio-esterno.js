// Capitolo "Orecchio esterno". Testi ricavati dagli appunti di neuroanatomia
// (Orecchio esterno: padiglione, meato acustico esterno, membrana del timpano).
// Parti reali e ricostruite, con le fonti: vedi src/models/orecchio-esterno.js.
// Non sono negli appunti, e compaiono solo nei commenti ai pulsanti: i territori
// cutanei dei singoli nervi sul padiglione e il decorso dei nervi e dell'arteria.
import { chipsInto, infoText, picked } from '../modes.js';
import { OuterEarModel, AURICLE, DRUM, TEMPORAL, FOCUS } from '../models/orecchio-esterno.js';

const TENSA = ['tmAS', 'tmPS', 'tmPI', 'tmAI'];
const MALLEUS = ['manubrium', 'malleusHead'];
const MEATUS = ['meatusCart', 'isthmus', 'meatusBone'];
const MUSCLES = ['aurAnt', 'aurSup', 'aurPost'];
const ENTRY = ['concha', 'tragus', 'antitragus', 'incisure', 'notch']; // attorno al poro acustico
const all = (ids, look) => Object.fromEntries(ids.map((id) => [id, look]));

// Come `selector` (opzioni statiche), con in più, per ogni opzione: `state` ({ pull, bulge }, vedi setState nel
// modello), `tint` (colore di alcune parti), `looks` (aspetto di alcune parti),
// `hide` (parti di base da togliere). `keep`: parti che non si attenuano mai.
// L'inquadratura è quella della pagina (`view.focus`, primo piano del motore).
function earMode({ base, options, looks = {}, pick = {}, idle = '', initial = null, keep = [] }) {
  const never = new Set(keep);
  return async ({ model, controls }) => {
    let sel = null;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i ? null : i) }))
    );
    const info = await infoText(controls, -height - 0.03);
    const select = (i) => {
      const o = options[i];
      sel = i;
      chips.forEach((c, j) => c.setActive(j === i));
      const hidden = new Set(o?.hide ?? []);
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? [])].filter((id) => !hidden.has(id)));
      model.setLabels(o?.labels ?? {});
      model.setState(o?.state);
      info.text = o?.info ?? idle;
    };
    return {
      enter() {
        select(initial);
        // scegliere toccando il modello vale come provare il pulsante
        model.onClick = (id) => id in pick && (picked(controls, options[pick[id]]?.label), select(pick[id]));
        model.lookFn = (part) => {
          const o = options[sel];
          const look = { ...looks[part.id], ...o?.looks?.[part.id] };
          if (!o) return look;
          if (o.tint?.[part.id] != null) look.color = o.tint[part.id];
          if (!o.lit) return look;
          if (o.lit.includes(part.id)) return { ...look, glow: 0.3, opacity: look.litOpacity ?? look.opacity };
          return never.has(part.id) ? look : { ...look, dim: true };
        };
      },
    };
  };
}

const spreads = [
  {
    title: 'Il padiglione auricolare',
    body:
      "Il padiglione auricolare è un rilievo fibrocartilagineo rivestito da cute: riceve le onde sonore e le convoglia nel meato acustico esterno. La superficie laterale è una concavità delimitata dall'{elice|helix}, che in alto e indietro porta il {tubercolo di Darwin|tubercle}. Davanti all'elice, oltre il {solco dell'elice|scapha}, sta l'{antelice|antihelix}, che delimita la {conca|concha}. La conca immette nel meato, delimitato in avanti dal {trago|tragus}, a cui si oppone l'{antitrago|antitragus}: li separa un'{incisura|incisure}. In basso sta il {lobulo|lobule}, mobile e morbido. La superficie mediale è separata dalla testa dal {solco cefalo-auricolare|sulcus}.",
    terms: {
      helix: ['helix'], tubercle: ['tubercle'], scapha: ['scapha'], antihelix: ['antihelix'], concha: ['concha'],
      tragus: ['tragus'], antitragus: ['antitragus'], incisure: ['incisure'], lobule: ['lobule'], sulcus: ['sulcus'],
    },
    quiz: {
      question: 'Porta ogni nome sul suo rilievo del padiglione.',
      tags: [
        { label: 'elice', ids: ['helix'] },
        { label: 'antelice', ids: ['antihelix'] },
        { label: 'conca', ids: ['concha'] },
        { label: 'trago', ids: ['tragus'] },
        { label: 'lobulo', ids: ['lobule'] },
      ],
      explain: 'Solo il lobulo non ha cartilagine: il suo scheletro è tessuto fibroadiposo.',
    },
    caption: 'Padiglione destro reale (Z-Anatomy) visto di lato, sul temporale in trasparenza: il davanti è a destra. Il disco scuro segna il poro acustico esterno.',
    instruction: 'SCEGLI UN RILIEVO DEL PADIGLIONE',
    view: { yaw: -1.4 },
    mode: earMode({
      base: [...AURICLE, 'porus', ...TEMPORAL],
      idle: 'I rilievi irregolari del padiglione danno ai suoni angolature e inflessioni: così si capisce da dove arrivano.',
      pick: { helix: 0, tubercle: 0, antihelix: 1, scapha: 1, fossa: 1, concha: 2, porus: 2, tragus: 3, antitragus: 3, incisure: 3, lobule: 4 },
      options: [
        { label: 'Elice', lit: ['helix', 'tubercle'], labels: { tubercle: 'tubercolo di Darwin' }, info: 'Il margine del padiglione. In alto e indietro porta il tubercolo auricolare, o di Darwin.' },
        { label: 'Antelice', lit: ['antihelix', 'scapha'], labels: { scapha: "solco dell'elice" }, info: "Davanti all'elice, da cui la separa il solco dell'elice: delimita la conca." },
        { label: 'Conca', lit: ['concha', 'porus'], labels: { porus: 'meato acustico esterno' }, info: "La porzione profonda: riceve le radici dell'elice e immette nel meato acustico esterno." },
        { label: 'Trago e antitrago', lit: ['tragus', 'antitragus', 'incisure'], labels: { tragus: 'trago', antitragus: 'antitrago' }, info: "Il trago delimita in avanti l'ingresso del meato; gli si oppone l'antitrago, oltre un'incisura." },
        { label: 'Lobulo', lit: ['lobule'], info: 'Scheletro di tessuto fibroadiposo: è la porzione mobile e morbida, sotto il trago.' },
      ],
    }),
  },
  {
    title: 'Il meato acustico esterno',
    body:
      "Il meato acustico esterno è un condotto di circa 2,5 cm, dalla {conca|concha} alla {membrana del timpano|tm}, con andamento a S italica: prima in basso, medialmente e in avanti, poi in alto e indietro, infine di nuovo in avanti e in basso. Il terzo laterale ha uno {scheletro fibrocartilagineo|meatusCart}; i due terzi mediali uno {scheletro osseo|meatusBone}, formato principalmente dall'osso timpanico. Tra le due porzioni c'è un restringimento, l'{istmo|isthmus}. La cute che lo riveste accoglie follicoli piliferi, ghiandole sebacee e ghiandole ceruminose: il loro secreto forma il {cerume|cerumen}, strato protettivo fatto di lipidi e di sostanze antimicrobiche.",
    terms: { concha: ['concha'], tm: DRUM, meatusCart: ['meatusCart'], meatusBone: ['meatusBone'], isthmus: ['isthmus'], cerumen: ['cerumen'] },
    quiz: {
      question: 'Quanta parte del meato acustico esterno ha uno scheletro osseo?',
      options: ['Il terzo laterale', 'I due terzi laterali', 'I due terzi mediali', 'Tutto il condotto'],
      correct: 2,
      explain: 'Il terzo laterale è fibrocartilagineo; i due terzi mediali sono scavati soprattutto nell’osso timpanico.',
    },
    caption: 'Orecchio destro dal davanti: conca, trago e temporale reali in trasparenza; condotto ricostruito tra conca e membrana reali (qui 21 mm).',
    instruction: 'SCEGLI UN TRATTO DEL MEATO, POI STIRA IL PADIGLIONE',
    view: { yaw: 0.2, focus: FOCUS.canal },
    mode: earMode({
      base: [...ENTRY, 'temporalMeatus', ...MEATUS, 'cerumen', ...DRUM, ...MALLEUS],
      looks: { ...all(ENTRY, { opacity: 0.3 }), meatusCart: { opacity: 0.62, litOpacity: 0.9 }, meatusBone: { opacity: 0.62, litOpacity: 0.9 } },
      keep: [...ENTRY, ...DRUM, ...MALLEUS],
      idle: 'Azzurro: parte fibrocartilaginea. Avorio: parte ossea. In fondo, obliqua, la membrana del timpano.',
      pick: { meatusCart: 0, isthmus: 1, meatusBone: 2, cerumen: 3 },
      options: [
        { label: 'Parte cartilaginea', lit: ['meatusCart'], info: 'Il terzo laterale, in continuità con la cartilagine del padiglione: scende in avanti, poi risale indietro.' },
        { label: 'Istmo', lit: ['isthmus'], info: 'Il restringimento tra la porzione fibrocartilaginea e la porzione ossea.' },
        { label: 'Parte ossea', lit: ['meatusBone'], info: "I due terzi mediali: l'osso timpanico forma una doccia aperta in alto, chiusa dalla squama del temporale." },
        { label: 'Cerume', lit: ['cerumen'], looks: { meatusCart: { opacity: 0.3 } }, info: 'Secreto delle ghiandole ceruminose con sebo e cellule squamose: lipidi idrofobi, IgA, defensine e lisozima.' },
        { label: 'Stira il padiglione', state: { pull: 1 }, lit: ['meatusCart', 'meatusBone'], info: "In alto e indietro: il tratto cartilagineo si allinea a quello osseo. È ciò che si fa con l'otoscopio per vedere la membrana." },
      ],
    }),
  },
  {
    title: 'La membrana del timpano',
    body:
      "La {membrana del timpano|tm} chiude il fondo del meato con un'inclinazione di 50 gradi in basso e una declinazione di circa 50 gradi: per averla perpendicolare allo sguardo si stira il padiglione in alto e indietro. La sua superficie mediale accoglie il {manico del martello|manubrium}, che termina nel punto centrale e più declive, l'{ombelico|umbo}. La {pars tensa|tensa} si attacca all'osso timpanico ed è tenuta in tensione dall'{orletto anulare|annulus} di Gerlach. Dalle spine timpaniche l'orletto prosegue nelle due {pliche timpano-malleolari|folds}, tese fino al processo laterale del martello: tra esse sta la {pars flaccida|tmFlac}, o membrana di Shrapnell.",
    terms: { tm: DRUM, manubrium: ['manubrium'], umbo: ['umbo'], tensa: TENSA, annulus: ['annulus'], folds: ['folds'], tmFlac: ['tmFlac'] },
    quiz: {
      question: 'Dove termina il manico del martello?',
      options: ["Nell'ombelico della membrana", 'Nella pars flaccida', "Sull'orletto anulare", 'Sulla spina timpanica anteriore'],
      correct: 0,
      explain: "L'ombelico è il punto centrale e più declive della membrana: lì finisce il manico.",
    },
    caption: 'Membrana destra reale vista dal meato, come all’otoscopio: il davanti è a destra. Orletto, pliche e ombelico sono ricostruiti sulla membrana.',
    instruction: 'SCEGLI UNA PARTE DELLA MEMBRANA',
    view: { yaw: -1.81, focus: FOCUS.drum },
    mode: earMode({
      base: [...DRUM, ...MALLEUS, 'umbo', 'annulus', 'folds'],
      looks: all(DRUM, { opacity: 0.62, litOpacity: 0.8 }),
      keep: MALLEUS,
      idle: 'In alto la pars flaccida, piccola; tutto il resto è pars tensa, con il manico del martello al centro.',
      pick: { tmAS: 0, tmPS: 0, tmPI: 0, tmAI: 0, tmFlac: 1, manubrium: 2, umbo: 2, annulus: 3, folds: 4 },
      options: [
        { label: 'Pars tensa', lit: TENSA, info: "Si attacca all'osso timpanico. Il suo strato fibroso ha fibre radiate, semilunari e paraboliche." },
        { label: 'Pars flaccida', lit: ['tmFlac'], labels: { tmFlac: 'membrana di Shrapnell' }, info: 'Tra le due pliche: qui lo strato fibroso è sostituito da connettivo lasso.' },
        { label: 'Manico e ombelico', lit: ['manubrium', 'umbo'], looks: all(DRUM, { opacity: 0.45 }), labels: { umbo: 'ombelico' }, info: "Il manico del martello si inserisce sul versante interno fino all'ombelico." },
        { label: 'Orletto anulare', lit: ['annulus'], info: 'Legamento nastriforme fibrocartilagineo che tiene in tensione tutta la pars tensa.' },
        { label: 'Pliche', lit: ['folds'], info: 'Dalle spine timpaniche anteriore e posteriore al processo laterale del martello: lungo di esse decorre la corda del timpano.' },
      ],
    }),
  },
  {
    title: 'Quattro quadranti',
    body:
      "All'otoscopio la membrana non ha una luminosità uniforme. Una linea verticale e una orizzontale, incrociate nell'{ombelico|umbo}, la dividono in quattro quadranti: {antero-superiore|tmAS}, subito al davanti del {manico del martello|manubrium}; {postero-superiore|tmPS}, subito al di dietro; {postero-inferiore|tmPI}; {antero-inferiore|tmAI}. In quest'ultimo si descrive il {triangolo luminoso|cone}, che riflette la luce dell'otoscopio. Nell'otite media sierosa il liquido cambia la posizione della membrana e il triangolo si perde; ancora di più si perdono triangolo e lucentezza nell'otite media batterica. Con l'otoscopio si osservano anche lacerazioni, tumori della cassa e il colesteatoma.",
    terms: { umbo: ['umbo'], tmAS: ['tmAS'], manubrium: ['manubrium'], tmPS: ['tmPS'], tmPI: ['tmPI'], tmAI: ['tmAI'], cone: ['cone'] },
    quiz: {
      question: 'In quale quadrante si descrive il triangolo luminoso?',
      options: ['Antero-superiore', 'Postero-superiore', 'Postero-inferiore', 'Antero-inferiore'],
      correct: 3,
      explain: 'Parte dall’ombelico e si allarga verso la periferia del quadrante antero-inferiore.',
    },
    caption: 'La stessa membrana destra: il davanti è a destra. La linea «verticale» segue il manico del martello reale. Nell’otite la sporgenza è esagerata.',
    instruction: 'SCEGLI UN QUADRANTE, POI GUARDA UN’OTITE',
    view: { yaw: -1.81, focus: FOCUS.drum },
    mode: earMode({
      base: [...DRUM, ...MALLEUS, 'umbo', 'annulus', 'cross', 'cone'],
      looks: all(DRUM, { opacity: 0.66, litOpacity: 0.9 }),
      keep: [...MALLEUS, 'cross', 'annulus'],
      idle: "Le due linee si incrociano nell'ombelico. Il triangolo chiaro è il riflesso della luce dell'otoscopio.",
      pick: { tmAS: 0, tmPS: 1, tmPI: 2, tmAI: 3, cone: 3 },
      options: [
        { label: 'Antero-superiore', lit: ['tmAS'], info: 'Subito al davanti del manico del martello.' },
        { label: 'Postero-superiore', lit: ['tmPS'], info: 'Subito al di dietro del manico del martello.' },
        { label: 'Postero-inferiore', lit: ['tmPI'], info: 'Dietro e sotto l’ombelico.' },
        { label: 'Antero-inferiore', lit: ['tmAI', 'cone'], labels: { cone: 'triangolo luminoso' }, info: "Il quadrante del triangolo luminoso: dall'ombelico verso la periferia." },
        {
          label: 'Otite media', hide: ['cone', 'cross'], state: { bulge: 1 }, tint: all(DRUM, 0xc9584a), looks: all(DRUM, { opacity: 1 }),
          info: 'Il liquido nella cassa sposta la membrana: il triangolo luminoso scompare e, se l’otite è batterica, si perde anche la lucentezza.',
        },
      ],
    }),
  },
  {
    title: 'Nervi, vasi e muscoli',
    body:
      "L'innervazione sensitiva del padiglione è fornita dal {nervo grande auricolare|gan} del plesso cervicale, dal {nervo auricolotemporale|atn}, dal {ramo auricolare del vago|arnold}, dal glossofaringeo e dal {faciale|facial}. Quella motoria è del faciale. I muscoli intrinseci sono rudimentali; gli estrinseci, sottocutanei, connettono il padiglione al cuoio capelluto e al cranio e sono in grado di muoverlo: {auricolare anteriore|aurAnt}, {superiore|aurSup} e {posteriore|aurPost}. Il padiglione è irrorato da due rami della {carotide esterna|eca}: l'{arteria temporale superficiale|sta}, che si porta anteriormente, e l'{arteria auricolare posteriore|paa}, che si porta posteriormente.",
    terms: {
      gan: ['gan'], atn: ['atn'], arnold: ['arnold'], facial: ['facial', 'pan'], aurAnt: ['aurAnt'], aurSup: ['aurSup'], aurPost: ['aurPost'],
      eca: ['eca'], sta: ['sta'], paa: ['paa'],
    },
    quiz: {
      question: 'Quale nervo innerva i muscoli estrinseci del padiglione auricolare?',
      options: ['Il nervo grande auricolare', 'Il nervo auricolotemporale', 'Il nervo vago', 'Il nervo faciale'],
      correct: 3,
      explain: 'Sono muscoli sottocutanei, come i mimici: tutti innervati dal faciale.',
    },
    caption: 'Reali: padiglione, ossa, carotide, temporale superficiale, auricolotemporale, faciale. Ricostruiti: gli altri nervi, l’altra arteria, i muscoli.',
    instruction: 'SCEGLI UN NERVO, I MUSCOLI O LE ARTERIE',
    view: { yaw: -1.3, focus: FOCUS.region },
    mode: earMode({
      base: [...AURICLE, ...TEMPORAL, 'mandible', 'scm', 'parotid', 'gan', 'atn', 'arnold', 'facial', 'pan', 'sta', 'paa', 'eca', ...MUSCLES],
      looks: all(AURICLE, { opacity: 0.7, litOpacity: 1 }),
      keep: ['scm'],
      idle: 'Giallo: grande auricolare. Arancio: auricolotemporale. Verde: ramo del vago. Viola: faciale. Rosso: arterie.',
      pick: { gan: 0, atn: 1, arnold: 2, facial: 3, pan: 3, aurAnt: 3, aurSup: 3, aurPost: 3, sta: 4, paa: 4, eca: 4 },
      options: [
        { label: 'Grande auricolare', lit: ['gan', 'lobule', 'antitragus', 'antihelix', 'medial'], info: 'Plesso cervicale. Sale sullo sternocleidomastoideo fino alla parotide: lobulo, antitrago, antelice e faccia mediale.' },
        { label: 'Auricolotemporale', lit: ['atn', 'tragus', 'notch', 'helix'], info: "Ramo del mandibolare. Sale davanti al padiglione con l'arteria temporale superficiale: trago, radice dell'elice ed elice." },
        { label: 'Ramo del vago', lit: ['arnold', 'concha'], info: 'Attraversa il temporale e raggiunge la conca e la parete posteriore del meato, con fibre di glossofaringeo e faciale.' },
        { label: 'Faciale e muscoli', lit: ['facial', 'pan', ...MUSCLES], labels: { aurSup: 'auricolare superiore', aurAnt: 'anteriore', aurPost: 'posteriore' }, info: 'Innervazione motoria: i tre muscoli auricolari estrinseci, sottocutanei, e i rudimentali muscoli intrinseci.' },
        { label: 'Arterie', lit: ['eca', 'sta', 'paa'], labels: { sta: 'temporale superficiale', paa: 'auricolare posteriore' }, info: 'Due rami della carotide esterna: la temporale superficiale davanti al padiglione, l’auricolare posteriore dietro.' },
      ],
    }),
  },
];

export default {
  id: 'orecchio-esterno',
  title: 'Orecchio esterno',
  blurb: 'Il padiglione, il meato acustico esterno e la membrana del timpano vista all’otoscopio.',
  part: 'Organi di senso',
  order: 51,
  model: 'orecchio-esterno',
  createModel: () => new OuterEarModel(),
  yaw: -1.4,
  spreads,
};
