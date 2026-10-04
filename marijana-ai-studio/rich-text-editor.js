(() => {
function initMarijanaRichEditor(){
  const editor=document.querySelector(".rich-editor"), toolbar=document.getElementById("rich-toolbar");
  if(!editor||!toolbar)return;
  const apply=()=>{
    const kit=window.MarijanaBrandKit&&window.MarijanaBrandKit.get?window.MarijanaBrandKit.get():null;if(!kit)return;
    const t=kit.typography||{};
    editor.querySelectorAll("h1").forEach(e=>e.style.fontFamily='"'+(t.heading||"Cormorant Garamond")+'",serif');
    editor.querySelectorAll("h2,h3").forEach(e=>e.style.fontFamily='"'+(t.subheading||"Playfair Display")+'",serif');
    editor.querySelectorAll("p,li").forEach(e=>e.style.fontFamily='"'+(t.body||"DM Sans")+'",sans-serif');
    const x=document.getElementById("rich-current-font");if(x)x.textContent=(t.heading||"Cormorant Garamond")+" / "+(t.subheading||"Playfair Display")+" / "+(t.body||"DM Sans");
  };
  toolbar.querySelectorAll("[data-rich-command]").forEach(b=>{b.addEventListener("mousedown",e=>e.preventDefault());b.addEventListener("click",()=>{editor.focus();try{document.execCommand(b.dataset.richCommand,false,b.dataset.richValue||null)}catch(e){}apply()})});
  toolbar.querySelectorAll("[data-rich-role]").forEach(b=>b.addEventListener("click",()=>window.MarijanaFontManager&&window.MarijanaFontManager.openForRole&&window.MarijanaFontManager.openForRole(b.dataset.richRole)));
  const select=document.getElementById("rich-template");
  if(select)select.addEventListener("change",e=>{const m={blog:'<h1>Naslov bloga</h1><h2>Uvod</h2><p>Počni da pišeš ovde…</p>',ebook:'<h1>Naslov e-knjige</h1><h2>Poglavlje 1</h2><p>Uvodni tekst poglavlja…</p>',workbook:'<h1>Naslov radne sveske</h1><h2>Vežba 1</h2><p>Instrukcija za rad…</p>',premium:'<h1>Naslov dokumenta</h1><h2>Ključna poruka</h2><p>Premium sadržaj spreman za uređivanje…</p>'};if(m[e.target.value]){editor.innerHTML=m[e.target.value];apply()}});
  document.addEventListener("marijana:typography-role-changed",apply);document.addEventListener("marijana:brand-kit-changed",apply);apply();
}
document.addEventListener("DOMContentLoaded",initMarijanaRichEditor);
})();