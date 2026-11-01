const languageButton = document.querySelector('.language-toggle');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const accessibleEnglish = {
  aria: {
    'Mandarinita, inicio': 'Mandarinita, home',
    'Navegación principal': 'Main navigation',
    'Ver selección de láminas del episodio La mosca': 'View selected pages from The Fly comic',
    'Abrir historieta de la cocina de 2019': 'Open the 2019 kitchen comic',
    'Ver dos ilustraciones originales de 2022': 'View two original illustrations from 2022',
    'Episodio 1: La mosca, 4 láminas, leer en Notion': 'Episode 1: The Fly, 4 pages, read on Notion',
    'Episodio 2: Ansiosa, 4 láminas, leer en Notion': 'Episode 2: Anxious, 4 pages, read on Notion',
    'Episodio 44: El teletrabajo, 5 láminas, leer en Notion': 'Episode 44: Remote Work, 5 pages, read on Notion',
    'Episodio 51: ¿Tienes hambre?, 6 láminas, leer en Notion': 'Episode 51: Are You Hungry?, 6 pages, read on Notion',
    'Episodio 52: Fruitflix, 5 láminas, leer en Notion': 'Episode 52: Fruitflix, 5 pages, read on Notion',
    'Ver obra: Grrrrr': 'View artwork: Grrrrr!',
    'Ver obra: ¿Quién dice?': 'View artwork: Who says?',
    'Ver obra: ¿Tienes hambre?': 'View artwork: Are you hungry?',
    'Ver obra: El sobre que se va': 'View artwork: The running envelope',
    'Ver obra: El clip misterioso': 'View artwork: The mysterious paperclip',
    'Abrir Mandarinita animada en Sticker.ly': 'Open the Mandarinita animated sticker pack on Sticker.ly',
    'Abrir Mandarinita 3D en Sticker.ly': 'Open the Mandarinita 3D sticker pack on Sticker.ly',
    'Abrir Mandarinita y amigos en Sticker.ly': 'Open the Mandarinita and friends sticker pack on Sticker.ly',
    'Abrir Mandarinita en Sticker.ly': 'Open the Mandarinita sticker pack on Sticker.ly',
    'Abrir Marca Mandarinita en Sticker.ly': 'Open the Mandarinita brand sticker pack on Sticker.ly',
    'Abrir Mandarimoji -emoji Mandarinita en Sticker.ly': 'Open the Mandarimoji emoji sticker pack on Sticker.ly',
    'Abrir Mandarinita retro en Sticker.ly': 'Open the Mandarinita retro sticker pack on Sticker.ly',
    'Cerrar lector': 'Close reader',
    'Viñeta anterior': 'Previous panel',
    'Viñeta siguiente': 'Next panel'
  },
  alt: {
    'Mandy y Mando Mandarinita sentados en su mueble azul, con Morita en el centro haciendo ojos locos y sacando la lengua.': 'Mandy and Mando Mandarinita sit on their blue couch with Morita between them, making a silly face and sticking out her tongue.',
    'Ilustración original de 2019: dos mandarinas reaccionan con enojo y alegría; texto ¡Grrrrr!': 'Original 2019 illustration: two mandarins react with anger and joy; the image reads “Grrrrr!”',
    'Historieta original de 2019: Mandarinita y Sr. Mandarino conversan en un sofá sobre ir a la cocina': 'Original 2019 comic: Mandarinita and Mr. Mandarin talk on a couch about going to the kitchen.',
    'Ilustración de 2022: Mandarinita saluda a un sobre que corre bajo un cielo azul': '2022 illustration: Mandarinita waves to a running envelope beneath a blue sky.',
    'Hoja original con distintas expresiones y poses dibujadas a mano de los personajes de Mandarinita': 'Original hand-drawn sheet showing Mandarinita characters in different expressions and poses.',
    'Mandy Mandarinita en una escena de Salón de la Es-pera': 'Mandy Mandarinita in a scene from The Waiting Room Salon.',
    'Mando Mandarinita en una escena de Salón de la Es-pera': 'Mando Mandarinita in a scene from The Waiting Room Salon.',
    'Greg el Zanahorio en una escena de Mandarinita': 'Greg the Carrot in a Mandarinita scene.',
    'Limón Agrio en una escena de Mandarinita': 'Sour Lemon in a Mandarinita scene.',
    'Sra. Pera en una escena de Salón de la Es-pera': 'Mrs. Pear in a scene from The Waiting Room Salon.'
  }
};
function syncAccessibleLanguage() {
  for (const [attribute, translations] of Object.entries(accessibleEnglish)) {
    const selector = attribute === 'aria' ? '[aria-label]:not(.language-toggle):not(.menu-button)' : 'img[alt]';
    const name = attribute === 'aria' ? 'data-es-aria-label' : 'data-es-alt';
    document.querySelectorAll(selector).forEach(node => {
      if (!node.hasAttribute(name)) node.setAttribute(name, node.getAttribute(attribute === 'aria' ? 'aria-label' : 'alt') || '');
      const spanish = node.getAttribute(name);
      const english = translations[spanish];
      if (!english) return;
      node.setAttribute(attribute === 'aria' ? 'aria-label' : 'alt', language === 'en' ? english : spanish);
    });
  }
}
// Spanish is the canonical language of the public site.
// The language selector updates the page and its URL.
let language = 'es';
// Honor an explicit URL language, then keep the visitor's last choice across pages.
try {
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  const savedLanguage = localStorage.getItem('mandarinita-language');
  if (requestedLanguage === 'en' || requestedLanguage === 'es') language = requestedLanguage;
  else if (savedLanguage === 'en' || savedLanguage === 'es') language = savedLanguage;
} catch (_) { /* A malformed URL or unavailable storage should not break the site. */ }

