'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useProfile } from '@/contexts/ProfileContext'
import { Header } from '@/components/dashboard/Header'
import { Overview } from '@/components/dashboard/Overview'
import { Leaderboard } from '@/components/dashboard/Leaderboard'
import { DailyQuest } from '@/components/dashboard/DailyQuest'
import { DobbyQuote } from '@/components/dashboard/DobbyQuote'
import { DobbyHelper } from '@/components/dashboard/DobbyHelper'


export default function Dashboard() {
  const { user, loading: authLoading } = useRequireAuth()
  const { profile, loading: profileLoading } = useProfile()

  const loading = authLoading || profileLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth page
  }

  const userData = {
    name: profile?.full_name || profile?.username || user.email?.split('@')[0] || 'Player',
    email: user.email || '',
    avatar: profile?.avatar_url || undefined,
    level: 140,
    points: 6402
  }

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header Section - Full Width */}
          <Header user={userData} />

          {/* Main Content Grid - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Overview + DobbyQuote */}
            <div className="lg:col-span-3 space-y-6">
              <Overview />
              <DobbyQuote />
            </div>
            
            {/* Right Column - Daily Quest + Mini Games (expanded to fill removed 3rd column) */}
            <div className="lg:col-span-9 space-y-6">
              <DailyQuest />
              <DobbyHelper />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
