import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const event=await query("SELECT * FROM system_runtime_events WHERE user_id=$1 AND processed=FALSE ORDER BY created_at ASC LIMIT 1",[userId]);
  if(!event.rowCount)return res.status(200).json({status:"empty",poruka:"Nema događaja za obradu."});
  const e=event.rows[0];
  const triggers=await query("SELECT * FROM system_runtime_triggers WHERE user_id=$1 AND event_type=$2 AND enabled=TRUE",[userId,e.event_type]);
  const jobs=[];
  for(const t of triggers.rows){
   const executionId=newId();
   await query("INSERT INTO system_executions(id,user_id,operation,target,status,progress,payload) VALUES($1,$2,$3,'runtime','queued',0,$4::jsonb)",[executionId,userId,t.operation,JSON.stringify({...t.payload,event_id:e.id,event:e.payload})]);
   await query("INSERT INTO system_queue(id,user_id,execution_id,priority) VALUES($1,$2,$3,50)",[newId(),userId,executionId]);
   jobs.push(executionId);
  }
  await query("UPDATE system_runtime_events SET processed=TRUE,processed_at=NOW() WHERE id=$1 AND user_id=$2",[e.id,userId]);
  return res.status(200).json({status:"dispatched",event_id:e.id,poslovi:jobs});
 }catch(error){console.error(error);return res.status(500).json({error:"Runtime događaj nije prosleđen."});}
}