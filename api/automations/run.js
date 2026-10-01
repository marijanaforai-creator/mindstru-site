import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const automationId=String(b.automationId||"");
  if(!automationId)return res.status(400).json({error:"Nedostaje automationId."});
  const a=await query("SELECT id,name,status,trigger_type,config FROM automations WHERE id=$1 AND user_id=$2",[automationId,userId]);
  if(!a.rowCount)return res.status(404).json({error:"Automatizacija nije pronađena."});
  const execution=await query("INSERT INTO automation_runs(id,automation_id,user_id,status,input) VALUES(gen_random_uuid(),$1,$2,'queued',$3::jsonb) RETURNING id",[automationId,userId,JSON.stringify(b.input||{})]);
  await query("INSERT INTO usage_events(id,user_id,feature,quantity,metadata) VALUES(gen_random_uuid(),$1,'automation_run',1,$2::jsonb)",[userId,JSON.stringify({automation_id:automationId})]);
  return res.status(202).json({ok:true,runId:execution.rows[0].id,status:"queued",message:"Izvršavanje je zabeleženo. Povezivanje stvarnih akcija dolazi kroz konektore."});
 }catch(e){console.error(e);return res.status(500).json({error:"Izvršavanje automatizacije nije uspelo."})}
}