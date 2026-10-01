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

function importProductSystem(){const raw=localStorage.getItem('marijanaProductSystem');if(!raw){showToast('Nema sačuvanog Product System paketa. Prvo ga napravi u AI Studio.');return}try{const d=JSON.parse(raw);document.getElementById('drive-product-name').textContent=d.name||'Novi proizvod';document.getElementById('drive-product-status').textContent='Paket učitan';document.getElementById('drive-product-preview').value=[d.product,d.sales,d.seo,d.pinterest,d.social,d.email,d.drive].filter(Boolean).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');showToast('Product System je učitan u Marijana Drive.')}catch(e){showToast('Paket nije moguće učitati.');}}
