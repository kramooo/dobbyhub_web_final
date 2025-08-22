'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Twitter, Copy, Sparkles } from 'lucide-react'
import type { TweetGeneratorResponse } from '@/types'

export function TweetGeneratorDemo() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<TweetGeneratorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateTweet = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/helpers/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          helperType: 'tweet-generator',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          language: 'en'
        })
      })

      const data = await response.json()

      if (data.success && data.data.parsed) {
        setResult(data.data.parsed)
      } else {
        setError('Failed to generate tweet')
      }
    } catch (err) {
      setError('An error occurred while generating the tweet')
      console.error('Tweet generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-blue-500" />
            Tweet Generator Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              What would you like to tweet about?
            </label>
            <Textarea
              placeholder="e.g., Create a bullish tweet about Bitcoin reaching new highs"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={generateTweet} 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Tweet...
              </>
            ) : (
              <>
                <Twitter className="h-4 w-4 mr-2" />
                Generate Tweet
              </>
            )}
          </Button>

          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Tweet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tweet Content */}
            <div className="relative">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg font-medium">
                {result.tweet}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(result.tweet)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            {/* Hashtags */}
            {result.hashtags && result.hashtags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((hashtag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-blue-600 cursor-pointer"
                      onClick={() => copyToClipboard(hashtag)}
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tone */}
            {result.tone && (
              <div>
                <p className="text-sm font-medium mb-2">Tone:</p>
                <Badge className={getToneColor(result.tone)}>
                  {result.tone.charAt(0).toUpperCase() + result.tone.slice(1)}
                </Badge>
              </div>
            )}

            {/* Engagement Tips */}
            {result.engagement_tips && (
              <div>
                <p className="text-sm font-medium mb-2">Engagement Tips:</p>
                <div className="text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  {result.engagement_tips}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(result.tweet + ' ' + result.hashtags?.join(' '))}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Tweet + Hashtags
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.tweet + ' ' + result.hashtags?.join(' '))}`
                  window.open(tweetUrl, '_blank')
                }}
                className="flex-1"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Tweet Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
