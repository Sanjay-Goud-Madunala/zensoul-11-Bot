'use client'

import { useEffect, useState } from 'react'

export default function ElevenLabsWidget() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if ElevenLabs script is loaded
    const checkScript = () => {
      if (typeof window !== 'undefined' && (window as any).ElevenLabsConvAI) {
        setIsLoaded(true)
      } else {
        setTimeout(checkScript, 100)
      }
    }
    checkScript()
  }, [])

  const toggleWidget = () => {
    setIsVisible(!isVisible)
  }

  return (
    <>
      {/* Voice Assistant Toggle Button */}
      <button
        onClick={toggleWidget}
        className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 z-50 group"
        aria-label="Toggle voice assistant"
      >
        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>

      {/* ElevenLabs Widget Container */}
      {isVisible && isLoaded && (
        <div className="fixed bottom-24 left-6 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Voice Assistant
              </h3>
              <button
                onClick={toggleWidget}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="w-80 h-60">
              <elevenlabs-convai 
                agent-id={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_0401k4harfa2f37t7n638b4j016c"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fallback message if script not loaded */}
      {isVisible && !isLoaded && (
        <div className="fixed bottom-24 left-6 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Voice Assistant
              </h3>
              <button
                onClick={toggleWidget}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading voice assistant...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}