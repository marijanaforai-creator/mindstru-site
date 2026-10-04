const imageUpload=document.getElementById('imageUpload');
const previewImage=document.getElementById('previewImage');
const imageStrip=document.getElementById('imageStrip');
const uploadCount=document.getElementById('uploadCount');
const sceneSelect=document.getElementById('sceneSelect');
const templateSelect=document.getElementById('templateSelect');
const customWidth=document.getElementById('customWidth');
const customHeight=document.getElementById('customHeight');
const useCustomSize=document.getElementById('useCustomSize');
const formatSelect=document.getElementById('formatSelect');
const fitSelect=document.getElementById('fitSelect');
const perspectiveRange=document.getElementById('perspectiveRange');
const tiltXRange=document.getElementById('tiltXRange');
const tiltYRange=document.getElementById('tiltYRange');
const perspectiveValue=document.getElementById('perspectiveValue');
const tiltXValue=document.getElementById('tiltXValue');
const tiltYValue=document.getElementById('tiltYValue');
const scaleRange=document.getElementById('scaleRange');
const rotateRange=document.getElementById('rotateRange');
const positionX=document.getElementById('positionX');
const positionY=document.getElementById('positionY');
const bgColor=document.getElementById('bgColor');
const mockupStage=document.getElementById('mockupStage');
const mockupObject=document.getElementById('mockupObject');
const sceneTitle=document.getElementById('sceneTitle');
const sceneLabel=document.getElementById('sceneLabel');
const scaleValue=document.getElementById('scaleValue');
const rotateValue=document.getElementById('rotateValue');
const positionXValue=document.getElementById('positionXValue');
const positionYValue=document.getElementById('positionYValue');
const statusText=document.getElementById('statusText');
const resetBtn=document.getElementById('resetBtn');
const downloadBtn=document.getElementById('downloadBtn');
const saveTemplateBtn=document.getElementById('saveTemplateBtn');
const myTemplatesBtn=document.getElementById('myTemplatesBtn');
const savedTemplates=document.getElementById('savedTemplates');
const templateGrid=document.getElementById('templateGrid');
const templateSearch=document.getElementById('templateSearch');
const templateCategory=document.getElementById('templateCategory');
const favoritesOnly=document.getElementById('favoritesOnly');

let images=[];
let activeImageIndex=0;
let objectScale=100;
let objectRotation=0;
let offsetX=0;
let offsetY=0;
let perspective=0;
let tiltX=0;
let tiltY=0;
const TEMPLATE_KEY='digitalSoulMockupTemplates';
const FAVORITES_KEY='digitalSoulMockupFavorites';
const masterPrompts=[
  {
    id:'accordion-concertina-master',
    name:'Accordion / Concertina 3D',
    category:'Master geometrija',
    description:'Neutralna 3D harmonika od 7–9 povezanih vertikalnih panela. Geometrija, perspektiva i osvetljenje ostaju konstantni; boja se dodaje naknadno.',
    prompt:`Kreiraj jednu premium minimalističku 3D pozadinu sa velikom harmonika / accordion / concertina strukturom, potpuno inspirisanu priloženom referentnom slikom.

GLAVNA STRUKTURA
U centru kompozicije nalazi se niz od 7–9 velikih vertikalnih pravougaonih panela koji su međusobno povezani i savijeni u obliku harmonike. Paneli moraju biti fizički povezani na svojim bočnim ivicama i naizmenično okrenuti: prema kameri / od kamere, kroz ceo niz, kako bi se dobila jasno vidljiva cik-cak / accordion / concertina perspektiva. Ne praviti ravnu galeriju, zakrivljeni zid ili niz odvojenih kartica. Mora izgledati kao jedan jedinstveni povezani sistem koji se fizički preklapa kao harmonika.

OBLIK PANELA
Svaki panel je veliki vertikalni pravougaonik iste visine i približno iste širine, savršeno ravan, sa čistim pravougaonim ivicama i bez zaobljenih uglova. Paneli se međusobno preklapaju samo kroz perspektivu i ugao, bez neprirodnog prekrivanja površina.

POVRŠINE
Svi paneli moraju biti potpuno prazni: bez teksta, fotografija, ilustracija, ikona, logotipa, dugmadi, grafike, UI elemenata, dekorativnih elemenata, šara ili tekstura. Paneli predstavljaju prazne dizajnerske površine za naknadni mockup sadržaj.

PERSPEKTIVA
Koristi realističnu 3D perspektivu. Kamera je frontalna sa blagim bočnim pomakom i malo iznad nivoa panela, tako da se jasno vidi dubina harmonike. Svi paneli imaju konzistentnu perspektivu i fizički realnu udaljenost.

PODLOGA
Harmonika stoji na velikoj glatkoj horizontalnoj studijskoj podlozi. Podloga je čista, glatka i minimalistička, bez objekata, nameštaja i prostora u pozadini. Ispod panela može postojati veoma suptilan realističan odraz, bez jakog ogledalnog efekta.

OSVETLJENJE
Neutralno profesionalno studijsko osvetljenje. Meko difuzno svetlo dolazi odozgo i blago sa prednje strane. Dodaj veoma nežne senke, ambijentalno zatamnjenje između panela, suptilnu senku na podu i realističnu dubinu. Osvetljenje ostaje neutralno kako bi se kasnije mogla menjati boja panela.

BOJA
NE DEFINISATI KONKRETNU BOJU. Paneli treba da budu neutralna osnovna verzija, pogodna za naknadnu promenu boje. Boja je potpuno odvojena od geometrije.

SISTEM ZA KASNIJE BOJENJE
Naknadno mora biti moguće primeniti [HEX BOJA] bez promene oblika panela, broja panela, položaja, uglova, perspektive, kamere, svetla, senki, refleksije ili proporcija.

POZADINA
Jednostavna, neutralna i svetla, sa veoma blagim studijskim gradijentom. Nema vidljivih zidova, prostorije, nameštaja, objekata ili dekoracije. Harmonika treba da izgleda kao da lebdi ili stoji u profesionalnom 3D studiju.

KOMPOZICIJA
Harmonika zauzima većinu horizontalnog prostora uz dovoljno praznog prostora oko nje. Centralni paneli su najjasnije vidljivi, a cela struktura se proteže horizontalno preko slike.

STIL
Premium, minimalistički, moderan, luksuzan, editorial, profesionalni mockup, realističan 3D render, čiste geometrijske forme, precizna perspektiva, meko studijsko osvetljenje, visoka rezolucija.

ZABRANJENO
Bez sadržaja na panelima, web stranica, fotografija, teksta, logotipa, ikonica, ilustracija, dugmadi, kartica, dodatnih objekata, ljudi, nameštaja, pejzaža, jakih refleksija, jakih sjajnih efekata i nasumičnih boja.

FINALNI REZULTAT
Jedna čista, neutralna, prazna 3D accordion / concertina harmonika, sastavljena od 7–9 povezanih vertikalnih panela, sa realističnom perspektivom, dubinom, blagim senkama i suptilnim odrazom na podu. Ovo je MASTER GEOMETRIJA. Boje se dodaju naknadno i ne smeju menjati nijedan element strukture. Format: 16:9 horizontalno. Visoka rezolucija. Bez teksta. Bez slika. Bez logotipa. Bez vodenog žiga.`
  }
];

