// import { supabase } from "@/lib/Client";

// const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
// const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// export const uploadImage = async (file: File, path: string): Promise<string> => {
//   if (!VALID_TYPES.includes(file.type)) {
//     throw new Error(`Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes.`);
//   }

//   if (file.size > MAX_SIZE_BYTES) {
//     throw new Error(
//       `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)} MB. Máximo: 5 MB`
//     );
//   }

//   const ext      = file.name.split('.').pop()?.toLowerCase() || 'png';
//   const fileName = `${Math.random().toString(36).substring(2, 15)}.${ext}`;
//   const filePath = `${path}/${fileName}`;

//   const { error: uploadError } = await supabase.storage
//     .from('images')
//     .upload(filePath, file, {
//       cacheControl: '3600',
//       upsert:       false,
//       contentType:  file.type,
//     });

//   if (uploadError) {
//     console.error('Error de subida:', uploadError);
//     throw new Error(`Error al subir imagen: ${uploadError.message}`);
//   }

//   const { data } = supabase.storage.from('images').getPublicUrl(filePath);
//   return data.publicUrl;
// };

// export const deleteImage = async (url: string): Promise<void> => {
//   const urlObj    = new URL(url);
//   const pathParts = urlObj.pathname.split('/');
//   const imagePath = pathParts.slice(pathParts.indexOf('images') + 1).join('/');

//   const { error } = await supabase.storage.from('images').remove([imagePath]);

//   if (error) {
//     console.error('Error al eliminar imagen:', error);
//     throw error;
//   }
// };

import { supabase } from "@/lib/Client";

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const WEBP_QUALITY = 0.85; // Calidad WebP (0.0 - 1.0)

const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas.'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Error al convertir la imagen a WebP.'));
            return;
          }
          const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp',
          });
          resolve(webpFile);
        },
        'image/webp',
        WEBP_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo cargar la imagen para convertirla.'));
    };

    img.src = objectUrl;
  });
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  if (!VALID_TYPES.includes(file.type)) {
    throw new Error(`Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes.`);
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(
      `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)} MB. Máximo: 5 MB`
    );
  }

  // Convertir a WebP antes de subir
  const webpFile = await convertToWebP(file);

  const fileName = `${Math.random().toString(36).substring(2, 15)}.webp`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, webpFile, {
      cacheControl: '3600',
      upsert:       false,
      contentType:  'image/webp',
    });

  if (uploadError) {
    console.error('Error de subida:', uploadError);
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  const urlObj    = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const imagePath = pathParts.slice(pathParts.indexOf('images') + 1).join('/');

  const { error } = await supabase.storage.from('images').remove([imagePath]);

  if (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};