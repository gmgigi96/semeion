import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Text } from 'troika-three-text';
import { Book, PAGE_H } from './book.js';
import { buildSpread, buildToc, buildSummary } from './spread.js';
import { CHAPTERS, PARTS } from './chapters/index.js';
import { FONT, FONT_SCALE } from './ui.js';
import { createBar } from './bar.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.localClippingEnabled = true; // i primi piani tagliano ciò che esce dalla pagina
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.95;
document.body.appendChild(renderer.domElement);

const DESK = 0x66777b; // grigio ardesia, come il sottomano
const scene = new THREE.Scene();
scene.background = new THREE.Color(DESK);
scene.fog = new THREE.Fog(DESK, 9, 30);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.45;

const sun = new THREE.DirectionalLight(0xfff1dc, 1.9);
sun.position.set(-1.6, 3.2, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -1.7, right: 1.7, top: 1.5, bottom: -1.5, near: 0.5, far: 8 });
sun.shadow.bias = -0.0004;
sun.shadow.radius = 5;
scene.add(sun, new THREE.HemisphereLight(0xffffff, 0x54605c, 0.3));

const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 60);
// Tre inquadrature: il libro chiuso sulla scrivania, la doppia pagina da
// leggere, il primo piano del modello.
const VIEW_DIR = new THREE.Vector3(0, 1.5, 1).normalize();
const VIEW_TARGET = new THREE.Vector3(0, 0.1, 0.0);
const CLOSED_DIR = new THREE.Vector3(0, 0.74, 1).normalize();
const CLOSED_TARGET = new THREE.Vector3(0, 0.02, 0.06);
const FOCUS_TARGET = new THREE.Vector3(0.5, 0.42, -0.02);
const FOCUS_RADIUS = 0.5;
const LEAN_MAX = 2.4;
let readDist = 7, closedDist = 5, focusDist = 3;
const readTarget = VIEW_TARGET.clone(); // spostati verso chi guarda per far posto alla barra
const closedTarget = CLOSED_TARGET.clone();

const book = new Book();
scene.add(book.desk, book.group);

// I modelli si costruiscono alla prima pagina che li usa.
const MODEL_SCALE = 0.9;
const models = {};
let active = null; // modello sulla pagina corrente
// Capitoli con la stessa chiave `model` condividono lo stesso modello.
function modelFor(chapter) {
  if (!chapter) return null;
  const key = chapter.model ?? chapter.id;
  if (!models[key]) {
    const m = (models[key] = chapter.createModel());
    m.group.position.set(0.5, 0.001, -PAGE_H / 2 + 0.66);
    m.group.scale.setScalar(MODEL_SCALE);
    m.group.visible = false;
    scene.add(m.group);
  }
  return models[key];
}

// Sequenza piatta delle doppie pagine: indice, poi i capitoli uno dopo l'altro.
// Ogni capitolo finisce con il riepilogo «Da scoprire», dopo le sue doppie pagine:
// così i numeri nell'indirizzo delle pagine esistenti non cambiano.
const PAGES = [{ toc: true }];
for (const chapter of CHAPTERS) {
  chapter.first = PAGES.length;
  chapter.spreads.forEach((def, index) => PAGES.push({ chapter, def, index }));
  chapter.summary = PAGES.length;
  PAGES.push({ chapter, summary: true, index: chapter.spreads.length });
}

// etichetta che segue il puntatore sul modello
const tip = new Text();
Object.assign(tip, {
  font: FONT.semi, fontSize: 0.026 * FONT_SCALE, color: 0x2a2520, anchorX: 'center', anchorY: 'bottom',
  outlineWidth: '10%', outlineColor: 0xfbf6ea,
});
tip.material.depthTest = false;
tip.renderOrder = 50;
tip.visible = false;
scene.add(tip);

