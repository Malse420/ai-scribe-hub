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
      analytics: {
        Row: {
          created_at: string | null
          custom_dimensions: Json | null
          device_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_duration: number | null
          session_events: Json | null
          session_id: string | null
          user_id: string
          user_properties: Json | null
        }
        Insert: {
          created_at?: string | null
          custom_dimensions?: Json | null
          device_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_duration?: number | null
          session_events?: Json | null
          session_id?: string | null
          user_id: string
          user_properties?: Json | null
        }
        Update: {
          created_at?: string | null
          custom_dimensions?: Json | null
          device_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_duration?: number | null
          session_events?: Json | null
          session_id?: string | null
          user_id?: string
          user_properties?: Json | null
        }
        Relationships: []
      }
      data_exports: {
        Row: {
          batch_id: string | null
          created_at: string | null
          filename: string
          id: string
          last_accessed_at: string | null
          next_retry_at: string | null
          retry_count: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          filename: string
          id?: string
          last_accessed_at?: string | null
          next_retry_at?: string | null
          retry_count?: number | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          filename?: string
          id?: string
          last_accessed_at?: string | null
          next_retry_at?: string | null
          retry_count?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      debug_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          severity: string
          user_id: string
          userscript_id: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          severity?: string
          user_id: string
          userscript_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          severity?: string
          user_id?: string
          userscript_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_logs_userscript_id_fkey"
            columns: ["userscript_id"]
            isOneToOne: false
            referencedRelation: "userscripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debug_logs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      element_selectors: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string | null
          element_type: string
          id: string
          last_used_at: string | null
          metadata: Json | null
          nlp_context: Json | null
          nlp_description: string | null
          selector: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          element_type: string
          id?: string
          last_used_at?: string | null
          metadata?: Json | null
          nlp_context?: Json | null
          nlp_description?: string | null
          selector: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          element_type?: string
          id?: string
          last_used_at?: string | null
          metadata?: Json | null
          nlp_context?: Json | null
          nlp_description?: string | null
          selector?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      script_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shared_resources: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string
          resource_metadata: Json
          resource_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          resource_id: string
          resource_metadata?: Json
          resource_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string
          resource_metadata?: Json
          resource_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          api_key: string
          api_service: string
          created_at: string | null
          expires_at: string | null
          id: string
          last_accessed_at: string | null
          last_notification_sent: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          api_service: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_accessed_at?: string | null
          last_notification_sent?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          api_service?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_accessed_at?: string | null
          last_notification_sent?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      userscripts: {
        Row: {
          audit_log: Json | null
          category: string | null
          collaborators: Json | null
          content: string
          created_at: string | null
          id: string
          is_shared: boolean | null
          last_accessed_at: string | null
          last_editor: string | null
          parent_version_id: string | null
          permissions: Json | null
          shared_with: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          audit_log?: Json | null
          category?: string | null
          collaborators?: Json | null
          content: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          last_accessed_at?: string | null
          last_editor?: string | null
          parent_version_id?: string | null
          permissions?: Json | null
          shared_with?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          audit_log?: Json | null
          category?: string | null
          collaborators?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          last_accessed_at?: string | null
          last_editor?: string | null
          parent_version_id?: string | null
          permissions?: Json | null
          shared_with?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "userscripts_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "userscripts"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          end_time: string | null
          id: string
          result: Json | null
          start_time: string | null
          status: string
          workflow_id: string
        }
        Insert: {
          end_time?: string | null
          id?: string
          result?: Json | null
          start_time?: string | null
          status?: string
          workflow_id: string
        }
        Update: {
          end_time?: string | null
          id?: string
          result?: Json | null
          start_time?: string | null
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          connections: Json | null
          created_at: string | null
          id: string
          step_config: Json
          step_order: number
          step_type: string
          updated_at: string | null
          visual_position: Json | null
          workflow_id: string
        }
        Insert: {
          connections?: Json | null
          created_at?: string | null
          id?: string
          step_config?: Json
          step_order: number
          step_type: string
          updated_at?: string | null
          visual_position?: Json | null
          workflow_id: string
        }
        Update: {
          connections?: Json | null
          created_at?: string | null
          id?: string
          step_config?: Json
          step_order?: number
          step_type?: string
          updated_at?: string | null
          visual_position?: Json | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          id: string
          last_accessed_at: string | null
          name: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          name: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          name?: string
          status?: string
          updated_at?: string | null
          user_id?: string
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
