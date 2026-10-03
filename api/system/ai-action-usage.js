import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),actions=Math.max(0,Number(b.actions||1)),cost=Math.max(0,Number(b.estimated_cost||0));
  const c=await query("SELECT max_actions_per_run FROM system_ai_controls WHERE user_id=$1 LIMIT 1",[userId]);const max=c.rows[0]?.max_actions_per_run||10;
  const decision=actions>max?"blocked":"allowed";
  if(decision==="allowed")await query("INSERT INTO system_ai_usage(id,user_id,execution_id,actions,estimated_cost,metadata) VALUES($1,$2,$3,$4,$5,$6::jsonb)",[newId(),userId,b.execution_id||null,actions,cost,JSON.stringify(b.metadata||{})]);
  return res.status(200).json({decision,actions,max_actions_per_run:max,estimated_cost:cost});
 }catch(e){return res.status(500).json({error:"AI potrošnja nije proverena."});}
}