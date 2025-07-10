export default async function handler(req, res) {
  const SUPABASE_URL = "https://szmnlccygttwbjhphzln.supabase.co/rest/v1";
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

  let body = undefined;
  if (req.method !== "GET" && req.body) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const response = await fetch(
    SUPABASE_URL + req.url,
    {
      method: req.method,
      headers: {
        "apikey": API_KEY,
        "Content-Type": "application/json"
      },
      body
    }
  );
  const data = await response.json();
  res.status(response.status).json(data);
}
