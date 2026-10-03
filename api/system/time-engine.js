import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  const r=await query("SELECT id,name,operation,timezone,schedule_type,run_at,next_run_at,priority,enabled FROM system_time_jobs WHERE user_id=$1 ORDER BY priority DESC,next_run_at ASC NULLS LAST LIMIT 100",[userId]);
  return res.status(200).json({vremenski_engine:{status:"aktivan",zona:"Europe/Belgrade",zakazivanja:r.rows}});
 }catch(e){return res.status(500).json({error:"Time Engine nije dostupan."});}
}