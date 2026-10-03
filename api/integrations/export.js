const { requireUser } = require("../_auth");
const { sql } = require("../_db");
module.exports=async function exportIntegration(req,res){
 const user=await requireUser(req);if(!user)return res.status(401).json({error:"Niste prijavljeni."});
 if(req.method!=="GET")return res.status(405).json({error:"Metod nije podržan."});
 const {rows}=await sql`select email,name,source,status,tags,attributes,created_at,updated_at from audience_subscribers where workspace_id=${user.workspace_id} order by created_at desc`;
 const data=rows.map(r=>({...r,...(r.attributes||{}),attributes:undefined}));
 return res.json({exported_at:new Date().toISOString(),count:data.length,rows:data});
};