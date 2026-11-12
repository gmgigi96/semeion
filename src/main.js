import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Text } from 'troika-three-text';
import { Book, PAGE_H } from './book.js';
import { Plexus } from './plexus.js';
import { Brain } from './brain.js';
import { Cerebellum } from './cerebellum.js';
import { Hypothalamus } from './hypothalamus.js';
import { buildSpread, buildToc } from './spread.js';
import { CHAPTERS } from './chapters/index.js';
import { FONT } from './ui.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.95;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b3534);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.45;

const sun = new THREE.DirectionalLight(0xfff1dc, 1.9);
sun.position.set(-1.6, 3.2, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -1.6, right: 1.6, top: 1.4, bottom: -1.4, near: 0.5, far: 8 });
sun.shadow.bias = -0.0004;
sun.shadow.radius = 5;
scene.add(sun, new THREE.HemisphereLight(0xffffff, 0x54605c, 0.3));

const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 30);
const VIEW_DIR = new THREE.Vector3(0, 1.5, 1).normalize();
const VIEW_TARGET = new THREE.Vector3(0, 0.1, 0.0);

const book = new Book();
scene.add(book.group);

// I modelli si costruiscono alla prima pagina che li usa.
const MODEL_SCALE = 0.9;
const factories = {
  plexus: () => new Plexus(),
  brain: () => new Brain(),
  cerebellum: () => new Cerebellum(),
  hypothalamus: () => new Hypothalamus(),
};
const models = {};
let active = null; // modello sulla pagina corrente
function modelFor(name) {
  if (!name) return null;
  if (!models[name]) {
    const m = (models[name] = factories[name]());
    m.group.position.set(0.5, 0.001, -PAGE_H / 2 + 0.66);
    m.group.scale.setScalar(MODEL_SCALE);
    m.group.visible = false;
    scene.add(m.group);
  }
  return models[name];
}

// Sequenza piatta delle doppie pagine: indice, poi i capitoli uno dopo l'altro.
const PAGES = [{ toc: true }];
for (const chapter of CHAPTERS) {
  chapter.first = PAGES.length;
  chapter.spreads.forEach((def, index) => PAGES.push({ chapter, def, index }));
}

// etichetta che segue il puntatore sul modello
const tip = new Text();
Object.assign(tip, {
  font: FONT.semi, fontSize: 0.026, color: 0x2a2520, anchorX: 'center', anchorY: 'bottom',
  outlineWidth: '10%', outlineColor: 0xfbf6ea,
});
tip.material.depthTest = false;
tip.renderOrder = 50;
tip.visible = false;
scene.add(tip);

// --- inquadratura: il libro (e il modello in piedi) sempre interi -----------
function fit() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  const pts = [];
  for (const x of [-1.06, 1.06]) for (const z of [-0.73, 0.73]) pts.push(new THREE.Vector3(x, 0, z));
  for (const x of [0.05, 0.98]) pts.push(new THREE.Vector3(x, 0.86, 0));
  let lo = 1, hi = 20;
  for (let i = 0; i < 24; i++) {
    const d = (lo + hi) / 2;
    camera.position.copy(VIEW_TARGET).addScaledVector(VIEW_DIR, d);
    camera.lookAt(VIEW_TARGET);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const out = pts.some((p) => {
      const n = p.clone().project(camera);
      return Math.abs(n.x) > 0.95 || Math.abs(n.y) > 0.93;
    });
    if (out) lo = d;
    else hi = d;
  }
}
addEventListener('resize', fit);
fit();

// --- sfogliare ----------------------------------------------------------------
let current = null;
let index = -1;
let busy = false;
let grow = 0; // 0 = modello ripiegato, 1 = in piedi
let growTarget = 0;
let zoom = 1; // ingrandimento del modello chiesto dalla pagina
let zoomTarget = 1;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function build(i) {
  const page = PAGES[i];
  const ctx = {
    page: i + 1,
    hasPrev: i > 0,
    hasNext: i < PAGES.length - 1,
    nav: (d) => goTo(index + d),
    toc: () => goTo(0),
    openChapter: (c) => goTo(CHAPTERS[c].first),
  };
  if (page.toc) return buildToc(CHAPTERS, ctx);
  return buildSpread(page.def, {
    ...ctx,
    model: modelFor(page.chapter.model),
    chapter: page.chapter,
    index: page.index,
    count: page.chapter.spreads.length,
    figure: `${CHAPTERS.indexOf(page.chapter) + 1}.${page.index + 1}`,
  });
}

