// Barra dei comandi in fondo allo schermo: una lastra di «vetro liquido» sopra
// la scena. È l'unico pezzo di DOM del libro, perché la sfocatura e la
// rifrazione di ciò che sta dietro le fa il browser (backdrop-filter).
const FONTS = `${import.meta.env.BASE_URL}fonts/`;

const CSS = `
@font-face { font-family: 'Libro'; src: url(${FONTS}EBGaramond-SemiBold.ttf); font-weight: 500; }
@font-face { font-family: 'Libro'; src: url(${FONTS}EBGaramond-Bold.ttf); font-weight: 700; }
@font-face { font-family: 'Libro'; src: url(${FONTS}EBGaramond-Italic.ttf); font-style: italic; }
.vignette {
  position: fixed; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 42%, rgba(30,24,14,0) 48%, rgba(30,24,14,0.55) 100%);
  opacity: 0.3; transition: opacity 0.5s;
}
.glass {
  --ink: #2a2520;
  position: fixed; left: 50%; bottom: max(16px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: flex; align-items: center; gap: 2px; padding: 5px;
  max-width: calc(100vw - 20px); box-sizing: border-box;
  border-radius: 26px; isolation: isolate;
  font: 500 15px/1.2 'Libro', Georgia, serif; color: var(--ink);
  user-select: none; -webkit-user-select: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.46), rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3));
  -webkit-backdrop-filter: blur(14px) saturate(1.7) brightness(1.05);
  backdrop-filter: blur(14px) saturate(1.7) brightness(1.05);
  box-shadow:
    inset 0 1.5px 0.5px rgba(255,255,255,0.95),
    inset 0 -1.5px 1px rgba(255,255,255,0.45),
    inset 1px 0 0.5px rgba(255,255,255,0.5), inset -1px 0 0.5px rgba(255,255,255,0.5),
    inset 0 -10px 16px -10px rgba(255,255,255,0.65),
    inset 0 0 0 0.5px rgba(60,50,30,0.18),
    0 14px 34px -10px rgba(40,30,10,0.42), 0 3px 8px rgba(40,30,10,0.16);
}
/* dove il browser lo consente, i bordi della lastra deformano ciò che sta dietro */
.glass.refract { backdrop-filter: url(#vetro) blur(7px) saturate(1.7) brightness(1.05); }
/* riflesso che attraversa la lastra */
.glass::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; z-index: -1; pointer-events: none;
  background:
    radial-gradient(120% 90% at 12% -30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%),
    radial-gradient(90% 80% at 92% 130%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%);
}
.glass button {
  all: unset; box-sizing: border-box; cursor: pointer; flex: none;
  width: 40px; height: 40px; border-radius: 21px;
  display: grid; place-items: center; color: var(--ink);
  transition: background 0.18s, transform 0.18s, opacity 0.18s;
}
.glass button:hover { background: rgba(255,255,255,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(40,30,10,0.12); }
.glass button:active { transform: scale(0.92); }
.glass button:focus-visible { outline: 2px solid #9c3d1f; outline-offset: -2px; }
.glass button[disabled] { opacity: 0.28; pointer-events: none; }
.glass button.on { background: rgba(42,37,32,0.86); color: #fffaf0; }
.glass [hidden] { display: none !important; }
.glass svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.glass .where {
  all: unset; box-sizing: border-box; cursor: pointer; height: 40px; border-radius: 21px;
  display: flex; align-items: baseline; gap: 9px; padding: 10px 12px 0;
  width: min(360px, calc(100vw - 250px)); min-width: 0; flex: 0 1 auto;
}
.glass .num { color: #9c3d1f; font-weight: 700; font-size: 13px; }
.glass .title { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.glass .sub { color: #6d6459; font-size: 12.5px; font-style: italic; white-space: nowrap; }
.glass .sep { width: 1px; height: 22px; margin: 0 5px; background: rgba(42,37,32,0.2); box-shadow: 1px 0 0 rgba(255,255,255,0.5); }
@media (max-width: 560px) { .glass .sub { display: none; } .glass .where { width: auto; flex: 1; } }
`;

