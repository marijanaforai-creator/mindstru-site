import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){const r=await query("SELECT * FROM system_ai_controls WHERE user_id=$1 LIMIT 1",[userId]);return res.status(200).json({kontrola:r.rows[0]||null});}
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const id=newId();await query("INSERT INTO system_ai_controls(id,user_id,autonomy_level,require_confirmation,allowed_operations,blocked_operations,max_actions_per_run) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7) ON CONFLICT(user_id) DO UPDATE SET autonomy_level=EXCLUDED.autonomy_level,require_confirmation=EXCLUDED.require_confirmation,allowed_operations=EXCLUDED.allowed_operations,blocked_operations=EXCLUDED.blocked_operations,max_actions_per_run=EXCLUDED.max_actions_per_run,updated_at=NOW()",[id,userId,Math.max(0,Math.min(4,Number(b.autonomy_level||0))),b.require_confirmation!==false,JSON.stringify(Array.isArray(b.allowed_operations)?b.allowed_operations:[]),JSON.stringify(Array.isArray(b.blocked_operations)?b.blocked_operations:[]),Math.max(1,Math.min(1000,Number(b.max_actions_per_run||10)))]);
  return res.status(200).json({ok:true,poruka:"AI kontrola je sačuvana."});
 }catch(e){console.error(e);return res.status(500).json({error:"AI kontrola nije sačuvana."});}
}