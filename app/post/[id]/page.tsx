// app/post/[id]/page.tsx
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const id = params.id;
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id, content, image_url, like_count, created_at, author_id")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <div style={{ padding: 20 }}>Post not found</div>;
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Post</h1>
      <div style={{ border: "1px solid #ccc", padding: 12 }}>
        <p>{data.content}</p>
        {data.image_url && <img src={data.image_url} alt="" style={{ maxWidth: 400 }} />}
        <div>Likes: {data.like_count ?? 0}</div>
        <div>Author: {data.author_id}</div>
        <div>Created at: {new Date(data.created_at).toLocaleString()}</div>
      </div>
    </main>
  );
}
