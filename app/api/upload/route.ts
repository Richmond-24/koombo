import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const maxDuration = 60;

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();
    const file = incoming.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a photo or video to upload." }, { status: 400 });
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Only image and video files can be uploaded." }, { status: 400 });
    }
    const maxBytes = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `This ${file.type.startsWith("video/") ? "video" : "photo"} exceeds the upload size limit.` }, { status: 413 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudApiKey = process.env.CLOUDINARY_API_KEY;
    const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudName && cloudApiKey && cloudApiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const publicId = `koombo/${randomUUID()}`;
      const signature = createHash("sha1")
        .update(`public_id=${publicId}&timestamp=${timestamp}${cloudApiSecret}`)
        .digest("hex");
      const cloudForm = new FormData();
      cloudForm.append("file", file, file.name);
      cloudForm.append("api_key", cloudApiKey);
      cloudForm.append("timestamp", String(timestamp));
      cloudForm.append("public_id", publicId);
      cloudForm.append("signature", signature);
      const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/auto/upload`, {
        method: "POST",
        body: cloudForm,
      });
      const cloudData = await cloudResponse.json().catch(() => null);
      if (!cloudResponse.ok || !cloudData?.secure_url) {
        return NextResponse.json({ error: cloudData?.error?.message || "The media upload service could not save this file." }, { status: 502 });
      }
      return NextResponse.json({ url: String(cloudData.secure_url) });
    }

    if (process.env.NODE_ENV !== "production") {
      const extensionByMime: Record<string, string> = {
        "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
        "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm",
      };
      const extension = extensionByMime[file.type];
      if (!extension) return NextResponse.json({ error: "Use JPG, PNG, WEBP, MP4, MOV or WEBM files." }, { status: 415 });
      const filename = `${randomUUID()}.${extension}`;
      const uploadDirectory = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
      return NextResponse.json({ url: `/uploads/${filename}` });
    }

    const outgoing = new FormData();
    outgoing.append("file", file, file.name);
    const response = await fetch(`${BACKEND_URL}/api/upload`, { method: "POST", body: outgoing });
    const data = await response.json().catch(() => null);
    const url = data?.url || data?.secure_url || data?.data?.url || data?.data?.secure_url;
    if (!response.ok || !url) {
      return NextResponse.json(
        { error: data?.error || data?.message || "The media upload service could not save this file." },
        { status: response.ok ? 502 : response.status },
      );
    }
    return NextResponse.json({ url: String(url) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Media upload failed. Please try again." },
      { status: 502 },
    );
  }
}
