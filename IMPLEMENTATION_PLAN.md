# Rubbish-App Implementation Plan
## Mobile-Optimized Camera-First Waste Classification App

**Stack**: Next.js 15 App Router + TypeScript + ReactBits + Tailwind CSS
**Last Updated**: October 2025

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Installation & Setup](#installation--setup)
4. [Camera Integration](#camera-integration)
5. [API Design](#api-design)
6. [Component Structure](#component-structure)
7. [Type Safety & Validation](#type-safety--validation)
8. [Styling Guidelines](#styling-guidelines)
9. [Mobile Optimization](#mobile-optimization)
10. [Security & Privacy](#security--privacy)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Checklist](#deployment-checklist)

---

**TODOS**
  ⎿  ☐ Setup Next.js project with TypeScript and App Router
     ☐ Install and configure ReactBits component library
     ☐ Create globals.css with mobile-first styling system
     ☐ Implement camera page with getUserMedia
     ☐ Add client-side image compression utility
     ☐ Create API route for Grok-4-fast integration
     ☐ Create waste classification system prompt
     ☐ Implement suggestions page for results display
     ☐ Add TypeScript types and Zod validation
     ☐ Test on iOS Safari and Android Chrome
     ☐ Configure Vercel deployment settings

## Project Overview

### Core Requirements
- **Two Pages Total**:
  - `/` (Home): Full-screen live camera preview with capture button
  - `/suggestions`: Waste classification results display
- **Camera-Only Interface**: Live camera using `getUserMedia` (rear camera only)
- **No File Uploads**: `<input type="file">` is prohibited
- **API Flow**: Captured image → `/api/classify` → Grok-4-Fast LLM → JSON response
- **UI Framework**: ReactBits (NOT Shadcn)
- **Styling**: All CSS centralized in `globals.css` (no inline styles)

### JSON Contract
```typescript
{
  "error": false,
  "error_description": "",
  "summary": "string",
  "parts": [
    {
      "name": "string",
      "separation_instruction": "one short sentence",
      "bin": "FoodScraps" | "RecyclableContainers" | "Paper" | "Garbage"
    }
  ]
}
```

---

## Technical Architecture

### Project Structure
```
rubbish-app/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page (camera)
│   ├── suggestions/
│   │   └── page.tsx               # Suggestions page
│   ├── api/
│   │   └── classify/
│   │       └── route.ts           # Image classification API
│   ├── globals.css                # All styles centralized here
│   └── types/
│       └── index.ts               # Shared types
├── components/
│   ├── CameraView.tsx             # Camera interface (client)
│   ├── CaptureButton.tsx          # Capture control (client)
│   └── WasteClassification.tsx    # Results display (client)
├── lib/
│   ├── camera-utils.ts            # Camera helpers
│   ├── image-compression.ts       # Client-side compression
│   └── validation.ts              # Zod schemas
└── public/
    └── icons/                     # Camera, bin icons
```

---

## Installation & Setup

### 1. Initialize Next.js 15 Project
```bash
npx create-next-app@latest rubbish-app --typescript --tailwind --app --eslint
cd rubbish-app
```

**Configuration Prompts**:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory: No
- ✅ App Router: Yes
- ❌ Import alias: Default (`@/*`)

### 2. Install Core Dependencies
```bash
npm install zod browser-image-compression
```

**Package Versions (2025 Latest)**:
- `zod`: ^3.23.x (Schema validation)
- `browser-image-compression`: ^2.0.x (Client-side compression)

### 3. Install ReactBits Components

**ReactBits Installation Methods**:

#### Option A: Manual Installation (Recommended)
1. Visit https://reactbits.dev
2. Browse components and select desired animations
3. Copy component code directly from the "Code" tab
4. Create component files in `/components/reactbits/`
5. Install per-component dependencies as needed

**Common Dependencies**:
```bash
# If using GSAP-powered animations
npm install gsap

# If using 3D components
npm install three @react-three/fiber @react-three/drei
```

#### Option B: CLI Installation
```bash
# Using Shadcn CLI (ReactBits supports this)
npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-TW

# Using jsrepo
npx jsrepo add https://reactbits.dev/TS-TW/TextAnimations/SplitText
```

**Variant Selection**: Choose `TS-TW` (TypeScript + Tailwind) for this project

### 4. TypeScript Configuration Updates
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## Camera Integration

### Browser Compatibility Matrix (2025)

| Browser | getUserMedia Support | facingMode Support | Notes |
|---------|---------------------|-------------------|-------|
| iOS Safari 11.4+ | ✅ Full | ✅ Yes | **ONLY browser with camera on iOS** |
| iOS Chrome/Firefox | ❌ No | ❌ No | Uses WKWebView (no camera access) |
| Android Chrome | ✅ Full | ✅ Yes | Full support |
| Android Firefox | ✅ Full | ✅ Yes | Full support |

**Critical iOS Limitation**: On iOS, camera access works ONLY in Safari. Chrome, Firefox, and other browsers use WKWebView and cannot access `getUserMedia`.

### Implementation: Camera Hook

**File**: `/lib/camera-utils.ts`

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

export interface CameraError {
  type: 'NotAllowedError' | 'NotFoundError' | 'NotReadableError' | 'OverconstrainedError' | 'SecurityError'
  message: string
}

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<CameraError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true

    async function initCamera() {
      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser')
        }

        // Request rear camera with optimal constraints
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: 'environment' }, // Rear camera preferred
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: { ideal: 16/9 }
          },
          audio: false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setHasPermission(true)
        setIsLoading(false)
      } catch (err) {
        if (!mounted) return

        const error = err as DOMException
        setError({
          type: error.name as CameraError['type'],
          message: getCameraErrorMessage(error.name)
        })
        setHasPermission(false)
        setIsLoading(false)
      }
    }

    initCamera()

    return () => {
      mounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const captureImage = async (): Promise<Blob> => {
    if (!videoRef.current || !streamRef.current) {
      throw new Error('Camera not initialized')
    }

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    ctx.drawImage(video, 0, 0)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create image blob'))
        },
        'image/jpeg',
        0.92
      )
    })
  }

  return {
    videoRef,
    error,
    isLoading,
    hasPermission,
    captureImage,
    stream: streamRef.current
  }
}

