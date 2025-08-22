import { createClient } from '@/lib/supabase/client'
import type { 
  DobbyHelperType, 
  DobbyHelperSession, 
  DobbyHelperMessage, 
  DobbyHelperSessionSummary 
} from '@/types'

export class DobbyHelpersDatabase {
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

  // Get all active helper types
  async getHelperTypes(): Promise<DobbyHelperType[]> {
    try {
      const { data, error } = await this.supabase
        .from('dobby_helper_types')
        .select('*')
        .eq('is_active', true)
        .order('display_name', { ascending: true })

      if (error) {
        console.error('Error fetching helper types:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching helper types:', error)
      return []
    }
  }

  // Get a specific helper type by name
  async getHelperType(name: string): Promise<DobbyHelperType | null> {
    try {
      const { data, error } = await this.supabase
        .from('dobby_helper_types')
        .select('*')
        .eq('name', name)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching helper type:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching helper type:', error)
      return null
    }
  }

  // Create a new helper session
  async createHelperSession(
    helperTypeId: string, 
    title: string = 'New Helper Session',
    language: string = 'en'
  ): Promise<DobbyHelperSession | null> {
    try {
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return null
      }
      
      const { user } = authResult

      const { data, error } = await this.supabase
        .from('dobby_helper_sessions')
        .insert({
          user_id: user.id,
          helper_type_id: helperTypeId,
          title,
          language,
          message_count: 0,
          is_archived: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating helper session:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating helper session:', error)
      return null
    }
  }

  // Get all helper sessions for the current user
  async getHelperSessions(): Promise<DobbyHelperSessionSummary[]> {
    const loadingKey = 'getHelperSessions'
    
    if (this.loadingStates.get(loadingKey)) {
      console.log('getHelperSessions already in progress, skipping...')
      return []
    }

    try {
      this.loadingStates.set(loadingKey, true)
      
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return []
      }

      const { user } = authResult

      const { data, error } = await this.supabase
        .from('dobby_helper_session_summaries')
        .select('*')
        .eq('user_id', user.id)  // 🔒 SECURITY FIX: Filter by user_id
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching helper sessions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching helper sessions:', error)
      return []
    } finally {
      this.loadingStates.set(loadingKey, false)
    }
  }

  // Get helper sessions by helper type
  async getHelperSessionsByType(helperTypeName: string): Promise<DobbyHelperSessionSummary[]> {
    try {
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return []
      }

      const { user } = authResult

      const { data, error } = await this.supabase
        .from('dobby_helper_session_summaries')
        .select('*')
        .eq('user_id', user.id)  // 🔒 SECURITY FIX: Filter by user_id first
        .eq('helper_type_name', helperTypeName)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching helper sessions by type:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching helper sessions by type:', error)
      return []
    }
  }

  // Get a specific helper session with all messages
  async getHelperSession(sessionId: string): Promise<DobbyHelperSession | null> {
    try {
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return null
      }

      const { user } = authResult

      // Get session details - ensure it belongs to the current user
      const { data: session, error: sessionError } = await this.supabase
        .from('dobby_helper_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)  // 🔒 SECURITY FIX: Ensure user owns this session
        .single()

      if (sessionError) {
        console.error('Error fetching helper session:', sessionError)
        return null
      }

      // Get all messages for this session (RLS will handle user filtering via session ownership)
      const { data: messages, error: msgError } = await this.supabase
        .from('dobby_helper_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (msgError) {
        console.error('Error fetching helper messages:', msgError)
        return null
      }

      return {
        ...session,
        messages: messages || []
      }
    } catch (error) {
      console.error('Error fetching helper session:', error)
      return null
    }
  }

