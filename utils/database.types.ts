export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity: string | null
          token_hash: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          token_hash: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          token_hash?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          permissions: Json
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_category: string | null
          event_name: string
          event_properties: Json
          id: string
          ip_address: string | null
          page_path: string | null
          page_title: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_category?: string | null
          event_name: string
          event_properties?: Json
          id?: string
          ip_address?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_category?: string | null
          event_name?: string
          event_properties?: Json
          id?: string
          ip_address?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
        Relationships: []
      }
      booking_notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          push_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          reminder_1hr: boolean | null
          reminder_24hr: boolean | null
          reminder_custom_minutes: number | null
          sms_enabled: boolean | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_1hr?: boolean | null
          reminder_24hr?: boolean | null
          reminder_custom_minutes?: number | null
          sms_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_1hr?: boolean | null
          reminder_24hr?: boolean | null
          reminder_custom_minutes?: number | null
          sms_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      booking_reminders: {
        Row: {
          booking_id: string | null
          channel: string[] | null
          created_at: string | null
          id: string
          last_error: string | null
          reminder_type: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          channel?: string[] | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          reminder_type: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          channel?: string[] | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          reminder_type?: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      booking_reviews: {
        Row: {
          booking_id: string | null
          communication: number | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          provider_id: string | null
          provider_responded_at: string | null
          provider_response: string | null
          punctuality: number | null
          rating: number
          review_text: string | null
          service_quality: number | null
          updated_at: string | null
          user_id: string | null
          value_for_money: number | null
          would_recommend: boolean | null
        }
        Insert: {
          booking_id?: string | null
          communication?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          provider_id?: string | null
          provider_responded_at?: string | null
          provider_response?: string | null
          punctuality?: number | null
          rating: number
          review_text?: string | null
          service_quality?: number | null
          updated_at?: string | null
          user_id?: string | null
          value_for_money?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          booking_id?: string | null
          communication?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          provider_id?: string | null
          provider_responded_at?: string | null
          provider_response?: string | null
          punctuality?: number | null
          rating?: number
          review_text?: string | null
          service_quality?: number | null
          updated_at?: string | null
          user_id?: string | null
          value_for_money?: number | null
          would_recommend?: boolean | null
        }
        Relationships: []
      }
      booking_slots: {
        Row: {
          block_reason: string | null
          created_at: string | null
          current_bookings: number | null
          date: string
          end_time: string
          id: string
          is_available: boolean | null
          is_blocked: boolean | null
          max_bookings: number | null
          provider_id: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          block_reason?: string | null
          created_at?: string | null
          current_bookings?: number | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean | null
          is_blocked?: boolean | null
          max_bookings?: number | null
          provider_id?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          block_reason?: string | null
          created_at?: string | null
          current_bookings?: number | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          is_blocked?: boolean | null
          max_bookings?: number | null
          provider_id?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      booking_status_history: {
        Row: {
          booking_id: string | null
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          metadata: Json
          new_status: string
          old_status: string | null
        }
        Insert: {
          booking_id?: string | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json
          new_status: string
          old_status?: string | null
        }
        Update: {
          booking_id?: string | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json
          new_status?: string
          old_status?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          attachments: Json
          booking_date: string
          cancellation_fee: number | null
          cancellation_policy: Json
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          confirmed_at: string | null
          conversation_id: string | null
          created_at: string | null
          currency: string | null
          duration_minutes: number
          end_time: string
          hourly_rate: number | null
          id: string
          is_recurring: boolean | null
          location_details: Json
          parent_booking_id: string | null
          payment_intent_id: string | null
          payment_status: string | null
          provider_id: string | null
          recurring_group_id: string | null
          recurring_pattern: Json
          service_type: string[]
          special_instructions: string | null
          start_time: string
          status: string
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json
          booking_date: string
          cancellation_fee?: number | null
          cancellation_policy?: Json
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          currency?: string | null
          duration_minutes: number
          end_time: string
          hourly_rate?: number | null
          id?: string
          is_recurring?: boolean | null
          location_details?: Json
          parent_booking_id?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          provider_id?: string | null
          recurring_group_id?: string | null
          recurring_pattern?: Json
          service_type: string[]
          special_instructions?: string | null
          start_time: string
          status?: string
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json
          booking_date?: string
          cancellation_fee?: number | null
          cancellation_policy?: Json
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          currency?: string | null
          duration_minutes?: number
          end_time?: string
          hourly_rate?: number | null
          id?: string
          is_recurring?: boolean | null
          location_details?: Json
          parent_booking_id?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          provider_id?: string | null
          recurring_group_id?: string | null
          recurring_pattern?: Json
          service_type?: string[]
          special_instructions?: string | null
          start_time?: string
          status?: string
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      community_events: {
        Row: {
          attendees_count: number | null
          capacity: number | null
          created_at: string | null
          description: string | null
          end_at: string
          host_id: string | null
          id: string
          is_online: boolean | null
          location: string | null
          meeting_link: string | null
          start_at: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees_count?: number | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          end_at: string
          host_id?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_at: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees_count?: number | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          end_at?: string
          host_id?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_at?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_threads: {
        Row: {
          body: string
          category: string
          city_tag: string | null
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          replies_count: number | null
          search_vector: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          body: string
          category: string
          city_tag?: string | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          replies_count?: number | null
          search_vector?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          body?: string
          category?: string
          city_tag?: string | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          replies_count?: number | null
          search_vector?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
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
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          metadata: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          metadata?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          metadata?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          attachments: Json
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
          reactions: Json
          receiver_id: string | null
          reply_to_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: Json
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
          reactions?: Json
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: Json
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
          reactions?: Json
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          attended_at: string | null
          event_id: string | null
          id: string
          registered_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          attended_at?: string | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          attended_at?: string | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          niche: string
          status?: string | null
          user_email: string
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          niche?: string
          status?: string | null
          user_email?: string
          user_id?: string | null
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
          user_id?: string
        }
        Relationships: []
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
          intro_requested: boolean | null
          intro_requested_at: string | null
          last_interaction_at: string | null
          match_score: number | null
          metadata: Json
          notes: Json
          provider_id: string
          score: number
          status: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          ai_model?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          explanation: string
          id?: string
          intro_requested?: boolean | null
          intro_requested_at?: string | null
          last_interaction_at?: string | null
          match_score?: number | null
          metadata?: Json
          notes?: Json
          provider_id: string
          score: number
          status?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          ai_model?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          explanation?: string
          id?: string
          intro_requested?: boolean | null
          intro_requested_at?: string | null
          last_interaction_at?: string | null
          match_score?: number | null
          metadata?: Json
          notes?: Json
          provider_id?: string
          score?: number
          status?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          data: Json
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      platform_analytics: {
        Row: {
          active_bookings: number | null
          active_providers: number | null
          active_users_30d: number | null
          active_users_7d: number | null
          avg_booking_value: number | null
          avg_match_score: number | null
          booking_completion_rate: number | null
          created_at: string | null
          date: string
          id: string
          intro_acceptance_rate: number | null
          new_bookings: number | null
          new_signups: number | null
          revenue_total: number | null
          total_bookings: number | null
          total_intros: number | null
          total_matches: number | null
          total_providers: number | null
          total_searches: number | null
          total_users: number | null
        }
        Insert: {
          active_bookings?: number | null
          active_providers?: number | null
          active_users_30d?: number | null
          active_users_7d?: number | null
          avg_booking_value?: number | null
          avg_match_score?: number | null
          booking_completion_rate?: number | null
          created_at?: string | null
          date: string
          id?: string
          intro_acceptance_rate?: number | null
          new_bookings?: number | null
          new_signups?: number | null
          revenue_total?: number | null
          total_bookings?: number | null
          total_intros?: number | null
          total_matches?: number | null
          total_providers?: number | null
          total_searches?: number | null
          total_users?: number | null
        }
        Update: {
          active_bookings?: number | null
          active_providers?: number | null
          active_users_30d?: number | null
          active_users_7d?: number | null
          avg_booking_value?: number | null
          avg_match_score?: number | null
          booking_completion_rate?: number | null
          created_at?: string | null
          date?: string
          id?: string
          intro_acceptance_rate?: number | null
          new_bookings?: number | null
          new_signups?: number | null
          revenue_total?: number | null
          total_bookings?: number | null
          total_intros?: number | null
          total_matches?: number | null
          total_providers?: number | null
          total_searches?: number | null
          total_users?: number | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          intro_call_link: string | null
          languages: string[] | null
          location_address: string | null
          location_coordinates: Json
          membership_level: string | null
          onboarding_complete: boolean | null
          phone: string | null
          preferences: Json
          role: string | null
          tier: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          intro_call_link?: string | null
          languages?: string[] | null
          location_address?: string | null
          location_coordinates?: Json
          membership_level?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          preferences?: Json
          role?: string | null
          tier?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          intro_call_link?: string | null
          languages?: string[] | null
          location_address?: string | null
          location_coordinates?: Json
          membership_level?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          preferences?: Json
          role?: string | null
          tier?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      provider_approval_queue: {
        Row: {
          admin_notes: string | null
          background_check_status: string | null
          created_at: string | null
          documents_status: string | null
          final_status: string | null
          id: string
          id_verification_status: string | null
          provider_id: string | null
          references_status: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          background_check_status?: string | null
          created_at?: string | null
          documents_status?: string | null
          final_status?: string | null
          id?: string
          id_verification_status?: string | null
          provider_id?: string | null
          references_status?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          background_check_status?: string | null
          created_at?: string | null
          documents_status?: string | null
          final_status?: string | null
          id?: string
          id_verification_status?: string | null
          provider_id?: string | null
          references_status?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_calendar_sync: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          provider: string
          provider_id: string | null
          refresh_token: string | null
          sync_direction: string | null
          sync_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          provider: string
          provider_id?: string | null
          refresh_token?: string | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          provider?: string
          provider_id?: string | null
          refresh_token?: string | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          hourly_rate: number | null
          id: string
          languages: string[] | null
          name: string
          phone: string | null
          rating_avg: number | null
          reviews_count: number | null
          services: string[] | null
          specialties: string[] | null
          status: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          name: string
          phone?: string | null
          rating_avg?: number | null
          reviews_count?: number | null
          services?: string[] | null
          specialties?: string[] | null
          status?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          name?: string
          phone?: string | null
          rating_avg?: number | null
          reviews_count?: number | null
          services?: string[] | null
          specialties?: string[] | null
          status?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json
          product_id: string
          status: string | null
          subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json
          product_id: string
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json
          product_id?: string
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          provider_id: string | null
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          provider_id?: string | null
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          provider_id?: string | null
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          last_used_at: string | null
          name: string
          notification_enabled: boolean | null
          notification_frequency: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          last_used_at?: string | null
          name: string
          notification_enabled?: boolean | null
          notification_frequency?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          last_used_at?: string | null
          name?: string
          notification_enabled?: boolean | null
          notification_frequency?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          budget_range: string | null
          city_filter: string | null
          created_at: string | null
          id: string
          language_filter: string[] | null
          location: Json
          matched_count: number | null
          query: string | null
          query_type: string | null
          results_clicked: string[] | null
          results_count: number | null
          search_vector: string | null
          service_filter: string[] | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          city_filter?: string | null
          created_at?: string | null
          id?: string
          language_filter?: string[] | null
          location?: Json
          matched_count?: number | null
          query?: string | null
          query_type?: string | null
          results_clicked?: string[] | null
          results_count?: number | null
          search_vector?: string | null
          service_filter?: string[] | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          city_filter?: string | null
          created_at?: string | null
          id?: string
          language_filter?: string[] | null
          location?: Json
          matched_count?: number | null
          query?: string | null
          query_type?: string | null
          results_clicked?: string[] | null
          results_count?: number | null
          search_vector?: string | null
          service_filter?: string[] | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_agreements: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          deposit_amount: number | null
          effective_date: string | null
          end_date: string | null
          id: string
          payment_terms: Json
          provider_id: string | null
          renewal_date: string | null
          service_details: Json
          status: string | null
          terms: Json
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          effective_date?: string | null
          end_date?: string | null
          id?: string
          payment_terms?: Json
          provider_id?: string | null
          renewal_date?: string | null
          service_details?: Json
          status?: string | null
          terms?: Json
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          effective_date?: string | null
          end_date?: string | null
          id?: string
          payment_terms?: Json
          provider_id?: string | null
          renewal_date?: string | null
          service_details?: Json
          status?: string | null
          terms?: Json
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          accept_terms: boolean | null
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          city: string | null
          created_at: string | null
          description: string | null
          email: string | null
          hourly_rate: number | null
          id: string
          intro_offer: string | null
          is_active: boolean | null
          languages: string[] | null
          location: string | null
          name: string | null
          notification_preferences: Json
          phone: string | null
          portfolio_urls: string[] | null
          price_range: string | null
          rating_avg: number | null
          references: Json
          response_time_minutes: number | null
          reviews_count: number | null
          service_areas: string[] | null
          service_type: string[] | null
          services: string[] | null
          specialties: string[] | null
          status: string | null
          stripe_account_id: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp: string | null
          work_days: string[] | null
          work_hours: Json
          years_experience: number | null
        }
        Insert: {
          accept_terms?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          intro_offer?: string | null
          is_active?: boolean | null
          languages?: string[] | null
          location?: string | null
          name?: string | null
          notification_preferences?: Json
          phone?: string | null
          portfolio_urls?: string[] | null
          price_range?: string | null
          rating_avg?: number | null
          references?: Json
          response_time_minutes?: number | null
          reviews_count?: number | null
          service_areas?: string[] | null
          service_type?: string[] | null
          services?: string[] | null
          specialties?: string[] | null
          status?: string | null
          stripe_account_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
          work_days?: string[] | null
          work_hours?: Json
          years_experience?: number | null
        }
        Update: {
          accept_terms?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          intro_offer?: string | null
          is_active?: boolean | null
          languages?: string[] | null
          location?: string | null
          name?: string | null
          notification_preferences?: Json
          phone?: string | null
          portfolio_urls?: string[] | null
          price_range?: string | null
          rating_avg?: number | null
          references?: Json
          response_time_minutes?: number | null
          reviews_count?: number | null
          service_areas?: string[] | null
          service_type?: string[] | null
          services?: string[] | null
          specialties?: string[] | null
          status?: string | null
          stripe_account_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
          work_days?: string[] | null
          work_hours?: Json
          years_experience?: number | null
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          attachments: Json
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string | null
          sender_type: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id?: string | null
          sender_type?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string | null
          sender_type?: string | null
          ticket_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          closed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          last_activity_at: string | null
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          tags: string[] | null
          ticket_number: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          last_activity_at?: string | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          tags?: string[] | null
          ticket_number: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          last_activity_at?: string | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          tags?: string[] | null
          ticket_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      thread_posts: {
        Row: {
          body: string
          created_at: string | null
          edited_at: string | null
          id: string
          is_accepted_answer: boolean | null
          is_deleted: boolean | null
          likes_count: number | null
          parent_post_id: string | null
          thread_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_accepted_answer?: boolean | null
          is_deleted?: boolean | null
          likes_count?: number | null
          parent_post_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_accepted_answer?: boolean | null
          is_deleted?: boolean | null
          likes_count?: number | null
          parent_post_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      thread_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thread_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          last_notified_at: string | null
          notification_enabled: boolean | null
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_notified_at?: string | null
          notification_enabled?: boolean | null
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_notified_at?: string | null
          notification_enabled?: boolean | null
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          last_typed_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          last_typed_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          last_typed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string | null
          feature: string
          id: string
          overage_allowed: boolean | null
          overage_used: number | null
          reset_at: string | null
          tier: string | null
          tier_limit: number | null
          updated_at: string | null
          usage: number | null
          user_id: string | null
        }
        Insert: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          feature: string
          id?: string
          overage_allowed?: boolean | null
          overage_used?: number | null
          reset_at?: string | null
          tier?: string | null
          tier_limit?: number | null
          updated_at?: string | null
          usage?: number | null
          user_id?: string | null
        }
        Update: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          feature?: string
          id?: string
          overage_allowed?: boolean | null
          overage_used?: number | null
          reset_at?: string | null
          tier?: string | null
          tier_limit?: number | null
          updated_at?: string | null
          usage?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_lead_summary: {
        Row: {
          created_at: string | null
          email_address: string
          id: string
          lead_count: number | null
          niche_counts: Json
        }
        Insert: {
          created_at?: string | null
          email_address: string
          id?: string
          lead_count?: number | null
          niche_counts?: Json
        }
        Update: {
          created_at?: string | null
          email_address?: string
          id?: string
          lead_count?: number | null
          niche_counts?: Json
        }
        Relationships: []
      }
      user_mentions: {
        Row: {
          created_at: string | null
          id: string
          mentioned_at: string | null
          mentioned_by: string | null
          mentioned_user: string | null
          post_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentioned_at?: string | null
          mentioned_by?: string | null
          mentioned_user?: string | null
          post_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mentioned_at?: string | null
          mentioned_by?: string | null
          mentioned_user?: string | null
          post_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          budget_range: string | null
          communication_preferences: Json
          created_at: string | null
          id: string
          language_preference: string | null
          notification_preferences: Json
          preferred_cities: string[] | null
          preferred_languages: string[] | null
          preferred_payment_methods: string[] | null
          preferred_service_times: Json
          preferred_services: string[] | null
          search_radius_km: number | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          communication_preferences?: Json
          created_at?: string | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json
          preferred_cities?: string[] | null
          preferred_languages?: string[] | null
          preferred_payment_methods?: string[] | null
          preferred_service_times?: Json
          preferred_services?: string[] | null
          search_radius_km?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          communication_preferences?: Json
          created_at?: string | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json
          preferred_cities?: string[] | null
          preferred_languages?: string[] | null
          preferred_payment_methods?: string[] | null
          preferred_service_times?: Json
          preferred_services?: string[] | null
          search_radius_km?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          id: string
          last_seen_at: string | null
          status: string | null
          status_emoji: string | null
          status_message: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_seen_at?: string | null
          status?: string | null
          status_emoji?: string | null
          status_message?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_seen_at?: string | null
          status?: string | null
          status_emoji?: string | null
          status_message?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          is_active: boolean | null
          metadata: Json
          plan_id: string
          status: string | null
          subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json
          plan_id: string
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json
          plan_id?: string
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location_address: string | null
          location_coordinates: Json
          onboarding_complete: boolean | null
          phone: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location_address?: string | null
          location_coordinates?: Json
          onboarding_complete?: boolean | null
          phone?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location_address?: string | null
          location_coordinates?: Json
          onboarding_complete?: boolean | null
          phone?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      voice_search_transcripts: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          duration_ms: number | null
          id: string
          is_final: boolean | null
          language: string | null
          processed_query: string | null
          raw_transcript: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          is_final?: boolean | null
          language?: string | null
          processed_query?: string | null
          raw_transcript: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          is_final?: boolean | null
          language?: string | null
          processed_query?: string | null
          raw_transcript?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never