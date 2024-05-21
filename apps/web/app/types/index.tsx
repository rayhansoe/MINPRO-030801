
export type IUserSession = {
  username: string,
  id: number,
  role: number,
  isActive: boolean,
  avatarUrl: string,
  iat: number
}