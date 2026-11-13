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
export async function quiz(def, width, hooks = {}) {
  if (def.point) return pointQuiz(def, width, hooks);
  if (def.tags) return tagQuiz(def, width, hooks);
  const { question, options, correct, explain, why = [], predict = false } = def;
  const { onPredict } = hooks;
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText(predict ? 'PREDICI' : 'DOMANDA', {
    fontSize: 0.016,
    font: FONT.bold,
    color: ACCENT,
    letterSpacing: 0.14,
  });
  group.add(kicker);
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
  const box = 0.026;
  for (const [i, label] of options.entries()) {
    const row = new THREE.Group();
    row.position.y = y;
    const sq = layer(new THREE.Mesh(roundedRect(box, box, 0.005), flat(INK, 0.5)), 2);
    sq.position.set(box / 2, -box / 2 - 0.006, Z_FILL / 2);
    const inner = layer(new THREE.Mesh(roundedRect(box - 0.006, box - 0.006, 0.003), flat(0xfffdf6)), 3);
    inner.position.set(box / 2, -box / 2 - 0.006, Z_FILL);
    // spunta a mano, che esce dalla casella come in un quaderno
    const tick = layer(
      new THREE.Mesh(
        stroke([[0.004, -0.019], [0.009, -0.025], [0.013, -0.031], ...bezier([0.013, -0.031], [0.02, -0.012], [0.036, 0.001], 8)], 0.0038),
        flat(ACCENT)
      ),
      5
    );
    tick.position.z = Z_TEXT;
    tick.visible = false;
    const t = makeText(label, { fontSize: 0.026, maxWidth: width - 0.05, lineHeight: 1.3 });
    t.position.x = 0.045;
    row.add(sq, inner, tick, t);
    await ready(t);
    const h = Math.max(bounds(t).h, box) + 0.016;
    const hit = layer(new THREE.Mesh(new THREE.PlaneGeometry(width, h), flat(MARKER, 0)), 1);
    hit.position.set(width / 2, -h / 2 + 0.008, Z_FILL / 4);
    hit.userData.ui = {
      hover: (on) => (hit.material.opacity = on && !solved ? 0.18 : 0),
      cursor: 'pointer',
      click: () => {
        if (solved) return;
        if (predict) {
          // la previsione si può cambiare finché l'aletta è chiusa
          chosen = i;
          rows.forEach((r, j) => (r.tick.visible = j === i));
          flap.arm();
          onPredict?.(i);
          return;
        }
        const ok = i === correct;
        inner.material.color.set(ok ? GOOD : BAD);
        t.color = ok ? GOOD : BAD;
        feedback.color = ok ? GOOD : BAD;
        feedback.text = ok ? `Esatto. ${explain}` : why[i] ? `Non proprio. ${why[i]} Riprova.` : 'Non proprio: riguarda il modello e riprova.';
        if (ok) {
          solved = true;
          hit.material.opacity = 0;
        }
      },
    };
    row.add(hit);
    group.add(row);
    rows.push({ row, tick, text: t, inner, hit });
    y -= h;
  }
  if (!predict) {
    feedback.position.y = y - 0.012;
    group.add(feedback);
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
  const fh = makeText('solleva qui', { fontSize: 0.02, font: FONT.italic, color: 0x2c3e66, anchorX: 'right' });
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
  const arrowMat = flat(0x2c3e66, 0.9);
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
      if (!solved) reveal();
    },
    get cursor() {
      return armed ? 'pointer' : 'default';
    },
  };
  pocket.userData.ui = { click: () => (open = false), cursor: 'pointer' };
  flap = {
    arm() {
      if (armed) return;
      armed = true;
      fs.text = 'Ora guarda il modello, poi controlla.';
    },
  };
  y -= cardH;

  return {
    group,
    height: -y + 0.01,
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

// --- Indica sul modello -------------------------------------------------------
// La risposta è una struttura: chi legge la tocca sul modello. Ogni tocco
// sbagliato dice che cosa si è indicato e, se c'è, perché non è quella giusta;
// dopo tre tentativi la struttura giusta si accende da sola.
async function pointQuiz({ question, point, explain, why = {} }, width, { nameOf = (id) => id, onReveal } = {}) {
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText('INDICA SUL MODELLO', { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  group.add(kicker);
  y -= 0.03;
  const q = makeText(question, { fontSize: 0.027, font: FONT.semi, maxWidth: width, lineHeight: 1.35 });
  q.position.y = y;
  group.add(q);
  await ready(q);
  y -= bounds(q).h + 0.018;

  // invito, con una freccia a mano che punta alla pagina del modello
  const hint = makeText('tocca la struttura sul modello', { fontSize: 0.023, font: FONT.italic, color: 0x2c3e66 });
  hint.position.set(0.004, y, Z_TEXT);
  await ready(hint);
  const hb = bounds(hint);
  const ax = hb.w + 0.02;
  const ay = y - hb.h / 2;
  const arrowMat = flat(0x2c3e66, 0.9);
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
  return {
    group,
    height: -y + 0.11,
    // chiamata dallo spread a ogni clic su una parte del modello
    point(id) {
      if (solved) return;
      if (point.includes(id)) {
        solved = true;
        feedback.color = GOOD;
        feedback.text = `Esatto: ${nameOf(id)}. ${explain}`;
        hint.text = 'trovata';
        hint.color = GOOD;
        arrowMat.opacity = 0;
        return;
      }
      tries += 1;
      feedback.color = BAD;
      const said = `Hai indicato: ${nameOf(id)}.${why[id] ? ` ${why[id]}` : ''}`;
      if (tries < 3) {
        feedback.text = `${said} Riprova.`;
        return;
      }
      solved = true;
      feedback.text = `${said} La risposta giusta ora è accesa sul modello: ${answer}. ${explain}`;
      hint.text = '';
      arrowMat.opacity = 0;
      onReveal?.(point);
    },
  };
}

// --- Etichette da trascinare ----------------------------------------------------
// Cartellini sulla pagina: si afferrano e si lasciano sulla struttura del modello.
// Al posto giusto il cartellino torna nella sua casella e un cordino rosso lo lega
// alla struttura, come le etichette a mano di una tavola anatomica.
const CORD = 0x9c2f22;
async function tagQuiz({ question, tags, explain, why = {} }, width, { nameOf = (id) => id } = {}) {
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText('TRASCINA LE ETICHETTE', { fontSize: 0.016, font: FONT.bold, color: ACCENT, letterSpacing: 0.14 });
  group.add(kicker);
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
            it.placed = id;
            // il cordino si appunta dove è stato lasciato il cartellino, e segue il modello
            it.pin = { object: under.object, local: under.object.worldToLocal(under.hit.point.clone()) };
            tick.visible = true;
            done += 1;
            feedback.color = GOOD;
            feedback.text = done === tags.length ? `Tutte al loro posto. ${explain ?? ''}` : `«${tag.label}»: esatto.`;
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

  const up = new THREE.Vector3(0, 1, 0);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  let last = performance.now();
  return {
    group,
    height: -y + 0.08,
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
