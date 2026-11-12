// Capitolo "Ipotalamo". Testi dagli appunti di neuroanatomia
// (Ipotalamo; Anatomia funzionale dell'ipotalamo).
import { selector } from '../modes.js';
import { Hypothalamus } from '../hypothalamus.js';

const CONTEXT = ['v3', 'thalamus', 'commissure', 'lamina', 'chiasm', 'fornix', 'mtt', 'mammillary', 'stalk', 'adeno', 'neuro', 'eminence'];
const PRE = ['preopticM', 'preopticL'];
const SUPRA = ['suprachiasmatic', 'supraoptic', 'paraventricular', 'anterior'];
const TUB = ['arcuate', 'dorsomedial', 'ventromedial'];
const MAM = ['posterior', 'mammillary', 'tuberomammillary'];
const PERI = ['periventricular', 'suprachiasmatic', 'arcuate'];
const MED = ['preopticM', 'anterior', 'paraventricular', 'supraoptic', 'dorsomedial', 'ventromedial', 'posterior', 'mammillary'];
const LAT = ['preopticL', 'lateral', 'mfb'];
const NUCLEI = [...new Set([...PRE, ...SUPRA, ...TUB, ...MAM, ...PERI, ...LAT])];
const BASE = [...CONTEXT, ...NUCLEI];

