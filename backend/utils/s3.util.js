import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export const deleteFileFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // 1. Parse the URL
    const url = new URL(imageUrl);
    
    // 2. Get the path (e.g. '/listings/1781...%20.png') and remove the leading '/'
    const rawKey = url.pathname.substring(1);

    // 3. 🚨 CRITICAL FIX: Decode the URL characters back to normal spaces and commas
    const decodedKey = decodeURIComponent(rawKey);

    // Let's log both to prove it's working
    // console.log(`Raw URL Key: ${rawKey}`);
    console.log(`Sending to AWS for deletion: ${decodedKey}`);

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: decodedKey, // 👈 We must pass the DECODED key here
    });

    await s3.send(command);
    console.log(`Successfully deleted from AWS Bucket: ${decodedKey}`);
    
  } catch (error) {
    console.error(`Failed to delete ${imageUrl} from S3:`, error);
  }
};