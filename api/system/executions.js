import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,operation,target,status,progress,payload,result,error,attempts,created_at,started_at,finished_at,updated_at FROM system_executions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[userId]);
   return res.status(200).json({executions:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const id=newId(), operation=String(body.operation||"system_check").slice(0,100), target=body.target?String(body.target).slice(0,80):null;
   const payload=body.payload&&typeof body.payload==="object"?body.payload:{};
   await query("INSERT INTO system_executions(id,user_id,operation,target,status,progress,payload) VALUES($1,$2,$3,$4,'queued',0,$5::jsonb)",[id,userId,operation,target,JSON.stringify(payload)]);
   return res.status(201).json({execution:{id,operation,target,status:"queued",progress:0}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Execution servis nije dostupan."})}
}