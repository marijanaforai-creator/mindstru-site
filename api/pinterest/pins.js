import { requireUser } from "../_lib/auth.js";
import { query } from "../_lib/db.js";
export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    const c=await query("SELECT encrypted_data FROM connections WHERE user_id=$1 AND provider='pinterest' ORDER BY created_at DESC LIMIT 1",[userId]);
    if(!c.rowCount)return res.status(404).json({error:"Pinterest nije povezan."});
    const token=JSON.parse(c.rows[0].encrypted_data).access_token;
    const r=await fetch("https://api.pinterest.com/v5/pins",{headers:{Authorization:"Bearer "+token}});
    return res.status(r.status).json(await r.json().catch(()=>({})));
  }catch(e){console.error(e);return res.status(500).json({error:"Pinterest API nije dostupan."})}
}