'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { ShineBorder } from '@/components/magicui/shine-border'
import { PulsatingButton } from '@/components/magicui/pulsating-button'
import { DisclaimerModal, useFirstVisitModal } from '@/components/ui/disclaimer-modal'
import Link from 'next/link'

export default function Home() {
  const { isModalOpen, closeModal } = useFirstVisitModal()

  return (
    <div>
      <DisclaimerModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Meet Dobby<br />
              </h1>
              <p className="text-xl text-gray-600 mb-8">
              World's First Loyal and Most Free LLMs
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/auth">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white">
                  Get started
                </Button>
              </Link>
              <a href="https://www.sentient.xyz/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  Learn more
                </Button> 
              </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/page_banner.jpg"
                  alt="DobbyHub Platform Preview"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute top-2 right-2">
                  <PulsatingButton 
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded-md"
                    pulseColor="#f97316"
                    duration="2s"
                  >
                    @0xTNT888
                  </PulsatingButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              DobbyHub
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              All in one platform for Dobby<br />
              Create Account and start chatting with Dobby
            </p>
            <Link href="/chat">
              <Button className="mb-8 bg-orange-600 hover:bg-orange-500 text-white" size="lg">
               Chat Now
              </Button>
            </Link>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/dobby_chat.png"
                  alt="Dobby Chat Interface"
                  width={1000 }
                  height={600}
                  className="rounded-2xl shadow-2xl object-cover"
                />
                <ShineBorder
                  className="absolute inset-0"
                  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  borderWidth={3}
                  duration={8}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Apps Productivity Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore<br />Dobby Helper Apps
            </h2>
            <p className="text-lg text-gray-600">
              Explore the Dobby Helper Apps and start using them today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain Educator</h3>
              <p className="text-sm text-gray-600 mb-4">Learn blockchain concepts explained at multiple comprehension levels from child to expert</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Crypto Research</h3>
              <p className="text-sm text-gray-600 mb-4">Research cryptocurrency projects and market trends</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Token Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">Analyze cryptocurrency tokens and provide insights</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tweet Generator</h3>
              <p className="text-sm text-gray-600 mb-4">Generate engaging tweets for crypto and Web3 topics</p>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 px-6"	>
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-3xl text-white">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Join Dobby Community today
                </h2>
                <p className="text-lg opacity-90 mb-6">
                  Community-aligned. Community-owned. Community-controlled.
                </p>
                
                {/* Useful Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 opacity-90">Useful Links</h3>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://www.sentient.xyz/" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-300 hover:text-orange-200 underline">
                      Website
                    </a>
                    <a href="https://huggingface.co/SentientAGI" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-300 hover:text-orange-200 underline">
                      Hugging Face
                    </a>
                    <a href="https://github.com/sentient-agi/" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-300 hover:text-orange-200 underline">
                      GitHub
                    </a>
                    <a href="https://discord.gg/sentientfoundation" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-300 hover:text-orange-200 underline">
                      Discord
                    </a>
                    <a href="https://x.com/SentientAGI" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-300 hover:text-orange-200 underline">
                      X (Twitter)
                    </a>
                  </div>
                </div>
              </div>
              <div className="h-full">
                <div className="relative h-full min-h-[300px]">
                  <Image
                    src="/images/cta.png"
                    alt="Sentient Community"
                    fill
                    className="rounded-r-2xl object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2">
                    <PulsatingButton 
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded-md"
                      pulseColor="#f97316"
                      duration="2s"
                    >
                      @EVE88_X
                    </PulsatingButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
