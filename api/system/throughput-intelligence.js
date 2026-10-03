import {query} from "../_lib/db.js";import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){try{const userId=requireUser(req,res);if(!userId)return;
const r=await query("SELECT source,AVG(metric_value) prosek,MAX(metric_value) maksimum FROM system_metrics WHERE user_id=$1 AND metric_name='throughput' AND recorded_at>NOW()-INTERVAL '24 hours' GROUP BY source",[userId]);
return res.status(200).json({propusnost:r.rows});}catch(e){return res.status(500).json({error:"Throughput analiza nije dostupna."});}}