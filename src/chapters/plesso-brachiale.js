// Capitolo "Plesso brachiale": cinque doppie pagine, una sola idea ciascuna.
// Testi ricavati dagli appunti di neuroanatomia (3. Plesso brachiale).
// Il modello è fatto di mesh anatomiche reali (vedi src/models/plesso-brachiale.js):
// le interazioni lavorano sul grafo dei segmenti del plesso.
import * as THREE from 'three';
import { makeText, FONT } from '../ui.js';
import { W, chipsInto, infoText, explore, picked } from '../modes.js';
import { PlessoBrachiale, ROOTS, LEVEL_COLORS, VARIANTS, NERVE, DIM, DEAD, LIT, TERMINALS } from '../models/plesso-brachiale.js';

const SPINE = ['vC3', 'vC4', 'vC5', 'vC6', 'vC7', 'vT1', 'vT2', 'vT3', 'discs'];
const TRUNKS = ['U', 'M', 'L'];
const DIVS_A = ['Ua', 'Ma', 'La'];
const DIVS_P = ['Up', 'Mp', 'Lp'];
const CORDS = ['LC', 'PC', 'MC'];
const NERVES = ['MCN', 'MedL', 'MedM', 'MED', 'ULN', 'AX', 'RAD', 'SS', 'LT'];
const CORE = [...TRUNKS, ...DIVS_A, ...DIVS_P, ...CORDS];
const PLEXUS = [...ROOTS, ...CORE, ...NERVES];
const SCALENES = ['scalA', 'scalM'];

// Primi piani (vedi «Primi piani» in docs/AUTHORING.md): il punto `at` del modello
// va sopra il centro della pagina, alla quota `height`.
const FOCUS = {
  roots: { at: [-0.11, 0.57, 0], scale: 1.9, height: 0.37, stand: false },
  plexus: { at: [-0.04, 0.5, 0], scale: 1.5, height: 0.37, stand: false },
  clavicle: { at: [-0.03, 0.46, 0.03], scale: 1.15, height: 0.38, stand: false },
  arm: { at: [-0.02, 0.39, 0], scale: 1.15, height: 0.34, stand: false },
  // radici e tronchi primari, un po' più in basso perché le vertebre non escano dal libro
  wiring: { at: [-0.12, 0.6, 0], scale: 1.7, height: 0.29, stand: false },
  cords: { at: [0, 0.48, 0], scale: 1.9, height: 0.26, stand: false },
  nerves: { at: [0.02, 0.42, 0], scale: 1.2, height: 0.25, stand: false },
};

