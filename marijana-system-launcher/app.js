const modules=[
{id:"drive",name:"Marijana Drive",desc:"Centralni workspace, fajlovi, projekti i poslovni sistem.",status:"ready",deps:[]},
{id:"creator",name:"Marijana Creator",desc:"Kreiranje dokumenata, stranica, vizuala i eksport.",status:"ready",deps:["drive"]},
{id:"ai",name:"Marijana AI Studio",desc:"AI alati i centralni AI sloj.",status:"ready",deps:[]},
{id:"contacts",name:"Marijana Kontakti",desc:"Kontakti, odnosi i relationship intelligence.",status:"ready",deps:["drive"]},
{id:"automation",name:"Marijana Automatizacije",desc:"Workflow i automatizacija poslovnih procesa.",status:"ready",deps:["drive"]},
{id:"calendar",name:"Marijana Kalendar",desc:"Planiranje sadržaja, događaja i zadataka.",status:"ready",deps:["drive"]},
{id:"audio",name:"Marijana Audio Studio",desc:"Voice, audio production, mastering i export.",status:"planned",deps:["ai"]},
{id:"agents",name:"Marijana Agent OS",desc:"AI agenti, orkestracija i kontrolisana autonomija.",status:"planned",deps:["ai","automation"]},
{id:"billing",name:"Marijana Naplata",desc:"Billing, subscriptions, entitlements i finansijske operacije.",status:"planned",deps:["drive"]},
{id:"analytics",name:"Marijana Analitika",desc:"Metrike, događaji i poslovna analitika.",status:"planned",deps:["drive"]}
];
const checks=[
{id:"database",name:"Database",desc:"Baza podataka i migracioni sloj",state:"ready"},
{id:"api",name:"API",desc:"Centralni API i autentifikacija",state:"ready"},
{id:"storage",name:"Storage",desc:"Fajlovi i media storage",state:"ready"},
{id:"auth",name:"Authentication",desc:"Identitet i pristup",state:"ready"},
{id:"ai",name:"AI Core",desc:"AI konfiguracija i runtime",state:"ready"},
{id:"scheduler",name:"Scheduler",desc:"Zakazivanje i background jobs",state:"ready"},
{id:"security",name:"Security",desc:"Kontrole i audit",state:"ready"},
{id:"deploy",name:"Deployment",desc:"Build i release pipeline",state:"warn"}
];
const migrations=[
["001","Core schema","Osnovna baza","ready"],
["002","Projects","Projekti i dokumenti","ready"],
["003","Drive folders","Folderi i organizacija fajlova","pending"],
["004","AI context","AI context i memory foundation","planned"]
];
const audit=[];
function log(msg){audit.unshift({time:new Date().toLocaleTimeString("sr-RS"),msg});renderAudit()}
function statusLabel(s){return s==="ready"?"SPREMNO":s==="planned"?"PLANIRANO":"NA ČEKANJU"}
function renderHealth(){document.querySelector("#health-grid").innerHTML=checks.map(c=>`<div class="health-card"><span class="eyebrow">${c.name}</span><h3>${c.state==="ready"?"🟢":"🟡"} ${statusLabel(c.state)}</h3><div class="state">${c.desc}</div></div>`).join("");document.querySelector("#health-detail").innerHTML=checks.map(c=>`<div class="health-card"><span class="eyebrow">${c.name}</span><h3>${c.state==="ready"?"Operativno":"Potrebna konfiguracija"}</h3><p>${c.desc}</p><span class="${c.state==="ready"?"ok":"warn"}">${c.state==="ready"?"✓ Check passed":"! Check required"}</span></div>`).join("");document.querySelector("#deploy-checklist").innerHTML=checks.map(c=>`<div class="list-row"><span>${c.name}</span><span class="${c.state==="ready"?"ok":"warn"}">${c.state==="ready"?"✓":"!"} ${c.state==="ready"?"READY":"CHECK"}</span></div>`).join("")}
function renderModules(){document.querySelector("#module-grid").innerHTML=modules.map(m=>`<div class="module-card"><span class="eyebrow">MODULE</span><h3>${m.name}</h3><p>${m.desc}</p><div class="module-meta"><span class="badge">${statusLabel(m.status)}</span><button class="secondary" onclick="moduleAction('${m.id}')">${m.status==="ready"?"Otvori":"Konfiguriši"}</button></div></div>`).join("")}
function renderMigrations(){document.querySelector("#migration-list").innerHTML=migrations.map(m=>`<div class="list-row"><span><strong>${m[0]} · ${m[1]}</strong><br><small>${m[2]}</small></span><span class="${m[3]==="ready"?"ok":"warn"}">${m[3]==="ready"?"✓ PRIMENJENO":m[3]==="pending"?"! PENDING":"PLANIRANO"}</span></div>`).join("")}
function renderAudit(){document.querySelector("#audit-list").innerHTML=audit.length?audit.map(a=>`<div class="list-row"><span>${a.msg}</span><small>${a.time}</small></div>`).join(""):'<div class="result">Još nema operacija.</div>'}
function runFullCheck(){const btn=event?.target;if(btn)btn.disabled=true;document.querySelector("#launch-result").textContent="Proveravam sistem…";setTimeout(()=>{renderHealth();document.querySelector("#launch-result").innerHTML='<span class="ok">✓ System Check završen.</span> Svi osnovni razvojni servisi su registrovani. Deployment ostaje blokiran dok se ne potvrde spoljne konfiguracije.';log("Pokrenut FULL SYSTEM CHECK");if(btn)btn.disabled=false},500)}
function prepareDeployment(){document.querySelector("#launch-result").innerHTML='<span class="warn">DEPLOYMENT READY CHECK</span><br>Launcher je pripremio plan, ali produkcijsko puštanje zahteva potvrđene environment varijable, bazu, storage, domen i deployment provider.';log("Pripremljen deployment check — produkcija nije automatski puštena")}
function moduleAction(id){const m=modules.find(x=>x.id===id);if(!m)return;log((m.status==="ready"?"Otvoren":"Pokrenuta konfiguracija modula")+": "+m.name);alert(m.status==="ready"?m.name+" je registrovan kao READY modul.":"Modul "+m.name+" je u PLANIRANOJ fazi i čeka konfiguraciju.");}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));n.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelector("#view-"+n.dataset.view).classList.add("active");document.querySelector("#view-title").textContent=n.textContent.replace(/^[^\s]+\s/,"")});
renderHealth();renderModules();renderMigrations();renderAudit();log("Launcher inicijalizovan");