// api/index.js
export default async function handler(req, res) {
  // ★ ton URL Supabase
  const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
  // ★ ta clé ANON COMPLÈTE
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

  // ────────────────────────────────────────────────
  // 1) adapte l’URL (le proxy garde le path & query)
  const target = `${SUPABASE_URL}${req.url}`;

  // 2) prépare headers
  const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  // 3) corps éventuel
  let body;
  if (req.method !== "GET" && req.body) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  // 4) appel Supabase
  const supaRes = await fetch(target, {
    method: req.method,
    headers,
    body
  });

  const text = await supaRes.text();
  res.status(supaRes.status)
     .setHeader("Content-Type", supaRes.headers.get("content-type") || "application/json")
     .send(text);
}
