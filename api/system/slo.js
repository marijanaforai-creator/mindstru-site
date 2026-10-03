import {query,newId} from "../_lib/db.js";import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){try{const userId=requireUser(req,res);if(!userId)return;
if(req.method==="GET"){const r=await query("SELECT * FROM system_slo_policies WHERE user_id=$1 ORDER BY created_at DESC",[userId]);return res.status(200).json({slo:r.rows});}
if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
await query("INSERT INTO system_slo_policies(id,user_id,name,service,target_percent,window_days) VALUES($1,$2,$3,$4,$5,$6)",[id,userId,String(b.name||"SLO"),String(b.service||"Marijana Runtime"),Number(b.target_percent||99),Number(b.window_days||30)]);
return res.status(201).json({ok:true,id});}catch(e){return res.status(500).json({error:"SLO politika nije sačuvana."});}}