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

const productionStatuses=['Ideja','U izradi','Spremno','Zakazano','Objavljeno'];
let productionItems=JSON.parse(localStorage.getItem('marijanaDriveProduction')||'[]');
function initProductionBoard(){renderProductionBoard()}
function saveProduction(){localStorage.setItem('marijanaDriveProduction',JSON.stringify(productionItems))}
function openProductionEditor(){document.getElementById('productionEditor').hidden=false;document.getElementById('prodTitle').focus()}
function closeProductionEditor(){document.getElementById('productionEditor').hidden=true}
function saveProductionItem(){
 const item={id:Date.now(),title:document.getElementById('prodTitle').value.trim()||'Novi sadržaj',channel:document.getElementById('prodChannel').value,format:document.getElementById('prodFormat').value,goal:document.getElementById('prodGoal').value.trim(),brief:document.getElementById('prodBrief').value.trim(),status:'Ideja'};
 productionItems.push(item);saveProduction();['prodTitle','prodGoal','prodBrief'].forEach(id=>document.getElementById(id).value='');closeProductionEditor();renderProductionBoard();showToast('Sadržaj je dodat u tablu.')}
function updateProductionStatus(id,status){const x=productionItems.find(i=>i.id===id);if(x){x.status=status;saveProduction();renderProductionBoard()}}
function deleteProductionItem(id){productionItems=productionItems.filter(i=>i.id!==id);saveProduction();renderProductionBoard()}
function clearProductionBoard(){if(confirm('Obrisati sve stavke sa table?')){productionItems=[];saveProduction();renderProductionBoard()}}
function seedProductionFromCalendar(){
 const calendar=JSON.parse(localStorage.getItem('digitalSoulContentCalendar')||'[]');
 if(!calendar.length){showToast('Nema sadržaja u Content Calendar-u za uvoz.');return}
 const existing=new Set(productionItems.map(x=>x.title+'|'+x.date));
 calendar.forEach(x=>{const key=x.title+'|'+x.date;if(!existing.has(key)){productionItems.push({id:Date.now()+Math.random(),title:x.title,channel:x.channel,format:'Objava',goal:'',brief:x.note||'',status:x.status||'Ideja',date:x.date})}});
 saveProduction();renderProductionBoard();showToast('Sadržaj iz kalendara je uvezen.')}
function productionToolUrl(path,x){
 const params=new URLSearchParams();
 params.set('title',x.title||'Novi sadržaj');
 params.set('channel',x.channel||'');
 params.set('format',x.format||'');
 params.set('goal',x.goal||'');
 params.set('brief',x.brief||'');
 return path+'?'+params.toString();
}
function openProductionInMockup(id){
 const x=productionItems.find(i=>i.id===id);if(!x)return;
 window.location.href=productionToolUrl('../mockup/',x);
}
function openProductionInTextStudio(id){
 const x=productionItems.find(i=>i.id===id);if(!x)return;
 window.location.href=productionToolUrl('./',x)+'#caption-editor';
}
function openContentPackage(id){
 const x=productionItems.find(i=>i.id===id);if(!x)return;
 const panel=document.getElementById('contentPackage');
 if(!panel)return;
 panel.hidden=false;
 document.getElementById('packageTitle').textContent=x.title;
 document.getElementById('packageMeta').textContent=[x.channel,x.format,x.goal].filter(Boolean).join(' · ')||'Radni paket';
 document.getElementById('packageBrief').textContent=x.brief||'Nema dodatnog briefa.';
 document.getElementById('packageStatus').textContent=x.status;
 document.getElementById('packageTextLink').href=productionToolUrl('./',x)+'#caption-editor';
 document.getElementById('packageMockupLink').href=productionToolUrl('../mockup/',x);
 document.getElementById('packageCalendarLink').onclick=()=>{document.getElementById('kalendar').scrollIntoView({behavior:'smooth'});closeContentPackage();};
 panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function closeContentPackage(){const panel=document.getElementById('contentPackage');if(panel)panel.hidden=true}
function renderProductionBoard(){
 const b=document.getElementById('productionBoard');if(!b)return;
 b.innerHTML=productionStatuses.map(status=>{
  const items=productionItems.filter(x=>x.status===status);
  return '<div class="production-column"><div class="production-column-head"><strong>'+status+'</strong><span>'+items.length+'</span></div>'+items.map(x=>'<article class="production-card"><strong>'+x.title+'</strong><small>'+x.channel+' · '+x.format+'</small>'+(x.goal?'<small>Cilj: '+x.goal+'</small>':'')+'<p>'+x.brief+'</p><div class="production-card-actions"><button class="text-button" onclick="openContentPackage('+x.id+')">Content Package</button><button class="text-button" onclick="openProductionInTextStudio('+x.id+')">Tekst</button><button class="text-button" onclick="openProductionInMockup('+x.id+')">Mockup</button></div><select onchange="updateProductionStatus('+x.id+',this.value)">'+productionStatuses.map(s=>'<option '+(s===x.status?'selected':'')+'>'+s+'</option>').join('')+'</select><button class="text-button" onclick="deleteProductionItem('+x.id+')">Obriši</button></article>').join('')+'</div>'
 }).join('');
}

function hydrateCaptionFromProduction(){
 const params=new URLSearchParams(location.search);
 const topic=params.get('title');
 if(!topic)return;
 const set=(id,value)=>{const el=document.getElementById(id);if(el&&value)el.value=value};
 set('topic',topic);
 set('context',params.get('brief'));
 const channel=params.get('channel');
 const platform=document.getElementById('platform');
 if(platform&&channel){
  const map={'TikTok':'Instagram','Email':'LinkedIn','Web':'LinkedIn'};
  const wanted=map[channel]||channel;
  if([...platform.options].some(o=>o.value===wanted))platform.value=wanted;
  document.getElementById('preview-platform').textContent=platform.value;
 }
 const goal=params.get('goal');
 const goalEl=document.getElementById('goal');
 if(goalEl&&goal&&[...goalEl.options].some(o=>o.value===goal))goalEl.value=goal;
 focusCaption();
 showToast('Brief iz Content Production je prenet u Text Studio.');
}

document.addEventListener('DOMContentLoaded',()=>{initProductionBoard();hydrateCaptionFromProduction()});