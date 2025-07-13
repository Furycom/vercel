import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://verceltest999.vercel.app',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods'
)

export default async function handler(req, res) {
  try {
    console.log('Méthode reçue :', req.method)

    if (req.method === 'GET') {
      console.log('Requête GET reçue avec query :', req.query)

      const technicien_id2 = req.query.technicien_id
      console.log('technicien_id brut =', technicien_id2)

      const id = technicien_id2?.replace('eq.', '')
      console.log('technicien_id nettoyé =', id)

      if (!id) {
        console.log('technicien_id manquant ou malformé')
        return res.status(400).json({ error: 'technicien_id manquant ou malformé' })
      }

      const { data, error } = await supabase
        .from('technicien_memoire')
        .select('*')
        .eq('technicien_id', id)

      if (error) {
        console.error('Erreur Supabase (GET) :', error)
        return res.status(500).json({ error: error.message })
      }

      console.log('Données reçues :', data)
      return res.status(200).json({ data })
    }

    if (req.method === 'POST') {
      console.log('Requête POST reçue avec body :', req.body)

      const { technicien_id, contenu } = req.body
      console.log('POST - technicien_id =', technicien_id)
      console.log('POST - contenu =', contenu)

      const { data, error } = await supabase
        .from('technicien_memoire')
        .insert([{ technicien_id, contenu }])
        .select()

      if (error) {
        console.error('Erreur Supabase (POST) :', error)
        return res.status(500).json({ error: error.message })
      }

      console.log('Données insérées :', data)
      return res.status(201).json(data)
    }

    console.log('Méthode non autorisée :', req.method)
    return res.status(405).json({ error: 'Méthode non autorisée' })

  } catch (err) {
    console.error('Erreur serveur générale :', err)
    return res.status(500).json({ error: String(err) })
  }
}
