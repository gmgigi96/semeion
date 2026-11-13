// Comportamenti riutilizzabili della pagina destra: una fila di pulsanti, una
// riga di commento e, per i modelli generici, la scelta di un'opzione che
// accende parti, vie e passi in sequenza.
import * as THREE from 'three';
import { makeText, chip, chipRow, cord } from './ui.js';

export const M = 0.09; // margine di pagina
export const W = 1 - 2 * M; // giustezza

// Scoperte: la doppia pagina mette in `controls.userData.explore` le funzioni
// `offer(etichetta)` (un comando che c'è) e `found(etichetta)` (un comando provato),
// che il riepilogo del capitolo elenca. Pulsanti e corde le chiamano da sé; un
// comportamento su misura chiama `found` per scoperte che non passano di qui.
export const explore = (controls) => controls.userData.explore ?? { offer() {}, found() {} };

// Un comportamento su misura che sceglie un'opzione toccando il modello (`pick`) la conta
// come provata con `picked(controls, etichetta)`: scegliere sul modello vale come il pulsante.
export const picked = (controls, label) => label && explore(controls).found(label);

// Ogni pulsante conta come comando da provare, salvo `explore: false` (per esempio
// un pulsante che rimette a posto).
export async function chipsInto(controls, specs) {
  const chips = [];
  const ex = explore(controls);
  for (const s of specs) {
    const counts = s.explore !== false;
    if (counts) ex.offer(s.label);
    chips.push(await chip(s.label, { onClick: () => (counts && ex.found(s.label), s.onClick?.()) }));
  }
  const row = chipRow(chips, W);
  controls.add(row.group);
  return { chips, height: row.height };
}

export async function infoText(controls, y) {
  const t = makeText('', {
    fontSize: 0.0205, maxWidth: W, lineHeight: 1.36, anchorX: 'center', textAlign: 'center',
  });
  t.position.set(W / 2, y, t.position.z);
  controls.add(t);
  return t;
}

// Corda con manico (vedi `cord` in src/ui.js) sotto i pulsanti, a quota y.
// `onChange(v)` riceve i valori che vengono da chi legge.
// La corda conta come comando da provare con il suo titoletto, in minuscolo
// (il titoletto è in maiuscoletto).
export async function cordInto(controls, y, spec, onChange) {
  const ex = explore(controls);
  const label = spec.label ?? '';
  const name = label ? label.charAt(0) + label.slice(1).toLowerCase() : spec.ends?.join(' / ') || 'corda';
  ex.offer(name);
  const c = await cord({ ...spec, width: W, onChange: (v) => (ex.found(name), onChange?.(v)) });
  c.group.position.y = y;
  controls.add(c.group);
  return c;
}

