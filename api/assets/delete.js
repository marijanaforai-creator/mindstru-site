import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";
import { deleteStoredObject } from "../_lib/storage.js";

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res);
    if(!userId)return;
    if(req.method!=="DELETE")return res.status(405).json({error:"Method not allowed"});
    const id=String(req.query?.id||"");
    const result=await query("SELECT storage_key FROM assets WHERE id=$1 AND user_id=$2 LIMIT 1",[id,userId]);
    if(!result.rowCount)return res.status(404).json({error:"Fajl nije pronađen."});
    await deleteStoredObject(result.rows[0].storage_key);
    await query("DELETE FROM assets WHERE id=$1 AND user_id=$2",[id,userId]);
    return res.status(200).json({ok:true});
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"Brisanje fajla nije uspelo."});
  }
}
