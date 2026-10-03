import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const id=String(req.query?.orchestration_id||"");
  if(!id)return res.status(400).json({error:"Nedostaje orchestration_id."});
  const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
  if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const steps=await query("SELECT step_key,name,status,position,started_at,finished_at FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position",[id]);
  return res.status(200).json({timeline:steps.rows});
 }catch(e){console.error(e);return res.status(500).json({error:"Timeline nije dostupan."})}
}