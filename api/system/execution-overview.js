import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const [o,e,q]=await Promise.all([
   query("SELECT status,COUNT(*)::int AS broj FROM system_orchestrations WHERE user_id=$1 GROUP BY status",[userId]),
   query("SELECT status,COUNT(*)::int AS broj FROM system_executions WHERE user_id=$1 GROUP BY status",[userId]),
   query("SELECT status,COUNT(*)::int AS broj FROM system_queue WHERE user_id=$1 GROUP BY status",[userId])
  ]);
  return res.status(200).json({orkestracije:o.rows,izvrsavanja:e.rows,red_cekanja:q.rows});
 }catch(error){console.error(error);return res.status(500).json({error:"Pregled izvršavanja nije dostupan."});}
}