
import { sql } from "kysely";
import db from "../application/db";
import { IController, ISession } from "../utils/types";
import { CreateUserRequest, SigninUserRequest, TokenFields, UpdateProfileRequest, UserFields } from "./user.model";
import { UserService } from "./user.service";
import jwt, { sign, verify } from "jsonwebtoken";
import { ResponseError } from "../utils/error.response";
import prisma from "../application/db/prisma";
import { User } from "@prisma/client";
import { sendEmailVerification, sendResetEmail, sendResetPassword } from "../utils/email";
import { email, minLength, object, parse, string } from "valibot";
import { compare, genSalt, hash } from "bcrypt";

export class UserController {
  static regitser: IController = async (req, res, next) => {


    // const authHeader = req.headers.cookie
    // const token = authHeader && authHeader.split('=')[1]

    // console.log(req.cookies);
    // console.log(req.headers.cookie?.split('=')[1]);
    // console.log(token);

    // if (!token) {
    //   throw new ResponseError(400, 'asdas')
    // }

    // console.log(jwt.verify(token, 'privateKey'));


    try {
      const request: CreateUserRequest = req.body
      console.log(request);

      const response = await UserService.signup(request)


      // await sql`COMMIT;`.execute(db)


      const token = jwt.sign({ username: response.username, id: response.id, role: response.roleId, isActive: response.isActive, avatarUrl: response.avatarUrl }, 'privateKey');

      res.header('Authorization', 'Bearer ' + token)
      // res.cookie('Authorization', token)
      res.cookie('session', token)

      res
        .status(201)
        .json({
          status: "OK",
          token,
          data: response
        })
    } catch (error) {
      next(error)
    }

  }

  static signin: IController = async (req, res, next) => {
    try {
      console.log(req.body);

      const request: SigninUserRequest = req.body
      const user = await UserService.signin(request)

      console.log(req.headers.cookie);


      const token = jwt.sign({ username: user.username, id: user.id, role: user.roleId, isActive: user.isActive, avatarUrl: user.avatarUrl }, 'privateKey');

      res.header('Authorization', 'Bearer ' + token)
      // res.cookie('Authorization', token)
      res.cookie('session', token)
      res
        .status(200)
        .json({
          status: "OK",
          token,
          user
        })
    } catch (error) {
      next(error)
    }
  }

  static getUsers: IController = async (req, res, next) => {
    try {
      const users = await UserService.getUsers()
      res
        .status(200)
        .json({
          status: "OK",
          users
        })
    } catch (error) {
      next(error)
    }
  }

  static getUserProfile: IController = async (req, res, next) => {
    try {
      const users = await UserService.getUserProfile(req.user?.id)
      res
        .status(200)
        .json({
          status: "OK",
          users
        })
    } catch (error) {
      next(error)
    }
  }

  static getUserVouchers: IController = async (req, res, next) => {
    try {
      const vouchers = await UserService.getUserVouchers(req.user?.id)
      res
        .status(200)
        .json({
          status: "OK",
          vouchers
        })
    } catch (error) {
      next(error)
    }
  }

  static getUserByUsername: IController = async (req, res, next) => {
    try {
      const users = await UserService.getUserByUsername(req.params.username, req)
      res
        .status(200)
        .json({
          status: "OK",
          users
        })
    } catch (error) {
      next(error)
    }
  }

  static getSession: IController = async (req, res, next) => {
    try {

      let token = req.headers.cookie?.replace('session=', '')

      if (!token) {
        res.clearCookie('session')
        throw new ResponseError(403, 'Error: No Token')
      }

      const session = verify(token, 'privateKey')

      res
        .status(200)
        .json(session)

    } catch (error) {
      next(error)
    }
  }

  static verify: IController = async (req, res, next) => {
    try {

      let token = req.params.token

      if (!token) {
        res.clearCookie('session')
        throw new ResponseError(403, 'Forbidden request!')
      }

      let session = verify(token, 'privateKey') as any

      if (req.user?.isActive) {
        return res
          .status(301)
          .redirect('http://localhost:3000')
      }

      const user = await prisma.user.update({
        where: {
          id: session?.id
        },
        data: {
          isActive: true
        },
        select: {
          id: true,
          username: true,
          roleId: true,
          avatarUrl: true,
          isActive: true
        }
      })

      const payload = {
        id: user.id,
        username: user.username,
        role: user.roleId,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive
      }

      token = sign(payload, 'privateKey') as string


      res
        .status(200)
        .json({
          token,
          ...payload
        })

    } catch (error) {
      next(error)
    }
  }

