// Costruisce una doppia pagina a partire dalla sua descrizione:
// sinistra titolo, testo con termini collegati e domanda; destra controlli,
// didascalia e istruzione attorno al modello.
import * as THREE from 'three';
import { PAGE_H } from './book.js';
import { makeText, ready, bounds, richText, quiz, FONT, INK, INK_SOFT, ACCENT, MARKER } from './ui.js';
import { M, W } from './modes.js';

const SMALL = { fontSize: 0.0155, font: FONT.bold, color: INK_SOFT, letterSpacing: 0.12 };
const NAV_Y = -PAGE_H + 0.055;

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

  // in una previsione la scelta avvia sul modello l'opzione che la mette alla prova
  const q = await quiz(def.quiz, W, {
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
  modeApi = await def.mode({ model, controls, def });
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
  const size = { fontSize: 0.0225, maxWidth: colW - 0.055, lineHeight: 1.25 };
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
    y -= row.h;
  }
  const head = makeText('INDICE', SMALL);
  head.position.set(M, -0.075, head.position.z);
  const hint = makeText('SCEGLI UN CAPITOLO · FRECCE DELLA TASTIERA PER SFOGLIARE', {
    fontSize: 0.0135, font: FONT.bold, color: ACCENT, letterSpacing: 0.1, anchorX: 'center', maxWidth: W, textAlign: 'center',
  });
  hint.position.set(0.5, -1.27, hint.position.z);
  right.add(head, hint);
  await Promise.all([ready(kicker), ready(intro), ready(credit), ready(head), ready(hint), ...waits]);
  return { left, right, enter() {} };
}
