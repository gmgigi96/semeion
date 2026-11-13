// Capitolo "Sistema nervoso vegetativo". Testi dagli appunti di neuroanatomia (SNV).
import { selector } from '../modes.js';
import { SistemaNervosoVegetativo, at } from '../models/sistema-nervoso-vegetativo.js';

const STEM = ['midbrain', 'pons', 'medulla'];
const SPINE = ['spineC', 'spineT', 'spineL', 'sacrum'];
const TRUNK = ['trunkC', 'trunkT', 'trunkL', 'trunkS'];
const PARAVERT = ['gSCG', 'gMCG', 'gStell', 'gThor', 'gLumb', 'gSacr', 'gImpar'];
const PREVERT = ['gCeliac', 'gSMG', 'gAortRen', 'gIMG'];
const SPLANCHNIC = ['splGreat', 'splLesser', 'splLeast', 'splLumb'];
const PELVIC = ['plexInterm', 'plexHypoSup', 'nHypo'];
const RAMI = ['ramiWhite', 'ramiGrey'];
const AORTA = ['aortaThor', 'aortaAbd', 'celiacTrunk', 'sma', 'ima', 'renalA', 'iliac'];
const NUCLEI = ['nucEW', 'nucLac', 'nucSalSup', 'nucSalInf', 'nucAmb', 'nucDors'];
const HEAD_GANGLIA = ['gCiliare', 'gSfenopal', 'gSottomand', 'gOtico'];
const HEAD_PRE = ['nIII', 'radBreve', 'intermedio', 'petroso', 'corda', 'nIX', 'timpanico'];
const HEAD_POST = ['ciliariBrevi', 'postLacr', 'postSaliv', 'postParot'];
const VAGUS = ['vagR', 'vagL'];
const GLANDS = ['lacrimal', 'parotid', 'submandibular', 'sublingual'];
const EYE = ['sclera', 'iris'];
const ORTHO = ['iml', ...TRUNK, ...PARAVERT, ...RAMI, ...SPLANCHNIC, ...PREVERT, ...PELVIC, 'plexCarot'];
const PARASYM = [...NUCLEI, ...HEAD_PRE, ...HEAD_GANGLIA, ...HEAD_POST, ...VAGUS, 'vagGastric', 'nucSacral', 'pelvSpl', 'plexHypoInf'];

// Primi piani del motore su un punto dato in mm della sorgente (verso destra,
// verso dietro, quota), ingrandito di `scale` e portato a quota `height`. Ciò che
// esce dal volume della pagina viene tagliato: centro e ingrandimento sono scelti
// in modo che il tratto di cui si parla ci stia tutto.
const closeUp = (c, scale, height = 0.36) => ({ at: at(...c), scale, height });
const CLOSE = {
  segment: closeUp([15, 58, 1322], 8.5, 0.4),
  cerv: closeUp([8, 6, 1490], 3.6), thor: closeUp([0, 40, 1288], 1.75), lumb: closeUp([0, 5, 1060], 3.1, 0.38), pelv: closeUp([0, 45, 915], 4, 0.34),
  abdomen: closeUp([0, 12, 1205], 2), near: closeUp([6, -8, 1138], 5.6), toPelvis: closeUp([0, 12, 958], 2.8),
  eye: closeUp([17, -32, 1597], 6.4, 0.42), tear: closeUp([25, -24, 1588], 6.4, 0.42), saliva: closeUp([26, -16, 1552], 5.6, 0.42), parotid: closeUp([30, -4, 1570], 7, 0.42),
  vagusNuclei: closeUp([5, 10, 1500], 2.6), vagus: closeUp([-4, 0, 1352], 1.85, 0.42), sacral: closeUp([4, 30, 955], 2.8),
};

