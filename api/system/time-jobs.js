import { query,newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT * FROM system_time_jobs WHERE user_id=$1 ORDER BY next_run_at NULLS LAST,created_at DESC LIMIT 100",[userId]);
   return res.status(200).json({zakazivanja:r.rows});
  }
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
  await query("INSERT INTO system_time_jobs(id,user_id,name,operation,timezone,schedule_type,cron_expression,run_at,enabled,priority,payload,next_run_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$8)",[id,userId,String(b.name||"Novo zakazivanje"),String(b.operation||""),String(b.timezone||"Europe/Belgrade"),String(b.schedule_type||"once"),b.cron_expression||null,b.run_at||null,b.enabled!==false,Math.max(1,Math.min(100,Number(b.priority||50))),JSON.stringify(b.payload||{})]);
  return res.status(201).json({ok:true,id});
 }catch(e){console.error(e);return res.status(500).json({error:"Zakazivanje nije sačuvano."});}
}