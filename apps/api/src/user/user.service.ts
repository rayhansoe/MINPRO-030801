
import { sql } from "kysely";
import db from "../application/db";
import { ResponseError } from "../utils/error.response";
import { Validation } from "../utils/validation";
import { CreateUserRequest, PublicUserFields, PublicUserResponse, SigninUserRequest, UpdateProfileRequest, UserFields, UserResponse } from "./user.model";
import crypto from "node:crypto";
import prisma from "../application/db/prisma";
import { UserValidation } from "./user.validation";
import jwt, { sign } from "jsonwebtoken";
import { compare, genSalt, hash } from "bcrypt";
import Handlebars from "handlebars";
import path from 'path'
import fs from 'fs'
import { transporter } from "../helpers/nodemailers";
import { Request } from "express";
import { sendEmailVerification } from "../utils/email";

export class UserService {

  // static async register(req: CreateUserRequest): Promise<UserResponse> {

  //   let userData = Validation.validate(UserValidation.REGISTER, req)

  //   const findUser = await db
  //     .selectFrom('users')
  //     .select(['id'])
  //     .where('username', '=', userData.username)
  //     .execute()

  //   if (findUser[0]) {
  //     throw new ResponseError(400, "username already exist!")
  //   }

  //   const salt = await genSalt(10)
  //   const hashedPassword = await hash(userData.password, salt)

  //   const newData = {
  //     username: userData.username,
  //     email: userData.email,
  //     password: hashedPassword,
  //     display_name: userData.display_name,
  //     avatar_url: userData.display_name,
  //   }

  //   await sql`BEGIN;`.execute(db)

  //   await db.insertInto('users')
  //     .values({
  //       username: userData.username,
  //       email: userData.email,
  //       password: hashedPassword,
  //       display_name: userData.display_name,
  //       avatar_url: userData.display_name,
  //     })
  //     .execute()

  //   const user = await db.selectFrom('users')
  //     .select([
  //       'id',
  //       'username',
  //       'email',
  //       'display_name',
  //       'avatar_url',
  //       'role_id',
  //       'status',
  //       'bio',
  //       'created_at'
  //     ])
  //     .where('username', '=', newData.username)
  //     .executeTakeFirst()

  //   if (!user) {
  //     throw new ResponseError(400, "Failed to create new user!")
  //   }

  //   return user

  // }

  static async signup(req: CreateUserRequest): Promise<UserResponse> {

    if (!req.avatarUrl) {
      req.avatarUrl = 'avatar.png'
    }

    if (!req.displayName) {
      req.displayName = req.username
    }

    let userData = Validation.validate(UserValidation.SIGNUP, req)

    let roles = await prisma.role.findMany()

    if (!roles.length) {
      await prisma.role.create({
        data: {
          name: "USER"
        }
      })
    }

    const findUser = await prisma.user.findUnique({
      where: {
        username: userData.username
      }
    })

    // Check Register Code
    if (userData.registerCode) {
      console.log('hit');

      let findRegisterCode = await prisma.user.findUnique({
        where: {
          referralCode: userData.registerCode
        },
        select: {
          referralCode: true
        }
      })
      console.log(findRegisterCode, 'valid register code');

      if (!findRegisterCode) throw new ResponseError(400, 'Invalid Register Code')

      userData.registerCode = findRegisterCode.referralCode
    }

    if (findUser) {
      throw new ResponseError(400, "username already exist!")
    }

    const referralCode = crypto.randomBytes(16).toString("hex");
    console.log(referralCode);
    const salt = await genSalt(10)
    const hashed = await hash(userData.password, salt)


    const user = await prisma.user.create({
      data: {
        ...userData,
        referralCode,
        password: hashed
      },
      select: {
        ...UserFields,
        registerCode: true,
        predecessor: {
          select: {
            id: true,
            referralCode: true
          }
        }
      }
    })

    await sendEmailVerification({ id: user.id, isActive: user.isActive, displayName: user.displayName, email: user.email })

    if (user.registerCode && user.predecessor?.id) {

    }

    return user
  }

  static async signin(req: SigninUserRequest): Promise<UserResponse> {
    let signinData = Validation.validate(UserValidation.SIGNIN, req)

    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: signinData.data
          },
          {
            email: signinData.data
          },
        ]
      },
      select: {
        ...UserFields,
        password: true,
        loginAttempts: true
      }
    })

    if (!findUser) {
      throw new ResponseError(400, 'Username or Email or Password is wrong!')
    }

    let isValid = await compare(signinData.password, findUser.password)

    if (!isValid) {
      if (findUser.loginAttempts < 3) {

        await prisma.user.update({
          where: {
            id: findUser.id
          },
          data: {
            loginAttempts: {
              increment: 1
            }
          }
        })

      } else {

        // await prisma.user.update({})

      }

      throw new ResponseError(403, 'Username or Email or Password is wrong!')
    }

    return findUser

  }

  static async getUsers(): Promise<PublicUserResponse[]> {
    return await prisma.user.findMany({
      select: {
        ...PublicUserFields
      },
      where: {
        isActive: true
      }
    })
  }

  static async getUserProfile(id: number): Promise<UserResponse | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        ...UserFields
      }
    })
  }

  static async getUserByUsername(username: string, req: Request): Promise<PublicUserResponse | UserResponse | null> {
    const fields = req.user?.id ? UserFields : PublicUserFields
    return await prisma.user.findUnique({
      where: { username },
      select: {
        ...fields
      }
    })
  }

  static async updateProfile(req: Request, body: UpdateProfileRequest): Promise<UserResponse> {

    if (req.file) {
      body.avatarUrl = `http://localhost:8000/public/images/${req.file.filename}`
    }
    
    const updateProfileData = Validation.validate(UserValidation.UPDATE, body)

    let user = await prisma.user.findUnique({
      where: {
        id: req.user?.id
      },
      select: {
        id: true, 
        displayName: true,
        avatarUrl: true,
        bio: true
      }
    })

    // remove old pict
    if (updateProfileData.avatarUrl && user?.avatarUrl !== 'avatar.png') {
      console.log('remove old pict');
      
    }

    console.log(updateProfileData, 'HEYYYYY');
    

    let updatedUser = await prisma.user.update({
      where: {
        id: user!.id
      },
      data: {
        ...updateProfileData
      },
      select: {
        ...UserFields
      }
    })

    return updatedUser

  }

}