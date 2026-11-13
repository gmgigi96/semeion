// Capitolo "Base cranica". Testi dagli appunti di neuroanatomia (Base cranica).
import { selector } from '../modes.js';
import { BaseCranica } from '../models/base-cranica.js';

const ANT = ['frontal', 'ethmoid', 'cristaGalli', 'sphLesser'];
const MID = ['sphBody', 'sphGreater', 'tempMid'];
const POST = ['clivusSph', 'occBasilar', 'tempPost', 'occipital'];
const SECTION = ['sectionF', 'sectionP', 'sectionO'];
const BONES = [...ANT, ...MID, ...POST, 'parietal', ...SECTION];
const CLIVUS = ['clivusSph', 'occBasilar'];
const ORBIT_NERVES = ['cn3', 'cn3t', 'cn4', 'cn6', 'v1', 'frontalN', 'lacrimalN', 'nasociliaryN'];
const tint = (ids, color) => Object.fromEntries(ids.map((id) => [id, { color }]));
// Ogni pagina porta al centro la fossa di cui parla: primo piano del motore su un
// punto della linea mediana, a quota 0.25 (il piano delle fosse), `z` in avanti.
const fossa = (z, scale) => ({ at: [0, 0.25, z], scale, height: 0.25 * scale });
const glass = (ids, opacity) => Object.fromEntries(ids.map((id) => [id, { opacity }]));

