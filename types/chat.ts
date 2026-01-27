export type Sender = "customer" | "support"

export interface ChatMessage {
  id?: string
  sender: Sender
  text: string
  createdAt: Date
}

export interface ChatSession {
  id: string
  customerName: string
  merchantId?: string
  phone?: string
  messages?: ChatMessage[] // mock ตอนนี้
}
