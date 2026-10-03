import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const stepId=String(body.step_id||"");
  const decision=String(body.decision||"").toLowerCase();
  if(!stepId || !["approve","reject"].includes(decision))return res.status(400).json({error:"Nedostaje validna odluka."});
  const r=await query("SELECT s.id,s.orchestration_id,s.status,s.approval_status,o.user_id FROM system_orchestration_steps s JOIN system_orchestrations o ON o.id=s.orchestration_id WHERE s.id=$1 AND o.user_id=$2 LIMIT 1",[stepId,userId]);
  if(!r.rowCount)return res.status(404).json({error:"Approval korak nije pronađen."});
  const next=decision==="approve"?"approved":"rejected";
  await query("UPDATE system_orchestration_steps SET approval_status=$1,status=$2,approved_by=$3,approved_at=NOW(),updated_at=NOW() WHERE id=$4",[next,next==="approved"?"queued":"rejected",userId,stepId]);
  await query("INSERT INTO system_audit_log(id,user_id,action,details) VALUES(gen_random_uuid(),$1,$2,$3::jsonb)",[userId,"ORKESTRACIJA_APPROVAL",JSON.stringify({step_id:stepId,decision})]);
  return res.status(200).json({ok:true,status:next});
 }catch(e){console.error(e);return res.status(500).json({error:"Approval obrada nije uspela."})}
}