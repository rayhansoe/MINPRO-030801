import { NextFunction, Request, Response } from "express";

export type IController = (req:Request, res:Response, next:NextFunction) => void


export type ISession = {
  username: string,
  id: number,
  role: number,
  isActive: boolean,
  avatarUrl: string,
  iat: number
}