function getCameraErrorMessage(errorName: string): string {
  const messages: Record<string, string> = {
    NotAllowedError: 'Camera permission denied. Please allow camera access in your browser settings.',
    NotFoundError: 'No camera found on this device.',
    NotReadableError: 'Camera is already in use by another application.',
    OverconstrainedError: 'Rear camera not available. Using available camera.',
    SecurityError: 'Camera access requires HTTPS or localhost.',
    AbortError: 'Camera initialization was interrupted.'
  }
  return messages[errorName] || 'An unknown camera error occurred.'
}
```

### Key Camera Constraints

```typescript
// Production constraints for mobile optimization
const constraints: MediaStreamConstraints = {
  video: {
    facingMode: { ideal: 'environment' }, // Rear camera
    width: { ideal: 1280 },               // Standard HD width
    height: { ideal: 720 },               // 16:9 aspect ratio
    aspectRatio: { ideal: 16/9 },         // Prevent warping
    frameRate: { ideal: 30 }              // Smooth preview
  },
  audio: false
}
```

**Important Notes**:
- Use `ideal` instead of `exact` for better cross-device compatibility
- Standard resolutions (640x480, 1280x720) prevent camera freezing
- `facingMode: 'environment'` = rear camera; `'user'` = front camera

### Video Element Configuration

**Critical iOS Attributes**:
```tsx
<video
  ref={videoRef}
  autoPlay
  playsInline  // REQUIRED for iOS - prevents fullscreen takeover
  muted        // Required for autoPlay on iOS
  className="camera-preview"
/>
```

---

## Image Compression

### Client-Side Compression Implementation

**File**: `/lib/image-compression.ts`

```typescript
import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  preserveExif?: boolean
}

