const languageButton = document.querySelector('.language-toggle');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
let language = 'es';
try { language = localStorage.getItem('mandarinita-language') || 'es'; } catch (_) { /* Storage may be disabled. */ }
if (!['es', 'en'].includes(language)) language = 'es';

function setLanguage(next) {
  language = next;
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
  try { localStorage.setItem('mandarinita-language', next); } catch (_) { /* Continue without persistence. */ }
}
setLanguage(language);
languageButton.addEventListener('click', () => { setLanguage(language === 'es' ? 'en' : 'es'); if (activeWork && dialog.open) renderPanel(); });
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
  rage: { title: '¡Grrrrr!', titleEn: 'Grrrr!', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-rage-2019.webp', alt:'Ilustración original de 2019: dos mandarinas reaccionan con enojo y alegría; texto ¡Grrrrr!', altEn:'Original 2019 illustration: two mandarins react with anger and joy; the image reads Grrrr!'}] },
  focus: { title: '¿Quién dice?', titleEn: 'Who says?', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-focus-2019.webp', alt:'Historieta original de 2019 sobre estar enfocado.', altEn:'Original 2019 comic about staying focused.'}] },
  coffee: { title: '¿Tienes hambre?', titleEn: 'Are you hungry?', kind: 'HISTORIETA · 2019', kindEn: 'COMIC · 2019', images: [{src:'assets/comic-coffee-2019.webp', alt:'Mandarinita y Sr. Mandarino conversan en el sofá; los globos dicen “Oye, voy a la cocina ¿tienes hambre?”, “No”, “¿Seguro?” y “Seguro”.', altEn:'Mandarinita and Mr. Mandarin talk on a couch; speech bubbles ask if he is hungry and whether he is sure.'}] },
  envelope: { title: 'El sobre que se va', titleEn: 'The running envelope', kind: 'ILUSTRACIÓN · 2022', kindEn: 'ILLUSTRATION · 2022', images: [{src:'assets/art-envelope-2022.webp', alt:'Mandarinita saluda a un sobre que corre bajo un cielo azul.', altEn:'Mandarinita waves to a running envelope under a blue sky.'}] },
  paperclip: { title: 'El clip misterioso', titleEn: 'The mysterious paperclip', kind: 'ILUSTRACIÓN · 2022', kindEn: 'ILLUSTRATION · 2022', images: [{src:'assets/art-paperclip-2022.webp', alt:'Mandarinita se sorprende al ver un clip grande.', altEn:'Mandarinita is surprised by a large paperclip.'}] },
  storyboard: { title: 'Boceto de historieta · proceso', titleEn: 'Comic storyboard · process material', kind: 'MATERIAL DE PROCESO · NO PUBLICADO', kindEn: 'PROCESS MATERIAL · NOT PUBLISHED', images: [1,2,3,4].map(n=>({src:`assets/storyboard-panel-${n}.webp`,alt:`Viñeta ${n} del boceto original de 2019.`,altEn:`Panel ${n} of the original 2019 storyboard.`})) }
};
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
  caption.textContent = language === 'es' ? `Imagen original ${panelIndex+1} de ${work.images.length}` : `Original image ${panelIndex+1} of ${work.images.length}`;
  count.textContent = `${panelIndex+1} / ${work.images.length}`;
  notice.textContent = activeWork === 'storyboard' ? (language === 'es' ? 'Boceto de proceso · no es un episodio publicado' : 'Storyboard process material · not a published episode') : '';
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
