import crypto from "node:crypto";
import { requireUser } from "../_lib/auth.js";
import { createUploadUrl } from "../_lib/storage.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res);
    if(!userId)return;
    if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
    const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
    const name=String(body.name||"file").trim().slice(0,255);
    const mimeType=String(body.mime_type||"application/octet-stream").slice(0,120);
    const projectId=body.project_id?String(body.project_id):"unassigned";
    const safeName=name.replace(/[^a-zA-Z0-9._-]+/g,"-");
    const key="users/"+userId+"/projects/"+projectId+"/"+crypto.randomUUID()+"-"+safeName;
    const uploadUrl=await createUploadUrl({key,contentType:mimeType});
    return res.status(200).json({uploadUrl,storageKey:key,name,mimeType});
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"Nije moguće pripremiti upload. Proveri storage konfiguraciju."});
  }
}
