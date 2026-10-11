import { prisma } from "@/lib/prisma";

export async function dailySeoRefresh(): Promise<{ updated: number }> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { id: true, title: true, excerpt: true },
  });
  let updated = 0;

  for (const post of posts) {
    const seoTitle = post.title.trim().slice(0, 70);
    const seoDescription = post.excerpt.trim().replace(/\s+/g, " ").slice(0, 160);
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { seoTitle, seoDescription },
    });
    updated++;
  }

  return { updated };
}
