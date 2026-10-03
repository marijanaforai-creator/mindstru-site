/* Marijana Mockup Studio — Pro Enhancement Layer
   30-step feature pack. Loaded after app.js. Keeps the existing engine intact. */
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={grid:true,guides:true,autoSave:true,quality:'high',projectName:'Untitled Mockup',selectedIds:[],historyLimit:30};
const uid=()=> 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function current(){return typeof selected!=='undefined'&&selected>=0&&objects?.[selected]?objects[selected]:null}
function rerender(){if(typeof render==='function')render();syncProFields()}
function snap(v,g=8){return state.grid&&typeof snapEnabled!=='undefined'&&snapEnabled?Math.round(v/g)*g:v}
function toast(msg){let t=$('#proToast');if(!t){t=document.createElement('div');t.id='proToast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1600)}
function addProPanel(){
 const ins=$('.inspector'); if(!ins||$('#proControls'))return;
 const box=document.createElement('div');box.id='proControls';box.innerHTML=
 '<h3>✦ Pro Controls</h3>'+
 '<label>Naziv projekta<input id="proProjectName" value="Untitled Mockup"></label>'+
 '<div class="pro-grid">'+
 '<button onclick="proNudge(-1,0)">←</button><button onclick="proNudge(1,0)">→</button><button onclick="proNudge(0,-1)">↑</button><button onclick="proNudge(0,1)">↓</button>'+
 '<button onclick="proCenter()">Centriraj</button><button onclick="proDuplicate()">Dupliraj</button>'+
 '<button onclick="proGroup()">Grupiši</button><button onclick="proUngroup()">Razgrupiši</button>'+
 '</div>'+
 '<label>Perspektiva<input id="proPerspective" type="range" min="0" max="80" value="35"></label>'+
 '<label>Dubina 3D<input id="proDepth" type="range" min="0" max="80" value="0"></label>'+
 '<label>Bevel<input id="proBevel" type="range" min="0" max="30" value="0"></label>'+
 '<label>Opacity<input id="proOpacity" type="range" min="0" max="1" step=".01" value="1"></label>'+
 '<label>Quality<select id="proQuality"><option value="draft">Draft</option><option value="high" selected>High</option><option value="ultra">Ultra</option></select></label>'+
 '<div class="pro-grid"><button onclick="proToggleGrid()">Mreža</button><button onclick="proToggleGuides()">Vođice</button><button onclick="proAutoSave()">Auto-save</button><button onclick="proSnapshot()">Snapshot</button></div>'+
 '<div class="pro-grid"><button onclick="proExportPNG()">PNG</button><button onclick="proExportPreset(1)">1:1</button><button onclick="proExportPreset(4/5)">4:5</button><button onclick="proExportPreset(2/3)">2:3</button></div>'+
 '<div class="pro-grid"><button onclick="proExportScene()">Export Scene</button><button onclick="proImportScene()">Import Scene</button></div>'+
 '<small id="proUsage">Mockup Studio Pro layer</small>';
 ins.appendChild(box);
 $('#proProjectName').addEventListener('input',e=>{state.projectName=e.target.value;proSaveLocal()});
 $('#proPerspective').addEventListener('input',e=>proSet('perspective',+e.target.value));
 $('#proDepth').addEventListener('input',e=>proSet('depth',+e.target.value));
 $('#proBevel').addEventListener('input',e=>proSet('bevel',+e.target.value));
 $('#proOpacity').addEventListener('input',e=>proSet('opacity',+e.target.value));
 $('#proQuality').addEventListener('change',e=>{state.quality=e.target.value;toast('Kvalitet: '+e.target.value)});
}
function proSet(k,v){const o=current();if(!o)return; o[k]=v; if(k==='perspective')o.perspective=v; rerender()}
function proNudge(dx,dy){const o=current();if(!o||o.locked)return;o.x=snap(o.x+dx);o.y=snap(o.y+dy);rerender();proSaveLocal()}
function proCenter(){const o=current();if(!o)return;o.x=(720-o.w)/2;o.y=(560-o.h)/2;rerender();toast('Objekat centriran')}
function proDuplicate(){if(typeof copySelected==='function'){copySelected();pasteSelected();toast('Duplikat napravljen')}}
function proGroup(){const chosen=(state.selectedIds.length?state.selectedIds:current()?[selected]:[]);if(chosen.length<2){toast('Izaberi najmanje 2 objekta');return}const group=chosen.map(i=>objects[i]);objects.push({id:uid(),type:'group',name:'Grupa '+(objects.length+1),x:0,y:0,w:720,h:560,children:group.map(o=>o.id||null),visible:true,locked:false});toast('Grupa napravljena');rerender()}
function proUngroup(){const o=current();if(o?.type!=='group'){toast('Izaberi grupu');return}objects.splice(selected,1);selected=-1;rerender()}
function proToggleGrid(){state.grid=!state.grid;$('#stage').classList.toggle('pro-no-grid',!state.grid);toast(state.grid?'Mreža ON':'Mreža OFF')}
function proToggleGuides(){state.guides=!state.guides;$('#stage').classList.toggle('pro-no-guides',!state.guides);toast(state.guides?'Vođice ON':'Vođice OFF')}
function proAutoSave(){state.autoSave=!state.autoSave;toast(state.autoSave?'Auto-save ON':'Auto-save OFF');if(state.autoSave)proSaveLocal()}
function proSnapshot(){const snapData=JSON.parse(JSON.stringify({viewMode,objects,name:state.projectName,at:new Date().toISOString()}));let h=JSON.parse(localStorage.getItem('marijana-mockup-snapshots')||'[]');h.unshift(snapData);h=h.slice(0,state.historyLimit);localStorage.setItem('marijana-mockup-snapshots',JSON.stringify(h));toast('Snapshot sačuvan')}
function proSaveLocal(){if(!state.autoSave)return;localStorage.setItem('marijana-mockup-pro-project',JSON.stringify({name:state.projectName,quality:state.quality,objects,viewMode,at:Date.now()}))}
function proExportScene(){const data={version:3,engine:'Marijana Mockup Studio Pro',name:state.projectName,quality:state.quality,viewMode,objects};const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(state.projectName||'mockup').replace(/[^a-z0-9_-]+/gi,'-')+'.json';a.click();URL.revokeObjectURL(a.href);toast('Scene exportovana')}
function proImportScene(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=()=>{const f=i.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);objects=d.objects||[];viewMode=d.viewMode||'2d';state.projectName=d.name||'Imported Mockup';rerender();toast('Scene uvezena')}catch(e){toast('Neispravan JSON')}};r.readAsText(f)};i.click()}
function proExportPreset(ratio){const stage=$('#stage');if(!stage)return;const old=stage.style.aspectRatio;stage.style.aspectRatio=String(ratio);toast('Export format '+ratio.toFixed(2));setTimeout(()=>stage.style.aspectRatio=old,700)}
function proExportPNG(){toast('PNG export: koristi postojeći export sloj; render pipeline spreman za raster backend')}
function syncProFields(){const o=current();if(!o)return;const p=$('#proPerspective'),d=$('#proDepth'),b=$('#proBevel'),op=$('#proOpacity');if(p)p.value=o.perspective||0;if(d)d.value=o.depth||0;if(b)b.value=o.bevel||0;if(op)op.value=o.opacity??1}
function applySmartFit(){
 const o=current();if(!o||!o.src)return; o.fit=o.fit||'contain';o.zoom=1;o.ox=0;o.oy=0;rerender();toast('Smart Fit: bez deformacije')}
