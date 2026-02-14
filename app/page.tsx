import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  // cookies must be awaited
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
      get(name: string) {
       return cookieStore.get(name)?.value
        },
      }
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // not logged in → login
  if (!user) {
    redirect('/login')
  }
  // logged in → single allowed flow
  redirect('/reflection/new')
}
