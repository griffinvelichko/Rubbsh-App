// Import the server client for server-side operations
// Note: This file should only be imported in server components, API routes, or server actions
import { createClient } from '@/lib/supabase/server'

// Type definitions for our database tables
export interface WasteImage {
  id: string
  storage_path: string
  file_size: number
  mime_type: string
  created_at: string
}

export interface Recommendation {
  id: string
  image_id: string
  created_at: string
  error: string | null
  error_description: string | null
  summary: string | null
  suggestions: any // JSONB - will be the parts array from classification
  location: string | null
}

// Helper function to upload image to Supabase Storage
export async function uploadWasteImage(
  buffer: Buffer,
  mimeType: string,
  userId: string
): Promise<{ imageId: string; storagePath: string; publicUrl: string }> {
  const supabase = await createClient()

  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const extension = mimeType.split('/')[1] || 'jpg'
  const filename = `${timestamp}-${crypto.randomUUID()}.${extension}`
  // Store in user-specific folder: userId/filename
  const storagePath = `${userId}/${filename}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('waste-images')
    .upload(storagePath, buffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('[Supabase] Upload error:', uploadError)
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  // Insert metadata into waste_images table
  const { data: imageData, error: dbError } = await supabase
    .from('waste_images')
    .insert({
      storage_path: uploadData.path,
      file_size: buffer.length,
      mime_type: mimeType,
      user_id: userId,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[Supabase] Database error:', dbError)
    // Clean up uploaded file if database insert fails
    await supabase.storage.from('waste-images').remove([uploadData.path])
    throw new Error(`Failed to save image metadata: ${dbError.message}`)
  }

  // Get public URL (for private buckets, you'd use createSignedUrl instead)
  const { data: urlData } = supabase.storage
    .from('waste-images')
    .getPublicUrl(uploadData.path)

  return {
    imageId: imageData.id,
    storagePath: uploadData.path,
    publicUrl: urlData.publicUrl,
  }
}

// Helper function to save classification recommendation
export async function saveRecommendation(
  imageId: string,
  userId: string,
  classification: {
    error: boolean
    error_description: string
    summary: string
    parts: any[]
  },
  location: string | null = null
): Promise<string> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recommendations')
    .insert({
      image_id: imageId,
      user_id: userId,
      error: classification.error ? classification.error_description : null,
      error_description: classification.error ? classification.error_description : null,
      summary: classification.summary,
      suggestions: classification.parts,
      location: location,
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Failed to save recommendation:', error)
    throw new Error(`Failed to save recommendation: ${error.message}`)
  }

  return data.id
}
