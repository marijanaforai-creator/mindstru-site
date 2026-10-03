import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const r=await query("SELECT operation,status,error,COUNT(*)::int AS count FROM system_executions WHERE user_id=$1 AND status='failed' GROUP BY operation,status,error ORDER BY count DESC LIMIT 50",[userId]);
  return res.status(200).json({failures:r.rows,patterns:r.rows.map(x=>({operation:x.operation,count:x.count,classification:x.error?'runtime_error':'unknown'}))});
 }catch(e){console.error(e);return res.status(500).json({error:"Failure intelligence nije dostupna."})}
}