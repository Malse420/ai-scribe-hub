export interface Collaborator {
  id: string;
  email: string;  // Made required again to match the component expectations
  online: boolean;
  lastActive?: string;
}

export interface UserScript {
  id: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
  parent_version_id?: string;
  is_shared?: boolean;
  shared_with?: any[];
  last_editor?: string;
  collaborators?: string[];
}