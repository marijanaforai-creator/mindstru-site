import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=String(b.queue_id||""),p=Math.max(1,Math.min(100,Number(b.priority||50)));
  const r=await query("UPDATE system_queue SET priority=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING id,priority",[p,id,userId]);if(!r.rowCount)return res.status(404).json({error:"Posao nije pronađen."});return res.status(200).json({ok:true,posao:r.rows[0]});
 }catch(e){return res.status(500).json({error:"Prioritet nije promenjen."});}
}