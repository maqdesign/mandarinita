const languageButton = document.querySelector('.language-toggle');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const accessibleEnglish = {
  aria: {
    'Mandarinita, inicio': 'Mandarinita, home',
    'Navegación principal': 'Main navigation',
    'Buscar episodios': 'Search episodes',
    'Ver selección de láminas del episodio La mosca': 'View selected pages from The Fly comic',
    'Abrir historieta de la cocina de 2019': 'Open the 2019 kitchen comic',
    'Abrir episodio 85: Lo que siempre te pasa, contado sin palabras por Mandarinita': 'Open episode 85: What always happens to you, told without words by Mandarinita',
    'Episodio 1: La mosca, 4 láminas, leer en Notion': 'Episode 1: The Fly, 4 pages, read on Notion',
    'Episodio 2: Ansiosa, 4 láminas, leer en Notion': 'Episode 2: Anxious, 4 pages, read on Notion',
    'Episodio 44: El teletrabajo, 5 láminas, leer en Notion': 'Episode 44: Remote Work, 5 pages, read on Notion',
    'Episodio 51: ¿Tienes hambre?, 6 láminas, leer en Notion': 'Episode 51: Are You Hungry?, 6 pages, read on Notion',
    'Episodio 52: Fruitflix, 5 láminas, leer en Notion': 'Episode 52: Fruitflix, 5 pages, read on Notion',
    'Ver obra: Grrrrr': 'View artwork: Grrrrr!',
    'Ver obra: ¿Quién dice?': 'View artwork: Who says?',
    'Ver obra: ¿Tienes hambre?': 'View artwork: Are you hungry?',
    'Ver episodio 85: Lo que siempre te pasa, contado sin palabras por Mandarinita': 'View episode 85: What always happens to you, told without words by Mandarinita',
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
    'Sra. Pera en una escena de Salón de la Es-pera': 'Mrs. Pear in a scene from The Waiting Room Salon.',
    'Morita, una mora traviesa y muy movida, con ojos grandes y la lengua afuera.': 'Morita, a mischievous, energetic blackberry with big eyes and her tongue out.'
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
  const page = document.body.dataset.page || (document.querySelector('#episode-grid') ? 'episodes' : document.querySelector('.sketch-grid') ? 'sketches' : document.querySelector('.character-page') ? 'characters' : 'home');
  const pageTitles = {
    home: ['Mandarinita® — Historietas y arte', 'Mandarinita® — Comics and art'],
    episodes: ['Todos los episodios — Mandarinita®', 'All episodes — Mandarinita®'],
    characters: ['Personajes originales — Mandarinita®', 'Original characters — Mandarinita®'],
    sketches: ['Bocetos — Mandarinita®', 'Sketches — Mandarinita®']
  };
  document.title = pageTitles[page][next === 'es' ? 0 : 1];
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
      if (!['/', '/index.html', '/personajes', '/personajes.html', '/episodios', '/episodios.html', '/bocetos', '/bocetos.html'].includes(url.pathname)) return;
      url.searchParams.set('lang', language);
      link.href = url.pathname + url.search + url.hash;
    } catch (_) { /* Leave invalid or nonstandard links untouched. */ }
  });
}
function formatCatalogDate(value) {
  const locale = language === 'en' ? 'en-US' : 'es-DO';
  return new Intl.DateTimeFormat(locale, { day:'numeric', month:'short', year:'numeric' }).format(new Date(`${value}T12:00:00`));
}
function catalogTitle(entry, lang = language) {
  const translated = entry.title?.[lang];
  if (lang === 'en' && /^episode\s+\d+$/i.test(translated || '')) return entry.title?.es || translated;
  return translated || entry.title?.es || '';
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
  episode1: { title: 'La mosca · episodio 1', titleEn: 'The Fly · episode 1', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/episodes/ep-001-la-mosca/01.1.png',alt:'Lámina A original de La mosca (2019).',altEn:'Original page A from The Fly (2019).'},{src:'assets/comic-focus-2019.webp',alt:'Lámina B original de La mosca (2019).',altEn:'Original page B from The Fly (2019).'},{src:'assets/episodes/ep-001-la-mosca/01.3.png',alt:'Lámina C original de La mosca (2019).',altEn:'Original page C from The Fly (2019).'},{src:'assets/comic-rage-2019.webp',alt:'Lámina D original de La mosca (2019).',altEn:'Original page D from The Fly (2019).'}] },
  episode85: { title: 'Ep. 85 · Lo que siempre te pasa, contado sin palabras por Mandarinita', titleEn: 'Episode 85 · What always happens to you, told without words by Mandarinita', kind: 'HISTORIETA · 2022', kindEn: 'COMIC · 2022', images: [1,2,3,4].map(n=>({src:`assets/episodes/ep-085-lo-que-siempre-te-pasa/85.${n}.png`,alt:`Lámina ${n} del episodio 85: Lo que siempre te pasa, contado sin palabras.`,altEn:`Page ${n} from episode 85: What always happens to you, told without words.`})) },
  episode44: { title:'El teletrabajo · episodio 44',titleEn:'Working from home · episode 44',kind:'HISTORIETA · 2021',kindEn:'COMIC · 2021',images:[1,2,3,4].map(n=>({src:`assets/episodes/ep-044-el-teletrabajo/44.${n}.png`,alt:`Viñeta ${n} del episodio 44: El teletrabajo.`,altEn:`Panel ${n} from episode 44: Working from home.`})) },
  episode93: { title:'El vaso de la licuadora · episodio 93',titleEn:'The blender jar · episode 93',kind:'HISTORIETA · 2025',kindEn:'COMIC · 2025',images:[1,2,3,4].map(n=>({src:`assets/episodes/ep-093-el-vaso-de-la-licuadora/93.${n}.png`,alt:`Viñeta ${n} del episodio 93: El vaso de la licuadora.`,altEn:`Panel ${n} from episode 93: The blender jar.`})) },
  rage: { title: '¡Grrrrr!', titleEn: 'Grrrr!', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-rage-2019.webp', alt:'Ilustración original de 2019: dos mandarinas reaccionan con enojo y alegría; texto ¡Grrrrr!', altEn:'Original 2019 illustration: two mandarins react with anger and joy; the image reads Grrrr!'}] },
  focus: { title: '¿Quién dice?', titleEn: 'Who says?', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-focus-2019.webp', alt:'Historieta original de 2019 sobre estar enfocado.', altEn:'Original 2019 comic about staying focused.'}] },
  coffee: { title: '¿Tienes hambre?', titleEn: 'Are you hungry?', kind: 'HISTORIETA · EPISODIO 51', kindEn: 'COMIC · EPISODE 51', images: [1,2,3,4].map(n=>({src:`assets/episodes/ep-051-tienes-hambre/51.${n}.png`,alt:`Lámina ${n} del episodio 51: ¿Tienes hambre?`,altEn:`Page ${n} from episode 51: Are you hungry?`})) },
  storyboard: { title: 'Boceto de historieta · proceso', titleEn: 'Comic storyboard · process material', kind: 'BOCETO ORIGINAL · 2019', kindEn: 'ORIGINAL STORYBOARD · 2019', images: [1,2,3,4].map(n=>({src:`assets/storyboard-panel-${n}.webp`,alt:`Viñeta ${n} del boceto original de 2019.`,altEn:`Panel ${n} of the original 2019 storyboard.`})) }
};
const catalogWorkKeys = new Map();
let approvedEpisodeKeys=[];

// Add catalog entries to the public reader only when they are ready to display.
// The curated artwork remains available if the optional catalog cannot load.
async function loadApprovedEpisodes() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;
  try {
    const response = await fetch('episodes.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json();
    if (catalog.schemaVersion !== 1 || catalog.editorialPolicy !== 'manual-approval' || !Array.isArray(catalog.episodes)) throw new Error('Invalid catalog');
    const approved = [];
    for (const entry of catalog.episodes) {
      if (entry.status !== 'published' || entry.type !== 'comic' || entry.complete !== true || !Array.isArray(entry.panels) || !entry.panels.length) continue;
      const ordered = [...entry.panels].sort((a,b)=>a.order-b.order);
      if (!ordered.every((panel,i) => panel.order === i+1 && /^assets\/[a-zA-Z0-9/_.-]+\.(png|jpg|jpeg|webp)$/i.test(panel.src) && !panel.src.includes('..') && panel.alt?.es && panel.alt?.en)) continue;
      const staticKeys = {
        'ep-001-la-mosca':'episode1',
        'ep-051-tienes-hambre':'coffee',
        'ep-085-lo-que-siempre-te-pasa':'episode85',
        'ep-044-el-teletrabajo':'episode44',
        'ep-093-el-vaso-de-la-licuadora':'episode93'
      };
      const key = staticKeys[entry.id] || 'catalog:' + entry.id;
      catalogWorkKeys.set(entry.id,key);
      works[key] = {
        title:entry.title.es,
        titleEn:catalogTitle(entry,'en'),
        episodeId:entry.id,
        publishedAt:entry.publishedAt || null,
        kind:'HISTORIETA · ARCHIVO',
        kindEn:'COMIC · ARCHIVE',
        images:ordered.map(p=>({src:p.src,alt:p.alt.es,altEn:p.alt.en}))
      };
      approved.push({entry,ordered,key});
      if (grid.id !== 'home-featured-grid') continue;
      const article=document.createElement('article');article.className='work-card catalog-card';
      const button=document.createElement('button');button.className='work-image';button.type='button';
      const cover=document.createElement('img');cover.src=ordered[0].src;cover.alt=ordered[0].alt[language];cover.loading='lazy';
      button.append(cover);button.addEventListener('click',()=>openReader(key));
      const copy=document.createElement('div');copy.className='work-copy';
      const meta=document.createElement('p');meta.className='work-meta';meta.textContent=language==='es'?`Episodio ${entry.episodeNumber}`:`Episode ${entry.episodeNumber}`;
      const share=document.createElement('button');share.type='button';share.className='episode-share';share.setAttribute('aria-label',language==='es'?'Compartir episodio':'Share episode');share.title=share.getAttribute('aria-label');share.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';share.addEventListener('click',event=>{event.stopPropagation();window.shareMandarinitaEpisode?.(entry.id);});meta.append(share);
      const heading=document.createElement('h3');heading.textContent=entry.title[language]||entry.title.es;
      const summary=document.createElement('p');summary.textContent=language==='es'?`${ordered.length} láminas en orden de lectura.`:`${ordered.length} pages in reading order.`;
      const action=document.createElement('button');action.type='button';action.className='text-button';action.textContent=language==='es'?'Leer episodio':'Read episode';
      action.addEventListener('click',()=>openReader(key));
      copy.append(meta,heading,summary,action);article.append(button,copy);grid.append(article);
      document.querySelector('.language-toggle')?.addEventListener('click',()=>{
        meta.textContent=language==='es'?`Episodio ${entry.episodeNumber}`:`Episode ${entry.episodeNumber}`;
        heading.textContent=entry.title[language]||entry.title.es;
        summary.textContent=language==='es'?`${ordered.length} láminas en orden de lectura.`:`${ordered.length} pages in reading order.`;
        action.textContent=language==='es'?'Leer episodio':'Read episode';
        cover.alt=ordered[0].alt[language]||ordered[0].alt.es;
      });
    }
    approvedEpisodeKeys=approved.map(({entry,key})=>({id:entry.id,key}));
    if (grid.id === 'home-featured-grid') {
      grid.replaceChildren();
      const pool = [...approved];
      for (let i=pool.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
      const chosen = pool.slice(0,3);
      for (const {entry,ordered,key} of chosen) {
        const article=document.createElement('article');article.className='work-card catalog-card';
        const button=document.createElement('button');button.className='work-image';button.type='button';button.setAttribute('aria-label',language==='es'?`Leer episodio ${entry.episodeNumber}: ${entry.title.es}`:`Read episode ${entry.episodeNumber}: ${catalogTitle(entry,'en')}`);
        const cover=document.createElement('img');cover.src=ordered[0].src;cover.alt=ordered[0].alt[language]||ordered[0].alt.es;cover.loading='lazy';button.append(cover);button.addEventListener('click',()=>openReader(key));
        const copy=document.createElement('div');copy.className='work-copy';
        const meta=document.createElement('p');meta.className='work-meta';meta.textContent=language==='es'?`Episodio ${entry.episodeNumber}`:`Episode ${entry.episodeNumber}`;
        const share=document.createElement('button');share.type='button';share.className='episode-share';share.setAttribute('aria-label',language==='es'?'Compartir episodio':'Share episode');share.title=share.getAttribute('aria-label');share.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';share.addEventListener('click',event=>{event.stopPropagation();window.shareMandarinitaEpisode?.(entry.id);});meta.append(share);
        const heading=document.createElement('h3');heading.textContent=catalogTitle(entry);
        const summary=document.createElement('p');summary.textContent=language==='es'?`${ordered.length} viñetas en orden de lectura.`:`${ordered.length} panels in reading order.`;
        if (entry.publishedAt) { const date=document.createElement('time');date.className='episode-date';date.dateTime=entry.publishedAt;date.textContent=formatCatalogDate(entry.publishedAt);copy.append(meta,heading,summary,date); } else copy.append(meta,heading,summary);
        const action=document.createElement('button');action.type='button';action.className='text-button';action.textContent=language==='es'?'Leer episodio':'Read episode';action.addEventListener('click',()=>openReader(key));
        copy.append(action);article.append(button,copy);grid.append(article);
        document.querySelector('.language-toggle')?.addEventListener('click',()=>{if(entry.publishedAt){const date=copy.querySelector('time');if(date)date.textContent=formatCatalogDate(entry.publishedAt);}share.setAttribute('aria-label',language==='en'?'Share episode':'Compartir episodio');share.title=share.getAttribute('aria-label');});
      }
    }
    const requestedEpisode = new URLSearchParams(window.location.search).get('episode');
    if (requestedEpisode) {
      const match = approved.find(({entry}) => entry.id === requestedEpisode);
      if (match) { openReader(match.key,Boolean(document.querySelector('#episode-grid'))); }
    }
  } catch (_) {
    if (grid.id === 'home-featured-grid') grid.innerHTML = '<p class="home-archive-loading">No pudimos cargar las historietas. Usa el botón para abrir el archivo completo.</p>';
  }
}
loadApprovedEpisodes();

const dialog = document.querySelector('#reader');
const image = document.querySelector('#reader-image');
const title = document.querySelector('#reader-title');
const kind = document.querySelector('#reader-kind');
const readerDate = document.querySelector('#reader-date');
const count = document.querySelector('#reader-count');
let activeWork;
let panelIndex = 0;
let readerArchiveMode = false;
function renderPanel() {
  const work = works[activeWork];
  const panel = work.images[panelIndex];
  const stage = document.querySelector('.reader-stage');
  stage?.classList.add('is-loading');
  image.src = panel.src;
  image.alt = language === 'es' ? panel.alt : panel.altEn;
  title.textContent = language === 'es' ? work.title : work.titleEn;
  kind.textContent = language === 'es' ? work.kind : work.kindEn;
  if(readerDate){readerDate.hidden=!work.publishedAt;readerDate.textContent=work.publishedAt?formatCatalogDate(work.publishedAt):'';if(work.publishedAt)readerDate.dateTime=work.publishedAt;}
  count.textContent = `${panelIndex+1} / ${work.images.length}`;
  const atEnd = panelIndex === work.images.length - 1;
  const multiple = work.images.length > 1;
  document.querySelectorAll('.reader-restart').forEach(button => { button.hidden = !atEnd || !multiple || readerArchiveMode; });
  const nextEpisodeButton=document.querySelector('.reader-next-episode');
  if(nextEpisodeButton){const label=nextEpisodeButton.querySelector('span');const es=atEnd?'Ir al siguiente episodio':'Siguiente episodio';const en=atEnd?'Read the next episode':'Next episode';nextEpisodeButton.hidden=!readerArchiveMode;if(label){label.dataset.es=es;label.dataset.en=en;label.textContent=language==='es'?es:en;}}
  const prevButton=document.querySelector('.reader-prev');if(prevButton){prevButton.disabled=!multiple||panelIndex===0;prevButton.setAttribute('aria-label',language==='en'?'Previous panel':'Viñeta anterior');}
  const nextButton=document.querySelector('.reader-next');if(nextButton){nextButton.disabled=!multiple||atEnd;nextButton.setAttribute('aria-label',language==='en'?'Next panel':'Viñeta siguiente');}
  const shareButton=document.querySelector('.reader-share');if(shareButton){shareButton.setAttribute('aria-label',language==='en'?'Share this episode':'Compartir este episodio');shareButton.title=shareButton.getAttribute('aria-label');}
  const randomButton=document.querySelector('.reader-random');if(randomButton){randomButton.hidden=!work.episodeId;randomButton.setAttribute('aria-label',language==='en'?'Open a random episode':'Abrir un episodio aleatorio');randomButton.title=randomButton.getAttribute('aria-label');}
}
function openReader(key, archiveMode = false) {
  activeWork = key;
  readerArchiveMode = archiveMode;
  panelIndex = 0;
  renderPanel();
  if(!dialog.open)dialog.showModal();
  document.querySelector('.reader-stage')?.focus({preventScroll:true});
}
window.openMandarinitaEpisode = episodeId => {
  const key=catalogWorkKeys.get(episodeId);
  if(!key)return false;
  openReader(key,true);
  return true;
};
window.randomMandarinitaEpisode = () => {
  if(!approvedEpisodeKeys.length)return false;
  const choices=approvedEpisodeKeys.filter(item=>item.id!==works[activeWork]?.episodeId);
  const list=choices.length?choices:approvedEpisodeKeys;
  const picked=list[Math.floor(Math.random()*list.length)];
  openReader(picked.key,true);
  return true;
};
window.advanceMandarinitaEpisode = () => {
  if(!approvedEpisodeKeys.length)return false;
  const index=approvedEpisodeKeys.findIndex(item=>item.id===works[activeWork]?.episodeId);
  const next=approvedEpisodeKeys[(index+1+approvedEpisodeKeys.length)%approvedEpisodeKeys.length];
  openReader(next.key,true);
  return true;
};
window.shareMandarinitaEpisode = async episodeId => {
  const key=catalogWorkKeys.get(episodeId),work=key&&works[key];
  if(!work)return false;
  const url=new URL('episodios.html',location.href);url.searchParams.set('episode',episodeId);
  const title=language==='en'?work.titleEn:work.title;
  const status=document.querySelector('#reader-share-status');
  try{
    if(navigator.share){await navigator.share({title,text:`${title} · Mandarinita`,url:url.href});if(status)status.textContent='';return true;}
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url.href);if(status)status.textContent=language==='en'?'Episode link copied.':'Enlace del episodio copiado.';return true;}
    if(status)status.textContent=language==='en'?'Sharing is not available in this browser.':'Este navegador no permite compartir desde aquí.';
    return false;
  }catch(error){if(error?.name==='AbortError')return false;if(status)status.textContent=language==='en'?'Could not share this episode.':'No se pudo compartir este episodio.';return false;}
};
document.querySelectorAll('[data-reader]').forEach(button=>button.addEventListener('click',()=>openReader(button.dataset.reader)));
function movePanel(direction) {
  const length = works[activeWork].images.length;
  const nextIndex = panelIndex + direction;
  if (nextIndex < 0 || nextIndex >= length) return;
  panelIndex = nextIndex;
  renderPanel();
}
if (dialog) {
  const stage=document.querySelector('.reader-stage');
  let swipe=null;
  const swipeThreshold=118;
  const resetSwipe=()=>{stage?.classList.remove('is-swiping','is-next-episode-pull','is-advancing-episode','is-swipe-edge');stage?.style.removeProperty('--swipe-distance');stage?.style.removeProperty('--swipe-progress');swipe=null;};
  stage?.addEventListener('pointerdown',event=>{
    if(!['touch','pen'].includes(event.pointerType)||event.target.closest('button'))return;
    swipe={id:event.pointerId,x:event.clientX,y:event.clientY,horizontal:false,dx:0};
  });
  stage?.addEventListener('pointermove',event=>{
    if(!swipe||event.pointerId!==swipe.id)return;
    const dx=event.clientX-swipe.x,dy=event.clientY-swipe.y;
    if(!swipe.horizontal&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){swipe.horizontal=true;stage.setPointerCapture(event.pointerId);}
    if(!swipe.horizontal){if(Math.abs(dy)>18)swipe=null;return;}
    event.preventDefault();swipe.dx=dx;
    const atEnd=panelIndex===works[activeWork].images.length-1;
    const pullNext=readerArchiveMode&&atEnd&&dx<0&&typeof window.advanceMandarinitaEpisode==='function';
    stage.classList.add('is-swiping');stage.style.setProperty('--swipe-distance',`${Math.max(-150,Math.min(150,dx*.72))}px`);
    stage.classList.toggle('is-next-episode-pull',pullNext);
    if(pullNext)stage.style.setProperty('--swipe-progress',String(Math.min(1,Math.abs(dx)/swipeThreshold)));
  });
  stage?.addEventListener('pointerup',event=>{
    if(!swipe||event.pointerId!==swipe.id)return;
    const {horizontal,dx}=swipe;
    if(horizontal){
      const atEnd=panelIndex===works[activeWork].images.length-1;
      const pullNext=readerArchiveMode&&atEnd&&dx<=-swipeThreshold&&typeof window.advanceMandarinitaEpisode==='function';
      if(pullNext){stage.classList.add('is-advancing-episode');setTimeout(()=>{resetSwipe();window.advanceMandarinitaEpisode?.();},170);}
      else{resetSwipe();if(Math.abs(dx)>=54){if(dx<0&&panelIndex<works[activeWork].images.length-1)movePanel(1);else if(dx>0&&panelIndex>0)movePanel(-1);else{stage.classList.add('is-swipe-edge');setTimeout(()=>stage.classList.remove('is-swipe-edge'),240);}}}
    }else resetSwipe();
  });
  stage?.addEventListener('pointercancel',resetSwipe);
  document.querySelector('.reader-prev')?.addEventListener('click',()=>movePanel(-1));
  document.querySelector('.reader-next')?.addEventListener('click',()=>movePanel(1));
  document.querySelectorAll('.reader-restart').forEach(button=>button.addEventListener('click',()=>{panelIndex=0;renderPanel();}));
  document.querySelector('.reader-next-episode')?.addEventListener('click',()=>window.advanceMandarinitaEpisode?.());
  document.querySelector('.reader-share')?.addEventListener('click',()=>window.shareMandarinitaEpisode?.(works[activeWork]?.episodeId));
  document.querySelector('.reader-random')?.addEventListener('click',()=>window.randomMandarinitaEpisode?.());
  image.addEventListener('load',()=>document.querySelector('.reader-stage')?.classList.remove('is-loading'));
  image.addEventListener('error',()=>document.querySelector('.reader-stage')?.classList.remove('is-loading'));
  document.querySelector('.reader-close')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('keydown',event=>{
    const interactive=event.target.closest?.('button,summary,a,input,select,textarea,[contenteditable="true"]');
    if(event.key==='ArrowLeft'&&works[activeWork]?.images.length>1){event.preventDefault();movePanel(-1);return;}
    if(event.key==='ArrowRight'&&works[activeWork]?.images.length>1){event.preventDefault();movePanel(1);return;}
    if(event.key===' '&&!interactive){event.preventDefault();if(panelIndex<works[activeWork].images.length-1)movePanel(1);return;}
    if(event.key==='Enter'&&!interactive){event.preventDefault();if(readerArchiveMode)window.advanceMandarinitaEpisode?.();else if(panelIndex<works[activeWork].images.length-1)movePanel(1);else{panelIndex=0;renderPanel();}}
  });
}
