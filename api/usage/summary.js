import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
import { getPlan } from "../_lib/plans.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const u=await query("SELECT plan FROM users WHERE id=$1",[userId]);
  if(!u.rowCount)return res.status(404).json({error:"Korisnik nije pronađen."});
  const plan=getPlan(u.rows[0].plan);
  const r=await query("SELECT feature,COALESCE(SUM(quantity),0)::int AS quantity FROM usage_events WHERE user_id=$1 AND created_at>=date_trunc('month',NOW()) GROUP BY feature",[userId]);
  const usage=Object.fromEntries(r.rows.map(x=>[x.feature,x.quantity]));
  return res.status(200).json({plan:u.rows[0].plan,limits:plan.limits,usage});
 }catch(e){console.error(e);return res.status(500).json({error:"Nije moguće učitati limite."})}
}
