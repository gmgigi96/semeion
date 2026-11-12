// Capitolo "Sistema visivo": dalla retina alla corteccia calcarina, i difetti
// del campo visivo e il riflesso pupillare. Testi ricavati dagli appunti di
// neuroanatomia (Sistema visivo). I difetti del campo visivo per sede di
// lesione (pagina 4) non sono negli appunti: vedi le fonti in testa al modello.
import { selector, chipsInto, infoText } from '../modes.js';
import { VisualSystem } from '../models/sistema-visivo.js';

const RET_R = ['retRTS', 'retRTI', 'retRNS', 'retRNI'];
const RET_L = ['retLTS', 'retLTI', 'retLNS', 'retLNI'];
const RET = [...RET_R, ...RET_L];
const NASAL = ['retRNS', 'retRNI', 'retLNS', 'retLNI'];
const TEMPORAL = ['retRTS', 'retRTI', 'retLTS', 'retLTI'];
const TO_RIGHT = ['retRTS', 'retRTI', 'retLNS', 'retLNI']; // guardano il campo sinistro
const TO_LEFT = ['retRNS', 'retRNI', 'retLTS', 'retLTI'];
const EYES = ['scleraR', 'scleraL', 'corneaR', 'corneaL', 'lens', 'iris', ...RET, 'macula'];
const NERVES = ['opticNerveR', 'opticNerveL'];
const TRACTS = ['tractR', 'tractL'];
const LGB = ['lgbR', 'lgbL'];
const PATH = [...NERVES, 'chiasm', ...TRACTS, ...LGB];
const RAD_R = ['radSupR', 'radCenR', 'radInfR'];
const RAD = [...RAD_R, 'radSupL', 'radCenL', 'radInfL'];
const V1 = ['v1supR', 'v1infR', 'v1supL', 'v1infL'];
const FIBRES = ['fRT', 'fRN', 'fLT', 'fLN'];
const GENICULO = ['gSupR', 'gInfR', 'gSupL', 'gInfL'];
const EFFERENT = ['cn3', 'cn3inf', 'ciliaryGanglion', 'shortCiliary'];

// sostanza bianca in trasparenza, per vedere le fibre che la percorrono
const glass = (ids, opacity) => Object.fromEntries(ids.map((id) => [id, { opacity, litOpacity: opacity }]));
const GLASS = { ...glass([...NERVES, 'chiasm', ...TRACTS], 0.6), ...glass(RAD, 0.62) };

