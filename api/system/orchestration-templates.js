import { requireUser } from "../_lib/auth.js";
const templates=[
 {id:"system-check",name:"Puna provera sistema",steps:["health","dependencies","smoke"]},
 {id:"safe-deployment",name:"Bezbedan deployment",steps:["health","dependencies","migrations","approval","deploy"]},
 {id:"recovery",name:"Oporavak sistema",steps:["checkpoint","health","recovery","verification"]},
 {id:"module-activation",name:"Aktivacija modula",steps:["dependencies","configure","test","approval","activate"]}
];
export default async function handler(req,res){
 const userId=requireUser(req,res);if(!userId)return;
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 return res.status(200).json({templates});
}