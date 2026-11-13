// Elementi di pagina costruiti come geometria nella scena (niente DOM):
// testo, termini evidenziati, pulsanti, quiz. Tutto vive in coordinate di
// pagina: origine in alto a sinistra, x verso destra, y verso il basso (negativa).
import * as THREE from 'three';
import { Text, getSelectionRects } from 'troika-three-text';

// EB Garamond (SIL Open Font License, vedi public/fonts/OFL-EBGaramond.txt).
export const FONT = {
  regular: `${import.meta.env.BASE_URL}fonts/EBGaramond-Regular.ttf`,
  italic: `${import.meta.env.BASE_URL}fonts/EBGaramond-Italic.ttf`,
  semi: `${import.meta.env.BASE_URL}fonts/EBGaramond-SemiBold.ttf`,
  bold: `${import.meta.env.BASE_URL}fonts/EBGaramond-Bold.ttf`,
};
// Il Garamond ha l'occhio piccolo: a parità di corpo sembra più minuto del Noto
// per cui erano pensate le misure. Tutti i testi passano da qui.
export const FONT_SCALE = 1.06;
export const INK = 0x2a2520;
export const INK_SOFT = 0x7a7166;
export const ACCENT = 0x9c3d1f;
export const MARKER = 0xf0c24a;
export const GOOD = 0x2f7d4f;
export const BAD = 0xb23a2a;
const PEN = 0x2c3e66; // l'inchiostro blu degli inviti a mano («tocca…», «rifai»)

// Quote sopra la carta, per evitare z-fighting.
const Z_FILL = 0.0008;
const Z_TEXT = 0.0016;

export function makeText(str, opts = {}) {
  const t = new Text();
  Object.assign(t, {
    text: str,
    font: FONT.regular,
    fontSize: 0.03,
    color: INK,
    anchorX: 'left',
    anchorY: 'top',
    ...opts,
  });
  t.fontSize *= FONT_SCALE;
  t.position.z = Z_TEXT;
  t.renderOrder = 4;
  t.frustumCulled = false; // altrimenti un testo mai misurato non verrebbe mai disegnato
  return t;
}

export const ready = (t) => new Promise((r) => t.sync(r));

export function bounds(t) {
  const [x0, y0, x1, y1] = t.textRenderInfo.blockBounds;
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return new THREE.ShapeGeometry(s, 6);
}

// Tutto ciò che sta sulla carta è complanare: l'ordine di disegno è esplicito
// (renderOrder) invece che affidato alla profondità.
const flat = (color, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
const layer = (obj, n) => ((obj.renderOrder = n), obj);

// --- Paragrafo con termini evidenziati -------------------------------------
// Sintassi: "testo {termine visibile|chiave} testo". Ogni termine diventa una
// zona sensibile; onTerm(chiave, attivo) viene chiamata al passaggio.
export async function richText(markup, opts, onTerm) {
  const terms = [];
  let plain = '';
  let last = 0;
  for (const m of markup.matchAll(/\{([^|}]+)\|([^}]+)\}/g)) {
    plain += markup.slice(last, m.index);
    terms.push({ key: m[2], start: plain.length, end: plain.length + m[1].length, planes: [] });
    plain += m[1];
    last = m.index + m[0].length;
  }
  plain += markup.slice(last);

  // I colori per intervallo arrivano allo shader senza conversione: li passo già lineari.
  const lin = (hex) => new THREE.Color(hex).getHex(THREE.LinearSRGBColorSpace);
  const styleRanges = { 0: { color: lin(INK) } };
  for (const t of terms) {
    styleRanges[t.start] = { color: lin(ACCENT), font: FONT.semi };
    styleRanges[t.end] = { color: lin(INK), font: FONT.regular };
  }
  const text = makeText(plain, { ...opts, styleRanges });
  await ready(text);

  const group = new THREE.Group();
  group.add(text);
  for (const t of terms) {
    t.mat = flat(MARKER, 0.2);
    for (const r of getSelectionRects(text.textRenderInfo, t.start, t.end)) {
      const w = r.right - r.left + 0.008;
      const h = (r.top - r.bottom) * 0.82;
      const p = layer(new THREE.Mesh(new THREE.PlaneGeometry(w, h), t.mat), 2);
      p.position.set((r.left + r.right) / 2, (r.top + r.bottom) / 2, Z_FILL);
      p.userData.ui = { hover: (on) => onTerm(t.key, on), sticky: true };
      group.add(p);
      t.planes.push(p);
    }
    t.setHot = (on) => (t.mat.opacity = on ? 0.75 : 0.2);
  }
  return { group, text, terms, height: bounds(text).h };
}

// --- Pulsante ---------------------------------------------------------------
export async function chip(label, { onClick, fontSize = 0.024, color = INK } = {}) {
  const text = makeText(label, {
    fontSize,
    font: FONT.semi,
    anchorX: 'center',
    anchorY: 'middle',
    color,
  });
  await ready(text);
  const b = bounds(text);
  const w = b.w + fontSize * 1.5;
  const h = fontSize * 2.1;
  const fill = flat(0xffffff, 0.55);
  const edge = flat(INK, 0.35);
  const bg = layer(new THREE.Mesh(roundedRect(w, h, h / 2), fill), 3);
  bg.position.z = Z_FILL;
  const rim = layer(new THREE.Mesh(roundedRect(w + 0.005, h + 0.005, h / 2), edge), 2);
  rim.position.z = Z_FILL / 2;
  const group = new THREE.Group();
  group.add(rim, bg, text);
  const st = { active: false, hover: false, tint: null };
  const paint = () => {
    if (st.active) {
      fill.color.set(st.tint ?? INK);
      fill.opacity = 1;
      text.color = 0xfffaf0;
    } else {
      fill.color.set(0xffffff);
      fill.opacity = st.hover ? 0.95 : 0.55;
      text.color = color;
    }
  };
  bg.userData.ui = {
    hover: (on) => ((st.hover = on), paint()),
    click: () => onClick?.(),
    cursor: 'pointer',
  };
  return {
    group,
    w: w + 0.005,
    h: h + 0.005,
    setActive: (on, tint = null) => ((st.active = on), (st.tint = tint), paint()),
  };
}

// Dispone una serie di pulsanti centrati su più righe; ritorna gruppo e altezza.
export function chipRow(chips, maxW, gap = 0.014) {
  const group = new THREE.Group();
  const rows = [[]];
  let w = 0;
  for (const c of chips) {
    if (w + c.w > maxW && rows.at(-1).length) {
      rows.push([]);
      w = 0;
    }
    rows.at(-1).push(c);
    w += c.w + gap;
  }
  let y = 0;
  for (const row of rows) {
    const total = row.reduce((s, c) => s + c.w, 0) + gap * (row.length - 1);
    let x = (maxW - total) / 2;
    const h = Math.max(...row.map((c) => c.h));
    for (const c of row) {
      c.group.position.set(x + c.w / 2, y - h / 2, 0);
      group.add(c.group);
      x += c.w + gap;
    }
    y -= h + gap;
  }
  return { group, height: -y - gap };
}

// --- Domanda a risposta multipla ---------------------------------------------
// Tratto disegnato a mano: un nastro piatto lungo una polilinea [[x, y], …].
function stroke(points, w) {
  const pos = [];
  const idx = [];
  for (const [i, [x, y]] of points.entries()) {
    const [ax, ay] = points[Math.max(0, i - 1)];
    const [bx, by] = points[Math.min(points.length - 1, i + 1)];
    const l = Math.hypot(bx - ax, by - ay) || 1;
    const nx = (-(by - ay) / l) * (w / 2);
    const ny = ((bx - ax) / l) * (w / 2);
    pos.push(x + nx, y + ny, 0, x - nx, y - ny, 0);
    if (i) idx.push(2 * i - 2, 2 * i - 1, 2 * i, 2 * i - 1, 2 * i + 1, 2 * i);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

// Curva di Bézier quadratica campionata, per tratti morbidi.
const bezier = ([x0, y0], [x1, y1], [x2, y2], n = 14) =>
  Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n;
    const u = 1 - t;
    return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2];
  });

