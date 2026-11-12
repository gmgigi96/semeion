// Modello anatomico generico: un insieme di parti con un nome, che si possono
// mostrare, nascondere, accendere, spegnere e dilatare, più connessioni
// orientate (vie) con un impulso che le percorre.
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { FONT } from './ui.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { taperTube } from './geo.js';

const GREY = new THREE.Color(0xa29c90);
const DARK = new THREE.Color(0x3a3632);
const WHITE = new THREE.Color(0xffffff);

// Involucro "in resina trasparente": quasi invisibile di fronte, più denso
// sui bordi, così la sagoma si legge senza coprire ciò che contiene.
function ghostMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        gl_FragColor = vec4(uColor, uOpacity * (0.12 + 2.6 * rim));
      }`,
  });
}

export class AnatomyModel {
  constructor({ tilt = -0.25 } = {}) {
    // group: posizione sulla pagina. Il modello è reclinato verso chi legge
    // (tilt) e ruota attorno al proprio asse verticale (spin); la base resta
    // piatta sulla pagina e ruota con lui (flat).
    this.group = new THREE.Group();
    this.flat = new THREE.Group();
    this.tilt = new THREE.Group();
    this.tilt.rotation.x = tilt;
    this.spin = new THREE.Group();
    this.inner = new THREE.Group();
    this.spin.add(this.inner);
    this.tilt.add(this.spin);
    this.group.add(this.flat, this.tilt);
    this.yaw = 0;
    this.grow = 1;

    this.parts = new Map();
    this.links = new Map();
    this.visible = new Set();
    this.hover = new Set();
    this.lookFn = null; // (part) => { color, glow, dim, dead, scale, opacity }
    this.onHover = null;
    this.onClick = null;
    this.time = 0;
    this.labels = new Map();
  }

  ui(id, name) {
    return {
      id,
      tip: name,
      drag: true,
      hover: (on) => this.onHover?.(on ? id : null),
      click: (hit) => this.onClick?.(id, hit),
    };
  }

  // Base di legno piatta sulla pagina e asta d'acciaio che regge il modello.
  addStand({ radius = 0.2, z = 0, rod }) {
    const wood = new THREE.MeshPhysicalMaterial({ color: 0x4a3122, roughness: 0.45, clearcoat: 0.6 });
    const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.03, 0.026, 64), wood);
    base.scale.set(radius, 1, radius);
    base.position.set(0, 0.013, z);
    base.castShadow = base.receiveShadow = true;
    this.flat.add(base);
    if (rod) {
      const [x, y0, y1, rz] = rod;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, y1 - y0, 12), steel);
      m.position.set(x, (y0 + y1) / 2, rz);
      m.castShadow = true;
      this.inner.add(m);
    }
  }

  // ghost: involucro trasparente di contesto, non intercetta il puntatore.
  addPart(id, name, color, geos, { ghost = false, opacity = ghost ? 0.1 : 1, roughness = 0.45, double = false } = {}) {
    const mat = ghost
      ? ghostMaterial(color)
      : new THREE.MeshPhysicalMaterial({
          color, roughness, clearcoat: 0.5, clearcoatRoughness: 0.35,
          emissive: color, emissiveIntensity: 0, transparent: true, opacity: 0,
          side: double ? THREE.DoubleSide : THREE.FrontSide,
        });
    const meshes = geos.map((g) => {
      // ogni pezzo ruota e si dilata attorno al proprio centro
      g.computeBoundingBox();
      const c = g.boundingBox.getCenter(new THREE.Vector3());
      const size = g.boundingBox.getSize(new THREE.Vector3());
      g.translate(-c.x, -c.y, -c.z);
      const m = new THREE.Mesh(g, mat);
      m.position.copy(c);
      m.userData.size = size;
      m.castShadow = !ghost;
      m.visible = false;
      if (ghost) m.renderOrder = 6;
      else m.userData.ui = this.ui(id, name);
      this.inner.add(m);
      return m;
    });
    const part = {
      id, name, ghost, mat, meshes, opacity,
      base: new THREE.Color(color),
      center: meshes[0].position.clone(),
      top: meshes[0].position.y + meshes[0].userData.size.y / 2,
      shown: 0, scale: 1,
    };
    this.parts.set(id, part);
    return part;
  }

  // Parti da mesh anatomiche reali (file prodotto da tools/mesh.mjs, già nelle
  // coordinate del modello). `defs`: { id: [nome, colore, opzioni] }. Le parti
  // del file non elencate in `defs` vengono ignorate.
  async loadMeshes(file, defs) {
    const gltf = await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}meshes/${file}`);
    gltf.scene.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    for (const node of gltf.scene.children) {
      const def = defs[node.name];
      if (!def) continue;
      const meshes = node.isMesh ? [node] : node.children.filter((c) => c.isMesh);
      const geos = meshes.map((m) => {
        // le posizioni sono quantizzate: le riporto a numeri in virgola mobile
        const src = m.geometry.attributes.position;
        const pos = new Float32Array(src.count * 3);
        for (let i = 0; i < src.count; i++) v.fromBufferAttribute(src, i).applyMatrix4(m.matrixWorld).toArray(pos, i * 3);
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setIndex(m.geometry.index);
        g.computeVertexNormals();
        return g;
      });
      // prima il lato destro (x > 0): è quello a cui si agganciano le vie
      geos.forEach((g) => g.computeBoundingBox());
      geos.sort((a, b) => b.boundingBox.max.x + b.boundingBox.min.x - (a.boundingBox.max.x + a.boundingBox.min.x));
      this.addPart(node.name, def[0], def[1], geos, def[2]);
    }
    for (const id of Object.keys(defs)) if (!this.parts.has(id)) console.error(`mesh mancante nel file ${file}: ${id}`);
  }

  // Connessione orientata: freccia per le vie eccitatorie, barra per le inibitorie.
  addLink(id, pts, { color = 0x2f9e5b, inhibit = false, r = 0.0045 } = {}) {
    const mat = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.55, transparent: true, opacity: 0, roughness: 0.4,
    });
    const g = taperTube(pts, r, { seg: 36, radial: 8, caps: false });
    const curve = g.userData.curve;
    const tube = new THREE.Mesh(g, mat);
    const end = curve.getPointAt(1);
    const dir = curve.getTangentAt(1);
    const head = new THREE.Mesh(
      inhibit ? new THREE.CylinderGeometry(r * 4, r * 4, r * 1.6, 16) : new THREE.ConeGeometry(r * 3.2, r * 8, 16),
      mat
    );
    head.position.copy(end).addScaledVector(dir, inhibit ? 0 : -r * 4);
    head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(r * 2.4, 12, 8), mat);
    const group = new THREE.Group();
    group.add(tube, head, pulse);
    group.visible = false;
    this.inner.add(group);
    this.links.set(id, { id, group, mat, curve, pulse, shown: 0, target: 0, phase: this.links.size * 0.37 });
  }

  show(ids) {
    this.visible = new Set(ids);
  }

  showLinks(ids) {
    const on = new Set(ids);
    for (const l of this.links.values()) l.target = on.has(l.id) ? 1 : 0;
  }

  // { id: +1 | -1 }: un cono sopra la parte indica attività aumentata o ridotta.
  setActivity(map) {
    for (const [id, part] of this.parts) {
      const v = map[id] ?? 0;
      if (!v && !part.cone) continue;
      if (!part.cone) {
        part.cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.014, 0.028, 16),
          new THREE.MeshBasicMaterial({ depthTest: false, transparent: true })
        );
        part.cone.renderOrder = 25;
        part.cone.position.set(part.center.x, part.top + 0.026, part.center.z);
        this.inner.add(part.cone);
      }
      part.cone.visible = !!v;
      part.cone.rotation.x = v < 0 ? Math.PI : 0;
      part.cone.material.color.set(v > 0 ? 0x1f9d57 : 0x2f6fe0);
    }
  }

  // { id: testo }: etichette sempre rivolte a chi guarda.
  setLabels(map) {
    for (const t of this.labels.values()) t.visible = false;
    for (const [id, text] of Object.entries(map)) {
      let t = this.labels.get(id);
      if (!t) {
        t = new Text();
        Object.assign(t, {
          font: FONT.italic, fontSize: 0.026, color: 0x2a2520, anchorX: 'center', anchorY: 'bottom',
          outlineWidth: '9%', outlineColor: 0xfbf6ea,
        });
        t.frustumCulled = false;
        t.material.depthTest = false;
        t.renderOrder = 30;
        const p = this.parts.get(id);
        t.position.set(p.center.x, p.top + 0.012, p.center.z);
        this.inner.add(t);
        this.labels.set(id, t);
      }
      t.text = text;
      t.visible = true;
    }
  }

  reset() {
    this.hover = new Set();
    this.lookFn = null;
    this.onClick = null;
    this.showLinks([]);
    this.setActivity({});
    this.setLabels({});
  }

  update(dt, camera, realDt = dt) {
    this.time += realDt;
    this.flat.rotation.y = this.spin.rotation.y = this.yaw;
    // il modello si alza dalla pagina lungo il proprio asse (nessuna deformazione)
    this.spin.scale.y = this.flat.scale.y = Math.max(0.001, this.grow);
    const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 9);
    const hovering = [...this.hover].some((id) => this.parts.has(id) && !this.parts.get(id).ghost);
    const col = new THREE.Color();

    for (const part of this.parts.values()) {
      const look = this.lookFn?.(part) ?? {};
      const hot = this.hover.has(part.id);
      // una parte nominata nel testo compare anche se in questa pagina è nascosta
      const target = this.visible.has(part.id) || hot ? 1 : 0;
      part.shown += (target - part.shown) * k;

      col.copy(look.color != null ? new THREE.Color(look.color) : part.base);
      let glow = look.glow ?? 0;
      if (look.dead) col.copy(DARK);
      else if (look.dim && !part.ghost) col.lerp(GREY, 0.72);
      if (hot) {
        col.lerp(WHITE, 0.22);
        glow = Math.max(glow, 0.45);
      } else if (hovering && !part.ghost) col.lerp(GREY, 0.4);

      const opacity = (look.opacity ?? part.opacity) * part.shown;
      if (part.ghost) {
        const u = part.mat.uniforms;
        u.uColor.value.lerp(col, k);
        u.uOpacity.value += (opacity * (1 + glow * 2) - u.uOpacity.value) * k;
      } else {
        part.mat.color.lerp(col, k);
        part.mat.emissive.copy(part.mat.color);
        part.mat.emissiveIntensity += (glow - part.mat.emissiveIntensity) * k;
        part.mat.opacity += (opacity - part.mat.opacity) * k;
        part.mat.depthWrite = part.mat.opacity > 0.7;
      }
      part.scale += ((look.scale ?? 1) - part.scale) * k;
      for (const m of part.meshes) {
        m.visible = part.shown > 0.03;
        m.scale.setScalar(part.scale);
      }
    }

    for (const l of this.links.values()) {
      l.shown += (l.target - l.shown) * k;
      l.group.visible = l.shown > 0.03;
      l.mat.opacity = l.shown;
      l.curve.getPointAt((this.time * 0.55 + l.phase) % 1, l.pulse.position);
    }

    const inv = new THREE.Quaternion();
    this.inner.getWorldQuaternion(inv).invert();
    const q = inv.multiply(camera.quaternion);
    for (const t of this.labels.values()) t.quaternion.copy(q);
  }
}
