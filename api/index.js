export default async function handler(req, res) {
  const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
  const API_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

  // retire les slashs en trop au début
  const cleanedPath = req.url.replace(/^\/+/, "");
  const target      = `${SUPABASE_URL}/${cleanedPath}`;

  console.log("→", target);       // log de debug

  const response = await fetch(target, {
    method : req.method,
    headers: {
      "apikey"       : API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type" : "application/json"
    },
    body: req.method === "GET" ? undefined
         : typeof req.body === "string" ? req.body
         : JSON.stringify(req.body)
  });

  const text = await response.text();
  res.setHeader("Content-Type",
                response.headers.get("content-type") || "application/json");
  res.status(response.status).send(text);
}
