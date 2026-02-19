import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { assertCopyIsSafe } from "@/safety/copyGuard";

type CreatePostBody = {
  content: string;
  user_id: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePostBody;
    const { content, user_id } = body;

    if (!content || !user_id) {
      return NextResponse.json(
        { error: "Missing text or user_id" },
        { status: 400 }
      );
    }

    // 🔒 COPY-SAFETY VALIDATION
    assertCopyIsSafe(content);

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert({ content, user_id })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase insert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
