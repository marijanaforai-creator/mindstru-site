import crypto from "node:crypto";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res); if(!userId)return;
 try{
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const target=String(body.target||"staging");
  if(!["staging","production"].includes(target)) return res.status(400).json({error:"Nepoznat deployment target."});
  const steps=[
   {id:"health",name:"System health",required:true},
   {id:"dependencies",name:"Module dependencies",required:true},
   {id:"migrations",name:"Database migrations",required:true},
   {id:"environment",name:"Environment readiness",required:true},
   {id:"build",name:"Application build",required:true},
   {id:"smoke",name:"Smoke tests",required:true},
   ...(target==="production"?[{id:"approval",name:"Production approval",required:true}]:[])
  ];
  return res.status(200).json({plan_id:crypto.randomUUID(),target,created_at:new Date().toISOString(),steps});
 }catch(e){return res.status(500).json({error:"Deployment plan nije mogao biti kreiran."});}
}