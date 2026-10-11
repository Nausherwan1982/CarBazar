import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { topic = "Latest car launches in Pakistan", category = "news" } = await req.json().catch(() => ({}));
  const c = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Pakistani automotive journalist. 600-word markdown blog post." },
      { role: "user", content: `Topic: ${topic}. Return JSON {"title","slug","excerpt","body","seoTitle","seoDescription","tags":[]}` },
    ],
  });
  const data = JSON.parse(c.choices[0].message.content!);
  const post = await prisma.blogPost.create({
    data: { title: data.title, slug: data.slug + "-" + Date.now().toString(36), excerpt: data.excerpt, body: data.body, category, tags: data.tags || [], seoTitle: data.seoTitle, seoDescription: data.seoDescription, published: true },
  });
  return NextResponse.json({ post });
}
