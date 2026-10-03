import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const id=String(req.body?.orchestration_id||"");
  const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
  if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const cp=await query("SELECT id,name,state,step_id,created_at FROM system_checkpoints WHERE orchestration_id=$1 ORDER BY created_at DESC LIMIT 1",[id]);
  if(!cp.rowCount)return res.status(404).json({error:"Nema sačuvane kontrolne tačke."});
  await query("UPDATE system_orchestrations SET status='running',error=NULL,updated_at=NOW() WHERE id=$1 AND user_id=$2",[id,userId]);
  return res.status(200).json({ok:true,resumed_from:cp.rows[0]});
 }catch(e){console.error(e);return res.status(500).json({error:"Oporavak od checkpoint-a nije uspeo."})}
}