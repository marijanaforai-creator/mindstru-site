let objects=[],selected=-1,drag=null,viewMode='2d';
const scene=document.getElementById('scene'),imgInput=document.getElementById('imageInput');
const presets={
 phone:{type:'phone',x:255,y:85,w:190,h:380,r:0,rx:0,ry:0,depth:25,perspective:1200},
 tablet:{type:'tablet',x:200,y:55,w:320,h:450,r:0,rx:0,ry:0,depth:25,perspective:1200},
 frame:{type:'frame',x:215,y:80,w:290,h:370,r:0,rx:0,ry:0,depth:35,perspective:1200},
 desk:{type:'phone',x:470,y:110,w:170,h:340,r:0,rx:5,ry:-18,depth:45,perspective:1000},
 wall:{type:'frame',x:230,y:80,w:290,h:370,r:-2,rx:0,ry:-12,depth:35,perspective:1100},
 minimal:{type:'poster',x:250,y:75,w:250,h:350,r:0,rx:0,ry:0,depth:10,perspective:1200},
 '3d':{type:'scene3d',x:230,y:180,w:260,h:180,r:0,rx:12,ry:-22,depth:70,perspective:900},
 webwall:{type:'panel3d',x:180,y:90,w:250,h:360,r:0,rx:0,ry:-22,depth:25,perspective:950},
 isometric:{type:'panel3d',x:210,y:100,w:280,h:210,r:0,rx:58,ry:-32,depth:55,perspective:850}
};
function uid(){return Math.random().toString(36).slice(2)}
function addObject(type,extra={}){
 const o={id:uid(),type,x:120+objects.length*18,y:80+objects.length*12,w:200,h:220,r:0,rx:0,ry:0,depth:25,perspective:1200,color:'#63c8ff',src:null,fit:'contain',zoom:1,ox:0,oy:0,...extra};
 if(presets[type]) Object.assign(o,presets[type],extra);
 objects.push(o);selected=objects.length-1;render()
}
function imageTag(o,cls=''){
 if(!o.src)return '';
 const fit=o.fit==='cover'?'cover':'contain';
 const z=o.zoom||1,x=o.ox||0,y=o.oy||0;
 return '<img class="'+cls+' '+fit+'" src="'+o.src+'" style="transform:translate('+x+'%,'+y+'%) scale('+z+');">';
}
function markup(o,i){
 let inner='';
 if(['phone','tablet','laptop','monitor'].includes(o.type))inner='<div class="screen">'+imageTag(o)+'</div>';
 if(['frame','magazine'].includes(o.type))inner='<div class="art">'+imageTag(o)+'</div>';
 if(['poster','book','card','image','panel3d','wall3d'].includes(o.type))inner=imageTag(o);
 if(o.type==='text')inner=o.text||'Tekst';
 const classes=['obj',o.type,i===selected?'selected':''].filter(Boolean).join(' ');
 const transform='perspective('+o.perspective+'px) rotateX('+o.rx+'deg) rotateY('+o.ry+'deg) rotateZ('+o.r+'deg) translateZ('+o.depth+'px)';
 const bg=o.type==='shape'||o.type==='circle'?o.color:'';
 return '<div class="'+classes+'" data-i="'+i+'" style="left:'+o.x+'px;top:'+o.y+'px;width:'+o.w+'px;height:'+o.h+'px;transform:'+transform+';background:'+bg+'">'+inner+'</div>'
}
function render(){
 scene.innerHTML=objects.map(markup).join('');
 scene.querySelectorAll('.obj').forEach(el=>{
  el.addEventListener('pointerdown',startDrag);
  el.addEventListener('click',()=>{selected=Number(el.dataset.i);renderInspector()})
 });
 renderInspector()
}
function startDrag(e){
 const el=e.currentTarget;selected=Number(el.dataset.i);const o=objects[selected];
 drag={sx:e.clientX,sy:e.clientY,x:o.x,y:o.y};el.setPointerCapture?.(e.pointerId);
 window.onpointermove=ev=>{if(!drag)return;o.x=drag.x+(ev.clientX-drag.sx);o.y=drag.y+(ev.clientY-drag.sy);render()};
 window.onpointerup=()=>{drag=null;window.onpointermove=null}
}
function renderInspector(){
 const o=objects[selected];
 document.getElementById('emptyInspector').classList.toggle('hidden',!o);
 document.getElementById('inspectorForm').classList.toggle('hidden',!o);
 if(!o)return;
 const values={objName:o.type,objX:o.x,objY:o.y,objW:o.w,objH:o.h,objR:o.r,objRX:o.rx,objRY:o.ry,objPerspective:o.perspective,objDepth:o.depth,objFit:o.fit,objZoom:o.zoom,objOX:o.ox,objOY:o.oy,objColor:o.color};
 for(const [id,val] of Object.entries(values)){const el=document.getElementById(id);if(el)el.value=val}
}
function applyInspector(){
 const o=objects[selected];if(!o)return;
 o.x=+objX.value;o.y=+objY.value;o.w=+objW.value;o.h=+objH.value;o.r=+objR.value;o.rx=+objRX.value;o.ry=+objRY.value;
 o.perspective=+objPerspective.value;o.depth=+objDepth.value;o.fit=objFit.value;o.zoom=+objZoom.value;o.ox=+objOX.value;o.oy=+objOY.value;o.color=objColor.value;
 render()
}
function setViewMode(mode){viewMode=mode;scene.dataset.view=mode;document.getElementById('stage').classList.toggle('mode-3d',mode==='3d');render()}
function rotateSelected(n){if(selected<0)return;objects[selected].r+=n;render()}
function rotateAxis(axis,n){if(selected<0)return;objects[selected]['r'+axis.toUpperCase()]+=n;render()}
function bringFront(){if(selected<0)return;const o=objects.splice(selected,1)[0];objects.push(o);selected=objects.length-1;render()}
function sendBack(){if(selected<0)return;const o=objects.splice(selected,1)[0];objects.unshift(o);selected=0;render()}
function deleteSelected(){if(selected<0)return;objects.splice(selected,1);selected=Math.min(selected,objects.length-1);render()}
function resetScene(){objects=[];selected=-1;addObject('phone');render()}
function loadTemplate(k){
 const p=presets[k];if(!p)return;objects=[];addObject(p.type,p);
 if(k==='desk')addObject('shape',{x:100,y:470,w:520,h:35,color:'#8ea386'});
 if(k==='3d')addObject('shape',{x:170,y:390,w:390,h:30,color:'#d9b66f'});
 if(k==='webwall'){addObject('panel3d',{x:450,y:110,w:250,h:360,rx:0,ry:22,depth:25});addObject('panel3d',{x:320,y:105,w:250,h:360,rx:0,ry:0,depth:20})}
 if(k==='isometric'){addObject('panel3d',{x:430,y:140,w:250,h:200,rx:58,ry:30,depth:45});addObject('panel3d',{x:120,y:300,w:280,h:210,rx:58,ry:28,depth:45})}
 render()
}
function duplicateScene(){const copy=objects.map(o=>({...o,id:uid(),x:o.x+20,y:o.y+20}));objects.push(...copy);render()}
function showPanel(name){document.querySelectorAll('.panel-view').forEach(x=>x.classList.add('hidden'));document.getElementById('panel-'+name).classList.remove('hidden')}
function saveMockup(){localStorage.setItem('marijana-mockup-draft',JSON.stringify({viewMode,objects}));alert('Mockup sačuvan kao radna verzija.')}
imgInput.addEventListener('change',e=>{
 const f=e.target.files?.[0];if(!f)return;
 const reader=new FileReader();
 reader.onload=()=>{
  if(selected>=0)objects[selected].src=reader.result;
  else addObject('image',{src:reader.result,x:180,y:100,w:300,h:300});
  render()
 };
 reader.readAsDataURL(f)
});
document.getElementById('scale').addEventListener('input',e=>{
 if(selected>=0){const o=objects[selected],s=+e.target.value;o.baseW=o.baseW||o.w;o.baseH=o.baseH||o.h;o.w=o.baseW*s;o.h=o.baseH*s;render()}
});
resetScene();