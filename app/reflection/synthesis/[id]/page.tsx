import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { evolveIdea } from '@/app/reflection/evolve/actions'

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

    const { data: evolutions } = await supabase
  .from('reflection_evolutions')
  .select('*')
  .eq('synthesis_id', params.id)
  .order('created_at', { ascending: true })

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
          {/* evolution chain */}
     {evolutions && evolutions.length > 0 && (
  <section className="pt-10 border-t space-y-6">

    <h3 className="text-sm font-medium opacity-80">
      Thinking evolution
    </h3>

    <div className="space-y-6">

      {evolutions.map((evolution, i) => {

        const output = evolution.ai_output || {}

        return (
          <div
            key={evolution.id}
            className="border rounded-xl p-5 space-y-4"
          >

            <div className="text-xs opacity-60">
              Cycle {i + 1}
            </div>

            <div className="space-y-2">

              <p className="text-xs opacity-60">
                Your thought
              </p>

              <p className="text-sm">
                {evolution.input_text}
              </p>

            </div>

            {output.evolved_insight && (
              <div className="space-y-2">

                <p className="text-xs opacity-60">
                  Evolved insight
                </p>

                <p className="text-sm leading-relaxed">
                  {output.evolved_insight}
                </p>

              </div>
            )}

                {output.new_questions?.length > 0 && (
                  <div className="space-y-2">

                    <p className="text-xs opacity-60">
                      New questions
                    </p>

                     <ul className="text-sm space-y-1">
                      {output.new_questions.map(
                        (q: string, i: number) => (
                          <li key={i}>• {q}</li>
                         )
                      )}
                    </ul>

                  </div>
                )}

             </div>
            )
          })}

        </div>

       </section>
         )}

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
          
          {/* explore the idea */}
<section className="pt-10 border-t space-y-6">

  <h3 className="text-sm font-medium opacity-80">
    Explore this idea further
  </h3>

  <p className="text-xs opacity-60">
    Good thinking grows when ideas are expanded, questioned, or applied.
  </p>

  <div className="space-y-6">

    {/* evolve */}
    <form action={evolveIdea} className="space-y-3">
      <input type="hidden" name="synthesisId" value={synthesis.id} />
      <input type="hidden" name="type" value="evolve" />

      <p className="text-sm font-medium">
        Push this idea further
      </p>

      <textarea
        name="inputText"
        rows={3}
        placeholder="Extend the idea or explore a deeper perspective..."
        className="w-full border rounded-xl p-4 text-sm resize-none focus:outline-none"
      />

      <button
        type="submit"
        className="text-sm border rounded-lg px-4 py-2 opacity-80 hover:opacity-100 transition"
      >
        Evolve the idea
      </button>
    </form>

    {/* challenge */}
    <form action={evolveIdea} className="space-y-3">
      <input type="hidden" name="synthesisId" value={synthesis.id} />
      <input type="hidden" name="type" value="challenge" />

      <p className="text-sm font-medium">
        Question this idea
      </p>

      <textarea
        name="inputText"
        rows={3}
        placeholder="What might be wrong with this idea?"
        className="w-full border rounded-xl p-4 text-sm resize-none focus:outline-none"
      />

      <button
        type="submit"
        className="text-sm border rounded-lg px-4 py-2 opacity-80 hover:opacity-100 transition"
      >
        Challenge the idea
      </button>
    </form>

    {/* apply */}
    <form action={evolveIdea} className="space-y-3">
      <input type="hidden" name="synthesisId" value={synthesis.id} />
      <input type="hidden" name="type" value="apply" />

      <p className="text-sm font-medium">
        Turn this idea into action
      </p>

      <textarea
        name="inputText"
        rows={3}
        placeholder="How could this idea be tested or applied?"
        className="w-full border rounded-xl p-4 text-sm resize-none focus:outline-none"
      />

      <button
        type="submit"
        className="text-sm border rounded-lg px-4 py-2 opacity-80 hover:opacity-100 transition"
      >
        Apply the idea
      </button>
       </form>

      </div>

     </section>
             

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