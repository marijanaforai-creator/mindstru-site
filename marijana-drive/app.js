function showToast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
function focusCaption(){document.getElementById('caption-editor').scrollIntoView({behavior:'smooth'});setTimeout(()=>document.getElementById('topic').focus(),450)}
function generateDraft(){
  const topic=document.getElementById('topic').value.trim();
  const platform=document.getElementById('platform').value;
  const goal=document.getElementById('goal').value;
  const tone=document.getElementById('tone').value;
  const context=document.getElementById('context').value.trim();
  if(!topic){showToast('Prvo napiši temu ili ideju.');focusCaption();return}
  let text=''+topic+'\n\n';
  text+='Ako ti je ovo trenutno važno, zastani na trenutak i pogledaj šta se zaista dešava.\n\n';
  text+='Ne moraš sve rešiti odjednom. Izaberi jednu stvar koju možeš da uradiš sada i kreni od nje.\n\n';
  if(context) text+=context+'\n\n';
  if(goal==='Prodaja'||goal==='Promocija proizvoda') text+='Ako želiš da saznaš više, pogledaj ponudu i izaberi ono što ti trenutno najviše odgovara.\n\n';
  else text+='Sačuvaj ovu objavu ako želiš da joj se vratiš kasnije.\n\n';
  text+='Šta bi ti dodala iz svog iskustva?';
  document.getElementById('caption-output').value=text;
  document.getElementById('preview-platform').textContent=platform;
  document.getElementById('draft-state').textContent='Nacrt spreman';
  showToast('Nacrt je napravljen — sada ga pročitaj i izmeni.');
}
function addPersonal(){
  const extra=document.getElementById('personal').value.trim();
  const out=document.getElementById('caption-output');
  if(!extra){showToast('Napiši prvo svoj dodatak.');return}
  out.value=out.value.trim()+'\n\n'+extra;
  document.getElementById('personal').value='';
  showToast('Tvoj dodatak je ubačen u tekst.');
}
function transformText(type){
  const out=document.getElementById('caption-output');
  if(!out.value.trim()){showToast('Prvo napravi ili napiši tekst.');return}
  if(type==='short'){out.value=out.value.split('\n\n').slice(0,3).join('\n\n');showToast('Tekst je skraćen.')}
  if(type==='personal'){out.value=out.value.replace('Ako ti je ovo trenutno važno,','Ako se i ti trenutno pronalaziš u ovome,');showToast('Ton je pomeren ka ličnijem.')}
  if(type==='clear'){out.value=out.value.replace(/\n\nŠta bi ti dodala iz svog iskustva\?$/,'').replace(/\n{3,}/g,'\n\n');showToast('Višak je očišćen.')}
}
function removeLastParagraph(){
  const out=document.getElementById('caption-output');
  const parts=out.value.trim().split(/\n\n+/);
  if(parts.length>1){parts.pop();out.value=parts.join('\n\n');showToast('Poslednji deo je uklonjen.')}else showToast('Nema dodatnog dela za izbacivanje.');
}
function clearEditor(){['topic','context','personal','caption-output'].forEach(id=>document.getElementById(id).value='');document.getElementById('draft-state').textContent='Novi nacrt';showToast('Editor je spreman za novi sadržaj.')}
function approveDraft(){if(!document.getElementById('caption-output').value.trim()){showToast('Nema sadržaja za odobravanje.');return}document.getElementById('draft-state').textContent='Odobreno';showToast('Sadržaj je odobren za zakazivanje.')}
function scheduleDraft(){const text=document.getElementById('caption-output').value.trim(),date=document.getElementById('schedule-date').value;if(!text){showToast('Prvo napravi i odobri sadržaj.');return}if(document.getElementById('draft-state').textContent!=='Odobreno'){showToast('Prvo klikni „Odobri sadržaj“.');return}if(!date){showToast('Izaberi datum i vreme.');return}showToast('Zakazivanje je sačuvano kao prototip.')}
document.getElementById('platform').addEventListener('change',e=>document.getElementById('preview-platform').textContent=e.target.value);
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));item.classList.add('active')}));

