import { supabase } from '../lib/supabase';

export async function uploadSourceCode(file: File, userId: string): Promise<string> {
  try {
    // Create a unique file name
    const fileName = `${userId}/source-${Date.now()}.zip`;

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('source-code')
      .upload(fileName, file, { 
        upsert: true,
        contentType: 'application/zip'
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('source-code')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadSourceCode:', error);
    throw error;
  }
}