// Costruisce una doppia pagina a partire dalla sua descrizione:
// sinistra titolo, testo con termini collegati e domanda; destra controlli,
// didascalia e istruzione attorno al modello.
import * as THREE from 'three';
import { PAGE_H } from './book.js';
import { getSelectionRects } from 'troika-three-text';
import { makeText, ready, bounds, richText, quiz, checkbox, handTick, underline, FONT, INK, INK_SOFT, ACCENT, MARKER } from './ui.js';
import { M, W } from './modes.js';

const SMALL = { fontSize: 0.0155, font: FONT.bold, color: INK_SOFT, letterSpacing: 0.12 };
const NAV_Y = -PAGE_H + 0.055;

// --- scoperte: ciò che chi legge ha già esplorato, ricordato dal browser ---------
// Per ogni doppia pagina (chiave `capitolo/n`, come nell'indirizzo):
//   q     la domanda è risolta (vedi `onSolved` in quiz, src/ui.js)
//   all   i comandi della pagina destra (pulsanti e corde), annotati quando la pagina si apre
//   seen  quelli provati
// Si legge lo storage una volta sola; poi conta la copia in memoria, che si riscrive
// a ogni scoperta. Senza storage (o con lo storage bloccato) il libro funziona lo
// stesso e ricorda le scoperte solo fino alla chiusura della pagina.
const STORE = 'semeion:scoperte';
let memory = null;
function discoveries() {
  if (memory) return memory;
  memory = {};
  try {
    const v = JSON.parse(localStorage.getItem(STORE) ?? '{}');
    if (v && typeof v === 'object' && !Array.isArray(v)) memory = v;
  } catch {
    // storage assente o illeggibile: si parte da zero
  }
  return memory;
}
function record(key, change) {
  const all = discoveries();
  const e = all[key] && typeof all[key] === 'object' ? all[key] : {};
  if (change(e) === false) return;
  all[key] = e;
  try {
    localStorage.setItem(STORE, JSON.stringify(all));
  } catch {
    // senza storage le scoperte restano solo in memoria
  }
}
const keyOf = (chapter, i) => `${chapter.id}/${i + 1}`;
function progressOf(key) {
  const e = discoveries()[key];
  const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : null);
  return { q: !!e?.q, all: list(e?.all), seen: list(e?.seen) ?? [] };
}
const solve = (key) => record(key, (e) => (e.q ? false : (e.q = 1)));
const offer = (key, labels) =>
  record(key, (e) => (JSON.stringify(e.all) === JSON.stringify(labels) ? false : (e.all = labels)));
const find = (key, label) =>
  record(key, (e) => {
    if (!label) return false;
    e.seen = Array.isArray(e.seen) ? e.seen : [];
    if (e.seen.includes(label)) return false;
    e.seen.push(label);
  });
// avanzamento di un capitolo: domande risolte e comandi provati (di quelli noti)
function tally(chapter) {
  const t = { done: 0, n: chapter.spreads.length, seen: 0, offered: 0, unopened: 0 };
  chapter.spreads.forEach((_, i) => {
    const p = progressOf(keyOf(chapter, i));
    if (p.q) t.done += 1;
    if (!p.all) t.unopened += 1;
    t.offered += p.all?.length ?? 0;
    t.seen += p.all?.filter((l) => p.seen.includes(l)).length ?? 0;
  });
  return t;
}

// Numeri di pagina. Per sfogliare c'è la barra in fondo allo schermo.
function footer(left, right, ctx) {
  const pn = { fontSize: 0.018, color: INK_SOFT, anchorY: 'middle' };
  const pl = makeText(String(ctx.page * 2), { ...pn, anchorX: 'left' });
  pl.position.set(M, NAV_Y, pl.position.z);
  const pr = makeText(String(ctx.page * 2 + 1), { ...pn, anchorX: 'right' });
  pr.position.set(1 - M, NAV_Y, pr.position.z);
  left.add(pl);
  right.add(pr);
}

