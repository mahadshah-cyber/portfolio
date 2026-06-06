import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CTFWriteup } from "@/components/blog/CTFWriteup";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Syed Mahad Shah`,
    description: post.excerpt || post.title,
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true } });

  if (!post) {
    notFound();
  }

  const isCtf = post.title.includes("[CTF]") || post.slug.startsWith("ctf-");

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {isCtf ? (
          <CTFWriteup post={post} />
        ) : (
          <article>
            {/* Post Header */}
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </header>

            {/* Post Content */}
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-a:text-red-500 prose-strong:text-zinc-300 prose-code:text-red-400 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        )}
      </div>
    </div>
  );
}
