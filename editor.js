(() => {
  const PROJECTS_KEY = 'mandarinita-editor-projects-v1';
  const PROJECT_KEY = id => `mandarinita-editor-project-v1:${id}`;
  const LEGACY_KEY = 'mandarinita-editor-project';
  const LOGICAL_WIDTH = 600;
  let exportPreviewUrls = [];
  let publishReviewUrls = [];
  let publishPreviewReady = false;
  let publishPreviewError = '';
  let publishKnownNumbers = [];
  const FORMAT = {
    web: { width: 1200, height: 800, logicalHeight: 400, label: 'Web 3:2' },
    square: { width: 1080, height: 1080, logicalHeight: 600, label: 'Instagram 1:1' },
    portrait: { width: 1080, height: 1350, logicalHeight: 750, label: 'Instagram 4:5' }
  };
  const PALETTE = ['#282522', '#F87209', '#607D3B', '#A8522B', '#FFFFFF', '#F7C843', '#6CA8A4'];
  const people = [
    { name: 'Mando Mandarinita', aliases: ['mando', 'mandarino', 'señor mandarino', 'sr. mandarino'], variants: [
      { name: 'Pose completa · episodio 46.3', src: 'assets/characters/mando-transparent.webp' },
      { name: 'Ojos entrecerrados · episodio 82.3', src: 'assets/characters/mando-episodio-82-3.png' }
    ] },
    { name: 'Mandy Mandarinita', aliases: ['mandy', 'mandarinita'], variants: [
      { name: 'Pose completa aislada', src: 'assets/characters/mandy-transparent.webp' }
    ] },
    { name: 'Greg el Zanahorio', aliases: ['greg', 'zanahorio', 'zanahoria'], variants: [
      { name: 'Pose del catálogo', src: 'assets/characters/greg-transparent.webp' },
      { name: 'De pie · episodio 14.1', src: 'assets/characters/greg-episodio-14-1.png' },
      { name: 'Gesto de hablar · episodio 82.1', src: 'assets/characters/greg-episodio-82-1.png' }
    ] },
    { name: 'Limón Agrio', aliases: ['limón', 'limon agrio'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/limon-agrio-transparent.webp' }] },
    { name: 'Aguacatelo', aliases: ['aguacate'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/aguacatelo-transparent.png' }] },
    { name: 'Morita', aliases: ['mora'], variants: [
      { name: 'Pose del catálogo', src: 'assets/characters/morita.png' },
    ] },
    { name: 'Sra. Pera', aliases: ['pera', 'señora pera'], variants: [{ name: 'Recorte transparente', src: 'assets/characters/sra-pera-transparent.webp' }] },
    { name: 'Champi Ñón', aliases: ['champi', 'champiñón', 'champi ñon', 'hongo'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/champi-transparent.webp' }] },
    { name: 'Los Cherrys', aliases: ['cherry', 'cherrys', 'cereza', 'cerezas'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/cherrys-transparent.webp' }] },
    { name: 'Don Guineo', aliases: ['guineo', 'banana', 'banano'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/don-guineo-transparent.webp' }] },
    { name: 'Don Pepino', aliases: ['pepino'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/don-pepino-transparent.webp' }] },
    { name: 'Don Manzanillo', aliases: ['manzanillo', 'manzana'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/manzanillo-transparent.webp' }] },
    { name: 'Sandy la Sandía', aliases: ['sandy', 'sandía', 'sandia'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/sandy-transparent.webp' }] },
    { name: 'Superfreso', aliases: ['superfreso', 'freso', 'fresa'], variants: [{ name: 'Pose aprobada', src: 'assets/characters/superfreso-transparent.webp' }] }
  ].map(x => ({ ...x, category: 'character', approvedCutout: true }));
  const stickers = [
    { name: 'Logotipo Mandarinita', aliases: ['logo', 'marca', 'mandarinita', 'sello'], variants: [
      { name: 'Color oficial', src: 'assets/mandarinita-logo.svg' },
      { name: 'Blanco para fondos oscuros', src: 'assets/mandarinita-logo-white.svg' }
    ], category: 'sticker', approvedCutout: true },
    { name: 'Rostro sonriente de Mandy', aliases: ['mandy', 'mandarinita', 'cara sonriente', 'sticker mandy'], variants: [{ name: 'Retrato transparente', src: 'assets/mandarinita-smile.png' }], category: 'sticker', approvedCutout: true },
    { name: 'Rostro neutral de Mando', aliases: ['mando', 'mandarino', 'cara neutral', 'sticker mando'], variants: [{ name: 'Retrato transparente', src: 'assets/sr-mandarino-neutral.png' }], category: 'sticker', approvedCutout: true },
    { name: 'Sticker frutal · 02', aliases: ['sticker 2', 'pack 2'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-02.webp' }], category: 'sticker', approvedCutout: true },
    { name: 'Sticker zanahoria · 03', aliases: ['sticker 3', 'pack 3'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-03.webp' }], category: 'sticker', approvedCutout: true },
    { name: 'Sticker frutal · 04', aliases: ['sticker 4', 'pack 4'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-04.webp' }], category: 'sticker', approvedCutout: true },
    { name: 'Sticker frutal · 06', aliases: ['sticker 6', 'pack 6', 'expresión frutal'], variants: [{ name: 'Sticker existente', src: 'assets/stickers/sticker-pack-06.webp' }], category: 'sticker', approvedCutout: true },
    { name: 'Sticker frutal · 07', aliases: ['sticker 7', 'pack 7'], variants: [{ name: 'Sticker aprobado', src: 'assets/stickers/sticker-pack-07.webp' }], category: 'sticker', approvedCutout: true }
  ];
  const objects = [];
  const backgrounds = [
    { name: 'Cielo y nubes · episodio 85.1', aliases: ['cielo', 'nubes', 'fondo celeste', 'episodio 85'], src: 'assets/backgrounds/review/sky-clouds-episode-85-1.png', category: 'background', approvedCutout: true }
  ];
  const reviewCharacterCutouts = [
    { name: 'Mando · expresión de calor · episodio 87.1', aliases: ['mando', 'mandarino', 'episodio 87', 'calor'], src: 'assets/characters/review/mando-episode-87-1-review.png', source: 'assets/episodes/ep-087-eso-es-mental-decian-nada-facil-la-temperatura-en-la-cap/87.1.png', note: 'Pose completa recortada de una etapa anterior del dibujo. Conserva el óvalo amarillo de suelo del panel; revisar si debe permanecer.' },
    { name: 'Mando · expresión del episodio 1.1', aliases: ['mando', 'mandarino', 'mandarín', 'sonriente', 'episodio 1'], src: 'docs/art-review/cutouts/mando-episodio-01-1-borrador.png', source: 'assets/episodes/ep-001-la-mosca/01.1.png', note: 'Recorte piloto con sombra en los pies; revisar el borde antes de aprobar.' },
    { name: 'Mandy · gesto del episodio 1.1', aliases: ['mandy', 'mandarinita', 'episodio 1'], src: 'docs/art-review/cutouts/mandy-episodio-01-1-borrador.png', source: 'assets/episodes/ep-001-la-mosca/01.1.png', note: 'Recorte piloto con sombra en los pies; revisar la pose y el borde antes de aprobar.' },
    { name: 'Mando · sorprendido · episodio 1.3', aliases: ['mando', 'mandarino', 'sorprendido', 'episodio 1'], src: 'docs/art-review/cutouts/mando-episodio-01-3-borrador.png', source: 'assets/episodes/ep-001-la-mosca/01.3.png', note: 'Recorte piloto con sombra; confirmar el contorno antes de aprobar.' },
    { name: 'Mando · episodio 14.1', aliases: ['mando', 'mandarino', 'episodio 14'], src: 'docs/art-review/cutouts/mando-episodio-14-1-borrador.png', source: 'assets/episodes/ep-014-un-dia-malo/14.1.png', note: 'Borrador de recorte con retoque de las puntas de los pies; requiere revisión.' },
    { name: 'Greg · episodio 14.1', aliases: ['greg', 'zanahorio', 'episodio 14'], src: 'docs/art-review/cutouts/greg-episodio-14-1-borrador.png', source: 'assets/episodes/ep-014-un-dia-malo/14.1.png', note: 'Borrador de recorte con retoque de las puntas de los pies; requiere revisión.' },
    { name: 'Morita · pose de pie · episodio 59.1', aliases: ['morita', 'episodio 59', 'pose de pie'], src: 'assets/characters/review/morita-episode-59-1-review.png', source: 'assets/episodes/ep-059-no-juegues-asi/59.1.png', note: 'Borrador basado en los píxeles originales. Queda algo de sombra de la escena; revisar contorno y patas.' },
    { name: 'Morita · lengua afuera · episodio 59.2', aliases: ['morita', 'episodio 59', 'lengua', 'sorprendida'], src: 'assets/characters/review/morita-episode-59-2-review.png', source: 'assets/episodes/ep-059-no-juegues-asi/59.2.png', note: 'Borrador basado en los píxeles originales. Conserva el efecto turquesa visible en esta pose; confirmar si debe formar parte del componente.' },
    { name: 'Morita · pose horizontal · episodio 59.3', aliases: ['morita', 'episodio 59', 'horizontal'], src: 'assets/characters/review/morita-episode-59-3-review.png', source: 'assets/episodes/ep-059-no-juegues-asi/59.3.png', note: 'Recorte de píxeles originales en pose horizontal. Revisa la silueta y decide si se conserva sin los efectos de polvo del panel.' },
    { name: 'Morita · pose horizontal · episodio 59.4', aliases: ['morita', 'episodio 59', 'horizontal'], src: 'assets/characters/review/morita-episode-59-4-review.png', source: 'assets/episodes/ep-059-no-juegues-asi/59.4.png', note: 'Recorte de píxeles originales en pose horizontal. El polvo independiente del panel no se incluyó; revisar la separación.' }
  ].map(resource => ({ ...resource, category: 'character', approvedCutout: false, reviewOnly: true }));
  const stickerReviewAssets = [
    { name: 'Sticker existente · pack 01', aliases: ['sticker 1', 'pack 1'], src: 'assets/stickers/sticker-pack-01.webp', source: 'assets/stickers/sticker-pack-01.webp', note: 'Asset cuadrado opaco del pack existente. Se conserva como referencia; no se le quitó el fondo ni se asignó a un personaje.', reviewKind: 'existing-sticker' },
    { name: 'Sticker existente · pack 05', aliases: ['sticker 5', 'pack 5', 'logo'], src: 'assets/stickers/sticker-pack-05.webp', source: 'assets/stickers/sticker-pack-05.webp', note: 'Asset cuadrado opaco del pack existente. Contiene el logotipo sobre un círculo amarillo; se conserva como referencia, no como recorte de personaje.', reviewKind: 'existing-sticker' }
  ].map(resource => ({ ...resource, category: 'sticker', approvedCutout: false, reviewOnly: true }));
  const reviewObjectCutouts = [
    { name: 'Clip de papel · episodio 85.3', aliases: ['clip', 'paperclip', 'sujetapapeles', 'episodio 85'], src: 'assets/objects/review/paperclip-episode-85-3-review.png', source: 'assets/episodes/ep-085-lo-que-siempre-te-pasa/85.3.png', note: 'Recorte en líneas grises de un clip personificado con brazos y piernas. No se le asignó nombre ni se decidió si debe catalogarse como objeto o personaje.', reviewKind: 'object-cutout' },
    { name: 'Sobre personificado · episodio 85.1', aliases: ['sobre', 'carta', 'episodio 85'], src: 'assets/objects/review/envelope-episode-85-1-review.png', source: 'assets/episodes/ep-085-lo-que-siempre-te-pasa/85.1.png', note: 'Recorte de la figura de sobre con cara y extremidades. Sigue en revisión para confirmar si la biblioteca debe clasificarlo como objeto o personaje.', reviewKind: 'object-cutout' },
    { name: 'Inodoro y portarrollos · episodio 77.3', aliases: ['inodoro', 'baño', 'toilet', 'rollo de papel', 'episodio 77'], src: 'assets/objects/review/toilet-episode-77-3-review.png', source: 'assets/episodes/ep-077-no-arrojar-papeles/77.3.jpg', note: 'Recorte del inodoro y su portarrollos. Se quitó el campo turquesa por color; queda algo de sombra gris del panel en el borde inferior.', reviewKind: 'object-cutout' }
  ].map(resource => ({ ...resource, category: 'object', approvedCutout: false, reviewOnly: true }));
  const backgroundColors = [
    { name: 'Blanco limpio', color: '#FFFFFF', source: 'Base' },
    { name: 'Crema Mandarinita', color: '#FFF8EC', source: 'Marca' },
    { name: 'Naranja Mandarinita', color: '#F87209', source: 'Marca' },
    { name: 'Verde Mandarinita', color: '#607D38', source: 'Marca' },
    { name: 'Amarillo Mandarinita', color: '#FAC421', source: 'Marca' },
    { name: 'Morado Mandarinita', color: '#68387D', source: 'Marca' },
    { name: 'Miel cálida', color: '#FFDB9F', source: 'Episodio 5 · 05.1' },
    { name: 'Arena dorada', color: '#EBD79B', source: 'Episodio 14 · 14.1' },
    { name: 'Amarillo sol', color: '#FFC551', source: 'Episodio 31 · 31.1' },
    { name: 'Lila vivo', color: '#B490FF', source: 'Episodio 36 · 36.1' },
    { name: 'Cian tropical', color: '#36F0FF', source: 'Episodio 37 · 37.1' },
    { name: 'Verde lima', color: '#B7FF48', source: 'Episodio 42 · 42.1' },
    { name: 'Azul cielo', color: '#87DEFA', source: 'Episodio 52 · 52.1' },
    { name: 'Azul claro', color: '#93CCFF', source: 'Episodio 70 · 70.1' }
  ];
  const resources = [...people, ...stickers, ...objects, ...backgrounds].filter(resource => resource.approvedCutout);
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
  let layerDragId = null;
  let installPromptEvent = null;
  let suppressAssetClickUntil = 0;
  let pinchZoom = null;
  let backgroundPickerItemId = null;
  let cloudUser = null;
  let cloudConfigured = false;
  let cloudReady = false;
  let cloudSyncInProgress = false;
  let cloudRefreshTimer = null;
  let cloudPollTimer = null;
  let cloudAuthExpired = false;
  let cloudBannerDismissed = false;
  let cloudBannerKey = '';
  const cloudTimers = new Map();
  const cloudBases = new Map();
  const cloudConflicts = new Set();
  let pendingCloudConflict = null;

  // Small inline subset of the open-source Lucide icon set (ISC) keeps controls crisp offline.
  const ICON = {
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.2 4.1M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4-.8"/>',
    sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 11 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8L2.5 4.5l1.8-.7L5 2Z"/>',
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
    move: '<path d="M12 2v20M2 12h20M12 2l-3 3m3-3 3 3M12 22l-3-3m3 3 3-3M2 12l3-3m-3 3 3 3m16-3-3-3m3 3-3 3"/>',
    eraser: '<path d="m7 21-4.3-4.3a2.4 2.4 0 0 1 0-3.4L13.3 2.7a2.4 2.4 0 0 1 3.4 0l4.6 4.6a2.4 2.4 0 0 1 0 3.4L11 21H7zM5 14l5 5M12 21h9"/>'
    ,marker: '<path d="m15 4 5 5M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20zM3 21h18"/>',
    pencil: '<path d="m15 5 4 4M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"/>',
    layersPlus: '<path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5M19 3v6M16 6h6"/>',
    text: '<path d="M4 6V4h16v2M12 4v16M8 20h8"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrowLeft: '<path d="m15 18-6-6 6-6M9 12h12"/>',
    flipH: '<path d="M8 3 3 12l5 9V3Zm8 0 5 9-5 9V3ZM12 3v18"/>',
    flipV: '<path d="M3 8 12 3l9 5H3Zm0 8 9 5 9-5H3Zm9-4v8"/>',
    eyedropper: '<path d="m2 22 1-1h3l9-9m-6-6 8 8m-4-10 3-3 6 6-3 3M5 19l-2 2"/>',
    edit: '<path d="m18 2 4 4L8 20l-5 1 1-5L18 2zM15 5l4 4"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    minimize: '<path d="M8 3v5H3m18 0h-5V3m0 18v-5h5M3 16h5v5"/>',
    panelPlus: '<rect x="3" y="4" width="13" height="16" rx="1"/><path d="M19 8v8m-4-4h8"/>',
    send: '<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>',
    logIn: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4 5-5-5-5m5 5H3"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07 7.07-1.42-1.42M6.35 6.35 4.93 4.93m14.14 0-1.42 1.42M6.35 17.65l-1.42 1.42"/>',
    moon: '<path d="M20.985 12.486A9 9 0 1 1 11.514 3.015a7 7 0 0 0 9.471 9.471Z"/>',
    monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    fileDown: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6m-8 3v7m0 0 3-3m-3 3-3-3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5-5 5 5m-5-5v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>',
    cloud: '<path d="M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.6 1.8A4 4 0 0 0 7 17h3m2-4v9m-3-3 3 3 3-3"/>',
    cloudDownload: '<path d="M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.6 1.8A4 4 0 0 0 7 17h3m2-4v9m-3-3 3 3 3-3"/>',
    cloudUpload: '<path d="M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.6 1.8A4 4 0 0 0 7 17h3m2 5v-9m-3 3 3-3 3 3"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>',
    replace: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75"/><circle cx="10" cy="7" r="4"/>',
    box: '<path d="m21 8-9 5-9-5m9 13V13m8-5v10l-8 4-8-4V8l8-5z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    panelLeft: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
    sliders: '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 8h4"/>',
    frame: '<path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2"/>',
    type: '<path d="M4 6V4h16v2M12 4v16m-4 0h8"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    megaphone: '<path d="m3 11 18-5v12L3 13v-2zm0 2 2 7h4l-2-6m10-6v12"/>',
    columns: '<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/>',
    cloudSun: '<path d="M12 2v2m-7.1.9 1.4 1.4M2 12h2m15 0h3M5 19h12a4 4 0 0 0 0-8h-.5A6.5 6.5 0 0 0 5 13.5 3.5 3.5 0 0 0 5 19Z"/>'
  };
  const svgIcon = (name, cls = 'ui-icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[name] || ICON.image}</svg>`;

  const PROJECT_ID_PATTERN = /^[a-zA-Z0-9_-]{1,100}$/;
  function id() { return crypto.randomUUID?.() || Math.random().toString(36).slice(2, 12); }
  function validProjectId(value) { return typeof value === 'string' && PROJECT_ID_PATTERN.test(value); }
  function uniqueProjectId(used = new Set()) {
    let candidate;
    do { candidate = id(); } while (!validProjectId(candidate) || used.has(candidate) || localStorage.getItem(PROJECT_KEY(candidate))!==null);
    return candidate;
  }
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
    if (!validProjectId(normalized.projectId)) normalized.projectId = id();
    normalized.contentType ||= 'episode';
    normalized.format = FORMAT[normalized.format] ? normalized.format : 'web';
    normalized.exportStyle = ['classic','cream','footer','bleed'].includes(normalized.exportStyle) ? normalized.exportStyle : 'classic';
    normalized.pageHeight = normalized.pageHeight || FORMAT[normalized.format].logicalHeight;
    normalized.panels = Array.isArray(normalized.panels) && normalized.panels.length ? normalized.panels : [{ id: id(), items: [] }, { id: id(), items: [] }];
    normalized.panels.forEach(p => { p.id ||= id(); p.items ||= []; });
    normalized.active = Math.max(0, Math.min(Number(normalized.active) || 0, normalized.panels.length - 1));
    normalized.selected = null;
    return normalized;
  }
  function saveProject(project = state) {
    if (!validProjectId(project.projectId)) project.projectId = id();
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
    const buttonLabel = signedIn ? (cloudAuthExpired ? 'Reconectar GitHub' : `Salir · ${cloudUser.login}`) : cloudConfigured ? 'Conectar GitHub' : 'Nube pendiente';
    const buttonIcon = signedIn ? (cloudAuthExpired ? 'refresh' : 'logOut') : cloudConfigured ? 'logIn' : 'cloud';
    button.classList.add('has-icon');
    button.innerHTML = `${svgIcon(buttonIcon)}<span class="button-label">${escapeHTML(buttonLabel)}</span>`;
    button.classList.toggle('connected', signedIn);
    button.title = signedIn ? (cloudAuthExpired ? 'Volver a iniciar sesión con GitHub' : `Cerrar sesión de GitHub · ${cloudUser.login}`) : message || 'Conectar la cuenta privada de GitHub';
    button.setAttribute('aria-label', button.title);
    const text = message || (signedIn ? 'Sincronización al día' : 'Los borradores se guardan en este dispositivo.');
    ['#cloud-status','#editor-cloud-status'].forEach(selector => { const region=$(selector); if(region){region.textContent=text;region.dataset.state=syncState;} });
    ['#retry-cloud','#editor-retry-cloud'].forEach(selector => { const retry=$(selector); if(retry){retry.hidden=!(signedIn&&(syncState==='error'||cloudConflicts.size));const label=cloudConflicts.size?'Resolver conflicto':'Reintentar sincronización';retry.classList.add('has-icon');retry.innerHTML=`${svgIcon(cloudConflicts.size?'users':'refresh')}<span class="button-label">${label}</span>`;retry.title=label;retry.setAttribute('aria-label',label);} });
    const banner=$('#cloud-sync-banner');
    if(banner){
      const key=`${syncState}:${text}`;
      if(syncState==='busy')cloudBannerDismissed=false;
      if((syncState==='error'||syncState==='conflict')&&key!==cloudBannerKey){cloudBannerDismissed=false;cloudBannerKey=key;}
      if(syncState==='ready'){cloudBannerKey='';cloudBannerDismissed=false;}
      banner.dataset.state=syncState;
      banner.hidden=!signedIn||!['error','conflict'].includes(syncState)||cloudBannerDismissed;
    }
    const footnote = $('#home-footnote');
    const storageLabel = $('#project-storage-label');
    if (storageLabel) storageLabel.textContent = signedIn ? syncState==='error'?'CENTRO DE CONTENIDO · SINCRONIZACIÓN PENDIENTE':syncState==='busy'?'CENTRO DE CONTENIDO · SINCRONIZANDO':syncState==='conflict'?'CENTRO DE CONTENIDO · CONFLICTO POR REVISAR':'CENTRO DE CONTENIDO · NUBE SINCRONIZADA' : 'CENTRO DE CONTENIDO · BORRADORES';
    if (footnote) footnote.textContent = signedIn
      ? syncState==='error'?'Los cambios recientes siguen guardados en este dispositivo. Revisa el mensaje de sincronización y vuelve a intentarlo.':'Tus borradores y lienzos se sincronizan en la nube privada. Inicia sesión con la misma cuenta autorizada en tus dispositivos para verlos allí.'
      : 'Tus borradores se guardan en este navegador. El archivo .mandarinita sirve para moverlos a otro dispositivo.';
  }
  async function cloudFetch(path, options = {}) {
    let response;
    try { response = await fetch(path, { cache:'no-store', ...options, credentials: 'same-origin', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } }); }
    catch (cause) { const error = new Error('El navegador no logró completar la solicitud.'); error.code = 'cloud_network_error'; error.syncPath = path; error.cause = cause; throw error; }
    let body = {};
    try { body = await response.json(); } catch { /* Surface status when a proxy returned a non-JSON response. */ }
    if (!response.ok) { const error=new Error(body.error || `Sincronización: ${response.status}`);error.status=response.status;error.code=body.code||'';throw error; }
    return body;
  }
  function loadCloudBases() {
    try { for (const [key,value] of Object.entries(JSON.parse(localStorage.getItem('mandarinita-editor-sync-bases-v1')||'{}'))) cloudBases.set(key,value); }
    catch { /* A bad local sync index must not prevent local drafts from opening. */ }
  }
  function migrateInvalidLocalProjectIds() {
    const records = listProjects(); if(!Array.isArray(records))return false;
    let changed = false; const obsoleteKeys=[]; const usedIds = new Set(records.map(record=>record?.id).filter(validProjectId));
    const next = records.map(record => {
      try {
        if(!record||typeof record!=='object')return record;
        const oldId = record.id; const raw = localStorage.getItem(PROJECT_KEY(String(oldId??''))); if (!raw) return record;
        let project = JSON.parse(raw);
        if(!project||typeof project!=='object'||Array.isArray(project))return record;
        if(validProjectId(oldId)&&project.projectId===oldId){usedIds.add(oldId);return record;}
        let nextId;
        if(validProjectId(oldId))nextId=oldId;
        else if(validProjectId(project.projectId)&&!usedIds.has(project.projectId))nextId=project.projectId;
        else nextId=uniqueProjectId(usedIds);
        if(nextId!==oldId&&localStorage.getItem(PROJECT_KEY(nextId))!==null)nextId=uniqueProjectId(usedIds);
        const idMismatch=project.projectId!==nextId;
        project=normalizeProject({...project,projectId:nextId}); project.projectId=nextId;
        if(idMismatch)project.updatedAt=Math.max(Date.now(),(Number(project.updatedAt)||0)+1);
        localStorage.setItem(PROJECT_KEY(nextId),JSON.stringify(project));
        if(oldId!==nextId)obsoleteKeys.push(PROJECT_KEY(String(oldId??'')));
        if(oldId!==nextId)cloudBases.delete(oldId);
        usedIds.add(nextId); changed = true;
        return { ...record, id: nextId, title: project.title || record.title, updatedAt: project.updatedAt || record.updatedAt };
      } catch { return record; }
    });
    if (!changed) return false;
    next.sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0));
    try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(next)); }
    catch { return false; }
    obsoleteKeys.forEach(key=>localStorage.removeItem(key));
    try { localStorage.setItem('mandarinita-editor-sync-bases-v1', JSON.stringify(Object.fromEntries(cloudBases))); } catch {}
    return true;
  }
  function saveCloudBase(projectId, etag, localUpdatedAt) {
    if (!etag) return;
    cloudBases.set(projectId,{etag,localUpdatedAt:Number(localUpdatedAt)||0});
    try { localStorage.setItem('mandarinita-editor-sync-bases-v1',JSON.stringify(Object.fromEntries(cloudBases))); }
    catch { /* The remote copy is still authoritative even if this tiny cache cannot persist. */ }
  }
  async function readRemoteProject(projectId) {
    const path=`/api/projects/${encodeURIComponent(projectId)}`;
    let response;
    try { response=await fetch(path,{credentials:'same-origin',cache:'no-store'}); }
    catch (cause) { const error=new Error('El navegador no logró descargar el borrador.');error.code='cloud_network_error';error.syncPath=path;error.cause=cause;throw error; }
    let project;try{project=await response.json();}catch{project=null;}
    if (!response.ok) { const error=new Error(project?.error||`No se pudo descargar la versión de la nube (error ${response.status}).`);error.status=response.status;error.code=project?.code||'';throw error; }
    if (!project || typeof project !== 'object' || Array.isArray(project)) { const error=new Error('La nube devolvió un archivo que no es un borrador editable.');error.status=422;error.code='incompatible_remote_project';throw error; }
    const storedId=project.projectId;
    project.projectId=projectId;
    try { validateEditableProject(project); }
    catch (cause) { const error=new Error(cause instanceof Error?cause.message:'El borrador de la nube usa un formato no compatible.');error.status=422;error.code='incompatible_remote_project';error.cause=cause;throw error; }
    if (storedId !== projectId) console.warn('Cloud project ID repaired from its storage key', { projectId, hadStoredId: Boolean(storedId) });
    return {project,etag:response.headers.get('ETag')};
  }
  function repairCloudProjectId(project) {
    const oldId=project.projectId;
    const records=listProjects();
    const used=new Set(records.map(record=>record?.id).filter(validProjectId));
    const newId=uniqueProjectId(used);
    const latest=state?.projectId===oldId?captureState():project;
    const repaired=normalizeProject({...latest,projectId:newId,updatedAt:Date.now()});
    repaired.projectId=newId;
    localStorage.setItem(PROJECT_KEY(newId),JSON.stringify(repaired));

    let oldRecordId=records.find(record=>record?.id===oldId)?.id;
    if(!oldRecordId) {
      oldRecordId=records.find(record=>{
        try { return JSON.parse(localStorage.getItem(PROJECT_KEY(record.id))||'null')?.projectId===oldId; }
        catch { return false; }
      })?.id;
    }
    const existing=records.find(record=>record?.id===oldRecordId)||{};
    const updatedRecord={id:newId,title:repaired.title||existing.title||'Contenido sin título',contentType:repaired.contentType||existing.contentType||'episode',status:repaired.status||existing.status||'draft',createdAt:repaired.createdAt||existing.createdAt||Date.now(),updatedAt:repaired.updatedAt};
    const next=records.filter(record=>record?.id!==oldRecordId&&record?.id!==oldId);
    next.push(updatedRecord); next.sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0));
    localStorage.setItem(PROJECTS_KEY,JSON.stringify(next));
    if(oldRecordId&&oldRecordId!==newId)localStorage.removeItem(PROJECT_KEY(oldRecordId));
    if(oldId&&oldId!==newId)localStorage.removeItem(PROJECT_KEY(oldId));
    if(oldRecordId)cloudBases.delete(oldRecordId);
    if(oldId)cloudBases.delete(oldId);
    try { localStorage.setItem('mandarinita-editor-sync-bases-v1',JSON.stringify(Object.fromEntries(cloudBases))); } catch {}
    if(state?.projectId===oldId){state.projectId=newId;state.updatedAt=repaired.updatedAt;}
    Object.assign(project,repaired);
    return repaired;
  }
  async function pushCloudProject(project) {
    let candidate=project;
    let repaired=false;
    while(true){
      if(!validProjectId(candidate.projectId)){candidate=repairCloudProjectId(candidate);repaired=true;}
      const base=cloudBases.get(candidate.projectId);
      const headers=base?.etag?{'If-Match':base.etag}:{'If-None-Match':'*'};
      try {
        const result=await cloudFetch(`/api/projects/${encodeURIComponent(candidate.projectId)}`,{method:'PUT',body:JSON.stringify(candidate),headers});
        saveCloudBase(candidate.projectId,result.etag||'',candidate.updatedAt);
        return result;
      } catch(error) {
        if(error?.code==='invalid_project_id'&&!repaired){candidate=repairCloudProjectId(candidate);repaired=true;continue;}
        throw error;
      }
    }
  }
  function setSyncFailure(error, step = 'guardar el borrador') {
    if(error?.status===401)cloudAuthExpired=true;
    const message=error?.status===401?'La sesión venció. Vuelve a conectar GitHub para sincronizar.'
      :error?.status===403?'Cloudflare rechazó la solicitud (403). Abre el taller desde mandarinita.art y vuelve a intentar.'
      :error?.status===413?'El archivo supera el límite de 25 MB; descarga el .mandarinita como respaldo.'
      :error?.name==='QuotaExceededError'?'Este navegador se quedó sin espacio para la copia local. Tus archivos de la nube siguen intactos; libera espacio y vuelve a sincronizar.'
      :error?.status===428?'Esta versión del taller está desactualizada (428). Recarga la página para actualizarla; tu borrador local sigue guardado.'
      :error?.status>=500?`Cloudflare no pudo guardar el borrador (error ${error.status}). Sigue guardado en este dispositivo.`
      :error?.code==='invalid_project_id'?'La nube no aceptó el identificador de este borrador. Se conservó localmente; pulsa “Reintentar sincronización” para volver a intentarlo.'
      :error?.status===400?`La nube rechazó el borrador: ${(error.message||'la solicitud no es válida').replace(/[.!?]+$/,'')}. El borrador local sigue guardado.`
      :Number.isInteger(error?.status)?`No se pudo sincronizar (error ${error.status}). ${error.message&&error.message!==`Sincronización: ${error.status}`?`${error.message} `:''}El borrador sigue guardado en este dispositivo.`
      :error?.code==='cloud_network_error'?`El navegador no pudo conectar con Cloudflare${error.syncPath?` al solicitar ${error.syncPath.startsWith('/api/projects/')?'/api/projects/[id]':error.syncPath}`:''}. Comprueba la conexión y reintenta; el borrador sigue guardado en este dispositivo.`
      :`Falló ${step}${error?.message?`: ${String(error.message).slice(0,180)}`:''}. El borrador sigue guardado en este dispositivo.`;
    console.error('Cloud synchronization failed', { step, name: error?.name||'Error', code: error?.code||'', status: error?.status||0, endpoint: error?.syncPath||'', message: error?.message||'' });
    setCloudStatus(message,'error');
    if(state)$('#save-state').textContent='Guardado local · sincronización pendiente';
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
    if (!cloudUser || !project?.projectId || cloudConflicts.has(project.projectId) || (!cloudReady&&!cloudSyncInProgress)) return;
    const scheduledId=project.projectId;
    clearTimeout(cloudTimers.get(scheduledId));
    const snapshot = JSON.stringify(project);
    let timer;
    const sync = async () => {
      if(!cloudUser||cloudConflicts.has(scheduledId)||cloudConflicts.has(project.projectId)){cloudTimers.delete(scheduledId);return;}
      if(cloudSyncInProgress){timer=setTimeout(sync,750);cloudTimers.set(scheduledId,timer);return;}
      if(!cloudReady){cloudTimers.delete(scheduledId);return;}
      try {
        await pushCloudProject(JSON.parse(snapshot));
        if (state?.projectId === project.projectId) $('#save-state').textContent = 'Sincronizado con GitHub';
        setCloudStatus('Sincronización al día','ready');
      } catch (error) {
        if(error.status===412){markCloudConflict(project.projectId);return;}
        setSyncFailure(error);
      } finally {
        if(cloudTimers.get(scheduledId)===timer)cloudTimers.delete(scheduledId);
        if(project.projectId!==scheduledId&&cloudTimers.get(project.projectId)===timer)cloudTimers.delete(project.projectId);
      }
    };
    timer = setTimeout(sync,900);
    cloudTimers.set(scheduledId, timer);
  }
  function storeRemoteProject(project,etag,{persistLocal=false}={}) {
    validateEditableProject(project);
    const record = { id: project.projectId, title: project.title || 'Contenido sin título', contentType: project.contentType || 'episode', status: project.status || 'draft', createdAt: project.createdAt || Date.now(), updatedAt: Number(project.updatedAt) || Date.now(), panels: project.panels.length };
    const index = listProjects().filter(entry => entry.id !== project.projectId);
    const hasLocal=localStorage.getItem(PROJECT_KEY(project.projectId))!==null;
    index.push({...record,cloudOnly:!persistLocal&&!hasLocal}); index.sort((a, b) => b.updatedAt - a.updatedAt);
    if(persistLocal)localStorage.setItem(PROJECT_KEY(project.projectId), JSON.stringify(project));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(index));
    saveCloudBase(project.projectId,etag,project.updatedAt);
  }
  async function syncCloudProjects() {
    if (!cloudUser || cloudReady || cloudSyncInProgress) return;
    cloudSyncInProgress = true;
    setCloudStatus('Sincronizando borradores…','busy');
    let syncStep='preparar borradores locales';
    try {
      migrateInvalidLocalProjectIds();
      syncStep='consultar la lista de la nube';
      const { projects: remoteProjects } = await cloudFetch('/api/projects');
      if(!Array.isArray(remoteProjects)){const error=new Error('La respuesta del servidor no contiene una lista de borradores válida.');error.code='invalid_cloud_project_list';throw error;}
      const localProjects = listProjects().filter(record=>record&&typeof record==='object'&&!Array.isArray(record));
      const remoteById = new Map(remoteProjects.map(project => [project.id, project]));
      const skippedRemoteProjects = [];
      const nextIndex=localProjects.filter(record=>!record.cloudOnly||remoteById.has(record.id));
      for (const remote of remoteProjects) {
        try {
          let local=localProject(remote.id);
          const priorRecord=localProjects.find(record=>record.id===remote.id);
          const remoteTitle=remote.title&&remote.title!=='Episodio sin título'?remote.title:(local?.title||priorRecord?.title||'Episodio sin título');
          const metadata={id:remote.id,title:remoteTitle,contentType:remote.contentType||'episode',status:remote.status||'draft',createdAt:Number(remote.createdAt)||Number(remote.updatedAt)||Date.now(),updatedAt:Number(remote.updatedAt)||Date.now(),panels:Number(remote.panels)||0,cloudOnly:!local};
          const indexPos=nextIndex.findIndex(record=>record.id===remote.id);
          if(indexPos>=0)nextIndex[indexPos]={...nextIndex[indexPos],...metadata,cloudOnly:!local};else nextIndex.push(metadata);
          if(!remote.etag){syncStep=`actualizar el índice de «${String(remote.title||remote.id||'borrador').slice(0,80)}»`;continue;}
          if(!local){saveCloudBase(remote.id,remote.etag,0);continue;}
          const base=cloudBases.get(remote.id);
          if(!base){
            if(Number(local.updatedAt)===Number(remote.updatedAt))saveCloudBase(remote.id,remote.etag,local.updatedAt);
            else if(Number(local.updatedAt)>Number(remote.updatedAt)){
              saveCloudBase(remote.id,remote.etag,local.updatedAt);
              syncStep=`guardar «${String(local.title||remote.id||'borrador').slice(0,80)}» en la nube`;
              try{await pushCloudProject(local);}catch(error){if(error.status===412)markCloudConflict(remote.id);else throw error;}
            } else markCloudConflict(remote.id);
          }else if(base.etag!==remote.etag){
            if(Number(local.updatedAt)>Number(base.localUpdatedAt)||state?.projectId===remote.id)markCloudConflict(remote.id);
            else{
              localStorage.removeItem(PROJECT_KEY(remote.id));
              metadata.cloudOnly=true;
              saveCloudBase(remote.id,remote.etag,0);
            }
          }else if(Number(local.updatedAt)>Number(base.localUpdatedAt)){
            syncStep=`guardar «${String(local.title||remote.id||'borrador').slice(0,80)}» en la nube`;
            cloudBases.set(remote.id,{etag:remote.etag,localUpdatedAt:Number(base.localUpdatedAt)||0});
            try{await pushCloudProject(local);}catch(error){if(error.status===412)markCloudConflict(remote.id);else throw error;}
          }else saveCloudBase(remote.id,remote.etag,local.updatedAt);
        } catch (error) {
          if(error?.code==='incompatible_remote_project'||error?.status===404){skippedRemoteProjects.push(remote);console.warn('A remote draft could not be imported', { id: remote.id, code: error.code||'project_not_found' });continue;}
          throw error;
        }
      }
      for (const record of localProjects) {
        if (!record.cloudOnly&&!remoteById.has(record.id)) {
          syncStep=`subir «${String(record.title||record.id||'borrador').slice(0,80)}» a la nube`;
          const local=localProject(record.id);
          if(local)try{await pushCloudProject(local);}catch(error){if(error.status===412)markCloudConflict(record.id);else throw error;}
        }
      }
      cloudReady = true;
      nextIndex.sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0));
      try{localStorage.setItem(PROJECTS_KEY,JSON.stringify(nextIndex));}catch(error){console.warn('Could not save the small project index locally',error);}
      const skippedMessage=skippedRemoteProjects.length?`${skippedRemoteProjects.length} borrador${skippedRemoteProjects.length===1?'':'es'} de la nube tiene${skippedRemoteProjects.length===1?'':'n'} un formato que esta versión no puede abrir. El resto sí se sincronizó; esos archivos no se modificaron.`:'';
      setCloudStatus(cloudConflicts.size?'Hay versiones en conflicto. Revísalas antes de seguir.':skippedMessage||'Sincronización al día',cloudConflicts.size?'conflict':skippedMessage?'error':'ready');
      renderProjectList();
    } catch (error) {
      cloudReady=false;setSyncFailure(error,syncStep);
    } finally { cloudSyncInProgress = false; }
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
        localStorage.removeItem(PROJECT_KEY(projectId));
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
    if (cloudSyncInProgress) return;
    if(cloudConflicts.size){openCloudConflictDialog();return;}
    cloudReady=false;setCloudStatus('Revisando cambios…','busy');await syncCloudProjects();
  }
  function scheduleCloudRefresh() {
    if (!cloudUser || document.hidden) return;
    clearTimeout(cloudRefreshTimer);
    cloudRefreshTimer = setTimeout(() => {
      if (!cloudUser || document.hidden || cloudSyncInProgress) return;
      if (cloudTimers.size) { scheduleCloudRefresh(); return; }
      retryCloudSync();
    }, 1400);
  }
  function startCloudPolling() {
    if(cloudPollTimer)return;
    cloudPollTimer=setInterval(()=>{
      if(!cloudUser||cloudAuthExpired||document.hidden||!cloudReady||cloudSyncInProgress||cloudTimers.size||cloudConflicts.size)return;
      retryCloudSync();
    },30000);
  }
  async function clearEditorOfflineCache() {
    const worker=navigator.serviceWorker?.controller;
    if(!worker||!window.MessageChannel)return;
    await new Promise(resolve=>{
      const channel=new MessageChannel(); const timeout=setTimeout(resolve,900);
      channel.port1.onmessage=()=>{clearTimeout(timeout);resolve();};
      worker.postMessage({type:'CLEAR_EDITOR_CACHE'},[channel.port2]);
    });
  }
  async function setupCloudSync() {
    const button = $('#github-sync');
    $('#dismiss-cloud-banner').onclick=()=>{cloudBannerDismissed=true;$('#cloud-sync-banner').hidden=true;};
    button.onclick = async () => {
      if (cloudAuthExpired) { window.location.assign('/login.html?area=editor'); return; }
      if (cloudUser) {
        try {
          await cloudFetch('/api/auth/logout', { method: 'POST' });
          await clearEditorOfflineCache();
          document.documentElement.classList.add('session-ended');
          window.location.replace('/');
        } catch {
          // A direct same-origin request clears the HttpOnly cookie if the POST failed.
          document.documentElement.classList.add('session-ended');
          window.location.replace('/api/auth/logout');
        }
        return;
      }
      if (!cloudConfigured) { toast('La sincronización requiere configurar OAuth de GitHub y almacenamiento R2 en Cloudflare.'); return; }
      window.location.assign('/login.html?area=editor');
    };
    $('#retry-cloud').onclick=retryCloudSync;$('#editor-retry-cloud').onclick=retryCloudSync;
    window.addEventListener('focus',scheduleCloudRefresh);
    window.addEventListener('online',scheduleCloudRefresh);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleCloudRefresh();});
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
      if (cloudUser) { await syncCloudProjects(); startCloudPolling(); }
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
  function confirmWithBrand({ title, message, confirmLabel = 'Continuar', cancelLabel = 'Cancelar', destructive = false }) {
    const dialog = $('#brand-confirm-dialog');
    const accept = $('#brand-confirm-accept');
    $('#brand-confirm-title').textContent = title;
    $('#brand-confirm-message').textContent = message;
    $('#brand-confirm-cancel').textContent = cancelLabel;
    accept.textContent = confirmLabel;
    accept.classList.toggle('danger', destructive);
    return new Promise(resolve => {
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        dialog.removeEventListener('close', onClose);
        $('#brand-confirm-cancel').removeEventListener('click', onCancel);
        accept.removeEventListener('click', onAccept);
        dialog.removeEventListener('click', onBackdrop);
        resolve(value);
      };
      const onClose = () => finish(dialog.returnValue === 'confirm');
      const onCancel = () => dialog.close('cancel');
      const onAccept = () => dialog.close('confirm');
      const onBackdrop = event => { if (event.target === dialog) dialog.close('cancel'); };
      dialog.addEventListener('close', onClose, { once: true });
      $('#brand-confirm-cancel').addEventListener('click', onCancel, { once: true });
      accept.addEventListener('click', onAccept, { once: true });
      dialog.addEventListener('click', onBackdrop);
      dialog.showModal();
      accept.focus();
    });
  }
  function validateFormInline(form, status, message = 'Revisa los campos marcados antes de continuar.') {
    const invalid = [...form.elements].filter(field => field.willValidate && !field.validity.valid);
    form.querySelectorAll('[aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));
    if (!invalid.length) return true;
    invalid.forEach(field => field.setAttribute('aria-invalid', 'true'));
    status.textContent = message;
    invalid[0].focus({ preventScroll: false });
    invalid[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
    return false;
  }
  function currentPanel() { return state.panels[state.active]; }
  function currentItem() { return currentPanel()?.items.find(item => item.id === state.selected); }
  function activeCanvas() { return $('#stage .artboard-canvas[data-panel-index="' + state.active + '"]'); }
  function canvasScale(target = activeCanvas()) { return target ? target.getBoundingClientRect().width / LOGICAL_WIDTH : 1; }
  function isFullyOffstage(item) { return item.x + item.w <= 0 || item.y + item.h <= 0 || item.x >= LOGICAL_WIDTH || item.y >= state.pageHeight; }
  function setActivePanel(index, clearSelection = false, ensureVisible = true) {
    if (index < 0 || index >= state.panels.length) return;
    const changed=index!==state.active;
    if (changed && drawingObjectId) finishDrawingObject();
    state.active = index; if (clearSelection) state.selected = null;
    $('#current-panel-label').textContent = `VIÑETA ${index + 1}`;
    $$('.artboard-wrap').forEach((element, i) => element.classList.toggle('active', i === index));
    $$('.viewport-badge').forEach((element,i)=>element.hidden=i!==index);
    if(changed&&ensureVisible)requestAnimationFrame(() => $(`.artboard-wrap[data-panel-index="${index}"]`)?.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' }));
    renderPanels(); renderInspector(); renderLayers(); renderOffstage();
  }
  function applyPanelBackground(color, name = color) {
    if (!state || !currentPanel()) return;
    snapshot(); currentPanel().backgroundColor = color; commit();
    $$('.background-color-card').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color === color)));
    const picker = $('.background-custom-color input[type="color"]'); if (picker) picker.value = color;
    toast(`Fondo de la viñeta ${state.active + 1}: ${name}.`);
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
    $('#editor-view').hidden = true; $('#project-home').hidden = false; renderProjectList(); showHomeSection('drafts');
  }
  function showEditor() {
    $('#project-home').hidden = true; $('#editor-view').hidden = false;
    $('#export-preset').value = state.format;
    $('#export-style').value = state.exportStyle || 'classic';
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
      if(record.cloudOnly){
        preview.classList.add('project-card-cloud-only');
        preview.innerHTML=`<div class="cloud-only-preview">${svgIcon('cloud')}<span>En la nube</span><small>La vista previa se carga al abrir</small></div>`;
      }
      const pageHeight = Number(project.pageHeight) || 400;
      const previewCanvas = document.createElement('div'); previewCanvas.className = 'project-preview-canvas';
      previewCanvas.style.aspectRatio = `${LOGICAL_WIDTH} / ${pageHeight}`;
      const firstPanel = record.cloudOnly ? null : project.panels?.[0];
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
      if(!record.cloudOnly)preview.append(previewCanvas);
      const main = document.createElement('div'); main.className = 'project-card-main';
      const reviewState = record.status === 'review';
      const publicationLabel = record.status === 'published' ? 'Publicado en la web' : record.status === 'scheduled' ? `Programado · ${project.publishedAt || ''}` : reviewState ? 'En revisión' : 'Borrador';
      const publicationClass = record.status === 'published' ? 'published' : record.status === 'scheduled' ? 'scheduled' : reviewState ? 'ready' : '';
      const kindLabels = {episode:'Episodio',copy:'Texto / copy',banner:'Banner',section:'Sección web',design:'Diseño gráfico',mockup:'Diseño de producto'};
      const isEpisode = (project.contentType || record.contentType || 'episode') === 'episode';
      const displayTitle=project.title&&project.title!=='Episodio sin título'?project.title:record.title;
      main.innerHTML = `<strong>${escapeHTML(displayTitle)}</strong><span class="status-pill ${publicationClass}">${publicationLabel}</span><small>${kindLabels[project.contentType || record.contentType || 'episode'] || 'Contenido'} · ${isEpisode ? `${project.panels?.length || record.panels || 0} viñetas · ` : ''}Modificado ${new Date(record.updatedAt).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })}</small>`;
      const open = document.createElement('button'); open.type = 'button'; open.className = 'project-card-open'; open.setAttribute('aria-label',`Abrir ${displayTitle}`); open.append(preview,main); open.onclick = () => openProject(record.id);
      const menu = document.createElement('details'); menu.className = 'project-card-menu';
      menu.innerHTML = `<summary aria-label="Más opciones para ${escapeHTML(record.title)}">${svgIcon('more')}</summary><div class="project-menu-popover"><button type="button" data-action="history">${svgIcon('clock')}<span>Historial de versiones</span></button><button type="button" data-action="duplicate">${svgIcon('copy')}<span>Duplicar archivo</span></button><button type="button" data-action="delete" class="danger">${svgIcon('trash')}<span>Borrar archivo</span></button></div>`;
      menu.addEventListener('click', event => event.stopPropagation());
      menu.querySelector('[data-action="history"]').onclick = () => { menu.open = false; openVersionHistory(record.id); };
      menu.querySelector('[data-action="duplicate"]').onclick = () => { menu.open = false; duplicateProject(record.id); };
      menu.querySelector('[data-action="delete"]').onclick = () => { menu.open = false; requestDeleteProject(record.id); };
      card.append(open,menu);
      list.append(card);
    });
  }
  let historyProjectId = null, historyEtag = '';
  async function openVersionHistory(projectId) {
    historyProjectId = projectId; historyEtag = '';
    $('#version-history-list').replaceChildren();
    $('#version-history-status').textContent = 'Cargando versiones…';
    $('#version-history-dialog').showModal();
    await refreshVersionHistory();
  }
  async function refreshVersionHistory() {
    const status = $('#version-history-status'), list = $('#version-history-list');
    if (!historyProjectId) return;
    status.textContent = 'Consultando el historial privado…'; list.replaceChildren();
    try {
      const result = await cloudFetch(`/api/projects/${encodeURIComponent(historyProjectId)}/versions`);
      historyEtag = result.etag || '';
      const versions = Array.isArray(result.versions) ? result.versions : [];
      if (!versions.length) { status.textContent = 'Aún no hay puntos de recuperación. Se crearán automáticamente cuando el borrador cambie.'; return; }
      status.textContent = `${versions.length} punto${versions.length === 1 ? '' : 's'} de recuperación · Se conservan hasta 30 versiones recientes.`;
      versions.forEach(version => {
        const row = document.createElement('li'); row.className = 'version-history-item';
        const copy = document.createElement('div');
        const title = document.createElement('strong'); title.textContent = version.title || 'Versión anterior';
        const date = document.createElement('small'); date.textContent = version.snapshotAt ? new Date(version.snapshotAt).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Fecha no disponible';
        copy.append(title, date);
        const restore = document.createElement('button'); restore.type = 'button'; restore.className = 'button'; restore.textContent = 'Restaurar'; restore.setAttribute('aria-label', `Restaurar ${title.textContent}, ${date.textContent}`);
        restore.onclick = () => restoreProjectVersion(version.id, restore);
        row.append(copy, restore); list.append(row);
      });
    } catch (error) { status.textContent = error.message || 'No se pudo cargar el historial.'; }
  }
  async function restoreProjectVersion(versionId, button) {
    const id = historyProjectId;
    if (!id || !historyEtag) { toast('Actualiza el historial antes de restaurar.'); return; }
    if (cloudConflicts.has(id)) { toast('Resuelve primero el conflicto de sincronización de este borrador.'); return; }
    const local = localProject(id), base = cloudBases.get(id);
    if (local && (!base || Number(local.updatedAt) > Number(base.localUpdatedAt || 0))) {
      toast('Hay cambios locales pendientes. Sincronízalos antes de restaurar una versión.'); return;
    }
    if (!await confirmWithBrand({ title: '¿Restaurar esta versión?', message: 'La versión actual se guardará primero en el historial para que puedas recuperarla.', confirmLabel: 'Restaurar versión' })) return;
    button.disabled = true; $('#version-history-status').textContent = 'Restaurando…';
    try {
      await cloudFetch(`/api/projects/${encodeURIComponent(id)}/versions/${encodeURIComponent(versionId)}`, { method: 'POST', headers: { 'If-Match': historyEtag } });
      let latest;
      try { latest = await readRemoteProject(id); }
      catch (error) {
        $('#version-history-status').textContent = 'La nube confirmó la restauración, pero el editor no pudo volver a cargar el borrador. Pulsa “Actualizar historial” y abre el proyecto de nuevo.';
        console.error('Restored project could not be reloaded', { status: error?.status || 0, projectId: id });
        return;
      }
      storeRemoteProject(latest.project, latest.etag, { persistLocal: true });
      if (state?.projectId === id) { state = normalizeProject(latest.project); undoStack = []; redoStack = []; showEditor(); }
      else renderProjectList();
      toast('Versión restaurada. La versión anterior también quedó guardada en el historial.');
      await refreshVersionHistory();
    } catch (error) {
      $('#version-history-status').textContent = error.status === 500
        ? 'La nube respondió con un error interno (500). No se confirmó la restauración; tu copia local sigue intacta. Actualiza el historial y vuelve a intentarlo.'
        : error.message || 'No se pudo restaurar esa versión.';
      if (error.status === 412) await refreshVersionHistory();
    } finally { button.disabled = false; }
  }
  async function openProject(projectId) {
    try {
      let project=null;
      try{project=JSON.parse(localStorage.getItem(PROJECT_KEY(projectId))||'null');}catch{}
      if(!project){
        if(!cloudUser)throw new Error('Este proyecto solo está en la nube. Conéctate a internet para abrirlo.');
        setCloudStatus('Cargando el proyecto desde la nube…','busy');
        const latest=await readRemoteProject(projectId);
        storeRemoteProject(latest.project,latest.etag);
        project=latest.project;
        setCloudStatus(cloudConflicts.size?'Hay versiones en conflicto. Revísalas antes de seguir.':'Sincronización al día',cloudConflicts.size?'conflict':'ready');
      }
      state = normalizeProject(project);
      undoStack = []; redoStack = []; showEditor();
    } catch (error) { setCloudStatus(error.message||'No pude abrir ese proyecto.','error');toast(error.message||'No pude abrir ese proyecto.'); }
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
  let pendingDesignType = 'design', changingMockup = false;
  function createContentDraft(type) {
    if(type==='episode'){ $('#template-dialog').showModal(); return; }
    if(type==='design'||type==='mockup') { changingMockup=false;pendingDesignType=type; $$('.product-template-choice').forEach(button=>button.hidden=type!=='mockup'); $$('.design-template-card:not(.product-template-choice)').forEach(button=>button.hidden=type==='mockup'); $('#design-template-dialog').showModal(); return; }
    const presets={copy:{title:'Texto o copy nuevo',label:'Escribe el texto o copy aquí…'},banner:{title:'Banner nuevo',label:'Escribe el titular del banner…'},section:{title:'Sección web nueva',label:'Escribe el título de la sección…'}};
    const preset=presets[type]||presets.copy; state=makeProject(preset.title,type); state.panels=[{id:id(),items:[]}]; undoStack=[];redoStack=[];
    const item={id:id(),type:'text',name:preset.title,text:preset.label,x:80,y:105,w:440,h:150,fontSize:32,fontWeight:600,align:'center',color:'#292725',rotation:0,locked:false};state.panels[0].items.push(item);state.selected=item.id;
    try{saveProject();showEditor();}catch{showEditor();toast('Este navegador no permitió guardar automáticamente. Descarga el archivo editable.');}
  }
  async function duplicateProject(projectId) {
    try {
      let source=null;try{source=JSON.parse(localStorage.getItem(PROJECT_KEY(projectId))||'null');}catch{}
      if(!source){const latest=await readRemoteProject(projectId);source=latest.project;}
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
    const isLogo = resource.name === 'Logotipo Mandarinita';
    const width = isLogo ? 180 : isSticker ? 130 : 150;
    const height = isLogo ? 68 : isSticker ? 130 : 160;
    const pos = position || placeWithoutOverlap(width, height);
    snapshot();
    const item = { id: id(), type: 'image', name: resource.name, resourceId: resource.name, category: resource.category, aliases: resource.aliases || [], src: variant.src, variants: resource.variants || null, variantIndex, x: pos.x, y: pos.y, w: width, h: height, rotation: 0, locked: false };
    currentPanel().items.push(item); selectItem(item.id); commit();
  }
  function dropResourceAt(resource, panelIndex, boardCanvas, clientX, clientY) {
    const rect = boardCanvas.getBoundingClientRect(); const scale = rect.width / LOGICAL_WIDTH;
    setActivePanel(panelIndex, true);
    const isLogo = resource.name === 'Logotipo Mandarinita';
    const width = isLogo ? 180 : resource.category === 'sticker' ? 130 : 150;
    const height = isLogo ? 68 : resource.category === 'sticker' ? 130 : 160;
    addResource(resource, 0, { x: (clientX - rect.left) / scale - width / 2, y: (clientY - rect.top) / scale - height / 2 });
  }
  function addBubble(kind = 'dialogue') {
    const size = kind === 'sfx' ? { w: 210, h: 110 } : kind === 'narration' ? { w: 230, h: 105 } : { w: 210, h: 105 };
    const pos = placeWithoutOverlap(size.w, size.h);
    snapshot();
    const labels = { dialogue: 'Diálogo', thought: 'Pensamiento', narration: 'Narración', shout: 'Voz fuerte', sfx: 'Efecto' };
    const item = { id: id(), type: 'bubble', kind, name: kind === 'sfx' ? 'Efecto de sonido' : `Globo · ${labels[kind]}`, text: kind === 'sfx' ? 'POW!' : 'Escribe aquí…', ...pos, ...size, fontSize: kind === 'sfx' ? 42 : kind === 'shout' ? 24 : 17, align: 'center', shape:'auto', tail: ['dialogue', 'shout', 'thought'].includes(kind), tailAngle: 90, tailLength: 34, actionStyle: 'raised', overflow: 'auto', locked: false };
    currentPanel().items.push(item); selectItem(item.id); commit();
  }
  const TEXT_STYLES={comic:{fontFamily:'Comic Neue',fontSize:34,fontWeight:700,color:'#302d2a'},baloo:{fontFamily:'Baloo 2',fontSize:38,fontWeight:700,color:'#282522'},lilita:{fontFamily:'Lilita One',fontSize:42,fontWeight:400,color:'#607D3B'},fredoka:{fontFamily:'Fredoka',fontSize:32,fontWeight:600,color:'#282522'},arc:{fontFamily:'Comic Neue',fontSize:38,fontWeight:700,color:'#F87209',textCurve:34}};
  function addTextBlock(text='Escribe aquí…',styleKey='fredoka') {
    const style=TEXT_STYLES[styleKey]||TEXT_STYLES.fredoka;const pos=placeWithoutOverlap(360,110);snapshot();const item={id:id(),type:'text',name:'Texto',text,x:pos.x,y:pos.y,w:360,h:110,...style,align:'center',rotation:0,locked:false};currentPanel().items.push(item);selectItem(item.id);commit();
  }
  function updateCurvedTextElement(item,element){
    let svg=element.querySelector('.curved-text-preview');
    if(!item.textCurve){svg?.remove();element.classList.remove('curved-text');return;}
    if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('curved-text-preview');svg.setAttribute('aria-hidden','true');element.prepend(svg);}
    svg.setAttribute('viewBox',`0 0 ${item.w} ${item.h}`);svg.replaceChildren();
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs'),path=document.createElementNS('http://www.w3.org/2000/svg','path'),pathId=`curve-${item.id.replace(/[^a-zA-Z0-9_-]/g,'')}`;
    const baseline=item.h*.58,amount=Number(item.textCurve)||0;path.id=pathId;path.setAttribute('d',`M 4 ${baseline} Q ${item.w/2} ${baseline-amount*1.8} ${item.w-4} ${baseline}`);defs.append(path);svg.append(defs);
    const text=document.createElementNS('http://www.w3.org/2000/svg','text'),textPath=document.createElementNS('http://www.w3.org/2000/svg','textPath');textPath.setAttribute('href',`#${pathId}`);textPath.setAttribute('startOffset','50%');textPath.setAttribute('text-anchor','middle');textPath.textContent=String(item.text||'');text.setAttribute('font-family',item.fontFamily||'Comic Neue');text.setAttribute('font-size',item.fontSize||34);text.setAttribute('font-weight',item.fontWeight||700);text.setAttribute('fill',item.color||'#302d2a');text.append(textPath);svg.append(text);element.classList.add('curved-text');
  }
  function dataSvg(svg){return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;}
  function productMockupSvg(kind){
    const common=`<defs><linearGradient id="fabric" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dedbd5"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#32281f" flood-opacity=".18"/></filter></defs><rect width="600" height="750" rx="28" fill="#eee9e2"/><ellipse cx="300" cy="686" rx="175" ry="20" fill="#a9a29a" opacity=".24"/>`;
    let shape='';
    if(kind==='shirt') shape=`<g filter="url(#shadow)" fill="url(#fabric)" stroke="#c9c4bc" stroke-width="5" stroke-linejoin="round"><path d="M205 115 252 90q48 45 96 0l47 25 100 85-60 74-45-35v370H210V239l-45 35-60-74z"/><path d="M252 90q4 54 48 54t48-54" fill="none"/></g><rect x="225" y="275" width="150" height="190" rx="8" fill="#fff" opacity=".28" stroke="#8e887e" stroke-dasharray="8 8" stroke-width="3"/>`;
    if(kind==='tote') shape=`<g filter="url(#shadow)" stroke="#c9c4bc" stroke-width="5" stroke-linejoin="round"><path d="M155 205h290l-24 415H179z" fill="url(#fabric)"/><path d="M220 220v-58q0-72 80-72t80 72v58" fill="none" stroke="#8b7761" stroke-width="18" stroke-linecap="round"/></g><rect x="205" y="310" width="190" height="180" rx="8" fill="#fff" opacity=".28" stroke="#8e887e" stroke-dasharray="8 8" stroke-width="3"/>`;
    if(kind==='mug') shape=`<g filter="url(#shadow)" stroke="#c9c4bc" stroke-width="5"><path d="M130 230h310l-28 340q-4 58-62 58h-130q-58 0-62-58z" fill="url(#fabric)"/><path d="M432 300h42q82 0 70 104t-86 104h-35" fill="none" stroke="#d5d0c7" stroke-width="24"/></g><path d="M177 300h205l-17 220H195z" fill="#fff" opacity=".3" stroke="#8e887e" stroke-dasharray="8 8" stroke-width="3"/>`;
    return dataSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750">${common}${shape}</svg>`);
  }
  function createDesignProject(templateKey){
    const product=['shirt','tote','mug'].includes(templateKey),promo=templateKey==='promo',quote=templateKey==='quote';
    const format=product||templateKey==='story'?'portrait':'square';
    const names={post:'Post Mandarinita',story:'Story Mandarinita',promo:'Anuncio de Mandarinita',quote:'Frase destacada',shirt:'Diseño para camiseta',tote:'Diseño para tote bag',mug:'Diseño para taza'};
    state=makeProject(names[templateKey]||'Diseño nuevo',product?'mockup':'design');state.format=format;state.pageHeight=FORMAT[format].logicalHeight;state.panels=[{id:id(),backgroundColor:product?'#EEE9E2':templateKey==='story'?'#607D3B':quote?'#302D2A':'#FFF8EC',items:[]}];state.mockupPreview=true;undoStack=[];redoStack=[];
    const panel=state.panels[0];
    if(product)panel.items.push({id:id(),type:'image',name:'Simulación de producto',src:productMockupSvg(templateKey),x:0,y:0,w:600,h:750,locked:true,mockupOnly:true,rotation:0});
    if(promo||quote){
      const decoration=promo
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path fill="#F87209" d="M0 0h600v172q-125 60-300 5T0 190z"/><path fill="#607D38" d="M0 492q165-38 310 4t290-6v110H0z"/><circle cx="530" cy="75" r="33" fill="#F7C843"/><path d="M65 220h470" stroke="#F7C843" stroke-width="6" stroke-linecap="round"/><rect x="166" y="510" width="268" height="58" rx="29" fill="#302D2A"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path fill="#FFF8EC" d="M52 100q8-54 66-54h364q58 0 66 54v400q-8 54-66 54H118q-58 0-66-54z"/><path fill="#F87209" d="M0 0h165q-20 120-165 145zM600 455v145H450q32-108 150-145z"/><circle cx="500" cy="92" r="30" fill="#607D38"/><circle cx="95" cy="515" r="22" fill="#F7C843"/></svg>`;
      panel.items.push({id:id(),type:'image',name:'Decoración de plantilla',src:dataSvg(decoration),x:0,y:0,w:600,h:600,locked:true,rotation:0});
    }
    const titleText=promo?'¡Nuevo sabor, misma pulpa!':quote?'La vida tiene sus gajos.':templateKey==='story'?'¡Hoy toca algo bueno!':product?'Tu diseño aquí':'La vida tiene sus gajos.';
    const title={id:id(),type:'text',name:'Titular',text:titleText,x:product?155:promo?42:quote?52:48,y:product?320:promo?42:quote?102:templateKey==='story'?170:170,w:product?290:promo?516:quote?496:504,h:product?70:promo?138:quote?150:templateKey==='story'?170:170,fontSize:product?31:promo?50:quote?45:templateKey==='post'?58:54,fontWeight:templateKey==='story'?700:700,fontFamily:promo||quote||templateKey==='post'?'Comic Neue':'Baloo 2',textEffect:templateKey==='post'?'outline':'none',textCurve:quote?20:0,align:'center',color:templateKey==='story'?'#FFF8EC':promo?'#FFFFFF':quote?'#302D2A':'#F87209',rotation:0,locked:false};panel.items.push(title);
    const subtitle={id:id(),type:'text',name:'Mensaje',text:product?'Edítame y crea tu propio diseño':promo?'Humor dominicano, con mucha pulpa.':quote?'Escribe aquí la frase que quieres destacar.':'Humor dominicano, con mucha pulpa.',x:product?180:promo?72:quote?82:82,y:product?398:promo?270:quote?308:templateKey==='story'?360:370,w:product?240:promo?456:quote?436:436,h:product?62:promo?78:quote?90:80,fontSize:product?17:promo?25:quote?22:22,fontWeight:600,fontFamily:'Fredoka',align:'center',color:templateKey==='story'?'#FFF8EC':quote?'#302D2A':'#282522',rotation:0,locked:false};panel.items.push(subtitle);
    if(promo)panel.items.push({id:id(),type:'text',name:'Llamada a la acción',text:'PRUÉBALO HOY',x:166,y:515,w:268,h:48,fontSize:25,fontWeight:700,fontFamily:'Comic Neue',align:'center',color:'#FFFFFF',rotation:0,locked:false});
    state.selected=title.id;
    try{saveProject();showEditor();toast(product?'Mockup listo. Cambia los textos y descarga el arte vectorial sin la simulación.':promo||quote?'Composición lista: edita sus titulares, colores y capas para adaptarla a tu anuncio.':'Plantilla lista. Los titulares y textos son editables.');}catch{showEditor();toast('Este navegador no permitió guardar automáticamente. Descarga el archivo editable.');}
  }
  function changeProductMockup(templateKey){
    if(!['shirt','tote','mug'].includes(templateKey))return;
    const mockup=currentPanel().items.find(item=>item.mockupOnly);if(!mockup)return;
    snapshot();mockup.src=productMockupSvg(templateKey);mockup.name=`Simulación · ${{shirt:'Camiseta',tote:'Tote bag',mug:'Taza'}[templateKey]}`;state.title=`Diseño para ${{shirt:'camiseta',tote:'tote bag',mug:'taza'}[templateKey]}`;commit();toast(`Mockup cambiado a ${{shirt:'camiseta',tote:'tote bag',mug:'taza'}[templateKey]}. El arte editable se conservó.`);
  }
  function updateBubbleAccessories(item, element) {
    element.querySelectorAll('.bubble-tail-svg,.thought-dot').forEach(node => node.remove());
    if (item.kind === 'sfx') return;
    const angle=(item.tailAngle??90)*Math.PI/180,ux=Math.cos(angle),uy=Math.sin(angle),cx=item.w/2,cy=item.h/2;
    if(item.kind==='thought'&&item.tail)[14,9,5].forEach((diameter,index)=>{
      const t=[.34,.62,.86][index],dot=document.createElement('span');dot.className='thought-dot';
      dot.style.width=`${diameter}px`;dot.style.height=`${diameter}px`;dot.style.left=`${cx+ux*(Math.max(item.w,item.h)*.46+(item.tailLength??34)*t)-diameter/2}px`;dot.style.top=`${cy+uy*(Math.max(item.w,item.h)*.46+(item.tailLength??34)*t)-diameter/2}px`;element.append(dot);
    });
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.classList.add('bubble-tail-svg'); svg.setAttribute('viewBox',`0 0 ${item.w} ${item.h}`); svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',organicBubblePath(item.w,item.h,item));path.setAttribute('fill',item.kind==='narration'?'#fff5df':'#fff');path.setAttribute('stroke','#302d2a');path.setAttribute('stroke-width','3');path.setAttribute('stroke-linejoin','round');path.setAttribute('stroke-linecap','round');svg.append(path);element.append(svg);
  }
  function organicBubblePath(width,height,item) {
    const cx=width/2,cy=height/2,rx=width*.48,ry=height*.46,angle=(item.tailAngle??90)*Math.PI/180;
    const hasTail=item.tail&&['dialogue','shout'].includes(item.kind),half=Math.max(7,Math.min(14,width*.045));
    const tangentRadius=Math.hypot(rx*Math.sin(angle),ry*Math.cos(angle)),delta=hasTail?Math.min(.34,half/Math.max(1,tangentRadius)):0;
    const start=angle-delta,end=angle+delta,turn=2*Math.PI-2*delta;
    const wobble=t=>1+.018*Math.sin(3*t+.7)+.012*Math.sin(5*t+1.3);
    const point=t=>({x:cx+rx*Math.cos(t)*wobble(t),y:cy+ry*Math.sin(t)*wobble(t)});
    const derivative=t=>{const d=.001,a=point(t-d),b=point(t+d);return{x:(b.x-a.x)/(2*d),y:(b.y-a.y)/(2*d)};};
    const p0=point(start),p1=point(end);let d=`M${p0.x} ${p0.y}`;
    if(hasTail){
      const length=item.tailLength??34,tip={x:cx+Math.cos(angle)*(Math.max(rx,ry)+length),y:cy+Math.sin(angle)*(Math.max(rx,ry)+length)},tx=-Math.sin(angle),ty=Math.cos(angle);
      const c1={x:p0.x+Math.cos(angle)*half,y:p0.y+Math.sin(angle)*half},c2={x:tip.x-tx*half*.35,y:tip.y-ty*half*.35},c3={x:tip.x+tx*half*.35,y:tip.y+ty*half*.35},c4={x:p1.x+Math.cos(angle)*half,y:p1.y+Math.sin(angle)*half};
      d+=` C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${tip.x} ${tip.y} C${c3.x} ${c3.y} ${c4.x} ${c4.y} ${p1.x} ${p1.y}`;
    }else d+=` L${p1.x} ${p1.y}`;
    const count=48,step=turn/count;
    for(let i=0;i<count;i++){const a=end+i*step,b=a+step,from=point(a),to=point(b),da=derivative(a),db=derivative(b),handle=step/3;d+=` C${from.x+da.x*handle} ${from.y+da.y*handle} ${to.x-db.x*handle} ${to.y-db.y*handle} ${to.x} ${to.y}`;}
    return `${d} Z`;
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
    textarea.style.fontWeight = item.kind === 'shout' || item.kind === 'sfx' ? '700' : '400';
    textarea.style.textAlign = item.align || 'center'; textarea.style.overflow = item.overflow || 'auto';
    textarea.style.textTransform = item.kind === 'shout' || item.kind === 'sfx' ? 'uppercase' : 'none';
    textarea.style.fontFamily = "'Comic Neue', sans-serif";
    textarea.style.color = '#302d2a';
    textarea.dataset.kind = item.kind;
    if (item.kind === 'sfx') textarea.dataset.style = item.actionStyle || 'raised';
  }
  function selectItem(itemId) {
    state.selected = itemId;
    $$('.placed').forEach(element => {
      const active = element.dataset.id === itemId;
      element.classList.toggle('selected', active && !currentPanel().items.find(item => item.id === itemId)?.locked);
      const handle = element.querySelector('.resize-handle');
      if (handle) handle.hidden = !active || Boolean(currentPanel().items.find(item => item.id === itemId)?.locked);
      const move = element.querySelector('.move-handle');
      if (move) move.hidden = !active || Boolean(currentPanel().items.find(item => item.id === itemId)?.locked);
    });
    renderInspector(); renderLayers();
  }
  function closeCanvasContextMenu() { const menu = $('#canvas-context-menu'); if (menu) menu.hidden = true; }
  function clearBackgroundPicker() {
    backgroundPickerItemId = null;
    $$('.placed.sampling-background').forEach(element => element.classList.remove('sampling-background'));
    $('#stage-wrap')?.classList.remove('sampling-background-active');
  }
  async function sampleImageColorAt(item, clientX, clientY, element, boardCanvas) {
    const image = await loadImage(item.src), scale = canvasScale(boardCanvas), rect = element.getBoundingClientRect();
    const dx = (clientX - (rect.left + rect.width / 2)) / scale, dy = (clientY - (rect.top + rect.height / 2)) / scale;
    const angle = (item.rotation || 0) * Math.PI / 180;
    let x = Math.cos(angle) * dx + Math.sin(angle) * dy, y = -Math.sin(angle) * dx + Math.cos(angle) * dy;
    if (item.flipX) x = -x;
    if (item.flipY) y = -y;
    x += item.w / 2; y += item.h / 2;
    const fit = Math.min(item.w / image.naturalWidth, item.h / image.naturalHeight);
    const px = Math.floor((x - (item.w - image.naturalWidth * fit) / 2) / fit);
    const py = Math.floor((y - (item.h - image.naturalHeight * fit) / 2) / fit);
    if (px < 0 || py < 0 || px >= image.naturalWidth || py >= image.naturalHeight) throw new Error('Toca dentro del fondo visible de la imagen.');
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(image, -px, -py);
    const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
    if (alpha < 32) throw new Error('Ese píxel ya es transparente. Elige una zona opaca del fondo.');
    return { r, g, b, hex: `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`.toUpperCase() };
  }
  function openCanvasContextMenu(item, panelIndex, x, y) {
    if ($('#toggle-draw').getAttribute('aria-pressed') === 'true') return;
    if (state.active !== panelIndex) setActivePanel(panelIndex, true);
    selectItem(item.id);
    const menu = $('#canvas-context-menu');
    const actions = [];
    const overlapping=[...new Set(document.elementsFromPoint(x,y).map(node=>node.closest?.('.placed')).filter(node=>node&&node.dataset.id&&node.dataset.id!==item.id&&node.closest('.artboard-canvas')?.dataset.panelIndex===String(panelIndex)))];
    overlapping.forEach(node=>{const candidate=currentPanel().items.find(entry=>entry.id===node.dataset.id);if(candidate&&!candidate.locked)actions.push([`choose:${candidate.id}`,`Seleccionar ${candidate.name}`]);});
    const characterResource = item.type === 'image' && (item.category === 'character' || resources.some(resource => resource.name === item.resourceId && resource.category === 'character'));
    if (characterResource) actions.push(['replace', 'Sustituir personaje']);
    if (['image','drawing'].includes(item.type)) { actions.push(['flip-x', 'Voltear horizontalmente']); actions.push(['flip-y', 'Voltear verticalmente']); }
    if (isOffstage(item)) actions.push(['recover', 'Recuperar al lienzo']);
    actions.push(['duplicate', 'Duplicar elemento'], ['delete', 'Borrar elemento']);
    const actionIcons={replace:'replace','flip-x':'flipH','flip-y':'flipV',recover:'focus',duplicate:'copy',delete:'trash'};
    menu.innerHTML = actions.map(([action,label]) => `<button type="button" role="menuitem" data-context-action="${action}" class="has-icon${action === 'delete' ? ' danger' : ''}">${svgIcon(actionIcons[action]||'image')}<span>${label}</span></button>`).join('');
    menu.hidden = false;
    const width = menu.offsetWidth; const height = menu.offsetHeight;
    menu.style.left = `${Math.max(8,Math.min(x,window.innerWidth-width-8))}px`;
    menu.style.top = `${Math.max(8,Math.min(y,window.innerHeight-height-8))}px`;
    menu.querySelector('button')?.focus();
    menu.querySelectorAll('[data-context-action]').forEach(button => button.onclick = () => {
      const action = button.dataset.contextAction; closeCanvasContextMenu();
      if(action.startsWith('choose:')){const targetId=action.slice(7);if(currentPanel().items.some(entry=>entry.id===targetId))selectItem(targetId);return;}
      if (action === 'replace') { openCharacterPicker(item.id); return; }
      if (action === 'recover') { recoverItem(item.id); return; }
      if (action === 'duplicate') { snapshot(); const copy = { ...item, id: id(), x: item.x + 24, y: item.y + 24, name: `${item.name} · copia` }; currentPanel().items.push(copy); selectItem(copy.id); commit(); return; }
      if (action === 'flip-x' || action === 'flip-y') { snapshot(); item[action === 'flip-x' ? 'flipX' : 'flipY'] = !item[action === 'flip-x' ? 'flipX' : 'flipY']; commit(); return; }
      if (action === 'delete') { snapshot(); currentPanel().items = currentPanel().items.filter(entry => entry.id !== item.id); state.selected = null; commit(); }
    });
  }
  function render() {
    const stage = $('#stage'); const viewport = $('#stage-wrap');
    const savedScroll = viewport ? { left: viewport.scrollLeft, top: viewport.scrollTop } : null;
    stage.innerHTML = '';
    const availableWidth = Math.max(280, viewport?.clientWidth || stage.parentElement.clientWidth || window.innerWidth - 32);
    const availableHeight = Math.max(220, viewport?.clientHeight || window.innerHeight - 250);
    const singlePanelView = $('#app-shell').classList.contains('single-panel-mode');
    const drawingMode=$('#toggle-draw').getAttribute('aria-pressed')==='true';
    viewport?.classList.toggle('drawing-active',drawingMode);
    const targetWidth = availableWidth * (availableWidth < 640 && drawingMode ? singlePanelView ? .78 : .62 : singlePanelView ? .94 : .72);
    const fitScale = Math.min(1, Math.max(.2, targetWidth / LOGICAL_WIDTH), Math.max(.2, (availableHeight - 86) / state.pageHeight));
    const scale = Math.max(.2, Math.round(fitScale * (state.zoom || 1) * LOGICAL_WIDTH) / LOGICAL_WIDTH);
    stage.style.setProperty('--artboard-scale', scale);
    stage.style.setProperty('--artboard-gap', '0px');
    const drawToolbar=$('#draw-toolbar'), workspaceBar=$('.workspace-bar');
    if(drawToolbar&&workspaceBar)drawToolbar.style.top=`${workspaceBar.offsetHeight+8}px`;
    $('#zoom-label').textContent = `${Math.round(scale * 100)}%`;
    $('#project-title').textContent = state.title || 'Episodio nuevo';
    $('#export-preset').value = state.format;
    $('#export-style').value = state.exportStyle || 'classic';
    $('#add-cta-panel').hidden = state.contentType !== 'episode';
    $('#publish-episode').hidden = false;
    $('#mockup-preview').hidden=state.contentType!=='mockup';$('#change-mockup').hidden=state.contentType!=='mockup';$('#mockup-preview').setAttribute('aria-pressed',String(state.mockupPreview!==false));$('#mockup-preview').setAttribute('aria-label',state.mockupPreview===false?'Ver producto':'Ocultar simulación');$('#mockup-preview').title=state.mockupPreview===false?'Ver producto':'Ocultar simulación';$('#mockup-preview').innerHTML=`${svgIcon(state.mockupPreview===false?'eye':'eyeOff')}<span class="button-label">${state.mockupPreview===false?'Ver producto':'Ocultar simulación'}</span>`;
    $('#export-vector').hidden=!['design','mockup'].includes(state.contentType);
    renderPanels();
    const panelLayers=[];
    const syncContinuationCopies=(item,sourcePanelIndex,original,refreshContent=false)=>{
      state.panels.forEach((_,targetIndex)=>{
        if(targetIndex===sourcePanelIndex)return;
        const target=panelLayers[targetIndex];if(!target)return;
        let copy=[...target.continuationLayer.children].find(node=>node.dataset.sourceId===item.id);
        const shift=(sourcePanelIndex-targetIndex)*LOGICAL_WIDTH,reach=Math.hypot(item.w,item.h)/2,center=item.x+shift+item.w/2;
        if(center+reach<=0||center-reach>=LOGICAL_WIDTH){copy?.remove();return;}
        if(!copy){copy=original.cloneNode(true);copy.classList.remove('selected','offstage','sampling-background');copy.classList.add('panel-continuation-copy');copy.dataset.id='';copy.dataset.sourceId=item.id;copy.querySelector('.move-handle')?.remove();copy.querySelector('.resize-handle')?.remove();copy.querySelectorAll('textarea').forEach((textarea,index)=>{textarea.value=original.querySelectorAll('textarea')[index]?.value??textarea.value;textarea.readOnly=true;textarea.tabIndex=-1;});target.wrapper.classList.add('has-incoming-continuation');target.continuationLayer.append(copy);}
        if(refreshContent&&copy){copy.innerHTML=original.innerHTML;copy.querySelector('.move-handle')?.remove();copy.querySelector('.resize-handle')?.remove();copy.querySelectorAll('textarea').forEach((textarea,index)=>{textarea.value=original.querySelectorAll('textarea')[index]?.value??textarea.value;textarea.readOnly=true;textarea.tabIndex=-1;});}
        copy.style.left=`${item.x+shift}px`;copy.style.top=`${item.y}px`;copy.style.width=`${item.w}px`;copy.style.height=`${item.h}px`;copy.style.transform=`rotate(${item.rotation||0}deg) scale(${item.flipX?-1:1},${item.flipY?-1:1})`;copy.style.zIndex=original.style.zIndex;
      });
    };
    state.panels.forEach((panel, panelIndex) => {
      const wrapper = document.createElement('section'); wrapper.className = `artboard-wrap${panelIndex === state.active ? ' active' : ''}`; wrapper.dataset.panelIndex = panelIndex; wrapper.style.setProperty('--artboard-scale', scale);
      const heading = document.createElement('div'); heading.className = 'artboard-heading';
      const activate = document.createElement('button'); activate.className = 'artboard-title'; activate.innerHTML = `<strong>Viñeta ${panelIndex + 1}</strong><span>${panel.items.length} capas</span>`; activate.onclick = () => setActivePanel(panelIndex, true);
      const viewportBadge=document.createElement('span');viewportBadge.className='viewport-badge';viewportBadge.textContent='ÁREA FINAL';viewportBadge.hidden=panelIndex!==state.active;
      heading.append(activate,viewportBadge); wrapper.append(heading);
      const artboard = document.createElement('div'); artboard.className = 'artboard-frame';
      artboard.style.width = `${LOGICAL_WIDTH * scale}px`; artboard.style.height = `${state.pageHeight * scale}px`;
      const boardCanvas = document.createElement('div'); boardCanvas.className = 'canvas artboard-canvas'; boardCanvas.dataset.panelIndex = panelIndex;
      if (panel.backgroundColor) boardCanvas.style.backgroundColor = panel.backgroundColor;
      boardCanvas.setAttribute('role','application'); boardCanvas.setAttribute('aria-label',`Lienzo de viñeta ${panelIndex + 1}`);
      boardCanvas.style.width = `${LOGICAL_WIDTH}px`; boardCanvas.style.height = `${state.pageHeight}px`; boardCanvas.style.transform = `scale(${scale})`;
      boardCanvas.classList.toggle('grid-off', !state.grid); boardCanvas.classList.toggle('draw-active', $('#toggle-draw').getAttribute('aria-pressed') === 'true');
      boardCanvas.title='Límite de publicación. Lo que sobresale sigue visible aquí y se recorta al exportar.';
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
      const continuationLayer=document.createElement('div');continuationLayer.className='panel-continuation-layer';continuationLayer.setAttribute('aria-hidden','true');boardCanvas.append(continuationLayer);
      panelLayers[panelIndex]={canvas:boardCanvas,continuationLayer,wrapper};
      artboard.append(boardCanvas); wrapper.append(artboard); stage.append(wrapper);
      panel.items.forEach((item, index) => renderItem(item, index, panelIndex, boardCanvas,syncContinuationCopies));
    });
    state.panels.forEach((sourcePanel,sourcePanelIndex)=>sourcePanel.items.forEach(item=>{
      const sourceElement=panelLayers[sourcePanelIndex]?.canvas.querySelectorAll('.placed');
      if(!sourceElement)return;
      const original=[...sourceElement].find(element=>element.dataset.id===item.id);
      if(!original)return;
      panelLayers.forEach((target,index)=>{
        if(!target||index===sourcePanelIndex)return;
        const shift=(sourcePanelIndex-index)*LOGICAL_WIDTH;
        const reach=Math.hypot(item.w,item.h)/2;
        const center=item.x+shift+item.w/2;
        if(center+reach<=0||center-reach>=LOGICAL_WIDTH)return;
        target.wrapper.classList.add('has-incoming-continuation');
        syncContinuationCopies(item,sourcePanelIndex,original);
      });
    }));
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
    const add=document.createElement('button');add.type='button';add.className='panel-add-ghost';add.setAttribute('aria-label','Añadir viñeta al final de la historia');add.title='Añadir una viñeta al final';add.innerHTML=`${svgIcon('plus')}<span>Añadir viñeta</span>`;add.onclick=addPanel;list.append(add);
  }
  function renderItem(item, index, panelIndex, boardCanvas, syncContinuationCopies) {
    const element = document.createElement('div');
    element.syncContinuations=(refreshContent=true)=>syncContinuationCopies?.(item,panelIndex,element,refreshContent);
    element.className = `placed${item.mockupOnly ? ' mockup-only' : ''}${state.selected === item.id && !item.locked ? ' selected' : ''}${item.locked ? ' locked' : ''}${backgroundPickerItemId === item.id ? ' sampling-background' : ''}${item.type === 'bubble' ? ` bubble bubble-${item.kind}${item.tail ? ' has-tail' : ''}` : ''}${item.type === 'drawing' ? ' drawing' : ''}${isFullyOffstage(item) ? ' offstage' : ''}`;
    element.dataset.id = item.id;
    element.style.cssText = `left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;transform:rotate(${item.rotation || 0}deg) scale(${item.flipX ? -1 : 1},${item.flipY ? -1 : 1});--tail-x:${item.tailX ?? 28}%;z-index:${index + 1};`;
    if (item.type === 'image') {
      const img = document.createElement('img'); img.src = item.src; img.alt = item.mockupOnly ? '' : item.name; img.style.filter = item.blur ? `blur(${item.blur}px)` : ''; if(item.mockupOnly&&state.mockupPreview===false)element.hidden=true;element.append(img);
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
      const textarea=document.createElement('textarea');textarea.setAttribute('aria-label',`Texto: ${item.name}`);textarea.value=item.text||'';textarea.readOnly=Boolean(item.locked);textarea.tabIndex=item.locked?-1:0;textarea.style.fontSize=`${item.fontSize||28}px`;textarea.style.fontWeight=String(item.fontWeight||600);textarea.style.textAlign=item.align||'center';textarea.style.color=item.color||'#292725';textarea.style.fontFamily=`'${item.fontFamily||'Fredoka'}', sans-serif`;if(item.textEffect==='outline'){textarea.style.webkitTextStroke='1.2px #fff';textarea.style.paintOrder='stroke fill';}else if(item.textEffect==='shadow')textarea.style.textShadow='2px 3px 0 #0003';
      if(item.textCurve){textarea.classList.add('curved-text-input');updateCurvedTextElement(item,element);}
      textarea.onfocus=()=>{element.classList.add('editing-curved-text');if(!item._typingSnapshot){snapshot();item._typingSnapshot=true;}};textarea.onblur=()=>{element.classList.remove('editing-curved-text');delete item._typingSnapshot;autosave();};
      textarea.oninput=()=>{item.text=textarea.value;textarea.style.height='auto';item.h=Math.max(56,Math.min(state.pageHeight-item.y,textarea.scrollHeight+12));element.style.height=`${item.h}px`;updateCurvedTextElement(item,element);element.syncContinuations(true);autosave();};element.append(textarea);
    } else {
      applyBubbleShape(item,element);
      updateBubbleAccessories(item, element);
      const textarea = document.createElement('textarea'); textarea.setAttribute('aria-label', `Texto: ${item.name}`); textarea.value = item.text || ''; textarea.readOnly=Boolean(item.locked); textarea.tabIndex=item.locked?-1:0;
      styleBubbleText(item, textarea);
      textarea.onfocus = () => { if (!item._typingSnapshot) { snapshot(); item._typingSnapshot = true; } };
      textarea.onblur = () => { delete item._typingSnapshot; autosave(); };
      textarea.oninput = () => {
        item.text = textarea.value;
        if (item.autoGrow !== false) { textarea.style.height = 'auto'; item.h = Math.max(78, Math.min(state.pageHeight - item.y, textarea.scrollHeight + 26)); element.style.height = `${item.h}px`; }
        applyBubbleShape(item,element); updateBubbleAccessories(item,element); element.syncContinuations(true);
        autosave();
      };
      element.append(textarea);
    }
    const moveHandle=document.createElement('button');moveHandle.className='move-handle';moveHandle.type='button';moveHandle.innerHTML=svgIcon('move');moveHandle.hidden=item.id!==state.selected||item.locked;moveHandle.setAttribute('aria-label',`Mover capa ${item.name}`);moveHandle.title=`Arrastra para mover ${item.name}`;element.append(moveHandle);
    const handle = document.createElement('button'); handle.className = 'resize-handle'; handle.type = 'button'; handle.setAttribute('aria-label', `Cambiar tamaño de ${item.name}`); handle.hidden = item.id !== state.selected || item.locked; element.append(handle);
    attachResize(handle, element, item, boardCanvas, panelIndex,()=>element.syncContinuations(false));
    let longPressTimer = null; let longPressOrigin = null;
    element.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); if (!item.locked) openCanvasContextMenu(item,panelIndex,event.clientX,event.clientY); });
    element.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || item.locked || event.target.closest('.resize-handle') || event.target.tagName === 'TEXTAREA') return;
      longPressOrigin = { x:event.clientX, y:event.clientY };
      longPressTimer = setTimeout(() => { longPressTimer = null; openCanvasContextMenu(item,panelIndex,event.clientX,event.clientY); }, 550);
    }, { capture:true });
    element.addEventListener('pointermove', event => { if (longPressTimer && longPressOrigin && Math.hypot(event.clientX-longPressOrigin.x,event.clientY-longPressOrigin.y)>10) { clearTimeout(longPressTimer); longPressTimer=null; } }, { capture:true });
    ['pointerup','pointercancel','pointerleave'].forEach(type => element.addEventListener(type, () => { if (longPressTimer) clearTimeout(longPressTimer); longPressTimer=null; }, { capture:true }));
    element.onpointerdown = event => {
      if (backgroundPickerItemId === item.id) {
        event.preventDefault(); event.stopPropagation();
        sampleImageColorAt(item, event.clientX, event.clientY, element, boardCanvas).then(color => {
          item.backgroundSample = [color.r, color.g, color.b]; clearBackgroundPicker(); autosave(); renderInspector();
          const status = $('#bg-remove-status');
          if (status) { status.hidden = false; status.textContent = `Color ${color.hex} seleccionado. Pulsa “Quitar fondo”.`; }
          toast(`Color de fondo seleccionado: ${color.hex}.`);
        }).catch(error => {
          const status = $('#bg-remove-status');
          if (status) { status.hidden = false; status.textContent = error instanceof Error ? error.message : 'No pude leer ese color.'; }
          toast(status?.textContent || 'No pude leer ese color.');
        });
        return;
      }
      if(event.altKey){
        const stack=[...new Set(document.elementsFromPoint(event.clientX,event.clientY).map(node=>node.closest?.('.placed')).filter(node=>node&&node.dataset.id&&node.closest('.artboard-canvas')===boardCanvas))];
        if(stack.length>1){const index=stack.findIndex(node=>node.dataset.id===item.id),next=stack[(index+1)%stack.length];if(next){event.preventDefault();selectItem(next.dataset.id);return;}}
      }
      if(event.target.tagName==='TEXTAREA') { if(state.active!==panelIndex)setActivePanel(panelIndex,true,false);if(state.selected!==item.id)selectItem(item.id);return; }
      if ($('#toggle-draw').getAttribute('aria-pressed') === 'true' || item.locked || event.target.closest('.resize-handle')) return;
      if (state.active !== panelIndex) setActivePanel(panelIndex, true, false);
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
        syncContinuationCopies?.(item,panelIndex,element);
        element.classList.toggle('offstage', isFullyOffstage(item));
        $$('.transfer-target').forEach(target => target.classList.remove('transfer-target'));
        const candidate = $$('.artboard-canvas').find(canvas => {
          if(canvas===boardCanvas)return false; const rect=canvas.getBoundingClientRect();
          return rect.width>0&&rect.height>0&&moveEvent.clientX>=rect.left&&moveEvent.clientX<=rect.right&&moveEvent.clientY>=rect.top&&moveEvent.clientY<=rect.bottom;
        }) || $$('.panel-card').find(card => {
          const rect=card.getBoundingClientRect();
          return Number(card.dataset.panelIndex)!==panelIndex&&moveEvent.clientX>=rect.left&&moveEvent.clientX<=rect.right&&moveEvent.clientY>=rect.top&&moveEvent.clientY<=rect.bottom;
        });
        if (candidate && Number(candidate.dataset.panelIndex) !== panelIndex) candidate.classList.add('transfer-target');
      };
      element.onpointerup = upEvent => {
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
        element.onpointermove = null; element.onpointerup = null;
        $$('.transfer-target').forEach(target => target.classList.remove('transfer-target'));
        if (!start.moved) return;
        const targetCanvas = $$('.artboard-canvas').find(canvas => {
          if(canvas===boardCanvas)return false; const rect=canvas.getBoundingClientRect();
          return rect.width>0&&rect.height>0&&upEvent.clientX>=rect.left&&upEvent.clientX<=rect.right&&upEvent.clientY>=rect.top&&upEvent.clientY<=rect.bottom;
        });
        const targetCard = targetCanvas ? null : $$('.panel-card').find(card => {
          const rect=card.getBoundingClientRect();
          return Number(card.dataset.panelIndex)!==panelIndex&&upEvent.clientX>=rect.left&&upEvent.clientX<=rect.right&&upEvent.clientY>=rect.top&&upEvent.clientY<=rect.bottom;
        });
        const targetIndex = targetCanvas ? Number(targetCanvas.dataset.panelIndex) : targetCard ? Number(targetCard.dataset.panelIndex) : panelIndex;
        if ((targetCanvas||targetCard) && Number.isInteger(targetIndex) && targetIndex !== panelIndex && state.panels[targetIndex]) {
          const source = state.panels[panelIndex]; const target = state.panels[targetIndex];
          const sourceIndex = source.items.findIndex(entry => entry.id === item.id);
          if (sourceIndex >= 0) {
            source.items.splice(sourceIndex,1);
            if(targetCanvas){
              const rect = targetCanvas.getBoundingClientRect(); const scale = canvasScale(targetCanvas);
              item.x = Math.max(0,Math.min(LOGICAL_WIDTH-item.w,(upEvent.clientX-rect.left)/scale-item.w/2));
              item.y = Math.max(0,Math.min(state.pageHeight-item.h,(upEvent.clientY-rect.top)/scale-item.h/2));
            }else{
              item.x=Math.max(0,(LOGICAL_WIDTH-item.w)/2);item.y=Math.max(0,(state.pageHeight-item.h)/2);
            }
            target.items.push(item); state.active=targetIndex; state.selected=item.id;
            commit(); return;
          }
        }
        autosave(); renderOffstage(); renderLayers();
      };
    };
    element.onclick = event => { event.stopPropagation(); if (item.locked) return; if (state.active !== panelIndex) setActivePanel(panelIndex, true); selectItem(item.id); };
    if ($('#toggle-draw').getAttribute('aria-pressed') === 'true') element.style.pointerEvents = 'none';
    boardCanvas.append(element);
  }
  function attachResize(handle, element, item, boardCanvas, panelIndex,syncContinuationCopies) {
    handle.onpointerdown = event => {
      if (item.locked) return;
      event.preventDefault(); event.stopPropagation(); snapshot();
      if (state.active !== panelIndex) setActivePanel(panelIndex, true, false);
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
        syncContinuationCopies?.();
      };
      handle.onpointerup = () => { if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId); handle.onpointermove = null; autosave(); renderInspector(); renderOffstage(); };
    };
  }
  function renderInspector() {
    const item = currentItem(); const box = $('#inspector-content');
    if (!item) { box.innerHTML = `<div class="empty-state">${svgIcon('image')}<b>Selecciona un elemento</b><p>Su contorno y tirador naranja aparecerán en el lienzo.</p></div>`; return; }
    if (item.locked) { box.innerHTML = `<div class="empty-state">${svgIcon('lock')}<b>${escapeHTML(item.name)} está protegido</b><p>Desbloquéalo desde la pestaña Capas para volver a editarlo.</p></div>`; return; }
    const characterResource = item.type === 'image' && (item.category === 'character' || resources.some(resource => resource.name === item.resourceId && resource.category === 'character'));
    const replaceControl = characterResource ? `<button id="replace-character" class="button replace-character has-icon">${svgIcon('replace')}<span class="button-label">Sustituir personaje</span></button>` : '';
    const sampleHex = item.backgroundSample ? `#${item.backgroundSample.map(value => value.toString(16).padStart(2, '0')).join('')}`.toUpperCase() : '';
    const imageControls = item.type === 'image' ? `<div class="field"><label for="p-blur">Desenfoque · <span id="blur-value">${item.blur || 0}px</span></label><input id="p-blur" type="range" min="0" max="36" step="0.5" value="${item.blur || 0}"><small>Se conserva en el proyecto y también aparece en la exportación.</small></div><div class="field bg-remove-tools"><label for="p-bg-tolerance">Quitar fondo blanco o plano</label><input id="p-bg-tolerance" aria-label="Tolerancia del recorte de fondo" type="range" min="8" max="100" step="2" value="36"><small>Elige el color directamente sobre el dibujo para quitar fondos blancos u otros tonos planos. Se conserva el original para poder restaurarlo.</small><button id="sample-background" type="button" class="button" aria-pressed="${backgroundPickerItemId === item.id}">${backgroundPickerItemId === item.id ? 'Cancelar selección' : sampleHex ? `Cambiar color · ${sampleHex}` : '1 · Elegir color en el dibujo'}</button><button id="remove-background" type="button" class="button">2 · Quitar fondo</button><p id="bg-remove-status" class="bg-remove-status" role="status" aria-live="polite" ${item.backgroundSample ? '' : 'hidden'}>${item.backgroundSample ? `Color ${sampleHex} seleccionado. Pulsa “2 · Quitar fondo”.` : ''}</p>${item.originalSrc ? '<button id="restore-background" type="button" class="button">Restaurar imagen original</button>' : ''}</div>` : '';
    const textControls = item.type === 'text' ? `<div class="field"><label>Contenido</label><textarea id="p-text" rows="4">${escapeHTML(item.text||'')}</textarea></div><div class="field"><label>Tamaño de letra</label><input id="p-text-font" type="range" min="10" max="100" value="${item.fontSize||28}"></div><div class="field"><label>Tipografía</label><select id="p-text-family">${['Comic Neue','Fredoka','Baloo 2','Lilita One'].map(font=>`<option value="${font}" ${item.fontFamily===font?'selected':''}>${font}</option>`).join('')}</select></div><div class="field"><label>Arco · <span id="curve-value">${item.textCurve||0}px</span></label><input id="p-text-curve" type="range" min="-70" max="70" value="${item.textCurve||0}"><small>Curva el titular para sellos, títulos y anuncios.</small></div><div class="field"><label>Tratamiento</label><select id="p-text-effect"><option value="none">Limpio</option><option value="outline" ${item.textEffect==='outline'?'selected':''}>Contorno blanco</option><option value="shadow" ${item.textEffect==='shadow'?'selected':''}>Sombra suave</option></select></div><div class="field"><label>Alineación</label><select id="p-text-align"><option value="left">Izquierda</option><option value="center">Centrada</option><option value="right">Derecha</option></select></div><div class="field"><label>Color</label><input id="p-text-color" type="color" value="${item.color||'#292725'}"></div>` : '';
    const variantControl = item.variants?.length ? `<div class="field"><label>Variación del mismo personaje</label><select id="p-variant">${item.variants.map((variant, i) => `<option value="${i}" ${i === item.variantIndex ? 'selected' : ''}>${escapeHTML(variant.name)}</option>`).join('')}</select></div>` : '';
    const bubbleControls = item.type === 'bubble' ? `<div class="field"><label>Tipo</label><select id="p-kind"><option value="dialogue">Diálogo</option><option value="thought">Pensamiento</option><option value="narration">Narración</option><option value="shout">Voz fuerte</option><option value="sfx">Efecto de sonido</option></select></div>${['dialogue','thought'].includes(item.kind) ? `<div class="field"><label>Forma</label><select id="p-shape"><option value="auto">Adaptar al texto</option><option value="oval">Óvalo</option><option value="rounded">Rectángulo redondeado</option></select></div>` : ''}${item.kind === 'sfx' ? `<div class="field"><label>Estilo de efecto</label><select id="p-action-style"><option value="raised">Naranja con sombra</option><option value="outline">Contorno blanco</option><option value="impact">Sombra dramática</option></select></div>` : ''}<div class="field"><label>Tamaño de letra</label><input id="p-font" type="range" min="10" max="56" value="${item.fontSize || 17}"></div><div class="field"><label>Alineación</label><select id="p-align"><option value="center">Centrada</option><option value="left">Izquierda</option><option value="right">Derecha</option></select></div>${['dialogue','thought','shout'].includes(item.kind) ? `<label class="check-field"><input id="p-tail" type="checkbox" ${item.tail ? 'checked' : ''}> ${item.kind === 'thought' ? 'Burbujas de pensamiento' : 'Cola del globo'}</label>${item.tail ? `<div class="field"><label>Dirección de la cola</label><input id="p-tail-angle" type="range" min="-180" max="180" value="${item.tailAngle ?? 90}"></div><div class="field"><label>Largo de la cola</label><input id="p-tail-length" type="range" min="16" max="90" value="${item.tailLength ?? 34}"></div>` : ''}` : ''}<label class="check-field"><input id="p-autogrow" type="checkbox" ${item.autoGrow === false ? '' : 'checked'}> Ajustar alto al texto</label>` : '';
    const drawingControls = item.type === 'drawing' ? `<div class="field"><label>Relleno del contorno cerrado</label><label class="check-field"><input id="p-fill" type="checkbox" ${item.fillEnabled ? 'checked' : ''}> Aplicar relleno</label><input id="p-fill-color" type="color" value="${item.fillColor || '#F87209'}"></div><div class="field"><label>Color del trazo</label><input id="p-color" type="color" value="${item.color || '#282522'}"></div><div class="field"><label>Grosor</label><input id="p-stroke-width" type="range" min="1" max="40" value="${item.strokeWidth || 5}"></div>` : '';
    const recoverControl = isOffstage(item) ? '<button id="bring-in" class="button recovery">Recuperar dentro del lienzo</button>' : '';
    const flipControls = ['image','drawing'].includes(item.type) ? `<div class="field"><label>Voltear</label><div class="inspector-buttons flip-buttons"><button id="flip-x" aria-pressed="${!!item.flipX}">Horizontal</button><button id="flip-y" aria-pressed="${!!item.flipY}">Vertical</button></div></div>` : '';
    box.innerHTML = `<div class="field"><label>Nombre de capa</label><input id="p-name" value=""></div><p class="placement-help">Arrastra el tirador de cuatro flechas para mover. Usa las flechas del teclado para ajustes precisos. Con capas superpuestas: clic con Alt/Opción o mantén pulsado.</p>${replaceControl}${variantControl}${imageControls}${bubbleControls}${textControls}${drawingControls}<div class="field-row"><div class="field"><label>X</label><input id="p-x" type="number" value="${Math.round(item.x)}"></div><div class="field"><label>Y</label><input id="p-y" type="number" value="${Math.round(item.y)}"></div></div><div class="field-row"><div class="field"><label>Ancho</label><input id="p-w" type="number" value="${Math.round(item.w)}"></div><div class="field"><label>Alto</label><input id="p-h" type="number" value="${Math.round(item.h)}"></div></div><div class="field"><label>Giro</label><input id="p-rot" type="range" min="-180" max="180" value="${item.rotation || 0}"></div>${flipControls}<div class="inspector-buttons"><button id="duplicate">Duplicar</button><button id="delete" class="danger">Borrar</button></div>${recoverControl}`;
    [['#sample-background','eyedropper'],['#remove-background','image'],['#restore-background','undo'],['#bring-in','focus'],['#flip-x','flipH'],['#flip-y','flipV']].forEach(([selector,icon])=>{const button=box.querySelector(selector);if(!button)return;const label=button.textContent.trim();button.classList.add('has-icon');button.innerHTML=`${svgIcon(icon)}<span class="button-label">${escapeHTML(label)}</span>`;button.setAttribute('aria-label',label);});
    const setInspectorButtonLabel=(button,label)=>{const text=button.querySelector('.button-label');if(text)text.textContent=label;else button.textContent=label;};
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
    $('#sample-background')?.addEventListener('click', event => {
      if (backgroundPickerItemId === item.id) {
        clearBackgroundPicker(); event.currentTarget.setAttribute('aria-pressed', 'false');
        setInspectorButtonLabel(event.currentTarget,item.backgroundSample ? `Cambiar color · ${sampleHex}` : '1 · Elegir color en el dibujo');
        const status = $('#bg-remove-status'); if (status) { status.hidden = false; status.textContent = 'Selección de color cancelada.'; }
        return;
      }
      clearBackgroundPicker(); backgroundPickerItemId = item.id;
      activeCanvas()?.querySelector(`[data-id="${item.id}"]`)?.classList.add('sampling-background');
      $('#stage-wrap')?.classList.add('sampling-background-active');
      event.currentTarget.setAttribute('aria-pressed', 'true'); setInspectorButtonLabel(event.currentTarget,'Cancelar selección');
      const status = $('#bg-remove-status'); if (status) { status.hidden = false; status.textContent = 'Toca una zona opaca del fondo en el dibujo. Después pulsa “2 · Quitar fondo”.'; }
      toast('Toca el fondo del dibujo para seleccionar su color.');
    });
    $('#remove-background')?.addEventListener('click', async event => {
      const button = event.currentTarget, status = $('#bg-remove-status');
      button.disabled = true; setInspectorButtonLabel(button,'Procesando imagen…');
      if (status) { status.hidden = false; status.textContent = 'Recortando el fondo conectado al borde; puede tardar unos segundos.'; }
      try {
        const removed = await removeFlatBackground(item.src, Number($('#p-bg-tolerance').value), item.backgroundSample);
        if (removed.alreadyTransparent) throw new Error('Esta imagen ya tiene transparencia en los bordes; no necesita recorte.');
        if (!removed.removed) throw new Error('No pude retirar suficiente fondo conectado al borde. Elige el color directamente sobre el fondo y vuelve a intentarlo.');
        snapshot(); item.originalSrc ||= item.src; item.src = removed.src; item.name ||= 'Dibujo con fondo recortado'; commit();
        toast(`Fondo retirado (${Math.round(removed.removed / removed.total * 100)}% de píxeles). Puedes restaurar la imagen original.`);
      } catch (error) {
        button.disabled = false; setInspectorButtonLabel(button,'2 · Quitar fondo');
        const message = error instanceof Error ? error.message : 'No se pudo recortar el fondo.';
        if (status) { status.hidden = false; status.textContent = message; }
        toast(message);
      }
    });
    $('#restore-background')?.addEventListener('click',()=>{snapshot();item.src=item.originalSrc;delete item.originalSrc;delete item.backgroundSample;commit();toast('Imagen original restaurada.');});
    for (const [axis, property] of [['x','flipX'],['y','flipY']]) $(`#flip-${axis}`)?.addEventListener('click', () => { snapshot(); item[property] = !item[property]; commit(); });
    $('#p-variant')?.addEventListener('change', event => { snapshot(); item.variantIndex = Number(event.target.value); item.src = item.variants[item.variantIndex].src; commit(); });
    $('#replace-character')?.addEventListener('click', () => openCharacterPicker(item.id));
    const textCanvasElement=()=>activeCanvas()?.querySelector(`[data-id="${item.id}"]`);
    $('#p-text')?.addEventListener('input',event=>{item.text=event.target.value;const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');if(textarea)textarea.value=item.text;updateCurvedTextElement(item,el);el.syncContinuations?.(true);}autosave();});
    $('#p-text-font')?.addEventListener('input',event=>{item.fontSize=Number(event.target.value);const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');if(textarea)textarea.style.fontSize=`${item.fontSize}px`;updateCurvedTextElement(item,el);el.syncContinuations?.(true);}autosave();});
    $('#p-text-curve')?.addEventListener('input',event=>{item.textCurve=Number(event.target.value)||0;$('#curve-value').textContent=`${item.textCurve}px`;const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');textarea?.classList.toggle('curved-text-input',Boolean(item.textCurve));updateCurvedTextElement(item,el);el.syncContinuations?.(true);}autosave();});
    $('#p-text-align')?.addEventListener('change',event=>{item.align=event.target.value;const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');if(textarea)textarea.style.textAlign=item.align;el.syncContinuations?.(true);}autosave();});
    $('#p-text-color')?.addEventListener('input',event=>{item.color=event.target.value;const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');if(textarea)textarea.style.color=item.color;updateCurvedTextElement(item,el);el.syncContinuations?.(true);}autosave();});
    $('#p-text-family')?.addEventListener('change',event=>{item.fontFamily=event.target.value;const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');if(textarea)textarea.style.fontFamily=`'${item.fontFamily}', sans-serif`;updateCurvedTextElement(item,el);el.syncContinuations?.(true);}autosave();});
    $('#p-text-effect')?.addEventListener('change',event=>{item.textEffect=event.target.value;const el=textCanvasElement();if(el){const textarea=el.querySelector('textarea');if(textarea){textarea.style.webkitTextStroke=item.textEffect==='outline'?'1.2px #fff':'';textarea.style.textShadow=item.textEffect==='shadow'?'2px 3px 0 #0003':'';}el.syncContinuations?.(true);}autosave();});
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
    $('#delete').onclick = () => { snapshot(); currentPanel().items = currentPanel().items.filter(entry => entry.id !== item.id); state.selected = null; commit(); };
    $('#bring-in')?.addEventListener('click', () => recoverItem(item.id));
  }
  function renderLayers() {
    const list = $('#layer-list'); list.innerHTML = '';
    const items = [...currentPanel().items].reverse();
    $('#layer-count').textContent = `${items.length} ${items.length === 1 ? 'capa' : 'capas'}`;
    $('#layer-count-tab').textContent = String(items.length);
    items.forEach(item => {
      const row = document.createElement('div'); row.className = `layer-row${item.id === state.selected ? ' active' : ''}${isOffstage(item) ? ' layer-offstage' : ''}`;
      row.draggable = true;
      row.innerHTML = `<button type="button" class="layer-grip" aria-label="Arrastrar capa ${escapeHTML(item.name)}" title="Arrastrar para reordenar">${svgIcon('grip')}</button><span class="layer-icon">${svgIcon(item.type === 'bubble' ? 'bubble' : item.type === 'drawing' ? 'pen' : 'image')}</span><span class="layer-name" title="Doble clic para renombrar">${escapeHTML(item.name)}</span><button type="button" class="layer-rename" aria-label="Renombrar capa ${escapeHTML(item.name)}" title="Renombrar">${svgIcon('edit')}</button><button type="button" class="layer-order" aria-label="Subir capa">${svgIcon('up')}</button><button type="button" class="layer-order down" aria-label="Bajar capa">${svgIcon('down')}</button><button type="button" class="lock" aria-label="${item.locked ? 'Desbloquear' : 'Bloquear'} capa ${escapeHTML(item.name)}">${svgIcon(item.locked ? 'lock' : 'unlock')}</button>`;
      row.onclick = event => { if (!event.target.closest('button,input')) selectItem(item.id); };
      row.ondblclick = event => { if (!event.target.closest('button,input')) startLayerRename(item,row); };
      row.querySelector('.lock').onclick = event => { event.stopPropagation(); snapshot(); item.locked = !item.locked; if(item.locked&&state.selected===item.id)state.selected=null; commit(); };
      row.querySelector('.layer-order').onclick = event => { event.stopPropagation(); reorderLayer(item.id, 1); };
      row.querySelector('.down').onclick = event => { event.stopPropagation(); reorderLayer(item.id, -1); };
      row.querySelector('.layer-rename').onclick = event => { event.stopPropagation(); startLayerRename(item,row); };
      const grip=row.querySelector('.layer-grip');
      grip.addEventListener('pointerdown',event=>{if(event.button!==undefined&&event.button!==0)return;event.preventDefault();layerDragId=item.id;grip.setPointerCapture(event.pointerId);row.classList.add('layer-dragging');});
      grip.addEventListener('pointermove',event=>{if(!layerDragId||layerDragId!==item.id)return;const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.layer-row');$$('.layer-drop-target').forEach(entry=>entry.classList.toggle('layer-drop-target',entry===target&&target!==row));});
      const finishLayerPointer=event=>{if(layerDragId!==item.id)return;const source=layerDragId;layerDragId=null;row.classList.remove('layer-dragging');const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.layer-row');$$('.layer-drop-target').forEach(entry=>entry.classList.remove('layer-drop-target'));if(target&&target!==row)reorderLayerTo(source,target.dataset.layerId);};
      grip.addEventListener('pointerup',finishLayerPointer);grip.addEventListener('pointercancel',()=>{layerDragId=null;row.classList.remove('layer-dragging');$$('.layer-drop-target').forEach(entry=>entry.classList.remove('layer-drop-target'));});
      row.addEventListener('dragstart', event => { if (event.target.closest('button')) { event.preventDefault(); return; } layerDragId=item.id; row.classList.add('layer-dragging'); event.dataTransfer.effectAllowed='move'; event.dataTransfer.setData('text/plain',item.id); });
      row.addEventListener('dragover', event => { if (!layerDragId || layerDragId === item.id) return; event.preventDefault(); event.dataTransfer.dropEffect='move'; row.classList.add('layer-drop-target'); });
      row.addEventListener('dragleave', () => row.classList.remove('layer-drop-target'));
      row.dataset.layerId=item.id;
      row.addEventListener('drop', event => { event.preventDefault(); row.classList.remove('layer-drop-target'); const sourceId=event.dataTransfer.getData('text/plain')||layerDragId; if(sourceId)reorderLayerTo(sourceId,item.id); layerDragId=null; });
      row.addEventListener('dragend', () => { layerDragId=null; row.classList.remove('layer-dragging'); $$('.layer-drop-target').forEach(target=>target.classList.remove('layer-drop-target')); });
      list.append(row);
    });
  }
  function startLayerRename(item,row) {
    if (!row.isConnected || row.querySelector('.layer-name-input')) return;
    const name = row.querySelector('.layer-name');
    const input = document.createElement('input'); input.className='layer-name-input'; input.value=item.name||''; input.setAttribute('aria-label',`Nombre de capa ${item.name||''}`);
    name.replaceWith(input); input.focus(); input.select(); let finished=false;
    const finish = save => { if(finished)return; finished=true; const value=input.value.trim(); if(save&&value&&value!==(item.name||'')){snapshot();item.name=value;commit();} else if(input.isConnected){const label=document.createElement('span');label.className='layer-name';label.textContent=item.name||'Capa';input.replaceWith(label);} };
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();finish(true);}if(event.key==='Escape'){event.preventDefault();finish(false);}});
    input.addEventListener('blur',()=>finish(true));
  }
  function reorderLayerTo(sourceId,targetId) {
    const items=currentPanel().items;const visual=[...items].reverse();const from=visual.findIndex(item=>item.id===sourceId);const to=visual.findIndex(item=>item.id===targetId);if(from<0||to<0||from===to)return;
    snapshot();const [moved]=visual.splice(from,1);visual.splice(to,0,moved);currentPanel().items=visual.reverse();commit();
  }
  function reorderLayer(itemId, delta) {
    const items = currentPanel().items; const from = items.findIndex(item => item.id === itemId); const to = Math.max(0, Math.min(items.length - 1, from + delta));
    if (from < 0 || from === to) return;
    snapshot(); [items[from], items[to]] = [items[to], items[from]]; commit();
  }
  function renderOffstage() {
    const entries = currentPanel().items.filter(isOffstage); const panel = $('#offstage-panel');
    panel.hidden = entries.length === 0; $('#offstage-count').textContent = String(entries.length); const list = $('#offstage-list'); list.innerHTML = '';
    entries.forEach(item => { const button = document.createElement('button'); button.className = 'offstage-item has-icon'; button.innerHTML = `${svgIcon('focus')}<span class="button-label">${escapeHTML(item.name)} · recuperar</span>`; button.onclick = () => selectItem(item.id); list.append(button); });
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
        const retry=grid.querySelector('.reference-retry');retry.classList.add('has-icon');retry.innerHTML=`${svgIcon('refresh')}<span>Reintentar</span>`;retry.onclick = () => { referenceLoadFailed = false; renderResources(); };
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
    if (isBackground) renderBackgroundColors(grid, query);
    if (resourceFilter === 'object' && !candidates.length) {
      grid.innerHTML = '<div class="resource-note">Todavía no hay objetos aislados con calidad suficiente para insertar. Los sobres, clips e inodoros que aparecen en las escenas conservan partes del fondo; puedes encontrarlos en Referencias.</div>'; return;
    }
    if (!candidates.length) { if (isBackground) return; grid.innerHTML = '<div class="resource-note">No encontré recursos con ese nombre.</div>'; return; }
    candidates.forEach(resource => {
      const card = document.createElement('button'); card.className = `asset-card${resource.approvedCutout ? '' : ' reference-card'}`;
      const thumb = resource.variants?.[0]?.src || resource.src;
      card.innerHTML = `<img src="${thumb}" alt="" loading="lazy"><span>${escapeHTML(resource.name)}</span><small>${resource.approvedCutout ? 'Componente aprobado' : resource.reviewKind === 'existing-sticker' ? 'Sticker existente · referencia no insertable' : resource.reviewOnly ? 'Recorte en revisión · no insertable' : resource.category === 'background' ? 'Referencia · lámina completa' : resource.note}</small>`;
      card.disabled = !resource.approvedCutout && !resource.reviewOnly;
      if (resource.reviewOnly) {
        card.setAttribute('aria-label', `Revisar ${resource.name}. No se puede insertar todavía.`);
        card.onclick = () => openCutoutReview(resource);
      } else if (resource.approvedCutout) {
        // Mouse and Apple Pencil can drag directly. On touch screens, keep the
        // vertical gesture for scrolling and start a drag only after a long press.
        card.draggable = false;
        card.onclick = () => { if (Date.now() >= suppressAssetClickUntil) addResource(resource); };
        let pointerDrag = null;
        const startResourceDrag = (event, drag) => {
          if (!pointerDrag || pointerDrag.id !== drag.id || drag.started) return;
          drag.started=true; suppressAssetClickUntil=Date.now()+1200;
          try { card.setPointerCapture(drag.id); } catch {}
          $('#library-panel').classList.add('dragging-from-library');
          const ghost=document.createElement('div'); ghost.className='asset-drag-ghost'; ghost.innerHTML=`<img src="${thumb}" alt=""><span>${escapeHTML(resource.name)}</span>`; document.body.append(ghost); drag.ghost=ghost;
          ghost.style.left=`${event.clientX+12}px`; ghost.style.top=`${event.clientY+12}px`;
        };
        card.addEventListener('pointerdown', event => {
          const touch = event.pointerType === 'touch';
          const drag = { id:event.pointerId, x:event.clientX, y:event.clientY, started:false, ghost:null, touch, holdTimer:null };
          pointerDrag=drag;
          if (touch) drag.holdTimer=setTimeout(() => startResourceDrag({clientX:drag.x,clientY:drag.y},drag), 450);
          else { try { card.setPointerCapture(event.pointerId); } catch {} }
        });
        card.addEventListener('pointermove', event => {
          if (!pointerDrag || pointerDrag.id !== event.pointerId) return;
          const distance=Math.hypot(event.clientX-pointerDrag.x,event.clientY-pointerDrag.y);
          if(pointerDrag.touch&&!pointerDrag.started&&distance>14){clearTimeout(pointerDrag.holdTimer);pointerDrag=null;return;}
          if (!pointerDrag.started && distance>14) startResourceDrag(event,pointerDrag);
          if (pointerDrag.started) {
            event.preventDefault(); pointerDrag.ghost.style.left=`${event.clientX+12}px`; pointerDrag.ghost.style.top=`${event.clientY+12}px`;
            $$('.artboard-canvas.drop-target').forEach(canvas=>canvas.classList.remove('drop-target'));
            const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.artboard-canvas'); target?.classList.add('drop-target');
          }
        });
        const finishPointerDrag = event => {
          if (!pointerDrag || pointerDrag.id!==event.pointerId) return;
          clearTimeout(pointerDrag.holdTimer);
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
          $$('.artboard-canvas.drop-target').forEach(canvas=>canvas.classList.remove('drop-target'));
          pointerDrag.ghost?.remove(); pointerDrag=null;
        };
        card.addEventListener('pointerup',finishPointerDrag); card.addEventListener('pointercancel',finishPointerDrag);
      }
      grid.append(card);
    });
  }
  function openCutoutReview(resource) {
    const dialog = $('#reference-preview-dialog');
    const existingSticker = resource.reviewKind === 'existing-sticker';
    const objectCutout = resource.reviewKind === 'object-cutout';
    const backgroundExtract = resource.reviewKind === 'background-extract';
    $('#reference-preview-title').textContent = resource.name;
    $('#reference-preview-subtitle').textContent = existingSticker ? 'Sticker existente · referencia no insertable' : backgroundExtract ? 'Fondo extraído · pendiente de revisión' : objectCutout ? 'Recorte de objeto · pendiente de revisión' : 'Borrador de recorte · recurso pendiente de aprobación';
    $('#reference-preview-pose-label').textContent = existingSticker ? 'Tipo de recurso' : backgroundExtract ? 'Fuente del fondo' : objectCutout ? 'Tipo de objeto' : 'Estado del recorte';
    $('#reference-preview-expression-label').textContent = 'Nota de revisión';
    $('#reference-preview-pose').textContent = existingSticker ? 'Imagen del pack existente; no se cambió ni se separó del fondo.' : backgroundExtract ? 'Recorte de una región del panel sin personajes.' : objectCutout ? 'Los píxeles proceden de la forma visible en el episodio enlazado.' : 'Los píxeles proceden de la pose visible en el episodio enlazado.';
    $('#reference-preview-expression').textContent = resource.note;
    $('#reference-preview-image').src = resource.src;
    $('#reference-preview-image').alt = existingSticker || backgroundExtract ? `Referencia del ${resource.name}` : `Borrador recortado de ${resource.name}`;
    $('#reference-preview-source').href = resource.source;
    $('#reference-preview-note').textContent = existingSticker ? 'La imagen original se mantiene intacta. No se puede insertar hasta confirmar su uso y, si corresponde, preparar un PNG transparente.' : backgroundExtract ? 'El recorte conserva la proporción de la región de origen y no contiene personajes. Sigue pendiente de revisión antes de insertarse.' : 'Este recurso aparece para revisión en la biblioteca, pero todavía no se puede insertar en el lienzo. Al aprobarlo, se podrá activar como componente.';
    dialog.showModal();
  }
  function renderBackgroundColors(grid, query = '') {
    const matches = backgroundColors.filter(entry => `${entry.name} ${entry.source} ${entry.color}`.toLocaleLowerCase('es').includes(query));
    const section = document.createElement('section'); section.className = 'background-palette-library';
    const heading = document.createElement('div'); heading.className = 'background-palette-heading';
    const title = document.createElement('strong'); title.textContent = 'Fondos de color';
    const hint = document.createElement('small'); hint.textContent = `Se aplica a la viñeta ${state.active + 1}`;
    heading.append(title, hint); section.append(heading);
    if (matches.length) {
      const options = document.createElement('div'); options.className = 'background-color-options';
      matches.forEach(entry => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'background-color-card';
        button.dataset.color = entry.color;
        button.setAttribute('aria-label', `Aplicar ${entry.name}, ${entry.color}, a la viñeta ${state.active + 1}`);
        button.setAttribute('aria-pressed', String((currentPanel().backgroundColor || '#FFFFFF').toUpperCase() === entry.color));
        const swatch = document.createElement('span'); swatch.className = 'background-color-swatch'; swatch.style.backgroundColor = entry.color; swatch.setAttribute('aria-hidden', 'true');
        const copy = document.createElement('span'); copy.className = 'background-color-copy';
        const name = document.createElement('b'); name.textContent = entry.name;
        const source = document.createElement('small'); source.textContent = `${entry.source} · ${entry.color}`;
        copy.append(name, source); button.append(swatch, copy);
        button.onclick = () => applyPanelBackground(entry.color, entry.name);
        options.append(button);
      });
      section.append(options);
    } else {
      const empty = document.createElement('small'); empty.className = 'background-palette-empty'; empty.textContent = 'No hay muestras con ese término.'; section.append(empty);
    }
    const custom = document.createElement('label'); custom.className = 'background-custom-color';
    const customName = document.createElement('span'); customName.textContent = 'Elegir otro color';
    const picker = document.createElement('input'); picker.type = 'color'; picker.value = currentPanel().backgroundColor || '#FFFFFF'; picker.setAttribute('aria-label', `Elegir fondo personalizado para la viñeta ${state.active + 1}`);
    picker.addEventListener('change', () => applyPanelBackground(picker.value.toUpperCase(), 'color personalizado'));
    custom.append(customName, picker); section.append(custom); grid.append(section);
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
      $$('.filters button').forEach(candidate => {
        const active = candidate === button;
        candidate.classList.toggle('active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
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
    const target = event.currentTarget; const panelIndex = Number(target.dataset.panelIndex); if (state.active !== panelIndex) setActivePanel(panelIndex,true,false);
    if (brushMode === 'eraser') {
      erasing = { panelIndex, canvas:target, radius:Math.max(5,Number($('#brush-size').value)*1.4), changed:false, snapshot:false };
      target.setPointerCapture(event.pointerId); eraseAtPoint(pointOnCanvas(event,target)); return;
    }
    const first = pointOnCanvas(event,target);
    drawing = { segments:new Map([[panelIndex,{canvas:target,points:[first]}]]), color:selectedColor, size:Number($('#brush-size').value), brush:brushMode, opacity:brushMode === 'marker' ? .4 : brushMode === 'pencil' ? .75 : 1, panelIndex, canvas:target, lastClient:{x:event.clientX,y:event.clientY} };
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
    const from=drawing.lastClient, to={x:event.clientX,y:event.clientY};
    const boards=$$('#stage .artboard-canvas').filter(board=>board.getClientRects().length).map(canvas=>({canvas,index:Number(canvas.dataset.panelIndex),rect:canvas.getBoundingClientRect()})).sort((a,b)=>a.rect.left-b.rect.left);
    const dx=to.x-from.x;
    if(Math.abs(dx)<.5){
      const board=boards.find(entry=>to.x>=entry.rect.left&&to.x<=entry.rect.right)||boards.reduce((best,entry)=>!best||Math.min(Math.abs(to.x-entry.rect.left),Math.abs(to.x-entry.rect.right))<Math.min(Math.abs(to.x-best.rect.left),Math.abs(to.x-best.rect.right))?entry:best,null);
      if(board)appendDrawingPoint(board.index,board.canvas,pointOnCanvas({clientX:to.x,clientY:to.y,pointerType:event.pointerType,pressure:event.pressure},board.canvas));
    }else{
      let routed=false;
      for(const board of boards){
        const a=(board.rect.left-from.x)/dx, b=(board.rect.right-from.x)/dx;
        const start=Math.max(0,Math.min(a,b)), end=Math.min(1,Math.max(a,b)); if(end<start)continue;
        routed=true;
        const pointAt=t=>({x:from.x+dx*t,y:from.y+(to.y-from.y)*t});
        const p0=pointAt(start), p1=pointAt(end);
        const makePoint=point=>({x:(point.x-board.rect.left)/(board.rect.width/LOGICAL_WIDTH),y:(point.y-board.rect.top)/(board.rect.width/LOGICAL_WIDTH),pressure:event.pointerType==='pen'?Math.max(.15,event.pressure):.65});
        appendDrawingPoint(board.index,board.canvas,makePoint(p0)); appendDrawingPoint(board.index,board.canvas,makePoint(p1));
      }
      if(!routed&&boards.length){const board=boards.reduce((best,entry)=>!best||Math.min(Math.abs(to.x-entry.rect.left),Math.abs(to.x-entry.rect.right))<Math.min(Math.abs(to.x-best.rect.left),Math.abs(to.x-best.rect.right))?entry:best,null);appendDrawingPoint(board.index,board.canvas,pointOnCanvas({clientX:to.x,clientY:to.y,pointerType:event.pointerType,pressure:event.pressure},board.canvas));}
    }
    drawing.lastClient=to; drawPreview();
  }
  function appendDrawingPoint(panelIndex,canvas,point) {
    if(!drawing.segments.has(panelIndex))drawing.segments.set(panelIndex,{canvas,points:[]});
    const points=drawing.segments.get(panelIndex).points, previous=points.at(-1);
    if(!previous||Math.hypot(previous.x-point.x,previous.y-point.y)>.25)points.push(point);
  }
  function drawPreview() {
    if (!drawing) return;
    for(const segment of drawing.segments.values()){
      segment.canvas.querySelector('.temporary-stroke')?.remove(); if(segment.points.length<2)continue;
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.classList.add('temporary-stroke'); svg.setAttribute('viewBox',`0 0 ${LOGICAL_WIDTH} ${state.pageHeight}`);
      const path = document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d',segment.points.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ')); path.setAttribute('fill','none'); path.setAttribute('stroke',drawing.color); path.setAttribute('stroke-width',drawing.size*(drawing.brush==='marker'?1.8:drawing.brush==='pencil'?.65:1)); path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round'); path.setAttribute('opacity',drawing.opacity); if(drawing.brush==='pencil')path.setAttribute('stroke-dasharray','1 1'); svg.append(path); segment.canvas.append(svg);
    }
  }
  function finishDrawing(event) {
    if (erasing) {
      const current = erasing; if(current.canvas.hasPointerCapture(event.pointerId))current.canvas.releasePointerCapture(event.pointerId); erasing=null;
      if(current.changed)commit(); return;
    }
    if (!drawing) return;
    continueDrawing(event);
    const current = drawing; const target = current.canvas; if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId); drawing=null;
    for(const segment of current.segments.values())segment.canvas.querySelector('.temporary-stroke')?.remove();
    const strokes=[];
    for(const [panelIndex,segment] of current.segments){
      if(segment.points.length<2)continue;
      const pressure=segment.points.reduce((sum,p)=>sum+p.pressure,0)/segment.points.length;
      const strokeWidth=Math.max(1,current.size*(.45+pressure*.95)); const first=segment.points[0],last=segment.points.at(-1);
      const closed=segment.points.length>4&&Math.hypot(first.x-last.x,first.y-last.y)<=Math.max(14,strokeWidth*2);
      strokes.push({panelIndex,stroke:{points:segment.points.map(({x,y})=>({x,y})),color:current.color,strokeWidth,opacity:current.opacity,brush:current.brush,closed}});
    }
    if(!strokes.length)return;
    snapshot(); let selectedItem=null;
    for(const {panelIndex,stroke} of strokes){
      const panel=state.panels[panelIndex]; let item=drawingObjectId?panel.items.find(entry=>entry.id===drawingObjectId&&entry.type==='drawing'):null;
      if(item){item.strokes.push(stroke);updateDrawingBounds(item);}
      else{item={id:drawingObjectId||id(),type:'drawing',name:drawingObjectId?'Dibujo':'Trazo',x:0,y:0,w:1,h:1,path:'',strokes:[stroke],color:stroke.color,strokeWidth:stroke.strokeWidth,fillEnabled:false,fillColor:'#F87209',locked:false,rotation:0};updateDrawingBounds(item);panel.items.push(item);}
      selectedItem ||= item;
    }
    state.selected=selectedItem?.id||null; commit();
  }
  function cancelDrawing(event) {
    const target = event.currentTarget;
    if (drawing?.canvas === target) {
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      for(const segment of drawing.segments.values())segment.canvas.querySelector('.temporary-stroke')?.remove(); drawing = null;
    }
    if (erasing?.canvas === target) {
      const current = erasing;
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      erasing = null; if (current.changed) commit();
    }
  }
  function drawCurvedCanvasText(ctx,item){
    const fontSize=item.fontSize||34,lines=String(item.text||'').split('\n'),sagitta=Number(item.textCurve)||0,sign=Math.sign(sagitta),sag=Math.abs(sagitta);
    if(!sag){wrapText(ctx,item.text,0,0,item.w*.92,fontSize*1.2);return;}
    const measured=lines.map(line=>line||' '),lineGap=fontSize*1.15;
    measured.forEach((line,row)=>{
      const fullWidth=ctx.measureText(line).width,ratio=Math.min(1,item.w*.92/Math.max(1,fullWidth)),width=fullWidth*ratio,radius=(width*width/4+sag*sag)/(2*sag),sweep=2*Math.asin(Math.min(.999,width/2/radius)),centerY=(row-(measured.length-1)/2)*lineGap+sign*(radius-sag),start=sign>0?-Math.PI/2-sweep/2:Math.PI/2+sweep/2;
      let offset=0;ctx.save();ctx.scale(ratio,1);
      for(const character of line){const advance=ctx.measureText(character).width*ratio,angle=start+sign*(offset+advance/2)/Math.max(1,radius),x=radius*Math.cos(angle),y=centerY+radius*Math.sin(angle),rotation=angle+(sign>0?Math.PI/2:-Math.PI/2);ctx.save();ctx.translate(x,y);ctx.rotate(rotation);if(item.textEffect==='outline'){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.strokeText(character,-advance/(2*ratio),0);}ctx.fillText(character,-advance/(2*ratio),0);ctx.restore();offset+=advance;}
      ctx.restore();
    });
  }
  async function renderPanelPng(panel, panelIndex = state.panels.indexOf(panel)) {
    await document.fonts?.ready;
    const preset = FORMAT[state.format]; const logicalHeight = state.pageHeight; const style = state.exportStyle || 'classic';
    const output = document.createElement('canvas'); output.width = preset.width; output.height = preset.height;
    const ctx = output.getContext('2d');
    const bounds = style === 'bleed'
      ? {x:0,y:0,w:output.width,h:output.height}
      : style === 'classic'
        ? { x:output.width*.10, y:output.height*.085, w:output.width*.80, h:output.height*.84 }
        : style === 'cream'
          ? { x:output.width*.065, y:output.height*.075, w:output.width*.87, h:output.height*.85 }
          : { x:output.width*.035, y:output.height*.035, w:output.width*.93, h:output.height*.79 };
    ctx.fillStyle = style === 'classic' ? '#FFC928' : style === 'cream' ? '#FFF5D6' : '#FFFFFF'; ctx.fillRect(0,0,output.width,output.height);
    if (style === 'classic') {
      ctx.fillStyle = '#FFD84A';
      for (let y=output.height*.015;y<output.height;y+=output.height*.055) for (let x=output.width*.015;x<output.width;x+=output.width*.055) { ctx.beginPath();ctx.arc(x,y,Math.max(4,output.width*.014),0,Math.PI*2);ctx.fill(); }
    }
    if(style!=='bleed'){
      ctx.save();ctx.shadowColor=style==='classic'?'#8D681733':'#4D38251A';ctx.shadowBlur=output.width*.015;ctx.shadowOffsetY=output.height*.007;
      ctx.fillStyle=style==='classic'?'#FFFFFF':'#FFFEFB';roundedRect(ctx,bounds.x,bounds.y,bounds.w,bounds.h,output.width*.045);ctx.fill();ctx.restore();
      if(style!=='footer'){ctx.strokeStyle=style==='classic'?'#FFF8E9':'#E9DCC8';ctx.lineWidth=Math.max(2,output.width*.002);roundedRect(ctx,bounds.x,bounds.y,bounds.w,bounds.h,output.width*.045);ctx.stroke();}
    }
    const scale = Math.min(bounds.w / LOGICAL_WIDTH, bounds.h / logicalHeight);
    const offsetX = bounds.x + (bounds.w - LOGICAL_WIDTH * scale) / 2; const offsetY = bounds.y + (bounds.h - logicalHeight * scale) / 2;
    ctx.save(); if(style==='bleed'){ctx.beginPath();ctx.rect(0,0,output.width,output.height);ctx.clip();}else{roundedRect(ctx,bounds.x,bounds.y,bounds.w,bounds.h,output.width*.045);ctx.clip();}
    ctx.fillStyle = panel.backgroundColor || '#FFFFFF'; ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h);
    const exportItems=[];
    state.panels.forEach((sourcePanel,sourcePanelIndex)=>sourcePanel.items.forEach((item,layerIndex)=>{
      const panelX=item.x+(sourcePanelIndex-panelIndex)*LOGICAL_WIDTH;
      const reach=Math.hypot(item.w,item.h)/2+(item.blur||0)*2;
      const centerX=panelX+item.w/2;
      if(centerX+reach<=0||centerX-reach>=LOGICAL_WIDTH)return;
      exportItems.push({item,panelX,sourcePanelIndex,layerIndex});
    }));
    exportItems.sort((a,b)=>a.sourcePanelIndex-b.sourcePanelIndex||a.layerIndex-b.layerIndex);
    for (const {item,panelX} of exportItems) {
      ctx.save(); ctx.translate(offsetX + (panelX + item.w / 2) * scale, offsetY + (item.y + item.h / 2) * scale); ctx.rotate((item.rotation || 0) * Math.PI / 180); ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1); ctx.scale(scale, scale);
      if (item.type === 'image') {
        if(item.mockupOnly&&state.mockupPreview===false){ctx.restore();continue;}
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
        ctx.fillStyle=item.color||'#292725';ctx.font=`${item.fontWeight||600} ${item.fontSize||28}px "${item.fontFamily||'Fredoka'}", sans-serif`;ctx.textAlign=item.align||'center';ctx.textBaseline='middle';if(item.textEffect==='shadow'){ctx.shadowColor='#0003';ctx.shadowBlur=2;ctx.shadowOffsetX=2;ctx.shadowOffsetY=3;}if(item.textEffect==='outline'){ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle='#fff';const lines=String(item.text||'').split('\n');for(let i=0;i<lines.length;i++)ctx.strokeText(lines[i],0,(i-(lines.length-1)/2)*(item.fontSize||28)*1.25,item.w*.92);}if(item.textCurve)drawCurvedCanvasText(ctx,item);else wrapText(ctx,item.text,0,0,item.w*.92,(item.fontSize||28)*1.25);
      } else {
        if (item.kind === 'sfx') {
          ctx.fillStyle='#F87209';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.shadowColor='#292725';ctx.shadowBlur=0;ctx.shadowOffsetX=3;ctx.shadowOffsetY=4;
        } else {
          ctx.fillStyle=item.kind==='narration'?'#fff5df':'#fff';ctx.strokeStyle='#302d2a';ctx.lineWidth=3;
          const silhouette=new Path2D(organicBubblePath(item.w,item.h,item));ctx.save();ctx.translate(-item.w/2,-item.h/2);ctx.fill(silhouette);ctx.stroke(silhouette);ctx.restore();
          if(item.kind==='thought'&&item.tail){const a=(item.tailAngle??90)*Math.PI/180,ux=Math.cos(a),uy=Math.sin(a);[14,9,5].forEach((diameter,i)=>{const t=[.34,.62,.86][i],distance=Math.max(item.w,item.h)*.46+(item.tailLength??34)*t;ctx.beginPath();ctx.arc(ux*distance,uy*distance,diameter/2,0,Math.PI*2);ctx.fill();ctx.stroke();});}
        }
        ctx.fillStyle = item.kind === 'sfx' ? '#F87209' : '#302d2a'; ctx.font = `${['sfx','shout'].includes(item.kind) ? '700 ' : '400 '}${item.kind==='shout'?Math.max(24,item.fontSize||24):item.fontSize || 17}px "Comic Neue", sans-serif`; ctx.textAlign = item.align || 'center'; ctx.textBaseline = 'middle';
        wrapText(ctx, ['sfx','shout'].includes(item.kind)?String(item.text||'').toUpperCase():item.text, 0, 0, item.w * 0.82, (item.fontSize || 17) * 1.25);
      }
      ctx.restore();
    }
    ctx.restore();
    if (style === 'footer') {
      ctx.fillStyle='#FFF5D6';ctx.fillRect(0,output.height*.86,output.width,output.height*.14);
      ctx.fillStyle='#F87209';ctx.fillRect(output.width*.035,output.height*.86,output.width*.93,Math.max(4,output.height*.006));
    }
    const logo = style==='bleed'?null:await loadImage('/assets/mandarinita-logo.svg').catch(()=>null);
    const maxLogoWidth=output.width*.26, maxLogoHeight=Math.min(output.height*.085,output.width*.085);
    const logoScale=logo?Math.min(maxLogoWidth/logo.naturalWidth,maxLogoHeight/logo.naturalHeight):0;
    const logoW=logo?logo.naturalWidth*logoScale:0, logoH=logo?logo.naturalHeight*logoScale:0;
    const logoX=(output.width-logoW)/2, logoY=style==='footer'?output.height*.86+(output.height*.14-logoH)/2:0;
    if (logo) {
      const padX=logoH*.34,padY=logoH*.12;
      ctx.fillStyle='#F5FFE0';roundedRect(ctx,logoX-padX,logoY-padY,logoW+padX*2,logoH+padY*2,(logoH+padY*2)*.48);ctx.fill();
      ctx.drawImage(logo,logoX,logoY,logoW,logoH);
    }
    const copyright=`© ${new Date().getFullYear()}. Mandarinita es una marca comercial mixta, registrada por Mauricio Quezada.`;
    if(['classic','cream'].includes(style)){
      ctx.save();ctx.translate(output.width*.035,output.height*.51);ctx.rotate(-Math.PI/2);ctx.fillStyle='#50493D';ctx.font=`${Math.max(10,output.width*.012)}px "Work Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(copyright,0,0,output.height*.9);ctx.restore();
      ctx.save();ctx.translate(output.width*.965,output.height*.51);ctx.rotate(Math.PI/2);ctx.fillStyle='#E86408';ctx.font=`700 ${Math.max(12,output.width*.016)}px "Work Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('www.mandarinita.art',0,0,output.height*.72);ctx.restore();
      ctx.fillStyle='#E86408';ctx.font=`700 ${Math.max(12,output.width*.019)}px "Work Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('@mandarinita.art',output.width/2,output.height*.965,output.width*.35);
    } else if(style==='footer'){
      ctx.fillStyle='#50493D';ctx.font=`${Math.max(9,output.width*.009)}px "Work Sans",sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(`© ${new Date().getFullYear()} Mandarinita® · Mauricio Quezada`,output.width*.035,output.height*.95,output.width*.39);
      ctx.fillStyle='#E86408';ctx.font=`700 ${Math.max(10,output.width*.011)}px "Work Sans",sans-serif`;ctx.textAlign='right';ctx.fillText('www.mandarinita.art',output.width*.965,output.height*.95,output.width*.25);
    }
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
  function svgEscape(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char])); }
  function svgLines(text, maxChars) {
    const lines=[];
    for (const paragraph of String(text||'').split('\n')) {
      let line='';
      for (const word of paragraph.split(/\s+/)) {
        const next=line?`${line} ${word}`:word;
        if(line&&next.length>maxChars){lines.push(line);line=word;}else line=next;
      }
      lines.push(line);
    }
    return lines;
  }
  async function base64Asset(src) {
    if(/^data:/.test(src))return src;
    const response=await fetch(src);if(!response.ok)throw new Error(`No pude preparar el recurso ${src}`);
    const blob=await response.blob(),bytes=new Uint8Array(await blob.arrayBuffer());let binary='';
    for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
    return `data:${blob.type||'application/octet-stream'};base64,${btoa(binary)}`;
  }
  async function renderPanelSvg(panel) {
    const hasMockup=(state.contentType||'')==='mockup';
    const fontFiles={'Fredoka':'/assets/fonts/fredoka-latin.woff2','Baloo 2':'/assets/fonts/baloo-2-latin.woff2','Bangers':'/assets/fonts/bangers-latin.woff2','Comic Neue':'/assets/fonts/comic-neue-regular.ttf','Lilita One':'/assets/fonts/lilita-one-latin.woff2'};
    const usedFonts=[...new Set(panel.items.filter(item=>(item.type==='text'&&!item.mockupOnly)||item.type==='bubble').map(item=>item.type==='bubble'?'Comic Neue':item.fontFamily).filter(font=>fontFiles[font]))];
    const fontFaces=await Promise.all(usedFonts.flatMap(font=>(font==='Comic Neue'?[['400','/assets/fonts/comic-neue-regular.ttf'],['700','/assets/fonts/comic-neue-bold.ttf']]:[['100 900',fontFiles[font]]]).map(async ([weight,path])=>`@font-face{font-family:'${font}';src:url('${await base64Asset(path)}') format('${font==='Comic Neue'?'truetype':'woff2'}');font-weight:${weight};font-style:normal}`)));
    const content=[];
    if(!hasMockup&&panel.backgroundColor)content.push(`<rect width="${LOGICAL_WIDTH}" height="${state.pageHeight}" fill="${svgEscape(panel.backgroundColor)}"/>`);
    for(const item of panel.items){
      if(item.mockupOnly)continue;
      const transform=`translate(${item.x+item.w/2} ${item.y+item.h/2}) rotate(${item.rotation||0}) scale(${item.flipX?-1:1} ${item.flipY?-1:1}) translate(${-item.w/2} ${-item.h/2})`;
      if(item.type==='image'){
        const src=await base64Asset(item.src).catch(()=>item.src);
        content.push(`<image x="0" y="0" width="${item.w}" height="${item.h}" transform="${transform}" href="${svgEscape(src)}" preserveAspectRatio="xMidYMid meet" style="filter:${item.blur?`blur(${item.blur}px)`:'none'}"/>`);
      } else if(item.type==='drawing'){
        const strokes=item.strokes?.length?item.strokes:[{path:item.path,color:item.color,strokeWidth:item.strokeWidth}];
        const paths=strokes.map(stroke=>{let d=stroke.path||'';if(stroke.points?.length)d=stroke.points.map((point,index)=>`${index?'L':'M'}${point.x-item.x} ${point.y-item.y}`).join(' ')+(stroke.closed?' Z':'');return `<path d="${svgEscape(d)}" fill="${item.fillEnabled&&stroke.closed?svgEscape(item.fillColor||'#F87209'):'none'}" stroke="${svgEscape(stroke.color||item.color||'#292725')}" stroke-width="${stroke.strokeWidth||item.strokeWidth||5}" stroke-linecap="round" stroke-linejoin="round" opacity="${stroke.opacity??1}"/>`;}).join('');
        content.push(`<g transform="${transform}">${paths}</g>`);
      } else if(item.type==='text'||item.type==='bubble'){
        const isBubble=item.type==='bubble',size=item.fontSize||28,font=item.fontFamily||'Fredoka',align=item.align||'center',anchor=align==='left'?'start':align==='right'?'end':'middle';
        const x=align==='left'?8:align==='right'?item.w-8:item.w/2,lines=svgLines(item.text,Math.max(8,Math.floor(item.w/(size*.53)))),leading=size*1.16,startY=(item.h-lines.length*leading)/2+size*.82;
        let shape='';
        if(isBubble&&item.kind!=='sfx'){
          shape=`<path d="${organicBubblePath(item.w,item.h,item)}" fill="${item.kind==='narration'?'#fff5df':'#fff'}" stroke="#302d2a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
          if(item.kind==='thought'&&item.tail){const a=(item.tailAngle??90)*Math.PI/180,ux=Math.cos(a),uy=Math.sin(a);shape+=[14,9,5].map((diameter,index)=>{const t=[.34,.62,.86][index],distance=Math.max(item.w,item.h)*.46+(item.tailLength??34)*t;return `<circle cx="${item.w/2+ux*distance}" cy="${item.h/2+uy*distance}" r="${diameter/2}" fill="#fff" stroke="#302d2a" stroke-width="2"/>`;}).join('');}
        }
        const family=isBubble?'Comic Neue':font,weight=item.fontWeight||(isBubble&&['shout','sfx'].includes(item.kind)?700:isBubble?400:700),color=item.color||(item.kind==='sfx'?'#F87209':'#302d2a');
        const effect=item.textEffect==='outline'?'stroke="#fff" stroke-width="2" paint-order="stroke fill"':item.textEffect==='shadow'?'filter="url(#text-shadow)"':'';
        const textLines=lines.map((line,index)=>`<tspan x="${x}" y="${startY+index*leading}">${svgEscape(isBubble&&['sfx','shout'].includes(item.kind)?line.toUpperCase():line)}</tspan>`).join('');
        const curveId=`curve-export-${String(item.id).replace(/[^a-zA-Z0-9_-]/g,'')}`,curveBase=item.h*.58,curvePath=`M 4 ${curveBase} Q ${item.w/2} ${curveBase-(item.textCurve||0)*1.8} ${item.w-4} ${curveBase}`;
        const curved=!isBubble&&item.textCurve?`<defs><path id="${curveId}" d="${curvePath}"/></defs><textPath href="#${curveId}" startOffset="50%" text-anchor="middle">${svgEscape(item.text)}</textPath>`:textLines;
        content.push(`<g transform="${transform}">${shape}<text text-anchor="${anchor}" font-family="'${svgEscape(family)}',sans-serif" font-size="${size}" font-weight="${weight}" fill="${svgEscape(color)}" ${effect}>${curved}</text></g>`);
      }
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${LOGICAL_WIDTH*2}" height="${state.pageHeight*2}" viewBox="0 0 ${LOGICAL_WIDTH} ${state.pageHeight}"><defs><filter id="text-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="2" dy="3" stdDeviation="1" flood-opacity=".25"/></filter></defs><style>${fontFaces.join('')}</style>${content.join('')}</svg>`;
    return svg;
  }
  async function exportPanelSvg() {
    try {
      const svg=await renderPanelSvg(currentPanel()),blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
      download(blob,`${slugify(state.title||'diseno-mandarinita')}-arte.svg`);
      toast(state.contentType==='mockup'?'SVG listo: conserva el texto como vector y omite el mockup del producto.':'SVG listo para escalar; las imágenes de personajes conservan su resolución original.');
    } catch(error) { toast(error instanceof Error?error.message:'No pude exportar el arte vectorial.'); }
  }
  async function exportReview() {
    state.format = $('#export-preset').value; state.exportStyle = $('#export-style').value || 'classic'; state.status = 'review'; const savedLocally = autosave();
    const title = state.title || 'Episodio nuevo'; const slug = slugify(title) || 'episodio-nuevo';
    const isEpisode=(state.contentType||'episode')==='episode';
    const metadata = isEpisode
      ? { schemaVersion: 1, editorialPolicy: 'manual-approval', exportTemplate:state.exportStyle, episodes: [{ id: slug, title: { es: title }, episodeNumber: null, status: 'review', type: 'comic', complete: false, source: { kind: 'editor-draft', instagramMediaId: null, instagramPermalink: null }, panels: state.panels.map((panel, index) => ({ order: index + 1, alt: { es: `Viñeta ${index + 1} pendiente de revisión` }, src: `assets/episodes/drafts/${slug}/vineta-${String(index + 1).padStart(2, '0')}.png` })) }] }
      : { schemaVersion:1, editorialPolicy:'manual-approval', exportTemplate:state.exportStyle, status:'review', published:false, contentType:state.contentType, title, projectSource:'proyecto.json', panels:state.panels.map((panel,index)=>({order:index+1,asset:`assets/content/drafts/${state.contentType}/${slug}/frame-${String(index+1).padStart(2,'0')}.png`,text:panel.items.filter(item=>item.type==='text'||item.type==='bubble').map(item=>({type:item.type,text:item.text||'',x:item.x,y:item.y,w:item.w,h:item.h,fontSize:item.fontSize||null,align:item.align||'center'}))})) };
    const files = [{ name: 'metadata-review.json', data: new TextEncoder().encode(JSON.stringify(metadata, null, 2)) }];
    for (let index = 0; index < state.panels.length; index++) { const image = await renderPanelPng(state.panels[index],index); const path=isEpisode?`assets/episodes/drafts/${slug}/vineta-${String(index+1).padStart(2,'0')}.png`:`assets/content/drafts/${state.contentType}/${slug}/frame-${String(index+1).padStart(2,'0')}.png`; files.push({ name:path, data: new Uint8Array(await image.arrayBuffer()) }); }
    download(zipStore(files), `${slug}-revision.zip`); toast(savedLocally ? 'Paquete de revisión listo. No se publica automáticamente.' : 'Paquete listo; conserva el ZIP porque el borrador no cupo en este dispositivo.');
  }

  function suggestedPanelAlt(panel, index, language, episodeNumber, title) {
    const images = panel.items.filter(item => item.type === 'image').map(item => item.name).filter(Boolean);
    const texts = panel.items.filter(item => item.type === 'text' || item.type === 'bubble').map(item => String(item.text || '').trim()).filter(Boolean);
    const names = [...new Set(images)].slice(0, 5);
    const esParts = [`Viñeta ${index + 1} del episodio ${episodeNumber}: ${title}.`];
    const enParts = [`Panel ${index + 1} of episode ${episodeNumber}: ${title}.`];
    if (names.length) { esParts.push(`Aparecen ${names.join(', ')}.`); enParts.push(`Featuring ${names.join(', ')}.`); }
    if (texts.length) { esParts.push(`Texto visible: ${texts.join('; ')}.`); enParts.push(`Visible text: ${texts.join('; ')}.`); }
    const value = language === 'en' ? enParts.join(' ') : esParts.join(' ');
    return value.slice(0, 300);
  }

  let publishedEpisodeRecords = [];
  let editorCharacterCatalog = null;
  async function getEditorCharacterCatalog() {
    if (!editorCharacterCatalog) editorCharacterCatalog = fetch('/characters.json', { cache: 'no-cache' }).then(response => response.ok ? response.json() : { characters: [] }).then(data => data.characters || []).catch(() => []);
    return editorCharacterCatalog;
  }
  const splitEditorialList = value => [...new Set(String(value || '').split(/[\n,;]+/).map(item => item.trim()).filter(Boolean))].slice(0, 24);
  function episodeCanvasMetadata() {
    const imageItems = state.panels.flatMap(panel => panel.items.filter(item => item.type === 'image'));
    const characters = [...new Set(imageItems.flatMap(item => {
      const person = people.find(candidate => candidate.name === item.name || candidate.variants?.some(variant => variant.name === item.name || variant.src === item.src));
      return person ? [person.name] : [];
    }))];
    const objects = [...new Set(imageItems.filter(item => item.category === 'object').map(item => item.name).filter(Boolean))];
    const swatches = [...new Set(state.panels.map(panel => panel.backgroundColor).concat(state.panels.flatMap(panel => panel.items.flatMap(item => [item.color, item.fillColor]))).filter(value => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)))];
    const knownColorNames = { '#f87209': 'naranja Mandarinita', '#607d3b': 'verde Mandarinita', '#fac421': 'amarillo Mandarinita', '#ffc928': 'amarillo sol', '#fff8ec': 'crema Mandarinita', '#282522': 'tinta oscura', '#ffffff': 'blanco' };
    const colors = [...new Set(swatches.flatMap(color => [color.toUpperCase(), knownColorNames[color.toLowerCase()]].filter(Boolean)))];
    const spokenText = state.panels.flatMap(panel => panel.items.filter(item => item.type === 'text' || item.type === 'bubble').map(item => String(item.text || '').trim())).filter(Boolean).join('\n');
    return { characters, objects, themes: [], colors, searchTerms: [...new Set(imageItems.map(item => item.name).filter(Boolean))], spokenText, externalLinks: [] };
  }
  function parseExternalLinks(value) {
    return String(value || '').split('\n').map(line => line.trim()).filter(Boolean).slice(0, 12).flatMap(line => {
      const [rawLabel, ...parts] = line.split('|');
      const url = (parts.length ? parts.join('|') : rawLabel).trim();
      const label = (parts.length ? rawLabel : (() => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'Enlace'; } })()).trim();
      try { return /^https:$/.test(new URL(url).protocol) && label ? [{ label: label.slice(0, 60), url: new URL(url).href }] : []; } catch { return []; }
    });
  }
  function externalLinksText(links) { return (links || []).map(link => `${link.label} | ${link.url}`).join('\n'); }
  async function characterIdsFromNames(value) {
    const entries = await getEditorCharacterCatalog();
    const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
    const tokens = splitEditorialList(value);
    const ids = [], unknown = [];
    for (const token of tokens) {
      const match = entries.find(entry => entry.id === token || normalize(entry.name) === normalize(token) || (entry.aliases || []).some(alias => normalize(alias) === normalize(token)));
      if (match) ids.push(match.id); else unknown.push(token);
    }
    return { ids: [...new Set(ids)], unknown };
  }
  async function characterNamesFromIds(ids) {
    const entries = await getEditorCharacterCatalog();
    return (ids || []).map(value => entries.find(entry => entry.id === value)?.name || value);
  }
  function updateRetirementDateMinimum(startSelector, endSelector) {
    const start=$(startSelector),end=$(endSelector);
    if(!start||!end)return;
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start.value)){end.removeAttribute('min');return;}
    end.min=new Date(Date.parse(`${start.value}:00Z`)+60_000).toISOString().slice(0,16);
  }
  const publicationTimeZone='America/Santo_Domingo';
  function dateTimeInputValue(value) {
    if(!value)return '';
    const raw=String(value);
    if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return `${raw}T00:00`;
    const date=new Date(raw);
    if(!Number.isFinite(date.getTime()))return '';
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:publicationTimeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(part=>[part.type,part.value]));
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  }
  function publicationDateTimeIso(value) {
    if(!value)return null;
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return null;
    const naive=new Date(`${value}:00Z`);
    if(!Number.isFinite(naive.getTime()))return null;
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:publicationTimeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(naive).map(part=>[part.type,part.value]));
    const zonedAsUtc=Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day),Number(parts.hour),Number(parts.minute),Number(parts.second));
    return new Date(naive.getTime()-(zonedAsUtc-naive.getTime())).toISOString();
  }
  function scheduleLabel(value) {
    if(!value)return '';
    const dateOnly=/^\d{4}-\d{2}-\d{2}$/.test(value);
    const date=dateOnly?new Date(`${value}T12:00:00-04:00`):new Date(value);
    if(!Number.isFinite(date.getTime()))return String(value);
    return new Intl.DateTimeFormat('es-DO',{timeZone:publicationTimeZone,day:'numeric',month:'short',year:'numeric',...(dateOnly?{}:{hour:'numeric',minute:'2-digit'})}).format(date);
  }

  function clearPublishReviewPreview() {
    publishReviewUrls.forEach(url => URL.revokeObjectURL(url));
    publishReviewUrls = [];
    publishPreviewReady = false;
    publishPreviewError = '';
    $('#publish-review-preview')?.replaceChildren();
  }

  function refreshPublishReadiness() {
    const list = $('#publish-readiness-list');
    if (!list) return;
    const number = Number($('#publish-episode-number').value);
    const titleEs = $('#publish-episode-title-es').value.trim();
    const titleEn = $('#publish-episode-title-en').value.trim();
    const isRealTitle = value => Boolean(value) && !/^(episodio nuevo|episodio sin título|nuevo episodio|untitled|new episode)$/i.test(value.trim());
    const publishDate = $('#publish-episode-date').value;
    const retireDate = $('#publish-episode-unpublish-date').value;
    const numberAvailable = !publishKnownNumbers.includes(number);
    const altFields = [...$('#publish-panel-descriptions').querySelectorAll('textarea')];
    const altComplete = altFields.length === state.panels.length * 2 && altFields.every(field => field.value.trim().length >= 8);
    const dateValid = Boolean(publishDate) && (!retireDate || retireDate > publishDate);
    const checks = [
      { label: 'Número y títulos en español e inglés', ok: Number.isInteger(number) && number >= 1 && number <= 9999 && numberAvailable && isRealTitle(titleEs) && isRealTitle(titleEn), detail: !numberAvailable ? `El número ${number} ya aparece en el archivo; elige otro.` : !isRealTitle(titleEs) || !isRealTitle(titleEn) ? 'Escribe títulos reales en ambos idiomas.' : undefined },
      { label: 'Fechas de publicación y retiro', ok: dateValid },
      { label: 'Vista final de todas las viñetas', ok: publishPreviewReady, pending: !publishPreviewReady && !publishPreviewError, error: publishPreviewError },
      { label: 'Descripciones accesibles en español e inglés', ok: altComplete, detail: `${altFields.filter(field => field.value.trim().length >= 8).length} de ${state.panels.length * 2} completas` }
    ];
    list.replaceChildren();
    checks.forEach(check => {
      const item = document.createElement('li');
      item.dataset.state = check.ok ? 'complete' : check.pending ? 'pending' : 'needs-attention';
      const icon = document.createElement('span');
      icon.className = 'publish-check-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = check.ok ? '✓' : check.pending ? '…' : '!';
      const text = document.createElement('span');
      text.className = 'publish-check-copy';
      const label = document.createElement('strong');
      label.textContent = check.label;
      const detail = document.createElement('small');
      detail.textContent = check.error || check.detail || (check.ok ? 'Listo' : check.pending ? 'Preparando…' : 'Revisa este punto');
      text.append(label, detail);
      item.append(icon, text);
      list.append(item);
    });
    const complete = checks.filter(check => check.ok).length;
    const hasMetadata = ['#publish-characters','#publish-objects','#publish-themes','#publish-colors','#publish-search-terms','#publish-spoken-text','#publish-external-links'].some(selector => $(selector).value.trim());
    const optionalItem = document.createElement('li'); optionalItem.dataset.state = 'optional';
    const optionalIcon = document.createElement('span'); optionalIcon.className = 'publish-check-icon'; optionalIcon.setAttribute('aria-hidden','true'); optionalIcon.textContent = '＋';
    const optionalCopy = document.createElement('span'); optionalCopy.className = 'publish-check-copy';
    const optionalLabel = document.createElement('strong'); optionalLabel.textContent = 'Metadatos para búsquedas y redes';
    const optionalDetail = document.createElement('small'); optionalDetail.textContent = hasMetadata ? 'Añadidos · puedes seguir editándolos abajo' : 'Opcionales · ayudan a encontrar y compartir el episodio';
    optionalCopy.append(optionalLabel, optionalDetail); optionalItem.append(optionalIcon, optionalCopy); list.append(optionalItem);
    $('#publish-review-count').textContent = `${complete}/${checks.length}`;
    $('#publish-review-count').setAttribute('aria-label', `${complete} de ${checks.length} requisitos completos`);
    $('#publish-review-summary').textContent = complete === checks.length ? 'Todo listo para publicar.' : `${complete} de ${checks.length} requisitos listos para publicar.`;
    $('#publish-episode-submit').disabled = complete !== checks.length;
  }

  async function preparePublishReviewPreview() {
    clearPublishReviewPreview();
    const preview = $('#publish-review-preview');
    preview.setAttribute('aria-busy', 'true');
    const styleLabel = $('#export-style').selectedOptions[0]?.textContent.trim() || state.exportStyle || 'Plantilla actual';
    const templateLabel = $('#export-preset').selectedOptions[0]?.textContent.trim() || FORMAT[state.format]?.label || 'Formato actual';
    $('#publish-review-template').textContent = `Formato: ${templateLabel} · Plantilla: ${styleLabel} · ${state.panels.length} viñetas`;
    refreshPublishReadiness();
    try {
      for (let index = 0; index < state.panels.length; index++) {
        const blob = await renderPanelPng(state.panels[index], index);
        if (!blob) throw new Error(`No se pudo preparar la viñeta ${index + 1}.`);
        const url = URL.createObjectURL(blob);
        publishReviewUrls.push(url);
        const figure = document.createElement('figure');
        figure.className = 'publish-review-panel';
        const caption = document.createElement('figcaption');
        caption.textContent = `Viñeta ${index + 1}`;
        const image = document.createElement('img');
        image.src = url;
        image.alt = `Vista exportada de la viñeta ${index + 1}, formato ${templateLabel}, plantilla ${styleLabel}`;
        image.addEventListener('load', () => {
          publishPreviewReady = !publishPreviewError && publishReviewUrls.length === state.panels.length && [...preview.querySelectorAll('img')].every(node => node.complete && node.naturalWidth > 0);
          refreshPublishReadiness();
        }, { once: true });
        image.addEventListener('error', () => {
          publishPreviewError = `No se pudo mostrar la viñeta ${index + 1}.`;
          refreshPublishReadiness();
        }, { once: true });
        figure.append(caption, image);
        preview.append(figure);
      }
      publishPreviewReady = !publishPreviewError && [...preview.querySelectorAll('img')].length === state.panels.length && [...preview.querySelectorAll('img')].every(node => node.complete && node.naturalWidth > 0);
    } catch (error) {
      publishPreviewError = error instanceof Error ? error.message : 'No se pudo preparar la vista final.';
    } finally {
      preview.setAttribute('aria-busy', 'false');
      refreshPublishReadiness();
    }
  }

  async function openPublishEpisodeDialog() {
    if (state.contentType !== 'episode') {
      const previousType = state.contentType || 'diseño';
      if (!await confirmWithBrand({ title: 'Publicar como episodio', message: `Este borrador está clasificado como «${previousType}». ¿Quieres publicarlo como episodio? Se conservarán las viñetas y sus capas.`, confirmLabel: 'Continuar a publicación' })) return;
      state.contentType = 'episode';
      autosave();
      render();
    }
    $('#export-preview-dialog').close();
    clearPublishReviewPreview();
    const form = $('#publish-episode-form');
    const status = $('#publish-episode-status');
    status.textContent = '';
    $('#publish-episode-title-es').value = state.title || '';
    $('#publish-episode-title-en').value = state.episodeTitleEn || '';
    $('#publish-episode-date').value = dateTimeInputValue(state.publishedAt) || dateTimeInputValue(new Date().toISOString());
    $('#publish-episode-unpublish-date').value = dateTimeInputValue(state.unpublishAt);
    updateRetirementDateMinimum('#publish-episode-date','#publish-episode-unpublish-date');
    let catalog = { episodes: [] };
    try {
      const response = await fetch('/api/editor/episodes', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Inicia sesión para consultar el catálogo y publicar.');
      catalog.episodes = result.episodes || [];
    } catch (error) { toast(error instanceof Error ? error.message : 'No pude consultar el catálogo de episodios.'); return; }
    publishKnownNumbers = (catalog.episodes || []).filter(entry => entry.id !== state.publishedEpisodeId).map(entry => Number(entry.episodeNumber)).filter(Number.isFinite);
    const maxEpisode = Math.max(0, ...(catalog.episodes || []).map(entry => Number(entry.episodeNumber) || 0));
    $('#publish-episode-number').value = state.episodeNumber || maxEpisode + 1;
    const inferred = episodeCanvasMetadata();
    const saved = state.editorialMetadata || {};
    const characterNames = saved.characters ? await characterNamesFromIds(saved.characters) : inferred.characters;
    $('#publish-characters').value = characterNames.join(', ');
    $('#publish-objects').value = (saved.objects || inferred.objects).join(', ');
    $('#publish-themes').value = (saved.themes || []).join(', ');
    $('#publish-colors').value = (saved.colors || inferred.colors).join(', ');
    $('#publish-search-terms').value = (saved.searchTerms || inferred.searchTerms).join(', ');
    $('#publish-spoken-text').value = saved.spokenText || inferred.spokenText;
    $('#publish-external-links').value = externalLinksText(saved.externalLinks || []);
    const descriptions = $('#publish-panel-descriptions');
    descriptions.replaceChildren();
    state.panels.forEach((panel, index) => {
      const card = document.createElement('section');
      card.className = 'publish-panel-description';
      const heading = document.createElement('h3');
      heading.textContent = `Viñeta ${index + 1}`;
      card.append(heading);
      for (const [language, label] of [['es', 'Descripción en español'], ['en', 'Description in English']]) {
        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = label;
        const textarea = document.createElement('textarea');
        textarea.name = `alt-${language}-${index + 1}`;
        textarea.required = true;
        textarea.minLength = 8;
        textarea.maxLength = 300;
        textarea.value = panel.alt?.[language] || suggestedPanelAlt(panel, index, language, state.episodeNumber || maxEpisode + 1, state.title || 'Episodio nuevo');
        fieldLabel.append(textarea);
        card.append(fieldLabel);
      }
      descriptions.append(card);
    });
    form.dataset.pending = 'false';
    $('#publish-episode-submit').textContent = state.publishedEpisodeId ? 'Actualizar publicación' : 'Publicar episodio';
    $('#publish-episode-dialog').showModal();
    await preparePublishReviewPreview();
  }

  async function submitEpisodePublication(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.dataset.pending === 'true' || !validateFormInline(form, $('#publish-episode-status'))) return;
    form.dataset.pending = 'true';
    const submit = $('#publish-episode-submit');
    const status = $('#publish-episode-status');
    submit.disabled = true;
    $('#publish-episode-close').disabled = true;
    $('#publish-episode-cancel').disabled = true;
    submit.textContent = 'Preparando viñetas…';
    status.textContent = 'Subiendo el episodio al sitio. No cierres esta ventana todavía.';
    try {
      const episodeNumber = Number($('#publish-episode-number').value);
      const publishedAt = publicationDateTimeIso($('#publish-episode-date').value);
      const unpublishAt = publicationDateTimeIso($('#publish-episode-unpublish-date').value);
      if (!publishedAt || ($('#publish-episode-unpublish-date').value && !unpublishAt)) throw new Error('Elige una fecha y hora válidas para publicar y retirar el episodio.');
      const title = { es: $('#publish-episode-title-es').value.trim(), en: $('#publish-episode-title-en').value.trim() };
      const idValue = state.publishedEpisodeId || `ep-${String(state.projectId || '').replace(/[^a-zA-Z0-9_-]/g, '')}`;
      const resolvedCharacters = await characterIdsFromNames($('#publish-characters').value);
      const editorialMetadata = {
        characters: resolvedCharacters.ids,
        objects: splitEditorialList($('#publish-objects').value),
        themes: splitEditorialList($('#publish-themes').value),
        colors: splitEditorialList($('#publish-colors').value),
        searchTerms: [...new Set(splitEditorialList($('#publish-search-terms').value).concat(resolvedCharacters.unknown))],
        spokenText: $('#publish-spoken-text').value.trim(),
        externalLinks: parseExternalLinks($('#publish-external-links').value)
      };
      const panels = state.panels.map((panel, index) => ({
        order: index + 1,
        alt: {
          es: form.elements.namedItem(`alt-es-${index + 1}`).value.trim(),
          en: form.elements.namedItem(`alt-en-${index + 1}`).value.trim()
        }
      }));
      const payload = new FormData();
      payload.append('metadata', JSON.stringify({ id: idValue, projectId: state.projectId, episodeNumber, publishedAt, unpublishAt, title, exportTemplate: state.exportStyle || 'classic', metadata: editorialMetadata, panels }));
      for (let index = 0; index < state.panels.length; index++) {
        const image = await renderPanelPng(state.panels[index], index);
        payload.append(`panel-${index + 1}`, image, `episodio-${episodeNumber}-vineta-${index + 1}.png`);
        submit.textContent = `Subiendo viñeta ${index + 1} de ${state.panels.length}…`;
      }
      const response = await fetch('/api/published-episodes', { method: 'POST', credentials: 'same-origin', body: payload });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No se pudo publicar el episodio.');
      state.publishedEpisodeId = idValue;
      state.episodeNumber = episodeNumber;
      state.title = title.es;
      state.publishedAt = publishedAt;
      state.unpublishAt = unpublishAt;
      state.editorialMetadata = editorialMetadata;
      state.episodeTitleEn = title.en;
      state.status = result.scheduled ? 'scheduled' : 'published';
      autosave();
      $('#publish-episode-dialog').close();
      $('#publish-episode-close').disabled = false;
      $('#publish-episode-cancel').disabled = false;
      const archiveUrl = `${location.origin}/episodios.html`;
      toast(result.scheduled ? `Episodio ${episodeNumber} programado para ${scheduleLabel(publishedAt)}. Se mostrará en ${archiveUrl}.` : `Episodio ${episodeNumber} publicado en ${archiveUrl}.`);
      if (!$('#published-episodes-section').hidden) loadPublishedEpisodes();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'No se pudo publicar. El borrador sigue guardado.';
      form.dataset.pending = 'false';
      submit.disabled = false;
      $('#publish-episode-close').disabled = false;
      $('#publish-episode-cancel').disabled = false;
      submit.textContent = state.publishedEpisodeId ? 'Actualizar publicación' : 'Publicar episodio';
    }
  }

  function showHomeSection(section) {
    const published = section === 'published';
    $('#home-heading').hidden = published;
    $('#project-list').hidden = published;
    $('#home-footnote').hidden = published;
    $('#published-episodes-section').hidden = !published;
    $('#show-drafts').classList.toggle('active', !published);
    $('#show-published-episodes').classList.toggle('active', published);
    if (published) { $('#show-published-episodes').setAttribute('aria-current', 'page'); $('#show-drafts').removeAttribute('aria-current'); }
    else { $('#show-drafts').setAttribute('aria-current', 'page'); $('#show-published-episodes').removeAttribute('aria-current'); }
    $('.home-actions').hidden = published;
    if (published) loadPublishedEpisodes();
  }

  async function loadPublishedEpisodes() {
    const status = $('#published-episode-list-status');
    status.textContent = 'Cargando catálogo…';
    try {
      const response = await fetch('/api/editor/episodes', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No pude cargar los episodios.');
      publishedEpisodeRecords = Array.isArray(result.episodes) ? result.episodes : [];
      renderPublishedEpisodes();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'No pude cargar el catálogo. Vuelve a intentarlo.';
    }
  }

  function renderPublishedEpisodes() {
    const list = $('#published-episode-list');
    const query = String($('#published-episode-search').value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
    const selectedStatus = $('#published-episode-status-filter').value;
    const filtered = publishedEpisodeRecords.filter(entry => {
      if (selectedStatus !== 'all' && entry.status !== selectedStatus) return false;
      const search = [entry.episodeNumber, entry.title?.es, entry.title?.en, entry.status, entry.publishedAt, entry.unpublishAt, entry.characters, entry.objects, entry.themes, entry.colors, entry.searchTerms, entry.spokenText, entry.externalLinks?.map(link => `${link.label} ${link.url}`)].flat(2).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
      return !query || search.includes(query);
    });
    list.replaceChildren();
    $('#published-episode-list-status').textContent = `${filtered.length} de ${publishedEpisodeRecords.length} episodios · Puedes buscar por personaje, color, tema, frase o número.`;
    if (!filtered.length) {
      const empty = document.createElement('div'); empty.className = 'published-episode-empty';
      empty.textContent = publishedEpisodeRecords.length ? 'No encontré episodios con esa búsqueda.' : 'No hay episodios en el catálogo. Comprueba la sesión y actualiza.';
      list.append(empty); return;
    }
    for (const entry of filtered) {
      const card = document.createElement('article'); card.className = 'published-episode-card';
      const thumb = document.createElement('div'); thumb.className = 'published-episode-thumb';
      if (entry.thumbnail) { const image = document.createElement('img'); image.src = entry.thumbnail; image.alt = ''; image.loading = 'lazy'; image.onerror = () => image.remove(); thumb.append(image); }
      const copy = document.createElement('div'); copy.className = 'published-episode-copy';
      const title = document.createElement('strong'); title.textContent = `#${entry.episodeNumber || '—'} · ${entry.title?.es || 'Episodio sin título'}`;
      const status = document.createElement('small');
      const labels = { published: 'Publicado', scheduled: 'Programado', unpublished: 'No publicado' };
      status.textContent = `${labels[entry.status] || entry.status} · ${entry.panelCount} viñetas${entry.publishedAt ? ` · ${scheduleLabel(entry.publishedAt)}` : ''}${entry.unpublishAt ? ` → ${scheduleLabel(entry.unpublishAt)}` : ''} · ${entry.sourceType === 'editor' ? 'Del editor' : 'Catálogo existente'}`;
      const tags = document.createElement('div'); tags.className = 'published-episode-meta';
      for (const value of [...(entry.characters || []), ...(entry.themes || []), ...(entry.colors || [])].slice(0, 6)) { const tag = document.createElement('span'); tag.textContent = value; tags.append(tag); }
      copy.append(title, status); if (tags.childElementCount) copy.append(tags);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'button'; button.textContent = 'Administrar'; button.onclick = () => openManagePublishedEpisode(entry);
      card.append(thumb, copy, button); list.append(card);
    }
  }

  async function openManagePublishedEpisode(entry) {
    const form = $('#manage-published-episode-form');
    $('#manage-published-episode-id').value = entry.id;
    $('#manage-published-episode-title').textContent = `Episodio ${entry.episodeNumber || ''}`;
    $('#manage-episode-number').value = entry.episodeNumber || '';
    $('#manage-episode-status').value = entry.status || 'published';
    $('#manage-episode-title-es').value = entry.title?.es || '';
    $('#manage-episode-title-en').value = entry.title?.en || '';
    $('#manage-episode-date').value = dateTimeInputValue(entry.publishedAt);
    $('#manage-episode-unpublish-date').value = dateTimeInputValue(entry.unpublishAt);
    updateRetirementDateMinimum('#manage-episode-date','#manage-episode-unpublish-date');
    $('#manage-episode-characters').value = (await characterNamesFromIds(entry.characters || [])).join(', ');
    $('#manage-episode-objects').value = (entry.objects || []).join(', ');
    $('#manage-episode-themes').value = (entry.themes || []).join(', ');
    $('#manage-episode-colors').value = (entry.colors || []).join(', ');
    $('#manage-episode-search-terms').value = (entry.searchTerms || []).join(', ');
    $('#manage-episode-spoken-text').value = entry.spokenText || '';
    $('#manage-episode-external-links').value = externalLinksText(entry.externalLinks || []);
    $('#manage-published-episode-status').textContent = '';
    form.dataset.pending = 'false';
    $('#manage-published-episode-save').disabled = false;
    $('#manage-published-episode-close').disabled = false;
    $('#manage-published-episode-cancel').disabled = false;
    $('#manage-published-episode-dialog').showModal();
  }

  async function saveManagedEpisode(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.dataset.pending === 'true' || !validateFormInline(form, $('#manage-published-episode-status'))) return;
    form.dataset.pending = 'true';
    const button = $('#manage-published-episode-save');
    const status = $('#manage-published-episode-status');
    button.disabled = true; $('#manage-published-episode-close').disabled = true; $('#manage-published-episode-cancel').disabled = true; status.textContent = 'Guardando…';
    try {
      const characters = await characterIdsFromNames($('#manage-episode-characters').value);
      const payload = {
        id: $('#manage-published-episode-id').value,
        episodeNumber: Number($('#manage-episode-number').value),
        title: { es: $('#manage-episode-title-es').value.trim(), en: $('#manage-episode-title-en').value.trim() },
        status: $('#manage-episode-status').value,
        publishedAt: publicationDateTimeIso($('#manage-episode-date').value),
        unpublishAt: publicationDateTimeIso($('#manage-episode-unpublish-date').value),
        metadata: {
          characters: characters.ids, objects: splitEditorialList($('#manage-episode-objects').value),
          themes: splitEditorialList($('#manage-episode-themes').value), colors: splitEditorialList($('#manage-episode-colors').value),
          searchTerms: [...new Set(splitEditorialList($('#manage-episode-search-terms').value).concat(characters.unknown))],
          spokenText: $('#manage-episode-spoken-text').value.trim(), externalLinks: parseExternalLinks($('#manage-episode-external-links').value)
        }
      };
      const response = await fetch('/api/editor/episodes', { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No se pudieron guardar los cambios.');
      $('#manage-published-episode-dialog').close();
      await loadPublishedEpisodes();
      toast(payload.status === 'unpublished' ? `Episodio ${payload.episodeNumber} marcado como no publicado.` : `Cambios guardados para el episodio ${payload.episodeNumber}.`);
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'No se pudieron guardar los cambios.';
      form.dataset.pending = 'false'; button.disabled = false; $('#manage-published-episode-close').disabled = false; $('#manage-published-episode-cancel').disabled = false;
    }
  }

  async function openExportPreview() {
    const button=$('#preview-export');
    button.disabled=true;
    exportPreviewUrls.forEach(url=>URL.revokeObjectURL(url));exportPreviewUrls=[];
    const pages=$('#export-preview-pages');pages.replaceChildren();pages.classList.toggle('export-preview-continuous',$('#export-style').value==='bleed');
    state.format=$('#export-preset').value;state.exportStyle=$('#export-style').value||'classic';
    state.pageHeight=FORMAT[state.format].logicalHeight;autosave();render();
    const formatLabel=$('#export-preset').selectedOptions[0]?.textContent.trim()||FORMAT[state.format].label;
    const styleLabel=$('#export-style').selectedOptions[0]?.textContent.trim()||state.exportStyle;
    $('#export-preview-template').textContent=`Formato: ${formatLabel} · Plantilla: ${styleLabel} · ${state.panels.length} viñetas`;
    try {
      for(let index=0;index<state.panels.length;index++){
        const blob=await renderPanelPng(state.panels[index],index);
        if(!blob)throw new Error('No se pudo generar la imagen de vista previa.');
        const url=URL.createObjectURL(blob);exportPreviewUrls.push(url);
        const card=document.createElement('article');card.className='export-preview-page';
        const label=document.createElement('span');label.textContent=`VIÑETA ${index+1}`;
        const image=document.createElement('img');image.src=url;image.alt=`Vista previa final de la viñeta ${index+1}, con la plantilla ${styleLabel}`;
        card.append(label,image);pages.append(card);
      }
    $('#publish-episode').hidden = false;
    $('#export-preview-dialog').showModal();
    } catch(error) {toast(error instanceof Error?error.message:'No se pudo preparar la vista previa.');}
    finally {button.disabled=false;}
  }
  function closeExportPreview() { exportPreviewUrls.forEach(url=>URL.revokeObjectURL(url));exportPreviewUrls=[];$('#export-preview-pages').replaceChildren(); }
  function slugify(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function download(blob, filename) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }
  async function removeFlatBackground(src, tolerance, sampledColor = null) {
    const image = await loadImage(src), width = image.naturalWidth, height = image.naturalHeight, total = width * height;
    if (!width || !height || total > 8_000_000) throw new Error('La imagen supera 8 megapíxeles y puede agotar la memoria del iPad o del navegador. Redúcela y vuelve a importarla.');
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Este navegador no pudo abrir el procesador de imágenes.');
    ctx.drawImage(image, 0, 0, width, height);
    const output = ctx.getImageData(0, 0, width, height), pixels = output.data;
    const stride = Math.max(1, Math.floor(Math.max(width, height) / 64)), points = [];
    for (let x = 0; x < width; x += stride) points.push([x, 0], [x, height - 1]);
    for (let y = 0; y < height; y += stride) points.push([0, y], [width - 1, y]);
    if (points.every(([x, y]) => pixels[(y * width + x) * 4 + 3] === 0)) {
      let hasVisiblePixels = false;
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) { hasVisiblePixels = true; break; }
      return { removed: 0, total, alreadyTransparent: hasVisiblePixels, emptyImage: !hasVisiblePixels };
    }
    const samples = points.map(([x, y]) => { const i = (y * width + x) * 4; return { alpha: pixels[i + 3], color: [pixels[i], pixels[i + 1], pixels[i + 2]] }; }).filter(sample => sample.alpha > 128).map(sample => sample.color);
    if (!samples.length && !sampledColor) throw new Error('No encontré color sólido en el borde. Elige el color directamente sobre el dibujo.');
    const distanceBetween = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
    const clusters = samples.map(color => samples.filter(other => distanceBetween(color, other) <= tolerance * 1.4).length);
    const base = sampledColor || samples[clusters.indexOf(Math.max(...clusters))];
    const limit = Math.min(180, tolerance + 36), seen = new Uint8Array(total), queue = new Int32Array(total);
    let head = 0, tail = 0, removed = 0;
    const pixelDistance = i => Math.max(Math.abs(pixels[i] - base[0]), Math.abs(pixels[i + 1] - base[1]), Math.abs(pixels[i + 2] - base[2]));
    const enqueue = index => {
      if (index < 0 || index >= total || seen[index]) return;
      const i = index * 4;
      if (!pixels[i + 3] || pixelDistance(i) > limit) return;
      seen[index] = 1; queue[tail++] = index;
    };
    for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
    for (let y = 1; y < height - 1; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
    while (head < tail) {
      const index = queue[head++], i = index * 4, distance = pixelDistance(i);
      if (distance <= tolerance) { pixels[i + 3] = 0; removed++; }
      else pixels[i + 3] = Math.round(pixels[i + 3] * Math.max(0, Math.min(1, (distance - tolerance) / (limit - tolerance))));
      const x = index % width;
      if (x) enqueue(index - 1); if (x < width - 1) enqueue(index + 1);
      if (index >= width) enqueue(index - width); if (index < total - width) enqueue(index + width);
      if (head % 131072 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (removed < Math.max(4, total * .0002)) return { removed: 0, total };
    ctx.putImageData(output, 0, 0);
    return { src: canvas.toDataURL('image/png'), removed, total, background: base };
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
    if (project.contentType !== undefined && !['episode', 'copy', 'banner', 'section','design','mockup'].includes(project.contentType)) throw new Error('El archivo tiene un tipo de contenido no compatible.');
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
    const labeledIcon = (selector, iconName, label) => { const button = $(selector); if(!button)return; button.classList.add('has-icon'); button.innerHTML = `${svgIcon(iconName)}<span class="button-label">${label}</span>`; if(label){button.title ||= label;button.setAttribute('aria-label',label);} };
    $('#undo').innerHTML = svgIcon('undo'); $('#redo').innerHTML = svgIcon('redo');
    labeledIcon('#back-home','arrowLeft','Mis borradores'); labeledIcon('#download-source','fileDown','Archivo editable'); labeledIcon('#export-project','download','Exportar revisión');
    labeledIcon('#new-project','plus','Nuevo contenido'); labeledIcon('#import-project','upload','Importar archivo .mandarinita'); labeledIcon('#install-app','download','Instalar taller');
    labeledIcon('#confirm-delete','trash','Borrar episodio'); labeledIcon('#delete-project-dialog [value="cancel"]','close','Cancelar');
    labeledIcon('#conflict-download-local','fileDown','Descargar mi copia editable'); labeledIcon('#conflict-use-cloud','cloudDownload','Usar la nube y reemplazar mi copia local'); labeledIcon('#conflict-overwrite-cloud','cloudUpload','Reemplazar la nube con mi copia local'); labeledIcon('#conflict-later','close','Resolver más tarde');
    labeledIcon('#upload-asset','upload',''); labeledIcon('#close-library','close',''); labeledIcon('#close-inspector','close',''); labeledIcon('#focus-mode','maximize','Viñeta única');
    labeledIcon('#mobile-library','panelLeft','Componentes'); labeledIcon('#mobile-properties','sliders','Propiedades');
    $('#tab-components').innerHTML=`${svgIcon('box')}<span>Componentes</span>`;
    $('#tab-layers').innerHTML=`${svgIcon('layers')}<span>Capas</span> <span id="layer-count-tab">0</span>`;
    labeledIcon('#add-panel','panelPlus','Viñeta'); labeledIcon('#add-text','text','Texto'); labeledIcon('#text-style','sparkles','Estilos');labeledIcon('#change-mockup','refresh','Cambiar producto');labeledIcon('#mockup-preview','eyeOff','Ocultar simulación');labeledIcon('#export-vector','fileDown','Arte vectorial SVG');labeledIcon('#add-bubble','bubble','Añadir globo');labeledIcon('#preview-export','eye','Vista previa final');labeledIcon('#export-preview-download','download','Exportar esta revisión');labeledIcon('#publish-episode','cloudUpload','Publicar episodio en la web');
    const filterIcons={all:'grid',character:'users',object:'box',background:'image',sticker:'layers',reference:'book'};
    $$('.filters [data-filter]').forEach(button=>{const label=button.textContent.trim();button.classList.add('has-icon');button.innerHTML=`${svgIcon(filterIcons[button.dataset.filter]||'grid')}<span class="button-label">${label}</span>`;button.setAttribute('aria-label',label);button.title=label;});
    const orderToggle = $('#toggle-order-strip');
    if (window.matchMedia('(max-width: 720px)').matches) {
      $('.story-strip').classList.add('collapsed'); orderToggle.setAttribute('aria-expanded', 'false');
      orderToggle.innerHTML = `${svgIcon('up')}<span>Mostrar viñetas</span>`;
    } else orderToggle.innerHTML = `${svgIcon('down')}<span>Ocultar viñetas</span>`;
    labeledIcon('#toggle-draw','pen','Dibujar'); labeledIcon('#toggle-grid','grid','Guías'); labeledIcon('#add-cta-panel','message','Añadir cierre');
    $('#zoom-out').innerHTML = svgIcon('zoomOut'); $('#zoom-in').innerHTML = svgIcon('zoomIn'); $('#fit').innerHTML = `${svgIcon('fit')}<span>Ajustar</span>`;
    $('#new-project').onclick = newProject;
    $('#show-drafts').onclick = () => showHomeSection('drafts');
    $('#show-published-episodes').onclick = () => showHomeSection('published');
    $('#refresh-published-episodes').onclick = loadPublishedEpisodes;
    $('#published-episode-search').addEventListener('input', renderPublishedEpisodes);
    $('#published-episode-status-filter').addEventListener('change', renderPublishedEpisodes);
    $('#manage-published-episode-form').addEventListener('submit', saveManagedEpisode);
    $('#manage-published-episode-close').onclick = () => $('#manage-published-episode-dialog').close();
    $('#manage-published-episode-cancel').onclick = () => $('#manage-published-episode-dialog').close();
    $('#manage-published-episode-dialog').addEventListener('cancel', event => { if ($('#manage-published-episode-form').dataset.pending === 'true') event.preventDefault(); });
    $('#version-history-refresh').onclick = refreshVersionHistory;
    $('#version-history-close').onclick = () => $('#version-history-dialog').close();
    $('#version-history-dialog').addEventListener('close', () => { historyProjectId = null; historyEtag = ''; });
    $$('.content-type-card').forEach(button=>button.onclick=()=>{$('#new-content-dialog').close();createContentDraft(button.dataset.contentType);});
    $$('.design-template-card').forEach(button=>button.onclick=()=>{$('#design-template-dialog').close();if(changingMockup)changeProductMockup(button.dataset.designTemplate);else createDesignProject(button.dataset.designTemplate);changingMockup=false;});
    $$('.text-style-card').forEach(button=>button.onclick=()=>{$('#text-style-dialog').close();addTextBlock('Escribe aquí…',button.dataset.textStyle);});
    $('#text-style').onclick=()=>$('#text-style-dialog').showModal();
    $('#change-mockup').onclick=()=>{changingMockup=true;pendingDesignType='mockup';$$('.product-template-choice').forEach(button=>button.hidden=false);$$('.design-template-card:not(.product-template-choice)').forEach(button=>button.hidden=true);$('#design-template-dialog').showModal();};
    $('#mockup-preview').onclick=()=>{state.mockupPreview=state.mockupPreview===false;render();autosave();};
    $('#export-vector').onclick=()=>exportPanelSvg();
    $$('#template-dialog .template-card').forEach(button => button.onclick = () => { $('#template-dialog').close(); createProjectFromTemplate(button.dataset.template); });
    $('#import-project').onclick = () => $('#project-file').click();
    $('#project-file').onchange = event => importProjectFile(event.target.files[0]);
    $('#back-home').onclick = showHome;
    $('#download-source').onclick = exportSource;
    $('#export-project').onclick = exportReview;
    $('#preview-export').onclick = openExportPreview;
    $('#export-preview-close').onclick = () => $('#export-preview-dialog').close();
    $('#export-preview-download').onclick = () => { $('#export-preview-dialog').close(); exportReview(); };
    $('#publish-episode').onclick = openPublishEpisodeDialog;
    $('#publish-episode-close').onclick = () => $('#publish-episode-dialog').close();
    $('#publish-episode-cancel').onclick = () => $('#publish-episode-dialog').close();
    $('#publish-episode-form').addEventListener('submit', submitEpisodePublication);
    $('#publish-episode-form').addEventListener('input', refreshPublishReadiness);
    $('#publish-episode-form').addEventListener('change', refreshPublishReadiness);
    $('#publish-episode-date').addEventListener('change',()=>updateRetirementDateMinimum('#publish-episode-date','#publish-episode-unpublish-date'));
    $('#publish-episode-dialog').addEventListener('close', clearPublishReviewPreview);
    $('#publish-episode-dialog').addEventListener('cancel', event => { if ($('#publish-episode-form').dataset.pending === 'true') event.preventDefault(); });
    $('#manage-episode-date').addEventListener('change',()=>updateRetirementDateMinimum('#manage-episode-date','#manage-episode-unpublish-date'));
    $('#export-preview-dialog').addEventListener('close',closeExportPreview);
    $('#project-title').addEventListener('input', event => { state.title = event.currentTarget.textContent; autosave(); });
    $('#add-panel').onclick = addPanel;
    $('#add-cta-panel').onclick = addClosingPanel;
    $('#toggle-order-strip').onclick = event => {
      const strip = event.currentTarget.closest('.story-strip');
      const collapsed = strip.classList.toggle('collapsed');
      event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
      event.currentTarget.innerHTML = `${svgIcon(collapsed ? 'up' : 'down')}<span>${collapsed ? 'Mostrar viñetas' : 'Ocultar viñetas'}</span>`;
    };
    $('#add-text').onclick = () => addTextBlock();
    $('#add-bubble').onclick = () => addBubble($('#bubble-kind').value);
    $('#export-preset').onchange = event => changeFormat(event.target.value);
    $('#export-style').onchange = () => { state.exportStyle=$('#export-style').value; autosave(); toast(state.exportStyle==='bleed'?'Arte a borde completo: sin marco ni firma para continuidad entre viñetas.':'Plantilla actualizada; mira la vista previa final antes de exportar.'); };
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
    const setLeftTab = tab => {
      const components = tab === 'components';
      $('#tab-components').setAttribute('aria-selected',String(components));
      $('#tab-layers').setAttribute('aria-selected',String(!components));
      $('#components-panel').hidden = !components;
      $('#layers-panel').hidden = components;
      if (!$('#reference-note').hidden) $('#library-title').textContent = components ? 'Referencias' : 'Capas';
      else $('#library-title').textContent = components ? 'Componentes' : 'Capas';
    };
    $('#tab-components').onclick = () => setLeftTab('components');
    $('#tab-layers').onclick = () => setLeftTab('layers');
    [$('#tab-components'),$('#tab-layers')].forEach((tab,index,tabs) => tab.onkeydown = event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].focus(); tabs[next].click();
    });
    const setLibraryOpen = open => {
      const mobile=matchMedia('(max-width:640px)').matches,shell=$('#app-shell');
      if(mobile&&open){$('#inspector-panel').classList.remove('open');$('#mobile-properties').setAttribute('aria-expanded','false');}
      $('#library-panel').classList.toggle('open',open);
      if(!mobile)shell.classList.toggle('library-collapsed',!open);else shell.classList.remove('library-collapsed');
      $('#mobile-library').setAttribute('aria-expanded',String(open));
      (open?$('#close-library'):$('#mobile-library')).focus({preventScroll:true});
    };
    $('#mobile-library').onclick = () => {const mobile=matchMedia('(max-width:640px)').matches;setLibraryOpen(mobile?!$('#library-panel').classList.contains('open'):$('#app-shell').classList.contains('library-collapsed'));};
    $('#close-library').onclick = () => setLibraryOpen(false);
    const mobileLibraryBreakpoint = matchMedia('(max-width:640px)');
    const resetLibraryDrawerOnResize = event => {
      if (event.matches || !$('#library-panel').classList.contains('open')) return;
      $('#library-panel').classList.remove('open','dragging-from-library');
      $('#mobile-library').setAttribute('aria-expanded','false');
      $('#tab-components').focus({ preventScroll:true });
    };
    if (mobileLibraryBreakpoint.addEventListener) mobileLibraryBreakpoint.addEventListener('change', resetLibraryDrawerOnResize);
    else mobileLibraryBreakpoint.addListener(resetLibraryDrawerOnResize);
    const setInspectorOpen=open=>{
      const drawer=matchMedia('(max-width:1100px)').matches,shell=$('#app-shell');
      if(drawer&&open){$('#library-panel').classList.remove('open');$('#mobile-library').setAttribute('aria-expanded','false');shell.classList.remove('library-collapsed');}
      $('#inspector-panel').classList.toggle('open',open);
      if(!drawer)shell.classList.toggle('inspector-collapsed',!open);else shell.classList.remove('inspector-collapsed');
      $('#mobile-properties').setAttribute('aria-expanded',String(open));
      (open?$('#close-inspector'):$('#mobile-properties')).focus({preventScroll:true});
    };
    $('#mobile-properties').onclick = () => {const drawer=matchMedia('(max-width:1100px)').matches;setInspectorOpen(drawer?!$('#inspector-panel').classList.contains('open'):$('#app-shell').classList.contains('inspector-collapsed'));};
    $('#close-inspector').onclick = () => setInspectorOpen(false);
    $('#focus-mode').onclick = event => {
      const active=$('#app-shell').classList.toggle('single-panel-mode');
      $('#app-shell').classList.toggle('focus-mode',active);
      event.currentTarget.setAttribute('aria-pressed',String(active));
      const label=active?'Volver a la tira':'Viñeta única';
      event.currentTarget.innerHTML=`${svgIcon(active?'minimize':'maximize')}<span class="button-label">${label}</span>`;
      event.currentTarget.title=active?'Volver a ver todas las viñetas':'Ver viñeta única a pantalla completa';
      event.currentTarget.setAttribute('aria-label',event.currentTarget.title);
      render();
      if(!active)requestAnimationFrame(()=>activeCanvas()?.closest('.artboard-wrap')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}));
    };
    $('#theme-toggle').onclick = () => {
      const choices = ['system','dark','light']; const current = getThemeChoice(); const next = choices[(choices.indexOf(current) + 1) % choices.length];
      localStorage.setItem('mandarinita-editor-theme', next); applyTheme(next);
    };
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
      if(state?.selected&&/^Arrow(Left|Right|Up|Down)$/.test(event.key)&&!['TEXTAREA','INPUT','SELECT'].includes(document.activeElement.tagName)&&!document.activeElement.isContentEditable){
        const item=currentItem();if(item&&!item.locked){event.preventDefault();if(!event.repeat)snapshot();const step=event.shiftKey?10:1;item.x+=event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0;item.y+=event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0;const element=activeCanvas()?.querySelector(`[data-id="${item.id}"]`);if(element){element.style.left=`${item.x}px`;element.style.top=`${item.y}px`;element.syncContinuations?.(false);element.classList.toggle('offstage',isFullyOffstage(item));}renderOffstage();autosave();}
      }
      if (event.key === 'Delete' && state?.selected && !['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) $('#delete')?.click();
      if (event.key === 'Escape') {
        if ($('#library-panel').classList.contains('open') || !$('#app-shell').classList.contains('library-collapsed')) setLibraryOpen(false);
        else $('#library-panel').classList.remove('dragging-from-library');
        if ($('#inspector-panel').classList.contains('open') || !$('#app-shell').classList.contains('inspector-collapsed')) setInspectorOpen(false);
      }
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
    const themeButton = $('#theme-toggle');
    themeButton.innerHTML = svgIcon(choice === 'system' ? 'monitor' : choice === 'dark' ? 'moon' : 'sun');
    themeButton.title = `Tema: ${label} · cambiar`;
    themeButton.setAttribute('aria-label', `Tema ${label}. Cambiar tema`);
  }
  migrateLegacyProject();
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (getThemeChoice() === 'system') applyTheme('system'); });
  installEvents(); setupResourceFilters(); installPalette(); loadCloudBases(); const migratedIds=migrateInvalidLocalProjectIds(); renderProjectList(); setupCloudSync();
  if(migratedIds)toast('Se corrigió el identificador de un borrador antiguo. Su contenido quedó guardado en este dispositivo.');
  if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('/editor-service-worker.js', { scope:'/' }).catch(() => {});
})();
