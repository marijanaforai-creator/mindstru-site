import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const id=String(b.worker_id||"");
  const r=await query("UPDATE system_workers SET status=COALESCE($1,status),last_heartbeat=NOW(),updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING id,status,last_heartbeat",[b.status?String(b.status):null,id,userId]);
  if(!r.rowCount)return res.status(404).json({error:"Radnik nije pronađen."});
  return res.status(200).json({ok:true,worker:r.rows[0]});
 }catch(error){console.error(error);return res.status(500).json({error:"Heartbeat radnika nije sačuvan."});}
}