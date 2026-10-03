import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const operation=String(body.operation||"system_check").slice(0,100);
  const target=String(body.target||"development").slice(0,80);
  const sensitive=["deploy_production","delete_data","financial_action"].includes(operation)||target==="production";
  const executionId=newId();
  await query("INSERT INTO system_executions(id,user_id,operation,target,status,progress,payload) VALUES($1,$2,$3,$4,$5,0,$6::jsonb)",[executionId,userId,operation,target,sensitive?"queued":"queued",JSON.stringify({source:"autonomous_launcher",requires_approval:sensitive})]);
  await query("INSERT INTO system_queue(id,user_id,execution_id,priority) VALUES($1,$2,$3,$4)",[newId(),userId,executionId,sensitive?40:70]);
  await query("INSERT INTO system_audit_log(id,user_id,action,details) VALUES(gen_random_uuid(),$1,$2,$3::jsonb)",[userId,"AUTONOMOUS_LAUNCHER_QUEUE",JSON.stringify({execution_id:executionId,operation,target,requires_approval:sensitive})]);
  return res.status(201).json({ok:true,execution_id:executionId,status:"queued",mode:sensitive?"approval_required":"controlled"});
 }catch(e){console.error(e);return res.status(500).json({error:"Autonomous System Launcher nije dostupan."})}
}