export async function compressImage(
  imageBlob: Blob,
  options: CompressionOptions = {}
): Promise<Blob> {
  const defaultOptions = {
    maxSizeMB: 1,                    // Target 1MB max
    maxWidthOrHeight: 1280,          // Resize to max 1280px
    useWebWorker: true,              // Non-blocking compression
    preserveExif: false,             // Strip EXIF for privacy + size
    initialQuality: 0.85,            // Start at 85% quality
    fileType: 'image/jpeg'           // Always output JPEG
  }

  const finalOptions = { ...defaultOptions, ...options }

  try {
    // Convert Blob to File (required by browser-image-compression)
    const file = new File([imageBlob], 'capture.jpg', { type: 'image/jpeg' })

    const compressedFile = await imageCompression(file, finalOptions)

    console.log(`Original: ${(imageBlob.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)

    return compressedFile
  } catch (error) {
    console.error('Image compression failed:', error)
    throw new Error('Failed to compress image')
  }
}
```

**Why Strip EXIF Data**:
- **Privacy**: EXIF contains GPS coordinates, device info, timestamps
- **Size Reduction**: EXIF metadata can add 50-200KB to images
- **Consistency**: Removes orientation quirks across iOS/Android

---

## API Design

### Route Handler: `/api/classify/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { classificationResponseSchema } from '@/lib/validation'

export const runtime = 'edge' // Optional: Use Edge Runtime for lower latency

export async function POST(request: NextRequest) {
  try {
    // 1. Parse multipart/form-data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null

    if (!imageFile) {
      return NextResponse.json(
        { error: true, error_description: 'No image provided' },
        { status: 400 }
      )
    }

    // 2. Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: true, error_description: 'Invalid file type' },
        { status: 400 }
      )
    }

    // 3. Convert File to Buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 4. Convert to base64 for LLM API
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${imageFile.type};base64,${base64Image}`

    // 5. Call Grok-4-Fast API
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-vision-beta',
        messages: [
          {
            role: 'system',
            content: `You are a waste classification expert. Analyze images and return JSON with this exact structure:
{
  "error": false,
  "error_description": "",
  "summary": "Brief description of waste items",
  "parts": [
    {
      "name": "Item name",
      "separation_instruction": "One short sentence on how to prepare this item",
      "bin": "FoodScraps" | "RecyclableContainers" | "Paper" | "Garbage"
    }
  ]
}

Rules:
- bin must be exactly one of: FoodScraps, RecyclableContainers, Paper, Garbage
- separation_instruction must be ONE short sentence
- If image is unclear, set error to true with explanation`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Classify the waste items in this image.' },
              { type: 'image_url', image_url: { url: dataUrl } }
            ]
          }
        ],
        temperature: 0.3, // Lower temperature for consistent JSON
        max_tokens: 500
      })
    })

    if (!grokResponse.ok) {
      throw new Error(`Grok API error: ${grokResponse.statusText}`)
    }

    const grokData = await grokResponse.json()
    const rawResponse = grokData.choices[0]?.message?.content

    if (!rawResponse) {
      throw new Error('No response from Grok API')
    }

    // 6. Parse and validate JSON response
    const parsedResponse = JSON.parse(rawResponse)
    const validatedResponse = classificationResponseSchema.parse(parsedResponse)

    // 7. Return validated response
    return NextResponse.json(validatedResponse, { status: 200 })

  } catch (error) {
    console.error('Classification error:', error)

    return NextResponse.json(
      {
        error: true,
        error_description: error instanceof Error ? error.message : 'Classification failed',
        summary: '',
        parts: []
      },
      { status: 500 }
    )
  }
}
```

**Environment Variables** (`.env.local`):
```bash
GROK_API_KEY=your_grok_api_key_here
```

**Security Notes**:
- API key stored in environment variable (never client-side)
- File type validation prevents non-image uploads
- Buffer size implicitly limited by Next.js (default 4MB)

---

## Type Safety & Validation

### Shared Types: `/app/types/index.ts`

```typescript
export type BinType = 'FoodScraps' | 'RecyclableContainers' | 'Paper' | 'Garbage'

export interface WastePart {
  name: string
  separation_instruction: string
  bin: BinType
}

export interface ClassificationResponse {
  error: boolean
  error_description: string
  summary: string
  parts: WastePart[]
}

export interface CameraPermissionState {
  granted: boolean | null
  denied: boolean
  prompt: boolean
}
```

### Zod Validation: `/lib/validation.ts`

```typescript
import { z } from 'zod'

export const binTypeSchema = z.enum([
  'FoodScraps',
  'RecyclableContainers',
  'Paper',
  'Garbage'
])

export const wastePartSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  separation_instruction: z.string().min(1, 'Instruction is required'),
  bin: binTypeSchema
})

export const classificationResponseSchema = z.object({
  error: z.boolean(),
  error_description: z.string(),
  summary: z.string(),
  parts: z.array(wastePartSchema)
})

// Type inference from Zod schema
export type ClassificationResponse = z.infer<typeof classificationResponseSchema>
export type WastePart = z.infer<typeof wastePartSchema>
export type BinType = z.infer<typeof binTypeSchema>
```

**Benefits**:
- **Runtime Validation**: Catch API inconsistencies at runtime
- **Type Inference**: Single source of truth for types
- **Error Messages**: Zod provides detailed validation errors

---

## Component Structure

### Home Page: `/app/page.tsx`

```typescript
import CameraView from '@/components/CameraView'

export const metadata = {
  title: 'Rubbish App - Waste Classifier',
  description: 'Point your camera at waste items to classify them',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
}

export default function HomePage() {
  return (
    <main className="camera-page">
      <CameraView />
    </main>
  )
}
```

### Camera Component: `/components/CameraView.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCameraStream } from '@/lib/camera-utils'
import { compressImage } from '@/lib/image-compression'

export default function CameraView() {
  const router = useRouter()
  const { videoRef, error, isLoading, hasPermission, captureImage } = useCameraStream()
  const [isCapturing, setIsCapturing] = useState(false)

  async function handleCapture() {
    try {
      setIsCapturing(true)

      // 1. Capture image from video stream
      const imageBlob = await captureImage()

      // 2. Compress image client-side
      const compressedBlob = await compressImage(imageBlob)

      // 3. Upload to API
      const formData = new FormData()
      formData.append('image', compressedBlob, 'capture.jpg')

      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Classification failed')
      }

      const data = await response.json()

      // 4. Navigate to suggestions page with data
      // Store in sessionStorage for suggestions page
      sessionStorage.setItem('classificationResult', JSON.stringify(data))
      router.push('/suggestions')

    } catch (err) {
      console.error('Capture error:', err)
      alert('Failed to capture and classify image')
    } finally {
      setIsCapturing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="camera-loading">
        <div className="spinner" />
        <p>Initializing camera...</p>
      </div>
    )
  }

  if (error || !hasPermission) {
    return (
      <div className="camera-error">
        <h2>Camera Access Required</h2>
        <p>{error?.message || 'Please allow camera access to continue'}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="camera-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-preview"
      />

      <div className="camera-overlay">
        <div className="capture-hint">
          Point camera at waste items
        </div>

        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="capture-button"
          aria-label="Capture photo"
        >
          {isCapturing ? (
            <div className="capture-spinner" />
          ) : (
            <div className="capture-icon" />
          )}
        </button>
      </div>
    </div>
  )
}
```

### Suggestions Page: `/app/suggestions/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClassificationResponse } from '@/app/types'
import { classificationResponseSchema } from '@/lib/validation'

export default function SuggestionsPage() {
  const router = useRouter()
  const [data, setData] = useState<ClassificationResponse | null>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem('classificationResult')

    if (!storedData) {
      router.push('/')
      return
    }

    try {
      const parsedData = JSON.parse(storedData)
      const validated = classificationResponseSchema.parse(parsedData)
      setData(validated)
    } catch (error) {
      console.error('Invalid classification data:', error)
      router.push('/')
    }
  }, [router])

  if (!data) {
    return <div className="suggestions-loading">Loading...</div>
  }

  if (data.error) {
    return (
      <div className="error-container">
        <h2>Classification Error</h2>
        <p>{data.error_description}</p>
        <button onClick={() => router.push('/')}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="suggestions-container">
      <header className="suggestions-header">
        <button onClick={() => router.push('/')} className="back-button">
          ← Back
        </button>
        <h1>Waste Classification</h1>
      </header>

      <section className="summary-section">
        <p className="summary-text">{data.summary}</p>
      </section>

      <section className="parts-section">
        {data.parts.map((part, index) => (
          <article key={index} className={`waste-card bin-${part.bin.toLowerCase()}`}>
            <div className="waste-card-header">
              <h3>{part.name}</h3>
              <span className="bin-badge">{formatBinType(part.bin)}</span>
            </div>
            <p className="instruction">{part.separation_instruction}</p>
          </article>
        ))}
      </section>

      <footer className="suggestions-footer">
        <button onClick={() => router.push('/')} className="new-scan-button">
          Scan Another Item
        </button>
      </footer>
    </div>
  )
}

function formatBinType(bin: string): string {
  return bin.replace(/([A-Z])/g, ' $1').trim()
}
```

---

## Styling Guidelines

### Global Styles: `/app/globals.css`

```css
/* ========================================
   CSS RESET & VARIABLES
   ======================================== */

:root {
  /* Color Palette */
  --color-primary: #10b981;
  --color-primary-dark: #059669;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;

  /* Bin Colors */
  --bin-foodscraps: #10b981;
  --bin-recyclablecontainers: #3b82f6;
  --bin-paper: #f59e0b;
  --bin-garbage: #6b7280;

  /* Spacing Scale */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --text-xs: clamp(0.75rem, 1.5vw + 0.5rem, 0.875rem);
  --text-sm: clamp(0.875rem, 1.5vw + 0.5rem, 1rem);
  --text-base: clamp(1rem, 2vw + 0.5rem, 1.125rem);
  --text-lg: clamp(1.125rem, 2vw + 0.5rem, 1.5rem);
  --text-xl: clamp(1.5rem, 3vw + 0.5rem, 2rem);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Z-index Scale */
  --z-base: 1;
  --z-overlay: 10;
  --z-modal: 100;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden; /* Prevent scrolling on camera page */
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* ========================================
   CAMERA PAGE STYLES
   ======================================== */

.camera-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.camera-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
}

.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Fill viewport while maintaining aspect ratio */
  display: block;
}

