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
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          emoji: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          emoji?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          emoji?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: string
          name: string
          region: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          region?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          region?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'client' | 'artisan'
          phone: string | null
          cin: string | null
          city: string | null
          is_verified: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'client' | 'artisan'
          phone?: string | null
          cin?: string | null
          city?: string | null
          is_verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'client' | 'artisan'
          phone?: string | null
          cin?: string | null
          city?: string | null
          is_verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      artisan_profiles: {
        Row: {
          id: string
          user_id: string
          category_id: string
          city_id: string | null
          business_name: string | null
          description: string | null
          experience_years: number
          hourly_rate: number | null
          specialties: string[] | null
          certifications: string[] | null
          portfolio_images: string[] | null
          availability_schedule: Json | null
          service_radius: number
          is_verified: boolean
          verification_date: string | null
          verification_documents: string[] | null
          rating_average: number
          rating_count: number
          total_projects: number
          response_time_hours: number
          languages: string[]
          is_active: boolean
          is_featured: boolean
          featured_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          city_id?: string | null
          business_name?: string | null
          description?: string | null
          experience_years?: number
          hourly_rate?: number | null
          specialties?: string[] | null
          certifications?: string[] | null
          portfolio_images?: string[] | null
          availability_schedule?: Json | null
          service_radius?: number
          is_verified?: boolean
          verification_date?: string | null
          verification_documents?: string[] | null
          rating_average?: number
          rating_count?: number
          total_projects?: number
          response_time_hours?: number
          languages?: string[]
          is_active?: boolean
          is_featured?: boolean
          featured_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          city_id?: string | null
          business_name?: string | null
          description?: string | null
          experience_years?: number
          hourly_rate?: number | null
          specialties?: string[] | null
          certifications?: string[] | null
          portfolio_images?: string[] | null
          availability_schedule?: Json | null
          service_radius?: number
          is_verified?: boolean
          verification_date?: string | null
          verification_documents?: string[] | null
          rating_average?: number
          rating_count?: number
          total_projects?: number
          response_time_hours?: number
          languages?: string[]
          is_active?: boolean
          is_featured?: boolean
          featured_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artisan_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
    : never = never,
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
    : never = never,
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
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Helper types for the artisan data
export type ArtisanProfile = Tables<'artisan_profiles'> & {
  profiles: Tables<'profiles'>
  categories: Tables<'categories'>
  cities: Tables<'cities'> | null
}

export type Category = Tables<'categories'>
export type City = Tables<'cities'>
export type Profile = Tables<'profiles'>
