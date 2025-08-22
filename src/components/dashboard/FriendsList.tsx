'use client'

import { MessageCircle, UserPlus, Users, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const friends = [
  {
    id: 1,
    name: 'Syahru M',
    status: 'Master',
    avatar: null,
    online: true,
    points: '7,200'
  },
  {
    id: 2,
    name: 'Zul Handayani',
    status: 'Beginner',
    avatar: null,
    online: false,
    points: '2,100'
  },
  {
    id: 3,
    name: 'Nathanael S',
    status: 'Expert',
    avatar: null,
    online: true,
    points: '5,800'
  },
  {
    id: 4,
    name: 'Salasiah Parwani',
    status: 'Pro Master',
    avatar: null,
    online: true,
    points: '8,400'
  },
  {
    id: 5,
    name: 'Satya Habie',
    status: 'Assistant',
    avatar: null,
    online: false,
    points: '3,200'
  },
  {
    id: 6,
    name: 'Ari Fianto',
    status: 'Veteran',
    avatar: null,
    online: true,
    points: '6,700'
  },
  {
    id: 7,
    name: 'Aditya Anugrah',
    status: 'Master',
    avatar: null,
    online: false,
    points: '4,900'
  },
  {
    id: 8,
    name: 'Elsa Utami',
    status: 'Expert',
    avatar: null,
    online: true,
    points: '5,300'
  },
  {
    id: 9,
    name: 'Cornelia Astuti',
    status: 'Beginner',
    avatar: null,
    online: false,
    points: '1,800'
  },
  {
    id: 10,
    name: 'Winda Namaga',
    status: 'Beginner',
    avatar: null,
    online: true,
    points: '2,400'
  },
  {
    id: 11,
    name: 'Ikhsan Andanta',
    status: 'Master',
    avatar: null,
    online: false,
    points: '7,100'
  },
  {
    id: 12,
    name: 'Kenzie Hakim',
    status: 'Veteran',
    avatar: null,
    online: true,
    points: '6,200'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Beginner':
      return 'bg-gray-100 text-gray-800'
    case 'Assistant':
      return 'bg-blue-100 text-blue-800'
    case 'Expert':
      return 'bg-green-100 text-green-800'
    case 'Veteran':
      return 'bg-purple-100 text-purple-800'
    case 'Master':
      return 'bg-orange-100 text-orange-800'
    case 'Pro Master':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function FriendsList() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Friend List
          </CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {friends.filter(f => f.online).length} online
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[700px] overflow-y-auto">
        {friends.map((friend) => (
          <div 
            key={friend.id} 
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  {friend.name.split(' ').map(n => n.charAt(0)).join('')}
                </AvatarFallback>
              </Avatar>
              {friend.online && (
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-medium text-xs truncate">{friend.name}</p>
                {friend.online && (
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1 py-0 ${getStatusColor(friend.status)}`}
                >
                  {friend.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
