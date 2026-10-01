import { query, newId } from "../_lib/db.js";

function getCookie(req,name){
  const cookies=String(req.headers.cookie||"").split(";").map(x=>x.trim());
  const item=cookies.find(x=>x.startsWith(name+"="));
  return item ? decodeURIComponent(item.slice(name.length+1)) : null;
}

export default async function handler(req,res){
  try{
    const code=String(req.query?.code||"");
    const state=String(req.query?.state||"");
    const expected=getCookie(req,"pinterest_oauth_state");
    const userId=String(req.query?.user_id||"");
    if(!code||!state||state!==expected||!userId)return res.status(400).send("Nevažeće Pinterest povezivanje.");
    const clientId=process.env.PINTEREST_CLIENT_ID;
    const clientSecret=process.env.PINTEREST_CLIENT_SECRET;
    const redirectUri=process.env.PINTEREST_REDIRECT_URI;
    if(!clientId||!clientSecret||!redirectUri)return res.status(503).send("Pinterest nije konfigurisan.");
    const body=new URLSearchParams({grant_type:"authorization_code",code,redirect_uri:redirectUri});
    const r=await fetch("https://api.pinterest.com/v5/oauth/token",{
      method:"POST",
      headers:{
        Authorization:"Basic "+Buffer.from(clientId+":"+clientSecret).toString("base64"),
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok)return res.status(r.status).json(data);
    await query(
      "INSERT INTO connections(id,user_id,provider,encrypted_data) VALUES($1,$2,$3,$4)",
      [newId(),userId,"pinterest",JSON.stringify({
        access_token:data.access_token,
        refresh_token:data.refresh_token,
        expires_in:data.expires_in,
        token_type:data.token_type
      })]
    );
    return res.redirect("/marijana-ai-studio/index.html#connections");
  }catch(e){
    console.error(e);
    return res.status(500).send("Pinterest povezivanje nije uspelo.");
  }
}