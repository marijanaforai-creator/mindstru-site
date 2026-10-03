import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const orchestrationId=String(req.query?.orchestration_id||"");
   if(!orchestrationId)return res.status(400).json({error:"Nedostaje orchestration_id."});
   const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[orchestrationId,userId]);
   if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
   const r=await query("SELECT id,orchestration_id,step_key,name,type,action,position,status,condition,depends_on,parallel_group,input,output,retry_policy,checkpoint,compensation_action,approval_required,approval_status,approved_at,started_at,finished_at FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position ASC",[orchestrationId]);
   return res.status(200).json({steps:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const orchestrationId=String(body.orchestration_id||"");
   const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[orchestrationId,userId]);
   if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
   const id=newId();
   const stepKey=String(body.step_key||id).slice(0,100);
   const type=String(body.type||"action").slice(0,40);
   const depends=Array.isArray(body.depends_on)?body.depends_on:[];
   const condition=body.condition&&typeof body.condition==="object"?body.condition:{};
   const input=body.input&&typeof body.input==="object"?body.input:{};
   const retry=body.retry_policy&&typeof body.retry_policy==="object"?body.retry_policy:{max_attempts:1};
   await query(
    "INSERT INTO system_orchestration_steps(id,orchestration_id,step_key,name,type,action,position,status,condition,depends_on,parallel_group,input,retry_policy,checkpoint,compensation_action,approval_required,approval_status) VALUES($1,$2,$3,$4,$5,$6,$7,'queued',$8::jsonb,$9::jsonb,$10,$11::jsonb,$12::jsonb,$13,$14,$15,$16)",
    [id,orchestrationId,stepKey,String(body.name||stepKey).slice(0,200),type,body.action?String(body.action).slice(0,160):null,Number(body.position||0),JSON.stringify(condition),JSON.stringify(depends),body.parallel_group?String(body.parallel_group).slice(0,80):null,JSON.stringify(input),JSON.stringify(retry),Boolean(body.checkpoint),body.compensation_action?String(body.compensation_action).slice(0,160):null,Boolean(body.approval_required||type==="approval"),body.approval_required||type==="approval"?"pending":null]
   );
   return res.status(201).json({step:{id,step_key:stepKey,status:"queued"}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Koraci orkestracije nisu dostupni."})}
}