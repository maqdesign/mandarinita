const grid = document.querySelector('#episode-grid');
const sortSelect = document.querySelector('#episode-sort');
const loadMoreButton = document.querySelector('#load-more-episodes');
const status = document.querySelector('#episode-status');
const PAGE_SIZE = 12;
let episodes = [];
let allEpisodes = [];
let shown = 0;
let currentEpisodeId = null;

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
  const batch = episodes.slice(shown, shown + PAGE_SIZE);
  for (const entry of batch) {
    const article=document.createElement('article');article.className='work-card catalog-card';article.id=`episode-${entry.episodeNumber}`;
    const link=document.createElement('button');link.className='work-image is-loading';link.type='button';link.setAttribute('aria-label',`${entry.title.es}, episodio ${entry.episodeNumber}`);link.setAttribute('aria-busy','true');link.addEventListener('click',()=>openEpisodeFromArchive(entry.id));
    const cover=document.createElement('img');const original=entry.panels[0].src;cover.src=original.replace(/([^/]+)\.(png|jpe?g)$/i,'thumb-$1.webp');cover.alt=entry.panels[0].alt.es;cover.loading='lazy';cover.decoding='async';cover.width=480;cover.height=480;cover.addEventListener('load',()=>{link.classList.remove('is-loading');link.setAttribute('aria-busy','false')},{once:true});cover.addEventListener('error',()=>{if(cover.src!==new URL(original,location.href).href){cover.src=original;return}link.classList.remove('is-loading');link.setAttribute('aria-busy','false')},{once:true});link.append(cover);
    const copy=document.createElement('div');copy.className='work-copy';const meta=document.createElement('p');meta.className='work-meta';meta.dataset.es=`Episodio ${entry.episodeNumber}`;meta.dataset.en=`Episode ${entry.episodeNumber}`;meta.textContent=meta.dataset.es;
    const heading=document.createElement('h2');heading.textContent=entry.title.es;heading.dataset.es=entry.title.es;heading.dataset.en=/^episode\s+\d+$/i.test(entry.title.en||'')?entry.title.es:(entry.title.en||entry.title.es);const summary=document.createElement('p');summary.dataset.es=`${entry.panels.length} viñetas`;summary.dataset.en=`${entry.panels.length} panels`;summary.textContent=summary.dataset.es;
    const instagramUrl=entry.source?.instagramPermalink;
    if(typeof instagramUrl==='string'&&/^https:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(instagramUrl)){
      const instagram=document.createElement('a');instagram.className='episode-instagram';instagram.href=instagramUrl;instagram.target='_blank';instagram.rel='noopener noreferrer';instagram.setAttribute('aria-label',document.documentElement.dataset.lang==='en'?'View this episode on Instagram':'Ver este episodio en Instagram');
      instagram.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r=".7"></circle></svg>';meta.append(instagram);
    }
    const action=document.createElement('button');action.type='button';action.className='text-button';action.dataset.es='Leer episodio';action.dataset.en='Read episode';action.textContent=action.dataset.es;action.addEventListener('click',()=>openEpisodeFromArchive(entry.id));copy.append(meta,heading,summary);
    if(entry.publishedAt){const date=document.createElement('time');date.className='episode-date';date.dateTime=entry.publishedAt;date.dataset.iso=entry.publishedAt;date.textContent=formatEpisodeDate(entry.publishedAt);copy.append(date);}
    copy.append(action);article.append(link,copy);grid.append(article);
  }
  shown += batch.length;
  const remaining=episodes.length-shown;
  status.dataset.es=remaining?`Mostrando ${shown} de ${episodes.length} episodios.`:`Se muestran los ${episodes.length} episodios.`;status.dataset.en=remaining?`Showing ${shown} of ${episodes.length} episodes.`:`Showing all ${episodes.length} episodes.`;status.textContent=status.dataset.es;
  loadMoreButton.hidden=remaining===0;
  const total=document.querySelector('#episode-total');total.dataset.es=`${episodes.length} episodios`;total.dataset.en=`${episodes.length} episodes`;total.textContent=total.dataset.es;
}

function shuffle(items){const shuffled=[...items];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled;}
function applySort(){
  if(sortSelect.value==='random')episodes=shuffle(allEpisodes);
  else episodes=[...allEpisodes].sort((a,b)=>compareEpisodes(a,b,sortSelect.value==='oldest'?1:-1));
  resetList();
  try{const url=new URL(location.href);url.searchParams.set('sort',sortSelect.value);history.replaceState(history.state,'',url.pathname+url.search+url.hash);}catch(_){}
}
function resetList() { grid.replaceChildren();shown=0;renderBatch(); }
function openEpisodeFromArchive(id){currentEpisodeId=id;let attempts=0;const open=()=>{if(window.openMandarinitaEpisode?.(id))return true;if(++attempts<20){setTimeout(open,50);return true;}status.textContent=currentLanguage==='en'?'This episode could not be opened. Please try again.':'No se pudo abrir este episodio. Inténtalo de nuevo.';return false;};return open();}
window.openEpisodeFromArchive=openEpisodeFromArchive;
window.advanceMandarinitaEpisode=()=>{
  if(!episodes.length)return;
  const currentIndex=episodes.findIndex(entry=>entry.id===currentEpisodeId);
  const next=episodes[(currentIndex+1+episodes.length)%episodes.length];
  openEpisodeFromArchive(next.id);
};
sortSelect.addEventListener('change',applySort);
loadMoreButton.addEventListener('click',renderBatch);
document.querySelector('.language-toggle')?.addEventListener('click',()=>{
  const lang=document.documentElement.dataset.lang==='en'?'en':'es';
  document.querySelectorAll('#episode-grid [data-es][data-en]').forEach(node=>{node.textContent=node.dataset[lang];});
  document.querySelectorAll('#episode-grid .episode-date').forEach(node=>{node.textContent=formatEpisodeDate(node.dataset.iso);});
  status.textContent=status.dataset[lang]||status.textContent;
  const total=document.querySelector('#episode-total');total.textContent=total.dataset[lang]||total.textContent;
  sortSelect.options[0].textContent=lang==='es'?'Más recientes primero':'Newest first';sortSelect.options[1].textContent=lang==='es'?'Del primero al último':'Oldest first';sortSelect.options[2].textContent=lang==='es'?'Orden aleatorio':'Random order';loadMoreButton.textContent=lang==='es'?'Cargar más episodios':'Load more episodes';
});
const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))renderBatch();},{rootMargin:'600px'});
observer.observe(loadMoreButton);
fetch('episodes.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('No se pudo cargar el catálogo.');return response.json();}).then(catalog=>{
  allEpisodes=approvedEpisodes(catalog).filter(entry=>Number.isFinite(entry.episodeNumber));
  if(!allEpisodes.length){status.textContent='No hay episodios publicados para mostrar.';loadMoreButton.hidden=true;return;}
  const params=new URLSearchParams(location.search);if(['newest','oldest','random'].includes(params.get('sort')))sortSelect.value=params.get('sort');
  if(sortSelect.value==='random')episodes=shuffle(allEpisodes);else episodes=[...allEpisodes].sort((a,b)=>compareEpisodes(a,b,sortSelect.value==='oldest'?1:-1));
  resetList();
  const requested=params.get('episode');if(requested)setTimeout(()=>openEpisodeFromArchive(requested),100);
}).catch(()=>{status.textContent='No pudimos cargar el archivo. Intenta actualizar la página.';loadMoreButton.hidden=true;});
