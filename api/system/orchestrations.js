import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const r=await query(
    "SELECT id,name,status,trigger,payload,result,error,created_at,started_at,finished_at,updated_at FROM system_orchestrations WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",
    [userId]
   );
   return res.status(200).json({orchestrations:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const id=newId();
   const name=String(body.name||"Nova orkestracija").trim().slice(0,200);
   const trigger=body.trigger?String(body.trigger).slice(0,100):"launcher";
   const payload=body.payload&&typeof body.payload==="object"?body.payload:{};
   await query(
    "INSERT INTO system_orchestrations(id,user_id,name,status,trigger,payload) VALUES($1,$2,$3,'planned',$4,$5::jsonb)",
    [id,userId,name,trigger,JSON.stringify(payload)]
   );
   return res.status(201).json({orchestration:{id,name,status:"planned",trigger,payload}});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Orkestrator trenutno nije dostupan."})}
}