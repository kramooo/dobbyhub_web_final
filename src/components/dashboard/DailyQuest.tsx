'use client'

import { CheckCircle, Circle, Gift, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

const quests = [
  {
    id: 1,
    title: 'Complete 2 Course From Your Class',
    description: 'Finish any 2 courses to earn extra points',
    progress: 50,
    maxProgress: 100,
    reward: '250 Exp',
    completed: false,
    current: '1/2 Completed'
  },
  {
    id: 2,
    title: 'Challenge 2 Friends',
    description: 'Send game invitations to 2 friends',
    progress: 100,
    maxProgress: 100,
    reward: '500 Exp',
    completed: true,
    current: '2/2 Completed'
  }
]

export function DailyQuest() {
  return (
    <Card className="relative overflow-hidden">
      {/* Transparent Blur Overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/30 backdrop-blur-sm pointer-events-none z-10"></div>
      
      {/* Coming Soon with Dobby Image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <div className="mb-4">
          <Image
            src="/images/dobby_sleeping.png"
            alt="Dobby Coming Soon"
            width={120}
            height={120}
            className="opacity-80"
          />
        </div>
        <div className="text-2xl font-bold text-gray-600/80 dark:text-gray-300/80 select-none">
          Coming Soon
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Daily Quest
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Resets in 18h 24m</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {quests.map((quest) => (
          <div key={quest.id} className="space-y-3">
            <div className="flex items-start gap-3">
              {quest.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className={`font-medium ${quest.completed ? 'text-green-900 line-through' : ''}`}>
                    {quest.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{quest.current}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Gift className="h-3 w-3 mr-1" />
                      {quest.reward}
                    </Badge>
                  </div>
                  <Progress value={quest.progress} className="h-2" />
                </div>
                
                {quest.completed && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Claim Reward
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Gift className="h-4 w-4 mr-2" />
            Claim All Rewards
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
