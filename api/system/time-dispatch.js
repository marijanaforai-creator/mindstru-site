import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const r=await query("SELECT * FROM system_time_jobs WHERE user_id=$1 AND enabled=TRUE AND next_run_at IS NOT NULL AND next_run_at<=NOW() ORDER BY priority DESC,next_run_at ASC LIMIT 20",[userId]);
  const jobs=[];
  for(const j of r.rows){
   const eid=newId();
   await query("INSERT INTO system_executions(id,user_id,operation,target,status,progress,payload) VALUES($1,$2,$3,'scheduler','queued',0,$4::jsonb)",[eid,userId,j.operation,JSON.stringify({...j.payload,time_job_id:j.id})]);
   await query("INSERT INTO system_queue(id,user_id,execution_id,priority) VALUES($1,$2,$3,$4)",[newId(),userId,eid,j.priority]);
   await query("UPDATE system_time_jobs SET last_run_at=NOW(),next_run_at=CASE WHEN schedule_type='once' THEN NULL ELSE next_run_at END,updated_at=NOW() WHERE id=$1",[j.id]);
   jobs.push(eid);
  }
  return res.status(200).json({status:"prosleđeno",poslovi:jobs});
 }catch(e){console.error(e);return res.status(500).json({error:"Vremenski dispatcher nije uspeo."});}
}