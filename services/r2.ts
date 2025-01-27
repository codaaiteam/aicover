import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET || "mochi-videos";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export const uploadVideoToR2 = async (videoUrl: string, fileName: string) => {
  const response = await fetch(videoUrl);
  const buffer = await response.arrayBuffer();

  // 确保文件名使用正确的 URL 编码
  const sanitizedFileName = decodeURIComponent(fileName).replace(/%20/g, ' ');
  const key = `videos/${encodeURIComponent(sanitizedFileName)}.mp4`;
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "video/mp4",
  });

  await r2Client.send(command);
  
  // 使用 CDN URL，确保正确的 URL 编码
  return `${CDN_URL}/${key}`;
};
