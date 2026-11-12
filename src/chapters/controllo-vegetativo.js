// Capitolo "Controllo vegetativo". Testi ricavati dagli appunti di
// neuroanatomia (Controllo vegetativo): minzione, respirazione, pressione
// arteriosa. Non sono negli appunti: il nome del nervo che porta le fibre del
// nucleo di Onuf (nervo pudendo), il livello della lesione midollare disegnata
// (midollo toracico) e il decorso disegnato delle vie, che uniscono origine e
// bersaglio; vedi le fonti in testa a src/models/controllo-vegetativo.js.
// Degli appunti restano fuori mezzo interno, fegato, sistema locomotore,
// sistema renina-angiotensina e PLGF.
import { chipsInto, infoText } from '../modes.js';
import { ControlloVegetativo } from '../models/controllo-vegetativo.js';

const STEM = ['midbrain', 'pons', 'medulla', 'v4', 'aqueduct'];
const BODY = ['cortex', 'midbrain', 'pons', 'medulla', 'cordTop', 'cordMid', 'cordLumb', 'cordConus', 'cordTip', 'cauda', 'spineTop', 'spineLow', 'sacrum', 'hips', 'heart', 'atriumR', 'lungs', 'bladder', 'urethra'];
const PNEUMO = ['pbm', 'kf', 'a5'];
const VRG = ['rvrg', 'cvrg'];
const RESP = ['pfrg', 'bot', 'prebot', ...VRG, ...PNEUMO, 'a2', 'nts'];
const VASO = ['nts', 'a2', 'dmv', 'amb', 'a1'];

// Regioni del modello: `focus` = [centro in mm della sorgente (verso destra,
// verso dietro, quota), ingrandimento, altezza sulla base]; `show` = contesto
// visibile; `yaw` = rotazione del modello.
const VIEWS = {
  whole: { focus: [], show: BODY, yaw: -0.75 },
  stem: { focus: [[0, 14, 1580], 9, 0.34], show: STEM, yaw: -2.5 },
  resp: { focus: [[4, 16, 1572], 12, 0.37], show: ['pons', 'medulla', 'v4'], yaw: -2.2 },
  brain: { focus: [[0, 10, 1630], 4.2, 0.36], show: ['cortex', 'mpfc', 'area4', ...STEM], yaw: -1.15 },
  limbic: { focus: [[12, 5, 1592], 6, 0.34], show: [...STEM, 'hypothalamus', 'amygdala'], yaw: -1.2 },
  ear: { focus: [[16, 12, 1582], 8.5, 0.32], show: ['pons', 'medulla', 'v4', 'vestibule'], yaw: -2.6 },
  conus: { focus: [[0, 32, 1114], 10, 0.37], show: ['cordConus', 'antConus', 'postConus', 'spn', 'onuf'], yaw: -0.9 },
  lumbar: { focus: [[0, 60, 1198], 7, 0.4], show: ['cordLumb', 'antLumb', 'postLumb', 'imlLumb'], yaw: -0.9 },
  pelvis: { focus: [[0, 28, 890], 3.2, 0.3], show: ['sacrum', 'hips', 'bladder', 'urethra', 'prostate', 'sphInt', 'sphExt', 'ihg', 'vesG'], yaw: -0.85 },
  lower: {
    focus: [[0, 20, 1010], 1.75, 0.4], yaw: -0.85,
    show: ['cordLumb', 'cordConus', 'cordTip', 'cauda', 'spineLow', 'sacrum', 'hips', 'bladder', 'urethra', 'sympLow', 'imlLumb', 'spn', 'onuf', 'img', 'lumbSpl', 'hypoUp', 'hypoN', 'ihg', 'pelvicN', 'pudendal', 'vesG', 'sphInt', 'sphExt'],
  },
  chest: {
    focus: [[5, 5, 1392], 1.75, 0.39], yaw: -0.7,
    show: [...STEM, 'cordTop', 'cordMid', 'spineTop', 'heart', 'atriumR', 'svc', 'aorta', 'cca', 'ica', 'eca', 'trachea', 'lungs', 'vagR', 'vagLow', 'vagCard', 'ix', 'sympTop', 'imlHeart', 'cardN', 'san', 'sinus'],
  },
  heart: { focus: [[5, -10, 1318], 3.4, 0.36], show: ['heart', 'atriumR', 'svc', 'ivc', 'aorta', 'san', 'vagCard', 'cardN'], yaw: -0.45 },
  neck: { focus: [[22, 5, 1530], 4.6, 0.36], show: ['pons', 'medulla', 'ica', 'eca', 'ix', 'vagR', 'sinus', 'glomus', 'hering'], yaw: -1.25 },
};

