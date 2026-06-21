import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface UploadOptions {
  buffer: Buffer;
  key: string;
  mimetype: string;
  folder?: string;
}

/**
 * Uploads a file to Cloudinary from a buffer.
 */
export const uploadFile = async ({ buffer, key, mimetype, folder = 'Camera Rental House' }: UploadOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: key,
        folder: folder,
        resource_type: 'auto',
      },
      (error: any, result: any) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed: Empty result'));
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Deletes a file from Cloudinary by its public ID.
 */
export const deleteFile = async ({ key }: { key: string }): Promise<any> => {
  return cloudinary.uploader.destroy(key);
};

/**
 * Generates a signed URL for a private resource (if needed).
 */
export const getSignedUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
  });
};

export default cloudinary;
