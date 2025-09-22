export interface Database {
  public: {
    Tables: {
      illia_leads: {
        Row: {
          id: string
          user_email: string
          niche: string
          zip_code: string
          name: string
          email: string | null
          phone: string | null
          score: number
          notes: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_email: string
          niche: string
          zip_code: string
          name: string
          email?: string | null
          phone?: string | null
          score: number
          notes?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_email?: string
          niche?: string
          zip_code?: string
          name?: string
          email?: string | null
          phone?: string | null
          score?: number
          notes?: string | null
          status?: string | null
          created_at?: string
        }
      }
      illia_leads_logs: {
        Row: {
          id: string
          user_email: string
          niche: string | null
          zip_code: string | null
          count: number | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_email: string
          niche?: string | null
          zip_code?: string | null
          count?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_email?: string
          niche?: string | null
          zip_code?: string | null
          count?: number | null
          status?: string | null
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_email: string
          tier: 'basic' | 'pro' | 'enterprise'
          stripe_tx_id: string | null
          amount: number
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_email: string
          tier: 'basic' | 'pro' | 'enterprise'
          stripe_tx_id?: string | null
          amount: number
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_email?: string
          tier?: 'basic' | 'pro' | 'enterprise'
          stripe_tx_id?: string | null
          amount?: number
          status?: string | null
          created_at?: string
        }
      }
    }
  }
}
