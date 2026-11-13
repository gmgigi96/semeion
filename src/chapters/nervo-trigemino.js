// Capitolo "Nervo trigemino". Testi ricavati dagli appunti di neuroanatomia
// (8. Nervo trigemino). Non sono negli appunti: l'effetto della lesione del
// nervo mandibolare (pagina 5), dedotto dal fatto che è l'unica branca mista, e
// i confini disegnati tra i territori cutanei (pagina 4): vedi le fonti in testa
// a src/models/nervo-trigemino.js. A pagina 4 la risposta a un punto toccato è il
// territorio del modello in cui cade: le parole che la spiegano (i nervi e le
// regioni di ciascuna branca) sono degli appunti, il confine esatto è stimato.
import * as THREE from 'three';
import { selector, chipsInto, infoText, explore } from '../modes.js';
import { TrigeminalModel } from '../models/nervo-trigemino.js';

const STEM = ['midbrain', 'pons', 'medulla', 'cord'];
const BONES = ['skull', 'sphenoid', 'mandible', 'teeth'];
const EYES = ['eyes', 'iris', 'cornea'];
const NUCLEI = ['nucMot', 'nucPr', 'nucMes', 'spOr', 'spInt', 'spCau'];
const SPINAL = ['spOr', 'spInt', 'spCau'];
const ROOTS = ['fSens', 'fMot', 'vroot', 'motor', 'gasser'];
const V1 = ['v1', 'lacn', 'nasocil'];
const V2 = ['v2', 'zyg', 'alvsup', 'ppg', 'palat'];
const V3S = ['v3trunk', 'v3post', 'atn', 'buccal', 'lingual', 'ian', 'mental']; // rami sensitivi
const V3M = ['v3ant', 'massn', 'tempn', 'ptn', 'mylon']; // rami in prevalenza motori
const V3 = [...V3S, ...V3M, 'otic'];
const MAST = ['temporalis', 'masseter', 'ptmed', 'ptlat'];
const MUSCLES = [...MAST, 'mylohyoid', 'digastric'];
const SKIN = ['skin1', 'skin2', 'skin3', 'skinRest'];

// i muscoli superficiali coprono i nervi: in trasparenza finché non sono accesi
const GLASS = { opacity: 0.22, litOpacity: 0.9 };
const MUSCLE_GLASS = { temporalis: GLASS, masseter: GLASS, ptlat: { opacity: 0.4, litOpacity: 0.9 }, ptmed: { opacity: 0.5, litOpacity: 0.9 } };

