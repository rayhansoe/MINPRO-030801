
import { NextFunction, Request, Response } from "express";
import { sql } from "kysely";
import { ZodError } from "zod";
import { ResponseError, isDatabaseError } from "../utils/error.response";
import db from "../application/db";
import { ValiError, flatten } from "valibot";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {  

  // console.log(error);
  

  if (error instanceof ZodError) {

    res
      .status(400)
      .json({
        error: `Validation Error: ${JSON.stringify(error)}`,
        errors: error.flatten()
      })

  } else if (error instanceof ValiError) {

    res
      .status(400)
      .json({
        errors: flatten(error)
      })

  } else if (error instanceof ResponseError) {
    res
      .status(error.status)
      .json({
        errors: error.message
      })

  } else {

    const err = isDatabaseError(error)

    if (err) {
      await sql`ROLLBACK;`.execute(db)
    }

    res
      .status(500)
      .json({
        errors: error.message
      })

  }
}