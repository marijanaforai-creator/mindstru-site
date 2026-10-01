import { requireUser } from "../_lib/auth.js";

const library=[
 {id:"welcome-email",category:"Email",title:"Welcome Email sekvenca",tier:"free",description:"Osnovni prompt za dobrodošlicu novom leadu."},
 {id:"sales-email",category:"Email",title:"Prodajna Email sekvenca",tier:"premium",description:"Napredni paket promptova za prodajnu sekvencu."},
 {id:"lead-magnet",category:"Funnel",title:"Lead Magnet Generator",tier:"free",description:"Prompt za kreiranje korisnog lead magneta."},
 {id:"landing-page",category:"Funnel",title:"Landing Page Copy",tier:"premium",description:"Napredni promptovi za strukturu i copy prodajne stranice."},
 {id:"pinterest-seo",category:"Pinterest",title:"Pinterest SEO Pack",tier:"premium",description:"Promptovi za naslove, opise i ključne reči."},
 {id:"product-description",category:"Product",title:"Opis digitalnog proizvoda",tier:"free",description:"Prompt za jasniji opis proizvoda i koristi."},
 {id:"offer",category:"Funnel",title:"Offer Builder",tier:"premium",description:"Promptovi za strukturiranje ponude i CTA."}
];

export default function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  return res.status(200).json({prompts:library,categories:[...new Set(library.map(x=>x.category))]});
 }catch(e){return res.status(500).json({error:"Prompt Library nije dostupna."})}
}
