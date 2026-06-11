/**
 * Compresses an image file by resizing and reducing quality.
 * Supports File (Blob) and base64 strings.
 */
export function compressImage(input: File, options?: { maxWidth?: number, quality?: number }): Promise<File>;
export function compressImage(input: string, options?: { maxWidth?: number, quality?: number }): Promise<string>;
export async function compressImage(input: File | string, { maxWidth = 1000, quality = 0.7 } = {}): Promise<string | File> {
  return new Promise((resolve) => {
    const isBase64 = typeof input === 'string';
    const img = new Image();
    
    if (isBase64) {
      img.src = input;
    } else {
      // input is narrowed to File/Blob here
      if (typeof input === 'object' && input.type && !input.type.startsWith('image/')) {
        return resolve(input);
      }
      img.src = URL.createObjectURL(input as Blob);
    }

    img.onload = () => {
      // Cleanup object URL if created
      if (!isBase64) {
        URL.revokeObjectURL(img.src);
      }

      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        } else {
          width = (maxWidth / height) * width;
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      if (isBase64) {
        const result = canvas.toDataURL('image/jpeg', quality);
        resolve(result);
      } else {
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = (input as File).name?.replace(/\.[^/.]+$/, "") + ".jpg";
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
          } else {
            resolve(input);
          }
        }, 'image/jpeg', quality);
      }
    };

    img.onerror = () => {
      if (!isBase64) {
        URL.revokeObjectURL(img.src);
      }
      resolve(input);
    };
  });
}