// «Di chi è questo punto?»: si tocca un punto della cute (metà sinistra del volto), poi
// si sceglie con un pulsante la branca che lo porta; il territorio vero si accende e
// un piccolo conto tiene le risposte giuste. Senza un punto in sospeso i pulsanti fanno
// ciò che fanno in `selector`: mostrano la branca e il suo territorio. La cute resta di
// un solo colore finché non si risponde (o non si sceglie una branca): i territori
// non si vedono prima.
//   options  come in `selector` (lit, info), una per branca, nell'ordine di SKIN
//   skin     id delle parti di cute dei territori, nell'ordine delle opzioni
//   rest     id della cute che non appartiene a nessuna branca
const NEUTRAL = 0xe6cdb8;
const OF = ["dell'oftalmica", 'della mascellare', 'della mandibolare'];
const THE = ["l'oftalmica", 'la mascellare', 'la mandibolare'];
const DONE = 0x2a2520; // spillo di un punto già risolto
function faceMode({ base, options, skin, rest, pick = {}, idle = '' }) {
  return async ({ model, controls }) => {
    const ex = explore(controls);
    const finds = OF.map((o) => `Un punto ${o}`);
    for (const f of finds) ex.offer(f);
    let sel = null; // branca mostrata con il pulsante
    let pending = null; // { at, normal, truth, pin }: punto toccato, in attesa della risposta
    let shown = null; // branca il cui territorio si è appena scoperto
    let tries = [];
    const { chips, height } = await chipsInto(controls, options.map((o, i) => ({ label: o.label, onClick: () => press(i) })));
    const info = await infoText(controls, -height - 0.03);
    const score = () => (tries.length ? ` Giuste ${tries.filter((t) => t.ok).length} su ${tries.length}.` : '');
    const show = (i) => {
      sel = i;
      shown = null;
      chips.forEach((c, j) => c.setActive(j === i));
      model.show([...base, ...(options[i]?.lit ?? [])]);
      info.text = (options[i]?.info ?? idle) + (i == null ? score() : '');
    };
    const press = (i) => {
      if (!pending) return show(sel === i ? null : i);
      // la risposta: il territorio vero si accende
      const { truth, pin } = pending;
      const ok = i === truth;
      tries.push({ at: pending.at, ok });
      pending = null;
      sel = null;
      shown = truth;
      chips.forEach((c, j) => c.setActive(j === truth));
      pin.material.color.set(DONE);
      pin.material.emissive.set(DONE);
      pin.scale.setScalar(0.7);
      if (ok) ex.found(finds[truth]);
      info.text = `${ok ? `Sì, ${THE[truth]}.` : `No: non ${THE[i]}, ${THE[truth]}.`} ${options[truth].info}${score()}`;
    };
    return {
      enter() {
        tries = [];
        pending = null;
        show(null);
        model.maskSkin(true);
        model.onClick = (id, hit) => {
          const k = skin.indexOf(id);
          if (k < 0 && id !== rest) {
            // i nervi sul cranio: come i pulsanti
            if (id in pick && !pending) {
              ex.found(options[pick[id]].label);
              show(pick[id]);
            }
            return;
          }
          if (!hit?.point) return;
          const at = model.inner.worldToLocal(hit.point.clone());
          if (k < 0) {
            info.text = `Qui la cute non è del trigemino: nessuna delle tre branche. Tocca un altro punto del viso.${score()}`;
            return;
          }
          if (tries.some((t) => t.at.distanceTo(at) < 0.03)) {
            info.text = `Qui hai già toccato: prova un punto diverso del viso.${score()}`;
            return;
          }
          // la normale della faccia colpita, per posare lo spillo sulla cute
          const normal = hit.face?.normal?.clone() ?? new THREE.Vector3(0, 0, 1);
          if (pending) {
            model.pins.remove(pending.pin);
            pending.pin.geometry.dispose();
            pending.pin.material.dispose();
          }
          pending = { at, truth: k, pin: model.pin(at, normal) };
          sel = null;
          shown = null;
          chips.forEach((c) => c.setActive(false));
          model.show(base);
          info.text = `Quale branca porta la sensibilità di questo punto? Scegli un pulsante.${score()}`;
        };
        model.lookFn = (part) => {
          const k = skin.indexOf(part.id);
          const lit = shown != null ? options[shown].lit : sel != null && !pending ? options[sel].lit : null;
          // la cute: di un solo colore, salvo il territorio scoperto o mostrato
          if (k >= 0 || part.id === rest) {
            if (lit?.includes(part.id)) return { glow: 0.25 };
            return { color: NEUTRAL };
          }
          if (!lit) return {};
          return lit.includes(part.id) ? { glow: 0.3 } : { dim: true };
        };
      },
    };
  };
}

