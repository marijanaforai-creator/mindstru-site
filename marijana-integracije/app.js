const API="../api/integrations/google-forms.js";
function toast(s){const t=document.getElementById("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function openGoogleForm(){document.getElementById("forme").scrollIntoView({behavior:"smooth"});document.getElementById("form-url").focus()}
async function saveConnection(){
 const status=document.getElementById("form-status");
 const body={name:document.getElementById("conn-name").value,form_url:document.getElementById("form-url").value,sheet_url:document.getElementById("sheet-url").value,form_id:"google-form"};
 const secret=document.getElementById("secret").value;if(secret)body.webhook_secret=secret;
 try{const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error(data.error||"Greška");status.textContent="Konekcija je sačuvana.";toast("Google Forms konekcija je dodata.");loadConnections()}catch(e){status.textContent=e.message}
}
async function loadConnections(){try{const r=await fetch(API);const data=await r.json();const list=data.connections||[];document.getElementById("sync-total").textContent=list.length;document.getElementById("connections").innerHTML=list.map(c=>"<div class='connection'><div><b>"+c.name+"</b><small>Google Forms · "+c.status+"</small></div><span>"+(c.last_sync_at?"Sinhronizovano":"Čeka prvi sync")+"</span></div>").join("")||"<p>Nema konekcija.</p>"}catch(e){document.getElementById("connections").innerHTML="<p>API još nije povezan sa produkcionim okruženjem.</p>"}}
async function exportData(){try{const r=await fetch("../api/integrations/export.js");const data=await r.json();const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="marijana-publika-export.json";a.click();URL.revokeObjectURL(a.href)}catch(e){toast("Izvoz zahteva prijavljen radni prostor.")}}
loadConnections();