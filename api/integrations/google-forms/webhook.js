const crypto = require("crypto");
const { sql } = require("../../_db");
function safeEqual(a,b){if(!a||!b)return false;const aa=Buffer.from(String(a));const bb=Buffer.from(String(b));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb);}
module.exports=async function googleFormsWebhook(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Metod nije podržan."});
 const body=req.body||{};const connectionId=body.connection_id;if(!connectionId)return res.status(400).json({error:"connection_id je obavezan."});
 const found=await sql`select id,workspace_id,config from integration_connections where id=${connectionId} and provider='google_forms' limit 1`;const c=found.rows[0];
 if(!c)return res.status(404).json({error:"Konekcija nije pronađena."});
 const supplied=req.headers["x-marijana-webhook-secret"]||body.webhook_secret;
 if(!safeEqual(c.config?.webhook_secret,supplied))return res.status(401).json({error:"Nevažeći webhook secret."});
 const rows=Array.isArray(body.rows)?body.rows:[],mapping=c.config?.mapping||{};let created=0,updated=0,failed=0;const errors=[];
 for(const row of rows){const m={attributes:{}};for(const [source,value] of Object.entries(row||{})){const target=mapping[source]||source;if(["email","name","phone","source","status","tags"].includes(target))m[target]=value;else m.attributes[target]=value;}
  if(!m.email){failed++;errors.push({error:"Nedostaje email."});continue;}
  try{const existing=await sql`select id from audience_subscribers where workspace_id=${c.workspace_id} and lower(email)=lower(${m.email}) limit 1`;
   if(existing.rows[0]){await sql`update audience_subscribers set name=coalesce(${m.name||null},name),source=coalesce(${m.source||'google_forms'},source),status=coalesce(${m.status||null},status),attributes=coalesce(attributes,'{}'::jsonb)||${JSON.stringify(m.attributes)}::jsonb,updated_at=now() where id=${existing.rows[0].id}`;updated++}
   else{await sql`insert into audience_subscribers(workspace_id,email,name,source,status,tags,attributes) values(${c.workspace_id},${m.email},${m.name||null},${m.source||'google_forms'},${m.status||'subscribed'},${JSON.stringify(m.tags||[])}::jsonb,${JSON.stringify(m.attributes)}::jsonb)`;created++}
  }catch(e){failed++;errors.push({email:m.email,error:String(e.message||e)})}
 }
 await sql`update integration_connections set last_sync_at=now(),updated_at=now() where id=${connectionId}`;
 await sql`insert into integration_sync_runs(connection_id,direction,status,rows_seen,rows_created,rows_updated,rows_failed,error_log,finished_at) values(${connectionId},'inbound','completed',${rows.length},${created},${updated},${failed},${JSON.stringify(errors)}::jsonb,now())`;
 return res.json({ok:true,rows_seen:rows.length,created,updated,failed});
};