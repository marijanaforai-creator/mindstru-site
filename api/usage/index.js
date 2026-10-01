import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const feature = String(body.feature || "").trim().slice(0, 100);
      const quantity = Math.max(1, Math.min(100000, Number(body.quantity || 1)));
      if (!feature) return res.status(400).json({ error: "Nedostaje feature." });

      const id = newId();
      const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};
      await query(
        "INSERT INTO usage_events (id,user_id,feature,quantity,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)",
        [id,userId,feature,quantity,JSON.stringify(metadata)]
      );
      return res.status(201).json({ ok:true, id });
    }

    if (req.method === "GET") {
      const result = await query(
        "SELECT feature, COALESCE(SUM(quantity),0)::int AS quantity FROM usage_events WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY feature ORDER BY feature",
        [userId]
      );
      return res.status(200).json({ usage: result.rows });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Usage servis trenutno nije dostupan." });
  }
}