const spreads = [
  {
    title: 'Tre fosse su tre piani',
    body:
      "La base cranica presenta tre fosse disposte su piani diversi, che in senso antero-posteriore scendono dall'alto verso il basso. La {fossa cranica anteriore|ant} è formata da frontale, etmoide e piccole ali dello sfenoide; il suo confine è il {margine posteriore della piccola ala|ridge}, che termina nei processi clinoidei anteriori. La {fossa media|mid} arriva fino al dorso della sella e al {margine superiore della piramide|petrous} del temporale, percorso dal seno petroso superiore. La {fossa posteriore|post} è chiusa dietro dal {solco del seno trasverso|trans}.",
    terms: { ant: ANT, mid: MID, post: POST, ridge: ['sphRidge'], petrous: ['sps'], trans: ['transverse'] },
    quiz: {
      question: 'Che cosa segna il confine tra fossa cranica anteriore e fossa media?',
      options: [
        'Il margine superiore della piramide del temporale',
        'Il margine posteriore della piccola ala dello sfenoide',
        'Il dorso della sella',
        'Il solco del seno trasverso',
      ],
      correct: 1,
      explain: 'Termina medialmente nei processi clinoidei anteriori.',
    },
    caption: 'Base cranica dall’alto, a calotta rimossa (ossa reali BodyParts3D). In alto la fronte.',
    instruction: 'SCEGLI UNA FOSSA · TRASCINA IL MODELLO PER RUOTARLO',
    view: { yaw: Math.PI, zoom: 0.8 },
    mode: selector({
      base: BONES,
      looks: { ...tint(ANT, 0xe3c46a), ...tint(MID, 0xd98f70), ...tint(POST, 0x86aacb) },
      idle: 'Giallo: fossa anteriore. Rosso mattone: fossa media. Azzurro: fossa posteriore.',
      pick: { frontal: 0, ethmoid: 0, sphLesser: 0, sphBody: 1, sphGreater: 1, tempMid: 1, tempPost: 2, occipital: 2, occBasilar: 2 },
      options: [
        { label: 'Fossa anteriore', lit: ANT, info: 'Frontale, etmoide, corpo e piccole ali dello sfenoide. È la più alta: tetto di orbite e cavità nasali.' },
        { label: 'Fossa media', lit: MID, info: 'Corpo e grandi ali dello sfenoide, squama e faccia antero-laterale della piramide del temporale.' },
        { label: 'Fossa posteriore', lit: POST, info: 'Clivo, occipitale e faccia postero-mediale della piramide. È la più bassa e la più ampia.' },
        {
          label: 'Confini', lit: ['sphRidge', 'sps', 'transverse'],
          info: 'Margine posteriore della piccola ala; margine superiore della piramide, con il seno petroso superiore; solco del seno trasverso.',
        },
      ],
    }),
  },
  {
    title: 'Fossa anteriore: tetto di orbite e naso',
    body:
      "La parte orbitaria del {frontale|frontal} forma il tetto delle orbite. Sul piano mediano la cresta frontale termina, al limite con l'etmoide, nel {foro cieco|caecum}, percorso da una vena emissaria del seno sagittale superiore. Subito dietro si estende la {lamina cribrosa|ethmoid} dell'etmoide, tetto delle cavità nasali, con la {crista galli|crista} e i forellini per i {filuzzi del nervo olfattivo|olf}; ai suoi lati si aprono i {forami etmoidali|eth}. Più indietro, nelle {piccole ali dello sfenoide|lesser}, il {canale ottico|optic} dà passaggio al nervo ottico e all'arteria oftalmica.",
    terms: {
      frontal: ['frontal'], caecum: ['fCaecum', 'emissary'], ethmoid: ['ethmoid'], crista: ['cristaGalli'], olf: ['olfactory'],
      eth: ['fEthmoid'], lesser: ['sphLesser'], optic: ['fOptic', 'optic', 'ophthalmicA'],
    },
    quiz: {
      question: 'Che cosa attraversa i forellini della lamina cribrosa?',
      options: ['Il nervo ottico', 'I filuzzi del nervo olfattivo', 'I vasi meningei anteriori', "L'arteria oftalmica"],
      correct: 1,
      explain: "La lamina cribrosa dell'etmoide è il tetto delle cavità nasali.",
    },
    caption: 'I fori sono segnati da anelli verdi; scegliendone uno compare ciò che lo attraversa.',
    instruction: 'SCEGLI UN OSSO O UN FORO DELLA FOSSA ANTERIORE',
    view: { yaw: Math.PI, zoom: 1, focus: fossa(0.22, 1.3) },
    mode: selector({
      base: [...ANT, 'sectionF', 'sphBody', 'sphGreater', 'clivusSph', 'fCaecum', 'fEthmoid', 'fOptic'],
      pick: { frontal: 0, ethmoid: 1, cristaGalli: 1, sphLesser: 2, fCaecum: 3, olfactory: 4, fEthmoid: 5, fOptic: 6, optic: 6 },
      idle: 'Tre ossa formano la fossa anteriore: frontale, etmoide e sfenoide.',
      options: [
        { label: 'Frontale', lit: ['frontal'], info: 'La parte orbitaria è il tetto delle orbite; sul piano mediano, la cresta frontale.' },
        { label: 'Etmoide', lit: ['ethmoid', 'cristaGalli'], info: 'Lamina cribrosa, tetto delle cavità nasali, sormontata dalla crista galli.' },
        { label: 'Piccole ali', lit: ['sphLesser'], info: 'Con il corpo dello sfenoide completano indietro la fossa; terminano nei processi clinoidei anteriori.' },
        { label: 'Foro cieco', lit: ['fCaecum', 'emissary'], info: 'Tra cresta frontale ed etmoide: vena emissaria del seno sagittale superiore.' },
        { label: 'Lamina cribrosa', lit: ['ethmoid', 'olfactory'], info: 'I filuzzi del nervo olfattivo salgono dalla cavità nasale attraverso i forellini.' },
        { label: 'Forami etmoidali', lit: ['fEthmoid', 'ethmoidalN'], info: 'Ai lati della lamina cribrosa: vasi e nervi etmoidali anteriori e posteriori.' },
        { label: 'Canale ottico', lit: ['fOptic', 'optic', 'ophthalmicA'], info: "Nervo ottico e arteria oftalmica; medialmente continua nel solco chiasmatico, che accoglie il chiasma." },
      ],
    }),
  },
  {
    title: 'Fossa media: i fori e ciò che li attraversa',
    body:
      "La fossa media è formata da corpo e {grande ala dello sfenoide|greater} e dalla {piramide del temporale|temp}. Al centro la {sella turcica|sella} accoglie l'ipofisi. La {fessura orbitaria superiore|sof}, tra piccola e grande ala, porta all'orbita i nervi oculomotore, trocleare, abducente e i rami dell'oftalmico. Il {forame rotondo|rot} dà passaggio al nervo mascellare, il {forame ovale|ovale} al mandibolare, il {forame spinoso|spin} all'arteria meningea media. Dal {forame lacero|lac} entra la carotide interna; dallo {iato del canale faciale|hiatus} il nervo grande petroso superficiale.",
    terms: {
      greater: ['sphGreater'], temp: ['tempMid'], sella: ['sphBody', 'pituitary'], sof: ['fSof'], rot: ['fRotundum'],
      ovale: ['fOvale'], spin: ['fSpinosum'], lac: ['fLacerum'], hiatus: ['fHiatus'],
    },
    quiz: {
      question: 'Quale nervo attraversa il forame rotondo?',
      options: ['Il nervo oftalmico', 'Il nervo mascellare', 'Il nervo mandibolare', 'Il nervo trocleare'],
      correct: 1,
      explain: 'Lo percorre per entrare nella fossa pterigo-palatina; il mandibolare passa dal forame ovale.',
    },
    caption: 'Fossa anteriore in trasparenza, per seguire i nervi fin dentro l’orbita.',
    instruction: 'SCEGLI UN FORO: COMPAIONO I NERVI E I VASI CHE LO ATTRAVERSANO',
    view: { yaw: Math.PI, zoom: 1, focus: fossa(0.1, 1.06) },
    mode: selector({
      base: [...ANT, 'sectionF', ...MID, ...CLIVUS, 'tempPost', 'pituitary', 'stem', 'fSof', 'fRotundum', 'fOvale', 'fSpinosum', 'fLacerum', 'fHiatus'],
      looks: glass([...ANT, 'sectionF'], 0.3),
      pick: { fSof: 0, fRotundum: 1, v2: 1, fOvale: 2, v3: 2, fSpinosum: 3, mma: 3, fLacerum: 4, ica: 4, fHiatus: 5, pituitary: 6, sphBody: 6 },
      idle: 'Sei aperture per lato, più la sella turcica al centro, con l’ipofisi.',
      options: [
        {
          label: 'Fessura orbitaria', lit: ['fSof', ...ORBIT_NERVES],
          info: "Fuori dall'anello di Zinn: lacrimale, frontale, trocleare (IV). Dentro: oculomotore (III), nasociliare, abducente (VI).",
        },
        { label: 'Rotondo', lit: ['fRotundum', 'v2', 'v5'], info: 'Nervo mascellare (V2), dal ganglio semilunare verso la fossa pterigo-palatina.' },
        { label: 'Ovale', lit: ['fOvale', 'v3', 'v5'], info: 'Nervo mandibolare (V3), verso la fossa infratemporale; arteria meningea accessoria e plesso venoso.' },
        { label: 'Spinoso', lit: ['fSpinosum', 'mma'], info: 'Arteria e vena meningee medie e nervo spinoso: i vasi solcano grande ala e squama.' },
        { label: 'Lacero', lit: ['fLacerum', 'ica'], info: "Ingresso della carotide interna dopo il tratto intrapetroso; in vivo il fondo è chiuso da fibrocartilagine." },
        { label: 'Iati petrosi', lit: ['fHiatus', 'gpn', 'lpn'], info: 'Iato del canale faciale: nervo grande petroso superficiale. Orifizio accessorio: piccolo petroso.' },
        { label: 'Sella turcica', lit: ['sphBody', 'pituitary', 'ica'], info: 'Tubercolo, fossa ipofisaria e dorso della sella; ai lati il solco carotico e il seno cavernoso.' },
      ],
    }),
  },
  {
    title: 'Fossa posteriore: verso il foro giugulare',
    body:
      "La fossa posteriore è formata dal {clivo|clivus}, dall'{occipitale|occ} e dalla faccia postero-mediale della {piramide|pyr}. Il {grande forame occipitale|magnum} dà passaggio al midollo allungato, alle arterie vertebrali e alla radice dell'accessorio; presso il suo margine si apre il {canale dell'ipoglosso|hyp}. Sulla piramide il {meato acustico interno|iam} accoglie i nervi faciale e vestibolo-cocleare. Il {solco del seno sigmoideo|sig} termina nel {foro giugulare|jug}: nella pars nervosa passano glossofaringeo, vago e accessorio, nella pars venosa il bulbo della vena giugulare.",
    terms: {
      clivus: CLIVUS, occ: ['occipital'], pyr: ['tempPost'], magnum: ['fMagnum'], hyp: ['fHypoglossal'],
      iam: ['fIam'], sig: ['sigmoid'], jug: ['fJugular'],
    },
    quiz: {
      question: 'Quali nervi attraversano la pars nervosa del foro giugulare?',
      options: ['Faciale e vestibolo-cocleare', 'Glossofaringeo, vago e accessorio', 'Ipoglosso e accessorio', 'Trigemino e abducente'],
      correct: 1,
      explain: 'La pars venosa, postero-laterale, contiene il bulbo della vena giugulare.',
    },
    caption: 'Nervi ricostruiti dal tronco encefalico (in trasparenza) fino ai rispettivi fori.',
    instruction: 'SCEGLI UN FORO, OPPURE SEGUI IL SANGUE DEI SENI VENOSI',
    view: { yaw: Math.PI, zoom: 1, focus: fossa(-0.09, 1.15) },
    mode: selector({
      base: [...POST, 'sectionO', 'tempMid', 'parietal', 'sectionP', 'stem', 'medulla', 'fMagnum', 'fHypoglossal', 'fJugular', 'fIam', 'fCondylar', 'fMastoid'],
      pick: { fMagnum: 0, medulla: 0, fHypoglossal: 1, fJugular: 2, fIam: 3, transverse: 4, sigmoid: 4, fCondylar: 5, fMastoid: 5, clivusSph: 6, occBasilar: 6 },
      idle: 'Domina il grande forame occipitale; dietro di esso la cresta occipitale interna.',
      options: [
        { label: 'Forame magno', lit: ['fMagnum', 'medulla', 'vertebral', 'cn11'], info: "Midollo allungato con le meningi, arterie vertebrali, vasi spinali, radice del nervo accessorio." },
        { label: 'Ipoglosso', lit: ['fHypoglossal', 'cn12', 'medulla'], info: "Nervo ipoglosso (XII), ramo meningeo dell'arteria faringea ascendente, plesso venoso." },
        {
          label: 'Foro giugulare', lit: ['fJugular', 'cn9', 'cn10', 'cn11', 'jugBulb', 'medulla'],
          info: 'Pars nervosa antero-mediale: IX, X, XI. Pars venosa postero-laterale: bulbo della vena giugulare.',
        },
        { label: 'Meato acustico', lit: ['fIam', 'cn7', 'cn8'], info: 'Nervo faciale nel quadrante antero-superiore; sotto e dietro, le aree cocleare e vestibolari.' },
        {
          label: 'Seni venosi',
          stepTime: 1.9,
          steps: [
            { ids: ['transverse'], text: 'Seno trasverso, dalla protuberanza occipitale interna' },
            { ids: ['sps'], text: 'Vi confluisce il seno petroso superiore, dal margine della piramide' },
            { ids: ['sigmoid'], text: 'Seno sigmoideo, nel suo solco sulla piramide' },
            { ids: ['ips'], text: 'Seno petroso inferiore, di lato al clivo' },
            { ids: ['fJugular', 'jugBulb'], text: 'Foro giugulare, pars venosa: bulbo della vena giugulare' },
          ],
        },
        { label: 'Emissarie', lit: ['fCondylar', 'fMastoid'], info: 'Canale condilare: vena emissaria condilare. Forame mastoideo: vena emissaria mastoidea.' },
        { label: 'Clivo', lit: CLIVUS, info: "Una porzione sfenoidale e una occipitale (parte basilare): scende dal dorso della sella al forame magno." },
      ],
    }),
  },
];

export default {
  id: 'base-cranica',
  title: 'Base cranica',
  blurb: 'Tre fosse, i loro fori e ciò che li attraversa.',
  part: 'Vasi e scheletro',
  order: 71,
  model: 'base-cranica',
  createModel: () => new BaseCranica(),
  zoom: 0.8,
  yaw: Math.PI,
  spreads,
};
