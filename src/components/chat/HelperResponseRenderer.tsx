'use client'

import type { TweetGeneratorResponse, TokenAnalysisResponse, CryptoResearchResponse, BlockchainEducatorResponse } from '@/types'
import { parseHelperResponse } from './helpers/shared-utils'
import { FallbackRenderer, RenderingErrorFallback } from './helpers/FallbackRenderer'
import { TweetGeneratorRenderer } from './helpers/TweetGeneratorRenderer'
import { TokenAnalysisRenderer } from './helpers/TokenAnalysisRenderer'
import { CryptoResearchRenderer } from './helpers/CryptoResearchRenderer'
import { BlockchainEducatorRenderer } from './helpers/BlockchainEducatorRenderer'

interface HelperResponseRendererProps {
  helperType: string
  parsedResponse: any
  rawMessage: string
}

export function HelperResponseRenderer({ helperType, parsedResponse, rawMessage }: HelperResponseRendererProps) {
  // Debug: Log all the data we receive
  console.log('HelperResponseRenderer received:', {
    helperType,
    parsedResponse,
    rawMessage: rawMessage?.substring(0, 200) + '...' // Show more content for debugging
  })
  
  // Additional debug info
  console.log('parsedResponse type:', typeof parsedResponse)
  console.log('parsedResponse keys:', parsedResponse ? Object.keys(parsedResponse) : 'null')

  // Enhanced parsing logic
  let responseData = parsedResponse
  let parseError: string | null = null

  // Check if parsedResponse has a nested message structure
  if (parsedResponse && typeof parsedResponse === 'object' && parsedResponse.message && !parsedResponse.tweet && !parsedResponse.analysis && !parsedResponse.research && !parsedResponse.education) {
    // This looks like a nested structure, try to parse the message content
    const parseResult = parseHelperResponse(parsedResponse.message, helperType)
    responseData = parseResult.data
    parseError = parseResult.error
  }
  // If no parsed response, try to parse from raw message
  else if (!responseData && rawMessage) {
    const parseResult = parseHelperResponse(rawMessage, helperType)
    responseData = parseResult.data
    parseError = parseResult.error
  }

  // If still no data and no helper type, show raw message
  if (!responseData && !helperType) {
    console.log('No parsed response or helper type, showing raw message')
    return <FallbackRenderer rawMessage={rawMessage} />
  }

  // If parsing failed, show enhanced error message
  if (!responseData && parseError) {
    return <FallbackRenderer helperType={helperType} rawMessage={rawMessage} error={parseError} />
  }

  // Final safety check - if responseData is still invalid, show raw message with helper context
  if (!responseData) {
    return <FallbackRenderer helperType={helperType} rawMessage={rawMessage} />
  }

  console.log('Using responseData:', responseData)

  try {
    switch (helperType) {
      case 'tweet-generator':
        return <TweetGeneratorRenderer data={responseData as TweetGeneratorResponse} />
      
      case 'token-analysis':
        return <TokenAnalysisRenderer data={responseData as TokenAnalysisResponse} />
      
      case 'crypto-research':
        return <CryptoResearchRenderer data={responseData as CryptoResearchResponse} />
      
      case 'blockchain-educator':
        return <BlockchainEducatorRenderer data={responseData as BlockchainEducatorResponse} />
      
      default:
        return <FallbackRenderer helperType={helperType} rawMessage={rawMessage} />
    }
  } catch (error) {
    // Catch any rendering errors and show enhanced fallback
    console.error('Error rendering helper response:', error)
    return (
      <RenderingErrorFallback
        helperType={helperType}
        rawMessage={rawMessage}
        responseData={responseData}
        error={error as Error}
      />
    )
  }
}