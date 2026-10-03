import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),operation=String(b.operation||"");
  if(!operation)return res.status(400).json({error:"Nedostaje operacija."});
  const gate=await query("SELECT max_risk,max_cost,allow_autonomous FROM system_execution_policies WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1",[userId]);
  const p=gate.rows[0]||{max_risk:50,max_cost:null,allow_autonomous:false};
  return res.status(200).json({status:p.allow_autonomous?"kontrolisana_autonomija":"potvrda_potrebna",operacija:operation,granice:{rizik:p.max_risk,trosak:p.max_cost}});
 }catch(e){return res.status(500).json({error:"Command Runtime nije dostupan."});}
}