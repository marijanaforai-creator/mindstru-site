import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const stepId=String(body.step_id||"");
  const decision=String(body.decision||"").toLowerCase();
  if(!stepId||!["approve","reject"].includes(decision))return res.status(400).json({error:"Odluka mora biti odobri ili odbij."});
  const r=await query("UPDATE system_orchestration_steps s SET status=$1,approved_by=$2,approved_at=NOW(),updated_at=NOW() FROM system_orchestrations o WHERE s.id=$3 AND s.orchestration_id=o.id AND o.user_id=$2 AND s.requires_approval=TRUE RETURNING s.id,s.orchestration_id,s.status,s.approved_at",[decision==="approve"?"approved":"rejected",userId,stepId]);
  if(!r.rowCount)return res.status(404).json({error:"Korak za odobrenje nije pronađen."});
  await query("UPDATE system_approval_requests SET status=$1,decision=$2,decided_at=NOW() WHERE step_id=$3 AND user_id=$4 AND status='waiting'",[decision==="approve"?"approved":"rejected",decision,stepId,userId]);
  return res.status(200).json({ok:true,step:r.rows[0]});
 }catch(error){console.error(error);return res.status(500).json({error:"Odluka nije sačuvana."});}
}