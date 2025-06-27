
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload image to Supabase Storage
export async function uploadImage(file: File, folder = ""): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${folder}${folder ? "/" : ""}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("assets").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("assets").getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error("Upload error:", error)
    return { url: null, error: "Failed to upload image" }
  }
}

// Helper function to delete image from Supabase Storage
export async function deleteImage(url: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split("/storage/v1/object/public/assets/")
    if (urlParts.length !== 2) {
      return { success: false, error: "Invalid image URL" }
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage.from("assets").remove([filePath])

    if (error) {
      console.error("Delete error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Failed to delete image" }
  }
}