/* Camera Overlay UI */
.camera-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-lg);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.capture-hint {
  color: white;
  font-size: var(--text-lg);
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: var(--space-sm);
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

/* Capture Button */
.capture-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.capture-button:active {
  transform: scale(0.9);
}

.capture-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.capture-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
}

.capture-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Loading States */
.camera-loading,
.camera-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  text-align: center;
}

.camera-error h2 {
  font-size: var(--text-xl);
  color: var(--color-error);
}

.camera-error p {
  font-size: var(--text-base);
  color: var(--color-text-light);
  max-width: 400px;
}

.camera-error button {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: var(--text-base);
  cursor: pointer;
  min-height: 44px; /* Touch-friendly */
  min-width: 120px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-bg-secondary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ========================================
   SUGGESTIONS PAGE STYLES
   ======================================== */

.suggestions-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Allow scrolling on suggestions page */
}

.suggestions-header {
  position: sticky;
  top: 0;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  z-index: var(--z-overlay);
}

.back-button {
  background: none;
  border: none;
  font-size: var(--text-lg);
  color: var(--color-text);
  cursor: pointer;
  padding: var(--space-xs);
  min-height: 44px;
  min-width: 44px;
}

.suggestions-header h1 {
  font-size: var(--text-xl);
  font-weight: 600;
}

