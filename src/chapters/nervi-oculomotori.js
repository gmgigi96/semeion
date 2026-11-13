// Capitolo "Nervi oculomotore, trocleare e abducente". Testi ricavati dagli
// appunti di neuroanatomia (Nervi abducente, trocleare e oculomotore).
// Le azioni dei singoli muscoli (pagina 4) e la posizione dell'occhio nelle
// paralisi (pagina 5) non sono negli appunti: vedi le fonti in testa a
// src/models/nervi-oculomotori.js.
import { selector, chipsInto, infoText, picked } from '../modes.js';
import { OculomotorModel } from '../models/nervi-oculomotori.js';

const lr = (...ids) => ids.flatMap((id) => [`${id}R`, `${id}L`]);
const right = (...ids) => ids.map((id) => `${id}R`);

const STEM = ['midbrain', 'pons', 'medulla', 'scoll', 'icoll'];
const EYES = lr('sclera', 'cornea', 'iris', 'pupil');
const MUSCLES = lr('rs', 'ri', 'rm', 'rl', 'os', 'oi', 'lev');
const ORBIT = [...EYES, ...MUSCLES, ...lr('optic', 'trochlea', 'zinn')];
const NUCLEI = lr('nuc3', 'ew', 'nuc4', 'nuc6');
const N3 = ['f3', 'n3', 'n3sup', 'n3inf'];
const N4 = ['f4', 'n4c', 'n4'];
const N6 = ['f6', 'n6', 'n6o'];
const NERVES = lr(...N3, ...N4, ...N6);
const III_MUSCLES = ['rs', 'rm', 'ri', 'oi', 'lev'];

// Come `selector` (opzioni statiche), ma ogni opzione può anche ruotare gli
// occhi: gaze: { R: { abd, elev, intor }, L: { … } } in gradi.

// il bulbo non si attenua mai: deve restare leggibile mentre ruota
const KEEP = new Set(lr('sclera', 'cornea', 'iris', 'pupil', 'mark'));

// l'elevatore copre il bulbo dall'alto: nelle pagine sull'occhio è in trasparenza
const LEV_GLASS = { levR: { opacity: 0.3 }, levL: { opacity: 0.3 } };

function gazeSelector({ base, options, looks = {}, pick = {}, idle = '' }) {
  return async ({ model, controls }) => {
    let sel = null;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i ? null : i) }))
    );
    const info = await infoText(controls, -height - 0.03);
    const select = (i) => {
      sel = i;
      const o = options[i];
      chips.forEach((c, j) => c.setActive(j === i));
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? [])]);
      model.setGaze('R', o?.gaze?.R);
      model.setGaze('L', o?.gaze?.L);
      info.text = o?.info ?? idle;
    };
    return {
      // la previsione verificata sul modello vale come aver provato quell'opzione
      choose: (i) => (picked(controls, options[i]?.label), select(i)),
      enter() {
        select(null);
        // scegliere toccando il modello vale come provare il pulsante
        model.onClick = (id) => id in pick && (picked(controls, options[pick[id]]?.label), select(pick[id]));
        model.lookFn = (part) => {
          const o = options[sel];
          const look = { ...looks[part.id] };
          if (!o) return look;
          if (o.dead?.includes(part.id)) return { ...look, dead: true };
          if (o.scale?.[part.id]) look.scale = o.scale[part.id];
          if (!o.lit || KEEP.has(part.id)) return look;
          return o.lit.includes(part.id) ? { ...look, glow: 0.3, opacity: 1 } : { ...look, dim: true };
        };
      },
    };
  };
}

const muscle = (id, label, nerve, info, gaze) => ({ label, lit: right(id, ...nerve), info, gaze: { R: gaze } });

