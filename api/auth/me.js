import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const result = await query(
      "SELECT id, name, email, plan, trial_started_at, created_at FROM users WHERE id = $1 LIMIT 1",
      [userId]
    );
    if (!result.rowCount) return res.status(401).json({ error: "Sesija više nije važeća." });

    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nije moguće učitati nalog." });
  }
}
