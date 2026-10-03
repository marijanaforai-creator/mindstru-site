import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const r=await query("SELECT id,orchestration_id,step_id,status,reason,decision,created_at,decided_at FROM system_approval_requests WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[userId]);
  return res.status(200).json({zahtevi:r.rows});
 }catch(error){console.error(error);return res.status(500).json({error:"Zahtevi za odobrenje nisu dostupni."});}
}