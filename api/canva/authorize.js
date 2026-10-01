import crypto from "node:crypto";

function base64url(buffer){return Buffer.from(buffer).toString("base64").replace(/=/g,"").replace(/\\+/g,"-").replace(/\\//g,"_");}
function cookie(name,value,maxAge=600){return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;}

export default function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"method_not_allowed"});
  const clientId=process.env.CANVA_CLIENT_ID;
  const redirectUri=process.env.CANVA_REDIRECT_URI;
  if(!clientId||!redirectUri) return res.status(503).json({error:"canva_not_configured"});
  const verifier=base64url(crypto.randomBytes(48));
  const challenge=base64url(crypto.createHash("sha256").update(verifier).digest());
  const state=base64url(crypto.randomBytes(32));
  const url=new URL("https://www.canva.com/api/oauth/authorize");
  url.searchParams.set("code_challenge",challenge);
  url.searchParams.set("code_challenge_method","S256");
  url.searchParams.set("scope",process.env.CANVA_SCOPES||"design:content:read design:content:write asset:read asset:write");
  url.searchParams.set("response_type","code");
  url.searchParams.set("client_id",clientId);
  url.searchParams.set("state",state);
  url.searchParams.set("redirect_uri",redirectUri);
  res.setHeader("Set-Cookie",[
    cookie("marijana_canva_state",state),
    cookie("marijana_canva_verifier",verifier)
  ]);
  res.redirect(302,url.toString());
}
