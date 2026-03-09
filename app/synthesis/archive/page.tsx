import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ArchivePage() {
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

  const { data: syntheses } = await supabase
    .from('reflection_syntheses')
    .select('*')
    .eq('user_id', user.id)
    .order('period_start', { ascending: false })

   return (
   <main className="max-w-2xl mx-auto py-16 space-y-12">

    <section className="space-y-2">
      <h1 className="text-lg font-medium">
        Reflection Timeline
      </h1>

      <p className="text-sm opacity-60">
        A record of how your thinking has evolved over time.
      </p>
    </section>

    <section className="space-y-6">

      {!syntheses?.length && (
        <p className="text-sm opacity-60">
          No syntheses yet.
        </p>
      )}

      {syntheses?.map((synthesis) => {
        const year = new Date(synthesis.period_start).getFullYear()

        const title =
          synthesis.content?.title || "Untitled synthesis"

        return (
          <Link
            key={synthesis.id}
            href={`/reflection/synthesis/${synthesis.id}`}
            className="block border rounded-xl p-5 hover:opacity-80 transition"
          >
            <div className="flex items-start justify-between">

              <div className="space-y-2">

                <p className="text-sm opacity-60">
                  {year}
                </p>

                <p className="text-base font-medium">
                  {title}
                </p>

                <p className="text-xs opacity-60">
                  {new Date(synthesis.period_start).toLocaleDateString()} —{" "}
                  {new Date(synthesis.period_end).toLocaleDateString()}
                </p>

              </div>

              <div className="text-xs opacity-70">
                {synthesis.refunded
                  ? "Refunded"
                  : synthesis.paid
                  ? "Kept"
                  : "Free"}
              </div>

            </div>
          </Link>
        )
      })}

    </section>

  </main>
)
}