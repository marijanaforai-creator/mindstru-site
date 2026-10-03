import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),action=String(b.action||"");
  const p=await query("SELECT * FROM system_ai_policies WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1",[userId]);
  const policy=p.rows[0]||{autonomy_level:0,require_approval:true,allowed_actions:[],blocked_actions:[]};
  const blocked=policy.blocked_actions.includes(action),allowed=policy.allowed_actions.includes(action);
  const decision=blocked?"blocked":(allowed&&policy.autonomy_level>=2&&!policy.require_approval?"approved":"needs_approval");
  const id=newId();await query("INSERT INTO system_ai_decisions(id,user_id,execution_id,action,decision,reason,context) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)",[id,userId,b.execution_id||null,action,decision,blocked?"Akcija je blokirana pravilima.":decision==="approved"?"Akcija je dozvoljena pravilima.":"Potrebno je odobrenje.",JSON.stringify(b.context||{})]);
  return res.status(200).json({decision,decision_id:id});
 }catch(e){console.error(e);return res.status(500).json({error:"AI odluka nije evidentirana."});}
}