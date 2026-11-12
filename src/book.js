// Il libro sulla scrivania. Unità: una pagina è larga 1 e alta PAGE_H.
// Aperto, la costa è lungo l'asse z nell'origine; pagina sinistra x<0, destra x>0.
// Chiuso, la metà sinistra (copertina, blocco e pagina) è ribaltata sulla destra.
import * as THREE from 'three';
import { coverTexture, spineTexture, deskTexture, matTexture, edgeTexture } from './textures.js';

export const PAGE_W = 1;
export const PAGE_H = 1.36;
const BLOCK = 0.03; // spessore del blocco di pagine
const BOARD = 0.012; // spessore del cartone della copertina
const OVER = 0.035; // di quanto la copertina sporge dalle pagine
const COVER_Y = -BLOCK - 0.001 - BOARD / 2; // quota del centro della copertina, a libro aperto
const FLOOR = COVER_Y - BOARD / 2 - 0.001; // piano del sottomano
const SPINE = -2 * COVER_Y + BOARD; // larghezza del dorso = spessore del libro chiuso
const YELLOW = 0xd6a62a;

function paperTexture(mirror) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 700;
  const g = c.getContext('2d');
  g.fillStyle = '#f7f1e3';
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(${90 + Math.random() * 60},${70 + Math.random() * 50},40,${Math.random() * 0.035})`;
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  // ombra verso la costa (a sinistra nella texture; specchiata per la pagina sinistra)
  const sh = g.createLinearGradient(0, 0, c.width * 0.22, 0);
  sh.addColorStop(0, 'rgba(60,45,25,0.33)');
  sh.addColorStop(0.35, 'rgba(60,45,25,0.08)');
  sh.addColorStop(1, 'rgba(60,45,25,0)');
  g.fillStyle = sh;
  g.fillRect(0, 0, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (mirror) {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
  }
  return t;
}

function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0);
  s.lineTo(w / 2, h / 2 - r);
  s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI);
  s.lineTo(-w / 2, -h / 2 + r);
  s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

// Un piano orientato con una terna esplicita: u (destra dell'immagine),
// v (alto dell'immagine), n (faccia visibile).
function decal(w, h, material, u, v, n) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  m.quaternion.setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(new THREE.Vector3(...u), new THREE.Vector3(...v), new THREE.Vector3(...n))
  );
  return m;
}

// Nastro del segnalibro: scende lungo la piega sulla pagina corrente, esce
// dal piede del libro e si adagia sul sottomano.
function ribbon() {
  const z0 = PAGE_H / 2;
  const y = 0.0026;
  const ground = FLOOR + 0.0012;
  const curve = new THREE.CatmullRomCurve3(
    [
      [0.022, y, -z0 + 0.004], [0.03, y, -0.35], [0.024, y, 0.1], [0.034, y, z0 - 0.06], [0.034, y - 0.002, z0 + 0.012],
      [0.034, -0.018, z0 + OVER + 0.006], [0.04, ground + 0.004, z0 + OVER + 0.04], [0.052, ground, z0 + 0.13],
      [0.085, ground, z0 + 0.24], [0.1, ground, z0 + 0.34],
    ].map((p) => new THREE.Vector3(...p)),
    false,
    'centripetal'
  );
  const N = 90, half = 0.0115;
  const pos = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const p = curve.getPoint(i / N);
    const py = Math.max(p.y, ground);
    // la punta è tagliata in diagonale
    const cut = i === N ? 0.03 : 0;
    pos.push(p.x - half, py, p.z - cut, p.x + half, py, p.z + cut);
    if (i < N) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(
    g,
    new THREE.MeshPhysicalMaterial({ color: 0x1d2a6e, roughness: 0.55, sheen: 1, sheenColor: 0x5a6fd0, sheenRoughness: 0.4, side: THREE.DoubleSide })
  );
  m.castShadow = m.receiveShadow = true;
  return m;
}

export class Book {
  constructor() {
    // desk: ciò che non si muove (piano e sottomano); group: il libro.
    this.desk = new THREE.Group();
    this.group = new THREE.Group();

    const wood = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ map: deskTexture(), roughness: 0.82 })
    );
    wood.rotation.x = -Math.PI / 2;
    wood.position.y = FLOOR - 0.007;
    wood.receiveShadow = true;
    const mat = new THREE.Mesh(
      new THREE.ExtrudeGeometry(roundedShape(3.9, 2.5, 0.06), { depth: 0.007, bevelEnabled: false, curveSegments: 10 }),
      new THREE.MeshStandardMaterial({ map: matTexture(), roughness: 0.95 })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.position.y = FLOOR - 0.007;
    mat.castShadow = mat.receiveShadow = true;
    this.desk.add(wood, mat);

    const board = new THREE.MeshStandardMaterial({ color: YELLOW, roughness: 0.72 });
    const coverGeo = new THREE.BoxGeometry(PAGE_W + OVER, BOARD, PAGE_H + OVER * 2);
    const edge = new THREE.MeshStandardMaterial({ color: 0xe6dcc6, roughness: 1 });
    const cut = new THREE.MeshStandardMaterial({ map: edgeTexture(), roughness: 1 });
    this.paper = [paperTexture(true), paperTexture(false)].map(
      (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.96 })
    );

    // metà sinistra: ruota attorno alla piega per chiudere il libro
    this.leftHalf = new THREE.Group();
    this.group.add(this.leftHalf);
    this.pages = [];
    for (const side of [-1, 1]) {
      const half = side < 0 ? this.leftHalf : this.group;
      const cover = new THREE.Mesh(coverGeo, board);
      cover.position.set((side * (PAGE_W + OVER)) / 2, COVER_Y, 0);
      cover.castShadow = cover.receiveShadow = true;
      // i tagli (facce laterali) mostrano le pagine
      const block = new THREE.Mesh(new THREE.BoxGeometry(PAGE_W, BLOCK, PAGE_H), [cut, cut, edge, edge, cut, cut]);
      block.position.set((side * PAGE_W) / 2, -BLOCK / 2 - 0.0005, 0);
      block.castShadow = true;
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(PAGE_W, PAGE_H), this.paper[side < 0 ? 0 : 1]);
      sheet.rotation.x = -Math.PI / 2;
      sheet.position.set((side * PAGE_W) / 2, 0, 0);
      sheet.receiveShadow = true;
      sheet.userData.blocker = true;

      // Sistema di riferimento della pagina: origine in alto a sinistra,
      // x a destra, y negativa verso il basso, z fuori dalla carta.
      const content = new THREE.Group();
      content.rotation.x = -Math.PI / 2;
      content.position.set(side < 0 ? -PAGE_W : 0, 0, -PAGE_H / 2);
      half.add(cover, block, sheet, content);
      this.pages.push(content);
    }
    [this.left, this.right] = this.pages;

    // piatto anteriore: è la faccia inferiore della copertina sinistra, che a
    // libro chiuso guarda in alto
    const art = decal(
      PAGE_W + OVER, PAGE_H + OVER * 2,
      new THREE.MeshStandardMaterial({ map: coverTexture(), roughness: 0.7 }),
      [-1, 0, 0], [0, 0, -1], [0, -1, 0]
    );
    art.position.set(-(PAGE_W + OVER) / 2, COVER_Y - BOARD / 2 - 0.0006, 0);
    art.receiveShadow = true;
    this.leftHalf.add(art);

    // dorso: steso sotto la piega a libro aperto, in piedi a libro chiuso
    this.spinePivot = new THREE.Group();
    this.spinePivot.position.set(0, COVER_Y - BOARD / 2, 0);
    this.spine = new THREE.Mesh(new THREE.BoxGeometry(SPINE, BOARD, PAGE_H + OVER * 2), board);
    this.spine.position.x = -SPINE / 2;
    this.spine.castShadow = true;
    const lettering = decal(
      PAGE_H + OVER * 2, SPINE,
      new THREE.MeshStandardMaterial({ map: spineTexture(), roughness: 0.7 }),
      [0, 0, 1], [-1, 0, 0], [0, -1, 0]
    );
    lettering.position.y = -BOARD / 2 - 0.0006;
    this.spine.add(lettering);
    this.spinePivot.add(this.spine);
    this.group.add(this.spinePivot);

    this.group.add(ribbon());

    // foglio che gira
    this.flipPivot = new THREE.Group();
    const flip = new THREE.Mesh(
      new THREE.PlaneGeometry(PAGE_W, PAGE_H),
      new THREE.MeshStandardMaterial({ map: paperTexture(false), roughness: 0.96, side: THREE.DoubleSide })
    );
    flip.rotation.x = -Math.PI / 2;
    flip.position.set(PAGE_W / 2, 0.004, 0);
    flip.castShadow = true;
    this.flipPivot.add(flip);
    this.flipPivot.visible = false;
    this.group.add(this.flipPivot);
    this.flipAnim = null;
    this.setOpen(1);
  }

  // u = 1 libro aperto e centrato sulla piega; u = 0 chiuso, un po' di
  // traverso, al centro del sottomano. `peek` socchiude appena la copertina.
  setOpen(u, peek = 0) {
    const angle = -Math.PI * (1 - u) + peek * 0.07 * (1 - u);
    this.leftHalf.rotation.z = angle;
    this.spinePivot.rotation.z = angle / 2;
    this.spine.position.y = BOARD / 2 - BOARD * (1 - u);
    const c = 1 - u;
    const yaw = 0.42 * c;
    this.group.rotation.y = yaw;
    this.group.position.set(-0.5 * Math.cos(yaw) * c, 0, 0.5 * Math.sin(yaw) * c);
  }

  // dir = +1 avanti (il foglio va da destra a sinistra), -1 indietro.
  // onCovered: chiamata subito (il foglio copre la pagina di partenza);
  // la promessa si risolve quando il foglio è atterrato.
  flip(dir) {
    return new Promise((resolve) => {
      this.flipPivot.visible = true;
      this.flipAnim = { t: 0, dir, resolve };
    });
  }

  update(dt) {
    const a = this.flipAnim;
    if (!a) return;
    a.t = Math.min(1, a.t + dt / 0.75);
    const e = a.t < 0.5 ? 2 * a.t * a.t : 1 - Math.pow(-2 * a.t + 2, 2) / 2;
    const angle = (a.dir > 0 ? e : 1 - e) * Math.PI;
    this.flipPivot.rotation.z = angle;
    if (a.t >= 1) {
      this.flipPivot.visible = false;
      this.flipAnim = null;
      a.resolve();
    }
  }
}