const spreads = [
  {
    title: 'Quattro regioni, tre zone',
    body:
      "L'ipotalamo è la parte del diencefalo che abbraccia la metà inferiore del {terzo ventricolo|v3}, sotto il talamo. In senso antero-posteriore si distinguono la {regione preottica|pre}, attorno alla lamina terminale; la {sopraottica|supra}, sopra il {chiasma ottico|chiasm}; la {tuberale|tub}, sopra il tuber cinereum; la {mammillare|mam}, con i corpi mammillari. In senso medio-laterale si succedono una sottile {zona periventricolare|peri}, una {zona mediale|med}, la più ricca di nuclei, e una {zona laterale|lat}: le separa il piano che unisce {fornice|fx} e fascio mammillotalamico.",
    terms: { v3: ['v3'], pre: PRE, supra: SUPRA, chiasm: ['chiasm'], tub: TUB, mam: MAM, peri: PERI, med: MED, lat: LAT, fx: ['fornix', 'mtt'] },
    quiz: {
      question: 'In quale regione si trova il nucleo soprachiasmatico?',
      options: ['Preottica', 'Sopraottica', 'Tuberale', 'Mammillare'],
      correct: 1,
      explain: 'Nella zona periventricolare, subito sopra il chiasma ottico.',
    },
    caption: 'I nuclei dei due lati ai fianchi del terzo ventricolo; in basso l’ipofisi.',
    instruction: 'SCEGLI UNA REGIONE (DAVANTI-DIETRO) O UNA ZONA (DENTRO-FUORI)',
    mode: selector({
      base: BASE,
      options: [
        { label: 'Preottica', lit: PRE, info: 'Nuclei preottici mediale e laterale: l’unica parte associata al telencefalo.' },
        { label: 'Sopraottica', lit: SUPRA, info: 'Soprachiasmatico, sopraottico, paraventricolare, ipotalamico anteriore.' },
        { label: 'Tuberale', lit: TUB, info: 'Arcuato, dorsomediale, ventromediale.' },
        { label: 'Mammillare', lit: MAM, info: 'Corpi mammillari, ipotalamico posteriore, tubero-mammillare.' },
        { label: 'Periventricolare', lit: PERI, info: 'Una lamina sottile addossata all’ependima: periventricolare, soprachiasmatico, arcuato.' },
        { label: 'Mediale', lit: MED, info: 'La zona più popolata: controllo del sistema nervoso autonomo e della neuroipofisi.' },
        { label: 'Laterale', lit: LAT, info: 'Nucleo ipotalamico laterale attraversato dal fascio mediale del telencefalo: comportamenti ed emozioni.' },
      ],
    }),
  },
  {
    title: "Due vie verso l'ipofisi",
    body:
      "L'ipotalamo governa l'ipofisi in due modi. I neuroni magnocellulari dei nuclei {paraventricolare|pvn} e {sopraottico|son} mandano i propri assoni lungo il {peduncolo ipofisario|stalk} fino alla {neuroipofisi|neuro}. I neuroni parvicellulari dei nuclei {periventricolare|pev} e {arcuato|arc} proiettano invece all'{eminenza mediana|em}, ricca di capillari: qui liberano i fattori di rilascio o di inibizione che regolano la secrezione dell'{adenoipofisi|adeno}.",
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
    caption: 'In blu la neurosecrezione; in rosso il passaggio attraverso i capillari.',
    instruction: 'SCEGLI QUALE PARTE DELL’IPOFISI RAGGIUNGERE',
    mode: selector({
      base: BASE,
      pick: { neuro: 0, adeno: 1 },
      options: [
        {
          label: 'Neuroipofisi', stepTime: 1.5,
          steps: [
            { ids: ['paraventricular', 'supraoptic'], text: 'Neuroni magnocellulari: paraventricolare e sopraottico' },
            { ids: ['stalk'], links: ['pvn-neuro', 'son-neuro'], text: 'Gli assoni scendono nel peduncolo ipofisario' },
            { ids: ['neuro'], text: 'Neuroipofisi' },
          ],
        },
        {
          label: 'Adenoipofisi', stepTime: 1.5,
          steps: [
            { ids: ['periventricular', 'arcuate'], text: 'Neuroni parvicellulari: periventricolare e arcuato' },
            { ids: ['eminence'], links: ['arc-em', 'pev-em'], text: 'Eminenza mediana: fattori di rilascio e di inibizione' },
            { ids: ['adeno'], links: ['portal'], text: "Attraverso i capillari, fino all'adenoipofisi" },
          ],
        },
      ],
    }),
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
    mode: selector({
      base: BASE,
      options: [
        { label: 'Temperatura', lit: ['anterior', 'preopticM', 'posterior'], info: 'Anteriore: dissipa calore (lesione: ipertermia). Posteriore: conserva calore (lesione: poichilotermia).' },
        { label: 'Fame e sazietà', lit: ['ventromedial', 'lateral'], info: 'Ventromediale: sazietà (lesione: obesità). Laterale: fame, con le orexine (lesione: anoressia).' },
        { label: 'Aggressività', lit: ['ventromedial', 'lateral'], info: 'Laterale stimolato: rabbia; lesionato: passività. Ventromediale stimolato: tranquillità; lesionato: aggressività.' },
        { label: 'Sete', lit: ['anterior', 'lateral'], info: 'Osmocettori dell’ipotalamo anteriore; una lesione laterale riduce l’assunzione di acqua.' },
      ],
    }),
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
    caption: 'Verde: via eccitatoria dalla retina. Rosso: inibizione dei sistemi del risveglio.',
    instruction: 'SCEGLI: OROLOGIO, SONNO O VEGLIA',
    mode: selector({
      base: BASE,
      options: [
        {
          label: 'Orologio circadiano', stepTime: 1.5,
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
          label: 'Veglia', lit: ['tuberomammillary', 'lateral'], activity: { tuberomammillary: 1, lateral: 1 },
          info: "Istamina e orexina sostengono la veglia; l'orexina eccita il locus coeruleus.",
        },
      ],
    }),
  },
];

export default {
  id: 'ipotalamo',
  title: 'Ipotalamo',
  blurb: "Regioni e nuclei, le vie verso l'ipofisi, termoregolazione, fame, sonno.",
  part: 'Encefalo',
  order: 35,
  model: 'hypothalamus',
  createModel: () => new Hypothalamus(),
  yaw: -1.0,
  spreads,
};
