/* MOTOR — no tocar. */
const ICONS = {
  spotify:'<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.75.75 0 01-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 11-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.35.22.46.68.25 1.03zm1.23-2.75a.94.94 0 01-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 11-.54-1.8c4.37-1.32 9.79-.68 13.5 1.6.44.27.58.85.3 1.29zm.1-2.86C14.06 8.5 7.7 8.29 4.4 9.3a1.12 1.12 0 11-.65-2.15c3.79-1.15 10.82-.93 15.09 1.6a1.12 1.12 0 11-1.14 1.94z" fill="currentColor"/>',
  youtube:'<path d="M23 12s0-3.5-.45-5.17a2.6 2.6 0 00-1.83-1.84C19.05 4.54 12 4.54 12 4.54s-7.05 0-8.72.45c-.87.24-1.58.95-1.83 1.84C1 8.5 1 12 1 12s0 3.5.45 5.17c.25.89.96 1.6 1.83 1.84 1.67.45 8.72.45 8.72.45s7.05 0 8.72-.45a2.6 2.6 0 001.83-1.84C23 15.5 23 12 23 12zM9.75 15.2V8.8L15.5 12l-5.75 3.2z" fill="currentColor"/>',
  tiktok:'<path d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 110-5.18c.27 0 .53.04.77.12v-3.2a5.87 5.87 0 00-.77-.05A5.73 5.73 0 004.13 15.3 5.73 5.73 0 009.86 21a5.73 5.73 0 005.73-5.73V9.01a7.35 7.35 0 004.28 1.38V7.3a4.29 4.29 0 01-3.27-1.48z" fill="currentColor"/>',
  instagram:'<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.68a4.16 4.16 0 100 8.32 4.16 4.16 0 000-8.32zm0 6.86a2.7 2.7 0 110-5.4 2.7 2.7 0 010 5.4zm5.3-7.02a.97.97 0 11-1.94 0 .97.97 0 011.94 0z" fill="currentColor"/>',
  bag:'<path d="M6 7V6a6 6 0 1112 0v1h2.5a1 1 0 011 1.1l-1.2 12A2 2 0 0118.3 22H5.7a2 2 0 01-2-1.9l-1.2-12A1 1 0 013.5 7H6zm2 0h8V6a4 4 0 10-8 0v1z" fill="currentColor"/>'
};

const $ = id => document.getElementById(id);

/* Cabecera */
$('wordmark').textContent = CONFIG.nombre;
$('tagline').textContent  = CONFIG.tagline;
$('footer').textContent   = CONFIG.footer;
$('avatar').alt = CONFIG.nombre;
if (CONFIG.foto) $('avatar').src = CONFIG.foto;

/* Marquesina */
if (CONFIG.marquee && CONFIG.marquee.activo && CONFIG.marquee.texto) {
  const track = $('marqueeTrack');
  const item = `<span class="marquee-item">${CONFIG.marquee.texto}</span>`;
  const set = item.repeat(6);
  track.innerHTML = set + set; // duplicado para el loop sin cortes (translateX -50%)
  track.style.animationDuration = (CONFIG.marquee.velocidad || 22) + 's';
  $('marquee').hidden = false;
}

/* Oyentes (Spotify) — opcional, requiere backend propio. Ver CLAUDE.md. */
if (CONFIG.oyentes && CONFIG.oyentes.activo && CONFIG.oyentes.endpoint) {
  fetch(CONFIG.oyentes.endpoint)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if (!data || typeof data.followers !== 'number') return;
      const n = new Intl.NumberFormat('es-AR').format(data.followers);
      $('oyentes').innerHTML = `<span class="dot"></span><b>${n}</b>&nbsp;seguidores en Spotify`;
      $('oyentes').hidden = false;
    })
    .catch(() => { /* si falla, no se muestra nada — no rompe la página */ });
}

/* Links */
$('links').innerHTML = CONFIG.links.map((l,i) => {
  const cls = ['link', l.destacado && 'primary', l.proximamente && 'soon'].filter(Boolean).join(' ');
  const right = l.proximamente ? 'Pronto' : '→';
  return `<a class="${cls}" href="${l.url}" target="_blank" rel="noopener"
             style="animation-delay:${120 + i*70}ms">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[l.icono]||''}</svg>
            <span class="txt">${l.titulo}</span>
            <span class="arrow">${right}</span>
          </a>`;
}).join('');

/* Countdown */
const L = CONFIG.lanzamiento;
if (L.activo) {
  const drop = $('drop');
  const target = new Date(L.fecha);
  drop.hidden = false;
  $('dropTitle').textContent = L.titulo;
  $('dropDate').textContent = target.toLocaleDateString('es-AR',
    { day:'numeric', month:'long', timeZone:'America/Argentina/Buenos_Aires' });

  const pad = n => String(n).padStart(2,'0');

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) { salio(); return; }
    const sec = Math.floor(diff/1000);
    $('d').textContent = pad(Math.floor(sec/86400));
    $('h').textContent = pad(Math.floor(sec/3600)%24);
    $('m').textContent = pad(Math.floor(sec/60)%60);
    $('s').textContent = pad(sec%60);
    $('dropEyebrow').textContent = L.preLabel;
  };

  const salio = () => {
    clearInterval(timer);
    drop.classList.add('live');
    $('dropEyebrow').textContent = L.postLabel;
    $('dropDate').textContent = '';
    $('clock').outerHTML =
      `<a class="link primary" href="${L.linkEscuchar}" target="_blank" rel="noopener" style="opacity:1;transform:none">
         <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS.spotify}</svg>
         <span class="txt">Escuchar ahora</span><span class="arrow">→</span>
       </a>`;
  };

  tick();
  const timer = setInterval(tick, 1000);
}
