'use client'

import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useDirectMessages } from '@/hooks/use-direct-messages'
import MessageCenter from './MessageCenter'

type MessageButtonProps = {
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
    if (!user) {
      return
    }

    const interval = setInterval(() => {
      refetchConversations()
    }, 30_000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [user, refetchConversations])

  if (!user) {
    return null
  }

  return (
    <>
      <button
        aria-label="Messages"
        className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-teal-600 ${className}`}
        onClick={() => setIsMessageCenterOpen(true)}
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="-top-2 -right-2 absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 font-bold text-white text-xs">
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
