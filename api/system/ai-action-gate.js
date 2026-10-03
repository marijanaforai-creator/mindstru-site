import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),op=String(b.operation||"");
  const r=await query("SELECT * FROM system_ai_controls WHERE user_id=$1 LIMIT 1",[userId]);const c=r.rows[0]||{autonomy_level:0,require_confirmation:true,allowed_operations:[],blocked_operations:[]};
  const blocked=Array.isArray(c.blocked_operations)&&c.blocked_operations.includes(op),allowed=Array.isArray(c.allowed_operations)&&c.allowed_operations.includes(op);
  const decision=blocked?"blocked":c.autonomy_level>=2&&allowed&&!c.require_confirmation?"allowed":"confirmation_required";
  return res.status(200).json({decision,operation:op,autonomy_level:c.autonomy_level});
 }catch(e){return res.status(500).json({error:"AI kontrolna kapija nije dostupna."});}
}