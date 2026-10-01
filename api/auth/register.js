import bcrypt from "bcryptjs";
import { query, newId } from "../_lib/db.js";
import { setSessionCookie } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Unesi ispravan email." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Lozinka mora imati najmanje 8 karaktera." });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.rowCount) return res.status(409).json({ error: "Nalog sa ovim emailom već postoji." });

    const id = newId();
    const passwordHash = await bcrypt.hash(password, 12);

    await query(
      "INSERT INTO users (id, name, email, password_hash, plan, trial_started_at) VALUES ($1, $2, $3, $4, 'free_trial', NOW())",
      [id, name || "Marijana AI korisnik", email, passwordHash]
    );

    setSessionCookie(res, id);
    return res.status(201).json({
      user: { id, name: name || "Marijana AI korisnik", email, plan: "free_trial" }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registracija trenutno nije dostupna." });
  }
}