function importProductSystem(){const raw=localStorage.getItem('marijanaProductSystem');if(!raw){showToast('Nema sačuvanog Product System paketa. Prvo ga napravi u AI Studio.');return}try{const d=JSON.parse(raw);const s=d.sections||d;document.getElementById('drive-product-name').textContent=d.name||'Novi proizvod';document.getElementById('drive-product-status').textContent=d.status||'Paket učitan';document.getElementById('drive-product-preview').value=[s.product,s.sales,s.seo,s.pinterest,s.social,s.email,s.mockup,s.drive].filter(Boolean).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');showToast('Product System je učitan u Marijana Drive.')}catch(e){showToast('Paket nije moguće učitati.');}}
function loadProductProjects(){const el=document.getElementById('drive-project-list');if(!el)return;try{const projects=JSON.parse(localStorage.getItem('marijanaProductProjects')||'[]');el.innerHTML=projects.length?projects.slice(0,12).map(p=>'<button class="project-row" onclick="loadProductProject(\''+String(p.id).replace(/'/g,'')+'\')"><strong>'+String(p.name||'Novi proizvod').replace(/</g,'&lt;')+'</strong><small>'+new Date(p.createdAt).toLocaleDateString('sr-RS')+' · '+String(p.status||'').replace(/</g,'&lt;')+'</small></button>').join(''):'<div class="empty-state">Još nema sačuvanih Product System projekata.</div>';}catch(e){el.textContent='Nije moguće učitati projekte.'}}
function loadProductProject(id){const projects=JSON.parse(localStorage.getItem('marijanaProductProjects')||'[]');const p=projects.find(x=>x.id===id);if(!p)return;localStorage.setItem('marijanaProductSystem',JSON.stringify(p));importProductSystem();}


document.addEventListener('DOMContentLoaded',loadProductProjects);


/* CLOUD DRIVE ADAPTER */
async function loadCloudDriveProjects(){
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});
    if(!r.ok)return false;
    const d=await r.json();
    if(Array.isArray(d.projects)){
      const projects=d.projects.map(p=>({
        id:p.id,name:p.name,createdAt:p.created_at,status:p.status,
        type:p.data?.type||p.type,audience:p.data?.audience||'',
        goal:p.data?.goal||'',offer:p.data?.offer||'',
        sections:p.data?.sections||{}
      }));
      localStorage.setItem('marijanaProductProjects',JSON.stringify(projects));
      loadProductProjects();
      return true;
    }
  }catch(e){}
  return false;
}

async function loadDriveAssets(projectId){
  try{
    const url=projectId?'/api/assets?project_id='+encodeURIComponent(projectId):'/api/assets';
    const r=await fetch(url,{credentials:'same-origin'});
    if(!r.ok)return [];
    const d=await r.json();
    return Array.isArray(d.assets)?d.assets:[];
  }catch(e){return []}
}

async function registerDriveAsset(asset){
  const r=await fetch('/api/assets',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify(asset)
  });
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||'Asset nije sačuvan.');
  return d.asset;
}

async function deleteDriveAsset(id){
  const r=await fetch('/api/assets/'+encodeURIComponent(id),{
    method:'DELETE',
    credentials:'same-origin'
  });
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||'Asset nije obrisan.');
  return d;
}

async function getDriveStructure(){
  try{
    const r=await fetch('/api/drive/structure',{credentials:'same-origin'});
    if(!r.ok)return [];
    const d=await r.json();
    return Array.isArray(d.folders)?d.folders:[];
  }catch(e){return []}
}

async function recordDriveUsage(feature,quantity=1,metadata={}){
  try{
    await fetch('/api/usage',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'same-origin',
      body:JSON.stringify({feature,quantity,metadata})
    });
  }catch(e){}
}

document.addEventListener('DOMContentLoaded',async()=>{
  const ok=await loadCloudDriveProjects();
  if(ok)showToast('Marijana Drive je povezan sa cloud projektima.');
});


