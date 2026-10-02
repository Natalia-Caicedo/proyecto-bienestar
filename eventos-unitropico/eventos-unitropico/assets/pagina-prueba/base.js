const EV = [];
const IMG = {};
const P = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  back: '<path d="m15 18-6-6 6-6M20 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  sport: '<path d="M12 3v18M3 12h18"/>',
  culture: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-4h4v4"/>',
  academic: '<path d="m2 10 10-5 10 5-10 5zM6 12v5c4 3 8 3 12 0v-5M22 10v6"/>',
  wellbeing: '<path d="M20.8 8.6c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z"/>',
  community: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6"/>'
};
const CATI = {
  Deporte: 'sport',
  Cultura: 'culture',
  Académico: 'academic',
  Bienestar: 'wellbeing',
  Comunidad: 'community'
};
const LOGO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 54"><rect width="54" height="54" rx="8" fill="#0f6b4b"/><path d="M13 39V15h7l7 12 7-12h7v24h-7V27l-7 11-7-11v12z" fill="white"/><text x="64" y="25" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#0f6b4b">UNITRÓPICO</text><text x="64" y="42" font-family="Arial,sans-serif" font-size="9" fill="#5b7469">Eventos universitarios</text></svg>');
const STATE_KEY = 'utp_state_v1';
let S = { adm: false, view: 'home', prev: 'home', tab: 'ev', fe: null, eid: 0, eventId: 0, enr: {}, sav: {}, cal: {}, seen: false, query: '', category: '', filtersOpen: false };
try {
  const saved = JSON.parse(localStorage.getItem(STATE_KEY));
  if (saved && typeof saved === 'object') S = { ...S, ...saved, adm: false };
} catch (error) {}

function ic(name) {
  return `<svg class="i" aria-hidden="true" viewBox="0 0 24 24">${P[name] || ''}</svg>`;
}
function ev(id) {
  return EV.find(event => event.id === Number(id));
}
function save() {
  try {
    const { adm, ...publicState } = S;
    localStorage.setItem(STATE_KEY, JSON.stringify(publicState));
  } catch (error) {}
}
function toast(message) {
  document.querySelectorAll('.toast').forEach(node => node.remove());
  const node = document.createElement('div');
  node.className = 'toast';
  node.setAttribute('role', 'status');
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}
function go(view) {
  S.view = view;
  if (view !== 'detail') S.prev = view;
  save();
  render();
  window.scrollTo(0, 0);
}
function toggleTheme() {
  const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const dark = current !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  try { localStorage.setItem('utp_theme_v1', dark ? 'dark' : 'light'); } catch (error) {}
}
try {
  const theme = localStorage.getItem('utp_theme_v1');
  if (theme) document.documentElement.dataset.theme = theme;
} catch (error) {}