// Scelta di un'opzione su un AnatomyModel.
//   base      parti sempre visibili nella pagina
//   looks     aspetto di base per parte, es. { v3: { opacity: 0.4 } }
//   options   [{ label, lit, show, links, info, activity, dead, scale, steps, focus }]
//             focus: { at, scale } primo piano (vedi AnatomyModel.zoomTo); anche per passo
//             steps: [{ ids, links, text }] si accendono uno dopo l'altro
//   pick      { idParte: indiceOpzione } per scegliere cliccando il modello
//             act(model): facoltativa, nell'opzione o in un passo: un gesto del modello
//             quando l'opzione è scelta o il passo comincia (per esempio un colpo di martelletto)
//   initial   opzione attiva all'ingresso (null = nessuna)
//   cord      { label, ends, min, max, value, spring, format, react }: un comando continuo
//             sotto i pulsanti (vedi `cord` in ui.js). Quando chi legge lo muove,
//             react(v, prima) riceve il valore (e il risultato precedente) e ritorna
//             un'opzione statica (lit, show, links, info, activity, dead, scale, labels,
//             focus) che prende il posto di quella scelta; con `release: true` nel
//             risultato la corda sfugge di mano e torna a riposo. Scegliere un pulsante
//             riporta la corda a riposo.
export function selector({ base, options, looks = {}, pick = {}, initial = null, labels = {}, idle = '', cord: cordSpec = null }) {
  return async ({ model, controls, def }) => {
    let sel = null;
    // primo piano: quello del passo, altrimenti dell'opzione, altrimenti della pagina
    // (`null` esplicito torna all'insieme anche se la pagina ha un primo piano)
    const focus = (...list) => {
      const own = list.find((f) => f !== undefined);
      model.zoomTo?.(own !== undefined ? own : def?.view?.focus ?? null);
    };
    let t0 = 0;
    let shownStep = -1;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i && !o.steps ? null : i) }))
    );
    let live = null; // l'opzione che viene dalla corda, finché nessun pulsante è scelto
    let liveKey = '';
    const rope = cordSpec && (await cordInto(controls, -height - 0.022, cordSpec, (v) => pull(v)));
    const info = await infoText(controls, -height - 0.03 - (rope ? rope.height + 0.012 : 0));
    const current = () => live ?? options[sel];

    const stepOf = (o) => Math.min(o.steps.length - 1, Math.floor((model.time - t0) / (o.stepTime ?? 1.1)));
    const apply = (o) => {
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? []), ...(o?.steps?.flatMap((s) => s.ids) ?? [])]);
      model.setActivity(o?.activity ?? {});
      model.setLabels(o?.labels ?? labels);
      focus(o?.steps?.[0].focus, o?.focus);
      if (!o?.steps) {
        model.showLinks(o?.links ?? []);
        info.text = o?.info ?? idle;
      }
      o?.act?.(model);
      o?.steps?.[0].act?.(model);
    };
    const select = (i) => {
      sel = i;
      live = null;
      liveKey = '';
      t0 = model.time;
      shownStep = -1;
      chips.forEach((c, j) => c.setActive(j === i));
      rope?.set(cordSpec.rest ?? cordSpec.value ?? cordSpec.min ?? 0);
      apply(options[i]);
    };
    // la corda prende il posto dei pulsanti; il modello cambia solo se cambia l'esito
    const pull = (v) => {
      const o = cordSpec.react(v, live);
      if (sel !== null) {
        sel = null;
        chips.forEach((c) => c.setActive(false));
      }
      live = o;
      if (o.release) rope.release();
      const key = JSON.stringify(o);
      if (key === liveKey) return;
      liveKey = key;
      apply(o);
    };

    return {
      // la previsione verificata sul modello vale come aver provato quell'opzione
      choose: (i) => (explore(controls).found(options[i]?.label), select(i)),
      // una riga di commento da un comportamento che avvolge questo (vedi `strikeMode` in riflessi.js)
      say: (text) => (info.text = text),
      enter() {
        select(initial);
        // scegliere un'opzione toccando il modello vale come provarla
        model.onClick = (id) => id in pick && (explore(controls).found(options[pick[id]]?.label), select(pick[id]));
        model.lookFn = (part) => {
          const o = current();
          const look = { ...looks[part.id] };
          if (!o) return look;
          if (o.dead?.includes(part.id)) return { ...look, dead: true };
          if (o.scale?.[part.id]) look.scale = o.scale[part.id];
          if (o.steps) {
            const k = stepOf(o);
            const now = o.steps[k].ids.includes(part.id);
            const before = o.steps.slice(0, k).some((s) => s.ids.includes(part.id));
            // un involucro trasparente si illumina ma non diventa opaco
            if (now) return part.ghost ? { ...look, glow: 0.55 } : { ...look, glow: 0.55, opacity: 1 };
            if (before) return { ...look, glow: 0.15 };
            return { ...look, dim: true };
          }
          if (!o.lit) return look;
          return o.lit.includes(part.id) ? { ...look, glow: 0.3, opacity: look.litOpacity ?? look.opacity } : { ...look, dim: true };
        };
      },
      // le sequenze avanzano col tempo: aggiorna commento e vie visibili
      update() {
        rope?.update();
        const o = options[sel];
        if (!o?.steps) return;
        const k = stepOf(o);
        if (k === shownStep) return;
        shownStep = k;
        focus(o.steps[k].focus, o.focus);
        if (k > 0) o.steps[k].act?.(model); // il primo passo lo fa già `apply`
        info.text = `${k + 1}/${o.steps.length} · ${o.steps[k].text}`;
        const done = o.steps.slice(0, k + 1);
        model.showLinks(done.flatMap((s) => s.links ?? []));
        model.setActivity(Object.assign({}, o.activity, ...done.map((s) => s.activity ?? {})));
      },
    };
  };
}

