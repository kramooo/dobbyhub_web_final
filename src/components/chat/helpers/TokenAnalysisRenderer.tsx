'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import type { TokenAnalysisResponse } from '@/types'

interface TokenAnalysisRendererProps {
  data: TokenAnalysisResponse
}

export function TokenAnalysisRenderer({ data }: TokenAnalysisRendererProps) {
  // Enhanced validation for token analysis data
  if (!data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Invalid Token Analysis</p>
            <p className="text-xs mt-1">No data received from token analysis</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data.analysis) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Incomplete Analysis Data</p>
            <p className="text-xs mt-1">Analysis structure is missing or malformed</p>
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

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getPredictionIcon(data.analysis.price_prediction)}
          <span className="font-semibold capitalize">{data.analysis.price_prediction} Outlook</span>
        </div>
        <Badge className={getRiskColor(data.analysis.risk_level)}>
          {data.analysis.risk_level.toUpperCase()} Risk
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-1">Market Cap</p>
          <p className="text-sm">{data.analysis.key_metrics.market_cap}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-1">Volume</p>
          <p className="text-sm">{data.analysis.key_metrics.volume}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-1">Holders</p>
          <p className="text-sm">{data.analysis.key_metrics.holders}</p>
        </div>
      </div>

      {/* Summary */}
      <div>
        <p className="text-sm font-medium mb-2">Analysis Summary:</p>
        <div className="text-sm text-gray-700 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          {data.analysis.summary}
        </div>
      </div>

      {/* Recommendations */}
      {data.analysis.recommendations && data.analysis.recommendations.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Recommendations:</p>
          <ul className="space-y-1">
            {data.analysis.recommendations.map((rec, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

