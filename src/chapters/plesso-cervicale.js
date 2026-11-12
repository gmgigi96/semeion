// Capitolo "Plesso cervicale". Testi dagli appunti di neuroanatomia (2. Plesso cervicale).
import { selector } from '../modes.js';
import { PlessoCervicale } from '../models/plesso-cervicale.js';

const CERV = ['atlas', 'axis', 'vC3', 'vC4', 'vC5', 'vC6', 'vC7', 'discs'];
const HEAD = ['skull', 'mandible'];
const HEAD_G = ['skullG', 'mandibleG'];
const RAMI = ['r1', 'r2', 'r3', 'r4'];
const ANSE = ['a1', 'a2', 'a3'];
const SCN = ['sc', 'scMed', 'scInt', 'scLat'];
const CUT = ['lo', 'ga', 'tc', ...SCN];
const INFRA = ['sternohyoid', 'omohyoid', 'sternothyroid', 'thyrohyoid'];
const AC = ['c1xii', 'supRoot', 'infRoot', 'ansa', 'ansaRami', 'nThyro', 'nGenio'];
const PH_ROOTS = ['phC3', 'phC4', 'phC5'];
const PH = [...PH_ROOTS, 'phNeck', 'phPoint', 'phThorax', 'phDia', 'phPeric'];
const THORAX = ['thoracic', 'sternum', 'rib1', 'ribs', 'clavicle'];
const DIA = ['diaR', 'diaL'];

// Primo piano: dopo l'ingresso nella pagina il modello viene ingrandito e abbassato.
const closeUp = (drop, back, lean, scale, side, mode) => async (ctx) => {
  const api = await mode(ctx);
  return { ...api, enter() { api.enter(); ctx.model.focus(drop, back, lean, scale, side); } };
};

