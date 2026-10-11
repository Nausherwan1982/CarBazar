import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
}

export async function uploadCompressed(buffer: Buffer, folder = "carbazar/ads") {
  const compressed = await compressImage(buffer);
  return new Promise<{ url: string; bytes: number }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", format: "webp", quality: "auto:good" },
      (err, res) => {
        if (err || !res) return reject(err);
        resolve({ url: res.secure_url, bytes: res.bytes });
      }
    ).end(compressed);
  });
}
