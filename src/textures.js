// Texture disegnate su canvas: piano di legno, sottomano, taglio delle pagine,
// piatto e dorso della copertina. Le scritte si ridisegnano quando il font è pronto.
import * as THREE from 'three';

const FONTS = `${import.meta.env.BASE_URL}fonts/`;
const faces = [
  new FontFace('Libro', `url(${FONTS}NotoSerif-Bold.ttf)`, { weight: '700' }),
  new FontFace('Libro', `url(${FONTS}NotoSerif-Italic.ttf)`, { style: 'italic' }),
  new FontFace('Libro', `url(${FONTS}NotoSerif-Medium.ttf)`, { weight: '500' }),
];
const fontsReady = Promise.all(faces.map((f) => f.load().then((l) => document.fonts.add(l)))).catch(() => {});

function texture(w, h, draw, { live = false } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (live)
    fontsReady.then(() => {
      g.clearRect(0, 0, w, h);
      draw(g, w, h);
      t.needsUpdate = true;
    });
  return t;
}

const rnd = (a, b) => a + Math.random() * (b - a);

function grain(g, w, h, n, alpha) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},${Math.random() * alpha})`;
    g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

// Doghe di legno chiaro, sbiancato, con venature sottili lungo la doga.
export function deskTexture() {
  const t = texture(1024, 1024, (g, w, h) => {
    const planks = 6, ph = h / planks;
    for (let p = 0; p < planks; p++) {
      const l = rnd(-5, 5);
      g.fillStyle = `rgb(${203 + l},${196 + l},${183 + l})`;
      g.fillRect(0, p * ph, w, ph);
      for (let i = 0; i < 900; i++) {
        const y = p * ph + Math.random() * ph;
        const x = Math.random() * w;
        const len = rnd(80, 600);
        const bend = [rnd(-2, 2), rnd(-2, 2), rnd(-1.5, 1.5)];
        g.strokeStyle = Math.random() < 0.55 ? `rgba(120,104,84,${rnd(0.02, 0.08)})` : `rgba(255,252,244,${rnd(0.03, 0.1)})`;
        g.lineWidth = rnd(0.5, 1.4);
        // la venatura che esce a destra rientra a sinistra: la texture si ripete senza stacchi
        for (const x0 of [x, x - w]) {
          g.beginPath();
          g.moveTo(x0, y);
          g.bezierCurveTo(x0 + len / 3, y + bend[0], x0 + (len * 2) / 3, y + bend[1], x0 + len, y + bend[2]);
          g.stroke();
        }
      }
      // fuga tra le doghe e una giunta di testa
      g.fillStyle = 'rgba(96,82,64,0.5)';
      g.fillRect(0, p * ph, w, 1.5);
      g.fillStyle = 'rgba(255,255,255,0.3)';
      g.fillRect(0, p * ph + 1.5, w, 1);
      g.fillStyle = 'rgba(96,82,64,0.4)';
      g.fillRect(((p * 0.37 + 0.2) % 1) * w, p * ph, 1.5, ph);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(24, 24);
  return t;
}

// Sottomano verde salvia, appena feltrato. Le uv della forma sono in unità di scena.
export function matTexture() {
  const t = texture(512, 512, (g, w, h) => {
    g.fillStyle = '#93aaa2';
    g.fillRect(0, 0, w, h);
    grain(g, w, h, 26000, 0.05);
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1.6, 1.6);
  return t;
}

// Taglio del blocco: tante pagine una sull'altra.
export function edgeTexture() {
  const t = texture(64, 64, (g, w, h) => {
    g.fillStyle = '#ece3cf';
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      g.fillStyle = `rgba(110,92,62,${rnd(0.1, 0.34)})`;
      g.fillRect(0, y, w, 1);
    }
  });
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(6, 1);
  return t;
}

function leather(g, w, h) {
  g.fillStyle = '#d6a62a';
  g.fillRect(0, 0, w, h);
  grain(g, w, h, (w * h) / 22, 0.045);
  const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  v.addColorStop(0, 'rgba(120,70,0,0)');
  v.addColorStop(1, 'rgba(120,70,0,0.16)');
  g.fillStyle = v;
  g.fillRect(0, 0, w, h);
}

// Scritta o filetto impressi: un'ombra sopra, una luce sotto.
function debossed(g, draw, ink = '#8a4a26') {
  g.save();
  g.translate(0, 2.5);
  g.fillStyle = g.strokeStyle = 'rgba(255,236,170,0.55)';
  draw();
  g.translate(0, -4);
  g.fillStyle = g.strokeStyle = 'rgba(90,50,0,0.35)';
  draw();
  g.restore();
  g.fillStyle = g.strokeStyle = ink;
  draw();
}

function frame(g, x, y, w, h, lw, corner = 0) {
  debossed(
    g,
    () => {
      g.lineWidth = lw;
      g.strokeRect(x, y, w, h);
      if (corner)
        for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
          g.beginPath();
          g.arc(cx + (cx === x ? corner : -corner), cy + (cy === y ? corner : -corner), 4, 0, 7);
          g.fill();
        }
    },
    'rgba(150,96,14,0.75)'
  );
}

function spaced(g, text, x, y, gap) {
  const widths = [...text].map((ch) => g.measureText(ch).width + gap);
  let cx = x - (widths.reduce((a, b) => a + b, 0) - gap) / 2;
  g.textAlign = 'left';
  for (const [i, ch] of [...text].entries()) {
    g.fillText(ch, cx, y);
    cx += widths[i];
  }
  g.textAlign = 'center';
}

// Encefalo di profilo (fronte a sinistra), a tratto, in un quadrato di lato 2.
function brain(g) {
  const smooth = (pts, close) => {
    const n = pts.length;
    const at = (i) => pts[close ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    g.moveTo(...pts[0]);
    for (let i = 0; i < (close ? n : n - 1); i++) {
      const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
      g.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]
      );
    }
  };
  const INK = '#3b3027';
  g.lineJoin = g.lineCap = 'round';

  // ombra a tratteggio sotto la figura
  g.strokeStyle = 'rgba(59,48,39,0.28)';
  g.lineWidth = 0.008;
  for (let i = 0; i < 26; i++) {
    const x = -0.62 + i * 0.05;
    g.beginPath();
    g.moveTo(x, 0.93 + 0.03 * Math.sin(i));
    g.lineTo(x + 0.09, 0.84);
    g.stroke();
  }

  // tronco encefalico
  const stem = [[0.08, 0.3], [0.16, 0.55], [0.24, 0.8], [0.3, 0.97], [0.44, 0.93], [0.4, 0.72], [0.36, 0.5], [0.34, 0.3]];
  g.beginPath();
  smooth(stem, true);
  g.fillStyle = '#e9d9b8';
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 0.016;
  g.stroke();

  // cervelletto con le sue lamelle
  g.save();
  g.beginPath();
  g.ellipse(0.6, 0.5, 0.33, 0.22, -0.15, 0, 7);
  g.fillStyle = '#9db7c9';
  g.fill();
  g.stroke();
  g.clip();
  g.lineWidth = 0.009;
  for (let i = 0; i < 9; i++) {
    g.beginPath();
    g.ellipse(0.5, 0.2 + i * 0.07, 0.5, 0.16, -0.15, 0.2, 2.2);
    g.stroke();
  }
  g.restore();

  // emisfero
  const hemi = [
    [-0.93, 0.02], [-0.82, -0.36], [-0.45, -0.66], [0.05, -0.74], [0.5, -0.62], [0.84, -0.32], [0.94, 0.04],
    [0.8, 0.28], [0.48, 0.33], [0.22, 0.4], [-0.08, 0.56], [-0.4, 0.54], [-0.6, 0.36], [-0.84, 0.27],
  ];
  g.beginPath();
  smooth(hemi, true);
  const wash = g.createLinearGradient(-0.9, -0.7, 0.9, 0.5);
  wash.addColorStop(0, '#f1c7b0');
  wash.addColorStop(0.55, '#e0957e');
  wash.addColorStop(1, '#c96e5a');
  g.fillStyle = wash;
  g.fill();
  g.lineWidth = 0.02;
  g.stroke();

  // solchi
  g.save();
  g.beginPath();
  smooth(hemi, true);
  g.clip();
  g.lineWidth = 0.013;
  const sulci = [
    [[-0.62, 0.34], [-0.3, 0.2], [0.05, 0.1], [0.36, -0.02], [0.5, -0.12]], // laterale
    [[0.02, -0.76], [-0.04, -0.52], [0.04, -0.3], [-0.06, -0.08]], // centrale
    [[-0.22, -0.72], [-0.3, -0.48], [-0.2, -0.28], [-0.3, -0.06]],
    [[0.26, -0.7], [0.2, -0.46], [0.3, -0.28], [0.22, -0.14]],
    [[-0.8, -0.2], [-0.6, -0.3], [-0.44, -0.22], [-0.3, -0.32]],
    [[-0.84, 0.06], [-0.64, -0.04], [-0.5, 0.06], [-0.36, 0.0]],
    [[-0.66, -0.5], [-0.52, -0.44], [-0.42, -0.5]],
    [[0.42, -0.5], [0.56, -0.38], [0.5, -0.22], [0.62, -0.1]],
    [[0.66, -0.4], [0.78, -0.2], [0.72, -0.02], [0.84, 0.1]],
    [[0.44, 0.12], [0.6, 0.06], [0.74, 0.14]],
    [[-0.46, 0.42], [-0.2, 0.34], [0.06, 0.3], [0.3, 0.2]], // temporale superiore
    [[-0.3, 0.52], [-0.06, 0.46], [0.16, 0.38]],
  ];
  for (const s of sulci) {
    g.beginPath();
    smooth(s, false);
    g.stroke();
  }
  g.restore();
}

// Piatto anteriore: titolo impresso e una tavola incollata al centro.
export function coverTexture() {
  return texture(
    1024, 1400,
    (g, w, h) => {
      leather(g, w, h);
      frame(g, 46, 46, w - 92, h - 92, 5);
      frame(g, 66, 66, w - 132, h - 132, 2, 16);
      g.textAlign = 'center';
      g.textBaseline = 'alphabetic';
      debossed(g, () => {
        g.font = '500 27px Libro, Georgia, serif';
        spaced(g, 'SEMEION', w / 2, 196, 12);
        g.font = '700 108px Libro, Georgia, serif';
        g.fillText('Neuroanatomia', w / 2, 330);
        g.font = 'italic 44px Libro, Georgia, serif';
        g.fillText('un libro da esplorare in 3D', w / 2, 404);
        g.fillRect(w / 2 - 70, 446, 56, 2.5);
        g.fillRect(w / 2 + 14, 446, 56, 2.5);
        g.beginPath();
        g.moveTo(w / 2, 439);
        g.lineTo(w / 2 + 8, 447);
        g.lineTo(w / 2, 455);
        g.lineTo(w / 2 - 8, 447);
        g.fill();
      });

      // tavola
      const s = 590, x = (w - s) / 2, y = 540;
      frame(g, x - 26, y - 26, s + 52, s + 52, 3);
      g.fillStyle = 'rgba(90,50,0,0.35)';
      g.fillRect(x - 3, y - 3, s + 6, s + 6);
      g.fillStyle = '#f6efdf';
      g.fillRect(x, y, s, s);
      g.save();
      g.beginPath();
      g.rect(x, y, s, s);
      g.clip();
      grain(g, w, h, 30000, 0.03);
      g.translate(x + s / 2 - 6, y + s / 2 - 36);
      g.scale(s * 0.4, s * 0.4);
      brain(g);
      g.restore();

      debossed(g, () => {
        g.font = 'italic 34px Libro, Georgia, serif';
        g.fillText('midollo · tronco · encefalo · nervi cranici', w / 2, 1262);
      });
    },
    { live: true }
  );
}

// Dorso: il titolo si legge dalla testa al piede.
export function spineTexture() {
  return texture(
    1400, 96,
    (g, w, h) => {
      leather(g, w, h);
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      debossed(g, () => {
        g.fillRect(70, 18, 3, h - 36);
        g.fillRect(84, 18, 1.5, h - 36);
        g.fillRect(w - 73, 18, 3, h - 36);
        g.fillRect(w - 86, 18, 1.5, h - 36);
        g.font = '700 44px Libro, Georgia, serif';
        spaced(g, 'NEUROANATOMIA', w / 2, h / 2 + 3, 9);
      });
    },
    { live: true }
  );
}
