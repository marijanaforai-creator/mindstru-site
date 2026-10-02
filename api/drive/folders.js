import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT id,name,parent_id,created_at,updated_at FROM drive_folders WHERE user_id=$1 ORDER BY name ASC",[userId]);
   return res.status(200).json({folders:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const name=String(body.name||"Novi folder").trim().slice(0,160);
   const parentId=body.parent_id?String(body.parent_id):null;
   if(!name)return res.status(400).json({error:"Naziv foldera je obavezan."});
   const id=newId();
   const r=await query("INSERT INTO drive_folders(id,user_id,parent_id,name) VALUES($1,$2,$3,$4) RETURNING id,name,parent_id,created_at,updated_at",[id,userId,parentId,name]);
   return res.status(201).json({folder:r.rows[0]});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Rad sa folderima nije uspeo."})}
}