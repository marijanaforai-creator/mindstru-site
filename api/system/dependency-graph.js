import { requireUser } from "../_lib/auth.js";
export default async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res);if(!userId)return;
 return res.status(200).json({nodes:[
 {id:"drive",label:"Marijana Drive",layer:"core"},
 {id:"creator",label:"Marijana Creator",layer:"experience"},
 {id:"ai",label:"Marijana AI Studio",layer:"ai"},
 {id:"contacts",label:"Marijana Kontakti",layer:"business"},
 {id:"automation",label:"Marijana Automatizacije",layer:"automation"},
 {id:"calendar",label:"Marijana Kalendar",layer:"business"},
 {id:"audio",label:"Marijana Audio Studio",layer:"creator"},
 {id:"agents",label:"Marijana Agent OS",layer:"ai"},
 {id:"billing",label:"Marijana Naplata",layer:"commerce"},
 {id:"analytics",label:"Marijana Analitika",layer:"intelligence"}
 ],edges:[
 ["creator","drive"],["contacts","drive"],["automation","drive"],["calendar","drive"],["audio","ai"],["agents","ai"],["agents","automation"],["billing","drive"],["analytics","drive"]
 ]});
}