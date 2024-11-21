import { Json } from './common';

export type UserScriptRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  last_accessed_at: string | null;
  parent_version_id: string | null;
  version: number | null;
  is_shared: boolean | null;
  shared_with: Json | null;
  last_editor: string | null;
  collaborators: Json | null;
};

export type UserScriptInsert = {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  created_at?: string | null;
  updated_at?: string | null;
  last_accessed_at?: string | null;
  parent_version_id?: string | null;
  version?: number | null;
  is_shared?: boolean | null;
  shared_with?: Json | null;
  last_editor?: string | null;
  collaborators?: Json | null;
};

export type UserScriptUpdate = Partial<UserScriptInsert>;