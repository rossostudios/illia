'use client'

import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { createClient } from '@/lib/supabase/client'

export type Post = {
  id: string
  thread_id: string
  user_id: string
  parent_post_id?: string
  body: string
  is_solution: boolean
  likes_count: number
  edited_at?: string
  created_at: string
  author?: {
    name: string
    email: string
    tier?: string
  }
  reactions?: {
    reaction: string
    count: number
    user_reacted: boolean
  }[]
}

type UseRealtimePostsOptions = {
  threadId: string
  onPostAdded?: (post: Post) => void
  onPostUpdated?: (post: Post) => void
  onPostDeleted?: (postId: string) => void
  onReactionAdded?: (postId: string, reaction: string) => void
}

export function useRealtimePosts(options: UseRealtimePostsOptions) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const { user } = useSessionContext()
  const supabase = createClient()

  // Fetch initial posts
  const fetchPosts = async () => {
    if (!options.threadId) {
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('thread_posts')
        .select(`
          *,
          author:users!user_id (
            name,
            email,
            tier
          )
        `)
        .eq('thread_id', options.threadId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      // Fetch reactions for posts
      if (data && data.length > 0) {
        const postIds = data.map((p) => p.id)
        const { data: reactions } = await supabase
          .from('thread_reactions')
          .select('*')
          .in('post_id', postIds)

        // Group reactions by post
        const reactionsByPost =
          reactions?.reduce(
            (acc, reaction) => {
              if (!acc[reaction.post_id]) {
                acc[reaction.post_id] = {}
              }
              if (!acc[reaction.post_id][reaction.reaction]) {
                acc[reaction.post_id][reaction.reaction] = {
                  reaction: reaction.reaction,
                  count: 0,
                  user_reacted: false,
                }
              }
              acc[reaction.post_id][reaction.reaction].count++
              if (user && reaction.user_id === user.id) {
                acc[reaction.post_id][reaction.reaction].user_reacted = true
              }
              return acc
            },
            {} as Record<string, Record<string, any>>
          ) || {}

        // Attach reactions to posts
        const postsWithReactions = data.map((post) => ({
          ...post,
          reactions: Object.values(reactionsByPost[post.id] || {}),
        }))

        setPosts(postsWithReactions)
      } else {
        setPosts(data || [])
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  // Handle real-time post updates
  const handlePostUpdate = (payload: RealtimePostgresChangesPayload<Post>) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        if (newRecord && newRecord.thread_id === options.threadId) {
          setPosts((prev) => [...prev, newRecord])
          options.onPostAdded?.(newRecord)
        }
        break

      case 'UPDATE':
        if (newRecord && newRecord.thread_id === options.threadId) {
          setPosts((prev) =>
            prev.map((post) => (post.id === newRecord.id ? { ...post, ...newRecord } : post))
          )
          options.onPostUpdated?.(newRecord)
        }
        break

      case 'DELETE':
        if (oldRecord && oldRecord.thread_id === options.threadId) {
          setPosts((prev) => prev.filter((post) => post.id !== oldRecord.id))
          options.onPostDeleted?.(oldRecord.id)
        }
        break
    }
  }

  // Handle real-time reaction updates
  const handleReactionUpdate = (payload: RealtimePostgresChangesPayload<any>) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    if (eventType === 'INSERT' && newRecord) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === newRecord.post_id) {
            const reactions = [...(post.reactions || [])]
            const existingReaction = reactions.find((r) => r.reaction === newRecord.reaction)

            if (existingReaction) {
              existingReaction.count++
              if (user && newRecord.user_id === user.id) {
                existingReaction.user_reacted = true
              }
            } else {
              reactions.push({
                reaction: newRecord.reaction,
                count: 1,
                user_reacted: user ? newRecord.user_id === user.id : false,
              })
            }

            options.onReactionAdded?.(newRecord.post_id, newRecord.reaction)
            return { ...post, reactions }
          }
          return post
        })
      )
    } else if (eventType === 'DELETE' && oldRecord) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === oldRecord.post_id) {
            const reactions = [...(post.reactions || [])]
            const existingReaction = reactions.find((r) => r.reaction === oldRecord.reaction)

            if (existingReaction) {
              existingReaction.count--
              if (user && oldRecord.user_id === user.id) {
                existingReaction.user_reacted = false
              }

              if (existingReaction.count <= 0) {
                return {
                  ...post,
                  reactions: reactions.filter((r) => r.reaction !== oldRecord.reaction),
                }
              }
            }

            return { ...post, reactions }
          }
          return post
        })
      )
    }
  }

  useEffect(() => {
    if (!options.threadId) {
      return
    }

    // Fetch initial data
    fetchPosts()

    // Set up real-time subscription
    const setupRealtimeSubscription = async () => {
      // Clean up existing subscription
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }

      // Set auth for private channels
      await supabase.realtime.setAuth()

      // Create channel for thread posts
      const channel = supabase
        .channel(`thread:${options.threadId}`, {
          config: {
            broadcast: { self: true, ack: true },
            presence: { key: 'user_id' },
            private: true,
          },
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'thread_posts',
            filter: `thread_id=eq.${options.threadId}`,
          },
          handlePostUpdate
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'thread_reactions',
          },
          handleReactionUpdate
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
          }
        })

      channelRef.current = channel
    }

    setupRealtimeSubscription()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [
    options.threadId, // Fetch initial data
    fetchPosts,
    handlePostUpdate,
    handleReactionUpdate,
    supabase.channel,
    supabase.realtime.setAuth,
    supabase.removeChannel,
  ])

  // Create a new post
  const createPost = async (body: string, parentPostId?: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }
    const { data, error } = await supabase
      .from('thread_posts')
      .insert({
        thread_id: options.threadId,
        user_id: user.id,
        body,
        parent_post_id: parentPostId,
      })
      .select(`
          *,
          author:users!user_id (
            name,
            email,
            tier
          )
        `)
      .single()

    if (error) {
      throw error
    }
    return data
  }

  // Update a post
  const updatePost = async (postId: string, body: string) => {
    const { data, error } = await supabase
      .from('thread_posts')
      .update({
        body,
        edited_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', user?.id) // Ensure user owns the post
      .select()
      .single()

    if (error) {
      throw error
    }
    return data
  }

  // Delete a post
  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('thread_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user?.id) // Ensure user owns the post

    if (error) {
      throw error
    }
  }

  // Add or remove reaction
  const toggleReaction = async (postId: string, reaction: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }
    // Check if reaction exists
    const { data: existing } = await supabase
      .from('thread_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('reaction', reaction)
      .single()

    if (existing) {
      // Remove reaction
      const { error } = await supabase.from('thread_reactions').delete().eq('id', existing.id)

      if (error) {
        throw error
      }
    } else {
      // Add reaction
      const { error } = await supabase.from('thread_reactions').insert({
        post_id: postId,
        user_id: user.id,
        reaction,
      })

      if (error) {
        throw error
      }
    }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
    refetch: fetchPosts,
  }
}
