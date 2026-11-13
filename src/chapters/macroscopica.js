// Capitolo "Encefalo: anatomia macroscopica". Testi dagli appunti di
// neuroanatomia (Macroscopica).
import { selector, chipsInto, infoText, picked } from '../modes.js';
import { Macroscopica } from '../models/macroscopica.js';

const FRONTAL = ['sfg', 'mfg', 'ifg', 'precentral', 'orbital'];
const PARIETAL = ['postcentral', 'spl', 'supramarginal', 'angular'];
const TEMPORAL = ['stg', 'mtg', 'itg', 'fusiform'];
const OCCIPITAL = ['occipital', 'cuneus', 'lingual'];
const MEDIAL = ['cingulate', 'parahippocampal', 'paracentral', 'precuneus'];
const INSULA = ['insulaS', 'insulaL'];
const LEFT = [...FRONTAL, ...PARIETAL, ...TEMPORAL, ...OCCIPITAL, ...MEDIAL];
const DIEN = ['thalamus', 'hypothalamus', 'pineal'];
// sezione sagittale mediana: metà sinistra delle strutture impari
const MID = ['callosum', 'septum', 'fornix', ...DIEN, 'chiasm', 'pituitary', 'midbrain', 'pons', 'medulla', 'cerebellum'];
const RIGHT = ['hemiR', 'midbrainR', 'ponsR', 'medullaR', 'cerebellumR'];
const SULCI_LAT = ['central', 'lateral', 'parietoOcc'];
const SULCI_MED = ['cingulateS', 'parietoOcc', 'calcarine'];
const OPERCULA = ['ifg', 'precentral', 'postcentral', 'supramarginal', 'stg'];
const pickAll = (ids, i) => Object.fromEntries(ids.map((id) => [id, i]));

// Pagina dell'insula: i giri che la coprono diventano trasparenti.
async function insulaMode({ model, controls }) {
  const base = [...LEFT, ...INSULA, 'lateral', ...MID];
  const options = [
    { label: 'Opercoli chiusi', info: "L'insula è nascosta in fondo al solco laterale: dall'esterno non si vede." },
    { label: 'Apri gli opercoli', open: true, info: "Triangolare, con l'apice in basso e in avanti e la base in alto." },
    { label: 'Circonvoluzione breve', open: true, lit: ['insulaS'], info: "La porzione anteriore, davanti al solco centrale dell'insula." },
    { label: 'Circonvoluzione lunga', open: true, lit: ['insulaL'], info: "La porzione posteriore, dietro il solco centrale dell'insula." },
  ];
  let sel = 0;
  const { chips, height } = await chipsInto(controls, options.map((o, i) => ({ label: o.label, onClick: () => select(i) })));
  const info = await infoText(controls, -height - 0.03);
  const select = (i) => {
    sel = i;
    chips.forEach((c, j) => c.setActive(j === i));
    info.text = options[i].info;
  };
  // toccare opercoli e insula sul modello vale come il pulsante corrispondente
  const touch = (i) => (picked(controls, options[i].label), select(i));
  return {
    enter() {
      select(0);
      model.show(base);
      model.onClick = (id) => {
        if (OPERCULA.includes(id) || id === 'lateral') touch(options[sel].open ? 0 : 1);
        else if (id === 'insulaS') touch(2);
        else if (id === 'insulaL') touch(3);
      };
      model.lookFn = (part) => {
        const o = options[sel];
        if (o.open && (OPERCULA.includes(part.id) || part.id === 'lateral')) return { opacity: 0.1 };
        if (o.lit) return o.lit.includes(part.id) ? { glow: 0.35 } : INSULA.includes(part.id) ? {} : { dim: true };
        return {};
      };
    },
  };
}

