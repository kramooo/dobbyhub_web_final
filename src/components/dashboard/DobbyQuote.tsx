'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const dobbyQuotes = [
  "Dobby is free! And so are you to achieve greatness today!",
  "A wizard must help others, just as Dobby helped Harry Potter!",
  "Dobby knows the way to success - it is through hard work and friendship!",
  "Even the smallest person can make the biggest difference, just like Dobby!",
  "Dobby believes in you! Today will be a magical day!",
  "Master has given Dobby a sock... and you shall give yourself success!",
  "Dobby is happy to be here, and you should be happy to be learning!",
  "Such a beautiful place, to be with friends. Dobby is happy to be here with his friends!",
  "Dobby has no master! Dobby is a free elf, and you are free to learn!",
  "Dobby will always be there for Harry Potter, just as knowledge will always be there for you!"
]

export function DobbyQuote() {
  // Get a random quote for today (could be enhanced with actual date-based logic)
  const todayQuote = dobbyQuotes[Math.floor(Math.random() * dobbyQuotes.length)]

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 text-center">
            Dobby&apos;s Quote of the Day
          </h3>
          
          {/* Speech Bubble */}
          <div className="relative bg-white p-3 rounded-xl shadow-md border border-blue-200 max-w-full">
            <p className="text-xs text-gray-700 text-center font-medium leading-relaxed">
              &quot;{todayQuote}&quot;
            </p>
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-t-[13px] border-l-transparent border-r-transparent border-t-blue-200"></div>
              </div>
            </div>
          </div>
          
          {/* Dobby Image */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-1 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <Image
                  src="/images/prof.png"
                  alt="Dobby the House Elf"
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Magical sparkles effect */}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
            <div className="absolute -bottom-0.5 right-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          {/* Footer text */}
          <p className="text-xs text-gray-500 text-center">
            ✨ Magical inspiration ✨
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