function safe(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function eventImage(event, className) {
  const source = event.url || IMG[event.img];
  return source
    ? `<div class="${className}"><img src="${safe(source)}" alt="Imagen de ${safe(event.t)}"><span class="tag">${safe(event.c)}</span></div>`
    : `<div class="${className}">${ic(CATI[event.c] || 'cal')}<span class="tag">${safe(event.c || 'Evento')}</span></div>`;
}
function eventCard(event) {
  const full = Number(event.cu) <= 0;
  return `<article class="card">
    <button class="ib" style="align-self:flex-end" onclick="toggleSaved(${event.id})" aria-label="${S.sav[event.id] ? 'Quitar de' : 'Guardar en'} mis eventos">${ic('bookmark')}</button>
    <button class="event-open" onclick="openEvent(${event.id})" aria-label="Ver ${safe(event.t)}">
      ${eventImage(event, 'im')}
      <p class="t">${safe(event.t)}</p>
      <div class="m">${ic('cal')}${safe(event.d || 'Fecha por confirmar')}</div>
      <div class="m">${ic('pin')}${safe(event.l || event.s || 'Lugar por confirmar')}</div>
      <span class="st${event.st === 'En curso' ? ' live' : full ? ' full' : ''}">${full ? 'Sin cupos' : safe(event.st || 'Próximo')}</span>
    </button>
    <button class="btn" onclick="openEvent(${event.id})">Ver evento</button>
  </article>`;
}
function openEvent(id) {
  S.eventId = Number(id);
  go('detail');
}
function listEvents(events) {
  return events.length
    ? `<div class="grid">${events.map(eventCard).join('')}</div>`
    : '<div class="empty">No hay eventos para mostrar todavía.</div>';
}
function home() {
  const upcoming = EV.filter(event => event.st !== 'Finalizado').slice(0, 4);
  return `<h1>Eventos <span>Unitrópico</span></h1>
    <p class="sub">Encuentra actividades, comparte y participa en la vida universitaria.</p>
    <form class="search" onsubmit="submitSearch(event,this.query.value)">
      ${ic('search')}<input name="query" type="search" placeholder="Buscar eventos" value="${safe(S.query)}" aria-label="Buscar eventos">
      <button class="btn" style="width:auto;margin:0;padding:10px 14px">Buscar</button>
    </form>
    <section style="margin-top:24px"><div class="sec"><h2>Próximos eventos</h2><button class="link" onclick="go('cat')">Explorar ${ic('right')}</button></div>${listEvents(upcoming)}</section>`;
}
function submitSearch(event, query) {
  event.preventDefault();
  S.query = String(query || '').trim();
  go('cat');
}
function cat() {
  const query = S.query.toLocaleLowerCase('es');
  const events = EV.filter(event => {
    const matchesQuery = !query || `${event.t} ${event.c} ${event.desc} ${event.l}`.toLocaleLowerCase('es').includes(query);
    return matchesQuery && (!S.category || event.c === S.category);
  });
  const categories = Object.keys(CATI).map(category => `<option value="${safe(category)}"${S.category === category ? ' selected' : ''}>${safe(category)}</option>`).join('');
  return `<h1>Explorar</h1><p class="sub">Busca actividades por nombre o categoría.</p>
    <div class="cat"><aside class="side${S.filtersOpen ? '' : ' hid'}"><h3>${ic('search')}Filtros</h3>
      <label for="event-category">Categoría</label><select id="event-category" onchange="S.category=this.value;render()"><option value="">Todas</option>${categories}</select>
      <button class="btn o" style="margin-top:12px" onclick="S.category='';S.query='';render()">Limpiar filtros</button>
    </aside><div><form class="search" onsubmit="submitSearch(event,this.query.value)"><input name="query" type="search" placeholder="Buscar eventos" value="${safe(S.query)}" aria-label="Buscar eventos"><button class="btn" style="width:auto;margin:0;padding:10px 14px">Buscar</button></form>
      <div class="sec" style="margin-top:18px"><h2>Resultados</h2><button class="link fbtn" onclick="S.filtersOpen=!S.filtersOpen;render()">Filtros</button></div>${listEvents(events)}</div></div>`;
}
function detail() {
  const event = ev(S.eventId);
  if (!event) return '<div class="empty">El evento ya no está disponible.</div>';
  const enrolled = Boolean(S.enr[event.id]);
  const onCalendar = Boolean(S.cal[event.id]);
  return `<div class="det"><div class="dh"><button class="ib" onclick="go('${safe(S.prev || 'cat')}')" aria-label="Volver">${ic('back')}</button><b>Detalle del evento</b><button class="ib" onclick="toggleSaved(${event.id})" aria-label="Guardar evento">${ic('bookmark')}</button></div>
    <div class="hero">${event.url || IMG[event.img] ? `<img src="${safe(event.url || IMG[event.img])}" alt="Imagen de ${safe(event.t)}">` : ic(CATI[event.c] || 'cal')}<span class="tag">${safe(event.c)}</span></div>
    <h1 style="margin-top:16px">${safe(event.t)}</h1><p class="sub">${safe(event.desc || '')}</p>
    <div class="kv">${ic('cal')}<div><small>Fecha y horario</small><b>${safe(event.d)} · ${safe(event.h)}</b></div></div>
    <div class="kv">${ic('pin')}<div><small>Lugar</small><b>${safe(event.l)} · ${safe(event.s)}</b></div></div>
    <div class="kv">${ic('users')}<div><small>Cupos disponibles</small><b>${safe(event.cu)} de ${safe(event.tot)}</b></div></div>
    ${event.req?.length ? `<section class="info"><h3>Requisitos</h3><ul>${event.req.map(item => `<li>${safe(item)}</li>`).join('')}</ul></section>` : ''}
    <div class="two"><button class="btn o${onCalendar ? ' on' : ''}" onclick="toggleCalendar(${event.id})">${ic(onCalendar ? 'check' : 'cal')}${onCalendar ? 'Agregado' : 'Agregar a mis eventos'}</button>
    <button class="btn" onclick="${enrolled ? `unenroll(${event.id})` : `enroll(${event.id})`}"${Number(event.cu) <= 0 && !enrolled ? ' disabled' : ''}>${enrolled ? 'Cancelar inscripción' : 'Inscribirme'}</button></div>
    ${enrolled ? '<div class="ok"><span class="c">' + ic('check') + '</span><div><b>Inscripción confirmada</b><span>Te esperamos en el evento.</span></div></div>' : ''}</div>`;
}
function toggleSaved(id) {
  S.sav[id] = !S.sav[id];
  save();
  render();
}
function toggleCalendar(id) {
  S.cal[id] = !S.cal[id];
  save();
  render();
}
function mine() {
  const enrolled = EV.filter(event => S.enr[event.id]);
  const saved = EV.filter(event => S.sav[event.id] && !S.enr[event.id]);
  const calendar = EV.filter(event => S.cal[event.id] && !S.enr[event.id] && !S.sav[event.id]);
  return `<h1>Mis eventos</h1><p class="sub">Tus inscripciones y actividades guardadas.</p>
    <section><div class="sec"><h2>Inscripciones</h2></div>${listEvents(enrolled)}</section>
    <section style="margin-top:24px"><div class="sec"><h2>Guardados y agenda</h2></div>${listEvents([...saved, ...calendar])}</section>`;
}
function notif() {
  return `<h1>Notificaciones</h1><p class="sub">Novedades de la agenda universitaria.</p>
    <div class="list"><div class="nt">${ic('bell')}<div><b>Bienvenido a Eventos Unitrópico</b><p>Consulta las actividades disponibles y mantente al tanto de la programación.</p></div></div></div>`;
}
