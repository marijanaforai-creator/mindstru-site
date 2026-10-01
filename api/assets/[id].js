import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const id = String(req.query?.id || "");
    if (!id) return res.status(400).json({ error: "Nedostaje ID asseta." });

    if (req.method === "GET") {
      const result = await query(
        "SELECT id, project_id, name, mime_type, storage_key, size_bytes, metadata, created_at FROM assets WHERE id = $1 AND user_id = $2 LIMIT 1",
        [id, userId]
      );
      if (!result.rowCount) return res.status(404).json({ error: "Fajl nije pronađen." });
      return res.status(200).json({ asset: result.rows[0] });
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const result = await query(
        "UPDATE assets SET name = COALESCE($1,name), project_id = COALESCE($2,project_id), metadata = COALESCE($3::jsonb,metadata) WHERE id = $4 AND user_id = $5 RETURNING id, project_id, name, mime_type, storage_key, size_bytes, metadata, created_at",
        [
          body.name == null ? null : String(body.name).trim().slice(0,255),
          body.project_id == null ? null : String(body.project_id),
          body.metadata == null ? null : JSON.stringify(body.metadata),
          id,
          userId
        ]
      );
      if (!result.rowCount) return res.status(404).json({ error: "Fajl nije pronađen." });
      return res.status(200).json({ asset: result.rows[0] });
    }

    if (req.method === "DELETE") {
      const result = await query("DELETE FROM assets WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
      if (!result.rowCount) return res.status(404).json({ error: "Fajl nije pronađen." });
      return res.status(200).json({ ok: true, id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Operacija nad assetom nije uspela." });
  }
}
