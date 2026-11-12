// Capitolo "Plesso brachiale": cinque doppie pagine, una sola idea ciascuna.
// Testi ricavati dagli appunti di neuroanatomia (3. Plesso brachiale).
import * as THREE from 'three';
import { makeText, FONT, INK, ACCENT } from '../ui.js';
import { W, chipsInto, infoText } from '../modes.js';
import { Plexus, ROOTS, ROOT_COLORS, LEVELS, NERVE, DIM, DEAD, LIT, TERMINALS } from '../plexus.js';

const lv = (...names) => names.map((n) => `lvl:${n}`);
const DIVS_A = ['Ua', 'Ma', 'La'];
const DIVS_P = ['Up', 'Mp', 'Lp'];

const spreads = [
  {
    title: 'Cinque radici, da C5 a T1',
    body:
      "Il plesso brachiale è dedicato all'innervazione dell'arto superiore. Nasce dai {rami anteriori|roots} dei nervi spinali da C5 a T1: è la {conformazione classica|classic}. Esistono piccole variazioni fisiologiche, che non causano problemi: nel plesso {prefissato|pre} tutto scala di un livello verso l'alto, da C4 a C8; nel plesso {postfissato|post} scende di un livello, da C6 a T2. Dal collo le radici convergono lateralmente, verso la clavicola e il cavo ascellare.",
    terms: {
      roots: ROOTS,
      classic: [...ROOTS, ...lv('C5', 'C6', 'C7', 'C8', 'T1')],
      pre: lv('C4', 'C5', 'C6', 'C7', 'C8'),
      post: lv('C6', 'C7', 'C8', 'T1', 'T2'),
    },
    quiz: {
      question: 'In un plesso postfissato, da quali radici nasce il plesso?',
      options: ['Da C4 a C8', 'Da C5 a T1', 'Da C6 a T2', 'Da C7 a T3'],
      correct: 2,
      explain: 'Postfissato: tutto scende di un livello.',
    },
    caption: 'Plesso brachiale sinistro, veduta anteriore. Le radici emergono dai forami intervertebrali.',
    instruction: 'SCEGLI UNA CONFORMAZIONE · TRASCINA IL MODELLO PER RUOTARLO',
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
    mode: fibresMode,
  },
  {
    title: 'Sopra, dietro e sotto la clavicola',
    body:
      "Rispetto alla clavicola il plesso si divide in tre porzioni. La {porzione sopraclavicolare|supra}, con i tronchi primari, emerge nello {spazio interscalenico|scal}, tra scaleno anteriore e scaleno medio. La {porzione retroclavicolare|retro}, con i rami di divisione, attraversa lo {spazio costo-clavicolare|cc}, tra clavicola e {prima costa|rib}, insieme ai vasi succlavi. La {porzione sottoclavicolare|infra}, con i tronchi secondari, decorre nello {spazio subcoracoideo|sub}, dietro il {piccolo pettorale|pec}, attorno all'{arteria ascellare|art}. Gli ultimi due spazi sono possibili punti di compressione.",
    terms: {
      supra: ['U', 'M', 'L'],
      scal: ['scalenes'],
      retro: [...DIVS_A, ...DIVS_P],
      cc: ['costoclav', 'clavicle', 'rib1'],
      rib: ['rib1'],
      infra: ['LC', 'PC', 'MC'],
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
    mode: lesionMode,
  },
];

// 1 — conformazione classica, prefissata, postfissata
async function originMode({ model: plexus, controls }) {
  const variants = [
    { label: 'Prefissato · C4–C8', shift: -1 },
    { label: 'Classico · C5–T1', shift: 0 },
    { label: 'Postfissato · C6–T2', shift: 1 },
  ];
  let current = 0;
  const { chips } = await chipsInto(
    controls,
    variants.map((v) => ({ label: v.label, onClick: () => select(v.shift) }))
  );
  const select = (shift) => {
    current = shift;
    plexus.setVariant(shift);
    chips.forEach((c, i) => c.setActive(variants[i].shift === shift));
  };
  return {
    enter() {
      select(0);
      plexus.labelFn = (name) => {
        const i = LEVELS.indexOf(name);
        if (plexus.hover.has(`lvl:${name}`)) return { opacity: 1, color: ACCENT };
        return i >= 1 + current && i <= 5 + current ? { opacity: 1, color: INK } : 0.2;
      };
    },
  };
}

// 2 — le fibre di una radice lungo le anastomosi
async function fibresMode({ model: plexus, controls }) {
  let sel = null;
  let t0 = 0;
  const { chips, height } = await chipsInto(
    controls,
    ROOTS.map((r) => ({ label: r, onClick: () => select(sel === r ? null : r) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const reach = (r) =>
    ['LC', 'PC', 'MC'].filter((c) => plexus.segs.get(c).roots.includes(r)).map((c) => plexus.segs.get(c).name.replace('tronco secondario ', ''));
  const select = (r) => {
    sel = r;
    t0 = plexus.time;
    chips.forEach((c, i) => c.setActive(ROOTS[i] === r, ROOT_COLORS[ROOTS[i]]));
    info.text = r ? `Le fibre di ${r} raggiungono i tronchi secondari: ${reach(r).join(' e ')}.` : '';
  };
  return {
    enter() {
      select(null);
      plexus.lookFn = (seg) => {
        if (!sel) return { color: NERVE };
        const on = seg.roots.includes(sel) && plexus.time - t0 > seg.depth * 0.14;
        return on ? { color: ROOT_COLORS[sel], glow: 0.4 } : { color: DIM };
      };
      plexus.labelFn = (n) => (!sel ? (ROOTS.includes(n) ? 0.75 : 0.22) : n === sel ? { opacity: 1, color: ROOT_COLORS[sel] } : 0.2);
      plexus.onClick = (id) => ROOTS.includes(id) && select(id);
    },
  };
}

// 3 — rapporti con clavicola, scaleni, arteria, piccolo pettorale
async function relationsMode({ model: plexus, controls }) {
  const items = [
    { label: 'Clavicola e prima costa', ids: ['clavicle', 'rib1'], on: true },
    { label: 'Scaleni', ids: ['scalenes'], on: false },
    { label: 'Arteria ascellare', ids: ['artery'], on: false },
    { label: 'Piccolo pettorale', ids: ['pecMinor'], on: false },
  ];
  const { chips } = await chipsInto(
    controls,
    items.map((it) => ({ label: it.label, onClick: () => ((it.on = !it.on), apply()) }))
  );
  let peek = [];
  const apply = () => {
    items.forEach((it, i) => {
      chips[i].setActive(it.on);
      for (const id of it.ids) plexus.setStructure(id, it.on || peek.includes(id));
    });
  };
  return {
    enter: apply,
    // passando su un termine, la struttura compare anche se è spenta
    onHoverSet(ids) {
      peek = ids.flatMap((id) => (id === 'costoclav' ? ['clavicle', 'rib1'] : id === 'subcorac' ? ['pecMinor'] : [id])).filter((id) => plexus.structs.has(id));
      apply();
    },
  };
}

// 4 — da un nervo terminale a ritroso fino alle radici
const ORIGIN = {
  MCN: 'Tronco secondario laterale · fibre da C5, C6, C7',
  MED: 'Tronchi secondari laterale e mediale (forca del mediano) · fibre da C5 a T1',
  ULN: 'Tronco secondario mediale · fibre da C8, T1',
  RAD: 'Prosecuzione del tronco secondario posteriore · fibre da C5 a T1',
  AX: 'Tronco secondario posteriore · fibre da C5, C6',
};
async function terminalsMode({ model: plexus, controls }) {
  let sel = null;
  let path = new Set();
  let t0 = 0;
  const label = (id) => plexus.segs.get(id).short.replace('n. ', '');
  const { chips, height } = await chipsInto(
    controls,
    TERMINALS.map((id) => ({ label: label(id)[0].toUpperCase() + label(id).slice(1), onClick: () => select(sel === id ? null : id) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const select = (id) => {
    sel = id;
    t0 = plexus.time;
    path = id ? plexus.ancestors(id) : new Set();
    chips.forEach((c, i) => c.setActive(TERMINALS[i] === id));
    info.text = id ? ORIGIN[id] : '';
  };
  return {
    enter() {
      select(null);
      plexus.showEndLabels(true);
      plexus.lookFn = (seg) => {
        if (!sel) return { color: NERVE };
        const top = plexus.segs.get(sel).depth;
        const on = path.has(seg.id) && plexus.time - t0 > (top - seg.depth) * 0.14;
        return on ? { color: LIT, glow: 0.5 } : { color: DIM };
      };
      plexus.labelFn = (n) => (!sel ? (ROOTS.includes(n) ? 0.75 : 0.22) : plexus.segs.get(sel).roots.includes(n) ? { opacity: 1, color: ACCENT } : 0.2);
      plexus.onClick = (id) => {
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

async function lesionMode({ model: plexus, controls }) {
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
    return new THREE.Color(DEAD).lerp(new THREE.Color(NERVE), 0.3 + 0.5 * f);
  };
  const cut = (id, k) => {
    plexus.setCut(id, k);
    fibres = plexus.aliveFibres();
    chips[0].group.visible = !!id;
    if (!id) {
      head.text = '';
      info.text = 'Nessuna lesione: tutte le fibre conducono.';
      return;
    }
    const seg = plexus.segs.get(id);
    const down = NAMED.filter((n) => fibres.get(n).after.size < plexus.segs.get(n).roots.length).map((n) => {
      const s = plexus.segs.get(n);
      return `${s.short ?? s.name.replace('nervo', 'n.')} (${fibres.get(n).after.size ? 'in parte' : 'del tutto'})`;
    });
    head.text = `Lesione: ${seg.name}`;
    info.text = `${LESION[id]}\nSi spengono: ${down.join(', ')}.`;
  };
  return {
    enter() {
      cut(null);
      plexus.showEndLabels(true);
      plexus.lookFn = (seg) => {
        const f = fibres.get(seg.id);
        return { color: tone(seg, f.before), tail: { color: tone(seg, f.after) } };
      };
      plexus.onClick = (id, hit) => plexus.segs.has(id) && cut(id, plexus.cutIndexFromHit(id, hit));
    },
  };
}

export default {
  id: 'plesso-brachiale',
  title: 'Plesso brachiale',
  blurb: "Dalle radici C5-T1 ai nervi dell'arto superiore, fino alle lesioni.",
  part: 'Midollo e nervi spinali',
  order: 13,
  model: 'plexus',
  createModel: () => new Plexus(),
  yaw: 0,
  spreads,
};
