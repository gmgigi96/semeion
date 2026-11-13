// Capitolo "Riflessi". Testi dagli appunti di neuroanatomia (Riflessi).
import { selector } from '../modes.js';
import { Riflessi, FOCUS } from '../models/riflessi.js';

const AXIAL = ['spine', 'sacrum', 'hipR', 'hipL', 'cord'];
const LEG = ['femurR', 'patellaR', 'tibiaR'];
const QUAD = ['rectus', 'vasti'];
const KNEE = ['quadTendon', 'patLig'];
const ROOTS = ['rootPost', 'rootAnt', 'ganglion'];
const FEM = ['plexus', 'femoral', 'rfBranch'];
const SCI = ['rootSac', 'sciatic', 'hamBranch'];
const SPINDLE = ['fusCapsule', 'bagFibers', 'chainFibers', 'bagNuclei', 'chainNuclei', 'endIa', 'endII', 'endGamma'];
const GTO = ['gtoCapsule', 'gtoCollagen', 'gtoMuscle', 'endIb'];
const PLATE = ['section', 'grey', 'antHorn', 'postHorn', 'canal', 'rootPostP', 'rootAntP', 'ganglionP', 'guide'];
const SECTION = ['section', 'grey', 'antHorn', 'postHorn', 'canal'];
const LEFT = ['femurL', 'patellaL', 'tibiaL', 'quadL', 'hamsL', 'femoralL', 'sciaticL', 'rootsL', 'plexusL', 'hamBranchL'];
const AFF = ['aff1', 'aff2', 'aff3'];
const EFF = ['eff1', 'eff2', 'eff3'];
const GLASS = { rectus: { opacity: 0.2, litOpacity: 0.3 }, vasti: { opacity: 0.12, litOpacity: 0.2 }, quadTendon: { opacity: 0.3, litOpacity: 0.4 } };
const SOFT = { rectus: { opacity: 0.5, litOpacity: 0.7 }, vasti: { opacity: 0.4, litOpacity: 0.6 } };