const spreads = [
  {
    title: 'Il più voluminoso dei nervi encefalici',
    body:
      "Il trigemino è un nervo misto. La componente {sensitiva somatica|sens}, nettamente prevalente, raccoglie la sensibilità della cute della faccia e del cuoio capelluto fino al vertice, delle mucose di naso, seni paranasali e bocca, del {bulbo oculare|eyes}, del parodonto e delle meningi, con le tre branche {oftalmica|v1}, {mascellare|v2} e {mandibolare|v3}. La componente {motoria somatica speciale|mot}, più esigua, va ai muscoli derivati dal primo arco branchiale: i {muscoli masticatori|mast}, il {miloioideo|mylo}, il {ventre anteriore del digastrico|dig}, il tensore del velo palatino e il tensore del timpano.",
    terms: {
      sens: ['gasser', 'vroot'], eyes: ['eyes'], v1: V1, v2: V2, v3: V3S,
      mot: ['nucMot', 'fMot', 'motor'], mast: MAST, mylo: ['mylohyoid'], dig: ['digastric'],
    },
    quiz: {
      question: 'Quale di questi muscoli NON è innervato dal trigemino?',
      options: ['Il massetere', 'Il ventre anteriore del digastrico', 'Il ventre posteriore del digastrico', 'Il tensore del timpano'],
      correct: 2,
      explain: 'Dal primo arco branchiale derivano i masticatori, il miloioideo, il ventre anteriore del digastrico e i due tensori.',
    },
    caption: 'Ossa, muscoli e nervi reali (Z-Anatomy), lato destro; nuclei, radici e ganglio ricostruiti.',
    instruction: 'SCEGLI UNA COMPONENTE DEL NERVO',
    mode: selector({
      base: [...STEM, ...BONES, ...EYES, 'nucMot', 'nucPr', ...ROOTS, ...V1, ...V2, ...V3, ...MUSCLES],
      looks: MUSCLE_GLASS,
      idle: 'Giallo: oftalmica. Verde: mascellare. Blu: mandibolare. Rosso: fibre motorie.',
      options: [
        {
          label: 'Componente sensitiva',
          lit: ['nucPr', 'fSens', 'vroot', 'gasser', ...V1, ...V2, ...V3S, 'skin1', 'skin2', 'skin3'],
          show: SKIN,
          info: 'Dal ganglio di Gasser tre branche; a sinistra, sulla cute, i loro tre territori.',
        },
        {
          label: 'Componente motoria',
          lit: ['nucMot', 'fMot', 'motor', 'v3trunk', ...V3M, ...MUSCLES],
          info: 'Dal nucleo masticatorio, con la sola branca mandibolare, ai muscoli del primo arco branchiale.',
        },
      ],
    }),
  },
  {
    title: 'Un nucleo motore, un lungo nucleo sensitivo',
    body:
      "Il {nucleo motore|mot}, o masticatorio, è a livello ponto-mesencefalico. Il nucleo sensitivo si estende per tutto il tronco encefalico, fino ai primi 3-4 neuromeri cervicali. Il {nucleo mesencefalico|mes}, il più craniale, è formato da neuroni migrati dal ganglio: riceve la sensibilità propriocettiva dei muscoli masticatori, dell'ATM e del parodonto. Il {nucleo principale|pr}, nel {ponte|pons}, riceve impulsi tattili e pressori discriminativi. Il {nucleo del tratto spinale|sp} ha tre porzioni: {pars oralis|or}, {pars interpolaris|int}, a livello bulbo-pontino, per il dolore dei denti, e {pars caudalis|cau}, per la sensibilità dolorifica e tattile poco discriminativa.",
    terms: {
      mot: ['nucMot'], mes: ['nucMes'], pr: ['nucPr'], pons: ['pons'], sp: SPINAL,
      or: ['spOr'], int: ['spInt'], cau: ['spCau'],
    },
    quiz: {
      question: 'Quale nucleo NON riceve le proiezioni centrali del ganglio di Gasser?',
      options: ['Il nucleo principale', 'Il nucleo mesencefalico', 'La pars caudalis del nucleo spinale', 'La pars interpolaris del nucleo spinale'],
      correct: 1,
      explain: 'I suoi neuroni sono migrati dal ganglio nel mesencefalo: le loro fibre attraversano il ganglio senza sinapsi.',
    },
    caption: 'Tronco encefalico reale in trasparenza, visto da dietro e da destra; nuclei ricostruiti al suo interno.',
    instruction: 'SCEGLI UN NUCLEO',
    view: { yaw: -2.55, zoom: 1, focus: { at: [0, 0.32, -0.225], scale: 1.5, height: 0.35 } },
    mode: selector({
      base: [...STEM, 'thalamus', ...NUCLEI, 'fSens', 'fMot', 'vroot', 'motor'],
      idle: 'Dal mesencefalo al midollo cervicale: quattro nuclei per un solo nervo.',
      pick: { nucMot: 0, nucMes: 1, nucPr: 2, spOr: 3, spInt: 3, spCau: 3 },
      options: [
        { label: 'Motore', lit: ['nucMot', 'fMot', 'motor'], info: 'Nucleo masticatorio: le sue fibre formano la radice motoria.' },
        {
          label: 'Mesencefalico', lit: ['nucMes', 'nucMot'], links: ['mesMot'],
          info: 'Propriocezione di muscoli masticatori, ATM e parodonto; proietta al nucleo masticatorio.',
        },
        { label: 'Principale', lit: ['nucPr', 'fSens', 'vroot'], info: 'Tatto e pressione discriminativi, come nel sistema dei cordoni posteriori.' },
        {
          label: 'Spinale', lit: [...SPINAL, 'fSens', 'vroot'],
          labels: { spOr: 'oralis', spInt: 'interpolaris', spCau: 'caudalis' },
          info: 'Oralis, interpolaris (dolore dei denti), caudalis (dolore, tatto poco discriminativo): fino al midollo cervicale.',
        },
        {
          label: 'Verso il talamo', lit: ['nucPr', ...SPINAL, 'vpm', 'thalamus'], show: ['vpm'], links: ['ttv', 'tts', 'ttd'],
          info: 'Verde: lemnisco trigeminale, crociato, al nucleo VPM. Blu: fascio trigemino-talamico dorsale, ipsilaterale.',
        },
      ],
    }),
  },
  {
    title: 'Dal ponte al ganglio di Gasser',
    body:
      "Le due radici, {sensitiva|vroot} e {motoria|motor}, emergono distinte dalla porzione laterale del {ponte|pons} e raggiungono la fossa cranica media. Qui, sulla faccia anteriore della piramide del temporale, il {ganglio semilunare del Gasser|gasser} è accolto nel cavo di Meckel, uno sdoppiamento della dura madre. Dal suo margine convesso antero-inferiore originano le tre branche, che escono dalla base cranica: l'{oftalmica|v1} dalla {fessura orbitaria superiore|sof}, la {mascellare|v2} dal {foro rotondo|frot}, la {mandibolare|v3} dal {foro ovale|foval}. La radice motoria non si interrompe nel ganglio: vi passa inferiormente e confluisce nella branca mandibolare.",
    terms: {
      vroot: ['vroot', 'fSens'], motor: ['motor', 'fMot'], pons: ['pons'], gasser: ['gasser'],
      v1: ['v1'], sof: ['sof'], v2: ['v2'], frot: ['frot'], v3: ['v3trunk'], foval: ['foval'],
    },
    quiz: {
      question: 'Da quale orifizio esce dal cranio la branca mascellare?',
      options: ['Dalla fessura orbitaria superiore', 'Dal foro rotondo', 'Dal foro ovale', 'Dal foro spinoso'],
      correct: 1,
      explain: "Dal foro rotondo raggiunge la fossa pterigo-palatina; l'oftalmica passa dalla fessura orbitaria superiore, la mandibolare dal foro ovale.",
    },
    caption: 'Lo sfenoide in trasparenza, da destra e dal davanti; gli anelli scuri segnano i tre orifizi.',
    instruction: 'FAI PARTIRE UNA BRANCA E SEGUILA FUORI DAL CRANIO',
    view: { yaw: -0.85, zoom: 1, focus: { at: [0.04, 0.4, -0.05], scale: 2, height: 0.36 } },
    mode: selector({
      base: [...STEM, 'sphenoid', ...EYES, 'nucMot', 'nucPr', ...ROOTS, 'sof', 'frot', 'foval', 'v1', 'lacn', 'nasocil', 'v2', 'ppg', 'v3trunk', 'v3ant', 'v3post'],
      looks: { sphenoid: { opacity: 0.4 } },
      idle: 'Radice sensitiva (chiara) e motoria (rossa), ganglio, tre branche.',
      options: [
        {
          label: 'Segui la I',
          stepTime: 2.2,
          steps: [
            { ids: ['fSens', 'vroot'], text: 'Radice sensitiva, dalla porzione laterale del ponte' },
            { ids: ['gasser'], text: 'Ganglio di Gasser, nel cavo di Meckel' },
            { ids: ['sof'], text: 'Fessura orbitaria superiore' },
            { ids: ['v1', 'lacn', 'nasocil'], text: 'Orbita: nervi naso-ciliare, frontale e lacrimale' },
          ],
        },
        {
          label: 'Segui la II',
          stepTime: 2.2,
          steps: [
            { ids: ['fSens', 'vroot'], text: 'Radice sensitiva, dalla porzione laterale del ponte' },
            { ids: ['gasser'], text: 'Ganglio di Gasser, nel cavo di Meckel' },
            { ids: ['frot'], text: 'Foro rotondo, con decorso quasi orizzontale' },
            { ids: ['v2', 'ppg'], text: 'Fossa pterigo-palatina, sopra il ganglio sfeno-palatino' },
          ],
        },
        {
          label: 'Segui la III',
          stepTime: 2.2,
          steps: [
            { ids: ['fSens', 'vroot'], text: 'Radice sensitiva, dalla porzione laterale del ponte' },
            { ids: ['gasser'], text: 'Ganglio di Gasser, nel cavo di Meckel' },
            { ids: ['foval', 'v3trunk'], text: 'Foro ovale' },
            { ids: ['v3ant', 'v3post'], text: 'Fossa infratemporale: due tronchi terminali' },
          ],
        },
        {
          label: 'Radice motoria',
          stepTime: 2.2,
          steps: [
            { ids: ['nucMot', 'fMot'], text: 'Nucleo masticatorio, nel ponte' },
            { ids: ['motor'], text: 'Passa sotto il ganglio senza interrompersi' },
            { ids: ['foval', 'v3trunk'], text: 'Al foro ovale confluisce nella branca mandibolare' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Tre branche, tre territori',
    body:
      "L'{oftalmica|v1} si divide nei nervi {naso-ciliare|nasocil}, {frontale|front} e {lacrimale|lacn}: i rami sopratrocleare e sopraorbitario del frontale si distribuiscono alla {cute della fronte e del cuoio capelluto|skin1} fino al vertice. La {mascellare|v2} prosegue come nervo infraorbitario per la {cute dell'ala del naso e del labbro superiore|skin2}; il {nervo zigomatico|zyg} innerva la regione zigomatica e la temporale anteriore. La {mandibolare|v3} raggiunge con il {nervo mentale|mental} il {labbro inferiore e il mento|skin3}, con il {buccale|buccal} la guancia, con l'{auricolo-temporale|atn} la regione temporale posteriore e l'orecchio esterno.",
    terms: {
      v1: V1, nasocil: ['nasocil'], front: ['v1'], lacn: ['lacn'], skin1: ['skin1'], v2: ['v2'], skin2: ['skin2'], zyg: ['zyg'],
      v3: ['v3trunk', 'v3post', 'v3ant'], mental: ['mental'], skin3: ['skin3'], buccal: ['buccal'], atn: ['atn'],
    },
    quiz: {
      question: 'Quale nervo porta la sensibilità della cute del mento?',
      options: ['Il nervo infraorbitario', 'Il nervo buccale', 'Il nervo mentale', 'Il nervo auricolo-temporale'],
      correct: 2,
      explain: "È un ramo terminale dell'alveolare inferiore: esce dal foro mentale per labbro inferiore e mento.",
    },
    caption: 'A destra del paziente i nervi sul cranio; a sinistra la cute reale, con tre territori nascosti (confini stimati) che si scoprono toccando.',
    instruction: 'TOCCA UN PUNTO DEL VISO, POI SCEGLI LA BRANCA CHE LO PORTA',
    view: { yaw: 0, zoom: 0.86 },
    mode: faceMode({
      base: [...BONES, ...EYES, 'lacrimal', 'vroot', 'gasser', ...V1, 'v2', 'zyg', ...V3S, 'v3ant', ...SKIN],
      skin: ['skin1', 'skin2', 'skin3'],
      rest: 'skinRest',
      idle: 'Tocca un punto del viso: quale delle tre branche ne porta la sensibilità?',
      pick: { v1: 0, v2: 1, v3trunk: 2 },
      options: [
        {
          label: 'Oftalmica (I)', lit: [...V1, 'skin1', 'lacrimal'],
          info: 'Fronte e cuoio capelluto fino al vertice, palpebra superiore, radice e dorso del naso.',
        },
        {
          label: 'Mascellare (II)', lit: ['v2', 'zyg', 'skin2'],
          info: "Ala del naso e labbro superiore con l'infraorbitario; regione zigomatica e temporale anteriore con lo zigomatico.",
        },
        {
          label: 'Mandibolare (III)', lit: [...V3S, 'v3ant', 'skin3'],
          info: 'Labbro inferiore e mento, guancia, regione temporale posteriore e orecchio esterno.',
        },
      ],
    }),
  },
  {
    title: 'La branca mandibolare',
    body:
      "È la branca più voluminosa e l'unica mista: la {radice motoria|motor} vi confluisce per intero. Uscita dal {foro ovale|foval}, nella fossa infratemporale si divide in due tronchi. Nel {tronco antero-laterale|ant} prevalgono le fibre motorie: nervi {masseterino|massn}, {temporali profondi|tempn} e {pterigoideo laterale|ptn}, più il {nervo buccale|buccal}, sensitivo. Dal {tronco postero-mediale|post}, in prevalenza sensitivo, nascono il {nervo linguale|lingual}, l'{auricolo-temporale|atn}, che abbraccia il condilo della mandibola, e l'{alveolare inferiore|ian}: questo stacca il {nervo miloioideo|mylon}, percorre il canale mandibolare e al foro mentale si divide nei rami {mentale|mental} e incisivo.",
    terms: {
      motor: ['motor'], foval: ['foval'], ant: ['v3ant'], massn: ['massn'], tempn: ['tempn'], ptn: ['ptn'], buccal: ['buccal'],
      post: ['v3post'], lingual: ['lingual'], atn: ['atn'], ian: ['ian'], mylon: ['mylon'], mental: ['mental'],
    },
    quiz: {
      question: 'Quale di questi nervi nasce dal tronco antero-laterale?',
      options: ['Il nervo linguale', 'Il nervo buccale', "Il nervo auricolo-temporale", "Il nervo alveolare inferiore"],
      correct: 1,
      explain: 'È il ramo sensitivo di un tronco in prevalenza motorio; gli altri tre nascono dal tronco postero-mediale.',
    },
    caption: 'Fossa infratemporale destra, vista di lato; mandibola e muscoli superficiali in trasparenza.',
    instruction: 'SCEGLI UN TRONCO, SEGUI UN NERVO O INTERROMPI LA BRANCA',
    view: { yaw: -1.2, zoom: 1, focus: { at: [0.1, 0.25, -0.04], scale: 1.05, height: 0.235 } },
    mode: selector({
      base: [...BONES, 'tongue', 'gasser', 'vroot', 'motor', 'foval', ...V3, ...MUSCLES],
      // qui i muscoli accesi restano semitrasparenti: i nervi che li raggiungono devono vedersi
      looks: { ...MUSCLE_GLASS, temporalis: { opacity: 0.18, litOpacity: 0.5 }, masseter: { opacity: 0.18, litOpacity: 0.5 }, mandible: { opacity: 0.2 }, skull: { opacity: 0.1 } },
      idle: 'Blu: rami sensitivi. Rosso: rami motori. Viola: ganglio otico.',
      options: [
        {
          label: 'Tronco antero-laterale', lit: ['v3ant', 'massn', 'tempn', 'ptn', 'buccal', 'masseter', 'temporalis', 'ptlat'],
          info: 'Massetere, temporale e pterigoideo laterale; il buccale va a cute e mucosa della guancia.',
        },
        {
          label: 'Tronco postero-mediale', lit: ['v3post', 'lingual', 'atn', 'ian', 'mylon', 'mental', 'ptmed', 'tongue'],
          info: 'Linguale, auricolo-temporale, alveolare inferiore; piccoli rami per lo pterigoideo interno.',
        },
        {
          label: "Segui l'alveolare inferiore",
          stepTime: 2.2,
          steps: [
            { ids: ['v3post', 'ian'], text: 'In basso e in avanti, lungo la faccia mediale del ramo della mandibola' },
            { ids: ['mylon', 'mylohyoid', 'digastric'], text: 'Nervo miloioideo: miloioideo e ventre anteriore del digastrico' },
            { ids: ['teeth'], text: 'Canale mandibolare: un ramo per ciascun dente' },
            { ids: ['mental'], text: 'Foro mentale: ramo mentale e ramo incisivo' },
          ],
        },
        {
          label: 'Lesione al foro ovale',
          dead: [...V3, ...MUSCLES],
          info: 'Si perdono la sensibilità del territorio mandibolare e, da quel lato, i muscoli masticatori.',
        },
      ],
    }),
  },
];

export default {
  id: 'nervo-trigemino',
  title: 'Nervo trigemino',
  blurb: 'Nuclei, ganglio di Gasser, tre branche e i loro territori; la branca mandibolare e la masticazione.',
  part: 'Nervi cranici',
  order: 41,
  model: 'nervo-trigemino',
  createModel: () => new TrigeminalModel(),
  yaw: -0.75,
  zoom: 0.9,
  spreads,
};
