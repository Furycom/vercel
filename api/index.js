// api/index.js  (copie/colle tout le fichier tel quel)

export const config = { runtime: 'edge' };           // ⬅️  force l’Edge Runtime

export default async function handler(req) {
  // --- 1.  Constantes Supabase
  const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

  // --- 2.  Recompose l’URL cible Supabase
  const target = SUPABASE_URL + req.url;   // ex.  /technicien_memoire?select=*

  // --- 3.  Prépare les options fetch
  const init = {
    method: req.method,
    headers: {
      apikey:        API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": req.headers.get("content-type") || "application/json"
    }
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    // Edge runtime : req.text() récupère directement le corps
    init.body = await req.text();
  }

  // --- 4.  Proxy vers Supabase
  const supaResp = await fetch(target, init);

  // --- 5.  Retourne la réponse telle quelle
  const data = await supaResp.arrayBuffer();
  return new Response(data, {
    status:  supaResp.status,
    headers: supaResp.headers
  });
}
