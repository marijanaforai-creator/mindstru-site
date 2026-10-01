import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const COOKIE_NAME = "marijana_session";

function getSecret() {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    throw new Error("AUTH_SECRET mora imati najmanje 32 karaktera.");
  }
  return process.env.AUTH_SECRET;
}

export function setSessionCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, getSecret(), { expiresIn: "30d" });
  res.setHeader("Set-Cookie", [
    COOKIE_NAME + "=" + token + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000"
  ]);
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", [
    COOKIE_NAME + "=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  ]);
}

export function getSessionUserId(req) {
  const cookies = Object.fromEntries(
    String(req.headers.cookie || "").split(";").map(x => x.trim()).filter(Boolean).map(x => {
      const i = x.indexOf("=");
      return [x.slice(0, i), decodeURIComponent(x.slice(i + 1))];
    })
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getSecret());
    return typeof payload === "object" && payload.sub ? String(payload.sub) : null;
  } catch {
    return null;
  }
}

export function newId() {
  return crypto.randomUUID();
}

export function requireUser(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Niste prijavljeni." });
    return null;
  }
  return userId;
}
