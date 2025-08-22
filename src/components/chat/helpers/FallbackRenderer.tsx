'use client'

import { AlertTriangle } from 'lucide-react'

interface FallbackRendererProps {
  helperType?: string
  rawMessage: string
  error?: string | null
  showDebugInfo?: boolean
  responseData?: any
}

export function FallbackRenderer({ 
  helperType, 
  rawMessage, 
  error, 
  showDebugInfo = false, 
  responseData 
}: FallbackRendererProps) {
  // If no helper type and no error, show raw message
  if (!helperType && !error) {
    return (
      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {rawMessage}
      </div>
    )
  }

  // If parsing failed, show enhanced error message
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">JSON Parsing Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Raw AI Response:</p>
          <div className="whitespace-pre-wrap text-gray-800 text-sm p-3 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
            {rawMessage}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded border border-blue-200">
          💡 <strong>Tip:</strong> This usually happens when the AI response contains malformed JSON. 
          Try rephrasing your question or asking the helper to regenerate the response.
        </div>
      </div>
    )
  }

  // Unknown helper type fallback
  if (helperType) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span>Unknown helper type: {helperType}</span>
        </div>
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-lg border">
          {rawMessage}
        </div>
      </div>
    )
  }

  // Generic fallback with helper context
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <AlertTriangle className="h-4 w-4" />
        <span>Helper response could not be parsed - showing raw output</span>
      </div>
      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-lg border">
        {rawMessage}
      </div>
    </div>
  )
}

interface RenderingErrorFallbackProps {
  helperType: string
  rawMessage: string
  responseData: any
  error: Error
}

export function RenderingErrorFallback({ 
  helperType, 
  rawMessage, 
  responseData, 
  error 
}: RenderingErrorFallbackProps) {
  const errorMessage = error.message || 'Unknown error'
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Rendering Error</p>
          <p className="text-xs mt-1">Failed to render {helperType} response: {errorMessage}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Raw AI Response:</p>
        <div className="whitespace-pre-wrap text-gray-800 text-sm p-3 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
          {rawMessage}
        </div>
      </div>
      
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">Show Debug Information</summary>
        <div className="mt-2 p-3 bg-gray-100 rounded border">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Error:</span>
              <pre className="text-red-600 text-xs mt-1 overflow-auto">{errorMessage}</pre>
            </div>
            <div>
              <span className="font-medium">Parsed Data:</span>
              <pre className="text-xs mt-1 overflow-auto">{JSON.stringify(responseData, null, 2)}</pre>
            </div>
            <div>
              <span className="font-medium">Helper Type:</span>
              <span className="text-xs ml-2">{helperType}</span>
            </div>
          </div>
        </div>
      </details>
      
      <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded border border-blue-200">
        💡 <strong>Tip:</strong> This error occurred while trying to display the {helperType} response. 
        The data structure may not match what's expected. Try asking the helper to regenerate the response.
      </div>
    </div>
  )
}