// --- stato ---------------------------------------------------------------------
let current = null;
let index = -1;
let busy = false;
let grow = 0; // 0 = modello ripiegato, 1 = in piedi
let growTarget = 0;
let zoom = 1; // ingrandimento del modello chiesto dalla pagina
let zoomTarget = 1;
let isOpen = false; // il libro è (o sta per essere) aperto
let openness = 0; // 0 chiuso, 1 aperto
let peek = 0; // copertina socchiusa sotto il puntatore
let peekTarget = 0;
// Primo piano: 0 = si legge la pagina, 1 = il modello riempie lo schermo,
// oltre 1 ci si avvicina ancora.
let lean = 0;
let leanTarget = 0;
let elevation = 0.5; // altezza dello sguardo nel primo piano (radianti)

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// --- barra dei comandi -------------------------------------------------------------
const bar = createBar({
  toc: () => goTo(0),
  prev: () => goTo(index - 1),
  next: () => (isOpen ? goTo(index + 1) : openBook()),
  where: () => (isOpen ? goTo(0) : openBook()),
  focus: () => setLean(leanTarget > 0.3 ? 0 : 1),
  book: () => (isOpen ? closeBook() : openBook()),
});

function refreshBar() {
  const page = PAGES[index];
  if (!page) return;
  const n = page.chapter ? CHAPTERS.indexOf(page.chapter) + 1 : null;
  if (!isOpen)
    bar.set({
      closed: true,
      title: 'Apri il libro',
      sub: page.toc ? 'dall’indice' : `segnalibro: ${page.chapter.title}`,
    });
  else
    bar.set({
      atToc: !!page.toc,
      hasPrev: index > 0,
      hasNext: index < PAGES.length - 1,
      num: n,
      title: page.toc ? 'Indice' : page.chapter.title,
      sub: page.toc ? `${CHAPTERS.length} capitoli` : page.summary ? 'da scoprire' : `${page.index + 1} di ${page.chapter.spreads.length}`,
      hasModel: !!page.def,
      focus: leanTarget > 0.3,
    });
}

function setLean(v) {
  const was = leanTarget > 0.3;
  leanTarget = active && isOpen ? clamp(v, 0, LEAN_MAX) : 0;
  if (leanTarget < 0.04) leanTarget = 0;
  if (leanTarget === 0) elevationHome();
  if (was !== leanTarget > 0.3) refreshBar();
}
const elevationHome = () => (elevation = 0.5);

// --- inquadratura: il libro (e il modello in piedi) sempre interi -----------
// Distanza minima da cui tutti i punti stanno nello schermo, lasciando libero
// in basso lo spazio della barra.
function fitDistance(dir, target, pts, { x = 0.95, top = 0.93 } = {}) {
  const bottom = -1 + (2 * bar.reserved) / innerHeight;
  let lo = 1, hi = 30;
  for (let i = 0; i < 24; i++) {
    const d = (lo + hi) / 2;
    camera.position.copy(target).addScaledVector(dir, d);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    const out = pts.some((p) => {
      const n = p.clone().project(camera);
      return Math.abs(n.x) > x || n.y > top || n.y < bottom;
    });
    if (out) lo = d;
    else hi = d;
  }
  return hi;
}

// Sposta il punto guardato verso chi legge finché il soggetto è il più grande
// possibile nello spazio rimasto sopra la barra.
function frame(dir, base, target, pts, opts) {
  let best = Infinity;
  const t = new THREE.Vector3();
  for (let k = 0; k <= 16; k++) {
    t.copy(base).z += k * 0.025;
    const d = fitDistance(dir, t, pts, opts);
    if (d < best - 1e-4) (best = d), target.copy(t);
  }
  return best;
}

