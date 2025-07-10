// api/index.js
export default async function handler(req, res) {
  try {
    // URL et clé Supabase
    const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
    const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5c3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

    // Construire l'URL complète
    const url = `${SUPABASE_URL}${req.url}`;

    // Appeler Supabase en proxy
    const response = await fetch(url, {
      method: req.method,
      headers: {
        apikey: API_KEY,
        "Content-Type": "application/json"
      },
      // Pas de body pour GET/HEAD
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body)
    });

    // Lire la réponse brute
    const text = await response.text();

    // Renvoyer le même content-type
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
