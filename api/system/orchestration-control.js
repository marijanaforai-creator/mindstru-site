import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,name,status,trigger,created_at,started_at,finished_at FROM system_orchestrations WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",[userId]);
   return res.status(200).json({orkestracije:r.rows});
  }
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const operation=String(body.operation||"");
  const steps=Array.isArray(body.steps)?body.steps:[];
  if(!operation)return res.status(400).json({error:"Nedostaje naziv operacije."});
  if(!steps.length)return res.status(400).json({error:"Operacija mora imati najmanje jedan korak."});
  const oid=newId();
  await query("INSERT INTO system_orchestrations(id,user_id,name,status,trigger,payload) VALUES($1,$2,$3,'planned','master_control',$4::jsonb)",[oid,userId,operation,JSON.stringify(body.payload||{})]);
  for(let i=0;i<steps.length;i++){
   const s=steps[i]||{};
   const sid=newId();
   const approval=Boolean(s.requires_approval);
   await query("INSERT INTO system_orchestration_steps(id,orchestration_id,step_key,name,position,step_type,action,status,depends_on,parallel_group,checkpoint_enabled,compensation_action,requires_approval) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13)",[
    sid,oid,String(s.step_key||("korak_"+(i+1))),String(s.name||("Korak "+(i+1))),i,String(s.step_type||"action"),s.action?String(s.action):null,approval?"waiting_approval":"planned",JSON.stringify(Array.isArray(s.depends_on)?s.depends_on:[]),s.parallel_group?String(s.parallel_group):null,Boolean(s.checkpoint_enabled),s.compensation_action?String(s.compensation_action):null,approval
   ]);
   if(approval){
    await query("INSERT INTO system_approval_requests(id,user_id,orchestration_id,step_id,status,reason) VALUES($1,$2,$3,$4,'waiting',$5)",[newId(),userId,oid,sid,String(s.approval_reason||"Potrebno je ljudsko odobrenje.")]);
   }
  }
  await query("INSERT INTO system_orchestration_events(user_id,orchestration_id,event_type,detail) VALUES($1,$2,'orchestration_created',$3::jsonb)",[userId,oid,JSON.stringify({operation,broj_koraka:steps.length})]);
  return res.status(201).json({ok:true,orchestration_id:oid,status:"planned",poruka:"Orkestracija je pripremljena i čeka kontrolisano izvršavanje."});
 }catch(error){console.error(error);return res.status(500).json({error:"Glavni orkestrator nije uspeo da pripremi operaciju."});}
}