const spreads = [
  {
    title: "Le parti dell'encefalo",
    body:
      "L'encefalo ha la forma di un ovoide a maggior asse anteroposteriore, con un polo frontale più piccolo e un polo occipitale più grande. Il {telencefalo|tel} è diviso dalla scissura interemisferica in due emisferi, uniti dal {corpo calloso|cc}. Il {diencefalo|dien}, impari e mediano, è nascosto fra gli emisferi attorno al terzo ventricolo: il suo nucleo più voluminoso è il {talamo|thal}, con l'{ipotalamo|hypo} in basso e l'{epifisi|pineal} dietro. Il tronco encefalico comprende, in senso rostro-caudale, {mesencefalo|mes}, {ponte|pons} e {bulbo|bulb}.",
    terms: {
      tel: [...LEFT, 'hemiR'], cc: ['callosum'], dien: DIEN, thal: ['thalamus'], hypo: ['hypothalamus'], pineal: ['pineal'],
      mes: ['midbrain'], pons: ['pons'], bulb: ['medulla'],
    },
    quiz: {
      question: 'Quale struttura unisce i due emisferi cerebrali nel terzo medio della loro faccia mediale?',
      options: ['Il setto pellucido', 'Il corpo calloso', 'Il talamo', 'Il fornice'],
      correct: 1,
      explain: 'È un nastro di sostanza bianca, la principale struttura commessurale.',
    },
    caption: "Encefalo reale (mesh BodyParts3D) in sezione sagittale mediana: emisfero sinistro, faccia mediale.",
    instruction: "SCEGLI UNA PARTE · «EMISFERI» RIMETTE AL SUO POSTO L'EMISFERO DESTRO",
    view: { yaw: -1.25 },
    mode: selector({
      base: [...LEFT, ...MID],
      idle: "Tolto l'emisfero destro si vedono il diencefalo e il tronco, in continuità fino al bulbo.",
      pick: { ...pickAll(LEFT, 0), hemiR: 0, ...pickAll(DIEN, 1), midbrain: 2, pons: 3, medulla: 4 },
      options: [
        { label: 'Emisferi', show: RIGHT, info: 'Due emisferi separati dalla scissura interemisferica, che offre attacco alla grande falce cerebrale.' },
        { label: 'Diencefalo', lit: DIEN, info: "Attorno al terzo ventricolo: talamo, ipotalamo sotto, epitalamo con l'epifisi dietro." },
        { label: 'Mesencefalo', lit: ['midbrain'], info: 'Davanti i peduncoli cerebrali, dietro la lamina quadrigemina con i quattro collicoli.' },
        { label: 'Ponte', lit: ['pons'], info: 'Fra il solco ponto-mesencefalico e il solco bulbo-pontino.' },
        { label: 'Bulbo', lit: ['medulla'], info: "Dal solco bulbo-pontino al margine superiore dell'atlante." },
      ],
    }),
  },
  {
    title: 'Scissure e lobi',
    body:
      "La corteccia è percorsa da solchi che delimitano i giri. Sulla faccia laterale tre solchi primari guidano la divisione in lobi. Il {solco laterale di Silvio|lat} contorna il polo temporale e separa il {lobo frontale|fr} dal {temporale|te}. Il {solco centrale di Rolando|cen} nasce poco sopra il solco laterale, sale in alto e leggermente indietro e separa il lobo frontale dal {parietale|pa}. Il {solco parieto-occipitale|po} nasce sulla faccia mediale e oltrepassa il margine superiore: da qui una linea immaginaria fino all'incisura preoccipitale delimita il {lobo occipitale|oc}.",
    terms: { lat: ['lateral'], cen: ['central'], po: ['parietoOcc'], fr: FRONTAL, te: TEMPORAL, pa: PARIETAL, oc: ['occipital'] },
    quiz: {
      question: 'Porta ogni lobo al suo posto sulla faccia laterale.',
      tags: [
        { label: 'lobo frontale', ids: FRONTAL },
        { label: 'lobo parietale', ids: PARIETAL },
        { label: 'lobo temporale', ids: TEMPORAL },
        { label: 'lobo occipitale', ids: OCCIPITAL },
      ],
      explain: 'Il solco centrale separa il frontale dal parietale, il solco laterale il frontale dal temporale.',
    },
    caption: 'Emisfero sinistro, faccia laterale. Ogni lobo ha una famiglia di colori; in scuro i solchi primari.',
    instruction: 'SCEGLI UN LOBO, ANCHE CLICCANDO UN GIRO',
    view: { yaw: 1.3 },
    mode: selector({
      base: [...LEFT, ...SULCI_LAT, ...MID],
      idle: 'Blu il lobo frontale, giallo il parietale, verde il temporale, rosso l’occipitale.',
      labels: { central: 'Rolando', lateral: 'Silvio' },
      pick: { ...pickAll(FRONTAL, 0), ...pickAll(PARIETAL, 1), ...pickAll(TEMPORAL, 2), ...pickAll(OCCIPITAL, 3) },
      options: [
        { label: 'Frontale', lit: [...FRONTAL, 'central', 'lateral'], info: 'Davanti al solco centrale e sopra il solco laterale.' },
        { label: 'Parietale', lit: [...PARIETAL, 'central', 'parietoOcc'], info: 'Dietro il solco centrale; in basso lo limita il ramo posteriore della scissura di Silvio.' },
        { label: 'Temporale', lit: [...TEMPORAL, 'lateral'], info: 'Sotto il solco laterale, fino al polo temporale.' },
        { label: 'Occipitale', lit: ['occipital', 'parietoOcc'], info: "Dietro la linea che va dal solco parieto-occipitale all'incisura preoccipitale." },
      ],
    }),
  },
  {
    title: 'I giri della faccia laterale',
    body:
      "Nel lobo frontale i solchi frontali superiore e inferiore separano i giri frontali {superiore|sfg}, {medio|mfg} e {inferiore|ifg}; dietro, fra solco precentrale e solco centrale, corre trasversalmente il {giro precentrale|pre}. Nel parietale il {giro postcentrale|post} segue il solco centrale; più indietro il solco intraparietale separa il {lobulo parietale superiore|spl} dall'inferiore, con il {giro sovramarginale|smg} e il {giro angolare|ang}, importanti per il linguaggio. Nel temporale due solchi paralleli alla scissura di Silvio delimitano le circonvoluzioni {superiore|stg}, {media|mtg} e {inferiore|itg}.",
    terms: {
      sfg: ['sfg'], mfg: ['mfg'], ifg: ['ifg'], pre: ['precentral'], post: ['postcentral'], spl: ['spl'],
      smg: ['supramarginal'], ang: ['angular'], stg: ['stg'], mtg: ['mtg'], itg: ['itg'],
    },
    quiz: {
      question: "Quale giro abbraccia l'estremo posteriore del ramo posteriore della scissura di Silvio?",
      options: ['Il giro angolare', 'Il giro sovramarginale', 'Il giro precentrale', 'La circonvoluzione temporale media'],
      correct: 1,
      explain: "Il giro angolare abbraccia invece l'estremo posteriore del solco temporale superiore.",
    },
    caption: 'I giri sono mesh reali, uno per parte: passa sul modello per leggerne il nome.',
    instruction: 'SCEGLI UN GRUPPO DI GIRI E LEGGI LE ETICHETTE',
    view: { yaw: 1.3 },
    mode: selector({
      base: [...LEFT, ...SULCI_LAT, ...MID],
      idle: 'Tre giri frontali longitudinali, due giri trasversali attorno al solco centrale, tre circonvoluzioni temporali.',
      pick: { sfg: 0, mfg: 0, ifg: 0, precentral: 1, postcentral: 1, central: 1, spl: 2, supramarginal: 2, angular: 2, stg: 3, mtg: 3, itg: 3 },
      options: [
        { label: 'Giri frontali', lit: ['sfg', 'mfg', 'ifg'], labels: { sfg: 'superiore', mfg: 'medio', ifg: 'inferiore' }, info: 'Paralleli alla linea sagittale; l’inferiore ha una parte orbitale, una triangolare e una opercolare.' },
        { label: 'Attorno a Rolando', lit: ['precentral', 'postcentral', 'central'], labels: { precentral: 'precentrale', postcentral: 'postcentrale' }, info: 'Il giro precentrale davanti al solco centrale, il postcentrale dietro.' },
        { label: 'Lobuli parietali', lit: ['spl', 'supramarginal', 'angular'], labels: { spl: 'lobulo superiore', supramarginal: 'sovramarginale', angular: 'angolare' }, info: 'Sotto il solco intraparietale, il sovramarginale davanti e l’angolare dietro.' },
        { label: 'Giri temporali', lit: ['stg', 'mtg', 'itg'], labels: { stg: 'superiore', mtg: 'media', itg: 'inferiore' }, info: 'La superiore sta fra il solco laterale e il solco temporale superiore.' },
      ],
    }),
  },
  {
    title: "L'insula, il lobo nascosto",
    body:
      "Divaricando i labbri del {solco laterale|lat} compare un lobo nascosto: l'{insula|ins}, di forma grossolanamente triangolare, con l'apice diretto in basso e in avanti e la base in alto. La coprono i giri che si affacciano sulla scissura: il {giro frontale inferiore|ifg}, con le sue parti orbitale, triangolare e opercolare, i giri {precentrale|pre} e {postcentrale|post}, il {sovramarginale|smg} e la {circonvoluzione temporale superiore|stg}. Un unico solco principale, il solco centrale dell'insula, separa una porzione anteriore, la {circonvoluzione breve|short}, da una posteriore, la {circonvoluzione lunga|long}.",
    terms: {
      lat: ['lateral'], ins: INSULA, ifg: ['ifg'], pre: ['precentral'], post: ['postcentral'], smg: ['supramarginal'],
      stg: ['stg'], short: ['insulaS'], long: ['insulaL'],
    },
    quiz: {
      question: "Com'è orientata l'insula?",
      options: [
        'Apice in alto e indietro, base in basso',
        'Apice in basso e in avanti, base in alto',
        'Apice in avanti, base indietro',
        'Apice in basso e indietro, base in avanti',
      ],
      correct: 1,
      explain: 'È un triangolo con la base rivolta in alto.',
    },
    caption: "I giri che coprono l'insula diventano trasparenti, come se gli opercoli fossero divaricati.",
    instruction: "APRI GLI OPERCOLI E CERCA L'INSULA IN FONDO AL SOLCO",
    view: { yaw: 1.3 },
    mode: insulaMode,
  },
  {
    title: 'La faccia mediale',
    body:
      "Sulla faccia mediale il {solco del cingolo|cs} circonda dorsalmente il {corpo calloso|cc}, dal ginocchio allo splenio, e delimita la {circonvoluzione del cingolo|cg}; dietro si continua nel solco marginale. Fra solco precentrale e solco marginale sta il {lobulo paracentrale|para}, che abbraccia l'estremità del solco centrale. Più indietro il {precuneo|precu}, o lobulo quadrilatero, arriva al {solco parieto-occipitale|po}. Questo e il {solco calcarino|calc}, che nasce sotto lo splenio e raggiunge il polo occipitale, delimitano il {cuneo|cun}; sotto la scissura calcarina si trova il {giro linguale|ling}.",
    terms: {
      cs: ['cingulateS'], cc: ['callosum'], cg: ['cingulate'], para: ['paracentral'], precu: ['precuneus'], po: ['parietoOcc'],
      calc: ['calcarine'], cun: ['cuneus'], ling: ['lingual'],
    },
    quiz: {
      question: 'Quali solchi delimitano il cuneo sulla faccia mediale?',
      options: [
        'Il solco del cingolo e il solco marginale',
        'Il solco parieto-occipitale e il solco calcarino',
        'Il solco centrale e il solco marginale',
        'Il solco calcarino e il solco collaterale',
      ],
      correct: 1,
      explain: 'Nascono entrambi sotto lo splenio del corpo calloso e divergono verso dietro.',
    },
    caption: 'Emisfero sinistro, faccia mediale, con le strutture mediane in sezione sagittale.',
    instruction: 'SCEGLI UNA REGIONE, ANCHE CLICCANDOLA SUL MODELLO',
    view: { yaw: -1.35 },
    mode: selector({
      base: [...LEFT, ...SULCI_MED, 'central', ...MID],
      idle: 'In scuro i solchi: del cingolo attorno al corpo calloso, parieto-occipitale e calcarino dietro.',
      pick: { cingulate: 0, cingulateS: 0, paracentral: 1, precuneus: 2, cuneus: 3, calcarine: 3, lingual: 4 },
      options: [
        { label: 'Cingolo', lit: ['cingulate', 'cingulateS', 'callosum'], info: 'Fra il solco del corpo calloso e il solco del cingolo, tutto attorno al corpo calloso.' },
        { label: 'Lobulo paracentrale', lit: ['paracentral', 'central', 'cingulateS'], info: 'Il solco centrale sporge sulla faccia mediale solo per 1,5 cm: il lobulo lo abbraccia.' },
        { label: 'Precuneo', lit: ['precuneus', 'parietoOcc', 'cingulateS'], info: 'Lobulo di aspetto quadrato fra il solco marginale e il solco parieto-occipitale.' },
        { label: 'Cuneo', lit: ['cuneus', 'parietoOcc', 'calcarine'], info: 'Un cuneo di corteccia occipitale fra il solco parieto-occipitale e il solco calcarino.' },
        { label: 'Giro linguale', lit: ['lingual', 'calcarine'], info: 'La corteccia che rimane al di sotto della scissura calcarina.' },
      ],
    }),
  },
];

export default {
  id: 'macroscopica',
  title: 'Encefalo: anatomia macroscopica',
  blurb: "Le parti dell'encefalo, scissure, lobi e giri, l'insula e la faccia mediale.",
  part: 'Encefalo',
  order: 30,
  model: 'macroscopica',
  createModel: () => new Macroscopica(),
  yaw: 1.3,
  spreads,
};
