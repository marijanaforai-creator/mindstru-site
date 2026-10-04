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
  const url=URL.createObjectURL(file);
  preview.src=url;
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

document.getElementById("generate").addEventListener("click",async()=>{
  if(!imageInput.files?.[0]){
    status.textContent="Prvo učitaj svoju referentnu fotografiju.";
    return;
  }
  if(!prompt.value.trim()){
    status.textContent="Napiši šta želiš da promeniš.";
    return;
  }
  status.textContent="Zahtev je pripremljen. Čekam povezivanje image providera.";
  // Namerno nema direktnog API ključa u browseru.
  // Sledeći korak: POST /api/visual-ai/private-persona sa server-side providerom.
  const payload={
    prompt:prompt.value.trim(),
    preserveIdentity:identity.checked,
    quality:quality.value,
    inputType:"reference_image"
  };
  console.debug("Moj AI Lik request",payload);
});