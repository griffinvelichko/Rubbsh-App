'use client'

import { useState } from 'react'
import Link from 'next/link'

export function HowToUseModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center"
        aria-label="How to use"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              How To Use
            </h2>

            {/* Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-lg">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">
                    Take a photo of your refuse
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-lg">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">
                    Rubbsh App analyzes the image to pick apart your garbage
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-lg">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">
                    Throw away your refuse as specified by the app and contribute to a Greener World!
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By using this app you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={() => setIsOpen(false)}
                >
                  terms
                </Link>
                {' '}and{' '}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={() => setIsOpen(false)}
                >
                  privacy policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
