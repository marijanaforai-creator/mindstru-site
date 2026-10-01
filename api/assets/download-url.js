import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
import { createDownloadUrl } from "../_lib/storage.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res);
    if(!userId)return;
    if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
    const id=String(req.query?.id||"");
    const result=await query("SELECT storage_key FROM assets WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
    if(!result.rowCount)return res.status(404).json({error:"Fajl nije pronađen."});
    const url=await createDownloadUrl(result.rows[0].storage_key);
    return res.status(200).json({url});
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"Nije moguće pripremiti download."});
  }
}
