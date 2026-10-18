const $=id=>document.getElementById(id);
const state={plan:'free',credits:20};
function esc(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function load(){
  fetch("/api/billing",{credentials:"same-origin"})
    .then(r=>r.ok?r.json():Promise.reject(new Error("Billing API nije dostupan")))
    .then(d=>{
      const list=d.purchases||[];
      $("list").innerHTML=list.map(x=>'<div class="purchase"><strong>'+esc(x.product_name)+'</strong><span>'+(x.amount_cents/100).toFixed(2).replace(".",",")+' '+esc(x.currency)+'</span><span>'+esc(x.provider||"—")+'</span><span>'+esc(x.status)+'</span></div>').join("")||"<p>Nema evidentiranih transakcija.</p>";
      $("billingStatus").textContent="API povezan";
    })
    .catch(()=>{
      $("list").innerHTML="<p>Transakcije trenutno nisu dostupne. Prijavi se i proveri da li je Billing API i baza podataka podešena.</p>";
      $("billingStatus").textContent="Nije potvrđena";
    });
}
function selectPlan(plan){
  const labels={creator:"Creator", "3d_pro":"3D Pro", business:"Business"};
  if(!labels[plan])return;
  state.plan=plan;
  $("planStatus").textContent="Pregled izbora: "+labels[plan]+" — plan nije aktiviran";
  alert("Izabrala si "+labels[plan]+" za pregled. Plan nije aktiviran i pretplata nije naplaćena; checkout još nije povezan.");
}
function applyCoupon(){
  const code=$("coupon").value.trim().toUpperCase();
  if(!code){$("couponResult").textContent="Unesi promo kod.";return}
  $("couponResult").textContent="Kod "+code+" nije validiran niti primenjen. Provera kupona biće aktivna tek kada se poveže produkcioni Billing i checkout.";
}
function buyCredits(amount,price){
  $("couponResult").textContent="";
  alert("Paket od "+amount+" kredita po ceni od "+String(price).replace(".",",")+" € je samo prikaz ponude. Krediti nisu dodati i kupovina nije izvršena jer naplata još nije povezana.");
}
$("refresh").onclick=load;
load();
