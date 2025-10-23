import imageCompression from 'browser-image-compression'

// Reusable options for consistent compression
const DEFAULT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1280,
  useWebWorker: true,
  preserveExif: false,
  initialQuality: 0.85,
  fileType: 'image/jpeg' as const
}

// Size threshold - don't compress if already small
const COMPRESSION_THRESHOLD_MB = 0.5

export async function compressImage(
  imageBlob: Blob,
  options = DEFAULT_COMPRESSION_OPTIONS
): Promise<Blob> {
  const sizeInMB = imageBlob.size / 1024 / 1024

  // Skip compression for already small images
  if (sizeInMB <= COMPRESSION_THRESHOLD_MB) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image already small (${sizeInMB.toFixed(2)} MB), skipping compression`)
    }
    return imageBlob
  }

  try {
    const file = new File([imageBlob], 'capture.jpg', { type: 'image/jpeg' })
    const compressed = await imageCompression(file, options)

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Compression: ${sizeInMB.toFixed(2)} MB → ${(compressed.size / 1024 / 1024).toFixed(2)} MB`)
    }

    return compressed
  } catch (error) {
    console.error('Compression failed, using original:', error)
    // Return original on failure - better to upload uncompressed than fail
    return imageBlob
  }
}

// Export for testing or custom configuration
export { DEFAULT_COMPRESSION_OPTIONS, COMPRESSION_THRESHOLD_MB }