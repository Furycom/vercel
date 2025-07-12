// api/index.js
export default async function handler(req, res) {
  // ---------- CONFIG ----------
  const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
  const API_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";
  // ----------------------------

  // URL correcte : /rest/v1/<table>…
  const url = SUPABASE_URL + req.url;           // <-- plus de new URL()

  // Relais du body (POST/PATCH)
  const body =
    req.method !== "GET" && req.body
      ? typeof req.body === "string" ? req.body : JSON.stringify(req.body)
      : undefined;

  const headers = {
    apikey:        API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  const response = await fetch(url, { method: req.method, headers, body });

  const text = await response.text();
  res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
  res.status(response.status).send(text);
}
