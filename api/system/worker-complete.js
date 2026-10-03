import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const queueId=String(b.queue_id||"");
  const status=String(b.status||"completed");
  if(!["completed","failed"].includes(status))return res.status(400).json({error:"Neispravan završni status."});
  const q=await query("UPDATE system_queue SET status=$1,updated_at=NOW(),locked_at=NULL,locked_by=NULL WHERE id=$2 AND user_id=$3 RETURNING execution_id",[status,queueId,userId]);
  if(!q.rowCount)return res.status(404).json({error:"Posao nije pronađen."});
  const executionId=q.rows[0].execution_id;
  await query("UPDATE system_executions SET status=$1,progress=$2,finished_at=NOW(),result=$3::jsonb,updated_at=NOW() WHERE id=$4 AND user_id=$5",[status,status==="completed"?100:0,JSON.stringify(b.result||{}),executionId,userId]);
  if(b.worker_id)await query("UPDATE system_workers SET status='idle',last_heartbeat=NOW(),updated_at=NOW() WHERE id=$1 AND user_id=$2",[String(b.worker_id),userId]);
  return res.status(200).json({ok:true,execution_id:executionId,status});
 }catch(error){console.error(error);return res.status(500).json({error:"Završetak posla nije sačuvan."});}
}