/* Summary Section */
.summary-section {
  padding: var(--space-lg);
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid #e5e7eb;
}

.summary-text {
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-text);
}

/* Waste Cards */
.parts-section {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  flex: 1;
}

.waste-card {
  background-color: white;
  border-radius: 12px;
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--color-text);
}

.waste-card.bin-foodscraps {
  border-left-color: var(--bin-foodscraps);
}

.waste-card.bin-recyclablecontainers {
  border-left-color: var(--bin-recyclablecontainers);
}

.waste-card.bin-paper {
  border-left-color: var(--bin-paper);
}

.waste-card.bin-garbage {
  border-left-color: var(--bin-garbage);
}

.waste-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  gap: var(--space-sm);
}

.waste-card h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.bin-badge {
  font-size: var(--text-xs);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-light);
}

.waste-card.bin-foodscraps .bin-badge {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--bin-foodscraps);
}

.waste-card.bin-recyclablecontainers .bin-badge {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--bin-recyclablecontainers);
}

.waste-card.bin-paper .bin-badge {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--bin-paper);
}

.waste-card.bin-garbage .bin-badge {
  background-color: rgba(107, 114, 128, 0.1);
  color: var(--bin-garbage);
}

.instruction {
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-text-light);
}

/* Footer */
.suggestions-footer {
  padding: var(--space-lg);
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

.new-scan-button {
  width: 100%;
  padding: var(--space-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
  transition: background-color 0.2s ease;
}

.new-scan-button:active {
  background-color: var(--color-primary-dark);
}

/* ========================================
   ANIMATIONS
   ======================================== */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========================================
   RESPONSIVE BREAKPOINTS
   ======================================== */

/* Mobile-first base styles above */

/* Tablet (768px+) */
@media (min-width: 768px) {
  .parts-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }

  .summary-section {
    padding: var(--space-xl);
  }

  .capture-button {
    width: 100px;
    height: 100px;
  }

  .capture-icon {
    width: 75px;
    height: 75px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .suggestions-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .parts-section {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ========================================
   ACCESSIBILITY
   ======================================== */

/* Focus styles for keyboard navigation */
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .waste-card {
    border: 2px solid currentColor;
  }
}
```

---

## Mobile Optimization

### Performance Best Practices

#### 1. Image Optimization
```typescript
// Already handled by browser-image-compression
// - Max 1280px width
// - JPEG format (smaller than PNG)
// - EXIF stripped
// - Quality: 85%
```

#### 2. Route Prefetching
```tsx
// Next.js automatically prefetches routes on <Link> hover
// For this app, use router.push() for navigation
// Suggestions page loads instantly via sessionStorage
```

#### 3. Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
  - Camera loads immediately (no images to fetch)
- **CLS** (Cumulative Layout Shift): < 0.1
  - Fixed viewport prevents layout shifts
- **INP** (Interaction to Next Paint): < 200ms
  - Client-side compression in Web Worker

#### 4. Bundle Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Optimize images (not needed for this app)
  images: {
    unoptimized: true
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['browser-image-compression']
  }
}

module.exports = nextConfig
```

### Mobile UX Patterns

#### 1. Touch Target Sizes
```css
/* Minimum 44x44px for touch targets (Apple HIG) */
button {
  min-height: 44px;
  min-width: 44px;
}

/* Primary CTA: 48x48px */
.capture-button {
  width: 80px;
  height: 80px;
}
```

#### 2. Viewport Configuration
```tsx
// app/layout.tsx metadata
export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // Prevent zoom on double-tap
    userScalable: false // Disable pinch-zoom on camera page
  }
}
```

#### 3. Safe Area Support (iOS Notch)
```css
/* Add padding for iPhone notch/Dynamic Island */
.camera-overlay {
  padding-top: max(var(--space-lg), env(safe-area-inset-top));
  padding-bottom: max(var(--space-lg), env(safe-area-inset-bottom));
}
```

---

## Security & Privacy

### 1. Camera Permission Best Practices

**Timing**: Request permission only when user taps "Start Camera" (not on page load)

**Error Handling**:
```typescript
// Inform user about permission denial
if (error?.type === 'NotAllowedError') {
  return (
    <div className="permission-denied">
      <h2>Camera Access Denied</h2>
      <p>To use this app, please:</p>
      <ol>
        <li>Go to your browser settings</li>
        <li>Find site permissions</li>
        <li>Enable camera access for this site</li>
      </ol>
    </div>
  )
}
```

**Stream Cleanup**: Always stop camera tracks when unmounting
```typescript
useEffect(() => {
  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }
}, [])
```

### 2. HTTPS Requirements

getUserMedia **requires HTTPS** or `localhost`. Deploy to:
- Vercel (automatic HTTPS)
- Netlify (automatic HTTPS)
- Custom domain with SSL certificate

### 3. Data Privacy

**EXIF Stripping**: Remove GPS, device info, timestamps
```typescript
preserveExif: false // in browser-image-compression options
```

**No Server Storage**: Images processed in memory only (no disk writes)

**API Key Security**: Never expose API keys client-side
```typescript
// ❌ NEVER do this
const API_KEY = 'sk-xxx' // Client can see this

// ✅ Always use environment variables
process.env.GROK_API_KEY // Server-side only
```

### 4. Content Security Policy (CSP)

```typescript
// app/layout.tsx
export const metadata = {
  other: {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      media-src 'self' blob:;
      connect-src 'self' https://api.x.ai;
    `.replace(/\s+/g, ' ')
  }
}
```

---

## Testing Strategy

### 1. Manual Testing Checklist

#### Camera Functionality
- [ ] Camera initializes on page load
- [ ] Rear camera is selected by default
- [ ] Video stream displays without distortion
- [ ] Capture button is responsive
- [ ] Camera stream stops when navigating away

#### Permissions
- [ ] Permission prompt appears on first visit
- [ ] Graceful error if permission denied
- [ ] Settings instructions shown if blocked
- [ ] Camera reconnects after permission granted

#### Image Processing
- [ ] Image captured successfully
- [ ] Compression reduces file size
- [ ] EXIF data stripped
- [ ] Upload to API completes

#### API Integration
- [ ] /api/classify returns valid JSON
- [ ] Error responses handled gracefully
- [ ] Loading states shown during upload
- [ ] Timeout handling (30s max)

#### Suggestions Page
- [ ] Results display correctly
- [ ] Bin badges have correct colors
- [ ] "Back" button returns to camera
- [ ] "Scan Another" button works
- [ ] sessionStorage cleared on new scan

#### Mobile-Specific
- [ ] iOS Safari: Camera works
- [ ] iOS Chrome: Shows "Safari only" message
- [ ] Android Chrome: Camera works
- [ ] Landscape orientation handled
- [ ] Safe area insets respected (iPhone)

### 2. Browser Testing Matrix

| Device | Browser | Expected Result |
|--------|---------|-----------------|
| iPhone 13 | Safari 17+ | ✅ Full functionality |
| iPhone 13 | Chrome | ⚠️ No camera (show fallback) |
| Pixel 7 | Chrome | ✅ Full functionality |
| Pixel 7 | Firefox | ✅ Full functionality |
| iPad Pro | Safari | ✅ Full functionality |
| Desktop | Any | ⚠️ Show "Mobile only" message |

### 3. E2E Testing (Playwright)

```typescript
// tests/camera-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Camera Capture Flow', () => {
  test('should capture and classify waste', async ({ page, context }) => {
    // Grant camera permission
    await context.grantPermissions(['camera'])

    await page.goto('http://localhost:3000')

    // Wait for camera to initialize
    await expect(page.locator('video')).toBeVisible()

    // Click capture button
    await page.click('.capture-button')

    // Wait for classification
    await expect(page).toHaveURL('/suggestions')

    // Verify results displayed
    await expect(page.locator('.summary-text')).toBeVisible()
    await expect(page.locator('.waste-card')).toHaveCount.greaterThan(0)
  })
})
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Environment variables set in hosting platform
  - `GROK_API_KEY`
