let currentMode="Strategija";
let marketingContext={project:null,funnel:null};
let lastAIResult="";

async function loadMarketingContext(){
  const ps=document.getElementById("project-select"),fs=document.getElementById("funnel-select");
  try{
    const [pr,fr]=await Promise.all([fetch("../api/projects",{credentials:"include"}),fetch("../api/funnels",{credentials:"include"})]);
    if(pr.ok){const d=await pr.json(),items=d.projects||[];ps.innerHTML='<option value="">Bez projekta</option>'+items.slice(0,50).map(p=>'<option value="'+String(p.id).replace(/"/g,"&quot;")+'">'+escapeHtml(p.name||"Projekat")+'</option>').join("");ps.dataset.items=JSON.stringify(items.map(p=>({id:p.id,name:p.name,status:p.status,type:p.type,data:p.data})));}
    else ps.innerHTML='<option value="">Prijava potrebna</option>';
    if(fr.ok){const d=await fr.json(),items=d.funnels||[];fs.innerHTML='<option value="">Bez levka</option>'+items.slice(0,50).map(f=>'<option value="'+String(f.id).replace(/"/g,"&quot;")+'">'+escapeHtml(f.name||"Prodajni levak")+'</option>').join("");fs.dataset.items=JSON.stringify(items.map(f=>({id:f.id,name:f.name,status:f.status,data:f.data})));}
    else fs.innerHTML='<option value="">Nije dostupno</option>';
  }catch(e){ps.innerHTML='<option value="">Kontekst nije dostupan</option>';fs.innerHTML='<option value="">Kontekst nije dostupan</option>';}
}
function loadSelectedContext(){
  const ps=document.getElementById("project-select"),fs=document.getElementById("funnel-select"),projects=JSON.parse(ps.dataset.items||"[]"),funnels=JSON.parse(fs.dataset.items||"[]");
  marketingContext.project=projects.find(x=>String(x.id)===String(ps.value))||null;marketingContext.funnel=funnels.find(x=>String(x.id)===String(fs.value))||null;
  const compact={project:marketingContext.project?{id:marketingContext.project.id,name:marketingContext.project.name,status:marketingContext.project.status,type:marketingContext.project.type,data:marketingContext.project.data}:null,funnel:marketingContext.funnel?{id:marketingContext.funnel.id,name:marketingContext.funnel.name,status:marketingContext.funnel.status,data:marketingContext.funnel.data}:null};
  document.getElementById("context").value=JSON.stringify(compact);document.getElementById("context-status").textContent=(marketingContext.project||marketingContext.funnel)?"Kontekst učitan":"Kontekst je prazan";
}
function runAction(mode,prompt){const button=[...document.querySelectorAll(".mode")].find(x=>x.textContent.includes(mode));if(button)setMode(button,mode);usePrompt(prompt);sendMessage();}

function setMode(el,mode){currentMode=mode;document.getElementById("mode-name").textContent=mode;document.querySelectorAll(".mode").forEach(x=>x.classList.remove("active"));el.classList.add("active")}
function usePrompt(t){document.getElementById("message").value=t;document.getElementById("message").focus()}
function addMessage(kind,text){const box=document.getElementById("messages"),div=document.createElement("div");div.className="msg "+kind;div.innerHTML="<strong>"+(kind==="ai"?"Marijana Marketing AI":"Ti")+"</strong><p>"+escapeHtml(text).replace(/\n/g,"<br>")+"</p>";box.appendChild(div);box.scrollTop=box.scrollHeight;if(kind==="ai"){lastAIResult=text;const actions=document.createElement("div");actions.className="result-actions";actions.innerHTML='<button onclick="saveLastResult()">Sačuvaj u Drive</button><button onclick="applyLastResult()">Primeni u sistem</button><button onclick="openTargetModule()">Otvori povezani alat</button>';div.appendChild(actions)}}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function sendMessage(){const input=document.getElementById("message"),message=input.value.trim();if(!message)return;addMessage("user",message);input.value="";const button=document.querySelector(".send");button.disabled=true;button.textContent="Radim…";try{const r=await fetch("../api/marketing-ai",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({message,mode:currentMode,context:document.getElementById("context").value.trim()})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Greška");addMessage("ai",data.text||"Nema odgovora.");}catch(e){addMessage("ai","Ne mogu trenutno da obradim zahtev: "+e.message)}finally{button.disabled=false;button.textContent="Pošalji ↗"}}
function clearChat(){document.getElementById("messages").innerHTML='<div class="msg ai"><strong>Marijana Marketing AI</strong><p>Novi razgovor je spreman.</p></div>'}
document.addEventListener("DOMContentLoaded",loadMarketingContext);
document.getElementById("message").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage()}})

async function applyLastResult(){
  if(!lastAIResult){return;}
  let target="project";
  if(["Upsell","Cross-sell","Downsell","Ponuda","Prodajni levak"].includes(currentMode)) target="funnel";
  else if(currentMode==="Email marketing") target="email";
  else if(currentMode==="Analitika" || currentMode==="Strategija" || currentMode==="SEO" || currentMode==="Pinterest" || currentMode==="Sadržaj" || currentMode==="Retencija") target="project";
  const funnelId=document.getElementById("funnel-select").value;
  if(target==="funnel"&&!funnelId){addMessage("ai","Izaberi prodajni levak u kontekstu, pa ponovo klikni „Primeni u sistem“.");return;}
  const payload={mode:currentMode,result:lastAIResult,target,funnelId,
    name:"Marijana AI — "+currentMode,
    subject:currentMode+" — predlog",
    goal:"Predlog kreiran u Marijana Marketing AI",
    audience:"",
    offer:""};
  try{
    const r=await fetch("../api/marketing-ai/apply.js",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(payload)});
    const d=await r.json();
    if(!r.ok) throw new Error(d.error||"Primena nije uspela");
    addMessage("ai","✓ "+(d.message||"Predlog je primenjen kao nacrt."));
  }catch(e){addMessage("ai","Ne mogu da primenim rezultat: "+e.message);}
}
