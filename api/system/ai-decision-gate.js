import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const risk=String(b.risk||"low"), requiresHuman=["high","critical"].includes(risk);
  const decision=requiresHuman?"approval_required":"allowed";
  const r=await query("INSERT INTO system_decision_gates(user_id,orchestration_id,step_id,decision,rationale,requires_human) VALUES($1,$2,$3,$4,$5::jsonb,$6) RETURNING *",[userId,b.orchestration_id||null,b.step_id||null,decision,JSON.stringify({risk,reason:b.reason||"runtime gate"}),requiresHuman]);
  return res.status(200).json({decision,requires_human:requiresHuman,gate:r.rows[0]});
 }catch(e){console.error(e);return res.status(500).json({error:"AI decision gate nije dostupan."})}
}