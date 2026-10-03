import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const id=String(req.query?.id||req.body?.orchestration_id||"");
  if(!id)return res.status(400).json({error:"Nedostaje orchestration ID."});
  const owner=await query("SELECT id FROM system_orchestrations WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
  if(!owner.rowCount)return res.status(404).json({error:"Orkestracija nije pronađena."});
  const r=await query("SELECT step_key,name,position,status,depends_on,parallel_group,approval_required FROM system_orchestration_steps WHERE orchestration_id=$1 ORDER BY position ASC",[id]);
  const byKey=new Map(r.rows.map(s=>[s.step_key,s]));
  const invalid=[]; const ready=[]; const blocked=[];
  for(const s of r.rows){
   const deps=Array.isArray(s.depends_on)?s.depends_on:[];
   if(deps.some(d=>!byKey.has(d))) invalid.push(s.step_key);
   else if(!deps.length&&!s.approval_required&&s.status==="queued") ready.push(s.step_key);
   else if(deps.length) blocked.push(s.step_key);
  }
  return res.status(200).json({orchestration_id:id,order:r.rows.map(s=>s.step_key),ready,blocked,invalid,parallel_groups:[...new Set(r.rows.map(s=>s.parallel_group).filter(Boolean))]});
 }catch(e){console.error(e);return res.status(500).json({error:"Resolver zavisnosti nije dostupan."})}
}