import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const messages = await prisma.chat.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Messages</h1>
      {messages.length === 0
        ? <p className="rounded-xl bg-white p-6 text-gray-600">Your conversations will appear here.</p>
        : <div className="divide-y rounded-xl bg-white shadow">
          {messages.map((message) => (
            <article key={message.id} className="p-4">
              <p className="text-xs text-gray-500">{message.senderId === userId ? "You" : "Seller"} · {message.createdAt.toLocaleString()}</p>
              <p className="mt-2 whitespace-pre-wrap">{message.message}</p>
              <Link href={`/ad/${message.adId}`} className="mt-2 inline-block text-sm font-semibold text-red-600">View listing</Link>
            </article>
          ))}
        </div>}
    </section>
  );
}
