type User = {
  id: number,
  isActive: boolean
}

declare namespace Express {
  export interface Request {
      user: User
  }
}