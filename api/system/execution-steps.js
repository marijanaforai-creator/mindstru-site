import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const executionId=String(req.query?.execution_id||"");
   if(!executionId)return res.status(400).json({error:"Nedostaje execution_id."});
   const r=await query("SELECT id,execution_id,step_key,name,status,position,progress,detail,attempts,created_at,updated_at FROM system_execution_steps WHERE execution_id=$1 ORDER BY position ASC",[executionId]);
   return res.status(200).json({steps:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const id=newId();
   await query("INSERT INTO system_execution_steps(id,execution_id,step_key,name,status,position) VALUES($1,$2,$3,$4,'queued',$5)",[id,String(body.execution_id),String(body.step_key||id),String(body.name||"Execution step").slice(0,160),Number(body.position||0)]);
   return res.status(201).json({step:{id}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Execution steps servis nije dostupan."})}
}