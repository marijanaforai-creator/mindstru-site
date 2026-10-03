import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
const safeOps=new Set(["read","check","validate","generate_plan","system_check"]);
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),operation=String(b.operation||"");
  const target=String(b.target||"development");
  const sensitive=target==="production"||["deploy","delete","financial","external_write"].some(x=>operation.includes(x));
  const allowed=safeOps.has(operation)||(!sensitive&&target!=="production");
  const requiresApproval=sensitive;
  await query("INSERT INTO system_orchestration_events(user_id,event_type,payload) VALUES($1,'POLICY_EVALUATED',$2::jsonb)",[userId,JSON.stringify({operation,target,allowed,requiresApproval})]);
  return res.status(200).json({allowed,requires_approval:requiresApproval,reason:allowed?"policy_ok":"sensitive_operation"});
 }catch(e){console.error(e);return res.status(500).json({error:"Policy engine nije dostupan."})}
}