const spreads = [
  {
    title: 'Dalla retina al chiasma',
    body:
      "La {retina visiva|ret} occupa i tre quarti posteriori del bulbo, fino all'ora serrata. Gli assoni delle cellule ganglionari convergono sul disco del nervo ottico, 3 mm medialmente al polo posteriore; la {macula lutea|mac}, con la fovea, sta 1 mm lateralmente. Il {nervo ottico|on}, lungo 35-45 mm e rivestito da meningi, ha quattro parti: intrabulbare, orbitaria, canalicolare e intracranica. Davanti alla sella turcica forma con il controlaterale il {chiasma ottico|ch}: qui incrociano le fibre delle {emiretine nasali|nas}, mentre quelle delle {emiretine temporali|tem} restano dallo stesso lato.",
    terms: { ret: RET, mac: ['macula'], on: NERVES, ch: ['chiasm'], nas: NASAL, tem: TEMPORAL },
    quiz: {
      question: 'Quali fibre incrociano nel chiasma ottico?',
      options: ['Quelle delle emiretine temporali', 'Quelle delle emiretine nasali', 'Tutte le fibre del nervo ottico', 'Solo le fibre della macula'],
      correct: 1,
      explain: 'Per questo ogni tratto ottico porta la metà opposta del campo visivo di entrambi gli occhi.',
    },
    caption: 'Bulbi, retine, nervi ottici e chiasma reali (BodyParts3D). Arancio: retina che guarda il campo sinistro; blu: il destro.',
    instruction: 'SCEGLI UNA STRUTTURA O UN GRUPPO DI FIBRE · TRASCINA PER RUOTARE',
    view: { yaw: 0.35, zoom: 1.18 },
    mode: selector({
      base: [...EYES, ...PATH, 'hemi', 'stem'],
      looks: GLASS,
      pick: { opticNerveR: 1, opticNerveL: 1, chiasm: 2 },
      idle: 'Gli occhi sono rivolti verso chi legge: la sclera è in trasparenza, la retina a colori.',
      options: [
        { label: 'Retina', lit: [...RET, 'macula'], info: "Retina visiva fino all'ora serrata. Macula 1 mm lateralmente al polo posteriore, disco del nervo ottico 3 mm medialmente." },
        { label: 'Nervo ottico', lit: NERVES, info: 'Proiezione diencefalica rivestita da meningi, lunga 35-45 mm: parti intrabulbare, orbitaria, canalicolare e intracranica.' },
        { label: 'Chiasma', lit: ['chiasm'], info: "Nel solco del chiasma, davanti alla sella turcica, sopra l'ipofisi; si continua nei due tratti ottici." },
        { label: 'Fibre nasali', lit: [...NASAL, ...NERVES, 'chiasm', ...TRACTS], links: ['fRN', 'fLN'], info: 'Le fibre delle emiretine nasali incrociano nel chiasma e passano nel tratto ottico opposto.' },
        { label: 'Fibre temporali', lit: [...TEMPORAL, ...NERVES, 'chiasm', ...TRACTS], links: ['fRT', 'fLT'], info: 'Le fibre delle emiretine temporali restano sul bordo laterale del chiasma, nel tratto dello stesso lato.' },
      ],
    }),
  },
  {
    title: 'Tratto ottico e corpo genicolato',
    body:
      "Dopo il chiasma ogni tratto ottico riunisce le fibre che guardano la metà opposta del campo visivo: il {tratto destro|tr} contiene quelle dell'{emiretina temporale destra|rt} e dell'{emiretina nasale sinistra|ln}, il {tratto sinistro|tl} il contrario. Il tratto termina nel {corpo genicolato laterale|lgb}, propaggine del {talamo|thal} posteriore a sei strati: 1 e 2 ricevono dalle cellule ganglionari magne, da 3 a 6 dalle parve. Le fibre extragenicolate raggiungono invece l'{area pretettale|pt}, il {collicolo superiore|sc}, il nucleo soprachiasmatico e l'amigdala.",
    terms: {
      tr: ['tractR'], rt: ['retRTS', 'retRTI'], ln: ['retLNS', 'retLNI'], tl: ['tractL'],
      lgb: LGB, thal: ['thalamus'], pt: ['pretectal'], sc: ['colliculus'],
    },
    quiz: {
      question: 'Quali strati del corpo genicolato laterale ricevono dalle cellule ganglionari magne?',
      options: ['Gli strati 1 e 2', 'Gli strati 3 e 5', 'Gli strati 4 e 6', 'Tutti e sei'],
      correct: 0,
      explain: 'Gli strati da 3 a 6 ricevono dalle cellule parve, che portano forma e colore.',
    },
    caption: 'I tratti ottici girano attorno ai peduncoli cerebrali fino ai corpi genicolati laterali.',
    instruction: 'SCEGLI UN TRATTO E GUARDA DA QUALI EMIRETINE RICEVE',
    view: { yaw: 0.5, zoom: 1.3 },
    mode: selector({
      base: [...EYES, ...PATH, 'thalamus', 'stem', 'colliculus', 'pretectal', 'hemi'],
      looks: GLASS,
      pick: { tractR: 0, tractL: 1, lgbR: 2, lgbL: 2, colliculus: 3, pretectal: 3 },
      idle: 'Ogni tratto contiene fibre di entrambi gli occhi.',
      options: [
        { label: 'Tratto destro', lit: ['tractR', 'lgbR', ...TO_RIGHT, 'opticNerveR', 'opticNerveL', 'chiasm'], links: ['fRT', 'fLN'], info: 'Emiretina temporale destra ed emiretina nasale sinistra: è la metà sinistra del campo visivo.' },
        { label: 'Tratto sinistro', lit: ['tractL', 'lgbL', ...TO_LEFT, 'opticNerveR', 'opticNerveL', 'chiasm'], links: ['fRN', 'fLT'], info: 'Emiretina temporale sinistra ed emiretina nasale destra: è la metà destra del campo visivo.' },
        { label: 'Corpo genicolato', lit: [...LGB, 'thalamus'], info: "Nucleo a proiezione specifica per l'area 17. Strati 1-2: cellule magne; strati 3-6: cellule parve." },
        { label: 'Vie extragenicolate', lit: ['pretectal', 'colliculus', ...TRACTS], links: ['tPtR', 'tPtL', 'tScR', 'tScL'], info: "Lasciano il tratto prima del genicolato: area pretettale (pupilla) e collicolo superiore (movimenti di sguardo)." },
      ],
    }),
  },
  {
    title: 'Radiazione ottica e area 17',
    body:
      "Dal corpo genicolato laterale la radiazione ottica raggiunge l'area visiva primaria. Le {fibre del quadrante retinico superiore|sup} vanno dirette al lobo occipitale, nella porzione retrolenticolare della capsula interna, dietro il {nucleo lenticolare|len}. Quelle del {quadrante inferiore|inf} formano l'ansa di Meyer: decorrono nella porzione sottolenticolare, entrano nel lobo temporale attorno al {corno temporale|temp} e poi tornano indietro. Terminano sui labbri {superiore|v1s} e {inferiore|v1i} della scissura calcarina: è l'area 17, isocorteccia granulare segnata dalla stria di Gennari, circondata dalle aree 18 e 19.",
    terms: {
      sup: ['radSupR', 'radSupL'], len: ['lentiform'], inf: ['radInfR', 'radInfL'], temp: ['lvTemp'],
      v1s: ['v1supR', 'v1supL'], v1i: ['v1infR', 'v1infL'],
    },
    quiz: {
      question: "Quali fibre della radiazione ottica formano l'ansa di Meyer?",
      options: ['Quelle del quadrante retinico superiore', 'Quelle del quadrante retinico inferiore', 'Quelle della macula', 'Le fibre extragenicolate'],
      correct: 1,
      explain: 'Passano nella porzione sottolenticolare e fanno un giro nel lobo temporale prima di raggiungere il lobo occipitale.',
    },
    caption: "Radiazione ottica e area 17 ricostruite dentro lobo occipitale e ventricolo laterale reali, visti di lato.",
    instruction: 'SCEGLI UN FASCIO E SEGUILO FINO ALLA SCISSURA CALCARINA',
    view: { yaw: 2.0, zoom: 1.05 },
    mode: selector({
      base: [...TRACTS, ...LGB, 'chiasm', ...RAD, ...V1, 'occipital', 'hemi', 'thalamus'],
      looks: GLASS,
      pick: { radSupR: 0, radSupL: 0, radInfR: 1, radInfL: 1, v1supR: 2, v1infR: 2, v1supL: 2, v1infL: 2 },
      idle: 'Verde: fibre superiori. Rosso: fibre inferiori, con il giro in avanti dell’ansa di Meyer.',
      options: [
        { label: 'Fibre superiori', lit: ['radSupR', 'radSupL', 'v1supR', 'v1supL', ...LGB], show: ['lentiform'], links: ['gSupR', 'gSupL'], info: 'Quadranti retinici superiori: via diretta, retrolenticolare, fino al labbro superiore della scissura calcarina.' },
        { label: 'Ansa di Meyer', lit: ['radInfR', 'radInfL', 'v1infR', 'v1infL', ...LGB, 'lvTemp'], links: ['gInfR', 'gInfL'], info: 'Quadranti retinici inferiori: giro in avanti nel lobo temporale, sopra il corno temporale, poi fino al labbro inferiore.' },
        { label: 'Area 17', lit: [...V1, 'occipital'], info: 'Sui due labbri della scissura calcarina, sulla faccia mediale del lobo occipitale; attorno le aree 18 e 19.' },
        { label: 'Rapporti', lit: [...RAD, 'lentiform', 'lvTemp', 'lvRest'], show: ['lentiform'], info: 'La radiazione passa sotto e dietro il nucleo lenticolare e riveste tetto e parete laterale del ventricolo laterale.' },
      ],
    }),
  },
  {
    title: 'Lesioni: che cosa non si vede più',
    body:
      "Ogni punto della via porta una parte precisa del campo visivo, perciò la sede della lesione si legge nel difetto. Prima del chiasma le fibre sono di un solo {occhio|eye}. Nel {chiasma|ch} incrociano quelle delle {emiretine nasali|nas}, che guardano i campi temporali. Dal {tratto ottico|tr} in poi ogni lato porta la metà opposta del campo di entrambi gli occhi; nella radiazione le fibre dei quadranti retinici inferiori, che guardano in alto, passano per l'{ansa di Meyer|mey}, le superiori vanno {dirette|sup} alla {corteccia calcarina|v1}. Taglia la via e osserva i due campi.",
    terms: {
      eye: ['opticNerveR'], ch: ['chiasm'], nas: NASAL, tr: ['tractR'], mey: ['radInfR'], sup: ['radSupR'], v1: ['v1supR', 'v1infR'],
    },
    quiz: {
      question: "Un adenoma dell'ipofisi comprime il chiasma sulla linea mediana. Quale difetto del campo visivo provoca?",
      options: ['Cecità di un occhio', 'Emianopsia bitemporale', 'Emianopsia omonima', 'Quadrantopsia omonima superiore'],
      correct: 1,
      explain: 'Si interrompono le fibre crociate delle emiretine nasali, che guardano le due metà temporali del campo.',
    },
    caption: 'Gli anelli rossi segnano i punti di lesione, tutti a destra. Nei dischi, in scuro, ciò che ciascun occhio non vede più.',
    instruction: 'SCEGLI DOVE TAGLIARE LA VIA · I DISCHI MOSTRANO I DUE CAMPI VISIVI',
    view: { yaw: 0, zoom: 1.1 },
    mode: lesionMode,
  },
  {
    title: 'Riflesso fotico e accomodazione',
    body:
      "Il riflesso fotico varia il calibro della pupilla con la luce ed è indipendente dalla corteccia. Le ipRGC della retina proiettano, attraverso nervo e tratto ottico, all'{area pretettale|pt}, che attiva il {nucleo di Edinger-Westphal|ew}; le fibre parasimpatiche seguono il {nervo oculomotore|cn3} fino al {ganglio ciliare|cg}, da cui i {nervi ciliari brevi|scn} raggiungono lo {sfintere della pupilla|iris}: miosi bilaterale. L'accomodazione dipende invece dalla corteccia visiva e passa per il {collicolo superiore|col}. Una lesione pretettale abolisce la miosi alla luce ma non quella dell'accomodazione: è la pupilla di Argyll-Robertson.",
    terms: {
      pt: ['pretectal'], ew: ['ew'], cn3: ['cn3', 'cn3inf'], cg: ['ciliaryGanglion'], scn: ['shortCiliary'], iris: ['iris'], col: ['colliculus'],
    },
    quiz: {
      question: 'Nella pupilla di Argyll-Robertson che cosa si perde?',
      options: ["La miosi dell'accomodazione", 'La miosi del riflesso fotico', 'Entrambe le risposte', 'La midriasi al buio'],
      correct: 1,
      explain: "La lesione è nell'area pretettale: l'accomodazione, che passa per corteccia e collicolo superiore, è conservata.",
    },
    caption: 'Area pretettale, nucleo di Edinger-Westphal e tronco del III ricostruiti; ramo inferiore, ganglio ciliare e nervi ciliari reali.',
    instruction: 'AVVIA UN RIFLESSO E SEGUILO PASSO A PASSO',
    view: { yaw: 0.6, zoom: 1.2 },
    mode: selector({
      base: [...EYES, ...PATH, 'stem', 'colliculus', 'pretectal', 'ew', ...EFFERENT],
      looks: GLASS,
      idle: "L'arco riflesso: retina, area pretettale, Edinger-Westphal, oculomotore, ganglio ciliare, sfintere della pupilla.",
      options: [
        {
          label: "Luce nell'occhio destro", stepTime: 2.4,
          steps: [
            { ids: [...RET_R, 'opticNerveR'], links: ['pNerveT', 'pNerveN'], text: 'Le ipRGC della retina destra captano la luce; il segnale percorre il nervo ottico' },
            { ids: ['chiasm', ...TRACTS, 'pretectal'], links: ['pTractR', 'pTractL'], text: 'Metà delle fibre incrocia nel chiasma: i due tratti raggiungono le due aree pretettali' },
            { ids: ['ew'], links: ['ptEwRR', 'ptEwRL', 'ptEwLL', 'ptEwLR'], text: "L'area pretettale attiva i nuclei di Edinger-Westphal dei due lati" },
            { ids: ['cn3', 'cn3inf', 'ciliaryGanglion'], links: ['ewCgR', 'ewCgL'], text: 'Fibre parasimpatiche nel nervo oculomotore, fino al ganglio ciliare' },
            { ids: ['shortCiliary', 'iris'], links: ['cgIrisR', 'cgIrisL'], text: 'Nervi ciliari brevi › muscolo sfintere della pupilla: miosi bilaterale' },
          ],
        },
        {
          label: 'Accomodazione', stepTime: 2.4,
          steps: [
            { ids: [...RET, ...PATH], links: FIBRES, text: 'Retina › nervo ottico › chiasma › tratto › corpo genicolato laterale' },
            { ids: [...RAD, ...V1], links: GENICULO, text: 'Radiazione ottica › area 17, poi aree 18 e 19 e aree sopramodali' },
            { ids: ['colliculus'], links: ['ctxScR', 'ctxScL'], text: 'Vie discendenti dalla corteccia al collicolo superiore' },
            { ids: ['ew', ...EFFERENT, 'iris'], links: ['scEwR', 'scEwL', 'ewCgR', 'ewCgL', 'cgIrisR', 'cgIrisL'], text: 'Edinger-Westphal › oculomotore: muscolo ciliare, miosi e convergenza' },
          ],
        },
        {
          label: 'Lesione pretettale', dead: ['pretectal'], show: [...RAD, ...V1],
          links: [...FIBRES, ...GENICULO, 'ctxScR', 'ctxScL', 'scEwR', 'scEwL', 'ewCgR', 'ewCgL', 'cgIrisR', 'cgIrisL'],
          info: "Pupilla di Argyll-Robertson: manca la miosi alla luce, resta quella dell'accomodazione, che non passa per l'area pretettale.",
        },
      ],
    }),
  },
];

