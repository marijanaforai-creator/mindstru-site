import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),risk=Number(b.risk_score||0),cost=Number(b.estimated_cost||0);
  const p=await query("SELECT max_risk,max_cost,kill_switch_enabled FROM system_execution_policies WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1",[userId]);
  const policy=p.rows[0]||{max_risk:50,max_cost:null,kill_switch_enabled:true};
  const reasons=[];if(risk>policy.max_risk)reasons.push("Rizik prelazi dozvoljenu granicu.");if(policy.max_cost!=null&&cost>Number(policy.max_cost))reasons.push("Trošak prelazi dozvoljeni limit.");
  return res.status(200).json({dozvoljeno:reasons.length===0,reasons,kill_switch:policy.kill_switch_enabled});
 }catch(e){return res.status(500).json({error:"Sigurnosna kapija nije dostupna."});}
}