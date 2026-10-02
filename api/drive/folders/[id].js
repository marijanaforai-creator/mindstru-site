import { query } from "../../_lib/db.js";
import { requireUser } from "../../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const id=String(req.query?.id||"");if(!id)return res.status(400).json({error:"Nedostaje ID foldera."});
  if(req.method==="PUT"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const name=String(body.name||"").trim().slice(0,160);
   if(!name)return res.status(400).json({error:"Naziv foldera je obavezan."});
   const r=await query("UPDATE drive_folders SET name=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING id,name,parent_id,created_at,updated_at",[name,id,userId]);
   if(!r.rowCount)return res.status(404).json({error:"Folder nije pronađen."});
   return res.status(200).json({folder:r.rows[0]});
  }
  if(req.method==="DELETE"){
   const r=await query("DELETE FROM drive_folders WHERE id=$1 AND user_id=$2 RETURNING id",[id,userId]);
   if(!r.rowCount)return res.status(404).json({error:"Folder nije pronađen."});
   return res.status(200).json({ok:true});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Operacija nad folderom nije uspela."})}
}