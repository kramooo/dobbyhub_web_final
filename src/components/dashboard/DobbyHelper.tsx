'use client'

import { useState, useEffect } from 'react'
import { Play, Bot, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/magicui/border-beam'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { DobbyHelperType } from '@/types'

interface DobbyHelperProps {
  onHelperSelect?: (helper: DobbyHelperType) => void
}

export function DobbyHelper({ onHelperSelect }: DobbyHelperProps) {
  const router = useRouter()
  const [helpers, setHelpers] = useState<DobbyHelperType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHelpers()
  }, [])

  const fetchHelpers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/helpers')
      const data = await response.json()
      
      if (data.success) {
        setHelpers(data.data)
      } else {
        setError('Failed to load helpers')
      }
    } catch (err) {
      setError('Failed to load helpers')
      console.error('Error fetching helpers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleHelperClick = (helper: DobbyHelperType) => {
    if (onHelperSelect) {
      onHelperSelect(helper)
    } else {
      // Navigate to chat page with selected helper
      const searchParams = new URLSearchParams({
        helper: helper.id,
        helperName: helper.name,
        helperDisplayName: helper.display_name
      })
      router.push(`/chat?${searchParams.toString()}`)
    }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dobby Helpers</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-48 animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dobby Helpers</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchHelpers} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dobby Helpers</h2>
      <div className="grid grid-cols-2 gap-4">
        {helpers.map((helper, index) => (
          <motion.div
            key={helper.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden relative hover:scale-105 cursor-pointer">
              <BorderBeam 
                size={80} 
                duration={8} 
                colorFrom="#8B5CF6" 
                colorTo="#EC4899" 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className={`h-32 bg-gradient-to-br ${helper.color_from} ${helper.color_to} flex items-center justify-center text-4xl relative`}>
                {helper.icon}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={() => handleHelperClick(helper)}
                  >
                    <Bot className="h-4 w-4 mr-1" />
                    Use Helper
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{helper.display_name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {helper.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Instant
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleHelperClick(helper)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Start Helper
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
