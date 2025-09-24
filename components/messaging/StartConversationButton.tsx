'use client'

import { MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import MessageCenter from './MessageCenter'

type StartConversationButtonProps = {
  userId: string
  userName?: string
  isProvider?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

export default function StartConversationButton({
  userId,
  userName = 'this user',
  isProvider = false,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
}: StartConversationButtonProps) {
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false)
  const { user } = useSessionContext()

  if (!user || user.id === userId) {
    return null
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50',
  }

  return (
    <>
      <button
        className={`flex items-center justify-center gap-2 ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}rounded-lg font-medium transition-colors ${className}
        `}
        onClick={() => setIsMessageCenterOpen(true)}
      >
        <MessageSquare className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span>Message {isProvider ? 'Provider' : userName}</span>
      </button>

      {isMessageCenterOpen && (
        <MessageCenter
          initialOtherUserId={userId}
          isOpen={isMessageCenterOpen}
          onClose={() => setIsMessageCenterOpen(false)}
        />
      )}
    </>
  )
}

// Quick message button for inline use
export function QuickMessageButton({
  userId,
  className = '',
}: {
  userId: string
  className?: string
}) {
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false)
  const { user } = useSessionContext()

  if (!user || user.id === userId) {
    return null
  }

  return (
    <>
      <button
        aria-label="Send message"
        className={`rounded-lg p-2 transition-colors hover:bg-gray-100 ${className}`}
        onClick={() => setIsMessageCenterOpen(true)}
      >
        <Send className="h-4 w-4 text-gray-500" />
      </button>

      {isMessageCenterOpen && (
        <MessageCenter
          initialOtherUserId={userId}
          isOpen={isMessageCenterOpen}
          onClose={() => setIsMessageCenterOpen(false)}
        />
      )}
    </>
  )
}