  static resend: IController = async (req, res, next) => {
    try {

      console.log("resend");

      if (!req.user) {
        throw new ResponseError(401, "Unauthorized")
      }

      if (req.user?.isActive) {
        return res
          .status(301)
          .redirect('http://localhost:3000')
      }

      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          id: true, isActive: true, displayName: true, email: true
        }
      })

      await sendEmailVerification({ ...user! })

      res.end()

    } catch (error) {
      next(error)
    }
  }

  static reset: IController = async (req, res, next) => {
    try {

      const request = parse(object({
        password: string('harus string', [minLength(8, 'minimal 8 karakter')])
      }), req.body)

      const findUser = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          id: true,
        }
      })

      if (!findUser) {
        throw new ResponseError(400, 'Invalid Username or Email!')
      }

      const salt = await genSalt(10)
      const hashed = await hash(request.password, salt)

      const user = await prisma.user.update({
        where: {
          id: findUser.id
        },
        data: {
          password: hashed
        },
        select: {
          ...UserFields
        }
      })


      const token = jwt.sign({ username: user.username, id: user.id, role: user.roleId, isActive: user.isActive, avatarUrl: user.avatarUrl }, 'privateKey');

      res.header('Authorization', 'Bearer ' + token)
      // res.cookie('Authorization', token)
      res.cookie('session', token)
      res
        .status(200)
        .json({
          status: "OK",
          token,
          user
        })

    } catch (error) {
      next(error)
    }
  }

  static changePassword: IController = async (req, res, next) => {
    try {

      const request = parse(object({
        password: string('harus string', [minLength(8, 'minimal 8 karakter')]),
        newPassword: string('harus string', [minLength(8, 'minimal 8 karakter')])
      }), req.body)

      const findUser = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          id: true,
          password: true,
          loginAttempts: true,
        }
      })

      if (!findUser) {
        throw new ResponseError(400, 'Invalid Username or Email!')
      }


      let isValid = await compare(request.password, findUser.password)

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

        throw new ResponseError(403, 'Password is wrong!')
      }

      const salt = await genSalt(10)
      const hashed = await hash(request.newPassword, salt)

      const user = await prisma.user.update({
        where: {
          id: findUser.id
        },
        data: {
          password: hashed
        },
        select: {
          ...UserFields
        }
      })


      const token = jwt.sign({ username: user.username, id: user.id, role: user.roleId, isActive: user.isActive, avatarUrl: user.avatarUrl }, 'privateKey');

      res.header('Authorization', 'Bearer ' + token)
      // res.cookie('Authorization', token)
      res.cookie('session', token)
      res
        .status(200)
        .json({
          status: "OK",
          token,
          user
        })

    } catch (error) {
      next(error)
    }
  }

  static forgot: IController = async (req, res, next) => {
    try {

      const request = parse(object({
        email: string('Invalid Email!', [email('Invalid email!.'), minLength(5, '')])
      }), req.body)

      const findUser = await prisma.user.findUnique({
        where: {
          email: request.email
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          isActive: true
        }
      })

      if (!findUser) {
        throw new ResponseError(400, 'Invalid Username or Email!')
      }

      await sendResetPassword({ ...findUser! })

      res.end()

    } catch (error) {
      next(error)
    }
  }

  static requestChangeEmail: IController = async (req, res, next) => {
    try {

      // const request = parse(object({
      //   email: string('Invalid Email!', [email('Invalid email!.'), minLength(5, '')])
      // }), req.body)

      const findUser = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          isActive: true
        }
      })

      if (!findUser) {
        throw new ResponseError(400, 'Invalid Username or Email!')
      }

      await sendResetEmail({ ...findUser! })

      res.end()

    } catch (error) {
      next(error)
    }
  }

  static changeEmail: IController = async (req, res, next) => {
    try {

      const request = parse(object({
        email: string('Invalid Email!', [email('Invalid email!.'), minLength(5, '')]),
        newEmail: string('Invalid Email!', [email('Invalid email!.'), minLength(5, '')]),
        password: string('Invalid Email!', [email('Invalid email!.'), minLength(5, '')]),
      }), req.body)

      let user = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          isActive: true,
          password: true
        }
      })

      if (!user) {
        throw new ResponseError(400, 'Invalid Username or Email!')
      }

      if (user.email !== request.email) {
        throw new ResponseError(400, 'Invalid Username or Email!')
      }

      const isPasswordValid = await compare(request.password, user.password)

      if (!isPasswordValid) {
        throw new ResponseError(401, 'Unauthorized')
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: request.newEmail
        }
      })

      res.end()

    } catch (error) {
      next(error)
    }
  }

  static updateProfile: IController = async (req, res, next) => {
    try {

      const body: UpdateProfileRequest = req.body
      const response = await UserService.updateProfile(req, body)

      let token = jwt.sign({ username: response.username, id: response.id, role: response.roleId, isActive: response.isActive, avatarUrl: response.avatarUrl }, 'privateKey');

      res
        .status(200)
        .json({
          status: "OK",
          token,
          message: "Profile updated!",
          user: response
        })

    } catch (error) {
      next(error)
    }
  }

  static upgrade: IController = async (req, res, next) => {
    try {

      let user = await prisma.user.update({
        where: { id: req.user.id! },
        data: {
          roleId: 2
        },
        select: {
          ...TokenFields
        }
      })

      let token = jwt.sign({ username: user.username, id: user.id, role: user.roleId, isActive: user.isActive, avatarUrl: user.avatarUrl }, 'privateKey');

      res
        .status(200)
        .json({
          status: "OK",
          token,
          message: "Account upgraded!",
          user
        })

    } catch (error) {
      next(error)
    }
  }

  static signout: IController = async (req, res, next) => {
    try {

      console.log("logout");
      res.clearCookie('session')
      res.end()

    } catch (error) {
      next(error)
    }
  }

}