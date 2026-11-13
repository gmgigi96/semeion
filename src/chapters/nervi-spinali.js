// Capitolo "Nervi spinali": quattro doppie pagine, una sola idea ciascuna.
// Testi ricavati dagli appunti di neuroanatomia (1. Nervi spinali).
// Il modello è un primo piano dell'ottavo nervo toracico di destra, fatto di
// mesh anatomiche reali (vedi src/models/nervi-spinali.js).
import { selector } from '../modes.js';
import { NerviSpinali, FLOOR, atMm } from '../models/nervi-spinali.js';

const LEFT = ['rootPL', 'rootAL', 'ganglionL', 'nerveL'];
const GREY_MATTER = ['antHorn', 'postHorn', 'greyMid', 'iml'];
const ROOTS = ['radP', 'rootP', 'ganglion', 'radA', 'rootA', 'nerve', 'anterior'];
const CHAIN = ['trunk', 'sgang', 'sgangCtx'];

// Primi piani (vedi «Primi piani» in docs/AUTHORING.md): il modello è ingrandito
// attorno a un asse verticale (mm Z-Anatomy: x, y) e la quota z del taglio inferiore
// (vedi FLOOR) poggia sulla pagina.
const onPage = (x, y, z, scale) => ({ at: atMm(x, y, z), scale, height: 0.004, stand: false });
const FOCUS = {
  cord: onPage(-7, 69, FLOOR.cord, 2.5),
  foramen: onPage(-13, 68, FLOOR.block, 2.1),
  axial: onPage(-33, 74, FLOOR.axial, 1.3),
};

