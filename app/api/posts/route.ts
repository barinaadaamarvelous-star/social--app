import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { assertCopyIsSafe } from "@/safety/copyGuard"

export const dynamic = "force-dynamic"

type CreatePostBody = {
  content: string
  user_id: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePostBody
    const { content, user_id } = body

    if (!content || !user_id) {
      return NextResponse.json(
        { error: "Missing text or user_id" },
        { status: 400 }
      )
    }

    // 🔒 COPY-SAFETY VALIDATION
    assertCopyIsSafe(content)

    // ✅ Create Supabase client INSIDE handler
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert({ content, user_id })
      .select("*")
      .single()

    if (error) {
      console.error("Supabase insert failed:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, post: data },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error"

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}