// Casella da quaderno con la spunta rossa tracciata a mano, che ne esce come
// fatta con la penna. Il bordo alto della casella sta a y = -0.006; ritorna il
// gruppo, il fondo della casella (`inner`, da colorare) e la spunta (nascosta).
export const BOX = 0.026;
export function checkbox(color = ACCENT) {
  const group = new THREE.Group();
  const sq = layer(new THREE.Mesh(roundedRect(BOX, BOX, 0.005), flat(INK, 0.5)), 2);
  sq.position.set(BOX / 2, -BOX / 2 - 0.006, Z_FILL / 2);
  const inner = layer(new THREE.Mesh(roundedRect(BOX - 0.006, BOX - 0.006, 0.003), flat(0xfffdf6)), 3);
  inner.position.set(BOX / 2, -BOX / 2 - 0.006, Z_FILL);
  const tick = handTick(color);
  tick.visible = false;
  group.add(sq, inner, tick);
  return { group, inner, tick };
}

// La sola spunta, senza casella: alta circa 0.032, con l'angolo a (0.013, -0.031).
export function handTick(color = ACCENT) {
  const tick = layer(
    new THREE.Mesh(
      stroke([[0.004, -0.019], [0.009, -0.025], [0.013, -0.031], ...bezier([0.013, -0.031], [0.02, -0.012], [0.036, 0.001], 8)], 0.0038),
      flat(color)
    ),
    5
  );
  tick.position.z = Z_TEXT;
  return tick;
}

// Sottolineatura a penna sotto un tratto di testo, appena ondulata: da x0 a x1 a quota y.
export function underline(x0, x1, y, color = ACCENT) {
  const m = (x0 + x1) / 2;
  const line = layer(new THREE.Mesh(stroke(bezier([x0, y + 0.002], [m, y - 0.004], [x1, y + 0.001], 10), 0.0026), flat(color, 0.85)), 3);
  line.position.z = Z_FILL;
  return line;
}