const spreads = [
  {
    title: 'Cinque radici, da C5 a T1',
    body:
      "Il plesso brachiale è dedicato all'innervazione dell'arto superiore. Nasce dai {rami anteriori|roots} dei nervi spinali da C5 a T1: è la {conformazione classica|classic}. Esistono piccole variazioni fisiologiche, che non causano problemi: nel plesso {prefissato|pre} tutto scala di un livello verso l'alto, da C4 a C8; nel plesso {postfissato|post} scende di un livello, da C6 a T2. Dal collo le radici convergono lateralmente, verso la clavicola e il cavo ascellare.",
    terms: {
      roots: ROOTS,
      classic: ROOTS,
      pre: VARIANTS.pre.map((v) => v[0]),
      post: VARIANTS.post.map((v) => v[0]),
    },
    quiz: {
      question: 'In un plesso postfissato, da quali radici nasce il plesso?',
      options: ['Da C4 a C8', 'Da C5 a T1', 'Da C6 a T2', 'Da C7 a T3'],
      correct: 2,
      explain: 'Postfissato: tutto scende di un livello.',
    },
    caption: 'Plesso brachiale destro, veduta anteriore: ogni radice esce dal proprio foro intervertebrale. Clavicola in trasparenza.',
    instruction: 'SCEGLI UNA CONFORMAZIONE · TRASCINA IL MODELLO PER RUOTARLO',
    view: { yaw: -0.35, focus: FOCUS.roots },
    mode: originMode,
  },
  {
    title: 'Tronchi primari e secondari',
    body:
      "Le radici si uniscono in tre tronchi primari: il {superiore|U} nasce dalla confluenza di C5 e C6, il {medio|M} continua C7, l'{inferiore|L} riunisce C8 e T1. Dietro il terzo medio della clavicola ogni tronco si divide in un {ramo anteriore|da} e uno {posteriore|dp}. I tre rami posteriori confluiscono nel {tronco secondario posteriore|PC}; i rami anteriori dei tronchi superiore e medio formano il {tronco secondario laterale|LC}; il ramo anteriore dell'inferiore prosegue come {tronco secondario mediale|MC}.",
    terms: { U: ['U'], M: ['M'], L: ['L'], da: DIVS_A, dp: DIVS_P, PC: ['PC'], LC: ['LC'], MC: ['MC'] },
    quiz: {
      question: 'Quali radici portano fibre al tronco secondario posteriore?',
      options: ['Solo C5 e C6', 'Solo C7', 'Solo C8 e T1', 'Tutte, da C5 a T1'],
      correct: 3,
      explain: 'Vi confluiscono i rami posteriori di tutti e tre i tronchi primari.',
    },
    caption: 'Ricostruisci il plesso: radici, tronchi primari, tronchi secondari, nervi. Ogni radice dà fibre a più tronchi secondari.',
    instruction: 'TENDI UN CAVO DA UNA RADICE AL SUO TRONCO · POI SCEGLI UNA RADICE',
    view: { yaw: -0.3, focus: FOCUS.plexus },
    mode: fibresMode,
  },
  {
    title: 'Sopra, dietro e sotto la clavicola',
    body:
      "Rispetto alla clavicola il plesso si divide in tre porzioni. La {porzione sopraclavicolare|supra}, con i tronchi primari, emerge nello {spazio interscalenico|scal}, tra scaleno anteriore e scaleno medio. La {porzione retroclavicolare|retro}, con i rami di divisione, attraversa lo {spazio costo-clavicolare|cc}, tra clavicola e {prima costa|rib}, insieme ai vasi succlavi. La {porzione sottoclavicolare|infra}, con i tronchi secondari, decorre nello {spazio subcoracoideo|sub}, dietro il {piccolo pettorale|pec}, attorno all'{arteria ascellare|art}. Gli ultimi due spazi sono possibili punti di compressione.",
    terms: {
      supra: TRUNKS,
      scal: SCALENES,
      retro: [...DIVS_A, ...DIVS_P],
      cc: ['costoclav', 'clavicle', 'rib1'],
      rib: ['rib1'],
      infra: CORDS,
      sub: ['subcorac', 'pecMinor'],
      pec: ['pecMinor'],
      art: ['artery'],
    },
    quiz: {
      question: "L'iperabduzione del braccio oltre i 90° (sindrome di Wright) comprime il plesso in quale spazio?",
      options: ['Spazio interscalenico', 'Spazio costo-clavicolare', 'Spazio subcoracoideo', 'Quadrilatero omerotricipitale'],
      correct: 2,
      explain: "In iperabduzione lo spazio subcoracoideo si riduce attorno ai tronchi secondari.",
    },
    caption: 'I rapporti del plesso con clavicola, prima costa, scaleni, arteria e piccolo pettorale.',
    instruction: 'ACCENDI E SPEGNI LE STRUTTURE · I PUNTI DI COMPRESSIONE SI EVIDENZIANO',
    view: { yaw: -0.3, focus: FOCUS.clavicle },
    mode: relationsMode,
  },
  {
    title: 'I rami terminali',
    body:
      "Dai tronchi secondari nascono i nervi per la parte libera dell'arto. Dal posteriore originano il {nervo ascellare|AX} (C5-C6) e il {nervo radiale|RAD} (C5-T1). Dal laterale il {nervo muscolocutaneo|MCN} (C5-C7) e la {radice laterale|MedL} del mediano. Dal mediale il {nervo ulnare|ULN} (C8-T1) e la {radice mediale|MedM} del mediano. Le due radici si uniscono davanti all'arteria ascellare nella forca del {nervo mediano|MED}, che riceve così fibre da tutte le radici del plesso.",
    terms: { AX: ['AX'], RAD: ['RAD'], MCN: ['MCN'], MedL: ['MedL'], ULN: ['ULN'], MedM: ['MedM'], MED: ['MED', 'MedL', 'MedM'] },
    quiz: {
      question: 'Quale nervo nasce da due tronchi secondari diversi?',
      options: ['Nervo radiale', 'Nervo ulnare', 'Nervo mediano', 'Nervo ascellare'],
      correct: 2,
      explain: 'Radice laterale dal tronco laterale, radice mediale dal tronco mediale.',
    },
    caption: 'Ogni nervo terminale si può risalire fino alle radici che gli forniscono le fibre.',
    instruction: 'SCEGLI UN NERVO: SI ILLUMINA A RITROSO FINO ALLE RADICI',
    view: { yaw: -0.2, focus: FOCUS.arm },
    mode: terminalsMode,
  },
  {
    title: 'Lesioni: che cosa si spegne',
    body:
      "Una lesione spegne tutto ciò che sta a valle: più è prossimale, più territori coinvolge. Il danno delle {radici alte|hi} (C5-C6) colpisce la spalla e la flessione del gomito; quello delle {radici basse|lo} (C8-T1) i muscoli intrinseci della mano. Più distalmente i quadri diventano tipici del singolo nervo: mano cadente per il {radiale|RAD}, mano ad uncino per l'{ulnare|ULN}, mano benedicente per il {mediano|MED}. Taglia il modello in un punto e osserva che cosa si spegne.",
    terms: { hi: ['C5', 'C6', 'U'], lo: ['C8', 'T1', 'L'], RAD: ['RAD'], ULN: ['ULN'], MED: ['MED'] },
    quiz: {
      question: 'Taglia il plesso in un punto. Quali nervi terminali perdono fibre?',
      cut: { board: 'modello', hint: 'tocca il plesso sul modello per tagliarlo', again: 'Tocca il plesso per un altro taglio.' },
      explain: 'Una lesione spegne tutto ciò che sta a valle.',
    },
    caption: 'Le fibre interrotte si spengono; i nervi che ricevono da più vie restano accesi in parte.',
    instruction: 'TOCCA IL PLESSO PER TAGLIARLO · TOCCA I NERVI CHE PREVEDI SPENTI · CONFRONTA',
    view: { yaw: -0.2, focus: FOCUS.arm },
    mode: lesionMode,
  },
];

