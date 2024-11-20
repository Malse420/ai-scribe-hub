export interface Collaborator {
  id: string;
  email?: string;  // Made optional to match the hook's type
  online?: boolean;
}

export interface UserScript {
  id: string;
  title: string;
  content: string;
  version: number;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  parent_version_id?: string;
  is_shared?: boolean;
  shared_with?: any[];
  last_editor?: string;
  collaborators?: any[];
}