// Come `selector` di src/modes.js, ma ogni opzione e ogni passo sceglie anche
// la regione del modello da guardare (`view`): la via si segue spostandosi da
// un primo piano all'altro. Opzioni: { label, view, ids, show, links, activity,
// labels, dead, info } oppure { label, steps: [{ view, ids, …, text }], stepTime }.
function stage({ home, options, idle = '', initial = null }) {
  return async ({ model, controls }) => {
    let sel = null, t0 = 0, shown = -1, state = home, lastView = null, yawTo = null, yawUntil = 0;
    const sign = model.mirror?.scale.x < 0 ? -1 : 1;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i && !o.steps ? null : i) }))
    );
    const info = await infoText(controls, -height - 0.03);

    const apply = (s, text) => {
      state = s;
      const name = s.view ?? home.view;
      const v = VIEWS[name];
      model.setFocus(...v.focus);
      model.show([...v.show, ...(s.show ?? []), ...(s.ids ?? []), ...(s.dead ?? [])]);
      model.showLinks(s.links ?? []);
      model.setActivity(s.activity ?? {});
      model.setLabels(s.labels ?? {});
      if (name !== lastView) {
        lastView = name;
        yawTo = v.yaw * sign;
        yawUntil = model.time + 2.2;
      }
      info.text = text;
    };
    const select = (i) => {
      sel = i;
      t0 = model.time;
      shown = -1;
      chips.forEach((c, j) => c.setActive(j === i));
      const o = options[i];
      if (!o) apply(home, idle);
      else if (!o.steps) apply(o, o.info);
    };

    return {
      enter() {
        lastView = null;
        select(initial);
        model.lookFn = (part) => {
          if (state.dead?.includes(part.id)) return { dead: true };
          if (state === home || !state.ids?.length) return {};
          if (state.ids.includes(part.id)) return part.ghost ? { glow: 0.5 } : { glow: 0.45, opacity: 1 };
          return { dim: true };
        };
      },
      update() {
        if (yawTo != null) {
          model.yaw += (yawTo - model.yaw) * 0.07;
          if (model.time > yawUntil) yawTo = null;
        }
        const o = options[sel];
        if (!o?.steps) return;
        const k = Math.min(o.steps.length - 1, Math.floor((model.time - t0) / (o.stepTime ?? 3.4)));
        if (k === shown) return;
        shown = k;
        apply(o.steps[k], `${k + 1}/${o.steps.length} · ${o.steps[k].text}`);
      },
    };
  };
}

