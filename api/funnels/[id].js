import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    const id=String(req.query?.id||""); if(!id)return res.status(400).json({error:"Nedostaje ID."});
    if(req.method==="GET"){
      const r=await query("SELECT id,name,status,data,created_at,updated_at FROM funnels WHERE id=$1 AND user_id=$2",[id,userId]);
      if(!r.rowCount)return res.status(404).json({error:"Funnel nije pronađen."});
      return res.status(200).json({funnel:r.rows[0]});
    }
    if(req.method==="PUT"){
      const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
      const r=await query("UPDATE funnels SET name=COALESCE($1,name),status=COALESCE($2,status),data=COALESCE($3::jsonb,data),updated_at=NOW() WHERE id=$4 AND user_id=$5 RETURNING id,name,status,data,created_at,updated_at",[b.name?String(b.name).slice(0,255):null,b.status?String(b.status).slice(0,40):null,b.data?JSON.stringify(b.data):null,id,userId]);
      if(!r.rowCount)return res.status(404).json({error:"Funnel nije pronađen."});
      return res.status(200).json({funnel:r.rows[0]});
    }
    if(req.method==="DELETE"){
      const r=await query("DELETE FROM funnels WHERE id=$1 AND user_id=$2 RETURNING id",[id,userId]);
      if(!r.rowCount)return res.status(404).json({error:"Funnel nije pronađen."});
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:"Method not allowed"});
  }catch(e){console.error(e);return res.status(500).json({error:"Operacija nad funnelom nije uspela."})}
}
