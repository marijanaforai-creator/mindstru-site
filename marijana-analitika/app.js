async function load(){
 try{
  const r=await fetch("/api/analytics",{credentials:"same-origin"});
  const d=await r.json(); if(!r.ok)throw new Error(d.error||"Greška");
  const pub=(d.projects.published||0)+(d.funnels.published||0);
  const revenue=((d.sales?.revenueCents||0)/100).toFixed(2)+" €";
  document.querySelector("#cards").innerHTML=
   "<div><span>Projekti</span><b>"+d.projects.count+"</b></div>"+
   "<div><span>Prodajni levci</span><b>"+d.funnels.count+"</b></div>"+
   "<div><span>Kontakti</span><b>"+(d.contacts?.total||0)+"</b></div>"+
   "<div><span>Kupci</span><b>"+(d.contacts?.buyers||0)+"</b></div>"+
   "<div><span>Automatizacije</span><b>"+(d.automations?.total||0)+"</b></div>"+
   "<div><span>Email izvršavanja</span><b>"+(d.emailSequences?.total||0)+"</b></div>"+
   "<div><span>Materijali</span><b>"+d.assets.count+"</b></div>"+
   "<div><span>Prihod</span><b>"+revenue+"</b></div>";
  const max=Math.max(1,...d.usage.map(x=>x.quantity));
  document.getElementById("usage").innerHTML=d.usage.length?
   d.usage.map(x=>"<div class='usage-row'><div class='usage-label'><span>"+x.feature+"</span><b>"+x.quantity+"</b></div><div class='bar'><div class='fill' style='width:"+Math.round(x.quantity/max*100)+"%'></div></div></div>").join(""):
   "<p>Nema zabeleženih aktivnosti ovog meseca.</p>";
  document.getElementById("recent").innerHTML=d.recent.length?
   d.recent.map(x=>"<div class='recent-row'><span>"+x.feature+"</span><b>"+x.quantity+"</b></div>").join(""):
   "<p>Nema aktivnosti.</p>";
 }catch(e){
  document.getElementById("usage").innerHTML="<p>Prijavi se da vidiš analitiku.</p>";
 }
}
load();