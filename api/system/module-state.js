import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 return res.status(200).json({states:[
 {module_id:"drive",state:"active",version:"1.0.0"},
 {module_id:"creator",state:"active",version:"1.0.0"},
 {module_id:"ai",state:"active",version:"1.0.0"},
 {module_id:"contacts",state:"active",version:"1.0.0"},
 {module_id:"automation",state:"active",version:"1.0.0"},
 {module_id:"calendar",state:"active",version:"1.0.0"},
 {module_id:"audio",state:"planned",version:"0.1.0"},
 {module_id:"agents",state:"planned",version:"0.1.0"},
 {module_id:"billing",state:"planned",version:"0.1.0"},
 {module_id:"analytics",state:"planned",version:"0.1.0"}
 ]});
}