// «Taglia qui»: chi legge taglia una via toccandola in un punto qualsiasi del suo
// decorso; l'esito resta nascosto finché la domanda `cut` della pagina sinistra (vedi
// cutQuiz in src/ui.js) non chiede il confronto. Senza quella domanda l'esito si vede subito.
//   base, looks, idle   come in `selector`
//   paths     id di vie del modello (addLink) da tagliare: conta il punto della via più
//             vicino al raggio del puntatore, entro `tolerance` (unità del modello), anche
//             se davanti c'è altro
//   parts     id di parti da tagliare (per esempio un'arteria): conta il loro vertice più
//             vicino al raggio, sempre entro `tolerance`
//   radius    raggio della lesione attorno al punto, o funzione del punto: le vie che vi
//             passano sono interrotte. `lesion(punto, vie)` la sostituisce (vie: Map id ->
//             punti campionati) e ritorna il Set delle vie interrotte
//   outcome({ point, path, part, hits }, model) ritorna l'esito del taglio, oppure null (qui non
//             si taglia) o { reason } (perché qui no):
//             { label, site, truth, dead, links, labels, info, ring }
//             label  dove si è tagliato, in minuscolo («tratto ottico destro»)
//             site   la scoperta, una di `sites` («Tratto ottico»)
//             truth  le chiavi del deficit vero, per il confronto con la previsione
//             dead, links, labels, info   ciò che il modello mostra nel confronto (links
//             predefinite: le vie di `links` non interrotte)
//             ring   { at, normal, r }: dove disegnare l'anello del taglio, se non sul punto
//   links     vie visibili con la via intatta (predefinite: `paths`)
//   sites     etichette delle scoperte: il riepilogo le elenca, si spuntano al confronto
//   marks     tavola «modello»: id delle parti che si toccano per la previsione, in ordine
//             di precedenza (prima le piccole e profonde, che il raggio attraversa); un
//             elemento può essere un gruppo di id di pari precedenza: vince la più vicina
//   reset     etichetta del pulsante che ricuce la via
//   miss      commento per un tocco che non trova nulla da tagliare
//   onReveal(model, esito | null) ciò che il modello aggiunge al confronto (null: si ricuce)
export function cutter({
  base, looks = {}, idle = '', paths = [], parts = [], links = paths, tolerance = 0.012, radius = 0.01,
  lesion = null, outcome, sites = [], marks = [], reset = 'Ricuci la via', onReveal = null,
  miss = 'Qui non passa la via: tocca la via per tagliarla.',
}) {
  return async ({ model, controls, quiz }) => {
    const ex = explore(controls);
    for (const s of sites) ex.offer(s);
    const { chips, height } = await chipsInto(controls, [{ label: reset, explore: false, onClick: () => apply(null) }]);
    const info = await infoText(controls, -height - 0.03);
    const asks = !!quiz?.cut; // c'è una previsione da fare prima di vedere l'esito
    let cut = null;
    let shown = false;

    // vie campionate a passo fisso, nelle coordinate del modello
    const samples = new Map();
    const sampled = () => {
      for (const id of paths)
        if (!samples.has(id)) {
          const c = model.links.get(id).curve;
          samples.set(id, c.getSpacedPoints(Math.max(40, Math.ceil(c.getLength() / 0.0015))));
        }
      return samples;
    };
    const toLocal = (ray) => ray.clone().applyMatrix4(model.inner.matrixWorld.clone().invert());
    // prima parte attraversata dal raggio; `tiers` è un elenco di gruppi di id: vince il
    // primo gruppo che il raggio attraversa e, al suo interno, la parte più vicina
    const caster = new THREE.Raycaster();
    const through = (ray, tiers) => {
      caster.ray.copy(ray);
      for (const ids of tiers) {
        const meshes = ids.flatMap((id) => model.parts.get(id)?.meshes.filter((m) => m.visible) ?? []);
        const [h] = caster.intersectObjects(meshes, false);
        if (h) return { id: ids.find((id) => model.parts.get(id).meshes.includes(h.object)), point: model.inner.worldToLocal(h.point.clone()) };
      }
      return null;
    };
    const markTiers = marks.map((m) => (Array.isArray(m) ? m : [m]));
    const markIds = markTiers.flat();
    // punti delle parti da tagliare: i loro vertici, nelle coordinate del modello
    const vertices = new Map();
    const partPoints = (id) => {
      if (!vertices.has(id))
        vertices.set(id, model.parts.get(id).meshes.flatMap((m) => {
          const pos = m.geometry.attributes.position;
          return Array.from({ length: pos.count }, (_, i) => new THREE.Vector3().fromBufferAttribute(pos, i).add(m.position));
        }));
      return vertices.get(id);
    };
    // il punto più vicino al raggio, entro `tolerance`; dove due vie si incrociano a
    // schermo vince quella davanti, fra le più vicine al raggio
    const nearest = (local, sets) => {
      const near = [];
      for (const [id, pts] of sets)
        for (const [i, p] of pts.entries()) {
          const d = Math.sqrt(local.distanceSqToPoint(p));
          if (d <= tolerance) near.push({ d, id, i, pts, depth: p.clone().sub(local.origin).dot(local.direction) });
        }
      const dmin = Math.min(...near.map((n) => n.d));
      return near.filter((n) => n.d <= dmin + 0.002).sort((a, b) => a.depth - b.depth)[0];
    };
    const locate = (ray) => {
      const local = toLocal(ray);
      const best = nearest(local, sampled());
      if (best) {
        const { pts, i } = best;
        const normal = pts[Math.min(pts.length - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]);
        return { point: pts[i].clone(), path: best.id, normal };
      }
      const on = parts.length && nearest(local, parts.filter((id) => model.parts.get(id).shown > 0.5).map((id) => [id, partPoints(id)]));
      return on ? { point: on.pts[on.i].clone(), part: on.id, normal: local.direction.clone() } : null;
    };
    const sphere = (p) => {
      const r = typeof radius === 'function' ? radius(p) : radius;
      return new Set([...sampled()].filter(([, pts]) => pts.some((q) => q.distanceTo(p) < r)).map(([id]) => id));
    };

    const say = (c) =>
      c ? `${c.out.label[0].toUpperCase()}${c.out.label.slice(1)}.${asks ? ' Prevedi il deficit sulla pagina di sinistra, poi confronta.' : ''}` : idle;
    const apply = (c) => {
      cut = c;
      shown = false;
      chips[0].group.visible = !!c;
      const ring = c?.out.ring;
      const r0 = typeof radius === 'function' && c ? radius(c.point) : radius;
      model.markCut(c ? ring?.at ?? c.point : null, ring?.normal ?? c?.normal, ring?.r ?? Math.max(0.01, r0 * 1.5));
      model.showLinks(links);
      model.setLabels({});
      onReveal?.(model, null);
      info.text = say(c);
      quiz?.cut?.(c && { label: c.out.label, truth: c.out.truth, at: saved(c) });
      if (c && !asks) reveal();
    };
    // il taglio in forma da salvare (JSON), per rifarlo con `replay` alla prossima visita
    const round = (v) => v.toArray().map((x) => +x.toFixed(5));
    const saved = (c) => ({ point: round(c.point), normal: round(c.normal ?? new THREE.Vector3(0, 0, 1)), path: c.path ?? null, part: c.part ?? null });
    // il confronto: il modello mostra l'esito vero
    const reveal = () => {
      if (!cut || shown) return;
      shown = true;
      const o = cut.out;
      model.showLinks(o.links ?? links.filter((id) => !cut.hits.has(id)));
      const said = { ...o.labels };
      // tavola sul modello: accanto alle parti, che cosa coincide, che cosa mancava, che cosa era di troppo
      if (markIds.length && quiz?.marks) {
        const truth = new Set(o.truth);
        for (const id of new Set([...truth, ...quiz.marks]))
          said[id] = truth.has(id) ? (quiz.marks.has(id) ? 'coincide' : 'mancava') : 'di troppo';
      }
      model.setLabels(said);
      info.text = o.info ?? '';
      onReveal?.(model, o);
      ex.found(o.site);
    };

    return {
      reveal,
      // rifà un taglio salvato (vedi `saved`); false se non è più valido
      replay(at) {
        const vec = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite) && new THREE.Vector3(...a);
        const point = vec(at?.point);
        if (!point) return false;
        if (at.path ? !paths.includes(at.path) : !parts.includes(at.part)) return false;
        const c = { point, normal: vec(at.normal) || new THREE.Vector3(0, 0, 1), path: at.path ?? undefined, part: at.part ?? undefined };
        c.hits = lesion ? lesion(point, sampled()) : c.path ? sphere(point) : new Set();
        const out = outcome(c, model);
        if (!out || out.reason) return false;
        apply({ ...c, out });
        return true;
      },
      enter() {
        model.show(base);
        apply(null);
        model.lookFn = (part) => {
          const look = { ...looks[part.id] };
          if (shown && cut.out.dead?.includes(part.id)) return { ...look, dead: true };
          if (!shown && quiz?.marks?.has(part.id)) return { ...look, color: 0xc2402b, glow: 0.3 };
          return look;
        };
        // anche un tocco che non prende nessuna parte: la via può passare dentro un involucro
        model.onMiss = (ray) => model.onClick(null, { ray });
        model.onClick = (id, hit) => {
          if (!hit?.ray) return;
          // mentre si segna la previsione sul modello, i tocchi segnano e non tagliano
          if (markIds.length && quiz?.state === 'mark') {
            const m = through(hit.ray, markTiers);
            if (m) quiz.toggle(m.id);
            else info.text = 'Ora tocca le parti che prevedi colpite. Per tagliare altrove, ricuci.';
            return;
          }
          const c = locate(hit.ray);
          if (c) c.hits = lesion ? lesion(c.point, sampled()) : c.path ? sphere(c.point) : new Set();
          const out = c && outcome(c, model);
          if (!out || out.reason) {
            info.text = out?.reason ?? miss;
            return;
          }
          apply({ ...c, out });
        };
      },
    };
  };
}
