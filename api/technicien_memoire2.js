import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://verceltest999.vercel.app',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bW5sY2N5Z3R0d2JqaHBoemxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTQzMzEsImV4cCI6MjA2NzY5MDMzMX0._odasb3ZUcfJv2n92LoATAYiYiAziOKW0D3jFdHNods'
)

export default async function handler(req) {
  try {
    const { method } = req

    if (method === 'GET') {
      const url = new URL(req.url)
      const technicien_id = url.searchParams.get('technicien_id')?.replace('eq.', '')

      if (!technicien_id) {
        return new Response(
          JSON.stringify({ error: 'technicien_id manquant ou malformé' }),
          { status: 400 }
        )
      }

      const { data, error } = await supabase
        .from('technicien_memoire')
        .select('*')
        .eq('technicien_id', technicien_id)

      if (error) throw error

      return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    }

    if (method === 'POST') {
      const { technicien_id, contenu } = await req.json()

      const { data, error } = await supabase
        .from('technicien_memoire')
        .insert([{ technicien_id, contenu }])

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        status: 201
      })
    }

    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500
    })
  }
}
