'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const leaderboardData = [
  {
    id: 1,
    name: 'Salasiah P',
    points: '8,400 PTS',
    rank: 1,
    avatar: null,
    badge: 'Expert'
  },
  {
    id: 2,
    name: 'Syahru M',
    points: '7,200 PTS',
    rank: 2,
    avatar: null,
    badge: 'Pro'
  },
  {
    id: 3,
    name: 'Aditya A',
    points: '6,100 PTS',
    rank: 3,
    avatar: null,
    badge: 'Advanced'
  },
  {
    id: 4,
    name: 'M.Rafif Atmaka',
    points: '8,888 PTS',
    rank: 4,
    avatar: null,
    badge: 'Master',
    isCurrentUser: true
  }
]

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">{rank}</div>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800'
      case 2:
        return 'bg-gray-100 text-gray-800'
      case 3:
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboardData.map((user) => (
          <div 
            key={user.id} 
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              user.isCurrentUser 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              {getRankIcon(user.rank)}
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${
                  user.isCurrentUser 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                    : 'bg-gray-200'
                }`}>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${user.isCurrentUser ? 'text-blue-900' : ''}`}>
                  {user.name}
                  {user.isCurrentUser && <span className="text-blue-600 ml-1">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground">{user.points}</p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getRankBadgeColor(user.rank)}`}
            >
              {user.badge}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
