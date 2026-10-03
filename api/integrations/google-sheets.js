const { requireUser } = require("../_auth");
const { sql } = require("../_db");

function normalizeRow(row, mapping = {}) {
  const out = { attributes: {} };
  for (const [source, value] of Object.entries(row || {})) {
    const target = mapping[source] || source;
    if (["email","name","phone","source","status","tags"].includes(target)) out[target] = value;
    else out.attributes[target] = value;
  }
  return out;
}

module.exports = async function googleSheets(req, res) {
  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: "Niste prijavljeni." });

  if (req.method === "POST") {
    const { connection_id, rows = [], mapping = {}, direction = "inbound" } = req.body || {};
    if (!connection_id) return res.status(400).json({ error: "connection_id je obavezan." });

    const normalized = rows.map(r => normalizeRow(r, mapping)).filter(r => r.email);
    let created = 0, updated = 0, failed = 0;
    const errors = [];

    for (const contact of normalized) {
      try {
        const existing = await sql`select id from audience_subscribers where workspace_id=${user.workspace_id} and lower(email)=lower(${contact.email}) limit 1`;
        if (existing.rows[0]) {
          await sql`update audience_subscribers set name=coalesce(${contact.name || null},name), source=coalesce(${contact.source || null},source), status=coalesce(${contact.status || null},status), attributes=coalesce(attributes,'{}'::jsonb) || ${JSON.stringify(contact.attributes)}::jsonb, updated_at=now() where id=${existing.rows[0].id}`;
          updated++;
        } else {
          await sql`insert into audience_subscribers (workspace_id,email,name,source,status,tags,attributes) values (${user.workspace_id},${contact.email},${contact.name || null},${contact.source || 'google_forms'},${contact.status || 'subscribed'},${JSON.stringify(contact.tags || [])}::jsonb,${JSON.stringify(contact.attributes)}::jsonb)`;
          created++;
        }
      } catch (e) { failed++; errors.push({ email: contact.email, error: String(e.message || e) }); }
    }

    await sql`insert into integration_sync_runs (connection_id,direction,status,rows_seen,rows_created,rows_updated,rows_failed,error_log,finished_at) values (${connection_id},${direction},'completed',${rows.length},${created},${updated},${failed},${JSON.stringify(errors)}::jsonb,now())`;
    return res.json({ rows_seen: rows.length, created, updated, failed, errors });
  }

  if (req.method === "GET") {
    const { connection_id } = req.query || {};
    const { rows } = await sql`select * from integration_sync_runs where connection_id=${connection_id} order by started_at desc limit 20`;
    return res.json({ runs: rows });
  }

  return res.status(405).json({ error: "Metod nije podržan." });
};