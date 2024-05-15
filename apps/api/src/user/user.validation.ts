import { ZodType, z } from "zod";
import * as v from "valibot";

export class UserValidation {


  static readonly SIGNUPZOD: ZodType = z.object({
    username: z.string().min(5, {
      message: 'Should be at least 5 character(s)'
    }).max(16),
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
    displayName: z.string().min(1).max(64).optional(),
    avatarUrl: z.string().min(5).max(512).optional(),
    registerCode: z.string().length(32).optional(),
    bio: z.string().max(160).optional(),
  })

  static readonly SIGNUP: v.BaseSchema = v.object({
    username: v.string([v.minLength(5, 'Should be at least 5 character(s)'), v.maxLength(16)]),
    email: v.string([v.email('Email is invalid!'), v.minLength(11, 'Should be at least 11 character(s)'), v.maxLength(256)]),
    password: v.string([v.minLength(8), v.maxLength(512)]),
    displayName: v.optional(v.string([v.minLength(1), v.maxLength(64)])),
    avatarUrl: v.optional(v.string([v.minLength(5), v.maxLength(512)])),
    registerCode: v.optional(v.string([v.length(32)])),
    bio: v.optional(v.string([v.maxLength(160)])),
  })
  
  static readonly SIGNIN: v.BaseSchema = v.object({
    data: v.string([v.minLength(5, 'Should be at least 5 character(s)'), v.maxLength(256)]),
    password: v.string([v.minLength(8, 'Should be at least 8 character(s)'), v.maxLength(512)]),
  })
  
  static readonly UPDATE: v.BaseSchema = v.object({
    displayName: v.optional(v.string([v.minLength(1), v.maxLength(64)])),
    avatarUrl: v.optional(v.string([v.minLength(5), v.maxLength(512)])),
    bio: v.optional(v.string([v.maxLength(160)])),
  })


}