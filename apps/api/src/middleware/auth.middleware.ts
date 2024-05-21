import { verify } from "jsonwebtoken"
import { ResponseError } from "../utils/error.response"
import { IController } from "../utils/types"

export class AuthMiddleware {

  static private: IController = (req, res, next) => {
    try {

      let token = req.headers.cookie?.replace("session=", "")
      if (!token) throw new ResponseError(401, "Unauthorizedd")

      console.log(token);


      const verifyUser = verify(token, 'privateKey')
      req.user = verifyUser as User

      if (!req.user.isActive) {
        throw new ResponseError(401, "Unauthorized")
      }

      next()
    } catch (err) {
      next(err)
    }
  }

  static shared: IController = (req, res, next) => {
    try {

      let token = req.headers.cookie?.replace("session=", "")
      if (token) {
        const verifyUser = verify(token, 'privateKey')
        req.user = verifyUser as User
      }

      next()
    } catch (err) {
      next(err)
    }
  }

  static reset: { email: IController, password: IController } = {
    email: async (req, res, next) => {
      try {

        let token = req.params.token
        if (!token) throw new ResponseError(401, "Unauthorizedd")

        console.log(token);


        const verifyUser = verify(token, 'privateKey') as any
        req.user = verifyUser as User

        console.log(verifyUser);


        if (!verifyUser?.resetEmail) {
          throw new ResponseError(401, "Unauthorized")
        }

        next()
      } catch (err) {
        next(err)
      }
    },

    password: async (req, res, next) => {
      try {

        let token = req.params.token
        if (!token) throw new ResponseError(401, "Unauthorizedd")

        console.log(token);


        const verifyUser = verify(token, 'privateKey') as any
        req.user = verifyUser as User

        console.log(verifyUser);


        if (!verifyUser?.resetPassword) {
          throw new ResponseError(401, "Unauthorized")
        }

        next()
      } catch (err) {
        next(err)
      }
    }
  }

}