function setLanguage(next, updateUrl = false) {
  language = next;
  if (updateUrl) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch (_) { /* Language switching must work even if URL updates are restricted. */ }
  }
  document.documentElement.lang = next;
  document.documentElement.dataset.lang = next;
  languageButton.textContent = next === 'es' ? 'EN' : 'ES';
  languageButton.setAttribute('aria-label', next === 'es' ? 'Switch language to English' : 'Cambiar idioma a español');
  document.title = next === 'es' ? 'Mandarinita® — Historietas y arte' : 'Mandarinita® — Comics and art';
  const description = document.querySelector('meta[name=description]');
  if (description) description.content = next === 'es' ? 'Mandarinita: humor ilustrado desde República Dominicana. Historietas originales y portafolio artístico.' : 'Mandarinita: illustrated humor from the Dominican Republic. Original comics and an art portfolio.';
  if (menuButton) menuButton.setAttribute('aria-label', next === 'es' ? 'Abrir navegación' : 'Open navigation');
  document.querySelectorAll('[data-es][data-en]').forEach(node => {
    node.textContent = node.dataset[next];
  });
  syncAccessibleLanguage();
  try { localStorage.setItem('mandarinita-language', next); } catch (_) { /* Continue without persistence. */ }
}
function syncInternalLanguageLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.getAttribute('href')?.startsWith('#')) return;
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!['/', '/index.html', '/personajes', '/personajes.html'].includes(url.pathname)) return;
      url.searchParams.set('lang', language);
      link.href = url.pathname + url.search + url.hash;
    } catch (_) { /* Leave invalid or nonstandard links untouched. */ }
  });
}
setLanguage(language);
syncInternalLanguageLinks();
languageButton.addEventListener('click', () => {
  setLanguage(language === 'es' ? 'en' : 'es', true);
  syncInternalLanguageLinks();
  if (activeWork && dialog.open) renderPanel();
});
menuButton?.addEventListener('click', () => {
  const opened = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opened));
  navigation.classList.toggle('open', opened);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}));

