import dotenv from 'dotenv';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as signUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

interface FileProps {
  buffer: Buffer;
  key: string;
  mimetype: string;
  bucketName?: string;
}

export const uploadFile = async ({
  buffer,
  key,
  mimetype,
  bucketName = process.env.R2_BUCKET_NAME,
}: FileProps): Promise<string> => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }),
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};

export const deleteFile = async ({
  key,
  bucketName = process.env.R2_BUCKET_NAME,
}: {
  key: string;
  bucketName?: string;
}): Promise<void> => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
};

export const getSignedUrl = async ({
  key,
  expiresIn = 3600,
  bucketName = process.env.R2_BUCKET_NAME,
}: {
  key: string;
  expiresIn?: number;
  bucketName?: string;
}): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return signUrl(s3Client, command, { expiresIn });
};

export default s3Client;
