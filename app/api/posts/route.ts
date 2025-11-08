import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // service role client

export async function POST(request: Request) {
  try {
    const { text, user_id } = await request.json();

    if (!text || !user_id) {
      return NextResponse.json(
        { error: "Missing text or user_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert({ text, user_id })
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
