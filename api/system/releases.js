import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 return res.status(200).json({current:{version:"0.1.0",channel:"development",status:"active"},next:{version:"0.2.0",channel:"staging",status:"planned"}});
}