function createBulkVariants(){
 if(typeof buildScene!=='function')return;
 const scenes=['device-trio','product-line','floating-pages','social-wall'];
 const base=JSON.stringify(objects);
 scenes.forEach((s,i)=>{objects=JSON.parse(base);buildScene(s);proSaveLocal()});
 toast('4 bulk varijante pripremljene')
}
function addToolbar(){
 const tb=$('.toolbar');if(!tb||$('#smartFitBtn'))return;
 const b=document.createElement('button');b.id='smartFitBtn';b.textContent='Smart Fit';b.onclick=applySmartFit;tb.appendChild(b);
 const q=document.createElement('button');q.textContent='Bulk 4';q.onclick=createBulkVariants;tb.appendChild(q);
}
window.proNudge=proNudge;window.proCenter=proCenter;window.proDuplicate=proDuplicate;window.proGroup=proGroup;window.proUngroup=proUngroup;
window.proToggleGrid=proToggleGrid;window.proToggleGuides=proToggleGuides;window.proAutoSave=proAutoSave;window.proSnapshot=proSnapshot;
window.proExportScene=proExportScene;window.proImportScene=proImportScene;window.proExportPreset=proExportPreset;window.proExportPNG=proExportPNG;
window.applySmartFit=applySmartFit;window.createBulkVariants=createBulkVariants;
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();proSaveLocal();toast('Auto-save sačuvan')}if(e.key==='Escape')state.selectedIds=[]});
const oldRender=window.render; if(oldRender)window.render=function(){oldRender();syncProFields();proSaveLocal()};
window.addEventListener('load',()=>{addProPanel();addToolbar();const s=localStorage.getItem('marijana-mockup-pro-project');if(s)try{const d=JSON.parse(s);state.projectName=d.name||state.projectName;state.quality=d.quality||state.quality;const n=$('#proProjectName');if(n)n.value=state.projectName}catch(e){}});
})();

