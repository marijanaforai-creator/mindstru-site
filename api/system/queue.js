import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT q.id,q.execution_id,q.priority,q.status,q.available_at,q.attempts,q.locked_at,e.operation,e.target,e.progress FROM system_queue q LEFT JOIN system_executions e ON e.id=q.execution_id WHERE q.user_id=$1 ORDER BY q.status,q.priority DESC,q.created_at DESC LIMIT 100",[userId]);
   return res.status(200).json({queue:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),executionId=String(body.execution_id||"");
   if(!executionId)return res.status(400).json({error:"Nedostaje execution_id."});
   const id=newId(),priority=Math.max(1,Math.min(100,Number(body.priority||50)));
   await query("INSERT INTO system_queue(id,user_id,execution_id,priority,status) VALUES($1,$2,$3,$4,'queued')",[id,userId,executionId,priority]);
   return res.status(201).json({queue_item:{id,execution_id:executionId,priority,status:"queued"}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Queue servis nije dostupan."})}
}