import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,worker_key,name,status,capabilities,last_heartbeat,created_at,updated_at FROM system_workers WHERE user_id=$1 ORDER BY name",[userId]);
   return res.status(200).json({workers:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
   const key=String(body.worker_key||"default").slice(0,80),name=String(body.name||"Marijana Worker").slice(0,120);
   await query("INSERT INTO system_workers(id,user_id,worker_key,name,status,capabilities,last_heartbeat) VALUES($1,$2,$3,$4,'idle',$5::jsonb,NOW()) ON CONFLICT(user_id,worker_key) DO UPDATE SET name=EXCLUDED.name,capabilities=EXCLUDED.capabilities,status='idle',last_heartbeat=NOW(),updated_at=NOW()",[id,userId,key,name,JSON.stringify(body.capabilities||[])]);
   return res.status(201).json({ok:true,worker_key:key});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Worker servis nije dostupan."})}
}