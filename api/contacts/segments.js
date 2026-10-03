const { requireUser } = require("../_auth");
const { sql } = require("../_db");
module.exports=async function segments(req,res){
 const user=await requireUser(req);if(!user)return res.status(401).json({error:"Niste prijavljeni."});
 if(req.method==="GET"){const r=await sql`select s.*,count(m.contact_id)::int as members from contact_segments s left join contact_segment_memberships m on m.segment_id=s.id where s.workspace_id=${user.workspace_id} group by s.id order by s.priority desc,s.name`;return res.json({segments:r.rows});}
 if(req.method==="POST"){const b=req.body||{};if(!b.name)return res.status(400).json({error:"Naziv segmenta je obavezan."});const r=await sql`insert into contact_segments(workspace_id,name,description,rules,priority) values(${user.workspace_id},${b.name},${b.description||null},${JSON.stringify(b.rules||{})}::jsonb,${b.priority||0}) returning *`;return res.status(201).json({segment:r.rows[0]});}
 return res.status(405).json({error:"Metod nije podržan."});
};