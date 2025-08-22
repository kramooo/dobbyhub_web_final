import type { Metadata } from 'next'
import '@fontsource/geist-mono'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProfileProvider } from '@/contexts/ProfileContext'

import Header from '@/components/layout/header'
import FooterWrapper from '@/components/layout/footerWrapper'

export const metadata: Metadata = {
  title: 'DobbyHub - World\'s First Loyal and Most Free LLMs',
  description: 'Chat with Dobby and explore community-built AI apps. World\'s First Loyal and Most Free LLMs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ProfileProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <FooterWrapper />
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
