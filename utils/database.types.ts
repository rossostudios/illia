export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      blocked_users: {
        Row: {
          blocked_at: string | null
          blocked_user_id: string | null
          id: string
          reason: string | null
          user_id: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_user_id?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_user_id?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'blocked_users_blocked_user_id_fkey'
            columns: ['blocked_user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'blocked_users_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      community_threads: {
        Row: {
          body: string
          category: Database['public']['Enums']['thread_category']
          city_tag: Database['public']['Enums']['city'] | null
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          replies_count: number | null
          search_vector: unknown | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          body: string
          category: Database['public']['Enums']['thread_category']
          city_tag?: Database['public']['Enums']['city'] | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          replies_count?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          body?: string
          category?: Database['public']['Enums']['thread_category']
          city_tag?: Database['public']['Enums']['city'] | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          replies_count?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'community_threads_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          is_archived: boolean | null
          is_muted: boolean | null
          joined_at: string | null
          last_read_at: string | null
          notification_enabled: boolean | null
          unread_count: number | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          notification_enabled?: boolean | null
          unread_count?: number | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          notification_enabled?: boolean | null
          unread_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conversation_participants_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversation_participants_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          attachments: Json | null
          conversation_id: string | null
          created_at: string | null
          deleted_at: string | null
          delivered_at: string | null
          edited_at: string | null
          id: string
          is_delivered: boolean | null
          is_read: boolean | null
          message: string
          message_type: string | null
          reactions: Json | null
          receiver_id: string | null
          reply_to_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          edited_at?: string | null
          id?: string
          is_delivered?: boolean | null
          is_read?: boolean | null
          message: string
          message_type?: string | null
          reactions?: Json | null
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          edited_at?: string | null
          id?: string
          is_delivered?: boolean | null
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          reactions?: Json | null
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'direct_messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'direct_messages_receiver_id_fkey'
            columns: ['receiver_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'direct_messages_reply_to_id_fkey'
            columns: ['reply_to_id']
            isOneToOne: false
            referencedRelation: 'direct_messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'direct_messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      illia_leads: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          niche: string
          notes: string | null
          phone: string | null
          score: number | null
          status: string | null
          user_email: string
          zip_code: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          niche: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          status?: string | null
          user_email: string
          zip_code?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          niche?: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          status?: string | null
          user_email?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      illia_leads_logs: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          niche: string
          status: string | null
          user_email: string
          zip_code: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          niche: string
          status?: string | null
          user_email: string
          zip_code?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          niche?: string
          status?: string | null
          user_email?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      intro_requests: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          message: string | null
          provider_id: string
          responded_at: string | null
          scheduled_for: string | null
          status: Database['public']['Enums']['intro_status'] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string | null
          provider_id: string
          responded_at?: string | null
          scheduled_for?: string | null
          status?: Database['public']['Enums']['intro_status'] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string | null
          provider_id?: string
          responded_at?: string | null
          scheduled_for?: string | null
          status?: Database['public']['Enums']['intro_status'] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'intro_requests_provider_id_fkey'
            columns: ['provider_id']
            isOneToOne: false
            referencedRelation: 'service_providers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'intro_requests_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          budget: string | null
          city: string
          created_at: string | null
          email: string
          frequency: string | null
          id: string
          languages: string[] | null
          name: string
          phone: string | null
          preferences: string | null
          quiz_completed_at: string | null
          services: string[]
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: string | null
          city: string
          created_at?: string | null
          email: string
          frequency?: string | null
          id?: string
          languages?: string[] | null
          name: string
          phone?: string | null
          preferences?: string | null
          quiz_completed_at?: string | null
          services: string[]
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: string | null
          city?: string
          created_at?: string | null
          email?: string
          frequency?: string | null
          id?: string
          languages?: string[] | null
          name?: string
          phone?: string | null
          preferences?: string | null
          quiz_completed_at?: string | null
          services?: string[]
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          ai_model: string | null
          created_at: string | null
          dismissed_at: string | null
          explanation: string
          id: string
          provider_id: string
          score: number
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          ai_model?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          explanation: string
          id?: string
          provider_id: string
          score: number
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          ai_model?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          explanation?: string
          id?: string
          provider_id?: string
          score?: number
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'matches_provider_id_fkey'
            columns: ['provider_id']
            isOneToOne: false
            referencedRelation: 'service_providers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'matches_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      message_read_receipts: {
        Row: {
          id: string
          message_id: string | null
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'message_read_receipts_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'direct_messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'message_read_receipts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: Database['public']['Enums']['city'] | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          languages: Database['public']['Enums']['language'][] | null
          metadata: Json | null
          onboarding_completed: boolean | null
          phone: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database['public']['Enums']['user_tier']
          trial_ends_at: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: Database['public']['Enums']['city'] | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          languages?: Database['public']['Enums']['language'][] | null
          metadata?: Json | null
          onboarding_completed?: boolean | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database['public']['Enums']['user_tier']
          trial_ends_at?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: Database['public']['Enums']['city'] | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          languages?: Database['public']['Enums']['language'][] | null
          metadata?: Json | null
          onboarding_completed?: boolean | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database['public']['Enums']['user_tier']
          trial_ends_at?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          active: boolean | null
          availability: string | null
          bio: string | null
          city: string
          created_at: string | null
          email: string | null
          featured: boolean | null
          id: string
          languages: string[]
          name: string
          neighborhood: string | null
          phone: string | null
          photo_url: string | null
          rate_hourly: number | null
          rate_monthly: number | null
          rating: number | null
          rating_avg: number | null
          review_count: number | null
          reviews_count: number | null
          services: string[]
          specialties: string[] | null
          status: string | null
          updated_at: string | null
          verified: boolean | null
          whatsapp: string | null
          years_experience: number | null
        }
        Insert: {
          active?: boolean | null
          availability?: string | null
          bio?: string | null
          city: string
          created_at?: string | null
          email?: string | null
          featured?: boolean | null
          id?: string
          languages: string[]
          name: string
          neighborhood?: string | null
          phone?: string | null
          photo_url?: string | null
          rate_hourly?: number | null
          rate_monthly?: number | null
          rating?: number | null
          rating_avg?: number | null
          review_count?: number | null
          reviews_count?: number | null
          services: string[]
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          verified?: boolean | null
          whatsapp?: string | null
          years_experience?: number | null
        }
        Update: {
          active?: boolean | null
          availability?: string | null
          bio?: string | null
          city?: string
          created_at?: string | null
          email?: string | null
          featured?: boolean | null
          id?: string
          languages?: string[]
          name?: string
          neighborhood?: string | null
          phone?: string | null
          photo_url?: string | null
          rate_hourly?: number | null
          rate_monthly?: number | null
          rating?: number | null
          rating_avg?: number | null
          review_count?: number | null
          reviews_count?: number | null
          services?: string[]
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          verified?: boolean | null
          whatsapp?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          status: string | null
          stripe_tx_id: string | null
          tier: string
          user_email: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_tx_id?: string | null
          tier: string
          user_email: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_tx_id?: string | null
          tier?: string
          user_email?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          provider_id: string
          rating: number
          service_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          provider_id: string
          rating: number
          service_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          provider_id?: string
          rating?: number
          service_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_provider_id_fkey'
            columns: ['provider_id']
            isOneToOne: false
            referencedRelation: 'service_providers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      service_providers: {
        Row: {
          availability: Json | null
          avatar_url: string | null
          bio: string
          city: Database['public']['Enums']['city']
          created_at: string | null
          currency: string | null
          email: string | null
          featured: boolean | null
          id: string
          languages: Database['public']['Enums']['language'][]
          metadata: Json | null
          name: string
          phone: string | null
          rate_hourly: number | null
          rate_monthly: number | null
          rate_weekly: number | null
          rating_avg: number | null
          reviews_count: number | null
          search_vector: unknown | null
          services: Database['public']['Enums']['service_category'][]
          specialties: string[] | null
          status: Database['public']['Enums']['provider_status'] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
          whatsapp_number: string | null
          years_experience: number | null
        }
        Insert: {
          availability?: Json | null
          avatar_url?: string | null
          bio: string
          city: Database['public']['Enums']['city']
          created_at?: string | null
          currency?: string | null
          email?: string | null
          featured?: boolean | null
          id?: string
          languages?: Database['public']['Enums']['language'][]
          metadata?: Json | null
          name: string
          phone?: string | null
          rate_hourly?: number | null
          rate_monthly?: number | null
          rate_weekly?: number | null
          rating_avg?: number | null
          reviews_count?: number | null
          search_vector?: unknown | null
          services: Database['public']['Enums']['service_category'][]
          specialties?: string[] | null
          status?: Database['public']['Enums']['provider_status'] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          whatsapp_number?: string | null
          years_experience?: number | null
        }
        Update: {
          availability?: Json | null
          avatar_url?: string | null
          bio?: string
          city?: Database['public']['Enums']['city']
          created_at?: string | null
          currency?: string | null
          email?: string | null
          featured?: boolean | null
          id?: string
          languages?: Database['public']['Enums']['language'][]
          metadata?: Json | null
          name?: string
          phone?: string | null
          rate_hourly?: number | null
          rate_monthly?: number | null
          rate_weekly?: number | null
          rating_avg?: number | null
          reviews_count?: number | null
          search_vector?: unknown | null
          services?: Database['public']['Enums']['service_category'][]
          specialties?: string[] | null
          status?: Database['public']['Enums']['provider_status'] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          whatsapp_number?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'service_providers_verified_by_fkey'
            columns: ['verified_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      thread_posts: {
        Row: {
          body: string
          created_at: string | null
          edited_at: string | null
          id: string
          is_solution: boolean | null
          likes_count: number | null
          thread_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_solution?: boolean | null
          likes_count?: number | null
          thread_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_solution?: boolean | null
          likes_count?: number | null
          thread_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'thread_posts_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'community_threads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'thread_posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      thread_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction: string
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction: string
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'thread_reactions_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'thread_posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'thread_reactions_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'community_threads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'thread_reactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      thread_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          notify_mentions: boolean | null
          notify_replies: boolean | null
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notify_mentions?: boolean | null
          notify_replies?: boolean | null
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notify_mentions?: boolean | null
          notify_replies?: boolean | null
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'thread_subscriptions_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'community_threads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'thread_subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      typing_indicators: {
        Row: {
          channel: string
          expires_at: string | null
          id: string
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          channel: string
          expires_at?: string | null
          id?: string
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string
          expires_at?: string | null
          id?: string
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'typing_indicators_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      usage_tracking: {
        Row: {
          created_at: string | null
          id: string
          meter_type: string | null
          quantity: number | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meter_type?: string | null
          quantity?: number | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meter_type?: string | null
          quantity?: number | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_mentions: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          mentioned_user_id: string | null
          mentioning_user_id: string | null
          post_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mentioned_user_id?: string | null
          mentioning_user_id?: string | null
          post_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mentioned_user_id?: string | null
          mentioning_user_id?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_mentions_mentioned_user_id_fkey'
            columns: ['mentioned_user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_mentions_mentioning_user_id_fkey'
            columns: ['mentioning_user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_mentions_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'thread_posts'
            referencedColumns: ['id']
          },
        ]
      }
      user_preferences: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          languages_required: Database['public']['Enums']['language'][] | null
          preferred_city: Database['public']['Enums']['city']
          schedule_preference: Json | null
          services_needed: Database['public']['Enums']['service_category'][] | null
          special_requirements: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          languages_required?: Database['public']['Enums']['language'][] | null
          preferred_city: Database['public']['Enums']['city']
          schedule_preference?: Json | null
          services_needed?: Database['public']['Enums']['service_category'][] | null
          special_requirements?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          languages_required?: Database['public']['Enums']['language'][] | null
          preferred_city?: Database['public']['Enums']['city']
          schedule_preference?: Json | null
          services_needed?: Database['public']['Enums']['service_category'][] | null
          special_requirements?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      user_presence: {
        Row: {
          channel: string
          created_at: string | null
          id: string
          last_seen: string | null
          metadata: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          id?: string
          last_seen?: string | null
          metadata?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          id?: string
          last_seen?: string | null
          metadata?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_presence_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string | null
          id: string
          metadata: Json | null
          product_id: string | null
          status: string | null
          subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          product_id?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          product_id?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          preferences: Json | null
          preferred_language: string | null
          services: string[] | null
          subscription_expires_at: string | null
          subscription_id: string | null
          subscription_status: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          preferences?: Json | null
          preferred_language?: string | null
          services?: string[] | null
          subscription_expires_at?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          preferences?: Json | null
          preferred_language?: string | null
          services?: string[] | null
          subscription_expires_at?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      user_lead_summary: {
        Row: {
          avg_score: number | null
          last_activity: string | null
          tier: string | null
          total_generations: number | null
          total_leads: number | null
          user_email: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { '': unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args: { geog1: unknown; geog2: unknown } | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args: { geog1: unknown; geog2: unknown } | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { '': unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { '': string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { '': unknown } | { '': unknown }
        Returns: unknown
      }
      box2d: {
        Args: { '': unknown } | { '': unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      box3d: {
        Args: { '': unknown } | { '': unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { '': unknown }
        Returns: unknown
      }
      bytea: {
        Args: { '': unknown } | { '': unknown }
        Returns: string
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geography: {
        Args: { '': string } | { '': unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { '': unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { '': unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { '': unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { '': unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { '': unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { '': unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { '': number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { '': string }
          | { '': string }
          | { '': unknown }
          | { '': unknown }
          | { '': unknown }
          | { '': unknown }
          | { '': unknown }
          | { '': unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { '': unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { '': unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { '': unknown }
        Returns: number
      }
      geometry_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { '': unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { '': unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { '': unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { '': unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { '': number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { '': unknown } | { '': unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { '': string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { '': string }
        Returns: unknown
      }
      get_or_create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      get_proj4_from_srid: {
        Args: { '': number }
        Returns: string
      }
      get_user_conversations: {
        Args: { p_user_id: string }
        Returns: {
          conversation_id: string
          is_provider: boolean
          last_message_at: string
          last_message_preview: string
          other_user_email: string
          other_user_id: string
          other_user_name: string
          other_user_tier: string
          unread_count: number
        }[]
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { '': unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { '': unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { '': unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      increment_thread_views: {
        Args: { thread_id: string }
        Returns: undefined
      }
      json: {
        Args: { '': unknown }
        Returns: Json
      }
      jsonb: {
        Args: { '': unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_messages_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      path: {
        Args: { '': unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { '': unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { '': unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { '': unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { '': unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { '': unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { '': unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { '': unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { '': unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { '': unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { '': unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { '': unknown }
        Returns: string
      }
      point: {
        Args: { '': unknown }
        Returns: unknown
      }
      polygon: {
        Args: { '': unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args: { tbl_oid: unknown; use_typmod?: boolean } | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { '': unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { '': unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { '': unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { '': unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { '': unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { '': unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { '': unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { '': number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { '': number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { '': number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      send_message: {
        Args: {
          p_attachments?: Json
          p_message: string
          p_message_type?: string
          p_receiver_id: string
          p_sender_id: string
        }
        Returns: string
      }
      set_limit: {
        Args: { '': number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { '': string }
        Returns: string[]
      }
      spheroid_in: {
        Args: { '': unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { '': unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { '': unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args: { '': string } | { '': unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { '': unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { '': unknown } | { '': unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { '': unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { '': string } | { '': unknown } | { '': unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { '': string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { '': string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { '': unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { '': string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { '': string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { '': string } | { '': unknown } | { '': unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args: { geog1: unknown; geog2: unknown } | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { '': string } | { '': unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { '': unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { '': unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args: { geog1: unknown; geog2: unknown } | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args: { geog1: unknown; geog2: unknown } | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { '': unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { '': unknown }
        Returns: Database['public']['CompositeTypes']['geometry_dump'][]
      }
      st_dumppoints: {
        Args: { '': unknown }
        Returns: Database['public']['CompositeTypes']['geometry_dump'][]
      }
      st_dumprings: {
        Args: { '': unknown }
        Returns: Database['public']['CompositeTypes']['geometry_dump'][]
      }
      st_dumpsegments: {
        Args: { '': unknown }
        Returns: Database['public']['CompositeTypes']['geometry_dump'][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args: { area: unknown; npoints: number } | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_geohash: {
        Args: { geog: unknown; maxchars?: number } | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { '': unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { '': Json } | { '': Json } | { '': string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { '': string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args: { geog1: unknown; geog2: unknown } | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database['public']['CompositeTypes']['valid_detail']
      }
      st_isvalidreason: {
        Args: { '': unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { '': unknown }
        Returns: boolean
      }
      st_length: {
        Args: { '': string } | { '': unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { '': unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { '': unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { '': unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { '': unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { '': unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { '': unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { '': unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { '': unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_multi: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_ndims: {
        Args: { '': unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { '': unknown }
        Returns: number
      }
      st_nrings: {
        Args: { '': unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { '': unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { '': unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { '': unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { '': unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { '': unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { '': unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { '': unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_points: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { '': string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { '': string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { '': unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { '': unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { '': unknown } | { '': unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { '': unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { '': string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { '': unknown }
        Returns: number
      }
      st_xmax: {
        Args: { '': unknown }
        Returns: number
      }
      st_xmin: {
        Args: { '': unknown }
        Returns: number
      }
      st_y: {
        Args: { '': unknown }
        Returns: number
      }
      st_ymax: {
        Args: { '': unknown }
        Returns: number
      }
      st_ymin: {
        Args: { '': unknown }
        Returns: number
      }
      st_z: {
        Args: { '': unknown }
        Returns: number
      }
      st_zmax: {
        Args: { '': unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { '': unknown }
        Returns: number
      }
      st_zmin: {
        Args: { '': unknown }
        Returns: number
      }
      text: {
        Args: { '': unknown }
        Returns: string
      }
      unaccent: {
        Args: { '': string }
        Returns: string
      }
      unaccent_init: {
        Args: { '': unknown }
        Returns: unknown
      }
      unlockrows: {
        Args: { '': string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      city: 'medellin' | 'florianopolis'
      intro_status: 'pending' | 'accepted' | 'declined' | 'expired'
      language: 'english' | 'spanish' | 'portuguese' | 'french' | 'german' | 'italian'
      provider_status: 'pending' | 'verified' | 'suspended'
      service_category:
        | 'cleaning'
        | 'cooking'
        | 'meal_prep'
        | 'childcare'
        | 'pet_care'
        | 'gardening'
        | 'handyman'
        | 'other'
      thread_category:
        | 'general'
        | 'housing'
        | 'services'
        | 'social'
        | 'visa'
        | 'safety'
        | 'recommendations'
      user_tier: 'free' | 'premium' | 'admin'
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      city: ['medellin', 'florianopolis'],
      intro_status: ['pending', 'accepted', 'declined', 'expired'],
      language: ['english', 'spanish', 'portuguese', 'french', 'german', 'italian'],
      provider_status: ['pending', 'verified', 'suspended'],
      service_category: [
        'cleaning',
        'cooking',
        'meal_prep',
        'childcare',
        'pet_care',
        'gardening',
        'handyman',
        'other',
      ],
      thread_category: [
        'general',
        'housing',
        'services',
        'social',
        'visa',
        'safety',
        'recommendations',
      ],
      user_tier: ['free', 'premium', 'admin'],
    },
  },
} as const
