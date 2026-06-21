import supabase from '../db/supabase.js';

interface StorageProps {
  buffer: Buffer;
  key: string;
  mimetype: string;
  bucketName?: string;
}

export const uploadToSupabase = async ({
  buffer,
  key,
  mimetype,
  bucketName = 'documents',
}: StorageProps): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(key, buffer, {
      contentType: mimetype,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage Upload Error: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrl;
};

export const deleteFromSupabase = async ({
  key,
  bucketName = 'documents',
}: {
  key: string;
  bucketName?: string;
}): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([key]);

  if (error) {
    throw new Error(`Supabase Storage Delete Error: ${error.message}`);
  }
};
