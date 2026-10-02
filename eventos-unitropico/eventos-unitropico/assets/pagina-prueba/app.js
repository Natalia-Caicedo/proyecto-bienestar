const KE='utp_events_v1',KR='utp_regs_v1',PIN='1234'; // cambia el PIN
let REG = [], S = { adm: false, tab: 'ev', fe: null, eid: 0 };
try{
 const e=JSON.parse(localStorage.getItem(KE));if(Array.isArray(e))EV.splice(0,EV.length,...e);
 REG=JSON.parse(localStorage.getItem(KR))||[];
}catch(x){}
EV.forEach(e=>{if(e.url)IMG['e'+e.id]=e.url});
Object.assign(P,{
 moon:'<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 down:'<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>'});
document.head.insertAdjacentHTML('beforeend',`<style>
.mdl{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:20;display:grid;place-items:center;padding:16px;overflow:auto}
.box{background:var(--card);color:var(--tx);border-radius:18px;padding:20px;width:100%;max-width:440px}
.fm label{display:block;font-weight:700;color:var(--g2);margin:12px 0 4px}
.fm input:not([type=checkbox]),.fm select,.fm textarea,.fsel{width:100%;background:var(--card);border:1.5px solid var(--bd);border-radius:12px;padding:11px 12px;font:inherit;color:inherit}
.fm .ck{display:flex;gap:10px;align-items:flex-start;font-weight:500;color:var(--tx)}
.fm .ck input{width:20px;height:20px;margin-top:2px;flex:none}
</style>`);

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cl=s=>String(s??'').replace(/[<>]/g,'').trim();
const saveE=()=>{try{localStorage.setItem(KE,JSON.stringify(EV));localStorage.setItem(KR,JSON.stringify(REG))}catch(x){}};
function modal(h){closeM();const m=document.createElement('div');m.className='mdl';m.innerHTML=`<div class="box" role="dialog" aria-modal="true">${h}</div>`;m.onclick=e=>{if(e.target===m)closeM()};document.body.appendChild(m);const i=m.querySelector('input,select');if(i)i.focus()}
function closeM(){document.querySelectorAll('.mdl').forEach(x=>x.remove())}

/* ---------- Inscripción con formulario ---------- */
const fld=(n,l,t)=>`<label>${l}<input name="${n}" type="${t}" required autocomplete="off"></label>`;
function enroll(id){
 const e=ev(id);
 modal(`<h2>Inscripción</h2><p class="sub" style="margin:4px 0 0">${e.t}</p>
 <form class="fm" onsubmit="sendReg(event,${id})">
 ${fld('n','Nombre completo','text')}${fld('d','Documento de identidad','text')}${fld('c','Correo electrónico','email')}${fld('t','Teléfono','tel')}
 <label>Vinculación<select name="v"><option>Estudiante</option><option>Docente</option><option>Administrativo</option></select></label>
 ${fld('p','Programa o dependencia','text')}
 <label class="ck"><input type="checkbox" required>Autorizo el uso de mis datos para gestionar esta inscripción.</label>
 <button class="btn">Confirmar inscripción</button>
 <button type="button" class="btn o" style="margin-top:8px" onclick="closeM()">Cancelar</button></form>`)}
function sendReg(x,id){
 x.preventDefault();const e=ev(id),f=new FormData(x.target),doc=cl(f.get('d'));
 if(Number(e.cu)<=0){toast('No quedan cupos disponibles');return}
 if(REG.some(r=>r.id===id&&r.d===doc)){toast('Ese documento ya está inscrito en este evento');return}
 REG.push({id,n:cl(f.get('n')),d:doc,c:cl(f.get('c')),t:cl(f.get('t')),v:f.get('v'),p:cl(f.get('p')),f:new Date().toLocaleString('es-CO')});
 e.cu=Number(e.cu)-1;S.enr[id]=doc;save();saveE();closeM();render();toast('¡Inscripción confirmada!')}
function unenroll(id){const e=ev(id),n=REG.length;REG=REG.filter(r=>!(r.id===id&&r.d===S.enr[id]));if(e&&REG.length<n)e.cu=Math.min(Number(e.cu)+1,Number(e.tot));delete S.enr[id];save();saveE();render();toast('Inscripción cancelada')}

/* ---------- Acceso administrativo ---------- */
function adminBtn(){
 if(S.adm){go('admin');return}
 modal(`<h2>Acceso administrativo</h2><form class="fm" onsubmit="login(event)"><label>PIN<input name="p" type="password" inputmode="numeric" required></label><button class="btn">Ingresar</button></form>`)}
function login(x){x.preventDefault();if(new FormData(x.target).get('p')===PIN){S.adm=true;closeM();go('admin')}else toast('PIN incorrecto')}

/* ---------- Panel: eventos e inscritos ---------- */
function admin(){
 const c=(k,i,l)=>`<button class="chip${S.tab===k?' on':''}" onclick="S.tab='${k}';render()">${ic(i)}${l}</button>`;
 return `<h1>Administración</h1><p class="sub">Publica, corrige o elimina eventos y consulta los inscritos.</p>
 <div class="chips">${c('ev','cal','Eventos')}${c('rg','users','Inscritos ('+REG.length+')')}<button class="chip" onclick="S.adm=false;go('home')">${ic('lock')}Salir</button></div>
 ${S.tab==='ev'?adEv():adRg()}`}
function adEv(){
 return `<button class="btn" style="margin:0 0 14px" onclick="editEv(0)">${ic('plus')}Publicar nuevo evento</button>
 <div class="list">${EV.map(e=>`<div class="row"><div class="bd"><span class="tag">${e.c}</span><p class="t">${e.t}</p><div class="m">${ic('cal')}${e.d} · ${e.st}</div><div class="m">${ic('users')}${REG.filter(r=>r.id===e.id).length} inscritos · cupos ${e.cu}/${e.tot}</div></div>
 <button class="ib" onclick="editEv(${e.id})" aria-label="Editar ${e.t}">${ic('pencil')}</button>
 <button class="ib" style="color:#d9534f" onclick="delEv(${e.id})" aria-label="Eliminar ${e.t}">${ic('trash')}</button></div>`).join('')||'<div class="empty">No hay eventos. Publica el primero.</div>'}</div>`}
function adRg(){
 const L=REG.filter(r=>!S.fe||r.id===S.fe);
 return `<div class="two" style="grid-template-columns:1fr auto;margin:0 0 12px"><select class="fsel" onchange="S.fe=+this.value||null;render()" aria-label="Filtrar por evento"><option value="">Todos los eventos</option>${EV.map(e=>`<option value="${e.id}"${S.fe===e.id?' selected':''}>${e.t}</option>`).join('')}</select><button class="btn o" onclick="csv()">${ic('down')}CSV</button></div>
 <div class="list">${L.map(r=>`<div class="nt">${ic('users')}<div><b>${esc(r.n)}</b><p>${esc(r.v)} · ${esc(r.p)}<br>Doc: ${esc(r.d)} · Tel: ${esc(r.t)}<br>${esc(r.c)}<br>${esc((ev(r.id)||{t:'(evento eliminado)'}).t)} · ${esc(r.f)}</p></div></div>`).join('')||'<div class="empty">Aún no hay inscritos.</div>'}</div>`}
function csv(){
 const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const L=REG.filter(r=>!S.fe||r.id===S.fe);
 const t=['Evento,Nombre,Documento,Correo,Teléfono,Vinculación,Programa,Fecha',...L.map(r=>[(ev(r.id)||{}).t,r.n,r.d,r.c,r.t,r.v,r.p,r.f].map(q).join(','))].join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));a.download='inscritos.csv';a.click()}

