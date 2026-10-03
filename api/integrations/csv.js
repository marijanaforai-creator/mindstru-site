const { requireUser } = require("../_auth");
const { sql } = require("../_db");
function parseCsv(text){
 const lines=String(text||"").split(/\r?\n/).filter(Boolean);if(!lines.length)return [];
 const headers=lines.shift().split(",").map(x=>x.trim().replace(/^"|"$/g,""));
 return lines.map(line=>{const cells=line.split(",").map(x=>x.trim().replace(/^"|"$/g,""));const row={};headers.forEach((h,i)=>row[h]=cells[i]||"");return row});
}
module.exports=async function csvImport(req,res){
 const user=await requireUser(req);if(!user)return res.status(401).json({error:"Niste prijavljeni."});
 if(req.method!=="POST")return res.status(405).json({error:"Metod nije podržan."});
 const {csv,mapping={}}=req.body||{};if(!csv)return res.status(400).json({error:"CSV sadržaj je obavezan."});
 const rows=parseCsv(csv);let created=0,updated=0,failed=0;
 for(const row of rows){const email=row[mapping.email||"email"]?.trim();if(!email){failed++;continue}const name=row[mapping.name||"name"]||null;const source=row[mapping.source||"source"]||"csv";
  const found=await sql`select id from audience_subscribers where workspace_id=${user.workspace_id} and lower(email)=lower(${email}) limit 1`;
  if(found.rows[0]){await sql`update audience_subscribers set name=coalesce(${name},name),source=${source},updated_at=now() where id=${found.rows[0].id}`;updated++}
  else{await sql`insert into audience_subscribers(workspace_id,email,name,source) values(${user.workspace_id},${email},${name},${source})`;created++}
 }
 return res.json({rows_seen:rows.length,created,updated,failed});
};