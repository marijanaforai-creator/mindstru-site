import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  try{
    const userId=requireUser(req,res); if(!userId) return;
    const checks=[];
    try{ await query("SELECT 1"); checks.push({id:"database",name:"Database",state:"ready",detail:"Database connection OK"}); }
    catch(e){ checks.push({id:"database",name:"Database",state:"error",detail:"Database connection failed"}); }
    checks.push({id:"api",name:"API",state:"ready",detail:"API runtime responding"});
    checks.push({id:"auth",name:"Authentication",state:"ready",detail:"Authenticated user resolved"});
    checks.push({id:"storage",name:"Storage",state:process.env.STORAGE_BUCKET?"ready":"pending",detail:process.env.STORAGE_BUCKET?"Storage configured":"Storage provider not configured"});
    checks.push({id:"ai",name:"AI Core",state:process.env.OPENAI_API_KEY?"ready":"pending",detail:process.env.OPENAI_API_KEY?"AI credentials configured":"AI credentials not configured"});
    checks.push({id:"scheduler",name:"Scheduler",state:"pending",detail:"Scheduler provider check not yet connected"});
    checks.push({id:"deploy",name:"Deployment",state:"pending",detail:"External deployment provider check not yet connected"});
    return res.status(200).json({ok:true,checked_at:new Date().toISOString(),checks});
  }catch(e){ console.error(e); return res.status(500).json({error:"System health check failed"}); }
}