import bcrypt from "bcryptjs";
import { query } from "../_lib/db.js";
import { setSessionCookie } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    const result = await query(
      "SELECT id, name, email, password_hash, plan FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Email ili lozinka nisu ispravni." });
    }

    setSessionCookie(res, user.id);
    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Prijava trenutno nije dostupna." });
  }
}
