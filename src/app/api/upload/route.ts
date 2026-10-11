import { NextRequest, NextResponse } from "next/server";
import { uploadCompressed } from "@/lib/imageCompress";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const files = data.getAll("files") as File[];
  if (files.length > 20) return NextResponse.json({ error: "Max 20 images" }, { status: 400 });
  const urls: string[] = [];
  for (const f of files) {
    try {
      const buf = Buffer.from(await f.arrayBuffer());
      const { url } = await uploadCompressed(buf);
      urls.push(url);
    } catch (e: any) { console.warn("upload failed:", e.message); }
  }
  return NextResponse.json({ urls });
}
