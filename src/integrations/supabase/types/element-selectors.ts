import { Json } from './base-types';

export interface ElementSelector {
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
  selector_type: 'css' | 'xpath';
  is_group: boolean;
  group_elements: Json | null;
  selection_history: Json | null;
}

export type ElementSelectorInsert = Omit<
  ElementSelector,
  'id' | 'created_at' | 'updated_at' | 'last_used_at'
>;

export type ElementSelectorUpdate = Partial<ElementSelectorInsert>;