const works = {
  episode1: { title: 'La mosca · archivo original', titleEn: 'The Fly · original archive', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-focus-2019.webp',alt:'Lámina B original de La mosca (2019).',altEn:'Original page B from The Fly (2019).'},{src:'assets/comic-rage-2019.webp',alt:'Lámina D original de La mosca (2019).',altEn:'Original page D from The Fly (2019).'}] },
  episode2: { title: 'Ilustraciones del archivo · 2022', titleEn: 'Archive illustrations · 2022', kind: 'DOS ILUSTRACIONES · 2022', kindEn: 'TWO ILLUSTRATIONS · 2022', images: [{src:'assets/art-envelope-2022.webp',alt:'Ilustración original de 2022: el sobre.',altEn:'Original 2022 illustration: the envelope.'},{src:'assets/art-paperclip-2022.webp',alt:'Ilustración original de 2022: el clip.',altEn:'Original 2022 illustration: the paperclip.'}] },
  rage: { title: '¡Grrrrr!', titleEn: 'Grrrr!', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-rage-2019.webp', alt:'Ilustración original de 2019: dos mandarinas reaccionan con enojo y alegría; texto ¡Grrrrr!', altEn:'Original 2019 illustration: two mandarins react with anger and joy; the image reads Grrrr!'}] },
  focus: { title: '¿Quién dice?', titleEn: 'Who says?', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-focus-2019.webp', alt:'Historieta original de 2019 sobre estar enfocado.', altEn:'Original 2019 comic about staying focused.'}] },
  coffee: { title: '¿Tienes hambre?', titleEn: 'Are you hungry?', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-coffee-2019.webp', alt:'Mandarinita y Sr. Mandarino conversan en el sofá; los globos dicen “Oye, voy a la cocina ¿tienes hambre?”, “No”, “¿Seguro?” y “Seguro”.', altEn:'Mandarinita and Mr. Mandarin talk on a couch; speech bubbles ask if he is hungry and whether he is sure.'}] },
  envelope: { title: 'El sobre que se va', titleEn: 'The running envelope', kind: 'ILUSTRACIÓN · 2022', kindEn: 'ILLUSTRATION · 2022', images: [{src:'assets/art-envelope-2022.webp', alt:'Mandarinita saluda a un sobre que corre bajo un cielo azul.', altEn:'Mandarinita waves to a running envelope under a blue sky.'}] },
  paperclip: { title: 'El clip misterioso', titleEn: 'The mysterious paperclip', kind: 'ILUSTRACIÓN · 2022', kindEn: 'ILLUSTRATION · 2022', images: [{src:'assets/art-paperclip-2022.webp', alt:'Mandarinita se sorprende al ver un clip grande.', altEn:'Mandarinita is surprised by a large paperclip.'}] },
  storyboard: { title: 'Boceto de historieta · proceso', titleEn: 'Comic storyboard · process material', kind: 'BOCETO ORIGINAL · 2019', kindEn: 'ORIGINAL STORYBOARD · 2019', images: [1,2,3,4].map(n=>({src:`assets/storyboard-panel-${n}.webp`,alt:`Viñeta ${n} del boceto original de 2019.`,altEn:`Panel ${n} of the original 2019 storyboard.`})) }
};

// Add catalog entries to the public reader only when they are ready to display.
// The curated artwork remains available if the optional catalog cannot load.
async function loadApprovedEpisodes() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;
  try {
    const response = await fetch('content/episodes.json', { cache: 'no-cache' });
    if (!response.ok) return;
    const catalog = await response.json();
    if (catalog.schemaVersion !== 1 || catalog.editorialPolicy !== 'manual-approval' || !Array.isArray(catalog.episodes)) return;
    for (const entry of catalog.episodes) {
      if (entry.status !== 'published' || entry.type !== 'comic' || entry.complete !== true || !Array.isArray(entry.panels) || !entry.panels.length) continue;
      const ordered = [...entry.panels].sort((a,b)=>a.order-b.order);
      if (!ordered.every((panel,i) => panel.order === i+1 && /^assets\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/i.test(panel.src) && panel.alt?.es && panel.alt?.en)) continue;
      const key = 'catalog:' + entry.id;
      if (works[key]) continue;
      works[key] = {
        title:entry.title.es,
        titleEn:entry.title.en || entry.title.es,
        kind:'HISTORIETA · ARCHIVO',
        kindEn:'COMIC · ARCHIVE',
        images:ordered.map(p=>({src:p.src,alt:p.alt.es,altEn:p.alt.en}))
      };
      const article=document.createElement('article');article.className='work-card catalog-card';
      const button=document.createElement('button');button.className='work-image';button.type='button';
      const cover=document.createElement('img');cover.src=ordered[0].src;cover.alt=ordered[0].alt[language];cover.loading='lazy';
      button.append(cover);button.addEventListener('click',()=>openReader(key));
      const copy=document.createElement('div');copy.className='work-copy';
      const heading=document.createElement('h3');heading.textContent=entry.title[language]||entry.title.es;
      const action=document.createElement('button');action.type='button';action.className='text-button';action.textContent=language==='es'?'Leer episodio':'Read episode';
      action.addEventListener('click',()=>openReader(key));
      copy.append(heading,action);article.append(button,copy);grid.append(article);
      document.querySelector('.language-toggle')?.addEventListener('click',()=>{
        heading.textContent=entry.title[language]||entry.title.es;
        action.textContent=language==='es'?'Leer episodio':'Read episode';
        cover.alt=ordered[0].alt[language]||ordered[0].alt.es;
      });
    }
  } catch (_) { /* The curated static archive remains available. */ }
}
loadApprovedEpisodes();

const dialog = document.querySelector('#reader');
const image = document.querySelector('#reader-image');
const title = document.querySelector('#reader-title');
const kind = document.querySelector('#reader-kind');
const caption = document.querySelector('#reader-caption');
const count = document.querySelector('#reader-count');
const notice = document.querySelector('#reader-notice');
let activeWork;
let panelIndex = 0;
function renderPanel() {
  const work = works[activeWork];
  const panel = work.images[panelIndex];
  image.src = panel.src;
  image.alt = language === 'es' ? panel.alt : panel.altEn;
  title.textContent = language === 'es' ? work.title : work.titleEn;
  kind.textContent = language === 'es' ? work.kind : work.kindEn;
  caption.textContent = language === 'es' ? `Lámina ${panelIndex+1} de ${work.images.length}` : `Page ${panelIndex+1} of ${work.images.length}`;
  count.textContent = `${panelIndex+1} / ${work.images.length}`;
  notice.textContent = activeWork === 'storyboard' ? (language === 'es' ? 'Boceto original que muestra una etapa del proceso creativo.' : 'An original storyboard showing one stage of the creative process.') : activeWork === 'episode1' ? (language === 'es' ? 'Selección de láminas originales de 2019.' : 'A selection of original pages from 2019.') : activeWork === 'episode2' ? (language === 'es' ? 'Dos ilustraciones originales del archivo creativo de 2022.' : 'Two original illustrations from the 2022 creative archive.') : '';
  const multiple = work.images.length > 1;
  document.querySelectorAll('.reader-prev,.reader-next,.reader-text-prev,.reader-text-next').forEach(button=>button.hidden=!multiple);
}
function openReader(key) {
  activeWork = key;
  panelIndex = 0;
  renderPanel();
  dialog.showModal();
  document.querySelector('.reader-close')?.focus();
}
document.querySelectorAll('[data-reader]').forEach(button=>button.addEventListener('click',()=>openReader(button.dataset.reader)));
function movePanel(direction) {
  const length = works[activeWork].images.length;
  panelIndex = (panelIndex + direction + length) % length;
  renderPanel();
}
if (dialog) {
  document.querySelector('.reader-prev')?.addEventListener('click',()=>movePanel(-1));
  document.querySelector('.reader-text-prev')?.addEventListener('click',()=>movePanel(-1));
  document.querySelector('.reader-next')?.addEventListener('click',()=>movePanel(1));
  document.querySelector('.reader-text-next')?.addEventListener('click',()=>movePanel(1));
  document.querySelector('.reader-close')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('keydown',event=>{
    if (event.key==='ArrowLeft' && works[activeWork]?.images.length > 1) movePanel(-1);
    if (event.key==='ArrowRight' && works[activeWork]?.images.length > 1) movePanel(1);
  });
}
