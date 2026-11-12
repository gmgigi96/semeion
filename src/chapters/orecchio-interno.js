// Capitolo "Orecchio interno". Testi ricavati dagli appunti di neuroanatomia
// (Orecchio interno: perilinfa ed endolinfa, macula otolitica, trasduzione,
// polarizzazione, accoppiamento dei canali). Gli appunti non descrivono la
// coclea né l'organo del Corti: il capitolo segue ciò che contengono.
// Parti reali e ricostruite, con le fonti: vedi src/models/orecchio-interno.js.
import { chipsInto, infoText } from '../modes.js';
import { InnerEarModel } from '../models/orecchio-interno.js';

const BONY = ['vestibule', 'canalLat', 'canalAnt', 'canalPost', 'cochlea'];
const DUCTS = ['ductLat', 'ductAnt', 'ductPost', 'crus', 'cristae'];
const SACS = ['utricle', 'saccule', 'macUt', 'macSac'];
const MEMB = [...DUCTS, ...SACS, 'endoDuct', 'endoSac', 'reuniens', 'cochlearDuct'];
const NERVES = ['cochlearNerve', 'vestibularNerve'];
const BLOCK = ['epi', 'cellsA', 'cellsB', 'bundles', 'kinoM', 'striola', 'gel', 'oto'];
const CELLS = ['cell1', 'cell2', 'plate', 'stereo', 'kino', 'tips', 'ribbon', 'aff1', 'aff2', 'eff1', 'eff2', 'support'];
const SKULL = ['temporalR', 'temporalL', 'occipital', 'sphenoid'];
const TWO_EARS = ['rBody', 'rCoch', 'rLat', 'rAnt', 'rPost', 'lBody', 'lCoch', 'lLat', 'lAnt', 'lPost'];

const GREEN = 0x1f9d57, BLUE = 0x2f6fe0;
const glass = (ids, opacity, litOpacity = opacity) => Object.fromEntries(ids.map((id) => [id, { opacity, litOpacity }]));

// Come `selector` (opzioni statiche o a passi), con in più l'inquadratura
// (`focus`), lo stato del modello (`scene`, vedi setScene) e il colore di
// alcune parti (`tint`) per ogni opzione. `keep`: parti che non si attenuano.
function labMode({ focus, base, options, looks = {}, pick = {}, idle = '', initial = null, keep = [], labels = {} }) {
  const never = new Set(keep);
  return async ({ model, controls }) => {
    let sel = null;
    let t0 = 0;
    let shownStep = -1;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i && !o.steps ? null : i) }))
    );
    const info = await infoText(controls, -height - 0.03);
    const stepOf = (o) => Math.min(o.steps.length - 1, Math.floor((model.time - t0) / (o.stepTime ?? 1.1)));
    const select = (i) => {
      sel = i;
      t0 = model.time;
      shownStep = -1;
      const o = options[i];
      chips.forEach((c, j) => c.setActive(j === i));
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? []), ...(o?.steps?.flatMap((s) => s.ids) ?? [])]);
      model.setLabels(o?.labels ?? labels);
      model.setScene(o?.scene);
      if (!o?.steps) {
        model.showLinks(o?.links ?? []);
        info.text = o?.info ?? idle;
      }
    };
    return {
      enter() {
        model.setFocus(focus);
        select(initial);
        model.onClick = (id) => id in pick && select(pick[id]);
        model.lookFn = (part) => {
          const o = options[sel];
          const look = { ...looks[part.id] };
          if (!o) return look;
          if (o.tint?.[part.id] != null) return { ...look, color: o.tint[part.id], glow: 0.35, opacity: look.litOpacity ?? look.opacity };
          if (o.steps) {
            const k = stepOf(o);
            if (o.steps[k].ids.includes(part.id)) return { ...look, glow: 0.55, opacity: 1 };
            if (o.steps.slice(0, k).some((s) => s.ids.includes(part.id))) return { ...look, glow: 0.15 };
            return never.has(part.id) ? look : { ...look, dim: true };
          }
          if (!o.lit) return look;
          if (o.lit.includes(part.id)) return { ...look, glow: 0.3, opacity: look.litOpacity ?? look.opacity };
          return never.has(part.id) ? look : { ...look, dim: true };
        };
      },
      update() {
        const o = options[sel];
        if (!o?.steps) return;
        const k = stepOf(o);
        if (k === shownStep) return;
        shownStep = k;
        info.text = `${k + 1}/${o.steps.length} · ${o.steps[k].text}`;
        model.showLinks(o.steps.slice(0, k + 1).flatMap((s) => s.links ?? []));
      },
    };
  };
}

