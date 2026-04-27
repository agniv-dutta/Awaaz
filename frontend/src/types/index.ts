export type NeedCategory = 'FOOD' | 'MEDICAL' | 'SHELTER' | 'EDUCATION' | 'LEGAL' | 'MENTAL_HEALTH' | 'ELDERLY_CARE' | 'DISABILITY' | 'OTHER';
export type NeedUrgency = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type NeedStatus = 'OPEN' | 'ASSIGNED' | 'FULFILLED' | 'CLOSED';
export type ReportStatus = 'PENDING' | 'PROCESSED' | 'FLAGGED';
export type DispatchStatus = 'PENDING_ACCEPT' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED';

export interface Ward {
  id: string;
  name: string;
  polygon_wkt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  ward_id: string | null;
  is_active: boolean;
}

export interface Need {
  id: string;
  category: NeedCategory;
  urgency: NeedUrgency;
  urgency_score: number;
  report_count: number;
  description: string;
  ward_id: string;
  location_lat: number | null;
  location_lng: number | null;
  status: NeedStatus;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  name?: string;
  skills: string[];
  languages: string[];
  availability_schedule: Record<string, string[]>;
  current_lat: number | null;
  current_lng: number | null;
  max_radius_km: number;
  is_active: boolean;
  completed_tasks: number;
  reliability_score: number;
  home_ward_id: string;
  created_at: string;
  updated_at: string;
}

export interface Dispatch {
  id: string;
  need_id: string;
  volunteer_id: string;
  match_score: number;
  status: DispatchStatus;
  volunteer_notes: string | null;
  notified_at: string;
  responded_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  source: string;
  raw_text: string;
  ward_id: string;
  submitted_by: string;
  status: ReportStatus;
  parsed_needs: Record<string, any> | null;
  attachments: string[] | null;
  created_at: string;
  updated_at: string;
}
