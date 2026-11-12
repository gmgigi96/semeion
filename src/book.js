// Il libro aperto sul tavolo. Unità: una pagina è larga 1 e alta PAGE_H.
// La costa è lungo l'asse z nell'origine; pagina sinistra x<0, destra x>0.
import * as THREE from 'three';

export const PAGE_W = 1;
export const PAGE_H = 1.36;
const BLOCK = 0.03; // spessore del blocco di pagine

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

function deskTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#3d4f4b';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 14000; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},${Math.random() * 0.03})`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  return t;
}

export class Book {
  constructor() {
    this.group = new THREE.Group();

    const desk = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({ map: deskTexture(), roughness: 0.92 })
    );
    desk.rotation.x = -Math.PI / 2;
    desk.position.y = -BLOCK - 0.014;
    desk.receiveShadow = true;
    this.group.add(desk);

    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(PAGE_W * 2 + 0.07, 0.012, PAGE_H + 0.07),
      new THREE.MeshStandardMaterial({ color: 0xc9992e, roughness: 0.7 })
    );
    cover.position.y = -BLOCK - 0.007;
    cover.castShadow = cover.receiveShadow = true;
    this.group.add(cover);

    const edge = new THREE.MeshStandardMaterial({ color: 0xe6dcc6, roughness: 1 });
    this.paper = [paperTexture(true), paperTexture(false)].map(
      (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.96 })
    );
    this.pages = [];
    for (const side of [-1, 1]) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(PAGE_W, BLOCK, PAGE_H), edge);
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
      this.group.add(block, sheet, content);
      this.pages.push(content);
    }
    [this.left, this.right] = this.pages;

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
