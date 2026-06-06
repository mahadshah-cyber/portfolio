import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Syed Mahad Shah",
  description: "Cybersecurity insights, programming tutorials, and tech stories.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            My <span className="text-red-500">Blog</span>
          </h1>
          <p className="text-zinc-500 mt-4 max-w-xl mx-auto">
            Thoughts on cybersecurity, programming, and my journey in tech.
          </p>
          <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-lg">No posts yet. Coming soon!</p>
            <p className="text-zinc-700 text-sm mt-2">
              I&apos;m working on writing about cybersecurity and programming.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
