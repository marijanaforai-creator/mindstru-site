import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const id=String(req.body?.id||req.body?.incident_id||"");const r=await query("UPDATE system_incidents SET status='resolved',resolved_at=NOW() WHERE id=$1 AND user_id=$2 RETURNING id,status,resolved_at",[id,userId]);if(!r.rowCount)return res.status(404).json({error:"Incident nije pronađen."});return res.status(200).json({ok:true,incident:r.rows[0]});
 }catch(e){return res.status(500).json({error:"Incident nije rešen."});}
}