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