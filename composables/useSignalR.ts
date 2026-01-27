// composables/useSignalR.ts

import * as signalR from '@microsoft/signalr'
import { ref } from 'vue'

const connection = ref<signalR.HubConnection | null>(null)
const isConnected = ref(false)
const reconnecting = ref(false)

export function useSignalR() {
  const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL || 'https://your-api-url.com/chatHub'

  const connect = async (userId: string, userType: 'customer' | 'support') => {
    if (connection.value && isConnected.value) {
      console.log('✅ SignalR already connected')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')

      connection.value = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL, {
          accessTokenFactory: () => token || '',
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.elapsedMilliseconds < 60000) {
              return Math.random() * 10000
            } else {
              return null
            }
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build()

      // Event handlers
      connection.value.onreconnecting(() => {
        reconnecting.value = true
        console.log('🔄 SignalR reconnecting...')
      })

      connection.value.onreconnected(() => {
        reconnecting.value = false
        isConnected.value = true
        console.log('✅ SignalR reconnected')
      })

      connection.value.onclose(() => {
        isConnected.value = false
        console.log('❌ SignalR disconnected')
      })

      await connection.value.start()
      isConnected.value = true

      // Register user
      await connection.value.invoke('RegisterUser', {
        userId,
        userType
      })

      console.log('✅ SignalR connected and user registered')

    } catch (error) {
      console.error('❌ SignalR connection failed:', error)
      throw error
    }
  }

  const disconnect = async () => {
    if (connection.value) {
      await connection.value.stop()
      connection.value = null
      isConnected.value = false
      console.log('🔌 SignalR disconnected')
    }
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    connection.value?.on(event, callback)
  }

  const off = (event: string) => {
    connection.value?.off(event)
  }

  const send = async (method: string, ...args: any[]) => {
    if (!connection.value || !isConnected.value) {
      throw new Error('SignalR not connected')
    }

    try {
      await connection.value.invoke(method, ...args)
    } catch (error) {
      console.error(`❌ Error invoking ${method}:`, error)
      throw error
    }
  }

  return {
    connect,
    disconnect,
    on,
    off,
    send,
    isConnected,
    reconnecting
  }
}