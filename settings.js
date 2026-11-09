/* settings.js — drop-in Settings add-on.
   Usage: add <script src="settings.js" defer></script> before </body>.
   Open https://your-site/#edit once on your device to show the ⚙ الإعدادات button.
   It edits site name/description/icon, every text, show/hide of any section or text, colors and font size.
   Your choices are drafted in this browser; download settings.json and upload it next to index.html to publish. */
(()=>{
const KEY='stx-draft',OWN='stx-owner',FILE='settings.json';
const VARS={ac:['--ac','--accent','--primary'],ac2:['--ac2','--accent2','--secondary'],bg:['--bg','--background'],tx:['--tx','--text','--foreground']};
const VL={ac:'اللون الرئيسي',ac2:'اللون الثانوي',bg:'لون الخلفية',tx:'لون النص'};
const D0=()=>({title:'',desc:'',fav:'',fs:100,vars:{},texts:{},hidden:{},rev:0});
let S=D0(),FR=0,tab='g';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const mine=e=>!!(e&&e.closest&&e.closest('#stx'));
function path(el){const p=[];while(el&&el!==document.body){let i=1,s=el;while((s=s.previousElementSibling))if(s.tagName===el.tagName)i++;p.unshift(el.tagName.toLowerCase()+':nth-of-type('+i+')');el=el.parentElement}return 'body>'+p.join('>')}
const find=p=>{try{return p.startsWith('body>')?$(p):null}catch{return null}};
const vis=e=>e.offsetParent!==null||e.hasAttribute('data-stx-hide')||!!e.closest('[data-stx-hide]');
const leaves=()=>[...document.body.querySelectorAll('h1,h2,h3,h4,h5,p,a,button,li,span,label,b,strong,small,legend,th,td,dt,dd,figcaption')].filter(e=>!mine(e)&&!e.closest('script,style,noscript,aside,[role=dialog]')&&!e.children.length&&e.textContent.trim()&&vis(e)).slice(0,400);
const blocks=()=>[...document.body.querySelectorAll('header,section,nav,footer,form,article,main>div,[data-section]')].filter(e=>!mine(e)&&!e.closest('aside,[role=dialog]')).slice(0,60);
function norm(){const o=S&&typeof S==='object'?S:{},d=D0();
for(const k of['title','desc','fav'])if(typeof o[k]==='string')d[k]=o[k];
d.fs=Math.min(140,Math.max(80,+o.fs||100));
for(const k in VARS)if(o.vars&&/^#[0-9a-f]{6}$/i.test(o.vars[k]))d.vars[k]=o.vars[k];
if(o.texts&&typeof o.texts==='object')for(const p of Object.keys(o.texts))if(p.startsWith('body>')&&typeof o.texts[p]==='string')d.texts[p]=o.texts[p];
if(o.hidden&&typeof o.hidden==='object')for(const p of Object.keys(o.hidden))if(p.startsWith('body>')&&o.hidden[p]===true)d.hidden[p]=true;
d.rev=+o.rev||0;S=d}
function apply(){const R=document.documentElement;
if(S.title)document.title=S.title;
if(S.desc){let m=$('meta[name=description]');if(!m){m=document.createElement('meta');m.name='description';document.head.append(m)}m.content=S.desc}
if(S.fav){let l=$('link[rel~=icon]');if(!l){l=document.createElement('link');l.rel='icon';document.head.append(l)}l.href='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">'+esc([...S.fav].slice(0,2).join(''))+'</text></svg>')}
R.style.fontSize=S.fs===100?'':S.fs+'%';
for(const k in VARS)VARS[k].forEach(n=>S.vars[k]?R.style.setProperty(n,S.vars[k]):R.style.removeProperty(n));
for(const p of Object.keys(S.texts)){const e=find(p);if(e&&!e.children.length&&e.textContent!==S.texts[p])e.textContent=S.texts[p]}
document.querySelectorAll('[data-stx-hide]').forEach(e=>{if(!S.hidden[path(e)])e.removeAttribute('data-stx-hide')});
for(const p of Object.keys(S.hidden)){const e=find(p);if(e&&!e.hasAttribute('data-stx-hide'))e.setAttribute('data-stx-hide','')}}
const save=()=>ls.set(KEY,JSON.stringify({...S,base:FR}));
const dl=(n,t)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));a.download=n;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)};
const msg=t=>{const m=$('#stx-m');if(m)m.textContent=t};
const CSS=`[data-stx-hide]{display:none!important}
#stx *{box-sizing:border-box;font-family:inherit}
#stx-b{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;min-height:44px;padding:0 18px;border-radius:14px;border:0;background:linear-gradient(135deg,#22d3ee,#8b5cf6);color:#05060d;font-weight:700;font-size:15px;cursor:pointer}
#stx-p{position:fixed;z-index:2147483001;inset:6vh 0 0 0;display:none;flex-direction:column;background:#0b1020;color:#eef2ff;border:1px solid #ffffff22;border-radius:20px 20px 0 0;font-size:15px;line-height:1.6}
#stx-p.o{display:flex}
@media(min-width:900px){#stx-p{inset:0 0 0 auto;width:430px;border-radius:20px 0 0 20px}}
#stx-h{display:flex;gap:6px;align-items:center;padding:10px;border-bottom:1px solid #ffffff22;overflow-x:auto}
#stx-p button{min-height:40px;padding:0 14px;border-radius:12px;border:1px solid #ffffff33;background:#ffffff12;color:inherit;cursor:pointer;flex:none}
#stx-h .a{background:#22d3ee;color:#05060d;border-color:#22d3ee}
#stx-c{flex:1;overflow:auto;padding:12px 14px calc(24px + env(safe-area-inset-bottom,0px))}
#stx-p label{display:block;margin:0 0 10px;font-size:13px;color:#9aa6c7}
#stx-p input:not([type=checkbox]):not([type=color]),#stx-p textarea{display:block;width:100%;min-height:42px;padding:8px 10px;border-radius:10px;border:1px solid #ffffff33;background:#ffffff0f;color:#eef2ff;font:inherit}
#stx-p .r{padding:8px 0;border-bottom:1px solid #ffffff1a}
#stx-p .r label{display:inline-block;margin:4px 0 0}
#stx-p :focus-visible,#stx-b:focus-visible{outline:3px solid #22d3ee;outline-offset:2px}`;
const tabs=()=>[['g','عام'],['t','النصوص'],['s','الأقسام'],['d','حفظ']].map(([k,l])=>`<button data-tab="${k}" class="${k===tab?'a':''}">${l}</button>`).join('')+'<button data-x="1">إغلاق</button>';
function view(){
if(tab==='g')return `<label>اسم الموقع (عنوان التبويب)<input data-k="title" value="${esc(S.title)}" placeholder="${esc(document.title)}"></label><label>وصف الموقع<textarea data-k="desc" rows="2">${esc(S.desc)}</textarea></label><label>أيقونة التبويب (إيموجي)<input data-k="fav" value="${esc(S.fav)}"></label><label>حجم الخط (${S.fs}%)<input type="range" min="80" max="140" data-k="fs" value="${S.fs}"></label>`+Object.keys(VARS).map(k=>`<label>${VL[k]} <input type="color" data-v="${k}" value="${S.vars[k]||'#22d3ee'}"> <button data-rv="${k}">افتراضي</button></label>`).join('')+'<p style="font-size:12px;color:#9aa6c7">الألوان تعمل على المواقع التي تستخدم متغيرات CSS بهذه الأسماء (--ac و--ac2 و--bg و--tx).</p>';
if(tab==='t')return '<input id="stx-q" placeholder="بحث في النصوص"><div>'+leaves().map(e=>{const p=path(e),t=S.texts[p]??e.textContent.trim();return `<div class="r" data-s="${esc(t.toLowerCase())}"><input data-p="${esc(p)}" value="${esc(t)}"><label><input type="checkbox" data-hp="${esc(p)}"${S.hidden[p]?' checked':''}> إخفاء</label></div>`}).join('')+'</div>';
if(tab==='s')return blocks().map(e=>{const p=path(e),h=$('h1,h2,h3',e),n=(h?h.textContent:e.id||e.tagName.toLowerCase()).trim().slice(0,40);return `<div class="r"><label><input type="checkbox" data-sh="${esc(p)}"${S.hidden[p]?'':' checked'}> إظهار: ${esc(n)}</label></div>`}).join('')||'<p>لا توجد أقسام.</p>';
return '<button data-a="exp">تنزيل settings.json</button><p style="font-size:12px;color:#9aa6c7">ضع الملف بجوار index.html وأعد رفع الموقع ليراه الزوار.</p><label>استيراد ملف إعدادات<input type="file" accept=".json,application/json" data-a="imp"></label><button data-a="rst">مسح كل الإعدادات</button><p id="stx-m" style="font-size:12px"></p>'}
const draw=()=>{$('#stx-h').innerHTML=tabs();$('#stx-c').innerHTML=view()};
function ui(){
if(location.hash==='#edit')ls.set(OWN,'1');
const st=document.createElement('style');st.textContent=CSS;document.head.append(st);
if(ls.get(OWN)!=='1')return;
const root=document.createElement('div');root.id='stx';root.dir='rtl';
root.innerHTML='<button id="stx-b" aria-label="الإعدادات">⚙ الإعدادات</button><div id="stx-p" role="dialog" aria-label="الإعدادات"><div id="stx-h"></div><div id="stx-c"></div></div>';
document.body.append(root);
root.addEventListener('input',e=>{const t=e.target;let ch=true;
if(t.id==='stx-q'){const v=t.value.toLowerCase();root.querySelectorAll('[data-s]').forEach(r=>r.style.display=r.dataset.s.includes(v)?'':'none');return}
if(t.dataset.k){S[t.dataset.k]=t.type==='range'?+t.value:t.value;if(t.dataset.k==='fs')t.parentElement.firstChild.textContent='حجم الخط ('+S.fs+'%)'}
else if(t.dataset.v)S.vars[t.dataset.v]=t.value;
else if(t.dataset.p)S.texts[t.dataset.p]=t.value;
else if(t.dataset.hp){if(t.checked)S.hidden[t.dataset.hp]=true;else delete S.hidden[t.dataset.hp]}
else if(t.dataset.sh){if(t.checked)delete S.hidden[t.dataset.sh];else S.hidden[t.dataset.sh]=true}
else ch=false;
if(ch){apply();save()}});
root.addEventListener('change',e=>{const t=e.target;if(t.dataset.a==='imp'&&t.files[0]){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||typeof o!=='object')throw 0;S=o;norm();save();apply();msg('تم الاستيراد')}catch{msg('ملف غير صالح — لم يتغير شيء')}};r.readAsText(t.files[0])}});
root.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const p=$('#stx-p');
if(t.id==='stx-b'){p.classList.toggle('o');if(p.classList.contains('o'))draw();return}
if(t.dataset.x){p.classList.remove('o');return}
if(t.dataset.tab){tab=t.dataset.tab;draw();return}
if(t.dataset.rv){delete S.vars[t.dataset.rv];apply();save();draw();return}
if(t.dataset.a==='exp'){const o={...S,rev:Date.now()};dl('settings.json',JSON.stringify(o,null,1));msg('تم التنزيل')}
if(t.dataset.a==='rst'){if(t.dataset.c){S=D0();save();location.reload();return}t.dataset.c=1;t.textContent='اضغط مرة أخرى للتأكيد'}});
addEventListener('keydown',e=>{if(e.key==='Escape')$('#stx-p').classList.remove('o')})}
function watch(){let t;new MutationObserver(m=>{if(m.every(x=>mine(x.target.nodeType===1?x.target:x.target.parentElement)))return;clearTimeout(t);t=setTimeout(apply,80)}).observe(document.body,{childList:true,subtree:true,characterData:true})}
async function boot(){let f={};try{const r=await fetch(FILE,{cache:'no-cache'});if(r.ok)f=await r.json()}catch{}
FR=+(f&&f.rev)||0;S=f;norm();let d=null;try{d=JSON.parse(ls.get(KEY)||'null')}catch{}
if(d&&typeof d==='object'&&d.base===FR){S=d;norm()}
apply();ui();watch()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