const spreads = [
  {
    title: 'Tre nervi per sei muscoli',
    body:
      "I muscoli che muovono l'occhio ricevono tre nervi cranici. Il {nervo oculomotore|n3} (III) ha due componenti: una motoria somatica, per i muscoli {retto superiore|rs}, {retto mediale|rm}, {retto inferiore|ri}, {obliquo inferiore|oi} ed {elevatore della palpebra superiore|lev}, e una viscerale parasimpatica, per i muscoli sfintere della pupilla e ciliare. Il {nervo trocleare|n4} (IV) e il {nervo abducente|n6} (VI) sono soltanto motori: il primo si distribuisce al muscolo {obliquo superiore|os}, il secondo al muscolo {retto laterale|rl}.",
    terms: {
      n3: lr(...N3), n4: lr(...N4), n6: lr(...N6),
      rs: lr('rs'), rm: lr('rm'), ri: lr('ri'), oi: lr('oi'), lev: lr('lev'), os: lr('os'), rl: lr('rl'),
    },
    quiz: {
      question: 'Indica il muscolo innervato dal nervo trocleare.',
      point: lr('os'),
      why: {
        ...Object.fromEntries(lr('rl').map((id) => [id, "Il retto laterale spetta all'abducente."])),
        ...Object.fromEntries(lr('rs', 'rm', 'ri', 'oi', 'lev').map((id) => [id, "Questo spetta all'oculomotore."])),
      },
      explain: "Il retto laterale spetta all'abducente, tutti gli altri all'oculomotore.",
    },
    caption: 'Orbite, muscoli e tronco encefalico reali (BodyParts3D); nuclei e tratto intracranico dei nervi ricostruiti.',
    instruction: 'SCEGLI UN NERVO E GUARDA QUALI MUSCOLI RAGGIUNGE',
    mode: selector({
      base: [...STEM, 'sphenoid', ...ORBIT, ...NUCLEI, ...NERVES],
      idle: 'Giallo: oculomotore. Verde: trocleare. Blu: abducente.',
      options: [
        { label: 'Oculomotore (III)', lit: lr(...N3, 'nuc3', 'ew', ...III_MUSCLES), info: "Retti superiore, mediale e inferiore, obliquo inferiore, elevatore della palpebra; in più le fibre parasimpatiche." },
        { label: 'Trocleare (IV)', lit: lr(...N4, 'nuc4', 'os'), info: 'Soltanto motorio: muscolo obliquo superiore.' },
        { label: 'Abducente (VI)', lit: lr(...N6, 'nuc6', 'rl'), info: 'Soltanto motorio: muscolo retto laterale.' },
      ],
    }),
  },
  {
    title: 'Nuclei e origine apparente',
    body:
      "Il {nucleo motorio somatico|nuc3} dell'oculomotore, diviso in cinque subnuclei, e il {nucleo di Edinger-Westphal|ew} stanno nel {mesencefalo|mid}; il nervo emerge nella {fossetta interpeduncolare|n3}, in una forcella tra {arteria cerebrale posteriore|pca} e {cerebellare superiore|sca}. Il {nucleo del trocleare|nuc4} è all'altezza del {collicolo inferiore|icoll}, ventralmente all'{acquedotto di Silvio|aq}: le sue fibre {decussano|f4} ed emergono dorsalmente, subito sotto i collicoli inferiori. Il {nucleo dell'abducente|nuc6}, nel {ponte|pons} inferiore, forma il rilievo detto collicolo del faciale; il nervo emerge dal {solco bulbo-pontino|n6}.",
    terms: {
      nuc3: lr('nuc3'), ew: lr('ew'), mid: ['midbrain'], n3: lr('f3', 'n3'), pca: ['pca'], sca: ['sca'],
      nuc4: lr('nuc4'), icoll: ['icoll'], aq: ['aqueduct'], f4: lr('f4'), nuc6: lr('nuc6'), pons: ['pons'], n6: lr('f6', 'n6'),
    },
    quiz: {
      question: 'Quale di questi nervi emerge dalla faccia dorsale del tronco encefalico?',
      options: ["L'oculomotore", 'Il trocleare', "L'abducente", 'Nessuno dei tre'],
      correct: 1,
      explain: 'Emerge subito sotto i collicoli inferiori, dopo che le sue fibre hanno decussato.',
    },
    caption: 'Il tronco encefalico in trasparenza, visto da dietro e di lato, con i nuclei al suo interno.',
    instruction: "SCEGLI UN NERVO: DAL NUCLEO ALL'EMERGENZA",
    // il tronco encefalico (dietro le orbite) viene sopra il centro della base
    view: { yaw: 2.55, zoom: 1, focus: { at: [0, 0.34, -0.25], scale: 1.4, height: 0.28 } },
    mode: selector({
      looks: { scoll: { opacity: 0.45 }, icoll: { opacity: 0.45 } },
      base: [...STEM, 'aqueduct', 'basilar', 'pca', 'sca', ...NUCLEI, ...lr('f3', 'n3', 'f4', 'n4c', 'n4', 'f6', 'n6')],
      idle: "Nuclei e fibre sono dentro il tronco; i nervi ne escono in tre punti diversi.",
      options: [
        { label: 'Oculomotore (III)', lit: [...lr('nuc3', 'ew', 'f3', 'n3'), 'pca', 'sca'], info: 'Dal mesencefalo alla fossetta interpeduncolare, tra arteria cerebrale posteriore (sopra) e cerebellare superiore (sotto).' },
        { label: 'Trocleare (IV)', lit: ['nuc4L', 'f4R', 'n4cR', 'n4R', 'icoll', 'aqueduct'], info: 'Dal nucleo di sinistra al nervo di destra: le fibre decussano ed emergono sotto il collicolo inferiore.' },
        { label: 'Abducente (VI)', lit: lr('nuc6', 'f6', 'n6'), info: 'Dal ponte inferiore al solco bulbo-pontino, subito sopra le piramidi bulbari.' },
      ],
    }),
  },
  {
    title: "Dal seno cavernoso all'orbita",
    body:
      "L'{oculomotore|n3} si porta in avanti nella porzione superiore della parete laterale del {seno cavernoso|cav}. Il {trocleare|n4} decorre nella stessa parete, subito al di sotto, poi lo incrocia superiormente. L'{abducente|n6} percorre il seno subito al di sotto dell'{arteria carotide interna|ica}. Tutti raggiungono l'orbita dalla fessura orbitaria superiore dello {sfenoide|sph}: i due rami dell'oculomotore, {superiore|sup} e {inferiore|inf}, e l'abducente attraversano l'{anello tendineo dello Zinn|zinn}; il trocleare passa nella porzione extratendinea.",
    terms: {
      n3: lr('n3'), cav: lr('cav'), n4: lr('n4c', 'n4'), n6: lr('n6', 'n6o'), ica: ['ica'], sph: ['sphenoid'],
      sup: lr('n3sup'), inf: lr('n3inf'), zinn: lr('zinn'),
    },
    quiz: {
      question: "Quale nervo entra nell'orbita fuori dall'anello tendineo dello Zinn?",
      options: ["Il ramo superiore dell'oculomotore", "Il ramo inferiore dell'oculomotore", 'Il trocleare', "L'abducente"],
      correct: 2,
      explain: 'Attraversa la fessura orbitaria superiore nella sua porzione extratendinea.',
    },
    caption: 'Il nervo di destra, tappa per tappa, dal nucleo al muscolo.',
    instruction: 'FAI PARTIRE UN NERVO E SEGUILO FINO AL MUSCOLO',
    view: { yaw: 0.95, zoom: 1.3 },
    mode: selector({
      base: [...STEM, 'sphenoid', 'ica', ...lr('cav'), ...ORBIT, ...NUCLEI, ...NERVES],
      looks: { cavR: { opacity: 0.12 }, cavL: { opacity: 0.12 } },
      idle: 'In blu trasparente il seno cavernoso, ai lati del corpo dello sfenoide.',
      options: [
        {
          label: 'Segui il III',
          stepTime: 2,
          steps: [
            { ids: ['nuc3R', 'ewR'], text: 'Nuclei nel mesencefalo' },
            { ids: ['f3R', 'n3R'], text: 'Fossetta interpeduncolare, poi in avanti' },
            { ids: ['cavR'], text: 'Parete laterale del seno cavernoso, in alto' },
            { ids: ['zinnR', 'n3supR', 'n3infR'], text: "Fessura orbitaria superiore: due rami nell'anello dello Zinn" },
            { ids: ['rsR', 'levR'], text: 'Ramo superiore: retto superiore ed elevatore' },
            { ids: ['rmR', 'riR', 'oiR'], text: 'Ramo inferiore: retti mediale e inferiore, obliquo inferiore' },
          ],
        },
        {
          label: 'Segui il IV',
          stepTime: 2,
          steps: [
            { ids: ['nuc4L'], text: 'Nucleo del lato opposto' },
            { ids: ['f4R'], text: 'Le fibre decussano ed emergono dorsalmente' },
            { ids: ['n4cR'], text: 'Lateralmente, in basso e in avanti' },
            { ids: ['cavR'], text: "Parete laterale del seno cavernoso, sotto l'oculomotore" },
            { ids: ['n4R'], text: "Fessura orbitaria superiore, fuori dall'anello dello Zinn" },
            { ids: ['osR'], text: 'Muscolo obliquo superiore' },
          ],
        },
        {
          label: 'Segui il VI',
          stepTime: 2,
          steps: [
            { ids: ['nuc6R'], text: 'Nucleo nel ponte inferiore' },
            { ids: ['f6R'], text: 'Emerge dal solco bulbo-pontino' },
            { ids: ['n6R'], text: 'In avanti e lateralmente' },
            { ids: ['cavR', 'ica'], text: 'Seno cavernoso, sotto la carotide interna' },
            { ids: ['zinnR', 'n6oR'], text: "Fessura orbitaria superiore, nell'anello dello Zinn" },
            { ids: ['rlR'], text: 'Muscolo retto laterale' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Chi muove che cosa',
    body:
      "Nella fessura orbitaria superiore l'oculomotore si divide in due rami. Il {ramo superiore|sup}, più piccolo, si dirige in alto e innerva i muscoli {retto superiore|rs} ed {elevatore della palpebra superiore|lev}. Il {ramo inferiore|inf}, più grande, si dirige in basso e innerva i muscoli {retto mediale|rm}, {retto inferiore|ri} e {obliquo inferiore|oi}. Il {trocleare|n4} si distribuisce all'{obliquo superiore|os}, il cui tendine si riflette nella {troclea|tro}; l'{abducente|n6} raggiunge il {retto laterale|rl}.",
    terms: {
      sup: lr('n3sup'), inf: lr('n3inf'), rs: lr('rs'), lev: lr('lev'), rm: lr('rm'), ri: lr('ri'), oi: lr('oi'),
      n4: lr('n4'), os: lr('os'), tro: lr('trochlea'), n6: lr('n6o'), rl: lr('rl'),
    },
    quiz: {
      question: "Quale muscolo NON riceve il ramo inferiore dell'oculomotore?",
      options: ['Il retto mediale', 'Il retto inferiore', "L'obliquo inferiore", 'Il retto superiore'],
      correct: 3,
      explain: "Il retto superiore riceve il ramo superiore, insieme all'elevatore della palpebra.",
    },
    caption: "Vista da davanti: si muove l'occhio destro (a sinistra per chi guarda); il segno rosso è alle ore 12.",
    instruction: "SCEGLI UN MUSCOLO DELL'OCCHIO DESTRO E GUARDA COME LO RUOTA",
    view: { yaw: 0, zoom: 1.5 },
    mode: gazeSelector({
      base: ['sphenoid', ...ORBIT, ...lr('mark', 'n3sup', 'n3inf', 'n4', 'n6o', 'cg', 'scn')],
      looks: LEV_GLASS,
      idle: 'Occhi in posizione primaria. Il nervo che comanda il muscolo scelto si accende con lui.',
      pick: { rsR: 0, riR: 1, rmR: 2, rlR: 3, osR: 4, oiR: 5 },
      options: [
        muscle('rs', 'Retto superiore', ['n3sup'], 'Ramo superiore del III. Eleva; in più intorsione e adduzione.', { elev: 24, intor: 9, abd: -6 }),
        muscle('ri', 'Retto inferiore', ['n3inf'], 'Ramo inferiore del III. Abbassa; in più estorsione e adduzione.', { elev: -24, intor: -9, abd: -6 }),
        muscle('rm', 'Retto mediale', ['n3inf'], 'Ramo inferiore del III. Adduce: porta la cornea verso il naso.', { abd: -30 }),
        muscle('rl', 'Retto laterale', ['n6o'], 'Nervo abducente (VI). Abduce: porta la cornea verso la tempia.', { abd: 30 }),
        muscle('os', 'Obliquo superiore', ['n4', 'trochlea'], 'Nervo trocleare (IV). Intorsione; in più abbassa e abduce.', { intor: 18, elev: -13, abd: 8 }),
        muscle('oi', 'Obliquo inferiore', ['n3inf'], 'Ramo inferiore del III. Estorsione; in più eleva e abduce.', { intor: -18, elev: 13, abd: 8 }),
      ],
    }),
  },
  {
    title: 'Se un nervo si interrompe',
    body:
      "Il ramo inferiore dell'oculomotore è il più grande perché porta anche la componente parasimpatica: ne nasce la radice breve del {ganglio ciliare|cg}, dove le fibre presinaptiche del {nucleo di Edinger-Westphal|ew} contraggono sinapsi; le fibre postgangliari raggiungono con i {nervi ciliari brevi|scn} i muscoli sfintere della {pupilla|pupil} e ciliare. Una lesione dell'{oculomotore|n3} toglie quindi all'occhio quasi tutti i muscoli e la costrizione della pupilla; al {trocleare|n4} e all'{abducente|n6} corrisponde un solo muscolo ciascuno: l'{obliquo superiore|os} e il {retto laterale|rl}.",
    terms: {
      cg: lr('cg'), ew: lr('ew'), scn: lr('scn'), pupil: lr('pupil'), n3: lr(...N3), n4: lr(...N4), n6: lr(...N6),
      os: lr('os'), rl: lr('rl'),
    },
    quiz: {
      predict: true,
      question: "Si interrompe l'abducente di destra. Dove devierà l'occhio destro?",
      options: ['In fuori e in basso', 'Verso il naso', "Un po' più in alto", 'Non devia'],
      correct: 1,
      why: [
        "In fuori e in basso va con la lesione dell'oculomotore.",
        null,
        "Più in alto ed extraruotato va con la lesione del trocleare.",
        'Senza il retto laterale prevale il retto mediale.',
      ],
      explain: "Manca il retto laterale: prevale il retto mediale e l'occhio devia verso il naso; diplopia orizzontale.",
      reveal: 2,
    },
    caption: "Nervo e muscoli paralizzati si scuriscono; l'occhio destro prende la posizione imposta dai muscoli rimasti.",
    instruction: 'INTERROMPI UN NERVO DI DESTRA E CONFRONTA I DUE OCCHI',
    view: { yaw: 0, zoom: 1.5 },
    mode: gazeSelector({
      base: ['sphenoid', ...ORBIT, ...lr('mark', 'n3', 'n3sup', 'n3inf', 'n4', 'n6', 'n6o', 'cg', 'scn')],
      looks: LEV_GLASS,
      idle: 'Nessuna lesione: i due occhi guardano dritto e le pupille sono uguali.',
      options: [
        {
          label: 'Oculomotore (III)',
          dead: right('n3', 'n3sup', 'n3inf', 'cg', 'scn', ...III_MUSCLES),
          gaze: { R: { abd: 24, elev: -9, intor: 6 } },
          scale: { pupilR: 1.9 },
          info: 'Restano retto laterale e obliquo superiore: occhio in fuori e in basso, palpebra cadente (ptosi), pupilla dilatata.',
        },
        {
          label: 'Trocleare (IV)',
          dead: right('n4', 'os'),
          gaze: { R: { elev: 8, intor: -10 } },
          info: "Manca l'obliquo superiore: occhio un po' più alto ed extraruotato; diplopia verticale, peggiore guardando in basso.",
        },
        {
          label: 'Abducente (VI)',
          dead: right('n6', 'n6o', 'rl'),
          gaze: { R: { abd: -22 } },
          info: "Manca il retto laterale: prevale il retto mediale e l'occhio devia verso il naso; diplopia orizzontale.",
        },
      ],
    }),
  },
];

export default {
  id: 'nervi-oculomotori',
  title: 'Nervi oculomotore, trocleare e abducente',
  blurb: "Tre nervi per i muscoli dell'occhio: nuclei, decorso, muscoli e paralisi.",
  part: 'Nervi cranici',
  order: 40,
  model: 'nervi-oculomotori',
  createModel: () => new OculomotorModel(),
  yaw: 0.6,
  zoom: 1.3,
  spreads,
};
