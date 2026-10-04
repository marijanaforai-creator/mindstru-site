const imageInput=document.getElementById("image");
const preview=document.getElementById("previewImage");
const empty=document.getElementById("previewEmpty");
const prompt=document.getElementById("prompt");
const status=document.getElementById("status");
const identity=document.getElementById("identity");
const quality=document.getElementById("quality");

imageInput.addEventListener("change",()=>{
  const file=imageInput.files?.[0];
  if(!file)return;
  preview.src=URL.createObjectURL(file);
  preview.hidden=false;
  empty.hidden=true;
  status.textContent="Referentna fotografija je učitana.";
});

document.querySelectorAll("[data-preset]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const value=btn.dataset.preset;
    prompt.value=prompt.value?prompt.value+" "+value:value;
    prompt.focus();
  });
});

function fileToDataUrl(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=()=>reject(new Error("Fotografija nije mogla da se učita."));
    reader.readAsDataURL(file);
  });
}

document.getElementById("generate").addEventListener("click",async()=>{
  const file=imageInput.files?.[0];
  if(!file){status.textContent="Prvo učitaj svoju referentnu fotografiju.";return;}
  if(!prompt.value.trim()){status.textContent="Napiši šta želiš da promeniš.";return;}

  const button=document.getElementById("generate");
  button.disabled=true;
  button.textContent="Generišem…";
  status.textContent="AI obrađuje tvoju fotografiju…";

  try{
    const imageData=await fileToDataUrl(file);
    const response=await fetch("/api/visual-ai/private-persona",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt:prompt.value.trim(),preserveIdentity:identity.checked,quality:quality.value,imageData})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||"Generisanje nije uspelo.");

    preview.src="data:image/png;base64,"+data.imageData;
    preview.hidden=false;
    empty.hidden=true;
    status.textContent="Gotovo — generisana fotografija je spremna.";
  }catch(error){
    status.textContent=error.message||"Došlo je do greške.";
  }finally{
    button.disabled=false;
    button.textContent="Generiši moj izgled";
  }
});
