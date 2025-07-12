export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      artisan_applications: {
        Row: {
          admin_notes: string | null
          business_name: string | null
          category_id: string | null
          city_id: string | null
          created_at: string
          description: string | null
          email: string
          experience_years: number | null
          id: string
          name: string
          payment_receipt_url: string | null
          phone: string | null
          processed_at: string | null
          processed_by: string | null
          specialties: string[] | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          business_name?: string | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          email: string
          experience_years?: number | null
          id?: string
          name: string
          payment_receipt_url?: string | null
          phone?: string | null
          processed_at?: string | null
          processed_by?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          business_name?: string | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          email?: string
          experience_years?: number | null
          id?: string
          name?: string
          payment_receipt_url?: string | null
          phone?: string | null
          processed_at?: string | null
          processed_by?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_applications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_applications_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_profiles: {
        Row: {
          address: string | null
          availability_schedule: Json | null
          business_name: string | null
          category_id: string
          certifications: string[] | null
          city_id: string | null
          created_at: string | null
          description: string | null
          experience_years: number | null
          featured_until: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          portfolio_images: string[] | null
          rating_average: number | null
          rating_count: number | null
          response_time_hours: number | null
          service_radius: number | null
          specialties: string[] | null
          total_projects: number | null
          updated_at: string | null
          user_id: string
          verification_date: string | null
          verification_documents: string[] | null
        }
        Insert: {
          address?: string | null
          availability_schedule?: Json | null
          business_name?: string | null
          category_id: string
          certifications?: string[] | null
          city_id?: string | null
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          featured_until?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          portfolio_images?: string[] | null
          rating_average?: number | null
          rating_count?: number | null
          response_time_hours?: number | null
          service_radius?: number | null
          specialties?: string[] | null
          total_projects?: number | null
          updated_at?: string | null
          user_id: string
          verification_date?: string | null
          verification_documents?: string[] | null
        }
        Update: {
          address?: string | null
          availability_schedule?: Json | null
          business_name?: string | null
          category_id?: string
          certifications?: string[] | null
          city_id?: string | null
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          featured_until?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          portfolio_images?: string[] | null
          rating_average?: number | null
          rating_count?: number | null
          response_time_hours?: number | null
          service_radius?: number | null
          specialties?: string[] | null
          total_projects?: number | null
          updated_at?: string | null
          user_id?: string
          verification_date?: string | null
          verification_documents?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_views: {
        Row: {
          artisan_id: string
          created_at: string | null
          id: string
          user_agent: string | null
          viewer_id: string | null
          viewer_ip: string | null
        }
        Insert: {
          artisan_id: string
          created_at?: string | null
          id?: string
          user_agent?: string | null
          viewer_id?: string | null
          viewer_ip?: string | null
        }
        Update: {
          artisan_id?: string
          created_at?: string | null
          id?: string
          user_agent?: string | null
          viewer_id?: string | null
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_views_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          emoji: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          region: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          region?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          artisan_id: string
          client_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          artisan_id: string
          client_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          artisan_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          project_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          project_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          project_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cin: string | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          name: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cin?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name: string
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cin?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_views: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          user_agent: string | null
          viewer_id: string | null
          viewer_ip: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          user_agent?: string | null
          viewer_id?: string | null
          viewer_ip?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          user_agent?: string | null
          viewer_id?: string | null
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          artisan_id: string | null
          budget_max: number | null
          budget_min: number | null
          category_id: string
          city_id: string | null
          client_id: string
          completed_at: string | null
          created_at: string | null
          description: string
          expires_at: string | null
          flexible_timing: boolean | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          preferred_date: string | null
          proposals_count: number | null
          required_skills: string[] | null
          started_at: string | null
          status: string | null
          title: string
          updated_at: string | null
          urgency: string | null
          views_count: number | null
        }
        Insert: {
          address?: string | null
          artisan_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category_id: string
          city_id?: string | null
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          flexible_timing?: boolean | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          preferred_date?: string | null
          proposals_count?: number | null
          required_skills?: string[] | null
          started_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
          views_count?: number | null
        }
        Update: {
          address?: string | null
          artisan_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string
          city_id?: string | null
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          flexible_timing?: boolean | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          preferred_date?: string | null
          proposals_count?: number | null
          required_skills?: string[] | null
          started_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          additional_notes: string | null
          artisan_id: string
          created_at: string | null
          estimated_duration: string | null
          estimated_start_date: string | null
          id: string
          is_featured: boolean | null
          message: string
          project_id: string
          proposed_price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          artisan_id: string
          created_at?: string | null
          estimated_duration?: string | null
          estimated_start_date?: string | null
          id?: string
          is_featured?: boolean | null
          message: string
          project_id: string
          proposed_price: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          artisan_id?: string
          created_at?: string | null
          estimated_duration?: string | null
          estimated_start_date?: string | null
          id?: string
          is_featured?: boolean | null
          message?: string
          project_id?: string
          proposed_price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          communication_rating: number | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          project_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          timeliness_rating: number | null
          title: string | null
          updated_at: string | null
          work_quality_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          project_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          timeliness_rating?: number | null
          title?: string | null
          updated_at?: string | null
          work_quality_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          project_id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          timeliness_rating?: number | null
          title?: string | null
          updated_at?: string | null
          work_quality_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