async function goTo(i, animate = true) {
  if (busy || i < 0 || i >= PAGES.length || i === index) return;
  busy = true;
  clearHover();
  const dir = i > index ? 1 : -1;
  const page = PAGES[i];
  const next = await build(i);
  const model = modelFor(page.chapter?.model);
  if (current && animate) {
    growTarget = 0;
    await wait(260);
    // il foglio copre prima la pagina di partenza, poi atterra sull'altra
    const [first, second] = dir > 0 ? ['right', 'left'] : ['left', 'right'];
    const flipping = book.flip(dir);
    book[first].remove(current[first]);
    book[first].add(next[first]);
    await flipping;
    book[second].remove(current[second]);
    book[second].add(next[second]);
  } else {
    if (current) book.left.remove(current.left), book.right.remove(current.right);
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
    model.yaw = view?.yaw ?? page.chapter.yaw ?? 0;
  zoomTarget = view?.zoom ?? 1;
  active = model;
  current = next;
  index = i;
  history.replaceState(null, '', `#${i + 1}`);
  next.enter();
  growTarget = 1;
  busy = false;
}

addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(index + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(index - 1);
});

// --- puntatore: passaggio, clic, rotazione del modello -----------------------
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let hovered = null; // { ui, object }
let drag = null;
let spin = 0;
const modelBall = new THREE.Sphere(new THREE.Vector3(0.5, 0.4, 0.02), 0.56);

function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  for (const hit of ray.intersectObjects(scene.children, true)) {
    let o = hit.object;
    if (!o.visible || o === tip) continue;
    let hidden = false;
    for (let p = o; p; p = p.parent) if (!p.visible) hidden = true;
    if (hidden) continue;
    if (o.userData.ui) return { ui: o.userData.ui, object: o, hit };
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
  renderer.domElement.style.cursor = p?.ui.cursor ?? (p?.ui.drag ? 'grab' : 'default');
}

const el = renderer.domElement;
el.addEventListener('pointermove', (e) => {
  if (drag) {
    const dx = e.clientX - drag.x;
    drag.moved += Math.abs(dx) + Math.abs(e.clientY - drag.y0);
    drag.y0 = e.clientY;
    drag.x = e.clientX;
    if (drag.rotate && drag.moved > 5) {
      active.yaw += dx * 0.009;
      spin = dx * 0.009;
      el.style.cursor = 'grabbing';
      tip.visible = false;
    }
    return;
  }
  if (!busy) setHover(pick(e));
});
el.addEventListener('pointerdown', (e) => {
  if (busy) return;
  const p = pick(e);
  setHover(p);
  const onModel = active && (p?.ui.drag || (!p && ray.ray.intersectsSphere(modelBall)));
  drag = { x: e.clientX, y0: e.clientY, moved: 0, rotate: onModel, target: p };
  spin = 0;
  el.setPointerCapture(e.pointerId);
});
el.addEventListener('pointerup', (e) => {
  const d = drag;
  drag = null;
  if (!d) return;
  if (d.moved <= 5 && d.target) d.target.ui.click?.(d.target.hit);
  // al tocco non c'è passaggio: il termine resta acceso finché non si tocca altrove
  if (e.pointerType === 'mouse' || !d.target?.ui.sticky) setHover(e.pointerType === 'mouse' ? pick(e) : null);
});
el.addEventListener('pointerleave', () => !drag && clearHover());

// --- ciclo ---------------------------------------------------------------------
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const real = clock.getDelta();
  const dt = Math.min(real, 0.05);
  book.update(Math.min(real, 0.12));
  if (active) {
    if (!drag && Math.abs(spin) > 1e-4) {
      active.yaw += spin;
      spin *= Math.exp(-dt * 5);
    }
    grow += (growTarget - grow) * (1 - Math.exp(-Math.min(real, 0.5) * (growTarget ? 6 : 16)));
    // il modello si alza dalla pagina come un pop-up
    active.grow = grow;
    zoom += (zoomTarget - zoom) * (1 - Math.exp(-Math.min(real, 0.5) * 5));
    active.group.scale.setScalar(MODEL_SCALE * zoom);
    active.group.visible = grow > 0.01;
    active.update(dt, camera, real);
  }
  current?.update?.();
  renderer.render(scene, camera);
});

const start = Math.min(PAGES.length, Math.max(1, parseInt(location.hash.slice(1)) || 1)) - 1;
goTo(start, false);
window.__book = { goTo, scene, camera, models, get model() { return active; } };
