const stages=[["lead_magnet","Lead Magnet"],["landing_page","Landing Page"],["thank_you","Thank You Page"],["email_sequence","Email Sequence"],["offer","Offer"],["checkout","Checkout"],["follow_up","Follow-up"]];
let funnel=null,selectedKey=stages[0][0];
function toast(x){const t=document.getElementById("toast");t.textContent=x;t.style.display="block";setTimeout(()=>t.style.display="none",2200)}
function renderStages(active=[]){
 document.getElementById("stages").innerHTML=stages.map((s,i)=>{const d=active.find(x=>x.key===s[0])||{};return '<button class="stage '+(selectedKey===s[0]?'selected':'')+'" onclick="selectStage(\''+s[0]+'\')"><small>0'+(i+1)+'</small><h3>'+s[1]+'</h3><span>'+((d.status)||"draft")+'</span></button>'}).join("");
 document.getElementById("stage-preview").innerHTML=stages.map(s=>'<div style="padding:7px 0;color:#b9c5e5">→ '+s[1]+'</div>').join("");
 if(active.length) selectStage(selectedKey);
}
function selectStage(key){
 selectedKey=key;
 const d=(funnel?.data?.stages||[]).find(x=>x.key===key)||{key,name:stages.find(s=>s[0]===key)?.[1]||key,status:"draft",goal:"",copy:"",cta:""};
 document.getElementById("stage-name").value=d.name||"";
 document.getElementById("stage-goal").value=d.goal||"";
 document.getElementById("stage-copy").value=d.copy||"";
 document.getElementById("stage-cta").value=d.cta||"";
 renderStages(funnel?.data?.stages||[]);
}
async function createFunnel(){
 const r=await fetch("/api/funnels",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({name:"Novi prodajni funnel",data:{stages:stages.map(s=>({key:s[0],name:s[1],status:"draft",goal:"",copy:"",cta:""}))}})});
 if(!r.ok){toast("Prijavi se da bi sačuvala funnel.");return}
 const d=await r.json();funnel=d.funnel;document.getElementById("status").textContent=funnel.name;renderStages(funnel.data.stages);toast("Funnel je kreiran.");
}
async function fromProduct(){
 const raw=localStorage.getItem("marijanaProductSystem");if(!raw){toast("Prvo napravi Product System u AI Studio.");return}
 try{
  const product=JSON.parse(raw);
  const r=await fetch("/api/funnels/from-product",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({name:product.name||"Product Funnel",product})});
  const d=await r.json();if(!r.ok){toast(d.error||"Nije uspelo.");return}
  funnel=d.funnel;document.getElementById("status").textContent=funnel.name;renderStages(funnel.data.stages||[]);toast("Product System je pretvoren u funnel.");
 }catch(e){toast("Nije moguće učitati Product System.")}
}
async function saveStage(){
 if(!funnel){toast("Prvo napravi ili učitaj funnel.");return}
 const list=funnel.data.stages||[];
 const i=list.findIndex(x=>x.key===selectedKey);
 const old=list[i]||{key:selectedKey};
 list[i]={...old,name:document.getElementById("stage-name").value.trim()||old.name,goal:document.getElementById("stage-goal").value,copy:document.getElementById("stage-copy").value,cta:document.getElementById("stage-cta").value,status:"ready"};
 const r=await fetch("/api/funnels/"+encodeURIComponent(funnel.id),{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({data:{...funnel.data,stages:list}})});
 const d=await r.json();if(!r.ok){toast(d.error||"Čuvanje nije uspelo.");return}funnel=d.funnel;renderStages(list);toast("Korak je sačuvan.");
}
async function publishFunnel(){
 if(!funnel){toast("Prvo napravi funnel.");return}
 toast("Funnel je pripremljen za systeme.io. Sledeće povezivanje šalje korake na nalog.");
}
renderStages([]);
function renderSpecialEditors(){
 const emails=document.querySelector("#emails .empty");
 const offers=document.querySelector("#offers .empty");
 const leads=document.querySelector("#leads .empty");
 const analytics=document.querySelector("#analytics .empty");
 if(emails)emails.innerHTML='<div class="form-grid"><label>Naslov sekvence<input id="email-seq-name" placeholder="Dobrodošlica + prodajna sekvenca"></label><label>Broj emailova<input id="email-seq-count" type="number" min="1" max="20" value="5"></label><label>Prvi email<textarea id="email-1" placeholder="Naslov i sadržaj prvog emaila..."></textarea></label><label>CTA<textarea id="email-cta" placeholder="CTA za sledeći korak"></textarea></label></div><button onclick="saveEmailSequence()">Sačuvaj sekvencu</button>';
 if(offers)offers.innerHTML='<div class="form-grid"><label>Naziv ponude<input id="offer-name" placeholder="Premium paket"></label><label>Cena<input id="offer-price" type="number" step="0.01" placeholder="19.90"></label><label>Valuta<select id="offer-currency"><option>EUR</option><option>USD</option><option>RSD</option></select></label><label>Opis<textarea id="offer-description" placeholder="Šta kupac dobija..."></textarea></label></div><button onclick="saveOffer()">Sačuvaj ponudu</button>';
 if(leads)leads.innerHTML='<div class="form-grid"><label>Lead magnet<input id="lead-name" placeholder="Besplatan vodič"></label><label>Opis<textarea id="lead-description" placeholder="Šta osoba dobija zauzvrat za email..."></textarea></label><label>CTA<input id="lead-cta" placeholder="Preuzmi besplatno"></label></div><button onclick="saveLeadMagnet()">Sačuvaj Lead Magnet</button>';
 if(analytics)analytics.innerHTML='<div class="metric-grid"><div><b id="m-visits">0</b><span>Posete</span></div><div><b id="m-leads">0</b><span>Leadovi</span></div><div><b id="m-sales">0</b><span>Prodaje</span></div><div><b id="m-rate">0%</b><span>Konverzija</span></div></div>';
}
function updateFunnelData(patch){
 if(!funnel)return toast("Prvo napravi ili učitaj funnel.");
 funnel.data={...funnel.data,...patch};
 return fetch("/api/funnels/"+encodeURIComponent(funnel.id),{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({data:funnel.data})}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"Čuvanje nije uspelo.");funnel=d.funnel;return d.funnel});
}
async function saveEmailSequence(){
 try{await updateFunnelData({emailSequence:{name:document.getElementById("email-seq-name").value,count:Number(document.getElementById("email-seq-count").value),firstEmail:document.getElementById("email-1").value,cta:document.getElementById("email-cta").value}});toast("Email sekvenca je sačuvana.");}catch(e){toast(e.message)}
}
async function saveOffer(){
 try{await updateFunnelData({offer:{name:document.getElementById("offer-name").value,price:Number(document.getElementById("offer-price").value||0),currency:document.getElementById("offer-currency").value,description:document.getElementById("offer-description").value}});toast("Ponuda je sačuvana.");}catch(e){toast(e.message)}
}
async function saveLeadMagnet(){
 try{await updateFunnelData({leadMagnet:{name:document.getElementById("lead-name").value,description:document.getElementById("lead-description").value,cta:document.getElementById("lead-cta").value}});toast("Lead Magnet je sačuvan.");}catch(e){toast(e.message)}
}
const __renderStages=renderStages;
document.addEventListener("DOMContentLoaded",()=>{renderSpecialEditors();});