async function loadCreatorProjects(){
  const el=document.getElementById('creator-project-list');if(!el)return;
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});if(!r.ok)throw new Error('auth');
    const d=await r.json();
    const projects=(d.projects||[]).filter(p=>p.type==='creator_document'||p.data?.source==='Biblioteka šablona').slice(0,20);
    el.innerHTML=projects.length?projects.map(p=>'<a class="project-row" href="../marijana-workspace/index.html?project='+encodeURIComponent(p.id)+'#creator-editor"><strong>'+String(p.name||'Creator projekat').replace(/</g,'&lt;')+'</strong><small>'+new Date(p.updated_at||p.created_at).toLocaleDateString('sr-RS')+' · '+String(p.status||'').replace(/</g,'&lt;')+'</small></a>').join(''):'<div class="empty-state">Još nema sačuvanih Creator projekata.</div>';
  }catch(e){el.innerHTML='<div class="empty-state">Prijavi se da vidiš Creator projekte.</div>'}
}
document.addEventListener('DOMContentLoaded',loadCreatorProjects);
let driveProjects=[];
let driveFolders=[];
async function loadDriveFileManager(){
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});if(r.ok){const d=await r.json();driveProjects=d.projects||[]}
    driveFolders=await getDriveStructure();renderDriveFiles();
  }catch(e){renderDriveFiles()}
}
function renderDriveFiles(){
 const el=document.getElementById('drive-file-list');if(!el)return;
 const q=(document.getElementById('drive-search')?.value||'').toLowerCase(), f=document.getElementById('drive-filter')?.value||'all';
 const items=[];
 driveFolders.forEach(x=>items.push({id:x.id,name:x.name,type:'folder',date:x.updated_at||x.created_at}));
 driveProjects.forEach(x=>items.push({id:x.id,name:x.name,type:x.type,date:x.updated_at||x.created_at,status:x.status}));
 const list=items.filter(x=>(f==='all'||x.type===f)&&(x.name||'').toLowerCase().includes(q));
 el.innerHTML=list.length?list.map(x=>'<article class="drive-file-card '+(x.type==='folder'?'folder-card':'')+'"><div class="file-icon">'+(x.type==='folder'?'▰':'▤')+'</div><h4>'+escapeHtml(x.name||'Bez naziva')+'</h4><small>'+escapeHtml(x.type==='creator_document'?'Creator dokument':x.type==='folder'?'Folder':x.type||'Projekat')+(x.date?' · '+new Date(x.date).toLocaleDateString('sr-RS'):'')+'</small><div class="drive-file-actions">'+(x.type==='creator_document'?'<button class="primary" onclick="location.href=\'../marijana-workspace/index.html?project='+encodeURIComponent(x.id)+'#creator-editor\'">Otvori</button>':'')+(x.type!=='folder'?'<button class="secondary" onclick="renameDriveProject(\''+x.id+'\')">Preimenuj</button>':'')+(x.type==='folder'?'<button class="secondary" onclick="renameDriveFolder(\''+x.id+'\')">Preimenuj</button>':'')+'</div></article>').join(''):'<div class="empty-state">Nema rezultata za ovu pretragu.</div>';
}
async function renameDriveProject(id){const p=driveProjects.find(x=>x.id===id);if(!p)return;const n=prompt('Novi naziv:',p.name);if(!n||n.trim()===p.name)return;const r=await fetch('/api/projects/'+encodeURIComponent(id),{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name:n.trim()})});if(r.ok){p.name=n.trim();renderDriveFiles();loadCreatorProjects();showToast('Preimenovano.');}}
async function createDriveFolder(){const n=prompt('Naziv novog foldera:','Novi folder');if(!n?.trim())return;try{const r=await fetch('/api/drive/folders',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name:n.trim()})});if(!r.ok)throw new Error();driveFolders=await getDriveStructure();renderDriveFiles();showToast('Folder je napravljen.')}catch(e){showToast('Folder nije moguće napraviti. Proveri prijavu.');}}
async function renameDriveFolder(id){const n=prompt('Novi naziv foldera:');if(!n?.trim())return;try{const r=await fetch('/api/drive/folders/'+encodeURIComponent(id),{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name:n.trim()})});if(!r.ok)throw new Error();driveFolders=await getDriveStructure();renderDriveFiles();showToast('Folder je preimenovan.')}catch(e){showToast('Preimenovanje foldera nije uspelo.');}}
document.addEventListener('DOMContentLoaded',loadDriveFileManager);
