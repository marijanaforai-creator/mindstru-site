import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,name,event_type,operation,enabled,conditions,payload,created_at,updated_at FROM system_runtime_triggers WHERE user_id=$1 ORDER BY updated_at DESC",[userId]);
   return res.status(200).json({okidaci:r.rows});
  }
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const id=newId();
  await query("INSERT INTO system_runtime_triggers(id,user_id,name,event_type,operation,enabled,conditions,payload) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb)",[id,userId,String(b.name||"Novi okidač"),String(b.event_type||"manual"),String(b.operation||""),b.enabled!==false,JSON.stringify(b.conditions||{}),JSON.stringify(b.payload||{})]);
  return res.status(201).json({ok:true,id});
 }catch(error){console.error(error);return res.status(500).json({error:"Okidač nije sačuvan."});}
}