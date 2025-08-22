'use client'

import { TokenAnalysisRenderer } from '@/components/chat/helpers/TokenAnalysisRenderer'
import { HelperResponseRenderer } from '@/components/chat/HelperResponseRenderer'

// Sample test data for Token Analysis
const sampleTokenAnalysisData = {
  analysis: {
    price_prediction: "bullish" as const,
    risk_level: "medium" as const,
    summary: "Ethereum shows strong fundamentals with active development and growing DeFi ecosystem. The upcoming merge could provide additional upward momentum.",
    key_metrics: {
      market_cap: "$200B+",
      volume: "$15B daily",
      holders: "100M+"
    },
    recommendations: [
      "Consider dollar-cost averaging for long-term positions",
      "Monitor gas fees and network upgrades",
      "Diversify across multiple blockchain assets"
    ]
  }
}

const sampleRawMessage = `{
  "analysis": {
    "price_prediction": "bullish",
    "risk_level": "medium", 
    "summary": "Ethereum shows strong fundamentals with active development and growing DeFi ecosystem. The upcoming merge could provide additional upward momentum.",
    "key_metrics": {
      "market_cap": "$200B+",
      "volume": "$15B daily", 
      "holders": "100M+"
    },
    "recommendations": [
      "Consider dollar-cost averaging for long-term positions",
      "Monitor gas fees and network upgrades", 
      "Diversify across multiple blockchain assets"
    ]
  }
}`

export function HelperDebug() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Helper Renderer Debug</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Direct TokenAnalysisRenderer Test</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <TokenAnalysisRenderer data={sampleTokenAnalysisData} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">HelperResponseRenderer with parsed data</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <HelperResponseRenderer 
            helperType="token-analysis"
            parsedResponse={sampleTokenAnalysisData}
            rawMessage={sampleRawMessage}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">HelperResponseRenderer with raw message only</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <HelperResponseRenderer 
            helperType="token-analysis"
            parsedResponse={null}
            rawMessage={sampleRawMessage}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">HelperResponseRenderer with malformed JSON</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <HelperResponseRenderer 
            helperType="token-analysis"
            parsedResponse={null}
            rawMessage="Ethereum analysis: bullish outlook with medium risk. Market cap is around $200B with strong fundamentals."
          />
        </div>
      </div>
    </div>
  )
}
