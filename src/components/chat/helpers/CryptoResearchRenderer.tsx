'use client'

import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import type { CryptoResearchResponse } from '@/types'

interface CryptoResearchRendererProps {
  data: CryptoResearchResponse
}

export function CryptoResearchRenderer({ data }: CryptoResearchRendererProps) {
  // Enhanced validation for crypto research data
  if (!data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Invalid Research Data</p>
            <p className="text-xs mt-1">No data received from crypto research</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data.research) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Incomplete Research Data</p>
            <p className="text-xs mt-1">Research structure is missing or malformed</p>
          </div>
        </div>
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500">Show Raw Data</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-amber-600 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h3 className="font-semibold text-lg">{data.research.project_name || 'Unknown Project'}</h3>
        <Badge variant="secondary" className="mt-1">
          {data.research.category || 'Other'}
        </Badge>
      </div>

      {/* Overview */}
      <div>
        <p className="text-sm font-medium mb-2">Overview:</p>
        <div className="text-sm text-gray-700 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          {data.research.overview || 'No overview available'}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Strengths:</p>
          <ul className="space-y-1">
            {data.research.strengths.map((strength, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Weaknesses:</p>
          <ul className="space-y-1">
            {data.research.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Analysis */}
      <div>
        <p className="text-sm font-medium mb-2">Market Analysis:</p>
        <div className="text-sm text-gray-700 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          {data.research.market_analysis}
        </div>
      </div>

      {/* Conclusion */}
      <div>
        <p className="text-sm font-medium mb-2">Conclusion:</p>
        <div className="text-sm text-gray-700 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          {data.research.conclusion}
        </div>
      </div>
    </div>
  )
}