// 4 — taglio della via in un punto (sempre a destra) e difetto del campo visivo.
// blind: "occhio:emicampo:metà" (R/L, R/L, S/I).
const half = (side) => ['R', 'L'].flatMap((eye) => [`${eye}:${side}:S`, `${eye}:${side}:I`]);
const LESIONS = [
  {
    label: 'Nervo ottico', cut: 'cutNerve', pick: ['opticNerveR'],
    blind: ['R:L:S', 'R:L:I', 'R:R:S', 'R:R:I'], dead: [...RET_R, 'opticNerveR'], off: ['fRT', 'fRN'],
    info: "Cecità dell'occhio destro. Prima del chiasma le fibre appartengono a un solo occhio: l'altro vede tutto il campo.",
  },
  {
    label: 'Chiasma', cut: 'cutChiasm', pick: ['chiasm'],
    blind: ['R:R:S', 'R:R:I', 'L:L:S', 'L:L:I'], dead: NASAL, off: ['fRN', 'fLN'],
    info: 'Emianopsia bitemporale (eteronima). Si interrompono le fibre crociate delle emiretine nasali, che guardano i due campi temporali.',
  },
  {
    label: 'Tratto ottico', cut: 'cutTract', pick: ['tractR', 'lgbR'],
    blind: half('L'), dead: [...TO_RIGHT, 'tractR', 'lgbR', ...RAD_R, 'v1supR', 'v1infR'], off: ['fRT', 'fLN', 'gSupR', 'gInfR'],
    info: 'Emianopsia omonima sinistra. Il tratto destro porta la metà sinistra del campo di entrambi gli occhi.',
  },
  {
    label: 'Ansa di Meyer', cut: 'cutMeyer', pick: ['radInfR'],
    blind: ['R:L:S', 'L:L:S'], dead: ['retRTI', 'retLNI', 'radInfR', 'v1infR'], off: ['gInfR'],
    info: 'Quadrantopsia omonima superiore sinistra. Nel lobo temporale passano le fibre dei quadranti retinici inferiori, che guardano in alto.',
  },
  {
    label: 'Fibre superiori', cut: 'cutSup', pick: ['radSupR'],
    blind: ['R:L:I', 'L:L:I'], dead: ['retRTS', 'retLNS', 'radSupR', 'v1supR'], off: ['gSupR'],
    info: 'Quadrantopsia omonima inferiore sinistra. Le fibre dirette portano i quadranti retinici superiori, che guardano in basso.',
  },
  {
    label: 'Corteccia calcarina', cut: 'cutCortex', pick: ['v1supR', 'v1infR'],
    blind: half('L'), spare: true, dead: [...TO_RIGHT, 'v1supR', 'v1infR'], off: [],
    info: 'Emianopsia omonima sinistra, spesso con risparmio della visione maculare, al centro del campo.',
  },
];
const CUTS = LESIONS.map((l) => l.cut);
const LESION_BASE = [...EYES, ...PATH, ...RAD, ...V1, ...CUTS, 'hemi', 'occipital'];

