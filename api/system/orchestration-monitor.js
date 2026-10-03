import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const oid=String(req.query?.orchestration_id||"");
  if(!oid)return res.status(400).json({error:"Nedostaje ID orkestracije."});
  const own=await query("SELECT id,name,status,created_at,started_at,finished_at,error FROM system_orchestrations WHERE id=$1 AND user_id=$2",[oid,userId]);
  if(!own.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const steps=await query("SELECT step_key,name,status,position,parallel_group,requires_approval,checkpoint_enabled FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position",[oid]);
  const counts=steps.rows.reduce((a,s)=>{a[s.status]=(a[s.status]||0)+1;return a;},{});
  return res.status(200).json({orchestration:own.rows[0],steps:steps.rows,counts});
 }catch(error){console.error(error);return res.status(500).json({error:"Praćenje orkestracije nije dostupno."});}
}