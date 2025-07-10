// api/hello.js
export default async function handler(req, res) {
console.log("⇨ New request:", req.method, req.url);
const SUPABASE\_URL = "[https://szmnlccygttwbjhphzln.supabase.co/rest/v1](https://szmnlccygttwbjhphzln.supabase.co/rest/v1)";
const API\_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5c3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0.\_odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods";

// Préparer le corps pour POST/PATCH
let body;
if (req.method !== "GET" && req.body) {
body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
console.log("⇨ Body:", body);
}

// Reconstruire l'URL pour gérer id=eq.<val> sur PATCH/DELETE
const urlObj = new URL(req.url, SUPABASE\_URL);
if ((req.method === "PATCH" || req.method === "DELETE") && urlObj.searchParams.has("id")) {
const idVal = urlObj.searchParams.get("id");
urlObj.searchParams.set("id", `eq.${idVal}`);
console.log("⇨ Modified ID filter to:", urlObj.searchParams.toString());
}

console.log("⇨ Fetching URL:", urlObj.toString());

try {
// Appel à Supabase
const response = await fetch(urlObj.toString(), {
method: req.method,
headers: {
"apikey": API\_KEY,
"Content-Type": "application/json"
},
body
});

```
// Lire la réponse brute pour debug
const text = await response.text();
console.log("⇨ Supabase response status:", response.status, "body:", text);

// Journaliser en cas d'erreur
if (!response.ok) {
  console.error("Supabase error:", text);
  return res.status(response.status).send(text);
}

// Renvoyer JSON ou texte
if (text) {
  const data = JSON.parse(text);
  return res.status(response.status).json(data);
}
return res.status(response.status).end();
```

} catch (error) {
console.error("⇨ Handler error:", error);
return res.status(500).json({ error: error.message });
}
}
