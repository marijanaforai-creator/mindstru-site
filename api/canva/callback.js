function parseCookies(header=""){return Object.fromEntries(header.split(";").map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf("=");return [x.slice(0,i),decodeURIComponent(x.slice(i+1))]}));}
function clearCookie(name){return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;}

export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"method_not_allowed"});
  const {code,state,error}=req.query;
  const cookies=parseCookies(req.headers.cookie);
  if(error) return res.redirect(302,"/?connection=canva&status=denied");
  if(!code||!state||state!==cookies.marijana_canva_state) return res.status(400).json({error:"invalid_oauth_state"});
  const clientId=process.env.CANVA_CLIENT_ID;
  const clientSecret=process.env.CANVA_CLIENT_SECRET;
  const redirectUri=process.env.CANVA_REDIRECT_URI;
  if(!clientId||!clientSecret||!redirectUri) return res.status(503).json({error:"canva_not_configured"});
  const verifier=cookies.marijana_canva_verifier;
  if(!verifier) return res.status(400).json({error:"missing_pkce_verifier"});
  const credentials=Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body=new URLSearchParams({grant_type:"authorization_code",code,code_verifier:verifier,redirect_uri:redirectUri});
  const tokenResponse=await fetch("https://api.canva.com/rest/v1/oauth/token",{method:"POST",headers:{Authorization:`Basic ${credentials}`,"Content-Type":"application/x-www-form-urlencoded"},body});
  const data=await tokenResponse.json();
  if(!tokenResponse.ok) return res.status(502).json({error:"canva_token_exchange_failed",details:data});
  // IMPORTANT: persist data.refresh_token and data.access_token in a real server-side database here.
  // Do not put provider tokens in localStorage or expose them to the browser.
  res.setHeader("Set-Cookie",[clearCookie("marijana_canva_state"),clearCookie("marijana_canva_verifier")]);
  res.redirect(302,"/?connection=canva&status=connected");
}
