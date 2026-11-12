// Costruisce il file di mesh di un modello a partire da mesh anatomiche reali:
// BodyParts3D (© The Database Center for Life Science, CC BY 4.0) oppure
// Z-Anatomy (CC BY-SA 4.0), scelte con "source" nel manifesto.
//
//   node tools/mesh.mjs meshes/<modello>.json [cartella-sorgenti]
//
// Il manifesto elenca, per ogni parte del modello, i nomi inglesi degli elementi
// BodyParts3D che la compongono (così come compaiono in `index.tsv`):
//
//   {
//     "source": "bodyparts3d",                 // oppure "zanatomy"
//     "frame": { "origin": [0, -80, 1457], "scale": 0.0045 },
//     "parts": { "v3": ["Third ventricle"], "caudate": ["Right caudate nucleus", "Left caudate nucleus"] },
//     "split": { "caudate": [["caudHead", "z > 0.07"], ["caudBody", "y > 0.42"], ["caudTail", "true"]] },
//     "simplify": 0.6                          // facoltativo: frazione di triangoli da tenere
//   }
//
// `split` divide una parte in più parti secondo la posizione (x, y, z, ax = |x|)
// del centro di ogni triangolo, nelle coordinate del modello: vince la prima regola vera.
//
// Le sorgenti sono in millimetri (x verso sinistra, y verso dietro, z verso
// l'alto); il risultato è nelle coordinate dei modelli del libro (x destra,
// y alto, z avanti): X = -(x - ox)·s, Y = (z - oz)·s, Z = -(y - oy)·s.
// Scrive public/meshes/<modello>.glb (una mesh per parte, un primitivo per
// elemento) e public/meshes/<modello>.json con centro e ingombro di ogni parte.
import fs from 'node:fs';
import path from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { weld, simplify, quantize, dedup } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const [manifestPath, srcArg] = process.argv.slice(2);
if (!manifestPath) {
  console.error('uso: node tools/mesh.mjs meshes/<modello>.json [cartella-sorgenti]');
  process.exit(2);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
// Due fonti, ciascuna con la propria terna: non si mescolano in un modello.
//   bodyparts3d  BodyParts3D 4.0, CC BY 4.0 (encefalo, ossa, muscoli, vasi)
//   zanatomy     Z-Anatomy, CC BY-SA 4.0 (in più: nervi, plessi, orecchio, seni)
const source = manifest.source ?? 'bodyparts3d';
const SRC =
  srcArg ??
  (source === 'bodyparts3d' ? process.env.BP3D : undefined) ??
  path.join(process.env.SOURCES ?? path.resolve('../sources'), source);
const OBJ = path.join(SRC, 'obj/all');
const name = path.basename(manifestPath, '.json');
const { origin, scale } = manifest.frame;

// nome dell'elemento -> file
const index = new Map();
for (const line of fs.readFileSync(path.join(SRC, 'index.tsv'), 'utf8').split('\n')) {
  const [en, file] = line.split('\t');
  if (!file) continue;
  const key = en.toLowerCase();
  if (!index.has(key)) index.set(key, []);
  index.get(key).push(file);
}

function readObj(file) {
  const pos = [];
  const idx = [];
  for (const line of fs.readFileSync(path.join(OBJ, file), 'utf8').split('\n')) {
    if (line.startsWith('v ')) {
      const [x, y, z] = line.slice(2).trim().split(/\s+/).map(Number);
      pos.push(-(x - origin[0]) * scale, (z - origin[2]) * scale, -(y - origin[1]) * scale);
    } else if (line.startsWith('f ')) {
      const v = line.slice(2).trim().split(/\s+/).map((t) => parseInt(t) - 1);
      // lo specchiamento in x inverte l'orientamento delle facce: le rigiro
      for (let i = 1; i + 1 < v.length; i++) idx.push(v[0], v[i + 1], v[i]);
    }
  }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) };
}

const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene();
const info = {};
const bucket = new Map(); // id della parte -> [{ pos, idx }]
const push = (id, geo) => (bucket.get(id) ?? bucket.set(id, []).get(id)).push(geo);
for (const [id, names] of Object.entries(manifest.parts)) {
  const rules = (manifest.split?.[id] ?? []).map(([sub, expr]) => [sub, new Function('x', 'y', 'z', 'ax', `return ${expr};`)]);
  for (const en of names) {
    const files = index.get(en.toLowerCase());
    if (!files) {
      console.error(`elemento non trovato: "${en}" (parte ${id})`);
      process.exit(1);
    }
    for (const file of files) {
      const geo = readObj(file);
      if (!rules.length) {
        push(id, geo);
        continue;
      }
      const parts = new Map();
      const { pos, idx } = geo;
      for (let t = 0; t < idx.length; t += 3) {
        const [a, b, c] = [idx[t] * 3, idx[t + 1] * 3, idx[t + 2] * 3];
        const x = (pos[a] + pos[b] + pos[c]) / 3, y = (pos[a + 1] + pos[b + 1] + pos[c + 1]) / 3, z = (pos[a + 2] + pos[b + 2] + pos[c + 2]) / 3;
        const sub = rules.find(([, test]) => test(x, y, z, Math.abs(x)))?.[0];
        if (sub) (parts.get(sub) ?? parts.set(sub, []).get(sub)).push(idx[t], idx[t + 1], idx[t + 2]);
      }
      for (const [sub, list] of parts) {
        // tiene solo i vertici usati da questa porzione
        const remap = new Map();
        const p2 = [];
        const i2 = list.map((v) => {
          if (!remap.has(v)) {
            remap.set(v, p2.length / 3);
            p2.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]);
          }
          return remap.get(v);
        });
        push(sub, { pos: new Float32Array(p2), idx: new Uint32Array(i2) });
      }
    }
  }
}
for (const [id, geos] of bucket) {
  const mesh = doc.createMesh(id);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  let tris = 0;
  for (const { pos, idx } of geos) {
    for (let i = 0; i < pos.length; i += 3)
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], pos[i + k]);
        max[k] = Math.max(max[k], pos[i + k]);
      }
    tris += idx.length / 3;
    mesh.addPrimitive(
      doc.createPrimitive()
        .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buffer))
        .setIndices(doc.createAccessor().setType('SCALAR').setArray(idx).setBuffer(buffer))
    );
  }
  scene.addChild(doc.createNode(id).setMesh(mesh));
  const r = (v) => v.map((n) => +n.toFixed(4));
  info[id] = { center: r(min.map((m, k) => (m + max[k]) / 2)), min: r(min), max: r(max), triangles: tris };
}

await MeshoptSimplifier.ready;
await doc.transform(weld());
if (manifest.simplify) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: manifest.simplify, error: 0.001 }));
await doc.transform(dedup(), quantize({ quantizePosition: 14 }));

const out = path.resolve('public/meshes');
fs.mkdirSync(out, { recursive: true });
await new NodeIO().write(path.join(out, `${name}.glb`), doc);
fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify({ source, frame: manifest.frame, parts: info }, null, 1));
const kb = (fs.statSync(path.join(out, `${name}.glb`)).size / 1024).toFixed(0);
console.log(`${name}.glb: ${Object.keys(info).length} parti, ${kb} KB`);
