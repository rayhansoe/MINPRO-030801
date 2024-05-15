import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Role = {
  id: Generated<number>;
  name: string;
  updated_at: Generated<Timestamp>;
  created_at: Generated<Timestamp>;
};
export type User = {
  id: Generated<number>;
  username: string;
  email: string;
  password: string;
  display_name: string;
  bio: string | null;
  avatar_url: string;
  is_active: Generated<number>;
  role_id: Generated<number>;
  referral_code: string;
  register_code: string | null;
  login_attempts: Generated<number>;
  updated_at: Generated<Timestamp>;
  created_at: Generated<Timestamp>;
};
export type DB = {
  role: Role;
  users: User;
};
