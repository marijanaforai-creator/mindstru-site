import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;
    if (req.method === "GET") {
      const r = await query("SELECT id, data, updated_at FROM projects WHERE user_id=$1 AND type='brand_kit' ORDER BY updated_at DESC LIMIT 1",[userId]);
      return res.status(200).json({ brandKit: r.rows[0]?.data || null, projectId:r.rows[0]?.id || null });
    }
    if (req.method === "POST" || req.method === "PUT") {
      const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
      const data=body.brandKit && typeof body.brandKit==="object"?body.brandKit:{};
      const existing=await query("SELECT id FROM projects WHERE user_id=$1 AND type='brand_kit' ORDER BY updated_at DESC LIMIT 1",[userId]);
      if(existing.rows[0]){
        await query("UPDATE projects SET name=$1,data=$2::jsonb,updated_at=NOW() WHERE id=$3 AND user_id=$4",["Marijana Alhemija — Brand Kit",JSON.stringify(data),existing.rows[0].id,userId]);
        return res.status(200).json({brandKit:data,projectId:existing.rows[0].id});
      }
      const id=newId();
      await query("INSERT INTO projects(id,user_id,name,type,status,data) VALUES($1,$2,$3,$4,$5,$6::jsonb)",[id,userId,"Marijana Alhemija — Brand Kit","brand_kit","active",JSON.stringify(data)]);
      return res.status(201).json({brandKit:data,projectId:id});
    }
    return res.status(405).json({error:"Method not allowed"});
  } catch(e){ console.error(e); return res.status(500).json({error:"Brand Kit trenutno nije dostupan."}); }
}