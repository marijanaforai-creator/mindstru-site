import { requireUser } from "../_lib/auth.js";
const tests=[
{id:"health",name:"System Health",endpoint:"/api/system/health"},
{id:"modules",name:"Module Registry",endpoint:"/api/system/modules"},
{id:"projects",name:"Projects API",endpoint:"/api/projects"},
{id:"drive",name:"Drive Structure",endpoint:"/api/drive/structure"}
];
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 return res.status(200).json({tests:tests.map(t=>({...t,status:"ready",result:"registered"}))});
}