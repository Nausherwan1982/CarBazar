import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";

export const revalidate = 30;

const categories = [
  { key: "cars", label: "Cars" },
  { key: "bikes", label: "Bikes" },
  { key: "maintenance", label: "Maintenance" },
  { key: "general", label: "General" },
];

export default async function ForumPage({ searchParams }: { searchParams: { cat?: string } }) {
  const category = categories.some(({ key }) => key === searchParams.cat) ? searchParams.cat : undefined;
  const threads = await prisma.forumThread.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" },
    take: 40,
    include: { author: true, _count: { select: { replies: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">CarBazar Community Forum</h1>
        <Link href="/forum/new" className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">+ New Thread</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/forum" className={`rounded-full px-3 py-1.5 text-sm font-medium ${!category ? "bg-red-600 text-white" : "border bg-white"}`}>All</Link>
        {categories.map(({ key, label }) => (
          <Link key={key} href={`/forum?cat=${key}`} className={`rounded-full px-3 py-1.5 text-sm font-medium ${category === key ? "bg-red-600 text-white" : "border bg-white"}`}>
            {label}
          </Link>
        ))}
      </div>
      <div className="divide-y rounded-xl bg-white shadow">
        {threads.length === 0 && <p className="p-6 text-center text-gray-500">No threads yet. Be the first!</p>}
        {threads.map((thread) => (
          <Link key={thread.id} href={`/forum/${thread.slug}`} className="block p-4 hover:bg-gray-50">
            <h2 className="font-semibold">{thread.title}</h2>
            <p className="mt-1 line-clamp-1 text-sm text-gray-500">{thread.body}</p>
            <p className="mt-1 text-xs text-gray-400">
              by {thread.author.name || "User"} · {formatDistanceToNow(thread.createdAt, { addSuffix: true })} · {thread._count.replies} replies
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
