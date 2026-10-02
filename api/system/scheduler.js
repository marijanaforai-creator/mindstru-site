import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,name,operation,cron_expression,enabled,payload,last_run_at,next_run_at,created_at,updated_at FROM system_schedules WHERE user_id=$1 ORDER BY created_at DESC",[userId]);
   return res.status(200).json({schedules:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
   await query("INSERT INTO system_schedules(id,user_id,name,operation,cron_expression,enabled,payload) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)",[id,userId,String(body.name||"Nova automatizacija").slice(0,160),String(body.operation||"system_check").slice(0,100),body.cron_expression?String(body.cron_expression).slice(0,120):null,body.enabled!==false,JSON.stringify(body.payload||{})]);
   return res.status(201).json({schedule:{id}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Scheduler servis nije dostupan."})}
}