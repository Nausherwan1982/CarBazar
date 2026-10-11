import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, keywords: post.tags };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.published) notFound();
  return (
    <article className="max-w-3xl mx-auto">
      {post.cover && <img src={post.cover} alt={post.title} className="w-full h-72 object-cover rounded-2xl mb-6" />}
      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded uppercase font-bold">{post.category}</span>
      <h1 className="text-4xl font-bold mt-3 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{format(post.createdAt, "MMMM d, yyyy")}</p>
      <div className="prose prose-lg max-w-none"><ReactMarkdown>{post.body}</ReactMarkdown></div>
    </article>
  );
}
