// Elementi di pagina costruiti come geometria nella scena (niente DOM):
// testo, termini evidenziati, pulsanti, quiz. Tutto vive in coordinate di
// pagina: origine in alto a sinistra, x verso destra, y verso il basso (negativa).
import * as THREE from 'three';
import { Text, getSelectionRects } from 'troika-three-text';

export const FONT = {
  regular: `${import.meta.env.BASE_URL}fonts/NotoSerif-Regular.ttf`,
  italic: `${import.meta.env.BASE_URL}fonts/NotoSerif-Italic.ttf`,
  semi: `${import.meta.env.BASE_URL}fonts/NotoSerif-Medium.ttf`,
  bold: `${import.meta.env.BASE_URL}fonts/NotoSerif-Bold.ttf`,
};
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
export async function quiz({ question, options, correct, explain }, width) {
  const group = new THREE.Group();
  let y = 0;
  const kicker = makeText('DOMANDA', {
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
  for (const [i, label] of options.entries()) {
    const box = 0.026;
    const row = new THREE.Group();
    row.position.y = y;
    const sq = layer(new THREE.Mesh(roundedRect(box, box, 0.005), flat(INK, 0.5)), 2);
    sq.position.set(box / 2, -box / 2 - 0.006, Z_FILL / 2);
    const inner = layer(new THREE.Mesh(roundedRect(box - 0.006, box - 0.006, 0.003), flat(0xfffdf6)), 3);
    inner.position.set(box / 2, -box / 2 - 0.006, Z_FILL);
    const t = makeText(label, { fontSize: 0.026, maxWidth: width - 0.05, lineHeight: 1.3 });
    t.position.x = 0.045;
    row.add(sq, inner, t);
    await ready(t);
    const h = Math.max(bounds(t).h, box) + 0.016;
    const hit = layer(new THREE.Mesh(new THREE.PlaneGeometry(width, h), flat(MARKER, 0)), 1);
    hit.position.set(width / 2, -h / 2 + 0.008, Z_FILL / 4);
    hit.userData.ui = {
      hover: (on) => (hit.material.opacity = on && !solved ? 0.18 : 0),
      cursor: 'pointer',
      click: () => {
        if (solved) return;
        const ok = i === correct;
        inner.material.color.set(ok ? GOOD : BAD);
        t.color = ok ? GOOD : BAD;
        feedback.color = ok ? GOOD : BAD;
        feedback.text = ok ? `Esatto. ${explain}` : 'Non proprio: riguarda il modello e riprova.';
        if (ok) {
          solved = true;
          hit.material.opacity = 0;
        }
      },
    };
    row.add(hit);
    group.add(row);
    rows.push(row);
    y -= h;
  }
  feedback.position.y = y - 0.012;
  group.add(feedback);
  return { group, height: -y + 0.09 };
}
