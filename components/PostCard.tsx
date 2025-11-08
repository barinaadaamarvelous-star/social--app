// components/PostCard.tsx
"use client";

import Link from "next/link";

export default function PostCard({ post }: { post: any }) {
  return (
    <article style={{ border: "1px solid #ddd", margin: "12px 0", padding: 12 }}>
      <Link href={`/post/${post.id}`}>
        <h3 style={{ margin: 0 }}>{post.content?.slice(0, 80) || "Untitled"}</h3>
      </Link>
      {post.image_url && <img src={post.image_url} alt="" style={{ maxWidth: 300, marginTop: 8 }} />}
      <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
        Likes: {post.like_count ?? 0} — {new Date(post.created_at).toLocaleString()}
      </div>
    </article>
  );
}
