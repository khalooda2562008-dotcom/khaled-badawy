const V='nexus-v2',SHELL=['./','index.html','ai.js','config.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','data.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{if(x&&(x.ok||x.type==='opaque'))caches.open(V).then(c=>c.put(r,x.clone()));return x};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const same=new URL(r.url).origin===location.origin;
e.respondWith(same?fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))):caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))))});
