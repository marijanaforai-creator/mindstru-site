import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,name,email,source,lead_magnet,product,status,tags,last_activity_at,created_at,updated_at FROM contacts WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 500",[userId]);
   return res.status(200).json({contacts:r.rows});
  }
  if(req.method==="POST"){
   const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const email=String(b.email||"").trim().toLowerCase();if(!email)return res.status(400).json({error:"Email je obavezan."});
   const name=String(b.name||"").trim().slice(0,200),source=String(b.source||"").trim().slice(0,100),status=String(b.status||"new").slice(0,50);
   const r=await query("INSERT INTO contacts(id,user_id,name,email,source,lead_magnet,product,status,tags,metadata,last_activity_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,NOW()) ON CONFLICT(user_id,email) DO UPDATE SET name=EXCLUDED.name,source=EXCLUDED.source,lead_magnet=EXCLUDED.lead_magnet,product=EXCLUDED.product,status=EXCLUDED.status,tags=EXCLUDED.tags,metadata=EXCLUDED.metadata,last_activity_at=NOW(),updated_at=NOW() RETURNING *",[newId(),userId,name,email,source,String(b.leadMagnet||""),String(b.product||""),status,JSON.stringify(Array.isArray(b.tags)?b.tags:[]),JSON.stringify(b.metadata||{})]);
   const active=await query("SELECT id,config FROM automations WHERE user_id=$1 AND status='active' AND trigger_type='new_lead'",[userId]);
   const triggered=[];
   for(const a of active.rows){
    if(a.config?.action==="Pokreni sekvencu" && a.config?.sequenceId){
     const s=await query("SELECT id,emails FROM email_sequences WHERE id=$1 AND user_id=$2",[a.config.sequenceId,userId]);
     if(s.rowCount && Array.isArray(s.rows[0].emails) && s.rows[0].emails.length){
      const ar=await query("INSERT INTO automation_runs(id,automation_id,user_id,status,input) VALUES(gen_random_uuid(),$1,$2,'queued',$3::jsonb) RETURNING id",[a.id,userId,JSON.stringify({source:"new_contact",contactId:r.rows[0].id})]);
      const sr=await query("INSERT INTO email_sequence_runs(sequence_id,user_id,contact_id,status,input) VALUES($1,$2,$3,'queued',$4::jsonb) RETURNING id,status",[s.rows[0].id,userId,r.rows[0].id,JSON.stringify({mode:"automation",automationId:a.id,source:"new_contact"})]);
      triggered.push({automationRunId:ar.rows[0].id,sequenceRunId:sr.rows[0].id});
     }
    }
   }
   return res.status(201).json({contact:r.rows[0],triggered});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Kontakti trenutno nisu dostupni."})}
}