const rootLabels = () => Object.fromEntries(ROOTS.map((r) => [r, r]));

// 1 — conformazione classica, prefissata, postfissata
const VARIANT_INFO = {
  pre: 'Prefissato: le radici sono i rami anteriori da C4 a C8. Ogni tronco nasce un livello più in alto.',
  classic: 'Classico: C5 e C6 nel tronco superiore, C7 nel medio, C8 e T1 nell’inferiore.',
  post: 'Postfissato: le radici sono i rami anteriori da C6 a T2. Ogni tronco nasce un livello più in basso.',
};
async function originMode({ model, controls }) {
  const variants = [
    { label: 'Prefissato · C4-C8', key: 'pre' },
    { label: 'Classico · C5-T1', key: 'classic' },
    { label: 'Postfissato · C6-T2', key: 'post' },
  ];
  let current = 'classic';
  let peek = null;
  const { chips, height } = await chipsInto(
    controls,
    variants.map((v) => ({ label: v.label, onClick: () => ((current = v.key), (peek = null), apply()) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const base = [...SPINE, 'rib1', 'clavicleG', ...CORE];
  const apply = () => {
    const key = peek ?? current;
    model.show([...base, ...VARIANTS[key].map((v) => v[0])]);
    model.setLabels(Object.fromEntries(VARIANTS[key]));
    chips.forEach((c, i) => c.setActive(variants[i].key === key));
    info.text = VARIANT_INFO[key];
  };
  return {
    enter() {
      current = 'classic';
      peek = null;
      apply();
      model.lookFn = (part) => {
        const v = VARIANTS[peek ?? current].find((r) => r[0] === part.id);
        return v ? { color: LEVEL_COLORS[v[1]], glow: 0.12 } : {};
      };
    },
    // passando su «prefissato» o «postfissato» il plesso cambia conformazione
    onHoverSet(ids) {
      const next = ids.includes('pC4') ? 'pre' : ids.includes('qT2') ? 'post' : null;
      if (next === peek) return;
      peek = next;
      apply();
    },
  };
}

// 2 — «Ricostruisci il plesso»: un rompicapo a cavi, in tre tappe. Chi legge afferra
// una parte del plesso e tende un cavo fino alla parte in cui le sue fibre proseguono
// (vedi `setCables` nel modello): radici › tronchi primari, tronchi primari ›
// tronchi secondari (il collegamento accende il ramo anteriore o posteriore che lo
// realizza), tronchi secondari › nervi terminali. Un cavo sbagliato torna indietro
// e la riga di commento dice perché. A plesso completo le fibre di ogni radice
// corrono, del loro colore, fino ai nervi. I pulsanti delle radici mostrano poi le
// fibre di una radice lungo le anastomosi.
const LINKS = {
  // tronco primario + tronco secondario -> ramo di divisione che li unisce
  U: { LC: 'Ua', PC: 'Up' }, M: { LC: 'Ma', PC: 'Mp' }, L: { MC: 'La', PC: 'Lp' },
  // tronco secondario + nervo -> tratto che si accende
  LC: { MCN: 'MCN', MED: 'MedL' }, MC: { ULN: 'ULN', MED: 'MedM' }, PC: { AX: 'AX', RAD: 'RAD' },
};
const TRUNK_NAME = { U: 'superiore', M: 'medio', L: 'inferiore' };
const CORD_NAME = { LC: 'laterale', PC: 'posteriore', MC: 'mediale' };
const STAGES = [
  {
    name: 'Radici e tronchi primari', from: ROOTS, to: TRUNKS, focus: FOCUS.wiring, yaw: -0.9,
    pairs: { C5: ['U'], C6: ['U'], C7: ['M'], C8: ['L'], T1: ['L'] },
    hint: 'Afferra una radice e tendi il cavo fino al tronco primario in cui confluisce.',
    aim: 'un tronco primario',
    why: {
      U: 'il tronco superiore nasce dalla confluenza di C5 e C6.',
      M: 'il tronco medio è la continuazione del solo C7.',
      L: "il tronco inferiore riunisce C8 e T1.",
    },
    labels: { ...Object.fromEntries(ROOTS.map((r) => [r, r])), ...TRUNK_NAME },
  },
  {
    name: 'Tronchi secondari', from: TRUNKS, to: CORDS, focus: FOCUS.cords, yaw: -0.9,
    pairs: { U: ['LC', 'PC'], M: ['LC', 'PC'], L: ['MC', 'PC'] },
    hint: 'Ogni tronco si divide in due rami: collegalo ai suoi due tronchi secondari.',
    aim: 'un tronco secondario',
    why: {
      LC: 'il laterale nasce dai rami anteriori dei soli tronchi superiore e medio.',
      MC: "il mediale continua il ramo anteriore del solo tronco inferiore.",
    },
    labels: { ...TRUNK_NAME, ...CORD_NAME },
  },
  {
    name: 'Nervi terminali', from: CORDS, to: ['MCN', 'MedL', 'MedM', 'MED', 'ULN', 'AX', 'RAD'], focus: FOCUS.nerves, yaw: 0.3,
    pairs: { LC: ['MCN', 'MED'], MC: ['ULN', 'MED'], PC: ['AX', 'RAD'] },
    hint: 'Dai tronchi secondari ai nervi: ognuno ne dà due, il mediano nasce da due.',
    aim: 'un nervo terminale',
    why: {
      MCN: 'il muscolocutaneo nasce dal tronco secondario laterale (C5-C7).',
      MED: 'il mediano nasce con due radici, dal laterale e dal mediale.',
      ULN: "l'ulnare nasce dal tronco secondario mediale (C8-T1).",
      AX: "l'ascellare nasce dal tronco secondario posteriore (C5-C6).",
      RAD: 'il radiale prosegue il tronco secondario posteriore (C5-T1).',
    },
    labels: { ...CORD_NAME, MCN: 'muscolocutaneo', MED: 'mediano', ULN: 'ulnare', AX: 'ascellare', RAD: 'radiale' },
  },
];
const PUZZLE = 'Ricostruisci';
const DONE_INFO = 'Plesso completo: le fibre di ogni radice corrono, del suo colore, fino ai nervi. Scegli una radice per seguirla.';

async function fibresMode({ model, controls }) {
  let sel = null; // radice scelta (fuori dal rompicapo)
  let t0 = 0;
  let stage = -1; // tappa del rompicapo; -1: nessuna; STAGES.length: plesso completo
  let made = new Set(); // collegamenti fatti, «da>a»
  let lit = new Set(); // segmenti già ricostruiti
  let tDone = 0;
  let lastT = null;
  let yawTo = null; // ogni tappa gira il modello verso la veduta in cui le parti si separano
  const ex = explore(controls);
  for (const s of STAGES) ex.offer(s.name);
  const { chips, height } = await chipsInto(controls, [
    { label: PUZZLE, explore: false, onClick: () => start() },
    ...ROOTS.map((r) => ({ label: r, onClick: () => select(sel === r ? null : r) })),
  ]);
  const roots = chips.slice(1);
  const info = await infoText(controls, -height - 0.03);
  const reach = (r) =>
    CORDS.filter((c) => model.segs.get(c).roots.includes(r)).map((c) => model.segs.get(c).name.replace('tronco secondario ', ''));
  const nameOf = (id) => model.segs.get(id).name;
  const target = (id) => (id === 'MedL' || id === 'MedM' ? 'MED' : id);
  const count = (k) => Object.values(STAGES[k].pairs).flat().length;
  const progress = () => {
    const s = STAGES[stage];
    const n = [...made].filter((m) => s.from.includes(m.split('>')[0])).length;
    return `${s.name}: ${n} di ${count(stage)} collegamenti.`;
  };

  // la tappa k: che cosa si vede, che cosa si afferra, dove si tende il cavo
  const enterStage = (k) => {
    stage = k;
    if (k >= STAGES.length) {
      model.setCables(null);
      model.show([...SPINE, 'rib1', 'clavicleG', ...PLEXUS]);
      model.setLabels(rootLabels());
      model.showLinks(model.fibres);
      model.zoomTo(FOCUS.nerves);
      tDone = model.time;
      info.text = DONE_INFO;
      ex.found(STAGES.at(-1).name);
      return;
    }
    const s = STAGES[k];
    const shown = [...SPINE, 'rib1', 'clavicleG', ...ROOTS];
    if (k >= 1) shown.push(...TRUNKS, ...DIVS_A, ...DIVS_P, ...CORDS);
    if (k >= 2) shown.push('MCN', 'MedL', 'MedM', 'MED', 'ULN', 'AX', 'RAD');
    if (k === 0) shown.push(...TRUNKS);
    model.show(shown);
    model.showLinks([]);
    model.setLabels(s.labels);
    model.zoomTo(s.focus);
    yawTo = s.yaw;
    model.setCables({ from: s.from, to: s.to, drop });
    info.text = `${s.hint}\n${progress()}`;
  };
  // il cavo lasciato: giusto o sbagliato, e perché
  const drop = (from, to) => {
    const s = STAGES[stage];
    if (!to) {
      info.text = `Tendi il cavo da ${s.labels[from] === from ? from : `il ${nameOf(from)}`} fino a ${s.aim}, poi lascialo.\n${progress()}`;
      return false;
    }
    const t = target(to);
    const key = `${from}>${t}`;
    if (!s.pairs[from].includes(t)) {
      info.text = `No, ${ROOTS.includes(from) ? from : `il ${s.labels[from]}`} non va lì: ${s.why[t] ?? ''}\n${progress()}`;
      return false;
    }
    if (made.has(key)) {
      info.text = `Questo collegamento c'è già.\n${progress()}`;
      return false;
    }
    made.add(key);
    // si ricostruisce il tratto che porta le fibre: il tronco, il ramo e il tronco secondario, il nervo
    if (stage === 0) lit.add(t);
    else {
      lit.add(LINKS[from][t]);
      if (stage === 1) lit.add(t);
      if (lit.has('MedL') && lit.has('MedM')) lit.add('MED');
    }
    const n = [...made].filter((m) => s.from.includes(m.split('>')[0])).length;
    if (n < count(stage)) {
      const way = stage === 0 ? [from, nameOf(t)] : stage === 1 ? [nameOf(LINKS[from][t]), nameOf(t)] : [nameOf(from), nameOf(LINKS[from][t])];
      info.text = `Sì: ${way.join(' › ')}.\n${progress()}`;
      return true;
    }
    ex.found(s.name);
    enterStage(stage + 1);
    return true;
  };

  const start = () => {
    sel = null;
    made = new Set();
    lit = new Set(ROOTS);
    roots.forEach((c) => c.setActive(false));
    chips[0].setActive(true);
    enterStage(0);
  };
  const select = (r) => {
    sel = r;
    t0 = model.time;
    stage = -1;
    model.setCables(null);
    model.showLinks([]);
    model.zoomTo(FOCUS.nerves);
    yawTo = STAGES.at(-1).yaw;
    model.show([...SPINE, 'rib1', 'clavicleG', ...PLEXUS]);
    model.setLabels(rootLabels());
    chips[0].setActive(false);
    roots.forEach((c, i) => c.setActive(ROOTS[i] === r, LEVEL_COLORS[ROOTS[i]]));
    info.text = r
      ? `Le fibre di ${r} raggiungono i tronchi secondari: ${reach(r).join(' e ')}.`
      : 'Radici, tronchi primari, rami di divisione, tronchi secondari, nervi: ogni tratto è un segmento distinto.';
  };
  return {
    enter() {
      start();
      model.lookFn = (part) => {
        const seg = model.segs.get(part.id);
        if (!seg) return {};
        // il rompicapo: le radici del loro colore, i tratti ricostruiti accesi, quelli da
        // ricostruire in grigio; ciò che si può afferrare respira appena
        if (stage >= 0 && stage < STAGES.length) {
          const s = STAGES[stage];
          if (part.id === model.cableTarget) return { color: LIT, glow: 0.5 };
          const breath = s.from.includes(part.id) ? 0.12 + 0.1 * Math.sin(model.time * 3) : 0;
          if (ROOTS.includes(part.id)) return { color: LEVEL_COLORS[part.id], glow: breath };
          if (lit.has(part.id)) return { color: NERVE, glow: breath };
          return { color: DIM, opacity: 0.5 };
        }
        // plesso completo: un'onda di luce scende dalle radici ai nervi, tre volte
        if (stage === STAGES.length) {
          const t = model.time - tDone;
          const wave = t < 4.5 && Math.abs(((t * 1.4) % 1.5) * 4 - seg.depth) < 0.6;
          return wave ? { color: LIT, glow: 0.6 } : {};
        }
        if (!sel) return {};
        const on = seg.roots.includes(sel) && model.time - t0 > seg.depth * 0.14;
        return on ? { color: LEVEL_COLORS[sel], glow: 0.4 } : { color: DIM };
      };
      // fuori dal rompicapo, toccare una radice sul modello vale come il suo pulsante
      model.onClick = (id) => stage < 0 && ROOTS.includes(id) && (picked(controls, id), select(id));
    },
    update() {
      const dt = Math.min(0.5, model.time - (lastT ?? model.time));
      lastT = model.time;
      if (yawTo == null) return;
      model.yaw += (yawTo - model.yaw) * (1 - Math.exp(-dt * 4));
      if (Math.abs(yawTo - model.yaw) < 0.01) yawTo = null;
    },
  };
}

// 3 — rapporti con clavicola, scaleni, arteria, piccolo pettorale
async function relationsMode({ model, controls }) {
  const items = [
    { label: 'Clavicola e prima costa', ids: ['clavicle', 'rib1', 'subclavius'], on: true },
    { label: 'Scaleni', ids: SCALENES, on: false },
    { label: 'Arteria ascellare', ids: ['artery'], on: false },
    { label: 'Piccolo pettorale', ids: ['pecMinor'], on: false },
  ];
  const { chips, height } = await chipsInto(
    controls,
    items.map((it) => ({ label: it.label, onClick: () => ((it.on = !it.on), apply()) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const base = [...SPINE, 'rib2', 'manubrium', 'scapula', 'humerus', ...ROOTS, ...CORE, ...NERVES];
  const apply = () => {
    const shown = [...base];
    const labels = {};
    items.forEach((it, i) => {
      chips[i].setActive(it.on);
      if (it.on) shown.push(...it.ids);
    });
    if (items[0].on) {
      shown.push('costoclav');
      labels.costoclav = 'spazio costo-clavicolare';
    }
    if (items[3].on) {
      shown.push('subcorac');
      labels.subcorac = 'spazio subcoracoideo';
    }
    model.show(shown);
    model.setLabels(labels);
    const n = [items[0].on && 'costo-clavicolare', items[3].on && 'subcoracoideo'].filter(Boolean);
    info.text = n.length
      ? `In azzurro ${n.length > 1 ? 'gli spazi' : 'lo spazio'} ${n.join(' e ')}: qui il plesso può essere compresso.`
      : 'Tronchi primari sopra la clavicola, rami di divisione dietro, tronchi secondari sotto.';
  };
  return {
    enter() {
      items.forEach((it, i) => (it.on = i === 0));
      apply();
    },
  };
}

// 4 — da un nervo terminale a ritroso fino alle radici
const SHORT = { MCN: 'n. muscolocutaneo', MED: 'n. mediano', ULN: 'n. ulnare', RAD: 'n. radiale', AX: 'n. ascellare' };
const ORIGIN = {
  MCN: 'Tronco secondario laterale · fibre da C5, C6, C7',
  MED: 'Tronchi secondari laterale e mediale (forca del mediano) · fibre da C5 a T1',
  ULN: 'Tronco secondario mediale · fibre da C8, T1',
  RAD: 'Prosecuzione del tronco secondario posteriore · fibre da C5 a T1',
  AX: 'Tronco secondario posteriore · fibre da C5, C6',
};
async function terminalsMode({ model, controls }) {
  let sel = null;
  let path = new Set();
  let t0 = 0;
  const label = (id) => SHORT[id].replace('n. ', '');
  const { chips, height } = await chipsInto(
    controls,
    TERMINALS.map((id) => ({ label: label(id)[0].toUpperCase() + label(id).slice(1), onClick: () => select(sel === id ? null : id) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const select = (id) => {
    sel = id;
    t0 = model.time;
    path = id ? model.ancestors(id) : new Set();
    chips.forEach((c, i) => c.setActive(TERMINALS[i] === id));
    info.text = id ? ORIGIN[id] : 'Cinque nervi per la parte libera dell’arto: due dal tronco posteriore, uno dal laterale, uno dal mediale, uno da entrambi.';
    const labels = {};
    for (const t of id ? [id] : TERMINALS) labels[t] = model.segs.get(t).short;
    for (const r of id ? model.segs.get(id).roots : []) labels[r] = r;
    model.setLabels(labels);
  };
  return {
    enter() {
      select(null);
      model.show([...SPINE, 'rib1', 'clavicleG', 'scapula', 'humerus', ...PLEXUS]);
      model.lookFn = (part) => {
        const seg = model.segs.get(part.id);
        if (!seg || !sel) return {};
        const top = model.segs.get(sel).depth;
        const on = path.has(seg.id) && model.time - t0 > (top - seg.depth) * 0.14;
        return on ? { color: LIT, glow: 0.5 } : { color: DIM };
      };
      // toccare un nervo terminale sul modello vale come il suo pulsante
      model.onClick = (id) => {
        const t = id === 'MedL' || id === 'MedM' ? 'MED' : id;
        if (!TERMINALS.includes(t)) return;
        picked(controls, label(t)[0].toUpperCase() + label(t).slice(1));
        select(t);
      };
    },
  };
}

// 5 — lesioni
const HIGH = 'Paralisi alta (tipo Erb-Duchenne): deficit di abduzione e rotazione esterna della spalla, di flessione del gomito e di supinazione.';
const MID = "Lesione isolata rara: debolezza dell'estensione di gomito, polso e dita.";
const LOW = "Paralisi bassa (tipo Dejerine-Klumpke): deficit dei muscoli intrinseci della mano e dei flessori delle dita; ipoestesia del lato mediale di avambraccio e mano.";
const MEDIAN = 'Mano benedicente: deficit di pronazione, di flessione di pollice, indice e medio e di opposizione del pollice; ipoestesia palmare delle prime tre dita.';
const LESION = {
  C5: HIGH, C6: HIGH, U: HIGH, C7: MID, M: MID, C8: LOW, T1: LOW, L: LOW,
  Ua: 'Si interrompono le fibre C5-C6 dirette al tronco secondario laterale: flessione del gomito indebolita.',
  Ma: 'Si interrompono le fibre C7 dirette al tronco secondario laterale.',
  La: 'Equivale a una lesione del tronco secondario mediale: deficit dei muscoli intrinseci della mano.',
  Up: 'Si interrompono le fibre C5-C6 dirette al tronco secondario posteriore: deltoide ed estensori indeboliti.',
  Mp: 'Si interrompono le fibre C7 dirette al tronco secondario posteriore: estensori indeboliti.',
  Lp: 'Si interrompono le fibre C8-T1 dirette al tronco secondario posteriore: estensori delle dita indeboliti.',
  PC: 'Deficit del deltoide (n. ascellare) e di tutti gli estensori dell’arto (n. radiale): mano cadente.',
  LC: 'Deficit della flessione del gomito (n. muscolocutaneo) e di parte dei flessori dell’avambraccio (radice laterale del mediano).',
  MC: 'Deficit dei muscoli intrinseci della mano (n. ulnare e radice mediale del mediano): mano ad uncino.',
  AX: 'Deficit di deltoide e piccolo rotondo: abduzione del braccio compromessa; ipoestesia della regione laterale della spalla.',
  RAD: 'Mano cadente: impossibile estendere la mano sull’avambraccio; deficit del tricipite e degli estensori di polso e dita.',
  ULN: 'Mano ad uncino: deficit di interossei, lombricali III-IV ed eminenza ipotenar; ipoestesia del mignolo e della metà mediale dell’anulare.',
  MED: MEDIAN,
  MedL: 'Lesione parziale del mediano (fibre C5-C7): deficit di pronazione e dei flessori radiali; ipoestesia palmare delle prime dita.',
  MedM: 'Lesione parziale del mediano (fibre C8-T1): deficit dei muscoli dell’eminenza tenar e dei flessori delle dita.',
  MCN: 'Deficit di bicipite, brachiale e coracobrachiale: flessione del gomito indebolita; ipoestesia della regione laterale dell’avambraccio.',
  SS: 'Deficit di sovraspinato e infraspinato: avvio dell’abduzione e rotazione esterna della spalla.',
  LT: 'Paralisi del dentato anteriore: scapola alata.',
};
const NAMED = ['SS', 'LT', 'AX', 'RAD', 'MCN', 'MED', 'ULN'];

// I tagli contano come scoperte per tipo di segmento.
const KINDS = { root: 'Radici', trunk: 'Tronchi primari', div: 'Divisioni', cord: 'Tronchi secondari', nerve: 'Nervi terminali' };

// «Taglia e prevedi» (vedi cutQuiz in src/ui.js): dopo il taglio l'esito resta nascosto;
// chi legge tocca sul modello i nervi terminali che prevede spenti, del tutto o in parte,
// e la domanda chiede il confronto con `reveal`. Senza la domanda l'esito si vede subito.
async function lesionMode({ model, controls, quiz }) {
  let fibres = null;
  const asks = !!quiz?.cut;
  let shown = !asks;
  const ex = explore(controls);
  for (const k of Object.values(KINDS)) ex.offer(k);
  const { chips, height } = await chipsInto(controls, [{ label: 'Ricuci il plesso', onClick: () => cut(null), explore: false }]);
  const head = makeText('', { font: FONT.bold, fontSize: 0.023, anchorX: 'center', color: 0xb3261e });
  head.position.set(W / 2, -height - 0.028, head.position.z);
  controls.add(head);
  const info = await infoText(controls, -height - 0.066);

  const tone = (seg, set) => {
    const f = set.size / seg.roots.length;
    if (f >= 1) return NERVE;
    if (f <= 0) return DEAD;
    return new THREE.Color(DEAD).lerp(new THREE.Color(NERVE), 0.12 + 0.55 * f).getHex();
  };
  const named = (id) => (id === 'MedL' || id === 'MedM' ? 'MED' : id);
  const down = () => NAMED.filter((n) => fibres.get(n).after.size < model.segs.get(n).roots.length);
  const shortOf = (n) => model.segs.get(n).short;
  const report = (id) => {
    const list = down().map((n) => `${shortOf(n)} (${fibres.get(n).after.size ? 'in parte' : 'del tutto'})`);
    return `${LESION[id]}\nSi spengono: ${list.join(', ')}.`;
  };
  const labels = () => model.setLabels(Object.fromEntries(TERMINALS.map((t) => [t, model.segs.get(t).short])));
  const cut = (id, t) => {
    model.setCut(id, t);
    fibres = model.aliveFibres();
    shown = !asks;
    chips[0].group.visible = !!id;
    labels();
    // `at` basta a rifare lo stesso taglio alla prossima visita (vedi `replay`)
    quiz?.cut?.(id && { label: model.segs.get(id).name, truth: down(), at: { id, t: +t.toFixed(5) } });
    if (!id) {
      head.text = '';
      info.text = 'Nessuna lesione: tutte le fibre conducono.';
      return;
    }
    head.text = `Lesione: ${model.segs.get(id).name}`;
    if (shown) reveal();
    else info.text = 'Tocca sul modello i nervi terminali che prevedi spenti, poi confronta sulla pagina di sinistra.';
  };
  function reveal() {
    const id = model.cut?.id;
    if (!id) return;
    shown = true;
    info.text = report(id);
    ex.found(KINDS[model.segs.get(id).kind]);
    if (!asks) return;
    // accanto al nome di ogni nervo, l'esito del confronto
    const truth = new Set(down());
    const said = Object.fromEntries(TERMINALS.map((t) => [t, shortOf(t)]));
    for (const n of new Set([...truth, ...quiz.marks]))
      said[n] = `${shortOf(n)}: ${truth.has(n) ? (quiz.marks.has(n) ? 'coincide' : 'mancava') : 'di troppo'}`;
    model.setLabels(said);
  }
  return {
    reveal,
    // un taglio salvato da una visita precedente
    replay(at) {
      if (!model.segs.has(at?.id) || !Number.isFinite(at.t)) return false;
      const len = model.segs.get(at.id).len;
      cut(at.id, Math.min(len * 0.88, Math.max(len * 0.12, at.t)));
      return true;
    },
    enter() {
      model.show([...SPINE, 'rib1', 'clavicleG', 'scapula', 'humerus', ...PLEXUS]);
      cut(null);
      model.lookFn = (part) => {
        const seg = model.segs.get(part.id);
        if (!seg) return {};
        // prima del confronto il plesso resta acceso: si vede solo il segno del taglio
        if (!shown) return quiz?.marks?.has(named(part.id)) ? { color: 0xc2402b, glow: 0.3 } : { color: NERVE };
        const f = fibres.get(seg.id);
        return { color: tone(seg, f.before), tail: { color: tone(seg, f.after) } };
      };
      model.onClick = (id, hit) => {
        if (asks && quiz.state === 'mark') {
          if (NAMED.includes(named(id))) quiz.toggle(named(id));
          else info.text = 'Ora tocca i nervi terminali che prevedi spenti. Per tagliare altrove, ricuci.';
          return;
        }
        if (model.segs.has(id)) cut(id, model.cutFromHit(id, hit));
      };
    },
  };
}

export default {
  id: 'plesso-brachiale',
  title: 'Plesso brachiale',
  blurb: "Dalle radici C5-T1 ai nervi dell'arto superiore, fino alle lesioni.",
  part: 'Midollo e nervi spinali',
  order: 13,
  model: 'plesso-brachiale',
  createModel: () => new PlessoBrachiale(),
  yaw: -0.2,
  spreads,
};
