const searchDialog=document.querySelector('#global-search-dialog');
const searchInput=document.querySelector('#global-search-input');
const searchResults=document.querySelector('#global-search-results');
let searchCatalog=[];
fetch('episodes.json',{cache:'no-cache'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{searchCatalog=data.episodes||[];}).catch(()=>{});
function openSearch(){if(!searchDialog)return;searchDialog.showModal();searchInput.focus();}
document.querySelectorAll('.global-search-trigger').forEach(button=>button.addEventListener('click',openSearch));
document.addEventListener('keydown',event=>{if((event.key==='k'&&(event.ctrlKey||event.metaKey))||event.key==='/'){if(event.target.matches('input,textarea,select,[contenteditable="true"]'))return;event.preventDefault();openSearch();}});
searchInput?.addEventListener('input',()=>{
  const query=searchInput.value.trim().toLocaleLowerCase();searchResults.replaceChildren();if(query.length<2)return;
  const found=searchCatalog.filter(item=>item.status==='published'&&item.type==='comic'&&item.complete===true&&((item.title?.es||'').toLocaleLowerCase().includes(query)||(item.title?.en||'').toLocaleLowerCase().includes(query)||String(item.episodeNumber||'').includes(query))).slice(0,12);
  const lang=document.documentElement.dataset.lang==='en'?'en':'es';
  for(const item of found){const link=document.createElement('a');link.className='global-search-result';link.href=`index.html?episode=${encodeURIComponent(item.id)}`;const number=document.createElement('span');number.textContent=`EP. ${String(item.episodeNumber).padStart(2,'0')}`;const title=document.createElement('strong');title.textContent=item.title[lang]||item.title.es;link.append(number,title);searchResults.append(link);}
  if(!found.length){const empty=document.createElement('p');empty.className='search-empty';empty.textContent=lang==='es'?'No encontramos episodios con ese término.':'No episodes found for that search.';searchResults.append(empty);}
});
