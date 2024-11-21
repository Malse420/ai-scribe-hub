export type AnalyticsRow = {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Json | null;
  session_id: string | null;
  device_id: string | null;
  created_at: string | null;
  session_duration: number | null;
  session_events: Json | null;
};

export type AnalyticsInsert = {
  id?: string;
  user_id: string;
  event_type: string;
  event_data?: Json | null;
  session_id?: string | null;
  device_id?: string | null;
  created_at?: string | null;
  session_duration?: number | null;
  session_events?: Json | null;
};

export type AnalyticsUpdate = Partial<AnalyticsInsert>;