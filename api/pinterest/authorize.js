import crypto from "node:crypto";
import { requireUser } from "../_lib/auth.js";
export default function handler(req,res){
  const userId=requireUser(req,res); if(!userId)return;
  const clientId=process.env.PINTEREST_CLIENT_ID, redirect=process.env.PINTEREST_REDIRECT_URI;
  if(!clientId||!redirect)return res.status(503).json({error:"Pinterest nije konfigurisan."});
  const state=crypto.randomBytes(24).toString("hex");
  const scope=process.env.PINTEREST_SCOPES||"boards:read,boards:write,pins:read,pins:write,user_accounts:read";
  const url="https://www.pinterest.com/oauth/?"+new URLSearchParams({client_id:clientId,redirect_uri:redirect,response_type:"code",scope,state}).toString();
  res.setHeader("Set-Cookie","pinterest_oauth_state="+state+"; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600");
  return res.redirect(url);
}