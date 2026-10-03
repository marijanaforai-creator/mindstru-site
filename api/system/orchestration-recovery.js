import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const oid=String(body.orchestration_id||"");
  const own=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2",[oid,userId]);
  if(!own.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const steps=await query("SELECT id,step_key,name,status,compensation_action FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position DESC",[oid]);
  const candidates=steps.rows.filter(s=>["failed","completed"].includes(s.status)&&s.compensation_action);
  return res.status(200).json({mode:"kontrolisani_oporavak",candidates});
 }catch(error){console.error(error);return res.status(500).json({error:"Plan oporavka nije dostupan."});}
}