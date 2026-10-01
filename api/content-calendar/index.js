import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,title,channel,format,status,scheduled_at,content,metadata,project_id FROM content_items WHERE user_id=$1 ORDER BY scheduled_at NULLS LAST,updated_at DESC LIMIT 500",[userId]);
   return res.status(200).json({items:r.rows});
  }
  if(req.method==="POST"){
   const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const title=String(b.title||"Novi sadržaj").trim().slice(0,255);
   const r=await query("INSERT INTO content_items(id,user_id,project_id,title,channel,format,status,scheduled_at,content,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) RETURNING *",[newId(),userId,b.projectId||null,title,String(b.channel||"Instagram"),String(b.format||"Objava"),String(b.status||"Ideja"),b.scheduledAt||null,String(b.content||""),JSON.stringify(b.metadata||{})]);
   return res.status(201).json({item:r.rows[0]});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Kalendar sadržaja nije dostupan."})}
}