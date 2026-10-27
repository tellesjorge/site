import { useEffect } from 'react'

// Full navigation to the editorial library, including links from the legacy app.
export default function ArticlesPage() {
  useEffect(() => { window.location.replace('/artigos/') }, [])
  return <main className="mx-auto max-w-3xl px-6 py-20"><h1>Artigos</h1><p>Abrindo a seção de artigos de Jorge Telles.</p><a href="/artigos/">Abrir artigos →</a></main>
}
