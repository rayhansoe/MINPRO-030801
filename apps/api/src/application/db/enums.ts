export const users_role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type users_role = (typeof users_role)[keyof typeof users_role];
export const users_status = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
} as const;
export type users_status = (typeof users_status)[keyof typeof users_status];
