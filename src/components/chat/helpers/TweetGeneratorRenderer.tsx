'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Twitter, AlertTriangle } from 'lucide-react'
import type { TweetGeneratorResponse } from '@/types'
import { copyToClipboard, openTwitterIntent } from './shared-utils'

interface TweetGeneratorRendererProps {
  data: TweetGeneratorResponse
}

export function TweetGeneratorRenderer({ data }: TweetGeneratorRendererProps) {
  // Debug: Log the data to see what we're actually getting
  console.log('TweetGeneratorRenderer received data:', data)
  console.log('Data type:', typeof data)
  console.log('Data keys:', data ? Object.keys(data) : 'null/undefined')

  const getToneColor = (tone: string) => {
    switch (tone?.toLowerCase()) {
      case 'bullish':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'bearish':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'humorous':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // Enhanced validation for tweet data
  if (!data || typeof data !== 'object') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Invalid Tweet Data</p>
            <p className="text-xs mt-1">Received invalid or empty tweet response</p>
          </div>
        </div>
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500">Show Raw Data</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-red-600 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  const tweet = data.tweet || 'No tweet content found'
  const hashtags = Array.isArray(data.hashtags) ? data.hashtags : []
  const tone = data.tone || 'neutral'
  const fullTweet = `${tweet} ${hashtags.join(' ')}`

  // Additional debugging for the specific issue
  if (tweet === 'No tweet content found') {
    console.warn('Tweet content not found in data:', {
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
      tweetValue: data?.tweet,
      rawData: data
    })
  }

  return (
    <div className="space-y-4">
      {/* Tweet Content */}
      <div className="relative">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg font-medium border border-blue-200 dark:border-blue-800">
          {tweet}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2"
          onClick={() => copyToClipboard(tweet)}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      {/* Hashtags */}
      {hashtags && hashtags.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Hashtags:</p>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-blue-600 cursor-pointer hover:bg-blue-100"
                onClick={() => copyToClipboard(hashtag)}
              >
                {hashtag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tone */}
      {tone && (
        <div>
          <p className="text-sm font-medium mb-2">Tone:</p>
          <Badge className={getToneColor(tone)}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </Badge>
        </div>
      )}

      {/* Engagement Tips */}
      {data.engagement_tips && (
        <div>
          <p className="text-sm font-medium mb-2">Engagement Tips:</p>
          <div className="text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            {data.engagement_tips}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => copyToClipboard(fullTweet)}
          className="flex-1"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Tweet
        </Button>
        <Button
          variant="outline"
          onClick={() => openTwitterIntent(fullTweet)}
          className="flex-1"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Tweet Now
        </Button>
      </div>
    </div>
  )
}

