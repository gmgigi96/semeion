// Fotografa una pagina del libro con Chrome headless (WebGL software), dopo
// aver eventualmente cliccato dei pulsanti. Serve a verificare un capitolo.
//
//   node tools/shot.mjs <url> <out.png> [click:"Etichetta"] [wait:3000] [hover:idParte] [eval:"js"] [size:800x600] ...
//
// Le azioni si eseguono nell'ordine dato. `click:` cerca un testo visibile
// nella scena (pulsanti, voci dell'indice); `hover:` porta il puntatore su una
// parte del modello; `eval:` esegue del codice nella pagina (es.
// eval:"__book.open()" per aprire il libro chiuso). Errori di pagina e azioni non riuscite finiscono su stdout.
// Il rendering software è lento (circa 1 fotogramma al secondo): pochi scatti.
import puppeteer from 'puppeteer-core';

const [url, out, ...actions] = process.argv.slice(2);
if (!url || !out) {
  console.error('uso: node tools/shot.mjs <url> <out.png> [click:"Etichetta"] [wait:ms] [hover:idParte]');
  process.exit(2);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
// qualunque cosa succeda il browser va chiuso: un Chrome orfano resta a consumare CPU
const bail = setTimeout(async () => { console.log('[timeout] scatto abbandonato'); await browser.close(); process.exit(1); }, 240000);
process.on('unhandledRejection', async (e) => { console.log('[errore]', e?.message); await browser.close(); process.exit(1); });
const page = await browser.newPage();
await page.setViewport({ width: 1300, height: 780, deviceScaleFactor: 1 });
page.on('console', (m) => m.type() === 'error' && console.log('[console.error]', m.text().slice(0, 400)));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(url, { waitUntil: 'load' });
await sleep(6000);

// posizione sullo schermo del primo oggetto visibile che soddisfa il predicato
const locate = (kind, value) =>
  page.evaluate(
    (kind, value) => {
      const { scene, camera } = window.__book;
      let found = null;
      scene.traverse((o) => {
        if (found) return;
        for (let p = o; p; p = p.parent) if (!p.visible) return;
        if (kind === 'text' ? o.text === value : o.userData.ui?.id === value) found = o;
      });
      if (!found) return null;
      const v = found.getWorldPosition(camera.position.clone()).project(camera);
      return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight];
    },
    kind,
    value
  );

for (const action of actions) {
  const [verb, ...rest] = action.split(':');
  const arg = rest.join(':');
  if (verb === 'wait') await sleep(+arg);
  else if (verb === 'eval') console.log('[eval]', JSON.stringify(await page.evaluate(arg)));
  else if (verb === 'size') {
    const [width, height] = arg.split('x').map(Number);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
  }
  else if (verb === 'click' || verb === 'hover') {
    const at = await locate(verb === 'click' ? 'text' : 'part', arg);
    if (!at) {
      console.log(`[non trovato] ${action}`);
      continue;
    }
    await page.mouse.move(at[0] + 2, at[1] + 2);
    await page.mouse.move(at[0], at[1]);
    if (verb === 'click') {
      await page.mouse.down();
      await page.mouse.up();
    }
    await sleep(2500);
  }
}
await page.screenshot({ path: out });
console.log(`salvato ${out}`);
await browser.close();
clearTimeout(bail);