export async function buildSpread(def, ctx) {
  const { model } = ctx;
  const left = new THREE.Group();
  const right = new THREE.Group();

  // --- pagina sinistra ------------------------------------------------------
  const kicker = makeText(`NEUROANATOMIA · ${ctx.chapter.title.toUpperCase()}`, SMALL);
  kicker.position.set(M, -0.075, kicker.position.z);
  const counter = makeText(`${ctx.index + 1} / ${ctx.count}`, { ...SMALL, anchorX: 'right' });
  counter.position.set(1 - M, -0.075, counter.position.z);
  left.add(kicker, counter);

  let y = -0.125;
  const title = makeText(def.title, { font: FONT.bold, fontSize: 0.052, maxWidth: W, lineHeight: 1.12 });
  title.position.set(M, y, title.position.z);
  left.add(title);
  await ready(title);
  y -= bounds(title).h + 0.032;

  // collegamento testo <-> modello
  let modeApi = null;
  const setHover = (ids) => {
    model.hover = new Set(ids);
    modeApi?.onHoverSet?.(ids);
  };
  const body = await richText(
    def.body,
    { fontSize: 0.031, lineHeight: 1.45, maxWidth: W },
    (key, on) => {
      setHover(on ? def.terms[key] : []);
      for (const t of body.terms) t.setHot(on && t.key === key);
    }
  );
  body.group.position.set(M, y, 0);
  left.add(body.group);
  // una previsione occupa più spazio (c'è l'aletta): intervalli più stretti
  const gap = def.quiz.predict ? 0.028 : 0.04;
  y -= body.height + gap;

  const rule = new THREE.Mesh(
    new THREE.PlaneGeometry(W, 0.0015),
    new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.25 })
  );
  rule.position.set(0.5, y, 0.001);
  left.add(rule);
  y -= gap;

  const key = keyOf(ctx.chapter, ctx.index);
  // in una previsione la scelta avvia sul modello l'opzione che la mette alla prova
  const q = await quiz(def.quiz, W, {
    onSolved: () => solve(key),
    onPredict: () => def.quiz.reveal != null && modeApi?.choose?.(def.quiz.reveal),
    nameOf: (id) => model.parts.get(id)?.name ?? id,
    onReveal: (ids) => {
      model.hover = new Set(ids);
      modeApi?.onHoverSet?.(ids);
    },
  });
  q.group.position.set(M, y, 0);
  left.add(q.group);
  // la domanda (e l'aletta) non deve scendere sul numero di pagina
  if (y - q.height < NAV_Y + 0.02) console.error(`[pagina] ${ctx.chapter.id}/${ctx.index + 1}: la domanda esce dal fondo di ${(NAV_Y + 0.02 - y + q.height).toFixed(3)}`);

  // --- pagina destra --------------------------------------------------------
  const fig = makeText(`FIG. ${ctx.figure}`, { ...SMALL, anchorX: 'right' });
  fig.position.set(1 - M, -0.075, fig.position.z);
  right.add(fig);

  const controls = new THREE.Group();
  controls.position.set(M, -0.9, 0);
  right.add(controls);

  const caption = makeText(`Fig. ${ctx.figure} — ${def.caption}`, {
    font: FONT.italic, fontSize: 0.0215, maxWidth: W, lineHeight: 1.35, anchorX: 'center', textAlign: 'center',
  });
  caption.position.set(0.5, -1.165, caption.position.z);
  const instruction = makeText(def.instruction, {
    fontSize: 0.0135, font: FONT.bold, color: ACCENT, letterSpacing: 0.1, anchorX: 'center', maxWidth: W, textAlign: 'center',
  });
  instruction.position.set(0.5, -1.25, instruction.position.z);
  right.add(caption, instruction);

  await footer(left, right, ctx);

  // --- comportamento del modello --------------------------------------------
  // i comandi della pagina destra si annotano da soli (vedi `explore` in modes.js)
  const offered = [];
  controls.userData.explore = {
    offer: (label) => label && !offered.includes(label) && offered.push(label),
    found: (label) => find(key, label),
  };
  modeApi = await def.mode({ model, controls, def });
  offer(key, offered);
  await Promise.all([ready(caption), ready(instruction), ready(kicker), ready(counter), ready(fig)]);

  return {
    left,
    right,
    update: () => {
      modeApi.update?.();
      q.update?.();
    },
    enter() {
      model.reset();
      model.zoomTo?.(def.view?.focus ?? null);
      // modello -> testo: la struttura sotto il puntatore accende i termini collegati
      model.onHover = (id) => {
        setHover(id ? [id] : []);
        for (const t of body.terms) t.setHot(!!id && def.terms[t.key].includes(id));
      };
      modeApi.enter?.();
      // «indica sul modello»: ogni clic su una parte arriva anche alla domanda
      if (q.point) {
        const own = model.onClick;
        model.onClick = (id, hit) => {
          q.point(id);
          own?.(id, hit);
        };
      }
    },
  };
}

