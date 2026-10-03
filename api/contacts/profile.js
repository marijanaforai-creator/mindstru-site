const { requireUser } = require("../_auth");
const { sql } = require("../_db");
function scoreForEvent(type){return ({form_submit:10,email_open:3,email_click:7,content_view:2,download:8,reply:12,purchase:40,unsubscribe:-30})[type]||0;}
module.exports=async function contactProfile(req,res){
 const user=await requireUser(req);if(!user)return res.status(401).json({error:"Niste prijavljeni."});
 if(req.method==="GET"){
  const email=req.query?.email;if(!email)return res.status(400).json({error:"email je obavezan."});
  const p=await sql`select * from contact_profiles where workspace_id=${user.workspace_id} and lower(email)=lower(${email}) limit 1`;
  if(!p.rows[0])return res.status(404).json({error:"Kontakt nije pronađen."});
  const i=await sql`select * from contact_interactions where contact_id=${p.rows[0].id} order by occurred_at desc limit 100`;
  return res.json({profile:p.rows[0],interactions:i.rows});
 }
 if(req.method==="POST"){
  const b=req.body||{};if(!b.email)return res.status(400).json({error:"email je obavezan."});
  let p=await sql`select id,lead_score from contact_profiles where workspace_id=${user.workspace_id} and lower(email)=lower(${b.email}) limit 1`;
  let id,score;
  if(p.rows[0]){id=p.rows[0].id;score=p.rows[0].lead_score;await sql`update contact_profiles set name=coalesce(${b.name||null},name),phone=coalesce(${b.phone||null},phone),company=coalesce(${b.company||null},company),source=coalesce(${b.source||null},source),attributes=coalesce(attributes,'{}'::jsonb)||${JSON.stringify(b.attributes||{})}::jsonb,last_seen_at=now(),updated_at=now() where id=${id}`;}
  else{const n=await sql`insert into contact_profiles(workspace_id,subscriber_id,email,name,phone,company,source,consent_status,attributes) values(${user.workspace_id},${b.subscriber_id||null},${b.email},${b.name||null},${b.phone||null},${b.company||null},${b.source||null},${b.consent_status||'unknown'},${JSON.stringify(b.attributes||{})}::jsonb) returning id,lead_score`;id=n.rows[0].id;score=n.rows[0].lead_score;}
  const event=b.event_type||"profile_update",delta=scoreForEvent(event);score=Math.max(0,score+delta);
  if(b.event_type){await sql`insert into contact_interactions(workspace_id,contact_id,event_type,source,value,metadata) values(${user.workspace_id},${id},${event},${b.source||null},${delta},${JSON.stringify(b.metadata||{})}::jsonb)`;}
  await sql`update contact_profiles set lead_score=${score},updated_at=now() where id=${id}`;
  return res.status(201).json({id,lead_score:score});
 }
 return res.status(405).json({error:"Metod nije podržan."});
};