const { requireUser } = require("../_auth");
const { sql } = require("../_db");

module.exports = async function googleForms(req, res) {
  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: "Niste prijavljeni." });

  if (req.method === "GET") {
    const { rows } = await sql`select id,name,status,external_url,external_id,config,last_sync_at,created_at from integration_connections where workspace_id=${user.workspace_id} and provider='google_forms' order by created_at desc`;
    return res.json({ connections: rows });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    if (!body.name || !body.form_url) return res.status(400).json({ error: "Naziv i URL Google Forme su obavezni." });
    const { rows } = await sql`insert into integration_connections (workspace_id,provider,name,status,external_url,external_id,config) values (${user.workspace_id},'google_forms',${body.name},'configured',${body.form_url},${body.form_id || null},${JSON.stringify({sheet_url:body.sheet_url||null,webhook_url:body.webhook_url||null,webhook_secret:body.webhook_secret||null})}::jsonb) returning *`;
    return res.status(201).json({ connection: rows[0] });
  }

  return res.status(405).json({ error: "Metod nije podržan." });
};