const spreads = [
  {
    title: 'Due liquidi molto diversi',
    body:
      "Nell'orecchio interno si trovano due liquidi molto diversi tra loro. La {perilinfa|peri} ha un'altissima concentrazione di ioni Na+; l'{endolinfa|endo} ne ha 1/150. Al contrario, per il K+ il rapporto perilinfa/endolinfa è 4/160. L'endolinfa bagna gli epiteli sensoriali di {utricolo|utricle}, {sacculo|saccule}, {canali semicircolari|ducts} e {coclea|cochlea}: qui le cellule di sostegno, che circondano le cellule capellute, producono endolinfa, intervengono nel trasporto ionico e modulano l'eccitazione delle cellule recettoriali.",
    terms: { peri: BONY, endo: MEMB, utricle: ['utricle'], saccule: ['saccule'], ducts: ['ductLat', 'ductAnt', 'ductPost'], cochlea: ['cochlearDuct'] },
    quiz: {
      question: "Quale ione è molto più concentrato nell'endolinfa che nella perilinfa?",
      options: ['Il sodio', 'Il potassio', 'Il calcio', 'Nessuno: sono uguali'],
      correct: 1,
      explain: "Per il K+ il rapporto perilinfa/endolinfa è 4/160; il Na+ dell'endolinfa è 1/150 di quello della perilinfa.",
    },
    caption: 'Labirinto destro visto di lato e un poco dal davanti. Labirinto osseo, staffa e nervi reali (Z-Anatomy); labirinto membranoso ricostruito al suo interno.',
    instruction: 'SCEGLI UN LIQUIDO O UNA PARTE DEL LABIRINTO',
    view: { yaw: 0, zoom: 1.15 },
    mode: labMode({
      focus: 'lab',
      base: [...BONY, ...MEMB, 'stapes', ...NERVES],
      looks: glass(BONY, 0.42, 0.7),
      keep: NERVES,
      idle: 'In avorio trasparente il labirinto osseo; a colori, dentro, il labirinto membranoso.',
      pick: { utricle: 2, saccule: 2, ductLat: 3, ductAnt: 3, ductPost: 3, cochlearDuct: 4 },
      options: [
        {
          label: 'Perilinfa', lit: BONY, tint: Object.fromEntries(BONY.map((id) => [id, 0x9cc3ea])),
          info: 'Riempie il labirinto osseo, attorno al labirinto membranoso: altissima concentrazione di Na+, poco K+ (4 contro 160).',
        },
        { label: 'Endolinfa', lit: MEMB, info: 'Dentro il labirinto membranoso: Na+ pari a 1/150 di quello della perilinfa, K+ 160 contro 4.' },
        {
          label: 'Utricolo e sacculo', lit: SACS, labels: { utricle: 'utricolo', saccule: 'sacculo' },
          info: 'I due sacchi del vestibolo: in rosso le loro macule, con le cellule capellute.',
        },
        {
          label: 'Canali semicircolari', lit: DUCTS, labels: { ductLat: 'laterale', ductAnt: 'anteriore', ductPost: 'posteriore' },
          info: 'Tre dotti membranosi, ciascuno dentro il proprio canale osseo: laterale, anteriore e posteriore.',
        },
        {
          label: 'Coclea', lit: ['cochlearDuct', 'reuniens'], labels: { cochlearDuct: 'dotto cocleare' },
          info: 'Il dotto cocleare percorre la chiocciola ossea: anche le sue cellule capellute hanno un corpo sinaptico.',
        },
      ],
    }),
  },
  {
    title: 'Lineare o angolare',
    body:
      "L'apparato stato-cinetico è sensibile a due tipi di accelerazione. L'accelerazione lineare è rilevata da utricolo e sacculo: l'{utricolo|utricle} è sensibile alle accelerazioni sul piano orizzontale, il {sacculo|saccule} a quelle sul piano verticale, ed è quindi sempre stimolato dall'accelerazione di gravità. L'accelerazione angolare è rilevata dai canali semicircolari, che hanno le tre direzioni dello spazio: il {canale orizzontale|lat} (x), il {canale posteriore|post} o verticale (y) e il {canale anteriore|ant} o superiore (z).",
    terms: { utricle: ['utricle', 'macUt'], saccule: ['saccule', 'macSac'], lat: ['ductLat', 'canalLat'], post: ['ductPost', 'canalPost'], ant: ['ductAnt', 'canalAnt'] },
    quiz: {
      question: "Quale recettore è sempre stimolato dall'accelerazione di gravità?",
      options: ["L'utricolo", 'Il sacculo', 'Il canale semicircolare orizzontale', 'Il canale semicircolare anteriore'],
      correct: 1,
      explain: 'Il sacculo è sensibile alle accelerazioni sul piano verticale, quindi anche alla gravità.',
    },
    caption: 'Il labirinto oscilla nella direzione scelta: si accende il recettore che la rileva. Per i canali è mostrato il piano di ciascuno.',
    instruction: "SCEGLI UN'ACCELERAZIONE E GUARDA CHI RISPONDE",
    view: { yaw: 0, zoom: 1.15 },
    mode: labMode({
      focus: 'lab',
      base: [...BONY, ...MEMB],
      looks: glass(BONY, 0.34, 0.6),
      idle: 'Azzurro: utricolo. Viola: sacculo. Verde, rosa e arancio: i dotti laterale, anteriore e posteriore.',
      pick: { utricle: 0, macUt: 0, saccule: 1, macSac: 1, ductLat: 2, ductPost: 3, ductAnt: 4 },
      options: [
        {
          label: 'Lineare orizzontale', lit: ['utricle', 'macUt'], links: ['acc-h'], scene: { lin: 'h' }, labels: { utricle: 'utricolo' },
          info: "L'utricolo è sensibile alle accelerazioni lineari sul piano orizzontale.",
        },
        {
          label: 'Lineare verticale', lit: ['saccule', 'macSac'], links: ['acc-v'], scene: { lin: 'v' }, labels: { saccule: 'sacculo' },
          info: "Il sacculo è sensibile alle accelerazioni sul piano verticale: l'accelerazione di gravità lo stimola sempre.",
        },
        {
          label: 'Canale orizzontale', lit: ['ductLat', 'canalLat', 'planeLat'], links: ['rot-lat'], scene: { turn: 'lat' },
          info: 'Accelerazione angolare nel piano del canale semicircolare orizzontale (x).',
        },
        {
          label: 'Canale posteriore', lit: ['ductPost', 'canalPost', 'planePost'], links: ['rot-post'], scene: { turn: 'post' },
          info: 'Accelerazione angolare nel piano del canale semicircolare posteriore, o verticale (y).',
        },
        {
          label: 'Canale anteriore', lit: ['ductAnt', 'canalAnt', 'planeAnt'], links: ['rot-ant'], scene: { turn: 'ant' },
          info: 'Accelerazione angolare nel piano del canale semicircolare anteriore, o superiore (z).',
        },
      ],
    }),
  },
  {
    title: 'La macula otolitica',
    body:
      "Il suono non stimola utricolo e sacculo: la loro inerzia è molto alta, perché i recettori sono immersi in una massa di {cristalli di carbonato di calcio|oto} che una forza pari a quella del suono non può spostare. La macula è costituita dalla {membrana otolitica|gel} e da un {epitelio sensoriale|epi} che accoglie circa 4000 {cellule capellute|cells}. La {striola|striola} è la linea in cui la polarità si inverte: nell'{utricolo|macUt} i {chinocigli|kino} sono rivolti verso la striola (polarizzazione striolipeta), nel {sacculo|macSac} in direzione opposta (striolifuga).",
    terms: { oto: ['oto'], gel: ['gel'], epi: ['epi'], cells: ['cellsA', 'cellsB'], striola: ['striola'], macUt: ['macUt', 'utricle'], kino: ['kinoM'], macSac: ['macSac', 'saccule'] },
    quiz: {
      question: "Come sono orientati i chinocigli nelle cellule capellute dell'utricolo?",
      options: ['Verso la striola', 'In direzione opposta alla striola', 'Tutti nello stesso verso', 'A caso'],
      correct: 0,
      explain: "Nell'utricolo la polarizzazione è striolipeta, nel sacculo striolifuga.",
    },
    caption: 'In alto il labirinto destro con le due macule in rosso; in basso un tratto di macula ingrandito (schema: poche cellule, spostamenti esagerati).',
    instruction: 'SPOSTA LA MEMBRANA OTOLITICA',
    view: { yaw: 0, zoom: 1.15 },
    mode: labMode({
      focus: 'macula',
      base: [...BONY, 'utricle', 'saccule', 'macUt', 'macSac', ...BLOCK],
      looks: { ...glass(BONY, 0.5), utricle: { opacity: 0.4 }, saccule: { opacity: 0.4 } },
      keep: [...BLOCK, 'utricle', 'saccule'],
      idle: 'Dal basso: epitelio con le cellule capellute, membrana otolitica, cristalli. In rosso scuro la striola.',
      labels: { oto: 'otoconi' },
      options: [
        {
          label: 'Utricolo', lit: ['macUt', 'polIn', 'kinoM', 'striola'], scene: { organ: 0 }, labels: { polIn: 'striolipeta' },
          info: 'Macula orizzontale. Polarizzazione striolipeta: i chinocigli, in viola, guardano verso la striola.',
        },
        {
          label: 'Accelerazione', lit: ['macUt', 'gel', 'oto'], scene: { organ: 0, shift: 1 }, tint: { cellsA: GREEN, cellsB: BLUE },
          info: "La membrana otolitica trascina le stereociglia: da un lato della striola piegano verso il chinociglio (verde), dall'altro in senso opposto (blu).",
        },
        {
          label: 'Sacculo', lit: ['macSac', 'polOut', 'kinoM', 'striola'], scene: { organ: 1, shift: -0.75 }, labels: { polOut: 'striolifuga' }, tint: { cellsA: GREEN, cellsB: BLUE },
          info: 'Macula verticale, polarizzazione striolifuga: la gravità trascina sempre la membrana otolitica verso il basso.',
        },
        {
          label: 'Suono', lit: ['oto', 'gel'], scene: { organ: 0 },
          info: 'Nessuno spostamento: una forza di intensità pari a quella del suono non muove la massa dei cristalli.',
        },
      ],
    }),
  },
  {
    title: 'La cellula capelluta',
    body:
      "Ogni cellula capelluta porta 70-80 {stereociglia|stereo}, rigide per i filamenti di actina e disposte a scala; il più alto è il {chinociglio|kino}. Si piegano insieme nel punto di attacco alla membrana, la {piastra cuticolare|plate}. I {tip links|tips} uniscono l'apice dello stereociglio più corto al fianco del più lungo: la piegatura dal più corto al più lungo stira la membrana e apre i canali per il potassio. La cellula si depolarizza, entra calcio e il {corpo sinaptico|ribbon} libera glutammato sulla {fibra afferente|aff} del ganglio dello Scarpa. Nella direzione opposta la cellula si iperpolarizza.",
    terms: { stereo: ['stereo'], kino: ['kino'], plate: ['plate'], tips: ['tips'], ribbon: ['ribbon'], aff: ['aff1', 'aff2'] },
    quiz: {
      question: 'Quale piegatura delle stereociglia depolarizza la cellula capelluta?',
      options: ['Dal più corto al più lungo', 'Dal più lungo al più corto', 'Qualunque piegatura', 'Nessuna: risponde solo al suono'],
      correct: 0,
      explain: 'Nella direzione opposta, dal più lungo al più corto, la cellula si iperpolarizza.',
    },
    caption: 'Due cellule capellute tra le cellule di sostegno (schema): a sinistra il tipo 1, a destra il tipo 2. Gialle le fibre afferenti, viola le efferenti.',
    instruction: 'PIEGA LE STEREOCIGLIA E SEGUI LA TRASDUZIONE',
    view: { yaw: 0, zoom: 1.15 },
    mode: labMode({
      focus: 'cell',
      base: CELLS,
      looks: { support: { opacity: 0.32 } },
      keep: ['support'],
      idle: 'A riposo. Il chinociglio, in viola, è il più alto: la scala delle stereociglia sale verso di lui.',
      labels: { kino: 'chinociglio', cell1: 'tipo 1', cell2: 'tipo 2' },
      pick: { cell1: 2, aff1: 2, eff1: 2, cell2: 3, aff2: 3, eff2: 3 },
      options: [
        {
          label: 'Verso il chinociglio', scene: { bend: 1 }, stepTime: 2.6,
          steps: [
            { ids: ['stereo', 'kino', 'tips'], text: 'Lo stereociglio più corto, piegandosi, tira il più lungo attraverso i tip links e ne stira la membrana.' },
            { ids: ['kIons'], text: 'Si aprono i canali per il potassio: entra nella cellula una grande quantità di K+.' },
            { ids: ['cell1', 'cell2', 'caCh'], text: 'La membrana si depolarizza e apre i canali voltaggio-dipendenti per il calcio.' },
            { ids: ['ribbon', 'glu'], text: 'Il calcio fa fondere il corpo sinaptico con la membrana: viene rilasciato glutammato.' },
            { ids: ['aff1', 'aff2'], links: ['fire1', 'fire2'], text: "Il glutammato eccita l'assone afferente del ganglio dello Scarpa, diretto ai nuclei vestibolari." },
          ],
        },
        {
          label: 'In senso opposto', scene: { bend: -1 }, lit: ['stereo', 'kino', 'tips'], tint: { cell1: BLUE, cell2: BLUE },
          info: 'Piegatura dal più lungo al più corto: la cellula si iperpolarizza.',
        },
        {
          label: 'Tipo 1', lit: ['cell1', 'aff1', 'eff1'], labels: { eff1: 'efferente', aff1: 'afferente a calice' },
          info: 'A fiasca, circondata a coppa dalla fibra afferente: la fibra efferente fa quindi sinapsi asso-assonica. Recettore statico.',
        },
        {
          label: 'Tipo 2', lit: ['cell2', 'aff2', 'eff2'], labels: { eff2: 'efferente' },
          info: 'Cilindrica, con un contatto afferente minimo, parcellare; la sinapsi efferente è asso-somatica. Recettore dinamico.',
        },
      ],
    }),
  },
  {
    title: 'Canali accoppiati',
    body:
      "I {canali semicircolari laterali|latPair} di destra e di sinistra sono accoppiati tra loro. Il {canale anteriore di destra|ra}, invece, non è accoppiato con l'anteriore di sinistra ma con il {posteriore di sinistra|lp}. Dipende dalla disposizione delle due {rocche petrose|petrous}: ciascuna forma con la {linea antero-posteriore|midline} un angolo di circa 45°, e l'angolo compreso tra le due è di circa 90°. Così il canale anteriore di un lato è isoplanare al posteriore del lato opposto; i canali orizzontali sono isoplanari tra loro e formano con il piano orizzontale un angolo di circa 30°.",
    terms: { latPair: ['rLat', 'lLat'], ra: ['rAnt'], lp: ['lPost'], petrous: ['axisR', 'axisL'], midline: ['midline'] },
    quiz: {
      question: 'Con quale canale è accoppiato il canale semicircolare anteriore di destra?',
      options: ["Con l'anteriore di sinistra", 'Con il posteriore di sinistra', 'Con il laterale di sinistra', 'Con il posteriore di destra'],
      correct: 1,
      explain: "Le rocche petrose formano tra loro circa 90°: l'anteriore di un lato è isoplanare al posteriore dell'altro.",
    },
    caption: 'Base cranica reale dall’alto, la fronte verso chi legge. Labirinti reali ingranditi 2,5 volte, sollevati sopra le rocche e riorientati.',
    instruction: 'SCEGLI UNA COPPIA DI CANALI',
    view: { yaw: 0, zoom: 1.15 },
    mode: labMode({
      focus: 'skull',
      base: [...SKULL, ...TWO_EARS, 'midline'],
      looks: glass(['rBody', 'lBody', 'rCoch', 'lCoch'], 0.75),
      idle: 'Stesso colore, stessa coppia: verde i laterali, arancio anteriore destro e posteriore sinistro, blu gli altri due.',
      pick: { rLat: 0, lLat: 0, rAnt: 1, lPost: 1, lAnt: 2, rPost: 2, axisR: 3, axisL: 3, midline: 3 },
      options: [
        {
          label: 'Laterali', lit: ['rLat', 'lLat', 'rPlaneLat', 'lPlaneLat'],
          info: 'I due canali orizzontali sono isoplanari e accoppiati tra loro.',
        },
        {
          label: 'Anteriore dx, posteriore sx', lit: ['rAnt', 'lPost', 'rPlaneAnt', 'lPlanePost'],
          info: 'Il canale anteriore di destra è isoplanare al posteriore di sinistra: sono accoppiati.',
        },
        {
          label: 'Anteriore sx, posteriore dx', lit: ['lAnt', 'rPost', 'lPlaneAnt', 'rPlanePost'],
          info: 'Allo stesso modo il canale anteriore di sinistra è accoppiato con il posteriore di destra.',
        },
        {
          label: 'Rocche petrose', lit: ['axisR', 'axisL', 'midline'], labels: { axisR: '45°', axisL: '45°' },
          info: 'Ogni rocca forma con la linea antero-posteriore un angolo di circa 45°: tra le due, circa 90°.',
        },
      ],
    }),
  },
];

export default {
  id: 'orecchio-interno',
  title: 'Orecchio interno',
  blurb: 'Due liquidi, le macule con i loro cristalli, la cellula capelluta e i canali accoppiati.',
  part: 'Organi di senso',
  order: 53,
  model: 'orecchio-interno',
  createModel: () => new InnerEarModel(),
  yaw: 0,
  spreads,
};
