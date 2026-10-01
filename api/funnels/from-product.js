import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
    const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
    const product=b.product&&typeof b.product==="object"?b.product:{};
    const name=String(b.name||product.name||"Product Funnel").slice(0,255);
    const data={
      source:"product_system",
      product,
      stages:[
        {key:"lead_magnet",name:"Lead Magnet",status:"draft"},
        {key:"landing_page",name:"Landing Page",status:"draft"},
        {key:"thank_you",name:"Thank You Page",status:"draft"},
        {key:"email_sequence",name:"Email Sequence",status:"draft"},
        {key:"offer",name:"Offer",status:"draft"},
        {key:"checkout",name:"Checkout",status:"draft"},
        {key:"follow_up",name:"Follow-up",status:"draft"}
      ]
    };
    const id=newId();
    await query("INSERT INTO funnels(id,user_id,name,status,data) VALUES($1,$2,$3,$4,$5::jsonb)",[id,userId,name,"draft",JSON.stringify(data)]);
    return res.status(201).json({funnel:{id,name,status:"draft",data}});
  }catch(e){console.error(e);return res.status(500).json({error:"Nije moguće napraviti funnel iz proizvoda."})}
}
