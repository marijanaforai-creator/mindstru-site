import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res); if(!userId)return;
  if(req.method==="GET"){
   const r=await query("SELECT * FROM system_execution_policies WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 50",[userId]);
   return res.status(200).json({politike:r.rows});
  }
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const id=newId();
  await query("INSERT INTO system_execution_policies(id,user_id,name,max_risk,max_cost,require_approval_above_risk,allow_autonomous,kill_switch_enabled,rules) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)",[id,userId,String(body.name||"Podrazumevana politika"),Math.max(0,Math.min(100,Number(body.max_risk??50))),body.max_cost==null?null:Number(body.max_cost),Math.max(0,Math.min(100,Number(body.require_approval_above_risk??70))),Boolean(body.allow_autonomous),body.kill_switch_enabled!==false,JSON.stringify(body.rules||{})]);
  return res.status(201).json({ok:true,id});
 }catch(error){console.error(error);return res.status(500).json({error:"Politika izvršavanja nije sačuvana."});}
}