const libraryTemplates=[
 {id:'phone-clean',name:'Phone Clean',scene:'phone',category:'device',bg:'#E8DED0',shape:'tall'},
 {id:'laptop-business',name:'Laptop Business',scene:'laptop',category:'business',bg:'#DDE4EA',shape:'wide'},
 {id:'planner-luxury',name:'Planner Luxury',scene:'planner',category:'product',bg:'#151515',shape:'tall'},
 {id:'poster-minimal',name:'Poster Minimal',scene:'product',category:'product',bg:'#F3F1EB',shape:'tall'},
 {id:'fitness-campaign',name:'Fitness Campaign',scene:'fitness',category:'wellness',bg:'#DCE7DE',shape:'wide'},
 {id:'hotel-premium',name:'Hotel Premium',scene:'hotel',category:'business',bg:'#E5DED2',shape:'wide'},
 {id:'restaurant-menu',name:'Restaurant Menu',scene:'restaurant',category:'business',bg:'#E1D5C5',shape:'wide'},
 {id:'yoga-calm',name:'Yoga Calm',scene:'yoga',category:'wellness',bg:'#DCE7DE',shape:'wide'},
 {id:'beauty-editorial',name:'Beauty Editorial',scene:'beauty',category:'product',bg:'#E8DDE0',shape:'wide'},
 {id:'social-story',name:'Social Story',scene:'social',category:'social',bg:'#E1E7E3',shape:'tall'},
 {id:'office-pro',name:'Office Pro',scene:'office',category:'business',bg:'#D9DDD7',shape:'wide'},
 {id:'premium-product',name:'Premium Product',scene:'product',category:'product',bg:'#E8E0D2',shape:'tall'},
 {id:'packaging-studio',name:'Packaging Studio',scene:'packaging',category:'product',bg:'#D8C9B0',shape:'tall'},
 {id:'desk-creator',name:'Creator Desk',scene:'desk',category:'business',bg:'#E4D8C8',shape:'wide'},
 {id:'realestate-pro',name:'Nekretnine Pro',scene:'realestate',category:'industry',bg:'#E2DDD4',shape:'wide'},
 {id:'salon-editorial',name:'Salon Editorial',scene:'salon',category:'industry',bg:'#E8D7D5',shape:'wide'},
 {id:'spa-calm',name:'Spa Calm',scene:'spa',category:'industry',bg:'#DCE7DE',shape:'wide'},
 {id:'clinic-clean',name:'Clinic Clean',scene:'clinic',category:'industry',bg:'#E1E8E7',shape:'wide'},
 {id:'dental-clean',name:'Dental Clean',scene:'dental',category:'industry',bg:'#E5E1DA',shape:'wide'},
 {id:'education-pro',name:'Education Pro',scene:'education',category:'industry',bg:'#DCE4EA',shape:'wide'},
 {id:'coach-personal',name:'Coach Personal',scene:'coach',category:'industry',bg:'#E5DED2',shape:'wide'},
 {id:'insurance-pro',name:'Insurance Pro',scene:'insurance',category:'industry',bg:'#DDE4EA',shape:'wide'},
 {id:'finance-minimal',name:'Finance Minimal',scene:'finance',category:'industry',bg:'#E3E0D7',shape:'wide'},
 {id:'travel-editorial',name:'Travel Editorial',scene:'travel',category:'industry',bg:'#DDE6E0',shape:'wide'},
 {id:'fashion-editorial',name:'Fashion Editorial',scene:'fashion',category:'industry',bg:'#E5D8D0',shape:'wide'},
 {id:'cafe-warm',name:'Cafe Warm',scene:'cafe',category:'industry',bg:'#E1D5C5',shape:'wide'},
 {id:'ecommerce-clean',name:'E-commerce Clean',scene:'ecommerce',category:'industry',bg:'#E8E0D2',shape:'wide'},
 {id:'event-elegant',name:'Event Elegant',scene:'event',category:'industry',bg:'#E6DDD6',shape:'wide'},
 {id:'pet-friendly',name:'Pet Friendly',scene:'pet',category:'industry',bg:'#E0E4DA',shape:'wide'},
 {id:'auto-pro',name:'Auto Pro',scene:'automotive',category:'industry',bg:'#D8DEE2',shape:'wide'}
];

const sceneNames={
  phone:'Telefon',laptop:'Laptop',planner:'Planner',poster:'Poster',realestate:'Nekretnine',salon:'Salon lepote',spa:'Spa & Wellness',clinic:'Klinika',dental:'Stomatologija',education:'Edukacija',coach:'Coaching',insurance:'Osiguranje',finance:'Finansije',travel:'Putovanja',fashion:'Moda',cafe:'Cafe & Coffee',ecommerce:'E-commerce',event:'Event & Wedding',pet:'Pet biznis',automotive:'Auto biznis',
  business:'Business scena',fitness:'Fitness scena',hotel:'Hotel scena',
  restaurant:'Restoran scena',yoga:'Yoga scena',beauty:'Beauty scena',office:'Kancelarija',desk:'Radni sto',product:'Premium proizvod',packaging:'Ambalaža',social:'Social media ekran'
};

