// Primitive geometriche per i modelli anatomici procedurali.
// Tutte le geometrie sono espresse direttamente in coordinate del modello.
import * as THREE from 'three';

export const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Tubo a raggio variabile lungo una curva. `radii` è un numero o una lista di
// raggi distribuiti uniformemente lungo il percorso; `flat` schiaccia la
// sezione lungo gli assi del modello (es. { x: 0.5 }); le estremità sono arrotondate.
export function taperTube(pts, radii, { seg = 40, radial = 14, flat = null, caps = true } = {}) {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const frames = curve.computeFrenetFrames(seg, false);
  const list = Array.isArray(radii) ? radii : [radii, radii];
  const radiusAt = (u) => {
    const f = u * (list.length - 1);
    const i = Math.min(Math.floor(f), list.length - 2);
    const t = f - i;
    const s = t * t * (3 - 2 * t);
    let r = list[i] * (1 - s) + list[i + 1] * s;
    if (caps) {
      const e = 0.07;
      const d = Math.min(u, 1 - u) / e;
      if (d < 1) r *= Math.sqrt(Math.max(0, 1 - (1 - d) * (1 - d)));
    }
    return r;
  };
  const pos = [];
  const idx = [];
  const p = new THREE.Vector3();
  const o = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    curve.getPointAt(u, p);
    const r = radiusAt(u);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      o.set(0, 0, 0)
        .addScaledVector(frames.normals[i], Math.cos(a) * r)
        .addScaledVector(frames.binormals[i], Math.sin(a) * r);
      if (flat) o.set(o.x * (flat.x ?? 1), o.y * (flat.y ?? 1), o.z * (flat.z ?? 1));
      pos.push(p.x + o.x, p.y + o.y, p.z + o.z);
    }
  }
  const w = radial + 1;
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * w + j, b = a + w;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.userData.curve = curve;
  return g;
}

export function ellipsoid(c, r, rot = null, detail = 28) {
  const g = new THREE.SphereGeometry(1, detail, Math.round(detail * 0.7));
  g.scale(r[0], r[1], r[2]);
  if (rot) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rot)));
  g.translate(c[0], c[1], c[2]);
  return g;
}

// Copia speculare rispetto al piano sagittale (x -> -x), con le facce riorientate.
export function mirror(g) {
  const m = g.clone();
  m.scale(-1, 1, 1);
  const i = m.index.array;
  for (let k = 0; k < i.length; k += 3) [i[k + 1], i[k + 2]] = [i[k + 2], i[k + 1]];
  m.index.needsUpdate = true;
  m.computeVertexNormals();
  return m;
}

export const both = (g) => [g, mirror(g)];

// Arco tra due punti, sollevato verso `lift`, per disegnare una connessione.
export function arc(a, b, lift = [0, 0.04, 0.08]) {
  const m = a.clone().lerp(b, 0.5).add(V(...lift));
  return [a.clone(), m, b.clone()];
}
