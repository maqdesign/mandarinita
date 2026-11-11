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
      { name: 'Pose completa · episodio 46.3', src: 'assets/characters/mando-transparent.webp' }
    ] },
    { name: 'Mandy Mandarinita', aliases: ['mandy', 'mandarinita'], variants: [
      { name: 'Pose completa aislada', src: 'assets/characters/mandy-transparent.webp' }
    ] },
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
  const stickers = [
    { name: 'Sticker frutal · 06', aliases: ['sticker 6', 'expresión frutal'], variants: [{ name: 'Sticker existente', src: 'assets/stickers/sticker-pack-06.webp' }], category: 'character', approvedCutout: true }
  ];
  const objects = [
    { name: 'Objeto · sobre', aliases: ['sobre', 'carta'], src: 'assets/art-envelope-2022.webp', category: 'object', approvedCutout: false, note: 'Ilustración completa, no es un recorte independiente.' },
    { name: 'Objeto · clip', aliases: ['clip', 'paperclip'], src: 'assets/art-paperclip-2022.webp', category: 'object', approvedCutout: false, note: 'Ilustración completa, no es un recorte independiente.' }
  ];
  const backgrounds = [
    { name: 'Sillón azul · episodio 9.1', aliases: ['mueble azul', 'sillon', 'sillón', 'sala', 'episodio 9'], src: 'assets/episodes/ep-009-la-cena/09.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; personajes, televisor, mesa, sombras y fondo siguen unidos.' },
    { name: 'Sofá azul · episodio 9.2', aliases: ['mueble azul', 'sofa', 'sofá', 'sala', 'episodio 9'], src: 'assets/episodes/ep-009-la-cena/09.2.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; personajes, globos, sofá y sombras siguen unidos.' },
    { name: 'Escena frente al televisor · episodio 19', aliases: ['televisor', 'tv', 'episodio 19'], src: 'assets/episodes/ep-019-noche-de-peliculas/19.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; personajes, globo, televisor y forma azul en primer plano siguen unidos.' },
    { name: 'Sofá azul · episodio 51', aliases: ['mueble azul', 'sofa', 'sofá', 'episodio 51'], src: 'assets/episodes/ep-051-tienes-hambre/51.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; personajes, globos, sofá y sombras siguen unidos.' },
    { name: 'Olla y fondo azul · episodio 52', aliases: ['olla', 'fondo azul', 'episodio 52'], src: 'assets/episodes/ep-052-fruitflix/52.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; olla, personajes, globos, fondo azul y marca siguen unidos.' },
    { name: 'Fila de supermercado · episodio 37', aliases: ['supermercado', 'carrito', 'fila', 'compra', 'episodio 37'], src: 'assets/episodes/ep-037-distanciamiento-social/37.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; fila, carrito, personajes y separador están aplanados en la misma lámina.' },
    { name: 'Cocina y fregadero · episodio 22', aliases: ['cocina', 'fregadero', 'gabinete', 'platos', 'episodio 22'], src: 'assets/episodes/ep-022-el-fregao/22.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; gabinete, fregadero, platos, personajes y bocetos siguen unidos.' },
    { name: 'Calle con autobús y lluvia · episodio 14', aliases: ['calle', 'autobús', 'bus', 'lluvia', 'episodio 14'], src: 'assets/episodes/ep-014-un-dia-malo/14.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; calle, lluvia, personajes y autobús siguen unidos.' },
    { name: 'Tienda y muebles · episodio 28', aliases: ['tienda', 'fachada', 'sofá amarillo', 'cajas', 'episodio 28'], src: 'assets/episodes/ep-028-trukea/28.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; fachada, interiores, personajes, sofá y cajas siguen unidos.' },
    { name: 'Dormitorio y cama · episodio 5', aliases: ['dormitorio', 'cama', 'sueño', 'descanso', 'episodio 5'], src: 'assets/episodes/ep-005-cinco-minutos-mas/05.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; cama, personaje y detalles del fondo siguen unidos.' },
    { name: 'Escritorio y silla giratoria · episodio 35', aliases: ['escritorio', 'silla', 'oficina', 'cucaracha', 'episodio 35'], src: 'assets/episodes/ep-035-la-cucaracha/35.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; escritorio, silla, personajes y matamoscas siguen unidos.' },
    { name: 'Trabajo remoto · episodio 44', aliases: ['trabajo', 'laptop', 'computadora', 'escritorio', 'episodio 44'], src: 'assets/episodes/ep-044-el-teletrabajo/44.1.png', category: 'background', approvedCutout: false, note: 'Referencia de escena completa; laptop, escritorio, silla, personaje y objetos siguen unidos.' }
  ];
  const resources = [...people, ...stickers, ...objects, ...backgrounds];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  let state = null;
  let undoStack = [];
  let redoStack = [];
  let resourceFilter = 'all';
  let referenceRecords = null;
  let referenceLoad = null;
  let referenceLoadFailed = false;
  let selectedColor = PALETTE[0];
  let brushMode = 'pen';
  let drawing = null;
  let drawingObjectId = null;
  let erasing = null;
  let pendingDeleteId = null;
  let panelDrag = null;
  let installPromptEvent = null;
  let suppressAssetClickUntil = 0;
  let pinchZoom = null;
  let cloudUser = null;
  let cloudConfigured = false;
  let cloudReady = false;
  let cloudAuthExpired = false;
  const cloudTimers = new Map();
  const cloudBases = new Map();
  const cloudConflicts = new Set();
  let pendingCloudConflict = null;

  // Small inline subset of the open-source Lucide icon set (ISC) keeps controls crisp offline.
  const ICON = {
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    bubble: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    up: '<path d="m18 15-6-6-6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.5-2"/>',
    pen: '<path d="m12 19 7-7 3 3-7 7-3-3zM18 13l-1.5-1.5M2 22l6-1 12-12a2.1 2.1 0 0 0-3-3L5 18z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    undo: '<path d="M3 7v6h6M21 17a9 9 0 0 0-15-6.7L3 13"/>', redo: '<path d="M21 7v6h-6M3 17a9 9 0 0 1 15-6.7l3 2.7"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    zoomIn: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>', zoomOut: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>',
    focus: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    board: '<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/>',
    fit: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M9 9h6v6H9z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    grip: '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>',
    eraser: '<path d="m7 21-4.3-4.3a2.4 2.4 0 0 1 0-3.4L13.3 2.7a2.4 2.4 0 0 1 3.4 0l4.6 4.6a2.4 2.4 0 0 1 0 3.4L11 21H7zM5 14l5 5M12 21h9"/>'
    ,marker: '<path d="m15 4 5 5M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20zM3 21h18"/>',
    pencil: '<path d="m15 5 4 4M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"/>',
    layersPlus: '<path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5M19 3v6M16 6h6"/>',
    text: '<path d="M4 6V4h16v2M12 4v16M8 20h8"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  };
  const svgIcon = (name, cls = 'ui-icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[name] || ICON.image}</svg>`;

  function id() { return crypto.randomUUID?.() || Math.random().toString(36).slice(2, 12); }
  function makeProject(title = 'Episodio nuevo', contentType = 'episode') {
    return { schemaVersion: 1, projectId: id(), title, contentType, status: 'draft', format: 'web', exportStyle: 'classic', pageHeight: 400, active: 0, selected: null, zoom: 1, grid: true, panels: [{ id: id(), items: [] }, { id: id(), items: [] }], createdAt: Date.now(), updatedAt: Date.now() };
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
    normalized.contentType ||= 'episode';
    normalized.format = FORMAT[normalized.format] ? normalized.format : 'web';
    normalized.exportStyle = ['classic','cream','footer'].includes(normalized.exportStyle) ? normalized.exportStyle : 'classic';
    normalized.pageHeight = normalized.pageHeight || FORMAT[normalized.format].logicalHeight;
    normalized.panels = Array.isArray(normalized.panels) && normalized.panels.length ? normalized.panels : [{ id: id(), items: [] }, { id: id(), items: [] }];
    normalized.panels.forEach(p => { p.id ||= id(); p.items ||= []; });
    normalized.active = Math.max(0, Math.min(Number(normalized.active) || 0, normalized.panels.length - 1));
    normalized.selected = null;
    return normalized;
  }
  function saveProject(project = state) {
    project.updatedAt = Math.max(Date.now(), Number(project.updatedAt)||0);
    const projectKey = PROJECT_KEY(project.projectId);
    const previousIndex = localStorage.getItem(PROJECTS_KEY);
    const index = listProjects().filter(p => p.id !== project.projectId);
    index.push({ id: project.projectId, title: project.title || 'Contenido sin título', contentType: project.contentType || 'episode', status: project.status || 'draft', createdAt: project.createdAt || Date.now(), updatedAt: project.updatedAt });
    index.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(index));
    try { localStorage.setItem(projectKey, JSON.stringify(project)); }
    catch (error) {
      try { if (previousIndex === null) localStorage.removeItem(PROJECTS_KEY); else localStorage.setItem(PROJECTS_KEY, previousIndex); } catch { /* Keep the original storage error visible to the caller. */ }
      throw error;
    }
    scheduleCloudSave(project);
  }
  function setCloudStatus(message = '', syncState = 'ready') {
    const button = $('#github-sync');
    if (!button) return;
    const signedIn = Boolean(cloudUser);
    button.textContent = signedIn ? (cloudAuthExpired ? 'Reconectar GitHub' : `Salir · ${cloudUser.login}`) : cloudConfigured ? 'Conectar GitHub' : 'Nube pendiente';
    button.classList.toggle('connected', signedIn);
    button.title = signedIn ? (cloudAuthExpired ? 'Volver a iniciar sesión con GitHub' : `Cerrar sesión de GitHub · ${cloudUser.login}`) : message || 'Conectar la cuenta privada de GitHub';
    button.setAttribute('aria-label', button.title);
    const text = message || (signedIn ? 'Sincronización al día' : 'Los borradores se guardan en este dispositivo.');
    ['#cloud-status','#editor-cloud-status'].forEach(selector => { const region=$(selector); if(region){region.textContent=text;region.dataset.state=syncState;} });
    ['#retry-cloud','#editor-retry-cloud'].forEach(selector => { const retry=$(selector); if(retry){retry.hidden=!(signedIn&&(syncState==='error'||cloudConflicts.size));retry.textContent=cloudConflicts.size?'Resolver conflicto':'Reintentar sincronización';} });
    const footnote = $('#home-footnote');
    if (footnote) footnote.textContent = signedIn
      ? 'Tus borradores se guardan en este dispositivo y se sincronizan con tu almacenamiento privado de GitHub.'
      : 'Tus borradores se guardan en este navegador. El archivo .mandarinita sirve para moverlos a otro dispositivo.';
  }
  async function cloudFetch(path, options = {}) {
    const response = await fetch(path, { ...options, credentials: 'same-origin', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
    let body = {};
    try { body = await response.json(); } catch { /* Surface status when a proxy returned a non-JSON response. */ }
    if (!response.ok) { const error=new Error(body.error || `Sincronización: ${response.status}`);error.status=response.status;error.code=body.code||'';throw error; }
    return body;
  }
  function loadCloudBases() {
    try { for (const [key,value] of Object.entries(JSON.parse(localStorage.getItem('mandarinita-editor-sync-bases-v1')||'{}'))) cloudBases.set(key,value); }
    catch { /* A bad local sync index must not prevent local drafts from opening. */ }
  }
  function saveCloudBase(projectId, etag, localUpdatedAt) {
    if (!etag) return;
    cloudBases.set(projectId,{etag,localUpdatedAt:Number(localUpdatedAt)||0});
    try { localStorage.setItem('mandarinita-editor-sync-bases-v1',JSON.stringify(Object.fromEntries(cloudBases))); }
    catch { /* The remote copy is still authoritative even if this tiny cache cannot persist. */ }
  }
  async function readRemoteProject(projectId) {
    const response=await fetch(`/api/projects/${encodeURIComponent(projectId)}`,{credentials:'same-origin',cache:'no-store'});
    if (!response.ok) { const error=new Error('No se pudo descargar la versión de la nube.');error.status=response.status;throw error; }
    return {project:await response.json(),etag:response.headers.get('ETag')};
  }
  async function pushCloudProject(project) {
    const base=cloudBases.get(project.projectId);
    const headers=base?.etag?{'If-Match':base.etag}:{'If-None-Match':'*'};
    const result=await cloudFetch(`/api/projects/${encodeURIComponent(project.projectId)}`,{method:'PUT',body:JSON.stringify(project),headers});
    saveCloudBase(project.projectId,result.etag||'',project.updatedAt);
    return result;
  }
  function setSyncFailure(error) {
    if(error?.status===401)cloudAuthExpired=true;
    const message=error?.status===401?'La sesión venció. Vuelve a conectar GitHub para sincronizar.'
      :error?.status===403?'Cloudflare rechazó la solicitud (403). Abre el taller desde mandarinita.art y vuelve a intentar.'
      :error?.status===413?'El archivo supera el límite de 25 MB; descarga el .mandarinita como respaldo.'
      :error?.status===428?'Esta versión del taller está desactualizada (428). Recarga la página para actualizarla; tu borrador local sigue guardado.'
      :error?.status>=500?`Cloudflare no pudo guardar el borrador (error ${error.status}). Sigue guardado en este dispositivo.`
      :Number.isInteger(error?.status)?`No se pudo sincronizar (error ${error.status}). El borrador sigue guardado en este dispositivo.`
      :'No se pudo conectar con la nube. El borrador sigue guardado en este dispositivo.';
    setCloudStatus(message,'error');
    if(state)$('#save-state').textContent='Guardado local · sincronización pendiente';
    toast(message);
  }
  function localProject(projectId) {
    if (state?.projectId===projectId) return captureState();
    try { return JSON.parse(localStorage.getItem(PROJECT_KEY(projectId))||'null'); } catch { return null; }
  }
  function markCloudConflict(projectId) {
    cloudConflicts.add(projectId);
    const local=localProject(projectId);
    const title=local?.title||'este proyecto';
    const message=`“${title}” también cambió en otro dispositivo. Tu copia local está segura; la nube no se sobrescribió.`;
    setCloudStatus(message,'conflict');
    if(state?.projectId===projectId)$('#save-state').textContent='Conflicto · copia local segura';
    toast(message);
  }
  function scheduleCloudSave(project) {
    if (!cloudUser || !cloudReady || !project?.projectId || cloudConflicts.has(project.projectId)) return;
    clearTimeout(cloudTimers.get(project.projectId));
    const snapshot = JSON.stringify(project);
    const timer = setTimeout(async () => {
      try {
        await pushCloudProject(JSON.parse(snapshot));
        if (state?.projectId === project.projectId) $('#save-state').textContent = 'Sincronizado con GitHub';
        setCloudStatus('Sincronización al día','ready');
      } catch (error) {
        if(error.status===412){markCloudConflict(project.projectId);return;}
        setSyncFailure(error);
      } finally { cloudTimers.delete(project.projectId); }
    }, 900);
    cloudTimers.set(project.projectId, timer);
  }
  function storeRemoteProject(project,etag) {
    validateEditableProject(project);
    const record = { id: project.projectId, title: project.title || 'Contenido sin título', contentType: project.contentType || 'episode', status: project.status || 'draft', createdAt: project.createdAt || Date.now(), updatedAt: Number(project.updatedAt) || Date.now() };
    const index = listProjects().filter(entry => entry.id !== project.projectId);
    index.push(record); index.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(PROJECT_KEY(project.projectId), JSON.stringify(project));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(index));
    saveCloudBase(project.projectId,etag,project.updatedAt);
  }
  async function syncCloudProjects() {
    if (!cloudUser || cloudReady) return;
    setCloudStatus('Sincronizando borradores…','busy');
    try {
      const { projects: remoteProjects } = await cloudFetch('/api/projects');
      const localProjects = listProjects();
      const remoteById = new Map(remoteProjects.map(project => [project.id, project]));
      for (const remote of remoteProjects) {
        let local;try { local=JSON.parse(localStorage.getItem(PROJECT_KEY(remote.id))||'null'); } catch { local=null; }
        if(!local){const latest=await readRemoteProject(remote.id);storeRemoteProject(latest.project,latest.etag||remote.etag);continue;}
        const base=cloudBases.get(remote.id);
        if(!base){
          const latest=await readRemoteProject(remote.id);
          if(JSON.stringify(local)===JSON.stringify(latest.project))saveCloudBase(remote.id,latest.etag,local.updatedAt);
          else markCloudConflict(remote.id);
        }else if(base.etag!==remote.etag){
          if(Number(local.updatedAt)>Number(base.localUpdatedAt))markCloudConflict(remote.id);
          else {const latest=await readRemoteProject(remote.id);storeRemoteProject(latest.project,latest.etag);}
        }else if(Number(local.updatedAt)>Number(base.localUpdatedAt)){
          cloudBases.set(remote.id,{etag:remote.etag,localUpdatedAt:Number(base.localUpdatedAt)||0});
          try{await pushCloudProject(local);}catch(error){if(error.status===412)markCloudConflict(remote.id);else throw error;}
        }else saveCloudBase(remote.id,remote.etag,local.updatedAt);
      }
      for (const record of localProjects) {
        if (!remoteById.has(record.id)) {
          const local=localProject(record.id);
          if(local)try{await pushCloudProject(local);}catch(error){if(error.status===412)markCloudConflict(record.id);else throw error;}
        }
      }
      cloudReady = true;
      setCloudStatus(cloudConflicts.size?'Hay versiones en conflicto. Revísalas antes de seguir.':'Sincronización al día',cloudConflicts.size?'conflict':'ready');
      renderProjectList();
    } catch (error) {
      cloudReady=false;setSyncFailure(error);
    }
  }
  function openCloudConflictDialog() {
    if(!cloudConflicts.size)return;
    pendingCloudConflict=cloudConflicts.values().next().value;
    const project=localProject(pendingCloudConflict);
    $('#cloud-conflict-title').textContent=`“${project?.title||'Este proyecto'}” cambió en otro dispositivo`;
    $('#cloud-conflict-dialog').showModal();
  }
  async function resolveCloudConflict(action) {
    const projectId=pendingCloudConflict;if(!projectId)return;
    const local=localProject(projectId);
    if(!local){toast('No encontré la copia local de este proyecto.');return;}
    if(action==='download'){downloadEditableProject(local);return;}
    try{
      const latest=await readRemoteProject(projectId);
      if(action==='cloud'){
        storeRemoteProject(latest.project,latest.etag);
        cloudConflicts.delete(projectId);pendingCloudConflict=null;$('#cloud-conflict-dialog').close();
        if(state?.projectId===projectId){state=normalizeProject(latest.project);showEditor();}else renderProjectList();
        setCloudStatus(cloudConflicts.size?'Hay otros proyectos en conflicto. Revísalos antes de seguir.':'Sincronización al día',cloudConflicts.size?'conflict':'ready');
        if(cloudConflicts.size)openCloudConflictDialog();
        return;
      }
      if(action==='overwrite'){
        if(!latest.etag)throw new Error('No recibí la versión actual de la nube; vuelve a sincronizar.');
        clearTimeout(cloudTimers.get(projectId));cloudBases.set(projectId,{etag:latest.etag,localUpdatedAt:cloudBases.get(projectId)?.localUpdatedAt||0});
        await pushCloudProject(local);
        cloudConflicts.delete(projectId);pendingCloudConflict=null;$('#cloud-conflict-dialog').close();
        if(state?.projectId===projectId)$('#save-state').textContent='Sincronizado con GitHub';
        setCloudStatus(cloudConflicts.size?'Hay otros proyectos en conflicto. Revísalos antes de seguir.':'Sincronización al día',cloudConflicts.size?'conflict':'ready');
        if(cloudConflicts.size)openCloudConflictDialog();
      }
    }catch(error){
      if(error.status===412){markCloudConflict(projectId);return;}
      setSyncFailure(error);
    }
  }
  async function retryCloudSync() {
    if(cloudConflicts.size){openCloudConflictDialog();return;}
    cloudReady=false;setCloudStatus('Revisando cambios…','busy');await syncCloudProjects();
  }
  async function setupCloudSync() {
    const button = $('#github-sync');
    button.onclick = async () => {
      if (cloudAuthExpired) { window.location.assign('/api/auth/github'); return; }
      if (cloudUser) {
        try { await cloudFetch('/api/auth/logout', { method: 'POST' }); } catch { /* The server may already have ended the session. */ }
        cloudUser = null; cloudReady = false; cloudAuthExpired=false; setCloudStatus('Sesión cerrada. Los borradores locales permanecen en este dispositivo.','signed-out'); toast('Sesión de GitHub cerrada.'); return;
      }
      if (!cloudConfigured) { toast('La sincronización requiere configurar OAuth de GitHub y almacenamiento R2 en Cloudflare.'); return; }
      window.location.assign('/api/auth/github');
    };
    $('#retry-cloud').onclick=retryCloudSync;$('#editor-retry-cloud').onclick=retryCloudSync;
    $('#conflict-download-local').onclick=()=>resolveCloudConflict('download');
    $('#conflict-use-cloud').onclick=()=>resolveCloudConflict('cloud');
    $('#conflict-overwrite-cloud').onclick=()=>resolveCloudConflict('overwrite');
    $('#conflict-later').onclick=()=>{$('#cloud-conflict-dialog').close();pendingCloudConflict=null;};
    $('#cloud-conflict-dialog').addEventListener('close',()=>{pendingCloudConflict=null;});
    loadCloudBases();
    try {
      const session = await cloudFetch('/api/auth/session');
      cloudConfigured = session.configured;
      cloudUser = session.user;
      cloudAuthExpired=false;
      if (cloudUser) await syncCloudProjects();
      else setCloudStatus(cloudConfigured ? 'Conecta GitHub para sincronizar tus borradores.' : 'Sincronización sin configurar.','signed-out');
    } catch (error) {
      cloudConfigured = false;
      setCloudStatus(error.message||'No se pudo consultar la sesión.','error');
    }
    const result = new URLSearchParams(location.search).get('github');
    if (result === 'connected') toast('GitHub conectado. Los proyectos se están sincronizando.');
    else if (result === 'not-authorized') toast('La cuenta no tiene el correo autorizado para este taller.');
    else if (result === 'cancelled') toast('Se canceló el inicio de sesión.');
    if (result) history.replaceState({}, '', location.pathname + location.hash);
  }
  function autosave() {
    try {
      state.format = $('#export-preset').value;
      state.exportStyle = $('#export-style')?.value || state.exportStyle || 'classic';
      state.updatedAt = Math.max(Date.now(),(Number(state.updatedAt)||0)+1);
      saveProject();
      $('#save-state').textContent = `Guardado local · ${new Date(state.updatedAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`;
      return true;
    } catch {
      if (cloudUser && cloudReady) {
        scheduleCloudSave(state);
        $('#save-state').textContent = 'Almacenamiento local lleno · copia en la nube pendiente';
        toast('No cupo en este dispositivo. Intento conservar el borrador en tu nube privada.');
        return true;
      }
      $('#save-state').textContent = 'Espacio local lleno · descarga el .mandarinita';
      toast('No cupo en el almacenamiento local. Descarga el archivo editable para conservarlo.');
      return false;
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
  function activeCanvas() { return $('#stage .artboard-canvas[data-panel-index="' + state.active + '"]'); }
  function canvasScale(target = activeCanvas()) { return target ? target.getBoundingClientRect().width / LOGICAL_WIDTH : 1; }
  function isFullyOffstage(item) { return item.x + item.w <= 0 || item.y + item.h <= 0 || item.x >= LOGICAL_WIDTH || item.y >= state.pageHeight; }
  function setActivePanel(index, clearSelection = false) {
    if (index < 0 || index >= state.panels.length) return;
    if (index !== state.active && drawingObjectId) finishDrawingObject();
    state.active = index; if (clearSelection) state.selected = null;
    $('#current-panel-label').textContent = `VIÑETA ${index + 1}`;
    $$('.artboard-wrap').forEach((element, i) => element.classList.toggle('active', i === index));
    renderPanels(); renderInspector(); renderLayers(); renderOffstage();
  }
  function isOffstage(item) { return item.x < 0 || item.y < 0 || item.x + item.w > LOGICAL_WIDTH || item.y + item.h > state.pageHeight; }
  function formatBounds(format = state.format) { return { width: LOGICAL_WIDTH, height: FORMAT[format].logicalHeight }; }
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  const atlasSearchTranslations = new Map([
    ['mueble azul', ['sofa', 'couch']], ['sillon', ['sofa', 'couch']], ['sofa', ['sofa', 'couch']], ['sala', ['living room', 'sofa']],
    ['televisor', ['television', 'tv']], ['vehiculo', ['vehicle', 'bus', 'car']], ['autobus', ['bus']], ['carro', ['car', 'vehicle']],
    ['olla', ['pot']], ['fondo', ['background', 'scene']], ['muebles', ['furniture', 'sofa']],
    ['de pie', ['standing']], ['sentado', ['seated']], ['sentada', ['seated']], ['sentados', ['seated']], ['sentadas', ['seated']],
    ['corriendo', ['running']], ['corre', ['running']], ['caminando', ['walking']], ['cayendo', ['falling', 'tilting']], ['acostado', ['lying']], ['acostada', ['lying']],
    ['hablando', ['speaking', 'talking']], ['gritando', ['shouting']], ['sonrisa', ['smiling', 'smile']], ['sonriendo', ['smiling', 'smile']], ['feliz', ['smiling', 'smile']], ['alegre', ['smiling', 'smile']], ['contento', ['smiling', 'smile']],
    ['muy feliz', ['smiling', 'smile']], ['muy alegre', ['smiling', 'smile']], ['sorprendido', ['surprised', 'startled', 'wide eyes', 'wide-eyed']], ['sorprendida', ['surprised', 'startled', 'wide eyes', 'wide-eyed']], ['sorpresa', ['surprised', 'startled', 'wide eyes', 'wide-eyed']], ['asustado', ['startled', 'wide eyes']], ['asustada', ['startled', 'wide eyes']],
    ['enojado', ['furrowed brows', 'brows lowered', 'narrowed brows']], ['enojada', ['furrowed brows', 'brows lowered', 'narrowed brows']], ['enfadado', ['furrowed brows', 'brows lowered', 'narrowed brows']], ['enfadada', ['furrowed brows', 'brows lowered', 'narrowed brows']], ['ceño fruncido', ['furrowed brows', 'brows lowered', 'narrowed brows']],
    ['ojos cerrados', ['eyes closed']], ['ojos abiertos', ['eyes open', 'wide eyes']], ['boca abierta', ['open mouth', 'mouth open']], ['bigote', ['moustache']], ['hoja', ['leaf']]
  ]);
  function normalizeAtlasSearch(value) { return String(value).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function matchesReferenceSearch(reference, query) {
    const text = normalizeAtlasSearch(`${reference.characterName} ${reference.aliases.join(' ')} ${reference.episodeNumber} ${reference.panelName} ${reference.pose} ${reference.expression} ${reference.searchDescription || ''}`);
    if (!query) return true;
    const normalized = normalizeAtlasSearch(query);
    if (text.includes(normalized)) return true;
    const groups = [];
    let remainder = normalized;
    for (const [phrase, translations] of [...atlasSearchTranslations].sort((a, b) => b[0].length - a[0].length)) {
      const key = normalizeAtlasSearch(phrase);
      if (!remainder.includes(key)) continue;
      groups.push(translations.map(normalizeAtlasSearch));
      remainder = remainder.replace(key, ' ');
    }
    const stopWords = new Set(['de', 'del', 'el', 'la', 'las', 'los', 'en', 'con', 'y', 'a', 'al', 'un', 'una', 'unos', 'unas', 'por']);
    for (const word of remainder.split(/[^\p{L}\p{N}]+/u).filter(token => token && !stopWords.has(token))) groups.push([word]);
    return groups.length > 0 && groups.every(group => group.some(term => text.includes(term)));
  }
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
      list.innerHTML = `<div class="home-empty">${svgIcon('image','home-empty-icon')}<b>Aquí aparecerán tus borradores</b><p>Crea un episodio, copy, banner o sección web. Todo queda editable en este dispositivo.</p></div>`;
      return;
    }
    projects.forEach(record => {
      let project; try { project = JSON.parse(localStorage.getItem(PROJECT_KEY(record.id)) || '{}'); } catch { project = {}; }
      const card = document.createElement('article'); card.className = 'project-card';
      const preview = document.createElement('div'); preview.className = 'project-card-preview'; preview.setAttribute('aria-hidden','true');
      const pageHeight = Number(project.pageHeight) || 400;
      const previewCanvas = document.createElement('div'); previewCanvas.className = 'project-preview-canvas';
      previewCanvas.style.aspectRatio = `${LOGICAL_WIDTH} / ${pageHeight}`;
      const firstPanel = project.panels?.[0];
      (firstPanel?.items || []).slice(0,8).forEach(item => {
        const layer = document.createElement('div'); layer.className = `project-preview-item ${item.type === 'bubble' ? `preview-${item.kind}` : ''}`;
        layer.style.left = `${item.x/LOGICAL_WIDTH*100}%`; layer.style.top = `${item.y/pageHeight*100}%`;
        layer.style.width = `${Math.max(1,item.w/LOGICAL_WIDTH*100)}%`; layer.style.height = `${Math.max(1,item.h/pageHeight*100)}%`;
        layer.style.transform = `rotate(${item.rotation || 0}deg) scale(${item.flipX ? -1 : 1},${item.flipY ? -1 : 1})`;
        if (item.type === 'image') { const image = document.createElement('img'); image.src = item.src; image.alt = ''; image.style.filter = item.blur ? `blur(${item.blur}px)` : ''; layer.append(image); }
        else if (item.type === 'bubble' || item.type === 'text') { layer.textContent = item.text || ''; if(item.type==='text')layer.classList.add('preview-text'); }
        else { const stroke = document.createElement('span'); stroke.style.cssText = `position:absolute;inset:0;background:linear-gradient(135deg,transparent 46%,${item.color || '#282522'} 48%,${item.color || '#282522'} 52%,transparent 54%)`; layer.append(stroke); }
        previewCanvas.append(layer);
      });
      preview.append(previewCanvas);
      const main = document.createElement('div'); main.className = 'project-card-main';
      const reviewState = record.status === 'review';
      const kindLabels = {episode:'Episodio',copy:'Texto / copy',banner:'Banner',section:'Sección web'};
      const isEpisode = (project.contentType || record.contentType || 'episode') === 'episode';
      main.innerHTML = `<strong>${escapeHTML(record.title)}</strong><span class="status-pill ${reviewState ? 'ready' : ''}">${reviewState ? 'En revisión' : 'Borrador'}</span><small>${kindLabels[project.contentType || record.contentType || 'episode'] || 'Contenido'} · ${isEpisode ? `${project.panels?.length || 0} viñetas · ` : ''}Modificado ${new Date(record.updatedAt).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })}</small>`;
      const open = document.createElement('button'); open.type = 'button'; open.className = 'project-card-open'; open.setAttribute('aria-label',`Abrir ${record.title}`); open.append(preview,main); open.onclick = () => openProject(record.id);
      const menu = document.createElement('details'); menu.className = 'project-card-menu';
      menu.innerHTML = `<summary aria-label="Más opciones para ${escapeHTML(record.title)}">${svgIcon('more')}</summary><div class="project-menu-popover"><button type="button" data-action="duplicate">Duplicar archivo</button><button type="button" data-action="delete" class="danger">Borrar archivo</button></div>`;
      menu.addEventListener('click', event => event.stopPropagation());
      menu.querySelector('[data-action="duplicate"]').onclick = () => { menu.open = false; duplicateProject(record.id); };
      menu.querySelector('[data-action="delete"]').onclick = () => { menu.open = false; requestDeleteProject(record.id); };
      card.append(open,menu);
      list.append(card);
    });
  }
  function openProject(projectId) {
    try {
      state = normalizeProject(JSON.parse(localStorage.getItem(PROJECT_KEY(projectId))));
      undoStack = []; redoStack = []; showEditor();
    } catch { toast('No pude abrir ese proyecto local. Prueba importar su archivo .mandarinita.'); }
  }
  function newProject() {
    $('#new-content-dialog').showModal();
  }
  function createProjectFromTemplate(key) {
    const templates = { strip: { format:'web', panels:3 }, carousel: { format:'portrait', panels:4 }, square: { format:'square', panels:4 }, blank: { format:'web', panels:2 } };
    const template = templates[key] || templates.blank; state = makeProject('Episodio nuevo','episode'); state.format = template.format; state.pageHeight = FORMAT[template.format].logicalHeight;
    state.panels = Array.from({length:template.panels},() => ({id:id(),items:[]})); undoStack = []; redoStack = [];
    try { saveProject(); showEditor(); } catch { showEditor(); toast('Este navegador no permitió guardar automáticamente. Descarga el .mandarinita.'); }
  }
  function createContentDraft(type) {
    if(type==='episode'){ $('#template-dialog').showModal(); return; }
    const presets={copy:{title:'Texto o copy nuevo',label:'Escribe el texto o copy aquí…'},banner:{title:'Banner nuevo',label:'Escribe el titular del banner…'},section:{title:'Sección web nueva',label:'Escribe el título de la sección…'}};
    const preset=presets[type]||presets.copy; state=makeProject(preset.title,type); state.panels=[{id:id(),items:[]}]; undoStack=[];redoStack=[];
    const item={id:id(),type:'text',name:preset.title,text:preset.label,x:80,y:105,w:440,h:150,fontSize:32,fontWeight:600,align:'center',color:'#292725',rotation:0,locked:false};state.panels[0].items.push(item);state.selected=item.id;
    try{saveProject();showEditor();}catch{showEditor();toast('Este navegador no permitió guardar automáticamente. Descarga el archivo editable.');}
  }
  function duplicateProject(projectId) {
    try {
      const source = JSON.parse(localStorage.getItem(PROJECT_KEY(projectId)));
      const copy = normalizeProject({ ...source, projectId: id(), title: `${source.title} · copia`, createdAt: Date.now(), updatedAt: Date.now() });
      saveProject(copy); renderProjectList();
    } catch { toast('No pude duplicar ese proyecto.'); }
  }
  function requestDeleteProject(projectId) {
    const record = listProjects().find(p => p.id === projectId); if (!record) return;
    pendingDeleteId = projectId; $('#delete-title').textContent = `¿Borrar “${record.title}”?`; $('#delete-project-dialog').showModal();
  }
  function deleteProject(projectId) {
    localStorage.removeItem(PROJECT_KEY(projectId));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(listProjects().filter(p => p.id !== projectId)));
    if (cloudUser) cloudFetch(`/api/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' }).catch(() => toast('Se borró en este dispositivo; no pude borrar la copia en la nube.'));
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
  function addResource(resource, variantIndex = 0, position = null) {
    if (!resource.approvedCutout) { toast(resource.note || 'Este archivo es una referencia de escena, no un componente aislado.'); return; }
    const variant = resource.variants?.[variantIndex] || resource;
    const isSticker = variant.src.includes('sticker-pack');
    const width = isSticker ? 130 : 150;
    const height = isSticker ? 130 : 160;
    const pos = position || placeWithoutOverlap(width, height);
    snapshot();
    const item = { id: id(), type: 'image', name: resource.name, resourceId: resource.name, category: resource.category, aliases: resource.aliases || [], src: variant.src, variants: resource.variants || null, variantIndex, x: pos.x, y: pos.y, w: width, h: height, rotation: 0, locked: false };
    currentPanel().items.push(item); selectItem(item.id); commit();
  }
  function dropResourceAt(resource, panelIndex, boardCanvas, clientX, clientY) {
    const rect = boardCanvas.getBoundingClientRect(); const scale = rect.width / LOGICAL_WIDTH;
    setActivePanel(panelIndex, true);
    addResource(resource, 0, { x: (clientX - rect.left) / scale - 75, y: (clientY - rect.top) / scale - 80 });
  }
  function addBubble(kind = 'dialogue') {
    const size = kind === 'sfx' ? { w: 210, h: 110 } : kind === 'narration' ? { w: 230, h: 105 } : { w: 210, h: 105 };
    const pos = placeWithoutOverlap(size.w, size.h);
    snapshot();
    const labels = { dialogue: 'Diálogo', thought: 'Pensamiento', narration: 'Narración', shout: 'Voz fuerte', sfx: 'Efecto' };
    const item = { id: id(), type: 'bubble', kind, name: kind === 'sfx' ? 'Efecto de sonido' : `Globo · ${labels[kind]}`, text: kind === 'sfx' ? 'POW!' : 'Escribe aquí…', ...pos, ...size, fontSize: kind === 'sfx' ? 42 : kind === 'shout' ? 24 : 17, align: 'center', shape:'auto', tail: ['dialogue', 'shout', 'thought'].includes(kind), tailAngle: 90, tailLength: 34, actionStyle: 'raised', overflow: 'auto', locked: false };
    currentPanel().items.push(item); selectItem(item.id); commit();
  }
  function addTextBlock(text='Escribe aquí…') {
    const pos=placeWithoutOverlap(360,100);snapshot();const item={id:id(),type:'text',name:'Texto',text,x:pos.x,y:pos.y,w:360,h:100,fontSize:28,fontWeight:600,align:'center',color:'#292725',rotation:0,locked:false};currentPanel().items.push(item);selectItem(item.id);commit();
  }
  function updateBubbleAccessories(item, element) {
    element.querySelectorAll('.bubble-tail-svg,.thought-dot').forEach(node => node.remove());
    if (!item.tail || !['dialogue','shout','thought'].includes(item.kind)) return;
    const angle = (item.tailAngle ?? 90) * Math.PI / 180; const ux = Math.cos(angle); const uy = Math.sin(angle);
    const cx = item.w / 2; const cy = item.h / 2; const rx = item.w * .49; const ry = item.h * .49;
    const form = getBubbleForm(item); const denominator = form === 'rounded' ? Math.max(Math.abs(ux)/rx,Math.abs(uy)/ry) : Math.sqrt((ux * ux) / (rx * rx) + (uy * uy) / (ry * ry));
    const bx = cx + ux / denominator; const by = cy + uy / denominator; const length = item.tailLength ?? 34;
    if (item.kind === 'thought') {
      [14,9,5].forEach((diameter,index) => {
        const t = [.34,.62,.86][index]; const dot = document.createElement('span'); dot.className = 'thought-dot';
        dot.style.width = `${diameter}px`; dot.style.height = `${diameter}px`; dot.style.left = `${bx + ux * length * t - diameter/2}px`; dot.style.top = `${by + uy * length * t - diameter/2}px`; element.append(dot);
      });
      return;
    }
    const tx = -uy; const ty = ux; const half = Math.max(6, Math.min(13, item.w * .045)); const tipX = bx + ux * length; const tipY = by + uy * length;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.classList.add('bubble-tail-svg'); svg.setAttribute('viewBox',`0 0 ${item.w} ${item.h}`); svg.setAttribute('aria-hidden','true');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d',`M${bx-tx*half} ${by-ty*half} L${tipX} ${tipY} L${bx+tx*half} ${by+ty*half}`); path.setAttribute('fill','#fff'); path.setAttribute('stroke','#292725'); path.setAttribute('stroke-width','2'); path.setAttribute('stroke-linejoin','round'); svg.append(path); element.append(svg);
  }
  function getBubbleForm(item) {
    if (item.shape === 'oval' || item.kind === 'thought') return 'oval';
    if (item.shape === 'rounded' || item.kind === 'narration') return 'rounded';
    const font = item.fontSize || 17; const estimate = Math.max(8,item.w/(font*.56));
    const lines = String(item.text||'').split('\n').reduce((sum,line)=>sum+Math.max(1,Math.ceil(line.length/estimate)),0);
    return lines <= 1 && item.w / Math.max(1,item.h) >= 1.35 ? 'oval' : 'rounded';
  }
  function applyBubbleShape(item, element) {
    element.classList.toggle('bubble-shape-oval',getBubbleForm(item)==='oval');
    element.classList.toggle('bubble-shape-rounded',getBubbleForm(item)==='rounded');
  }
  function styleBubbleText(item, textarea) {
    textarea.style.fontSize = `${item.kind === 'shout' ? Math.max(24,item.fontSize || 24) : item.kind === 'sfx' ? Math.max(30,item.fontSize || 42) : item.fontSize || 17}px`;
    textarea.style.fontWeight = item.kind === 'shout' || item.kind === 'sfx' ? '700' : '500';
    textarea.style.textAlign = item.align || 'center'; textarea.style.overflow = item.overflow || 'auto';
    textarea.style.textTransform = item.kind === 'shout' || item.kind === 'sfx' ? 'uppercase' : 'none';
    textarea.dataset.kind = item.kind;
    if (item.kind === 'sfx') textarea.dataset.style = item.actionStyle || 'raised';
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
  function closeCanvasContextMenu() { const menu = $('#canvas-context-menu'); if (menu) menu.hidden = true; }
  function openCanvasContextMenu(item, panelIndex, x, y) {
    if ($('#toggle-draw').getAttribute('aria-pressed') === 'true') return;
    if (state.active !== panelIndex) setActivePanel(panelIndex, true);
    selectItem(item.id);
    const menu = $('#canvas-context-menu');
    const actions = [];
    const characterResource = item.type === 'image' && (item.category === 'character' || resources.some(resource => resource.name === item.resourceId && resource.category === 'character'));
    if (characterResource) actions.push(['replace', 'Sustituir personaje']);
    if (['image','drawing'].includes(item.type)) { actions.push(['flip-x', 'Voltear horizontalmente']); actions.push(['flip-y', 'Voltear verticalmente']); }
    if (isOffstage(item)) actions.push(['recover', 'Recuperar al lienzo']);
    actions.push(['duplicate', 'Duplicar elemento'], ['lock', item.locked ? 'Desbloquear' : 'Bloquear elemento'], ['delete', 'Borrar elemento']);
    menu.innerHTML = actions.map(([action,label]) => `<button type="button" role="menuitem" data-context-action="${action}"${action === 'delete' ? ' class="danger"' : ''}>${label}</button>`).join('');
    menu.hidden = false;
    const width = menu.offsetWidth; const height = menu.offsetHeight;
    menu.style.left = `${Math.max(8,Math.min(x,window.innerWidth-width-8))}px`;
    menu.style.top = `${Math.max(8,Math.min(y,window.innerHeight-height-8))}px`;
    menu.querySelector('button')?.focus();
    menu.querySelectorAll('[data-context-action]').forEach(button => button.onclick = () => {
      const action = button.dataset.contextAction; closeCanvasContextMenu();
      if (action === 'replace') { openCharacterPicker(item.id); return; }
      if (action === 'recover') { recoverItem(item.id); return; }
      if (action === 'duplicate') { snapshot(); const copy = { ...item, id: id(), x: item.x + 24, y: item.y + 24, name: `${item.name} · copia` }; currentPanel().items.push(copy); selectItem(copy.id); commit(); return; }
      if (action === 'lock') { snapshot(); item.locked = !item.locked; commit(); return; }
      if (action === 'flip-x' || action === 'flip-y') { snapshot(); item[action === 'flip-x' ? 'flipX' : 'flipY'] = !item[action === 'flip-x' ? 'flipX' : 'flipY']; commit(); return; }
      if (action === 'delete') { snapshot(); currentPanel().items = currentPanel().items.filter(entry => entry.id !== item.id); state.selected = null; commit(); }
    });
  }
  function render() {
    const stage = $('#stage'); const viewport = $('#stage-wrap');
    const savedScroll = viewport ? { left: viewport.scrollLeft, top: viewport.scrollTop } : null;
    stage.innerHTML = '';
    const available = Math.max(300, stage.clientWidth || stage.parentElement.clientWidth || window.innerWidth - 32);
    const gap = 14;
    const baseColumns = Math.max(1, Math.floor((available + gap) / 300));
    const baseCell = (available - (baseColumns - 1) * gap) / baseColumns;
    const fitScale = Math.min(1, Math.max(.2, (baseCell - 18) / LOGICAL_WIDTH));
    const scale = fitScale * (state.zoom || 1);
    const tileWidth = LOGICAL_WIDTH * scale + 18;
    const columns = Math.max(1, Math.floor((available + gap) / (tileWidth + gap)));
    const cellWidth = (available - (columns - 1) * gap) / columns;
    stage.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    $('#zoom-label').textContent = `${Math.round(scale * 100)}%`;
    $('#project-title').textContent = state.title || 'Episodio nuevo';
    $('#export-preset').value = state.format;
    $('#export-style').value = state.exportStyle || 'classic';
    $('#add-cta-panel').hidden = state.contentType !== 'episode';
    renderPanels();
    state.panels.forEach((panel, panelIndex) => {
      const wrapper = document.createElement('section'); wrapper.className = `artboard-wrap${panelIndex === state.active ? ' active' : ''}`; wrapper.dataset.panelIndex = panelIndex; wrapper.style.setProperty('--artboard-scale', scale);
      const heading = document.createElement('div'); heading.className = 'artboard-heading';
      const activate = document.createElement('button'); activate.className = 'artboard-title'; activate.innerHTML = `<strong>Viñeta ${panelIndex + 1}</strong><span>${panel.items.length} capas</span>`; activate.onclick = () => setActivePanel(panelIndex, true);
      heading.append(activate); wrapper.append(heading);
      const artboard = document.createElement('div'); artboard.className = 'artboard-frame';
      artboard.style.width = `${LOGICAL_WIDTH * scale}px`; artboard.style.height = `${state.pageHeight * scale}px`;
      const boardCanvas = document.createElement('div'); boardCanvas.className = 'canvas artboard-canvas'; boardCanvas.dataset.panelIndex = panelIndex;
      if (panel.backgroundColor) boardCanvas.style.backgroundColor = panel.backgroundColor;
      boardCanvas.setAttribute('role','application'); boardCanvas.setAttribute('aria-label',`Lienzo de viñeta ${panelIndex + 1}`);
      boardCanvas.style.width = `${LOGICAL_WIDTH}px`; boardCanvas.style.height = `${state.pageHeight}px`; boardCanvas.style.transform = `scale(${scale})`;
      boardCanvas.classList.toggle('grid-off', !state.grid); boardCanvas.classList.toggle('draw-active', $('#toggle-draw').getAttribute('aria-pressed') === 'true');
      boardCanvas.addEventListener('pointerdown', beginDrawing); boardCanvas.addEventListener('pointermove', continueDrawing); boardCanvas.addEventListener('pointerup', finishDrawing); boardCanvas.addEventListener('pointercancel', cancelDrawing);
      boardCanvas.addEventListener('dragover', event => { if (event.dataTransfer?.types.includes('application/x-mandarinita-resource')) { event.preventDefault(); boardCanvas.classList.add('drop-target'); } });
      boardCanvas.addEventListener('dragleave', event => { if (!boardCanvas.contains(event.relatedTarget)) boardCanvas.classList.remove('drop-target'); });
      boardCanvas.addEventListener('drop', event => {
        const resourceName = event.dataTransfer?.getData('application/x-mandarinita-resource');
        const resource = resources.find(entry => entry.name === resourceName && entry.approvedCutout);
        if (!resource) return;
        event.preventDefault(); boardCanvas.classList.remove('drop-target'); suppressAssetClickUntil = Date.now() + 800;
        dropResourceAt(resource,panelIndex,boardCanvas,event.clientX,event.clientY);
      });
      boardCanvas.addEventListener('click', event => { if (event.target === boardCanvas) { setActivePanel(panelIndex); if ($('#toggle-draw').getAttribute('aria-pressed') !== 'true') selectItem(null); } });
      artboard.append(boardCanvas); wrapper.append(artboard); stage.append(wrapper);
      panel.items.forEach((item, index) => renderItem(item, index, panelIndex, boardCanvas));
    });
    $('#current-panel-label').textContent = `VIÑETA ${state.active + 1}`;
    renderInspector(); renderLayers(); renderOffstage();
    if (savedScroll && viewport) { viewport.scrollLeft = savedScroll.left; viewport.scrollTop = savedScroll.top; }
  }
  function renderPanels() {
    const list = $('#panel-list'); list.innerHTML = '';
    state.panels.forEach((panel, index) => {
      const card = document.createElement('div'); card.className = 'panel-card';
      const button = document.createElement('button'); button.className = `panel-thumb${index === state.active ? ' active' : ''}`;
      button.innerHTML = `<span class="panel-number">${index + 1}</span>Viñeta<span class="mini-count">${panel.items.length} capas</span>`;
      button.onclick = () => setActivePanel(index, true);
      const drag = document.createElement('button'); drag.className = 'panel-drag-handle'; drag.type = 'button'; drag.innerHTML = svgIcon('grip'); drag.setAttribute('aria-label', `Arrastrar viñeta ${index + 1} para cambiar el orden`);
      drag.onpointerdown = event => { event.preventDefault(); panelDrag = { from: index, pointerId: event.pointerId }; drag.setPointerCapture(event.pointerId); card.classList.add('dragging'); };
      drag.onpointerup = event => {
        if (!panelDrag || panelDrag.pointerId !== event.pointerId) return;
        drag.releasePointerCapture(event.pointerId); card.classList.remove('dragging');
        const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.panel-card');
        const to = target ? Number(target.dataset.panelIndex) : panelDrag.from; const from = panelDrag.from; panelDrag = null;
        if (Number.isInteger(to) && to !== from) movePanel(from, to);
      };
      drag.onpointercancel = () => { panelDrag = null; card.classList.remove('dragging'); };
      const up = document.createElement('button'); const down = document.createElement('button');
      up.className = down.className = 'panel-move';
      up.innerHTML = svgIcon('up'); down.innerHTML = svgIcon('down');
      up.setAttribute('aria-label', `Mover viñeta ${index + 1} antes`); down.setAttribute('aria-label', `Mover viñeta ${index + 1} después`);
      up.disabled = index === 0; down.disabled = index === state.panels.length - 1;
      up.onclick = () => movePanel(index, index - 1); down.onclick = () => movePanel(index, index + 1);
      card.dataset.panelIndex = index; card.append(drag, button, up, down); list.append(card);
    });
  }
  function renderItem(item, index, panelIndex, boardCanvas) {
    const element = document.createElement('div');
    element.className = `placed${state.selected === item.id ? ' selected' : ''}${item.type === 'bubble' ? ` bubble bubble-${item.kind}${item.tail ? ' has-tail' : ''}` : ''}${item.type === 'drawing' ? ' drawing' : ''}${isFullyOffstage(item) ? ' offstage' : ''}`;
    element.dataset.id = item.id;
    element.style.cssText = `left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;transform:rotate(${item.rotation || 0}deg) scale(${item.flipX ? -1 : 1},${item.flipY ? -1 : 1});--tail-x:${item.tailX ?? 28}%;z-index:${index + 1};`;
    if (item.type === 'image') {
      const img = document.createElement('img'); img.src = item.src; img.alt = item.name; img.style.filter = item.blur ? `blur(${item.blur}px)` : ''; element.append(img);
    } else if (item.type === 'drawing') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${item.w} ${item.h}`); svg.setAttribute('aria-label', item.name);
      const strokes = item.strokes?.length ? item.strokes : [{ path:item.path, color:item.color, strokeWidth:item.strokeWidth, opacity:item.opacity, brush:'pen', closed:false }];
      strokes.forEach(stroke => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = stroke.path;
        if (stroke.points?.length) d = stroke.points.map((point,i) => `${i ? 'L' : 'M'}${(point.x-item.x).toFixed(1)},${(point.y-item.y).toFixed(1)}`).join(' ') + (stroke.closed ? ' Z' : '');
        path.setAttribute('d',d); path.setAttribute('fill',item.fillEnabled && stroke.closed ? item.fillColor || '#F87209' : 'none'); path.setAttribute('stroke',stroke.color || item.color); path.setAttribute('stroke-width',stroke.strokeWidth || item.strokeWidth); path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round');
        if (stroke.brush === 'marker') { path.setAttribute('stroke-width',(stroke.strokeWidth || item.strokeWidth)*1.8); path.setAttribute('opacity','0.38'); }
        else if (stroke.brush === 'pencil') { path.setAttribute('stroke-width',(stroke.strokeWidth || item.strokeWidth)*0.65); path.setAttribute('opacity','0.75'); path.setAttribute('stroke-dasharray','0.8 0.45'); }
        else if (stroke.opacity) path.setAttribute('opacity',stroke.opacity);
        svg.append(path);
      });
      element.append(svg);
    } else if (item.type === 'text') {
      element.classList.add('text-layer');
      const textarea=document.createElement('textarea');textarea.setAttribute('aria-label',`Texto: ${item.name}`);textarea.value=item.text||'';textarea.style.fontSize=`${item.fontSize||28}px`;textarea.style.fontWeight=String(item.fontWeight||600);textarea.style.textAlign=item.align||'center';textarea.style.color=item.color||'#292725';
      textarea.onfocus=()=>{if(!item._typingSnapshot){snapshot();item._typingSnapshot=true;}};textarea.onblur=()=>{delete item._typingSnapshot;autosave();};
      textarea.oninput=()=>{item.text=textarea.value;textarea.style.height='auto';item.h=Math.max(56,Math.min(state.pageHeight-item.y,textarea.scrollHeight+12));element.style.height=`${item.h}px`;autosave();};element.append(textarea);
    } else {
      applyBubbleShape(item,element);
      updateBubbleAccessories(item, element);
      const textarea = document.createElement('textarea'); textarea.setAttribute('aria-label', `Texto: ${item.name}`); textarea.value = item.text || '';
      styleBubbleText(item, textarea);
      textarea.onfocus = () => { if (!item._typingSnapshot) { snapshot(); item._typingSnapshot = true; } };
      textarea.onblur = () => { delete item._typingSnapshot; autosave(); };
      textarea.oninput = () => {
        item.text = textarea.value;
        if (item.autoGrow !== false) { textarea.style.height = 'auto'; item.h = Math.max(78, Math.min(state.pageHeight - item.y, textarea.scrollHeight + 26)); element.style.height = `${item.h}px`; }
        applyBubbleShape(item,element); updateBubbleAccessories(item,element);
        autosave();
      };
      element.append(textarea);
    }
    const handle = document.createElement('button'); handle.className = 'resize-handle'; handle.type = 'button'; handle.setAttribute('aria-label', `Cambiar tamaño de ${item.name}`); handle.hidden = item.id !== state.selected || item.locked; element.append(handle);
    attachResize(handle, element, item, boardCanvas, panelIndex);
    let longPressTimer = null; let longPressOrigin = null;
    element.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); openCanvasContextMenu(item,panelIndex,event.clientX,event.clientY); });
    element.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || event.target.closest('.resize-handle') || event.target.tagName === 'TEXTAREA') return;
      longPressOrigin = { x:event.clientX, y:event.clientY };
      longPressTimer = setTimeout(() => { longPressTimer = null; openCanvasContextMenu(item,panelIndex,event.clientX,event.clientY); }, 550);
    }, { capture:true });
    element.addEventListener('pointermove', event => { if (longPressTimer && longPressOrigin && Math.hypot(event.clientX-longPressOrigin.x,event.clientY-longPressOrigin.y)>10) { clearTimeout(longPressTimer); longPressTimer=null; } }, { capture:true });
    ['pointerup','pointercancel','pointerleave'].forEach(type => element.addEventListener(type, () => { if (longPressTimer) clearTimeout(longPressTimer); longPressTimer=null; }, { capture:true }));
    element.onpointerdown = event => {
      if ($('#toggle-draw').getAttribute('aria-pressed') === 'true' || item.locked || event.target === handle || event.target.tagName === 'TEXTAREA') return;
      if (state.active !== panelIndex) setActivePanel(panelIndex, true);
      if (state.selected !== item.id) selectItem(item.id);
      event.preventDefault(); element.setPointerCapture(event.pointerId);
      const start = { x: event.clientX, y: event.clientY, ix: item.x, iy: item.y, moved: false, scale: canvasScale(boardCanvas) };
      element.onpointermove = moveEvent => {
        if (!element.hasPointerCapture(moveEvent.pointerId)) return;
        const dx = (moveEvent.clientX - start.x) / start.scale; const dy = (moveEvent.clientY - start.y) / start.scale;
        if (!start.moved && Math.hypot(dx, dy) > 2) { snapshot(); start.moved = true; }
        if (!start.moved) return;
        item.x = start.ix + dx; item.y = start.iy + dy;
        element.style.left = `${item.x}px`; element.style.top = `${item.y}px`;
        element.classList.toggle('offstage', isFullyOffstage(item));
      };
      element.onpointerup = () => { if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId); element.onpointermove = null; element.onpointerup = null; if (start.moved) { autosave(); renderOffstage(); renderLayers(); } };
    };
    element.onclick = event => { event.stopPropagation(); if (state.active !== panelIndex) setActivePanel(panelIndex, true); selectItem(item.id); };
    if ($('#toggle-draw').getAttribute('aria-pressed') === 'true') element.style.pointerEvents = 'none';
    boardCanvas.append(element);
  }
  function attachResize(handle, element, item, boardCanvas, panelIndex) {
    handle.onpointerdown = event => {
      if (item.locked) return;
      event.preventDefault(); event.stopPropagation(); snapshot();
      if (state.active !== panelIndex) setActivePanel(panelIndex, true);
      const start = { x: event.clientX, y: event.clientY, w: item.w, h: item.h, ratio: item.w / item.h, scale: canvasScale(boardCanvas) };
      handle.setPointerCapture(event.pointerId);
      handle.onpointermove = moveEvent => {
        if (!handle.hasPointerCapture(moveEvent.pointerId)) return;
        const dx = (moveEvent.clientX - start.x) / start.scale; const dy = (moveEvent.clientY - start.y) / start.scale;
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
    if (!item) { box.innerHTML = `<div class="empty-state">${svgIcon('image')}<b>Selecciona un elemento</b><p>Su contorno y tirador naranja aparecerán en el lienzo.</p></div>`; return; }
    const characterResource = item.type === 'image' && (item.category === 'character' || resources.some(resource => resource.name === item.resourceId && resource.category === 'character'));
    const replaceControl = characterResource ? '<button id="replace-character" class="button replace-character">Sustituir personaje</button>' : '';
    const imageControls = item.type === 'image' ? `<div class="field"><label for="p-blur">Desenfoque · <span id="blur-value">${item.blur || 0}px</span></label><input id="p-blur" type="range" min="0" max="36" step="0.5" value="${item.blur || 0}"><small>Se conserva en el proyecto y también aparece en la exportación.</small></div><div class="field bg-remove-tools"><label>Quitar un fondo plano</label><input id="p-bg-tolerance" aria-label="Tolerancia del recorte de fondo" type="range" min="8" max="90" step="2" value="36"><small>Procesa el dibujo en este dispositivo. Da mejor resultado con fondos uniformes; no usa IA ni una API.</small><button id="remove-background" type="button" class="button">Recortar fondo</button>${item.originalSrc ? '<button id="restore-background" type="button" class="button">Restaurar imagen original</button>' : ''}</div>` : '';
    const textControls = item.type === 'text' ? `<div class="field"><label>Contenido</label><textarea id="p-text" rows="4">${escapeHTML(item.text||'')}</textarea></div><div class="field"><label>Tamaño de letra</label><input id="p-text-font" type="range" min="10" max="72" value="${item.fontSize||28}"></div><div class="field"><label>Alineación</label><select id="p-text-align"><option value="left">Izquierda</option><option value="center">Centrada</option><option value="right">Derecha</option></select></div><div class="field"><label>Color</label><input id="p-text-color" type="color" value="${item.color||'#292725'}"></div>` : '';
    const variantControl = item.variants?.length ? `<div class="field"><label>Variación del mismo personaje</label><select id="p-variant">${item.variants.map((variant, i) => `<option value="${i}" ${i === item.variantIndex ? 'selected' : ''}>${escapeHTML(variant.name)}</option>`).join('')}</select></div>` : '';
    const bubbleControls = item.type === 'bubble' ? `<div class="field"><label>Tipo</label><select id="p-kind"><option value="dialogue">Diálogo</option><option value="thought">Pensamiento</option><option value="narration">Narración</option><option value="shout">Voz fuerte</option><option value="sfx">Efecto de sonido</option></select></div>${['dialogue','thought'].includes(item.kind) ? `<div class="field"><label>Forma</label><select id="p-shape"><option value="auto">Adaptar al texto</option><option value="oval">Óvalo</option><option value="rounded">Rectángulo redondeado</option></select></div>` : ''}${item.kind === 'sfx' ? `<div class="field"><label>Estilo de efecto</label><select id="p-action-style"><option value="raised">Naranja con sombra</option><option value="outline">Contorno blanco</option><option value="impact">Sombra dramática</option></select></div>` : ''}<div class="field"><label>Tamaño de letra</label><input id="p-font" type="range" min="10" max="56" value="${item.fontSize || 17}"></div><div class="field"><label>Alineación</label><select id="p-align"><option value="center">Centrada</option><option value="left">Izquierda</option><option value="right">Derecha</option></select></div>${['dialogue','thought','shout'].includes(item.kind) ? `<label class="check-field"><input id="p-tail" type="checkbox" ${item.tail ? 'checked' : ''}> ${item.kind === 'thought' ? 'Burbujas de pensamiento' : 'Cola del globo'}</label>${item.tail ? `<div class="field"><label>Dirección de la cola</label><input id="p-tail-angle" type="range" min="-180" max="180" value="${item.tailAngle ?? 90}"></div><div class="field"><label>Largo de la cola</label><input id="p-tail-length" type="range" min="16" max="90" value="${item.tailLength ?? 34}"></div>` : ''}` : ''}<label class="check-field"><input id="p-autogrow" type="checkbox" ${item.autoGrow === false ? '' : 'checked'}> Ajustar alto al texto</label>` : '';
    const drawingControls = item.type === 'drawing' ? `<div class="field"><label>Relleno del contorno cerrado</label><label class="check-field"><input id="p-fill" type="checkbox" ${item.fillEnabled ? 'checked' : ''}> Aplicar relleno</label><input id="p-fill-color" type="color" value="${item.fillColor || '#F87209'}"></div><div class="field"><label>Color del trazo</label><input id="p-color" type="color" value="${item.color || '#282522'}"></div><div class="field"><label>Grosor</label><input id="p-stroke-width" type="range" min="1" max="40" value="${item.strokeWidth || 5}"></div>` : '';
    const recoverControl = isOffstage(item) ? '<button id="bring-in" class="button recovery">Recuperar dentro del lienzo</button>' : '';
    const flipControls = ['image','drawing'].includes(item.type) ? `<div class="field"><label>Voltear</label><div class="inspector-buttons flip-buttons"><button id="flip-x" aria-pressed="${!!item.flipX}">Horizontal</button><button id="flip-y" aria-pressed="${!!item.flipY}">Vertical</button></div></div>` : '';
    box.innerHTML = `<div class="field"><label>Nombre de capa</label><input id="p-name" value=""></div>${replaceControl}${variantControl}${imageControls}${bubbleControls}${textControls}${drawingControls}<div class="field-row"><div class="field"><label>X</label><input id="p-x" type="number" value="${Math.round(item.x)}"></div><div class="field"><label>Y</label><input id="p-y" type="number" value="${Math.round(item.y)}"></div></div><div class="field-row"><div class="field"><label>Ancho</label><input id="p-w" type="number" value="${Math.round(item.w)}"></div><div class="field"><label>Alto</label><input id="p-h" type="number" value="${Math.round(item.h)}"></div></div><div class="field"><label>Giro</label><input id="p-rot" type="range" min="-180" max="180" value="${item.rotation || 0}"></div>${flipControls}<div class="inspector-buttons"><button id="duplicate">Duplicar</button><button id="lock">${item.locked ? 'Desbloquear' : 'Bloquear'}</button><button id="delete" class="danger">Borrar</button></div>${recoverControl}`;
    $('#p-name').value = item.name;
    for (const name of ['kind', 'align']) { const input = $(`#p-${name}`); if (input) input.value = item[name] || (name === 'align' ? 'center' : 'dialogue'); }
    if ($('#p-action-style')) $('#p-action-style').value = item.actionStyle || 'raised';
    if ($('#p-shape')) $('#p-shape').value = item.shape || 'auto';
    if ($('#p-text-align')) $('#p-text-align').value=item.align||'center';
    const setProp = (selector, property, numeric = true) => $(`#p-${selector}`)?.addEventListener('change', event => { snapshot(); item[property] = numeric ? Number(event.target.value) : event.target.value; commit(); });
    setProp('name', 'name', false); setProp('x', 'x'); setProp('y', 'y'); setProp('w', 'w'); setProp('h', 'h'); setProp('rot', 'rotation');
    const blurInput = $('#p-blur'); let blurSnapshotTaken = false;
    blurInput?.addEventListener('pointerdown', () => { snapshot(); blurSnapshotTaken = true; });
    blurInput?.addEventListener('keydown', () => { if (!blurSnapshotTaken) { snapshot(); blurSnapshotTaken = true; } });
    blurInput?.addEventListener('input', event => { item.blur = Number(event.target.value); $('#blur-value').textContent = `${item.blur}px`; const image = activeCanvas()?.querySelector(`[data-id="${item.id}"] img`); if (image) image.style.filter = item.blur ? `blur(${item.blur}px)` : ''; autosave(); });
    blurInput?.addEventListener('change', () => { blurSnapshotTaken = false; renderLayers(); });
    $('#remove-background')?.addEventListener('click', async event => {
      const button=event.currentTarget;button.disabled=true;button.textContent='Recortando…';
      try { const removed=await removeFlatBackground(item.src,Number($('#p-bg-tolerance').value)); if(!removed.removed)throw new Error('No encontré una zona de fondo uniforme conectada al borde. Prueba otra imagen o un valor de tolerancia distinto.'); snapshot();item.originalSrc ||= item.src;item.src=removed.src;item.name ||= 'Dibujo con fondo recortado';commit();toast(`Fondo plano recortado localmente (${Math.round(removed.removed/removed.total*100)}% de píxeles).`); }
      catch(error){button.disabled=false;button.textContent='Recortar fondo';toast(error instanceof Error?error.message:'No se pudo recortar el fondo.');}
    });
    $('#restore-background')?.addEventListener('click',()=>{snapshot();item.src=item.originalSrc;delete item.originalSrc;commit();toast('Imagen original restaurada.');});
    for (const [axis, property] of [['x','flipX'],['y','flipY']]) $(`#flip-${axis}`)?.addEventListener('click', () => { snapshot(); item[property] = !item[property]; commit(); });
    $('#p-variant')?.addEventListener('change', event => { snapshot(); item.variantIndex = Number(event.target.value); item.src = item.variants[item.variantIndex].src; commit(); });
    $('#replace-character')?.addEventListener('click', () => openCharacterPicker(item.id));
    $('#p-text')?.addEventListener('input',event=>{item.text=event.target.value;const el=activeCanvas()?.querySelector(`[data-id="${item.id}"] textarea`);if(el)el.value=item.text;autosave();});
    $('#p-text-font')?.addEventListener('input',event=>{item.fontSize=Number(event.target.value);const el=activeCanvas()?.querySelector(`[data-id="${item.id}"] textarea`);if(el)el.style.fontSize=`${item.fontSize}px`;autosave();});
    $('#p-text-align')?.addEventListener('change',event=>{item.align=event.target.value;const el=activeCanvas()?.querySelector(`[data-id="${item.id}"] textarea`);if(el)el.style.textAlign=item.align;autosave();});
    $('#p-text-color')?.addEventListener('input',event=>{item.color=event.target.value;const el=activeCanvas()?.querySelector(`[data-id="${item.id}"] textarea`);if(el)el.style.color=item.color;autosave();});
    $('#p-kind')?.addEventListener('change', event => { snapshot(); item.kind = event.target.value; item.name = item.kind === 'sfx' ? 'Efecto de sonido' : `Globo · ${({dialogue:'Diálogo',thought:'Pensamiento',narration:'Narración',shout:'Voz fuerte'})[item.kind]}`; item.tail = ['dialogue','thought','shout'].includes(item.kind); item.fontSize = item.kind === 'sfx' ? Math.max(item.fontSize,42) : item.kind === 'shout' ? Math.max(item.fontSize,24) : item.fontSize; commit(); });
    $('#p-action-style')?.addEventListener('change', event => { snapshot(); item.actionStyle = event.target.value; commit(); });
    $('#p-shape')?.addEventListener('change', event => { snapshot(); item.shape = event.target.value; commit(); });
    $('#p-align')?.addEventListener('change', event => { snapshot(); item.align = event.target.value; commit(); });
    $('#p-font')?.addEventListener('input', event => { item.fontSize = Number(event.target.value); const text = activeCanvas()?.querySelector(`[data-id="${item.id}"] textarea`); if (text) styleBubbleText(item,text); autosave(); });
    $('#p-tail')?.addEventListener('change', event => { item.tail = event.target.checked; commit(); });
    $('#p-tail-angle')?.addEventListener('input', event => { item.tailAngle = Number(event.target.value); const el = activeCanvas()?.querySelector(`[data-id="${item.id}"]`); if (el) updateBubbleAccessories(item,el); autosave(); });
    $('#p-tail-length')?.addEventListener('input', event => { item.tailLength = Number(event.target.value); const el = activeCanvas()?.querySelector(`[data-id="${item.id}"]`); if (el) updateBubbleAccessories(item,el); autosave(); });
    $('#p-autogrow')?.addEventListener('change', event => { item.autoGrow = event.target.checked; autosave(); });
    $('#p-color')?.addEventListener('input', event => { item.color = event.target.value; const path = activeCanvas()?.querySelector(`[data-id="${item.id}"] path`); path?.setAttribute('stroke', item.color); autosave(); });
    $('#p-stroke-width')?.addEventListener('input', event => { item.strokeWidth = Number(event.target.value); const path = activeCanvas()?.querySelector(`[data-id="${item.id}"] path`); path?.setAttribute('stroke-width', item.strokeWidth); autosave(); });
    $('#p-fill')?.addEventListener('change', event => { snapshot(); item.fillEnabled = event.target.checked; commit(); });
    $('#p-fill-color')?.addEventListener('input', event => { item.fillColor = event.target.value; activeCanvas()?.querySelectorAll(`[data-id="${item.id}"] path`).forEach(path => { if (path.getAttribute('d').trim().endsWith('Z')) path.setAttribute('fill',item.fillColor); }); autosave(); });
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
      row.innerHTML = `<span class="layer-icon">${svgIcon(item.type === 'bubble' ? 'bubble' : item.type === 'drawing' ? 'pen' : 'image')}</span><span class="layer-name">${escapeHTML(item.name)}</span><button class="layer-order" aria-label="Subir capa">${svgIcon('up')}</button><button class="layer-order down" aria-label="Bajar capa">${svgIcon('down')}</button><button class="lock" aria-label="${item.locked ? 'Desbloquear' : 'Bloquear'}">${svgIcon(item.locked ? 'lock' : 'unlock')}</button>`;
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
    snapshot();
    const scale = Math.min(1, (LOGICAL_WIDTH - 16) / item.w, (state.pageHeight - 16) / item.h);
    if (scale < 1) { item.w *= scale; item.h *= scale; }
    item.x = Math.max(8, Math.min(LOGICAL_WIDTH - item.w - 8, item.x)); item.y = Math.max(8, Math.min(state.pageHeight - item.h - 8, item.y)); commit(); selectItem(item.id);
  }
  function movePanel(from, to) {
    if (from < 0 || from >= state.panels.length || to < 0 || to >= state.panels.length || from === to) return;
    const activeId = currentPanel().id;
    snapshot(); const [moved] = state.panels.splice(from,1); state.panels.splice(to,0,moved);
    state.active = Math.max(0,state.panels.findIndex(panel => panel.id === activeId)); commit();
  }
  function addPanel() { snapshot(); state.panels.push({ id: id(), items: [] }); state.active = state.panels.length - 1; state.selected = null; commit(); }
  function addClosingPanel() {
    const height = state.pageHeight; const panel = { id:id(), backgroundColor:'#FFF5D6', items:[] };
    const addText = (name,text,y,h,fontSize,color='#292725',fontWeight=600) => ({id:id(),type:'text',name,text,x:42,y,w:516,h,fontSize,fontWeight,align:'center',color,rotation:0,locked:false});
    panel.items.push(addText('Cierre · agradecimiento','¡Gracias por leer!',height*.34,64,38));
    panel.items.push(addText('Cierre · seguir','Síguenos en @mandarinita.art',height*.50,54,27,'#F87209',700));
    panel.items.push(addText('Cierre · compartir','Comparte esta historia si te hizo sonreír.',height*.65,82,22));
    snapshot(); state.panels.push(panel); state.active=state.panels.length-1; state.selected=null; commit();
  }
  function changeFormat(format) {
    if (!FORMAT[format]) return;
    const previous = state.pageHeight; state.format = format; state.pageHeight = FORMAT[format].logicalHeight;
    const outside = currentPanel().items.filter(isOffstage).length;
    autosave(); render();
    if (outside) toast(`${outside} elemento(s) quedarán fuera al cambiar de ${previous}px a ${state.pageHeight}px de alto. Recupéralos en la lista de capas.`);
  }

  function renderResources() {
    const grid = $('#asset-grid'); const query = $('#asset-search').value.trim().toLocaleLowerCase('es');
    if (resourceFilter === 'reference') {
      $('#background-note').hidden = true;
      if (!referenceRecords && !referenceLoadFailed) {
        grid.innerHTML = '<div class="resource-note" role="status">Cargando el atlas de referencias…</div>';
        if (!referenceLoad) referenceLoad = loadCharacterReferences().then(records => { referenceRecords = records; }).catch(() => { referenceLoadFailed = true; }).finally(() => { referenceLoad = null; if (resourceFilter === 'reference') renderResources(); });
        return;
      }
      if (referenceLoadFailed) {
        grid.innerHTML = '<div class="resource-note" role="status">No pude cargar el atlas. Comprueba la conexión y vuelve a intentarlo.<button type="button" class="reference-retry">Reintentar</button></div>';
        grid.querySelector('.reference-retry').onclick = () => { referenceLoadFailed = false; renderResources(); };
        return;
      }
      const characterSelect = $('#reference-character-select');
      if (characterSelect.options.length === 1) {
        const characters = [...new Map(referenceRecords.filter(reference => reference.characterId).map(reference => [reference.characterId, reference.characterName])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'es'));
        characters.forEach(([id, name]) => { const option = document.createElement('option'); option.value = id; option.textContent = name; characterSelect.append(option); });
      }
      const selectedCharacter = characterSelect.value;
      const matchingReferences = referenceRecords.filter(reference => (!selectedCharacter || reference.characterId === selectedCharacter) && (query || reference.characterId) && matchesReferenceSearch(reference, query));
      const candidates = matchingReferences.slice(0, 100);
      const characterCount = new Set(referenceRecords.filter(reference => reference.characterId).map(reference => reference.characterId)).size;
      const sceneCount = referenceRecords.filter(reference => reference.referenceType === 'scene').length;
      $('#reference-note').textContent = query
        ? `Atlas: ${characterCount} personajes y ${sceneCount} escenas indexadas. ${matchingReferences.length > candidates.length ? `Mostrando ${candidates.length} de ` : ''}${matchingReferences.length} resultados para “${query}”. Las etiquetas sirven para localizar; confirma la fuente. Las escenas no se insertan como componentes.`
        : `Atlas de consulta: ${characterCount} personajes y ${sceneCount} escenas. Busca un personaje, objeto, mueble, vehículo, lugar o episodio. Las etiquetas son ayudas de búsqueda; las escenas completas no se insertan como componentes.`;
      renderReferenceCards(candidates, grid);
      return;
    }
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
      if (resource.approvedCutout) {
        // Use one pointer drag path on mouse, touch and Apple Pencil. Native HTML
        // drag/drop is inconsistent for cards inside a scrolling iPad drawer.
        card.draggable = false;
        card.onclick = () => { if (Date.now() >= suppressAssetClickUntil) addResource(resource); };
        let pointerDrag = null;
        card.addEventListener('pointerdown', event => {
          pointerDrag = { id:event.pointerId, x:event.clientX, y:event.clientY, started:false, ghost:null };
          try { card.setPointerCapture(event.pointerId); } catch {}
        });
        card.addEventListener('pointermove', event => {
          if (!pointerDrag || pointerDrag.id !== event.pointerId) return;
          if (!pointerDrag.started && Math.hypot(event.clientX-pointerDrag.x,event.clientY-pointerDrag.y)>14) {
            pointerDrag.started=true; suppressAssetClickUntil=Date.now()+1000;
            $('#library-panel').classList.add('dragging-from-library');
            const ghost=document.createElement('div'); ghost.className='asset-drag-ghost'; ghost.innerHTML=`<img src="${thumb}" alt=""><span>${escapeHTML(resource.name)}</span>`; document.body.append(ghost); pointerDrag.ghost=ghost;
          }
          if (pointerDrag.started) {
            event.preventDefault(); pointerDrag.ghost.style.left=`${event.clientX+12}px`; pointerDrag.ghost.style.top=`${event.clientY+12}px`;
            $$('.artboard-canvas.drop-target').forEach(canvas=>canvas.classList.remove('drop-target'));
            const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.artboard-canvas'); target?.classList.add('drop-target');
          }
        });
        const finishPointerDrag = event => {
          if (!pointerDrag || pointerDrag.id!==event.pointerId) return;
          if (pointerDrag.started && event.type === 'pointerup') {
            event.preventDefault(); const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.artboard-canvas');
            const panelIndex=Number(target?.dataset.panelIndex); target?.classList.remove('drop-target');
            if (target && Number.isInteger(panelIndex)) {
              dropResourceAt(resource,panelIndex,target,event.clientX,event.clientY);
              $('#library-panel').classList.remove('open','dragging-from-library');
              $('#mobile-library').setAttribute('aria-expanded','false');
            } else $('#library-panel').classList.remove('dragging-from-library');
            suppressAssetClickUntil=Date.now()+800;
          } else $('#library-panel').classList.remove('dragging-from-library');
          pointerDrag.ghost?.remove(); pointerDrag=null;
        };
        card.addEventListener('pointerup',finishPointerDrag); card.addEventListener('pointercancel',finishPointerDrag);
      }
      grid.append(card);
    });
  }
  async function loadCharacterReferences() {
    const response = await fetch('/editor-art-catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('No se pudo descargar el catálogo.');
    const catalog = await response.json();
    const names = {
      mando: ['Mando Mandarinita', ['Mando', 'mandarino', 'Sr. Mandarino', 'Señor Mandarino']],
      mandy: ['Mandy Mandarinita', ['Mandy', 'Mandarinita']],
      greg: ['Greg el Zanahorio', ['Greg', 'zanahorio', 'zanahoria']],
      'don-guineo': ['Don Guineo', ['guineo', 'banana']],
      'don-pepino': ['Don Pepino', ['pepino']],
      'limon-agrio': ['Limón Agrio', ['limón', 'limon agrio']],
      aguacatelo: ['Aguacatelo', ['aguacate']],
      morita: ['Morita', ['mora']],
      sandy: ['Sandy la Sandía', ['Sandy', 'sandía']],
      'champi-ñon': ['Champi Ñón', ['Champi', 'champiñón']],
      gato: ['Gato', ['gato']]
    };
    const records = new Map();
    const add = record => {
      const key = `${record.characterId}:${record.sourcePanel}`;
      const existing = records.get(key);
      if (!existing || record.source === 'pilot-atlas') records.set(key, record);
    };
    for (const panel of catalog.panels || []) {
      if ((panel.visualTags || []).length || panel.visualNote) {
        const panelName = panel.source.split('/').at(-1) || '';
        const episodeFolder = panel.source.split('/').find(part => part.startsWith('ep-')) || '';
        const episodeTitle = episodeFolder.replace(/^ep-\d+-/, '').replaceAll('-', ' ');
        records.set(`scene:${panel.source}`, {
          referenceType: 'scene', characterId: null, characterName: 'Escena y elementos', aliases: panel.visualTags || [],
          episodeNumber: panel.episodeNumber, panelName, sourcePanel: `/${panel.source}`,
          pose: (panel.visualTags || []).join(' · ') || 'Escena catalogada',
          expression: panel.visualNote || `Referencia del episodio ${panel.episodeNumber}`,
          searchDescription: `${episodeTitle} ${(panel.visualTags || []).join(' ')} ${panel.visualNote || ''}`,
          certainty: panel.visualTagsStatus || 'catalog-reference', sourceReview: panel.sourceReview || 'index-only', catalogStatus: panel.catalogStatus || 'review', reviewReason: panel.reviewReason || '', source: 'scene-catalog'
        });
      }
      if (!['full-resolution', 'large-preview'].includes(panel.sourceReview)) continue;
      for (const appearance of panel.characterAppearances || []) {
        if (appearance.certainty !== 'high') continue;
        const [characterName, aliases] = names[appearance.characterId] || [appearance.characterId, []];
        add({
          characterId: appearance.characterId, characterName, aliases,
          episodeNumber: panel.episodeNumber,
          panelName: panel.source.split('/').at(-1) || '',
          sourcePanel: `/${panel.source}`,
          pose: appearance.pose || 'Pose observada; descripción pendiente',
          expression: appearance.expression || 'Expresión pendiente de documentar',
          certainty: appearance.certainty, sourceReview: panel.sourceReview, source: 'panel-review'
        });
      }
    }
    for (const pilot of catalog.characterAtlasPilots || []) {
      for (const reference of pilot.referencePanels || []) {
        const pathParts = reference.sourcePanel.split('/'); const episodeFolder = pathParts.find(part => part.startsWith('ep-')) || ''; const episodeMatch = episodeFolder.match(/^ep-(\d+)-/); const panelName = pathParts.at(-1) || '';
        add({
          characterId: pilot.characterId,
          characterName: pilot.displayName || pilot.characterId,
          aliases: pilot.searchAliases || [],
          episodeNumber: episodeMatch ? Number(episodeMatch[1]) : 0,
          panelName,
          sourcePanel: reference.sourcePanel.startsWith('/') ? reference.sourcePanel : `/${reference.sourcePanel}`,
          pose: typeof reference.pose === 'string' ? reference.pose : reference.pose.join('; '),
          expression: typeof reference.expression === 'string' ? reference.expression : reference.expression.join('; '),
          certainty: reference.certainty, sourceReview: reference.sourceReview || 'catalog-review', source: 'pilot-atlas'
        });
      }
    }
    const pageCharacterIds = { 'Champi Ñón': 'champi-ñon', 'Los Cherrys': 'los-cherrys', 'Don Guineo': 'don-guineo', 'Don Manzanillo': 'don-manzanillo', 'Don Pepino': 'don-pepino', 'Sandy la Sandía': 'sandy', Superfreso: 'superfreso' };
    for (const asset of catalog.directCharacterAssets || []) {
      const listedOpaque = Boolean(asset.canonicalName && asset.characterPageStatus === 'listed' && asset.assetUse === 'opaque-scene-reference' && !asset.editorCutoutApproved);
      const supplementalPortrait = asset.assetUse === 'existing-transparent-variant' && asset.catalogStatus === 'review';
      if (!listedOpaque && !supplementalPortrait) continue;
      const panelName = asset.source.split('/').at(-1) || asset.source;
      const supplementalIdentity = asset.relatedToCanonicalCharacter || (asset.source.endsWith('/sr-mandarino-neutral.png') ? 'Mando Mandarinita' : null);
      const displayName = asset.canonicalName || (supplementalIdentity ? `${supplementalIdentity} · referencia suplementaria` : 'Retrato transparente · identidad pendiente');
      const supplementalCharacterId = supplementalIdentity === 'Mandy Mandarinita' ? 'mandy' : supplementalIdentity === 'Mando Mandarinita' ? 'mando' : null;
      add({
        characterId: supplementalCharacterId || (asset.canonicalName ? pageCharacterIds[asset.canonicalName] || `page:${asset.source}` : `asset:${asset.source}`), characterName: displayName,
        aliases: asset.searchAliases || [], episodeNumber: null, panelName,
        sourcePanel: `/${asset.source}`, pose: supplementalPortrait ? 'Retrato existente; fuente de episodio pendiente de enlazar' : 'Posición pendiente de cotejar con episodios',
        expression: asset.visualNote || asset.pageAltText || 'Expresión pendiente de documentar', searchDescription: `${asset.visualNote || ''} ${asset.relatedToCanonicalCharacter || ''}`,
        certainty: supplementalPortrait ? 'supplemental-source-unlinked' : 'listed-character-asset', sourceReview: supplementalPortrait ? 'asset-source-unlinked' : 'character-page-asset', source: supplementalPortrait ? 'supplemental-asset' : 'character-page', catalogStatus: asset.catalogStatus || 'review'
      });
    }
    const panelOrder = name => Number(name.match(/\.(\d+)(?:\.[^.]+)?$/)?.[1] ?? Number.MAX_SAFE_INTEGER);
    return [...records.values()].sort((a, b) => (a.episodeNumber ?? Number.MAX_SAFE_INTEGER) - (b.episodeNumber ?? Number.MAX_SAFE_INTEGER) || panelOrder(a.panelName) - panelOrder(b.panelName) || a.characterName.localeCompare(b.characterName, 'es') || a.panelName.localeCompare(b.panelName, 'es'));
  }
  function renderReferenceCards(candidates, grid) {
    grid.innerHTML = '';
    if (!candidates.length) { grid.innerHTML = '<div class="resource-note">No encontré referencias con ese término.</div>'; return; }
    candidates.forEach(reference => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'atlas-reference-card';
      const number = String(reference.episodeNumber).padStart(2, '0');
      card.setAttribute('aria-label', `Ver referencia de ${reference.characterName}, ${reference.episodeNumber ? `episodio ${reference.episodeNumber}, ` : 'página de personajes, '}${reference.panelName}`);
      const reviewBadge = reference.catalogStatus === 'review' ? ' · En revisión' : reference.source === 'scene-catalog' && reference.sourceReview === 'index-only' ? ' · Etiquetas por cotejar' : '';
      card.innerHTML = `<img src="${escapeHTML(reference.sourcePanel)}" alt="" loading="lazy"><span>${escapeHTML(reference.characterName)}</span><small>${reference.episodeNumber ? `Ep. ${number}` : 'Personajes'} · ${escapeHTML(reference.panelName)}${reviewBadge}</small><small>${escapeHTML(reference.pose)}</small>`;
      card.onclick = () => openReferencePreview(reference);
      grid.append(card);
    });
  }
  function openReferencePreview(reference) {
    const dialog = $('#reference-preview-dialog');
    $('#reference-preview-title').textContent = reference.characterName;
    $('#reference-preview-subtitle').textContent = reference.sourceReview === 'unlinked-file-review' ? `Episodio ${reference.episodeNumber} · archivo sin vínculo editorial · en revisión` : reference.episodeNumber ? `Episodio ${reference.episodeNumber} · ${reference.panelName}${reference.catalogStatus === 'review' ? ' · Episodio en revisión' : ''}` : reference.source === 'supplemental-asset' ? `Arte suplementario · ${reference.panelName}` : `Página de personajes · ${reference.panelName}`;
    $('#reference-preview-pose-label').textContent = reference.referenceType === 'scene' ? 'Etiquetas de búsqueda' : reference.source === 'character-page' ? 'Pose catalogada' : reference.source === 'supplemental-asset' ? 'Estado de la fuente' : 'Pose observada';
    $('#reference-preview-expression-label').textContent = reference.referenceType === 'scene' ? 'Nota visual del catálogo' : reference.source === 'character-page' ? 'Descripción del sitio' : reference.source === 'supplemental-asset' ? 'Nota del recurso' : 'Expresión observable';
    $('#reference-preview-pose').textContent = reference.pose;
    $('#reference-preview-expression').textContent = reference.expression;
    $('#reference-preview-image').src = reference.sourcePanel;
    $('#reference-preview-image').alt = reference.episodeNumber ? `Panel completo de ${reference.characterName}, episodio ${reference.episodeNumber}, ${reference.panelName}` : `Imagen de referencia de ${reference.characterName}, ${reference.panelName}`;
    $('#reference-preview-source').href = reference.sourcePanel;
    $('#reference-preview-note').textContent = reference.source === 'character-page' ? 'Imagen original de la página de personajes. Se conserva íntegra como referencia y no se inserta como componente.' : reference.source === 'supplemental-asset' ? 'Este arte transparente ya existe en el repositorio, pero aún no tiene una fuente de episodio enlazada. Se conserva como referencia, no como componente insertable.' : reference.reviewReason || 'La viñeta se conserva completa como referencia. No se puede insertar como componente.';
    dialog.showModal();
  }
  function openCharacterPicker(itemId) {
    const grid = $('#replace-resource-grid'); grid.innerHTML = '';
    resources.filter(resource => resource.category === 'character' && resource.approvedCutout).forEach(resource => {
      const button = document.createElement('button'); button.className = 'replace-resource-card';
      const variant = resource.variants?.[0] || resource;
      button.innerHTML = `<img src="${variant.src}" alt=""><span>${escapeHTML(resource.name)}</span>`;
      button.onclick = () => {
        const item = currentPanel().items.find(entry => entry.id === itemId); if (!item) return;
        snapshot(); item.name = resource.name; item.resourceId = resource.name; item.category = resource.category; item.aliases = resource.aliases || [];
        item.variants = resource.variants || null; item.variantIndex = 0; item.src = variant.src; $('#resource-picker-dialog').close(); commit();
      };
      grid.append(button);
    });
    $('#resource-picker-dialog').showModal();
  }
  function adjustZoom(factor) {
    if (!state) return;
    const viewport = $('#stage-wrap'); const rect = viewport.getBoundingClientRect();
    setZoom((state.zoom || 1) * factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  function setZoom(nextZoom, clientX, clientY) {
    if (!state) return;
    const viewport = $('#stage-wrap'); const rect = viewport.getBoundingClientRect();
    const oldZoom = state.zoom || 1; const next = Math.max(.35, Math.min(2.5, nextZoom));
    if (Math.abs(next - oldZoom) < .002) return;
    const localX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const localY = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const contentX = viewport.scrollLeft + localX; const contentY = viewport.scrollTop + localY;
    state.zoom = next; render();
    const ratio = next / oldZoom;
    viewport.scrollLeft = contentX * ratio - localX;
    viewport.scrollTop = contentY * ratio - localY;
  }
  function setupResourceFilters() {
    $$('.filters button').forEach(button => button.onclick = () => {
      $$('.filters button').forEach(candidate => candidate.classList.toggle('active', candidate === button));
      resourceFilter = button.dataset.filter;
      const viewingReferences = resourceFilter === 'reference';
      $('#library-title').textContent = viewingReferences ? 'Referencias' : 'Componentes';
      $('#upload-asset').hidden = viewingReferences;
      $('#component-note').hidden = viewingReferences;
      $('#reference-note').hidden = !viewingReferences;
      $('#reference-character-filter').hidden = !viewingReferences;
      $('#asset-search').placeholder = viewingReferences ? 'Personaje, episodio, pose o emoción' : 'Personaje, alias u objeto';
      $('#asset-search').setAttribute('aria-label', viewingReferences ? 'Buscar referencias por personaje, episodio, pose o emoción' : 'Buscar recursos');
      renderResources();
    });
    $('#asset-search').oninput = renderResources;
    $('#reference-character-select').onchange = renderResources;
    renderResources();
  }

  function pointOnCanvas(event, target = event.currentTarget) {
    const rect = target.getBoundingClientRect(); const scale = rect.width / LOGICAL_WIDTH;
    return { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale, pressure: event.pointerType === 'pen' ? Math.max(0.15, event.pressure) : 0.65 };
  }
  function drawingStrokes(item) { return item.strokes?.length ? item.strokes : item.path ? [{ points:null, path:item.path, color:item.color, strokeWidth:item.strokeWidth, opacity:item.opacity, brush:'pen', closed:false }] : []; }
  function updateDrawingBounds(item) {
    const points = item.strokes.flatMap(stroke => stroke.points || []); if (!points.length) return;
    const pad = Math.max(...item.strokes.map(stroke => (stroke.strokeWidth || 4) * .8));
    const minX = Math.min(...points.map(p => p.x)) - pad; const minY = Math.min(...points.map(p => p.y)) - pad;
    const maxX = Math.max(...points.map(p => p.x)) + pad; const maxY = Math.max(...points.map(p => p.y)) + pad;
    item.x = Math.max(0,minX); item.y = Math.max(0,minY); item.w = Math.max(1,Math.min(LOGICAL_WIDTH,maxX)-item.x); item.h = Math.max(1,Math.min(state.pageHeight,maxY)-item.y);
    item.path = item.strokes.map(stroke => stroke.points?.map((p,i) => `${i?'L':'M'}${(p.x-item.x).toFixed(1)},${(p.y-item.y).toFixed(1)}`).join(' ') + (stroke.closed?' Z':'')).filter(Boolean).join(' ');
    const first = item.strokes[0]; item.color = first.color; item.strokeWidth = first.strokeWidth;
  }
  function setEraser(enabled) {
    brushMode = enabled ? 'eraser' : 'pen';
    $('#eraser-tool').setAttribute('aria-pressed',String(enabled)); $('#toggle-draw').setAttribute('aria-pressed','true');
    $('#eraser-tool').classList.toggle('active',enabled);
    $('#canvas')?.classList.toggle('eraser-active',enabled); $$('.artboard-canvas').forEach(board => board.classList.toggle('eraser-active',enabled));
  }
  function beginDrawing(event) {
    if ($('#toggle-draw').getAttribute('aria-pressed') !== 'true') return;
    event.preventDefault(); event.stopPropagation();
    const target = event.currentTarget; const panelIndex = Number(target.dataset.panelIndex); if (state.active !== panelIndex) setActivePanel(panelIndex,true);
    if (brushMode === 'eraser') {
      erasing = { panelIndex, canvas:target, radius:Math.max(5,Number($('#brush-size').value)*1.4), changed:false, snapshot:false };
      target.setPointerCapture(event.pointerId); eraseAtPoint(pointOnCanvas(event,target)); return;
    }
    drawing = { points:[pointOnCanvas(event,target)], color:selectedColor, size:Number($('#brush-size').value), brush:brushMode, opacity:brushMode === 'marker' ? .4 : brushMode === 'pencil' ? .75 : 1, panelIndex, canvas:target };
    target.setPointerCapture(event.pointerId);
  }
  function eraseAtPoint(point) {
    if (!erasing) return;
    const items = state.panels[erasing.panelIndex].items;
    for (const item of [...items]) {
      if (item.type !== 'drawing') continue;
      const strokes = drawingStrokes(item); let changedItem = false; const result = [];
      for (const stroke of strokes) {
        if (!stroke.points?.length) { result.push(stroke); continue; }
        let segment = []; const segments = []; let strokeChanged = false;
        for (const p of stroke.points) {
          const hit = Math.hypot(p.x-point.x,p.y-point.y) <= erasing.radius;
          if (hit) { if (segment.length > 1) segments.push(segment); segment=[]; changedItem=true; strokeChanged=true; if (!erasing.snapshot) { snapshot(); erasing.snapshot=true; } }
          else segment.push(p);
        }
        if (segment.length > 1) segments.push(segment);
        if (!strokeChanged) result.push(stroke);
        else segments.forEach(points => result.push({...stroke,points,closed:false}));
      }
      if (changedItem) { item.strokes = result; if (!item.strokes.length) items.splice(items.indexOf(item),1); else updateDrawingBounds(item); erasing.changed=true; }
    }
  }
  function continueDrawing(event) {
    if (erasing && erasing.canvas.hasPointerCapture(event.pointerId)) { eraseAtPoint(pointOnCanvas(event,erasing.canvas)); return; }
    if (!drawing || !drawing.canvas.hasPointerCapture(event.pointerId)) return;
    drawing.points.push(pointOnCanvas(event,drawing.canvas)); drawPreview();
  }
  function drawPreview() {
    if (!drawing || drawing.points.length < 2) return;
    drawing.canvas.querySelector('.temporary-stroke')?.remove();
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.classList.add('temporary-stroke'); svg.setAttribute('viewBox',`0 0 ${LOGICAL_WIDTH} ${state.pageHeight}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d',drawing.points.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ')); path.setAttribute('fill','none'); path.setAttribute('stroke',drawing.color); path.setAttribute('stroke-width',drawing.size*(drawing.brush==='marker'?1.8:drawing.brush==='pencil'?.65:1)); path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round'); path.setAttribute('opacity',drawing.opacity); if(drawing.brush==='pencil')path.setAttribute('stroke-dasharray','1 1'); svg.append(path); drawing.canvas.append(svg);
  }
  function finishDrawing(event) {
    if (erasing) {
      const current = erasing; if(current.canvas.hasPointerCapture(event.pointerId))current.canvas.releasePointerCapture(event.pointerId); erasing=null;
      if(current.changed)commit(); return;
    }
    if (!drawing) return;
    const current = drawing; const target = current.canvas; if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId); drawing=null; target.querySelector('.temporary-stroke')?.remove();
    if (current.points.length < 2) return;
    const pressure = current.points.reduce((sum,p)=>sum+p.pressure,0)/current.points.length;
    const strokeWidth = Math.max(1,current.size*(.45+pressure*.95)); const first=current.points[0],last=current.points.at(-1);
    const closed = current.points.length > 4 && Math.hypot(first.x-last.x,first.y-last.y) <= Math.max(14,strokeWidth*2);
    const stroke = {points:current.points.map(({x,y})=>({x,y})),color:current.color,strokeWidth,opacity:current.opacity,brush:current.brush,closed};
    const panel=state.panels[current.panelIndex]; let item=drawingObjectId ? panel.items.find(entry=>entry.id===drawingObjectId&&entry.type==='drawing') : null;
    snapshot();
    if(item){item.strokes.push(stroke);updateDrawingBounds(item);}
    else {item={id:id(),type:'drawing',name:drawingObjectId?'Dibujo':'Trazo',x:0,y:0,w:1,h:1,path:'',strokes:[stroke],color:stroke.color,strokeWidth:stroke.strokeWidth,fillEnabled:false,fillColor:'#F87209',locked:false,rotation:0};updateDrawingBounds(item);panel.items.push(item);if(drawingObjectId)drawingObjectId=item.id;}
    state.selected=item.id; commit();
  }
  function cancelDrawing(event) {
    const target = event.currentTarget;
    if (drawing?.canvas === target) {
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      target.querySelector('.temporary-stroke')?.remove(); drawing = null;
    }
    if (erasing?.canvas === target) {
      const current = erasing;
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      erasing = null; if (current.changed) commit();
    }
  }
  async function renderPanelPng(panel) {
    const preset = FORMAT[state.format]; const logicalHeight = state.pageHeight; const style = state.exportStyle || 'classic';
    const output = document.createElement('canvas'); output.width = preset.width; output.height = preset.height;
    const ctx = output.getContext('2d');
    const bounds = style === 'classic'
      ? { x:output.width*.10, y:output.height*.085, w:output.width*.80, h:output.height*.84 }
      : style === 'cream'
        ? { x:output.width*.065, y:output.height*.075, w:output.width*.87, h:output.height*.85 }
        : { x:output.width*.035, y:output.height*.035, w:output.width*.93, h:output.height*.79 };
    ctx.fillStyle = style === 'classic' ? '#FFC928' : style === 'cream' ? '#FFF5D6' : '#FFFFFF'; ctx.fillRect(0,0,output.width,output.height);
    if (style === 'classic') {
      ctx.fillStyle = '#FFD84A';
      for (let y=output.height*.015;y<output.height;y+=output.height*.055) for (let x=output.width*.015;x<output.width;x+=output.width*.055) { ctx.beginPath();ctx.arc(x,y,Math.max(4,output.width*.014),0,Math.PI*2);ctx.fill(); }
    }
    ctx.save(); ctx.shadowColor = style === 'classic' ? '#8D681733' : '#4D38251A'; ctx.shadowBlur = output.width*.015; ctx.shadowOffsetY = output.height*.007;
    ctx.fillStyle = style === 'classic' ? '#FFFFFF' : '#FFFEFB'; roundedRect(ctx,bounds.x,bounds.y,bounds.w,bounds.h,output.width*.045);ctx.fill();ctx.restore();
    if (style !== 'footer') { ctx.strokeStyle=style==='classic'?'#FFF8E9':'#E9DCC8';ctx.lineWidth=Math.max(2,output.width*.002);roundedRect(ctx,bounds.x,bounds.y,bounds.w,bounds.h,output.width*.045);ctx.stroke(); }
    const scale = Math.min(bounds.w / LOGICAL_WIDTH, bounds.h / logicalHeight);
    const offsetX = bounds.x + (bounds.w - LOGICAL_WIDTH * scale) / 2; const offsetY = bounds.y + (bounds.h - logicalHeight * scale) / 2;
    ctx.save(); roundedRect(ctx,bounds.x,bounds.y,bounds.w,bounds.h,output.width*.045);ctx.clip();
    ctx.fillStyle = panel.backgroundColor || '#FFFFFF'; ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h);
    for (const item of panel.items) {
      ctx.save(); ctx.translate(offsetX + (item.x + item.w / 2) * scale, offsetY + (item.y + item.h / 2) * scale); ctx.rotate((item.rotation || 0) * Math.PI / 180); ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1); ctx.scale(scale, scale);
      if (item.type === 'image') {
        try { const image = await loadImage(item.src); ctx.save(); ctx.filter = item.blur ? `blur(${item.blur * (scale / 2)}px)` : 'none'; drawContained(ctx, image, item.w, item.h); ctx.restore(); } catch { /* Missing image stays represented by its source path in the editable project. */ }
      } else if (item.type === 'drawing') {
        const strokes = item.strokes?.length ? item.strokes : [{path:item.path,color:item.color,strokeWidth:item.strokeWidth,opacity:item.opacity,brush:'pen'}];
        strokes.forEach(stroke => {
          ctx.save(); ctx.globalAlpha = stroke.opacity ?? item.opacity ?? 1; ctx.strokeStyle = stroke.color || item.color || '#292725'; ctx.lineWidth = (stroke.strokeWidth || item.strokeWidth || 5) * (stroke.brush === 'marker' ? 1.8 : stroke.brush === 'pencil' ? .65 : 1); ctx.lineCap = ctx.lineJoin = 'round';
          if (stroke.brush === 'pencil') ctx.setLineDash([1,1]);
          const path = new Path2D(stroke.path || (stroke.points || []).map((p,i)=>`${i?'L':'M'}${p.x-item.x} ${p.y-item.y}${i===stroke.points.length-1&&stroke.closed?' Z':''}`).join(' '));
          if (item.fillEnabled && stroke.closed) { ctx.fillStyle = item.fillColor || '#F87209'; ctx.fill(path); }
          ctx.stroke(path); ctx.restore();
        });
      } else if (item.type === 'text') {
        ctx.fillStyle=item.color||'#292725';ctx.font=`${item.fontWeight||600} ${item.fontSize||28}px Fredoka, sans-serif`;ctx.textAlign=item.align||'center';ctx.textBaseline='middle';wrapText(ctx,item.text,0,0,item.w*.92,(item.fontSize||28)*1.25);
      } else {
        const form = getBubbleForm(item); const angle = (item.tailAngle ?? 90) * Math.PI / 180; const ux=Math.cos(angle), uy=Math.sin(angle); const radiusX=item.w*.49, radiusY=item.h*.49;
        const denom = form==='rounded' ? Math.max(Math.abs(ux)/radiusX,Math.abs(uy)/radiusY) : Math.sqrt(ux*ux/(radiusX*radiusX)+uy*uy/(radiusY*radiusY));
        const bx=ux/denom, by=uy/denom, tipX=bx+ux*(item.tailLength??34), tipY=by+uy*(item.tailLength??34);
        if (item.kind === 'sfx') {
          ctx.fillStyle='#F87209';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.shadowColor='#292725';ctx.shadowBlur=0;ctx.shadowOffsetX=3;ctx.shadowOffsetY=4;
        } else { ctx.fillStyle = item.kind==='narration'?'#fff5df':'#fff'; ctx.strokeStyle = '#292725'; ctx.lineWidth = 4; }
        if (item.kind !== 'sfx') {
          if (item.tail && ['dialogue','shout'].includes(item.kind)) { const half=12,tx=-uy,ty=ux; ctx.beginPath();ctx.moveTo(bx-tx*half,by-ty*half);ctx.lineTo(tipX,tipY);ctx.lineTo(bx+tx*half,by+ty*half);ctx.closePath();ctx.fill();ctx.stroke(); }
          ctx.beginPath(); if(form==='rounded')ctx.roundRect(-item.w/2,-item.h/2,item.w,item.h,24);else ctx.ellipse(0,0,item.w/2,item.h/2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
          if(item.kind==='thought'&&item.tail){[14,9,5].forEach((diameter,i)=>{const t=[.34,.62,.86][i];ctx.beginPath();ctx.arc(bx+ux*(item.tailLength??34)*t,by+uy*(item.tailLength??34)*t,diameter/2,0,Math.PI*2);ctx.fill();ctx.stroke();});}
        }
        ctx.fillStyle = item.kind === 'sfx' ? '#F87209' : '#292725'; ctx.font = `${['sfx','shout'].includes(item.kind) ? '700 ' : ''}${item.kind==='shout'?Math.max(24,item.fontSize||24):item.fontSize || 17}px Fredoka, sans-serif`; ctx.textAlign = item.align || 'center'; ctx.textBaseline = 'middle';
        wrapText(ctx, ['sfx','shout'].includes(item.kind)?String(item.text||'').toUpperCase():item.text, 0, 0, item.w * 0.82, (item.fontSize || 17) * 1.25);
      }
      ctx.restore();
    }
    ctx.restore();
    if (style === 'footer') {
      ctx.fillStyle='#FFF5D6';ctx.fillRect(0,output.height*.86,output.width,output.height*.14);
      ctx.fillStyle='#F87209';ctx.fillRect(output.width*.035,output.height*.86,output.width*.93,Math.max(4,output.height*.006));
    }
    const logo = await loadImage('/assets/mandarinita-logo.svg').catch(()=>null);
    const logoW=output.width*.25, logoH=output.height*.075, logoX=(output.width-logoW)/2, logoY=style==='footer'?output.height*.875:0;
    if (logo) {
      ctx.fillStyle='#F5FFE0';roundedRect(ctx,logoX-output.width*.025,logoY,logoW+output.width*.05,logoH+output.height*.015,output.width*.045);ctx.fill();
      ctx.drawImage(logo,logoX,logoY+output.height*.008,logoW,logoH);
    }
    const copyright=`© ${new Date().getFullYear()}. Mandarinita es una marca comercial mixta, registrada por Mauricio Quezada.`;
    ctx.save();ctx.translate(output.width*.035,output.height*.51);ctx.rotate(-Math.PI/2);ctx.fillStyle='#50493D';ctx.font=`${Math.max(10,output.width*.012)}px "Work Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(copyright,0,0,output.height*.9);ctx.restore();
    ctx.save();ctx.translate(output.width*.965,output.height*.51);ctx.rotate(Math.PI/2);ctx.fillStyle='#E86408';ctx.font=`700 ${Math.max(12,output.width*.016)}px "Work Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('www.mandarinita.art',0,0,output.height*.72);ctx.restore();
    ctx.fillStyle='#E86408';ctx.font=`700 ${Math.max(12,output.width*.019)}px "Work Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('@mandarinita.art',output.width/2,output.height*.965,output.width*.35);
    return new Promise(resolve => output.toBlob(resolve, 'image/png'));
  }
  function roundedRect(ctx,x,y,w,h,r) { ctx.beginPath();if (ctx.roundRect) ctx.roundRect(x,y,w,h,r); else { ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath(); } }
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
  function downloadEditableProject(project, notify=true) {
    const clone = JSON.parse(JSON.stringify(project)); clone.selected = null;
    const bytes = new TextEncoder().encode(JSON.stringify(clone, null, 2));
    download(zipStore([{ name: 'proyecto.json', data: bytes }]), `${slugify(clone.title||'episodio')}.mandarinita`);
    if(notify)toast('Archivo editable .mandarinita descargado.');
  }
  async function exportSource() {
    const clone = captureState(); clone.selected = null;
    downloadEditableProject(clone);
  }
  async function exportReview() {
    state.format = $('#export-preset').value; state.exportStyle = $('#export-style').value || 'classic'; state.status = 'review'; const savedLocally = autosave();
    const title = state.title || 'Episodio nuevo'; const slug = slugify(title) || 'episodio-nuevo';
    const isEpisode=(state.contentType||'episode')==='episode';
    const metadata = isEpisode
      ? { schemaVersion: 1, editorialPolicy: 'manual-approval', exportTemplate:state.exportStyle, episodes: [{ id: slug, title: { es: title }, episodeNumber: null, status: 'review', type: 'comic', complete: false, source: { kind: 'editor-draft', instagramMediaId: null, instagramPermalink: null }, panels: state.panels.map((panel, index) => ({ order: index + 1, alt: { es: `Viñeta ${index + 1} pendiente de revisión` }, src: `assets/episodes/drafts/${slug}/vineta-${String(index + 1).padStart(2, '0')}.png` })) }] }
      : { schemaVersion:1, editorialPolicy:'manual-approval', exportTemplate:state.exportStyle, status:'review', published:false, contentType:state.contentType, title, projectSource:'proyecto.json', panels:state.panels.map((panel,index)=>({order:index+1,asset:`assets/content/drafts/${state.contentType}/${slug}/frame-${String(index+1).padStart(2,'0')}.png`,text:panel.items.filter(item=>item.type==='text'||item.type==='bubble').map(item=>({type:item.type,text:item.text||'',x:item.x,y:item.y,w:item.w,h:item.h,fontSize:item.fontSize||null,align:item.align||'center'}))})) };
    const files = [{ name: 'metadata-review.json', data: new TextEncoder().encode(JSON.stringify(metadata, null, 2)) }];
    for (let index = 0; index < state.panels.length; index++) { const image = await renderPanelPng(state.panels[index]); const path=isEpisode?`assets/episodes/drafts/${slug}/vineta-${String(index+1).padStart(2,'0')}.png`:`assets/content/drafts/${state.contentType}/${slug}/frame-${String(index+1).padStart(2,'0')}.png`; files.push({ name:path, data: new Uint8Array(await image.arrayBuffer()) }); }
    download(zipStore(files), `${slug}-revision.zip`); toast(savedLocally ? 'Paquete de revisión listo. No se publica automáticamente.' : 'Paquete listo; conserva el ZIP porque el borrador no cupo en este dispositivo.');
  }
  function slugify(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function download(blob, filename) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }
  async function removeFlatBackground(src,tolerance) {
    const image=await loadImage(src);const ratio=Math.min(1,2200/Math.max(image.naturalWidth,image.naturalHeight));const width=Math.max(1,Math.round(image.naturalWidth*ratio)),height=Math.max(1,Math.round(image.naturalHeight*ratio));
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,width,height);const output=ctx.getImageData(0,0,width,height),pixels=output.data;
    const points=[[0,0],[width-1,0],[0,height-1],[width-1,height-1],[Math.floor(width/2),0],[Math.floor(width/2),height-1],[0,Math.floor(height/2)],[width-1,Math.floor(height/2)]];
    const samples=points.map(([x,y])=>{const i=(y*width+x)*4;return [pixels[i],pixels[i+1],pixels[i+2]];});
    const distance=(i,color)=>Math.hypot(pixels[i]-color[0],pixels[i+1]-color[1],pixels[i+2]-color[2]);
    const clusters=samples.map(color=>samples.filter(other=>Math.hypot(color[0]-other[0],color[1]-other[1],color[2]-other[2])<=tolerance*1.4).length);const base=samples[clusters.indexOf(Math.max(...clusters))];
    const softLimit=tolerance+18,total=width*height,seen=new Uint8Array(total),queue=new Int32Array(total);let head=0,tail=0;
    const seed=index=>{if(index<0||index>=total||seen[index])return;const i=index*4;if(pixels[i+3]&&distance(i,base)<=softLimit){seen[index]=1;queue[tail++]=index;}};
    for(let x=0;x<width;x++){seed(x);seed((height-1)*width+x);}for(let y=1;y<height-1;y++){seed(y*width);seed(y*width+width-1);}
    let removed=0;
    while(head<tail){const index=queue[head++],i=index*4,d=distance(i,base);if(d<=tolerance){output.data[i+3]=0;removed++;}else output.data[i+3]=Math.round(output.data[i+3]*(d-tolerance)/18);
      const x=index%width;if(x)seed(index-1);if(x<width-1)seed(index+1);if(index>=width)seed(index-width);if(index<total-width)seed(index+width);
    }
    if(removed<Math.max(16,total*.002))return{removed:0,total};ctx.putImageData(output,0,0);return{src:canvas.toDataURL('image/png'),removed,total};
  }
  async function importProjectFile(file) {
    if (!file) return;
    try {
      let project;
      if (file.name.toLowerCase().endsWith('.json')) project = JSON.parse(await file.text());
      else project = JSON.parse(await readZipProject(await file.arrayBuffer()));
      validateEditableProject(project);
      state = normalizeProject(project); state.projectId = id(); state.title ||= file.name.replace(/\.(mandarinita|man|zip|json)$/i, ''); undoStack = []; redoStack = [];
      saveProject(); showEditor(); toast('Proyecto editable importado.');
    } catch (error) { console.error(error); toast(error instanceof Error ? error.message : 'No pude abrir ese archivo editable.'); }
  }
  function validateEditableProject(project) {
    if (!project || typeof project !== 'object' || Array.isArray(project) || !Array.isArray(project.panels) || !project.panels.length || !project.panels.every(panel => panel && typeof panel === 'object' && Array.isArray(panel.items))) {
      throw new Error('El archivo no contiene un proyecto editable con viñetas y capas.');
    }
    if (project.schemaVersion !== undefined && project.schemaVersion !== 1) throw new Error(`La versión ${project.schemaVersion} del archivo no es compatible con este editor.`);
    if (project.contentType !== undefined && !['episode', 'copy', 'banner', 'section'].includes(project.contentType)) throw new Error('El archivo tiene un tipo de contenido no compatible.');
    const itemTypes = new Set(['image', 'text', 'bubble', 'drawing']);
    const bubbleKinds = new Set(['dialogue', 'thought', 'narration', 'shout', 'sfx']);
    for (const panel of project.panels) for (const item of panel.items) {
      if (!item || typeof item !== 'object' || !itemTypes.has(item.type)) throw new Error('El proyecto contiene una capa con un tipo no compatible.');
      if (item.type === 'bubble' && !bubbleKinds.has(item.kind)) throw new Error('El proyecto contiene un tipo de globo no compatible.');
      if (item.type === 'image') {
        const source = String(item.src || '');
        const embedded = /^data:image\/[a-z0-9.+-]+(?:;[^,]*)?,/i.test(source);
        const local = /^\/?assets\/[a-zA-Z0-9/_.-]+$/.test(source) && !source.split('/').includes('..');
        if (!embedded && !local) throw new Error('Una capa apunta a una imagen externa o no válida. Descarga e incrusta el recurso antes de importar.');
      }
    }
    project.schemaVersion ??= 1;
  }
  function readZipProject(buffer) {
    const view = new DataView(buffer); const bytes = new Uint8Array(buffer); let offset = 0;
    while (offset + 30 < view.byteLength && view.getUint32(offset, true) === 0x04034b50) {
      const method = view.getUint16(offset + 8, true); const expectedCrc = view.getUint32(offset + 14, true); const compressedSize = view.getUint32(offset + 18, true); const uncompressedSize = view.getUint32(offset + 22, true); const nameLength = view.getUint16(offset + 26, true); const extraLength = view.getUint16(offset + 28, true);
      const nameStart = offset + 30; const name = new TextDecoder().decode(bytes.slice(nameStart, nameStart + nameLength)); const dataStart = nameStart + nameLength + extraLength; const data = bytes.slice(dataStart, dataStart + compressedSize);
      if (dataStart + compressedSize > view.byteLength || nameStart + nameLength > view.byteLength) throw new Error('El archivo editable está incompleto o dañado.');
      if (method !== 0) throw new Error('El ZIP usa una compresión que este editor aún no admite.');
      if (compressedSize !== uncompressedSize) throw new Error('El tamaño del archivo dentro del ZIP no coincide.');
      if (['proyecto.json', 'project.json'].includes(name)) {
        if (crc32(data) !== expectedCrc) throw new Error('La comprobación de integridad del proyecto falló. Vuelve a descargar o exportar el archivo.');
        return new TextDecoder().decode(data);
      }
      offset = dataStart + compressedSize;
    }
    throw new Error('El ZIP no contiene proyecto.json. Importa un .mandarinita creado por este editor.');
  }

  function installEvents() {
    document.addEventListener('click', event => { if (!event.target.closest('#canvas-context-menu')) closeCanvasContextMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCanvasContextMenu(); });
    const labeledIcon = (selector, iconName, label) => { const button = $(selector); button.innerHTML = `${svgIcon(iconName)}<span>${label}</span>`; };
    $('#undo').innerHTML = svgIcon('undo'); $('#redo').innerHTML = svgIcon('redo');
    labeledIcon('#upload-asset','plus',''); labeledIcon('#close-library','close',''); labeledIcon('#toggle-library','image','Biblioteca');
    labeledIcon('#toggle-layers','layers','Capas'); labeledIcon('#focus-mode','focus','Lienzo amplio');
    labeledIcon('#add-panel','plus','Viñeta'); labeledIcon('#add-bubble','bubble','Añadir globo');
    labeledIcon('#toggle-draw','pen','Dibujar'); labeledIcon('#toggle-grid','grid','Guías');
    $('#zoom-out').innerHTML = svgIcon('zoomOut'); $('#zoom-in').innerHTML = svgIcon('zoomIn'); $('#fit').innerHTML = `${svgIcon('fit')}<span>Ajustar</span>`;
    $('#new-project').onclick = newProject;
    $$('.content-type-card').forEach(button=>button.onclick=()=>{$('#new-content-dialog').close();createContentDraft(button.dataset.contentType);});
    $$('#template-dialog .template-card').forEach(button => button.onclick = () => { $('#template-dialog').close(); createProjectFromTemplate(button.dataset.template); });
    $('#import-project').onclick = () => $('#project-file').click();
    $('#project-file').onchange = event => importProjectFile(event.target.files[0]);
    $('#back-home').onclick = showHome;
    $('#save-project').onclick = () => { if (autosave()) toast(cloudUser ? 'Guardado local; sincronizando con GitHub.' : 'Guardado en este dispositivo.'); };
    $('#download-source').onclick = exportSource;
    $('#export-project').onclick = exportReview;
    $('#project-title').addEventListener('input', event => { state.title = event.currentTarget.textContent; autosave(); });
    $('#add-panel').onclick = addPanel;
    $('#add-cta-panel').onclick = addClosingPanel;
    $('#add-text').innerHTML = `${svgIcon('text')}<span>Texto</span>`; $('#add-text').onclick = () => addTextBlock();
    $('#add-bubble').onclick = () => addBubble($('#bubble-kind').value);
    $('#export-preset').onchange = event => changeFormat(event.target.value);
    $('#export-style').onchange = () => { state.exportStyle=$('#export-style').value; autosave(); toast('La plantilla de firma se aplicará a cada viñeta exportada.'); };
    $('#toggle-grid').onclick = event => { state.grid = !state.grid; event.currentTarget.setAttribute('aria-pressed', String(state.grid)); render(); };
    $('#zoom-in').onclick = () => adjustZoom(1.1);
    $('#zoom-out').onclick = () => adjustZoom(1 / 1.1);
    $('#fit').onclick = () => setZoom(1, $('#stage-wrap').getBoundingClientRect().left + $('#stage-wrap').clientWidth / 2, $('#stage-wrap').getBoundingClientRect().top + $('#stage-wrap').clientHeight / 2);
    const viewport = $('#stage-wrap');
    let resizeFrame = 0;
    window.addEventListener('resize', () => { if (!state) return; cancelAnimationFrame(resizeFrame); resizeFrame=requestAnimationFrame(render); });
    viewport.addEventListener('wheel', event => {
      if (!state || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault(); setZoom((state.zoom || 1) * Math.exp(-event.deltaY * .002), event.clientX, event.clientY);
    }, { passive:false });
    let spacePanning = false; let stagePan = null;
    window.addEventListener('keydown', event => { if (event.code === 'Space' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '') && !document.activeElement?.isContentEditable) { spacePanning = true; viewport.classList.add('pan-ready'); event.preventDefault(); } });
    window.addEventListener('keyup', event => { if (event.code === 'Space') { spacePanning = false; viewport.classList.remove('pan-ready'); } });
    viewport.addEventListener('pointerdown', event => {
      if (!(event.button === 1 || (event.button === 0 && spacePanning))) return;
      event.preventDefault(); stagePan = { x:event.clientX, y:event.clientY, left:viewport.scrollLeft, top:viewport.scrollTop, pointerId:event.pointerId };
      viewport.setPointerCapture(event.pointerId); viewport.classList.add('panning');
    });
    viewport.addEventListener('pointermove', event => {
      if (!stagePan || event.pointerId !== stagePan.pointerId) return;
      viewport.scrollLeft = stagePan.left - (event.clientX - stagePan.x); viewport.scrollTop = stagePan.top - (event.clientY - stagePan.y);
    });
    const finishStagePan = event => { if (!stagePan || event.pointerId !== stagePan.pointerId) return; if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId); stagePan = null; viewport.classList.remove('panning'); };
    viewport.addEventListener('pointerup', finishStagePan); viewport.addEventListener('pointercancel', finishStagePan);
    viewport.addEventListener('touchstart', event => {
      if (event.touches.length !== 2) return;
      event.preventDefault(); const [a,b] = event.touches; pinchZoom = { distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY), zoom:state.zoom||1, x:(a.clientX+b.clientX)/2, y:(a.clientY+b.clientY)/2 };
    }, { passive:false });
    viewport.addEventListener('touchmove', event => {
      if (!pinchZoom || event.touches.length !== 2) return;
      event.preventDefault(); const [a,b] = event.touches; const distance = Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
      const next = Math.max(.35,Math.min(2.5,pinchZoom.zoom*distance/pinchZoom.distance));
      if (Math.abs(next-state.zoom) > .008) { pinchZoom.x=(a.clientX+b.clientX)/2; pinchZoom.y=(a.clientY+b.clientY)/2; setZoom(next,pinchZoom.x,pinchZoom.y); }
    }, { passive:false });
    viewport.addEventListener('touchend', event => { if (event.touches.length < 2) pinchZoom=null; });
    $('#toggle-library').onclick = () => $('#app-shell').classList.toggle('library-collapsed');
    $('#toggle-layers').onclick = event => {
      if (matchMedia('(max-width:1100px)').matches) { const open=$('#inspector-panel').classList.toggle('open'); event.currentTarget.setAttribute('aria-pressed',String(open)); }
      else { const collapsed=$('#app-shell').classList.toggle('inspector-collapsed'); event.currentTarget.setAttribute('aria-pressed',String(!collapsed)); }
    };
    const setLibraryOpen = open => {
      $('#library-panel').classList.toggle('open', open);
      $('#mobile-library').setAttribute('aria-expanded', String(open));
      if (open) $('#close-library').focus({ preventScroll:true });
    };
    $('#mobile-library').onclick = () => setLibraryOpen(!$('#library-panel').classList.contains('open'));
    $('#close-library').onclick = () => setLibraryOpen(false);
    $('#mobile-properties').onclick = () => $('#inspector-panel').classList.toggle('open');
    $('#focus-mode').onclick = event => { const active = $('#app-shell').classList.toggle('focus-mode'); event.currentTarget.setAttribute('aria-pressed', String(active)); };
    $('#theme-toggle').onclick = () => {
      const choices = ['system','light','dark']; const current = getThemeChoice(); const next = choices[(choices.indexOf(current) + 1) % choices.length];
      localStorage.setItem('mandarinita-editor-theme', next); applyTheme(next);
    };
    $('#theme-toggle').querySelector('.ui-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z"/></svg>';
    $('#confirm-delete').onclick = () => { if (pendingDeleteId) deleteProject(pendingDeleteId); pendingDeleteId = null; };
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
    [['pen','Pluma','pen'],['marker','Marcador','marker'],['pencil','Lápiz','pencil']].forEach(([mode,label,icon]) => {
      const button = $(`#brush-${mode}`); button.innerHTML = svgIcon(icon); button.title = label; button.onclick = () => setDrawingBrush(mode);
    });
    $('#eraser-tool').innerHTML = svgIcon('eraser');
    $('#group-drawing').innerHTML = svgIcon('layersPlus'); $('#end-drawing-object').innerHTML = svgIcon('fit');
    $('#eraser-tool').onclick = () => { const enabled=$('#eraser-tool').getAttribute('aria-pressed')!=='true'; if(enabled){brushMode='eraser';$('#eraser-tool').setAttribute('aria-pressed','true');$('#eraser-tool').classList.add('active');['pen','marker','pencil'].forEach(name=>{const button=$(`#brush-${name}`);button.setAttribute('aria-pressed','false');button.classList.remove('active');});$('#toggle-draw').setAttribute('aria-pressed','true');$('#draw-toolbar').hidden=false;render();}else setDrawingBrush('pen'); };
    $('#group-drawing').onclick = () => { if(drawingObjectId){finishDrawingObject();return;} drawingObjectId = currentItem()?.type === 'drawing' ? currentItem().id : '__new_drawing_object__'; $('#end-drawing-object').hidden=false; $('#group-drawing').classList.add('active'); toast('Los siguientes trazos se unirán en un solo objeto.'); };
    $('#end-drawing-object').onclick = finishDrawingObject;
    $('#color-palette').addEventListener('click', event => { if (event.target.matches('.color-swatch')) { selectedColor = event.target.dataset.color; $$('.color-swatch').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.color===selectedColor))); } });
    $('#install-app').onclick = async () => {
      if (installPromptEvent) { installPromptEvent.prompt(); await installPromptEvent.userChoice; installPromptEvent=null; $('#install-app').hidden=true; }
      else $('#install-help-dialog').showModal();
    };
    window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPromptEvent=event; $('#install-app').hidden=false; });
    window.addEventListener('appinstalled', () => { $('#install-app').hidden=true; toast('Taller Mandarinita quedó instalado.'); });
    if (!matchMedia('(display-mode: standalone)').matches && !navigator.standalone) $('#install-app').hidden=false;
    $('#project-list').addEventListener('click', event => {
      const filter = event.target.closest('[data-project-filter]');
      if (filter) { $$('.project-filter').forEach(button => button.classList.toggle('active', button === filter)); renderProjectList(filter.dataset.projectFilter); }
    });
    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); $('#undo').click(); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); $('#redo').click(); }
      if (event.key === 'Delete' && state?.selected && !['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) $('#delete')?.click();
      if (event.key === 'Escape') { $('#library-panel').classList.remove('open','dragging-from-library'); $('#mobile-library').setAttribute('aria-expanded','false'); $('#inspector-panel').classList.remove('open'); }
    });
  }
  function setDrawMode(enabled) {
    $('#toggle-draw').setAttribute('aria-pressed', String(enabled)); $('#draw-toolbar').hidden = !enabled;
    if(!enabled){drawingObjectId=null;$('#end-drawing-object').hidden=true;$('#group-drawing').classList.remove('active');$('#eraser-tool').setAttribute('aria-pressed','false');$('#eraser-tool').classList.remove('active');setDrawingBrush('pen');}
    render();
  }
  function finishDrawingObject() { drawingObjectId=null; $('#end-drawing-object').hidden=true; $('#group-drawing').classList.remove('active'); toast('Objeto de dibujo cerrado.'); }
  function setDrawingBrush(mode) { brushMode=mode; $('#eraser-tool').setAttribute('aria-pressed','false'); $('#eraser-tool').classList.remove('active'); ['pen','marker','pencil'].forEach(name=>{const button=$(`#brush-${name}`);button.setAttribute('aria-pressed',String(name===mode));button.classList.toggle('active',name===mode);}); }
  function installPalette() {
    const root = $('#color-palette');
    PALETTE.forEach(color => { const button = document.createElement('button'); button.className = 'color-swatch'; button.dataset.color = color; button.style.background = color; button.title = color; button.setAttribute('aria-label', `Trazo ${color}`); if (color === '#FFFFFF') button.classList.add('white-swatch'); root.append(button); });
    const custom = document.createElement('input'); custom.type = 'color'; custom.value = selectedColor; custom.setAttribute('aria-label', 'Elegir color'); custom.oninput = () => { selectedColor = custom.value; }; root.append(custom);
  }
  function crc32(bytes) { let crc = -1; for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); } return (crc ^ -1) >>> 0; }
  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

  function getThemeChoice() {
    const saved = localStorage.getItem('mandarinita-editor-theme');
    return saved === 'dark' || saved === 'light' ? saved : 'system';
  }
  function applyTheme(choice = getThemeChoice()) {
    const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = choice === 'dark' || (choice === 'system' && systemDark);
    document.documentElement.classList.toggle('theme-dark', dark);
    document.documentElement.dataset.themeChoice = choice;
    const label = choice === 'system' ? 'Sistema' : choice === 'dark' ? 'Oscuro' : 'Claro';
    $('#theme-toggle').title = `Tema: ${label} · cambiar`;
    $('#theme-toggle').setAttribute('aria-label', `Tema ${label}. Cambiar tema`);
  }
  migrateLegacyProject();
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (getThemeChoice() === 'system') applyTheme('system'); });
  installEvents(); setupResourceFilters(); installPalette(); renderProjectList(); setupCloudSync();
  if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('/editor-service-worker.js', { scope:'/' }).catch(() => {});
})();
