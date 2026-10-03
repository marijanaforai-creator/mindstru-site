import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{
  const userId=requireUser(req,res);if(!userId)return;
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
  const start=b.start?new Date(b.start):null,end=b.end?new Date(b.end):null,now=new Date();
  if(!start||!end||Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<=start)return res.status(400).json({error:"Neispravan vremenski prozor."});
  return res.status(200).json({user_id:userId,dostupno:now>=start&&now<=end,start:start.toISOString(),end:end.toISOString()});
 }catch(e){return res.status(500).json({error:"Vremenski prozor nije moguće proveriti."});}
}