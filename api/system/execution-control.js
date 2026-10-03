import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const oid=String(body.orchestration_id||"");
  const action=String(body.action||"").toLowerCase();
  if(!oid||!["pause","resume","stop","kill"].includes(action))return res.status(400).json({error:"Neispravna kontrolna akcija."});
  const r=await query("UPDATE system_orchestrations SET status=$1,updated_at=NOW(),finished_at=CASE WHEN $1 IN ('stopped','killed') THEN NOW() ELSE finished_at END WHERE id=$2 AND user_id=$3 RETURNING id,status",[action==="pause"?"paused":action==="resume"?"running":action==="stop"?"stopped":"killed",oid,userId]);
  if(!r.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  await query("INSERT INTO system_orchestration_events(user_id,orchestration_id,event_type,detail) VALUES($1,$2,$3,$4::jsonb)",[userId,oid,"execution_control",JSON.stringify({action})]);
  return res.status(200).json({ok:true,orchestration:r.rows[0],poruka:action==="kill"?"Izvršavanje je hitno zaustavljeno.":"Kontrola izvršavanja je primenjena."});
 }catch(error){console.error(error);return res.status(500).json({error:"Kontrola izvršavanja nije uspela."});}
}