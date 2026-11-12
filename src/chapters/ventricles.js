// Capitolo "Ventricoli cerebrali". Testi dagli appunti di neuroanatomia
// (Ventricoli) e, per l'ultima pagina, di neurochirurgia (3. Idrocefalo).
import { selector } from '../modes.js';
import { Brain } from '../brain.js';

const LATERAL = ['lvFront', 'lvBody', 'lvTrig', 'lvTemp', 'lvOcc'];
const PASSAGES = ['monro', 'aqueduct', 'luschka', 'magendie', 'canal'];
const SHELL = ['hemi', 'stem', 'cerebellum'];
const SYSTEM = [...LATERAL, 'v3', 'v4', ...PASSAGES];
const big = (ids, k) => Object.fromEntries(ids.map((id) => [id, k]));

const spreads = [
  {
    title: 'Quattro cavità comunicanti',
    body:
      "I ventricoli cerebrali sono quattro cavità comunicanti nella profondità dell'encefalo, residuo del lume del tubo neurale e rivestite da ependima. I due {ventricoli laterali|lv}, uno per emisfero, comunicano con il {terzo ventricolo|v3} attraverso i {forami interventricolari di Monro|monro}. Il terzo, impari e mediano nel diencefalo, comunica attraverso l'{acquedotto di Silvio|aq} con il {quarto ventricolo|v4}, compreso tra cervelletto, ponte e bulbo, che in basso si continua con il {canale centrale|canal} del midollo spinale.",
    terms: { lv: LATERAL, v3: ['v3'], monro: ['monro'], aq: ['aqueduct'], v4: ['v4'], canal: ['canal'] },
    quiz: {
      question: 'Quale struttura mette in comunicazione il terzo e il quarto ventricolo?',
      options: ['I forami di Monro', "L'acquedotto di Silvio", 'Il forame di Magendie', 'Il canale centrale'],
      correct: 1,
      explain: "L'acquedotto è il residuo della vescicola mesencefalica.",
    },
    caption: "Calco dei ventricoli all'interno di un encefalo trasparente.",
    instruction: 'ISOLA UNA CAVITÀ · TRASCINA IL MODELLO PER RUOTARLO',
    mode: selector({
      base: [...SHELL, ...SYSTEM],
      options: [
        { label: 'Laterali', lit: LATERAL, info: 'Uno per emisfero: residuo della vescicola che dà origine al telencefalo.' },
        { label: 'Terzo', lit: ['v3'], info: 'Impari e mediano, nel diencefalo, tra i due talami.' },
        { label: 'Quarto', lit: ['v4'], info: 'Tra cervelletto (dietro) e ponte e bulbo (davanti).' },
        { label: 'Passaggi', lit: PASSAGES, info: 'Monro, acquedotto di Silvio, forami di Luschka e di Magendie, canale centrale.' },
      ],
    }),
  },
  {
    title: 'Il ventricolo laterale: una C con tre corni',
    body:
      "Ogni ventricolo laterale ha la forma di una C con la concavità rivolta in basso e in avanti. Dalla porzione centrale, la {cella media|body}, nascono tre prolungamenti. Il {corno frontale|front}, davanti al forame di Monro, ha come parete laterale la {testa del nucleo caudato|caud}. Il {corno temporale|temp}, il più ampio, abbraccia il polo posteriore del {talamo|thal} e ha per pavimento l'{ippocampo|hippo}. Il {corno occipitale|occ}, il più piccolo, può mancare. I tre si incontrano nel {trigono collaterale|trig}.",
    terms: {
      body: ['lvBody'], front: ['lvFront'], caud: ['caudHead'], temp: ['lvTemp'],
      thal: ['thalamus'], hippo: ['hippocampus'], occ: ['lvOcc'], trig: ['lvTrig'],
    },
    quiz: {
      question: 'Quale struttura forma il pavimento del corno temporale?',
      options: ['La testa del nucleo caudato', "L'ippocampo", 'Il corpo calloso', 'Il talamo'],
      correct: 1,
      explain: "Con l'alveus e la fimbria; la volta è data da tapetum e coda del caudato.",
    },
    caption: 'Scegliendo una porzione compaiono le strutture che ne formano le pareti.',
    instruction: 'SCEGLI UNA PORZIONE E GUARDA CHE COSA LA DELIMITA',
    mode: selector({
      base: [...SHELL, ...LATERAL, 'monro', 'v3'],
      pick: { lvFront: 0, lvBody: 1, lvTemp: 2, lvOcc: 3 },
      options: [
        { label: 'Corno frontale', lit: ['lvFront', 'caudHead', 'fxCol'], info: 'Parete laterale: testa del caudato. Parete mediale: setto pellucido e colonne del fornice.' },
        { label: 'Cella media', lit: ['lvBody', 'callosum', 'caudBody', 'thalamus', 'fxBody'], info: 'Volta: corpo calloso. Pavimento: corpo del caudato, talamo e fornice.' },
        { label: 'Corno temporale', lit: ['lvTemp', 'caudTail', 'hippocampus', 'fimbria'], info: 'Volta: tapetum e coda del caudato. Pavimento: ippocampo, con alveus e fimbria.' },
        { label: 'Corno occipitale', lit: ['lvOcc', 'lvTrig'], info: 'Nasce dal trigono e termina nel lobo occipitale; sulla faccia mediale, bulbo e calcar avis.' },
      ],
    }),
  },
  {
    title: 'Il viaggio del liquor',
    body:
      "Il liquor cerebrospinale è prodotto dai {plessi corioidei|plexus}: circa 150 cc al giorno, tre volte il volume contenuto nel nevrasse. Dai ventricoli laterali passa nel terzo, percorre l'acquedotto e raggiunge il quarto ventricolo. Da qui esce nello {spazio subaracnoideo|sas} attraverso i due {forami di Luschka|luschka}, nei recessi laterali, e il {forame di Magendie|magendie}, mediano, che si apre nella cisterna magna. Viene infine riassorbito dalle {granulazioni aracnoidee|gran}, soprattutto lungo il {seno sagittale superiore|sss}.",
    terms: { plexus: ['plexus'], sas: ['sas'], luschka: ['luschka'], magendie: ['magendie'], gran: ['granulations'], sss: ['sinus'] },
    quiz: {
      question: 'Dove viene riassorbita la maggior parte del liquor?',
      options: ['Nei plessi corioidei', 'Nelle granulazioni aracnoidee', "Nell'acquedotto di Silvio", 'Nel canale centrale'],
      correct: 1,
      explain: 'Soprattutto a livello del seno sagittale superiore.',
    },
    caption: 'Dai plessi corioidei (in rosso) alle granulazioni aracnoidee, tappa per tappa.',
    instruction: 'FAI PARTIRE IL LIQUOR E SEGUILO FINO AL SENO VENOSO',
    mode: selector({
      base: [...SHELL, ...SYSTEM, 'plexus'],
      looks: Object.fromEntries([...LATERAL, 'v3', 'v4'].map((id) => [id, { opacity: 0.42 }])),
      idle: 'I ventricoli sono resi trasparenti per mostrare i plessi corioidei al loro interno.',
      options: [
        {
          label: 'Segui il liquor',
          stepTime: 1.5,
          steps: [
            { ids: ['plexus'], text: 'I plessi corioidei producono il liquor' },
            { ids: LATERAL, text: 'Ventricoli laterali' },
            { ids: ['monro'], text: 'Forami interventricolari di Monro' },
            { ids: ['v3'], text: 'Terzo ventricolo' },
            { ids: ['aqueduct'], text: 'Acquedotto di Silvio' },
            { ids: ['v4'], text: 'Quarto ventricolo' },
            { ids: ['luschka', 'magendie'], text: 'Forami di Luschka e di Magendie' },
            { ids: ['sas'], text: 'Spazio subaracnoideo' },
            { ids: ['granulations', 'sinus'], text: 'Granulazioni aracnoidee e seno sagittale superiore' },
          ],
        },
      ],
    }),
  },
  {
    title: "Se la via si chiude: l'idrocefalo",
    body:
      "L'idrocefalo è un eccessivo accumulo di liquor che dilata le cavità ventricolari. Nella forma ostruttiva il flusso si blocca dentro il sistema ventricolare e si dilata tutto ciò che sta a monte: una stenosi dell'{acquedotto di Silvio|aq} gonfia {terzo ventricolo|v3} e {ventricoli laterali|lv}; l'atresia dei {forami di Luschka e di Magendie|out}, nella sindrome di Dandy-Walker, coinvolge anche il {quarto|v4}. Nella forma comunicante l'ostacolo è fuori, nello {spazio subaracnoideo|sas} o nel riassorbimento: i ventricoli comunicano liberamente e si dilatano tutti.",
    terms: { aq: ['aqueduct'], v3: ['v3'], lv: LATERAL, out: ['luschka', 'magendie'], v4: ['v4'], sas: ['sas'] },
    quiz: {
      question: "Una stenosi dell'acquedotto di Silvio dilata…",
      options: ['solo il quarto ventricolo', 'il terzo ventricolo e i ventricoli laterali', 'tutti e quattro i ventricoli', 'solo i ventricoli laterali'],
      correct: 1,
      explain: "Si dilata ciò che sta a monte dell'ostacolo; il quarto resta normale.",
    },
    caption: "Il punto di blocco si scurisce; le cavità a monte si dilatano.",
    instruction: 'SCEGLI DOVE SI BLOCCA IL FLUSSO (ANCHE CLICCANDO UN PASSAGGIO)',
    mode: selector({
      base: [...SHELL, ...SYSTEM],
      pick: { monro: 0, aqueduct: 1, luschka: 2, magendie: 2, granulations: 3, sas: 3 },
      idle: 'Nessun ostacolo: il liquor circola e i ventricoli hanno dimensioni normali.',
      options: [
        { label: 'Forami di Monro', dead: ['monro'], scale: big(LATERAL, 1.3), info: 'Ostruttivo. Si dilatano i ventricoli laterali; terzo e quarto restano normali.' },
        { label: 'Acquedotto di Silvio', dead: ['aqueduct'], scale: { ...big(LATERAL, 1.3), v3: 1.45 }, info: 'Ostruttivo. Si dilatano ventricoli laterali e terzo ventricolo; il quarto resta normale.' },
        { label: 'Fori del quarto', dead: ['luschka', 'magendie'], scale: { ...big(LATERAL, 1.3), v3: 1.45, v4: 1.4 }, info: 'Ostruttivo (es. Dandy-Walker). Si dilata tutto il sistema ventricolare.' },
        { label: 'Fuori dai ventricoli', dead: ['granulations'], show: ['sas', 'sinus', 'granulations'], scale: { ...big(LATERAL, 1.22), v3: 1.3, v4: 1.25 }, info: 'Comunicante: manca il riassorbimento (infezioni, emorragia subaracnoidea). I ventricoli comunicano e si dilatano tutti.' },
      ],
    }),
  },
];

export default {
  id: 'ventricoli',
  title: 'Ventricoli cerebrali',
  blurb: "Le quattro cavità, il viaggio del liquor e l'idrocefalo.",
  part: 'Encefalo',
  order: 31,
  model: 'brain',
  createModel: () => new Brain(),
  yaw: -0.95,
  spreads,
};
