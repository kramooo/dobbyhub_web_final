'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, signOut, loading } = useAuth()

  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
              <Image 
                src="/images/dobby.png" 
                alt="Dobby Logo" 
                width={32} 
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-900 font-mono text-lg font-semibold">DobbyHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>
            <Link href="/chat" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              Chat
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-9 bg-gray-300 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm">
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
