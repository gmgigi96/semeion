// Comportamenti riutilizzabili della pagina destra: una fila di pulsanti, una
// riga di commento e, per i modelli generici, la scelta di un'opzione che
// accende parti, vie e passi in sequenza.
import { makeText, chip, chipRow } from './ui.js';

export const M = 0.09; // margine di pagina
export const W = 1 - 2 * M; // giustezza

export async function chipsInto(controls, specs) {
  const chips = [];
  for (const s of specs) chips.push(await chip(s.label, { onClick: s.onClick }));
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

// Scelta di un'opzione su un AnatomyModel.
//   base      parti sempre visibili nella pagina
//   looks     aspetto di base per parte, es. { v3: { opacity: 0.4 } }
//   options   [{ label, lit, show, links, info, activity, dead, scale, steps, focus }]
//             focus: { at, scale } primo piano (vedi AnatomyModel.zoomTo); anche per passo
//             steps: [{ ids, links, text }] si accendono uno dopo l'altro
//   pick      { idParte: indiceOpzione } per scegliere cliccando il modello
//   initial   opzione attiva all'ingresso (null = nessuna)
export function selector({ base, options, looks = {}, pick = {}, initial = null, labels = {}, idle = '' }) {
  return async ({ model, controls, def }) => {
    let sel = null;
    // primo piano: quello del passo, altrimenti dell'opzione, altrimenti della pagina
    const focus = (...list) => model.zoomTo?.(list.find((f) => f !== undefined) ?? def?.view?.focus ?? null);
    let t0 = 0;
    let shownStep = -1;
    const { chips, height } = await chipsInto(
      controls,
      options.map((o, i) => ({ label: o.label, onClick: () => select(sel === i && !o.steps ? null : i) }))
    );
    const info = await infoText(controls, -height - 0.03);

    const stepOf = (o) => Math.min(o.steps.length - 1, Math.floor((model.time - t0) / (o.stepTime ?? 1.1)));
    const select = (i) => {
      sel = i;
      t0 = model.time;
      shownStep = -1;
      const o = options[i];
      chips.forEach((c, j) => c.setActive(j === i));
      model.show([...base, ...(o?.show ?? []), ...(o?.lit ?? []), ...(o?.steps?.flatMap((s) => s.ids) ?? [])]);
      model.setActivity(o?.activity ?? {});
      model.setLabels(o?.labels ?? labels);
      focus(o?.steps?.[0].focus, o?.focus);
      if (!o?.steps) {
        model.showLinks(o?.links ?? []);
        info.text = o?.info ?? idle;
      }
    };

    return {
      enter() {
        select(initial);
        model.onClick = (id) => id in pick && select(pick[id]);
        model.lookFn = (part) => {
          const o = options[sel];
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
        const o = options[sel];
        if (!o?.steps) return;
        const k = stepOf(o);
        if (k === shownStep) return;
        shownStep = k;
        focus(o.steps[k].focus, o.focus);
        info.text = `${k + 1}/${o.steps.length} · ${o.steps[k].text}`;
        const done = o.steps.slice(0, k + 1);
        model.showLinks(done.flatMap((s) => s.links ?? []));
        model.setActivity(Object.assign({}, o.activity, ...done.map((s) => s.activity ?? {})));
      },
    };
  };
}
