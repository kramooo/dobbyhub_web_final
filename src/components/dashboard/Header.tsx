'use client'

import { Bell, Gift, Star, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  user: {
    name: string
    email: string
    avatar?: string
    level: number
    points: number
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <motion.div 
      className="flex flex-col gap-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >


      {/* User Profile & Notifications */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Level 0 • 0 Points</p>
          </div>
        </div>

      </div>
            {/* Top Banner */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/images/dobby_reward.png" 
              alt="Dobby Reward" 
              width={100} 
              height={100} 
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">Learn, Chat and Play with Dobby!</h1>
              <p className="text-sm opacity-90">
                Know more about Sentient's mission by interacting with Dobby, the world's first loyal and free LLM.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/chat">
              <ShimmerButton
                shimmerColor="#8B5CF6"
                background="rgb(234 88 12)"
                className="text-white px-4 py-2 text-sm"
              >
                Chat with Dobby
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
