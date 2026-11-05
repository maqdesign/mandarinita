(() => {
  const PROJECTS_KEY = 'mandarinita-editor-projects-v1';
  const PROJECT_KEY = id => `mandarinita-editor-project-v1:${id}`;
  const LEGACY_KEY = 'mandarinita-editor-project';
  const LOGICAL_WIDTH = 600;
  const FORMAT = {
    web: { width: 1200, height: 800, logicalHeight: 400, label: 'Web 3:2' },
    square: { width: 1080, height: 1080, logicalHeight: 600, label: 'Instagram 1:1' },
    portrait: { width: 1080, height: 1350, logicalHeight: 750, label: 'Instagram 4:5' }
  };
  const PALETTE = ['#282522', '#F87209', '#607D3B', '#A8522B', '#FFFFFF', '#F7C843', '#6CA8A4'];
  const people = [
    { name: 'Mando Mandarinita', aliases: ['mando', 'mandarino', 'señor mandarino', 'sr. mandarino'], variants: [
      { name: 'Cuerpo', src: 'assets/characters/mando-transparent.webp' },
      { name: 'Retrato neutral', src: 'assets/sr-mandarino-neutral.png' },
      { name: 'Sonrisa', src: 'assets/mandarinita-smile.png' },
      { name: 'Sticker · expresión', src: 'assets/stickers/sticker-pack-06.webp' }
    ] },
    { name: 'Mandy Mandarinita', aliases: ['mandy', 'mandarinita'], variants: [{ name: 'Cuerpo', src: 'assets/characters/mandy-transparent.webp' }] },
    { name: 'Greg el Zanahorio', aliases: ['greg', 'zanahorio', 'zanahoria'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/greg-transparent.webp' }] },
    { name: 'Limón Agrio', aliases: ['limón', 'limon agrio'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/limon-agrio-transparent.webp' }] },
    { name: 'Aguacatelo', aliases: ['aguacate'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/aguacatelo-transparent.png' }] },
    { name: 'Morita', aliases: ['mora'], variants: [{ name: 'Silueta monocroma', src: 'assets/characters/morita.png' }] },
    { name: 'Sra. Pera', aliases: ['pera', 'señora pera'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/sra-pera-transparent.webp' }] },
    { name: 'Sticker frutal · 02', aliases: ['sticker 2'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-02.webp' }] },
    { name: 'Sticker zanahoria · 03', aliases: ['sticker 3'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-03.webp' }] },
    { name: 'Sticker frutal · 04', aliases: ['sticker 4'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-04.webp' }] },
    { name: 'Sticker frutal · 07', aliases: ['sticker 7'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-07.webp' }] }
  ].map(x => ({ ...x, category: 'character', approvedCutout: true }));
  const objects = [
    { name: 'Objeto · sobre', aliases: ['sobre', 'carta'], src: 'assets/art-envelope-2022.webp', category: 'object', approvedCutout: false, note: 'Ilustración completa, no es un recorte independiente.' },
    { name: 'Objeto · clip', aliases: ['clip', 'paperclip'], src: 'assets/art-paperclip-2022.webp', category: 'object', approvedCutout: false, note: 'Ilustración completa, no es un recorte independiente.' }
  ];
  const backgrounds = [
    { name: 'Sala y mueble azul · episodio 19', aliases: ['sala', 'mueble azul', 'sofa', 'sofá', 'episodio 19'], src: 'assets/episodes/ep-019-noche-de-peliculas/19.1.png', category: 'background', approvedCutout: false },
    { name: 'Mueble azul · episodio 51', aliases: ['mueble azul', 'sofa', 'sofá', 'episodio 51'], src: 'assets/episodes/ep-051-tienes-hambre/51.1.png', category: 'background', approvedCutout: false },
    { name: 'Sala · episodio 52', aliases: ['sala', 'sofa', 'sofá', 'episodio 52'], src: 'assets/episodes/ep-052-fruitflix/52.1.png', category: 'background', approvedCutout: false }
  ];
  const resources = [...people, ...objects, ...backgrounds];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  let state = null;
  let undoStack = [];
  let redoStack = [];
  let resourceFilter = 'all';
  let selectedColor = PALETTE[0];
  let brushMode = 'pen';
  let drawing = null;
  const canvas = $('#canvas');

  function id() { return crypto.randomUUID?.() || Math.random().toString(36).slice(2, 12); }
  function makeProject(title = 'Episodio nuevo') {
    return { schemaVersion: 1, projectId: id(), title, status: 'draft', format: 'web', pageHeight: 400, active: 0, selected: null, zoom: 1, grid: true, panels: [{ id: id(), items: [] }, { id: id(), items: [] }], createdAt: Date.now(), updatedAt: Date.now() };
  }
  function listProjects() {
    try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'); } catch { return []; }
  }
  function migrateLegacyProject() {
    if (listProjects().length) return;
    try {
      const old = localStorage.getItem(LEGACY_KEY);
      if (!old) return;
      const project = normalizeProject(JSON.parse(old));
      saveProject(project);
      localStorage.removeItem(LEGACY_KEY);
    } catch { /* Ignore a corrupt older draft and let the owner import a saved file. */ }
  }
  function normalizeProject(project) {
    const normalized = { ...makeProject(project.title || 'Episodio importado'), ...project };
    normalized.projectId ||= id();
    normalized.format = FORMAT[normalized.format] ? normalized.format : 'web';
    normalized.pageHeight = normalized.pageHeight || FORMAT[normalized.format].logicalHeight;
    normalized.panels = Array.isArray(normalized.panels) && normalized.panels.length ? normalized.panels : [{ id: id(), items: [] }, { id: id(), items: [] }];
    normalized.panels.forEach(p => { p.id ||= id(); p.items ||= []; });
    normalized.active = Math.max(0, Math.min(Number(normalized.active) || 0, normalized.panels.length - 1));
    normalized.selected = null;
    return normalized;
  }
  function saveProject(project = state) {
    project.updatedAt = Date.now();
    localStorage.setItem(PROJECT_KEY(project.projectId), JSON.stringify(project));
    const index = listProjects().filter(p => p.id !== project.projectId);
    index.push({ id: project.projectId, title: project.title || 'Episodio sin título', status: project.status || 'draft', createdAt: project.createdAt || Date.now(), updatedAt: project.updatedAt });
    index.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(index));
  }
  function autosave() {
    try {
      state.format = $('#export-preset').value;
      state.updatedAt = Date.now();
      saveProject();
      $('#save-state').textContent = `Guardado local · ${new Date(state.updatedAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      $('#save-state').textContent = 'Espacio local lleno · descarga el .mandarinita';
      toast('No cupo en el almacenamiento local. Descarga el archivo editable para conservarlo.');
    }
  }
  function snapshot() {
    undoStack.push(JSON.stringify(state));
    if (undoStack.length > 80) undoStack.shift();
    redoStack = [];
  }
  function commit() { autosave(); render(); }
  function toast(message) {
    const box = $('#toast'); box.textContent = message; box.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => box.classList.remove('show'), 3000);
  }
  function currentPanel() { return state.panels[state.active]; }
  function currentItem() { return currentPanel()?.items.find(item => item.id === state.selected); }
  function isOffstage(item) { return item.x + item.w <= 0 || item.y + item.h <= 0 || item.x >= LOGICAL_WIDTH || item.y >= state.pageHeight; }
  function formatBounds(format = state.format) { return { width: LOGICAL_WIDTH, height: FORMAT[format].logicalHeight }; }
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function showHome() {
    $('#editor-view').hidden = true; $('#project-home').hidden = false; renderProjectList();
  }
  function showEditor() {
    $('#project-home').hidden = true; $('#editor-view').hidden = false;
    $('#export-preset').value = state.format;
    render();
  }
  function renderProjectList() {
    const list = $('#project-list');
    const projects = listProjects();
    list.innerHTML = '';
    if (!projects.length) {
      list.innerHTML = '<div class="home-empty"><span>✳</span><b>Aquí aparecerán tus episodios</b><p>Crea uno nuevo o importa un archivo .mandarinita que guardaste antes.</p></div>';
      return;
    }
    projects.forEach(record => {
      const card = document.createElement('article'); card.className = 'project-card';
      const name = document.createElement('div'); name.className = 'project-card-main';
      const reviewState = record.status === 'review';
      name.innerHTML = `<strong>${escapeHTML(record.title)}</strong><span class="status-pill ${reviewState ? 'ready' : ''}">${reviewState ? 'En revisión' : 'Borrador'}</span><small>Modificado ${new Date(record.updatedAt).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })}</small>`;
      const actions = document.createElement('div'); actions.className = 'project-card-actions';
      const open = document.createElement('button'); open.textContent = 'Abrir'; open.className = 'button primary'; open.onclick = () => openProject(record.id);
      const duplicate = document.createElement('button'); duplicate.textContent = 'Duplicar'; duplicate.className = 'button'; duplicate.onclick = () => duplicateProject(record.id);
      const remove = document.createElement('button'); remove.textContent = 'Borrar'; remove.className = 'button danger'; remove.onclick = () => deleteProject(record.id);
      actions.append(open, duplicate, remove); card.append(name, actions); list.append(card);
    });
  }
  function openProject(projectId) {
    try {
      state = normalizeProject(JSON.parse(localStorage.getItem(PROJECT_KEY(projectId))));
      undoStack = []; redoStack = []; showEditor();
    } catch { toast('No pude abrir ese proyecto local. Prueba importar su archivo .mandarinita.'); }
  }
  function newProject() {
    state = makeProject(); undoStack = []; redoStack = [];
    try { saveProject(); showEditor(); } catch { showEditor(); toast('Este navegador no permitió guardar automáticamente. Descarga el .mandarinita.'); }
  }
  function duplicateProject(projectId) {
    try {
      const source = JSON.parse(localStorage.getItem(PROJECT_KEY(projectId)));
      const copy = normalizeProject({ ...source, projectId: id(), title: `${source.title} · copia`, createdAt: Date.now(), updatedAt: Date.now() });
      saveProject(copy); renderProjectList();
    } catch { toast('No pude duplicar ese proyecto.'); }
  }
  function deleteProject(projectId) {
    const record = listProjects().find(p => p.id === projectId);
    if (!record || !window.confirm(`¿Borrar “${record.title}” de este dispositivo?`)) return;
    localStorage.removeItem(PROJECT_KEY(projectId));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(listProjects().filter(p => p.id !== projectId)));
    renderProjectList();
  }
  function captureState() { return JSON.parse(JSON.stringify(state)); }

  function overlaps(a, b, gap = 12) {
    return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
  }
  function placeWithoutOverlap(width, height) {
    const columns = [24, 222, 420];
    const rows = [24, 204, 384, 564];
    const candidates = [];
    rows.forEach(y => columns.forEach(x => candidates.push({ x, y })));
    const fits = candidates.find(point => point.x + width <= LOGICAL_WIDTH && point.y + height <= state.pageHeight && currentPanel().items.every(item => !overlaps({ ...point, w: width, h: height }, item)));
    if (fits) return fits;
    const step = 22;
    for (let y = 22; y + height <= state.pageHeight; y += step) {
      for (let x = 22; x + width <= LOGICAL_WIDTH; x += step) {
        const point = { x, y };
        if (currentPanel().items.every(item => !overlaps({ ...point, w: width, h: height }, item))) return point;
      }
    }
    return { x: Math.max(0, (LOGICAL_WIDTH - width) / 2), y: Math.max(0, (state.pageHeight - height) / 2) };
  }
  function addResource(resource, variantIndex = 0) {
    if (!resource.approvedCutout) { toast(resource.note || 'Este archivo es una referencia de escena, no un componente aislado.'); return; }
    const variant = resource.variants?.[variantIndex] || resource;
    const isSticker = variant.src.includes('sticker-pack');
    const width = isSticker ? 130 : 150;
    const height = isSticker ? 130 : 160;
    const pos = placeWithoutOverlap(width, height);
    snapshot();
    const item = { id: id(), type: 'image', name: resource.name, resourceId: resource.name, aliases: resource.aliases || [], src: variant.src, variants: resource.variants || null, variantIndex, x: pos.x, y: pos.y, w: width, h: height, rotation: 0, locked: false };
    currentPanel().items.push(item); selectItem(item.id); commit();
  }
  function addBubble(kind = 'dialogue') {
    const size = kind === 'sfx' ? { w: 150, h: 90 } : { w: 210, h: 105 };
    const pos = placeWithoutOverlap(size.w, size.h);
    snapshot();
    const labels = { dialogue: 'Diálogo', thought: 'Pensamiento', narration: 'Narración', shout: 'Voz fuerte', sfx: 'Efecto' };
    const item = { id: id(), type: 'bubble', kind, name: `Globo · ${labels[kind]}`, text: kind === 'sfx' ? 'POW!' : 'Escribe aquí…', ...pos, ...size, fontSize: kind === 'sfx' ? 30 : 17, align: 'center', tail: ['dialogue', 'shout'].includes(kind), tailX: 28, overflow: 'auto', locked: false };
    currentPanel().items.push(item); selectItem(item.id); commit();
  }
  function selectItem(itemId) {
    state.selected = itemId;
    $$('.placed').forEach(element => {
      const active = element.dataset.id === itemId;
      element.classList.toggle('selected', active);
      const handle = element.querySelector('.resize-handle');
      if (handle) handle.hidden = !active || Boolean(currentPanel().items.find(item => item.id === itemId)?.locked);
    });
    renderInspector(); renderLayers();
  }
  function stageScale() { return state.zoom * (matchMedia('(max-width: 640px)').matches ? 0.56 : 1); }
  function render() {
    canvas.innerHTML = '';
    canvas.style.height = `${state.pageHeight}px`;
    canvas.style.transform = `scale(${stageScale()})`;
    canvas.classList.toggle('grid-off', !state.grid);
    canvas.classList.toggle('draw-active', $('#toggle-draw').getAttribute('aria-pressed') === 'true');
    $('#zoom-label').textContent = `${Math.round(stageScale() * 100)}%`;
    $('#project-title').textContent = state.title || 'Episodio nuevo';
    $('#export-preset').value = state.format;
    $('#current-panel-label').textContent = `VIÑETA ${state.active + 1}`;
    renderPanels();
    currentPanel().items.forEach((item, index) => renderItem(item, index));
    renderInspector(); renderLayers(); renderOffstage();
  }
  function renderPanels() {
    const list = $('#panel-list'); list.innerHTML = '';
    state.panels.forEach((panel, index) => {
      const card = document.createElement('div'); card.className = 'panel-card';
      const button = document.createElement('button'); button.className = `panel-thumb${index === state.active ? ' active' : ''}`;
      button.innerHTML = `<span class="panel-number">${index + 1}</span>Viñeta<span class="mini-count">${panel.items.length} capas</span>`;
      button.onclick = () => { state.active = index; state.selected = null; render(); };
      const up = document.createElement('button'); const down = document.createElement('button');
      up.className = down.className = 'panel-move'; up.textContent = '↑'; down.textContent = '↓';
      up.setAttribute('aria-label', `Mover viñeta ${index + 1} antes`); down.setAttribute('aria-label', `Mover viñeta ${index + 1} después`);
      up.disabled = index === 0; down.disabled = index === state.panels.length - 1;
      up.onclick = () => movePanel(index, -1); down.onclick = () => movePanel(index, 1);
      card.append(button, up, down); list.append(card);
    });
  }
  function renderItem(item, index) {
    const element = document.createElement('div');
    element.className = `placed${state.selected === item.id ? ' selected' : ''}${item.type === 'bubble' ? ` bubble bubble-${item.kind}` : ''}${item.type === 'drawing' ? ' drawing' : ''}${isOffstage(item) ? ' offstage' : ''}`;
    element.dataset.id = item.id;
    element.style.cssText = `left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;transform:rotate(${item.rotation || 0}deg);--tail-x:${item.tailX ?? 28}%;z-index:${index + 1};`;
    if (item.type === 'image') {
      const img = document.createElement('img'); img.src = item.src; img.alt = item.name; element.append(img);
    } else if (item.type === 'drawing') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${item.w} ${item.h}`); svg.setAttribute('aria-label', item.name);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', item.path); path.setAttribute('fill', 'none'); path.setAttribute('stroke', item.color); path.setAttribute('stroke-width', item.strokeWidth); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
      if (item.opacity) path.setAttribute('opacity', item.opacity);
      svg.append(path); element.append(svg);
    } else {
      const textarea = document.createElement('textarea'); textarea.setAttribute('aria-label', `Texto: ${item.name}`); textarea.value = item.text || '';
      textarea.style.fontSize = `${item.fontSize || 17}px`; textarea.style.textAlign = item.align || 'center'; textarea.style.overflow = item.overflow || 'auto';
      textarea.onfocus = () => { if (!item._typingSnapshot) { snapshot(); item._typingSnapshot = true; } };
      textarea.onblur = () => { delete item._typingSnapshot; autosave(); };
      textarea.oninput = () => {
        item.text = textarea.value;
        if (item.autoGrow !== false) { textarea.style.height = 'auto'; item.h = Math.max(78, Math.min(state.pageHeight - item.y, textarea.scrollHeight + 26)); element.style.height = `${item.h}px`; }
        autosave();
      };
      element.append(textarea);
    }
    const handle = document.createElement('button'); handle.className = 'resize-handle'; handle.type = 'button'; handle.setAttribute('aria-label', `Cambiar tamaño de ${item.name}`); handle.hidden = item.id !== state.selected || item.locked; element.append(handle);
    attachResize(handle, element, item);
    element.onpointerdown = event => {
      if ($('#toggle-draw').getAttribute('aria-pressed') === 'true' || item.locked || event.target === handle || event.target.tagName === 'TEXTAREA') return;
      if (state.selected !== item.id) selectItem(item.id);
      event.preventDefault(); element.setPointerCapture(event.pointerId);
      const start = { x: event.clientX, y: event.clientY, ix: item.x, iy: item.y, moved: false };
      element.onpointermove = moveEvent => {
        if (!element.hasPointerCapture(moveEvent.pointerId)) return;
        const dx = (moveEvent.clientX - start.x) / stageScale(); const dy = (moveEvent.clientY - start.y) / stageScale();
        if (!start.moved && Math.hypot(dx, dy) > 2) { snapshot(); start.moved = true; }
        if (!start.moved) return;
        item.x = start.ix + dx; item.y = start.iy + dy;
        element.style.left = `${item.x}px`; element.style.top = `${item.y}px`;
        element.classList.toggle('offstage', isOffstage(item));
      };
      element.onpointerup = () => { if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId); element.onpointermove = null; element.onpointerup = null; if (start.moved) { autosave(); renderOffstage(); renderLayers(); } };
    };
    element.onclick = event => { event.stopPropagation(); selectItem(item.id); };
    if ($('#toggle-draw').getAttribute('aria-pressed') === 'true') element.style.pointerEvents = 'none';
    canvas.append(element);
  }
  function attachResize(handle, element, item) {
    handle.onpointerdown = event => {
      if (item.locked) return;
      event.preventDefault(); event.stopPropagation(); snapshot();
      const start = { x: event.clientX, y: event.clientY, w: item.w, h: item.h, ratio: item.w / item.h };
      handle.setPointerCapture(event.pointerId);
      handle.onpointermove = moveEvent => {
        if (!handle.hasPointerCapture(moveEvent.pointerId)) return;
        const dx = (moveEvent.clientX - start.x) / stageScale(); const dy = (moveEvent.clientY - start.y) / stageScale();
        if (item.type === 'image' || item.type === 'drawing') {
          const width = Math.max(40, start.w + (Math.abs(dx) > Math.abs(dy) ? dx : dy * start.ratio));
          item.w = Math.min(LOGICAL_WIDTH - item.x, width); item.h = item.w / start.ratio;
        } else { item.w = Math.max(78, Math.min(LOGICAL_WIDTH - item.x, start.w + dx)); item.h = Math.max(58, Math.min(state.pageHeight - item.y, start.h + dy)); item.autoGrow = false; }
        element.style.width = `${item.w}px`; element.style.height = `${item.h}px`;
      };
      handle.onpointerup = () => { if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId); handle.onpointermove = null; autosave(); renderInspector(); renderOffstage(); };
    };
  }
  function renderInspector() {
    const item = currentItem(); const box = $('#inspector-content');
    if (!item) { box.innerHTML = '<div class="empty-state"><span>✳</span><b>Selecciona un elemento</b><p>Su contorno y tirador naranja aparecerán en el lienzo.</p></div>'; return; }
    const variantControl = item.variants?.length ? `<div class="field"><label>Variación del mismo personaje</label><select id="p-variant">${item.variants.map((variant, i) => `<option value="${i}" ${i === item.variantIndex ? 'selected' : ''}>${escapeHTML(variant.name)}</option>`).join('')}</select></div>` : '';
    const bubbleControls = item.type === 'bubble' ? `<div class="field"><label>Tipo</label><select id="p-kind"><option value="dialogue">Diálogo normal</option><option value="thought">Pensamiento</option><option value="narration">Narración</option><option value="shout">Voz fuerte</option><option value="sfx">Efecto · POW / CRASH</option></select></div><div class="field"><label>Tamaño de letra</label><input id="p-font" type="range" min="10" max="44" value="${item.fontSize || 17}"></div><div class="field"><label>Alineación</label><select id="p-align"><option value="center">Centrada</option><option value="left">Izquierda</option><option value="right">Derecha</option></select></div><label class="check-field"><input id="p-tail" type="checkbox" ${item.tail ? 'checked' : ''}> Cola del globo</label><div class="field"><label>Posición de la cola</label><input id="p-tail-x" type="range" min="10" max="90" value="${item.tailX ?? 28}"></div><label class="check-field"><input id="p-autogrow" type="checkbox" ${item.autoGrow === false ? '' : 'checked'}> Ajustar alto al texto</label>` : '';
    const drawingControls = item.type === 'drawing' ? `<div class="field"><label>Color del trazo</label><input id="p-color" type="color" value="${item.color}"></div><div class="field"><label>Grosor</label><input id="p-stroke-width" type="range" min="1" max="40" value="${item.strokeWidth}"></div>` : '';
    const recoverControl = isOffstage(item) ? '<button id="bring-in" class="button recovery">Recuperar dentro del lienzo</button>' : '';
    box.innerHTML = `<div class="field"><label>Nombre de capa</label><input id="p-name" value=""></div>${variantControl}${bubbleControls}${drawingControls}<div class="field-row"><div class="field"><label>X</label><input id="p-x" type="number" value="${Math.round(item.x)}"></div><div class="field"><label>Y</label><input id="p-y" type="number" value="${Math.round(item.y)}"></div></div><div class="field-row"><div class="field"><label>Ancho</label><input id="p-w" type="number" value="${Math.round(item.w)}"></div><div class="field"><label>Alto</label><input id="p-h" type="number" value="${Math.round(item.h)}"></div></div><div class="field"><label>Giro</label><input id="p-rot" type="range" min="-180" max="180" value="${item.rotation || 0}"></div><div class="inspector-buttons"><button id="duplicate">Duplicar</button><button id="lock">${item.locked ? 'Desbloquear' : 'Bloquear'}</button><button id="delete" class="danger">Borrar</button></div>${recoverControl}`;
    $('#p-name').value = item.name;
    for (const name of ['kind', 'align']) { const input = $(`#p-${name}`); if (input) input.value = item[name] || (name === 'align' ? 'center' : 'dialogue'); }
    const setProp = (selector, property, numeric = true) => $(`#p-${selector}`)?.addEventListener('change', event => { snapshot(); item[property] = numeric ? Number(event.target.value) : event.target.value; commit(); });
    setProp('name', 'name', false); setProp('x', 'x'); setProp('y', 'y'); setProp('w', 'w'); setProp('h', 'h'); setProp('rot', 'rotation');
    $('#p-variant')?.addEventListener('change', event => { snapshot(); item.variantIndex = Number(event.target.value); item.src = item.variants[item.variantIndex].src; commit(); });
    $('#p-kind')?.addEventListener('change', event => { snapshot(); item.kind = event.target.value; if (item.kind === 'sfx') { item.tail = false; item.fontSize = Math.max(item.fontSize, 30); } commit(); });
    $('#p-align')?.addEventListener('change', event => { snapshot(); item.align = event.target.value; commit(); });
    $('#p-font')?.addEventListener('input', event => { item.fontSize = Number(event.target.value); const text = canvas.querySelector(`[data-id="${item.id}"] textarea`); if (text) text.style.fontSize = `${item.fontSize}px`; autosave(); });
    $('#p-tail')?.addEventListener('change', event => { item.tail = event.target.checked; commit(); });
    $('#p-tail-x')?.addEventListener('input', event => { item.tailX = Number(event.target.value); canvas.querySelector(`[data-id="${item.id}"]`)?.style.setProperty('--tail-x', `${item.tailX}%`); autosave(); });
    $('#p-autogrow')?.addEventListener('change', event => { item.autoGrow = event.target.checked; autosave(); });
    $('#p-color')?.addEventListener('input', event => { item.color = event.target.value; const path = canvas.querySelector(`[data-id="${item.id}"] path`); path?.setAttribute('stroke', item.color); autosave(); });
    $('#p-stroke-width')?.addEventListener('input', event => { item.strokeWidth = Number(event.target.value); const path = canvas.querySelector(`[data-id="${item.id}"] path`); path?.setAttribute('stroke-width', item.strokeWidth); autosave(); });
    $('#duplicate').onclick = () => { snapshot(); const copy = { ...item, id: id(), x: item.x + 24, y: item.y + 24, name: `${item.name} · copia` }; currentPanel().items.push(copy); selectItem(copy.id); commit(); };
    $('#lock').onclick = () => { snapshot(); item.locked = !item.locked; commit(); };
    $('#delete').onclick = () => { snapshot(); currentPanel().items = currentPanel().items.filter(entry => entry.id !== item.id); state.selected = null; commit(); };
    $('#bring-in')?.addEventListener('click', () => recoverItem(item.id));
  }
  function renderLayers() {
    const list = $('#layer-list'); list.innerHTML = '';
    const items = [...currentPanel().items].reverse();
    $('#layer-count').textContent = `${items.length} ${items.length === 1 ? 'capa' : 'capas'}`;
    items.forEach(item => {
      const row = document.createElement('div'); row.className = `layer-row${item.id === state.selected ? ' active' : ''}${isOffstage(item) ? ' layer-offstage' : ''}`;
      row.innerHTML = `<span class="layer-icon">${item.type === 'bubble' ? '◯' : item.type === 'drawing' ? '✎' : '▧'}</span><span class="layer-name">${escapeHTML(item.name)}</span><button class="layer-order" aria-label="Subir capa">↑</button><button class="layer-order down" aria-label="Bajar capa">↓</button><button class="lock" aria-label="${item.locked ? 'Desbloquear' : 'Bloquear'}">${item.locked ? '🔒' : '◦'}</button>`;
      row.onclick = () => selectItem(item.id);
      row.querySelector('.lock').onclick = event => { event.stopPropagation(); snapshot(); item.locked = !item.locked; commit(); };
      row.querySelector('.layer-order').onclick = event => { event.stopPropagation(); reorderLayer(item.id, 1); };
      row.querySelector('.down').onclick = event => { event.stopPropagation(); reorderLayer(item.id, -1); };
      list.append(row);
    });
  }
  function reorderLayer(itemId, delta) {
    const items = currentPanel().items; const from = items.findIndex(item => item.id === itemId); const to = Math.max(0, Math.min(items.length - 1, from + delta));
    if (from < 0 || from === to) return;
    snapshot(); [items[from], items[to]] = [items[to], items[from]]; commit();
  }
  function renderOffstage() {
    const entries = currentPanel().items.filter(isOffstage); const panel = $('#offstage-panel');
    panel.hidden = entries.length === 0; $('#offstage-count').textContent = String(entries.length); const list = $('#offstage-list'); list.innerHTML = '';
    entries.forEach(item => { const button = document.createElement('button'); button.className = 'offstage-item'; button.textContent = `◉ ${item.name} · recuperar`; button.onclick = () => selectItem(item.id); list.append(button); });
  }
  function recoverItem(itemId) {
    const item = currentPanel().items.find(entry => entry.id === itemId); if (!item) return;
    snapshot(); item.x = Math.max(8, Math.min(LOGICAL_WIDTH - item.w - 8, item.x)); item.y = Math.max(8, Math.min(state.pageHeight - item.h - 8, item.y)); commit(); selectItem(item.id);
  }
  function movePanel(index, delta) {
    const next = index + delta; if (next < 0 || next >= state.panels.length) return;
    snapshot(); [state.panels[index], state.panels[next]] = [state.panels[next], state.panels[index]]; state.active = next; commit();
  }
  function addPanel() { snapshot(); state.panels.push({ id: id(), items: [] }); state.active = state.panels.length - 1; state.selected = null; commit(); }
  function changeFormat(format) {
    if (!FORMAT[format]) return;
    const previous = state.pageHeight; state.format = format; state.pageHeight = FORMAT[format].logicalHeight;
    const outside = currentPanel().items.filter(isOffstage).length;
    autosave(); render();
    if (outside) toast(`${outside} elemento(s) quedarán fuera al cambiar de ${previous}px a ${state.pageHeight}px de alto. Recupéralos en la lista de capas.`);
  }

  function renderResources() {
    const grid = $('#asset-grid'); const query = $('#asset-search').value.trim().toLocaleLowerCase('es');
    const candidates = resources.filter(resource => (resourceFilter === 'all' || resource.category === resourceFilter) && `${resource.name} ${(resource.aliases || []).join(' ')}`.toLocaleLowerCase('es').includes(query));
    grid.innerHTML = '';
    const isBackground = resourceFilter === 'background'; $('#background-note').hidden = !isBackground;
    if (resourceFilter === 'object' && !candidates.length) {
      grid.innerHTML = '<div class="resource-note">Todavía no hay objetos sueltos con transparencia. Los objetos importantes se ven dentro de las láminas; se podrán registrar como componentes cuando tengamos su dibujo aislado.</div>'; return;
    }
    if (!candidates.length) { grid.innerHTML = '<div class="resource-note">No encontré recursos con ese nombre.</div>'; return; }
    candidates.forEach(resource => {
      const card = document.createElement('button'); card.className = `asset-card${resource.approvedCutout ? '' : ' reference-card'}`;
      const thumb = resource.variants?.[0]?.src || resource.src;
      card.innerHTML = `<img src="${thumb}" alt="" loading="lazy"><span>${escapeHTML(resource.name)}</span><small>${resource.approvedCutout ? 'Componente aislado' : resource.category === 'background' ? 'Referencia · lámina completa' : resource.note}</small>`;
      card.disabled = !resource.approvedCutout;
      if (resource.approvedCutout) card.onclick = () => addResource(resource);
      grid.append(card);
    });
  }
  function setupResourceFilters() {
    $$('.filters button').forEach(button => button.onclick = () => {
      $$('.filters button').forEach(candidate => candidate.classList.toggle('active', candidate === button));
      resourceFilter = button.dataset.filter; renderResources();
    });
    $('#asset-search').oninput = renderResources;
    renderResources();
  }

  function setDrawMode(enabled) {
    $('#toggle-draw').setAttribute('aria-pressed', String(enabled));
    $('#draw-toolbar').hidden = !enabled;
    render();
  }
  function pointOnCanvas(event) {
    const rect = canvas.getBoundingClientRect(); const scale = rect.width / LOGICAL_WIDTH;
    return { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale, pressure: event.pointerType === 'pen' ? Math.max(0.15, event.pressure) : 0.65 };
  }
  function beginDrawing(event) {
    if ($('#toggle-draw').getAttribute('aria-pressed') !== 'true') return;
    event.preventDefault(); event.stopPropagation();
    if (brushMode === 'eraser') {
      const point = pointOnCanvas(event); const strokes = currentPanel().items.filter(item => item.type === 'drawing' && point.x >= item.x - 10 && point.x <= item.x + item.w + 10 && point.y >= item.y - 10 && point.y <= item.y + item.h + 10);
      if (strokes.length) { snapshot(); currentPanel().items = currentPanel().items.filter(item => item.id !== strokes.at(-1).id); commit(); }
      else toast('El borrador quita trazos hechos aquí; las imágenes originales permanecen intactas.');
      return;
    }
    drawing = { points: [pointOnCanvas(event)], color: selectedColor, size: Number($('#brush-size').value), opacity: brushMode === 'marker' ? 0.55 : brushMode === 'pencil' ? 0.66 : 1 };
    canvas.setPointerCapture(event.pointerId);
  }
  function continueDrawing(event) {
    if (!drawing || !canvas.hasPointerCapture(event.pointerId)) return;
    drawing.points.push(pointOnCanvas(event)); drawPreview();
  }
  function drawPreview() {
    $$('.temporary-stroke').forEach(node => node.remove());
    if (!drawing || drawing.points.length < 2) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.classList.add('temporary-stroke'); svg.setAttribute('viewBox', `0 0 ${LOGICAL_WIDTH} ${state.pageHeight}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', drawing.points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' '));
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', drawing.color); path.setAttribute('stroke-width', drawing.size); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round'); path.setAttribute('opacity', drawing.opacity); svg.append(path); canvas.append(svg);
  }
  function finishDrawing(event) {
    if (!drawing) return;
    if (drawing.points.length < 2) { drawing = null; return; }
    const points = drawing.points; const pad = Math.max(10, drawing.size * 2);
    const minX = Math.max(0, Math.min(...points.map(point => point.x)) - pad); const minY = Math.max(0, Math.min(...points.map(point => point.y)) - pad);
    const maxX = Math.min(LOGICAL_WIDTH, Math.max(...points.map(point => point.x)) + pad); const maxY = Math.min(state.pageHeight, Math.max(...points.map(point => point.y)) + pad);
    const width = Math.max(1, maxX - minX); const height = Math.max(1, maxY - minY);
    const path = points.map((point, i) => `${i ? 'L' : 'M'}${(point.x - minX).toFixed(1)},${(point.y - minY).toFixed(1)}`).join(' ');
    snapshot(); const item = { id: id(), type: 'drawing', name: 'Trazo', x: minX, y: minY, w: width, h: height, path, color: drawing.color, strokeWidth: drawing.size, opacity: drawing.opacity, locked: false, rotation: 0 };
    currentPanel().items.push(item); drawing = null; selectItem(item.id); commit();
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }
  async function renderPanelPng(panel) {
    const preset = FORMAT[state.format]; const logicalHeight = state.pageHeight;
    const scale = Math.min(preset.width / LOGICAL_WIDTH, preset.height / logicalHeight);
    const offsetX = (preset.width - LOGICAL_WIDTH * scale) / 2; const offsetY = (preset.height - logicalHeight * scale) / 2;
    const output = document.createElement('canvas'); output.width = preset.width; output.height = preset.height;
    const ctx = output.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, output.width, output.height);
    for (const item of panel.items) {
      ctx.save(); ctx.translate(offsetX + (item.x + item.w / 2) * scale, offsetY + (item.y + item.h / 2) * scale); ctx.rotate((item.rotation || 0) * Math.PI / 180); ctx.scale(scale / 2, scale / 2);
      if (item.type === 'image') {
        try { const image = await loadImage(item.src); drawContained(ctx, image, item.w, item.h); } catch { /* Missing image stays represented by its source path in the editable project. */ }
      } else if (item.type === 'drawing') {
        ctx.globalAlpha = item.opacity || 1; ctx.strokeStyle = item.color; ctx.lineWidth = item.strokeWidth; ctx.lineCap = ctx.lineJoin = 'round'; const path = new Path2D(item.path); ctx.stroke(path);
      } else {
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#292725'; ctx.lineWidth = 4; ctx.beginPath();
        if (item.kind === 'narration') ctx.roundRect(-item.w / 2, -item.h / 2, item.w, item.h, 14);
        else ctx.ellipse(0, 0, item.w / 2, item.h / 2, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        if (item.tail && !['narration', 'sfx', 'thought'].includes(item.kind)) { const tailX = -item.w / 2 + (item.tailX ?? 28) / 100 * item.w; ctx.beginPath(); ctx.moveTo(tailX - 10, item.h * 0.34); ctx.lineTo(tailX + 10, item.h * 0.34); ctx.lineTo(tailX + 5, item.h / 2 + 15); ctx.closePath(); ctx.fill(); ctx.stroke(); }
        ctx.fillStyle = item.kind === 'sfx' ? '#F87209' : '#292725'; ctx.font = `${item.kind === 'sfx' ? '700 ' : ''}${item.fontSize || 17}px Fredoka, sans-serif`; ctx.textAlign = item.align || 'center'; ctx.textBaseline = 'middle';
        wrapText(ctx, item.text, 0, 0, item.w * 0.82, (item.fontSize || 17) * 1.25);
      }
      ctx.restore();
    }
    return new Promise(resolve => output.toBlob(resolve, 'image/png'));
  }
  function drawContained(ctx, image, width, height) {
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight); const w = image.naturalWidth * scale; const h = image.naturalHeight * scale;
    ctx.drawImage(image, -w / 2, -h / 2, w, h);
  }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || '').split(/\s+/); const lines = []; let line = '';
    words.forEach(word => { const test = line ? `${line} ${word}` : word; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; });
    lines.push(line); const firstY = y - (lines.length - 1) * lineHeight / 2; lines.forEach((part, i) => ctx.fillText(part, x, firstY + i * lineHeight));
  }
  function zipStore(files) {
    const encoder = new TextEncoder(); const locals = []; const centrals = []; let offset = 0;
    for (const file of files) {
      const name = encoder.encode(file.name); const bytes = file.data; const crc = crc32(bytes);
      const local = new Uint8Array(30 + name.length + bytes.length); const header = new DataView(local.buffer);
      header.setUint32(0, 0x04034b50, true); header.setUint16(4, 20, true); header.setUint16(6, 0x800, true); header.setUint16(8, 0, true);
      header.setUint32(14, crc, true); header.setUint32(18, bytes.length, true); header.setUint32(22, bytes.length, true); header.setUint16(26, name.length, true); local.set(name, 30); local.set(bytes, 30 + name.length); locals.push(local);
      const central = new Uint8Array(46 + name.length); const centralHeader = new DataView(central.buffer);
      centralHeader.setUint32(0, 0x02014b50, true); centralHeader.setUint16(4, 20, true); centralHeader.setUint16(6, 20, true); centralHeader.setUint16(8, 0x800, true); centralHeader.setUint16(10, 0, true);
      centralHeader.setUint32(16, crc, true); centralHeader.setUint32(20, bytes.length, true); centralHeader.setUint32(24, bytes.length, true); centralHeader.setUint16(28, name.length, true); centralHeader.setUint32(42, offset, true); central.set(name, 46); centrals.push(central); offset += local.length;
    }
    const centralSize = centrals.reduce((sum, part) => sum + part.length, 0); const end = new Uint8Array(22); const endHeader = new DataView(end.buffer);
    endHeader.setUint32(0, 0x06054b50, true); endHeader.setUint16(8, files.length, true); endHeader.setUint16(10, files.length, true); endHeader.setUint32(12, centralSize, true); endHeader.setUint32(16, offset, true);
    return new Blob([...locals, ...centrals, end], { type: 'application/zip' });
  }
  function crc32(bytes) { let crc = -1; for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); } return (crc ^ -1) >>> 0; }
  async function exportSource() {
    const clone = captureState(); clone.selected = null; clone.updatedAt = Date.now();
    const bytes = new TextEncoder().encode(JSON.stringify(clone, null, 2));
    download(zipStore([{ name: 'proyecto.json', data: bytes }]), `${slugify(state.title)}.mandarinita`);
    toast('Archivo editable .mandarinita descargado.');
  }
  async function exportReview() {
    state.format = $('#export-preset').value; state.status = 'review'; autosave();
    const clone = captureState(); clone.selected = null;
    const title = state.title || 'Episodio nuevo'; const slug = slugify(title) || 'episodio-nuevo';
    const catalog = { schemaVersion: 1, editorialPolicy: 'manual-approval', episodes: [{ id: slug, title: { es: title }, episodeNumber: null, status: 'review', type: 'comic', complete: false, source: { kind: 'editor-draft', instagramMediaId: null, instagramPermalink: null }, panels: state.panels.map((panel, index) => ({ order: index + 1, alt: { es: `Viñeta ${index + 1} pendiente de revisión` }, src: `assets/episodes/drafts/${slug}/vineta-${String(index + 1).padStart(2, '0')}.png` })) }] };
    const files = [{ name: 'proyecto.json', data: new TextEncoder().encode(JSON.stringify(clone, null, 2)) }, { name: 'metadata-review.json', data: new TextEncoder().encode(JSON.stringify(catalog, null, 2)) }];
    for (let index = 0; index < state.panels.length; index++) { const image = await renderPanelPng(state.panels[index]); files.push({ name: `assets/episodes/drafts/${slug}/vineta-${String(index + 1).padStart(2, '0')}.png`, data: new Uint8Array(await image.arrayBuffer()) }); }
    download(zipStore(files), `${slug}-revision.zip`); toast('Paquete de revisión listo. El estado sigue pendiente de aprobación.');
  }
  function slugify(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function download(blob, filename) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }
  async function importProjectFile(file) {
    if (!file) return;
    try {
      let project;
      if (file.name.toLowerCase().endsWith('.json')) project = JSON.parse(await file.text());
      else project = JSON.parse(await readZipProject(await file.arrayBuffer()));
      state = normalizeProject(project); state.projectId = id(); state.title ||= file.name.replace(/\.(mandarinita|man|zip|json)$/i, ''); undoStack = []; redoStack = [];
      saveProject(); showEditor(); toast('Proyecto editable importado.');
    } catch (error) { console.error(error); toast('No pude abrir ese archivo. Importa un .mandarinita, ZIP del editor o proyecto JSON.'); }
  }
  function readZipProject(buffer) {
    const view = new DataView(buffer); const bytes = new Uint8Array(buffer); let offset = 0;
    while (offset + 30 < view.byteLength && view.getUint32(offset, true) === 0x04034b50) {
      const method = view.getUint16(offset + 8, true); const compressedSize = view.getUint32(offset + 18, true); const nameLength = view.getUint16(offset + 26, true); const extraLength = view.getUint16(offset + 28, true);
      const nameStart = offset + 30; const name = new TextDecoder().decode(bytes.slice(nameStart, nameStart + nameLength)); const dataStart = nameStart + nameLength + extraLength; const data = bytes.slice(dataStart, dataStart + compressedSize);
      if (['proyecto.json', 'project.json'].includes(name)) { if (method !== 0) throw new Error('ZIP compression is not supported yet'); return new TextDecoder().decode(data); }
      offset = dataStart + compressedSize;
    }
    throw new Error('No proyecto.json found in source archive');
  }

  function previewEpisode() {
    const dialog = $('#preview-dialog'); $('#preview-title').textContent = state.title;
    const list = $('#preview-panels'); list.innerHTML = '';
    state.panels.forEach((panel, index) => {
      const section = document.createElement('section'); section.className = 'preview-panel';
      section.innerHTML = `<strong>Viñeta ${index + 1}</strong><div class="preview-art"></div>`;
      const art = section.querySelector('.preview-art'); const h = state.pageHeight;
      art.style.aspectRatio = `600 / ${h}`;
      panel.items.forEach(item => {
        if (item.x + item.w <= 0 || item.y + item.h <= 0 || item.x >= LOGICAL_WIDTH || item.y >= h) return;
        const element = item.type === 'image' ? document.createElement('img') : document.createElement('div');
        if (item.type === 'image') { element.src = item.src; element.alt = item.name; }
        else if (item.type === 'bubble') { element.textContent = item.text; element.className = `preview-bubble bubble-${item.kind}`; }
        else { element.className = 'preview-stroke'; element.style.background = item.color; }
        element.style.left = `${item.x / LOGICAL_WIDTH * 100}%`; element.style.top = `${item.y / h * 100}%`;
        element.style.width = `${item.w / LOGICAL_WIDTH * 100}%`; element.style.height = `${item.h / h * 100}%`; art.append(element);
      });
      list.append(section);
    });
    dialog.showModal();
  }

  function installEvents() {
    $('#new-project').onclick = newProject;
    $('#import-project').onclick = () => $('#project-file').click();
    $('#project-file').onchange = event => importProjectFile(event.target.files[0]);
    $('#back-home').onclick = showHome;
    $('#save-project').onclick = () => { autosave(); toast('Guardado en este dispositivo.'); };
    $('#download-source').onclick = exportSource;
    $('#export-project').onclick = exportReview;
    $('#open-project').onclick = showHome;
    $('#project-title').addEventListener('input', event => { state.title = event.currentTarget.textContent; autosave(); });
    $('#add-panel').onclick = addPanel;
    $('#add-bubble').onclick = () => addBubble($('#bubble-kind').value);
    $('#preview').onclick = previewEpisode;
    $('#preview-dialog form').onsubmit = () => $('#preview-dialog').close();
    $('#export-preset').onchange = event => changeFormat(event.target.value);
    $('#toggle-grid').onclick = event => { state.grid = !state.grid; event.currentTarget.setAttribute('aria-pressed', String(state.grid)); render(); };
    $('#zoom-in').onclick = () => { state.zoom = Math.min(1.8, state.zoom + 0.1); render(); };
    $('#zoom-out').onclick = () => { state.zoom = Math.max(0.4, state.zoom - 0.1); render(); };
    $('#fit').onclick = () => { state.zoom = 1; render(); };
    $('#toggle-library').onclick = () => $('#app-shell').classList.toggle('library-collapsed');
    $('#toggle-layers').onclick = () => $('#app-shell').classList.toggle('inspector-collapsed');
    $('#mobile-library').onclick = () => $('#library-panel').classList.toggle('open');
    $('#mobile-properties').onclick = () => $('#inspector-panel').classList.toggle('open');
    $('#focus-mode').onclick = event => { const active = $('#app-shell').classList.toggle('focus-mode'); event.currentTarget.setAttribute('aria-pressed', String(active)); };
    $('#theme-toggle').onclick = () => { const dark = document.documentElement.classList.toggle('theme-dark'); localStorage.setItem('mandarinita-editor-theme', dark ? 'dark' : 'light'); };
    $('#undo').onclick = () => { if (!undoStack.length) return; redoStack.push(JSON.stringify(state)); state = JSON.parse(undoStack.pop()); commit(); };
    $('#redo').onclick = () => { if (!redoStack.length) return; undoStack.push(JSON.stringify(state)); state = JSON.parse(redoStack.pop()); commit(); };
    $('#upload-asset').onclick = () => $('#asset-file').click();
    $('#asset-file').onchange = async event => {
      const file = event.target.files[0]; if (!file) return;
      const data = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
      const resource = { name: file.name.replace(/\.[^.]+$/, ''), src: data, aliases: [], category: 'character', approvedCutout: true, variants: [{ name: 'Importado', src: data }] };
      addResource(resource); event.target.value = '';
    };
    $('#toggle-draw').onclick = event => { const enabled = event.currentTarget.getAttribute('aria-pressed') !== 'true'; setDrawMode(enabled); };
    $('#brush-type').onchange = event => { brushMode = event.target.value; };
    $('#color-palette').addEventListener('click', event => { if (event.target.matches('.color-swatch')) selectedColor = event.target.dataset.color; });
    canvas.addEventListener('pointerdown', beginDrawing); canvas.addEventListener('pointermove', continueDrawing); canvas.addEventListener('pointerup', finishDrawing); canvas.addEventListener('pointercancel', () => { drawing = null; });
    canvas.addEventListener('click', event => { if (event.target === canvas && $('#toggle-draw').getAttribute('aria-pressed') !== 'true') selectItem(null); });
    $('#project-list').addEventListener('click', event => {
      const filter = event.target.closest('[data-project-filter]');
      if (filter) { $$('.project-filter').forEach(button => button.classList.toggle('active', button === filter)); renderProjectList(filter.dataset.projectFilter); }
    });
    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); $('#undo').click(); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); $('#redo').click(); }
      if (event.key === 'Delete' && state?.selected && !['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) $('#delete')?.click();
      if (event.key === 'Escape') { $('#library-panel').classList.remove('open'); $('#inspector-panel').classList.remove('open'); }
    });
  }
  function setDrawMode(enabled) {
    $('#toggle-draw').setAttribute('aria-pressed', String(enabled)); $('#draw-toolbar').hidden = !enabled; render();
  }
  function installPalette() {
    const root = $('#color-palette');
    PALETTE.forEach(color => { const button = document.createElement('button'); button.className = 'color-swatch'; button.dataset.color = color; button.style.background = color; button.title = color; button.setAttribute('aria-label', `Trazo ${color}`); if (color === '#FFFFFF') button.classList.add('white-swatch'); root.append(button); });
    const custom = document.createElement('input'); custom.type = 'color'; custom.value = selectedColor; custom.setAttribute('aria-label', 'Elegir color'); custom.oninput = () => { selectedColor = custom.value; }; root.append(custom);
  }
  function crc32(bytes) { let crc = -1; for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); } return (crc ^ -1) >>> 0; }
  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

  migrateLegacyProject();
  if (localStorage.getItem('mandarinita-editor-theme') === 'dark') document.documentElement.classList.add('theme-dark');
  installEvents(); setupResourceFilters(); installPalette(); renderProjectList();
})();
