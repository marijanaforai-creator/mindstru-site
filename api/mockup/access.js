import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

const ACTIONS = {
  smart_fit: { credits: 0, feature: "editor" },
  scene_3d: { credits: 5, feature: "3d" },
  bulk_variants: { credits: 20, feature: "bulk_variants" },
  ai_scene: { credits: 10, feature: "prompt_to_scene" },
  image_to_mockup: { credits: 15, feature: "prompt_to_scene" },
  ai_video_mockup: { credits: 30, feature: "prompt_to_scene" }
};

function hasFeature(features, requested) {
  const set = new Set(Array.isArray(features) ? features : []);
  if (set.has(requested) || set.has("everything_ai_mockup")) return true;
  if (set.has("everything_business")) {
    return ["editor", "2d", "all_mockups", "templates", "hd_export", "brand_kit",
      "3d", "isometric", "perspective", "depth", "web_gallery", "bulk_variants",
      "bulk_edit", "batch_export", "brand_kit_pro", "commercial_workflow",
      "prompt_to_scene", "auto_layout", "multi_variant", "social_formats"].includes(requested);
  }
  if (set.has("everything_3d_pro")) {
    return ["editor", "2d", "all_mockups", "templates", "hd_export", "brand_kit",
      "3d", "isometric", "perspective", "depth", "web_gallery", "bulk_variants"].includes(requested);
  }
  if (set.has("everything_creator")) {
    return ["editor", "2d", "all_mockups", "templates", "hd_export", "brand_kit"].includes(requested);
  }
  return false;
}

async function ensureEntitlement(userId) {
  await query(
    `INSERT INTO mockup_entitlements (id, user_id, plan_id, credits_balance, status)
     SELECT $1, $2, p.id, p.credits, 'active'
     FROM mockup_service_plans p
     WHERE p.code = 'free'
     ON CONFLICT (user_id) DO NOTHING`,
    [newId(), userId]
  );
}

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;
    if (!["GET", "POST"].includes(req.method)) {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Metod nije dozvoljen." });
    }

    await ensureEntitlement(userId);

    if (req.method === "GET") {
      const result = await query(
        `SELECT e.credits_balance, e.status, e.starts_at, e.ends_at,
                p.code AS plan_code, p.name AS plan_name, p.features, p.limits
         FROM mockup_entitlements e
         LEFT JOIN mockup_service_plans p ON p.id = e.plan_id
         WHERE e.user_id = $1 LIMIT 1`,
        [userId]
      );
      if (!result.rowCount) return res.status(503).json({ error: "Nije moguće učitati prava pristupa." });
      const row = result.rows[0];
      const now = Date.now();
      const active = row.status === "active" &&
        (!row.starts_at || new Date(row.starts_at).getTime() <= now) &&
        (!row.ends_at || new Date(row.ends_at).getTime() > now);
      return res.status(200).json({
        plan: row.plan_code || "free",
        planName: row.plan_name || "Free",
        credits: row.credits_balance,
        status: active ? "active" : "inactive",
        features: row.features || [],
        limits: row.limits || {},
        actionCosts: Object.fromEntries(Object.entries(ACTIONS).map(([key, value]) => [key, value.credits]))
      });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const action = String(body.action || "");
    const rule = ACTIONS[action];
    if (!rule) return res.status(400).json({ error: "Nepoznata operacija." });

    const entitlement = await query(
      `SELECT e.id, e.credits_balance, e.status, e.starts_at, e.ends_at,
              p.code AS plan_code, p.features
       FROM mockup_entitlements e
       LEFT JOIN mockup_service_plans p ON p.id = e.plan_id
       WHERE e.user_id = $1 LIMIT 1`,
      [userId]
    );
    if (!entitlement.rowCount) return res.status(403).json({ error: "Nisu podešena prava pristupa." });
    const row = entitlement.rows[0];
    const now = Date.now();
    const active = row.status === "active" &&
      (!row.starts_at || new Date(row.starts_at).getTime() <= now) &&
      (!row.ends_at || new Date(row.ends_at).getTime() > now);
    if (!active) return res.status(403).json({ error: "Plan nije aktivan." });
    if (!hasFeature(row.features, rule.feature)) {
      return res.status(403).json({ error: "Ova funkcija nije uključena u tvoj plan.", requiredFeature: rule.feature, plan: row.plan_code || "free" });
    }

    const projectId = body.projectId == null || body.projectId === "" ? null : String(body.projectId);
    if (projectId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId)) {
      return res.status(400).json({ error: "ID projekta nije ispravan." });
    }

    const debit = await query(
      `WITH debited AS (
         UPDATE mockup_entitlements
         SET credits_balance = credits_balance - $1
         WHERE user_id = $2
           AND status = 'active'
           AND credits_balance >= $1
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (ends_at IS NULL OR ends_at > NOW())
         RETURNING user_id, credits_balance
       ),
       logged AS (
         INSERT INTO mockup_usage (id, user_id, project_id, action, units, credits_used, metadata)
         SELECT $3, user_id, $4, $4, 1, $1, jsonb_build_object('source', 'server_access_api')
         FROM debited
         RETURNING user_id
       )
       SELECT debited.credits_balance
       FROM debited JOIN logged USING (user_id)`,
      [rule.credits, userId, newId(), projectId, action]
    );
    if (!debit.rowCount) {
      return res.status(402).json({ error: "Nema dovoljno kredita ili je plan deaktiviran.", creditsRequired: rule.credits });
    }
    return res.status(200).json({ ok: true, action, creditsUsed: rule.credits, credits: debit.rows[0].credits_balance });
  } catch (error) {
    console.error("Mockup access API error:", error);
    return res.status(503).json({ error: "Provera prava pristupa trenutno nije dostupna." });
  }
}