const spreads = [
  {
    title: 'Origine: quattro rami, tre anse',
    body:
      "Il plesso cervicale origina dall'anastomosi dei {rami anteriori|rami} dei nervi spinali da C1 a C4. È situato in profondità, anteriormente ai processi trasversi delle {prime quattro vertebre cervicali|vert}, accanto ai {muscoli scaleni|scal} e all'{elevatore della scapola|lev}, medialmente allo {sternocleidomastoideo|scm}, il suo muscolo di repere. C1 forma con C2 l'{ansa superiore|a1}, fatta di fibre bidirezionali, che scendono verso C2 e risalgono verso C1; lo stesso vale per l'{ansa media|a2}, tra C2 e C3, e per l'{ansa inferiore|a3}, tra C3 e C4. In alto il plesso prende rapporto medialmente con il {ganglio cervicale superiore|scg} e con l'origine della {vena giugulare interna|ijv}.",
    terms: {
      rami: RAMI, vert: ['atlas', 'axis', 'vC3', 'vC4'], scal: ['scalA', 'scalM'], lev: ['levator'], scm: ['scm'],
      a1: ['a1'], a2: ['a2'], a3: ['a3'], scg: ['scg'], ijv: ['ijv'],
    },
    quiz: {
      question: 'Quale muscolo è considerato il muscolo di repere del plesso cervicale?',
      options: ['Lo scaleno anteriore', 'Lo sternocleidomastoideo', "L'elevatore della scapola", 'Il trapezio'],
      correct: 1,
      explain: 'Il plesso gli sta medialmente, e dal suo margine posteriore emergono i rami cutanei.',
    },
    caption: 'Plesso cervicale destro, veduta antero-laterale. Ossa, muscoli, vasi e ramo di C4 sono mesh reali; gli altri rami e le anse sono ricostruiti.',
    instruction: 'SCEGLI UN RAMO ANTERIORE E GUARDA CHE COSA NE NASCE',
    view: { yaw: -0.75 },
    mode: closeUp(2.24, -0.059, 0, 5, 0.089, selector({
      base: [...CERV, ...HEAD_G, 'ganglia', ...RAMI, ...ANSE, 'scalM', 'levator', 'brachial'],
      pick: { r1: 0, r2: 1, r3: 2, r4: 3, a1: 4, a2: 4, a3: 4 },
      idle: 'Giallo: rami anteriori. Blu: anse. Scegli un ramo per vedere i nervi che ne nascono.',
      options: [
        { label: 'C1', lit: ['r1', 'a1', 'c1xii', 'hypoglossal'], info: "Da C1: l'ansa superiore con C2 e fibre che si uniscono al nervo ipoglosso, per la radice superiore dell'ansa cervicale." },
        { label: 'C2', lit: ['r2', 'a1', 'a2', 'lo', 'ga', 'tc', 'infRoot'], show: ['scmG'], info: "Da C2: ansa superiore e ansa media. Dall'ansa media nascono piccolo occipitale, grande auricolare e trasverso del collo." },
        { label: 'C3', lit: ['r3', 'a2', 'a3', 'infRoot', 'phC3'], info: "Da C3: ansa media e ansa inferiore; con C2 dà la radice inferiore dell'ansa cervicale e partecipa al nervo frenico." },
        { label: 'C4', lit: ['r4', 'a3', 'sc', 'phC4', 'phNeck'], show: ['scmG', 'scalA'], info: "Da C4: l'ansa inferiore, da cui origina il tronco sopraclavicolare, e la maggior parte delle fibre del nervo frenico." },
        { label: 'Anse', lit: [...RAMI, ...ANSE], info: 'Tre anse a catena: superiore, media e inferiore. Le fibre vi corrono nei due sensi.' },
        { label: 'Rapporti', show: ['scm', 'scalA', 'ijv', 'carotid', 'scg'], info: 'Lo sternocleidomastoideo copre il plesso; medialmente stanno il fascio vascolo-nervoso del collo e il ganglio cervicale superiore.' },
      ],
    })),
  },
  {
    title: 'Rami cutanei e punto nervoso',
    body:
      "I rami cutanei sono quattro. Il {piccolo occipitale|lo} emerge al terzo superiore del margine posteriore dello {sternocleidomastoideo|scm}; gli altri emergono a metà circa dello stesso margine in un unico punto, il {punto nervoso|np}, al limite tra terza e quarta vertebra cervicale e dell'{osso ioide|hyoid}. Da qui perforano la fascia cervicale superficiale e decorrono nel sottocutaneo. Il {grande auricolare|ga} risale lungo la faccia laterale del muscolo fino alla {parotide|parotid} e al {padiglione auricolare|auricle}; il {trasverso del collo|tc} la percorre trasversalmente e incrocia profondamente la {vena giugulare esterna|ejv}; i {nervi sopraclavicolari|scn} scendono verso la {clavicola|clav} e la spalla.",
    terms: {
      lo: ['lo'], scm: ['scm'], np: ['np'], hyoid: ['hyoid'], ga: ['ga'], parotid: ['parotid'], auricle: ['auricle'],
      tc: ['tc'], ejv: ['ejv'], scn: SCN, clav: ['clavicle'],
    },
    quiz: {
      question: 'Quale ramo cutaneo non emerge dal punto nervoso?',
      options: ['Il grande auricolare', 'Il trasverso del collo', 'Il piccolo occipitale', 'Il tronco sopraclavicolare'],
      correct: 2,
      explain: 'Emerge più in alto, al terzo superiore del margine posteriore dello sternocleidomastoideo.',
    },
    caption: 'Collo destro visto di lato. I nervi cutanei sono appoggiati alla superficie reale dello sternocleidomastoideo.',
    instruction: 'SCEGLI UN NERVO (ANCHE CLICCANDOLO) E RUOTA IL MODELLO',
    view: { yaw: -1.25 },
    mode: closeUp(0.55, -0.012, 0, 1.75, 0.0875, selector({
      base: [...CERV, ...HEAD, 'hyoid', 'larynx', 'clavicle', 'rib1', 'sternum', 'thoracic', 'scmG', 'scalA', 'scalM', 'levator', 'trapezius',
        'parotid', 'auricle', 'ejv', 'np', ...CUT],
      initial: 0,
      pick: { np: 0, lo: 1, ga: 2, tc: 3, sc: 4, scMed: 4, scInt: 4, scLat: 4 },
      idle: 'Viola: piccolo occipitale. Rosa: grande auricolare. Verde-azzurro: trasverso del collo. Arancio: sopraclavicolari.',
      options: [
        { label: 'Punto nervoso', lit: ['np', 'scm', ...CUT], show: ['scm'], labels: { np: 'punto nervoso' }, info: "A metà del margine posteriore dello sternocleidomastoideo: da qui emergono grande auricolare, trasverso del collo e sopraclavicolari." },
        { label: 'Piccolo occipitale', lit: ['lo'], show: ['scm'], info: "Dall'ansa media. Sale in alto e indietro verso la regione occipitale e si apre a ventaglio: rami mastoidei e rami posteriori per la regione nucale." },
        { label: 'Grande auricolare', lit: ['ga', 'parotid', 'auricle'], show: ['scm'], info: "Dall'ansa media. Innerva la cute che riveste la parotide e la cute posteriore del padiglione auricolare." },
        { label: 'Trasverso del collo', lit: ['tc', 'ejv'], show: ['scm', 'platysma'], info: "Dall'ansa media. Perfora il platisma e dà rami ascendenti e discendenti per la cute antero-laterale del collo, sopra e sotto l'osso ioide." },
        { label: 'Sopraclavicolari', lit: [...SCN, 'clavicle'], show: ['scm'], info: "Dall'ansa inferiore il tronco sopraclavicolare, di solito diviso in tre rami: mediale, intermedio e laterale, fino alla spina della scapola." },
        { label: 'Senza muscolo', lit: [...CUT, 'np', 'r2', 'r3', 'r4', 'a2', 'a3'], info: "Tolto lo sternocleidomastoideo si vede l'origine: tre nervi dall'ansa media, il tronco sopraclavicolare dall'ansa inferiore." },
      ],
    })),
  },
  {
    title: "Rami muscolari e ansa cervicale",
    body:
      "Tra i rami muscolari ci sono ramuscoli per i muscoli vicini. Nell'{ansa cervicale|ansa}, o ansa dell'ipoglosso, è coinvolto anche il {nervo ipoglosso|xii}: uscito dal cranio, si porta vicino al ramo anteriore di {C1|r1} e ne riceve {fibre|c1xii}, che poi se ne distaccano formando la {radice superiore|sup}. La {radice inferiore|inf} è formata da fibre dei rami anteriori di C2 e C3: unendosi alla superiore dà l'ansa, da cui si staccano {rami|rami} per i {muscoli sottoioidei|infra} e per il {genioioideo|genio}. Il plesso si anastomizza anche con il {nervo accessorio|xi}, per {sternocleidomastoideo|scm} e {trapezio|trap}.",
    terms: {
      ansa: ['ansa'], xii: ['hypoglossal'], r1: ['r1'], c1xii: ['c1xii'], sup: ['supRoot'], inf: ['infRoot'],
      rami: ['ansaRami', 'nThyro'], infra: INFRA, genio: ['geniohyoid', 'nGenio'], xi: ['accessory', 'xiRami'], scm: ['scm'], trap: ['trapezius'],
    },
    quiz: {
      question: "Da dove vengono le fibre della radice superiore dell'ansa cervicale?",
      options: ['Dal nucleo del nervo ipoglosso', 'Dal ramo anteriore di C1', 'Dai rami anteriori di C2 e C3', 'Dal nervo accessorio'],
      correct: 1,
      explain: "Sono fibre di C1 che viaggiano per un tratto con l'ipoglosso e poi se ne distaccano.",
    },
    caption: 'Ipoglosso, carotide, giugulare e muscoli sottoioidei sono mesh reali; le radici e l’ansa sono ricostruite su di essi.',
    instruction: "SEGUI LE FIBRE DI C1 FINO AI MUSCOLI SOTTOIOIDEI",
    view: { yaw: -0.6 },
    mode: closeUp(1.65, 0.075, 0, 4.2, 0.044, selector({
      base: [...CERV, ...HEAD_G, 'hyoid', 'larynx', ...RAMI, ...ANSE, 'hypoglossal', ...AC, ...INFRA, 'geniohyoid', 'carotid', 'ijv'],
      looks: { ijv: { opacity: 0.55 }, carotid: { opacity: 0.8 } },
      pick: { supRoot: 1, c1xii: 1, infRoot: 2, ansa: 3, ansaRami: 3, nGenio: 4, geniohyoid: 4, accessory: 5 },
      idle: "Verde chiaro: radice superiore. Verde scuro: radice inferiore. In mezzo l'ansa, sulla giugulare interna.",
      options: [
        {
          label: 'Segui C1', stepTime: 2.2,
          steps: [
            { ids: ['r1'], text: 'Ramo anteriore di C1' },
            { ids: ['c1xii'], text: "Fibre di C1 che raggiungono l'ipoglosso" },
            { ids: ['hypoglossal'], text: "Viaggiano con l'ipoglosso, che piega in avanti" },
            { ids: ['supRoot'], text: "Se ne distaccano: radice superiore dell'ansa" },
            { ids: ['ansa', 'infRoot'], text: "Si uniscono alla radice inferiore, da C2 e C3" },
            { ids: ['ansaRami', ...INFRA], text: 'Rami per i muscoli sottoioidei' },
          ],
        },
        { label: 'Radice superiore', lit: ['r1', 'c1xii', 'hypoglossal', 'supRoot', 'carotid'], info: "Fibre di C1 che lasciano l'ipoglosso e scendono davanti alla carotide." },
        { label: 'Radice inferiore', lit: ['r2', 'r3', 'a2', 'infRoot', 'ijv'], info: 'Fibre dei rami anteriori di C2 e C3: scende sul lato laterale della giugulare interna.' },
        { label: 'Sottoioidei', lit: ['ansa', 'ansaRami', 'nThyro', ...INFRA], info: "Dall'ansa si staccano i rami per sternoioideo, omoioideo e sternotiroideo; al tiroioideo arrivano fibre che proseguono con l'ipoglosso." },
        { label: 'Genioioideo', lit: ['hypoglossal', 'c1xii', 'nGenio', 'geniohyoid'], show: ['mandible'], info: "Anche il genioioideo riceve fibre del plesso: nel modello proseguono con l'ipoglosso fino al muscolo." },
        { label: 'Accessorio', lit: ['accessory', 'xiRami', 'scmG', 'trapezius'], show: ['accessory', 'xiRami', 'scmG', 'trapezius'], info: "All'accessorio le fibre extrafusali di sternocleidomastoideo e trapezio; al plesso cervicale l'innervazione propriocettiva delle fibre intrafusali." },
      ],
    })),
  },
  {
    title: 'Il nervo frenico',
    body:
      "Il {nervo frenico|ph}, misto, è considerato il ramo terminale del plesso. Origina per lo più dal {ramo anteriore di C4|r4}, con fibre da {C3 e C5|roots}. È il nervo satellite dello {scaleno anteriore|scalA}, di cui segue il margine anteriore, parallelo e laterale al {nervo vago|vagus}. Alla base del collo passa tra {arteria|subA} e {vena succlavia|subV}, nel {punto frenico|pp}, possibile punto di compressione, ed entra nel torace. A destra decorre lungo la {vena cava superiore|svc} e l'{atrio destro|atrium}, stacca {rami pericardici|peric} e pleurali e raggiunge il {diaframma|dia} all'orifizio della {vena cava inferiore|ivc}.",
    terms: {
      ph: ['phNeck', 'phPoint', 'phThorax'], r4: ['r4', 'phC4'], roots: ['phC3', 'phC5'], scalA: ['scalA'], vagus: ['vagus'],
      subA: ['subA'], subV: ['subV'], pp: ['phPoint'], svc: ['svc'], atrium: ['atrium'], peric: ['phPeric'], dia: ['diaR', 'phDia'], ivc: ['ivc'],
    },
    quiz: {
      question: 'Tra quali strutture passa il nervo frenico nel punto frenico?',
      options: ['Tra scaleno anteriore e scaleno medio', 'Tra arteria e vena succlavia', 'Tra carotide comune e giugulare interna', 'Tra clavicola e prima costa'],
      correct: 1,
      explain: "È la fessura sopraclavicolare che il nervo sfrutta per entrare in cavità toracica.",
    },
    caption: 'Il frenico destro, ricostruito su scaleno anteriore, vasi succlavi, cava superiore, atrio destro e diaframma reali.',
    instruction: 'SEGUI IL NERVO DAL COLLO AL DIAFRAMMA, POI TAGLIALO',
    view: { yaw: -0.5 },
    mode: closeUp(0.03, 0.024, 0, 1.6, 0.035, selector({
      base: [...CERV, ...THORAX, ...DIA, 'r3', 'r4', 'a3', 'brachial', 'scalA', 'subA', 'subV', 'svc', 'atrium', 'heart', 'ivc', ...PH],
      looks: { heart: { opacity: 0.55 }, diaL: { opacity: 0.6 }, sternum: { opacity: 0.35 } },
      pick: { phC3: 1, phC4: 1, phC5: 1, phNeck: 2, scalA: 2, phPoint: 3, phThorax: 4, phDia: 5, diaR: 5 },
      idle: 'Oro: nervo frenico destro, dal collo al diaframma.',
      options: [
        {
          label: 'Segui il frenico', stepTime: 2.4,
          steps: [
            { ids: ['r4', ...PH_ROOTS], text: 'Origine: soprattutto C4, con fibre da C3 e C5' },
            { ids: ['phNeck', 'scalA'], text: 'Sulla faccia anteriore dello scaleno anteriore' },
            { ids: ['phPoint', 'subA', 'subV'], text: 'Punto frenico: tra arteria e vena succlavia' },
            { ids: ['phThorax', 'svc', 'atrium'], text: 'Lungo vena cava superiore e atrio destro' },
            { ids: ['phDia', 'diaR', 'ivc'], text: 'Diaframma, attraverso l’orifizio della vena cava inferiore' },
          ],
        },
        { label: 'Radici', lit: ['r3', 'r4', ...PH_ROOTS, 'brachial'], info: 'Nella maggior parte dei casi dal ramo anteriore di C4; partecipano in varia misura fibre di C3 e di C5.' },
        { label: 'Scaleno anteriore', lit: ['phNeck', 'scalA', 'vagus'], show: ['vagus', 'carotid', 'ijv'], info: 'Accompagna il fascio vascolo-nervoso del collo, parallelo e laterale al vago, sullo scaleno anteriore.' },
        { label: 'Punto frenico', lit: ['phPoint', 'subA', 'subV', 'rib1'], info: "All'inserzione dello scaleno anteriore sulla prima costa passa tra arteria e vena succlavia ed entra in torace." },
        { label: 'Mediastino', lit: ['phThorax', 'phPeric', 'svc', 'atrium'], info: "Tra pericardio e pleura mediastinica: vena anonima destra, cava superiore, atrio destro. Il ramo pericardico destro è il più voluminoso." },
        { label: 'Diaframma', lit: ['phDia', 'diaR', 'ivc'], info: "Attraversa il diaframma all'orifizio della cava inferiore: rami muscolari per le due facce, rami sensitivi per pleura e peritoneo." },
        { label: 'Taglia il frenico', dead: [...PH, 'diaR'], info: "Interrotto il nervo, l'emidiaframma dello stesso lato perde la sua innervazione motoria." },
      ],
    })),
  },
];

export default {
  id: 'plesso-cervicale',
  title: 'Plesso cervicale',
  blurb: 'Rami anteriori da C1 a C4, anse, rami cutanei, ansa cervicale e nervo frenico.',
  part: 'Midollo e nervi spinali',
  order: 12,
  model: 'plesso-cervicale',
  createModel: () => new PlessoCervicale(),
  zoom: 1,
  yaw: -0.6,
  spreads,
};
