import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const eventType=String(body.event_type||"manual");
  const id=newId();
  await query("INSERT INTO system_runtime_events(id,user_id,event_type,source,payload) VALUES($1,$2,$3,$4,$5::jsonb)",[id,userId,eventType,body.source?String(body.source):null,JSON.stringify(body.payload||{})]);
  const triggers=await query("SELECT id,name,operation,payload FROM system_runtime_triggers WHERE user_id=$1 AND event_type=$2 AND enabled=TRUE",[userId,eventType]);
  return res.status(201).json({event_id:id,ok:true,aktivni_okidaci:triggers.rows});
 }catch(error){console.error(error);return res.status(500).json({error:"Runtime događaj nije sačuvan."});}
}