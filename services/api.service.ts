// services/api.service.ts

import type { ChatMessage, ChatSession, CustomerInfo } from '~/types/chat'

export const apiService = {
  getBaseURL(): string {
    const config = useRuntimeConfig()
    return config.public.apiBaseUrl as string
  },

  async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`
    
    console.log('📤 API Request:', {
      url,
      method: options.method || 'GET',
      body: options.body
    })
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      console.log('📥 API Response:', {
        status: response.status,
        ok: response.ok
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Detail:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ API Success:', data)
      return data
      
    } catch (error) {
      console.error('❌ API Error:', error)
      throw error
    }
  },

  // =============== CUSTOMER APIs ===============

  async getCustomerInfo(customerId: string): Promise<CustomerInfo> {
    return this.fetchApi<CustomerInfo>(`/customers/${customerId}`)
  },

  // =============== CHAT SESSION APIs ===============

  // ⭐ แก้ตรงนี้ - ไม่ต้องส่ง customerId
  async createChatSession(): Promise<ChatSession> {
    return this.fetchApi<ChatSession>('/chat/sessions', {
      method: 'POST'
      // ไม่ต้องมี body
    })
  },

  async getChatSessions(status?: string): Promise<ChatSession[]> {
    const query = status ? `?status=${status}` : ''
    return this.fetchApi<ChatSession[]>(`/chat/sessions${query}`)
  },

  async getChatSessionById(sessionId: string): Promise<ChatSession> {
    return this.fetchApi<ChatSession>(`/chat/sessions/${sessionId}`)
  },

  async acceptChatSession(sessionId: string, supportId: string): Promise<ChatSession> {
    return this.fetchApi<ChatSession>(`/chat/sessions/${sessionId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ supportId })
    })
  },

  async completeChatSession(sessionId: string): Promise<ChatSession> {
    return this.fetchApi<ChatSession>(`/chat/sessions/${sessionId}/complete`, {
      method: 'POST'
    })
  },

  // =============== MESSAGE APIs ===============

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.fetchApi<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`)
  },

  async sendChatMessage(
    sessionId: string,
    message: string,
    sender: 'customer' | 'support'
  ): Promise<ChatMessage> {
    return this.fetchApi<ChatMessage>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text: message, sender })
    })
  },

  async uploadChatImage(sessionId: string, file: File): Promise<ChatMessage> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sessionId', sessionId)

    const response = await fetch(`${this.getBaseURL()}/chat/upload/image`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Image upload failed')
    }

    return response.json()
  },

  async uploadChatFile(sessionId: string, file: File): Promise<ChatMessage> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sessionId', sessionId)

    const response = await fetch(`${this.getBaseURL()}/chat/upload/file`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  },

  // =============== RATING APIs ===============

  async submitRating(
    sessionId: string,
    rating: number,
    comment: string
  ): Promise<void> {
    await this.fetchApi(`/chat/sessions/${sessionId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    })
  },

  // =============== HISTORY APIs ===============

  async getChatHistory(customerId: string): Promise<ChatSession[]> {
    return this.fetchApi<ChatSession[]>(`/customers/${customerId}/history`)
  }
}