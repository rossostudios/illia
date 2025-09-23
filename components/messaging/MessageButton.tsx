'use client'

import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useDirectMessages } from '@/hooks/useDirectMessages'
import MessageCenter from './MessageCenter'

interface MessageButtonProps {
  className?: string
  showLabel?: boolean
}

export default function MessageButton({ className = '', showLabel = false }: MessageButtonProps) {
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useSessionContext()

  const { conversations, refetchConversations } = useDirectMessages()

  // Calculate total unread messages
  useEffect(() => {
    const total = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)
    setUnreadCount(total)
  }, [conversations])

  // Refresh conversations periodically
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      refetchConversations()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [user, refetchConversations])

  if (!user) return null

  return (
    <>
      <button
        onClick={() => setIsMessageCenterOpen(true)}
        className={`relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-lg transition-colors ${className}`}
        aria-label="Messages"
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        {showLabel && <span className="hidden sm:inline">Messages</span>}
      </button>

      <MessageCenter isOpen={isMessageCenterOpen} onClose={() => setIsMessageCenterOpen(false)} />
    </>
  )
}
