import { createClient } from '@/lib/supabase/client'

export interface ConversationSummary {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  is_archived: boolean
  helper_type: string | null
  last_message: string
  last_message_role: 'user' | 'assistant'
  last_message_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  token_count?: number
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  is_archived: boolean
  helper_type: string | null
  metadata?: Record<string, any>
  messages?: Message[]
}

export class ChatDatabase {
  private supabase = createClient()
  private loadingStates = new Map<string, boolean>()

  // Helper function to ensure user is authenticated
  private async ensureAuthenticated(): Promise<{ user: any; error: any } | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error) {
        console.error('Authentication error:', error)
        return null
      }
      
      if (!user) {
        console.error('User not authenticated')
        return null
      }
      
      return { user, error: null }
    } catch (error) {
      console.error('Auth check failed:', error)
      return null
    }
  }

  // Debug function to check authentication status
  async debugAuth(): Promise<void> {
    const authResult = await this.ensureAuthenticated()
    console.log('Auth Debug:', {
      user: authResult?.user ? { id: authResult.user.id, email: authResult.user.email } : null,
      isAuthenticated: !!authResult?.user,
      activeRequests: Array.from(this.loadingStates.entries()).filter(([, isLoading]) => isLoading)
    })
  }

  // Clear all loading states (useful for debugging or cleanup)
  clearLoadingStates(): void {
    this.loadingStates.clear()
  }

  // Create a new conversation
  async createConversation(title: string = 'New Chat', helperType: string | null = null): Promise<Conversation | null> {
    try {
      console.log('=== DATABASE createConversation ===')
      console.log('title:', title)
      console.log('helperType parameter:', helperType)
      console.log('helperType type:', typeof helperType)
      
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return null
      }
      
      const { user } = authResult

      const insertData = {
        user_id: user.id, // Explicitly set the user_id
        title,
        message_count: 0,
        is_archived: false,
        helper_type: helperType
      }
      
      console.log('Data to insert:', insertData)

      const { data, error } = await this.supabase
        .from('conversations')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating conversation:', error)
        return null
      }

      console.log('Created conversation data:', data)
      console.log('=== END DATABASE createConversation ===')
      
      return data
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }

  // Get all conversations for the current user
  async getConversations(): Promise<ConversationSummary[]> {
    const loadingKey = 'getConversations'
    
    // Prevent multiple simultaneous requests
    if (this.loadingStates.get(loadingKey)) {
      console.log('getConversations already in progress, skipping...')
      return []
    }

    try {
      this.loadingStates.set(loadingKey, true)
      
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return []
      }

      const { data, error } = await this.supabase
        .from('conversation_summaries')
        .select('*')
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    } finally {
      this.loadingStates.set(loadingKey, false)
    }
  }

  // Get a specific conversation with all messages
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      // Get conversation details
      const { data: conversation, error: convError } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (convError) {
        console.error('Error fetching conversation:', convError)
        return null
      }

      // Get all messages for this conversation
      const { data: messages, error: msgError } = await this.supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (msgError) {
        console.error('Error fetching messages:', msgError)
        return null
      }

      return {
        ...conversation,
        messages: messages || []
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      return null
    }
  }

  // Add a message to a conversation
  async addMessage(
    conversationId: string, 
    role: 'user' | 'assistant', 
    content: string,
    tokenCount?: number,
    metadata?: Record<string, any>
  ): Promise<Message | null> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
          token_count: tokenCount || 0,
          metadata: metadata || {}
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding message:', error)
        return null
      }

      // Auto-generate title if this is the first user message
      if (role === 'user') {
        const { data: messageCount } = await this.supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conversationId)
          .eq('role', 'user')

        if (messageCount && messageCount.length === 1) {
          // This is the first user message, generate title
          await this.supabase.rpc('generate_conversation_title', {
            conversation_uuid: conversationId
          })
        }
      }

      return data
    } catch (error) {
      console.error('Error adding message:', error)
      return null
    }
  }

  // Update conversation title
  async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId)

      if (error) {
        console.error('Error updating conversation title:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating conversation title:', error)
      return false
    }
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (error) {
        console.error('Error deleting conversation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting conversation:', error)
      return false
    }
  }

  // Archive a conversation
  async archiveConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('conversations')
        .update({ is_archived: true })
        .eq('id', conversationId)

      if (error) {
        console.error('Error archiving conversation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error archiving conversation:', error)
      return false
    }
  }

  // Search conversations
  async searchConversations(query: string): Promise<ConversationSummary[]> {
    const loadingKey = `searchConversations_${query}`
    
    // Prevent multiple simultaneous searches for the same query
    if (this.loadingStates.get(loadingKey)) {
      console.log(`Search for "${query}" already in progress, skipping...`)
      return []
    }

    try {
      this.loadingStates.set(loadingKey, true)
      
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return []
      }

      const { data, error } = await this.supabase
        .from('conversation_summaries')
        .select('*')
        .or(`title.ilike.%${query}%,last_message.ilike.%${query}%`)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error searching conversations:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error searching conversations:', error)
      return []
    } finally {
      this.loadingStates.set(loadingKey, false)
    }
  }

  // Get conversation statistics
  async getConversationStats(): Promise<{
    total_conversations: number
    total_messages: number
    archived_conversations: number
  }> {
    try {
      const { data: conversations, error: convError } = await this.supabase
        .from('conversations')
        .select('id, is_archived', { count: 'exact' })

      const { data: messages, error: msgError } = await this.supabase
        .from('messages')
        .select('id', { count: 'exact' })

      if (convError || msgError) {
        console.error('Error fetching stats:', convError || msgError)
        return { total_conversations: 0, total_messages: 0, archived_conversations: 0 }
      }

      const totalConversations = conversations?.length || 0
      const archivedConversations = conversations?.filter(c => c.is_archived).length || 0
      const totalMessages = messages?.length || 0

      return {
        total_conversations: totalConversations,
        total_messages: totalMessages,
        archived_conversations: archivedConversations
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return { total_conversations: 0, total_messages: 0, archived_conversations: 0 }
    }
  }
}

// Export a singleton instance
export const chatDB = new ChatDatabase()
