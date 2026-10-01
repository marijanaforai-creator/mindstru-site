const KEY='marijana_email_sequences_v1';let sequences=JSON.parse(localStorage.getItem(KEY)||'[]');let current=null;
const $=id=>document.getElementById(id);
function blank(){return{id:Date.now(),name:'Nova email sekvenca',type:'welcome',goal:'',audience:'',offer:'',emails:[]}}
function renderList(){const el=$('sequenceList');el.innerHTML='';sequences.forEach(s=>{const d=document.createElement('div');d.className='seq-item'+(current&&current.id===s.id?' active':'');d.textContent=s.name;d.onclick=()=>load(s.id);el.appendChild(d)})}
function load(id){current=sequences.find(x=>x.id===id)||blank();$('sequenceName').value=current.name;$('sequenceType').value=current.type;$('goal').value=current.goal;$('audience').value=current.audience;$('offer').value=current.offer;renderEmails();renderList()}
function sync(){if(!current)return;current.name=$('sequenceName').value||'Nova email sekvenca';current.type=$('sequenceType').value;current.goal=$('goal').value;current.audience=$('audience').value;current.offer=$('offer').value}
async function save(){
 sync();
 try{
  const payload={name:current.name,type:current.type,goal:current.goal,audience:current.audience,offer:current.offer,emails:current.emails,status:"draft"};
  const isCloud=typeof current.id==="string" && current.id.length>20;
  const r=await fetch(isCloud?"/api/email-sequences/"+encodeURIComponent(current.id):"/api/email-sequences",{method:isCloud?"PUT":"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(payload)});
  const d=await r.json();
  if(!r.ok) throw new Error(d.error||"Cloud čuvanje nije uspelo.");
  current=d.sequence;
  const idx=sequences.findIndex(x=>x.id===current.id);
  if(idx>=0) sequences[idx]=current; else sequences.unshift(current);
  localStorage.setItem(KEY,JSON.stringify(sequences));
  renderList();
  toast("Sekvenca je sačuvana u Marijana Cloud.");
 }catch(e){
  const idx=sequences.findIndex(x=>x.id===current.id);
  if(idx>=0) sequences[idx]=current; else sequences.unshift(current);
  localStorage.setItem(KEY,JSON.stringify(sequences));
  renderList();
  alert("Cloud čuvanje nije uspelo, pa je sekvenca sačuvana lokalno.\n\n"+e.message);
 }
}
function renderEmails(){const box=$('emails');box.innerHTML='';$('sequenceMeta').textContent=current.emails.length+' emailova';if(!current.emails.length){box.innerHTML='<div class="empty">Još nema emailova. Dodaj prvi email ili generiši kompletnu sekvencu.</div>';return}current.emails.forEach((e,i)=>{const card=document.createElement('article');card.className='email';card.innerHTML='<div class="email-top"><strong>Email '+(i+1)+'</strong><button class="danger" data-remove="'+i+'">Obriši</button></div><div class="email-grid"><input data-i="'+i+'" data-k="day" value="'+(e.day||'Dan '+(i+1))+'"><input data-i="'+i+'" data-k="subject" placeholder="Naslov emaila" value="'+esc(e.subject||'')+'"><select data-i="'+i+'" data-k="purpose"><option '+(e.purpose==='Vrednost'?'selected':'')+'>Vrednost</option><option '+(e.purpose==='Prodaja'?'selected':'')+'>Prodaja</option><option '+(e.purpose==='Podsetnik'?'selected':'')+'>Podsetnik</option><option '+(e.purpose==='Dobrodošlica'?'selected':'')+'>Dobrodošlica</option></select></div><textarea data-i="'+i+'" data-k="body" placeholder="Sadržaj emaila">'+esc(e.body||'')+'</textarea>';box.appendChild(card)})}
function esc(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function addEmail(){sync();current.emails.push({day:'Dan '+(current.emails.length+1),subject:'',purpose:'Vrednost',body:''});renderEmails()}
function generate(){sync();const type=current.type;const presets={welcome:[['Dan 0','Dobrodošla — odakle da počnemo?','Dobrodošlica'],['Dan 1','Jedan mali korak koji možeš odmah da uradiš','Vrednost'],['Dan 3','Najčešća greška i kako da je izbegneš','Vrednost'],['Dan 5','Kako izgleda sledeći korak','Vrednost'],['Dan 7','Tvoja sledeća prilika','Prodaja']],lead:[['Dan 0','Evo tvog besplatnog resursa','Dobrodošlica'],['Dan 1','Kako da izvučeš maksimum iz vodiča','Vrednost'],['Dan 3','3 stvari koje najčešće koče rezultat','Vrednost'],['Dan 5','Rešenje koje štedi vreme','Prodaja'],['Dan 7','Da li želiš da nastavimo?','Podsetnik']],sales:[['Dan 0','Problem koji tvoj proizvod rešava','Vrednost'],['Dan 1','Kako izgleda rešenje','Vrednost'],['Dan 2','Šta dobijaš','Prodaja'],['Dan 4','Najčešća pitanja pre kupovine','Prodaja'],['Dan 6','Poslednji poziv','Podsetnik']]}[type]||[['Dan 0','Uvod','Dobrodošlica'],['Dan 2','Korisna ideja','Vrednost'],['Dan 4','Sledeći korak','Prodaja']];current.emails=presets.map(x=>({day:x[0],subject:x[1],purpose:x[2],body:'Ovde će biti generisan sadržaj emaila prilagođen publici, cilju i ponudi projekta.'}));renderEmails();save()}
$('newSequence').onclick=()=>{current=blank();load(current.id)};$('addEmail').onclick=addEmail;$('saveSequence').onclick=save;$('generateSequence').onclick=generate;
$('emails').addEventListener('input',e=>{const i=e.target.dataset.i,k=e.target.dataset.k;if(i!==undefined){current.emails[i][k]=e.target.value;$('sequenceMeta').textContent=current.emails.length+' emailova'}});
$('emails').addEventListener('click',e=>{const i=e.target.dataset.remove;if(i!==undefined){current.emails.splice(Number(i),1);renderEmails()}});
async function loadCloudSequences(){
 try{
  const r=await fetch("/api/email-sequences",{credentials:"same-origin"});
  if(!r.ok) throw new Error("Nalog nije prijavljen ili cloud servis nije dostupan.");
  const d=await r.json();
  if(Array.isArray(d.sequences) && d.sequences.length){
   sequences=d.sequences;
   localStorage.setItem(KEY,JSON.stringify(sequences));
   current=sequences[0];
  }else{
   current=sequences[0]||blank();
   if(!sequences.length) sequences.push(current);
  }
  load(current.id);
 }catch(e){
  current=sequences[0]||blank();
  if(!sequences.length) sequences.push(current);
  load(current.id);
 }
}
loadCloudSequences();


async function generateWithAI(){
 sync();
 if(!current.goal && !current.audience && !current.offer){alert("Unesi makar cilj, publiku ili ponudu.");return}
 const prompt=`Napravi profesionalnu email sekvencu na srpskom jeziku. Vrati ISKLJUČIVO validan JSON bez markdown oznaka.
Struktura: {"name":"...","emails":[{"day":"Dan 0","subject":"...","purpose":"Dobrodošlica|Vrednost|Prodaja|Podsetnik","body":"...","cta":"..."}]}
Tip sekvence: ${current.type}
Naziv: ${current.name}
Cilj: ${current.goal}
Publika: ${current.audience}
Ponuda/proizvod: ${current.offer}
Napravi 5 emailova sa jasnim tokom: upoznavanje → vrednost → problem/rešenje → ponuda → poziv na akciju. Piši prirodno, konkretno i bez izmišljanja rezultata ili tvrdnji koje nisu date.`;
 try{
  const r=await fetch("/api/openai/generate",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({input:prompt})});
  const d=await r.json(); if(!r.ok) throw new Error(d.error||"AI zahtev nije uspeo.");
  const clean=String(d.text||"").replace(/^\`\`\`json\s*/,"").replace(/^\`\`\`\s*/,"").replace(/\s*\`\`\`$/,"").trim();
  const parsed=JSON.parse(clean);
  current.name=parsed.name||current.name;
  current.emails=Array.isArray(parsed.emails)?parsed.emails.map((e,i)=>({day:e.day||"Dan "+i,subject:e.subject||"",purpose:e.purpose||"Vrednost",body:e.body||"",cta:e.cta||""})):current.emails;
  $("sequenceName").value=current.name; renderEmails(); save(); toast("AI je napravio sekvencu.");
 }catch(e){alert("AI generisanje nije uspelo: "+e.message)}
}
async function sendToFunnel(){
 sync();
 if(!current.emails.length){alert("Prvo napravi email sekvencu.");return}
 try{
  let r=await fetch("/api/funnels",{credentials:"same-origin"});
  let d=await r.json();
  let funnel=d.funnels?.[0];
  if(!funnel){
   r=await fetch("/api/funnels",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({name:current.name+" — prodajni levak",data:{stages:[]}})});
   d=await r.json(); funnel=d.funnel;
  }
  const data={...(funnel.data||{}),emailSequence:{name:current.name,type:current.type,goal:current.goal,audience:current.audience,offer:current.offer,emails:current.emails}};
  const stages=[...(data.stages||[])];
  const idx=stages.findIndex(s=>s.key==="email_sequence");
  const stage={...(stages[idx]||{key:"email_sequence",name:"Email Sekvence"}),name:current.name,goal:current.goal,copy:current.emails.map(e=>e.subject+"\n"+e.body).join("\n\n"),cta:current.emails[current.emails.length-1]?.cta||"",status:"ready"};
  if(idx>=0) stages[idx]=stage; else stages.push(stage);
  data.stages=stages;
  r=await fetch("/api/funnels/"+encodeURIComponent(funnel.id),{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({data})});
  d=await r.json(); if(!r.ok) throw new Error(d.error||"Čuvanje u levku nije uspelo.");
  alert("Email sekvenca je povezana sa prodajnim levkom.");
}catch(e){alert("Povezivanje nije uspelo: "+e.message)}
}
function toast(x){const t=document.createElement("div");t.textContent=x;t.style.cssText="position:fixed;right:20px;bottom:20px;background:#42b9ff;color:#06101b;padding:12px 16px;border-radius:10px;font-weight:700;z-index:99";document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
$("generateSequence").onclick=generateWithAI;
$("sendToFunnel").onclick=sendToFunnel;
