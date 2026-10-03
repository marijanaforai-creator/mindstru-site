import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const r=await query("SELECT id,name,max_risk,max_cost,require_approval_above_risk,allow_autonomous,kill_switch_enabled FROM system_execution_policies WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1",[userId]);
  const policy=r.rows[0]||{max_risk:50,max_cost:null,require_approval_above_risk:70,allow_autonomous:false,kill_switch_enabled:true};
  return res.status(200).json({režim:policy.allow_autonomous?"kontrolisana_autonomija":"ručno upravljanje",politika:policy,pravila:["Ne prelazi dozvoljeni rizik","Ne izvršavaj bez potrebnih dozvola","Poštuj ograničenje troška","Zaustavi se ako se aktivira sigurnosna granica","Kill Switch mora ostati dostupan"]});
 }catch(error){console.error(error);return res.status(500).json({error:"Autonomni menadžer nije dostupan."});}
}