- [ ] Build succeeds locally: `npm run build`
- [ ] TypeScript errors resolved: `npm run type-check`
- [ ] ESLint warnings fixed: `npm run lint`
- [ ] Test on real mobile devices (iOS Safari, Android Chrome)
- [ ] Verify HTTPS enabled (required for camera)
- [ ] Check bundle size: `npx next build --analyze`

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add GROK_API_KEY
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

### Post-Deployment

- [ ] Test camera on deployed URL (HTTPS)
- [ ] Verify API classification works
- [ ] Check mobile performance (Lighthouse)
- [ ] Test on multiple devices
- [ ] Monitor error logs (Vercel/Netlify dashboard)

### Performance Targets

- **Lighthouse Mobile Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 200KB (gzipped)

---

## Troubleshooting Guide

### Common Issues

#### 1. Camera Not Working on iOS Chrome
**Symptom**: getUserMedia is undefined
**Solution**: iOS Chrome uses WKWebView (no camera access). Show message to use Safari.

```tsx
if (!navigator.mediaDevices?.getUserMedia) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
  return (
    <div>
      {isIOS ? (
        <p>Please open this app in Safari to use the camera.</p>
      ) : (
        <p>Your browser doesn't support camera access.</p>
      )}
    </div>
  )
}
```

#### 2. OverconstrainedError
**Symptom**: Camera fails with facingMode constraint
**Solution**: Use `ideal` instead of `exact` for facingMode

