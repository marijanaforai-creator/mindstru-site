import { requireUser } from "../_lib/auth.js";
const BASE="https://api.systeme.io/api";
export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    const key=process.env.SYSTEME_API_KEY;
    if(!key)return res.status(503).json({error:"systeme.io nije konfigurisan."});
    if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
    const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
    const action=String(b.action||"");
    const paths={contacts:"/contacts",funnels:"/funnels",campaigns:"/campaigns",products:"/products",offers:"/offers"};
    if(!paths[action])return res.status(400).json({error:"Nepodržana systeme.io akcija."});
    const r=await fetch(BASE+paths[action],{headers:{Authorization:"Bearer "+key,Accept:"application/json"}});
    const data=await r.json().catch(()=>({}));
    return res.status(r.status).json(data);
  }catch(e){console.error(e);return res.status(500).json({error:"systeme.io veza nije uspela."})}
}