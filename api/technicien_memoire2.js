import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

export default async function handler(req) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const technicien_id = url.searchParams.get("technicien_id")?.replace("eq.", "");

      if (!technicien_id) {
        return new Response(
          JSON.stringify({ error: "technicien_id manquant ou malformé" }),
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("technicien_memoire")
        .select("*")
        .eq("technicien_id", technicien_id);

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === "POST") {
      const { technicien_id, contenu } = await req.json();

      const { data, error } = await supabase
        .from("technicien_memoire")
        .insert([{ technicien_id, contenu }]);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
      status: 405,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
