import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const oid=String(req.query?.orchestration_id||"");
  const own=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2",[oid,userId]);
  if(!own.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const r=await query("SELECT parallel_group,COUNT(*)::int AS broj_koraka,ARRAY_AGG(step_key ORDER BY position) AS koraci FROM system_orchestration_steps WHERE orchestration_id=$1 AND parallel_group IS NOT NULL GROUP BY parallel_group ORDER BY parallel_group",[oid]);
  return res.status(200).json({grupe:r.rows});
 }catch(error){console.error(error);return res.status(500).json({error:"Paralelne grupe nisu dostupne."});}
}