async function lesionMode({ model, controls }) {
  let sel = null;
  const { chips, height } = await chipsInto(
    controls,
    LESIONS.map((l, i) => ({ label: l.label, onClick: () => select(sel === i ? null : i) }))
  );
  const info = await infoText(controls, -height - 0.03);
  const select = (i) => {
    sel = i;
    const l = LESIONS[i];
    chips.forEach((c, j) => c.setActive(j === i, 0xb3261e));
    model.setFields(l?.blind ?? [], { spare: l?.spare });
    model.showLinks([...FIBRES, ...GENICULO].filter((id) => !l?.off.includes(id)));
    info.text = l?.info ?? 'Nessuna lesione: i due occhi vedono tutto il campo. Arancio: metà sinistra; blu: metà destra.';
  };
  return {
    enter() {
      model.show(LESION_BASE);
      select(null);
      model.onClick = (id) => {
        const i = LESIONS.findIndex((l) => l.cut === id || l.pick.includes(id));
        if (i >= 0) select(i);
      };
      model.lookFn = (part) => {
        const l = LESIONS[sel];
        if (CUTS.includes(part.id)) return !l ? { opacity: 0.85 } : l.cut === part.id ? { glow: 0.7, scale: 1.12 } : { opacity: 0.22 };
        const look = { ...GLASS[part.id] };
        if (l?.dead.includes(part.id)) look.dead = true;
        return look;
      };
    },
  };
}

export default {
  id: 'sistema-visivo',
  title: 'Sistema visivo',
  blurb: 'Dalla retina alla corteccia calcarina, i difetti del campo visivo e il riflesso pupillare.',
  part: 'Organi di senso',
  order: 50,
  model: 'sistema-visivo',
  createModel: () => new VisualSystem(),
  yaw: 0.35,
  spreads,
};