// --- Domanda a risposta multipla ---------------------------------------------
//   { question, options, correct, explain }       domanda classica: si riprova fino alla risposta giusta
//   why: ['…', null, …]                            facoltativo: perché ogni opzione sbagliata non lo è
//   predict: true                                  previsione: prima si sceglie, poi si verifica sul
//                                                  modello e si solleva l'aletta «Perché?»
//   point: ['idParte', …]                          si risponde toccando una di queste parti sul
//                                                  modello (niente opzioni); why: { idParte: '…' }
// onPredict(i) viene chiamata a ogni scelta in modalità previsione; nameOf(id) dà il
// nome di una parte e onReveal(ids) la indica dopo tre tentativi sbagliati.
//   tags: [{ label, ids }]                         etichette da trascinare sulle parti `ids`
//                                                  del modello; why: { idParte: '…' }
//   cut: { board: 'campo' | 'corpo' | 'modello' }  «Taglia qui»: si taglia la via sul modello, si
//                                                  segna il deficit previsto, poi si confronta
//                                                  (vedi cutQuiz); onCompare() mostra l'esito sul modello
// onSolved(esito) viene chiamata quando la domanda è risolta: risposta giusta, aletta
// sollevata dopo la previsione, struttura indicata (o accesa dopo tre tentativi), tutte le
// etichette a posto, previsione di un taglio esatta (o tre confronti). È ciò che il
// riepilogo del capitolo spunta; `esito` (un oggetto da salvare in JSON) basta a ridisegnare
// la domanda risolta.
// Domanda già risolta in una visita precedente: `saved` è quell'esito ({} se non c'è). La
// domanda si apre risolta (risposta giusta segnata, aletta aperta, cartellini al loro posto,
// taglio e confronto rifatti) e in alto a destra compare «rifai», che la riporta da capo e
// chiama onRedo() (la pagina rimette a posto il modello). Le parti che toccano il modello si
// ridisegnano in `resume()`, che la pagina chiama dopo aver avviato il suo comportamento.
// Altri ganci: meshes(id) le mesh di una parte (per i cordini delle etichette),
// onPlace(id) un cartellino appena posato al suo posto, sulla parte `id`,
// onReplay(at) rifà sul modello un taglio salvato (ritorna false se non sa farlo).
export async function quiz(def, width, hooks = {}) {
  if (def.point) return pointQuiz(def, width, hooks);
  if (def.tags) return tagQuiz(def, width, hooks);
  if (def.cut) return cutQuiz(def, width, hooks);
  const { question, options, correct, explain, why = [], predict = false } = def;
  const { onPredict, onSolved, onRedo } = hooks;
  let saved = hooks.saved ?? null;
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText(predict ? 'PREDICI' : 'DOMANDA', {
    fontSize: 0.016,
    font: FONT.bold,
    color: ACCENT,
    letterSpacing: 0.14,
  });
  group.add(kicker);
  let again = null; // «rifai»: diverso per la domanda classica e per la previsione
  const redo = await redoMark(width, () => again());
  group.add(redo.group);
  y -= 0.03;
  const q = makeText(question, { fontSize: 0.027, font: FONT.semi, maxWidth: width, lineHeight: 1.35 });
  q.position.y = y;
  group.add(q);
  await ready(q);
  y -= bounds(q).h + 0.022;

  const feedback = makeText('', {
    fontSize: 0.022,
    font: FONT.italic,
    maxWidth: width,
    lineHeight: 1.35,
  });
  const rows = [];
  let solved = false;
  let chosen = null;
  let flap = null;
  // risposta giusta della domanda classica
  const right = (r) => {
    solved = true;
    redo.show(true);
    r.inner.material.color.set(GOOD);
    r.text.color = GOOD;
    r.hit.material.opacity = 0;
    feedback.color = GOOD;
    feedback.text = `Esatto. ${explain}`;
  };
  for (const [i, label] of options.entries()) {
    const row = new THREE.Group();
    row.position.y = y;
    const { group: cb, inner, tick } = checkbox();
    const t = makeText(label, { fontSize: 0.026, maxWidth: width - 0.05, lineHeight: 1.3 });
    t.position.x = 0.045;
    row.add(cb, t);
    await ready(t);
    const h = Math.max(bounds(t).h, BOX) + 0.016;
    const hit = layer(new THREE.Mesh(new THREE.PlaneGeometry(width, h), flat(MARKER, 0)), 1);
    hit.position.set(width / 2, -h / 2 + 0.008, Z_FILL / 4);
    const r = { row, tick, text: t, inner, hit };
    hit.userData.ui = {
      hover: (on) => (hit.material.opacity = on && !solved ? 0.18 : 0),
      cursor: 'pointer',
      click: () => {
        if (solved) return;
        if (predict) {
          // la previsione si può cambiare finché l'aletta è chiusa
          chosen = i;
          rows.forEach((o, j) => (o.tick.visible = j === i));
          flap.arm();
          onPredict?.(i);
          return;
        }
        if (i === correct) {
          right(r);
          onSolved?.({});
          return;
        }
        inner.material.color.set(BAD);
        t.color = BAD;
        feedback.color = BAD;
        feedback.text = why[i] ? `Non proprio. ${why[i]} Riprova.` : 'Non proprio: riguarda il modello e riprova.';
      },
    };
    row.add(hit);
    group.add(row);
    rows.push(r);
    y -= h;
  }
  // da capo: caselle vuote, testi neri, niente esito
  const clearRows = () => {
    for (const r of rows) {
      r.inner.material.color.set(0xfffdf6);
      r.text.color = INK;
      r.tick.visible = false;
      r.tick.material.color.set(ACCENT);
    }
  };
  if (!predict) {
    feedback.position.y = y - 0.012;
    group.add(feedback);
    if (saved) right(rows[correct]);
    again = () => {
      solved = false;
      saved = null;
      redo.show(false);
      clearRows();
      feedback.text = '';
      onRedo?.();
    };
    return { group, height: -y + 0.09 };
  }

  // --- aletta «Perché?» ---------------------------------------------------------
  // Sotto: l'esito della previsione e la spiegazione. Sopra: un cartoncino
  // incernierato al bordo alto, che si solleva verso chi legge.
  y -= 0.01;
  const pad = 0.016;
  const inW = width - 2 * pad;
  const verdict = makeText('', { fontSize: 0.021, font: FONT.semi, maxWidth: inW, lineHeight: 1.32 });
  const answer = makeText('', { fontSize: 0.0205, font: FONT.italic, maxWidth: inW, lineHeight: 1.34, color: INK });
  const verdictFor = (i) =>
    i === correct
      ? ['Previsione giusta.', explain]
      : [why[i] ? `Non proprio. ${why[i]}` : 'Non proprio: la risposta giusta è in verde.', explain];
  // l'altezza della tasca è quella dell'esito più lungo
  let innerH = 0;
  for (let i = 0; i < options.length; i++) {
    // troika richiama sync() solo se il testo cambia: lo svuoto, così la misura riparte sempre
    verdict.text = answer.text = '';
    [verdict.text, answer.text] = verdictFor(i);
    await Promise.all([ready(verdict), ready(answer)]);
    innerH = Math.max(innerH, bounds(verdict).h + 0.008 + bounds(answer).h);
  }

  const flapFace = new THREE.Group();
  const fk = makeText('PERCHÉ?', { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  const ft = makeText("Solleva l'aletta per la risposta", { fontSize: 0.027, font: FONT.semi, maxWidth: inW * 0.78, lineHeight: 1.25 });
  const fs = makeText('…dopo la tua previsione.', { fontSize: 0.021, font: FONT.italic, color: INK_SOFT, maxWidth: inW * 0.78 });
  const fh = makeText('solleva qui', { fontSize: 0.02, font: FONT.italic, color: PEN, anchorX: 'right' });
  await Promise.all([ready(fk), ready(ft), ready(fs), ready(fh)]);
  const faceH = 0.03 + bounds(ft).h + 0.012 + bounds(fs).h;
  const cardH = Math.max(innerH, faceH) + 2 * pad;

  const top = y;
  // tasca: carta appena più scura sotto l'aletta
  const pocket = layer(new THREE.Mesh(new THREE.PlaneGeometry(width, cardH), flat(0xd9ccb0, 0.35)), 1);
  pocket.position.set(width / 2, top - cardH / 2, Z_FILL / 4);
  verdict.position.set(pad, top - pad, Z_TEXT);
  group.add(pocket, verdict, answer);
  verdict.text = answer.text = '';

  // l'aletta ruota attorno al bordo alto
  const hinge = new THREE.Group();
  hinge.position.set(0, top, 0.0024);
  group.add(hinge);
  const paper = new THREE.MeshBasicMaterial({ color: 0xf6efdf, side: THREE.DoubleSide, depthWrite: false, transparent: true });
  const card = layer(new THREE.Mesh(roundedRect(width, cardH, 0.006), paper), 6);
  card.position.set(width / 2, -cardH / 2, 0);
  const rim = layer(new THREE.Mesh(roundedRect(width + 0.004, cardH + 0.004, 0.007), flat(INK, 0.22)), 5);
  rim.position.set(width / 2, -cardH / 2, -0.0002);
  rim.material.side = THREE.DoubleSide;
  // margine tratteggiato, come un ritaglio
  const dash = new THREE.Group();
  for (let x = 0.012; x < width - 0.012; x += 0.016) {
    const d = layer(new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.0012), flat(INK, 0.28)), 7);
    d.position.set(x + 0.004, -0.008, 0.0003);
    dash.add(d);
  }
  fk.position.set(pad, -pad, 0.0005);
  ft.position.set(pad, -pad - 0.03, 0.0005);
  fs.position.set(pad, -pad - 0.03 - bounds(ft).h - 0.012, 0.0005);
  fh.position.set(width - pad - 0.01, -pad, 0.0005);
  // freccia tracciata a mano verso l'angolo da sollevare
  const ax = width - pad - 0.04;
  const ay = -pad - 0.034;
  const arrowMat = flat(PEN, 0.9);
  const tipX = width - pad + 0.002;
  const tipY = -cardH + pad + 0.006;
  const arrow = new THREE.Group();
  arrow.add(
    new THREE.Mesh(stroke(bezier([ax, ay], [ax + 0.006, (ay + tipY) / 2], [tipX, tipY]), 0.0026), arrowMat),
    new THREE.Mesh(stroke([[tipX - 0.019, tipY + 0.002], [tipX, tipY], [tipX - 0.004, tipY + 0.018]], 0.0026), arrowMat)
  );
  arrow.position.z = 0.0005;
  const faceText = [fk, ft, fs, fh];
  for (const o of [...faceText, arrow, ...arrow.children]) o.renderOrder = 8;
  flapFace.add(card, rim, dash, ...faceText, arrow);
  hinge.add(flapFace);

  let armed = false;
  let open = false;
  let hover = false;
  let angle = 0;
  let last = performance.now();
  // aperta, l'aletta si alza e svanisce: in piedi coprirebbe le opzioni a chi guarda
  // il libro di sbieco. Si richiude toccando la tasca.
  const OPEN = 1.15;
  const reveal = () => {
    solved = true;
    redo.show(true);
    [verdict.text, answer.text] = verdictFor(chosen);
    verdict.color = chosen === correct ? GOOD : BAD;
    ready(verdict).then(() => answer.position.set(pad, top - pad - bounds(verdict).h - 0.008, Z_TEXT));
    rows.forEach((r, j) => {
      r.hit.material.opacity = 0;
      if (j === correct) r.text.color = GOOD;
      else if (j === chosen) r.text.color = BAD;
    });
    if (chosen !== correct) rows[chosen].tick.material.color.set(BAD);
  };
  card.userData.ui = {
    hover: (on) => (hover = on),
    click: () => {
      if (!armed) return;
      open = true;
      if (!solved) {
        reveal();
        onSolved?.({ chosen });
      }
    },
    get cursor() {
      return armed ? 'pointer' : 'default';
    },
  };
  pocket.userData.ui = { click: () => (open = false), cursor: 'pointer' };
  const ARMED = 'Ora guarda il modello, poi controlla.';
  flap = {
    arm() {
      if (armed) return;
      armed = true;
      fs.text = ARMED;
    },
  };
  y -= cardH;
  // risolta in una visita precedente: la previsione di allora, con l'aletta già sollevata
  if (saved) {
    chosen = Number.isInteger(saved.chosen) && saved.chosen >= 0 && saved.chosen < options.length ? saved.chosen : correct;
    rows[chosen].tick.visible = true;
    armed = open = true;
    angle = OPEN;
    fs.text = ARMED;
    reveal();
  }
  again = () => {
    solved = armed = open = false;
    saved = null;
    chosen = null;
    redo.show(false);
    clearRows();
    verdict.text = answer.text = '';
    fs.text = '…dopo la tua previsione.';
    onRedo?.();
  };

  return {
    group,
    height: -y + 0.01,
    // il modello mostra di nuovo l'esito della previsione di allora
    resume() {
      if (saved) onPredict?.(chosen);
    },
    update() {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // al passaggio l'aletta si stacca appena dalla pagina: invita a sollevarla
      const goal = open ? OPEN : armed && hover ? 0.22 : 0;
      angle += (goal - angle) * (1 - Math.exp(-dt * 9));
      hinge.rotation.x = -angle;
      // sollevandosi, il cartoncino svanisce del tutto
      const fade = THREE.MathUtils.clamp(1 - (angle - 0.35) / 0.65, 0, 1);
      for (const t of faceText) t.fillOpacity = fade;
      paper.opacity = fade;
      rim.material.opacity = 0.22 * fade;
      arrowMat.opacity = 0.9 * fade;
      for (const d of dash.children) d.material.opacity = 0.28 * fade;
      hinge.visible = fade > 0.01;
    },
  };
}

// «rifai», scritto a mano in blu in alto a destra di una domanda risolta: la riporta da
// capo. Ritorna { group, show(on) }; nascosto finché la domanda non è risolta.
async function redoMark(width, onClick) {
  const group = new THREE.Group();
  const t = makeText('rifai', { fontSize: 0.021, font: FONT.italic, color: PEN, anchorX: 'right' });
  t.position.set(width - 0.004, 0.006, Z_TEXT);
  await ready(t);
  const b = bounds(t);
  const line = underline(width - 0.004 - b.w, width - 0.004, 0.006 - b.h - 0.001, PEN);
  const hit = layer(new THREE.Mesh(new THREE.PlaneGeometry(b.w + 0.03, 0.036), flat(MARKER, 0)), 1);
  hit.position.set(width - 0.004 - b.w / 2, 0.006 - b.h / 2, Z_FILL / 4);
  hit.userData.ui = {
    hover: (on) => (hit.material.opacity = on ? 0.25 : 0),
    click: () => group.visible && onClick(),
    cursor: 'pointer',
  };
  group.add(hit, t, line);
  group.visible = false;
  return { group, show: (on) => (group.visible = on) };
}