const spreads = [
  {
    title: 'Due neuroni in serie',
    body:
      "Sia l'{ortosimpatico|orto} sia il {parasimpatico|para} veicolano lo stimolo dalla fibra pregangliare al {ganglio di riferimento|gangli} rilasciando acetilcolina, che nel ganglio attiva recettori nicotinici N1. Sul versante postgangliare l'ortosimpatico rilascia noradrenalina, con un'eccezione: muscoli erettori dei peli e ghiandole sudoripare sono stimolati da acetilcolina. Il parasimpatico rilascia acetilcolina. I neuroni ortosimpatici stanno nella {colonna intermedio-laterale|iml} del midollo, da C8 a L2; quelli parasimpatici principalmente nel {tronco encefalico|stem}, nei nuclei di quattro nervi encefalici, e nel midollo soltanto {da S2 a S4|sacral}.",
    terms: {
      orto: ORTHO, para: PARASYM, gangli: [...PARAVERT, ...PREVERT, ...HEAD_GANGLIA], iml: ['iml'], stem: [...STEM, ...NUCLEI], sacral: ['nucSacral', 'pelvSpl'],
    },
    quiz: {
      question: 'Quale mediatore rilascia la fibra pregangliare sul ganglio, nei due sistemi?',
      options: ['Noradrenalina in entrambi', 'Acetilcolina in entrambi', "Noradrenalina nell'ortosimpatico, acetilcolina nel parasimpatico", 'Adrenalina in entrambi'],
      correct: 1,
      explain: "La differenza è sul versante postgangliare: noradrenalina per l'ortosimpatico, acetilcolina per il parasimpatico.",
    },
    caption: 'Dal mesencefalo al coccige: ossa, visceri, vasi, encefalo e midollo sono mesh reali (Z-Anatomy); catena, gangli e plessi ricostruiti.',
    instruction: 'SCEGLI UN SISTEMA · TRASCINA IL MODELLO PER RUOTARLO',
    view: { yaw: -0.5, zoom: 1.12 },
    mode: selector({
      base: ['skull', ...SPINE, 'ribs', 'hip', ...STEM, 'cord', ...ORTHO, ...PARASYM, ...EYE, ...GLANDS, 'heart', 'trachea', 'stomach', 'kidney', 'adrenal', 'bladder', 'rectum', ...AORTA],
      looks: {
        heart: { opacity: 0.3 }, stomach: { opacity: 0.35 }, trachea: { opacity: 0.4 }, bladder: { opacity: 0.45 }, rectum: { opacity: 0.4 }, kidney: { opacity: 0.5 },
        aortaThor: { opacity: 0.45 }, aortaAbd: { opacity: 0.45 }, iliac: { opacity: 0.45 }, spineC: { opacity: 0.8 },
      },
      pick: { iml: 0, trunkT: 0, trunkL: 0, gThor: 0, gLumb: 0, gCeliac: 0, splGreat: 0, vagR: 1, vagL: 1, nIII: 1, pelvSpl: 1 },
      idle: 'Arancio e rosso: ortosimpatico. Blu e azzurro: parasimpatico.',
      options: [
        { label: 'Ortosimpatico', lit: ORTHO, info: 'Neuroni pregangliari nel midollo, da C8 a L2. Gangli nella catena limitante, ai lati della colonna, e davanti all’aorta. Mediatore postgangliare: noradrenalina.' },
        { label: 'Parasimpatico', lit: PARASYM, info: 'Neuroni pregangliari nel tronco encefalico (nervi III, VII, IX e X) e nel midollo da S2 a S4. Gangli presso l’organo o intramurali. Mediatore: acetilcolina.' },
        { label: 'Gangli', lit: [...PARAVERT, ...PREVERT, ...HEAD_GANGLIA, 'plexHypoInf'], info: 'Nel ganglio la fibra pregangliare colinergica contatta il neurone gangliare, su recettori nicotinici N1, e la cellula SIF, ricca di catecolamine.' },
      ],
    }),
  },
  {
    title: 'Dal midollo alla catena',
    body:
      "I neuroni ortosimpatici stanno nella {colonna intermedio-laterale|iml} di Coppo-Terni (lamina VII). I loro assoni, mielinici di tipo B, partecipano alla {radice ventrale|root} del {nervo spinale|nerve} e ne escono con il {ramo comunicante bianco|white}, che raggiunge il {ganglio paravertebrale|gang} della {catena limitante|trunk}. Qui la fibra pregangliare sinapta con i neuroni gangliari; le fibre postgangliari, amieliniche di tipo C, formano il {ramo comunicante grigio|grey}, che rientra nel nervo spinale e raggiunge la periferia corporea. Poiché i neuroni radicolari stanno solo da C8 a L2, altre fibre usano i tronchi intermedi per portarsi cranialmente o caudalmente in altri gangli.",
    terms: { iml: ['iml'], root: ['rootAnt'], nerve: ['icn'], white: ['ramiWhite'], gang: ['gThor'], trunk: ['trunkT'], grey: ['ramiGrey'] },
    quiz: {
      question: 'Per quale via la fibra pregangliare ortosimpatica lascia il nervo spinale?',
      options: ['Il ramo comunicante grigio', 'Il ramo comunicante bianco', 'La radice dorsale', 'Il nervo splancnico'],
      correct: 1,
      explain: 'Il ramo grigio riporta invece al nervo spinale le fibre postgangliari, amieliniche.',
    },
    caption: 'Il sesto segmento toracico, da destra. Midollo, radici, nervi, vertebre e coste reali; gangli e rami comunicanti ricostruiti.',
    instruction: 'SEGUI UNA FIBRA PREGANGLIARE NEI SUOI TRE DESTINI',
    view: { yaw: -0.75, focus: CLOSE.segment },
    mode: selector({
      base: ['spineT', 'ribs', 'cord', 'hornAnt', 'iml', 'rootAnt', 'rootPost', 'drg', 'icn', 'trunkT', 'gThor', ...RAMI, 'splGreat'],
      looks: { spineT: { opacity: 0.22 }, ribs: { opacity: 0.3 }, cord: { opacity: 0.5 }, hornAnt: { opacity: 0.55 } },
      pick: { iml: 0, ramiWhite: 3, ramiGrey: 3, trunkT: 1, splGreat: 2, gThor: 0 },
      idle: 'Rosso: colonna intermedio-laterale. Giallo: rami bianchi. Grigio: rami grigi. Arancio: catena con i suoi gangli.',
      options: [
        {
          label: 'Stesso livello', stepTime: 2.4,
          steps: [
            { ids: ['iml'], text: 'Il neurone pregangliare sta nella colonna intermedio-laterale' },
            { ids: ['rootAnt', 'icn'], text: 'L’assone, mielinico di tipo B, esce con la radice ventrale' },
            { ids: ['ramiWhite'], links: ['fPre'], text: 'Lascia il nervo spinale con il ramo comunicante bianco' },
            { ids: ['gThor'], text: 'Nel ganglio paravertebrale sinapta con il neurone gangliare' },
            { ids: ['ramiGrey', 'icn'], links: ['fPost'], text: 'La fibra postgangliare, amielinica di tipo C, rientra nel nervo con il ramo grigio' },
          ],
        },
        {
          label: 'Sale o scende', stepTime: 2.4,
          steps: [
            { ids: ['iml', 'rootAnt', 'ramiWhite'], links: ['fPre'], text: 'La fibra pregangliare entra nella catena con il ramo bianco' },
            { ids: ['trunkT'], links: ['fUp', 'fDown'], text: 'Usa i tronchi intermedi per portarsi cranialmente o caudalmente' },
            { ids: ['gThor'], text: 'Sinapta in un ganglio di un altro livello: così l’innervazione raggiunge tutta la periferia' },
          ],
        },
        {
          label: 'Nervo splancnico', stepTime: 2.4,
          steps: [
            { ids: ['iml', 'rootAnt', 'ramiWhite'], links: ['fPre'], text: 'La fibra pregangliare entra nella catena con il ramo bianco' },
            { ids: ['gThor'], text: 'Attraversa il ganglio senza contrarre sinapsi' },
            { ids: ['splGreat'], links: ['fSpl'], text: 'Esce come nervo splancnico: farà sinapsi in un ganglio prevertebrale' },
          ],
        },
        { label: 'Bianco e grigio', lit: RAMI, info: 'Giallo, ramo bianco: fibre pregangliari mieliniche, dal nervo al ganglio. Grigio, ramo grigio: fibre postgangliari amieliniche, dal ganglio al nervo.' },
      ],
    }),
  },
  {
    title: 'La catena limitante',
    body:
      "La {catena limitante|chain} si estende dalla base cranica fino al coccige: gangli uniti da tronchi intermedi. Nell'embrione ci sono 31 paia di gangli; gli otto cervicali si fondono in tre. Il {superiore|scg}, il più cospicuo, sta sotto la base cranica, vicino alla {carotide interna|car}, all'altezza di C2-C3; il {medio|mcg} a livello di C6; l'{inferiore|st}, spesso fuso con il primo toracico nel ganglio stellato, poggia sul collo della prima costa. Seguono i {gangli toracici|thor}, 11 nel 70% dei casi, e i {lombari|lumb}, 4-5, che si spostano davanti al corpo vertebrale. I quattro {sacrali|sacr} convergono sul {ganglio coccigeo|imp}, impari e mediano.",
    terms: { chain: [...TRUNK, ...PARAVERT], scg: ['gSCG'], car: ['carotid'], mcg: ['gMCG'], st: ['gStell'], thor: ['gThor'], lumb: ['gLumb'], sacr: ['gSacr'], imp: ['gImpar'] },
    quiz: {
      question: 'Come si chiama il ganglio nato dalla fusione del cervicale inferiore con il primo toracico?',
      options: ['Ganglio celiaco', 'Ganglio stellato', 'Ganglio coccigeo', 'Ganglio cervicale medio'],
      correct: 1,
      explain: 'Poggia sul collo della prima costa, dietro la cupola pleurica e l’arteria succlavia (fossa del Sebileau).',
    },
    caption: 'La catena dei due lati, ricostruita su vertebre e coste reali: i gangli toracici stanno sulle teste delle coste.',
    instruction: 'SCEGLI UN TRATTO DELLA CATENA (ANCHE CLICCANDO UN GANGLIO)',
    view: { yaw: -0.55, zoom: 1.1 },
    mode: selector({
      base: ['skull', ...SPINE, 'ribs', 'hip', ...TRUNK, ...PARAVERT, 'carotid', 'subclavian'],
      looks: { carotid: { opacity: 0.55 }, subclavian: { opacity: 0.55 } },
      pick: { gSCG: 0, gMCG: 0, gStell: 0, trunkC: 0, gThor: 1, trunkT: 1, gLumb: 2, trunkL: 2, gSacr: 3, gImpar: 3, trunkS: 3 },
      idle: 'Rosso: i gangli paravertebrali. Arancio: i tronchi intermedi che li uniscono.',
      options: [
        { label: 'Cervicale', focus: CLOSE.cerv, show: ['ansa', 'plexCarot'], lit: ['trunkC', 'gSCG', 'gMCG', 'gStell', 'ansa', 'plexCarot'], labels: { gSCG: 'superiore', gMCG: 'medio', gStell: 'stellato' },
          info: 'Tre gangli. L’ansa succlavia del Vieussens unisce l’inferiore al medio aggirando anteriormente l’arteria succlavia; dal superiore nasce il plesso pericarotideo interno.' },
        { label: 'Toracica', focus: CLOSE.thor, show: RAMI, lit: ['trunkT', 'gThor', 'gStell', ...RAMI],
          info: 'Dall’apertura superiore del torace al diaframma. Con il ramo grigio le fibre entrano nei nervi intercostali; altri rami vanno ai visceri toracici e all’avventizia dell’aorta.' },
        { label: 'Lombare', focus: CLOSE.lumb, show: [...RAMI, 'aortaAbd', 'iliac'], lit: ['trunkL', 'gLumb'], info: 'La catena addominale comprende 4-5 gangli: nella colonna lombare si spostano anteriormente al corpo vertebrale.' },
        { label: 'Pelvica', focus: CLOSE.pelv, lit: ['trunkS', 'gSacr', 'gImpar'], labels: { gImpar: 'ganglio coccigeo' },
          info: 'Quattro gangli sacrali e uno coccigeo: le due catene convergono sui lati della faccia anteriore del sacro e terminano sul coccige.' },
      ],
    }),
  },
  {
    title: 'Splancnici e gangli prevertebrali',
    body:
      "Alcune fibre pregangliari non contraggono sinapsi nella catena e danno origine ai nervi splancnici. Il {grande splancnico|great}, da T5 a T10, termina nella maggior parte dei casi nel {ganglio celiaco|cel}; il {piccolo splancnico|lesser}, da T10-T11, si porta al {mesenterico superiore|smg}; lo {splancnico minimo|least}, da T12, giunge al {ganglio reno-aortico|ar}; gli {splancnici lombari|lumb}, da L1 e L2, raggiungono il {mesenterico inferiore|img}. Sono i gangli prevertebrali o preaortici, davanti all'{aorta addominale|aorta}, in corrispondenza dell'origine dei suoi rami viscerali. Il ganglio celiaco è semilunare; dalla sua convessità il {plesso celiaco|plex} si diparte a raggi, tanto da essere detto plesso solare.",
    terms: {
      great: ['splGreat'], cel: ['gCeliac'], lesser: ['splLesser'], smg: ['gSMG'], least: ['splLeast'], ar: ['gAortRen'], lumb: ['splLumb'], img: ['gIMG'], aorta: ['aortaAbd'], plex: ['plexCeliac'],
    },
    quiz: {
      question: 'Dove termina, nella maggior parte dei casi, il nervo grande splancnico?',
      options: ['Nel ganglio stellato', 'Nel ganglio celiaco', 'Nel ganglio mesenterico inferiore', 'Nel ganglio coccigeo'],
      correct: 1,
      explain: 'Può terminare anche nel ganglio aortico-renale o nel mesenterico superiore.',
    },
    caption: 'Colonna, aorta con i suoi rami, reni e surreni reali; nervi splancnici, gangli e plessi preaortici ricostruiti su di essi.',
    instruction: 'SCEGLI UN NERVO SPLANCNICO O SEGUI I PLESSI FINO ALLA PELVI',
    view: { yaw: -0.5, focus: CLOSE.abdomen },
    mode: selector({
      base: [...SPINE.slice(1), 'ribs', 'hip', ...AORTA, 'kidney', 'adrenal', 'trunkT', 'trunkL', 'trunkS', 'gThor', 'gLumb', 'gSacr', 'gImpar', ...SPLANCHNIC, ...PREVERT, 'plexCeliac', ...PELVIC],
      looks: { kidney: { opacity: 0.75 }, bladder: { opacity: 0.5 }, rectum: { opacity: 0.45 } },
      pick: { splGreat: 0, gCeliac: 0, splLesser: 1, gSMG: 1, splLeast: 2, gAortRen: 2, splLumb: 3, gIMG: 3, adrenal: 5, plexHypoSup: 6, nHypo: 6, plexInterm: 6 },
      idle: 'Ocra: nervi splancnici. Rosso scuro: gangli prevertebrali, attorno all’origine dei rami viscerali dell’aorta.',
      options: [
        { label: 'Grande', lit: ['splGreat', 'gCeliac', 'gThor'], labels: { gCeliac: 'gangli celiaci' }, info: 'Fibre pregangliari da T5 a T10, fino al ganglio celiaco: milza, fegato, stomaco, porzione sovramesocolica di pancreas e duodeno.' },
        { label: 'Piccolo', lit: ['splLesser', 'gSMG', 'gThor'], labels: { gSMG: 'mesenterico superiore' }, info: 'Fibre pregangliari da T10 a T11: attraversa il ganglio celiaco e si porta al mesenterico superiore, per la porzione sottomesocolica dell’addome.' },
        { label: 'Minimo', lit: ['splLeast', 'gAortRen', 'gThor'], labels: { gAortRen: 'reno-aortici' }, info: 'Fibre pregangliari da T12: giunge al ganglio reno-aortico, per l’apparato iuxtaglomerulare del rene e il surrene.' },
        { label: 'Lombari', lit: ['splLumb', 'gIMG', 'gLumb'], labels: { gIMG: 'mesenterico inferiore' }, info: 'Da L1 e L2 raggiungono il ganglio mesenterico inferiore, per innervare la cavità pelvica.' },
        { label: 'Ansa di Wrisberg', focus: CLOSE.near, show: ['vagCeliac', 'vagR', 'oesophagus'], lit: ['gCeliac', 'splGreat', 'vagCeliac', 'vagR'],
          info: 'Ganglio celiaco destro: all’angolo supero-laterale giunge il grande splancnico, al supero-mediale il ramo celiaco del vago. È l’ansa memorabile di Wrisberg.' },
        { label: 'Surrene', focus: CLOSE.near, lit: ['gAortRen', 'adrenal', 'splLeast'], links: ['toAdrenal'],
          info: 'Dal ganglio reno-aortico fibre pregangliari raggiungono la midollare del surrene, le cui cellule secernono adrenalina e noradrenalina; fibre postgangliari vanno alla corticale.' },
        { label: 'Verso la pelvi', focus: CLOSE.toPelvis, show: ['plexHypoInf', 'bladder', 'rectum'], lit: [...PELVIC, 'plexHypoInf', 'gIMG'],
          info: 'Plesso intermesenterico, poi ipogastrico superiore, che davanti al sacro si continua nei due nervi ipogastrici: questi formano il plesso ipogastrico inferiore o pelvico.' },
      ],
    }),
  },
  {
    title: 'Parasimpatico: cranico e sacrale',
    body:
      "Nel tronco encefalico i neuroni parasimpatici formano la colonna efferente viscerale. Il {nucleo di Edinger e Westphal|ew}, annesso all'oculomotore, ha come ganglio di riferimento il {ciliare|cil}; il {nucleo lacrimatorio|lac}, annesso al faciale, lo {sfeno-palatino|spg}; il {salivatorio superiore|ss}, anch'esso del faciale, il {sottomandibolare|smg}; il {salivatorio inferiore|si}, annesso al glossofaringeo, l'{otico|otic}. {Nucleo ambiguo|amb} e {nucleo dorsale motore del vago|dors} hanno gangli intramurali, nei visceri toracici e addominali. Nel midollo il parasimpatico è limitato ai segmenti {S2-S4|sac}: fibre pregangliari per {vescica|bladder}, organi genitali, colon discendente, colon pelvico e {retto|rectum}.",
    terms: {
      ew: ['nucEW'], cil: ['gCiliare'], lac: ['nucLac'], spg: ['gSfenopal'], ss: ['nucSalSup'], smg: ['gSottomand'], si: ['nucSalInf'], otic: ['gOtico'],
      amb: ['nucAmb'], dors: ['nucDors'], sac: ['nucSacral', 'pelvSpl'], bladder: ['bladder'], rectum: ['rectum'],
    },
    quiz: {
      question: 'Qual è il ganglio di riferimento del nucleo salivatorio inferiore?',
      options: ['Il ganglio ciliare', 'Il ganglio sfeno-palatino', 'Il ganglio sottomandibolare', 'Il ganglio otico'],
      correct: 3,
      explain: 'Dal ganglio otico, nella fossa infratemporale, le fibre postgangliari raggiungono la parotide con il nervo auricolo-temporale.',
    },
    caption: 'Nuclei, nervi III e IX, occhio, ghiandole e visceri reali; gangli e tratti intermedi ricostruiti. Nella testa, solo il lato destro.',
    instruction: 'SCEGLI UN NERVO E SEGUILO DAL NUCLEO ALL’ORGANO',
    view: { yaw: -0.85 },
    mode: selector({
      base: ['skull', ...STEM, ...NUCLEI, 'cord', ...SPINE, 'hip', ...EYE, ...GLANDS, 'optic', ...HEAD_PRE, ...HEAD_GANGLIA, ...HEAD_POST, 'lingual', ...VAGUS, 'vagGastric', 'heart', 'trachea', 'stomach',
        'nucSacral', 'pelvSpl', 'plexHypoInf', 'bladder', 'rectum'],
      looks: {
        spineC: { opacity: 0.25 }, spineT: { opacity: 0.25 }, spineL: { opacity: 0.25 }, sacrum: { opacity: 0.3 }, heart: { opacity: 0.4 }, stomach: { opacity: 0.55 }, trachea: { opacity: 0.6 },
        bladder: { opacity: 0.6 }, rectum: { opacity: 0.45 }, sclera: { opacity: 0.75 }, parotid: { opacity: 0.8 },
      },
      pick: { nucEW: 0, nIII: 0, gCiliare: 0, nucLac: 1, petroso: 1, gSfenopal: 1, nucSalSup: 2, corda: 2, gSottomand: 2, nucSalInf: 3, nIX: 3, gOtico: 3, vagR: 4, vagL: 4, nucSacral: 5, pelvSpl: 5, bladder: 5 },
      idle: 'Blu: fibre pregangliari. Blu scuro: gangli. Azzurro: fibre postgangliari.',
      options: [
        {
          label: 'III · pupilla', focus: CLOSE.eye, stepTime: 2.6,
          steps: [
            { ids: ['nucEW', 'nIII'], text: 'Dal nucleo di Edinger e Westphal le fibre decorrono nell’oculomotore fino all’orbita' },
            { ids: ['radBreve', 'gCiliare'], text: 'Dal ramo inferiore nasce la radice breve, che sinapta nel ganglio ciliare' },
            { ids: ['ciliariBrevi', 'sclera', 'iris'], text: 'Nervi ciliari brevi, attraverso la sclera: sfintere della pupilla (da 8 a 1 mm) e muscolo ciliare' },
            { ids: ['plexCarot', 'gSCG', 'carotid'], text: 'Ortosimpatico: dal ganglio cervicale superiore fibre attraversano il ganglio ciliare senza interrompersi, per il dilatatore della pupilla' },
          ],
        },
        {
          label: 'VII · lacrime', focus: CLOSE.tear, stepTime: 2.6,
          steps: [
            { ids: ['nucLac', 'intermedio', 'gGenic'], text: 'Dal nucleo lacrimatorio, con il nervo intermedio di Wrisberg, fino al ganglio genicolato' },
            { ids: ['petroso'], text: 'Nervo grande petroso superficiale; con il petroso profondo forma il nervo vidiano' },
            { ids: ['gSfenopal'], text: 'Sinapsi nel ganglio sfeno-palatino, sulla volta della fossa pterigo-palatina' },
            { ids: ['postLacr', 'lacrimal'], text: 'Con il nervo zigomatico e il nervo lacrimale alla ghiandola lacrimale; altri rami a ghiandole palatine e nasali' },
          ],
        },
        {
          label: 'VII · saliva', focus: CLOSE.saliva, stepTime: 2.6,
          steps: [
            { ids: ['nucSalSup', 'intermedio', 'gGenic'], text: 'Dal nucleo salivatorio superiore, con il nervo intermedio, nel faciale' },
            { ids: ['corda'], text: 'Nel terzo tratto si stacca la corda del timpano, che attraversa la cassa del timpano' },
            { ids: ['lingual', 'gSottomand'], text: 'Si unisce ad angolo acuto al nervo linguale e raggiunge il ganglio sottomandibolare' },
            { ids: ['postSaliv', 'submandibular', 'sublingual'], text: 'Fibre postgangliari per le ghiandole sottomandibolare e sottolinguale' },
          ],
        },
        {
          label: 'IX · parotide', focus: CLOSE.parotid, stepTime: 2.6,
          steps: [
            { ids: ['nucSalInf', 'nIX'], text: 'Dal nucleo salivatorio inferiore, con il glossofaringeo, attraverso il forame lacero posteriore' },
            { ids: ['timpanico'], text: 'Nervo timpanico, plesso timpanico, poi nervo piccolo petroso superficiale' },
            { ids: ['gOtico'], text: 'Sinapsi nel ganglio otico, nella fossa infratemporale' },
            { ids: ['postParot', 'parotid'], text: 'Con il nervo auricolo-temporale alla parotide: secrezione di saliva e vasodilatazione; l’ortosimpatico la inibisce' },
          ],
        },
        {
          label: 'X · visceri', focus: CLOSE.vagus, show: ['oesophagus', 'gThor', 'trunkT', 'trunkC', 'gMCG', 'gStell', 'lungs'], stepTime: 2.6,
          steps: [
            { ids: ['nucAmb', 'nucDors', 'vagR', 'vagL'], focus: CLOSE.vagusNuclei, text: 'Nucleo ambiguo per i visceri toracici, nucleo dorsale motore per quelli addominali' },
            { ids: ['vagCard', 'symCard', 'cardPlex', 'heart'], text: 'Plesso cardiaco: i nervi cardiaci del vago si fondono con i nervi cardiaci ortosimpatici' },
            { ids: ['plexPulm', 'symPulm', 'trachea'], text: 'Plesso polmonare: il parasimpatico dà broncocostrizione e ipersecrezione, l’ortosimpatico broncodilatazione' },
            { ids: ['vagGastric', 'stomach'], text: 'Plessi gastrici anteriore e posteriore: i gangli sono intramurali' },
          ],
        },
        {
          label: 'Sacrale', focus: CLOSE.sacral, show: ['nHypo'], stepTime: 2.6,
          steps: [
            { ids: ['nucSacral', 'cord'], links: ['sacralPre'], text: 'Neuroni nella colonna intermedio-laterale, solo da S2 a S4' },
            { ids: ['pelvSpl'], text: 'Fibre pregangliari dirette all’organo: il ganglio periferico sta subito prima' },
            { ids: ['plexHypoInf', 'nHypo'], text: 'Entrano nel plesso pelvico, che riceve le fibre ortosimpatiche dal nervo ipogastrico' },
            { ids: ['plexPelvRami', 'bladder', 'rectum'], text: 'Vescica: minzione. Genitali: vasodilatazione. Colon discendente, pelvico e retto: peristalsi' },
          ],
        },
      ],
    }),
  },
];

export default {
  id: 'sistema-nervoso-vegetativo',
  title: 'Sistema nervoso vegetativo',
  blurb: 'Ortosimpatico e parasimpatico: due neuroni in serie, catena limitante, gangli prevertebrali, nuclei cranici e sacrali.',
  part: 'Sistema vegetativo',
  order: 60,
  model: 'sistema-nervoso-vegetativo',
  createModel: () => new SistemaNervosoVegetativo(),
  zoom: 1,
  yaw: -0.5,
  spreads,
};
