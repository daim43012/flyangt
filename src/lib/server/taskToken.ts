import crypto from "node:crypto";

const b64 = (s: string) =>
  Buffer.from(s)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const unb64 = (s: string) => {
  const x = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = x.length % 4 ? "=".repeat(4 - (x.length % 4)) : "";
  return Buffer.from(x + pad, "base64").toString("utf8");
};

export function signTaskToken(payload: any, secret: string) {
  const body = b64(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyTaskToken(token: string, secret: string) {
  const [body, sig] = token.split(".");
  if (!body || !sig) throw new Error("bad token format");
  const expSig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (sig !== expSig) throw new Error("bad token signature");
  return JSON.parse(unb64(body));
}
