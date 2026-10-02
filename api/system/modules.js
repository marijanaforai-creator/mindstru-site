import { requireUser } from "../_lib/auth.js";

const modules=[
{id:"drive",name:"Marijana Drive",status:"ready",dependencies:[]},
{id:"creator",name:"Marijana Creator",status:"ready",dependencies:["drive"]},
{id:"ai",name:"Marijana AI Studio",status:"ready",dependencies:[]},
{id:"contacts",name:"Marijana Kontakti",status:"ready",dependencies:["drive"]},
{id:"automation",name:"Marijana Automatizacije",status:"ready",dependencies:["drive"]},
{id:"calendar",name:"Marijana Kalendar",status:"ready",dependencies:["drive"]},
{id:"audio",name:"Marijana Audio Studio",status:"planned",dependencies:["ai"]},
{id:"agents",name:"Marijana Agent OS",status:"planned",dependencies:["ai","automation"]},
{id:"billing",name:"Marijana Naplata",status:"planned",dependencies:["drive"]},
{id:"analytics",name:"Marijana Analitika",status:"planned",dependencies:["drive"]}
];

export default async function handler(req,res){
 if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
 const userId=requireUser(req,res); if(!userId)return;
 return res.status(200).json({modules});
}