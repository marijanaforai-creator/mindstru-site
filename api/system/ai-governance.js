import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){const r=await query("SELECT * FROM system_ai_policies WHERE user_id=$1 ORDER BY updated_at DESC",[userId]);return res.status(200).json({politike:r.rows});}
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
  await query("INSERT INTO system_ai_policies(id,user_id,name,autonomy_level,require_approval,allowed_actions,blocked_actions,data_boundaries) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8::jsonb)",[id,userId,String(b.name||"AI politika"),Math.max(0,Math.min(4,Number(b.autonomy_level||0))),b.require_approval!==false,JSON.stringify(b.allowed_actions||[]),JSON.stringify(b.blocked_actions||[]),JSON.stringify(b.data_boundaries||{})]);
  return res.status(201).json({ok:true,id});
 }catch(e){console.error(e);return res.status(500).json({error:"AI politika nije sačuvana."});}
}