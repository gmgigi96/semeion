// Capitolo "Orecchio medio". Testi ricavati dagli appunti di neuroanatomia
// (Orecchio medio: tuba uditiva e riflesso di attenuazione). Gli appunti non
// descrivono le pareti della cassa: il capitolo segue ciò che contengono.
// Parti reali e ricostruite, con le fonti: vedi src/models/orecchio-medio.js.
import { chipsInto, infoText, cordInto, picked } from '../modes.js';
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
// `cord` (come in `selector`, vedi src/modes.js): una corda che regola la pressione
// esterna; `react(v)` ritorna un'opzione con il suo `ear`. I pulsanti con `ear.press`
// spostano la corda, e deglutendo la corda torna a zero insieme alla membrana.
// `focus` di un'opzione (anche di quella che viene dalla corda): il primo piano del motore
// mentre è scelta; senza, quello della pagina (`view.focus`).
function earMode({ base, options, looks = {}, pick = {}, idle = '', rest = {}, initial = null, keep = [], cord = null }) {
  const never = new Set(keep);
  return async ({ model, controls, def }) => {
    let sel = null;
    let live = null;
    let t0 = 0;
    let press = 0;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i && !o.swallow ? null : i) }))
    );
    const rope = cord && (await cordInto(controls, -height - 0.022, cord, (v) => pull(v)));
    const info = await infoText(controls, -height - 0.03 - (rope ? rope.height + 0.012 : 0));
    const current = () => live ?? options[sel];
    const apply = (o, ear) => {
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? [])]);
      model.setLabels(o?.labels ?? {});
      model.setEar(ear);
      model.zoomTo(o?.focus !== undefined ? o.focus : def?.view?.focus ?? null);
      info.text = o?.info ?? idle;
    };
    const select = (i) => {
      const o = options[i];
      if (o?.swallow && sel !== i) press = rope ? rope.value : options[sel]?.ear?.press ?? 0;
      sel = i;
      live = null;
      t0 = model.time;
      chips.forEach((c, j) => c.setActive(j === i));
      if (rope && !o?.swallow) rope.set(o?.ear?.press ?? 0);
      apply(o, o?.swallow ? { press, open: 1 } : { ...rest, ...o?.ear });
    };
    const pull = (v) => {
      if (sel !== null) chips.forEach((c) => c.setActive(false));
      sel = null;
      live = cord.react(v);
      apply(live, { ...rest, ...live.ear });
    };
    return {
      // la previsione verificata sul modello vale come aver provato quell'opzione
      choose: (i) => (picked(controls, options[i]?.label), select(i)),
      enter() {
        select(initial);
        // scegliere toccando il modello vale come provare il pulsante
        model.onClick = (id) => id in pick && (picked(controls, options[pick[id]]?.label), select(pick[id]));
        model.lookFn = (part) => {
          const o = current();
          const look = { ...looks[part.id] };
          if (!o) return look;
          if (o.scale?.[part.id]) look.scale = o.scale[part.id];
          if (!o.lit) return look;
          if (o.lit.includes(part.id)) return { ...look, glow: 0.3, opacity: look.litOpacity ?? look.opacity };
          return never.has(part.id) ? look : { ...look, dim: true };
        };
      },
      update() {
        rope?.update();
        const o = options[sel];
        if (!o?.swallow) return;
        const t = model.time - t0;
        if (t > 4.5) select(null);
        else if (t > 3.2) model.setEar({ open: 0 });
        else if (t > 0.9) {
          model.setEar({ open: 1 });
          rope?.set(0); // le pressioni si eguagliano
        }
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
      predict: true,
      question: "Scendi a 10 m sott'acqua con la tuba chiusa. Che cosa fa la membrana del timpano?",
      options: ["Si sposta verso l'esterno", "Si sposta verso l'interno", 'Resta ferma', 'Si apre la tuba da sola'],
      correct: 1,
      why: [
        "Verso l'esterno va salendo di quota, quando fuori la pressione scende.",
        null,
        "Fuori 2 atm, nella cassa 1 atm: la differenza la sposta.",
        'Normalmente la tuba è chiusa: la aprono deglutizione, sbadiglio, fonazione e tosse.',
      ],
      explain: "Ogni 10 m si aggiunge 1 atm: l'acqua spinge la membrana verso l'interno e compare il dolore, finché la tuba non si apre.",
      reveal: 1,
    },
    caption: 'Membrana, ossicini e tuba visti dal davanti, con la cartilagine in trasparenza. Spostamento di membrana e martello molto esagerato.',
    instruction: 'TIRA LA CORDA DELLA PRESSIONE, POI DEGLUTISCI',
    view: { yaw: -0.5, focus: FOCUS.tube },
    mode: earMode({
      base: ['tm', ...CHAIN, 'cochlea', ...TUBE],
      looks: { lamMed: { opacity: 0.5 }, lamLat: { opacity: 0.5 } },
      keep: [...TUBE, ...CHAIN, 'cochlea'],
      idle: 'La tuba è chiusa: la cassa del timpano è isolata dalla rinofaringe.',
      cord: {
        // titoletto breve: la lettura che lo segue resta lontana dal manico in fondo corsa
        label: 'PRESSIONE ESTERNA',
        ends: ['quota', 'immersione'],
        min: -1,
        max: 1,
        value: 0,
        // ogni 10 m d'acqua aggiungono 1 atm
        format: (v) => (v >= 0.05 ? `${(Math.round(v * 10) / 10).toLocaleString('it')} atm in più, come a ${Math.round(v * 10)} m` : v <= -0.05 ? 'più bassa' : 'uguale'),
        // con una differenza di pressione si guardano da vicino membrana e martello
        react(v) {
          const lit = ['tm', ...MALLEUS];
          const focus = FOCUS.drum;
          if (v >= 0.05) {
            // a 10 m (1 atm in più) gli appunti segnalano il dolore
            const pain = v >= 0.95 ? ' e compare il dolore' : '';
            return { ear: { press: v }, lit, focus, info: `Fuori la pressione è più alta che nella cassa: la membrana è spinta verso l'interno${pain}.` };
          }
          if (v <= -0.05) return { ear: { press: v }, lit, focus, info: "Fuori la pressione scende, nella cassa no: la membrana è spinta verso l'esterno." };
          return { ear: { press: 0 }, info: 'Le due pressioni sono uguali: la membrana è a riposo.' };
        },
      },
      options: [
        { label: 'Sali di quota', ear: { press: -1 }, lit: ['tm', ...MALLEUS], focus: FOCUS.drum, info: "Fuori la pressione scende, nella cassa no: la membrana è spinta verso l'esterno." },
        { label: 'Immersione a 10 m', ear: { press: 1 }, lit: ['tm', ...MALLEUS], focus: FOCUS.drum, info: "Fuori 2 atm, nella cassa 1 atm: l'acqua spinge la membrana verso l'interno e compare il dolore." },
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
