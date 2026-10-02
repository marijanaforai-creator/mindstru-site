import { requireUser } from "../_lib/auth.js";
const states=["planned","installing","installed","configured","testing","ready","active","disabled","upgrading","error"];
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
 const moduleId=String(body.module_id||"");const action=String(body.action||"");
 if(!moduleId||!action)return res.status(400).json({error:"Modul i akcija su obavezni."});
 const allowed=["install","configure","test","activate","disable","upgrade"];
 if(!allowed.includes(action))return res.status(400).json({error:"Nepoznata lifecycle akcija."});
 const target={install:"installed",configure:"configured",test:"testing",activate:"active",disable:"disabled",upgrade:"upgrading"}[action];
 return res.status(200).json({ok:true,module_id:moduleId,action,state:target,mode:"orchestrated",message:"Lifecycle korak je pripremljen; stvarna instalacija zahteva povezane servise i deployment provider."});
}