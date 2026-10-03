import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const id=String(req.body?.orchestration_id||"");
  const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
  if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const steps=await query("SELECT step_key,status,compensation_action FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position DESC",[id]);
  const plan=steps.rows.filter(s=>["completed","failed"].includes(s.status)&&s.compensation_action).map(s=>({step_key:s.step_key,action:s.compensation_action,status:"planned"}));
  await query("UPDATE system_orchestrations SET status='rollback_pending',updated_at=NOW() WHERE id=$1 AND user_id=$2",[id,userId]);
  return res.status(200).json({ok:true,mode:"plan-only",compensation:plan});
 }catch(e){console.error(e);return res.status(500).json({error:"Compensation engine nije uspeo."})}
}