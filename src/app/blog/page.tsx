import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 120;
const CATS = ["news", "reviews", "guides", "new-launches"];

export default async function BlogPage({ searchParams }: { searchParams: { cat?: string } }) {
  const cat = searchParams.cat;
  const posts = await prisma.blogPost.findMany({ where: { published: true, ...(cat ? { category: cat } : {}) }, orderBy: { createdAt: "desc" }, take: 30 });
  const [feature, ...rest] = posts;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">CarBazar Blog</h1>
      <div className="flex flex-wrap gap-2">
        <Link href="/blog" className={`px-3 py-1.5 rounded-full text-sm font-medium ${!cat ? "bg-red-600 text-white" : "bg-white border"}`}>All</Link>
        {CATS.map((c) => (
          <Link key={c} href={`/blog?cat=${c}`} className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${cat === c ? "bg-red-600 text-white" : "bg-white border"}`}>{c.replace("-", " ")}</Link>
        ))}
      </div>
      {feature && (
        <Link href={`/blog/${feature.slug}`} className="block relative rounded-2xl overflow-hidden shadow-xl group">
          {feature.cover && <img src={feature.cover} alt={feature.title} className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="text-xs bg-red-600 px-2 py-0.5 rounded uppercase font-bold">{feature.category}</span>
              <h2 className="text-2xl md:text-4xl font-bold mt-2">{feature.title}</h2>
              <p className="mt-2 opacity-90 max-w-2xl line-clamp-2">{feature.excerpt}</p>
            </div>
          </div>
        </Link>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        {rest.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition">
            {p.cover && <img src={p.cover} alt={p.title} className="w-full h-48 object-cover" loading="lazy" />}
            <div className="p-4">
              <span className="text-xs text-red-600 font-semibold uppercase">{p.category}</span>
              <h3 className="font-bold mt-1 line-clamp-2">{p.title}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.excerpt}</p>
              <p className="text-xs text-gray-400 mt-3">{formatDistanceToNow(p.createdAt, { addSuffix: true })}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
