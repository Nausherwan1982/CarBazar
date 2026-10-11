import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ReplyForm from "@/components/ReplyForm";

export const revalidate = 20;

export default async function ThreadPage({ params }: { params: { slug: string } }) {
  const thread = await prisma.forumThread.findUnique({
    where: { slug: params.slug },
    include: { author: true, replies: { include: { author: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!thread) notFound();
  await prisma.forumThread.update({ where: { id: thread.id }, data: { views: { increment: 1 } } });

  return (
    <article className="space-y-6">
      <header className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold">{thread.title}</h1>
        <p className="mt-2 text-xs text-gray-500">
          by {thread.author.name || "User"} |{" "}
          {formatDistanceToNow(thread.createdAt, { addSuffix: true })} |{" "}
          {thread.views} views
        </p>
        <p className="mt-4 text-gray-800 whitespace-pre-line">{thread.body}</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{thread.replies.length} Replies</h2>
        {thread.replies.map((r) => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <p className="mb-1 text-xs text-gray-500">
              <span className="font-semibold">{r.author.name || "User"}</span> |{" "}
              {formatDistanceToNow(r.createdAt, { addSuffix: true })}
            </p>
            <p className="text-gray-800 whitespace-pre-line">{r.body}</p>
          </div>
        ))}
      </section>
      <ReplyForm threadId={thread.id} />
    </article>
  );
}