const lifestylePresets={
  office:{bg:'#D9DDD7',template:'business'},
  desk:{bg:'#E4D8C8',template:'classic'},
  product:{bg:'#E8E0D2',template:'luxury'},
  packaging:{bg:'#D8C9B0',template:'luxury'},
  social:{bg:'#E1E7E3',template:'minimal'},
  realestate:{bg:'#E2DDD4',template:'business'},
  salon:{bg:'#E8D7D5',template:'wellness'},
  spa:{bg:'#DCE7DE',template:'wellness'},
  clinic:{bg:'#E1E8E7',template:'business'},
  dental:{bg:'#E5E1DA',template:'business'},
  education:{bg:'#DCE4EA',template:'business'},
  coach:{bg:'#E5DED2',template:'business'},
  insurance:{bg:'#DDE4EA',template:'business'},
  finance:{bg:'#E3E0D7',template:'business'},
  travel:{bg:'#DDE6E0',template:'business'},
  fashion:{bg:'#E5D8D0',template:'product'},
  cafe:{bg:'#E1D5C5',template:'business'},
  ecommerce:{bg:'#E8E0D2',template:'product'},
  event:{bg:'#E6DDD6',template:'product'},
  pet:{bg:'#E0E4DA',template:'wellness'},
  automotive:{bg:'#D8DEE2',template:'business'}
};

const templatePresets={
  classic:{bg:'#E8DED0',scene:'phone'},
  luxury:{bg:'#151515',scene:'planner'},
  minimal:{bg:'#F3F1EB',scene:'poster'},
  wellness:{bg:'#DCE7DE',scene:'yoga'},
  business:{bg:'#DDE4EA',scene:'laptop'}
};

const formatSizes={
  square:[1200,1200],
  portrait:[1080,1350],
  landscape:[1600,900],
  story:[1080,1920],
  pin:[1000,1500]
};

const batchSceneList=[
 ['phone','Telefon'],['laptop','Laptop'],['planner','Planner'],['poster','Poster'],
 ['business','Business scena'],['fitness','Fitness scena'],['hotel','Hotel scena'],
 ['restaurant','Restoran scena'],['yoga','Yoga scena'],['beauty','Beauty scena'],
 ['office','Kancelarija'],['desk','Radni sto'],['product','Premium proizvod'],
 ['packaging','Ambalaža'],['social','Social media ekran'], ['realestate','Nekretnine'], ['salon','Salon lepote'], ['spa','Spa & Wellness'], ['clinic','Klinika'], ['dental','Stomatologija'], ['education','Edukacija'], ['coach','Coaching'], ['insurance','Osiguranje'], ['finance','Finansije'], ['travel','Putovanja'], ['fashion','Moda'], ['cafe','Cafe & Coffee'], ['ecommerce','E-commerce'], ['event','Event & Wedding'], ['pet','Pet biznis'], ['automotive','Auto biznis']
];
const batchFormatList=[
 ['square','Kvadrat 1200×1200'],['portrait','Portret 1080×1350'],
 ['landscape','Pejzaž 1600×900'],['story','Story / Reel 1080×1920'],
 ['pin','Pinterest 1000×1500']
];
function initBatchEngine(){
  const scenes=document.getElementById('batchScenes'), formats=document.getElementById('batchFormats');
  if(!scenes||!formats)return;
  scenes.innerHTML=batchSceneList.map(([id,label])=>`<label class="batch-option"><input type="checkbox" value="${id}" data-batch-scene> ${label}</label>`).join('');
  formats.innerHTML=batchFormatList.map(([id,label])=>`<label class="batch-option"><input type="checkbox" value="${id}" data-batch-format> ${label}</label>`).join('');
  document.getElementById('selectAllBatch')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.checked=true); updateBatchStatus();
  });
  document.getElementById('clearBatch')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.checked=false); updateBatchStatus();
  });
  document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.addEventListener('change',updateBatchStatus));
  document.getElementById('generateBatch')?.addEventListener('click',generateBatch);
