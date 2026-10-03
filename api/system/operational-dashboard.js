import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  const [jobs,queue,workers,notes]=await Promise.all([
   query("SELECT COUNT(*)::int AS broj FROM system_time_jobs WHERE user_id=$1 AND enabled=TRUE",[userId]),
   query("SELECT COUNT(*)::int AS broj FROM system_queue WHERE user_id=$1 AND status='queued'",[userId]),
   query("SELECT COUNT(*)::int AS broj FROM system_workers WHERE user_id=$1 AND status='busy'",[userId]),
   query("SELECT COUNT(*)::int AS broj FROM system_notifications WHERE user_id=$1 AND read_at IS NULL",[userId])
  ]);
  return res.status(200).json({zakazana:jobs.rows[0].broj,na_cekanju:queue.rows[0].broj,aktivni_radnici:workers.rows[0].broj,neprocitana_obavestenja:notes.rows[0].broj});
 }catch(e){return res.status(500).json({error:"Operativni pregled nije dostupan."});}
}