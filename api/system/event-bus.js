import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const id=String(req.query?.orchestration_id||"");
   const r=await query("SELECT * FROM system_orchestration_events WHERE user_id=$1 AND ($2='' OR orchestration_id=$2::uuid) ORDER BY created_at DESC LIMIT 200",[userId,id]);
   return res.status(200).json({events:r.rows});
  }
  if(req.method==="POST"){
   const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const r=await query("INSERT INTO system_orchestration_events(id,user_id,orchestration_id,step_id,event_type,payload) VALUES($1,$2,$3,$4,$5,$6::jsonb) RETURNING *",[newId(),userId,b.orchestration_id||null,b.step_id||null,String(b.event_type||"CUSTOM").slice(0,100),JSON.stringify(b.payload||{})]);
   return res.status(201).json({event:r.rows[0]});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Event bus nije dostupan."})}
}