const spreads = [
  {
    title: 'Tre muscoli per la minzione',
    body:
      "La minzione dipende da tre muscoli. Lo {sfintere uretrale interno|sphInt}, presente solo nel maschio, riceve fibre ortosimpatiche nate nella {colonna intermedio-laterale|iml} e giunte con i nervi splancnici lombari al {ganglio ipogastrico inferiore|ihg}: la noradrenalina, su recettori alfa-1, lo contrae e chiude il meato uretrale interno. Lo {sfintere uretrale esterno|sphExt}, striato, è innervato dai motoneuroni alfa e gamma del {nucleo di Onuf|onuf}, da S2 a S4. Il {detrusore|bladder} è rilasciato dall'ortosimpatico lombare, su recettori beta-3, e contratto dal {parasimpatico sacrale|spn}, che eccita i piccoli {gangli del plesso vescicale|vesG}: acetilcolina su recettori muscarinici.",
    terms: { sphInt: ['sphInt'], iml: ['imlLumb'], ihg: ['ihg'], sphExt: ['sphExt'], onuf: ['onuf'], bladder: ['bladder'], spn: ['spn'], vesG: ['vesG'] },
    quiz: {
      question: 'Su quali recettori agisce la noradrenalina per rilasciare il detrusore?',
      options: ['Alfa-1', 'Beta-3', 'Muscarinici', 'Beta-1'],
      correct: 1,
      explain: 'I beta-3 sono molto selettivi: un farmaco che li stimola rilascia il detrusore senza interferire con lo sfintere interno.',
    },
    caption: 'Midollo lombo-sacrale, cauda equina, bacino e vescica reali (Z-Anatomy); gangli, sfinteri e nervi splancnici ricostruiti.',
    instruction: 'SCEGLI UN MUSCOLO E SEGUI LE FIBRE FINO A LUI',
    view: { yaw: -0.85, zoom: 1 },
    mode: stage({
      home: { view: 'lower', labels: { imlLumb: 'ortosimpatico lombare', spn: 'S2-S4', bladder: 'vescica' } },
      idle: 'Dal midollo lombare e sacrale alla vescica: tre muscoli, tre innervazioni.',
      options: [
        {
          label: 'Sfintere interno',
          steps: [
            { view: 'lumbar', ids: ['imlLumb'], labels: { imlLumb: 'colonna intermedio-laterale' }, text: 'Neuroni ortosimpatici pregangliari nella colonna intermedio-laterale' },
            { view: 'lower', ids: ['imlLumb', 'lumbSpl', 'hypoUp', 'hypoN', 'ihg', 'img'], links: ['preLumb', 'hypoLow'], labels: { ihg: 'ganglio ipogastrico inferiore', img: 'mesenterico inferiore' }, text: 'Nervi splancnici lombari fino al ganglio ipogastrico inferiore (più di rado al mesenterico inferiore)' },
            { view: 'pelvis', ids: ['ihg', 'sphInt'], show: ['hypoN'], links: ['postSphInt'], activity: { sphInt: 1 }, text: 'Fibre post-gangliari: noradrenalina su alfa-1, lo sfintere si contrae e chiude il meato interno' },
          ],
        },
        {
          label: 'Sfintere esterno',
          steps: [
            { view: 'conus', ids: ['onuf'], labels: { onuf: 'nucleo di Onuf' }, text: 'Motoneuroni alfa e gamma del nucleo di Onuf, nel corno anteriore da S2 a S4' },
            { view: 'pelvis', ids: ['pudendal', 'sphExt'], links: ['pudDown', 'pudSph'], activity: { sphExt: 1 }, text: 'Muscolo striato: contraendosi chiude il meato uretrale esterno' },
          ],
        },
        {
          label: 'Detrusore: orto',
          steps: [
            { view: 'lumbar', ids: ['imlLumb'], labels: { imlLumb: 'colonna intermedio-laterale' }, text: 'Ortosimpatico lombare: neuroni pregangliari' },
            { view: 'lower', ids: ['imlLumb', 'lumbSpl', 'hypoUp', 'hypoN', 'ihg'], links: ['preLumb', 'hypoLow'], text: 'Nervi splancnici lombari e nervo ipogastrico' },
            { view: 'pelvis', ids: ['ihg', 'bladder'], show: ['hypoN'], links: ['postDet'], activity: { bladder: -1 }, text: 'Noradrenalina su beta-3: il detrusore si rilascia, la vescica si riempie' },
          ],
        },
        {
          label: 'Detrusore: para',
          steps: [
            { view: 'conus', ids: ['spn'], labels: { spn: 'parasimpatico sacrale' }, text: 'Neuroni parasimpatici pregangliari sacrali, da S2 a S4' },
            { view: 'pelvis', ids: ['pelvicN', 'vesG'], links: ['pelvicSpl'], labels: { vesG: 'gangli vescicali' }, text: 'Fibre pregangliari fino ai piccoli gangli del plesso vescicale, nel pavimento pelvico' },
            { view: 'pelvis', ids: ['vesG', 'bladder', 'sphInt'], show: ['pelvicN'], links: ['postPara', 'paraSph'], activity: { bladder: 1, sphInt: -1 }, text: 'Acetilcolina su recettori muscarinici: il detrusore si contrae, lo sfintere interno si rilascia' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Chi decide quando svuotare la vescica',
    body:
      "I meccanocettori della parete della {vescica|bladder} sentono lo stiramento da riempimento. Lo stimolo sale con il lemnisco viscerale alla formazione reticolare, soprattutto al {locus coeruleus|lc}, una sorta di porta verso la {corteccia prefrontale mediale|mpfc}. Da qui fibre intra-corticali raggiungono lo strato V dell'{area 4|area4}, che proietta al {PAG|pag}, centro di coordinamento; il PAG raggiunge il {centro pontino della minzione|pmc}, nel nucleo di Barrington: un core e uno {shell GABAergico|psc} che lo inibisce. Dal core scende una via reticolo-spinale che eccita i {parasimpatici da S2 a S4|spn} e inibisce il {nucleo di Onuf|onuf} e l'ortosimpatico lombare: così è favorita la minzione.",
    terms: { bladder: ['bladder'], lc: ['lc'], mpfc: ['mpfc'], area4: ['area4'], pag: ['pag'], pmc: ['pmc'], psc: ['psc'], spn: ['spn'], onuf: ['onuf'] },
    quiz: {
      question: 'Perché nel bambino piccolo la minzione è riflessa e incontrollabile?',
      options: [
        'Il detrusore non è ancora innervato',
        'Le vie cortico-reticolo-spinali non sono ancora mielinizzate',
        'Manca il nucleo di Onuf',
        'Il PAG non riceve afferenze viscerali',
      ],
      correct: 1,
      explain: 'Fino a 2-3 anni le afferenze viscerali arrivano al PAG, che attiva il detrusore e inibisce gli sfinteri senza il controllo della corteccia.',
    },
    caption: 'Un solo corpo in proporzioni reali: la via si segue passando da un primo piano all’altro.',
    instruction: 'SEGUI LO STIMOLO, POI PROVA LE LESIONI',
    view: { yaw: -0.75, zoom: 1 },
    mode: stage({
      home: { view: 'whole', labels: { cortex: 'corteccia', medulla: 'tronco encefalico', cordConus: 'midollo sacrale', bladder: 'vescica' } },
      idle: 'Dalla vescica al ponte e alla corteccia, e ritorno: scegli «Segui lo stimolo».',
      options: [
        {
          label: 'Segui lo stimolo',
          stepTime: 3.6,
          steps: [
            { view: 'pelvis', ids: ['bladder'], show: ['pelvicN'], links: ['aff'], text: 'Vescica piena: i meccanocettori della parete sentono lo stiramento' },
            { view: 'whole', ids: ['cordConus', 'cordLumb', 'cordMid', 'cordTop'], links: ['ascW'], text: 'Lo stimolo sale nel midollo con il lemnisco viscerale' },
            { view: 'stem', ids: ['lc'], show: ['pmc', 'psc', 'pag'], links: ['ascLC'], labels: { lc: 'locus coeruleus' }, text: 'Formazione reticolare, soprattutto il locus coeruleus: la porta verso la corteccia' },
            { view: 'brain', ids: ['mpfc'], show: ['lc', 'pag'], links: ['lcPfc'], labels: { mpfc: 'prefrontale mediale' }, text: 'Corteccia prefrontale mediale: se serve, ci sveglia' },
            { view: 'brain', ids: ['mpfc', 'area4'], show: ['lc', 'pag'], links: ['pfcM1'], labels: { area4: 'area 4' }, text: "Fibre intra-corticali fino allo strato V dell'area 4" },
            { view: 'brain', ids: ['area4', 'pag'], show: ['lc', 'mpfc'], links: ['m1Pag'], labels: { pag: 'PAG' }, text: 'Fibre cortico-mesencefaliche al PAG, centro di coordinamento' },
            { view: 'stem', ids: ['pag', 'pmc'], show: ['lc', 'psc'], links: ['pagPmc'], labels: { pmc: 'PMC' }, text: 'Dal PAG al centro pontino della minzione, subito medialmente al locus coeruleus' },
            { view: 'whole', ids: ['cordTop', 'cordMid', 'cordLumb', 'cordConus'], links: ['rsW'], text: 'Dal core parte una via reticolo-spinale verso il midollo sacrale' },
            { view: 'conus', ids: ['spn', 'onuf'], links: ['rsSpn', 'rsOnuf'], activity: { spn: 1, onuf: -1 }, text: 'Eccita i neuroni parasimpatici da S2 a S4 (blu), inibisce il nucleo di Onuf (rosso)' },
            { view: 'pelvis', ids: ['bladder', 'sphExt', 'sphInt'], activity: { bladder: 1, sphExt: -1, sphInt: -1 }, text: 'Il detrusore si contrae, gli sfinteri si rilasciano: minzione' },
          ],
        },
        {
          label: 'PMC e PSC', view: 'stem', ids: ['pmc', 'psc', 'lc'], show: ['pag'], links: ['pscPmc'],
          labels: { pmc: 'core: PMC', psc: 'shell: PSC', lc: 'locus coeruleus' },
          info: 'Nucleo di Barrington: il core (PMC) è glutammatergico; lo shell (PSC), GABAergico, lo inibisce.',
        },
        {
          label: 'Bambino piccolo',
          stepTime: 3.6,
          steps: [
            { view: 'brain', ids: ['pag'], dead: ['mpfc', 'area4'], text: 'Vie cortico-reticolo-spinali non ancora mielinizzate: la corteccia non controlla il PAG' },
            { view: 'stem', ids: ['pag', 'pmc'], show: ['lc', 'psc'], links: ['affPag', 'pagPmc'], text: 'Le afferenze viscerali raggiungono direttamente il PAG' },
            { view: 'pelvis', ids: ['bladder', 'sphExt', 'sphInt'], activity: { bladder: 1, sphExt: -1, sphInt: -1 }, text: 'Minzione riflessa, incontrollabile fino ai 2-3 anni' },
          ],
        },
        {
          label: 'Lesione midollare',
          stepTime: 4,
          steps: [
            { view: 'whole', ids: ['cut'], dead: ['cordLumb', 'cordConus'], labels: { cut: 'lesione' }, text: 'Lesione sopra il tratto lombo-sacrale: prima una fase di areflessia, cateterismo continuo' },
            { view: 'pelvis', ids: ['bladder', 'sphExt'], activity: { bladder: 1, sphExt: 1 }, text: 'Se il controllo è recuperato solo in parte: dissinergia detrusore-sfintere, residuo post-minzionale' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Il ritmo del respiro nasce nel bulbo',
    body:
      "Il {gruppo respiratorio ventrale|vrg} ha una porzione rostrale, il {rVRG|rvrg}, che eccita i motoneuroni inspiratori, e una caudale, il {cVRG|cvrg}, per gli espiratori. Il ritmo viene dal {complesso del pre-Bötzinger|prebot}, rete di neuroni pacemaker attivata dal {complesso parafaciale|pfrg}: i suoi neuroni glutammatergici (95%) eccitano il rVRG, i GABAergici (5%) inibiscono il cVRG. È l'inspirazione. Il {nucleo di Bötzinger|bot}, eccitato in modo progressivo, raggiunto il punto critico inibisce il rVRG ed eccita il cVRG. Il {centro pneumotassico|pneumo} del ponte inserisce tra le due la fase post-inspiratoria. Il {gruppo dorsale|a2}, o ala cinerea, trasferisce le informazioni periferiche del {nucleo del tratto solitario|nts}.",
    terms: { vrg: VRG, rvrg: ['rvrg'], cvrg: ['cvrg'], prebot: ['prebot'], pfrg: ['pfrg'], bot: ['bot'], pneumo: PNEUMO, a2: ['a2'], nts: ['nts'] },
    quiz: {
      question: 'Che cosa provoca una lesione del centro pneumotassico?',
      options: [
        'Gasping: affanno e respiro irregolare',
        "Respirazione apneustica: manca la fase post-inspiratoria",
        "Arresto dell'inspirazione",
        'Perdita del riflesso di Hering-Breuer',
      ],
      correct: 1,
      explain: 'Restano inspirazione ed espirazione, ma il respiro è bifasico; il gasping segue invece la lesione del pre-Bötzinger.',
    },
    caption: 'Bulbo e ponte reali in trasparenza, da dietro e da destra; i nuclei respiratori sono ricostruiti.',
    instruction: 'FAI UN RESPIRO, POI LEDI UN CENTRO',
    view: { yaw: -2.2, zoom: 1.05 },
    mode: stage({
      home: { view: 'resp', show: RESP, labels: { prebot: 'pre-Bötzinger', cvrg: 'cVRG', kf: 'centro pneumotassico' } },
      idle: 'Dal basso: cVRG, rVRG, pre-Bötzinger, Bötzinger, parafaciale; nel ponte il centro pneumotassico.',
      options: [
        {
          label: 'Un respiro',
          stepTime: 3.8,
          steps: [
            { ids: ['pfrg', 'prebot'], show: RESP, links: ['pfPre'], labels: { pfrg: 'parafaciale', prebot: 'pre-Bötzinger' }, text: 'Il complesso parafaciale attiva i neuroni pacemaker del pre-Bötzinger' },
            { ids: ['prebot', 'rvrg', 'cvrg'], show: RESP, links: ['preRvrg', 'preCvrg'], activity: { rvrg: 1, cvrg: -1 }, labels: { rvrg: 'rVRG', cvrg: 'cVRG' }, text: 'Inspirazione: glutammato sul rVRG, GABA sul cVRG' },
            { ids: ['prebot', 'bot', ...PNEUMO, 'rvrg'], show: RESP, links: ['prePn', 'preBot', 'botRvrg'], activity: { rvrg: -1 }, labels: { bot: 'Bötzinger', kf: 'pneumotassico' }, text: 'Stasi post-inspiratoria: centro pneumotassico attivo, il Bötzinger inibisce il rVRG' },
            { ids: ['bot', 'cvrg'], show: RESP, links: ['botCvrg'], activity: { cvrg: 1, rvrg: -1 }, labels: { cvrg: 'cVRG' }, text: 'Espirazione: il Bötzinger attiva anche il cVRG' },
          ],
        },
        {
          label: 'Hering-Breuer',
          stepTime: 3.8,
          steps: [
            { view: 'chest', ids: ['lungs', 'vagR', 'vagLow'], links: ['hbAff'], text: 'Polmoni troppo distesi: meccanocettori alveolari innervati dal vago' },
            { ids: ['nts', 'bot'], show: RESP, links: ['ntsBot'], labels: { nts: 'tratto solitario', bot: 'Bötzinger' }, text: 'Il nucleo del tratto solitario attiva il Bötzinger' },
            { ids: ['bot', 'prebot', 'rvrg', 'cvrg'], show: RESP, links: ['botPre'], activity: { rvrg: -1, cvrg: 1 }, text: "Il Bötzinger inibisce il pre-Bötzinger: rVRG spento, cVRG attivo, l'inspirazione si ferma" },
          ],
        },
        {
          label: 'Gruppo dorsale', ids: ['a2', 'nts', 'prebot', 'rvrg'], show: RESP, links: ['ntsA2', 'a2Pre', 'a2Rvrg'],
          labels: { a2: 'ala cinerea (A2/C2)', nts: 'tratto solitario' },
          info: "L'ala cinerea trasferisce al gruppo ventrale e al pre-Bötzinger ciò che vago e glossofaringeo portano al solitario.",
        },
        {
          label: 'Lesione: pneumotassico', ids: ['prebot', 'bot', ...VRG], dead: PNEUMO, show: RESP, labels: { kf: 'leso' },
          info: 'Respirazione apneustica: inspirazione ed espirazione restano, manca la fase post-inspiratoria.',
        },
        {
          label: 'Lesione: pre-Bötzinger', ids: ['bot', ...VRG], dead: ['prebot'], show: RESP, labels: { prebot: 'leso' },
          info: 'Senza i neuroni pacemaker: affanno e respiro irregolare, il gasping.',
        },
      ],
    }),
  },
  {
    title: 'Due centri bulbari regolano il cuore',
    body:
      "La pressione arteriosa è il prodotto di resistenza e flusso. Sul flusso agiscono i centri vasomotori bulbari. Il {centro A1/C1|a1}, catecolaminergico, è il centro pre-motore dell'ortosimpatico: scende nel midollo ai {neuroni pregangliari da C8 a T5|iml} che innervano il {cuore|heart}, con effetto inotropo, cronotropo, dromotropo e batmotropo positivo. Il {centro A2/C2|a2}, o ala cinerea, è il centro pre-motore del parasimpatico: agisce con il {nucleo ambiguo|amb} e il {nervo vago|vag}, con effetto cronotropo e dromotropo negativo. Sulla resistenza conta l'ortosimpatico: noradrenalina su recettori alfa-1 delle arteriole, vasocostrizione. A1/C1 è attivato anche da {ipotalamo|hyp} e {amigdala|amy}, nella rabbia.",
    terms: { a1: ['a1'], iml: ['imlHeart'], heart: ['heart', 'atriumR'], a2: ['a2'], amb: ['amb'], vag: ['vagR', 'vagLow', 'vagCard'], hyp: ['hypothalamus'], amy: ['amygdala'] },
    quiz: {
      question: 'Perché è il calibro delle arteriole a influenzare di più la pressione?',
      options: [
        'Perché la viscosità del sangue non cambia mai',
        'Perché il parasimpatico innerva tutte le arteriole',
        'Perché nella legge di Poiseuille compare alla quarta potenza',
        'Perché la lunghezza dei vasi varia a ogni battito',
      ],
      correct: 2,
      explain: 'La resistenza è inversamente proporzionale al calibro alla quarta; la viscosità conta solo in situazioni patologiche.',
    },
    caption: 'Tronco encefalico, midollo, simpatico, vago e cuore reali; il vago sotto metà collo e i rami cardiaci sono ricostruiti.',
    instruction: 'SCEGLI UN SISTEMA E SCENDI FINO AL CUORE',
    view: { yaw: -0.7, zoom: 1 },
    mode: stage({
      home: { view: 'chest', labels: { medulla: 'centri bulbari', imlHeart: 'C8-T5', heart: 'cuore' } },
      idle: 'Dal bulbo al cuore per due strade: il midollo e il tronco del simpatico, oppure il vago.',
      options: [
        {
          label: 'Ortosimpatico',
          stepTime: 3.8,
          steps: [
            { view: 'stem', ids: ['a1'], show: VASO, labels: { a1: 'A1/C1' }, text: "A1/C1, noradrenergico e adrenergico: centro pre-motore dell'ortosimpatico" },
            { view: 'chest', ids: ['imlHeart', 'sympTop'], links: ['a1Iml'], labels: { imlHeart: 'C8-T5' }, text: 'Scende nel midollo ai neuroni pregangliari, da C8 a T5' },
            { view: 'heart', ids: ['cardN', 'heart', 'atriumR', 'san'], links: ['sympSan', 'sympVent'], activity: { heart: 1 }, labels: { san: 'nodo seno-atriale' }, text: 'Sul cuore: inotropismo, cronotropismo, dromotropismo e batmotropismo positivi' },
          ],
        },
        {
          label: 'Parasimpatico',
          stepTime: 3.8,
          steps: [
            { view: 'stem', ids: ['a2', 'amb'], show: VASO, links: ['a2Amb'], labels: { a2: 'A2/C2', amb: 'nucleo ambiguo' }, text: 'A2/C2, o ala cinerea: centro pre-motore del parasimpatico, attraverso il nucleo ambiguo' },
            { view: 'chest', ids: ['vagR', 'vagLow', 'vagCard'], links: ['vagHeart'], labels: { vagLow: 'nervo vago' }, text: 'Fibre pregangliari nel nervo vago' },
            { view: 'heart', ids: ['vagCard', 'san', 'atriumR'], links: ['vagSan'], activity: { san: -1 }, text: 'Sul miocardio specifico: cronotropismo e dromotropismo negativi' },
          ],
        },
        {
          label: 'Arteriole', view: 'chest', ids: ['a1', 'sympTop', 'imlHeart', 'aorta', 'cca', 'ica', 'eca'], links: ['a1Iml'],
          labels: { sympTop: 'simpatico', cca: 'calibro dei vasi' },
          info: 'Fibre post-gangliari ortosimpatiche sulla tonaca media: noradrenalina su alfa-1, vasocostrizione, la pressione sale.',
        },
        {
          label: 'Rabbia', view: 'limbic', ids: ['hypothalamus', 'amygdala', 'a1'], show: VASO, links: ['hypA1', 'amyA1'],
          labels: { hypothalamus: 'ipotalamo', amygdala: 'amigdala', a1: 'A1/C1' },
          info: 'Vie discendenti da ipotalamo e amigdala attivano A1/C1: è il meccanismo del combatti o fuggi.',
        },
      ],
    }),
  },
  {
    title: 'Riflessi che tengono costante la pressione',
    body:
      "I {seni|sinus} carotideo e aortico sono barocettori: stirati dall'aumento di pressione, con glossofaringeo e vago raggiungono il {nucleo del tratto solitario|nts} e il {centro A2/C2|a2}, che stimola il {nucleo ambiguo|amb} e inibisce {A1/C1|a1}: il cuore rallenta, la vasocostrizione si riduce. I {glomi|glomus} fanno l'opposto: chemocettori sensibili al calo dei bicarbonati, eccitano il {pre-Bötzinger|prebot} e A1/C1. I {corpi cavali|cavali}, barocettori atriali, generano il riflesso di Bainbridge. Quando ci alziamo, la macula del sacculo, nel {vestibolo|vest}, eccita il {nucleo vestibolare laterale|lvn}, che raggiunge A1/C1 e, con la via vestibolo-spinale laterale, la lamina VII del midollo: la pressione non cade.",
    terms: { sinus: ['sinus', 'aoBody'], nts: ['nts'], a2: ['a2'], amb: ['amb'], a1: ['a1'], glomus: ['glomus'], prebot: ['prebot'], cavali: ['cavali'], vest: ['vestibule'], lvn: ['lvn'] },
    quiz: {
      question: 'Che cosa accade quando i barocettori del seno carotideo sono stirati?',
      options: [
        'Il nucleo ambiguo è inibito e la frequenza sale',
        'A2/C2 stimola il nucleo ambiguo e inibisce A1/C1',
        'Il pre-Bötzinger è eccitato e il respiro accelera',
        'Il nucleo vestibolare laterale attiva A1/C1',
      ],
      correct: 1,
      explain: 'Il vago rallenta il cuore e si riduce la vasocostrizione ortosimpatica: flusso e resistenza calano, la pressione scende.',
    },
    caption: 'Carotidi, glossofaringeo, vago, cuore e vene cave reali; seno, glomo, nervo di Hering e corpi cavali ricostruiti.',
    instruction: 'SCEGLI UN RECETTORE E SEGUI IL RIFLESSO',
    view: { yaw: -0.7, zoom: 1 },
    mode: stage({
      home: { view: 'chest', show: ['aoBody', 'glomus'], labels: { sinus: 'seno carotideo', aoBody: 'recettori aortici', medulla: 'bulbo' } },
      idle: 'Recettori in periferia, centri nel bulbo, effetto su cuore e vasi.',
      options: [
        {
          label: 'Seno carotideo',
          stepTime: 3.8,
          steps: [
            { view: 'neck', ids: ['sinus', 'hering', 'ix'], links: ['heringUp'], labels: { sinus: 'seno carotideo', hering: 'nervo di Hering' }, text: 'La pressione sale e stira i barocettori: il segnale parte con il glossofaringeo' },
            { view: 'stem', ids: ['nts', 'a2'], show: VASO, links: ['ixNts', 'ntsA2'], labels: { nts: 'tratto solitario', a2: 'A2/C2' }, text: 'Nucleo del tratto solitario, poi centro A2/C2' },
            { view: 'stem', ids: ['a2', 'amb', 'a1'], show: VASO, links: ['a2Amb', 'a2A1i'], activity: { amb: 1, a1: -1 }, text: 'A2/C2 stimola il nucleo ambiguo (rosso) e inibisce A1/C1 (verde)' },
            { view: 'chest', ids: ['vagR', 'vagLow', 'vagCard', 'san', 'atriumR'], links: ['vagHeart'], activity: { heart: -1 }, text: 'Vago: effetto cronotropo negativo; meno vasocostrizione. Flusso e pressione scendono' },
          ],
        },
        {
          label: 'Glomo',
          stepTime: 3.8,
          steps: [
            { view: 'neck', ids: ['glomus', 'hering', 'ix'], links: ['heringUp'], labels: { glomus: 'glomo carotideo' }, text: 'Calano i bicarbonati: i glomociti di tipo I rilasciano ATP e glutammato sulle terminazioni sensitive' },
            { view: 'stem', ids: ['nts', 'a2'], show: [...VASO, 'prebot'], links: ['ixNts', 'ntsA2'], labels: { nts: 'tratto solitario', a2: 'A2/C2' }, text: 'Nervo di Hering (o di Cyon, nel vago), nucleo del tratto solitario, A2/C2' },
            { view: 'stem', ids: ['a2', 'prebot', 'a1'], show: VASO, links: ['a2Pre', 'a2A1e'], activity: { prebot: 1, a1: 1 }, text: 'A2/C2 eccita il pre-Bötzinger e A1/C1: respiro più frequente, pressione in aumento' },
          ],
        },
        {
          label: 'Corpi cavali',
          stepTime: 4,
          steps: [
            { view: 'heart', ids: ['cavali', 'ivc', 'atriumR'], labels: { cavali: 'corpi cavali' }, text: "Propaggini di miocardio dell'atrio destro nella parete della cava inferiore: sentono la distensione atriale" },
            { view: 'heart', ids: ['atriumR', 'heart', 'san', 'cardN'], show: ['cavali'], links: ['sympSan', 'sympVent'], activity: { heart: 1 }, text: "Riflesso di Bainbridge: effetto cronotropo e inotropo positivo, l'atrio si svuota" },
            { view: 'heart', ids: ['cavali'], labels: { cavali: 'fattore natriuretico atriale' }, text: 'Fibre ortosimpatiche stimolano il fattore natriuretico atriale: natriuresi, la volemia si riduce' },
          ],
        },
        {
          label: 'In piedi',
          stepTime: 3.8,
          steps: [
            { view: 'ear', ids: ['vestibule', 'lvn'], show: ['a1'], links: ['vestLvn'], labels: { vestibule: 'macula del sacculo', lvn: 'vestibolare laterale' }, text: "In ortostatismo la gravità stimola la macula del sacculo, che eccita il nucleo vestibolare laterale" },
            { view: 'ear', ids: ['lvn', 'a1'], show: ['vestibule'], links: ['lvnA1'], activity: { a1: 1 }, text: 'Alcuni neuroni raggiungono direttamente il centro A1/C1' },
            { view: 'chest', ids: ['imlHeart', 'sympTop', 'cordTop', 'cordMid'], links: ['vsp'], activity: { heart: 1 }, text: 'Via vestibolo-spinale laterale ai neuroni della colonna di Terni, lamina VII: la pressione è sostenuta' },
          ],
        },
      ],
    }),
  },
];

export default {
  id: 'controllo-vegetativo',
  title: 'Controllo vegetativo',
  blurb: 'Minzione, respiro e pressione: i centri del tronco encefalico e i loro riflessi.',
  part: 'Sistema vegetativo',
  order: 61,
  model: 'controllo-vegetativo',
  createModel: () => new ControlloVegetativo(),
  yaw: -0.75,
  spreads,
};
