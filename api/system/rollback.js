import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
 if(!body.release) return res.status(400).json({error:"Nedostaje release za rollback."});
 return res.status(200).json({ok:true,mode:"plan-only",message:"Rollback plan je pripremljen. Stvarna produkcijska promena zahteva deployment provider i eksplicitno odobrenje.",release:String(body.release)});
}