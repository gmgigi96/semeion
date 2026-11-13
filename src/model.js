// Modello anatomico generico: un insieme di parti con un nome, che si possono
// mostrare, nascondere, accendere, spegnere e dilatare, più connessioni
// orientate (vie) con un impulso che le percorre.
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { FONT, FONT_SCALE } from './ui.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { taperTube } from './geo.js';

const GREY = new THREE.Color(0xa29c90);
const DARK = new THREE.Color(0x3a3632);
const WHITE = new THREE.Color(0xffffff);

// Involucro "in resina trasparente": quasi invisibile di fronte, più denso
// sui bordi, così la sagoma si legge senza coprire ciò che contiene.
// Limiti della pagina destra nello spazio del libro (vedi src/book.js): la
// pagina va da x = 0 (piega) a x = 1, e i pulsanti cominciano a z = 0.2.
// Le normali puntano verso la parte che resta visibile.
const PAGE_PLANES = [
  new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  new THREE.Plane(new THREE.Vector3(1, 0, 0), -0.015),
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.985),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.2),
  // bordo alto della pagina, visto dalla camera (che guarda lungo (0, -1.5, -1)):
  // taglia ciò che a schermo finirebbe oltre il libro
  new THREE.Plane(new THREE.Vector3(0, -1, 1.5).normalize(), 0.58),
];
const FAR_AWAY = 1000;
const TOP_EDGE = new THREE.Vector3(0, 0, -0.715); // bordo alto della copertina
// Punto, nel sistema del modello che ruota, su cui cade il centro di un primo piano.
const LENS_ANCHOR = new THREE.Vector3(0, 0.36, 0);

function ghostMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    clipping: true,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
    vertexShader: `
      #include <clipping_planes_pars_vertex>
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        #include <clipping_planes_vertex>
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      #include <clipping_planes_pars_fragment>
      uniform vec3 uColor; uniform float uOpacity;
      varying vec3 vN; varying vec3 vV;
      void main() {
        #include <clipping_planes_fragment>
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
    this.restTilt = tilt;
    this.spin = new THREE.Group();
    // Le coordinate dei modelli hanno x verso la destra del paziente, y in alto,
    // z in avanti: è una terna sinistrorsa. `mirror` la ribalta, così a schermo
    // il modello non è l'immagine speculare del vero (visto di fronte, la destra
    // del paziente sta a sinistra di chi guarda). Le etichette stanno fuori dal
    // ribaltamento (`overlay`) per restare leggibili.
    this.mirror = new THREE.Group();
    this.mirror.scale.x = -1;
    // `lens` è il primo piano chiesto con zoomTo(): ingrandisce il modello
    // attorno a un suo punto, portandolo sopra il centro della base.
    this.lens = new THREE.Group();
    this.inner = new THREE.Group();
    this.lens.add(this.inner);
    this.mirror.add(this.lens);
    this.zoom = null; // { at: Vector3, scale }
    // Nei primi piani ciò che esce dalla pagina destra viene tagliato: piano
    // della pagina, piega del libro, bordo esterno, riga dei pulsanti.
    this.clipPlanes = PAGE_PLANES.map((p) => p.clone());
    this.overlay = new THREE.Group();
    this.spin.add(this.mirror, this.overlay);
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
    this.onMiss = null; // (raggio) => …: un tocco sul modello che non ha preso nessuna parte
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
    this.standBase = base;
    this.flat.add(base);
    if (rod) {
      const [x, y0, y1, rz] = rod;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, y1 - y0, 12), steel);
      m.position.set(x, (y0 + y1) / 2, rz);
      m.castShadow = true;
      this.standRod = m;
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
    mat.clippingPlanes = this.clipPlanes;
    mat.clipShadows = true;
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
    mat.clippingPlanes = this.clipPlanes;
    mat.clipShadows = true;
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
    for (const t of this.labels.values()) t.visible = t.userData.on = t.userData.lead.visible = false;
    for (const [id, text] of Object.entries(map)) {
      let t = this.labels.get(id);
      if (!t) {
        t = new Text();
        Object.assign(t, {
          // corsivo rosso, come le etichette a mano delle tavole
          font: FONT.italic, fontSize: 0.028 * FONT_SCALE, color: 0x9c2f22, anchorX: 'center', anchorY: 'bottom',
          outlineWidth: '9%', outlineColor: 0xfbf6ea,
        });
        t.frustumCulled = false;
        for (const m of [t.material].flat()) m.depthTest = false; // con il contorno i materiali sono due
        t.renderOrder = 30;
        const p = this.parts.get(id);
        t.userData.anchor = new THREE.Vector3(p.center.x, p.top, p.center.z);
        t.userData.raise = 0; // spostamento verso l'alto a schermo, per non coprire un'altra etichetta
        // linea di richiamo dalla parte all'etichetta spostata
        const lead = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
          new THREE.LineBasicMaterial({ color: 0x9c2f22, transparent: true, opacity: 0.75, depthTest: false })
        );
        lead.frustumCulled = false;
        lead.renderOrder = 29;
        lead.visible = false;
        t.userData.lead = lead;
        this.overlay.add(t, lead);
        this.labels.set(id, t);
      }
      t.text = text;
      t.visible = t.userData.on = true;
    }
  }

  // Segno di un taglio (vedi `cutter` in src/modes.js): un anello rosso attorno al
  // punto `at`, perpendicolare a `normal`, di raggio `r`, nelle coordinate del modello.
  // Si vede anche attraverso le parti che lo coprono. markCut(null) lo toglie.
  markCut(at, normal, r = 0.012) {
    if (!this.cutRing) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xb3261e, depthTest: false, transparent: true, opacity: 0.95 });
      mat.clippingPlanes = this.clipPlanes;
      this.cutRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.14, 8, 40), mat);
      this.cutRing.renderOrder = 26;
      this.inner.add(this.cutRing);
    }
    this.cutRing.visible = !!at;
    if (!at) return;
    this.cutRing.position.copy(at);
    this.cutRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize());
    this.cutRing.scale.setScalar(r);
  }

  // Fra le parti `ids`, quella con la superficie più vicina al punto `p` (coordinate
  // del modello): { id, d }, con d la distanza dal vertice più vicino.
  nearestPart(p, ids) {
    let best = { id: null, d: Infinity };
    const v = new THREE.Vector3();
    for (const id of ids) {
      const part = this.parts.get(id);
      for (const m of part?.meshes ?? []) {
        const pos = m.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const d = v.fromBufferAttribute(pos, i).multiplyScalar(m.scale.x).add(m.position).distanceToSquared(p);
          if (d < best.d) best = { id, d };
        }
      }
    }
    return { id: best.id, d: Math.sqrt(best.d) };
  }

  // Primo piano su un punto del modello: `at` è l'id di una parte o [x, y, z]
  // nelle coordinate del modello, `scale` l'ingrandimento. Con `clip: false`
  // ciò che esce dalla pagina non viene tagliato; `height` è la quota a cui portare
  // il punto, `tilt` l'inclinazione del modello in questa vista (radianti, negativa =
  // reclinato all'indietro), `stand: false` nasconde la base. zoomTo(null) torna all'insieme.
  zoomTo(focus) {
    if (!focus) {
      this.zoom = null;
      return;
    }
    const at = Array.isArray(focus.at) ? new THREE.Vector3(...focus.at) : this.parts.get(focus.at)?.center.clone();
    if (!at) return console.error(`zoomTo: parte sconosciuta ${focus.at}`);
    if (typeof focus.at === 'string' && focus.midline) at.x = 0;
    this.zoom = {
      at, scale: focus.scale ?? 2, clip: focus.clip !== false, height: focus.height ?? LENS_ANCHOR.y,
      tilt: focus.tilt, stand: focus.stand !== false,
    };
  }

  reset() {
    this.zoomTo(null);
    this.hover = new Set();
    this.lookFn = null;
    this.onClick = null;
    this.onMiss = null;
    this.showLinks([]);
    this.setActivity({});
    this.setLabels({});
    this.markCut(null);
  }

  update(dt, camera, realDt = dt) {
    this.time += realDt;
    this.flat.rotation.y = this.spin.rotation.y = this.yaw;
    // il modello si alza dalla pagina lungo il proprio asse (nessuna deformazione)
    this.spin.scale.y = this.flat.scale.y = Math.max(0.001, this.grow);
    const k = 1 - Math.exp(-Math.min(realDt, 0.5) * 9);

    // primo piano: lens porta il punto scelto sopra il centro della base
    const kz = 1 - Math.exp(-Math.min(realDt, 0.5) * 4);
    const z = this.zoom;
    const scale = z?.scale ?? 1;
    const target = new THREE.Vector3();
    if (z) {
      // il punto è dato nelle coordinate del modello: tiene conto di come il modello ha posto `inner`
      const p = z.at.clone().multiply(this.inner.scale).add(this.inner.position);
      target.set(-p.x * scale, z.height - p.y * scale, -p.z * scale);
    }
    this.lens.scale.lerp(new THREE.Vector3(scale, scale, scale), kz);
    this.lens.position.lerp(target, kz);
    // l'inclinazione si tocca solo se un primo piano l'ha chiesta (alcuni
    // modelli la gestiscono da sé), e poi la si riporta a riposo
    if (z?.tilt != null) this.tiltDriven = true;
    if (this.tiltDriven) {
      const goal = z?.tilt ?? this.restTilt;
      this.tilt.rotation.x += (goal - this.tilt.rotation.x) * kz;
      if (z?.tilt == null && Math.abs(goal - this.tilt.rotation.x) < 1e-3) this.tiltDriven = false;
    }
    // l'asta regge il modello intero: in primo piano non ha senso
    if (this.standRod) this.standRod.visible = !z;
    if (this.standBase) this.standBase.visible = !z || z.stand;
    for (const [i, plane] of this.clipPlanes.entries()) {
      plane.copy(PAGE_PLANES[i]);
      if (!z?.clip || this.freeView) plane.constant = FAR_AWAY;
    }
    // bordo alto: il piano passa per la camera e per il bordo del libro, così a
    // schermo nulla supera il libro, qualunque sia la prospettiva
    if (z?.clip && !this.freeView) {
      const d = camera.position.clone().sub(TOP_EDGE);
      const n = new THREE.Vector3(0, -d.z, d.y).normalize();
      this.clipPlanes[4].set(n, -n.dot(TOP_EDGE));
    }
    // gli indicatori di attività restano della stessa misura in primo piano
    const ls = this.lens.scale.x;
    for (const part of this.parts.values())
      if (part.cone) {
        part.cone.scale.setScalar(1 / ls);
        part.cone.position.y = part.top + 0.026 / ls;
      }

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
        // in primo piano un involucro copre più schermo: lo si alleggerisce
        u.uOpacity.value += ((opacity * (1 + glow * 2)) / Math.sqrt(this.lens.scale.x) - u.uOpacity.value) * k;
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

    // etichette: seguono la parte (anche se `inner` è stato spostato o scalato)
    // e restano rivolte a chi guarda
    const inv = new THREE.Quaternion();
    this.overlay.getWorldQuaternion(inv).invert();
    const q = inv.multiply(camera.quaternion);
    this.inner.updateWorldMatrix(true, false);
    this.overlay.updateWorldMatrix(true, false);
    for (const t of this.labels.values()) {
      if (!t.userData.on) continue;
      t.position.copy(t.userData.anchor).applyMatrix4(this.inner.matrixWorld);
      // l'etichetta di una parte tagliata via dal ritaglio non resta sospesa
      t.visible = this.clipPlanes.every((pl) => pl.distanceToPoint(t.position) >= -0.02);
      this.overlay.worldToLocal(t.position);
      t.position.y += 0.012; // scarto fisso, anche se `inner` è ingrandito
      t.quaternion.copy(q);
    }
    this.#unstackLabels(camera, realDt);
  }

  // Etichette che a schermo si coprirebbero: dal basso verso l'alto, ciascuna sale sopra
  // quelle già posate con cui si sovrappone in orizzontale, e una linea di richiamo la lega
  // alla sua parte. Lo spostamento è a schermo (lungo l'alto della camera) e scorre morbido.
  #unstackLabels(camera, dt) {
    const shown = [...this.labels.values()].filter((t) => t.visible && t.userData.on && t.textRenderInfo);
    for (const t of this.labels.values()) if (!shown.includes(t)) t.userData.lead.visible = false;
    if (!shown.length) return;
    this.overlay.updateWorldMatrix(true, false);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const s = new THREE.Vector3().setFromMatrixScale(this.overlay.matrixWorld);
    const scale = Math.abs(s.x);
    const ndc = (v) => v.clone().project(camera);
    const boxes = shown.map((t) => {
      const w = this.overlay.localToWorld(t.position.clone());
      const [x0, y0, x1, y1] = t.textRenderInfo.blockBounds;
      const p = ndc(w);
      // misure a schermo: larghezza e altezza del testo, e quanto vale un'unità del mondo in alto
      const perUp = ndc(w.clone().addScaledVector(up, 0.01)).y - p.y;
      const half = Math.abs(ndc(w.clone().addScaledVector(right, ((x1 - x0) * scale) / 2)).x - p.x);
      const h = Math.abs(perUp) * (((y1 - y0) * scale) / 0.01);
      return { t, w, x: p.x, y: p.y, half, h, perUp: perUp / 0.01 };
    });
    boxes.sort((a, b) => a.y - b.y);
    const placed = [];
    const pad = 0.012; // margine tra due etichette, in coordinate dello schermo
    for (const b of boxes) {
      let y = b.y;
      // sale finché non si sovrappone più a nessuna etichetta già posata
      for (let k = 0; k < placed.length + 1; k++) {
        const hit = placed.find((o) => Math.abs(o.x - b.x) < o.half + b.half && y < o.top + pad && y + b.h > o.y - pad);
        if (!hit) break;
        y = hit.top + pad;
      }
      placed.push({ x: b.x, y, top: y + b.h, half: b.half });
      const goal = b.perUp > 1e-6 ? (y - b.y) / b.perUp : 0;
      const u = b.t.userData;
      u.raise += (goal - u.raise) * (1 - Math.exp(-Math.min(dt, 0.1) * 10));
      if (Math.abs(goal - u.raise) < 1e-5) u.raise = goal;
      const at = b.w.clone().addScaledVector(up, u.raise);
      b.t.position.copy(this.overlay.worldToLocal(at.clone()));
      // linea di richiamo: dal punto sopra la parte al piede dell'etichetta
      const lead = u.lead;
      lead.visible = u.raise > 0.004;
      if (lead.visible) {
        const from = this.overlay.worldToLocal(b.w.clone().addScaledVector(up, -0.01));
        const to = this.overlay.worldToLocal(at.clone().addScaledVector(up, 0.001));
        lead.geometry.attributes.position.setXYZ(0, from.x, from.y, from.z);
        lead.geometry.attributes.position.setXYZ(1, to.x, to.y, to.z);
        lead.geometry.attributes.position.needsUpdate = true;
      }
    }
  }
}
