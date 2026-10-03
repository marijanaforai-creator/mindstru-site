import {query,newId} from "../_lib/db.js";import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){try{const userId=requireUser(req,res);if(!userId)return;
if(req.method==="GET"){const r=await query("SELECT * FROM system_alert_rules WHERE user_id=$1 ORDER BY created_at DESC",[userId]);return res.status(200).json({pravila:r.rows});}
if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
await query("INSERT INTO system_alert_rules(id,user_id,name,metric_name,operator,threshold,severity,enabled) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",[id,userId,String(b.name||"Novo pravilo"),String(b.metric_name||""),String(b.operator||">"),Number(b.threshold||0),String(b.severity||"medium"),b.enabled!==false]);
return res.status(201).json({ok:true,id});}catch(e){return res.status(500).json({error:"Pravilo upozorenja nije sačuvano."});}}