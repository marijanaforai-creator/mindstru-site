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
  const input=b.input&&typeof b.input==="object"?b.input:{};
  const execution=await query("INSERT INTO automation_runs(id,automation_id,user_id,status,input) VALUES(gen_random_uuid(),$1,$2,'queued',$3::jsonb) RETURNING id",[automationId,userId,JSON.stringify(input)]);
  let sequenceRun=null;
  if(a.rows[0].config?.action==="Pokreni sekvencu"){
   const sequenceId=String(a.rows[0].config?.sequenceId||"");
   const contactId=input.contactId?String(input.contactId):null;
   if(!sequenceId) return res.status(400).json({error:"Za akciju Pokreni sekvencu nije izabrana email sekvenca."});
   const s=await query("SELECT id,emails FROM email_sequences WHERE id=$1 AND user_id=$2",[sequenceId,userId]);
   if(!s.rowCount)return res.status(404).json({error:"Izabrana email sekvenca nije pronađena."});
   if(!Array.isArray(s.rows[0].emails)||!s.rows[0].emails.length)return res.status(400).json({error:"Izabrana email sekvenca nema emailove."});
   const rr=await query("INSERT INTO email_sequence_runs(sequence_id,user_id,contact_id,status,input) VALUES($1,$2,$3,'queued',$4::jsonb) RETURNING id,status,current_email_index,created_at",[sequenceId,userId,contactId,JSON.stringify({mode:"automation",automationId,source:input.source||"automation"})]);
   sequenceRun=rr.rows[0];
  }
  await query("INSERT INTO usage_events(id,user_id,feature,quantity,metadata) VALUES(gen_random_uuid(),$1,'automation_run',1,$2::jsonb)",[userId,JSON.stringify({automation_id:automationId,sequence_run_id:sequenceRun?.id||null})]);
  return res.status(202).json({ok:true,runId:execution.rows[0].id,status:"queued",sequenceRun,message:sequenceRun?"Automatizacija je stavila email sekvencu u red čekanja. Nema stvarnog slanja.":"Izvršavanje je zabeleženo u redu čekanja."});
 }catch(e){console.error(e);return res.status(500).json({error:"Izvršavanje automatizacije nije uspelo."})}
}