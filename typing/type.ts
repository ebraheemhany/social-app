export type NotificationType = 'like' | 'comment' | 'message' | 'follow'

export interface AppNotification {
  id: string
  receiver_id: string
  sender_id: string
  type: NotificationType
  post_id: string | null
  message_id: string | null
  is_read: boolean
  created_at: string
  sender: {
    id: string
    username: string
    avatar_url: string | null
  } | null
  post: {
    id: string
    content: string
  } | null
}

export interface userData {
  name: string
  email: string
  password: string
}



