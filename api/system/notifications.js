import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  if(req.method==="GET"){const r=await query("SELECT * FROM system_notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[userId]);return res.status(200).json({obavestenja:r.rows});}
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=newId();
  await query("INSERT INTO system_notifications(id,user_id,type,title,message,priority,metadata) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)",[id,userId,String(b.type||"info"),String(b.title||"Obaveštenje"),String(b.message||""),Number(b.priority||50),JSON.stringify(b.metadata||{})]);
  return res.status(201).json({ok:true,id});
 }catch(e){console.error(e);return res.status(500).json({error:"Obaveštenje nije sačuvano."});}
}