import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,name,status,trigger_type,config,created_at,updated_at FROM automations WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100",[userId]);
   return res.status(200).json({automations:r.rows});
  }
  if(req.method==="POST"){
   const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const id=newId(),name=String(b.name||"Nova automatizacija").trim().slice(0,255);
   const triggerType=String(b.triggerType||"manual").slice(0,80);
   const config=b.config&&typeof b.config==="object"?b.config:{};
   await query("INSERT INTO automations(id,user_id,name,status,trigger_type,config) VALUES($1,$2,$3,'draft',$4,$5::jsonb)",[id,userId,name,triggerType,JSON.stringify(config)]);
   return res.status(201).json({automation:{id,name,status:"draft",trigger_type:triggerType,config}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Automatizacije trenutno nisu dostupne."})}
}