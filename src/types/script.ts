export interface Collaborator {
  id: string;
  email: string;
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
  shared_with?: string[];
  last_editor?: string;
  collaborators?: string[];
  active_collaborators?: string[];
  version_history?: {
    version: number;
    content: string;
    updated_at: string;
    editor: string;
  }[];
}