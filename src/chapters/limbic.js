// Capitolo "Sistema limbico". Testi dagli appunti di neuroanatomia (Sistema limbico).
import { selector } from '../modes.js';

const LOBE = ['cingulate', 'isthmus', 'parahippocampal', 'entorhinal', 'uncus'];
const FORNIX = ['fimbria', 'crus', 'fxBody', 'fxCol'];
const SHELL = ['hemi', 'stem'];

const spreads = [
  {
    title: "Un anello attorno al centro dell'encefalo",
    body:
      "Broca chiamò grande lobo limbico le strutture che delimitano, come un limbus, il centro dell'encefalo. Il {giro del cingolo|cing} circonda il {corpo calloso|cc} sulla faccia mediale dell'emisfero; attraverso l'{istmo|isth} si continua con la {circonvoluzione paraippocampale|phg}, lungo la faccia inferomediale del lobo temporale, che in avanti prosegue con la {corteccia entorinale|ent} e l'{uncus|uncus}. Insieme disegnano una C aperta in avanti. Il sistema limbico aggiunge a questo anello strutture profonde, tra cui {ippocampo|hippo} e {amigdala|amy}.",
    terms: {
      cing: ['cingulate'], cc: ['callosum'], isth: ['isthmus'], phg: ['parahippocampal'],
      ent: ['entorhinal'], uncus: ['uncus'], hippo: ['hippocampus'], amy: ['amygdala'],
    },
    quiz: {
      question: 'Quale struttura unisce il giro del cingolo alla circonvoluzione paraippocampale?',
      options: ["L'uncus", "L'istmo", 'Il fornice', 'La commessura anteriore'],
      correct: 1,
      explain: 'Insieme formano un anello di corteccia attorno al corpo calloso.',
    },
    caption: 'Il lobo limbico dei due lati attorno al corpo calloso.',
    instruction: 'CONFRONTA L’ANELLO CORTICALE CON LE STRUTTURE PROFONDE',
    mode: selector({
      base: [...SHELL, 'callosum', ...LOBE],
      options: [
        { label: 'Lobo limbico', lit: LOBE, info: 'Giro del cingolo, istmo, circonvoluzione paraippocampale, corteccia entorinale, uncus.' },
        {
          label: 'Strutture profonde',
          lit: ['hippocampus', 'amygdala', 'septal', 'hypothalamus', 'anterior', 'mammillary', ...FORNIX, 'fxPost'],
          info: 'Ippocampo e fornice, amigdala, area settale, corpi mammillari, ipotalamo e nuclei anteriori del talamo.',
        },
      ],
    }),
  },
  {
    title: "Dall'ippocampo al fornice",
    body:
      "L'{ippocampo|hippo}, nella porzione mesiale del lobo temporale, è formato da corno d'Ammone e giro dentato. Dalla sua superficie nasce la {fimbria|fimbria}, un nastro di sostanza bianca che si stacca e forma le {gambe del fornice|crus}. Le due gambe si uniscono nel {corpo del fornice|body}, che in avanti si continua nelle {colonne|col}. Alla {commessura anteriore|ac} le fibre si dividono: il {fornice precommessurale|pre} raggiunge l'{area settale|septal}; quello {postcommessurale|post} scende nel diencefalo fino ai {corpi mammillari|mb}.",
    terms: {
      hippo: ['hippocampus'], fimbria: ['fimbria'], crus: ['crus'], body: ['fxBody'], col: ['fxCol'],
      ac: ['commissure'], pre: ['fxPre'], septal: ['septal'], post: ['fxPost'], mb: ['mammillary'],
    },
    quiz: {
      question: 'Dove termina il fornice postcommessurale?',
      options: ["Nell'area settale", 'Nei corpi mammillari', "Nell'amigdala", 'Nel giro del cingolo'],
      correct: 1,
      explain: 'Passa dietro la commessura anteriore e scende nel diencefalo.',
    },
    caption: 'Il fornice dei due lati, dalla fimbria alle due destinazioni.',
    instruction: 'SCEGLI UNA DESTINAZIONE E SEGUI LE FIBRE DALL’IPPOCAMPO',
    mode: selector({
      base: [...SHELL, 'callosum', 'hippocampus', ...FORNIX, 'fxPre', 'fxPost', 'commissure', 'mammillary', 'septal'],
      options: [
        {
          label: 'Postcommessurale', stepTime: 1.2,
          steps: [
            { ids: ['hippocampus'], text: "Ippocampo (corno d'Ammone)" },
            { ids: ['fimbria'], text: 'Fimbria' },
            { ids: ['crus'], text: 'Gambe del fornice' },
            { ids: ['fxBody'], text: 'Corpo del fornice' },
            { ids: ['fxCol'], text: 'Colonne del fornice' },
            { ids: ['fxPost', 'mammillary'], text: 'Dietro la commessura anteriore, fino ai corpi mammillari' },
          ],
        },
        {
          label: 'Precommessurale', stepTime: 1.2,
          steps: [
            { ids: ['hippocampus'], text: "Ippocampo (corno d'Ammone)" },
            { ids: ['fimbria'], text: 'Fimbria' },
            { ids: ['crus'], text: 'Gambe del fornice' },
            { ids: ['fxBody'], text: 'Corpo del fornice' },
            { ids: ['fxCol'], text: 'Colonne del fornice' },
            { ids: ['fxPre', 'septal'], text: "Davanti alla commessura anteriore, fino all'area settale" },
          ],
        },
      ],
    }),
  },
  {
    title: 'Il circuito di Papez',
    body:
      "Il circuito di Papez collega le strutture limbiche in un anello che sembra alla base della formazione della memoria a breve termine. Dall'{ippocampo|hippo} le fibre percorrono il {fornice|fornix} e raggiungono i {corpi mammillari|mb}. Da qui nasce il {fascio mammillotalamico|mtt}, diretto ai {nuclei anteriori del talamo|ant}, che proiettano al {giro del cingolo|cing}. Attraverso l'istmo e la {circonvoluzione paraippocampale|phg}, con la corteccia entorinale, l'informazione rientra nell'ippocampo lungo la via perforante, e il giro ricomincia.",
    terms: {
      hippo: ['hippocampus'], fornix: [...FORNIX, 'fxPost'], mb: ['mammillary'], mtt: ['mtt'],
      ant: ['anterior'], cing: ['cingulate'], phg: ['parahippocampal', 'entorhinal'],
    },
    quiz: {
      question: 'Quale fascio collega i corpi mammillari ai nuclei anteriori del talamo?',
      options: ['La stria terminale', 'Il fascio mammillotalamico', 'La via perforante', 'Il fornice precommessurale'],
      correct: 1,
      explain: 'È la tappa che porta il circuito dal diencefalo verso il lobo limbico.',
    },
    caption: 'Le sette tappe del circuito, accese in ordine.',
    instruction: 'FAI PARTIRE IL CIRCUITO E SEGUI L’ANELLO',
    mode: selector({
      base: [...SHELL, 'callosum', ...LOBE, 'hippocampus', ...FORNIX, 'fxPost', 'mammillary', 'mtt', 'anterior', 'thalamus'],
      options: [
        {
          label: 'Avvia il circuito', stepTime: 1.4,
          steps: [
            { ids: ['hippocampus'], text: 'Ippocampo' },
            { ids: [...FORNIX, 'fxPost'], text: 'Fornice' },
            { ids: ['mammillary'], text: 'Corpi mammillari' },
            { ids: ['mtt'], text: 'Fascio mammillotalamico' },
            { ids: ['anterior'], text: 'Nuclei anteriori del talamo' },
            { ids: ['cingulate'], text: 'Giro del cingolo' },
            { ids: ['isthmus', 'parahippocampal', 'entorhinal'], text: 'Istmo, circonvoluzione paraippocampale, corteccia entorinale' },
            { ids: ['hippocampus'], text: "Via perforante: di nuovo nell'ippocampo" },
          ],
        },
      ],
    }),
  },
  {
    title: 'Amigdala, paura e ricompensa',
    body:
      "L'{amigdala|amy} è un complesso di nuclei a forma di mandorla presso il polo anteriore del lobo temporale. Attraverso la {stria terminale|st} invia efferenze all'{ipotalamo|hyp} e al tronco encefalico, che innescano risposte motorie stereotipate e viscerali nelle situazioni di pericolo. Sul sistema limbico agisce anche l'{area tegmentale ventrale|vta}: con la via dopaminergica mesolimbica proietta ad {area settale|septal}, {nucleus accumbens|acc} e amigdala, sostenendo piacere e gratificazione. Le sostanze che danno dipendenza eccitano proprio questa via.",
    terms: { amy: ['amygdala'], st: ['stria'], hyp: ['hypothalamus'], vta: ['vta'], septal: ['septal'], acc: ['accumbens'] },
    quiz: {
      question: 'Quale neurotrasmettitore usa la via mesolimbica?',
      options: ['Acetilcolina', 'GABA', 'Dopamina', 'Glutammato'],
      correct: 2,
      explain: "Nasce dall'area tegmentale ventrale (area A10).",
    },
    caption: 'In viola le proiezioni dopaminergiche dell’area tegmentale ventrale.',
    instruction: 'SCEGLI UN CIRCUITO: PERICOLO O RICOMPENSA',
    mode: selector({
      base: [...SHELL, 'amygdala', 'stria', 'hypothalamus', 'vta', 'septal', 'accumbens', 'hippocampus'],
      options: [
        {
          label: 'Risposta al pericolo', stepTime: 1.4,
          steps: [
            { ids: ['amygdala'], text: 'Amigdala (soprattutto nucleo centrale)' },
            { ids: ['stria'], text: 'Stria terminale' },
            { ids: ['hypothalamus'], text: 'Ipotalamo e tronco: risposte viscerali e motorie' },
          ],
        },
        {
          label: 'Via mesolimbica', lit: ['vta', 'septal', 'accumbens', 'amygdala'], links: ['vta-acc', 'vta-septal', 'vta-amy'],
          info: 'Area tegmentale ventrale › area settale, nucleus accumbens e amigdala: piacere, gratificazione, ricompensa.',
        },
      ],
    }),
  },
];

export default {
  id: 'sistema-limbico',
  title: 'Sistema limbico',
  blurb: "Lobo limbico, ippocampo e fornice, circuito di Papez, amigdala.",
  model: 'brain',
  yaw: -1.05,
  spreads,
};