// Frontespizio con l'indice dei capitoli, raggruppati per parti su due colonne.
export async function buildToc(chapters, parts, ctx) {
  const left = new THREE.Group();
  const right = new THREE.Group();

  const kicker = makeText('SEMEION', { ...SMALL, color: ACCENT });
  kicker.position.set(M, -0.3, kicker.position.z);
  const title = makeText('Neuroanatomia\nda esplorare', { font: FONT.bold, fontSize: 0.078, lineHeight: 1.08, maxWidth: W });
  title.position.set(M, -0.34, title.position.z);
  await ready(title);
  const intro = makeText(
    "Ogni doppia pagina tratta una sola idea. A sinistra poche righe di testo e una domanda; a destra un modello anatomico in piedi sulla pagina, da ruotare, accendere e tagliare. Passa su un termine evidenziato e la struttura si illumina nel modello; tocca una struttura e si accende il termine.",
    { fontSize: 0.029, lineHeight: 1.5, maxWidth: W * 0.92, font: FONT.italic }
  );
  intro.position.set(M, -0.34 - bounds(title).h - 0.06, intro.position.z);
  const credit = makeText(
    'Mesh anatomiche: BodyParts3D, © The Database Center for Life Science, CC Attribution 4.0 International; Z-Anatomy, the libre 3D atlas of anatomy, CC BY-SA 4.0.',
    { fontSize: 0.0165, lineHeight: 1.4, maxWidth: W, color: INK_SOFT }
  );
  credit.position.set(M, NAV_Y + 0.03, credit.position.z);
  left.add(kicker, title, intro, credit);
  const introReady = ready(intro);
  // avanzamento di tutto il libro, se si è già cominciato
  const sums = chapters.map(tally);
  const done = sums.reduce((a, t) => a + t.done, 0);
  if (done) {
    await introReady;
    const all = sums.reduce((a, t) => a + t.n, 0);
    const so = makeText(
      `Domande risolte: ${done} su ${all}. Il numero rosso accanto a ogni capitolo porta al suo riepilogo, «Da scoprire».`,
      { fontSize: 0.0235, lineHeight: 1.4, maxWidth: W * 0.92, color: ACCENT, font: FONT.italic }
    );
    so.position.set(M, intro.position.y - bounds(intro).h - 0.04, so.position.z);
    left.add(so);
    await ready(so);
  }

  // righe dell'indice: intestazioni di parte e capitoli numerati
  const rows = [];
  for (const part of [...parts, ...new Set(chapters.map((c) => c.part).filter((p) => !parts.includes(p)))]) {
    const list = chapters.filter((c) => c.part === part);
    if (!list.length) continue;
    rows.push({ part });
    for (const ch of list) rows.push({ ch, n: chapters.indexOf(ch) + 1 });
  }
  const colW = (W - 0.04) / 2;
  const lineH = 0.046, headH = 0.046, gapH = 0.016, top = -0.15;
  // prima si misurano le righe (un titolo lungo va a capo), poi si dividono
  // in due colonne di altezza simile, senza spezzare una parte
  // a destra di ogni capitolo l'avanzamento: «2/5» domande risolte, la spunta a capitolo finito
  const size = { fontSize: 0.0225, maxWidth: colW - 0.055 - 0.05, lineHeight: 1.25 };
  for (const row of rows) {
    if (row.part) {
      row.h = headH;
      continue;
    }
    row.name = makeText(row.ch.title, { font: FONT.semi, ...size });
    await ready(row.name);
    row.h = Math.max(lineH, bounds(row.name).h + 0.018);
  }
  const total = rows.reduce((sum, r) => sum + r.h + (r.part ? gapH : 0), 0);
  let col = 0;
  let y = top;
  let used = 0;
  const waits = [];
  for (const [i, row] of rows.entries()) {
    if (row.part && col === 0) {
      let partH = row.h;
      for (let k = i + 1; k < rows.length && !rows[k].part; k++) partH += rows[k].h;
      if (used + partH / 2 > total / 2) {
        col = 1;
        y = top;
      }
    }
    const x = M + col * (colW + 0.04);
    used += row.h + (row.part ? gapH : 0);
    if (row.part) {
      if (y !== top) y -= gapH;
      const t = makeText(row.part.toUpperCase(), { ...SMALL, fontSize: 0.0135, color: ACCENT });
      t.position.set(x, y - 0.014, t.position.z);
      right.add(t);
      waits.push(ready(t));
      y -= row.h;
      continue;
    }
    const num = makeText(String(row.n), { font: FONT.bold, fontSize: 0.021, color: ACCENT, anchorX: 'right' });
    num.position.set(x + 0.034, y - 0.009, num.position.z);
    row.name.position.set(x + 0.05, y - 0.008, row.name.position.z);
    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(colW, row.h),
      new THREE.MeshBasicMaterial({ color: MARKER, transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.set(x + colW / 2, y - row.h / 2, 0.0004);
    hit.renderOrder = 1;
    hit.userData.ui = {
      hover: (on) => (hit.material.opacity = on ? 0.25 : 0),
      click: () => ctx.openChapter(chapters.indexOf(row.ch)),
      cursor: 'pointer',
      tip: row.ch.blurb,
    };
    right.add(hit, num, row.name);
    waits.push(ready(num));
    const t = tally(row.ch);
    if (t.done) {
      // capitolo finito: al posto del numero la spunta a mano
      const xr = x + colW - 0.004;
      if (t.done === t.n) {
        const tick = handTick();
        tick.position.set(xr - 0.038, y - 0.002, tick.position.z);
        right.add(tick);
      } else {
        const score = makeText(`${t.done}/${t.n}`, { font: FONT.semi, fontSize: 0.02, color: ACCENT, anchorX: 'right' });
        score.position.set(xr, y - 0.009, score.position.z);
        right.add(score);
        waits.push(ready(score));
      }
      // il numero porta al riepilogo del capitolo
      const toSummary = new THREE.Mesh(
        new THREE.PlaneGeometry(0.075, row.h),
        new THREE.MeshBasicMaterial({ color: MARKER, transparent: true, opacity: 0, depthWrite: false })
      );
      toSummary.position.set(xr - 0.0375, y - row.h / 2, 0.0007);
      toSummary.renderOrder = 1;
      toSummary.userData.ui = {
        hover: (on) => (toSummary.material.opacity = on ? 0.45 : 0),
        click: () => ctx.go(row.ch.summary),
        cursor: 'pointer',
        tip: t.done === t.n ? 'Da scoprire: tutte le domande risolte' : `Da scoprire: ${t.done} di ${t.n} domande risolte`,
      };
      right.add(toSummary);
    }
    y -= row.h;
  }
  const head = makeText('INDICE', SMALL);
  head.position.set(M, -0.075, head.position.z);
  const hint = makeText('SCEGLI UN CAPITOLO · FRECCE DELLA TASTIERA PER SFOGLIARE', {
    fontSize: 0.0135, font: FONT.bold, color: ACCENT, letterSpacing: 0.1, anchorX: 'center', maxWidth: W, textAlign: 'center',
  });
  hint.position.set(0.5, -1.27, hint.position.z);
  right.add(head, hint);
  await Promise.all([ready(kicker), introReady, ready(credit), ready(head), ready(hint), ...waits]);
  return { left, right, enter() {} };
}

// --- Riepilogo «Da scoprire», in fondo a ogni capitolo ----------------------------
// Sinistra: una voce per doppia pagina, con la casella che prende la spunta rossa
// quando la domanda è risolta, il titolo e la domanda. Destra: per ogni figura i
// comandi della pagina del modello, quelli provati in rosso e sottolineati a penna.
// Ogni voce si tocca per tornare a quella pagina. Niente modello su questa doppia pagina.
const SEP = '  ·  ';
const BOTTOM = NAV_Y + 0.02;

function rowHit(w, h, onClick, tip) {
  const hit = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ color: MARKER, transparent: true, opacity: 0, depthWrite: false })
  );
  hit.renderOrder = 1;
  hit.userData.ui = { hover: (on) => (hit.material.opacity = on ? 0.2 : 0), click: onClick, cursor: 'pointer', tip };
  return hit;
}

