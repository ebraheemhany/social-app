import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getNotifications } from '@/service/service'
import type { NotificationTyping } from '@/typing/type';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationTyping[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async (pageNum: number) => {
    if (!userId) return
    setLoading(true)

    try {
      const data = await getNotifications(userId, pageNum)
      
      if (pageNum === 0) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
      } else {
        setNotifications(prev => [...prev, ...data])
      }

      setHasMore(data.length === 20)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Real-time — INSERT فقط
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as NotificationTyping
          setNotifications(prev => [newNotif, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  useEffect(() => {
    fetchNotifications(0)
  }, [fetchNotifications])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications(nextPage)
  }

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('is_read', false)

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  // ✅ الحذف مع الـ fix
  const removeNotification = async (id: string) => {
    // ✅ دور على الـ notification برا الـ setState
    const notif = notifications.find(n => n.id === id)

    // ✅ كل state لوحدها
    setNotifications(prev => prev.filter(n => n.id !== id))

    if (notif && !notif.is_read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      fetchNotifications(0)
    }
  }

  return { 
    notifications, 
    unreadCount, 
    loading, 
    hasMore, 
    loadMore, 
    markAllAsRead, 
    removeNotification 
  }
}