import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const workerId=String(b.worker_id||"");
  if(!workerId)return res.status(400).json({error:"Nedostaje radnik."});
  const r=await query("WITH kandidat AS (SELECT id FROM system_queue WHERE user_id=$1 AND status='queued' AND available_at<=NOW() ORDER BY priority DESC,created_at ASC FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE system_queue q SET status='running',locked_at=NOW(),locked_by=$2,updated_at=NOW() FROM kandidat k WHERE q.id=k.id RETURNING q.id,q.execution_id,q.priority",[userId,workerId]);
  if(!r.rowCount)return res.status(200).json({status:"empty",poruka:"Nema spremnih poslova."});
  await query("UPDATE system_workers SET status='busy',last_heartbeat=NOW(),updated_at=NOW() WHERE id=$1 AND user_id=$2",[workerId,userId]);
  return res.status(200).json({status:"claimed",posao:r.rows[0]});
 }catch(error){console.error(error);return res.status(500).json({error:"Preuzimanje posla nije uspelo."});}
}