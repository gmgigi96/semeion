// Costruisce una doppia pagina a partire dalla sua descrizione:
// sinistra titolo, testo con termini collegati e domanda; destra controlli,
// didascalia e istruzione attorno al modello.
import * as THREE from 'three';
import { PAGE_H } from './book.js';
import { makeText, ready, bounds, richText, chip, quiz, FONT, INK, INK_SOFT, ACCENT, MARKER } from './ui.js';
import { M, W } from './modes.js';

const SMALL = { fontSize: 0.0155, font: FONT.bold, color: INK_SOFT, letterSpacing: 0.12 };
const NAV_Y = -PAGE_H + 0.055;

async function footer(left, right, ctx) {
  const pn = { fontSize: 0.018, color: INK_SOFT, anchorY: 'middle' };
  const pl = makeText(String(ctx.page * 2), { ...pn, anchorX: 'left' });
  pl.position.set(M, NAV_Y, pl.position.z);
  const pr = makeText(String(ctx.page * 2 + 1), { ...pn, anchorX: 'right' });
  pr.position.set(1 - M, NAV_Y, pr.position.z);
  left.add(pl);
  right.add(pr);
  let x = M + 0.05;
  if (ctx.hasPrev) {
    const c = await chip('‹ indietro', { fontSize: 0.018, onClick: () => ctx.nav(-1) });
    c.group.position.set(x + c.w / 2, NAV_Y, 0);
    left.add(c.group);
    x += c.w + 0.014;
    const toc = await chip('indice', { fontSize: 0.018, onClick: () => ctx.toc() });
    toc.group.position.set(x + toc.w / 2, NAV_Y, 0);
    left.add(toc.group);
  }
  if (ctx.hasNext) {
    const c = await chip('avanti ›', { fontSize: 0.018, onClick: () => ctx.nav(1) });
    c.group.position.set(1 - M - 0.05 - c.w / 2, NAV_Y, 0);
    right.add(c.group);
  }
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
  y -= body.height + 0.04;

  const rule = new THREE.Mesh(
    new THREE.PlaneGeometry(W, 0.0015),
    new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.25 })
  );
  rule.position.set(0.5, y, 0.001);
  left.add(rule);
  y -= 0.04;

  const q = await quiz(def.quiz, W);
  q.group.position.set(M, y, 0);
  left.add(q.group);

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
    update: () => modeApi.update?.(),
    enter() {
      model.reset();
      // modello -> testo: la struttura sotto il puntatore accende i termini collegati
      model.onHover = (id) => {
        setHover(id ? [id] : []);
        for (const t of body.terms) t.setHot(!!id && def.terms[t.key].includes(id));
      };
      modeApi.enter?.();
    },
  };
}

// Frontespizio con l'indice dei capitoli.
export async function buildToc(chapters, ctx) {
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
  left.add(kicker, title, intro);

  const head = makeText('INDICE', SMALL);
  head.position.set(M, -0.16, head.position.z);
  right.add(head);
  let y = -0.215;
  for (const [i, ch] of chapters.entries()) {
    const row = new THREE.Group();
    row.position.set(M, y, 0);
    const num = makeText(String(i + 1), { font: FONT.bold, fontSize: 0.06, color: ACCENT, anchorY: 'top' });
    const name = makeText(ch.title, { font: FONT.bold, fontSize: 0.038 });
    name.position.x = 0.085;
    name.position.y = -0.004;
    const sub = makeText(`${ch.blurb}  ·  ${ch.spreads.length} doppie pagine`, {
      font: FONT.italic, fontSize: 0.0215, color: INK_SOFT, maxWidth: W - 0.09, lineHeight: 1.35,
    });
    sub.position.set(0.085, -0.056, sub.position.z);
    await ready(sub);
    const h = 0.056 + bounds(sub).h + 0.03;
    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(W + 0.04, h),
      new THREE.MeshBasicMaterial({ color: MARKER, transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.set(W / 2, -h / 2 + 0.012, 0.0004);
    hit.renderOrder = 1;
    hit.userData.ui = {
      hover: (on) => (hit.material.opacity = on ? 0.22 : 0),
      click: () => ctx.openChapter(i),
      cursor: 'pointer',
    };
    row.add(hit, num, name, sub);
    right.add(row);
    y -= h + 0.022;
  }
  const hint = makeText('SCEGLI UN CAPITOLO · FRECCE DELLA TASTIERA PER SFOGLIARE', {
    fontSize: 0.0135, font: FONT.bold, color: ACCENT, letterSpacing: 0.1, anchorX: 'center', maxWidth: W, textAlign: 'center',
  });
  hint.position.set(0.5, -1.25, hint.position.z);
  right.add(hint);
  await Promise.all([ready(kicker), ready(intro), ready(head), ready(hint)]);
  return { left, right, enter() {} };
}
