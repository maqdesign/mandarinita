import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = 'https://mandarinita.art/?lang=es';
const OUTPUT = resolve('captures/instagram-2026-11-02');
mkdirSync(OUTPUT, { recursive: true });

async function capture(browser, name, settings) {
  const context = await browser.newContext({
    viewport: settings.viewport,
    deviceScaleFactor: settings.deviceScaleFactor,
    isMobile: settings.isMobile,
    hasTouch: settings.isMobile,
    locale: 'es-DO',
    colorScheme: 'light',
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  try {
    const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    if (!response || !response.ok()) throw new Error(name + ': HTTP ' + (response?.status() ?? 'no response'));
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(1600);
    const actualURL = page.url();
    const title = await page.title();
    const visibleImages = await page.evaluate(() => [...document.images].filter((el) => {
      const b = el.getBoundingClientRect();
      return b.width > 40 && b.height > 40 && b.bottom > 0 && b.top < window.innerHeight;
    }).map(el => ({src: el.currentSrc, loaded: el.complete && el.naturalWidth > 0})));
    if (!actualURL.startsWith('https://mandarinita.art/')) throw new Error('Unexpected redirect: ' + actualURL);
    if (visibleImages.length && visibleImages.every(img => !img.loaded)) throw new Error('Visible images failed to load');
    await page.screenshot({ path: resolve(OUTPUT, name + '-viewport.png'), animations: 'disabled' });

    // Lazy-loaded sections are allowed to load before the full-page capture.
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(pageHeight, 16000); y += 800) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(90);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: resolve(OUTPUT, name + '-fullpage.png'), fullPage: true, animations: 'disabled', timeout: 45000 });
    await context.close();
    return { name, url: actualURL, title, httpStatus: response.status(), viewport: settings.viewport, visibleImages: visibleImages.length, visibleImagesLoaded: visibleImages.filter(x => x.loaded).length };
  } catch (error) {
    await page.screenshot({ path: resolve(OUTPUT, name + '-diagnostic.png') }).catch(() => {});
    await context.close();
    throw error;
  }
}

const browser = await chromium.launch({ headless: true });
try {
  const metadata = [];
  metadata.push(await capture(browser, 'desktop', {viewport: {width: 1440, height: 960}, deviceScaleFactor: 1, isMobile: false}));
  metadata.push(await capture(browser, 'mobile', {viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true}));
  writeFileSync(resolve(OUTPUT, 'capturas-info.json'), JSON.stringify({capturedAt: new Date().toISOString(), source: URL, captures: metadata}, null, 2));

  const desktop = readFileSync(resolve(OUTPUT, 'desktop-viewport.png')).toString('base64');
  const mobile = readFileSync(resolve(OUTPUT, 'mobile-viewport.png')).toString('base64');
  const posterHtml = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
* {box-sizing:border-box} html,body{padding:0;margin:0;width:1080px;height:1350px;overflow:hidden}
body{font-family:Arial,Helvetica,sans-serif;background:#fff8ec;color:#30221b}
.canvas{position:relative;width:1080px;height:1350px;overflow:hidden}
.blob{position:absolute;right:-180px;top:-205px;width:560px;height:560px;border-radius:50%;background:#ffe3bb}
.blob2{position:absolute;left:-220px;bottom:60px;width:450px;height:450px;border-radius:50%;background:#ffe9d3}
.stripe{position:absolute;top:0;left:0;width:100%;height:16px;background:#f87209}
.eyebrow{position:absolute;top:86px;left:72px;color:#ad4500;font-weight:800;letter-spacing:6px;font-size:23px}
h1{position:absolute;left:68px;top:133px;margin:0;font-size:109px;line-height:1.02;letter-spacing:-5px;font-weight:900;max-width:980px}
h1 em{color:#f87209;font-style:normal}
.sub{position:absolute;top:368px;left:76px;font-size:31px;line-height:1.35;font-weight:500;max-width:850px}
.desktop{position:absolute;left:72px;top:490px;width:881px;height:568px;background:white;border:7px solid #30221b;border-radius:23px;overflow:hidden;box-shadow:0 33px 0 #e9c99e, 0 43px 45px #6b3b223d;transform:rotate(-2deg)}
.desktop .toolbar{height:46px;background:#f1ede7;border-bottom:2px solid #ded5c9;display:flex;align-items:center;gap:8px;padding:0 18px}
.dot{width:12px;height:12px;border-radius:50%;background:#f4aa76}
.dot:nth-child(2){background:#f6ca77}.dot:nth-child(3){background:#a2c58a}
.address{background:white;color:#675b52;font-size:17px;margin-left:22px;padding:6px 40px;border-radius:9px}
.desktop img{display:block;width:100%;height:auto}
.mobile{position:absolute;left:679px;top:622px;width:297px;height:623px;background:#30221b;border:9px solid #30221b;border-radius:47px;overflow:hidden;box-shadow:12px 22px 0 #c9a37f, 0 30px 45px #6b3b2240;transform:rotate(5deg)}
.mobile:before{content:'';position:absolute;z-index:1;width:103px;height:24px;background:#30221b;border-radius:0 0 17px 17px;left:calc(50% - 51px);top:0}
.mobile img{display:block;width:100%;height:auto;border-radius:36px}
.footer{position:absolute;left:65px;bottom:66px;width:950px;height:114px;background:#f87209;color:#fff;border-radius:35px;padding:25px 35px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 10px 0 #d95a00}
.url{font-weight:900;font-size:48px;letter-spacing:-1px}.cta{font-size:22px;font-weight:700;background:#fff8ec;color:#853400;padding:18px 21px;border-radius:18px}
.sticker{position:absolute;top:1076px;left:92px;font-size:29px;color:#607d38;font-weight:800;transform:rotate(-5deg)}
</style></head><body>
<main class="canvas"><div class="stripe"></div><div class="blob"></div><div class="blob2"></div>
<div class="eyebrow">MANDARINITA PRESENTA</div><h1>¡Estrenamos<br><em>nueva web!</em></h1>
<div class="sub">Historietas, personajes y mucho más.<br>La vida tiene sus gajos.</div>
<div class="desktop"><div class="toolbar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span class="address">mandarinita.art</span></div><img src="data:image/png;base64,${desktop}"></div>
<div class="mobile"><img src="data:image/png;base64,${mobile}"></div>
<div class="sticker">¡Ya está en línea!</div>
<div class="footer"><span class="url">mandarinita.art</span><span class="cta">¡Visítanos!</span></div>
</main></body></html>`;

  const posterContext = await browser.newContext({viewport: {width:1080, height:1350}, deviceScaleFactor:1});
  const poster = await posterContext.newPage();
  await poster.setContent(posterHtml, {waitUntil:'load'});
  await poster.locator('.desktop img').evaluate(el=>el.decode());
  await poster.locator('.mobile img').evaluate(el=>el.decode());
  await poster.screenshot({path:resolve(OUTPUT,'instagram-post-1080x1350.png'),animations:'disabled'});
  await posterContext.close();
  console.log(JSON.stringify({source:URL, metadata, output:OUTPUT, instagram:'instagram-post-1080x1350.png'},null,2));
} finally {
  await browser.close();
}
