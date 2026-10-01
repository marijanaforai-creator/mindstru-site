import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

function bodyOf(req){ return typeof req.body==="string" ? JSON.parse(req.body) : (req.body||{}); }
function cleanEmails(value){
  if(!Array.isArray(value)) return [];
  return value.slice(0,300).map((e,i)=>({
    day:String(e?.day||`Dan ${i+1}`).slice(0,80),
    subject:String(e?.subject||"").slice(0,500),
    purpose:String(e?.purpose||"Vrednost").slice(0,80),
    body:String(e?.body||"").slice(0,20000),
    cta:String(e?.cta||"").slice(0,1000)
  }));
}
function payload(b){
  return {
    name:String(b.name||"Nova email sekvenca").trim().slice(0,255),
    type:String(b.type||"custom").slice(0,80),
    goal:String(b.goal||"").slice(0,5000),
    audience:String(b.audience||"").slice(0,5000),
    offer:String(b.offer||"").slice(0,5000),
    emails:cleanEmails(b.emails),
    status:String(b.status||"draft").slice(0,40),
    next_run_at:b.next_run_at?String(b.next_run_at):null
  };
}

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    if(req.method==="GET"){
      const r=await query("SELECT id,name,type,goal,audience,offer,emails,status,next_run_at,created_at,updated_at FROM email_sequences WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 200",[userId]);
      return res.status(200).json({sequences:r.rows});
    }
    if(req.method==="POST"){
      const b=payload(bodyOf(req)), id=newId();
      await query("INSERT INTO email_sequences(id,user_id,name,type,goal,audience,offer,emails,status,next_run_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10)",[id,userId,b.name,b.type,b.goal,b.audience,b.offer,JSON.stringify(b.emails),b.status,b.next_run_at]);
      return res.status(201).json({sequence:{id,user_id:userId,...b}});
    }
    if(req.method==="PUT"){
      const id=String(req.query?.id||""); if(!id)return res.status(400).json({error:"Nedostaje ID sekvence."});
      const b=payload(bodyOf(req));
      const r=await query("UPDATE email_sequences SET name=$1,type=$2,goal=$3,audience=$4,offer=$5,emails=$6::jsonb,status=$7,next_run_at=$8,updated_at=NOW() WHERE id=$9 AND user_id=$10 RETURNING id,name,type,goal,audience,offer,emails,status,next_run_at,created_at,updated_at",[b.name,b.type,b.goal,b.audience,b.offer,JSON.stringify(b.emails),b.status,b.next_run_at,id,userId]);
      if(!r.rowCount)return res.status(404).json({error:"Email sekvenca nije pronađena."});
      return res.status(200).json({sequence:r.rows[0]});
    }
    if(req.method==="DELETE"){
      const id=String(req.query?.id||""); if(!id)return res.status(400).json({error:"Nedostaje ID sekvence."});
      const r=await query("DELETE FROM email_sequences WHERE id=$1 AND user_id=$2 RETURNING id",[id,userId]);
      if(!r.rowCount)return res.status(404).json({error:"Email sekvenca nije pronađena."});
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:"Method not allowed"});
  }catch(e){console.error(e);return res.status(500).json({error:"Email sekvence trenutno nisu dostupne."})}
}
