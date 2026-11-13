// Capitolo "Orecchio medio". Testi ricavati dagli appunti di neuroanatomia
// (Orecchio medio: tuba uditiva e riflesso di attenuazione). Gli appunti non
// descrivono le pareti della cassa: il capitolo segue ciò che contengono.
// Parti reali e ricostruite, con le fonti: vedi src/models/orecchio-medio.js.
import { chipsInto, infoText } from '../modes.js';
import { MiddleEarModel, FOCUS } from '../models/orecchio-medio.js';

const MALLEUS = ['malleusHead', 'manubrium'];
const INCUS = ['incusBody', 'incusLong'];
const CHAIN = [...MALLEUS, ...INCUS, 'stapes'];
const LABYRINTH = ['cochlea', 'vestibule'];
const TUBE = ['tubeBone', 'isthmus', 'lumen', 'lamMed', 'lamLat', 'ostium'];
const CART = ['lumen', 'lamMed', 'lamLat'];
const TUBE_MUSCLES = ['tvp', 'lvp', 'sp'];
const WINDOWS = ['oval', 'round'];
const EAR_MUSCLES = ['tt', 'cochleariform', 'stapedius', 'pyramid'];

// Come `selector` (opzioni statiche), con in più lo stato dell'orecchio di ogni
// opzione: ear: { sound, tt, st, press, open } (vedi setEar nel modello).
// `swallow` apre la tuba per qualche secondo e intanto riporta a zero la
// differenza di pressione. L'inquadratura è quella della pagina (`view.focus`).
function earMode({ base, options, looks = {}, pick = {}, idle = '', rest = {}, initial = null, keep = [] }) {
  const never = new Set(keep);
  return async ({ model, controls }) => {
    let sel = null;
    let t0 = 0;
    let press = 0;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i && !o.swallow ? null : i) }))
    );
    const info = await infoText(controls, -height - 0.03);
    const select = (i) => {
      const o = options[i];
      if (o?.swallow && sel !== i) press = options[sel]?.ear?.press ?? 0;
      sel = i;
      t0 = model.time;
      chips.forEach((c, j) => c.setActive(j === i));
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? [])]);
      model.setLabels(o?.labels ?? {});
      model.setEar(o?.swallow ? { press, open: 1 } : { ...rest, ...o?.ear });
      info.text = o?.info ?? idle;
    };
    return {
      enter() {
        select(initial);
        model.onClick = (id) => id in pick && select(pick[id]);
        model.lookFn = (part) => {
          const o = options[sel];
          const look = { ...looks[part.id] };
          if (!o) return look;
          if (o.scale?.[part.id]) look.scale = o.scale[part.id];
          if (!o.lit) return look;
          if (o.lit.includes(part.id)) return { ...look, glow: 0.3, opacity: look.litOpacity ?? look.opacity };
          return never.has(part.id) ? look : { ...look, dim: true };
        };
      },
      update() {
        const o = options[sel];
        if (!o?.swallow) return;
        const t = model.time - t0;
        if (t > 4.5) select(null);
        else if (t > 3.2) model.setEar({ open: 0 });
        else if (t > 0.9) model.setEar({ open: 1 });
      },
    };
  };
}