function fit() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  const open = [];
  for (const x of [-1.06, 1.06]) for (const z of [-0.73, 0.73]) open.push(new THREE.Vector3(x, 0, z));
  for (const x of [0.05, 0.98]) open.push(new THREE.Vector3(x, 0.98, -0.05));
  readDist = frame(VIEW_DIR, VIEW_TARGET, readTarget, open);
  // chiuso: il libro, un po' di traverso, sta in un cerchio; attorno si vede la scrivania
  const closed = [];
  for (let a = 0; a < 8; a++)
    for (const y of [0, 0.09]) closed.push(new THREE.Vector3(Math.cos(a * 0.785) * 0.9, y, Math.sin(a * 0.785) * 0.9));
  closedDist = frame(CLOSED_DIR, CLOSED_TARGET, closedTarget, closed, { x: 0.8, top: 0.72 });
  const half = THREE.MathUtils.degToRad(camera.fov / 2);
  focusDist = (FOCUS_RADIUS / Math.sin(half)) * Math.max(1, 0.8 / camera.aspect) * 1.08;
}
addEventListener('resize', fit);
fit();

const camPos = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const tmp = new THREE.Vector3();
function placeCamera() {
  const e = ease(openness);
  camPos.copy(closedTarget).addScaledVector(CLOSED_DIR, closedDist);
  camPos.lerp(tmp.copy(readTarget).addScaledVector(VIEW_DIR, readDist), e);
  camTarget.lerpVectors(closedTarget, readTarget, e);
  if (lean > 0.001) {
    const d = focusDist / (1 + Math.max(0, lean - 1) * 1.5);
    tmp.set(0, Math.sin(elevation), Math.cos(elevation)).multiplyScalar(d).add(FOCUS_TARGET);
    const s = smooth(Math.min(1, lean));
    camPos.lerp(tmp, s);
    camTarget.lerp(FOCUS_TARGET, s);
  }
  camera.position.copy(camPos);
  camera.lookAt(camTarget);
}

// --- segnalibro: l'ultima pagina letta, ricordata dal browser -----------------
const MARK = 'semeion:segnalibro';
const keyOf = (page) => (page.toc ? '' : `${page.chapter.id}/${page.index + 1}`);
function pageFromKey(key) {
  const [id, n] = (key ?? '').split('/');
  const chapter = CHAPTERS.find((c) => c.id === id);
  if (!chapter) return 0;
  // il riepilogo è la pagina dopo l'ultima (n = numero di doppie pagine + 1)
  return chapter.first + Math.min(chapter.spreads.length + 1, Math.max(1, parseInt(n) || 1)) - 1;
}
function bookmark() {
  try {
    return pageFromKey(localStorage.getItem(MARK));
  } catch {
    return 0;
  }
}
// Il nastro resta nella pagina in cui il libro era stato lasciato l'ultima
// volta; sfogliando, se ne va con lei. Il segnalibro salvato invece segue la
// lettura, così alla prossima visita il nastro sarà dove ci si è fermati.
let marked = 0;
const ribbonAt = (i) => (i === marked ? 'page' : i > marked ? 'left' : 'right');
function setBookmark(page) {
  try {
    localStorage.setItem(MARK, keyOf(page));
  } catch {
    // senza memoria del browser il libro si riapre dall'indice
  }
}

// --- sfogliare ----------------------------------------------------------------
function build(i) {
  const page = PAGES[i];
  const ctx = {
    page: i + 1,
    hasPrev: i > 0,
    hasNext: i < PAGES.length - 1,
    nav: (d) => goTo(index + d),
    toc: () => goTo(0),
    openChapter: (c) => goTo(CHAPTERS[c].first),
    go: (k) => goTo(k),
  };
  if (page.toc) return buildToc(CHAPTERS, PARTS, ctx);
  if (page.summary) return buildSummary(page.chapter, { ...ctx, number: CHAPTERS.indexOf(page.chapter) + 1 });
  return buildSpread(page.def, {
    ...ctx,
    model: modelFor(page.chapter),
    chapter: page.chapter,
    index: page.index,
    count: page.chapter.spreads.length,
    figure: `${CHAPTERS.indexOf(page.chapter) + 1}.${page.index + 1}`,
  });
}

