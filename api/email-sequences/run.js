import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

function bodyOf(req){return typeof req.body==="string"?JSON.parse(req.body):(req.body||{});}
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="POST"){
   const b=bodyOf(req), sequenceId=String(b.sequenceId||"");
   if(!sequenceId)return res.status(400).json({error:"Nedostaje ID sekvence."});
   const q=await query("SELECT id,name,status,emails FROM email_sequences WHERE id=$1 AND user_id=$2",[sequenceId,userId]);
   if(!q.rowCount)return res.status(404).json({error:"Email sekvenca nije pronađena."});
   if(!Array.isArray(q.rows[0].emails)||!q.rows[0].emails.length)return res.status(400).json({error:"Sekvenca nema emailove."});
   const r=await query("INSERT INTO email_sequence_runs(sequence_id,user_id,contact_id,status,input) VALUES($1,$2,$3,'queued',$4::jsonb) RETURNING id,sequence_id,status,current_email_index,created_at",[sequenceId,userId,b.contactId||null,JSON.stringify({mode:b.mode||"test",scheduledFor:b.scheduledFor||null})]);
   await query("UPDATE email_sequences SET status=CASE WHEN status='draft' THEN 'active' ELSE status END,activated_at=COALESCE(activated_at,NOW()),next_run_at=$1 WHERE id=$2 AND user_id=$3",[b.scheduledFor||null,sequenceId,userId]);
   return res.status(202).json({run:r.rows[0],message:"Sekvenca je stavljena u red čekanja. U ovom koraku ne šalje se stvarni email."});
  }
  if(req.method==="GET"){
   const sequenceId=String(req.query?.sequenceId||"");
   const r=await query(sequenceId?
    "SELECT id,sequence_id,contact_id,status,current_email_index,input,output,error,created_at,completed_at FROM email_sequence_runs WHERE sequence_id=$1 AND user_id=$2 ORDER BY created_at DESC LIMIT 100":
    "SELECT id,sequence_id,contact_id,status,current_email_index,input,output,error,created_at,completed_at FROM email_sequence_runs WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",
    sequenceId?[sequenceId,userId]:[userId]);
   return res.status(200).json({runs:r.rows});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Izvršavanje email sekvence nije dostupno."})}
}