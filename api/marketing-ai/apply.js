import { query, newId } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

function bodyOf(req){ return typeof req.body==="string" ? JSON.parse(req.body) : (req.body||{}); }
function clean(v,max=20000){ return String(v||"").trim().slice(0,max); }

export default async function handler(req,res){
  try{
    const userId=requireUser(req,res); if(!userId)return;
    if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
    const b=bodyOf(req);
    const mode=clean(b.mode,80);
    const result=clean(b.result);
    const target=clean(b.target,80);
    if(!result) return res.status(400).json({error:"Nedostaje AI rezultat."});

    if(target==="funnel"){
      const funnelId=clean(b.funnelId,120);
      if(!funnelId) return res.status(400).json({error:"Izaberi prodajni levak pre primene."});
      const r=await query("SELECT id,name,status,data FROM funnels WHERE id=$1 AND user_id=$2",[funnelId,userId]);
      if(!r.rowCount) return res.status(404).json({error:"Prodajni levak nije pronađen."});
      const funnel=r.rows[0], data=funnel.data&&typeof funnel.data==="object"?funnel.data:{};
      const blocks=Array.isArray(data.marketingAIBlocks)?data.marketingAIBlocks:[];
      blocks.push({id:newId(),type:mode.toLowerCase(),title:mode+" — Marijana Marketing AI",content:result,created_at:new Date().toISOString(),status:"draft"});
      data.marketingAIBlocks=blocks;
      await query("UPDATE funnels SET data=$1::jsonb,updated_at=NOW() WHERE id=$2 AND user_id=$3",[JSON.stringify(data),funnelId,userId]);
      return res.status(200).json({ok:true,target:"funnel",funnelId,block:blocks[blocks.length-1],message:"Predlog je dodat u levak kao nacrt. Pregledaj ga pre objave."});
    }

    if(target==="email"){
      const name=clean(b.name,255)||("AI "+mode+" sekvenca");
      const email={
        day:"Dan 0",
        subject:clean(b.subject,500)||mode+" — priprema",
        purpose:"AI predlog",
        body:result,
        cta:clean(b.cta,1000)
      };
      const id=newId();
      await query("INSERT INTO email_sequences(id,user_id,name,type,goal,audience,offer,emails,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,'draft')",
        [id,userId,name,"marketing_ai",clean(b.goal,5000),clean(b.audience,5000),clean(b.offer,5000),JSON.stringify([email])]);
      return res.status(201).json({ok:true,target:"email",sequence:{id,name,status:"draft"},message:"Email sekvenca je kreirana kao nacrt. Pregledaj sadržaj pre slanja."});
    }

    if(target==="automation"){
      const name=clean(b.name,255)||("AI "+mode+" automatizacija");
      const config={
        source:"Marijana Marketing AI",
        action:"Pregledaj AI predlog i nastavi prema preporuci",
        ai_mode:mode,
        ai_result:result,
        review_required:true
      };
      const id=newId();
      await query("INSERT INTO automations(id,user_id,name,status,trigger_type,config) VALUES($1,$2,$3,'draft','manual',$4::jsonb)",
        [id,userId,name,JSON.stringify(config)]);
      return res.status(201).json({ok:true,target:"automation",automation:{id,name,status:"draft"},message:"Automatizacija je kreirana kao nacrt. Poveži KADA → USLOV → URADI → ZATIM pre aktiviranja."});
    }

    const id=newId();
    await query("INSERT INTO projects(id,user_id,name,type,status,data) VALUES($1,$2,$3,$4,$5,$6::jsonb)",
      [id,userId,"Marijana Marketing AI — "+mode,"marketing_ai_result","draft",JSON.stringify({mode,result,source:"Marijana Marketing AI",created_at:new Date().toISOString()})]);
    return res.status(201).json({ok:true,target:"project",project:{id,name:"Marijana Marketing AI — "+mode,status:"draft"},message:"Rezultat je sačuvan kao nacrt projekta."});
  }catch(e){ console.error(e); return res.status(500).json({error:"Primena Marketing AI rezultata nije uspela."}); }
}
