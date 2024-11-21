export type DataExportRow = {
  id: string;
  user_id: string;
  filename: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  last_accessed_at: string | null;
};

export type DataExportInsert = {
  id?: string;
  user_id: string;
  filename: string;
  status?: string;
  created_at?: string | null;
  updated_at?: string | null;
  last_accessed_at?: string | null;
};

export type DataExportUpdate = Partial<DataExportInsert>;