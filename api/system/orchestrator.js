import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

function safeCondition(condition, context){
 if(!condition || typeof condition!=="object" || !condition.field)return true;
 const value=String(condition.field).split(".").reduce((a,k)=>a==null?undefined:a[k],context||{});
 const expected=condition.value;
 switch(condition.operator||"eq"){
  case "eq": return value===expected;
  case "neq": return value!==expected;
  case "exists": return value!==undefined && value!==null;
  case "in": return Array.isArray(expected)&&expected.includes(value);
  default: return false;
 }
}

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const id=String(req.query?.id||"");
   if(!id)return res.status(400).json({error:"Nedostaje orchestration ID."});
   const o=await query("SELECT id,name,status,trigger,payload,result,error,created_at,started_at,finished_at,updated_at FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
   if(!o.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
   const s=await query("SELECT id,step_key,name,type,action,position,status,condition,depends_on,parallel_group,input,output,retry_policy,checkpoint,compensation_action,approval_required,approval_status,approved_at FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position ASC",[id]);
   return res.status(200).json({orchestration:o.rows[0],steps:s.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const name=String(body.name||"Master System Orchestrator").trim().slice(0,200);
   const trigger=body.trigger?String(body.trigger).slice(0,100):"launcher";
   const payload=body.payload&&typeof body.payload==="object"?body.payload:{};
   const steps=Array.isArray(body.steps)?body.steps:[];
   const orchestrationId=newId();
   await query("INSERT INTO system_orchestrations(id,user_id,name,status,trigger,payload) VALUES($1,$2,$3,'planned',$4,$5::jsonb)",[orchestrationId,userId,name,trigger,JSON.stringify(payload)]);
   for(let i=0;i<steps.length;i++){
    const step=steps[i]||{};
    const type=String(step.type||"action").slice(0,40);
    const approval=Boolean(step.approval_required||type==="approval");
    await query(
     "INSERT INTO system_orchestration_steps(id,orchestration_id,step_key,name,type,action,position,status,condition,depends_on,parallel_group,input,retry_policy,checkpoint,compensation_action,approval_required,approval_status) VALUES($1,$2,$3,$4,$5,$6,$7,'queued',$8::jsonb,$9::jsonb,$10,$11::jsonb,$12::jsonb,$13,$14,$15,$16)",
     [newId(),orchestrationId,String(step.step_key||("korak_"+(i+1))).slice(0,100),String(step.name||("Korak "+(i+1))).slice(0,200),type,step.action?String(step.action).slice(0,160):null,i,JSON.stringify(step.condition||{}),JSON.stringify(Array.isArray(step.depends_on)?step.depends_on:[]),step.parallel_group?String(step.parallel_group).slice(0,80):null,JSON.stringify(step.input||{}),JSON.stringify(step.retry_policy||{max_attempts:1}),Boolean(step.checkpoint),step.compensation_action?String(step.compensation_action).slice(0,160):null,approval,approval?"pending":null]
    );
   }
   const check=await query("SELECT step_key,type,condition,depends_on,approval_required FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position",[orchestrationId]);
   const keys=new Set(check.rows.map(x=>x.step_key));
   const invalid=check.rows.filter(x=>(Array.isArray(x.depends_on)?x.depends_on:[]).some(d=>!keys.has(d)));
   const context={payload};
   const conditional=check.rows.filter(x=>!safeCondition(x.condition,context)).map(x=>x.step_key);
   if(invalid.length){
    await query("UPDATE system_orchestrations SET status='blocked',error=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3",["Nepostojeća zavisnost u orkestracionom lancu.",orchestrationId,userId]);
   }else if(conditional.length){
    await query("UPDATE system_orchestration_steps SET status='skipped',updated_at=NOW() WHERE orchestration_id=$1 AND step_key=ANY($2::text[])",[orchestrationId,conditional]);
    await query("UPDATE system_orchestrations SET status='planned',updated_at=NOW() WHERE id=$1 AND user_id=$2",[orchestrationId,userId]);
   }
   const ready=check.rows.filter(x=>!x.approval_required&&!invalid.some(i=>i.step_key===x.step_key)&&!conditional.includes(x.step_key)&&(!Array.isArray(x.depends_on)||x.depends_on.length===0));
   const queued=[];
   for(const step of ready){
    const executionId=newId();
    await query("INSERT INTO system_executions(id,user_id,operation,target,status,progress,payload) VALUES($1,$2,$3,$4,'queued',0,$5::jsonb)",[executionId,userId,step.action||step.step_key,"orchestration",JSON.stringify({orchestration_id:orchestrationId,step_key:step.step_key,input:step.input||{}})]);
    await query("INSERT INTO system_queue(id,user_id,execution_id,priority) VALUES($1,$2,$3,50)",[newId(),userId,executionId]);
    queued.push({step_key:step.step_key,execution_id:executionId});
   }
   await query("UPDATE system_orchestrations SET status=$1,started_at=COALESCE(started_at,NOW()),updated_at=NOW() WHERE id=$2 AND user_id=$3",["running",orchestrationId,userId]);
   return res.status(201).json({orchestration_id:orchestrationId,status:"running",queued,invalid_dependencies:invalid.map(x=>x.step_key),skipped:conditional});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Master System Orchestrator nije dostupan."})}
}