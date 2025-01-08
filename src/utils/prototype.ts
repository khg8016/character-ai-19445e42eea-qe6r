import { supabase } from '../lib/supabase';

export async function uploadPrototypeImage(file: File, userId: string): Promise<string> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/prototype-${Date.now()}.${fileExt}`;

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('prototypes')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('prototypes')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPrototypeImage:', error);
    throw error;
  }
}