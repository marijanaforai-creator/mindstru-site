const { requireUser } = require("../_auth");
const { sql } = require("../_db");
module.exports=async function mapping(req,res){
 const user=await requireUser(req);if(!user)return res.status(401).json({error:"Niste prijavljeni."});
 if(req.method!=="POST")return res.status(405).json({error:"Metod nije podržan."});
 const {connection_id,mappings}=req.body||{};if(!connection_id||!Array.isArray(mappings))return res.status(400).json({error:"connection_id i mappings su obavezni."});
 const check=await sql`select id from integration_connections where id=${connection_id} and workspace_id=${user.workspace_id} limit 1`;if(!check.rows[0])return res.status(404).json({error:"Konekcija nije pronađena."});
 await sql`delete from integration_field_mappings where connection_id=${connection_id}`;
 for(const m of mappings){if(!m.external_field||!m.internal_field)continue;await sql`insert into integration_field_mappings(connection_id,external_field,internal_field,transform,required) values(${connection_id},${m.external_field},${m.internal_field},${m.transform||null},${!!m.required})`;}
 return res.json({ok:true,count:mappings.length});
};