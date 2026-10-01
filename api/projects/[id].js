import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const projectId = String(req.query?.id || "");
    if (!projectId) return res.status(400).json({ error: "Nedostaje ID projekta." });

    if (req.method === "GET") {
      const result = await query(
        "SELECT id, name, type, status, data, created_at, updated_at FROM projects WHERE id = $1 AND user_id = $2 LIMIT 1",
        [projectId, userId]
      );
      if (!result.rowCount) return res.status(404).json({ error: "Projekat nije pronađen." });
      return res.status(200).json({ project: result.rows[0] });
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const result = await query(
        "UPDATE projects SET name = COALESCE($1, name), type = COALESCE($2, type), status = COALESCE($3, status), data = COALESCE($4::jsonb, data), updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING id, name, type, status, data, created_at, updated_at",
        [
          body.name == null ? null : String(body.name).trim().slice(0, 200),
          body.type == null ? null : String(body.type).slice(0, 80),
          body.status == null ? null : String(body.status).slice(0, 80),
          body.data == null ? null : JSON.stringify(body.data),
          projectId,
          userId
        ]
      );
      if (!result.rowCount) return res.status(404).json({ error: "Projekat nije pronađen." });
      return res.status(200).json({ project: result.rows[0] });
    }

    if (req.method === "DELETE") {
      const result = await query(
        "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id",
        [projectId, userId]
      );
      if (!result.rowCount) return res.status(404).json({ error: "Projekat nije pronađen." });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Operacija nad projektom nije uspela." });
  }
}
