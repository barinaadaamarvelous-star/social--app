"use client";

import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  content: string | null;
  image_url?: string | null;
  like_count?: number | null;
  created_at: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        margin: "12px 0",
        padding: 12,
      }}
    >
      <Link href={`/post/${post.id}`}>
        <h3 style={{ margin: 0 }}>
          {post.content?.slice(0, 80) || "Untitled"}
        </h3>
      </Link>

      {post.image_url && (
        <div style={{ marginTop: 8 }}>
          <Image
            src={post.image_url}
            alt="Post image"
            width={300}
            height={300}
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div
        style={{
          fontSize: 12,
          color: "#666",
          marginTop: 8,
        }}
      >
        Likes: {post.like_count ?? 0} —{" "}
        {new Date(post.created_at).toLocaleString()}
      </div>
    </article>
  );
}
