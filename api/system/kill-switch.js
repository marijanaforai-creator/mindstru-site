import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const r=await query("UPDATE system_orchestrations SET status='killed',finished_at=NOW(),updated_at=NOW() WHERE user_id=$1 AND status IN ('running','paused','planned','waiting_approval') RETURNING id",[userId]);
  await query("INSERT INTO system_audit_log(user_id,event_type,detail) VALUES($1,'kill_switch',$2::jsonb)",[userId,JSON.stringify({zaustavljeno:r.rowCount})]);
  return res.status(200).json({ok:true,zaustavljeno:r.rowCount,poruka:"Hitno zaustavljanje je aktivirano."});
 }catch(error){console.error(error);return res.status(500).json({error:"Kill Switch nije uspeo."});}
}