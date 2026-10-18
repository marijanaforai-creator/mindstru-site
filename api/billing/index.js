import { query } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    if (req.method === "GET") {
      const result = await query(
        `SELECT
           COALESCE(p.product_code, p.plan_code, 'Kupovina') AS product_name,
           ROUND(p.amount * 100)::INTEGER AS amount_cents,
           p.currency,
           p.provider,
           p.status,
           p.created_at
         FROM billing_payments p
         JOIN billing_customers c ON c.id = p.customer_id
         WHERE c.user_id = $1
         ORDER BY p.created_at DESC
         LIMIT 200`,
        [userId]
      );
      return res.status(200).json({ purchases: result.rows });
    }

    if (req.method === "POST") {
      return res.status(501).json({
        error: "Kupovina nije dostupna: checkout i potvrda payment providera još nisu povezani."
      });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Metod nije dozvoljen." });
  } catch (error) {
    console.error("Billing API error:", error);
    return res.status(503).json({
      error: "Billing trenutno nije dostupan. Proveri podešavanja baze i primenjene migracije."
    });
  }
}
