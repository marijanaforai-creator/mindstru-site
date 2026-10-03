import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const actions=[];
  const q=await query("UPDATE system_queue SET status='queued',locked_at=NULL,locked_by=NULL,updated_at=NOW() WHERE user_id=$1 AND status='failed' AND attempts<3 RETURNING id",[userId]);if(q.rowCount)actions.push({tip:"ponovo_u_red",broj:q.rowCount});
  const w=await query("UPDATE system_workers SET status='idle',updated_at=NOW() WHERE user_id=$1 AND status='offline' AND last_heartbeat < NOW() - INTERVAL '30 minutes' RETURNING id",[userId]);if(w.rowCount)actions.push({tip:"reset_radnika",broj:w.rowCount});
  return res.status(200).json({ok:true,akcije:actions,poruka:"Primena bezbednih self-healing pravila je završena."});
 }catch(e){console.error(e);return res.status(500).json({error:"Self-healing nije uspeo."});}
}