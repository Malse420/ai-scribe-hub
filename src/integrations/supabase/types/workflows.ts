import { Json } from './common';

export type WorkflowRow = {
  id: string;
  user_id: string;
  name: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  last_accessed_at: string | null;
};

export type WorkflowInsert = {
  id?: string;
  user_id: string;
  name: string;
  status?: string;
  created_at?: string | null;
  updated_at?: string | null;
  last_accessed_at?: string | null;
};

export type WorkflowUpdate = Partial<WorkflowInsert>;

export type WorkflowStepRow = {
  id: string;
  workflow_id: string;
  step_type: string;
  step_config: Json;
  step_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type WorkflowStepInsert = {
  id?: string;
  workflow_id: string;
  step_type: string;
  step_config: Json;
  step_order: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type WorkflowStepUpdate = Partial<WorkflowStepInsert>;