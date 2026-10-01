import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    if(req.method==="GET"){
      const r=await query("SELECT id,name,status,data,created_at,updated_at FROM funnels WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100",[userId]);
      return res.status(200).json({funnels:r.rows});
    }
    if(req.method==="POST"){
      const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
      const id=newId(), name=String(b.name||"Novi prodajni levak").trim().slice(0,255);
      const data=b.data&&typeof b.data==="object"?b.data:{};
      await query("INSERT INTO funnels(id,user_id,name,status,data) VALUES($1,$2,$3,$4,$5::jsonb)",[id,userId,name,"draft",JSON.stringify(data)]);
      return res.status(201).json({funnel:{id,name,status:"draft",data}});
    }
    return res.status(405).json({error:"Method not allowed"});
  }catch(e){console.error(e);return res.status(500).json({error:"Funnel servis nije dostupan."})}
}
