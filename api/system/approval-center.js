import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const r=await query("SELECT s.id,s.orchestration_id,s.step_key,s.name,s.status,s.approval_status,o.name AS orchestration_name FROM system_orchestration_steps s JOIN system_orchestrations o ON o.id=s.orchestration_id WHERE o.user_id=$1 AND s.approval_required=TRUE ORDER BY s.created_at DESC LIMIT 100",[userId]);
  return res.status(200).json({approvals:r.rows});
 }catch(e){console.error(e);return res.status(500).json({error:"Approval centar nije dostupan."})}
}