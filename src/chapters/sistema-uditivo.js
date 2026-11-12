// Capitolo "Sistema uditivo". Testi ricavati dagli appunti di neuroanatomia
// «Sistema uditivo 3X» (coclea, dotto cocleare, organo del Corti, trasmissione
// del suono); l'ultima doppia pagina, sulla via acustica centrale, segue gli
// appunti «Vie vestibolo-cocleari (3X)», paragrafo «Via cocleare».
// Parti reali e ricostruite, con le fonti: vedi src/models/sistema-uditivo.js.
import { chipsInto, infoText } from '../modes.js';
import { AuditoryModel } from '../models/sistema-uditivo.js';

const DUCTS = ['ductBase', 'ductMid', 'ductApex'];
const COCH = ['cochleaR', 'labyrinth', 'stapes', 'nerveTip', 'scalaV', 'scalaT', ...DUCTS, 'helico', 'modiolus', 'ganglion', 'roundWindow'];
const THUMB = ['cochleaR', 'scalaV', 'scalaT', ...DUCTS, 'helico', 'nerveTip'];
const SEC = ['secBone', 'secSV', 'secST', 'secDuct', 'secLamina', 'secLig', 'secStria', 'secLimbus', 'secReissner', 'secBM', 'secTect', 'secCorti', 'secGanglion', 'secFibers'];
const CORTI = ['cBM', 'cLamina', 'cLimbus', 'cTect', 'cStripe', 'cRetic', 'cSupport', 'cIHC', 'cIHCcilia', 'cPillars', 'cTunnel', 'cNuel', 'cOHC', 'cOHCcilia', 'cDeiters', 'cPhal', 'cHensen', 'cClaudius', 'cAff', 'cEff'];
const two = (...ids) => ids.flatMap((id) => [`${id}R`, `${id}L`]);
const STEM = ['medulla', 'pons', 'midbrain', 'collSup', 'thalamus', 'lentiform'];
const EARS = ['cochleaR', 'cochleaL', 'nerveTip', 'nerveR', 'nerveL', 'viiiR', 'viiiL'];
const NUCLEI = two('vcn', 'dcn', 'soc', 'ntb', 'nll', 'ic', 'mgb', 'heschl');
const TRACTS = ['trapezoid', ...two('stria', 'll', 'bic', 'rad')];
const PATH = [...STEM, ...EARS, ...NUCLEI, ...TRACTS, 'stgR', 'stgL', 'hemi'];

const SHELL = { cochleaR: { opacity: 0.24, litOpacity: 0.5 } };

// Come `selector` (opzioni statiche o a passi), con in più per ogni opzione:
// l'inquadratura (`focus`), lo stato del modello (`scene`, anche per singolo
// passo), le parti da togliere (`hide`). `rest`: parti mostrate con `base`
// quando nessuna opzione è scelta. `keep`: parti che non si attenuano.
function stage({ focus, base = [], rest = [], options, looks = {}, pick = {}, idle = '', initial = null, keep = [] }) {
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
      const hidden = new Set(o?.hide ?? []);
      const ids = o ? [...base, ...(o.show ?? []), ...(o.lit ?? []), ...(o.steps?.flatMap((s) => s.ids) ?? [])] : [...base, ...rest];
      model.show(ids.filter((id) => !hidden.has(id)));
      model.setFocus(o?.focus ?? focus);
      model.setLabels(o?.labels ?? {});
      model.setScene(o?.scene);
      if (!o?.steps) {
        model.showLinks(o?.links ?? []);
        info.text = o?.info ?? idle;
      }
    };
    return {
      enter() {
        select(initial);
        model.onClick = (id) => id in pick && select(pick[id]);
        model.lookFn = (part) => {
          const o = options[sel];
          const look = { ...looks[part.id] };
          if (!o) return look;
          if (o.dead?.includes(part.id)) return { ...look, dead: true };
          if (o.steps) {
            const k = stepOf(o);
            if (o.steps[k].ids.includes(part.id)) return part.ghost ? { ...look, glow: 0.55 } : { ...look, glow: 0.55, opacity: look.litOpacity ?? 1 };
            if (o.steps.slice(0, k).some((s) => s.ids.includes(part.id))) return { ...look, glow: 0.15, opacity: look.litOpacity ?? look.opacity };
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
        model.setScene(o.steps[k].scene ?? o.scene);
      },
    };
  };
}

