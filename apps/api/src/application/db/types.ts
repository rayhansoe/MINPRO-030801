import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { VoucherType } from './enums';

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
export type UserVoucher = {
  id: Generated<number>;
  user_id: number;
  voucher_id: number;
  is_available: Generated<number>;
  transaction_id: number | null;
  expired_at: Timestamp | null;
  expired_code: string | null;
  updated_at: Generated<Timestamp>;
  created_at: Generated<Timestamp>;
};
export type Voucher = {
  id: Generated<number>;
  name: string;
  stocks: number | null;
  author_id: number;
  is_claimable: Generated<number>;
  code: string;
  type: Generated<VoucherType>;
  discount: number | null;
  point: number | null;
  expired_at: Timestamp | null;
  expired_code: string | null;
  updated_at: Generated<Timestamp>;
  created_at: Generated<Timestamp>;
};
export type DB = {
  role: Role;
  user_vouchers: UserVoucher;
  users: User;
  vouchers: Voucher;
};
