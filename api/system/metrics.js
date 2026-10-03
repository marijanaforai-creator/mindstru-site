import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){const r=await query("SELECT metric_name,metric_value,unit,source,labels,recorded_at FROM system_metrics WHERE user_id=$1 ORDER BY recorded_at DESC LIMIT 200",[userId]);return res.status(200).json({metrike:r.rows});}
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const id=newId();await query("INSERT INTO system_metrics(id,user_id,metric_name,metric_value,unit,source,labels) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)",[id,userId,String(b.metric_name||"metric"),Number(b.metric_value||0),b.unit||null,b.source||null,JSON.stringify(b.labels||{})]);
  return res.status(201).json({ok:true,id});
 }catch(e){console.error(e);return res.status(500).json({error:"Metrika nije sačuvana."});}
}