const spreads = [
  {
    title: 'La tuba uditiva',
    body:
      "La {tuba uditiva|tube} rappresenta la porzione anteriore dell'orecchio medio: un condotto lungo 3-4 cm che connette la {cassa del timpano|cavity} alla {rinofaringe|naso}, dove si trova il suo {ostio faringeo|ostium}. È diretta in avanti, medialmente e in basso. La {parte ossea|bony} è scavata nella rocca petrosa del {temporale|temporal}, fino alla grande ala dello {sfenoide|sphenoid}; la {parte cartilaginea|cart}, aperta in basso, è applicata sulla superficie inferiore della grande ala. Le divide un restringimento che prende il nome di {istmo|isthmus}.",
    terms: {
      tube: TUBE, cavity: ['tm', ...CHAIN], naso: ['nasopharynx'], ostium: ['ostium'], bony: ['tubeBone'],
      temporal: ['temporal'], sphenoid: ['sphenoid'], cart: CART, isthmus: ['isthmus'],
    },
    quiz: {
      question: 'Che cosa divide la parte ossea della tuba dalla parte cartilaginea?',
      options: ["L'ostio faringeo", "L'istmo", 'La grande ala dello sfenoide', 'La membrana del timpano'],
      correct: 1,
      explain: "L'istmo è il restringimento al confine tra le due parti.",
    },
    caption: 'Orecchio destro visto dal davanti. Ossa, ossicini, labirinto e palato reali (Z-Anatomy); tuba ricostruita tra i loro punti di repere.',
    instruction: 'SCEGLI UNA PARTE DELLA TUBA',
    view: { yaw: -0.5, focus: FOCUS.wide },
    mode: earMode({
      base: ['temporal', 'sphenoid', 'nasopharynx', 'palate', 'tm', ...CHAIN, ...LABYRINTH, ...TUBE],
      idle: 'Dalla cassa del timpano, a sinistra, la tuba scende in avanti e medialmente fino alla rinofaringe.',
      pick: { tubeBone: 0, isthmus: 1, lamMed: 2, lamLat: 2, lumen: 2, ostium: 3 },
      options: [
        { label: 'Parte ossea', lit: ['tubeBone'], info: 'Scavata nella rocca petrosa del temporale: si apre nella cassa del timpano.' },
        { label: 'Istmo', lit: ['isthmus'], info: 'Il restringimento al confine tra parte ossea e parte cartilaginea.' },
        { label: 'Parte cartilaginea', lit: CART, info: 'Aperta in basso, applicata sulla superficie inferiore della grande ala dello sfenoide.' },
        { label: 'Ostio faringeo', lit: ['ostium'], info: "L'apertura della tuba nella rinofaringe." },
      ],
    }),
  },
  {
    title: 'Due lamine, tre muscoli',
    body:
      "La cartilagine della tuba è costituita da due lamine verticali: la {lamina laterale|lamLat}, molto più breve, e la {lamina mediale|lamMed}, più estesa. Tra le due una zona di minor resistenza consente il loro avvicinamento sotto l'azione dei muscoli. Il {tensore del velo palatino|tvp} prende inserzione sul margine inferiore della lamina laterale ed è innervato dal trigemino; l'{elevatore del velo palatino|lvp} sulla lamina mediale e il {salpingofaringeo|sp} sul suo margine inferiore, entrambi innervati dal vago. Normalmente la tuba è chiusa: il liquido delle ghiandole tubariche, per tensione superficiale, tiene le lamine a contatto.",
    terms: { lamLat: ['lamLat'], lamMed: ['lamMed'], tvp: ['tvp'], lvp: ['lvp'], sp: ['sp'] },
    quiz: {
      question: 'Quale muscolo della tuba è innervato dal nervo trigemino?',
      options: ['Il tensore del velo palatino', "L'elevatore del velo palatino", 'Il salpingofaringeo', 'Nessuno dei tre'],
      correct: 0,
      explain: "L'elevatore del velo palatino e il salpingofaringeo sono innervati dal vago.",
    },
    caption: 'La parte cartilaginea vista dal davanti e di lato: la cartilagine fa da tetto al lume, i muscoli scendono verso il palato molle e la faringe.',
    instruction: 'SCEGLI UNA LAMINA O UN MUSCOLO',
    view: { yaw: -0.5, focus: FOCUS.wide },
    mode: earMode({
      base: ['sphenoid', 'nasopharynx', 'palate', 'tm', ...CHAIN, ...TUBE, ...TUBE_MUSCLES],
      idle: 'Azzurro chiaro: lamina mediale. Azzurro scuro: lamina laterale. In rosso i tre muscoli.',
      pick: { lamLat: 0, lamMed: 1, tvp: 2, lvp: 3, sp: 4 },
      options: [
        { label: 'Lamina laterale', lit: ['lamLat'], info: 'Molto più breve: sul suo margine inferiore si inserisce il tensore del velo palatino.' },
        { label: 'Lamina mediale', lit: ['lamMed'], info: "Più estesa: dà inserzione all'elevatore del velo palatino e, sul margine inferiore, al salpingofaringeo." },
        { label: 'Tensore del velo', lit: ['tvp', 'lamLat'], info: 'Margine inferiore della lamina laterale. Nervo trigemino.' },
        { label: 'Elevatore del velo', lit: ['lvp', 'lamMed'], info: 'Lamina mediale. Nervo vago.' },
        { label: 'Salpingofaringeo', lit: ['sp', 'lamMed'], info: 'Margine inferiore della lamina mediale. Nervo vago.' },
      ],
    }),
  },
  {
    title: 'Compensare la pressione',
    body:
      "Poiché normalmente la tuba è chiusa, passando da bassa ad alta quota, o viceversa, la pressione che incide sulla faccia interna della {membrana del timpano|tm} diventa diversa da quella del meato acustico esterno. Per eguagliarle bisogna far entrare aria nella {tuba|tube}: la aprono fonazione, tosse, sbadiglio e deglutizione. In immersione ogni 10 m aggiungono 1 atm, mentre nella cassa resta 1 atm: da qui il dolore alla membrana. L'apertura impedisce anche il ristagno delle secrezioni delle ghiandole tubariche e della cassa, che scendono per gravità verso la {rinofaringe|naso}.",
    terms: { tm: ['tm'], tube: TUBE, naso: ['nasopharynx'] },
    quiz: {
      question: 'Di quanto aumenta la pressione ogni 10 m di immersione?',
      options: ['0,1 atm', '0,5 atm', '1 atm', '10 atm'],
      correct: 2,
      explain: "A 10 m l'acqua preme con 2 atm contro 1 atm nella cassa, finché la tuba non si apre.",
    },
    caption: 'Membrana, ossicini e tuba visti dal davanti, con la cartilagine in trasparenza. La deformazione della membrana è esagerata.',
    instruction: 'CAMBIA LA PRESSIONE ESTERNA, POI DEGLUTISCI',
    view: { yaw: -0.5, focus: FOCUS.tube },
    mode: earMode({
      base: ['tm', ...CHAIN, 'cochlea', ...TUBE],
      looks: { lamMed: { opacity: 0.5 }, lamLat: { opacity: 0.5 } },
      keep: [...TUBE, ...CHAIN, 'cochlea'],
      idle: 'La tuba è chiusa: la cassa del timpano è isolata dalla rinofaringe.',
      options: [
        { label: 'Sali di quota', ear: { press: -1 }, lit: ['tm', ...MALLEUS], info: "Fuori la pressione scende, nella cassa no: la membrana è spinta verso l'esterno." },
        { label: 'Immersione a 10 m', ear: { press: 1 }, lit: ['tm', ...MALLEUS], info: "Fuori 2 atm, nella cassa 1 atm: l'acqua spinge la membrana verso l'interno e compare il dolore." },
        { label: 'Deglutisci', swallow: true, lit: ['lumen', 'tm'], info: "La tuba si apre: l'aria passa tra rinofaringe e cassa, le due pressioni si eguagliano e la membrana torna a riposo." },
      ],
    }),
  },
  {
    title: 'Tre ossicini, due leve',
    body:
      "{Martello|malleus}, {incudine|incus} e {staffa|stapes} portano la vibrazione dalla {membrana del timpano|tm} alla {finestra ovale|oval}, adattando l'impedenza. Il rapporto di lunghezza tra il {manico del martello|manubrium} e il {processo lungo dell'incudine|incusLong} è di 1,3: la prima leva aumenta di 1,3 volte la trasmissione. La superficie della membrana del timpano supera quella della membrana ovale di circa 17,3 volte. La seconda leva, lunghezza dell'incudine rispetto alla staffa, aggiunge un valore di circa 2. In totale l'adattamento di impedenza vale 54,6, a cui si sommano circa 10 dB dell'orecchio esterno.",
    terms: {
      malleus: MALLEUS, incus: INCUS, stapes: ['stapes'], tm: ['tm'], oval: ['oval'], manubrium: ['manubrium'], incusLong: ['incusLong'],
    },
    quiz: {
      question: "Qual è il rapporto di lunghezza tra il manico del martello e il processo lungo dell'incudine?",
      options: ['1,3', '2', '17,3', '54,6'],
      correct: 0,
      explain: 'È la prima leva; 17,3 è il rapporto tra le superfici, 2 la seconda leva.',
    },
    caption: 'La catena degli ossicini reale, vista dal davanti: a sinistra la membrana, a destra coclea e vestibolo. Oscillazioni esagerate.',
    instruction: 'SEGUI LA VIBRAZIONE DALLA MEMBRANA ALLA FINESTRA OVALE',
    view: { yaw: 0.05, focus: FOCUS.ear },
    mode: earMode({
      base: ['tm', ...CHAIN, ...LABYRINTH, ...WINDOWS],
      rest: { sound: 0.6 },
      keep: LABYRINTH,
      idle: 'Martello e incudine oscillano insieme; la staffa affonda nella finestra ovale come uno stantuffo.',
      pick: { manubrium: 0, incusLong: 0, tm: 1, oval: 1, stapes: 2 },
      options: [
        { label: 'Prima leva', lit: ['manubrium', 'incusLong'], info: 'Manico del martello e processo lungo dell’incudine: rapporto 1,3.' },
        { label: 'Superfici', lit: ['tm', 'oval'], scale: { oval: 1.25 }, info: 'La membrana del timpano è circa 17,3 volte più estesa della membrana ovale.' },
        { label: 'Seconda leva', lit: [...INCUS, 'stapes'], info: "Lunghezza dell'incudine rispetto alla staffa: un valore di circa 2." },
        { label: 'Silenzio', ear: { sound: 0 }, info: 'Senza suono la catena è ferma: si vedono le articolazioni tra i tre ossicini.' },
      ],
    }),
  },
  {
    title: 'Il riflesso di attenuazione',
    body:
      "Oltre la soglia critica dei 90 dB scatta un riflesso protettivo. Il {muscolo stapedio|stapedius}, accolto nell'{eminenza piramidale|pyramid} della parete posteriore e innervato dal {nervo faciale|facial}, si attacca alla {staffa|stapes} e ne discosta il margine anteriore dalla {finestra ovale|oval}. Il {tensore del timpano|tt}, innervato dal trigemino, trova una {troclea|trochlea} e si attacca al collo del {martello|malleus}: tirandolo irrigidisce la {membrana del timpano|tm} e impedisce la trasmissione dei toni bassi. Il riflesso impiega circa 100 ms: nucleo cocleare ventrale, collicolo inferiore, nuclei motori del faciale e del trigemino.",
    terms: {
      stapedius: ['stapedius'], pyramid: ['pyramid'], facial: ['facial'], stapes: ['stapes'], oval: ['oval'],
      tt: ['tt'], trochlea: ['cochleariform'], malleus: MALLEUS, tm: ['tm'],
    },
    quiz: {
      question: 'Dove si attacca il tendine del muscolo stapedio?',
      options: ['Al collo del martello', 'Alla staffa', "Al processo lungo dell'incudine", 'Alla membrana del timpano'],
      correct: 1,
      explain: 'Al collo del martello si attacca invece il tendine del tensore del timpano.',
    },
    caption: 'I due muscoli ricostruiti sulla catena reale, con il nervo faciale reale. Movimenti esagerati.',
    instruction: 'FAI ARRIVARE UN SUONO FORTE, POI CONTRAI I MUSCOLI',
    view: { yaw: -0.8, focus: FOCUS.ear },
    mode: earMode({
      base: ['tm', ...CHAIN, ...LABYRINTH, ...WINDOWS, ...EAR_MUSCLES, 'facial'],
      looks: { tm: { opacity: 0.3 }, malleusHead: { opacity: 0.6 }, incusBody: { opacity: 0.6 } },
      keep: [...LABYRINTH, ...CHAIN, 'tm'],
      idle: 'Rosso: tensore del timpano. Porpora: stapedio. Giallo: nervo faciale.',
      pick: { stapedius: 1, pyramid: 1, tt: 2, cochleariform: 2 },
      options: [
        { label: 'Suono oltre 90 dB', ear: { sound: 1 }, info: 'La catena oscilla con ampiezza che potrebbe ledere il sistema uditivo.' },
        { label: 'Stapedio', ear: { sound: 1, st: 1 }, lit: ['stapedius', 'pyramid', 'facial', 'stapes'], scale: { stapedius: 1.12 }, info: 'Discosta il margine anteriore della staffa dalla finestra ovale. Nervo stapedio, ramo del faciale.' },
        { label: 'Tensore del timpano', ear: { sound: 1, tt: 1 }, lit: ['tt', 'cochleariform', ...MALLEUS, 'tm'], scale: { tt: 1.08 }, info: 'Tira il collo del martello: la membrana, più concava e più rigida, trasmette meno i toni bassi. Nervo trigemino.' },
        { label: 'Riflesso', ear: { sound: 1, tt: 1, st: 1 }, lit: ['tt', 'stapedius', 'facial'], info: 'I due muscoli si contraggono insieme dopo circa 100 ms: la staffa quasi non si muove più.' },
      ],
    }),
  },
];

export default {
  id: 'orecchio-medio',
  title: 'Orecchio medio',
  blurb: 'La tuba uditiva, la catena degli ossicini e il riflesso che la frena.',
  part: 'Organi di senso',
  order: 52,
  model: 'orecchio-medio',
  createModel: () => new MiddleEarModel(),
  yaw: 0.3,
  spreads,
};
