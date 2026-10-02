import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const workerId=String(body.worker_id||"");
  const q=await query("SELECT q.id,q.execution_id,q.attempts,e.operation FROM system_queue q JOIN system_executions e ON e.id=q.execution_id WHERE q.user_id=$1 AND q.status='queued' AND q.available_at<=NOW() ORDER BY q.priority DESC,q.created_at ASC LIMIT 1",[userId]);
  if(!q.rowCount)return res.status(200).json({ok:true,status:"idle",message:"Nema poslova u redu."});
  const item=q.rows[0];
  await query("UPDATE system_queue SET status='running',attempts=attempts+1,locked_at=NOW(),locked_by=$1,updated_at=NOW() WHERE id=$2",[workerId||null,item.id]);
  await query("UPDATE system_executions SET status='running',attempts=attempts+1,started_at=COALESCE(started_at,NOW()),updated_at=NOW() WHERE id=$1 AND user_id=$2",[item.execution_id,userId]);
  return res.status(200).json({ok:true,status:"running",queue_id:item.id,execution_id:item.execution_id,operation:item.operation,mode:"controlled"});
 }catch(e){console.error(e);return res.status(500).json({error:"Worker runtime nije uspeo."})}
}