import { NextFunction, Request, Response } from "express";

export type IController = (req:Request, res:Response, next:NextFunction) => void