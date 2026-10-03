import { query } from "../../_lib/db.js";
import { requireUser } from "../../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const id=String(req.query?.id||"");if(!id)return res.status(400).json({error:"Nedostaje execution ID."});
  if(req.method==="GET"){
   const r=await query("SELECT * FROM system_executions WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
   if(!r.rowCount)return res.status(404).json({error:"Execution nije pronađen."});
   return res.status(200).json({execution:r.rows[0]});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}), action=String(body.action||"");
   const allowed=["start","retry","cancel","complete","fail"];
   if(!allowed.includes(action))return res.status(400).json({error:"Nepoznata execution akcija."});
   const current=await query("SELECT * FROM system_executions WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
   if(!current.rowCount)return res.status(404).json({error:"Execution nije pronađen."});
   const e=current.rows[0];
   if(action==="cancel"){
    if(["completed","failed","cancelled"].includes(e.status))return res.status(409).json({error:"Execution je već završen."});
    await query("UPDATE system_executions SET status='cancelled',finished_at=NOW(),updated_at=NOW() WHERE id=$1 AND user_id=$2",[id,userId]);
   }else if(action==="start"){
    await query("UPDATE system_executions SET status='running',progress=COALESCE(progress,0),attempts=attempts+1,started_at=COALESCE(started_at,NOW()),updated_at=NOW() WHERE id=$1 AND user_id=$2",[id,userId]);
   }else if(action==="retry"){
    await query("UPDATE system_executions SET status='queued',progress=0,error=NULL,updated_at=NOW() WHERE id=$1 AND user_id=$2 AND status='failed'",[id,userId]);
   }else if(action==="complete"){
    await query("UPDATE system_executions SET status='completed',progress=100,result=$3::jsonb,finished_at=NOW(),updated_at=NOW() WHERE id=$1 AND user_id=$2",[id,userId,JSON.stringify(body.result||{})]);
   }else if(action==="fail"){
    await query("UPDATE system_executions SET status='failed',error=$3,finished_at=NOW(),updated_at=NOW() WHERE id=$1 AND user_id=$2",[id,userId,String(body.error||"Execution failed").slice(0,500)]);
   }
   const r=await query("SELECT * FROM system_executions WHERE id=$1 AND user_id=$2",[id,userId]);
   const meta=r.rows[0]?.payload||{};
   if(meta.orchestration_id){await query("INSERT INTO system_orchestration_events(user_id,orchestration_id,event_type,payload) VALUES($1,$2,$3,$4::jsonb)",[userId,meta.orchestration_id,"EXECUTION_STATUS_CHANGED",JSON.stringify({execution_id:id,status:r.rows[0].status,step_key:meta.step_key||null})]);}
   return res.status(200).json({execution:r.rows[0]});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Execution operacija nije uspela."})}
}