export type Role = 'employee' | 'manager';
export type Mood = 'great' | 'good' | 'meh' | 'struggling';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  avatar_color: string | null;
  created_at: string;
}

export interface Standup {
  id: string;
  user_id: string;
  date: string;
  today: string | null;
  tomorrow: string | null;
  blockers: string | null;
  mood: Mood | null;
  is_late: boolean;
  submitted_at: string;
  profiles?: Profile;
}

export interface Mention {
  id: string;
  standup_id: string;
  mentioned_user_id: string;
  mentioning_user_id: string;
  created_at: string;
}

export interface Settings {
  id: string;
  digest_enabled: boolean;
  digest_time: string;
  created_at: string;
}
