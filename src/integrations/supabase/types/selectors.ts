import { Json } from './common';

export type ElementSelectorRow = {
  id: string;
  user_id: string;
  selector: string;
  element_type: string;
  description: string | null;
  metadata: Json | null;
  created_at: string | null;
  updated_at: string | null;
  last_used_at: string | null;
  nlp_description: string | null;
  nlp_context: Json | null;
  confidence_score: number | null;
};

export type ElementSelectorInsert = {
  id?: string;
  user_id: string;
  selector: string;
  element_type: string;
  description?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_used_at?: string | null;
  nlp_description?: string | null;
  nlp_context?: Json | null;
  confidence_score?: number | null;
};

export type ElementSelectorUpdate = Partial<ElementSelectorInsert>;