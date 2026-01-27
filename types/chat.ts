// types/chat.ts

export type Sender = 'customer' | 'support' | 'system'
export type SessionStatus = 'waiting' | 'assigned' | 'in-progress' | 'completed' | 'closed'
export type QueueStatus = 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'สำเร็จ'

export interface ChatMessage {
  id: string
  sessionId: string
  sender: Sender
  text: string
  fileUrl?: string
  imageUrl?: string
  createdAt: string
}

export interface ChatSession {
  id: string
  queueNo: string
  customerId: string
  customerName: string
  memberNo: string
  merchantId: string
  phone: string
  status: SessionStatus
  supportId?: string
  supportName?: string
  lastMessage?: string
  hasUnread: boolean
  queuePosition?: number
  startDate: string
  startTime: string
  endDate?: string
  endTime?: string
  chatDuration?: string
  createdAt: string
  updatedAt: string
}

export interface ChatQueue {
  que_no: string
  user: string
  member_no: string
  merchant: string
  tel: string
  start_date: string
  start_time: string
  end_date?: string
  end_time?: string
  status: QueueStatus
  support_id?: string
  support_name?: string
  chat_time?: string
  rating?: number
  comment?: string
}

export interface ChatImage {
  id: string
  url: string
  name: string
  createdAt: string
}

export interface ChatFile {
  id: string
  url: string
  name: string
  size: number
  type: string
  createdAt: string
}

export interface Rating {
  sessionId: string
  rating: number
  comment: string
  createdAt: string
}

export interface CustomerInfo {
  id: string
  name: string
  memberNo: string
  merchantId: string
  phone: string
  companyName: string
}

export interface AutoReplyMessage {
  memberNo: string
  companyName: string
  queuePosition: number
}