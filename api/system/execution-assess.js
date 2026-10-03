import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const oid=String(body.orchestration_id||"");
  const own=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2",[oid,userId]);
  if(!own.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const risk=Math.max(0,Math.min(100,Number(body.risk_score||0)));
  const cost=Math.max(0,Number(body.estimated_cost||0));
  const resources=body.required_resources&&typeof body.required_resources==="object"?body.required_resources:{};
  const permissions=body.permissions&&typeof body.permissions==="object"?body.permissions:{};
  const reasons=[];
  if(risk>=70)reasons.push("Operacija ima povišen rizik.");
  if(body.permission_ok===false)reasons.push("Dozvole nisu potvrđene.");
  if(body.resources_ok===false)reasons.push("Potrebni resursi nisu potvrđeni.");
  const decision=reasons.length?"review":"ready";
  const id=newId();
  await query("INSERT INTO system_execution_assessments(id,user_id,orchestration_id,risk_score,estimated_cost,required_resources,permissions,decision,reasons) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9::jsonb)",[id,userId,oid,risk,cost,JSON.stringify(resources),JSON.stringify(permissions),decision,JSON.stringify(reasons)]);
  return res.status(200).json({assessment_id:id,decision,risk_score:risk,estimated_cost:cost,reasons});
 }catch(error){console.error(error);return res.status(500).json({error:"Procena izvršavanja nije uspela."});}
}