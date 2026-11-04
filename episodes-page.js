const grid = document.querySelector('#episode-grid');
const sortSelect = document.querySelector('#episode-sort');
const loadMoreButton = document.querySelector('#load-more-episodes');
const status = document.querySelector('#episode-status');
const PAGE_SIZE = 12;
let episodes = [];
let shown = 0;

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
    const link=document.createElement('a');link.className='work-image';link.href=`index.html?episode=${encodeURIComponent(entry.id)}`;link.setAttribute('aria-label',`${entry.title.es}, episodio ${entry.episodeNumber}`);
    const cover=document.createElement('img');cover.src=entry.panels[0].src;cover.alt=entry.panels[0].alt.es;cover.loading='lazy';cover.decoding='async';link.append(cover);
    const copy=document.createElement('div');copy.className='work-copy';const meta=document.createElement('p');meta.className='work-meta';meta.dataset.es=`Episodio ${entry.episodeNumber}`;meta.dataset.en=`Episode ${entry.episodeNumber}`;meta.textContent=meta.dataset.es;
    const heading=document.createElement('h2');heading.textContent=entry.title.es;heading.dataset.es=entry.title.es;heading.dataset.en=/^episode\s+\d+$/i.test(entry.title.en||'')?entry.title.es:(entry.title.en||entry.title.es);const summary=document.createElement('p');summary.dataset.es=`${entry.panels.length} viñetas`;summary.dataset.en=`${entry.panels.length} panels`;summary.textContent=summary.dataset.es;
    const instagramUrl=entry.source?.instagramPermalink;
    if(typeof instagramUrl==='string'&&/^https:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(instagramUrl)){
      const instagram=document.createElement('a');instagram.className='episode-instagram';instagram.href=instagramUrl;instagram.target='_blank';instagram.rel='noopener noreferrer';instagram.setAttribute('aria-label',document.documentElement.dataset.lang==='en'?'View this episode on Instagram':'Ver este episodio en Instagram');
      instagram.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r=".7"></circle></svg>';meta.append(instagram);
    }
    const action=document.createElement('a');action.className='text-button';action.href=link.href;action.dataset.es='Leer episodio';action.dataset.en='Read episode';action.textContent=action.dataset.es;copy.append(meta,heading,summary);
    if(entry.publishedAt){const date=document.createElement('time');date.className='episode-date';date.dateTime=entry.publishedAt;date.dataset.iso=entry.publishedAt;date.textContent=formatEpisodeDate(entry.publishedAt);copy.append(date);}
    copy.append(action);article.append(link,copy);grid.append(article);
  }
  shown += batch.length;
  const remaining=episodes.length-shown;
  status.dataset.es=remaining?`Mostrando ${shown} de ${episodes.length} episodios.`:`Se muestran los ${episodes.length} episodios.`;status.dataset.en=remaining?`Showing ${shown} of ${episodes.length} episodes.`:`Showing all ${episodes.length} episodes.`;status.textContent=status.dataset.es;
  loadMoreButton.hidden=remaining===0;
  const total=document.querySelector('#episode-total');total.dataset.es=`${episodes.length} episodios`;total.dataset.en=`${episodes.length} episodes`;total.textContent=total.dataset.es;
}

function resetList() { grid.replaceChildren();shown=0;renderBatch(); }
sortSelect.addEventListener('change',()=>{episodes.sort((a,b)=>compareEpisodes(a,b,sortSelect.value==='oldest'?1:-1));resetList();});
loadMoreButton.addEventListener('click',renderBatch);
document.querySelector('.language-toggle')?.addEventListener('click',()=>{
  const lang=document.documentElement.dataset.lang==='en'?'en':'es';
  document.querySelectorAll('#episode-grid [data-es][data-en]').forEach(node=>{node.textContent=node.dataset[lang];});
  document.querySelectorAll('#episode-grid .episode-date').forEach(node=>{node.textContent=formatEpisodeDate(node.dataset.iso);});
  status.textContent=status.dataset[lang]||status.textContent;
  const total=document.querySelector('#episode-total');total.textContent=total.dataset[lang]||total.textContent;
  sortSelect.options[0].textContent=lang==='es'?'Más recientes primero':'Newest first';sortSelect.options[1].textContent=lang==='es'?'Del primero al último':'Oldest first';loadMoreButton.textContent=lang==='es'?'Cargar más episodios':'Load more episodes';
});
const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))renderBatch();},{rootMargin:'600px'});
observer.observe(loadMoreButton);
fetch('episodes.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('No se pudo cargar el catálogo.');return response.json();}).then(catalog=>{
  episodes=approvedEpisodes(catalog).filter(entry=>Number.isFinite(entry.episodeNumber));
  episodes.sort((a,b)=>compareEpisodes(a,b,-1));
  if(!episodes.length){status.textContent='No hay episodios publicados para mostrar.';loadMoreButton.hidden=true;return;}
  resetList();
}).catch(()=>{status.textContent='No pudimos cargar el archivo. Intenta actualizar la página.';loadMoreButton.hidden=true;});
