// Capitolo "Ipotalamo". Testi dagli appunti di neuroanatomia (Ipotalamo;
// Anatomia funzionale dell'ipotalamo). Gli appunti attribuiscono per una svista
// la poichilotermia alla lesione dell'ipotalamo anteriore: qui è, come nella
// frase che la precede, quella del posteriore. Non sono negli appunti: il
// confine tra i due lobi dell'ipofisi e il decorso disegnato delle vie, che
// uniscono origine e bersaglio; vedi le fonti in testa a src/models/ipotalamo.js.
import { selector } from '../modes.js';
import { IpotalamoModel } from '../models/ipotalamo.js';

const PITUITARY = ['stalk', 'adeno', 'neuro', 'eminence'];
const CONTEXT = ['hyp', 'tuber', 'v3', 'commissure', 'lamina', 'chiasm', 'tract', 'fornix', 'mammillary'];
const PRE = ['preopticM', 'preopticL'];
const SUPRA = ['suprachiasmatic', 'supraoptic', 'paraventricular', 'anterior'];
const TUB = ['arcuate', 'dorsomedial', 'ventromedial'];
const MAM = ['posterior', 'mammillary', 'tuberomammillary'];
const PERI = ['periventricular', 'suprachiasmatic', 'arcuate'];
const MED = ['preopticM', 'anterior', 'paraventricular', 'supraoptic', 'dorsomedial', 'ventromedial', 'posterior', 'mammillary'];
const LAT = ['preopticL', 'lateral'];
const NUCLEI = [...new Set([...PRE, ...SUPRA, ...TUB, ...MAM, ...PERI, ...LAT])];
const BASE = [...CONTEXT, ...NUCLEI];
// Primo piano sull'ipotalamo, senza l'ipofisi, sopra il centro della base.
const CLOSE = { at: [0.05, 0.62, -0.053], scale: 1.15, height: 0.37 };
const WIDE = { at: [0.05, 0.62, -0.096], scale: 0.9, height: 0.33 }; // con talamo e fasci, che salgono più in alto
// la colonna del fornice attraversa i nuclei: semitrasparente finché non serve
const LOOKS = { periventricular: { opacity: 0.8, litOpacity: 1 }, fornix: { opacity: 0.5, litOpacity: 1 } };

// Ciò che un'opzione lascia in ombra diventa quasi trasparente, così i nuclei
// accesi si vedono anche se stanno più in profondità.
const NUC = new Set([...NUCLEI, 'eminence']);
const faded = (mode) => async (ctx) => {
  const api = await mode(ctx);
  return {
    ...api,
    enter() {
      api.enter();
      const look = ctx.model.lookFn;
      ctx.model.lookFn = (part) => {
        const l = look(part);
        return l.dim && !part.ghost ? { ...l, opacity: NUC.has(part.id) ? 0.16 : 0.3 } : l;
      };
    },
  };
};

