export interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  passport_id: string;
  trust_rating: number;
}

export interface Target {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'unconfirmed' | 'confirmed' | 'rejected';
  target_type: 'drone' | 'rocket' | 'plane' | 'helicopter' | 'bang';
  probability?: 'low' | 'medium' | 'high';
  report_count?: number;
  weighted_score?: number;
  author: number;
  author_username?: string;
  created_at: string;
  resolved_at?: string | null;
}

export interface Shelter {
  id: number;
  title: string;
  address: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  passport_id: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface NewTargetData {
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  target_type: string;
}

// Target types
export type TargetType = 'drone' | 'rocket' | 'plane' | 'helicopter' | 'bang';
export type TargetStatus = 'pending' | 'unconfirmed' | 'confirmed' | 'rejected';
export type Probability = 'low' | 'medium' | 'high';