document.getElementById('downloadBatchPngs')?.addEventListener('click',exportBatchPngs);
document.getElementById('downloadBatchZip')?.addEventListener('click',exportBatchZip);
  updateBatchStatus();
}
function getBatchSelections(){
  return {
    scenes:[...document.querySelectorAll('[data-batch-scene]:checked')].map(x=>x.value),
    formats:[...document.querySelectorAll('[data-batch-format]:checked')].map(x=>x.value)
  };
}
function updateBatchStatus(){
  const s=getBatchSelections(), el=document.getElementById('batchStatus');
  if(!el)return;
  const total=s.scenes.length*s.formats.length;
  el.textContent=total? `Biće pripremljeno ${total} mockup kombinacija.`:'Izaberi najmanje jednu scenu i jedan format.';
  el.classList.toggle('ready',!!total);
}
let lastBatch=[];
function slugify(value){return value.toLowerCase().replace(/[^a-z0-9\\u00C0-\\u017F]+/gi,'-').replace(/^-|-$/g,'');}
function getBatchImage(){
  const img=document.getElementById('previewImage');
  return img && img.src && img.src!=='about:blank' ? img : null;
}
function renderBatchCanvas(scene,format){
  const size=formatSizes[format]||formatSizes.square;
  const [canvasWidth,canvasHeight]=size;
  const canvas=document.createElement('canvas');
  canvas.width=canvasWidth; canvas.height=canvasHeight;
  const ctx=canvas.getContext('2d');
  const preset=lifestylePresets[scene];
  ctx.fillStyle=preset?.bg||bgColor.value||'#eee';
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  const img=getBatchImage();
  const scale=Math.min(canvasWidth,canvasHeight)*0.42;
  const iw=img?.naturalWidth||1, ih=img?.naturalHeight||1;
  const ratio=Math.min(scale/iw,scale/ih);
  const w=iw*ratio,h=ih*ratio;
  const x=(canvasWidth-w)/2,y=(canvasHeight-h)/2;
  if(img)ctx.drawImage(img,x,y,w,h);
  ctx.fillStyle='rgba(0,0,0,.08)';
  ctx.fillRect(0,canvasHeight-42,canvasWidth,42);
  ctx.fillStyle='#333';
  ctx.font=`600 ${Math.max(18,canvasWidth/55)}px Arial`;
  ctx.fillText(sceneNames[scene]||scene,24,canvasHeight-16);
  return canvas;
}
function createBatchFile(scene,format){
  const canvas=renderBatchCanvas(scene,format);
  return new Promise(resolve=>canvas.toBlob(blob=>resolve({
    blob,
    name:`${slugify(sceneNames[scene]||scene)}-${slugify(format)}.png`
  }),'image/png'));
}
async function exportBatchPngs(){
  const s=getBatchSelections();
  if(!s.scenes.length||!s.formats.length){updateBatchStatus();return;}
  const files=[];
  for(const scene of s.scenes)for(const format of s.formats)files.push(await createBatchFile(scene,format));
  files.forEach(file=>{
    const url=URL.createObjectURL(file.blob);
    const a=document.createElement('a');a.href=url;a.download=file.name;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  const status=document.getElementById('batchStatus');
  if(status)status.textContent=`Preuzeto ${files.length} PNG fajlova.`;
  lastBatch=files;
}
async function exportBatchZip(){
  const s=getBatchSelections();
  if(!s.scenes.length||!s.formats.length){updateBatchStatus();return;}
  const files=[];
  for(const scene of s.scenes)for(const format of s.formats)files.push(await createBatchFile(scene,format));
  if(!window.JSZip){
    const status=document.getElementById('batchStatus');
    if(status)status.textContent='ZIP modul nije učitan. PNG export je dostupan pojedinačno.';
    return;
  }
  const zip=new JSZip();
  files.forEach(file=>zip.file(file.name,file.blob));
  const blob=await zip.generateAsync({type:'blob'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='mockup-batch.zip';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  const status=document.getElementById('batchStatus');
  if(status)status.textContent=`ZIP paket je spreman: ${files.length} PNG fajlova.`;
  lastBatch=files;
}
function generateBatch(){
  const s=getBatchSelections(), results=document.getElementById('batchResults'), status=document.getElementById('batchStatus');
  if(!s.scenes.length||!s.formats.length){updateBatchStatus();return;}
  results.innerHTML='';
  const sceneLabel=id=>(batchSceneList.find(x=>x[0]===id)||[id,id])[1];
  const formatLabel=id=>(batchFormatList.find(x=>x[0]===id)||[id,id])[1];
  s.scenes.forEach(scene=>s.formats.forEach(format=>{
    const wide=['landscape','pin'].includes(format);
    const card=document.createElement('div'); card.className='batch-result';
    card.innerHTML=`<div class="batch-result-preview" style="background:${lifestylePresets[scene]?.bg||'#eee'}"><div class="mini-batch-object ${wide?'wide':''}"></div></div>      <strong>${sceneLabel(scene)}</strong><small>${formatLabel(format)}</small>`;
    results.appendChild(card);
  }));
  status.textContent=`Batch je pripremljen: ${s.scenes.length*s.formats.length} kombinacija.`;
}
function templateFrameFor(t){
  const map={phone:'glass',laptop:'studio',planner:'floating',poster:'depth',fitness:'floating',hotel:'studio',restaurant:'studio',yoga:'glass',beauty:'glass',social:'depth',office:'studio',desk:'depth',product:'floating',packaging:'depth',realestate:'studio',salon:'glass',spa:'glass',clinic:'studio',dental:'studio',education:'depth',coach:'floating',insurance:'studio',finance:'studio',travel:'depth',fashion:'glass',cafe:'studio',ecommerce:'depth',event:'glass',pet:'floating',automotive:'studio'};
  return map[t.scene]||'depth';
}
function templateFormatFor(t){
  return t.shape==='wide'?'landscape':t.shape==='tall'?'portrait':'square';
}
function applyLibraryTemplate(t){
  if(!t)return;
  sceneSelect.value=t.scene;
  bgColor.value=t.bg;
  mockupStage.style.background=t.bg;
  const fmt=templateFormatFor(t);
  formatSelect.value=fmt;
  const templateMap={phone:'classic',laptop:'business',planner:'luxury',poster:'minimal',fitness:'wellness',yoga:'wellness',beauty:'minimal',social:'minimal'};
  if(templateMap[t.scene])templateSelect.value=templateMap[t.scene];
  const frame=templateFrameFor(t);
  if(threeDFrameSelect){
    threeDFrameSelect.value=frame;
    apply3DFrame(frame);
  }
  const defaults={
    phone:[0,0,0],laptop:[-4,8,6],planner:[-6,10,8],poster:[-3,6,5],
    fitness:[-5,9,7],hotel:[-4,7,5],restaurant:[-5,8,6],yoga:[-3,7,5],
    beauty:[-5,10,7],social:[-7,12,8]
  };
  const d=defaults[t.scene]||[-4,7,5];
  perspectiveRange.value=d[2]; tiltXRange.value=d[0]; tiltYRange.value=d[1];
  perspective=Number(d[2]); tiltX=Number(d[0]); tiltY=Number(d[1]);
  updateTransform();
  setScene(t.scene);
  if(statusText)statusText.textContent=`Šablon „${t.name}“ je primenjen · ${sceneNames[t.scene]||t.scene} · ${formatLabelShort(fmt)} · ${frame} frame.`;
}
function applyLibraryTemplateFromUrl(){
  const id=new URLSearchParams(location.search).get('template');
  if(!id)return;
  const t=libraryTemplates?.find(x=>x.id===id);
  if(!t)return;
  applyLibraryTemplate(t);
}
function getFavorites(){
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');
}
function templateCategoryLabel(category){
  return ({device:'Uređaji',business:'Biznis',product:'Proizvod',wellness:'Wellness',social:'Društvene mreže',industry:'Industrije'})[category]||'3D šablon';
}
function renderMasterPromptLibrary(){
  const grid=document.getElementById('masterPromptGrid');
  if(!grid)return;
  grid.innerHTML=masterPrompts.map(p=>`<article class="master-prompt-card">
    <div class="master-prompt-top"><div><span class="master-prompt-kicker">MASTER GEOMETRIJA</span><h3>${p.name}</h3></div><span class="master-prompt-tag">${p.category}</span></div>
    <p>${p.description}</p>
    <textarea class="master-prompt-text" readonly aria-label="${p.name} prompt">${p.prompt}</textarea>
    <div class="master-prompt-actions"><button class="btn primary master-copy" type="button" data-prompt-id="${p.id}">Kopiraj master prompt</button><span class="master-copy-status" id="masterStatus-${p.id}"></span></div>
  </article>`).join('');
  grid.querySelectorAll('.master-copy').forEach(btn=>btn.addEventListener('click',async()=>{
    const p=masterPrompts.find(x=>x.id===btn.dataset.promptId);
    try{
      await navigator.clipboard.writeText(p.prompt);
      const status=document.getElementById('masterStatus-'+p.id);
      if(status)status.textContent='Kopirano ✓';
      setTimeout(()=>{if(status)status.textContent='';},1800);
    }catch(e){
      const ta=grid.querySelector('[data-prompt-id="'+p.id+'"]')?.closest('.master-prompt-card')?.querySelector('.master-prompt-text');
      if(ta){ta.focus();ta.select();}
    }
  }));
}

function renderTemplateLibrary(){
  if(!templateGrid)return;
  const query=(templateSearch?.value||'').trim().toLowerCase();
  const category=templateCategory?.value||'all';
  const onlyFavorites=favoritesOnly?.dataset.active==='true';
  const favorites=getFavorites();
  const list=libraryTemplates.filter(t=>{
    const matchesQuery=!query||t.name.toLowerCase().includes(query)||t.scene.toLowerCase().includes(query);
    const matchesCategory=category==='all'||t.category===category;
    const matchesFavorite=!onlyFavorites||favorites.includes(t.id);
    return matchesQuery&&matchesCategory&&matchesFavorite;
  });
  if(!list.length){templateGrid.innerHTML='<div class="template-empty">Nema šablona koji odgovaraju izboru.</div>';return;}
  templateGrid.innerHTML='';
  list.forEach(t=>{
    const card=document.createElement('article');
    card.className='template-card';
    const active=favorites.includes(t.id);
    const frame=templateFrameFor(t);
    const fmt=templateFormatFor(t);
    card.innerHTML=`<div class="template-preview ${t.shape} frame-${frame}" style="background:${t.bg}">
        <div class="template-badge">3D</div>
        <div class="mini-object ${t.shape}"></div>
        <div class="template-preview-label">${sceneNames[t.scene]||t.scene}</div>
      </div>
      <div class="template-meta">
        <div><strong>${t.name}</strong><small>${templateCategoryLabel(t.category)} · ${formatLabelShort(fmt)} · ${frame}</small></div>
        <button class="template-fav" type="button" aria-label="Favorit">${active?'♥':'♡'}</button>
      </div>
      <button class="btn primary template-use" type="button">Koristi šablon</button>`;
    card.querySelector('.template-fav').onclick=()=>{
      const next=getFavorites().filter(id=>id!==t.id);
      if(!active)next.push(t.id);
      localStorage.setItem(FAVORITES_KEY,JSON.stringify(next));
      renderTemplateLibrary();
renderMasterPromptLibrary();
    };
    card.querySelector('.template-use').onclick=()=>{
      applyLibraryTemplate(t);
      window.scrollTo({top:document.querySelector('.mockup-workspace').offsetTop-20,behavior:'smooth'});
    };
    templateGrid.appendChild(card);
  });
}

function updateTransform(){
  mockupObject.style.transform=`perspective(1400px) translate(${offsetX/2}%,${offsetY/2}%) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${objectScale/100}) rotate(${objectRotation}deg)`;
  scaleValue.textContent=`${objectScale}%`;
  rotateValue.textContent=`${objectRotation}°`;
  positionXValue.textContent=offsetX;
  positionYValue.textContent=offsetY;
  perspectiveValue.textContent=`${perspective}°`;
  tiltXValue.textContent=`${tiltX}°`;
  tiltYValue.textContent=`${tiltY}°`;
}

function renderImageStrip(){
  imageStrip.innerHTML='';
  images.forEach((item,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className=`image-thumb${index===activeImageIndex?' active':''}`;
    button.setAttribute('aria-label',`Izaberi sliku ${index+1}`);
    button.innerHTML=`<img src="${item.data}" alt=""><span class="thumb-index">${index+1}</span>`;
    button.addEventListener('click',()=>selectImage(index));
    imageStrip.appendChild(button);
  });
  uploadCount.textContent=`${images.length} ${images.length===1?'slika':'slike'}`;
}

function selectImage(index){
  if(!images[index])return;
  activeImageIndex=index;
  previewImage.src=images[index].data;
  previewImage.style.display='block';
  renderImageStrip();
renderTemplateLibrary();
initBatchEngine();
applyLibraryTemplateFromUrl();
renderSavedTemplates();
renderTemplateLibrary();
  statusText.textContent=`Aktivna je slika ${index+1} od ${images.length}.`;
}

function setScene(value){
  if(lifestylePresets[value] && templateSelect){
    const p=lifestylePresets[value];
    bgColor.value=p.bg;
    mockupStage.style.background=p.bg;
    templateSelect.value=p.template;
  }
  mockupObject.className=`mockup-object ${value}-object`;
  mockupStage.className=`mockup-stage scene-${value}`;
  sceneTitle.textContent=sceneNames[value]||'Mockup';
  sceneLabel.textContent=(sceneNames[value]||'DIGITAL SOUL STUDIO').toUpperCase();
  if(images.length)statusText.textContent=`Slika je postavljena u scenu: ${sceneNames[value]||value}.`;
}

function formatLabelShort(id){
  const labels={square:'Kvadrat',portrait:'Portret',landscape:'Pejzaž',story:'Story / Reel',pin:'Pinterest'};
  return labels[id]||id;
}
function sceneFormatFor(value){
  if(['laptop','business','fitness','hotel','restaurant','yoga','beauty','office','desk','product','packaging','realestate','salon','spa','clinic','dental','education','coach','insurance','finance','travel','fashion','cafe','ecommerce','event','pet','automotive'].includes(value)) return 'landscape';
  if(['social','phone'].includes(value)) return value==='social'?'story':'portrait';
  if(['planner','poster'].includes(value)) return 'portrait';
  return 'square';
}
function applyScenePreset(value){
  setScene(value);
  const fmt=sceneFormatFor(value);
  if(formatSelect)formatSelect.value=fmt;
  if(statusText)statusText.textContent=`Izabrana je scena: ${sceneNames[value]||value} · ${formatLabelShort(fmt)}.`;
}
function applyTemplate(value){
  const preset=templatePresets[value]||templatePresets.classic;
  bgColor.value=preset.bg;
  mockupStage.style.background=preset.bg;
  sceneSelect.value=preset.scene;
  setScene(preset.scene);
  statusText.textContent=`Primenen je šablon: ${templateSelect.options[templateSelect.selectedIndex].text}.`;
}

function getTemplateState(name){
  return {
    name,
    scene:sceneSelect.value, template:templateSelect.value, format:formatSelect.value,
    fit:fitSelect.value, bg:bgColor.value, scale:objectScale, rotation:objectRotation,
    x:offsetX, y:offsetY, perspective, tiltX, tiltY,
    width:Number(customWidth.value)||1200, height:Number(customHeight.value)||1200,
    custom:useCustomSize.checked
  };
}

function applyTemplateState(t){
  sceneSelect.value=t.scene||'phone';
  templateSelect.value=t.template||'classic';
  formatSelect.value=t.format||'square';
  fitSelect.value=t.fit||'cover';
  bgColor.value=t.bg||'#E8DED0';
  scaleRange.value=t.scale||100;
  rotateRange.value=t.rotation||0;
  positionX.value=t.x||0; positionY.value=t.y||0;
  perspectiveRange.value=t.perspective||0;
  tiltXRange.value=t.tiltX||0; tiltYRange.value=t.tiltY||0;
  customWidth.value=t.width||1200; customHeight.value=t.height||1200;
  useCustomSize.checked=!!t.custom;
  objectScale=Number(scaleRange.value); objectRotation=Number(rotateRange.value);
  offsetX=Number(positionX.value); offsetY=Number(positionY.value);
  perspective=Number(perspectiveRange.value); tiltX=Number(tiltXRange.value); tiltY=Number(tiltYRange.value);
  bgColor.dispatchEvent(new Event('input')); setFit(); setScene(sceneSelect.value); updateTransform();
}

function renderSavedTemplates(){
  const list=JSON.parse(localStorage.getItem(TEMPLATE_KEY)||'[]');
  savedTemplates.hidden=list.length===0;
  savedTemplates.innerHTML=list.length?'<strong>Moji sačuvani šabloni</strong>':'';
  list.forEach((t,i)=>{
    const row=document.createElement('div');
    row.className='saved-template';
    row.innerHTML=`<span>${t.name}</span><span><button type="button" data-load="${i}">Učitaj</button> <button type="button" data-delete="${i}">Obriši</button></span>`;
    row.querySelector('[data-load]').onclick=()=>{applyTemplateState(t);statusText.textContent=`Učitano: ${t.name}.`;};
    row.querySelector('[data-delete]').onclick=()=>{list.splice(i,1);localStorage.setItem(TEMPLATE_KEY,JSON.stringify(list));renderSavedTemplates();};
    savedTemplates.appendChild(row);
  });
}

function saveTemplate(){
  const name=window.prompt('Naziv šablona:',`Moj ${sceneNames[sceneSelect.value]||'mockup'}`);
  if(!name)return;
  const list=JSON.parse(localStorage.getItem(TEMPLATE_KEY)||'[]');
  list.unshift(getTemplateState(name.trim()));
  localStorage.setItem(TEMPLATE_KEY,JSON.stringify(list.slice(0,50)));
  renderSavedTemplates();
  statusText.textContent=`Šablon „${name.trim()}“ je sačuvan na ovom uređaju.`;
}

function setFit(){
  previewImage.classList.remove('fit-cover','fit-contain');
  previewImage.classList.add(`fit-${fitSelect.value}`);
}

function loadImages(files){
  const selected=Array.from(files).filter(file=>file.type.startsWith('image/')).slice(0,4);
  if(!selected.length){
    statusText.textContent='Izaberi slike u formatu PNG, JPG ili WEBP.';
    return;
  }
  const readers=selected.map(file=>new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=()=>resolve({data:reader.result,name:file.name});
    reader.readAsDataURL(file);
  }));
  Promise.all(readers).then(result=>{
    images=result;
    activeImageIndex=0;
    selectImage(0);
    statusText.textContent=`Učitano je ${images.length} ${images.length===1?'slika':'slike'}. Možeš izabrati aktivnu sliku ispod upload polja.`;
  });
}

function resetAll(){
  imageUpload.value='';
  images=[];
  activeImageIndex=0;
  previewImage.removeAttribute('src');
  previewImage.style.display='none';
  renderImageStrip();
  sceneSelect.value='phone';
  formatSelect.value='square';
  fitSelect.value='cover';
  scaleRange.value=100;
  rotateRange.value=0;
  positionX.value=0;
  positionY.value=0;
  bgColor.value='#E8DED0';
  objectScale=100;
  objectRotation=0;
  offsetX=0;
  offsetY=0;
  mockupStage.style.background=bgColor.value;
  setFit();
  setScene('phone');
  updateTransform();
  statusText.textContent='Prvo ubaci sliku.';
}

function roundedRect(ctx,x,y,w,h,r){
  const radius=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+radius,y);
  ctx.arcTo(x+w,y,x+w,y+h,radius);
  ctx.arcTo(x+w,y+h,x,y+h,radius);
  ctx.arcTo(x,y+h,x,y,radius);
  ctx.arcTo(x,y,x+w,y,radius);
  ctx.closePath();
}

function drawImageCover(ctx,img,x,y,w,h,fit,px,py){
  const ratio=fit==='contain'
    ? Math.min(w/img.width,h/img.height)
    : Math.max(w/img.width,h/img.height);
  const iw=img.width*ratio;
  const ih=img.height*ratio;
  const extraX=px*w*.0035;
  const extraY=py*h*.0035;
  ctx.drawImage(img,x+w/2-iw/2+extraX,y+h/2-ih/2+extraY,iw,ih);
}

function downloadMockup(){
  if(!images.length){
    statusText.textContent='Prvo ubaci sliku pre preuzimanja.';
    return;
  }

  const [presetWidth,presetHeight]=formatSizes[formatSelect.value]||formatSizes.square;
  const width=useCustomSize.checked?Math.max(300,Math.min(4000,Number(customWidth.value)||1200)):presetWidth;
  const height=useCustomSize.checked?Math.max(300,Math.min(4000,Number(customHeight.value)||1200)):presetHeight;
  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=bgColor.value;
  ctx.fillRect(0,0,width,height);

  const type=sceneSelect.value;
  const configs={
    phone:{x:width*.39,y:height*.12,w:width*.22,h:height*.58,r:30},
    laptop:{x:width*.22,y:height*.25,w:width*.56,h:height*.42,r:14},
    planner:{x:width*.33,y:height*.15,w:width*.34,h:height*.58,r:5},
    poster:{x:width*.33,y:height*.12,w:width*.34,h:height*.65,r:5},
    business:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    office:{x:width*.27,y:height*.30,w:width*.46,h:height*.40,r:10},
    desk:{x:width*.25,y:height*.30,w:width*.50,h:height*.40,r:7},
    product:{x:width*.34,y:height*.22,w:width*.32,h:height*.48,r:20},
    packaging:{x:width*.34,y:height*.17,w:width*.32,h:height*.62,r:5},
    social:{x:width*.38,y:height*.13,w:width*.24,h:height*.62,r:16},
    fitness:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    hotel:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    restaurant:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    yoga:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    beauty:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    realestate:{x:width*.25,y:height*.26,w:width*.50,h:height*.40,r:8},
    salon:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:10},
    spa:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:12},
    clinic:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:8},
    dental:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:8},
    education:{x:width*.25,y:height*.25,w:width*.50,h:height*.42,r:8},
    coach:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:10},
    insurance:{x:width*.25,y:height*.26,w:width*.50,h:height*.40,r:8},
    finance:{x:width*.25,y:height*.26,w:width*.50,h:height*.40,r:8},
    travel:{x:width*.25,y:height*.24,w:width*.50,h:height*.44,r:8},
    fashion:{x:width*.30,y:height*.22,w:width*.40,h:height*.50,r:10},
    cafe:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:10},
    ecommerce:{x:width*.28,y:height*.25,w:width*.44,h:height*.48,r:8},
    event:{x:width*.27,y:height*.25,w:width*.46,h:height*.44,r:10},
    pet:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:10},
    automotive:{x:width*.24,y:height*.28,w:width*.52,h:height*.38,r:8}
  };
  const c=configs[type]||configs.phone;  const img=new Image();

  img.onload=()=>{
    ctx.save();
    ctx.globalAlpha=.15;
    ctx.fillStyle='#173C32';
    ctx.beginPath();ctx.arc(width*.1,height*.1,Math.min(width,height)*.16,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#C8A96B';
    ctx.beginPath();ctx.arc(width*.92,height*.9,Math.min(width,height)*.19,0,Math.PI*2);ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(c.x+c.w/2+offsetX*c.w*.0035,c.y+c.h/2+offsetY*c.h*.0035);
    ctx.rotate(objectRotation*Math.PI/180);
    const scale=objectScale/100;
    ctx.scale(scale,scale);
    ctx.shadowColor='rgba(0,0,0,.28)';
    ctx.shadowBlur=45;
    ctx.shadowOffsetY=25;
    ctx.fillStyle=type==='phone'||type==='laptop'?'#181918':'#fff';
    roundedRect(ctx,-c.w/2,-c.h/2,c.w,c.h,c.r);
    ctx.fill();
    ctx.shadowColor='transparent';

    const pad=(type==='phone'||type==='laptop')?12:0;
    ctx.save();
    roundedRect(ctx,-c.w/2+pad,-c.h/2+pad,c.w-pad*2,c.h-pad*2,Math.max(2,c.r-6));
    ctx.clip();
    drawImageCover(ctx,img,-c.w/2+pad,-c.h/2+pad,c.w-pad*2,c.h-pad*2,fitSelect.value,offsetX,offsetY);
    ctx.restore();
    ctx.restore();

    ctx.fillStyle='rgba(23,60,50,.65)';
    ctx.font='700 14px Montserrat, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('DIGITAL SOUL STUDIO',width/2,height*.93);

    const link=document.createElement('a');
    link.download=`digital-soul-mockup-${type}-${formatSelect.value}.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
    statusText.textContent='Mockup je spreman za preuzimanje.';
  };
  img.src=images[activeImageIndex].data;
}

imageUpload.addEventListener('change',e=>loadImages(e.target.files));
sceneSelect.addEventListener('change',e=>applyScenePreset(e.target.value));
templateSelect.addEventListener('change',e=>applyTemplate(e.target.value));
formatSelect.addEventListener('change',()=>{
  statusText.textContent=`Izabran format: ${formatSelect.options[formatSelect.selectedIndex].text}.`;
});
fitSelect.addEventListener('change',setFit);
scaleRange.addEventListener('input',e=>{objectScale=Number(e.target.value);updateTransform();});
rotateRange.addEventListener('input',e=>{objectRotation=Number(e.target.value);updateTransform();});
positionX.addEventListener('input',e=>{offsetX=Number(e.target.value);updateTransform();});
positionY.addEventListener('input',e=>{offsetY=Number(e.target.value);updateTransform();});
perspectiveRange.addEventListener('input',e=>{perspective=Number(e.target.value);updateTransform();});
tiltXRange.addEventListener('input',e=>{tiltX=Number(e.target.value);updateTransform();});
tiltYRange.addEventListener('input',e=>{tiltY=Number(e.target.value);updateTransform();});
bgColor.addEventListener('input',e=>{mockupStage.style.background=e.target.value;});
resetBtn.addEventListener('click',resetAll);
saveTemplateBtn.addEventListener('click',saveTemplate);
templateSearch?.addEventListener('input',renderTemplateLibrary);
templateCategory?.addEventListener('change',renderTemplateLibrary);
favoritesOnly?.addEventListener('click',()=>{
  const active=favoritesOnly.dataset.active==='true';
  favoritesOnly.dataset.active=String(!active);
  favoritesOnly.textContent=!active?'♥ Favoriti':'♡ Favoriti';
  renderTemplateLibrary();
});
myTemplatesBtn.addEventListener('click',()=>{savedTemplates.hidden=!savedTemplates.hidden;renderSavedTemplates();});
downloadBtn.addEventListener('click',downloadMockup);

mockupStage.style.background=bgColor.value;
useCustomSize.addEventListener('change',()=>{statusText.textContent=useCustomSize.checked?'Prilagođena veličina je uključena.':'Koristi se izabrani format.';});
setFit();
updateTransform();
renderImageStrip();

function hydrateMockupFromProduction(){
  const params=new URLSearchParams(location.search);
  const title=params.get('title');
  if(!title)return;
  const format=params.get('format');
  const formatMap={'Objava':'square','Story':'story','Reel / TikTok':'story','Pin':'pin','Email':'portrait','Blog':'landscape','Oglas':'square'};
  const mapped=formatMap[format];
  if(mapped&&formatSelect)formatSelect.value=mapped;
  const channel=params.get('channel');
  const goal=params.get('goal');
  const brief=params.get('brief');
  const details=[channel,goal,brief].filter(Boolean).join(' · ');
  statusText.textContent=details
    ? `Brief „${title}“ je prenet iz Content Production: ${details}`
    : `Brief „${title}“ je prenet iz Content Production.`;
  if(formatSelect&&mapped)statusText.textContent+=` Format: ${formatSelect.options[formatSelect.selectedIndex].text}.`;
}
hydrateMockupFromProduction();\n
const threeDFrameSelect=document.getElementById('threeDFrameSelect');
function apply3DFrame(value){
  if(!mockupStage)return;
  mockupStage.dataset.frame=value;
  if(statusText)statusText.textContent=`3D Frame: ${({depth:'Deep 3D',glass:'Glass Frame',floating:'Floating',studio:'Studio Frame'})[value]||value}.`;
}
threeDFrameSelect?.addEventListener('change',e=>apply3DFrame(e.target.value));
const aiCamera=document.getElementById('aiCamera');
const aiLighting=document.getElementById('aiLighting');
const aiQuality=document.getElementById('aiQuality');
const ai3DPrompt=document.getElementById('ai3DPrompt');
const ai3DNegative=document.getElementById('ai3DNegative');
const generateAI3DBrief=document.getElementById('generateAI3DBrief');
const copyAI3DPrompt=document.getElementById('copyAI3DPrompt');
const copyAI3DNegative=document.getElementById('copyAI3DNegative');

function generateAI3DBriefText(){
  const product=threeDProduct?.value||'digital product';
  const scene=threeDScene?.value||'planner';
  const style=threeDStyles[threeDStyle?.value]||threeDStyles['luxury editorial'];
  const camera=aiCamera?.value||'three-quarter product shot';
  const lighting=aiLighting?.value||'soft natural window light';
  const quality=aiQuality?.value||'photorealistic commercial quality';
  const sceneLabelText=sceneNames[scene]||scene;
  const format=formatSelect?.options[formatSelect.selectedIndex]?.text||'square';
  const prompt=`${product} presented in a ${sceneLabelText} environment, ${camera}, ${style}, ${lighting}, ${quality}, realistic depth and perspective, physically accurate materials, natural contact shadows, subtle ambient occlusion, realistic reflections, premium commercial product photography, clean composition, ${format}, the uploaded product design remains sharp, centered and recognizable, no alterations to the product artwork`;
  const negative='distorted product, warped artwork, unreadable text, misspelled text, duplicate objects, extra fingers, deformed geometry, floating object, excessive reflections, harsh artifacts, low resolution, blurry edges, cropped product, cluttered background, watermark, logo replacement';
  if(ai3DPrompt)ai3DPrompt.value=prompt;
  if(ai3DNegative)ai3DNegative.value=negative;
  if(statusText)statusText.textContent='AI 3D generation brief je spreman. Trenutno je ovo generation-ready prototip.';
}
function copyAIField(el,label){
  if(!el?.value)return;
  navigator.clipboard?.writeText(el.value).then(()=>{if(statusText)statusText.textContent=label+' je kopiran.'}).catch(()=>{el.select();document.execCommand('copy');if(statusText)statusText.textContent=label+' je kopiran.'});
}
generateAI3DBrief?.addEventListener('click',generateAI3DBriefText);
copyAI3DPrompt?.addEventListener('click',()=>copyAIField(ai3DPrompt,'Prompt'));
copyAI3DNegative?.addEventListener('click',()=>copyAIField(ai3DNegative,'Negative prompt'));
\n
const threeDProfiles={
  planner:{scene:'planner',format:'square',perspective:8,tiltX:-6,tiltY:10,bg:'#151515'},
  business:{scene:'office',format:'landscape',perspective:6,tiltX:-4,tiltY:8,bg:'#D9DDD7'},
  fitness:{scene:'fitness',format:'landscape',perspective:7,tiltX:-5,tiltY:9,bg:'#DCE7DE'},
  hotel:{scene:'hotel',format:'landscape',perspective:5,tiltX:-4,tiltY:7,bg:'#E5DED2'},
  restaurant:{scene:'restaurant',format:'landscape',perspective:6,tiltX:-5,tiltY:8,bg:'#E1D5C5'},
  yoga:{scene:'yoga',format:'landscape',perspective:5,tiltX:-3,tiltY:7,bg:'#DCE7DE'},
  beauty:{scene:'beauty',format:'landscape',perspective:7,tiltX:-5,tiltY:10,bg:'#E8DDE0'},
  social:{scene:'social',format:'story',perspective:8,tiltX:-7,tiltY:12,bg:'#E1E7E3'}
};
const threeDStyles={
  'luxury editorial':'premium editorial photography, sophisticated luxury aesthetic, refined materials, soft directional lighting',
  'minimal premium':'minimal premium product photography, clean composition, controlled studio lighting, generous negative space',
  'feminine elegant':'elegant feminine aesthetic, refined details, soft editorial lighting, sophisticated styling',
  'corporate modern':'modern corporate visual language, polished office environment, realistic commercial lighting',
  'dark premium':'dark premium aesthetic, dramatic studio lighting, subtle reflections, high-end commercial photography',
  'soft natural':'soft natural aesthetic, warm daylight, calm atmosphere, realistic gentle shadows'
};
const build3DPreset=document.getElementById('build3DPreset');
const build3DPromptBtn=document.getElementById('build3DPrompt');
const copy3DPrompt=document.getElementById('copy3DPrompt');
const threeDProduct=document.getElementById('threeDProduct');
const threeDScene=document.getElementById('threeDScene');
const threeDStyle=document.getElementById('threeDStyle');
const threeDPrompt=document.getElementById('threeDPrompt');
function generate3DPrompt(){
  const product=threeDProduct?.value||'digital product';
  const scene=threeDScene?.value||'planner';
  const style=threeDStyles[threeDStyle?.value]||threeDStyles['luxury editorial'];
  const sceneLabelText=sceneNames[scene]||scene;
  const prompt=`${product} mockup in a ${sceneLabelText} scene, realistic 3D product presentation, three-quarter perspective, visible depth, natural contact shadows, ${style}, realistic materials, professional product photography, clean composition, no distorted text, no extra objects covering the product, high detail, commercial quality`;
  if(threeDPrompt)threeDPrompt.value=prompt;
  if(statusText)statusText.textContent='3D prompt je spreman za generisanje.';
  return prompt;
}
function apply3DPreset(){
  const profile=threeDProfiles[threeDScene?.value]||threeDProfiles.planner;
  if(sceneSelect)sceneSelect.value=profile.scene;
  if(formatSelect)formatSelect.value=profile.format;
  if(bgColor)bgColor.value=profile.bg;
  if(perspectiveRange)perspectiveRange.value=profile.perspective;
  if(tiltXRange)tiltXRange.value=profile.tiltX;
  if(tiltYRange)tiltYRange.value=profile.tiltY;
  perspective=profile.perspective; tiltX=profile.tiltX; tiltY=profile.tiltY;
  setScene(profile.scene);
  mockupStage.style.background=profile.bg;
  updateTransform();
  generate3DPrompt();
  if(statusText)statusText.textContent='3D scena je primenjena. Možeš odmah ubaciti svoju sliku.';
}
build3DPreset?.addEventListener('click',apply3DPreset);
build3DPromptBtn?.addEventListener('click',generate3DPrompt);
copy3DPrompt?.addEventListener('click',async()=>{
  const value=generate3DPrompt();
  try{await navigator.clipboard.writeText(value);statusText.textContent='Prompt je kopiran.';}
  catch(e){threeDPrompt?.select();document.execCommand('copy');statusText.textContent='Prompt je kopiran.';}
});