/* ---------- Crear / editar / eliminar eventos ---------- */
function editEv(id){S.eid=id;go('evform')}
function evform(){
 const e=ev(S.eid)||{t:'',c:'Deporte',d:'',h:'',l:'',s:'Sede principal',cu:50,tot:50,st:'Próximo',desc:'',req:[],url:''};
 const o=(a,v)=>a.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('');
 const i=(n,l,v,t='text')=>`<label>${l}<input name="${n}" type="${t}" value="${esc(v)}" required></label>`;
 return `<div class="det"><div class="dh"><button class="ib" onclick="go('admin')" aria-label="Volver">${ic('back')}</button><b>${S.eid?'Editar evento':'Nuevo evento'}</b><span style="width:36px"></span></div>
 <form class="fm" onsubmit="saveEv(event)">${i('t','Título',e.t)}
 <label>Categoría<select name="c">${o(Object.keys(CATI),e.c)}</select></label>
 ${i('d','Fecha (ej. 26 abr 2026)',e.d)}${i('h','Horario (ej. 6:00 a.m. – 11:00 a.m.)',e.h)}${i('l','Lugar',e.l)}
 <label>Sede<select name="s">${o(['Sede principal','Sede La Granja'],e.s)}</select></label>
 <label>Estado<select name="st">${o(['Próximo','En curso'],e.st)}</select></label>
 ${i('tot','Cupos totales',e.tot,'number')}${i('cu','Cupos disponibles',e.cu,'number')}
 <label>Descripción<textarea name="desc" rows="4" required>${esc(e.desc)}</textarea></label>
 <label>Requisitos (uno por línea)<textarea name="req" rows="3">${esc(e.req.join('\n'))}</textarea></label>
 <label>URL de la imagen (opcional)<input name="url" type="url" value="${esc(e.url||'')}"></label>
 <button class="btn">${S.eid?'Guardar cambios':'Publicar evento'}</button></form></div>`}
