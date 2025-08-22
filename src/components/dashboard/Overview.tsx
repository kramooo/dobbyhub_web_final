'use client'

import { Crown, Star, Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Overview() {
  return (
    <div className="space-y-4">
      {/* Dashboard Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Image
          src="/images/dashboard_banner.jpg"
          alt="Dashboard Banner"
          width={1200}
          height={400}
          className="w-full h-auto rounded-lg shadow-lg object-cover"
          priority
          unoptimized
        />
      </motion.div>
    </div>
  )
}
