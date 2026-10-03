import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const id=String(req.query?.orchestration_id||"");
   if(!id)return res.status(400).json({error:"Nedostaje orchestration_id."});
   const r=await query("SELECT c.id,c.orchestration_id,c.step_id,c.name,c.status,c.state,c.created_at FROM system_checkpoints c JOIN system_orchestrations o ON o.id=c.orchestration_id WHERE c.orchestration_id=$1 AND o.user_id=$2 ORDER BY c.created_at DESC",[id,userId]);
   return res.status(200).json({checkpoints:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const id=String(body.orchestration_id||"");
   const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
   if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
   const checkpointId=newId();
   await query("INSERT INTO system_checkpoints(id,user_id,orchestration_id,step_id,name,status,state) VALUES($1,$2,$3,$4,$5,'saved',$6::jsonb)",[checkpointId,userId,id,body.step_id?String(body.step_id):null,String(body.name||"Kontrolna tačka").slice(0,160),JSON.stringify(body.state||{})]);
   return res.status(201).json({checkpoint:{id:checkpointId,status:"saved"}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Checkpoint servis nije dostupan."})}
}