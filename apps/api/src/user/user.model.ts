export interface PublicUserResponse {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface UserResponse extends PublicUserResponse {
  email: string;
  roleId: number;
  referralCode: string;
  registerCode: string | null;
  isActive: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface UserTokenResponse extends PublicUserResponse {
  roleId: number;
  isActive: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  displayName: string
  avatarUrl: string
  bio: string | null;
  registerCode: string | null;
}

export interface UpdateProfileRequest {
  displayName: string | undefined;
  avatarUrl: string | undefined;
  bio: string | undefined;
}

export interface SigninUserRequest {
  data: string;
  password: string;
}

export const PublicUserFields = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
}

export const TokenFields = {
  id: true,
  username: true,
  avatarUrl: true,
  roleId: true,
  isActive: true,
}

export const UserFields = {
  ...PublicUserFields,
  email: true,
  roleId: true,
  referralCode: true,
  registerCode: true,
  isActive: true,
  updatedAt: true,
  createdAt: true,
}

