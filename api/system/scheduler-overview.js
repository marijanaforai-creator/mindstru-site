import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;const r=await query("SELECT schedule_type,enabled,COUNT(*)::int AS broj FROM system_time_jobs WHERE user_id=$1 GROUP BY schedule_type,enabled",[userId]);return res.status(200).json({raspored:r.rows});}catch(e){return res.status(500).json({error:"Pregled raspoređivanja nije dostupan."});}
}