import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SynthesisPage({
  params,
}: {
  params: { id: string }
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: synthesis } = await supabase
    .from('reflection_syntheses')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!synthesis) redirect('/synthesis/archive')

  const content = synthesis.content

  return (
    <main className="max-w-2xl mx-auto py-16 space-y-10">

      <section className="space-y-2">
        <div className="text-xs uppercase tracking-wide opacity-60">
          {new Date(synthesis.period_start).getFullYear()} Reflection Synthesis
        </div>

        <h1 className="text-2xl font-semibold leading-tight">
          {content.title}
        </h1>
      </section>

      <section className="space-y-8">

        <p className="text-sm leading-relaxed opacity-90">
          {content.summary}
        </p>

        {content.themes?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-70">
              Themes
            </h3>

            <ul className="space-y-1 text-sm opacity-90">
              {content.themes.map((theme: string, i: number) => (
                <li key={i}>• {theme}</li>
              ))}
            </ul>
          </div>
        )}

        {content.notable_lines?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-70">
              Notable lines
            </h3>

            <div className="space-y-3 text-sm italic opacity-90">
              {content.notable_lines.map((line: string, i: number) => (
                <p key={i}>"{line}"</p>
              ))}
            </div>
          </div>
        )}

      </section>
       
      <section className="pt-6 border-t space-y-3">

       <h3 className="text-sm font-medium opacity-80">
        Take the thinking further
       </h3>

      <form action="/reflection/evolve">
        <textarea
           name="input"
           placeholder="Evolve this idea..."
           className="w-full border rounded-lg p-3 text-sm"
          rows={4}
        />

       <button
         type="submit"
         className="mt-3 text-sm border px-4 py-2 rounded-lg hover:opacity-80"
       >
           Evolve this idea
        </button>
       </form>

     </section>

    </main>
  )
}