async function goTo(i, animate = true) {
  if (busy || i < 0 || i >= PAGES.length || i === index) return;
  if (animate && !(isOpen && openness > 0.98)) return;
  busy = true;
  clearHover();
  setLean(0);
  const dir = i > index ? 1 : -1;
  const page = PAGES[i];
  const next = await build(i);
  const model = page.def ? modelFor(page.chapter) : null; // indice e riepiloghi sono senza modello
  await model?.ready; // i modelli con mesh reali si caricano in modo asincrono
  if (current && animate) {
    growTarget = 0;
    await wait(260);
    // il foglio copre prima la pagina di partenza, poi atterra sull'altra
    const [first, second] = dir > 0 ? ['right', 'left'] : ['left', 'right'];
    const flipping = book.flip(dir, ribbonAt(i));
    book[first].remove(current[first]);
    book[first].add(next[first]);
    await flipping;
    book[second].remove(current[second]);
    book[second].add(next[second]);
  } else {
    if (current) book.left.remove(current.left), book.right.remove(current.right);
    book.setRibbon(ribbonAt(i));
    book.left.add(next.left);
    book.right.add(next.right);
  }
  if (model !== active) {
    if (active) active.group.visible = false;
    grow = 0;
  }
  // ogni capitolo si apre con il modello orientato nel modo più leggibile
  // (o la pagina, se chiede una vista propria: es. frontale e ingrandita)
  const view = page.def?.view;
  if (model && (view?.yaw != null || PAGES[index]?.chapter !== page.chapter || PAGES[index]?.def?.view?.yaw != null))
    // gli angoli dei capitoli sono dati per il modello non ribaltato: con il
    // ribaltamento lo stesso punto di vista si ottiene con l'angolo opposto
    model.yaw = (view?.yaw ?? page.chapter.yaw ?? 0) * (model.mirror?.scale.x < 0 ? -1 : 1);
  zoomTarget = view?.zoom ?? page.chapter?.zoom ?? 1;
  active = model;
  current = next;
  index = i;
  // chi arriva da un indirizzo di pagina lo vede aggiornarsi; altrimenti la
  // pagina la ricorda il segnalibro
  if (deepLink) history.replaceState(null, '', page.toc ? '#' : `#${keyOf(page)}`);
  setBookmark(page);
  next.enter();
  growTarget = 1;
  busy = false;
  refreshBar();
}

// --- aprire e chiudere il libro ------------------------------------------------
function openBook() {
  if (isOpen || busy) return;
  isOpen = true;
  clearHover();
  peekTarget = 0;
  refreshBar();
}
function closeBook() {
  if (!isOpen || busy) return;
  setLean(0);
  clearHover();
  isOpen = false;
  refreshBar();
}

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && leanTarget > 0) return setLean(0);
  if (!isOpen) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') openBook();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(index + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(index - 1);
});

// --- puntatore: passaggio, clic, rotazione e ingrandimento del modello ---------
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let hovered = null; // { ui, object }
let drag = null;
let spin = 0;
const modelBall = new THREE.Sphere(new THREE.Vector3(0.5, 0.4, 0.02), 0.56);
const coverUi = { click: openBook, cursor: 'pointer', hover: (on) => (peekTarget = on ? 1 : 0) };

function aim(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
}
const overModel = () => !!active && isOpen && grow > 0.5 && ray.ray.intersectsSphere(modelBall);

function pick(e) {
  aim(e);
  // a libro chiuso (o mentre si apre) le pagine non si toccano: c'è solo il libro
  if (openness < 0.98) {
    if (isOpen || !ray.intersectObject(book.group, true).length) return null;
    return { ui: coverUi, object: book.group };
  }
  for (const hit of ray.intersectObjects(scene.children, true)) {
    let o = hit.object;
    if (!o.visible || o === tip) continue;
    let hidden = false;
    for (let p = o; p; p = p.parent) if (!p.visible) hidden = true;
    if (hidden) continue;
    // ciò che il ritaglio ha tolto dalla vista non si può nemmeno toccare
    if (o.material?.clippingPlanes?.some((pl) => pl.distanceToPoint(hit.point) < 0)) continue;
    // il raggio va con il punto colpito: chi taglia una via cerca la più vicina al raggio
    if (o.userData.ui) return { ui: o.userData.ui, object: o, hit: { ...hit, ray: ray.ray.clone() } };
    if (o.userData.blocker) break;
  }
  return null;
}

