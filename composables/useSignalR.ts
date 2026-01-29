// composables/useSignalR.ts
import * as signalR from '@microsoft/signalr'
import { ref } from 'vue'

const connection = ref<signalR.HubConnection | null>(null)
const isConnected = ref(false)
const reconnecting = ref(false)

export function useSignalR() {
  const config = useRuntimeConfig()
  const SIGNALR_URL = config.public.signalrUrl as string

  const connect = async (userId: string, userType: 'customer' | 'support') => {
    if (connection.value && isConnected.value) {
      console.log('✅ SignalR already connected')
      return
    }

    connection.value = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

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

    // 🔥 สำคัญ
    await connection.value.invoke('RegisterUser', userId, userType)

    console.log(`✅ SignalR connected as ${userType} (${userId})`)
  }

  const disconnect = async () => {
    if (connection.value) {
      await connection.value.stop()
      connection.value = null
      isConnected.value = false
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
    await connection.value.invoke(method, ...args)
  }

  const joinSession = async (sessionId: string) => {
    await send('JoinSession', sessionId)
  }

  const leaveSession = async (sessionId: string) => {
    await send('LeaveSession', sessionId)
  }

  return {
    connect,
    disconnect,
    on,
    off,
    send,
    joinSession,
    leaveSession,
    isConnected,
    reconnecting
  }
}
