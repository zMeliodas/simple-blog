import { supabase } from "../services/supabaseClient";

export const uploadImage = async (file: File, folder: "comments" | "blogs"): Promise<string | null> => {
  try {
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      alert(`Upload error: ${error}`);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    alert(`Error uploading image: ${error}`);
    return null;
  }
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract path from URL
    const urlParts = imageUrl.split('/blog-images/');

    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);

    if (error) {
      alert(`Delete error: ${error}`);
      return false;
    }

    return true;
  } catch (error) {
    alert(`Error deleting image: ${error}`);
    return false;
  }
};