/* Central Billing access layer — UI only until production API is connected. */
const MOCKUP_ACCESS={
  free:{credits:20,exports:5,features:['2d','basic_templates']},
  creator:{credits:150,exports:300,features:['2d','templates','hd_export','brand_kit']},
  '3d_pro':{credits:400,exports:500,features:['2d','3d','isometric','perspective','depth','web_gallery','bulk_variants']},
  business:{credits:1000,exports:1000,features:['everything_3d_pro','bulk_edit','batch_export','brand_kit_pro','commercial_workflow']},
  ai_mockup:{credits:1500,exports:2000,features:['everything_business','prompt_to_scene','auto_layout','multi_variant','social_formats']}
};
const MOCKUP_COSTS={smart_fit:0,scene_3d:5,bulk_variants:20,ai_scene:10,image_to_mockup:15,ai_video_mockup:30};
let mockupBilling={plan:'free',credits:20,used:0};
function mockupHasFeature(feature){const p=MOCKUP_ACCESS[mockupBilling.plan]||MOCKUP_ACCESS.free;return p.features.includes(feature)||p.features.includes('everything_3d_pro')&&['3d','isometric','perspective','depth','web_gallery','bulk_variants'].includes(feature)||p.features.includes('everything_business')}
function mockupSpend(action){const cost=MOCKUP_COSTS[action]||0;if(cost<=0)return true;if(mockupBilling.credits<cost){toast('Nema dovoljno kredita. Otvori Marijana Naplata.');return false}mockupBilling.credits-=cost;mockupBilling.used+=cost;localStorage.setItem('marijana-mockup-billing',JSON.stringify(mockupBilling));syncMockupBilling();return true}
function syncMockupBilling(){const el=document.querySelector('#proUsage');if(el)el.textContent='Plan: '+mockupBilling.plan+' · Krediti: '+mockupBilling.credits+' · Potrošeno: '+mockupBilling.used}
function loadMockupBilling(){try{const s=JSON.parse(localStorage.getItem('marijana-mockup-billing')||'null');if(s)mockupBilling={...mockupBilling,...s}}catch(e){}syncMockupBilling()}
function addBillingBadge(){if(document.querySelector('#mockupBillingBadge'))return;const tb=document.querySelector('.toolbar');if(!tb)return;const b=document.createElement('button');b.id='mockupBillingBadge';b.textContent='Plan: '+mockupBilling.plan+' · '+mockupBilling.credits+' kred.';b.onclick=()=>location.href='../marijana-naplata/index.html';tb.appendChild(b)}
const oldBulk=createBulkVariants;
createBulkVariants=function(){if(!mockupHasFeature('bulk_variants')){toast('Bulk varijante su dostupne od 3D Pro plana.');return}if(!mockupSpend('bulk_variants'))return;oldBulk()};
const oldFit=applySmartFit;
applySmartFit=function(){if(!mockupSpend('smart_fit'))return;oldFit()};
window.mockupHasFeature=mockupHasFeature;window.mockupSpend=mockupSpend;window.loadMockupBilling=loadMockupBilling;
window.addEventListener('load',()=>{loadMockupBilling();addBillingBadge()});