const spreads = [
  {
    title: 'La chiocciola',
    body:
      "Il dotto cocleare compie tre giri di raggio decrescente, {basale|base}, {intermedio|mid} e {apicale|apex} (quest'ultimo di soli ¾ di giro), attorno a un asse osseo centrale, il {modiolo|modiolus}. Il dotto membranoso divide il canale osseo in due porzioni: superiormente la {scala vestibolare|sv}, in comunicazione con il vestibolo; inferiormente la {scala timpanica|st}, in comunicazione con la {finestra rotonda|rw}, chiusa dal timpano secondario. Le due scale comunicano nell'{elicotrema|helico}. Nel modiolo il canale di Rosenthal ospita il {ganglio spirale del Corti|ganglion}, le cui fibre centrali formano il {nervo cocleare|nerve}.",
    terms: { base: ['ductBase'], mid: ['ductMid'], apex: ['ductApex'], modiolus: ['modiolus'], sv: ['scalaV'], st: ['scalaT'], rw: ['roundWindow'], helico: ['helico'], ganglion: ['ganglion'], nerve: ['nerveTip'] },
    quiz: {
      question: 'Dove comunicano la scala vestibolare e la scala timpanica?',
      options: ['Nel vestibolo', "Nell'elicotrema", 'Nel canale di Rosenthal', 'Alla finestra rotonda'],
      correct: 1,
      explain: "Le due scale, separate dal dotto cocleare lungo tutti i giri, comunicano solo all'apice, nell'elicotrema.",
    },
    caption: "Chiocciola destra reale (Z-Anatomy) in trasparenza, ruotata con l'apice in alto; scale, dotto, modiolo e ganglio ricostruiti al suo interno.",
    instruction: 'SCEGLI UNA PARTE DELLA CHIOCCIOLA',
    view: { yaw: 0, zoom: 1.15 },
    mode: stage({
      focus: 'cochlea',
      base: COCH,
      looks: SHELL,
      keep: ['labyrinth'],
      idle: 'In avorio trasparente la chiocciola ossea; dentro, le due scale (azzurro e viola) e il dotto cocleare.',
      pick: { ductBase: 0, ductMid: 0, ductApex: 0, modiolus: 1, scalaV: 2, scalaT: 3, roundWindow: 3, helico: 4, ganglion: 5, nerveTip: 5 },
      options: [
        { label: 'Tre giri', lit: DUCTS, labels: { ductBase: 'basale', ductMid: 'intermedio', ductApex: 'apicale' }, info: 'Giro basale, intermedio e apicale, di raggio decrescente: il terzo è di soli ¾ di giro.' },
        { label: 'Modiolo', lit: ['modiolus', 'ganglion'], hide: ['scalaV', 'scalaT'], info: "L'asse osseo centrale attorno a cui si avvolgono i giri: è scavato dai canali longitudinali, percorsi dalle fibre del ganglio." },
        { label: 'Scala vestibolare', lit: ['scalaV', 'stapes'], info: 'Sopra il dotto cocleare, in comunicazione con il vestibolo, dove la staffa chiude la finestra ovale.' },
        { label: 'Scala timpanica', lit: ['scalaT', 'roundWindow'], labels: { roundWindow: 'finestra rotonda' }, info: 'Sotto il dotto cocleare: termina alla finestra rotonda, chiusa dal timpano secondario.' },
        { label: 'Elicotrema', lit: ['helico'], labels: { helico: 'elicotrema' }, info: "All'apice le due scale comunicano tra loro." },
        { label: 'Ganglio del Corti', lit: ['ganglion', 'nerveTip'], hide: ['scalaV', 'scalaT'], info: 'Nel canale di Rosenthal: i rami periferici vanno alle cellule capellute, quelli centrali formano il nervo cocleare.' },
      ],
    }),
  },
  {
    title: 'Il dotto cocleare',
    body:
      "Il dotto cocleare ha due pareti. La parete vestibolare è la {membrana di Reissner|reissner}, un epitelio piatto e molto sottile che separa la {scala vestibolare|sv} dal {dotto|duct}: trasmette la pressione dalla perilinfa all'endolinfa. La parete timpanica comprende il {lembo spirale|limbus}, le cui cellule producono la {membrana tectoria|tect}, e la {membrana basilare|bm}, più spessa, tesa dalla {lamina spirale ossea|lamina} al {legamento spirale|lig}: separa il dotto dalla {scala timpanica|st} e sostiene l'{organo del Corti|corti}. Sul legamento spirale la {stria vascolare|stria}, fortemente vascolarizzata, produce la maggior parte dell'endolinfa.",
    terms: { reissner: ['secReissner'], sv: ['secSV'], duct: ['secDuct'], limbus: ['secLimbus'], tect: ['secTect'], bm: ['secBM'], lamina: ['secLamina'], lig: ['secLig'], st: ['secST'], corti: ['secCorti'], stria: ['secStria'] },
    quiz: {
      question: "Quale struttura produce la maggior parte dell'endolinfa?",
      options: ['La membrana di Reissner', 'Il lembo spirale', 'La stria vascolare', 'La membrana basilare'],
      correct: 2,
      explain: 'La stria vascolare, epitelio a tre strati sul legamento spirale: le sue cellule marginali, ricche di mitocondri, producono endolinfa.',
    },
    caption: "Sezione schematica ingrandita di un giro: modiolo a sinistra, apice in alto. In alto a sinistra la chiocciola reale.",
    instruction: 'SCEGLI UNA PARETE O UNO SPAZIO',
    view: { yaw: 0, zoom: 1.15 },
    mode: stage({
      focus: 'section',
      base: [...THUMB, ...SEC],
      looks: SHELL,
      keep: ['secBone', ...THUMB],
      idle: 'Azzurro e viola: perilinfa delle due scale. Verde acqua: endolinfa del dotto cocleare.',
      pick: { secSV: 0, secST: 0, secReissner: 1, secLimbus: 2, secTect: 2, secBM: 3, secLamina: 3, secCorti: 3, secStria: 4, secLig: 4, secGanglion: 5, secFibers: 5 },
      options: [
        { label: 'Scale', lit: ['secSV', 'secST'], labels: { secSV: 'scala vestibolare', secST: 'scala timpanica' }, info: 'Sopra il dotto la scala vestibolare, sotto la scala timpanica: entrambe contengono perilinfa.' },
        { label: 'Membrana di Reissner', lit: ['secReissner', 'secDuct'], labels: { secReissner: 'Reissner' }, info: "Sottile e deformabile: la sua unica funzione è trasmettere la pressione dalla perilinfa all'endolinfa." },
        { label: 'Lembo e tectoria', lit: ['secLimbus', 'secTect'], labels: { secTect: 'membrana tectoria' }, info: "Il lembo spirale produce la membrana tectoria, cupola gelatinosa di glicoproteine che fa da tetto all'organo del Corti." },
        { label: 'Membrana basilare', lit: ['secBM', 'secLamina', 'secCorti'], labels: { secCorti: 'organo del Corti' }, info: "Tesa dalla lamina spirale ossea al legamento spirale: sostiene l'organo del Corti." },
        { label: 'Stria vascolare', lit: ['secStria', 'secLig'], labels: { secStria: 'stria vascolare' }, info: "Tre strati (marginale, intermedio, basale) sul legamento spirale: produce la maggior parte dell'endolinfa." },
        { label: 'Ganglio del Corti', lit: ['secGanglion', 'secFibers'], labels: { secGanglion: 'ganglio spirale' }, info: 'Nel canale di Rosenthal del modiolo: i rami periferici raggiungono le cellule capellute attraverso la lamina spirale.' },
      ],
    }),
  },
  {
    title: "L'organo del Corti",
    body:
      "Sulla membrana basilare poggia l'organo del Corti. Le {cellule capellute interne|ihc}, a fiasca, stanno su un'unica fila: sono circa 3500, ma da esse deriva il 95% delle fibre del nervo cocleare. Le {cellule capellute esterne|ohc}, a bastoncello, circa 13.500, formano 3-5 file e sono accolte nelle nicchie delle {cellule di Deiters|deiters}. Tra le une e le altre i {pilastri|pillars} delimitano la {galleria del Corti|tunnel}, in continuità con gli {spazi di Nuel|nuel}: contengono cortilinfa. La {membrana tectoria|tect} accoglie le stereociglia delle sole capellute esterne. Lateralmente stanno le cellule di {Hensen|hensen} e di {Claudius|claudius}.",
    terms: { ihc: ['cIHC', 'cIHCcilia'], ohc: ['cOHC', 'cOHCcilia'], deiters: ['cDeiters', 'cPhal'], pillars: ['cPillars'], tunnel: ['cTunnel'], nuel: ['cNuel'], tect: ['cTect'], hensen: ['cHensen'], claudius: ['cClaudius'] },
    quiz: {
      question: 'Da quali cellule deriva il 95% delle fibre del nervo cocleare?',
      options: ['Dalle capellute esterne, più numerose', 'Dalle capellute interne', 'Dalle cellule di Deiters', 'Dalle cellule di Hensen'],
      correct: 1,
      explain: 'Le capellute interne sono circa 3500 contro 13.500 esterne, ma ricevono il 95% delle fibre afferenti.',
    },
    caption: 'Organo del Corti, schema ingrandito: modiolo a sinistra. Tre cellule per fila; davanti, le fibre afferenti (gialle) ed efferenti (viola).',
    instruction: "SCEGLI UN ELEMENTO DELL'ORGANO DEL CORTI",
    view: { yaw: 0, zoom: 1.15 },
    mode: stage({
      focus: 'corti',
      base: [...THUMB, ...CORTI],
      looks: SHELL,
      keep: THUMB,
      idle: 'Rosso: capellute interne. Verde: esterne. Arancio: cellule di Deiters. Azzurro: cortilinfa.',
      pick: { cIHC: 0, cIHCcilia: 0, cOHC: 1, cOHCcilia: 1, cPillars: 2, cTunnel: 2, cDeiters: 3, cPhal: 3, cNuel: 3, cHensen: 4, cClaudius: 4, cTect: 5, cStripe: 5, cAff: 2, cEff: 2 },
      options: [
        { label: 'Capellute interne', lit: ['cIHC', 'cIHCcilia', 'cAff'], labels: { cIHC: 'interne' }, info: "A fiasca, su un'unica fila, senza chinociglio: circa 3500, contattate dai neuroni oppositopolari del ganglio." },
        { label: 'Capellute esterne', lit: ['cOHC', 'cOHCcilia'], labels: { cOHC: 'esterne' }, info: 'A bastoncello, su più file: 3 nel giro basale, 4 nell’intermedio, 5 nell’apicale. Circa 13.500, contrattili.' },
        { label: 'Galleria e cortilinfa', lit: ['cPillars', 'cTunnel', 'cNuel', 'cAff', 'cEff'], links: ['c-fire'], labels: { cTunnel: 'galleria del Corti' }, info: 'Tra i pilastri la galleria del Corti: come gli spazi di Nuel contiene cortilinfa, povera di K+, che lascia condurre le fibre che la attraversano.' },
        { label: 'Deiters e Nuel', lit: ['cDeiters', 'cPhal', 'cNuel', 'cRetic'], labels: { cRetic: 'membrana reticolare' }, info: 'La cellula di Deiters accoglie la capelluta esterna; la sua falange forma la membrana reticolare. Tra le due lo spazio di Nuel.' },
        { label: 'Hensen e Claudius', lit: ['cHensen', 'cClaudius'], labels: { cHensen: 'Hensen', cClaudius: 'Claudius' }, info: 'Cellule di sostegno laterali: quelle di Claudius riciclano il potassio verso la stria vascolare.' },
        { label: 'Membrana tectoria', lit: ['cTect', 'cStripe', 'cOHCcilia'], labels: { cStripe: 'stria di Hensen' }, info: 'Accoglie le stereociglia delle capellute esterne; non tocca mai le interne, neppure con la stria di Hensen.' },
      ],
    }),
  },
  {
    title: "Dall'onda alla scarica",
    body:
      "La base della {staffa|stapes} comprime la perilinfa del vestibolo: l'onda pressoria sale nella {scala vestibolare|sv} fino all'{elicotrema|helico}, ridiscende nella {scala timpanica|st} e si sfoga sulla {membrana secondaria del timpano|rw}. La membrana basilare si allarga dal {giro basale|base} (100 micron) all'{apicale|apex} (400-500): le corde acustiche corte entrano in risonanza con i toni alti, le lunghe con i bassi. Le {capellute esterne|ohc}, contrattili grazie alla prestina, amplificano il movimento e rendono la risonanza puntiforme; le correnti di endolinfa spostano poi le stereociglia delle {capellute interne|ihc}, che liberano glutammato.",
    terms: { stapes: ['stapes'], sv: ['scalaV'], helico: ['helico'], st: ['scalaT'], rw: ['roundWindow'], base: ['ductBase'], apex: ['ductApex'], ohc: ['cOHC'], ihc: ['cIHC'] },
    quiz: {
      question: 'Secondo la teoria di Von Békésy, che cosa rende puntiforme la risonanza della membrana basilare?',
      options: ['La larghezza della membrana basilare', 'Le cellule capellute esterne', 'Le cellule capellute interne', 'La membrana di Reissner'],
      correct: 1,
      explain: 'Le capellute esterne funzionano da amplificatori: nel punto di massima risonanza sono massimamente eccitate e affinano la discriminazione tonale.',
    },
    caption: "L'onda pressoria nella chiocciola reale; poi, nell'organo del Corti ingrandito, il movimento (esagerato) delle capellute esterne.",
    instruction: "SEGUI L'ONDA, POI GUARDA LE CELLULE CAPELLUTE",
    view: { yaw: 0, zoom: 1.15 },
    mode: stage({
      focus: 'cochlea',
      rest: COCH,
      looks: SHELL,
      keep: ['labyrinth', 'cochleaR', ...THUMB],
      initial: 0,
      idle: 'Scegli un pulsante: la chiocciola per l’onda e i toni, l’organo del Corti per le cellule.',
      options: [
        {
          label: 'Onda pressoria', show: COCH, hide: DUCTS, stepTime: 2.4,
          steps: [
            { ids: ['stapes'], links: ['w-stapes', 'w-vest'], text: 'La base della staffa comprime la perilinfa del vestibolo.' },
            { ids: ['scalaV'], links: ['w-sv'], text: "L'onda pressoria sale nella scala vestibolare fino al giro apicale." },
            { ids: ['helico'], links: ['w-helico'], text: "All'elicotrema la pressione passa nella scala timpanica." },
            { ids: ['scalaT'], links: ['w-st'], text: 'Ridiscende lungo la scala timpanica, spingendo la membrana basilare.' },
            { ids: ['roundWindow'], links: ['w-rw'], text: 'La membrana secondaria del timpano protrude verso la cassa: è lo sfogo pressorio.' },
          ],
        },
        { label: 'Toni alti', show: COCH, hide: ['scalaV', 'scalaT'], lit: ['ductBase'], labels: { ductBase: 'toni alti' }, info: 'Giro basale: membrana basilare larga 100 micron, corde acustiche corte, che entrano in risonanza con i toni alti.' },
        { label: 'Toni bassi', show: COCH, hide: ['scalaV', 'scalaT'], lit: ['ductApex'], labels: { ductApex: 'toni bassi' }, info: 'Giro apicale: membrana basilare larga 400-500 micron, corde acustiche lunghe, che risuonano con i toni bassi.' },
        {
          label: 'Capellute esterne', focus: 'corti', show: [...THUMB, ...CORTI], stepTime: 4,
          steps: [
            { ids: ['cOHC', 'cOHCcilia'], scene: { ohc: -1 }, text: 'Onda nella scala vestibolare: la capelluta esterna si iperpolarizza e si allunga, la basilare scende.' },
            { ids: ['cOHC', 'cBM'], scene: { ohc: 1 }, text: 'Onda nella scala timpanica: la basilare sale, la capelluta esterna si depolarizza e si contrae.' },
            { ids: ['cOHC', 'cBM', 'cDeiters'], scene: { ohc: 'osc' }, text: 'Così le capellute esterne amplificano il movimento della membrana basilare.' },
          ],
        },
        {
          label: 'Capellute interne', focus: 'corti', show: [...THUMB, ...CORTI], scene: { ohc: 'osc' }, stepTime: 3.2,
          steps: [
            { ids: ['cIHCcilia', 'cOHCcilia', 'cTect'], text: 'Il movimento genera correnti di endolinfa, che spostano le stereociglia delle capellute interne.' },
            { ids: ['cIHC'], text: 'I tip-link si tendono: entra K+, la cellula si depolarizza e si aprono i canali del calcio.' },
            { ids: ['cAff'], links: ['c-fire'], text: 'Il corpo sinaptico si fonde con la membrana: glutammato sulla fibra afferente.' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Dalla chiocciola alla corteccia',
    body:
      "Dal {ganglio del Corti|cochlea} il {nervo cocleare|nerve} raggiunge i nuclei cocleari. Dal {nucleo dorsale|dcn} le strie acustiche dorsali si incrociano interamente e salgono come {lemnisco laterale|ll} al {collicolo inferiore|ic}; il braccio quadrigeminale inferiore porta al {corpo genicolato mediale|mgb} e il braccio sottolenticolare della capsula interna alla {corteccia uditiva primaria|heschl}, aree 41 e 42. Dal {nucleo ventrale|vcn} le strie ventrali in parte si incrociano, in parte proseguono ipsilateralmente, con stazioni nel nucleo del {corpo trapezoide|ntb}, nell'{olivare superiore|soc} e nel {nucleo del lemnisco laterale|nll}: gli stimoli arrivano alla corteccia in maniera bilaterale.",
    terms: {
      cochlea: ['cochleaR', 'cochleaL'], nerve: ['nerveR', 'viiiR', 'nerveL', 'viiiL'], dcn: two('dcn'), ll: two('ll'), ic: two('ic'), mgb: two('mgb'),
      heschl: two('heschl'), vcn: two('vcn'), ntb: [...two('ntb'), 'trapezoid'], soc: two('soc'), nll: two('nll'),
    },
    quiz: {
      question: 'Perché la lesione delle aree 41 e 42 di un solo emisfero provoca soltanto ipoacusia?',
      options: [
        'Perché la via acustica non si incrocia mai',
        'Perché gli stimoli di ogni orecchio raggiungono la corteccia dei due lati',
        "Perché l'area 22 sostituisce la corteccia primaria",
        'Perché il collicolo inferiore basta a udire',
      ],
      correct: 1,
      explain: 'Le strie ventrali si incrociano solo in parte: gli stimoli uditivi sono trasmessi alla corteccia in maniera bilaterale.',
    },
    caption: 'Tronco, talamo, lobi temporali e chiocciole reali (Z-Anatomy); nuclei e fasci della via acustica ricostruiti al loro interno. Lo stimolo entra da destra.',
    instruction: 'SEGUI LA VIA DAL NUCLEO DORSALE E DAL VENTRALE',
    view: { yaw: 0.25, zoom: 1.15 },
    mode: stage({
      focus: 'head',
      base: PATH,
      idle: "La via acustica dentro l'encefalo: scegli un pulsante per avvicinarti al tronco.",
      pick: { dcnR: 1, vcnR: 2, heschlR: 3, heschlL: 3, stgR: 3, stgL: 3, socR: 5 },
      options: [
        {
          label: 'Stazioni', focus: 'path', hide: ['hemi'], lit: NUCLEI,
          labels: { vcnR: 'nuclei cocleari', nllL: 'nuclei del lemnisco', icR: 'collicolo inferiore', heschlL: 'aree 41-42' },
          info: 'Nuclei cocleari, olivare superiore e nucleo del corpo trapezoide, nuclei del lemnisco laterale, collicolo inferiore, genicolato mediale, corteccia.',
        },
        {
          label: 'Dal nucleo dorsale', focus: 'path', hide: ['hemi'], stepTime: 2.6,
          steps: [
            { ids: ['cochleaR', 'nerveR', 'viiiR'], links: ['p-nerve'], text: 'Dal ganglio del Corti il nervo cocleare destro raggiunge i nuclei cocleari.' },
            { ids: ['dcnR'], links: ['p-dcn'], text: 'Nucleo cocleare dorsale: il più evoluto e meno frammentato.' },
            { ids: ['striaR'], links: ['p-stria'], text: 'Le strie acustiche dorsali si incrociano interamente.' },
            { ids: ['llL', 'icL'], links: ['p-ll-L'], text: 'Salgono come lemnisco laterale fino al collicolo inferiore.' },
            { ids: ['bicL', 'mgbL'], links: ['p-bic-L'], text: 'Braccio quadrigeminale inferiore › corpo genicolato mediale.' },
            { ids: ['radL', 'heschlL'], links: ['p-rad-L'], text: 'Braccio sottolenticolare della capsula interna › corteccia uditiva primaria.' },
          ],
        },
        {
          label: 'Dal nucleo ventrale', focus: 'path', hide: ['hemi'], stepTime: 2.6,
          steps: [
            { ids: ['cochleaR', 'nerveR', 'viiiR', 'vcnR'], links: ['p-nerve'], text: 'Nucleo cocleare ventrale: più arcaico e frammentato.' },
            { ids: ['trapezoid', 'ntbR', 'ntbL', 'socR', 'socL'], links: ['p-tb-x', 'p-tb-i'], text: 'Strie ventrali: in parte incrociate, in parte ipsilaterali; nucleo del corpo trapezoide e olivare superiore.' },
            { ids: ['llR', 'llL', 'nllR', 'nllL', 'icR', 'icL'], links: ['p-ll-R', 'p-ll-L'], text: 'Lemnisco laterale dei due lati, con il suo nucleo, fino ai collicoli inferiori.' },
            { ids: ['bicR', 'bicL', 'mgbR', 'mgbL'], links: ['p-bic-R', 'p-bic-L'], text: 'Corpi genicolati mediali dei due lati.' },
            { ids: ['radR', 'radL', 'heschlR', 'heschlL'], links: ['p-rad-R', 'p-rad-L'], text: 'Gli stimoli di un orecchio arrivano alla corteccia in maniera bilaterale.' },
          ],
        },
        {
          label: 'Corteccia uditiva', lit: [...two('heschl'), 'stgR', 'stgL'], labels: { heschlR: 'aree 41 e 42', stgL: 'area 22' },
          info: 'Giro di Heschl (41, 42): tonotopia medio-laterale, toni alti mediali e bassi laterali. Attorno, a cintura, l’area 22 associativa.',
        },
        {
          label: 'Lesione 41-42', focus: 'path', hide: ['hemi'], dead: ['heschlL'], lit: ['cochleaR', 'nerveR', 'viiiR', 'heschlR', 'radR', 'mgbR', 'icR'], links: ['p-nerve', 'p-tb-i', 'p-ll-R', 'p-bic-R', 'p-rad-R'],
          info: "Lesa la corteccia primaria di un emisfero resta la via dell'altro lato: solo ipoacusia. La lesione dell'area 22 impedisce invece di riconoscere i suoni.",
        },
        {
          label: 'Fascio di Rasmussen', focus: 'path', hide: ['hemi'], lit: ['socR', 'viiiR', 'nerveR', 'cochleaR'], links: ['p-ocb'], labels: { socR: 'olivare superiore' },
          info: 'Fibre efferenti dal nucleo olivare superiore alle cellule recettoriali: decorrono nella componente vestibolare, poi passano alla cocleare (anastomosi di Oort).',
        },
      ],
    }),
  },
];

export default {
  id: 'sistema-uditivo',
  title: 'Sistema uditivo',
  blurb: 'Chiocciola, organo del Corti e via acustica fino alla corteccia.',
  part: 'Organi di senso',
  order: 55,
  model: 'sistema-uditivo',
  createModel: () => new AuditoryModel(),
  yaw: 0,
  spreads,
};
