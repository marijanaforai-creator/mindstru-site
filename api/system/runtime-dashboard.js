import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const [workers,queue,events,executions]=await Promise.all([
   query("SELECT status,COUNT(*)::int AS broj FROM system_workers WHERE user_id=$1 GROUP BY status",[userId]),
   query("SELECT status,COUNT(*)::int AS broj FROM system_queue WHERE user_id=$1 GROUP BY status",[userId]),
   query("SELECT processed,COUNT(*)::int AS broj FROM system_runtime_events WHERE user_id=$1 GROUP BY processed",[userId]),
   query("SELECT status,COUNT(*)::int AS broj FROM system_executions WHERE user_id=$1 GROUP BY status",[userId])
  ]);
  return res.status(200).json({radnici:workers.rows,red_cekanja:queue.rows,dogadjaji:events.rows,izvrsavanja:executions.rows});
 }catch(error){console.error(error);return res.status(500).json({error:"Runtime pregled nije dostupan."});}
}