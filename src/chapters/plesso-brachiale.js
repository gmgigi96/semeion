// Capitolo "Plesso brachiale": cinque doppie pagine, una sola idea ciascuna.
// Testi ricavati dagli appunti di neuroanatomia (3. Plesso brachiale).
// Il modello è fatto di mesh anatomiche reali (vedi src/models/plesso-brachiale.js):
// le interazioni lavorano sul grafo dei segmenti del plesso.
import * as THREE from 'three';
import { makeText, FONT } from '../ui.js';
import { W, chipsInto, infoText } from '../modes.js';
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
    view: { yaw: -0.35 },
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
    caption: 'Le fibre di ogni radice si distribuiscono a più tronchi secondari attraverso le anastomosi.',
    instruction: 'SCEGLI UNA RADICE E SEGUI LE SUE FIBRE',
    view: { yaw: -0.3 },
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
    view: { yaw: -0.3 },
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
    view: { yaw: -0.2 },
    mode: terminalsMode,
  },
  {
    title: 'Lesioni: che cosa si spegne',
    body:
      "Una lesione spegne tutto ciò che sta a valle: più è prossimale, più territori coinvolge. Il danno delle {radici alte|hi} (C5-C6) colpisce la spalla e la flessione del gomito; quello delle {radici basse|lo} (C8-T1) i muscoli intrinseci della mano. Più distalmente i quadri diventano tipici del singolo nervo: mano cadente per il {radiale|RAD}, mano ad uncino per l'{ulnare|ULN}, mano benedicente per il {mediano|MED}. Taglia il modello in un punto e osserva che cosa si spegne.",
    terms: { hi: ['C5', 'C6', 'U'], lo: ['C8', 'T1', 'L'], RAD: ['RAD'], ULN: ['ULN'], MED: ['MED'] },
    quiz: {
      question: "Un paziente non riesce a estendere la mano sull'avambraccio (mano cadente). Quale nervo è compromesso?",
      options: ['Nervo mediano', 'Nervo ulnare', 'Nervo radiale', 'Nervo muscolocutaneo'],
      correct: 2,
      explain: 'Il radiale innerva tutti gli estensori di polso e dita.',
    },
    caption: 'Le fibre interrotte si spengono; i nervi che ricevono da più vie restano accesi in parte.',
    instruction: 'CLICCA UN PUNTO DEL PLESSO PER TAGLIARLO',
    view: { yaw: -0.2 },
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
      model.focus(-0.13, 0.58, 1.9);
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

// 2 — le fibre di una radice lungo le anastomosi
async function fibresMode({ model, controls }) {
  let sel = null;
  let t0 = 0;
  const { chips, height } = await chipsInto(
    controls,
    ROOTS.map((r) => ({ label: r, onClick: () => select(sel === r ? null : r) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const reach = (r) =>
    CORDS.filter((c) => model.segs.get(c).roots.includes(r)).map((c) => model.segs.get(c).name.replace('tronco secondario ', ''));
  const select = (r) => {
    sel = r;
    t0 = model.time;
    chips.forEach((c, i) => c.setActive(ROOTS[i] === r, LEVEL_COLORS[ROOTS[i]]));
    info.text = r
      ? `Le fibre di ${r} raggiungono i tronchi secondari: ${reach(r).join(' e ')}.`
      : 'Radici, tronchi primari, rami di divisione, tronchi secondari, nervi: ogni tratto è un segmento distinto.';
  };
  return {
    enter() {
      select(null);
      model.show([...SPINE, 'rib1', 'clavicleG', ...PLEXUS]);
      model.setLabels(rootLabels());
      model.focus(-0.04, 0.5, 1.5);
      model.lookFn = (part) => {
        const seg = model.segs.get(part.id);
        if (!seg || !sel) return {};
        const on = seg.roots.includes(sel) && model.time - t0 > seg.depth * 0.14;
        return on ? { color: LEVEL_COLORS[sel], glow: 0.4 } : { color: DIM };
      };
      model.onClick = (id) => ROOTS.includes(id) && select(id);
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
      model.focus(-0.03, 0.47, 1.25, 0.5);
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
      model.focus(-0.03, 0.4, 1.25, 0.45);
      model.lookFn = (part) => {
        const seg = model.segs.get(part.id);
        if (!seg || !sel) return {};
        const top = model.segs.get(sel).depth;
        const on = path.has(seg.id) && model.time - t0 > (top - seg.depth) * 0.14;
        return on ? { color: LIT, glow: 0.5 } : { color: DIM };
      };
      model.onClick = (id) => {
        const t = id === 'MedL' || id === 'MedM' ? 'MED' : id;
        if (TERMINALS.includes(t)) select(t);
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

async function lesionMode({ model, controls }) {
  let fibres = null;
  const { chips, height } = await chipsInto(controls, [{ label: 'Ricuci il plesso', onClick: () => cut(null) }]);
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
  const cut = (id, t) => {
    model.setCut(id, t);
    fibres = model.aliveFibres();
    chips[0].group.visible = !!id;
    if (!id) {
      head.text = '';
      info.text = 'Nessuna lesione: tutte le fibre conducono.';
      return;
    }
    const seg = model.segs.get(id);
    const down = NAMED.filter((n) => fibres.get(n).after.size < model.segs.get(n).roots.length).map((n) => {
      const s = model.segs.get(n);
      return `${s.short} (${fibres.get(n).after.size ? 'in parte' : 'del tutto'})`;
    });
    head.text = `Lesione: ${seg.name}`;
    info.text = `${LESION[id]}\nSi spengono: ${down.join(', ')}.`;
  };
  return {
    enter() {
      cut(null);
      model.show([...SPINE, 'rib1', 'clavicleG', 'scapula', 'humerus', ...PLEXUS]);
      model.setLabels(Object.fromEntries(TERMINALS.map((t) => [t, model.segs.get(t).short])));
      model.focus(-0.03, 0.4, 1.25, 0.45);
      model.lookFn = (part) => {
        const seg = model.segs.get(part.id);
        if (!seg) return {};
        const f = fibres.get(seg.id);
        return { color: tone(seg, f.before), tail: { color: tone(seg, f.after) } };
      };
      model.onClick = (id, hit) => model.segs.has(id) && cut(id, model.cutFromHit(id, hit));
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
