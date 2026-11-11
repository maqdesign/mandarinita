const searchDialog=document.querySelector('#global-search-dialog');
const searchInput=document.querySelector('#global-search-input');
const searchResults=document.querySelector('#global-search-results');
const searchHint=document.querySelector('#global-search-hint');
let searchCatalog=[];
let searchCharacters=[];
let searchObjects=[];
let searchCatalogReady=false;
let searchCatalogFailed=false;

const language=()=>document.documentElement.dataset.lang==='en'?'en':'es';
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
const localizedValues=value=>typeof value==='string'?[value]:Object.values(value||{}).flatMap(entry=>Array.isArray(entry)?entry:[entry]).filter(Boolean);
const labelsFor=(ids,registry)=>ids.map(id=>registry.find(entry=>entry.id===id)).filter(Boolean);
const labelMatches=(entry,query)=>localizedValues(entry.name).concat(localizedValues(entry.aliases)).some(label=>normalize(label).includes(query));

function syncSearchLanguage(){
  const lang=language();
  const heading=document.querySelector('#global-search-title');
  const label=document.querySelector('label[for="global-search-input"]');
  if(heading)heading.textContent=lang==='en'?'Search Mandarinita':'Buscar en Mandarinita';
  if(searchInput)searchInput.placeholder=lang==='en'?'Title, character, object or number':'Título, personaje, objeto o número';
  if(label)label.textContent=lang==='en'?'Find an episode by title, character, object or number':'Encuentra un episodio por título, personaje, objeto o número';
  if(searchHint)searchHint.textContent=lang==='en'?'Search by who or what appears in a comic. Dialogue text is not indexed.':'Busca por quién o qué aparece en la historieta. No indexamos los diálogos.';
}

function openSearch(){if(!searchDialog)return;searchDialog.showModal();searchInput?.focus();}
document.querySelectorAll('.global-search-trigger').forEach(button=>button.addEventListener('click',openSearch));
document.querySelector('.language-toggle')?.addEventListener('click',syncSearchLanguage);
document.addEventListener('keydown',event=>{
  if((event.key==='k'&&(event.ctrlKey||event.metaKey))||event.key==='/'){
    if(event.target.matches('input,textarea,select,[contenteditable="true"]'))return;
    event.preventDefault();openSearch();
  }
});

function renderSearchResults(){
  const query=normalize(searchInput?.value);
  searchResults?.replaceChildren();
  if(!searchResults||query.length<2)return;
  if(!searchCatalogReady){
    const message=document.createElement('p');message.className='search-empty';
    message.textContent=searchCatalogFailed?(language()==='en'?'Search could not load. Refresh the page to try again.':'No pudimos cargar la búsqueda. Actualiza la página para intentarlo de nuevo.'):(language()==='en'?'Loading episodes…':'Cargando episodios…');
    searchResults.append(message);return;
  }
  const found=searchCatalog.filter(item=>{
    if(item.status!=='published'||item.type!=='comic'||item.complete!==true)return false;
    const titles=[item.title?.es,item.title?.en].some(title=>normalize(title).includes(query));
    const number=String(item.episodeNumber||'').includes(query);
    const characters=labelsFor(item.characters||[],searchCharacters).some(entry=>labelMatches(entry,query));
    const objects=labelsFor(item.objects||[],searchObjects).some(entry=>labelMatches(entry,query));
    return titles||number||characters||objects;
  }).slice(0,12);
  const lang=language();
  for(const item of found){
    const link=document.createElement('a');link.className='global-search-result';
    link.href=document.querySelector('#episode-grid')?`#episode-${item.episodeNumber}`:`index.html?episode=${encodeURIComponent(item.id)}`;
    const number=document.createElement('span');number.textContent=`EP. ${String(item.episodeNumber).padStart(2,'0')}`;
    const title=document.createElement('strong');const translated=item.title?.[lang];
    title.textContent=lang==='en'&&/^episode\s+\d+$/i.test(translated||'')?item.title?.es:(translated||item.title?.es||'');
    link.append(number,title);
    const matchedCharacters=labelsFor(item.characters||[],searchCharacters).filter(entry=>labelMatches(entry,query)).map(entry=>entry.name?.[lang]||entry.name?.es||entry.name).filter(Boolean);
    const matchedObjects=labelsFor(item.objects||[],searchObjects).filter(entry=>labelMatches(entry,query)).map(entry=>entry.name?.[lang]||entry.name?.es||entry.name).filter(Boolean);
    if(matchedCharacters.length||matchedObjects.length){
      const details=document.createElement('small');details.className='global-search-result-details';
      const parts=[];
      if(matchedCharacters.length)parts.push(`${lang==='en'?'Characters':'Personajes'}: ${matchedCharacters.join(', ')}`);
      if(matchedObjects.length)parts.push(`${lang==='en'?'Objects':'Objetos'}: ${matchedObjects.join(', ')}`);
      details.textContent=parts.join(' · ');link.append(details);
    }
    if(document.querySelector('#episode-grid'))link.addEventListener('click',event=>{event.preventDefault();searchDialog.close();window.openEpisodeFromArchive?.(item.id);});
    searchResults.append(link);
  }
  if(!found.length){
    const empty=document.createElement('p');empty.className='search-empty';
    empty.textContent=lang==='es'?'No encontramos episodios con ese término. Prueba con un personaje u objeto.':'No episodes found. Try a character or object.';
    searchResults.append(empty);
  }
}

searchInput?.addEventListener('input',renderSearchResults);
syncSearchLanguage();
Promise.all([
  window.mandarinitaEpisodesCatalogPromise,
  fetch('characters.json').then(response=>{if(!response.ok)throw new Error('Characters unavailable');return response.json();}),
  fetch('content/episode-objects.json').then(response=>{if(!response.ok)throw new Error('Objects unavailable');return response.json();})
]).then(([catalog,characterCatalog,objectCatalog])=>{
  searchCatalog=catalog.episodes||[];
  searchCharacters=characterCatalog.characters||[];
  searchObjects=objectCatalog.objects||[];
  searchCatalogReady=true;
  if(searchInput?.value.trim().length>=2)renderSearchResults();
}).catch(()=>{
  searchCatalogFailed=true;
  if(searchInput?.value.trim().length>=2)renderSearchResults();
});