const spreads = [
  {
    title: 'Due radici, un nervo',
    body:
      "A livello di ciascun neuromero del midollo spinale nasce una {coppia|pair} di nervi spinali: 31 paia in tutto, cioè 8 cervicali, 12 toracici, 5 lombari, 5 sacrali e 1 coccigeo. Ogni nervo si costituisce dall'unione di due radici, fatte di {radicole|rad}: la {radice posteriore|rootP}, sensitiva o afferente, lungo la quale si trova il {ganglio spinale|ganglion}, e la {radice anteriore|rootA}, efferente o motoria. Ne risulta un {nervo misto|nerve}. Fa eccezione C1, che non ha radice posteriore ed è quindi esclusivamente motorio.",
    terms: {
      pair: [...ROOTS, ...LEFT],
      rad: ['radP', 'radA'],
      rootP: ['rootP', 'radP'],
      ganglion: ['ganglion'],
      rootA: ['rootA', 'radA'],
      nerve: ['nerve'],
    },
    quiz: {
      question: 'Quale nervo spinale è formato dalla sola radice anteriore?',
      options: ['C1', 'C8', 'T1', 'Il nervo coccigeo'],
      correct: 0,
      explain: 'C1 non ha radice posteriore: è l’unico nervo spinale esclusivamente motorio.',
    },
    caption: 'Ottavo nervo toracico (T8) di destra, veduta antero-laterale. Un tratto di midollo, isolato dalla colonna, con le due radici di ciascun lato.',
    instruction: 'SCEGLI UNA RADICE E SEGUILA DAL MIDOLLO AL NERVO · TRASCINA PER RUOTARE',
    view: { yaw: -0.75, focus: FOCUS.cord },
    mode: selector({
      base: ['cord', ...GREY_MATTER, ...ROOTS, 'posterior', ...LEFT],
      idle: 'Radice posteriore in azzurro, radice anteriore in rosso, nervo in giallo.',
      pick: { radP: 0, rootP: 0, ganglion: 0, radA: 1, rootA: 1, nerve: 2, anterior: 2 },
      options: [
        {
          label: 'Radice posteriore',
          stepTime: 1.6,
          labels: { rootP: 'radice posteriore', ganglion: 'ganglio spinale' },
          steps: [
            { ids: ['radP'], text: 'Le radicole posteriori emergono in fila dal midollo.' },
            { ids: ['rootP'], text: 'Si riuniscono nella radice posteriore, sensitiva o afferente.' },
            { ids: ['ganglion'], text: 'Lungo la radice si trova il ganglio spinale.' },
            { ids: ['nerve'], text: 'Subito oltre, le due radici si uniscono nel nervo spinale.' },
          ],
        },
        {
          label: 'Radice anteriore',
          stepTime: 1.6,
          labels: { rootA: 'radice anteriore' },
          steps: [
            { ids: ['radA'], text: 'Le radicole anteriori emergono in fila dal midollo.' },
            { ids: ['rootA'], text: 'Si riuniscono nella radice anteriore, efferente o motoria.' },
            { ids: ['nerve'], text: 'La radice si unisce alla posteriore nel nervo spinale.' },
          ],
        },
        {
          label: 'Nervo misto',
          lit: ['nerve', 'anterior', 'posterior'],
          labels: { nerve: 'nervo spinale' },
          info: 'Dopo l’unione delle radici il nervo è misto: assoni afferenti sensitivi ed efferenti motori insieme.',
        },
        {
          label: 'La coppia',
          lit: [...ROOTS, ...LEFT],
          info: 'A ogni neuromero una coppia di nervi, destro e sinistro: 31 paia in tutto.',
        },
      ],
    }),
  },
  {
    title: 'Origine apparente e origine reale',
    body:
      "Di ogni radice si distinguono due origini. L'origine apparente è l'emergenza dalla superficie del midollo: le radicole escono in fila lungo il {solco laterale posteriore|sulcusP} e il {solco laterale anteriore|sulcusA}. L'origine reale è la sede dei corpi neuronali. Per la radice posteriore è il {ganglio spinale|ganglion}, con i neuroni {pseudounipolari a T|somaS}: un ramo raggiunge il {corno posteriore|postHorn}, l'altro la periferia. Per la radice anteriore è il {corno anteriore|antHorn}: {motoneuroni somatici|somaM} alfa e gamma nella lamina 9, {motoneuroni viscerali|iml} nella lamina 7, alla base del corno.",
    terms: {
      sulcusP: ['sulcusP'],
      sulcusA: ['sulcusA'],
      ganglion: ['ganglion'],
      somaS: ['somaS'],
      postHorn: ['postHorn'],
      antHorn: ['antHorn'],
      somaM: ['somaM'],
      iml: ['iml'],
    },
    quiz: {
      question: 'Qual è l’origine reale della radice posteriore?',
      options: ['Il solco laterale posteriore', 'Il corno posteriore', 'Il ganglio spinale', 'La lamina 9'],
      correct: 2,
      explain: 'Nel ganglio spinale stanno i corpi dei neuroni sensitivi pseudounipolari a T.',
    },
    caption: 'Midollo in trasparenza con la sostanza grigia; le fibre corrono dentro radici e nervo.',
    instruction: 'SCEGLI UN TIPO DI NEURONE E SEGUI IL SUO ASSONE',
    view: { yaw: -0.55, focus: FOCUS.cord },
    mode: selector({
      base: ['cord', ...GREY_MATTER, 'sulcusP', 'sulcusA', ...ROOTS],
      looks: {
        cord: { opacity: 0.28 }, rootP: { opacity: 0.4 }, rootA: { opacity: 0.4 }, radP: { opacity: 0.5 }, radA: { opacity: 0.5 },
        ganglion: { opacity: 0.4 }, nerve: { opacity: 0.4 }, anterior: { opacity: 0.4 }, white: { opacity: 0.45 },
        sgang: { opacity: 0.45 }, greyMid: { opacity: 0.7 },
      },
      idle: 'Il corno posteriore riceve, il corno anteriore invia: scegli un neurone.',
      pick: { sulcusP: 0, sulcusA: 0, ganglion: 1, postHorn: 1, antHorn: 2, iml: 3 },
      options: [
        {
          label: 'Origine apparente',
          lit: ['sulcusP', 'sulcusA', 'radP', 'radA'],
          labels: { sulcusP: 'solco laterale posteriore', sulcusA: 'solco laterale anteriore' },
          info: 'I due solchi longitudinali, pari, da cui emergono le radicole: è qui che le radici sembrano nascere.',
        },
        {
          label: 'Neurone sensitivo',
          stepTime: 2.2,
          steps: [
            { ids: ['somaS'], text: 'Origine reale: il corpo del neurone pseudounipolare a T, nel ganglio spinale.' },
            { ids: ['somaS'], links: ['fSensP'], text: 'Un ramo dell’assone arriva dalla periferia con il nervo spinale.' },
            { ids: ['somaS', 'postHorn'], links: ['fSensC'], text: 'L’altro percorre la radice posteriore fino al corno posteriore.' },
          ],
        },
        {
          label: 'Motoneurone somatico',
          stepTime: 2.2,
          steps: [
            { ids: ['somaM', 'antHorn'], text: 'Lamina 9, nella testa del corno anteriore: motoneuroni alfa e gamma.' },
            { ids: ['somaM'], links: ['fMot'], text: 'Radice anteriore, poi nervo: gli alfa per il muscolo scheletrico, i gamma per i fusi neuromuscolari.' },
          ],
        },
        {
          label: 'Motoneurone viscerale',
          stepTime: 2.2,
          show: ['white', 'sgang'],
          steps: [
            { ids: ['iml'], text: 'Lamina 7, alla base del corno anteriore, al confine con il cordone laterale.' },
            { ids: ['iml'], links: ['fPre'], text: 'Anche il suo assone esce con la radice anteriore: è diretto ai visceri.' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Fuori dal canale: i rami collaterali',
    body:
      "Una volta formato, il nervo abbandona il canale vertebrale attraverso il {foro intervertebrale|foramen}, rivestito ancora dalle {meningi|dura}. Appena emerso, prima di dividersi, rilascia dei collaterali. Il {ramo meningeo ricorrente|meningeal}, presente in tutti i nervi spinali, rientra nel foro: porta fibre sensitive e vasomotorie a meningi, periostio e vasi del canale. Il {ramo comunicante bianco|white}, presente solo da C8 a L2, porta fibre pregangliari mieliniche alla {catena gangliare paravertebrale|chain}; il {ramo comunicante grigio|grey}, sempre presente, riporta dal {ganglio|sgang} al nervo fibre postgangliari amieliniche.",
    terms: {
      foramen: ['foramen'],
      dura: ['dura'],
      meningeal: ['meningeal'],
      white: ['white'],
      chain: CHAIN,
      grey: ['grey'],
      sgang: ['sgang'],
    },
    quiz: {
      question: 'Quale collaterale manca nei nervi spinali al di fuori del tratto C8-L2?',
      options: ['Il ramo meningeo ricorrente', 'Il ramo comunicante bianco', 'Il ramo comunicante grigio', 'Il ramo posteriore'],
      correct: 1,
      explain: 'Il ramo comunicante bianco esiste solo da C8 a L2; il grigio e il meningeo ci sono sempre.',
    },
    caption: 'Il nervo T8 esce tra le vertebre T8 e T9; sul fianco dei corpi vertebrali scende la catena del simpatico.',
    instruction: 'SCEGLI UN COLLATERALE · TRASCINA PER GUARDARE DENTRO IL FORO',
    view: { yaw: -1.2, focus: FOCUS.foramen },
    mode: selector({
      base: ['gT8', 'bT9', 'bDisc', 'cord', ...GREY_MATTER, 'dura', 'rootP', 'rootA', 'ganglion', 'nerve', 'anterior', 'posterior', 'meningeal', 'white', 'grey', ...CHAIN],
      looks: {
        cord: { opacity: 0.6 },
        nerve: { litOpacity: 0.45 }, anterior: { litOpacity: 0.45 }, rootA: { litOpacity: 0.45 },
      },
      idle: 'La vertebra T8 è in trasparenza: scegli «Foro intervertebrale» per vederla piena.',
      pick: { foramen: 0, meningeal: 1, white: 2, grey: 3 },
      options: [
        {
          label: 'Foro intervertebrale',
          lit: ['foramen', 'bT8', 'bT9', 'ganglion'],
          labels: { foramen: 'foro intervertebrale' },
          info: 'Tra T8 e T9: di qui il nervo, con il ganglio spinale, lascia il canale vertebrale.',
        },
        {
          label: 'Ramo meningeo',
          lit: ['meningeal'],
          labels: { meningeal: 'ramo meningeo ricorrente' },
          info: 'Rientra nel foro e si riporta nel canale vertebrale: meningi, periostio, tonaca media dei vasi.',
        },
        {
          label: 'Comunicante bianco',
          lit: ['white', 'sgang', 'iml', 'rootA', 'nerve'],
          links: ['fPre'],
          labels: { white: 'ramo comunicante bianco' },
          info: 'Fibre pregangliari, mieliniche: dai motoneuroni viscerali alla catena paravertebrale.',
        },
        {
          label: 'Comunicante grigio',
          lit: ['grey', 'sgang', 'somaG', 'nerve', 'anterior'],
          links: ['fPost'],
          labels: { grey: 'ramo comunicante grigio' },
          info: 'Fibre postgangliari, amieliniche: dal ganglio rientrano nel nervo, verso il territorio da innervare.',
        },
      ],
    }),
  },
  {
    title: 'Ramo posteriore e ramo anteriore',
    body:
      "Il nervo si divide infine in due rami. Il {ramo posteriore|posterior}, più piccolo, si porta indietro girando attorno al {processo trasverso|tp} e si divide in un {ramo mediale|postMed} e un {ramo laterale|postLat}, che innervano in maniera metamerica cute e {muscoli annessi alla colonna|muscles}. Solo in C1, C2 e C3 è maggiore o uguale all'anteriore: sono il nervo sub-occipitale, il grande occipitale e l'occipitale terzo. I {rami anteriori|anterior} si comportano in modo diverso: tendono ad anastomizzarsi tra loro e formano i plessi cervicale, brachiale, lombare, sacrale, pudendo e coccigeo.",
    terms: {
      posterior: ['posterior'],
      tp: ['cT9'],
      postMed: ['postMed'],
      postLat: ['postLat'],
      muscles: ['transv', 'erector'],
      anterior: ['anterior', 'anteriorD'],
    },
    quiz: {
      question: 'In quali nervi spinali il ramo posteriore è maggiore o uguale al ramo anteriore?',
      options: ['In tutti i nervi toracici', 'In C1, C2 e C3', 'Da C8 a L2', 'Nei nervi sacrali'],
      correct: 1,
      explain: 'Sono i nervi sub-occipitale, grande occipitale e occipitale terzo.',
    },
    caption: 'La vertebra T9 vista dall’alto e da dietro, con il nervo T8 che le passa sopra. Nel torace il ramo anteriore decorre sotto la costa come nervo intercostale.',
    instruction: 'SCEGLI UN RAMO · TRASCINA IL MODELLO PER RUOTARLO',
    view: { yaw: 2.8, focus: FOCUS.axial },
    mode: selector({
      base: ['cT9', 'cDisc', 'rib8', 'rib9', 'cord', ...GREY_MATTER, 'rootP', 'rootA', 'ganglion', 'nerve', 'anterior', 'anteriorD', 'posterior', 'postMed', 'postLat', 'white', 'grey', ...CHAIN, 'transv', 'erector'],
      looks: { rib8: { litOpacity: 0.55 } },
      idle: 'Dal foro intervertebrale: un ramo va indietro, verso il dorso, l’altro in avanti.',
      pick: { posterior: 0, postMed: 0, postLat: 0, anterior: 1, anteriorD: 1, nerve: 2 },
      options: [
        {
          label: 'Ramo posteriore',
          stepTime: 1.8,
          labels: { postMed: 'ramo mediale', postLat: 'ramo laterale' },
          steps: [
            { ids: ['posterior'], text: 'Più piccolo dell’anteriore, si porta indietro girando attorno al processo trasverso.' },
            { ids: ['postMed'], text: 'Si divide in un ramo mediale…' },
            { ids: ['postLat'], text: '…e in un ramo laterale: insieme innervano, metamero per metamero, cute e muscoli annessi alla colonna.' },
          ],
        },
        {
          label: 'Ramo anteriore',
          lit: ['anterior', 'anteriorD', 'rib8'],
          labels: { anteriorD: 'ramo anteriore' },
          info: 'Qui, nel torace, segue il margine inferiore dell’ottava costa. I rami anteriori tendono ad anastomizzarsi tra loro nei plessi.',
        },
        {
          label: 'Tutto il nervo',
          lit: ['rootP', 'rootA', 'ganglion', 'nerve', 'anterior', 'anteriorD', 'posterior', 'postMed', 'postLat', 'white', 'grey'],
          info: 'Radici, ganglio, tronco del nervo, collaterali e i due rami terminali.',
        },
      ],
    }),
  },
];

export default {
  id: 'nervi-spinali',
  title: 'Nervi spinali',
  blurb: 'Radici, ganglio, rami: un nervo toracico da vicino.',
  part: 'Midollo e nervi spinali',
  order: 11,
  model: 'nervi-spinali',
  createModel: () => new NerviSpinali(),
  yaw: -0.75,
  spreads,
};
