import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    if (req.method === "GET") {
      const projectId = req.query?.project_id ? String(req.query.project_id) : null;
      const result = projectId
        ? await query(
            "SELECT id, project_id, name, mime_type, storage_key, size_bytes, metadata, created_at FROM assets WHERE user_id = $1 AND project_id = $2 ORDER BY created_at DESC LIMIT 200",
            [userId, projectId]
          )
        : await query(
            "SELECT id, project_id, name, mime_type, storage_key, size_bytes, metadata, created_at FROM assets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200",
            [userId]
          );

      return res.status(200).json({ assets: result.rows });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const id = newId();
      const name = String(body.name || "Novi fajl").trim().slice(0, 255);
      const mimeType = String(body.mime_type || "application/octet-stream").slice(0, 120);
      const storageKey = String(body.storage_key || "").trim().slice(0, 1000);
      const projectId = body.project_id ? String(body.project_id) : null;
      const sizeBytes = Number.isFinite(Number(body.size_bytes)) ? Number(body.size_bytes) : null;
      const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};

      if (!storageKey) return res.status(400).json({ error: "Nedostaje storage_key." });

      if (projectId) {
        const owner = await query("SELECT id FROM projects WHERE id = $1 AND user_id = $2 LIMIT 1", [projectId, userId]);
        if (!owner.rowCount) return res.status(403).json({ error: "Projekat nije dostupan." });
      }

      await query(
        "INSERT INTO assets (id, user_id, project_id, name, mime_type, storage_key, size_bytes, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)",
        [id, userId, projectId, name, mimeType, storageKey, sizeBytes, JSON.stringify(metadata)]
      );

      return res.status(201).json({
        asset: { id, project_id: projectId, name, mime_type: mimeType, storage_key: storageKey, size_bytes: sizeBytes, metadata }
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Rad sa assetima trenutno nije dostupan." });
  }
}
