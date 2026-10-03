import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  const staleMinutes=Math.max(1,Math.min(1440,Number(req.query?.stale_minutes||10)));
  const q=await query("UPDATE system_queue SET status='queued',locked_at=NULL,locked_by=NULL,attempts=attempts+1,updated_at=NOW() WHERE user_id=$1 AND status='running' AND locked_at < NOW() - ($2 || ' minutes')::interval RETURNING id,execution_id",[userId,String(staleMinutes)]);
  const w=await query("UPDATE system_workers SET status='offline',updated_at=NOW() WHERE user_id=$1 AND last_heartbeat < NOW() - ($2 || ' minutes')::interval AND status<>'offline' RETURNING id",[userId,String(staleMinutes)]);
  return res.status(200).json({oporavljeni_poslovi:q.rows,offline_radnici:w.rows,poruka:"Nadzor runtime-a je završen."});
 }catch(error){console.error(error);return res.status(500).json({error:"Runtime nadzor nije uspeo."});}
}