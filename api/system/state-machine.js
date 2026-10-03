import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
const transitions={
 planned:["running","blocked","cancelled"],
 running:["paused","completed","failed","rollback_pending","cancelled"],
 paused:["running","cancelled"],
 rollback_pending:["rolling_back","failed","completed"],
 rolling_back:["completed","failed"],
 blocked:["planned","cancelled"]
};
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const id=String(req.body?.orchestration_id||""),next=String(req.body?.status||"");
  const r=await query("SELECT status FROM system_orchestrations WHERE id=$1 AND user_id=$2",[id,userId]);
  if(!r.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  if(!(transitions[r.rows[0].status]||[]).includes(next))return res.status(409).json({error:"Nedozvoljen prelaz stanja.",from:r.rows[0].status,to:next});
  await query("UPDATE system_orchestrations SET status=$1,updated_at=NOW(),started_at=CASE WHEN $1='running' THEN COALESCE(started_at,NOW()) ELSE started_at END,finished_at=CASE WHEN $1='completed' THEN NOW() ELSE finished_at END WHERE id=$2 AND user_id=$3",[next,id,userId]);
  await query("INSERT INTO system_orchestration_events(user_id,orchestration_id,event_type,payload) VALUES($1,$2,$3,$4::jsonb)",[userId,id,"STATE_CHANGED",JSON.stringify({from:r.rows[0].status,to:next})]);
  return res.status(200).json({ok:true,status:next});
 }catch(e){console.error(e);return res.status(500).json({error:"State machine nije dostupna."})}
}