export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          device_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_duration: number | null
          session_events: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_duration?: number | null
          session_events?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_duration?: number | null
          session_events?: Json | null
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      data_exports: {
        Row: {
          created_at: string | null
          filename: string
          id: string
          last_accessed_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filename: string
          id?: string
          last_accessed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filename?: string
          id?: string
          last_accessed_at?: string | null
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
          id: string
          last_accessed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          api_service: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          api_service?: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      userscripts: {
        Row: {
          collaborators: Json | null
          content: string
          created_at: string | null
          id: string
          is_shared: boolean | null
          last_accessed_at: string | null
          last_editor: string | null
          parent_version_id: string | null
          shared_with: Json | null
          title: string
          updated_at: string | null
          user_id: string
          version: number | null;
        }
        Insert: {
          collaborators?: Json | null
          content: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          last_accessed_at?: string | null
          last_editor?: string | null
          parent_version_id?: string | null
          shared_with?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
          version?: number | null;
        }
        Update: {
          collaborators?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          last_accessed_at?: string | null
          last_editor?: string | null
          parent_version_id?: string | null
          shared_with?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
          version?: number | null;
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
