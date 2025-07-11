// api/index.js

export default async function handler(req, res) {
  try {
    // URL Supabase
    const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
    // Ta clé publique ANON (inline)
    const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

    // Construire l'URL complète vers Supabase (prend le path et la query depuis req.url)
    const url = `${SUPABASE_URL}${req.url}`;

    // Préparer les headers avec apikey + Authorization
    const headers = {
      "apikey":        API_KEY,
      "Authorization": "Bearer " + API_KEY,
      "Content-Type":  "application/json"
    };

    // Préparer le corps pour POST/PATCH
    let body;
    if (req.method !== "GET" && req.body) {
      body = typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);
    }

    // Adapter le paramètre id pour Supabase (id=eq.<val>)
    const urlObj = new URL(req.url, SUPABASE_URL);
    if ((req.method === "PATCH" || req.method === "DELETE") && urlObj.searchParams.has("id")) {
      const idVal = urlObj.searchParams.get("id");
      urlObj.searchParams.set("id", `eq.${idVal}`);
    }

    // Appel vers Supabase
    const response = await fetch(urlObj.toString(), {
      method: req.method,
      headers,
      body
    });

    // Récupérer la réponse brute
    const text = await response.text();

    // Propager le content-type d’origine
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );
    return res.status(response.status).send(text);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
