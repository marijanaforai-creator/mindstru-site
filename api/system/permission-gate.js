import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 const userId=requireUser(req,res);if(!userId)return;
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
 const required=Array.isArray(b.required_permissions)?b.required_permissions:[];
 const granted=Array.isArray(b.granted_permissions)?b.granted_permissions:[];
 const missing=required.filter(x=>!granted.includes(x));
 return res.status(200).json({user_id:userId,allowed:missing.length===0,missing});
}