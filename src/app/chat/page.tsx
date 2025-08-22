'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Link from 'next/link'
import Image from 'next/image'
import { Send, User, Bot, Plus, MessageSquare, Search, Clock, Trash2, Sparkles, X } from 'lucide-react'
import { chatDB, type ConversationSummary, type Message as DBMessage, type Conversation as DBConversation } from '@/lib/database/chat'
import { dobbyHelpersDB } from '@/lib/database/dobby-helpers'
import type { DobbyHelperType, DobbyHelperSessionSummary } from '@/types'
import { Badge } from '@/components/ui/badge'
import { HelperResponseRenderer } from '@/components/chat/HelperResponseRenderer'
import { useSearchParams } from 'next/navigation'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  parsed_response?: any // For helper JSON responses
  helper_type?: string // Which helper was used
}

// Component that uses useSearchParams - needs to be wrapped in Suspense
function ChatContent() {
  useRequireAuth()
  const { user, signOut, loading } = useAuth()
  const searchParams = useSearchParams()
  
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  
  // Helper-related state
  const [helpers, setHelpers] = useState<DobbyHelperType[]>([])
  const [selectedHelper, setSelectedHelper] = useState<DobbyHelperType | null>(null)
  const [showHelperSelector, setShowHelperSelector] = useState(false)
  const [helperSessions, setHelperSessions] = useState<DobbyHelperSessionSummary[]>([])
  const [currentHelperSessionId, setCurrentHelperSessionId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isLoadingConversationsRef = useRef(false)
  const hasLoadedInitialConversations = useRef(false)

  const currentConversation = conversations.find(c => c.id === currentConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen])

  // Load conversations and helpers when user is authenticated (only once)
  useEffect(() => {
    if (user && !loading && !hasLoadedInitialConversations.current && !isLoadingConversationsRef.current) {
      console.log('User authenticated, loading conversations and helpers...')
      hasLoadedInitialConversations.current = true
      loadConversations()
      loadHelpers()
    }
  }, [user, loading])

  // Handle helper selection from URL parameters
  useEffect(() => {
    if (helpers.length > 0 && searchParams) {
      const helperId = searchParams.get('helper')
      if (helperId && !selectedHelper) {
        const helper = helpers.find(h => h.id === helperId)
        if (helper) {
          console.log('Auto-selecting helper from URL:', helper.display_name)
          setSelectedHelper(helper)
          // Clear the URL parameters after selection
          if (window.history.replaceState) {
            window.history.replaceState(null, '', '/chat')
          }
        }
      }
    }
  }, [helpers, searchParams, selectedHelper])

  const loadHelpers = async () => {
    try {
      const loadedHelpers = await dobbyHelpersDB.getHelperTypes()
      setHelpers(loadedHelpers)
    } catch (error) {
      console.error('Error loading helpers:', error)
    }
  }

  const loadHelperSessions = async () => {
    try {
      const sessions = await dobbyHelpersDB.getHelperSessions()
      setHelperSessions(sessions)
    } catch (error) {
      console.error('Error loading helper sessions:', error)
    }
  }

  const loadConversations = async () => {
    if (!user || loading || isLoadingConversationsRef.current) {
      console.log('Skipping conversation load - user not ready or already loading:', { 
        user: !!user, 
        loading, 
        alreadyLoading: isLoadingConversationsRef.current 
      })
      return
    }
    
    isLoadingConversationsRef.current = true
    setIsLoadingConversations(true)
    
    try {
      const loadedConversations = await chatDB.getConversations()
      setConversations(loadedConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      isLoadingConversationsRef.current = false
      setIsLoadingConversations(false)
    }
  }

  const createNewConversation = async () => {
    if (!user || loading) {
      console.log('Cannot create conversation - user not ready')
      return
    }
    
    try {
      // DON'T create conversation immediately - just clear the state
      // Conversation will be created when user sends first message
      setCurrentConversationId(null)
      setMessages([])
      setSelectedHelper(null)
    } catch (error) {
      console.error('Error starting new chat:', error)
    }
  }

  const selectConversation = async (conversationId: string) => {
    try {
      setCurrentConversationId(conversationId)
      const conversation = await chatDB.getConversation(conversationId)
      if (conversation && conversation.messages) {
        console.log('=== CONVERSATION LOADING DEBUG ===')
        console.log('Conversation ID:', conversationId)
        console.log('Conversation helper_type:', conversation.helper_type)
        console.log('Raw conversation data:', conversation)
        
        const formattedMessages: Message[] = conversation.messages.map(msg => {
          // Extract helper metadata from the message metadata
          const metadata = msg.metadata || {}
          console.log(`Message ${msg.id} (${msg.role}):`, {
            metadata,
            helper_type_from_metadata: metadata.helper_type,
            conversation_helper_type: conversation.helper_type
          })
          
          // Use helper_type from message metadata, or fallback to conversation helper_type for assistant messages
          const messageHelperType = metadata.helper_type || 
            (msg.role === 'assistant' && conversation.helper_type ? conversation.helper_type : undefined)
          
          console.log(`Final helper_type for message ${msg.id}:`, messageHelperType)
          
          return {
            id: msg.id,
            content: msg.content,
            role: msg.role,
            timestamp: new Date(msg.created_at),
            parsed_response: metadata.parsed_response,
            helper_type: messageHelperType
          }
        })
        
        console.log('Final formatted messages:', formattedMessages.map(m => ({ 
          id: m.id,
          role: m.role, 
          helper_type: m.helper_type, 
          has_parsed: !!m.parsed_response,
          content_preview: m.content.substring(0, 50) + '...'
        })))
        console.log('=== END CONVERSATION LOADING DEBUG ===\n')
        
        setMessages(formattedMessages)
        // Clear selected helper state since we'll use the conversation's helper
        console.log('Clearing selectedHelper state for conversation:', conversationId)
        setSelectedHelper(null)
      } else {
        setMessages([])
        // Clear selected helper state
        setSelectedHelper(null)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
      setMessages([])
      setSelectedHelper(null)
    }
  }

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const success = await chatDB.deleteConversation(conversationId)
      if (success) {
        // If we're deleting the current conversation, clear it
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null)
          setMessages([])
        }
        // Refresh conversations list
        await loadConversations()
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const searchConversations = async (query: string) => {
    if (!query.trim()) {
      await loadConversations()
      return
    }
    
    try {
      const results = await chatDB.searchConversations(query)
      setConversations(results)
    } catch (error) {
      console.error('Error searching conversations:', error)
    }
  }

  // Handle search input changes with debouncing
  useEffect(() => {
    // Don't search if conversations haven't been loaded yet
    if (!hasLoadedInitialConversations.current) {
      return
    }

    const timeoutId = setTimeout(() => {
      searchConversations(searchQuery)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery]) // Only depend on searchQuery

  const getAIResponse = async (messages: Message[]): Promise<{ message: string; parsed?: any; helper_type?: string }> => {
    try {
      // Get the conversation's helper type (fallback to selectedHelper if DB migration not applied)
      const conversationHelper = currentConversation?.helper_type || selectedHelper?.name
      const helperObj = conversationHelper ? helpers.find(h => h.name === conversationHelper) : selectedHelper
      
      // Convert our message format to the API format
      const apiMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      // Choose API endpoint based on whether the conversation has a helper
      const apiEndpoint = conversationHelper ? '/api/helpers/chat' : '/api/chat'
      const requestBody = conversationHelper 
        ? {
            helperType: conversationHelper,
            messages: apiMessages,
            language: 'en'
          }
        : {
            messages: apiMessages
          }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get AI response')
      }

      const data = await response.json()
      
      // Debug: Log API response
      console.log('API Response data:', data)
      
      if (conversationHelper && data.success) {
        // Helper response with structured data
        console.log('Helper response - parsed data:', data.data.parsed)
        return {
          message: data.data.message,
          parsed: data.data.parsed,
          helper_type: conversationHelper
        }
      } else {
        // Regular chat response
        return {
          message: data.message || data.data?.message
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      // Fallback to a friendly error message
      return {
        message: "I apologize, but I&apos;m having trouble processing your request right now. Please try again in a moment. If the problem persists, please check that the Fireworks API key is properly configured."
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessageContent = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      let conversationId = currentConversationId

      // If no current conversation, create one
      if (!conversationId) {
        console.log('=== CREATING CONVERSATION WITH HELPER ===')
        console.log('selectedHelper:', selectedHelper)
        console.log('selectedHelper?.name:', selectedHelper?.name)
        console.log('Helper to store:', selectedHelper?.name || null)
        
        const newConversation = await chatDB.createConversation('New Chat', selectedHelper?.name || null)
        
        console.log('Created conversation:', newConversation)
        console.log('Stored helper_type:', newConversation?.helper_type)
        
        if (!newConversation) {
          throw new Error('Failed to create conversation')
        }
        conversationId = newConversation.id
        setCurrentConversationId(conversationId)
        // Clear selected helper state since it's now stored in the conversation
        setSelectedHelper(null)
        await loadConversations()
      }

      // Save user message to database
      const savedUserMessage = await chatDB.addMessage(conversationId, 'user', userMessageContent)
      if (!savedUserMessage) {
        throw new Error('Failed to save user message')
      }

      // Add user message to UI immediately
      const userMessage: Message = {
        id: savedUserMessage.id,
        content: savedUserMessage.content,
        role: savedUserMessage.role,
        timestamp: new Date(savedUserMessage.created_at)
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)

      // Get AI response
      const aiResponse = await getAIResponse(newMessages)
      
      // Save AI message to database with helper metadata
      const messageMetadata = aiResponse.helper_type ? {
        helper_type: aiResponse.helper_type,
        parsed_response: aiResponse.parsed
      } : undefined

      // Debug: Log what we're storing
      console.log('Storing message metadata:', messageMetadata)

      const savedAIMessage = await chatDB.addMessage(
        conversationId, 
        'assistant', 
        aiResponse.message, 
        undefined, // tokenCount
        messageMetadata
      )
      
      if (!savedAIMessage) {
        throw new Error('Failed to save AI message')
      }

      // Add AI message to UI
      const assistantMessage: Message = {
        id: savedAIMessage.id,
        content: savedAIMessage.content,
        role: savedAIMessage.role,
        timestamp: new Date(savedAIMessage.created_at),
        parsed_response: aiResponse.parsed,
        helper_type: aiResponse.helper_type
      }

      setMessages(prevMessages => [...prevMessages, assistantMessage])

      // Refresh conversations list to update last message and timestamp
      await loadConversations()

    } catch (error) {
      console.error('Error in chat submission:', error)
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()
    
    if (isToday) return 'Today'
    if (isYesterday) return 'Yesterday'
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  // Show loading screen while authentication is being established
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height))] bg-background items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] bg-background">
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/20 backdrop-blur-xl border-r border-white/30 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your chat history</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewConversation}
              className="flex items-center space-x-2 bg-white/30 hover:bg-white/40 text-gray-700 border-white/30 backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New chat</span>
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your chats..."
              className="w-full pl-10 bg-white/30 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-200"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4 px-2">
            <p className="text-sm text-gray-600">
              You have {conversations.length} previous chats with <span className="text-purple-600 font-medium">Dobby</span>
              {conversations.length > 0 && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-purple-600 hover:text-purple-700 underline text-sm"
                >
                  Clear
                </button>
              )}
            </p>
          </div>
          
          {isLoadingConversations ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-gray-600">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`relative group w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? 'bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm'
                      : 'hover:bg-white/30 backdrop-blur-sm border border-white/20'
                  } border`}
                >
                  <button
                    onClick={() => selectConversation(conversation.id)}
                    className="w-full text-left"
                  >
                    <div className="font-medium text-sm text-gray-800 truncate pr-8">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Last message {formatDate(new Date(conversation.updated_at))}
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => deleteConversation(conversation.id, e)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="w-full h-32 rounded-xl overflow-hidden">
            <Image 
              src="/images/dashboard_banner.jpg" 
              alt="Dashboard Banner" 
              width={320} 
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-4xl">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-purple-200">
                  <Image 
                    src="/images/dobby.png" 
                    alt="Dobby AI Assistant" 
                    width={64} 
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  How can Dobby help you today?
                </h2>
                <p className="text-gray-600 mb-8 max-w-md">
                  Start a conversation by typing a message below. I&apos;m here to assist you with any questions or tasks you have.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                  {[
                    "Help me write an email",
                    "Explain a complex topic", 
                    "Generate creative ideas",
                    "Solve a problem"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="p-3 text-left bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 hover:border-purple-300 hover:bg-white/90 transition-all duration-200 shadow-sm"
                    >
                      <div className="text-sm font-medium text-gray-900">{suggestion}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
            <div className="space-y-8">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                      : 'bg-white border-2 border-gray-200'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Image 
                        src="/images/dobby.png" 
                        alt="Dobby AI Assistant" 
                        width={40} 
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 max-w-none">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
                      {/* Helper Response Badge */}
                      {message.role === 'assistant' && message.helper_type && (
                        <div className="mb-4 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {helpers.find(h => h.name === message.helper_type)?.display_name || message.helper_type}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Debug info for assistant messages */}
                      {message.role === 'assistant' && (() => {
                        console.log('Rendering assistant message:', {
                          id: message.id,
                          helper_type: message.helper_type,
                          has_parsed_response: !!message.parsed_response,
                          content_preview: message.content.substring(0, 100)
                        })
                        return null
                      })()}
                      
                      {/* Render helper-specific response or regular message */}
                      {message.role === 'assistant' && message.helper_type ? (
                        <HelperResponseRenderer 
                          helperType={message.helper_type}
                          parsedResponse={message.parsed_response}
                          rawMessage={message.content}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {message.content}
                        </div>
                      )}
                      
                      {/* Sample images for AI responses (matching the image layout) */}
                      {message.role === 'assistant' && message.content.toLowerCase().includes('image') && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="relative group">
                            <div className="w-full h-32 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-xl flex items-center justify-center">
                              <div className="text-gray-600 text-sm">Sample Image 1</div>
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                Try to make some of these images into the same style
                              </div>
                            </div>
                          </div>
                          <div className="relative group">
                            <div className="w-full h-32 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 rounded-xl flex items-center justify-center">
                              <div className="text-gray-600 text-sm">Sample Image 2</div>
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                Try to make some of these images into the same style
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 ml-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-gray-200">
                    <Image 
                      src="/images/dobby.png" 
                      alt="Dobby AI Assistant" 
                      width={40} 
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 flex justify-center relative">
          {/* Sidebar Toggle Button - Lower Left */}
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute left-6 bottom-6 w-24 h-24 p-1 hover:bg-white/20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Image 
              src="/images/dobby_menu.png" 
              alt="Menu" 
              width={96} 
              height={96}
              className="w-full h-full object-cover rounded-lg"
            />
          </Button>
          
          <form onSubmit={handleSubmit} className="w-full max-w-4xl">
            {/* Helper Indicator - Show based on conversation's helper or selected helper */}
            {(currentConversation?.helper_type || selectedHelper) && (
              <div className="mb-3 flex items-center justify-center">
                <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/50">
                  {(() => {
                    const helper = currentConversation?.helper_type 
                      ? helpers.find(h => h.name === currentConversation.helper_type)
                      : selectedHelper
                    
                    console.log('Showing helper indicator:', { 
                      conversationHelperType: currentConversation?.helper_type,
                      selectedHelper: selectedHelper?.name,
                      foundHelper: helper?.display_name
                    })
                    
                    return (
                      <>
                        <span className="text-lg">{helper?.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{helper?.display_name}</span>
                        {/* Only show close button if no messages yet and no conversation helper */}
                        {selectedHelper && !currentConversation?.helper_type && messages.length === 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedHelper(null)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-white/40">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHelperSelector(!showHelperSelector)}
                disabled={messages.length > 0}
                className={`p-2 rounded-xl ${
                  messages.length > 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-100'
                }`}
                title={messages.length > 0 ? 'Helper can only be selected at the start of a conversation' : 'Select a helper'}
              >
                <Sparkles className={`w-5 h-5 ${messages.length > 0 ? 'text-gray-400' : 'text-purple-600'}`} />
              </Button>
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={(() => {
                    const helper = currentConversation?.helper_type 
                      ? helpers.find(h => h.name === currentConversation.helper_type)
                      : selectedHelper
                    return helper ? `Ask ${helper.display_name}...` : "Ask Dobby anything..."
                  })()}
                  disabled={isLoading}
                  className="w-full h-10 px-4 text-base bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-500"
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="sm"
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-medium"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Helper Selector Modal */}
      {showHelperSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Choose a Dobby Helper</h2>
                  <p className="text-gray-600 mt-1">Select a specialized AI assistant for your task</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowHelperSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {helpers.map((helper) => (
                  <button
                    key={helper.id}
                    onClick={() => {
                      setSelectedHelper(helper)
                      setShowHelperSelector(false)
                    }}
                    className="group text-left p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${helper.color_from} ${helper.color_to} flex items-center justify-center text-2xl mb-3`}>
                      {helper.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{helper.display_name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{helper.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                      <div className="text-xs text-purple-600 group-hover:text-purple-700 font-medium">
                        Select →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {helpers.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No helpers available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading component for Suspense fallback
function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))] bg-background items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your chat...</p>
      </div>
    </div>
  )
}

// Main component that wraps ChatContent in Suspense
export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  )
}
