import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 const userId=requireUser(req,res); if(!userId)return;
 try{
  if(req.method==="GET"){
   const r=await query("SELECT id,action,details,created_at FROM system_audit_log WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[userId]);
   return res.status(200).json({events:r.rows});
  }
  if(req.method==="POST"){
   const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
   const action=String(body.action||"unknown").slice(0,120);
   const details=body.details&&typeof body.details==="object"?body.details:{};
   const r=await query("INSERT INTO system_audit_log(user_id,action,details) VALUES($1,$2,$3::jsonb) RETURNING id,action,details,created_at",[userId,action,JSON.stringify(details)]);
   return res.status(201).json({event:r.rows[0]});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error(e);return res.status(500).json({error:"Audit operacija nije uspela."});}
}