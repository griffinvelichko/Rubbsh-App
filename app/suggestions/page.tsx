'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ClassificationResponse } from '@/app/types'
import { classificationResponseSchema } from '@/lib/validation'

export default function SuggestionsPage() {
  const router = useRouter()
  const [data, setData] = useState<ClassificationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="suggestions-loading">
        <div className="spinner" />
        <p>Loading classification...</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  if (data.error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2>Classification Error</h2>
          <p>{data.error_description || 'Unable to classify the image'}</p>
          <button onClick={() => router.push('/')} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="suggestions-container">
      <header className="suggestions-header">
        <button
          onClick={() => router.push('/')}
          className="back-button"
          aria-label="Go back to camera"
        >
          ← Back
        </button>
        <h1>Waste Classification</h1>
      </header>

      <section className="summary-section">
        <h2 className="summary-heading">Summary</h2>
        <p className="summary-text">{data.summary}</p>
      </section>

      <section className="parts-section">
        {data.parts.map((part, index) => (
          <article
            key={index}
            className={`waste-card bin-${part.bin.toLowerCase()}`}
          >
            <div className="waste-card-header">
              <h3>{part.name}</h3>
              <span className="bin-badge">{formatBinType(part.bin)}</span>
            </div>
            <p className="instruction">{part.separation_instruction}</p>
          </article>
        ))}
      </section>

      <footer className="suggestions-footer">
        <button
          onClick={() => {
            sessionStorage.removeItem('classificationResult')
            router.push('/')
          }}
          className="new-scan-button"
        >
          Scan Another Item
        </button>
      </footer>
    </div>
  )
}

function formatBinType(bin: string): string {
  // Convert "FoodScraps" to "Food Scraps"
  return bin.replace(/([A-Z])/g, ' $1').trim()
}
