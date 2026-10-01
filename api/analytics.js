import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const [p,f,a,u,cnt,ar,er,pur] = await Promise.all([
   query("SELECT COUNT(*)::int AS count, COUNT(*) FILTER (WHERE status='published')::int AS published FROM projects WHERE user_id=$1",[userId]),
   query("SELECT COUNT(*)::int AS count, COUNT(*) FILTER (WHERE status='published')::int AS published FROM funnels WHERE user_id=$1",[userId]),
   query("SELECT COUNT(*)::int AS count, COALESCE(SUM(size_bytes),0)::bigint AS bytes FROM assets WHERE user_id=$1",[userId]),
   query("SELECT feature,COALESCE(SUM(quantity),0)::int AS quantity FROM usage_events WHERE user_id=$1 AND created_at>=date_trunc('month',NOW()) GROUP BY feature ORDER BY quantity DESC",[userId]),
   query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status IN ('lead','buyer','repeat_buyer'))::int AS qualified, COUNT(*) FILTER (WHERE status IN ('buyer','repeat_buyer'))::int AS buyers FROM contacts WHERE user_id=$1",[userId]),
   query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='queued')::int AS queued FROM automation_runs WHERE user_id=$1",[userId]),
   query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='queued')::int AS queued FROM email_sequence_runs WHERE user_id=$1",[userId]),
   query("SELECT COUNT(*) FILTER (WHERE status='paid')::int AS count, COALESCE(SUM(amount_cents) FILTER (WHERE status='paid'),0)::bigint AS revenue_cents FROM purchases WHERE user_id=$1",[userId])
  ]);
  const recent=await query("SELECT feature,quantity,created_at FROM usage_events WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20",[userId]);
  return res.status(200).json({
   period:"tekući mesec",
   projects:p.rows[0],
   funnels:f.rows[0],
   assets:{count:a.rows[0].count,bytes:Number(a.rows[0].bytes)},
   contacts:cnt.rows[0],
   automations:ar.rows[0],
   emailSequences:er.rows[0],
   sales:{count:pur.rows[0].count,revenueCents:Number(pur.rows[0].revenue_cents)},
   usage:u.rows,
   recent:recent.rows
  });
 }catch(e){console.error(e);return res.status(500).json({error:"Analitika nije dostupna."})}
}