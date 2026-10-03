import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

function resolvePlan(steps){
  const byKey=new Map(steps.map(s=>[s.step_key,s]));
  const unresolved=new Set(steps.map(s=>s.step_key));
  const ordered=[];
  while(unresolved.size){
    let moved=false;
    for(const key of [...unresolved]){
      const s=byKey.get(key);
      const deps=Array.isArray(s.depends_on)?s.depends_on:[];
      if(deps.every(d=>!unresolved.has(d))){
        ordered.push({...s,execution_position:ordered.length});
        unresolved.delete(key); moved=true;
      }
    }
    if(!moved) return {ok:false,error:"Pronađena je kružna ili nepoznata zavisnost.",ordered};
  }
  return {ok:true,ordered};
}
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const oid=String(body.orchestration_id||"");
  const own=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2",[oid,userId]);
  if(!own.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const r=await query("SELECT step_key,name,position,step_type,action,depends_on,parallel_group,checkpoint_enabled,compensation_action,requires_approval FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position",[oid]);
  const plan=resolvePlan(r.rows);
  if(!plan.ok)return res.status(400).json({error:plan.error,ordered:plan.ordered});
  const dependencyMap={}; plan.ordered.forEach(s=>dependencyMap[s.step_key]=s.depends_on||[]);
  const id=newId();
  await query("INSERT INTO system_orchestration_plans(id,user_id,orchestration_id,strategy,plan,dependency_map,status) VALUES($1,$2,$3,'controlled',$4::jsonb,$5::jsonb,'ready')",[id,userId,oid,JSON.stringify({steps:plan.ordered}),JSON.stringify(dependencyMap)]);
  return res.status(200).json({plan_id:id,status:"ready",steps:plan.ordered,dependency_map:dependencyMap});
 }catch(error){console.error(error);return res.status(500).json({error:"Plan orkestracije nije moguće napraviti."});}
}