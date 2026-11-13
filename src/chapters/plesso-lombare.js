// Capitolo "Plesso lombare". Testi dagli appunti di neuroanatomia (4. Plesso lombare).
import { selector } from '../modes.js';
import { PlessoLombare } from '../models/plesso-lombare.js';

const SPINE = ['vT12', 'vL1', 'vL2', 'vL3', 'vL4', 'vL5', 'discs', 'sacrum'];
const BONES = [...SPINE, 'hip', 'hipL', 'femur', 'rib12'];
const RAMI = ['r1', 'r2', 'r3', 'r4'];
const ANSE = ['a1', 'a2', 'a3'];
const FR = ['fr2', 'fr3', 'fr4'];
const OR = ['or2', 'or3', 'or4'];
const LST = ['lstL4', 'r5', 'lst'];
const LFCN = ['lfcnProx', 'lfcn'];
const GF = ['gf', 'gfGenital', 'gfFemoral'];
const FEM = ['femPelvic', 'femoral'];
const FEM_ALL = [...FR, ...FEM, 'saphenous', 'femCut'];
const OBT_ALL = [...OR, 'obturator', 'obtAnt', 'obtPost'];
const PLEXUS = ['sub', ...RAMI, ...ANSE, ...FR, ...OR, ...LST];
const COLLATERAL = ['ih', 'ii', ...GF, ...LFCN];
const VESSELS = ['artery', 'vein'];

// Primi piani (vedi «Primi piani» in docs/AUTHORING.md): il punto `at` del modello
// va sopra il centro della pagina; ciò che esce dal volume della pagina è tagliato.
// Nelle ultime due pagine il modello è meno reclinato (`tilt`), per vedere la coscia.
const FOCUS = {
  spine: { at: [0.03, 0.6, 0.02], scale: 1.7, height: 0.33, stand: false },
  flank: { at: [0.04, 0.52, 0.01], scale: 1.35, height: 0.32, stand: false },
  thigh: { at: [0.041, 0.292, -0.102], scale: 1.22, height: 0.3, tilt: -0.32, stand: false },
};

