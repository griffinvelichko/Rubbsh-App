'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export type CameraErrorType =
  | 'permission'
  | 'device'
  | 'platform'
  | 'security'
  | 'unknown'

export interface CameraError {
  type: CameraErrorType
  message: string
  recoverable: boolean
}

function mapErrorType(error: DOMException): CameraErrorType {
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
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'device'
    case 'SecurityError':
      return 'security'
    default:
      return 'unknown'
  }
}

function getCameraErrorMessage(type: CameraErrorType): string {
  switch (type) {
    case 'permission':
      return 'Camera permission denied. Please allow camera access in your browser settings.'
    case 'device':
      return 'Camera not available. Please check if your camera is connected and not being used by another app.'
    case 'platform':
      return 'Camera not supported on this browser. Please use Safari on iOS devices.'
    case 'security':
      return 'Camera requires a secure connection (HTTPS).'
    default:
      return 'Unable to access camera. Please try again.'
  }
}

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<CameraError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  // Constraint negotiation with fallbacks
  const getStreamWithFallback = useCallback(async (): Promise<MediaStream> => {
    const constraintSets: MediaStreamConstraints[] = [
      // Try rear camera with high resolution
      {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      },
      // Fallback to any rear camera
      {
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      },
      // Fallback to any camera
      {
        video: true,
        audio: false
      }
    ]

    let lastError: Error | null = null

    for (const constraints of constraintSets) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints)
      } catch (err) {
        lastError = err as Error
        console.warn('Constraint failed, trying next:', err)
      }
    }

    throw lastError || new Error('All camera constraints failed')
  }, [])

  const handleTrackEnded = useCallback(() => {
    console.log('Camera track ended unexpectedly')
    setError({
      type: 'device',
      message: 'Camera disconnected. Please reconnect and refresh.',
      recoverable: true
    })
    // Clean up stream inline to avoid circular dependency
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsVideoReady(false)
  }, [])

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        track.removeEventListener('ended', handleTrackEnded)
      })
      streamRef.current = null
    }

    // Critical: Clear video srcObject to prevent memory leaks
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsVideoReady(false)
  }, [handleTrackEnded])

  const initCamera = useCallback(async () => {
    try {
      console.log('[Camera] Initializing camera...')
      setIsLoading(true)
      setError(null)

      // Platform checks
      if (!navigator.mediaDevices?.getUserMedia) {
        throw {
          type: 'platform',
          message: 'Camera not supported in this browser.',
          recoverable: false
        }
      }

      // Security check - allow localhost and 127.0.0.1
      const isLocalhost = window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '[::1]'

      if (window.location.protocol !== 'https:' && !isLocalhost) {
        throw {
          type: 'security',
          message: 'Camera requires a secure connection (HTTPS).',
          recoverable: false
        }
      }

      console.log('[Camera] Requesting camera stream...')
      const stream = await getStreamWithFallback()
      console.log('[Camera] Stream obtained:', stream.id)
      streamRef.current = stream

      // Add track ended listeners
      stream.getTracks().forEach(track => {
        track.addEventListener('ended', handleTrackEnded)
      })

      console.log('[Camera] Video ref exists?', !!videoRef.current)

      // Set stream on video element if it exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('[Camera] Video srcObject set')
      } else {
        console.warn('[Camera] Video ref is null, will set srcObject later')
      }

      console.log('[Camera] Camera initialized successfully')
      setHasPermission(true)
      setIsLoading(false)

      // Mark video as ready after a short delay to allow video element to mount
      setTimeout(() => {
        if (videoRef.current && videoRef.current.srcObject) {
          console.log('[Camera] Setting video ready after delay')
          setIsVideoReady(true)
        }
      }, 500)
    } catch (err) {
      console.error('[Camera] Initialization failed:', err)
      stopStream()

      if ('type' in (err as any)) {
        console.log('[Camera] Custom error:', err)
        setError(err as CameraError)
      } else {
        const domError = err as DOMException
        const errorType = mapErrorType(domError)
        console.log('[Camera] DOM error type:', errorType, domError.name)
        setError({
          type: errorType,
          message: getCameraErrorMessage(errorType),
          recoverable: errorType !== 'permission' && errorType !== 'security'
        })
      }

      setHasPermission(false)
      setIsLoading(false)
    }
  }, [getStreamWithFallback, stopStream, handleTrackEnded])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden')
        // On iOS, we need to stop the stream when backgrounded
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          stopStream()
        }
      } else {
        console.log('Page visible')
        // Restart stream if it was stopped (iOS only)
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !streamRef.current && hasPermission) {
          initCamera()
        }
      }
    }

    const handlePageHide = () => {
      // Only stop on iOS
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        stopStream()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [hasPermission, initCamera, stopStream])

  // Sync stream to video element whenever it changes
  useEffect(() => {
    if (streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      console.log('[Camera] Syncing stream to video element')
      videoRef.current.srcObject = streamRef.current

      // Wait for video to be ready
      const video = videoRef.current
      const handleCanPlay = () => {
        console.log('[Camera] Video can play')
        setIsVideoReady(true)
        video.removeEventListener('canplay', handleCanPlay)
      }

      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        setIsVideoReady(true)
      } else {
        video.addEventListener('canplay', handleCanPlay)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally syncing refs, runs on re-render when stream changes
  }, [hasPermission])

  // Initialize camera on mount
  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (mounted) {
        await initCamera()
      }
    }

    init()

    return () => {
      mounted = false
      stopStream()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only effect
  }, [])

  const captureImage = useCallback(async (): Promise<Blob> => {
    if (!videoRef.current || !streamRef.current) {
      throw new Error('Camera not initialized')
    }

    if (!isVideoReady) {
      throw new Error('Video not ready for capture')
    }

    const video = videoRef.current

    // Reuse canvas for performance
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    // Handle orientation if available
    const orientation = window.screen?.orientation?.angle || 0

    if (orientation !== 0) {
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((orientation * Math.PI) / 180)
      ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2)
      ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0)
    }

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
        0.92
      )
    })
  }, [isVideoReady])

  const restart = useCallback(async () => {
    stopStream()
    await initCamera()
  }, [initCamera, stopStream])

  return {
    videoRef,
    error,
    isLoading,
    hasPermission,
    isVideoReady,
    captureImage,
    restart,
    stream: streamRef.current
  }
}