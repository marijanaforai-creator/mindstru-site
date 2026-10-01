import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    if (req.method === "GET") {
      const result = await query(
        "SELECT id, name, type, status, data, created_at, updated_at FROM projects WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 100",
        [userId]
      );
      return res.status(200).json({ projects: result.rows });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const id = newId();
      const name = String(body.name || "Novi projekat").trim().slice(0, 200);
      const type = String(body.type || "product_system").slice(0, 80);
      const status = String(body.status || "draft").slice(0, 80);
      const data = body.data && typeof body.data === "object" ? body.data : {};

      await query(
        "INSERT INTO projects (id, user_id, name, type, status, data) VALUES ($1, $2, $3, $4, $5, $6::jsonb)",
        [id, userId, name, type, status, JSON.stringify(data)]
      );

      return res.status(201).json({
        project: { id, user_id: userId, name, type, status, data }
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Rad sa projektima trenutno nije dostupan." });
  }
}