// --- Indica sul modello -------------------------------------------------------
// La risposta è una struttura: chi legge la tocca sul modello. Ogni tocco
// sbagliato dice che cosa si è indicato e, se c'è, perché non è quella giusta;
// dopo tre tentativi la struttura giusta si accende da sola.
async function pointQuiz({ question, point, explain, why = {} }, width, { nameOf = (id) => id, onReveal, onSolved, onRedo, saved = null } = {}) {
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText('INDICA SUL MODELLO', { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  group.add(kicker);
  const redo = await redoMark(width, () => again());
  group.add(redo.group);
  y -= 0.03;
  const q = makeText(question, { fontSize: 0.027, font: FONT.semi, maxWidth: width, lineHeight: 1.35 });
  q.position.y = y;
  group.add(q);
  await ready(q);
  y -= bounds(q).h + 0.018;

  // invito, con una freccia a mano che punta alla pagina del modello
  const HINT = 'tocca la struttura sul modello';
  const hint = makeText(HINT, { fontSize: 0.023, font: FONT.italic, color: PEN });
  hint.position.set(0.004, y, Z_TEXT);
  await ready(hint);
  const hb = bounds(hint);
  const ax = hb.w + 0.02;
  const ay = y - hb.h / 2;
  const arrowMat = flat(PEN, 0.9);
  const arrow = new THREE.Group();
  arrow.add(
    new THREE.Mesh(stroke(bezier([ax, ay - 0.004], [ax + 0.05, ay + 0.016], [ax + 0.1, ay + 0.002]), 0.0026), arrowMat),
    new THREE.Mesh(stroke([[ax + 0.084, ay + 0.014], [ax + 0.1, ay + 0.002], [ax + 0.083, ay - 0.008]], 0.0026), arrowMat)
  );
  arrow.position.z = Z_TEXT;
  for (const o of [arrow, ...arrow.children]) o.renderOrder = 5;
  group.add(hint, arrow);
  y -= hb.h + 0.016;

  const feedback = makeText('', { fontSize: 0.022, font: FONT.italic, maxWidth: width, lineHeight: 1.35 });
  feedback.position.y = y;
  group.add(feedback);
  const answer = nameOf(point[0]);
  let solved = false;
  let tries = 0;
  // trovata (id), oppure accesa dopo tre tentativi (shown)
  const found = (id) => {
    solved = true;
    redo.show(true);
    feedback.color = GOOD;
    feedback.text = `Esatto: ${nameOf(id)}. ${explain}`;
    hint.text = 'trovata';
    hint.color = GOOD;
    arrowMat.opacity = 0;
  };
  const shown = (said) => {
    solved = true;
    redo.show(true);
    feedback.color = BAD;
    feedback.text = `${said}La risposta giusta ora è accesa sul modello: ${answer}. ${explain}`;
    hint.text = '';
    arrowMat.opacity = 0;
  };
  if (saved) {
    if (saved.shown) shown('');
    else found(point.includes(saved.id) ? saved.id : point[0]);
  }
  const again = () => {
    solved = false;
    saved = null;
    tries = 0;
    redo.show(false);
    feedback.text = '';
    hint.text = HINT;
    hint.color = PEN;
    arrowMat.opacity = 0.9;
    onRedo?.();
  };
  return {
    group,
    height: -y + 0.11,
    // risolta dopo tre tentativi in una visita precedente: la risposta torna accesa
    resume() {
      if (saved?.shown) onReveal?.(point);
    },
    // chiamata dallo spread a ogni clic su una parte del modello
    point(id) {
      if (solved) return;
      if (point.includes(id)) {
        found(id);
        onSolved?.({ id });
        return;
      }
      tries += 1;
      feedback.color = BAD;
      const said = `Hai indicato: ${nameOf(id)}.${why[id] ? ` ${why[id]}` : ''}`;
      if (tries < 3) {
        feedback.text = `${said} Riprova.`;
        return;
      }
      shown(`${said} `);
      onSolved?.({ shown: true });
      onReveal?.(point);
    },
  };
}

// --- Etichette da trascinare ----------------------------------------------------
// Cartellini sulla pagina: si afferrano e si lasciano sulla struttura del modello.
// Al posto giusto il cartellino torna nella sua casella e un cordino rosso lo lega
// alla struttura, come le etichette a mano di una tavola anatomica.
const CORD = 0x9c2f22;
async function tagQuiz({ question, tags, explain, why = {} }, width, { nameOf = (id) => id, onSolved, onRedo, onPlace, saved = null, meshes = () => [] } = {}) {
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText('TRASCINA LE ETICHETTE', { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  group.add(kicker);
  const redo = await redoMark(width, () => again());
  group.add(redo.group);
  y -= 0.03;
  const q = makeText(question, { fontSize: 0.027, font: FONT.semi, maxWidth: width, lineHeight: 1.35 });
  q.position.y = y;
  group.add(q);
  await ready(q);
  y -= bounds(q).h + 0.024;

  const feedback = makeText('', { fontSize: 0.022, font: FONT.italic, maxWidth: width, lineHeight: 1.35 });
  const cordGeo = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
  const cordMat = new THREE.MeshStandardMaterial({ color: CORD, roughness: 0.7 });
  const items = [];
  const colW = width / 2;
  const tagH = 0.044;
  let done = 0;
  for (const [i, tag] of tags.entries()) {
    const col = i % 2;
    const home = new THREE.Vector3(col * colW + 0.004, y - Math.floor(i / 2) * (tagH + 0.016), 0);
    const g = new THREE.Group();
    g.position.copy(home);
    const t = makeText(tag.label, { fontSize: 0.024, font: FONT.italic, color: CORD, anchorY: 'middle' });
    t.position.set(0.04, -tagH / 2, 0.0006);
    await ready(t);
    const w = Math.min(colW - 0.02, bounds(t).w + 0.082);
    const card = layer(new THREE.Mesh(roundedRect(w, tagH, 0.008), flat(0xfaf5e8)), 6);
    card.position.set(w / 2, -tagH / 2, 0.0003);
    const rim = layer(new THREE.Mesh(roundedRect(w + 0.004, tagH + 0.004, 0.009), flat(INK, 0.3)), 5);
    rim.position.set(w / 2, -tagH / 2, 0.0001);
    // occhiello a cui si lega il cordino
    const eye = layer(new THREE.Mesh(new THREE.RingGeometry(0.006, 0.0095, 20), flat(CORD)), 7);
    eye.position.set(0.019, -tagH / 2, 0.0006);
    t.renderOrder = 8;
    const tick = layer(new THREE.Mesh(stroke([[0, -0.006], [0.006, -0.012], ...bezier([0.006, -0.012], [0.011, 0.0], [0.02, 0.006], 6)], 0.0032), flat(GOOD)), 8);
    tick.position.set(w - 0.03, -tagH / 2 + 0.002, 0.0006);
    tick.visible = false;
    g.add(rim, card, eye, t, tick);
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.visible = false;
    group.add(g, cord);
    const it = { tag, g, home, card, eye, cord, tick, placed: null, pin: null, held: false, offset: new THREE.Vector3() };
    // il piano della pagina, nel mondo, per seguire il puntatore
    const plane = new THREE.Plane();
    const planeHit = (ray) => {
      const n = new THREE.Vector3(0, 0, 1).transformDirection(group.matrixWorld);
      plane.setFromNormalAndCoplanarPoint(n, group.getWorldPosition(new THREE.Vector3()));
      const p = ray.intersectPlane(plane, new THREE.Vector3());
      return p && group.worldToLocal(p);
    };
    card.userData.ui = {
      cursor: 'grab',
      hover: (on) => (rim.material.opacity = on && !it.placed ? 0.6 : 0.3),
      grab: {
        start(ray) {
          if (it.placed) return;
          it.held = true;
          const p = planeHit(ray);
          if (p) it.offset.copy(g.position).sub(p);
          g.position.z = 0.012; // sollevato dalla carta mentre lo si porta
        },
        move(ray) {
          if (!it.held) return;
          const p = planeHit(ray);
          if (p) g.position.set(p.x + it.offset.x, p.y + it.offset.y, 0.012);
        },
        end(pickUnder) {
          if (!it.held) return;
          it.held = false;
          g.visible = false;
          const under = pickUnder();
          g.visible = true;
          const id = under?.ui?.id;
          if (!id) return; // lasciato nel vuoto: torna a posto
          if (tag.ids.includes(id)) {
            // il cordino si appunta dove è stato lasciato il cartellino, e segue il modello
            place(it, id, under.object, under.object.worldToLocal(under.hit.point.clone()));
            onPlace?.(id);
            done += 1;
            feedback.color = GOOD;
            feedback.text = done === tags.length ? `Tutte al loro posto. ${explain ?? ''}` : `«${tag.label}»: esatto.`;
            if (done === tags.length) {
              redo.show(true);
              // dove sono appuntati i cordini: parte, mesh della parte, punto nella mesh
              onSolved?.({
                pins: items.map((o) => [o.placed, Math.max(0, meshes(o.placed).indexOf(o.pin.object)), ...o.pin.local.toArray().map((v) => +v.toFixed(5))]),
              });
            }
            return;
          }
          feedback.color = BAD;
          const right = items.find((o) => o.tag.ids.includes(id));
          feedback.text = `Lì c'è ${nameOf(id)}${right && right !== it ? `: è il posto di «${right.tag.label}»` : ''}. ${why[id] ?? 'Riprova.'}`;
        },
      },
    };
    items.push(it);
  }
  y -= Math.ceil(tags.length / 2) * (tagH + 0.016) + 0.006;
  feedback.position.y = y;
  group.add(feedback);
  function place(it, id, object, local) {
    it.placed = id;
    it.pin = object && { object, local };
    it.tick.visible = true;
  }
  // risolta in una visita precedente: le spunte subito, i cordini quando il modello è pronto
  const solvedBefore = () => {
    for (const it of items) it.tick.visible = true;
    done = tags.length;
    redo.show(true);
    feedback.color = GOOD;
    feedback.text = `Tutte al loro posto. ${explain ?? ''}`;
  };
  if (saved) solvedBefore();
  const again = () => {
    saved = null;
    for (const it of items) {
      it.placed = it.pin = null;
      it.tick.visible = false;
    }
    done = 0;
    redo.show(false);
    feedback.text = '';
    onRedo?.();
  };

  const up = new THREE.Vector3(0, 1, 0);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  let last = performance.now();
  return {
    group,
    height: -y + 0.08,
    // i cordini di allora, appuntati dove erano stati lasciati (o al centro della parte)
    resume() {
      if (!saved) return;
      for (const [i, it] of items.entries()) {
        const [id, k, x, y, z] = Array.isArray(saved.pins?.[i]) ? saved.pins[i] : [];
        const ok = it.tag.ids.includes(id) && meshes(id)[k];
        const at = ok ? id : it.tag.ids[0];
        const local = ok && [x, y, z].every(Number.isFinite) ? new THREE.Vector3(x, y, z) : new THREE.Vector3();
        place(it, at, meshes(at)[ok ? k : 0], local);
      }
    },
    update() {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      for (const it of items) {
        // il cartellino non afferrato torna nella sua casella
        if (!it.held) it.g.position.lerp(it.home, 1 - Math.exp(-dt * 12));
        let w = null;
        if (it.pin) {
          w = it.pin.object.localToWorld(it.pin.local.clone());
          for (let o = it.pin.object; o; o = o.parent) if (!o.visible) w = null;
        }
        it.cord.visible = !!w;
        if (!w) continue;
        // cordino dall'occhiello alla struttura, in coordinate della domanda
        a.copy(it.eye.position).add(it.g.position);
        b.copy(group.worldToLocal(w.clone()));
        const len = a.distanceTo(b);
        it.cord.position.copy(a).add(b).multiplyScalar(0.5);
        it.cord.quaternion.setFromUnitVectors(up, b.sub(a).normalize());
        it.cord.scale.set(0.0022, len, 0.0022);
      }
    },
  };
}

// --- Corda con manico: un comando continuo ---------------------------------------
// Una corda rossa tesa tra due pioli, con un manico chiaro a forma d'osso che si
// afferra e si fa scorrere: il valore va da `min` (piolo sinistro) a `max` (destro).
// Il tratto dal punto di riposo al manico è teso e pieno, il resto appena accennato.
// Si può anche toccare la corda in un punto: il manico salta lì e resta in mano.
//   label      titoletto in maiuscoletto rosso
//   ends       ['sinistra', 'destra']: le due estremità, in corsivo accanto ai pioli
//   value      valore iniziale; rest: punto di riposo (predefinito: value)
//   spring     lasciata, la corda torna da sola al riposo, come una corda tirata
//   format(v)  testo accanto al titoletto, aggiornato a ogni variazione (facoltativo)
//   marks      [{ at, label }]: tacche sulla corda, per esempio una soglia
//   onChange(v) a ogni variazione dovuta a chi legge, anche mentre la corda torna a riposo
// Ritorna { group, height, value, held, set(v, { now }), release(), update() }: `set` muove
// il manico da codice (senza onChange), `release` lo strappa di mano e lo riporta al riposo.
export async function cord({ label = '', ends = ['', ''], width, min = 0, max = 1, value = min, rest = value, spring = false, format, marks = [], onChange }) {
  const group = new THREE.Group();
  const kicker = makeText(label, { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  const readout = makeText('', { fontSize: 0.02, font: FONT.italic, color: INK_SOFT, maxWidth: width });
  const left = makeText(ends[0], { fontSize: 0.022, font: FONT.italic, color: INK_SOFT, anchorY: 'middle' });
  const right = makeText(ends[1], { fontSize: 0.022, font: FONT.italic, color: INK_SOFT, anchorY: 'middle', anchorX: 'right' });
  await Promise.all([ready(kicker), ready(left), ready(right)]);
  const yc = -0.06;
  const x0 = (ends[0] ? bounds(left).w + 0.022 : 0) + 0.012;
  const x1 = width - (ends[1] ? bounds(right).w + 0.022 : 0) - 0.012;
  // la lettura segue il titoletto: a destra la coprirebbe il manico in fondo corsa
  readout.position.set(bounds(kicker).w + 0.018, 0.003, Z_TEXT);
  readout.maxWidth = width - readout.position.x;
  left.position.set(0, yc, Z_TEXT);
  right.position.set(width, yc, Z_TEXT);
  group.add(kicker, readout, left, right);

  // corda lenta da piolo a piolo, e il tratto teso sopra
  const slack = layer(new THREE.Mesh(stroke([[x0, yc], [x1, yc]], 0.003), flat(CORD, 0.32)), 3);
  const taut = layer(new THREE.Mesh(new THREE.PlaneGeometry(1, 0.0058), flat(CORD)), 4);
  taut.position.z = slack.position.z = Z_FILL;
  group.add(slack, taut);
  for (const x of [x0, x1]) {
    const peg = layer(new THREE.Mesh(new THREE.CircleGeometry(0.009, 20), flat(INK, 0.75)), 5);
    const hole = layer(new THREE.Mesh(new THREE.CircleGeometry(0.0035, 12), flat(0xf6efdf)), 6);
    peg.position.set(x, yc, Z_FILL);
    hole.position.set(x, yc, Z_FILL * 1.2);
    group.add(peg, hole);
  }

  const span = max - min;
  const xOf = (v) => x0 + ((v - min) / span) * (x1 - x0);
  for (const m of marks) {
    const tick = layer(new THREE.Mesh(new THREE.PlaneGeometry(0.0026, 0.024), flat(INK, 0.6)), 5);
    tick.position.set(xOf(m.at), yc, Z_FILL);
    const t = makeText(m.label ?? '', { fontSize: 0.017, font: FONT.italic, color: INK_SOFT, anchorX: 'center' });
    t.position.set(xOf(m.at), yc - 0.016, Z_TEXT);
    group.add(tick, t);
  }

  // manico a forma d'osso, di traverso sulla corda: un fusto e due nocche per estremo
  const handle = new THREE.Group();
  const bone = (grow, mat, order) => {
    const shaft = layer(new THREE.Mesh(roundedRect(0.018 + grow, 0.044 + grow, 0.008), mat), order);
    handle.add(shaft);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const knob = layer(new THREE.Mesh(new THREE.CircleGeometry(0.0102 + grow / 2, 20), mat), order);
      knob.position.set(sx * 0.0082, sy * 0.022, 0);
      handle.add(knob);
    }
  };
  const rimMat = flat(INK, 0.5);
  bone(0.004, rimMat, 6);
  bone(0, flat(0xf6efdf), 7);
  // il nodo con cui la corda è legata al manico
  const knot = layer(new THREE.Mesh(new THREE.CircleGeometry(0.0055, 16), flat(CORD)), 8);
  knot.position.z = 0.0002;
  handle.add(knot);
  handle.position.set(x0, yc, Z_TEXT);
  group.add(handle);

  const st = { target: value, shown: value, held: false, slipped: false, silent: true, last: -Infinity };
  const plane = new THREE.Plane();
  const valueAt = (ray) => {
    const n = new THREE.Vector3(0, 0, 1).transformDirection(group.matrixWorld);
    plane.setFromNormalAndCoplanarPoint(n, group.getWorldPosition(new THREE.Vector3()));
    const p = ray.intersectPlane(plane, new THREE.Vector3());
    if (!p) return null;
    const x = group.worldToLocal(p).x;
    return min + THREE.MathUtils.clamp((x - x0) / (x1 - x0), 0, 1) * span;
  };
  // zona sensibile: tutta la corda, alta quanto il manico
  const hit = layer(new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 + 0.04, 0.09), flat(MARKER, 0)), 1);
  hit.position.set((x0 + x1) / 2, yc, Z_FILL / 4);
  hit.userData.ui = {
    cursor: 'grab',
    hover: (on) => (rimMat.opacity = on ? 0.85 : 0.5),
    grab: {
      start(ray) {
        st.held = true;
        st.slipped = false;
        st.silent = false;
        const v = valueAt(ray);
        if (v != null) st.target = v;
      },
      move(ray) {
        if (!st.held || st.slipped) return;
        const v = valueAt(ray);
        if (v != null) st.target = v;
      },
      end() {
        st.held = false;
        st.slipped = false;
        if (spring) st.target = rest;
      },
    },
  };
  group.add(hit);

  const paint = () => {
    const x = xOf(st.shown);
    const xr = xOf(THREE.MathUtils.clamp(rest, min, max));
    handle.position.x = x;
    // il manico tirato si inclina appena verso il piolo da cui si allontana
    handle.rotation.z = THREE.MathUtils.clamp((st.target - st.shown) / span, -0.3, 0.3);
    taut.scale.x = Math.max(1e-4, Math.abs(x - xr));
    taut.position.set((x + xr) / 2, yc, Z_FILL * 1.1);
    if (format) readout.text = format(st.shown);
  };
  paint();
  let last = performance.now();
  return {
    group,
    height: -yc + 0.033,
    get value() {
      return st.shown;
    },
    get held() {
      return st.held;
    },
    set(v, { now = false } = {}) {
      st.target = THREE.MathUtils.clamp(v, min, max);
      st.silent = true;
      if (now) {
        st.shown = st.target;
        paint();
      }
    },
    release() {
      if (!st.held) return;
      st.slipped = true;
      st.target = rest;
    },
    update() {
      const t = performance.now();
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      // in mano il manico segue subito; lasciato, scivola verso la meta
      const k = st.held && !st.slipped ? 1 : 1 - Math.exp(-dt * (spring ? 7 : 5));
      const prev = st.shown;
      st.shown += (st.target - st.shown) * k;
      if (Math.abs(st.target - st.shown) < span * 1e-3) st.shown = st.target;
      if (st.shown === prev && Math.abs(st.target - st.shown) < 1e-9 && handle.rotation.z === 0) return;
      paint();
      if (!st.silent && st.shown !== st.last) {
        st.last = st.shown;
        onChange?.(st.shown);
      }
    },
  };
}

// --- «Taglia qui»: taglio, previsione, confronto ----------------------------------
// Chi legge taglia la via sul modello (il comportamento `cutter` di src/modes.js
// chiama `cut({ label, truth })`), poi dichiara il deficit che prevede con un gesto
// su una tavola disegnata sulla pagina, infine tocca «Confronta»: il modello mostra
// l'esito vero e la tavola segna che cosa coincide, che cosa mancava, che cosa era
// di troppo. Un nuovo taglio ricomincia da capo. Le tavole:
//   campo    i due dischi del campo visivo, come lo vede il paziente; chiavi
//            "occhio:metà:quadrante" (R/L, R/L, S/I), le stesse di setFields nel modello
//   corpo    una sagoma vista di fronte per ogni tipo di perdita (`kinds`: [{ key, label,
//            color }]); si colora metà sagoma, chiavi "lato:tipo" (R/L: lato del paziente)
//   modello  si toccano le parti sul modello (il comportamento chiama `toggle(id)`);
//            le chiavi sono gli id delle parti
// Facoltativi: `hint` (l'invito prima del taglio), `done` («Taglio»), `again` (l'invito
// dopo il confronto) e, per la tavola «modello», `legend` (come leggere l'esito sul modello).
// La domanda è risolta con una previsione esatta, o dopo tre confronti.
const HATCH_SIZE = 0.011; // passo del tratteggio sulla pagina
let hatchMap = null;
function hatchTexture() {
  if (hatchMap) return hatchMap;
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  g.strokeStyle = `#${new THREE.Color(ACCENT).getHexString()}`;
  g.lineWidth = 5;
  g.lineCap = 'square';
  // diagonale che si ripete senza giunte: anche i due angoli
  for (const d of [-32, 0, 32]) {
    g.beginPath();
    g.moveTo(d, 32);
    g.lineTo(d + 32, 0);
    g.stroke();
  }
  hatchMap = new THREE.CanvasTexture(c);
  hatchMap.colorSpace = THREE.SRGBColorSpace;
  hatchMap.wrapS = hatchMap.wrapT = THREE.RepeatWrapping;
  return hatchMap;
}
// coordinate di tessitura uguali alle coordinate di pagina: il tratteggio ha lo stesso passo ovunque
function pageUV(g, ox = 0, oy = 0) {
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[2 * i] = (pos.getX(i) + ox) / HATCH_SIZE;
    uv[2 * i + 1] = (pos.getY(i) + oy) / HATCH_SIZE;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

// Una zona della tavola: fondo di carta (scuro se persa davvero), tratteggio rosso
// (la previsione), un punto in cui mettere il segno del confronto.
function region(key, geo, at, anchor, inside = anchor) {
  const g = pageUV(geo, at[0], at[1]);
  const fill = layer(new THREE.Mesh(g, flat(0xfffdf6)), 2);
  const hatch = layer(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: hatchTexture(), transparent: true, depthWrite: false })), 3);
  fill.position.set(at[0], at[1], Z_FILL / 2);
  hatch.position.set(at[0], at[1], Z_FILL);
  hatch.visible = false;
  return { key, fill, hatch, anchor, inside };
}

// Segni del confronto: spunta verde (coincide), cerchio blu (mancava), croce rossa (di troppo).
function verdictMark(kind) {
  if (kind === 'hit') {
    const t = handTick(GOOD);
    t.position.set(-0.02, 0.016, Z_TEXT); // la spunta, centrata sul punto
    const g = new THREE.Group();
    g.add(t);
    return g;
  }
  const g = new THREE.Group();
  if (kind === 'miss') {
    const pts = Array.from({ length: 27 }, (_, k) => {
      const a = (k / 24) * Math.PI * 2 + 0.4;
      return [Math.cos(a) * 0.0135 * (1 + 0.06 * Math.sin(3 * a)), Math.sin(a) * 0.0125];
    });
    g.add(layer(new THREE.Mesh(stroke(pts, 0.0032), flat(PEN)), 6));
  } else {
    const m = flat(BAD);
    g.add(
      layer(new THREE.Mesh(stroke(bezier([-0.011, 0.011], [0.001, 0.002], [0.011, -0.012], 6), 0.0034), m), 6),
      layer(new THREE.Mesh(stroke(bezier([0.011, 0.012], [-0.001, 0.001], [-0.012, -0.01], 6), 0.0034), m), 6)
    );
  }
  for (const c of g.children) c.position.z = Z_TEXT;
  return g;
}

// Tavola «campo»: due dischi divisi in quadranti, l'occhio sinistro a sinistra.
async function fieldBoard(width) {
  const group = new THREE.Group();
  const R = 0.072;
  const regions = [];
  const waits = [];
  const ink = flat(INK, 0.8);
  for (const [eye, cx] of [['L', width / 2 - 0.15], ['R', width / 2 + 0.15]]) {
    const cy = -0.032 - R;
    const name = makeText(eye === 'R' ? 'occhio destro' : 'occhio sinistro', { fontSize: 0.021, font: FONT.italic, color: INK_SOFT, anchorX: 'center' });
    name.position.set(cx, 0, Z_TEXT);
    group.add(name);
    waits.push(ready(name));
    for (const sx of [1, -1])
      for (const sy of [1, -1]) {
        const start = sx > 0 ? (sy > 0 ? 0 : -Math.PI / 2) : sy > 0 ? Math.PI / 2 : Math.PI;
        const r = region(`${eye}:${sx > 0 ? 'R' : 'L'}:${sy > 0 ? 'S' : 'I'}`, new THREE.CircleGeometry(R, 18, start, Math.PI / 2), [cx, cy], [cx + sx * R * 0.5, cy + sy * R * 0.48]);
        regions.push(r);
        group.add(r.fill, r.hatch);
      }
    // contorno e croce a penna, appena irregolari
    const rim = Array.from({ length: 49 }, (_, k) => {
      const a = (k / 48) * Math.PI * 2;
      const w = 1 + 0.012 * Math.sin(5 * a + cx * 20);
      return [cx + Math.cos(a) * R * w, cy + Math.sin(a) * R * w];
    });
    for (const pts of [rim, bezier([cx - R, cy + 0.001], [cx, cy - 0.002], [cx + R, cy], 8), bezier([cx, cy + R], [cx + 0.002, cy], [cx - 0.001, cy - R], 8)]) {
      const line = layer(new THREE.Mesh(stroke(pts, pts === rim ? 0.0034 : 0.0026), ink), 4);
      line.position.z = Z_FILL * 1.5;
      group.add(line);
    }
  }
  const foot = makeText('il campo visivo come lo vede il paziente', { fontSize: 0.0185, font: FONT.italic, color: INK_SOFT, anchorX: 'center' });
  foot.position.set(width / 2, -0.032 - 2 * R - 0.012, Z_TEXT);
  group.add(foot);
  await Promise.all([...waits, ready(foot)]);
  const describe = (keys) => {
    const out = [];
    for (const eye of ['R', 'L'])
      for (const half of ['L', 'R']) {
        const s = keys.has(`${eye}:${half}:S`);
        const i = keys.has(`${eye}:${half}:I`);
        if (!s && !i) continue;
        const e = eye === 'R' ? 'occhio destro' : 'occhio sinistro';
        const h = half === 'L' ? 'sinistra' : 'destra';
        out.push(s && i ? `${e}, metà ${h}` : `${e}, in ${s ? 'alto' : 'basso'} a ${h}`);
      }
    return out;
  };
  return { group, regions, height: 0.032 + 2 * R + 0.012 + bounds(foot).h, describe };
}

// Mezza sagoma umana vista di fronte (x >= 0, altezza 1, dall'alto in basso): testa,
// spalla, braccio staccato dal tronco, gamba. Si chiude sulla linea mediana.
const HALF_BODY = [
  ...Array.from({ length: 9 }, (_, k) => {
    const a = Math.PI / 2 - (k / 8) * (Math.PI / 2 + 1.22);
    return [0.075 * Math.cos(a), -0.085 + 0.075 * Math.sin(a)];
  }),
  [0.03, -0.175], [0.11, -0.198], [0.15, -0.222], [0.175, -0.3], [0.2, -0.42], [0.215, -0.53],
  [0.222, -0.578], [0.198, -0.602], [0.179, -0.562], [0.165, -0.44], [0.141, -0.335], [0.124, -0.272],
  [0.115, -0.36], [0.11, -0.45], [0.12, -0.54], [0.122, -0.62], [0.106, -0.8], [0.09, -0.945],
  [0.1, -0.982], [0.05, -0.99], [0.036, -0.958], [0.036, -0.8], [0.02, -0.62], [0, -0.6],
];

// Tavola «corpo»: una sagoma per tipo di perdita; la metà destra del paziente sta a
// sinistra di chi guarda, come nel modello.
async function bodyBoard(width, kinds) {
  const group = new THREE.Group();
  const H = 0.17;
  const regions = [];
  const waits = [];
  const ink = flat(INK, 0.8);
  const step = width / kinds.length;
  for (const [k, kind] of kinds.entries()) {
    const cx = step * (k + 0.5);
    const top = -0.034;
    const name = makeText(kind.label, { fontSize: 0.021, font: FONT.semi, color: kind.color ?? INK, anchorX: 'center' });
    name.position.set(cx, 0, Z_TEXT);
    group.add(name);
    waits.push(ready(name));
    for (const [side, sx] of [['R', -1], ['L', 1]]) {
      const pts = HALF_BODY.map(([x, y]) => [cx + sx * x * H, top + y * H]);
      const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x - cx, y - top)));
      // il segno del confronto sta fuori dalla sagoma, accanto al braccio di quel lato
      const r = region(`${side}:${kind.key}`, new THREE.ShapeGeometry(shape), [cx, top], [cx + sx * 0.33 * H, top - 0.3 * H], [cx + sx * 0.06 * H, top - 0.4 * H]);
      regions.push(r);
      group.add(r.fill, r.hatch);
      const outline = layer(new THREE.Mesh(stroke(pts.slice(0, -1), 0.003), ink), 4);
      outline.position.z = Z_FILL * 1.5;
      group.add(outline);
      const t = makeText(side === 'R' ? 'destra' : 'sinistra', { fontSize: 0.0175, font: FONT.italic, color: INK_SOFT, anchorX: sx < 0 ? 'right' : 'left' });
      t.position.set(cx + sx * 0.035, top - H - 0.006, Z_TEXT);
      group.add(t);
      waits.push(ready(t));
    }
    // linea mediana tratteggiata: le due metà si colorano una per una
    for (let y = top - 0.17 * H; y > top - 0.6 * H; y -= 0.012) {
      const d = layer(new THREE.Mesh(new THREE.PlaneGeometry(0.0014, 0.006), flat(INK, 0.35)), 4);
      d.position.set(cx, y, Z_FILL * 1.5);
      group.add(d);
    }
  }
  await Promise.all(waits);
  const label = Object.fromEntries(kinds.map((k) => [k.key, k.label]));
  const describe = (keys) => {
    const out = [];
    for (const kind of kinds) {
      const r = keys.has(`R:${kind.key}`);
      const l = keys.has(`L:${kind.key}`);
      if (r || l) out.push(`${label[kind.key]} ${r && l ? 'a destra e a sinistra' : r ? 'a destra' : 'a sinistra'}`);
    }
    return out;
  };
  return { group, regions, height: 0.034 + H + 0.03, describe };
}

