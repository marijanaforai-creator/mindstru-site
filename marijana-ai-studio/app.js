function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2400)}function previewImage(e){const f=e.target.files?.[0],img=document.getElementById('image-preview');if(!f)return;img.src=URL.createObjectURL(f);img.style.display='block';document.getElementById('dropzone').style.display='none';showToast('Slika je učitana.')}function demoOcr(){document.getElementById('ocr-output').value='Danas radim na svom novom digitalnom proizvodu.\n\nOvo je [NEJASNO] mesto u rukopisu.\n\n🟡 AI pretpostavka: „novom“ — pouzdanost 82%.';showToast('Prepoznavanje je završeno. Proveri označene delove.')}async function callOpenAI(input){const r=await fetch('/api/openai/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'AI zahtev nije uspeo.');return d.text||''}
async function generateCopy(){const type=document.getElementById('copy-type').value,topic=document.getElementById('copy-topic').value.trim();if(!topic){showToast('Prvo napiši temu ili proizvod.');return}const out=document.getElementById('copy-output');out.value='AI radi…';try{out.value=await callOpenAI('Napiši '+type+' na srpskom jeziku za temu/proizvod: '+topic+'. Budi jasan, konkretan i profesionalan. Uključi CTA gde ima smisla.');showToast('AI nacrt je napravljen.')}catch(e){out.value='';showToast(e.message)}}function previewMockup(e){const f=e.target.files?.[0];if(!f)return;const stage=document.getElementById('mockup-stage');stage.innerHTML='';const type=document.getElementById('mockup-type')?.value||'';const img=document.createElement('img');img.className='mockup-image';img.src=URL.createObjectURL(f);img.alt='Pregled proizvoda';if(type==='Telefon ekran'){const frame=document.createElement('div');frame.className='mockup-screen-frame';frame.appendChild(img);stage.appendChild(frame);}else{stage.appendChild(img)}applyMockupFit();showToast('Slika je učitana bez razvlačenja.');}
function applyMockupFit(){const frame=document.querySelector('.mockup-screen-frame');const img=document.querySelector('.mockup-screen-frame .mockup-image');if(!frame||!img)return;const fit=document.getElementById('mockup-fit')?.value||'contain';const align=document.getElementById('mockup-align')?.value||'center';frame.classList.remove('fit-cover','fit-original','align-top','align-bottom');if(fit==='cover')frame.classList.add('fit-cover');if(fit==='original')frame.classList.add('fit-original');if(align==='top')frame.classList.add('align-top');if(align==='bottom')frame.classList.add('align-bottom');}
document.getElementById('mockup-type')?.addEventListener('change',()=>{const file=document.getElementById('mockup-input')?.files?.[0];if(file)renderMockupScene();});
function createMockup(){const file=document.getElementById('mockup-input')?.files?.[0];const type=document.getElementById('mockup-type')?.value||'proizvod';const prompt=document.getElementById('mockup-prompt')?.value.trim();if(!file){showToast('Prvo dodaj sliku proizvoda.');return}if(!prompt){showToast('Prompt je obavezan — opiši željenu scenu.');document.getElementById('mockup-prompt')?.focus();return}renderMockupScene();recordMockupUsage();showToast(type+' mockup je pripremljen prema promptu.');}
document.querySelectorAll('.nav-item').forEach(i=>i.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));i.classList.add('active')}));
async function buildProduct(){const v=document.getElementById('product-idea')?.value.trim(),type=document.getElementById('product-type')?.value||'Digitalni proizvod',aud=document.getElementById('product-audience')?.value.trim()||'idealni korisnik',goal=document.getElementById('product-goal')?.value||'Prodaja',offer=document.getElementById('product-offer')?.value.trim()||'jasna korist proizvoda';if(!v){showToast('Unesi ideju proizvoda.');return}const fields=['product-output','sales-output','seo-output','pin-output','social-output','email-output','mockup-output','drive-output'];fields.forEach(id=>{const el=document.getElementById(id);if(el)el.value='AI priprema paket…'});const prompt=`Ti si AI Product Strategist za Marijana AI Studio. Radi na srpskom jeziku. Na osnovu podataka ispod napravi kompletan ONE PRODUCT → EVERYTHING paket. Budi konkretan, prodajno jasan, ali bez izmišljanja činjenica ili rezultata.

PROIZVOD: ${v}
TIP: ${type}
CILJNA PUBLIKA: ${aud}
CILJ: ${goal}
PONUDA: ${offer}

Vrati ISKLJUČIVO validan JSON objekat sa tačno ovim ključevima:
product, sales, seo, pinterest, social, email, mockup, drive.

product: naziv, obećanje, problem, ishod, detaljna struktura proizvoda, bonus ideje i CTA.
sales: kompletna struktura prodajne stranice sa headlineom, podnaslovom, problemom, rešenjem, benefitima, sadržajem, ponudom, FAQ pitanjima i CTA.
seo: primarna ključna fraza, 10 sekundarnih fraza, SEO naslov, meta opis, URL slug i 5 content cluster tema.
pinterest: 10 Pin naslova, 10 opisa sa CTA, 5 board ideja i ključne fraze.
social: 5 Instagram objava, 5 Reels ideja sa hookom, 5 Story ideja i 3 LinkedIn posta.
email: lead magnet ideja i welcome/prodajna sekvenca od 5 emailova sa subjectom, svrhom i CTA.
mockup: 5 konkretnih mockup scena, preporučeni preset za svaku scenu i gotov AI prompt za vizual.
drive: kompletna struktura foldera i naziv paketa koji treba sačuvati u Marijana Drive.

Ne koristi markdown oko JSON-a.`;
try{const raw=await callOpenAI(prompt);const data=JSON.parse(raw.replace(/^\s*\`\`\`json\s*/,'').replace(/\s*\`\`\`\s*$/,''));const map={product:'product-output',sales:'sales-output',seo:'seo-output',pinterest:'pin-output',social:'social-output',email:'email-output',mockup:'mockup-output',drive:'drive-output'};Object.entries(map).forEach(([k,id])=>{const el=document.getElementById(id);if(el)el.value=typeof data[k]==='string'?data[k]:JSON.stringify(data[k],null,2)});window.__lastProductAI=data;showToast('ONE PRODUCT → EVERYTHING je generisan pomoću AI-ja.')}catch(e){fields.forEach(id=>{const el=document.getElementById(id);if(el&&el.value==='AI priprema paket…')el.value=''});showToast('AI paket nije mogao da se obradi: '+e.message)}}
function saveProductSystem(){const name=document.getElementById('product-idea')?.value.trim()||'Novi proizvod';const data={id:'product-'+Date.now(),name,createdAt:new Date().toISOString(),status:'Spreman za razradu',type:document.getElementById('product-type')?.value||'',audience:document.getElementById('product-audience')?.value||'',goal:document.getElementById('product-goal')?.value||'',offer:document.getElementById('product-offer')?.value||'',sections:{product:document.getElementById('product-output')?.value||'',sales:document.getElementById('sales-output')?.value||'',seo:document.getElementById('seo-output')?.value||'',pinterest:document.getElementById('pin-output')?.value||'',social:document.getElementById('social-output')?.value||'',email:document.getElementById('email-output')?.value||'',mockup:document.getElementById('mockup-output')?.value||'',drive:document.getElementById('drive-output')?.value||''}};localStorage.setItem('marijanaProductSystem',JSON.stringify(data));const projects=JSON.parse(localStorage.getItem('marijanaProductProjects')||'[]');projects.unshift(data);localStorage.setItem('marijanaProductProjects',JSON.stringify(projects.slice(0,100)));showToast('Product System je sačuvan u Marijana Drive.');}
document.addEventListener('click',e=>{const tab=e.target.closest('.result-tab');if(!tab)return;document.querySelectorAll('.result-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.result-output').forEach(x=>x.classList.remove('active'));tab.classList.add('active');document.getElementById(tab.dataset.result)?.classList.add('active');});
function prepareMusic(){const p=document.getElementById('music-prompt').value.trim();const type=document.getElementById('music-type').value;const use=document.getElementById('music-use').value;if(!p){showToast('Opiši kakvu muziku želiš.');return}document.getElementById('music-output').value='MUZIČKI BRIEF\n\nOpis: '+p+'\n\nVrsta: '+type+'\nNamena: '+use+'\n\nAtmosfera: smirena, topla i dostojanstvena\nTempo: umeren / spor\nInstrumentacija: odabrati prema kulturnom i umetničkom kontekstu\nStruktura: uvod → glavna tema → razvoj → miran završetak\n\nNapomena: za stvarnu produkciju proveriti prava/licence za korišćene uzorke, snimke i muzičke materijale.';showToast('Muzički koncept je pripremljen.');}
function saveProject(){const data={savedAt:new Date().toISOString(),ocr:document.getElementById('ocr-output')?.value||'',copy:document.getElementById('copy-output')?.value||'',document:document.querySelector('.document-editor')?.innerHTML||'',product:document.getElementById('product-output')?.value||'',music:document.getElementById('music-output')?.value||''};localStorage.setItem('marijanaStudioProject',JSON.stringify(data));showToast('Projekat je sačuvan u ovom radnom prostoru.');}
function loadProject(){try{const d=JSON.parse(localStorage.getItem('marijanaStudioProject')||'null');if(!d)return;if(document.getElementById('ocr-output'))document.getElementById('ocr-output').value=d.ocr||'';if(document.getElementById('copy-output'))document.getElementById('copy-output').value=d.copy||'';if(document.querySelector('.document-editor')&&d.document)document.querySelector('.document-editor').innerHTML=d.document;if(document.getElementById('product-output'))document.getElementById('product-output').value=d.product||'';if(document.getElementById('music-output'))document.getElementById('music-output').value=d.music||'';}catch(e){}}
function newProject(){if(confirm('Otvoriti novi prazan projekat? Nesacuvan sadržaj u trenutnom projektu biće zamenjen.')){localStorage.removeItem('marijanaStudioProject');location.reload();}}
function exportDocument(kind){const editor=document.querySelector('.document-editor');const text=editor?.innerText||'';if(!text.trim()){showToast('Dokument je prazan.');return}const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Marijana-Dokument.txt';a.click();URL.revokeObjectURL(a.href);showToast(kind==='pdf'?'Sadržaj je izvezen kao tekstualni dokument; PDF modul će zadržati formatiranje.':'TXT je sačuvan.');}
function prepareImageBrief(){const area=[...document.querySelectorAll('#slika textarea,#slika input')].map(x=>x.value).filter(Boolean).join('\n');showToast('Vizuelni brief je spreman za povezivanje sa generatorom slike.');}
function prepareVideoBrief(){showToast('Video brief je spreman za povezivanje sa generatorom videa.');}
window.addEventListener('DOMContentLoaded',loadProject);

function setMockupPreset(preset){const prompt=document.getElementById('mockup-prompt'),type=document.getElementById('mockup-type');const presets={editorial:{type:'Magazine Editorial',text:'Premium editorial mockup, clean studio background, realistic paper depth, subtle soft shadows, elegant composition, luxury digital product presentation.'},paper:{type:'Paper Stack / Layered',text:'Layered paper sheets, multiple pages with slight offsets, realistic paper thickness, soft directional shadow, clean premium background.'},book:{type:'Otvorena knjiga',text:'Open book mockup, realistic center fold, gently curved pages, visible left and right spreads, natural paper shadows, editorial photography.'},isometric:{type:'Isometric Pages',text:'Isometric digital product scene, multiple pages at different angles, controlled perspective, realistic depth and shadows, premium presentation.'},'device-set':{type:'Desktop + Laptop + Tablet + Telefon',text:'Responsive device ecosystem showing the same product across desktop, laptop, tablet and phone, coordinated perspective, clean premium scene.'},frame:{type:'Frame / Okvir',text:'Elegant framed digital artwork or printable page, realistic frame depth, wall or gallery presentation, soft natural shadow, premium minimal interior.'}}[preset];if(!presets)return;if(type)type.value=presets.type;if(prompt)prompt.value=presets.text;const file=document.getElementById('mockup-input')?.files?.[0];if(file)previewMockup({target:{files:[file]}});showToast('Preset '+preset+' je izabran.');}

function updateMockupPages(){const v=document.getElementById('mockup-pages')?.value||3;const out=document.getElementById('mockup-pages-value');if(out)out.textContent=v;renderMockupScene();}
function renderMockupScene(){const stage=document.getElementById('mockup-stage'),file=document.getElementById('mockup-input')?.files?.[0],type=document.getElementById('mockup-type')?.value||'';if(!stage||!file)return;const src=window.__mockupObjectUrl||URL.createObjectURL(file);window.__mockupObjectUrl=src;const n=Math.min(6,Math.max(1,Number(document.getElementById('mockup-pages')?.value||3)));const perspective=document.getElementById('mockup-perspective')?.value||'soft';const shadow=document.getElementById('mockup-shadow')?.value||'soft';
const img=s=>'<img src="'+s+'" alt="Proizvodni vizual">';
const paperTypes=['Jedan list','Lebdeći list','Dva lista','Više listova / Stack','Floating Sheets','Paper Stack / Layered','Isometric Pages','Isometric Wall','Zig-Zag Pages','3D Paper Scene','Multi-Page Presentation','Page Turn / Savijeni list'];
if(type==='Otvorena knjiga'||type==='Otvorena radna sveska'||type==='Magazine Spread'||type==='Magazine Editorial'||type==='Blank Book / Brochure'){stage.innerHTML='<div class="open-book"><div class="book-page left">'+img(src)+'</div><div class="book-gutter"></div><div class="book-page right">'+img(src)+'</div></div>';return}
if(type==='Frame / Okvir'||type==='Gallery Frames'){stage.innerHTML='<div class="frame-scene"><div class="frame-object">'+img(src)+'</div></div>';return}
if(paperTypes.includes(type)){const scene=document.createElement('div');scene.className='paper-scene '+perspective+' shadow-'+shadow+(type==='Page Turn / Savijeni list'?' page-turn':'');for(let i=0;i<n;i++){const sheet=document.createElement('div');sheet.className='paper-sheet';sheet.style.setProperty('--sheet-index',i);sheet.appendChild(Object.assign(document.createElement('img'),{src,alt:'Stranica proizvoda'}));scene.appendChild(sheet)}stage.innerHTML='';stage.appendChild(scene);apply3DTransform(scene);return}
if(type==='Desktop + Laptop + Tablet + Telefon'){stage.innerHTML='<div class="device-ecosystem"><div class="device desktop">'+img(src)+'</div><div class="device laptop">'+img(src)+'</div><div class="device tablet">'+img(src)+'</div><div class="device phone">'+img(src)+'</div></div>';return}
if(type==='Laptop ekran'||type==='Tablet ekran'||type==='Telefon ekran'){stage.innerHTML='';const wrap=document.createElement('div');wrap.className='single-device '+(type==='Laptop ekran'?'device-laptop':type==='Tablet ekran'?'device-tablet':'device-phone');wrap.innerHTML=img(src);stage.appendChild(wrap);apply3DTransform(wrap);return}
if(type==='Bundle proizvoda'||type==='Product Ecosystem'||type==='3D proizvod'){const scene=document.createElement('div');scene.className='product-ecosystem';for(let i=0;i<n;i++){const card=document.createElement('div');card.className='eco-card';card.style.setProperty('--i',i);card.innerHTML=img(src);scene.appendChild(card)}stage.innerHTML='';stage.appendChild(scene);apply3DTransform(scene);return}
if(type==='Desk Scene'||type==='Lifestyle Scene'||type==='Photo / Collage'){stage.innerHTML='<div class="lifestyle-scene"><div class="scene-backdrop"></div><div class="scene-product">'+img(src)+'</div><div class="scene-shadow"></div></div>';return}
previewMockup({target:{files:[file]}});}

function updateTransformValue(kind){const ids={['rotate-x']:'rotate-x-value',['rotate-y']:'rotate-y-value',['rotate-z']:'rotate-z-value',depth:'depth-value',scale:'scale-value'};const input=document.getElementById('mockup-'+kind),out=document.getElementById(ids[kind]);if(input&&out)out.textContent=input.value+(kind.startsWith('rotate')?'°':kind==='scale'?'%':'');renderMockupScene();}
function apply3DTransform(el){if(!el)return;const mode=document.getElementById('mockup-mode')?.value||'3d';const rx=document.getElementById('mockup-rotate-x')?.value||0,ry=document.getElementById('mockup-rotate-y')?.value||0,rz=document.getElementById('mockup-rotate-z')?.value||0,depth=document.getElementById('mockup-depth')?.value||0,scale=(document.getElementById('mockup-scale')?.value||100)/100;if(mode==='2d'){el.style.transform='translateZ('+depth+'px) rotateZ('+rz+'deg) scale('+scale+')';}else{el.style.transform='translateZ('+depth+'px) rotateX('+rx+'deg) rotateY('+ry+'deg) rotateZ('+rz+'deg) scale('+scale+')';}}


function getTrialDaysLeft(){const started=localStorage.getItem('marijanaTrialStartedAt');if(!started)return 30;const remaining=Math.max(0,30*24*60*60*1000-(Date.now()-new Date(started).getTime()));return Math.ceil(remaining/(24*60*60*1000));}
function updateDashboard(){const uRaw=localStorage.getItem('marijanaUser');let u=null;try{u=uRaw?JSON.parse(uRaw):null}catch(e){}const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};const d=getTrialDaysLeft();set('dash-user-name',u?.name||'Gost');set('dash-user-email',u?.email||'Prijavi se da vidiš svoj workspace.');set('dash-plan',u?'Free Trial':'Free Trial');set('dash-plan-status',d>0?'Aktivan trial':'Trial je istekao');set('dash-days',d>0?d+' '+(d===1?'dan':'dana'):'Istekao');let products=0;try{products=localStorage.getItem('marijanaProductSystem')?1:0}catch(e){}set('dash-products',products);set('dash-projects',localStorage.getItem('marijanaStudioProject')?'1':'0');const used=Number(localStorage.getItem('marijanaMockupCount')||0);set('dash-mockups',Math.min(used,10)+' / 10');}
function recordMockupUsage(){const used=Number(localStorage.getItem('marijanaMockupCount')||0)+1;localStorage.setItem('marijanaMockupCount',String(used));updateDashboard();}

function startFreeTrial(){let started=localStorage.getItem('marijanaTrialStartedAt');if(!started){started=new Date().toISOString();localStorage.setItem('marijanaTrialStartedAt',started);}localStorage.setItem('marijanaSelectedPlan','Free');updateTrialStatus();showToast('Free trial od 30 dana je aktiviran.');}
function updateTrialStatus(){const el=document.getElementById('trial-status');if(!el)return;const started=localStorage.getItem('marijanaTrialStartedAt');const title=document.getElementById('trial-status-title'),text=document.getElementById('trial-status-text'),days=document.getElementById('trial-days');if(!started){if(title)title.textContent='30 dana besplatno';if(text)text.textContent='Klikni „Počni besplatno“ da aktiviraš svoj trial.';if(days)days.textContent='30 dana';return;}const start=new Date(started).getTime(),now=Date.now(),total=30*24*60*60*1000,remaining=Math.max(0,total-(now-start)),left=Math.ceil(remaining/(24*60*60*1000));if(left<=0){if(title)title.textContent='Trial je istekao';if(text)text.textContent='Izaberi Pro, Premium ili Business za nastavak.';if(days)days.textContent='Istekao';el.classList.add('expired');return;}if(title)title.textContent='Free trial je aktivan';if(text)text.textContent='Trial je počeo '+new Date(start).toLocaleDateString('sr-RS')+'.';if(days)days.textContent=left+' '+(left===1?'dan':'dana');}
function selectPlan(plan){if(plan==='Free'){startFreeTrial();return}localStorage.setItem('marijanaSelectedPlan',plan);showToast(plan+' plan je izabran — naplata će biti povezana kada postavimo billing.');}
document.addEventListener('DOMContentLoaded',()=>{updateTrialStatus();setInterval(updateTrialStatus,60000);});

let authMode='login';
function openAuth(mode='login'){authMode=mode;const o=document.getElementById('auth-overlay');if(!o)return;o.classList.add('open');o.setAttribute('aria-hidden','false');updateAuthUI();setTimeout(()=>document.getElementById('auth-email')?.focus(),100);}
function closeAuth(){const o=document.getElementById('auth-overlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true');}}
function toggleAuthMode(){authMode=authMode==='login'?'register':'login';updateAuthUI();}
function updateAuthUI(){const reg=authMode==='register';const title=document.getElementById('auth-title'),sub=document.getElementById('auth-subtitle'),name=document.getElementById('auth-name-wrap'),submit=document.getElementById('auth-submit'),sw=document.getElementById('auth-switch');if(title)title.textContent=reg?'Napravi nalog':'Prijavi se';if(sub)sub.textContent=reg?'Kreiraj svoj Marijana AI Studio radni prostor.':'Uđi u svoj Marijana AI Studio nalog.';if(name)name.classList.toggle('auth-hidden',!reg);if(submit)submit.textContent=reg?'Kreiraj nalog':'Prijavi se';if(sw)sw.textContent=reg?'Već imam nalog — prijavi se':'Nemam nalog — napravi nalog';}
function submitAuth(e){e.preventDefault();const email=document.getElementById('auth-email')?.value.trim().toLowerCase(),password=document.getElementById('auth-password')?.value||'',name=document.getElementById('auth-name')?.value.trim()||'Marijana';if(!email||password.length<6){showToast('Unesi ispravan email i lozinku od najmanje 6 karaktera.');return}const user={email,name,plan:'Free',trialStartedAt:new Date().toISOString(),createdAt:new Date().toISOString()};localStorage.setItem('marijanaUser',JSON.stringify(user));localStorage.setItem('marijanaSelectedPlan','Free');if(!localStorage.getItem('marijanaTrialStartedAt'))localStorage.setItem('marijanaTrialStartedAt',user.trialStartedAt);closeAuth();updateAccountUI();updateTrialStatus();updateDashboard();showToast(regAuthMessage());}
function regAuthMessage(){return authMode==='register'?'Nalog je kreiran. Dobrodošla u Marijana AI Studio.':'Uspešno si prijavljena.';}
function logoutUser(){localStorage.removeItem('marijanaUser');updateAccountUI();updateDashboard();showToast('Odjavljena si iz ovog workspace-a.');}
function updateAccountUI(){const raw=localStorage.getItem('marijanaUser');let u=null;try{u=raw?JSON.parse(raw):null}catch(e){}const title=document.getElementById('account-title'),textEl=document.getElementById('account-text'),login=document.getElementById('account-login'),register=document.getElementById('account-register'),logout=document.getElementById('account-logout');if(u){if(title)title.textContent=u.name||'Moj nalog';if(textEl)textEl.textContent=(u.email||'')+' · Free trial';login?.classList.add('auth-hidden');register?.classList.add('auth-hidden');logout?.classList.remove('auth-hidden');}else{if(title)title.textContent='Tvoj nalog';if(textEl)textEl.textContent='Prijavi se da nastaviš.';login?.classList.remove('auth-hidden');register?.classList.remove('auth-hidden');logout?.classList.add('auth-hidden');}}
async function syncCloudProjects(){
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(Array.isArray(d.projects)) localStorage.setItem('marijanaProductProjects',JSON.stringify(d.projects.map(p=>({id:p.id,name:p.name,createdAt:p.created_at,status:p.status,type:p.data?.type||p.type,audience:p.data?.audience||'',goal:p.data?.goal||'',offer:p.data?.offer||'',sections:p.data?.sections||{}}))));
  }catch(e){}
}
async function restoreCloudSession(){
  try{
    const r=await fetch('/api/auth/me',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(d.user){localStorage.setItem('marijanaUser',JSON.stringify(d.user));updateAccountUI();updateDashboard();}
    await syncCloudProjects();
  }catch(e){}
}
document.addEventListener('DOMContentLoaded',()=>{updateAccountUI();updateAuthUI();updateDashboard();restoreCloudSession();});

function connectCanva(){window.location.href='/api/canva/authorize';}
async function connectOpenAI(){try{const text=await callOpenAI('Napiši jednu kratku rečenicu na srpskom kojom potvrđuješ da je Marijana AI Studio povezan sa AI servisom.');if(text){localStorage.setItem('marijanaOpenAIConnection','connected');showToast('AI konekcija radi.');}}catch(e){localStorage.setItem('marijanaOpenAIConnection','pending');showToast(e.message)}updateConnections();}
function updateConnections(){const canva=localStorage.getItem('marijanaCanvaConnection'),openai=localStorage.getItem('marijanaOpenAIConnection');const a=document.getElementById('canva-status'),b=document.getElementById('openai-status');if(a)a.textContent=canva==='connected'?'POVEZANO':'PRIPREMLJENO';if(b)b.textContent=openai==='connected'?'POVEZANO':'PRIPREMLJENO';}
document.addEventListener('DOMContentLoaded',()=>{updateConnections();});

function connectService(name){localStorage.setItem('marijanaConnection_'+name,'pending');showToast(name+' konektor je dodat u Connections Hub. Pravo OAuth povezivanje će se aktivirati kroz developer podešavanja.');}

function handleConnectionCallback(){const p=new URLSearchParams(location.search);if(p.get('connection')==='canva'){const status=p.get('status');if(status==='connected'){localStorage.setItem('marijanaCanvaConnection','connected');showToast('Canva je povezana.');}else if(status==='denied'){showToast('Canva povezivanje je otkazano.');}history.replaceState({},document.title,location.pathname);updateConnections();}}
document.addEventListener('DOMContentLoaded',handleConnectionCallback);


/* CLOUD PERSISTENCE OVERRIDES */
async function submitAuth(e){
  e.preventDefault();
  const email=document.getElementById('auth-email')?.value.trim().toLowerCase();
  const password=document.getElementById('auth-password')?.value||'';
  const name=document.getElementById('auth-name')?.value.trim()||'Marijana';
  if(!email||password.length<8){showToast('Unesi ispravan email i lozinku od najmanje 8 karaktera.');return}
  const endpoint=authMode==='register'?'/api/auth/register':'/api/auth/login';
  try{
    const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password}),credentials:'same-origin'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Autentikacija nije uspela.');
    localStorage.setItem('marijanaUser',JSON.stringify(d.user));
    if(authMode==='register'&&!localStorage.getItem('marijanaTrialStartedAt'))localStorage.setItem('marijanaTrialStartedAt',new Date().toISOString());
    closeAuth();updateAccountUI();updateTrialStatus();updateDashboard();showToast(authMode==='register'?'Nalog je kreiran. Dobrodošla u Marijana AI Studio.':'Uspešno si prijavljena.');
    await syncCloudProjects();
  }catch(e){showToast(e.message)}
}

async function logoutUser(){
  try{await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'});}catch(e){}
  localStorage.removeItem('marijanaUser');
  updateAccountUI();updateDashboard();showToast('Odjavljena si iz ovog workspace-a.');
}

async function saveProductSystem(){
  const name=document.getElementById('product-idea')?.value.trim()||'Novi proizvod';
  const data={name,createdAt:new Date().toISOString(),status:'Spreman za razradu',type:document.getElementById('product-type')?.value||'',audience:document.getElementById('product-audience')?.value||'',goal:document.getElementById('product-goal')?.value||'',offer:document.getElementById('product-offer')?.value||'',sections:{product:document.getElementById('product-output')?.value||'',sales:document.getElementById('sales-output')?.value||'',seo:document.getElementById('seo-output')?.value||'',pinterest:document.getElementById('pin-output')?.value||'',social:document.getElementById('social-output')?.value||'',email:document.getElementById('email-output')?.value||'',mockup:document.getElementById('mockup-output')?.value||'',drive:document.getElementById('drive-output')?.value||''}};
  try{
    const r=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name,type:'product_system',status:data.status,data})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Cloud čuvanje nije uspelo.');
    data.id=d.project?.id||('product-'+Date.now());
    localStorage.setItem('marijanaProductSystem',JSON.stringify(data));
    await syncCloudProjects();
    showToast('Product System je sačuvan u cloud workspace.');
  }catch(e){
    const local={id:'product-'+Date.now(),...data};
    localStorage.setItem('marijanaProductSystem',JSON.stringify(local));
    const projects=JSON.parse(localStorage.getItem('marijanaProductProjects')||'[]');
    projects.unshift(local);localStorage.setItem('marijanaProductProjects',JSON.stringify(projects.slice(0,100)));
    showToast('Cloud nije dostupan — projekat je privremeno sačuvan lokalno.');
  }
}

async function syncCloudProjects(){
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(Array.isArray(d.projects)){
      const normalized=d.projects.map(p=>({id:p.id,name:p.name,createdAt:p.created_at,status:p.status,type:p.data?.type||p.type,audience:p.data?.audience||'',goal:p.data?.goal||'',offer:p.data?.offer||'',sections:p.data?.sections||{}}));
      localStorage.setItem('marijanaProductProjects',JSON.stringify(normalized));
      if(typeof loadProjectProjects==='function')loadProjectProjects();
    }
  }catch(e){}
}

async function restoreCloudSession(){
  try{
    const r=await fetch('/api/auth/me',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(d.user){
      localStorage.setItem('marijanaUser',JSON.stringify(d.user));
      updateAccountUI();updateDashboard();
      await syncCloudProjects();
    }
  }catch(e){}
}
document.addEventListener('DOMContentLoaded',restoreCloudSession);


/* FUNNEL BRIDGE */
async function openFunnelFromProductSystem(){
  const raw=localStorage.getItem('marijanaProductSystem');
  if(!raw){alert('Prvo napravi Product System.');return;}
  try{
    const product=JSON.parse(raw);
    const r=await fetch('/api/funnels/from-product',{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
      body:JSON.stringify({name:product.name||'Product Funnel',product})
    });
    const d=await r.json();
    if(!r.ok){alert(d.error||'Nije moguće napraviti funnel.');return;}
    window.location.href='../marijana-funnel/index.html';
  }catch(e){alert('Funnel bridge trenutno nije dostupan.');}
}
