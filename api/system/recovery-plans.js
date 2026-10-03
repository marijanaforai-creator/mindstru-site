import {query,newId} from "../_lib/db.js";import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){try{const userId=requireUser(req,res);if(!userId)return;
if(req.method==="GET"){const r=await query("SELECT * FROM system_recovery_plans WHERE user_id=$1 ORDER BY created_at DESC",[userId]);return res.status(200).json({planovi:r.rows});}
if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
await query("INSERT INTO system_recovery_plans(id,user_id,name,trigger_type,actions,approval_required,enabled) VALUES($1,$2,$3,$4,$5::jsonb,$6,$7)",[id,userId,String(b.name||"Recovery plan"),String(b.trigger_type||"incident"),JSON.stringify(b.actions||[]),b.approval_required!==false,b.enabled!==false]);
return res.status(201).json({ok:true,id});}catch(e){return res.status(500).json({error:"Recovery plan nije sačuvan."});}}