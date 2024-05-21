
import { sql } from "kysely";
import db, { pool } from "../application/db";
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
import { deleteFile } from "../utils/file";
import { getUTCTimestamp } from "../utils/date";

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

    console.log(req, 'req.body');
    

    let userData = Validation.validate(UserValidation.SIGNUP, req)

    if (!userData.avatarUrl) {
      userData.avatarUrl = 'avatar.png'
    }

    if (!userData.displayName) {
      userData.displayName = userData.username
    }

    if (userData.registerCode === '') {
      userData.registerCode = null
    }

    let roles = await prisma.role.findMany()

    if (!roles.length) {
      await prisma.role.create({
        data: {
          name: "USER"
        }
      })
    }

    if (roles.length <= 1) {
      await prisma.role.create({
        data: {
          name: "ORGANIZER"
        }
      })
    }

    console.log(userData, 'user data');


    const findUser = await prisma.user.findUnique({
      where: {
        username: userData.username
      }
    })
    console.log(findUser, 'find user');

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


    let vouchers = await prisma.voucher.findMany()

    if (!vouchers.length) {
      await prisma.voucher.createMany({
        data: [
          {
            name: "Referral Point",
            authorId: 1,
            code: '9238rh93rh',
            type: "POINT",
            point: 10000,
            isClaimable: true,
          },
          {
            name: "Referral Discount",
            authorId: 1,
            code: '02jd22j3',
            type: "DISCOUNT",
            discount: 10,
            isClaimable: true,
          },
        ]
      })
    }

    await sendEmailVerification({ id: user.id, isActive: user.isActive, displayName: user.displayName, email: user.email })

    if (user.registerCode && user.predecessor?.id) {
      let userDiscount = await prisma.userVoucher.create({
        data: {
          userId: user.id,
          voucherId: 2,
          expiredAt: new Date(Date.now() + 10 * 60 * 1000),
          expiredCode: `referral_discount_${user.id}`
        }
      })

      let predecessorPoint = await prisma.userVoucher.create({
        data: {
          userId: user.predecessor.id,
          voucherId: 1,
          expiredAt: new Date(Date.now() + 10 * 60 * 1000),
          expiredCode: `referral_point_${user.id}_${user.predecessor.id}`
        }
      })

      await pool.query(`
        CREATE EVENT ${userDiscount.expiredCode}
        ON SCHEDULE AT date_add(now(), INTERVAL 10 MINUTE)
        DO  
            DELETE FROM user_vouchers WHERE id='${userDiscount.id}';
      `)

      await pool.query(`
        CREATE EVENT ${predecessorPoint.expiredCode}
        ON SCHEDULE AT date_add(now(), INTERVAL 10 MINUTE)
        DO
            DELETE FROM user_vouchers WHERE id='${predecessorPoint.id}';
      `)
      
    }

    return user
  }

  static async signin(req: SigninUserRequest): Promise<UserResponse> {
    let signinData = Validation.validate(UserValidation.SIGNIN, req)

    let findUser = await prisma.user.findFirst({
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

    const user = await prisma.user.update({
      where: {
        id: findUser.id
      },
      data: { loginAttempts: 0 },
      select: {
        ...UserFields
      }
    })

    return user!

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

  static async getUserVouchers(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        userVouchers: {
          select: {
            expiredAt: true,
            voucher: {
              select: {
                name: true,
                expiredAt: true,
                type: true,
                discount: true,
                point: true
              }
            }
          }
        }
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
      console.log(req.file, 'check file');
      body.avatarUrl = req.file.filename
    }

    console.log(body, 'check body');


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

      await deleteFile(user?.avatarUrl!)
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