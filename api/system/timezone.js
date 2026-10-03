import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;const tz=String(req.query?.timezone||"Europe/Belgrade");new Intl.DateTimeFormat("sr-RS",{timeZone:tz}).format(new Date());return res.status(200).json({timezone:tz,sada:new Date().toISOString()});}catch(e){return res.status(400).json({error:"Nepoznata vremenska zona."});}
}