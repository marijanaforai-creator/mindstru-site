import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});const id=String(req.body?.id||req.body?.notification_id||"");const r=await query("UPDATE system_notifications SET read_at=NOW() WHERE id=$1 AND user_id=$2 RETURNING id",[id,userId]);if(!r.rowCount)return res.status(404).json({error:"Obaveštenje nije pronađeno."});return res.status(200).json({ok:true});}catch(e){return res.status(500).json({error:"Obaveštenje nije označeno."});}
}