function landingValues(){
 return {
  headline:document.getElementById("lp-headline").value,
  subheadline:document.getElementById("lp-subheadline").value,
  problem:document.getElementById("lp-problem").value,
  solution:document.getElementById("lp-solution").value,
  benefits:document.getElementById("lp-benefits").value,
  proof:document.getElementById("lp-proof").value,
  offer:document.getElementById("lp-offer").value,
  cta:document.getElementById("lp-cta").value
 };
}
async function saveLandingPage(){
 try{
  await updateFunnelData({landingPage:landingValues()});
  document.getElementById("landing-status").textContent="Sačuvano";
  previewLandingPage();
  toast("Landing Page je sačuvan.");
 }catch(e){toast(e.message)}
}
function previewLandingPage(){
 const d=landingValues();
 const benefits=d.benefits.split(/\n+/).filter(Boolean).map(x=>"<li>"+x.replace(/</g,"&lt;")+"</li>").join("");
 document.getElementById("landing-preview").innerHTML="<div class='lp-card'><small>PREGLED PRODAJNE STRANICE</small><h2>"+(d.headline||"Tvoj glavni naslov")+"</h2><p>"+(d.subheadline||"Podnaslov")+"</p><hr><h3>Problem</h3><p>"+(d.problem||"—")+"</p><h3>Rešenje</h3><p>"+(d.solution||"—")+"</p><h3>Benefiti</h3><ul>"+(benefits||"<li>Dodaj benefite</li>")+"</ul><h3>Zašto da verujem?</h3><p>"+(d.proof||"—")+"</p><h3>Ponuda</h3><p>"+(d.offer||"—")+"</p><button>"+(d.cta||"CTA")+"</button></div>";
}
function loadLandingPage(){
 const d=funnel?.data?.landingPage;
 if(!d)return;
 Object.entries({headline:"lp-headline",subheadline:"lp-subheadline",problem:"lp-problem",solution:"lp-solution",benefits:"lp-benefits",proof:"lp-proof",offer:"lp-offer",cta:"lp-cta"}).forEach(([k,id])=>{if(document.getElementById(id))document.getElementById(id).value=d[k]||""});
 document.getElementById("landing-status").textContent="Sačuvano";
 previewLandingPage();
}
const __oldCreateFunnel=createFunnel;
createFunnel=async function(){await __oldCreateFunnel();loadLandingPage();};
const __oldFromProduct=fromProduct;
fromProduct=async function(){await __oldFromProduct();loadLandingPage();};
document.addEventListener("DOMContentLoaded",()=>setTimeout(loadLandingPage,150));