async function cutQuiz({ question, cut: spec, explain = '' }, width, hooks = {}) {
  const { nameOf = (id) => id, onCompare, onSolved, onRedo, onReplay } = hooks;
  let saved = hooks.saved ?? null;
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText('TAGLIA E PREVEDI', { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  group.add(kicker);
  const redo = await redoMark(width, () => again());
  group.add(redo.group);
  y -= 0.03;
  const q = makeText(question, { fontSize: 0.027, font: FONT.semi, maxWidth: width, lineHeight: 1.35 });
  q.position.y = y;
  group.add(q);
  await ready(q);
  y -= bounds(q).h + 0.012;

  // riga di stato: che cosa fare adesso, con la freccia a mano verso il modello finché non si è tagliato
  const status = makeText('', { fontSize: 0.022, font: FONT.italic, color: PEN, maxWidth: width, lineHeight: 1.3 });
  status.position.set(0.004, y, Z_TEXT);
  const arrowMat = flat(PEN, 0.9);
  const arrow = new THREE.Group();
  const ax = width - 0.1;
  const ay = y - 0.013;
  arrow.add(
    new THREE.Mesh(stroke(bezier([ax, ay - 0.004], [ax + 0.05, ay + 0.016], [ax + 0.1, ay + 0.002]), 0.0026), arrowMat),
    new THREE.Mesh(stroke([[ax + 0.084, ay + 0.014], [ax + 0.1, ay + 0.002], [ax + 0.083, ay - 0.008]], 0.0026), arrowMat)
  );
  arrow.position.z = Z_TEXT;
  for (const o of [arrow, ...arrow.children]) o.renderOrder = 5;
  group.add(status, arrow);
  const statusTop = y;

  // --- la tavola ---------------------------------------------------------------
  // le sagome lasciano a destra una colonna per «Confronta» e la legenda
  const onModel = spec.board === 'modello';
  const aside = spec.board === 'corpo' ? width * 0.62 : 0;
  let board;
  if (spec.board === 'campo') board = await fieldBoard(width);
  else if (spec.board === 'corpo') board = await bodyBoard(aside, spec.kinds);
  else {
    // sul modello: qui resta solo l'elenco di ciò che si è toccato
    const list = makeText('', { fontSize: 0.022, maxWidth: width, lineHeight: 1.3 });
    const g = new THREE.Group();
    g.add(list);
    board = { group: g, regions: [], height: 0.064, list, describe: (keys) => [...keys].map(nameOf) };
  }
  group.add(board.group);

  // «Confronta» e la legenda dei segni: accanto alla tavola o sotto
  const go = await chip('Confronta', { onClick: () => compare() });
  const legend = makeText('', { fontSize: 0.0185, font: FONT.italic, color: INK_SOFT, lineHeight: 1.25 });
  legend.maxWidth = aside ? width - aside - 0.03 : width - go.w - 0.03;
  if (!aside) legend.anchorY = 'middle';
  const verdict = makeText('', { fontSize: 0.0215, font: FONT.italic, maxWidth: width, lineHeight: 1.32 });
  group.add(go.group, legend, verdict);

  // Impaginazione: la riga di stato e l'elenco della tavola «modello» vanno a capo secondo
  // il testo (il nome di un taglio può essere lungo), quindi ciò che sta sotto si sposta
  // ogni volta che uno dei due cambia. Due righe sono sempre riservate, così la pagina non
  // salta a ogni taglio; solo una terza riga spinge giù il resto.
  const linesH = (t, min) => Math.max(min, t.textRenderInfo ? bounds(t).h + 0.012 : 0);
  const layout = () => {
    let yy = statusTop - linesH(status, 0.064);
    board.group.position.y = yy;
    const boardH = onModel ? linesH(board.list, board.height) : board.height;
    if (aside) {
      const x = aside + 0.03;
      go.group.position.set(x + go.w / 2, yy - 0.04 - go.h / 2, 0);
      legend.position.set(x, yy - 0.04 - go.h - 0.014, Z_TEXT);
      yy -= boardH + 0.006;
    } else {
      yy -= boardH + 0.006;
      go.group.position.set(go.w / 2, yy - go.h / 2, 0);
      legend.position.set(go.w + 0.02, yy - go.h / 2, Z_TEXT);
      yy -= go.h + 0.012;
    }
    verdict.position.y = yy;
    return yy;
  };
  status.addEventListener('synccomplete', layout);
  if (onModel) board.list.addEventListener('synccomplete', layout);
  y = layout();

  // --- stato --------------------------------------------------------------------
  let current = null; // il taglio: { label, truth, at }
  let shown = false;
  let tries = 0;
  let solved = false;
  const marks = new Set();
  const symbols = new THREE.Group();
  board.group.add(symbols);
  const paint = () => {
    for (const r of board.regions) {
      r.hatch.visible = marks.has(r.key);
      const lost = shown && current.truth.has(r.key);
      r.fill.material.color.set(lost ? 0x5e5248 : r.hover && current && !shown ? 0xf6e7b8 : 0xfffdf6);
      r.fill.material.opacity = lost ? 0.5 : 1;
    }
    if (onModel) board.list.text = current ? `Segnati: ${marks.size ? board.describe(marks).join(', ') : 'nulla'}.` : '';
  };
  const say = () => {
    arrowMat.opacity = current ? 0 : 0.9;
    const { hint = 'tocca la via sul modello per tagliarla', done = 'Taglio', again = 'Tocca la via per un altro taglio.' } = spec;
    if (!current) status.text = hint;
    else if (shown) status.text = `${done}: ${current.label}. ${again}`;
    else status.text = `${done}: ${current.label}. ${onModel ? 'Tocca sul modello' : 'Segna qui sotto'} ciò che prevedi perso.`;
  };
  for (const r of board.regions) {
    r.fill.userData.ui = {
      key: r.key,
      at: r.inside, // un punto della zona, nelle coordinate della tavola (per le prove)
      cursor: 'pointer',
      hover: (on) => ((r.hover = on), paint()),
      click: () => {
        if (!current) {
          status.text = 'Prima taglia la via sul modello.';
          return;
        }
        if (shown) return;
        if (marks.has(r.key)) marks.delete(r.key);
        else marks.add(r.key);
        paint();
      },
    };
  }
  const list = (keys) => board.describe(keys).join('; ');
  function compare() {
    if (!current) {
      status.text = 'Prima taglia la via sul modello.';
      return;
    }
    if (shown) return;
    shown = true;
    tries += 1;
    onCompare?.();
    const hit = new Set([...marks].filter((k) => current.truth.has(k)));
    const miss = new Set([...current.truth].filter((k) => !marks.has(k)));
    const extra = new Set([...marks].filter((k) => !current.truth.has(k)));
    const exact = !miss.size && !extra.size;
    for (const r of board.regions) {
      const kind = hit.has(r.key) ? 'hit' : miss.has(r.key) ? 'miss' : extra.has(r.key) ? 'extra' : null;
      if (!kind) continue;
      const m = verdictMark(kind);
      m.position.set(r.anchor[0], r.anchor[1], 0);
      symbols.add(m);
    }
    const lines = [];
    if (exact) lines.push(current.truth.size ? `Previsione esatta. ${explain}` : `Previsione esatta: non si perde nulla. ${explain}`);
    else {
      lines.push(`Coincide: ${hit.size ? list(hit) : 'nulla'}.`);
      if (miss.size) lines.push(`Mancava: ${list(miss)}.`);
      if (extra.size) lines.push(`Di troppo: ${list(extra)}.`);
    }
    verdict.text = lines.join('\n').trim();
    verdict.color = exact ? GOOD : INK;
    legend.text = onModel
      ? spec.legend ?? 'sul modello: in scuro ciò che si perde'
      : aside
        ? 'scuro: perso davvero\nrosso: la tua previsione\nspunta: coincide\ncerchio: mancava\ncroce: di troppo'
        : 'scuro: perso davvero · rosso: la tua previsione\nspunta: coincide · cerchio: mancava · croce: di troppo';
    go.setActive(true, exact ? GOOD : ACCENT);
    paint();
    say();
    if (!solved && (exact || tries >= 3)) {
      solved = true;
      redo.show(true);
      // basta per rifare taglio e confronto alla prossima visita
      onSolved?.({ label: current.label, truth: [...current.truth], marks: [...marks], at: current.at ?? null });
    }
  }
  const clear = () => {
    marks.clear();
    shown = false;
    symbols.clear();
    verdict.text = '';
    legend.text = '';
    go.setActive(false);
  };
  const again = () => {
    solved = false;
    saved = null;
    tries = 0;
    redo.show(false);
    onRedo?.(); // la pagina ricuce la via: arriva cut(null), che ripulisce la tavola
  };
  say();
  paint();
  const api = {
    group,
    height: -y + 0.09,
    // risolta in una visita precedente: si rifanno il taglio (sul modello, se il
    // comportamento della pagina sa rifarlo) e il confronto con la previsione di allora
    resume() {
      if (!saved || !Array.isArray(saved.truth)) return;
      solved = true;
      redo.show(true);
      if (!(saved.at && onReplay?.(saved.at))) api.cut({ label: saved.label ?? '', truth: saved.truth });
      if (!current) return;
      for (const k of Array.isArray(saved.marks) ? saved.marks : []) marks.add(k);
      compare();
    },
    // per il comportamento della pagina destra
    get state() {
      return !current ? 'idle' : shown ? 'shown' : 'mark';
    },
    get marks() {
      return marks;
    },
    // un nuovo taglio (o nessuno, con null): la tavola ricomincia da capo. `at` (facoltativo,
    // da salvare in JSON) è ciò che serve al comportamento per rifare lo stesso taglio
    cut(c) {
      clear();
      current = c && { label: c.label, truth: new Set(c.truth), at: c.at };
      say();
      paint();
    },
    // tavola «modello»: una parte toccata entra o esce dalla previsione; null se ora non si segna
    toggle(key) {
      if (!current || shown) return null;
      if (marks.has(key)) marks.delete(key);
      else marks.add(key);
      paint();
      return marks;
    },
  };
  return api;
}