export async function buildSummary(chapter, ctx) {
  const left = new THREE.Group();
  const right = new THREE.Group();
  const t = tally(chapter);
  const waits = [];
  // i testi che non si misurano subito si aspettano alla fine (troika richiama
  // solo il primo sync: `ready` va chiamata una volta per testo)
  const add = (page, o, wait = true) => (page.add(o), wait && waits.push(ready(o)), o);
  const go = (i) => () => ctx.go(chapter.first + i);

  // --- sinistra: le domande ---------------------------------------------------
  const kicker = add(left, makeText(`NEUROANATOMIA · ${chapter.title.toUpperCase()}`, SMALL));
  kicker.position.set(M, -0.075, kicker.position.z);
  const counter = add(left, makeText('RIEPILOGO', { ...SMALL, anchorX: 'right' }));
  counter.position.set(1 - M, -0.075, counter.position.z);
  let y = -0.125;
  const title = add(left, makeText('Da scoprire', { font: FONT.bold, fontSize: 0.052, maxWidth: W }), false);
  title.position.set(M, y, title.position.z);
  await ready(title);
  y -= bounds(title).h + 0.022;
  const lead = add(
    left,
    makeText(
      t.done === t.n
        ? 'Tutte le domande del capitolo sono risolte. Tocca una voce per tornare a quella pagina.'
        : `${t.done === 1 ? '1 domanda risolta' : `${t.done} domande risolte`} su ${t.n}. Tocca una voce per tornare a quella pagina.`,
      { font: FONT.italic, fontSize: 0.0235, color: INK_SOFT, maxWidth: W, lineHeight: 1.35 }
    ),
    false
  );
  lead.position.set(M, y, lead.position.z);
  await ready(lead);
  y -= bounds(lead).h + 0.04;

  // prima si misura tutto; se le domande non ci stanno restano nel suggerimento al passaggio
  const textW = W - 0.05;
  const entries = [];
  for (const [i, def] of chapter.spreads.entries()) {
    const name = makeText(def.title, { font: FONT.semi, fontSize: 0.03, maxWidth: textW, lineHeight: 1.2 });
    const ask = makeText(def.quiz.question, { font: FONT.italic, fontSize: 0.0225, color: INK_SOFT, maxWidth: textW, lineHeight: 1.3 });
    await Promise.all([ready(name), ready(ask)]);
    entries.push({ i, def, name, ask, p: progressOf(keyOf(chapter, i)) });
  }
  // che cosa spunta una voce, in fondo alla lista se c'è posto
  const note = makeText(
    'Una voce prende la spunta quando la sua domanda è risolta: la risposta giusta, la previsione verificata sotto l’aletta, la struttura indicata sul modello, tutte le etichette al loro posto.',
    { font: FONT.italic, fontSize: 0.0205, color: INK_SOFT, maxWidth: W, lineHeight: 1.35 }
  );
  await ready(note);
  const gap = 0.045;
  const full = entries.reduce((h, e) => h + bounds(e.name).h + 0.008 + bounds(e.ask).h + gap, 0);
  const withAsk = y - full > BOTTOM;
  for (const e of entries) {
    const h = bounds(e.name).h + (withAsk ? 0.008 + bounds(e.ask).h : 0);
    const { group: box, tick } = checkbox();
    tick.visible = e.p.q;
    box.position.set(M, y + 0.001, 0);
    e.name.position.set(M + 0.045, y, e.name.position.z);
    left.add(box, e.name);
    if (withAsk) {
      e.ask.position.set(M + 0.045, y - bounds(e.name).h - 0.008, e.ask.position.z);
      left.add(e.ask);
    }
    const hit = rowHit(W + 0.02, h + gap * 0.8, go(e.i), withAsk ? undefined : e.def.quiz.question);
    hit.position.set(0.5, y - h / 2 + 0.004, 0.0004);
    left.add(hit);
    y -= h + gap;
  }
  if (y + gap < BOTTOM) console.error(`[pagina] ${chapter.id}/riepilogo: la lista esce dal fondo di ${(BOTTOM - y - gap).toFixed(3)}`);
  if (y - 0.01 - bounds(note).h > BOTTOM) {
    note.position.set(M, y - 0.01, note.position.z);
    left.add(note);
  }

  // --- destra: i comandi provati sulla pagina del modello -------------------------
  const head = add(right, makeText('SULLA PAGINA DEL MODELLO', SMALL));
  head.position.set(M, -0.075, head.position.z);
  const n = ctx.number;
  y = -0.14;
  for (const e of entries) {
    const top = y;
    const fig = add(right, makeText(`FIG. ${n}.${e.i + 1}`, { ...SMALL, fontSize: 0.0135, color: ACCENT }));
    fig.position.set(M, y, fig.position.z);
    const { all, seen } = e.p;
    const tried = all?.filter((l) => seen.includes(l)).length ?? 0;
    if (all?.length) {
      const count = add(right, makeText(`${tried} di ${all.length}`, { font: FONT.italic, fontSize: 0.019, color: INK_SOFT, anchorX: 'right' }));
      count.position.set(1 - M, y + 0.004, count.position.z);
    }
    y -= 0.03;
    let line;
    if (!all) line = makeText('pagina non ancora aperta', { font: FONT.italic, fontSize: 0.021, color: INK_SOFT, maxWidth: W });
    else if (!all.length) line = makeText('nessun comando: si esplora sul modello', { font: FONT.italic, fontSize: 0.021, color: INK_SOFT, maxWidth: W });
    else {
      // i comandi in fila, quelli provati in rosso; i colori per intervallo vanno passati lineari
      const lin = (hex) => new THREE.Color(hex).getHex(THREE.LinearSRGBColorSpace);
      let plain = '';
      const ranges = {};
      const marks = [];
      for (const [k, l] of all.entries()) {
        if (k) {
          ranges[plain.length] = { color: lin(INK_SOFT), font: FONT.regular };
          plain += SEP;
        }
        const on = seen.includes(l);
        ranges[plain.length] = on ? { color: lin(ACCENT), font: FONT.semi } : { color: lin(INK_SOFT), font: FONT.regular };
        if (on) marks.push([plain.length, plain.length + l.length]);
        plain += l;
      }
      line = makeText(plain, { fontSize: 0.0215, maxWidth: W, lineHeight: 1.5, styleRanges: ranges });
      await ready(line);
      for (const [a, b] of marks)
        for (const r of getSelectionRects(line.textRenderInfo, a, b)) line.add(underline(r.left, r.right, r.bottom + 0.002));
    }
    if (!all?.length) await ready(line);
    line.position.set(M, y, line.position.z);
    right.add(line);
    y -= bounds(line).h + 0.034;
    const hit = rowHit(W + 0.02, top - y - 0.01, go(e.i));
    hit.position.set(0.5, (top + y) / 2 + 0.008, 0.0004);
    right.add(hit);
  }
  const total = add(
    right,
    makeText(
      t.offered
        ? `Comandi provati: ${t.seen} su ${t.offered}${t.unopened ? ', nelle pagine già aperte' : ''}.`
        : 'Apri le pagine del capitolo per vederne i comandi.',
      { font: FONT.italic, fontSize: 0.0215, maxWidth: W, anchorX: 'center', textAlign: 'center', color: INK }
    )
  );
  total.position.set(0.5, -1.18, total.position.z);
  const hint = add(
    right,
    makeText('TOCCA UNA VOCE PER TORNARE A QUELLA PAGINA', {
      fontSize: 0.0135, font: FONT.bold, color: ACCENT, letterSpacing: 0.1, anchorX: 'center', maxWidth: W, textAlign: 'center',
    })
  );
  hint.position.set(0.5, -1.25, hint.position.z);
  if (y + 0.034 < -1.16) console.error(`[pagina] ${chapter.id}/riepilogo: i comandi escono sulla riga in fondo`);
  footer(left, right, ctx);
  await Promise.all(waits);
  return { left, right, enter() {} };
}