function saveEv(x){
 x.preventDefault();
 const f=Object.fromEntries(new FormData(x.target)),old=ev(S.eid),id=old?old.id:Math.max(0,...EV.map(e=>e.id))+1;
 const n={...old,id,t:cl(f.t),c:f.c,d:cl(f.d),h:cl(f.h),l:cl(f.l),s:f.s,st:f.st,tot:+f.tot,cu:Math.min(+f.cu,+f.tot),desc:cl(f.desc),req:f.req.split('\n').map(cl).filter(Boolean),url:f.url.trim()};
 if(n.url){IMG['e'+id]=n.url;n.img='e'+id}else if(!old||old.url)n.img=null;
 if(old)EV[EV.indexOf(old)]=n;else EV.push(n);
 saveE();go('admin');toast(old?'Cambios guardados':'Evento publicado')}
function delEv(id){
 const e=ev(id);if(!e||!confirm(`¿Eliminar "${e.t}"? También se borrarán sus inscripciones.`))return;
 EV.splice(EV.indexOf(e),1);REG=REG.filter(r=>r.id!==id);
 delete S.enr[id];delete S.sav[id];delete S.cal[id];save();saveE();render();toast('Evento eliminado')}

/* ---------- render: el menú ahora es tema (luna) + acceso admin (candado) ---------- */
function render(){
 if((S.view==='admin'||S.view==='evform')&&!S.adm)S.view='home';
 const v=S.view;if(v!=='detail')S.prev=v;
 const tab=v==='detail'?(S.prev||'cat'):v;
 const body={home,cat,detail,mine,notif,admin,evform}[v]();
 const nav=[['home','home','Inicio'],['cat','search','Explorar'],['mine','cal','Mis eventos'],['notif','bell','Notificaciones']];
 document.getElementById('app').innerHTML=`<header><img src="${LOGO}" alt="Unitrópico, Universidad Internacional del Trópico Americano"><div style="display:flex"><button class="ib" onclick="toggleTheme()" aria-label="Cambiar tema claro u oscuro">${ic('moon')}</button><button class="ib" onclick="adminBtn()" aria-label="Administración">${ic('lock')}</button></div></header>${navigator.onLine?'':'<div class="off">Sin conexión: mostrando contenido guardado</div>'}<main>${body}</main><nav aria-label="Navegación principal"><div>${nav.map(([k,i,l])=>`<button class="${tab===k?'on':''}" onclick="go('${k}')" ${tab===k?'aria-current="page"':''}>${ic(i)}${l}${k==='notif'&&!S.seen?'<span class="dot">3</span>':''}</button>`).join('')}</div></nav>`}
render();