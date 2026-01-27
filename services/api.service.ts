// services/api.service.ts

import type { 
    ChatMessage, 
    ChatSession, 
    ChatQueue, 
    Rating,
    CustomerInfo 
  } from '~/types/chat'
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-url.com/api'
  
  class ApiService {
    private async fetchApi<T>(
      endpoint: string, 
      options: RequestInit = {}
    ): Promise<T> {
      const token = this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      })
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }
  
      return response.json()
    }
  
    private getAuthToken(): string | null {
      // ดึง token จาก localStorage หรือ cookie
      return localStorage.getItem('auth_token')
    }
  
    // =============== CUSTOMER APIs ===============
    
    async getCustomerInfo(customerId: string): Promise<CustomerInfo> {
      return this.fetchApi<CustomerInfo>(`/customers/${customerId}`)
    }
  
    // =============== CHAT SESSION APIs ===============
    
    async createChatSession(customerId: string): Promise<ChatSession> {
      return this.fetchApi<ChatSession>('/chat/sessions', {
        method: 'POST',
        body: JSON.stringify({ customerId })
      })
    }
  
    async getChatSessions(status?: string): Promise<ChatSession[]> {
      const query = status ? `?status=${status}` : ''
      return this.fetchApi<ChatSession[]>(`/chat/sessions${query}`)
    }
  
    async getChatSessionById(sessionId: string): Promise<ChatSession> {
      return this.fetchApi<ChatSession>(`/chat/sessions/${sessionId}`)
    }
  
    async acceptChatSession(sessionId: string, supportId: string): Promise<ChatSession> {
      return this.fetchApi<ChatSession>(`/chat/sessions/${sessionId}/accept`, {
        method: 'POST',
        body: JSON.stringify({ supportId })
      })
    }
  
    async completeChatSession(sessionId: string): Promise<ChatSession> {
      return this.fetchApi<ChatSession>(`/chat/sessions/${sessionId}/complete`, {
        method: 'POST'
      })
    }
  
    // =============== MESSAGE APIs ===============
    
    async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
      return this.fetchApi<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`)
    }
  
    async sendChatMessage(
      sessionId: string, 
      message: string,
      sender: 'customer' | 'support'
    ): Promise<ChatMessage> {
      return this.fetchApi<ChatMessage>(`/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text: message, sender })
      })
    }
  
    async uploadChatImage(sessionId: string, file: File): Promise<ChatMessage> {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', sessionId)
  
      const token = this.getAuthToken()
      const response = await fetch(`${API_BASE_URL}/chat/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData
      })
  
      if (!response.ok) {
        throw new Error('Image upload failed')
      }
  
      return response.json()
    }
  
    async uploadChatFile(sessionId: string, file: File): Promise<ChatMessage> {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', sessionId)
  
      const token = this.getAuthToken()
      const response = await fetch(`${API_BASE_URL}/chat/upload/file`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData
      })
  
      if (!response.ok) {
        throw new Error('File upload failed')
      }
  
      return response.json()
    }
  
    // =============== QUEUE APIs ===============
    
    async getChatQueues(status?: string): Promise<ChatQueue[]> {
      const query = status ? `?status=${status}` : ''
      return this.fetchApi<ChatQueue[]>(`/chat/queues${query}`)
    }
  
    async getQueuePosition(sessionId: string): Promise<number> {
      const result = await this.fetchApi<{ position: number }>(
        `/chat/queues/${sessionId}/position`
      )
      return result.position
    }
  
    // =============== RATING APIs ===============
    
    async submitRating(
      sessionId: string, 
      rating: number, 
      comment: string
    ): Promise<Rating> {
      return this.fetchApi<Rating>(`/chat/sessions/${sessionId}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      })
    }
  
    // =============== HISTORY APIs ===============
    
    async getChatHistory(customerId: string): Promise<ChatSession[]> {
      return this.fetchApi<ChatSession[]>(`/customers/${customerId}/history`)
    }
  
    async getSupportHistory(supportId: string): Promise<ChatSession[]> {
      return this.fetchApi<ChatSession[]>(`/support/${supportId}/history`)
    }
  }
  
  export const apiService = new ApiService()