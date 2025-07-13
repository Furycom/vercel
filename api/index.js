import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://verceltest999.vercel.app',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods'
);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      console.log("Requête reçue (GET) avec query :", req.query);

      const { technicien_id } = req.query;
      const id = technicien_id?.replace('eq.', '');

      if (!id) {
        return res.status(400).json({ error: "technicien_id manquant ou malformé" });
      }

      const { data, error } = await supabase
        .from('technicien_memoire')
        .select('*')
        .eq('technicien_id', id);

      if (error) return res.status(500).json({ error });
      return res.status(200).json({ data });
    }

    if (req.method === 'POST') {
      const { technicien_id, contenu } = req.body;

      const { data, error } = await supabase
        .from('technicien_memoire')
        .insert([{ technicien_id, contenu }]);

      if (error) return res.status(500).json({ error });
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (err) {
    console.error("Erreur serveur :", err);
    return res.status(500).json({ error: String(err) });
  }
}