const spreads = [
  {
    title: 'Quattro regioni, tre zone',
    body:
      "L'ipotalamo è la parte del diencefalo che abbraccia la metà inferiore del {terzo ventricolo|v3}, sotto il {talamo|thal}. In senso antero-posteriore si distinguono la {regione preottica|pre}, attorno alla {lamina terminale|lamina}; la {sopraottica|supra}, sopra il {chiasma ottico|chiasm}; la {tuberale|tub}, sopra il {tuber cinereum|tuber}; la {mammillare|mam}, con i corpi mammillari. In senso medio-laterale si succedono una sottile {zona periventricolare|peri}, una {zona mediale|med}, la più ricca di nuclei, e una {zona laterale|lat}: le separa il piano che unisce {fornice|fx} e fascio mammillotalamico.",
    terms: {
      v3: ['v3'], thal: ['thalamus'], pre: PRE, lamina: ['lamina'], supra: SUPRA, chiasm: ['chiasm'], tub: TUB, tuber: ['tuber'],
      mam: MAM, peri: PERI, med: MED, lat: LAT, fx: ['fornix', 'mtt'],
    },
    quiz: {
      question: 'In quale regione si trova il nucleo soprachiasmatico?',
      options: ['Preottica', 'Sopraottica', 'Tuberale', 'Mammillare'],
      correct: 1,
      explain: 'Nella zona periventricolare, subito sopra il chiasma ottico.',
    },
    caption: 'Metà destra dell’ipotalamo reale (BodyParts3D) vista dal terzo ventricolo; i nuclei sono ricostruiti al suo interno.',
    instruction: 'SCEGLI UNA REGIONE (DAVANTI-DIETRO) O UNA ZONA (DENTRO-FUORI)',
    view: { yaw: 1.45, focus: CLOSE },
    mode: faded(selector({
      base: BASE,
      looks: LOOKS,
      labels: { commissure: 'commessura anteriore', chiasm: 'chiasma ottico', mammillary: 'corpo mammillare' },
      idle: 'Davanti la lamina terminale; sotto, da davanti a dietro, chiasma ottico, tuber cinereum e corpo mammillare.',
      options: [
        { label: 'Preottica', lit: PRE, labels: {}, info: 'Nuclei preottici mediale e laterale: l’unica parte associata al telencefalo.' },
        { label: 'Sopraottica', lit: SUPRA, labels: {}, info: 'Soprachiasmatico (giallo), sopraottico (azzurro), paraventricolare (blu), ipotalamico anteriore (arancio).' },
        { label: 'Tuberale', lit: TUB, labels: {}, info: 'Arcuato (rosa) nel pavimento, ventromediale (verde scuro) e, più in alto, dorsomediale (verde chiaro).' },
        { label: 'Mammillare', lit: MAM, labels: {}, info: 'Corpo mammillare, ipotalamico posteriore (viola) sopra di esso, tubero-mammillare (lilla) di lato.' },
        { label: 'Periventricolare', lit: PERI, labels: {}, info: 'Una lamina sottile addossata all’ependima: periventricolare e, alla base, soprachiasmatico e arcuato.' },
        { label: 'Mediale', lit: MED, labels: {}, info: 'La zona più popolata: controllo del sistema nervoso autonomo e della neuroipofisi.' },
        { label: 'Laterale', lit: LAT, show: ['mtt'], labels: {}, info: 'Preottico laterale e ipotalamico laterale, di là dal piano di fornice e fascio mammillotalamico: comportamenti ed emozioni.' },
      ],
    })),
  },
  {
    title: "Due vie verso l'ipofisi",
    body:
      "L'ipotalamo governa l'ipofisi in due modi. I neuroni magnocellulari dei nuclei {paraventricolare|pvn} e {sopraottico|son} mandano i propri assoni lungo il {peduncolo ipofisario|stalk} fino alla {neuroipofisi|neuro}. I neuroni parvicellulari dei nuclei {periventricolare|pev} e {arcuato|arc} proiettano invece all'{eminenza mediana|em}, ricca di capillari, posta subito sotto il nucleo arcuato: qui liberano i fattori di rilascio o di inibizione che regolano la secrezione dell'{adenoipofisi|adeno}.",
    terms: {
      pvn: ['paraventricular'], son: ['supraoptic'], stalk: ['stalk'], neuro: ['neuro'],
      pev: ['periventricular'], arc: ['arcuate'], em: ['eminence'], adeno: ['adeno'],
    },
    quiz: {
      question: 'Quali nuclei danno origine ai neuroni magnocellulari diretti alla neuroipofisi?',
      options: ['Arcuato e periventricolare', 'Paraventricolare e sopraottico', 'Dorsomediale e ventromediale', 'Soprachiasmatico e preottico'],
      correct: 1,
      explain: 'I loro assoni scendono nel peduncolo ipofisario.',
    },
    caption: 'In blu la neurosecrezione; in rosso il passaggio attraverso i capillari. L’ipofisi è reale, il confine tra i lobi è stimato.',
    instruction: 'SCEGLI QUALE PARTE DELL’IPOFISI RAGGIUNGERE',
    view: { yaw: 1.4, zoom: 0.92 },
    mode: faded(selector({
      base: [...BASE, ...PITUITARY],
      looks: LOOKS,
      pick: { neuro: 0, adeno: 1 },
      idle: 'Due lobi, due vie: scegli un lobo, anche cliccandolo sul modello.',
      options: [
        {
          label: 'Neuroipofisi', stepTime: 1.8, labels: { neuro: 'neuroipofisi' },
          steps: [
            { ids: ['paraventricular', 'supraoptic'], text: 'Neuroni magnocellulari: paraventricolare e sopraottico' },
            { ids: ['stalk'], links: ['pvn-neuro', 'son-neuro'], text: 'Gli assoni scendono nel peduncolo ipofisario' },
            { ids: ['neuro'], text: 'Neuroipofisi' },
          ],
        },
        {
          label: 'Adenoipofisi', stepTime: 1.8, labels: { adeno: 'adenoipofisi' },
          steps: [
            { ids: ['periventricular', 'arcuate'], text: 'Neuroni parvicellulari: periventricolare e arcuato' },
            { ids: ['eminence'], links: ['arc-em', 'pev-em'], text: 'Eminenza mediana: fattori di rilascio e di inibizione' },
            { ids: ['adeno'], links: ['portal'], text: "Attraverso i capillari, fino all'adenoipofisi" },
          ],
        },
      ],
    })),
  },
  {
    title: 'Un termostato, e molto altro',
    body:
      "L'ipotalamo confronta ciò che riceve con valori di riferimento e corregge gli scostamenti. L'{ipotalamo anteriore|ant} rileva l'aumento della temperatura e dissipa calore; il {posteriore|post} rileva il freddo e lo conserva. Il {nucleo ventromediale|vm} è il centro della sazietà, l'{ipotalamo laterale|lat} quello della fame: una lesione del primo porta a obesità, del secondo ad anoressia. Gli stessi due regolano l'aggressività in modo opposto: stimolare il laterale scatena rabbia, il ventromediale tranquillità. La sete nasce dagli osmocettori anteriori.",
    terms: { ant: ['anterior', 'preopticM'], post: ['posterior'], vm: ['ventromedial'], lat: ['lateral'] },
    quiz: {
      question: 'Una lesione bilaterale del nucleo ventromediale provoca…',
      options: ['anoressia e passività', 'obesità e aggressività', 'ipertermia', 'ipersonnia'],
      correct: 1,
      explain: 'Si perde il centro della sazietà e, insieme, il suo effetto calmante.',
    },
    caption: 'Coppie di nuclei con effetti opposti tengono in equilibrio ogni funzione.',
    instruction: 'SCEGLI UNA FUNZIONE E GUARDA QUALI NUCLEI LA REGOLANO',
    view: { yaw: 1.0, focus: CLOSE },
    mode: faded(selector({
      base: BASE,
      looks: LOOKS,
      idle: 'Ogni funzione ha due nuclei che tirano in direzioni opposte.',
      options: [
        {
          label: 'Temperatura', lit: ['anterior', 'preopticM', 'posterior'],
          labels: { anterior: 'dissipa calore', posterior: 'conserva calore' },
          info: 'Anteriore: dissipa calore (lesione: ipertermia). Posteriore: conserva calore (lesione: poichilotermia).',
        },
        {
          label: 'Fame e sazietà', lit: ['ventromedial', 'lateral'],
          labels: { ventromedial: 'sazietà', lateral: 'fame' },
          info: 'Ventromediale: sazietà (lesione: obesità). Laterale: fame, con le orexine (lesione: anoressia).',
        },
        {
          label: 'Aggressività', lit: ['ventromedial', 'lateral'],
          labels: { ventromedial: 'tranquillità', lateral: 'rabbia' },
          info: 'Laterale stimolato: rabbia; lesionato: passività. Ventromediale stimolato: tranquillità; lesionato: aggressività.',
        },
        {
          label: 'Sete', lit: ['anterior', 'lateral'],
          labels: { anterior: 'osmocettori' },
          info: 'Osmocettori dell’ipotalamo anteriore; una lesione laterale riduce l’assunzione di acqua.',
        },
      ],
    })),
  },
  {
    title: "L'orologio e il sonno",
    body:
      "Il {nucleo soprachiasmatico|scn}, piccolissimo, è l'orologio principale dell'organismo: riceve dalla retina, attraverso il {chiasma ottico|chiasm}, l'informazione sulla luce e regola i ritmi circadiani, la melatonina dell'epifisi e, tramite i nuclei {paraventricolare|pvn} e arcuato, la secrezione ipofisaria. Il sonno non-REM è promosso dai neuroni GABAergici dell'{area preottica|vlpo}, che inibiscono i sistemi del risveglio: i neuroni istaminergici del {nucleo tubero-mammillare|tmn} e quelli a orexina dell'{ipotalamo laterale|orx}. Lesioni anteriori danno insonnia, posteriori ipersonnia.",
    terms: {
      scn: ['suprachiasmatic'], chiasm: ['chiasm'], pvn: ['paraventricular', 'arcuate'],
      vlpo: ['preopticL'], tmn: ['tuberomammillary'], orx: ['lateral'],
    },
    quiz: {
      question: "Una lesione dell'ipotalamo posteriore provoca…",
      options: ['insonnia', 'ipersonnia', 'obesità', 'ipertermia'],
      correct: 1,
      explain: "Come nell'encefalite letargica: si perdono i sistemi del risveglio.",
    },
    caption: 'Verde: vie eccitatorie. Rosso: inibizione dei sistemi del risveglio.',
    instruction: 'SCEGLI: OROLOGIO, SONNO O VEGLIA',
    view: { yaw: 0.85, focus: CLOSE },
    mode: faded(selector({
      base: BASE,
      looks: LOOKS,
      idle: 'Un orologio sopra il chiasma, un interruttore del sonno davanti, i sistemi del risveglio dietro e di lato.',
      options: [
        {
          label: 'Orologio circadiano', stepTime: 1.8,
          steps: [
            { ids: ['chiasm'], text: 'La luce: fibre dalla retina nel chiasma ottico' },
            { ids: ['suprachiasmatic'], links: ['retina-scn'], text: 'Nucleo soprachiasmatico: il master clock' },
            { ids: ['paraventricular', 'arcuate'], links: ['scn-pvn'], text: 'Paraventricolare e arcuato: secrezione ipofisaria' },
          ],
        },
        {
          label: 'Sonno non-REM', lit: ['preopticL', 'tuberomammillary', 'lateral'], links: ['vlpo-tmn', 'vlpo-orx'],
          activity: { tuberomammillary: -1, lateral: -1 },
          info: "L'area preottica laterale ventrale inibisce tubero-mammillare (istamina) e ipotalamo laterale (orexina).",
        },
        {
          label: 'Veglia', lit: ['tuberomammillary', 'lateral'], links: ['orx-lc'], activity: { tuberomammillary: 1, lateral: 1 },
          info: "Istamina e orexina sostengono la veglia; l'orexina eccita il locus coeruleus, nel tronco encefalico.",
        },
      ],
    })),
  },
  {
    title: 'Le connessioni',
    body:
      "L'ipotalamo riceve e invia lungo pochi grandi fasci. Il {fornice|fx} nasce dall'ippocampo e termina nei nuclei {preottico e anteriore|fxEnd} e nel {corpo mammillare|mb}. La {stria terminale|st} porta fibre dall'amigdala ai nuclei preottico mediale e ipotalamico anteriore: sembra influenzare i comportamenti sessuali e riproduttivi. Il {fascio mammillotalamico|mtt} sale dal corpo mammillare al nucleo anteriore del {talamo|thal}: è una tappa del circuito di Papez. Il fascio mediale del telencefalo attraversa la {zona laterale|lat} nei due sensi e la unisce a proencefalo basale, corteccia olfattiva e tronco encefalico.",
    terms: {
      fx: ['fornix'], fxEnd: ['preopticM', 'anterior'], mb: ['mammillary'], st: ['stria'], mtt: ['mtt'], thal: ['thalamus'], lat: ['lateral', 'preopticL'],
    },
    quiz: {
      question: 'Dove termina il fascio mammillotalamico?',
      options: ["Nell'ippocampo", 'Nel nucleo anteriore del talamo', "Nell'amigdala", 'Nella neuroipofisi'],
      correct: 1,
      explain: 'Dal corpo mammillare al nucleo anteriore del talamo: una tappa del circuito di Papez.',
    },
    caption: 'Colonna del fornice e stria terminale sono mesh reali; il fascio mammillotalamico e le frecce sono ricostruiti.',
    instruction: 'SCEGLI UN FASCIO E SEGUINE IL DECORSO',
    view: { yaw: 1.0, focus: WIDE },
    mode: faded(selector({
      base: [...BASE, 'thalamus', 'mtt', 'stria'],
      looks: LOOKS,
      idle: 'Tre fasci compatti e uno diffuso, nella zona laterale.',
      options: [
        {
          label: 'Fornice', lit: ['fornix', 'mammillary', 'preopticM', 'anterior'], links: ['fx-mb'],
          labels: { fornix: "dall'ippocampo" },
          info: 'La colonna scende dietro la commessura anteriore, nella parete del terzo ventricolo, fino al corpo mammillare.',
        },
        {
          label: 'Stria terminale', lit: ['stria', 'preopticM', 'anterior'], links: ['st-in'],
          labels: { stria: "dall'amigdala" },
          info: "Dall'amigdala ai nuclei preottico mediale e ipotalamico anteriore.",
        },
        {
          label: 'Mammillotalamico', lit: ['mammillary', 'mtt', 'thalamus'], links: ['mtt-up'],
          labels: { mtt: 'al nucleo anteriore del talamo' },
          info: 'Dal corpo mammillare al nucleo anteriore del talamo: circuito di Papez.',
        },
        {
          label: 'Fascio mediale', lit: ['lateral', 'preopticL'], links: ['mfb-up', 'mfb-down'],
          info: 'Il fascio mediale del telencefalo: fibre nei due sensi tra proencefalo basale e tronco encefalico, frammiste ai neuroni della zona laterale.',
        },
      ],
    })),
  },
];

export default {
  id: 'ipotalamo',
  title: 'Ipotalamo',
  blurb: "Regioni e nuclei, le vie verso l'ipofisi, termoregolazione, fame, sonno, connessioni.",
  part: 'Encefalo',
  order: 35,
  model: 'ipotalamo',
  createModel: () => new IpotalamoModel(),
  yaw: 1.2,
  spreads,
};