const spreads = [
  {
    title: 'Dove nasce: accanto alle vertebre lombari',
    body:
      "Le radici del plesso lombare sono i {rami anteriori di L1, L2 e L3|roots}, con un contributo del {nervo sottocostale|sub} e di parte del {ramo anteriore di L4|r4}. Il plesso è accolto in profondità, tra le facce laterali dei {corpi vertebrali|bodies} da L1 a L4 e i loro processi costiformi, coperto dal {grande psoas|psoas}. Usciti dai fori intervertebrali, i rami si uniscono in modo piuttosto costante: ciascuno dà due rami lunghi periferici e un ramo anastomotico per il ramo sottostante: sono le tre {anse anastomotiche|anse}. Il ramo che L4 manda a L5 forma il {tronco lombosacrale|lst}, per il plesso sacrale.",
    terms: { roots: ['r1', 'r2', 'r3'], sub: ['sub'], r4: ['r4'], bodies: ['vL1', 'vL2', 'vL3', 'vL4'], psoas: ['psoasG'], anse: ANSE, lst: LST },
    quiz: {
      question: 'Quale ramo anteriore partecipa sia al plesso lombare sia al plesso sacrale?',
      options: ['L1', 'L2', 'L3', 'L4'],
      correct: 3,
      explain: 'Parte di L4 dà le radici inferiori di femorale e otturatorio; il resto si unisce a L5 nel tronco lombosacrale.',
    },
    caption: 'Plesso lombare destro, veduta antero-laterale: lo psoas è in trasparenza. Ossa, muscoli e nervi periferici sono mesh reali.',
    instruction: 'SCEGLI UN RAMO ANTERIORE E GUARDA CHE COSA NE NASCE',
    view: { yaw: -0.5, focus: FOCUS.spine },
    mode: selector({
      base: [...SPINE, 'rib12', 'hip', 'psoasG', ...PLEXUS, ...COLLATERAL, 'femPelvic', 'obturator'],
      pick: { r1: 0, r2: 1, r3: 2, r4: 3, a1: 4, a2: 4, a3: 4 },
      idle: 'Giallo: rami anteriori. Blu: anse. I colori pieni sono i nervi che ne nascono.',
      options: [
        { label: 'L1', lit: ['r1', 'sub', 'ih', 'ii', 'a1'], info: 'Da L1: ileoipogastrico e ileoinguinale, più un ramo anastomotico per L2, con cui forma la prima ansa.' },
        { label: 'L2', lit: ['r2', ...GF, ...LFCN, 'a2', 'fr2', 'or2'], info: 'Da L2: genitofemorale e femorocutaneo. Dalla seconda ansa, con L3, le radici superiori di femorale e otturatorio.' },
        { label: 'L3', lit: ['r3', 'fr3', 'or3', 'a3'], info: 'Da L3: le radici medie di otturatorio e femorale, più un ramo per parte di L4 (terza ansa).' },
        { label: 'L4', lit: ['r4', 'fr4', 'or4', ...LST], info: 'Da L4: le radici inferiori di otturatorio e femorale e un ramo per L5, con cui forma il tronco lombosacrale.' },
        { label: 'Anse', lit: [...RAMI, ...ANSE], info: 'Tre anse a catena: L1-L2, L2-L3, L3-L4. Attraverso di esse ogni nervo riceve fibre da più livelli.' },
        { label: 'Psoas', show: ['psoas', 'ql', 'iliacus'], info: 'Con lo psoas opaco il plesso scompare: si vedono solo i nervi nei punti in cui emergono dal muscolo.' },
      ],
    }),
  },
  {
    title: 'I rami collaterali',
    body:
      "L'{ileoipogastrico|ih} e l'{ileoinguinale|ii}, nervi misti da L1, emergono dal margine laterale del {grande psoas|psoas}, scendono sulla faccia anteriore del {quadrato dei lombi|ql} e proseguono paralleli alla cresta iliaca tra i muscoli larghi dell'addome. Il {genitofemorale|gf}, da L1 e L2, perfora la faccia anteriore dello psoas a livello del disco tra L3 e L4 e si divide in un {ramo genitale|gfg}, che entra nel canale inguinale, e un {ramo femorale|gff}, che passa sotto il {legamento inguinale|ing}. Il {cutaneo laterale della coscia|lfcn}, esclusivamente sensitivo, percorre la fossa iliaca nella fascia del {muscolo iliaco|iliacus} fino alla spina iliaca anterosuperiore.",
    terms: { ih: ['ih'], ii: ['ii'], psoas: ['psoas'], ql: ['ql'], gf: GF, gfg: ['gfGenital'], gff: ['gfFemoral'], ing: ['inguinal'], lfcn: LFCN, iliacus: ['iliacus'] },
    quiz: {
      question: 'Quale nervo emerge perforando la faccia anteriore del grande psoas?',
      options: ["L'ileoipogastrico", "L'ileoinguinale", 'Il genitofemorale', 'Il cutaneo laterale della coscia'],
      correct: 2,
      explain: 'Gli altri tre emergono dal margine laterale del muscolo.',
    },
    caption: 'Psoas, iliaco e quadrato dei lombi reali: ogni nervo compare dove lascia lo psoas.',
    instruction: 'SCEGLI UN NERVO (ANCHE CLICCANDOLO) E RUOTA IL MODELLO',
    view: { yaw: 0.5, focus: FOCUS.flank },
    mode: selector({
      base: [...BONES, 'psoasG', 'iliacus', 'ql', 'inguinal', 'sub', 'r1', 'r2', 'a1', ...COLLATERAL],
      initial: 0,
      pick: { ih: 0, ii: 1, gf: 2, gfGenital: 2, gfFemoral: 2, lfcn: 3, lfcnProx: 3 },
      idle: 'Viola: ileoipogastrico. Rosa: ileoinguinale. Verde-azzurro: genitofemorale. Arancio: cutaneo laterale. Psoas in trasparenza.',
      options: [
        { label: 'Ileoipogastrico', lit: ['ih', 'r1'], show: ['psoas'], info: 'Rami muscolari per trasverso, obliqui, retto e piramidale; rami cutanei per regione glutea superiore, ipogastrio, pube e genitali esterni.' },
        { label: 'Ileoinguinale', lit: ['ii', 'r1'], show: ['psoas'], info: "Parallelo e inferiore all'ileoipogastrico. Il ramo genitale percorre il canale inguinale: cute di genitali esterni, pube e coscia supero-mediale." },
        { label: 'Genitofemorale', lit: [...GF, 'r1', 'r2', 'a1'], show: ['psoas', 'artery'], info: "Scende sulla faccia anteriore dello psoas, satellite dell'arteria iliaca. Ramo genitale: cremastere e cute dei genitali. Ramo femorale: cute del triangolo di Scarpa." },
        { label: 'Cutaneo laterale', lit: [...LFCN, 'r2'], show: ['psoas'], info: 'Alla spina iliaca anterosuperiore perfora il legamento inguinale. Ramo gluteo e ramo femorale: cute antero-laterale della coscia fino al ginocchio.' },
        { label: 'Senza psoas', lit: [...COLLATERAL, 'sub', 'r1', 'r2', 'a1'], info: 'Tolto lo psoas si vede da dove vengono: ileoipogastrico e ileoinguinale da L1, genitofemorale e cutaneo laterale da L1 e L2.' },
      ],
    }),
  },
  {
    title: 'Femorale e otturatorio',
    body:
      "I rami terminali del plesso sono due nervi misti, formati da tre radici che si uniscono nella porzione inferiore del {grande psoas|psoas}. Il {nervo femorale|fem} nasce dalle sue {radici|fr} all'altezza del processo trasverso di L5, emerge nell'interstizio tra {muscolo iliaco|iliacus} e margine laterale dello psoas e passa sotto il {legamento inguinale|ing}; dopo 2-3 cm si divide nei rami terminali, tra cui il {nervo safeno|saph}. Il {nervo otturatorio|obt}, con {radici|or} da L2, L3 e L4, emerge dal margine mediale dello psoas, percorre la parete laterale della piccola pelvi e attraversa il {canale otturatorio|canal}, poi si divide in {ramo anteriore|oa} e {posteriore|op}.",
    terms: {
      psoas: ['psoasG'], fem: FEM, fr: FR, iliacus: ['iliacusG'], ing: ['inguinal'], saph: ['saphenous'],
      obt: ['obturator'], or: OR, canal: ['obtMembrane'], oa: ['obtAnt'], op: ['obtPost'],
    },
    quiz: {
      question: 'Da quale punto dello psoas emerge il nervo otturatorio?',
      options: ['Dal margine laterale', 'Dalla faccia anteriore', 'Dal margine mediale', "Dall'interstizio con il muscolo iliaco"],
      correct: 2,
      explain: "Dall'interstizio tra iliaco e margine laterale dello psoas emerge invece il nervo femorale.",
    },
    caption: 'Oro: femorale. Verde: otturatorio. Psoas e iliaco in trasparenza.',
    instruction: 'RISALI UN NERVO DALLA COSCIA FINO ALLE RADICI',
    view: { yaw: 0.45, focus: FOCUS.thigh },
    mode: selector({
      base: [...BONES, 'psoasG', 'iliacusG', 'inguinal', 'obtMembrane', ...RAMI, ...ANSE, ...FEM_ALL, ...OBT_ALL],
      pick: { femoral: 2, femPelvic: 2, fr2: 2, fr3: 2, fr4: 2, obturator: 3, or2: 3, or3: 3, or4: 3 },
      idle: 'Due nervi, tre radici ciascuno, dagli stessi rami anteriori: L2, L3 e L4.',
      options: [
        {
          label: 'Femorale a ritroso', stepTime: 2.2,
          steps: [
            { ids: ['saphenous', 'femCut'], text: 'Nella coscia: nervo safeno e rami cutanei anteriori' },
            { ids: ['femoral', 'inguinal'], text: 'Sotto il legamento inguinale, nella lacuna dei muscoli' },
            { ids: ['femPelvic'], text: "Nell'interstizio tra iliaco e margine laterale dello psoas" },
            { ids: FR, text: 'Radici superiore, media e inferiore, dentro lo psoas' },
            { ids: ['r2', 'r3', 'r4'], text: 'Rami anteriori di L2, L3 e L4' },
          ],
        },
        {
          label: 'Otturatorio a ritroso', stepTime: 2.2,
          steps: [
            { ids: ['obtAnt', 'obtPost'], text: 'Nella coscia: ramo anteriore e ramo posteriore' },
            { ids: ['obtMembrane'], text: 'Canale otturatorio, insieme ai vasi otturatori' },
            { ids: ['obturator'], text: "Parete laterale della piccola pelvi, ala del sacro, margine mediale dello psoas" },
            { ids: OR, text: 'Radici superiore, media e inferiore, dentro lo psoas' },
            { ids: ['r2', 'r3', 'r4'], text: 'Rami anteriori di L2, L3 e L4' },
          ],
        },
        { label: 'Femorale', lit: FEM_ALL, info: 'Tronco anteriore: muscolo-cutanei mediale e laterale. Tronco posteriore: nervo per il quadricipite e nervo safeno.' },
        { label: 'Otturatorio', lit: [...OBT_ALL, 'obtMembrane'], info: 'Ramo anteriore tra gli adduttori, per gracile, adduttore lungo e breve; ramo posteriore per adduttore grande e minimo.' },
        { label: 'Radici', lit: [...FR, ...OR, 'r2', 'r3', 'r4'], info: 'Le radici del femorale decorrono lateralmente a quelle dell’otturatorio e si uniscono nella parte bassa dello psoas.' },
      ],
    }),
  },
  {
    title: 'I passaggi verso la coscia',
    body:
      "Per raggiungere la coscia ogni nervo ha un passaggio obbligato. Il {femorale|fem} passa sotto il {legamento inguinale|ing} nella lacuna neuromuscolare, medialmente all'ileopsoas e lateralmente ai {vasi femorali|vessels}; dà rami per l'ileopsoas, il {pettineo|pect}, il {sartorio|sart} e i quattro ventri del {quadricipite|quad}. L'{otturatorio|obt} si impegna nel {canale otturatorio|canal} con i vasi otturatori e innerva l'otturatore esterno, il gracile e gli {adduttori|add}. Il {cutaneo laterale|lfcn} perfora il legamento inguinale alla spina iliaca anterosuperiore; il {ramo femorale del genitofemorale|gff} attraversa la lacuna dei vasi, lateralmente all'arteria femorale.",
    terms: {
      fem: FEM, ing: ['inguinal'], vessels: VESSELS, pect: ['pectineus'], sart: ['sartorius'], quad: ['quadriceps'],
      obt: ['obturator', 'obtAnt', 'obtPost'], canal: ['obtMembrane'], add: ['adductors'], lfcn: LFCN, gff: ['gfFemoral'],
    },
    quiz: {
      question: 'Nella lacuna neuromuscolare il nervo femorale si trova…',
      options: ['medialmente ai vasi femorali', 'lateralmente ai vasi femorali', "dentro il canale inguinale", 'nel canale otturatorio'],
      correct: 1,
      explain: "Sta medialmente all'ileopsoas e lateralmente ai vasi, che occupano la lacuna dei vasi.",
    },
    caption: 'I muscoli della coscia sono tagliati a metà. Un nervo interrotto e i suoi muscoli si scuriscono.',
    instruction: 'SCEGLI UN PASSAGGIO, POI TAGLIA UN NERVO',
    view: { yaw: 0.3, focus: FOCUS.thigh },
    mode: selector({
      base: [...BONES, 'psoas', 'iliacus', 'inguinal', 'obtMembrane', 'quadriceps', 'sartorius', 'pectineus', 'adductors',
        ...VESSELS, ...FEM, 'saphenous', 'femCut', 'obturator', 'obtAnt', 'obtPost', ...LFCN, ...GF],
      looks: { sartorius: { opacity: 0.55 }, pectineus: { opacity: 0.6 }, adductors: { opacity: 0.75 } },
      pick: { femoral: 0, obturator: 1, obtAnt: 1, obtPost: 1, lfcn: 2, gfFemoral: 3 },
      idle: 'Oro: femorale. Verde: otturatorio. Arancio: cutaneo laterale. Verde-azzurro: genitofemorale.',
      options: [
        { label: 'Lacuna dei muscoli', lit: [...FEM, 'inguinal', 'psoas', 'iliacus', ...VESSELS], info: "Sotto il legamento inguinale il femorale accompagna l'ileopsoas: i vasi femorali restano medialmente." },
        { label: 'Canale otturatorio', lit: ['obturator', 'obtAnt', 'obtPost', 'obtMembrane'], info: "Nel canale l'otturatorio dà il ramo per l'otturatore esterno; uscito dal foro otturatorio si divide nei due rami terminali." },
        { label: 'Spina iliaca', lit: [...LFCN, 'inguinal'], info: 'Il cutaneo laterale perfora il legamento inguinale e prosegue in uno sdoppiamento della fascia lata.' },
        { label: 'Lacuna dei vasi', lit: ['gf', 'gfFemoral', ...VESSELS, 'inguinal'], info: 'Il ramo femorale del genitofemorale scende lateralmente all’arteria femorale e perfora la fascia cribrosa.' },
        { label: 'Taglia il femorale', dead: [...FEM, 'saphenous', 'femCut', 'quadriceps', 'sartorius', 'pectineus'], info: 'Restano senza innervazione quadricipite, sartorio e pettineo; con il safeno si perde la cute mediale di gamba e piede.' },
        { label: "Taglia l'otturatorio", dead: ['obturator', 'obtAnt', 'obtPost', 'adductors'], info: 'Restano senza innervazione gracile e adduttori; si perde la cute della metà inferiore della faccia mediale della coscia.' },
      ],
    }),
  },
];

export default {
  id: 'plesso-lombare',
  title: 'Plesso lombare',
  blurb: 'Rami anteriori da L1 a L4 nello psoas, rami collaterali, nervo femorale e nervo otturatorio.',
  part: 'Midollo e nervi spinali',
  order: 14,
  model: 'plesso-lombare',
  createModel: () => new PlessoLombare(),
  zoom: 1,
  yaw: 0.4,
  spreads,
};
