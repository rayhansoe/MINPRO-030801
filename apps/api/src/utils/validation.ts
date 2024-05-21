import { BaseSchema, parse } from "valibot";
import { ZodType } from "zod";

export class Validation {


  static validate<T>(schema: BaseSchema, data: T): T {
    return parse(schema, data)
  }

  static validateZod<T>(schema: ZodType, data: T): T {
    return schema.parse(data)
  }


}