function clearHover() {
  if (hovered) hovered.ui.hover?.(false);
  hovered = null;
  tip.visible = false;
}

function setHover(p) {
  if (p?.object !== hovered?.object) {
    if (hovered && hovered.ui !== p?.ui) hovered.ui.hover?.(false);
    if (p && p.ui !== hovered?.ui) p.ui.hover?.(true);
    hovered = p;
  }
  if (p?.ui.tip) {
    tip.text = p.ui.tip;
    tip.position.copy(p.hit.point).addScaledVector(VIEW_DIR, 0.08);
    tip.position.y += 0.03;
    tip.quaternion.copy(camera.quaternion);
    tip.visible = true;
  } else tip.visible = false;
  renderer.domElement.style.cursor = p?.ui.cursor ?? (p?.ui.drag || (leanTarget > 0.3 && !p) ? 'grab' : 'default');
}

const el = renderer.domElement;
const touches = new Map(); // dita sullo schermo, per il pizzico
let pinch = null;
const spread = () => {
  const [a, b] = [...touches.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
};

el.addEventListener('pointermove', (e) => {
  if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch) {
    if (touches.size === 2) setLean(pinch.lean + Math.log2(spread() / pinch.d) * 1.3);
    return;
  }
  // un oggetto afferrato (un'etichetta) segue il puntatore
  if (drag?.grab) {
    aim(e);
    drag.grab.move(ray.ray);
    return;
  }
  if (drag) {
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y0;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    drag.y0 = e.clientY;
    drag.x = e.clientX;
    if (drag.rotate && drag.moved > 5) {
      active.yaw += dx * 0.009;
      spin = dx * 0.009;
      // nel primo piano si gira anche attorno al modello dall'alto in basso
      if (lean > 0.5) elevation = clamp(elevation + dy * 0.006, 0.26, 1.2);
      el.style.cursor = 'grabbing';
      tip.visible = false;
    }
    return;
  }
  if (!busy) setHover(pick(e));
});
el.addEventListener('pointerdown', (e) => {
  if (busy) return;
  if (e.pointerType === 'touch') {
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size === 2 && active && isOpen) {
      // due dita: si allarga o si stringe il primo piano
      pinch = { d: spread(), lean: leanTarget };
      drag = null;
      clearHover();
      return;
    }
  }
  const p = pick(e);
  if (p?.ui.grab) {
    clearHover();
    drag = { grab: p.ui.grab };
    p.ui.grab.start(ray.ray);
    el.style.cursor = 'grabbing';
    el.setPointerCapture(e.pointerId);
    return;
  }
  setHover(p);
  const onModel = p?.ui.drag || (!p && (overModel() || (isOpen && active && leanTarget > 0.3)));
  drag = { x: e.clientX, y0: e.clientY, moved: 0, rotate: !!onModel, target: p };
  spin = 0;
  el.setPointerCapture(e.pointerId);
});
function release(e) {
  touches.delete(e.pointerId);
  if (pinch) {
    if (touches.size < 2) pinch = touches.size ? pinch : null;
    drag = null;
    return true;
  }
  return false;
}
el.addEventListener('pointerup', (e) => {
  if (release(e)) return;
  const d = drag;
  drag = null;
  if (!d) return;
  // al rilascio l'oggetto si nasconde un istante: conta ciò che c'è sotto
  if (d.grab) {
    d.grab.end(() => pick(e));
    setHover(pick(e));
    return;
  }
  if (d.moved <= 5 && d.target) d.target.ui.click?.(d.target.hit);
  // un tocco sul modello che non prende nessuna parte (per esempio dentro un involucro
  // trasparente) arriva al modello come raggio: serve a chi taglia una via sottile
  else if (d.moved <= 5 && d.rotate && active?.onMiss) {
    aim(e);
    active.onMiss(ray.ray.clone());
  }
  // al tocco non c'è passaggio: il termine resta acceso finché non si tocca altrove
  if (e.pointerType === 'mouse' || !d.target?.ui.sticky) setHover(e.pointerType === 'mouse' ? pick(e) : null);
});
el.addEventListener('pointercancel', (e) => {
  release(e);
  drag?.grab?.end(() => null);
  drag = null;
});
el.addEventListener('pointerleave', () => !drag && clearHover());

