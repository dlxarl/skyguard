export interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  passport_id: string;
}

export interface Target {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'confirmed';
  target_type: string;
  author: number;
  created_at: string;
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