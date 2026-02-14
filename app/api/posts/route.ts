import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { assertCopyIsSafe } from "@/safety/copyGuard";  // ← ADD THIS

export async function POST(request: Request) {
  try {
    const { content, user_id } = await request.json();

    if (!content || !user_id) {
      return NextResponse.json(
        { error: "Missing text or user_id" },
        { status: 400 }
      );
    }

    // 🔒 COPY-SAFETY VALIDATION
    // Prevents urgency, pressure, ranking, guilt, etc.
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
