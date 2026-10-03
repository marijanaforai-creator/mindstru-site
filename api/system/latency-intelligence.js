import {query} from "../_lib/db.js";import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){try{const userId=requireUser(req,res);if(!userId)return;
const r=await query("SELECT source,AVG(metric_value) prosek,MAX(metric_value) maksimum,MIN(metric_value) minimum FROM system_metrics WHERE user_id=$1 AND metric_name IN ('latency','response_time') AND recorded_at>NOW()-INTERVAL '24 hours' GROUP BY source",[userId]);
return res.status(200).json({latencija:r.rows});}catch(e){return res.status(500).json({error:"Latency analiza nije dostupna."});}}