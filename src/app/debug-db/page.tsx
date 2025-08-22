'use client'

import { useEffect, useState } from 'react'
import { chatDB } from '@/lib/database/chat'

export default function DebugDbPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const convs = await chatDB.getConversations()
      console.log('Raw conversations from DB:', convs)
      setConversations(convs)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (id: string) => {
    try {
      const conv = await chatDB.getConversation(id)
      console.log('Full conversation data:', conv)
      setSelectedConversation(conv)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Database Debug</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Conversations Summary</h2>
        <div className="grid gap-2">
          {conversations.map((conv) => (
            <div key={conv.id} className="p-3 border rounded bg-gray-50">
              <div className="font-medium">{conv.title}</div>
              <div className="text-sm text-gray-600">
                ID: {conv.id}<br/>
                Helper Type: <span className="font-mono bg-yellow-100 px-1">{conv.helper_type || 'null'}</span><br/>
                Messages: {conv.message_count}<br/>
                Last Message: {conv.last_message?.substring(0, 50)}...
              </div>
              <button 
                onClick={() => loadConversation(conv.id)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Load Full Data
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedConversation && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Selected Conversation Detail</h2>
          <div className="p-4 bg-gray-50 rounded">
            <div className="font-medium mb-2">Conversation: {selectedConversation.title}</div>
            <div className="text-sm space-y-1">
              <div>ID: <span className="font-mono">{selectedConversation.id}</span></div>
              <div>Helper Type: <span className="font-mono bg-yellow-100 px-1">{selectedConversation.helper_type || 'null'}</span></div>
              <div>Messages Count: {selectedConversation.messages?.length || 0}</div>
            </div>
            
            {selectedConversation.messages && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Messages:</h3>
                {selectedConversation.messages.map((msg: any) => (
                  <div key={msg.id} className="p-2 border rounded bg-white">
                    <div className="text-xs text-gray-500">
                      {msg.role} - {msg.id}
                    </div>
                    <div className="text-sm">
                      <div>Content: {msg.content.substring(0, 100)}...</div>
                      <div>Metadata: <span className="font-mono bg-blue-100 px-1">{JSON.stringify(msg.metadata || {})}</span></div>
                      <div>Helper Type from Metadata: <span className="font-mono bg-green-100 px-1">{msg.metadata?.helper_type || 'null'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
