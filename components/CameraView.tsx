'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCameraStream } from '@/lib/camera-utils'
import { compressImage } from '@/lib/image-compression'
import { HowToUseModal } from './HowToUseModal'

// Retry configuration
const MAX_UPLOAD_RETRIES = 3
const RETRY_DELAY_MS = 1000

export default function CameraView() {
  const router = useRouter()
  const {
    videoRef,
    error,
    isLoading,
    hasPermission,
    isVideoReady,
    captureImage,
    restart
  } = useCameraStream()

  const [isCapturing, setIsCapturing] = useState(false)
  const [captureError, setCaptureError] = useState<string | null>(null)

  const uploadWithRetry = async (
    formData: FormData,
    retries = MAX_UPLOAD_RETRIES
  ): Promise<Response> => {
    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData
      })

      // Only retry on 5xx server errors, not 4xx client errors
      // 422 means Grok successfully classified but found an error (no waste item, etc.)
      if (!response.ok && response.status >= 500 && retries > 0) {
        console.log(`Upload failed, retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
        return uploadWithRetry(formData, retries - 1)
      }

      return response
    } catch (error) {
      if (retries > 0) {
        console.log(`Network error, retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
        return uploadWithRetry(formData, retries - 1)
      }
      throw error
    }
  }

  const handleCapture = useCallback(async () => {
    try {
      setIsCapturing(true)
      setCaptureError(null)

      // Capture image from video
      const imageBlob = await captureImage()

      // Compress image
      const compressedBlob = await compressImage(imageBlob)

      // Prepare upload
      const formData = new FormData()
      formData.append('image', compressedBlob, 'capture.jpg')

      // Upload with retry logic
      const response = await uploadWithRetry(formData)

      // 422 is valid - it means Grok returned an error message
      // Only retry on 5xx server errors, not on 4xx client/validation errors
      if (!response.ok && response.status >= 500) {
        throw new Error(`Classification failed: ${response.status}`)
      }

      const data = await response.json()

      // If we got a non-200 response, it might still have valid error data
      if (!response.ok && !data.error) {
        throw new Error(`Classification failed: ${response.status}`)
      }

      // Store result (consider using Context or Zustand instead)
      try {
        sessionStorage.setItem('classificationResult', JSON.stringify(data))
      } catch (storageError) {
        // Handle Safari private mode or storage quota exceeded
        console.warn('Failed to store result in sessionStorage:', storageError)
        // Could pass data through router state instead
      }

      // Navigate to results
      router.push('/suggestions')
    } catch (err) {
      console.error('Capture error:', err)
      const message = err instanceof Error ? err.message : 'Failed to capture and classify image'
      setCaptureError(message)
    } finally {
      setIsCapturing(false)
    }
  }, [captureImage, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="camera-container flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Initializing camera...</p>
        </div>
      </div>
    )
  }

  // Error states with specific recovery actions
  if (error || !hasPermission) {
    return (
      <div className="camera-container flex items-center justify-center min-h-screen bg-gray-900 p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">
            {error?.type === 'platform' ? 'Browser Not Supported' : 'Camera Access Required'}
          </h2>

          <p className="text-gray-300 mb-6">
            {error?.message || 'Please allow camera access to continue'}
          </p>

          {error?.type === 'permission' && (
            <div className="text-sm text-gray-400 mb-6">
              <p>To enable camera access:</p>
              <ol className="text-left mt-2 space-y-1">
                <li>1. Click the camera icon in your browser's address bar</li>
                <li>2. Select "Allow" for camera permissions</li>
                <li>3. Click retry below</li>
              </ol>
            </div>
          )}

          {error?.recoverable !== false && (
            <button
              onClick={restart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Retry Camera Access
            </button>
          )}

          {error?.type === 'platform' && (
            <a
              href={`safari${window.location.href.replace(/^https?/, '')}`}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors mt-4"
            >
              Open in Safari
            </a>
          )}
        </div>
      </div>
    )
  }

  // Camera view
  return (
    <div className="camera-container relative min-h-screen bg-gray-900">
      {/* Video preview - full screen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-preview absolute inset-0 w-full h-full object-cover bg-gray-800"
      />

      {/* Overlay UI */}
      <div className="camera-overlay absolute inset-0 flex flex-col">
        {/* Top section - hints and status */}
        <div className="flex-1 flex flex-col items-center justify-start p-6 safe-area-top">
          <div className="flex items-center gap-3">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
              <p className="text-white text-center">
                {isVideoReady ? 'Point camera at waste items' : 'Camera initializing...'}
              </p>
            </div>
            <HowToUseModal />
          </div>

          {captureError && (
            <div className="mt-4 bg-red-500/90 backdrop-blur-sm rounded-lg px-4 py-2 max-w-sm">
              <p className="text-white text-sm">{captureError}</p>
            </div>
          )}
        </div>

        {/* Bottom section - capture button */}
        <div className="p-8 safe-area-bottom">
          <div className="flex justify-center">
            <button
              onClick={handleCapture}
              disabled={isCapturing || !isVideoReady}
              className={`
                capture-button relative w-20 h-20 rounded-full border-4 border-white bg-transparent
                transition-all duration-200 transform
                ${isCapturing ? 'scale-90 opacity-70' : 'hover:scale-105 active:scale-95'}
                ${!isVideoReady ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label="Capture photo"
            >
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                {isCapturing && (
                  <div className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}