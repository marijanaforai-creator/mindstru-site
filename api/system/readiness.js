import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
 if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res); if(!userId)return;
 const checks=[];
 try{await query("SELECT 1");checks.push({id:"database",label:"Database",ok:true});}catch(e){checks.push({id:"database",label:"Database",ok:false});}
 const env=[
  ["AUTH_SECRET","Authentication"],
  ["DATABASE_URL","Database configuration"],
  ["OPENAI_API_KEY","AI Core"],
  ["STORAGE_BUCKET","Storage"]
 ];
 for(const [key,label] of env) checks.push({id:key.toLowerCase(),label,ok:Boolean(process.env[key])});
 const blocking=checks.filter(x=>!x.ok);
 return res.status(200).json({ok:blocking.length===0,environment:process.env.NODE_ENV||"development",checks,blocking_count:blocking.length});
}