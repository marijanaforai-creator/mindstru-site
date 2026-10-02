import { requireUser } from "../_lib/auth.js";
import { query } from "../_lib/db.js";

const folders = [
  { key: "product", name: "01 · Proizvod" },
  { key: "sales", name: "02 · Prodajna stranica" },
  { key: "seo", name: "03 · SEO" },
  { key: "pinterest", name: "04 · Pinterest" },
  { key: "social", name: "05 · Društvene mreže" },
  { key: "email", name: "06 · Email" },
  { key: "mockup", name: "07 · Mockup" },
  { key: "brand", name: "08 · Brand assets" },
  { key: "analytics", name: "09 · Analitika" }
];

export default function handler(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try { const r=await query("SELECT id,name,parent_id,created_at,updated_at FROM drive_folders WHERE user_id=$1 ORDER BY name ASC",[userId]); return res.status(200).json({ folders:[...folders.map(x=>({...x,system:true})),...r.rows] }); } catch(e) { return res.status(200).json({ folders: folders.map(x=>({...x,system:true})) }); }
}
