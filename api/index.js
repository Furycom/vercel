// api/index.js  — proxy Vercel ⇄ Supabase
export default async function handler(req, res) {
  const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
  const API_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

  // 1️⃣ reconstruit l’URL complète Supabase
  const urlObj = new URL(req.url, SUPABASE_URL);

  // 2️⃣ si on vise /technicien_memoire et que technicien_id est brut, ajoute le préfixe eq.
  if (urlObj.pathname === "/technicien_memoire" && urlObj.searchParams.has("technicien_id")) {
    const raw = urlObj.searchParams.get("technicien_id");
    if (!raw.startsWith("eq.")) {
      urlObj.searchParams.set("technicien_id", `eq.${raw}`);
    }
  }

  // 3️⃣ forward de la requête
  const supaResp = await fetch(urlObj.toString(), {
    method : req.method,
    headers: {
      apikey       : API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: req.method === "GET" ? undefined : JSON.stringify(req.body ?? {})
  });

  const txt = await supaResp.text();
  res.setHeader("Content-Type", supaResp.headers.get("content-type") ?? "application/json");
  return res.status(supaResp.status).send(txt);
}
