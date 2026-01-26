# Browser Camera Implementation Guide

This document provides a comprehensive reference for implementing browser camera functionality using native Web APIs, based on the production implementation in the Rubbsh App.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Technologies](#core-technologies)
3. [Implementation Details](#implementation-details)
4. [The useCameraStream Hook](#the-usecamerastream-hook)
5. [Camera View Component](#camera-view-component)
6. [Image Processing](#image-processing)
7. [Error Handling](#error-handling)
8. [Mobile-Specific Considerations](#mobile-specific-considerations)
9. [Security & Permissions](#security--permissions)
10. [Performance Optimizations](#performance-optimizations)
11. [Complete Code Reference](#complete-code-reference)

---

## Architecture Overview

The camera implementation follows a **hook-based architecture** with clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CameraView.tsx                           │
│                    (UI & User Interactions)                     │
├─────────────────────────────────────────────────────────────────┤
│                      useCameraStream()                          │
│              (Stream Management & Image Capture)                │
├─────────────────────────────────────────────────────────────────┤
│                    Native Web APIs                              │
│     navigator.mediaDevices.getUserMedia() | Canvas API          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **No External Camera Libraries**: Uses native `getUserMedia()` instead of libraries like `react-webcam` for full control and smaller bundle size
2. **Custom Hook Pattern**: All camera logic encapsulated in a reusable hook
3. **Progressive Enhancement**: Multiple fallback strategies for device compatibility
4. **Mobile-First**: iOS/Android-specific handling built in from the start

---

## Core Technologies

| Technology | Purpose |
|------------|---------|
| `navigator.mediaDevices.getUserMedia()` | Camera stream access |
| `HTMLCanvasElement` | Image capture from video frame |
| `Blob API` | Image data handling |
| `browser-image-compression` | Client-side image optimization |
| `URL.createObjectURL()` | Preview images without upload |

### Dependencies

```json
{
  "browser-image-compression": "^2.0.0"
}
```

---

## Implementation Details

### Data Flow

```
User opens app
    ↓
CameraView mounts
    ↓
useCameraStream() initializes
    ↓
navigator.mediaDevices.getUserMedia()
    ↓
Success: Set stream → video.srcObject
    ↓
Listen to canplay event
    ↓
Set isVideoReady = true
    ↓
User clicks capture button
    ↓
handleCapture():
  1. Show flash animation (150ms)
  2. captureImage() - draws video to canvas
  3. Canvas.toBlob() - creates JPEG at 92% quality
  4. compressImage() - optimizes for upload
  5. Process/upload image
    ↓
Display results
```

---

## The useCameraStream Hook

This is the core of the implementation. Located at `lib/camera-utils.ts`.

### Hook Interface

```typescript
interface CameraError {
  type: CameraErrorType
  message: string
  recoverable: boolean
}

type CameraErrorType = 'permission' | 'device' | 'platform' | 'security' | 'unknown'

interface UseCameraStreamReturn {
  videoRef: RefObject<HTMLVideoElement | null>
  error: CameraError | null
  isLoading: boolean
  hasPermission: boolean | null
  isVideoReady: boolean
  captureImage: () => Promise<Blob>
  restart: () => Promise<void>
  stream: MediaStream | null
}
```

### Complete Hook Implementation

```typescript
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

// Error type definitions
type CameraErrorType = 'permission' | 'device' | 'platform' | 'security' | 'unknown'

interface CameraError {
  type: CameraErrorType
  message: string
  recoverable: boolean
}

// Map DOMException names to our error types
function mapErrorToType(error: unknown): CameraErrorType {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return 'permission'
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return 'device'
      case 'NotReadableError':
      case 'TrackStartError':
        return 'device'
      case 'SecurityError':
        return 'security'
      default:
        return 'unknown'
    }
  }
  return 'unknown'
}

// Create user-friendly error messages
function createCameraError(error: unknown): CameraError {
  const type = mapErrorToType(error)

  const errorMessages: Record<CameraErrorType, { message: string; recoverable: boolean }> = {
    permission: {
      message: 'Camera permission denied. Please allow camera access in your browser settings.',
      recoverable: true
    },
    device: {
      message: 'Camera not available. Please check that your camera is connected and not in use by another application.',
      recoverable: true
    },
    platform: {
      message: 'Camera is not supported on this device or browser.',
      recoverable: false
    },
    security: {
      message: 'Camera access requires a secure connection (HTTPS).',
      recoverable: false
    },
    unknown: {
      message: 'An unexpected error occurred while accessing the camera.',
      recoverable: true
    }
  }

  return {
    type,
    ...errorMessages[type]
  }
}

// Camera constraints with fallback strategy
const CAMERA_CONSTRAINTS = {
  // Primary: Rear camera with ideal resolution
  primary: {
    video: {
      facingMode: { exact: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  },
  // Fallback: Rear camera without resolution constraint
  secondary: {
    video: {
      facingMode: 'environment'
    },
    audio: false
  },
  // Final fallback: Any available camera
  fallback: {
    video: true,
    audio: false
  }
}

export function useCameraStream(): UseCameraStreamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [error, setError] = useState<CameraError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Check if camera is supported
  const checkCameraSupport = useCallback((): boolean => {
    // Check for mediaDevices API
    if (!navigator.mediaDevices?.getUserMedia) {
      setError({
        type: 'platform',
        message: 'Camera is not supported on this browser. Please try using Safari on iOS or Chrome on Android.',
        recoverable: false
      })
      return false
    }

    // Check for HTTPS (getUserMedia requires secure context)
    const isLocalhost = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1'
    const isSecure = window.location.protocol === 'https:' || isLocalhost

    if (!isSecure) {
      setError({
        type: 'security',
        message: 'Camera access requires a secure connection (HTTPS).',
        recoverable: false
      })
      return false
    }

    return true
  }, [])

  // Stop all tracks and cleanup
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        // Remove any listeners
        track.onended = null
      })
      streamRef.current = null
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsVideoReady(false)
  }, [])

  // Start camera with fallback strategy
  const startStream = useCallback(async () => {
    if (!checkCameraSupport()) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const constraintsList = [
      CAMERA_CONSTRAINTS.primary,
      CAMERA_CONSTRAINTS.secondary,
      CAMERA_CONSTRAINTS.fallback
    ]

    let lastError: unknown = null

    for (const constraints of constraintsList) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

        streamRef.current = mediaStream
        setStream(mediaStream)
        setHasPermission(true)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream

          // Wait for video to be ready
          await new Promise<void>((resolve) => {
            const video = videoRef.current!

            const handleCanPlay = () => {
              video.removeEventListener('canplay', handleCanPlay)
              // Small delay to ensure stable playback
              setTimeout(() => {
                setIsVideoReady(true)
                resolve()
              }, 500)
            }

            if (video.readyState >= 3) {
              handleCanPlay()
            } else {
              video.addEventListener('canplay', handleCanPlay)
            }
          })
        }

        setIsLoading(false)
        return // Success - exit loop
      } catch (err) {
        lastError = err
        // Continue to next fallback
      }
    }

    // All attempts failed
    setHasPermission(false)
    setError(createCameraError(lastError))
    setIsLoading(false)
  }, [checkCameraSupport])

  // Capture image from video stream
  const captureImage = useCallback(async (): Promise<Blob> => {
    const video = videoRef.current
    if (!video) {
      throw new Error('Video element not available')
    }

    // Create or reuse canvas for performance
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Set canvas size to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Handle device orientation
    const orientation = window.screen?.orientation?.angle || 0

    if (orientation !== 0) {
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((orientation * Math.PI) / 180)
      ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2)
      ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create image blob'))
          }
        },
        'image/jpeg',
        0.92 // 92% quality
      )
    })
  }, [])

  // Restart camera (for error recovery)
  const restart = useCallback(async () => {
    stopStream()
    setError(null)
    setHasPermission(null)
    await startStream()
  }, [startStream, stopStream])

  // Initialize camera on mount
  useEffect(() => {
    startStream()
    return () => {
      stopStream()
    }
  }, [startStream, stopStream])

  // Handle iOS background/foreground
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (!isIOS) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is backgrounded - stop stream to save battery
        stopStream()
      } else {
        // Page is visible again - restart stream
        startStream()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [startStream, stopStream])

  // Handle page unload
  useEffect(() => {
    const handlePageHide = () => {
      stopStream()
    }

    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [stopStream])

  return {
    videoRef,
    error,
    isLoading,
    hasPermission,
    isVideoReady,
    captureImage,
    restart,
    stream
  }
}
```

---

## Camera View Component

The UI component that uses the camera hook. Located at `components/CameraView.tsx`.

### Component Structure

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCameraStream } from '@/lib/camera-utils'
import { compressImage } from '@/lib/image-compression'

interface CameraViewProps {
  location?: string
}

export default function CameraView({ location }: CameraViewProps) {
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
  const [freezeFrame, setFreezeFrame] = useState<string | null>(null)
  const [showFlash, setShowFlash] = useState(false)

  const handleCapture = async () => {
    if (isCapturing || !isVideoReady) return

    setIsCapturing(true)
    setCaptureError(null)

    try {
      // Show camera flash effect
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 150)

      // Capture image from video
      const imageBlob = await captureImage()

      // Create preview URL for freeze frame
      const previewUrl = URL.createObjectURL(imageBlob)
      setFreezeFrame(previewUrl)

      // Compress image for upload
      const compressedBlob = await compressImage(imageBlob)

      // Create form data for upload
      const formData = new FormData()
      formData.append('image', compressedBlob, 'capture.jpg')
      if (location) {
        formData.append('location', location)
      }

      // Upload with retry logic
      let lastError: Error | null = null
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch('/api/classify', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            // Only retry on 5xx server errors
            if (response.status >= 500 && attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 1000))
              continue
            }
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          const data = await response.json()

          // Store result and navigate
          sessionStorage.setItem('classificationResult', JSON.stringify(data))
          router.push('/suggestions')
          return
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error')
        }
      }

      throw lastError
    } catch (err) {
      setCaptureError(err instanceof Error ? err.message : 'Failed to capture image')
      // Clean up freeze frame on error
      if (freezeFrame) {
        URL.revokeObjectURL(freezeFrame)
        setFreezeFrame(null)
      }
    } finally {
      setIsCapturing(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>Initializing camera...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-black p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">
            {error.type === 'permission' ? '🔒' : '📷'}
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {error.type === 'permission' ? 'Camera Access Required' : 'Camera Error'}
          </h2>
          <p className="text-gray-300 mb-6">{error.message}</p>

          {error.recoverable && (
            <button
              onClick={restart}
              className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Retry Camera Access
            </button>
          )}

          {error.type === 'platform' && /iPhone|iPad|iPod/.test(navigator.userAgent) && (
            <a
              href="x-web-search://"
              className="block mt-4 text-blue-400 underline"
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
    <div className="relative h-full bg-black overflow-hidden">
      {/* Video stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Freeze frame overlay (shown during processing) */}
      {freezeFrame && (
        <img
          src={freezeFrame}
          alt="Captured"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Camera flash effect */}
      {showFlash && (
        <div className="absolute inset-0 bg-white animate-flash pointer-events-none" />
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-safe">
        {/* Top section - instructions */}
        <div className="text-center pt-4">
          <p className="text-white text-sm bg-black/50 rounded-full px-4 py-2 inline-block">
            Point camera at item to classify
          </p>
        </div>

        {/* Error messages */}
        {captureError && (
          <div className="mx-4 p-4 bg-red-500/90 rounded-lg text-white text-center">
            {captureError}
            <button
              onClick={() => setCaptureError(null)}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bottom section - capture button */}
        <div className="flex justify-center pb-8">
          {isCapturing ? (
            <div className="w-20 h-20 flex items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
            </div>
          ) : (
            <button
              onClick={handleCapture}
              disabled={!isVideoReady}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 backdrop-blur-sm
                         hover:scale-105 active:scale-95 transition-transform
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Capture photo"
            >
              <div className="absolute inset-2 bg-white rounded-full" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Image Processing

### Compression Utility

Located at `lib/image-compression.ts`:

```typescript
import imageCompression from 'browser-image-compression'

const DEFAULT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1280,
  useWebWorker: true,      // Non-blocking compression
  preserveExif: false,
  initialQuality: 0.85,
  fileType: 'image/jpeg' as const
}

const COMPRESSION_THRESHOLD_MB = 0.5

export async function compressImage(imageBlob: Blob): Promise<Blob> {
  const sizeMB = imageBlob.size / (1024 * 1024)

  // Skip compression for already small images
  if (sizeMB < COMPRESSION_THRESHOLD_MB) {
    return imageBlob
  }

  try {
    const compressedBlob = await imageCompression(
      imageBlob as File,
      DEFAULT_COMPRESSION_OPTIONS
    )

    if (process.env.NODE_ENV === 'development') {
      const originalSizeMB = imageBlob.size / (1024 * 1024)
      const compressedSizeMB = compressedBlob.size / (1024 * 1024)
      console.log(
        `Image compressed: ${originalSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB ` +
        `(${((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1)}% reduction)`
      )
    }

    return compressedBlob
  } catch (error) {
    console.warn('Image compression failed, using original:', error)
    return imageBlob
  }
}
```

---

## Error Handling

### Error Types and Recovery

| Error Type | Cause | Recovery Strategy |
|------------|-------|-------------------|
| `permission` | User denied camera access | Show retry button, explain how to enable in settings |
| `device` | No camera found or camera in use | Show retry button, suggest checking connections |
| `platform` | Browser doesn't support getUserMedia | Suggest alternative browser (Safari for iOS) |
| `security` | Not on HTTPS | Explain HTTPS requirement |
| `unknown` | Unexpected error | Show retry button |

### DOMException Mapping

```typescript
const ERROR_MAP: Record<string, CameraErrorType> = {
  'NotAllowedError': 'permission',
  'PermissionDeniedError': 'permission',
  'NotFoundError': 'device',
  'DevicesNotFoundError': 'device',
  'NotReadableError': 'device',
  'TrackStartError': 'device',
  'SecurityError': 'security'
}
```

---

## Mobile-Specific Considerations

### iOS Handling

```typescript
// Stop stream when app is backgrounded (saves battery, prevents permission issues)
useEffect(() => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (!isIOS) return

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopStream()
    } else {
      startStream()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
}, [])
```

### Video Element Attributes

```html
<video
  autoPlay      <!-- Start playback immediately -->
  playsInline   <!-- CRITICAL for iOS - prevents fullscreen -->
  muted         <!-- Required for autoplay on mobile -->
/>
```

### Safe Area Handling (CSS)

```css
.p-safe {
  padding-top: max(1rem, env(safe-area-inset-top));
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
}
```

### Viewport Configuration

```typescript
// In layout.tsx or _app.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,       // Prevent zoom
  userScalable: false    // Prevent pinch-to-zoom
}
```

---

## Security & Permissions

### HTTP Headers (next.config.js)

```javascript
module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        {
          key: 'Permissions-Policy',
          value: 'camera=(self), microphone=()'
        },
        {
          key: 'Feature-Policy',
          value: 'camera \'self\'; microphone \'none\''
        }
      ]
    }]
  }
}
```

### Content Security Policy

```typescript
// In metadata export
other: {
  'Content-Security-Policy': `
    img-src 'self' blob: data:;
    media-src 'self' blob:;
  `
}
```

### PWA Manifest

```json
{
  "display": "standalone",
  "orientation": "portrait",
  "permissions": ["camera"]
}
```

---

## Performance Optimizations

### 1. Canvas Reuse

```typescript
// Create canvas once, reuse for all captures
const canvasRef = useRef<HTMLCanvasElement | null>(null)

if (!canvasRef.current) {
  canvasRef.current = document.createElement('canvas')
}
```

### 2. Web Worker Compression

```typescript
const compressionOptions = {
  useWebWorker: true  // Offloads to worker thread
}
```

### 3. Memory Leak Prevention

```typescript
// Always clean up blob URLs
useEffect(() => {
  return () => {
    if (freezeFrame) {
      URL.revokeObjectURL(freezeFrame)
    }
  }
}, [freezeFrame])

// Always stop stream tracks
const stopStream = () => {
  stream?.getTracks().forEach(track => {
    track.stop()
    track.onended = null
  })
  if (videoRef.current) {
    videoRef.current.srcObject = null
  }
}
```

### 4. Constraint Fallback Strategy

Try constraints in order of preference to maximize compatibility:

1. **Primary**: Rear camera + 1280x720 resolution
2. **Secondary**: Rear camera + any resolution
3. **Fallback**: Any available camera

---

## Complete Code Reference

### File Structure

```
your-project/
├── app/
│   ├── page.tsx                    # Main camera page
│   └── layout.tsx                  # Viewport & headers config
│
├── components/
│   └── CameraView.tsx              # Camera UI component
│
├── lib/
│   ├── camera-utils.ts             # useCameraStream() hook
│   └── image-compression.ts        # compressImage() utility
│
├── public/
│   └── manifest.json               # PWA config with camera permission
│
├── next.config.js                  # Security headers
└── package.json
```

### Required CSS

```css
/* globals.css */

.camera-page {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}

/* Camera flash animation */
@keyframes flash {
  0% { opacity: 0; }
  50% { opacity: 0.8; }
  100% { opacity: 0; }
}

.animate-flash {
  animation: flash 150ms ease-out;
}

/* Capture button styling */
.capture-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;
}

.capture-button:active {
  transform: scale(0.9);
}

/* Safe area padding */
.p-safe {
  padding: max(1rem, env(safe-area-inset-top))
           max(1rem, env(safe-area-inset-right))
           max(1rem, env(safe-area-inset-bottom))
           max(1rem, env(safe-area-inset-left));
}
```

---

## Quick Start Checklist

- [ ] Install `browser-image-compression` dependency
- [ ] Create `useCameraStream` hook with error handling
- [ ] Create `CameraView` component with UI
- [ ] Add `compressImage` utility
- [ ] Configure viewport (disable zoom for mobile)
- [ ] Add Permissions-Policy headers
- [ ] Add camera permission to manifest.json
- [ ] Test on iOS Safari (ensure `playsInline` attribute)
- [ ] Test permission denial flow
- [ ] Test background/foreground on mobile
- [ ] Verify HTTPS requirement handling

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Black screen on iOS | Add `playsInline` attribute to video |
| Camera doesn't start | Check HTTPS requirement |
| Permission not prompted | Clear site data and retry |
| Video freezes on background | Implement visibility change handler |
| High memory usage | Ensure blob URLs are revoked |
| Slow capture | Enable Web Worker for compression |
| Wrong camera selected | Use constraint fallback strategy |

---

## References

- [MediaDevices.getUserMedia() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [browser-image-compression - npm](https://www.npmjs.com/package/browser-image-compression)
- [Permissions Policy - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy)