  // Add a message to a helper session
  async addHelperMessage(
    sessionId: string, 
    role: 'user' | 'assistant' | 'system', 
    content: string,
    tokenCount?: number
  ): Promise<DobbyHelperMessage | null> {
    try {
      const { data, error } = await this.supabase
        .from('dobby_helper_messages')
        .insert({
          session_id: sessionId,
          role,
          content,
          token_count: tokenCount || 0
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding helper message:', error)
        return null
      }

      // Auto-generate title if this is the first user message
      if (role === 'user') {
        const { data: messageCount } = await this.supabase
          .from('dobby_helper_messages')
          .select('id', { count: 'exact' })
          .eq('session_id', sessionId)
          .eq('role', 'user')

        if (messageCount && messageCount.length === 1) {
          // This is the first user message, generate title
          await this.supabase.rpc('generate_helper_session_title', {
            session_uuid: sessionId
          })
        }
      }

      return data
    } catch (error) {
      console.error('Error adding helper message:', error)
      return null
    }
  }

  // Update helper session title
  async updateHelperSessionTitle(sessionId: string, title: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('dobby_helper_sessions')
        .update({ title })
        .eq('id', sessionId)

      if (error) {
        console.error('Error updating helper session title:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating helper session title:', error)
      return false
    }
  }

  // Delete a helper session
  async deleteHelperSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('dobby_helper_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) {
        console.error('Error deleting helper session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting helper session:', error)
      return false
    }
  }

  // Archive a helper session
  async archiveHelperSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('dobby_helper_sessions')
        .update({ is_archived: true })
        .eq('id', sessionId)

      if (error) {
        console.error('Error archiving helper session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error archiving helper session:', error)
      return false
    }
  }

  // Search helper sessions
  async searchHelperSessions(query: string): Promise<DobbyHelperSessionSummary[]> {
    const loadingKey = `searchHelperSessions_${query}`
    
    if (this.loadingStates.get(loadingKey)) {
      console.log(`Helper search for "${query}" already in progress, skipping...`)
      return []
    }

    try {
      this.loadingStates.set(loadingKey, true)
      
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return []
      }

      const { user } = authResult

      const { data, error } = await this.supabase
        .from('dobby_helper_session_summaries')
        .select('*')
        .eq('user_id', user.id)  // 🔒 SECURITY FIX: Filter by user_id first
        .or(`title.ilike.%${query}%,last_message.ilike.%${query}%,helper_display_name.ilike.%${query}%`)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error searching helper sessions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error searching helper sessions:', error)
      return []
    } finally {
      this.loadingStates.set(loadingKey, false)
    }
  }

  // Get helper session statistics
  async getHelperSessionStats(): Promise<{
    total_sessions: number
    total_messages: number
    sessions_by_type: { [key: string]: number }
  }> {
    try {
      const authResult = await this.ensureAuthenticated()
      if (!authResult) {
        return { total_sessions: 0, total_messages: 0, sessions_by_type: {} }
      }

      const { data: sessions, error: sessionError } = await this.supabase
        .from('dobby_helper_sessions')
        .select('id, helper_type_id', { count: 'exact' })
        .eq('user_id', authResult.user.id)

      const { data: messages, error: msgError } = await this.supabase
        .from('dobby_helper_messages')
        .select('id', { count: 'exact' })
        .in('session_id', sessions?.map(s => s.id) || [])

      if (sessionError || msgError) {
        console.error('Error fetching helper stats:', sessionError || msgError)
        return { total_sessions: 0, total_messages: 0, sessions_by_type: {} }
      }

      // Get helper types for grouping
      const { data: helperTypes } = await this.supabase
        .from('dobby_helper_types')
        .select('id, display_name')

      const helperTypeMap = new Map(helperTypes?.map(ht => [ht.id, ht.display_name]) || [])
      
      const sessionsByType: { [key: string]: number } = {}
      sessions?.forEach(session => {
        const typeName = helperTypeMap.get(session.helper_type_id) || 'Unknown'
        sessionsByType[typeName] = (sessionsByType[typeName] || 0) + 1
      })

      return {
        total_sessions: sessions?.length || 0,
        total_messages: messages?.length || 0,
        sessions_by_type: sessionsByType
      }
    } catch (error) {
      console.error('Error fetching helper stats:', error)
      return { total_sessions: 0, total_messages: 0, sessions_by_type: {} }
    }
  }

  // Clear all loading states (useful for debugging or cleanup)
  clearLoadingStates(): void {
    this.loadingStates.clear()
  }
}

// Export a singleton instance
export const dobbyHelpersDB = new DobbyHelpersDatabase()