const ICONS = {
  toc: '<path d="M5 7h14M5 12h14M5 17h9"/>',
  prev: '<path d="M14.5 6l-6 6 6 6"/>',
  next: '<path d="M9.5 6l6 6-6 6"/>',
  zoomIn: '<circle cx="10.5" cy="10.5" r="5.8"/><path d="M15 15l4.6 4.6M10.5 8v5M8 10.5h5"/>',
  zoomOut: '<circle cx="10.5" cy="10.5" r="5.8"/><path d="M15 15l4.6 4.6M8 10.5h5"/>',
  book: '<path d="M6.5 4.5H17a1 1 0 0 1 1 1V19.5H8A1.5 1.5 0 0 1 6.5 18V4.5zM6.5 18A1.5 1.5 0 0 1 8 16.5h10M10 8.5h4.5"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

// Mappa di spostamento per la rifrazione: neutra al centro, verso il bordo
// sposta il campionamento all'interno, come lo spessore di una lente.
function refractionMap(w, h, r, band) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - w / 2, py = y + 0.5 - h / 2;
      const qx = Math.abs(px) - w / 2 + r, qy = Math.abs(py) - h / 2 + r;
      const out = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const d = -(Math.min(Math.max(qx, qy), 0) + out - r); // distanza dal bordo, verso l'interno
      let nx = 0, ny = 0;
      if (qx > 0 && qy > 0) (nx = (qx / out) * Math.sign(px)), (ny = (qy / out) * Math.sign(py));
      else if (qx > qy) nx = Math.sign(px);
      else ny = Math.sign(py);
      const m = d < band ? Math.pow(1 - Math.max(d, 0) / band, 2) : 0;
      const i = (y * w + x) * 4;
      img.data[i] = 128 - nx * m * 127;
      img.data[i + 1] = 128 - ny * m * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}

export function createBar(on) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const vignette = document.createElement('div');
  vignette.className = 'vignette';
  const bar = document.createElement('nav');
  bar.className = 'glass';
  bar.setAttribute('aria-label', 'Comandi del libro');
  bar.innerHTML = `
    <button data-do="toc" title="Indice" aria-label="Indice">${icon('toc')}</button>
    <button data-do="prev" title="Pagina precedente (←)" aria-label="Pagina precedente">${icon('prev')}</button>
    <button class="where" data-do="where"><span class="num"></span><span class="title"></span><span class="sub"></span></button>
    <button data-do="next" title="Pagina successiva (→)" aria-label="Pagina successiva">${icon('next')}</button>
    <span class="sep"></span>
    <button data-do="focus" aria-label="Primo piano del modello"></button>
    <button data-do="book" aria-label="Chiudi il libro"></button>`;
  document.body.append(vignette, bar);
  const $ = (name) => bar.querySelector(`[data-do="${name}"]`);
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('[data-do]');
    if (b) on[b.dataset.do]?.();
  });

  // rifrazione ai bordi (Chromium): un filtro SVG usato come backdrop-filter
  if (CSS_supports('backdrop-filter', 'url(#vetro)')) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'position:absolute;width:0;height:0');
    svg.innerHTML = `<filter id="vetro" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feImage x="0" y="0" result="map" preserveAspectRatio="none"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="34" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
    document.body.appendChild(svg);
    const image = svg.querySelector('feImage');
    let size = '';
    new ResizeObserver(() => {
      const w = Math.round(bar.offsetWidth), h = Math.round(bar.offsetHeight);
      if (!w || !h || size === `${w}x${h}`) return;
      size = `${w}x${h}`;
      image.setAttribute('width', w);
      image.setAttribute('height', h);
      image.setAttribute('href', refractionMap(w, h, 26, 15));
      bar.classList.add('refract');
    }).observe(bar);
  }

  return {
    // spazio occupato in fondo allo schermo, in pixel
    get reserved() {
      return bar.offsetHeight + 30;
    },
    set(s) {
      for (const name of ['toc', 'prev', 'focus']) $(name).hidden = s.closed;
      bar.querySelector('.sep').hidden = s.closed;
      $('toc').disabled = s.atToc;
      $('prev').disabled = !s.hasPrev;
      $('next').disabled = !s.closed && !s.hasNext;
      $('next').title = s.closed ? 'Apri il libro' : 'Pagina successiva (→)';
      bar.querySelector('.num').textContent = s.num ?? '';
      bar.querySelector('.title').textContent = s.title;
      bar.querySelector('.sub').textContent = s.sub ?? '';
      $('where').title = s.closed ? 'Apri il libro' : 'Vai all’indice';
      const f = $('focus');
      f.disabled = !s.hasModel;
      f.classList.toggle('on', !!s.focus);
      f.innerHTML = icon(s.focus ? 'zoomOut' : 'zoomIn');
      f.title = s.focus ? 'Torna alla pagina (Esc)' : 'Primo piano del modello (rotella o doppio clic sul modello)';
      const b = $('book');
      b.innerHTML = icon('book');
      b.title = s.closed ? 'Apri il libro' : 'Chiudi il libro';
      b.setAttribute('aria-label', b.title);
    },
    // 0 = lettura, 1 = primo piano: il bordo dello schermo si scurisce
    dim(k) {
      vignette.style.opacity = 0.3 + 0.6 * k;
    },
  };
}

function CSS_supports(prop, value) {
  try {
    return CSS.supports(prop, value);
  } catch {
    return false;
  }
}
