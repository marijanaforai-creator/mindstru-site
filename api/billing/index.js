import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,product_name,amount_cents,currency,provider,status,created_at FROM purchases WHERE user_id=$1 ORDER BY created_at DESC LIMIT 200",[userId]);
   return res.status(200).json({purchases:r.rows});
  }
  if(req.method==="POST"){
   const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const name=String(b.productName||"").trim();const amount=Math.max(0,Math.round(Number(b.amount||0)*100));
   if(!name)return res.status(400).json({error:"Naziv proizvoda je obavezan."});
   const r=await query("INSERT INTO purchases(id,user_id,product_name,product_id,amount_cents,currency,provider,status,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,'pending',$8::jsonb) RETURNING id,product_name,amount_cents,currency,provider,status,created_at",[newId(),userId,name,String(b.productId||""),amount,String(b.currency||"EUR"),String(b.provider||"pending"),JSON.stringify(b.metadata||{})]);
   return res.status(201).json({purchase:r.rows[0]});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Naplata trenutno nije dostupna."})}
}