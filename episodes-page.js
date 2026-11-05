const grid = document.querySelector('#episode-grid');
const sortSelect = document.querySelector('#episode-sort');
const loadMoreButton = document.querySelector('#load-more-episodes');
const status = document.querySelector('#episode-status');
const PAGE_SIZE = 12;
let episodes = [];
let allEpisodes = [];
let shown = 0;
let currentEpisodeId = null;
let selectedCharacter = null;
const pageLanguage=()=>document.documentElement.dataset.lang==='en'?'en':'es';
function episodeTitle(entry,lang=pageLanguage()){
  const translated=entry.title?.[lang];
  if(lang==='en'&&/^episode\s+\d+$/i.test(translated||''))return entry.title?.es||translated;
  return translated||entry.title?.es||'';
}
function syncArchiveLanguage(){
  const lang=pageLanguage();
  const allTitle=document.querySelector('.archive-title-all'),characterTitle=document.querySelector('.archive-title-character');
  const allIntro=document.querySelector('.archive-intro-all'),characterIntro=document.querySelector('.archive-intro-character');
  const characterFilter=document.querySelector('#character-archive-filter');
  if(selectedCharacter){
    const name=selectedCharacter.name;
    if(allTitle)allTitle.hidden=true;if(characterTitle){characterTitle.hidden=false;characterTitle.textContent=lang==='en'?`The capers of ${name}`:`Las ocurrencias de ${name}`;}
    if(allIntro)allIntro.hidden=true;if(characterIntro){characterIntro.hidden=false;characterIntro.textContent=lang==='en'?`A little archive of the episodes where ${name} shows up.`:`Mira en cuáles episodios aparece ${name}.`;}
    if(characterFilter){characterFilter.hidden=false;characterFilter.querySelector('.character-archive-filter-name').textContent=lang==='en'?`Looking for ${name?`all of ${name}'s appearances`:'this character'}? Here they are.`:`¿Buscabas todas las apariciones de ${name}? Aquí están.`;}
  }else{
    if(allTitle)allTitle.hidden=false;if(characterTitle)characterTitle.hidden=true;
    if(allIntro)allIntro.hidden=false;if(characterIntro)characterIntro.hidden=true;
    if(characterFilter)characterFilter.hidden=true;
  }
  status.textContent=status.dataset[lang]||status.textContent;
  const total=document.querySelector('#episode-total');if(total)total.textContent=total.dataset[lang]||total.textContent;
  sortSelect.querySelector('[value="random"]').textContent=lang==='es'?'Orden aleatorio':'Random order';sortSelect.querySelector('[value="newest"]').textContent=lang==='es'?'Más recientes primero':'Newest first';sortSelect.querySelector('[value="oldest"]').textContent=lang==='es'?'Del primero al último':'Oldest first';
  loadMoreButton.textContent=lang==='es'?'Cargar más episodios':'Load more episodes';
}

function compareEpisodes(a, b, direction) {
  const dateA = a.publishedAt ? Date.parse(`${a.publishedAt}T12:00:00`) : NaN;
  const dateB = b.publishedAt ? Date.parse(`${b.publishedAt}T12:00:00`) : NaN;
  if (Number.isFinite(dateA) && Number.isFinite(dateB) && dateA !== dateB) return direction * (dateA - dateB);
  return direction * ((a.episodeNumber || 0) - (b.episodeNumber || 0));
}

function formatEpisodeDate(value) {
  const date = new Date(`${value}T12:00:00`);
  const locale = document.documentElement.dataset.lang === 'en' ? 'en-US' : 'es-DO';
  return new Intl.DateTimeFormat(locale, { day:'numeric', month:'short', year:'numeric' }).format(date);
}

function approvedEpisodes(catalog) {
  if (catalog.schemaVersion !== 1 || catalog.editorialPolicy !== 'manual-approval' || !Array.isArray(catalog.episodes)) return [];
  return catalog.episodes.filter(entry => entry.status === 'published' && entry.type === 'comic' && entry.complete === true && Array.isArray(entry.panels) && entry.panels.length)
    .map(entry => ({...entry, panels:[...entry.panels].sort((a,b)=>a.order-b.order)}))
    .filter(entry => entry.panels.every((panel,i) => panel.order === i+1 && /^assets\/[a-zA-Z0-9/_.-]+\.(png|jpg|jpeg|webp)$/i.test(panel.src) && !panel.src.includes('..') && panel.alt?.es && panel.alt?.en));
}

function renderBatch() {
  const lang=pageLanguage();
  const batch = episodes.slice(shown, shown + PAGE_SIZE);
  for (const entry of batch) {
    const article=document.createElement('article');article.className='work-card catalog-card';article.id=`episode-${entry.episodeNumber}`;
    const title=episodeTitle(entry,lang);
    const link=document.createElement('button');link.className='work-image is-loading';link.type='button';link.setAttribute('aria-label',lang==='en'?`Read episode ${entry.episodeNumber}: ${title}`:`Leer episodio ${entry.episodeNumber}: ${title}`);link.setAttribute('aria-busy','true');link.addEventListener('click',()=>openEpisodeFromArchive(entry.id));
    const cover=document.createElement('img');const original=entry.panels[0].sourceSrc||entry.panels[0].src;cover.dataset.original=entry.panels[0].src;cover.src=original.replace(/([^/]+)\.(png|jpe?g|webp)$/i,'thumb-$1.webp');cover.alt=entry.panels[0].alt[lang]||entry.panels[0].alt.es;cover.loading='lazy';cover.decoding='async';cover.width=480;cover.height=480;cover.addEventListener('load',()=>{link.classList.remove('is-loading');link.setAttribute('aria-busy','false')},{once:true});cover.addEventListener('error',()=>{if(cover.src!==new URL(original,location.href).href){cover.src=original;return}link.classList.remove('is-loading');link.setAttribute('aria-busy','false')},{once:true});link.append(cover);
    const copy=document.createElement('div');copy.className='work-copy';const meta=document.createElement('p');meta.className='work-meta';const metaLabel=document.createElement('span');metaLabel.dataset.es=`Episodio ${entry.episodeNumber}`;metaLabel.dataset.en=`Episode ${entry.episodeNumber}`;metaLabel.textContent=metaLabel.dataset[lang];meta.append(metaLabel);
    const share=document.createElement('button');share.className='episode-share';share.type='button';share.setAttribute('aria-label',lang==='en'?'Share episode':'Compartir episodio');share.title=share.getAttribute('aria-label');share.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4"/></svg>';share.addEventListener('click',event=>{event.stopPropagation();window.shareMandarinitaEpisode?.(entry.id);});meta.append(share);
    if(entry.panels[0].watermarkedSrc){const download=document.createElement('a');download.className='episode-download';download.href=entry.panels[0].watermarkedSrc;download.download=`episodio-${entry.episodeNumber}-portada.webp`;download.setAttribute('aria-label',lang==='en'?'Download credited cover':'Descargar portada con firma');download.title=download.getAttribute('aria-label');download.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg>';meta.append(download);}
    const heading=document.createElement('h2');heading.textContent=title;heading.title=title;heading.dataset.es=entry.title.es;heading.dataset.en=episodeTitle(entry,'en');const summary=document.createElement('p');summary.dataset.es=`${entry.panels.length} viñetas`;summary.dataset.en=`${entry.panels.length} panels`;summary.textContent=summary.dataset[lang];
    const instagramUrl=entry.source?.instagramPermalink;
    if(typeof instagramUrl==='string'&&/^https:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(instagramUrl)){
      const instagram=document.createElement('a');instagram.className='episode-instagram';instagram.href=instagramUrl;instagram.target='_blank';instagram.rel='noopener noreferrer';instagram.setAttribute('aria-label',lang==='en'?'View this episode on Instagram':'Ver este episodio en Instagram');
      instagram.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r=".7"></circle></svg>';meta.append(instagram);
    }
    const action=document.createElement('button');action.type='button';action.className='text-button';action.dataset.es='Leer episodio';action.dataset.en='Read episode';action.textContent=action.dataset[lang];action.addEventListener('click',()=>openEpisodeFromArchive(entry.id));copy.append(meta,heading,summary);
    if(entry.publishedAt){const date=document.createElement('time');date.className='episode-date';date.dateTime=entry.publishedAt;date.dataset.iso=entry.publishedAt;date.textContent=formatEpisodeDate(entry.publishedAt);copy.append(date);}
    copy.append(action);article.append(link,copy);grid.append(article);
  }
  shown += batch.length;
  const remaining=episodes.length-shown;
  status.dataset.es=remaining?`Mostrando ${shown} de ${episodes.length} episodios.`:`Se muestran los ${episodes.length} episodios.`;status.dataset.en=remaining?`Showing ${shown} of ${episodes.length} episodes.`:`Showing all ${episodes.length} episodes.`;status.textContent=status.dataset[lang];
  loadMoreButton.hidden=remaining===0;
  const total=document.querySelector('#episode-total');total.dataset.es=`${episodes.length} episodios`;total.dataset.en=`${episodes.length} episodes`;total.textContent=total.dataset[lang];
  syncArchiveLanguage();
}

function shuffle(items){const shuffled=[...items];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled;}
function applySort(){
  if(sortSelect.value==='random')episodes=shuffle(allEpisodes);
  else episodes=[...allEpisodes].sort((a,b)=>compareEpisodes(a,b,sortSelect.value==='oldest'?1:-1));
  resetList();
  try{const url=new URL(location.href);url.searchParams.set('sort',sortSelect.value);history.replaceState(history.state,'',url.pathname+url.search+url.hash);}catch(_){}
}
function resetList() { grid.replaceChildren();shown=0;renderBatch(); }
function openEpisodeFromArchive(id){currentEpisodeId=id;try{const url=new URL(location.href);url.searchParams.set('episode',id);history.replaceState(history.state,'',url.pathname+url.search+url.hash);}catch(_){}let attempts=0;const open=()=>{if(window.openMandarinitaEpisode?.(id))return true;if(++attempts<20){setTimeout(open,50);return true;}status.textContent=pageLanguage()==='en'?'This episode could not be opened. Please try again.':'No se pudo abrir este episodio. Inténtalo de nuevo.';return false;};return open();}
window.openEpisodeFromArchive=openEpisodeFromArchive;
window.advanceMandarinitaEpisode=()=>{
  if(!episodes.length)return;
  const currentIndex=episodes.findIndex(entry=>entry.id===currentEpisodeId);
  const next=episodes[(currentIndex+1+episodes.length)%episodes.length];
  openEpisodeFromArchive(next.id);
};
window.retreatMandarinitaEpisode=()=>{
  if(!episodes.length)return false;
  const currentIndex=episodes.findIndex(entry=>entry.id===currentEpisodeId);
  const previous=episodes[(currentIndex-1+episodes.length)%episodes.length];
  return openEpisodeFromArchive(previous.id);
};
window.randomMandarinitaEpisode=()=>{
  const candidates=allEpisodes.filter(entry=>entry.id!==currentEpisodeId);
  const list=candidates.length?candidates:allEpisodes;
  if(!list.length)return false;
  return openEpisodeFromArchive(list[Math.floor(Math.random()*list.length)].id);
};
sortSelect.addEventListener('change',applySort);
loadMoreButton.addEventListener('click',renderBatch);
document.querySelector('.language-toggle')?.addEventListener('click',()=>{
  const lang=pageLanguage();
  document.querySelectorAll('#episode-grid [data-es][data-en]').forEach(node=>{node.textContent=node.dataset[lang];});
  document.querySelectorAll('#episode-grid .episode-date').forEach(node=>{node.textContent=formatEpisodeDate(node.dataset.iso);});
  document.querySelectorAll('#episode-grid .catalog-card .work-image img').forEach(img=>{const entry=allEpisodes.find(item=>item.panels.some(panel=>panel.src===img.dataset.original));if(entry)img.alt=entry.panels[0].alt[lang]||entry.panels[0].alt.es;});
  document.querySelectorAll('#episode-grid .episode-share').forEach(node=>{node.setAttribute('aria-label',lang==='en'?'Share episode':'Compartir episodio');node.title=node.getAttribute('aria-label');});
  document.querySelectorAll('#episode-grid .episode-download').forEach(node=>{node.setAttribute('aria-label',lang==='en'?'Download credited cover':'Descargar portada con firma');node.title=node.getAttribute('aria-label');});
  document.querySelectorAll('#episode-grid .episode-instagram').forEach(node=>node.setAttribute('aria-label',lang==='en'?'View this episode on Instagram':'Ver este episodio en Instagram'));
  syncArchiveLanguage();
});
const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))renderBatch();},{rootMargin:'600px'});
observer.observe(loadMoreButton);
Promise.all([fetch('episodes.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('No se pudo cargar el catálogo.');return response.json();}),fetch('characters.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('No se pudo cargar el elenco.');return response.json();})]).then(([catalog,characterCatalog])=>{
  allEpisodes=approvedEpisodes(catalog).filter(entry=>Number.isFinite(entry.episodeNumber));
  const params=new URLSearchParams(location.search);
  const requestedCharacter=params.get('character');
  const character=characterCatalog.characters?.find(item=>item.id===requestedCharacter);
  if(character){selectedCharacter=character;allEpisodes=allEpisodes.filter(entry=>entry.characters?.includes(character.id));}
  if(!allEpisodes.length){status.textContent=pageLanguage()==='en'?'There are no published episodes to show.':'No hay episodios publicados para mostrar.';loadMoreButton.hidden=true;return;}
  if(['newest','oldest','random'].includes(params.get('sort')))sortSelect.value=params.get('sort');
  if(sortSelect.value==='random')episodes=shuffle(allEpisodes);else episodes=[...allEpisodes].sort((a,b)=>compareEpisodes(a,b,sortSelect.value==='oldest'?1:-1));
  resetList();
  syncArchiveLanguage();
  const requested=params.get('episode');if(requested)setTimeout(()=>openEpisodeFromArchive(requested),100);
}).catch(()=>{status.textContent=pageLanguage()==='en'?'The archive could not load. Please refresh the page.':'No pudimos cargar el archivo. Intenta actualizar la página.';loadMoreButton.hidden=true;});
