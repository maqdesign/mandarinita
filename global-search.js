const searchDialog=document.querySelector('#global-search-dialog');
const searchInput=document.querySelector('#global-search-input');
const searchResults=document.querySelector('#global-search-results');
let searchCatalog=[];
let searchCatalogReady=false;
let searchCatalogFailed=false;
window.mandarinitaEpisodesCatalogPromise.then(data=>{searchCatalog=data.episodes||[];searchCatalogReady=true;if(searchInput?.value.trim().length>=2)renderSearchResults();}).catch(()=>{searchCatalogFailed=true;if(searchInput?.value.trim().length>=2)renderSearchResults();});
function syncSearchLanguage(){const english=document.documentElement.dataset.lang==='en';const heading=document.querySelector('#global-search-title');if(heading)heading.textContent=english?'Search Mandarinita':'Buscar en Mandarinita';if(searchInput)searchInput.placeholder=english?'Episode title or number':'Título o número de episodio';const label=document.querySelector('label[for="global-search-input"]');if(label)label.textContent=english?'Search episodes':'Buscar episodios';}
syncSearchLanguage();
function openSearch(){if(!searchDialog)return;searchDialog.showModal();searchInput.focus();}
document.querySelectorAll('.global-search-trigger').forEach(button=>button.addEventListener('click',openSearch));
document.querySelector('.language-toggle')?.addEventListener('click',()=>{
  syncSearchLanguage();
});
document.addEventListener('keydown',event=>{if((event.key==='k'&&(event.ctrlKey||event.metaKey))||event.key==='/'){if(event.target.matches('input,textarea,select,[contenteditable="true"]'))return;event.preventDefault();openSearch();}});
function renderSearchResults(){
  const query=searchInput.value.trim().toLocaleLowerCase();searchResults.replaceChildren();if(query.length<2)return;
  if(!searchCatalogReady){const message=document.createElement('p');message.className='search-empty';message.textContent=searchCatalogFailed?(document.documentElement.dataset.lang==='en'?'Search could not load. Refresh the page to try again.':'No pudimos cargar la búsqueda. Actualiza la página para intentarlo de nuevo.'):(document.documentElement.dataset.lang==='en'?'Loading episodes…':'Cargando episodios…');searchResults.append(message);return;}
  const found=searchCatalog.filter(item=>item.status==='published'&&item.type==='comic'&&item.complete===true&&((item.title?.es||'').toLocaleLowerCase().includes(query)||(item.title?.en||'').toLocaleLowerCase().includes(query)||String(item.episodeNumber||'').includes(query))).slice(0,12);
  const lang=document.documentElement.dataset.lang==='en'?'en':'es';
  for(const item of found){const link=document.createElement('a');link.className='global-search-result';link.href=document.querySelector('#episode-grid')?`#episode-${item.episodeNumber}`:`index.html?episode=${encodeURIComponent(item.id)}`;const number=document.createElement('span');number.textContent=`EP. ${String(item.episodeNumber).padStart(2,'0')}`;const title=document.createElement('strong');const translated=item.title[lang];title.textContent=lang==='en'&&/^episode\s+\d+$/i.test(translated||'')?item.title.es:(translated||item.title.es);link.append(number,title);if(document.querySelector('#episode-grid'))link.addEventListener('click',event=>{event.preventDefault();searchDialog.close();window.openEpisodeFromArchive?.(item.id);});searchResults.append(link);}
  if(!found.length){const empty=document.createElement('p');empty.className='search-empty';empty.textContent=lang==='es'?'No encontramos episodios con ese término.':'No episodes found for that search.';searchResults.append(empty);}
}
searchInput?.addEventListener('input',renderSearchResults);
