const tools=[
["✦","Marijana AI Studio","AI alati","../marijana-ai-studio/index.html"],["◈","Marijana Drive","Sadržaj i projekti","../marijana-drive/index.html"],["↗","Marijana Prodajni levak","Prodajni levak","../marijana-funnel/index.html"],["⇢","Marijana Tok rada","Plan rada","../marijana-workflow/index.html"],["✉","Marijana Email Sekvence","Email sekvence","../marijana-email-sekvence/index.html"],["◒","Marijana Analitika","Analitika","../marijana-analitika/index.html"],["⚙","Marijana Automatizacije","Automatizacije","../marijana-automatizacije/index.html"],["◎","Marijana Kontakti","Potencijalni kupci","../marijana-kontakti/index.html"],["◷","Marijana Kalendar sadržaja","Kalendar sadržaja","../marijana-kalendar-sadrzaja/index.html"],["✉","Marijana Newsletter","Newsletter","../marijana-newsletter/index.html"],["€","Marijana Naplata","Naplata","../marijana-naplata/index.html"],["✧","Marijana Alhemija","Brend i stil","../marijana-alhemija/index.html"],["▤","Marijana Content Studio","PDF, e-book i sadržaj","../marijana-content-studio/index.html"]];
const periods=[["day","Dnevno"],["week","Nedeljno"],["month","Mesečno"],["quarter","3 meseca"],["half","6 meseci"],["year","Godinu dana"]];
let period="day", tool="pen", drawing=false, last={x:0,y:0};
const nav=document.getElementById("tools-nav"), grid=document.getElementById("tools-grid");
tools.forEach(t=>{nav.innerHTML+=`<a class="nav-item" href="${t[3]}">${t[0]} <span>${t[1]}</span></a>`;grid.innerHTML+=`<a class="tool-card" href="${t[3]}"><div class="tool-icon">${t[0]}</div><strong>${t[1]}</strong><small>${t[2]}</small></a>`});
const tabs=document.getElementById("period-tabs");periods.forEach(p=>tabs.innerHTML+=`<button data-period="${p[0]}" onclick="setPeriod('${p[0]}')">${p[1]}</button>`);
const base=document.getElementById("base-date");base.value=new Date().toISOString().slice(0,10);
function iso(d){return d.toISOString().slice(0,10)} function localDate(s){const [y,m,day]=s.split("-").map(Number);return new Date(y,m-1,day)}
function shiftDate(n){const d=localDate(base.value);d.setDate(d.getDate()+n);base.value=iso(d);renderPlanner()}
function setPeriod(p){period=p;document.querySelectorAll(".period-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.period===p));renderPlanner()}
function rangeDates(){const d=localDate(base.value), out=[];let count=1,start=new Date(d);
if(period==="week"){const day=(d.getDay()+6)%7;start.setDate(d.getDate()-day);count=7}
if(period==="month"){start.setDate(1);count=new Date(start.getFullYear(),start.getMonth()+1,0).getDate()}
if(period==="quarter"){start.setDate(1);count=91}
if(period==="half"){start.setDate(1);count=182}
if(period==="year"){start.setMonth(0,1);count=365+(new Date(start.getFullYear(),1,29).getMonth()===1?1:0)}
for(let i=0;i<count;i++){const x=new Date(start);x.setDate(start.getDate()+i);out.push(x)}return out}
function renderPlanner(){const d=localDate(base.value), days=rangeDates();const label=periods.find(x=>x[0]===period)[1];document.getElementById("planner").innerHTML=`<div class="planner-title">${label} · ${d.toLocaleDateString("sr-RS",{month:"long",year:"numeric"})}</div><div class="planner-list">${days.map(x=>{const today=iso(x)===iso(new Date());const key="plan-"+iso(x);const saved=JSON.parse(localStorage.getItem(key)||"{}");return `<div class="day-row ${today?"today":""}"><div class="day-date"><strong>${x.getDate()}</strong>${x.toLocaleDateString("sr-RS",{weekday:"short"})}</div><label class="task-line"><input type="checkbox" ${saved.done?"checked":""} onchange="toggleDay('${key}',this.checked)"> ${saved.task||"Dodaj zadatak"}</label></div>`}).join("")}</div>`}
function toggleDay(k,v){const old=JSON.parse(localStorage.getItem(k)||"{}");localStorage.setItem(k,JSON.stringify({...old,done:v}));showToast("Plan sačuvan")}
function addNote(){const i=document.getElementById("note-input"),v=i.value.trim();if(!v)return;const arr=JSON.parse(localStorage.getItem("workspace-notes")||"[]");arr.unshift(v);localStorage.setItem("workspace-notes",JSON.stringify(arr.slice(0,20)));i.value="";renderNotes()}
function renderNotes(){const a=JSON.parse(localStorage.getItem("workspace-notes")||"[]");document.getElementById("notes").innerHTML=a.map(x=>`<div class="note">${x}</div>`).join("")} 
const canvas=document.getElementById("work-canvas"),ctx=canvas.getContext("2d");function resizeCanvas(){const r=canvas.getBoundingClientRect(),d=window.devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);ctx.fillStyle="#f7f2e8";ctx.fillRect(0,0,r.width,r.height);ctx.strokeStyle="#d9bd82";ctx.globalAlpha=.12;for(let x=20;x<r.width;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,r.height);ctx.stroke()}for(let y=20;y<r.height;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(r.width,y);ctx.stroke()}ctx.globalAlpha=1}window.addEventListener("resize",resizeCanvas);resizeCanvas();
canvas.addEventListener("pointerdown",e=>{if(tool==="text"){const t=prompt("Unesi tekst:");if(t){ctx.fillStyle="#111522";ctx.font="18px Arial";ctx.fillText(t,e.offsetX,e.offsetY)}return}drawing=true;last={x:e.offsetX,y:e.offsetY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(!drawing)return;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(e.offsetX,e.offsetY);ctx.strokeStyle=tool==="eraser"?"#f7f2e8":"#111522";ctx.lineWidth=tool==="eraser"?18:3;ctx.lineCap="round";ctx.stroke();last={x:e.offsetX,y:e.offsetY}});
canvas.addEventListener("pointerup",()=>drawing=false);canvas.addEventListener("pointercancel",()=>drawing=false);
function setTool(t){tool=t;showToast(t==="pen"?"Olovka aktivna":t==="eraser"?"Brisač aktivan":"Klikni na platno gde želiš tekst")}
function clearBoard(){if(confirm("Obrisati sadržaj radnog platna?")){localStorage.removeItem("workspace-canvas");resizeCanvas();showToast("Platno je očišćeno")}}
function saveWorkspace(){try{localStorage.setItem("workspace-canvas",canvas.toDataURL("image/png"));showToast("Radno platno je sačuvano")}catch(e){showToast("Sačuvane su beleške i planer")}}
function restoreCanvas(){const s=localStorage.getItem("workspace-canvas");if(!s)return;const im=new Image();im.onload=()=>ctx.drawImage(im,0,0,canvas.clientWidth,canvas.clientHeight);im.src=s}
function showToast(s){const t=document.getElementById("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
renderNotes();setPeriod("day");restoreCanvas();
// MARijANA CREATE — format catalog
const formatCatalog={
"Dokumenti":[
["Dokument A4","Dokument","210 × 297 mm"],["Dokument A5","Dokument","148 × 210 mm"],["Dokument A3","Dokument","297 × 420 mm"],["Letter","Letter","8.5 × 11 in"],["Legal","Legal","8.5 × 14 in"],["Executive","Executive","7.25 × 10.5 in"],["Letterhead","Letterhead","210 × 297 mm"],["Proposal","Proposal","210 × 297 mm"],["CV","CV","210 × 297 mm"],["Worksheet","Worksheet","210 × 297 mm"],["Coloring Page","Coloring Page","210 × 297 mm"],["Announcement Portrait","Announcement","210 × 297 mm"]
],
"Planeri, radne sveske & knjige":[
["Planer A4","Planer","21 × 29.7 cm"],["Radna sveska A4","Workbook","210 × 297 mm"],["Planer A5","Planer","148 × 210 mm"],["Planer A6","Planer","105 × 148 mm"],["Journal","Journal","6 × 9 in"],["E-book","E-book","6 × 9 in"],["E-book Cover","E-book Cover","512 × 800 px"],["Book Cover","Book Cover","1600 × 2560 px"],["Magazine Cover","Magazine Cover","21 × 29.7 cm"],["Album Cover","Album Cover","3000 × 3000 px"],["Magazine / Editorial","Magazine","210 × 297 mm"]
],
"Social & sadržaj":[
["Social Media — Square","Social Media","1080 × 1080 px"],["Instagram Post 4:5","Instagram","1080 × 1350 px"],["Instagram Post Square","Instagram","1080 × 1080 px"],["Your Story","Instagram Story","1080 × 1920 px"],["Facebook Post","Facebook","1200 × 630 px"],["Facebook Cover","Facebook Cover","1640 × 856 px"],["Facebook Video","Facebook Video","1080 × 1080 px"],["Animated Social Media","Social Animation","1080 × 1080 px"],["Pinterest Pin","Pinterest","1000 × 1500 px"],["LinkedIn Post","LinkedIn","1200 × 627 px"],["TikTok / Reel","Vertical Video","1080 × 1920 px"],["YouTube Thumbnail","YouTube","1280 × 720 px"],["Infographic","Infographic","800 × 2000 px"],["Photo Collage","Photo Collage","1080 × 1080 px"],["Comics Strip","Comics","1600 × 400 px"]
],
"Video, prezentacije & ekran":[
["Landscape Video","Video","1920 × 1080 px"],["HD Video","Video","1920 × 1080 px"],["4K Video","Video","3840 × 2160 px"],["Vertical Video","Video","1080 × 1920 px"],["Presentation 16:9","Presentation","1920 × 1080 px"],["Presentation 4:3","Presentation","1024 × 768 px"],["Virtual Background","Virtual Background","1920 × 1080 px"],["Desktop Wallpaper","Desktop Wallpaper","1920 × 1080 px"],["Phone Wallpaper","Phone Wallpaper","1080 × 1920 px"],["Whiteboard","Whiteboard","1920 × 1080 px"],["Animated Logo","Animated Logo","2000 × 2000 px"],["Logo","Logo","2000 × 2000 px"]
],
"Email & web":[
["E-mail","E-mail","600 × 1200 px"],["E-mail Newsletter","Newsletter","1200 × 600 px"],["Responsive Letter","Responsive","1200 × 1600 px"],["Website Desktop","Website","1440 × 900 px"],["Website Mobile","Website Mobile","390 × 844 px"],["Blog Header","Blog","1600 × 900 px"],["Email Header","Email Header","1200 × 600 px"]
],
"Brošure, kartice & štampa":[
["Brochure A4","Brochure","210 × 297 mm"],["Brochure A5","Brochure","148 × 210 mm"],["Trifold","Trifold","11 × 8.5 in"],["Note Card","Note Card","4 × 6 in"],["Postcard","Postcard","148 × 105 mm"],["Business Card","Business Card","85 × 55 mm"],["Gift Certificate","Gift Certificate","8.5 × 3.5 in"],["Tag","Tag","2 × 3.5 in"],["Label Landscape","Label","3 × 2 in"],["Bookmark","Bookmark","50 × 180 mm"],["Flyer A4","Flyer","210 × 297 mm"],["Poster A3","Poster","297 × 420 mm"],["Media Kit","Media Kit","210 × 297 mm"],["Portfolio A4","Portfolio","210 × 297 mm"],["Catalog A4","Catalog","210 × 297 mm"],["Price List A4","Price List","210 × 297 mm"],["Menu A4","Menu","210 × 297 mm"]
],
"Grafika & specijalni formati":[
["Abstract Graphic","Graphic","2000 × 2000 px"],["ABo8g Graphic","Graphic","2000 × 2000 px"],["Social Graphic","Graphic","1080 × 1080 px"],["Announcement Landscape","Announcement","1920 × 1080 px"],["Banner Landscape","Banner","72 × 36 in"],["Custom Social Digital","Social Digital","1080 × 1080 px"],["Photo / Collage","Photo","2000 × 2000 px"]
],
"Marketing & poslovanje":[
["Media Kit","Media Kit","210 × 297 mm"],["Business Presentation","Presentation","1920 × 1080 px"],["Proposal","Proposal","210 × 297 mm"],["CV / Resume","CV","210 × 297 mm"],["Letterhead","Letterhead","210 × 297 mm"],["Business Card","Business Card","85 × 55 mm"],["Certificate","Certificate","297 × 210 mm"],["Price List","Price List","210 × 297 mm"],["Coupon","Coupon","210 × 99 mm"]
]
};

let formatCategory=Object.keys(formatCatalog)[0];
function renderFormats(){
const tabs=document.getElementById("format-tabs"),grid=document.getElementById("format-grid");if(!tabs||!grid)return;
tabs.innerHTML=Object.keys(formatCatalog).map(c=>`<button class="${c===formatCategory?"active":""}" onclick="selectCategory('${c}')">${c}</button>`).join("");
grid.innerHTML=formatCatalog[formatCategory].map((f,i)=>`<div class="format-card" onclick="selectFormat('${formatCategory}',${i})"><div class="format-icon">▤</div><strong>${f[0]}</strong><small>${f[2]}</small></div>`).join("");
}
function selectCategory(c){formatCategory=c;renderFormats()}
function selectFormat(c,i){const f=formatCatalog[c][i];document.getElementById("selected-format").innerHTML=`<b>${f[0]}</b> · ${f[2]}`;const dims=f[2].split(" × ");if(dims.length===2){const nums=dims.map(x=>parseFloat(x));if(nums.every(Number.isFinite)){document.getElementById("custom-w").value=nums[0];document.getElementById("custom-h").value=nums[1];document.getElementById("custom-unit").value=f[2].includes("px")?"px":f[2].includes("in")?"in":"mm"}}}
function createDesign(){const name=document.getElementById("design-name").value.trim()||"Novi dizajn";const w=Number(document.getElementById("custom-w").value),h=Number(document.getElementById("custom-h").value),u=document.getElementById("custom-unit").value;if(!w||!h)return showToast("Unesi širinu i visinu");const arr=JSON.parse(localStorage.getItem("marijana-designs")||"[]");arr.unshift({name,w,h,u,category:formatCategory,created:new Date().toISOString()});localStorage.setItem("marijana-designs",JSON.stringify(arr.slice(0,50)));renderCreated();showToast("Dizajn je kreiran");document.getElementById("design-name").value=""}
function renderCreated(){const el=document.getElementById("created-designs");if(!el)return;const a=JSON.parse(localStorage.getItem("marijana-designs")||"[]");el.innerHTML=a.map(x=>`<div class="created-design"><b>${x.name}</b><span>${x.w} × ${x.h} ${x.u} · ${x.category}</span></div>`).join("")}
renderFormats();renderCreated();
let documentState={pages:[{background:"#f7f2e8",blocks:[{type:"title",text:"Naslov dokumenta",size:38,align:"left"},{type:"text",text:"Klikni ovde i počni da radiš.",size:18,align:"left"}]}],current:0};
function renderPages(){const el=document.getElementById("page-list");if(!el)return;el.innerHTML=documentState.pages.map((p,i)=>`<div class="page-thumb ${i===documentState.current?"active":""}" onclick="selectPage(${i})">Stranica ${i+1}</div>`).join("");document.getElementById("page-count").value=documentState.pages.length;renderDocumentPage()}
function selectPage(i){documentState.current=i;renderPages()}
let dragState=null;
function bindCanvasInteractions(){
const page=document.getElementById("document-page");if(!page)return;
page.querySelectorAll(".block").forEach((node,i)=>{
node.addEventListener("pointerdown",e=>{
if(e.target.closest("[contenteditable]")&&e.target===node)return;
selectedBlock=i;renderDocumentPage();selectBlock(i);
const b=documentState.pages[documentState.current].blocks[i];
const rect=page.getBoundingClientRect();
dragState={i,startX:e.clientX,startY:e.clientY,origX:b.x||0,origY:b.y||0,rect};
node.setPointerCapture?.(e.pointerId);e.preventDefault();
});
node.addEventListener("pointermove",e=>{
if(!dragState||dragState.i!==i)return;
const b=documentState.pages[documentState.current].blocks[i];
b.x=dragState.origX+e.clientX-dragState.startX;
b.y=dragState.origY+e.clientY-dragState.startY;
renderDocumentPage();selectBlock(i);
});
node.addEventListener("pointerup",()=>{if(dragState?.i===i){dragState=null;saveDocumentSilent()}});
});
}
function saveDocumentSilent(){localStorage.setItem("marijana-document",JSON.stringify(documentState))}
function renderDocumentPage(){
const p=documentState.pages[documentState.current],el=document.getElementById("document-page");if(!el)return;
el.style.background=p.background||"#f7f2e8";
el.innerHTML=p.blocks.map((b,i)=>{
if(b.type==="box")return `<div class="block box-block" contenteditable="true" oninput="updateBlock(${i},this.innerText)" style="text-align:${b.align||"left"};font-size:${b.size||18}px">${escapeHtml(b.text||"")}</div>`;
if(b.type==="shape")return `<div class="block shape-block shape-${b.shape}" onclick="selectBlock(${i})" style="background:${b.shape==="line"?"transparent":b.color||"#d9bd82"};border-color:${b.color||"#d9bd82"};transform:rotate(${b.rotation||0}deg);position:relative;left:${b.x||0}px;top:${b.y||0}px"></div>`;
if(b.type==="image")return `<div class="block image-block" onclick="selectBlock(${i})" style="text-align:${b.align||"center"};transform:rotate(${b.rotation||0}deg);position:relative;left:${b.x||0}px;top:${b.y||0}px"><img src="${b.src}" alt="" style="width:${b.width||70}%"></div>`;
const cls=b.type==="title"?"title-block":b.type==="heading"?"heading-block":"";
return `<div class="block ${cls}" contenteditable="true" onclick="selectBlock(${i})" oninput="updateBlock(${i},this.innerText)" style="text-align:${b.align||"left"};font-size:${b.size||""}px;transform:rotate(${b.rotation||0}deg);position:relative;left:${b.x||0}px;top:${b.y||0}px">${escapeHtml(b.text||"")}</div>`;
}).join("")+`<div class="page-meta">Stranica ${documentState.current+1}</div>`;bindCanvasInteractions();
}
let selectedBlock=-1, clipboardBlock=null, undoStack=[], redoStack=[];
function snapshot(){return JSON.stringify(documentState)}
function pushHistory(){undoStack.push(snapshot());if(undoStack.length>40)undoStack.shift();redoStack=[]}
function restoreSnapshot(s){try{documentState=JSON.parse(s);selectedBlock=-1;renderPages()}catch(e){}}
function undoAction(){if(!undoStack.length)return showToast("Nema prethodne radnje");redoStack.push(snapshot());restoreSnapshot(undoStack.pop());showToast("Undo")}
function redoAction(){if(!redoStack.length)return showToast("Nema radnje za ponavljanje");undoStack.push(snapshot());restoreSnapshot(redoStack.pop());showToast("Redo")}
function deleteSelected(){if(selectedBlock<0)return showToast("Prvo izaberi element");pushHistory();documentState.pages[documentState.current].blocks.splice(selectedBlock,1);selectedBlock=-1;renderDocumentPage();showToast("Element je obrisan")}
function duplicateSelected(){if(selectedBlock<0)return showToast("Prvo izaberi element");pushHistory();const b=JSON.parse(JSON.stringify(documentState.pages[documentState.current].blocks[selectedBlock]));b.x=(b.x||0)+18;b.y=(b.y||0)+18;documentState.pages[documentState.current].blocks.splice(selectedBlock+1,0,b);selectedBlock++;renderDocumentPage();selectBlock(selectedBlock);showToast("Element je dupliran")}
function copySelected(){if(selectedBlock<0)return showToast("Prvo izaberi element");clipboardBlock=JSON.parse(JSON.stringify(documentState.pages[documentState.current].blocks[selectedBlock]));showToast("Element je kopiran")}
function pasteSelected(){if(!clipboardBlock)return showToast("Nema kopiranog elementa");pushHistory();const b=JSON.parse(JSON.stringify(clipboardBlock));b.x=(b.x||0)+30;b.y=(b.y||0)+30;documentState.pages[documentState.current].blocks.push(b);selectedBlock=documentState.pages[documentState.current].blocks.length-1;renderDocumentPage();selectBlock(selectedBlock);showToast("Element je nalepljen")}
function selectBlock(i){selectedBlock=i;renderDocumentPage();const node=document.querySelector('#document-page .block:nth-child('+(i+1)+')');if(node)node.classList.add('selected');const b=documentState.pages[documentState.current].blocks[i];if(b){if(document.getElementById("text-size"))document.getElementById("text-size").value=b.size||18;if(document.getElementById("element-color"))document.getElementById("element-color").value=b.color||"#d9bd82";if(document.getElementById("element-width"))document.getElementById("element-width").value=b.width||70;if(document.getElementById("text-align"))document.getElementById("text-align").value=b.align||"left";}}
function moveLayer(direction){
if(selectedBlock<0)return showToast("Prvo izaberi element");
const blocks=documentState.pages[documentState.current].blocks;const target=selectedBlock+direction;
if(target<0||target>=blocks.length)return;
[blocks[selectedBlock],blocks[target]]=[blocks[target],blocks[selectedBlock]];
selectedBlock=target;renderDocumentPage();selectBlock(target);showToast(direction>0?"Element je pomeren napred":"Element je pomeren nazad");
}
function rotateSelected(deg){
if(selectedBlock<0)return showToast("Prvo izaberi element");
const b=documentState.pages[documentState.current].blocks[selectedBlock];b.rotation=(b.rotation||0)+deg;renderDocumentPage();selectBlock(selectedBlock);showToast("Element je rotiran");
}
function applyElementColor(){
if(selectedBlock<0)return showToast("Prvo izaberi element");
const b=documentState.pages[documentState.current].blocks[selectedBlock];b.color=document.getElementById("element-color").value;renderDocumentPage();selectBlock(selectedBlock);
}
function addShapeBlock(shape){pushHistory();
const defaults={rect:{w:240,h:120},circle:{w:120,h:120},line:{w:260,h:3},frame:{w:240,h:160}};
const d=defaults[shape]||defaults.rect;
documentState.pages[documentState.current].blocks.push({type:"shape",shape,color:document.getElementById("element-color")?.value||"#d9bd82",width:d.w,height:d.h});
selectedBlock=documentState.pages[documentState.current].blocks.length-1;renderDocumentPage();selectBlock(selectedBlock);showToast("Element je dodat");
}
function applyElementWidth(){
if(selectedBlock<0)return showToast("Prvo izaberi element");
const b=documentState.pages[documentState.current].blocks[selectedBlock];
if(b.type!=="image")return showToast("Širina se trenutno menja za slike");
b.width=Math.max(10,Math.min(100,Number(document.getElementById("element-width").value)||70));
renderDocumentPage();selectBlock(selectedBlock);
}
function applyTextStyle(){
if(selectedBlock<0)return showToast("Prvo izaberi element");
const b=documentState.pages[documentState.current].blocks[selectedBlock];b.size=Number(document.getElementById("text-size").value)||18;b.align=document.getElementById("text-align").value||"left";renderDocumentPage();selectBlock(selectedBlock);
}
function setPageBackground(color){pushHistory();documentState.pages[documentState.current].background=color;renderDocumentPage()}
function addImageBlock(event){pushHistory();
const file=event.target.files?.[0];if(!file)return;
const reader=new FileReader();reader.onload=()=>{documentState.pages[documentState.current].blocks.push({type:"image",src:reader.result,width:70,align:"center"});renderDocumentPage();selectedBlock=documentState.pages[documentState.current].blocks.length-1;showToast("Slika je dodata");event.target.value=""};reader.readAsDataURL(file);
}

function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function updateBlock(i,text){documentState.pages[documentState.current].blocks[i].text=text}
function addPage(){documentState.pages.push({blocks:[{type:"heading",text:"Nova stranica"},{type:"text",text:"Novi sadržaj…"}]});documentState.current=documentState.pages.length-1;renderPages()}
function duplicatePage(){const copy=JSON.parse(JSON.stringify(documentState.pages[documentState.current]));documentState.pages.splice(documentState.current+1,0,copy);documentState.current++;renderPages();showToast("Stranica je duplirana")}
function deletePage(){if(documentState.pages.length<=1)return showToast("Dokument mora imati najmanje jednu stranicu");documentState.pages.splice(documentState.current,1);documentState.current=Math.max(0,documentState.current-1);renderPages();showToast("Stranica je obrisana")}
function addTextBlock(){pushHistory();documentState.pages[documentState.current].blocks.push({type:"text",text:"Novi tekst…",size:18,align:"left"});renderDocumentPage()}
function addHeadingBlock(){pushHistory();documentState.pages[documentState.current].blocks.push({type:"heading",text:"Novi naslov",size:25,align:"left"});renderDocumentPage()}
function addBoxBlock(){pushHistory();documentState.pages[documentState.current].blocks.push({type:"box",text:"",size:18,align:"left"});renderDocumentPage()}
function setPageCount(n){n=Math.max(1,Math.min(300,Number(n)||1));while(documentState.pages.length<n)documentState.pages.push({blocks:[{type:"heading",text:"Nova stranica"},{type:"text",text:""}]});while(documentState.pages.length>n)documentState.pages.pop();documentState.current=Math.min(documentState.current,n-1);renderPages()}
async function applyBrandKit(){
try{
const r=await fetch("../api/brand-kit.js",{credentials:"include"});
if(!r.ok)throw new Error("Brand Kit nije dostupan");
const data=await r.json();const kit=data?.brandKit||data?.data;
if(!kit)return showToast("Prvo sačuvaj Brand Kit u Marijana Alhemija");
const colors=kit.colors||kit.palette?.colors||[];
if(colors[0])documentState.pages[documentState.current].background=colors[0];
renderDocumentPage();showToast("Brand Kit je primenjen");
}catch(e){showToast("Brand Kit nije povezan sa nalogom")}
}
async function saveDocument(){
localStorage.setItem("marijana-document",JSON.stringify(documentState));
try{
const r=await fetch("../api/projects",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({
name:"Marijana Creator — "+new Date().toLocaleDateString("sr-RS"),
type:"creator_document",status:"draft",data:documentState
})});
if(!r.ok)throw new Error("cloud");
showToast("Dokument je sačuvan u Marijana Drive");
}catch(e){showToast("Dokument je sačuvan lokalno")}
}
function loadDocument(){try{const x=JSON.parse(localStorage.getItem("marijana-document")||"null");if(x?.pages?.length)documentState=x}catch(e){}renderPages()}
loadDocument();

const templateCatalog=[
{id:"planner",cat:"Planeri",icon:"◫",name:"Planer A4",desc:"Dnevni, nedeljni i mesečni planer.",blocks:["Planer","Ciljevi","Prioriteti","Beleške"]},
{id:"workbook",cat:"Dokumenti",icon:"▤",name:"Radna sveska A4",desc:"Struktura za edukativnu radnu svesku.",blocks:["Naslov","Uvod","Lekcija","Vežba","Beleške"]},
{id:"ebook",cat:"Knjige",icon:"▥",name:"E-book",desc:"Višestranična struktura za digitalnu knjigu.",blocks:["Naslov","Sadržaj","Poglavlje","Zaključak"]},
{id:"brochure",cat:"Štampa",icon:"▦",name:"Brošura A4",desc:"Višestranična poslovna ili promotivna brošura.",blocks:["Naslov","O nama","Usluga","Ponuda","Kontakt"]},
{id:"pin",cat:"Društvene mreže",icon:"◆",name:"Pinterest Pin",desc:"Vertikalni format za Pinterest sadržaj.",blocks:["Naslov","Podnaslov","CTA"]},
{id:"instagram",cat:"Društvene mreže",icon:"◎",name:"Instagram 4:5",desc:"Struktura za Instagram objavu.",blocks:["Naslov","Glavna poruka","CTA"]},
{id:"newsletter",cat:"Email",icon:"✉",name:"Newsletter",desc:"Jednostavan newsletter sa naslovom, sadržajem i CTA.",blocks:["Naslov","Uvod","Sadržaj","CTA"]},
{id:"cv",cat:"Poslovanje",icon:"▥",name:"CV / Resume",desc:"Profesionalna struktura CV dokumenta.",blocks:["Ime i pozicija","Profil","Iskustvo","Veštine","Kontakt"]},
{id:"presentation",cat:"Prezentacije",icon:"▣",name:"Prezentacija 16:9",desc:"Osnovni poslovni pitch deck.",blocks:["Naslov","Problem","Rešenje","Ponuda","Zaključak"]},
{id:"leadmagnet",cat:"Marketing",icon:"✦",name:"Lead Magnet",desc:"Struktura besplatnog vodiča za prikupljanje potencijalnih kupaca.",blocks:["Naslov","Problem","Rešenje","Koraci","CTA"]},
{id:"checklist",cat:"Marketing",icon:"☑",name:"Checklist",desc:"Praktična lista zadataka ili provera.",blocks:["Naslov","Uputstvo","Lista","Napomena"]},
{id:"worksheet",cat:"Dokumenti",icon:"□",name:"Radni list",desc:"Jednostavan radni list za popunjavanje.",blocks:["Naslov","Pitanje","Prostor za odgovor","Sledeći korak"]}
];
let templateCategory="Sve";
function renderTemplates(){
const search=(document.getElementById("template-search")?.value||"").toLowerCase();
const cats=["Sve",...new Set(templateCatalog.map(x=>x.cat))];
document.getElementById("template-categories").innerHTML=cats.map(x=>`<button class="template-cat ${x===templateCategory?"active":""}" onclick="templateCategory='${x}';renderTemplates()">${x}</button>`).join("");
const list=templateCatalog.filter(x=>(templateCategory==="Sve"||x.cat===templateCategory)&&(!search||x.name.toLowerCase().includes(search)||x.desc.toLowerCase().includes(search)));
document.getElementById("template-grid").innerHTML=list.map(x=>`<div class="template-card"><div class="template-icon">${x.icon}</div><h3>${x.name}</h3><p>${x.desc}</p><button onclick="openTemplate('${x.id}')">Otvori u Creator-u</button></div>`).join("");
}
async function openTemplate(id){
const t=templateCatalog.find(x=>x.id===id);if(!t)return;
const blocks=t.blocks.map((text,i)=>({type:i===0?"title":i===1?"heading":"text",text,size:i===0?34:i===1?24:18,align:"left"}));
documentState={pages:[{background:"#f7f2e8",blocks}],current:0};
localStorage.setItem("marijana-document",JSON.stringify(documentState));
renderPages();
try{
 const r=await fetch("../api/projects",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({
  name:"Marijana Creator — "+t.name,
  type:"creator_document",
  status:"draft",
  data:{templateId:t.id,templateName:t.name,category:t.cat,document:documentState,source:"Biblioteka šablona"}
 })});
 if(!r.ok)throw new Error("cloud");
 showToast(t.name+" je otvoren i sačuvan kao cloud projekat.");
}catch(e){showToast(t.name+" je otvoren u Creator-u; cloud čuvanje će biti moguće nakon prijave.");}
document.getElementById("creator-editor")?.scrollIntoView({behavior:"smooth"});
}
renderTemplates();
