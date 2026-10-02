import { requireUser } from "../_lib/auth.js";
import { query } from "../_lib/db.js";
const modules=[["drive",[]],["creator",["drive"]],["ai",[]],["contacts",["drive"]],["automation",["drive"]],["calendar",["drive"]],["audio",["ai"]],["agents",["ai","automation"]],["billing",["drive"]],["analytics",["drive"]]];
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 const graph=modules.map(([id,deps])=>({id,dependencies:deps}));
 const missing=[];
 for(const [id,deps] of modules) for(const dep of deps){
  if(!modules.some(x=>x[0]===dep))missing.push({module:id,dependency:dep});
 }
 let projectCount=0;try{const r=await query("SELECT COUNT(*)::int AS count FROM projects WHERE user_id=$1",[userId]);projectCount=r.rows[0]?.count||0;}catch(e){}
 return res.status(200).json({ok:missing.length===0,graph,missing,project_count:projectCount});
}