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
      custom_foods: {
        Row: {
          brand: string | null
          calories: number
          carbs: number
          created_at: string | null
          fat: number
          id: string
          name: string
          protein: number
          serving_size: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          calories: number
          carbs: number
          created_at?: string | null
          fat: number
          id?: string
          name: string
          protein: number
          serving_size: string
          user_id: string
        }
        Update: {
          brand?: string | null
          calories?: number
          carbs?: number
          created_at?: string | null
          fat?: number
          id?: string
          name?: string
          protein?: number
          serving_size?: string
          user_id?: string
        }
        Relationships: []
      }
      error_reports: {
        Row: {
          additional_info: string | null
          component_stack: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          id: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          additional_info?: string | null
          component_stack?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          id?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          additional_info?: string | null
          component_stack?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      forum_likes: {
        Row: {
          created_at: string
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_reports_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          id: string
          metric_type: Database["public"]["Enums"]["health_metric_type"]
          recorded_at: string
          source: string
          user_id: string
          value: number
        }
        Insert: {
          id?: string
          metric_type: Database["public"]["Enums"]["health_metric_type"]
          recorded_at?: string
          source?: string
          user_id: string
          value: number
        }
        Update: {
          id?: string
          metric_type?: Database["public"]["Enums"]["health_metric_type"]
          recorded_at?: string
          source?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          date: string
          fat: number
          food_name: string
          id: string
          meal_type: string
          protein: number
          serving_size: string | null
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          date?: string
          fat: number
          food_name: string
          id?: string
          meal_type: string
          protein: number
          serving_size?: string | null
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          date?: string
          fat?: number
          food_name?: string
          id?: string
          meal_type?: string
          protein?: number
          serving_size?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nutritional_info: {
        Row: {
          barcode: string | null
          calcium: number
          calcium_unit: string
          carbohydrates: number
          carbohydrates_unit: string
          created_at: string
          fats: number
          fats_unit: string
          food_item: string
          id: string
          kcal: number
          kcal_unit: string
          protein: number
          protein_unit: string
          provider: Database["public"]["Enums"]["provider_type"]
          salt: number
          salt_unit: string
          saturates: number
          saturates_unit: string
          search_text: unknown | null
          serving_size: string
          sugar: number
          sugar_unit: string
        }
        Insert: {
          barcode?: string | null
          calcium: number
          calcium_unit?: string
          carbohydrates: number
          carbohydrates_unit?: string
          created_at?: string
          fats: number
          fats_unit?: string
          food_item: string
          id?: string
          kcal: number
          kcal_unit?: string
          protein: number
          protein_unit?: string
          provider: Database["public"]["Enums"]["provider_type"]
          salt: number
          salt_unit?: string
          saturates: number
          saturates_unit?: string
          search_text?: unknown | null
          serving_size: string
          sugar: number
          sugar_unit?: string
        }
        Update: {
          barcode?: string | null
          calcium?: number
          calcium_unit?: string
          carbohydrates?: number
          carbohydrates_unit?: string
          created_at?: string
          fats?: number
          fats_unit?: string
          food_item?: string
          id?: string
          kcal?: number
          kcal_unit?: string
          protein?: number
          protein_unit?: string
          provider?: Database["public"]["Enums"]["provider_type"]
          salt?: number
          salt_unit?: string
          saturates?: number
          saturates_unit?: string
          search_text?: unknown | null
          serving_size?: string
          sugar?: number
          sugar_unit?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_method: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_method: string
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_method?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          height: number
          id: string
          is_premium: boolean
          last_name: string
          nickname: string | null
          username: string | null
          weight: number
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          height: number
          id: string
          is_premium?: boolean
          last_name: string
          nickname?: string | null
          username?: string | null
          weight: number
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          height?: number
          id?: string
          is_premium?: boolean
          last_name?: string
          nickname?: string | null
          username?: string | null
          weight?: number
        }
        Relationships: []
      }
      serving_size_options: {
        Row: {
          description: string
          grams: number
          id: string
          is_default: boolean | null
          nutritional_info_id: string
        }
        Insert: {
          description: string
          grams: number
          id?: string
          is_default?: boolean | null
          nutritional_info_id: string
        }
        Update: {
          description?: string
          grams?: number
          id?: string
          is_default?: boolean | null
          nutritional_info_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "serving_size_options_nutritional_info_id_fkey"
            columns: ["nutritional_info_id"]
            isOneToOne: false
            referencedRelation: "nutritional_info"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_food_swaps: {
        Args: {
          meal_date: string
          user_id: string
        }
        Returns: {
          original_food: string
          suggested_food: string
          reason: string
          calorie_difference: number
          protein_difference: number
        }[]
      }
    }
    Enums: {
      food_category_type:
        | "Dairy & Eggs"
        | "Fruits & Vegetables"
        | "Meat & Fish"
        | "Bread & Bakery"
        | "Drinks"
        | "Snacks"
        | "Ready Meals"
        | "Cereals"
        | "Pasta & Rice"
        | "Condiments"
        | "Frozen Foods"
        | "All Categories"
      health_metric_type:
        | "activity"
        | "heart-rate"
        | "steps"
        | "weight"
        | "height"
      provider_type:
        | "Tesco"
        | "Sainsburys"
        | "Asda"
        | "Morrisons"
        | "Waitrose"
        | "Coop"
        | "M&S"
        | "Ocado"
        | "Generic"
        | "Aldi"
      supermarket_type:
        | "Tesco"
        | "Sainsburys"
        | "Asda"
        | "Morrisons"
        | "Waitrose"
        | "Coop"
        | "M&S"
        | "Ocado"
        | "All Supermarkets"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
