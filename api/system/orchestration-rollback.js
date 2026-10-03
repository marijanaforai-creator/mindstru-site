import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const orchestrationId=String(body.orchestration_id||"");
  const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[orchestrationId,userId]);
  if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const steps=await query("SELECT id,step_key,status,compensation_action FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position DESC",[orchestrationId]);
  const rollback=steps.rows.filter(s=>["completed","failed"].includes(s.status)&&s.compensation_action).map(s=>s.step_key);
  await query("UPDATE system_orchestrations SET status='rollback_pending',updated_at=NOW() WHERE id=$1 AND user_id=$2",[orchestrationId,userId]);
  await query("UPDATE system_orchestration_steps SET status='rollback_pending',updated_at=NOW() WHERE orchestration_id=$1 AND status IN ('completed','failed') AND compensation_action IS NOT NULL",[orchestrationId]);
  await query("INSERT INTO system_audit_log(id,user_id,action,details) VALUES(gen_random_uuid(),$1,$2,$3::jsonb)",[userId,"ORKESTRACIJA_ROLLBACK_PLAN",JSON.stringify({orchestration_id:orchestrationId,steps:rollback})]);
  return res.status(200).json({ok:true,mode:"plan-only",steps:rollback});
 }catch(e){console.error(e);return res.status(500).json({error:"Rollback orkestracije nije uspeo."})}
}