```typescript
facingMode: { ideal: 'environment' } // ✅ Fallback to front camera if needed
facingMode: { exact: 'environment' } // ❌ Fails if rear camera unavailable
```

#### 3. CORS Error on API Route
**Symptom**: Fetch fails with CORS error
**Solution**: Next.js API routes automatically handle CORS. Check if `/api` route is correct.

#### 4. Image Too Large (413 Payload Too Large)
**Symptom**: Upload fails for large images
**Solution**: Increase Next.js body size limit

```javascript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
```

#### 5. Camera Black Screen on Android
**Symptom**: Video element shows black screen
**Solution**: Check if another app is using the camera. Close and retry.

---

## Next Steps

1. **Set Up Project**: Run installation commands
2. **Create Base Structure**: Set up folder structure
3. **Implement Camera**: Start with `/lib/camera-utils.ts` and `CameraView.tsx`
4. **Build API Route**: Create `/api/classify/route.ts`
5. **Add Validation**: Implement Zod schemas
6. **Style Components**: Centralize all CSS in `globals.css`
7. **Test Locally**: Test on real mobile device via ngrok or local network
8. **Deploy**: Push to Vercel/Netlify
9. **Final Testing**: Test on deployed URL with multiple devices

---

## Sources & References

### Official Documentation
1. **Next.js 15 App Router**: https://nextjs.org/docs/app
2. **MDN getUserMedia**: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
3. **Zod Documentation**: https://zod.dev/
4. **ReactBits Library**: https://reactbits.dev/
5. **browser-image-compression**: https://www.npmjs.com/package/browser-image-compression

### Key Research Findings
- **Mobile Camera Best Practices (2025)**: iOS Safari is the ONLY browser supporting getUserMedia on iOS
- **TypeScript MediaStream Types**: `facingMode` constraint typed as `ConstrainDOMString`
- **Image Compression**: `preserveExif: false` reduces file size by 50-200KB and protects privacy
- **Next.js 15 Changes**: GET route handlers are no longer cached by default
- **Permission UX**: Request camera access contextually (when user taps "Start"), not on page load

### Version Information
- **Next.js**: 15.x (latest stable as of Oct 2025)
- **React**: 19.x (ships with Next.js 15)
- **TypeScript**: 5.x
- **Zod**: 3.23.x
- **Tailwind CSS**: 3.4.x
- **browser-image-compression**: 2.0.x

---

**Document Version**: 1.0
**Last Updated**: October 22, 2025
**Author**: Claude Code (Anthropic)
**License**: MIT
