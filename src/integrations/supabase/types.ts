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
      nutritional_info: {
        Row: {
          calcium: number
          calcium_unit: string | null
          carbohydrates: number
          carbohydrates_unit: string | null
          created_at: string
          fats: number
          fats_unit: string | null
          food_item: string
          id: string
          kcal: number
          kcal_unit: string | null
          protein: number
          protein_unit: string | null
          provider: Database["public"]["Enums"]["provider_type"]
          salt: number
          salt_unit: string | null
          saturates: number
          saturates_unit: string | null
          serving_size: string
          sugar: number
          sugar_unit: string | null
        }
        Insert: {
          calcium: number
          calcium_unit?: string | null
          carbohydrates: number
          carbohydrates_unit?: string | null
          created_at?: string
          fats: number
          fats_unit?: string | null
          food_item: string
          id?: string
          kcal: number
          kcal_unit?: string | null
          protein: number
          protein_unit?: string | null
          provider: Database["public"]["Enums"]["provider_type"]
          salt: number
          salt_unit?: string | null
          saturates: number
          saturates_unit?: string | null
          serving_size: string
          sugar: number
          sugar_unit?: string | null
        }
        Update: {
          calcium?: number
          calcium_unit?: string | null
          carbohydrates?: number
          carbohydrates_unit?: string | null
          created_at?: string
          fats?: number
          fats_unit?: string | null
          food_item?: string
          id?: string
          kcal?: number
          kcal_unit?: string | null
          protein?: number
          protein_unit?: string | null
          provider?: Database["public"]["Enums"]["provider_type"]
          salt?: number
          salt_unit?: string | null
          saturates?: number
          saturates_unit?: string | null
          serving_size?: string
          sugar?: number
          sugar_unit?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string
          email: string
          first_name: string
          height: number
          id: string
          is_premium: boolean
          last_name: string
          nickname: string
          weight: number
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          email: string
          first_name: string
          height: number
          id: string
          is_premium?: boolean
          last_name: string
          nickname: string
          weight: number
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          email?: string
          first_name?: string
          height?: number
          id?: string
          is_premium?: boolean
          last_name?: string
          nickname?: string
          weight?: number
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
      provider_type:
        | "Tesco"
        | "Sainsburys"
        | "Asda"
        | "Morrisons"
        | "Waitrose"
        | "Coop"
        | "M&S"
        | "Ocado"
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