// rotella (o pizzico sul trackpad): ci si avvicina al modello sotto il puntatore
el.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    if (busy || !active || !isOpen) return;
    aim(e);
    if (leanTarget === 0 && (e.deltaY > 0 || !overModel())) return;
    const step = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
    setLean(leanTarget - step * (e.ctrlKey ? 0.012 : 0.0022));
  },
  { passive: false }
);
el.addEventListener('dblclick', (e) => {
  if (busy) return;
  aim(e);
  if (leanTarget > 0.3 || overModel()) setLean(leanTarget > 0.3 ? 0 : 1);
});

// --- ciclo ---------------------------------------------------------------------
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const real = clock.getDelta();
  const dt = Math.min(real, 0.05);
  const slow = Math.min(real, 0.5);
  book.update(Math.min(real, 0.12));

  // il libro si apre solo quando il modello è ripiegato, e viceversa
  const goal = isOpen ? 1 : grow > 0.02 ? openness : 0;
  openness = clamp(openness + Math.sign(goal - openness) * Math.min(real, 0.05) / 1.5, 0, 1);
  peek += (peekTarget - peek) * (1 - Math.exp(-slow * 8));
  book.setOpen(ease(openness), peek);
  lean += (leanTarget - lean) * (1 - Math.exp(-slow * 5.5));
  placeCamera();
  bar.dim(Math.min(1, lean));

  if (active) {
    if (!drag && Math.abs(spin) > 1e-4) {
      active.yaw += spin;
      spin *= Math.exp(-dt * 5);
    }
    const up = isOpen && openness > 0.98 ? growTarget : 0;
    grow += (up - grow) * (1 - Math.exp(-slow * (up ? 6 : 16)));
    // il modello si alza dalla pagina come un pop-up
    active.grow = grow;
    zoom += (zoomTarget - zoom) * (1 - Math.exp(-slow * 5));
    active.group.scale.setScalar(MODEL_SCALE * zoom);
    active.group.visible = grow > 0.01;
    // da vicino il modello si guarda tutto: niente ritaglio al volume della pagina
    active.freeView = lean > 0.3;
    active.update(dt, camera, real);
  }
  current?.update?.();
  renderer.render(scene, camera);
});

// Indirizzo di una pagina: #id-capitolo/numero (es. #cervelletto/2). Con un
// indirizzo il libro è già aperto su quella pagina; senza, è chiuso sulla
// scrivania e si apre al segnalibro (all'indice, la prima volta).
const pageFromHash = () => pageFromKey(decodeURIComponent(location.hash.slice(1)));
const deepLink = location.hash.length > 1;
addEventListener('hashchange', () => {
  if (!isOpen) (isOpen = true), (openness = 1);
  goTo(pageFromHash());
});
if (deepLink) (isOpen = true), (openness = 1);
marked = bookmark();
goTo(deepLink ? pageFromHash() : marked, false);
window.__book = {
  goTo, scene, camera, models, open: openBook, close: closeBook, lean: setLean,
  get model() { return active; },
  get state() { return { index, isOpen, openness, lean, busy }; },
};
