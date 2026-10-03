import { query, newId } from "../../_lib/db.js";
import { requireUser } from "../../_lib/auth.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    if(req.method==="GET"){
      const r=await query("SELECT * FROM project_timelines WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100",[userId]);
      return res.status(200).json({timelines:r.rows});
    }
    if(req.method==="POST"){
      const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
      const id=newId(), name=String(b.project_name||"Novi projekat").trim().slice(0,200);
      await query("INSERT INTO project_timelines (id,user_id,project_id,project_name,start_date,end_date,buffer_days,budget,currency,status,progress,forecast_end_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",[id,userId,b.project_id||null,name,b.start_date,b.end_date,Number(b.buffer_days||0),Number(b.budget||0),String(b.currency||"EUR"),String(b.status||"planned"),Number(b.progress||0),b.forecast_end_date||null]);
      return res.status(201).json({timeline:{id,user_id:userId,project_name:name}});
    }
    return res.status(405).json({error:"Method not allowed"});
  }catch(e){console.error(e);return res.status(500).json({error:"Project Timeline trenutno nije dostupan."})}
}