const spreads = [
  {
    title: 'Il fuso neuromuscolare',
    body:
      "Il {fuso neuromuscolare|fuso} è un propriocettore del ventre del muscolo: una {capsula connettivale|caps} con 10-15 fibre intrafusali, parallele tra loro e alle {fibre extrafusali|extra}. Ogni fibra ha una porzione equatoriale, recettoriale e deformabile, e due {porzioni polari|poli} contrattili, raggiunte dalle fibre motorie gamma. Le fibre {a sacco di nuclei|bag}, dinamiche e a rapido adattamento, misurano le variazioni di lunghezza e la loro velocità: le avvolge la {terminazione anulospirale|ia} delle fibre Ia. Le fibre {a catena di nuclei|chain}, statiche e a lento adattamento, rilevano l'allungamento e mantengono il tono: ricevono le {fibre II|ii}, con terminazione a fiorame.",
    terms: {
      fuso: SPINDLE, caps: ['fusCapsule'], extra: ['extrafusal'], poli: ['endGamma'], bag: ['bagFibers', 'bagNuclei'], ia: ['endIa'],
      chain: ['chainFibers', 'chainNuclei'], ii: ['endII'],
    },
    quiz: {
      question: 'Quale fibra sensitiva forma la terminazione anulospirale attorno al sacco di nuclei?',
      options: ['La fibra Ib', 'La fibra Ia', 'La fibra II', 'La fibra gamma fasica'],
      correct: 1,
      explain: 'Le fibre Ia si avvolgono a spire attorno alla porzione equatoriale; le fibre II terminano a fiorame sulle fibre a catena.',
    },
    caption: 'Coscia destra reale (Z-Anatomy) con il quadricipite in trasparenza; il fuso, ricostruito nel ventre del retto femorale, è molto ingrandito.',
    instruction: 'SCEGLI UNA PARTE DEL FUSO · TRASCINA PER RUOTARE',
    view: { yaw: -0.45, focus: FOCUS.thigh },
    mode: selector({
      base: ['hipR', ...LEG, ...QUAD, ...KNEE, 'femoral', 'rfBranch', ...SPINDLE, 'extrafusal', 'endAlpha'],
      looks: GLASS,
      idle: 'Il fuso sta nel ventre del muscolo, in parallelo alle fibre extrafusali: qui è nel retto femorale.',
      pick: { bagFibers: 1, bagNuclei: 1, chainFibers: 2, chainNuclei: 2, endIa: 3, endII: 4, endGamma: 5, extrafusal: 6, endAlpha: 6 },
      options: [
        {
          label: 'Capsula e fibre', focus: FOCUS.spindle, lit: ['fusCapsule', 'bagFibers', 'chainFibers', 'bagNuclei', 'chainNuclei'],
          labels: { bagFibers: 'sacco di nuclei', chainFibers: 'catena di nuclei' },
          info: 'Capsula di fibre collagene con 10-15 fibre intrafusali affusolate (qui sei): al centro la porzione equatoriale, ai capi i due poli contrattili.',
        },
        {
          label: 'Sacco di nuclei', focus: FOCUS.spindle, lit: ['bagFibers', 'bagNuclei', 'endIa'],
          info: 'Nuclei raggruppati: fibra molto deformabile, a rapido adattamento. Misura le variazioni di lunghezza e la velocità con cui avvengono.',
        },
        {
          label: 'Catena di nuclei', focus: FOCUS.spindle, lit: ['chainFibers', 'chainNuclei', 'endII'],
          info: "Nuclei in singola fila: fibra meno deformabile, a lento adattamento. Rileva l'allungamento e mantiene il tono muscolare.",
        },
        {
          label: 'Fibre Ia', focus: FOCUS.spindle, lit: ['endIa'],
          info: 'Fibre sensitive Ia: si avvolgono a spire attorno alla porzione equatoriale. È la terminazione anulospirale.',
        },
        {
          label: 'Fibre II', focus: FOCUS.spindle, lit: ['endII'],
          info: 'Fibre sensitive II: terminano in vari punti delle fibre a catena. È la terminazione a fiorame.',
        },
        {
          label: 'Fibre gamma', focus: FOCUS.spindle, lit: ['endGamma'],
          info: 'Fibre motorie gamma, fasiche per le fibre a sacco e toniche per quelle a catena: raggiungono le porzioni polari e le fanno contrarre.',
        },
        {
          label: 'Extrafusali', focus: FOCUS.spindle, lit: ['extrafusal', 'endAlpha'],
          info: 'Le fibre extrafusali, innervate dai motoneuroni alfa, corrono parallele al fuso: quando il muscolo si allunga, il fuso si allunga con loro.',
        },
      ],
    }),
  },
  {
    title: 'Il riflesso patellare',
    body:
      "Il colpo del {martelletto|hammer} sull'inserzione distale del {quadricipite femorale|quad} distende passivamente il ventre muscolare e, con esso, la porzione equatoriale delle fibre del {fuso|fuso}. Il potenziale d'azione percorre il ramo periferico del neurone gangliare, il {ganglio|gang} e la {radice dorsale|rpost}; dal corno dorsale raggiunge il corno ventrale ed eccita il {motoneurone alfa|mn}, che contrae il quadricipite: la gamba si estende sulla coscia. È l'unico riflesso monosinaptico. Intanto i collaterali delle fibre sensitive eccitano un {interneurone inibitorio Ia|inia}, che inibisce i motoneuroni alfa del {muscolo antagonista|hams}: è l'inibizione reciproca.",
    terms: {
      hammer: ['hammer', 'patLig'], quad: QUAD, fuso: SPINDLE, gang: ['ganglion', 'ganglionP'], rpost: ['rootPost', 'rootPostP'], mn: ['mnExt'],
      inia: ['inIa'], hams: ['hams', 'mnFlex'],
    },
    quiz: {
      predict: true,
      question: 'Il quadricipite si contrae. E i muscoli posteriori della coscia?',
      options: [
        'Si contraggono anche loro',
        'Vengono rilasciati: i loro motoneuroni alfa sono inibiti',
        'Non ricevono alcun segnale',
        'Si contraggono subito dopo il quadricipite',
      ],
      correct: 1,
      why: [
        "Si opporrebbero all'estensione della gamba.",
        null,
        'Ricevono un segnale inibitorio, da un interneurone.',
        "L'antagonista non si contrae: viene rilasciato.",
      ],
      explain:
        "Un collaterale della fibra Ia eccita un interneurone inibitorio Ia, che inibisce i motoneuroni alfa dell'antagonista: è l'inibizione reciproca.",
      reveal: 2,
    },
    caption: 'Arto inferiore destro, colonna e midollo reali; in alto la sezione lombare ingrandita con i neuroni del circuito. Radici e gangli L2-L4 sono ricostruiti.',
    instruction: 'AVVIA IL RIFLESSO, POI GUARDA IL CIRCUITO NEL MIDOLLO',
    view: { yaw: -0.3 },
    mode: selector({
      base: [...AXIAL, ...LEG, ...QUAD, ...KNEE, 'hams', ...ROOTS, ...FEM, ...SCI, ...SPINDLE, ...PLATE, 'mnExt', 'mnFlex', 'inIa', 'hammer'],
      looks: SOFT,
      idle: 'Un colpo sul legamento rotuleo: la gamba si estende sulla coscia.',
      pick: { hammer: 0, patLig: 0, mnExt: 1, inIa: 2, mnFlex: 2, hams: 3 },
      options: [
        {
          label: 'Riflesso', stepTime: 2.4,
          steps: [
            { ids: ['hammer', 'patLig', 'quadTendon'], text: "Il martelletto colpisce l'inserzione distale del quadricipite." },
            { ids: [...QUAD, ...SPINDLE], text: 'Il ventre muscolare si distende, e con lui la porzione equatoriale del fuso: attivazione passiva.' },
            { ids: ['rfBranch', 'femoral', 'plexus'], links: ['aff1', 'aff2'], text: 'Lo stiramento apre i canali del sodio: il potenziale sale nel ramo periferico del neurone gangliare.' },
            { ids: ['ganglion', 'rootPost'], links: ['aff3'], text: 'Ganglio spinale, ramo centrale, radice dorsale.' },
            { ids: ['postHorn', 'antHorn', 'mnExt', 'rootPostP'], links: ['cIa'], text: 'Dal corno dorsale al corno ventrale: una sola sinapsi, sul motoneurone alfa.' },
            { ids: ['rootAnt', 'rootAntP', 'plexus', 'femoral', 'rfBranch'], links: ['cMnOut', ...EFF], text: "L'assone del motoneurone alfa torna al muscolo con il nervo femorale." },
            { ids: QUAD, activity: { rectus: 1 }, text: 'Il quadricipite si contrae: estensione della gamba sulla coscia.' },
          ],
        },
        {
          label: 'Una sola sinapsi', focus: FOCUS.plate, lit: [...SECTION, 'mnExt', 'rootPostP', 'rootAntP', 'ganglionP'], links: ['cIa', 'cMnOut'],
          labels: { mnExt: 'motoneurone α', ganglionP: 'ganglio' },
          info: 'La fibra Ia entra con la radice dorsale e termina direttamente sul motoneurone alfa del quadricipite, nel corno ventrale.',
        },
        {
          label: 'Inibizione reciproca', focus: FOCUS.plate, stepTime: 2.6,
          labels: { mnExt: 'α quadricipite', inIa: 'Ia' },
          steps: [
            { ids: ['mnExt', 'rootPostP'], links: ['cIa', 'cMnOut'], text: 'La fibra Ia eccita il motoneurone alfa del quadricipite.' },
            { ids: ['inIa'], links: ['cIaColl'], text: 'Un collaterale della stessa fibra eccita un interneurone inibitorio di tipo Ia.' },
            { ids: ['mnFlex'], links: ['cIaFlex'], text: "L'interneurone inibisce i motoneuroni alfa del muscolo antagonista." },
          ],
        },
        {
          label: 'Agonista e antagonista', lit: [...QUAD, 'hams', 'femoral', 'sciatic', 'rfBranch', 'hamBranch'], links: EFF,
          activity: { rectus: 1, hams: -1 },
          info: 'Mentre il quadricipite si contrae, i muscoli posteriori della coscia, flessori della gamba, vengono rilasciati.',
        },
      ],
    }),
  },
  {
    title: "L'organo tendineo del Golgi",
    body:
      "Gli {organi tendinei del Golgi|gto} stanno alla giunzione muscolo-tendinea, in serie con le fibre extrafusali. Le loro {fibre Ib|ib} raggiungono {interneuroni inibitori Ib|inib}, che inibiscono i {motoneuroni alfa|mn} dello stesso muscolo: è il riflesso miotatico inverso, disinaptico, che interviene quando la contrazione minaccia l'integrità del muscolo. Nella coattivazione alfa-gamma una {via discendente|cst} si divide tra i due motoneuroni: per il size-principle si attiva prima il {motoneurone gamma|gamma}, più piccolo, che contrae i {poli del fuso|poli}; la {fibra Ia|ia} così stimolata potenzia il motoneurone alfa, fino alla contrazione massimale.",
    terms: {
      gto: GTO, ib: ['endIb'], inib: ['inIb'], mn: ['mnExt'], cst: ['cst'], gamma: ['mnGamma'], poli: ['endGamma'], ia: ['endIa'],
    },
    quiz: {
      question: 'Nella coattivazione alfa-gamma, quale motoneurone si attiva per primo?',
      options: [
        'Il motoneurone alfa, perché è più grande',
        'Il motoneurone gamma, di calibro minore, per il size-principle',
        "L'interneurone inibitorio Ib",
        'Entrambi nello stesso istante',
      ],
      correct: 1,
      explain: 'Il gamma contrae i poli del fuso; la fibra Ia, stirata, potenzia poi il motoneurone alfa già eccitato dalla via discendente.',
    },
    caption: "L'organo tendineo, ricostruito e ingrandito, è alla giunzione tra il ventre del retto femorale e il tendine del quadricipite (mesh reali).",
    instruction: 'GUARDA IL RECETTORE, POI SEGUI I DUE CIRCUITI',
    view: { yaw: -0.3 },
    mode: selector({
      base: [...AXIAL, ...LEG, ...QUAD, ...KNEE, ...ROOTS, ...FEM, ...SPINDLE, ...GTO, ...PLATE, 'cst', 'mnExt', 'mnGamma', 'inIb'],
      looks: GLASS,
      idle: 'Il fuso è in parallelo con le fibre muscolari, l’organo tendineo in serie: il primo misura la lunghezza, il secondo la tensione.',
      pick: { gtoCollagen: 0, gtoMuscle: 0, endIb: 0, mnGamma: 1, cst: 1, inIb: 2 },
      options: [
        {
          label: 'Organo del Golgi', focus: FOCUS.gto, lit: GTO, labels: { endIb: 'fibra Ib', gtoMuscle: 'fibre muscolari' },
          info: 'In serie tra fibre muscolari e tendine: la contrazione stira il tendine e le terminazioni delle fibre Ib, prevalentemente a fiorame.',
        },
        {
          label: 'Coattivazione α-γ', focus: FOCUS.plate, stepTime: 2.6,
          labels: { mnExt: 'α', cst: 'via discendente' },
          steps: [
            { ids: ['cst'], text: 'Dalla corteccia scende una via motoria che nel midollo si divide in due rami.' },
            { ids: ['mnGamma'], links: ['cCstGamma'], text: 'Size-principle: si eccita per primo il motoneurone gamma, di calibro minore.' },
            { ids: ['rootAntP'], links: ['cGammaOut'], text: 'Il gamma contrae i poli del fuso: la zona equatoriale si distende (attivazione attiva del fuso).' },
            { ids: ['rootPostP', 'mnExt'], links: ['cIa'], text: 'La fibra Ia, stimolata, sinapta con il motoneurone alfa.' },
            { ids: ['mnExt'], links: ['cCstAlpha', 'cMnOut'], text: "L'alfa, già eccitato dalla via discendente, è potenziato: contrazione massimale. Se deve durare, è il gamma loop." },
          ],
        },
        {
          label: 'Miotatico inverso', focus: FOCUS.plate, stepTime: 2.6,
          labels: { mnExt: 'α', inIb: 'interneurone Ib' },
          steps: [
            { ids: ['rootPostP', 'ganglionP'], links: ['cIb'], text: 'La contrazione diventa eccessiva: la fibra Ib entra con la radice dorsale.' },
            { ids: ['inIb'], links: ['cIb'], text: "Eccita l'interneurone inibitorio di tipo Ib: il riflesso è necessariamente disinaptico." },
            { ids: ['mnExt'], links: ['cIbMn'], text: "L'interneurone inibisce il motoneurone alfa dello stesso muscolo: la contrazione cede." },
          ],
        },
        {
          label: 'Dal tendine al midollo', stepTime: 2.4,
          steps: [
            { ids: [...QUAD, 'quadTendon', ...GTO], text: 'Il muscolo si contrae troppo: il tendine si stira.' },
            { ids: ['rfBranch', 'femoral', 'plexus'], links: ['ib1', 'aff2'], text: 'Le fibre Ib risalgono con il nervo femorale.' },
            { ids: ['ganglion', 'rootPost'], links: ['aff3'], text: 'Ganglio spinale e radice dorsale.' },
            { ids: ['inIb', 'mnExt', 'postHorn'], links: ['cIb', 'cIbMn'], text: 'Interneurone inibitorio Ib, poi motoneurone alfa.' },
            { ids: QUAD, activity: { rectus: -1 }, text: 'La contrazione del muscolo è inibita: stiramenti e strappi sono evitati.' },
          ],
        },
      ],
    }),
  },
  {
    title: 'Renshaw, partition cells e CPG',
    body:
      "La {cellula di Renshaw|ren} è un neurone inibitorio (GABA e glicina) della {lamina VII|lam7}. Il {motoneurone alfa|mn}, una volta eccitato, le manda un collaterale e ne riceve inibizione, come i {motoneuroni circostanti|near}: è l'inibizione ricorrente. Al primo resta un'eccitazione minima, gli altri sono silenziati: il movimento si fa frazionato. Le {partition cells|part}, colinergiche, stanno attorno al canale centrale nella {lamina X|lam10}: portano in un antimero un segnale e nell'opposto quello speculare. A cavallo tra le lamine VII e VIII i {CPG|cpg}, catene circolari di interneuroni eccitatori e inibitori, oscillano e fanno lavorare i due lati in alternanza nella deambulazione.",
    terms: { ren: ['renshaw'], lam7: ['lam7'], mn: ['mnExt'], near: ['mnNear'], part: ['partition'], lam10: ['lam10', 'canal'], cpg: ['cpg'] },
    quiz: {
      question: 'Perché nel sonno REM si perde il tono muscolare?',
      options: [
        'Perché le partition cells smettono di scaricare',
        'Perché il sistema reticolo-spinale bulbare eccita le cellule di Renshaw, che inibiscono i motoneuroni alfa tonici',
        'Perché i fusi neuromuscolari si accorciano',
        'Perché i CPG entrano in oscillazione',
      ],
      correct: 1,
      explain: 'La cellula di Renshaw è sotto il controllo di vie discendenti: nel sonno REM la via che la eccita aumenta la propria attività.',
    },
    caption: 'Sezione lombare ingrandita, vista da davanti: contorni di sostanza bianca, corna e fasci sono sezioni vere delle mesh; i neuroni sono ricostruiti.',
    instruction: 'SCEGLI UN CIRCUITO DELLA SOSTANZA GRIGIA',
    view: { yaw: -0.2, focus: FOCUS.plate },
    mode: selector({
      base: [...PLATE, 'lam7', 'lam10', 'retSpin', 'mnExt', 'mnNear', 'renshaw', 'partition', 'cpg', 'mnExtL'],
      idle: 'Tra le fibre che entrano e i motoneuroni che escono, la sostanza grigia contiene circuiti propri.',
      pick: { renshaw: 0, mnNear: 0, retSpin: 1, partition: 2, lam10: 2, cpg: 3 },
      options: [
        {
          label: 'Cellula di Renshaw', stepTime: 2.6,
          labels: { mnExt: 'α', renshaw: 'Renshaw' },
          steps: [
            { ids: ['mnExt', 'rootAntP'], links: ['cMnOut'], text: "Il motoneurone alfa è eccitato: l'assone esce con la radice anteriore." },
            { ids: ['renshaw'], links: ['cMnRen'], text: 'Un collaterale rientra nella sostanza grigia ed eccita la propria cellula di Renshaw.' },
            { ids: ['mnExt'], links: ['cRenMn'], text: "La cellula di Renshaw inibisce il motoneurone che l'ha attivata: gli resta un'eccitazione minima." },
            { ids: ['mnNear'], links: ['cRenNear'], text: 'I motoneuroni circostanti, poco eccitati, sono silenziati del tutto: movimento frazionato.' },
          ],
        },
        {
          label: 'Sonno REM', lit: [...SECTION, 'retSpin', 'renshaw', 'mnExt'], links: ['cRetRen', 'cRenMn'],
          labels: { retSpin: 'reticolo-spinale', renshaw: 'Renshaw' },
          info: 'Nel sonno REM il sistema reticolo-spinale bulbare eccita le cellule di Renshaw: i motoneuroni alfa tonici sono inibiti e il tono muscolare si perde.',
        },
        {
          label: 'Partition cells', lit: [...SECTION, 'partition', 'lam10', 'lam7', 'renshaw', 'mnExt', 'mnExtL'], links: ['cPartExtL', 'cPartCpgL'],
          labels: { partition: 'partition cell', lam10: 'lamina X' },
          info: 'Per il 75% nella lamina X, il resto nella VII: eccitano monosinapticamente motoneuroni e cellule di Renshaw e armonizzano un antimero con l’altro.',
        },
        {
          label: 'CPG', lit: [...SECTION, 'cpg', 'partition', 'lam7'], links: ['cpg0', 'cpg1', 'cpg2', 'cpg0L', 'cpg1L', 'cpg2L', 'cCpgPart', 'cPartCpgL'],
          labels: { cpg: 'CPG' },
          info: 'Cellule pacemaker tengono la rete in oscillazione sotto soglia; afferenze periferiche o vie discendenti la portano sopra soglia e le partition cells smistano il messaggio ai due lati.',
        },
      ],
    }),
  },
  {
    title: 'Il riflesso flesso-estensorio crociato',
    body:
      "Un dolore improvviso a un arto inferiore, per esempio il destro, attiva fibre dolorifiche di piccolo calibro, in genere {di tipo III|pain}. Nell'antimero destro del midollo eccitano in modo diffuso molti motoneuroni: il riflesso è polisegmentario e bilaterale. Sul lato offeso si eccitano i {motoneuroni flessori|mnflex} e si inibiscono gli {estensori|mnext}: piede, gamba e coscia si flettono. Attraverso le {partition cells|part} un segnale speculare passa al lato opposto, dove si eccitano gli {estensori|extL} e si inibiscono i {flessori|flexL}: l'arto si estende e mantiene l'equilibrio. Se il riflesso si innesca più volte si ha la locomozione spinale.",
    terms: {
      pain: ['sciatic', 'rootSac', 'inEx'], mnflex: ['mnFlex', 'hams'], mnext: ['mnExt', ...QUAD], part: ['partition'], extL: ['mnExtL', 'quadL'], flexL: ['mnFlexL', 'hamsL'],
    },
    quiz: {
      question: "Il piede destro calpesta qualcosa che fa male. Che cosa fa l'arto sinistro?",
      options: [
        'Eccitazione dei flessori e inibizione degli estensori',
        'Eccitazione degli estensori e inibizione dei flessori',
        'Inibizione di flessori ed estensori',
        'Nulla: il riflesso è monolaterale',
      ],
      correct: 1,
      why: [
        "Questo accade sul lato offeso.",
        null,
        'Gli estensori sono eccitati, non inibiti.',
        'Il riflesso è bilaterale: passa al lato opposto.',
      ],
      explain: "L'arto opposto si estende per reggere il peso, mentre quello offeso si flette e si allontana dallo stimolo.",
    },
    caption: 'I due arti e il midollo lombare. Per semplicità i motoneuroni di flessori ed estensori stanno sulla stessa sezione; nel vero occupano più segmenti lombo-sacrali.',
    instruction: 'SEGUI IL DOLORE DAL LATO DESTRO AL SINISTRO',
    view: { yaw: -0.3 },
    mode: selector({
      base: [...AXIAL, ...LEG, ...QUAD, ...KNEE, 'hams', ...ROOTS, ...FEM, ...SCI, ...LEFT, ...PLATE, 'lam10',
        'mnExt', 'mnFlex', 'inEx', 'inInh', 'partition', 'mnExtL', 'mnFlexL', 'inInhL'],
      idle: 'Lato offeso: flessione. Lato opposto: estensione.',
      options: [
        {
          label: 'Lato offeso', stepTime: 2.5,
          steps: [
            { ids: ['sciatic'], links: ['pain1', 'pain2'], text: 'Fibre dolorifiche di tipo III risalgono dal piede destro.' },
            { ids: ['rootSac', 'postHorn', 'inEx'], links: ['pain3', 'cPain'], text: "Entrano nell'antimero destro e si distribuiscono a più neuromeri lombo-sacrali." },
            { ids: ['mnFlex', 'inInh', 'mnExt'], links: ['cExFlex', 'cExInh', 'cInhExt'], text: 'Eccitazione dei motoneuroni flessori, inibizione degli estensori.' },
            { ids: ['rootSac', 'sciatic', 'hamBranch'], links: ['cFlexOut', 'flex1', 'flex2'], text: 'Il comando scende con il nervo ischiatico ai flessori.' },
            { ids: ['hams', ...QUAD], activity: { hams: 1, rectus: -1 }, text: "L'arto destro si flette: piede sulla gamba, gamba sulla coscia, coscia sul bacino." },
          ],
        },
        {
          label: 'Lato opposto', stepTime: 2.5,
          steps: [
            { ids: ['inEx', 'partition', 'lam10'], links: ['cPain', 'cExPart'], text: 'Il segnale raggiunge le partition cells, attorno al canale centrale.' },
            { ids: ['mnExtL', 'inInhL', 'mnFlexL'], links: ['cPartExtL', 'cPartInhL', 'cInhFlexL'], text: "Nell'antimero sinistro il segnale è speculare: estensori eccitati, flessori inibiti." },
            { ids: ['rootsL', 'plexusL', 'femoralL'], links: ['cExtLOut', 'extL1', 'extL2', 'extL3'], text: 'Il comando scende con il nervo femorale sinistro al quadricipite.' },
            { ids: ['quadL', 'hamsL'], activity: { quadL: 1, hamsL: -1 }, text: "L'arto sinistro si estende e regge il peso: l'equilibrio è mantenuto." },
          ],
        },
        {
          label: 'Nel midollo', focus: FOCUS.plate,
          lit: [...SECTION, 'inEx', 'mnFlex', 'inInh', 'mnExt', 'partition', 'mnExtL', 'inInhL', 'mnFlexL', 'rootPostP'],
          links: ['cPain', 'cExFlex', 'cExInh', 'cInhExt', 'cExPart', 'cPartExtL', 'cPartInhL', 'cInhFlexL'],
          labels: { mnExt: 'estensori –', mnExtL: 'estensori +', partition: 'partition cell', inEx: 'fibra III' },
          info: 'A destra (lato offeso) flessori eccitati ed estensori inibiti; a sinistra il contrario, attraverso le partition cells.',
        },
        {
          label: 'Locomozione spinale', lit: ['hams', ...QUAD, 'quadL', 'hamsL', 'sciatic', 'femoralL'],
          links: ['flex2', 'extL3'], activity: { hams: 1, rectus: -1, quadL: 1, hamsL: -1 },
          info: 'Un arto si flette mentre l’altro si estende: se il riflesso si innesca più volte, alternando i lati, si ha la deambulazione sul posto.',
        },
      ],
    }),
  },
];

export default {
  id: 'riflessi',
  title: 'Riflessi',
  blurb: 'Fuso neuromuscolare, organo del Golgi e i circuiti riflessi del midollo.',
  part: 'Midollo e nervi spinali',
  order: 16,
  model: 'riflessi',
  createModel: () => new Riflessi(),
  yaw: -0.6,
  spreads,
};
