import { requireUser } from "../_lib/auth.js";
const migrations=[
 {id:"001",name:"Core schema",status:"applied"},
 {id:"002",name:"Projects",status:"applied"},
 {id:"003",name:"Drive folders",status:"pending"},
 {id:"004",name:"AI context",status:"planned"},
 {id:"005",name:"System control plane",status:"pending"},
 {id:"006",name:"Execution runtime",status:"pending"},
 {id:"007",name:"Worker, queue i scheduler",status:"pending"},
 {id:"008",name:"Orchestration layer",status:"pending"},
 {id:"009",name:"Checkpoint, approval i compensation",status:"pending"}
];
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 return res.status(200).json({migrations,pending:migrations.filter(x=>x.status!=="applied").length});
}